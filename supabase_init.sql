-- Drop everything first so this script can be re-run cleanly without "already exists" errors
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user CASCADE;
DROP TABLE IF EXISTS public.library_assets CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    tier TEXT NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'pro', 'agency')),
    stripe_customer_id TEXT,
    razorpay_customer_id TEXT,
    api_key UUID DEFAULT gen_random_uuid(),
    api_calls_today INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Trigger to automatically create a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, tier)
  VALUES (new.id, 'free');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Library assets table
CREATE TABLE public.library_assets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    asset_type TEXT NOT NULL CHECK (asset_type IN (
        'prompt_bundle', 'n8n_workflow', 'openclaw_skill',
        'gpt_config', 'code_template', 'voice_agent'
    )),
    platform TEXT[] DEFAULT '{}',     -- ['whatsapp', 'instagram', 'email']
    content JSONB NOT NULL,            -- The actual payload
    is_premium BOOLEAN DEFAULT false,
    download_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS Policies
ALTER TABLE public.library_assets ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can see all assets in the catalog (so we can render Pro upsell locks)
CREATE POLICY "All assets visible to all authenticated users"
ON public.library_assets FOR SELECT
TO authenticated
USING (true);

-- Insert 5 Seed Assets into the library_assets table
INSERT INTO public.library_assets (title, description, asset_type, platform, content, is_premium)
VALUES 
(
    'WhatsApp Cart Recovery Sequence',
    '15 meticulously tested message templates for Shopify/WooCommerce abandoned cart recovery via WhatsApp Business API.',
    'prompt_bundle',
    ARRAY['whatsapp', 'ecommerce'],
    '{"templates": [{"name": "1 Hour Reminder", "body": "Hey {{name}}, looks like you left something behind!"}]}',
    false
),
(
    'SEO Blog Generator Prompt',
    'A massive 1500-token meta-prompt designed to write highly ranking, localized SEO articles for the Indian tech market.',
    'prompt_bundle',
    ARRAY['seo', 'content'],
    '{"prompt": "You are an expert Indian SEO copywriter..."}',
    false
),
(
    'Instagram to WhatsApp Pipeline',
    'Importable n8n workflow. Captures Instagram DM intent, scores leads via AI, and triggers automated WhatsApp outreach.',
    'n8n_workflow',
    ARRAY['instagram', 'whatsapp', 'n8n'],
    '{"nodes": [{"name": "Webhook", "type": "n8n-nodes-base.webhook"}]}',
    true
),
(
    'Shopify Support Agent Skills',
    'OpenClaw compatible skills (.md files) that grant your AI agent the ability to securely query order status and process refunds.',
    'openclaw_skill',
    ARRAY['shopify', 'customer_support'],
    '{"skills": ["check_order_status", "initiate_refund"]}',
    true
),
(
    'Razorpay Dispute Automation',
    'n8n template that monitors Razorpay webhooks for chargebacks and automatically compiles defense evidence from your DB.',
    'n8n_workflow',
    ARRAY['razorpay', 'finance'],
    '{"nodes": [{"name": "Razorpay Trigger", "type": "n8n-nodes-base.razorpay"}]}',
    true
);
