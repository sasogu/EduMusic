// EduCraft embedded page translations
(function() {
  const payload = {
    es: {
      'educraft.title': 'EduCraft',
      'educraft.intro': 'Juego embebido desde educraft.edutictac.es. Si el navegador bloquea la carga, puedes abrirlo fuera de EduMúsic.',
      'educraft.back': 'Volver a minijocs',
      'educraft.backHome': 'Volver al inicio',
      'educraft.open': 'Abrir en nueva pestaña',
      'educraft.note': 'Si no aparece dentro de esta página, es una limitación del sitio externo o del navegador.'
    },
    val: {
      'educraft.title': 'EduCraft',
      'educraft.intro': 'Joc incrustat des de educraft.edutictac.es. Si el navegador bloqueja la càrrega, pots obrir-lo fora d\'EduMúsic.',
      'educraft.back': 'Tornar a minijocs',
      'educraft.backHome': 'Tornar a l\'inici',
      'educraft.open': 'Obrir en una pestanya nova',
      'educraft.note': 'Si no apareix dins d\'esta pàgina, és una limitació del lloc extern o del navegador.'
    },
    en: {
      'educraft.title': 'EduCraft',
      'educraft.intro': 'Embedded game from educraft.edutictac.es. If your browser blocks loading, you can open it outside EduMúsic.',
      'educraft.back': 'Back to minigames',
      'educraft.backHome': 'Back to home',
      'educraft.open': 'Open in new tab',
      'educraft.note': 'If it does not appear inside this page, that is a limitation of the external site or the browser.'
    }
  };

  if (window.i18n && typeof window.i18n.registerBundle === 'function') {
    window.i18n.registerBundle('educraft', payload);
  } else {
    window.__i18nPendingBundles = window.__i18nPendingBundles || [];
    window.__i18nPendingBundles.push({ name: 'educraft', payload });
  }
})();
