const SW_VERSION = 'v0.0.45';
const CACHE = 'EduMúsic-' + SW_VERSION;
const META_CACHE = 'EduMúsic-meta';
let IS_FRESH_VERSION = false; // Se pone a true cuando cambia la versión

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
        '/solmi.html',
        '/solmila.html',
        '/solmilado.html',
        '/memory.html',
        '/compas.html',
        '/js/game.js',
        '/js/memory.js',
        '/js/compas.js',
        '/rhythm.html',
        '/js/rhythm.js',
        '/clave-sol.html',
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
      } else {
        // Cache-first cuando la versión no ha cambiado
        const cached = await caches.match(request);
        if (cached) return cached;
        const resp = await fetch(request);
        const copy = resp.clone();
        caches.open(CACHE).then(c => c.put(request, copy));
        return resp;
      }
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
      } else {
        // Cache-first si la versión no ha cambiado
        const cached = await caches.match(request);
        if (cached) return cached;
        const resp = await fetch(request);
        const copy = resp.clone();
        caches.open(CACHE).then(c => c.put(request, copy));
        return resp;
      }
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
  }
});
