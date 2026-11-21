-- VillageVerse AI: Realistic Karnataka Gram Panchayat Seed Data
-- Shivalli Gram Panchayat, Mandya Taluk & District, Karnataka 571405

-- 1. Village Profile
INSERT INTO village_profile (id, name, taluk, district, state, pincode, latitude, longitude, population, households, area_sq_km, health_score)
VALUES ('GP-KA-MND-042', 'Shivalli Gram Panchayat', 'Mandya', 'Mandya', 'Karnataka', '571405', 12.562300, 76.892100, 4820, 1140, 14.80, 86)
ON CONFLICT (id) DO NOTHING;

-- 2. Digital Twin Assets (Karnataka Geo-Coordinates & Real Infrastructure)
INSERT INTO digital_twin_assets (id, name, category, status, health_score, latitude, longitude, elevation, install_date, last_inspected, capacity, ai_recommendation, specifications)
VALUES
('AST-001', 'Gram Panchayat Administrative Bhavan', 'Building', 'Operational', 94, 12.562500, 76.892200, 672.0, '2016-04-12', '2026-10-15', '12 Offices & Hall', 'Install additional 5kW rooftop solar panels for zero-grid dependency.', '{"floors": 2, "builtArea": "6200 sqft", "generator": "15 kVA Diesel Backup"}'),
('AST-002', 'Shivalli Overhead Water Reservoir 1 (Main)', 'Water Tank', 'Operational', 88, 12.564100, 76.893400, 690.0, '2018-08-20', '2026-11-02', '150,000 Liters', 'Acoustic inspection detects minor valve sedimentation at outlet #2.', '{"height": "18 meters", "pumpPower": "12.5 HP", "sensor": "Ultrasonic Level"}'),
('AST-003', 'Shivalli Kere (Main Village Lake)', 'Lake', 'Operational', 82, 12.560100, 76.888500, 665.0, '1998-01-01', '2026-11-10', '1.8 Million Cu.M', 'Silt clearance recommended along West canal embankment prior to monsoon.', '{"perimeter": "2.4 km", "bundStatus": "Reinforced Stone", "biodiversityScore": 88}'),
('AST-004', 'Deep Solar Borewell No. 4 - Ward 3', 'Borewell', 'Needs Maintenance', 64, 12.566200, 76.895100, 674.0, '2021-02-18', '2026-11-12', '450 LPM', 'Submersible pump motor shows bearing thermal anomaly; service within 7 days.', '{"depth": "480 feet", "solarPanels": "6 x 330W", "controller": "MPPT Smart"}'),
('AST-005', 'Shivalli Primary Health Centre (PHC)', 'Hospital', 'Operational', 91, 12.561800, 76.894200, 671.0, '2014-06-05', '2026-11-18', '12 Beds, 1 Labor Room', 'Ready for Tele-ICU terminal integration under Ayushman Bharat digital push.', '{"doctors": 2, "nurses": 4, "coldChainRefrigerator": "Solar powered WHO certified"}'),
('AST-006', 'Government Higher Primary School (GHPS)', 'School', 'Operational', 89, 12.563800, 76.890700, 670.0, '2005-09-10', '2026-10-28', '340 Students', 'Smart TV classroom unit 2 requires firmware update.', '{"rooms": 8, "smartLabs": 2, "middayKitchen": "LPG & Biogas equipped"}'),
('AST-007', 'Ward 2 Anganwadi Child Care Centre', 'Anganwadi', 'Operational', 95, 12.565400, 76.891800, 671.5, '2019-11-20', '2026-11-14', '45 Toddlers', 'Maintain nutritional supplement buffer stocks for winter cycle.', '{"weightMonitor": "Digital", "drinkingWater": "RO 50 LPH"}'),
('AST-008', 'Mandya-Shivalli Main Link Road (SH-17 Connect)', 'Road', 'Operational', 79, 12.563000, 76.891000, 670.0, '2022-03-15', '2026-11-05', '4.2 km Bituminous', 'Pothole clustering detected near K.M. 2.4; patch scheduling suggested.', '{"width": "5.5 meters", "drainage": "Concrete roadside gutters"}'),
('AST-009', 'Ward 1 & 4 LED Smart Streetlight Cluster', 'Street Light', 'Operational', 92, 12.563300, 76.892900, 672.0, '2023-01-10', '2026-11-19', '68 Poles (IoT Dimming)', 'Dimming schedule saving 38% energy; 2 bulbs replaced this month.', '{"lumens": "4800 lm each", "communication": "LoRaWAN Gateway Node"}'),
('AST-010', 'Shivalli Community Solar Microgrid Plant', 'Solar Panel', 'Operational', 96, 12.567000, 76.889000, 675.0, '2023-05-18', '2026-11-15', '120 kWp Capacity', 'Dust deposit detected on string 4; automated dry wiper cycle recommended.', '{"inverters": "2 x 60kW Sungrow", "batteryBank": "80 kWh LiFePO4"}')
ON CONFLICT (id) DO NOTHING;

