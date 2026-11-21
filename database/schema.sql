-- VillageVerse AI: Database Schema (PostgreSQL / Supabase)
-- Target: Government-grade Digital Twin for Intelligent Village Development
-- Reference Gram Panchayat: Shivalli Gram Panchayat, Mandya District, Karnataka

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users & Authentication
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('Admin', 'Panchayat Officer', 'Engineer', 'Agriculture Officer', 'Healthcare Officer', 'Citizen')),
    department VARCHAR(100),
    panchayat_id VARCHAR(50) DEFAULT 'GP-KA-MND-042',
    is_verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Village Profile
CREATE TABLE IF NOT EXISTS village_profile (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    taluk VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    latitude DECIMAL(9, 6) NOT NULL,
    longitude DECIMAL(9, 6) NOT NULL,
    population INT NOT NULL,
    households INT NOT NULL,
    area_sq_km DECIMAL(6, 2) NOT NULL,
    health_score INT NOT NULL DEFAULT 84,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Digital Twin Assets
CREATE TABLE IF NOT EXISTS digital_twin_assets (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('Building', 'Water Tank', 'Borewell', 'Lake', 'Road', 'Street Light', 'Solar Panel', 'School', 'Hospital', 'Anganwadi', 'Pipeline', 'Electric Pole', 'Dumpyard')),
    status VARCHAR(30) NOT NULL CHECK (status IN ('Operational', 'Needs Maintenance', 'Critical', 'Under Construction')),
    health_score INT NOT NULL,
    latitude DECIMAL(9, 6) NOT NULL,
    longitude DECIMAL(9, 6) NOT NULL,
    elevation DECIMAL(6, 2),
    install_date DATE,
    last_inspected DATE,
    capacity VARCHAR(100),
    ai_recommendation TEXT,
    specifications JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Agriculture & Crops
CREATE TABLE IF NOT EXISTS farmlands (
    id VARCHAR(50) PRIMARY KEY,
    farmer_name VARCHAR(120) NOT NULL,
    survey_no VARCHAR(50) NOT NULL,
    crop_type VARCHAR(80) NOT NULL,
    area_acres DECIMAL(6, 2) NOT NULL,
    soil_type VARCHAR(50) NOT NULL,
    soil_moisture_pct DECIMAL(5, 2) NOT NULL,
    soil_ph DECIMAL(4, 2) NOT NULL,
    nitrogen_level INT,
    phosphorus_level INT,
    potassium_level INT,
    irrigation_source VARCHAR(60),
    predicted_yield_quintals DECIMAL(8, 2),
    disease_status VARCHAR(50) DEFAULT 'Healthy',
    latitude DECIMAL(9, 6),
    longitude DECIMAL(9, 6),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Water Resources & IoT telemetry
CREATE TABLE IF NOT EXISTS water_resources (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    type VARCHAR(50) CHECK (type IN ('Overhead Tank', 'Lake', 'Borewell', 'Distribution Pipeline', 'Water ATM')),
    capacity_liters BIGINT NOT NULL,
    current_level_pct DECIMAL(5, 2) NOT NULL,
    flow_rate_lpm DECIMAL(7, 2),
    tds_ppm INT,
    ph_level DECIMAL(4, 2),
    turbidity_ntu DECIMAL(5, 2),
    leak_detected BOOLEAN DEFAULT FALSE,
    leak_location VARCHAR(120),
    latitude DECIMAL(9, 6),
    longitude DECIMAL(9, 6),
    status VARCHAR(30) DEFAULT 'Normal',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Roads & Transportation
CREATE TABLE IF NOT EXISTS roads (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    type VARCHAR(50) CHECK (type IN ('Asphalt', 'Concrete', 'WBM / Gravel', 'Mud Road')),
    length_km DECIMAL(6, 2) NOT NULL,
    width_m DECIMAL(4, 2) NOT NULL,
    pci_score INT NOT NULL, -- Pavement Condition Index (0-100)
    potholes_count INT DEFAULT 0,
    traffic_density VARCHAR(30) CHECK (traffic_density IN ('Low', 'Medium', 'High')),
    last_repaired DATE,
    scheduled_repair DATE,
    estimated_cost_inr DECIMAL(12, 2),
    status VARCHAR(40) NOT NULL
);

-- 7. Electricity & Clean Energy
CREATE TABLE IF NOT EXISTS electricity_grid (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    type VARCHAR(50) CHECK (type IN ('Transformer', 'Solar Plant', 'Feeder Line', 'Smart Streetlight Group')),
    rating_kva INT,
    current_load_pct DECIMAL(5, 2) NOT NULL,
    daily_consumption_kwh DECIMAL(10, 2),
    solar_generation_kwh DECIMAL(10, 2) DEFAULT 0,
    outage_risk VARCHAR(30) CHECK (outage_risk IN ('Low', 'Moderate', 'High', 'Critical')),
    active_outage BOOLEAN DEFAULT FALSE,
    voltage_v INT DEFAULT 230,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Healthcare Infrastructure
CREATE TABLE IF NOT EXISTS healthcare_records (
    id VARCHAR(50) PRIMARY KEY,
    facility_name VARCHAR(120) NOT NULL,
    type VARCHAR(50) CHECK (type IN ('Primary Health Centre', 'Community Clinic', 'Sub-Centre', 'Ayush Dispensary')),
    doctor_count INT NOT NULL,
    nurse_count INT NOT NULL,
    bed_count INT NOT NULL,
    occupied_beds INT NOT NULL,
    ambulances_available INT NOT NULL,
    essential_medicine_pct INT NOT NULL,
    active_epidemic_watch VARCHAR(100),
    emergency_contact VARCHAR(20),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Education Facilities
CREATE TABLE IF NOT EXISTS education_institutions (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(50) CHECK (category IN ('Government Primary School', 'Government High School', 'Anganwadi Centre', 'PU College')),
    students_enrolled INT NOT NULL,
    attendance_rate_pct DECIMAL(5, 2) NOT NULL,
    teachers_count INT NOT NULL,
    smart_classrooms INT DEFAULT 0,
    midday_meal_status VARCHAR(40) DEFAULT 'Supplied & Verified',
    drinking_water_facility BOOLEAN DEFAULT TRUE,
    toilets_functional BOOLEAN DEFAULT TRUE,
    literacy_rate_village DECIMAL(5, 2) DEFAULT 78.4
);

-- 10. Waste Management
CREATE TABLE IF NOT EXISTS waste_nodes (
    id VARCHAR(50) PRIMARY KEY,
    label VARCHAR(100) NOT NULL,
    type VARCHAR(40) CHECK (type IN ('Smart Bin Wet', 'Smart Bin Dry', 'Collection Vehicle', 'Compost Yard', 'Segregation Unit')),
    fill_level_pct DECIMAL(5, 2),
    last_collected TIMESTAMP WITH TIME ZONE,
    route_status VARCHAR(50),
    vehicle_driver VARCHAR(100),
    vehicle_gps VARCHAR(50),
    status VARCHAR(30) DEFAULT 'Normal'
);

-- 11. Environment & AQI Sensors
CREATE TABLE IF NOT EXISTS environmental_sensors (
    id VARCHAR(50) PRIMARY KEY,
    location_name VARCHAR(100) NOT NULL,
    aqi INT NOT NULL,
    pm25 DECIMAL(6, 2) NOT NULL,
    pm10 DECIMAL(6, 2) NOT NULL,
    temperature_c DECIMAL(4, 2) NOT NULL,
    humidity_pct DECIMAL(5, 2) NOT NULL,
    rainfall_mm DECIMAL(6, 2) NOT NULL,
    carbon_emissions_mt DECIMAL(8, 2),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. Disaster Warning & Shelters
CREATE TABLE IF NOT EXISTS disaster_monitoring (
    id VARCHAR(50) PRIMARY KEY,
    hazard_type VARCHAR(50) CHECK (hazard_type IN ('Flood', 'Heatwave', 'Drought', 'Cyclone', 'Lightning')),
    threat_level VARCHAR(30) CHECK (threat_level IN ('Safe', 'Advisory', 'Warning', 'Severe Alert')),
    risk_percentage INT NOT NULL,
    affected_wards VARCHAR(150),
    evacuation_shelter_id VARCHAR(50),
    shelter_capacity INT,
    shelter_name VARCHAR(150),
    alert_message TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 13. Complaints & Grievance Redressal
CREATE TABLE IF NOT EXISTS complaints (
    id VARCHAR(50) PRIMARY KEY,
    citizen_name VARCHAR(120) NOT NULL,
    citizen_phone VARCHAR(20) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('Water Supply', 'Road Damage', 'Electricity / Streetlight', 'Garbage & Sanitation', 'Drainage / Sewage', 'Healthcare / PHC', 'Agriculture')),
    priority VARCHAR(20) NOT NULL CHECK (priority IN ('Low', 'Medium', 'High', 'Urgent')),
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    location_address VARCHAR(200) NOT NULL,
    latitude DECIMAL(9, 6),
    longitude DECIMAL(9, 6),
    image_url VARCHAR(300),
    audio_url VARCHAR(300),
    status VARCHAR(30) NOT NULL DEFAULT 'Submitted' CHECK (status IN ('Submitted', 'Assigned', 'In Progress', 'Resolved', 'Rejected')),
    assigned_officer VARCHAR(120),
    assigned_department VARCHAR(100),
    ai_category_confidence DECIMAL(5, 2),
    ai_urgency_score INT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- 14. Development Planner Projects
CREATE TABLE IF NOT EXISTS development_projects (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    department VARCHAR(80) NOT NULL,
    estimated_cost_inr DECIMAL(14, 2) NOT NULL,
    allocated_budget_inr DECIMAL(14, 2) NOT NULL,
    roi_score DECIMAL(5, 2) NOT NULL,
    impact_score INT NOT NULL,
    priority_level VARCHAR(20) CHECK (priority_level IN ('Critical', 'High', 'Medium', 'Low')),
    status VARCHAR(40) CHECK (status IN ('Proposed', 'Approved', 'Tendering', 'In Execution', 'Completed')),
    start_date DATE,
    completion_target DATE,
    beneficiaries_count INT
);

-- 15. Activity & Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_name VARCHAR(120) NOT NULL,
    role VARCHAR(50) NOT NULL,
    action VARCHAR(100) NOT NULL,
    module VARCHAR(60) NOT NULL,
    details TEXT,
    ip_address VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
