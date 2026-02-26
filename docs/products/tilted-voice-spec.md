# TiltedVoice - Low-Latency Voice AI Agents

**Product:** TiltedVoice
**Category:** Conversational AI
**Status:** Active Development
**Version:** 1.0
**Last Updated:** 2026-02-21

---

## Overview

TiltedVoice builds low-latency voice AI agents that answer calls, qualify leads, book appointments, and run surveys in 12+ languages. The system hits sub-500ms first-byte latency by running a WebSocket pipeline that chains speech-to-text, language model reasoning, and text-to-speech in a streaming architecture. No batch processing. No waiting for full transcriptions. Words flow in, responses flow out.

Five agent templates cover the highest-value use cases. Each template ships with pre-built conversation flows, CRM integration, call recording, and sentiment analysis. Customization happens through natural language configuration, not code.

---

## Problem Statement

Businesses lose revenue every time a call goes unanswered, a lead goes unqualified, or an appointment slot goes unfilled. Human agents are expensive, inconsistent, and unavailable at 2am. The existing voice AI market offers two bad options:

1. **Enterprise platforms** (Genesys, Five9, NICE) that cost six figures, take months to deploy, and require dedicated engineering teams. Small and mid-market companies are priced out entirely.
2. **DIY solutions** that duct-tape Twilio, Whisper, and GPT together. These break constantly, have 2-3 second latency (unacceptable in conversation), and require ongoing maintenance from engineers who should be building product.

The Indian market compounds this problem. Businesses need agents that handle Hindi, Tamil, Telugu, Bengali, Marathi, Gujarati, and Kannada. English-only solutions miss 70%+ of the addressable market. Multilingual voice AI at conversational speed does not exist at an accessible price point.

---

## Solution

TiltedVoice is a managed voice AI platform with five production-ready agent templates:

| Template | Use Case |
|---|---|
| **Support Agent** | Handles inbound support calls, resolves common issues, escalates to humans when needed |
| **Sales Qualifier** | Answers inbound leads, qualifies against custom criteria, routes hot leads to sales reps |
| **Appointment Booker** | Manages scheduling conversations, checks calendar availability, sends confirmations |
| **Survey Agent** | Conducts outbound phone surveys, captures structured responses, handles branching logic |
| **Custom Builder** | Visual flow editor for building agents from scratch with pre-built conversation components |

Each template includes:

- Pre-built conversation flows with branching logic
- CRM integration (HubSpot, Salesforce) for contact sync and activity logging
- Call recording with automatic transcription
- Real-time sentiment analysis
- 12+ language support with automatic language detection
- Dashboard with call analytics, conversion metrics, and agent performance

---

## Technical Architecture

### Pipeline

```
┌──────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  Caller  │───▶│  Telephony   │───▶│  Voice       │───▶│  Agent       │
│  (PSTN/  │    │  Gateway     │    │  Activity    │    │  Orchestrator│
│  WebRTC) │    │  (Twilio/    │    │  Detection   │    │              │
│          │◀───│  Vonage)     │◀───│  (VAD)       │◀───│              │
└──────────┘    └──────────────┘    └──────────────┘    └──────┬───────┘
                                                               │
                                    ┌──────────────────────────┤
                                    │                          │
                              ┌─────▼──────┐            ┌─────▼──────┐
                              │  STT        │            │  LLM       │
                              │  (Deepgram) │───────────▶│  (Claude/  │
                              │  Streaming  │            │  GPT-4o)   │
                              └─────────────┘            └─────┬──────┘
                                                               │
                              ┌─────────────┐            ┌─────▼──────┐
                              │  CRM Sync   │◀───────────│  TTS       │
                              │  + Analytics│            │  (Eleven   │
                              │             │            │  Labs)     │
                              └─────────────┘            └────────────┘
```

### Stack

