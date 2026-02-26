# TiltedMCP - High-Performance MCP Servers

**Product:** TiltedMCP
**Category:** Developer Infrastructure
**Status:** Active Development
**Version:** 1.0
**Last Updated:** 2026-02-21

---

## Overview

TiltedMCP delivers production-ready Model Context Protocol servers that connect AI agents to real-world data sources with sub-10ms response times. Six purpose-built server variants cover the most common integration patterns, while a Custom Server SDK handles everything else. Each server ships as a single Docker image with OpenTelemetry tracing, structured logging, and health checks baked in.

This is not a toy. Every server is built for production workloads: connection pooling, automatic reconnection, graceful shutdown, and zero-downtime deployments out of the box.

---

## Problem Statement

MCP is the emerging standard for connecting AI agents to external tools and data. But the current ecosystem is dominated by fragile reference implementations, weekend projects, and servers that fall over the moment they see real traffic. Developers building with Cursor, Claude Desktop, or custom agent frameworks face three recurring problems:

1. **No production path.** Reference servers lack connection pooling, retry logic, health checks, and observability. They work in demos. They break in production.
2. **Integration tax.** Every new data source means writing a new MCP server from scratch. Authentication, rate limiting, error handling, and schema validation are rebuilt every time.
3. **Blind operations.** Without tracing and structured logging, debugging agent-tool interactions is guesswork. When a tool call fails at 3am, you have nothing to work with.

---

## Solution

TiltedMCP provides six battle-tested MCP server variants plus a Custom Server SDK:

| Server | Purpose |
|---|---|
| **TiltedMCP/SQLite** | Local and embedded database access for agents |
| **TiltedMCP/PostgreSQL** | Production database queries with connection pooling and query sanitization |
| **TiltedMCP/Slack** | Workspace search, channel reads, message posting, thread management |
| **TiltedMCP/Search** | Web search aggregation across multiple providers with result ranking |
| **TiltedMCP/GitHub** | Repository management, PR workflows, issue tracking, code search |
| **TiltedMCP/SDK** | Custom Server SDK for building your own MCP servers in under 50 lines |

Every server follows the same operational contract: Docker-ready, OpenTelemetry-instrumented, health-checked, and horizontally scalable.

---

## Technical Architecture

### Stack

- **Runtime:** Node.js 22 LTS
- **Language:** TypeScript 5.x (strict mode)
- **Protocol:** @modelcontextprotocol/sdk (latest stable)
- **Transport:** stdio (local), SSE (remote), WebSocket (custom)
- **Containerization:** Multi-stage Docker builds, distroless final images
- **Observability:** OpenTelemetry SDK (traces + metrics), structured JSON logging via pino
- **Configuration:** Environment variables with JSON schema validation

### Server Architecture

```
┌─────────────────────────────────────────────────┐
│                  MCP Client                      │
│        (Cursor / Claude Desktop / Agent)         │
└──────────────────┬──────────────────────────────┘
                   │ stdio / SSE / WebSocket
┌──────────────────▼──────────────────────────────┐
│              TiltedMCP Server                     │
│  ┌────────────┐ ┌────────────┐ ┌──────────────┐ │
│  │  Transport  │ │  Auth &    │ │  Rate        │ │
│  │  Layer      │ │  Validation│ │  Limiter     │ │
│  └─────┬──────┘ └─────┬──────┘ └──────┬───────┘ │
│        └───────────────┼───────────────┘         │
│                   ┌────▼─────┐                   │
│                   │  Router  │                   │
│                   └────┬─────┘                   │
│  ┌─────────┐ ┌────────▼───────┐ ┌────────────┐  │
│  │  Tools  │ │   Resources    │ │  Prompts   │  │
│  └─────────┘ └────────────────┘ └────────────┘  │
│  ┌──────────────────────────────────────────┐    │
│  │  Connection Pool / Data Source Adapter    │    │
│  └──────────────────────────────────────────┘    │
│  ┌──────────────────────────────────────────┐    │
│  │  OpenTelemetry Exporter + Health Check    │    │
│  └──────────────────────────────────────────┘    │
└──────────────────────────────────────────────────┘
```

### Performance Targets

| Metric | Target |
|---|---|
| Tool call response (p50) | < 5ms (excluding external I/O) |
| Tool call response (p99) | < 10ms (excluding external I/O) |
| Cold start | < 200ms |
| Memory footprint | < 50MB per server instance |
| Concurrent connections | 100+ per instance |
| Reconnection time | < 1s with exponential backoff |

### Key Technical Decisions

- **Connection pooling** via generic-pool for database variants. Configurable min/max connections, idle timeout, and eviction policies.
- **Auto-reconnection** with exponential backoff and jitter. Servers survive transient network failures without manual intervention.
- **Structured logging** via pino. Every log line is JSON with correlation IDs that tie back to OpenTelemetry trace spans.
- **Health checks** exposed on a configurable HTTP port. Liveness, readiness, and startup probes for Kubernetes deployments.
- **Graceful shutdown** handles SIGTERM/SIGINT, drains active connections, and flushes telemetry buffers before exit.

