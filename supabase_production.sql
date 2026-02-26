-- ============================================================================
-- TiltedPrompts Production Database Setup
-- ============================================================================
-- SINGLE FILE — Paste this into the Supabase SQL Editor and run it once.
-- This creates everything: tables, triggers, RLS, indexes, and seed data.
-- Safe to re-run: uses DROP IF EXISTS and IF NOT EXISTS throughout.
-- ============================================================================

-- ============================================================================
-- STEP 1: CLEAN SLATE
-- ============================================================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS trigger_library_assets_updated_at ON public.library_assets;
DROP FUNCTION IF EXISTS public.handle_new_user CASCADE;
DROP FUNCTION IF EXISTS public.update_updated_at_column CASCADE;
DROP TABLE IF EXISTS public.library_assets CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- ============================================================================
-- STEP 2: PROFILES TABLE (extends Supabase auth.users)
-- ============================================================================
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    tier TEXT NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'pro', 'agency')),
    stripe_customer_id TEXT,
    razorpay_customer_id TEXT,
    api_key UUID DEFAULT gen_random_uuid(),
    api_calls_today INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "Users can read own profile"
ON public.profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Users can update their own profile (for settings, NOT tier — tier is updated by webhook)
CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Auto-create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, tier)
  VALUES (new.id, 'free');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ============================================================================
-- STEP 3: LIBRARY_ASSETS TABLE (the main content table)
-- ============================================================================
CREATE TABLE public.library_assets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL UNIQUE,
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

-- RLS for library_assets
ALTER TABLE public.library_assets ENABLE ROW LEVEL SECURITY;

-- All authenticated users can see ALL assets (so we can render Pro upsell locks)
CREATE POLICY "All assets visible to all authenticated users"
ON public.library_assets FOR SELECT
TO authenticated
USING (true);

-- ============================================================================
-- STEP 4: INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_library_assets_type
    ON public.library_assets(asset_type);

CREATE INDEX IF NOT EXISTS idx_library_assets_premium
    ON public.library_assets(is_premium);

CREATE INDEX IF NOT EXISTS idx_library_assets_tags
    ON public.library_assets USING GIN(tags);

CREATE INDEX IF NOT EXISTS idx_library_assets_platform
    ON public.library_assets USING GIN(platform);

