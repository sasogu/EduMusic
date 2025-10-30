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

## Importar cuestionarios desde ClassQuiz
- Exporta la actividad desde [ClassQuiz](https://classquiz.de) como `.cqa`. También puedes exportar a Excel y guardarlo como `.csv` con el encabezado original.
- Ejecuta el conversor incluido:  
  `node tools/import-classquiz.js ruta/al/archivo.cqa --level=easy --prefix=clase`  
  Ajusta `--level` (`easy`, `medium`, `hard`), `--lang` y `--prefix` según necesites. Usa `--include-meta` para ver un resumen y preguntas omitidas.
- El comando genera JSON compatible con `QUESTION_BANK` (`js/quiz.js`). Añade el array resultante al banco de preguntas o reemplaza elementos existentes.
- El quiz ahora admite cualquier número de respuestas, y el conversor genera todos los botones necesarios. Si el archivo original no marca ninguna respuesta como correcta, la primera se marca por defecto para mantener la pregunta utilizable.

---
Este archivo se actualizará conforme se agreguen nuevas actividades y funcionalidades.

## Ranking centralizado con Firebase
El ranking usa `localStorage` por defecto para que cada dispositivo mantenga sus puntuaciones. Para habilitar un ranking común:

1. Crea un proyecto en [Firebase](https://firebase.google.com/), habilita Firestore en modo de producción y anota las credenciales públicas (apiKey, authDomain, projectId…).
2. Edita `js/firebase-config.js` y reemplaza el valor `null` por el objeto de configuración de tu proyecto.
3. Despliega reglas de seguridad en Firestore que limiten las escrituras únicamente a iniciales (3 caracteres) y puntuaciones numéricas. Un punto de partida:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /leaderboards/{board}/entries/{entry} {
         allow read: if true;
         allow create: if request.resource.data.keys().hasOnly(
           ['name', 'score', 'createdAt', 'createdAtLocal', 'tsString', 'gameId', 'version']
         )
         && request.resource.data.name is string
         && request.resource.data.name.size() == 3
         && request.resource.data.score is number
         && request.resource.data.score >= 0
         && request.resource.data.score <= 9999;
         allow update, delete: if false;
       }
     }
   }
   ```
4. Crea un índice compuesto (Firestore > Indexes) para `leaderboards/*/entries` ordenando por `score` descendente y `createdAt` ascendente.

Con la configuración cargada, `ScoreService` usa Firestore y mantiene un fallback local en caso de perder conexión.
