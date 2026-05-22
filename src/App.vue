<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import { useAuthStore } from '@/stores/authStore'
import { useThemeStore } from '@/stores/themeStore'

const themeStore = useThemeStore()
const auth = useAuthStore()

onMounted(() => {
  themeStore.restore()
  auth.init()
})
</script>

<template>
  <div class="app-shell">
    <AppHeader />
    <main>
      <RouterView />
    </main>
    <footer class="py-8 text-center text-xs text-[rgb(var(--color-text-muted))]">
      © {{ new Date().getFullYear() }} My Blog
    </footer>
  </div>
</template>
