/* ============================================================
   PAGES/GAMES.JS — Pi Games: Memory, Pattern Lock, Runner
   ============================================================ */

// Digit button colors matching the screenshots
const DIGIT_COLORS = {
  0: '#7D2A2A', // dark red/brown
  1: '#5C5C1A', // olive
  2: '#3D6E3D', // green
  3: '#2D5A2D', // dark green
  4: '#3E6641', // green-teal
  5: '#1E5C5C', // teal
  6: '#1A3A5C', // navy-blue
  7: '#2D2D70', // purple
  8: '#7D2D7D', // plum
  9: '#6B2A3B', // maroon
};

// ---- Game State ----
let memoryState = {
  round: 1,
  score: 0,
  sequence: [],
  playerIndex: 0,
  isShowingSequence: false,
  isWaitingForInput: false
};

let patternState = {
  level: 1,
  typed: '',
  score: 0
};

let runnerState = {
  running: false,
  raf: null
};

let activeGame = 'memory';
let gamesInitialized = false;

function renderGames() {
  const section = document.getElementById('page-games');
  section.innerHTML = `
  <div class="content-wrap">

    <div class="page-header">
      <span class="pill pill-orange">Games</span>
      <h1 class="page-title">Pi Games</h1>
      <p class="page-subtitle">Fun interactive games themed around π. Learn the digits while you play!</p>
      <div class="divider-line"><span></span><span></span></div>
    </div>

    <!-- Game Selection Cards -->
    <div class="game-cards-row" id="game-cards-row">

      <div class="game-card active" data-game="memory" id="card-memory" onclick="selectGame('memory')">
        <div class="game-card-badges">
          <span class="game-diff-badge diff-easy">Easy</span>
          <span class="game-type-label">Memory</span>
        </div>
        <div class="game-card-icon"><i class="fa-solid fa-trophy"></i></div>
        <div class="game-card-title">Memory Game</div>
        <div class="game-card-desc">Watch the π-digit sequence light up, then repeat it. Each round adds one more digit!</div>
      </div>

      <div class="game-card" data-game="pattern" id="card-pattern" onclick="selectGame('pattern')">
        <div class="game-card-badges">
          <span class="game-diff-badge diff-medium">Medium</span>
          <span class="game-type-label">Puzzle</span>
        </div>
        <div class="game-card-icon"><i class="fa-solid fa-lock"></i></div>
        <div class="game-card-title">Pattern Lock</div>
        <div class="game-card-desc">Enter the next N digits of π to unlock each level. The sequence grows harder!</div>
      </div>

      <div class="game-card" data-game="runner" id="card-runner" onclick="selectGame('runner')">
        <div class="game-card-badges">
          <span class="game-diff-badge diff-hard">Hard</span>
          <span class="game-type-label">Action</span>
        </div>
        <div class="game-card-icon"><i class="fa-solid fa-bolt"></i></div>
        <div class="game-card-title">Runner Game</div>
        <div class="game-card-desc">Jump over obstacles whose heights are determined by π digits. Press Space or tap to jump!</div>
      </div>

    </div>

    <!-- Game Content Area -->
    <div id="game-content-area"></div>

  </div>
  ${getFooterHTML()}`;
}

function initGames() {
  if (gamesInitialized) return;
  gamesInitialized = true;
  renderMemoryGame();
}

function selectGame(game) {
  activeGame = game;
  document.querySelectorAll('.game-card').forEach(c => c.classList.toggle('active', c.dataset.game === game));
  stopRunner();
  if (game === 'memory') renderMemoryGame();
  else if (game === 'pattern') renderPatternLock();
  else if (game === 'runner') renderRunnerGame();
}

