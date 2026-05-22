<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="mx-auto max-w-5xl px-4 py-8">
    <div class="mb-6 flex flex-wrap items-center gap-3">
      <h1 class="text-2xl font-bold">管理后台</h1>
      <RouterLink to="/admin/posts" class="btn-ghost text-sm">文章</RouterLink>
      <RouterLink to="/admin/profile" class="btn-ghost text-sm">简历</RouterLink>
      <RouterLink to="/" class="btn-ghost text-sm">返回站点</RouterLink>
    </div>
    <RouterView />
  </div>
</template>
