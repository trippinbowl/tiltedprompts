# TiltedPrompts — Next Session Build Roadmap
## MCP + Voice Software Development Plan

---

## PHASE 1: TiltedMCP (Weeks 1-12)
### "Vercel for MCP Servers"

### What We're Building
A managed platform where developers push MCP server code and get a production-ready remote endpoint with built-in auth, monitoring, and marketplace distribution.

### Why This First
- MCP has 97M monthly SDK downloads and 10K+ public servers
- Microsoft, AWS, Google, Cloudflare all adopted it — the protocol is winning
- Gap exists between "raw SDK" and "enterprise platform" — MintMCP is governance-focused, we target the mid-market developer

---

### Sprint 1 (Weeks 1-3): CLI + Scaffold
**Goal:** `npx create-tilted-mcp` → working MCP server in 60 seconds

- [ ] Build `create-tilted-mcp` CLI scaffolder (TypeScript)
  - Templates: Supabase connector, REST API wrapper, file system, custom
  - Pre-wired with `@modelcontextprotocol/sdk` + Streamable HTTP transport
  - Auto-generates `tools`, `resources`, `prompts` stubs
- [ ] Build `tilted` CLI tool
  - `tilted init` — scaffold from template
  - `tilted dev` — local dev server with hot reload
  - `tilted deploy` — push to Cloudflare Workers
  - `tilted logs` — tail invocation logs
- [ ] Set up monorepo structure:
  ```
  packages/
    cli/              # tilted CLI
    create-tilted-mcp/ # scaffolder
    sdk/              # shared utilities
    dashboard/        # Next.js web app
  ```

**Tech:** TypeScript, Commander.js, Wrangler API, Cloudflare Workers

---

### Sprint 2 (Weeks 4-6): Deploy + Auth
**Goal:** `tilted deploy` gives you a live HTTPS endpoint with OAuth 2.1

- [ ] Cloudflare Workers deployment pipeline
  - Auto-bundle MCP server code → Worker script
  - Custom subdomain: `your-server.mcp.tiltedprompts.com`
  - Edge deployment (no cold starts, global distribution)
- [ ] OAuth 2.1 auto-wrapper
  - Integrate Auth0 as delegated authorization server
  - Auto-inject PKCE + Resource Indicators into every deployed server
  - Developer provides zero auth code — it's handled at the platform layer
  - Token introspection and JWT validation at the gateway
- [ ] API Gateway layer
  - Rate limiting (per-user, per-server)
  - CORS management
  - Request/response logging

**Tech:** Cloudflare Workers, Wrangler, Auth0, Hono (edge framework)

---

### Sprint 3 (Weeks 7-9): Dashboard + Monitoring
**Goal:** Web dashboard showing all your MCP servers, their health, and usage

- [ ] Dashboard MVP (Next.js + Tailwind + tRPC)
  - Server list with status indicators (healthy/degraded/down)
  - Per-server metrics: invocations/day, p50/p99 latency, error rate
  - Invocation log viewer with tool name, input, output, duration
  - Deploy history with rollback capability
- [ ] Alerting
  - Email/Slack alerts on error rate spikes
  - Latency threshold warnings
- [ ] Database setup
  - PostgreSQL (Neon serverless) for server metadata, user accounts
  - ClickHouse for high-volume invocation analytics

**Tech:** Next.js 16, tRPC, Neon PostgreSQL, ClickHouse, Tailwind

---

### Sprint 4 (Weeks 10-12): Marketplace + Polish
**Goal:** Public server directory where devs can discover and use MCP servers

- [ ] Server marketplace page
  - Search, filter by category (database, API, file system, custom)
  - Server detail page: description, tools list, latency benchmarks, pricing
  - One-click "Connect" flow with OAuth consent
- [ ] Usage-based billing
  - Free tier: 3 servers, 1K invocations/month
  - Pro ($29/mo): 20 servers, 100K invocations, custom domains
  - Marketplace fee: 20% on paid server usage
- [ ] Documentation site
  - Quick start guide
  - Template reference
  - API docs (auto-generated from server schemas)

**Tech:** Stripe for billing, Algolia for search, MDX for docs

---

### Pre-Built MCP Servers to Ship at Launch
1. **Supabase Memory Server** — query/insert/update across any Supabase project
2. **Notion Connector** — read/write Notion pages, databases, blocks
3. **Gmail Server** — read inbox, send emails, manage labels
4. **GitHub Server** — issues, PRs, repo management
5. **Google Sheets Server** — read/write spreadsheet data
6. **Indian Government APIs** — GST verification, Aadhaar (masked), UPI status

---

## PHASE 2: TiltedVoice (Weeks 8-22, overlapping)
### "Voice AI for Bharat"

### What We're Building
A managed voice AI platform for Indian businesses — build multilingual voice agents that work over phone calls, WhatsApp, and web.

### Why This Matters
- India is WhatsApp's largest market (500M+ users)
- WhatsApp Business Calling API launched globally July 2025
- 80% of Indian businesses expected to use WhatsApp automation by 2026
- Gap: Sarvam provides APIs, Bolna is semi-open-source. No one offers a polished managed platform

---

### Sprint 1 (Weeks 8-11): Voice Pipeline Core
**Goal:** Working voice conversation loop: speak Hindi → get Hindi response in <800ms

- [ ] Voice pipeline backend (Python/FastAPI)
  - STT: Sarvam Saaras v3 (streaming WebSocket, 22 Indian languages)
  - LLM: GPT-4.1-mini (token streaming, fast first-token)
  - TTS: Sarvam Bulbul v3 (streaming, 11 Indian languages)
  - Orchestrator: manages conversation state, turn-taking, interruption handling
