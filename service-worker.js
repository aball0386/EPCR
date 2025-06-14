const CACHE_NAME = 'secamb-pcr-cache-v1';
const FILES_TO_CACHE = [
  '.',
  'index.html',
  'styles.css',
  'app.js',
  'manifest.json',
  'icons/pcr-icon-192.png',
  'icons/pcr-icon-512.png'
];

self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[ServiceWorker] Pre-caching offline resources');
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', evt => {
  evt.waitUntil(
    caches.keys().then(keyList =>
      Promise.all(keyList.map(key => {
        if (key !== CACHE_NAME) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', evt => {
  if (evt.request.method !== 'GET') return;

  evt.respondWith(
    caches.match(evt.request).then(response => {
      return response || fetch(evt.request);
    })
  );
});
