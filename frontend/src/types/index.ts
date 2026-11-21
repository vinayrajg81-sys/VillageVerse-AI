// VillageVerse AI: Comprehensive TypeScript Interfaces

export type UserRole = 
  | 'Super Admin'
  | 'Admin'
  | 'Panchayat Officer'
  | 'Engineer'
  | 'Agriculture Officer'
  | 'Healthcare Officer'
  | 'Citizen';

export interface User {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  role: UserRole;
  department: string;
  panchayat_id: string;
  is_verified: boolean;
  created_at: string;
}

export interface VillageProfile {
  id: string;
  name: string;
  taluk: string;
  district: string;
  state: string;
  pincode: string;
  latitude: number;
  longitude: number;
  population: number;
  households: number;
  area_sq_km: number;
  health_score: number;
  agriculture_score: number;
  water_score: number;
  electricity_score: number;
  carbon_score: number;
  flood_risk: string;
  weather: {
    temp: number;
    condition: string;
    humidity: number;
    wind_kmh: number;
    rainfall_mm: number;
    aqi: number;
    aqi_status: string;
  };
}

export interface DigitalTwinAsset {
  id: string;
  name: string;
  category: 'Building' | 'Water Tank' | 'Borewell' | 'Lake' | 'Road' | 'Street Light' | 'Solar Panel' | 'School' | 'Hospital' | 'Anganwadi' | 'Pipeline' | 'Electric Pole' | 'Dumpyard' | string;
  status: 'Operational' | 'Needs Maintenance' | 'Critical' | 'Under Construction' | string;
  health_score?: number;
  healthScore?: number;
  latitude: number;
  longitude: number;
  position3D: { x: number; y: number; z: number };
  position_3d?: { x: number; y: number; z: number };
  size?: [number, number, number];
  color?: string;
  install_date?: string;
  installDate?: string;
  last_inspected?: string;
  lastInspected?: string;
  capacity: string;
  ai_recommendation?: string;
  aiRecommendation?: string;
  specifications: Record<string, any>;
  maintenance_history?: Array<{ date: string; action: string; cost: number }>;
}

export interface CropInfo {
  name: string;
  area_acres: number;
  share_pct: number;
  avg_yield_tonnes: number;
  health: string;
}

export interface SoilSensor {
  id: string;
  sector: string;
  moisture_pct: number;
  ph: number;
  n: number;
  p: number;
  k: number;
  temp_c: number;
}

export interface MandiPrice {
  commodity: string;
  market: string;
  price: string;
  trend: string;
}

export interface WaterResourceItem {
  name: string;
  type: string;
  level_pct: number;
  status: string;
}

export interface LeakAlert {
  id: string;
  location: string;
  flow_variance_pct: number;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  detected_at: string;
}

export interface ScheduledRepair {
  id: string;
  road: string;
  stretch: string;
  damage: string;
  cost: number;
  date: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
}

export interface TransformerNode {
  id: string;
  name: string;
  rating: string;
  load_pct: number;
  health_pct: number;
  temp_c: number;
}

export interface SolarUnit {
  name: string;
  capacity_kw: number;
  today_yield_kwh: number;
}

export interface AmbulanceInfo {
  id: string;
  vehicle: string;
  status: string;
  lat: number;
  lng: number;
  driver: string;
}

export interface MedicineItem {
  medicine: string;
  stock_units: number;
  status: 'Sufficient' | 'Re-order needed' | 'Critical';
}

export interface SchoolInfo {
  name: string;
  type: string;
  students: number;
  teachers: number;
  smart_classrooms: number;
  pass_pct: number;
}

export interface SmartBin {
  id: string;
  location: string;
  type: 'Wet Waste' | 'Dry Waste';
  fill_pct: number;
  status: string;
}

export interface WasteVehicle {
  id: string;
  name: string;
  route: string;
  driver: string;
  status: string;
  battery_pct: number;
}

export interface DisasterRisk {
  hazard: string;
  risk_pct: number;
  status: string;
  details: string;
}

export interface SafeShelter {
  name: string;
  capacity: number;
  food_stock_days: number;
  generator: boolean;
  lat: number;
  lng: number;
}

export interface PlannerProject {
  id: string;
  title: string;
  department: string;
  cost_inr: number;
  roi_multiplier: number;
  impact_score: number;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  beneficiaries: number;
  status: 'Proposed' | 'Approved' | 'Tendering' | 'In Execution' | 'Completed';
}

export interface Complaint {
  id: string;
  citizen_name: string;
  citizen_phone: string;
  category: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  title: string;
  description: string;
  location_address: string;
  lat?: number;
  lng?: number;
  image_url?: string | null;
  audio_url?: string | null;
  status: 'Submitted' | 'Assigned' | 'In Progress' | 'Resolved' | 'Rejected';
  assigned_officer?: string;
  assigned_department?: string;
  ai_category_confidence?: number;
  ai_urgency_score?: number;
  timeline: Array<{ time: string; note: string }>;
}
