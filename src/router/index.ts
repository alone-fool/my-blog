import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: () => import('@/views/HomeView.vue') },
    { path: '/resume', name: 'resume', component: () => import('@/views/ResumeView.vue') },
    { path: '/blog', name: 'blog', component: () => import('@/views/BlogListView.vue') },
    { path: '/blog/:slug', name: 'post', component: () => import('@/views/PostDetailView.vue') },
    { path: '/login', name: 'login', component: () => import('@/views/LoginView.vue') },
    {
      path: '/admin',
      component: () => import('@/views/admin/AdminLayout.vue'),
      meta: { requiresOwner: true },
      children: [
        { path: '', redirect: '/admin/posts' },
        { path: 'posts', name: 'admin-posts', component: () => import('@/views/admin/AdminPostsView.vue') },
        {
          path: 'posts/new',
          name: 'admin-post-new',
          component: () => import('@/views/admin/AdminPostEditView.vue'),
        },
        {
          path: 'posts/:id/edit',
          name: 'admin-post-edit',
          component: () => import('@/views/admin/AdminPostEditView.vue'),
        },
        {
          path: 'profile',
          name: 'admin-profile',
          component: () => import('@/views/admin/AdminProfileView.vue'),
        },
      ],
    },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('@/views/NotFoundView.vue') },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()
  if (auth.loading) {
    await auth.init()
  }

  if (to.meta.requiresOwner) {
    if (!auth.isLoggedIn) {
      return { name: 'login', query: { redirect: to.fullPath } }
    }
    if (!auth.isOwner) {
      return { name: 'home' }
    }
  }
  return true
})

export default router
