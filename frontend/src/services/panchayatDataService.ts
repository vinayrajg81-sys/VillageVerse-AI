// VillageVerse AI: Multi-Panchayat Dynamic Contextual Data Engine
import { GramPanchayat } from '../types/panchayat';

export const getPanchayatDisplayName = (gp: GramPanchayat | string): string => {
  const name = typeof gp === 'string' ? gp : gp?.name || '';
  return name.replace(/\s*(Rural\s*)?Gram\s*Panchayat/i, '').trim() || name;
};

// 1. Agriculture Scoped Data
export const getAgricultureForPanchayat = (gp: GramPanchayat) => {
  const name = getPanchayatDisplayName(gp);
  const totalFarmland = Math.round(gp.area_sq_km * 125);
  const activeFarmers = Math.round(gp.households * 0.55);

  let cropList: any[] = [];

  if (gp.id === 'GP-KA-KRP-004') { // Kikkeri
    cropList = [
      { id: 'CRP-KKR-01', name: 'Sugarcane (Hemavathi Ayacut Co-86032)', area_acres: Math.round(totalFarmland * 0.45), avg_yield_tonnes: 44.5, moisture_pct: 68, health_status: 'Optimal' },
      { id: 'CRP-KKR-02', name: 'Paddy (Jyothi Semi-Dwarf)', area_acres: Math.round(totalFarmland * 0.28), avg_yield_tonnes: 28.2, moisture_pct: 76, health_status: 'Optimal' },
      { id: 'CRP-KKR-03', name: 'Dairy Fodder (Hybrid Super Napier)', area_acres: Math.round(totalFarmland * 0.15), avg_yield_tonnes: 52.0, moisture_pct: 82, health_status: 'Optimal' },
      { id: 'CRP-KKR-04', name: 'Finger Millet (Ragi GPU-28)', area_acres: Math.round(totalFarmland * 0.12), avg_yield_tonnes: 14.8, moisture_pct: 42, health_status: 'Good' }
    ];
  } else if (gp.id === 'GP-KA-PND-021') { // Melukote
    cropList = [
      { id: 'CRP-MLK-01', name: 'Heritage Organic Paddy (Rajamudi)', area_acres: Math.round(totalFarmland * 0.35), avg_yield_tonnes: 22.0, moisture_pct: 72, health_status: 'Optimal' },
      { id: 'CRP-MLK-02', name: 'Herbal & Ayurvedic Sanctuary Flora', area_acres: Math.round(totalFarmland * 0.25), avg_yield_tonnes: 18.5, moisture_pct: 60, health_status: 'Optimal' },
      { id: 'CRP-MLK-03', name: 'Coconut Orchards & Betel Leaf', area_acres: Math.round(totalFarmland * 0.22), avg_yield_tonnes: 32.0, moisture_pct: 54, health_status: 'Optimal' },
      { id: 'CRP-MLK-04', name: 'Millets (Foxtail & Little Millet)', area_acres: Math.round(totalFarmland * 0.18), avg_yield_tonnes: 12.0, moisture_pct: 38, health_status: 'Good' }
    ];
  } else if (gp.id === 'GP-KA-PND-001') { // Pandavapura
    cropList = [
      { id: 'CRP-PND-01', name: 'Commercial Sugarcane (Co-62175)', area_acres: Math.round(totalFarmland * 0.52), avg_yield_tonnes: 48.0, moisture_pct: 70, health_status: 'Optimal' },
      { id: 'CRP-PND-02', name: 'Paddy (IR-64 Sluice Irrigated)', area_acres: Math.round(totalFarmland * 0.30), avg_yield_tonnes: 30.5, moisture_pct: 74, health_status: 'Optimal' },
      { id: 'CRP-PND-03', name: 'Maize & Horticultural Vegetables', area_acres: Math.round(totalFarmland * 0.18), avg_yield_tonnes: 19.5, moisture_pct: 58, health_status: 'Good' }
    ];
  } else if (gp.id === 'GP-KA-CRP-001') { // Channarayapatna
    cropList = [
      { id: 'CRP-CRP-01', name: 'High-Yield Coconut Groves (Arsikere Tall)', area_acres: Math.round(totalFarmland * 0.42), avg_yield_tonnes: 36.0, moisture_pct: 50, health_status: 'Optimal' },
      { id: 'CRP-CRP-02', name: 'Ragi & Maize Food Bowl', area_acres: Math.round(totalFarmland * 0.32), avg_yield_tonnes: 21.0, moisture_pct: 44, health_status: 'Optimal' },
      { id: 'CRP-CRP-03', name: 'Ginger & Turmeric Spice Cash Crop', area_acres: Math.round(totalFarmland * 0.26), avg_yield_tonnes: 16.5, moisture_pct: 65, health_status: 'Good' }
    ];
  } else {
    // Default & Shivalli
    cropList = [
      { id: `${gp.id}-CRP-01`, name: `${name} Sugarcane Co-86032`, area_acres: Math.round(totalFarmland * 0.48), avg_yield_tonnes: 42.0, moisture_pct: 66, health_status: 'Optimal' },
      { id: `${gp.id}-CRP-02`, name: `${name} Paddy IR-64`, area_acres: Math.round(totalFarmland * 0.32), avg_yield_tonnes: 29.0, moisture_pct: 75, health_status: 'Optimal' },
      { id: `${gp.id}-CRP-03`, name: `${name} Sericulture Mulberry & Ragi`, area_acres: Math.round(totalFarmland * 0.20), avg_yield_tonnes: 18.2, moisture_pct: 48, health_status: 'Good' }
    ];
  }

  const soilSensors = [
    { id: `${gp.id}-SNS-01`, sector: `${name} Ward 1 Agri-Zone`, location: `${name} Ward 1 Agri-Zone`, moisture_pct: 64, moisture: '64%', npk_ratio: '120:45:62', ph: 6.8, n: 190, p: 26, k: 215, temp_c: 27.2, ec: '0.42 dS/m', battery: '96%' },
    { id: `${gp.id}-SNS-02`, sector: `${name} Tail-End Sluice Cross`, location: `${name} Tail-End Sluice Cross`, moisture_pct: 58, moisture: '58%', npk_ratio: '115:42:58', ph: 7.1, n: 210, p: 31, k: 235, temp_c: 26.5, ec: '0.38 dS/m', battery: '92%' },
    { id: `${gp.id}-SNS-03`, sector: `${name} Lake Catchment Basin`, location: `${name} Lake Catchment Basin`, moisture_pct: 72, moisture: '72%', npk_ratio: '135:50:70', ph: 6.9, n: 175, p: 24, k: 200, temp_c: 28.1, ec: '0.46 dS/m', battery: '98%' }
  ];

  return {
    total_farmland_acres: totalFarmland,
    active_farmers: activeFarmers,
    avg_soil_health_index: gp.agriculture_score,
    crops: cropList,
    soil_sensors: soilSensors,
    mandi_prices: [
      { commodity: 'Sugarcane (FRP Mill Gate)', crop: 'Sugarcane', price: '₹3,150 / Tonne', price_per_quintal: 3150, trend: '+4.2%', change_pct: '+4.2%', market: `${gp.taluk} Sugars APMC`, mandi: `${gp.taluk} APMC Market` },
      { commodity: 'Paddy (Jyothi Grade A)', crop: 'Paddy (Grade A)', price: '₹2,380 / Quintal', price_per_quintal: 2380, trend: '+1.8%', change_pct: '+1.8%', market: 'Mysuru Bandipalya APMC', mandi: `${gp.taluk} APMC Market` },
      { commodity: 'Ragi (Finger Millet)', crop: 'Ragi', price: '₹4,120 / Quintal', price_per_quintal: 4120, trend: '+5.1%', change_pct: '+5.1%', market: `${gp.taluk} APMC Yard`, mandi: 'Mandya Central APMC' },
      { commodity: 'Silk Cocoon (Bivoltine)', crop: 'Silk Cocoon', price: '₹680 / Kg', price_per_quintal: 48500, trend: '+8.3%', change_pct: '+8.3%', market: 'Ramanagara Silk Market', mandi: 'Ramanagara Silk Market' },
      { commodity: 'Banana (Yellaki)', crop: 'Banana', price: '₹38 / Kg', price_per_quintal: 3800, trend: '-2.1%', change_pct: '-2.1%', market: 'Maddur Fruit Mandi', mandi: 'Maddur Mandi' }
    ]
  };
};

