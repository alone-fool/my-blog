/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_OWNER_GITHUB_ID: string
  readonly VITE_OWNER_GITHUB_LOGIN: string
  readonly VITE_SITE_URL: string
  readonly VITE_USE_MOCK_BLOG: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
