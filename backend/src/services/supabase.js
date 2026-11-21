// VillageVerse AI: Backend Supabase Client
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://phfrwlxssexgltvpvgap.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'sb_publishable_OTIckJm1NRz5ies-KJ8u4w_FwValOcp';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false
  }
});

export const checkSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('village_profile').select('id').limit(1);
    if (error && error.code === 'PGRST205') {
      return { connected: true, tablesMigrated: false, message: 'Supabase connected. SQL migrations pending execution in dashboard.' };
    } else if (error) {
      return { connected: true, tablesMigrated: false, message: error.message };
    }
    return { connected: true, tablesMigrated: true, message: 'Supabase connected and tables active.' };
  } catch (err) {
    return { connected: false, tablesMigrated: false, message: err.message };
  }
};
