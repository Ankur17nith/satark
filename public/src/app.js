import { analyze } from './engine.js';
import { SAMPLES } from './samples.js';
import { UI, SCAM_INFO, LINK_FLAGS, GENERAL_STEPS, LOW_STEPS } from './i18n.js';
import { shareText, whatsappUrl, complaintDraft } from './share.js';

const $ = (sel) => document.querySelector(sel);
const ICONS = {
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  phone: '<path d="M6.6 3.5h2.8l1.4 4.2-2 1.5a12 12 0 0 0 6 6l1.5-2 4.2 1.4v2.8a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2z"/>',
};
// Constant markup only, never user text.
function icon(name) {
  const span = document.createElement('span');
  span.innerHTML = `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name]}</svg>`;
  return span.firstChild;
}
const input = $('#message');
const resultEl = $('#result');
let lang = loadLang();
let lastResult = null;

function loadLang() {
  try {
    const saved = localStorage.getItem('satark-lang');
    if (saved === 'en' || saved === 'hi') return saved;
  } catch { /* storage unavailable */ }
  return (navigator.language || '').toLowerCase().startsWith('hi') ? 'hi' : 'en';
}

function saveLang() {
  try { localStorage.setItem('satark-lang', lang); } catch { /* ignore */ }
}

function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k === 'class') node.className = v;
    else if (k.startsWith('on')) node.addEventListener(k.slice(2), v);
    else node.setAttribute(k, v === true ? '' : v);
  }
  for (const c of children.flat()) {
    if (c == null || c === false) continue;
    node.append(c instanceof Node ? c : document.createTextNode(String(c)));
  }
  return node;
}

