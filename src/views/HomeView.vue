<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { blogClient } from '@/api/blogClient'
import PostCard from '@/components/PostCard.vue'
import type { PostListItem, Profile } from '@/types/blog'

const profile = ref<Profile | null>(null)
const posts = ref<PostListItem[]>([])

onMounted(async () => {
  profile.value = await blogClient.getProfile()
  const res = await blogClient.listPosts(1, 5)
  posts.value = res.list
})
</script>

<template>
  <div class="mx-auto max-w-5xl px-4 py-8">
    <section v-if="profile" class="glass-card p-8">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
        <img
          :src="profile.avatarUrl"
          alt=""
          class="h-24 w-24 rounded-full border-2 border-[rgb(var(--color-accent))] object-cover"
        />
        <div>
          <h1 class="text-3xl font-bold">{{ profile.displayName }}</h1>
          <p class="mt-1 text-lg text-[rgb(var(--color-primary))]">{{ profile.title }}</p>
          <p class="mt-3 max-w-2xl text-[rgb(var(--color-text-muted))]">{{ profile.bio }}</p>
          <div class="mt-4 flex flex-wrap gap-2">
            <RouterLink to="/resume" class="btn-primary text-sm">查看简历</RouterLink>
            <RouterLink to="/blog" class="btn-secondary text-sm">阅读博客</RouterLink>
          </div>
        </div>
      </div>
    </section>

    <section class="mt-10">
      <h2 class="mb-4 text-2xl font-semibold">最新文章</h2>
      <div class="grid gap-4 md:grid-cols-2">
        <PostCard v-for="p in posts" :key="p.id" :post="p" />
      </div>
      <RouterLink v-if="posts.length" to="/blog" class="btn-ghost mt-4 inline-block text-sm">查看全部 →</RouterLink>
    </section>
  </div>
</template>
