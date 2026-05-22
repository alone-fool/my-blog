<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="mx-auto max-w-md px-4 py-20 text-center">
    <h1 class="text-4xl font-bold">404</h1>
    <p class="mt-2 text-[rgb(var(--color-text-muted))]">页面不存在</p>
    <RouterLink to="/" class="btn-primary mt-6 inline-block text-sm">返回首页</RouterLink>
  </div>
</template>
