# TiltedPrompts — Product Spec & Operating Plan
## "Shared Memory and Tools for AI Teammates"

**Version:** 1.0 — February 2026
**Author:** Founder + Claude (AI Co-Founder & Systems Architect)
**Status:** Working spec for Antigravity, Perplexity, and Claude Code

---

# PART 1: HIGH-LEVEL VISION

## The One-Paragraph Pitch

TiltedPrompts is the **shared memory and tools backbone for vibe coding**. Every AI coding tool today — Cursor, Claude Code, Antigravity, Windsurf — suffers from the same structural problem: agents are stateless, context windows are tiny, and there's no way to coordinate multiple agents on one project with shared state. TiltedPrompts fixes this by providing a **production-grade MCP infrastructure layer** (TiltedMCP) that gives any AI agent persistent memory, shared project context, and coordination tools — without locking you into our IDE or our ecosystem. We're not building another workspace. We're building the **connective tissue** that makes every workspace smarter.

## Why Now

Three market forces are converging in 2026:

1. **MCP is now the universal standard.** Anthropic donated it to the Linux Foundation in Dec 2025. Claude, Cursor, Windsurf, Antigravity, VS Code — they all speak MCP. The protocol won. Now the question is: who builds the best servers?

2. **Memory is the acknowledged missing piece.** The developer community has identified that "agent memory" needs to be a first-class MCP primitive, not a hack. Most teams are currently using workarounds like markdown files rewritten every cycle. Nobody has shipped production-grade shared memory infrastructure yet.

3. **Vibe coding is mainstream.** 85% of developers now use AI coding tools daily. The market has fractured into IDEs (Cursor, Antigravity), CLI agents (Claude Code), and platforms (BridgeMind). All of them need better context and memory. None of them want to build it themselves.

## What TiltedPrompts Builds (Three Products, One Backbone)

### TiltedMCP — "Shared Memory for AI Teammates"
Production-grade MCP servers that give any AI agent:
- **Persistent memory** across sessions, projects, and tools
- **Shared workspace context** so multiple agents see the same state
- **Coordination tools** (task tracking, handoffs, conflict resolution)
- **Knowledge retrieval** (semantic search over your codebase, docs, decisions)

Works with: Claude Code, Cursor, Windsurf, Antigravity, any MCP client.
Does NOT require: our IDE, our CLI, or leaving your workflow.

### TiltedVoice — "Meeting Intelligence for AI Teams"
Voice and conversation layer that captures meetings, standups, and pair programming sessions and feeds them into the same memory backbone:
- Real-time transcription + summarization
- Auto-extraction of decisions, action items, and context changes
- Memory injection: what you said in a meeting becomes context your agents can reference
- Works as a standalone meeting tool OR integrates into TiltedMCP memory

### TiltedSpace — "The Workspace Where Everything Connects"
The unified environment (Phase 3, post-validation):
- Project dashboard: agents, memory, tasks, docs in one view
- Multi-agent orchestration: assign tasks, track progress, see diffs
- Built on top of TiltedMCP — it's the UI layer, not the core
- Think: "mission control for vibe coders"

---

# PART 2: THE PAIN WE SOLVE

## Pain Point Map

| Pain Point | Who Feels It | Current Workaround | TiltedPrompts Solution |
|-----------|-------------|-------------------|----------------------|
| **Agents forget everything between sessions** | Every vibe coder | Copy-paste context, CLAUDE.md files, manual summaries | TiltedMCP Memory Server: persistent, searchable, auto-maintained |
| **Context windows are too small** | Power users on big codebases | Split work into tiny chunks, lose coherence | TiltedMCP Knowledge Server: semantic retrieval of exactly what's relevant |
| **Multiple agents can't share state** | Teams using Cursor + Claude Code + Antigravity | Manual copy between tools, duplicate work | TiltedMCP Workspace State: one source of truth, multiple consumers |
| **No coordination between agents** | Anyone running parallel agents | Hope they don't conflict, merge manually | TiltedMCP Task Server: assignments, locks, conflict detection |
| **Meetings/decisions don't reach agents** | Teams, pair programmers | Type up summaries manually, paste into prompts | TiltedVoice: auto-captures decisions, feeds into memory |
| **Too many disconnected tools** | Everyone | Tab-switch between 5 apps, context lost at every switch | TiltedSpace: unified view of all agents, memory, and tasks |

