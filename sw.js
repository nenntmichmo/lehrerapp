// Service Worker deaktiviert
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k))))
  );
  self.clients.claim();
});
// Alle Requests direkt ans Netzwerk - kein Caching
self.addEventListener('fetch', event => {
  event.respondWith(fetch(event.request).catch(() => new Response('', {status: 408})));
});
