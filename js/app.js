
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
      'index.card.title': 'Atrapa Notas',
      'index.card.desc': 'Elige un reto para atrapar notas en el pentagrama.',
      'index.card.small': 'Disponibles: Sol & Mi · Sol, Mi y La · Sol, Mi, La y Do',

      // Atrapa Notas hub
      'gamehub.title': 'Atrapa Notas',
      'gamehub.intro': 'Elige un reto para atrapar notas en el pentagrama.',
      'gamehub.solmi.title': 'Sol y Mi',
      'gamehub.solmi.desc': 'Pulsa las teclas correspondientes para atrapar las notas SOL y MI.',
      'gamehub.solmi.small': 'Dificultad progresiva · Ranking online',
      'gamehub.solmila.title': 'Sol, Mi y La',
      'gamehub.solmila.desc': 'Añade la nota LA al reto y mantén la precisión en el pentagrama.',
      'gamehub.solmila.small': 'Tres notas · Misma dinámica de juego',
      'gamehub.solmilado.title': 'Sol, Mi, La y Do',
      'gamehub.solmilado.desc': 'Incluye el DO grave y trabaja con líneas adicionales del pentagrama.',
      'gamehub.solmilado.small': 'Cuatro notas · Lectura con líneas adicionales',
      'gamehub.coming.title': 'Próximamente',
      'gamehub.coming.desc': 'Más niveles de atrapar notas se añadirán aquí.',
      'gamehub.coming.small': 'Sugerencias bienvenidas',
      'gamehub.back': 'Volver al inicio',
      'game.solmi.back': 'Volver a Atrapa Notas',
      'game.solmi.title': 'Atrapa Notas: Sol y Mi',
      'game.solmi.instructions': 'Las notas (MI y SOL) avanzan de izquierda a derecha sobre su línea del pentagrama — SOL en 2ª línea y MI en 1ª (abajo). Pulsa la tecla correspondiente del piano inferior antes de que la nota salga por la derecha. Si te equivocas de nombre (respecto a la nota que va delante), pierdes una vida. A partir de 10 puntos, se oculta el nombre sobre la nota; a partir de 20, también se ocultan los nombres en el teclado. Teclado: S = Sol, M = Mi.',
      'game.solmila.title': 'Atrapa Notas: Sol, Mi y La',
      'game.solmila.instructions': 'Las notas (MI, SOL y LA) avanzan de izquierda a derecha sobre sus posiciones en el pentagrama. Pulsa la tecla correspondiente del piano inferior antes de que la nota salga por la derecha. Si fallas, pierdes una vida. A partir de 10 puntos se ocultan los nombres sobre las notas y a partir de 20 también los del teclado. Teclado: S = Sol, M = Mi, L = La.',
      'game.solmilado.title': 'Atrapa Notas: Sol, Mi, La y Do grave',
      'game.solmilado.instructions': 'Las notas (DO grave, MI, SOL y LA) avanzan de izquierda a derecha respetando sus posiciones en el pentagrama. Pulsa la tecla correspondiente del piano inferior antes de que la nota salga por la derecha. Si fallas, pierdes una vida. A partir de 10 puntos se ocultan los nombres sobre las notas y a partir de 20 también los del teclado. Teclado: D = Do, M = Mi, S = Sol, L = La.',
      'game.piano_hint.solmi': 'Pulsa MI o SOL en el piano',
      'game.piano_hint.solmila': 'Pulsa MI, SOL o LA en el piano',
      'game.piano_hint.solmilado': 'Pulsa DO, MI, SOL o LA en el piano',
      // Clef card
      'index.clef.title': 'Dibuja la Clave de Sol',
      'index.clef.desc': 'Sigue los puntos y traza la clave, rodeando la línea de SOL.',

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

      // Rhythm game
      'rhythm.title': 'Ritmo: TA, SU (y TITI)',
      'rhythm.instructions': 'Identifica patrones rítmicos de una negra (TA) y silencio (SU). A partir de 10 puntos se añade TITI (dos corcheas).',
      'rhythm.play': 'Repetir',
      'rhythm.play_hint': 'Vuelve a escuchar el patrón actual',
      'rhythm.include_titi': 'Incluir TITI',
      'rhythm.level': 'Nivel:',
      'rhythm.level1': 'Nivel 1',
      'rhythm.level2': 'Nivel 2',
      'rhythm.level3': 'Nivel 3',

      // Clef page
      'clef.title': 'Dibuja la Clave de Sol',
      'clef.instructions': 'Traza con el dedo o el ratón siguiendo los puntos guía para dibujar la clave de sol. Intenta rodear la 2ª línea (la línea de SOL). Pulsa Evaluar para comprobar tu dibujo.',
      'clef.reset': 'Borrar',
      'clef.evaluate': 'Evaluar',
      'clef.show_guides': 'Mostrar guía',
      'clef.result.good': '¡Muy bien! Buena forma de clave de sol.',
      'clef.result.near': 'Casi. Recorre mejor los puntos guía.',
      'clef.result.try': 'Intenta de nuevo siguiendo la guía.',
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
      'index.card.title': 'Atrapa Notes',
      'index.card.desc': 'Tria un repte per a atrapar notes en el pentagrama.',
      'index.card.small': 'Disponibles: Sol i Mi · Sol, Mi i La · Sol, Mi, La i Do',

      // Atrapa Notes hub
      'gamehub.title': 'Atrapa Notes',
      'gamehub.intro': 'Tria un repte per a atrapar notes en el pentagrama.',
      'gamehub.solmi.title': 'Sol i Mi',
      'gamehub.solmi.desc': 'Prem les tecles corresponents per a atrapar les notes SOL i MI.',
      'gamehub.solmi.small': 'Dificultat progressiva · Rànquing en línia',
      'gamehub.solmila.title': 'Sol, Mi i La',
      'gamehub.solmila.desc': 'Afig la nota LA al repte i mantén la precisió al pentagrama.',
      'gamehub.solmila.small': 'Tres notes · Mateixa dinàmica de joc',
      'gamehub.solmilado.title': 'Sol, Mi, La i Do',
      'gamehub.solmilado.desc': 'Inclou el DO greu i treballa amb línies addicionals del pentagrama.',
      'gamehub.solmilado.small': 'Quatre notes · Lectura amb línies addicionals',
      'gamehub.coming.title': 'Pròximament',
      'gamehub.coming.desc': 'Ací s\'afegiran nous nivells d\'Atrapa Notes.',
      'gamehub.coming.small': 'Idees benvingudes',
      'gamehub.back': 'Torna a l\'inici',
      'game.solmi.back': 'Torna a Atrapa Notes',
      'game.solmi.title': 'Atrapa Notes: Sol i Mi',
      'game.solmi.instructions': 'Les notes (MI i SOL) avancen d’esquerra a dreta per la seua línia del pentagrama — SOL en la 2a línia i MI en la 1a (baix). Prem la tecla corresponent del piano inferior abans que la nota isca per la dreta. Si t’equivoques de nom (respecte a la nota que va davant), perds una vida. A partir de 10 punts, s’oculta el nom damunt de la nota; a partir de 20, també s’oculten els noms del teclat. Teclat: S = Sol, M = Mi.',
      'game.solmila.title': 'Atrapa Notes: Sol, Mi i La',
      'game.solmila.instructions': 'Les notes (MI, SOL i LA) avancen d’esquerra a dreta per les seues posicions al pentagrama. Prem la tecla corresponent del piano inferior abans que la nota isca per la dreta. Si falles, perds una vida. A partir de 10 punts s’oculten els noms damunt de les notes i a partir de 20 també els del teclat. Teclat: S = Sol, M = Mi, L = La.',
      'game.solmilado.title': 'Atrapa Notes: Sol, Mi, La i Do greu',
      'game.solmilado.instructions': 'Les notes (DO greu, MI, SOL i LA) avancen d’esquerra a dreta respectant les seues posicions al pentagrama. Prem la tecla corresponent del piano inferior abans que la nota isca per la dreta. Si falles, perds una vida. A partir de 10 punts s’oculten els noms damunt de les notes i a partir de 20 també els del teclat. Teclat: D = Do, M = Mi, S = Sol, L = La.',
      'game.piano_hint.solmi': 'Prem MI o SOL al piano',
      'game.piano_hint.solmila': 'Prem MI, SOL o LA al piano',
      'game.piano_hint.solmilado': 'Prem DO, MI, SOL o LA al piano',
      // Clef card
      'index.clef.title': 'Dibuixa la Clau de Sol',
      'index.clef.desc': 'Segueix els punts i traça la clau, envoltant la línia de SOL.',

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

      // Rhythm game
      'rhythm.title': 'Ritme: TA, SU (i TITI)',
      'rhythm.instructions': 'Identifica patrons rítmics d’una negra (TA) i silenci (SU). A partir de 10 punts s’afegeix TITI (dos corxeres).',
      'rhythm.play': 'Repetir',
      'rhythm.play_hint': "Torna a escoltar el patró actual",
      'rhythm.include_titi': 'Incloure TITI',
      'rhythm.level': 'Nivell:',
      'rhythm.level1': 'Nivell 1',
      'rhythm.level2': 'Nivell 2',
      'rhythm.level3': 'Nivell 3',

      // Clef page
      'clef.title': 'Dibuixa la Clau de Sol',
      'clef.instructions': "Traça amb el dit o el ratolí seguint els punts guia per a dibuixar la clau de sol. Intenta envoltar la 2a línia (la línia de SOL). Prem Avaluar per a comprovar el teu dibuix.",
      'clef.reset': 'Esborrar',
      'clef.evaluate': 'Avaluar',
      'clef.show_guides': 'Mostrar guia',
      'clef.result.good': 'Molt bé! Bona forma de clau de sol.',
      'clef.result.near': 'Quasi. Recorre millor els punts guia.',
      'clef.result.try': 'Intenta-ho de nou seguint la guia.',
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
