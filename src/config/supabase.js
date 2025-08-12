import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'your-anon-key'

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Environment configuration
export const config = {
  supabase: {
    url: supabaseUrl,
    anonKey: supabaseAnonKey
  },
  api: {
    baseUrl: process.env.REACT_APP_API_BASE_URL || 'https://your-project.supabase.co/rest/v1',
    headers: {
      'Content-Type': 'application/json',
      'apikey': supabaseAnonKey,
      'Authorization': `Bearer ${supabaseAnonKey}`
    }
  }
}

export default supabase 