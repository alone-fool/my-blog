<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { blogClient } from '@/api/blogClient'
import type { PostListItem } from '@/types/blog'

const posts = ref<PostListItem[]>([])

async function load() {
  const res = await blogClient.listPosts(1, 100, { includeDraft: true })
  posts.value = res.list
}

async function remove(id: string) {
  if (!confirm('确定删除这篇文章？')) return
  await blogClient.deletePost(id)
  await load()
}

onMounted(load)
</script>

<template>
  <div class="glass-card p-6">
    <div class="mb-4 flex items-center justify-between">
      <h2 class="text-xl font-semibold">文章管理</h2>
      <RouterLink to="/admin/posts/new" class="btn-primary text-sm">新建文章</RouterLink>
    </div>
    <table class="w-full text-left text-sm">
      <thead>
        <tr class="border-b border-[rgb(var(--color-accent)/0.3)] text-[rgb(var(--color-text-muted))]">
          <th class="py-2">标题</th>
          <th class="py-2">状态</th>
          <th class="py-2">操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in posts" :key="p.id" class="border-b border-[rgb(var(--color-accent)/0.15)]">
          <td class="py-3">
            <RouterLink :to="`/blog/${p.slug}`" class="text-[rgb(var(--color-primary))] hover:underline">
              {{ p.title }}
            </RouterLink>
          </td>
          <td class="py-3">{{ p.status === 'published' ? '已发布' : '草稿' }}</td>
          <td class="py-3">
            <RouterLink :to="`/admin/posts/${p.id}/edit`" class="btn-ghost text-xs">编辑</RouterLink>
            <button type="button" class="btn-ghost text-xs text-red-600" @click="remove(p.id)">删除</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
