# TiltedPrompts: Internal Automation & Agent Architecture
**Role Setup & Technical Tutorial for New Engineers**

Welcome to the TiltedPrompts engineering team! This living document serves as your onboarding manual for our **Autonomous Digital Asset Pipeline**. Here, you will learn exactly how our AI agents operate, how they integrate with Slack, and the technical lifecycle of a digital asset as it travels from a Slack message directly into our production Next.js application.

---

## 1. System Glossary & Definitions

Before exploring the architecture, familiarize yourself with these core technical terms used daily in our pipeline:

- **OpenClaw ("The Brain"):** Our Python-based autonomous agent framework. It acts as the orchestrator, sitting behind our Slack workspace, listening to commands, analyzing intent, and executing Python "Skills".
- **Agent Skill:** A modular Python script (`tools.py` and `instructions.md`) that gives OpenClaw the ability to perform a specific function. We currently have two main skills for asset generation.
- **The Factory (Flask Backend):** A local Python Flask API running on port `5000`. It receives structured requests from OpenClaw, interacts directly with our local LLM (Large Language Model), and forces the AI to output correctly structured JSON.
- **Ingestion API (Next.js):** A secure REST endpoint (`/api/ingest-bundle`) on our frontend server that receives the generated JSON from OpenClaw, validates its cryptographically signed HMAC signature, and pushes the data to the database.
- **Supabase:** Our PostgreSQL database provider. It houses the `library_assets` table.
- **HMAC-SHA256:** A cryptographic hashing algorithm used to securely authenticate that incoming data to the Ingestion API actually came from our OpenClaw agent and wasn't spoofed by an attacker.

---

## 2. High-Level Architecture Diagram
When you type a command into Slack, an end-to-end automated pipeline is triggered. 

```text
  [1. User on Slack] 
         │ 
         ▼ (Triggers @Claw)
  [2. OpenClaw Agent Router] ─── Analyzes Intent ──┐
                                                   │
                ┌──────────────────────────────────┴────────────────────────────────┐
                ▼                                                                   ▼
      [3A. MSME Agent Skill]                                           [3B. Framework Agent Skill]
   (`tilted_generator`)                                      (`tilted_framework_generator`)
   For simple, fill-in-the-blank                               For high-end, complex modular
   templates (e.g., WhatsApp texts)                            blueprints (e.g., CFO Dashboards)
                │                                                                   │
                └──────────────────────────────────┬────────────────────────────────┘
                                                   ▼ 
                                      [4. Flask Backend "The Factory"]
                        Talks to Local LLM to strictly generate structured JSON
                                                   │
                                                   ▼
                                         [5. Ingestion API]
                      Next.js Endpoint POST /api/ingest-bundle (HMAC Verified)
                                                   │
                                                   ▼
                                        [6. Supabase Database]
                                Inserts the JSON into `library_assets`
                                                   │
                                                   ▼
                                      [7. Next.js Dashboard Hub]
                        Asset is immediately live and visible to all users!
```

---

## 3. The Dual-Agent Engine

We don't use a single "one size fits all" AI bot. We utilize a **Dual-Mode Agent Architecture** to ensure asset formatting is perfect based on the target audience.

### Agent 1: The MSME Agent (`tilted_generator`)
- **Target Audience:** Small/Medium Business Owners (bakeries, local real estate brokers, chartered accountants).
- **Output Style:** "Dumbed-down", copy-paste ready, fill-in-the-blank templates. Zero prompt-engineering required by the end user.
- **Trigger Rule:** This is the default agent. If your Slack command asks for simple prompts, messages, templates, emails, or captions, this agent handles it.

### Agent 2: The Framework Agent (`tilted_framework_generator`)
- **Target Audience:** Creators, Agencies, and Pro users.
- **Output Style:** Highly structured, technical, multi-parameter blueprints utilizing rigid section headers (e.g., `ASPECT RATIO:`, `SUBJECT:`, `COMPOSITION RULES:`).
- **Trigger Rule:** You **MUST** include the exact keyword `framework` in your Slack command.

---

## 4. Slack Usage Tutorial

