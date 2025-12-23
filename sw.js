const CACHE_NAME = 'furnicohub-v3';
const urlsToCache = [
  './', 
  './index.html', 
  './dashboard.html', 
  './customer.html', 
  './shop.html', 
  './admin.html',
  './logo.png',  // Ensure this file exists in your repo!
  './icon.png'   // Ensure this file exists in your repo!
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // Robust caching: If one file fails, don't crash the whole app
      return Promise.all(
        urlsToCache.map(url => {
          return cache.add(url).catch(err => console.warn('Failed to cache:', url));
        })
      );
    })
  );
  self.skipWaiting(); // Force new SW to activate immediately
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  // Network First strategy for HTML (fresh content), Cache First for others
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
  } else if (!event.request.url.includes('firestore') && !event.request.url.includes('googleapis')) {
    event.respondWith(
      caches.match(event.request).then(response => response || fetch(event.request))
    );
  }
});
