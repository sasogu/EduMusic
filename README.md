# EduMúsic PWA

Esta es una Progressive Web App educativa para aprender música, con actividades interactivas en HTML5 y JavaScript.

## Actividad 1: Aprender las notas musicales Sol y Mi

- Interfaz simple y atractiva.
- Ejercicios interactivos para identificar y practicar las notas Sol y Mi.

## Estructura del proyecto
- `index.html`: Página principal y listado de actividades.
- `game.html`: Submenú "Atrapa Notas" con los distintos retos.
- `solmi.html`: Juego "Atrapa Notas" centrado en las notas Sol y Mi.
- `solmila.html`: Variante "Atrapa Notas" con las notas Sol, Mi y La.
- `solmilado.html`: Variante "Atrapa Notas" con Sol, Mi, La y Do grave.
- `memory.html`: tablero "Memory de Instrumentos" con modo 1 o 2 jugadores.
- `css/`: estilos (`style.css`).
- `js/`: scripts (`app.js`, `game.js`, `memory.js`).
- `assets/audio/`: clips `.ogg` libres para los sonidos de instrumentos.
- `manifest.json` y `service-worker.js`: configuración PWA y caché.

## Actividad 2: Juego "Atrapa Notas"
- `solmi.html` y `game.js`: Juego tipo arcade para atrapar notas "Sol" y "Mi".
- `solmila.html` reutiliza `game.js` con un modo que añade la nota "La".
- `solmilado.html` reutiliza `game.js` añadiendo también la nota "Do" grave con líneas adicionales.
- `memory.html` implementa el tablero "Memory de Instrumentos" con modo 1 o 2 jugadores y dos conjuntos de instrumentos (base y orquesta clásica).
- Controles: flechas izquierda/derecha o arrastrar en móvil.
- Objetivo: atrapar la nota en la mitad correcta de la barra (izquierda = Sol, derecha = Mi). Vidas: 3.

## Cómo ejecutar
Abre `index.html` en tu navegador. Para instalar como PWA, accede desde un servidor local.

---
Este archivo se actualizará conforme se agreguen nuevas actividades y funcionalidades.
