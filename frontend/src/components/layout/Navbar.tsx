// VillageVerse AI: Premium Spatial Navigation Bar with Interactive Command Palette (Tesla / Vision Pro Inspired)
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { usePanchayat } from '../../context/PanchayatContext';
import { 
  Search, Bell, CloudSun, UserCheck, Menu, X, CheckCircle, 
  AlertTriangle, Info, LogOut, Globe, Sparkles, Command,
  Box, Sprout, Droplets, Zap, ShieldAlert, HeartPulse,
  GraduationCap, Trash2, Sliders, MessageSquare, FileText,
  Settings, Users, ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabase';

interface NavbarProps {
  onToggleMobileSidebar: () => void;
  mobileSidebarOpen: boolean;
}

const COMMAND_MODULES = [
  { name: 'AI Command Center', path: '/dashboard', icon: Sparkles, category: 'Core' },
  { name: '3D Spatial Digital Twin', path: '/digital-twin', icon: Box, category: 'Spatial' },
  { name: 'Agriculture & APMC Mandi', path: '/agriculture', icon: Sprout, category: 'Sectors' },
  { name: 'Water Resources & JJM', path: '/water', icon: Droplets, category: 'Sectors' },
  { name: 'Roads & Works', path: '/roads', icon: Sliders, category: 'Infrastructure' },
  { name: 'Electricity & Solar Grid', path: '/electricity', icon: Zap, category: 'Energy' },
  { name: 'Primary Healthcare & Tele-ICU', path: '/healthcare', icon: HeartPulse, category: 'Health' },
  { name: 'Education & Schools', path: '/education', icon: GraduationCap, category: 'Social' },
  { name: 'Waste Management & Bins', path: '/waste', icon: Trash2, category: 'Sanitation' },
  { name: 'Environment & AQI', path: '/environment', icon: CloudSun, category: 'Eco' },
  { name: 'Disaster & Flood Early Warning', path: '/disaster', icon: ShieldAlert, category: 'Hazard' },
  { name: 'AI Future Forecasting', path: '/forecast', icon: Sparkles, category: 'Predictive' },
  { name: 'AI Development Planner', path: '/planner', icon: Sliders, category: 'Planning' },
  { name: 'AI What-If Simulation Sandbox', path: '/simulation', icon: Sliders, category: 'Simulation' },
  { name: 'Citizen Grievance & Complaints', path: '/complaints', icon: MessageSquare, category: 'Citizen' },
  { name: 'SDG Rural Sustainability', path: '/sustainability', icon: Globe, category: 'Sustainability' },
  { name: 'AI Copilot Conversational Core', path: '/chatbot', icon: MessageSquare, category: 'Intelligence' },
  { name: 'Executive Decision Reports & DPR', path: '/reports', icon: FileText, category: 'Analytics' },
  { name: 'User Management & Roles', path: '/user-management', icon: Users, category: 'Admin' },
  { name: 'System Settings & Backup', path: '/settings', icon: Settings, category: 'Admin' }
];

export const Navbar: React.FC<NavbarProps> = ({ onToggleMobileSidebar, mobileSidebarOpen }) => {
  const { user, role, logout } = useAuth();
  const { activePanchayat } = usePanchayat();
  const gpDisplayName = activePanchayat?.name?.replace(/\s*(Rural\s*)?Gram\s*Panchayat/i, '').trim() || 'Village';
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Global Ctrl+K / Cmd+K keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen((prev) => !prev);
      } else if (e.key === 'Escape' && paletteOpen) {
        setPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [paletteOpen]);

  const defaultNotifications = [
    { id: 1, text: 'Microgrid solar output steady at 120 kWp', type: 'success', time: '12m ago' },
    { id: 2, text: 'Acoustic leak alert: Ward 2 Cross 4 culvert', type: 'warning', time: '35m ago' },
    { id: 3, text: 'Lightning advisory active for open farmlands', type: 'alert', time: '1h ago' }
  ];

  const [notifications, setNotifications] = useState(defaultNotifications);

  // Supabase Realtime Telemetry & Notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);

        if (!error && data && data.length > 0) {
          setNotifications(data.map((n: any) => ({
            id: n.id,
            text: n.message || n.title,
            type: n.type || 'info',
            time: new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          })));
        }
      } catch {}
    };

    fetchNotifications();

    const channel = supabase
      .channel('realtime:navbar-notifications')
      .on('postgres_changes' as any, { event: '*', schema: 'public', table: 'notifications' }, () => {
        fetchNotifications();
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  const filteredModules = COMMAND_MODULES.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectModule = (path: string) => {
    navigate(path);
    setPaletteOpen(false);
    setSearchQuery('');
  };

  return (
    <>
      <header className="sticky top-0 z-30 w-full px-4 pt-3 pb-1">
        <div className="glass-panel border border-white/[0.08] px-4 py-2.5 shadow-[0_16px_40px_rgba(0,0,0,0.4)] flex items-center justify-between gap-4">
          {/* Left: Mobile Toggle & Brand / Breadcrumb */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onToggleMobileSidebar}
              className="lg:hidden p-2 rounded-xl bg-white/[0.06] text-slate-300 hover:text-white hover:bg-white/[0.1] transition"
              aria-label="Toggle Navigation Menu"
            >
              {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 text-base md:text-lg tracking-tight">
                  VillageVerse AI
                </span>
                <span className="text-[10px] uppercase font-mono font-bold tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Command OS
                </span>
              </div>
              <span className="text-[11px] text-slate-400 hidden sm:inline font-mono">
                {gpDisplayName} GP • {activePanchayat.latitude.toFixed(4)}° N, {activePanchayat.longitude.toFixed(4)}° E
              </span>
            </div>
          </div>

          {/* Center: Command Palette Trigger Button */}
          <div
            onClick={() => setPaletteOpen(true)}
            className="hidden md:flex flex-1 max-w-md mx-4 items-center justify-between px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-cyan-500/50 hover:bg-white/[0.07] cursor-pointer transition text-xs text-slate-400"
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-400" />
              <span>Search modules, 3D assets, farmlands, complaints...</span>
            </div>
            <div className="flex items-center gap-1 font-mono text-[10px] bg-slate-900/80 px-2 py-0.5 rounded border border-slate-700 text-slate-300">
              <Command className="w-3 h-3" /> K
            </div>
          </div>

          {/* Right: Public Portal, Weather Widget, Notifications, User Badge */}
          <div className="flex items-center space-x-2.5">
            {/* Public Portal Switcher */}
            <button
              onClick={() => navigate('/')}
              className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-emerald-950/40 border border-white/[0.08] hover:border-emerald-500/40 text-xs text-slate-300 hover:text-emerald-400 transition"
              title="Open Citizen Public Portal"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-semibold text-[11px]">Public Portal</span>
            </button>

            {/* Micro Weather Bar */}
            <div 
              onClick={() => navigate('/environment')}
              className="cursor-pointer hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs text-slate-300 transition"
              title="Click to view Environmental Analytics"
            >
              <CloudSun className="w-4 h-4 text-amber-400 animate-pulse" />
              <span className="font-bold text-slate-200">29.4°C</span>
              <span className="text-slate-600">|</span>
              <span className="text-emerald-400 font-mono text-[11px]">AQI 42</span>
            </div>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border border-white/[0.08] transition"
                title="Notifications"
              >
                <Bell className="w-4 h-4 text-slate-300" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
              </button>

              {notificationsOpen && (
                <div 
                  className="absolute right-0 mt-3 w-80 glass-panel border border-slate-700/80 shadow-[0_20px_50px_rgba(0,0,0,0.8)] p-3.5 z-50 text-xs animate-in fade-in duration-200"
                  onMouseLeave={() => setNotificationsOpen(false)}
                >
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10 font-bold text-slate-200">
                    <span>Panchayat Telemetry Alerts</span>
                    <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800">
                      3 New
                    </span>
                  </div>
                  <div className="space-y-2">
                    {notifications.map((n) => (
                      <div key={n.id} className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-start space-x-2.5">
                        {n.type === 'success' && <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />}
                        {n.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />}
                        {n.type === 'alert' && <Info className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />}
                        <div className="flex-1">
                          <p className="text-slate-200 leading-snug">{n.text}</p>
                          <span className="text-[10px] text-slate-500 font-mono">{n.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Pill */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-2 p-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-emerald-500 to-cyan-400 flex items-center justify-center text-slate-950 font-black text-xs shadow-md">
                  {user?.full_name ? user.full_name[0] : 'U'}
                </div>
                <div className="hidden xl:flex flex-col text-left pr-1">
                  <span className="text-xs font-bold text-slate-200 leading-tight">
                    {user?.full_name?.split(' ')[0]}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono font-medium">
                    {role}
                  </span>
                </div>
              </button>

              {userMenuOpen && (
                <div 
                  className="absolute right-0 mt-3 w-64 glass-panel border border-slate-700/80 shadow-[0_20px_50px_rgba(0,0,0,0.8)] p-3 z-50 text-xs animate-in fade-in duration-200"
                  onMouseLeave={() => setUserMenuOpen(false)}
                >
                  <div className="pb-2.5 mb-2 border-b border-white/10">
                    <div className="font-bold text-slate-100">{user?.full_name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{user?.email}</div>
                    <div className="mt-1.5 text-[10px] px-2 py-0.5 inline-block rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800 font-bold">
                      Active: {role}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        navigate('/settings');
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-white/[0.06] text-slate-300 transition"
                    >
                      System Settings & Backup
                    </button>
                    <button
                      onClick={() => {
                        navigate('/user-management');
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-white/[0.06] text-slate-300 transition"
                    >
                      User Directory & Roles
                    </button>
                    <button
                      onClick={() => {
                        logout();
                        setUserMenuOpen(false);
                        navigate('/login');
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-rose-950/40 text-rose-400 transition flex items-center space-x-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Floating Apple Spotlight / Arc Command Palette Modal */}
      {paletteOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-start justify-center pt-20 px-4 animate-in fade-in duration-200">
          <div className="w-full max-w-xl glass-panel border border-cyan-500/40 shadow-[0_30px_100px_rgba(0,0,0,0.9)] rounded-[24px] overflow-hidden flex flex-col">
            {/* Search Input Bar */}
            <div className="p-4 border-b border-white/[0.08] flex items-center gap-3">
              <Search className="w-5 h-5 text-cyan-400" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Type a command or module name (e.g., 3D Twin, Solar, Grievance)..."
                className="flex-1 bg-transparent border-none text-white text-sm placeholder-slate-500 focus:outline-none font-sans"
              />
              <button
                onClick={() => setPaletteOpen(false)}
                className="px-2 py-1 rounded-lg bg-slate-800 text-[10px] font-mono text-slate-400 hover:text-white"
              >
                ESC
              </button>
            </div>

            {/* Results List */}
            <div className="max-h-80 overflow-y-auto p-2 space-y-1">
              {filteredModules.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectModule(item.path)}
                    className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-cyan-500/15 hover:border-cyan-500/30 border border-transparent transition text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-slate-900/90 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-slate-950 transition">
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white block group-hover:text-cyan-300">
                          {item.name}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {item.category} • {item.path}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 transition" />
                  </button>
                );
              })}
              {filteredModules.length === 0 && (
                <div className="p-6 text-center text-slate-500 text-xs">
                  No matching module found. Try searching for "Twin", "Solar", "Water", or "DPR".
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-2.5 bg-slate-950/80 border-t border-white/[0.06] text-[10px] font-mono text-slate-400 flex items-center justify-between px-4">
              <span>Use <strong>Enter</strong> to jump • <strong>ESC</strong> to dismiss</span>
              <span className="text-cyan-400 font-semibold">{gpDisplayName} Command Navigator</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
