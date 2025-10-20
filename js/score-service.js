(() => {
  const DEFAULT_REMOTE = {
    supabaseUrl: '',
    supabaseAnonKey: '',
  };
  const DEFAULT_MAX_ENTRIES = 10;
  const DEFAULT_INITIALS = 'AAA';
  const GENERIC_ANON_INITIALS = new Set(['ANO']);

  function normalizeInitials(raw) {
    if (raw == null) return '';
    const upper = raw.toString().toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const filtered = upper.replace(/[^A-Z0-9]/g, '');
    return filtered.slice(0, 3);
  }

  function ensureInitials(raw, fallbackRaw) {
    const primary = normalizeInitials(raw);
    if (primary) return primary;
    const fallback = normalizeInitials(fallbackRaw);
    if (fallback && !GENERIC_ANON_INITIALS.has(fallback)) return fallback;
    return DEFAULT_INITIALS;
  }

  function isNonEmptyString(value) {
    return typeof value === 'string' && value.trim() !== '';
  }

  function buildRemoteBase(remote) {
    if (!remote || !isNonEmptyString(remote.supabaseUrl)) return null;
    return remote.supabaseUrl.trim().replace(/\/+$/, '');
  }

  function sanitizeKey(str) {
    return (str || '').toString().toLowerCase().replace(/[^a-z0-9]+/g, '-');
  }

  function createEl(tag, attrs = {}, children = []) {
    const el = document.createElement(tag);
    Object.entries(attrs).forEach(([key, value]) => {
      if (value == null) return;
      if (key === 'text') {
        el.textContent = value;
      } else if (key === 'html') {
        el.innerHTML = value;
      } else {
        el.setAttribute(key, value);
      }
    });
    children.forEach((child) => {
      if (child) el.appendChild(child);
    });
    return el;
  }

  function remoteEnabled(remote) {
    return Boolean(buildRemoteBase(remote));
  }

  function buildMarkup(board) {
    const section = board.root;
    section.classList.add('scoreboard');
    const heading = createEl('h2', {
      'data-i18n': board.options.headingKey,
      text: board.options.headingFallback,
      style: 'margin: 0.5em 0;',
    });

    const saveBox = createEl('div', {
      class: 'scoreboard__save',
      style: 'background:#f8fafc; padding: 12px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); margin-top: 12px;',
    });
    saveBox.style.display = 'none';
    const scoreRow = createEl('div', { class: 'scoreboard__save-row' }, [
      createEl('span', {
        'data-i18n': 'game.save.your_score',
        text: 'Tu puntuación:',
      }),
      createEl('strong', { class: 'scoreboard__final-score', text: '0' }),
    ]);
    const label = createEl('label', {
      for: board.ids.input,
      'data-i18n': 'game.save.your_name',
      text: 'Tus iniciales:',
    });
    const nameInput = createEl('input', {
      id: board.ids.input,
      type: 'text',
      maxlength: '3',
      'data-i18n': 'game.save.placeholder',
      'data-i18n-attr': 'placeholder',
      placeholder: 'Introduce tus iniciales',
      class: 'scoreboard__input',
    });
    const saveButton = createEl('button', {
      id: board.ids.button,
      'data-i18n': 'game.save.button',
      text: 'Guardar puntuación',
      class: 'scoreboard__save-btn',
    });
    const form = createEl('div', { class: 'scoreboard__save-form' }, [
      label,
      nameInput,
      saveButton,
    ]);
    saveBox.appendChild(scoreRow);
    saveBox.appendChild(form);

    const list = createEl('ol', {
      class: 'scoreboard__list',
      style: 'padding-left: 1.2em; margin-top: 12px;',
    });

    section.appendChild(heading);
    section.appendChild(saveBox);
    section.appendChild(list);

    return {
      heading,
      saveBox,
      finalScore: scoreRow.querySelector('strong'),
      nameInput,
      saveButton,
      list,
    };
  }

  class Board {
    constructor(service, element, options) {
      this.service = service;
      this.root = element;
      this.options = {
        gameId: options.gameId,
        rankKey: options.rankKey || options.gameId,
        maxEntries: options.maxEntries || DEFAULT_MAX_ENTRIES,
        headingKey: options.headingKey || 'game.ranking',
        headingFallback: options.headingFallback || 'Ranking',
        showSaveAt: typeof options.showSaveAt === 'number' ? options.showSaveAt : 1,
      };
      this.ids = {
        input: `${this.options.rankKey}-playerName`,
        button: `${this.options.rankKey}-saveBtn`,
      };
      this.dom = buildMarkup(this);
      this.state = {
        latestScore: 0,
        entries: [],
        loading: false,
      };
      this.bindEvents();
      this.applyTranslations();
    }

    bindEvents() {
      this.dom.saveButton.addEventListener('click', () => {
        this.submit();
      });
      this.dom.nameInput.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter') {
          ev.preventDefault();
          this.submit();
        }
      });
      this.dom.nameInput.addEventListener('input', () => {
        const sanitized = normalizeInitials(this.dom.nameInput.value);
        this.dom.nameInput.value = sanitized;
      });
    }

    focusInput() {
      try {
        this.dom.nameInput.focus();
      } catch (_) {}
    }

    toggleSaveBox(visible) {
      this.dom.saveBox.style.display = visible ? '' : 'none';
    }

    showSave(score) {
      this.state.latestScore = score;
      if (score < this.options.showSaveAt) {
        this.toggleSaveBox(false);
        return;
      }
      this.dom.finalScore.textContent = String(score);
      this.dom.nameInput.value = '';
      this.toggleSaveBox(true);
      setTimeout(() => this.focusInput(), 0);
    }

    hideSave() {
      this.toggleSaveBox(false);
    }

    getDefaultName() {
      if (window.i18n && typeof window.i18n.t === 'function') {
        const value = window.i18n.t('game.save.anon');
        if (value && value !== 'game.save.anon') return value;
      }
      const lang = (window.i18n && typeof window.i18n.getLang === 'function') ? window.i18n.getLang() : 'es';
      if (lang === 'val') return 'Anònim';
      if (lang === 'en') return 'Anonymous';
      return 'Anónimo';
    }

    applyTranslations() {
      if (window.i18n && typeof window.i18n.apply === 'function') {
        window.i18n.apply(this.root);
      }
    }

    async submitWithName(rawName) {
      if (this.state.latestScore < this.options.showSaveAt) return false;
      const name = ensureInitials(rawName, this.getDefaultName());
      this.dom.nameInput.value = name;
      this.dom.saveButton.disabled = true;
      try {
        await this.service.addEntry(this, name, this.state.latestScore);
        this.hideSave();
        await this.refresh();
        window.dispatchEvent(new CustomEvent('score:saved', {
          detail: { gameId: this.options.gameId, score: this.state.latestScore, name },
        }));
        return true;
      } finally {
        this.dom.saveButton.disabled = false;
      }
    }

    async submit() {
      return this.submitWithName(this.dom.nameInput.value || '');
    }

    renderList(entries) {
      this.state.entries = Array.isArray(entries) ? entries : [];
      this.dom.list.innerHTML = '';
      if (this.state.entries.length === 0) {
        const li = createEl('li', {
          'data-i18n': 'game.rank.empty',
          text: 'Aún no hay puntuaciones. ¡Sé el primero!',
        });
        this.dom.list.appendChild(li);
        this.applyTranslations();
        return;
      }
      const ptsLabel = (window.i18n && typeof window.i18n.t === 'function')
        ? window.i18n.t('game.rank.pts')
        : 'pts';
      this.state.entries.forEach((entry) => {
        const li = createEl('li');
        const date = new Date(entry.ts || Date.now());
        const normalized = normalizeInitials(entry.name || '');
        const initials = (normalized && !GENERIC_ANON_INITIALS.has(normalized))
          ? normalized
          : DEFAULT_INITIALS;
        li.textContent = `${initials} — ${entry.score} ${ptsLabel} (${date.toLocaleDateString()})`;
        this.dom.list.appendChild(li);
      });
      this.applyTranslations();
    }

    async refresh() {
      const entries = await this.service.loadEntries(this);
      this.renderList(entries);
    }
  }

  const ScoreService = {
    config: {
      remote: DEFAULT_REMOTE,
    },
    boards: new Map(),
    listenerAttached: false,

    configure(opts = {}) {
      if (opts.remote) {
        const current = this.config.remote || { ...DEFAULT_REMOTE };
        const url =
          opts.remote.url
          || opts.remote.baseUrl
          || opts.remote.endpoint
          || opts.remote.supabaseUrl;
        const key =
          opts.remote.apiKey
          || opts.remote.token
          || opts.remote.supabaseAnonKey;
        this.config.remote = {
          supabaseUrl: url !== undefined ? String(url || '').trim() : current.supabaseUrl,
          supabaseAnonKey: key !== undefined ? String(key || '').trim() : current.supabaseAnonKey,
        };
      }
      if (Array.isArray(opts.mount) && opts.mount.length) {
        opts.mount.forEach((item) => this.mountOne(item.element, item.options || {}));
      }
      this.scanDom();
    },

    mountOne(element, options = {}) {
      if (!element || this.boards.has(element)) return;
      const gameId = options.gameId || element.getAttribute('data-game') || element.id;
      if (!gameId) return;
      const rankKey = options.rankKey || element.getAttribute('data-rank-key') || gameId;
      const board = new Board(this, element, {
        gameId,
        rankKey,
        maxEntries: this.parseNumber(
          element.getAttribute('data-max-entries'),
          options.maxEntries,
          { allowZero: false, min: 1 },
        ),
        headingKey: element.getAttribute('data-heading-key') || options.headingKey,
        headingFallback: element.getAttribute('data-heading') || options.headingFallback,
        showSaveAt: this.parseNumber(
          element.getAttribute('data-show-save-at'),
          options.showSaveAt,
          { allowZero: true, min: 0 },
        ),
      });
      this.boards.set(element, board);
      board.refresh();
    },

    parseNumber(value, fallback, { allowZero = false, min = allowZero ? 0 : 1 } = {}) {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) {
        if (!allowZero && parsed === 0) {
          // ignore explicit zero when zero not allowed
        } else if (parsed >= min) {
          return parsed;
        }
      }
      const fallbackNum = Number(fallback);
      if (Number.isFinite(fallbackNum)) {
        if (!allowZero && fallbackNum === 0) {
          return undefined;
        }
        if (fallbackNum >= min) return fallbackNum;
      }
      return undefined;
    },

    scanDom() {
      const sections = document.querySelectorAll('[data-scoreboard]');
      sections.forEach((section) => this.mountOne(section, {}));
      if (!this.listenerAttached && window.i18n && typeof window.i18n.onChange === 'function') {
        window.i18n.onChange(() => {
          this.boards.forEach((board) => {
            board.applyTranslations();
            board.refresh();
          });
        });
        this.listenerAttached = true;
      }
    },

    getBoardByGame(gameId) {
      for (const board of this.boards.values()) {
        if (board.options.gameId === gameId) return board;
      }
      return null;
    },

    showSave(gameId, score) {
      const board = this.getBoardByGame(gameId);
      if (board) board.showSave(score);
    },

    hideSave(gameId) {
      const board = this.getBoardByGame(gameId);
      if (board) board.hideSave();
    },

    getSaveState(gameId) {
      const board = this.getBoardByGame(gameId);
      if (!board) return null;
      return {
        latestScore: board.state.latestScore,
        showSaveAt: board.options.showSaveAt,
      };
    },

    async submitScore(gameId, name) {
      const board = this.getBoardByGame(gameId);
      if (!board) return false;
      return board.submitWithName(name);
    },

    async addEntry(board, name, score) {
      const entry = { name, score, ts: new Date().toISOString() };
      const remoteBase = buildRemoteBase(this.config.remote);
      if (remoteBase) {
        try {
          const headers = {
            'Content-Type': 'application/json',
          };
          if (isNonEmptyString(this.config.remote.supabaseAnonKey)) {
            headers['X-API-Key'] = this.config.remote.supabaseAnonKey.trim();
          }
          const body = {
            game: board.options.gameId || board.options.rankKey || 'default',
            initials: name,
            score,
          };
          const submitUrl = `${remoteBase}/submit`;
          const res = await fetch(submitUrl, {
            method: 'POST',
            headers,
            body: JSON.stringify(body),
          });
          if (!res.ok) throw new Error('remote insert failed');
          return;
        } catch (_) {
          // fall through to local storage
        }
      }
      const current = this.loadLocal(board);
      const list = Array.isArray(current)
        ? current.map((item) => ({
            ...item,
            name: normalizeInitials(item && item.name != null ? item.name : '') || DEFAULT_INITIALS,
          }))
        : [];
      list.push(entry);
      list.sort((a, b) => b.score - a.score || new Date(a.ts) - new Date(b.ts));
      const top = list.slice(0, board.options.maxEntries);
      this.persistLocal(board, top);
    },

    async loadEntries(board) {
      const remoteBase = buildRemoteBase(this.config.remote);
      if (remoteBase) {
        try {
          const params = new URLSearchParams({
            game: board.options.gameId || board.options.rankKey || 'default',
          });
          const headers = {};
          if (isNonEmptyString(this.config.remote.supabaseAnonKey)) {
            headers['X-API-Key'] = this.config.remote.supabaseAnonKey.trim();
          }
          const url = `${remoteBase}/top?${params.toString()}`;
          const res = await fetch(url, {
            headers,
            cache: 'no-store',
          });
          if (res.ok) {
            const payload = await res.json();
            const raw = Array.isArray(payload)
              ? payload
              : (Array.isArray(payload && payload.entries) ? payload.entries : []);
            if (Array.isArray(raw)) {
              const mapped = raw
                .map((item) => {
                  if (!item) return null;
                  const scoreNum = Number(item.score);
                  if (!Number.isFinite(scoreNum)) return null;
                  const initials = normalizeInitials(item.initials || item.name || item.player) || DEFAULT_INITIALS;
                  const ts = item.created_at || item.ts || item.timestamp || new Date().toISOString();
                  return { name: initials, score: scoreNum, ts };
                })
                .filter(Boolean)
                .slice(0, board.options.maxEntries);
              this.persistLocal(board, mapped);
              return mapped;
            }
          }
        } catch (_) {
          // ignore, use local fallback
        }
      }
      return this.loadLocal(board);
    },

    storageKey(board) {
      const slug = sanitizeKey(board.options.rankKey || board.options.gameId || 'default') || 'default';
      return `EduMúsic_rank_${slug}_v1`;
    },

    loadLocal(board) {
      try {
        const raw = localStorage.getItem(this.storageKey(board));
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
      } catch (_) {
        return [];
      }
    },

    persistLocal(board, list) {
      try {
        localStorage.setItem(this.storageKey(board), JSON.stringify(list));
      } catch (_) {}
    },
  };

  ScoreService.normalizeInitials = normalizeInitials;
  ScoreService.defaultInitials = DEFAULT_INITIALS;

  window.ScoreService = ScoreService;

  const autoRemote =
    (typeof window !== 'undefined' && (window.EduMusicLeaderboard || window.ScoreServiceRemoteConfig || window.ScoreServiceRemote)) || null;
  if (autoRemote && typeof autoRemote === 'object') {
    try {
      ScoreService.configure({ remote: autoRemote });
    } catch (_) {}
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ScoreService.scanDom());
  } else {
    ScoreService.scanDom();
  }
})();
