# The Laboratory - Workflows & Marketing Prompts

**Product:** The Laboratory
**Category:** Marketing Automation / AI Prompts
**Status:** Active Development
**Version:** 1.0
**Last Updated:** 2026-02-21

---

## Overview

The Laboratory is a curated collection of n8n automation workflows, marketing prompt bundles, and Custom GPT configurations built for businesses that run on content, leads, and conversations. No theory. No generic "write a blog post" prompts. Every asset is built for a specific channel, a specific goal, and a specific output format.

Eight prompt bundles cover the channels that generate revenue: WhatsApp, Instagram, sales email, SEO, D2C marketing, Hindi-language marketing, LinkedIn, and YouTube. Each bundle contains 20-50 tested prompts with variable slots, output formatting rules, and performance benchmarks from real campaigns.

The n8n workflow templates automate the repetitive operations that marketers do manually: social posting schedules, lead capture flows, email sequences, support ticket routing, and content calendar management. Each workflow ships as an importable JSON file with setup documentation.

A Chrome extension puts every prompt one click away from any text input on the web.

---

## Problem Statement

Marketing teams and solo operators face the same bottleneck: the gap between knowing what to do and having the tools to do it efficiently. Three specific problems:

1. **Prompt quality is a crapshoot.** Marketers using AI for content generation get inconsistent results because they write prompts from scratch every time. No institutional knowledge. No version control. No performance tracking. The same team produces wildly different quality depending on who writes the prompt and what mood they're in.
2. **Automation requires engineering.** Marketing automation platforms (HubSpot, Mailchimp, Zapier) handle the simple cases. But the moment you need conditional logic, data transformation, or multi-step workflows across platforms, you need a developer. n8n solves the technical problem but marketing teams don't know where to start with an empty canvas.
3. **Indian market content is underserved.** Hindi marketing content, WhatsApp business automation, D2C playbooks for Indian audiences, and regional language campaigns have no off-the-shelf AI tooling. Global prompt libraries optimize for English-language, US-market content. Indian marketers are left translating and adapting, losing cultural nuance in the process.

---

## Solution

The Laboratory delivers three product categories:

### 1. Marketing Prompt Bundles

Curated collections of battle-tested prompts for specific marketing channels. Each prompt includes:

- Clear use case description
- Variable slots with example values
- Output format specification
- Tone and style guidelines
- Performance benchmarks from real usage
- Iteration prompts for refining output

| Bundle | Prompts | Focus |
|---|---|---|
| **WhatsApp Business** | 40+ | Broadcast messages, drip sequences, catalog descriptions, customer support scripts, festival greetings |
| **Instagram Content** | 50+ | Captions, Stories scripts, Reels hooks, carousel copy, bio optimization, hashtag strategy, DM templates |
| **Sales Email** | 35+ | Cold outreach, follow-ups, objection handling, meeting requests, proposal emails, win-back sequences |
| **SEO Content** | 45+ | Blog outlines, meta descriptions, internal linking strategy, FAQ schema, content briefs, keyword clustering |
| **D2C Marketing** | 40+ | Product descriptions, launch announcements, review responses, unboxing scripts, loyalty program copy |
| **Hindi Marketing** | 50+ | Hindi ad copy, WhatsApp messages, social media posts, email campaigns, landing page copy, video scripts |
| **LinkedIn** | 35+ | Post hooks, carousel scripts, article outlines, connection messages, comment templates, company page copy |
| **YouTube** | 30+ | Video titles, descriptions, thumbnail text, script outlines, community post templates, end screen CTAs |

### 2. n8n Workflow Templates

Pre-built automation workflows importable directly into any n8n instance:

