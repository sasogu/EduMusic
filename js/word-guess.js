(function() {
  const MAX_MISTAKES = 6;
  const LETTERS = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G',
    'H', 'I', 'J', 'K', 'L', 'M', 'N',
    'Ñ', 'O', 'P', 'Q', 'R', 'S', 'T',
    'U', 'V', 'W', 'X', 'Y', 'Z'
  ];

  const SCOREBOARD_ID = 'wordguess';
  const BASE_ROUND_SCORE = 50;
  const BONUS_PER_ATTEMPT = 10;

  const WORD_BANK = {
    instruments: [
      {
        id: 'piano',
        term: { es: 'PIANO', val: 'PIANO' },
        hint: {
          es: 'Instrumento de teclado con cuerdas percutidas.',
          val: 'Instrument de teclat amb cordes percudides.'
        }
      },
      {
        id: 'viola',
        term: { es: 'VIOLA', val: 'VIOLA' },
        hint: {
          es: 'Instrumento de cuerda frotada ligeramente mayor que el violín.',
          val: 'Instrument de corda fregada lleugerament més gran que el violí.'
        }
      },
      {
        id: 'oboe',
        term: { es: 'OBOE', val: 'OBOE' },
        hint: {
          es: 'Instrumento de viento madera con doble lengüeta.',
          val: 'Instrument de vent-fusta amb doble canya.'
        }
      },
      {
        id: 'marimba',
        term: { es: 'MARIMBA', val: 'MARIMBA' },
        hint: {
          es: 'Instrumento de placas afinadas que se golpean con mazas.',
          val: 'Instrument de làmines afinades que es colpegen amb baquetes.'
        }
      },
      {
        id: 'fagot',
        term: { es: 'FAGOT', val: 'FAGOT' },
        hint: {
          es: 'Instrumento grave de viento madera de gran longitud.',
          val: 'Instrument greu de vent-fusta de gran llargària.'
        }
      },
      {
        id: 'arpa',
        term: { es: 'ARPA', val: 'ARPA' },
        hint: {
          es: 'Instrumento de cuerdas pulsadas con forma triangular.',
          val: 'Instrument de cordes polsades amb forma triangular.'
        }
      },
      {
        id: 'clarinete',
        term: { es: 'CLARINETE', val: 'CLARINET' },
        hint: {
          es: 'Instrumento de viento madera con boquilla de caña simple.',
          val: 'Instrument de vent-fusta amb boqueta de canya senzilla.'
        }
      },
      {
        id: 'trombon',
        term: { es: 'TROMBON', val: 'TROMBON' },
        hint: {
          es: 'Instrumento de metal con vara deslizante.',
          val: 'Instrument de vent-metall amb vara lliscant.'
        }
      },
      {
        id: 'timbales',
        term: { es: 'TIMBALES', val: 'TIMBALS' },
        hint: {
          es: 'Pareja de tambores afinables presentes en la orquesta.',
          val: 'Parell de tambors afinables presents en l\'orquestra.'
        }
      }
    ],
    signs: [
      {
        id: 'pentagrama',
        term: { es: 'PENTAGRAMA', val: 'PENTAGRAMA' },
        hint: {
          es: 'Conjunto de cinco líneas y cuatro espacios para escribir música.',
          val: 'Conjunt de cinc línies i quatre espais per a escriure música.'
        }
      },
      {
        id: 'sostenido',
        term: { es: 'SOSTENIDO', val: 'SOSTINGUT' },
        hint: {
          es: 'Signo que eleva medio tono a la nota.',
          val: 'Signe que eleva mig to a la nota.'
        }
      },
      {
        id: 'bemol',
        term: { es: 'BEMOL', val: 'BEMOLL' },
        hint: {
          es: 'Signo que baja medio tono a la nota.',
          val: 'Signe que baixa mig to a la nota.'
        }
      },
      {
        id: 'compas',
        term: { es: 'COMPAS', val: 'COMPAS' },
        hint: {
          es: 'Unidad que agrupa pulsos con un número superior e inferior.',
          val: 'Unitat que agrupa pulsacions amb un numerador i un denominador.'
        }
      },
      {
        id: 'calderon',
        term: { es: 'CALDERON', val: 'CALDERON' },
        hint: {
          es: 'Signo que indica prolongar una nota más de su valor.',
          val: 'Signe que indica perllongar una nota més del seu valor.'
        }
      },
      {
        id: 'ligadura',
        term: { es: 'LIGADURA', val: 'LLIGADURA' },
        hint: {
          es: 'Une dos notas iguales para sumar su duración.',
          val: 'Une dues notes iguals per a sumar la seua duració.'
        }
      },
      {
        id: 'silencio',
        term: { es: 'SILENCIO', val: 'SILENCI' },
        hint: {
          es: 'Símbolo que representa ausencia de sonido.',
          val: 'Símbol que representa absència de so.'
        }
      },
      {
        id: 'dinamica',
        term: { es: 'DINAMICA', val: 'DINAMICA' },
        hint: {
          es: 'Indicaciones de intensidad como forte o piano.',
          val: 'Indicacions d\'intensitat com forte o piano.'
        }
      },
      {
        id: 'crescendo',
        term: { es: 'CRESCENDO', val: 'CRESCENDO' },
        hint: {
          es: 'Indica aumentar progresivamente el volumen.',
          val: 'Indica augmentar progressivament el volum.'
        }
      }
    ],
    language: [
      {
        id: 'arpegio',
        term: { es: 'ARPEGIO', val: 'ARPEGI' },
        hint: {
          es: 'Acorde cuyas notas suenan de forma sucesiva.',
          val: 'Acord les notes del qual sonen de manera successiva.'
        }
      },
      {
        id: 'escala',
        term: { es: 'ESCALA', val: 'ESCALA' },
        hint: {
          es: 'Sucesión ordenada de notas que define una tonalidad.',
          val: 'Successió ordenada de notes que defineix una tonalitat.'
        }
      },
      {
        id: 'intervalo',
        term: { es: 'INTERVALO', val: 'INTERVAL' },
        hint: {
          es: 'Distancia entre dos sonidos.',
          val: 'Distància entre dos sons.'
        }
      },
      {
        id: 'tonalidad',
        term: { es: 'TONALIDAD', val: 'TONALITAT' },
        hint: {
          es: 'Centro sonoro que organiza una escala.',
          val: 'Centre sonor que organitza una escala.'
        }
      },
      {
        id: 'polirritmo',
        term: { es: 'POLIRRITMO', val: 'POLIRRITME' },
        hint: {
          es: 'Superposición de patrones rítmicos diferentes.',
          val: 'Superposició de patrons rítmics diferents.'
        }
      },
      {
        id: 'sincopa',
        term: { es: 'SINCOPA', val: 'SINCOPA' },
        hint: {
          es: 'Desplazamiento del acento hacia tiempos débiles.',
          val: 'Desplaçament de l\'accent cap als temps febles.'
        }
      },
      {
        id: 'armadura',
        term: { es: 'ARMADURA', val: 'ARMADURA' },
        hint: {
          es: 'Conjunto de sostenidos o bemoles al inicio del pentagrama.',
          val: 'Conjunt de sostinguts o bemolls a l\'inici del pentagrama.'
        }
      },
      {
        id: 'cromatica',
        term: { es: 'CROMATICA', val: 'CROMATICA' },
        hint: {
          es: 'Escala que avanza por semitonos.',
          val: 'Escala que avança per semitons.'
        }
      },
      {
        id: 'modulacion',
        term: { es: 'MODULACION', val: 'MODULACIO' },
        hint: {
          es: 'Cambio de tonalidad dentro de una pieza.',
          val: 'Canvi de tonalitat dins d\'una peça.'
        }
      }
    ]
  };

  const pools = {
    mix: [],
    instruments: [],
    signs: [],
    language: []
  };

  const state = {
    entry: null,
    term: '',
    hint: '',
    mistakes: 0,
    usedLetters: new Set(),
    active: false,
    solved: 0,
    sessionScore: 0,
    messageKey: null,
    messageParams: null,
    messageType: null,
    status: 'idle'
  };

  const elements = {};
  const keyboardButtons = new Map();

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

  function t(key, params) {
    if (window.i18n && typeof window.i18n.t === 'function') {
      return window.i18n.t(key, params);
    }
    return key;
  }

  function getLang() {
    if (window.i18n && typeof window.i18n.getLang === 'function') {
      return window.i18n.getLang();
    }
    return 'es';
  }

  function flattenBank() {
    return Object.keys(WORD_BANK)
      .map((key) => WORD_BANK[key])
      .flat();
  }

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function ensurePool(category) {
    if (category === 'mix') {
      if (!pools.mix.length) {
        pools.mix = shuffle(flattenBank().slice());
      }
      return pools.mix;
    }
    const source = WORD_BANK[category];
    if (!source) return [];
    if (!pools[category].length) {
      pools[category] = shuffle(source.slice());
    }
    return pools[category];
  }

  function drawWord(category) {
    const pool = ensurePool(category);
    if (!pool.length) return null;
    return pool.pop();
  }

  function createKeyboard() {
    elements.keyboard.innerHTML = '';
    keyboardButtons.clear();
    LETTERS.forEach((letter) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = letter;
      button.disabled = true;
      button.addEventListener('click', () => handleGuess(letter));
      keyboardButtons.set(letter, button);
      elements.keyboard.appendChild(button);
    });
  }

  function resetKeyboard() {
    keyboardButtons.forEach((button) => {
      button.disabled = false;
      button.classList.remove('correct', 'wrong');
    });
  }

  function updateLocalizedEntry(resetLetters) {
    if (!state.entry) {
      state.term = '';
      state.hint = '';
      updateWordDisplay();
      return;
    }
    const lang = getLang();
    const term = state.entry.term[lang] || state.entry.term.es || '';
    const hint = state.entry.hint[lang] || state.entry.hint.es || '';
    if (resetLetters) {
      state.usedLetters = new Set();
    }
    state.term = term.toUpperCase();
    state.hint = hint;
    if (elements.hintText) {
      elements.hintText.textContent = state.hint;
    }
    updateWordDisplay();
    if (state.messageKey === 'wordguess.feedback.fail') {
      state.messageParams = { word: state.term };
    }
  }

  function updateWordDisplay() {
    if (!elements.word) return;
    elements.word.innerHTML = '';
    if (!state.term) {
      const span = document.createElement('span');
      span.textContent = '_';
      elements.word.appendChild(span);
      return;
    }
    state.term.split('').forEach((char) => {
      const span = document.createElement('span');
      if (state.usedLetters.has(char)) {
        span.textContent = char;
        span.classList.add('revealed');
      } else {
        span.textContent = '_';
      }
      elements.word.appendChild(span);
    });
  }

  function renderProgress() {
    if (!elements.progress) return;
    elements.progress.innerHTML = '';
    for (let i = 0; i < MAX_MISTAKES; i++) {
      const span = document.createElement('span');
      if (i < state.mistakes) {
        span.textContent = '♭';
        span.classList.add('filled');
      } else {
        span.textContent = '♩';
      }
      elements.progress.appendChild(span);
    }
  }

  function updateAttempts() {
    if (!elements.attempts) return;
    const remaining = Math.max(0, MAX_MISTAKES - state.mistakes);
    elements.attempts.textContent = String(remaining);
  }

  function isWordSolved() {
    if (!state.term) return false;
    return state.term.split('').every((char) => state.usedLetters.has(char));
  }

  function setMessage(key, type, params) {
    state.messageKey = key;
    state.messageParams = params || null;
    state.messageType = type || null;

    if (!elements.message) return;
    elements.message.textContent = key ? t(key, params) : '';
    elements.message.classList.remove('success', 'fail');
    if (type) elements.message.classList.add(type);
  }

  function refreshMessage() {
    setMessage(state.messageKey, state.messageType, state.messageParams);
  }

  function startRound() {
    if (state.status === 'lost' || state.status === 'idle') {
      state.sessionScore = 0;
    }
    hideScoreboardPrompt();
    const category = elements.category.value || 'mix';
    const entry = drawWord(category);
    if (!entry) {
      state.active = false;
      state.status = 'idle';
      setMessage('wordguess.feedback.empty', 'fail');
      elements.hintBtn.disabled = true;
      keyboardButtons.forEach((button) => { button.disabled = true; });
      return;
    }

    state.entry = entry;
    state.mistakes = 0;
    state.active = true;
    state.status = 'playing';

    resetKeyboard();
    updateLocalizedEntry(true);

    renderProgress();
    updateAttempts();
    elements.hintText.hidden = true;
    elements.hintBtn.disabled = false;

    setMessage('wordguess.feedback.new', null);
  }

  function handleGuess(rawLetter) {
    if (!state.active || !state.term) return;
    const letter = rawLetter.toUpperCase();
    if (state.usedLetters.has(letter)) return;

    state.usedLetters.add(letter);
    const button = keyboardButtons.get(letter);
    if (button) button.disabled = true;

    if (state.term.includes(letter)) {
      if (button) button.classList.add('correct');
      updateWordDisplay();
      if (isWordSolved()) endRound(true);
    } else {
      state.mistakes += 1;
      if (button) button.classList.add('wrong');
      renderProgress();
      updateAttempts();
      if (state.mistakes >= MAX_MISTAKES) {
        endRound(false);
      } else {
        const remaining = MAX_MISTAKES - state.mistakes;
        setMessage('wordguess.feedback.retry', null, { remaining });
      }
    }
  }

  function endRound(win) {
    state.active = false;
    keyboardButtons.forEach((button) => { button.disabled = true; });
    elements.hintBtn.disabled = true;

    if (win) {
      state.status = 'won';
      state.solved += 1;
      elements.solved.textContent = String(state.solved);
      const remaining = Math.max(0, MAX_MISTAKES - state.mistakes);
      const roundScore = BASE_ROUND_SCORE + (remaining * BONUS_PER_ATTEMPT);
      state.sessionScore += roundScore;
      hideScoreboardPrompt();
      setMessage('wordguess.feedback.win', 'success', {
        round: roundScore,
        total: state.sessionScore
      });
    } else {
      state.status = 'lost';
      state.term.split('').forEach((char) => state.usedLetters.add(char));
      updateWordDisplay();
      const finalScore = state.sessionScore;
      setMessage('wordguess.feedback.fail', 'fail', {
        word: state.term,
        score: finalScore
      });
      if (finalScore > 0) showScoreboardPrompt(finalScore);
      else hideScoreboardPrompt();
    }
  }

  function onHint() {
    if (!state.term) return;
    elements.hintText.hidden = false;
    elements.hintBtn.disabled = true;
    elements.hintText.textContent = state.hint;
  }

  function handleKeydown(event) {
    if (!state.active) return;
    const letter = (event.key || '').toUpperCase();
    if (!keyboardButtons.has(letter)) return;
    event.preventDefault();
    handleGuess(letter);
  }

  function onLanguageChange() {
    updateLocalizedEntry(false);
    if (state.status === 'lost') {
      state.messageParams = {
        word: state.term,
        score: state.sessionScore
      };
    } else if (state.status === 'won' && state.messageParams && typeof state.messageParams.round === 'number') {
      state.messageParams = {
        round: state.messageParams.round,
        total: state.sessionScore
      };
    }
    refreshMessage();
  }

  function setupElements() {
    elements.category = document.getElementById('wordguessCategory');
    elements.start = document.getElementById('wordguessStart');
    elements.hintBtn = document.getElementById('wordguessHint');
    elements.word = document.getElementById('wordguessWord');
    elements.message = document.getElementById('wordguessMessage');
    elements.progress = document.getElementById('wordguessProgress');
    elements.attempts = document.getElementById('wordguessAttempts');
    elements.solved = document.getElementById('wordguessSolved');
    elements.hintText = document.getElementById('wordguessHintText');
    elements.keyboard = document.getElementById('wordguessKeyboard');
  }

  function init() {
    setupElements();
    if (
      !elements.start || !elements.keyboard || !elements.word || !elements.message ||
      !elements.progress || !elements.attempts || !elements.hintText ||
      !elements.hintBtn || !elements.category || !elements.solved
    ) {
      return;
    }

    createKeyboard();
    renderProgress();
    updateWordDisplay();
    updateAttempts();

    elements.start.addEventListener('click', startRound);
    elements.hintBtn.addEventListener('click', onHint);
    document.addEventListener('keydown', handleKeydown);

    if (window.i18n && typeof window.i18n.onChange === 'function') {
      window.i18n.onChange(onLanguageChange);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
