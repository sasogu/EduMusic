const GAME_WIDTH = 960;
const GAME_HEIGHT = 540;

const PLAYER_SPEED = 180;
const PLAYER_JUMP_VELOCITY = -780;
const ENEMY_STOMP_BOUNCE = -520;
const JUMP_CUT_MULTIPLIER = 0.35;
const ENEMY_STOMP_EPSILON = 16;
const ENEMY_STOMP_VY_THRESHOLD = -120;

const PIANO_KEY_SOUND_COOLDOWN_MS = 140;
// key05.ogg = Do grave. Mapeo diatónico (Do..Fa↑) sobre un piano cromático.
const PIANO_SAMPLE_NUMBERS_BY_NOTE_INDEX = [5, 7, 9, 10, 12, 14, 16, 17, 19, 21, 22];

const SUPPORTED_LOCALES = ['es', 'ca', 'en'];

const SCORE_GAME_ID = 'edumario';

const NOTE_LABELS = {
    es: ['Do', 'Re', 'Mi', 'Fa', 'Sol', 'La', 'Si', 'Do↑', 'Re↑', 'Mi↑', 'Fa↑'],
    ca: ['Do', 'Re', 'Mi', 'Fa', 'Sol', 'La', 'Si', 'Do↑', 'Re↑', 'Mi↑', 'Fa↑'],
    en: ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C↑', 'D↑', 'E↑', 'F↑']
};

const TRANSLATIONS = {
    es: {
        hud: {
            score: 'Puntos: {score}',
            attempts: 'Intentos: {attempts}',
            lives: 'Vidas: {lives}'
        },
        controls: {
            jump: 'Saltar'
        },
        feedback: {
            correct: '¡Correcto!',
            tryAgain: 'Intenta otra',
            enemyHit: 'Te ha tocado un enemigo',
            stomp: '¡Pisotón!',
            extraLife: '+1 vida'
        },
        gameOver: {
            title: 'GAME OVER',
            score: 'Puntuación: {score}',
            prompt: 'Introduce 3 letras o números (A-Z, 0-9):',
            saveHint: 'ENTER para guardar',
            restartHint: 'Pulsa SPACE para reiniciar',
            emptyRanking: 'Ranking vacío'
        }
    },
    ca: {
        hud: {
            score: 'Punts: {score}',
            attempts: 'Intents: {attempts}',
            lives: 'Vides: {lives}'
        },
        controls: {
            jump: 'Saltar'
        },
        feedback: {
            correct: 'Correcte!',
            tryAgain: 'Torna-ho a provar',
            enemyHit: 'Un enemic t\'ha tocat',
            stomp: 'Trepitjada!',
            extraLife: '+1 vida'
        },
        gameOver: {
            title: 'GAME OVER',
            score: 'Puntuació: {score}',
            prompt: 'Introdueix 3 lletres o números (A-Z, 0-9):',
            saveHint: 'ENTER per desar',
            restartHint: 'Prem ESPAI per reiniciar',
            emptyRanking: 'Rànquing buit'
        }
    },
    en: {
        hud: {
            score: 'Points: {score}',
            attempts: 'Attempts: {attempts}',
            lives: 'Lives: {lives}'
        },
        controls: {
            jump: 'Jump'
        },
        feedback: {
            correct: 'Correct!',
            tryAgain: 'Try again',
            enemyHit: 'An enemy hit you',
            stomp: 'Stomp!',
            extraLife: '+1 life'
        },
        gameOver: {
            title: 'GAME OVER',
            score: 'Score: {score}',
            prompt: 'Enter 3 letters or numbers (A-Z, 0-9):',
            saveHint: 'Press ENTER to save',
            restartHint: 'Press SPACE to restart',
            emptyRanking: 'No scores yet'
        }
    }
};

class EduMarioScene extends Phaser.Scene {
    constructor() {
        super('edu-mario');
        this.locale = 'es';
        this.t = (key, vars) => key;

        // Notas ordenadas de grave a agudo (las agudas se marcan con ↑ para distinguirlas en las teclas).
        // Los labels visibles dependen del idioma; internamente trabajamos por índice.
        this.notes = NOTE_LABELS.es;
        this.notePositions = [];
        this.targetIndex = 0;
        this.score = 0;
        this.attempts = 0;
        this.lives = 3;
        this.nextEnemyMilestone = 20;
        this.nextLifeMilestone = 50;
        this.keyResolveLockUntil = 0;
        this.hitLock = false;
        this.touchLeft = false;
        this.touchRight = false;
        this.touchJump = false;
        this.jumpCutApplied = false;
        this.audioArmed = false;

        this.isGameOver = false;
        this.enteringInitials = false;
        this.initials = '';
        this.submittedScore = false;
        this.highScores = [];
        this.gameOverKeyHandler = null;

        this.skyMode = 'normal';
    }

