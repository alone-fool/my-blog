import { getOAuthRedirectUrl } from '@/config/auth'
import { getSupabase } from '@/lib/supabase'
import type {
  AuthUser,
  Comment,
  Experience,
  PaginatedResult,
  Post,
  PostListItem,
  PostStatus,
  Profile,
  SocialLink,
  UserInteraction,
} from '@/types/blog'

interface DbProfile {
  id: string
  display_name: string
  title: string
  bio: string
  avatar_url: string
  skills: string[]
  experiences: Experience[]
  social_links: SocialLink[]
  updated_at: string
}

interface DbPost {
  id: string
  slug: string
  title: string
  summary: string
  content: string
  cover_url: string
  status: PostStatus
  published_at: string | null
  created_at: string
  updated_at: string
}

interface DbComment {
  id: string
  post_id: string
  user_id: string
  user_name: string
  avatar_url: string
  content: string
  created_at: string
}

interface DbStats {
  post_id: string
  likes_count: number
  comments_count: number
  favorites_count: number
}

function mapProfile(row: DbProfile): Profile {
  return {
    id: row.id,
    displayName: row.display_name,
    title: row.title,
    bio: row.bio,
    avatarUrl: row.avatar_url,
    skills: row.skills ?? [],
    experiences: row.experiences ?? [],
    socialLinks: row.social_links ?? [],
    updatedAt: row.updated_at,
  }
}

