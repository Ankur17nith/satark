# Architecture

Satark is a static, dependency-free web app. Everything (detection, rendering, sharing) runs in the user's browser. There is no server, database, API key or build step.

## Design goals

| Goal | Consequence |
|---|---|
| **Private**: people paste personal messages | Analysis is on-device. Nothing is uploaded or logged. |
| **Explainable**: users must understand *why* | A transparent, rule-based engine instead of a black-box model. Every point of the score maps to a highlighted phrase. |
| **Reaches everyone**: cheap phones, patchy networks, Hindi speakers | Plain ES modules (about 90 KB of code, uncompressed), offline-capable PWA, bilingual UI. |
| **Free to run at any scale** | Static hosting (GitHub Pages). |

## Module map

```
public/src/
  app.js ──────► engine.js ──────► rules.js
     │              │                 ▲
     │              └─────► links.js ─┘
     ├────► share.js ────► i18n.js
     ├────► i18n.js
     └────► samples.js
```

| Module | Responsibility | DOM? |
|---|---|---|
| `engine.js` | `analyze(text)`: runs signals, link analysis and combo rules, computes score, level and scam type, and returns highlight segments. | No |
| `rules.js` | Data: red-flag `SIGNALS`, `SCAM_TYPES`, `BRANDS` → official domains, shorteners, risky TLDs, UPI handles. | No |
| `links.js` | Extracts URLs, phone numbers and UPI IDs; `analyzeUrl()` runs the 11 link checks. | No |
| `i18n.js` | All copy in English and Hindi: UI strings, scam explainers, link-flag text, action steps. | No |
| `share.js` | Builds the WhatsApp warning and the complaint draft from an analysis result. | No |
| `samples.js` | Fictional example messages shown as "Try an example". | No |
| `app.js` | UI wiring: input, rendering results, language toggle, clipboard, share target, service worker registration. | Yes |

`engine.js`, `rules.js`, `links.js`, `share.js` and `i18n.js` are pure and run unchanged in Node, which is how `tests/engine.test.js` exercises them.

## Data flow

```
pasted text
  → normalise (curly quotes, nbsp; same length, so indices stay valid)
  → SIGNALS: regex matches → weights + spans
  → extractLinks: URLs (11 checks), phone numbers (foreign?), UPI IDs
  → COMBOS: bonus when dangerous signals co-occur
  → score = 100·(1 − e^(−raw/45)) → level (low / suspicious / high)
  → classify → scam family (only when not low)
  → segment(): merge overlapping spans into highlighted text segments
  → app.js renders verdict, scam explainer, red flags, highlighted message,
    links/numbers, action steps, WhatsApp warning, complaint draft
```

See [DETECTION.md](DETECTION.md) for the rules and scoring in detail.

## Rendering and security

- The result view is built with a small `el()` helper using `textContent`. User input never reaches `innerHTML`.
- The only `innerHTML` use is the constant SVG icon markup in `icon()`.
- Shared text arrives via `?text=`, `?title=` or `?url=` (Web Share Target), is placed in the textarea and analysed like pasted text, and is then removed from the address bar with `history.replaceState`.

## Offline and install (PWA)

- `public/sw.js` pre-caches the app shell and serves it cache-first, refreshing the cache in the background. Bump `CACHE` whenever a file in `public/` changes.
- `public/manifest.webmanifest` makes the app installable and registers a **share target**, so on Android "Share → Satark" from WhatsApp or SMS opens the app with the message already filled in.

## Hosting

`public/` is deployed as-is to GitHub Pages by `.github/workflows/pages.yml` after the tests pass. All asset paths are relative, so the app works at any sub-path (e.g. `/satark/`). See [DEPLOYMENT.md](DEPLOYMENT.md).