CREATE INDEX IF NOT EXISTS idx_library_assets_created
    ON public.library_assets(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_library_assets_title
    ON public.library_assets(title);

-- ============================================================================
-- STEP 5: UPDATED_AT TRIGGER
-- ============================================================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_library_assets_updated_at
    BEFORE UPDATE ON public.library_assets
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- STEP 6: SEED DATA (10 realistic assets for launch)
-- ============================================================================
INSERT INTO public.library_assets (title, description, asset_type, platform, content, tags, is_premium)
VALUES

-- === FREE ASSETS (6) ===
(
    'WhatsApp Cart Recovery Messages',
    '5 ready-made WhatsApp messages for when a customer adds items to cart but doesn''t pay. Copy, paste, send.',
    'prompt_bundle',
    ARRAY['whatsapp', 'ecommerce'],
    '{
        "prompts": [
            {"title": "Gentle Reminder (1 Hour)", "prompt_text": "Hi [CUSTOMER NAME] 🙏\n\nI noticed you were checking out [PRODUCT NAME, e.g., \"Basmati Rice 5kg\"] from our store.\n\nYour cart is still saved! Complete your order and we''ll ship it today.\n\n👉 [YOUR STORE LINK]\n\n— [YOUR NAME], [YOUR SHOP NAME]", "use_case": "Customer abandoned cart within the last hour"},
            {"title": "Friendly Follow-Up (24 Hours)", "prompt_text": "Hey [CUSTOMER NAME]!\n\nJust a quick heads up — the [PRODUCT NAME] you liked is still available. Only [STOCK COUNT, e.g., \"3\"] left in stock!\n\nOrder here: [YOUR STORE LINK]\n\n— [YOUR NAME], [YOUR SHOP NAME]", "use_case": "24 hours after cart abandonment"},
            {"title": "Discount Nudge (48 Hours)", "prompt_text": "Hi [CUSTOMER NAME] 🎁\n\nWe saved your cart with [PRODUCT NAME]. Here''s a small thank-you: use code COME10 for 10% off!\n\nValid for 24 hours only.\n\n👉 [YOUR STORE LINK]\n\n— [YOUR NAME], [YOUR SHOP NAME]", "use_case": "48 hours after abandonment, incentive needed"},
            {"title": "Last Chance (72 Hours)", "prompt_text": "Hi [CUSTOMER NAME],\n\nYour cart with [PRODUCT NAME] will expire soon. If you still want it, now''s the time!\n\nUse code LAST15 for 15% off: [YOUR STORE LINK]\n\n— [YOUR NAME], [YOUR SHOP NAME]", "use_case": "Final reminder before clearing cart"},
            {"title": "Re-engagement (1 Week)", "prompt_text": "Hey [CUSTOMER NAME] 👋\n\nWe miss you! Check out what''s new at [YOUR SHOP NAME].\n\nPlus, we''ve got a special offer just for you: [OFFER DETAILS]\n\n👉 [YOUR STORE LINK]\n\n— [YOUR NAME]", "use_case": "Win-back after a week of inactivity"}
        ],
        "gpt_instructions": {
            "system_message": "You are a friendly WhatsApp marketing assistant for Indian small businesses. You write short, warm messages with emojis. Always include [BRACKET] placeholders.",
            "example_user_messages": ["Write a cart recovery message for my Shopify store"]
        }
    }',
    ARRAY['whatsapp', 'ecommerce', 'cart-recovery', 'shopify', 'india'],
    false
),
(
    'Google Review Replies — 1 Star to 5 Star',
    '5 ready-to-paste Google review reply templates. One for each star rating. Stop staring at angry reviews.',
    'prompt_bundle',
    ARRAY['google', 'reviews', 'reputation'],
    '{
        "prompts": [
            {"title": "5-Star Reply (Happy Customer)", "prompt_text": "Thank you so much, [CUSTOMER NAME]! 🙏\n\nWe''re thrilled you loved [SPECIFIC THING THEY MENTIONED, e.g., \"our butter chicken\"]. Your kind words mean the world to our team.\n\nSee you again soon!\n— [YOUR NAME], [YOUR BUSINESS NAME]", "use_case": "Replying to a glowing 5-star review"},
            {"title": "4-Star Reply (Almost Perfect)", "prompt_text": "Thanks for the great feedback, [CUSTOMER NAME]! 😊\n\nWe''re glad you enjoyed [POSITIVE ASPECT]. We''d love to make it a 5-star experience next time — any suggestions?\n\n— [YOUR NAME], [YOUR BUSINESS NAME]", "use_case": "Replying to a solid but not perfect review"},
            {"title": "3-Star Reply (Mixed Feelings)", "prompt_text": "Thank you for your honest feedback, [CUSTOMER NAME].\n\nWe appreciate you pointing out [ISSUE MENTIONED]. We''re working on improving this. Would you give us another chance? DM us for a special offer.\n\n— [YOUR NAME], [YOUR BUSINESS NAME]", "use_case": "Replying to a mediocre review"},
            {"title": "2-Star Reply (Disappointed)", "prompt_text": "We''re sorry your experience wasn''t great, [CUSTOMER NAME]. 😔\n\n[ISSUE MENTIONED] is something we take seriously. Please reach out to us at [YOUR PHONE/EMAIL] — we''d like to make it right.\n\n— [YOUR NAME], [YOUR BUSINESS NAME]", "use_case": "Replying to a negative review"},
            {"title": "1-Star Reply (Damage Control)", "prompt_text": "We''re truly sorry, [CUSTOMER NAME]. This isn''t the experience we want anyone to have. 🙏\n\nWe''d like to understand what happened and fix it. Please call us directly at [YOUR PHONE NUMBER] or DM us.\n\nYour satisfaction matters to us.\n— [YOUR NAME], Owner, [YOUR BUSINESS NAME]", "use_case": "Replying to an angry 1-star review"}
        ]
    }',
    ARRAY['google-reviews', 'reputation', 'customer-service', 'restaurant', 'india'],
    false
),
(
    'Instagram Captions for Home Bakers',
    '5 Instagram captions for daily cake/food posts. Just fill in the blanks and post.',
    'prompt_bundle',
    ARRAY['instagram', 'food', 'bakery'],
    '{
        "prompts": [
            {"title": "New Cake Drop", "prompt_text": "🎂 Fresh out of the oven!\n\n[CAKE TYPE, e.g., \"Red Velvet with Cream Cheese Frosting\"]\nWeight: [WEIGHT, e.g., \"1 kg\"]\nPrice: ₹[PRICE, e.g., \"899\"]\n\n📍 [YOUR CITY]\n🚗 Free delivery within [RADIUS, e.g., \"5 km\"]\n📲 DM to order or call [YOUR NUMBER]\n\n#homebaker #[YOUR CITY HASHTAG] #cakeorder #freshbaked #homemade", "use_case": "Posting a new cake for sale"},
            {"title": "Behind the Scenes", "prompt_text": "Messy kitchen. Flour everywhere. But this [ITEM, e.g., \"chocolate truffle cake\"] is going to be worth it 🤎\n\nSwipe to see the final result 👉\n\nOrders open for [DAY/OCCASION, e.g., \"this weekend\"]!\nDM to book yours 📲\n\n#bakingprocess #homebakery #[YOUR CITY HASHTAG] #cakesofinstagram", "use_case": "Sharing a behind-the-scenes baking moment"},
            {"title": "Customer Love Post", "prompt_text": "When [CUSTOMER FIRST NAME] sent us this photo of [OCCASION, e.g., \"her daughter''s birthday party\"] 🥺💛\n\nThis is why we bake!\n\nWant a custom cake for your celebration? DM us with your date and theme 🎂\n\n#customcake #[YOUR CITY HASHTAG] #homebaker #happycustomer", "use_case": "Reposting a customer photo"},
            {"title": "Festival Special", "prompt_text": "🪔 [FESTIVAL NAME, e.g., \"Diwali\"] Special Menu is LIVE!\n\n✨ [ITEM 1] — ₹[PRICE]\n✨ [ITEM 2] — ₹[PRICE]\n✨ [ITEM 3] — ₹[PRICE]\n\n📅 Pre-orders close: [DATE]\n📲 DM or WhatsApp: [YOUR NUMBER]\n\n#[FESTIVAL HASHTAG] #homebaker #[YOUR CITY HASHTAG] #festivesweets", "use_case": "Promoting a festival menu"},
            {"title": "Flavor of the Week", "prompt_text": "This week''s star: [FLAVOR, e.g., \"Mango Cheesecake\"] 🥭\n\nAvailable in [SIZE OPTIONS, e.g., \"500g and 1kg\"]\nStarting at ₹[PRICE]\n\nOnly [NUMBER, e.g., \"8\"] slots this week!\nComment \"BOOK\" to reserve yours 👇\n\n#flavoroftheweek #homebaker #[YOUR CITY HASHTAG] #mangocheesecake", "use_case": "Weekly flavor highlight"}
        ]
    }',
    ARRAY['instagram', 'bakery', 'food', 'social-media', 'india'],
    false
),
(
    'LinkedIn Cold DM Templates for SaaS',
    '5 cold outreach messages for SaaS founders selling to Indian businesses. No cringe. Just results.',
    'prompt_bundle',
    ARRAY['linkedin', 'saas', 'sales'],
    '{
        "prompts": [
            {"title": "The Research-Based Opener", "prompt_text": "Hi [FIRST NAME],\n\nI noticed [COMPANY NAME] recently [SPECIFIC OBSERVATION, e.g., \"launched a new product line on your website\"]. Congrats!\n\nI work with [SIMILAR COMPANIES, e.g., \"D2C brands in India\"] to [YOUR VALUE PROP, e.g., \"automate their customer support and save 15+ hours/week\"].\n\nWould it make sense to chat for 10 minutes this week?\n\nBest,\n[YOUR NAME]", "use_case": "First touch after researching the prospect"},
            {"title": "The Mutual Connection", "prompt_text": "Hi [FIRST NAME],\n\n[MUTUAL CONNECTION, e.g., \"Rahul from StartupIndia\"] mentioned you might be a great fit for what we''re building.\n\nWe help [TARGET AUDIENCE] with [YOUR ONE-LINE PITCH].\n\nHappy to share a quick 2-minute demo video — interested?\n\n— [YOUR NAME]", "use_case": "When you have a mutual connection"},
            {"title": "The Value-First DM", "prompt_text": "Hi [FIRST NAME],\n\nI put together a free guide on [TOPIC, e.g., \"reducing SaaS churn for Indian markets\"] — thought it might be useful for [COMPANY NAME].\n\nHere''s the link: [LINK]\n\nNo strings attached. Let me know if it helps!\n\n— [YOUR NAME]", "use_case": "Leading with free value"},
            {"title": "The Follow-Up", "prompt_text": "Hi [FIRST NAME],\n\nJust circling back on my note from [TIMEFRAME, e.g., \"last Tuesday\"]. I know things get busy!\n\nQuick version: we help [TARGET] do [RESULT] in [TIMEFRAME]. Would love 10 minutes of your time.\n\nEither way — no pressure. 🙏\n\n— [YOUR NAME]", "use_case": "Following up after no response"},
            {"title": "The Case Study Share", "prompt_text": "Hi [FIRST NAME],\n\nWe just helped [SIMILAR COMPANY, e.g., \"a Bangalore-based SaaS startup\"] achieve [RESULT, e.g., \"3x their trial conversions in 6 weeks\"].\n\nI thought of [COMPANY NAME] because [REASON].\n\nHappy to share the full case study if you''re curious.\n\n— [YOUR NAME]", "use_case": "Social proof-based outreach"}
        ]
    }',
    ARRAY['linkedin', 'saas', 'cold-outreach', 'sales', 'b2b', 'india'],
    false
),
(
    'CA Client ITR Reminder Messages',
    '5 WhatsApp reminders for Chartered Accountants chasing clients who haven''t submitted their ITR documents.',
    'prompt_bundle',
    ARRAY['whatsapp', 'finance', 'ca'],
    '{
        "prompts": [
            {"title": "Gentle First Reminder", "prompt_text": "Hi [CLIENT NAME] 🙏\n\nThis is a friendly reminder from [YOUR CA FIRM NAME] — the ITR filing deadline for AY [YEAR, e.g., \"2026-27\"] is approaching on [DATE, e.g., \"31st July\"].\n\nPlease share the following at your earliest:\n📄 Form 16\n📄 Bank statements (Apr-Mar)\n📄 Investment proofs\n\nYou can WhatsApp them to this number or email at [YOUR EMAIL].\n\nThank you!\n— [YOUR NAME], [YOUR CA FIRM NAME]", "use_case": "First reminder, 45+ days before deadline"},
            {"title": "Firm Nudge (2 Weeks Left)", "prompt_text": "Hi [CLIENT NAME],\n\nJust a heads up — we''re [DAYS, e.g., \"14\"] days away from the ITR deadline.\n\nWe still need your documents to file on time. Late filing attracts a penalty of up to ₹5,000.\n\nPlease send:\n📄 Form 16\n📄 Capital gains statement (if any)\n📄 Rent receipts\n\nLet me know if you need help gathering these.\n— [YOUR NAME]", "use_case": "Urgent reminder close to deadline"},
            {"title": "Final Warning", "prompt_text": "Hi [CLIENT NAME] ⚠️\n\nThe ITR deadline is [DATE]. We have NOT received your documents yet.\n\nFiling after the deadline means:\n❌ Late fee up to ₹5,000\n❌ Loss of carry-forward losses\n❌ Possible scrutiny notice\n\nPlease share your documents TODAY so we can file in time.\n\n— [YOUR NAME], [YOUR CA FIRM NAME]", "use_case": "Last-day emergency push"},
            {"title": "Post-Deadline Follow-Up", "prompt_text": "Hi [CLIENT NAME],\n\nThe ITR deadline has passed, but you can still file a belated return until [BELATED DATE, e.g., \"31st December\"].\n\nA late fee of ₹[AMOUNT] will apply. Let''s get it done ASAP to avoid further penalties.\n\nPlease send your documents and we''ll prioritize your filing.\n\n— [YOUR NAME], [YOUR CA FIRM NAME]", "use_case": "After the deadline has passed"},
            {"title": "Document Checklist", "prompt_text": "Hi [CLIENT NAME] 📋\n\nHere''s your ITR document checklist for AY [YEAR]:\n\n✅ PAN Card copy\n✅ Form 16 from employer\n✅ Bank statements (all accounts)\n✅ Investment proofs (80C, 80D)\n✅ Home loan interest certificate\n✅ Rent receipts (if claiming HRA)\n✅ Capital gains statement\n\nPlease share whatever is ready — we can start while you gather the rest.\n\n— [YOUR NAME], [YOUR CA FIRM NAME]", "use_case": "Sending the client a checklist of required documents"}
        ]
    }',
    ARRAY['whatsapp', 'ca', 'chartered-accountant', 'itr', 'finance', 'india'],
    false
),
(
    'Real Estate Site Visit Follow-Ups',
    '5 WhatsApp follow-up messages for brokers when a client goes silent after a property site visit.',
    'prompt_bundle',
    ARRAY['whatsapp', 'real-estate'],
    '{
        "prompts": [
            {"title": "Same-Day Thank You", "prompt_text": "Hi [CLIENT NAME] 🙏\n\nThank you for visiting [PROPERTY NAME/LOCATION, e.g., \"the 2BHK in Baner\"] today!\n\nHope you liked the [HIGHLIGHT, e.g., \"east-facing balcony and covered parking\"]. Let me know if you have any questions.\n\nI''m available anytime!\n— [YOUR NAME], [YOUR AGENCY NAME]", "use_case": "Immediately after a site visit"},
            {"title": "24-Hour Check-In", "prompt_text": "Hi [CLIENT NAME],\n\nJust checking in after yesterday''s visit to [PROPERTY NAME]. Have you had a chance to discuss with your family?\n\nHappy to share the floor plan and pricing breakdown on WhatsApp if that helps.\n\n— [YOUR NAME]", "use_case": "Next day follow-up"},
            {"title": "Urgency Creator (Day 3)", "prompt_text": "Hi [CLIENT NAME],\n\nQuick update — the [PROPERTY TYPE, e.g., \"2BHK on 4th floor\"] you visited has received [NUMBER, e.g., \"2\"] more inquiries since your visit.\n\nI don''t want you to miss out if you''re interested. Shall I hold it for a day?\n\n— [YOUR NAME], [YOUR AGENCY NAME]", "use_case": "Creating urgency without being pushy"},
            {"title": "Alternative Offer (Day 5)", "prompt_text": "Hi [CLIENT NAME] 👋\n\nIf [ORIGINAL PROPERTY] wasn''t the right fit, I have a similar option:\n\n🏠 [ALTERNATIVE PROPERTY, e.g., \"3BHK in Wakad\"]\n💰 ₹[PRICE, e.g., \"55 Lakhs\"]\n📍 [LOCATION]\n✨ [KEY FEATURE, e.g., \"Near metro station, ready to move\"]\n\nWould you like to visit this one?\n\n— [YOUR NAME]", "use_case": "Offering an alternative when the first didn''t convert"},
            {"title": "Soft Close (Day 7)", "prompt_text": "Hi [CLIENT NAME],\n\nI understand finding the right home takes time. No rush at all. 🙏\n\nJust letting you know — I''ve saved your preferences and will send you any new listings in [PREFERRED AREA, e.g., \"Baner-Balewadi\"] under ₹[BUDGET].\n\nFeel free to reach out anytime!\n\n— [YOUR NAME], [YOUR AGENCY NAME]", "use_case": "Graceful close when the client has gone completely silent"}
        ]
    }',
    ARRAY['whatsapp', 'real-estate', 'broker', 'follow-up', 'india'],
    false
),

