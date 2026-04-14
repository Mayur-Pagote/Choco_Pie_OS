/* ============================================================
   PAGES/MANDALA.JS - Infinite Zoom Pi Mandala
   ============================================================ */

let mandalaInitialized = false;
let mandalaRunning = false;
let mandalaAnimId = null;
let mandalaCanvas = null;
let mandalaWrap = null;
let mandalaCtx = null;
let mandalaLastFrame = 0;
const MANDALA_MAX_DPR = 1.5;
const MANDALA_FPS = 30;

const mandalaState = {
  zoom: 5,
  rings: 13,
  drift: 4,
  seedOffset: 120,
  motion: true,
  spin: 0
};

function renderMandala() {
  const section = document.getElementById('page-mandala');
  section.innerHTML = `
  <div class="content-wrap">

    <div class="page-header">
      <span class="pill pill-blue">Fractal Art</span>
      <h1 class="page-title">Infinite Zoom Pi Mandala</h1>
      <p class="page-subtitle">Each ring converts the next digits of p into rhythmic petals. Patterns repeat on purpose - then drift just enough to feel alive.</p>
      <div class="divider-line"><span></span><span></span></div>
    </div>

    <div class="mandala-grid">
      <div class="mandala-stage">
        <div class="mandala-canvas-wrap" id="mandala-canvas-wrap">
          <canvas id="mandala-canvas" aria-label="Infinite zoom pi mandala"></canvas>
          <div class="mandala-overlay">
            <div class="mandala-overlay-title">This looks predictable... until you zoom in.</div>
            <div class="mandala-overlay-sub">Use the zoom slider to reveal micro-petals inside each ring.</div>
          </div>
          <div class="mandala-caption">
            <span><i class="fa-solid fa-circle-nodes"></i> Rings map consecutive p digits</span>
            <span><i class="fa-solid fa-layer-group"></i> Detail blooms with depth</span>
          </div>
        </div>
      </div>

      <div class="mandala-side">
        <div class="card mandala-control-card">
          <div class="card-title"><i class="fa-solid fa-sliders"></i> Mandala Controls</div>

          <div class="control-group">
            <label class="control-label" for="mandala-zoom">Zoom Depth: <strong id="mandala-zoom-value">5x</strong></label>
            <input type="range" id="mandala-zoom" min="1" max="10" value="5" />
            <div class="range-markers"><span>1x</span><span>5x</span><span>10x</span></div>
          </div>

          <div class="control-group">
            <label class="control-label" for="mandala-rings">Ring Count: <strong id="mandala-ring-value">13</strong></label>
            <input type="range" id="mandala-rings" min="8" max="20" value="13" />
            <div class="range-markers"><span>8</span><span>14</span><span>20</span></div>
          </div>

          <div class="control-group">
            <label class="control-label" for="mandala-drift">Pattern Drift: <strong id="mandala-drift-value">4</strong></label>
            <input type="range" id="mandala-drift" min="0" max="10" value="4" />
            <div class="range-markers"><span>Still</span><span>Subtle</span><span>Wild</span></div>
          </div>

          <div class="mandala-toggle">
            <input type="checkbox" id="mandala-motion" checked />
            <label for="mandala-motion">Ambient spin</label>
          </div>

          <button class="btn btn-primary btn-full" id="mandala-shift-btn" type="button">
            <i class="fa-solid fa-shuffle"></i> Shift Digits
          </button>

          <div class="mandala-seed">Seed Offset: <strong id="mandala-seed-value">120</strong></div>
        </div>

        <div class="card mandala-quote">
          <div class="mandala-quote-tag">Hook</div>
          <div class="mandala-quote-text">"This looks predictable... until you zoom in."</div>
          <div class="mandala-quote-sub">Symmetry whispers the rules, p breaks them just enough to surprise you.</div>
        </div>
      </div>
    </div>

    <div class="mandala-stats">
      <div class="card mandala-stat">
        <div class="mandala-stat-title"><i class="fa-solid fa-repeat"></i> Repeating Core</div>
        <p>Each ring reuses a 24-digit rhythm so the eye expects the next move.</p>
      </div>
      <div class="card mandala-stat">
        <div class="mandala-stat-title"><i class="fa-solid fa-water"></i> Subtle Drift</div>
        <p>Secondary digits nudge angles + color, creating that almost-symmetry.</p>
      </div>
      <div class="card mandala-stat">
        <div class="mandala-stat-title"><i class="fa-solid fa-microscope"></i> Zoom Reveal</div>
        <p>Higher zoom unlocks micro-petals and beadwork hidden in the rings.</p>
      </div>
    </div>

  </div>
  ${getFooterHTML()}`;
}

