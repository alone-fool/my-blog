import type { Comment, Post, Profile, UserInteraction } from '@/types/blog'
import { SEED_COMMENTS, SEED_POSTS, SEED_PROFILE } from './data'

const likes = new Set<string>()
const favorites = new Set<string>()
let posts = [...SEED_POSTS]
let comments = [...SEED_COMMENTS]
let profile = { ...SEED_PROFILE }

function interactionKey(postId: string, userId: string) {
  return `${postId}:${userId}`
}

export function resetBlogMockStore() {
  posts = [...SEED_POSTS]
  comments = [...SEED_COMMENTS]
  profile = { ...SEED_PROFILE }
  likes.clear()
  favorites.clear()
}

export function getMockProfile(): Profile {
  return { ...profile }
}

export function updateMockProfile(next: Profile) {
  profile = { ...next, updatedAt: new Date().toISOString() }
}

export function getMockPosts(includeDraft = false): Post[] {
  return posts
    .filter((p) => includeDraft || p.status === 'published')
    .sort((a, b) => {
      const ta = a.publishedAt ?? a.createdAt
      const tb = b.publishedAt ?? b.createdAt
      return tb.localeCompare(ta)
    })
}

export function getMockPostBySlug(slug: string, includeDraft = false): Post | null {
  const post = posts.find((p) => p.slug === slug)
  if (!post) return null
  if (!includeDraft && post.status !== 'published') return null
  return { ...post }
}

export function getMockPostById(id: string): Post | null {
  const post = posts.find((p) => p.id === id)
  return post ? { ...post } : null
}

export function upsertMockPost(post: Post) {
  const idx = posts.findIndex((p) => p.id === post.id)
  if (idx >= 0) {
    posts[idx] = post
  } else {
    posts.push(post)
  }
}

export function deleteMockPost(id: string) {
  posts = posts.filter((p) => p.id !== id)
  comments = comments.filter((c) => c.postId !== id)
}

export function getMockComments(postId: string): Comment[] {
  return comments
    .filter((c) => c.postId === postId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export function addMockComment(comment: Comment) {
  comments.unshift(comment)
}

export function countMockLikes(postId: string) {
  return [...likes].filter((k) => k.startsWith(`${postId}:`)).length
}

export function countMockFavorites(postId: string) {
  return [...favorites].filter((k) => k.startsWith(`${postId}:`)).length
}

export function getMockInteraction(postId: string, userId: string): UserInteraction {
  const key = interactionKey(postId, userId)
  return {
    liked: likes.has(key),
    favorited: favorites.has(key),
  }
}

export function toggleMockLike(postId: string, userId: string): UserInteraction {
  const key = interactionKey(postId, userId)
  if (likes.has(key)) likes.delete(key)
  else likes.add(key)
  return getMockInteraction(postId, userId)
}

export function toggleMockFavorite(postId: string, userId: string): UserInteraction {
  const key = interactionKey(postId, userId)
  if (favorites.has(key)) favorites.delete(key)
  else favorites.add(key)
  return getMockInteraction(postId, userId)
}
