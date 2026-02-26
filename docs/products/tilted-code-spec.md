# TiltedCode - Vibe Coding Templates

**Product:** TiltedCode
**Category:** Developer Tools / Templates
**Status:** Active Development
**Version:** 1.0
**Last Updated:** 2026-02-21

---

## Overview

TiltedCode ships production-grade Next.js templates built for the AI-native development workflow. Every template runs on Next.js 15, React 19, TypeScript, and TailwindCSS v4 with authentication, payments, database, and AI routing pre-wired. No boilerplate weekends. No dependency hell. Clone, configure, ship.

The templates are designed for vibe coding: the codebase is structured so AI assistants (Cursor, Claude Code, Copilot) can navigate, extend, and modify it without fighting the architecture. Clean boundaries, typed interfaces, colocated logic, and comprehensive inline documentation make AI-assisted development predictable instead of chaotic.

A CLI tool (`create-tilted-app`) handles scaffolding. Pick a template, select your providers, and get a running application in under 2 minutes.

---

## Problem Statement

Starting a new project in 2026 means wiring together 15-20 packages before writing a single line of business logic. Auth, payments, database, email, file uploads, AI integration, deployment configuration. Each one has its own setup ritual, its own breaking changes, and its own compatibility matrix.

Developers face three specific problems:

1. **The boilerplate tax.** A production-ready Next.js app with auth, payments, and database takes 2-4 weeks to set up properly. That time comes directly out of shipping features. Startups burn runway. Freelancers burn client patience.
2. **AI-hostile codebases.** Most templates and boilerplates were designed before AI-assisted development existed. Deep nesting, implicit conventions, scattered configuration, and undocumented side effects make them adversarial to AI tools. Cursor and Claude Code produce worse output when the codebase is disorganized.
3. **Template rot.** Free boilerplates on GitHub use outdated dependencies, insecure patterns, and abandoned packages. By the time you fix the security vulnerabilities and upgrade the dependencies, you might as well have started from scratch.

---

## Solution

Four templates covering the highest-value starting points:

| Template | Price | Use Case |
|---|---|---|
| **Next.js Agentic Starter** | $49 | AI-powered applications with MCP client, tool routing, and multi-model support |
| **SaaS Boilerplate** | $149 | Multi-tenant SaaS with auth, billing, teams, roles, and admin dashboard |
| **E-commerce + AI** | $199 | Product catalog, cart, checkout, AI-powered search, recommendations, and support chat |
| **Landing Page Builder** | $79 | Marketing pages with CMS, A/B testing, analytics, and lead capture |

### Shared Foundation (All Templates)

- Next.js 15 (App Router, Server Components, Server Actions)
- React 19 (use, useOptimistic, useFormStatus, Suspense boundaries)
- TypeScript 5.x (strict mode, no any)
- TailwindCSS v4 (native CSS, no PostCSS dependency)
- Drizzle ORM + PostgreSQL (type-safe queries, automatic migrations)
- Authentication via Clerk or Supabase Auth (configurable at scaffold time)
- Payments via Stripe (Checkout, Customer Portal, webhooks, metered billing)
- AI routing layer (Claude, GPT-4o, Gemini with automatic failover)
- MCP client built in (connect to any TiltedMCP server or standard MCP server)
- Deployment-ready for Vercel, Railway, Fly.io, and Docker

---

## Technical Architecture

### Project Structure

