// Rhythm dictation translations
(function() {
  const payload = {
    es: {
      'dictation.title': 'Dictado rítmico',
      'dictation.instructions': 'Escucha un patrón de cuatro tiempos con negras (TA) y dos corcheas (TI-TI). A partir de 5 puntos aparece SU (silencio). Elige la opción correcta.',
      'dictation.repeat': 'Escuchar ritmo',
      'dictation.options.label': 'Opciones:',
      'dictation.options.2': '2 opciones',
      'dictation.options.3': '3 opciones',
      'dictation.options.4': '4 opciones',
      'dictation.difficulty.label': 'Modo:',
      'dictation.difficulty.text': 'Nivel 1: TA / TI-TI',
      'dictation.difficulty.symbols': 'Nivel 2: ♩ / ♫',
      'dictation.feedback.welcome': 'Pulsa Iniciar para comenzar un nuevo dictado.',
      'dictation.feedback.listen': 'Escucha el patrón y elige la opción correcta.',
      'dictation.feedback.correct': '¡Correcto! Prepárate para el siguiente patrón.',
      'dictation.feedback.wrong': 'Casi... Escucha de nuevo y vuelve a intentarlo.',
      'dictation.feedback.gameover': 'Juego terminado. Pulsa Iniciar para practicar de nuevo.'
    },
    val: {
      'dictation.title': 'Dictat rítmic',
      'dictation.instructions': 'Escolta un patró de quatre temps amb negres (TA) i dos corxeres (TI-TI). A partir de 5 punts apareix SU (silenci). Tria l\'opció correcta.',
      'dictation.repeat': 'Escoltar ritme',
      'dictation.options.label': 'Opcions:',
      'dictation.options.2': '2 opcions',
      'dictation.options.3': '3 opcions',
      'dictation.options.4': '4 opcions',
      'dictation.difficulty.label': 'Mode:',
      'dictation.difficulty.text': 'Nivell 1: TA / TI-TI',
      'dictation.difficulty.symbols': 'Nivell 2: ♩ / ♫',
      'dictation.feedback.welcome': 'Prem Inicia per a començar un nou dictat.',
      'dictation.feedback.listen': 'Escolta el patró i tria l\'opció correcta.',
      'dictation.feedback.correct': 'Molt bé! Prepara l\'oïda per al següent patró.',
      'dictation.feedback.wrong': 'Quasi... Escolta de nou i torna-ho a intentar.',
      'dictation.feedback.gameover': 'Final de la partida. Prem Inicia per a continuar practicant.'
    }
  };
  if (window.i18n && typeof window.i18n.registerBundle === 'function') {
    window.i18n.registerBundle('dictation', payload);
  } else {
    window.__i18nPendingBundles = window.__i18nPendingBundles || [];
    window.__i18nPendingBundles.push({ name: 'dictation', payload });
  }
})();
