// VillageVerse AI: Agriculture & Smart Farming Module
import React, { useState, useEffect } from 'react';
import { usePanchayat } from '../context/PanchayatContext';
import { api } from '../services/api';
import { 
  Sprout, Droplets, Thermometer, TrendingUp, AlertTriangle, 
  Sparkles, CheckCircle2, UploadCloud, FileText, ArrowRight 
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export const Agriculture: React.FC = () => {
  const { activePanchayat } = usePanchayat();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCrop, setSelectedCrop] = useState('Sugarcane');
  const [symptomsInput, setSymptomsInput] = useState('');
  const [diseaseResult, setDiseaseResult] = useState<any>(null);
  const [detecting, setDetecting] = useState(false);
  const [selectedImageName, setSelectedImageName] = useState<string | null>(null);

  useEffect(() => {
    loadAgriData();
  }, [activePanchayat.id]);

  const loadAgriData = async () => {
    setLoading(true);
    const res = await api.getAgriculture(activePanchayat);
    setData(res);
    setLoading(false);
  };

  const handleRunDiseaseDetection = async (e: React.FormEvent) => {
    e.preventDefault();
    setDetecting(true);
    const res = await api.detectCropDisease(selectedCrop, symptomsInput || 'reddish discoloration and leaf drying');
    setDiseaseResult(res.diagnosis);
    setDetecting(false);
  };

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin" />
      </div>
    );
  }

  const { crops, soil_sensors, mandi_prices, total_farmland_acres, active_farmers, avg_soil_health_index } = data;

  const cropChartData = crops.map((c: any) => ({
    name: c.name.split(' ')[0],
    acres: c.area_acres,
    yield: c.avg_yield_tonnes
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-white flex items-center gap-2">
            <Sprout className="w-6 h-6 text-emerald-400" />
            Precision Agriculture & Soil Health Intelligence
          </h1>
          <p className="text-xs text-slate-400">
            {activePanchayat.name} • {activePanchayat.taluk} Taluk • {total_farmland_acres} Acres Farmland • {active_farmers} Registered Farmers
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-950/80 text-emerald-400 border border-emerald-800 text-xs font-semibold">
            Soil Health Index: {avg_soil_health_index} / 100
          </span>
        </div>
      </div>

      {/* Top Agricultural KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-2xl">
          <span className="text-xs text-slate-400">Total Farmland</span>
          <div className="text-2xl font-extrabold text-white mt-1">{total_farmland_acres} Acres</div>
          <span className="text-[10px] text-emerald-400">84% Canal & Drip Irrigated</span>
        </div>
        <div className="glass-card p-4 rounded-2xl">
          <span className="text-xs text-slate-400">Active Farmers</span>
          <div className="text-2xl font-extrabold text-white mt-1">{active_farmers}</div>
          <span className="text-[10px] text-slate-400">PM-KISAN Registered 100%</span>
        </div>
        <div className="glass-card p-4 rounded-2xl">
          <span className="text-xs text-slate-400">Avg Soil Moisture</span>
          <div className="text-2xl font-extrabold text-cyan-400 mt-1">62.5%</div>
          <span className="text-[10px] text-cyan-300">Optimal Range (45-80%)</span>
        </div>
        <div className="glass-card p-4 rounded-2xl">
          <span className="text-xs text-slate-400">Crop Health Index</span>
          <div className="text-2xl font-extrabold text-emerald-400 mt-1">88 / 100</div>
          <span className="text-[10px] text-emerald-300">Zero Major Infestation</span>
        </div>
      </div>

      {/* Crops Breakdown & Mandi APMC Market Prices */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Crop Acreage Chart */}
        <div className="lg:col-span-2 glass-card p-5 rounded-3xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sprout className="w-4 h-4 text-emerald-400" />
                Village Crop Distribution & Acreage
              </h3>
              <p className="text-xs text-slate-400">Sugarcane, Paddy, Ragi & Horticulture Cultivation</p>
            </div>
            <span className="text-xs text-slate-400">Kharif & Rabi Season</span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cropChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="acres" fill="#10b981" radius={[8, 8, 0, 0]}>
                  {cropChartData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : index === 1 ? '#06b6d4' : '#8b5cf6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Mandi Market Prices (APMC Mandya & Mysuru) */}
        <div className="glass-card p-5 rounded-3xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-1 flex items-center justify-between">
              <span>Mandi Market Rates (APMC)</span>
              <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800">
                Live Today
              </span>
            </h3>
            <p className="text-xs text-slate-400 mb-3">Direct real-time feed from Karnataka APMC yards</p>

            <div className="space-y-2.5 text-xs">
              {mandi_prices.map((m: any, idx: number) => (
                <div key={idx} className="p-2.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-slate-200">{m.commodity}</div>
                    <div className="text-[10px] text-slate-500">{m.market}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-white font-mono">{m.price}</div>
                    <span className={`text-[10px] font-semibold ${m.trend.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {m.trend}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI Crop Disease Detection & Fertilizer Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Crop Disease Scanner */}
        <div className="glass-card p-5 rounded-3xl border border-emerald-500/20">
          <div className="flex items-center space-x-2 text-sm font-bold text-white mb-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3>AI Crop Disease Scanner & Leaf Diagnostic</h3>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            Upload a crop leaf photograph or select symptoms for instant CNN disease diagnosis and remedies in Kannada & English.
          </p>

          <form onSubmit={handleRunDiseaseDetection} className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-300 font-medium block mb-1">Crop Type</label>
                <select
                  value={selectedCrop}
                  onChange={(e) => setSelectedCrop(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Sugarcane">Sugarcane (ಕಬ್ಬು)</option>
                  <option value="Paddy">Paddy (ಭತ್ತ)</option>
                  <option value="Ragi">Ragi (ರಾಗಿ)</option>
                  <option value="Banana">Banana (ಬಾಳೆ)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Observed Symptoms</label>
                <input
                  type="text"
                  value={symptomsInput}
                  onChange={(e) => setSymptomsInput(e.target.value)}
                  placeholder="e.g. leaf spots, yellowing stalk"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Photo upload simulator */}
            <div 
              onClick={() => setSelectedImageName('crop_leaf_sample_2026.jpg')}
              className="p-4 rounded-2xl border-2 border-dashed border-slate-700 hover:border-emerald-500 bg-slate-900/50 cursor-pointer text-center transition flex flex-col items-center justify-center space-y-1"
            >
              <UploadCloud className="w-6 h-6 text-emerald-400" />
              <span className="text-xs font-semibold text-slate-300">
                {selectedImageName ? `Uploaded: ${selectedImageName}` : 'Click to simulate leaf image upload (JPG/PNG)'}
              </span>
              <span className="text-[10px] text-slate-500">AI Computer Vision Model v2.4</span>
            </div>

            <button
              type="submit"
              disabled={detecting}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs transition shadow-lg shadow-emerald-500/20"
            >
              {detecting ? 'Analyzing Image & Symptoms with AI...' : 'Run AI Disease Diagnosis'}
            </button>
          </form>

          {/* Diagnosis Result Card */}
          {diseaseResult && (
            <div className="mt-4 p-4 rounded-2xl bg-slate-900/90 border border-emerald-500/40 space-y-2 text-xs animate-in fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-emerald-400 font-bold uppercase">Diagnosis Result</span>
                  <h4 className="text-sm font-extrabold text-white">{diseaseResult.disease}</h4>
                  <p className="text-amber-300 text-[11px] font-semibold">{diseaseResult.disease_kn}</p>
                </div>
                <div className="text-right">
                  <span className="text-emerald-400 font-mono font-bold text-xs">{diseaseResult.confidence}%</span>
                  <div className="text-[10px] text-slate-400">AI Confidence</div>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-1">
                <strong className="text-slate-200 block">Treatment (English):</strong>
                <p className="text-slate-300 text-[11px] leading-relaxed">{diseaseResult.treatment_en}</p>
                <strong className="text-amber-300 block pt-1">ಚಿಕಿತ್ಸಾ ಕ್ರಮ (ಕನ್ನಡ):</strong>
                <p className="text-slate-300 text-[11px] leading-relaxed">{diseaseResult.treatment_kn}</p>
              </div>
            </div>
          )}
        </div>

        {/* Soil IoT Telemetry Grid */}
        <div className="glass-card p-5 rounded-3xl">
          <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
            <Droplets className="w-4 h-4 text-cyan-400" />
            Live Soil Moisture & NPK Telemetry
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Real-time multi-depth probes installed across 4 village agricultural sectors
          </p>

          <div className="space-y-3 text-xs">
            {soil_sensors.map((s: any) => (
              <div key={s.id} className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-200">{s.sector}</span>
                  <span className="font-mono text-[10px] text-emerald-400 px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800">
                    {s.id}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="p-1.5 rounded-lg bg-slate-800/80">
                    <span className="text-[10px] text-slate-400 block">Moisture</span>
                    <strong className="text-cyan-400 font-mono">{s.moisture_pct}%</strong>
                  </div>
                  <div className="p-1.5 rounded-lg bg-slate-800/80">
                    <span className="text-[10px] text-slate-400 block">pH Value</span>
                    <strong className="text-emerald-400 font-mono">{s.ph}</strong>
                  </div>
                  <div className="p-1.5 rounded-lg bg-slate-800/80">
                    <span className="text-[10px] text-slate-400 block">N-P-K</span>
                    <strong className="text-amber-400 font-mono">{s.n}-{s.p}-{s.k}</strong>
                  </div>
                  <div className="p-1.5 rounded-lg bg-slate-800/80">
                    <span className="text-[10px] text-slate-400 block">Soil Temp</span>
                    <strong className="text-slate-200 font-mono">{s.temp_c}°C</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
