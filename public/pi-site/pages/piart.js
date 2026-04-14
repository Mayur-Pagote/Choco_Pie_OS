/* ============================================================
   PAGES/PIART.JS — Pi Art Generative Canvas
   ============================================================ */

const COLOR_MODES = {
  'Spectral Wave': (d) => `hsl(${d * 36}, 80%, 50%)`,
  'Warm Ember':    (d) => `hsl(${d * 18 + 10}, 90%, ${40 + d * 4}%)`,
  'Ocean Depths':  (d) => `hsl(${200 + d * 10}, 70%, ${30 + d * 5}%)`,
  'Neon Pulse':    (d) => `hsl(${d * 30 + 270}, 100%, 60%)`,
  'Forest Moss':   (d) => `hsl(${80 + d * 15}, 60%, ${30 + d * 5}%)`,
  'Desert Dusk':   (d) => `hsl(${d * 12 + 20}, 85%, 55%)`,
  'Aurora':        (d) => `hsl(${120 + d * 24}, 90%, 50%)`,
};

let piArtInitialized = false;
let piArtResizeFrame = null;

function renderPiArt() {
  const section = document.getElementById('page-piart');
  section.innerHTML = `
  <div class="content-wrap">

    <div class="page-header">
      <span class="pill pill-orange">Creative</span>
      <h1 class="page-title">Infinite Pi Art</h1>
      <p class="page-subtitle">Generative visualizations born from the infinite digits of π — each digit maps to color, direction, and shape.</p>
      <div class="divider-line"><span></span><span></span></div>
    </div>

    <div class="two-col" style="align-items:start;margin-bottom:24px;grid-template-columns:1.1fr 0.9fr;">

      <!-- Canvas -->
      <div>
        <div class="art-canvas-wrap" id="art-canvas-wrap">
          <canvas id="pi-art-canvas"></canvas>
        </div>
        <p style="font-size:12px;color:var(--text-mid);margin-top:8px;text-align:center;">
          Click <strong>Generate</strong> to create a new artwork. Each is unique yet seeded by π.
        </p>
      </div>

      <!-- Control Panel -->
      <div class="control-panel-card">
        <div class="control-panel-title">
          <i class="fa-solid fa-sliders"></i> Control Panel
        </div>

        <div class="control-group">
          <label class="control-label" for="color-mode-select">Color Mode</label>
          <select class="select-field" id="color-mode-select">
            ${Object.keys(COLOR_MODES).map((m, i) => `<option value="${m}" ${i===0?'selected':''}>${m}</option>`).join('')}
          </select>
        </div>

        <div class="control-group">
          <label class="control-label" for="complexity-slider">
            Complexity: <strong id="complexity-val">7</strong>
          </label>
          <input type="range" id="complexity-slider" min="1" max="10" value="7" />
          <div class="range-markers"><span>1</span><span>5</span><span>10</span></div>
        </div>

        <div class="control-group">
          <label class="control-label" for="art-style-select">Art Style</label>
          <select class="select-field" id="art-style-select">
            <option value="grid">Grid Blocks</option>
            <option value="spiral">Spiral Walk</option>
            <option value="bars">Digit Bars</option>
            <option value="dots">Scatter Dots</option>
          </select>
        </div>

        <button class="btn btn-primary btn-full" id="generate-art-btn" style="margin-bottom:10px;">
          <i class="fa-solid fa-wand-magic-sparkles"></i> Generate
        </button>
        <button class="btn btn-secondary btn-full" id="save-art-btn">
          <i class="fa-solid fa-download"></i> Save PNG
        </button>

        <p class="art-note" style="margin-top:14px;">Generative art based on π digits — each digit (0–9) maps to a color, direction, or shape parameter.</p>
      </div>
    </div>

  </div>
  ${getFooterHTML()}`;
}

function initPiArt() {
  if (piArtInitialized) return;
  piArtInitialized = true;

  document.getElementById('complexity-slider')?.addEventListener('input', function() {
    document.getElementById('complexity-val').textContent = this.value;
  });
  document.getElementById('generate-art-btn')?.addEventListener('click', generatePiArt);
  document.getElementById('save-art-btn')?.addEventListener('click', savePiArt);
  window.addEventListener('resize', () => {
    if (activePage !== 'piart') return;
    if (piArtResizeFrame) cancelAnimationFrame(piArtResizeFrame);
    piArtResizeFrame = requestAnimationFrame(() => {
      piArtResizeFrame = null;
      generatePiArt();
    });
  }, { passive: true });

  requestAnimationFrame(() => {
    generatePiArt();
  });
}

