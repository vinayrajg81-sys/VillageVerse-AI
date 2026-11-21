// VillageVerse AI: Frontend Realistic Sample Data (Shivalli Gram Panchayat, Mandya, Karnataka)
import { 
  VillageProfile, DigitalTwinAsset, CropInfo, SoilSensor, MandiPrice,
  WaterResourceItem, LeakAlert, ScheduledRepair, TransformerNode, SolarUnit,
  AmbulanceInfo, MedicineItem, SchoolInfo, SmartBin, WasteVehicle,
  DisasterRisk, SafeShelter, PlannerProject, Complaint, User
} from '../types';

export const mockVillageProfile: VillageProfile = {
  id: 'GP-KA-MND-042',
  name: 'Shivalli Gram Panchayat',
  taluk: 'Mandya',
  district: 'Mandya',
  state: 'Karnataka',
  pincode: '571405',
  latitude: 12.5623,
  longitude: 76.8921,
  population: 4820,
  households: 1140,
  area_sq_km: 14.8,
  health_score: 86,
  agriculture_score: 88,
  water_score: 84,
  electricity_score: 91,
  carbon_score: 79,
  flood_risk: 'Low (18%)',
  weather: {
    temp: 29.4,
    condition: 'Partly Cloudy',
    humidity: 58,
    wind_kmh: 12,
    rainfall_mm: 1.2,
    aqi: 42,
    aqi_status: 'Good'
  }
};

