-- 1. Create the `profiles` table to store public user metadata
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    tier TEXT NOT NULL DEFAULT 'free',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own profile
CREATE POLICY "Users can view own profile" 
    ON public.profiles FOR SELECT 
    USING (auth.uid() = id);

-- Allow service role to update profiles (used by webhook)
CREATE POLICY "Service role can manage profiles" 
    ON public.profiles FOR ALL 
    USING (true);

-- 2. Create the `purchases` table for Razorpay ledgers
CREATE TABLE IF NOT EXISTS public.purchases (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    order_id TEXT NOT NULL UNIQUE,
    payment_id TEXT NOT NULL,
    amount INTEGER NOT NULL,
    currency TEXT NOT NULL DEFAULT 'INR',
    status TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on purchases
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own purchases
CREATE POLICY "Users can view own purchases" 
    ON public.purchases FOR SELECT 
    USING (auth.uid() = user_id);

-- 3. Create the automated trigger for new signups
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, tier)
    VALUES (new.id, 'free');
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Bind the trigger to the auth.users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- (Optional Backfill) Insert profiles for already existing users
INSERT INTO public.profiles (id, tier)
SELECT id, 'free' FROM auth.users
ON CONFLICT (id) DO NOTHING;
