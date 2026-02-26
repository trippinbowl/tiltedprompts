# TiltedPrompts 7-Day Launch Calendar (Target: Feb 28, 2026)

Realistic, scoped-down roadmap. Core "Laboratory" product + Auth + Payments live by end of month.

---

## Day 1-2: Auth & Database (Feb 22-23) — CODE COMPLETE
**Goal:** Lock down the foundation — tables, triggers, RLS, seed data.

- [x] Initialized Next.js Supabase utilities (server + client + middleware)
- [x] Deleted legacy `localStorage` auth (AuthGuard removed)
- [x] Created consolidated `supabase_production.sql` (tables, triggers, RLS, indexes, 10 seed assets)
- [x] Created `scripts/migrate_bundles.py` — generates `supabase_bundles.sql` (65 bundles, 23 free / 42 premium)
- [x] Wired logout button in sidebar (calls `supabase.auth.signOut()`)
- [x] Dynamic tier display in sidebar (reads from `profiles` table, shows Free/Pro/Agency)
- [x] User initials from email in header avatar
- [x] Created 3 missing sub-pages: `/members/agents`, `/members/extensions`, `/members/code`
- [x] Pricing page confirmed at `/(marketing)/pricing`
- [x] Dashboard already Server Component fetching from Supabase
- [x] Asset detail page with PromptRenderer, N8nRenderer, SkillRenderer
- [x] Free/Pro gating (visual locks + tier check on detail page)
- [x] Full Next.js production build passes — 0 TypeScript errors
- [x] `.env.local` has Supabase URL + anon key + service role key

### MANUAL STEPS (You do these):
1. Open **Supabase Dashboard** → SQL Editor → paste & run `supabase_production.sql`
2. Then paste & run `scripts/output/supabase_bundles.sql` (imports 65 bundles)
3. Test signup: `localhost:3000/register` → create account → verify profile auto-creates
4. Verify: `localhost:3000/members` shows assets from the database

---

## Day 3: Payments (Feb 24) — CODE COMPLETE
**Goal:** Stripe Checkout + Webhook auto-upgrade.

- [x] `/api/checkout` route (creates Stripe subscription session, $49/mo)
- [x] `/api/webhooks/stripe` route (catches `checkout.session.completed`, updates `profiles.tier`)
- [x] UpgradeButton component (waitlist mode for soft launch; Stripe code ready to uncomment)
- [x] `utils/stripe.ts` Stripe SDK initialized

### MANUAL STEPS:
1. Get real Stripe test keys from https://dashboard.stripe.com/test/apikeys
2. Update `.env.local` with real `pk_test_` and `sk_test_` keys
3. Create webhook endpoint in Stripe Dashboard → `https://YOUR_DOMAIN/api/webhooks/stripe`
4. Update `STRIPE_WEBHOOK_SECRET` in `.env.local`
5. Uncomment Stripe checkout in `UpgradeButton.tsx` (swap waitlist → Stripe flow)
6. Test: Sign up → "Upgrade to Pro" → Pay with card 4242... → Verify tier changes

---

## Day 4: Content Pipeline (Feb 25) — CODE COMPLETE
**Goal:** Verify the HMAC ingestion pipeline works.

- [x] `/api/ingest-bundle` endpoint (HMAC-SHA256 + rate limiting + validation + duplicate check)
- [x] `INGEST_API_KEY` and `INGEST_SECRET` set in `.env.local`
- [x] Migration script generated 65 SQL INSERT statements

### MANUAL STEPS:
1. Test HMAC ingestion: POST to `/api/ingest-bundle` with proper headers
2. Verify: New asset appears in `/members` dashboard
3. Optional: Run OpenClaw agent to generate 5 fresh assets

---

## Day 5: Polish (Feb 26) — TODO
**Goal:** User experience pass.

- [ ] Wire search/filter event handlers on dashboard (client-side filtering)
- [ ] Mobile responsiveness pass on sidebar + cards
- [ ] Loading states and error handling review
- [ ] Fix any broken navigation links
- [ ] Test dark mode across all pages

---

## Day 6: Deploy & QA (Feb 27) — TODO
**Goal:** Production Vercel readiness.

- [ ] Push to GitHub (ensure no secrets committed)
- [ ] Connect to Vercel
- [ ] Set all env vars in Vercel dashboard
- [ ] Set Stripe webhook to production URL
- [ ] Full E2E: Signup → Browse → Pay → Access Pro → Logout
- [ ] Test on mobile (Chrome + Safari)

---

## Day 7: Launch (Feb 28) — TODO
**Goal:** Ship it.

- [ ] Final smoke test on production
- [ ] Launch tweet + LinkedIn post
- [ ] Record 3-minute Loom walkthrough
- [ ] **GO LIVE**

---

### Files Created / Modified This Sprint

| File | Status | What |
|------|--------|------|
| `supabase_production.sql` | NEW | Full schema: tables, triggers, RLS, indexes, 10 seeds |
| `scripts/migrate_bundles.py` | NEW | Reads 65 bundles → SQL + JSON |
| `scripts/output/supabase_bundles.sql` | GEN | 65 bundle INSERTs, ON CONFLICT safe |
| `scripts/output/bundles_payload.json` | GEN | API-ready JSON payloads |
| `website/app/members/layout.tsx` | UPD | Logout + dynamic tier + initials |
| `website/app/members/agents/page.tsx` | NEW | AI Agents sub-page |
| `website/app/members/extensions/page.tsx` | NEW | Chrome Extensions sub-page |
| `website/app/members/code/page.tsx` | NEW | TiltedCode sub-page |
| `website/app/components/AuthGuard.tsx` | DEL | Legacy auth, replaced by middleware |
| `docs/TILTEDPROMPTS_FOUNDER_DECK.html` | NEW | 10-section founder PDF deck |

---

### Deferring to March 2026 (Post-Launch)
- TiltedMCP Server Implementation
- TiltedVoice Infrastructure
- TiltedCode Templates packaging
- Chrome Extension distribution
- OpenClaw automated cron
- Razorpay (UPI/net banking)
- OAuth (Google/GitHub)
- Email verification + password reset
- Analytics (PostHog/GA)
