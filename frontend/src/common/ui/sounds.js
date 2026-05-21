// Pleasant sound utility using Web Audio API.
// No MP3 files needed — synthesized in the browser.

let _ctx = null;
const ctx = () => {
  if (typeof window === "undefined") return null;
  if (!_ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    _ctx = new AC();
  }
  return _ctx;
};

// Play a single note shaped with a soft ADSR envelope.
const tone = (freq, when, duration = 0.18, gainPeak = 0.12, type = "sine") => {
  const c = ctx();
  if (!c) return;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, when);
  g.gain.setValueAtTime(0, when);
  g.gain.linearRampToValueAtTime(gainPeak, when + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, when + duration);
  osc.connect(g).connect(c.destination);
  osc.start(when);
  osc.stop(when + duration + 0.02);
};

// Bright, friendly "ting" — two-note ascending chime (C5 -> G5).
export const playSelectSound = () => {
  const c = ctx();
  if (!c) return;
  if (c.state === "suspended") c.resume();
  const now = c.currentTime;
  // Two-note arpeggio + a soft high overtone for sparkle
  tone(523.25, now,        0.16, 0.10, "sine");      // C5
  tone(783.99, now + 0.05, 0.18, 0.10, "sine");      // G5
  tone(1046.5, now + 0.05, 0.20, 0.04, "triangle");  // C6 sparkle
};

// Soft, polite "boop" — descending blip.
export const playUnselectSound = () => {
  const c = ctx();
  if (!c) return;
  if (c.state === "suspended") c.resume();
  const now = c.currentTime;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(523.25, now);                            // C5
  osc.frequency.exponentialRampToValueAtTime(329.63, now + 0.12);       // -> E4
  g.gain.setValueAtTime(0, now);
  g.gain.linearRampToValueAtTime(0.09, now + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);
  osc.connect(g).connect(c.destination);
  osc.start(now);
  osc.stop(now + 0.18);
};

// Joyful win cheer — quick C-major triad arpeggio.
export const playWinSound = () => {
  const c = ctx();
  if (!c) return;
  if (c.state === "suspended") c.resume();
  const now = c.currentTime;
  [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
    tone(freq, now + i * 0.07, 0.22, 0.10, "sine");
  });
};
