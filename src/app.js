import { analyze } from './engine.js';
import { SAMPLES } from './samples.js';
import { UI, SCAM_INFO, LINK_FLAGS, GENERAL_STEPS, LOW_STEPS } from './i18n.js';
import { shareText, whatsappUrl, complaintDraft } from './share.js';

const $ = (sel) => document.querySelector(sel);
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
  resultEl.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  $('#verdict-title').focus({ preventScroll: true });
}

function section(titleKey, ...body) {
  return el('section', { class: 'card' }, el('h3', {}, UI[lang][titleKey]), ...body);
}

function renderResult(r) {
  const t = UI[lang];
  const parts = [];

  parts.push(el('div', { class: `verdict verdict-${r.level}` },
    el('div', { class: 'verdict-text' },
      el('h2', { id: 'verdict-title', tabindex: '-1' }, t.verdict[r.level]),
      el('p', {}, t.verdictSub[r.level])),
    el('div', { class: 'meter', role: 'img', 'aria-label': `${t.riskScore}: ${r.score}/100` },
      el('span', { class: 'meter-num' }, r.score),
      el('span', { class: 'meter-label' }, t.riskScore),
      el('div', { class: 'meter-bar' }, el('div', { class: 'meter-fill', style: `width:${Math.max(r.score, 3)}%` })))));

  if (r.scamType) {
    const info = SCAM_INFO[r.scamType][lang];
    parts.push(el('section', { class: 'card type-card' },
      el('p', { class: 'eyebrow' }, t.looksLike),
      el('h3', {}, info.name),
      el('p', { class: 'muted' }, el('strong', {}, t.howItWorks + ': '), info.how),
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

  parts.push(section('yourMessage', el('p', { class: 'message-view' }, r.segments.map((seg) => (seg.kind
    ? el('mark', { class: `hl hl-${seg.kind}` }, seg.text)
    : seg.text)))));

  const rows = [
    ...r.urls.map((u) => el('li', { class: u.official ? 'ok' : (u.flags.length ? 'bad' : '') },
      el('code', {}, u.url),
      u.official
        ? el('p', {}, '✓ ' + t.official)
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
    resultEl.replaceChildren(...parts);
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

  parts.push(el('a', { class: 'helpline', href: 'tel:1930' },
    el('strong', {}, '📞 ' + t.lostMoney), el('span', {}, t.lostMoneySub)));

  resultEl.replaceChildren(...parts);
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
