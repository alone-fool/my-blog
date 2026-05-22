<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { MdEditor } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import { blogClient } from '@/api/blogClient'
import type { PostStatus } from '@/types/blog'

const route = useRoute()
const router = useRouter()
const isNew = route.name === 'admin-post-new'

const form = ref({
  slug: '',
  title: '',
  summary: '',
  content: '',
  coverUrl: '',
  status: 'draft' as PostStatus,
})

const saving = ref(false)
const errorMsg = ref('')

async function load() {
  if (isNew) return
  const id = String(route.params.id)
  const post = await blogClient.getPostById(id)
  if (!post) {
    errorMsg.value = '文章不存在'
    return
  }
  form.value = {
    slug: post.slug,
    title: post.title,
    summary: post.summary,
    content: post.content,
    coverUrl: post.coverUrl,
    status: post.status,
  }
}

async function save() {
  saving.value = true
  errorMsg.value = ''
  const publishedAt =
    form.value.status === 'published' ? new Date().toISOString() : null

  if (isNew) {
    await blogClient.createPost({
      slug: form.value.slug,
      title: form.value.title,
      summary: form.value.summary,
      content: form.value.content,
      coverUrl: form.value.coverUrl,
      status: form.value.status,
      publishedAt,
    })
  } else {
    await blogClient.updatePost(String(route.params.id), {
      ...form.value,
      publishedAt,
    })
  }
  saving.value = false
  router.push('/admin/posts')
}

onMounted(load)
</script>

<template>
  <div class="glass-card p-6">
    <h2 class="mb-4 text-xl font-semibold">{{ isNew ? '新建文章' : '编辑文章' }}</h2>
    <p v-if="errorMsg" class="mb-3 text-sm text-red-600">{{ errorMsg }}</p>
    <form class="space-y-4" @submit.prevent="save">
      <div class="grid gap-4 sm:grid-cols-2">
        <label class="block text-sm">
          <span class="text-[rgb(var(--color-text-muted))]">标题</span>
          <input v-model="form.title" required class="mt-1 w-full rounded-lg border border-[rgb(var(--color-accent)/0.4)] p-2" />
        </label>
        <label class="block text-sm">
          <span class="text-[rgb(var(--color-text-muted))]">Slug</span>
          <input v-model="form.slug" required class="mt-1 w-full rounded-lg border border-[rgb(var(--color-accent)/0.4)] p-2" />
        </label>
      </div>
      <label class="block text-sm">
        <span class="text-[rgb(var(--color-text-muted))]">摘要</span>
        <input v-model="form.summary" class="mt-1 w-full rounded-lg border border-[rgb(var(--color-accent)/0.4)] p-2" />
      </label>
      <label class="block text-sm">
        <span class="text-[rgb(var(--color-text-muted))]">封面 URL</span>
        <input v-model="form.coverUrl" class="mt-1 w-full rounded-lg border border-[rgb(var(--color-accent)/0.4)] p-2" />
      </label>
      <label class="block text-sm">
        <span class="text-[rgb(var(--color-text-muted))]">状态</span>
        <select v-model="form.status" class="mt-1 rounded-lg border border-[rgb(var(--color-accent)/0.4)] p-2">
          <option value="draft">草稿</option>
          <option value="published">已发布</option>
        </select>
      </label>
      <div>
        <span class="text-sm text-[rgb(var(--color-text-muted))]">正文 Markdown</span>
        <MdEditor v-model="form.content" language="zh-CN" class="mt-2" />
      </div>
      <div class="flex gap-3">
        <button type="submit" class="btn-primary text-sm" :disabled="saving">{{ saving ? '保存中…' : '保存' }}</button>
        <RouterLink to="/admin/posts" class="btn-secondary text-sm">取消</RouterLink>
      </div>
    </form>
  </div>
</template>
