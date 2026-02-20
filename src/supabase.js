import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'SEU_SUPABASE_URL'
const supabaseAnonKey = 'SUA_SUPABASE_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
