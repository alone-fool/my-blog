<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { blogClient } from '@/api/blogClient'
import type { Profile } from '@/types/blog'

const profile = ref<Profile | null>(null)
const saving = ref(false)
const skillsText = ref('')

async function load() {
  profile.value = await blogClient.getProfile()
  skillsText.value = profile.value.skills.join(', ')
}

function parseSkills(): string[] {
  return skillsText.value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

function addExperience() {
  if (!profile.value) return
  profile.value.experiences.push({
    company: '',
    role: '',
    period: '',
    description: '',
  })
}

function removeExperience(index: number) {
  profile.value?.experiences.splice(index, 1)
}

function addSocialLink() {
  profile.value?.socialLinks.push({ label: '', url: '' })
}

function removeSocialLink(index: number) {
  profile.value?.socialLinks.splice(index, 1)
}

async function save() {
  if (!profile.value) return
  saving.value = true
  profile.value.skills = parseSkills()
  await blogClient.updateProfile(profile.value)
  saving.value = false
}

onMounted(load)
</script>

<template>
  <div v-if="profile" class="glass-card space-y-4 p-6">
    <h2 class="text-xl font-semibold">编辑简历</h2>
    <label class="block text-sm">
      姓名
      <input v-model="profile.displayName" class="mt-1 w-full rounded-lg border border-[rgb(var(--color-accent)/0.4)] p-2" />
    </label>
    <label class="block text-sm">
      头衔
      <input v-model="profile.title" class="mt-1 w-full rounded-lg border border-[rgb(var(--color-accent)/0.4)] p-2" />
    </label>
    <label class="block text-sm">
      简介
      <textarea v-model="profile.bio" rows="3" class="mt-1 w-full rounded-lg border border-[rgb(var(--color-accent)/0.4)] p-2" />
    </label>
    <label class="block text-sm">
      头像 URL
      <input v-model="profile.avatarUrl" class="mt-1 w-full rounded-lg border border-[rgb(var(--color-accent)/0.4)] p-2" />
    </label>
    <label class="block text-sm">
      技能（逗号分隔）
      <input v-model="skillsText" class="mt-1 w-full rounded-lg border border-[rgb(var(--color-accent)/0.4)] p-2" />
    </label>

    <section>
      <div class="mb-2 flex items-center justify-between">
        <h3 class="font-medium">经历</h3>
        <button type="button" class="btn-secondary text-xs" @click="addExperience">添加</button>
      </div>
      <div
        v-for="(exp, i) in profile.experiences"
        :key="i"
        class="mb-3 rounded-lg border border-[rgb(var(--color-accent)/0.2)] p-3"
      >
        <input v-model="exp.role" placeholder="职位" class="mb-2 w-full rounded border p-2 text-sm" />
        <input v-model="exp.company" placeholder="公司" class="mb-2 w-full rounded border p-2 text-sm" />
        <input v-model="exp.period" placeholder="时间" class="mb-2 w-full rounded border p-2 text-sm" />
        <textarea v-model="exp.description" placeholder="描述" rows="2" class="w-full rounded border p-2 text-sm" />
        <button type="button" class="btn-ghost mt-2 text-xs text-red-600" @click="removeExperience(i)">删除</button>
      </div>
    </section>

    <section>
      <div class="mb-2 flex items-center justify-between">
        <h3 class="font-medium">社交链接</h3>
        <button type="button" class="btn-secondary text-xs" @click="addSocialLink">添加</button>
      </div>
      <div
        v-for="(link, i) in profile.socialLinks"
        :key="i"
        class="mb-2 flex gap-2"
      >
        <input v-model="link.label" placeholder="标签" class="w-1/3 rounded border p-2 text-sm" />
        <input v-model="link.url" placeholder="URL" class="flex-1 rounded border p-2 text-sm" />
        <button type="button" class="btn-ghost text-xs" @click="removeSocialLink(i)">删</button>
      </div>
    </section>

    <button type="button" class="btn-primary text-sm" :disabled="saving" @click="save">
      {{ saving ? '保存中…' : '保存简历' }}
    </button>
  </div>
</template>
