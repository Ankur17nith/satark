# Deployment

Satark is a static site: the folder `public/` *is* the app. No build step is needed.

## GitHub Pages (the default)

Every push to `main` runs `.github/workflows/pages.yml`, which runs the tests and, if they pass, publishes `public/` to GitHub Pages.

**One-time setup** (repository owner):

1. Open the repository on GitHub → **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **GitHub Actions**.
3. Push to `main`, or run the workflow by hand: **Actions → Deploy to GitHub Pages → Run workflow**.

The site is published at **https://ankur17nith.github.io/satark/**.

## Other static hosts

Any static host works. Point it at `public/` with no build command:

| Host | Setting |
|---|---|
| Netlify | Publish directory: `public` |
| Vercel | Framework: Other · Output directory: `public` |
| Cloudflare Pages | Build output directory: `public` |

All paths are relative, so the app works at a domain root or under a sub-path.

## Releasing an update

1. Make your change and run `npm test`.
2. If anything in `public/` changed, bump `CACHE` in `public/sw.js` (e.g. `satark-v3` → `satark-v4`). Otherwise installed apps keep serving the old cached files.
3. Update `CHANGELOG.md` and the `version` in `package.json`.
4. Merge to `main`. Pages deploys automatically.
5. Optionally tag a release: `git tag v1.1.0 && git push --tags`.

## Social preview

`public/index.html` sets Open Graph and Twitter-card tags with an absolute image URL (`https://ankur17nith.github.io/satark/assets/og.png`). If you deploy somewhere else, update `og:image` and `og:url` to the new address.
