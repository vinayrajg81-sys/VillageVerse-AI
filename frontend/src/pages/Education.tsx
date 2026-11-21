// VillageVerse AI: Education & Anganwadi Infrastructure Module
import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  GraduationCap, Users, CheckCircle, Sparkles, BookOpen, 
  Utensils, Tv, Trophy 
} from 'lucide-react';

export const Education: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEdu();
  }, []);

  const loadEdu = async () => {
    setLoading(true);
    const res = await api.getEducation();
    setData(res);
    setLoading(false);
  };

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
      </div>
    );
  }

  const { institutions_count, total_students, attendance_rate_pct, literacy_rate_pct, midday_meal_status, schools } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-white flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-indigo-400" />
            Rural Education, Smart Classrooms & Anganwadis
          </h1>
          <p className="text-xs text-slate-400">
            {institutions_count} Educational Centers • {total_students} Enrolled Students • Literacy Rate: {literacy_rate_pct}%
          </p>
        </div>

        <span className="px-3 py-1.5 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-semibold flex items-center gap-1.5">
          <Utensils className="w-3.5 h-3.5" />
          Midday Meal: {midday_meal_status}
        </span>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-2xl">
          <span className="text-xs text-slate-400">Total Enrolled</span>
          <div className="text-2xl font-extrabold text-white mt-1">{total_students} Students</div>
          <span className="text-[10px] text-slate-400">Primary, High School & Anganwadi</span>
        </div>
        <div className="glass-card p-4 rounded-2xl">
          <span className="text-xs text-slate-400">Daily Attendance</span>
          <div className="text-2xl font-extrabold text-emerald-400 mt-1">{attendance_rate_pct}%</div>
          <span className="text-[10px] text-emerald-300">Biometric / App Verified</span>
        </div>
        <div className="glass-card p-4 rounded-2xl">
          <span className="text-xs text-slate-400">Village Literacy</span>
          <div className="text-2xl font-extrabold text-cyan-400 mt-1">{literacy_rate_pct}%</div>
          <span className="text-[10px] text-slate-400">+6.2% since 2021 Census</span>
        </div>
        <div className="glass-card p-4 rounded-2xl">
          <span className="text-xs text-slate-400">Smart TV Classrooms</span>
          <div className="text-2xl font-extrabold text-amber-400 mt-1">3 Units</div>
          <span className="text-[10px] text-slate-400">Karnataka Edusat Enabled</span>
        </div>
      </div>

      {/* School Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {schools.map((sch: any, idx: number) => (
          <div key={idx} className="glass-card p-5 rounded-3xl space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-white">{sch.name}</h3>
                <span className="text-xs text-slate-400">{sch.type}</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                {sch.pass_pct}% Pass Rate
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Students</span>
                <strong className="text-white font-mono">{sch.students}</strong>
              </div>
              <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Teachers</span>
                <strong className="text-indigo-400 font-mono">{sch.teachers}</strong>
              </div>
              <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Smart Labs</span>
                <strong className="text-amber-400 font-mono">{sch.smart_classrooms}</strong>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-300 flex items-center justify-between">
              <span>Drinking Water: <strong className="text-emerald-400">RO Pure</strong></span>
              <span>Toilets: <strong className="text-emerald-400">Functional</strong></span>
              <span>Solar Backup: <strong className="text-emerald-400">Equipped</strong></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
