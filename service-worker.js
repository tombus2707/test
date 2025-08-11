const CACHE_NAME = 'dnd-8bit-v6';
const APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/assets/icon-192.png',
  '/assets/icon-512.png'
];
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => k !== CACHE_NAME ? caches.delete(k) : null)))
  );
  self.clients.claim();
});
self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.destination === 'document') {
    event.respondWith(fetch(request).then(resp => {
      const copy = resp.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
      return resp;
    }).catch(() => caches.match(request)));
    return;
  }
  event.respondWith(caches.match(request).then(cached => cached || fetch(request).then(resp => {
    const copy = resp.clone();
    caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
    return resp;
  })));
});