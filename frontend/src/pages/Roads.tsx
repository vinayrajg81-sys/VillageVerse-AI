// VillageVerse AI: Roads & Infrastructure Module
import React, { useState, useEffect } from 'react';
import { usePanchayat } from '../context/PanchayatContext';
import { api } from '../services/api';
import { 
  Milestone, AlertTriangle, CheckCircle, Wrench, Sparkles, 
  PlusCircle, RefreshCw, Layers 
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export const Roads: React.FC = () => {
  const { activePanchayat } = usePanchayat();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showReportModal, setShowReportModal] = useState(false);
  const [roadName, setRoadName] = useState('');
  const [stretch, setStretch] = useState('');
  const [severity, setSeverity] = useState('High');

  useEffect(() => {
    loadRoads();
  }, [activePanchayat.id]);

  const loadRoads = async () => {
    setLoading(true);
    const res = await api.getRoads(activePanchayat);
    setData(res);
    setLoading(false);
  };

  const handleReportDamage = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.apiClient.post('/roads/report-damage', {
      road_name: roadName || `${activePanchayat.name.replace(/\s*(Rural\s*)?Gram\s*Panchayat/i, '').trim()} Link Feeder`,
      stretch: stretch || 'Near Dairy bend',
      severity
    }).catch(() => {});
    setShowReportModal(false);
    loadRoads();
  };

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 rounded-full border-4 border-slate-500/20 border-t-emerald-500 animate-spin" />
      </div>
    );
  }

  const { total_length_km, asphalt_km, concrete_km, gravel_km, avg_pci_score, pothole_hotspots_count, scheduled_repairs } = data;

  const roadTypeData = [
    { type: 'Asphalt / Bitumen', km: asphalt_km, color: '#38bdf8' },
    { type: 'Concrete Pavement', km: concrete_km, color: '#10b981' },
    { type: 'Gravel / WBM', km: gravel_km, color: '#f59e0b' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-white flex items-center gap-2">
            <Milestone className="w-6 h-6 text-amber-400" />
            Panchayat Roads, Pavement Condition & Works
          </h1>
          <p className="text-xs text-slate-400">
            {activePanchayat.name} Road Network: {total_length_km} km • Average Pavement Condition Index (PCI): {avg_pci_score} / 100 • {activePanchayat.taluk} Taluk
          </p>
        </div>

        <button
          onClick={() => setShowReportModal(true)}
          className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs shadow-lg shadow-amber-600/30 transition flex items-center space-x-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Report Road Damage / Pothole</span>
        </button>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-2xl">
          <span className="text-xs text-slate-400">Total Road Length</span>
          <div className="text-2xl font-extrabold text-white mt-1">{total_length_km} km</div>
          <span className="text-[10px] text-slate-400">Connecting 4 Wards & SH-17</span>
        </div>
        <div className="glass-card p-4 rounded-2xl">
          <span className="text-xs text-slate-400">Pavement Index (PCI)</span>
          <div className="text-2xl font-extrabold text-emerald-400 mt-1">{avg_pci_score} / 100</div>
          <span className="text-[10px] text-emerald-300">Satisfactory Quality</span>
        </div>
        <div className="glass-card p-4 rounded-2xl">
          <span className="text-xs text-slate-400">Pothole Clusters</span>
          <div className="text-2xl font-extrabold text-amber-400 mt-1">{pothole_hotspots_count}</div>
          <span className="text-[10px] text-amber-300">Target for Bitumen Patching</span>
        </div>
        <div className="glass-card p-4 rounded-2xl">
          <span className="text-xs text-slate-400">Maintenance Budget</span>
          <div className="text-2xl font-extrabold text-cyan-400 mt-1">₹45.0 L</div>
          <span className="text-[10px] text-slate-400">Gram Panchayat Funds</span>
        </div>
      </div>

      {/* Road Types & Scheduled Repairs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Road Composition */}
        <div className="glass-card p-5 rounded-3xl">
          <h3 className="text-sm font-bold text-white mb-1">Road Surface Composition</h3>
          <p className="text-xs text-slate-400 mb-4">Breakdown across 28.6 km network</p>

          <div className="space-y-3 text-xs">
            {roadTypeData.map((item, idx) => (
              <div key={idx} className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                <div className="flex justify-between font-semibold text-slate-200">
                  <span>{item.type}</span>
                  <span className="font-mono text-emerald-400">{item.km} km</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full"
                    style={{ 
                      width: `${(item.km / total_length_km) * 100}%`,
                      backgroundColor: item.color 
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/20 text-xs text-slate-300">
            <strong className="text-emerald-400 block mb-0.5">AI Damage Prediction:</strong>
            Heavy monsoon runoff expected at KM 2.4. Recommended to complete micro-surfacing before June.
          </div>
        </div>

        {/* Scheduled Repairs Table */}
        <div className="lg:col-span-2 glass-card p-5 rounded-3xl">
          <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
            <Wrench className="w-4 h-4 text-amber-400" />
            Scheduled Infrastructure Repair & Patching Queue
          </h3>
          <p className="text-xs text-slate-400 mb-3">Prioritized using Computer Vision Pothole Telemetry</p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Road Name</th>
                  <th className="py-2.5 px-3">Damage Description</th>
                  <th className="py-2.5 px-3">Estimated Cost</th>
                  <th className="py-2.5 px-3">Scheduled Date</th>
                  <th className="py-2.5 px-3">Priority</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {scheduled_repairs.map((rep: any) => (
                  <tr key={rep.id} className="hover:bg-slate-900/40">
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-white">{rep.road}</div>
                      <div className="text-[10px] text-slate-500">{rep.stretch}</div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-300">{rep.damage}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-emerald-400">₹{(rep.cost ?? rep.budget_inr ?? 0).toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-slate-400">{rep.date}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        rep.priority === 'High' ? 'bg-amber-950 text-amber-400 border border-amber-800' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {rep.priority}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Report Damage Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl glass-panel border border-slate-700 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Log Pothole / Road Damage</h3>
              <button onClick={() => setShowReportModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleReportDamage} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 block mb-1 font-medium">Road / Street Name</label>
                <input
                  type="text"
                  value={roadName}
                  onChange={(e) => setRoadName(e.target.value)}
                  placeholder="e.g. Ward 2 Dairy Society Road"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  required
                />
              </div>
              <div>
                <label className="text-slate-300 block mb-1 font-medium">Exact Stretch / Landmark</label>
                <input
                  type="text"
                  value={stretch}
                  onChange={(e) => setStretch(e.target.value)}
                  placeholder="e.g. Near culvert cross bend"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  required
                />
              </div>
              <div>
                <label className="text-slate-300 block mb-1 font-medium">Severity Level</label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                >
                  <option value="Urgent">Urgent (Dangerous deep crater)</option>
                  <option value="High">High (Multiple potholes)</option>
                  <option value="Medium">Medium (Surface cracks)</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold shadow-lg transition"
              >
                Submit Road Repair Request
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
