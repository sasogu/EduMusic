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

### Ranking compartido (YunoHost + MariaDB)
Para sincronizar las puntuaciones entre dispositivos, el proyecto incluye una API PHP lista para desplegar en una instancia **My Webapp** de YunoHost (o cualquier hosting con PHP 8.x).

1. Sigue las instrucciones de `server/leaderboard/README.md` para crear la base de datos y usuario MariaDB, copiar los archivos y configurar el backend.
2. Edita `server/leaderboard/config/db.php` y asigna una clave API aleatoria (`api_key`). Usa la misma clave en el frontend.
3. En el frontend, abre `js/app.js` y actualiza el objeto `LEADERBOARD_DEFAULT` con:
   - `baseUrl`: ruta (relativa o absoluta) al endpoint, por ejemplo `leaderboard` si está en la misma webapp.
   - `apiKey`: la clave configurada en el backend.
4. Opcionalmente, puedes sobrescribir estos valores en producción añadiendo en las páginas `<meta name="edumusic:leaderboard:base">` y `<meta name="edumusic:leaderboard:key">`.

Cuando la API está disponible, el juego consulta `GET /leaderboard/top` para mostrar el ranking y envía puntuaciones con `POST /leaderboard/submit`. Si la red falla o la API responde con error, el sistema conserva un ranking local en `localStorage` como respaldo.

## Cómo ejecutar
Abre `index.html` en tu navegador. Para instalar como PWA, accede desde un servidor local.

---
Este archivo se actualizará conforme se agreguen nuevas actividades y funcionalidades.
