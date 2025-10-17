(() => {
  const TAG_ORDER = [
    'inicial',
    'intermedio',
    'avanzado',
    'ritmo',
    'melodia',
    'dictado',
    'audicion',
  ];

  const FALLBACK_LABELS = {
    ritmo: 'Ritmo',
    melodia: 'Melodía',
    dictado: 'Dictado',
    audicion: 'Audición',
    inicial: 'Inicial',
    intermedio: 'Intermedio',
    avanzado: 'Avanzado',
  };

  const KNOWN_TAGS = new Set([
    ...TAG_ORDER,
    ...Object.keys(FALLBACK_LABELS),
  ]);

  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else {
      fn();
    }
  }

  ready(() => {
    const container = document.querySelector('[data-tag-filter]');
    const listEl = container && container.querySelector('[data-tag-filter-list]');
    if (!container || !listEl) return;

    const cards = Array.from(document.querySelectorAll('.activity-card[data-tags]'));
    if (!cards.length) {
      container.hidden = true;
      return;
    }

    const allTags = new Set();
    cards.forEach((card) => {
      const raw = card.getAttribute('data-tags') || '';
      const tags = raw
        .split(',')
        .map((t) => t.trim().toLowerCase())
        .filter((tag) => tag && KNOWN_TAGS.has(tag));
      card.__tagList = tags;
      tags.forEach((tag) => allTags.add(tag));
    });

    if (!allTags.size) {
      container.hidden = true;
      return;
    }

    const orderedTags = Array.from(allTags).sort((a, b) => {
      const ia = TAG_ORDER.indexOf(a);
      const ib = TAG_ORDER.indexOf(b);
      if (ia === -1 && ib === -1) return a.localeCompare(b);
      if (ia === -1) return 1;
      if (ib === -1) return -1;
      return ia - ib;
    });

    listEl.innerHTML = '';
    const active = new Set();
    const emptyEl = container.querySelector('[data-tag-filter-empty]');
    const clearBtn = container.querySelector('[data-tag-filter-clear]');

    function applyTranslations() {
      if (window.i18n && typeof window.i18n.apply === 'function') {
        window.i18n.apply(container);
      }
    }

    function updateCards() {
      let visibleCount = 0;
      cards.forEach((card) => {
        const tags = card.__tagList || [];
        const matches = active.size === 0 || Array.from(active).every((tag) => tags.includes(tag));
        card.classList.toggle('is-hidden', !matches);
        if (matches) visibleCount += 1;
      });
      if (emptyEl) {
        if (visibleCount === 0) {
          emptyEl.hidden = false;
        } else {
          emptyEl.hidden = true;
        }
      }
    }

    orderedTags.forEach((tag) => {
      const label = document.createElement('label');
      label.className = 'tag-filter__option';
      const id = `tag-filter-${tag}`;
      label.innerHTML = `
        <input type="checkbox" id="${id}" value="${tag}">
        <span data-i18n="tags.${tag}">${FALLBACK_LABELS[tag] || tag}</span>
      `;
      listEl.appendChild(label);
    });

    listEl.addEventListener('change', (event) => {
      const target = event.target;
      if (!target || target.tagName !== 'INPUT') return;
      const value = String(target.value || '').toLowerCase();
      if (!value) return;
      if (target.checked) active.add(value);
      else active.delete(value);
      updateCards();
    });

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        active.clear();
        const inputs = listEl.querySelectorAll('input[type="checkbox"]');
        inputs.forEach((input) => {
          input.checked = false;
        });
        updateCards();
      });
    }

    updateCards();
    applyTranslations();

    if (window.i18n && typeof window.i18n.onChange === 'function') {
      window.i18n.onChange(() => applyTranslations());
    }
  });
})();