function mapPost(row: DbPost): Post {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    content: row.content,
    coverUrl: row.cover_url,
    status: row.status,
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function mapComment(row: DbComment): Comment {
  return {
    id: row.id,
    postId: row.post_id,
    userId: row.user_id,
    userName: row.user_name,
    avatarUrl: row.avatar_url,
    content: row.content,
    createdAt: row.created_at,
  }
}

function mapUser(raw: { id: string; user_metadata?: Record<string, unknown> }): AuthUser {
  const meta = raw.user_metadata ?? {}
  return {
    id: raw.id,
    githubId: String(meta.provider_id ?? meta.sub ?? ''),
    login: String(meta.user_name ?? meta.preferred_username ?? ''),
    name: String(meta.full_name ?? meta.name ?? ''),
    avatarUrl: String(meta.avatar_url ?? ''),
  }
}

async function attachStats(posts: Post[], userId?: string): Promise<PostListItem[]> {
  const supabase = getSupabase()
  if (!supabase || posts.length === 0) return []

  const ids = posts.map((p) => p.id)
  const { data: statsRows } = await supabase
    .from('post_stats')
    .select('post_id, likes_count, comments_count, favorites_count')
    .in('post_id', ids)

  const statsMap = new Map<string, DbStats>()
  ;(statsRows as DbStats[] | null)?.forEach((s) => statsMap.set(s.post_id, s))

  const items: PostListItem[] = posts.map((p) => {
    const s = statsMap.get(p.id)
    return {
      ...p,
      stats: {
        postId: p.id,
        likesCount: s?.likes_count ?? 0,
        commentsCount: s?.comments_count ?? 0,
        favoritesCount: s?.favorites_count ?? 0,
      },
    }
  })

  if (userId) {
    await Promise.all(
      items.map(async (item) => {
        const interaction = await blogApi.getUserInteraction(item.id, userId)
        void interaction
      }),
    )
  }

  return items
}

export const blogApi = {
  async getSession(): Promise<AuthUser | null> {
    const supabase = getSupabase()
    if (!supabase) return null
    const { data } = await supabase.auth.getSession()
    return data.session?.user ? mapUser(data.session.user) : null
  },

  async signInWithGitHub(): Promise<void> {
    const supabase = getSupabase()
    if (!supabase) return
    const redirectTo = getOAuthRedirectUrl()
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo },
    })
    if (error) return
    if (data.url) {
      window.location.assign(data.url)
    }
  },

  async signOut(): Promise<void> {
    const supabase = getSupabase()
    if (!supabase) return
    await supabase.auth.signOut()
  },

  async getProfile(): Promise<Profile> {
    const supabase = getSupabase()
    if (!supabase) throw new Error('Supabase 未配置')
    const { data, error } = await supabase.from('profiles').select('*').eq('id', 'owner').single()
    if (error) throw error
    return mapProfile(data as DbProfile)
  },

  async updateProfile(profile: Profile): Promise<Profile> {
    const supabase = getSupabase()
    if (!supabase) throw new Error('Supabase 未配置')
    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: 'owner',
        display_name: profile.displayName,
        title: profile.title,
        bio: profile.bio,
        avatar_url: profile.avatarUrl,
        skills: profile.skills,
        experiences: profile.experiences,
        social_links: profile.socialLinks,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()
    if (error) throw error
    return mapProfile(data as DbProfile)
  },

  async listPosts(
    page: number,
    pageSize: number,
    options?: { includeDraft?: boolean },
  ): Promise<PaginatedResult<PostListItem>> {
    const supabase = getSupabase()
    if (!supabase) throw new Error('Supabase 未配置')

    let query = supabase
      .from('posts')
      .select('*', { count: 'exact' })
      .order('published_at', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false })

    if (!options?.includeDraft) {
      query = query.eq('status', 'published')
    }

    const from = (page - 1) * pageSize
    const to = from + pageSize - 1
    const { data, error, count } = await query.range(from, to)
    if (error) throw error

    const posts = (data as DbPost[]).map(mapPost)
    const list = await attachStats(posts)
    return { list, total: count ?? 0, page, pageSize }
  },

  async getPostBySlug(slug: string, includeDraft = false): Promise<PostListItem | null> {
    const supabase = getSupabase()
    if (!supabase) throw new Error('Supabase 未配置')

    let query = supabase.from('posts').select('*').eq('slug', slug)
    if (!includeDraft) query = query.eq('status', 'published')

    const { data, error } = await query.maybeSingle()
    if (error) throw error
    if (!data) return null

    const [item] = await attachStats([mapPost(data as DbPost)])
    return item ?? null
  },

  async getPostById(id: string): Promise<Post | null> {
    const supabase = getSupabase()
    if (!supabase) throw new Error('Supabase 未配置')
    const { data, error } = await supabase.from('posts').select('*').eq('id', id).maybeSingle()
    if (error) throw error
    return data ? mapPost(data as DbPost) : null
  },

  async createPost(payload: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>): Promise<Post> {
    const supabase = getSupabase()
    if (!supabase) throw new Error('Supabase 未配置')
    const { data, error } = await supabase
      .from('posts')
      .insert({
        slug: payload.slug,
        title: payload.title,
        summary: payload.summary,
        content: payload.content,
        cover_url: payload.coverUrl,
        status: payload.status,
        published_at: payload.publishedAt,
      })
      .select()
      .single()
    if (error) throw error
    return mapPost(data as DbPost)
  },

  async updatePost(id: string, payload: Partial<Post>): Promise<Post> {
    const supabase = getSupabase()
    if (!supabase) throw new Error('Supabase 未配置')
    const body: Record<string, unknown> = { updated_at: new Date().toISOString() }
    if (payload.slug !== undefined) body.slug = payload.slug
    if (payload.title !== undefined) body.title = payload.title
    if (payload.summary !== undefined) body.summary = payload.summary
    if (payload.content !== undefined) body.content = payload.content
    if (payload.coverUrl !== undefined) body.cover_url = payload.coverUrl
    if (payload.status !== undefined) body.status = payload.status
    if (payload.publishedAt !== undefined) body.published_at = payload.publishedAt

    const { data, error } = await supabase.from('posts').update(body).eq('id', id).select().single()
    if (error) throw error
    return mapPost(data as DbPost)
  },

  async deletePost(id: string): Promise<void> {
    const supabase = getSupabase()
    if (!supabase) throw new Error('Supabase 未配置')
    const { error } = await supabase.from('posts').delete().eq('id', id)
    if (error) throw error
  },

  async listComments(postId: string): Promise<Comment[]> {
    const supabase = getSupabase()
    if (!supabase) throw new Error('Supabase 未配置')
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return (data as DbComment[]).map(mapComment)
  },

  async addComment(postId: string, user: AuthUser, content: string): Promise<Comment> {
    const supabase = getSupabase()
    if (!supabase) throw new Error('Supabase 未配置')
    const { data, error } = await supabase
      .from('comments')
      .insert({
        post_id: postId,
        user_id: user.id,
        user_name: user.login,
        avatar_url: user.avatarUrl,
        content,
      })
      .select()
      .single()
    if (error) throw error
    return mapComment(data as DbComment)
  },

  async getUserInteraction(postId: string, userId: string): Promise<UserInteraction> {
    const supabase = getSupabase()
    if (!supabase) return { liked: false, favorited: false }

    const [likeRes, favRes] = await Promise.all([
      supabase.from('post_likes').select('post_id').eq('post_id', postId).eq('user_id', userId).maybeSingle(),
      supabase.from('post_favorites').select('post_id').eq('post_id', postId).eq('user_id', userId).maybeSingle(),
    ])

    return {
      liked: Boolean(likeRes.data),
      favorited: Boolean(favRes.data),
    }
  },

  async toggleLike(postId: string, userId: string): Promise<UserInteraction> {
    const supabase = getSupabase()
    if (!supabase) throw new Error('Supabase 未配置')
    const current = await blogApi.getUserInteraction(postId, userId)
    if (current.liked) {
      await supabase.from('post_likes').delete().eq('post_id', postId).eq('user_id', userId)
      return { liked: false, favorited: current.favorited }
    }
    await supabase.from('post_likes').insert({ post_id: postId, user_id: userId })
    return { liked: true, favorited: current.favorited }
  },

  async toggleFavorite(postId: string, userId: string): Promise<UserInteraction> {
    const supabase = getSupabase()
    if (!supabase) throw new Error('Supabase 未配置')
    const current = await blogApi.getUserInteraction(postId, userId)
    if (current.favorited) {
      await supabase.from('post_favorites').delete().eq('post_id', postId).eq('user_id', userId)
      return { liked: current.liked, favorited: false }
    }
    await supabase.from('post_favorites').insert({ post_id: postId, user_id: userId })
    return { liked: current.liked, favorited: true }
  },
}