## Why This Can't Be Solved by Existing Players

- **Cursor/Windsurf/Antigravity** won't build it — they're IDE companies. Memory infrastructure is orthogonal to their core product. They'd rather integrate with someone who solves it.
- **Anthropic/OpenAI** won't build it — they're model companies. They ship reference MCP servers, not production infrastructure. Their memory server is a demo, not a product.
- **BridgeMind** is building it, but they're **platform-locked** — you have to use BridgeSpace (their Electron IDE) to get the full benefit. Most vibe coders already have a tool they love (Cursor, Claude Code, Antigravity). They don't want another IDE.
- **Vector DB companies** (Pinecone, Qdrant, Chroma) provide storage, not intelligence. They don't understand the *semantics* of software development — what a "decision" is, what a "task" is, what "project context" means.

---

# PART 3: COMPETITIVE POSITIONING

## TiltedPrompts vs BridgeMind — Head-to-Head

| Dimension | BridgeMind | TiltedPrompts |
|----------|-----------|---------------|
| **Philosophy** | Platform (come into our world) | Infrastructure (we come to yours) |
| **IDE** | BridgeSpace (their own Electron app) | None — works with YOUR editor |
| **CLI** | BridgeCode (their own CLI) | None — works with Claude Code, any CLI |
| **MCP Server** | BridgeMCP (tied to their platform) | TiltedMCP (standalone, works everywhere) |
| **Voice** | BridgeVoice (local Whisper, dictation only) | TiltedVoice (meeting intelligence + memory injection) |
| **Memory** | Part of their platform, not standalone | Standalone product, pluggable into anything |
| **Content/Assets** | Prompt library (static) | Laboratory: AI-generated 350+ assets/week, continuously growing |
| **Pricing** | $20/mo for everything bundled | Modular: use only what you need |
| **Audience** | Vibe coders who want one platform | Vibe coders who already have a setup and want better memory |
| **Lock-in** | High (proprietary ecosystem) | Low (MCP is an open standard, our servers are composable) |
| **Community** | 70K+ builders | Building (leveraging Laboratory as entry point) |

### Our Moat
1. **Infrastructure, not platform.** We don't compete with your IDE — we make it better.
2. **Laboratory flywheel.** 350+ AI-generated assets/week provide free-tier content that drives top-of-funnel.
3. **Meeting intelligence.** BridgeVoice is dictation. TiltedVoice is meeting capture → memory injection. Fundamentally different value.
4. **Open integration.** We work with Cursor AND Claude Code AND Antigravity. BridgeMind tries to replace all of them.

## Positioning Statement

> **For vibe coders who use Cursor, Claude Code, or Antigravity**, TiltedPrompts provides **shared memory and tools infrastructure** via MCP servers that give your AI teammates persistent context, shared state, and coordination — **without leaving your editor or switching platforms.**
>
> Unlike BridgeMind, which requires their proprietary IDE and CLI, TiltedPrompts is **editor-agnostic infrastructure** that makes whatever you already use smarter.

---

# PART 4: TECHNICAL ARCHITECTURE — TiltedMCP v1

## Architecture Overview

```
                    ┌──────────────────────────────────────┐
                    │         VIBE CODER'S MACHINE         │
                    │                                       │
                    │  ┌─────────┐  ┌─────────┐  ┌───────┐│
                    │  │ Cursor  │  │ Claude  │  │Antigr.││
                    │  │         │  │  Code   │  │       ││
                    │  └────┬────┘  └────┬────┘  └───┬───┘│
                    │       │            │           │     │
                    │       └──────┬─────┴───────────┘     │
                    │              │ MCP Protocol           │
                    │       ┌──────┴──────┐                 │
                    │       │  TiltedMCP  │                 │
                    │       │  (Local)    │                 │
                    │       └──────┬──────┘                 │
                    └──────────────┼────────────────────────┘
                                   │ HTTPS (encrypted)
                                   │ API Key auth
                                   ▼
                    ┌──────────────────────────────────────┐
                    │       TILTEDPROMPTS CLOUD             │
                    │                                       │
                    │  ┌──────────┐  ┌──────────────────┐  │
                    │  │ Auth &   │  │   Memory Engine   │  │
                    │  │ Billing  │  │  (Postgres + pgvec)│  │
                    │  │(Supabase)│  │                    │  │
                    │  └──────────┘  └──────────────────┘  │
                    │                                       │
                    │  ┌──────────┐  ┌──────────────────┐  │
                    │  │Knowledge │  │  Task/Workflow    │  │
                    │  │ Index    │  │  Coordinator     │  │
                    │  │(Embeddings)│ │                    │  │
                    │  └──────────┘  └──────────────────┘  │
                    │                                       │
                    │  ┌──────────────────────────────────┐ │
                    │  │  TiltedVoice (meeting capture)   │ │
                    │  │  → feeds into Memory Engine      │ │
                    │  └──────────────────────────────────┘ │
                    └──────────────────────────────────────┘
```