// 2. Water Scoped Data
export const getWaterForPanchayat = (gp: GramPanchayat) => {
  const name = getPanchayatDisplayName(gp);
  const dailyConsumption = Math.round(gp.population * 75);
  const reservoirCapacity = Math.round(gp.population * 125);

  return {
    daily_consumption_liters: dailyConsumption,
    reservoir_capacity_liters: reservoirCapacity,
    current_storage_pct: gp.water_score,
    groundwater_table_ft: Math.round(52.0 - (gp.water_score - 80) * 1.2),
    leakage_loss_pct: Math.max(3.8, +(8.8 - (gp.water_score - 80) * 0.25).toFixed(1)),
    leak_alerts: [
      { id: 'LK-01', location: `${name} Ward 2 Cross Feeder Pipe`, flow_variance_pct: 6.4, severity: 'Low', flow_drop: '6.4%', detected_at: '2 hours ago', status: 'Technician Dispatched' }
    ],
    quality_metrics: {
      tds_ppm: 215,
      ph_level: 7.2,
      turbidity_ntu: 1.2,
      fluoride_mg_l: 0.55,
      chlorine_residual_ppm: 0.45,
      potability_score: '97% (WHO Grade A Drinking Water)'
    },
    sources: [
      { id: `${gp.id}-WTR-01`, name: `${name} Doddakere Reservoir & Catchment`, type: 'Perennial Lake', capacity_liters: Math.round(gp.population * 600), level_pct: gp.water_score, current_level_pct: gp.water_score, status: 'Operational' },
      { id: `${gp.id}-WTR-02`, name: `${name} JJM Overhead Potable Tank #1`, type: 'Overhead Reservoir', capacity_liters: Math.round(gp.population * 60), level_pct: 88, current_level_pct: 88, status: 'Operational' },
      { id: `${gp.id}-WTR-03`, name: `${name} Ward 3 Solar Powered Borewell`, type: 'Deep Solar Well', capacity_liters: 45000, level_pct: 84, current_level_pct: 84, status: 'Operational' },
      { id: `${gp.id}-WTR-04`, name: `${gp.taluk} Irrigation Branch Canal Sluice`, type: 'Canal Inflow', capacity_liters: Math.round(gp.population * 300), level_pct: 92, current_level_pct: 92, status: 'Operational' }
    ]
  };
};

