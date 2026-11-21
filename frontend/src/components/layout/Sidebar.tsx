// VillageVerse AI: Arc Browser & Vision Pro Inspired Floating Translucent Sidebar
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import {
  LayoutDashboard, Box, Sprout, Droplets, Milestone, Zap, HeartPulse,
  GraduationCap, Trash2, Trees, ShieldAlert, Sparkles, TrendingUp, Sliders,
  MessageSquareWarning, Leaf, Bot, FileText, Users, Settings, ChevronRight, Globe, Activity
} from 'lucide-react';

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

interface SidebarItem {
  num: string;
  path: string;
  label: string;
  icon: any;
  badge?: string;
  alert?: boolean;
}

interface SidebarSection {
  title: string;
  items: SidebarItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const { t } = useLanguage();

  const sections: SidebarSection[] = [
    {
      title: 'Spatial & Digital Twin',
      items: [
        { num: '01', path: '/dashboard', label: t('m_dashboard'), icon: LayoutDashboard, badge: 'Live' },
        { num: '02', path: '/digital-twin', label: t('m_digital_twin'), icon: Box, badge: '3D Twin' }
      ]
    },
    {
      title: 'Natural Resources',
      items: [
        { num: '03', path: '/agriculture', label: t('m_agriculture'), icon: Sprout },
        { num: '04', path: '/water', label: t('m_water'), icon: Droplets },
        { num: '10', path: '/environment', label: t('m_environment'), icon: Trees }
      ]
    },
    {
      title: 'Civic Infrastructure',
      items: [
        { num: '05', path: '/roads', label: t('m_roads'), icon: Milestone },
        { num: '06', path: '/electricity', label: t('m_electricity'), icon: Zap },
        { num: '07', path: '/healthcare', label: t('m_healthcare'), icon: HeartPulse },
        { num: '08', path: '/education', label: t('m_education'), icon: GraduationCap },
        { num: '09', path: '/waste', label: t('m_waste'), icon: Trash2 },
        { num: '11', path: '/disaster', label: t('m_disaster'), icon: ShieldAlert, alert: true }
      ]
    },
    {
      title: 'AI Intelligence & Sim',
      items: [
        { num: '12', path: '/future-prediction', label: t('m_future_prediction'), icon: TrendingUp },
        { num: '13', path: '/development-planner', label: t('m_development_planner'), icon: Sparkles },
        { num: '14', path: '/simulation', label: t('m_simulation'), icon: Sliders, badge: 'Simulator' },
        { num: '17', path: '/chatbot', label: t('m_chatbot'), icon: Bot, badge: 'AI' }
      ]
    },
    {
      title: 'Governance & Audit',
      items: [
        { num: '15', path: '/complaints', label: t('m_complaints'), icon: MessageSquareWarning, badge: '4' },
        { num: '16', path: '/sustainability', label: t('m_sustainability'), icon: Leaf },
        { num: '18', path: '/reports', label: t('m_reports'), icon: FileText },
        { num: '19', path: '/user-management', label: t('m_user_management'), icon: Users },
        { num: '20', path: '/settings', label: t('m_settings'), icon: Settings }
      ]
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/70 backdrop-blur-md z-40 lg:hidden"
        />
      )}

      {/* Floating Translucent Sidebar Dock */}
      <aside
        className={`fixed top-12 bottom-4 left-4 z-40 w-64 glass-panel border border-white/[0.08] shadow-[0_24px_60px_rgba(0,0,0,0.6)] flex flex-col transition-all duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-[110%]'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 pulse-glow">
              <Box className="w-5 h-5 text-slate-950 font-bold" />
            </div>
            <div>
              <h1 className="font-extrabold text-sm text-white tracking-wide flex items-center gap-1.5">
                VillageVerse <span className="text-emerald-400">AI</span>
              </h1>
              <p className="text-[10px] text-slate-400 font-mono">Foundry Platform</p>
            </div>
          </div>
        </div>

        {/* Public Portal Quick Return Pill */}
        <div className="px-3 pt-3">
          <NavLink
            to="/"
            onClick={onCloseMobile}
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold bg-white/[0.03] hover:bg-emerald-950/40 text-slate-300 hover:text-emerald-400 border border-white/[0.06] hover:border-emerald-500/40 transition group"
          >
            <div className="flex items-center space-x-2">
              <Globe className="w-3.5 h-3.5 text-emerald-400 transition-transform group-hover:rotate-12" />
              <span className="text-[11px]">Public Portal & Home</span>
            </div>
            <span className="text-[10px] text-slate-500 group-hover:text-emerald-400">↗</span>
          </NavLink>
        </div>

        {/* Grouped 20 Modules Scrollable Area */}
        <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4 no-scrollbar">
          {sections.map((sec, sIdx) => (
            <div key={sIdx} className="space-y-1">
              <div className="px-3 text-[10px] font-mono font-bold tracking-widest text-slate-500 uppercase">
                {sec.title}
              </div>

              {sec.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onCloseMobile}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium transition group ${
                        isActive
                          ? 'bg-gradient-to-r from-emerald-500/25 to-cyan-500/15 text-emerald-300 border border-emerald-500/40 shadow-[0_0_20px_-3px_rgba(16,185,129,0.3)] font-semibold'
                          : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.04]'
                      }`
                    }
                  >
                    <div className="flex items-center space-x-2.5 truncate">
                      <span className="text-[10px] font-mono text-slate-600 group-hover:text-slate-400">
                        {item.num}
                      </span>
                      <Icon className="w-3.5 h-3.5 shrink-0 transition-transform group-hover:scale-110" />
                      <span className="truncate text-[11px]">{item.label}</span>
                    </div>

                    <div className="flex items-center space-x-1 shrink-0 ml-1.5">
                      {item.badge && (
                        <span className="text-[9px] font-mono font-semibold px-1.5 py-0.2 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/80">
                          {item.badge}
                        </span>
                      )}
                      {item.alert && (
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b] animate-ping" />
                      )}
                    </div>
                  </NavLink>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer Palantir HUD Vitals Card */}
        <div className="p-3 border-t border-white/[0.06] bg-white/[0.02] m-2 rounded-2xl">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-[11px] font-mono text-slate-400">Village Health</span>
            <span className="font-mono font-black text-emerald-400 text-xs">86 / 100</span>
          </div>
          <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-white/[0.05]">
            <div className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 h-full w-[86%]" />
          </div>
          <div className="text-[10px] text-slate-500 mt-2 flex items-center justify-between font-mono">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
              48 Nodes Online
            </span>
            <span className="text-emerald-400">0.4ms Latency</span>
          </div>
        </div>
      </aside>
    </>
  );
};
