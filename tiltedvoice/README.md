# TiltedVoice

Windows desktop voice-to-text floating overlay powered by [faster-whisper](https://github.com/SYSTRAN/faster-whisper). No cloud, no torch — runs entirely on-device.

## Features

- **Floating always-on-top overlay** with a modern dark UI
- **Three recording modes**: Push-to-Talk, Toggle, Auto-Listen (energy VAD)
- **Floating PTT button** — a small draggable mic button for quick recording
- **Auto-paste** into the active window after transcription
- **System tray** integration with mode switching
- **Global hotkeys**: Ctrl+Shift+Space (PTT), Ctrl+Shift+R (Toggle)
- **GPU acceleration** (NVIDIA CUDA) with automatic CPU fallback
- Packages as a single `.exe` via PyInstaller

## Requirements

- Windows 10/11 (64-bit)
- Python 3.10+ (3.13 recommended)
- Microphone

## Quick Start

```powershell
cd G:\AI_Projects\ai-agency\tiltedvoice

# Create virtual environment
py -3.13 -m venv .venv
.venv\Scripts\activate

# Install
pip install -e ".[dev]"

# Run
python -m tiltedvoice.gui
```

## Models

Models download automatically on first use (cached in `~/.cache/huggingface`).

| Model | Size | Speed | Quality |
|-------|------|-------|---------|
| tiny.en | 75 MB | Fastest | Good for short phrases |
| base.en | 142 MB | Fast | Recommended |
| small.en | 466 MB | Moderate | High quality |
| medium.en | 1.5 GB | Slow | Best quality |

## Recording Modes

| Mode | Trigger | Description |
|------|---------|-------------|
| Push-to-Talk | Ctrl+Shift+Space | Hold to record, release to transcribe |
| Toggle | Ctrl+Shift+R | Press to start, press again to stop |
| Auto-Listen | Energy VAD | Automatically detects speech start/end |

## Testing

```powershell
# Run all tests (no microphone or model download required)
pytest tests/ -v

# With coverage
pytest tests/ -v --cov=tiltedvoice --cov-report=term-missing
```

## Build Executable

```powershell
python scripts/build_exe.py
# Output: dist/TiltedVoice.exe
```

## Architecture

```
tiltedvoice/
├── assets/          # App icons (ico + png)
├── scripts/
│   └── build_exe.py # PyInstaller build script
├── tests/
│   ├── test_models.py
│   └── test_transcriber.py
├── tiltedvoice/
│   ├── __init__.py  # Package init + version
│   ├── models.py    # Enums, dataclasses, configs
│   ├── transcriber.py # Whisper engine (faster-whisper)
│   ├── audio.py     # Microphone + voice recorder (energy VAD)
│   └── gui.py       # Main GUI + floating PTT + system tray
├── pyproject.toml
└── README.md
```

## License

MIT — TiltedPrompts AI Product Studio
