// ============================================================
//  audio.js — Web Audio API synthesizer
// ============================================================

class PiAudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.reverbNode = null;
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);

    // Simple reverb via convolver + delay
    this.delay = this.ctx.createDelay(0.5);
    this.delay.delayTime.value = 0.18;
    this.feedbackGain = this.ctx.createGain();
    this.feedbackGain.gain.value = 0.25;
    this.delay.connect(this.feedbackGain);
    this.feedbackGain.connect(this.delay);
    this.delay.connect(this.masterGain);
    this.masterGain.connect(this.ctx.destination);

    this.initialized = true;
  }

  /**
   * Play a piano-like tone for a given digit (0–9).
   * @param {number} digit
   * @param {number} [duration=0.45]
   */
  playNote(digit, duration = 0.45) {
    if (!this.initialized) this.init();
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const freq = NOTE_FREQUENCIES[digit] ?? 440;
    const now = this.ctx.currentTime;

    // Oscillator (triangle for softer piano tone)
    const osc = this.ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);

    // Slight pitch envelope for piano-like attack
    osc.frequency.setTargetAtTime(freq * 0.999, now + 0.01, 0.1);

    // Envelope
    const env = this.ctx.createGain();
    env.gain.setValueAtTime(0, now);
    env.gain.linearRampToValueAtTime(0.55, now + 0.01);   // attack
    env.gain.exponentialRampToValueAtTime(0.3, now + 0.08); // decay
    env.gain.exponentialRampToValueAtTime(0.001, now + duration); // release

    // Second harmonic for richness
    const osc2 = this.ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2, now);
    const env2 = this.ctx.createGain();
    env2.gain.setValueAtTime(0, now);
    env2.gain.linearRampToValueAtTime(0.15, now + 0.01);
    env2.gain.exponentialRampToValueAtTime(0.001, now + duration * 0.6);

    osc.connect(env);
    osc2.connect(env2);
    env.connect(this.masterGain);
    env.connect(this.delay);
    env2.connect(this.masterGain);

    osc.start(now);
    osc2.start(now);
    osc.stop(now + duration + 0.1);
    osc2.stop(now + duration + 0.1);
  }

  /**
   * Play a "miss" buzz sound.
   */
  playMiss() {
    if (!this.initialized) this.init();
    if (this.ctx.state === 'suspended') this.ctx.resume();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(80, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.3);
    const env = this.ctx.createGain();
    env.gain.setValueAtTime(0.4, now);
    env.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    osc.connect(env);
    env.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.35);
  }

  /**
   * Play a short "combo" chime.
   */
  playCombo(level) {
    if (!this.initialized) this.init();
    const baseFreq = 600 + level * 80;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.linearRampToValueAtTime(baseFreq * 1.5, now + 0.12);
    const env = this.ctx.createGain();
    env.gain.setValueAtTime(0.3, now);
    env.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    osc.connect(env);
    env.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.3);
  }

  setVolume(v) {
    if (this.masterGain) this.masterGain.gain.setValueAtTime(v, this.ctx.currentTime);
  }
}

const audioEngine = new PiAudioEngine();
