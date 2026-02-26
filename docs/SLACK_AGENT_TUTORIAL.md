# TiltedPrompts — Dual Agent Slack Tutorial & OpenClaw Command Reference

> **Last updated:** 2026-02-22
>
> This document covers how both TiltedPrompts agents work inside Slack via
> OpenClaw, what commands trigger which agent, and how the cron automation runs.

---

## Architecture Overview

```
┌──────────────────────────────────────────────────────────────────────┐
│                         SLACK WORKSPACE                             │
│                                                                     │
│  @Claw generate prompts for Indian Real Estate                      │
│                    ↓                                                │
│  @Claw framework AI CFO quarterly report from CSV                   │
│                    ↓                                                │
└────────────────────┬─────────────────────────────────────────────────┘
                     │
                     ▼
          ┌─────────────────────┐
          │     OpenClaw Agent   │
          │  (Skill Router)      │
          └────────┬────────────┘
                   │
        ┌──────────┴──────────┐
        ▼                     ▼
┌───────────────┐    ┌────────────────────┐
│ Agent 1: MSME │    │ Agent 2: Framework │
│ tilted_asset  │    │ tilted_framework   │
│ _generator    │    │ _generator         │
└───────┬───────┘    └────────┬───────────┘
        │                     │
        ▼                     ▼
┌─────────────────────────────────────────┐
│         Flask Bundle Generator          │
│         (localhost:5000)                │
│                                         │
│  SIMPLICITY_DIRECTIVE  ←── Agent 1      │
│  FRAMEWORK_DIRECTIVE   ←── Agent 2      │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│  Next.js Ingestion API (HMAC-auth)      │
│  POST /api/ingest-bundle                │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│  Supabase — library_assets table        │
│  (live at tiltedprompts.com/members)    │
└─────────────────────────────────────────┘
```

---

## The Two Agents

### Agent 1: MSME Asset Generator (`tilted_asset_generator`)

**Who it serves:** Indian MSMEs — bakeries, brokers, CAs, restaurants, gym
owners, Shopify sellers, home bakers.

**What it produces:** Dead-simple, copy-paste-ready templates that solve
ONE specific painful moment. WhatsApp messages, Instagram captions, email
templates, Google review replies, LinkedIn DMs.

**Skill directory:** `openclaw/skills/tilted_generator/`

**Key files:**
- `instructions.md` — Skill definition with Zero-Thinking Philosophy
- `tools.py` — Python tooling with SIMPLICITY_DIRECTIVE, validation, CLI

---

### Agent 2: Framework Generator (`tilted_framework_generator`)

**Who it serves:** AI engineers, SaaS builders, content creators, automation
architects, power users.

**What it produces:** Structured, premium-grade prompt blueprints with
CAPITALIZED SECTION HEADERS, zero conversational filler, and [BRACKETED]
placeholders. Midjourney specs, n8n workflow blueprints, financial report
generators, Custom GPT system instructions.

**Skill directory:** `openclaw/skills/tilted_framework_generator/`

**Key files:**
- `instructions.md` — Skill definition with The Framework Laws
- `tools.py` — Python tooling with FRAMEWORK_DIRECTIVE, validation, CLI

---

## Slack Commands Reference

### Agent 1 — MSME Templates

| Command | What It Does |
|---------|--------------|
| `@Claw generate prompts for Indian Real Estate` | Generates 5 copy-paste WhatsApp/Instagram templates for real estate brokers |
| `@Claw generate 5 new prompts for Shopify D2C brands` | Generates 5 Instagram DM reply templates for D2C sellers |
| `@Claw create bundle for bakery` | Generates 5 Instagram captions for a home baker |
| `@Claw generate prompts for CA firms` | Generates 5 WhatsApp ITR reminder messages for CAs |
| `@Claw run daily asset generation` | Triggers today's MSME cron schedule manually |

**Trigger keywords:** `generate`, `create`, `make` combined with `asset`,
`bundle`, `prompt` — WITHOUT the word "framework".