// ========================
// MEMORY GAME
// ========================
function renderMemoryGame() {
  const area = document.getElementById('game-content-area');
  if (!area) return;

  area.innerHTML = `
  <div class="memory-game-panel">
    <div class="memory-game-header">
      <div class="memory-game-title">
        <i class="fa-solid fa-trophy"></i> Memory Game
      </div>
      <div style="display:flex;gap:20px;align-items:center;">
        <div class="memory-score-info">Round: <span class="score-val" id="mem-round">1</span> | Score: <span class="score-val" id="mem-score">0</span></div>
        <div class="press-to-play" id="mem-status">Press Start to play</div>
      </div>
    </div>

    <div class="digit-grid">
      ${[0,1,2,3,4,5,6,7,8,9].map(d => `
        <button class="digit-btn" id="digit-btn-${d}"
          style="background:${DIGIT_COLORS[d]};"
          onclick="handleDigitClick(${d})">
          ${d}
        </button>
      `).join('')}
    </div>

    <button class="btn btn-primary btn-full" id="start-game-btn" onclick="startMemoryGame()" style="font-size:16px;padding:15px;">
      Start Game
    </button>
    <p class="game-seq-hint">Sequence uses digits of π: 1415… Press 0–9 keys or click buttons.</p>
  </div>`;

  memoryState = { round: 1, score: 0, sequence: [], playerIndex: 0, isShowingSequence: false, isWaitingForInput: false };
  setupMemoryKeyboard();
}

function setupMemoryKeyboard() {
  document.onkeydown = (e) => {
    if (activeGame !== 'memory') return;
    const d = parseInt(e.key);
    if (!isNaN(d) && d >= 0 && d <= 9) handleDigitClick(d);
  };
}

function startMemoryGame() {
  memoryState.round = 1;
  memoryState.score = 0;
  memoryState.sequence = [];
  updateMemoryUI();
  nextRound();
}

function nextRound() {
  // Add next π digit to sequence
  const nextDigit = parseInt(PI_DIGITS[memoryState.sequence.length + 1]); // skip leading 3
  memoryState.sequence.push(nextDigit);
  memoryState.playerIndex = 0;
  memoryState.isWaitingForInput = false;
  memoryState.isShowingSequence = true;
  setStatus('Watch the sequence…');
  document.getElementById('start-game-btn').disabled = true;

  let i = 0;
  function showNext() {
    if (i >= memoryState.sequence.length) {
      memoryState.isShowingSequence = false;
      memoryState.isWaitingForInput = true;
      document.getElementById('start-game-btn').disabled = false;
      setStatus('Your turn! Repeat the sequence.');
      return;
    }
    const d = memoryState.sequence[i];
    lightUpDigit(d);
    setTimeout(() => {
      dimDigit(d);
      i++;
      setTimeout(showNext, 300);
    }, 550);
  }
  setTimeout(showNext, 600);
}

function lightUpDigit(d) {
  const btn = document.getElementById(`digit-btn-${d}`);
  if (!btn) return;
  btn.classList.add('lit');
  btn.style.boxShadow = `0 0 24px rgba(255,255,255,0.5)`;
  btn.style.filter = 'brightness(1.4)';
}

function dimDigit(d) {
  const btn = document.getElementById(`digit-btn-${d}`);
  if (!btn) return;
  btn.classList.remove('lit');
  btn.style.boxShadow = '';
  btn.style.filter = '';
}

function handleDigitClick(d) {
  if (!memoryState.isWaitingForInput) return;
  lightUpDigit(d);
  setTimeout(() => dimDigit(d), 200);

  const expected = memoryState.sequence[memoryState.playerIndex];
  if (d !== expected) {
    // Wrong!
    const btn = document.getElementById(`digit-btn-${d}`);
    if (btn) btn.classList.add('wrong');
    setTimeout(() => { if(btn) btn.classList.remove('wrong'); }, 500);
    setStatus(`❌ Wrong! Expected ${expected}. Game over! Score: ${memoryState.score}`);
    memoryState.isWaitingForInput = false;
    document.getElementById('start-game-btn').textContent = '↺ Play Again';
    return;
  }

  memoryState.playerIndex++;
  if (memoryState.playerIndex >= memoryState.sequence.length) {
    // Correct round!
    memoryState.score += memoryState.round * 10;
    memoryState.round++;
    updateMemoryUI();
    setStatus(`✅ Correct! Round ${memoryState.round} incoming…`);
    memoryState.isWaitingForInput = false;
    setTimeout(nextRound, 1200);
  }
}

