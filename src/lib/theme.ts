export type Theme = 'light' | 'dark'

export const themeKey = 'theme'

// The inline script in index.html sets the attribute before the first paint.
export function readTheme(): Theme {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
}

export function storeTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme
  localStorage.setItem(themeKey, theme)
}