| Workflow | Description |
|---|---|
| **Social Auto-Posting** | Scheduled content publishing across Instagram, LinkedIn, Twitter/X, and Facebook from a single content calendar |
| **Lead Capture Pipeline** | Form submission to CRM entry with enrichment, scoring, and automated first-touch email |
| **Email Sequence Engine** | Trigger-based email sequences with conditional branching, delay logic, and engagement tracking |
| **Support Ticket Router** | Incoming messages (email, WhatsApp, chat) classified by intent and routed to appropriate team/person |
| **Content Calendar Manager** | Content planning workflow with approval stages, scheduling, and cross-platform distribution |
| **Review Aggregator** | Collects reviews from Google, Facebook, and Trustpilot; generates response drafts; flags negative reviews |
| **Invoice Follow-Up** | Automated payment reminders with escalation logic based on overdue duration |
| **Competitor Monitor** | Tracks competitor social posts, pricing changes, and new content; delivers weekly digest |

Each workflow includes:

- Importable n8n JSON file
- Step-by-step setup documentation with screenshots
- Required credentials and API keys checklist
- Customization guide for adapting to specific business needs
- Troubleshooting guide for common issues

### 3. Custom GPT Configurations

Pre-built Custom GPT setups for specialized marketing functions:

| GPT Config | Purpose |
|---|---|
| **SEO Strategist** | Keyword research, content gap analysis, on-page optimization recommendations, competitor content audit |
| **Social Media Manager** | Platform-specific content creation, engagement strategy, posting schedule optimization, trend analysis |
| **Email Marketing Specialist** | Sequence design, subject line testing, segmentation strategy, deliverability optimization |
| **Analytics Interpreter** | Google Analytics and social media metrics interpretation, report generation, insight extraction |
| **Brand Voice Guardian** | Style guide enforcement, tone consistency checking, messaging alignment across channels |
| **Ad Copy Writer** | Google Ads, Meta Ads, and LinkedIn Ads copy generation with platform-specific constraints |

Each configuration includes:

- System prompt with detailed persona and capabilities
- Knowledge base documents (uploadable to Custom GPT)
- Example conversations demonstrating optimal usage
- Prompt starters for common use cases
- Update schedule for keeping knowledge bases current

### 4. Chrome Extension

Browser extension that provides instant access to all purchased prompts:

- **Prompt injection:** Right-click any text input to insert a prompt with variable auto-fill
- **Context detection:** Extension detects which platform you're on (LinkedIn, Gmail, Instagram) and surfaces relevant prompts
- **Variable management:** Save frequently used values (company name, product details, tone preferences) for automatic insertion
- **Favorites and history:** Pin most-used prompts, track usage history
- **Offline access:** All purchased prompts cached locally for offline use
- **Search:** Full-text search across all purchased prompt bundles

---

## Technical Architecture

### Prompt Bundle Format

```yaml
# Each prompt is stored as structured YAML
id: "ig-caption-product-launch-001"
bundle: "instagram-content"
category: "captions"
use_case: "Product launch announcement caption"
version: 2
variables:
  - name: "product_name"
    type: "string"
    example: "GlowSerum Pro"
  - name: "key_benefit"
    type: "string"
    example: "24-hour hydration"
  - name: "price"
    type: "string"
    example: "Rs. 999"
  - name: "launch_date"
    type: "date"
    example: "2026-03-15"
prompt: |
  Write an Instagram caption announcing the launch of {product_name}.
  Lead with the key benefit: {key_benefit}.
  Include the price ({price}) naturally in the copy.
  Launch date: {launch_date}.

  Requirements:
  - Hook in the first line (before "...more")
  - 150-200 words total
  - 3-5 relevant hashtags at the end
  - Include a clear CTA
  - Tone: excited but not hype-y
  - Do not use placeholder language
output_format: "Plain text with line breaks"
tone: "Conversational, confident"
benchmarks:
  avg_engagement_rate: "4.2%"
  sample_size: 47
  last_tested: "2026-01-15"
iteration_prompts:
  - "Make it more urgent without being pushy"
  - "Add a scarcity element (limited stock)"
  - "Rewrite for Stories (shorter, more casual)"
```

