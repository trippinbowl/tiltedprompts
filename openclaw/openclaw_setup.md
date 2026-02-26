# tiltedprompts – OpenClaw Setup Guide (Windows)

Complete setup for OpenClaw + Slack + tiltedprompts skills on Windows.

---

## Step 1 — Install fnm (Node Version Manager)

Open **PowerShell as Administrator** and run:

```powershell
winget install Schniz.fnm --accept-package-agreements --accept-source-agreements
```

Close and reopen PowerShell after install.

## Step 2 — Install Node.js v22

```powershell
# Initialize fnm in this terminal (run this every new terminal, or add to profile)
fnm env --use-on-cd | Out-String | Invoke-Expression

# Install and activate Node.js 22
fnm install 22
fnm use 22
fnm default 22

# Verify
node --version   # should show v22.x.x
```

**To make fnm auto-load in every terminal**, add to your PowerShell profile:
```powershell
notepad $PROFILE
```
Add these lines, save, then restart PowerShell:
```powershell
fnm env --use-on-cd | Out-String | Invoke-Expression
```

## Step 3 — Install OpenClaw

```powershell
# Make sure fnm + Node 22 are active first:
fnm env --use-on-cd | Out-String | Invoke-Expression
fnm use 22

# Install OpenClaw globally
npm install -g openclaw@latest

# Verify
openclaw --version   # should show 2026.x.x
```

## Step 4 — Copy tiltedprompts Skills

All skills need to be in `~/.openclaw/skills/`:

```powershell
# Run from the ai-agency project root:
$skills = "$env:USERPROFILE\.openclaw\skills"
Copy-Item "g:\AI_Projects\ai-agency\openclaw\skills\*" "$skills\" -Recurse -Force
```

Verify skills are detected:
```powershell
openclaw skills list
```

You should see these skills listed:

| Skill | Purpose |
|-------|---------|
| `tilted_generator` | **Agent 1 — MSME**: Copy-paste-ready templates for Indian MSMEs |
| `tilted_framework_generator` | **Agent 2 — Framework**: Structured prompt blueprints for AI engineers |
| `generate_bundle` | Legacy bundle generator (superseded by Agent 1) |
| `list_bundles` | List all generated bundles |
| `preview_bundle` | Preview a bundle with sample prompts |
| `daily_report` | Sales summary with revenue and top products |

## Step 5 — Set Environment Variables

Both agents need these 4 environment variables:

```powershell
# Flask bundle generator
[System.Environment]::SetEnvironmentVariable("TILTEDPROMPTS_API_URL", "http://localhost:5000", "User")

# Next.js ingestion endpoint
[System.Environment]::SetEnvironmentVariable("TILTEDPROMPTS_INGEST_URL", "https://tiltedprompts.com/api/ingest-bundle", "User")

# HMAC authentication (replace with your actual keys)
[System.Environment]::SetEnvironmentVariable("TILTEDPROMPTS_INGEST_KEY", "tp_ingest_xxxxxxxxxxxxxxxx", "User")
[System.Environment]::SetEnvironmentVariable("TILTEDPROMPTS_INGEST_SECRET", "tp_secret_xxxxxxxxxxxxxxxxxxxxxxxx", "User")
```

**Restart PowerShell** after setting these.

## Step 6 — Run the Onboarding Wizard

```powershell
openclaw onboard
```

The wizard walks you through:

### 6a. LLM API Key

OpenClaw needs its own LLM API key for reasoning (separate from your bundle generator). Options:

- **Anthropic (Claude)**: Recommended. Get a key from https://console.anthropic.com/
- **OpenAI**: Get a key from https://platform.openai.com/api-keys
- **Local Ollama**: If you want zero cost, point OpenClaw to Ollama

### 6b. Slack Channel Setup

When the wizard asks about channels, choose **Slack**. You'll need to:

1. **Create a Slack App:**
   - Go to https://api.slack.com/apps → **Create New App** → **From Scratch**
   - Name: `TiltedPrompts Bot`
   - Workspace: Select your Slack workspace

2. **Set Bot Permissions** (OAuth & Permissions → Bot Token Scopes):
   - `chat:write`
   - `channels:read`
   - `channels:history`
   - `im:read`
   - `im:write`
   - `im:history`

3. **Install to Workspace** → click **Install** and authorize

4. **Copy the Bot User OAuth Token** (starts with `xoxb-...`)
   - Paste this into the OpenClaw wizard when asked for the Slack token

5. **Get your Bot's Member ID:**
   - In Slack, click on your bot's name → **View full profile** → three dots → **Copy member ID**
   - Paste this into the wizard when asked

6. **Invite the bot** to a channel: type `/invite @TiltedPrompts Bot` in any Slack channel

### 6c. Gateway

Accept defaults — the Gateway runs locally on your machine.

### 6d. Background Service

