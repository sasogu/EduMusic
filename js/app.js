
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
      'index.memory.title': 'Memorias de Instrumentos',
      'index.memory.desc': 'Encuentra las parejas de instrumentos reconociendo su timbre y su imagen.',
      'index.memory.small': 'Modos base y orquesta · Juegos auditivos + visuales',
      'index.compas.title': 'Puzzle de Compases',
      'index.compas.desc': 'Completa compases arrastrando fichas rítmicas.',
      'index.compas.small': '2/4, 3/4 y 4/4 · Duraciones básicas',

      // Memory game
      'memory.title': 'Memorias de Instrumentos',
      'memory.subtitle': 'Boceto interactivo: gira las cartas para descubrir instrumentos y empareja cada timbre con su imagen.',
      'memory.controls.start': 'Comenzar partida',
      'memory.controls.reset': 'Reiniciar',
      'memory.controls.audio': 'Reproducir sonidos al descubrir cartas',
      'memory.controls.mode.solo': '1 jugador',
      'memory.controls.mode.versus': '2 jugadores',
      'memory.controls.deck.label': 'Instrumentos:',
      'memory.controls.deck.standard': 'Grupo base (piano, violín…)',
      'memory.controls.deck.orchestra': 'Orquesta clásica',
      'memory.stats.matches': 'Parejas: {found}/{total}',
      'memory.stats.attempts': 'Intentos: {n}',
      'memory.stats.time': 'Tiempo: {t}',
      'memory.stats.turn': 'Turno: Jugador {n}',
      'memory.stats.scores': 'Marcador — J1: {p1} · J2: {p2}',
      'memory.card.listen': 'Escucha',
      'memory.message.ready': 'Nueva partida: ¡mucha suerte!',
      'memory.message.match': '¡Bien! Emparejaste {name}.',
      'memory.message.match.turn': '¡Bien! Emparejaste {name}. Continúa Jugador {n}.',
      'memory.message.try': 'Intenta de nuevo, escucha con atención.',
      'memory.message.win': '¡Tablero completo! Intentos: {attempts} · Tiempo: {time}',
      'memory.message.win.p1': '¡Victoria del Jugador 1! Intentos: {attempts} · J1: {p1} · J2: {p2} · Tiempo: {time}',
      'memory.message.win.p2': '¡Victoria del Jugador 2! Intentos: {attempts} · J1: {p1} · J2: {p2} · Tiempo: {time}',
      'memory.message.win.tie': '¡Empate! Intentos: {attempts} · J1: {p1} · J2: {p2} · Tiempo: {time}',

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
      'game.solmi.level.label': 'Nivel:',
      'game.solmi.level.basic': 'Nivel 1 · Colores',
      'game.solmi.level.advanced': 'Nivel 2 · Notas negras',
      'game.solmila.title': 'Atrapa Notas: Sol, Mi y La',
      'game.solmila.instructions': 'Las notas (MI, SOL y LA) avanzan de izquierda a derecha sobre sus posiciones en el pentagrama. Pulsa la tecla correspondiente del piano inferior antes de que la nota salga por la derecha. Si fallas, pierdes una vida. A partir de 10 puntos se ocultan los nombres sobre las notas y a partir de 20 también los del teclado. Teclado: S = Sol, M = Mi, L = La.',
      'game.solmila.level.label': 'Nivel:',
      'game.solmila.level.basic': 'Nivel 1 · Colores',
      'game.solmila.level.advanced': 'Nivel 2 · Notas negras',
      'game.solmilado.title': 'Atrapa Notas: Sol, Mi, La y Do grave',
      'game.solmilado.instructions': 'Las notas (DO grave, MI, SOL y LA) avanzan de izquierda a derecha respetando sus posiciones en el pentagrama. Pulsa la tecla correspondiente del piano inferior antes de que la nota salga por la derecha. Si fallas, pierdes una vida. A partir de 10 puntos se ocultan los nombres sobre las notas y a partir de 20 también los del teclado. Teclado: D = Do, M = Mi, S = Sol, L = La.',
      'game.solmilado.level.label': 'Nivel:',
      'game.solmilado.level.basic': 'Nivel 1 · Colores',
      'game.solmilado.level.advanced': 'Nivel 2 · Notas negras',
      'game.piano_hint.solmi': 'Pulsa MI o SOL en el piano',
      'game.piano_hint.solmila': 'Pulsa MI, SOL o LA en el piano',
      'game.piano_hint.solmilado': 'Pulsa DO, MI, SOL o LA en el piano',
      // Compás puzzle
      'compas.title': 'Puzzle de Compases',
      'compas.instructions': 'Arrastra las fichas rítmicas al compás objetivo hasta completar el número de tiempos indicado. Puedes devolver fichas al área inicial si te equivocas.',
      'compas.controls.new': 'Nuevo puzzle',
      'compas.controls.check': 'Comprobar',
      'compas.controls.reset': 'Reiniciar',
      'compas.available.title': 'Fichas disponibles',
      'compas.available.hint': 'Arrastra hacia el compás',
      'compas.target.title': 'Compás objetivo',
      'compas.target.progress': 'Tiempos utilizados:',
      'compas.target.info': 'Compás de {meter} · {beats} tiempos',
      'compas.metrics.solved': 'Resueltos:',
      'compas.metrics.streak': 'Racha actual:',
      'compas.back': 'Volver al inicio',
      'compas.tile.duration': 'Duración: {n} tiempos',
      'compas.tiles.negra': 'Negra (1 tiempo)',
      'compas.tiles.titi': 'Dos corcheas (1 tiempo)',
      'compas.tiles.corchea': 'Corchea (1/2 tiempo)',
      'compas.tiles.corcheaRest': 'Silencio de corchea (1/2 tiempo)',
      'compas.tiles.dottedQuarter': 'Negra con puntillo (1,5 tiempos)',
      'compas.tiles.half': 'Blanca (2 tiempos)',
      'compas.tiles.quarterRest': 'Silencio de negra (1 tiempo)',
      'compas.tiles.semicorcheas': 'Cuatro semicorcheas (1 tiempo)',
      'compas.feedback.empty': 'Añade fichas al compás para empezar.',
      'compas.feedback.perfect': '¡Muy bien! Has completado el compás.',
      'compas.feedback.tooMuch': 'Te has pasado de tiempos. Retira alguna ficha.',
      'compas.feedback.missing': 'Todavía faltan tiempos por completar.',
      // Melody sequence
      'index.melody.title': 'Secuencia de Melodías',
      'index.melody.desc': 'Escucha, memoriza y repite las notas en el teclado virtual.',
      'index.melody.small': 'Estilo “Simon dice” · Teclado interactivo · Pentagrama',
      'melody.title': 'Secuencia de Melodías',
      'melody.instructions': 'Escucha la secuencia de notas en el pentagrama y repítela en el teclado virtual. Cada ronda añade una nota nueva. Teclado: D = Do, R = Re, M = Mi, F = Fa, S = Sol, L = La, B = Si, C = Do agudo.',
      'melody.controls.start': 'Iniciar',
      'melody.controls.repeat': 'Repetir secuencia',
      'melody.controls.reset': 'Reiniciar',
      'melody.round': 'Ronda:',
      'melody.best': 'Mejor racha:',
      'melody.back': 'Volver al inicio',
      'melody.status.ready': 'Pulsa Iniciar para escuchar la secuencia.',
      'melody.status.listening': 'Escucha la secuencia…',
      'melody.status.turn': 'Tu turno: reproduce la secuencia.',
      'melody.status.keep_going': '¡Bien! Sigue con la secuencia.',
      'melody.status.round_complete': '¡Genial! Se añade una nota más.',
      'melody.status.unlock': '¡Nueva nota desbloqueada: {note}! ',
      'melody.status.fail': 'Se rompió la secuencia. Pulsa Iniciar para intentarlo de nuevo.',
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
      'index.rhythm.small': 'Identifica patrones rítmicos · Ta, Su y Titi',

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
      'index.memory.title': 'Memòries d\'Instruments',
      'index.memory.desc': 'Troba les parelles d\'instruments reconeixent el seu timbre i la seua imatge.',
      'index.memory.small': 'Modes base i orquestra · Jocs auditius + visuals',
      'index.compas.title': 'Puzzle de Compassos',
      'index.compas.desc': 'Completa compassos arrossegant fitxes rítmiques.',
      'index.compas.small': '2/4, 3/4 i 4/4 · Duracions bàsiques',
      'index.melody.title': 'Seqüència de Melodies',
      'index.melody.desc': 'Escolta, memoritza i repeteix les notes amb el teclat virtual.',
      'index.melody.small': 'Estil “Simon says” · Teclat interactiu · Pentagrama',

      // Memory game
      'memory.title': 'Memòries d\'Instruments',
      'memory.subtitle': 'Esbós interactiu: gira les cartes per descobrir instruments i emparellar el timbre amb la seua imatge.',
      'memory.controls.start': 'Comença partida',
      'memory.controls.reset': 'Reinicia',
      'memory.controls.audio': 'Reprodueix sons en descobrir cartes',
      'memory.controls.mode.solo': '1 jugador',
      'memory.controls.mode.versus': '2 jugadors',
      'memory.controls.deck.label': 'Instruments:',
      'memory.controls.deck.standard': 'Grup base (piano, violí…)',
      'memory.controls.deck.orchestra': 'Orquestra clàssica',
      'memory.stats.matches': 'Parelles: {found}/{total}',
      'memory.stats.attempts': 'Intents: {n}',
      'memory.stats.time': 'Temps: {t}',
      'memory.stats.turn': 'Torn: Jugador {n}',
      'memory.stats.scores': 'Marcador — J1: {p1} · J2: {p2}',
      'memory.card.listen': 'Escolta',
      'memory.message.ready': 'Nova partida: molta sort!',
      'memory.message.match': 'Bon colp! Has emparellat {name}.',
      'memory.message.match.turn': 'Bon colp! Has emparellat {name}. Continua el Jugador {n}.',
      'memory.message.try': 'Torna-ho a provar, escolta amb atenció.',
      'memory.message.win': 'Tauler complet! Intents: {attempts} · Temps: {time}',
      'memory.message.win.p1': 'Victòria del Jugador 1! Intents: {attempts} · J1: {p1} · J2: {p2} · Temps: {time}',
      'memory.message.win.p2': 'Victòria del Jugador 2! Intents: {attempts} · J1: {p1} · J2: {p2} · Temps: {time}',
      'memory.message.win.tie': 'Empat! Intents: {attempts} · J1: {p1} · J2: {p2} · Temps: {time}',

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
      'game.solmi.level.label': 'Nivell:',
      'game.solmi.level.basic': 'Nivell 1 · Colors',
      'game.solmi.level.advanced': 'Nivell 2 · Notes negres',
      'game.solmila.title': 'Atrapa Notes: Sol, Mi i La',
      'game.solmila.instructions': 'Les notes (MI, SOL i LA) avancen d’esquerra a dreta per les seues posicions al pentagrama. Prem la tecla corresponent del piano inferior abans que la nota isca per la dreta. Si falles, perds una vida. A partir de 10 punts s’oculten els noms damunt de les notes i a partir de 20 també els del teclat. Teclat: S = Sol, M = Mi, L = La.',
      'game.solmila.level.label': 'Nivell:',
      'game.solmila.level.basic': 'Nivell 1 · Colors',
      'game.solmila.level.advanced': 'Nivell 2 · Notes negres',
      'game.solmilado.title': 'Atrapa Notes: Sol, Mi, La i Do greu',
      'game.solmilado.instructions': 'Les notes (DO greu, MI, SOL i LA) avancen d’esquerra a dreta respectant les seues posicions al pentagrama. Prem la tecla corresponent del piano inferior abans que la nota isca per la dreta. Si falles, perds una vida. A partir de 10 punts s’oculten els noms damunt de les notes i a partir de 20 també els del teclat. Teclat: D = Do, M = Mi, S = Sol, L = La.',
      'game.solmilado.level.label': 'Nivell:',
      'game.solmilado.level.basic': 'Nivell 1 · Colors',
      'game.solmilado.level.advanced': 'Nivell 2 · Notes negres',
      'game.piano_hint.solmi': 'Prem MI o SOL al piano',
      'game.piano_hint.solmila': 'Prem MI, SOL o LA al piano',
      'game.piano_hint.solmilado': 'Prem DO, MI, SOL o LA al piano',
      // Puzzle de compassos
      'compas.title': 'Puzzle de Compassos',
      'compas.instructions': 'Arrossega les fitxes rítmiques al compàs objectiu fins completar els temps indicats. Pots tornar fitxes a l\'àrea inicial si t\'equivoques.',
      'compas.controls.new': 'Nou puzzle',
      'compas.controls.check': 'Comprovar',
      'compas.controls.reset': 'Reiniciar',
      'compas.available.title': 'Fitxes disponibles',
      'compas.available.hint': 'Arrossega cap al compàs',
      'compas.target.title': 'Compàs objectiu',
      'compas.target.progress': 'Temps utilitzats:',
      'compas.target.info': 'Compàs de {meter} · {beats} temps',
      'compas.metrics.solved': 'Resolts:',
      'compas.metrics.streak': 'Ratxa actual:',
      'compas.back': 'Torna a l\'inici',
      'compas.tile.duration': 'Duració: {n} temps',
      'compas.tiles.negra': 'Negra (1 temps)',
      'compas.tiles.titi': 'Dos corxeres (1 temps)',
      'compas.tiles.corchea': 'Corxera (1/2 temps)',
      'compas.tiles.corcheaRest': 'Silenci de corxera (1/2 temps)',
      'compas.tiles.dottedQuarter': 'Negra amb puntet (1,5 temps)',
      'compas.tiles.half': 'Blanca (2 temps)',
      'compas.tiles.quarterRest': 'Silenci de negra (1 temps)',
      'compas.tiles.semicorcheas': 'Quatre semicorxeres (1 temps)',
      'compas.feedback.empty': 'Afig fitxes al compàs per a començar.',
      'compas.feedback.perfect': 'Molt bé! Has completat el compàs.',
      'compas.feedback.tooMuch': 'T\'has passat de temps. Lleva alguna fitxa.',
      'compas.feedback.missing': 'Encara falten temps per completar.',
      'melody.title': 'Seqüència de Melodies',
      'melody.instructions': 'Escolta la seqüència de notes en el pentagrama i repeteix-la en el teclat virtual. Cada ronda afegeix una nota nova. Teclat: D = Do, R = Re, M = Mi, F = Fa, S = Sol, L = La, B = Si, C = Do agut.',
      'melody.controls.start': 'Inicia',
      'melody.controls.repeat': 'Repetir seqüència',
      'melody.controls.reset': 'Reinicia',
      'melody.round': 'Ronda:',
      'melody.best': 'Millor ratxa:',
      'melody.back': 'Torna a l\'inici',
      'melody.status.ready': 'Prem Inicia per a escoltar la seqüència.',
      'melody.status.listening': 'Escolta la seqüència…',
      'melody.status.turn': 'El teu torn: reprodueix la seqüència.',
      'melody.status.keep_going': 'Molt bé! Continua amb la seqüència.',
      'melody.status.round_complete': 'Genial! Afegim una nota més.',
      'melody.status.unlock': 'Nova nota desbloquejada: {note}!',
      'melody.status.fail': 'La seqüència s\'ha trencat. Prem Inicia per a tornar-ho a provar.',
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
      'index.rhythm.small': 'Modo bàsic: TA i SU · Activable TITI',

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
