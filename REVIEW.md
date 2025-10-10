
# Revisión de EduMúsic

## Arquitectura y mantenimiento

- El selector de idioma y el pie de versión del Service Worker se replican manualmente en cada página. Convertirlos en componentes reutilizables (por ejemplo, insertados dinámicamente desde `app.js` o mediante plantillas parciales) reduciría duplicidad y riesgo de inconsistencias.【F:index.html†L15-L74】【F:html/memory.html†L63-L77】


## Accesibilidad y UX
- Varias tarjetas del índice dependen únicamente de color y sombra para transmitir interacción. Añadir estados `:focus`/`:hover` visibles desde CSS mejoraría la accesibilidad para teclado y usuarios con baja visión al mover los estilos inline a clases reutilizables.【F:index.html†L24-L68】



## Internacionalización y contenido

- Considera exponer utilidades para formatear dinámicamente números y tiempos según el idioma (p. ej. separador decimal) en lugar de interpolar texto manualmente, mejorando la localización en futuras expansiones.【F:js/app.js†L147-L171】【F:js/memory.js†L48-L71】
