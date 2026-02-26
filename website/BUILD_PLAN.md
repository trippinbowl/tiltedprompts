# TiltedPrompts — Build Plan & Task Division
## Simultaneous Development Across Claude Code, Cursor, and Antigravity

---

## TOOL ASSIGNMENTS (UPDATED)

| Tool | Focus Area | Language | Why This Tool |
|------|-----------|----------|---------------|
| **Claude Code** | Most technical — MCP platform (CLI, servers, deploy), Voice AI core (Whisper + Hindi), backend infra | TypeScript / Python / Rust | Highest technical trust, best at complex multi-file systems, architecture, and AI/ML pipelines |
| **Cursor** | Medium technical — Dashboard UI, pre-built MCP servers, agent builder, integrations | TypeScript | Good for focused feature development with LSP, UI components, and API integrations |
| **Antigravity** | Website, docs, README files, blog, marketing content, design polish | TSX / MDX | Best for content-heavy work, documentation, and visual/design tasks |

---

## PHASE 1: FOUNDATION (Weeks 1-4)
### All three tools work in parallel

---

### CLAUDE CODE — TiltedMCP Core + Voice AI Engine (Most Technical)

#### Session 1: Monorepo + CLI Scaffolder
```
Goal: `npx create-tilted-mcp` generates a working MCP server

Tasks:
1. Create monorepo with pnpm workspaces:
   packages/
     cli/                # `tilted` CLI tool
     create-tilted-mcp/  # scaffolder
     sdk/                # shared utilities
     servers/            # pre-built MCP servers
     dashboard/          # Next.js web app (later)

2. Build `create-tilted-mcp` package:
   - Use Commander.js for CLI framework
   - Interactive prompts (inquirer/prompts) for template selection
   - Templates: "supabase", "rest-api", "custom"
   - Each template generates:
     - src/index.ts (server entry with @modelcontextprotocol/sdk)
     - src/tools/ (tool definitions)
     - src/resources/ (resource definitions)
     - src/prompts/ (prompt templates)
     - package.json (with correct deps)
     - tsconfig.json
     - wrangler.toml (for Cloudflare Workers deploy)
     - .env.example
   - Use Streamable HTTP transport (not stdio) as primary

3. Build `tilted` CLI basics:
   - `tilted init` — same as create-tilted-mcp but in existing dir
   - `tilted dev` — starts local dev server at localhost:8787
     - Uses Hono for HTTP framework
     - Hot reload via chokidar or tsx watch
     - stdio transport fallback for Claude Desktop testing
   - `tilted --version`, `tilted --help`

4. Test end-to-end:
   - npx create-tilted-mcp test-server --template supabase
   - cd test-server && tilted dev
   - Connect from Claude Desktop via claude_desktop_config.json
   - Verify tools appear and respond

Tech dependencies:
  - @modelcontextprotocol/sdk (latest)
  - commander (CLI framework)
  - @inquirer/prompts (interactive prompts)
  - hono (HTTP framework for Workers)
  - tsx (dev server runner)
  - typescript, tsup (build)
```

#### Session 2: Deploy Pipeline + Auth
```
Goal: `tilted deploy` gives a live HTTPS endpoint with OAuth 2.1

Tasks:
1. Cloudflare Workers deployment:
   - `tilted deploy` command in CLI
   - Bundles server code via esbuild/tsup → Worker script
   - Uses Wrangler API (not CLI) for programmatic deploy
   - Custom subdomain: {name}.mcp.tiltedprompts.com
   - Cloudflare DNS API for subdomain creation
   - Zero cold starts, global edge deployment

2. OAuth 2.1 auto-wrapper:
   - Auto-inject PKCE + Resource Indicators at gateway layer
   - Developer writes ZERO auth code
   - Gateway (Hono middleware) handles:
     - Token introspection
     - JWT validation
     - CORS headers
     - Rate limiting (per-user, per-server)
   - Auth config in tilted.config.ts (optional overrides)

3. `tilted logs` command:
   - Tail invocation logs from deployed server
   - Show: timestamp, tool name, input preview, duration, status
   - Real-time streaming via WebSocket or SSE

4. Test deploy flow:
   - tilted deploy (from scaffolded Supabase template)
   - Verify HTTPS endpoint is live
   - Connect Cursor/Claude Code to remote URL
   - Verify OAuth consent flow works
   - Verify rate limiting works

Tech dependencies:
  - wrangler (Cloudflare Workers SDK)
  - hono (edge framework)
  - jose (JWT handling)
```