As an internal team member, you can command the AI fleet directly from our designated Slack channel.

### Generating Simple MSME Prompts (No "Framework" Keyword)
To generate quick, easy-to-use templates for local businesses:
> `@Claw generate 5 WhatsApp apology messages for late food delivery from a local restaurant`
> `@Claw create 3 Instagram captions for a local bakery's new chocolate cake`

**What Happens:**
1. OpenClaw receives the message and detects no "framework" keyword.
2. It routes the task to `tilted_generator`.
3. The LLM creates simple texts like: `Hey [CUSTOMER_NAME], sorry your food was late...`
4. You get a ✅ Success message in Slack.

### Generating Complex Frameworks (Requires "Framework" Keyword)
To generate complex, high-value blueprints:
> `@Claw generate a framework for creating a cinematic SaaS product launch thumbnail`
> `@Claw build a framework prompt for analyzing SEO keywords from an Excel export`

**What Happens:**
1. OpenClaw detects the word "framework".
2. It routes the task to `tilted_framework_generator`.
3. The LLM creates a hyper-structured visual layout with `[BRACKETED]` constraint variables.
4. You get a ✅ Success message in Slack.

### Cron Mode (Full Autopilot)
You don't *have* to use Slack. The OpenClaw agents are configured to run automatically on a set schedule. By invoking the `--cron` flag on their respective `tools.py` via Windows Task Scheduler, the bots will automatically check the day of the week, pick a unique pre-programmed niche (e.g., "Tuesday is Real Estate day"), and automatically push an asset to the site without any human input.

---

## 5. Behind-The-Scenes: The Technical Pipeline

Here is what happens technically when an agent successfully generates content:

1. **Generation:** The OpenClaw Python skill uses `requests.post()` to ping our Flask server (`http://localhost:5000/generate`), passing the niche, count, and strict system instructions.
2. **Validation:** Once the LLM generates the JSON, OpenClaw validates it. Does it start with an action verb like "Create"? (If yes, reject it, that's a meta-prompt). Is it too short? Does it have the required `[BRACKETS]`?
3. **Payload Signing:** OpenClaw creates a timestamp, turns the JSON into a string, and cryptographically signs it using an `INGEST_SECRET` env variable:
   `HMAC-SHA256(timestamp + "." + body, secret)`
4. **Ingestion Request:** It fires an HTTP POST to Next.js `http://localhost:3000/api/ingest-bundle` with custom headers: `X-Ingest-Key`, `X-Ingest-Timestamp`, `X-Ingest-Signature`.
5. **Database Bypass:** The Next.js API verifies the HMAC hash mathematically. If it passes, Next.js uses the **Supabase Service Role Key** (an admin-level key that safely bypasses Row Level Security) to securely forcibly inject the new data into the database.
6. **Live Rendering:** A split-second later, a Next.js `page.tsx` React component fetches that database row and dynamically renders the new asset onto the dashboard as an interactive, premium-styled component.

---

## 6. Daily Operations & Troubleshooting

If you are running the system locally and the agent fails to work in Slack, check this list:

| Error Symptom | Technical Cause | How to Fix It |
|---------------|-----------------|---------------|
| `Flask API unreachable (5000)` | The LLM factory backend isn't running. | Open a terminal, `cd backend`, and run `python bundle_generator.py`. |
| `HMAC authentication failed` | Environment variables in `.env.local` or OpenClaw don't match. | Check that `INGEST_API_KEY` and `INGEST_SECRET` match between your Next.js `.env.local` and your OpenClaw Python variables. |
| `Invalid API Key (Supabase)` | Next.js API is using a fake/invalid Service Role key. | Ensure `.env.local` has the real `SUPABASE_SERVICE_ROLE_KEY` starting with `eyJ...` and restart Next.js server (`npm run dev`). |
| Slack says "Error parsing JSON" | The LLM hallucinated and broke the JSON schema structure. | This happens rarely. Just re-run the Slack command. The agent retries automatically but gives up after 2 attempts. |

---
**End of Document**  
*Document maintained by TiltedPrompts Team. Will be updated as we transition from Soft Launch to Live Production V1.*
