export function getSiteUrl(): string {
  return import.meta.env.VITE_SITE_URL ?? 'http://localhost:5173/my-blog/'
}

export function getSupabaseUrl(): string {
  return import.meta.env.VITE_SUPABASE_URL ?? ''
}

export function getSupabaseAnonKey(): string {
  return import.meta.env.VITE_SUPABASE_ANON_KEY ?? ''
}

export function getOwnerGithubId(): string {
  return import.meta.env.VITE_OWNER_GITHUB_ID ?? ''
}

export function getOwnerGithubLogin(): string {
  return import.meta.env.VITE_OWNER_GITHUB_LOGIN ?? 'alone-fool'
}

export function checkSupabaseConfigured(): boolean {
  return Boolean(getSupabaseUrl() && getSupabaseAnonKey())
}