-- 3. Farmlands (Karnataka Mandya Sugarcane, Ragi, Paddy belt)
INSERT INTO farmlands (id, farmer_name, survey_no, crop_type, area_acres, soil_type, soil_moisture_pct, soil_ph, nitrogen_level, phosphorus_level, potassium_level, irrigation_source, predicted_yield_quintals, disease_status, latitude, longitude)
VALUES
('FARM-01', 'Basavaraju Gowda', 'SY-142/1', 'Sugarcane (Co 86032)', 4.5, 'Red Sandy Loam', 62.4, 6.8, 180, 24, 210, 'Canal & Drip', 380.0, 'Healthy', 12.5678, 76.8862),
('FARM-02', 'Ningamma Kumar', 'SY-156/3', 'Ragi (Finger Millet - GPU 28)', 3.0, 'Red Sandy Loam', 44.1, 6.5, 140, 19, 190, 'Rainfed + Borewell', 28.5, 'Healthy', 12.5691, 76.8880),
('FARM-03', 'Chandrashekar S.', 'SY-188/2', 'Paddy (Jyothi Variety)', 5.2, 'Clayey Alluvial', 78.2, 7.1, 210, 32, 230, 'Shivalli Lake Canal', 115.0, 'Mild Leaf Blast Suspected', 12.5590, 76.8845),
('FARM-04', 'Maheshwarappa K.', 'SY-204/1', 'Banana (Grand Naine)', 2.8, 'Loamy Red', 68.0, 6.7, 195, 28, 260, 'Drip Irrigation', 210.0, 'Healthy', 12.5575, 76.8898),
('FARM-05', 'Sunithamma H.', 'SY-94/2', 'Mulberry (V1 Silkworm)', 2.0, 'Red Loam', 55.6, 6.6, 160, 22, 180, 'Sprinkler System', 45.0, 'Healthy', 12.5650, 76.8820)
ON CONFLICT (id) DO NOTHING;

-- 4. Water Resources
INSERT INTO water_resources (id, name, type, capacity_liters, current_level_pct, flow_rate_lpm, tds_ppm, ph_level, turbidity_ntu, leak_detected, leak_location, latitude, longitude, status)
VALUES
('WAT-01', 'Main Overhead Tank - Ward 1', 'Overhead Tank', 150000, 84.5, 420.0, 240, 7.2, 1.2, FALSE, NULL, 12.5641, 76.8934, 'Optimal'),
('WAT-02', 'Kere Pipeline Main Feeder', 'Distribution Pipeline', 80000, 72.0, 310.0, 265, 7.4, 2.1, TRUE, 'Near Cross Road 4 culvert', 12.5620, 76.8912, 'Leak Alert'),
('WAT-03', 'Community Solar Borewell #2', 'Borewell', 45000, 91.0, 180.0, 290, 7.0, 0.8, FALSE, NULL, 12.5662, 76.8951, 'Optimal'),
('WAT-04', 'Shivalli Natural Lake Basin', 'Lake', 1800000000, 88.0, 1400.0, 185, 7.5, 3.4, FALSE, NULL, 12.5601, 76.8885, 'Optimal'),
('WAT-05', 'Purified RO Water ATM - Bus Stand', 'Water ATM', 5000, 65.0, 45.0, 85, 6.9, 0.2, FALSE, NULL, 12.5628, 76.8925, 'Optimal')
ON CONFLICT (id) DO NOTHING;