function generatePiArt() {
  const canvas = document.getElementById('pi-art-canvas');
  if (!canvas) return;
  const wrap = document.getElementById('art-canvas-wrap');
  const size = wrap ? wrap.clientWidth : 460;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  const colorModeName = document.getElementById('color-mode-select')?.value || 'Spectral Wave';
  const colorFn = COLOR_MODES[colorModeName] || COLOR_MODES['Spectral Wave'];
  const complexity = parseInt(document.getElementById('complexity-slider')?.value || 7);
  const style = document.getElementById('art-style-select')?.value || 'grid';

  ctx.clearRect(0, 0, size, size);
  ctx.fillStyle = '#070B24';
  ctx.fillRect(0, 0, size, size);

  const digits = PI_DIGITS.slice(1); // skip the leading 3

  if (style === 'grid') {
    drawGrid(ctx, digits, size, colorFn, complexity);
  } else if (style === 'spiral') {
    drawSpiral(ctx, digits, size, colorFn, complexity);
  } else if (style === 'bars') {
    drawBars(ctx, digits, size, colorFn, complexity);
  } else {
    drawDots(ctx, digits, size, colorFn, complexity);
  }
}

function drawGrid(ctx, digits, size, colorFn, complexity) {
  const cols = complexity * 4 + 6;
  const cellSize = size / cols;
  for (let i = 0; i < digits.length && i < cols * cols; i++) {
    const d = parseInt(digits[i]);
    const col = i % cols;
    const row = Math.floor(i / cols);
    ctx.fillStyle = colorFn(d);
    ctx.beginPath();
    const gap = cellSize * 0.08;
    ctx.roundRect(col * cellSize + gap, row * cellSize + gap, cellSize - gap * 2, cellSize - gap * 2, 2);
    ctx.fill();
  }
}

function drawSpiral(ctx, digits, size, colorFn, complexity) {
  const cx = size / 2, cy = size / 2;
  let angle = 0;
  let radius = 4;
  const step = complexity * 0.5 + 1;
  ctx.lineWidth = Math.max(1, 12 / complexity);
  for (let i = 0; i < Math.min(digits.length, 800); i++) {
    const d = parseInt(digits[i]);
    angle += (d + 1) * 0.08;
    radius += step * 0.4;
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius;
    ctx.beginPath();
    const r = Math.max(1, (10 - complexity) * 0.8 + 2);
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = colorFn(d);
    ctx.fill();
    if (radius > size * 0.48) break;
  }
}

function drawBars(ctx, digits, size, colorFn, complexity) {
  const count = Math.min(digits.length, 60 + complexity * 10);
  const barW = size / count;
  for (let i = 0; i < count; i++) {
    const d = parseInt(digits[i]);
    const h = (d + 1) / 10 * size * (0.5 + complexity * 0.05);
    ctx.fillStyle = colorFn(d);
    ctx.fillRect(i * barW, size - h, barW - 1, h);
    const d2 = parseInt(digits[i + count] || '5');
    ctx.fillStyle = colorFn(d2);
    ctx.globalAlpha = 0.4;
    ctx.fillRect(i * barW, 0, barW - 1, (d2 + 1) / 10 * size * 0.4);
    ctx.globalAlpha = 1;
  }
}

function drawDots(ctx, digits, size, colorFn, complexity) {
  // Use pairs of digits as (x, y) coordinates
  const count = Math.min(Math.floor(digits.length / 2), 1000);
  for (let i = 0; i < count; i++) {
    const d1 = parseInt(digits[i * 2]) / 9;
    const d2 = parseInt(digits[i * 2 + 1]) / 9;
    const dx = parseInt(digits[i]) % 10;
    const x = d1 * size;
    const y = d2 * size;
    const r = Math.max(1, complexity * 0.6);
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = colorFn(dx);
    ctx.globalAlpha = 0.75;
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

function savePiArt() {
  const canvas = document.getElementById('pi-art-canvas');
  if (!canvas) return;
  const link = document.createElement('a');
  link.download = 'pi-art.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}

