// Satark scam-detection engine. Pure functions, no DOM, runs in the
// browser and in Node (for tests). Nothing leaves the device.
import { SIGNALS, SCAM_TYPES } from './rules.js';
import { extractLinks } from './links.js';

export const LEVELS = { LOW: 'low', SUSPICIOUS: 'suspicious', HIGH: 'high' };

// Combinations that are far more dangerous together than apart.
const COMBOS = [
  { id: 'digitalArrestCombo', needs: ['authority', 'threat'], bonus: 15 },
  { id: 'isolationCombo', needs: ['authority', 'secrecy'], bonus: 15 },
  { id: 'pressureCombo', needs: ['urgency', 'credentials'], bonus: 10 },
  { id: 'kycPressureCombo', needs: ['kyc', 'threat'], bonus: 10 },
];

function globalize(re) {
  return re.flags.includes('g') ? re : new RegExp(re.source, re.flags + 'g');
}

// Normalise characters that would otherwise break patterns while keeping
// every character at the same index (so highlights line up).
function normalize(text) {
  return text.replace(/[’‘`]/g, "'").replace(/[“”]/g, '"').replace(/ /g, ' ');
}

export function scoreFromRaw(raw) {
  if (raw <= 0) return 0;
  return Math.min(99, Math.round(100 * (1 - Math.exp(-raw / 45))));
}

export function levelFor(score) {
  if (score >= 55) return LEVELS.HIGH;
  if (score >= 20) return LEVELS.SUSPICIOUS;
  return LEVELS.LOW;
}

export function classify(text) {
  let best = null;
  for (const type of SCAM_TYPES) {
    const hits = type.keywords.filter((k) => k.test(text)).length;
    if (hits >= 2 && (!best || hits > best.hits)) best = { id: type.id, hits };
  }
  return best ? best.id : null;
}

export function analyze(input) {
  const text = normalize(String(input ?? ''));
  const spans = [];
  const signals = [];
  let raw = 0;

  for (const signal of SIGNALS) {
    const matches = [];
    for (const pattern of signal.patterns) {
      for (const m of text.matchAll(globalize(pattern))) {
        if (m[0].trim()) matches.push({ start: m.index, end: m.index + m[0].length, text: m[0] });
      }
    }
    if (matches.length) {
      signals.push({ id: signal.id, weight: signal.weight, reassuring: Boolean(signal.reassuring), matches, en: signal.en, hi: signal.hi });
      raw += signal.weight;
      if (!signal.reassuring) matches.forEach((m) => spans.push({ start: m.start, end: m.end, kind: 'flag', id: signal.id }));
    }
  }

  const { urls, phones, upis } = extractLinks(text);
  const ids = new Set(signals.map((s) => s.id));

  // Links: count the riskiest link fully, others at half weight.
  const urlWeights = urls.map((u) => u.weight).sort((a, b) => b - a);
  urlWeights.forEach((w, i) => { raw += i === 0 ? w : Math.max(0, w) / 2; });
  urls.forEach((u) => spans.push({ start: u.start, end: u.end, kind: u.official ? 'safeLink' : (u.flags.length ? 'badLink' : 'link'), id: 'link' }));

  const foreign = phones.filter((p) => p.foreign);
  if (foreign.length) raw += 15;
  phones.forEach((p) => spans.push({ start: p.start, end: p.end, kind: p.foreign ? 'badLink' : 'contact', id: 'phone' }));

  if (upis.length) raw += ids.has('moneyRequest') || ids.has('payToReceive') ? 18 : 8;
  upis.forEach((u) => spans.push({ start: u.start, end: u.end, kind: 'badLink', id: 'upi' }));

  const combos = COMBOS.filter((c) => c.needs.every((n) => ids.has(n)));
  combos.forEach((c) => { raw += c.bonus; });

  // A link combined with any pressure tactic is the classic phishing shape.
  const unofficialLink = urls.some((u) => !u.official);
  if (unofficialLink && (ids.has('urgency') || ids.has('threat') || ids.has('kyc') || ids.has('reward'))) {
    raw += 10;
    combos.push({ id: 'linkPressureCombo', bonus: 10 });
  }

  const score = scoreFromRaw(raw);
  const level = levelFor(score);
  const scamType = level === LEVELS.LOW ? null : classify(text);

  return {
    text,
    score,
    level,
    scamType,
    signals: signals.filter((s) => !s.reassuring).sort((a, b) => b.weight - a.weight),
    reassuring: signals.filter((s) => s.reassuring),
    urls,
    phones,
    upis,
    combos,
    segments: segment(text, spans),
  };
}

// Splits text into plain / highlighted segments, merging overlapping spans.
export function segment(text, spans) {
  const sorted = [...spans].sort((a, b) => a.start - b.start || b.end - a.end);
  const merged = [];
  for (const s of sorted) {
    const last = merged[merged.length - 1];
    if (last && s.start < last.end) {
      last.end = Math.max(last.end, s.end);
      last.ids.add(s.id);
      if (rank(s.kind) > rank(last.kind)) last.kind = s.kind;
    } else {
      merged.push({ start: s.start, end: s.end, kind: s.kind, ids: new Set([s.id]) });
    }
  }
  const out = [];
  let pos = 0;
  for (const m of merged) {
    if (m.start > pos) out.push({ text: text.slice(pos, m.start) });
    out.push({ text: text.slice(m.start, m.end), kind: m.kind, ids: [...m.ids] });
    pos = m.end;
  }
  if (pos < text.length) out.push({ text: text.slice(pos) });
  return out;
}

function rank(kind) {
  return { safeLink: 0, contact: 1, link: 2, flag: 3, badLink: 4 }[kind] ?? 0;
}
