// ============================================================
//  game.js — Pi Piano Tiles Core Engine
// ============================================================

'use strict';

// ── Constants ──────────────────────────────────────────────
const COLS = 4;
const BASE_SPEED = 2.2;          // px per frame at speed=1
const TILE_HEIGHT = 130;
const TILE_GAP = 18;
const HIT_ZONE_H = 96;
const HIT_WINDOW = 80;           // extra px buffer above hit zone for valid hit
const SPAWN_LEAD = 40;           // px above viewport to spawn tiles
const MAX_MISSED = 1;            // tiles past bottom before game over

// Digit → colour class
const DIGIT_COLOURS = [
  '#1e40af','#1d4ed8','#0f766e','#15803d','#92400e',
  '#b91c1c','#7e22ce','#4338ca','#0369a1','#065f46'
];

// ── State ──────────────────────────────────────────────────
let tiles        = [];
let piIndex      = 0;
let score        = 0;
let bestScore    = parseInt(localStorage.getItem('piTilesBest') || '0');
let combo        = 0;
let maxCombo     = 0;
let speed        = 1.0;
let gameRunning  = false;
let gamePaused   = false;
let animId       = null;
let lastTime     = 0;
let boardH       = 0;
let boardW       = 0;
let colW         = 0;
let tileIdCounter = 0;
let particles    = [];
let piRainDrops  = [];
let muted        = false;
let comboTimeout = null;

// ── DOM References ─────────────────────────────────────────
const boardEl          = document.getElementById('board');
const particleCanvas   = document.getElementById('particle-canvas');
const piRainCanvas     = document.getElementById('pi-rain-canvas');
const scoreEl          = document.getElementById('val-score');
const bestEl           = document.getElementById('val-best');
const comboEl          = document.getElementById('val-combo');
const piIndexEl        = document.getElementById('val-pi-index');
const comboDisplay     = document.getElementById('combo-display');
const noteBadge        = document.getElementById('note-badge');
const speedSlider      = document.getElementById('speed-slider');
const speedVal         = document.getElementById('speed-val');
const volumeSlider     = document.getElementById('volume-slider');
const seqContainer     = document.getElementById('pi-sequence');

const pCtx  = particleCanvas.getContext('2d');
const rCtx  = piRainCanvas.getContext('2d');

// Overlays
const startOverlay  = document.getElementById('overlay-start');
const pauseOverlay  = document.getElementById('overlay-pause');
const gameOverlay   = document.getElementById('overlay-gameover');
const goScore       = document.getElementById('go-score');
const goBest        = document.getElementById('go-best');
const goCombo       = document.getElementById('go-combo');
const goDigits      = document.getElementById('go-digits');

// ── Resize Handler ─────────────────────────────────────────
function resize() {
  boardH = boardEl.clientHeight;
  boardW = boardEl.clientWidth;
  colW  = boardW / COLS;

  particleCanvas.width  = boardW;
  particleCanvas.height = boardH;
  piRainCanvas.width    = window.innerWidth;
  piRainCanvas.height   = window.innerHeight;

  initPiRain();
  renderSequenceBar();
}

window.addEventListener('resize', resize);

// ── Pi Digit Sequence Bar ──────────────────────────────────
function renderSequenceBar() {
  seqContainer.innerHTML = '';
  const visible = 12;
  const start   = Math.max(0, piIndex - 2);
  const end     = Math.min(PI_DIGITS.length - 1, start + visible);

  for (let i = start; i <= end; i++) {
    const chip = document.createElement('div');
    chip.className = 'pi-digit-chip';
    if (i < piIndex)   chip.classList.add('played');
    if (i === piIndex) chip.classList.add('active');
    chip.textContent = PI_DIGITS[i];
    seqContainer.appendChild(chip);
  }
}

// ── Pi Rain Background ─────────────────────────────────────
function initPiRain() {
  piRainDrops = [];
  const cols = Math.floor(piRainCanvas.width / 22);
  for (let i = 0; i < cols; i++) {
    piRainDrops.push({
      x: i * 22 + 11,
      y: Math.random() * piRainCanvas.height,
      speed: 0.4 + Math.random() * 0.7,
      opacity: 0.3 + Math.random() * 0.7,
      dIdx: Math.floor(Math.random() * PI_DIGITS.length)
    });
  }
}

