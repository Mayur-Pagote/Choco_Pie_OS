/* ============================================================
   PAGES/SIMULATION.JS - Monte Carlo Pi Simulator
   ============================================================ */

let simInitialized = false;
let simRunning = false;
let simInterval = null;
let simCanvas = null;
let simCtx = null;
let simCanvasSize = 400;
let totalPoints = 0;
let insidePoints = 0;
let batchSize = 1000;
let convergenceData = [];
let convergenceRedrawCounter = 0;
let convergenceCanvasSize = { width: 0, height: 0 };

function renderSimulation() {
  const section = document.getElementById('page-simulation');
  section.innerHTML = `
  <div class="content-wrap">

    <div class="page-header">
      <span class="pill pill-orange">Simulation</span>
      <h1 class="page-title">Monte Carlo Pi Simulator</h1>
      <p class="page-subtitle">Estimate Pi by randomly placing points in a unit square and checking how many fall inside the quarter circle.</p>
      <div class="divider-line"><span></span><span></span></div>
    </div>

    <div class="two-col" style="align-items:start;grid-template-columns:1.1fr 0.9fr;margin-bottom:24px;">

      <div>
        <div class="simulation-canvas-wrap" id="sim-canvas-wrap">
          <canvas id="simulation-canvas"></canvas>
        </div>
      </div>

      <div>
        <div class="card" style="padding:22px;">
          <div class="section-heading" style="margin-bottom:16px;"><i class="fa-solid fa-sliders" style="color:var(--orange);margin-right:8px;"></i>Controls</div>

          <div style="display:flex;gap:12px;margin-bottom:18px;">
            <button class="btn btn-primary" id="sim-start-btn" style="flex:1;">
              <i class="fa-solid fa-play"></i> Start
            </button>
            <button class="btn btn-secondary" id="sim-reset-btn" style="flex:1;">
              <i class="fa-solid fa-rotate"></i> Reset
            </button>
          </div>

          <div class="control-group">
            <label class="control-label">
              Points per batch: <strong style="color:var(--orange);" id="batch-label">1,000</strong>
            </label>
            <input type="range" id="batch-slider" min="100" max="10000" value="1000" step="100" />
            <div class="range-markers"><span>100</span><span>5,000</span><span>10,000</span></div>
          </div>

          <div class="sim-readouts">
            <div class="readout-box readout-light">
              <div class="readout-value" id="total-points-display">0</div>
              <div class="readout-label">Total Points</div>
            </div>
            <div class="readout-box readout-dark">
              <div class="readout-value" id="est-pi-display">-</div>
              <div class="readout-label" style="color:rgba(255,255,255,0.4);">Est. Pi</div>
            </div>
          </div>

          <div class="how-it-works">
            <h4>How it works</h4>
            <p>Random points are placed in a unit square. The ratio of points inside the quarter circle (x^2+y^2<=1) to total points, multiplied by 4, estimates Pi.</p>
            <div class="formula-box">Pi ~= 4 x (inside / total)</div>
          </div>
        </div>
      </div>
    </div>

    <div class="convergence-panel">
      <div class="convergence-title"><i class="fa-solid fa-chart-line" style="color:var(--orange);margin-right:8px;"></i>Pi Estimate Convergence</div>
      <div id="convergence-empty" class="convergence-empty">Start the simulation to see convergence</div>
      <canvas id="convergence-canvas" style="display:none;"></canvas>
    </div>

  </div>
  ${getFooterHTML()}`;
}

function initSimulation() {
  if (simInitialized) return;

  simCanvas = document.getElementById('simulation-canvas');
  if (!simCanvas) return;

  simInitialized = true;
  simCtx = simCanvas.getContext('2d');

  document.getElementById('sim-start-btn')?.addEventListener('click', toggleSimulation);
  document.getElementById('sim-reset-btn')?.addEventListener('click', resetSimulation);
  document.getElementById('batch-slider')?.addEventListener('input', function () {
    batchSize = parseInt(this.value, 10);
    document.getElementById('batch-label').textContent = batchSize.toLocaleString();
  });

  window.addEventListener('resize', handleSimulationResize, { passive: true });
  handleSimulationResize();
}

function handleSimulationResize() {
  const wrap = document.getElementById('sim-canvas-wrap');
  if (!wrap || !simCanvas || !simCtx) return;

  const nextSize = Math.max(260, Math.min(wrap.clientWidth, 460));
  if (nextSize === simCanvasSize && simCanvas.width === nextSize && simCanvas.height === nextSize) return;

  simCanvasSize = nextSize;
  simCanvas.width = simCanvasSize;
  simCanvas.height = simCanvasSize;
  drawSimBase();
}

