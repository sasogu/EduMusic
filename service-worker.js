const CACHE = 'edumusic-v0.0.6';

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => {
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
  const { request } = event;
  const url = new URL(request.url);

  // Network-first for JS to avoid stale code
  const isScript = request.destination === 'script' || url.pathname.startsWith('/js/');
  if (isScript) {
    event.respondWith(
      fetch(request)
        .then(resp => {
          const copy = resp.clone();
          caches.open(CACHE).then(c => c.put(request, copy));
          return resp;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Cache-first for other assets
  event.respondWith(
    caches.match(request).then(response => response || fetch(request))
  );
});

// Clean up old caches when activating new service worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE).map(k => caches.delete(k))
    ))
  );
});
