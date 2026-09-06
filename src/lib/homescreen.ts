// A manifest of its own turns one list into a separate app icon on the phone.
const icons = [
  { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
  { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
]

export function listManifestUrl(listId: string, name: string) {
  const manifest = {
    id: `/lista/${listId}`,
    name,
    short_name: name,
    start_url: `/lista/${listId}`,
    scope: '/',
    display: 'standalone',
    background_color: '#fdf7f3',
    theme_color: '#f4926f',
    icons,
  }
  const body = new Blob([JSON.stringify(manifest)], { type: 'application/manifest+json' })
  return URL.createObjectURL(body)
}

// iOS has no install prompt: the icon comes from the share sheet.
export const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent)

// An app opened from its own icon has nothing left to install.
export function isStandalone() {
  return matchMedia('(display-mode: standalone)').matches
}
