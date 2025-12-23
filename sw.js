const CACHE_NAME = 'furnicohub-v2';
const urlsToCache = [
  './', './index.html', './dashboard.html', './customer.html', 
  './shop.html', './admin.html', './icon.png', './logo.png'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache)));
});

self.addEventListener('fetch', event => {
  // Network first for Firestore/API, Cache first for static assets
  if (!event.request.url.includes('firestore') && !event.request.url.includes('googleapis')) {
    event.respondWith(caches.match(event.request).then(response => response || fetch(event.request)));
  }
});
