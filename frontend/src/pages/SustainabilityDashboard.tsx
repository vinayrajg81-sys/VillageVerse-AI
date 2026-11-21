// VillageVerse AI: Sustainability & UN SDG Tracking Dashboard
import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Leaf, Sun, Droplets, Trash2, Globe, TrendingUp, Sparkles, Award } from 'lucide-react';
import { RadialBarChart, RadialBar, ResponsiveContainer, Tooltip } from 'recharts';

export const SustainabilityDashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSust();
  }, []);

  const loadSust = async () => {
    setLoading(true);
    const res = await api.getSustainability();
    setData(res);
    setLoading(false);
  };

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin" />
      </div>
    );
  }

  const { overall_sdg_score, renewable_energy_share, water_recycling_rate, carbon_neutrality_target_year, green_cover_gain_5y, sdg_goals } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-white flex items-center gap-2">
            <Leaf className="w-6 h-6 text-emerald-400" />
            Sustainability, UN SDGs & Carbon Neutrality Roadmap
          </h1>
          <p className="text-xs text-slate-400">
            Aligned with United Nations 2030 Sustainable Development Goals & Gram Swaraj
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-semibold flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5" />
            Composite SDG Index: {overall_sdg_score} / 100
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-2xl border-emerald-500/30">
          <span className="text-xs text-slate-400">Carbon Target</span>
          <div className="text-2xl font-extrabold text-emerald-400 mt-1">Year {carbon_neutrality_target_year}</div>
          <span className="text-[10px] text-emerald-300">100% Net Zero Panchayat</span>
        </div>
        <div className="glass-card p-4 rounded-2xl">
          <span className="text-xs text-slate-400">Clean Energy Share</span>
          <div className="text-2xl font-extrabold text-amber-400 mt-1">{renewable_energy_share}%</div>
          <span className="text-[10px] text-slate-400">Solar Microgrid & Biogas</span>
        </div>
        <div className="glass-card p-4 rounded-2xl">
          <span className="text-xs text-slate-400">Water Conservation</span>
          <div className="text-2xl font-extrabold text-cyan-400 mt-1">{water_recycling_rate}%</div>
          <span className="text-[10px] text-cyan-300">Greywater & Lake Recharge</span>
        </div>
        <div className="glass-card p-4 rounded-2xl">
          <span className="text-xs text-slate-400">Green Cover Gain</span>
          <div className="text-2xl font-extrabold text-emerald-400 mt-1">{green_cover_gain_5y}</div>
          <span className="text-[10px] text-slate-400">Afforestation Drives</span>
        </div>
      </div>

      {/* UN Sustainable Development Goals Matrix */}
      <div className="glass-card p-5 rounded-3xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-400" />
              United Nations SDG Target Compliance
            </h3>
            <p className="text-xs text-slate-400">Panchayat-level granular tracking across key indicators</p>
          </div>
          <span className="text-xs text-emerald-400 font-mono">All 7 Indicators On Track</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sdg_goals.map((sdg: any, idx: number) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs">{sdg.goal}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  sdg.status === 'Exceeding' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                  sdg.status === 'On Track' ? 'bg-cyan-950 text-cyan-400 border border-cyan-800' :
                  'bg-amber-950 text-amber-400 border border-amber-800'
                }`}>
                  {sdg.status}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Progress Score</span>
                <span className="font-mono font-bold text-emerald-400">{sdg.score} / 100</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full"
                  style={{ width: `${sdg.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
