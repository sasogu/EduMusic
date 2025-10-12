// Melody sequence translations
(function() {
  const payload = {
    es: {
      'melody.title': 'Secuencia de Melodías',
      'melody.instructions': 'Escucha la secuencia de notas en el pentagrama y repítela en el teclado virtual. Cada ronda añade una nota nueva. Teclado: D = Do, R = Re, M = Mi, F = Fa, S = Sol, L = La, B = Si, C = Do agudo.',
      'melody.controls.start': 'Iniciar',
      'melody.controls.repeat': 'Repetir secuencia',
      'melody.controls.reset': 'Reiniciar',
      'melody.round': 'Ronda:',
      'melody.best': 'Mejor racha:',
      'melody.errors': 'Errores:',
      'melody.back': 'Volver al inicio',
      'melody.status.ready': 'Pulsa Iniciar para escuchar la secuencia.',
      'melody.status.listening': 'Escucha la secuencia…',
      'melody.status.turn': 'Tu turno: reproduce la secuencia.',
      'melody.status.keep_going': '¡Bien! Sigue con la secuencia.',
      'melody.status.round_complete': '¡Genial! Se añade una nota más.',
      'melody.status.unlock': '¡Nueva nota desbloqueada: {note}!',
      'melody.status.mistake': 'Casi... Escucha de nuevo la secuencia. Errores: {errors}/{max}.',
      'melody.status.fail': 'Se rompió la secuencia. Pulsa Iniciar para intentarlo de nuevo.'
    },
    val: {
      'melody.title': 'Seqüència de Melodies',
      'melody.instructions': 'Escolta la seqüència de notes en el pentagrama i repeteix-la en el teclat virtual. Cada ronda afegeix una nota nova. Teclat: D = Do, R = Re, M = Mi, F = Fa, S = Sol, L = La, B = Si, C = Do agut.',
      'melody.controls.start': 'Inicia',
      'melody.controls.repeat': 'Repetir seqüència',
      'melody.controls.reset': 'Reinicia',
      'melody.round': 'Ronda:',
      'melody.best': 'Millor ratxa:',
      'melody.errors': 'Errades:',
      'melody.back': 'Torna a l\'inici',
      'melody.status.ready': 'Prem Inicia per a escoltar la seqüència.',
      'melody.status.listening': 'Escolta la seqüència…',
      'melody.status.turn': 'El teu torn: reprodueix la seqüència.',
      'melody.status.keep_going': 'Molt bé! Continua amb la seqüència.',
      'melody.status.round_complete': 'Genial! Afegim una nota més.',
      'melody.status.unlock': 'Nova nota desbloquejada: {note}!',
      'melody.status.mistake': 'Quasi... Escolta de nou la seqüència. Errades: {errors}/{max}.',
      'melody.status.fail': 'La seqüència s\'ha trencat. Prem Inicia per a tornar-ho a provar.'
    }
  };
  if (window.i18n && typeof window.i18n.registerBundle === 'function') {
    window.i18n.registerBundle('melody', payload);
  } else {
    window.__i18nPendingBundles = window.__i18nPendingBundles || [];
    window.__i18nPendingBundles.push({ name: 'melody', payload });
  }
})();
