import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 
  import.meta.env.VITE_SUPABASE_URL || 
  "https://dcvwfmvfbygxmmwjuxrk.supabase.co";

const supabaseAnonKey = 
  import.meta.env.VITE_SUPABASE_ANON_KEY || 
  "sb_publishable_AgA9cN-dYC_Ae4Tpihn2Fw_0W9t_HnX";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
