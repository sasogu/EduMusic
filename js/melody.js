(() => {
  const NOTE_META = {
    do: {
      label: 'DO',
      key: 'd',
      freq: 261.63,
      offsetSteps: 2,
      pianoIndex: 0,
      color: '#22c55e',
      highlight: '#dcfce7',
      activeHighlight: '#bbf7d0',
    },
    re: {
      label: 'RE',
      key: 'r',
      freq: 293.66,
      offsetSteps: 1,
      pianoIndex: 1,
      color: '#06b6d4',
      highlight: '#cffafe',
      activeHighlight: '#a5f3fc',
    },
    mi: {
      label: 'MI',
      key: 'm',
      freq: 329.63,
      offsetSteps: 0,
      pianoIndex: 2,
      color: '#f97316',
      highlight: '#ffedd5',
      activeHighlight: '#fed7aa',
    },
    fa: {
      label: 'FA',
      key: 'f',
      freq: 349.23,
      offsetSteps: -1,
      pianoIndex: 3,
      color: '#10b981',
      highlight: '#dcfce7',
      activeHighlight: '#bbf7d0',
    },
    sol: {
      label: 'SOL',
      key: 's',
      freq: 392.0,
      offsetSteps: -2,
      pianoIndex: 4,
      color: '#2563eb',
      highlight: '#dbeafe',
      activeHighlight: '#bfdbfe',
    },
    la: {
      label: 'LA',
      key: 'l',
      freq: 440.0,
      offsetSteps: -3,
      pianoIndex: 5,
      color: '#a855f7',
      highlight: '#f3e8ff',
      activeHighlight: '#e9d5ff',
    },
    si: {
      label: 'SI',
      key: 'b',
      freq: 493.88,
      offsetSteps: -4,
      pianoIndex: 6,
      color: '#f43f5e',
      highlight: '#ffe4e6',
      activeHighlight: '#fecdd3',
    },
    do_high: {
      label: "DO'",
      key: 'c',
      freq: 523.25,
      offsetSteps: -5,
      pianoIndex: 7,
      color: '#ef4444',
      highlight: '#fee2e2',
      activeHighlight: '#fecaca',
    },
  };

  const WHITE_NOTES = ['do', 're', 'mi', 'fa', 'sol', 'la', 'si', 'do_high'];
  const WHITE_INDEX_TO_NOTE = WHITE_NOTES.slice();
  const KEYBOARD_MAP = {};
  WHITE_NOTES.forEach((noteId) => {
    const meta = NOTE_META[noteId];
    if (meta && meta.key) KEYBOARD_MAP[meta.key] = noteId;
  });

  const dom = {
    staffCanvas: document.getElementById('staffCanvas'),
    pianoCanvas: document.getElementById('pianoCanvas'),
    startBtn: document.getElementById('startMelodyBtn'),
    repeatBtn: document.getElementById('repeatMelodyBtn'),
    resetBtn: document.getElementById('resetMelodyBtn'),
    roundEl: document.getElementById('melodyRound'),
    bestEl: document.getElementById('melodyBest'),
    statusEl: document.getElementById('melodyStatus'),
  };
  if (!dom.staffCanvas || !dom.pianoCanvas) return;
  const staffCtx = dom.staffCanvas.getContext('2d');
  const pianoCtx = dom.pianoCanvas.getContext('2d');
  const DPR = Math.max(1, Math.floor(window.devicePixelRatio || 1));

  const BEST_KEY = 'EduMusic_melody_best';
  let storedBest = 0;
  try {
    const raw = localStorage.getItem(BEST_KEY);
    storedBest = raw ? Math.max(0, Number(raw) || 0) : 0;
  } catch {
    storedBest = 0;
  }

  const SCOREBOARD_ID = 'melody';
  function showScoreboardPrompt(score) {
    if (window.ScoreService && score > 0) {
      window.ScoreService.showSave(SCOREBOARD_ID, score);
    }
  }
  function hideScoreboardPrompt() {
    if (window.ScoreService) {
      window.ScoreService.hideSave(SCOREBOARD_ID);
    }
  }

  const state = {
    sequence: [],
    availableNotes: ['sol', 'mi', 'la', 'do'],
    unlockQueue: ['re', 'fa', 'si', 'do_high'],
    nextUnlockRound: 4,
    unlockStep: 2,
    round: 0,
    best: storedBest,
    userIndex: 0,
    playing: false,
    accepting: false,
    lastStatus: null,
  };

  const staff = {
    spacing: 18,
    lineYs: [],
    marginHorizontal: 48,
    top: 60,
    noteGap: 90,
    width: 0,
    height: 260,
    yBottomLine() { return this.lineYs[4]; },
    yTopLine() { return this.lineYs[0]; },
  };

  const piano = {
    whiteCount: WHITE_NOTES.length,
    width: 0,
    height: 200,
    keyW: 0,
    blackHeight: 0,
    pressed: {},
    blackDefs: [
      { over: 0, name: 'C#' },
      { over: 1, name: 'D#' },
      { over: 3, name: 'F#' },
      { over: 4, name: 'G#' },
      { over: 5, name: 'A#' },
    ],
    blackRects: [],
  };

  const audio = { ctx: null };

  function ensureAudio() {
    if (!audio.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) audio.ctx = new AC();
    }
  }

  function pianoTone(freq, durMs = 600, baseGain = 0.14) {
    ensureAudio();
    if (!audio.ctx) return;
    const ctxA = audio.ctx;
    const now = ctxA.currentTime;
    const out = ctxA.createGain();
    out.gain.setValueAtTime(1, now);

    const lp = ctxA.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(2400, now);
    lp.Q.setValueAtTime(0.7, now);
    lp.frequency.exponentialRampToValueAtTime(1100, now + Math.min(0.4, durMs / 1000));
    out.connect(lp).connect(ctxA.destination);

    const partials = [
      { mult: 1.0, type: 'triangle', weight: 0.9, decay: 0.7 },
      { mult: 2.0, type: 'sine', weight: 0.35, decay: 0.5 },
      { mult: 3.0, type: 'sine', weight: 0.18, decay: 0.35 },
      { mult: 4.0, type: 'sine', weight: 0.12, decay: 0.28 },
    ];
    const sec = durMs / 1000;
    for (const p of partials) {
      const osc = ctxA.createOscillator();
      const g = ctxA.createGain();
      osc.type = p.type;
      osc.frequency.setValueAtTime(freq * p.mult, now);
      const peak = baseGain * p.weight;
      g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(Math.max(0.001, peak), now + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, now + Math.max(0.08, sec * p.decay));
      osc.connect(g).connect(out);
      osc.start(now);
      osc.stop(now + sec + 0.05);
    }
  }

  function playNoteAudio(noteId, dur = 600) {
    const meta = NOTE_META[noteId];
    if (!meta) return;
    pianoTone(meta.freq, dur);
  }

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function translate(key, params, fallback) {
    if (window.i18n && typeof window.i18n.t === 'function') {
      const res = window.i18n.t(key, params);
      if (res && res !== key) return res;
    }
    if (fallback != null) return typeof fallback === 'function' ? fallback() : fallback;
    return key;
  }

  function setStatus(kind, key, fallback, params) {
    dom.statusEl.classList.remove('success', 'error', 'info');
    const text = translate(key, params, fallback);
    dom.statusEl.textContent = text || '';
    if (kind) dom.statusEl.classList.add(kind);
    state.lastStatus = { kind, key, fallback, params };
  }

  function updateHud() {
    dom.roundEl.textContent = String(state.round);
    dom.bestEl.textContent = String(state.best);
  }

  function saveBest() {
    try { localStorage.setItem(BEST_KEY, String(state.best)); } catch {}
  }

  function resizeStaff() {
    const cssWidth = Math.max(360, Math.min(window.innerWidth - 48, 760));
    const cssHeight = 260;
    dom.staffCanvas.style.width = cssWidth + 'px';
    dom.staffCanvas.style.height = cssHeight + 'px';
    dom.staffCanvas.width = cssWidth * DPR;
    dom.staffCanvas.height = cssHeight * DPR;
    staffCtx.setTransform(DPR, 0, 0, DPR, 0, 0);
    staff.width = cssWidth;
    staff.height = cssHeight;
    staff.spacing = Math.max(18, Math.min(30, Math.floor(cssHeight / 9)));
    staff.top = Math.floor(cssHeight / 2 - staff.spacing * 2);
    staff.marginHorizontal = Math.max(36, Math.floor(cssWidth * 0.08));
    staff.noteGap = Math.max(56, Math.min(120, Math.floor((cssWidth - staff.marginHorizontal * 2) / Math.max(4, state.sequence.length || 4))));
    staff.lineYs = [];
    for (let i = 0; i < 5; i++) {
      staff.lineYs.push(staff.top + i * staff.spacing);
    }
  }

  function resizePiano() {
    const cssWidth = Math.max(360, Math.min(window.innerWidth - 48, 760));
    const cssHeight = Math.max(160, Math.min(220, Math.floor(window.innerHeight * 0.28)));
    dom.pianoCanvas.style.width = cssWidth + 'px';
    dom.pianoCanvas.style.height = cssHeight + 'px';
    dom.pianoCanvas.width = cssWidth * DPR;
    dom.pianoCanvas.height = cssHeight * DPR;
    pianoCtx.setTransform(DPR, 0, 0, DPR, 0, 0);
    piano.width = cssWidth;
    piano.height = cssHeight;
    piano.keyW = cssWidth / piano.whiteCount;
    piano.blackHeight = Math.floor(cssHeight * 0.62);
    const blackW = piano.keyW * 0.6;
    piano.blackRects = piano.blackDefs.map(def => {
      const x = (def.over + 1) * piano.keyW - blackW / 2;
      return { x, y: 0, w: blackW, h: piano.blackHeight };
    });
  }

  function yForNote(noteId) {
    const meta = NOTE_META[noteId];
    if (!meta) return staff.yBottomLine();
    const base = staff.yBottomLine();
    return base + (meta.offsetSteps || 0) * (staff.spacing / 2);
  }

  function drawLedgerLines(noteX, radius, offsetSteps) {
    if (offsetSteps == null) return;
    const halfStep = staff.spacing / 2;
    const bottom = staff.yBottomLine();
    const left = noteX - radius - 10;
    const right = noteX + radius + 10;
    const drawLineAt = (y) => {
      staffCtx.beginPath();
      staffCtx.moveTo(left, y);
      staffCtx.lineTo(right, y);
      staffCtx.stroke();
    };
    staffCtx.save();
    staffCtx.strokeStyle = '#475569';
    staffCtx.lineWidth = 1.3;
    if (offsetSteps > 1) {
      for (let s = 2; s <= offsetSteps; s += 2) {
        const y = bottom + s * halfStep;
        drawLineAt(y);
      }
    }
    if (offsetSteps <= -6) {
      for (let s = -6; s >= offsetSteps; s -= 2) {
        const y = bottom + s * halfStep;
        drawLineAt(y);
      }
    }
    staffCtx.restore();
  }

  function drawStaff() {
    staffCtx.save();
    staffCtx.clearRect(0, 0, dom.staffCanvas.clientWidth, dom.staffCanvas.clientHeight);
    staffCtx.strokeStyle = '#94a3b8';
    staffCtx.lineWidth = 1.2;
    const left = staff.marginHorizontal;
    const right = staff.width - staff.marginHorizontal;
    for (const y of staff.lineYs) {
      staffCtx.beginPath();
      staffCtx.moveTo(left, y);
      staffCtx.lineTo(right, y);
      staffCtx.stroke();
    }
    staffCtx.restore();
  }

  function drawSequence(highlightIndex = -1) {
    drawStaff();
    const count = state.sequence.length;
    if (!count) return;
    const left = staff.marginHorizontal;
    const right = staff.width - staff.marginHorizontal;
    const gap = count > 1 ? Math.min(staff.noteGap, (right - left) / (count - 1)) : 0;
    const radius = Math.max(12, Math.floor(staff.spacing * 0.55));
    for (let i = 0; i < count; i++) {
      const noteId = state.sequence[i];
      const meta = NOTE_META[noteId];
      const x = count > 1 ? left + i * gap : (left + right) / 2;
      const y = yForNote(noteId);
      const isHighlight = i === highlightIndex;
      const fill = isHighlight ? (meta?.color || '#2563eb') : '#0f172a';
      drawLedgerLines(x, radius, meta ? meta.offsetSteps : 0);
      staffCtx.save();
      staffCtx.beginPath();
      staffCtx.fillStyle = fill;
      staffCtx.ellipse(x, y, radius + 4, radius, Math.PI / 8, 0, Math.PI * 2);
      staffCtx.fill();
      staffCtx.restore();
      staffCtx.save();
      staffCtx.strokeStyle = '#0f172a';
      staffCtx.lineWidth = 2;
      staffCtx.beginPath();
      staffCtx.moveTo(x + radius, y);
      staffCtx.lineTo(x + radius, y - staff.spacing * 2);
      staffCtx.stroke();
      staffCtx.restore();
    }
  }

  function drawPiano() {
    pianoCtx.clearRect(0, 0, dom.pianoCanvas.clientWidth, dom.pianoCanvas.clientHeight);
    const availableSet = new Set(state.availableNotes);
    const now = performance.now();
    for (let i = 0; i < piano.whiteCount; i++) {
      const noteId = WHITE_INDEX_TO_NOTE[i];
      const meta = NOTE_META[noteId];
      const x = i * piano.keyW;
      const unlocked = availableSet.has(noteId);
      const pressed = piano.pressed[noteId];
      let fill = unlocked ? '#ffffff' : '#e2e8f0';
      let stroke = unlocked ? '#cbd5e1' : '#cbd5e1';
      let labelColor = unlocked ? '#0f172a' : '#94a3b8';
      if (pressed) {
        if (pressed.mode === 'playback') {
          fill = meta?.highlight || '#dbeafe';
          stroke = meta?.color || '#2563eb';
        } else {
          fill = meta?.activeHighlight || '#dcfce7';
          stroke = meta?.color || '#16a34a';
        }
      }
      pianoCtx.save();
      pianoCtx.fillStyle = fill;
      pianoCtx.strokeStyle = stroke;
      pianoCtx.lineWidth = 1.4;
      pianoCtx.beginPath();
      pianoCtx.roundRect(x + 1, 1, piano.keyW - 2, piano.height - 2, 10);
      pianoCtx.fill();
      pianoCtx.stroke();
      pianoCtx.fillStyle = labelColor;
      pianoCtx.font = '700 16px "Inter", "Segoe UI", system-ui';
      pianoCtx.textAlign = 'center';
      pianoCtx.textBaseline = 'middle';
      pianoCtx.fillText(meta?.label || noteId.toUpperCase(), x + piano.keyW / 2, piano.height - 22);
      if (meta?.key) {
        pianoCtx.font = '600 13px "Inter", "Segoe UI", system-ui';
        pianoCtx.fillStyle = '#64748b';
        pianoCtx.fillText(meta.key.toUpperCase(), x + piano.keyW / 2, 22);
      }
      pianoCtx.restore();
    }
    pianoCtx.save();
    for (let i = 0; i < piano.blackRects.length; i++) {
      const rect = piano.blackRects[i];
      pianoCtx.fillStyle = '#111827';
      pianoCtx.beginPath();
      pianoCtx.roundRect(rect.x, rect.y, rect.w, rect.h, 6);
      pianoCtx.fill();
    }
    pianoCtx.restore();
  }

  function renderScene(highlightIndex = -1) {
    drawSequence(highlightIndex);
    drawPiano();
  }

  function setKeyHighlight(noteId, mode, active) {
    const meta = NOTE_META[noteId];
    if (!meta) return;
    if (active) {
      piano.pressed[noteId] = { mode, at: performance.now() };
    } else {
      delete piano.pressed[noteId];
    }
  }

  function randomNote() {
    const playable = state.availableNotes;
    return playable[(Math.random() * playable.length) | 0];
  }

  function maybeUnlockNote() {
    if (!state.unlockQueue.length) return null;
    if (state.round >= state.nextUnlockRound) {
      const nextNote = state.unlockQueue.shift();
      if (!state.availableNotes.includes(nextNote)) {
        state.availableNotes.push(nextNote);
      }
      state.nextUnlockRound += state.unlockStep;
      return nextNote;
    }
    return null;
  }

  async function playSequence() {
    if (!state.sequence.length) return;
    state.playing = true;
    state.accepting = false;
    setStatus('info', 'melody.status.listening', 'Escucha la secuencia…');
    updateControls();
    await delay(320);
    for (let i = 0; i < state.sequence.length; i++) {
      const noteId = state.sequence[i];
      setKeyHighlight(noteId, 'playback', true);
      renderScene(i);
      playNoteAudio(noteId, 560);
      await delay(600);
      setKeyHighlight(noteId, 'playback', false);
      renderScene();
      await delay(140);
    }
    state.playing = false;
    state.accepting = true;
    state.userIndex = 0;
    setStatus('info', 'melody.status.turn', 'Tu turno: reproduce la secuencia.');
    updateControls();
  }

  async function startGame() {
    hideScoreboardPrompt();
    state.sequence = [];
    state.round = 0;
    state.userIndex = 0;
    state.accepting = false;
    setStatus('info', 'melody.status.ready', 'Pulsa Iniciar para escuchar la secuencia.');
    await delay(100);
    await nextRound();
  }

  async function nextRound() {
    const next = randomNote();
    state.sequence.push(next);
    state.round += 1;
    state.userIndex = 0;
    updateHud();
    resizeAll();
    setStatus('info', 'melody.status.listening', 'Escucha la secuencia…');
    renderScene();
    await playSequence();
  }

  function finishRoundSuccess() {
    if (state.round > state.best) {
      state.best = state.round;
      saveBest();
    }
    const unlocked = maybeUnlockNote();
    if (unlocked) {
      const meta = NOTE_META[unlocked];
      renderScene();
      setStatus('success', 'melody.status.unlock', {
        note: meta?.label || unlocked.toUpperCase(),
      }, () => `¡Nueva nota desbloqueada: ${meta?.label || unlocked.toUpperCase()}!`);
    } else {
      setStatus('success', 'melody.status.round_complete', '¡Genial! Se añade una nota más.');
    }
    updateControls();
    setTimeout(() => {
      if (!state.accepting && !state.playing) nextRound();
    }, 900);
  }

  function handleGameOver() {
    const finalScore = state.round;
    state.accepting = false;
    state.playing = false;
    state.sequence = [];
    state.round = 0;
    state.userIndex = 0;
    renderScene();
    updateHud();
    setStatus('error', 'melody.status.fail', 'Se rompió la secuencia. Pulsa Iniciar para intentarlo de nuevo.');
    updateControls();
    if (finalScore > 0) {
      showScoreboardPrompt(finalScore);
    }
  }

  function handleUserInput(noteId, source) {
    if (!state.accepting || state.playing) return;
    if (!state.availableNotes.includes(noteId)) return;
    const meta = NOTE_META[noteId];
    if (!meta) return;
    setKeyHighlight(noteId, 'user', true);
    renderScene();
    playNoteAudio(noteId, 520);
    setTimeout(() => {
      setKeyHighlight(noteId, 'user', false);
      renderScene();
    }, 140);
    const expected = state.sequence[state.userIndex];
    if (noteId === expected) {
      state.userIndex += 1;
      if (state.userIndex >= state.sequence.length) {
        state.accepting = false;
        finishRoundSuccess();
      } else {
        setStatus('info', 'melody.status.keep_going', '¡Bien! Sigue con la secuencia.');
      }
    } else {
      handleGameOver();
    }
  }

  function updateControls() {
    const hasSeq = state.sequence.length > 0;
    dom.startBtn.disabled = state.playing;
    dom.repeatBtn.disabled = !hasSeq || state.playing;
    dom.resetBtn.disabled = state.playing;
  }

  function resetGame() {
    hideScoreboardPrompt();
    state.sequence = [];
    state.round = 0;
    state.userIndex = 0;
    state.accepting = false;
    state.playing = false;
    renderScene();
    updateHud();
    setStatus('info', 'melody.status.ready', 'Pulsa Iniciar para escuchar la secuencia.');
    updateControls();
  }

  function resizeAll() {
    resizeStaff();
    resizePiano();
    renderScene();
  }

  function handlePianoPointer(ev) {
    ensureAudio();
    const rect = dom.pianoCanvas.getBoundingClientRect();
    const scaleX = piano.width / rect.width;
    const scaleY = piano.height / rect.height;
    const x = (ev.clientX - rect.left) * scaleX;
    const y = (ev.clientY - rect.top) * scaleY;
    // Check black keys first
    for (const rectB of piano.blackRects) {
      if (x >= rectB.x && x <= rectB.x + rectB.w && y >= rectB.y && y <= rectB.y + rectB.h) {
        return; // decorative only
      }
    }
    const index = Math.floor(x / piano.keyW);
    if (index < 0 || index >= WHITE_NOTES.length) return;
    const noteId = WHITE_INDEX_TO_NOTE[index];
    handleUserInput(noteId, 'pointer');
  }

  dom.startBtn.addEventListener('click', () => {
    if (state.playing) return;
    startGame();
    updateControls();
  });
  dom.repeatBtn.addEventListener('click', () => {
    if (state.playing || !state.sequence.length) return;
    state.accepting = false;
    playSequence();
  });
  dom.resetBtn.addEventListener('click', () => {
    if (state.playing) return;
    resetGame();
  });

  dom.pianoCanvas.addEventListener('pointerdown', handlePianoPointer);

  window.addEventListener('resize', () => {
    resizeAll();
  });

  function isTypingTarget(el) {
    if (!el) return false;
    const tag = el.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return true;
    return Boolean(el.isContentEditable);
  }

  window.addEventListener('keydown', (ev) => {
    const target = ev.target;
    const active = document.activeElement;
    if (isTypingTarget(target) || isTypingTarget(active)) {
      return;
    }
    const key = ev.key.toLowerCase();
    if (key === ' ') {
      if (!state.playing && !state.accepting) {
        startGame();
        ev.preventDefault();
      }
      return;
    }
    const mapped = KEYBOARD_MAP[key];
    if (mapped) {
      handleUserInput(mapped, 'keyboard');
      ev.preventDefault();
    }
  });

  function applyTranslations() {
    if (state.lastStatus) {
      const { kind, key, fallback, params } = state.lastStatus;
      setStatus(kind, key, fallback, params);
    }
    renderScene();
  }

  function bindI18n() {
    if (window.i18n && typeof window.i18n.onChange === 'function') {
      window.i18n.onChange(() => {
        applyTranslations();
      });
    } else {
      setTimeout(bindI18n, 120);
    }
  }

  resizeAll();
  updateHud();
  setStatus('info', 'melody.status.ready', 'Pulsa Iniciar para escuchar la secuencia.');
  updateControls();
  bindI18n();
})();
