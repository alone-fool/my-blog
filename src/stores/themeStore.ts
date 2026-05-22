import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import {
  DEFAULT_THEME_ID,
  getPresetTheme,
  type PresetThemeId,
} from '@/config/themes'
import { paletteToCssVars, type ExtractedPalette } from '@/utils/colorExtract'

const STORAGE_KEY = 'my-blog-theme'

interface StoredTheme {
  presetId: PresetThemeId | 'custom'
  customBackground?: string
  customPalette?: ExtractedPalette
}

function applyCssVars(vars: Record<string, string>, backgroundImage?: string) {
  const root = document.documentElement
  Object.entries(vars).forEach(([key, value]) => {
    root.style.setProperty(key, value)
  })
  if (backgroundImage !== undefined) {
    root.style.setProperty('--theme-bg-image', backgroundImage)
  }
}

function presetToVars(presetId: PresetThemeId) {
  const theme = getPresetTheme(presetId)
  return {
    vars: {
      '--color-primary': theme.palette.primary,
      '--color-primary-foreground': theme.palette.primaryForeground,
      '--color-secondary': theme.palette.secondary,
      '--color-accent': theme.palette.accent,
      '--color-surface': theme.palette.surface,
      '--color-surface-muted': theme.palette.surfaceMuted,
      '--color-text': theme.palette.text,
      '--color-text-muted': theme.palette.textMuted,
    },
    bg: theme.backgroundImage,
  }
}

export const useThemeStore = defineStore('theme', () => {
  const presetId = ref<PresetThemeId | 'custom'>(DEFAULT_THEME_ID)
  const customBackground = ref<string | null>(null)

  function persist() {
    const payload: StoredTheme = {
      presetId: presetId.value,
      customBackground: customBackground.value ?? undefined,
      customPalette:
        presetId.value === 'custom' && customBackground.value
          ? loadCustomPalette()
          : undefined,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  }

  function loadCustomPalette(): ExtractedPalette | undefined {
    const raw = localStorage.getItem(`${STORAGE_KEY}-palette`)
    if (!raw) return undefined
    return JSON.parse(raw) as ExtractedPalette
  }

  function saveCustomPalette(palette: ExtractedPalette) {
    localStorage.setItem(`${STORAGE_KEY}-palette`, JSON.stringify(palette))
  }

  function applyPreset(id: PresetThemeId) {
    presetId.value = id
    customBackground.value = null
    const { vars, bg } = presetToVars(id)
    applyCssVars(vars, bg)
    document.documentElement.dataset.theme = id
    persist()
  }

  function applyCustom(backgroundDataUrl: string, palette: ExtractedPalette) {
    presetId.value = 'custom'
    customBackground.value = backgroundDataUrl
    saveCustomPalette(palette)
    applyCssVars(paletteToCssVars(palette), `url("${backgroundDataUrl}")`)
    document.documentElement.dataset.theme = 'custom'
    persist()
  }

  function restore() {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      applyPreset(DEFAULT_THEME_ID)
      return
    }
    const stored = JSON.parse(raw) as StoredTheme
    if (stored.presetId === 'custom' && stored.customBackground && stored.customPalette) {
      applyCustom(stored.customBackground, stored.customPalette)
      return
    }
    applyPreset(stored.presetId === 'custom' ? DEFAULT_THEME_ID : stored.presetId)
  }

  watch(presetId, () => persist())

  return {
    presetId,
    customBackground,
    applyPreset,
    applyCustom,
    restore,
  }
})
