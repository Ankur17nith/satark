# Satark judge guide

The shortest route through the submission.

## Three-minute review

1. Watch the [demo video](docs/media/satark-demo.mp4) (2:38).
2. Open the live app: https://ankur17nith.github.io/satark/. Tap **Digital arrest**: it scores 95, names the scam and highlights every red flag. Tap **Genuine OTP**: it scores 0.
3. Switch to **हिं** at the top right and tap **Hindi message**. The interface and every explanation change to Hindi.
4. Paste your own message, for example: `Dear Customer, your account will be blocked today. Update KYC at http://sbi-verify-kyc.top`
5. Read the [Results](README.md#results) and [What didn't work](README.md#what-didnt-work) sections of the README, then [`evidence/eval.json`](evidence/eval.json).

## What to inspect

- **The red-flag list and highlighted message** on any result: every point of the score is tied to a phrase you can see.
- **The link card** on the *KYC / bank block* example: why `sbi-kyc-update.xyz` is unsafe, compared with an official domain such as `onlinesbi.sbi`.
- **Next steps** at the bottom of a result: the WhatsApp warning and the complaint draft (open "Complaint draft").
- **Privacy:** open the browser's network panel and check a message; no request is made.
- **Code:** [`public/src/engine.js`](public/src/engine.js) (about 130 lines) and [`public/src/rules.js`](public/src/rules.js). Every rule is documented in [`docs/DETECTION.md`](docs/DETECTION.md).
- **Tests and evidence:** `npm test` and `npm run evidence`. CI fails if `evidence/` is out of date.

## Rubric map

These labels do not pre-award points; judges keep full scoring authority.

| Round and criterion | What we did | Fastest proof |
|---|---|---|
| R1 · Problem relevance | Cyber fraud losses of ₹22,845 crore in 2024; digital-arrest cases tripled since 2022 | README "The problem" (MHA figures) |
| R1 · Innovation | Reads the wording of the message (not only links), explains each red flag, names the scam, works in Hindi, runs on-device | [`docs/hackathon/ROUND1.md`](docs/hackathon/ROUND1.md) |
| R1 · Feasibility | Static site, no dependencies, no running cost; built and deployed | Live app; [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) |
| R1 · Impact | Targets the moment of decision; Hindi support; WhatsApp warning spreads to family groups; complaint draft and 1930 prompt | README "What it does" |
| R2 · Technical implementation | Rule engine with 19 signals, 11 link checks, 5 combination rules, 10 scam families; PWA with offline support and share target | [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md), [`docs/DETECTION.md`](docs/DETECTION.md) |
| R2 · Functionality | 30 of 30 evaluation scams flagged; 0 of 30 genuine messages rated high | [`evidence/eval.json`](evidence/eval.json) |
| R2 · Usability | Plain-language verdict first; bilingual; WCAG AA contrast tested; keyboard and reduced-motion support | [`tests/contrast.test.js`](tests/contrast.test.js) |
| R2 · Code quality | Small pure modules, 14 tests, CI on Node 20 and 22, evidence check in CI | [`.github/workflows/ci.yml`](.github/workflows/ci.yml) |
| R3 · Presentation | Demo video following the pitch script; LinkedIn post | [`docs/hackathon/PITCH.md`](docs/hackathon/PITCH.md) |

## Known limits

See README [What didn't work](README.md#what-didnt-work) and [Honest scope](README.md#honest-scope). In short: the evaluation set is small and written by the author, 11 of 30 scams reach only "Suspicious", and a normal "Hi mom" message is flagged as suspicious.
