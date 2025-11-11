# EduMúsic PWA

## Valencià

EduMúsic és una Progressive Web App (PWA) pensada per acompanyar les classes d’iniciació musical. Inclou minijocs, qüestionaris i ferramentes interactives creades amb HTML5, CSS i JavaScript que funcionen sense connexió gràcies a `service-worker.js`.

### Característiques principals
- Activitats dissenyades per a alumnat de primària: Atrapa Notes, dictats rítmics i melòdics, memory d’instruments, piano virtual i més.
- Interfície adaptable a pantalles tàctils, amb ús extensiu d’animacions CSS i so web.
- Funciona completament offline després d’instal·lar-la com a PWA, guardant el progrés en `localStorage`.
- Banc de preguntes extensible des de ClassQuiz i sistema de rànquing local o centralitzat via Firebase/Firestore.

### Estructura del projecte
- `index.html`: menú principal i accés a totes les activitats.
- `html/*.html`: pàgines autocontingudes per a cada minijoc (per exemple `solmi.html`, `rhythm-dictation.html`, `memory.html`).
- `js/`: lògica de cada activitat (`pitch-height.js`, `melody-dictation.js`, `quiz.js`…), utilitats i internacionalització en `js/i18n/`.
- `css/`: estils compartits (`style.css`, `tokens.css`) i fulls específics per activitat.
- `assets/`: recursos gràfics i clips `.ogg` lliures per acompanyament sonor.
- `manifest.json` i `service-worker.js`: definixen la instal·lació com a PWA, la iconografia i la política de memòria cau.

### Requisits i instal·lació local
No cal cap build: només has de servir els fitxers estàtics.

1. Instal·la Node.js ≥ 18 si vols usar els scripts auxiliars.
2. Executa un servidor estàtic a l’arrel, per exemple:
   ```bash
   npx serve .
   # o
   npx http-server .
   ```
3. Obri `http://localhost:3000` (o el port que indique l’eina) i utilitza “Instal·lar aplicació” al navegador per convertir-la en PWA.

Si només vols una vista ràpida, també pots obrir `index.html` directament, encara que algunes API (com la instal·lació PWA) requerixen servir el lloc via HTTP(s).

### Flux de desenvolupament
- Treballa directament sobre els fitxers en `html/`, `css/` i `js/`.
- Els assets d’àudio i tipografies estan optimitzats per funcionar offline; evita rutes absolutes.
- Per a proves de producció, neteja la memòria cau del service worker des de les ferramentes de desenvolupador abans de desplegar.
- Els textos es localitzen en `js/i18n/*`. Afig noves cadenes en els fitxers corresponents per mantindre la compatibilitat multillengua.