// 3. Roads Scoped Data
export const getRoadsForPanchayat = (gp: GramPanchayat) => {
  const name = getPanchayatDisplayName(gp);
  const totalKm = +(gp.area_sq_km * 1.8).toFixed(1);
  const asphaltKm = +(gp.area_sq_km * 1.15).toFixed(1);
  const concreteKm = +(gp.area_sq_km * 0.45).toFixed(1);
  const gravelKm = +(totalKm - asphaltKm - concreteKm).toFixed(1);

  return {
    total_length_km: totalKm,
    asphalt_km: asphaltKm,
    concrete_km: concreteKm,
    gravel_km: Math.max(1.2, gravelKm),
    avg_pci_score: Math.round(gp.health_score * 0.94),
    pothole_hotspots_count: Math.max(1, Math.round((100 - gp.health_score) / 3)),
    budget_allocated_inr: Math.round(gp.households * 3800),
    scheduled_repairs: [
      { id: `${gp.id}-RD-01`, road: `${name} Main Taluk Arterial Corridor`, road_name: `${name} Main Taluk Arterial Corridor`, stretch: 'KM 1.2 to 2.8', damage: 'Pothole clustering & surface raveling', cost: 185000, date: '2026-12-05', priority: 'High', pci_score: 82, status: 'Scheduled' },
      { id: `${gp.id}-RD-02`, road: `${name} Canal Embankment Link Road`, road_name: `${name} Canal Embankment Link Road`, stretch: 'Near Milk Society bend', damage: 'Edge shoulder erosion', cost: 120000, date: '2026-12-14', priority: 'Medium', pci_score: 74, status: 'In Progress' },
      { id: `${gp.id}-RD-03`, road: `${name} Ward 3 Internal Concrete Pavement`, road_name: `${name} Ward 3 Internal Concrete Pavement`, stretch: 'School to PHC stretch', damage: 'Expansion joint sealing', cost: 420000, date: '2027-01-10', priority: 'Medium', pci_score: 91, status: 'Completed' }
    ]
  };
};

