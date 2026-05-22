<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { blogClient } from '@/api/blogClient'
import PostCard from '@/components/PostCard.vue'
import type { PostListItem } from '@/types/blog'

const posts = ref<PostListItem[]>([])
const page = ref(1)
const total = ref(0)
const pageSize = 10

async function load() {
  const res = await blogClient.listPosts(page.value, pageSize)
  posts.value = res.list
  total.value = res.total
}

function prevPage() {
  if (page.value <= 1) return
  page.value -= 1
  load()
}

function nextPage() {
  if (page.value * pageSize >= total.value) return
  page.value += 1
  load()
}

onMounted(load)
</script>

<template>
  <div class="mx-auto max-w-5xl px-4 py-8">
    <h1 class="mb-6 text-3xl font-bold">博客</h1>
    <div class="grid gap-4 md:grid-cols-2">
      <PostCard v-for="p in posts" :key="p.id" :post="p" />
    </div>
    <div v-if="posts.length === 0" class="glass-card p-8 text-center text-[rgb(var(--color-text-muted))]">
      暂无文章
    </div>
    <div v-if="total > pageSize" class="mt-6 flex justify-center gap-3">
      <button type="button" class="btn-secondary text-sm" @click="prevPage">上一页</button>
      <span class="self-center text-sm text-[rgb(var(--color-text-muted))]">{{ page }}</span>
      <button type="button" class="btn-secondary text-sm" @click="nextPage">下一页</button>
    </div>
  </div>
</template>
