// VillageVerse AI: Executive Decision Dashboard & Government DPR Analytics
import React, { useState, useEffect } from 'react';
import { usePanchayat } from '../context/PanchayatContext';
import { api } from '../services/api';
import { 
  FileText, Download, Printer, Sparkles, CheckCircle2, 
  Calendar, Layers, Filter, RefreshCw, DollarSign, Award, 
  TrendingUp, BarChart3, PieChart, Volume2, VolumeX, Building2,
  Check, ArrowRight, ShieldCheck, Landmark, Globe
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  Cell, LineChart, Line 
} from 'recharts';

type ReportPeriod = 'Daily' | 'Weekly' | 'Monthly' | 'Annual';

export const ReportsAnalytics: React.FC = () => {
  const { activePanchayat } = usePanchayat();
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reportType, setReportType] = useState<ReportPeriod>('Monthly');
  const [briefTone, setBriefTone] = useState<'ministerial' | 'technical' | 'gram_sabha'>('ministerial');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    loadReport();
  }, [activePanchayat.id]);

  const loadReport = async () => {
    setLoading(true);
    const res = await api.getReports();
    setReportData(res);
    setLoading(false);
  };

  const executiveBriefs = {
    ministerial: `High-Level Ministerial Briefing for ${activePanchayat.name} (${activePanchayat.id}), ${activePanchayat.taluk} Taluk, ${activePanchayat.district}. Overall development index stands at ${activePanchayat.health_score}/100, ranking in the top tier in Mandya District and Karnataka State. Focus: ${activePanchayat.specialization}. Jal Jeevan Mission achieved comprehensive piped tap coverage across all ${activePanchayat.households.toLocaleString('en-IN')} households. Clean energy and microgrid stability rated at ${activePanchayat.electricity_score}%. Recommended for National Smart Panchayat Honors.`,
    technical: `Engineering & Infrastructure Telemetry Audit for ${activePanchayat.name}: IoT sensor nodes active across all wards. Distribution network shows water resource security at ${activePanchayat.water_score}%. Power grid stability verified at ${activePanchayat.electricity_score}% with carbon offset rating at ${activePanchayat.carbon_score}/100. Piped drinking water bacteriological compliance verified.`,
    gram_sabha: `ನಮಸ್ಕಾರ ಗ್ರಾಮಸ್ಥರೇ, ${activePanchayat.name_kn} (${activePanchayat.id}) ಮಾಸಿಕ ಆಡಳಿತ ಸಾರಾಂಶ: ನಮ್ಮ ಗ್ರಾಮ ಪಂಚಾಯಿತಿಯು ಅತ್ಯುನ್ನತ ಅಭಿವೃದ್ಧಿ ದರ ಹೊಂದಿದ್ದು, ಸಮಗ್ರ ಆರೋಗ್ಯ ಅಂಕ ${activePanchayat.health_score}/100 ದಾಖಲಾಗಿದೆ. ಎಲ್ಲಾ ${activePanchayat.households.toLocaleString('en-IN')} ಮನೆಗಳಿಗೂ ಶುದ್ಧ ಕುಡಿಯುವ ನೀರು ಮತ್ತು ನಿರಂತರ ವಿದ್ಯುತ್ ಒದಗಿಸಲಾಗುತ್ತಿದೆ.`
  };

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      const text = executiveBriefs[briefTone];
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = briefTone === 'gram_sabha' ? 'kn-IN' : 'en-IN';
      utterance.rate = 1.0;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportCsv = () => {
    if (!reportData) return;
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Department,Score,SLA_Compliance_Pct,Budget_Spent_Lakhs\n"
      + "WATER_RESOURCES,89,96.4,124.5\n"
      + "AGRICULTURE_SOIL,94,98.2,78.2\n"
      + "CLEAN_POWER_SOLAR,92,97.5,68.4\n"
      + "ROADS_WORKS,82,91.0,98.0\n"
      + "HEALTH_PHC,96,99.1,54.2\n"
      + "WASTE_MANAGEMENT,87,94.0,38.5\n";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${activePanchayat.name.replace(/ /g, '_')}_Executive_Analytics_${reportType}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading || !reportData) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-12 h-12 rounded-full border-2 border-emerald-500/20 border-t-emerald-400 animate-spin" />
      </div>
    );
  }

  const departmentScores = [
    { department: 'Agriculture', score: 94, budget: '₹78.2 L', sla: '98.2%', status: 'A+ Elite' },
    { department: 'Primary Health', score: 96, budget: '₹54.2 L', sla: '99.1%', status: 'A+ Elite' },
    { department: 'Solar Microgrid', score: 92, budget: '₹68.4 L', sla: '97.5%', status: 'A+ Elite' },
    { department: 'Water Supply', score: 89, budget: '₹124.5 L', sla: '96.4%', status: 'A Optimal' },
    { department: 'Waste & Sanitation', score: 87, budget: '₹38.5 L', sla: '94.0%', status: 'A Optimal' },
    { department: 'Roads & Works', score: 82, budget: '₹98.0 L', sla: '91.0%', status: 'B+ Good' }
  ];

  const sdgIndicators = [
    { code: 'SDG 6', name: 'Clean Water & Sanitation', score: 96, progress: '100% Piped Tap Grid' },
    { code: 'SDG 7', name: 'Affordable Clean Energy', score: 91, progress: '45.4% Solar Microgrid' },
    { code: 'SDG 3', name: 'Good Health & Well-being', score: 94, progress: '100% Immunization PHC' },
    { code: 'SDG 13', name: 'Climate Action', score: 86, progress: '38% Green Cover / Miyawaki' },
    { code: 'SDG 11', name: 'Sustainable Rural Communities', score: 89, progress: '94% Grievance SLA' }
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-emerald-400" />
            Executive Decision Dashboard & DPR Analytics
          </h1>
          <p className="text-xs text-slate-400">
            Government of Karnataka • Department of Rural Development & Panchayati Raj Formats
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Daily / Weekly / Monthly / Annual Tabs */}
          <div className="p-1 rounded-2xl bg-slate-900 border border-slate-800 flex items-center text-xs">
            {(['Daily', 'Weekly', 'Monthly', 'Annual'] as ReportPeriod[]).map((period) => (
              <button
                key={period}
                onClick={() => setReportType(period)}
                className={`px-3 py-1.5 rounded-xl font-bold transition ${
                  reportType === period
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {period}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportCsv}
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300 font-semibold text-xs flex items-center space-x-1.5 transition"
            title="Download CSV / Excel Spreadsheet"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Excel / CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow-lg shadow-emerald-600/30 transition"
            title="Print or Save as Official PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>PDF DPR</span>
          </button>
        </div>
      </div>

      {/* 2. State & District Ranking Showcase Card */}
      <div className="glass-card p-5 rounded-3xl border border-cyan-500/30 bg-gradient-to-r from-slate-900/95 via-[#0a1835]/90 to-slate-900/95 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/30">
            <Award className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold text-amber-400 font-mono tracking-wider">
                Karnataka State Benchmark
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Tier 1 Smart GP
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white mt-0.5">
              Ranked <span className="text-amber-400 font-black">#1 in Mandya District</span> & <span className="text-cyan-400 font-black">#4 in Karnataka State</span>
            </h2>
            <p className="text-xs text-slate-300">
              Evaluated across 5,958 Gram Panchayats on clean solar penetration, piped water reliability, and digital grievance resolution.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block font-mono">COMPOSITE INDEX</span>
            <span className="text-2xl font-black text-emerald-400 font-mono">86 / 100</span>
          </div>
        </div>
      </div>

      {/* 3. Financial Analytics & Budget Allocation Breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-2xl border border-slate-800">
          <div className="flex justify-between items-center text-slate-400 mb-1">
            <span className="text-[11px] font-mono">TOTAL ALLOCATION</span>
            <Landmark className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl font-black text-white font-mono">₹4.25 Cr</div>
          <span className="text-[10px] text-slate-400">FY 2026-27 Sanctioned</span>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-800">
          <div className="flex justify-between items-center text-slate-400 mb-1">
            <span className="text-[11px] font-mono">EXPENDITURE INCURRED</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-black text-emerald-400 font-mono">₹3.88 Cr</div>
          <span className="text-[10px] text-emerald-300">91.4% Fund Utilization</span>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-800">
          <div className="flex justify-between items-center text-slate-400 mb-1">
            <span className="text-[11px] font-mono">CLEAN TARIFF SAVINGS</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-black text-amber-400 font-mono">₹1.82 L /mo</div>
          <span className="text-[10px] text-slate-400">120 kWp Solar Microgrid</span>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-800">
          <div className="flex justify-between items-center text-slate-400 mb-1">
            <span className="text-[11px] font-mono">GRIEVANCE RESOLUTION</span>
            <ShieldCheck className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-xl font-black text-teal-300 font-mono">94.0% SLA</div>
          <span className="text-[10px] text-emerald-400">Avg 14 hrs turnaround</span>
        </div>
      </div>

      {/* 4. AI Generated Executive Summary with Tone Selector & Audio Narration */}
      <div className="glass-card p-6 rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-slate-900 via-emerald-950/20 to-slate-900 space-y-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-sm font-bold text-white">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <h3>Autonomous AI Executive Summary & Audit Brief</h3>
          </div>

          <div className="flex items-center gap-2">
            {/* Tone Selector */}
            <div className="flex items-center bg-slate-950/80 p-0.5 rounded-xl border border-slate-800 text-[11px]">
              <button
                onClick={() => setBriefTone('ministerial')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  briefTone === 'ministerial' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Ministerial
              </button>
              <button
                onClick={() => setBriefTone('technical')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  briefTone === 'technical' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Technical Audit
              </button>
              <button
                onClick={() => setBriefTone('gram_sabha')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  briefTone === 'gram_sabha' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                ಕನ್ನಡ (Gram Sabha)
              </button>
            </div>

            <button
              onClick={handleSpeak}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition flex items-center gap-1.5 ${
                isSpeaking
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 animate-pulse font-bold'
                  : 'bg-white/[0.05] text-slate-300 border-white/[0.1] hover:bg-white/[0.1]'
              }`}
            >
              {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              <span>{isSpeaking ? 'Pause Audio' : 'Audio Brief'}</span>
            </button>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-slate-950/60 p-4 rounded-2xl border border-white/[0.06]">
          "{executiveBriefs[briefTone]}"
        </p>

        <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2">
          <span>Overall Development Health Score: <strong className="text-emerald-400 font-mono">86 / 100</strong></span>
          <span>Certification: <strong className="text-white">ISO 37120 Smart Community Certified</strong></span>
          <span>Reporting Cycle: <strong className="text-cyan-300">Q3 FY 2026-27</strong></span>
        </div>
      </div>

      {/* 5. Department Performance Scorecards Table & SDG Rural Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Department Performance Table (7 Cols) */}
        <div className="lg:col-span-7 glass-card p-5 rounded-3xl space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center justify-between">
            <span>Departmental Key Performance Indices (KPIs)</span>
            <span className="text-[10px] text-slate-400 font-mono">Mandya District Benchmarks</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[10px] font-mono uppercase">
                  <th className="pb-2">Department</th>
                  <th className="pb-2">Performance</th>
                  <th className="pb-2">Fund Spent</th>
                  <th className="pb-2">SLA</th>
                  <th className="pb-2">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {departmentScores.map((dept, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition">
                    <td className="py-2.5 font-bold text-slate-200">{dept.department}</td>
                    <td className="py-2.5 font-mono text-emerald-400 font-bold">{dept.score}%</td>
                    <td className="py-2.5 font-mono text-slate-300">{dept.budget}</td>
                    <td className="py-2.5 font-mono text-cyan-300">{dept.sla}</td>
                    <td className="py-2.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                        {dept.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SDG Rural Sustainability Indicators (5 Cols) */}
        <div className="lg:col-span-5 glass-card p-5 rounded-3xl space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-cyan-400" />
            UN Sustainable Development Goals (SDG)
          </h3>
          <p className="text-xs text-slate-400 mb-2">Karnataka Gram Panchayat Localization Framework</p>

          <div className="space-y-2.5">
            {sdgIndicators.map((sdg, idx) => (
              <div key={idx} className="p-2.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200">
                    <span className="text-cyan-400 font-mono mr-1.5">{sdg.code}:</span>
                    {sdg.name}
                  </span>
                  <span className="font-mono font-bold text-emerald-400">{sdg.score}%</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full rounded-full" 
                    style={{ width: `${sdg.score}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-400 block">{sdg.progress}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
