// VillageVerse AI: Advanced Policy, Infrastructure & Spatial Simulation Engine
import React, { useState, useEffect } from 'react';
import { usePanchayat } from '../context/PanchayatContext';
import { api } from '../services/api';
import confetti from 'canvas-confetti';
import { 
  Sliders, Sparkles, TrendingUp, DollarSign, Sprout, Leaf, 
  Droplets, Zap, RotateCcw, Award, CheckCircle2, FileText, 
  Download, Eye, Shield, Activity, Building, Sun, HeartPulse
} from 'lucide-react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell 
} from 'recharts';

export const WhatIfSimulation: React.FC = () => {
  const { activePanchayat } = usePanchayat();
  const gpDisplayName = activePanchayat.name.replace(/\s*(Rural\s*)?Gram\s*Panchayat/i, '').trim() || activePanchayat.name;

  // 10 Simulation Levers
  const [waterTanks, setWaterTanks] = useState<number>(1);
  const [roadRepairKm, setRoadRepairKm] = useState<number>(4);
  const [hospitals, setHospitals] = useState<number>(0);
  const [schools, setSchools] = useState<number>(1);
  const [solarKw, setSolarKw] = useState<number>(60);
  const [treesPlanted, setTreesPlanted] = useState<number>(5000);
  const [lakesConstructed, setLakesConstructed] = useState<number>(1);
  const [dripIrrigationAcres, setDripIrrigationAcres] = useState<number>(250);
  const [mobileClinics, setMobileClinics] = useState<number>(1);
  const [smartStreetLights, setSmartStreetLights] = useState<number>(40);

  const [simResults, setSimResults] = useState<any>(null);
  const [proposalExported, setProposalExported] = useState(false);

  // Run simulation reactively whenever any lever changes
  useEffect(() => {
    runCurrentSimulation();
  }, [
    waterTanks, roadRepairKm, hospitals, schools, solarKw, 
    treesPlanted, lakesConstructed, dripIrrigationAcres, 
    mobileClinics, smartStreetLights
  ]);

  const runCurrentSimulation = async () => {
    // Dynamic composite math based on village baseline (Shivalli 86/100)
    const baseHealth = 86;
    const baseWater = 84;
    const baseCarbon = 79;
    const basePower = 91;
    const baseAgri = 88;

    // Gains calculation
    const healthGain = Math.min(
      13, 
      (waterTanks * 1.5) + (roadRepairKm * 0.4) + (hospitals * 3.5) + 
      (schools * 1.8) + (solarKw * 0.03) + (treesPlanted * 0.0003) + 
      (lakesConstructed * 2) + (dripIrrigationAcres * 0.008) + 
      (mobileClinics * 1.2) + (smartStreetLights * 0.03)
    );

    const simulatedHealth = Math.min(99, Math.round(baseHealth + healthGain));
    const waterScore = Math.min(99, Math.round(baseWater + (waterTanks * 3) + (lakesConstructed * 4) + (dripIrrigationAcres * 0.015)));
    const carbonScore = Math.min(99, Math.round(baseCarbon + (treesPlanted * 0.0007) + (solarKw * 0.05)));
    const cropYieldGain = +(2.5 + (lakesConstructed * 3.5) + (dripIrrigationAcres * 0.03)).toFixed(1);
    
    // Total capital outlay in INR Lakhs
    const capitalCostLakhs = Math.round(
      (waterTanks * 22) + (roadRepairKm * 18) + (hospitals * 110) + 
      (schools * 45) + (solarKw * 0.65) + (treesPlanted * 0.002) + 
      (lakesConstructed * 28) + (dripIrrigationAcres * 0.25) + 
      (mobileClinics * 32) + (smartStreetLights * 0.15)
    );

    const annualPowerSavings = Math.round(solarKw * 950 + smartStreetLights * 320);
    const carbonOffsetTonnes = Math.round((solarKw * 1.4) + (treesPlanted * 0.025));
    const mgnregaDays = Math.round((treesPlanted * 0.4) + (roadRepairKm * 600) + (lakesConstructed * 1800));

    const results = {
      current_village_health_score: baseHealth,
      simulated_village_health_score: simulatedHealth,
      health_score_gain: +(simulatedHealth - baseHealth),
      estimated_capital_outlay_lakhs: capitalCostLakhs,
      water_security_score: waterScore,
      carbon_sustainability_score: carbonScore,
      crop_yield_gain_pct: cropYieldGain,
      annual_power_savings_inr: annualPowerSavings,
      carbon_offset_tonnes: carbonOffsetTonnes,
      mgnrega_mandays: mgnregaDays,
      roi_payback_years: (capitalCostLakhs / (annualPowerSavings / 100000 + 4.2)).toFixed(1)
    };

    setSimResults(results);

    // Confetti celebration if health score reaches 95+
    if (simulatedHealth >= 95) {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 }
      });
    }
  };

  const resetSimulation = () => {
    setWaterTanks(0);
    setRoadRepairKm(0);
    setHospitals(0);
    setSchools(0);
    setSolarKw(0);
    setTreesPlanted(0);
    setLakesConstructed(0);
    setDripIrrigationAcres(0);
    setMobileClinics(0);
    setSmartStreetLights(0);
  };

  const handleExportProposal = () => {
    setProposalExported(true);
    const content = `
================================================================================
GOVERNMENT OF KARNATAKA - PANCHAYATI RAJ & RURAL DEVELOPMENT
DETAILED PROJECT REPORT (DPR) PROPOSAL: ${activePanchayat.name.toUpperCase()} (${activePanchayat.id})
================================================================================
Generated via VillageVerse AI What-If Simulation Sandbox
Timestamp: ${new Date().toLocaleString()}

1. EXECUTIVE SUMMARY
• Target Infrastructure Interventions:
  - Overhead Water Tanks (250kL): ${waterTanks} units
  - Bitumen Road Widening & Resurfacing: ${roadRepairKm} km
  - Primary Health Center & Tele-ICU Wing: ${hospitals} units
  - Smart Digital School Wings: ${schools} units
  - Clean Solar PV Capacity: ${solarKw} kWp
  - Native Miyawaki Forest Plantation: ${treesPlanted} trees
  - Rainwater Harvesting Lakes & Check Dams: ${lakesConstructed} units
  - Subsurface Drip Fertigation: ${dripIrrigationAcres} acres
  - Mobile Tele-Medicine Clinics: ${mobileClinics} units
  - IoT Smart Dimming Streetlight Poles: ${smartStreetLights} units

2. STRATEGIC OUTCOMES & IMPACT
• Composite Village Health Score: 86/100 -> ${simResults?.simulated_village_health_score}/100 (+${simResults?.health_score_gain} pts)
• Estimated Capital Investment: ₹${simResults?.estimated_capital_outlay_lakhs} Lakhs
• Estimated ROI Payback Period: ${simResults?.roi_payback_years} Years
• Projected Agricultural Yield Surge: +${simResults?.crop_yield_gain_pct}%
• Annual Clean Energy Savings: ₹${simResults?.annual_power_savings_inr?.toLocaleString()}
• Net Carbon Emissions Offset: ${simResults?.carbon_offset_tonnes} Metric Tonnes CO2e/yr
• MGNREGA Employment Generated: ${simResults?.mgnrega_mandays?.toLocaleString()} Man-days

Submitted for Sanction by Mandya Zilla Panchayat Executive Engineer & Gram Sabha.
================================================================================
`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${gpDisplayName}_DPR_Proposal_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setTimeout(() => setProposalExported(false), 3000);
  };

  if (!simResults) return null;

  const radarData = [
    { subject: 'Village Health', baseline: 86, simulated: simResults.simulated_village_health_score },
    { subject: 'Water Security', baseline: 84, simulated: simResults.water_security_score },
    { subject: 'Clean Energy', baseline: 91, simulated: Math.min(99, 91 + Math.round(solarKw / 18)) },
    { subject: 'Carbon Neutrality', baseline: 79, simulated: simResults.carbon_sustainability_score },
    { subject: 'Crop Yield', baseline: 88, simulated: Math.min(99, 88 + Math.round(simResults.crop_yield_gain_pct)) }
  ];

  const comparisonBars = [
    { name: 'Baseline', score: simResults.current_village_health_score, fill: '#64748b' },
    { name: 'Simulated', score: simResults.simulated_village_health_score, fill: '#10b981' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
            <Sliders className="w-6 h-6 text-emerald-400" />
            AI What-If Policy & Infrastructure Simulation Sandbox
          </h1>
          <p className="text-xs text-slate-400">
            Dynamically adjust 10 rural development levers and watch health score, water availability, carbon balance & budget update in real-time
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportProposal}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold text-xs shadow-lg transition flex items-center gap-1.5"
          >
            <FileText className="w-4 h-4" />
            <span>{proposalExported ? 'Downloaded DPR' : 'Export Cabinet DPR'}</span>
          </button>

          <button
            onClick={resetSimulation}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center space-x-1.5 transition"
            title="Reset All Levers"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Top Simulated Score Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="glass-card p-3.5 rounded-2xl border-emerald-500/40 bg-gradient-to-br from-emerald-950/40 to-slate-900 shadow-lg">
          <span className="text-[11px] text-slate-400">Predicted Health</span>
          <div className="text-2xl font-black text-emerald-400 mt-1 flex items-baseline gap-1 font-mono">
            {simResults.simulated_village_health_score}
            <span className="text-xs font-bold text-emerald-300">
              (+{simResults.health_score_gain})
            </span>
          </div>
          <span className="text-[10px] text-slate-400">Baseline: 86 / 100</span>
        </div>

        <div className="glass-card p-3.5 rounded-2xl border border-slate-800">
          <span className="text-[11px] text-slate-400">Capital Outlay</span>
          <div className="text-xl font-bold text-white mt-1 font-mono">
            ₹{simResults.estimated_capital_outlay_lakhs} L
          </div>
          <span className="text-[10px] text-slate-400">Payback: {simResults.roi_payback_years} yrs</span>
        </div>

        <div className="glass-card p-3.5 rounded-2xl border border-slate-800">
          <span className="text-[11px] text-slate-400">Crop Yield Surge</span>
          <div className="text-xl font-bold text-emerald-400 mt-1 font-mono">
            +{simResults.crop_yield_gain_pct}%
          </div>
          <span className="text-[10px] text-slate-400">Drip & Soil Benefit</span>
        </div>

        <div className="glass-card p-3.5 rounded-2xl border border-slate-800">
          <span className="text-[11px] text-slate-400">Water Security</span>
          <div className="text-xl font-bold text-cyan-400 mt-1 font-mono">
            {simResults.water_security_score} / 100
          </div>
          <span className="text-[10px] text-cyan-300">Reservoir Resilience</span>
        </div>

        <div className="glass-card p-3.5 rounded-2xl border border-slate-800">
          <span className="text-[11px] text-slate-400">Clean Power Savings</span>
          <div className="text-xl font-bold text-amber-400 mt-1 font-mono">
            ₹{(simResults.annual_power_savings_inr / 1000).toFixed(0)}k /yr
          </div>
          <span className="text-[10px] text-slate-400">Solar + LED Dimming</span>
        </div>

        <div className="glass-card p-3.5 rounded-2xl border border-slate-800">
          <span className="text-[11px] text-slate-400">Carbon Offset</span>
          <div className="text-xl font-bold text-teal-300 mt-1 font-mono">
            {simResults.carbon_offset_tonnes} MT
          </div>
          <span className="text-[10px] text-emerald-400">CO2e Annual Offset</span>
        </div>
      </div>

      {/* Main Simulation Workspace: 10 Levers Column (Left) vs Spatial Blueprint & Radar (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (6 Cols): 10 Interactive Control Sliders */}
        <div className="lg:col-span-6 glass-card p-5 rounded-3xl space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-400" />
              10 Smart Rural Development Levers
            </h3>
            <span className="text-[10px] text-emerald-400 font-mono">Real-time Reactive</span>
          </div>

          <div className="space-y-3 text-xs max-h-[580px] overflow-y-auto pr-1">
            {/* 1. Build Hospital */}
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                  <HeartPulse className="w-3.5 h-3.5 text-rose-400" /> Build Hospital / Tele-ICU Center
                </span>
                <span className="font-mono font-bold text-rose-400">{hospitals} Hospital ({hospitals * 12} Beds)</span>
              </div>
              <input
                type="range"
                min="0"
                max="2"
                step="1"
                value={hospitals}
                onChange={(e) => setHospitals(Number(e.target.value))}
                className="w-full accent-rose-500 cursor-pointer"
              />
            </div>

            {/* 2. Build School */}
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-indigo-400" /> Build Smart Digital School Wing
                </span>
                <span className="font-mono font-bold text-indigo-400">{schools} Wings</span>
              </div>
              <input
                type="range"
                min="0"
                max="3"
                step="1"
                value={schools}
                onChange={(e) => setSchools(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            {/* 3. Water Tank */}
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5 text-cyan-400" /> Build Overhead Water Tank
                </span>
                <span className="font-mono font-bold text-cyan-400">{waterTanks} Tanks (250kL)</span>
              </div>
              <input
                type="range"
                min="0"
                max="4"
                step="1"
                value={waterTanks}
                onChange={(e) => setWaterTanks(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>

            {/* 4. Construct Lake / Check Dam */}
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5 text-blue-400" /> Rainwater Lake & Check Dam
                </span>
                <span className="font-mono font-bold text-blue-400">{lakesConstructed} Check Dams</span>
              </div>
              <input
                type="range"
                min="0"
                max="3"
                step="1"
                value={lakesConstructed}
                onChange={(e) => setLakesConstructed(Number(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>

            {/* 5. Repair Roads */}
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-300 font-semibold">Resurface & Widen Bitumen Roads</span>
                <span className="font-mono font-bold text-cyan-400">{roadRepairKm} km</span>
              </div>
              <input
                type="range"
                min="0"
                max="15"
                step="1"
                value={roadRepairKm}
                onChange={(e) => setRoadRepairKm(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>

            {/* 6. Plant Trees */}
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                  <Leaf className="w-3.5 h-3.5 text-emerald-400" /> Plant Miyawaki Forest Trees
                </span>
                <span className="font-mono font-bold text-emerald-400">{treesPlanted.toLocaleString()} Trees</span>
              </div>
              <input
                type="range"
                min="0"
                max="20000"
                step="1000"
                value={treesPlanted}
                onChange={(e) => setTreesPlanted(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* 7. Install Solar Panels */}
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5 text-amber-400" /> Install Solar Panels (Rooftop & Canal)
                </span>
                <span className="font-mono font-bold text-amber-400">{solarKw} kWp</span>
              </div>
              <input
                type="range"
                min="0"
                max="250"
                step="10"
                value={solarKw}
                onChange={(e) => setSolarKw(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            {/* 8. Improve Irrigation */}
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                  <Sprout className="w-3.5 h-3.5 text-emerald-400" /> Subsurface Drip Fertigation
                </span>
                <span className="font-mono font-bold text-emerald-400">{dripIrrigationAcres} Acres</span>
              </div>
              <input
                type="range"
                min="0"
                max="800"
                step="50"
                value={dripIrrigationAcres}
                onChange={(e) => setDripIrrigationAcres(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* 9. Healthcare Mobile Clinics */}
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-pink-400" /> Deploy Mobile Tele-Clinics
                </span>
                <span className="font-mono font-bold text-pink-400">{mobileClinics} Mobile Vans</span>
              </div>
              <input
                type="range"
                min="0"
                max="3"
                step="1"
                value={mobileClinics}
                onChange={(e) => setMobileClinics(Number(e.target.value))}
                className="w-full accent-pink-500 cursor-pointer"
              />
            </div>

            {/* 10. Smart Streetlights */}
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-yellow-400" /> Add Smart LED Streetlight Poles
                </span>
                <span className="font-mono font-bold text-yellow-400">{smartStreetLights} Poles</span>
              </div>
              <input
                type="range"
                min="0"
                max="120"
                step="10"
                value={smartStreetLights}
                onChange={(e) => setSmartStreetLights(Number(e.target.value))}
                className="w-full accent-yellow-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Right Column (6 Cols): Simulated Spatial Blueprint & Multi-Dimensional Radar */}
        <div className="lg:col-span-6 space-y-6">
          {/* Spatial Blueprint Map showing simulated assets */}
          <div className="glass-card p-5 rounded-3xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Eye className="w-4 h-4 text-cyan-400" />
                Simulated Spatial Blueprint Hologram
              </h3>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                Live Spatial Projection
              </span>
            </div>

            <div className="relative aspect-video w-full rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden p-3">
              <svg className="w-full h-full" viewBox="0 0 240 140">
                {/* Background Grid */}
                <defs>
                  <pattern id="simGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5"/>
                  </pattern>
                </defs>
                <rect width="240" height="140" fill="url(#simGrid)" />

                {/* Village Core */}
                <rect x="70" y="40" width="100" height="60" fill="rgba(16, 185, 129, 0.08)" stroke="#10b981" strokeWidth="0.8" strokeDasharray="3,3" />
                <text x="75" y="52" fill="#34d399" fontSize="7" fontFamily="monospace">{gpDisplayName} Core Ward</text>

                {/* Canal Waterway */}
                <path d="M 0,70 Q 120,78 240,70" fill="none" stroke="#0284c7" strokeWidth="3" />

                {/* Simulated Assets Holograms */}
                {solarKw > 0 && (
                  <g className="animate-pulse">
                    <rect x="180" y="20" width="45" height="25" fill="rgba(245, 158, 11, 0.3)" stroke="#f59e0b" strokeWidth="1.2" />
                    <text x="184" y="35" fill="#fde68a" fontSize="6" fontFamily="monospace">+{solarKw}kW Solar</text>
                  </g>
                )}

                {waterTanks > 0 && (
                  <g className="animate-pulse">
                    <circle cx="150" cy="95" r="10" fill="rgba(6, 182, 212, 0.3)" stroke="#06b6d4" strokeWidth="1.2" />
                    <text x="144" y="97" fill="#67e8f9" fontSize="5" fontFamily="monospace">Tank</text>
                  </g>
                )}

                {hospitals > 0 && (
                  <g className="animate-pulse">
                    <rect x="80" y="80" width="30" height="20" fill="rgba(244, 63, 94, 0.3)" stroke="#f43f5e" strokeWidth="1.2" />
                    <text x="83" y="92" fill="#fda4af" fontSize="6" fontFamily="monospace">+Tele-ICU</text>
                  </g>
                )}

                {lakesConstructed > 0 && (
                  <g className="animate-pulse">
                    <ellipse cx="40" cy="100" rx="25" ry="16" fill="rgba(2, 132, 199, 0.3)" stroke="#38bdf8" strokeWidth="1.2" />
                    <text x="24" y="102" fill="#bae6fd" fontSize="6" fontFamily="monospace">+Check Dam</text>
                  </g>
                )}

                {treesPlanted > 0 && (
                  <g>
                    <circle cx="35" cy="35" r="18" fill="rgba(16, 185, 129, 0.2)" stroke="#10b981" strokeWidth="1" strokeDasharray="2,2" />
                    <text x="22" y="37" fill="#86efac" fontSize="5" fontFamily="monospace">Forest ({treesPlanted})</text>
                  </g>
                )}
              </svg>

              <div className="absolute bottom-2 left-2 text-[10px] font-mono text-cyan-300 bg-slate-950/80 px-2 py-0.5 rounded border border-cyan-500/20">
                Interventions Active: {waterTanks + roadRepairKm + hospitals + schools + (solarKw > 0 ? 1 : 0) + (treesPlanted > 0 ? 1 : 0)} Projected
              </div>
            </div>
          </div>

          {/* Multi-Dimensional Sector Resilience Radar Chart */}
          <div className="glass-card p-5 rounded-3xl">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                Resilience Impact Matrix: Baseline vs Simulated
              </h3>
              <div className="flex items-center space-x-3 text-xs font-mono text-[10px]">
                <span className="text-slate-400">• Baseline (86)</span>
                <span className="text-emerald-400 font-bold">• Simulated ({simResults.simulated_village_health_score})</span>
              </div>
            </div>

            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <PolarRadiusAxis domain={[60, 100]} stroke="#475569" />
                  <Radar name="Baseline" dataKey="baseline" stroke="#64748b" fill="#64748b" fillOpacity={0.25} />
                  <Radar name="Simulated" dataKey="simulated" stroke="#10b981" fill="#10b981" fillOpacity={0.5} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0a1226', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '11px' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
