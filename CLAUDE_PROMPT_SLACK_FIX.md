# Claude Prompt: Fixing OpenClaw Slack Output & Ingestion Failures

**Copy and paste the entire block below to Claude to help resolve the issue:**

***

**Context:**
I am building an AI Prompt/Asset library called TiltedPrompts. I am using **OpenClaw** as my autonomous agent framework connected to a Slack workspace.
I have two main Python-based "skills" registered in `~/.openclaw/skills/`:
1. `tilted_generator` 
2. `tilted_framework_generator`

Each skill has a `SKILL.md` (which tells the OpenClaw LLM when to route to it) and a `tools.py` script.
The architectural flow when I message Slack is:
1. User messages `@Claw framework for a SaaS logo`.
2. OpenClaw routes to `tilted_framework_generator`.
3. OpenClaw executes `python tools.py framework --task "..."`.
4. `tools.py` calls my local Flask API to generate the prompt via LLM.
5. `tools.py` then takes the generated JSON and POSTs it to my Next.js API (`/api/ingest-bundle`), which authenticates via HMAC and saves it into Supabase.

**The Current Problems:**
1. **Silent Failures on DB Upload:** When I request a prompt in Slack, sometimes the LLM generation works, but the upload to the Supabase library completely fails in the background. My AI coding assistant (Antigravity) found that it was sometimes due to the Next.js dev server being down, or a hardcoded rate limit.
2. **Missing Failsafe / Slack Output:** Even when things fail, or when they succeed, the OpenClaw Slack bot does not give me a clear status. It often just dumps conversational filler or raw JSON. It does not behave like a standard bot updating me on its progress.
3. **What I Want:** I need the Slack bot to explicitly output the status of the pipeline, providing a flow like: 
   `Run (done) | Upload on TiltedPrompts Library (done)`
   If the Next.js upload fails, I need Slack to explicitly say:
   `❌ ERROR: Failed to upload. Reason: [Error details]`

**What My Coding Assistant Has Already Tried:**
My assistant modified the end of `tools.py` to explicitly print strings to standard output, like this:
```python
        if not result.get("success"):
            print("\n❌ **ERROR: Failed to upload to library.**")
            print(f"Reason: {result.get('error', 'Unknown error')}")
            sys.exit(1)
        else:
            print(f"\n✅ **SUCCESS:** Asset uploaded to TiltedPrompts Library!")
            print(f"View it here: https://tiltedprompts.com/members/assets/{result.get('asset_id')}")
            sys.exit(0)
```
However, OpenClaw in Slack **still** ignores this precise stdout output and either fails silently or gives me unstructured conversational text. 

**Your Task:**
1. How do I force OpenClaw (via `SKILL.md` instructions or other configuration) to **strictly** pass the verbatim `stdout` from my Python script directly back to the user in Slack without the LLM trying to summarize or alter it?
2. How can I implement a bulletproof failsafe in this pipeline so that I *always* get a visible issue tracker/status update in Slack (e.g., "Run: Done | Upload: Failed")?
3. Provide the exact code modifications I need for `SKILL.md` and/or `tools.py` to achieve this strict bot-like output behavior in Slack.
