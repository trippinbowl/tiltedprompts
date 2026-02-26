-- ============================================================================
-- TiltedPrompts: library_assets modifications
-- Migration: 001_library_assets
--
-- This migration updates the existing library_assets table to add the columns
-- requested by the OpenClaw agent and creates the necessary indices.
-- We are keeping the existing RLS policy ("All assets visible to all authenticated users")
-- so our UI can still render locked cards to free users.
-- ============================================================================

-- Safely add missing columns
ALTER TABLE public.library_assets ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE public.library_assets ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- Indexes for common query patterns
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

-- ============================================================================
-- Updated_at trigger
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_library_assets_updated_at ON public.library_assets;

CREATE TRIGGER trigger_library_assets_updated_at
    BEFORE UPDATE ON public.library_assets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
