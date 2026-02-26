# Slack Status Reporting — Three-Layer Architecture

## The Problem

When OpenClaw runs `tools.py` via Slack, the Python script's `print()` output
goes to **stdout**. But OpenClaw's LLM runtime treats stdout as *context to
reason about*, not *text to relay*. The result:

- The LLM generates its own conversational response ("I generated the prompts
  for you!")
- Real pipeline status (success/failure, asset IDs, error details) gets lost
- Silent failures — the DB upload fails but the LLM says "Done!"

**Root cause:** LLMs are not passthrough pipes. They *interpret* input and
*generate* output. You cannot force an LLM to echo text by printing it.

## The Solution: Three Layers

We use **three independent layers** so that at least one always works,
regardless of how the LLM behaves.

```
┌─────────────────────────────────────────────────────────┐
│  tools.py (pipeline execution)                          │
│                                                         │
│  _post_slack_status("✅ Asset Published!...")            │
│       │                                                 │
│       ├──► LAYER 1: Slack Webhook (POST to webhook URL) │
│       │    Bypasses OpenClaw LLM completely.             │
│       │    Status appears directly in Slack channel.     │
│       │                                                 │
│       └──► LAYER 2: Fenced stdout                       │
│            Wraps status in sentinel markers:             │
│            ===TILTED_STATUS===                           │
│            [status text]                                 │
│            ===END_STATUS===                              │
│                                                         │
│  SKILL.md (LAYER 3) instructs the LLM:                  │
│  "Find the ===TILTED_STATUS=== block and copy it        │
│   verbatim as your entire response."                    │
└─────────────────────────────────────────────────────────┘
```

### Layer 1: Direct Slack Webhook (Bulletproof)

**How it works:** `tools.py` sends an HTTP POST directly to a Slack Incoming
Webhook URL. This completely bypasses OpenClaw's LLM — the message appears
in the Slack channel regardless of what the LLM does.

**Setup:**

1. Go to https://api.slack.com/apps → Your App → Incoming Webhooks
2. Create a new webhook for the channel where your bot posts
3. Copy the webhook URL (looks like `https://hooks.slack.com/services/T.../B.../xxx`)
4. Set the environment variable:

```bash
# Add to your .env or system environment
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR_WORKSPACE_ID/YOUR_BOT_ID/YOUR_SECRET_TOKEN
```

**When it fires:** Every time `_post_slack_status()` is called (pipeline
progress, success, failure, batch summaries).

**When it fails:** Only if the webhook URL is invalid/revoked, or Slack is
down. In that case, Layer 2 takes over.

### Layer 2: Fence Protocol (Stdout Sentinels)

**How it works:** Status text is wrapped in sentinel markers before printing
to stdout. SKILL.md tells the LLM to find and relay this block verbatim.

```
===TILTED_STATUS===
✅ Asset Published!

`Generate` ✅ | `Validate` ✅ | `Upload` ✅

📦 "5 WhatsApp Messages for Silent Clients"
🏷️ prompt_bundle — 5 prompts
🔓 Free Tier
🆔 a1b2c3d4-e5f6
⏱️ 28 seconds

🌐 Live at: https://tiltedprompts.com/members
===END_STATUS===
```

The LLM sees these markers and (per SKILL.md instructions) copies the content
between them as its entire response.

**Setup:** No setup needed — this is always active.

**When it fails:** If the LLM ignores the SKILL.md instructions (it sometimes
does). In that case, Layer 1 (webhook) still delivers the correct status.

### Layer 3: SKILL.md Persona Override

**How it works:** Both SKILL.md files contain a `MANDATORY: Slack Output
Protocol` section that rewrites the agent's persona from "helpful assistant"
to "pipeline status bot" with explicit FORBIDDEN and REQUIRED behavior lists.

**Key instructions in SKILL.md:**

```markdown
## MANDATORY: Slack Output Protocol (READ THIS FIRST — NON-NEGOTIABLE)

YOU ARE A PIPELINE STATUS BOT. You are NOT a conversational assistant.

1. Run the command immediately. Say NOTHING before running it.
2. Find the status block between ===TILTED_STATUS=== and ===END_STATUS===
3. Your ENTIRE response = ONLY that status block. Copy character-for-character.

### NEVER DO THIS:
- "I'll generate the prompts for you now..."  ← FORBIDDEN
- Adding ANY text before/after the status block  ← FORBIDDEN
- Summarizing or rephrasing the status block  ← FORBIDDEN

### ALWAYS DO THIS:
- Run the command immediately without preamble
- Copy the fenced status block VERBATIM as your entire response
```

**Setup:** Already deployed in both SKILL.md files.

**When it fails:** LLMs are probabilistic — they sometimes ignore instructions.
That's exactly why Layers 1 and 2 exist as fallbacks.

---

## Configuration Reference

### Environment Variables

| Variable | Required | Default | Purpose |
|----------|----------|---------|---------|
| `SLACK_WEBHOOK_URL` | **Recommended** | (empty) | Layer 1: Direct Slack webhook URL |
| `TILTEDPROMPTS_API_URL` | Yes | `http://localhost:5000` | Flask bundle generator |
| `TILTEDPROMPTS_INGEST_URL` | Yes | (none) | Next.js ingestion endpoint |
| `TILTEDPROMPTS_INGEST_KEY` | Yes | (none) | HMAC API key |
| `TILTEDPROMPTS_INGEST_SECRET` | Yes | (none) | HMAC signing secret |

### Status Format

All status messages follow this structure:

**Success:**
```
✅ Asset Published!

`Generate` ✅ | `Validate` ✅ | `Upload` ✅

📦 "Title Here"
🏷️ prompt_bundle — N prompts
🔓 Free Tier / 🔒 Pro Tier
📊 Tags: tag1, tag2
🆔 asset-uuid
⏱️ Ns

🌐 Live at: https://tiltedprompts.com/members
```

**Failure:**
```
❌ Asset Generation FAILED

`Generate` ✅ | `Validate` ✅ | `Upload` ❌

🚨 Error Type: ConnectionError
📝 Details: Ingestion API unreachable at http://localhost:3000/api/ingest-bundle
⏱️ 45 seconds

💡 Troubleshooting:
• Ensure `python bundle_generator.py` is running
• Ensure `npm run dev` is running (for local dev)
• Check env vars: TILTEDPROMPTS_INGEST_KEY, TILTEDPROMPTS_INGEST_SECRET
```

**Batch (overnight cron):**
```
🌅 Overnight Batch COMPLETE

📅 Monday — Content & Copywriting
✅ Successes: 47
❌ Failures: 2
🔁 Duplicates: 1
📦 Total: 50 / 50 attempted
⏱️ 25200s (7.0h)

📄 Batch report saved to logs/
```

---

## Shared Infrastructure (for developers)

All status functions live in `tilted_generator/tools.py` and are imported by
the framework agent:

```python
# Available exports for status reporting
from tools import (
    _post_slack_status,       # Main function — posts via Layer 1 + Layer 2
    _pipeline_status_line,    # Build: `Generate` ✅ | `Validate` ✅ | `Upload` ❌
    _format_success_status,   # Format complete success block
    _format_error_status,     # Format complete error block
    _OK, _FAIL, _PENDING, _RUNNING,  # Emoji constants
    STATUS_FENCE_START,       # "===TILTED_STATUS==="
    STATUS_FENCE_END,         # "===END_STATUS==="
    SLACK_WEBHOOK_URL,        # The webhook URL (from env)
)
```

### Adding Status to New Pipelines

```python
# At each pipeline stage:
_post_slack_status(
    f"{_RUNNING} Generating asset...\n"
    f"{_pipeline_status_line(_RUNNING, _PENDING, _PENDING)}",
    agent="MSME",  # or "Framework"
)

# On success:
_post_slack_status(
    _format_success_status(
        title="My Asset Title",
        asset_id="uuid-here",
        prompt_count=5,
        is_premium=False,
        elapsed=28.3,
        agent="MSME",
        platforms=["whatsapp", "instagram"],
    ),
    agent="MSME",
)

# On failure:
_post_slack_status(
    _format_error_status(
        error_msg="Connection refused",
        error_type="ConnectionError",
        stage="upload",  # "generate", "validate", or "upload"
        elapsed=5.2,
        agent="MSME",
    ),
    agent="MSME",
)
```

---

## Troubleshooting

### "Bot still gives conversational text instead of status"

This means Layer 3 (SKILL.md) failed — the LLM ignored the output protocol.

**Fix:** Ensure `SLACK_WEBHOOK_URL` is set. Layer 1 bypasses the LLM entirely
and posts directly to Slack. The conversational text from the LLM becomes
irrelevant because the webhook already delivered the real status.

### "I see the status twice in Slack"

This is correct behavior when both Layer 1 (webhook) and Layer 3 (LLM relay)
succeed. The webhook posts first, then the LLM relays the fenced block.

**Fix:** If this bothers you, remove `SLACK_WEBHOOK_URL` to disable Layer 1
and rely only on Layer 2+3. Or keep both for redundancy (recommended).

### "Webhook returns 403/404"

The webhook URL is invalid or the Slack app was removed.

**Fix:** Create a new webhook at https://api.slack.com/apps → Incoming Webhooks
and update the `SLACK_WEBHOOK_URL` environment variable.

### "Status shows ❌ Upload but no error details"

The Next.js ingestion API is down or the HMAC credentials are wrong.

**Fix:**
1. Check `npm run dev` is running (for local development)
2. Check `TILTEDPROMPTS_INGEST_KEY` and `TILTEDPROMPTS_INGEST_SECRET` match
   between tools.py and `website/app/api/ingest-bundle/route.ts`

### "Batch report JSON shows failures but Slack only showed success"

Each iteration posts its own status. If you're seeing only the last one,
this is because SKILL.md says "use ONLY the LAST status block." For batch
mode, the summary is posted separately at the end.

**Fix:** Check the batch report JSON in `logs/` for per-iteration details.

---

## File Locations

| File | Source | Runtime (OpenClaw) |
|------|--------|--------------------|
| MSME `tools.py` | `G:\AI_Projects\ai-agency\openclaw\skills\tilted_generator\tools.py` | `C:\Users\Administrator\.openclaw\skills\tilted_generator\tools.py` |
| MSME `SKILL.md` | `G:\AI_Projects\ai-agency\openclaw\skills\tilted_generator\SKILL.md` | `C:\Users\Administrator\.openclaw\skills\tilted_generator\SKILL.md` |
| Framework `tools.py` | `G:\AI_Projects\ai-agency\openclaw\skills\tilted_framework_generator\tools.py` | `C:\Users\Administrator\.openclaw\skills\tilted_framework_generator\tools.py` |
| Framework `SKILL.md` | `G:\AI_Projects\ai-agency\openclaw\skills\tilted_framework_generator\SKILL.md` | `C:\Users\Administrator\.openclaw\skills\tilted_framework_generator\SKILL.md` |

**CRITICAL:** Always update BOTH locations. Source is for version control.
Runtime is what OpenClaw actually reads.

---

## Quick Setup Checklist

1. [ ] Create Slack Incoming Webhook at https://api.slack.com/apps
2. [ ] Set `SLACK_WEBHOOK_URL` in your environment / `.env`
3. [ ] Verify `TILTEDPROMPTS_INGEST_*` env vars are correct
4. [ ] Deploy files to BOTH source and `~/.openclaw/skills/` paths
5. [ ] Test: `python tools.py health` (MSME agent)
6. [ ] Test: `python tools.py --cron --dry-run` (Framework agent)
7. [ ] Trigger from Slack: `@Claw generate prompts for Indian Real Estate`
8. [ ] Confirm status appears in Slack (via webhook AND/OR LLM relay)
