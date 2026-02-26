"""Data models, enums, and configuration dataclasses for TiltedVoice."""

from __future__ import annotations

from dataclasses import dataclass, field
from enum import Enum
from typing import Any, Dict, List, Optional


class WhisperModel(str, Enum):
    """Available Whisper model sizes (English-only variants)."""

    TINY_EN = "tiny.en"
    BASE_EN = "base.en"
    SMALL_EN = "small.en"
    MEDIUM_EN = "medium.en"

    @property
    def display_name(self) -> str:
        names = {
            "tiny.en": "Tiny (English) — 75 MB",
            "base.en": "Base (English) — 142 MB",
            "small.en": "Small (English) — 466 MB",
            "medium.en": "Medium (English) — 1.5 GB",
        }
        return names.get(self.value, self.value)

    @property
    def size_mb(self) -> int:
        sizes = {"tiny.en": 75, "base.en": 142, "small.en": 466, "medium.en": 1500}
        return sizes.get(self.value, 0)


class RecordingMode(str, Enum):
    """Voice recording trigger modes."""

    PUSH_TO_TALK = "push-to-talk"
    TOGGLE = "toggle"
    AUTO = "auto"

    @property
    def display_name(self) -> str:
        names = {
            "push-to-talk": "Push-to-Talk (hold Ctrl+Shift+Space)",
            "toggle": "Toggle (Ctrl+Shift+R)",
            "auto": "Auto-Listen (energy VAD)",
        }
        return names.get(self.value, self.value)


@dataclass
class TranscriptionSegment:
    """A single transcription segment returned by Whisper."""

    text: str
    start: float
    end: float
    confidence: float = 0.0


@dataclass
class TranscriptionResult:
    """Result of a single transcription run."""

    text: str
    language: str = "en"
    confidence: float = 0.0
    duration: float = 0.0
    processing_time_ms: float = 0.0
    segments: List[TranscriptionSegment] = field(default_factory=list)
    model_name: str = ""
    debug_info: Dict[str, Any] = field(default_factory=dict)

    @property
    def words_per_minute(self) -> float:
        if self.duration <= 0:
            return 0.0
        word_count = len(self.text.split()) if self.text.strip() else 0
        return (word_count / self.duration) * 60.0


@dataclass
class AudioConfig:
    """Audio recording parameters."""

    sample_rate: int = 16_000
    channels: int = 1
    dtype: str = "float32"
    energy_threshold: float = 0.01


@dataclass
class TranscriberConfig:
    """Configuration for the Whisper transcription engine."""

    model: WhisperModel = WhisperModel.BASE_EN
    language: str = "en"
    device: str = "auto"
    compute_type: str = "auto"
    beam_size: int = 1
    vad_filter: bool = True
    vad_threshold: float = 0.5
    word_timestamps: bool = False


@dataclass
class HotkeyConfig:
    """Hotkey bindings."""

    push_to_talk: str = "ctrl+shift+space"
    toggle: str = "ctrl+shift+r"


@dataclass
class AppSettings:
    """Persistent application settings."""

    model: WhisperModel = WhisperModel.BASE_EN
    language: str = "en"
    recording_mode: RecordingMode = RecordingMode.PUSH_TO_TALK
    hotkeys: HotkeyConfig = field(default_factory=HotkeyConfig)
    auto_paste: bool = True
    auto_copy: bool = True
    energy_threshold: float = 0.01
    silence_ms: int = 1200
