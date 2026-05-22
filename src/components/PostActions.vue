<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { blogClient } from '@/api/blogClient'
import { useAuthStore } from '@/stores/authStore'
import type { PostStats, UserInteraction } from '@/types/blog'
import ShareBar from './ShareBar.vue'

const props = defineProps<{
  postId: string
  slug: string
  title: string
  stats: PostStats
}>()

const emit = defineEmits<{ refresh: [] }>()

const auth = useAuthStore()
const interaction = ref<UserInteraction>({ liked: false, favorited: false })
const localStats = ref({ ...props.stats })

async function loadInteraction() {
  if (!auth.user) return
  interaction.value = await blogClient.getUserInteraction(props.postId, auth.user.id)
}

async function toggleLike() {
  if (!auth.user) return
  interaction.value = await blogClient.toggleLike(props.postId, auth.user.id)
  localStats.value.likesCount += interaction.value.liked ? 1 : -1
  if (localStats.value.likesCount < 0) localStats.value.likesCount = 0
  emit('refresh')
}

async function toggleFavorite() {
  if (!auth.user) return
  interaction.value = await blogClient.toggleFavorite(props.postId, auth.user.id)
  localStats.value.favoritesCount += interaction.value.favorited ? 1 : -1
  if (localStats.value.favoritesCount < 0) localStats.value.favoritesCount = 0
  emit('refresh')
}

onMounted(loadInteraction)
</script>

<template>
  <div class="glass-card mt-4 flex flex-wrap items-center justify-between gap-4 p-4">
    <div class="flex flex-wrap items-center gap-2">
      <button
        v-if="auth.isLoggedIn"
        type="button"
        class="btn-secondary text-sm"
        :class="interaction.liked ? 'ring-2 ring-[rgb(var(--color-primary))]' : ''"
        @click="toggleLike"
      >
        赞 {{ localStats.likesCount }}
      </button>
      <span v-else class="text-sm text-[rgb(var(--color-text-muted))]">赞 {{ localStats.likesCount }}</span>

      <button
        v-if="auth.isLoggedIn"
        type="button"
        class="btn-secondary text-sm"
        :class="interaction.favorited ? 'ring-2 ring-[rgb(var(--color-primary))]' : ''"
        @click="toggleFavorite"
      >
        藏 {{ localStats.favoritesCount }}
      </button>
      <span v-else class="text-sm text-[rgb(var(--color-text-muted))]">藏 {{ localStats.favoritesCount }}</span>

      <span class="text-sm text-[rgb(var(--color-text-muted))]">评 {{ localStats.commentsCount }}</span>
    </div>
    <ShareBar :title="title" :slug="slug" />
    <p v-if="!auth.isLoggedIn" class="w-full text-xs text-[rgb(var(--color-text-muted))]">
      <RouterLink to="/login" class="text-[rgb(var(--color-primary))]">登录</RouterLink>
      后可点赞与收藏
    </p>
  </div>
</template>