    preload() {
        this.load.atlas(
            'sunnyAtlas',
            'assets/games/edu-mario/sunny/atlas/atlas.png',
            'assets/games/edu-mario/sunny/atlas/atlas.json'
        );
        // Fondo más infantil / pixel-art (parallax cielo + montañas)
        this.load.image('bg-back', 'assets/skies/pixelsky.png');
        this.load.image('bg-mid', 'assets/skies/mountains-tile.png');
        this.load.image('bg-back-spooky', 'assets/skies/spookysky.jpg');
        this.load.spritesheet('tiles', 'assets/games/edu-mario/sunny/environment/tileset.png', {
            frameWidth: 16,
            frameHeight: 16
        });

        // Piano cromático (archivos en assets/games/edu-mario/piano/keyXX.ogg)
        for (let i = 0; i < PIANO_SAMPLE_NUMBERS_BY_NOTE_INDEX.length; i += 1) {
            const num = PIANO_SAMPLE_NUMBERS_BY_NOTE_INDEX[i];
            const padded = String(num).padStart(2, '0');
            this.load.audio(`piano-key${padded}`, `assets/games/edu-mario/piano/key${padded}.ogg`);
        }
    }

    create() {
        this.resetRunState();

        this.setupI18n();

        // Fondo con parallax: evita estirar el arte y da más vida al escenario.
        this.bgBack = this.add.tileSprite(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 'bg-back');

        // Montañas solo abajo (una fila), ocupando todo el ancho.
        const midSource = this.textures.get('bg-mid')?.getSourceImage();
        const midHeight = midSource?.height || Math.floor(GAME_HEIGHT * 0.35);
        this.bgMid = this.add.tileSprite(GAME_WIDTH / 2, GAME_HEIGHT - midHeight / 2, GAME_WIDTH, midHeight, 'bg-mid');

        this.createUi();
        this.createTextures();
        this.createPlatforms();
        this.createPlayer();
        this.createEnemies();
        this.createControls();
        this.createColliders();
        this.setupAudio();
        this.loadHighScores();
        this.createGameOverUi();
        this.pickNewTarget();
    }

    resetRunState() {
        // IMPORTANTE: Scene.restart() no vuelve a llamar al constructor.
        // Por eso reseteamos aquí el estado de la partida.
        this.targetIndex = 0;
        this.score = 0;
        this.attempts = 0;
        this.lives = 3;
        this.nextEnemyMilestone = 20;
        this.nextLifeMilestone = 50;
        this.keyResolveLockUntil = 0;
        this.hitLock = false;
        this.touchLeft = false;
        this.touchRight = false;
        this.touchJump = false;
        this.jumpCutApplied = false;

        this.isGameOver = false;
        this.enteringInitials = false;
        this.initials = '';
        this.submittedScore = false;

        this.skyMode = 'normal';
    }

    maybeUpdateBackgroundByScore() {
        // 0-49: fondo normal, 50-79: spooky, 80+: vuelve al normal.
        const desiredMode = this.score >= 80 ? 'normal' : (this.score >= 50 ? 'spooky' : 'normal');
        if (desiredMode === this.skyMode) {
            return;
        }

        this.skyMode = desiredMode;
        if (!this.bgBack) {
            return;
        }

        if (desiredMode === 'spooky') {
            this.bgBack.setTexture('bg-back-spooky');
        } else {
            this.bgBack.setTexture('bg-back');
        }
    }

    setupI18n() {
        const locale = this.getInitialLocale();
        this.locale = locale;
        this.t = this.createTranslator(locale);
        this.notes = NOTE_LABELS[locale] || NOTE_LABELS.es;
    }

    getInitialLocale() {
        try {
            const normalizeLocale = (raw) => {
                const value = String(raw || '').toLowerCase().trim();
                if (!value) {
                    return '';
                }
                // EduMúsic usa 'val' para valenciano. En EduMario usamos 'ca' (catalán).
                if (value === 'val') {
                    return 'ca';
                }
                // Acepta alias comunes por si vienen por URL.
                if (value === 'cat' || value === 'catalan' || value === 'català') {
                    return 'ca';
                }
                return value;
            };

            const params = new URLSearchParams(window.location.search);
            const fromUrl = normalizeLocale(params.get('lang'));
            if (SUPPORTED_LOCALES.includes(fromUrl)) {
                window.localStorage.setItem('edu-mario-lang', fromUrl);
                return fromUrl;
            }

            const stored = normalizeLocale(window.localStorage.getItem('edu-mario-lang'));
            if (SUPPORTED_LOCALES.includes(stored)) {
                return stored;
            }

            // Heredar idioma de EduMúsic si existe (es/val/en).
            const inherited = normalizeLocale(window.localStorage.getItem('lang'));
            if (SUPPORTED_LOCALES.includes(inherited)) {
                window.localStorage.setItem('edu-mario-lang', inherited);
                return inherited;
            }

            const nav = String(navigator.language || '').toLowerCase();
            if (nav.startsWith('ca')) {
                return 'ca';
            }
            if (nav.startsWith('en')) {
                return 'en';
            }
        } catch (error) {
            // ignore
        }

        return 'es';
    }