// 4. Electricity & Solar Scoped Data
export const getElectricityForPanchayat = (gp: GramPanchayat) => {
  const name = getPanchayatDisplayName(gp);
  const dailyKwh = Math.round(gp.households * 4.8);
  const solarKwh = Math.round(dailyKwh * (gp.electricity_score / 185));

  return {
    daily_consumption_kwh: dailyKwh,
    solar_generation_kwh: solarKwh,
    solar_share_pct: Math.round((solarKwh / dailyKwh) * 100),
    grid_reliability_pct: Math.min(99.6, +(gp.electricity_score * 1.08).toFixed(1)),
    active_outages_count: 0,
    solar_units: [
      { id: `${gp.id}-SLR-01`, name: `${name} Community Solar Microgrid`, capacity_kw: Math.round(gp.households * 0.1), today_yield_kwh: solarKwh, generated_today_kwh: solarKwh, efficiency_pct: 94.8, status: 'Active' },
      { id: `${gp.id}-SLR-02`, name: `${name} Gram Panchayat Bhavan Rooftop Solar`, capacity_kw: 15, today_yield_kwh: 68, generated_today_kwh: 68, efficiency_pct: 96.2, status: 'Active' },
      { id: `${gp.id}-SLR-03`, name: `${name} PHC Dedicated Emergency Solar-Battery Unit`, capacity_kw: 10, today_yield_kwh: 45, generated_today_kwh: 45, efficiency_pct: 98.0, status: 'Active' }
    ],
    transformers: [
      { id: `${gp.id}-TRF-01`, name: `${name} Ward 1 Distribution Transformer`, rating: '100 kVA', load_pct: 68, health_pct: 94, temp_c: 48, status: 'Normal' },
      { id: `${gp.id}-TRF-02`, name: `${name} Irrigation Feeder Transformer`, rating: '150 kVA', load_pct: 74, health_pct: 90, temp_c: 52, status: 'Normal' }
    ]
  };
};

