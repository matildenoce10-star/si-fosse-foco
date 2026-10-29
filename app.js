// ---------- Dati: il sonetto (XIII sec., pubblico dominio) ----------
const VERSES = [
  { t: "S'i' fosse foco, arderei 'l mondo;", r: "A", g: "elementi",
    p: "Se fossi fuoco, brucerei il mondo;",
    n: "Apertura fulminante: l'elemento più distruttivo contro il mondo intero. Rima A in -ondo." },
  { t: "s'i' fosse vento, lo tempestarei;", r: "B", g: "elementi",
    p: "se fossi vento, lo sconvolgerei con le tempeste;",
    n: "Secondo elemento. Il verbo al condizionale ripete la struttura del verso 1 (parallelismo)." },
  { t: "s'i' fosse acqua, i' l'annegherei;", r: "B", g: "elementi",
    p: "se fossi acqua, lo annegherei;",
    n: "Terzo elemento: fuoco, aria, acqua. Manca la terra, perché è proprio il mondo da distruggere." },
  { t: "s'i' fosse Dio, mandereil' en profondo;", r: "A", g: "poteri",
    p: "se fossi Dio, lo farei sprofondare nell'abisso;",
    n: "Il passaggio più audace: Cecco si mette al posto di Dio, con un'iperbole quasi blasfema." },
  { t: "s'i' fosse papa, serei allor giocondo,", r: "A", g: "poteri",
    p: "se fossi papa, allora sarei felice,",
    n: "Dal cielo alla terra: il potere religioso. Allusione polemica al papato del tempo." },
  { t: "ché tutti ' cristïani imbrigarei;", r: "B", g: "poteri",
    p: "perché metterei nei guai tutti i cristiani;",
    n: "Il papa, invece di proteggere i fedeli, li tormenterebbe: rovesciamento ironico." },
  { t: "s'i' fosse 'mperator, sa' che farei?", r: "B", g: "poteri",
    p: "se fossi imperatore, sai cosa farei?",
    n: "Il potere politico. La domanda diretta al lettore crea complicità e attesa." },
  { t: "a tutti mozzarei lo capo a tondo.", r: "A", g: "poteri",
    p: "taglierei la testa a tutti, uno dopo l'altro.",
    n: "La risposta è brutale e comica insieme. Si chiudono le quartine: schema ABBA ABBA." },
  { t: "S'i' fosse morte, andarei da mio padre;", r: "C", g: "famiglia",
    p: "Se fossi la morte, andrei da mio padre;",
    n: "Inizia la prima terzina: il bersaglio diventa privato. Il padre avaro è un tema ricorrente in Cecco." },
  { t: "s'i' fosse vita, fuggirei da lui:", r: "D", g: "famiglia",
    p: "se fossi la vita, scapperei da lui:",
    n: "Antitesi morte/vita: due modi opposti per lo stesso scopo, liberarsi del padre." },
  { t: "similemente faría da mi' madre.", r: "C", g: "famiglia",
    p: "e farei lo stesso con mia madre.",
    n: "Neppure la madre si salva. Rime C-D-C." },
  { t: "S'i' fosse Cecco, com'i' sono e fui,", r: "D", g: "io",
    p: "Se fossi Cecco, come sono e sono sempre stato,",
    n: "Colpo di scena: l'ultima ipotesi coincide con la realtà, perché Cecco torna a essere se stesso." },
  { t: "torrei le donne giovani e leggiadre:", r: "C", g: "io",
    p: "mi prenderei le donne giovani e belle:",
    n: "Dalla distruzione universale a un desiderio molto terreno: il tono si abbassa di colpo." },
  { t: "e vecchie e laide lasserei altrui.", r: "D", g: "io",
    p: "e lascerei agli altri quelle vecchie e brutte.",
    n: "È la battuta finale, il cosiddetto “fulmen in clausula” (colpo a sorpresa in chiusura): tutta la furia precedente si rivela un gioco. Schema finale: CDC DCD." },
];
const GROUP_COLOR = { elementi: "var(--fire)", poteri: "var(--gold)", famiglia: "var(--blue)", io: "var(--rose)" };
const STANZAS = [[0, 4, "Quartina 1"], [4, 8, "Quartina 2"], [8, 11, "Terzina 1"], [11, 14, "Terzina 2"]];

const markAnafora = s => s.replace(/^(S'i' fosse|s'i' fosse)/, '<span class="anafora">$1</span>');