    createTranslator(locale) {
        const dict = TRANSLATIONS[locale] || TRANSLATIONS.es;
        const fallback = TRANSLATIONS.es;

        const getByPath = (obj, path) => {
            const parts = String(path).split('.');
            let cur = obj;
            for (const part of parts) {
                if (!cur || typeof cur !== 'object' || !(part in cur)) {
                    return undefined;
                }
                cur = cur[part];
            }
            return cur;
        };

        const format = (template, vars) => {
            if (!vars) {
                return template;
            }
            return template.replace(/\{(\w+)\}/g, (_, key) => {
                const val = vars[key];
                return val === undefined || val === null ? '' : String(val);
            });
        };

        return (key, vars) => {
            const raw = getByPath(dict, key) ?? getByPath(fallback, key) ?? key;
            return typeof raw === 'string' ? format(raw, vars) : String(raw);
        };
    }

    setupAudio() {
        // Desbloquea el contexto de audio tras la primera interacción del usuario.
        const arm = async () => {
            if (this.audioArmed) {
                return;
            }
            this.audioArmed = true;
            try {
                if (this.sound && this.sound.context && this.sound.context.state === 'suspended') {
                    await this.sound.context.resume();
                }
            } catch (error) {
                // Si el navegador bloquea el audio, simplemente seguimos sin sonido.
            }
        };

        this.input.once('pointerdown', arm);
        this.input.keyboard?.once('keydown', arm);
    }

    playTone(frequency, durationMs, type = 'sine', volume = 0.08) {
        const ctx = this.sound?.context;
        if (!ctx || typeof ctx.createOscillator !== 'function') {
            return;
        }

        try {
            const oscillator = ctx.createOscillator();
            const gain = ctx.createGain();

            oscillator.type = type;
            oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

            gain.gain.setValueAtTime(0.0001, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(volume, ctx.currentTime + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + durationMs / 1000);

            oscillator.connect(gain);
            gain.connect(ctx.destination);

            oscillator.start();
            oscillator.stop(ctx.currentTime + durationMs / 1000);
        } catch (error) {
            // Silencioso si falla (por políticas del navegador / audio no disponible)
        }
    }

    playSuccessSound() {
        // Doble "ding" corto (agradable)
        this.playTone(880, 70, 'sine', 0.08);
        this.time.delayedCall(80, () => this.playTone(1175, 90, 'sine', 0.08));
    }

    playErrorSound() {
        // Bajada rápida tipo "buzzer"
        this.playTone(220, 120, 'square', 0.06);
        this.time.delayedCall(40, () => this.playTone(164, 140, 'square', 0.05));
    }

    playStompSound() {
        // "Pop" corto y grave, tipo pisotón
        this.playTone(180, 50, 'triangle', 0.09);
        this.time.delayedCall(35, () => this.playTone(120, 70, 'triangle', 0.07));
    }

    createUi() {
        const staffWidth = 560;
        const staffX = GAME_WIDTH / 2;
        const staffY = 70;
        const staffSpacing = 18;
        const staffBottom = staffY + staffSpacing * 4;
        const noteStep = staffSpacing / 2;

        const staff = this.add.graphics();
        staff.lineStyle(2, 0x1f2933, 0.9);
        for (let i = 0; i < 5; i += 1) {
            const y = staffY + i * staffSpacing;
            staff.lineBetween(staffX - staffWidth / 2, y, staffX + staffWidth / 2, y);
        }

        const staffBase = staffBottom + noteStep * 2;
        this.notePositions = this.notes.map((_, index) => staffBase - index * noteStep);
        this.noteDot = this.add.circle(staffX, staffBottom, 9, 0x111827);
        this.noteLedger = this.add.graphics();
        this.staffMetrics = { staffX, staffWidth, staffY, staffBottom, noteStep };

        this.feedbackText = this.add.text(staffX, staffY + staffSpacing * 6.2, '', {
            fontSize: '20px',
            color: '#0f172a'
        }).setOrigin(0.5, 0.5);

        this.scoreText = this.add.text(20, 16, this.t('hud.score', { score: this.score }), {
            fontSize: '18px',
            color: '#0f172a'
        });

        this.livesText = this.add.text(20, 40, this.t('hud.lives', { lives: this.lives }), {
            fontSize: '18px',
            color: '#0f172a'
        });

        this.attemptsText = this.add.text(GAME_WIDTH - 20, 16, this.t('hud.attempts', { attempts: this.attempts }), {
            fontSize: '18px',
            color: '#0f172a'
        }).setOrigin(1, 0);
    }

    createGameOverUi() {
        const overlay = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.55);
        overlay.setDepth(1000);

        const title = this.add.text(GAME_WIDTH / 2, 140, this.t('gameOver.title'), {
            fontSize: '44px',
            color: '#f8fafc'
        }).setOrigin(0.5).setDepth(1001);

        const scoreLine = this.add.text(GAME_WIDTH / 2, 200, '', {
            fontSize: '22px',
            color: '#f8fafc'
        }).setOrigin(0.5).setDepth(1001);

        const prompt = this.add.text(GAME_WIDTH / 2, 250, this.t('gameOver.prompt'), {
            fontSize: '18px',
            color: '#f8fafc'
        }).setOrigin(0.5).setDepth(1001);

        const initialsText = this.add.text(GAME_WIDTH / 2, 290, '___', {
            fontSize: '40px',
            color: '#f8fafc'
        }).setOrigin(0.5).setDepth(1001);

        const hint = this.add.text(GAME_WIDTH / 2, 340, this.t('gameOver.saveHint'), {
            fontSize: '16px',
            color: '#e2e8f0'
        }).setOrigin(0.5).setDepth(1001);

        const ranking = this.add.text(GAME_WIDTH / 2, 410, '', {
            fontSize: '16px',
            color: '#f8fafc',
            align: 'center'
        }).setOrigin(0.5).setDepth(1001);

        const restartHint = this.add.text(GAME_WIDTH / 2, 495, '', {
            fontSize: '16px',
            color: '#e2e8f0'
        }).setOrigin(0.5).setDepth(1001);

        this.gameOverUi = { overlay, title, scoreLine, prompt, initialsText, hint, ranking, restartHint };
        this.setGameOverUiVisible(false);

        this.events.once('shutdown', () => {
            if (this.gameOverKeyHandler && this.input?.keyboard) {
                this.input.keyboard.off('keydown', this.gameOverKeyHandler);
            }
        });
    }

