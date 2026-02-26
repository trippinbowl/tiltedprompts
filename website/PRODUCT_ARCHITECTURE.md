# TiltedPrompts — Complete Product Architecture
## The Agentic Coding Platform

---

## PRODUCT MAP (Bridgemind → TiltedPrompts Mapping)

| Bridgemind | TiltedPrompts | Key Difference |
|------------|---------------|----------------|
| BridgeMCP (single MCP server) | **TiltedMCP** (managed MCP platform) | We host a PLATFORM for deploying any MCP server, plus pre-built servers |
| BridgeCode (AI coding agent) | **TiltedCode** (agentic code templates) | We sell production-ready starter kits, not a competing CLI agent |
| BridgeVoice (Whisper dictation) | **TiltedVoice** (2 packages: International + Indic) | We go deeper — Indian languages via Sarvam AI + global via Whisper |
| BridgeSpace (desktop app) | **The Laboratory** (automation engine) | We focus on n8n workflows + WhatsApp, not a desktop IDE |

---

## PRODUCT 1: TiltedMCP

### What It Is
A managed platform for deploying, hosting, and discovering MCP servers. Think "Vercel for MCP."

### Two Sides of the Product:

**A) TiltedMCP Platform** (the hosting service)
- `npx create-tilted-mcp` → scaffold a server in 60 seconds
- `tilted deploy` → deploy to Cloudflare Workers edge
- Auto-injected OAuth 2.1 (via Auth0) — zero auth code from developer
- Dashboard: invocation logs, latency metrics, error rates
- Marketplace: publish servers, usage-based revenue share

**B) TiltedMCP Servers** (pre-built, ready to connect)
- `@tiltedprompts/mcp-supabase` — query/insert/update any Supabase project
- `@tiltedprompts/mcp-notion` — read/write Notion pages, databases
- `@tiltedprompts/mcp-gmail` — read inbox, send emails, manage labels
- `@tiltedprompts/mcp-github` — issues, PRs, repo management
- `@tiltedprompts/mcp-sheets` — read/write Google Sheets
- `@tiltedprompts/mcp-whatsapp` — send/receive WhatsApp messages via Gupshup
- `@tiltedprompts/mcp-indian-apis` — GST verification, PAN lookup, UPI status

### MCP Tools Exposed (per server)
Each pre-built server follows the standard MCP pattern:
- **Tools**: Actions the agent can take (query_database, send_message, etc.)
- **Resources**: Read-only data the agent can access (schema, config, etc.)
- **Prompts**: Reusable templates for consistent agent behavior

### Tech Stack
- Runtime: Cloudflare Workers (TypeScript)
- SDK: `@modelcontextprotocol/sdk` + custom FastMCP wrapper
- Auth: Auth0 OAuth 2.1
- Dashboard: Next.js + tRPC + Neon PostgreSQL
- Analytics: ClickHouse
- Transport: Streamable HTTP (primary), SSE (fallback)

### Client Support
Works with: Cursor, Claude Code, Claude Desktop, Windsurf, Codex CLI, VS Code Copilot

---

## PRODUCT 2: TiltedVoice

### What It Is
Voice-to-text platform with two packages — one for global (Whisper on-device) and one for Indian languages (Sarvam AI cloud).

### Package A: `@tiltedprompts/voice` (International)
**Like BridgeVoice, but as a distributable package + API**

- On-device transcription via OpenAI Whisper
- Models: tiny (75MB) → large-v3 (3.1GB)
- Metal GPU acceleration on Apple Silicon
- Push-to-talk and toggle recording modes
- Universal text injection (clipboard method)
- Zero cloud dependency — fully offline
- Desktop app (Electron/Tauri) + CLI tool
- Sub-500ms latency
- 99 languages supported

**Distribution:**
- Desktop app download (macOS, Windows, Linux)
- npm package: `npm i @tiltedprompts/voice`
- CLI: `npx tilted-voice`

### Package B: `@tiltedprompts/voice-indic` (Indian Languages)
**India-specific voice AI — what no one else offers as a managed platform**

- Cloud transcription via Sarvam AI (Saaras v3 STT, Bulbul v3 TTS)
- 22 Indian languages: Hindi, Tamil, Telugu, Bengali, Kannada, Marathi, Gujarati, Malayalam, Punjabi, Odia, Assamese, Urdu, etc.
- Code-switching support (Hinglish, Tanglish, etc.)
- Sub-800ms end-to-end voice agent pipeline
- Voice agent builder (system prompt → conversation flow → deploy)
- Telephony integration (Exotel for Indian numbers)
- WhatsApp Business Calling API integration
- Real-time WebRTC via LiveKit

**Distribution:**
- npm package: `npm i @tiltedprompts/voice-indic`
- Python package: `pip install tiltedvoice`
- REST API: `api.tiltedprompts.com/voice/v1`
- Dashboard for no-code agent building