- [ ] WebRTC transport via LiveKit
  - LiveKit Agents framework for Python
  - Sub-second latency with co-located services (AWS Mumbai ap-south-1)
  - Noise suppression, echo cancellation built-in
- [ ] Web widget MVP
  - Embeddable `<TiltedVoice>` component (React)
  - Push-to-talk and continuous listening modes
  - Language auto-detection (Sarvam's language detection API)

**Tech:** Python, FastAPI, LiveKit, Sarvam AI APIs, WebRTC, AWS Mumbai

---

### Sprint 2 (Weeks 12-15): Agent Builder + Telephony
**Goal:** No-code agent builder + inbound phone call support

- [ ] Agent builder dashboard
  - System prompt editor with language-specific templates
  - Voice selection (Sarvam's voice library — male/female per language)
  - Conversation flow designer (intent → response → branch)
  - Knowledge base upload (PDF, DOCX → RAG pipeline)
- [ ] Telephony integration
  - Exotel for Indian phone numbers (toll-free, local DID)
  - Inbound call routing → voice agent pipeline
  - Human handoff: transfer to live agent with full context
  - Call recording with consent
- [ ] Language expansion
  - MVP: Hindi, English, Tamil
  - Sprint 2: Add Telugu, Bengali, Kannada, Marathi (7 total)
  - Code-switching support (Hinglish, Tanglish)

**Tech:** Next.js (dashboard), Exotel API, Sarvam AI, LangChain (RAG)

---

### Sprint 3 (Weeks 16-19): WhatsApp + Analytics
**Goal:** Voice agents on WhatsApp + comprehensive analytics

- [ ] WhatsApp Business Calling API integration
  - BSP: Gupshup (Meta Partner of the Year for India)
  - Voice call → WebRTC → Voice Agent → WebRTC → WhatsApp
  - Same agent handles both text messages and voice calls
  - Proactive outbound calling (with user consent)
- [ ] Analytics dashboard
  - Call volume, duration, peak hours
  - Language distribution across calls
  - Intent detection accuracy and conversation success rate
  - Customer satisfaction scoring (automated post-call survey)
  - Cost per conversation breakdown
- [ ] Multi-channel support
  - Same agent config works across: web widget, phone, WhatsApp
  - Unified conversation history across channels

**Tech:** Gupshup WhatsApp API, ClickHouse (analytics), Next.js

---

### Sprint 4 (Weeks 20-22): Scale + Enterprise
**Goal:** Production hardening and enterprise features

- [ ] Scaling
  - Auto-scaling voice pipelines based on concurrent calls
  - Queue management for peak hours
  - Multi-region support (Mumbai primary, Singapore secondary)
- [ ] Enterprise features
  - SSO (SAML/OIDC)
  - Custom voice cloning (Sarvam/ElevenLabs)
  - On-premise deployment option
  - API-first mode (for devs who want pipeline without the builder)
  - Compliance: call recording retention policies, PII masking
- [ ] Billing
  - Free: 100 minutes/month, 1 agent, 2 languages
  - Starter: ₹5,000/mo (~$60), 1,000 min, 5 agents
  - Growth: ₹15,000/mo (~$180), 5,000 min, unlimited agents, WhatsApp
  - Enterprise: Custom

**Tech:** Kubernetes (EKS), Stripe, Auth0 SAML

---

## FIRST SESSION ACTION ITEMS

When you start the next session, here's the priority order:

### Immediate (Session 1)
1. **Set up the monorepo** — `pnpm` workspaces with `packages/cli`, `packages/create-tilted-mcp`, `packages/dashboard`
2. **Build `create-tilted-mcp`** — CLI that scaffolds a TypeScript MCP server from templates
3. **Build `tilted dev`** — local dev server with stdio transport for testing
4. **Test with Claude Desktop** — verify a scaffolded server connects and works

### Next (Session 2)
1. **Cloudflare Workers deployment** — `tilted deploy` command
2. **Auth0 OAuth integration** — auto-wrap deployed servers
3. **First pre-built server** — Supabase Memory MCP Server

### Voice Kick-off (Session 3)
1. **Sarvam AI API integration** — get API keys, test STT + TTS in Python
2. **LiveKit setup** — local LiveKit server, test WebRTC audio
3. **First voice loop** — speak Hindi → GPT-4.1-mini → hear Hindi response

---

## COST ESTIMATES

### MCP Platform (Monthly at Scale)
| Service | Cost |
|---------|------|
| Cloudflare Workers | $5-50/mo (scales with usage) |
| Auth0 | Free tier → $23/mo (Pro) |
| Neon PostgreSQL | Free tier → $19/mo |
| ClickHouse Cloud | $47/mo (starter) |
| Domain + DNS | $12/year |
| **Total MVP** | **~$100-150/mo** |

### Voice Platform (Monthly at Scale)
| Service | Cost |
|---------|------|
| Sarvam STT | ₹0.60/min (~$0.007) |
| Sarvam TTS | ₹0.40/min (~$0.005) |
| GPT-4.1-mini | ~$0.002/conversation |
| LiveKit Cloud | $0.01/min (media) |
| Exotel | ₹1.50/min (~$0.018) |
| AWS Mumbai | $100-300/mo |
| **Total per conversation** | **~₹5-8 ($0.06-0.10)** |
| **Total infrastructure** | **~$300-500/mo** |

---

*Generated for TiltedPrompts — February 2026*
