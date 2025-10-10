const SW_VERSION = 'v0.2.1';
const CACHE = 'EduMúsic-' + SW_VERSION;
const META_CACHE = 'EduMúsic-meta';
let IS_FRESH_VERSION = false; // Se pone a true cuando cambia la versión

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE);
  const cached = await cache.match(request);
  const networkPromise = fetch(request)
    .then((response) => {
      if (response && response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => null);

  if (cached) {
    networkPromise.catch(() => {});
    return cached;
  }

  const fromNetwork = await networkPromise;
  if (fromNetwork) return fromNetwork;

  const fallback = await cache.match(request);
  if (fallback) return fallback;

  return Response.error();
}

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => {
      return cache.addAll([
        '/',
  '/index.html',
  '/offline.html',
        '/css/style.css',
        '/js/app.js',
        '/js/i18n/index.js',
        '/js/i18n/gamehub.js',
        '/js/i18n/memory.js',
        '/js/i18n/hud.js',
        '/js/i18n/game.js',
        '/js/i18n/compas.js',
        '/js/i18n/melody.js',
        '/js/i18n/rhythm.js',
        '/js/i18n/clef.js',
        '/manifest.json',
  '/html/game.html',
  '/html/solmi.html',
  '/html/solmila.html',
  '/html/solmilado.html',
  '/html/memory.html',
  '/html/compas.html',
  '/html/melody.html',
        '/js/game.js',
        '/js/memory.js',
        '/js/compas.js',
        '/js/melody.js',
  '/html/rhythm.html',
        '/js/rhythm.js',
  '/html/clave-sol.html',
        '/js/clave_sol.js',
        '/assets/icon-192.png',
        '/assets/icon-512.png',
        '/assets/audio/piano.ogg',
        '/assets/audio/violin.ogg',
        '/assets/audio/trompeta.ogg',
        '/assets/audio/flute.ogg',
        '/assets/audio/guitar.ogg',
        '/assets/audio/bongos.ogg'
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

  // HTML: estrategia depende de si hay versión nueva
  const isDocument = request.mode === 'navigate'
    || request.destination === 'document'
    || ((request.headers.get('accept') || '').includes('text/html'));
  if (isDocument) {
    event.respondWith((async () => {
      if (IS_FRESH_VERSION) {
        // Network-first cuando hay nueva versión para evitar páginas obsoletas
        try {
          const resp = await fetch(request);
          const copy = resp.clone();
          caches.open(CACHE).then(c => c.put(request, copy));
          return resp;
        } catch {
          const cached = await caches.match(request);
          return cached || fetch(request);
        }
      }
      return staleWhileRevalidate(request);
    })());
    return;
  }

  // JS: estrategia depende de si hay versión nueva
  const isScript = request.destination === 'script' || url.pathname.startsWith('/js/');
  if (isScript) {
    event.respondWith((async () => {
      if (IS_FRESH_VERSION) {
        // Network-first para evitar JS obsoleto tras actualizar
        try {
          const resp = await fetch(request);
          const copy = resp.clone();
          caches.open(CACHE).then(c => c.put(request, copy));
          return resp;
        } catch {
          const cached = await caches.match(request);
          return cached || fetch(request);
        }
      }
      return staleWhileRevalidate(request);
    })());
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
      // Detectar si la versión ha cambiado usando un meta-cache persistente
      try {
        const meta = await caches.open(META_CACHE);
        const versionKey = new Request('/__sw_version__');
        const prevResp = await meta.match(versionKey);
        const prev = prevResp ? await prevResp.text() : null;
        if (prev !== SW_VERSION) {
          IS_FRESH_VERSION = true;
          await meta.put(versionKey, new Response(SW_VERSION));
        }
      } catch (_) {
        // Si algo falla, asumimos comportamiento por defecto (no fresh)
        IS_FRESH_VERSION = false;
      }

      // Limpiar cachés antiguas pero conservar la meta
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter(k => k !== CACHE && k !== META_CACHE)
          .map(k => caches.delete(k))
      );
      // Empezar a controlar clientes sin recarga
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
    return;
  }

  if (data && data.type === 'SKIP_WAITING') {
    // Allow clients to request immediate activation
    try {
      self.skipWaiting();
    } catch (e) { /* ignore */ }
    return;
  }
});
