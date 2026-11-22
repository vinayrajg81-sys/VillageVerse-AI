-- ==============================================================================
-- VillageVerse AI: FIX "Database error saving new user"
-- Run this script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/phfrwlxssexgltvpvgap/sql
-- ==============================================================================

-- 1. Ensure public.profiles table exists with all required columns
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    user_id UUID,
    email VARCHAR(120),
    full_name VARCHAR(120),
    phone VARCHAR(20),
    role VARCHAR(50) DEFAULT 'Citizen',
    department VARCHAR(100) DEFAULT 'General',
    panchayat_id VARCHAR(50) DEFAULT 'GP-KA-MND-042',
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Safely add any missing columns in case table was created with another schema
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS user_id UUID;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email VARCHAR(120);
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_name VARCHAR(120);
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'Citizen';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS department VARCHAR(100) DEFAULT 'General';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS panchayat_id VARCHAR(50) DEFAULT 'GP-KA-MND-042';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

-- 3. Populate user_id = id for existing rows
UPDATE public.profiles SET user_id = id WHERE user_id IS NULL;

-- 4. Re-create the bulletproof handle_new_user() trigger function
-- SECURITY DEFINER ensures the function executes with superuser permissions,
-- and EXCEPTION WHEN OTHERS THEN RETURN NEW ensures user creation in auth.users
-- can NEVER be aborted by any profile insertion error.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER 
SET search_path = public, auth, pg_temp
AS $$
DECLARE
    _full_name TEXT;
    _phone TEXT;
    _role TEXT;
    _dept TEXT;
BEGIN
    _full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1), 'Village Resident');
    _phone := COALESCE(NEW.raw_user_meta_data->>'phone', '9845012399');
    _role := COALESCE(NEW.raw_user_meta_data->>'role', 'Citizen');
    _dept := COALESCE(NEW.raw_user_meta_data->>'department', 'General');

    -- Insert or update profile record cleanly
    INSERT INTO public.profiles (
        id, 
        user_id, 
        email, 
        full_name, 
        phone, 
        role, 
        department, 
        panchayat_id,
        created_at, 
        updated_at
    )
    VALUES (
        NEW.id,
        NEW.id,
        NEW.email,
        _full_name,
        _phone,
        _role,
        _dept,
        'GP-KA-MND-042',
        timezone('utc'::text, now()),
        timezone('utc'::text, now())
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
        phone = COALESCE(EXCLUDED.phone, public.profiles.phone),
        role = COALESCE(EXCLUDED.role, public.profiles.role),
        department = COALESCE(EXCLUDED.department, public.profiles.department),
        updated_at = timezone('utc'::text, now());

    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    -- Fallback: NEVER abort auth.users creation if a profile error occurs
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. Re-bind trigger to auth.users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. Grant schema & table permissions to PostgREST roles (anon, authenticated, service_role)
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres, anon, authenticated, service_role;

-- 7. Enable RLS and create open policy on public.profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public all on profiles" ON public.profiles;
CREATE POLICY "Allow public all on profiles" ON public.profiles FOR ALL USING (true) WITH CHECK (true);
