(() => {
  const DEFAULT_MAX_ENTRIES = 10;
  const DEFAULT_INITIALS = 'AAA';
  const GENERIC_ANON_INITIALS = new Set(['ANO']);
  const DEFAULT_API_BASE = (typeof window !== 'undefined' && window.EDUMUSIC_API_BASE) || '/api';

  let DEBUG = false;
  function debugLog(...args) {
    if (!DEBUG) return;
    try {
      console.log('[ScoreService]', ...args);
    } catch (_) {}
  }

  const RestBackend = {
    apiBase: DEFAULT_API_BASE,

    isConfigured() {
      return true;
    },

    buildKey(board) {
      const rawKey = (board && board.options && (board.options.rankKey || board.options.gameId)) || 'default';
      return sanitizeKey(rawKey) || 'default';
    },

    async addEntry(board, entry) {
      const gameId = this.buildKey(board);
      const payload = {
        game_id: gameId,
        name: normalizeInitials(entry && entry.name != null ? entry.name : '') || DEFAULT_INITIALS,
        score: Number(entry && entry.score != null ? entry.score : 0) || 0,
      };
      try {
        const res = await fetch(`${this.apiBase}/scores`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          debugLog('addEntry REST failed', res.status, gameId);
          return false;
        }
        return true;
      } catch (err) {
        console.warn('[ScoreService] REST addEntry failed', gameId, err);
        return false;
      }
    },

    async fetchEntries(board, period = 'all-time') {
      const gameId = this.buildKey(board);
      const limit = (board && board.options && board.options.maxEntries) || DEFAULT_MAX_ENTRIES;
      const expandedFetchLimit = Math.min(200, Math.max(limit * 5, limit + 40));
      const url = `${this.apiBase}/scores?game_id=${encodeURIComponent(gameId)}&period=${period}&limit=${expandedFetchLimit}`;
      try {
        const res = await fetch(url);
        if (!res.ok) {
          debugLog('fetchEntries REST failed', res.status, gameId, period);
          return null;
        }
        const data = await res.json();
        const entries = (Array.isArray(data) ? data : []).map((item) => ({
          name: normalizeInitials(item && item.name != null ? item.name : '') || DEFAULT_INITIALS,
          score: Number(item && item.score != null ? item.score : 0) || 0,
          ts: item && item.ts ? item.ts : new Date().toISOString(),
        }));
        if (period === 'weekly') {
          const weekStart = getWeekStart(new Date());
          const filtered = entries.filter((entry) => new Date(entry.ts) >= weekStart);
          filtered.sort(sortByScoreThenTs);
          return dedupeByInitialsSorted(filtered).slice(0, limit);
        }
        entries.sort(sortByScoreThenTs);
        return dedupeByInitialsSorted(entries).slice(0, limit);
      } catch (err) {
        console.warn('[ScoreService] REST fetchEntries failed', gameId, period, err);
        return null;
      }
    },
  };

  function normalizeInitials(raw) {
    if (raw == null) return '';
    const upper = raw.toString().toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const filtered = upper.replace(/[^A-Z0-9]/g, '');
    return filtered.slice(0, 3);
  }

  function sortByScoreThenTs(a, b) {
    const scoreA = Number(a && a.score != null ? a.score : 0) || 0;
    const scoreB = Number(b && b.score != null ? b.score : 0) || 0;
    if (scoreB !== scoreA) return scoreB - scoreA;
    const tsA = new Date(a && a.ts ? a.ts : 0);
    const tsB = new Date(b && b.ts ? b.ts : 0);
    return tsA - tsB;
  }

  // De-duplicación por iniciales: una entrada por combinación (p.ej. "AMO").
  // IMPORTANTE: se asume que la lista ya está ordenada de mejor a peor.
  function dedupeByInitialsSorted(entries) {
    const seen = new Set();
    const out = [];
    const list = Array.isArray(entries) ? entries : [];
    for (const item of list) {
      const key = normalizeInitials(item && item.name != null ? item.name : '') || DEFAULT_INITIALS;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(item);
    }
    return out;
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

  function sanitizeKey(str) {
    return (str || '').toString().toLowerCase().replace(/[^a-z0-9]+/g, '-');
  }

  function getWeekStart(referenceDate = new Date()) {
    const now = new Date(referenceDate);
    const dayOfWeek = now.getUTCDay(); // 0 = domingo, 1 = lunes, ..., 6 = sábado
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Si es domingo, retroceder 6 días
    const mondayDate = now.getUTCDate() - daysToMonday;
    return new Date(Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      mondayDate,
      0, 1, 0, 0,
    ));
  }

  function getWeekKey(referenceDate = new Date()) {
    const monday = getWeekStart(referenceDate);
    return monday.toISOString().slice(0, 10);
  }
  
  function getRefPath(ref) {
    if (!ref || typeof ref !== 'object') return null;
    try {
      if (typeof ref.path === 'string') return ref.path;
    } catch (_) {
      return null;
    }
    return null;
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
        disableSaveUi: !!options.disableSaveUi,
        period: options.period || 'all-time', // 'all-time' or 'weekly'
      };
      this.ids = {
        input: `${this.options.rankKey}-${this.options.period}-playerName`,
        button: `${this.options.rankKey}-${this.options.period}-saveBtn`,
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
      if (this.options.disableSaveUi) {
        this.dom.saveBox.style.display = 'none';
        return;
      }
      this.dom.saveBox.style.display = visible ? '' : 'none';
    }

    isEligibleScore(score) {
      const numeric = Number(score);
      if (!Number.isFinite(numeric) || numeric < this.options.showSaveAt) {
        return false;
      }
      if (!this.service || typeof this.service.projectEntry !== 'function') {
        return true;
      }
      try {
        const projection = this.service.projectEntry(this, {
          name: DEFAULT_INITIALS,
          score: numeric,
          ts: new Date().toISOString(),
        }, { persist: false });
        return !!(projection && projection.included);
      } catch (_) {
        return true;
      }
    }

    showSave(score) {
      this.state.latestScore = score;
      if (!this.isEligibleScore(score)) {
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
        
        // Refresh all boards for this game (both all-time and weekly)
        const allBoards = this.service.getBoardsByGame(this.options.gameId);
        for (const board of allBoards) {
          await board.refresh();
        }
        
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
      const formatDateEs = (d) => {
        if (!(d instanceof Date)) return '';
        const dd = String(d.getDate()).padStart(2, '0');
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const yyyy = d.getFullYear();
        return `${dd}/${mm}/${yyyy}`;
      };
      this.state.entries.forEach((entry) => {
        const li = createEl('li');
        const date = new Date(entry.ts || Date.now());
        const normalized = normalizeInitials(entry.name || '');
        const initials = (normalized && !GENERIC_ANON_INITIALS.has(normalized))
          ? normalized
          : DEFAULT_INITIALS;
        const dateLabel = formatDateEs(date);
        li.textContent = `${initials} — ${entry.score} ${ptsLabel} (${dateLabel})`;
        this.dom.list.appendChild(li);
      });
      this.applyTranslations();
    }

    async refresh() {
      const period = this.options.period || 'all-time';
      const entries = await this.service.loadEntries(this, period);
      this.renderList(entries);
    }
  }

  const ScoreService = {
    config: {
    },
    boards: new Map(),
    listenerAttached: false,

    configure(opts = {}) {
      if (Object.prototype.hasOwnProperty.call(opts, 'apiBase') && isNonEmptyString(opts.apiBase)) {
        RestBackend.apiBase = opts.apiBase.replace(/\/+$/, '');
        debugLog('configure: apiBase override', RestBackend.apiBase);
      }
      if (Object.prototype.hasOwnProperty.call(opts, 'debug')) {
        DEBUG = !!opts.debug;
        debugLog('Debug mode set via configure()', DEBUG);
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
      const disableSaveUiAttr = (element.getAttribute('data-disable-save-ui') || '').toLowerCase();
      const disableSaveUi = options.disableSaveUi === true
        || disableSaveUiAttr === '1'
        || disableSaveUiAttr === 'true'
        || disableSaveUiAttr === 'yes';
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
        disableSaveUi,
        period: element.getAttribute('data-period') || options.period || 'all-time',
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

    getBoardsByGame(gameId) {
      const boards = [];
      for (const board of this.boards.values()) {
        if (board.options.gameId === gameId) {
          boards.push(board);
        }
      }
      return boards;
    },

    showSave(gameId, score) {
      const boards = this.getBoardsByGame(gameId);
      if (boards.length === 0) return;
      
      // Check if score qualifies for ANY of the boards (all-time OR weekly)
      let qualifiesForAny = false;
      for (const board of boards) {
        if (board.isEligibleScore(score)) {
          qualifiesForAny = true;
          break;
        }
      }
      
      // Show save form on the first board (usually all-time)
      // but only if the score qualifies for at least one ranking
      if (qualifiesForAny && boards.length > 0) {
        boards[0].showSave(score);
      } else if (boards.length > 0) {
        boards[0].hideSave();
      }
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
      const boards = this.getBoardsByGame(gameId);
      if (boards.length === 0) return false;
      
      // Submit to the first board (which triggers save to both all-time and weekly)
      const success = await boards[0].submitWithName(name);
      
      // Refresh all boards to show the updated rankings
      if (success) {
        for (const board of boards) {
          await board.refresh();
        }
      }
      
      return success;
    },

    canSaveScore(gameId, score) {
      const boards = this.getBoardsByGame(gameId);
      if (boards.length === 0) {
        const numeric = Number(score);
        return Number.isFinite(numeric) && numeric >= 1;
      }
      
      // Return true if score qualifies for ANY board (all-time OR weekly)
      for (const board of boards) {
        const projection = this.projectEntry(board, {
          name: DEFAULT_INITIALS,
          score,
          ts: new Date().toISOString(),
        }, { persist: false });
        if (projection.included) {
          return true;
        }
      }
      
      return false;
    },

    projectEntry(board, entry, { persist = false } = {}) {
      if (!board) return { top: [], included: false };

      const threshold = typeof board.options.showSaveAt === 'number'
        ? board.options.showSaveAt
        : 1;
      const scoreValue = Number(entry && entry.score != null ? entry.score : NaN);

      const period = board.options.period || 'all-time';
      const existingRaw = this.loadLocal(board, period);
      const existing = Array.isArray(existingRaw)
        ? existingRaw.map((item) => ({
            ...item,
            name: normalizeInitials(item && item.name != null ? item.name : '') || DEFAULT_INITIALS,
            ts: item && item.ts ? item.ts : new Date().toISOString(),
          }))
        : [];

      if (!Number.isFinite(scoreValue) || scoreValue < threshold) {
        return { top: existing, included: false };
      }

      const candidate = {
        ...entry,
        name: normalizeInitials(entry && entry.name != null ? entry.name : '') || DEFAULT_INITIALS,
        score: scoreValue,
        ts: entry && entry.ts ? entry.ts : new Date().toISOString(),
        __candidate: true,
      };
      existing.push(candidate);

      existing.sort(sortByScoreThenTs);
      const unique = dedupeByInitialsSorted(existing);
      const cap = typeof board.options.maxEntries === 'number' && board.options.maxEntries > 0
        ? board.options.maxEntries
        : DEFAULT_MAX_ENTRIES;
      const top = unique.slice(0, cap);
      const included = top.some((item) => item.__candidate === true);
      const cleanTop = top.map((item) => {
        const clone = { ...item };
        delete clone.__candidate;
        return clone;
      });

      if (persist) {
        this.persistLocal(board, cleanTop, period);
      }

      return { top: cleanTop, included };
    },

    saveLocalEntry(board, entry) {
      const { included } = this.projectEntry(board, entry, { persist: true });
      return included;
    },

    async addEntry(board, name, score) {
      const entry = { name, score, ts: new Date().toISOString() };
      const gameId = board.options.gameId;
      
      // Get all boards for this game (all-time and weekly)
      const allBoards = this.getBoardsByGame(gameId);
      
      // Save to localStorage for each period
      for (const b of allBoards) {
        const period = b.options.period || 'all-time';
        const included = this.saveLocalEntry(b, entry);
        debugLog('addEntry local save', gameId, period, score, included ? 'top-entry' : 'discarded');
      }
      
      // Save to the self-hosted leaderboard (all-time + weekly, server-side)
      await RestBackend.addEntry(board, entry);
    },

    async loadEntries(board, period = 'all-time') {
      debugLog('loadEntries start', board.options.gameId, period);
      const remote = await RestBackend.fetchEntries(board, period);
      if (Array.isArray(remote)) {
        this.persistLocal(board, remote, period);
        debugLog('loadEntries from remote', board.options.gameId, remote.length);
        return remote;
      }
      const local = this.loadLocal(board, period);
      debugLog('loadEntries from local fallback', board.options.gameId, local.length);
      return local;
    },

    storageKey(board, period = 'all-time') {
      const slug = sanitizeKey(board.options.rankKey || board.options.gameId || 'default') || 'default';
      const suffix = period === 'weekly' ? '_weekly' : '';
      return `EduMúsic_rank_${slug}${suffix}_v1`;
    },

    loadLocal(board, period = 'all-time') {
      try {
        const raw = localStorage.getItem(this.storageKey(board, period));
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        let entries = Array.isArray(parsed) ? parsed : [];
        
        // For weekly, filter entries from current week (Monday 00:01)
        if (period === 'weekly') {
          const weekStart = getWeekStart();
          entries = entries.filter(entry => {
            const entryDate = new Date(entry.ts);
            return entryDate >= weekStart;
          });
          debugLog('Weekly local filter: from', weekStart.toISOString(), 'entries:', entries.length);
        }
        
        return entries;
      } catch (_) {
        return [];
      }
    },

    persistLocal(board, list, period = 'all-time') {
      try {
        localStorage.setItem(this.storageKey(board, period), JSON.stringify(list));
      } catch (_) {}
    },
  };

  ScoreService.normalizeInitials = normalizeInitials;
  ScoreService.defaultInitials = DEFAULT_INITIALS;
  ScoreService.setApiBase = (base) => {
    if (isNonEmptyString(base)) RestBackend.apiBase = base.replace(/\/+$/, '');
    debugLog('setApiBase called', RestBackend.apiBase);
  };
  ScoreService.isRemoteEnabled = () => RestBackend.isConfigured();
  ScoreService.setDebug = (value) => {
    DEBUG = !!value;
    debugLog('Debug mode set via setDebug()', DEBUG);
  };

  window.ScoreService = ScoreService;

  const autoScanDisabled = (typeof window !== 'undefined')
    && window.EDUMUSIC_SCORE_AUTOSCAN === false;
  if (!autoScanDisabled) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => ScoreService.scanDom());
    } else {
      ScoreService.scanDom();
    }
  }
})();
