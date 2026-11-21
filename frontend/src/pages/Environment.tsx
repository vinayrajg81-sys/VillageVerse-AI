// VillageVerse AI: Environmental Analytics, AQI & Carbon Sequestration Module
import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Trees, Wind, CloudSun, Leaf, Droplet, Sparkles, CheckCircle, ArrowUpRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export const Environment: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEnv();
  }, []);

  const loadEnv = async () => {
    setLoading(true);
    const res = await api.getEnvironment();
    setData(res);
    setLoading(false);
  };

  const aqiHourlyTrend = [
    { time: '06:00', aqi: 35, pm25: 14 },
    { time: '09:00', aqi: 44, pm25: 19 },
    { time: '12:00', aqi: 48, pm25: 22 },
    { time: '15:00', aqi: 42, pm25: 18 },
    { time: '18:00', aqi: 46, pm25: 20 },
    { time: '21:00', aqi: 39, pm25: 16 }
  ];

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin" />
      </div>
    );
  }

  const { aqi, status, pm25, pm10, co2_ppm, ambient_temp_c, humidity_pct, tree_census_count, green_cover_pct, annual_carbon_sequestration_tons, carbon_emissions_tons } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-white flex items-center gap-2">
            <Trees className="w-6 h-6 text-emerald-400" />
            Environmental Quality, Real-Time AQI & Tree Census
          </h1>
          <p className="text-xs text-slate-400">
            Microclimate IoT Stations • 12,450 Geo-tagged Trees • Mandya District
          </p>
        </div>

        <span className="px-3 py-1.5 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-semibold flex items-center gap-1.5">
          <Leaf className="w-3.5 h-3.5" />
          Status: Net Carbon Negative (-168 MT CO2/yr)
        </span>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-2xl border-emerald-500/30">
          <span className="text-xs text-slate-400">Air Quality Index</span>
          <div className="text-3xl font-extrabold text-emerald-400 mt-1">{aqi}</div>
          <span className="text-[10px] text-emerald-300 font-semibold">{status}</span>
        </div>
        <div className="glass-card p-4 rounded-2xl">
          <span className="text-xs text-slate-400">Tree Census</span>
          <div className="text-2xl font-extrabold text-white mt-1">{tree_census_count.toLocaleString()}</div>
          <span className="text-[10px] text-emerald-400">Neem, Banyan, Honge & Teak</span>
        </div>
        <div className="glass-card p-4 rounded-2xl">
          <span className="text-xs text-slate-400">Green Cover</span>
          <div className="text-2xl font-extrabold text-emerald-400 mt-1">{green_cover_pct}%</div>
          <span className="text-[10px] text-slate-400">+8.4% 5-year growth</span>
        </div>
        <div className="glass-card p-4 rounded-2xl">
          <span className="text-xs text-slate-400">CO2 Ambient</span>
          <div className="text-2xl font-extrabold text-cyan-400 mt-1">{co2_ppm} ppm</div>
          <span className="text-[10px] text-cyan-300">Clean Rural Baseline</span>
        </div>
      </div>

      {/* AQI Trend Chart & Pollutant Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-5 rounded-3xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Wind className="w-4 h-4 text-emerald-400" />
                Diurnal AQI & PM2.5 Hourly Variation
              </h3>
              <p className="text-xs text-slate-400">Continuous optical particulate sensor telemetry</p>
            </div>
            <span className="text-xs text-emerald-400 font-mono">AQI {aqi} (Optimal)</span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={aqiHourlyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="aqiGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis domain={[0, 80]} stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="aqi" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#aqiGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Micro-Climate & Pollutant Gauges */}
        <div className="glass-card p-5 rounded-3xl space-y-3">
          <h3 className="text-sm font-bold text-white mb-1">Microclimate Sensors</h3>
          <p className="text-xs text-slate-400 mb-3">Village weather & particulate readings</p>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex justify-between items-center">
              <span className="text-slate-400">PM 2.5 Fine Dust</span>
              <span className="font-mono font-bold text-emerald-400">{pm25} µg/m³</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex justify-between items-center">
              <span className="text-slate-400">PM 10 Coarse Dust</span>
              <span className="font-mono font-bold text-emerald-400">{pm10} µg/m³</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex justify-between items-center">
              <span className="text-slate-400">Ambient Temperature</span>
              <span className="font-mono font-bold text-amber-400">{ambient_temp_c}°C</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex justify-between items-center">
              <span className="text-slate-400">Relative Humidity</span>
              <span className="font-mono font-bold text-cyan-400">{humidity_pct}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