function updateMemoryUI() {
  const r = document.getElementById('mem-round');
  const s = document.getElementById('mem-score');
  if (r) r.textContent = memoryState.round;
  if (s) s.textContent = memoryState.score;
}

function setStatus(msg) {
  const st = document.getElementById('mem-status');
  if (st) st.textContent = msg;
}

// ========================
// PATTERN LOCK GAME
// ========================
function renderPatternLock() {
  const area = document.getElementById('game-content-area');
  if (!area) return;

  patternState = { level: 1, typed: '', score: 0 };
  const target = PI_DIGITS.slice(1, 1 + patternState.level + 2); // e.g. 3 digits for level 1

  area.innerHTML = `
  <div class="pattern-lock-panel">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
      <div class="memory-game-title"><i class="fa-solid fa-lock" style="color:var(--orange);"></i> Pattern Lock</div>
      <div class="memory-score-info">Level: <span class="score-val" id="pl-level">1</span> | Score: <span class="score-val" id="pl-score">0</span></div>
    </div>

    <p style="font-size:14px;color:var(--text-mid);margin-bottom:12px;">
      Enter the next <strong id="pl-count">${target.length}</strong> digits of π to unlock this level.
      <span style="color:var(--orange);font-weight:600;">Digits of π: 3.14159265358979…</span>
    </p>

    <div class="pattern-display" id="pl-display">
      <span id="pl-chars"></span>
    </div>

    <div class="digit-grid" style="margin-bottom:12px;">
      ${[0,1,2,3,4,5,6,7,8,9].map(d => `
        <button class="digit-btn" style="background:${DIGIT_COLORS[d]};"
          onclick="patternDigitPress(${d})">${d}</button>
      `).join('')}
    </div>

    <div style="display:flex;gap:12px;">
      <button class="btn btn-secondary" onclick="patternClear()" style="flex:1;">Clear</button>
      <button class="btn btn-primary" onclick="patternCheck()" style="flex:1;"><i class="fa-solid fa-unlock"></i> Unlock</button>
    </div>

    <div id="pl-message" style="margin-top:12px;font-size:14px;color:var(--text-mid);text-align:center;min-height:20px;"></div>
  </div>`;

  updatePatternDisplay();
  document.onkeydown = (e) => {
    if (activeGame !== 'pattern') return;
    const d = parseInt(e.key);
    if (!isNaN(d) && d >= 0 && d <= 9) patternDigitPress(d);
    if (e.key === 'Enter') patternCheck();
    if (e.key === 'Backspace') { patternState.typed = patternState.typed.slice(0,-1); updatePatternDisplay(); }
  };
}

function getPatternTarget() {
  return PI_DIGITS.slice(1, 1 + patternState.level + 2);
}

function patternDigitPress(d) {
  const target = getPatternTarget();
  if (patternState.typed.length >= target.length) return;
  patternState.typed += d;
  updatePatternDisplay();
}

function patternClear() {
  patternState.typed = '';
  updatePatternDisplay();
  const msg = document.getElementById('pl-message');
  if (msg) msg.textContent = '';
}

function updatePatternDisplay() {
  const target = getPatternTarget();
  const charsEl = document.getElementById('pl-chars');
  if (!charsEl) return;
  let html = '';
  for (let i = 0; i < target.length; i++) {
    if (i < patternState.typed.length) {
      const correct = patternState.typed[i] === target[i];
      html += `<span style="color:${correct ? 'var(--orange)' : '#e55'};font-size:28px;font-weight:800;">${patternState.typed[i]}</span>`;
    } else {
      html += `<span style="color:#ccc;font-size:28px;">_</span>`;
    }
    if (i < target.length - 1) html += '<span style="color:#ccc;font-size:28px;"> </span>';
  }
  charsEl.innerHTML = html;
}

