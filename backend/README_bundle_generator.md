# tiltedprompts – Bundle Generator

AI prompt bundle generator API for Indian SMBs and solopreneurs.

## Quick Start

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env        # then edit .env with your settings
python bundle_generator.py   # starts server on http://localhost:5000
```

## Self-Test (One Command)

With the server running in another terminal:

```bash
python self_test.py
```

This tests: health → LLM generation → bundle listing → report → lead capture.

Add `--skip-llm` to skip the LLM call, or `--send-email` to also send a test email to yourself.

---

## Testing Guide (Step-by-Step)

### Step 1: Start LM Studio

1. Open LM Studio
2. Load your model (e.g., `deepseek-r1-0528-qwen3-8b`)
3. Start the local server on port **1234** (LM Studio → Local Server → Start)
4. Verify it's running: the LM Studio UI should show "Server running on port 1234"

### Step 2: Start the Flask Server

```bash
cd g:\AI_Projects\ai-agency\backend
python bundle_generator.py
```

You should see:
```
Starting tiltedprompts Bundle Generator on 0.0.0.0:5000
LLM Provider: local
Endpoints: /generate, /bundles, /health, /gumroad-webhook, ...
```

### Step 3: Generate a Bundle

In a **new terminal** (keep the server running):

```powershell
# Quick self-test (generates 3 prompts, ~30-90 seconds)
python self_test.py

# Or manually via PowerShell:
$body = '{"niche":"WhatsApp marketing for Indian retail","bundle_type":"prompts","count":3}'
Invoke-RestMethod -Uri "http://localhost:5000/generate" -Method Post -Body $body -ContentType "application/json" | ConvertTo-Json -Depth 10
```

### Step 4: Send a Test Email to Yourself

```powershell
# Make sure GMAIL_USER and GMAIL_APP_PASSWORD are set in .env, then:
python self_test.py --send-email

# Or manually trigger the lead capture email:
$body = '{"email":"YOUR_EMAIL@gmail.com","name":"Test","niche":"testing"}'
Invoke-RestMethod -Uri "http://localhost:5000/lead-capture" -Method Post -Body $body -ContentType "application/json"
```

### Step 5: Test from Slack (after OpenClaw setup)

```
generate_bundle "Instagram marketing for Indian D2C brands" 5 mixed
list_bundles
preview_bundle "Instagram"
daily_report
```

---

## API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/health` | GET | Health check |
| `/generate` | POST | Generate prompt bundle via LLM |
| `/bundles` | GET | List all bundles |
| `/bundles/<folder>` | GET | Get specific bundle |
| `/bundles/<folder>/preview` | GET | Preview with 3 samples |
| `/gumroad-webhook` | POST | Handle Gumroad purchase |
| `/verify-license` | POST | Chrome extension Pro unlock |
| `/lead-capture` | POST | Capture lead → send free prompts |
| `/report` | GET | Sales analytics report |

## LLM Configuration

Set `LLM_PROVIDER` in `.env`:

| Provider | Value | Requirements |
|----------|-------|-------------|
| Local LLM | `local` | Set `LOCAL_LLM_URL` or `LOCAL_LLM_BASE_URL` |
| DeepSeek | `deepseek` | Set `DEEPSEEK_API_KEY` |

The system includes robust JSON parsing that handles DeepSeek-R1 `<think>` blocks, markdown fences, and mixed text around JSON output.

## File Structure

```
backend/
├── bundle_generator.py     # Flask API server (all endpoints)
├── llm_provider.py         # LLM abstraction (local ↔ DeepSeek)
├── webhook_handler.py      # Gumroad webhook + report + lead capture
├── email_service.py        # Gmail SMTP with templates
├── config.py               # Central config from .env
├── self_test.py            # One-command self-test
├── test_e2e.py             # Pipeline test (no LLM needed)
├── .env.example            # Environment template
├── requirements.txt        # Python deps
├── templates/
│   ├── product_email.html  # Purchase delivery email
│   └── lead_magnet_email.html
└── bundles/                # Generated bundles saved here
```