export const mockAssets: DigitalTwinAsset[] = [
  {
    id: 'AST-001',
    name: 'Gram Panchayat Administrative Bhavan',
    category: 'Building',
    status: 'Operational',
    health_score: 94,
    latitude: 12.5625,
    longitude: 76.8922,
    position3D: { x: 0, y: 0.8, z: 0 },
    size: [3, 1.6, 2.5],
    color: '#3b82f6',
    install_date: '2016-04-12',
    last_inspected: '2026-10-15',
    capacity: '12 Offices & Gram Sabha Hall',
    ai_recommendation: 'Install additional 5kW rooftop solar panels for zero-grid dependency.',
    specifications: { floors: 2, builtArea: '6,200 sqft', generator: '15 kVA Diesel Backup' },
    maintenance_history: [
      { date: '2026-08-10', action: 'Roof waterproofing & paint renewal', cost: 45000 },
      { date: '2026-03-22', action: 'Broadband optical fiber link upgraded to 1 Gbps', cost: 12000 }
    ]
  },
  {
    id: 'AST-002',
    name: 'Shivalli Overhead Water Reservoir 1 (Main)',
    category: 'Water Tank',
    status: 'Operational',
    health_score: 88,
    latitude: 12.5641,
    longitude: 76.8934,
    position3D: { x: 4.5, y: 2.2, z: -3 },
    size: [1.8, 4.4, 1.8],
    color: '#06b6d4',
    install_date: '2018-08-20',
    last_inspected: '2026-11-02',
    capacity: '150,000 Liters',
    ai_recommendation: 'Acoustic inspection detects minor valve sedimentation at outlet #2.',
    specifications: { height: '18 meters', pumpPower: '12.5 HP', sensor: 'Ultrasonic IoT Level Gauge' },
    maintenance_history: [
      { date: '2026-09-14', action: 'Chlorination tank sanitization and sensor recalibration', cost: 8500 }
    ]
  },
  {
    id: 'AST-003',
    name: 'Shivalli Kere (Main Village Lake)',
    category: 'Lake',
    status: 'Operational',
    health_score: 82,
    latitude: 12.5601,
    longitude: 76.8885,
    position3D: { x: -6, y: 0.1, z: 4.5 },
    size: [7, 0.2, 5],
    color: '#0284c7',
    install_date: '1998-01-01',
    last_inspected: '2026-11-10',
    capacity: '1.8 Million Cu.M Storage',
    ai_recommendation: 'Silt clearance recommended along West canal embankment prior to pre-monsoon showers.',
    specifications: { perimeter: '2.4 km', bundStatus: 'Reinforced Stone Bund', biodiversityScore: 88 },
    maintenance_history: [
      { date: '2026-05-18', action: 'Desilting under MGNREGA rejuvenation program', cost: 240000 }
    ]
  },
  {
    id: 'AST-004',
    name: 'Deep Solar Borewell No. 4 - Ward 3',
    category: 'Borewell',
    status: 'Needs Maintenance',
    health_score: 64,
    latitude: 12.5662,
    longitude: 76.8951,
    position3D: { x: 6.2, y: 0.6, z: 2 },
    size: [0.8, 1.2, 0.8],
    color: '#f59e0b',
    install_date: '2021-02-18',
    last_inspected: '2026-11-12',
    capacity: '450 Liters/Minute',
    ai_recommendation: 'Submersible pump motor shows bearing thermal anomaly; service within 7 days.',
    specifications: { depth: '480 feet', solarPanels: '6 x 330W Monocrystalline', controller: 'MPPT Smart' },
    maintenance_history: [
      { date: '2026-04-10', action: 'Motor rewind & riser pipe replacement', cost: 18500 }
    ]
  },
  {
    id: 'AST-005',
    name: 'Shivalli Primary Health Centre (PHC)',
    category: 'Hospital',
    status: 'Operational',
    health_score: 91,
    latitude: 12.5618,
    longitude: 76.8942,
    position3D: { x: 3.2, y: 1.0, z: 3.5 },
    size: [3.4, 2.0, 2.8],
    color: '#10b981',
    install_date: '2014-06-05',
    last_inspected: '2026-11-18',
    capacity: '12 Beds, 1 Labor Room, Minor OT',
    ai_recommendation: 'Ready for Tele-ICU terminal integration under Ayushman Bharat digital push.',
    specifications: { doctors: 2, nurses: 4, coldChainRefrigerator: 'Solar powered WHO certified' },
    maintenance_history: [
      { date: '2026-10-04', action: 'Solar cold-chain vaccine inverter serviced', cost: 6500 }
    ]
  },
  {
    id: 'AST-006',
    name: 'Government Higher Primary School (GHPS)',
    category: 'School',
    status: 'Operational',
    health_score: 89,
    latitude: 12.5638,
    longitude: 76.8907,
    position3D: { x: -3.5, y: 1.1, z: -2.8 },
    size: [4.2, 2.2, 2.6],
    color: '#8b5cf6',
    install_date: '2005-09-10',
    last_inspected: '2026-10-28',
    capacity: '340 Students Enrolled',
    ai_recommendation: 'Smart TV classroom unit 2 requires firmware update.',
    specifications: { classrooms: 8, smartLabs: 2, middayKitchen: 'Biogas & LPG Hybrid' },
    maintenance_history: [
      { date: '2026-07-15', action: 'Classroom whitewash & RO water filter membrane replacement', cost: 32000 }
    ]
  },
  {
    id: 'AST-007',
    name: 'Ward 2 Anganwadi Child Care Centre',
    category: 'Anganwadi',
    status: 'Operational',
    health_score: 95,
    latitude: 12.5654,
    longitude: 76.8918,
    position3D: { x: -1.2, y: 0.6, z: -4.5 },
    size: [2.0, 1.2, 1.8],
    color: '#ec4899',
    install_date: '2019-11-20',
    last_inspected: '2026-11-14',
    capacity: '45 Toddlers & Lactating Mothers',
    ai_recommendation: 'Maintain nutritional supplement buffer stocks for winter cycle.',
    specifications: { weightMonitor: 'Digital Bluetooth Scale', drinkingWater: 'RO 50 LPH' },
    maintenance_history: [
      { date: '2026-08-30', action: 'Sanitation inspection and toy disinfection', cost: 3000 }
    ]
  },
  {
    id: 'AST-008',
    name: 'Mandya-Shivalli Main Link Road (SH-17 Connect)',
    category: 'Road',
    status: 'Operational',
    health_score: 79,
    latitude: 12.563,
    longitude: 76.891,
    position3D: { x: 0, y: 0.05, z: 0 },
    size: [14, 0.1, 0.8],
    color: '#64748b',
    install_date: '2022-03-15',
    last_inspected: '2026-11-05',
    capacity: '4.2 km Bituminous Highway',
    ai_recommendation: 'Pothole clustering detected near K.M. 2.4; patch scheduling suggested.',
    specifications: { width: '5.5 meters', drainage: 'Reinforced concrete roadside gutters' },
    maintenance_history: [
      { date: '2026-06-20', action: 'Micro-surfacing seal coat on K.M. 0 to 1.5', cost: 180000 }
    ]
  },
  {
    id: 'AST-009',
    name: 'Ward 1 & 4 LED Smart Streetlight Cluster',
    category: 'Street Light',
    status: 'Operational',
    health_score: 92,
    latitude: 12.5633,
    longitude: 76.8929,
    position3D: { x: 1.5, y: 1.2, z: 0.5 },
    size: [0.3, 2.4, 0.3],
    color: '#eab308',
    install_date: '2023-01-10',
    last_inspected: '2026-11-19',
    capacity: '68 Poles (IoT Ambient Dimming)',
    ai_recommendation: 'Dimming schedule saving 38% energy; 2 bulbs replaced this month.',
    specifications: { lumens: '4,800 lm each', protocol: 'LoRaWAN Gateway Node' },
    maintenance_history: [
      { date: '2026-11-01', action: 'Replaced 2 LED driver units under 5-year warranty', cost: 0 }
    ]
  },
  {
    id: 'AST-010',
    name: 'Shivalli Community Solar Microgrid Plant',
    category: 'Solar Panel',
    status: 'Operational',
    health_score: 96,
    latitude: 12.567,
    longitude: 76.889,
    position3D: { x: -4.8, y: 0.5, z: 1.8 },
    size: [3.8, 0.4, 2.4],
    color: '#14b8a6',
    install_date: '2023-05-18',
    last_inspected: '2026-11-15',
    capacity: '120 kWp Capacity',
    ai_recommendation: 'Dust deposit detected on string 4; automated dry wiper cycle recommended.',
    specifications: { inverters: '2 x 60kW Sungrow', batteryBank: '80 kWh LiFePO4' },
    maintenance_history: [
      { date: '2026-10-12', action: 'Quarterly pyranometer calibration and thermal scan', cost: 12000 }
    ]
  }
];

