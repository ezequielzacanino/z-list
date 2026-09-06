// Serves hashed build assets from cache and always reaches the network for data.
// The build stamps its own cache name on the registration URL, so a deploy drops the old one.
const CACHE = `listas-${new URL(self.location.href).searchParams.get('v')}`

// Assets are hashed and navigations go to the network, so a new build takes over at once.
self.addEventListener('install', () => self.skipWaiting())

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return

  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).catch(() => caches.match('/index.html')))
    return
  }

  event.respondWith(
    caches.match(request).then(
      (cached) =>
        cached ??
        fetch(request).then((response) => {
          const copy = response.clone()
          caches.open(CACHE).then((cache) => cache.put(request, copy))
          return response
        }),
    ),
  )
})

self.addEventListener('push', (event) => {
  const notice = event.data.json()
  event.waitUntil(
    self.registration.showNotification(notice.title, {
      body: notice.body,
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      tag: notice.url,
      data: { url: notice.url },
    }),
  )
})

// Opens the list the notice is about, reusing the window already open.
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const { url } = event.notification.data
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((windows) => {
      const open = windows.find((client) => client.url.startsWith(self.location.origin))
      return open ? open.focus().then(() => open.navigate(url)) : self.clients.openWindow(url)
    }),
  )
})

