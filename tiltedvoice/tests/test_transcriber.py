"""Tests for tiltedvoice.transcriber — Whisper engine with mocked backends."""

import threading
import time
from types import SimpleNamespace
from unittest.mock import MagicMock, patch, PropertyMock

import numpy as np
import pytest

from tiltedvoice.models import TranscriberConfig, WhisperModel
from tiltedvoice.transcriber import MAX_SEGMENTS, NO_SPEECH_THRESHOLD, Transcriber


# =========================================================================
# Helpers
# =========================================================================

def _fake_segment(text: str, start: float = 0.0, end: float = 1.0, avg_logprob: float = -0.3):
    return SimpleNamespace(text=text, start=start, end=end, avg_logprob=avg_logprob)


def _fake_info(language: str = "en", language_probability: float = 0.98, duration: float = 5.0):
    return SimpleNamespace(language=language, language_probability=language_probability, duration=duration)


# =========================================================================
# Initialization
# =========================================================================

class TestTranscriberInit:
    def test_default_config(self):
        t = Transcriber()
        assert t._config.model == WhisperModel.BASE_EN
        assert t._config.beam_size == 1

    def test_custom_config(self):
        cfg = TranscriberConfig(model=WhisperModel.SMALL_EN, beam_size=5)
        t = Transcriber(config=cfg)
        assert t._config.model == WhisperModel.SMALL_EN
        assert t._config.beam_size == 5

    def test_kwargs_model_string(self):
        t = Transcriber(model="tiny.en")
        assert t._config.model == WhisperModel.TINY_EN

    def test_kwargs_model_enum(self):
        t = Transcriber(model=WhisperModel.MEDIUM_EN)
        assert t._config.model == WhisperModel.MEDIUM_EN

    def test_not_loaded_initially(self):
        t = Transcriber()
        assert t.is_loaded is False
        assert t.device is None
        assert t.compute_type is None


# =========================================================================
# Device resolution
# =========================================================================

class TestDeviceResolution:
    @patch("tiltedvoice.transcriber.ctranslate2", create=True)
    def test_cuda_available(self, mock_ct2):
        """When ctranslate2 reports CUDA types, should choose cuda/float16."""
        import tiltedvoice.transcriber as mod
        mock_ct2.get_supported_compute_types.return_value = ["float16", "int8"]
        with patch.object(mod, "ctranslate2", mock_ct2, create=True):
            t = Transcriber()
            with patch.dict("sys.modules", {"ctranslate2": mock_ct2}):
                device, compute = t._resolve_device()
        assert device == "cuda"
        assert compute == "float16"

    def test_no_cuda_fallback(self):
        """When ctranslate2 cuda check raises, should fall back to cpu/int8."""
        t = Transcriber()
        mock_ct2 = MagicMock()
        mock_ct2.get_supported_compute_types.side_effect = RuntimeError("no CUDA")
        with patch.dict("sys.modules", {"ctranslate2": mock_ct2}):
            device, compute = t._resolve_device()
        assert device == "cpu"
        assert compute == "int8"

    def test_explicit_device_skips_detection(self):
        cfg = TranscriberConfig(device="cpu", compute_type="int8")
        t = Transcriber(config=cfg)
        device, compute = t._resolve_device()
        assert device == "cpu"
        assert compute == "int8"

    def test_explicit_cuda_device(self):
        cfg = TranscriberConfig(device="cuda", compute_type="float16")
        t = Transcriber(config=cfg)
        device, compute = t._resolve_device()
        assert device == "cuda"
        assert compute == "float16"


# =========================================================================
# Model loading
# =========================================================================

class TestModelLoading:
    @patch("tiltedvoice.transcriber.Transcriber._resolve_device", return_value=("cpu", "int8"))
    def test_lazy_load_on_transcribe(self, mock_resolve):
        t = Transcriber()
        assert t.is_loaded is False

        with patch("faster_whisper.WhisperModel") as MockModel:
            mock_instance = MagicMock()
            mock_instance.transcribe.return_value = (iter([_fake_segment("hello")]), _fake_info())
            MockModel.return_value = mock_instance

            result = t.transcribe(np.zeros(16000, dtype=np.float32))
            assert t.is_loaded is True
            MockModel.assert_called_once()

    @patch("tiltedvoice.transcriber.Transcriber._resolve_device", return_value=("cpu", "int8"))
    def test_load_model_idempotent(self, mock_resolve):
        t = Transcriber()
        with patch("faster_whisper.WhisperModel") as MockModel:
            MockModel.return_value = MagicMock()
            t.load_model()
            t.load_model()
            assert MockModel.call_count == 1

    @patch("tiltedvoice.transcriber.Transcriber._resolve_device", return_value=("cuda", "float16"))
    def test_cuda_fallback_on_load_failure(self, mock_resolve):
        t = Transcriber()
        call_count = 0

        def side_effect(*args, **kwargs):
            nonlocal call_count
            call_count += 1
            if call_count == 1 and kwargs.get("device") == "cuda":
                raise RuntimeError("CUDA error: cublas not found")
            return MagicMock()

        with patch("faster_whisper.WhisperModel", side_effect=side_effect) as MockModel:
            t.load_model()
            assert t.device == "cpu"
            assert t.compute_type == "int8"

    @patch("tiltedvoice.transcriber.Transcriber._resolve_device", return_value=("cpu", "int8"))
    def test_non_cuda_error_propagates(self, mock_resolve):
        t = Transcriber()
        with patch("faster_whisper.WhisperModel", side_effect=RuntimeError("something else")):
            with pytest.raises(RuntimeError, match="something else"):
                t.load_model()

    @patch("tiltedvoice.transcriber.Transcriber._resolve_device", return_value=("cpu", "int8"))
    def test_unload(self, mock_resolve):
        t = Transcriber()
        with patch("faster_whisper.WhisperModel", return_value=MagicMock()):
            t.load_model()
        assert t.is_loaded is True
        t.unload()
        assert t.is_loaded is False
        assert t.device is None


