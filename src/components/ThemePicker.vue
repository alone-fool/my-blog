<script setup lang="ts">
import { ref } from 'vue'
import { PRESET_THEMES, type PresetThemeId } from '@/config/themes'
import { useThemeStore } from '@/stores/themeStore'
import { extractPaletteFromFile } from '@/utils/colorExtract'

const themeStore = useThemeStore()
const fileInput = ref<HTMLInputElement | null>(null)
const uploading = ref(false)
const errorMsg = ref('')

function selectPreset(id: PresetThemeId) {
  themeStore.applyPreset(id)
}

function openFilePicker() {
  fileInput.value?.click()
}

async function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  uploading.value = true
  errorMsg.value = ''
  const palette = await extractPaletteFromFile(file)
  const reader = new FileReader()
  reader.onload = () => {
    const dataUrl = reader.result as string
    themeStore.applyCustom(dataUrl, palette)
    uploading.value = false
    input.value = ''
  }
  reader.onerror = () => {
    errorMsg.value = '读取图片失败'
    uploading.value = false
  }
  reader.readAsDataURL(file)
}
</script>

<template>
  <div class="relative group">
    <button type="button" class="btn-ghost text-sm">主题</button>
    <div
      class="absolute right-0 top-full mt-2 hidden w-64 rounded-xl border border-[rgb(var(--color-accent)/0.35)] bg-[rgb(var(--color-surface))] p-3 shadow-lg group-hover:block group-focus-within:block"
    >
      <p class="mb-2 text-xs text-[rgb(var(--color-text-muted))]">预置主题</p>
      <div class="grid grid-cols-2 gap-2">
        <button
          v-for="t in PRESET_THEMES"
          :key="t.id"
          type="button"
          class="rounded-lg border px-2 py-1.5 text-left text-xs transition hover:border-[rgb(var(--color-primary))]"
          :class="
            themeStore.presetId === t.id
              ? 'border-[rgb(var(--color-primary))] bg-[rgb(var(--color-primary)/0.08)]'
              : 'border-[rgb(var(--color-accent)/0.4)]'
          "
          @click="selectPreset(t.id)"
        >
          {{ t.name }}
        </button>
      </div>
      <p class="mt-3 mb-2 text-xs text-[rgb(var(--color-text-muted))]">自定义背景</p>
      <button type="button" class="btn-secondary w-full text-xs" :disabled="uploading" @click="openFilePicker">
        {{ uploading ? '处理中…' : '上传图片取色' }}
      </button>
      <p v-if="errorMsg" class="mt-1 text-xs text-red-600">{{ errorMsg }}</p>
      <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onFileChange" />
    </div>
  </div>
</template>