function applyStaticText() {
  const t = UI[lang];
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach((node) => {
    node.textContent = t[node.dataset.i18n];
  });
  input.placeholder = t.placeholder;
  $('#hero-title').replaceChildren(...t.heroLines.map((line, i) => el('span', { class: 'kin-line' + (i === t.heroLines.length - 1 ? ' accent' : '') },
    el('span', { class: 'riso' }, line))));
  $('#stat-tiles').replaceChildren(...t.statTiles.map(([value, label]) => el('div', { class: 'tile' }, el('dd', {}, value), el('dt', {}, label))));
  $('#how-steps').replaceChildren(...t.howSteps.map(([title, text], i) => el('li', { class: 'pop-in' },
    el('span', { class: 'how-num', 'aria-hidden': 'true' }, String(i + 1).padStart(2, '0')), el('h3', {}, title), el('p', {}, text))));
  document.querySelectorAll('.lang-toggle button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
  renderSamples();
}

function renderSamples() {
  const box = $('#samples');
  box.replaceChildren(...SAMPLES.map((s) => el('button', {
    type: 'button',
    class: 'chip' + (s.id === 'safe' ? ' chip-safe' : ''),
    onclick: () => { input.value = s.text; run(); },
  }, s.label[lang])));
}

function run() {
  const text = input.value.trim();
  const error = $('#input-error');
  if (!text) {
    error.textContent = UI[lang].emptyError;
    input.focus();
    return;
  }
  error.textContent = '';
  lastResult = analyze(text);
  renderResult(lastResult);
  resultEl.hidden = false;
  resultEl.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' });
  $('#verdict-title').focus({ preventScroll: true });
}

function section(titleKey, ...body) {
  return el('section', { class: 'card' }, el('h3', {}, UI[lang][titleKey]), ...body);
}

const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

function countUp(node, to) {
  if (reducedMotion() || to === 0) { node.textContent = to; return; }
  const start = performance.now();
  const step = (now) => {
    const p = Math.min(1, (now - start) / 700);
    node.textContent = Math.round(to * (1 - (1 - p) ** 3));
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function renderResult(r) {
  const t = UI[lang];
  const parts = [];
  const num = el('span', { class: 'meter-num' }, '0');

  const verdict = el('div', { class: `verdict verdict-${r.level}` },
    el('div', { role: 'img', 'aria-label': `${t.riskScore}: ${r.score}/100` },
      el('span', { class: 'meter-label' }, t.riskScore),
      el('div', { class: 'meter' }, num, el('span', { class: 'meter-of' }, t.outOf))),
    el('div', { class: 'verdict-text' },
      el('h2', { id: 'verdict-title', tabindex: '-1' }, t.verdict[r.level]),
      el('p', {}, t.verdictSub[r.level])),
    el('span', { class: 'stamp', 'aria-hidden': 'true' }, t.stamp[r.level]));

  if (r.scamType) {
    const info = SCAM_INFO[r.scamType][lang];
    parts.push(el('section', { class: 'card type-card' },
      el('p', { class: 'eyebrow' }, t.looksLike),
      el('h3', {}, info.name),
      el('p', { class: 'type-how' }, el('strong', {}, t.howItWorks + ': '), info.how),
      el('ul', { class: 'tips' }, info.tips.map((tip) => el('li', {}, tip)))));
  }

  if (r.signals.length) {
    parts.push(section('redFlags', el('ol', { class: 'flags' }, r.signals.map((s) => el('li', {},
      el('p', {}, s[lang]),
      el('p', { class: 'quote' }, s.matches.slice(0, 2).map((m) => el('mark', {}, m.text.trim()))))))));
  }

  if (r.reassuring.length && !r.signals.length) {
    parts.push(section('goodSigns', el('ul', { class: 'good' }, r.reassuring.map((s) => el('li', {}, s[lang])))));
  }

  const left = parts.splice(0);
  parts.push(section('yourMessage',
    el('p', { class: 'message-view' }, r.segments.map((seg) => (seg.kind
      ? el('mark', { class: `hl hl-${seg.kind}` }, seg.text)
      : seg.text))),
    r.segments.some((seg) => seg.kind) && el('p', { class: 'legend muted small' },
      el('mark', { class: 'hl hl-flag' }, t.legendFlag), ' ',
      el('mark', { class: 'hl hl-badLink' }, t.legendBad), ' ',
      el('mark', { class: 'hl hl-link' }, t.legendLink))));

  const rows = [
    ...r.urls.map((u) => el('li', { class: u.official ? 'ok' : (u.flags.length ? 'bad' : '') },
      el('code', {}, u.url),
      u.official
        ? el('p', { class: 'ok-label' }, icon('check'), t.official)
        : (u.flags.length
          ? el('ul', {}, u.flags.map((f) => el('li', {}, LINK_FLAGS[f.id][lang])))
          : el('p', { class: 'muted' }, t.noIssues)))),
    ...r.phones.map((p) => el('li', { class: p.foreign ? 'bad' : '' },
      el('code', {}, p.value), el('p', {}, p.foreign ? t.foreignNumber : (p.tollFree ? t.tollFree : t.indianNumber)))),
    ...r.upis.map((u) => el('li', { class: 'bad' }, el('code', {}, u.value), el('p', {}, t.upiId))),
  ];
  if (rows.length) parts.push(section('linksTitle', el('ul', { class: 'links' }, rows)));

  if (r.level === 'low') {
    parts.push(section('stayingSafe', el('ul', { class: 'steps' }, LOW_STEPS[lang].map((s) => el('li', {}, s)))));
    layout(verdict, left, parts, null, num, r.score);
    return;
  }

  const draft = complaintDraft(r);
  const draftBox = el('textarea', { class: 'draft', readonly: true, rows: '8', 'aria-label': t.reportTitle }, draft);
  const status = el('p', { class: 'status', role: 'status' });
  parts.push(section('whatToDo',
    el('ol', { class: 'steps' }, GENERAL_STEPS[lang].map((s) => el('li', {}, s))),
    el('div', { class: 'actions' },
      el('a', { class: 'btn btn-wa', href: whatsappUrl(shareText(r, lang, location.origin + location.pathname)), target: '_blank', rel: 'noopener' }, t.warnFamily),
      el('button', { type: 'button', class: 'btn btn-secondary', onclick: () => copy(draft, draftBox, status) }, t.copyReport),
      el('a', { class: 'btn btn-secondary', href: 'https://cybercrime.gov.in/', target: '_blank', rel: 'noopener' }, t.reportPortal)),
    status,
    el('details', {}, el('summary', {}, t.reportTitle), draftBox)));

  const helpline = el('a', { class: 'helpline', href: 'tel:1930' },
    el('strong', {}, icon('phone'), t.lostMoney), el('span', {}, t.lostMoneySub));

  layout(verdict, left, parts, helpline, num, r.score);
}

// Verdict on top, then two columns (they stack on phones); each sheet slides in after the last.
function layout(verdict, left, right, helpline, num, score) {
  const blocks = [verdict];
  if (left.length) blocks.push(el('div', { class: 'col' }, left));
  blocks.push(el('div', { class: 'col' }, right));
  if (helpline) blocks.push(helpline);
  const sheets = [verdict, ...left, ...right, helpline].filter(Boolean);
  sheets.forEach((node, i) => { node.classList.add('sheet-in'); node.style.setProperty('--i', i); });
  resultEl.replaceChildren(...blocks);
  countUp(num, score);
}

async function copy(text, box, status) {
  try {
    await navigator.clipboard.writeText(text);
    status.textContent = UI[lang].copied;
  } catch {
    box.closest('details').open = true;
    box.select();
    status.textContent = UI[lang].copyFailed;
  }
}

$('#check').addEventListener('click', run);
$('#clear').addEventListener('click', () => {
  input.value = '';
  resultEl.hidden = true;
  resultEl.replaceChildren();
  input.focus();
});
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) run();
});

const pasteBtn = $('#paste');
if (navigator.clipboard?.readText) {
  pasteBtn.addEventListener('click', async () => {
    try {
      input.value = await navigator.clipboard.readText();
      if (input.value.trim()) run();
    } catch { input.focus(); }
  });
} else {
  pasteBtn.hidden = true;
}

document.querySelectorAll('.lang-toggle button').forEach((b) => b.addEventListener('click', () => {
  lang = b.dataset.lang;
  saveLang();
  applyStaticText();
  if (lastResult && !resultEl.hidden) renderResult(lastResult);
}));

// Text shared to the installed app (Web Share Target) or via ?text= link.
const params = new URLSearchParams(location.search);
const shared = ['title', 'text', 'url'].map((k) => params.get(k)).filter(Boolean).join('\n').trim();

applyStaticText();
if (shared) {
  input.value = shared;
  run();
  history.replaceState(null, '', location.pathname);
}

if ('serviceWorker' in navigator && location.protocol === 'https:') {
  navigator.serviceWorker.register('./sw.js').catch(() => {});
}