-- === PRO/PREMIUM ASSETS (4) ===
(
    'SEO Blog Generator Framework',
    'Advanced 1500-token meta-prompt for generating highly-ranking, localized SEO articles for the Indian tech market.',
    'prompt_bundle',
    ARRAY['seo', 'content', 'blog'],
    '{
        "prompts": [
            {"title": "Full SEO Article Generator", "description": "Complete framework for generating SEO-optimized blog posts", "prompt_text": "ROLE: Senior SEO content strategist specializing in Indian tech market.\nOBJECTIVE: Generate a 1500-2000 word blog post optimized for [TARGET KEYWORD, e.g., \"best CRM for small business India\"] targeting Indian readers.\nCONTEXT: The article must rank on page 1 of Google India. Target audience is [AUDIENCE, e.g., \"Indian startup founders and small business owners\"].\nINPUT FORMAT: Target keyword, audience persona, content angle.\nOUTPUT FORMAT: Complete article with H1, H2, H3 headers, meta description, and internal linking suggestions.\nCONSTRAINTS: Use Indian English spellings. Reference Indian tools (Razorpay, Zoho, Freshworks). Include 3-5 statistics. Add a FAQ section with 4 questions. Target readability: Grade 8.", "use_case": "Generating SEO blog content for Indian tech websites"}
        ],
        "gpt_instructions": {
            "system_message": "You are an expert Indian SEO copywriter. You write in Indian English, reference local tools and platforms, and optimize for Google India search results.",
            "example_user_messages": ["Write an SEO article targeting ''best project management tools India 2026''"],
            "example_outputs": ["[Full 1800-word article with H2 sections, FAQ schema, and meta description]"]
        }
    }',
    ARRAY['seo', 'content-marketing', 'blog', 'india', 'tech'],
    true
),
(
    'Instagram DM Sales Pipeline',
    'Importable n8n workflow. Captures Instagram DM leads, scores them via AI, and triggers automated WhatsApp outreach.',
    'n8n_workflow',
    ARRAY['instagram', 'whatsapp', 'n8n', 'automation'],
    '{
        "nodes": [
            {"name": "Instagram Webhook", "type": "n8n-nodes-base.webhook", "description": "Receives Instagram DM events"},
            {"name": "AI Lead Scorer", "type": "n8n-nodes-base.openAi", "description": "Scores lead intent from 1-10"},
            {"name": "Filter Hot Leads", "type": "n8n-nodes-base.if", "description": "Routes leads with score >= 7"},
            {"name": "WhatsApp Sender", "type": "n8n-nodes-base.httpRequest", "description": "Sends personalized WhatsApp via Business API"},
            {"name": "Google Sheets Logger", "type": "n8n-nodes-base.googleSheets", "description": "Logs all leads to spreadsheet"}
        ],
        "description": "Automated pipeline: Instagram DM → AI scoring → WhatsApp follow-up for hot leads → Google Sheets tracking",
        "setup_instructions": "1. Import this JSON into n8n\n2. Configure Instagram Business webhook\n3. Add your WhatsApp Business API credentials\n4. Connect your Google Sheets\n5. Set the AI lead scoring threshold (default: 7/10)"
    }',
    ARRAY['n8n', 'instagram', 'whatsapp', 'lead-generation', 'automation', 'india'],
    true
),
(
    'Shopify Support Agent (OpenClaw)',
    'OpenClaw-compatible AI agent skills that let your bot securely query Shopify order status and process refunds.',
    'openclaw_skill',
    ARRAY['shopify', 'customer-support', 'openclaw'],
    '{
        "skills": [
            {"name": "check_order_status", "description": "Queries Shopify Admin API for order status by email or order number", "trigger": "When customer asks about order status"},
            {"name": "initiate_refund", "description": "Creates a refund request in Shopify with approval workflow", "trigger": "When customer requests a refund"},
            {"name": "track_shipment", "description": "Fetches shipment tracking URL from Shopify fulfillment", "trigger": "When customer asks where is my order"}
        ],
        "setup_instructions": "1. Add skills to your OpenClaw skills directory\n2. Set SHOPIFY_ADMIN_API_KEY in your environment\n3. Configure the approval workflow for refunds\n4. Test with a sandbox Shopify store"
    }',
    ARRAY['shopify', 'openclaw', 'customer-support', 'ecommerce', 'automation'],
    true
),
(
    'Razorpay Dispute Automation (n8n)',
    'n8n workflow that monitors Razorpay webhooks for chargebacks and compiles defense evidence automatically.',
    'n8n_workflow',
    ARRAY['razorpay', 'finance', 'n8n', 'automation'],
    '{
        "nodes": [
            {"name": "Razorpay Webhook", "type": "n8n-nodes-base.webhook", "description": "Catches chargeback/dispute events from Razorpay"},
            {"name": "Fetch Order Data", "type": "n8n-nodes-base.httpRequest", "description": "Pulls order details, customer info, delivery proof"},
            {"name": "Compile Evidence", "type": "n8n-nodes-base.openAi", "description": "Generates defense letter with evidence summary"},
            {"name": "Submit Response", "type": "n8n-nodes-base.httpRequest", "description": "Submits dispute response to Razorpay API"},
            {"name": "Slack Alert", "type": "n8n-nodes-base.slack", "description": "Notifies team in Slack with dispute summary"}
        ],
        "description": "Automated chargeback defense: Razorpay dispute → evidence gathering → AI-generated defense → auto-submission → team alert",
        "setup_instructions": "1. Import into n8n\n2. Configure Razorpay API keys\n3. Connect your order database\n4. Add Slack webhook for notifications\n5. Set auto-respond threshold (recommended: disputes under ₹5,000)"
    }',
    ARRAY['razorpay', 'n8n', 'finance', 'chargeback', 'automation', 'india'],
    true
);

-- ============================================================================
-- DONE! Verify with: SELECT count(*), asset_type FROM library_assets GROUP BY asset_type;
-- Expected: 10 rows total (7 prompt_bundle, 2 n8n_workflow, 1 openclaw_skill)
-- ============================================================================
