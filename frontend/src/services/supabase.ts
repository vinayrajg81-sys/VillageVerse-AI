// VillageVerse AI: Production Supabase Client & Realtime Layer
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 
  (import.meta as any).env?.VITE_SUPABASE_URL || 'https://phfrwlxssexgltvpvgap.supabase.co';

const SUPABASE_ANON_KEY = 
  (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'sb_publishable_OTIckJm1NRz5ies-KJ8u4w_FwValOcp';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: window.localStorage
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// ==========================================
// SUPABASE AUTHENTICATION HELPERS
// ==========================================
export const supabaseAuth = {
  // 1. Sign In with Email & Password
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    return data;
  },

  // 2. Sign Up with Email, Password & Metadata (Role, Full Name, Phone)
  signUp: async (email: string, password: string, metadata: {
    full_name: string;
    role?: string;
    phone?: string;
    department?: string;
  }) => {
    const redirectUrl = typeof window !== 'undefined' ? `${window.location.origin}/login` : undefined;
    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        data: {
          full_name: metadata.full_name,
          role: metadata.role || 'Citizen',
          phone: metadata.phone || '',
          department: metadata.department || 'General Resident'
        },
        emailRedirectTo: redirectUrl
      }
    });
    if (error) throw error;
    return data;
  },

  // 2b. Resend Verification Confirmation Email
  resendConfirmation: async (email: string) => {
    const redirectUrl = typeof window !== 'undefined' ? `${window.location.origin}/login` : undefined;
    const { data, error } = await supabase.auth.resend({
      type: 'signup',
      email: email.trim().toLowerCase(),
      options: {
        emailRedirectTo: redirectUrl
      }
    });
    if (error) throw error;
    return data;
  },

  // 3. Sign Out
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // 4. Send Password Reset Email
  resetPassword: async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`
    });
    if (error) throw error;
    return data;
  },

  // 5. Get Active Session & User
  getSession: async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) return null;
    return data.session;
  },

  getUser: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error) return null;
    return data.user;
  },

  // 6. Fetch User Profile from public.profiles table (checks both user_id and id)
  getProfile: async (userId: string) => {
    try {
      // 1. Try querying by user_id
      const { data: byUserId, error: err1 } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (!err1 && byUserId) {
        return byUserId;
      }

      // 2. Fallback query by id
      const { data: byId, error: err2 } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (!err2 && byId) {
        return byId;
      }

      return null;
    } catch {
      return null;
    }
  },

  // 7. Ensure / Sync User Profile Record in public.profiles Table
  syncProfile: async (userId: string, data: {
    email: string;
    full_name: string;
    role?: string;
    department?: string;
    phone?: string;
  }) => {
    try {
      const now = new Date().toISOString();
      // Base payload with user_id, full_name, email, role, department, timestamps
      const payload: any = {
        id: userId,
        user_id: userId,
        email: data.email,
        full_name: data.full_name,
        role: data.role || 'Citizen',
        department: data.department || 'General',
        phone: data.phone || '9845012399',
        created_at: now,
        updated_at: now
      };

      // 1. Check if profile already exists to prevent duplicate creation
      const existing = await supabaseAuth.getProfile(userId);
      if (existing) {
        return existing;
      }

      // 2. Upsert profile record cleanly
      const { data: upserted, error: upsertErr } = await supabase
        .from('profiles')
        .upsert(payload, { onConflict: 'id' })
        .select()
        .maybeSingle();

      if (!upsertErr && upserted) {
        return upserted;
      }

      // If schema doesn't have user_id column, retry without user_id
      if (upsertErr && upsertErr.message?.includes('user_id')) {
        delete payload.user_id;
        const { data: insertedFallback } = await supabase
          .from('profiles')
          .upsert(payload, { onConflict: 'id' })
          .select()
          .maybeSingle();
        return insertedFallback;
      }

      return null;
    } catch (err) {
      console.warn('[Supabase Profile Sync] Notice:', err);
      return null;
    }
  }
};

// ==========================================
// REALTIME SUBSCRIPTIONS
// ==========================================
export const subscribeToTable = (
  table: string,
  event: 'INSERT' | 'UPDATE' | 'DELETE' | '*',
  callback: (payload: any) => void
) => {
  return supabase
    .channel(`public:${table}`)
    .on(
      'postgres_changes' as any,
      { event, schema: 'public', table },
      (payload: any) => callback(payload)
    )
    .subscribe();
};
