import { test } from 'node:test';
import assert from 'node:assert/strict';
import { analyze, segment, scoreFromRaw, levelFor } from '../src/engine.js';
import { analyzeUrl, extractLinks } from '../src/links.js';
import { SAMPLES } from '../src/samples.js';

const sample = (id) => SAMPLES.find((s) => s.id === id).text;

test('every scam sample is high risk and correctly classified', () => {
  const expected = { digitalArrest: 'digitalArrest', kycBank: 'kycBank', taskJob: 'taskJob', utility: 'utility', upiRefund: 'upiRefund', hindi: 'kycBank' };
  for (const [id, type] of Object.entries(expected)) {
    const r = analyze(sample(id));
    assert.equal(r.level, 'high', `${id} scored ${r.score}`);
    assert.equal(r.scamType, type, id);
  }
});

test('genuine OTP message is low risk', () => {
  const r = analyze(sample('safe'));
  assert.equal(r.level, 'low');
  assert.equal(r.signals.length, 0);
  assert.equal(r.reassuring[0].id, 'safeOtpNotice');
});

test('ordinary messages are not flagged', () => {
  const benign = [
    'Hey, are we still meeting for lunch tomorrow at 1? I will book the table.',
    'Your order #4521 from Amazon has been delivered. Track at https://www.amazon.in/orders',
    'Happy birthday beta! Lots of love from all of us.',
    'Rs.2,500 debited from A/c XX1234 on 12-Nov to Swiggy. Not you? Call 1800 1234 567 - Bank',
    'Meeting moved to 4 pm. Please check the deck I shared on email.',
    'मैं शाम को घर आऊँगा, खाना साथ में खाएँगे।',
  ];
  for (const text of benign) {
    const r = analyze(text);
    assert.notEqual(r.level, 'high', `"${text}" scored ${r.score}: ${r.signals.map((s) => s.id)}`);
  }
});

test('"do not share OTP" is not treated as a request for OTP', () => {
  assert.ok(!analyze('Never share your OTP with anyone.').signals.some((s) => s.id === 'credentials'));
  assert.ok(!analyze('Do not share the OTP. It is secret.').signals.some((s) => s.id === 'credentials'));
  assert.ok(analyze('Please share the OTP you received to complete verification').signals.some((s) => s.id === 'credentials'));
  assert.ok(analyze('OTP batao jaldi').signals.some((s) => s.id === 'credentials'));
});

test('curly apostrophes do not break negation', () => {
  assert.ok(!analyze('Don’t share your OTP').signals.some((s) => s.id === 'credentials'));
});

test('URL analysis flags lookalikes but trusts official domains', () => {
  const fake = analyzeUrl('http://sbi-kyc-update.xyz/login');
  const ids = fake.flags.map((f) => f.id);
  assert.ok(ids.includes('brandLookalike'));
  assert.ok(ids.includes('riskyTld'));
  assert.ok(ids.includes('noHttps'));
  assert.equal(analyzeUrl('https://www.onlinesbi.sbi/').official, true);
  assert.equal(analyzeUrl('https://retail.onlinesbi.sbi/retail/login.htm').official, true);
  assert.equal(analyzeUrl('https://www.incometax.gov.in').official, true);
  assert.ok(analyzeUrl('https://hdfcbank.com.secure-login.top').flags.some((f) => f.id === 'brandLookalike'));
  assert.ok(analyzeUrl('http://192.168.4.20/pay').flags.some((f) => f.id === 'ipAddress'));
  assert.ok(analyzeUrl('https://xn--sbi-xyz.com').flags.some((f) => f.id === 'punycode'));
  assert.ok(analyzeUrl('https://files.example.com/app/PMKisan.apk').flags.some((f) => f.id === 'apkLink'));
  assert.ok(analyzeUrl('bit.ly/abc').flags.some((f) => f.id === 'shortener'));
});

test('extracts links, phones and UPI IDs without overlap', () => {
  const { urls, phones, upis } = extractLinks('Pay to ramesh@ybl or visit www.fake-site.xyz, call +84 912 345 678 or 98765 43210. Mail help@sbi.co.in');
  assert.deepEqual(upis.map((u) => u.value), ['ramesh@ybl']);
  assert.deepEqual(urls.map((u) => u.value), ['www.fake-site.xyz']);
  assert.equal(phones.length, 2);
  assert.equal(phones.filter((p) => p.foreign).length, 1);
});

test('segments reassemble to the original text', () => {
  for (const s of SAMPLES) {
    const r = analyze(s.text);
    assert.equal(r.segments.map((x) => x.text).join(''), r.text);
  }
});

test('segment merges overlapping spans', () => {
  const out = segment('abcdefgh', [
    { start: 1, end: 4, kind: 'flag', id: 'a' },
    { start: 3, end: 6, kind: 'badLink', id: 'b' },
  ]);
  assert.deepEqual(out.map((s) => s.text), ['a', 'bcdef', 'gh']);
  assert.equal(out[1].kind, 'badLink');
  assert.deepEqual(out[1].ids.sort(), ['a', 'b']);
});

test('score and levels are monotonic and bounded', () => {
  assert.equal(scoreFromRaw(-10), 0);
  assert.ok(scoreFromRaw(1000) <= 99);
  assert.ok(scoreFromRaw(30) < scoreFromRaw(60));
  assert.equal(levelFor(10), 'low');
  assert.equal(levelFor(30), 'suspicious');
  assert.equal(levelFor(80), 'high');
});

test('handles empty and odd input', () => {
  assert.equal(analyze('').score, 0);
  assert.equal(analyze(null).score, 0);
  assert.equal(analyze('🙏🙏🙏').level, 'low');
});
