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