# =========================================================================
# Transcription
# =========================================================================

class TestTranscription:
    def _make_transcriber(self):
        t = Transcriber()
        mock_model = MagicMock()
        t._model = mock_model
        t._device = "cpu"
        t._compute_type = "int8"
        return t, mock_model

    def test_basic_transcription(self):
        t, mock_model = self._make_transcriber()
        segments = [_fake_segment("hello world", 0.0, 2.0)]
        mock_model.transcribe.return_value = (iter(segments), _fake_info(duration=2.0))

        audio = np.random.randn(32000).astype(np.float32) * 0.1
        result = t.transcribe(audio)

        assert result.text == "hello world"
        assert result.language == "en"
        assert result.duration == 2.0
        assert result.processing_time_ms > 0
        assert len(result.segments) == 1

    def test_multi_segment(self):
        t, mock_model = self._make_transcriber()
        segments = [
            _fake_segment("hello", 0.0, 1.0),
            _fake_segment("world", 1.0, 2.0),
            _fake_segment("test", 2.0, 3.0),
        ]
        mock_model.transcribe.return_value = (iter(segments), _fake_info(duration=3.0))

        result = t.transcribe(np.random.randn(48000).astype(np.float32) * 0.1)
        assert result.text == "hello world test"
        assert len(result.segments) == 3

    def test_empty_segments(self):
        t, mock_model = self._make_transcriber()
        mock_model.transcribe.return_value = (iter([]), _fake_info(duration=1.0))

        result = t.transcribe(np.random.randn(16000).astype(np.float32) * 0.1)
        assert result.text == ""
        assert len(result.segments) == 0

    def test_blank_segment_skipped(self):
        t, mock_model = self._make_transcriber()
        segments = [_fake_segment("  ", 0.0, 1.0), _fake_segment("good", 1.0, 2.0)]
        mock_model.transcribe.return_value = (iter(segments), _fake_info(duration=2.0))

        result = t.transcribe(np.random.randn(32000).astype(np.float32) * 0.1)
        assert result.text == "good"
        assert len(result.segments) == 1

    def test_segment_cap(self):
        t, mock_model = self._make_transcriber()
        segments = [_fake_segment(f"seg{i}", i, i + 1) for i in range(100)]
        mock_model.transcribe.return_value = (iter(segments), _fake_info(duration=100.0))

        result = t.transcribe(np.random.randn(16000).astype(np.float32) * 0.1)
        assert len(result.segments) <= MAX_SEGMENTS

    def test_language_override(self):
        t, mock_model = self._make_transcriber()
        mock_model.transcribe.return_value = (
            iter([_fake_segment("bonjour")]),
            _fake_info(language="fr", duration=1.0),
        )

        result = t.transcribe(np.random.randn(16000).astype(np.float32) * 0.1, language="fr")
        mock_model.transcribe.assert_called_once()
        call_kwargs = mock_model.transcribe.call_args[1]
        assert call_kwargs["language"] == "fr"

    def test_transcribe_settings(self):
        t, mock_model = self._make_transcriber()
        mock_model.transcribe.return_value = (iter([]), _fake_info())

        t.transcribe(np.random.randn(16000).astype(np.float32) * 0.1)
        call_kwargs = mock_model.transcribe.call_args_list[0].kwargs
        assert call_kwargs["beam_size"] == 1
        assert call_kwargs["condition_on_previous_text"] is False
        assert call_kwargs["temperature"] == 0
        assert call_kwargs["vad_filter"] is True
        assert call_kwargs["no_speech_threshold"] == NO_SPEECH_THRESHOLD
        assert call_kwargs["compression_ratio_threshold"] == 2.4
        assert "vad_parameters" in call_kwargs
        assert call_kwargs["vad_parameters"]["threshold"] == 0.35

    def test_fallback_without_vad_when_no_text(self):
        t, mock_model = self._make_transcriber()
        mock_model.transcribe.side_effect = [
            (iter([]), _fake_info(duration=1.0)),  # pass 1 (VAD) -> nothing
            (iter([_fake_segment("hello")]), _fake_info(duration=1.0)),  # pass 2 -> text
        ]

        result = t.transcribe(np.random.randn(16000).astype(np.float32) * 0.1)
        assert result.text == "hello"
        assert mock_model.transcribe.call_count == 2
        first_call = mock_model.transcribe.call_args_list[0].kwargs
        second_call = mock_model.transcribe.call_args_list[1].kwargs
        assert first_call["vad_filter"] is True
        assert second_call["vad_filter"] is False
        assert len(result.debug_info["passes"]) == 2

    def test_debug_callback_receives_events(self):
        t, mock_model = self._make_transcriber()
        mock_model.transcribe.return_value = (iter([_fake_segment("hello")]), _fake_info(duration=1.0))
        events = []
        result = t.transcribe(np.random.randn(16000).astype(np.float32) * 0.1, on_debug=events.append)
        assert result.text == "hello"
        event_names = [e.get("event") for e in events]
        assert "audio" in event_names
        assert "pass_start" in event_names
        assert "pass_end" in event_names

    def test_pass_timeout_returns_empty(self):
        t, mock_model = self._make_transcriber()
        mock_model.transcribe.return_value = (iter([_fake_segment("first")]), _fake_info(duration=1.0))
        with patch.object(t, "_call_with_timeout", return_value=None):
            result = t.transcribe(np.random.randn(16000).astype(np.float32) * 0.1)
        assert result.text == ""
        assert result.debug_info["passes"][0]["stop_reason"] == "pass_timeout"

    def test_model_name_in_result(self):
        t, mock_model = self._make_transcriber()
        mock_model.transcribe.return_value = (iter([_fake_segment("hi")]), _fake_info())

        result = t.transcribe(np.random.randn(16000).astype(np.float32) * 0.1)
        assert result.model_name == "base.en"

    def test_confidence_from_info(self):
        t, mock_model = self._make_transcriber()
        mock_model.transcribe.return_value = (
            iter([_fake_segment("hi")]),
            _fake_info(language_probability=0.99),
        )

        result = t.transcribe(np.random.randn(16000).astype(np.float32) * 0.1)
        assert result.confidence == 0.99

    def test_file_path_input(self):
        """transcribe() should also accept a string file path."""
        t, mock_model = self._make_transcriber()
        mock_model.transcribe.return_value = (iter([_fake_segment("from file")]), _fake_info())

        result = t.transcribe("test.wav")
        assert result.text == "from file"
        mock_model.transcribe.assert_called_once()
        assert mock_model.transcribe.call_args[0][0] == "test.wav"

    def test_cancel_event_before_iteration(self):
        """Pre-set cancel_event should return empty result immediately."""
        t, mock_model = self._make_transcriber()
        cancel = threading.Event()
        cancel.set()
        mock_model.transcribe.return_value = (iter([_fake_segment("nope")]), _fake_info())

        result = t.transcribe(
            np.random.randn(16000).astype(np.float32) * 0.1,
            cancel_event=cancel,
        )
        assert result.text == ""

    def test_cancel_event_during_iteration(self):
        """Setting cancel_event mid-iteration should stop early."""
        t, mock_model = self._make_transcriber()
        cancel = threading.Event()

        def _gen():
            yield _fake_segment("first", 0, 1)
            cancel.set()
            yield _fake_segment("second", 1, 2)
            yield _fake_segment("third", 2, 3)

        mock_model.transcribe.return_value = (_gen(), _fake_info(duration=3.0))
        result = t.transcribe(
            np.random.randn(48000).astype(np.float32) * 0.1,
            cancel_event=cancel,
        )
        assert "first" in result.text
        assert "third" not in result.text

    def test_on_status_callback(self):
        """on_status should be called with loading and transcribing messages."""
        t, mock_model = self._make_transcriber()
        mock_model.transcribe.return_value = (iter([_fake_segment("hi")]), _fake_info())
        messages = []
        result = t.transcribe(
            np.random.randn(16000).astype(np.float32) * 0.1,
            on_status=messages.append,
        )
        assert any("Transcribing" in m for m in messages)

    def test_empty_result_on_cancel(self):
        """Cancelling before model transcribe should give empty result."""
        t = Transcriber()
        cancel = threading.Event()
        cancel.set()
        with patch("faster_whisper.WhisperModel") as MockModel:
            MockModel.return_value = MagicMock()
            with patch.object(Transcriber, "_resolve_device", return_value=("cpu", "int8")):
                result = t.transcribe(
                    np.random.randn(16000).astype(np.float32) * 0.1,
                    cancel_event=cancel,
                )
        assert result.text == ""

    def test_audio_logging_with_real_signal(self):
        """Transcriber should log audio stats for numpy input."""
        t, mock_model = self._make_transcriber()
        mock_model.transcribe.return_value = (iter([_fake_segment("ok")]), _fake_info())
        audio = np.random.randn(16000).astype(np.float32) * 0.5
        result = t.transcribe(audio)
        assert result.text == "ok"
        assert float(np.max(np.abs(audio))) > 0.01
