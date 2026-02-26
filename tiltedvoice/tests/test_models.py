"""Tests for tiltedvoice.models — enums, dataclasses, computed properties."""

import pytest

from tiltedvoice.models import (
    AppSettings,
    AudioConfig,
    HotkeyConfig,
    RecordingMode,
    TranscriberConfig,
    TranscriptionResult,
    TranscriptionSegment,
    WhisperModel,
)


# =========================================================================
# WhisperModel enum
# =========================================================================

class TestWhisperModel:
    def test_tiny_en_value(self):
        assert WhisperModel.TINY_EN.value == "tiny.en"

    def test_base_en_value(self):
        assert WhisperModel.BASE_EN.value == "base.en"

    def test_small_en_value(self):
        assert WhisperModel.SMALL_EN.value == "small.en"

    def test_medium_en_value(self):
        assert WhisperModel.MEDIUM_EN.value == "medium.en"

    def test_model_count(self):
        assert len(WhisperModel) == 4

    def test_display_name_contains_size(self):
        assert "75" in WhisperModel.TINY_EN.display_name
        assert "142" in WhisperModel.BASE_EN.display_name

    def test_size_mb(self):
        assert WhisperModel.TINY_EN.size_mb == 75
        assert WhisperModel.MEDIUM_EN.size_mb == 1500

    def test_from_string(self):
        m = WhisperModel("base.en")
        assert m is WhisperModel.BASE_EN

    def test_invalid_raises(self):
        with pytest.raises(ValueError):
            WhisperModel("nonexistent")

    def test_is_str_subclass(self):
        assert isinstance(WhisperModel.TINY_EN, str)


# =========================================================================
# RecordingMode enum
# =========================================================================

class TestRecordingMode:
    def test_ptt_value(self):
        assert RecordingMode.PUSH_TO_TALK.value == "push-to-talk"

    def test_toggle_value(self):
        assert RecordingMode.TOGGLE.value == "toggle"

    def test_auto_value(self):
        assert RecordingMode.AUTO.value == "auto"

    def test_mode_count(self):
        assert len(RecordingMode) == 3

    def test_display_name(self):
        assert "Push" in RecordingMode.PUSH_TO_TALK.display_name
        assert "Toggle" in RecordingMode.TOGGLE.display_name
        assert "Auto" in RecordingMode.AUTO.display_name


# =========================================================================
# TranscriptionSegment
# =========================================================================

class TestTranscriptionSegment:
    def test_defaults(self):
        seg = TranscriptionSegment(text="hello", start=0.0, end=1.0)
        assert seg.confidence == 0.0

    def test_custom_confidence(self):
        seg = TranscriptionSegment(text="hi", start=0.0, end=0.5, confidence=0.95)
        assert seg.confidence == 0.95


# =========================================================================
# TranscriptionResult
# =========================================================================

class TestTranscriptionResult:
    def test_defaults(self):
        r = TranscriptionResult(text="hello world")
        assert r.language == "en"
        assert r.confidence == 0.0
        assert r.duration == 0.0
        assert r.processing_time_ms == 0.0
        assert r.segments == []
        assert r.model_name == ""
        assert r.debug_info == {}

    def test_wpm_normal(self):
        r = TranscriptionResult(text="one two three four five", duration=6.0)
        assert r.words_per_minute == pytest.approx(50.0)

    def test_wpm_zero_duration(self):
        r = TranscriptionResult(text="hello", duration=0.0)
        assert r.words_per_minute == 0.0

    def test_wpm_empty_text(self):
        r = TranscriptionResult(text="", duration=5.0)
        assert r.words_per_minute == 0.0

    def test_wpm_whitespace_only(self):
        r = TranscriptionResult(text="   ", duration=5.0)
        assert r.words_per_minute == 0.0

    def test_with_segments(self):
        segs = [TranscriptionSegment("hi", 0.0, 0.5), TranscriptionSegment("there", 0.5, 1.0)]
        r = TranscriptionResult(text="hi there", segments=segs, duration=1.0)
        assert len(r.segments) == 2
        assert r.words_per_minute == pytest.approx(120.0)


# =========================================================================
# AudioConfig
# =========================================================================

class TestAudioConfig:
    def test_defaults(self):
        c = AudioConfig()
        assert c.sample_rate == 16_000
        assert c.channels == 1
        assert c.dtype == "float32"
        assert c.energy_threshold == 0.01

    def test_custom(self):
        c = AudioConfig(sample_rate=44100, channels=2, energy_threshold=0.05)
        assert c.sample_rate == 44100
        assert c.channels == 2


# =========================================================================
# TranscriberConfig
# =========================================================================

class TestTranscriberConfig:
    def test_defaults(self):
        c = TranscriberConfig()
        assert c.model == WhisperModel.BASE_EN
        assert c.language == "en"
        assert c.device == "auto"
        assert c.compute_type == "auto"
        assert c.beam_size == 1
        assert c.vad_filter is True
        assert c.vad_threshold == 0.5
        assert c.word_timestamps is False

    def test_custom_model(self):
        c = TranscriberConfig(model=WhisperModel.SMALL_EN, beam_size=5)
        assert c.model == WhisperModel.SMALL_EN
        assert c.beam_size == 5


# =========================================================================
# HotkeyConfig
# =========================================================================

class TestHotkeyConfig:
    def test_defaults(self):
        h = HotkeyConfig()
        assert h.push_to_talk == "ctrl+shift+space"
        assert h.toggle == "ctrl+shift+r"


# =========================================================================
# AppSettings
# =========================================================================

class TestAppSettings:
    def test_defaults(self):
        s = AppSettings()
        assert s.model == WhisperModel.BASE_EN
        assert s.language == "en"
        assert s.recording_mode == RecordingMode.PUSH_TO_TALK
        assert s.auto_paste is True
        assert s.auto_copy is True
        assert s.energy_threshold == 0.01
        assert s.silence_ms == 1200

    def test_custom_settings(self):
        s = AppSettings(
            model=WhisperModel.SMALL_EN,
            recording_mode=RecordingMode.AUTO,
            auto_paste=False,
            silence_ms=2000,
        )
        assert s.model == WhisperModel.SMALL_EN
        assert s.recording_mode == RecordingMode.AUTO
        assert s.auto_paste is False
        assert s.silence_ms == 2000

    def test_hotkey_config_nested(self):
        s = AppSettings(hotkeys=HotkeyConfig(push_to_talk="ctrl+alt+p"))
        assert s.hotkeys.push_to_talk == "ctrl+alt+p"