// 5. Healthcare Scoped Data
export const getHealthcareForPanchayat = (gp: GramPanchayat) => {
  const name = getPanchayatDisplayName(gp);
  return {
    facilities_count: 3,
    phc_name: `${name} Primary Health Centre (PHC)`,
    doctors_on_duty: 2,
    nurses_staff: 6,
    available_beds: 14,
    occupied_beds: 5,
    vaccination_coverage_pct: 98.6,
    ambulances: [
      { id: 'AMB-01', vehicle: '108 Emergency Ambulance', vehicle_number: 'KA-11-G-4021', location: `${name} PHC Bay 1`, status: 'Available at PHC', driver: 'Kiran Gowda (9845012399)', lat: +(gp.latitude + 0.0005).toFixed(4), lng: +(gp.longitude + 0.0008).toFixed(4) },
      { id: 'AMB-02', vehicle: 'Naguvina Ratha (Maternity Van)', vehicle_number: 'KA-11-G-4055', location: `${gp.taluk} Taluk Hospital Route`, status: 'En-route Taluk Hospital', driver: 'Raju M. (9900887711)', lat: +(gp.latitude - 0.0012).toFixed(4), lng: +(gp.longitude - 0.0015).toFixed(4) }
    ],
    active_disease_alerts: [
      { disease: 'Vector-Borne Surveillance', risk: 'Low', cases_30d: 1, action: `Anti-larval fogging in ${name} Ward 1 & 2` },
      { disease: 'Seasonal Flu & URI', risk: 'Controlled', cases_30d: 12, action: 'Paracetamol & ORS buffer stocks verified' }
    ],
    medicine_inventory: [
      { medicine: 'Paracetamol 500mg', name: 'Paracetamol 500mg', stock_units: 4200, status: 'Sufficient' },
      { medicine: 'Amoxicillin 250mg', name: 'Amoxicillin 250mg', stock_units: 1800, status: 'Sufficient' },
      { medicine: 'Oral Rehydration Salts (ORS)', name: 'Oral Rehydration Salts (ORS)', stock_units: 950, status: 'Sufficient' },
      { medicine: 'Insulin (Human Mixtard)', name: 'Insulin (Human Mixtard)', stock_units: 85, status: 'Re-order needed' },
      { medicine: 'Anti-Rabies Vaccine', name: 'Anti-Rabies Vaccine', stock_units: 45, status: 'Sufficient' }
    ]
  };
};

// 6. Development Planner Scoped Data
export const getPlannerForPanchayat = (gp: GramPanchayat) => {
  const name = getPanchayatDisplayName(gp);
  const totalBudget = Math.round(gp.population * 3600);
  const allocated = Math.round(totalBudget * 0.72);

  return {
    total_budget_inr: totalBudget,
    allocated_inr: allocated,
    unallocated_inr: totalBudget - allocated,
    projects: [
      {
        id: `${gp.id}-PRJ-01`,
        title: `${name} Water Reservoir & Sluice Automation Phase II`,
        department: 'Rural Water Supply & Irrigation',
        cost_inr: Math.round(totalBudget * 0.30),
        status: 'In Progress',
        progress_pct: 76,
        priority: 'High',
        roi_multiplier: 3.2,
        impact_score: 92,
        beneficiaries: Math.round(gp.population * 0.85)
      },
      {
        id: `${gp.id}-PRJ-02`,
        title: `${name} Rooftop Solarization & Smart Streetlight Expansion`,
        department: 'Energy & Rural Electrification',
        cost_inr: Math.round(totalBudget * 0.22),
        status: 'Approved',
        progress_pct: 45,
        priority: 'High',
        roi_multiplier: 2.9,
        impact_score: 89,
        beneficiaries: gp.population
      },
      {
        id: `${gp.id}-PRJ-03`,
        title: `${name} Tele-ICU & Ayushman Health Clinic Digital Infrastructure`,
        department: 'Health & Family Welfare',
        cost_inr: Math.round(totalBudget * 0.12),
        status: 'In Progress',
        progress_pct: 60,
        priority: 'Medium',
        roi_multiplier: 2.6,
        impact_score: 91,
        beneficiaries: gp.population
      },
      {
        id: `${gp.id}-PRJ-04`,
        title: `${name} Concrete Pavement & Stormwater Sluice Drainage`,
        department: 'Public Works (PWD)',
        cost_inr: Math.round(totalBudget * 0.18),
        status: 'Planning',
        progress_pct: 20,
        priority: 'High',
        roi_multiplier: 2.4,
        impact_score: 86,
        beneficiaries: Math.round(gp.population * 0.65)
      }
    ]
  };
};

