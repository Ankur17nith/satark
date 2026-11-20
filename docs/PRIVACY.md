# Privacy

**Short version: what you paste into Satark never leaves your device.**

## What Satark processes

The text you paste, type or share into the app is analysed by JavaScript running in your browser. It is **not** sent to any server, API or analytics service. Satark has no backend.

## What is stored on your device

| What | Where | Why |
|---|---|---|
| Your language choice (`en` / `hi`) | `localStorage` key `satark-lang` | So the app opens in your language next time |
| The app's own files | Service-worker cache (`satark-v*`) | So the app loads fast and works offline |

Your messages and results are **not** stored. They disappear when you close or clear the page.

## Network requests

| Request | When |
|---|---|
| The app's own files from the hosting site (GitHub Pages) | First visit and updates |
| Fonts from Google Fonts (`fonts.googleapis.com`, `fonts.gstatic.com`) | First visit. Without them the app falls back to system fonts. |

There are no cookies, trackers, ads or third-party scripts.

## Actions you choose to take

- **Warn family on WhatsApp** opens WhatsApp with a pre-filled warning that includes a short preview of the message. Nothing is sent until you press send in WhatsApp.
- **Copy complaint draft** copies text to your clipboard for you to paste on cybercrime.gov.in.
- Links to cybercrime.gov.in, Sanchar Saathi and the 1930 helpline open those official services directly.

## Contact

Questions or concerns: open an issue at https://github.com/Ankur17nith/satark/issues, or report security problems privately as described in [SECURITY.md](../SECURITY.md).
