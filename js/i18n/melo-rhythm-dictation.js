// Melodic-rhythmic dictation translations
(function() {
  const payload = {
    es: {
      'melorhythm.title': 'Dictado melódico-rítmico',
      'melorhythm.instructions': 'Escucha un compás de cuatro tiempos que combina notas (SOL y MI) con negras y dos corcheas. Elige la opción correcta; conforme sumes puntos se desbloquearán nuevas notas, silencios y otras figuras rítmicas.',
      'melorhythm.options.label': 'Opciones:',
      'melorhythm.options.2': '2 opciones',
      'melorhythm.options.3': '3 opciones',
      'melorhythm.options.4': '4 opciones',
      'melorhythm.repeat': 'Escuchar patrón',
      'melorhythm.rest.label': 'Silencio',
      'melorhythm.speed.label': 'Velocidad:',
      'melorhythm.speed.slow': 'Lento',
      'melorhythm.speed.normal': 'Normal',
      'melorhythm.speed.fast': 'Rápido',
      'melorhythm.view.label': 'Modo:',
      'melorhythm.view.names': 'Notas + ritmo',
      'melorhythm.view.staff': 'Solo pentagrama',
      'melorhythm.feedback.welcome': 'Pulsa Iniciar para comenzar un nuevo dictado.',
      'melorhythm.feedback.listen': 'Escucha el patrón y elige la opción correcta.',
      'melorhythm.feedback.correct': '¡Correcto! Prepárate para el siguiente patrón.',
      'melorhythm.feedback.wrong': 'Casi... Escucha de nuevo y vuelve a intentarlo.',
      'melorhythm.feedback.gameover': 'Juego terminado. Pulsa Iniciar para practicar de nuevo.',
      'melorhythm.feedback.unlock': '¡Nuevo desbloqueo!',
      'melorhythm.unlock.note.la': '¡Has desbloqueado la nota LA!',
      'melorhythm.unlock.note.do': '¡Has desbloqueado la nota DO!',
      'melorhythm.unlock.note.fa': '¡Has desbloqueado la nota FA!',
      'melorhythm.unlock.note.re': '¡Has desbloqueado la nota RE!',
      'melorhythm.unlock.note.si': '¡Has desbloqueado la nota SI!',
      'melorhythm.unlock.figure.rest': '¡Nuevo ritmo: silencio de negra!',
      'melorhythm.unlock.figure.half': '¡Nuevo ritmo: blanca!'
    },
    val: {
      'melorhythm.title': 'Dictat melòdic-ritmic',
      'melorhythm.instructions': 'Escolta un compàs de quatre temps que combina notes (SOL i MI) amb negres i dos corxeres. Tria l\'opció correcta; a mesura que sumes punts es desbloquejaran noves notes, silencis i altres figures rítmiques.',
      'melorhythm.options.label': 'Opcions:',
      'melorhythm.options.2': '2 opcions',
      'melorhythm.options.3': '3 opcions',
      'melorhythm.options.4': '4 opcions',
      'melorhythm.repeat': 'Escoltar patró',
      'melorhythm.rest.label': 'Silenci',
      'melorhythm.speed.label': 'Velocitat:',
      'melorhythm.speed.slow': 'Lent',
      'melorhythm.speed.normal': 'Normal',
      'melorhythm.speed.fast': 'Ràpid',
      'melorhythm.view.label': 'Mode:',
      'melorhythm.view.names': 'Notes + ritme',
      'melorhythm.view.staff': 'Només pentagrama',
      'melorhythm.feedback.welcome': 'Prem Inicia per a començar un nou dictat.',
      'melorhythm.feedback.listen': 'Escolta el patró i tria l\'opció correcta.',
      'melorhythm.feedback.correct': 'Molt bé! Prepara l\'oïda per al següent patró.',
      'melorhythm.feedback.wrong': 'Quasi... Escolta de nou i torna-ho a intentar.',
      'melorhythm.feedback.gameover': 'Final de la partida. Prem Inicia per a continuar practicant.',
      'melorhythm.feedback.unlock': 'Nou desbloqueig!',
      'melorhythm.unlock.note.la': 'Has desbloquejat la nota LA!',
      'melorhythm.unlock.note.do': 'Has desbloquejat la nota DO!',
      'melorhythm.unlock.note.fa': 'Has desbloquejat la nota FA!',
      'melorhythm.unlock.note.re': 'Has desbloquejat la nota RE!',
      'melorhythm.unlock.note.si': 'Has desbloquejat la nota SI!',
      'melorhythm.unlock.figure.rest': 'Nou ritme: silenci de negra!',
      'melorhythm.unlock.figure.half': 'Nou ritme: blanca!'
    }
  };
  if (window.i18n && typeof window.i18n.registerBundle === 'function') {
    window.i18n.registerBundle('melorhythm', payload);
  } else {
    window.__i18nPendingBundles = window.__i18nPendingBundles || [];
    window.__i18nPendingBundles.push({ name: 'melorhythm', payload });
  }
})();