function drawPiRain() {
  rCtx.clearRect(0, 0, piRainCanvas.width, piRainCanvas.height);
  rCtx.font = '14px Orbitron, monospace';
  piRainDrops.forEach(d => {
    rCtx.globalAlpha = d.opacity * 0.5;
    rCtx.fillStyle = '#22d3ee';
    rCtx.fillText(PI_DIGITS[d.dIdx % PI_DIGITS.length], d.x, d.y);
    d.y += d.speed;
    d.dIdx++;
    if (d.y > piRainCanvas.height + 20) {
      d.y = -20;
    }
  });
  rCtx.globalAlpha = 1;
}

// ── Tile Spawning ──────────────────────────────────────────
function spawnTile() {
  if (piIndex >= PI_DIGITS.length) return;
  const digit  = PI_DIGITS[piIndex];
  const col    = digit % COLS;
  const noteNm = NOTE_NAMES[digit];

  const tile = {
    id:     tileIdCounter++,
    digit,
    col,
    noteNm,
    y:      -SPAWN_LEAD,
    h:      TILE_HEIGHT,
    el:     null,
    hit:    false,
    missed: false,
    piIdx:  piIndex
  };

  // DOM element
  const el = document.createElement('div');
  el.className    = `tile d${digit}`;
  el.style.height = tile.h + 'px';
  el.style.width  = `${colW - 4}px`;
  el.style.left   = `${col * colW + 2}px`;
  el.style.top    = `${tile.y}px`;

  el.innerHTML = `
    <span class="tile-digit">${digit}</span>
    <span class="tile-note">${noteNm}</span>
  `;

  el.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    hitTile(tile);
  });

  boardEl.appendChild(el);
  tile.el = el;
  tiles.push(tile);
  piIndex++;
}

// ── Hit Detection ──────────────────────────────────────────
function hitTile(tile) {
  if (tile.hit || tile.missed) return;

  const tileBottom = tile.y + tile.h;
  const hitTop     = boardH - HIT_ZONE_H - HIT_WINDOW;
  const hitBottom  = boardH - HIT_ZONE_H + tile.h;

  if (tileBottom < hitTop) return; // too early

  tile.hit = true;
  tile.el.classList.add('hit');

  // Sound
  audioEngine.playNote(tile.digit);

  // Flash column
  flashColumn(tile.col, 'hit-flash');

  // Score
  score++;
  combo++;
  if (combo > maxCombo) maxCombo = combo;

  updateHUD();
  spawnParticles(tile.col * colW + colW / 2, boardH - HIT_ZONE_H / 2, tile.digit);
  showNoteBadge(tile.noteNm);

  // Combo display
  if (combo > 0 && combo % 5 === 0) {
    showCombo(combo);
    audioEngine.playCombo(Math.min(combo / 5, 8));
  }

  // Remove tile after flash
  setTimeout(() => {
    if (tile.el && tile.el.parentNode) tile.el.remove();
    tiles = tiles.filter(t => t.id !== tile.id);
  }, 120);
}

function hitColumn(col) {
  // Find topmost un-hit tile in this column that's in/near the hit zone
  const candidateTiles = tiles.filter(t =>
    !t.hit && !t.missed && t.col === col
  );
  if (!candidateTiles.length) {
    // Pressed wrong column — penalty flash but no miss
    flashColumn(col, 'pressed');
    return;
  }

  // Sort by y descending (closest to bottom first)
  candidateTiles.sort((a, b) => b.y - a.y);
  hitTile(candidateTiles[0]);
}

// ── Miss Handling ──────────────────────────────────────────
function missTile(tile) {
  if (tile.hit || tile.missed) return;
  tile.missed = true;
  tile.el.classList.add('miss');
  audioEngine.playMiss();
  combo = 0;
  updateHUD();

  setTimeout(() => {
    endGame();
  }, 300);
}

// ── Column Flash ──────────────────────────────────────────
function flashColumn(col, cls) {
  const colEl = document.querySelectorAll('.column')[col];
  if (!colEl) return;
  colEl.classList.add(cls);
  setTimeout(() => colEl.classList.remove(cls), 150);
}

