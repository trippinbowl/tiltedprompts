"""Audio recording utilities — microphone management and voice recording with energy-based VAD."""

from __future__ import annotations

import logging
import threading
import time
from typing import Callable, Dict, List, Optional

import numpy as np
import sounddevice as sd

from tiltedvoice.models import AudioConfig

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Microphone Manager
# ---------------------------------------------------------------------------

class MicrophoneManager:
    """Enumerate, test, and monitor audio input devices."""

    _PREFERRED_KEYWORDS = ("microphone", "headset", "mic")
    _AVOID_KEYWORDS = ("sound mapper", "stereo mix", "virtual", "output")

    def __init__(self, config: Optional[AudioConfig] = None):
        self._config = config or AudioConfig()
        self._monitor_thread: Optional[threading.Thread] = None
        self._monitor_stop = threading.Event()

    def list_devices(self) -> List[Dict]:
        """Return input devices with index, name, and max channels."""
        devices = sd.query_devices()
        result = []
        for idx, dev in enumerate(devices):
            if dev["max_input_channels"] > 0:
                result.append({
                    "index": idx,
                    "name": dev["name"],
                    "channels": dev["max_input_channels"],
                    "sample_rate": dev["default_samplerate"],
                })
        return result

    def get_default_device(self) -> Optional[Dict]:
        """Pick the best input device with a simple score heuristic."""
        devices = self.list_devices()
        if not devices:
            return None

        best = None
        best_score = float("-inf")
        for dev in devices:
            name_lower = dev["name"].lower()
            score = 0
            if any(kw in name_lower for kw in self._PREFERRED_KEYWORDS):
                score += 10
            if any(kw in name_lower for kw in self._AVOID_KEYWORDS):
                score -= 20
            # Prefer mono/stereo input devices over larger channel counts.
            channels = int(dev.get("channels") or 0)
            if channels in (1, 2):
                score += 2
            if score > best_score:
                best_score = score
                best = dev
        return best or devices[0]

    def test_device(self, device_index: Optional[int] = None, duration: float = 0.5) -> float:
        """Record briefly and return peak amplitude (0.0–1.0)."""
        try:
            audio = sd.rec(
                int(duration * self._config.sample_rate),
                samplerate=self._config.sample_rate,
                channels=self._config.channels,
                dtype=self._config.dtype,
                device=device_index,
            )
            sd.wait()
            return float(np.max(np.abs(audio)))
        except Exception as exc:
            logger.error("Device test failed: %s", exc)
            return 0.0

    def start_level_monitor(
        self,
        callback: Callable[[float], None],
        device_index: Optional[int] = None,
        interval: float = 0.05,
    ) -> None:
        """Start a background thread that pushes RMS levels to *callback*."""
        self.stop_level_monitor()
        self._monitor_stop.clear()

        def _run():
            try:
                with sd.InputStream(
                    samplerate=self._config.sample_rate,
                    channels=self._config.channels,
                    dtype=self._config.dtype,
                    device=device_index,
                    blocksize=int(self._config.sample_rate * interval),
                ) as stream:
                    while not self._monitor_stop.is_set():
                        data, _ = stream.read(int(self._config.sample_rate * interval))
                        rms = float(np.sqrt(np.mean(data ** 2)))
                        try:
                            callback(rms)
                        except Exception:
                            pass
            except Exception as exc:
                logger.error("Level monitor error: %s", exc)

        self._monitor_thread = threading.Thread(target=_run, daemon=True)
        self._monitor_thread.start()

    def stop_level_monitor(self) -> None:
        self._monitor_stop.set()
        if self._monitor_thread and self._monitor_thread.is_alive():
            self._monitor_thread.join(timeout=2)
        self._monitor_thread = None


# ---------------------------------------------------------------------------
# Voice Recorder
# ---------------------------------------------------------------------------