**What happens behind the scenes:**
1. OpenClaw matches the message to `tilted_asset_generator` skill
2. Parses the niche (rewrites broad categories into specific painful moments)
3. Calls `generate_bundle()` in `tools.py` → Flask API with SIMPLICITY_DIRECTIVE
4. Validates output (rejects meta-prompts, code-style placeholders)
5. Pushes to Supabase via HMAC-authenticated ingestion API
6. Reports back to Slack with asset ID and live link

---

### Agent 2 — Framework Prompts

| Command | What It Does |
|---------|--------------|
| `@Claw framework SaaS product launch thumbnail for Midjourney` | Generates 3 structured Midjourney prompt specs with ASPECT RATIO:, LIGHTING:, etc. |
| `@Claw framework AI CFO quarterly report from CSV data` | Generates 3 ChatGPT/Claude prompts with ROLE:, OBJECTIVE:, OUTPUT FORMAT: headers |
| `@Claw framework structured prompt for competitor analysis` | Generates 2 SWOT matrix / feature comparison framework prompts |
| `@Claw framework n8n workflow for Gmail refund auto-responder` | Generates 3 automation architecture blueprints with TRIGGER:, ROUTING LOGIC: headers |
| `@Claw framework custom GPT system instructions for support bot` | Generates 2 Custom GPT system instruction prompts with PERSONALITY:, BOUNDARIES: headers |

**Trigger keyword:** The word `framework` in the message routes to
`tilted_framework_generator`.

**What happens behind the scenes:**
1. OpenClaw matches the `framework` keyword → routes to `tilted_framework_generator`
2. Parses the task and optional target tool (Midjourney, Claude, n8n, etc.)
3. Calls `generate_framework()` in `tools.py` → Flask API with FRAMEWORK_DIRECTIVE
4. Validates output (checks for >= 3 CAPITALIZED HEADERS, no filler, density >= 200 chars)
5. Pushes to Supabase as a premium asset
6. Reports back to Slack with framework-style confirmation

---

## Routing Rules — How OpenClaw Decides Which Agent

```
User says:                              → Routes to:
─────────────────────────────────────── ──────────────────────
"framework [anything]"                  → tilted_framework_generator
"generate prompts for [niche]"          → tilted_asset_generator
"create bundle for [niche]"             → tilted_asset_generator
"make assets for [niche]"               → tilted_asset_generator
"WhatsApp messages for..."              → tilted_asset_generator
"Instagram captions for..."             → tilted_asset_generator
"framework n8n workflow..."             → tilted_framework_generator
"framework Midjourney prompt..."        → tilted_framework_generator
```

**The golden rule:** If the message contains `framework`, it goes to
Agent 2. Everything else goes to Agent 1.

---

## Example Slack Conversations

### Example 1: MSME Agent

```
You:   @Claw generate prompts for Indian Real Estate

Claw:  ✅ Asset Generated & Published!

       📦 "5 WhatsApp Messages for When Your Site-Visit Client Goes Silent"
       🏷️ prompt_bundle — 5 copy-paste messages + 1 ChatGPT helper
       🔓 Free Tier
       📊 Tags: real-estate, whatsapp, follow-up, india
       🆔 a1b2c3d4-e5f6-7890-abcd-ef1234567890
       ⏱️ 28 seconds

       🌐 Live at: https://tiltedprompts.com/members
```

### Example 2: Framework Agent

```
You:   @Claw framework AI CFO quarterly report from CSV data

Claw:  🔧 Framework Asset Published!

       📐 "AI CFO Quarterly Report from Raw CSV — Claude/ChatGPT Blueprint"
       🏷️ prompt_bundle — 3 structured framework prompts
       🔒 Pro Tier
       🎯 Target: ChatGPT/Claude
       📊 Tags: chatgpt, claude, finance, csv, reporting
       🆔 f7e8d9c0-b1a2-3456-7890-abcdef123456
       ⏱️ 35 seconds

       🌐 Live at: https://tiltedprompts.com/members
```

