# Framework Cron Operations — Tutorial & Process Guide

> **Last updated:** 2026-02-22
>
> This document explains how the overnight batch engine works, how to
> modify it, and how to operate it day-to-day.

---

## What This System Does

Every night between **10:00 PM and 5:00 AM IST**, the Framework Generator
automatically produces **50 unique premium prompt assets** from that day's
commercial category. Over a full week, this creates **350 premium assets**
that populate the TiltedPrompts marketplace.

```
┌─────────────────────────────────────────────────────────────┐
│  OVERNIGHT BATCH ENGINE                                     │
│                                                             │
│  10:00 PM IST                                               │
│     │                                                       │
│     ├── Determine today's category (Mon=Content, Tue=Mktg)  │
│     ├── Build 50 unique (sub_niche, industry) combinations  │
│     │                                                       │
│     ├── Iteration 1/50:                                     │
│     │   ├── generate_framework() → Flask → LLM              │
│     │   ├── validate_framework() → quality gate             │
│     │   ├── ingest_to_database() → Supabase                 │
│     │   └── time.sleep(~330s) → pace the LLM               │
│     │                                                       │
│     ├── Iteration 2/50: ...                                 │
│     ├── ...                                                 │
│     ├── Iteration 50/50: ...                                │
│     │                                                       │
│  ~5:00 AM IST                                               │
│     │                                                       │
│     └── Save batch report → logs/ directory                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## The 7 Commercial Categories

| Day | Category | What Gets Built | Why It Sells |
|-----|----------|----------------|-------------|
| Mon | Content & Copywriting | SEO blogs, podcast scripts, newsletter sequences | Every brand needs content marketing |
| Tue | Marketing & Advertising | Ad copy, email subjects, campaign planners | Direct revenue driver for businesses |
| Wed | Image Generation (Midjourney) | Product shots, portraits, mockups, packaging | Visual assets command premium prices |
| Thu | Sales & Cold Outreach | LinkedIn DMs, cold emails, objection playbooks | Sales teams buy tools that close deals |
| Fri | Logo & Graphic Design | Logos, brand palettes, business cards, icons | Every new business needs branding |
| Sat | Education & Course Creation | Course outlines, workshop scripts, quiz generators | $399B eLearning market |
| Sun | Resume & Job Tools | ATS resumes, cover letters, interview prep | Millions of job seekers monthly |

---

## How Task Variations Work

Each day's schedule has three components:

1. **`base_task`** — A template string with `{SUB_NICHE}` and `{INDUSTRY}` placeholders
2. **`sub_niches`** — 20 specific content types (e.g., "SEO-optimized blog posts")
3. **`industries`** — 25 target verticals (e.g., "B2B SaaS", "HealthTech")

The `_build_task_variations()` function creates all possible combinations
(20 x 25 = 500), then randomly samples 50 unique pairs. Each pair gets
substituted into the base_task to create a unique prompt generation request.

**Example for Monday (Content & Copywriting):**

```
base_task: "3 structured prompts for generating {SUB_NICHE} targeting {INDUSTRY}..."

Iteration 1: {SUB_NICHE} = "SEO-optimized long-form blog posts"
             {INDUSTRY} = "FinTech"

Iteration 2: {SUB_NICHE} = "podcast episode outlines with guest talking points"
             {INDUSTRY} = "Real Estate"

Iteration 3: {SUB_NICHE} = "weekly email newsletter sequences"
             {INDUSTRY} = "Cybersecurity"

