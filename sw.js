// Cache-first; bump CACHE whenever a file in public/ changes.
const CACHE = 'satark-v6';
const ASSETS = [
  './', './index.html', './styles.css', './manifest.webmanifest', './assets/icon.svg',
  './src/app.js', './src/engine.js', './src/rules.js', './src/links.js', './src/i18n.js', './src/samples.js', './src/share.js',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys()
    .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  // Share-target and deep links carry a query string; serve the shell for them.
  const key = url.pathname.endsWith('/') ? './' : e.request;
  e.respondWith(caches.match(key, { ignoreSearch: true }).then((hit) => {
    const fresh = fetch(e.request).then((res) => {
      if (res.ok) {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(key, copy));
      }
      return res;
    }).catch(() => hit);
    return hit || fresh;
  }));
});
