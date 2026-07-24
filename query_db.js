import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load .env.local
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing env vars!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  console.log("Querying sites...");
  const { data: sites, error: sitesErr } = await supabase.from('sites').select('*').limit(5);
  if (sitesErr) {
    console.error("Sites error:", sitesErr);
  } else {
    console.log("Sites:", sites);
  }
}

run();