    setGameOverUiVisible(visible) {
        if (!this.gameOverUi) {
            return;
        }
        Object.values(this.gameOverUi).forEach((obj) => obj.setVisible(visible));
    }

    loadHighScores() {
        const legacyKey = 'edu-mario-highscores';

        const loadLegacy = () => {
            try {
                const raw = window.localStorage.getItem(legacyKey);
                const parsed = raw ? JSON.parse(raw) : [];
                return Array.isArray(parsed) ? parsed : [];
            } catch (_) {
                return [];
            }
        };

        const loadFromScoreService = () => {
            const svc = window.ScoreService;
            if (!svc || typeof svc.scanDom !== 'function' || typeof svc.getBoardsByGame !== 'function') {
                return null;
            }
            try {
                // Asegura que los boards ocultos estén montados.
                if (typeof svc.getBoardByGame === 'function' && !svc.getBoardByGame(SCORE_GAME_ID)) {
                    svc.scanDom();
                }
                const boards = svc.getBoardsByGame(SCORE_GAME_ID) || [];
                const primary = boards[0];
                if (!primary || typeof svc.loadLocal !== 'function') {
                    return null;
                }

                // Migración: si existen scores antiguos y el ranking nuevo está vacío.
                const existing = svc.loadLocal(primary, 'all-time');
                const legacy = loadLegacy();
                if (Array.isArray(existing) && existing.length === 0 && legacy.length > 0
                    && typeof svc.saveLocalEntry === 'function') {
                    for (const entry of legacy) {
                        const nameRaw = entry && entry.name != null ? entry.name : '';
                        const scoreRaw = entry && entry.score != null ? entry.score : 0;
                        const name = (typeof svc.normalizeInitials === 'function')
                            ? svc.normalizeInitials(nameRaw)
                            : String(nameRaw || '---').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 3).padEnd(3, 'A');
                        const score = Number(scoreRaw);
                        if (!Number.isFinite(score)) {
                            continue;
                        }
                        const migrated = { name, score, ts: new Date().toISOString() };
                        for (const b of boards) {
                            svc.saveLocalEntry(b, migrated);
                        }
                    }
                    try {
                        window.localStorage.removeItem(legacyKey);
                    } catch (_) {}
                }

                const list = svc.loadLocal(primary, 'all-time');
                return Array.isArray(list) ? list : [];
            } catch (_) {
                return null;
            }
        };

        const unified = loadFromScoreService();
        if (Array.isArray(unified)) {
            const normalized = unified
                .map((e) => ({
                    name: (e && e.name != null ? String(e.name) : '---').toUpperCase().slice(0, 3),
                    score: Number(e && e.score != null ? e.score : 0) || 0,
                    ts: e && e.ts ? e.ts : null,
                }))
                .filter((e) => e && typeof e.name === 'string' && Number.isFinite(e.score))
                .sort((a, b) => (b.score - a.score));
            this.highScores = normalized.slice(0, 10);
            return;
        }