// ── HUD Updates ───────────────────────────────────────────
function updateHUD() {
  scoreEl.textContent   = score;
  comboEl.textContent   = combo;
  piIndexEl.textContent = piIndex;
  if (score > bestScore) {
    bestScore = score;
    localStorage.setItem('piTilesBest', bestScore);
    bestEl.textContent = bestScore;
    bestEl.classList.add('flash-gold');
    setTimeout(() => bestEl.classList.remove('flash-gold'), 500);
  }
  renderSequenceBar();
}

// ── Note Badge ────────────────────────────────────────────
let noteBadgeTimeout = null;
function showNoteBadge(name) {
  noteBadge.textContent = name;
  noteBadge.classList.add('show');
  clearTimeout(noteBadgeTimeout);
  noteBadgeTimeout = setTimeout(() => noteBadge.classList.remove('show'), 600);
}

// ── Combo Popup ───────────────────────────────────────────
function showCombo(n) {
  comboDisplay.textContent = `${n}× COMBO!`;
  comboDisplay.classList.remove('show');
  void comboDisplay.offsetWidth;
  comboDisplay.classList.add('show');
  clearTimeout(comboTimeout);
  comboTimeout = setTimeout(() => comboDisplay.classList.remove('show'), 900);
}

// ── Particles ─────────────────────────────────────────────
function spawnParticles(x, y, digit) {
  const color = DIGIT_COLOURS[digit] || '#22d3ee';
  for (let i = 0; i < 18; i++) {
    const angle = (Math.random() * Math.PI * 2);
    const speed = 2 + Math.random() * 5;
    particles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 1.5,
      life: 1,
      decay: 0.03 + Math.random() * 0.04,
      r: 3 + Math.random() * 5,
      color
    });
  }
}

function drawParticles() {
  pCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
  particles = particles.filter(p => p.life > 0);
  particles.forEach(p => {
    pCtx.globalAlpha = p.life;
    pCtx.fillStyle   = p.color;
    pCtx.shadowBlur  = 10;
    pCtx.shadowColor = '#22d3ee';
    pCtx.beginPath();
    pCtx.arc(p.x, p.y, p.r * p.life, 0, Math.PI * 2);
    pCtx.fill();
    p.x   += p.vx;
    p.y   += p.vy;
    p.vy  += 0.15;
    p.life -= p.decay;
  });
  pCtx.globalAlpha = 1;
  pCtx.shadowBlur  = 0;
}

// ── Game Loop ─────────────────────────────────────────────
let frameCount = 0;
const SPAWN_EVERY = 55; // frames between tile spawns (decreases with speed)

function gameLoop(ts) {
  if (!gameRunning || gamePaused) return;

  // Pi rain
  drawPiRain();

  // Particles
  drawParticles();

  // Speed from slider
  const spd = BASE_SPEED * speed;

  // Move tiles
  tiles.forEach(tile => {
    if (tile.hit || tile.missed) return;
    tile.y += spd;
    tile.el.style.top = tile.y + 'px';

    // Check miss: tile bottom passed hit zone bottom completely
    if (tile.y > boardH + 10) {
      missTile(tile);
    }
  });

  // Spawn logic — adaptive gap based on speed
  const spawnInterval = Math.max(20, Math.round(SPAWN_EVERY / speed));
  frameCount++;
  if (frameCount % spawnInterval === 0) {
    // Only spawn if no tile in that col is still < 50% through screen
    const nextDigit = PI_DIGITS[piIndex];
    const nextCol   = nextDigit % COLS;
    const colTiles  = tiles.filter(t => !t.hit && !t.missed && t.col === nextCol);
    const tooClose  = colTiles.some(t => t.y < boardH * 0.6);
    if (!tooClose) {
      spawnTile();
    }
  }

  animId = requestAnimationFrame(gameLoop);
}

// ── Game Lifecycle ─────────────────────────────────────────
function startGame() {
  tiles        = [];
  piIndex      = 0;
  score        = 0;
  combo        = 0;
  maxCombo     = 0;
  frameCount   = 0;
  particles    = [];
  tileIdCounter = 0;

  // Clear existing tiles
  document.querySelectorAll('.tile').forEach(el => el.remove());

  // Init audio
  audioEngine.init();

  updateHUD();
  bestEl.textContent = bestScore;
  renderSequenceBar();

  hideOverlays();
  gameRunning = true;
  gamePaused  = false;

  // Pre-spawn first tile
  spawnTile();

  animId = requestAnimationFrame(gameLoop);
}

