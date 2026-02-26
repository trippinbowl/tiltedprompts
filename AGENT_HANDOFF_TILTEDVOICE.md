# TiltedVoice — Agent Handoff Document

> Shared context for all agents working on TiltedPrompts products.  
> Last updated: 2026-02-25

---

## What Has Been Built (Desktop App — by Cursor Agent)

### TiltedVoice Desktop App (`tiltedvoice/`)
A Windows voice-to-text desktop app. Fully functional, tested, runs locally.

**Stack:** Python 3.13, CustomTkinter, faster-whisper (CTranslate2), sounddevice, pystray, keyboard

**Core Features:**
- Real-time voice → text using faster-whisper (no PyTorch, no cloud)
- 4 Whisper model sizes: Tiny (75 MB), Base (142 MB), Small (466 MB), Medium (1.5 GB)
- 3 recording modes: Push-to-Talk, Toggle, Auto-Listen (energy VAD)
- Global hotkeys: `Ctrl+Shift+Space` (PTT), `Ctrl+Shift+R` (Toggle)
- Auto-copy to clipboard + auto-paste into active window
- Floating draggable PTT button (always-on-top)
- System tray with mode switching
- GPU acceleration (CUDA) with automatic CPU fallback
- 16kHz mono audio, adaptive timeouts, VAD fallback

**UI:**
- Modern dashboard with sidebar navigation (Overview, History, Shortcuts, Settings)
- 7 built-in themes: Midnight, Nord Aurora, Emerald Night, Sunset Blaze, Rose Quartz, Arctic (light), Cyberpunk
- Theme persistence to `%APPDATA%/TiltedVoice/settings.json`
- 2-step onboarding wizard (Welcome → Model Selection)
- Transcription output with history, diagnostics panel, level meter

**Status:** Working, 65 tests passing, builds to single exe (~98 MB)

**Key Files:**
- `tiltedvoice/tiltedvoice/gui.py` — Main UI (1100+ lines)
- `tiltedvoice/tiltedvoice/transcriber.py` — Whisper engine
- `tiltedvoice/tiltedvoice/audio.py` — Mic management, recording
- `tiltedvoice/tiltedvoice/models.py` — Data models, enums, configs
- `tiltedvoice/scripts/build_exe.py` — PyInstaller build script

---

## What Has Been Built (Website — by Antigravity)

### Main Website (`website/`)
**Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 3, Framer Motion, Supabase, Stripe, next-themes

**Pages — Marketing:**

| Route | Status | Notes |
|---|---|---|
| `/` (Homepage) | ✅ Done | Hero, Stats, Products, Features, CTA sections |
| `/products/tilted-mcp` | ✅ Done | Real content, features grid, roadmap |
| `/products/tilted-voice` | ✅ Done | Real content, features, roadmap |
| `/products/tilted-vani` | ✅ Done | Hindi voice-to-text, dual output demo |
| `/products/tilted-code` | ⚠️ Early | Mostly "planned" content |
| `/products/laboratory` | ⚠️ Early | Mostly "planned" content |
| `/pricing` | ✅ Done | 3 tiers, monthly/annual toggle |
| `/company/about` | ✅ Done | Thesis + 3 principles |
| `/company/contact` | ⚠️ Partial | Form UI exists, no backend |
| `/company/careers` | ✅ Done | Minimal — no open positions |

**Pages — Documentation:**

| Route | Status | Notes |
|---|---|---|
| `/docs` | ✅ Done | Quick start, product cards, architecture |
| `/docs/getting-started` | ✅ Done | 5-step setup guide |
| `/docs/tilted-mcp` | ✅ Done | CLI workflow, pre-built servers, client setup |
| `/docs/tilted-voice` | ✅ Done | Whisper + Sarvam, model table, 22 languages |
| `/docs/tilted-code` | ✅ Done | 5 templates, project structure |
| `/docs/laboratory` | ✅ Done | 6 pre-built workflows, tech stack |

**Pages — Members Dashboard:**

| Route | Status | Notes |
|---|---|---|
| `/members` | ⚠️ Partial | UI done, search/filters non-functional |
| `/members/prompts` | ✅ Done | Filters by prompt_bundle |
| `/members/skills` | ✅ Done | Filters by openclaw_skill |
| `/members/n8n` | ✅ Done | Filters by n8n_workflow |
| `/members/agents` | ⚠️ Placeholder | "Coming Soon" |
| `/members/extensions` | ❓ Unknown | Needs review |
| `/members/code` | ❓ Unknown | Needs review |
| `/members/assets/[id]` | ✅ Done | Dynamic detail with access gates |

**Auth:** `/login` and `/register` — functional with Supabase

**Missing:**
- Terms of Service page
- Privacy Policy page
- Contact form backend
- Dashboard search/filter functionality
- TiltedVani docs page

---

## What Needs to Happen Next

### Website UI Refinement (for Antigravity)
See the prompt below.

### Desktop App
- Rebuild exe with latest UI changes
- Test on clean Windows machine
- Add auto-updater (future)

---
