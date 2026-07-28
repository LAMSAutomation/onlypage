import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log("Supabase URL:", supabaseUrl);
console.log("Service Key length:", serviceKey ? serviceKey.length : 0);

if (!supabaseUrl || !serviceKey) {
  console.error("Missing credentials!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function run() {
  const email = `admin-test-${Date.now()}@gmail.com`;
  const password = `password123`;
  console.log(`Attempting to create confirmed user ${email} using admin.createUser...`);
  
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: 'Admin Confirmed Test User' }
  });

  if (error) {
    console.error("Admin user creation failed:", error);
  } else {
    console.log("Admin user creation succeeded:", data);
  }
}

run();
