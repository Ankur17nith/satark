import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../public/styles.css', import.meta.url), 'utf8');
const root = css.slice(css.indexOf(':root {'), css.indexOf('}', css.indexOf(':root {')));
const t = Object.fromEntries([...root.matchAll(/--([\w-]+):\s*(#[0-9a-f]{6})\b/gi)].map((m) => [m[1], m[2]]));

function luminance(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function ratio(a, b) {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

// [text, background] pairs as used in styles.css
const PAIRS = [
  ['ink', 'paper'], ['ink-2', 'paper'], ['body', 'paper'], ['muted', 'paper'], ['muted', 'card'], ['body', 'card'],
  ['rescue-ink', 'paper'], ['rescue-ink', 'card'], ['safe-ink', 'safe-tint'], ['warn-ink', 'sun-tint'], ['danger-ink', 'danger-tint'],
  ['ink-2', 'danger-tint'], ['ink-2', 'sun-tint'], ['ink-2', 'safe-tint'],
  ['ink', 'sun'], ['ink', 'rescue'], ['ink', 'safe'], ['paper', 'ink'], ['paper', 'sea-deep'],
];

test('text meets WCAG AA (4.5:1) on every background it is used on', () => {
  for (const [fg, bg] of PAIRS) {
    assert.ok(t[fg] && t[bg], `missing token --${fg} or --${bg}`);
    const r = ratio(t[fg], t[bg]);
    assert.ok(r >= 4.5, `--${fg} on --${bg}: ${r.toFixed(2)}:1`);
  }
});

test('the big orange headline line is at least 3:1 (WCAG AA for large text)', () => {
  const r = ratio(t['rescue-big'], t.paper);
  assert.ok(r >= 3, `--rescue-big on --paper: ${r.toFixed(2)}:1`);
});
