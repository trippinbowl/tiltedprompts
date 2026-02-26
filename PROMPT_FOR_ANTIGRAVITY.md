# Prompt for Antigravity — Website Production Refinement

> Copy everything below this line into Antigravity.

---

**Plan first, then implement page by page.**

## Context

The TiltedPrompts website (`website/`) is mostly built. The marketing pages, docs, pricing, auth, and member dashboard all exist. Now we need to refine it to production grade.

A separate agent (Cursor) has built the **TiltedVoice desktop app** — a Windows voice-to-text tool using faster-whisper. Here's what it does so your website copy and product pages stay accurate:

- Local-only voice-to-text (no cloud, no data leaves the device)
- 4 Whisper models: Tiny (75 MB), Base (142 MB), Small (466 MB), Medium (1.5 GB)
- 3 recording modes: Push-to-Talk, Toggle, Auto-Listen
- Global hotkeys: Ctrl+Shift+Space (PTT), Ctrl+Shift+R (Toggle)
- Auto-paste into any active window
- 7 UI themes (Midnight, Nord Aurora, Emerald Night, Sunset Blaze, Rose Quartz, Arctic, Cyberpunk)
- Floating draggable mic button, system tray, GPU acceleration with CPU fallback
- Single exe, ~98 MB, no Python install required
- Built with: Python, CustomTkinter, faster-whisper (CTranslate2), sounddevice

The full handoff doc is at `AGENT_HANDOFF_TILTEDVOICE.md` in the repo root — read it for the complete picture.

---

## What Needs Refinement

### 1. UI — Minimalist & Modern Overhaul

The current UI works but needs to feel **premium and intentional**. Think Linear, Vercel, Raycast-level polish. Specifically:

**Section Spacing:**
- Every major section on every page needs generous breathing room (80–120px vertical padding minimum)
- Sections should be visually separated using one or more of:
  - Subtle **background color shifts** (alternating bands — e.g. slightly lighter/darker)
  - **Scroll-triggered entrance animations** (fade-in, slide-up via Framer Motion)
  - Thin divider lines or gradient fades between sections
- No section should feel crammed against the next

**Typography & Whitespace:**
- Increase line height on body text
- Headings need more space below them before content starts
- Card content needs consistent internal padding (at least 24px)

**Cards & Components:**
- Subtle border + shadow instead of heavy borders
- Hover micro-interactions (slight lift, border glow)
- Consistent corner radius across all cards (12-16px)

### 2. Copy & Wording — Make It Make Sense

Go through every page and ensure:
- **Headlines are specific**, not generic SaaS filler. "Build faster with AI" → "Ship voice agents that run on-device"
- **Product descriptions match what the product actually does** (use the TiltedVoice details above for accuracy)
- **CTAs are action-oriented**: "Download for Windows", "Read the Docs", "Try the Playground"
- **Feature descriptions explain the WHY**, not just the what. Not "Push-to-talk mode" but "Hold a key to record, release to transcribe — zero UI friction"

### 3. Demo Video Placeholders

Every product page needs a **prominent demo video area**:
- Large 16:9 container (at least 60% viewport width)
- Styled placeholder with a play button overlay and product screenshot/gradient background
- Position it right after the product hero section, before the features grid
- These will be replaced with actual screen recordings later

### 4. Product Pages — Link to Documentation

Each product page must have a clear **"View Documentation →"** button/link that goes to the corresponding `/docs/[product]` page. Currently the connection between product pages and docs is weak.

### 5. Missing Pages

Create these if they don't exist:
- `/terms` — Terms of Service (use standard SaaS template, customize for TiltedPrompts)
- `/privacy` — Privacy Policy (emphasize local-first, no voice data collection for TiltedVoice)
- `/docs/tilted-vani` — Documentation for TiltedVani (Hindi voice-to-text, Sarvam AI integration, 22 Indian languages)

### 6. Contact Form

The `/company/contact` form has UI but no backend. Wire it up:
- Option A: Supabase table for form submissions
- Option B: Email via Resend/SendGrid
- Either way, add validation and a success state

### 7. Member Dashboard Polish

- Make search bar functional (filter assets by name)
- Make filter dropdowns functional (sort, region, language, price)
- Review `/members/extensions` and `/members/code` pages — add proper content or "Coming Soon" states
- Ensure the Agents page placeholder looks intentional, not broken

### 8. Homepage Section Order

Verify/adjust the homepage to this flow:
1. **Hero** — Bold tagline, subtitle, primary CTA, subtle animated background
2. **Products Section** — Cards for each product with icon, name, 1-line description, "Learn more →"
3. **Demo Video Area** — Placeholder for a flagship product demo (TiltedVoice or TiltedMCP)
4. **Features Grid** — 3–4 column grid with icons and short descriptions
5. **Stats/Social Proof** — Numbers or testimonials
6. **CTA Band** — Final call-to-action before footer
7. **Footer**

Each section separated by spacing/color shift as described above.

---

## Handoff Protocol

**Save a markdown file called `AGENT_HANDOFF_WEBSITE.md` in the repo root** with:
- Current state of every page (route, status, what's done vs TODO)
- Tech stack and key dependencies
- Deployment notes (how to build, where it's hosted, env vars needed)
- Any decisions made during this refinement

This file is shared across all agents working on TiltedPrompts products. Keep it updated as you make changes.

The desktop app agent's handoff doc is at `AGENT_HANDOFF_TILTEDVOICE.md` — read it for cross-product context.

---

**Start by reading `AGENT_HANDOFF_TILTEDVOICE.md` and the current website code, then give me a plan before making any changes.**
