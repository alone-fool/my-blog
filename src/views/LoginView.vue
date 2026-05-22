<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { checkBlogMockSupport } from '@/config/mock'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

async function login() {
  await auth.signInWithGitHub()
  if (checkBlogMockSupport()) {
    await auth.init()
    const redirect = (route.query.redirect as string) || '/'
    router.push(redirect)
  }
}
</script>

<template>
  <div class="mx-auto flex max-w-md flex-col items-center px-4 py-16">
    <div class="glass-card w-full p-8 text-center">
      <h1 class="text-2xl font-bold">登录</h1>
      <p class="mt-3 text-sm text-[rgb(var(--color-text-muted))]">
        使用 GitHub 登录后可评论、点赞与收藏；博客主账号可进入管理后台。
      </p>
      <button type="button" class="btn-primary mt-6 w-full" @click="login">GitHub 登录</button>
      <p v-if="checkBlogMockSupport()" class="mt-3 text-xs text-[rgb(var(--color-text-muted))]">
        当前为 Mock 模式，登录将模拟 owner 账号。
      </p>
    </div>
  </div>
</template>
