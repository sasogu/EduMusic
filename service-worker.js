const SW_VERSION = 'v0.0.10';
const CACHE = 'edumusic-' + SW_VERSION;

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
  // Activate new SW immediately
  self.skipWaiting();
});

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Serve a favicon even if /favicon.ico isn't present on disk
  if (url.pathname === '/favicon.ico') {
    event.respondWith(
      caches.match('/assets/icon-192.png').then(resp => resp || fetch('/assets/icon-192.png'))
    );
    return;
  }

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
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
      // Start controlling clients without needing a reload
      await self.clients.claim();
    })()
  );
});

// Respond to version queries from clients
self.addEventListener('message', (event) => {
  const data = event.data || {};
  if (data && data.type === 'GET_VERSION') {
    const payload = { type: 'VERSION', version: SW_VERSION, cache: CACHE };
    try {
      if (event.ports && event.ports[0]) {
        event.ports[0].postMessage(payload);
      } else if (event.source && event.source.postMessage) {
        event.source.postMessage(payload);
      }
    } catch (e) { /* no-op */ }
  }
});
