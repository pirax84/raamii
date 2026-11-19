/* Hors ligne : l'appli marche sans internet. Les pages sont mises à jour en arrière-plan à chaque ouverture. */
const V = 'raamii-v1.1.0';
const FILES = ['./', 'index.html', 'manifest.json', 'css/style.css', 'js/cards.js', 'js/rules.js', 'js/ai.js', 'js/game.js', 'js/strings.js', 'js/store.js', 'js/vendor/supabase.js', 'js/config.js', 'js/cloud.js', 'js/shop.js', 'js/audio.js', 'js/media.js', 'js/cardview.js', 'js/ui.js', 'js/app.js', 'assets/icon.svg', 'assets/logo.svg', 'assets/icon-192.png', 'assets/apple-touch-icon.png', 'assets/icon-512.png', 'assets/icon-maskable-512.png', 'assets/screen-portrait.png', 'assets/screen-wide.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(V).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== V).map(x => caches.delete(x)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.open(V).then(c => c.match(e.request, { ignoreSearch: true }).then(hit => {
    const net = fetch(e.request).then(r => { if (r && r.ok) c.put(e.request, r.clone()); return r; }).catch(() => hit);
    return hit || net;
  })));
});
