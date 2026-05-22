import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { blogClient } from '@/api/blogClient'
import { checkBlogMockSupport } from '@/config/mock'
import { getOwnerGithubId, getOwnerGithubLogin } from '@/config/env'
import { getSupabase } from '@/lib/supabase'
import type { AuthUser } from '@/types/blog'

function mapSupabaseUser(raw: {
  id: string
  user_metadata?: Record<string, unknown>
}): AuthUser {
  const meta = raw.user_metadata ?? {}
  const githubId = String(meta.provider_id ?? meta.sub ?? '')
  const login = String(meta.user_name ?? meta.preferred_username ?? '')
  const name = String(meta.full_name ?? meta.name ?? login)
  const avatarUrl = String(meta.avatar_url ?? '')
  return {
    id: raw.id,
    githubId,
    login,
    name,
    avatarUrl,
  }
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(null)
  const loading = ref(true)
  const initialized = ref(false)

  const isLoggedIn = computed(() => user.value !== null)

  const isOwner = computed(() => {
    if (!user.value) return false
    const ownerId = getOwnerGithubId()
    if (ownerId && user.value.githubId === ownerId) return true
    return user.value.login === getOwnerGithubLogin()
  })

  async function init() {
    if (initialized.value) return

    if (checkBlogMockSupport()) {
      user.value = await blogClient.getSession()
      initialized.value = true
      loading.value = false
      return
    }

    const supabase = getSupabase()
    if (!supabase) {
      initialized.value = true
      loading.value = false
      return
    }
    const { data } = await supabase.auth.getSession()
    user.value = data.session?.user ? mapSupabaseUser(data.session.user) : null
    supabase.auth.onAuthStateChange((_event, session) => {
      user.value = session?.user ? mapSupabaseUser(session.user) : null
    })
    initialized.value = true
    loading.value = false
  }

  async function signInWithGitHub() {
    if (checkBlogMockSupport()) {
      await blogClient.signInWithGitHub()
      return
    }
    await blogClient.signInWithGitHub()
  }

  async function signOut() {
    if (checkBlogMockSupport()) {
      await blogClient.signOut()
      user.value = null
      return
    }
    await blogClient.signOut()
    user.value = null
  }

  return {
    user,
    loading,
    isLoggedIn,
    isOwner,
    init,
    signInWithGitHub,
    signOut,
  }
})
