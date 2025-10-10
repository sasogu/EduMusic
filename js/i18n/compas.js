// Puzzle de compases translations
(function() {
  const payload = {
    es: {
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
      'compas.feedback.missing': 'Todavía faltan tiempos por completar.'
    },
    val: {
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
      'compas.feedback.missing': 'Encara falten temps per completar.'
    }
  };
  if (window.i18n && typeof window.i18n.registerBundle === 'function') {
    window.i18n.registerBundle('compas', payload);
  } else {
    window.__i18nPendingBundles = window.__i18nPendingBundles || [];
    window.__i18nPendingBundles.push({ name: 'compas', payload });
  }
})();