// ---------- Sonetto interattivo ----------
const sonnet = document.getElementById("sonnet");
STANZAS.forEach(([a, b, label]) => {
  const st = document.createElement("div");
  st.className = "stanza";
  st.innerHTML = `<span class="tag">${label}</span>`;
  for (let i = a; i < b; i++) {
    const v = VERSES[i];
    const row = document.createElement("div");
    row.className = "verse";
    row.dataset.g = v.g;
    row.style.borderLeft = `3px solid ${GROUP_COLOR[v.g]}`;
    row.innerHTML = `<span class="n">${i + 1}</span><span class="t">${markAnafora(v.t)}</span><span class="r ${v.r}">${v.r}</span>`;
    row.onclick = () => {
      sonnet.querySelectorAll(".verse").forEach(x => x.classList.remove("sel"));
      row.classList.add("sel");
      document.getElementById("exKick").textContent = `Verso ${i + 1} · ${label} · rima ${v.r}`;
      document.getElementById("exPara").textContent = v.p;
      document.getElementById("exNote").textContent = v.n;
    };
    st.appendChild(row);
  }
  sonnet.appendChild(st);
});

document.querySelectorAll("#legend button[data-f]").forEach(btn => {
  btn.onclick = () => {
    const f = btn.dataset.f;
    const same = sonnet.dataset.filter === f;
    document.querySelectorAll("#legend button[data-f]").forEach(b => b.classList.remove("on"));
    if (same) delete sonnet.dataset.filter;
    else { sonnet.dataset.filter = f; btn.classList.add("on"); }
  };
});
document.getElementById("rhymeBtn").onclick = e => {
  sonnet.classList.toggle("show-rhymes");
  e.currentTarget.classList.toggle("on");
};

// ---------- Mappa della canzone ----------
const SONG = [
  { l: "Intro", s: 6, c: "#8fbf7a", d: "Introduzione strumentale: gli squilli di tromba e il clavicembalo annunciano il brano, come farebbe un araldo in piazza." },
  { l: "Quartina 1", s: 14, c: "var(--fire)", d: "Versi 1–4: fuoco, vento, acqua, Dio. La melodia presenta il tema principale sul valzer." },
  { l: "Quartina 2", s: 14, c: "var(--gold)", d: "Versi 5–8: papa e imperatore. Stessa melodia della prima quartina, come succede alle strofe di una canzone." },
  { l: "Terzina 1", s: 10, c: "var(--blue)", d: "Versi 9–11: padre e madre. Le terzine sono più brevi e la frase musicale si accorcia." },
  { l: "Terzina 2", s: 10, c: "var(--rose)", d: "Versi 12–14: la battuta finale su Cecco e le donne, cantata con tono beffardo." },
  { l: "Ripresa", s: 14, c: "var(--fire)", d: "La prima quartina torna alla fine come un ritornello: “S'i' fosse foco…” chiude il cerchio, come il giro di un valzer." },
  { l: "Coda", s: 6, c: "#8fbf7a", d: "Chiusura strumentale breve. Il brano dura in tutto poco più di un minuto (circa 1'14\")." },
];
const songMap = document.getElementById("songMap");
SONG.forEach(b => {
  const el = document.createElement("div");
  el.className = "blk";
  el.style.flex = b.s;
  el.style.background = b.c;
  el.innerHTML = `${b.l}<small>~${b.s}s</small>`;
  el.onclick = () => {
    songMap.querySelectorAll(".blk").forEach(x => x.classList.remove("on"));
    el.classList.add("on");
    document.getElementById("songInfo").innerHTML = `<b style="color:var(--text)">${b.l}.</b> ${b.d}`;
  };
  songMap.appendChild(el);
});

// ---------- Testo con parafrasi ----------
const lyrics = document.getElementById("lyrics");
let showPara = false;
function renderLyrics() {
  lyrics.innerHTML = STANZAS.map(([a, b]) =>
    `<div class="stanza" style="padding:0 0 12px">` +
    VERSES.slice(a, b).map(v => `<div style="padding:3px 0">${markAnafora(v.t)}` +
      (showPara ? `<div style="font:15px var(--sans);color:var(--fire-2);margin:2px 0 6px">→ ${v.p}</div>` : "") +
      `</div>`).join("") + `</div>`).join("");
}
renderLyrics();
document.getElementById("paraBtn").onclick = e => {
  showPara = !showPara;
  e.currentTarget.textContent = showPara ? "Nascondi parafrasi" : "Mostra parafrasi";
  renderLyrics();
};

