<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { blogClient } from '@/api/blogClient'
import { useAuthStore } from '@/stores/authStore'
import type { Comment } from '@/types/blog'

const props = defineProps<{ postId: string }>()
const emit = defineEmits<{ refresh: [] }>()

const auth = useAuthStore()
const comments = ref<Comment[]>([])
const content = ref('')
const loading = ref(false)

async function load() {
  comments.value = await blogClient.listComments(props.postId)
}

async function submit() {
  if (!auth.user || !content.value.trim()) return
  loading.value = true
  await blogClient.addComment(props.postId, auth.user, content.value.trim())
  content.value = ''
  await load()
  loading.value = false
  emit('refresh')
}

onMounted(load)
</script>

<template>
  <section class="glass-card mt-6 p-5">
    <h3 class="text-lg font-semibold">评论</h3>
    <div v-if="auth.isLoggedIn" class="mt-4 flex flex-col gap-2">
      <textarea
        v-model="content"
        rows="3"
        class="w-full rounded-lg border border-[rgb(var(--color-accent)/0.4)] bg-[rgb(var(--color-surface))] p-3 text-sm outline-none focus:border-[rgb(var(--color-primary))]"
        placeholder="写下你的想法…"
      />
      <button type="button" class="btn-primary self-end text-sm" :disabled="loading" @click="submit">
        发表评论
      </button>
    </div>
    <p v-else class="mt-3 text-sm text-[rgb(var(--color-text-muted))]">
      <RouterLink to="/login" class="text-[rgb(var(--color-primary))]">登录</RouterLink>
      后可评论
    </p>
    <ul class="mt-4 space-y-3">
      <li
        v-for="c in comments"
        :key="c.id"
        class="flex gap-3 rounded-lg bg-[rgb(var(--color-surface-muted)/0.6)] p-3"
      >
        <img :src="c.avatarUrl" alt="" class="h-9 w-9 rounded-full bg-[rgb(var(--color-accent)/0.2)]" />
        <div>
          <p class="text-sm font-medium">{{ c.userName }}</p>
          <p class="text-sm text-[rgb(var(--color-text-muted))]">{{ c.content }}</p>
          <p class="mt-1 text-xs text-[rgb(var(--color-text-muted))]">{{ c.createdAt.slice(0, 16).replace('T', ' ') }}</p>
        </div>
      </li>
      <li v-if="comments.length === 0" class="text-sm text-[rgb(var(--color-text-muted))]">暂无评论</li>
    </ul>
  </section>
</template>
