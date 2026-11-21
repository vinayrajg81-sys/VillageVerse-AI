// VillageVerse AI: Premium Government AI Public Portal (Vision Pro & Palantir Inspired)
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { usePanchayat } from '../context/PanchayatContext';
import { 
  Box, ShieldCheck, ArrowRight, Droplets, Sprout, Zap, HeartPulse, 
  GraduationCap, Trash2, Trees, ShieldAlert, Sparkles, PhoneCall, 
  ExternalLink, Search, CheckCircle2, ChevronRight, Globe, Moon, 
  Sun, Activity, MapPin, Award, Users, Home, FileText, Sliders, Command 
} from 'lucide-react';

export const PublicPortal: React.FC = () => {
  const { language, toggleLanguage, t } = useLanguage();
  const { role, switchRole } = useAuth();
  const { activePanchayat } = usePanchayat();
  const gpDisplayName = activePanchayat.name.replace(/\s*(Rural\s*)?Gram\s*Panchayat/i, '').trim() || activePanchayat.name;
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const publicServices = [
    {
      title: 'Water Supply & Quality',
      title_kn: 'ಕುಡಿಯುವ ನೀರು ಮತ್ತು ಗುಣಮಟ್ಟ',
      desc: 'Check 24x7 piped water storage, reservoir levels (82.4%) and WHO potability metrics.',
      icon: Droplets,
      color: 'text-cyan-400',
      tag: 'IoT Monitored',
      link: '/water'
    },
    {
      title: 'Farmer Support & APMC Rates',
      title_kn: 'ರೈತರ ಸೇವೆಗಳು ಮತ್ತು ಮಂಡಿ ದರ',
      desc: 'Live Mandya APMC mandi prices, soil moisture sensors, and AI leaf disease scanner.',
      icon: Sprout,
      color: 'text-emerald-400',
      tag: 'Live Mandi Feed',
      link: '/agriculture'
    },
    {
      title: 'Citizen Grievance Redressal',
      title_kn: 'ದೂರು ನಿವಾರಣಾ ಪೋರ್ಟಲ್',
      desc: 'Lodge geotagged civic complaints with photo and voice note. Track live SLA progress.',
      icon: CheckCircle2,
      color: 'text-amber-400',
      tag: 'AI Auto-Triaged',
      link: '/complaints'
    },
    {
      title: 'Primary Health Centre & 108',
      title_kn: 'ಆರೋಗ್ಯ ಸೇವೆ ಮತ್ತು ಆಂಬುಲೆನ್ಸ್',
      desc: 'PHC Shivalli bed vacancy, doctor on duty rosters, and live 108 GPS ambulance dispatch.',
      icon: HeartPulse,
      color: 'text-rose-400',
      tag: 'Tele-Medicine',
      link: '/healthcare'
    },
    {
      title: 'Solar Microgrid & Power',
      title_kn: 'ಸೌರಶಕ್ತಿ ಮತ್ತು ವಿದ್ಯುತ್ ಗ್ರಿಡ್',
      desc: '120 kWp community solar array status, Gruha Jyothi zero-bill tracking, and outage radar.',
      icon: Zap,
      color: 'text-amber-400',
      tag: '45.4% Solar Net',
      link: '/electricity'
    },
    {
      title: 'Disaster Early Warning (KSNDMC)',
      title_kn: 'ವಿಪತ್ತು ಮುನ್ಸೂಚನೆ ಮತ್ತು ಎಚ್ಚರಿಕೆ',
      desc: 'Cauvery river flood forecasting, lightning alerts, and safe cyclone shelters.',
      icon: ShieldAlert,
      color: 'text-teal-400',
      tag: 'Early Warning',
      link: '/disaster'
    }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const q = searchQuery.toLowerCase();
    if (q.includes('twin') || q.includes('3d') || q.includes('map')) navigate('/digital-twin');
    else if (q.includes('water') || q.includes('tank')) navigate('/water');
    else if (q.includes('crop') || q.includes('mandi') || q.includes('farmer')) navigate('/agriculture');
    else if (q.includes('complaint') || q.includes('pothole') || q.includes('leak')) navigate('/complaints');
    else if (q.includes('health') || q.includes('doctor')) navigate('/healthcare');
    else if (q.includes('simulat')) navigate('/simulation');
    else navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white relative overflow-x-hidden">
      {/* 1. Animated Aurora Background */}
      <div className="aurora-bg">
        <div className="aurora-orb-1" />
        <div className="aurora-orb-2" />
        <div className="aurora-orb-3" />
      </div>

      {/* Cyber Grid Texture */}
      <div className="fixed inset-0 cyber-grid pointer-events-none opacity-40 z-0" />

      {/* National Tricolor Top Ribbon */}
      <div className="fixed top-0 left-0 right-0 gov-ribbon z-50" />

      {/* 2. Official National & State Identity Bar */}
      <div className="w-full bg-[#080e1e]/85 backdrop-blur-xl border-b border-white/[0.06] text-xs text-slate-300 pt-1 relative z-30">
        <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
              <span className="text-amber-400 font-extrabold tracking-wider">ಕರ್ನಾಟಕ ಸರ್ಕಾರ</span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-200">Government of Karnataka</span>
              <span className="text-slate-600">|</span>
              <span className="text-emerald-400 hidden md:inline">Department of Rural Development & Panchayat Raj</span>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <span className="hidden sm:inline-block px-3 py-0.5 rounded-full bg-white/[0.04] text-slate-300 border border-white/[0.08] font-mono text-[11px]">
              Code: <strong className="text-emerald-400">GP-KA-MND-042</strong>
            </span>
            <button
              onClick={toggleLanguage}
              className="glass-pill px-3 py-1 flex items-center space-x-1 text-amber-300 font-bold text-[11px] transition"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'ಕನ್ನಡ' : 'English'}</span>
            </button>
            <Link
              to="/login"
              className="px-3.5 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition shadow-[0_0_15px_rgba(16,185,129,0.3)] text-[11px]"
            >
              Officer Login
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Floating Spatial Header */}
      <header className="sticky top-2 z-40 max-w-7xl mx-auto w-full px-4 pt-2">
        <div className="glass-panel border border-white/[0.08] px-5 py-3 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 pulse-glow">
              <Box className="w-5 h-5 text-slate-950 font-black" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-black text-lg tracking-tight text-white">
                  VillageVerse <span className="text-emerald-400">AI</span>
                </span>
                <span className="text-[10px] uppercase font-mono font-bold tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Gov Foundry
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                {activePanchayat.name} • {activePanchayat.district || 'Mandya'} District
              </p>
            </div>
          </div>

          <div className="hidden lg:flex items-center space-x-6 text-xs font-semibold text-slate-300">
            <Link to="/digital-twin" className="hover:text-emerald-400 transition">3D Digital Twin</Link>
            <Link to="/dashboard" className="hover:text-emerald-400 transition">Command Dashboard</Link>
            <Link to="/simulation" className="hover:text-emerald-400 transition">What-If Simulator</Link>
            <Link to="/agriculture" className="hover:text-emerald-400 transition">Agriculture & Mandi</Link>
            <Link to="/complaints" className="hover:text-emerald-400 transition">Grievances</Link>
            <Link to="/chatbot" className="hover:text-emerald-400 transition">Village AI</Link>
          </div>

          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 text-white font-extrabold text-xs shadow-[0_0_20px_rgba(16,185,129,0.3)] transition flex items-center space-x-1.5"
          >
            <span>Enter Officer Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* 4. Spatial Hero Section */}
      <section className="relative py-16 md:py-24 px-4 max-w-7xl mx-auto z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>National Smart Gram Swaraj Initiative • Production Digital Twin</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
              Next-Gen AI Platform for <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                Intelligent Village
              </span>{' '}
              Development
            </h1>

            <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-2xl">
              Engineered with <strong className="text-white">Palantir Foundry & Tesla Cyber-OS</strong> inspiration. 
              Real-time 3D spatial simulation, 48 multi-spectral IoT telemetry nodes, autonomous leak detection, 
              and precision agriculture for <strong className="text-emerald-400 font-bold">{activePanchayat.name}, Karnataka</strong>.
            </p>

            {/* Quick Search */}
            <form onSubmit={handleSearch} className="max-w-xl">
              <div className="relative">
                <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search water tanks, crop prices, roads, PHC doctors, schemes..."
                  className="w-full pl-12 pr-28 py-3.5 rounded-[20px] bg-white/[0.04] border border-white/[0.1] text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500/60 focus:bg-white/[0.08] shadow-[0_20px_40px_rgba(0,0,0,0.5)] transition"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => navigate('/digital-twin')}
                className="px-6 py-3.5 rounded-[20px] bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 text-white font-extrabold text-sm shadow-[0_0_30px_rgba(16,185,129,0.35)] transition flex items-center space-x-2"
              >
                <Box className="w-4 h-4" />
                <span>Launch 3D Spatial Twin</span>
              </button>

              <button
                onClick={() => navigate('/simulation')}
                className="px-5 py-3.5 rounded-[20px] bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] text-slate-200 font-bold text-sm transition flex items-center space-x-2"
              >
                <Sliders className="w-4 h-4 text-emerald-400" />
                <span>What-If Simulator</span>
              </button>

              <button
                onClick={() => navigate('/complaints')}
                className="px-5 py-3.5 rounded-[20px] bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] text-slate-200 font-bold text-sm transition flex items-center space-x-2"
              >
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>Citizen Grievance</span>
              </button>
            </div>
          </div>

          {/* Right Card: Live Digital Twin Scorecard */}
          <div className="lg:col-span-5">
            <div className="glass-card p-6 md:p-8 rounded-[24px] border border-white/[0.1] shadow-[0_30px_70px_rgba(0,0,0,0.7)] space-y-5 bg-gradient-to-br from-slate-900/90 via-[#0b1733]/85 to-emerald-950/40 relative">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-400 font-bold">
                    Panchayat Telemetry Hub
                  </span>
                  <h3 className="text-lg font-black text-white">{activePanchayat.name}</h3>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Live Sync
                </span>
              </div>

              {/* Central Composite Gauge */}
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono uppercase text-slate-400">AI Village Health Score</span>
                  <div className="text-4xl font-black text-white mt-1 flex items-baseline gap-1">
                    86 <span className="text-sm font-normal text-slate-400 font-mono">/ 100</span>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-400 font-mono">
                    Grade A+ (Leading Mandya Taluk)
                  </span>
                </div>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 flex items-center justify-center text-slate-950 font-black text-xl shadow-[0_0_25px_rgba(16,185,129,0.35)]">
                  86%
                </div>
              </div>

              {/* 4 Mini Vitals */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                  <span className="text-slate-400 text-[10px] font-mono block">WATER STORAGE</span>
                  <strong className="text-cyan-400 font-bold text-base font-mono">82.4%</strong>
                  <span className="text-[10px] text-slate-500 block">650k L Reservoir</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                  <span className="text-slate-400 text-[10px] font-mono block">CLEAN SOLAR</span>
                  <strong className="text-amber-400 font-bold text-base font-mono">45.4% Share</strong>
                  <span className="text-[10px] text-slate-500 block">120 kWp Microgrid</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                  <span className="text-slate-400 text-[10px] font-mono block">AIR QUALITY</span>
                  <strong className="text-emerald-400 font-bold text-base font-mono">AQI 42</strong>
                  <span className="text-[10px] text-slate-500 block">12,450 Trees</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                  <span className="text-slate-400 text-[10px] font-mono block">ROAD QUALITY</span>
                  <strong className="text-emerald-400 font-bold text-base font-mono">PCI 81 / 100</strong>
                  <span className="text-[10px] text-slate-500 block">28.6 km Network</span>
                </div>
              </div>

              <div className="pt-2 text-center">
                <Link
                  to="/dashboard"
                  className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center justify-center gap-1 group"
                >
                  <span>Explore Full 20-Department Real-Time Intelligence</span>
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Village Vital Statistics Bar */}
      <section className="py-8 bg-white/[0.02] border-y border-white/[0.06] relative z-10">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 text-center">
          <div>
            <div className="text-2xl md:text-3xl font-black text-white font-mono">4,820</div>
            <div className="text-xs text-slate-400 mt-0.5">Village Population</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-black text-white font-mono">1,140</div>
            <div className="text-xs text-slate-400 mt-0.5">Households Connected</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-black text-emerald-400 font-mono">1,840</div>
            <div className="text-xs text-slate-400 mt-0.5">Acres Cultivated</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-black text-cyan-400 font-mono">100%</div>
            <div className="text-xs text-slate-400 mt-0.5">Piped Tap Water</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-black text-amber-400 font-mono">120 kWp</div>
            <div className="text-xs text-slate-400 mt-0.5">Community Solar</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-black text-rose-400 font-mono">98.4%</div>
            <div className="text-xs text-slate-400 mt-0.5">Vaccination Coverage</div>
          </div>
        </div>
      </section>

      {/* 6. Citizen Public Services Grid (6 Core Pillars) */}
      <section className="py-16 px-4 max-w-7xl mx-auto space-y-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/30">
            Citizen Public Services
          </span>
          <h2 className="text-2xl md:text-4xl font-black text-white">
            Digital Gram Swaraj Citizen Services
          </h2>
          <p className="text-xs md:text-sm text-slate-400">
            Real-time public utility telemetry, emergency health access, and direct grievance submission for {gpDisplayName} residents.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {publicServices.map((service, idx) => {
            const Icon = service.icon;
            return (
              <div
                key={idx}
                onClick={() => navigate(service.link)}
                className="glass-card p-6 rounded-[24px] border border-white/[0.08] transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-4 group hover:border-emerald-500/40 hover:-translate-y-1.5"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center transition-transform group-hover:scale-110 shadow-md">
                      <Icon className={`w-6 h-6 ${service.color}`} />
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-white/[0.04] text-slate-300 border border-white/[0.08]">
                      {service.tag}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition">
                      {service.title}
                    </h3>
                    <p className="text-amber-300 text-xs font-semibold">{service.title_kn}</p>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      {service.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-semibold text-emerald-400">
                  <span>Access Service Portal</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. Citizen Self-Service & Grievance Tracking Hub */}
      <section className="py-12 px-4 max-w-7xl mx-auto space-y-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Track Grievance Status Live */}
          <div className="glass-card p-6 sm:p-8 rounded-[24px] border border-white/[0.08] space-y-5">
            <div className="flex items-center space-x-2.5">
              <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                <CheckCircle2 className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-base font-bold text-white">Live Grievance SLA Tracker</h3>
                <p className="text-xs text-slate-400">Track real-time resolution progress of your civic complaint</p>
              </div>
            </div>

            <div className="flex gap-2">
              <input 
                type="text" 
                defaultValue="CMP-2026-081" 
                placeholder="Enter Ticket ID (e.g. CMP-2026-081)"
                className="flex-1 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
              />
              <button 
                onClick={() => alert('Grievance CMP-2026-081 Status: In Progress. Assigned Officer: Suresh Kumar (AE Water). Expected Resolution: Within 12 Hours.')}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow"
              >
                Track SLA
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Recent Tracked Ticket:</span>
                <span className="font-mono text-emerald-400 font-bold">CMP-2026-081</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Category:</span>
                <span className="text-slate-200">Drinking Water Pipeline Low Pressure</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Assigned Official:</span>
                <span className="text-cyan-300 font-medium">Suresh Kumar (AE Water Works)</span>
              </div>
              <div className="pt-2 border-t border-white/[0.05] flex items-center justify-between">
                <span className="text-slate-400">Status:</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800">
                  In Progress (Action Initiated)
                </span>
              </div>
            </div>
          </div>

          {/* Quick Citizen Service Requests */}
          <div className="glass-card p-6 sm:p-8 rounded-[24px] border border-white/[0.08] space-y-5">
            <div className="flex items-center space-x-2.5">
              <span className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
                <FileText className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-base font-bold text-white">Citizen Suvidha Service Requests</h3>
                <p className="text-xs text-slate-400">Direct digital applications for Gram Panchayat municipal certificates</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              {[
                { name: 'JJM Piped Tap Connection', time: '48 Hrs SLA', fee: '₹0 (Free)' },
                { name: 'Property e-Swathu Extract', time: '24 Hrs SLA', fee: '₹25' },
                { name: 'Soil Health Testing Card', time: '3 Days SLA', fee: '₹0 (APMC)' },
                { name: 'Streetlight Repair Request', time: '12 Hrs SLA', fee: '₹0 (Free)' }
              ].map((srv, idx) => (
                <div 
                  key={idx} 
                  onClick={() => alert(`Service application initiated for: ${srv.name}. Gram Panchayat notification sent.`)}
                  className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-cyan-500/40 hover:bg-white/[0.04] transition cursor-pointer flex flex-col justify-between"
                >
                  <span className="font-bold text-white leading-snug">{srv.name}</span>
                  <div className="flex items-center justify-between text-[10px] font-mono mt-2 pt-2 border-t border-white/[0.05] text-slate-400">
                    <span className="text-emerald-400">{srv.time}</span>
                    <span className="text-cyan-300">{srv.fee}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Karnataka Government Welfare Schemes Catalog & Emergency Numbers */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass-card p-6 sm:p-8 rounded-[24px] border border-white/[0.08] space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              Direct Benefit Government Schemes (Karnataka & Central)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              {[
                { title: 'PM-KISAN & Raitha Siri', benefit: '₹10,000 / Year', eligible: 'All Mandya Sugarcane & Ragi Farmers' },
                { title: 'Gruha Jyothi Karnataka', benefit: 'Up to 200 Units Free Power', eligible: '100% Domestic Shivalli Households' },
                { title: 'Jal Jeevan Mission (JJM)', benefit: '55 LPCD Pure Treated Tap Water', eligible: 'Zero Cost Piped Connection' },
                { title: 'PM Surya Ghar Muft Bijli', benefit: '₹78,000 Solar Rooftop Subsidy', eligible: 'Unshaded Rooftops in Wards 1-4' }
              ].map((sch, i) => (
                <div key={i} className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-1">
                  <div className="font-bold text-emerald-400">{sch.title}</div>
                  <div className="text-slate-200 font-semibold">{sch.benefit}</div>
                  <div className="text-[10px] text-slate-400 font-mono">{sch.eligible}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Emergency 24x7 Helplines */}
          <div className="glass-card p-6 sm:p-8 rounded-[24px] border border-rose-500/30 bg-rose-950/20 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <PhoneCall className="w-5 h-5 text-rose-400" />
              24x7 Emergency Helplines
            </h3>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-300">108 Arogya Ambulance</span>
                <span className="font-mono text-emerald-400 font-bold">108 / 9845012399</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-300">BESCOM Electrical Fault</span>
                <span className="font-mono text-amber-400 font-bold">1912</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-300">Panchayat Disaster Desk</span>
                <span className="font-mono text-cyan-300 font-bold">9448102344</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-300">Women & Child Helpline</span>
                <span className="font-mono text-rose-300 font-bold">1091 / 112</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Official Government Footer */}
      <footer className="mt-auto bg-[#02050e] border-t border-white/[0.06] text-xs text-slate-400 py-12 px-4 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3">
            <div className="flex items-center space-x-2 font-bold text-white text-base">
              <Box className="w-5 h-5 text-emerald-400" />
              <span>VillageVerse AI</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Karnataka's First AI-Powered Digital Twin for Gram Panchayat Planning & Rural Development.
            </p>
            <div className="text-[11px] text-emerald-400 font-mono font-semibold">
              {activePanchayat.name} • {activePanchayat.district || 'Mandya'} District • Pin {activePanchayat.pincode || '571405'}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider font-mono">Public Navigation</h4>
            <ul className="space-y-1.5 text-slate-400 text-xs">
              <li><Link to="/digital-twin" className="hover:text-emerald-400">3D Village Digital Twin</Link></li>
              <li><Link to="/dashboard" className="hover:text-emerald-400">Command Dashboard</Link></li>
              <li><Link to="/simulation" className="hover:text-emerald-400">What-if Simulator</Link></li>
              <li><Link to="/complaints" className="hover:text-emerald-400">Grievance Redressal</Link></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider font-mono">Department Portals</h4>
            <ul className="space-y-1.5 text-slate-400 text-xs">
              <li><Link to="/agriculture" className="hover:text-emerald-400">Agriculture & Mandi APMC</Link></li>
              <li><Link to="/water" className="hover:text-emerald-400">Water Supply & Jal Jeevan</Link></li>
              <li><Link to="/electricity" className="hover:text-emerald-400">Solar Microgrid & Energy</Link></li>
              <li><Link to="/healthcare" className="hover:text-emerald-400">PHC & Telemedicine</Link></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider font-mono">Official Compliance</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Designed in compliance with National Informatics Centre (NIC) guidelines, Digital India, and Government of Karnataka Rural Development standards.
            </p>
            <div className="pt-1 flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-[10px] text-slate-400 font-mono">
                Version 1.0.0 Production
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-[10px] text-emerald-400 font-bold font-mono">
                SSL Secured
              </span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
          <div>
            © 2026 VillageVerse AI • {activePanchayat.name}, {activePanchayat.district || 'Mandya'} District, Government of Karnataka.
          </div>
          <div className="flex items-center space-x-4">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Citizen Charter</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">RTI Karnataka</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