// 7. Multi-Horizon Forecast Scoped Data
export const getForecastForPanchayat = (gp: GramPanchayat) => {
  const baseWater = Math.round(gp.population * 75 / 1000); // kLD
  const basePower = Math.round(gp.households * 4.8); // kWh
  const baseSolar = Math.round(basePower * (gp.electricity_score / 185));

  return {
    horizon: ['Day 1', 'Day 2', 'Day 3', 'Day 7', 'Day 14', 'Day 30', '1 Year'],
    water_demand_kld: [baseWater, baseWater + 5, baseWater + 3, baseWater + 18, baseWater + 32, baseWater + 60, baseWater + 110],
    water_availability_kld: [baseWater + 180, baseWater + 180, baseWater + 175, baseWater + 160, baseWater + 145, baseWater + 120, baseWater + 240],
    electricity_demand_kwh: [basePower, basePower + 120, basePower + 80, basePower + 350, basePower + 600, basePower + 950, basePower + 1800],
    solar_yield_kwh: [baseSolar, baseSolar + 60, baseSolar + 30, baseSolar + 150, baseSolar + 300, baseSolar + 450, baseSolar + 1100],
    pci_road_decay_index: [81.0, 80.9, 80.8, 80.4, 79.8, 78.5, 71.0],
    crop_yield_health_score: [gp.agriculture_score, gp.agriculture_score, gp.agriculture_score + 1, gp.agriculture_score, gp.agriculture_score - 1, gp.agriculture_score + 3, gp.agriculture_score + 6]
  };
};

// 8. Sustainability Scoped Data
export const getSustainabilityForPanchayat = (gp: GramPanchayat) => {
  const name = getPanchayatDisplayName(gp);
  const baseSdgScore = gp.carbon_score || 87.2;
  return {
    overall_sdg_score: baseSdgScore,
    sustainability_score: baseSdgScore,
    renewable_energy_share: Math.round((gp.electricity_score || 90) * 0.5) || 45.4,
    water_recycling_rate: gp.water_score || 68.0,
    carbon_neutrality_target_year: 2028,
    green_cover_gain_5y: '+8.4%',
    carbon_footprint_reduction_pct: 34.5,
    water_recycled_liters: 120000,
    organic_farming_acres: Math.round(gp.area_sq_km * 45),
    sdg_goals: [
      { goal: 'SDG 3: Good Health & Well-being', score: Math.min(99, (gp.health_score || 85) + 3), status: 'On Track' },
      { goal: 'SDG 4: Quality Education', score: 88, status: 'On Track' },
      { goal: 'SDG 6: Clean Water & Sanitation', score: Math.min(99, (gp.water_score || 84) + 5), status: 'On Track' },
      { goal: 'SDG 7: Affordable & Clean Energy', score: Math.min(99, (gp.electricity_score || 91) + 2), status: 'Exceeding' },
      { goal: 'SDG 9: Industry, Innovation & Infrastructure', score: 82, status: 'On Track' },
      { goal: 'SDG 11: Sustainable Communities', score: gp.health_score || 86, status: 'On Track' },
      { goal: 'SDG 13: Climate Action', score: gp.carbon_score || 85, status: 'On Track' }
    ],
    sdg_indices: [
      { goal: 'SDG 6: Clean Water', score: Math.min(99, (gp.water_score || 84) + 5), status: 'On Target' },
      { goal: 'SDG 7: Affordable Clean Energy', score: Math.min(99, (gp.electricity_score || 91) + 2), status: 'Exceeding' },
      { goal: 'SDG 11: Sustainable Communities', score: gp.health_score || 86, status: 'On Target' },
      { goal: 'SDG 13: Climate Action', score: gp.carbon_score || 85, status: 'On Target' }
    ]
  };
};