### Chrome Extension Architecture

```
┌──────────────────────────────────────────────┐
│              Chrome Extension                 │
│  ┌─────────────┐  ┌───────────────────────┐  │
│  │  Popup UI   │  │  Content Script       │  │
│  │  (Search,   │  │  (Context detection,  │  │
│  │  Browse,    │  │  right-click menu,    │  │
│  │  Favorites) │  │  prompt injection)    │  │
│  └──────┬──────┘  └───────────┬───────────┘  │
│         │                     │               │
│  ┌──────▼─────────────────────▼───────────┐  │
│  │         Background Service Worker       │  │
│  │  (License validation, sync, caching)    │  │
│  └──────────────────┬─────────────────────┘  │
│                     │                         │
│  ┌──────────────────▼─────────────────────┐  │
│  │         Local Storage (IndexedDB)       │  │
│  │  (Cached prompts, variables, history)   │  │
│  └────────────────────────────────────────┘  │
└──────────────────────────────────────────────┘
                      │
                      │ HTTPS (sync + license check)
                      │
┌─────────────────────▼────────────────────────┐
│              TiltedPrompts API                 │
│  ┌────────────┐ ┌────────────┐ ┌───────────┐ │
│  │  License   │ │  Prompt    │ │  Analytics │ │
│  │  Service   │ │  Delivery  │ │  (usage)   │ │
│  └────────────┘ └────────────┘ └───────────┘ │
└───────────────────────────────────────────────┘
```

### n8n Workflow Distribution

- Workflows exported as standard n8n JSON format
- Each workflow packaged with a README, credential checklist, and customization guide
- Version-tracked in a private repository
- Delivered via download portal after purchase
- Update notifications when workflows are improved

### Delivery Platform

- **Storefront:** TiltedPrompts website (Next.js) with Stripe checkout
- **Delivery:** Instant download after purchase + permanent access via customer portal
- **Updates:** Email notification when bundles are updated; re-download from portal
- **Chrome Extension:** Chrome Web Store distribution with license key activation
- **Support:** Community Discord + email support for paid customers

---

## Features

### Prompt Bundles

- 325+ prompts across 8 marketing channels
- Structured format with variables, output specs, and benchmarks
- Performance benchmarks from real campaign usage
- Iteration prompts for refining AI output
- Hindi-language bundle with cultural context and regional nuances
- Quarterly updates with new prompts and refreshed benchmarks
- Downloadable as YAML, JSON, or plain text
- Categorized by use case, difficulty, and content type

### n8n Workflows

- 8+ production-tested workflow templates
- Importable JSON files compatible with n8n cloud and self-hosted
- Step-by-step setup documentation with screenshots
- Credential and API key checklists
- Customization guides for adapting to specific businesses
- Troubleshooting documentation for common failure modes
- Compatible with n8n version 1.x+

### Custom GPT Configs

- 6 specialized marketing GPT configurations
- System prompts optimized for consistent, high-quality output
- Knowledge base documents for domain expertise
- Example conversations for training and reference
- Prompt starters for immediate productivity
- Update schedule for keeping configurations current

### Chrome Extension

- One-click prompt injection into any text field
- Platform-aware context detection (LinkedIn, Gmail, Instagram, Twitter/X)
- Variable management with saved defaults
- Full-text search across all purchased bundles
- Favorites and usage history tracking
- Offline access with local caching
- Keyboard shortcuts for power users

---

## Pricing

### Individual Bundles

| Product | Price |
|---|---|
| Single Prompt Bundle (any channel) | $9 |
| Single n8n Workflow Template | $5 |
| Single Custom GPT Config | $7 |
| Chrome Extension | Free with any bundle purchase |

### Packs

| Pack | Price | Includes |
|---|---|---|
| **Starter Pack** | $15 | Any 2 prompt bundles + Chrome Extension |
| **All Access** | $29 | All 8 prompt bundles + all n8n workflows + all Custom GPT configs + Chrome Extension |
| **Agency** | $99 | Everything in All Access + white-label rights + client sub-accounts + priority updates + bulk license management |