export const mockCrops: CropInfo[] = [
  { name: 'Sugarcane (Co 86032)', area_acres: 840, share_pct: 45.6, avg_yield_tonnes: 95, health: 'Optimal' },
  { name: 'Paddy (Jyothi Variety)', area_acres: 420, share_pct: 22.8, avg_yield_tonnes: 28, health: 'Good' },
  { name: 'Ragi (Finger Millet - GPU 28)', area_acres: 310, share_pct: 16.8, avg_yield_tonnes: 14, health: 'Optimal' },
  { name: 'Banana (Grand Naine)', area_acres: 150, share_pct: 8.2, avg_yield_tonnes: 32, health: 'Good' },
  { name: 'Mulberry (Sericulture V1)', area_acres: 120, share_pct: 6.5, avg_yield_tonnes: 18, health: 'Optimal' }
];

export const mockSoilSensors: SoilSensor[] = [
  { id: 'SEN-S1', sector: 'North Sugarcane Block', moisture_pct: 64, ph: 6.8, n: 190, p: 26, k: 215, temp_c: 27.2 },
  { id: 'SEN-S2', sector: 'East Paddy Fields', moisture_pct: 78, ph: 7.1, n: 210, p: 31, k: 235, temp_c: 26.5 },
  { id: 'SEN-S3', sector: 'South Ragi & Millets', moisture_pct: 46, ph: 6.5, n: 145, p: 20, k: 180, temp_c: 28.1 },
  { id: 'SEN-S4', sector: 'Horticulture & Mulberry', moisture_pct: 55, ph: 6.7, n: 175, p: 24, k: 200, temp_c: 27.8 }
];

