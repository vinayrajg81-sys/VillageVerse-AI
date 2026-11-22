// VillageVerse AI: Citizen & Officer Registration Portal
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { UserRole } from '../types';
import { 
  Box, User, Mail, Phone, Lock, ArrowRight, ShieldCheck, 
  AlertCircle, CheckCircle2, RefreshCw, Sparkles, Clock, AlertTriangle 
} from 'lucide-react';

export const Signup: React.FC = () => {
  const { signup, resendVerification } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('Citizen');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [resending, setResending] = useState(false);
  const [resendStatus, setResendStatus] = useState<string | null>(null);

  // Synchronous ref to prevent duplicate/double-click submissions
  const isSubmittingRef = useRef(false);

  // Active countdown timer for rate limit cooldown
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent duplicate rapid-fire submissions
    if (isSubmittingRef.current || loading || cooldown > 0) {
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);
    setIsRateLimited(false);
    setIsDuplicate(false);
    setResendStatus(null);

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    isSubmittingRef.current = true;
    setLoading(true);

    try {
      const result = await signup({
        full_name: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        role
      }, password);

      if (!result.success) {
        if (result.isRateLimited) {
          setIsRateLimited(true);
          setCooldown(60); // 60-second cooldown on rate-limit
          setErrorMessage(result.error || 'Supabase email rate limit exceeded.');
        } else if (result.isDuplicate) {
          setIsDuplicate(true);
          setErrorMessage(result.error || 'An account with this email address already exists.');
        } else {
          setErrorMessage(result.error || 'Failed to create account. Please try again.');
        }
        return;
      }

      if (result.requiresVerification) {
        setSuccessMessage(
          result.message || 'Account registered in Supabase! Please check your email to verify your account.'
        );
        setCooldown(30); // 30-second cooldown before allowing resend
      } else {
        navigate(result.redirectPath || '/dashboard');
      }
    } finally {
      setLoading(false);
      isSubmittingRef.current = false;
    }
  };

  const handleResend = async () => {
    if (resending || cooldown > 0 || !email) return;
    setResending(true);
    setResendStatus(null);

    const res = await resendVerification(email);
    setResending(false);

    if (res.success) {
      setResendStatus('Verification email resent successfully! Check your inbox or spam.');
      setCooldown(60);
    } else {
      if (res.isRateLimited) {
        setIsRateLimited(true);
        setCooldown(60);
      }
      setResendStatus(res.error || 'Failed to resend verification email.');
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
          {/* Rate Limit Diagnostic & Guidance Banner (HTTP 429) */}
          {isRateLimited && (
            <div className="p-4 rounded-2xl bg-amber-950/70 border border-amber-500/60 text-amber-200 text-xs space-y-2.5 animate-in fade-in">
              <div className="flex items-start space-x-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-bold text-amber-300">Supabase Email Rate Limit (429: over_email_send_rate_limit)</div>
                  <div className="text-[11px] text-amber-200/90 leading-relaxed">
                    Supabase's default test mailer limits verification emails to 3–4 per hour on free projects.
                  </div>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-amber-900/40 border border-amber-700/50 space-y-1.5 text-[11px]">
                <div className="font-semibold text-white flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Recommended Instant Solutions:
                </div>
                <div className="text-slate-300 pl-1 space-y-1">
                  <div>
                    <strong className="text-emerald-400">Option 1:</strong> In your Supabase Dashboard &rarr; <strong>Authentication</strong> &rarr; <strong>Providers</strong> &rarr; <strong>Email</strong>, toggle <strong>"Confirm email" OFF</strong>. New accounts will then register instantly with zero email limits.
                  </div>
                  <div>
                    <strong className="text-cyan-400">Option 2:</strong> Use the 1-Click Demo Accounts on the Sign In page for immediate testing.
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-amber-300/80 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {cooldown > 0 ? `Retry available in ${cooldown}s` : 'You can retry registration now'}
                </span>
                <Link
                  to="/login"
                  className="text-[11px] font-bold text-emerald-300 hover:text-white underline"
                >
                  Go to Sign In &rarr;
                </Link>
              </div>
            </div>
          )}

          {/* Duplicate Account Alert */}
          {isDuplicate && (
            <div className="p-3.5 rounded-2xl bg-blue-950/70 border border-blue-500/50 text-blue-200 text-xs space-y-2 animate-in fade-in">
              <div className="flex items-start space-x-2.5">
                <AlertCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div className="leading-relaxed font-medium">
                  An account with <strong>{email}</strong> already exists in Supabase.
                </div>
              </div>
              <Link
                to="/login"
                className="inline-flex items-center space-x-1 text-cyan-300 hover:text-white font-bold underline text-[11px]"
              >
                <span>Proceed to Sign In with your password &rarr;</span>
              </Link>
            </div>
          )}

          {/* Standard Error Message */}
          {errorMessage && !isRateLimited && !isDuplicate && (
            <div className="p-3 rounded-2xl bg-rose-950/60 border border-rose-500/50 text-rose-200 text-xs flex items-start space-x-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{errorMessage}</div>
            </div>
          )}

          {/* Email Verification Required Banner */}
          {successMessage && (
            <div className="p-3.5 rounded-2xl bg-emerald-950/70 border border-emerald-500/60 text-emerald-200 text-xs space-y-2.5 animate-in fade-in">
              <div className="flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-bold text-emerald-300">Account Created in Supabase!</div>
                  <div className="leading-relaxed text-[11px] text-emerald-200/90">{successMessage}</div>
                </div>
              </div>

              {resendStatus && (
                <div className="text-[11px] text-emerald-300 bg-emerald-900/40 p-2 rounded-lg border border-emerald-700/50">
                  {resendStatus}
                </div>
              )}

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resending || cooldown > 0}
                  className="text-[11px] font-semibold text-emerald-300 hover:text-white flex items-center gap-1 disabled:opacity-50"
                >
                  <RefreshCw className={`w-3 h-3 ${resending ? 'animate-spin' : ''}`} />
                  <span>{cooldown > 0 ? `Resend email in ${cooldown}s` : 'Resend Verification Email'}</span>
                </button>
                <Link
                  to="/login"
                  className="inline-flex items-center space-x-1 text-emerald-300 hover:text-white font-bold underline text-[11px]"
                >
                  <span>Proceed to Sign In &rarr;</span>
                </Link>
              </div>
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
                disabled={loading}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-500 disabled:opacity-60"
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
                disabled={loading}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-500 disabled:opacity-60"
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
                disabled={loading}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-500 disabled:opacity-60"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Citizen / Department Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              disabled={loading}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-500 disabled:opacity-60"
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
                disabled={loading}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-500 disabled:opacity-60"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || cooldown > 0}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition flex items-center justify-center space-x-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>
              {loading 
                ? 'Creating Account...' 
                : cooldown > 0 
                  ? `Please wait ${cooldown}s` 
                  : 'Register Citizen Account'
              }
            </span>
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
