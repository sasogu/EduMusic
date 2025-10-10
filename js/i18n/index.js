// Index page translations
(function() {
  const payload = {
    es: {
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
      'index.melody.title': 'Secuencia de Melodías',
      'index.melody.desc': 'Escucha, memoriza y repite las notas en el teclado virtual.',
      'index.melody.small': 'Estilo “Simon dice” · Teclado interactivo · Pentagrama',
      'index.clef.title': 'Dibuja la Clave de Sol',
      'index.clef.desc': 'Sigue los puntos y traza la clave, rodeando la línea de SOL.',
      'index.rhythm.small': 'Modo básico: TA y SU · Activable TITI'
    },
    val: {
      'index.choose': 'Tria una activitat per a començar:',
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
      'index.melody.desc': 'Escolta, memoritza i repeteix les notes en el teclat virtual.',
      'index.melody.small': 'Estil “Simon says” · Teclat interactiu · Pentagrama',
      'index.clef.title': 'Dibuixa la Clau de Sol',
      'index.clef.desc': 'Segueix els punts i traça la clau, envoltant la línia de SOL.',
      'index.rhythm.small': 'Mode bàsic: TA i SU · Activable TITI'
    }
  };
  if (window.i18n && typeof window.i18n.registerBundle === 'function') {
    window.i18n.registerBundle('index', payload);
  } else {
    window.__i18nPendingBundles = window.__i18nPendingBundles || [];
    window.__i18nPendingBundles.push({ name: 'index', payload });
  }
})();