---

## Features

### Core (All Servers)

- MCP protocol compliance (tools, resources, prompts)
- stdio, SSE, and WebSocket transport support
- OpenTelemetry tracing with automatic span creation for every tool call
- Structured JSON logging with configurable log levels
- Health check endpoint (HTTP GET /health)
- Environment-based configuration with JSON schema validation
- Docker image with multi-stage build (< 100MB final image)
- Graceful shutdown with connection draining
- Auto-reconnection with exponential backoff and jitter

### SQLite Server

- Read/write access to local SQLite databases
- Schema introspection as MCP resources
- Parameterized queries to prevent SQL injection
- WAL mode for concurrent read performance
- Database file watching for schema change detection

### PostgreSQL Server

- Connection pooling (configurable pool size, idle timeout)
- Read-only and read-write query modes
- Query timeout enforcement
- Schema introspection and table listing as resources
- SSL/TLS connection support
- Query plan explanation tool

### Slack Server

- Workspace-scoped OAuth2 authentication
- Channel listing, search, and message retrieval
- Message posting and thread reply tools
- User and channel mention resolution
- File upload support
- Rate limit handling with automatic retry

### Search Server

- Multi-provider search aggregation (configurable backends)
- Result deduplication and relevance ranking
- Snippet extraction and summarization
- Safe search enforcement
- Search history as MCP resources

### GitHub Server

- Personal access token and GitHub App authentication
- Repository listing, file reading, and code search
- Pull request creation, review, and merge tools
- Issue creation and management
- Branch and tag operations
- Webhook event resources

### Custom Server SDK

- `createTiltedServer()` factory with sensible defaults
- Declarative tool, resource, and prompt registration
- Built-in input validation via Zod schemas
- Middleware pipeline for auth, logging, and rate limiting
- TypeScript-first with full type inference
- CLI scaffolding: `npx create-tilted-mcp`

---

## Pricing

| Plan | Price | Includes |
|---|---|---|
| **Free** | $0/mo | 1 server variant, community support, stdio transport only |
| **Pro** | $29/mo | All 6 server variants, SSE + WebSocket transport, OpenTelemetry export, email support |
| **Team** | $99/mo | Everything in Pro + Custom Server SDK, priority support, private Discord channel, custom Docker registry |

All plans include unlimited tool calls. No per-request pricing.

---

## Target Users

**Primary:** Developers building AI-powered applications with Cursor, Claude Desktop, Windsurf, or custom agent frameworks who need reliable MCP servers for production workloads.

**Secondary:** DevOps and platform teams standardizing on MCP as the tool integration layer for their AI infrastructure.

**Persona Profiles:**

- **Solo developer** shipping an AI-powered SaaS product. Needs a PostgreSQL MCP server that survives real traffic. Currently running the reference implementation and losing sleep.
- **Startup engineering team (3-10)** building a customer support agent. Needs Slack, GitHub, and search servers that work together with shared observability. Currently maintaining three separate MCP forks.
- **Agency developer** building AI tools for clients. Needs the SDK to ship custom MCP servers fast. Currently writing boilerplate from scratch on every project.

---

## Success Metrics

| Metric | 3-Month Target | 6-Month Target |
|---|---|---|
| Monthly active servers (deployed) | 500 | 2,500 |
| Pro conversions | 100 | 500 |
| Team conversions | 20 | 100 |
| p99 response time | < 10ms | < 8ms |
| Server uptime (managed) | 99.9% | 99.95% |
| GitHub stars (SDK) | 500 | 2,000 |
| npm weekly downloads | 1,000 | 10,000 |

---

## Roadmap

### Phase 1: Foundation (Months 1-2)

- Ship SQLite, PostgreSQL, and GitHub servers
- Publish Custom Server SDK with CLI scaffolding
- Docker images on GitHub Container Registry
- Documentation site with quickstart guides
- Free tier launch

### Phase 2: Expansion (Months 3-4)

- Ship Slack and Search servers
- SSE and WebSocket transport support
- OpenTelemetry dashboard templates (Grafana, Datadog)
- Pro tier launch
- Integration testing framework for custom servers

### Phase 3: Scale (Months 5-6)

- Managed hosting option (deploy via CLI, we run the infrastructure)
- Server marketplace for community-built servers
- Team tier launch with private registry
- Multi-server orchestration (tool routing across server clusters)
- Enterprise SSO and audit logging

### Phase 4: Ecosystem (Months 7-12)

- Visual server builder (drag-and-drop tool/resource configuration)
- Pre-built connectors: Notion, Linear, Jira, Confluence, Google Workspace
- MCP server performance benchmarking suite
- Certification program for community server authors
- Enterprise tier with SLA, dedicated support, and custom development
