/* ============================================================
   PAGES/ABOUT.JS — About Pi Section
   ============================================================ */

function renderAbout() {
  const section = document.getElementById('page-about');
  section.innerHTML = `
  <div class="content-wrap">

    <!-- Hero Banner -->
    <div class="hero-banner">
      <div class="hero-bg-pi">π</div>
      <div class="hero-left">
        <h1 class="hero-title">Explore<br><span class="accent">Everything</span> π</h1>
        <p class="hero-subtitle">Dive into the infinite wonder of mathematical π — from ancient history to modern computation and beyond.</p>
        <div class="hero-buttons">
          <button class="btn btn-primary" onclick="navigateTo('explorer')">
            <i class="fa-solid fa-magnifying-glass"></i> Explore π
          </button>
          <button class="btn btn-secondary" onclick="navigateTo('explorer')">
            <i class="fa-solid fa-search"></i> Search π digits
          </button>
        </div>
      </div>
      <div class="hero-right">
        <div class="hero-formula-area">
          <div class="big-pi-hero">π</div>
          <div class="formula-pill formula-1">C = 2πr</div>
          <div class="formula-pill formula-2">A = πr²</div>
          <div class="formula-pill formula-3">e<sup>iπ</sup> + 1 = 0</div>
        </div>
      </div>
    </div>

    <!-- What is π? -->
    <div class="card" style="margin-bottom:24px;padding:24px 28px;">

      <div style="display:grid;grid-template-columns:1fr auto;gap:28px;align-items:center;">
        <!-- Text side -->
        <div>
          <span class="pill pill-orange" style="margin-bottom:8px;display:inline-block;">Mathematics</span>
          <h2 class="page-title" style="font-size:26px;margin-bottom:6px;">What is π?</h2>
          <p style="font-size:13.5px;color:var(--text-mid);margin-bottom:14px;line-height:1.5;">
            The ratio of a circle's circumference to its diameter — constant for every circle in existence.
          </p>
          <div class="divider-line" style="margin-bottom:14px;"><span></span><span></span></div>
          <div class="pi-info-box" style="margin-bottom:14px;font-size:14px;padding:11px 16px;">π = 3.1415926535 8979323846 2643383279…</div>
          <p style="font-size:14px;color:var(--text-mid);line-height:1.7;margin:0;">
            π is an <strong>irrational</strong> number — its decimal never ends or repeats.
            The ratio is expressed as <strong style="color:var(--orange);">π = C / d</strong>, where <em>C</em> is circumference and <em>d</em> is diameter.
            Although π has been computed to over <strong>100 trillion digits</strong>, just <strong>3.14159</strong> handles nearly every real-world calculation.
          </p>
        </div>
        <!-- Diagram side -->
        <div style="display:flex;flex-direction:column;align-items:center;background:#FFF8F2;border-radius:12px;padding:18px 16px;min-width:200px;">
          <svg viewBox="0 0 200 200" width="168" height="168">
            <circle cx="100" cy="100" r="78" fill="none" stroke="#EC6F00" stroke-width="2.5" stroke-dasharray="10 5"/>
            <line x1="22" y1="100" x2="178" y2="100" stroke="#EC6F00" stroke-width="2" stroke-dasharray="6 3"/>
            <line x1="100" y1="100" x2="100" y2="22" stroke="#555" stroke-width="1.5" stroke-dasharray="4 3" opacity="0.5"/>
            <circle cx="100" cy="100" r="5" fill="#EC6F00"/>
            <text x="105" y="115" font-size="13" fill="#EC6F00" font-weight="700" font-family="Inter,sans-serif">r</text>
            <text x="72" y="194" font-size="11" fill="#888" font-family="Inter,sans-serif">d = 2r</text>
            <text x="36" y="76" font-size="11" fill="#EC6F00" font-family="Inter,sans-serif">C = 2πr</text>
            <text x="14" y="148" font-size="11" fill="#888" font-family="Inter,sans-serif">C / d = π</text>
          </svg>
          <div style="font-size:11.5px;color:var(--text-mid);text-align:center;margin-top:8px;font-weight:500;line-height:1.4;">Circle: circumference ÷ diameter = π</div>
        </div>
      </div>

    </div>

    <!-- 3 Info Cards -->
    <div class="three-col" style="margin-bottom:24px;">
      <div class="card">
        <div class="card-title"><i class="fa-regular fa-circle-question"></i> Definition</div>
        <div class="card-text">π is defined as the ratio of a circle's circumference (<em>C</em>) to its diameter (<em>d</em>): <strong>π = C / d</strong>. This ratio is the same for every circle, regardless of size. π ≈ 3.14159265358979…</div>
      </div>
      <div class="card">
        <div class="card-title"><i class="fa-solid fa-clock-rotate-left"></i> History</div>
        <div class="card-text">The concept of π has been known since ancient times. Babylonians approximated it as 3.125 (~1900 BCE). Archimedes (~250 BCE) bounded it between 223/71 and 22/7. Johann Lambert proved its irrationality in 1761. The symbol "π" was popularized by Euler in 1737.</div>
      </div>
      <div class="card">
        <div class="card-title"><i class="fa-solid fa-star"></i> Facts</div>
        <div class="card-text">π is both <strong>irrational</strong> (not expressible as a fraction) and <strong>transcendental</strong> (not a root of any polynomial). Its digits appear statistically random. In 2022, Google Cloud computed π to <strong>100 trillion decimal places</strong>.</div>
      </div>
    </div>

    <!-- Pi as a Living Universe -->
    <div class="living-universe">
      <div class="living-header">
        <span class="pill pill-blue">Visualization</span>
        <h2 class="page-title" style="font-size:28px;margin-bottom:6px;">Pi as a Living Universe</h2>
        <p class="page-subtitle" style="max-width:700px;">
          Turn Pi into a cosmic system where every digit becomes a star system, mapped into a spiral galaxy with glowing pathways.
        </p>
      </div>
      <div class="living-grid">
        <div class="living-canvas-wrap">
          <canvas id="pi-universe-canvas" aria-label="Pi universe visualization"></canvas>
          <div class="living-overlay">Spiral of digits - connected as a glowing path</div>
        </div>
        <div class="living-side">
          <div class="living-rules">
            <div class="living-rules-title"><i class="fa-solid fa-sparkles"></i> Cosmic Rules</div>
            <ul class="living-rules-list">
              <li>Each digit becomes a <strong>star system</strong></li>
              <li>Digits orbit in a <strong>spiral galaxy</strong></li>
              <li>Digit value controls <strong>size</strong> (0 small to 9 large)</li>
              <li>Digit value controls <strong>color + brightness</strong></li>
              <li>Sequential digits connect into a <strong>glowing path</strong></li>
            </ul>
          </div>
          <div class="living-zoom">
            <div class="living-zoom-title">Zoomed-in Galaxy Slice</div>
            <canvas id="pi-universe-zoom" aria-label="Zoomed-in pi galaxy"></canvas>
            <div class="living-zoom-caption">A moving window drifts across the digits like a traveling telescope.</div>
          </div>
        </div>
      </div>
    </div>
    <!-- Common Uses + Interesting Facts -->
    <div class="two-col" style="margin-bottom:0;">
      <div class="card">
        <div class="section-heading"><i class="fa-solid fa-gears" style="color:var(--orange);margin-right:8px;"></i>Common Uses of π</div>
        <ul class="pi-bullet-list">
          <li>Circle area and circumference calculations</li>
          <li>Engineering — wheels, pipes, arches and domes</li>
          <li>Signal processing and Fourier transforms</li>
          <li>Probability and statistics (normal distribution)</li>
          <li>Physics — wave equations, quantum mechanics</li>
          <li>Computer graphics and 3D rendering</li>
          <li>GPS and satellite orbit calculations</li>
        </ul>
      </div>
      <div class="card">
        <div class="section-heading"><i class="fa-solid fa-lightbulb" style="color:var(--orange);margin-right:8px;"></i>Interesting Facts</div>
        <ul class="pi-bullet-list">
          <li>π is irrational — no exact fraction can represent it</li>
          <li>First 6 digits: <strong>3.14159</strong></li>
          <li>The "Feynman point" — position 762 has six 9s in a row</li>
          <li>March 14 (3/14) is celebrated worldwide as <strong>Pi Day</strong></li>
          <li>In 2019, Emma Haruka Iwao computed 31.4 trillion digits</li>
          <li>Every known sequence of digits appears somewhere in π</li>
          <li>The circumference of Earth is approximately 40,075 km = 2π × 6,371 km</li>
        </ul>
      </div>
    </div>

  </div>
  ${getFooterHTML()}`;
}
let livingUniverseStarted = false;

