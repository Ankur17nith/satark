# Security Policy

## Supported versions

Only the latest version on `main` (deployed at https://ankur17nith.github.io/satark/) is supported.

## Reporting a vulnerability

**Please do not open a public issue for security problems.**

Report privately through GitHub: **Security → Report a vulnerability** on this repository ([direct link](https://github.com/Ankur17nith/satark/security/advisories/new)). Include steps to reproduce and the impact. You can expect an acknowledgement within 7 days.

In scope, for example:

- Cross-site scripting: any way a pasted message, link or `?text=` parameter can execute script or inject markup.
- Anything that sends a user's pasted message off the device.
- Service-worker or caching issues that could serve tampered content.

## Detection bypasses are not vulnerabilities

A scam message that Satark scores too low is a detection gap, not a security vulnerability. Please report it publicly with the **Report a scam pattern** issue template (after removing personal data) so the rules can be improved quickly.

## Design notes

- All analysis runs in the browser. There is no backend, no analytics and no third-party scripts. The only external requests are for Google Fonts.
- User text is rendered with `textContent` only, never `innerHTML`.
- See [`docs/PRIVACY.md`](docs/PRIVACY.md) for exactly what is stored on the device.
