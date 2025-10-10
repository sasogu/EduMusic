// Memory game translations
(function() {
  const payload = {
    es: {
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
      'memory.message.win.tie': '¡Empate! Intentos: {attempts} · J1: {p1} · J2: {p2} · Tiempo: {time}'
    },
    val: {
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
      'memory.message.win.tie': 'Empat! Intents: {attempts} · J1: {p1} · J2: {p2} · Temps: {time}'
    }
  };
  if (window.i18n && typeof window.i18n.registerBundle === 'function') {
    window.i18n.registerBundle('memory', payload);
  } else {
    window.__i18nPendingBundles = window.__i18nPendingBundles || [];
    window.__i18nPendingBundles.push({ name: 'memory', payload });
  }
})();
