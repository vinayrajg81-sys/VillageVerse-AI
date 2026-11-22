// VillageVerse AI: Citizen & Officer Registration Portal
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { UserRole } from '../types';
import { Box, User, Mail, Phone, Lock, ArrowRight, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';

export const Signup: React.FC = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('Citizen');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    const result = await signup({
      full_name: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      role
    }, password);
    setLoading(false);

    if (!result.success) {
      setErrorMessage(result.error || 'Failed to create account. Please try again.');
      return;
    }

    if (result.requiresVerification) {
      setSuccessMessage(
        result.message || 'Account registered in Supabase! Please check your email to verify your account.'
      );
    } else {
      navigate(result.redirectPath || '/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 relative font-sans">
      <div className="fixed top-0 left-0 right-0 gov-ribbon z-50" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
            <Box className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">Create Citizen Account</h1>
          <p className="text-xs text-slate-400">
            Shivalli Gram Panchayat • Digital Swaraj Unified Access
          </p>
        </div>

        <form onSubmit={handleSignup} className="glass-card p-6 rounded-3xl border border-slate-800 space-y-3 text-xs">
          {errorMessage && (
            <div className="p-3 rounded-2xl bg-rose-950/60 border border-rose-500/50 text-rose-200 text-xs flex items-start space-x-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{errorMessage}</div>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-2xl bg-emerald-950/70 border border-emerald-500/60 text-emerald-200 text-xs space-y-2 animate-in fade-in">
              <div className="flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="leading-relaxed font-medium">{successMessage}</div>
              </div>
              <Link
                to="/login"
                className="inline-flex items-center space-x-1 text-emerald-300 hover:text-white font-bold underline text-[11px] pt-1"
              >
                <span>Proceed to Sign In &rarr;</span>
              </Link>
            </div>
          )}

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Full Legal Name</label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Basavaraju Gowda"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="resident@villageverse.gov.in"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Mobile Number (Aadhaar / OTP)</label>
            <div className="relative">
              <Phone className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="9845012399"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Citizen / Department Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="Citizen">Citizen / Farmer / Resident</option>
              <option value="Panchayat Officer">Panchayat Officer (PDO)</option>
              <option value="Engineer">Panchayat Engineer</option>
              <option value="Agriculture Officer">Agriculture Officer</option>
              <option value="Healthcare Officer">Healthcare Officer (PHC)</option>
            </select>
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition flex items-center justify-center space-x-2 mt-4"
          >
            <span>{loading ? 'Creating Account...' : 'Register Citizen Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="text-center pt-2 text-xs text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-emerald-400 font-semibold hover:underline">
              Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
