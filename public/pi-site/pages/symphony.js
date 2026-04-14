/* ============================================================
   PAGES/SYMPHONY.JS - Pi Symphony (Web Audio API)
   ============================================================ */

let symphonyInitialized = false;
let symphonyAudioCtx = null;
let symphonyPlaying = false;
let symphonyInterval = null;
let currentDigitIndex = 0;
let symphonyTempo = 120;
let symphonyOctave = 0;
let analyser = null;
let waveformRAF = null;
let waveformData = null;

const NOTE_FREQUENCIES = [
  261.63,
  293.66,
  329.63,
  349.23,
  392.0,
  440.0,
  493.88,
  523.25,
  587.33,
  659.25
];

function renderSymphony() {
  const section = document.getElementById('page-symphony');
  section.innerHTML = `
  <div class="content-wrap">

    <div class="page-header">
      <span class="pill pill-orange">Music</span>
      <h1 class="page-title">Pi Symphony</h1>
      <p class="page-subtitle">Each digit of Pi becomes a musical note. Listen as Pi sings its infinite, non-repeating melody.</p>
      <div class="divider-line"><span></span><span></span></div>
    </div>

    <div class="symphony-panel">
      <div class="symphony-header">
        <div class="symphony-title">
          <i class="fa-solid fa-music"></i>
          Pi Symphony
          <span class="pill pill-orange" style="font-size:11px;margin:0;">Music</span>
        </div>
      </div>

      <div style="display:flex;gap:24px;align-items:center;min-height:130px;">
        <div style="flex:0 0 72px;display:flex;flex-direction:column;align-items:center;gap:8px;">
          <button class="play-btn" id="symphony-play-btn">
            <i class="fa-solid fa-play" id="play-icon"></i>
          </button>
          <div style="color:rgba(255,255,255,0.55);font-size:11px;text-align:center;white-space:nowrap;line-height:1.4;">
            Digit: <span id="current-digit-label" style="color:var(--orange);font-weight:700;">3</span><br>
            <span id="current-note-label" style="color:rgba(255,255,255,0.3);">#0</span>
          </div>
        </div>

        <div style="flex:0 0 220px;">
          <div class="symphony-label">Tempo: <span id="tempo-label">120</span> BPM</div>
          <input type="range" id="tempo-slider" min="40" max="200" value="120" style="margin-bottom:4px;" />
          <div class="range-markers" style="color:rgba(255,255,255,0.35);">
            <span>40</span><span>120</span><span>200</span>
          </div>
          <div class="symphony-label" style="margin-top:12px;">Octave Shift: <span id="octave-label" style="color:var(--orange);">0</span></div>
          <div class="octave-control">
            <button class="octave-btn" id="octave-down">-</button>
            <div class="octave-num" id="octave-val">0</div>
            <button class="octave-btn" id="octave-up">+</button>
          </div>
        </div>

        <div style="flex:1;position:relative;height:110px;border-radius:8px;overflow:hidden;background:#070B24;min-width:0;">
          <canvas id="waveform-canvas" style="position:absolute;top:0;left:0;width:100%;height:100%;"></canvas>
          <div class="waveform-label" style="position:absolute;top:8px;right:10px;pointer-events:none;">Waveform Visualization</div>
        </div>
      </div>

      <div class="symphony-status" style="border-top:1px solid rgba(255,255,255,0.07);margin-top:16px;padding-top:14px;">
        <div class="status-box">
          <div class="status-value" id="digit-seq-display">314159</div>
          <div class="status-label">Digit sequence</div>
        </div>
        <div class="status-box">
          <div class="status-value" id="bpm-display">120 BPM</div>
          <div class="status-label">Current tempo</div>
        </div>
      </div>
    </div>

    <div class="two-col" style="margin-bottom:0;">
      <div class="card">
        <div class="card-title"><i class="fa-solid fa-circle-info"></i> How It Works</div>
        <div class="card-text">
          Each digit of Pi (0-9) is mapped to a note in the <strong>C major scale</strong> (C4 through E5).
          The digits play in sequence at the set tempo. Octave shift moves all notes up or down by one octave.
          The waveform visualizes the audio output in real time using the Web Audio API AnalyserNode.
        </div>
      </div>
      <div class="card">
        <div class="card-title"><i class="fa-solid fa-music"></i> Note Mapping</div>
        <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:6px;margin-top:4px;">
          ${['C4','D4','E4','F4','G4','A4','B4','C5','D5','E5'].map((note, index) => `
            <div style="background:var(--orange-light);border-radius:6px;padding:6px;text-align:center;">
              <div style="font-size:16px;font-weight:800;color:var(--orange);">${index}</div>
              <div style="font-size:10px;color:var(--text-mid);margin-top:2px;">${note}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>

  </div>
  ${getFooterHTML()}`;
}

function initSymphony() {
  if (symphonyInitialized) return;

  const playBtn = document.getElementById('symphony-play-btn');
  const tempoSlider = document.getElementById('tempo-slider');
  const octaveDown = document.getElementById('octave-down');
  const octaveUp = document.getElementById('octave-up');
  if (!playBtn || !tempoSlider || !octaveDown || !octaveUp) return;

  symphonyInitialized = true;

  playBtn.addEventListener('click', toggleSymphony);
  tempoSlider.addEventListener('input', function () {
    symphonyTempo = parseInt(this.value, 10);
    document.getElementById('tempo-label').textContent = symphonyTempo;
    document.getElementById('bpm-display').textContent = `${symphonyTempo} BPM`;

    if (symphonyPlaying) {
      clearInterval(symphonyInterval);
      startSymphonyLoop();
    }
  });

  octaveDown.addEventListener('click', () => adjustOctave(-1));
  octaveUp.addEventListener('click', () => adjustOctave(1));
  window.addEventListener('resize', syncWaveformCanvas, { passive: true });

  syncWaveformCanvas();
}

function syncWaveformCanvas() {
  const canvas = document.getElementById('waveform-canvas');
  if (!canvas) return;

  const parent = canvas.parentElement;
  const width = parent?.offsetWidth || 400;
  const height = parent?.offsetHeight || 110;
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
}

function adjustOctave(delta) {
  symphonyOctave = Math.max(-2, Math.min(2, symphonyOctave + delta));
  document.getElementById('octave-val').textContent = symphonyOctave;
  document.getElementById('octave-label').textContent = symphonyOctave;
}

function toggleSymphony() {
  if (symphonyPlaying) stopSymphony();
  else startSymphony();
}

function startSymphony() {
  if (!symphonyAudioCtx) {
    symphonyAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
    analyser = symphonyAudioCtx.createAnalyser();
    analyser.fftSize = 256;
    analyser.connect(symphonyAudioCtx.destination);
    waveformData = new Uint8Array(analyser.frequencyBinCount);
  }

  if (symphonyAudioCtx.state === 'suspended') {
    symphonyAudioCtx.resume();
  }

  symphonyPlaying = true;
  document.getElementById('play-icon').className = 'fa-solid fa-pause';

  startSymphonyLoop();
  syncWaveformCanvas();
  drawWaveform();
}

function stopSymphony() {
  symphonyPlaying = false;

  if (symphonyInterval) {
    clearInterval(symphonyInterval);
    symphonyInterval = null;
  }

  if (waveformRAF) {
    cancelAnimationFrame(waveformRAF);
    waveformRAF = null;
  }

  const playIcon = document.getElementById('play-icon');
  if (playIcon) playIcon.className = 'fa-solid fa-play';

  const canvas = document.getElementById('waveform-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

function startSymphonyLoop() {
  if (symphonyInterval) clearInterval(symphonyInterval);

  const msPerBeat = (60 / symphonyTempo) * 1000;
  symphonyInterval = window.setInterval(() => {
    if (!symphonyPlaying) return;

    const digit = parseInt(PI_DIGITS[currentDigitIndex], 10);
    playNote(digit);
    updateSymphonyUI(digit, currentDigitIndex);
    currentDigitIndex = (currentDigitIndex + 1) % 100;
  }, msPerBeat);
}

function playNote(digit) {
  if (!symphonyAudioCtx || !analyser) return;

  const oscillator = symphonyAudioCtx.createOscillator();
  const gain = symphonyAudioCtx.createGain();
  const octaveMultiplier = Math.pow(2, symphonyOctave);

  oscillator.frequency.value = NOTE_FREQUENCIES[digit] * octaveMultiplier;
  oscillator.type = 'sine';
  oscillator.connect(gain);
  gain.connect(analyser);

  gain.gain.setValueAtTime(0, symphonyAudioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(0.3, symphonyAudioCtx.currentTime + 0.02);
  gain.gain.linearRampToValueAtTime(0, symphonyAudioCtx.currentTime + 0.35);

  oscillator.start(symphonyAudioCtx.currentTime);
  oscillator.stop(symphonyAudioCtx.currentTime + 0.38);
}

function updateSymphonyUI(digit, index) {
  const digitLabel = document.getElementById('current-digit-label');
  const noteLabel = document.getElementById('current-note-label');
  const sequenceDisplay = document.getElementById('digit-seq-display');

  if (digitLabel) digitLabel.textContent = digit;
  if (noteLabel) noteLabel.textContent = ` #${index}`;
  if (sequenceDisplay) sequenceDisplay.textContent = PI_DIGITS.slice(index, index + 6);
}

function drawWaveform() {
  if (!symphonyPlaying || !analyser || !waveformData) return;

  const canvas = document.getElementById('waveform-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;

  analyser.getByteTimeDomainData(waveformData);
  ctx.clearRect(0, 0, width, height);

  ctx.lineWidth = 2;
  ctx.strokeStyle = '#EC6F00';
  ctx.beginPath();

  const sliceWidth = width / waveformData.length;
  let x = 0;
  for (let index = 0; index < waveformData.length; index += 1) {
    const value = waveformData[index] / 128.0;
    const y = (value * height) / 2;
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
    x += sliceWidth;
  }
  ctx.stroke();

  waveformRAF = requestAnimationFrame(drawWaveform);
}