#### Session 3: First Pre-Built Server (Supabase)
```
Goal: @tiltedprompts/mcp-supabase is published and usable

Tasks:
1. Build packages/servers/supabase/:
   - Tools:
     - query_database(sql) — run read-only SQL
     - insert_rows(table, data) — insert with validation
     - update_rows(table, filter, data) — update with RLS
     - delete_rows(table, filter) — soft delete preferred
     - get_schema() — return all table schemas
     - run_migration(sql) — apply schema changes
   - Resources:
     - database_schema — read-only current schema
     - table_list — list of all tables with row counts
     - rls_policies — current RLS policy definitions
   - Prompts:
     - query_helper — template for natural language → SQL
     - migration_planner — template for schema changes

2. Connection pooling:
   - Connection reuse across invocations (Worker global)
   - Proper error handling for connection failures

3. Security:
   - RLS-aware queries (respect Row Level Security)
   - Read-only mode option
   - Query timeout limits
   - Input sanitization (prevent SQL injection)

4. Testing:
   - Local dev with a test project
   - Deploy to Workers
   - Connect from Cursor and test all tools
   - Benchmark: query latency, connection time

5. Publish:
   - npm publish as @tiltedprompts/mcp-supabase
   - README with setup instructions
   - One-click connect flow documentation
```

#### Session 4: TiltedVoice — English (Whisper)
```
Goal: On-device English voice-to-text via Whisper

Tasks:
1. Set up project structure:
   - Python package: tiltedvoice/
   - Whisper integration via faster-whisper (CTranslate2 backend)
   - GPU acceleration: CUDA (NVIDIA), Metal (Apple Silicon)

2. Core transcription engine:
   - Real-time audio capture (pyaudio/sounddevice)
   - VAD (Voice Activity Detection) via Silero VAD
   - Streaming transcription with word-level timestamps
   - Model selection: tiny → large-v3
   - Default: whisper-small (best speed/accuracy)

3. CLI interface:
   - tilted-voice --model small --lang en
   - Push-to-talk (hold hotkey) and toggle modes
   - Output: clipboard / stdout / file
   - Visual waveform in terminal (rich library)

4. Python API:
   - from tiltedvoice import Transcriber
   - transcriber = Transcriber(model="small", lang="en")
   - async for text in transcriber.stream(audio_source):

5. Package and publish:
   - pip install tiltedvoice
   - PyPI publication
   - README with examples

Tech dependencies:
  - faster-whisper (CTranslate2 backend)
  - silero-vad (voice activity detection)
  - sounddevice (audio capture)
  - rich (terminal UI)
  - click (CLI framework)
```

#### Session 5: TiltedVani — Hindi Voice-to-Text + Translation
```
Goal: Hindi speech → Hindi text + English translation

Product: TiltedVani (वाणी = voice/speech in Sanskrit/Hindi)
Package: @tiltedprompts/vani or `pip install tiltedvani`

KEY FEATURE: Pure Hindi output + automatic English translation
NOT Hinglish — proper Devanagari Hindi text output

Tasks:
1. Hindi STT pipeline:
   - Sarvam AI Saaras v3 API for Hindi speech recognition
   - Pure Hindi (Devanagari) text output — NOT Romanized
   - Code: "मैं आज बाज़ार जाना चाहता हूँ"
   - NOT: "Main aaj bazaar jaana chahta hoon"

2. Hindi → English translation layer:
   - Sarvam AI Mayura v2 translation model (Hindi → English)
   - OR GPT-4.1-mini for translation (fallback)
   - Dual output format:
     Hindi:   "मैं आज बाज़ार जाना चाहता हूँ"
     English: "I want to go to the market today"

3. REST API:
   - POST /vani/v1/transcribe
     Input: audio file (WAV/MP3/OGG)
     Output: { hindi: "...", english: "...", confidence: 0.95 }
   - POST /vani/v1/translate
     Input: { text: "Hindi text" }
     Output: { english: "English translation" }
   - WS /vani/v1/stream (real-time)

4. CLI:
   - tilted-vani --output dual (Hindi + English)
   - tilted-vani --output hindi (Hindi only)
   - tilted-vani --output english (translated only)

5. Python API:
   - from tiltedvani import HindiTranscriber
   - transcriber = HindiTranscriber()
   - result = await transcriber.transcribe(audio)
   - print(result.hindi)    # "मैं आज बाज़ार जाना चाहता हूँ"
   - print(result.english)  # "I want to go to the market today"

6. Edge cases:
   - Number handling: "दो सौ पचास" → 250
   - Date handling: "पंद्रह अगस्त" → "15 August"
   - Mixed numerals: Devanagari digits vs Arabic digits option

Tech dependencies:
  - Sarvam AI API (Saaras v3 for STT, Mayura v2 for translation)
  - FastAPI (REST backend)
  - WebSocket support for streaming
  - Click (CLI)
  - Deploy: AWS Mumbai (ap-south-1) for low latency in India
```

