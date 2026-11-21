// VillageVerse AI: AI Development Planner & Gram Panchayat Budget Optimizer
import React, { useState, useEffect } from 'react';
import { usePanchayat } from '../context/PanchayatContext';
import { api } from '../services/api';
import { 
  Sparkles, DollarSign, TrendingUp, Layers, CheckCircle, 
  PlusCircle, Award, Target, ArrowRight 
} from 'lucide-react';

export const AIDevelopmentPlanner: React.FC = () => {
  const { activePanchayat } = usePanchayat();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [projectTitle, setProjectTitle] = useState('');
  const [department, setDepartment] = useState('Rural Water Supply');
  const [estimatedCost, setEstimatedCost] = useState('');
  const [priority, setPriority] = useState('High');

  useEffect(() => {
    loadPlanner();
  }, [activePanchayat.id]);

  const loadPlanner = async () => {
    setLoading(true);
    const res = await api.getPlanner(activePanchayat);
    setData(res);
    setLoading(false);
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.apiClient.post('/planner/projects', {
      title: projectTitle || 'New Community Facility',
      department,
      cost_inr: Number(estimatedCost) || 1200000,
      priority,
      roi_multiplier: 2.8,
      impact_score: 88,
      beneficiaries: 1200
    }).catch(() => {});
    setShowAddModal(false);
    loadPlanner();
  };

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin" />
      </div>
    );
  }

  const { total_budget_inr, allocated_inr, unallocated_inr, projects } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-400" />
            AI Gram Panchayat Development Planner & Budget Optimizer
          </h1>
          <p className="text-xs text-slate-400">
            {activePanchayat.name} • 15th Finance Commission & MGNREGA Fund Allocation • Multi-Criteria Project Ranking
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs shadow-lg shadow-emerald-600/30 transition flex items-center space-x-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Propose New Village Project</span>
        </button>
      </div>

      {/* Budget Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-medium">Total Sanctioned Annual Budget</span>
          <div className="text-3xl font-extrabold text-white mt-1">
            ₹{(total_budget_inr / 10000000).toFixed(2)} Cr
          </div>
          <span className="text-[10px] text-slate-400">Panchayat Raj & Centrally Sponsored Grants</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border-emerald-500/30">
          <span className="text-xs text-slate-400 font-medium">Allocated to Active Works</span>
          <div className="text-3xl font-extrabold text-emerald-400 mt-1">
            ₹{(allocated_inr / 10000000).toFixed(2)} Cr
          </div>
          <span className="text-[10px] text-emerald-300 font-semibold">
            {((allocated_inr / total_budget_inr) * 100).toFixed(1)}% Deployed in High-ROI Projects
          </span>
        </div>

        <div className="glass-card p-5 rounded-2xl border-cyan-500/30">
          <span className="text-xs text-slate-400 font-medium">Available Unallocated Balance</span>
          <div className="text-3xl font-extrabold text-cyan-400 mt-1">
            ₹{(unallocated_inr / 100000).toFixed(1)} Lakhs
          </div>
          <span className="text-[10px] text-cyan-300">Ready for Gram Sabha New Sanctions</span>
        </div>
      </div>

      {/* AI Decision Support Engine for Panchayat Officials */}
      <div className="glass-card p-6 rounded-3xl border border-white/[0.08] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              AI Decision Support & Official Recommendations Engine
            </h3>
            <p className="text-xs text-slate-400">
              Autonomous multi-criteria optimization for Panchayat Development Officers (PDO) and Engineers.
            </p>
          </div>
          <span className="text-xs font-mono text-cyan-300 bg-cyan-950/80 px-3 py-1 rounded-full border border-cyan-800">
            6 High-Impact Directives
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              title: 'Best Location for New Water Tank',
              target: 'Ward 3 Elevated Ridge (12.5662° N, 76.8951° E)',
              impact: '+340 Households Covered (Zero Head Loss)',
              scheme: 'Jal Jeevan Mission (JJM Phase II)',
              budget: '₹18.5 Lakhs (Estimated)',
              rationale: 'Elevation at 694m provides natural gravity feed to southern tail-end agricultural habitations without booster pumps.'
            },
            {
              title: 'Priority Road Micro-Surfacing',
              target: 'SH-17 Connect Km 2.4 - Mandya Link',
              impact: 'Prevent 4 Pothole Clusters / Save ₹4.8L Cost',
              scheme: 'Pradhan Mantri Gram Sadak Yojana (PMGSY)',
              budget: '₹8.5 Lakhs',
              rationale: 'Heavy commercial milk tankers accelerate pavement distress; applying micro-surfacing now avoids full road reconstruction.'
            },
            {
              title: 'Healthcare Sub-Centre Upgrade',
              target: 'Ward 2 Health & Wellness Sub-Centre',
              impact: 'Tele-ICU Video Uplink to MIMS Mandya',
              scheme: 'Ayushman Bharat Digital Health Mission',
              budget: '₹4.2 Lakhs',
              rationale: 'Ward 2 elder population is 4.8 km from PHC; tele-consultation station reduces travel time by 85% for chronic cardiac care.'
            },
            {
              title: 'Optimal Tree Plantation Buffer',
              target: 'East Lake Bund Siltation Buffer Zone',
              impact: '1,200 Vetiver & Neem Saplings / -40% Silt Runoff',
              scheme: 'MGNREGA Green India Mission',
              budget: '₹2.4 Lakhs (100% Wage Labor)',
              rationale: 'Root systems anchor topsoil along the KRS canal branch, preserving 1.8M Cu.M lake volume from pre-monsoon erosion.'
            },
            {
              title: 'Surplus Budget Reallocation',
              target: 'Shift ₹14.5L Unspent Works to Solar Lift Irrigation',
              impact: '₹2.8 Lakhs Annual Tariff Savings for 45 Farmers',
              scheme: '15th Finance Commission Untied Grant',
              budget: '₹14.5 Lakhs Reallocated',
              rationale: 'Zero grid downtime risk; solarized irrigation motors pay for themselves within 22 months while eliminating diesel pumps.'
            },
            {
              title: 'Centrally Sponsored Scheme Matching',
              target: 'PM Surya Ghar Muft Bijli Yojana (Phase 3)',
              impact: '180 Households Eligible for ₹78,000 Subsidy',
              scheme: 'PM Surya Ghar / KREDL Karnataka',
              budget: '₹0 GP Outlay (Direct DBT)',
              rationale: 'Rooftop solar potential survey verifies 82% unshaded tiled roofs across Ward 1 & 4 with 2.4-year capital payback.'
            }
          ].map((rec, i) => (
            <div key={i} className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-amber-500/40 transition flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40 inline-block mb-1.5">
                  Recommendation #{i + 1}
                </span>
                <h4 className="text-xs font-bold text-white mb-1">{rec.title}</h4>
                <div className="text-[11px] font-mono text-cyan-300 mb-2">{rec.target}</div>
                <p className="text-xs text-slate-400 leading-relaxed mb-3">
                  {rec.rationale}
                </p>
              </div>

              <div className="space-y-1.5 pt-2.5 border-t border-white/[0.06] text-[10px] font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Impact:</span>
                  <span className="text-emerald-400 font-bold">{rec.impact}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Scheme:</span>
                  <span className="text-slate-300">{rec.scheme}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Projects Priority Matrix & Ranking Table */}
      <div className="glass-card p-5 rounded-3xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              AI Priority Ranked Capital Projects
            </h3>
            <p className="text-xs text-slate-400">Ranked by Social Return on Investment (SROI) & Beneficiary Density</p>
          </div>
          <span className="text-xs text-emerald-400 font-semibold">{projects.length} Proposals Evaluated</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Project Title</th>
                <th className="py-2.5 px-3">Department</th>
                <th className="py-2.5 px-3">Capital Outlay</th>
                <th className="py-2.5 px-3">AI ROI Multiplier</th>
                <th className="py-2.5 px-3">Impact Score</th>
                <th className="py-2.5 px-3">Priority Level</th>
                <th className="py-2.5 px-3">Workflow Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {projects.map((p: any) => (
                <tr key={p.id} className="hover:bg-slate-900/40">
                  <td className="py-2.5 px-3">
                    <div className="font-semibold text-white">{p.title}</div>
                    <div className="text-[10px] text-slate-500">{p.id} • {p.beneficiaries?.toLocaleString()} Beneficiaries</div>
                  </td>
                  <td className="py-2.5 px-3 text-slate-300">{p.department}</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-white">₹{(p.cost_inr ?? 0).toLocaleString()}</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-emerald-400">{p.roi_multiplier}x ROI</td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-12 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full" style={{ width: `${p.impact_score}%` }} />
                      </div>
                      <span className="font-mono text-slate-200">{p.impact_score}</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      p.priority === 'Critical' ? 'bg-rose-950 text-rose-400 border border-rose-800' :
                      p.priority === 'High' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                      'bg-slate-800 text-slate-300'
                    }`}>
                      {p.priority}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-800 text-emerald-400 border border-slate-700 font-semibold">
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Propose Project Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl glass-panel border border-slate-700 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Propose Development Project</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleCreateProject} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 block mb-1 font-medium">Project Title</label>
                <input
                  type="text"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  placeholder="e.g. 50 kWp Rooftop Solar for Anganwadi"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  required
                />
              </div>
              <div>
                <label className="text-slate-300 block mb-1 font-medium">Department</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                >
                  <option value="Water & Sanitation">Water & Sanitation</option>
                  <option value="Energy & Clean Power">Energy & Clean Power</option>
                  <option value="Roads & Public Works">Roads & Public Works</option>
                  <option value="Healthcare & Ayush">Healthcare & Ayush</option>
                  <option value="Education & Sports">Education & Sports</option>
                </select>
              </div>
              <div>
                <label className="text-slate-300 block mb-1 font-medium">Estimated Capital Cost (INR)</label>
                <input
                  type="number"
                  value={estimatedCost}
                  onChange={(e) => setEstimatedCost(e.target.value)}
                  placeholder="e.g. 1500000"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  required
                />
              </div>
              <div>
                <label className="text-slate-300 block mb-1 font-medium">Priority Ranking</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                >
                  <option value="Critical">Critical Priority</option>
                  <option value="High">High Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="Low">Low Priority</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-lg transition"
              >
                Submit for Gram Sabha Evaluation
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
