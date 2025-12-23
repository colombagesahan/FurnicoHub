const CACHE_NAME = 'furnicohub-v1';
const urlsToCache = ['./', './index.html', './dashboard.html', './customer.html', './style.css', './logo.png', './icon.png'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache)));
});

self.addEventListener('fetch', event => {
  if (!event.request.url.includes('firestore') && !event.request.url.includes('googleapis')) {
    event.respondWith(caches.match(event.request).then(response => response || fetch(event.request)));
  }
});