function pauseGame() {
  if (!gameRunning) return;
  gamePaused = true;
  cancelAnimationFrame(animId);
  pauseOverlay.style.display = 'flex';
}

function resumeGame() {
  if (!gameRunning || !gamePaused) return;
  gamePaused = false;
  pauseOverlay.style.display = 'none';
  animId = requestAnimationFrame(gameLoop);
}

function endGame() {
  gameRunning = false;
  cancelAnimationFrame(animId);
  drawPiRain();

  goScore.textContent  = score;
  goBest.textContent   = bestScore;
  goCombo.textContent  = maxCombo;
  goDigits.textContent = piIndex;

  // Digit reached
  document.getElementById('go-pi-reached').textContent =
    `You reached π digit #${piIndex}: ${PI_DIGITS[piIndex - 1] ?? '—'}`;

  gameOverlay.style.display = 'flex';
}

function hideOverlays() {
  startOverlay.style.display  = 'none';
  pauseOverlay.style.display  = 'none';
  gameOverlay.style.display   = 'none';
}

// ── Keyboard Controls ──────────────────────────────────────
const KEY_MAP = { 'd': 0, 'f': 1, 'j': 2, 'k': 3 };

document.addEventListener('keydown', e => {
  const key = e.key.toLowerCase();

  if (key === 'escape' || key === 'p') {
    if (gameRunning && !gamePaused) pauseGame();
    else if (gamePaused) resumeGame();
    return;
  }

  if (!gameRunning || gamePaused) return;

  const col = KEY_MAP[key];
  if (col !== undefined) {
    hitColumn(col);
    flashColumn(col, 'pressed');
  }
});

// ── Column Click/Touch ─────────────────────────────────────
document.querySelectorAll('.column').forEach((colEl, i) => {
  colEl.addEventListener('pointerdown', e => {
    e.preventDefault();
    if (!gameRunning || gamePaused) return;
    hitColumn(i);
  });
});

// ── Speed Slider ───────────────────────────────────────────
speedSlider.addEventListener('input', () => {
  speed = parseFloat(speedSlider.value);
  speedVal.textContent = speed.toFixed(1) + '×';
});

// ── Volume Slider ──────────────────────────────────────────
volumeSlider.addEventListener('input', () => {
  const v = parseFloat(volumeSlider.value);
  audioEngine.init();
  audioEngine.setVolume(v);
  document.getElementById('vol-icon').textContent = v === 0 ? '🔇' : v < 0.4 ? '🔉' : '🔊';
});

// ── Mute Button ────────────────────────────────────────────
document.getElementById('btn-mute').addEventListener('click', () => {
  muted = !muted;
  audioEngine.init();
  audioEngine.setVolume(muted ? 0 : parseFloat(volumeSlider.value));
  document.getElementById('btn-mute').textContent = muted ? '🔇' : '🔊';
});

// ── Pause Button ───────────────────────────────────────────
document.getElementById('btn-pause').addEventListener('click', () => {
  if (!gameRunning) return;
  if (gamePaused) resumeGame(); else pauseGame();
});

// ── Restart Button ─────────────────────────────────────────
document.getElementById('btn-restart').addEventListener('click', () => {
  startGame();
});

// ── Start / Resume from overlays ───────────────────────────
document.getElementById('btn-start').addEventListener('click', startGame);
document.getElementById('btn-resume').addEventListener('click', resumeGame);
document.getElementById('btn-replay').addEventListener('click', startGame);
document.getElementById('btn-menu').addEventListener('click', () => {
  gameRunning = false;
  cancelAnimationFrame(animId);
  document.querySelectorAll('.tile').forEach(el => el.remove());
  tiles = [];
  hideOverlays();
  startOverlay.style.display = 'flex';
});

// ── Background Pi Rain (idle) ──────────────────────────────
function idleRainLoop() {
  drawPiRain();
  if (!gameRunning) requestAnimationFrame(idleRainLoop);
}

// ── Init ───────────────────────────────────────────────────
window.addEventListener('load', () => {
  resize();
  bestEl.textContent = bestScore;
  startOverlay.style.display = 'flex';
  idleRainLoop();
});
