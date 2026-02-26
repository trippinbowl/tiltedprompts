# Production Backend & Automation Strategy

This document outlines the step-by-step technical architecture for TiltedPrompts' backend production environment. It defines the exact libraries, the orchestration roadmap, and how the entire system communicates securely. 

## 1. Automation Libraries & Technology Stack
We must avoid hallucinating unmaintained or complex libraries. Here is the strict, battle-tested stack we will use for production:

*   **Database & Auth (The Core Truth):**
    *   `supabase-js` (Node/Browser) & `supabase-py` (Python).
    *   **Why**: Handles PostgreSQL, Row Level Security (RLS), and Authentication via a single unified API.
*   **The Orchestration Backend (Python):**
    *   **Existing `Flask` App**: Retained exclusively for the bundle generation logic, LLM abstraction, and testing. It works, so we don't rewrite it.
    *   **New `FastAPI` + `Uvicorn` App**: An entirely separate service for building the external-facing ingestion pipeline.
    *   `Pydantic` (v2): For strict data validation during ingestion.
    *   `litellm`: Used primarily for dev/testing in the generator. Production usage will call provider APIs (like httpx) directly to reduce dependencies.
*   **The Visual Workflow Engine (n8n):**
    *   We will host a self-managed Docker instance of **n8n** to run the "Instagram to WhatsApp" pipelines.
    *   **Why**: It is the industry standard for visual, code-free automation and connects seamlessly with our PostgreSQL database and webhooks.
*   **The MCP Server Ecosystem (Node.js/TypeScript):**
    *   `@modelcontextprotocol/sdk`: The official SDK to build our `TiltedMCP` servers.
    *   `zod`: For validating arguments passed from the AI agent to our MCP tools.

## 2. Step-by-Step Production Backend Roadmap

### Step 1: Secure the Data Layer (Supabase)
Before writing any Python or Node logic, the database schemas and Row Level Security (RLS) policies must be bulletproof.
*   Create tables: `users` (id, tier, stripe_customer_id), `library_assets` (id, type, content, is_premium).
*   Enforce RLS: Only authenticated users with `tier = 'pro'` can execute `SELECT` on premium rows in `library_assets`.

### Step 2: Build the Ingestion Pipeline (FastAPI)
We need a robust way to securely take what the Flask generator or OpenClaw creates and put it into production.
*   Create a clean FastAPI server alongside the Flask app in `backend/api`.
*   Expose a secure POST endpoint (`/api/v1/ingest-bundle`).
*   **SECURITY**: Protect this endpoint with **HMAC request signing** and timestamps (not just a static API key, which can be leaked). Apply rate limiting (e.g., 10 req/min max for ingestion).
*   The system formats the output via **Pydantic** to guarantee schema correctness before it hits the database.

### Step 3: Scaffold TiltedMCP Servers (TypeScript)
*   Initialize a standalone Node.js package in `/mcp-servers/tilted-postgres`.
*   Implement the `@modelcontextprotocol/sdk` to expose simple database query tools.
*   Add authentication middleware to the MCP server so only users with an active TiltedPrompts API key can connect their local Cursor/Claude apps to it.

### Step 4: Wire the Frontend to the Backend (Next.js)
*   The Next.js App Router (already built) queries Supabase directly on the server side (`await supabase.from('library_assets').select()`).
*   Because RLS handles the security, the frontend code remains incredibly thin and fast. No complex state management is required.

---

## 3. The Prompt for Claude
*Copy and paste the exact prompt below into your Claude Opus interface to align our strategies.*

**Prompt:**

```markdown
I am building a comprehensive AI Agency and Product Studio called "TiltedPrompts". Our motto is: "We compress the distance between human intent and functional architecture."

Our stack is strictly decoupled:
- **Frontend**: Next.js (App Router), Tailwind CSS.
- **Backend/DB**: Supabase (PostgreSQL, Auth, RLS).
- **Automation/AI Logic**: Python (FastAPI, Pydantic, litellm), OpenClaw, and self-hosted n8n.
- **MCP Servers**: Built in Node.js/TypeScript using the official Model Context Protocol SDK.

Please read the `TILTED_PROMPTS_WIKI.md` and `LAUNCH_CALENDAR_FEB_28.md` documents in my local workspace to understand our current state and ambitious 7-day launch plan. Then review the `PRODUCTION_BACKEND_STRATEGY.md`.

**Your Task:**
1. Acknowledge the current state and our commitment to decoupled microservices.
2. Review the Backend Strategy (Supabase -> FastAPI -> OpenClaw -> MCP). Are there any critical edge cases, security flaws, or rate-limiting concerns we missed for a production deployment aimed at Indian MSMEs and global AI engineers?
3. Suggest the optimal folder structure for the `backend/` Python API to ensure it remains highly scalable.
4. Give me the green light on this architecture, or passionately debate why a specific technology choice should be swapped out before we write the code.
```