function initMandala() {
  if (mandalaInitialized) return;

  mandalaCanvas = document.getElementById('mandala-canvas');
  mandalaWrap = document.getElementById('mandala-canvas-wrap');
  if (!mandalaCanvas || !mandalaWrap || typeof PI_DIGITS !== 'string') return;

  mandalaInitialized = true;
  mandalaCtx = mandalaCanvas.getContext('2d');

  const zoomInput = document.getElementById('mandala-zoom');
  const ringInput = document.getElementById('mandala-rings');
  const driftInput = document.getElementById('mandala-drift');
  const motionToggle = document.getElementById('mandala-motion');
  const shiftBtn = document.getElementById('mandala-shift-btn');

  zoomInput?.addEventListener('input', () => {
    mandalaState.zoom = parseInt(zoomInput.value, 10);
    document.getElementById('mandala-zoom-value').textContent = `${mandalaState.zoom}x`;
    drawMandala();
  });

  ringInput?.addEventListener('input', () => {
    mandalaState.rings = parseInt(ringInput.value, 10);
    document.getElementById('mandala-ring-value').textContent = mandalaState.rings;
    drawMandala();
  });

  driftInput?.addEventListener('input', () => {
    mandalaState.drift = parseInt(driftInput.value, 10);
    document.getElementById('mandala-drift-value').textContent = mandalaState.drift;
    drawMandala();
  });

  motionToggle?.addEventListener('change', () => {
    mandalaState.motion = motionToggle.checked;
    if (!mandalaState.motion) {
      mandalaState.spin = 0;
      stopMandala();
      drawMandala();
      return;
    }

    if (activePage === 'mandala') {
      startMandala();
    }
  });

  shiftBtn?.addEventListener('click', () => {
    mandalaState.seedOffset = (mandalaState.seedOffset + 97) % (PI_DIGITS.length - 50);
    document.getElementById('mandala-seed-value').textContent = mandalaState.seedOffset;
    drawMandala();
  });

  window.addEventListener('resize', () => {
    if (!mandalaRunning) drawMandala();
  }, { passive: true });

  drawMandala();
}

