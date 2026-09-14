export type Theme = 'light' | 'dark'

export const themeKey = 'theme'

// The inline script in index.html sets the attribute before the first paint.
export function readTheme(): Theme {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
}

// Browser bar color per theme, matching --bg in styles.css.
const barColors: Record<Theme, string> = { light: '#fdf7f3', dark: '#14151e' }

export function storeTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme
  document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')!.content = barColors[theme]
  localStorage.setItem(themeKey, theme)
}
