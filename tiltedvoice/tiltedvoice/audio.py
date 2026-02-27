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


def _to_float32(data: np.ndarray, source_dtype: str) -> np.ndarray:
    """Convert audio data from any dtype to float32 in [-1.0, 1.0] range."""
    if data.dtype == np.float32:
        return data
    if source_dtype == "int16" or data.dtype == np.int16:
        return data.astype(np.float32) / 32768.0
    if source_dtype == "int32" or data.dtype == np.int32:
        return data.astype(np.float32) / 2147483648.0
    return data.astype(np.float32)


def _is_valid_audio(data: np.ndarray) -> bool:
    """Check if recorded audio data is valid (not NaN/inf/garbage)."""
    if data.size == 0:
        return False
    peak = float(np.max(np.abs(data)))
    return not np.isnan(peak) and not np.isinf(peak) and peak < 2.0


# ---------------------------------------------------------------------------
# Microphone Manager
# ---------------------------------------------------------------------------

class MicrophoneManager:
    """Enumerate, test, and monitor audio input devices."""

    _PREFERRED_KEYWORDS = ("microphone", "headset", "mic")
    _AVOID_KEYWORDS = ("sound mapper", "stereo mix", "virtual", "output")
    # Preferred host APIs in order (WASAPI > DirectSound > MME > WDM-KS)
    _PREFERRED_APIS = ("wasapi", "directsound", "mme", "wdm")
    # Formats to try in order of preference
    _DTYPE_FALLBACK = ("float32", "int16", "int32")

    def __init__(self, config: Optional[AudioConfig] = None):
        self._config = config or AudioConfig()
        self._monitor_thread: Optional[threading.Thread] = None
        self._monitor_stop = threading.Event()
        # Cache: device_index -> working dtype and sample rate (probed)
        self._probed_dtypes: Dict[int, str] = {}
        self._probed_rates: Dict[int, int] = {}

    def list_devices(self) -> List[Dict]:
        """Return input devices with index, name, and max channels."""
        devices = sd.query_devices()
        try:
            hostapis = sd.query_hostapis()
        except Exception:
            hostapis = []
        result = []
        for idx, dev in enumerate(devices):
            if dev["max_input_channels"] > 0:
                api_idx = dev.get("hostapi")
                if api_idx is not None and isinstance(hostapis, (list, tuple)) and api_idx < len(hostapis):
                    api_name = hostapis[api_idx]["name"]
                else:
                    api_name = "Unknown"
                result.append({
                    "index": idx,
                    "name": dev["name"],
                    "channels": dev["max_input_channels"],
                    "sample_rate": dev["default_samplerate"],
                    "hostapi": api_name,
                })
        return result

    def probe_device(self, device_index: int, sample_rate: Optional[int] = None) -> Optional[str]:
        """Try opening a device with different dtypes and sample rates.

        Returns the working dtype or None.
        Results are cached so subsequent calls for the same device are instant.
        """
        if device_index in self._probed_dtypes:
            return self._probed_dtypes[device_index]

        # Try the requested rate first, then the device's native rate
        rates_to_try = []
        if sample_rate:
            rates_to_try.append(sample_rate)
        rates_to_try.append(self._config.sample_rate)

        # Also try the device's native sample rate
        try:
            dev_info = sd.query_devices(device_index)
            native_rate = int(dev_info.get("default_samplerate", 0))
            if native_rate and native_rate not in rates_to_try:
                rates_to_try.append(native_rate)
        except Exception:
            pass

        # Add common rates as fallback
        for common_rate in (44100, 48000, 16000):
            if common_rate not in rates_to_try:
                rates_to_try.append(common_rate)

        for rate in rates_to_try:
            for dtype in self._DTYPE_FALLBACK:
                try:
                    frames = int(rate * 0.25)  # 250ms test
                    audio = sd.rec(frames, samplerate=rate, channels=1, dtype=dtype, device=device_index)
                    sd.wait()
                    # Convert to float32 for validation
                    f32 = _to_float32(audio, dtype)
                    if _is_valid_audio(f32):
                        logger.info("Device %d works with dtype=%s @ %dHz", device_index, dtype, rate)
                        self._probed_dtypes[device_index] = dtype
                        # Store the working sample rate too
                        self._probed_rates[device_index] = rate
                        return dtype
                    else:
                        logger.debug("Device %d dtype=%s @ %dHz returned invalid data", device_index, dtype, rate)
                except Exception as exc:
                    logger.debug("Device %d dtype=%s @ %dHz failed: %s", device_index, dtype, rate, exc)
        return None

    def get_working_dtype(self, device_index: int) -> str:
        """Return the probed working dtype for a device, or the default dtype."""
        return self._probed_dtypes.get(device_index, self._config.dtype)

    def get_working_sample_rate(self, device_index: int) -> int:
        """Return the probed working sample rate for a device, or the default."""
        return self._probed_rates.get(device_index, self._config.sample_rate)

    def get_default_device(self) -> Optional[Dict]:
        """Pick the best input device with a score heuristic and live probing."""
        devices = self.list_devices()
        if not devices:
            return None

        best = None
        best_score = float("-inf")
        for dev in devices:
            name_lower = dev["name"].lower()
            api_lower = dev.get("hostapi", "").lower()
            score = 0

            # Prefer real microphones
            if any(kw in name_lower for kw in self._PREFERRED_KEYWORDS):
                score += 10
            if any(kw in name_lower for kw in self._AVOID_KEYWORDS):
                score -= 20

            # Prefer modern host APIs
            for rank, api_kw in enumerate(reversed(self._PREFERRED_APIS)):
                if api_kw in api_lower:
                    score += (rank + 1) * 3
                    break

            # Prefer mono/stereo
            channels = int(dev.get("channels") or 0)
            if channels in (1, 2):
                score += 2

            if score > best_score:
                best_score = score
                best = dev

        return best or devices[0]

    def get_best_working_device(self) -> Optional[Dict]:
        """Find the best device that actually produces valid audio.

        Probes candidates in score order and returns the first that works.
        Falls back to get_default_device() if probing is inconclusive.
        """
        devices = self.list_devices()
        if not devices:
            return None

        # Sort by heuristic score (best first)
        def _score(dev: Dict) -> float:
            name_lower = dev["name"].lower()
            api_lower = dev.get("hostapi", "").lower()
            s = 0.0
            if any(kw in name_lower for kw in self._PREFERRED_KEYWORDS):
                s += 10
            if any(kw in name_lower for kw in self._AVOID_KEYWORDS):
                s -= 20
            for rank, api_kw in enumerate(reversed(self._PREFERRED_APIS)):
                if api_kw in api_lower:
                    s += (rank + 1) * 3
                    break
            channels = int(dev.get("channels") or 0)
            if channels in (1, 2):
                s += 2
            return s

        candidates = sorted(devices, key=_score, reverse=True)

        for dev in candidates:
            dtype = self.probe_device(dev["index"])
            if dtype:
                logger.info("Best working device: [%d] %s (dtype=%s, api=%s)",
                            dev["index"], dev["name"], dtype, dev.get("hostapi"))
                return dev

        logger.warning("No working input device found during probing, falling back to heuristic")
        return self.get_default_device()

    def test_device(self, device_index: Optional[int] = None, duration: float = 0.5) -> float:
        """Record briefly and return peak amplitude (0.0–1.0)."""
        try:
            # Use probed dtype if available, otherwise try float32 with fallback
            dtype = self.get_working_dtype(device_index) if device_index is not None else self._config.dtype
            audio = sd.rec(
                int(duration * self._config.sample_rate),
                samplerate=self._config.sample_rate,
                channels=self._config.channels,
                dtype=dtype,
                device=device_index,
            )
            sd.wait()
            f32 = _to_float32(audio, dtype)
            if _is_valid_audio(f32):
                return float(np.max(np.abs(f32)))
            # float32 returned garbage — try probing
            if device_index is not None:
                working_dtype = self.probe_device(device_index)
                if working_dtype and working_dtype != dtype:
                    audio = sd.rec(
                        int(duration * self._config.sample_rate),
                        samplerate=self._config.sample_rate,
                        channels=self._config.channels,
                        dtype=working_dtype,
                        device=device_index,
                    )
                    sd.wait()
                    f32 = _to_float32(audio, working_dtype)
                    if _is_valid_audio(f32):
                        return float(np.max(np.abs(f32)))
            return 0.0
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

        dtype = self.get_working_dtype(device_index) if device_index is not None else self._config.dtype
        rate = self.get_working_sample_rate(device_index) if device_index is not None else self._config.sample_rate
        chunk_frames = max(int(rate * interval), 800)

        def _run():
            try:
                while not self._monitor_stop.is_set():
                    data = sd.rec(
                        chunk_frames,
                        samplerate=rate,
                        channels=self._config.channels,
                        dtype=dtype,
                        device=device_index,
                        blocking=True,
                    )
                    f32 = _to_float32(data, dtype)
                    if _is_valid_audio(f32):
                        rms = float(np.sqrt(np.mean(f32 ** 2)))
                    else:
                        rms = 0.0
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

    Uses a blocking-read thread approach (compatible with all host APIs
    including WDM-KS on Windows Server) with automatic fallback from
    callback-based streams when they don't work.

    Audio is always returned as float32 regardless of the hardware dtype.
    """

    MAX_DURATION_S = 30.0
    MIN_DURATION_S = 0.3

    def __init__(
        self,
        config: Optional[AudioConfig] = None,
        device_index: Optional[int] = None,
        silence_ms: int = 1200,
        device_dtype: Optional[str] = None,
    ):
        self._config = config or AudioConfig()
        self._device_index = device_index
        self._silence_ms = silence_ms
        # The dtype to use when opening the stream.  If None, uses config.dtype.
        self._device_dtype = device_dtype or self._config.dtype

        self._chunks: list[np.ndarray] = []
        self._recording = False
        self._stream: Optional[sd.InputStream] = None
        self._record_thread: Optional[threading.Thread] = None
        self._lock = threading.Lock()
        self._stop_event = threading.Event()

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
        """Begin capturing audio. Call stop_manual_recording() to finish.

        Uses successive sd.rec() calls in a thread (compatible with all
        host APIs including WDM-KS on Windows Server where InputStream
        callbacks and blocking reads can fail).
        """
        with self._lock:
            if self._recording:
                return
            self._chunks.clear()
            self._recording = True
            self._record_start_time = time.monotonic()

        self._stop_event.clear()
        dtype = self._device_dtype
        rate = self._config.sample_rate
        chunk_frames = int(rate * 0.5)  # 500ms chunks via sd.rec

        def _rec_loop():
            """Thread that records audio using sd.rec() in a loop."""
            try:
                while not self._stop_event.is_set():
                    data = sd.rec(
                        chunk_frames,
                        samplerate=rate,
                        channels=self._config.channels,
                        dtype=dtype,
                        device=self._device_index,
                        blocking=True,
                    )
                    with self._lock:
                        if not self._recording:
                            break
                        if self._record_start_time and (time.monotonic() - self._record_start_time) > self.MAX_DURATION_S:
                            self._recording = False
                            break
                        self._chunks.append(data.copy())
            except Exception as exc:
                logger.error("Recording thread error: %s", exc)
                with self._lock:
                    self._recording = False

        self._record_thread = threading.Thread(target=_rec_loop, daemon=True)
        self._record_thread.start()
        logger.info("Manual recording started (device=%s, dtype=%s)", self._device_index, dtype)

    def stop_manual_recording(self) -> Optional[np.ndarray]:
        """Stop recording and return the captured float32 numpy array (or None)."""
        with self._lock:
            self._recording = False
        self._stop_event.set()
        try:
            sd.stop()  # Interrupt any in-progress sd.rec()
        except Exception:
            pass

        if self._record_thread and self._record_thread.is_alive():
            self._record_thread.join(timeout=3)
        self._record_thread = None

        with self._lock:
            if not self._chunks:
                return None
            audio = np.concatenate(self._chunks, axis=0).flatten()
            self._chunks.clear()

        # Always return float32 regardless of capture dtype
        audio = _to_float32(audio, self._device_dtype)

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
        self._stop_event.clear()

        dtype = self._device_dtype
        rate = self._config.sample_rate

        def _auto_read():
            """Thread that reads audio using sd.rec() for auto-listen VAD."""
            chunk_frames = int(rate * 0.1)  # 100ms chunks for responsive VAD
            try:
                while not self._stop_event.is_set() and self._auto_listening:
                    data = sd.rec(
                        chunk_frames,
                        samplerate=rate,
                        channels=self._config.channels,
                        dtype=dtype,
                        device=self._device_index,
                        blocking=True,
                    )

                    # Convert to float32 for RMS calculation
                    f32 = _to_float32(data, dtype)
                    rms = float(np.sqrt(np.mean(f32 ** 2))) if _is_valid_audio(f32) else 0.0
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

                        self._chunks.append(data.copy())

                        if self._record_start_time and (now - self._record_start_time) > self.MAX_DURATION_S:
                            self._finalize_auto()
                    elif self._speech_active:
                        self._chunks.append(data.copy())
                        if self._silence_start is None:
                            self._silence_start = now
                        elif (now - self._silence_start) * 1000 >= self._silence_ms:
                            self._finalize_auto()
            except Exception as exc:
                logger.error("Auto-listen thread error: %s", exc)

        self._record_thread = threading.Thread(target=_auto_read, daemon=True)
        self._record_thread.start()
        logger.info("Auto-listen started (threshold=%.4f, silence=%dms, dtype=%s, blocking-read)",
                     self._config.energy_threshold, self._silence_ms, dtype)

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
        # Convert to float32 for downstream (Whisper expects float32)
        audio = _to_float32(audio, self._device_dtype)
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
        self._stop_event.set()
        if self._record_thread and self._record_thread.is_alive():
            self._record_thread.join(timeout=3)
        self._record_thread = None

    # ---- State helpers ------------------------------------------------------

    @property
    def is_recording(self) -> bool:
        return self._recording

    @property
    def is_auto_listening(self) -> bool:
        return self._auto_listening
