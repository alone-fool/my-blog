import type { Comment, Post, PostListItem, Profile } from '@/types/blog'

export const SEED_PROFILE: Profile = {
  id: 'owner',
  displayName: '博主',
  title: '全栈工程师',
  bio: '热爱 Vue 与开源，记录技术与生活。',
  avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=blog',
  skills: ['Vue 3', 'TypeScript', 'Supabase', 'Tailwind CSS'],
  experiences: [
    {
      company: '示例科技',
      role: '高级前端工程师',
      period: '2022 - 至今',
      description: '负责博客与数据平台前端架构。',
    },
    {
      company: '创新实验室',
      role: 'Web 开发',
      period: '2019 - 2022',
      description: '参与多个 ToB 产品从 0 到 1 交付。',
    },
  ],
  socialLinks: [
    { label: 'GitHub', url: 'https://github.com/alone-fool' },
    { label: 'Email', url: 'mailto:hello@example.com' },
  ],
  updatedAt: new Date().toISOString(),
}

export const SEED_POSTS: Post[] = [
  {
    id: 'post-1',
    slug: 'hello-blog',
    title: '你好，我的博客',
    summary: '第一篇示例文章，介绍博客功能。',
    content: `## 欢迎\n\n这是一篇 **Markdown** 示例文章。\n\n- 主题切换\n- 评论互动\n- GitHub Pages 部署`,
    coverUrl: '',
    status: 'published',
    publishedAt: '2026-05-01T08:00:00.000Z',
    createdAt: '2026-05-01T08:00:00.000Z',
    updatedAt: '2026-05-01T08:00:00.000Z',
  },
  {
    id: 'post-2',
    slug: 'vue-supabase-stack',
    title: 'Vue + Supabase 技术栈笔记',
    summary: '静态前端 + BaaS 的架构取舍。',
    content: `## 架构\n\nGitHub Pages 托管静态资源，Supabase 负责认证与数据持久化。`,
    coverUrl: '',
    status: 'published',
    publishedAt: '2026-05-10T10:00:00.000Z',
    createdAt: '2026-05-10T10:00:00.000Z',
    updatedAt: '2026-05-10T10:00:00.000Z',
  },
  {
    id: 'post-3',
    slug: 'draft-demo',
    title: '草稿示例（仅管理员可见）',
    summary: '管理后台可见的草稿。',
    content: '草稿内容',
    coverUrl: '',
    status: 'draft',
    publishedAt: null,
    createdAt: '2026-05-15T12:00:00.000Z',
    updatedAt: '2026-05-15T12:00:00.000Z',
  },
]

export const SEED_COMMENTS: Comment[] = [
  {
    id: 'c-1',
    postId: 'post-1',
    userId: 'mock-user-1',
    userName: 'visitor',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=v1',
    content: '写得不错！',
    createdAt: '2026-05-02T09:00:00.000Z',
  },
]

export function toListItems(posts: Post[]): PostListItem[] {
  return posts.map((p) => ({
    ...p,
    stats: {
      postId: p.id,
      likesCount: p.id === 'post-1' ? 3 : 1,
      commentsCount: p.id === 'post-1' ? 1 : 0,
      favoritesCount: p.id === 'post-1' ? 2 : 0,
    },
  }))
}