export const mockMandiPrices: MandiPrice[] = [
  { commodity: 'Sugarcane (FRP Mill Gate)', market: 'Mandya Sugars APMC', price: '₹3,150 / Tonne', trend: '+4.2%' },
  { commodity: 'Paddy (Jyothi Grade A)', market: 'Mysuru Bandipalya APMC', price: '₹2,380 / Quintal', trend: '+1.8%' },
  { commodity: 'Ragi (Finger Millet)', market: 'Mandya APMC Yard', price: '₹4,120 / Quintal', trend: '+5.1%' },
  { commodity: 'Silk Cocoon (Bivoltine)', market: 'Ramanagara Silk Market', price: '₹680 / Kg', trend: '+8.3%' },
  { commodity: 'Banana (Yellaki)', market: 'Maddur Fruit Mandi', price: '₹38 / Kg', trend: '-2.1%' }
];

export const mockWaterSources: WaterResourceItem[] = [
  { name: 'Shivalli Overhead Tank 1', type: 'Overhead Reservoir', level_pct: 86, status: 'Normal' },
  { name: 'Shivalli Overhead Tank 2', type: 'Overhead Reservoir', level_pct: 78, status: 'Normal' },
  { name: 'Shivalli Kere Catchment', type: 'Surface Lake', level_pct: 91, status: 'Full & Stable' },
  { name: 'Borewell Grid (6 Wells)', type: 'Groundwater Network', level_pct: 72, status: 'Active Pumping' }
];

export const mockLeakAlerts: LeakAlert[] = [
  { id: 'LK-01', location: 'Ward 2 Cross 4 culvert', flow_variance_pct: 14.2, severity: 'Medium', detected_at: '2026-11-21 08:30' }
];

export const mockScheduledRepairs: ScheduledRepair[] = [
  { id: 'RD-01', road: 'Mandya Link Highway (SH-17 Connect)', stretch: 'KM 1.8 to 2.4', damage: 'Pothole clustering', cost: 185000, date: '2026-12-05', priority: 'High' },
  { id: 'RD-02', road: 'Kere Lake Embankment Ring Road', stretch: 'KM 0.4 to 0.9', damage: 'Edge raveling & shoulder erosion', cost: 120000, date: '2026-12-14', priority: 'Medium' },
  { id: 'RD-03', road: 'Ward 4 Temple Cross Road', stretch: 'Full stretch (600m)', damage: 'Gravel loss, requires concrete paving', cost: 420000, date: '2027-01-10', priority: 'Medium' }
];

export const mockTransformers: TransformerNode[] = [
  { id: 'TR-01', name: 'Village Central Transformer', rating: '100 kVA', load_pct: 68, health_pct: 92, temp_c: 48 },
  { id: 'TR-02', name: 'Agriculture Feeder 1 (North)', rating: '100 kVA', load_pct: 74, health_pct: 88, temp_c: 52 },
  { id: 'TR-03', name: 'Agriculture Feeder 2 (South)', rating: '100 kVA', load_pct: 62, health_pct: 95, temp_c: 44 },
  { id: 'TR-04', name: 'PHC & School Essential Feeder', rating: '63 kVA', load_pct: 42, health_pct: 98, temp_c: 39 }
];

export const mockSolarUnits: SolarUnit[] = [
  { name: 'Community Solar Microgrid', capacity_kw: 120, today_yield_kwh: 640 },
  { name: 'Gram Panchayat Bhavan Rooftop', capacity_kw: 15, today_yield_kwh: 78 },
  { name: 'PHC Cold Chain Solar Plant', capacity_kw: 10, today_yield_kwh: 52 },
  { name: 'GHPS Smart School Solar Unit', capacity_kw: 8, today_yield_kwh: 41 }
];

export const mockAmbulances: AmbulanceInfo[] = [
  { id: 'AMB-01', vehicle: '108 Emergency Ambulance', status: 'Available at PHC', lat: 12.5618, lng: 76.8942, driver: 'Kiran Gowda (9845012399)' },
  { id: 'AMB-02', vehicle: 'Naguvina Ratha (Maternity Van)', status: 'En-route Mandya District Hospital', lat: 12.5510, lng: 76.8790, driver: 'Raju M. (9900887711)' }
];

