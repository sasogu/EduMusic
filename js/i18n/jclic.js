// JClic embedded activities translations
(function() {
  const payload = {
    es: {
      'jclic.carnaval.title': 'JClic: El carnaval de los animales',
      'jclic.carnaval.intro': 'Actividad interactiva de JClic incrustada desde clic.xtec.cat. Requiere conexión a Internet.',
      'jclic.carnaval.open': 'Abrir en nueva pestaña',
      'jclic.carnaval.note': 'Si el contenido no se muestra dentro de la página (por bloqueo del navegador), usa “Abrir en nueva pestaña”.'
    },
    val: {
      'jclic.carnaval.title': 'JClic: El carnaval dels animals',
      'jclic.carnaval.intro': 'Activitat interactiva de JClic incrustada des de clic.xtec.cat. Requereix connexió a Internet.',
      'jclic.carnaval.open': 'Obrir en una pestanya nova',
      'jclic.carnaval.note': 'Si el contingut no es mostra dins de la pàgina (per bloqueig del navegador), usa “Obrir en una pestanya nova”.'
    },
    en: {
      'jclic.carnaval.title': 'JClic: The Carnival of the Animals',
      'jclic.carnaval.intro': 'Interactive JClic activity embedded from clic.xtec.cat. Internet connection required.',
      'jclic.carnaval.open': 'Open in a new tab',
      'jclic.carnaval.note': 'If the content does not appear inside the page (browser blocking), use “Open in a new tab”.'
    }
  };

  if (window.i18n && typeof window.i18n.registerBundle === 'function') {
    window.i18n.registerBundle('jclic', payload);
  } else {
    window.__i18nPendingBundles = window.__i18nPendingBundles || [];
    window.__i18nPendingBundles.push({ name: 'jclic', payload });
  }
})();

