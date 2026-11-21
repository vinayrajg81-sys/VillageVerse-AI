// VillageVerse AI: Solid Waste Management & EV Fleet Module
import React, { useState, useEffect } from 'react';
import { usePanchayat } from '../context/PanchayatContext';
import { api } from '../services/api';
import { 
  Trash2, Truck, RefreshCw, CheckCircle, AlertTriangle, 
  Sparkles, BatteryCharging, Send 
} from 'lucide-react';

export const WasteManagement: React.FC = () => {
  const { activePanchayat } = usePanchayat();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dispatchedMsg, setDispatchedMsg] = useState<string | null>(null);

  useEffect(() => {
    loadWaste();
  }, [activePanchayat.id]);

  const loadWaste = async () => {
    setLoading(true);
    const res = await api.getWaste();
    setData(res);
    setLoading(false);
  };

  const handleDispatch = async (vehicleId: string) => {
    await api.apiClient.post('/waste/dispatch-vehicle', { vehicle_id: vehicleId, ward: 'Ward 3' }).catch(() => {});
    setDispatchedMsg(`Swachh Vahini ${vehicleId} prioritized for immediate secondary pickup in Ward 3.`);
    setTimeout(() => setDispatchedMsg(null), 4000);
  };

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin" />
      </div>
    );
  }

  const { daily_waste_kg, wet_waste_kg, dry_waste_kg, segregation_rate_pct, compost_yield_monthly_kg, bins, vehicles } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-white flex items-center gap-2">
            <Trash2 className="w-6 h-6 text-emerald-400" />
            Solid Waste Management, Smart Bins & EV Fleet
          </h1>
          <p className="text-xs text-slate-400">
            Swachh Bharat Rural Mission • {segregation_rate_pct}% Source Segregation Rate • {activePanchayat.name}
          </p>
        </div>

        <span className="px-3 py-1.5 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-semibold">
          Monthly Bio-Compost: {compost_yield_monthly_kg.toLocaleString()} kg
        </span>
      </div>

      {dispatchedMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-600 text-emerald-300 text-xs">
          {dispatchedMsg}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-2xl">
          <span className="text-xs text-slate-400">Daily Waste Collected</span>
          <div className="text-2xl font-extrabold text-white mt-1">{daily_waste_kg} kg</div>
          <span className="text-[10px] text-slate-400">100% Door-to-Door</span>
        </div>
        <div className="glass-card p-4 rounded-2xl">
          <span className="text-xs text-slate-400">Source Segregation</span>
          <div className="text-2xl font-extrabold text-emerald-400 mt-1">{segregation_rate_pct}%</div>
          <span className="text-[10px] text-emerald-300">Dry & Wet Separated</span>
        </div>
        <div className="glass-card p-4 rounded-2xl">
          <span className="text-xs text-slate-400">Wet Organic Waste</span>
          <div className="text-2xl font-extrabold text-cyan-400 mt-1">{wet_waste_kg} kg</div>
          <span className="text-[10px] text-cyan-300">Diverted to Compost Yard</span>
        </div>
        <div className="glass-card p-4 rounded-2xl">
          <span className="text-xs text-slate-400">Dry Recyclables</span>
          <div className="text-2xl font-extrabold text-amber-400 mt-1">{dry_waste_kg} kg</div>
          <span className="text-[10px] text-slate-400">Sent to MRF Hub</span>
        </div>
      </div>

      {/* Smart Bins & EV Fleet */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* IoT Smart Bins */}
        <div className="glass-card p-5 rounded-3xl">
          <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
            <Trash2 className="w-4 h-4 text-emerald-400" />
            Smart IoT Dustbin Fill Telemetry
          </h3>
          <p className="text-xs text-slate-400 mb-3">Ultrasonic sensor fill level monitoring</p>

          <div className="space-y-3 text-xs">
            {bins.map((bin: any) => (
              <div key={bin.id} className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-white">{bin.location}</span>
                    <span className="text-[10px] text-slate-400 ml-2">({bin.type})</span>
                  </div>
                  <span className={`font-mono font-bold ${bin.fill_pct > 80 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {bin.fill_pct}% Full
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${bin.fill_pct > 80 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                    style={{ width: `${bin.fill_pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Swachh Vahini EV Fleet */}
        <div className="glass-card p-5 rounded-3xl">
          <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
            <Truck className="w-4 h-4 text-emerald-400" />
            Swachh Vahini EV Collection Vehicles
          </h3>
          <p className="text-xs text-slate-400 mb-3">Electric garbage autos with live route monitoring</p>

          <div className="space-y-3 text-xs">
            {vehicles.map((v: any) => (
              <div key={v.id} className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">{v.name}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
                    {v.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Route: {v.route}</span>
                  <span className="font-mono text-emerald-400 flex items-center gap-1">
                    <BatteryCharging className="w-3.5 h-3.5" /> {v.battery_pct}%
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-slate-400">Driver: {v.driver}</span>
                  <button
                    onClick={() => handleDispatch(v.id)}
                    className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[11px] transition"
                  >
                    Dispatch Re-route
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