### Pricing Notes

- All purchases are one-time payments (no subscriptions)
- 12 months of free updates included
- Extended update access available at 50% of original price per year
- Agency license covers unlimited client deployments
- Volume discounts available for 10+ individual licenses

---

## Target Users

**Primary:** Solo marketers, content creators, and small marketing teams at Indian startups and D2C brands who use AI daily for content creation but lack structured prompt libraries and automation workflows.

**Secondary:** Marketing agencies managing multiple client accounts who need repeatable, scalable content production systems.

**Persona Profiles:**

- **D2C brand marketer** (India) managing WhatsApp, Instagram, and email for a skincare brand. Creates 30+ pieces of content per week. Currently writing prompts from scratch in ChatGPT every time. Needs the Instagram, WhatsApp, and D2C bundles to produce consistent, on-brand content in half the time.
- **Solo content creator** building a personal brand on LinkedIn and YouTube. Spends 2 hours per day on content creation. Needs the LinkedIn and YouTube bundles to generate hooks, scripts, and captions that match their voice.
- **Marketing agency owner** running campaigns for 8-10 clients. Team of 4 marketers producing content across all channels. Needs the Agency pack to standardize quality across the team and onboard new hires faster.
- **Startup founder** wearing the marketing hat alongside product development. Needs the All Access pack and n8n workflows to automate as much of the marketing operation as possible so they can focus on building product.

---

## Success Metrics

| Metric | 3-Month Target | 6-Month Target |
|---|---|---|
| Total bundle sales | 300 | 1,500 |
| All Access conversions | 80 | 400 |
| Agency conversions | 15 | 75 |
| Revenue | $5,000 | $30,000 |
| Chrome Extension installs | 500 | 3,000 |
| Chrome Extension DAU | 100 | 800 |
| Average prompts used per user/week | 15 | 25 |
| Customer NPS | 50+ | 60+ |
| Repeat purchase rate | 20% | 30% |

---

## Roadmap

### Phase 1: Core Bundles (Months 1-2)

- Ship Instagram, Sales Email, SEO, and LinkedIn prompt bundles
- Ship Social Auto-Posting and Lead Capture n8n workflows
- Launch storefront with Stripe checkout and customer portal
- Starter Pack and individual bundle pricing live
- Community Discord launch

### Phase 2: India Focus (Months 3-4)

- Ship WhatsApp Business, D2C Marketing, and Hindi Marketing bundles
- Ship Email Sequence Engine and Support Ticket Router workflows
- Launch Custom GPT configurations (SEO Strategist, Social Media Manager, Email Specialist)
- Chrome Extension v1 (prompt injection, search, favorites)
- All Access pack launch

### Phase 3: Platform (Months 5-6)

- Ship YouTube bundle
- Ship Content Calendar Manager and Review Aggregator workflows
- Chrome Extension v2 (context detection, variable management, offline mode)
- Agency pack launch with white-label and sub-accounts
- Analytics dashboard: prompt usage, performance tracking, team activity
- Launch remaining Custom GPT configs (Analytics Interpreter, Brand Voice Guardian, Ad Copy Writer)

### Phase 4: Ecosystem (Months 7-12)

- Prompt marketplace for community-contributed bundles
- n8n workflow marketplace for community-contributed automations
- API access for programmatic prompt retrieval
- Prompt A/B testing framework (test two prompt variants, track which performs better)
- Regional language expansion: Tamil, Telugu, Marathi, Bengali marketing bundles
- Custom bundle builder: select individual prompts across bundles to create a custom collection
- Team features: shared variables, prompt annotations, usage analytics per team member
- Mobile app for prompt access on the go
- Integration with Notion, Airtable, and Google Sheets for prompt library management
- Certification program: "TiltedPrompts Certified Marketer" with badge and directory listing