export const mockMedicines: MedicineItem[] = [
  { medicine: 'Paracetamol 500mg', stock_units: 4200, status: 'Sufficient' },
  { medicine: 'Amoxicillin 250mg', stock_units: 1800, status: 'Sufficient' },
  { medicine: 'Oral Rehydration Salts (ORS)', stock_units: 950, status: 'Sufficient' },
  { medicine: 'Insulin (Human Mixtard)', stock_units: 85, status: 'Re-order needed' },
  { medicine: 'Anti-Rabies Vaccine', stock_units: 45, status: 'Sufficient' }
];

export const mockSchools: SchoolInfo[] = [
  { name: 'Government Higher Primary School (GHPS)', type: 'Primary & Middle (1-8)', students: 340, teachers: 11, smart_classrooms: 2, pass_pct: 96.5 },
  { name: 'Shivalli Rural High School (GHS)', type: 'High School (9-10)', students: 165, teachers: 8, smart_classrooms: 1, pass_pct: 94.2 },
  { name: 'Anganwadi Ward 1', type: 'Early Childhood Care', students: 38, teachers: 2, smart_classrooms: 0, pass_pct: 100 },
  { name: 'Anganwadi Ward 2', type: 'Early Childhood Care', students: 37, teachers: 2, smart_classrooms: 0, pass_pct: 100 }
];

export const mockSmartBins: SmartBin[] = [
  { id: 'BIN-01', location: 'Gram Panchayat Junction', type: 'Wet Waste', fill_pct: 42, status: 'Normal' },
  { id: 'BIN-02', location: 'Gram Panchayat Junction', type: 'Dry Waste', fill_pct: 68, status: 'Normal' },
  { id: 'BIN-03', location: 'Bus Stand & Shandy Bazaar', type: 'Wet Waste', fill_pct: 84, status: 'Collection Due' },
  { id: 'BIN-04', location: 'Bus Stand & Shandy Bazaar', type: 'Dry Waste', fill_pct: 76, status: 'Normal' },
  { id: 'BIN-05', location: 'Temple Road Ward 3', type: 'Wet Waste', fill_pct: 35, status: 'Normal' }
];

export const mockWasteVehicles: WasteVehicle[] = [
  { id: 'EV-VAN-01', name: 'Swachh Vahini EV Auto #1', route: 'Ward 1 & 2 Morning Beat', driver: 'Siddaraju', status: 'On Route', battery_pct: 78 },
  { id: 'EV-VAN-02', name: 'Swachh Vahini EV Auto #2', route: 'Ward 3 & 4 Commercial Beat', driver: 'Nagaraju', status: 'On Route', battery_pct: 64 }
];

export const mockDisasterRisks: DisasterRisk[] = [
  { hazard: 'Cauvery River Basin Flood', risk_pct: 18, status: 'Low Risk', details: 'KRS dam outflow normal at 8,200 cusecs; safety threshold 45,000 cusecs.' },
  { hazard: 'Agricultural Drought', risk_pct: 12, status: 'Minimal', details: 'Groundwater recharge through check dams ensures 18 months irrigation reserve.' },
  { hazard: 'Pre-Monsoon Lightning', risk_pct: 62, status: 'Moderate Advisory', details: 'KSNDMC warning for thunderstorm activity between 16:30 and 19:00 hrs.' },
  { hazard: 'Heatwave Stress', risk_pct: 15, status: 'Low Risk', details: 'Peak afternoon temperatures forecasted below 33.5°C.' }
];

export const mockShelters: SafeShelter[] = [
  { name: 'GHPS High School Cyclone & Flood Shelter', capacity: 450, food_stock_days: 7, generator: true, lat: 12.5638, lng: 76.8907 },
  { name: 'Gram Panchayat Community Hall', capacity: 300, food_stock_days: 5, generator: true, lat: 12.5625, lng: 76.8922 }
];