---

### CURSOR — Dashboard, Servers, Integrations (Medium Technical)

#### Session 1: Dashboard MVP
```
Goal: Web dashboard showing servers, metrics, logs

Tasks:
1. Build packages/dashboard/ (Next.js):
   - Auth: login/signup
   - Server list page: name, status, endpoint URL
   - Server detail page:
     - Invocations/day chart
     - p50/p99 latency chart
     - Error rate chart
     - Recent invocation log (tool, input, output, duration)
   - Deploy history with rollback button
   - API key management page

2. Backend (tRPC):
   - tRPC router for all dashboard APIs
   - Database for: User accounts, Server metadata, API keys, Deploy history
   - Analytics store for: Invocation logs, Latency metrics, Error tracking

3. Alerting:
   - Email alerts on error rate spikes (Resend)
   - Slack webhook alerts (optional)
   - Threshold configuration in dashboard

Tech: Next.js 16, tRPC, Tailwind
(Database choice TBD — see backend analysis below)
```

#### Session 2: More Pre-Built Servers
```
Goal: Ship Notion, GitHub, Gmail, Google Sheets servers

Tasks:
1. @tiltedprompts/mcp-notion
   - Tools: search_pages, read_page, create_page, update_database, query_database
   - Resources: workspace_info, database_schemas
   - Auth: Notion OAuth integration

2. @tiltedprompts/mcp-github
   - Tools: list_issues, create_issue, create_pr, review_pr, manage_repo
   - Resources: repo_info, branch_list, workflow_status
   - Auth: GitHub App or PAT

3. @tiltedprompts/mcp-gmail
   - Tools: read_inbox, send_email, search_messages, manage_labels
   - Resources: label_list, unread_count
   - Auth: Google OAuth

4. @tiltedprompts/mcp-sheets
   - Tools: read_sheet, write_cells, create_sheet, batch_update
   - Auth: Google OAuth

5. Testing & publish all to npm
```

#### Session 3: Voice Agent Builder UI
```
Goal: No-code voice agent builder in dashboard

Tasks:
1. Agent configuration UI
   - Choose language (Hindi, English)
   - System prompt editor
   - Knowledge base upload (PDFs, docs)
   - Voice selection (Sarvam voices)
2. Phone number assignment (Exotel)
3. WhatsApp integration toggle (Gupshup)
4. Conversation history viewer
5. Analytics: call volume, avg duration, language breakdown
```

---

### ANTIGRAVITY — Website, Docs, Content, Marketing

#### Session 1: Package README Files + Docs Polish
```
Goal: Every package has a comprehensive README, docs are polished

Tasks:
1. Write README.md for each package:
   - packages/create-tilted-mcp/README.md
   - packages/cli/README.md
   - packages/servers/supabase/README.md
   - @tiltedprompts/voice README.md
   - @tiltedprompts/vani README.md (Hindi product)

2. Each README includes:
   - Badges (npm version, downloads, license)
   - One-liner description
   - Quick start (3-5 steps)
   - Full API reference
   - Configuration options
   - Examples
   - Contributing guide link

3. Polish docs pages:
   - Add interactive code examples
   - Add API reference sections
   - Add TiltedVani docs page
   - Improve mobile responsiveness
```

#### Session 2: Blog Framework + Launch Content
```
Goal: Blog is live with first posts

Tasks:
1. Blog framework on the website (MDX)
2. Launch blog posts:
   - "Introducing TiltedMCP — Vercel for MCP Servers"
   - "Voice AI for Bharat — Hindi, Not Hinglish"
   - "Meet TiltedVani — Pure Hindi Voice Recognition"
   - "The Agentic Coding Stack — How We Build in 2026"
3. Product comparison pages
4. SEO optimization
5. Social media content templates
```

#### Session 3: Soft Launch Website Updates
```
Goal: Website shows products in "currently cooking" state

Tasks:
1. Update product pages with "cooking" status badges
2. Waitlist forms on each product page
3. Progress indicators showing build stage
4. "Building in Public" section with live updates
5. Email capture for launch notifications
```

