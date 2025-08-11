const CACHE_NAME = 'dnd-8bit-v5c';
const APP_SHELL = ['/', '/index.html', '/manifest.webmanifest', '/assets/icon-192.png', '/assets/icon-512.png'];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(APP_SHELL))); self.skipWaiting(); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then(keys => Promise.all(keys.map(k => k!==CACHE_NAME?caches.delete(k):null)))); self.clients.claim(); });
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.destination === 'document') {
    e.respondWith(fetch(req).then(r => { const copy = r.clone(); caches.open(CACHE_NAME).then(c=>c.put(req, copy)); return r; }).catch(()=>caches.match(req)));
  } else {
    e.respondWith(caches.match(req).then(cached => cached || fetch(req).then(r => { const copy = r.clone(); caches.open(CACHE_NAME).then(c=>c.put(req, copy)); return r; })));
  }
});