### Importar qüestionaris des de ClassQuiz
1. Exporta l’activitat des de [ClassQuiz](https://classquiz.de) com `.cqa` (o `.csv` mantenint els encapçalaments originals).
2. Executa el convertidor inclòs:
   ```bash
   node tools/import-classquiz.js ruta/al/fitxer.cqa --level=easy --prefix=clase
   ```
   Opcions disponibles:
   - `--level`: `easy`, `medium`, `hard`.
   - `--lang`: codi de l’idioma (per defecte `es`).
   - `--prefix`: prefix per agrupar preguntes.
   - `--include-meta`: mostra un resum i les preguntes omeses.
3. El convertidor genera JSON compatible amb `QUESTION_BANK` (`js/quiz.js`). Afig l’array resultant o substituïx elements existents.
4. El qüestionari accepta un nombre arbitrari de respostes; si el fitxer origen no marca cap com a correcta, la primera es marca automàticament per garantir l’ús de l’activitat.

### Rànquing centralitzat amb Firebase
Per defecte, cada dispositiu guarda les puntuacions en `localStorage`. Per a un rànquing comú:

1. Crea un projecte a [Firebase](https://firebase.google.com/), activa Firestore en mode producció i apunta les credencials públiques (`apiKey`, `authDomain`, `projectId`, etc.).
2. Edita `js/firebase-config.js` i reemplaça el valor `null` per l’objecte de configuració del teu projecte.
3. Desplega regles de seguretat que limiten l’escriptura només a inicials (3 caràcters) i puntuacions numèriques. Exemple:
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
4. Crea un índex compost (`leaderboards/*/entries`) ordenant per `score` descendent i `createdAt` ascendent per facilitar consultes paginades.

Una vegada configurat, `ScoreService` prioritza Firestore i manté un fallback local si es perd la connexió.

### Com contribuir
- Obri un issue descrivint la millora o el bug abans d’enviar un PR.
- Mantín el codi en espanyol neutre i afig noves traduccions tant en l’HTML com en `js/i18n/`.
- Inclou captures o GIFs quan modifiques la UX/UI per facilitar la revisió.

### Llicència
Este projecte es distribuïx sota la [llicència MIT](LICENSE). Si reutilitzes el codi, mantín l’avís de copyright
i indica clarament qualsevol modificació.

---

## English

EduMúsic is a Progressive Web App (PWA) built to support beginner music lessons. It bundles mini-games, quizzes, and interactive tools written in HTML5, CSS, and JavaScript that work offline thanks to `service-worker.js`.

### Key features
- Activities tailored for elementary students: Note Catcher, rhythmic and melodic dictations, instrument memory, virtual piano, and more.
- Touch-friendly interface with rich CSS animations and web audio support.
- Fully offline after installing as a PWA, persisting progress in `localStorage`.
- Question bank extendable via ClassQuiz and leaderboard data stored locally or through Firebase/Firestore.

### Project structure
- `index.html`: main menu with links to every activity.
- `html/*.html`: self-contained pages for each mini-game (e.g., `solmi.html`, `rhythm-dictation.html`, `memory.html`).
- `js/`: activity logic (`pitch-height.js`, `melody-dictation.js`, `quiz.js`), utilities, and internationalization files under `js/i18n/`.
- `css/`: shared styles (`style.css`, `tokens.css`) plus per-activity stylesheets.
- `assets/`: graphic resources and free `.ogg` clips for sound cues.
- `manifest.json` and `service-worker.js`: define the install prompt, icons, and cache strategy.

### Requirements and local setup
No build step needed; serve the static files as-is.

1. Install Node.js ≥ 18 if you want to use the helper scripts.
2. Run a static server from the project root, for example:
   ```bash
   npx serve .
   # or
   npx http-server .
   ```
3. Open `http://localhost:3000` (or the port reported by the tool) and use the browser’s “Install app” option to add the PWA.

For a quick look you can open `index.html` directly, though some APIs (like PWA installability) require serving over HTTP(s).

### Development workflow
- Work directly inside `html/`, `css/`, and `js/`.
- Audio assets and fonts are optimized for offline use; avoid absolute paths.
- For production tests, clear the service worker cache from devtools before deploying.
- Strings live in `js/i18n/*`. Add new keys in those files to keep multilingual support in sync.

### Importing quizzes from ClassQuiz
1. Export your activity from [ClassQuiz](https://classquiz.de) as `.cqa` (or `.csv` keeping the original headers).
2. Run the converter:
   ```bash
   node tools/import-classquiz.js path/to/file.cqa --level=easy --prefix=class
   ```
   Available options:
   - `--level`: `easy`, `medium`, `hard`.
   - `--lang`: language code (defaults to `es`).
   - `--prefix`: groups questions under a common prefix.
   - `--include-meta`: prints a summary and any skipped questions.
3. The command outputs JSON compatible with `QUESTION_BANK` (`js/quiz.js`). Append it to the bank or replace existing entries.
4. The quiz accepts any number of answers; if the source file lacks a correct flag, the converter defaults to the first answer to keep the question usable.

### Centralized ranking with Firebase
By default each device stores scores in `localStorage`. To share a leaderboard:

1. Create a [Firebase](https://firebase.google.com/) project, enable Firestore in production mode, and note the public credentials (`apiKey`, `authDomain`, `projectId`, etc.).
2. Update `js/firebase-config.js`, replacing `null` with your configuration object.
3. Deploy security rules that restrict writes to three-letter initials and numeric scores. Example:
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
4. Create a composite index (`leaderboards/*/entries`) ordering by `score` descending and `createdAt` ascending for paging.

Once configured, `ScoreService` prefers Firestore and falls back to local storage if the connection drops.

### How to contribute
- Open an issue describing the improvement or bug before sending a PR.
- Keep code comments/content in neutral Spanish and add translations in both HTML and `js/i18n/`.
- Provide screenshots or GIFs when altering UX/UI to ease reviews.

### License
This project is distributed under the [MIT License](LICENSE). Keep the copyright
notice and document any modifications if you reuse the code.
