<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { PostListItem } from '@/types/blog'

defineProps<{
  post: PostListItem
}>()
</script>

<template>
  <article class="glass-card p-5 transition hover:shadow-lg">
    <RouterLink :to="`/blog/${post.slug}`" class="block">
      <h2 class="text-xl font-semibold text-[rgb(var(--color-text))]">{{ post.title }}</h2>
      <p class="mt-2 line-clamp-2 text-sm text-[rgb(var(--color-text-muted))]">{{ post.summary }}</p>
      <div class="mt-3 flex flex-wrap gap-3 text-xs text-[rgb(var(--color-text-muted))]">
        <span>{{ post.publishedAt?.slice(0, 10) ?? post.createdAt.slice(0, 10) }}</span>
        <span>赞 {{ post.stats.likesCount }}</span>
        <span>评 {{ post.stats.commentsCount }}</span>
        <span>藏 {{ post.stats.favoritesCount }}</span>
      </div>
    </RouterLink>
  </article>
</template>