### Shared Features (Both Packages)
- Custom dictionary / vocabulary
- Transcription history with search
- Hotkey configuration
- API access for integration into other apps

### Tech Stack
| Layer | International | Indic |
|-------|--------------|-------|
| STT | Whisper (on-device) | Sarvam Saaras v3 (cloud) |
| TTS | — (dictation only) | Sarvam Bulbul v3 (cloud) |
| LLM | — | GPT-4.1-mini (agent brain) |
| Transport | Local audio capture | WebRTC via LiveKit |
| Runtime | Rust/Tauri (desktop) | Python FastAPI (backend) |
| Telephony | — | Exotel (India) + Twilio (global) |
| WhatsApp | — | Gupshup BSP |

---

## PRODUCT 3: TiltedCode

### What It Is
Production-ready Next.js templates pre-wired for AI coding agents. Not a competing AI agent — a set of starter kits that make AI agents more effective.

### Templates
- **SaaS Starter** — Auth + billing + dashboard + landing page
- **AI Chat App** — Multi-model chat with streaming + memory
- **Voice Agent App** — TiltedVoice integration + conversation UI
- **MCP Dashboard** — Admin panel for managing MCP servers
- **n8n + WhatsApp** — Automation stack with Indian market focus

### Each Template Includes
- `.cursorrules` / `.claude` agent context files
- Pre-configured Supabase schema + RLS policies
- Tailwind design system matching TiltedPrompts brand
- MCP server pre-connected via TiltedMCP
- Deployment scripts for Vercel/Cloudflare

### Distribution
- `npx create-tilted-app` — interactive CLI
- GitHub repos (open source templates)
- Members area download (premium templates)

---

## PRODUCT 4: The Laboratory

### What It Is
Pre-built n8n workflows and WhatsApp automation for Indian MSMEs. The "business automation in a box" product.

### What's Included
- Importable n8n JSON workflow files
- WhatsApp Business API setup guides
- Instagram → WhatsApp lead funnels
- CRM automation pipelines
- Payment collection via Razorpay + UPI

### Distribution
- Members area (current website)
- n8n community marketplace
- Gumroad/Lemon Squeezy for individual bundles

---

## HOW IT ALL FITS TOGETHER

```
TiltedMCP is the connective layer — it gives AI agents access to
databases, APIs, and services through MCP.

TiltedCode is the starting point — production templates that come
pre-wired with TiltedMCP so agents know how to extend them.

TiltedVoice adds voice as an interface — dictate code globally
with Whisper, or build Hindi/Tamil voice agents with the Indic package.

The Laboratory is the business automation layer — n8n workflows
and WhatsApp automation for Indian SMEs who need results, not code.
```

---

## BUILD ORDER & PRIORITIES

### Phase 1: TiltedMCP (Weeks 1-8) — THE FOUNDATION
This is the connective tissue. Build this first.
1. CLI scaffolder (`create-tilted-mcp`)
2. Pre-built servers (Supabase, GitHub, Notion)
3. Deploy pipeline (Cloudflare Workers)
4. Dashboard (invocation logs, metrics)

### Phase 2: TiltedVoice International (Weeks 4-10, overlapping)
Ship the simpler Whisper package first.
1. Tauri desktop app with Whisper integration
2. npm package for developers
3. Push-to-talk + toggle modes
4. Custom dictionary support

### Phase 3: TiltedVoice Indic (Weeks 8-16)
The India differentiator.
1. Sarvam AI integration (STT + TTS)
2. Voice agent pipeline (STT → LLM → TTS)
3. Web dashboard + agent builder
4. Telephony (Exotel) + WhatsApp voice

### Phase 4: TiltedCode Templates (Weeks 6-12, overlapping)
Build as we build the other products.
1. SaaS Starter template
2. create-tilted-app CLI
3. Agent context files
4. Premium templates for members area

---

## TASK DIVISION: CLAUDE CODE vs CURSOR vs ANTIGRAVITY

### Claude Code (This Session) — Website + Docs + Planning
- Documentation pages on the website
- Product pages content
- README files for packages
- Architecture documents
- Marketing content

### Cursor — MCP Server Development
- `create-tilted-mcp` CLI tool
- `@tiltedprompts/mcp-supabase` server
- `@tiltedprompts/mcp-github` server
- `@tiltedprompts/mcp-notion` server
- Cloudflare Workers deployment scripts
- Dashboard backend (tRPC + Neon)

### Antigravity — Voice AI Development
- `@tiltedprompts/voice` (Whisper desktop app, Tauri)
- `@tiltedprompts/voice-indic` (Sarvam AI integration, Python)
- LiveKit WebRTC setup
- Voice agent pipeline (FastAPI)
- Exotel telephony integration

---