// ---------- Confronto tra i due autori ----------
const COMPARE = [
  ["Epoca", "Fine del Duecento, età dei Comuni", "1968, anno della contestazione studentesca"],
  ["Città", "Siena", "Genova"],
  ["Forma", "Sonetto", "Canzone d'autore"],
  ["Bersagli", "Papa, imperatore, padre, ideali dello Stilnovo", "Potere, ipocrisia, perbenismo borghese"],
  ["Strumenti espressivi", "Iperbole, parodia, linguaggio quotidiano", "Ironia, racconto degli emarginati"],
  ["Tono", "Comico-realistico e provocatorio", "Ironico e anticonformista"],
];
const compare = document.getElementById("compare");
COMPARE.forEach(([label, a, b], i) => {
  compare.insertAdjacentHTML("beforeend",
    `<div class="crow"><div class="cell left" data-row="${i}">${a}</div><div class="label" data-row="${i}">${label}</div><div class="cell" data-row="${i}">${b}</div></div>`);
});
compare.querySelectorAll("[data-row]").forEach(el => {
  const row = () => compare.querySelectorAll(`[data-row="${el.dataset.row}"]`);
  el.onmouseenter = () => row().forEach(x => x.classList.add("row-hover"));
  el.onmouseleave = () => row().forEach(x => x.classList.remove("row-hover"));
});

// ---------- Navigazione ----------
const sections = [...document.querySelectorAll("section")];
const dots = document.getElementById("dots");
sections.forEach((s, i) => {
  const a = document.createElement("a");
  a.href = "#" + s.id;
  a.innerHTML = `<span>${s.dataset.title}</span>`;
  a.onclick = e => { e.preventDefault(); go(i); };
  dots.appendChild(a);
});
let current = 0;
function go(i) {
  i = Math.max(0, Math.min(sections.length - 1, i));
  sections[i].scrollIntoView({ behavior: "smooth" });
}
window.go = go;

const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.querySelectorAll(".reveal").forEach((r, k) => setTimeout(() => r.classList.add("visible"), k * 120));
  });
}, { threshold: 0.15 });
sections.forEach(s => io.observe(s));

function onScroll() {
  const mid = window.scrollY + innerHeight / 2;
  current = sections.findIndex(s => s.offsetTop <= mid && s.offsetTop + s.offsetHeight > mid);
  [...dots.children].forEach((d, i) => d.classList.toggle("active", i === current));
  const max = document.documentElement.scrollHeight - innerHeight;
  const p = max > 0 ? Math.min(1, scrollY / max) : 0;
  document.getElementById("progress").style.width = p * 100 + "%";
  paintBg(p);
}
addEventListener("scroll", onScroll, { passive: true });

addEventListener("keydown", e => {
  if (e.target.tagName === "INPUT") return;
  if (["ArrowDown", "PageDown", "ArrowRight"].includes(e.key)) { e.preventDefault(); go(current + 1); }
  if (["ArrowUp", "PageUp", "ArrowLeft"].includes(e.key)) { e.preventDefault(); go(current - 1); }
  if (e.key === "f" || e.key === "F") toggleFs();
});
function toggleFs() {
  if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
  else document.exitFullscreen?.();
}
document.getElementById("fsBtn").onclick = toggleFs;

// ---------- Sfondo unico: sfumature di verde che cambiano mentre si scorre ----------
const GREENS = [
  ["#0b1f14", "#143524"], // verde bosco profondo
  ["#0e2619", "#1c4a2e"], // abete
  ["#10291f", "#22513d"], // pino
  ["#15301d", "#335a2f"], // muschio
  ["#122a1c", "#2b5238"], // salvia scura
  ["#0b2019", "#1b4234"], // verde petrolio
];
const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const mix = (a, b, t) => "rgb(" + hex(a).map((v, i) => Math.round(v + (hex(b)[i] - v) * t)).join(",") + ")";
function paintBg(p) {
  const x = p * (GREENS.length - 1), i = Math.min(GREENS.length - 2, Math.floor(x)), t = x - i;
  const root = document.documentElement.style;
  root.setProperty("--bg-top", mix(GREENS[i][0], GREENS[i + 1][0], t));
  root.setProperty("--bg-bottom", mix(GREENS[i][1], GREENS[i + 1][1], t));
}
onScroll();

// ---------- Caselle informative: un clic apre la spiegazione ----------
document.querySelectorAll(".facts").forEach(facts => {
  const panel = document.createElement("div");
  panel.className = "chip-info";
  panel.innerHTML = "<div><p></p></div>";
  facts.after(panel);
  if (facts.classList.contains("reveal")) panel.classList.add("reveal", "visible");
  const text = panel.querySelector("p");
  facts.querySelectorAll("button.chip").forEach(chip => {
    chip.onclick = () => {
      const wasOpen = chip.classList.contains("open");
      facts.querySelectorAll("button.chip").forEach(c => c.classList.remove("open"));
      if (wasOpen) { panel.classList.remove("open"); return; }
      chip.classList.add("open");
      text.innerHTML = `<b>${chip.querySelector("b").textContent}: ${chip.childNodes[1].textContent.trim()}</b>${chip.dataset.info}`;
      panel.classList.add("open");
    };
  });
});
