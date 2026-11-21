// VillageVerse AI: Electricity & Solar Microgrid Module
import React, { useState, useEffect } from 'react';
import { usePanchayat } from '../context/PanchayatContext';
import { api } from '../services/api';
import { Zap, Sun, Activity, AlertTriangle, ShieldCheck, Sparkles, BatteryCharging } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export const Electricity: React.FC = () => {
  const { activePanchayat } = usePanchayat();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadElectricity();
  }, [activePanchayat.id]);

  const loadElectricity = async () => {
    setLoading(true);
    const res = await api.getElectricity(activePanchayat);
    setData(res);
    setLoading(false);
  };

  const powerHourlyData = [
    { hour: '00:00', grid: 120, solar: 0 },
    { hour: '04:00', grid: 110, solar: 0 },
    { hour: '08:00', grid: 210, solar: 45 },
    { hour: '12:00', grid: 180, solar: 120 },
    { hour: '14:00', grid: 190, solar: 115 },
    { hour: '17:00', grid: 240, solar: 35 },
    { hour: '20:00', grid: 320, solar: 0 }
  ];

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin" />
      </div>
    );
  }

  const { daily_consumption_kwh, solar_generation_kwh, solar_share_pct, grid_reliability_pct, active_outages_count, transformers, solar_units } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-white flex items-center gap-2">
            <Zap className="w-6 h-6 text-amber-400" />
            Rural Power Grid, Smart Transformers & Solar Microgrid
          </h1>
          <p className="text-xs text-slate-400">
            {activePanchayat.name} • {activePanchayat.taluk} Electrical Substation Grid • Solar Microgrid Telemetry
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            Grid Status: 100% Active (Zero Outages)
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-2xl">
          <span className="text-xs text-slate-400">Daily Power Used</span>
          <div className="text-2xl font-extrabold text-white mt-1">{(daily_consumption_kwh).toLocaleString()} kWh</div>
          <span className="text-[10px] text-slate-400">Village Domestic & Agri Feeders</span>
        </div>
        <div className="glass-card p-4 rounded-2xl">
          <span className="text-xs text-slate-400">Solar Generation</span>
          <div className="text-2xl font-extrabold text-amber-400 mt-1">{solar_generation_kwh.toLocaleString()} kWh</div>
          <span className="text-[10px] text-emerald-400">45.4% Clean Energy Offset</span>
        </div>
        <div className="glass-card p-4 rounded-2xl">
          <span className="text-xs text-slate-400">Grid Reliability</span>
          <div className="text-2xl font-extrabold text-emerald-400 mt-1">{grid_reliability_pct}%</div>
          <span className="text-[10px] text-emerald-300">Gruha Jyothi Compliant</span>
        </div>
        <div className="glass-card p-4 rounded-2xl">
          <span className="text-xs text-slate-400">Streetlight Power Saved</span>
          <div className="text-2xl font-extrabold text-cyan-400 mt-1">38.2%</div>
          <span className="text-[10px] text-cyan-300">IoT Ambient Dimming</span>
        </div>
      </div>

      {/* Power Generation & Consumption Curve */}
      <div className="glass-card p-5 rounded-3xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-400" />
              Diurnal Load Profile: Grid Draw vs Solar Microgrid
            </h3>
            <p className="text-xs text-slate-400">Solar peaks offset peak agricultural pump draw between 10:00 and 15:00</p>
          </div>
          <div className="flex items-center space-x-3 text-xs">
            <span className="flex items-center gap-1 text-amber-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-amber-400" /> Solar kW
            </span>
            <span className="flex items-center gap-1 text-sky-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-sky-400" /> Grid Load kW
            </span>
          </div>
        </div>

        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={powerHourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSolar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorGrid" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0284c7" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#0284c7" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="hour" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
              />
              <Area type="monotone" dataKey="grid" stroke="#0284c7" strokeWidth={2} fillOpacity={1} fill="url(#colorGrid)" />
              <Area type="monotone" dataKey="solar" stroke="#f59e0b" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSolar)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Transformers & Solar Installations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transformer Telemetry */}
        <div className="glass-card p-5 rounded-3xl">
          <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            Distribution Transformers (DTR) Live Health
          </h3>
          <div className="space-y-3 text-xs">
            {transformers.map((tr: any) => (
              <div key={tr.id} className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-white">{tr.name}</span>
                    <span className="text-[10px] text-slate-500 ml-2">Rating: {tr.rating}</span>
                  </div>
                  <span className="font-mono text-emerald-400 font-bold">{tr.health_pct}% Health</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-1.5 rounded-lg bg-slate-800/80">
                    <span className="text-[10px] text-slate-400 block">Current Load</span>
                    <strong className="text-amber-400 font-mono">{tr.load_pct}%</strong>
                  </div>
                  <div className="p-1.5 rounded-lg bg-slate-800/80">
                    <span className="text-[10px] text-slate-400 block">Core Temp</span>
                    <strong className="text-slate-200 font-mono">{tr.temp_c}°C</strong>
                  </div>
                  <div className="p-1.5 rounded-lg bg-slate-800/80">
                    <span className="text-[10px] text-slate-400 block">Risk</span>
                    <strong className="text-emerald-400">Normal</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Solar Microgrid Units */}
        <div className="glass-card p-5 rounded-3xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-400" />
              Decentralized Solar Plants & Rooftops
            </h3>
            <div className="space-y-2.5 text-xs">
              {solar_units.map((unit: any, idx: number) => (
                <div key={idx} className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-white">{unit.name}</div>
                    <div className="text-[10px] text-slate-400">Capacity: {unit.capacity_kw} kWp</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-amber-400">{unit.today_yield_kwh} kWh</div>
                    <span className="text-[10px] text-emerald-400">Generated Today</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/20 text-xs text-slate-300">
            <strong className="text-emerald-400 block mb-0.5">PM-KUSUM Scheme Status:</strong>
            60 agricultural pumps converted to standalone solar. Annual carbon offset: 182 metric tons.
          </div>
        </div>
      </div>
    </div>
  );
};
