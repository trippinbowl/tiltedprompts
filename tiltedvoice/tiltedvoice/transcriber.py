"""Whisper transcription engine using faster-whisper (CTranslate2 backend, no torch)."""

from __future__ import annotations

import logging
import threading
import time
from concurrent.futures import ThreadPoolExecutor, TimeoutError as FuturesTimeout
from typing import Any, Callable, Dict, Optional, Tuple, Union

import numpy as np

from tiltedvoice.models import (
    TranscriberConfig,
    TranscriptionResult,
    TranscriptionSegment,
    WhisperModel,
)

logger = logging.getLogger(__name__)

_CUDA_ERROR_KEYWORDS = ("cublas", "cuda", "cudnn", "cusparse", "nvcuda")

MAX_SEGMENTS = 50
TRANSCRIBE_TIMEOUT_S = 180.0
NO_SPEECH_THRESHOLD = 0.95


class Transcriber:
    """Whisper speech-to-text engine backed by faster-whisper / CTranslate2.

    Loads the model lazily on first transcribe() call. Automatically detects
    CUDA availability without torch — falls back to CPU int8 on failure.
    """

    def __init__(self, config: Optional[TranscriberConfig] = None, **kwargs):
        if config is not None:
            self._config = config
        else:
            model = kwargs.pop("model", WhisperModel.BASE_EN)
            if isinstance(model, str):
                model = WhisperModel(model) if "." in model else WhisperModel(model + ".en")
            self._config = TranscriberConfig(model=model, **kwargs)

        self._model = None
        self._device: Optional[str] = None
        self._compute_type: Optional[str] = None

    # ------------------------------------------------------------------
    # Device resolution (no torch)
    # ------------------------------------------------------------------

    def _resolve_device(self) -> Tuple[str, str]:
        """Detect best device/compute-type using ctranslate2 directly."""
        if self._config.device != "auto" and self._config.compute_type != "auto":
            return self._config.device, self._config.compute_type

        try:
            import ctranslate2

            cuda_types = ctranslate2.get_supported_compute_types("cuda")
            if cuda_types:
                logger.info("CUDA available — using float16")
                return "cuda", "float16"
        except Exception:
            pass

        logger.info("CUDA not available — using CPU int8")
        return "cpu", "int8"

    # ------------------------------------------------------------------
    # Model loading
    # ------------------------------------------------------------------

    def load_model(self) -> None:
        """Download (if needed) and load the Whisper model."""
        if self._model is not None:
            return

        device, compute_type = self._resolve_device()
        model_name = self._config.model.value

        logger.info("Loading model %s on %s (%s)…", model_name, device, compute_type)
        t0 = time.perf_counter()

        try:
            from faster_whisper import WhisperModel

            self._model = WhisperModel(
                model_name,
                device=device,
                compute_type=compute_type,
            )
            self._device = device
            self._compute_type = compute_type
        except Exception as exc:
            err_lower = str(exc).lower()
            if any(kw in err_lower for kw in _CUDA_ERROR_KEYWORDS) and device == "cuda":
                logger.warning("CUDA load failed (%s) — falling back to CPU int8", exc)
                from faster_whisper import WhisperModel

                self._model = WhisperModel(model_name, device="cpu", compute_type="int8")
                self._device = "cpu"
                self._compute_type = "int8"
            else:
                raise

        elapsed = time.perf_counter() - t0
        logger.info("Model loaded in %.1fs", elapsed)

    # ------------------------------------------------------------------
    # Transcription
    # ------------------------------------------------------------------

    def transcribe(
        self,
        audio: Union[np.ndarray, str],
        language: Optional[str] = None,
        cancel_event: Optional[threading.Event] = None,
        on_status: Optional[Callable[[str], None]] = None,
        on_debug: Optional[Callable[[Dict[str, Any]], None]] = None,
    ) -> TranscriptionResult:
        """Transcribe audio (numpy float32 array or file path) to text.

        Args:
            audio: float32 numpy array or path to audio file.
            language: Override language (default from config).
            cancel_event: Set this event to abort transcription early.
            on_status: Callback ``on_status(msg)`` for progress updates.
        """
        if on_status:
            on_status("Loading model…")
        self.load_model()

        if cancel_event and cancel_event.is_set():
            return self._empty_result(language)

        lang = language or self._config.language

        if isinstance(audio, np.ndarray):
            audio_dur = len(audio) / 16000.0
            rms = float(np.sqrt(np.mean(audio ** 2)))
            peak = float(np.max(np.abs(audio)))
            logger.info(
                "Audio stats: %.2fs, rms=%.5f, peak=%.4f, samples=%d",
                audio_dur, rms, peak, len(audio),
            )
            if peak < 1e-6:
                logger.warning("Audio appears to be silent (peak=%.6f)", peak)
            self._emit_debug(on_debug, event="audio", duration_s=audio_dur, rms=rms, peak=peak)

        if on_status:
            on_status("Transcribing…")

        t0 = time.perf_counter()
        audio_dur_s = self._audio_duration_s(audio)
        total_budget_s = self._total_timeout_for_audio(audio_dur_s)
        self._emit_debug(
            on_debug,
            event="timeout_budget",
            audio_duration_s=audio_dur_s,
            total_budget_s=total_budget_s,
        )

        # First pass: VAD enabled (fast and usually correct).
        result = self._run_transcribe_pass(
            audio=audio,
            language=lang,
            use_vad=True,
            cancel_event=cancel_event,
            on_debug=on_debug,
            budget_s=total_budget_s,
            audio_dur_s=audio_dur_s,
        )
        all_passes = list(result["passes"])

        # Fallback pass: if VAD drops everything but audio energy is clearly present,
        # retry once without VAD.
        if (
            not result["texts"]
            and isinstance(audio, np.ndarray)
            and float(np.sqrt(np.mean(audio ** 2))) >= 0.003
            and not (cancel_event and cancel_event.is_set())
        ):
            remaining_s = max(5.0, total_budget_s - (time.perf_counter() - t0))
            logger.warning("No text with VAD enabled; retrying without VAD")
            retry = self._run_transcribe_pass(
                audio=audio,
                language=lang,
                use_vad=False,
                cancel_event=cancel_event,
                on_debug=on_debug,
                budget_s=remaining_s,
                audio_dur_s=audio_dur_s,
            )
            all_passes.extend(retry["passes"])
            if retry["texts"]:
                result = retry
        result["passes"] = all_passes

        processing_ms = (time.perf_counter() - t0) * 1000
        full_text = " ".join(result["texts"])
        duration = result["duration"]

        logger.info(
            "Transcribed %d segments in %.0fms (%.1fs audio)",
            len(result["segments"]),
            processing_ms,
            duration,
        )

        return TranscriptionResult(
            text=full_text,
            language=result["language"],
            confidence=result["confidence"],
            duration=duration,
            processing_time_ms=processing_ms,
            segments=result["segments"],
            model_name=self._config.model.value,
            debug_info={
                "audio": result["audio"],
                "passes": result["passes"],
                "selected_pass": result["pass_name"],
                "processing_time_ms": processing_ms,
            },
        )

    def _run_transcribe_pass(self, audio, language, use_vad, cancel_event, on_debug, budget_s, audio_dur_s):
        vad_params = dict(
            threshold=0.35,
            min_speech_duration_ms=200,
            min_silence_duration_ms=300,
            speech_pad_ms=250,
        )
        pass_name = "vad_on" if use_vad else "vad_off"
        pass_debug = {
            "name": pass_name,
            "use_vad": bool(use_vad),
            "stop_reason": "eof",
            "segment_count": 0,
            "elapsed_ms": 0.0,
        }
        self._emit_debug(on_debug, event="pass_start", pass_name=pass_name, use_vad=bool(use_vad))
        pass_timeout_s = min(TRANSCRIBE_TIMEOUT_S, budget_s)
        self._emit_debug(on_debug, event="engine_call_start", pass_name=pass_name, timeout_s=pass_timeout_s)
        decode = self._call_with_timeout(
            lambda: self._decode_pass(
                audio=audio,
                language=language,
                use_vad=use_vad,
                vad_params=vad_params,
                cancel_event=cancel_event,
                timeout_s=pass_timeout_s,
            ),
            timeout_s=pass_timeout_s,
        )
        if decode is None:
            pass_debug["stop_reason"] = "pass_timeout"
            pass_debug["elapsed_ms"] = pass_timeout_s * 1000.0
            self._emit_debug(on_debug, event="pass_end", **pass_debug)
            return {
                "texts": [],
                "segments": [],
                "language": language,
                "confidence": 0.0,
                "duration": audio_dur_s,
                "passes": [pass_debug],
                "pass_name": pass_name,
                "audio": {},
            }
        self._emit_debug(on_debug, event="engine_call_end", pass_name=pass_name)
        texts = decode["texts"]
        segments = decode["segments"]
        pass_debug["segment_count"] = len(segments)
        pass_debug["stop_reason"] = decode["stop_reason"]
        pass_debug["elapsed_ms"] = decode["elapsed_ms"]
        self._emit_debug(on_debug, event="pass_end", **pass_debug)
        audio_debug = {}
        if isinstance(audio, np.ndarray):
            audio_debug = {
                "duration_s": len(audio) / 16000.0,
                "rms": float(np.sqrt(np.mean(audio ** 2))),
                "peak": float(np.max(np.abs(audio))),
                "samples": int(len(audio)),
            }

        return {
            "texts": texts,
            "segments": segments,
            "language": decode["language"],
            "confidence": decode["confidence"],
            "duration": decode["duration"],
            "passes": [pass_debug],
            "pass_name": pass_name,
            "audio": audio_debug,
        }

    def _decode_pass(self, audio, language, use_vad, vad_params, cancel_event, timeout_s):
        t0 = time.perf_counter()
        segments_gen, info = self._model.transcribe(
            audio,
            language=language,
            beam_size=self._config.beam_size,
            vad_filter=bool(use_vad),
            vad_parameters=vad_params if use_vad else None,
            condition_on_previous_text=False,
            temperature=0,
            no_speech_threshold=NO_SPEECH_THRESHOLD,
            compression_ratio_threshold=2.4,
            log_prob_threshold=-1.0,
            word_timestamps=self._config.word_timestamps,
        )

        segments: list[TranscriptionSegment] = []
        texts: list[str] = []
        stop_reason = "eof"
        for seg in segments_gen:
            if cancel_event and cancel_event.is_set():
                stop_reason = "cancelled"
                break
            if len(segments) >= MAX_SEGMENTS:
                stop_reason = "segment_cap"
                break
            if (time.perf_counter() - t0) > timeout_s:
                stop_reason = "hard_timeout"
                break
            text = seg.text.strip()
            if text:
                texts.append(text)
                segments.append(
                    TranscriptionSegment(
                        text=text,
                        start=seg.start,
                        end=seg.end,
                        confidence=getattr(seg, "avg_logprob", 0.0),
                    )
                )
        elapsed_ms = (time.perf_counter() - t0) * 1000
        return {
            "texts": texts,
            "segments": segments,
            "language": (getattr(info, "language", language) or language),
            "confidence": (getattr(info, "language_probability", 0.0) or 0.0),
            "duration": (getattr(info, "duration", 0.0) or 0.0),
            "stop_reason": stop_reason,
            "elapsed_ms": elapsed_ms,
        }

    @staticmethod
    def _audio_duration_s(audio: Union[np.ndarray, str]) -> float:
        if isinstance(audio, np.ndarray):
            return max(0.0, float(len(audio) / 16000.0))
        return 15.0

    @staticmethod
    def _total_timeout_for_audio(audio_dur_s: float) -> float:
        # Slow CPUs can take >2x real-time for first-segment decode.
        return min(240.0, max(60.0, (audio_dur_s * 8.0) + 25.0))

    @staticmethod
    def _call_with_timeout(fn: Callable[[], Any], timeout_s: float) -> Optional[Any]:
        pool = ThreadPoolExecutor(max_workers=1, thread_name_prefix="tv-call")
        future = pool.submit(fn)
        try:
            return future.result(timeout=timeout_s)
        except FuturesTimeout:
            logger.warning("Engine call timed out after %.1fs", timeout_s)
            future.cancel()
            return None
        finally:
            pool.shutdown(wait=False, cancel_futures=True)

    @staticmethod
    def _emit_debug(on_debug: Optional[Callable[[Dict[str, Any]], None]], **event: Any) -> None:
        if not on_debug:
            return
        try:
            on_debug(event)
        except Exception:
            pass

    # ------------------------------------------------------------------
    # Helpers
    # ------------------------------------------------------------------

    def _empty_result(self, language=None):
        lang = language or self._config.language
        return TranscriptionResult(
            text="",
            language=lang,
            model_name=self._config.model.value,
        )

    @property
    def is_loaded(self) -> bool:
        return self._model is not None

    @property
    def device(self) -> Optional[str]:
        return self._device

    @property
    def compute_type(self) -> Optional[str]:
        return self._compute_type

    def unload(self) -> None:
        """Release the model from memory."""
        self._model = None
        self._device = None
        self._compute_type = None
        logger.info("Model unloaded")