... (47 more unique combinations)
```

**This guarantees 50 completely unique assets per night.**

---

## How to Modify the Schedule

### Adding a New Sub-Niche

Open `tools.py` and find the day you want to modify. Add a string to the
`sub_niches` list:

```python
# In NICHE_SCHEDULE[0] (Monday — Content & Copywriting):
"sub_niches": [
    "SEO-optimized long-form blog posts...",
    "conversational podcast episode outlines...",
    # ... existing entries ...
    "Twitter/X thread generators with viral hook patterns",  # ← NEW
],
```

### Adding a New Industry

Same pattern — add to the `industries` list:

```python
"industries": [
    "B2B SaaS", "HealthTech", "FinTech",
    # ... existing entries ...
    "Climate Tech / Carbon Credits",  # ← NEW
],
```

### Changing the Number of Prompts Per Bundle

Edit the `count` field:

```python
"count": 3,   # Each bundle contains 3 structured prompts
# Change to 5 if you want denser bundles (but generation takes longer)
```

### Adding a Brand New Day/Category

Add a new key to NICHE_SCHEDULE (0-6 for Monday-Sunday):

```python
# This would replace whatever day you assign it to
NICHE_SCHEDULE[0] = {
    "category": "Your New Category",
    "base_task": "3 structured prompts for {SUB_NICHE} in {INDUSTRY}...",
    "sub_niches": ["item1", "item2", ...],
    "industries": ["industry1", "industry2", ...],
    "count": 3,
    "is_premium": True,
    "platforms": ["tag1", "tag2"],
}
```

---

## How to Change Batch Size

### Option 1: Environment Variable (Recommended)

```powershell
# Generate 100 assets instead of 50
$env:FRAMEWORK_BATCH_SIZE = "100"
python tools.py --cron
```

### Option 2: CLI Flag (One-Time Override)

```powershell
# Quick 5-asset test
python tools.py --cron --batch-size 5 --sleep 30
```

### Option 3: Edit the Default

In `tools.py`, change the constant:

```python
CRON_BATCH_SIZE = int(os.getenv("FRAMEWORK_BATCH_SIZE", "50"))
#                                                        ^^^^
#                                           Change this default
```

---

## How Sleep Is Calculated

The sleep between generations is calculated dynamically to span the
overnight window:

```
sleep = (window_hours * 3600 - batch_size * est_gen_seconds) / (batch_size - 1)
```

With defaults (7h window, 50 batch, 180s generation):
```
sleep = (7 * 3600 - 50 * 180) / 49
      = (25200 - 9000) / 49
      = 16200 / 49
      = ~330 seconds (~5.5 minutes)
```

Total estimated duration: 50 * (180 + 330) / 3600 = **7.1 hours**

The minimum sleep floor is 60 seconds (configurable via `FRAMEWORK_MIN_SLEEP`).

### Override Sleep

```powershell
# Force 2-minute sleep (faster, but may stress the LLM)
python tools.py --cron --sleep 120

# Force 10-minute sleep (slower, but very gentle on resources)
python tools.py --cron --sleep 600
```

---

## How to Run

### Dry Run (Preview Only — No LLM Calls)

Always do a dry run first to verify the schedule looks correct:

```powershell
python tools.py --cron --dry-run
```

This prints all 50 task strings without making any API calls.

### Quick Test (5 Assets)

```powershell
python tools.py --cron --batch-size 5 --sleep 30
```

### Full Overnight Run

```powershell
python tools.py --cron
```

### Via Windows Task Scheduler

Set up a scheduled task:

```
Program:    python
Arguments:  G:\AI_Projects\ai-agency\openclaw\skills\tilted_framework_generator\tools.py --cron
Start in:   G:\AI_Projects\ai-agency
Trigger:    Daily at 10:00 PM
```

Make sure:
- The Flask backend is running (`python backend/bundle_generator.py`)
- The LLM server is running (LM Studio or DeepSeek configured)
- All `TILTEDPROMPTS_*` environment variables are set

---

## Monitoring a Running Batch

### Check Logs in Real-Time

If running in a terminal, you'll see live output:

```
[  1/ 50] Generating: 3 structured ChatGPT/Claude prompts for SEO-opt...
[  1/ 50] OK — 'SEO Blog Framework — FinTech Edition' (42.3s)
  Sleeping 330s... [1 ok / 0 fail / 0 dup] (0.0h elapsed, ~49 left)
[  2/ 50] Generating: 3 structured prompts for podcast episode outlin...
[  2/ 50] OK — 'Podcast Episode Blueprint — Real Estate' (38.7s)
  Sleeping 330s... [2 ok / 0 fail / 0 dup] (0.1h elapsed, ~48 left)
```

### Check Batch Report After Completion

Reports are saved as JSON files in the `logs/` directory:

```powershell
# List all batch reports
ls G:\AI_Projects\ai-agency\openclaw\skills\tilted_framework_generator\logs\