        const legacy = loadLegacy();
        this.highScores = legacy
            .filter((e) => e && typeof e.name === 'string' && typeof e.score === 'number')
            .sort((a, b) => b.score - a.score)
            .slice(0, 10);
    }

    saveHighScore(name, score) {
        const svc = window.ScoreService;
        const safeScore = Number(score);
        if (!Number.isFinite(safeScore)) {
            return;
        }

        // Preferimos el formato del ScoreService (3 chars A-Z/0-9).
        const normalizedName = (svc && typeof svc.normalizeInitials === 'function')
            ? svc.normalizeInitials(name)
            : String(name || '---').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 3).padEnd(3, 'A');

        if (svc && typeof svc.scanDom === 'function' && typeof svc.getBoardsByGame === 'function') {
            try {
                if (typeof svc.getBoardByGame === 'function' && !svc.getBoardByGame(SCORE_GAME_ID)) {
                    svc.scanDom();
                }
                const boards = svc.getBoardsByGame(SCORE_GAME_ID) || [];
                const primary = boards[0];
                if (primary && typeof svc.addEntry === 'function') {
                    // addEntry guarda en local para todos los boards y luego intenta remoto.
                    svc.addEntry(primary, normalizedName, safeScore).catch(() => {});
                    return;
                }
            } catch (_) {
                // fallback a legacy
            }
        }

        // Fallback legacy (si ScoreService no está cargado).
        const now = Date.now();
        const existing = (this.highScores || []).filter((e) => e && typeof e.name === 'string' && typeof e.score === 'number');
        const prev = existing.find((e) => String(e.name).toUpperCase().slice(0, 3) === normalizedName);

        if (prev && prev.score >= safeScore) {
            this.highScores = existing
                .sort((a, b) => b.score - a.score)
                .slice(0, 10);
        } else {
            const withoutName = existing.filter((e) => String(e.name).toUpperCase().slice(0, 3) !== normalizedName);
            const entry = { name: normalizedName, score: safeScore, at: now };
            this.highScores = [...withoutName, entry]
                .sort((a, b) => b.score - a.score)
                .slice(0, 10);
        }

        try {
            window.localStorage.setItem('edu-mario-highscores', JSON.stringify(this.highScores));
        } catch (_) {}
    }

    formatHighScores() {
        const list = this.highScores || [];
        if (list.length === 0) {
            return this.t('gameOver.emptyRanking');
        }
        const lines = list.map((entry, index) => {
            const name = (entry.name || '---').padEnd(3, ' ');
            const score = String(entry.score).padStart(3, ' ');
            return `${index + 1}. ${name}  ${score}`;
        });
        return lines.join('\n');
    }

    triggerGameOver() {
        if (this.isGameOver) {
            return;
        }

        this.isGameOver = true;
        this.enteringInitials = true;
        this.initials = '';
        this.submittedScore = false;

        this.physics.pause();
        this.player.setVelocity(0, 0);
        this.player.anims?.stop();

        this.setGameOverUiVisible(true);
        this.gameOverUi.scoreLine.setText(this.t('gameOver.score', { score: this.score }));
        this.gameOverUi.initialsText.setText('___');
        this.gameOverUi.hint.setText(this.t('gameOver.saveHint'));
        this.gameOverUi.ranking.setText('');
        this.gameOverUi.restartHint.setText('');

        if (this.gameOverKeyHandler && this.input?.keyboard) {
            this.input.keyboard.off('keydown', this.gameOverKeyHandler);
        }

        this.gameOverKeyHandler = (event) => {
            if (!this.isGameOver) {
                return;
            }

            const key = String(event.key || '').toUpperCase();

            if (!this.submittedScore) {
                if (key === 'BACKSPACE') {
                    this.initials = this.initials.slice(0, -1);
                } else if (key === 'ENTER') {
                    if (this.initials.length === 3) {
                        this.submittedScore = true;
                        this.saveHighScore(this.initials, this.score);
                        this.loadHighScores();
                        this.gameOverUi.ranking.setText(this.formatHighScores());
                        this.gameOverUi.hint.setText('');
                        this.gameOverUi.restartHint.setText(this.t('gameOver.restartHint'));
                    }
                } else if (/^[A-Z0-9]$/.test(key)) {
                    if (this.initials.length < 3) {
                        this.initials += key;
                    }
                }

                const display = (this.initials + '___').slice(0, 3);
                this.gameOverUi.initialsText.setText(display);
            } else {
                if (key === ' ' || key === 'SPACE' || key === 'SPACEBAR') {
                    this.scene.restart();
                }
            }
        };

        this.input.keyboard.on('keydown', this.gameOverKeyHandler);
    }

    createTextures() {
        const keyGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        keyGraphics.fillStyle(0xf8fafc, 1);
        keyGraphics.fillRoundedRect(0, 0, 48, 22, 6);
        keyGraphics.lineStyle(2, 0x334155, 1);
        keyGraphics.strokeRoundedRect(1, 1, 46, 20, 6);
        keyGraphics.generateTexture('key', 48, 22);
        keyGraphics.destroy();

        const groundGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        groundGraphics.fillStyle(0x1f2933, 1);
        groundGraphics.fillRect(0, 0, 32, 32);
        groundGraphics.generateTexture('ground-body', 32, 32);
        groundGraphics.destroy();
    }

    createPlatforms() {
        const groundHeight = 48;
        const groundY = GAME_HEIGHT - groundHeight / 2;
        const groundTileFrame = 78;

        this.groundTopY = groundY - groundHeight / 2;

        this.add.tileSprite(GAME_WIDTH / 2, groundY, GAME_WIDTH, groundHeight, 'tiles', groundTileFrame);

        this.ground = this.physics.add.staticImage(GAME_WIDTH / 2, groundY, 'ground-body');
        this.ground.setDisplaySize(GAME_WIDTH, groundHeight);
        this.ground.refreshBody();

        this.keys = this.physics.add.staticGroup();

        const keyY = 310;
        const startX = 100;
        const endX = GAME_WIDTH - 100;
        const spacing = (endX - startX) / (this.notes.length - 1);

        for (let i = 0; i < this.notes.length; i += 1) {
            const x = startX + i * spacing;
            const key = this.keys.create(x, keyY, 'key');
            key.setData('noteIndex', i);
            key.setData('noteName', this.notes[i]);
            key.setData('pianoSoundKey', this.getPianoSoundKeyForNoteIndex(i));
            key.setData('lastPianoAt', 0);
            key.refreshBody();

            this.add.text(x, keyY, this.notes[i], {
                fontSize: '14px',
                color: '#0f172a'
            }).setOrigin(0.5, 0.5);
        }
    }

    getPianoSoundKeyForNoteIndex(noteIndex) {
        const num = PIANO_SAMPLE_NUMBERS_BY_NOTE_INDEX[noteIndex];
        if (!num) {
            return null;
        }
        const padded = String(num).padStart(2, '0');
        return `piano-key${padded}`;
    }

    playPianoKeyForSprite(keySprite) {
        const soundKey = keySprite.getData('pianoSoundKey');
        if (!soundKey) {
            return;
        }

        const now = this.time.now;
        const last = keySprite.getData('lastPianoAt') || 0;
        if (now - last < PIANO_KEY_SOUND_COOLDOWN_MS) {
            return;
        }
        keySprite.setData('lastPianoAt', now);

        // Phaser Sound respeta el mismo AudioContext; si no está armado, intentará sonar tras la interacción.
        if (this.sound?.get(soundKey)) {
            this.sound.play(soundKey, { volume: 0.35 });
        } else {
            // Si aún no existe instancia, play lo crea internamente.
            this.sound?.play(soundKey, { volume: 0.35 });
        }
    }

    createPlayer() {
        this.playerStart = { x: 140, y: 420 };
        this.player = this.physics.add.sprite(this.playerStart.x, this.playerStart.y, 'sunnyAtlas', 'player/idle/player-idle-1');
        this.player.setCollideWorldBounds(true);
        this.player.setSize(16, 28, true);

        this.anims.create({
            key: 'player-idle',
            frames: this.anims.generateFrameNames('sunnyAtlas', {
                prefix: 'player/idle/player-idle-',
                start: 1,
                end: 3
            }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'player-run',
            frames: this.anims.generateFrameNames('sunnyAtlas', {
                prefix: 'player/run/player-run-',
                start: 1,
                end: 6
            }),
            frameRate: 12,
            repeat: -1
        });

        this.anims.create({
            key: 'player-jump',
            frames: this.anims.generateFrameNames('sunnyAtlas', {
                prefix: 'player/jump/player-jump-',
                start: 1,
                end: 2
            }),
            frameRate: 8,
            repeat: -1
        });
    }

    createEnemies() {
        this.enemies = this.physics.add.group();

        this.anims.create({
            key: 'opossum-walk',
            frames: this.anims.generateFrameNames('sunnyAtlas', {
                prefix: 'opossum/opossum-',
                start: 1,
                end: 6
            }),
            frameRate: 10,
            repeat: -1
        });
    }

    createControls() {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.jumpKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.input.addPointer(2);

        const buttonY = GAME_HEIGHT - 70;
        const buttonAlpha = 0.6;

        const leftButton = this.add.rectangle(80, buttonY, 70, 50, 0x0f172a, buttonAlpha).setInteractive();
        const rightButton = this.add.rectangle(170, buttonY, 70, 50, 0x0f172a, buttonAlpha).setInteractive();
        const jumpButton = this.add.rectangle(GAME_WIDTH - 90, buttonY, 90, 50, 0x0f172a, buttonAlpha).setInteractive();

        this.add.text(80, buttonY, '<', { fontSize: '24px', color: '#f8fafc' }).setOrigin(0.5);
        this.add.text(170, buttonY, '>', { fontSize: '24px', color: '#f8fafc' }).setOrigin(0.5);
        this.add.text(GAME_WIDTH - 90, buttonY, this.t('controls.jump'), { fontSize: '18px', color: '#f8fafc' }).setOrigin(0.5);

        const bindHoldButton = (button, flag) => {
            // En táctil es fácil que el dedo “se salga” unos píxeles y dispare pointerout.
            // Para que se comporte como una tecla (mantener mientras se pulsa),
            // mantenemos el estado hasta que el mismo puntero levanta.
            button.setData('activePointerId', null);

            const press = (pointer) => {
                this[flag] = true;
                button.setData('activePointerId', pointer?.id ?? null);
            };

            const release = (pointer) => {
                const activeId = button.getData('activePointerId');
                const pointerId = pointer?.id ?? null;
                if (activeId === null || pointerId === activeId) {
                    this[flag] = false;
                    button.setData('activePointerId', null);
                }
            };

            button.on('pointerdown', press);
            button.on('pointerup', release);
            button.on('pointerupoutside', release);

            // Fallback: si el puntero se levanta fuera del botón, liberamos igualmente.
            this.input.on('pointerup', release);
            this.input.on('gameout', () => {
                this[flag] = false;
                button.setData('activePointerId', null);
            });
        };

        bindHoldButton(leftButton, 'touchLeft');
        bindHoldButton(rightButton, 'touchRight');
        bindHoldButton(jumpButton, 'touchJump');
    }

    createColliders() {
        this.physics.add.collider(this.player, this.ground);
        this.physics.add.collider(this.player, this.keys, this.handleKeyHit, null, this);

        this.physics.add.collider(this.enemies, this.ground);
        this.physics.add.collider(this.enemies, this.keys);
        this.physics.add.overlap(this.player, this.enemies, this.handlePlayerEnemyOverlap, null, this);
    }

    getAllowedNoteIndices() {
        // Orden de dificultad por tramos de 20 puntos:
        // (siempre primero graves y después agudas)
        // Ajuste: al principio los desbloqueos van cada 10 puntos
        // hasta llegar a Si y Do↑; a partir de ahí, cada 20.
        // 0-10: Sol, Mi
        // 10-20: + La
        // 20-30: + Do (grave)
        // 30-40: + Re (grave), Fa (grave)
        // 40-60: + Si (grave), Do↑ (agudo)
        // 60-80: + Re↑
        // 80-100: + Mi↑
        // >100: + Fa↑ (todas hasta Fa↑)
        const s = this.score;

        if (s < 10) {
            return [4, 2];
        }
        if (s < 20) {
            return [4, 2, 5];
        }
        if (s < 30) {
            return [4, 2, 5, 0];
        }
        if (s < 40) {
            return [4, 2, 5, 0, 1, 3];
        }
        if (s < 60) {
            return [4, 2, 5, 0, 1, 3, 6, 7];
        }

        if (s < 80) {
            return [4, 2, 5, 0, 1, 3, 6, 7, 8];
        }

        if (s < 100) {
            return [4, 2, 5, 0, 1, 3, 6, 7, 8, 9];
        }

        return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    }

    maybeSpawnMilestoneEnemies() {
        // Cada 20 puntos: aparece un enemigo más de forma aleatoria.
        while (this.score >= this.nextEnemyMilestone) {
            this.nextEnemyMilestone += 20;
            const x = Phaser.Math.Between(80, GAME_WIDTH - 80);
            this.spawnEnemy(x);
        }
    }

    maybeGrantExtraLives() {
        // Cada 50 puntos: suma 1 vida.
        while (this.score >= this.nextLifeMilestone) {
            this.nextLifeMilestone += 50;
            this.lives += 1;
            this.livesText.setText(this.t('hud.lives', { lives: this.lives }));
            this.feedbackText.setText(this.t('feedback.extraLife'));
        }
    }

    handlePlayerEnemyOverlap(player, enemy) {
        if (!enemy.body || !enemy.active) {
            return;
        }

        // Pisotón más permisivo: basta con tocar al enemigo claramente desde arriba.
        // Nota: no dependemos solo del signo de la velocidad porque en overlaps/colisiones puede variar.
        const playerAbove = player.body.center.y < enemy.body.center.y - 2;
        const withinTopBand = player.body.bottom <= enemy.body.top + ENEMY_STOMP_EPSILON;
        const notStronglyRising = player.body.velocity.y >= ENEMY_STOMP_VY_THRESHOLD;

        if ((playerAbove || withinTopBand) && notStronglyRising) {
            enemy.disableBody(true, true);
            player.setVelocityY(ENEMY_STOMP_BOUNCE);
            this.feedbackText.setText(this.t('feedback.stomp'));
            this.playStompSound();
            return;
        }

        this.handleEnemyHit();
    }

    pickNewTarget() {
        const allowed = this.getAllowedNoteIndices();
        let next = allowed[Phaser.Math.Between(0, allowed.length - 1)];
        if (allowed.length > 1) {
            while (next === this.targetIndex) {
                next = allowed[Phaser.Math.Between(0, allowed.length - 1)];
            }
        }
        this.targetIndex = next;
        const dotY = this.notePositions[this.targetIndex];
        this.noteDot.y = dotY;
        this.updateLedger(dotY);
    }

    updateLedger(dotY) {
        const { staffX, staffWidth, staffY, staffBottom, noteStep } = this.staffMetrics;
        this.noteLedger.clear();
        this.noteLedger.lineStyle(2, 0x1f2933, 0.9);

        if (dotY > staffBottom + noteStep) {
            this.noteLedger.lineBetween(staffX - 60, staffBottom + noteStep * 2, staffX + 60, staffBottom + noteStep * 2);
        } else if (dotY < staffY - noteStep) {
            this.noteLedger.lineBetween(staffX - 60, staffY - noteStep, staffX + 60, staffY - noteStep);
        }
    }

    handleKeyHit(player, key) {
        // Sonido de la tecla siempre que se toque (con cooldown para evitar spam).
        this.playPianoKeyForSprite(key);

        const now = this.time.now;
        if (now < this.keyResolveLockUntil) {
            return;
        }

        // Resolvemos el intento de dos formas:
        // 1) aterrizando sobre la tecla
        // 2) golpeando la tecla desde abajo (salto)
        const epsilon = 4;
        const landedOnKey =
            player.body.touching.down &&
            player.body.bottom <= key.body.top + epsilon;

        const hitFromBelow =
            player.body.touching.up &&
            player.body.top >= key.body.bottom - epsilon;

        if (!landedOnKey && !hitFromBelow) {
            return;
        }

        this.keyResolveLockUntil = now + 220;

        const hitIndex = key.getData('noteIndex');
        if (hitIndex === this.targetIndex) {
            this.score += 1;
            this.scoreText.setText(this.t('hud.score', { score: this.score }));
            this.feedbackText.setText(this.t('feedback.correct'));
            this.playSuccessSound();
            key.setTint(0x34d399);
            this.time.delayedCall(120, () => key.clearTint());

            this.maybeUpdateBackgroundByScore();

            this.maybeSpawnMilestoneEnemies();
            this.maybeGrantExtraLives();
            this.pickNewTarget();
        } else {
            this.attempts += 1;
            this.attemptsText.setText(this.t('hud.attempts', { attempts: this.attempts }));
            this.feedbackText.setText(this.t('feedback.tryAgain'));
            this.playErrorSound();
            key.setTint(0xf87171);
            this.time.delayedCall(120, () => key.clearTint());
            this.spawnEnemy(key.x);
        }
    }

    spawnEnemy(spawnNearX) {
        const x = Phaser.Math.Clamp(spawnNearX + Phaser.Math.Between(-140, 140), 40, GAME_WIDTH - 40);
        const y = (this.groundTopY ?? (GAME_HEIGHT - 48)) - 18;

        const enemy = this.enemies.create(x, y, 'sunnyAtlas', 'opossum/opossum-1');
        enemy.setCollideWorldBounds(true);
        enemy.setBounce(1, 0);
        enemy.setVelocityX(Phaser.Math.Between(-80, 80) || 80);
        enemy.play('opossum-walk');
    }

    handleEnemyHit() {
        if (this.hitLock) {
            return;
        }
        this.hitLock = true;

        this.lives -= 1;
        this.livesText.setText(this.t('hud.lives', { lives: this.lives }));

        if (this.lives <= 0) {
            this.feedbackText.setText(this.t('gameOver.title'));
            this.triggerGameOver();
            return;
        }

        this.feedbackText.setText(this.t('feedback.enemyHit'));

        this.player.setVelocity(0, 0);
        this.player.setPosition(this.playerStart.x, this.playerStart.y);

        this.tweens.add({
            targets: this.player,
            alpha: 0,
            duration: 80,
            yoyo: true,
            repeat: 5,
            onComplete: () => {
                this.player.alpha = 1;
                this.hitLock = false;
            }
        });
    }

    update() {
        if (this.isGameOver) {
            return;
        }

        if (this.bgBack) {
            this.bgBack.tilePositionX = this.player.x * 0.06;
        }
        if (this.bgMid) {
            this.bgMid.tilePositionX = this.player.x * 0.12;
        }

        const moveLeft = this.cursors.left.isDown || this.touchLeft;
        const moveRight = this.cursors.right.isDown || this.touchRight;
        const wantsJump = Phaser.Input.Keyboard.JustDown(this.cursors.up) ||
            Phaser.Input.Keyboard.JustDown(this.jumpKey) ||
            this.touchJump;

        const jumpHeld = this.cursors.up.isDown || this.jumpKey.isDown || this.touchJump;

        if (moveLeft) {
            this.player.setVelocityX(-PLAYER_SPEED);
            this.player.flipX = true;
        } else if (moveRight) {
            this.player.setVelocityX(PLAYER_SPEED);
            this.player.flipX = false;
        } else {
            this.player.setVelocityX(0);
        }

        if (wantsJump && this.player.body.blocked.down) {
            this.player.setVelocityY(PLAYER_JUMP_VELOCITY);
            this.touchJump = false;
            this.jumpCutApplied = false;
        }

        // Salto variable: si sueltas el botón mientras aún subes, recortamos la velocidad vertical.
        if (!jumpHeld && !this.jumpCutApplied && this.player.body.velocity.y < 0) {
            this.player.setVelocityY(this.player.body.velocity.y * JUMP_CUT_MULTIPLIER);
            this.jumpCutApplied = true;
        }

        if (this.player.body.blocked.down) {
            this.jumpCutApplied = false;
        }

        if (!this.player.body.blocked.down) {
            this.player.play('player-jump', true);
        } else if (moveLeft || moveRight) {
            this.player.play('player-run', true);
        } else {
            this.player.play('player-idle', true);
        }

    }
}

const config = {
    type: Phaser.AUTO,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    parent: 'game-container',
    backgroundColor: '#bcd7ff',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1400 },
            debug: false
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [EduMarioScene]
};

new Phaser.Game(config);
