<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import ThemePicker from './ThemePicker.vue'

const auth = useAuthStore()
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-[rgb(var(--color-accent)/0.3)] bg-[rgb(var(--color-surface)/0.9)] backdrop-blur-md">
    <div class="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
      <RouterLink to="/" class="text-lg font-bold text-[rgb(var(--color-primary))]">
        My Blog
      </RouterLink>
      <nav class="flex flex-wrap items-center gap-1 text-sm">
        <RouterLink to="/" class="btn-ghost">首页</RouterLink>
        <RouterLink to="/resume" class="btn-ghost">简历</RouterLink>
        <RouterLink to="/blog" class="btn-ghost">博客</RouterLink>
        <RouterLink v-if="auth.isOwner" to="/admin/posts" class="btn-ghost">管理</RouterLink>
        <ThemePicker />
        <button
          v-if="auth.isLoggedIn"
          type="button"
          class="btn-secondary text-sm"
          @click="auth.signOut()"
        >
          退出
        </button>
        <button v-else type="button" class="btn-primary text-sm" @click="auth.signInWithGitHub()">
          登录
        </button>
      </nav>
    </div>
  </header>
</template>
