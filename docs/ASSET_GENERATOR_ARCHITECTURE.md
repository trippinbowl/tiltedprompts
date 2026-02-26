# TiltedPrompts: Autonomous Asset Generator — Technical Architecture

**Version:** 1.0.0
**Author:** TiltedPrompts Engineering
**Date:** February 2026
**Classification:** Internal / Investor-Ready

---

## Executive Summary

The Asset Generator is the autonomous supply chain of TiltedPrompts. It is a single OpenClaw agent skill that transforms a Slack command or daily cron trigger into a fully formatted, database-ready digital asset — without any human intervention.

This document describes the end-to-end flow from trigger to database insertion, the security model, and the scalability path toward automated SEO content generation.

---

## System Architecture

```
                        TRIGGER LAYER
                ┌─────────────────────────────────┐
                │  Slack Command      Daily Cron   │
                │  (@Claw generate)   (09:00 IST)  │
                └──────────┬──────────────┬────────┘
                           │              │
                           ▼              ▼
                ┌─────────────────────────────────┐
                │     OpenClaw Agent Runtime       │
                │  ┌───────────────────────────┐   │
                │  │  tilted_asset_generator    │   │
                │  │  (instructions.md)         │   │
                │  └───────────┬───────────────┘   │
                └──────────────┼───────────────────┘
                               │
                    GENERATION LAYER
                ┌──────────────┼───────────────────┐
                │              ▼                    │
                │  ┌─────────────────────────┐      │
                │  │  Flask Bundle Generator  │      │
                │  │  POST /generate          │      │
                │  │  (localhost:5000)         │      │
                │  └───────────┬─────────────┘      │
                │              │                    │
                │              ▼                    │
                │  ┌─────────────────────────┐      │
                │  │  LLM Provider Layer      │      │
                │  │  (Local / DeepSeek)       │      │
                │  └───────────┬─────────────┘      │
                └──────────────┼───────────────────┘
                               │
                    INGESTION LAYER
                ┌──────────────┼───────────────────┐
                │              ▼                    │
                │  ┌─────────────────────────┐      │
                │  │  tools.py Transform      │      │
                │  │  Flask JSON → DB Payload  │      │
                │  └───────────┬─────────────┘      │
                │              │                    │
                │              ▼                    │
                │  ┌─────────────────────────┐      │
                │  │  Next.js API Endpoint    │      │
                │  │  POST /api/ingest-bundle │      │
                │  │  (HMAC-SHA256 verified)   │      │
                │  └───────────┬─────────────┘      │
                │              │                    │
                │              ▼                    │
                │  ┌─────────────────────────┐      │
                │  │  Supabase PostgreSQL      │      │
                │  │  library_assets table     │      │
                │  │  (RLS enforced)           │      │
                │  └─────────────────────────┘      │
                └──────────────────────────────────┘
```

---

## Data Flow (Step-by-Step)

### Step 1: Trigger
The skill is activated by one of two mechanisms:

| Trigger | Mechanism | Example |
|---------|-----------|---------|
| **Manual** | Slack message to OpenClaw bot | `@Claw generate 5 new prompts for Indian Real Estate` |
| **Automated** | OS-level cron (Task Scheduler on Windows, crontab on Linux) invoking `tools.py` directly | Runs daily at 09:00 IST with rotating niche list |

### Step 2: Parameter Extraction
The OpenClaw agent (guided by `instructions.md`) parses the trigger into structured parameters:

```json
{
    "niche": "Indian Real Estate Agents",
    "count": 5,
    "bundle_type": "mixed",
    "language": "English",
    "tone": "professional yet friendly",
    "extra_notes": "Focus on WhatsApp follow-ups and site visit booking"
}
```

### Step 3: Bundle Generation
`tools.py` sends these parameters to the existing Flask API (`POST /generate`). The Flask server:
1. Constructs a system prompt + user prompt
2. Routes to the configured LLM (local or DeepSeek)
3. Parses the LLM's JSON response (handling `<think>` blocks, markdown fences, trailing commas)
4. Saves `bundle.json`, `bundle.md`, and `params.json` to disk
5. Returns the structured bundle with metadata

