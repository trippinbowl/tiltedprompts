# Testing Guide — TiltedVoice & TiltedVani

Complete hands-on guide to test both voice AI packages locally.

---

## Prerequisites

- **Python 3.10+** (we use 3.13 — check with `python --version`)
- **Microphone** (for live recording tests)
- **Sarvam AI API Key** (for TiltedVani — get one at https://www.sarvam.ai)
- **Windows/macOS/Linux** (all supported)

---

## Part 1: TiltedVoice (English / Whisper — On-Device)

TiltedVoice runs **entirely on your device**. No API keys needed. No internet required.

### 1.1 Setup

```bash
# Navigate to the project
cd G:\AI_Projects\ai-agency\tiltedvoice

# Create virtual environment (skip if already exists)
python -m venv .venv

# Activate it
# Windows:
.venv\Scripts\activate
# macOS/Linux:
# source .venv/bin/activate

# Install the package with dev dependencies
pip install -e ".[dev]"
```

### 1.2 Run Unit Tests (No Microphone Needed)

These tests use mocked audio — they validate the code logic without needing hardware.

```bash
# Run all 37 tests
pytest tests/ -v

# Run just model tests
pytest tests/test_models.py -v

# Run just transcriber tests
pytest tests/test_transcriber.py -v

# Run with coverage (install pytest-cov first)
pip install pytest-cov
pytest tests/ -v --cov=tiltedvoice --cov-report=term-missing
```

**Expected output:**
```
tests/test_models.py         16 passed
tests/test_transcriber.py    21 passed
========================= 37 passed in ~4s =========================
```

### 1.3 Test the CLI

```bash
# Check version
tilted-voice --version
# Output: tilted-voice, version 0.1.0

# See all options
tilted-voice --help
```

### 1.4 Test with Live Microphone

This will download the Whisper model on first run (~466MB for "small").

```bash
# Basic: auto-detect silence, print to stdout
tilted-voice

# Specify model and language
tilted-voice --model small --lang en

# Use tiny model for faster (but less accurate) results
tilted-voice --model tiny

# Toggle mode: press Enter to start/stop recording
tilted-voice --mode toggle

# Copy result to clipboard
tilted-voice --output clipboard

# Save to file
tilted-voice --output file --output-file transcription.txt

# Continuous mode: keeps listening after each transcription
tilted-voice --continuous
```

**What happens:**
1. Model downloads on first run (cached after that)
2. "Recording..." appears — speak into your microphone
3. Silence auto-stops recording (or press Enter in toggle mode)
4. Transcribed text appears in a styled panel

### 1.5 Test Programmatically (Python Script)

Create a file `test_live.py`:

```python
from tiltedvoice import Transcriber

# Initialize with tiny model for quick testing
transcriber = Transcriber(model="tiny", language="en")

# This downloads the model on first run
transcriber.load_model()
print("Model loaded!")

# Option A: Transcribe an existing audio file
# result = transcriber.transcribe("path/to/audio.wav")
# print(result.text)

# Option B: Record from microphone and transcribe
from tiltedvoice.audio import AudioRecorder

recorder = AudioRecorder()
print("Recording... speak now (silence will stop)")
audio = recorder.record_until_silence(
    silence_duration_ms=1000,      # 1 second of silence to stop
    max_duration_seconds=10,       # max 10 seconds
    on_speech_start=lambda: print("Speech detected!"),
    on_speech_end=lambda: print("Silence detected, processing..."),
)

if len(audio) > 0:
    result = transcriber.transcribe(audio)
    print(f"\nText:       {result.text}")
    print(f"Language:   {result.language} ({result.language_probability:.0%})")
    print(f"Duration:   {result.duration_seconds:.1f}s")
    print(f"Processed:  {result.processing_time_ms:.0f}ms")
    print(f"WPM:        {result.words_per_minute:.0f}")
else:
    print("No audio captured")
```

Run it:
```bash
python test_live.py
```

### 1.6 Test Different Models

```bash
# Fastest, lowest quality (75MB download)
tilted-voice --model tiny

# Good balance (466MB download) — RECOMMENDED
tilted-voice --model small

# Best quality, slowest (3.1GB download)
tilted-voice --model large-v3

# Auto-detect language (works with Hindi, Japanese, etc.)
tilted-voice --model small
# Then speak in any language!
```

### 1.7 Test GPU Acceleration

```python
from tiltedvoice import Transcriber

t = Transcriber(model="small")
device, compute = t._resolve_device()
print(f"Device: {device}")        # "cuda" if NVIDIA GPU, else "cpu"
print(f"Compute: {compute}")      # "float16" for GPU, "int8" for CPU
```

---

## Part 2: TiltedVani (Hindi / Sarvam AI — Cloud API)

TiltedVani needs a **Sarvam AI API key** for speech-to-text and translation.

### 2.1 Get a Sarvam AI API Key

1. Go to https://www.sarvam.ai
2. Sign up for a developer account
3. Navigate to Dashboard → API Keys
4. Copy your API Subscription Key

### 2.2 Setup

```bash
# Navigate to the project
cd G:\AI_Projects\ai-agency\tiltedvani

# Create virtual environment (skip if already exists)
python -m venv .venv

# Activate it
# Windows:
.venv\Scripts\activate
# macOS/Linux:
# source .venv/bin/activate

# Install with dev + server dependencies
pip install -e ".[dev,server]"

# Set your API key (choose one method):

# Method 1: Environment variable (recommended)
# Windows:
set SARVAM_API_KEY=your-key-here
# macOS/Linux:
# export SARVAM_API_KEY=your-key-here

# Method 2: .env file
echo SARVAM_API_KEY=your-key-here > .env
```

### 2.3 Run Unit Tests (No API Key Needed)

All tests use mocked API responses — they don't call Sarvam AI.

```bash
# Run all 54 tests
pytest tests/ -v

# Run just model tests (18 tests)
pytest tests/test_models.py -v

# Run just transcriber tests (24 tests)
pytest tests/test_transcriber.py -v

# Run just server/API tests (12 tests)
pytest tests/test_server.py -v

# Run with coverage
pip install pytest-cov
pytest tests/ -v --cov=tiltedvani --cov-report=term-missing
```

**Expected output:**
```
tests/test_models.py          18 passed
tests/test_server.py          12 passed
tests/test_transcriber.py     24 passed
========================= 54 passed in ~3s =========================
```

### 2.4 Test the CLI

```bash
# Check version
tilted-vani --version
# Output: tilted-vani, version 0.1.0

# See all options
tilted-vani --help
```

### 2.5 Test Translation Only (No Microphone Needed)

This is the fastest way to verify your Sarvam AI key works:

```bash
# Translate Hindi text to English (requires SARVAM_API_KEY)
tilted-vani --translate "नमस्ते, आप कैसे हैं?"

# With explicit API key
tilted-vani --api-key your-key-here --translate "मुझे तीन किलो आलू चाहिए"

# Expected output:
# Hindi:   मुझे तीन किलो आलू चाहिए
# English: I need three kilograms of potatoes
```

### 2.6 Test with Live Hindi Audio

```bash
# Dual output (Hindi + English) — DEFAULT
tilted-vani

# Hindi output only
tilted-vani --output hindi

# English translation only
tilted-vani --output english

# Continuous recording
tilted-vani --continuous

# With explicit API key
tilted-vani --api-key your-key-here
```

**What happens:**
1. Connects to Sarvam AI
2. "Recording..." appears — speak in Hindi
3. Audio is sent to Sarvam Saaras v3 for Hindi STT
4. Hindi text is translated via Sarvam Mayura v2
5. Both Hindi (Devanagari) and English outputs displayed

### 2.7 Test the FastAPI Server

```bash
# Start the server (requires SARVAM_API_KEY env var)
set SARVAM_API_KEY=your-key-here
uvicorn tiltedvani.server:app --host 0.0.0.0 --port 8000

# Server starts at http://localhost:8000
# Interactive docs at http://localhost:8000/vani/v1/docs
```

**Test endpoints with curl:**

```bash
# Health check (no auth needed)
curl http://localhost:8000/vani/v1/health

# Expected: {"status":"healthy","service":"tiltedvani","version":"0.1.0"}

# Translate Hindi text (needs Bearer token)
curl -X POST http://localhost:8000/vani/v1/translate \
  -H "Authorization: Bearer test-key" \
  -H "Content-Type: application/json" \
  -d "{\"text\": \"नमस्ते दुनिया\"}"

# Transcribe audio file (needs Bearer token)
curl -X POST http://localhost:8000/vani/v1/transcribe \
  -H "Authorization: Bearer test-key" \
  -F "audio=@recording.wav"
```

**Test with Python requests:**

```python
import httpx

BASE = "http://localhost:8000/vani/v1"
HEADERS = {"Authorization": "Bearer test-key"}

# Health check
r = httpx.get(f"{BASE}/health")
print(r.json())

# Translate
r = httpx.post(
    f"{BASE}/translate",
    headers=HEADERS,
    json={"text": "मैं आज बाज़ार जाना चाहता हूँ"}
)
print(r.json())
# {"english": "I want to go to the market today", "source_language": "hi"}
```

### 2.8 Test Programmatically (Python Script)

Create a file `test_vani.py`:

```python
import asyncio
from tiltedvani import HindiTranscriber
from tiltedvani.models import OutputMode

async def main():
    # Initialize (reads SARVAM_API_KEY from env)
    async with HindiTranscriber() as vani:

        # Test 1: Translate text
        print("--- Test 1: Text Translation ---")
        english = await vani.translate("मुझे तीन किलो आलू और एक किलो टमाटर चाहिए")
        print(f"English: {english}")

        # Test 2: Translate another text
        print("\n--- Test 2: Another Translation ---")
        english = await vani.translate("क्या आप मेरी मदद कर सकते हैं?")
        print(f"English: {english}")

        # Test 3: Transcribe audio file (if you have one)
        # print("\n--- Test 3: Audio Transcription ---")
        # result = await vani.transcribe("hindi_audio.wav")
        # print(f"Hindi:   {result.hindi}")
        # print(f"English: {result.english}")
        # print(f"Time:    {result.duration_ms:.0f}ms")

asyncio.run(main())
```

Run it:
```bash
python test_vani.py
```

### 2.9 Test the Interactive API Docs

1. Start the server: `uvicorn tiltedvani.server:app --port 8000`
2. Open browser: http://localhost:8000/vani/v1/docs
3. Click "Authorize" button → enter `Bearer your-key`
4. Try "POST /vani/v1/translate" → enter Hindi text
5. Click "Execute" → see the English translation

---

## Part 3: Quick Reference

### Run All Tests (Both Packages)

```bash
# TiltedVoice — 37 tests
cd G:\AI_Projects\ai-agency\tiltedvoice
.venv\Scripts\activate
pytest tests/ -v

# TiltedVani — 54 tests
cd G:\AI_Projects\ai-agency\tiltedvani
.venv\Scripts\activate
pytest tests/ -v
```

### Lint Both Packages

```bash
# TiltedVoice
cd G:\AI_Projects\ai-agency\tiltedvoice
.venv\Scripts\ruff check tiltedvoice/

# TiltedVani
cd G:\AI_Projects\ai-agency\tiltedvani
.venv\Scripts\ruff check tiltedvani/
```

### Common Issues

| Issue | Fix |
|-------|-----|
| `ModuleNotFoundError: No module named 'tiltedvoice'` | Run `pip install -e .` in the package directory |
| `SARVAM_API_KEY environment variable not set` | `set SARVAM_API_KEY=your-key` or create `.env` file |
| `No audio input devices found` | Check microphone is connected and not muted |
| `Model download is slow` | First run downloads model. Use `--model tiny` (75MB) for quick tests |
| `CUDA out of memory` | Use smaller model (`--model tiny` or `--model base`) or `--device cpu` |
| `UnicodeEncodeError` on Windows | Run `set PYTHONIOENCODING=utf-8` before running CLI |

### Test Matrix

| What to Test | TiltedVoice | TiltedVani |
|-------------|-------------|------------|
| Unit tests (no hardware) | `pytest tests/ -v` | `pytest tests/ -v` |
| CLI version check | `tilted-voice --version` | `tilted-vani --version` |
| Quick functional test | `tilted-voice --model tiny` | `tilted-vani --translate "नमस्ते"` |
| Live microphone | `tilted-voice` | `tilted-vani` |
| API server | N/A | `uvicorn tiltedvani.server:app` |
| API docs | N/A | `http://localhost:8000/vani/v1/docs` |
| Different models | `--model tiny/small/large-v3` | N/A (Sarvam cloud) |
| GPU check | See section 1.7 | N/A (cloud-based) |

---

## Test Workflow Summary

```
Step 1:  pytest tests/ -v              ← Validate code logic (mocked, fast)
Step 2:  tilted-voice --version         ← Verify CLI installed
Step 3:  tilted-voice --model tiny      ← Quick live test (smallest model)
Step 4:  tilted-vani --translate "..."   ← Verify Sarvam API key works
Step 5:  tilted-vani                    ← Full Hindi voice test
Step 6:  uvicorn tiltedvani.server:app  ← Test REST API
Step 7:  Open /vani/v1/docs             ← Interactive Swagger UI
```
