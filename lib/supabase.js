import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_API_URL
const supabaseApiKey = process.env.EXPO_PUBLIC_SUPABASE_API_KEY

export const supabase = createClient(supabaseUrl, supabaseApiKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})