- **Runtime:** Node.js 22 LTS + Bun (worker processes)
- **Language:** TypeScript 5.x
- **Telephony:** Twilio Programmable Voice, Vonage Voice API
- **STT:** Deepgram Nova-2 (streaming mode, multilingual)
- **LLM:** Claude 3.5 Sonnet (primary), GPT-4o (fallback), with function calling for structured actions
- **TTS:** ElevenLabs Turbo v2 (streaming mode, voice cloning)
- **Transport:** WebSocket (all inter-service communication)
- **Queue:** BullMQ on Redis (outbound call scheduling, async tasks)
- **Database:** PostgreSQL (call records, analytics) + Redis (session state, caching)
- **Infrastructure:** Fly.io (edge deployment for latency), AWS (data processing)

### Latency Budget

| Stage | Target | Notes |
|---|---|---|
| VAD detection | < 50ms | Silero VAD running locally |
| STT (first partial) | < 100ms | Deepgram streaming with interim results |
| LLM (first token) | < 200ms | Streaming response, prompt caching |
| TTS (first byte) | < 100ms | ElevenLabs streaming, pre-warmed connections |
| Network overhead | < 50ms | Edge deployment, persistent WebSocket connections |
| **Total first-byte** | **< 500ms** | End-to-end from speech end to audio start |

### Voice Activity Detection

- Silero VAD model running in-process for < 50ms detection
- Configurable silence threshold (default: 600ms)
- Barge-in support: caller can interrupt the agent mid-sentence
- Endpointing with contextual awareness (agent waits longer after questions)
- Background noise filtering to prevent false triggers

### Language Support

| Language | STT | TTS | LLM | Status |
|---|---|---|---|---|
| English | Deepgram | ElevenLabs | Claude/GPT | Production |
| Hindi | Deepgram | ElevenLabs | Claude/GPT | Production |
| Tamil | Deepgram | ElevenLabs | Claude | Production |
| Telugu | Deepgram | ElevenLabs | Claude | Production |
| Bengali | Deepgram | ElevenLabs | Claude | Beta |
| Marathi | Deepgram | ElevenLabs | Claude | Beta |
| Gujarati | Deepgram | ElevenLabs | Claude | Beta |
| Kannada | Deepgram | ElevenLabs | Claude | Beta |
| Malayalam | Deepgram | ElevenLabs | Claude | Planned |
| Punjabi | Deepgram | ElevenLabs | Claude | Planned |
| Spanish | Deepgram | ElevenLabs | Claude/GPT | Production |
| French | Deepgram | ElevenLabs | Claude/GPT | Production |

Automatic language detection on the first utterance. Mid-call language switching supported for bilingual conversations (e.g., Hindi-English code-switching).

---

## Features

### Core Platform

- **Sub-500ms first-byte latency** via fully streaming WebSocket pipeline
- **Voice Activity Detection** with barge-in support and contextual endpointing
- **Automatic language detection** across 12+ languages
- **Mid-call language switching** for bilingual conversations
- **Call recording** with automatic transcription and searchable archive
- **Real-time sentiment analysis** with per-utterance scoring
- **Call transfer** to human agents with full context handoff
- **DTMF handling** for IVR menu navigation and numeric input
- **Voicemail detection** and message leaving for outbound calls

### Agent Templates

**Support Agent**
- Knowledge base integration (upload docs, FAQs, product manuals)
- Ticket creation in connected helpdesk (Zendesk, Freshdesk, Intercom)
- Issue categorization and priority routing
- Escalation rules with configurable triggers
- Resolution tracking and CSAT scoring

**Sales Qualifier**
- Custom qualification criteria (BANT, MEDDIC, or custom frameworks)
- Lead scoring with configurable weightings
- Calendar-aware meeting booking for qualified leads
- CRM contact creation and activity logging
- Hot lead alerts via Slack, email, or webhook

**Appointment Booker**
- Google Calendar and Outlook integration
- Availability checking with buffer time configuration
- Confirmation and reminder calls
- Rescheduling and cancellation handling
- Timezone-aware scheduling with automatic conversion

**Survey Agent**
- Branching survey logic with conditional questions
- Structured data capture with validation
- Outbound call scheduling with retry policies
- Response aggregation and export (CSV, API)
- Real-time completion tracking dashboard

**Custom Builder**
- Visual conversation flow editor (drag-and-drop)
- Pre-built components: greeting, question, confirmation, transfer, end call
- Custom function calling for external API integration
- Variable management and conditional branching
- Testing sandbox with simulated calls

