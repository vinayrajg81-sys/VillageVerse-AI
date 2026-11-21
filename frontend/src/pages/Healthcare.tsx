// VillageVerse AI: Healthcare, Telemedicine & PHC Module
import React, { useState, useEffect } from 'react';
import { usePanchayat } from '../context/PanchayatContext';
import { api } from '../services/api';
import { 
  HeartPulse, ShieldCheck, AlertTriangle, PhoneCall, Activity, 
  MapPin, CheckCircle, Sparkles, User, Crosshair 
} from 'lucide-react';

export const Healthcare: React.FC = () => {
  const { activePanchayat } = usePanchayat();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHealth();
  }, [activePanchayat.id]);

  const loadHealth = async () => {
    setLoading(true);
    const res = await api.getHealthcare(activePanchayat);
    setData(res);
    setLoading(false);
  };

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 rounded-full border-4 border-rose-500/20 border-t-rose-500 animate-spin" />
      </div>
    );
  }

  const { phc_name, doctors_on_duty, nurses_staff, available_beds, occupied_beds, ambulances, vaccination_coverage_pct, active_disease_alerts, medicine_inventory } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-white flex items-center gap-2">
            <HeartPulse className="w-6 h-6 text-rose-500" />
            Rural Healthcare, Primary Health Centre (PHC) & Ambulances
          </h1>
          <p className="text-xs text-slate-400">
            {phc_name} • {available_beds} Beds • Telemedicine Portal Active • {activePanchayat.taluk} Taluk
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Doctors On Duty: {doctors_on_duty}
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-2xl">
          <span className="text-xs text-slate-400">Bed Occupancy</span>
          <div className="text-2xl font-extrabold text-white mt-1">{occupied_beds} / {available_beds}</div>
          <span className="text-[10px] text-emerald-400">{available_beds - occupied_beds} Vacant (Normal Capacity)</span>
        </div>
        <div className="glass-card p-4 rounded-2xl">
          <span className="text-xs text-slate-400">Vaccination Coverage</span>
          <div className="text-2xl font-extrabold text-emerald-400 mt-1">{vaccination_coverage_pct}%</div>
          <span className="text-[10px] text-slate-400">Mission Indradhanush Verified</span>
        </div>
        <div className="glass-card p-4 rounded-2xl">
          <span className="text-xs text-slate-400">108 Ambulances</span>
          <div className="text-2xl font-extrabold text-rose-400 mt-1">{ambulances.length} Active</div>
          <span className="text-[10px] text-emerald-400">Stationed at PHC Campus</span>
        </div>
        <div className="glass-card p-4 rounded-2xl">
          <span className="text-xs text-slate-400">Essential Medicines</span>
          <div className="text-2xl font-extrabold text-cyan-400 mt-1">100% Stock</div>
          <span className="text-[10px] text-slate-400">Solar Cold Chain Monitored</span>
        </div>
      </div>

      {/* Ambulances & Disease Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* GPS Ambulance Tracking */}
        <div className="glass-card p-5 rounded-3xl">
          <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-rose-500" />
            Live GPS Emergency Ambulances
          </h3>
          <p className="text-xs text-slate-400 mb-4">Arogya Kavacha 108 Emergency Medical Response</p>

          <div className="space-y-3 text-xs">
            {(ambulances || []).map((amb: any) => (
              <div key={amb.id || amb.vehicle_number} className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white">{amb.vehicle || amb.vehicle_number || '108 Emergency Ambulance'}</span>
                    <span className="text-[10px] text-slate-500 font-mono ml-2">{amb.id}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
                    {amb.status || 'Active'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Driver: {amb.driver || 'Designated Driver'}</span>
                  <a 
                    href="tel:108"
                    className="flex items-center gap-1 text-rose-400 font-semibold hover:underline"
                  >
                    <PhoneCall className="w-3 h-3" /> Call 108
                  </a>
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  GPS: {amb.lat ?? activePanchayat.latitude.toFixed(4)}, {amb.lng ?? activePanchayat.longitude.toFixed(4)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Disease Outbreak Radar */}
        <div className="glass-card p-5 rounded-3xl">
          <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            AI Disease Surveillance & Outbreak Radar
          </h3>
          <p className="text-xs text-slate-400 mb-4">Integrated Disease Surveillance Programme (IDSP) Mandya</p>

          <div className="space-y-3 text-xs">
            {(active_disease_alerts || []).map((dis: any, idx: number) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200">{dis.disease}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    dis.risk === 'Low' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
                  }`}>
                    {dis.risk} Risk
                  </span>
                </div>
                <p className="text-slate-300">Reported Cases (30d): <strong>{dis.cases_30d}</strong></p>
                <p className="text-[11px] text-slate-400">Action: {dis.action}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Medicine Inventory Table */}
      <div className="glass-card p-5 rounded-3xl">
        <h3 className="text-sm font-bold text-white mb-3">PHC Essential Medicine Stock Register</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Medicine / Vaccine Name</th>
                <th className="py-2.5 px-3">Available Stock Units</th>
                <th className="py-2.5 px-3">Inventory Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {(medicine_inventory || []).map((m: any, idx: number) => (
                <tr key={idx} className="hover:bg-slate-900/40">
                  <td className="py-2.5 px-3 font-semibold text-white">{m.medicine || m.name}</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-200">
                    {typeof m.stock_units === 'number' 
                      ? m.stock_units.toLocaleString() 
                      : (m.stock_units || m.stock || '1,000')}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      m.status === 'Sufficient' || m.status === 'Optimal' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
                    }`}>
                      {m.status || 'Sufficient'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
