(() => {
  const STORAGE_KEY = 'EduMusic_sfx_v1';
  const DEFAULT_STATE = {
    volumeSfx: 0.6,
    volumeGame: 0.6,
    muted: false,
    collapsed: true,
  };

  function resolveBaseUrl() {
    try {
      const manifest = document.querySelector('link[rel="manifest"]');
      if (manifest) {
        const base = new URL(manifest.href, window.location.href);
        base.pathname = base.pathname.replace(/manifest\.json.*$/i, '');
        return base.href;
      }
    } catch (_) {}
    try {
      const current = new URL(window.location.href);
      current.pathname = current.pathname.replace(/\/[^/]*$/, '/');
      return current.href;
    } catch (_) {
      return window.location.origin ? `${window.location.origin}/` : '';
    }
  }

  const APP_BASE_URL = resolveBaseUrl();

  function resolveAudioPath(fileName) {
    if (!fileName) return null;
    try {
      return new URL(fileName, APP_BASE_URL).href;
    } catch (_) {
      return fileName;
    }
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { ...DEFAULT_STATE };
      const parsed = JSON.parse(raw);
      return {
        volumeSfx: clampVolume(parsed.volumeSfx != null ? parsed.volumeSfx : parsed.volume),
        volumeGame: clampVolume(parsed.volumeGame != null ? parsed.volumeGame : parsed.volume),
        muted: Boolean(parsed.muted),
        collapsed: Boolean(parsed.collapsed),
      };
    } catch (_) {
      return { ...DEFAULT_STATE };
    }
  }

  function clampVolume(v) {
    const num = Number(v);
    if (!Number.isFinite(num)) return DEFAULT_STATE.volume;
    return Math.min(1, Math.max(0, num));
  }

  const state = loadState();

  const audioSources = {
    success: resolveAudioPath('assets/audio/winner.mp3'),
    error: resolveAudioPath('assets/audio/error.mp3'),
  };

  function createClip(kind) {
    const src = audioSources[kind];
    if (!src) return null;
    const audio = new Audio(src);
    audio.preload = 'auto';
    audio.volume = state.muted ? 0 : state.volumeSfx;
    return audio;
  }

  const baseClips = {
    success: createClip('success'),
    error: createClip('error'),
  };

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (_) {}
  }

  function updateClipSettings() {
    Object.values(baseClips).forEach((clip) => {
      if (!clip) return;
      clip.volume = state.muted ? 0 : state.volumeSfx;
    });
  }

  function play(kind) {
    const base = baseClips[kind] || createClip(kind);
    if (!base) return;
    try {
      const instance = base.cloneNode(true);
      instance.volume = state.muted ? 0 : state.volumeSfx;
      if (instance.volume <= 0) return;
      instance.play().catch(() => {});
    } catch (_) {}
  }

  function setVolume(kind, vol) {
    const clamped = clampVolume(vol);
    if (kind === 'game') state.volumeGame = clamped;
    else state.volumeSfx = clamped;
    const bothZero = state.volumeSfx === 0 && state.volumeGame === 0;
    if (bothZero) {
      state.muted = true;
    } else if (state.muted && (state.volumeSfx > 0 || state.volumeGame > 0)) {
      state.muted = false;
    }
    updateClipSettings();
    saveState();
  }

  function setMuted(muted) {
    state.muted = Boolean(muted);
    updateClipSettings();
    saveState();
  }

  function shouldHideControlsPanel() {
    const body = document.body;
    if (!body) return false;
    return body.hasAttribute('data-hide-sfx-controls') || body.classList.contains('hide-sfx-controls');
  }

  function shouldHideVolumeControl() {
    const body = document.body;
    if (!body) return false;
    return body.hasAttribute('data-hide-sfx-volume') || body.classList.contains('hide-sfx-volume');
  }

  function ensureControls() {
    if (shouldHideControlsPanel()) return;
    if (document.getElementById('sfxControls')) return;
    const panel = document.createElement('div');
    panel.id = 'sfxControls';
    panel.className = 'sfx-controls';

    const header = document.createElement('div');
    header.className = 'sfx-controls__header';

    const title = document.createElement('span');
    title.className = 'sfx-controls__title';
    title.textContent = 'Sonidos';

    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'sfx-controls__toggle';
    toggle.setAttribute('aria-label', 'Ocultar controles de sonido');

    header.appendChild(title);
    header.appendChild(toggle);
    panel.appendChild(header);

    const content = document.createElement('div');
    content.className = 'sfx-controls__content';

    let volumeSfxInput = null;
    let volumeGameInput = null;
    let mute;

    if (!shouldHideVolumeControl()) {
      const volumeGameWrapper = document.createElement('label');
      volumeGameWrapper.className = 'sfx-controls__row';
      const volGameText = document.createElement('span');
      volGameText.textContent = 'Volumen juego';
      const volumeGame = document.createElement('input');
      volumeGame.type = 'range';
      volumeGame.min = '0';
      volumeGame.max = '100';
      volumeGame.step = '5';
      volumeGame.value = String(Math.round(state.volumeGame * 100));
      volumeGame.addEventListener('input', () => {
        const next = Number(volumeGame.value) / 100;
        setVolume('game', next);
        if (mute && state.muted && next > 0) {
          mute.checked = false;
        }
      });
      volumeGameWrapper.appendChild(volGameText);
      volumeGameWrapper.appendChild(volumeGame);
      content.appendChild(volumeGameWrapper);
      volumeGameInput = volumeGame;

      const volumeSfxWrapper = document.createElement('label');
      volumeSfxWrapper.className = 'sfx-controls__row';
      const volSfxText = document.createElement('span');
      volSfxText.textContent = 'Volumen efectos';
      const volumeSfx = document.createElement('input');
      volumeSfx.type = 'range';
      volumeSfx.min = '0';
      volumeSfx.max = '100';
      volumeSfx.step = '5';
      volumeSfx.value = String(Math.round(state.volumeSfx * 100));
      volumeSfx.addEventListener('input', () => {
        const next = Number(volumeSfx.value) / 100;
        setVolume('sfx', next);
        if (mute && state.muted && next > 0) {
          mute.checked = false;
        }
      });
      volumeSfxWrapper.appendChild(volSfxText);
      volumeSfxWrapper.appendChild(volumeSfx);
      content.appendChild(volumeSfxWrapper);
      volumeSfxInput = volumeSfx;
    }

    const muteWrapper = document.createElement('label');
    muteWrapper.className = 'sfx-controls__row sfx-controls__row--mute';
    mute = document.createElement('input');
    mute.type = 'checkbox';
    mute.checked = state.muted;
    mute.addEventListener('change', () => {
      setMuted(mute.checked);
      if (!mute.checked && state.volumeSfx === 0 && state.volumeGame === 0) {
        setVolume('game', DEFAULT_STATE.volumeGame);
        setVolume('sfx', DEFAULT_STATE.volumeSfx);
        if (volumeGameInput) {
          volumeGameInput.value = String(Math.round(state.volumeGame * 100));
        }
        if (volumeSfxInput) {
          volumeSfxInput.value = String(Math.round(state.volumeSfx * 100));
        }
      } else {
        if (volumeGameInput) volumeGameInput.value = String(Math.round(state.volumeGame * 100));
        if (volumeSfxInput) volumeSfxInput.value = String(Math.round(state.volumeSfx * 100));
      }
    });
    const muteText = document.createElement('span');
    muteText.textContent = 'Silenciar';
    muteWrapper.appendChild(mute);
    muteWrapper.appendChild(muteText);
    content.appendChild(muteWrapper);

    panel.appendChild(content);

    const applyCollapsed = () => {
      const collapsed = Boolean(state.collapsed);
      if (collapsed) {
        content.style.display = 'none';
        panel.classList.add('is-collapsed');
        toggle.textContent = '+';
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('title', 'Mostrar controles de sonido');
      } else {
        content.style.display = '';
        panel.classList.remove('is-collapsed');
        toggle.textContent = '-';
        toggle.setAttribute('aria-expanded', 'true');
        toggle.setAttribute('title', 'Ocultar controles de sonido');
      }
    };

    toggle.addEventListener('click', () => {
      state.collapsed = !state.collapsed;
      saveState();
      applyCollapsed();
    });

    applyCollapsed();

    document.body.appendChild(panel);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ensureControls);
  } else {
    ensureControls();
  }

  updateClipSettings();

  window.Sfx = {
    play(kind) {
      play(kind);
    },
    success() {
      play('success');
    },
    error() {
      play('error');
    },
    setVolume(vol) {
      setVolume('sfx', vol);
    },
    setGameVolume(vol) {
      setVolume('game', vol);
    },
    setMuted(muted) {
      setMuted(muted);
    },
    getEffectsVolume() {
      return state.muted ? 0 : state.volumeSfx;
    },
    getGameVolume() {
      return state.muted ? 0 : state.volumeGame;
    },
    getState() {
      return { ...state };
    },
  };
})();
