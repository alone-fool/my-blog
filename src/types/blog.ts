export type PostStatus = 'draft' | 'published'

export interface Profile {
  id: string
  displayName: string
  title: string
  bio: string
  avatarUrl: string
  skills: string[]
  experiences: Experience[]
  socialLinks: SocialLink[]
  updatedAt: string
}

export interface Experience {
  company: string
  role: string
  period: string
  description: string
}

export interface SocialLink {
  label: string
  url: string
}

export interface Post {
  id: string
  slug: string
  title: string
  summary: string
  content: string
  coverUrl: string
  status: PostStatus
  publishedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface PostStats {
  postId: string
  likesCount: number
  commentsCount: number
  favoritesCount: number
}

export interface PostListItem extends Post {
  stats: PostStats
}

export interface Comment {
  id: string
  postId: string
  userId: string
  userName: string
  avatarUrl: string
  content: string
  createdAt: string
}

export interface PaginatedResult<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

export interface AuthUser {
  id: string
  githubId: string
  login: string
  name: string
  avatarUrl: string
}

export interface UserInteraction {
  liked: boolean
  favorited: boolean
}
