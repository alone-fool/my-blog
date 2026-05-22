<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { marked } from 'marked'
import { blogClient } from '@/api/blogClient'
import { useAuthStore } from '@/stores/authStore'
import CommentSection from '@/components/CommentSection.vue'
import PostActions from '@/components/PostActions.vue'
import type { PostListItem } from '@/types/blog'

const route = useRoute()
const auth = useAuthStore()
const post = ref<PostListItem | null>(null)

const htmlContent = computed(() => {
  if (!post.value) return ''
  return marked.parse(post.value.content) as string
})

async function load() {
  const slug = String(route.params.slug)
  post.value = await blogClient.getPostBySlug(slug, auth.isOwner)
}

function onStatsRefresh() {
  load()
}

onMounted(load)
watch(() => route.params.slug, load)
</script>

<template>
  <div class="mx-auto max-w-3xl px-4 py-8">
    <article v-if="post" class="glass-card p-8">
      <p v-if="post.status === 'draft'" class="mb-2 text-xs font-medium text-amber-700">草稿（仅管理员可见）</p>
      <h1 class="text-3xl font-bold">{{ post.title }}</h1>
      <p class="mt-2 text-sm text-[rgb(var(--color-text-muted))]">
        {{ post.publishedAt?.slice(0, 10) ?? post.createdAt.slice(0, 10) }}
      </p>
      <p v-if="post.summary" class="mt-4 text-[rgb(var(--color-text-muted))]">{{ post.summary }}</p>
      <div class="prose-blog mt-6" v-html="htmlContent" />
    </article>

    <PostActions
      v-if="post"
      :post-id="post.id"
      :slug="post.slug"
      :title="post.title"
      :stats="post.stats"
      @refresh="onStatsRefresh"
    />
    <CommentSection v-if="post" :post-id="post.id" @refresh="onStatsRefresh" />
  </div>
</template>
