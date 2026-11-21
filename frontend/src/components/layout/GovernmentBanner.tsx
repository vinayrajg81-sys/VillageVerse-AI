// VillageVerse AI: Government Header Banner with Multi-Gram Panchayat Governance & Modal
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { usePanchayat, GramPanchayat } from '../../context/PanchayatContext';
import { PanchayatSelectorModal } from '../common/PanchayatSelectorModal';
import { UserRole } from '../../types';
import { 
  Globe, Moon, Sun, ShieldCheck, ChevronDown, Clock, Activity, 
  Sparkles, Building2, PlusCircle, X, Check, CheckCircle2, MapPin
} from 'lucide-react';

export const GovernmentBanner: React.FC = () => {
  const { user, role, switchRole } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { activePanchayat, panchayats, switchPanchayat, addPanchayat } = usePanchayat();

  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [gpMenuOpen, setGpMenuOpen] = useState(false);
  const [selectorModalOpen, setSelectorModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // New GP Form State
  const [newGPForm, setNewGPForm] = useState({
    name: '',
    name_kn: '',
    id: '',
    taluk: 'Mandya',
    district: 'Mandya',
    state: 'Karnataka',
    pincode: '571401',
    population: 4800,
    households: 1120,
    area_sq_km: 15.2,
    health_score: 85,
    specialization: 'Smart Irrigation & Precision Agro-Horticulture',
    specialization_kn: 'ಸ್ಮಾರ್ಟ್ ನೀರಾವರಿ ಮತ್ತು ನಿಖರ ಕೃಷಿ ವಲಯ'
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const rolesList: UserRole[] = [
    'Super Admin',
    'Admin',
    'Panchayat Officer',
    'Engineer',
    'Agriculture Officer',
    'Healthcare Officer',
    'Citizen'
  ];

  const handleCreateGP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGPForm.name.trim()) return;

    setIsSubmitting(true);
    const generatedId = newGPForm.id.trim() || `GP-KA-MND-${Date.now().toString().slice(-3)}`;
    
    const result = await addPanchayat({
      ...newGPForm,
      id: generatedId,
      population: Number(newGPForm.population),
      households: Number(newGPForm.households),
      area_sq_km: Number(newGPForm.area_sq_km),
      health_score: Number(newGPForm.health_score)
    });

    setIsSubmitting(false);
    setAddModalOpen(false);
    setSuccessToast(`Gram Panchayat "${newGPForm.name}" registered and activated!`);
    setTimeout(() => setSuccessToast(null), 4000);

    // Reset form
    setNewGPForm({
      name: '',
      name_kn: '',
      id: '',
      taluk: 'Mandya',
      district: 'Mandya',
      state: 'Karnataka',
      pincode: '571401',
      population: 4800,
      households: 1120,
      area_sq_km: 15.2,
      health_score: 85,
      specialization: 'Smart Irrigation & Precision Agro-Horticulture',
      specialization_kn: 'ಸ್ಮಾರ್ಟ್ ನೀರಾವರಿ ಮತ್ತು ನಿಖರ ಕೃಷಿ ವಲಯ'
    });
  };

  return (
    <>
      <div className="w-full bg-[#080e1e]/90 backdrop-blur-xl border-b border-white/[0.06] text-xs text-slate-300 relative z-40">
        {/* Tricolor National Ribbon */}
        <div className="gov-ribbon" />

        <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-3">
          {/* Left: Official Gov Emblem & Gram Panchayat Switcher */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 font-semibold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
              <span className="text-amber-400 font-extrabold tracking-wider">ಗ್ರಾಮ ಸ್ವರಾಜ್</span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-200 font-medium hidden sm:inline">
                Government of Karnataka • Digital Swaraj Portal
              </span>
            </div>

            {/* Interactive Gram Panchayat Selector Pill & Quick Modal Trigger */}
            <div className="flex items-center space-x-2">
              <div className="relative">
                <button
                  onClick={() => setGpMenuOpen(!gpMenuOpen)}
                  className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-950/70 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-500/40 font-mono text-[11px] transition shadow-sm"
                  title="Quick council switcher"
                >
                  <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
                  <span className="font-bold tracking-tight">{activePanchayat.name.replace(' Gram Panchayat', '')}</span>
                  <span className="text-[10px] text-emerald-400/80 font-mono hidden md:inline">({activePanchayat.id})</span>
                  <ChevronDown className="w-3 h-3 text-emerald-400/70" />
                </button>

                {/* Gram Panchayat Dropdown Menu */}
                {gpMenuOpen && (
                  <div 
                    className="absolute left-0 mt-2 w-80 glass-panel border border-emerald-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.9)] py-2 z-50 text-xs animate-in fade-in duration-200 bg-[#071122]/95 backdrop-blur-2xl rounded-2xl"
                    onMouseLeave={() => setGpMenuOpen(false)}
                  >
                    <div className="px-3.5 py-1.5 border-b border-white/5 flex items-center justify-between">
                      <span className="font-bold text-slate-400 text-[10px] uppercase tracking-wider">
                        Select Gram Panchayat
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/40">
                        {panchayats.length} Councils
                      </span>
                    </div>

                    <div className="max-h-64 overflow-y-auto py-1 divide-y divide-white/[0.04]">
                      {panchayats.map((gp) => {
                        const isSelected = activePanchayat.id === gp.id;
                        return (
                          <button
                            key={gp.id}
                            onClick={() => {
                              switchPanchayat(gp.id);
                              setGpMenuOpen(false);
                            }}
                            className={`w-full text-left px-3.5 py-2.5 flex items-start justify-between gap-2 hover:bg-white/[0.06] transition ${
                              isSelected ? 'bg-emerald-950/50 text-emerald-300' : 'text-slate-200'
                            }`}
                          >
                            <div className="space-y-0.5">
                              <div className="flex items-center space-x-1.5">
                                <span className="font-semibold text-xs text-white">{gp.name}</span>
                                <span className="text-[10px] text-emerald-400/80 font-mono">({gp.id})</span>
                              </div>
                              <div className="text-[10px] text-amber-300/80 font-medium">
                                {gp.name_kn}
                              </div>
                              <div className="text-[10px] text-slate-400 flex items-center space-x-2">
                                <span>Taluk: {gp.taluk}</span>
                                <span>•</span>
                                <span>Pop: {gp.population.toLocaleString('en-IN')}</span>
                              </div>
                            </div>

                            <div className="shrink-0 flex flex-col items-end space-y-1">
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                {gp.health_score}%
                              </span>
                              {isSelected && (
                                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Master Directory & Add GP Buttons */}
                    <div className="pt-2 px-3 border-t border-white/5 space-y-2">
                      <button
                        onClick={() => {
                          setGpMenuOpen(false);
                          setSelectorModalOpen(true);
                        }}
                        className="w-full py-2 px-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-cyan-300 border border-cyan-500/30 font-bold text-xs flex items-center justify-center space-x-2 transition"
                      >
                        <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Browse All {panchayats.length} Councils & Search</span>
                      </button>

                      <button
                        onClick={() => {
                          setGpMenuOpen(false);
                          setAddModalOpen(true);
                        }}
                        className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-emerald-950/50 transition"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>+ Register New Gram Panchayat</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Direct Full Directory Trigger Pill */}
              <button
                onClick={() => setSelectorModalOpen(true)}
                className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-cyan-950/70 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-500/40 font-mono text-[11px] transition shadow-sm"
                title="Open comprehensive Gram Panchayat master selection modal"
              >
                <Building2 className="w-3 h-3 text-cyan-400" />
                <span>Select Council ({panchayats.length})</span>
              </button>
            </div>
          </div>

          {/* Center: Live Clock & Sync Beacon */}
          <div className="hidden lg:flex items-center space-x-2 text-slate-400 font-mono text-[11px]">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>{new Date().toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short' })}</span>
            <span className="text-slate-600">•</span>
            <span className="text-cyan-300 font-semibold">{time} IST</span>
            <span className="text-[10px] text-emerald-400 bg-emerald-950/40 px-2 py-0.2 rounded-full border border-emerald-800/40">
              Telemetry Synced
            </span>
          </div>

          {/* Right Controls: Role Switcher, Kannada Toggle, Theme Toggle */}
          <div className="flex items-center space-x-2.5">
            {/* Quick Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="glass-pill px-3 py-1 flex items-center space-x-1.5 text-slate-200 hover:text-white transition"
                title="Test application under different departmental roles"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-medium text-[11px]">
                  Role: <strong className="text-emerald-400 font-bold">{role}</strong>
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {roleMenuOpen && (
                <div 
                  className="absolute right-0 mt-2 w-56 glass-panel border border-slate-700/80 shadow-[0_20px_50px_rgba(0,0,0,0.8)] py-1.5 z-50 text-xs animate-in fade-in duration-200"
                  onMouseLeave={() => setRoleMenuOpen(false)}
                >
                  <div className="px-3.5 py-1.5 border-b border-white/5 font-bold text-slate-400 text-[10px] uppercase tracking-wider">
                    Select Department Role
                  </div>
                  {rolesList.map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        switchRole(r);
                        setRoleMenuOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 flex items-center justify-between hover:bg-white/[0.06] transition ${
                        role === r ? 'text-emerald-400 font-bold bg-emerald-950/40' : 'text-slate-300'
                      }`}
                    >
                      <span>{r}</span>
                      {role === r && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Bilingual Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="glass-pill px-3 py-1 flex items-center space-x-1 text-amber-300 font-bold text-[11px] transition"
              title="Toggle English / ಕನ್ನಡ"
            >
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'en' ? 'ಕನ್ನಡ' : 'English'}</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="glass-pill p-1.5 text-slate-300 hover:text-white transition"
              title="Toggle Dark / Light Theme"
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-cyan-400" />}
            </button>
          </div>
        </div>
      </div>

      {/* Success Toast */}
      {successToast && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-emerald-950/90 border border-emerald-500/60 text-emerald-200 text-xs font-semibold shadow-[0_10px_30px_rgba(16,185,129,0.3)] backdrop-blur-xl flex items-center space-x-2 animate-in fade-in slide-in-from-top duration-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Comprehensive Gram Panchayat Selector Modal & Master Directory */}
      <PanchayatSelectorModal
        isOpen={selectorModalOpen}
        onClose={() => setSelectorModalOpen(false)}
        onOpenAddModal={() => setAddModalOpen(true)}
      />

      {/* Register New Gram Panchayat Modal Dialog */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl glass-panel bg-[#09152e]/95 border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden">
            {/* Header Background Glow */}
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between pb-4 border-b border-white/10 relative z-10">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">Register New Gram Panchayat</h3>
                  <p className="text-xs text-slate-400">
                    Connect a new rural administrative council to VillageVerse AI OS
                  </p>
                </div>
              </div>
              <button
                onClick={() => setAddModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGP} className="mt-5 space-y-4 relative z-10 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Gram Panchayat Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maddur Rural Gram Panchayat"
                    value={newGPForm.name}
                    onChange={(e) => {
                      const val = e.target.value;
                      setNewGPForm(prev => ({
                        ...prev, 
                        name: val,
                        name_kn: prev.name_kn || `${val} ಗ್ರಾಮ ಪಂಚಾಯತ್`,
                        id: prev.id || `GP-KA-MND-${Math.floor(100 + Math.random() * 900)}`
                      }));
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Kannada Name (ಕನ್ನಡದಲ್ಲಿ ಹೆಸರು)
                  </label>
                  <input
                    type="text"
                    placeholder="ಉದಾ: ಮದ್ದೂರು ಗ್ರಾಮೀಣ ಪಂಚಾಯಿತಿ"
                    value={newGPForm.name_kn}
                    onChange={(e) => setNewGPForm(prev => ({ ...prev, name_kn: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-amber-300 placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    GP Identifier / Code
                  </label>
                  <input
                    type="text"
                    placeholder="GP-KA-MND-047"
                    value={newGPForm.id}
                    onChange={(e) => setNewGPForm(prev => ({ ...prev, id: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-cyan-300 font-mono placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Taluk
                  </label>
                  <select
                    value={newGPForm.taluk}
                    onChange={(e) => setNewGPForm(prev => ({ ...prev, taluk: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-200 focus:outline-none focus:border-cyan-400 transition"
                  >
                    <option value="Mandya">Mandya (ಮಂಡ್ಯ)</option>
                    <option value="Maddur">Maddur (ಮದ್ದೂರು)</option>
                    <option value="Malavalli">Malavalli (ಮಳವಳ್ಳಿ)</option>
                    <option value="Pandavapura">Pandavapura (ಪಾಂಡವಪುರ)</option>
                    <option value="Srirangapatna">Srirangapatna (ಶ್ರೀರಂಗಪಟ್ಟಣ)</option>
                    <option value="Nagamangala">Nagamangala (ನಾಗಮಂಗಲ)</option>
                    <option value="K.R. Pet">K.R. Pet (ಕೆ.ಆರ್. ಪೇಟೆ)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    District
                  </label>
                  <input
                    type="text"
                    value={newGPForm.district}
                    onChange={(e) => setNewGPForm(prev => ({ ...prev, district: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-slate-200 focus:outline-none focus:border-cyan-400 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Population
                  </label>
                  <input
                    type="number"
                    value={newGPForm.population}
                    onChange={(e) => setNewGPForm(prev => ({ ...prev, population: Number(e.target.value) }))}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.05] border border-white/10 text-white font-mono focus:outline-none focus:border-cyan-400 transition"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Households
                  </label>
                  <input
                    type="number"
                    value={newGPForm.households}
                    onChange={(e) => setNewGPForm(prev => ({ ...prev, households: Number(e.target.value) }))}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.05] border border-white/10 text-white font-mono focus:outline-none focus:border-cyan-400 transition"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Area (sq. km)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={newGPForm.area_sq_km}
                    onChange={(e) => setNewGPForm(prev => ({ ...prev, area_sq_km: Number(e.target.value) }))}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.05] border border-white/10 text-white font-mono focus:outline-none focus:border-cyan-400 transition"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Health Score (%)
                  </label>
                  <input
                    type="number"
                    min="50"
                    max="100"
                    value={newGPForm.health_score}
                    onChange={(e) => setNewGPForm(prev => ({ ...prev, health_score: Number(e.target.value) }))}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.05] border border-white/10 text-emerald-400 font-mono font-bold focus:outline-none focus:border-cyan-400 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Panchayat Focus / Specialization
                </label>
                <input
                  type="text"
                  placeholder="e.g. Silk Sericulture, Dairy, Heritage Eco-Tourism, Solar Microgrids"
                  value={newGPForm.specialization}
                  onChange={(e) => setNewGPForm(prev => ({ ...prev, specialization: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition"
                />
              </div>

              <div className="pt-4 flex items-center justify-end space-x-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold text-xs shadow-[0_0_25px_rgba(16,185,129,0.4)] transition flex items-center space-x-2 disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  <span>{isSubmitting ? 'Registering...' : 'Save & Switch to Gram Panchayat'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};