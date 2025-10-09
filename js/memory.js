(() => {
  const grid = document.getElementById('memoryGrid');
  if (!grid) return;

  const startBtn = document.getElementById('memoryStart');
  const resetBtn = document.getElementById('memoryReset');
  const audioToggle = document.getElementById('memoryAudio');
  const modeRadios = Array.from(document.querySelectorAll('input[name="memoryMode"]'));
  const deckSelect = document.getElementById('memoryDeck');
  const pairsEl = document.getElementById('memoryPairs');
  const attemptsEl = document.getElementById('memoryAttempts');
  const timeEl = document.getElementById('memoryTime');
  const messageEl = document.getElementById('memoryMessage');
  const turnEl = document.getElementById('memoryTurn');
  const scoresEl = document.getElementById('memoryScores');

  const INSTRUMENTS = [
    {
      id: 'piano',
      pool: 'base',
      emoji: '🎹',
      color: '#2563eb',
      label: { es: 'Piano', val: 'Piano' },
      family: { es: 'Cuerda percutida', val: 'Corda percudida' },
      audio: { sample: '/assets/audio/piano.ogg' }
    },
    {
      id: 'violin',
      pool: 'base',
      emoji: '🎻',
      color: '#9333ea',
      label: { es: 'Violín', val: 'Violí' },
      family: { es: 'Cuerda frotada', val: 'Corda fregada' },
      audio: { sample: '/assets/audio/violin.ogg' }
    },
    {
      id: 'trumpet',
      pool: 'base',
      emoji: '🎺',
      color: '#f59e0b',
      label: { es: 'Trompeta', val: 'Trompeta' },
      family: { es: 'Viento metal', val: 'Vent metall' },
      audio: { sample: '/assets/audio/trompeta.ogg' }
    },
    {
      id: 'flute',
      pool: 'base',
      emoji: '🪈',
      color: '#0ea5e9',
      label: { es: 'Flauta', val: 'Flauta' },
      family: { es: 'Viento madera', val: 'Vent-fusta' },
      audio: { sample: '/assets/audio/flute.ogg' }
    },
    {
      id: 'guitar',
      pool: 'base',
      emoji: '🎸',
      color: '#f97316',
      label: { es: 'Guitarra', val: 'Guitarra' },
      family: { es: 'Cuerda pulsada', val: 'Corda polsada' },
      audio: { sample: '/assets/audio/guitar.ogg' }
    },
    {
      id: 'cajon',
      pool: 'base',
      emoji: '🥁',
      color: '#22c55e',
      label: { es: 'Cajón', val: 'Caixó' },
      family: { es: 'Percusión', val: 'Percussió' },
      audio: { sample: '/assets/audio/bongos.ogg' }
    },
    {
      id: 'clarinet',
      pool: 'orchestra',
      emoji: '🎷',
      color: '#38bdf8',
      label: { es: 'Clarinete', val: 'Clarinet' },
      family: { es: 'Viento madera', val: 'Vent-fusta' },
      audio: {
        type: 'sine',
        melody: [
          { freq: 196.0, dur: 0.32 },
          { freq: 261.63, dur: 0.28 },
          { freq: 329.63, dur: 0.5 }
        ]
      }
    },
    {
      id: 'cello',
      pool: 'orchestra',
      emoji: '🎻',
      color: '#b45309',
      label: { es: 'Violonchelo', val: 'Violoncel' },
      family: { es: 'Cuerda frotada grave', val: 'Corda fregada greu' },
      audio: {
        type: 'triangle',
        melody: [
          { freq: 130.81, dur: 0.45 },
          { freq: 174.61, dur: 0.35 },
          { freq: 196.0, dur: 0.6 }
        ]
      }
    },
    {
      id: 'trombone',
      pool: 'orchestra',
      emoji: '📯',
      color: '#fbbf24',
      label: { es: 'Trombón', val: 'Trombó' },
      family: { es: 'Viento metal', val: 'Vent metall' },
      audio: {
        type: 'square',
        melody: [
          { freq: 174.61, dur: 0.4 },
          { freq: 220.0, dur: 0.32 },
          { freq: 261.63, dur: 0.5 }
        ]
      }
    },
    {
      id: 'harp',
      pool: 'orchestra',
      emoji: '🪕',
      color: '#d946ef',
      label: { es: 'Arpa', val: 'Arpa' },
      family: { es: 'Cuerda pulsada', val: 'Corda polsada' },
      audio: {
        type: 'triangle',
        melody: [
          { freq: 246.94, dur: 0.3 },
          { freq: 329.63, dur: 0.3 },
          { freq: 392.0, dur: 0.6, gap: 0.08 }
        ]
      }
    },
    {
      id: 'oboe',
      pool: 'orchestra',
      emoji: '🎶',
      color: '#0ea5e9',
      label: { es: 'Oboe', val: 'Oboè' },
      family: { es: 'Viento madera', val: 'Vent-fusta' },
      audio: {
        type: 'sawtooth',
        melody: [
          { freq: 293.66, dur: 0.32 },
          { freq: 349.23, dur: 0.28 },
          { freq: 440.0, dur: 0.5 }
        ]
      }
    },
    {
      id: 'bassoon',
      pool: 'orchestra',
      emoji: '🎼',
      color: '#64748b',
      label: { es: 'Fagot', val: 'Fagot' },
      family: { es: 'Viento madera grave', val: 'Vent-fusta greu' },
      audio: {
        type: 'square',
        melody: [
          { freq: 98.0, dur: 0.4 },
          { freq: 146.83, dur: 0.32 },
          { freq: 174.61, dur: 0.55 }
        ]
      }
    }
  ];

  const DEFAULT_POOL = 'base';

  const state = {
    pool: DEFAULT_POOL,
    deck: [],
    firstCard: null,
    revealIds: new Set(),
    matchedIds: new Set(),
    lock: false,
    matches: 0,
    attempts: 0,
    startTime: null,
    timerId: null,
    elapsed: 0,
    audioOn: true,
    lastMessage: null,
    mode: 'solo',
    turn: 1,
    scores: { 1: 0, 2: 0 },
    totalPairs: 0
  };

  function getInstrument(instId) {
    return INSTRUMENTS.find((inst) => inst.id === instId) || null;
  }

  function isValidPool(pool) {
    return INSTRUMENTS.some((inst) => inst.pool === pool);
  }

  function getPoolDefs(pool) {
    const list = INSTRUMENTS.filter((inst) => inst.pool === pool);
    if (list.length > 0) return list;
    return INSTRUMENTS.filter((inst) => inst.pool === DEFAULT_POOL);
  }

  const audioEngine = {
    ctx: null,
    buffers: new Map(),
    loading: new Map(),
    currentSource: null,
    ensure() {
      if (this.ctx) return true;
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return false;
      this.ctx = new AC();
      return true;
    },
    async loadSample(instId) {
      if (!this.ensure()) return null;
      if (this.buffers.has(instId)) return this.buffers.get(instId);
      if (this.loading.has(instId)) return this.loading.get(instId);
      const inst = getInstrument(instId);
      const url = inst && inst.audio && inst.audio.sample;
      if (!url) return null;
      const promise = fetch(url)
        .then((res) => {
          if (!res.ok) throw new Error('audio fetch failed');
          return res.arrayBuffer();
        })
        .then((buf) => this.ctx.decodeAudioData(buf))
        .then((decoded) => {
          this.buffers.set(instId, decoded);
          this.loading.delete(instId);
          return decoded;
        })
        .catch((err) => {
          console.warn('No se pudo cargar el audio', instId, err);
          this.loading.delete(instId);
          return null;
        });
      this.loading.set(instId, promise);
      return promise;
    },
    stopCurrent() {
      if (this.currentSource) {
        try { this.currentSource.stop(); } catch (_) {}
        this.currentSource = null;
      }
    },
    playSynth(inst) {
      const def = inst && inst.audio;
      if (!def || !Array.isArray(def.melody)) return;
      if (!this.ensure()) return;
      const ctx = this.ctx;
      const baseType = def.type || 'sine';
      let t = ctx.currentTime;
      def.melody.forEach((note) => {
        const type = note.type || baseType;
        if (note.noise) {
          const duration = Math.min(1.5, note.dur || 0.4);
          const buffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
          const channel = buffer.getChannelData(0);
          for (let i = 0; i < channel.length; i++) {
            const decay = Math.pow(1 - i / channel.length, 2.3);
            channel[i] = (Math.random() * 2 - 1) * decay;
          }
          const noise = ctx.createBufferSource();
          noise.buffer = buffer;
          const gain = ctx.createGain();
          const peak = note.gain || 0.22;
          gain.gain.setValueAtTime(0.001, t);
          gain.gain.exponentialRampToValueAtTime(Math.max(0.01, peak), t + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
          noise.connect(gain).connect(ctx.destination);
          noise.start(t);
          noise.stop(t + duration + 0.02);
          t += duration + (note.gap != null ? note.gap : 0.05);
        } else {
          const osc = ctx.createOscillator();
          osc.type = type;
          osc.frequency.setValueAtTime(note.freq || 440, t);
          const gain = ctx.createGain();
          const peak = note.gain || 0.18;
          gain.gain.setValueAtTime(0.001, t);
          const dur = Math.max(0.15, note.dur || 0.35);
          gain.gain.exponentialRampToValueAtTime(Math.max(0.01, peak), t + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
          osc.connect(gain).connect(ctx.destination);
          osc.start(t);
          osc.stop(t + dur + 0.05);
          t += dur + (note.gap != null ? note.gap : 0.05);
        }
      });
    },
    async play(instId) {
      if (!state.audioOn || !this.ensure()) return;
      const inst = getInstrument(instId);
      if (!inst) return;
      const buffer = await this.loadSample(instId);
      if (buffer) {
        this.stopCurrent();
        const ctx = this.ctx;
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.9, ctx.currentTime + 0.02);
        const duration = Math.max(0.4, buffer.duration);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration + 0.05);
        source.connect(gain).connect(ctx.destination);
        source.start();
        this.currentSource = source;
        source.onended = () => {
          if (this.currentSource === source) this.currentSource = null;
        };
        return;
      }
      this.stopCurrent();
      this.playSynth(inst);
    }
  };

  function shuffle(list) {
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    return list;
  }

  function buildDeck(instDefs) {
    const deck = [];
    instDefs.forEach((inst) => {
      deck.push({ uid: `${inst.id}-sound`, instrument: inst.id, kind: 'sound' });
      deck.push({ uid: `${inst.id}-visual`, instrument: inst.id, kind: 'visual' });
    });
    return shuffle(deck);
  }

  function getLang() {
    return window.i18n ? window.i18n.getLang() : 'es';
  }

  function getLabel(instId) {
    const lang = getLang();
    const inst = getInstrument(instId);
    if (!inst) return instId;
    return inst.label[lang] || inst.label.es || instId;
  }

  function getFamily(instId) {
    const lang = getLang();
    const inst = getInstrument(instId);
    if (!inst) return '';
    return inst.family[lang] || inst.family.es || '';
  }

  function readSelectedMode() {
    const selected = modeRadios.find((r) => r.checked);
    return selected && selected.value === 'versus' ? 'versus' : 'solo';
  }

  function readSelectedPool() {
    if (deckSelect && deckSelect.value && isValidPool(deckSelect.value)) return deckSelect.value;
    return DEFAULT_POOL;
  }

  function setMessage(key, params) {
    state.lastMessage = { key, params };
    if (!messageEl) return;
    if (window.i18n) {
      messageEl.textContent = window.i18n.t(key, params);
    } else {
      messageEl.textContent = key;
    }
  }

  function updateStats() {
    const mins = Math.floor(state.elapsed / 60).toString().padStart(2, '0');
    const secs = Math.floor(state.elapsed % 60).toString().padStart(2, '0');

    if (window.i18n) {
      if (pairsEl) pairsEl.textContent = window.i18n.t('memory.stats.matches', { found: state.matches, total: state.totalPairs });
      if (attemptsEl) attemptsEl.textContent = window.i18n.t('memory.stats.attempts', { n: state.attempts });
      if (timeEl) timeEl.textContent = window.i18n.t('memory.stats.time', { t: `${mins}:${secs}` });
      if (state.mode === 'versus') {
        if (turnEl) {
          turnEl.style.display = '';
          turnEl.textContent = window.i18n.t('memory.stats.turn', { n: state.turn });
        }
        if (scoresEl) {
          scoresEl.style.display = '';
          scoresEl.textContent = window.i18n.t('memory.stats.scores', { p1: state.scores[1], p2: state.scores[2] });
        }
      } else {
        if (turnEl) turnEl.style.display = 'none';
        if (scoresEl) scoresEl.style.display = 'none';
      }
    } else {
      if (pairsEl) pairsEl.textContent = `Parejas: ${state.matches}/${state.totalPairs}`;
      if (attemptsEl) attemptsEl.textContent = `Intentos: ${state.attempts}`;
      if (timeEl) timeEl.textContent = `Tiempo: ${mins}:${secs}`;
      if (state.mode === 'versus') {
        if (turnEl) {
          turnEl.style.display = '';
          turnEl.textContent = `Turno: Jugador ${state.turn}`;
        }
        if (scoresEl) {
          scoresEl.style.display = '';
          scoresEl.textContent = `Marcador — J1: ${state.scores[1]} · J2: ${state.scores[2]}`;
        }
      } else {
        if (turnEl) turnEl.style.display = 'none';
        if (scoresEl) scoresEl.style.display = 'none';
      }
    }
  }

  function refreshDynamicLabels() {
    grid.querySelectorAll('.memory-face.front.visual .instr-name').forEach((el) => {
      const inst = el.getAttribute('data-instrument');
      el.textContent = getLabel(inst);
    });
    grid.querySelectorAll('.memory-face.front.visual .family').forEach((el) => {
      const inst = el.getAttribute('data-instrument');
      el.textContent = getFamily(inst);
    });
    if (state.lastMessage && window.i18n) {
      messageEl.textContent = window.i18n.t(state.lastMessage.key, state.lastMessage.params);
    }
    updateStats();
  }

  function stopTimer() {
    if (state.timerId) {
      clearInterval(state.timerId);
      state.timerId = null;
    }
  }

  function tickTimer() {
    if (!state.startTime) return;
    const now = performance.now();
    state.elapsed = Math.floor((now - state.startTime) / 1000);
    updateStats();
  }

  function startTimer() {
    stopTimer();
    state.startTime = performance.now();
    state.elapsed = 0;
    state.timerId = setInterval(tickTimer, 1000);
    tickTimer();
  }

  function resetState() {
    const defs = getPoolDefs(state.pool);
    state.totalPairs = defs.length;
    state.deck = buildDeck(defs);
    state.firstCard = null;
    state.revealIds.clear();
    state.matchedIds.clear();
    state.lock = false;
    state.matches = 0;
    state.attempts = 0;
    state.elapsed = 0;
    state.turn = 1;
    state.scores = { 1: 0, 2: 0 };
  }

  function createCardElement(card) {
    const wrapper = document.createElement('div');
    wrapper.className = 'memory-card';

    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.uid = card.uid;
    button.dataset.instrument = card.instrument;
    button.dataset.kind = card.kind;

    const back = document.createElement('div');
    back.className = 'memory-face back';
    back.textContent = '🎵';

    const front = document.createElement('div');
    front.className = `memory-face front ${card.kind}`;

    if (card.kind === 'visual') {
      const inst = getInstrument(card.instrument);
      if (inst) {
        front.style.background = 'rgba(255,255,255,0.96)';
        front.style.border = `2px solid ${inst.color}`;
        front.style.color = '#0f172a';
      }
      const icon = document.createElement('span');
      icon.style.fontSize = '28px';
      icon.textContent = inst ? inst.emoji : '🎶';
      const name = document.createElement('span');
      name.className = 'instr-name';
      name.setAttribute('data-instrument', card.instrument);
      name.textContent = getLabel(card.instrument);
      const fam = document.createElement('span');
      fam.className = 'family';
      fam.setAttribute('data-instrument', card.instrument);
      fam.textContent = getFamily(card.instrument);
      front.appendChild(icon);
      front.appendChild(name);
      front.appendChild(fam);
    } else {
      front.style.background = '#111827';
      front.style.color = '#f8fafc';
      front.style.border = '2px solid #0f172a';
      const icon = document.createElement('span');
      icon.style.fontSize = '32px';
      icon.textContent = '🔊';
      const label = document.createElement('span');
      label.className = 'listen-label';
      label.setAttribute('data-i18n', 'memory.card.listen');
      label.textContent = window.i18n ? window.i18n.t('memory.card.listen') : 'Escucha';
      front.appendChild(icon);
      front.appendChild(label);
    }

    button.appendChild(back);
    button.appendChild(front);
    button.addEventListener('click', onCardClick);

    wrapper.appendChild(button);
    return wrapper;
  }

  function renderDeck() {
    grid.innerHTML = '';
    const fragment = document.createDocumentFragment();
    state.deck.forEach((card) => {
      const el = createCardElement(card);
      const btn = el.querySelector('button');
      if (state.matchedIds.has(card.uid) || state.revealIds.has(card.uid)) {
        btn.classList.add('flipped');
        if (state.matchedIds.has(card.uid)) {
          btn.disabled = true;
        }
      }
      fragment.appendChild(el);
    });
    grid.appendChild(fragment);
    if (window.i18n) window.i18n.apply(grid);
    refreshDynamicLabels();
  }

  function onCardClick(event) {
    const btn = event.currentTarget;
    const uid = btn.dataset.uid;
    if (state.lock || state.matchedIds.has(uid) || state.revealIds.has(uid)) return;

    btn.classList.add('flipped');
    state.revealIds.add(uid);

    const instrument = btn.dataset.instrument;
    Promise.resolve(audioEngine.play(instrument)).catch(() => {});

    if (!state.firstCard) {
      state.firstCard = btn;
      return;
    }

    state.lock = true;
    state.attempts += 1;
    updateStats();

    const firstInstrument = state.firstCard.dataset.instrument;
    if (instrument === firstInstrument && btn !== state.firstCard) {
      // Match!
      state.matchedIds.add(uid);
      state.matchedIds.add(state.firstCard.dataset.uid);
      state.revealIds.delete(uid);
      state.revealIds.delete(state.firstCard.dataset.uid);
      btn.disabled = true;
      state.firstCard.disabled = true;
      state.matches += 1;
      if (state.mode === 'versus') {
        state.scores[state.turn] = (state.scores[state.turn] || 0) + 1;
        setMessage('memory.message.match.turn', { name: getLabel(instrument), n: state.turn });
      } else {
        setMessage('memory.message.match', { name: getLabel(instrument) });
      }
      if (state.matches === state.totalPairs) {
        stopTimer();
        setTimeout(() => {
          if (state.mode === 'versus') {
            const s1 = state.scores[1] || 0;
            const s2 = state.scores[2] || 0;
            const key = s1 === s2 ? 'memory.message.win.tie' : (s1 > s2 ? 'memory.message.win.p1' : 'memory.message.win.p2');
            setMessage(key, { attempts: state.attempts, time: formatElapsed(), p1: s1, p2: s2 });
          } else {
            setMessage('memory.message.win', { attempts: state.attempts, time: formatElapsed() });
          }
        }, 400);
      }
      state.firstCard = null;
      state.lock = false;
    } else {
      setMessage('memory.message.try', {});
      const prev = state.firstCard;
      setTimeout(() => {
        btn.classList.remove('flipped');
        prev.classList.remove('flipped');
        state.revealIds.delete(uid);
        state.revealIds.delete(prev.dataset.uid);
        state.firstCard = null;
        if (state.mode === 'versus') {
          state.turn = state.turn === 1 ? 2 : 1;
        }
        state.lock = false;
        updateStats();
      }, 900);
      return;
    }
    updateStats();
  }

  function formatElapsed() {
    const mins = Math.floor(state.elapsed / 60).toString().padStart(2, '0');
    const secs = Math.floor(state.elapsed % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  }

  function startGame() {
    stopTimer();
    audioEngine.stopCurrent();
    state.mode = readSelectedMode();
    state.pool = readSelectedPool();
    resetState();
    state.audioOn = audioToggle ? !!audioToggle.checked : true;
    renderDeck();
    startTimer();
    state.revealIds.clear();
    setMessage('memory.message.ready', {});
    updateStats();
  }

  function resetBoardSameDeck() {
    stopTimer();
    audioEngine.stopCurrent();
    state.mode = readSelectedMode();
    state.pool = readSelectedPool();
    resetState();
    renderDeck();
    startTimer();
    setMessage('memory.message.ready', {});
    updateStats();
  }

  if (startBtn) startBtn.addEventListener('click', () => startGame());
  if (resetBtn) resetBtn.addEventListener('click', () => resetBoardSameDeck());
  if (audioToggle) audioToggle.addEventListener('change', () => {
    state.audioOn = !!audioToggle.checked;
    if (!state.audioOn) audioEngine.stopCurrent();
  });
  if (modeRadios.length) {
    modeRadios.forEach((radio) => {
      radio.addEventListener('change', () => {
        if (radio.checked) {
          state.mode = readSelectedMode();
          resetBoardSameDeck();
        }
      });
    });
  }
  if (deckSelect) {
    deckSelect.addEventListener('change', () => {
      state.pool = readSelectedPool();
      resetBoardSameDeck();
    });
  }

  if (window.i18n && typeof window.i18n.onChange === 'function') {
    window.i18n.onChange(() => {
      refreshDynamicLabels();
    });
  }

  // Initialize first board
  startGame();
})();