When asked, install OpenClaw as a daemon so it runs in the background:
```powershell
openclaw daemon install
openclaw daemon start
```

## Step 7 — Verify Everything

```powershell
# Check OpenClaw is running
openclaw health

# Check skills
openclaw skills check
```

## Step 8 — Test from Slack

Open your Slack workspace and message the TiltedPrompts bot:

### Agent 1 — MSME Templates (Simple, Copy-Paste Ready)

| Command | What it does |
|---------|-------------|
| `@Claw generate prompts for Indian Real Estate` | 5 WhatsApp follow-up messages for silent clients |
| `@Claw generate 5 new prompts for Shopify D2C brands` | 5 Instagram DM replies for "too expensive" comments |
| `@Claw create bundle for bakery` | 5 Instagram captions for a home baker |
| `@Claw run daily asset generation` | Triggers today's MSME cron schedule |

### Agent 2 — Framework Prompts (Structured, Premium)

| Command | What it does |
|---------|-------------|
| `@Claw framework SaaS thumbnail for Midjourney` | 3 structured Midjourney prompts with ASPECT RATIO:, LIGHTING: headers |
| `@Claw framework AI CFO quarterly report from CSV` | 3 ChatGPT/Claude prompts with ROLE:, OUTPUT FORMAT: headers |
| `@Claw framework n8n workflow for Gmail refund auto-responder` | 3 n8n architecture blueprints with TRIGGER:, ROUTING LOGIC: headers |

### Utility Skills

| Command | What it does |
|---------|-------------|
| `list_bundles` | Show all available bundles |
| `preview_bundle "Instagram"` | Preview a bundle with 3 sample prompts |
| `daily_report` | Sales summary with revenue and top products |

> **Routing rule:** If your message contains `framework`, it goes to Agent 2.
> Everything else goes to Agent 1. See `docs/SLACK_AGENT_TUTORIAL.md` for full details.

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `openclaw: command not found` | Run `fnm env --use-on-cd \| Out-String \| Invoke-Expression; fnm use 22` |
| Skills not showing | Re-copy skills: `Copy-Item "g:\AI_Projects\ai-agency\openclaw\skills\*" "$env:USERPROFILE\.openclaw\skills\" -Recurse -Force` |
| API not reachable | Ensure `bundle_generator.py` is running and `TILTEDPROMPTS_API_URL` env var is set |
| LLM errors (502) | Start LM Studio on port 1234 or set `LLM_PROVIDER=deepseek` in backend `.env` |
| Slack bot not responding | Check `openclaw health`, run `openclaw daemon restart` |

## Quick Reference

```powershell
# Start everything (3 terminals):

# Terminal 1: LM Studio (GUI) — load model, start server on port 1234

# Terminal 2: Backend
cd g:\AI_Projects\ai-agency\backend
python bundle_generator.py

# Terminal 3: OpenClaw (if not running as daemon)
fnm env --use-on-cd | Out-String | Invoke-Expression
fnm use 22
openclaw gateway
```

## Quick Deploy — Both Agents

Run this block any time you update skill files:

```powershell
# 1. Copy both agent skills to OpenClaw runtime
$skills = "$env:USERPROFILE\.openclaw\skills"
Copy-Item "G:\AI_Projects\ai-agency\openclaw\skills\tilted_generator" "$skills\" -Recurse -Force
Copy-Item "G:\AI_Projects\ai-agency\openclaw\skills\tilted_framework_generator" "$skills\" -Recurse -Force

# 2. Verify both are detected
openclaw skills list

# 3. Restart the daemon so it picks up changes
openclaw daemon restart

# 4. Syntax-check both tools.py files
python -m py_compile "G:\AI_Projects\ai-agency\openclaw\skills\tilted_generator\tools.py"
python -m py_compile "G:\AI_Projects\ai-agency\openclaw\skills\tilted_framework_generator\tools.py"

# 5. Quick health check
python "G:\AI_Projects\ai-agency\openclaw\skills\tilted_generator\tools.py" health
python "G:\AI_Projects\ai-agency\openclaw\skills\tilted_framework_generator\tools.py" health
```

## CLI Test — Run Both Agents Manually

```powershell
# Test Agent 1 (MSME) — generates 5 simple templates
python "G:\AI_Projects\ai-agency\openclaw\skills\tilted_generator\tools.py" generate --niche "Indian Real Estate" --count 5

# Test Agent 2 (Framework) — generates 3 structured prompts
python "G:\AI_Projects\ai-agency\openclaw\skills\tilted_framework_generator\tools.py" framework --task "Cinematic SaaS thumbnail for Midjourney" --count 3

# Test Cron for both
python "G:\AI_Projects\ai-agency\openclaw\skills\tilted_generator\tools.py" --cron
python "G:\AI_Projects\ai-agency\openclaw\skills\tilted_framework_generator\tools.py" --cron
```
