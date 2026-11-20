## What does this change?

<!-- One or two sentences. Link the issue if there is one: "Fixes #12". -->

## Type

- [ ] New or improved detection rule
- [ ] Bug fix
- [ ] UI / accessibility
- [ ] Docs

## Checklist

- [ ] `npm test` passes
- [ ] New detection logic has a test (a scam it catches **and** a genuine message it must not flag)
- [ ] User-facing text is added in **both** English and Hindi (`public/src/i18n.js` / `public/src/rules.js`)
- [ ] No real personal data (names, numbers, UPI IDs) in code, tests or screenshots
- [ ] If files under `public/` changed, `CACHE` in `public/sw.js` is bumped