-- 5. Complaints
INSERT INTO complaints (id, citizen_name, citizen_phone, category, priority, title, description, location_address, latitude, longitude, status, assigned_officer, assigned_department, ai_category_confidence, ai_urgency_score)
VALUES
('CMP-2026-081', 'Manjunatha K.', '9845123410', 'Water Supply', 'Urgent', 'Low water pressure and intermittent supply in Ward 3', 'Drinking water supply has dropped significantly for past 2 days. Motors are running dry during scheduled morning hours.', 'Cross 3, Opposite Vinayaka Temple, Ward 3', 12.5658, 76.8945, 'In Progress', 'Suresh Kumar (AE Water)', 'Rural Water Supply & Sanitation', 96.5, 88),
('CMP-2026-082', 'Devika M.', '9741289055', 'Road Damage', 'High', 'Dangerous pothole formed after heavy pre-monsoon showers', 'A large 2-foot diameter deep pothole has appeared near the dairy society bend. Two two-wheelers skidded yesterday evening.', 'Dairy Cooperative Road, Ward 2', 12.5635, 76.8905, 'Assigned', 'Anand Rao (Panchayat Engineer)', 'Public Works & Roads', 98.2, 76),
('CMP-2026-083', 'Prakash H.R.', '9448109823', 'Electricity / Streetlight', 'Medium', 'Streetlight flickering and 3 poles dark near Government School', 'The LED streetlights on the GHPS approach road are tripping every 10 minutes, causing safety issues for evening pedestrians.', 'School Road, Ward 1', 12.5638, 76.8907, 'Submitted', 'Kavitha S. (BESCOM Junior Eng)', 'Energy & Street Lighting', 94.0, 58),
('CMP-2026-084', 'Rameshappa', '9900341872', 'Garbage & Sanitation', 'Medium', 'Commercial waste accumulation near weekly Sunday Haat ground', 'Plastic covers and vegetable debris have not been lifted since Sunday evening. Stray animals are scattering the waste.', 'Old Shandy Ground, Near Bus Stop', 12.5624, 76.8928, 'Resolved', 'Mallikarjun (Sanitation Supervisor)', 'Solid Waste Management', 95.8, 42)
ON CONFLICT (id) DO NOTHING;

-- 6. Disaster Monitoring
INSERT INTO disaster_monitoring (id, hazard_type, threat_level, risk_percentage, affected_wards, evacuation_shelter_id, shelter_capacity, shelter_name, alert_message)
VALUES
('DIS-01', 'Flood', 'Advisory', 32, 'Ward 4 (Low-lying Lake bund area)', 'AST-006', 450, 'GHPS Primary School Cyclone Shelter', 'Cauvery basin catchment inflows monitored; reservoir levels safe at 82% capacity.'),
('DIS-02', 'Heatwave', 'Safe', 14, 'All Wards', 'AST-001', 300, 'Gram Panchayat Bhavan Air-Cooled Hall', 'Max temp projected at 32.5°C; comfortable humidity range.'),
('DIS-03', 'Drought', 'Safe', 18, 'Ward 5 Agricultural belt', 'AST-003', 0, 'Shivalli Kere Catchment Tank', 'Groundwater table replenished up to 48 feet below ground level due to watershed works.'),
('DIS-04', 'Lightning', 'Warning', 65, 'Open Farmlands Survey 120-210', 'AST-005', 100, 'PHC Lightning Arrestor Protected Hall', 'Thunderstorm alert issued by KSNDMC for Mandya taluk between 16:00 and 19:30 hrs.')
ON CONFLICT (id) DO NOTHING;