function drawSimBase() {
  if (!simCtx) return;

  const size = simCanvasSize;
  simCtx.clearRect(0, 0, size, size);
  simCtx.fillStyle = '#070B24';
  simCtx.fillRect(0, 0, size, size);

  simCtx.beginPath();
  simCtx.arc(0, size, size, -Math.PI / 2, 0);
  simCtx.strokeStyle = '#EC6F00';
  simCtx.lineWidth = 2;
  simCtx.setLineDash([8, 5]);
  simCtx.stroke();
  simCtx.setLineDash([]);
}

function toggleSimulation() {
  if (simRunning) stopSimulation();
  else startSimulation();
}

function startSimulation() {
  if (simRunning) return;

  simRunning = true;
  const startButton = document.getElementById('sim-start-btn');
  if (startButton) startButton.innerHTML = '<i class="fa-solid fa-pause"></i> Pause';

  simInterval = window.setInterval(runBatch, 80);
}

function stopSimulation() {
  if (simInterval) {
    clearInterval(simInterval);
    simInterval = null;
  }

  simRunning = false;
  const startButton = document.getElementById('sim-start-btn');
  if (startButton) startButton.innerHTML = '<i class="fa-solid fa-play"></i> Start';
}

function resetSimulation() {
  stopSimulation();

  totalPoints = 0;
  insidePoints = 0;
  convergenceData = [];
  convergenceRedrawCounter = 0;

  const totalEl = document.getElementById('total-points-display');
  const piEl = document.getElementById('est-pi-display');
  const emptyEl = document.getElementById('convergence-empty');
  const chartEl = document.getElementById('convergence-canvas');

  if (totalEl) totalEl.textContent = '0';
  if (piEl) piEl.textContent = '-';
  if (emptyEl) emptyEl.style.display = '';
  if (chartEl) chartEl.style.display = 'none';

  drawSimBase();
}

function runBatch() {
  if (!simCtx) return;

  const size = simCanvasSize;
  const pointSize = size >= 420 ? 1.4 : 1.2;
  const insidePath = new Path2D();
  const outsidePath = new Path2D();

  for (let index = 0; index < batchSize; index += 1) {
    const x = Math.random();
    const y = Math.random();
    const inside = x * x + y * y <= 1;

    if (inside) insidePoints += 1;
    totalPoints += 1;

    const px = x * size;
    const py = (1 - y) * size;
    const targetPath = inside ? insidePath : outsidePath;
    targetPath.rect(px, py, pointSize, pointSize);
  }

  simCtx.fillStyle = 'rgba(100,130,220,0.34)';
  simCtx.fill(outsidePath);
  simCtx.fillStyle = 'rgba(236,111,0,0.62)';
  simCtx.fill(insidePath);

  const estPi = (4 * insidePoints / totalPoints).toFixed(6);
  const totalEl = document.getElementById('total-points-display');
  const piEl = document.getElementById('est-pi-display');
  if (totalEl) totalEl.textContent = totalPoints.toLocaleString();
  if (piEl) piEl.textContent = estPi;

  convergenceData.push(Number(estPi));
  if (convergenceData.length > 180) convergenceData.shift();

  convergenceRedrawCounter += 1;
  if (convergenceRedrawCounter % 3 === 0) {
    drawConvergence();
  }

  if (totalPoints >= 2000000) {
    stopSimulation();
    drawConvergence();
  }
}

function drawConvergence() {
  const canvas = document.getElementById('convergence-canvas');
  const empty = document.getElementById('convergence-empty');
  if (!canvas) return;

  canvas.style.display = 'block';
  if (empty) empty.style.display = 'none';

  const width = Math.max(280, (canvas.parentElement?.clientWidth || 640) - 40);
  const height = 120;
  if (convergenceCanvasSize.width !== width || convergenceCanvasSize.height !== height) {
    canvas.width = width;
    canvas.height = height;
    convergenceCanvasSize = { width, height };
  }

  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#F5F7FA';
  ctx.fillRect(0, 0, width, height);

  const valueToY = (value) => height - ((value - 2.5) / (4 - 2.5)) * height;
  const piY = valueToY(Math.PI);

  ctx.strokeStyle = 'rgba(236,111,0,0.3)';
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(0, piY);
  ctx.lineTo(width, piY);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = 'rgba(236,111,0,0.55)';
  ctx.font = '10px Inter';
  ctx.fillText('Pi = 3.14159...', Math.max(8, width - 90), Math.max(12, piY - 4));

  if (convergenceData.length < 2) return;

  ctx.strokeStyle = '#EC6F00';
  ctx.lineWidth = 2;
  ctx.beginPath();
  convergenceData.forEach((value, index) => {
    const x = (index / (convergenceData.length - 1)) * width;
    const y = valueToY(value);
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();
}
