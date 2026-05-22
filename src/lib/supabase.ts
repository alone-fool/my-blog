import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { checkSupabaseConfigured, getSupabaseAnonKey, getSupabaseUrl } from '@/config/env'

let client: SupabaseClient | null = null

export function getSupabase(): SupabaseClient | null {
  if (!checkSupabaseConfigured()) {
    return null
  }
  if (!client) {
    client = createClient(getSupabaseUrl(), getSupabaseAnonKey())
  }
  return client
}