## Core MCP Servers (TiltedMCP v1)

### Server 1: `tilted-memory` — Persistent Memory
**What it does:** Stores and retrieves long-term memory for AI agents across sessions.

**MCP Tools exposed:**
- `memory.store(key, content, context, ttl?)` — Save a memory with optional expiry
- `memory.recall(query, scope?, limit?)` — Semantic search for relevant memories
- `memory.list(scope?, tag?)` — List memories by project/tag
- `memory.forget(key)` — Delete a specific memory
- `memory.summarize(scope)` — Get a compressed summary of all memories in a scope

**MCP Resources exposed:**
- `memory://project/{project_id}/recent` — Last 20 memories for this project
- `memory://project/{project_id}/decisions` — All architectural decisions
- `memory://global/preferences` — User-wide preferences and patterns

**Memory Schema:**
```sql
CREATE TABLE memories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    project_id TEXT NOT NULL,
    scope TEXT NOT NULL DEFAULT 'project',  -- 'global' | 'project' | 'session'
    key TEXT NOT NULL,
    content TEXT NOT NULL,
    content_embedding VECTOR(1536),  -- for semantic search
    memory_type TEXT NOT NULL DEFAULT 'general',
    -- Types: 'decision', 'preference', 'context', 'task', 'error', 'pattern'
    tags TEXT[] DEFAULT '{}',
    importance FLOAT DEFAULT 0.5,  -- 0-1, for prioritizing recall
    access_count INT DEFAULT 0,    -- tracks how often this memory is recalled
    last_accessed_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,        -- optional TTL
    source TEXT,                    -- 'agent:claude', 'agent:cursor', 'voice:meeting', 'manual'
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for fast recall
CREATE INDEX idx_memories_project ON memories(user_id, project_id);
CREATE INDEX idx_memories_type ON memories(memory_type);
CREATE INDEX idx_memories_embedding ON memories USING ivfflat (content_embedding vector_cosine_ops);
CREATE INDEX idx_memories_tags ON memories USING GIN(tags);
```

**How it works in practice:**
```
User in Cursor: "Hey, refactor the auth system to use JWT instead of sessions"

Cursor (via MCP) → tilted-memory.store({
    key: "decision-auth-jwt",
    content: "Decided to migrate from session-based auth to JWT. Reason: need stateless auth for microservices migration.",
    memory_type: "decision",
    tags: ["auth", "jwt", "architecture"]
})

Later, user in Claude Code: "What auth approach are we using?"

Claude Code (via MCP) → tilted-memory.recall({
    query: "authentication approach decision",
    scope: "project"
})
→ Returns: "Decided to migrate from session-based auth to JWT..."
```

### Server 2: `tilted-knowledge` — Workspace Knowledge
**What it does:** Indexes your codebase, docs, and conversations into a searchable knowledge base that agents can query.

**MCP Tools exposed:**
- `knowledge.index(path, type?)` — Index a file or directory
- `knowledge.search(query, filters?)` — Semantic search over indexed content
- `knowledge.explain(file_path)` — Get an AI-generated explanation of a file's purpose
- `knowledge.dependencies(file_path)` — Get dependency graph for a file
- `knowledge.recent_changes(since?)` — What changed recently and why

