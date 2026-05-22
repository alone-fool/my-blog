<script setup lang="ts">
import { ref } from 'vue'
const props = defineProps<{
  title: string
  slug: string
}>()

const copied = ref(false)

function buildUrl() {
  const base = `${window.location.origin}${import.meta.env.BASE_URL}`.replace(/\/$/, '')
  return `${base}/blog/${props.slug}`
}

async function copyLink() {
  const url = buildUrl()
  await navigator.clipboard.writeText(url)
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 2000)
}

async function nativeShare() {
  const url = buildUrl()
  if (navigator.share) {
    await navigator.share({ title: props.title, url })
    return
  }
  await copyLink()
}
</script>

<template>
  <div class="flex flex-wrap items-center gap-2">
    <button type="button" class="btn-secondary text-sm" @click="copyLink">
      {{ copied ? '已复制' : '复制链接' }}
    </button>
    <button type="button" class="btn-primary text-sm" @click="nativeShare">分享</button>
  </div>
</template>
