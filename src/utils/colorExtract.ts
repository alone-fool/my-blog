export interface ExtractedPalette {
  primary: string
  secondary: string
  accent: string
  surface: string
  surfaceMuted: string
  text: string
  textMuted: string
  primaryForeground: string
}

function rgbTupleToCss(rgb: [number, number, number]): string {
  return `${rgb[0]} ${rgb[1]} ${rgb[2]}`
}

function luminance(rgb: [number, number, number]): number {
  const [r, g, b] = rgb.map((v) => {
    const c = v / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function mixRgb(a: [number, number, number], b: [number, number, number], ratio: number): [number, number, number] {
  return [
    Math.round(a[0] * (1 - ratio) + b[0] * ratio),
    Math.round(a[1] * (1 - ratio) + b[1] * ratio),
    Math.round(a[2] * (1 - ratio) + b[2] * ratio),
  ]
}

function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('图片加载失败'))
    }
    img.src = url
  })
}

function sampleDominantColors(img: HTMLImageElement, sampleSize = 48): [number, number, number][] {
  const canvas = document.createElement('canvas')
  canvas.width = sampleSize
  canvas.height = sampleSize
  const ctx = canvas.getContext('2d')
  if (!ctx) return [[120, 120, 120]]

  ctx.drawImage(img, 0, 0, sampleSize, sampleSize)
  const { data } = ctx.getImageData(0, 0, sampleSize, sampleSize)
  const buckets = new Map<string, { rgb: [number, number, number]; count: number }>()

  for (let i = 0; i < data.length; i += 4) {
    const a = data[i + 3]
    if (a < 128) continue
    const r = Math.round(data[i] / 32) * 32
    const g = Math.round(data[i + 1] / 32) * 32
    const b = Math.round(data[i + 2] / 32) * 32
    const key = `${r},${g},${b}`
    const existing = buckets.get(key)
    if (existing) {
      existing.count += 1
    } else {
      buckets.set(key, { rgb: [r, g, b], count: 1 })
    }
  }

  return [...buckets.values()]
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
    .map((b) => b.rgb)
}

export async function extractPaletteFromFile(file: File): Promise<ExtractedPalette> {
  const img = await loadImageFromFile(file)
  const colors = sampleDominantColors(img)
  const dominant = colors[0] ?? [120, 120, 120]
  const secondary = colors[1] ?? mixRgb(dominant, [255, 255, 255], 0.25)
  const accent = colors[2] ?? mixRgb(dominant, [255, 255, 255], 0.45)
  const surface: [number, number, number] = [252, 252, 252]
  const surfaceMuted = mixRgb(dominant, [255, 255, 255], 0.88)
  const text = mixRgb(dominant, [0, 0, 0], 0.72)
  const textMuted = mixRgb(dominant, [80, 80, 80], 0.45)
  const primaryForeground: [number, number, number] =
    luminance(dominant) > 0.55 ? [30, 30, 30] : [255, 255, 255]

  return {
    primary: rgbTupleToCss(dominant),
    secondary: rgbTupleToCss(secondary),
    accent: rgbTupleToCss(accent),
    surface: rgbTupleToCss(surface),
    surfaceMuted: rgbTupleToCss(surfaceMuted),
    text: rgbTupleToCss(text),
    textMuted: rgbTupleToCss(textMuted),
    primaryForeground: rgbTupleToCss(primaryForeground),
  }
}

export function paletteToCssVars(palette: ExtractedPalette): Record<string, string> {
  return {
    '--color-primary': palette.primary,
    '--color-primary-foreground': palette.primaryForeground,
    '--color-secondary': palette.secondary,
    '--color-accent': palette.accent,
    '--color-surface': palette.surface,
    '--color-surface-muted': palette.surfaceMuted,
    '--color-text': palette.text,
    '--color-text-muted': palette.textMuted,
  }
}
