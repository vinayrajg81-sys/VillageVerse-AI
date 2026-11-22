// VillageVerse AI: National Hackathon-Grade AI Command Center
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { usePanchayat } from '../context/PanchayatContext';
import { api } from '../services/api';
import { 
  Activity, Users, Home, Sprout, Droplets, Zap, ShieldAlert, 
  Leaf, CloudSun, TrendingUp, Sparkles, AlertCircle, ArrowUpRight, 
  CheckCircle2, ArrowRight, ShieldCheck, RefreshCw, Layers, Compass,
  Volume2, VolumeX, Copy, Check, Radio, Play, Pause, ChevronRight,
  ExternalLink, BarChart3, Wind, Thermometer, Shield, Building2
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, BarChart, Bar 
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { AnimatedCounter } from '../components/common/AnimatedCounter';
import { DroneCameraPreview } from '../components/common/DroneCameraPreview';
import { HierarchicalGovernance } from '../components/common/HierarchicalGovernance';
import { IoTMonitoringCenter } from '../components/common/IoTMonitoringCenter';
import { PanchayatSelectorModal } from '../components/common/PanchayatSelectorModal';

export const Dashboard: React.FC = () => {
  const { user, role } = useAuth();
  const { t } = useLanguage();
  const { activePanchayat, panchayats, switchPanchayat } = usePanchayat();
  const navigate = useNavigate();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [dismissedAlert, setDismissedAlert] = useState(false);
  const [selectedMapSector, setSelectedMapSector] = useState<string | null>(null);
  const [selectorOpen, setSelectorOpen] = useState(false);

  useEffect(() => {
    loadDashboard();

    const channel = api.supabase
      .channel('realtime:village-profile-dashboard')
      .on('postgres_changes' as any, { event: '*', schema: 'public', table: 'village_profile' }, () => {
        loadDashboard();
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [activePanchayat.id]);

  const loadDashboard = async () => {
    setLoading(true);
    const res = await api.getDashboardStats(activePanchayat.id);
    setData(res);
    setLoading(false);
  };

  // Daily AI brief text for speech synthesis
  const dailySummaryText = `${activePanchayat.name} Command Briefing for today. Village Composite Health is rated optimal at ${activePanchayat.health_score} out of 100. Focus: ${activePanchayat.specialization}. Water reservoirs are holding at ${activePanchayat.water_score} percent capacity. Electricity grid reliability is rated at ${activePanchayat.electricity_score} percent, and carbon offset rating is ${activePanchayat.carbon_score} out of 100. Registered population is ${activePanchayat.population.toLocaleString('en-IN')} across ${activePanchayat.households.toLocaleString('en-IN')} households in ${activePanchayat.taluk} Taluk.`;

  const handleSpeakSummary = () => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported in this browser.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(dailySummaryText);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const handleCopySummary = () => {
    navigator.clipboard.writeText(dailySummaryText);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  const healthTrendData = [
    { day: 'Mon', score: Math.max(50, activePanchayat.health_score - 4), water: Math.max(50, activePanchayat.water_score - 4), energy: 88, agri: 84 },
    { day: 'Tue', score: Math.max(50, activePanchayat.health_score - 3), water: Math.max(50, activePanchayat.water_score - 2), energy: 89, agri: 85 },
    { day: 'Wed', score: Math.max(50, activePanchayat.health_score - 1), water: Math.max(50, activePanchayat.water_score - 3), energy: 90, agri: 86 },
    { day: 'Thu', score: Math.max(50, activePanchayat.health_score - 2), water: Math.max(50, activePanchayat.water_score - 1), energy: 91, agri: 87 },
    { day: 'Fri', score: activePanchayat.health_score, water: activePanchayat.water_score, energy: activePanchayat.electricity_score, agri: activePanchayat.agriculture_score },
    { day: 'Sat', score: activePanchayat.health_score, water: activePanchayat.water_score, energy: activePanchayat.electricity_score, agri: activePanchayat.agriculture_score },
    { day: 'Today', score: activePanchayat.health_score, water: activePanchayat.water_score, energy: activePanchayat.electricity_score, agri: activePanchayat.agriculture_score }
  ];

  const energyMixData = [
    { name: 'Solar Microgrid', value: 45.4, color: '#10b981' },
    { name: 'Grid Feeder', value: 44.6, color: '#06b6d4' },
    { name: 'Biogas/Backup', value: 10, color: '#f59e0b' }
  ];

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-14 h-14 rounded-full border-2 border-emerald-500/20 border-t-emerald-400 animate-spin shadow-lg shadow-emerald-500/20" />
          <p className="text-xs font-mono text-cyan-400 tracking-wider uppercase animate-pulse">
            Booting {activePanchayat.name} AI Command Operations Engine...
          </p>
        </div>
      </div>
    );
  }

  const { profile, kpis, weather, recent_activities } = data;

  // Real-time dynamic stats directly from activePanchayat
  const dynamicPop = activePanchayat.population;
  const dynamicHouseholds = activePanchayat.households;
  const dynamicHealth = activePanchayat.health_score;
  const dynamicWater = activePanchayat.water_score;
  const dynamicSolar = 120;
  const dynamicCarbon = activePanchayat.carbon_score;

  return (
    <div className="space-y-6">
      {/* 1. EMERGENCY TICKER / LIVE NOTIFICATION BAR */}
      {!dismissedAlert && (
        <div className="p-3 sm:p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 backdrop-blur-xl flex flex-wrap items-center justify-between gap-3 shadow-lg shadow-amber-950/30">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500" />
            </span>
            <div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase mr-2">
                {activePanchayat.district} Irrigation Notice
              </span>
              <span className="text-xs text-slate-200">
                KRS Dam inflow calibrated at 18,400 cusecs. {activePanchayat.name} canal gates scheduled for automated balance at 18:00 hrs.
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/water')}
              className="px-3 py-1 text-xs font-semibold rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 transition-colors"
            >
              Monitor Sluices
            </button>
            <button
              onClick={() => setDismissedAlert(true)}
              className="text-slate-400 hover:text-slate-200 text-xs px-2 py-1"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* 2. MULTI-LEVEL ADMINISTRATIVE DRILLDOWN */}
      <HierarchicalGovernance />

      {/* GRAM PANCHAYAT MANUAL SELECTOR & COUNCIL STATUS BAR */}
      <div className="glass-card p-3 sm:p-4 rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/40 via-slate-900/80 to-slate-900/90 flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center space-x-3 text-xs">
          <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Building2 className="w-4 h-4" />
          </span>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-slate-400 font-medium">Selected Gram Panchayat:</span>
              <strong className="text-white font-extrabold text-sm">{activePanchayat.name}</strong>
              <span className="px-2 py-0.2 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                {activePanchayat.id}
              </span>
            </div>
            <div className="text-[11px] text-amber-300 font-medium">
              {activePanchayat.name_kn} • {activePanchayat.specialization}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          {/* Quick Council Dropdown */}
          <select
            value={activePanchayat.id}
            onChange={(e) => switchPanchayat(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-emerald-300 font-bold focus:outline-none focus:border-cyan-400 cursor-pointer"
          >
            {panchayats.map((gp) => (
              <option key={gp.id} value={gp.id} className="bg-slate-900 text-white">
                {gp.name.replace(' Gram Panchayat', '')} ({gp.taluk})
              </option>
            ))}
          </select>

          {/* Manual Selector Modal Trigger */}
          <button
            onClick={() => setSelectorOpen(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-emerald-950/50 transition"
          >
            <Building2 className="w-4 h-4" />
            <span>Select Council Manually ({panchayats.length})</span>
          </button>
        </div>
      </div>

      {/* Panchayat Selector Modal */}
      <PanchayatSelectorModal
        isOpen={selectorOpen}
        onClose={() => setSelectorOpen(false)}
      />

      {/* 3. PALANTIR / TESLA STYLE COMMAND CENTER HERO */}
      <div className="relative overflow-hidden rounded-[24px] glass-card p-6 md:p-8 border border-cyan-500/20 bg-gradient-to-r from-slate-900/95 via-[#09152e]/90 to-slate-900/95 shadow-[0_24px_50px_rgba(0,0,0,0.6)]">
        <div className="absolute -top-16 -right-16 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2.5 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                {activePanchayat.id} • {activePanchayat.name.toUpperCase()}
              </span>
              <span className="px-3 py-0.5 rounded-full text-[10px] font-mono text-cyan-300 bg-cyan-950/60 border border-cyan-800/40">
                {activePanchayat.latitude.toFixed(4)}° N, {activePanchayat.longitude.toFixed(4)}° E
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-white/[0.06] text-slate-300 border border-white/10">
                Logged in as: <strong className="text-emerald-400">{role}</strong>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
              {activePanchayat.name} AI Operations Command Center
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Real-time multi-spectral IoT digital twin coordinating water distribution, clean solar microgrids,
              precision agriculture, and autonomous emergency detection across {activePanchayat.taluk} Taluk, {activePanchayat.district} District.
            </p>
          </div>

          {/* Quick HUD Action Buttons */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
            <button
              onClick={() => navigate('/digital-twin')}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-extrabold text-xs shadow-[0_0_30px_rgba(16,185,129,0.35)] transition-all flex items-center space-x-2"
            >
              <span>Explore 3D Digital Twin</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={loadDashboard}
              className="p-3 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 transition border border-white/[0.1] hover:border-cyan-500/40"
              title="Refresh Live Telemetry"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* EXECUTIVE VITAL GAUGES & ANIMATED KPI DECK */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
        {/* Animated Radial Village Health Score Gauge */}
        <div className="col-span-2 glass-card p-4 rounded-[20px] border-emerald-500/40 bg-gradient-to-br from-emerald-950/40 via-slate-900/80 to-slate-900/90 flex items-center justify-between shadow-xl">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                Village Health Score
              </span>
            </div>
            <div className="text-3xl sm:text-4xl font-black text-white flex items-baseline gap-1 font-mono">
              <AnimatedCounter value={dynamicHealth} />
              <span className="text-xs font-normal text-slate-400">/ 100</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400 font-mono">
              <TrendingUp className="w-3 h-3" />
              <span>Optimal Smart Tier 1</span>
            </div>
          </div>

          {/* Circular SVG Gauge Graphic */}
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-emerald-400 transition-all duration-1000 ease-out"
                strokeDasharray={`${dynamicHealth}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-xs sm:text-sm font-black font-mono text-emerald-300">
                {dynamicHealth}%
              </span>
            </div>
          </div>
        </div>

        {/* Population Counter */}
        <div className="glass-card p-4 rounded-[20px] border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider">POPULATION</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-lg sm:text-xl font-bold text-white font-mono">
            <AnimatedCounter value={dynamicPop} />
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">Gram Wards</span>
        </div>

        {/* Households */}
        <div className="glass-card p-4 rounded-[20px] border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider">HOUSEHOLDS</span>
            <Home className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-lg sm:text-xl font-bold text-white font-mono">
            <AnimatedCounter value={dynamicHouseholds} />
          </div>
          <span className="text-[10px] text-emerald-400 block mt-0.5">100% Piped Tap</span>
        </div>

        {/* Agriculture Score */}
        <div className="glass-card p-4 rounded-[20px] border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider">AGRI HEALTH</span>
            <Sprout className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-lg sm:text-xl font-bold text-emerald-400 font-mono">
            <AnimatedCounter value={activePanchayat.agriculture_score} suffix="%" />
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">{activePanchayat.area_sq_km} sq.km</span>
        </div>

        {/* Water Security */}
        <div className="glass-card p-4 rounded-[20px] border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider">WATER STORAGE</span>
            <Droplets className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-lg sm:text-xl font-bold text-cyan-400 font-mono">
            <AnimatedCounter value={dynamicWater} suffix="%" />
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">Reservoirs / Tanks</span>
        </div>

        {/* Solar Generation */}
        <div className="glass-card p-4 rounded-[20px] border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider">CLEAN SOLAR</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-lg sm:text-xl font-bold text-amber-400 font-mono">
            <AnimatedCounter value={dynamicSolar} suffix=" kWp" />
          </div>
          <span className="text-[10px] text-emerald-400 block mt-0.5">Community Array</span>
        </div>

        {/* Carbon Offset */}
        <div className="glass-card p-4 rounded-[20px] border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider">CARBON RATING</span>
            <Leaf className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-lg sm:text-xl font-bold text-teal-300 font-mono">
            <AnimatedCounter value={dynamicCarbon} suffix="/100" />
          </div>
          <span className="text-[10px] text-emerald-400 block mt-0.5">Eco Rural Shield</span>
        </div>
      </div>

      {/* 5. DRONE PREVIEW + MULTI-SECTOR TELEMETRY CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 Cols): Live UAV Drone Surveillance Feed */}
        <div className="lg:col-span-5">
          <DroneCameraPreview />
        </div>

        {/* Right Column (7 Cols): Multi-Department Real-Time Telemetry & Risk Meter */}
        <div className="lg:col-span-7 glass-card p-6 rounded-[24px] flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  Multi-Sector Department Trajectory
                </h3>
                <p className="text-xs text-slate-400">Continuous telemetry composite across Water, Solar Grid, and Agriculture</p>
              </div>

              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" /> Health
                </span>
                <span className="flex items-center gap-1.5 text-cyan-400">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" /> Water
                </span>
              </div>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={healthTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorHealthCmd" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.45}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorWaterCmd" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.35}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke="#475569" fontSize={11} tickLine={false} />
                  <YAxis domain={[60, 100]} stroke="#475569" fontSize={11} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0a1226', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '16px', fontSize: '11px', boxShadow: '0 20px 40px rgba(0,0,0,0.6)' }}
                  />
                  <Area type="monotone" dataKey="score" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorHealthCmd)" />
                  <Area type="monotone" dataKey="water" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorWaterCmd)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Risk Meter (Multi-threat radar bar) */}
          <div className="mt-4 pt-4 border-t border-slate-800/80">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-cyan-400" />
                AI Multi-Hazard Risk Matrix
              </span>
              <span className="text-[10px] font-mono text-emerald-400">All Hazards Controlled</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                  <span>Flood Risk</span>
                  <span className="text-emerald-400 font-mono">18% (Low)</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="w-[18%] h-full bg-emerald-400 rounded-full" />
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                  <span>Heatwave</span>
                  <span className="text-amber-400 font-mono">32% (Mod)</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="w-[32%] h-full bg-amber-400 rounded-full" />
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                  <span>Crop Disease</span>
                  <span className="text-emerald-400 font-mono">12% (Low)</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="w-[12%] h-full bg-emerald-400 rounded-full" />
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                  <span>Grid Peak Strain</span>
                  <span className="text-cyan-400 font-mono">24% (Low)</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="w-[24%] h-full bg-cyan-400 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 6. IOT MONITORING CENTER & EDGE TELEMETRY HUB */}
      <IoTMonitoringCenter />

      {/* 7. AI GENERATED DAILY SUMMARY + WEATHER & ENERGY MIX + INTERACTIVE MINI-MAP */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card 1: AI Generated Daily Executive Brief with Text-To-Speech */}
        <div className="glass-card p-6 rounded-[24px] border-emerald-500/20 bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-emerald-950/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">AI Generated Daily Brief</h3>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleSpeakSummary}
                  className={`p-2 rounded-xl text-xs transition border flex items-center gap-1 ${
                    isSpeaking
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold animate-pulse'
                      : 'bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 border-white/[0.1]'
                  }`}
                  title={isSpeaking ? 'Stop Audio Readout' : 'Listen with AI Voice Synthesizer'}
                >
                  {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  <span className="text-[10px] font-mono">{isSpeaking ? 'Playing' : 'Voice'}</span>
                </button>

                <button
                  onClick={handleCopySummary}
                  className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 transition border border-white/[0.1]"
                  title="Copy Briefing Text"
                >
                  {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3.5 rounded-2xl border border-white/[0.05] mb-3">
              "{dailySummaryText}"
            </p>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02]">
                <span className="text-slate-400">Total Municipal Budget</span>
                <span className="font-mono font-bold text-emerald-400">₹4.25 Cr (91.4% Spent)</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02]">
                <span className="text-slate-400">Citizen Complaints Open</span>
                <span className="font-mono font-bold text-cyan-400">3 Pending / 42 Resolved</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02]">
                <span className="text-slate-400">SDG Rural Sustainability</span>
                <span className="font-mono font-bold text-teal-300">88.5% Index Score</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/reports')}
            className="mt-4 w-full py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 text-xs font-semibold border border-white/[0.08] transition flex items-center justify-center gap-1.5"
          >
            <span>Generate Full Cabinet DPR Report</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 2: Interactive Village Mini-Map Radar */}
        <div className="glass-card p-6 rounded-[24px] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Compass className="w-4 h-4 text-cyan-400" />
                {activePanchayat.name.replace(/\s*(Rural\s*)?Gram\s*Panchayat/i, '').trim()} Spatial GIS Radar
              </h3>
              <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                4 Wards
              </span>
            </div>

            {/* Interactive SVG Radar Map */}
            <div className="relative aspect-video w-full rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden p-2">
              <svg className="w-full h-full" viewBox="0 0 200 120">
                {/* Ward Polygons */}
                <polygon
                  points="10,10 95,15 90,60 15,55"
                  fill={selectedMapSector === 'Ward 1' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(16, 185, 129, 0.15)'}
                  stroke="#10b981"
                  strokeWidth="0.8"
                  className="cursor-pointer transition-colors"
                  onClick={() => setSelectedMapSector('Ward 1')}
                />
                <text x="35" y="35" fill="#34d399" fontSize="6" fontFamily="monospace">Ward 1 (Admin)</text>

                <polygon
                  points="105,15 190,10 185,55 100,60"
                  fill={selectedMapSector === 'Ward 2' ? 'rgba(6, 182, 212, 0.4)' : 'rgba(6, 182, 212, 0.15)'}
                  stroke="#06b6d4"
                  strokeWidth="0.8"
                  className="cursor-pointer transition-colors"
                  onClick={() => setSelectedMapSector('Ward 2')}
                />
                <text x="125" y="35" fill="#38bdf8" fontSize="6" fontFamily="monospace">Ward 2 (PHC)</text>

                <polygon
                  points="15,65 90,70 85,110 10,105"
                  fill={selectedMapSector === 'Ward 3' ? 'rgba(234, 179, 8, 0.4)' : 'rgba(234, 179, 8, 0.15)'}
                  stroke="#eab308"
                  strokeWidth="0.8"
                  className="cursor-pointer transition-colors"
                  onClick={() => setSelectedMapSector('Ward 3')}
                />
                <text x="30" y="90" fill="#facc15" fontSize="6" fontFamily="monospace">Ward 3 (Agri)</text>

                <polygon
                  points="100,70 185,65 190,105 105,110"
                  fill={selectedMapSector === 'Ward 4' ? 'rgba(99, 102, 241, 0.4)' : 'rgba(99, 102, 241, 0.15)'}
                  stroke="#6366f1"
                  strokeWidth="0.8"
                  className="cursor-pointer transition-colors"
                  onClick={() => setSelectedMapSector('Ward 4')}
                />
                <text x="125" y="90" fill="#a5b4fc" fontSize="6" fontFamily="monospace">Ward 4 (Solar)</text>

                {/* Central Canal Water Line */}
                <path
                  d="M0,60 Q100,65 200,60"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                  strokeDasharray="2,2"
                  fill="none"
                />

                {/* Active Blips */}
                <circle cx="50" cy="40" r="2.5" fill="#10b981" className="animate-ping" />
                <circle cx="140" cy="38" r="2.5" fill="#06b6d4" className="animate-ping" />
                <circle cx="150" cy="85" r="2.5" fill="#f59e0b" className="animate-ping" />
              </svg>

              <div className="absolute bottom-2 left-2 text-[10px] font-mono text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-700">
                Selected: <span className="text-cyan-300 font-bold">{selectedMapSector || 'All 4 Wards Active'}</span>
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
            <span>Asset Densities: 10 Core 3D IoT Nodes</span>
            <button
              onClick={() => navigate('/digital-twin')}
              className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
            >
              <span>Full Map</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Card 3: Live Weather + Clean Energy Mix */}
        <div className="glass-card p-6 rounded-[24px] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <CloudSun className="w-4 h-4 text-amber-400" />
                Micro-Climate & Power Share
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 font-bold font-mono text-[10px]">
                AQI {weather.aqi} • Good
              </span>
            </div>

            {/* Weather Metric Badges */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-amber-400" />
                <div>
                  <span className="text-[10px] text-slate-400 block">Temperature</span>
                  <span className="text-xs font-bold text-slate-200">{weather.temp}°C ({weather.condition})</span>
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-2">
                <Wind className="w-4 h-4 text-cyan-400" />
                <div>
                  <span className="text-[10px] text-slate-400 block">Wind Velocity</span>
                  <span className="text-xs font-bold text-slate-200">{weather.wind_kmh} km/h (WSW)</span>
                </div>
              </div>
            </div>

            {/* Clean Energy Mix Pie */}
            <div className="h-32 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={energyMixData}
                    cx="50%"
                    cy="50%"
                    innerRadius={35}
                    outerRadius={55}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {energyMixData.map((entry, index) => (
                      <Cell key={`cell-dash-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0a1226', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '11px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-1 text-xs">
              {energyMixData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-slate-300">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    {item.name}
                  </span>
                  <span className="font-mono font-bold text-slate-200">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => navigate('/electricity')}
            className="mt-3 text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center justify-center gap-1 py-1.5"
          >
            <span>View Solar Microgrid Storage</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 7. TODAY'S AI RECOMMENDATIONS + LIVE RECENT ACTIVITIES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's High-Impact AI Recommendations */}
        <div className="lg:col-span-2 glass-card p-6 rounded-[24px]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              Today's Autonomous AI Recommendations
            </h3>
            <span className="text-[10px] font-mono text-emerald-400">3 Optimized Directives</span>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-cyan-500/20 hover:border-cyan-500/40 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300">
                    WATER MANAGEMENT
                  </span>
                  <span className="text-[10px] text-slate-400">Priority: High</span>
                </div>
                <h4 className="text-sm font-bold text-white">
                  Divert {activePanchayat.name.replace(/\s*(Rural\s*)?Gram\s*Panchayat/i, '').trim()} Lake Overflow to Borewell Cluster #4
                </h4>
                <p className="text-xs text-slate-300">
                  Lake level reached 91%. Recharging aquifer cluster now prevents downstream canal siltation and secures 45 days summer buffer.
                </p>
              </div>
              <button
                onClick={() => navigate('/water')}
                className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition shrink-0"
              >
                Execute Diversion
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-emerald-500/20 hover:border-emerald-500/40 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300">
                    PRECISION AGRICULTURE
                  </span>
                  <span className="text-[10px] text-slate-400">Priority: Routine</span>
                </div>
                <h4 className="text-sm font-bold text-white">
                  Broadcast Sugarcane Soil Moisture Advisory
                </h4>
                <p className="text-xs text-slate-300">
                  Sensor Sector B indicates topsoil drying. Notify 620 registered Mandya sugarcane growers to irrigate tonight during off-peak solar tariffs.
                </p>
              </div>
              <button
                onClick={() => navigate('/agriculture')}
                className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition shrink-0"
              >
                Send SMS Advisory
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-amber-500/20 hover:border-amber-500/40 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300">
                    ENERGY GRID
                  </span>
                  <span className="text-[10px] text-slate-400">Priority: Routine</span>
                </div>
                <h4 className="text-sm font-bold text-white">
                  Automate Smart Streetlight Dimming Schedule
                </h4>
                <p className="text-xs text-slate-300">
                  Enable 40% ambient dimming between 01:00 and 04:30 across 68 Ward 1 & 4 LED poles to conserve 18 kWh battery storage.
                </p>
              </div>
              <button
                onClick={() => navigate('/electricity')}
                className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition shrink-0"
              >
                Activate Schedule
              </button>
            </div>
          </div>
        </div>

        {/* Live Palantir Telemetry Stream */}
        <div className="glass-card p-6 rounded-[24px]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              Live Telemetry Stream
            </h3>
            <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Real-time
            </span>
          </div>

          <div className="space-y-3 text-xs">
            {recent_activities.map((act: any) => (
              <div key={act.id} className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <p className="text-slate-200 leading-snug">{act.text}</p>
                  <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">{act.time}</span>
                </div>
              </div>
            ))}

            <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex items-start space-x-2.5">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-slate-200 leading-snug">
                  {activePanchayat.name.replace(/\s*(Rural\s*)?Gram\s*Panchayat/i, '').trim()} Primary Health Centre cold chain vaccine temperature validated at 4.1°C
                </p>
                <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">5 mins ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