function patternCheck() {
  const target = getPatternTarget();
  const msg = document.getElementById('pl-message');
  if (patternState.typed.length < target.length) {
    if (msg) msg.textContent = `Enter all ${target.length} digits first.`;
    return;
  }
  if (patternState.typed === target) {
    patternState.score += patternState.level * 20;
    patternState.level++;
    if (msg) msg.innerHTML = `<span style="color:var(--orange);font-weight:700;">✅ Unlocked! Level ${patternState.level}</span>`;
    document.getElementById('pl-level').textContent = patternState.level;
    document.getElementById('pl-score').textContent = patternState.score;
    const newTarget = getPatternTarget();
    document.getElementById('pl-count').textContent = newTarget.length;
    patternState.typed = '';
    setTimeout(() => { if (msg) msg.textContent = ''; updatePatternDisplay(); }, 1200);
  } else {
    if (msg) msg.innerHTML = `<span style="color:#e55;">❌ Wrong! Try again. The sequence was: <strong>${target}</strong></span>`;
    patternState.typed = '';
    setTimeout(() => { if (msg) msg.textContent = ''; updatePatternDisplay(); }, 2000);
  }
}

// ========================
// RUNNER GAME
// ========================
let runnerPlayer, runnerObstacles, runnerScore, runnerDigitIndex, runnerAnimReq;
const RUNNER_H = 140;
const GROUND_Y = RUNNER_H - 28;
const GRAVITY = 0.55;
const JUMP_V = -10;

function renderRunnerGame() {
  const area = document.getElementById('game-content-area');
  if (!area) return;

  area.innerHTML = `
  <div class="card" style="padding:20px;margin-bottom:24px;">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
      <div class="memory-game-title"><i class="fa-solid fa-bolt" style="color:var(--orange);"></i> Runner Game</div>
      <div class="memory-score-info">Score: <span class="score-val" id="runner-score-display">0</span></div>
    </div>
    <div class="runner-info">
      <span>Jump obstacles (height = π digits × 4)</span>
      <span>Press <kbd style="background:#eee;padding:2px 6px;border-radius:4px;font-family:monospace;">Space</kbd> or tap canvas to jump</span>
    </div>
    <div class="runner-canvas-wrap">
      <canvas id="runner-canvas" width="640" height="${RUNNER_H}" style="cursor:pointer;"></canvas>
    </div>
    <div style="display:flex;gap:10px;margin-top:12px;">
      <button class="btn btn-primary" id="runner-start-btn" onclick="startRunner()" style="flex:1;">
        <i class="fa-solid fa-play"></i> Start
      </button>
      <button class="btn btn-secondary" id="runner-stop-btn" onclick="stopRunner()" style="flex:1;">
        <i class="fa-solid fa-stop"></i> Stop
      </button>
    </div>
  </div>`;

  initRunner();
}

function initRunner() {
  const canvas = document.getElementById('runner-canvas');
  if (!canvas) return;
  canvas.addEventListener('click', runnerJump);
  document.onkeydown = (e) => {
    if (activeGame !== 'runner') return;
    if (e.key === ' ' || e.code === 'Space') { e.preventDefault(); runnerJump(); }
  };
  drawRunnerIdle(canvas);
}

function drawRunnerIdle(canvas) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.fillStyle = '#0D0F29';
  ctx.fillRect(0, 0, W, H);
  // Ground
  ctx.fillStyle = 'rgba(236,111,0,0.4)';
  ctx.fillRect(0, GROUND_Y, W, 2);
  // Player (square)
  ctx.fillStyle = '#EC6F00';
  const pW = 26, pH = 26;
  ctx.beginPath();
  ctx.roundRect(40, GROUND_Y - pH, pW, pH, 4);
  ctx.fill();
  // Message
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.font = '13px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Click Start or press Space to begin!', W / 2, H / 2);
  ctx.textAlign = 'left';
}

