// VillageVerse AI: Interactive GIS Spatial Mapping Center & Cadastral Vector Map
import React, { useState } from 'react';
import { usePanchayat } from '../../context/PanchayatContext';
import { 
  Map, Layers, Filter, Compass, MapPin, Eye, CheckCircle2, 
  Droplets, Zap, HeartPulse, GraduationCap, Building2, 
  MessageSquareWarning, Sliders, ExternalLink, RefreshCw 
} from 'lucide-react';

interface GISFeature {
  id: string;
  name: string;
  category: 'Boundary' | 'Roads' | 'Water' | 'Health' | 'Education' | 'Electricity' | 'Admin' | 'Complaints' | 'Projects';
  lat: number;
  lng: number;
  x: number; // SVG percent coordinate 0 - 100
  y: number;
  status: string;
  details: string;
  color: string;
}

export const GISMapViewer: React.FC<{ onSelectAsset?: (assetName: string) => void }> = ({ onSelectAsset }) => {
  const { activePanchayat, panchayats, switchPanchayat } = usePanchayat();
  const [activeLayers, setActiveLayers] = useState<{ [key: string]: boolean }>({
    Boundary: true,
    Roads: true,
    Water: true,
    Health: true,
    Education: true,
    Electricity: true,
    Admin: true,
    Complaints: true,
    Projects: true
  });
  const [selectedFeature, setSelectedFeature] = useState<GISFeature | null>(null);

  const cleanName = activePanchayat.name.replace(' Gram Panchayat', '');

  const features: GISFeature[] = [
    // Administrative & Public Assets
    { id: 'GIS-01', name: `${cleanName} Administrative Bhavan`, category: 'Admin', lat: activePanchayat.latitude + 0.0002, lng: activePanchayat.longitude + 0.0001, x: 50, y: 48, status: 'Operational', details: `12 Panchayat Offices, Hall & Citizen Seva Kendra (${activePanchayat.taluk} Taluk)`, color: '#3b82f6' },
    { id: 'GIS-02', name: `${cleanName} Primary Health Centre (PHC)`, category: 'Health', lat: activePanchayat.latitude - 0.0005, lng: activePanchayat.longitude + 0.0021, x: 62, y: 55, status: 'Operational', details: '12 Beds, 1 Labor Room, 24x7 Emergency Doctor & Tele-ICU', color: '#10b981' },
    { id: 'GIS-03', name: `${cleanName} Government High School`, category: 'Education', lat: activePanchayat.latitude + 0.0015, lng: activePanchayat.longitude - 0.0014, x: 38, y: 38, status: 'Operational', details: `${Math.round(activePanchayat.population * 0.08)} Students Enrolled, Smart Classrooms`, color: '#8b5cf6' },
    { id: 'GIS-04', name: 'Ward 2 Anganwadi Child Care Centre', category: 'Education', lat: activePanchayat.latitude + 0.0031, lng: activePanchayat.longitude - 0.0003, x: 45, y: 28, status: 'Operational', details: '45 Toddlers, Nutrition Buffer Stock Verified', color: '#ec4899' },
    
    // Water Resources
    { id: 'GIS-05', name: `${cleanName} Elevated Reservoir (JJM)`, category: 'Water', lat: activePanchayat.latitude + 0.0018, lng: activePanchayat.longitude + 0.0013, x: 58, y: 35, status: 'Optimal', details: `${Math.round(activePanchayat.population * 35).toLocaleString('en-IN')} Liters Capacity, ${activePanchayat.water_score}% Full`, color: '#06b6d4' },
    { id: 'GIS-06', name: `${cleanName} Kere (Main Village Lake)`, category: 'Water', lat: activePanchayat.latitude - 0.0022, lng: activePanchayat.longitude - 0.0036, x: 25, y: 65, status: 'Optimal', details: `${Math.round(activePanchayat.area_sq_km * 0.12 * 10) / 10} Million Cu.M Storage, Bund Reinforced`, color: '#0284c7' },
    { id: 'GIS-07', name: 'Deep Solar Agricultural Borewell #3', category: 'Water', lat: activePanchayat.latitude + 0.0039, lng: activePanchayat.longitude + 0.0030, x: 68, y: 22, status: 'Active Pumping', details: '480 ft Depth, 480 Liters/Minute Discharge', color: '#38bdf8' },

    // Electricity & Solar
    { id: 'GIS-08', name: `${cleanName} Community Solar Microgrid`, category: 'Electricity', lat: activePanchayat.latitude + 0.0047, lng: activePanchayat.longitude - 0.0031, x: 30, y: 20, status: 'Operational', details: `${Math.round(activePanchayat.electricity_score * 1.2)} kWp Capacity, Battery Storage Bank`, color: '#f59e0b' },
    { id: 'GIS-09', name: 'Main 250 kVA Step-Down Transformer', category: 'Electricity', lat: activePanchayat.latitude + 0.0008, lng: activePanchayat.longitude + 0.0005, x: 52, y: 44, status: 'Operational', details: `Current Grid Stability ${activePanchayat.electricity_score}%, Feeder Normal`, color: '#eab308' },

    // Citizen Complaints
    { id: 'GIS-10', name: `Pothole Cluster near ${cleanName} Cross`, category: 'Complaints', lat: activePanchayat.latitude + 0.0007, lng: activePanchayat.longitude - 0.0011, x: 42, y: 42, status: 'Assigned', details: 'CMP-2026-082 • Patch repair scheduled for Thursday', color: '#ef4444' },
    { id: 'GIS-11', name: 'Acoustic Pipe Leak near Ward 2 Culvert', category: 'Complaints', lat: activePanchayat.latitude + 0.0003, lng: activePanchayat.longitude + 0.0012, x: 44, y: 52, status: 'In Progress', details: 'CMP-2026-081 • Valve gasket replacement ongoing', color: '#f97316' },

    // Development Projects
    { id: 'GIS-12', name: `${activePanchayat.specialization}`, category: 'Projects', lat: activePanchayat.latitude - 0.0015, lng: activePanchayat.longitude - 0.0018, x: 28, y: 62, status: 'In Progress', details: `15th Finance Commission rural development project (${activePanchayat.taluk} Taluk)`, color: '#10b981' }
  ];

  const toggleLayer = (cat: string) => {
    setActiveLayers(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  const handleFeatureClick = (feat: GISFeature) => {
    setSelectedFeature(feat);
    if (onSelectAsset) onSelectAsset(feat.name);
  };

  const visibleFeatures = features.filter(f => activeLayers[f.category]);

  return (
    <div className="glass-card p-5 rounded-3xl border border-white/[0.08] space-y-4">
      {/* 1. Map Header & GP Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Map className="w-4 h-4" />
            </span>
            <h2 className="text-sm font-bold text-white tracking-tight">
              Interactive 2D GIS Cadastral Map & Spatial Geo-Layer
            </h2>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 font-mono font-bold">
              Cadastral Scale 1:2500
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Georeferenced layer showing village administrative boundaries, JJM pipelines, grid transformers, complaints & capital works.
          </p>
        </div>

        {/* Gram Panchayat Filter Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400 font-semibold hidden sm:inline">Panchayat:</label>
          <select
            value={activePanchayat.id}
            onChange={(e) => switchPanchayat(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-emerald-400 font-semibold focus:outline-none focus:border-emerald-500"
          >
            {panchayats.map((gp) => (
              <option key={gp.id} value={gp.id}>
                {gp.name} ({gp.id})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 2. Layer Toggle Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        <span className="text-[10px] text-slate-500 font-mono uppercase font-bold mr-1">Layers:</span>
        {Object.keys(activeLayers).map((layer) => (
          <button
            key={layer}
            onClick={() => toggleLayer(layer)}
            className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold border transition shrink-0 ${
              activeLayers[layer]
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-sm'
                : 'bg-slate-900/60 text-slate-500 border-slate-800 hover:text-slate-300'
            }`}
          >
            {layer}
          </button>
        ))}
      </div>

      {/* 3. Interactive GIS Map Canvas & Inspector Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* SVG Spatial Map */}
        <div className="lg:col-span-2 relative h-[440px] rounded-2xl bg-gradient-to-br from-slate-950 via-[#06101e] to-slate-950 border border-slate-800 overflow-hidden shadow-inner">
          {/* Top-Left Coordinate HUD */}
          <div className="absolute top-3 left-3 z-10 bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-[10px] text-slate-300 font-mono space-y-0.5">
            <div className="text-emerald-400 font-bold">{activePanchayat.latitude.toFixed(4)}° N, {activePanchayat.longitude.toFixed(4)}° E</div>
            <div className="text-slate-400 font-semibold">{activePanchayat.name} ({activePanchayat.id})</div>
            <div className="text-slate-500">Datum: WGS84 • Elevation: 672m</div>
          </div>

          {/* Compass Rose */}
          <div className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-slate-900/90 border border-slate-700 flex items-center justify-center text-cyan-400">
            <Compass className="w-5 h-5 animate-pulse" />
          </div>

          <svg className="w-full h-full select-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Grid Lines */}
            <defs>
              <pattern id="gisGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#gisGrid)" />

            {/* Village Outer Boundary Polygon */}
            {activeLayers.Boundary && (
              <polygon
                points="18,15 45,10 75,18 88,40 82,75 60,88 35,85 15,65 12,35"
                fill="rgba(16, 185, 129, 0.04)"
                stroke="#10b981"
                strokeWidth="0.8"
                strokeDasharray="2,1"
              />
            )}

            {/* Shivalli Lake Reservoir Basin */}
            {activeLayers.Water && (
              <path
                d="M 18,60 C 22,50 32,55 35,68 C 36,78 26,82 18,78 Z"
                fill="rgba(6, 182, 212, 0.25)"
                stroke="#06b6d4"
                strokeWidth="0.8"
              />
            )}

            {/* Road Networks */}
            {activeLayers.Roads && (
              <>
                {/* SH-17 Highway */}
                <path d="M 0,45 Q 40,48 100,42" fill="none" stroke="#64748b" strokeWidth="1.8" />
                {/* Secondary Cross Road */}
                <path d="M 50,0 Q 52,50 48,100" fill="none" stroke="#475569" strokeWidth="1.2" />
                {/* Lake Access Road */}
                <path d="M 45,48 Q 30,55 24,65" fill="none" stroke="#475569" strokeWidth="0.8" strokeDasharray="1,1" />
              </>
            )}

            {/* Feature Markers / Hotspots */}
            {visibleFeatures.map((feat) => {
              const isSelected = selectedFeature?.id === feat.id;

              return (
                <g 
                  key={feat.id} 
                  onClick={() => handleFeatureClick(feat)}
                  className="cursor-pointer transition-transform hover:scale-125"
                >
                  {/* Outer Pulsing Glow on Selected */}
                  {isSelected && (
                    <circle cx={feat.x} cy={feat.y} r="4.5" fill={feat.color} opacity="0.3" className="animate-ping" />
                  )}
                  {/* Core Pin */}
                  <circle cx={feat.x} cy={feat.y} r="2.2" fill={feat.color} stroke="#ffffff" strokeWidth="0.6" />
                  <text 
                    x={feat.x + 3} 
                    y={feat.y + 1} 
                    fill="#e2e8f0" 
                    fontSize="2.4" 
                    fontFamily="monospace"
                    className="pointer-events-none drop-shadow"
                  >
                    {feat.name.split(' ')[0]}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Selected Asset GIS Inspector Deck */}
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col justify-between">
          {selectedFeature ? (
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                    {selectedFeature.id}
                  </span>
                  <h3 className="text-sm font-bold text-white mt-1 leading-snug">
                    {selectedFeature.name}
                  </h3>
                  <span className="text-[11px] text-slate-400">{selectedFeature.category} Geo-Node</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                  {selectedFeature.status}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1 text-xs">
                <div className="text-slate-400 text-[11px]">Geo Coordinates:</div>
                <div className="font-mono text-cyan-300 font-semibold">{selectedFeature.lat}° N, {selectedFeature.lng}° E</div>
              </div>

              <div className="space-y-1 text-xs">
                <span className="text-slate-400 font-medium">Telemetry & Infrastructure Details:</span>
                <p className="text-slate-300 bg-white/[0.03] p-2.5 rounded-xl border border-white/[0.05] leading-relaxed">
                  {selectedFeature.details}
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Geospatial verification confirmed with Survey of India benchmark.</span>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 text-xs space-y-2">
              <MapPin className="w-8 h-8 text-slate-600" />
              <p>Click any map pin on the GIS map to inspect live geotagged telemetry, complaint tickets, or infrastructure data.</p>
            </div>
          )}

          <div className="pt-3 border-t border-white/[0.06] text-[11px] text-slate-500 flex items-center justify-between">
            <span>Spatial Cadastre GP-042</span>
            <span className="text-emerald-400 font-mono">{visibleFeatures.length} Active Nodes</span>
          </div>
        </div>
      </div>
    </div>
  );
};