# Read the latest report
Get-Content (Get-ChildItem "G:\AI_Projects\ai-agency\openclaw\skills\tilted_framework_generator\logs\*.json" | Sort-Object LastWriteTime | Select-Object -Last 1).FullName
```

Each report contains:
- `day` and `category`
- `successes`, `failures`, `duplicates` counts
- `elapsed_hours` total runtime
- `results[]` with every iteration's task and outcome

### Interrupting Safely

Press `Ctrl+C` to stop. The batch will:
1. Catch the KeyboardInterrupt
2. Save all partial results to the report file
3. Exit cleanly

You can re-run `--cron` later — it will generate fresh random combinations,
so some may repeat but most will be new.

---

## Handling Failures

The batch engine is designed to be **failure-tolerant**:

| Failure Type | What Happens |
|-------------|-------------|
| LLM timeout on 1 generation | Retry once, then count as failure and continue |
| Flask API returns 502 | Count as failure and continue to next task |
| Validation fails (bad LLM output) | Retry once with stronger directive, then skip |
| Duplicate title (409) | Count as duplicate, skip and continue |
| Rate limit hit (429) | Count as failure, continue (resets hourly) |
| Network error | Count as failure and continue |
| Unhandled crash | Log the error, count as failure, continue |
| KeyboardInterrupt | Save partial report and exit |

**The batch NEVER crashes entirely.** Individual failures are logged and
the next iteration proceeds normally.

---

## Scaling Considerations

### To 100 Assets Per Night

```powershell
$env:FRAMEWORK_BATCH_SIZE = "100"
$env:FRAMEWORK_WINDOW_HOURS = "7"
# Sleep will auto-calculate to ~100s between generations
python tools.py --cron
```

Make sure you have enough sub_niche x industry combinations (currently
500 per day, so 100 is well within range).

### To Multiple Categories Per Night

Run multiple cron jobs at staggered times:

```
10:00 PM — python tools.py --cron --batch-size 25 (today's category)
02:00 AM — python tools.py --cron --batch-size 25 (manually override category)
```

Note: currently `--cron` always uses today's weekday. To force a different
day, set the system clock or modify the code to accept a `--day` flag.

### To a Cloud Server

The same tools.py works anywhere Python runs. Just set the environment
variables and point `TILTEDPROMPTS_API_URL` to your deployed Flask instance
(or use DeepSeek API instead of local LLM).

---

## Quick Reference Card

```
┌─────────────────────────────────────────────────────────────┐
│  FRAMEWORK CRON — QUICK REFERENCE                           │
│                                                             │
│  Preview:    python tools.py --cron --dry-run               │
│  Test (5):   python tools.py --cron --batch-size 5 --sleep 30│
│  Full run:   python tools.py --cron                         │
│  Health:     python tools.py health                         │
│                                                             │
│  Batch size: FRAMEWORK_BATCH_SIZE env var (default: 50)     │
│  Window:     FRAMEWORK_WINDOW_HOURS env var (default: 7)    │
│  Min sleep:  FRAMEWORK_MIN_SLEEP env var (default: 60)      │
│                                                             │
│  Reports:    ./logs/framework_batch_*.json                  │
│  Schedule:   NICHE_SCHEDULE dict in tools.py                │
│  Directive:  FRAMEWORK_DIRECTIVE constant in tools.py       │
│                                                             │
│  Weekly output: 50 assets/night x 7 days = 350 assets/week  │
│  Combinations:  500 unique per day (20 x 25)                │
│  Repetition:    ~10 weeks before any combo repeats           │
└─────────────────────────────────────────────────────────────┘
```

---

## File Reference

| File | Purpose |
|------|---------|
| `openclaw/skills/tilted_framework_generator/tools.py` | Core engine: schedule, generation, validation, cron loop, CLI |
| `openclaw/skills/tilted_framework_generator/SKILL.md` | OpenClaw skill definition: laws, triggers, protocol |
| `openclaw/skills/tilted_framework_generator/logs/` | Batch report JSON files (auto-created) |
| `docs/FRAMEWORK_CRON_OPERATIONS.md` | This document |
| `docs/SLACK_AGENT_TUTORIAL.md` | Slack commands and dual-agent routing |
| `openclaw/openclaw_setup.md` | Deployment and environment setup |