```
tilted-app/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/             # Auth-gated routes
│   │   ├── (marketing)/        # Public marketing pages
│   │   ├── (dashboard)/        # Authenticated dashboard
│   │   ├── api/                # API routes
│   │   │   ├── webhooks/       # Stripe, Clerk webhooks
│   │   │   └── ai/             # AI endpoints
│   │   └── layout.tsx          # Root layout with providers
│   ├── components/
│   │   ├── ui/                 # Primitive UI components (shadcn/ui)
│   │   ├── forms/              # Form components with validation
│   │   ├── layouts/            # Page layout components
│   │   └── features/           # Feature-specific components
│   ├── lib/
│   │   ├── ai/                 # AI client, model routing, MCP client
│   │   ├── auth/               # Auth helpers, middleware, guards
│   │   ├── db/                 # Drizzle schema, queries, migrations
│   │   ├── payments/           # Stripe helpers, webhook handlers
│   │   ├── email/              # Email templates, sending logic
│   │   └── utils/              # Shared utilities
│   ├── hooks/                  # Custom React hooks
│   ├── types/                  # Shared TypeScript types
│   └── config/                 # App configuration, env validation
├── drizzle/                    # Migration files
├── public/                     # Static assets
├── tests/                      # Vitest test files
├── .cursor/                    # Cursor AI rules and context
├── .claude/                    # Claude Code configuration
├── drizzle.config.ts
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

### AI-Friendly Design Principles

Every architectural decision optimizes for AI-assisted development:

1. **Flat, discoverable structure.** No files deeper than 4 levels. Every directory has a clear, singular purpose. An AI assistant can find anything with a single glob.
2. **Colocated logic.** Database queries live next to the components that use them. No jumping between 6 files to understand a feature.
3. **Typed boundaries.** Every function, component prop, and API response has explicit TypeScript types. AI assistants generate correct code on the first try when types are clear.
4. **Inline documentation.** JSDoc comments on every exported function and component describe intent, not implementation. AI assistants use these as context for modifications.
5. **Convention files.** `.cursor/rules` and `.claude/` configuration files ship with each template, providing project-specific context to AI tools.
6. **No magic.** No custom Babel transforms, no runtime code generation, no implicit middleware chains. What you read is what runs.

### Stack Details

| Layer | Technology | Notes |
|---|---|---|
| Framework | Next.js 15 | App Router, Turbopack, Server Actions |
| UI | React 19 + TailwindCSS v4 | Server Components by default, client only when needed |
| Components | shadcn/ui | Copy-pasted, not imported. Full ownership of UI code |
| Database | Drizzle ORM + PostgreSQL | Type-safe, SQL-like query builder. No magic ORM abstractions |
| Auth | Clerk or Supabase Auth | Configurable. Middleware-based route protection |
| Payments | Stripe | Checkout Sessions, Customer Portal, webhook verification |
| AI | Vercel AI SDK + MCP client | Multi-model routing, streaming, tool use, MCP integration |
| Email | Resend + React Email | Type-safe email templates as React components |
| File Storage | Uploadthing or S3 | Configurable. Type-safe file upload with progress |
| Testing | Vitest + Playwright | Unit, integration, and E2E testing pre-configured |
| Deployment | Vercel / Docker | Zero-config Vercel deploys, Dockerfile for self-hosting |

### CLI Tool: create-tilted-app

```bash
npx create-tilted-app@latest

# Interactive prompts:
# 1. Choose template (Agentic Starter / SaaS / E-commerce / Landing Page)
# 2. Choose auth provider (Clerk / Supabase)
# 3. Choose database host (Neon / Supabase / Railway / Local)
# 4. Choose deployment target (Vercel / Railway / Fly.io / Docker)
# 5. Enable optional features (email, file uploads, analytics)

