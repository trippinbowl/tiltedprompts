# TILTED PROMPTS: MASTER WIKI & HOLY GRAIL

> **CRITICAL INSTRUCTION FOR ALL AI AGENTS:**
> If you are an AI assistant (Claude, Cursor, Gemini, etc.) reading this file, this is your undeniable source of truth. You MUST align all code, architecture, and task suggestions with the rules and state defined in this document. Do not diverge from the core business goal. Update the active tasks upon completion.

---

## 1. The Core Manifesto
We build production-grade primitives for autonomous systems and AI agencies.
Our stack is decoupled securely:
- **Frontend**: Next.js (App Router), Tailwind CSS, Framer Motion (`/website`). Modern aesthetic AI Agency, catering to the world and Indian market.
- **Backend/Database**: Supabase (Auth, PostgreSQL). Architecture designed for easy scalability and transferability.
- **Automation/Logic**: OpenClaw, Python, n8n (`/backend`, `/openclaw`)
- **Aesthetic**: Classy Modern, Dark-mode first, high-end agency feel.

## 2. Multi-Agent Development Protocol
We develop decoupled products separately to circumvent AI context limits, integrating them via strict API contracts.
- **Frontend Tasks**: Handled inside `g:\AI_Projects\ai-agency\website`.
- **Backend API/Logic Tasks**: Handled inside `g:\AI_Projects\ai-agency\backend` or `g:\AI_Projects\ai-agency\mcp-servers`.
- **Integration**: All subsystems communicate via REST APIs or MCP standard protocols. Never tightly couple Next.js logic directly to local Python scripts.

## 3. Current System State
* **Website Storefront**: COMPLETE. Live at `/website`. Features fully animated landing, product pages, and a Classy Modern UI.
* **Members Dashboard UI**: MOCKED. Hardcoded placeholder assets exist at `/members`.
* **Database & Auth**: PENDING. Needs Supabase integration.
* **Asset Auto-Generation**: PENDING. Needs integration with OpenClaw after database schema is final.

---

## 4. The Master Task List (The Holy Grail)

*When processing tasks, work strictly from top to bottom. Do not start Phase C until Phase B is completed.*

### Phase A: Core Infrastructure (NEXT)
- [ ] Set up Supabase project and define `users`, `tiers`, and `library_assets` tables.
- [ ] Implement NextAuth / Supabase Auth in the Next.js `website/` to protect the `/members` route.
- [ ] Connect the `/members` UI to pull live data from the Supabase database instead of placeholders.

### Phase B: Launch Requirements (Feb 28 Target)
- [ ] Integrate Stripe Checkout for the "Upgrade to Pro" flow, retiring the Razorpay-only plan for now.
- [ ] Build the FastAPI `/api/v1/ingest-bundle` endpoint alongside the active Flask app, secured with HMAC signatures.
- [ ] Refactor `/members` Next.js pages to fetch dynamically from the Supabase database.
- [ ] Deploy to Vercel and verify webhook flows and RLS policies.

### Phase C: Post-Launch Deferrals (March 2026)
- [ ] Implement TiltedMCP Node.js servers with rate limiting (100 req/min Free, 1000 req/min Pro) and circuit breakers.
- [ ] Develop TiltedVoice telephony system and WebSocket infrastructure.
- [ ] Package TiltedCode Next.js templates.
- [ ] Automate the OpenClaw content flywheel pipeline completely.

---

## 5. Agent Update Protocol
**Before ending a session, the AI agent must update this Wiki:**
1. Check off completed items in the Master Task List.
2. Update the "Current System State" to reflect new capabilities.
3. Log any new API keys or environmental dependencies required for the project to run.