export const mockProjects: PlannerProject[] = [
  {
    id: 'PRJ-01',
    title: 'Lake Desilting & Rejuvenation with Miyawaki Forest',
    department: 'Water & Environment',
    cost_inr: 2800000,
    roi_multiplier: 3.4,
    impact_score: 94,
    priority: 'Critical',
    beneficiaries: 4820,
    status: 'Approved'
  },
  {
    id: 'PRJ-02',
    title: '50 kWp Rooftop Solar Installation on GHPS & PHC',
    department: 'Energy & Sustainability',
    cost_inr: 2200000,
    roi_multiplier: 2.8,
    impact_score: 89,
    priority: 'High',
    beneficiaries: 1400,
    status: 'In Execution'
  },
  {
    id: 'PRJ-03',
    title: 'Smart IoT Water Valve Network & Piped Metering',
    department: 'Rural Water Supply',
    cost_inr: 3400000,
    roi_multiplier: 3.1,
    impact_score: 92,
    priority: 'High',
    beneficiaries: 3800,
    status: 'Tendering'
  },
  {
    id: 'PRJ-04',
    title: 'CC Pavement & Underground Drain in Ward 3 & 4',
    department: 'Public Works',
    cost_inr: 4800000,
    roi_multiplier: 2.1,
    impact_score: 85,
    priority: 'Medium',
    beneficiaries: 2100,
    status: 'Proposed'
  }
];

export const mockComplaints: Complaint[] = [
  {
    id: 'CMP-2026-081',
    citizen_name: 'Manjunatha K.',
    citizen_phone: '9845123410',
    category: 'Water Supply',
    priority: 'Urgent',
    title: 'Low water pressure and intermittent supply in Ward 3',
    description: 'Drinking water supply has dropped significantly for past 2 days. Motors are running dry during scheduled morning hours.',
    location_address: 'Cross 3, Opposite Vinayaka Temple, Ward 3',
    lat: 12.5658,
    lng: 76.8945,
    status: 'In Progress',
    assigned_officer: 'Suresh Kumar (AE Water)',
    assigned_department: 'Rural Water Supply & Sanitation',
    ai_category_confidence: 96.5,
    ai_urgency_score: 88,
    timeline: [
      { time: '2026-11-20 09:15', note: 'Grievance submitted via Citizen App' },
      { time: '2026-11-20 09:20', note: 'AI Auto-Triaged: Priority Urgent, Category Water Supply' },
      { time: '2026-11-20 10:45', note: 'Assigned to AE Suresh Kumar for pipeline pressure testing' }
    ]
  },
  {
    id: 'CMP-2026-082',
    citizen_name: 'Devika M.',
    citizen_phone: '9741289055',
    category: 'Road Damage',
    priority: 'High',
    title: 'Dangerous pothole formed after heavy pre-monsoon showers',
    description: 'A large 2-foot diameter deep pothole has appeared near the dairy society bend. Two two-wheelers skidded yesterday evening.',
    location_address: 'Dairy Cooperative Road, Ward 2',
    lat: 12.5635,
    lng: 76.8905,
    status: 'Assigned',
    assigned_officer: 'Anand Rao (Panchayat Engineer)',
    assigned_department: 'Public Works & Roads',
    ai_category_confidence: 98.2,
    ai_urgency_score: 76,
    timeline: [
      { time: '2026-11-20 14:02', note: 'Grievance submitted with attached photograph' },
      { time: '2026-11-20 14:05', note: 'AI Computer Vision: Severe Asphalt Raveling detected' },
      { time: '2026-11-20 16:30', note: 'Assigned to Panchayat Engineer for cold-mix bitumen patching' }
    ]
  },
  {
    id: 'CMP-2026-083',
    citizen_name: 'Prakash H.R.',
    citizen_phone: '9448109823',
    category: 'Electricity / Streetlight',
    priority: 'Medium',
    title: 'Streetlight flickering and 3 poles dark near Government School',
    description: 'The LED streetlights on the GHPS approach road are tripping every 10 minutes, causing safety issues for evening pedestrians.',
    location_address: 'School Road, Ward 1',
    lat: 12.5638,
    lng: 76.8907,
    status: 'Submitted',
    assigned_officer: 'Kavitha S. (BESCOM Junior Eng)',
    assigned_department: 'Energy & Street Lighting',
    ai_category_confidence: 94.0,
    ai_urgency_score: 58,
    timeline: [
      { time: '2026-11-21 07:45', note: 'Grievance submitted by citizen' },
      { time: '2026-11-21 07:50', note: 'AI classified: Street Lighting Electrical Circuit failure' }
    ]
  },
  {
    id: 'CMP-2026-084',
    citizen_name: 'Rameshappa',
    citizen_phone: '9900341872',
    category: 'Garbage & Sanitation',
    priority: 'Medium',
    title: 'Commercial waste accumulation near weekly Sunday Haat ground',
    description: 'Plastic covers and vegetable debris have not been lifted since Sunday evening. Stray animals are scattering the waste.',
    location_address: 'Old Shandy Ground, Near Bus Stop',
    lat: 12.5624,
    lng: 76.8928,
    status: 'Resolved',
    assigned_officer: 'Mallikarjun (Sanitation Supervisor)',
    assigned_department: 'Solid Waste Management',
    ai_category_confidence: 95.8,
    ai_urgency_score: 42,
    timeline: [
      { time: '2026-11-18 10:10', note: 'Grievance logged' },
      { time: '2026-11-18 11:30', note: 'EV Van 02 dispatched for secondary clearance' },
      { time: '2026-11-18 14:15', note: 'Area thoroughly cleared and disinfected with bleaching powder. Resolved.' }
    ]
  }
];