**MCP Resources exposed:**
- `knowledge://project/{id}/architecture` — High-level architecture summary
- `knowledge://project/{id}/patterns` — Detected code patterns and conventions
- `knowledge://project/{id}/file/{path}` — Enriched file info (purpose, dependencies, last change reason)

**Storage:**
- Embeddings stored in Supabase with `pgvector`
- Chunked by: function, class, file, and section
- Metadata: file path, language, last modified, change frequency
- Re-indexed on file change (webhook from git or file watcher)

### Server 3: `tilted-tasks` — Task & Coordination
**What it does:** Lets multiple agents share a task board, claim work, report progress, and avoid conflicts.

**MCP Tools exposed:**
- `tasks.create(title, description, assignee?, priority?)` — Create a task
- `tasks.list(status?, assignee?)` — List tasks
- `tasks.claim(task_id, agent_id)` — Lock a task for an agent
- `tasks.update(task_id, status, notes?)` — Update progress
- `tasks.complete(task_id, summary, files_changed?)` — Mark done with summary
- `tasks.conflict_check(file_path)` — Check if another agent is working on this file

**MCP Resources exposed:**
- `tasks://project/{id}/board` — Current task board state
- `tasks://project/{id}/active` — Tasks currently being worked on
- `tasks://project/{id}/log` — Completed task log with summaries

**Task Schema:**
```sql
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    project_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'todo',  -- 'todo', 'in_progress', 'review', 'done'
    priority TEXT DEFAULT 'medium',  -- 'low', 'medium', 'high', 'critical'
    assignee TEXT,          -- agent identifier: 'claude-code', 'cursor', 'human'
    locked_by TEXT,         -- agent currently working on it
    locked_at TIMESTAMPTZ,
    files_touched TEXT[],   -- files this task modified
    completion_summary TEXT,
    parent_task_id UUID REFERENCES tasks(id),  -- subtask support
    created_at TIMESTAMPTZ DEFAULT now(),
    completed_at TIMESTAMPTZ
);
```

## How Multiple Agents Connect

```
           ┌──────────┐     ┌──────────┐     ┌──────────┐
           │  Cursor   │     │  Claude   │     │Antigravity│
           │  Agent    │     │  Code     │     │  Agent   │
           └────┬─────┘     └────┬─────┘     └────┬─────┘
                │                │                 │
                │ MCP            │ MCP             │ MCP
                │                │                 │
           ┌────┴────────────────┴─────────────────┴────┐
           │          TiltedMCP (Local Process)          │
           │                                             │
           │  ┌─────────┐ ┌──────────┐ ┌─────────────┐ │
           │  │ memory   │ │knowledge │ │   tasks     │ │
           │  │ server   │ │ server   │ │   server    │ │
           │  └────┬─────┘ └────┬─────┘ └──────┬──────┘ │
           └───────┼────────────┼───────────────┼────────┘
                   │            │               │
                   └──────┬─────┴───────────────┘
                          │ HTTPS + API Key
                          ▼
                   ┌──────────────┐
                   │  Supabase    │
                   │  (Postgres   │
                   │  + pgvector  │
                   │  + Auth)     │
                   └──────────────┘
```

**Key architectural decisions:**

1. **TiltedMCP runs locally** on the user's machine as a single process. Each editor connects to it via MCP's stdio or SSE transport. This means zero latency for tool calls.

2. **State syncs to cloud.** The local process caches hot data but syncs all persistent state to Supabase. This means memories survive machine restarts and can be accessed from multiple machines.

3. **Agent identity is tracked.** Each MCP connection identifies itself (e.g., `cursor-agent`, `claude-code`). This enables the task server to know WHO is working on WHAT.

4. **Conflict detection is built in.** Before an agent modifies a file, it can call `tasks.conflict_check(file)` to see if another agent has a lock. This prevents the classic "two agents edit the same file" problem.

## How TiltedVoice Plugs In (Phase 2)

```
  ┌──────────────────────────────────┐
  │  TiltedVoice (Meeting Capture)   │
  │                                   │
  │  Microphone → Whisper (local)     │
  │  → Transcription                  │
  │  → AI Summarization (cloud LLM)   │
  │  → Decision Extraction            │
  │  → Memory Injection               │
  └───────────────┬──────────────────┘
                  │ memory.store({
                  │   type: "decision",
                  │   source: "voice:standup-2026-03-15",
                  │   content: "Team decided to use WebSockets..."
                  │ })
                  ▼
           ┌──────────────┐
           │ tilted-memory │  ← Same memory backend
           └──────────────┘
```

