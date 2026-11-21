-- ==============================================================================
-- VillageVerse AI: Complete Supabase PostgreSQL Schema & Seed Migrations
-- Region: Shivalli Gram Panchayat, Mandya District, Karnataka (GP-KA-MND-042)
-- Instructions: Run this script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/phfrwlxssexgltvpvgap/sql
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 1. PROFILES & ROLE-BASED ACCESS CONTROL (RBAC)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(120) UNIQUE NOT NULL,
    full_name VARCHAR(120) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(50) NOT NULL DEFAULT 'Citizen',
    department VARCHAR(100) DEFAULT 'General',
    panchayat_id VARCHAR(50) DEFAULT 'GP-KA-MND-042',
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ensure both id and user_id columns exist if table was previously created
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
UPDATE public.profiles SET user_id = id WHERE user_id IS NULL;

-- Automatic Profile Creation Trigger on Supabase Auth Registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if record already exists by user_id or id or email to prevent duplicates
    IF EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = NEW.id OR user_id = NEW.id OR email = NEW.email
    ) THEN
        RETURN NEW;
    END IF;

    -- Insert new profile record
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
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'phone', '9845012399'),
        COALESCE(NEW.raw_user_meta_data->>'role', 'Citizen'),
        COALESCE(NEW.raw_user_meta_data->>'department', 'General'),
        'GP-KA-MND-042',
        timezone('utc'::text, now()),
        timezone('utc'::text, now())
    )
    ON CONFLICT (id) DO NOTHING;

    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    -- Fallback to ensure auth signup succeeds smoothly
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==========================================
-- 2. VILLAGE PROFILE (COMMAND CENTER)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.village_profile (
    id VARCHAR(50) PRIMARY KEY DEFAULT 'GP-KA-MND-042',
    name VARCHAR(100) NOT NULL,
    taluk VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    latitude DECIMAL(9, 6) NOT NULL,
    longitude DECIMAL(9, 6) NOT NULL,
    population INT NOT NULL DEFAULT 4820,
    households INT NOT NULL DEFAULT 1140,
    area_sq_km DECIMAL(6, 2) NOT NULL DEFAULT 14.8,
    health_score INT NOT NULL DEFAULT 86,
    agriculture_score INT NOT NULL DEFAULT 88,
    water_score INT NOT NULL DEFAULT 84,
    electricity_score INT NOT NULL DEFAULT 91,
    carbon_score INT NOT NULL DEFAULT 79,
    flood_risk VARCHAR(50) DEFAULT 'Low (18%)',
    weather JSONB DEFAULT '{"temp": 29.4, "condition": "Partly Cloudy", "humidity": 58, "wind_kmh": 12, "rainfall_mm": 1.2, "aqi": 42}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 3. DIGITAL TWIN ASSETS (3D WEBGL & GIS)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.digital_twin_assets (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    category VARCHAR(80) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Operational',
    health_score INT NOT NULL DEFAULT 90,
    latitude DECIMAL(9, 6) NOT NULL,
    longitude DECIMAL(9, 6) NOT NULL,
    position_3d JSONB NOT NULL DEFAULT '{"x": 0, "y": 0.5, "z": 0}'::jsonb,
    size JSONB NOT NULL DEFAULT '[1.5, 1.5, 1.5]'::jsonb,
    color VARCHAR(20) DEFAULT '#10b981',
    install_date DATE,
    last_inspected DATE,
    capacity VARCHAR(100),
    ai_recommendation TEXT,
    specifications JSONB,
    maintenance_history JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 4. AGRICULTURE & MANDYA APMC CROPS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.farmlands (
    id VARCHAR(50) PRIMARY KEY,
    farmer_name VARCHAR(120) NOT NULL,
    survey_no VARCHAR(50) NOT NULL,
    ward VARCHAR(20) DEFAULT 'Ward 2',
    crop_type VARCHAR(80) NOT NULL,
    area_acres DECIMAL(6, 2) NOT NULL,
    soil_type VARCHAR(50) NOT NULL,
    soil_moisture_pct DECIMAL(5, 2) NOT NULL,
    soil_ph DECIMAL(4, 2) NOT NULL,
    nitrogen_level INT DEFAULT 180,
    phosphorus_level INT DEFAULT 24,
    potassium_level INT DEFAULT 210,
    npk_ratio VARCHAR(30) DEFAULT '120:60:40',
    irrigation_source VARCHAR(60) DEFAULT 'Canal & Solar Borewell',
    predicted_yield_quintals DECIMAL(8, 2),
    mandi_rate_inr DECIMAL(8, 2),
    disease_status VARCHAR(50) DEFAULT 'Healthy',
    ai_advisory TEXT,
    latitude DECIMAL(9, 6) DEFAULT 12.5678,
    longitude DECIMAL(9, 6) DEFAULT 76.8862,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 5. WATER RESOURCES & JJM TELEMETRY
-- ==========================================
CREATE TABLE IF NOT EXISTS public.water_resources (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    type VARCHAR(80) NOT NULL,
    capacity_liters BIGINT NOT NULL,
    current_level_pct DECIMAL(5, 2) NOT NULL,
    flow_rate_lpm DECIMAL(7, 2) DEFAULT 420.0,
    tds_ppm INT DEFAULT 240,
    ph_level DECIMAL(4, 2) DEFAULT 7.2,
    turbidity_ntu DECIMAL(4, 2) DEFAULT 1.2,
    leak_detected BOOLEAN DEFAULT FALSE,
    leak_location VARCHAR(120),
    latitude DECIMAL(9, 6) DEFAULT 12.5641,
    longitude DECIMAL(9, 6) DEFAULT 76.8934,
    status VARCHAR(50) DEFAULT 'Normal',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 6. ROADS & INFRASTRUCTURE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.roads (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    type VARCHAR(80) DEFAULT 'Asphalt',
    length_km DECIMAL(6, 2) NOT NULL,
    width_m DECIMAL(4, 2) NOT NULL,
    pci_score INT NOT NULL,
    potholes_count INT DEFAULT 0,
    traffic_density VARCHAR(30) DEFAULT 'Medium',
    scheduled_repair DATE,
    estimated_cost_inr DECIMAL(12, 2),
    status VARCHAR(50) NOT NULL DEFAULT 'Operational',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 7. ELECTRICITY & COMMUNITY SOLAR MICROGRID
-- ==========================================
CREATE TABLE IF NOT EXISTS public.electricity_grid (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    type VARCHAR(80) NOT NULL,
    rating_kva INT,
    current_load_pct DECIMAL(5, 2) NOT NULL,
    daily_consumption_kwh DECIMAL(10, 2),
    solar_generation_kwh DECIMAL(10, 2) DEFAULT 0,
    battery_storage_pct INT DEFAULT 88,
    outage_risk VARCHAR(30) DEFAULT 'Low',
    status VARCHAR(50) DEFAULT 'Operational',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 8. HEALTHCARE & TELE-ICU
-- ==========================================
CREATE TABLE IF NOT EXISTS public.healthcare_facilities (
    id VARCHAR(50) PRIMARY KEY,
    facility_name VARCHAR(120) NOT NULL,
    type VARCHAR(80) DEFAULT 'Primary Health Centre',
    doctor_count INT NOT NULL DEFAULT 2,
    nurse_count INT NOT NULL DEFAULT 4,
    bed_count INT NOT NULL DEFAULT 12,
    occupied_beds INT NOT NULL DEFAULT 4,
    ambulances_available INT NOT NULL DEFAULT 1,
    essential_medicine_pct INT NOT NULL DEFAULT 96,
    emergency_contact VARCHAR(20) DEFAULT '9845012399',
    tele_icu_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 9. CITIZEN COMPLAINTS & GRIEVANCE TRIAGE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.complaints (
    id VARCHAR(50) PRIMARY KEY,
    citizen_name VARCHAR(120) NOT NULL,
    citizen_phone VARCHAR(20),
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL DEFAULT 'Water Supply',
    priority VARCHAR(30) NOT NULL DEFAULT 'Medium',
    status VARCHAR(40) NOT NULL DEFAULT 'Open',
    ward VARCHAR(30) DEFAULT 'Ward 1',
    location_address TEXT DEFAULT 'Ward 2, Cross 3',
    gps_lat DECIMAL(9, 6) DEFAULT 12.5623,
    gps_lng DECIMAL(9, 6) DEFAULT 76.8921,
    image_url TEXT,
    voice_url TEXT,
    audio_url TEXT,
    assigned_officer VARCHAR(100) DEFAULT 'Panchayat Development Officer (PDO)',
    assigned_department VARCHAR(100) DEFAULT 'Rural Development',
    ai_classification JSONB DEFAULT '{"category": "General", "confidence": 0.94}'::jsonb,
    timeline JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 10. REALTIME NOTIFICATIONS STREAM
-- ==========================================
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(30) DEFAULT 'info',
    department VARCHAR(50) DEFAULT 'General',
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 11. AI DEVELOPMENT PLANNER & PROJECTS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.development_projects (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(60) NOT NULL,
    estimated_cost_inr DECIMAL(14, 2) NOT NULL,
    sanctioned_budget_inr DECIMAL(14, 2) NOT NULL,
    roi_score DECIMAL(4, 2) NOT NULL,
    priority VARCHAR(20) DEFAULT 'High',
    funding_scheme VARCHAR(100) DEFAULT '15th Finance Commission',
    completion_pct INT DEFAULT 0,
    status VARCHAR(40) DEFAULT 'Proposed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 12. DISASTER PREDICTION & MONITORING
-- ==========================================
CREATE TABLE IF NOT EXISTS public.disaster_monitoring (
    id VARCHAR(50) PRIMARY KEY,
    hazard_type VARCHAR(60) NOT NULL,
    threat_level VARCHAR(30) NOT NULL,
    risk_percentage INT NOT NULL,
    affected_wards VARCHAR(120),
    evacuation_shelter_id VARCHAR(50),
    shelter_capacity INT,
    shelter_name VARCHAR(120),
    alert_message TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 13. GRANT PERMISSIONS & ROW LEVEL SECURITY (RLS)
-- ==========================================
-- Grant schema & table access to PostgREST roles (anon, authenticated)
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres, anon, authenticated, service_role;

-- Enable RLS on all public tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.village_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.digital_twin_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farmlands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.water_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.electricity_grid ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.healthcare_facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.development_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disaster_monitoring ENABLE ROW LEVEL SECURITY;

-- Transparent Open Access for Smart Village Citizens & Officials
DO $$ BEGIN
    DROP POLICY IF EXISTS "Allow public all on profiles" ON public.profiles;
    CREATE POLICY "Allow public all on profiles" ON public.profiles FOR ALL USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    DROP POLICY IF EXISTS "Allow public all on village_profile" ON public.village_profile;
    CREATE POLICY "Allow public all on village_profile" ON public.village_profile FOR ALL USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    DROP POLICY IF EXISTS "Allow public all on digital_twin_assets" ON public.digital_twin_assets;
    CREATE POLICY "Allow public all on digital_twin_assets" ON public.digital_twin_assets FOR ALL USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    DROP POLICY IF EXISTS "Allow public all on farmlands" ON public.farmlands;
    CREATE POLICY "Allow public all on farmlands" ON public.farmlands FOR ALL USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    DROP POLICY IF EXISTS "Allow public all on water_resources" ON public.water_resources;
    CREATE POLICY "Allow public all on water_resources" ON public.water_resources FOR ALL USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    DROP POLICY IF EXISTS "Allow public all on roads" ON public.roads;
    CREATE POLICY "Allow public all on roads" ON public.roads FOR ALL USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    DROP POLICY IF EXISTS "Allow public all on electricity_grid" ON public.electricity_grid;
    CREATE POLICY "Allow public all on electricity_grid" ON public.electricity_grid FOR ALL USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    DROP POLICY IF EXISTS "Allow public all on healthcare_facilities" ON public.healthcare_facilities;
    CREATE POLICY "Allow public all on healthcare_facilities" ON public.healthcare_facilities FOR ALL USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    DROP POLICY IF EXISTS "Allow public all on complaints" ON public.complaints;
    CREATE POLICY "Allow public all on complaints" ON public.complaints FOR ALL USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    DROP POLICY IF EXISTS "Allow public all on notifications" ON public.notifications;
    CREATE POLICY "Allow public all on notifications" ON public.notifications FOR ALL USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    DROP POLICY IF EXISTS "Allow public all on development_projects" ON public.development_projects;
    CREATE POLICY "Allow public all on development_projects" ON public.development_projects FOR ALL USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    DROP POLICY IF EXISTS "Allow public all on disaster_monitoring" ON public.disaster_monitoring;
    CREATE POLICY "Allow public all on disaster_monitoring" ON public.disaster_monitoring FOR ALL USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ==========================================
-- 14. ENABLE SUPABASE REALTIME REPLICATION
-- ==========================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.complaints;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.water_resources;
ALTER PUBLICATION supabase_realtime ADD TABLE public.electricity_grid;
ALTER PUBLICATION supabase_realtime ADD TABLE public.digital_twin_assets;

-- ==========================================
-- 15. SEED DATA FOR MULTIPLE GRAM PANCHAYATS (MANDYA DISTRICT)
-- ==========================================
-- 1. Village Profiles (Multi-Gram Panchayat Directory)
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

-- 2. 10 Core 3D Digital Twin Assets
INSERT INTO public.digital_twin_assets (id, name, category, status, health_score, latitude, longitude, position_3d, size, color, install_date, last_inspected, capacity, ai_recommendation)
VALUES
('AST-001', 'Gram Panchayat Administrative Bhavan', 'Building', 'Operational', 94, 12.5625, 76.8922, '{"x": 0, "y": 0.8, "z": 0}'::jsonb, '[3, 1.6, 2.5]'::jsonb, '#3b82f6', '2016-04-12', '2026-10-15', '12 Offices & Gram Sabha Hall', 'Install additional 5kW rooftop solar panels for zero-grid dependency.'),
('AST-002', 'Shivalli Overhead Water Reservoir 1 (Main)', 'Water Tank', 'Operational', 88, 12.5641, 76.8934, '{"x": 4.5, "y": 2.2, "z": -3}'::jsonb, '[1.8, 4.4, 1.8]'::jsonb, '#06b6d4', '2018-08-20', '2026-11-02', '150,000 Liters', 'Acoustic inspection detects minor valve sedimentation at outlet #2.'),
('AST-003', 'Shivalli Kere (Main Village Lake)', 'Lake', 'Operational', 82, 12.5601, 76.8885, '{"x": -6, "y": 0.1, "z": 4.5}'::jsonb, '[7, 0.2, 5]'::jsonb, '#0284c7', '1998-01-01', '2026-11-10', '1.8 Million Cu.M Storage', 'Silt clearance recommended along West canal embankment prior to pre-monsoon showers.'),
('AST-004', 'Deep Solar Borewell No. 4 - Ward 3', 'Borewell', 'Needs Maintenance', 64, 12.5662, 76.8951, '{"x": 6.2, "y": 0.6, "z": 2}'::jsonb, '[0.8, 1.2, 0.8]'::jsonb, '#f59e0b', '2021-02-18', '2026-11-12', '450 Liters/Minute', 'Submersible pump motor shows bearing thermal anomaly; service within 7 days.'),
('AST-005', 'Shivalli Primary Health Centre (PHC)', 'Hospital', 'Operational', 91, 12.5618, 76.8942, '{"x": 3.2, "y": 1, "z": 3.5}'::jsonb, '[3.4, 2, 2.8]'::jsonb, '#10b981', '2014-06-05', '2026-11-18', '12 Beds, 1 Labor Room, Minor OT', 'Ready for Tele-ICU terminal integration under Ayushman Bharat digital push.'),
('AST-006', 'Government Higher Primary School (GHPS)', 'School', 'Operational', 89, 12.5638, 76.8907, '{"x": -3.5, "y": 1.1, "z": -2.8}'::jsonb, '[4.2, 2.2, 2.6]'::jsonb, '#8b5cf6', '2005-09-10', '2026-10-28', '340 Students Enrolled', 'Smart TV classroom unit 2 requires firmware update.'),
('AST-007', 'Ward 2 Anganwadi Child Care Centre', 'Anganwadi', 'Operational', 95, 12.5654, 76.8918, '{"x": -1.2, "y": 0.6, "z": -4.5}'::jsonb, '[2, 1.2, 1.8]'::jsonb, '#ec4899', '2019-11-20', '2026-11-14', '45 Toddlers & Lactating Mothers', 'Maintain nutritional supplement buffer stocks for winter cycle.'),
('AST-008', 'Mandya-Shivalli Main Link Road (SH-17 Connect)', 'Road', 'Operational', 79, 12.5630, 76.8910, '{"x": 0, "y": 0.05, "z": 0}'::jsonb, '[14, 0.1, 0.8]'::jsonb, '#64748b', '2022-03-15', '2026-11-05', '4.2 km Bituminous Highway', 'Pothole clustering detected near K.M. 2.4; patch scheduling suggested.'),
('AST-009', 'Ward 1 & 4 LED Smart Streetlight Cluster', 'Street Light', 'Operational', 92, 12.5633, 76.8929, '{"x": 1.5, "y": 1.2, "z": 0.5}'::jsonb, '[0.3, 2.4, 0.3]'::jsonb, '#eab308', '2023-01-10', '2026-11-19', '68 Poles (IoT Ambient Dimming)', 'Dimming schedule saving 38% energy; 2 bulbs replaced this month.'),
('AST-010', 'Shivalli Community Solar Microgrid Plant', 'Solar Panel', 'Operational', 96, 12.5670, 76.8890, '{"x": -4.8, "y": 0.5, "z": 1.8}'::jsonb, '[3.8, 0.4, 2.4]'::jsonb, '#14b8a6', '2023-05-18', '2026-11-15', '120 kWp Capacity', 'Dust deposit detected on string 4; automated dry wiper cycle recommended.')
ON CONFLICT (id) DO NOTHING;

-- 3. Farmlands (Mandya Sugarcane, Ragi, Paddy, Mulberry)
INSERT INTO public.farmlands (id, farmer_name, survey_no, ward, crop_type, area_acres, soil_type, soil_moisture_pct, soil_ph, nitrogen_level, phosphorus_level, potassium_level, irrigation_source, predicted_yield_quintals, mandi_rate_inr, disease_status, ai_advisory, latitude, longitude)
VALUES
('FARM-01', 'Basavaraju Gowda', 'SY-142/1', 'Ward 2', 'Sugarcane (Co 86032)', 4.5, 'Red Sandy Loam', 62.4, 6.8, 180, 24, 210, 'Canal & Drip', 380.0, 315.0, 'Healthy', 'Irrigation cycle optimal. Maintain soil moisture above 60% for internode elongation.', 12.5678, 76.8862),
('FARM-02', 'Ningamma Kumar', 'SY-156/3', 'Ward 1', 'Ragi (Finger Millet - GPU 28)', 3.0, 'Red Sandy Loam', 44.1, 6.5, 140, 19, 190, 'Rainfed + Borewell', 28.5, 3850.0, 'Healthy', 'Good vegetative growth. Micro-nutrient spray recommended next week.', 12.5691, 76.8880),
('FARM-03', 'Chandrashekar S.', 'SY-188/2', 'Ward 4', 'Paddy (Jyothi Variety)', 5.2, 'Clayey Alluvial', 78.2, 7.1, 210, 32, 230, 'Shivalli Lake Canal', 115.0, 2200.0, 'Mild Leaf Blast Suspected', 'Apply Tricyclazole 75 WP at 0.6g/L within 48 hours to arrest fungal spread.', 12.5590, 76.8845),
('FARM-04', 'Maheshwarappa K.', 'SY-204/1', 'Ward 3', 'Banana (Grand Naine)', 2.8, 'Loamy Red', 68.0, 6.7, 195, 28, 260, 'Drip Irrigation', 210.0, 24.0, 'Healthy', 'Bunch formation stage. Potassium fertigation scheduled.', 12.5575, 76.8898),
('FARM-05', 'Sunithamma H.', 'SY-94/2', 'Ward 5', 'Mulberry (V1 Silkworm)', 2.0, 'Red Loam', 55.6, 6.6, 160, 22, 180, 'Sprinkler System', 45.0, 480.0, 'Healthy', 'Foliage density prime for 5th instar silkworm batch rearing.', 12.5650, 76.8820)
ON CONFLICT (id) DO NOTHING;

-- 4. Water Resources
INSERT INTO public.water_resources (id, name, type, capacity_liters, current_level_pct, flow_rate_lpm, tds_ppm, ph_level, turbidity_ntu, leak_detected, leak_location, latitude, longitude, status)
VALUES
('WAT-01', 'Main Overhead Tank - Ward 1', 'Overhead Tank', 150000, 84.5, 420.0, 240, 7.2, 1.2, FALSE, NULL, 12.5641, 76.8934, 'Optimal'),
('WAT-02', 'Kere Pipeline Main Feeder', 'Distribution Pipeline', 80000, 72.0, 310.0, 265, 7.4, 2.1, TRUE, 'Near Cross Road 4 culvert', 12.5620, 76.8912, 'Leak Alert'),
('WAT-03', 'Community Solar Borewell #2', 'Borewell', 45000, 91.0, 180.0, 290, 7.0, 0.8, FALSE, NULL, 12.5662, 76.8951, 'Optimal'),
('WAT-04', 'Shivalli Natural Lake Basin', 'Lake', 1800000000, 88.0, 1400.0, 185, 7.5, 3.4, FALSE, NULL, 12.5601, 76.8885, 'Optimal'),
('WAT-05', 'Purified RO Water ATM - Bus Stand', 'Water ATM', 5000, 65.0, 45.0, 85, 6.9, 0.2, FALSE, NULL, 12.5628, 76.8925, 'Optimal')
ON CONFLICT (id) DO NOTHING;

-- 5. Roads & Infrastructure
INSERT INTO public.roads (id, name, type, length_km, width_m, pci_score, potholes_count, traffic_density, scheduled_repair, estimated_cost_inr, status)
VALUES
('RD-01', 'Mandya-Shivalli Main Link Road (SH-17 Connect)', 'Bituminous Asphalt', 4.2, 5.5, 79, 4, 'Medium', '2026-12-05', 480000.00, 'Operational'),
('RD-02', 'Ward 2 Dairy Cooperative Feeder Road', 'Concrete Paver', 1.8, 3.8, 62, 7, 'Low', '2026-11-28', 210000.00, 'Needs Maintenance'),
('RD-03', 'GHPS School & Anganwadi Approach Road', 'Bituminous Asphalt', 1.1, 4.0, 91, 0, 'Low', '2027-02-15', 85000.00, 'Optimal'),
('RD-04', 'Shivalli Lake Bund Agricultural Access Track', 'Gravel & WBM', 2.6, 3.2, 58, 12, 'Medium', '2026-12-12', 340000.00, 'Repairs Scheduled')
ON CONFLICT (id) DO NOTHING;

-- 6. Electricity Grid & Community Solar
INSERT INTO public.electricity_grid (id, name, type, rating_kva, current_load_pct, daily_consumption_kwh, solar_generation_kwh, battery_storage_pct, outage_risk, status)
VALUES
('TR-01', 'Main 250 kVA Step-Down Transformer - GP Bhavan', 'Distribution Transformer', 250, 68.4, 2180.00, 480.00, 92, 'Low', 'Operational'),
('TR-02', 'Ward 3 Agricultural Feeder Transformer 100 kVA', 'Borewell Feeder', 100, 84.1, 940.00, 0.00, 78, 'Moderate', 'Operational'),
('TR-03', 'Ward 4 Community Solar Microgrid Inverter 120 kWp', 'Solar Inverter & Microgrid', 150, 42.0, 0.00, 640.00, 96, 'Low', 'Optimal')
ON CONFLICT (id) DO NOTHING;

-- 7. Healthcare Facilities
INSERT INTO public.healthcare_facilities (id, facility_name, type, doctor_count, nurse_count, bed_count, occupied_beds, ambulances_available, essential_medicine_pct, emergency_contact, tele_icu_active)
VALUES
('HC-01', 'Shivalli 24x7 Primary Health Centre (PHC)', 'Primary Health Centre', 2, 4, 12, 4, 1, 96, '9845012399', TRUE),
('HC-02', 'Ward 2 Health & Wellness Sub-Centre', 'Health Sub-Centre', 1, 2, 4, 1, 0, 92, '9845012400', TRUE)
ON CONFLICT (id) DO NOTHING;

-- 8. Complaints & Citizen Grievances
INSERT INTO public.complaints (id, citizen_name, citizen_phone, category, priority, title, description, location_address, gps_lat, gps_lng, status, assigned_officer, assigned_department)
VALUES
('CMP-2026-081', 'Manjunatha K.', '9845123410', 'Water Supply', 'Urgent', 'Low water pressure and intermittent supply in Ward 3', 'Drinking water supply has dropped significantly for past 2 days. Motors are running dry during scheduled morning hours.', 'Cross 3, Opposite Vinayaka Temple, Ward 3', 12.5658, 76.8945, 'In Progress', 'Suresh Kumar (AE Water)', 'Rural Water Supply & Sanitation'),
('CMP-2026-082', 'Devika M.', '9741289055', 'Road Damage', 'High', 'Dangerous pothole formed after heavy pre-monsoon showers', 'A large 2-foot diameter deep pothole has appeared near the dairy society bend. Two two-wheelers skidded yesterday evening.', 'Dairy Cooperative Road, Ward 2', 12.5635, 76.8905, 'Open', 'Anand Rao (Panchayat Engineer)', 'Public Works & Roads'),
('CMP-2026-083', 'Prakash H.R.', '9448109823', 'Electricity / Streetlight', 'Medium', 'Streetlight flickering and 3 poles dark near Government School', 'The LED streetlights on the GHPS approach road are tripping every 10 minutes, causing safety issues for evening pedestrians.', 'School Road, Ward 1', 12.5638, 76.8907, 'Open', 'Kavitha S. (BESCOM Junior Eng)', 'Energy & Street Lighting'),
('CMP-2026-084', 'Rameshappa', '9900341872', 'Garbage & Sanitation', 'Medium', 'Commercial waste accumulation near weekly Sunday Haat ground', 'Plastic covers and vegetable debris have not been lifted since Sunday evening. Stray animals are scattering the waste.', 'Old Shandy Ground, Near Bus Stop', 12.5624, 76.8928, 'Resolved', 'Mallikarjun (Sanitation Supervisor)', 'Solid Waste Management')
ON CONFLICT (id) DO NOTHING;

-- 9. Notifications Stream
INSERT INTO public.notifications (title, message, type, department)
VALUES
('Solar Generation Peak', 'Shivalli Community Solar microgrid reached 120 kWp at 12:30 PM.', 'success', 'Energy'),
('Canal Gate Adjustment', 'KRS dam canal inflows balanced at Ward 2 culvert.', 'info', 'Water'),
('Crop Health Advisory', 'Sugarcane soil moisture advisory sent to 620 Mandya farmers.', 'success', 'Agriculture')
ON CONFLICT DO NOTHING;

-- 10. AI Development Projects
INSERT INTO public.development_projects (id, name, category, estimated_cost_inr, sanctioned_budget_inr, roi_score, priority, funding_scheme, completion_pct, status)
VALUES
('PRJ-01', 'Shivalli Kere Catchment Desilting & Lakefront Revitalization', 'Water Security', 3200000.00, 3200000.00, 9.4, 'High', '15th Finance Commission', 45, 'In Progress'),
('PRJ-02', 'Ward 3 & 4 Rooftop Solar Microgrid Extension (Phase II)', 'Renewable Energy', 1850000.00, 2000000.00, 8.8, 'High', 'PM Surya Ghar Muft Bijli Yojana', 70, 'In Progress'),
('PRJ-03', 'Precision IoT Soil Moisture & Weather Station Network', 'Smart Agriculture', 650000.00, 700000.00, 9.1, 'Medium', 'Rashtriya Krishi Vikas Yojana', 90, 'Near Completion'),
('PRJ-04', 'Jal Jeevan Mission Acoustic Leak Sensors on Feeder Pipelines', 'Drinking Water', 1200000.00, 1200000.00, 9.6, 'Urgent', 'Jal Jeevan Mission (JJM)', 60, 'In Progress')
ON CONFLICT (id) DO NOTHING;

-- 11. Disaster Monitoring
INSERT INTO public.disaster_monitoring (id, hazard_type, threat_level, risk_percentage, affected_wards, evacuation_shelter_id, shelter_capacity, shelter_name, alert_message)
VALUES
('DIS-01', 'Flood', 'Advisory', 32, 'Ward 4 (Low-lying Lake bund area)', 'AST-006', 450, 'GHPS Primary School Cyclone Shelter', 'Cauvery basin catchment inflows monitored; reservoir levels safe at 82% capacity.'),
('DIS-02', 'Heatwave', 'Safe', 14, 'All Wards', 'AST-001', 300, 'Gram Panchayat Bhavan Air-Cooled Hall', 'Max temp projected at 32.5°C; comfortable humidity range.'),
('DIS-03', 'Drought', 'Safe', 18, 'Ward 5 Agricultural belt', 'AST-003', 0, 'Shivalli Kere Catchment Tank', 'Groundwater table replenished up to 48 feet below ground level due to watershed works.'),
('DIS-04', 'Lightning', 'Warning', 65, 'Open Farmlands Survey 120-210', 'AST-005', 100, 'PHC Lightning Arrestor Protected Hall', 'Thunderstorm alert issued by KSNDMC for Mandya taluk between 16:00 and 19:30 hrs.')
ON CONFLICT (id) DO NOTHING;
