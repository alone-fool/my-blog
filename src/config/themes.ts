export type PresetThemeId = 'forest' | 'ocean' | 'sky' | 'brick' | 'park'

export interface ThemePalette {
  primary: string
  primaryForeground: string
  secondary: string
  accent: string
  surface: string
  surfaceMuted: string
  text: string
  textMuted: string
}

export interface PresetTheme {
  id: PresetThemeId
  name: string
  description: string
  backgroundImage: string
  palette: ThemePalette
}

const base = import.meta.env.BASE_URL

export const PRESET_THEMES: PresetTheme[] = [
  {
    id: 'forest',
    name: '森林',
    description: '深绿与晨光',
    backgroundImage: `url(${base}themes/forest.svg)`,
    palette: {
      primary: '34 139 87',
      primaryForeground: '255 255 255',
      secondary: '27 94 63',
      accent: '129 199 132',
      surface: '255 255 255',
      surfaceMuted: '240 249 244',
      text: '23 43 32',
      textMuted: '74 96 84',
    },
  },
  {
    id: 'ocean',
    name: '海洋',
    description: '深蓝与浪花',
    backgroundImage: `url(${base}themes/ocean.svg)`,
    palette: {
      primary: '2 132 199',
      primaryForeground: '255 255 255',
      secondary: '3 105 161',
      accent: '125 211 252',
      surface: '255 255 255',
      surfaceMuted: '240 249 255',
      text: '12 35 64',
      textMuted: '71 85 105',
    },
  },
  {
    id: 'sky',
    name: '天空',
    description: '浅蓝与云絮',
    backgroundImage: `url(${base}themes/sky.svg)`,
    palette: {
      primary: '14 165 233',
      primaryForeground: '255 255 255',
      secondary: '56 189 248',
      accent: '186 230 253',
      surface: '255 255 255',
      surfaceMuted: '248 250 252',
      text: '30 41 59',
      textMuted: '100 116 139',
    },
  },
  {
    id: 'brick',
    name: '红砖',
    description: '暖褐与砖墙',
    backgroundImage: `url(${base}themes/brick.svg)`,
    palette: {
      primary: '180 83 9',
      primaryForeground: '255 255 255',
      secondary: '154 52 18',
      accent: '253 186 116',
      surface: '255 255 255',
      surfaceMuted: '255 247 237',
      text: '67 20 7',
      textMuted: '120 53 15',
    },
  },
  {
    id: 'park',
    name: '公园',
    description: '草绿与阳光',
    backgroundImage: `url(${base}themes/park.svg)`,
    palette: {
      primary: '101 163 13',
      primaryForeground: '255 255 255',
      secondary: '77 124 15',
      accent: '190 242 100',
      surface: '255 255 255',
      surfaceMuted: '247 254 231',
      text: '26 46 5',
      textMuted: '63 98 18',
    },
  },
]

export const DEFAULT_THEME_ID: PresetThemeId = 'forest'

export function getPresetTheme(id: PresetThemeId): PresetTheme {
  const theme = PRESET_THEMES.find((t) => t.id === id)
  if (!theme) {
    return PRESET_THEMES[0]
  }
  return theme
}
