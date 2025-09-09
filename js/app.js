
// --- Service Worker helpers (moved from HTML) ---
(function() {
  // Keep a small state so i18n changes can re-render correctly
  let swState = { kind: 'loading', version: null };
  function renderSW() {
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
        const reg = await navigator.serviceWorker.register('service-worker.js');
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
// --- Simple i18n engine (es + val) ---
(function() {
  const dict = {
    es: {
      // SW footer
      'sw.label': 'Service Worker:',
      'sw.loading': 'cargando…',
      'sw.status.unsupported': 'no soportado',
      'sw.status.insecure': 'requiere HTTPS o localhost',
      'sw.status.unavailable': 'no disponible',
      'sw.status.disabled': 'sin SW',
      'lang.label': 'Idioma:',
      'lang.es': 'Español',
      'lang.val': 'Valencià',

      // Index
      'index.choose': 'Selecciona una actividad para empezar:',
      'index.card.title': 'Atrapa Notas: MI y SOL',
      'index.card.desc': 'Pulsa las teclas del piano para atrapar las notas en el pentagrama.',
      'index.card.small': 'Dificultad progresiva · Ranking online',

      // Game page static
      'game.title': 'Atrapa Notas: Sol y Mi',
      'game.instructions': 'Las notas (MI y SOL) avanzan de izquierda a derecha sobre su línea del pentagrama — SOL en 2ª línea y MI en 1ª (abajo). Pulsa la tecla correspondiente del piano inferior antes de que la nota salga por la derecha. Si te equivocas de nombre (respecto a la nota que va delante), pierdes una vida. A partir de 10 puntos, se oculta el nombre sobre la nota; a partir de 20, también se ocultan los nombres en el teclado. Teclado: S = Sol, M = Mi.',
      'game.back': 'Volver al inicio',
      'game.ranking': 'Ranking',
      'game.save.your_score': 'Tu puntuación:',
      'game.save.your_name': 'Tu nombre:',
      'game.save.placeholder': 'Escribe tu nombre',
      'game.save.button': 'Guardar puntuación',

      // HUD + controls
      'hud.points': 'Puntos: {n}',
      'hud.lives': 'Vidas: {n}',
      'hud.start': 'Iniciar',
      'hud.pause': 'Pausa',
      'hud.restart': 'Reiniciar',
      'hud.speed': 'Velocidad:',
      'hud.speed.slow': 'Lento',
      'hud.speed.normal': 'Normal',
      'hud.speed.fast': 'Rápido',

      // In-canvas and game messages
      'game.piano_hint': 'Pulsa MI o SOL en el piano',
      'game.overlay.over': 'Juego terminado',
      'game.overlay.over_sub': 'Pulsa Reiniciar para jugar de nuevo',
      'game.overlay.pause': 'Pausa',
      'game.overlay.pause_sub': 'Pulsa Pausa para continuar',
      'game.rank.empty': 'Aún no hay puntuaciones. ¡Sé el primero!',
      'game.rank.pts': 'pts',
    },
    val: {
      // SW footer
      'sw.label': 'Service Worker:',
      'sw.loading': 'carregant…',
      'sw.status.unsupported': 'no compatible',
      'sw.status.insecure': 'requereix HTTPS o localhost',
      'sw.status.unavailable': 'no disponible',
      'sw.status.disabled': 'sense SW',
      'lang.label': 'Idioma:',
      'lang.es': 'Castellà',
      'lang.val': 'Valencià',

      // Index
      'index.choose': 'Selecciona una activitat per a començar:',
      'index.card.title': 'Atrapa Notes: MI i SOL',
      'index.card.desc': 'Prem les tecles del piano per a atrapar les notes en el pentagrama.',
      'index.card.small': 'Dificultat progressiva · Rànquing en línia',

      // Game page static
      'game.title': 'Atrapa Notes: Sol i Mi',
      'game.instructions': 'Les notes (MI i SOL) avancen d’esquerra a dreta per la seua línia del pentagrama — SOL en la 2a línia i MI en la 1a (baix). Prem la tecla corresponent del piano inferior abans que la nota isca per la dreta. Si t’equivoques de nom (respecte a la nota que va davant), perds una vida. A partir de 10 punts, s’oculta el nom damunt de la nota; a partir de 20, també s’oculten els noms del teclat. Teclat: S = Sol, M = Mi.',
      'game.back': "Torna a l'inici",
      'game.ranking': 'Rànquing',
      'game.save.your_score': 'La teua puntuació:',
      'game.save.your_name': 'El teu nom:',
      'game.save.placeholder': 'Escriu el teu nom',
      'game.save.button': 'Guarda la puntuació',

      // HUD + controls
      'hud.points': 'Punts: {n}',
      'hud.lives': 'Vides: {n}',
      'hud.start': 'Inicia',
      'hud.pause': 'Pausa',
      'hud.restart': 'Reinicia',
      'hud.speed': 'Velocitat:',
      'hud.speed.slow': 'Lent',
      'hud.speed.normal': 'Normal',
      'hud.speed.fast': 'Ràpid',

      // In-canvas and game messages
      'game.piano_hint': 'Prem MI o SOL al piano',
      'game.overlay.over': 'Joc acabat',
      'game.overlay.over_sub': 'Prem Reinicia per a jugar de nou',
      'game.overlay.pause': 'Pausa',
      'game.overlay.pause_sub': 'Prem Pausa per a continuar',
      'game.rank.empty': 'Encara no hi ha puntuacions. Sigues el primer!',
      'game.rank.pts': 'pts',
    }
  };

  function format(str, params) {
    if (!params) return str;
    return str.replace(/\{(\w+)\}/g, (_, k) => (params[k] != null ? String(params[k]) : ''));
  }

  let current = (typeof localStorage !== 'undefined' && (localStorage.getItem('lang') || 'es')) || 'es';
  const listeners = [];
  function t(key, params) {
    const d = dict[current] || dict.es;
    const raw = d[key] || (dict.es[key] || key);
    return format(raw, params);
  }
  function setLang(code) {
    current = (code === 'val') ? 'val' : 'es';
    try { localStorage.setItem('lang', current); } catch {}
    try { document.documentElement.lang = current === 'val' ? 'ca' : 'es'; } catch {}
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

  window.i18n = { t, setLang, getLang, onChange, apply };

  // Initialize on DOM ready
  function init() {
    document.documentElement.lang = current === 'val' ? 'ca' : 'es';
    apply();
    const sel = document.getElementById('langSelect');
    if (sel) sel.addEventListener('change', () => setLang(sel.value));
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
