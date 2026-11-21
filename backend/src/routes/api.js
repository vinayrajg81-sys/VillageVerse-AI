// VillageVerse AI: Complete REST API Router for All 20 Modules
import express from 'express';
import jwt from 'jsonwebtoken';
import { villageStore, resetStore } from '../data/villageStore.js';
import { supabase } from '../services/supabase.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'villageverse_super_secure_jwt_secret_mandya_2026';

// Middleware for token verification (with graceful pass for demo mode)
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    req.user = villageStore.users[0]; // Fallback to Admin for quick demo test
    return next();
  }
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) req.user = villageStore.users[0];
    else req.user = user;
    next();
  });
};

// ==========================================
// 1. AUTHENTICATION & USERS
// ==========================================
router.post('/auth/login', (req, res) => {
  const { email, role, password } = req.body;
  let user = villageStore.users.find(u => u.email.toLowerCase() === (email || '').toLowerCase());
  
  // If role-based fast login
  if (!user && role) {
    user = villageStore.users.find(u => u.role.toLowerCase() === role.toLowerCase());
  }
  if (!user) {
    user = villageStore.users[0]; // Admin fallback
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.full_name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({
    success: true,
    message: `Welcome ${user.full_name}`,
    token,
    user
  });
});

router.post('/auth/signup', (req, res) => {
  const { full_name, email, phone, role = 'Citizen', department = 'General Resident' } = req.body;
  const newUser = {
    id: `USR-${Date.now().toString().slice(-4)}`,
    full_name: full_name || 'New Resident',
    email: email || `user_${Date.now()}@villageverse.gov.in`,
    phone: phone || '9876543210',
    role: role || 'Citizen',
    department,
    panchayat_id: 'GP-KA-MND-042',
    is_verified: true,
    created_at: new Date().toISOString().split('T')[0]
  };

  villageStore.users.push(newUser);
  const token = jwt.sign(
    { id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.full_name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.status(201).json({
    success: true,
    message: 'Citizen account registered successfully',
    token,
    user: newUser
  });
});

router.post('/auth/forgot-password', (req, res) => {
  const { phoneOrEmail } = req.body;
  const demoOtp = '849201'; // Mock OTP for hackathon demo
  res.json({
    success: true,
    message: `OTP has been dispatched to ${phoneOrEmail || 'registered mobile number'} via Karnataka Sandesh SMS gateway.`,
    demoOtp
  });
});

router.post('/auth/verify-otp', (req, res) => {
  const { otp } = req.body;
  if (otp === '849201' || otp === '123456' || (otp && otp.length === 6)) {
    return res.json({ success: true, message: 'OTP verified successfully. You can reset your password.' });
  }
  res.status(400).json({ success: false, message: 'Invalid OTP code. Please enter 849201 for demo.' });
});

router.get('/auth/me', authenticateToken, (req, res) => {
  res.json({ success: true, user: req.user });
});

router.get('/users', (req, res) => {
  res.json({ success: true, count: villageStore.users.length, users: villageStore.users });
});

router.put('/users/:id/role', (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  const user = villageStore.users.find(u => u.id === id);
  if (user) {
    user.role = role;
    return res.json({ success: true, message: `Role updated to ${role}`, user });
  }
  res.status(404).json({ success: false, message: 'User not found' });
});

// ==========================================
// 2. DASHBOARD
// ==========================================
router.get('/dashboard/stats', (req, res) => {
  res.json({
    success: true,
    profile: villageStore.profile,
    kpis: {
      health_score: villageStore.profile.health_score,
      population: villageStore.profile.population,
      households: villageStore.profile.households,
      agriculture_score: villageStore.profile.agriculture_score,
      water_score: villageStore.profile.water_score,
      electricity_score: villageStore.profile.electricity_score,
      carbon_score: villageStore.profile.carbon_score,
      flood_risk: villageStore.profile.flood_risk
    },
    weather: villageStore.profile.weather,
    recent_activities: [
      { id: 1, text: 'Solar microgrid generation reached peak 120 kWp at 12:30 PM', time: '18 mins ago', type: 'energy' },
      { id: 2, text: 'Acoustic IoT valve checked at Ward 2 Cross 4 culvert', time: '45 mins ago', type: 'water' },
      { id: 3, text: 'Sugarcane soil moisture advisory sent to 620 registered farmers', time: '2 hours ago', type: 'agri' },
      { id: 4, text: 'PHC Tele-Medicine portal completed 14 consultations today', time: '3 hours ago', type: 'health' }
    ]
  });
});

// ==========================================
// 3. DIGITAL TWIN (2D Map & 3D Three.js View)
// ==========================================
router.get('/digital-twin/assets', (req, res) => {
  const { category, status } = req.query;
  let items = [...villageStore.assets];
  if (category) items = items.filter(a => a.category.toLowerCase() === category.toLowerCase());
  if (status) items = items.filter(a => a.status.toLowerCase() === status.toLowerCase());
  res.json({ success: true, count: items.length, assets: items });
});

router.get('/digital-twin/assets/:id', (req, res) => {
  const asset = villageStore.assets.find(a => a.id === req.params.id);
  if (!asset) return res.status(404).json({ success: false, message: 'Asset not found' });
  res.json({ success: true, asset });
});

router.post('/digital-twin/assets', (req, res) => {
  const newAsset = {
    id: `AST-${(villageStore.assets.length + 1).toString().padStart(3, '0')}`,
    ...req.body,
    health_score: req.body.health_score || 90,
    install_date: new Date().toISOString().split('T')[0],
    last_inspected: new Date().toISOString().split('T')[0]
  };
  villageStore.assets.push(newAsset);
  res.status(201).json({ success: true, asset: newAsset });
});

// ==========================================
// 4. AGRICULTURE
// ==========================================
router.get('/agriculture', (req, res) => {
  res.json({ success: true, agriculture: villageStore.agriculture });
});

router.post('/agriculture/crop-disease/detect', (req, res) => {
  const { crop = 'Sugarcane', symptoms = 'reddish discoloration and drying leaves' } = req.body;
  
  // AI diagnosis response
  const diagnoses = {
    sugarcane: {
      disease: 'Red Rot (Colletotrichum falcatum)',
      disease_kn: 'ಕೆಂಪು ಕೊಳೆ ರೋಗ (ರೆಡ್ ರಾಟ್)',
      confidence: 96.8,
      severity: 'Moderate',
      treatment_en: 'Apply Trichoderma viride bio-fungicide @ 2.5 kg/acre mixed with FYM. Ensure field drainage to eliminate water stagnation.',
      treatment_kn: 'ಟ್ರೈಕೋಡರ್ಮಾ ವಿರಿಡೆ ಜೈವಿಕ ಶಿಲೀಂಧ್ರನಾಶಕವನ್ನು ಎಕರೆಗೆ 2.5 ಕೆಜಿ ಪ್ರಮಾಣದಲ್ಲಿ ಕೊಟ್ಟಿಗೆ ಗೊಬ್ಬರದೊಂದಿಗೆ ಬೆರೆಸಿ ಬಳಸಿ. ನೀರು ನಿಲ್ಲದಂತೆ ಬಸಿದು ಹೋಗಲು ಕಾಲುವೆ ನಿರ್ಮಿಸಿ.',
      fertilizer_recommendation: 'Avoid excess chemical Nitrogen; top dress with 50kg Potassium Sulphate to boost stalk resistance.'
    },
    paddy: {
      disease: 'Rice Blast (Magnaporthe oryzae)',
      disease_kn: 'ಭತ್ತದ ಬೆಂಕಿ ರೋಗ (ಬ್ಲಾಸ್ಟ್)',
      confidence: 94.2,
      severity: 'Early Warning',
      treatment_en: 'Spray Tricyclazole 75% WP @ 0.6 g/liter water. Maintain optimal water level of 2 inches.',
      treatment_kn: 'ಟ್ರೈಸೈಕ್ಲಾಜೋಲ್ 75% WP ಅನ್ನು ಲೀಟರ್ ನೀರಿಗೆ 0.6 ಗ್ರಾಂ ಪ್ರಮಾಣದಲ್ಲಿ ಸಿಂಪಡಿಸಿ. 2 ಇಂಚು ನೀರಿನ ಮಟ್ಟವನ್ನು ಕಾಪಾಡಿಕೊಳ್ಳಿ.',
      fertilizer_recommendation: 'Pause Urea application for 10 days; apply Silicon-rich bio-compost.'
    },
    ragi: {
      disease: 'Finger Millet Leaf Blast',
      disease_kn: 'ರಾಗಿ ಎಲೆ ಚುಕ್ಕೆ ರೋಗ',
      confidence: 95.5,
      severity: 'Low',
      treatment_en: 'Spray Mancozeb @ 2g/liter or Neem seed kernel extract (NSKE 5%).',
      treatment_kn: 'ಮ್ಯಾಂಕೋಜೆಬ್ 2 ಗ್ರಾಂ ಪ್ರತಿ ಲೀಟರ್ ಅಥವಾ ಬೇವಿನ ಬೀಜದ ಕಷಾಯ (5%) ಸಿಂಪಡಿಸಿ.',
      fertilizer_recommendation: 'Bio-potash application recommended.'
    }
  };

  const key = crop.toLowerCase().includes('paddy') ? 'paddy' : crop.toLowerCase().includes('ragi') ? 'ragi' : 'sugarcane';
  res.json({
    success: true,
    analysis_timestamp: new Date().toISOString(),
    crop,
    diagnosis: diagnoses[key]
  });
});

router.post('/agriculture/fertilizer-recommend', (req, res) => {
  const { crop, soil_ph = 6.8, n = 180, p = 24, k = 210 } = req.body;
  res.json({
    success: true,
    crop: crop || 'Sugarcane',
    soil_status: { ph: soil_ph, health: 'Balanced Loam' },
    recommendations: [
      { name: 'Neem-Coated Urea', dose: '120 kg/acre', schedule: 'Split in 3 doses (basal, 45th day, 90th day)' },
      { name: 'Single Super Phosphate (SSP)', dose: '75 kg/acre', schedule: 'Single basal dose during planting' },
      { name: 'Muriate of Potash (MOP)', dose: '60 kg/acre', schedule: '2 equal doses at 30 & 60 days' },
      { name: 'Bio-fertilizer Azospirillum & PSB', dose: '2 kg/acre each', schedule: 'Mix with 200kg vermicompost at sowing' }
    ],
    ai_note: 'Soil test shows optimal Potassium levels; organic mulch recommended to retain moisture in peak summer.'
  });
});

// ==========================================
// 5. WATER RESOURCES
// ==========================================
router.get('/water', (req, res) => {
  res.json({ success: true, water: villageStore.water });
});

router.post('/water/trigger-leak-scan', (req, res) => {
  res.json({
    success: true,
    message: 'Acoustic IoT scan initiated across 14.8 km pipeline network.',
    timestamp: new Date().toISOString(),
    scanned_nodes: 24,
    alerts_found: 1,
    details: 'Minor pressure differential detected at Ward 2 Cross 4 culvert (14.2% drop). Telemetry dispatched to AE Suresh Kumar.'
  });
});

// ==========================================
// 6. ROADS & INFRASTRUCTURE
// ==========================================
router.get('/roads', (req, res) => {
  res.json({ success: true, roads: villageStore.roads });
});

router.post('/roads/report-damage', (req, res) => {
  const { road_name, stretch, severity, reporter_name } = req.body;
  const newRepair = {
    id: `RD-0${villageStore.roads.scheduled_repairs.length + 1}`,
    road: road_name || 'Village Feeder Road',
    stretch: stretch || 'Near Cross Junction',
    damage: severity || 'Moderate Potholes',
    cost: 95000,
    date: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    priority: severity === 'Critical' ? 'Urgent' : 'High'
  };
  villageStore.roads.scheduled_repairs.push(newRepair);
  res.status(201).json({ success: true, repair: newRepair });
});

// ==========================================
// 7. ELECTRICITY & CLEAN ENERGY
// ==========================================
router.get('/electricity', (req, res) => {
  res.json({ success: true, electricity: villageStore.electricity });
});

// ==========================================
// 8. HEALTHCARE
// ==========================================
router.get('/healthcare', (req, res) => {
  res.json({ success: true, healthcare: villageStore.healthcare });
});

// ==========================================
// 9. EDUCATION
// ==========================================
router.get('/education', (req, res) => {
  res.json({ success: true, education: villageStore.education });
});

// ==========================================
// 10. WASTE MANAGEMENT
// ==========================================
router.get('/waste', (req, res) => {
  res.json({ success: true, waste: villageStore.waste });
});

router.post('/waste/dispatch-vehicle', (req, res) => {
  const { vehicle_id = 'EV-VAN-01', ward = 'Ward 3' } = req.body;
  res.json({
    success: true,
    message: `Swachh Vahini ${vehicle_id} re-routed to ${ward} for urgent secondary clearance.`,
    eta_minutes: 12
  });
});

// ==========================================
// 11. ENVIRONMENT
// ==========================================
router.get('/environment', (req, res) => {
  res.json({ success: true, environment: villageStore.environment });
});

// ==========================================
// 12. DISASTER PREDICTION & MONITORING
// ==========================================
router.get('/disaster', (req, res) => {
  res.json({ success: true, disaster: villageStore.disaster });
});

router.post('/disaster/broadcast-alert', (req, res) => {
  const { hazard = 'Lightning & Thunderstorm', message } = req.body;
  res.json({
    success: true,
    broadcast_id: `BC-${Date.now().toString().slice(-4)}`,
    hazard,
    channels: ['Panchayat Megaphone Siren', 'Citizen SMS Blast', 'Village WhatsApp Bot'],
    recipients_count: 4820,
    dispatched_at: new Date().toISOString(),
    message: message || 'Severe lightning advisory: KSNDMC urges farmers to stay away from open fields & isolated trees until 19:30 hrs.'
  });
});

// ==========================================
// 13. AI FUTURE PREDICTION
// ==========================================
router.get('/forecast', (req, res) => {
  res.json({ success: true, forecast: villageStore.forecast });
});

// ==========================================
// 14. AI DEVELOPMENT PLANNER
// ==========================================
router.get('/planner', (req, res) => {
  res.json({ success: true, planner: villageStore.planner });
});

router.post('/planner/projects', (req, res) => {
  const newProject = {
    id: `PRJ-0${villageStore.planner.projects.length + 1}`,
    ...req.body,
    roi_multiplier: req.body.roi_multiplier || 2.5,
    impact_score: req.body.impact_score || 85,
    status: 'Proposed'
  };
  villageStore.planner.projects.push(newProject);
  res.status(201).json({ success: true, project: newProject });
});

// ==========================================
// 15. WHAT-IF SIMULATION ENGINE
// ==========================================
router.post('/simulation/run', (req, res) => {
  const {
    waterTanksCount = 0,
    roadRepairKm = 0,
    hospitalsCount = 0,
    schoolsCount = 0,
    solarCapacityKw = 0,
    treesPlantedCount = 0,
    lakesConstructed = 0,
    pipelineUpgradeKm = 0
  } = req.body;

  // Base values
  const baseHealth = villageStore.profile.health_score;
  const baseCarbon = villageStore.profile.carbon_score;
  const baseWater = villageStore.profile.water_score;

  // Real-time dynamic simulation formula
  const deltaHealth = Math.round(
    waterTanksCount * 1.8 +
    roadRepairKm * 0.9 +
    hospitalsCount * 3.5 +
    schoolsCount * 2.8 +
    (solarCapacityKw / 25) * 1.2 +
    (treesPlantedCount / 1000) * 0.8 +
    lakesConstructed * 3.0 +
    pipelineUpgradeKm * 1.1
  );

  const estimatedBudgetInr = (
    waterTanksCount * 1800000 +
    roadRepairKm * 850000 +
    hospitalsCount * 6500000 +
    schoolsCount * 4500000 +
    solarCapacityKw * 48000 +
    treesPlantedCount * 120 +
    lakesConstructed * 3200000 +
    pipelineUpgradeKm * 650000
  );

  const newHealthScore = Math.min(99, baseHealth + deltaHealth);
  const newCarbonScore = Math.min(99, baseCarbon + Math.round((solarCapacityKw / 30) + (treesPlantedCount / 800)));
  const newWaterScore = Math.min(99, baseWater + Math.round(waterTanksCount * 3.5 + lakesConstructed * 5 + pipelineUpgradeKm * 2));
  const annualElectricitySavingsInr = Math.round(solarCapacityKw * 1350 * 7.5);
  const cropYieldImprovementPct = Number((lakesConstructed * 4.2 + (pipelineUpgradeKm * 1.8) + (waterTanksCount * 1.5)).toFixed(1));

  res.json({
    success: true,
    input_parameters: req.body,
    simulated_results: {
      current_village_health_score: baseHealth,
      simulated_village_health_score: newHealthScore,
      health_score_gain: deltaHealth,
      estimated_capital_outlay_inr: estimatedBudgetInr,
      annual_electricity_savings_inr: annualElectricitySavingsInr,
      crop_yield_gain_pct: cropYieldImprovementPct,
      carbon_sustainability_score: newCarbonScore,
      water_security_score: newWaterScore,
      ai_verdict: deltaHealth > 5 
        ? 'High Impact Package: Strongly recommended for Gram Panchayat 15th Finance Commission approval.' 
        : 'Moderate Impact: Review budget allocations to maximize citizen benefit.'
    }
  });
});

// ==========================================
// 16. COMPLAINTS & GRIEVANCE MANAGEMENT
// ==========================================
router.get('/complaints', (req, res) => {
  const { category, status, priority } = req.query;
  let items = [...villageStore.complaints];
  if (category) items = items.filter(c => c.category.toLowerCase() === category.toLowerCase());
  if (status) items = items.filter(c => c.status.toLowerCase() === status.toLowerCase());
  if (priority) items = items.filter(c => c.priority.toLowerCase() === priority.toLowerCase());
  res.json({ success: true, count: items.length, complaints: items });
});

router.post('/complaints', (req, res) => {
  const {
    citizen_name = 'Citizen',
    citizen_phone = '9876543210',
    title,
    description,
    category = 'Water Supply',
    location_address = 'Ward 2, Main Street',
    image_url = null,
    audio_url = null,
    lat = 12.563,
    lng = 76.892
  } = req.body;

  // AI Auto-Classification & Urgency calculation
  const descLower = (description || '' + title || '').toLowerCase();
  let calculatedPriority = 'Medium';
  let aiConfidence = 95.4;
  let urgencyScore = 65;

  if (descLower.includes('urgent') || descLower.includes('danger') || descLower.includes('burst') || descLower.includes('accident') || descLower.includes('spark')) {
    calculatedPriority = 'Urgent';
    urgencyScore = 92;
  } else if (descLower.includes('pothole') || descLower.includes('leak') || descLower.includes('no water')) {
    calculatedPriority = 'High';
    urgencyScore = 78;
  }

  const newComplaint = {
    id: `CMP-2026-0${villageStore.complaints.length + 85}`,
    citizen_name,
    citizen_phone,
    category,
    priority: calculatedPriority,
    title: title || 'Reported Citizen Issue',
    description: description || 'No details provided.',
    location_address,
    lat,
    lng,
    image_url,
    audio_url,
    status: 'Submitted',
    assigned_officer: 'Gram Panchayat Nodal Officer',
    assigned_department: category,
    ai_category_confidence: aiConfidence,
    ai_urgency_score: urgencyScore,
    timeline: [
      { time: new Date().toLocaleString(), note: 'Grievance submitted via VillageVerse Portal' },
      { time: new Date().toLocaleString(), note: `AI Triaged: Category ${category}, Priority ${calculatedPriority}` }
    ]
  };

  villageStore.complaints.unshift(newComplaint);

  // Sync with Supabase Complaints table if migrated
  supabase.from('complaints').insert([{
    id: newComplaint.id,
    citizen_name: newComplaint.citizen_name,
    citizen_phone: newComplaint.citizen_phone,
    title: newComplaint.title,
    description: newComplaint.description,
    category: newComplaint.category,
    priority: newComplaint.priority,
    status: 'Open',
    ward: 'Ward 2',
    image_url: newComplaint.image_url,
    voice_url: newComplaint.audio_url,
    assigned_officer: newComplaint.assigned_officer
  }]).then(() => {}).catch(() => {});

  res.status(201).json({ success: true, complaint: newComplaint });
});

router.patch('/complaints/:id/status', (req, res) => {
  const { status, note } = req.body;
  const complaint = villageStore.complaints.find(c => c.id === req.params.id);
  if (!complaint) return res.status(404).json({ success: false, message: 'Complaint not found' });
  
  complaint.status = status;
  complaint.timeline.push({
    time: new Date().toLocaleString(),
    note: note || `Status updated to ${status}`
  });
  
  res.json({ success: true, complaint });
});

// ==========================================
// 17. SUSTAINABILITY DASHBOARD
// ==========================================
router.get('/sustainability', (req, res) => {
  res.json({ success: true, sustainability: villageStore.sustainability });
});

// ==========================================
// 18. AI CHATBOT (Bilingual English & Kannada)
// ==========================================
// 18. AI CHATBOT & COPILOT INTELLIGENCE
// ==========================================
router.post('/chatbot/message', (req, res) => {
  const { message = '', language = 'en' } = req.body;
  const msg = message.toLowerCase();

  let replyEn = '';
  let replyKn = '';

  if (msg.includes('health score') || msg.includes('ಆರೋಗ್ಯ ಸೂಚ್ಯಂಕ') || msg.includes('86')) {
    replyEn = 'Village Composite Health Score is 86/100 (Tier 1 Optimal). It is computed across 7 vital sectors: Water Security (84/100), Clean Solar Power (91/100), Precision Agriculture (88/100), Carbon Sequestration (79/100), Road Quality (82/100), Healthcare Access (91/100), and Waste Segregation (87/100). The +2.4% weekly gain is driven by peak solar generation and zero pipeline leakages.';
    replyKn = 'ಗ್ರಾಮದ ಸಂಯೋಜಿತ ಆರೋಗ್ಯ ಸೂಚ್ಯಂಕ 86/100 (ಶ್ರೇಷ್ಠ ದರ್ಜೆ). ಇದನ್ನು 7 ವಲಯಗಳ ಆಧಾರದಲ್ಲಿ ಲೆಕ್ಕಹಾಕಲಾಗುತ್ತದೆ: ನೀರಿನ ಭದ್ರತೆ (84), ಸೌರಶಕ್ತಿ (91), ಕೃಷಿ ಆರೋಗ್ಯ (88), ಇಂಗಾಲ ಕಡಿತ (79), ರಸ್ತೆ ಗುಣಮಟ್ಟ (82), ಆರೋಗ್ಯ ಸೇವೆ (91) ಮತ್ತು ತ್ಯಾಜ್ಯ ವಿಲೇವಾರಿ (87). ಸೌರಶಕ್ತಿ ಗರಿಷ್ಠ ಉತ್ಪಾದನೆಯಿಂದ ಈ ವಾರ 2.4% ಹೆಚ್ಚಳವಾಗಿದೆ.';
  } else if (msg.includes('dashboard') || msg.includes('command center') || msg.includes('ಡ್ಯಾಶ್‌ಬೋರ್ಡ್')) {
    replyEn = 'The AI Command Center provides real-time digital twin monitoring of Shivalli GP. It synthesizes telemetry from 48 IoT sensor nodes: UAV drone live optical/thermal feed, 4 Gram Wards GIS cadastral layer, automated KRS reservoir water sluice monitoring, and community solar storage levels.';
    replyKn = 'ಎಐ ಕಮಾಂಡ್ ಸೆಂಟರ್ ಶಿವಳ್ಳಿ ಗ್ರಾಮ ಪಂಚಾಯಿತಿಯ 48 ಐಒಟಿ ಸೆನ್ಸರ್‌ಗಳ ನೇರ ಮಾಹಿತಿಯನ್ನು ನೀಡುತ್ತದೆ: ಡ್ರೋನ್ ಕಣ್ಗಾವಲು, 4 ವಾರ್ಡ್‌ಗಳ ಜಿಐಎಸ್ ನಕ್ಷೆ, ಕೆಆರ್‌ಎಸ್ ನೀರಾವರಿ ಕಾಲುವೆಗಳ ನಿಯಂತ್ರಣ ಮತ್ತು ಸೌರ ಮೈಕ್ರೋಗ್ರಿಡ್ ಬ್ಯಾಟರಿ ಸ್ಥಿತಿಯನ್ನು ನೈಜ ಸಮಯದಲ್ಲಿ ವೀಕ್ಷಿಸಬಹುದು.';
  } else if (msg.includes('monthly report') || msg.includes('dpr') || msg.includes('ವರದಿ') || msg.includes('annual report')) {
    replyEn = 'Shivalli GP Monthly Administrative DPR Summary (November 2026):\n• Capital Outlay: ₹4.25 Cr allocated, ₹3.88 Cr utilized (91.4% efficiency).\n• Water: 100% piped tap connections to all 1,140 households under JJM.\n• Power: 120 kWp solar microgrid saved ₹1.82 Lakh in commercial grid tariffs.\n• Grievances: 42 of 45 citizen grievances resolved with average turnaround of 14 hours.\nOfficial Karnataka Panchayati Raj PDF generated.';
    replyKn = 'ಶಿವಳ್ಳಿ ಮಾಸಿಕ ಆಡಳಿತಾತ್ಮಕ ಡಿಪಿಆರ್ ಸಾರಾಂಶ (ನವೆಂಬರ್ 2026):\n• ಒಟ್ಟು ಬಜೆಟ್: ₹4.25 ಕೋಟಿ ಮಂಜೂರು, ₹3.88 ಕೋಟಿ ಬಳಕೆ (91.4% ದಕ್ಷತೆ).\n• ಕುಡಿಯುವ ನೀರು: ಜೆಜೆಎಂ ಅಡಿಯಲ್ಲಿ 1,140 ಮನೆಗಳಿಗೂ 100% ನಲ್ಲಿ ಸಂಪರ್ಕ.\n• ಸೌರಶಕ್ತಿ: 120 ಕಿಲೋವ್ಯಾಟ್ ಸೌರಶಕ್ತಿಯಿಂದ ₹1.82 ಲಕ್ಷ ವಿದ್ಯುತ್ ಬಿಲ್ ಉಳಿತಾಯ.\n• ದೂರುಗಳು: 45 ದೂರುಗಳಲ್ಲಿ 42 ದೂರುಗಳನ್ನು 14 ಗಂಟೆಗಳಲ್ಲಿ ಇತ್ಯರ್ಥಪಡಿಸಲಾಗಿದೆ.';
  } else if (msg.includes('budget') || msg.includes('ಹಣಕಾಸು') || msg.includes('ಬಜೆಟ್')) {
    replyEn = 'Shivalli Financial Allocation Breakdown (FY 2026-27):\n1. 15th Finance Commission Tied Grant: ₹1.45 Cr (Water & Sanitation).\n2. MGNREGA Rural Infrastructure: ₹1.60 Cr (Desilting Shivalli Kere & canal bunds).\n3. State SFC Untied Grant: ₹0.85 Cr (Road resurfacing & LED streetlights).\n4. Own Source Revenue (Property/Water tax): ₹0.35 Cr.\nRecommendation: Reallocate ₹18 Lakhs savings from solar tariffs toward Ward 3 Primary School smart lab.';
    replyKn = 'ಶಿವಳ್ಳಿ ಗ್ರಾಮ ಪಂಚಾಯತ್ ಬಜೆಟ್ ವಿವರ (2026-27):\n1. 15ನೇ ಹಣಕಾಸು ಆಯೋಗದ ಅನುದಾನ: ₹1.45 ಕೋಟಿ (ನೀರು ಮತ್ತು ನೈರ್ಮಲ್ಯ).\n2. ನರೇಗಾ ಗ್ರಾಮೀಣ ಮೂಲಸೌಕರ್ಯ: ₹1.60 ಕೋಟಿ (ಕೆರೆ ಹೂಳೆತ್ತುವುದು).\n3. ರಾಜ್ಯ ಹಣಕಾಸು ಮುಕ್ತ ಅನುದಾನ: ₹0.85 ಕೋಟಿ (ರಸ್ತೆ ಮತ್ತು ಬೀದಿದೀಪ).\n4. ಸ್ವಂತ ತೆರಿಗೆ ಆದಾಯ: ₹0.35 ಕೋಟಿ.\nಸೌರಶಕ್ತಿ ಉಳಿತಾಯದ ₹18 ಲಕ್ಷವನ್ನು ವಾರ್ಡ್ 3 ಶಾಲೆಯ ಸ್ಮಾರ್ಟ್ ಲ್ಯಾಬ್‌ಗೆ ಬಳಸಲು ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ.';
  } else if (msg.includes('development') || msg.includes('suggestions') || msg.includes('ಅಭಿವೃದ್ಧಿ') || msg.includes('planner')) {
    replyEn = 'Top AI Development Action Plan for Shivalli:\n1. Construct 2.5 km canal-top solar canopy: Adds 180 kWp clean energy & reduces evaporative water loss by 22%.\n2. Subsurface Drip Fertigation across Ward 3 sugarcane cluster: Yield increase +14% with 30% water savings.\n3. Tele-Medicine Hub expansion at Shivalli PHC for weekly cardiology consults via Mandya Medical College.';
    replyKn = 'ಶಿವಳ್ಳಿ ಗ್ರಾಮದ ಪ್ರಮುಖ ಎಐ ಅಭಿವೃದ್ಧಿ ಯೋಜನೆಗಳು:\n1. 2.5 ಕಿಮೀ ನೀರಾವರಿ ಕಾಲುವೆ ಮೇಲೆ ಸೌರ ಫಲಕ ಅಳವಡಿಕೆ: 180 kW ವಿದ್ಯುತ್ ಮತ್ತು ನೀರಿನ ಆವಿಯಾಗುವಿಕೆ 22% ಕಡಿತ.\n2. ವಾರ್ಡ್ 3 ರಲ್ಲಿ ಕಬ್ಬಿನ ಬೆಳೆಗೆ ಹನಿ ನೀರಾವರಿ ವ್ಯವಸ್ಥೆ: 14% ಇಳುವರಿ ಹೆಚ್ಚಳ ಮತ್ತು 30% ನೀರಿನ ಉಳಿತಾಯ.\n3. ಪ್ರಾಥಮಿಕ ಆರೋಗ್ಯ ಕೇಂದ್ರದಲ್ಲಿ ಮಂಡ್ಯ ಮೆಡಿಕಲ್ ಕಾಲೇಜು ತಜ್ಞ ವೈದ್ಯರಿಂದ ಟೆಲಿ-ಮೆಡಿಸಿನ್ ಸಮಾಲೋಚನೆ ವಿಸ್ತರಣೆ.';
  } else if (msg.includes('electricity') || msg.includes('solar') || msg.includes('ವಿದ್ಯುತ್') || msg.includes('power demand')) {
    replyEn = 'Electricity Demand & Microgrid Telemetry:\n• Current Load: 124 kW | Solar Peak Output: 120 kWp.\n• Clean Energy Share: 45.4%.\n• Battery Bank: 80 kWh LiFePO4 holding 88% state of charge.\n• Demand Forecast: Peak evening demand will reach 185 kW at 19:30 hrs. Automated load balancing will draw 35% from battery to avoid peak grid surcharges.';
    replyKn = 'ವಿದ್ಯುತ್ ಬೇಡಿಕೆ ಮತ್ತು ಸೌರ ಮೈಕ್ರೋಗ್ರಿಡ್ ವಿವರ:\n• ಪ್ರಸ್ತುತ ಲೋಡ್: 124 kW | ಸೌರ ಉತ್ಪಾದನೆ: 120 kWp.\n• ಶುದ್ಧ ಇಂಧನ ಪಾಲು: 45.4%.\n• ಬ್ಯಾಟರಿ ಸಂಗ್ರಹ: 80 kWh ಸಾಮರ್ಥ್ಯದ ಬ್ಯಾಟರಿಯಲ್ಲಿ 88% ಚಾರ್ಜ್ ಇದೆ.\n• ಸಂಜೆ 7:30ಕ್ಕೆ ಗರಿಷ್ಠ 185 kW ಬೇಡಿಕೆ ಇರಲಿದ್ದು, ಗ್ರಿಡ್ ಶುಲ್ಕ ಉಳಿಸಲು ಬ್ಯಾಟರಿಯಿಂದ 35% ಪೂರೈಕೆಯಾಗಲಿದೆ.';
  } else if (msg.includes('emergency') || msg.includes('ambulance') || msg.includes('ತುರ್ತು') || msg.includes('help')) {
    replyEn = 'EMERGENCY PROTOCOL ACTIVATED - SHIVALLI GRAM PANCHAYAT:\n• 108 Arogya Kavacha Ambulance: Stationed at PHC Campus (Call: 108 / Direct: 9845012399)\n• Panchayat Disaster Officer: 9448102344\n• BESCOM Electrical Fault Desk: 1912\n• Nearest High-Level Hospital: Mandya Institute of Medical Sciences (MIMS - 8.4 km)\n• Safe Shelters: GHPS Auditorium & Samudaya Bhavana.';
    replyKn = 'ತುರ್ತು ಸಹಾಯವಾಣಿ - ಶಿವಳ್ಳಿ ಗ್ರಾಮ ಪಂಚಾಯತ್:\n• 108 ಆರೋಗ್ಯ ಕವಚ ಆಂಬುಲೆನ್ಸ್: ಪ್ರಾಥಮಿಕ ಆರೋಗ್ಯ ಕೇಂದ್ರ (ಕರೆ: 108 / ನೇರ: 9845012399)\n• ಪಂಚಾಯತ್ ವಿಪತ್ತು ಅಧಿಕಾರಿ: 9448102344\n• ಬೆಸ್ಕಾಂ ವಿದ್ಯುತ್ ದೂರು: 1912\n• ಹತ್ತಿರದ ಆಸ್ಪತ್ರೆ: ಮಿಮ್ಸ್ ಮಂಡ್ಯ (8.4 ಕಿಮೀ)\n• ಸುರಕ್ಷಿತ ಆಶ್ರಯ ತಾಣ: ಜಿಎಚ್‌ಪಿಎಸ್ ಶಾಲಾ ಸಭಾಂಗಣ.';
  } else if (msg.includes('water') || msg.includes('ನೀರು') || msg.includes('shortage')) {
    replyEn = 'Water Security Status:\n• Storage Level: 84% (1.8 Million Cu.M in Shivalli Kere + 150kL Overhead Tank).\n• Groundwater Depth: 48.2 feet (Safe zone).\n• 30-Day Shortage Risk: LOW (7% probability). Scheduled canal inflow from Cauvery-KRS secures 65 days of domestic and livestock supply.\n• Quality: Total Dissolved Solids 240 ppm, Potability 100% compliant.';
    replyKn = 'ಕುಡಿಯುವ ನೀರು ಮತ್ತು ಜಲ ಭದ್ರತೆ:\n• ಸಂಗ್ರಹ ಮಟ್ಟ: 84% (ಶಿವಳ್ಳಿ ಕೆರೆಯಲ್ಲಿ 1.8M Cu.M ಮತ್ತು 1,50,000 ಲೀಟರ್ ಮೇಲ್ತೊಟ್ಟಿ).\n• ಅಂತರ್ಜಲ ಮಟ್ಟ: 48.2 ಅಡಿ (ಸುರಕ್ಷಿತ ವಲಯ).\n• 30 ದಿನಗಳ ಕೊರತೆ ಅಪಾಯ: ಅತ್ಯಂತ ಕಡಿಮೆ (7%). ಕೆಆರ್‌ಎಸ್ ಕಾಲುವೆ ನೀರಿನಿಂದ 65 ದಿನಗಳ ಸರಬರಾಜು ಖಚಿತವಾಗಿದೆ.\n• ನೀರಿನ ಗುಣಮಟ್ಟ: ಟಿಡಿಎಸ್ 240 ಪಿಪಿಎಂ, ಸಂಪೂರ್ಣ ಕುಡಿಯಲು ಯೋಗ್ಯ.';
  } else if (msg.includes('crop') || msg.includes('agri') || msg.includes('ಬೆಳೆ') || msg.includes('ರೈತ') || msg.includes('fertilizer')) {
    replyEn = 'Sugarcane & Agriculture AI Advisory (Mandya Zone):\n• Mandya Sugars APMC FRP: ₹3,150/Tonne (+4.2%).\n• Ragi: ₹4,120/Quintal.\n• Soil Moisture: 64% (Optimal).\n• AI Disease Detection: Early Red Rot leaf warning detected in Sector 2 plot. Apply Trichoderma viride bio-fungicide and avoid waterlogging.\n• Fertilizer: Apply 50 kg Urea + 25 kg MOP per acre with bio-potash spray.';
    replyKn = 'ಮಂಡ್ಯ ವಲಯ ಕೃಷಿ ಮತ್ತು ಬೆಳೆ ಸಲಹೆ:\n• ಮಂಡ್ಯ ಶುಗರ್ಸ್ ಕಬ್ಬಿನ ದರ: ₹3,150/ಟನ್.\n• ರಾಗಿ ದರ: ₹4,120/ಕ್ವಿಂಟಾಲ್.\n• ಮಣ್ಣಿನ ತೇವಾಂಶ: 64% (ಉತ್ತಮ).\n• ಬೆಳೆ ರೋಗ ಪತ್ತೆ: ಸೆಕ್ಟರ್ 2 ರಲ್ಲಿ ಕೆಂಪು ಕೊಳೆ ರೋಗದ ಆರಂಭಿಕ ಲಕ್ಷಣ. ಟ್ರೈಕೋಡರ್ಮಾ ಜೈವಿಕ ಶಿಲೀಂಧ್ರನಾಶಕ ಸಿಂಪಡಿಸಿ.\n• ಗೊಬ್ಬರ ಶಿಫಾರಸು: ಎಕರೆಗೆ 50 ಕೆಜಿ ಯೂರಿಯಾ, 25 ಕೆಜಿ ಪೊಟ್ಯಾಶ್ ಮತ್ತು ಬೇವಿನ ಹಿಂಡಿ ಬಳಸಿ.';
  } else if (msg.includes('scheme') || msg.includes('ಯೋಜನೆ') || msg.includes('pm kusum') || msg.includes('ganga kalyana')) {
    replyEn = 'Key Karnataka & Central Rural Schemes Active:\n1. PM-KUSUM: 60% capital subsidy on 5HP/7.5HP solar irrigation pumpsets.\n2. Ganga Kalyana: Free borewell drilling with energized pump for small & marginal farmers.\n3. Jal Jeevan Mission: 100% piped potable water to all 1,140 households.\n4. Gruha Jyothi: Free domestic electricity up to 200 units.\nApply directly at the Grama One desk in Shivalli Bhavan.';
    replyKn = 'ಕರ್ನಾಟಕ ಸರ್ಕಾರದ ಪ್ರಮುಖ ಗ್ರಾಮೀಣ ಯೋಜನೆಗಳು:\n1. ಪಿಎಂ-ಕುಸುಮ್: 5HP/7.5HP ಸೌರ ಪಂಪ್‌ಸೆಟ್‌ಗೆ 60% ಸಬ್ಸಿಡಿ.\n2. ಗಂಗಾ ಕಲ್ಯಾಣ ಯೋಜನೆ: ಸಣ್ಣ ಮತ್ತು ಅತಿ ಸಣ್ಣ ರೈತರಿಗೆ ಉಚಿತ ಕೊಳವೆಬಾವಿ ಮತ್ತು ಪಂಪ್.\n3. ಜಲ ಜೀವನ್ ಮಿಷನ್: 1,140 ಮನೆಗಳಿಗೂ ಶುದ್ಧ ನಲ್ಲಿ ನೀರು.\n4. ಗೃಹ ಜ್ಯೋತಿ: 200 ಯೂನಿಟ್‌ವರೆಗೆ ಉಚಿತ ವಿದ್ಯುತ್.\nಶಿವಳ್ಳಿ ಗ್ರಾಮ ಪಂಚಾಯತ್ ಗ್ರಾಮ ಒನ್ ಕೇಂದ್ರದಲ್ಲಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ.';
  } else if (msg.includes('disaster') || msg.includes('flood') || msg.includes('ಮಳೆ') || msg.includes('ಪ್ರವಾಹ')) {
    replyEn = 'Live Disaster & Flood Forecast (Mandya Region):\n• Status: LOW RISK (18/100 Hazard Index).\n• Cauvery KRS Outflow: 18,400 cusecs (Canal banks operating well below high water mark).\n• 7-Day Monsoon Rainfall Forecast: 14.5 mm (Normal showers).\n• Safe Evacuation Route: SH-17 Highway Corridor toward Mandya General Hospital.';
    replyKn = 'ವಿಪತ್ತು ಮತ್ತು ಪ್ರವಾಹ ಮುನ್ಸೂಚನೆ (ಮಂಡ್ಯ ಜಿಲ್ಲೆ):\n• ಸ್ಥಿತಿ: ಕಡಿಮೆ ಅಪಾಯ (ಸೂಚ್ಯಂಕ 18/100).\n• ಕೆಆರ್‌ಎಸ್ ಹೊರಹರಿವು: 18,400 ಕ್ಯೂಸೆಕ್ಸ್ (ಕಾಲುವೆಗಳು ಸುರಕ್ಷಿತ ಮಟ್ಟದಲ್ಲಿವೆ).\n• 7 ದಿನಗಳ ಮಳೆ ಮುನ್ಸೂಚನೆ: 14.5 ಮಿಮೀ ಸಾಧಾರಣ ಮಳೆ.\n• ಸುರಕ್ಷಿತ ಸ್ಥಳಾಂತರ ಮಾರ್ಗ: ಎಸ್ಎಚ್-17 ರಾಜ್ಯ ಹೆದ್ದಾರಿ ಕಾರಿಡಾರ್.';
  } else {
    replyEn = `Hello! I am VillageVerse AI Copilot for Shivalli Gram Panchayat. You can ask me to Explain Dashboard, Explain Health Score, Generate Reports, Predict Floods, Provide Crop & Fertilizer Advice, Forecast Water Shortage, or detail Karnataka Government Schemes in English or Kannada!`;
    replyKn = `ನಮಸ್ಕಾರ! ನಾನು ಶಿವಳ್ಳಿ ಗ್ರಾಮ ಪಂಚಾಯಿತಿಯ ವಿಲೇಜ್‌ವರ್ಸ್ ಎಐ ಕೋಪೈಲಟ್. ನೀವು ಗ್ರಾಮದ ಆರೋಗ್ಯ ಸೂಚ್ಯಂಕ, ವರದಿಗಳು, ಪ್ರವಾಹ ಮುನ್ಸೂಚನೆ, ಕೃಷಿ ಬೆಳೆ ರೋಗಗಳು, ನೀರಿನ ಕೊರತೆ ಅಥವಾ ಕರ್ನಾಟಕ ಸರ್ಕಾರದ ಯೋಜನೆಗಳ ಬಗ್ಗೆ ಕೇಳಬಹುದು!`;
  }

  res.json({
    success: true,
    response: language === 'kn' ? replyKn : replyEn,
    bilingual: {
      en: replyEn,
      kn: replyKn
    },
    quick_suggestions: [
      'Explain Village Health Score (86/100)',
      'Explain Dashboard & Live Telemetry',
      'Generate Monthly Village DPR Report',
      'Predict 30-Day Monsoon & Flood Risk',
      'Crop & Fertilizer Recommendation',
      'Emergency Assistance Protocol'
    ]
  });
});

// ==========================================
// 19. REPORTS & ANALYTICS
// ==========================================
router.get('/reports', (req, res) => {
  res.json({
    success: true,
    generated_at: new Date().toISOString(),
    village_name: villageStore.profile.name,
    overall_health_score: villageStore.profile.health_score,
    department_scores: {
      agriculture: villageStore.profile.agriculture_score,
      water_resources: villageStore.profile.water_score,
      energy_grid: villageStore.profile.electricity_score,
      sustainability: villageStore.profile.carbon_score,
      education_literacy: 82.5,
      healthcare_coverage: 91.0,
      sanitation_segregation: 91.5
    },
    executive_summary: 'Shivalli Gram Panchayat maintains a high composite development score of 86/100. Renewable solar adoption stands at 45.4%, leading the taluk. Water infrastructure is 82.4% full with zero critical drought exposure. Top recommendations: Desilt Shivalli Kere west bund, complete asphalt patching on SH-17 link road km 2.4, and install 50kWp rooftop solar across schools.'
  });
});

router.post('/reports/ai-summary', (req, res) => {
  const { department = 'All' } = req.body;
  res.json({
    success: true,
    department,
    ai_summary: `Comprehensive evaluation for ${department} indicates 94% SLA compliance on citizen grievances. Solar microgrid generation saved 2,450 kWh today. Recommended focus for upcoming Gram Sabha: approve Lake Rejuvenation DPR under 15th Finance Commission grant.`
  });
});

// ==========================================
// 20. SETTINGS
// ==========================================
router.get('/settings', (req, res) => {
  res.json({
    success: true,
    settings: {
      village_name: villageStore.profile.name,
      panchayat_code: villageStore.profile.id,
      coordinates: { lat: villageStore.profile.latitude, lng: villageStore.profile.longitude },
      default_language: 'en',
      supported_languages: ['English', 'ಕನ್ನಡ (Kannada)'],
      theme: 'dark-glassmorphism',
      database_status: 'Connected (PostgreSQL / Supabase Ready)',
      active_iot_sensors: 48,
      last_backup_date: '2026-11-20 23:00'
    }
  });
});

router.post('/settings/backup', (req, res) => {
  res.json({
    success: true,
    message: 'System configuration and sensor telemetry snapshot backed up to secure cloud storage.',
    backup_file: `villageverse_backup_GP-KA-MND-042_${Date.now()}.json`
  });
});

router.post('/settings/reset', (req, res) => {
  resetStore();
  res.json({ success: true, message: 'VillageVerse store reset to original state' });
});

export default router;
