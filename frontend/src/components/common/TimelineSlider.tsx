import React, { useState, useEffect } from 'react';
import { usePanchayat } from '../../context/PanchayatContext';
import { Play, Pause, FastForward, Clock, Sparkles, TrendingUp, ShieldCheck } from 'lucide-react';

export type TimelineYear = 2025 | 2026 | 2030 | 2035;

export interface TimelineData {
  year: TimelineYear;
  title: string;
  tagline: string;
  badge: string;
  healthScore: number;
  population: number;
  households: number;
  solarKw: number;
  waterAvailability: number;
  carbonScore: number;
  roadQuality: number;
  greenCover: number;
  keyMilestones: string[];
}

export const TIMELINE_DATA: Record<TimelineYear, TimelineData> = {
  2025: {
    year: 2025,
    title: 'Baseline Gram Panchayat',
    tagline: 'Pre-AI Manual Operations & Conventional Grid',
    badge: 'Baseline',
    healthScore: 78,
    population: 4610,
    households: 1090,
    solarKw: 40,
    waterAvailability: 76,
    carbonScore: 71,
    roadQuality: 68,
    greenCover: 32,
    keyMilestones: [
      'Manual water valve scheduling with frequent supply disruptions',
      'Conventional diesel generators used during peak summer load',
      'Physical paper-based citizen grievance registers at Panchayat'
    ]
  },
  2026: {
    year: 2026,
    title: 'VillageVerse AI Launch (Current)',
    tagline: 'IoT Digital Twin & Autonomous Telemetry Deployment',
    badge: 'Live Current',
    healthScore: 86,
    population: 4820,
    households: 1140,
    solarKw: 120,
    waterAvailability: 84,
    carbonScore: 79,
    roadQuality: 82,
    greenCover: 38,
    keyMilestones: [
      'Acoustic IoT leak detection installed on 14km distribution main',
      '120 kWp community solar microgrid with LiFePO4 storage battery',
      'AI crop disease scanner active across 620 Mandya sugarcane farmers'
    ]
  },
  2030: {
    year: 2030,
    title: 'Smart Gram Panchayat 2.0',
    tagline: '100% Smart Metering & Automated Agro-Logistics',
    badge: 'Vision 2030',
    healthScore: 94,
    population: 5450,
    households: 1280,
    solarKw: 380,
    waterAvailability: 96,
    carbonScore: 91,
    roadQuality: 95,
    greenCover: 46,
    keyMilestones: [
      'Automated drone payload corridor for emergency PHC medicine delivery',
      'Subsurface drip irrigation with AI automated soil moisture valves',
      'Dual EV public charging stations powered by canal-top solar canopies'
    ]
  },
  2035: {
    year: 2035,
    title: 'Autonomous Net-Zero Model',
    tagline: 'Circular Bio-Economy & Autonomous Municipal Services',
    badge: 'Net-Zero Model',
    healthScore: 99,
    population: 6100,
    households: 1420,
    solarKw: 780,
    waterAvailability: 99,
    carbonScore: 98,
    roadQuality: 99,
    greenCover: 55,
    keyMilestones: [
      '100% wastewater closed-loop recycling into organic agro-fertigation',
      'Autonomous electric municipal waste sorting vehicles & street sweepers',
      'Zero net carbon footprint certification from Ministry of Environment'
    ]
  }
};

const YEARS: TimelineYear[] = [2025, 2026, 2030, 2035];

interface TimelineSliderProps {
  currentYear: TimelineYear;
  onChange: (year: TimelineYear) => void;
  compact?: boolean;
}

