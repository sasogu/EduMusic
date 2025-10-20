
const LEADERBOARD_DEFAULT = {
  /**
   * Ruta base del API en producción (relativa al sitio).
   * Ajusta este valor si despliegas el backend en otra ubicación.
   */
  baseUrl: 'leaderboard',
  /**
   * Clave API compartida con el backend PHP (ver server/leaderboard/config/db.php).
   * Sustituye por una cadena larga y aleatoria tras el despliegue.
   */
  apiKey: 'reemplaza_esta_api_key',
};

(function bootstrapLeaderboardConfig() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  const existing =
    window.EduMusicLeaderboard
    || window.ScoreServiceRemoteConfig
    || window.ScoreServiceRemote
    || {};
  const configured = { ...existing };
  const docEl = document.documentElement;
  const pick = (el, attr) => (!el || !el.getAttribute) ? null : el.getAttribute(attr);
  const trimmed = (value) => (typeof value === 'string' ? value.trim() : '');
  const baseAttr = trimmed(pick(docEl, 'data-leaderboard-base') || pick(docEl, 'data-leaderboard'));
  const keyAttr = trimmed(pick(docEl, 'data-leaderboard-key'));
  const metaBaseEl = document.querySelector('meta[name="edumusic:leaderboard:base"]');
  const metaKeyEl = document.querySelector('meta[name="edumusic:leaderboard:key"]');
  const metaBase = trimmed(pick(metaBaseEl, 'content'));
  const metaKey = trimmed(pick(metaKeyEl, 'content'));

  if (!configured.supabaseUrl) {
    configured.supabaseUrl = baseAttr || metaBase || LEADERBOARD_DEFAULT.baseUrl;
  }
  if (!configured.supabaseAnonKey) {
    const key = keyAttr || metaKey || LEADERBOARD_DEFAULT.apiKey;
    if (key) configured.supabaseAnonKey = key;
  }

  window.EduMusicLeaderboard = configured;
  window.ScoreServiceRemoteConfig = configured;
})();

function ensureLangSwitcher() {
  if (document.getElementById('langSelect')) return document.getElementById('langSelect');
  const host = document.querySelector('[data-lang-switch]');
  if (!host) return null;
  host.id = host.id || 'langCtrl';
  host.classList.add('lang-switch');
  host.innerHTML = `
    <label for="langSelect" data-i18n="lang.label">Idioma:</label>
    <select id="langSelect">
      <option value="es" data-i18n="lang.es">Español</option>
      <option value="val" data-i18n="lang.val">Valencià</option>
      <option value="en" data-i18n="lang.en">English</option>
    </select>
  `;
  return host.querySelector('#langSelect');
}

function ensureSwFooter() {
  if (document.getElementById('swVersion')) return document.getElementById('swVersion');
  const host = document.querySelector('[data-sw-status]');
  if (!host) return null;
  host.classList.add('page-footer');
  host.innerHTML = `
    <span data-i18n="sw.label">Service Worker:</span>
    <span id="swVersion">cargando…</span>
    <button id="swUpdateBtn" class="sw-update-btn" style="display:none;">Actualizar</button>
  `;
  return host.querySelector('#swVersion');
}

