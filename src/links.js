// Extracts and analyses links, phone numbers and UPI IDs found in a message.
import { BRANDS, SHORTENERS, RISKY_TLDS, UPI_HANDLES } from './rules.js';

const TLD_LIST = 'com|in|net|org|co|xyz|top|click|link|live|online|site|info|shop|buzz|icu|me|ly|io|app|cfd|sbs|lol|vip|win|tk|ml|ga|cf|gq|pw|cc|gov\\.in|co\\.in|org\\.in|sbi|bank\\.in';
const URL_RE = new RegExp(
  String.raw`\b(?:https?:\/\/[^\s<>"']+|www\.[^\s<>"']+|(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+(?:${TLD_LIST})\b(?:\/[^\s<>"']*)?)`,
  'gi',
);
const UPI_RE = new RegExp(String.raw`\b[a-z0-9][a-z0-9._-]{1,60}@(?:${UPI_HANDLES.join('|')})\b(?!\.)`, 'gi');
const PHONE_RE = /(?:\+|\b00)\d{1,3}[\s-]?\d(?:[\s-]?\d){6,13}\b|(?<![\d+])\b[6-9]\d{4}[\s-]?\d{5}\b|\b1[48]00[\s-]?\d{3}[\s-]?\d{3,4}\b/g;

const TRAILING = /[.,;:!?)\]}'"]+$/;

export function hostMatches(host, domain) {
  return host === domain || host.endsWith('.' + domain);
}

function isIp(host) {
  return /^\d{1,3}(?:\.\d{1,3}){3}$/.test(host);
}

export function analyzeUrl(raw) {
  const cleaned = raw.replace(TRAILING, '');
  const explicitHttp = /^http:\/\//i.test(cleaned);
  let parsed;
  try {
    parsed = new URL(/^https?:\/\//i.test(cleaned) ? cleaned : 'https://' + cleaned);
  } catch {
    return { url: cleaned, host: cleaned, flags: [], official: false, weight: 0 };
  }
  const host = parsed.hostname.toLowerCase().replace(/\.$/, '');
  const flags = [];
  const add = (id, weight) => flags.push({ id, weight });

  const officialBrand = Object.entries(BRANDS).find(([, domains]) => domains.some((d) => hostMatches(host, d)));
  const official = Boolean(officialBrand) || /\.gov\.in$|\.nic\.in$/.test(host);

  if (!official) {
    const labels = host.split(/[.-]/);
    const brand = Object.keys(BRANDS).find((b) => labels.some((l) => l.includes(b)));
    if (brand) add('brandLookalike', 30);
    if (/(?:gov|govt|police|cbi|rbi)[.-]/.test(host) || /(?:^|[.-])(?:gov|govt)(?:[.-]|$)/.test(host)) add('fakeGov', 25);
  }
  if (SHORTENERS.has(host)) add('shortener', 15);
  if (isIp(host)) add('ipAddress', 25);
  if (host.includes('xn--')) add('punycode', 25);
  const tld = host.split('.').pop();
  if (RISKY_TLDS.has(tld)) add('riskyTld', 12);
  if (explicitHttp && !official) add('noHttps', 8);
  if ((host.match(/-/g) || []).length >= 2 || host.split('.').length >= 5) add('messyHost', 8);
  if (/\.apk(?:$|[?#])/i.test(parsed.pathname + parsed.search)) add('apkLink', 25);
  if (parsed.username || /@/.test(cleaned.replace(/^https?:\/\//i, '').split('/')[0])) add('atTrick', 15);
  if (/(?:kyc|verify|update|login|signin|secure|reward|claim|refund|redeem|unblock)/i.test(host + parsed.pathname) && !official) {
    add('bait', 8);
  }

  const weight = official ? -5 : flags.reduce((s, f) => s + f.weight, 0);
  return { url: cleaned, host, flags, official, weight };
}

function collect(re, text) {
  return [...text.matchAll(re)].map((m) => ({ value: m[0], start: m.index, end: m.index + m[0].length }));
}

export function extractLinks(text) {
  const upis = collect(UPI_RE, text);
  const inUpi = (m) => upis.some((u) => m.start >= u.start && m.start < u.end);
  const urls = collect(URL_RE, text)
    .filter((m) => !inUpi(m))
    .filter((m) => !/@/.test(text.slice(Math.max(0, m.start - 1), m.start))) // part of an email address
    .map((m) => {
      const trimmed = m.value.replace(TRAILING, '');
      return { ...m, value: trimmed, end: m.start + trimmed.length, ...analyzeUrl(trimmed) };
    });
  const inUrl = (m) => urls.some((u) => m.start >= u.start && m.start < u.end);
  const phones = collect(PHONE_RE, text)
    .filter((m) => !inUrl(m) && !inUpi(m))
    .map((m) => {
      const digits = m.value.replace(/[^\d+]/g, '');
      const intl = /^(?:\+|00)/.test(digits);
      const code = intl ? digits.replace(/^(?:\+|00)/, '') : '';
      const foreign = intl && !code.startsWith('91');
      const tollFree = /^1[48]00/.test(digits);
      return { ...m, digits, foreign, tollFree };
    });
  return { urls, phones, upis };
}
