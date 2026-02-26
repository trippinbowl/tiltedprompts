# tiltedprompts – Gumroad Setup & Automated Sales Guide

Complete guide: account setup → product listing → webhook automation → full purchase flow.

---

## Part 1: Create Gumroad Account (5 min)

### Step 1: Sign Up
1. Go to **https://gumroad.com** → **Start Selling**
2. Sign up with email or Google
3. Complete your profile:
   - **Name**: TiltedPrompts
   - **Bio**: "AI prompts that actually work for your business 🚀"
   - **Profile URL**: `gumroad.com/tiltedprompts`

### Step 2: Set Up Payments
1. Go to **Settings** → **Payments**
2. Connect **Stripe** (required for receiving payments)
   - Stripe supports Indian bank accounts via INR payouts
   - Alternatively: connect PayPal
3. Set your payout schedule (weekly recommended to start)

### Step 3: Brand Your Store
1. **Settings** → **Profile**
2. Upload a logo (use the lightning bolt icon from `extensions/tiltedprompts-ext/icons/icon128.png`)
3. Set accent color to `#6c5ce7` (purple, matches brand)

---

## Part 2: List Your 3 Bundles (15 min)

### Bundle 1: WhatsApp Marketing Prompts

1. Click **"New Product"** → **Digital Product**
2. Fill in:

| Field | Value |
|-------|-------|
| **Name** | 15 WhatsApp Marketing Prompts for Indian Retailers |
| **Price** | $4.99 (or ₹399) |
| **Description** | See below |
| **Cover image** | Generate one or use a Canva template |
| **File** | Upload the generated `bundle.md` from `backend/bundles/<id>/bundle.md` |
| **Tags** | whatsapp, marketing, india, smb, prompts, ai |

**Description** (paste this):
```
🚀 15 Copy-Paste Ready WhatsApp Marketing Prompts for Indian Retailers

Stop struggling with what to send your customers. These AI-crafted prompts are ready to use TODAY:

✅ Festival promotions (Diwali, Holi, Eid, Christmas)
✅ New product announcements
✅ Customer follow-up messages
✅ Google review requests
✅ Loyalty program messages
✅ Delivery updates
✅ Catalog sharing templates

PLUS: GPT instructions to generate UNLIMITED variations!

Every prompt includes [placeholders] — just fill in your shop name and product, and send.

Works with WhatsApp Business, WhatsApp Web, or any messaging app.

Perfect for: Retail shops, restaurants, salons, gyms, coaching centers, local service businesses.
```

3. Click **Publish**

### Bundle 2: Instagram & Social Media Prompts

| Field | Value |
|-------|-------|
| **Name** | 15 Instagram & Social Media Prompts for Indian D2C Brands |
| **Price** | $6.99 (or ₹549) |
| **Tags** | instagram, social media, d2c, content, india, prompts |

**Description**:
```
📱 15 Instagram & Social Media Prompts for Indian D2C Brands

Create a week's worth of content in 15 minutes:

✅ Instagram captions that convert
✅ Reels scripts (trending formats)
✅ Carousel post frameworks
✅ Story engagement prompts
✅ Product launch announcements
✅ Behind-the-scenes content ideas
✅ Hashtag strategy generator
✅ Content calendar builder

PLUS: GPT instructions to generate unlimited content variations!

Works for: Fashion, food, beauty, home decor, wellness, and lifestyle brands.

Every prompt has [Brand Name] and [Product] placeholders — personalize in seconds.
```

### Bundle 3: Sales Emails & Cold Outreach

| Field | Value |
|-------|-------|
| **Name** | 15 Sales Email & Outreach Prompts for Indian Freelancers & Agencies |
| **Price** | $4.99 (or ₹399) |
| **Tags** | email, sales, outreach, freelancer, india, b2b, prompts |

**Description**:
```
📧 15 Sales Email & Outreach Prompts for Indian Freelancers & Agencies

Win clients without sounding pushy:

✅ Cold email templates (first touch + follow-up + breakup)
✅ Proposal cover emails
✅ Project kickoff messages
✅ Invoice & payment follow-ups
✅ Client onboarding sequences
✅ Testimonial & referral requests
✅ LinkedIn connection messages
✅ Meeting scheduling emails

PLUS: GPT instructions for personalizing at scale!

Built for Indian business culture — respectful, relationship-first, no aggressive sales tactics.

Every template has [Company], [Service], [Client Name] placeholders — customize in seconds.
```

### Create a FREE Lead Magnet (Important!)

Create one more product at **$0** (free):

| Field | Value |
|-------|-------|
| **Name** | FREE: 10 AI Prompts Every Indian SMB Needs |
| **Price** | $0 (free) |
| **Tags** | free, ai, prompts, india, smb, marketing |

This captures emails and builds your list. Use the first 10 prompts from any bundle, or generate a separate one.

---

## Part 3: Connect the Webhook (Automated Delivery)

This is what makes the whole system run automatically — when someone buys on Gumroad, your backend sends a branded email + logs the sale.

### Step 1: Deploy Backend to Replit (or keep local for now)

