import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

// ⚠️ REPLACE THESE WITH YOUR ACTUAL SUPABASE CREDENTIALS
// Get them from: https://app.supabase.com/project/_/settings/api
const SUPABASE_URL = 'https://your-project-id.supabase.co'; 
const SUPABASE_ANON_KEY = 'your-anon-key-here';

if (SUPABASE_URL === 'https://your-project-id.supabase.co') {
  console.warn('⚠️ Supabase credentials not set yet. App will run in offline mode.');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
