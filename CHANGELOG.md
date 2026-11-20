# Changelog

All notable changes to this project are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses [Semantic Versioning](https://semver.org/).

## [1.0.0] - 2026-11-20

First public release.

### Added

- On-device scam detection engine: 19 weighted red-flag signals plus one reassuring signal, 5 combination rules, and a classifier for 10 scam families common in India (digital arrest, fake KYC/bank block, task jobs, fake investment, lottery, UPI "wrong transfer", utility disconnection, fake delivery, loan apps, family impersonation).
- Link, phone-number and UPI-ID analysis: 11 link checks, including brand look-alike domains (with an allow-list of official domains for 27 brands), URL shorteners, raw IP addresses, punycode, risky domain endings, `.apk` downloads and fake government sites.
- Bilingual interface and explanations (English and Hindi), with detection of Hindi, Hinglish and English scam language.
- Highlighted red-flag phrases with a legend, a risk score (0–100) and plain-language verdict.
- Action steps: one-tap WhatsApp warning, copyable complaint draft for cybercrime.gov.in / 1930, and links to Sanchar Saathi (Chakshu).
- Installable PWA: offline support, and Web Share Target so messages can be shared into Satark on Android.
- Accessible UI meeting WCAG AA contrast, with full keyboard support, reduced-motion support and light/dark themes.
- Test suite (`node:test`, 14 tests) including WCAG AA contrast checks for both themes; CI on Node 20 and 22; automatic deployment to GitHub Pages.
- Evaluation set of 60 labelled messages (`eval/messages.json`) and `npm run evidence`, which writes `evidence/tests.json` and `evidence/eval.json`. CI fails if they are out of date.
- Judge guide (`JUDGES.md`), design decision log (`docs/decisions.md`), demo video and hackathon submission documents.

[1.0.0]: https://github.com/Ankur17nith/satark/releases/tag/v1.0.0
