import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../public/styles.css', import.meta.url), 'utf8');

function tokens(block) {
  return Object.fromEntries([...block.matchAll(/--([\w-]+):\s*(#[0-9a-f]{6})\b/gi)].map((m) => [m[1], m[2]]));
}
const light = tokens(css.slice(css.indexOf(':root {'), css.indexOf('}', css.indexOf(':root {'))));
const darkStart = css.indexOf(':root {', css.indexOf('prefers-color-scheme: dark'));
const dark = tokens(css.slice(darkStart, css.indexOf('}', darkStart)));

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
  ['ink', 'bg'], ['ink', 'surface'], ['ink-2', 'bg'], ['ink-2', 'surface'],
  ['accent-ink', 'accent'], ['high', 'high-bg'], ['mid', 'mid-bg'], ['low', 'low-bg'],
];

for (const [name, t] of [['light', light], ['dark', dark]]) {
  test(`${name} theme text meets WCAG AA (4.5:1)`, () => {
    for (const [fg, bg] of PAIRS) {
      assert.ok(t[fg] && t[bg], `missing token --${fg} or --${bg}`);
      const r = ratio(t[fg], t[bg]);
      assert.ok(r >= 4.5, `--${fg} on --${bg}: ${r.toFixed(2)}:1`);
    }
  });
}

test('white text on the WhatsApp and helpline buttons meets WCAG AA', () => {
  assert.ok(ratio('#ffffff', light.wa) >= 4.5, `wa: ${ratio('#ffffff', light.wa).toFixed(2)}`);
  assert.ok(ratio('#ffffff', light.high) >= 4.5, `helpline: ${ratio('#ffffff', light.high).toFixed(2)}`);
});
