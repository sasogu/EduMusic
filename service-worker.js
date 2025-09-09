self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('edumusic-v0.0.4').then(cache => {
      return cache.addAll([
        '/',
        '/index.html',
        '/css/style.css',
        '/js/app.js',
        '/manifest.json',
        '/game.html',
        '/js/game.js',
        '/assets/icon-192.png',
        '/assets/icon-512.png'
      ]);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

// Clean up old caches when activating new service worker
self.addEventListener('activate', event => {
  const keep = ['edumusic-v0.0.3'];
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => !keep.includes(k)).map(k => caches.delete(k))
    ))
  );
});