class VoiceRecorder:
    """Record audio from the microphone with energy-based VAD.

    Supports two usage patterns:
    - **Manual**: call start_manual_recording() / stop_manual_recording()
    - **Auto-listen**: call start_auto_listen() with callbacks
    """

    MAX_DURATION_S = 30.0
    MIN_DURATION_S = 0.3

    def __init__(
        self,
        config: Optional[AudioConfig] = None,
        device_index: Optional[int] = None,
        silence_ms: int = 1200,
    ):
        self._config = config or AudioConfig()
        self._device_index = device_index
        self._silence_ms = silence_ms

        self._chunks: list[np.ndarray] = []
        self._recording = False
        self._stream: Optional[sd.InputStream] = None
        self._lock = threading.Lock()

        # Auto-listen state
        self._auto_listening = False
        self._speech_active = False
        self._silence_start: Optional[float] = None
        self._on_speech_start: Optional[Callable] = None
        self._on_speech_end: Optional[Callable] = None
        self._on_audio_ready: Optional[Callable[[np.ndarray], None]] = None
        self._record_start_time: Optional[float] = None

    # ---- Manual recording ---------------------------------------------------

    def start_manual_recording(self) -> None:
        """Begin capturing audio. Call stop_manual_recording() to finish."""
        with self._lock:
            if self._recording:
                return
            self._chunks.clear()
            self._recording = True
            self._record_start_time = time.monotonic()

        blocksize = int(self._config.sample_rate * 0.1)  # 100 ms blocks

        def _cb(indata, frames, time_info, status):
            if status:
                logger.debug("Audio status: %s", status)
            with self._lock:
                if not self._recording:
                    return
                if self._record_start_time and (time.monotonic() - self._record_start_time) > self.MAX_DURATION_S:
                    self._recording = False
                    return
                self._chunks.append(indata.copy())

        self._stream = sd.InputStream(
            samplerate=self._config.sample_rate,
            channels=self._config.channels,
            dtype=self._config.dtype,
            device=self._device_index,
            blocksize=blocksize,
            callback=_cb,
        )
        self._stream.start()
        logger.info("Manual recording started")

    def stop_manual_recording(self) -> Optional[np.ndarray]:
        """Stop recording and return the captured numpy array (or None)."""
        with self._lock:
            self._recording = False

        if self._stream:
            try:
                self._stream.stop()
                self._stream.close()
            except Exception:
                pass
            self._stream = None

        with self._lock:
            if not self._chunks:
                return None
            audio = np.concatenate(self._chunks, axis=0).flatten()
            self._chunks.clear()

        duration = len(audio) / self._config.sample_rate
        if duration < self.MIN_DURATION_S:
            logger.info("Recording too short (%.2fs) — discarded", duration)
            return None

        logger.info("Manual recording stopped — %.2fs captured", duration)
        return audio

    # ---- Auto-listen --------------------------------------------------------

    def start_auto_listen(
        self,
        on_speech_start: Optional[Callable] = None,
        on_speech_end: Optional[Callable] = None,
        on_audio_ready: Optional[Callable[[np.ndarray], None]] = None,
    ) -> None:
        """Start energy-based auto-listen that fires callbacks on speech boundaries."""
        self.stop_auto_listen()

        self._on_speech_start = on_speech_start
        self._on_speech_end = on_speech_end
        self._on_audio_ready = on_audio_ready
        self._auto_listening = True
        self._speech_active = False
        self._silence_start = None
        self._chunks.clear()
        self._record_start_time = None

        blocksize = int(self._config.sample_rate * 0.1)

        def _cb(indata, frames, time_info, status):
            if not self._auto_listening:
                return

            rms = float(np.sqrt(np.mean(indata ** 2)))
            now = time.monotonic()

            if rms >= self._config.energy_threshold:
                # Speech detected
                if not self._speech_active:
                    self._speech_active = True
                    self._chunks.clear()
                    self._record_start_time = now
                    self._silence_start = None
                    if self._on_speech_start:
                        try:
                            self._on_speech_start()
                        except Exception:
                            pass
                else:
                    self._silence_start = None

                self._chunks.append(indata.copy())

                if self._record_start_time and (now - self._record_start_time) > self.MAX_DURATION_S:
                    self._finalize_auto()
            elif self._speech_active:
                self._chunks.append(indata.copy())
                if self._silence_start is None:
                    self._silence_start = now
                elif (now - self._silence_start) * 1000 >= self._silence_ms:
                    self._finalize_auto()

        self._stream = sd.InputStream(
            samplerate=self._config.sample_rate,
            channels=self._config.channels,
            dtype=self._config.dtype,
            device=self._device_index,
            blocksize=blocksize,
            callback=_cb,
        )
        self._stream.start()
        logger.info("Auto-listen started (threshold=%.4f, silence=%dms)",
                     self._config.energy_threshold, self._silence_ms)

    def _finalize_auto(self) -> None:
        """Package captured audio and fire on_audio_ready."""
        self._speech_active = False
        self._silence_start = None

        if self._on_speech_end:
            try:
                self._on_speech_end()
            except Exception:
                pass

        chunks = list(self._chunks)
        self._chunks.clear()
        self._record_start_time = None

        if not chunks:
            return

        audio = np.concatenate(chunks, axis=0).flatten()
        duration = len(audio) / self._config.sample_rate
        if duration < self.MIN_DURATION_S:
            logger.info("Auto-listen clip too short (%.2fs) — discarded", duration)
            return

        logger.info("Auto-listen captured %.2fs of speech", duration)
        if self._on_audio_ready:
            try:
                self._on_audio_ready(audio)
            except Exception as exc:
                logger.error("on_audio_ready callback error: %s", exc)

    def stop_auto_listen(self) -> None:
        self._auto_listening = False
        self._speech_active = False
        if self._stream:
            try:
                self._stream.stop()
                self._stream.close()
            except Exception:
                pass
            self._stream = None

    # ---- State helpers ------------------------------------------------------

    @property
    def is_recording(self) -> bool:
        return self._recording

    @property
    def is_auto_listening(self) -> bool:
        return self._auto_listening