export const mockUsers: User[] = [
  {
    id: 'USR-001',
    full_name: 'Shri R. V. Chandrasekhar',
    email: 'admin@villageverse.gov.in',
    phone: '9845011001',
    role: 'Admin',
    department: 'Panchayat Raj & Rural Development',
    panchayat_id: 'GP-KA-MND-042',
    is_verified: true,
    created_at: '2026-01-10'
  },
  {
    id: 'USR-002',
    full_name: 'Smt. Roopa K. M.',
    email: 'panchayat@villageverse.gov.in',
    phone: '9845011002',
    role: 'Panchayat Officer',
    department: 'Gram Panchayat Administration',
    panchayat_id: 'GP-KA-MND-042',
    is_verified: true,
    created_at: '2026-01-15'
  },
  {
    id: 'USR-003',
    full_name: 'Er. Anand Rao',
    email: 'engineer@villageverse.gov.in',
    phone: '9845011003',
    role: 'Engineer',
    department: 'Rural Infrastructure & Works',
    panchayat_id: 'GP-KA-MND-042',
    is_verified: true,
    created_at: '2026-02-01'
  },
  {
    id: 'USR-004',
    full_name: 'Dr. Praveen Nayak',
    email: 'agriculture@villageverse.gov.in',
    phone: '9845011004',
    role: 'Agriculture Officer',
    department: 'Department of Agriculture, Mandya',
    panchayat_id: 'GP-KA-MND-042',
    is_verified: true,
    created_at: '2026-02-12'
  },
  {
    id: 'USR-005',
    full_name: 'Dr. Sahana H. S.',
    email: 'healthcare@villageverse.gov.in',
    phone: '9845011005',
    role: 'Healthcare Officer',
    department: 'Health & Family Welfare (PHC Shivalli)',
    panchayat_id: 'GP-KA-MND-042',
    is_verified: true,
    created_at: '2026-02-15'
  },
  {
    id: 'USR-006',
    full_name: 'Basavaraju Gowda (Farmer / Citizen)',
    email: 'citizen@villageverse.gov.in',
    phone: '9845011006',
    role: 'Citizen',
    department: 'Ward 2 Resident',
    panchayat_id: 'GP-KA-MND-042',
    is_verified: true,
    created_at: '2026-03-01'
  }
];