// --- Service Worker helpers (moved from HTML) ---
(function() {
  // Keep a small state so i18n changes can re-render correctly
  let swState = { kind: 'loading', version: null };
  function renderSW() {
    ensureSwFooter();
    var el = document.getElementById('swVersion');
    if (!el) return;
    var i18n = window.i18n;
    if (swState.kind === 'version' && swState.version) {
      el.textContent = swState.version;
    } else if (swState.kind === 'insecure') {
      // Not a secure context: SW cannot register. Show helpful message.
      el.textContent = (i18n && i18n.t('sw.status.insecure')) || 'requiere HTTPS o localhost';
    } else if (swState.kind === 'unsupported') {
      el.textContent = (i18n && i18n.t('sw.status.unsupported')) || 'no soportado';
    } else if (swState.kind === 'disabled') {
      el.textContent = (i18n && i18n.t('sw.status.disabled')) || 'sin SW';
    } else if (swState.kind === 'unavailable') {
      el.textContent = (i18n && i18n.t('sw.status.unavailable')) || 'no disponible';
    } else {
      el.textContent = (i18n && i18n.t('sw.loading')) || 'cargando…';
    }
  }
  function setSWState(kind, version) {
    swState = { kind, version: version || null };
    renderSW();
  }

  async function getSWVersion(reg) {
    try {
      var sw = (navigator.serviceWorker && navigator.serviceWorker.controller) || (reg && (reg.active || reg.waiting || reg.installing));
      if (!sw || !sw.postMessage) return null;
      return await new Promise((resolve) => {
        var mc = new MessageChannel();
        var timer = setTimeout(() => resolve(null), 1500);
        mc.port1.onmessage = function(e) {
          clearTimeout(timer);
          var d = e.data || {};
          if (d && d.type === 'VERSION') resolve(d.version || d.cache || null);
          else resolve(null);
        };
        try { sw.postMessage({ type: 'GET_VERSION' }, [mc.port2]); } catch (e) { resolve(null); }
      });
    } catch (_) { return null; }
  }

  function setupSW() {
    // Initial placeholder
    setSWState('loading');
    if (!window.isSecureContext) {
      setSWState('insecure');
      return;
    }
    if (!('serviceWorker' in navigator)) {
      setSWState('unsupported');
      return;
    }
    const boot = async () => {
      try {
        const manifestLink = document.querySelector('link[rel="manifest"]');
        const baseHref = manifestLink ? manifestLink.href : window.location.href;
        const swUrl = new URL('service-worker.js', baseHref);
        const reg = await navigator.serviceWorker.register(swUrl.href);
        // Wait until the SW is active and ready
        const ready = await navigator.serviceWorker.ready;
        // Try to ask the active controller first (after claim), then the ready registration
        let version = await getSWVersion(ready);
        if (!version && navigator.serviceWorker.controller) {
          version = await getSWVersion({ active: navigator.serviceWorker.controller });
        }
        if (version) setSWState('version', version);
        else setSWState('unavailable');
        // Re-check when controller changes (e.g., after update)
        navigator.serviceWorker.addEventListener('controllerchange', async () => {
          const v2 = await getSWVersion(ready);
          if (v2) setSWState('version', v2);
        });

        // Listen messages that may indicate update available
        navigator.serviceWorker.addEventListener('message', (ev) => {
          const d = ev.data || {};
          if (d && d.type === 'VERSION' && d.version) {
            // If version differs from current displayed, show update button
            const btn = document.getElementById('swUpdateBtn');
            const verEl = document.getElementById('swVersion');
            const cur = verEl ? verEl.textContent : null;
            if (btn && cur && cur !== d.version) {
              btn.style.display = '';
              btn.textContent = 'Actualizar';
              btn.onclick = function() {
                try {
                  // Ask SW to skipWaiting
                  if (navigator.serviceWorker.controller && navigator.serviceWorker.controller.postMessage) {
                    navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
                  }
                } catch (e) {}
                // reload to let the new SW take control when activated
                setTimeout(() => { window.location.reload(); }, 800);
              };
            }
          }
        });
      } catch (e) {
        setSWState('disabled');
      }
    };
    // Register as soon as DOM is ready so footer exists
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
    else boot();
  }

  setupSW();
  // Re-render on language change if available
  (function waitI18n() {
    if (window.i18n && typeof window.i18n.onChange === 'function') {
      window.i18n.onChange(() => renderSW());
    } else {
      setTimeout(waitI18n, 100);
    }
  })();
})();
// --- Simple i18n engine (es + val + en) ---
(function() {
  const baseDict = {
    es: {
      'sw.label': 'Service Worker:',
      'sw.loading': 'cargando…',
      'sw.status.unsupported': 'no soportado',
      'sw.status.insecure': 'requiere HTTPS o localhost',
      'sw.status.unavailable': 'no disponible',
      'sw.status.disabled': 'sin SW',
      'lang.label': '',
      'lang.es': 'Español',
      'lang.val': 'Valencià',
      'lang.en': 'English',
      'gamehub.back': 'Volver al inicio',
      'game.back': 'Volver al inicio'
    },
    val: {
      'sw.label': 'Service Worker:',
      'sw.loading': 'carregant…',
      'sw.status.unsupported': 'no compatible',
      'sw.status.insecure': 'requereix HTTPS o localhost',
      'sw.status.unavailable': 'no disponible',
      'sw.status.disabled': 'sense SW',
      'lang.label': '',
      'lang.es': 'Castellà',
      'lang.val': 'Valencià',
      'lang.en': 'Anglés',
      'gamehub.back': "Torna a l'inici",
      'game.back': "Torna a l'inici"
    },
    en: {
      'sw.label': 'Service Worker:',
      'sw.loading': 'loading…',
      'sw.status.unsupported': 'not supported',
      'sw.status.insecure': 'requires HTTPS or localhost',
      'sw.status.unavailable': 'unavailable',
      'sw.status.disabled': 'no SW',
      'lang.label': '',
      'lang.es': 'Spanish',
      'lang.val': 'Valencian',
      'lang.en': 'English',
      'gamehub.back': 'Back to home',
      'game.back': 'Back to home'
    }
  };

  const dict = {
    es: { ...baseDict.es },
    val: { ...baseDict.val },
    en: { ...baseDict.en }
  };

  const registeredBundles = new Set(['__base']);
  const listeners = [];
  let applyQueued = false;

  function mergeEntries(payload) {
    if (!payload) return;
    if (payload.es && typeof payload.es === 'object') Object.assign(dict.es, payload.es);
    if (payload.val && typeof payload.val === 'object') Object.assign(dict.val, payload.val);
    if (payload.en && typeof payload.en === 'object') Object.assign(dict.en, payload.en);
  }

  function format(str, params) {
    if (!params) return str;
    return str.replace(/\{(\w+)\}/g, (_, k) => (params[k] != null ? String(params[k]) : ''));
  }

  let current = (typeof localStorage !== 'undefined' && (localStorage.getItem('lang') || 'val')) || 'val';

  function queueApply() {
    if (applyQueued) return;
    applyQueued = true;
    const run = () => {
      applyQueued = false;
      apply();
    };
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', run, { once: true });
    } else {
      Promise.resolve().then(run);
    }
  }

  function t(key, params) {
    const langOrder = [
      current,
      current !== 'en' ? 'en' : null,
      current !== 'es' ? 'es' : null,
      current !== 'val' ? 'val' : null
    ].filter(Boolean);
    let raw;
    for (let i = 0; i < langOrder.length; i++) {
      const lang = langOrder[i];
      if (dict[lang] && Object.prototype.hasOwnProperty.call(dict[lang], key)) {
        raw = dict[lang][key];
        break;
      }
    }
    if (raw == null) raw = key;
    return format(raw, params);
  }

  function setLang(code) {
    current = (code === 'val') ? 'val' : (code === 'en' ? 'en' : 'es');
    try { localStorage.setItem('lang', current); } catch {}
    try {
      document.documentElement.lang = current === 'val' ? 'ca' : (current === 'en' ? 'en' : 'es');
    } catch {}
    apply();
    for (const fn of listeners) { try { fn(current); } catch {} }
  }

  function getLang() { return current; }
  function onChange(fn) { if (typeof fn === 'function') listeners.push(fn); }

  function apply(root) {
    const scope = root || document;
    if (!scope || !scope.querySelectorAll) return;
    const nodes = scope.querySelectorAll('[data-i18n]');
    nodes.forEach((el) => {
      const key = el.getAttribute('data-i18n');
      const attr = el.getAttribute('data-i18n-attr');
      const text = t(key);
      if (attr) {
        el.setAttribute(attr, text);
      } else {
        el.textContent = text;
      }
    });
    const sel = document.getElementById('langSelect');
    if (sel) sel.value = current;
  }

  function registerBundle(name, payload) {
    if (!payload) return;
    if (name && registeredBundles.has(name)) return;
    mergeEntries(payload);
    if (name) registeredBundles.add(name);
    queueApply();
  }

  window.i18n = { t, setLang, getLang, onChange, apply, registerBundle };
  if (Array.isArray(window.__i18nPendingBundles)) {
    window.__i18nPendingBundles.forEach((entry) => {
      if (entry && entry.payload) registerBundle(entry.name, entry.payload);
    });
    window.__i18nPendingBundles.length = 0;
  }

  function init() {
    const sel = ensureLangSwitcher();
    ensureSwFooter();
    document.documentElement.lang = current === 'val' ? 'ca' : (current === 'en' ? 'en' : 'es');
    apply();
    if (sel) sel.addEventListener('change', () => setLang(sel.value));
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
