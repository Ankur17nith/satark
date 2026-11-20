# Contributing to Satark

Thanks for helping protect people from scams. The most valuable contributions are **new scam patterns** and **fixes for false alarms**, because scammers change their wording all the time.

## Quick start

Satark has no build step and no dependencies. You need Node.js 20+ (for tests) and Python 3 (or any static file server).

```bash
git clone https://github.com/Ankur17nith/satark.git
cd satark
npm start        # serves public/ at http://localhost:5173
npm test         # runs the test suite (node:test)
```

## Project layout

```
public/                 the deployable app (served as-is by GitHub Pages)
  index.html, styles.css, manifest.webmanifest, sw.js
  assets/               icons and social preview image
  src/
    engine.js           scoring, scam-type classification, highlight segments
    rules.js            red-flag signals, scam families, brand/official domains
    links.js            link, phone-number and UPI-ID extraction and checks
    i18n.js             all UI copy, scam explainers and advice (English + Hindi)
    share.js            WhatsApp warning text and complaint draft
    samples.js          example messages (fictional)
    app.js              UI wiring (DOM only, no detection logic)
tests/                  node:test suite (unit and contrast tests)
eval/messages.json      labelled evaluation set
evidence/               generated results (npm run evidence)
scripts/evidence.js     runs tests and the evaluation
docs/                   architecture, detection rules, decisions, deployment, privacy
```

Read [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) and [`docs/DETECTION.md`](docs/DETECTION.md) before changing detection.

## Adding or improving a detection rule

1. **Start from a real pattern**, with all personal data replaced by placeholders.
2. Add or extend a signal in `public/src/rules.js`: an `id`, a `weight`, one or more `patterns`, and an explanation in **both** `en` and `hi`.
   - Use `gi` flags. Don't use `\b` around Devanagari text, because JavaScript's `\b` only understands ASCII.
   - If the phrase is sometimes used *negatively* ("do **not** share your OTP"), guard it the way the `credentials` signal does with the `NEG` lookbehind.
3. If it's a new scam family, add it to `SCAM_TYPES` in `rules.js` **and** add its name, explanation and tips to `SCAM_INFO` in `public/src/i18n.js`.
4. **Add tests** in `tests/engine.test.js`:
   - a scam message the rule should catch, and
   - a genuine message that must **not** be flagged (the `ordinary messages are not flagged` test is the place).
5. Run `npm test`, then `npm run evidence` and commit the updated `evidence/` files (CI checks they are current). Don't add messages from `eval/messages.json` to the rules or tests: it is the held-out evaluation set.

Weights are deliberately simple: a strong, near-certain sign (asking for an OTP, remote-access apps) is 25–32; a pressure tactic (urgency, authority) is 10–18; a weak hint (generic greeting) is about 5. See [`docs/DETECTION.md`](docs/DETECTION.md#scoring).

## UI changes

- Keep every user-facing string in both languages in `i18n.js`.
- Keep WCAG AA contrast (4.5:1 for text). Colours are CSS custom properties at the top of `public/styles.css`, with dark-mode values below them.
- Build DOM with the `el()` helper in `app.js`. Never put user-supplied text into `innerHTML`.
- If you change any file in `public/`, bump `CACHE` in `public/sw.js` so installed apps pick up the new version.

## Pull requests

- One focused change per PR, with a clear description. The PR template has a short checklist.
- CI runs the tests on Node 20 and 22. Merges to `main` deploy to GitHub Pages automatically.

## Reporting a missed scam or a false alarm

Open an issue with the **Report a scam pattern** template. **Remove personal data first**: issues are public.

## Code of conduct

This project follows the [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you agree to uphold it.