TiltedVoice is NOT a separate memory system. It's a **memory producer** that feeds into the same `tilted-memory` backend. When you say "we decided to use WebSockets for real-time" in a meeting, that decision automatically becomes queryable by your Cursor agent the next day.

## How TiltedSpace Plugs In (Phase 3)

TiltedSpace is the **read layer** — a web dashboard (Next.js, already our stack) that visualizes:
- Your memory graph (what does the project "know"?)
- Your task board (what's each agent working on?)
- Your knowledge index (what files are indexed, coverage gaps)
- Agent activity log (who did what, when)

It doesn't add new data — it reads from the same Supabase tables that TiltedMCP writes to.

---

# PART 5: PHASED BUILD PLAN

## Phase 0: NOW (Week of Feb 24-28)
**Goal:** Ship the Laboratory. Get first paying users. Build credibility.

### Milestones
- [ ] Supabase DB live with 75 assets
- [ ] Auth + Stripe payments working E2E
- [ ] Deploy to Vercel
- [ ] Launch tweet + LinkedIn post

### What's Already Done
- Next.js 16 dashboard with Supabase (Server Components)
- 65 bundles generated + migration SQL ready
- Stripe checkout + webhook auto-upgrade coded
- All sub-pages built, build passes clean

### Tool Usage
- **Claude Code:** Execute the remaining deploy steps (Vercel setup, env vars, smoke test)
- **Antigravity:** Not needed yet — Phase 0 is simple CRUD
- **Perplexity:** Research launch post copy, competitive positioning for social media

---

## Phase 1: TiltedMCP v1 (March-April 2026, ~8 weeks)
**Goal:** Ship 3 core MCP servers. Get 50 beta users running them with Cursor/Claude Code.

### Milestone 1.1 — tilted-memory server (Weeks 1-3)
**Tickets (hand off to AI coding tools):**

```
TICKET-001: Scaffold TiltedMCP TypeScript monorepo
  - Create packages/tilted-memory, packages/tilted-knowledge, packages/tilted-tasks
  - Use TypeScript + @modelcontextprotocol/sdk
  - Set up build system (tsup or esbuild)
  - Create shared packages/common for auth, config, Supabase client
  Estimated: 2-3 hours
  Use: Claude Code

TICKET-002: Implement tilted-memory MCP server
  - Implement 5 tools: store, recall, list, forget, summarize
  - Implement 3 resources: recent, decisions, preferences
  - Connect to Supabase via service role client
  - Test with Claude Desktop MCP inspector
  Estimated: 6-8 hours
  Use: Claude Code (deep reasoning for MCP protocol compliance)

TICKET-003: Add embedding generation for semantic recall
  - Integrate OpenAI text-embedding-3-small (or local alternative)
  - Generate embeddings on memory.store()
  - Implement vector similarity search for memory.recall()
  - Add pgvector extension to Supabase
  Estimated: 4-5 hours
  Use: Claude Code

TICKET-004: Create Supabase schema for memory tables
  - memories table with pgvector column
  - RLS policies (users only see their own memories)
  - Indexes for project_id, memory_type, embedding similarity
  - Migration script
  Estimated: 2 hours
  Use: Claude Code

TICKET-005: Build local caching layer
  - SQLite or in-memory LRU cache for hot memories
  - Sync protocol: local → cloud on write, cloud → local on startup
  - Handle offline gracefully (queue writes, serve from cache)
  Estimated: 4-5 hours
  Use: Antigravity (good for architecture-level tasks)

TICKET-006: Auth and API key management
  - API key generation in Supabase profiles table
  - Key validation in MCP server on startup
  - Rate limiting per user tier
  Estimated: 3 hours
  Use: Claude Code
```

### Milestone 1.2 — tilted-knowledge server (Weeks 3-5)
```
TICKET-007: Implement tilted-knowledge MCP server
  - Implement tools: index, search, explain, dependencies, recent_changes
  - File chunking strategy (by function/class/section)
  - Store chunks + embeddings in Supabase
  Estimated: 8-10 hours
  Use: Antigravity (multi-file, architecture-aware task)

TICKET-008: Git integration for change tracking
  - Watch git commits for re-indexing triggers
  - Extract commit messages as knowledge context
  - Track file change frequency for relevance scoring
  Estimated: 4-5 hours
  Use: Claude Code

TICKET-009: Codebase summary generator
  - On first index, generate high-level architecture summary
  - Store as knowledge://project/{id}/architecture resource
  - Update incrementally as files change
  Estimated: 3-4 hours
  Use: Claude Code
```

### Milestone 1.3 — tilted-tasks server (Weeks 5-6)
```
TICKET-010: Implement tilted-tasks MCP server
  - Implement tools: create, list, claim, update, complete, conflict_check
  - Implement resources: board, active, log
  - File-level locking with timeout (auto-release after 30 min)
  Estimated: 6-8 hours
  Use: Claude Code

TICKET-011: Multi-agent conflict detection
  - Track which agent is editing which file
  - Broadcast warnings when conflicts detected
  - Suggest merge strategy or task reordering
  Estimated: 4-5 hours
  Use: Antigravity (complex coordination logic)
```

### Milestone 1.4 — Distribution & Dashboard (Weeks 6-8)
```
TICKET-012: npm package for easy installation
  - `npx tilted-mcp init` — sets up config, generates API key
  - `npx tilted-mcp start` — runs local MCP server
  - Auto-generates MCP config for Claude Code, Cursor, Windsurf
  Estimated: 4-5 hours
  Use: Claude Code

TICKET-013: Minimal web dashboard (add to existing Next.js app)
  - /dashboard/memory — view and search memories
  - /dashboard/knowledge — see indexed files, coverage
  - /dashboard/tasks — task board view
  - /dashboard/usage — API calls, storage used
  Estimated: 8-10 hours
  Use: Antigravity (multi-page UI generation)

TICKET-014: Onboarding flow
  - Sign up → generate API key → copy MCP config → paste into editor
  - 3-step guide: install, configure, verify
  - Test with Cursor, Claude Code, and VS Code
  Estimated: 4-5 hours
  Use: Claude Code

TICKET-015: Landing page for TiltedMCP
  - Hero: "Your AI agents forget everything. We fix that."
  - Demo video placeholder
  - Pricing section
  - CTA: "Get started free"
  Estimated: 4-5 hours
  Use: Antigravity (fast UI generation)
```

### Tool Strategy for Phase 1
| Task Type | Use This | Why |
|-----------|---------|-----|
| MCP protocol implementation | **Claude Code** | Deep reasoning about protocol spec, sequential debugging |
| Multi-file architecture | **Antigravity** | Agent-first, can work on 5+ files simultaneously |
| Database schema, migrations | **Claude Code** | Precise SQL, migration safety |
| UI pages and components | **Antigravity** | Fast multi-file React generation |
| Research (MCP spec details, pgvector tuning) | **Perplexity** | Up-to-date docs, comparison research |
| Testing and debugging | **Claude Code** | Terminal-native, runs tests, reads errors |

---

## Phase 2: TiltedVoice (May-June 2026, ~6 weeks)
**Goal:** Add meeting/conversation capture that feeds into TiltedMCP memory.

### Milestones
```
TICKET-020: TiltedVoice capture engine
  - Local audio capture via system audio API
  - Whisper integration for transcription (local or API)
  - Real-time streaming transcription
  Estimated: 10-12 hours
  Use: Antigravity (complex system-level integration)

TICKET-021: AI summarization pipeline
  - Chunk transcription into segments
  - LLM summarization (Claude API or local)
  - Decision extraction: detect "we decided", "let's go with", "action item"
  - Auto-tag by topic (auth, frontend, database, etc.)
  Estimated: 6-8 hours
  Use: Claude Code

TICKET-022: Memory injection from voice
  - On meeting end: summarize → extract decisions → memory.store()
  - Source tagged as "voice:{meeting_id}"
  - Searchable by agents via tilted-memory.recall()
  Estimated: 4-5 hours
  Use: Claude Code

TICKET-023: TiltedVoice web UI
  - Meeting list with transcripts
  - Extracted decisions and action items
  - "Send to Memory" manual button for specific segments
  Estimated: 6-8 hours
  Use: Antigravity

TICKET-024: TiltedVoice desktop app (Tauri or Electron)
  - System tray app: click to start recording
  - Auto-detect meeting apps (Zoom, Meet, Teams)
  - Push-to-talk mode for pair programming
  Estimated: 10-12 hours
  Use: Antigravity
```

---

## Phase 3: TiltedSpace (July-September 2026)
**Goal:** Unified workspace dashboard — mission control for vibe coders.

### Milestones
```
TICKET-030: TiltedSpace main dashboard
  - Project selector + overview
  - Memory graph visualization
  - Task board (Kanban)
  - Agent activity feed
  Estimated: 12-15 hours
  Use: Antigravity

TICKET-031: Multi-agent orchestration UI
  - Create task → assign to agent → watch progress
  - Drag-and-drop task board
  - Agent health/status indicators
  Estimated: 8-10 hours
  Use: Antigravity

TICKET-032: TiltedSpace desktop app
  - Electron/Tauri wrapper around web dashboard
  - System tray with quick actions
  - Notification when agent completes/fails a task
  Estimated: 8-10 hours
  Use: Antigravity

TICKET-033: Collaboration features
  - Team workspaces (shared memory, shared tasks)
  - Activity feed across team members
  - Role-based access (admin, member, viewer)
  Estimated: 10-12 hours
  Use: Claude Code (complex auth logic)
```

---

# PART 6: BUSINESS MODEL & PRICING

## Revenue Streams

### Stream 1: Laboratory (Digital Products) — NOW
Already built. Provides immediate revenue while TiltedMCP is in development.
- Free tier: 23 free assets
- Pro tier: $49/mo for full library access (42 premium + weekly additions)
- Content flywheel: OpenClaw agents generate 350+ assets/week at near-zero cost

### Stream 2: TiltedMCP (Infrastructure) — Phase 1
The core product. Recurring SaaS revenue.

| Tier | Price | Includes |
|------|-------|---------|
| **Free** | $0 | 1 project, 100 memories, 50 knowledge queries/day, basic task board |
| **Pro** | $19/mo | 5 projects, unlimited memories, 500 knowledge queries/day, multi-agent coordination, priority sync |
| **Team** | $49/mo per seat | Shared workspaces, team memory, admin controls, SSO, audit log |

### Stream 3: TiltedVoice (Add-on) — Phase 2
| Tier | Price | Includes |
|------|-------|---------|
| **Included with Pro** | $0 extra | 5 hours/month meeting capture, auto-summarization |
| **Standalone** | $12/mo | For users who only want voice, not full MCP |
| **Unlimited** | $29/mo | Unlimited hours, real-time transcription, custom vocabulary |

### Stream 4: TiltedSpace (Add-on) — Phase 3
| Tier | Price | Includes |
|------|-------|---------|
| **Included with Pro** | $0 extra | Web dashboard |
| **Desktop App** | +$5/mo | Native app with system tray, notifications |
| **Team** | Included in Team tier | Full orchestration, collaboration |

## Pricing Strategy vs BridgeMind

BridgeMind charges $20/mo for everything bundled. Our strategy:

1. **Lower entry point.** TiltedMCP Pro at $19/mo is cheaper and more focused.
2. **Modular.** Don't want Voice? Don't pay for it. BridgeMind forces you to buy the bundle.
3. **Free tier is actually useful.** 100 memories + 50 queries/day is enough for a solo side project. BridgeMind's free tier is basically just "community Discord access."
4. **Laboratory as top-of-funnel.** Free prompt bundles bring people in. They discover TiltedMCP while browsing. Upsell is natural.

## Revenue Projections

| Month | Laboratory | TiltedMCP | Total |
|-------|-----------|-----------|-------|
| Mar 2026 (launch) | $500-2K | $0 | $500-2K |
| Jun 2026 (MCP live) | $2-5K | $1-3K | $3-8K |
| Sep 2026 (Voice + Space) | $3-5K | $5-15K | $8-20K |
| Dec 2026 (maturity) | $5-8K | $15-30K | $20-38K |

---

# PART 7: BRIDGEMIND DEEP-DIVE PLAN

To refine our positioning and find gaps, I need you to collect and share the following from BridgeMind:

### From their public website (bridgemind.ai):
1. **Homepage hero section** — exact copy and messaging
2. **Products page for each product** — BridgeMCP, BridgeCode, BridgeSpace, BridgeVoice feature lists
3. **Pricing page** — full tier breakdown, what's in free vs pro
4. **Roadmap page** — what they're building next

### From their documentation (docs.bridgemind.ai):
5. **BridgeMCP setup guide** — how do users install it? What config is needed?
6. **BridgeMCP tool list** — what MCP tools do they expose? What's the schema?
7. **Memory/knowledge features** — how do they handle persistent memory? Is it a separate tool?
8. **Architecture docs** — any diagrams of how their system works

### From their member portal (if you have access):
9. **Dashboard screenshots** — what does the logged-in experience look like?
10. **Prompt Library** — what kind of prompts do they offer? How does it compare to Laboratory?
11. **Agent configuration** — how do users set up agents? What customization exists?

### From their community/social:
12. **Discord community size and activity** — how engaged is their 70K?
13. **Twitter/X posts** — what messaging resonates? What do users praise/complain about?
14. **YouTube content** — tutorials, demos, what do they show?

**When you share this, I can:**
- Map feature-by-feature gaps
- Identify their weaknesses in memory/knowledge handling
- Find positioning angles they've missed
- Refine our V1 tool list to directly counter their strengths

---

# PART 8: NEXT 5 CONCRETE STEPS

## Step 1: Ship Laboratory (This Week, Feb 24-28)
- Run `supabase_production.sql` + `supabase_bundles.sql` in Supabase
- Get Stripe test keys, test E2E checkout
- Deploy to Vercel
- Launch post on Twitter/LinkedIn
- **Owner:** You (manual steps) + Claude Code (debugging)

## Step 2: Scaffold TiltedMCP Monorepo (Week of Mar 3)
- Create `packages/tilted-memory`, `packages/tilted-knowledge`, `packages/tilted-tasks`
- Set up TypeScript + MCP SDK + Supabase client
- Implement `tilted-memory` v0 with basic store/recall (no embeddings yet)
- Test with Claude Desktop MCP inspector
- **Owner:** Claude Code (TICKET-001, TICKET-002)

## Step 3: Research and Collect BridgeMind Intel (This Week)
- Visit bridgemind.ai and collect everything from Part 7
- Share screenshots/text in a follow-up prompt
- I'll analyze and refine architecture + positioning
- **Owner:** You (browsing) + Perplexity (analysis)

## Step 4: Add pgvector and Semantic Memory (Week of Mar 10)
- Enable pgvector extension in Supabase
- Add embedding generation to tilted-memory
- Implement semantic recall
- Test: store 20 memories, recall by natural language query
- **Owner:** Claude Code (TICKET-003, TICKET-004)

## Step 5: First Beta Distribution (Week of Mar 17)
- Package as npm: `npx tilted-mcp init`
- Write 3-minute setup guide
- Share with 10 beta users (from Laboratory early adopters)
- Collect feedback on memory quality and recall relevance
- **Owner:** Claude Code (TICKET-012) + You (beta outreach)

---

# APPENDIX: KEY LINKS & REFERENCES

- [MCP Specification (2025-11-25)](https://modelcontextprotocol.io/specification/2025-11-25)
- [Official MCP Servers (GitHub)](https://github.com/modelcontextprotocol/servers)
- [MCP SDK for TypeScript](https://github.com/modelcontextprotocol/typescript-sdk)
- [BridgeMind](https://www.bridgemind.ai)
- [BridgeMCP Docs](https://docs.bridgemind.ai/docs)
- [BridgeMind Pricing](https://www.bridgemind.ai/pricing)
- [Supabase pgvector Guide](https://supabase.com/docs/guides/ai/vector-columns)
- [Google Antigravity](https://antigravity.google)
- [Vibe Coding Tools 2026 Overview](https://medium.com/towards-agentic-ai/vibe-coding-tools-2026-c84a5ddc198f)
- [MCP Predictions 2026](https://dev.to/blackgirlbytes/my-predictions-for-mcp-and-ai-assisted-coding-in-2026-16bm)
