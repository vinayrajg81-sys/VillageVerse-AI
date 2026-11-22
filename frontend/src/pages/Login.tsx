// VillageVerse AI: Government-Grade Authentication Portal
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate, Link } from 'react-router-dom';
import { UserRole } from '../types';
import { 
  Box, ShieldCheck, Lock, Mail, ArrowRight, Sparkles, 
  CheckCircle2, Users, Building, AlertCircle 
} from 'lucide-react';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@villageverse.gov.in');
  const [password, setPassword] = useState('password123');
  const [selectedRole, setSelectedRole] = useState<UserRole>('Admin');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const demoRoles: Array<{ role: UserRole; email: string; label: string; icon: string }> = [
    { role: 'Super Admin', email: 'superadmin@villageverse.gov.in', label: 'Super Administrator', icon: '👑' },
    { role: 'Panchayat Officer', email: 'panchayat@villageverse.gov.in', label: 'PDO / Secretary', icon: '🏛️' },
    { role: 'Engineer', email: 'engineer@villageverse.gov.in', label: 'Panchayat Engineer', icon: '📐' },
    { role: 'Agriculture Officer', email: 'agriculture@villageverse.gov.in', label: 'Agriculture Officer', icon: '🌾' },
    { role: 'Healthcare Officer', email: 'healthcare@villageverse.gov.in', label: 'PHC Medical Officer', icon: '🩺' },
    { role: 'Citizen', email: 'citizen@villageverse.gov.in', label: 'Village Citizen', icon: '👤' }
  ];

  const handleQuickRoleSelect = (r: typeof demoRoles[0]) => {
    setErrorMessage(null);
    setSelectedRole(r.role);
    setEmail(r.email);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);
    const result = await login(email.trim().toLowerCase(), password, selectedRole);
    setLoading(false);

    if (!result.success) {
      setErrorMessage(result.error || 'Authentication failed. Please check your email and password.');
      return;
    }

    navigate(result.redirectPath || '/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      {/* Background glowing orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Government Tricolor Top Ribbon */}
      <div className="fixed top-0 left-0 right-0 gov-ribbon z-50" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-sky-500 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20 pulse-glow">
            <Box className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center justify-center gap-1.5">
            VillageVerse <span className="text-emerald-400">AI</span>
          </h1>
          <div className="flex items-center justify-center gap-2 mt-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Supabase Auth & PostgreSQL Live
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Digital Twin for Intelligent Village Development • Shivalli Gram Panchayat
          </p>
        </div>

        {/* Quick One-Click Demo Role Grid (Hackathon Evaluator Showcase) */}
        <div className="glass-card p-4 rounded-3xl border border-emerald-500/30 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> 1-Click Role Login (Demo Showcase)
            </span>
            <span className="text-[10px] text-slate-400">Select any role to test</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {demoRoles.map((r) => (
              <button
                key={r.role}
                type="button"
                onClick={() => handleQuickRoleSelect(r)}
                className={`p-2.5 rounded-xl border text-left transition flex items-center space-x-2 ${
                  selectedRole === r.role
                    ? 'bg-emerald-950/80 border-emerald-500 text-white shadow-sm'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span className="text-base shrink-0">{r.icon}</span>
                <div className="truncate">
                  <div className="font-semibold text-white truncate leading-tight">{r.role}</div>
                  <div className="text-[10px] text-slate-400 truncate">{r.label}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Sign-In Form */}
        <form onSubmit={handleLoginSubmit} className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-2xl bg-rose-950/60 border border-rose-500/50 text-rose-200 text-xs flex items-start space-x-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{errorMessage}</div>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">Department Official Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="officer@villageverse.gov.in"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-300">Password</label>
              <Link to="/forgot-password" className="text-[11px] text-emerald-400 hover:underline">
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 hover:from-emerald-500 hover:to-sky-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition flex items-center justify-center space-x-2"
          >
            <span>{loading ? 'Authenticating...' : `Enter Digital Twin as ${selectedRole}`}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="text-center pt-2 text-xs text-slate-400">
            Citizen or Farmer?{' '}
            <Link to="/signup" className="text-emerald-400 font-semibold hover:underline">
              Create Citizen Account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
