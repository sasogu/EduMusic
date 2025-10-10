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
      'gamehub.coming.title': 'Pròximament',
      'gamehub.coming.desc': 'Ací s\'afegiran nous nivells d\'Atrapa Notes.',
      'gamehub.coming.small': 'Idees benvingudes'
    }
  };
  if (window.i18n && typeof window.i18n.registerBundle === 'function') {
    window.i18n.registerBundle('gamehub', payload);
  } else {
    window.__i18nPendingBundles = window.__i18nPendingBundles || [];
    window.__i18nPendingBundles.push({ name: 'gamehub', payload });
  }
})();
