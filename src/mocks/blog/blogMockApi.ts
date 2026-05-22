import type {
  AuthUser,
  Comment,
  PaginatedResult,
  Post,
  PostListItem,
  Profile,
  UserInteraction,
} from '@/types/blog'
import {
  addMockComment,
  countMockFavorites,
  countMockLikes,
  deleteMockPost,
  getMockComments,
  getMockInteraction,
  getMockPostById,
  getMockPostBySlug,
  getMockPosts,
  getMockProfile,
  toggleMockFavorite,
  toggleMockLike,
  updateMockProfile,
  upsertMockPost,
} from './store'

const MOCK_USER: AuthUser = {
  id: 'mock-owner',
  githubId: '0',
  login: 'alone-fool',
  name: 'Mock Owner',
  avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=owner',
}

function paginate<T>(list: T[], page: number, pageSize: number): PaginatedResult<T> {
  const start = (page - 1) * pageSize
  const slice = list.slice(start, start + pageSize)
  return { list: slice, total: list.length, page, pageSize }
}

function withStats(posts: Post[], userId?: string): PostListItem[] {
  return posts.map((p) => {
    const interaction = userId ? getMockInteraction(p.id, userId) : { liked: false, favorited: false }
    void interaction
    return {
      ...p,
      stats: {
        postId: p.id,
        likesCount: countMockLikes(p.id),
        commentsCount: getMockComments(p.id).length,
        favoritesCount: countMockFavorites(p.id),
      },
    }
  })
}

export const blogMockApi = {
  async getSession(): Promise<AuthUser | null> {
    const flag = localStorage.getItem('mock-logged-in')
    return flag === 'true' ? MOCK_USER : null
  },

  async signInWithGitHub(): Promise<void> {
    localStorage.setItem('mock-logged-in', 'true')
    window.location.reload()
  },

  async signOut(): Promise<void> {
    localStorage.removeItem('mock-logged-in')
    window.location.reload()
  },

  async getProfile(): Promise<Profile> {
    return getMockProfile()
  },

  async updateProfile(profile: Profile): Promise<Profile> {
    updateMockProfile(profile)
    return getMockProfile()
  },

  async listPosts(
    page: number,
    pageSize: number,
    options?: { includeDraft?: boolean; userId?: string },
  ): Promise<PaginatedResult<PostListItem>> {
    const posts = getMockPosts(Boolean(options?.includeDraft))
    const withS = withStats(posts, options?.userId)
    return paginate(withS, page, pageSize)
  },

  async getPostBySlug(slug: string, includeDraft = false): Promise<PostListItem | null> {
    const post = getMockPostBySlug(slug, includeDraft)
    if (!post) return null
    const [item] = withStats([post])
    return item ?? null
  },

  async getPostById(id: string): Promise<Post | null> {
    return getMockPostById(id)
  },

  async createPost(payload: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>): Promise<Post> {
    const now = new Date().toISOString()
    const post: Post = {
      ...payload,
      id: `post-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    }
    upsertMockPost(post)
    return post
  },

  async updatePost(id: string, payload: Partial<Post>): Promise<Post> {
    const existing = getMockPostById(id)
    if (!existing) throw new Error('文章不存在')
    const post: Post = { ...existing, ...payload, updatedAt: new Date().toISOString() }
    upsertMockPost(post)
    return post
  },

  async deletePost(id: string): Promise<void> {
    deleteMockPost(id)
  },

  async listComments(postId: string): Promise<Comment[]> {
    return getMockComments(postId)
  },

  async addComment(postId: string, user: AuthUser, content: string): Promise<Comment> {
    const comment: Comment = {
      id: `c-${Date.now()}`,
      postId,
      userId: user.id,
      userName: user.login,
      avatarUrl: user.avatarUrl,
      content,
      createdAt: new Date().toISOString(),
    }
    addMockComment(comment)
    return comment
  },

  async getUserInteraction(postId: string, userId: string): Promise<UserInteraction> {
    return getMockInteraction(postId, userId)
  },

  async toggleLike(postId: string, userId: string): Promise<UserInteraction> {
    return toggleMockLike(postId, userId)
  },

  async toggleFavorite(postId: string, userId: string): Promise<UserInteraction> {
    return toggleMockFavorite(postId, userId)
  },
}