# Result: Running application with all providers configured
```

The CLI:

- Validates license key before scaffolding
- Clones the selected template from a private registry
- Runs provider-specific setup scripts (creates .env, installs dependencies)
- Runs initial database migration
- Starts the dev server and opens the browser
- Total time from command to running app: < 2 minutes

---

## Features

### Next.js Agentic Starter ($49)

For developers building AI-powered applications with tool use and MCP integration.

- MCP client with support for multiple simultaneous server connections
- Multi-model AI routing (Claude, GPT-4o, Gemini) with automatic failover
- Streaming chat interface with tool use visualization
- Conversation persistence with PostgreSQL storage
- Rate limiting and usage tracking per user
- Pre-built tools: web search, code execution, file analysis
- Prompt management system with versioning
- OpenTelemetry tracing for AI request debugging

### SaaS Boilerplate ($149)

For teams building multi-tenant SaaS products with billing and team management.

- Multi-tenant architecture with organization-scoped data
- Team management: invites, roles (owner, admin, member), permissions
- Stripe integration: subscriptions, metered billing, customer portal, invoices
- Admin dashboard with user management, metrics, and feature flags
- Onboarding flow with configurable steps
- API key management for developer-facing products
- Audit logging for compliance-sensitive applications
- Email notifications: welcome, invite, billing, alerts
- Feature flag system with gradual rollout support
- Waitlist and early access flow

### E-commerce + AI ($199)

For businesses building AI-enhanced online stores.

- Product catalog with variants, categories, and collections
- Shopping cart with persistent state (logged in and anonymous)
- Checkout flow with Stripe payment processing
- AI-powered product search (semantic search with embeddings)
- AI product recommendations based on browsing and purchase history
- AI support chat trained on product catalog and policies
- Order management with status tracking
- Inventory management with low-stock alerts
- Customer accounts with order history
- SEO optimization: dynamic sitemaps, structured data, meta tags
- Image optimization with Next.js Image and CDN delivery

### Landing Page Builder ($79)

For marketers and founders building high-converting marketing pages.

- Pre-built section library: hero, features, pricing, testimonials, FAQ, CTA
- CMS integration for content management (Contentlayer or Sanity)
- A/B testing framework with automatic statistical significance
- Lead capture forms with webhook delivery
- Analytics integration (Plausible, PostHog, Google Analytics)
- SEO toolkit: sitemap, robots.txt, Open Graph, Twitter Cards
- Performance optimized: 100/100 Lighthouse score out of the box
- Blog engine with MDX support
- Email signup with Resend integration
- Cookie consent banner (GDPR compliant)

---

## Pricing

| Plan | Price | Includes |
|---|---|---|
| **Individual Templates** | $49 - $199 | Single template, lifetime updates, CLI access, community Discord |
| **All Access** | $299 | All 4 templates, lifetime updates, CLI access, priority support, private Discord |
| **Agency** | $599 | All 4 templates, unlimited client projects, white-label rights, priority support, 1:1 onboarding call |

All plans include:

- Lifetime access to purchased templates (no recurring fees)
- Free updates for 12 months (major and minor versions)
- Access to private GitHub repository
- Community Discord for support and discussion

---

## Target Users

**Primary:** Full-stack developers and small teams building SaaS products, AI applications, or client projects who want to skip the boilerplate phase and start shipping features immediately.

**Secondary:** Agencies and freelancers building client projects on tight timelines who need a reliable, maintainable starting point.

**Persona Profiles:**

- **Indie hacker** launching a SaaS product. Has a validated idea and 4 weeks to get to MVP. Currently dreading the 2-week auth-payments-database setup ritual. Needs the SaaS Boilerplate to start building features on day 1.
- **AI startup founder** building an agent-powered product. Understands prompts and models but doesn't want to build MCP integration from scratch. Needs the Agentic Starter to get tool use working in an afternoon.
- **Freelance developer** delivering 3-4 client projects per quarter. Each project starts with the same Next.js setup. Needs the Agency plan to scaffold client projects in minutes instead of days.
- **Marketing lead at a startup** who needs landing pages shipped fast. Design is done in Figma, but the dev team is focused on product. Needs the Landing Page Builder to ship marketing pages without pulling engineers off core work.

---

## Success Metrics

| Metric | 3-Month Target | 6-Month Target |
|---|---|---|
| Total template sales | 200 | 1,000 |
| Revenue | $20,000 | $100,000 |
| All Access conversions | 50 | 250 |
| Agency conversions | 15 | 75 |
| CLI installs (npx) | 500 | 3,000 |
| GitHub stars (public examples) | 300 | 1,500 |
| Discord community members | 200 | 1,000 |
| Template NPS | 50+ | 60+ |

---

## Roadmap

### Phase 1: Foundation (Months 1-2)

- Ship SaaS Boilerplate and Landing Page Builder
- Launch create-tilted-app CLI with interactive scaffolding
- Private GitHub repository with automated license verification
- Documentation site with video walkthroughs
- Community Discord launch

### Phase 2: AI Templates (Months 3-4)

- Ship Next.js Agentic Starter with MCP client
- Ship E-commerce + AI template
- All Access and Agency plans launch
- Template customization guide for AI-assisted modification
- Integration testing suite for all templates

### Phase 3: Ecosystem (Months 5-6)

- Add-on modules: analytics dashboard, admin panel, file manager
- Template composition: mix features from multiple templates
- Upgrade tooling: migrate between template versions without losing customizations
- Video course: building a SaaS from scratch using TiltedCode templates
- Guest author program for community add-on modules

### Phase 4: Platform (Months 7-12)

- Visual template customizer (select features, preview, scaffold)
- One-click deploy to Vercel/Railway with pre-configured environment
- Template marketplace for community-built templates and add-ons
- Enterprise template: SSO, audit logging, compliance, multi-region
- Mobile template: React Native + Expo with shared backend
- Annual template refresh cycle aligned with Next.js major releases
