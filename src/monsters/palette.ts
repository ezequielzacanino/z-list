// Colors of one monster, derived from its hue so every species reads soft and cozy.
export type Palette = {
  body: string
  shade: string
  belly: string
  accent: string
  accentShade: string
}

export const INK = '#3a2c2b'
export const GOLD = '#ffd166'
export const GOLD_SHADE = '#b8862b'
export const CHEEK = '#ff9fb3'

export function palette(hue: number): Palette {
  const accentHue = (hue + 160) % 360
  return {
    body: `hsl(${hue} 58% 76%)`,
    shade: `hsl(${hue} 32% 36%)`,
    belly: `hsl(${hue} 75% 91%)`,
    accent: `hsl(${accentHue} 70% 72%)`,
    accentShade: `hsl(${accentHue} 40% 40%)`,
  }
}