### Integrations

- **CRM:** HubSpot (native), Salesforce (native), Pipedrive (webhook), Zoho (webhook)
- **Calendar:** Google Calendar, Microsoft Outlook
- **Helpdesk:** Zendesk, Freshdesk, Intercom
- **Messaging:** Slack alerts, email notifications, SMS confirmations
- **Telephony:** Twilio (primary), Vonage (secondary), SIP trunking (enterprise)
- **Webhooks:** Custom HTTP callbacks for any event

### Analytics Dashboard

- Call volume, duration, and outcome metrics
- Conversion rates by agent template and campaign
- Sentiment trends over time
- Language distribution breakdown
- Peak hour analysis
- Agent performance comparison
- Cost per call and cost per conversion
- Exportable reports (PDF, CSV)

---

## Pricing

| Plan | Price | Minutes | Features |
|---|---|---|---|
| **Starter** | $49/mo | 500 minutes | 1 agent template, 2 languages, call recording, basic analytics |
| **Growth** | $149/mo | 2,500 minutes | All 5 templates, all languages, CRM integration, sentiment analysis, priority support |
| **Scale** | Custom | Custom | Everything in Growth + SIP trunking, custom voice cloning, dedicated infrastructure, SLA, onboarding |

Overage rates: $0.12/min (Starter), $0.08/min (Growth), negotiated (Scale).

All plans include call recording storage for 90 days. Extended retention available on Growth and Scale.

---

## Target Users

**Primary:** Indian SMBs and startups running sales, support, or scheduling operations that need multilingual voice automation at a price point that makes sense for their market.

**Secondary:** Global SaaS companies and agencies deploying voice agents for their clients or internal operations.

**Persona Profiles:**

- **D2C brand founder** (India) receiving 200+ daily customer calls in Hindi and English. Currently using a 5-person call center at 3 lakh/month. Needs a support agent that handles 80% of calls automatically.
- **Real estate agency** booking property viewings across multiple agents. Currently losing 40% of inbound leads to missed calls. Needs an appointment booker that answers every call in under 3 rings.
- **SaaS startup** qualifying inbound demo requests. Sales team spends 60% of their time on unqualified leads. Needs a sales qualifier that filters and routes only high-intent prospects.
- **Market research firm** conducting phone surveys in regional Indian languages. Currently paying per-interview costs that make large sample sizes prohibitive. Needs a survey agent that scales to thousands of calls.

---

## Success Metrics

| Metric | 3-Month Target | 6-Month Target |
|---|---|---|
| Monthly active agents (deployed) | 100 | 500 |
| Total call minutes processed | 50,000 | 500,000 |
| Starter conversions | 80 | 300 |
| Growth conversions | 30 | 150 |
| Average first-byte latency | < 500ms | < 400ms |
| Call completion rate | 85% | 90% |
| Languages in production | 8 | 12 |
| MRR | $8,000 | $50,000 |

---

## Roadmap

### Phase 1: Core Pipeline (Months 1-2)

- Ship streaming STT-LLM-TTS pipeline with sub-500ms latency
- Launch Support Agent and Sales Qualifier templates
- English and Hindi language support (production quality)
- Twilio telephony integration
- Basic call recording and transcription
- Starter tier launch

### Phase 2: Templates & Languages (Months 3-4)

- Ship Appointment Booker and Survey Agent templates
- Add Tamil, Telugu, and Spanish to production
- HubSpot and Google Calendar native integrations
- Sentiment analysis pipeline
- Analytics dashboard v1
- Growth tier launch

### Phase 3: Platform (Months 5-6)

- Ship Custom Builder with visual flow editor
- Bengali, Marathi, Gujarati, Kannada to beta
- Salesforce native integration
- Voice cloning for branded agent voices
- Outbound calling engine with campaign management
- Scale tier launch

### Phase 4: Enterprise (Months 7-12)

- SIP trunking for enterprise telephony
- On-premise deployment option
- SOC 2 Type II compliance
- Advanced analytics with custom report builder
- Multi-agent orchestration (transfer between specialized agents)
- Marketplace for community agent templates
- WhatsApp voice note integration
- Video call support (WebRTC)
