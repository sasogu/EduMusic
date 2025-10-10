
# Revisión de EduMúsic

## Arquitectura y mantenimiento
- Los estilos están incrustados en varias vistas (`index.html`, `memory.html`), lo que dificulta mantener un diseño coherente y reutilizar componentes. Extraer estos estilos repetidos a hojas CSS compartidas permitiría centralizar la apariencia y simplificar cambios futuros.【F:index.html†L12-L74】【F:html/memory.html†L63-L77】
- El selector de idioma y el pie de versión del Service Worker se replican manualmente en cada página. Convertirlos en componentes reutilizables (por ejemplo, insertados dinámicamente desde `app.js` o mediante plantillas parciales) reduciría duplicidad y riesgo de inconsistencias.【F:index.html†L15-L74】【F:html/memory.html†L63-L77】


## Accesibilidad y UX
- Varias tarjetas del índice dependen únicamente de color y sombra para transmitir interacción. Añadir estados `:focus`/`:hover` visibles desde CSS mejoraría la accesibilidad para teclado y usuarios con baja visión al mover los estilos inline a clases reutilizables.【F:index.html†L24-L68】


## Rendimiento y PWA


- Actualmente todas las peticiones HTML/JS se sirven en modo *cache-first* salvo cuando `IS_FRESH_VERSION` es `true`. Integrar una estrategia de *stale-while-revalidate* o usar `workbox` permitiría mantener el contenido actualizado sin bloquear la navegación si la red falla.【F:service-worker.js†L60-L121】


## Internacionalización y contenido

- Considera exponer utilidades para formatear dinámicamente números y tiempos según el idioma (p. ej. separador decimal) en lugar de interpolar texto manualmente, mejorando la localización en futuras expansiones.【F:js/app.js†L147-L171】【F:js/memory.js†L48-L71】