### Example 3: Wrong Agent (Redirected)

```
You:   @Claw generate WhatsApp messages using framework format

Claw:  This request mentions "WhatsApp messages" — routing to the MSME agent.
       If you want structured framework prompts, say:
       "@Claw framework [your task description]"
```

---

## Cron Schedules

Both agents run on independent daily cron schedules, each producing different
content for different audiences.

### Agent 1 — MSME Cron (Free + Premium Mix)

| Day | What Gets Generated | Premium |
|-----|-------------------|---------|
| Monday | 5 Instagram DM replies for Shopify "too expensive" comments | Free |
| Tuesday | 5 WhatsApp follow-ups for silent real estate clients | Free |
| Wednesday | 5 WhatsApp ITR reminders for CA firms | Pro |
| Thursday | 5 Instagram captions for restaurant daily food photos | Free |
| Friday | 5 WhatsApp "where is my order" reply templates | Free |
| Saturday | 3 cold LinkedIn messages for SaaS founders | Pro |
| Sunday | 3 Google My Business review replies (5-star, 3-star, 1-star) | Pro |

**Trigger:** `python tilted_generator/tools.py --cron`

### Agent 2 — Framework Cron (All Premium)

| Day | What Gets Generated | Premium |
|-----|-------------------|---------|
| Monday | 3 Midjourney cinematic SaaS product hero image prompts | Pro |
| Tuesday | 3 ChatGPT/Claude financial report-from-CSV prompts | Pro |
| Wednesday | 3 n8n workflow architecture blueprints | Pro |
| Thursday | 3 content repurposing prompts (blog → LinkedIn/Twitter/IG) | Pro |
| Friday | 3 DALL-E/Midjourney Indian D2C product photography prompts | Pro |
| Saturday | 2 competitor analysis framework prompts | Pro |
| Sunday | 2 Custom GPT system instruction prompts | Pro |

**Trigger:** `python tilted_framework_generator/tools.py --cron`

---

## How OpenClaw Skills Work (Under the Hood)

### What is an OpenClaw Skill?

An OpenClaw skill is a self-contained directory with:
- `instructions.md` — YAML frontmatter (name, description, env requirements)
  followed by the full agent instructions in Markdown
- `tools.py` — Python functions the agent can call
- Optionally: `skill_payload.json`, test fixtures, etc.

OpenClaw reads the `instructions.md` to understand WHEN to activate the skill
(trigger patterns) and HOW to use it (execution protocol). When a matching
Slack message arrives, OpenClaw loads the skill's instructions and tools,
then executes the defined protocol.

### Skill Registration

Skills are registered by their directory name inside `openclaw/skills/`:

```
openclaw/skills/
├── tilted_generator/               ← Agent 1: MSME
│   ├── instructions.md
│   └── tools.py
├── tilted_framework_generator/     ← Agent 2: Framework
│   ├── instructions.md
│   └── tools.py
├── generate_bundle/                ← Legacy (replaced by Agent 1)
├── list_bundles/
├── preview_bundle/
└── daily_report/
```

### Shared Infrastructure

Agent 2 (Framework) imports shared functions from Agent 1 (MSME) to avoid
code duplication:

```python
# In tilted_framework_generator/tools.py
from tools import (
    FLASK_API_URL, INGEST_URL, INGEST_KEY, INGEST_SECRET,
    _compute_hmac_signature, _check_rate_limit,
    ingest_to_database, transform_to_db_payload,
)
```

Both agents share:
- Flask API connection (same `localhost:5000` backend)
- HMAC signing utilities
- Ingestion pipeline (same Supabase table)
- Rate limiting logic

Each agent owns:
- Its own LLM directive (SIMPLICITY_DIRECTIVE vs FRAMEWORK_DIRECTIVE)
- Its own validation rules (meta-prompt rejection vs section-header checking)
- Its own niche rotation schedule
- Its own CLI interface

---

