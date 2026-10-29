// Motivetto in tempo di valzer (3/4) sul giro di accordi Am – F – E7 – Am.
// Il giro di accordi è quello della canzone; la MELODIA è originale e non riproduce quella di De André.
// Tutti i suoni sono sintetizzati con la Web Audio API (nessun campione audio esterno).

let ctx, master, reverb;
function audio() {
  if (ctx) { if (ctx.state === "suspended") ctx.resume(); return ctx; }
  ctx = new (window.AudioContext || window.webkitAudioContext)();
  const comp = ctx.createDynamicsCompressor();
  master = ctx.createGain(); master.gain.value = 0.8;
  master.connect(comp); comp.connect(ctx.destination);
  // riverbero "da sala" generato con rumore che decade
  reverb = ctx.createConvolver();
  const len = ctx.sampleRate * 1.8, buf = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
  }
  reverb.buffer = buf;
  const wet = ctx.createGain(); wet.gain.value = 0.22;
  reverb.connect(wet); wet.connect(master);
  return ctx;
}
const hz = m => 440 * Math.pow(2, (m - 69) / 12);
function out(node) { node.connect(master); node.connect(reverb); }

// ---------- Strumenti ----------
function harpsi(t, m, vel = 0.12, dec = 0.9) {
  const g = ctx.createGain(), hp = ctx.createBiquadFilter(), lp = ctx.createBiquadFilter();
  hp.type = "highpass"; hp.frequency.value = 280;
  lp.type = "lowpass"; lp.frequency.setValueAtTime(5200, t); lp.frequency.exponentialRampToValueAtTime(1400, t + dec);
  [-5, 5].forEach(det => {
    const o = ctx.createOscillator(); o.type = "sawtooth";
    o.frequency.value = hz(m); o.detune.value = det;
    o.connect(hp); o.start(t); o.stop(t + dec + 0.05);
  });
  hp.connect(lp); lp.connect(g); out(g);
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(vel, t + 0.003);
  g.gain.exponentialRampToValueAtTime(0.0008, t + dec);
}

function trumpet(t, m, dur, vel = 0.16) {
  const o = ctx.createOscillator(), lp = ctx.createBiquadFilter(), g = ctx.createGain();
  const lfo = ctx.createOscillator(), lfoG = ctx.createGain();
  o.type = "sawtooth"; o.frequency.value = hz(m);
  lfo.frequency.value = 5.5; lfoG.gain.setValueAtTime(0, t); lfoG.gain.linearRampToValueAtTime(6, t + Math.min(dur, 0.4));
  lfo.connect(lfoG); lfoG.connect(o.detune);
  lp.type = "lowpass"; lp.Q.value = 2;
  lp.frequency.setValueAtTime(500, t);
  lp.frequency.linearRampToValueAtTime(3000, t + 0.05);
  lp.frequency.linearRampToValueAtTime(1900, t + 0.2);
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(vel, t + 0.035);
  g.gain.setValueAtTime(vel * 0.85, t + Math.max(0.05, dur - 0.06));
  g.gain.linearRampToValueAtTime(0, t + dur);
  o.connect(lp); lp.connect(g); out(g);
  o.start(t); lfo.start(t); o.stop(t + dur + 0.05); lfo.stop(t + dur + 0.05);
}

function pluck(t, m, vel = 0.1) {
  const o = ctx.createOscillator(), o2 = ctx.createOscillator(), lp = ctx.createBiquadFilter(), g = ctx.createGain();
  o.type = "triangle"; o2.type = "sawtooth";
  o.frequency.value = o2.frequency.value = hz(m);
  const g2 = ctx.createGain(); g2.gain.value = 0.3;
  lp.type = "lowpass"; lp.frequency.setValueAtTime(3000, t); lp.frequency.exponentialRampToValueAtTime(700, t + 0.6);
  o.connect(lp); o2.connect(g2); g2.connect(lp); lp.connect(g); out(g);
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vel, t + 0.004);
  g.gain.exponentialRampToValueAtTime(0.0008, t + 1.4);
  o.start(t); o2.start(t); o.stop(t + 1.5); o2.stop(t + 1.5);
}

function bass(t, m, vel = 0.32) {
  const o = ctx.createOscillator(), g = ctx.createGain(), lp = ctx.createBiquadFilter();
  o.type = "triangle"; o.frequency.value = hz(m);
  lp.type = "lowpass"; lp.frequency.value = 900;
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vel, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.55);
  o.connect(lp); lp.connect(g); g.connect(master);
  o.start(t); o.stop(t + 0.6);
}

