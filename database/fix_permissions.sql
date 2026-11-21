-- ==============================================================================
-- VillageVerse AI: Instant Permissions & Access Unlock Script
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/phfrwlxssexgltvpvgap/sql
-- ==============================================================================

-- 1. Grant PostgREST schema & table access
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres, anon, authenticated, service_role;

-- 2. Ensure RLS is active with open policies for the smart village platform
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.village_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.digital_twin_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.farmlands ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.water_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.roads ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.electricity_grid ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.healthcare_facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.development_projects ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    DROP POLICY IF EXISTS "Allow public all on profiles" ON public.profiles;
    CREATE POLICY "Allow public all on profiles" ON public.profiles FOR ALL USING (true) WITH CHECK (true);
    
    DROP POLICY IF EXISTS "Allow public all on village_profile" ON public.village_profile;
    CREATE POLICY "Allow public all on village_profile" ON public.village_profile FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Allow public all on digital_twin_assets" ON public.digital_twin_assets;
    CREATE POLICY "Allow public all on digital_twin_assets" ON public.digital_twin_assets FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Allow public all on farmlands" ON public.farmlands;
    CREATE POLICY "Allow public all on farmlands" ON public.farmlands FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Allow public all on water_resources" ON public.water_resources;
    CREATE POLICY "Allow public all on water_resources" ON public.water_resources FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Allow public all on roads" ON public.roads;
    CREATE POLICY "Allow public all on roads" ON public.roads FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Allow public all on electricity_grid" ON public.electricity_grid;
    CREATE POLICY "Allow public all on electricity_grid" ON public.electricity_grid FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Allow public all on healthcare_facilities" ON public.healthcare_facilities;
    CREATE POLICY "Allow public all on healthcare_facilities" ON public.healthcare_facilities FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Allow public all on complaints" ON public.complaints;
    CREATE POLICY "Allow public all on complaints" ON public.complaints FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Allow public all on notifications" ON public.notifications;
    CREATE POLICY "Allow public all on notifications" ON public.notifications FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Allow public all on development_projects" ON public.development_projects;
    CREATE POLICY "Allow public all on development_projects" ON public.development_projects FOR ALL USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 3. Turn on Realtime for live dashboard and citizen grievance updates
DO $$ BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.complaints;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.water_resources;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.electricity_grid;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.digital_twin_assets;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 4. Automatic Profile Trigger on Auth Signup
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
UPDATE public.profiles SET user_id = id WHERE user_id IS NULL;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Do not create duplicate if profile already exists
    IF EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = NEW.id OR user_id = NEW.id OR email = NEW.email
    ) THEN
        RETURN NEW;
    END IF;

    INSERT INTO public.profiles (
        id, 
        user_id, 
        email, 
        full_name, 
        phone, 
        role, 
        department, 
        created_at, 
        updated_at
    )
    VALUES (
        NEW.id,
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'phone', '9845012399'),
        COALESCE(NEW.raw_user_meta_data->>'role', 'Citizen'),
        COALESCE(NEW.raw_user_meta_data->>'department', 'General'),
        timezone('utc'::text, now()),
        timezone('utc'::text, now())
    )
    ON CONFLICT (id) DO NOTHING;

    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. Seed / Update Multi-Gram Panchayat Directory
INSERT INTO public.village_profile (id, name, taluk, district, state, pincode, latitude, longitude, population, households, area_sq_km, health_score, agriculture_score, water_score, electricity_score, carbon_score, flood_risk)
VALUES 
(
    'GP-KA-MND-042', 'Shivalli Gram Panchayat', 'Mandya', 'Mandya', 'Karnataka', '571405', 
    12.5623, 76.8921, 4820, 1140, 14.8, 86, 88, 84, 91, 79, 'Low (18%)'
),
(
    'GP-KA-MND-043', 'Keragodu Gram Panchayat', 'Mandya', 'Mandya', 'Karnataka', '571446', 
    12.5850, 76.9210, 5420, 1280, 16.2, 82, 85, 81, 84, 76, 'Low (14%)'
),
(
    'GP-KA-MND-044', 'Dudda Gram Panchayat', 'Mandya', 'Mandya', 'Karnataka', '571402', 
    12.6120, 76.8540, 4680, 1090, 13.5, 84, 87, 86, 88, 81, 'Moderate (24%)'
),
(
    'GP-KA-MND-045', 'Basaralu Gram Panchayat', 'Mandya', 'Mandya', 'Karnataka', '571416', 
    12.7150, 76.8210, 6150, 1420, 18.4, 79, 82, 78, 80, 74, 'Low (12%)'
),
(
    'GP-KA-MND-046', 'Kothathi Gram Panchayat', 'Mandya', 'Mandya', 'Karnataka', '571401', 
    12.5210, 76.9450, 3950, 920, 11.8, 88, 90, 89, 93, 86, 'Low (10%)'
)
ON CONFLICT (id) DO UPDATE 
SET population = EXCLUDED.population, households = EXCLUDED.households, health_score = EXCLUDED.health_score;