## CLI Quick Reference

### Agent 1 — MSME

```bash
# Run today's scheduled MSME generation
python openclaw/skills/tilted_generator/tools.py --cron

# Generate a specific MSME bundle
python openclaw/skills/tilted_generator/tools.py generate \
    --niche "Indian Real Estate" \
    --count 5

# Generate premium MSME bundle
python openclaw/skills/tilted_generator/tools.py generate \
    --niche "CA Firms GST" \
    --count 5 \
    --premium

# Health check
python openclaw/skills/tilted_generator/tools.py health
```

### Agent 2 — Framework

```bash
# Run today's scheduled framework generation
python openclaw/skills/tilted_framework_generator/tools.py --cron

# Generate a specific framework bundle
python openclaw/skills/tilted_framework_generator/tools.py framework \
    --task "Cinematic SaaS thumbnail for Midjourney" \
    --count 3

# Generate with specific target tool
python openclaw/skills/tilted_framework_generator/tools.py framework \
    --task "AI CFO quarterly report from CSV" \
    --tool "Claude" \
    --count 3 \
    --platforms chatgpt claude finance

# Health check
python openclaw/skills/tilted_framework_generator/tools.py health
```

---

## Environment Variables (Both Agents)

Both agents share the same environment variables:

```bash
# Flask bundle generator
TILTEDPROMPTS_API_URL=http://localhost:5000

# Next.js ingestion endpoint
TILTEDPROMPTS_INGEST_URL=https://tiltedprompts.com/api/ingest-bundle

# HMAC authentication
TILTEDPROMPTS_INGEST_KEY=tp_ingest_xxxxxxxxxxxxxxxx
TILTEDPROMPTS_INGEST_SECRET=tp_secret_xxxxxxxxxxxxxxxxxxxxxxxx
```

Set these in your system environment or in a `.env` file loaded by your
shell profile.

---

## Deployment Checklist

1. **Flask backend running:** `python backend/bundle_generator.py`
2. **Next.js app deployed:** with `/api/ingest-bundle` route active
3. **Supabase migration applied:** `001_library_assets.sql`
4. **Environment variables set:** all 4 `TILTEDPROMPTS_*` vars
5. **OpenClaw connected to Slack:** via the `openclaw_setup.md` guide
6. **Both skills detected:** verify with `@Claw help` or skill listing
7. **Cron jobs configured:** (see Cron Setup below)

---

## Cron Setup (Windows Task Scheduler)

### MSME Agent — Daily at 9:00 AM IST

```
Program: python
Arguments: G:\AI_Projects\ai-agency\openclaw\skills\tilted_generator\tools.py --cron
Start in: G:\AI_Projects\ai-agency
```

### Framework Agent — Daily at 10:00 AM IST

```
Program: python
Arguments: G:\AI_Projects\ai-agency\openclaw\skills\tilted_framework_generator\tools.py --cron
Start in: G:\AI_Projects\ai-agency
```

Stagger the cron times by at least 30 minutes so both agents don't hit
the Flask API simultaneously (local LLM resource contention).

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `@Claw framework ...` not triggering Agent 2 | Verify `tilted_framework_generator/` directory exists in OpenClaw's skill path |
| "Flask API unreachable" | Run `python backend/bundle_generator.py` |
| "HMAC authentication failed" | Check `TILTEDPROMPTS_INGEST_KEY` and `TILTEDPROMPTS_INGEST_SECRET` match between `.env` and Next.js |
| Framework validation fails repeatedly | LLM may not be following the FRAMEWORK_DIRECTIVE — try switching to DeepSeek (`LLM_PROVIDER=deepseek`) |
| MSME prompts too abstract | The SIMPLICITY_DIRECTIVE should be prepended automatically — check `tools.py` |
| Duplicate title (409) | The ingestion API rejects duplicate titles — the agent auto-appends a qualifier and retries once |
| Rate limit (429) | Max 20 ingestions/hour — wait or increase the limit in `tools.py` |