---

## PHASE 2: EXPANSION (Weeks 5-8)

### CLAUDE CODE — Marketplace + Telephony
```
1. Marketplace backend:
   - Server discovery API
   - Search, filter by category
   - Usage metering and billing hooks
   - One-click connect flow

2. Telephony integration for TiltedVani:
   - Exotel for Indian phone numbers
   - Inbound call routing → voice pipeline
   - Human handoff with context transfer

3. WhatsApp Business Calling:
   - Gupshup BSP integration
   - Voice agents on WhatsApp calls
   - Same agent handles text + voice
```

### CURSOR — Billing + Advanced Dashboard
```
1. Stripe billing integration
   - Free / Pro / Enterprise tiers
   - Usage-based billing for invocations
   - Marketplace revenue share (20%)

2. Advanced dashboard features
   - Team management
   - RBAC (role-based access control)
   - Audit logs
   - Custom alerting rules
```

### ANTIGRAVITY — Community + Content
```
1. API reference documentation (auto-generated)
2. Video tutorial scripts for YouTube
3. Community Discord setup
4. Contributor guide
5. Case studies and customer stories
6. Hindi content for YouTube
```

---

## PHASE 3: SCALE (Weeks 9-16)

### CLAUDE CODE — Enterprise + Advanced Voice
```
1. Multi-language voice expansion (Tamil, Telugu, Bengali)
2. Enterprise MCP features (SSO, audit, compliance)
3. Self-hosted MCP platform option
4. Advanced voice pipeline (interruptions, context, memory)
```

### CURSOR — Polish + Scale
```
1. Performance optimization across dashboard
2. CDN and caching layers
3. Advanced analytics and reporting
4. White-label options for enterprise
```

### ANTIGRAVITY — Growth + Design
```
1. Landing page A/B testing
2. Product Hunt launch preparation
3. Conference talk materials
4. Partner integration pages
5. Multi-language website (Hindi version)
```

---

## PRODUCT NAMING

| Product | Package Name | Description |
|---------|-------------|-------------|
| **TiltedMCP** | @tiltedprompts/mcp-* | Managed MCP server platform |
| **TiltedVoice** | tiltedvoice (pip) | English voice-to-text (Whisper, on-device) |
| **TiltedVani** | tiltedvani (pip) | Hindi voice-to-text + English translation (Sarvam AI, cloud) |
| **TiltedCode** | npx create-tilted-app | Production Next.js templates |
| **The Laboratory** | n8n workflow files | WhatsApp + n8n automation |

---

## IMMEDIATE NEXT SESSION CHECKLIST

### For Claude Code (Priority 1 — Most Technical):
```
□ Finalize backend stack decision (see analysis)
□ Create pnpm monorepo: packages/cli, packages/create-tilted-mcp, packages/sdk
□ Build create-tilted-mcp scaffolder with first template
□ Build tilted dev command with local Hono server
□ Start TiltedVoice Python project (Whisper integration)
□ Start TiltedVani Python project (Sarvam AI + Hindi)
```

### For Cursor (Priority 1 — Dashboard):
```
□ Build dashboard MVP (Next.js + tRPC)
□ Server list and detail pages
□ API key management
□ Start building Notion MCP server
```

### For Antigravity (Priority 2 — Content):
```
□ Write README files for all packages
□ Add TiltedVani documentation page
□ Set up blog framework (MDX)
□ Write first blog post
□ Update product pages for soft launch
```

---

## DEPLOYMENT CHECKLIST

### MCP Platform:
- [ ] Cloudflare account with Workers enabled
- [ ] Database (Supabase or AWS — see analysis)
- [ ] Domain: mcp.tiltedprompts.com configured
- [ ] npm org: @tiltedprompts

### Voice Platform:
- [ ] Sarvam AI API keys (for TiltedVani)
- [ ] AWS Mumbai (ap-south-1) for voice API
- [ ] LiveKit Cloud account
- [ ] Domain: api.tiltedprompts.com configured

### General:
- [ ] GitHub org: github.com/tiltedprompts
- [ ] Stripe account for billing
- [ ] Resend account for transactional email
- [ ] Vercel account for dashboard deployment
- [ ] PyPI account for Python packages

---

*Generated for TiltedPrompts — February 2026*
*Updated: Tool assignments corrected — Claude Code handles most technical, Cursor handles medium, Antigravity handles content*
*Build in public. Ship in weeks. Iterate in days.*