export const TimelineSlider: React.FC<TimelineSliderProps> = ({
  currentYear,
  onChange,
  compact = false
}) => {
  const { activePanchayat } = usePanchayat();
  const gpDisplayName = activePanchayat?.name?.replace(/\s*(Rural\s*)?Gram\s*Panchayat/i, '').trim() || 'Village';
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      const currentIndex = YEARS.indexOf(currentYear);
      const nextIndex = (currentIndex + 1) % YEARS.length;
      onChange(YEARS[nextIndex]);
    }, 4000);
    return () => clearInterval(interval);
  }, [isPlaying, currentYear, onChange]);

  const activeData = TIMELINE_DATA[currentYear];

  return (
    <div className="glass-card p-4 sm:p-5 relative overflow-hidden border border-cyan-500/30">
      {/* Background glow banner */}
      <div className="absolute top-0 right-0 w-80 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Clock className="w-5 h-5 animate-spin" style={{ animationDuration: '20s' }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-widest text-cyan-400 font-bold">
                Temporal Twin Engine
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-900/60 text-cyan-300 border border-cyan-500/30">
                {activeData.badge}
              </span>
            </div>
            <h4 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              {gpDisplayName} Horizon: <span className="text-cyan-400 font-mono text-xl">{currentYear}</span>
            </h4>
          </div>
        </div>

        {/* Play / Next Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              isPlaying
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-lg shadow-amber-500/20'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" /> Paused
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" /> Auto-Simulate
              </>
            )}
          </button>
          
          <button
            onClick={() => {
              const idx = YEARS.indexOf(currentYear);
              onChange(YEARS[(idx + 1) % YEARS.length]);
            }}
            className="p-1.5 rounded-xl bg-slate-800/80 text-slate-300 hover:text-white border border-slate-700 hover:bg-slate-700/80 transition-colors"
            title="Next Milestone Year"
          >
            <FastForward className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Year Slider Step track */}
      <div className="relative my-6 px-4">
        {/* Track Line */}
        <div className="absolute top-1/2 left-8 right-8 -translate-y-1/2 h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-indigo-500 transition-all duration-700"
            style={{
              width: `${(YEARS.indexOf(currentYear) / (YEARS.length - 1)) * 100}%`
            }}
          />
        </div>

        {/* Node Buttons */}
        <div className="relative flex justify-between items-center z-10">
          {YEARS.map((yr) => {
            const isSelected = yr === currentYear;
            const data = TIMELINE_DATA[yr];
            return (
              <button
                key={yr}
                onClick={() => onChange(yr)}
                className="group flex flex-col items-center focus:outline-none"
              >
                <div
                  className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center font-mono font-bold text-xs sm:text-sm transition-all duration-300 ${
                    isSelected
                      ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/50 scale-125 ring-4 ring-cyan-500/20'
                      : 'bg-slate-900 text-slate-400 border border-slate-700 hover:border-cyan-400 hover:text-cyan-300 hover:scale-105'
                  }`}
                >
                  {yr}
                </div>
                <span
                  className={`mt-2 text-[11px] font-medium hidden sm:block transition-colors ${
                    isSelected ? 'text-cyan-300 font-semibold' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                >
                  {data.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {!compact && (
        <>
          {/* Milestone Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-800/80">
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">Health Index</span>
              <span className="text-lg font-bold text-emerald-400 font-mono">
                {activeData.healthScore}/100
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">Solar Microgrid</span>
              <span className="text-lg font-bold text-cyan-400 font-mono">
                {activeData.solarKw} kWp
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">Water Security</span>
              <span className="text-lg font-bold text-blue-400 font-mono">
                {activeData.waterAvailability}%
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">Carbon Offset</span>
              <span className="text-lg font-bold text-purple-400 font-mono">
                {activeData.carbonScore}/100
              </span>
            </div>
          </div>

          {/* Key Strategic Milestone Bullets */}
          <div className="mt-3 bg-cyan-950/30 rounded-xl p-3 border border-cyan-800/40">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-300 mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Year {currentYear} Strategic Transformation Objectives:</span>
            </div>
            <ul className="space-y-1">
              {activeData.keyMilestones.map((milestone, idx) => (
                <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span>{milestone}</span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};
