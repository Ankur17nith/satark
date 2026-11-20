// Writes evidence/tests.json and evidence/eval.json. Run: npm run evidence
import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { analyze } from '../public/src/engine.js';

mkdirSync('evidence', { recursive: true });

const run = spawnSync(process.execPath, ['--test', '--test-reporter=tap', ...readdirSync('tests').filter((f) => f.endsWith('.test.js')).map((f) => `tests/${f}`)], { encoding: 'utf8', shell: false });
const count = (k) => Number((run.stdout.match(new RegExp(`^# ${k} (\\d+)`, 'm')) || [])[1] || 0);
const tests = { summary: `${count('pass')} of ${count('tests')} passing`, tests: count('tests'), pass: count('pass'), fail: count('fail') };
writeFileSync('evidence/tests.json', JSON.stringify(tests, null, 2) + '\n');

const set = JSON.parse(readFileSync('eval/messages.json', 'utf8'));
const score = (m) => ({ ...m, ...(({ score, level, scamType }) => ({ score, level, scamType }))(analyze(m.text)) });
const scam = set.scam.map(score);
const genuine = set.genuine.map(score);
const pct = (a, b) => `${a} of ${b}`;

const caught = scam.filter((m) => m.level === 'high');
const flagged = scam.filter((m) => m.level !== 'low');
const typed = caught.filter((m) => m.scamType === m.type);
const falseHigh = genuine.filter((m) => m.level === 'high');
const falseAny = genuine.filter((m) => m.level !== 'low');

const result = {
  set: 'eval/messages.json',
  note: set.description,
  scam: {
    total: scam.length,
    high: pct(caught.length, scam.length),
    suspiciousOrHigh: pct(flagged.length, scam.length),
    typeCorrectWhenHigh: pct(typed.length, caught.length),
    missed: scam.filter((m) => m.level === 'low').map(({ text, score }) => ({ score, text })),
    wrongType: caught.filter((m) => m.scamType !== m.type).map(({ type, scamType, text }) => ({ expected: type, got: scamType, text })),
  },
  genuine: {
    total: genuine.length,
    flaggedHigh: pct(falseHigh.length, genuine.length),
    flaggedSuspiciousOrHigh: pct(falseAny.length, genuine.length),
    flagged: falseAny.map(({ level, score, text }) => ({ level, score, text })),
  },
};
writeFileSync('evidence/eval.json', JSON.stringify(result, null, 2) + '\n');

console.log(`tests: ${tests.summary}`);
console.log(`scams: high ${result.scam.high}, suspicious or high ${result.scam.suspiciousOrHigh}, type correct ${result.scam.typeCorrectWhenHigh}`);
console.log(`genuine: flagged high ${result.genuine.flaggedHigh}, suspicious or high ${result.genuine.flaggedSuspiciousOrHigh}`);
if (tests.fail) process.exit(1);