### Step 4: Payload Transformation
`tools.py` transforms the Flask response into the exact schema expected by our Supabase `library_assets` table:

```json
{
    "title": "WhatsApp Follow-Up Mastery for Indian Real Estate",
    "description": "5 copy-paste ready prompts for real estate agents...",
    "asset_type": "prompt_bundle",
    "platform": ["whatsapp", "real-estate"],
    "content": { /* full bundle.json content */ },
    "is_premium": false,
    "tags": ["real-estate", "whatsapp", "india", "follow-up"]
}
```

### Step 5: Secure Ingestion
`tools.py` POSTs the transformed payload to the Next.js ingestion endpoint with HMAC-SHA256 authentication:

```
POST /api/ingest-bundle
Headers:
    Content-Type: application/json
    X-Ingest-Key: <INGEST_API_KEY>
    X-Ingest-Timestamp: <unix_epoch_seconds>
    X-Ingest-Signature: HMAC-SHA256(timestamp + "." + body, INGEST_SECRET)
```

The Next.js endpoint:
1. Validates the HMAC signature (rejects replay attacks older than 5 minutes)
2. Validates the JSON payload against the expected schema
3. Checks for duplicate titles in Supabase
4. Inserts the record into `library_assets` using the Supabase Admin client
5. Returns the created asset ID

### Step 6: Confirmation
`tools.py` reports the result back to the OpenClaw agent, which formats a Slack confirmation message with the asset title, type, and a direct link to the members dashboard.

---

## Security Model

| Layer | Mechanism | Purpose |
|-------|-----------|---------|
| **Transport** | HTTPS (Vercel TLS) | Encrypt all API traffic |
| **Authentication** | HMAC-SHA256 signature | Only our agent can write to the database |
| **Replay Prevention** | Timestamp window (300s) | Prevents captured requests from being replayed |
| **Input Validation** | Pydantic-style schema check in Next.js | Rejects malformed or oversized payloads |
| **Database** | Supabase RLS | Even if the API is breached, RLS prevents unauthorized reads |
| **Rate Limiting** | Max 20 ingestions per hour | Prevents runaway cron from flooding the database |

---

## Database Schema

```sql
CREATE TABLE public.library_assets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    asset_type TEXT NOT NULL CHECK (asset_type IN (
        'prompt_bundle', 'n8n_workflow', 'openclaw_skill',
        'gpt_config', 'code_template', 'voice_agent'
    )),
    platform TEXT[] DEFAULT '{}',
    content JSONB NOT NULL,
    tags TEXT[] DEFAULT '{}',
    is_premium BOOLEAN DEFAULT false,
    download_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_library_assets_type ON public.library_assets(asset_type);
CREATE INDEX idx_library_assets_premium ON public.library_assets(is_premium);
CREATE INDEX idx_library_assets_tags ON public.library_assets USING GIN(tags);
```

---

## Scalability Path

### Phase 1 (Current): Prompt Bundle Generation
Single-niche, single-language bundles triggered manually or daily.

### Phase 2: Multi-Asset Types
Extend `tools.py` to generate n8n workflow JSON scaffolds and OpenClaw skill definitions.

### Phase 3: SEO Content Engine
The same architecture is reused with a new skill (`tilted_seo_generator`) that:
1. Scrapes trending Indian business news via RSS/API
2. Generates SEO-optimized blog posts targeting long-tail keywords
3. POSTs to a `/api/ingest-blog` endpoint
4. Deploys to the Next.js blog via ISR revalidation

### Phase 4: Quality Gate
Add an LLM-as-judge evaluation step between generation and ingestion that scores each asset on specificity, actionability, and market relevance before allowing database insertion.

---

## Operational Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Generation success rate | >95% | Successful Flask API calls / total attempts |
| Ingestion success rate | >99% | Successful DB inserts / total POST attempts |
| End-to-end latency | <45s | Trigger → DB insert (dominated by LLM inference) |
| Daily throughput | 5-20 assets | Configurable via cron schedule |
| Asset quality score | >7/10 | Phase 4: LLM-as-judge evaluation |

---

*This document is the technical specification for the TiltedPrompts autonomous supply chain. It demonstrates that our content pipeline requires zero manual intervention while maintaining production-grade security and data integrity.*