For production, deploy to Replit so the webhook works 24/7. For testing, use **ngrok** to expose localhost:

```powershell
# Install ngrok (one time)
winget install ngrok

# Expose your local server
ngrok http 5000
```

ngrok gives you a public URL like `https://abc123.ngrok.io` — use that as your webhook URL.

### Step 2: Set Gumroad Webhook

1. Go to **https://app.gumroad.com/settings/advanced**
2. Scroll to **"Ping"** section (webhook)
3. Enter your webhook URL:
   ```
   https://YOUR_NGROK_OR_REPLIT_URL/gumroad-webhook
   ```
4. Click **Save**

### Step 3: Test the Webhook

On Gumroad, use their **"Test ping"** button, or buy your own product for $0 (make the lead magnet). Your backend should:
- Receive the POST at `/gumroad-webhook`
- Log the sale to `bundles/_sales_log.csv`
- Send a delivery email to the buyer

Check the Flask terminal for the webhook hit.

---

## Part 4: Full Automated Purchase Flow

Here's what happens end-to-end when a customer buys:

```
┌──────────────────────────────────────────────────────────────────────┐
│                     CUSTOMER JOURNEY (Automated)                      │
│                                                                      │
│  1. 🔍 Customer finds your product                                   │
│     └── LinkedIn post / Twitter / Google / Direct link               │
│                                                                      │
│  2. 🛒 Customer clicks "Buy" on Gumroad                             │
│     └── Gumroad handles: payment, checkout, receipt                  │
│                                                                      │
│  3. 📩 Gumroad fires webhook → POST /gumroad-webhook                │
│     └── Your backend receives:                                       │
│         • buyer email, name, product name                            │
│         • sale price, timestamp                                      │
│         • Gumroad download link                                      │
│                                                                      │
│  4. 📧 Backend sends branded delivery email                          │
│     └── HTML email with: download link, product info,                │
│         upsell to other bundles, support contact                     │
│                                                                      │
│  5. 📊 Sale logged to _sales_log.csv                                 │
│     └── Available via /report endpoint and daily_report skill        │
│                                                                      │
│  6. 🤖 You check results in Slack (or Web UI)                       │
│     └── "daily_report" shows revenue, sales count, top products     │
│                                                                      │
│  FOR FREE PRODUCTS (Lead Magnet):                                    │
│  Same flow, but also saves to _leads_log.csv for future marketing    │
└──────────────────────────────────────────────────────────────────────┘
```

### What the Customer Sees:

```
Step 1: Gumroad product page
        ↓ clicks "I want this!"
Step 2: Gumroad checkout (card/PayPal)
        ↓ payment succeeds
Step 3: Gumroad confirmation page + receipt email
        ↓ immediately
Step 4: YOUR branded email arrives with:
        • Product name & personal greeting
        • Download link (same as Gumroad's)
        • "You might also like..." (upsell)
        • Support email
Step 5: Customer downloads the .md file with all prompts
```

### What YOU See (in Slack / daily_report):

```
📊 Daily Revenue Report — Feb 20, 2026
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💰 Total Revenue (all time): $16.97
📦 Total Sales: 3
📈 Last 7 Days: $16.97 (3 sales)

Top Products:
  1. Instagram Prompts — $6.99 (1 sale)
  2. WhatsApp Prompts — $4.99 (1 sale)
  3. Sales Email Prompts — $4.99 (1 sale)

New Leads (free downloads): 12
```

---

## Part 5: Testing the Full Flow Locally

Before going live, test everything:

### Test 1: Simulate a Gumroad Purchase

```powershell
# With backend running on port 5000:
$webhook = @{
    seller_id = "test"
    product_name = "15 WhatsApp Marketing Prompts"
    price = 499
    currency = "usd"
    email = "YOUR_EMAIL@gmail.com"
    full_name = "Test Buyer"
    url_params = @{ source = "test" }
    variants = ""
    offer_code = ""
    test = "true"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/gumroad-webhook" -Method Post -Body $webhook -ContentType "application/json"
```

**Expected result:**
- ✅ Sale logged to `_sales_log.csv`
- ✅ Email sent to your email
- ✅ `/report` shows the sale

### Test 2: Check the Report

```powershell
Invoke-RestMethod -Uri "http://localhost:5000/report" -Method Get | ConvertTo-Json -Depth 5
```

### Test 3: Self-buy on Gumroad

Buy your own $0 lead magnet product on Gumroad to test the real webhook end-to-end.

---

## Quick Checklist Before Going Live

- [ ] 3 bundles generated (run `python generate_first_bundles.py`)
- [ ] Gumroad account created + payment connected
- [ ] 3 paid products listed on Gumroad
- [ ] 1 free lead magnet listed ($0)
- [ ] `.env` has `GMAIL_USER` + `GMAIL_APP_PASSWORD`
- [ ] Backend deployed (Replit or ngrok)
- [ ] Gumroad webhook URL set to your backend's `/gumroad-webhook`
- [ ] Test purchase completed (self-buy the $0 product)
- [ ] Share lead magnet link on LinkedIn/Twitter
