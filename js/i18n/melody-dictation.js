// Melodic dictation translations
(function() {
  const payload = {
    es: {
      'melodic.title': 'Dictado melódico',
      'melodic.instructions': 'Escucha una secuencia de cuatro negras con las notas SOL y MI. A partir de 5 puntos se añade LA, a los 10 aparece DO, a los 15 llega FA, a los 20 se suma RE y a los 25 se incorpora SI. Elige la opción correcta.',
      'melodic.repeat': 'Escuchar melodía',
      'melodic.options.label': 'Opciones:',
      'melodic.options.2': '2 opciones',
      'melodic.options.3': '3 opciones',
      'melodic.options.4': '4 opciones',
      'melodic.difficulty.label': 'Modo:',
      'melodic.difficulty.names': 'Nivel 1: SOL / MI + desbloqueos progresivos',
      'melodic.difficulty.staff': 'Nivel 2: Pentagrama',
      'melodic.feedback.welcome': 'Pulsa Iniciar para comenzar un nuevo dictado.',
      'melodic.feedback.listen': 'Escucha la melodía y elige la opción correcta.',
      'melodic.feedback.correct': '¡Correcto! Presta atención al siguiente dictado.',
      'melodic.feedback.wrong': 'Casi... Escucha de nuevo y vuelve a intentarlo.',
      'melodic.feedback.gameover': 'Juego terminado. Pulsa Iniciar para practicar de nuevo.'
    },
    val: {
      'melodic.title': 'Dictat melòdic',
      'melodic.instructions': 'Escolta una seqüència de quatre negres amb les notes SOL i MI. A partir de 5 punts s\'afegeix LA, als 10 apareix DO, als 15 arriba FA, als 20 se suma RE i als 25 s\'incorpora SI. Tria l\'opció correcta.',
      'melodic.repeat': 'Escoltar melodia',
      'melodic.options.label': 'Opcions:',
      'melodic.options.2': '2 opcions',
      'melodic.options.3': '3 opcions',
      'melodic.options.4': '4 opcions',
      'melodic.difficulty.label': 'Mode:',
      'melodic.difficulty.names': 'Nivell 1: SOL / MI + desbloquejos progressius',
      'melodic.difficulty.staff': 'Nivell 2: Pentagrama',
      'melodic.feedback.welcome': 'Prem Inicia per a començar un nou dictat.',
      'melodic.feedback.listen': 'Escolta la melodia i tria l\'opció correcta.',
      'melodic.feedback.correct': 'Molt bé! Prepara l\'oïda per al següent dictat.',
      'melodic.feedback.wrong': 'Quasi... Escolta de nou i torna-ho a intentar.',
      'melodic.feedback.gameover': 'Final de la partida. Prem Inicia per a continuar practicant.'
    }
  };
  if (window.i18n && typeof window.i18n.registerBundle === 'function') {
    window.i18n.registerBundle('melodic', payload);
  } else {
    window.__i18nPendingBundles = window.__i18nPendingBundles || [];
    window.__i18nPendingBundles.push({ name: 'melodic', payload });
  }
})();
