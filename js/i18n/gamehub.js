// Atrapa Notas hub translations
(function() {
  const payload = {
    es: {
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
      'gamehub.solmiladore.title': 'Sol, Mi, La, Do y Re',
      'gamehub.solmiladore.desc': 'Añade el RE agudo y refuerza la lectura en el pentagrama.',
      'gamehub.solmiladore.small': 'Cinco notas · Líneas y espacios adicionales',
      'gamehub.solmiladorefa.title': 'Sol, Mi, La, Do, Re y Fa',
      'gamehub.solmiladorefa.desc': 'Suma el FA y practica todo el grado para afianzar la lectura.',
      'gamehub.solmiladorefa.small': 'Seis notas · Escala incompleta ascendiente',
      'gamehub.allnotes.title': 'Todas las notas',
      'gamehub.allnotes.desc': 'Atrapa la escala completa de DO mayor: Do a agudos y vuelve.',
      'gamehub.allnotes.small': 'Siete notas · Escala completa',
      'gamehub.coming.title': 'Próximamente',
      'gamehub.coming.desc': 'Más niveles de atrapar notas se añadirán aquí.',
      'gamehub.coming.small': 'Sugerencias bienvenidas'
    },
    val: {
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
      'gamehub.solmiladore.title': 'Sol, Mi, La, Do i Re',
      'gamehub.solmiladore.desc': 'Afig el RE agut al repte i reforça la lectura en el pentagrama.',
      'gamehub.solmiladore.small': 'Cinc notes · Línies i espais addicionals',
      'gamehub.solmiladorefa.title': 'Sol, Mi, La, Do, Re i Fa',
      'gamehub.solmiladorefa.desc': 'Inclou el FA per treballar tot el grau i consolidar la lectura.',
      'gamehub.solmiladorefa.small': 'Sis notes · Escala ascendent ampliada',
      'gamehub.allnotes.title': 'Totes les notes',
      'gamehub.allnotes.desc': 'Atrapa l\'escala completa de DO major: del Do greu al agut.',
      'gamehub.allnotes.small': 'Set notes · Escala completa',
      'gamehub.coming.title': 'Pròximament',
      'gamehub.coming.desc': 'Ací s\'afegiran nous nivells d\'Atrapa Notes.',
      'gamehub.coming.small': 'Idees benvingudes'
    },
    en: {
      'gamehub.title': 'Catch the Notes',
      'gamehub.intro': 'Choose a challenge to catch notes on the staff.',
      'gamehub.solmi.title': 'G and E',
      'gamehub.solmi.desc': 'Press the matching keys to catch the notes G and E.',
      'gamehub.solmi.small': 'Progressive difficulty · Online ranking',
      'gamehub.solmila.title': 'G, E and A',
      'gamehub.solmila.desc': 'Add the note A to the challenge and stay accurate on the staff.',
      'gamehub.solmila.small': 'Three notes · Same gameplay loop',
      'gamehub.solmilado.title': 'G, E, A and C',
      'gamehub.solmilado.desc': 'Include low C and practise ledger lines on the staff.',
      'gamehub.solmilado.small': 'Four notes · Reading with extra lines',
      'gamehub.solmiladore.title': 'G, E, A, C and D',
      'gamehub.solmiladore.desc': 'Add high D and reinforce staff reading skills.',
      'gamehub.solmiladore.small': 'Five notes · Extra lines and spaces',
      'gamehub.solmiladorefa.title': 'G, E, A, C, D and F',
      'gamehub.solmiladorefa.desc': 'Bring in F to cover the full degree and strengthen reading.',
      'gamehub.solmiladorefa.small': 'Six notes · Extended ascending scale',
      'gamehub.allnotes.title': 'All the Notes',
      'gamehub.allnotes.desc': 'Catch the full C major scale: climb up and come back down.',
      'gamehub.allnotes.small': 'Seven notes · Complete scale',
      'gamehub.coming.title': 'Coming soon',
      'gamehub.coming.desc': 'More Catch the Notes levels will appear here.',
      'gamehub.coming.small': 'Suggestions welcome'
    }
  };
  if (window.i18n && typeof window.i18n.registerBundle === 'function') {
    window.i18n.registerBundle('gamehub', payload);
  } else {
    window.__i18nPendingBundles = window.__i18nPendingBundles || [];
    window.__i18nPendingBundles.push({ name: 'gamehub', payload });
  }
})();