function initLivingUniverse() {
  if (livingUniverseStarted) return;
  const mainCanvas = document.getElementById('pi-universe-canvas');
  const zoomCanvas = document.getElementById('pi-universe-zoom');
  if (!mainCanvas || !zoomCanvas || typeof PI_DIGITS !== 'string') return;

  livingUniverseStarted = true;

  const dpr = window.devicePixelRatio || 1;
  const mainCtx = mainCanvas.getContext('2d');
  const zoomCtx = zoomCanvas.getContext('2d');

  const digits = PI_DIGITS.slice(0, 900).split('').map(Number);
  const basePoints = digits.map((digit, i) => {
    const angle = i * 0.38;
    const radius = Math.sqrt(i + 1) * 6.5;
    return { digit, angle, radius };
  });

  const palette = [
    '#5A8BFF',
    '#6ED5FF',
    '#5CFFCC',
    '#8DFF7C',
    '#FFE66D',
    '#FFB86B',
    '#FF8A5B',
    '#FF6FB1',
    '#B577FF',
    '#8E6BFF'
  ];

  function resizeCanvas(canvas, ctx) {
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.max(1, Math.floor(rect.width * dpr));
    canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return rect;
  }

  function drawBackground(ctx, rect, bright = 1) {
    const grad = ctx.createRadialGradient(
      rect.width * 0.5, rect.height * 0.5, 20,
      rect.width * 0.5, rect.height * 0.5, rect.width * 0.7
    );
    const innerAlpha = 0.9 * bright;
    const outerAlpha = 0.98 * bright;
    grad.addColorStop(0, 'rgba(12, 18, 46, ' + innerAlpha + ')');
    grad.addColorStop(1, 'rgba(4, 7, 20, ' + outerAlpha + ')');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, rect.width, rect.height);
  }

  function drawGalaxy(ctx, rect, time, zoomStart = 0, zoomCount = digits.length, zoomScale = 1) {
    ctx.clearRect(0, 0, rect.width, rect.height);
    drawBackground(ctx, rect, zoomScale === 1 ? 1 : 0.85);

    const centerX = rect.width * 0.5;
    const centerY = rect.height * 0.5;
    const breath = 1 + Math.sin(time * 0.0012) * 0.02;
    const rotation = time * 0.00015;

    const slice = basePoints.slice(zoomStart, zoomStart + zoomCount);
    const maxRadius = slice[slice.length - 1]?.radius || 1;
    const scale = Math.min(rect.width, rect.height) / (maxRadius * 2.2) * zoomScale;

    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(110, 180, 255, 0.08)';
    ctx.beginPath();
    slice.forEach((point, i) => {
      const angle = point.angle + rotation;
      const r = point.radius * scale * breath;
      const x = centerX + Math.cos(angle) * r;
      const y = centerY + Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    slice.forEach((point, i) => {
      const angle = point.angle + rotation;
      const r = point.radius * scale * breath;
      const x = centerX + Math.cos(angle) * r;
      const y = centerY + Math.sin(angle) * r;
      const size = 0.8 + point.digit * 0.45;
      const glow = 0.35 + (point.digit / 12);
      const flicker = 0.7 + 0.3 * Math.sin(time * 0.002 + i * 0.17);

      ctx.beginPath();
      ctx.fillStyle = palette[point.digit];
      ctx.globalAlpha = glow * flicker;
      ctx.shadowColor = palette[point.digit];
      ctx.shadowBlur = 10 + point.digit * 2.2;
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  }

  function animate(time) {
    const mainRect = resizeCanvas(mainCanvas, mainCtx);
    const zoomRect = resizeCanvas(zoomCanvas, zoomCtx);

    drawGalaxy(mainCtx, mainRect, time);

    const windowSize = Math.min(160, digits.length - 1);
    const start = Math.floor((time * 0.02) % (digits.length - windowSize));
    drawGalaxy(zoomCtx, zoomRect, time * 1.3, start, windowSize, 1.35);

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);

  window.addEventListener('resize', () => {
    resizeCanvas(mainCanvas, mainCtx);
    resizeCanvas(zoomCanvas, zoomCtx);
  }, { passive: true });
}


