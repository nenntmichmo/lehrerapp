const CACHE_NAME = 'unterrichts-tool-v3';

// Beim Installieren alten Cache löschen
self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Nur GET-Requests cachen, POST/PATCH/DELETE immer direkt zum Netzwerk
self.addEventListener('fetch', event => {
  // Firebase, Firestore und alle API-Calls immer direkt - nie cachen
  const url = event.request.url;
  if (
    event.request.method !== 'GET' ||
    url.includes('firestore.googleapis.com') ||
    url.includes('firebase') ||
    url.includes('googleapis.com') ||
    url.includes('cloudinary') ||
    url.includes('supabase')
  ) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Statische Assets cachen
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
