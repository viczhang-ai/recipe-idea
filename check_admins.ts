import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';

// Read .env manually since we are in a node script
const envContent = readFileSync('.env', 'utf-8');
const env = Object.fromEntries(
  envContent.split('\n').filter(l => l.includes('=')).map(l => l.split('='))
);

const supabaseUrl = (env.VITE_SUPABASE_URL || '').trim();
const supabaseKey = (env.VITE_SUPABASE_ANON_KEY || '').trim();

if (!supabaseUrl || !supabaseKey) {
  console.log('Missing Supabase environment variables.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAdmins() {
  console.log('Checking profiles with is_admin = true...');
  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, is_admin')
    .eq('is_admin', true);

  if (error) {
    console.error('Error fetching admins:', error.message);
  } else {
    console.log('Admins found:', data);
    if (data.length === 0) {
      console.log('--- WARNING: No admins found in the database! ---');
    }
  }
}

checkAdmins();
