<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { blogClient } from '@/api/blogClient'
import type { Profile } from '@/types/blog'

const profile = ref<Profile | null>(null)

onMounted(async () => {
  profile.value = await blogClient.getProfile()
})
</script>

<template>
  <div class="mx-auto max-w-3xl px-4 py-8">
    <article v-if="profile" class="glass-card p-8">
      <header class="border-b border-[rgb(var(--color-accent)/0.3)] pb-6">
        <h1 class="text-3xl font-bold">{{ profile.displayName }}</h1>
        <p class="mt-2 text-xl text-[rgb(var(--color-primary))]">{{ profile.title }}</p>
        <p class="mt-4 leading-relaxed text-[rgb(var(--color-text-muted))]">{{ profile.bio }}</p>
      </header>

      <section class="mt-8">
        <h2 class="text-lg font-semibold">技能</h2>
        <ul class="mt-3 flex flex-wrap gap-2">
          <li
            v-for="skill in profile.skills"
            :key="skill"
            class="rounded-full bg-[rgb(var(--color-primary)/0.12)] px-3 py-1 text-sm text-[rgb(var(--color-primary))]"
          >
            {{ skill }}
          </li>
        </ul>
      </section>

      <section class="mt-8">
        <h2 class="text-lg font-semibold">经历</h2>
        <div v-for="exp in profile.experiences" :key="exp.company + exp.period" class="mt-4">
          <h3 class="font-medium">{{ exp.role }} · {{ exp.company }}</h3>
          <p class="text-sm text-[rgb(var(--color-text-muted))]">{{ exp.period }}</p>
          <p class="mt-1 text-sm text-[rgb(var(--color-text-muted))]">{{ exp.description }}</p>
        </div>
      </section>

      <section class="mt-8">
        <h2 class="text-lg font-semibold">联系</h2>
        <ul class="mt-3 space-y-2">
          <li v-for="link in profile.socialLinks" :key="link.url">
            <a
              :href="link.url"
              target="_blank"
              rel="noopener noreferrer"
              class="text-[rgb(var(--color-primary))] hover:underline"
            >
              {{ link.label }}
            </a>
          </li>
        </ul>
      </section>
    </article>
  </div>
</template>