function resizeMandalaCanvas() {
  const rect = mandalaWrap.getBoundingClientRect();
  const width = Math.max(1, rect.width);
  const height = Math.max(1, rect.height);
  const dpr = Math.min(window.devicePixelRatio || 1, MANDALA_MAX_DPR);
  const canvasWidth = Math.floor(width * dpr);
  const canvasHeight = Math.floor(height * dpr);

  if (mandalaCanvas.width !== canvasWidth || mandalaCanvas.height !== canvasHeight) {
    mandalaCanvas.width = canvasWidth;
    mandalaCanvas.height = canvasHeight;
    mandalaCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  return { width, height };
}

function drawMandala() {
  if (!mandalaInitialized) return;

  const { width, height } = resizeMandalaCanvas();
  const ctx = mandalaCtx;
  const cx = width / 2;
  const cy = height / 2;
  const minDim = Math.min(width, height);
  const rings = mandalaState.rings;
  const zoom = mandalaState.zoom;
  const drift = mandalaState.drift / 10;
  const digits = PI_DIGITS.slice(1);
  const basePatternLen = 24;
  const baseDigits = digits.slice(mandalaState.seedOffset, mandalaState.seedOffset + basePatternLen).split('');

  const baseRadius = minDim * 0.12;
  const maxRadius = minDim * 0.46;
  const ringGap = (maxRadius - baseRadius) / rings;

  const bg = ctx.createRadialGradient(cx, cy, minDim * 0.05, cx, cy, minDim * 0.6);
  bg.addColorStop(0, '#0b1230');
  bg.addColorStop(0.5, '#070b21');
  bg.addColorStop(1, '#040714');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(mandalaState.spin);

  for (let ringIndex = 0; ringIndex < rings; ringIndex += 1) {
    const ringRadius = baseRadius + ringGap * ringIndex;
    const segments = basePatternLen + ringIndex * 2 + Math.floor(zoom * 0.8);
    const ringStart = (mandalaState.seedOffset + ringIndex * (6 + zoom)) % digits.length;

    for (let segmentIndex = 0; segmentIndex < segments; segmentIndex += 1) {
      const baseDigit = parseInt(baseDigits[segmentIndex % basePatternLen], 10);
      const driftDigit = parseInt(digits[(ringStart + segmentIndex) % digits.length], 10);
      const blend = baseDigit * 0.72 + driftDigit * 0.28;

      const baseAngle = (segmentIndex / segments) * Math.PI * 2;
      const wobble = ((blend - 4.5) / 9) * (0.08 + drift * 0.6) * (1 + ringIndex * 0.04);
      const angle = baseAngle + wobble;
      const widthAngle = (Math.PI * 2 / segments) * (0.6 + blend * 0.035);

      const inner = ringRadius - ringGap * (0.36 + drift * 0.12) + (driftDigit / 9) * ringGap * 0.08;
      const outer = ringRadius + ringGap * (0.44 + drift * 0.22) + (blend / 9) * ringGap * (0.55 + zoom * 0.04);

      const hue = 210 + baseDigit * 12 + ringIndex * 2.2;
      const light = 38 + (driftDigit / 9) * 30 + zoom * 0.6;
      const alpha = 0.42 + (zoom / 15) - ringIndex * 0.012;

      ctx.beginPath();
      const angleStart = angle - widthAngle / 2;
      const angleEnd = angle + widthAngle / 2;
      const x1 = Math.cos(angleStart) * inner;
      const y1 = Math.sin(angleStart) * inner;
      const x2 = Math.cos(angle) * outer;
      const y2 = Math.sin(angle) * outer;
      const x3 = Math.cos(angleEnd) * inner;
      const y3 = Math.sin(angleEnd) * inner;
      ctx.moveTo(x1, y1);
      ctx.quadraticCurveTo(x2, y2, x3, y3);
      ctx.arc(0, 0, inner, angleEnd, angleStart, true);
      ctx.closePath();
      ctx.fillStyle = `hsla(${hue}, 78%, ${light}%, ${alpha})`;
      ctx.fill();

      ctx.strokeStyle = `hsla(${hue + 12}, 85%, ${light + 8}%, ${alpha * 0.65})`;
      ctx.lineWidth = 0.6 + blend * 0.06;
      ctx.stroke();

      if (zoom > 5) {
        const microCount = Math.min(10, Math.floor(zoom + 2));
        for (let microIndex = 0; microIndex < microCount; microIndex += 1) {
          const microDigit = parseInt(digits[(ringStart + segmentIndex + microIndex + 3) % digits.length], 10);
          const microAngle = angle + (microIndex - microCount / 2) * 0.015 * (1 + ringIndex * 0.03);
          const microRadius = inner + (outer - inner) * (0.3 + (microDigit / 12)) + microIndex * 0.3;
          const dotSize = 0.5 + (microDigit / 9) * 1.2;
          ctx.beginPath();
          ctx.fillStyle = `hsla(${hue + microDigit * 6}, 80%, ${52 + microDigit * 2}%, ${0.35 + zoom * 0.03})`;
          ctx.arc(Math.cos(microAngle) * microRadius, Math.sin(microAngle) * microRadius, dotSize, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  }

  ctx.restore();

  ctx.save();
  ctx.translate(cx, cy);
  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(0, 0, maxRadius + ringGap * 0.35, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function startMandala() {
  if (!mandalaInitialized || mandalaRunning || !mandalaState.motion || document.hidden) return;

  mandalaRunning = true;
  mandalaLastFrame = 0;
  const frameDuration = 1000 / MANDALA_FPS;

  const animate = (time) => {
    if (!mandalaRunning) return;

    if (time - mandalaLastFrame >= frameDuration) {
      mandalaLastFrame = time;
      mandalaState.spin += 0.002 + mandalaState.drift * 0.00015;
      drawMandala();
    }

    mandalaAnimId = requestAnimationFrame(animate);
  };

  mandalaAnimId = requestAnimationFrame(animate);
}

function stopMandala() {
  mandalaRunning = false;
  if (mandalaAnimId) {
    cancelAnimationFrame(mandalaAnimId);
    mandalaAnimId = null;
  }
}
