// VillageVerse AI: Enterprise Gram Panchayat Manual Selector Modal & Council Directory
import React, { useState, useMemo } from 'react';
import { usePanchayat, GramPanchayat } from '../../context/PanchayatContext';
import { 
  Building2, Search, MapPin, CheckCircle2, ChevronRight, X, 
  PlusCircle, SlidersHorizontal, Activity, ArrowRight, ShieldCheck,
  Droplets, Zap, Users, Home, TrendingUp, Sparkles, Filter
} from 'lucide-react';

interface PanchayatSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAddModal?: () => void;
}

export const PanchayatSelectorModal: React.FC<PanchayatSelectorModalProps> = ({
  isOpen,
  onClose,
  onOpenAddModal
}) => {
  const { activePanchayat, panchayats, switchPanchayat } = usePanchayat();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTaluk, setSelectedTaluk] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'health' | 'population' | 'name'>('health');
  const [selectedGPId, setSelectedGPId] = useState<string>(activePanchayat.id);

  // Extract unique taluks
  const taluks = useMemo(() => {
    const set = new Set<string>();
    panchayats.forEach(p => set.add(p.taluk));
    return ['All', ...Array.from(set)];
  }, [panchayats]);

  // Filter and sort
  const filteredPanchayats = useMemo(() => {
    let list = panchayats.filter((p) => {
      const matchesSearch = 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.name_kn.includes(searchQuery) ||
        p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.taluk.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.specialization.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTaluk = selectedTaluk === 'All' || p.taluk === selectedTaluk;

      return matchesSearch && matchesTaluk;
    });

    return list.sort((a, b) => {
      if (sortBy === 'health') return b.health_score - a.health_score;
      if (sortBy === 'population') return b.population - a.population;
      return a.name.localeCompare(b.name);
    });
  }, [panchayats, searchQuery, selectedTaluk, sortBy]);

  const handleSelectPanchayat = (gp: GramPanchayat) => {
    setSelectedGPId(gp.id);
    switchPanchayat(gp.id);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col glass-panel bg-[#071122]/95 border border-cyan-500/30 rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.9)] overflow-hidden">
        
        {/* Glow Spheres */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* 1. Modal Header */}
        <div className="p-5 sm:p-6 border-b border-white/[0.08] relative z-10 shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                    Select Gram Panchayat
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-800/60">
                    {panchayats.length} Councils Available
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Choose a Gram Panchayat council to inspect live digital twin, IoT sensors, cadastre, and department analytics.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {onOpenAddModal && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenAddModal();
                  }}
                  className="hidden sm:inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-950/60 transition"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>+ Register New GP</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Search Bar & Sorter */}
          <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search Gram Panchayat by name, Kannada (ಶಿವಳ್ಳಿ), code (GP-KA-...), taluk, or specialization..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/[0.05] border border-white/10 text-white placeholder-slate-400 text-xs focus:outline-none focus:border-cyan-400 transition"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[11px] text-slate-400 font-semibold hidden md:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 rounded-2xl bg-slate-900 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
              >
                <option value="health">Health Score (Highest)</option>
                <option value="population">Population (Highest)</option>
                <option value="name">Alphabetical (A - Z)</option>
              </select>
            </div>
          </div>

          {/* Taluk Filter Tabs */}
          <div className="mt-3 flex items-center space-x-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            <span className="text-[10px] text-slate-500 font-mono font-bold uppercase mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3 text-emerald-400" />
              Taluk:
            </span>
            {taluks.map((taluk) => {
              const count = taluk === 'All' ? panchayats.length : panchayats.filter(p => p.taluk === taluk).length;
              return (
                <button
                  key={taluk}
                  onClick={() => setSelectedTaluk(taluk)}
                  className={`px-3 py-1 rounded-xl text-[11px] font-semibold border transition shrink-0 ${
                    selectedTaluk === taluk
                      ? 'bg-emerald-500/25 text-emerald-300 border-emerald-500/50 shadow-sm'
                      : 'bg-white/[0.03] text-slate-400 border-white/[0.06] hover:bg-white/[0.06] hover:text-white'
                  }`}
                >
                  <span>{taluk}</span>
                  <span className="ml-1 text-[10px] opacity-70">({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Scrollable Gram Panchayat Directory Cards */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3 flex-1 relative z-10">
          {filteredPanchayats.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <Building2 className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-slate-300 font-semibold text-sm">No Gram Panchayat found matching "{searchQuery}"</p>
              <p className="text-xs text-slate-500">Try searching for a different council or taluk, or register a new one.</p>
              {onOpenAddModal && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenAddModal();
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                >
                  + Register New Custom GP
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {filteredPanchayats.map((gp) => {
                const isActive = activePanchayat.id === gp.id;

                return (
                  <div
                    key={gp.id}
                    onClick={() => handleSelectPanchayat(gp)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
                      isActive
                        ? 'bg-gradient-to-br from-emerald-950/70 via-slate-900 to-slate-900/90 border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.25)] ring-1 ring-emerald-400/50'
                        : 'bg-white/[0.03] hover:bg-white/[0.06] border-white/[0.08] hover:border-cyan-500/40'
                    }`}
                  >
                    {/* Top Row: Title, Code & Active Badge */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-extrabold text-sm sm:text-base text-white group-hover:text-cyan-300 transition">
                            {gp.name}
                          </h3>
                        </div>
                        <div className="text-xs text-amber-300 font-medium">
                          {gp.name_kn}
                        </div>
                        <div className="flex items-center space-x-2 text-[11px] text-slate-400 font-mono pt-0.5">
                          <span className="px-1.5 py-0.2 rounded bg-white/[0.06] text-cyan-300 border border-white/10">
                            {gp.id}
                          </span>
                          <span>•</span>
                          <span>{gp.taluk} Taluk</span>
                          <span>•</span>
                          <span>{gp.district}</span>
                        </div>
                      </div>

                      {/* Health Score Pill */}
                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <div className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono font-bold text-xs">
                          <Activity className="w-3.5 h-3.5" />
                          <span>{gp.health_score}%</span>
                        </div>
                        {isActive && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500 text-slate-950 shadow-sm flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            ACTIVE
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Middle: Specialization Focus */}
                    <div className="mt-3 px-3 py-1.5 rounded-xl bg-white/[0.02] border border-white/[0.05] text-[11px] text-slate-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="truncate">{gp.specialization}</span>
                    </div>

                    {/* Bottom Metrics Bar & Select Button */}
                    <div className="mt-3 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-3 text-slate-400 font-mono text-[11px]">
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3 text-cyan-400" />
                          <strong className="text-white">{gp.population.toLocaleString('en-IN')}</strong>
                        </span>
                        <span className="flex items-center gap-1">
                          <Home className="w-3 h-3 text-indigo-400" />
                          <strong className="text-white">{gp.households.toLocaleString('en-IN')}</strong>
                        </span>
                        <span className="hidden sm:flex items-center gap-1">
                          <Droplets className="w-3 h-3 text-teal-400" />
                          <strong className="text-white">{gp.water_score}%</strong>
                        </span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectPanchayat(gp);
                        }}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs transition flex items-center space-x-1.5 shadow-sm ${
                          isActive
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-950/50'
                        }`}
                      >
                        <span>{isActive ? 'Current Council' : 'Select Council'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 3. Footer Bar */}
        <div className="p-4 sm:p-5 border-t border-white/[0.08] bg-slate-950/70 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 relative z-10 shrink-0">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Currently Active: <strong className="text-white font-bold">{activePanchayat.name}</strong> ({activePanchayat.id})</span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 transition font-semibold"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
