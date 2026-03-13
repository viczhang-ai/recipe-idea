import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ssmgyhshmovzgpvehuie.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_unsImRAaL_LGGt5xXczZhQ_8ODb4ilD';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