function startRunner() {
  if (runnerState.running) return;
  runnerState.running = true;

  runnerPlayer = { x: 40, y: GROUND_Y - 26, w: 26, h: 26, vy: 0, onGround: true };
  runnerObstacles = [];
  runnerScore = 0;
  runnerDigitIndex = 1; // Skip leading 3
  let frameCount = 0;
  let speed = 3;

  const canvas = document.getElementById('runner-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;

  function frame() {
    if (!runnerState.running) return;
    ctx.fillStyle = '#0D0F29';
    ctx.fillRect(0, 0, W, H);

    // Ground
    ctx.fillStyle = 'rgba(236,111,0,0.35)';
    ctx.fillRect(0, GROUND_Y, W, 2);

    // Player physics
    if (!runnerPlayer.onGround) {
      runnerPlayer.vy += GRAVITY;
      runnerPlayer.y += runnerPlayer.vy;
      if (runnerPlayer.y >= GROUND_Y - runnerPlayer.h) {
        runnerPlayer.y = GROUND_Y - runnerPlayer.h;
        runnerPlayer.vy = 0;
        runnerPlayer.onGround = true;
      }
    }

    // Draw player
    ctx.fillStyle = '#EC6F00';
    ctx.beginPath();
    ctx.roundRect(runnerPlayer.x, runnerPlayer.y, runnerPlayer.w, runnerPlayer.h, 4);
    ctx.fill();

    // Spawn obstacles using π digits
    frameCount++;
    if (frameCount % Math.max(40, 90 - Math.floor(runnerScore / 5)) === 0) {
      const d = parseInt(PI_DIGITS[runnerDigitIndex % PI_DIGITS.length]);
      runnerDigitIndex++;
      const h = (d + 1) * 6;
      runnerObstacles.push({ x: W, y: GROUND_Y - h, w: 18, h, digit: d });
    }

    // Move & draw obstacles
    for (let i = runnerObstacles.length - 1; i >= 0; i--) {
      const obs = runnerObstacles[i];
      obs.x -= speed;

      // Collision
      if (
        runnerPlayer.x < obs.x + obs.w &&
        runnerPlayer.x + runnerPlayer.w > obs.x &&
        runnerPlayer.y < obs.y + obs.h &&
        runnerPlayer.y + runnerPlayer.h > obs.y
      ) {
        gameOver(ctx, W, H);
        return;
      }

      if (obs.x + obs.w < 0) { runnerObstacles.splice(i, 1); runnerScore++; speed = 3 + runnerScore * 0.04; }
      else {
        const hue = obs.digit * 36;
        ctx.fillStyle = `hsl(${hue},80%,45%)`;
        ctx.beginPath();
        ctx.roundRect(obs.x, obs.y, obs.w, obs.h, 3);
        ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.font = '10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(obs.digit, obs.x + obs.w / 2, obs.y - 3);
        ctx.textAlign = 'left';
      }
    }

    // Score
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '12px Inter';
    ctx.fillText(`Score: ${runnerScore}`, W - 80, 20);
    const scoreDisplay = document.getElementById('runner-score-display');
    if (scoreDisplay) scoreDisplay.textContent = runnerScore;

    runnerAnimReq = requestAnimationFrame(frame);
  }

  runnerAnimReq = requestAnimationFrame(frame);
}

function runnerJump() {
  if (!runnerState.running) return;
  if (runnerPlayer && runnerPlayer.onGround) {
    runnerPlayer.vy = JUMP_V;
    runnerPlayer.onGround = false;
  }
}

function gameOver(ctx, W, H) {
  runnerState.running = false;
  cancelAnimationFrame(runnerAnimReq);
  ctx.fillStyle = 'rgba(236,111,0,0.15)';
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 22px Inter';
  ctx.textAlign = 'center';
  ctx.fillText('Game Over!', W / 2, H / 2 - 10);
  ctx.font = '14px Inter';
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.fillText(`Score: ${runnerScore} — Click Start to play again`, W / 2, H / 2 + 16);
  ctx.textAlign = 'left';
  document.getElementById('runner-score-display').textContent = runnerScore;
}

function stopRunner() {
  if (!runnerState.running) return;
  runnerState.running = false;
  cancelAnimationFrame(runnerAnimReq);
  const canvas = document.getElementById('runner-canvas');
  if (canvas) drawRunnerIdle(canvas);
}

function cleanupGames() {
  stopRunner();
  document.onkeydown = null;
}

