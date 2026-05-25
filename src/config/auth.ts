import { getSiteUrl } from './env'

/** OAuth 完成后 Supabase 跳回的地址，必须与 Dashboard Redirect URLs 一致 */
export function getOAuthRedirectUrl(): string {
  const fromEnv = getSiteUrl().trim()
  if (fromEnv) {
    return fromEnv.endsWith('/') ? fromEnv : `${fromEnv}/`
  }
  const base = import.meta.env.BASE_URL || '/'
  const path = base.startsWith('/') ? base : `/${base}`
  const url = `${window.location.origin}${path}`
  return url.endsWith('/') ? url : `${url}/`
}