let noiseBuf;
function tamb(t, vel = 0.07) {
  if (!noiseBuf) {
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 0.3, ctx.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  const s = ctx.createBufferSource(), hp = ctx.createBiquadFilter(), g = ctx.createGain();
  s.buffer = noiseBuf; hp.type = "highpass"; hp.frequency.value = 6500;
  g.gain.setValueAtTime(vel, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
  s.connect(hp); hp.connect(g); g.connect(master);
  s.start(t); s.stop(t + 0.15);
}
function thump(t, vel = 0.35) {
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.frequency.setValueAtTime(110, t); o.frequency.exponentialRampToValueAtTime(48, t + 0.12);
  g.gain.setValueAtTime(vel, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
  o.connect(g); g.connect(master); o.start(t); o.stop(t + 0.2);
}

// ---------- Partitura ----------
// note MIDI: E4=64 G#4=68 A4=69 B4=71 C5=72 D5=74 E5=76 F5=77 G#5=80 A5=81
const CH = {
  Am: { b: 45, n: [64, 69, 72] },
  F:  { b: 41, n: [65, 69, 72] },
  E7: { b: 40, n: [62, 68, 71] },
};
// ogni battuta: [accordo, casella del giro (0-3), [[nota, durata in tempi], ...]]
const SCORE = [
  ["Am", 0, [[69, 1], [72, 1], [76, 1]]],       // introduzione di trombe
  ["E7", 2, [[80, 2], [71, 1]]],
  ["Am", 0, [[76, 2], [72, 1]]],                // prima volta del giro
  ["Am", 0, [[69, 1], [71, 1], [72, 1]]],
  ["F",  1, [[77, 2], [76, 1]]],
  ["F",  1, [[74, 1], [72, 1], [69, 1]]],
  ["E7", 2, [[68, 2], [71, 1]]],
  ["E7", 2, [[74, 1], [72, 1], [71, 1]]],
  ["Am", 3, [[72, 2], [69, 1]]],
  ["Am", 3, [[69, 3]]],
  ["Am", 0, [[81, 2], [76, 1]]],                // seconda volta, melodia più acuta
  ["Am", 0, [[72, 1], [76, 1], [81, 1]]],
  ["F",  1, [[81, 1], [77, 1], [72, 1]]],
  ["F",  1, [[77, 2], [76, 1]]],
  ["E7", 2, [[74, 1], [71, 1], [68, 1]]],
  ["E7", 2, [[71, 2], [74, 1]]],
  ["Am", 3, [[72, 1], [71, 1], [68, 1]]],
  ["Am", 3, [[69, 3]]],
];
const BEATS = SCORE.length * 3;
// lista piatta delle note di melodia con il tempo di inizio (in tempi)
const MELODY = [];
SCORE.forEach(([, , notes], bar) => { let b = bar * 3; notes.forEach(([m, d]) => { MELODY.push({ m, s: b, d }); b += d; }); });

const parts = { melody: true, chords: true, bass: true, perc: true };
document.querySelectorAll("[data-part]").forEach(cb => cb.onchange = () => parts[cb.dataset.part] = cb.checked);

let bpm = 160, playing = false, nextTime = 0, beat = 0, timer, visQueue = [];
const tempo = document.getElementById("tempo");
tempo.oninput = () => { bpm = +tempo.value; document.getElementById("tempoVal").textContent = bpm; };

function scheduleBeat(i, t) {
  const spb = 60 / bpm, bar = Math.floor(i / 3), pos = i % 3, [chName, , notes] = SCORE[bar], ch = CH[chName];
  if (parts.melody) {
    let b = 0;
    notes.forEach(([m, d]) => { if (b === pos) trumpet(t, m, d * spb * 0.95); b += d; });
  }
  if (pos === 0) {
    if (parts.bass) bass(t, ch.b);
    if (parts.perc) thump(t);
  } else {
    if (parts.chords) ch.n.forEach((m, k) => harpsi(t + k * 0.008, m, 0.06, 0.5));
    if (parts.perc) tamb(t);
  }
  visQueue.push({ t, i });
}

function scheduler() {
  while (nextTime < ctx.currentTime + 0.12) {
    scheduleBeat(beat, nextTime);
    nextTime += 60 / bpm;
    beat = (beat + 1) % BEATS;
  }
}

const playBtn = document.getElementById("playBtn");
const chordBoxes = [...document.querySelectorAll("#chordBoxes div")];
const beatDots = [...document.querySelectorAll("#playerBeats span")];
function showPosition(i) {
  const bar = i < 0 ? -1 : Math.floor(i / 3);
  chordBoxes.forEach((el, k) => el.classList.toggle("on", bar >= 0 && SCORE[bar][1] === k));
  beatDots.forEach((el, k) => el.classList.toggle("hit", i >= 0 && i % 3 === k));
  document.getElementById("barCount").textContent = bar < 0 ? `Battuta – / ${SCORE.length}` : `Battuta ${bar + 1} / ${SCORE.length}`;
}

playBtn.onclick = () => {
  audio();
  playing = !playing;
  if (playing) {
    beat = 0; nextTime = ctx.currentTime + 0.08; visQueue = [];
    timer = setInterval(scheduler, 25);
    playBtn.textContent = "■ Ferma";
    requestAnimationFrame(drawLoop);
  } else {
    clearInterval(timer);
    playBtn.textContent = "▶ Suona";
    curBeat = -1; drawRoll(); showPosition(-1);
  }
};

// ---------- Visualizzazione: rullo di pianola ----------
const roll = document.getElementById("roll"), rx = roll.getContext("2d");
let curBeat = -1;
function drawRoll() {
  const W = roll.width, H = roll.height, pad = 20;
  rx.clearRect(0, 0, W, H);
  const lo = 66, hi = 83, bw = (W - pad * 2) / BEATS, nh = (H - pad * 2 - 20) / (hi - lo);
  for (let b = 0; b <= SCORE.length; b++) {
    const major = b === 2 || b === 10;
    rx.strokeStyle = major ? "rgba(233,196,106,.45)" : "rgba(220,240,220,.10)"; rx.lineWidth = major ? 2 : 1;
    rx.beginPath(); rx.moveTo(pad + b * 3 * bw, pad); rx.lineTo(pad + b * 3 * bw, H - pad - 14); rx.stroke();
    if (b < SCORE.length && (b === 0 || SCORE[b][0] !== SCORE[b - 1][0])) {
      rx.fillStyle = "#b3c4ad"; rx.font = "600 17px Inter, sans-serif";
      rx.fillText(SCORE[b][0], pad + b * 3 * bw + 6, H - 8);
    }
  }
  MELODY.forEach(n => {
    const active = curBeat >= n.s && curBeat < n.s + n.d;
    rx.fillStyle = active ? "#fbf6e6" : n.s < 6 ? "#8fbf7a" : "#e9c46a";
    if (active) { rx.shadowColor = "#e9c46a"; rx.shadowBlur = 18; }
    const x = pad + n.s * bw + 1, y = H - pad - 20 - (n.m - lo + 1) * nh;
    rx.beginPath(); rx.roundRect ? rx.roundRect(x, y, n.d * bw - 3, nh * 0.9, 4) : rx.rect(x, y, n.d * bw - 3, nh * 0.9); rx.fill();
    rx.shadowBlur = 0;
  });
  if (curBeat >= 0) {
    rx.fillStyle = "rgba(244,223,160,.85)";
    rx.fillRect(pad + curBeat * bw, pad, 2, H - pad * 2 - 14);
  }
}
drawRoll();

function drawLoop() {
  if (!playing) return;
  while (visQueue.length && visQueue[0].t <= ctx.currentTime) {
    const { i } = visQueue.shift();
    curBeat = i;
    showPosition(i);
    drawRoll();
  }
  requestAnimationFrame(drawLoop);
}

// ---------- Anteprime dei timbri (sezione strumenti) ----------
document.querySelectorAll("[data-sound]").forEach(btn => btn.onclick = () => {
  audio();
  const t = ctx.currentTime + 0.05;
  if (btn.dataset.sound === "harpsi") [57, 60, 64, 69, 72, 69, 64, 60].forEach((m, k) => harpsi(t + k * 0.16, m, 0.11));
  if (btn.dataset.sound === "trumpet") [[69, .18], [69, .18], [72, .18], [76, .7]].reduce((tt, [m, d]) => (trumpet(tt, m, d), tt + d + 0.03), t);
});
