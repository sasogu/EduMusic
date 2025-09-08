(() => {
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');
  const DPR = Math.max(1, Math.floor(window.devicePixelRatio || 1));

  const hud = {
    scoreEl: document.getElementById('score'),
    livesEl: document.getElementById('lives'),
    startBtn: document.getElementById('startBtn'),
    pauseBtn: document.getElementById('pauseBtn'),
    restartBtn: document.getElementById('restartBtn'),
    // ranking elements
    rankSection: document.getElementById('ranking'),
    saveWrap: document.getElementById('saveScore'),
    finalScoreEl: document.getElementById('finalScore'),
    nameInput: document.getElementById('playerName'),
    saveBtn: document.getElementById('saveBtn'),
    listEl: document.getElementById('scoreList'),
  };

  // Optional remote ranking via Supabase REST
  // To enable, set your project URL and anon key below
  const REMOTE = {
    // Configuración Supabase (completa con tu anon key)
    supabaseUrl: 'https://nbgnppkklyoubxazkfvw.supabase.co',
    supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5iZ25wcGtrbHlvdWJ4YXprZnZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczNjYwNDEsImV4cCI6MjA3Mjk0MjA0MX0.3agAyUPaeyHT3CCf_DmmQgVyL70dAKGikkGpdZ165Vs',
  };
  function remoteEnabled() {
    return Boolean(REMOTE.supabaseUrl && REMOTE.supabaseAnonKey);
  }

  // Staff metrics (computed on resize)
  const staff = {
    marginTop: 60,
    spacing: 18,
    lineYs: [], // top->bottom (0..4)
    // Helpers to get musical lines referenced from bottom
    yBottomLine() { return this.lineYs[4]; }, // 1ª línea (Mi)
    ySecondLine() { return this.lineYs[3]; }, // 2ª línea (Sol)
  };

  const state = {
    running: false,
    paused: false,
    over: false,
    score: 0,
    lives: 3,
    spawnEveryMs: 1100,
    lastSpawn: 0,
    speedBase: 120, // px/s horizontal
    speedIncrease: 0.02, // per second
    tPrev: 0,
    notes: [],
    // selectorPitch: 'sol' | 'mi'
    selectorPitch: 'sol',
    fx: [], // visual effects
  };

  // Simple piano keyboard at bottom
  const piano = {
    top: 0,
    height: 120,
    whiteCount: 7, // DO RE MI FA SOL LA SI
    keyW: 0,
    pressedAt: { mi: 0, sol: 0 },
    blackDefs: [ // indices of white keys to the left of each black key
      { over: 0, name: 'C#' }, // between DO(0) and RE(1)
      { over: 1, name: 'D#' }, // between RE(1) and MI(2)
      // no black between MI(2) and FA(3)
      { over: 3, name: 'F#' }, // between FA(3) and SOL(4)
      { over: 4, name: 'G#' }, // between SOL(4) and LA(5)
      { over: 5, name: 'A#' }, // between LA(5) and SI(6)
    ],
    blackRects: [], // computed on resize
    blackPressedAt: {},
  };

  function resize() {
    const maxW = Math.min(window.innerWidth - 32, 900);
    // Más alto para agrandar el pentagrama y piano inferior
    const maxH = Math.min(window.innerHeight - 100, 720);
    const cssW = Math.max(360, Math.floor(maxW));
    const cssH = Math.max(420, Math.floor(maxH));
    canvas.style.width = cssW + 'px';
    canvas.style.height = cssH + 'px';
    canvas.width = cssW * DPR;
    canvas.height = cssH * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

    // Piano geometry
    piano.height = Math.max(110, Math.floor(cssH * 0.26));
    piano.top = cssH - piano.height;
    piano.keyW = Math.floor(cssW / piano.whiteCount);
    // Compute black key rects
    const bw = Math.floor(piano.keyW * 0.6);
    const bh = Math.floor(piano.height * 0.62);
    piano.blackRects = piano.blackDefs.map(def => {
      const xLeftWhite = def.over * piano.keyW; // left of the white to the left
      const x = xLeftWhite + piano.keyW - Math.floor(bw / 2);
      const rect = { name: def.name, x, y: piano.top, w: bw, h: bh };
      if (piano.blackPressedAt[def.name] == null) piano.blackPressedAt[def.name] = 0;
      return rect;
    });

    // Staff lines y positions (top->bottom) within area above piano
    const topPad = 28;
    const available = Math.max(140, piano.top - topPad);
    // Espaciado para 5 líneas (~4*spacing de alto) + algo de aire
    staff.spacing = Math.max(24, Math.min(36, Math.floor(available / 6)));
    // Centrar en el espacio disponible
    const staffBlockH = 4 * staff.spacing;
    const extra = available - staffBlockH;
    staff.marginTop = Math.max(24, Math.floor(topPad + extra / 2));
    staff.lineYs = [];
    for (let i = 0; i < 5; i++) {
      staff.lineYs.push(staff.marginTop + i * staff.spacing);
    }
  }

  window.addEventListener('resize', resize);
  resize();

  function rand(min, max) { return Math.random() * (max - min) + min; }
  function choice(arr) { return arr[(Math.random() * arr.length) | 0]; }

  function spawnNote(now) {
    state.lastSpawn = now;
    const radius = Math.max(14, Math.floor(staff.spacing * 0.7));
    const pitch = choice(['sol', 'mi']);
    const y = pitch === 'sol' ? staff.ySecondLine() : staff.yBottomLine();
    const note = {
      x: -radius - 10,
      y,
      r: radius,
      pitch,
      vx: state.speedBase + state.score * 4, // speed scales con puntaje
    };
    state.notes.push(note);
  }

  function resetGame() {
    state.running = false;
    state.paused = false;
    state.over = false;
    state.score = 0;
    state.lives = 3;
    state.speedBase = 120;
    state.lastSpawn = 0;
    state.tPrev = performance.now();
    state.notes.length = 0;
    state.selectorPitch = 'sol';
    hud.scoreEl.textContent = `Puntos: ${state.score}`;
    hud.livesEl.textContent = `Vidas: ${state.lives}`;
    draw();
  }

  function startGame() {
    if (state.running && !state.over) return;
    state.over = false;
    state.paused = false;
    state.running = true;
    state.tPrev = performance.now();
    requestAnimationFrame(loop);
  }

  function pauseGame() {
    if (!state.running || state.over) return;
    state.paused = !state.paused;
    if (!state.paused) {
      state.tPrev = performance.now();
      requestAnimationFrame(loop);
    } else {
      draw();
    }
  }

  function endGame() {
    state.over = true;
    state.running = false;
    draw();
    showSaveScore();
  }

  // ---------- Ranking (localStorage) ----------
  const RANK_KEY = 'edumusic_rank_v1';
  async function loadRank() {
    if (remoteEnabled()) {
      try {
        const url = `${REMOTE.supabaseUrl}/rest/v1/scores?select=name,score,ts&order=score.desc&limit=10`;
        const res = await fetch(url, {
          headers: {
            apikey: REMOTE.supabaseAnonKey,
            Authorization: `Bearer ${REMOTE.supabaseAnonKey}`,
          },
          cache: 'no-store',
        });
        if (res.ok) return await res.json();
      } catch {}
    }
    // local fallback
    try {
      const raw = localStorage.getItem(RANK_KEY);
      if (!raw) return [];
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr : [];
    } catch { return []; }
  }
  function saveRank(arr) {
    try { localStorage.setItem(RANK_KEY, JSON.stringify(arr)); } catch {}
  }
  async function addRankEntry(name, score) {
    const entry = { name: name || 'Anónimo', score, ts: new Date().toISOString() };
    if (remoteEnabled()) {
      try {
        const url = `${REMOTE.supabaseUrl}/rest/v1/scores`;
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            apikey: REMOTE.supabaseAnonKey,
            Authorization: `Bearer ${REMOTE.supabaseAnonKey}`,
            'Content-Type': 'application/json',
            Prefer: 'return=representation',
          },
          body: JSON.stringify(entry),
        });
        if (!res.ok) throw new Error('remote insert failed');
        return await loadRank();
      } catch {
        // fallthrough to local
      }
    }
    const arr = await loadRank();
    const localArr = Array.isArray(arr) ? [...arr] : [];
    localArr.push(entry);
    localArr.sort((a,b) => b.score - a.score || new Date(a.ts) - new Date(b.ts));
    const top = localArr.slice(0, 10);
    saveRank(top);
    return top;
  }
  async function renderRank() {
    const arr = await loadRank();
    if (!hud.listEl) return;
    hud.listEl.innerHTML = '';
    if (arr.length === 0) {
      const li = document.createElement('li');
      li.textContent = 'Aún no hay puntuaciones. ¡Sé el primero!';
      hud.listEl.appendChild(li);
      return;
    }
    for (const e of arr) {
      const li = document.createElement('li');
      const date = new Date(e.ts || Date.now());
      li.textContent = `${e.name} — ${e.score} pts (${date.toLocaleDateString()})`;
      hud.listEl.appendChild(li);
    }
  }
  function showSaveScore() {
    if (!hud.saveWrap) return;
    if (state.score <= 0) { hud.saveWrap.style.display = 'none'; return; }
    hud.finalScoreEl.textContent = String(state.score);
    hud.saveWrap.style.display = '';
    hud.nameInput.value = '';
    hud.nameInput.focus();
  }
  function hideSaveScore() {
    if (hud.saveWrap) hud.saveWrap.style.display = 'none';
  }

  function update(dt) {
    // difficulty increase
    state.speedBase *= (1 + state.speedIncrease * dt);

    // spawn notes
    const now = performance.now();
    if (now - state.lastSpawn > state.spawnEveryMs) spawnNote(now);

    // move notes horizontally
    for (const n of state.notes) {
      n.x += (n.vx * dt);
    }

    // misses when note leaves by the right
    const keep = [];
    for (const n of state.notes) {
      const nx = n.x;
      const ny = n.y;
      const r = n.r;

      // Note passed catch zone without decision
      if (nx - r > canvas.clientWidth) {
        // Missed
        addCross(nx, ny);
        playError();
        state.lives -= 1;
        hud.livesEl.textContent = `Vidas: ${state.lives}`;
        if (state.lives <= 0) { endGame(); return; }
        continue;
      }

      keep.push(n);
    }
    state.notes = keep;

    // update effects
    const fxKeep = [];
    for (const e of state.fx) {
      e.ttl -= dt;
      if (e.type === 'burst') {
        for (const p of e.particles) {
          p.vy += 300 * dt;
          p.x += p.vx * dt;
          p.y += p.vy * dt;
        }
      }
      if (e.ttl > 0) fxKeep.push(e);
    }
    state.fx = fxKeep;
  }

  function drawStaff() {
    const w = canvas.clientWidth;
    ctx.save();
    ctx.strokeStyle = '#cfd8e3';
    ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
      const y = staff.lineYs[i];
      ctx.beginPath();
      ctx.moveTo(12, y);
      ctx.lineTo(w - 12, y);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawPiano() {
    const w = canvas.clientWidth;
    const top = piano.top;
    const h = piano.height;
    const keyW = piano.keyW;
    const labels = ['DO','RE','MI','FA','SOL','LA','SI'];
    ctx.save();
    // base
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, top, w, h);
    // keys
    for (let i = 0; i < piano.whiteCount; i++) {
      const x = i * keyW;
      const isMi = i === 2;
      const isSol = i === 4;
      const pressed = (isMi && performance.now() - piano.pressedAt.mi < 130) || (isSol && performance.now() - piano.pressedAt.sol < 130);
      if (isMi || isSol) {
        ctx.fillStyle = pressed ? '#c3e7ff' : '#e6f2ff';
        ctx.fillRect(x+1, top+1, keyW-2, h-2);
      }
      ctx.strokeStyle = '#cbd5e1';
      ctx.strokeRect(x+0.5, top+0.5, keyW-1, h-1);
      // label (oculto desde 20 puntos)
      if (state.score < 20) {
        ctx.fillStyle = (isMi||isSol) ? '#0f172a' : '#475569';
        ctx.font = (isMi||isSol) ? 'bold 14px system-ui, -apple-system, Segoe UI, Roboto, Arial' : '12px system-ui, -apple-system, Segoe UI, Roboto, Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillText(labels[i], x + keyW/2, top + h - 8);
      }
    }
    // black keys overlay
    for (const r of piano.blackRects) {
      const pressed = performance.now() - (piano.blackPressedAt[r.name] || 0) < 130;
      ctx.fillStyle = pressed ? '#222' : '#111';
      ctx.fillRect(r.x, r.y, r.w, r.h);
      ctx.strokeStyle = '#000';
      ctx.strokeRect(r.x + 0.5, r.y + 0.5, r.w - 1, r.h - 1);
    }
    // title
    ctx.fillStyle = '#64748b';
    ctx.font = '12px system-ui, -apple-system, Segoe UI, Roboto, Arial';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('Pulsa MI o SOL en el piano', 10, top + 8);
    ctx.restore();
  }

  function drawNotes() {
    ctx.font = 'bold 12px system-ui, -apple-system, Segoe UI, Roboto, Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (const n of state.notes) {
      // note head
      ctx.beginPath();
      ctx.fillStyle = n.pitch === 'sol' ? '#2e7d32' : '#c62828';
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
      // opcional: plica para parecer más notación (a la derecha)
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(n.x + n.r, n.y);
      ctx.lineTo(n.x + n.r, n.y - Math.floor(staff.spacing * 2));
      ctx.stroke();
      // Mostrar nombre solo hasta 10 puntos
      if (state.score < 10) {
        ctx.fillStyle = '#111';
        ctx.fillText(n.pitch.toUpperCase(), n.x, n.y - Math.floor(staff.spacing * 2.4));
      }
    }
  }

  function drawOverlay() {
    if (!state.paused && !state.over) return;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 28px system-ui, -apple-system, Segoe UI, Roboto, Arial';
    ctx.fillText(state.over ? 'Juego terminado' : 'Pausa', w/2, h/2 - 10);
    ctx.font = '16px system-ui, -apple-system, Segoe UI, Roboto, Arial';
    const msg = state.over ? 'Pulsa Reiniciar para jugar de nuevo' : 'Pulsa Pausa para continuar';
    ctx.fillText(msg, w/2, h/2 + 22);
    ctx.restore();
  }

  function clear() {
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
  }

  function draw() {
    clear();
    drawStaff();
    drawNotes();
    drawPiano();
    drawFX();
    drawOverlay();
  }

  function loop(tNow) {
    if (!state.running || state.paused || state.over) { draw(); return; }
    const dt = Math.min(0.035, (tNow - state.tPrev) / 1000);
    state.tPrev = tNow;
    update(dt);
    draw();
    if (state.running && !state.paused && !state.over) requestAnimationFrame(loop);
  }

  function handleHit(pitch) {
    // Visual feedback first
    if (pitch === 'mi') piano.pressedAt.mi = performance.now();
    else piano.pressedAt.sol = performance.now();

    // Choose the leading (most advanced to the right) note still on screen
    let leadIndex = -1;
    let maxX = -Infinity;
    for (let i = 0; i < state.notes.length; i++) {
      const n = state.notes[i];
      if (n.x - n.r > canvas.clientWidth) continue; // already past
      if (n.x > maxX) { maxX = n.x; leadIndex = i; }
    }
    if (leadIndex === -1) return; // no notes to evaluate

    const lead = state.notes[leadIndex];
    if (lead.pitch === pitch) {
      // Correct: remove leading note and add score
      addBurst(lead.x, lead.y);
      playPitch(lead.pitch);
      state.notes.splice(leadIndex, 1);
      state.score += 1;
      hud.scoreEl.textContent = `Puntos: ${state.score}`;
    } else {
      // Wrong: lose a life
      addCross(lead.x, lead.y);
      playError();
      state.lives -= 1;
      hud.livesEl.textContent = `Vidas: ${state.lives}`;
      if (state.lives <= 0) { endGame(); return; }
    }
  }

  // ---------- Visual FX ----------
  function addBurst(x, y) {
    const count = 12;
    const particles = [];
    for (let i = 0; i < count; i++) {
      const a = (Math.PI * 2 * i) / count + Math.random() * 0.3;
      const sp = 120 + Math.random() * 160;
      particles.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp });
    }
    state.fx.push({ type: 'burst', ttl: 0.35, particles });
  }
  function addCross(x, y) {
    state.fx.push({ type: 'cross', ttl: 0.35, x, y });
  }
  function drawFX() {
    for (const e of state.fx) {
      const t = Math.max(0, Math.min(1, e.ttl / 0.35));
      if (e.type === 'burst') {
        const alpha = 0.8 * t;
        for (const p of e.particles) {
          ctx.fillStyle = `rgba(34,197,94,${alpha})`; // green
          ctx.beginPath();
          ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (e.type === 'cross') {
        const alpha = 0.85 * t;
        ctx.strokeStyle = `rgba(198,40,40,${alpha})`; // red
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(e.x - 14, e.y - 14);
        ctx.lineTo(e.x + 14, e.y + 14);
        ctx.moveTo(e.x + 14, e.y - 14);
        ctx.lineTo(e.x - 14, e.y + 14);
        ctx.stroke();
      }
    }
  }

  // ---------- Audio ----------
  const audio = { ctx: null };
  function ensureAudio() {
    if (!audio.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) audio.ctx = new AC();
    }
  }
  function tone(freq, durMs, type = 'sine', gain = 0.08) {
    if (!audio.ctx) return;
    const now = audio.ctx.currentTime;
    const osc = audio.ctx.createOscillator();
    const g = audio.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(gain, now + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, now + durMs / 1000);
    osc.connect(g).connect(audio.ctx.destination);
    osc.start(now);
    osc.stop(now + durMs / 1000 + 0.02);
  }
  function playPitch(pitch) {
    ensureAudio();
    // E4 ≈ 329.63 Hz, G4 ≈ 392.00 Hz
    const freq = pitch === 'mi' ? 329.63 : 392.0;
    tone(freq, 160, 'sine', 0.09);
  }
  function playError() {
    ensureAudio();
    // two short low beeps
    tone(220, 120, 'square', 0.05);
    setTimeout(() => tone(180, 120, 'triangle', 0.05), 70);
  }

  // Keyboard: S = Sol, M = Mi, P = pausa
  window.addEventListener('keydown', (e) => {
    const k = e.key.toLowerCase();
    if (k === 's') { ensureAudio(); handleHit('sol'); }
    else if (k === 'm') { ensureAudio(); handleHit('mi'); }
    else if (k === 'p') { e.preventDefault(); pauseGame(); }
  });

  // Pointer: tocar sobre el piano
  canvas.addEventListener('pointerdown', (e) => {
    ensureAudio();
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (y >= piano.top) {
      // Prioridad a teclas negras (dibujadas encima)
      for (const r of piano.blackRects) {
        if (x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h) {
          piano.blackPressedAt[r.name] = performance.now();
          return; // negras no afectan al juego, solo visual
        }
      }
      // Si no tocó negra, evaluar blanca
      const i = Math.floor(x / piano.keyW);
      if (i === 2) handleHit('mi');
      else if (i === 4) handleHit('sol');
    }
  });

  // Buttons
  hud.startBtn.addEventListener('click', () => { if (state.over) resetGame(); startGame(); });
  hud.pauseBtn.addEventListener('click', pauseGame);
  hud.restartBtn.addEventListener('click', () => { resetGame(); startGame(); });

  // Save score handlers
  if (hud.saveBtn) {
    hud.saveBtn.addEventListener('click', async () => {
      const name = (hud.nameInput.value || '').trim() || 'Anónimo';
      await addRankEntry(name, state.score);
      hideSaveScore();
      renderRank();
    });
  }
  if (hud.nameInput) {
    hud.nameInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        hud.saveBtn.click();
      }
    });
  }

  // Init
  resetGame();
  renderRank();
})();
