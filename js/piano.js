(function() {
  const KEYBOARD_POOL = [
    'a','w','s','e','d','f','t','g','y','h','u','j',
    'k','o','l','p',';','[','\'',']','\\','1','2','3','4'
  ];
  const NOTE_NAMES = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
  const SHARP_NOTES = new Set(['C#','D#','F#','G#','A#']);
  const START_NOTE = { octave: 4, index: 0 }; // C4
  const END_NOTE = { octave: 5, index: NOTE_NAMES.indexOf('F') }; // F5
  const DEFAULT_AUDIO_START = 7; // key07.ogg -> Do4 con las muestras actuales
  const AUDIO_START_INDEX = (function() {
    if (typeof window === 'undefined') return DEFAULT_AUDIO_START;
    const user = Number(window.pianoAudioBaseIndex);
    return Number.isFinite(user) && user >= 1 ? user : DEFAULT_AUDIO_START;
  })();
  const AUDIO_PATH_PREFIX = '../assets/piano/';
  const AUDIO_FILE_PREFIX = 'key';
  const PLAYBACK_RATE = 2; // reproducir una octava más aguda
  const SOLFEGE = {
    C: 'Do',
    'C#': 'Do♯',
    D: 'Re',
    'D#': 'Re♯',
    E: 'Mi',
    F: 'Fa',
    'F#': 'Fa♯',
    G: 'Sol',
    'G#': 'Sol♯',
    A: 'La',
    'A#': 'La♯',
    B: 'Si'
  };

  const keyBindings = new Map();
  const pressedKeys = new Set();
  const audioEntries = new Map();
  let audioCtx = null;
  let audioSupportWarned = false;
  let triggerIndex = 0;
  let noteSequence = [];

  function t(key, params, fallback) {
    if (window.i18n && typeof window.i18n.t === 'function') {
      return window.i18n.t(key, params);
    }
    return fallback != null ? fallback : key;
  }

  function nextTrigger() {
    if (triggerIndex >= KEYBOARD_POOL.length) return null;
    return KEYBOARD_POOL[triggerIndex++];
  }

  function noteDisplay(noteName, octave) {
    const base = SOLFEGE[noteName] || noteName;
    return base + octave;
  }

  function padIndex(num) {
    return String(num).padStart(2, '0');
  }

  function ensureAudioContext() {
    if (audioCtx) return audioCtx;
    const Ctor = window.AudioContext || window.webkitAudioContext;
    if (typeof Ctor !== 'function') return null;
    audioCtx = new Ctor();
    return audioCtx;
  }

  function resumeAudioContext() {
    const ctx = ensureAudioContext();
    if (!ctx) return null;
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    return ctx;
  }

  function decodeAudioBuffer(ctx, data) {
    return new Promise((resolve, reject) => {
      try {
        ctx.decodeAudioData(data, resolve, reject);
      } catch (err) {
        reject(err);
      }
    });
  }

  function initAudioEntries() {
    audioEntries.clear();
    noteSequence.forEach((entry, idx) => {
      const sampleIndex = AUDIO_START_INDEX + idx;
      const src = `${AUDIO_PATH_PREFIX}${AUDIO_FILE_PREFIX}${padIndex(sampleIndex)}.ogg`;
      audioEntries.set(entry.noteId, {
        src,
        buffer: null,
        loading: null,
        error: null,
        index: sampleIndex
      });
    });
  }

  function loadAudioEntry(entry, ctx) {
    if (!entry) return Promise.resolve(null);
    if (entry.buffer) return Promise.resolve(entry.buffer);
    if (!ctx) ctx = ensureAudioContext();
    if (!ctx) return Promise.resolve(null);
    if (entry.loading) return entry.loading;
    entry.loading = fetch(entry.src)
      .then((resp) => {
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        return resp.arrayBuffer();
      })
      .then((data) => decodeAudioBuffer(ctx, data))
      .then((buffer) => {
        entry.buffer = buffer;
        return buffer;
      })
      .catch((err) => {
        entry.error = err;
        console.warn('[piano] Error cargando muestra', entry.src, err);
        return null;
      });
    return entry.loading;
  }

  function playBuffer(ctx, buffer) {
    if (!ctx || !buffer) return;
    try {
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.playbackRate.value = PLAYBACK_RATE;
      source.connect(ctx.destination);
      source.start();
    } catch (err) {
      console.warn('[piano] No se pudo reproducir la muestra', err);
    }
  }

  function playNoteAudio(noteId) {
    if (!noteId) return;
    const entry = audioEntries.get(noteId);
    if (!entry) return;
    const ctx = resumeAudioContext();
    if (!ctx) {
      if (!audioSupportWarned) {
        audioSupportWarned = true;
        console.warn('[piano] Reproducción de audio no soportada en este navegador.');
      }
      return;
    }
    if (entry.buffer) {
      playBuffer(ctx, entry.buffer);
      return;
    }
    loadAudioEntry(entry, ctx).then((buffer) => {
      if (buffer) playBuffer(ctx, buffer);
    });
  }

  function createKeyElement(options) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'piano-key';
    btn.dataset.note = options.note;
    btn.dataset.display = options.display;
    if (options.offset != null) {
      btn.dataset.offset = String(options.offset);
    }
    btn.setAttribute('aria-label', options.aria);

    if (options.trigger) {
      btn.dataset.trigger = options.trigger;
      keyBindings.set(options.trigger, btn);
    }

    btn.classList.add(options.type === 'black' ? 'piano-key--black' : 'piano-key--white');
    btn.addEventListener('pointerdown', (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      btn.setPointerCapture(ev.pointerId);
      setKeyActive(btn, true);
    });
    btn.addEventListener('pointerup', (ev) => {
      ev.stopPropagation();
      setKeyActive(btn, false);
    });
    btn.addEventListener('pointercancel', (ev) => {
      ev.stopPropagation();
      setKeyActive(btn, false);
    });
    btn.addEventListener('pointerleave', (ev) => {
      if (ev.pressure === 0) {
        ev.stopPropagation();
        setKeyActive(btn, false);
      }
    });

    return btn;
  }

  function setKeyActive(btn, active) {
    if (!btn) return;
    btn.classList.toggle('is-active', active);
    if (active) {
      updateDisplay(btn.dataset.display || '');
      playNoteAudio(btn.dataset.note);
    }
  }

  function buildNoteSequence() {
    const notes = [];
    let octave = START_NOTE.octave;
    let index = START_NOTE.index;
    while (octave < END_NOTE.octave || (octave === END_NOTE.octave && index <= END_NOTE.index)) {
      const name = NOTE_NAMES[index];
      const noteId = `${name}${octave}`;
      notes.push({
        name,
        octave,
        type: SHARP_NOTES.has(name) ? 'black' : 'white',
        noteId,
        display: noteDisplay(name, octave)
      });
      index += 1;
      if (index >= NOTE_NAMES.length) {
        index = 0;
        octave += 1;
      }
    }
    return notes;
  }

  function renderKeyboard() {
    const host = document.getElementById('pianoKeyboard');
    if (!host) return;
    host.innerHTML = '';
    keyBindings.clear();
    triggerIndex = 0;
    noteSequence = buildNoteSequence();
    initAudioEntries();

    let lastWhite = null;

    noteSequence.forEach((entry, idx) => {
      const note = entry.noteId;
      const display = entry.display;
      const trigger = nextTrigger();
      const aria = trigger
        ? `${display}. ${t('piano.keyboard.trigger', { key: trigger.toUpperCase() }, `Tecla ${trigger.toUpperCase()}`)}`
        : display;

      if (entry.type === 'white') {
        const whiteKey = createKeyElement({
          note,
          display,
          trigger,
          aria,
          type: 'white',
          offset: idx
        });
        host.appendChild(whiteKey);
        lastWhite = whiteKey;
      } else if (lastWhite) {
        const blackKey = createKeyElement({
          note,
          display,
          trigger,
          aria,
          type: 'black',
          offset: idx
        });
        lastWhite.appendChild(blackKey);
      }
    });
  }

  function setupKeyboardListeners() {
    window.addEventListener('keydown', (ev) => {
      const key = ev.key.toLowerCase();
      if (!keyBindings.has(key)) return;
      if (pressedKeys.has(key)) return;
      pressedKeys.add(key);
      ev.preventDefault();
      setKeyActive(keyBindings.get(key), true);
    });

    window.addEventListener('keyup', (ev) => {
      const key = ev.key.toLowerCase();
      if (!keyBindings.has(key)) return;
      pressedKeys.delete(key);
      ev.preventDefault();
      setKeyActive(keyBindings.get(key), false);
    });
  }

  function updateDisplay(text) {
    const output = document.getElementById('pianoDisplay');
    if (!output) return;
    if (!text) {
      output.textContent = t('piano.keyboard.none', null, '—');
    } else {
      output.textContent = text;
    }
  }

  function currentScoreOption(select) {
    if (!select) return null;
    const { selectedIndex } = select;
    if (selectedIndex < 0) return null;
    const option = select.options[selectedIndex];
    if (!option || !option.value) return null;
    return option;
  }

  function setScoreStatus(key, params, fallback) {
    const caption = document.getElementById('scoreStatus');
    if (!caption) return;
    caption.textContent = t(key, params, fallback);
  }

  function resetScoreImage() {
    const img = document.getElementById('scoreImage');
    if (!img) return;
    img.removeAttribute('src');
    img.alt = '';
    img.dataset.loadedSrc = '';
    setScoreStatus('piano.score.hint', null, 'Selecciona una partitura para mostrarla.');
  }

  function applyScoreSelection(fromLanguageChange) {
    const select = document.getElementById('scoreSelect');
    const img = document.getElementById('scoreImage');
    if (!select || !img) return;

    const option = currentScoreOption(select);
    if (!option) {
      resetScoreImage();
      return;
    }

    const src = option.dataset.src;
    const title = option.textContent.trim();
    const captionParams = { title };

    img.alt = t('piano.score.alt', captionParams, `Partitura: ${title}`);

    const alreadyLoaded = img.dataset.loadedSrc === src;
    if (!alreadyLoaded || !fromLanguageChange) {
      if (src) {
        setScoreStatus('piano.score.loading', null, 'Cargando partitura…');
        img.dataset.loadedSrc = src;
        img.src = src;
      } else {
        resetScoreImage();
      }
    } else {
      setScoreStatus('piano.score.caption', captionParams, `Mostrando: ${title}`);
    }
  }

  function setupScoreSelector() {
    const select = document.getElementById('scoreSelect');
    if (!select) return;

    // Ensure there is a default selection (first available option)
    const firstAvailable = Array.from(select.options).find(opt => opt.value);
    if (firstAvailable) {
      select.value = firstAvailable.value;
    }

    applyScoreSelection(false);

    select.addEventListener('change', () => {
      applyScoreSelection(false);
    });

    const img = document.getElementById('scoreImage');
    if (img) {
      img.addEventListener('load', () => {
        const selectEl = document.getElementById('scoreSelect');
        const option = currentScoreOption(selectEl);
        if (!option) return;
        const title = option.textContent.trim();
        setScoreStatus('piano.score.caption', { title }, `Mostrando: ${title}`);
      });
      img.addEventListener('error', () => {
        setScoreStatus('piano.score.error', null, 'No se pudo cargar la partitura.');
      });
    }
  }

  function handleLanguageChange() {
    applyScoreSelection(true);
    const placeholder = document.querySelector('.score-select [value=""]');
    if (placeholder) {
      placeholder.selected = false;
    }
  }

  function init() {
    renderKeyboard();
    setupKeyboardListeners();
    setupScoreSelector();
    updateDisplay('');

    if (window.i18n && typeof window.i18n.onChange === 'function') {
      window.i18n.onChange(handleLanguageChange);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
