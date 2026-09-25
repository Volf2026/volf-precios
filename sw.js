/* Service worker de la consulta de precios VOLF.
   Deja la app funcionando sin internet. La lista de precios (.xlsx / .csv) nunca se guarda acá:
   siempre se pide al servidor.
   Si cambiás archivos de la app, subí el número de VERSION para que la tablet los renueve. */
const VERSION = 'volf-precios-1.1.0';
const IMG_CACHE = 'volf-precios-fotos';
const SHELL = [
  './', 'index.html', 'manifest.webmanifest', 'xlsx.core.min.js',
  'bodoni-moda-latin.woff2', 'bodoni-moda-latin-ext.woff2',
  'questrial-latin.woff2', 'questrial-latin-ext.woff2',
  'icon-192.png', 'icon-512.png', 'icon-maskable-512.png',
  'favicon-32.png', 'apple-touch-icon.png'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSION && k !== IMG_CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;               // fotos o listas externas: directo a la red
  if (/\.(xlsx|xlsm|xls|csv|json)$/i.test(url.pathname)) return;  // la lista y el índice de fotos, siempre frescos
  if (req.mode === 'navigate') { event.respondWith(page(req)); return; }
  if (req.destination === 'image' || /\/fotos\/[^/]+\.(jpe?g|png|webp)$/i.test(url.pathname)) { event.respondWith(photo(req)); return; }
  event.respondWith(caches.match(req, { ignoreSearch: true }).then(hit => hit || fetch(req)));
});

/* La app: primero la red (para tomar cambios), si tarda o no hay internet, la copia guardada */
async function page(req) {
  const cache = await caches.open(VERSION);
  try {
    const res = await Promise.race([
      fetch(req),
      new Promise((_, rej) => setTimeout(() => rej(new Error('lento')), 4000))
    ]);
    if (res && res.ok) cache.put('index.html', res.clone());
    return res;
  } catch (e) {
    return (await cache.match('index.html')) || (await cache.match('./')) || Response.error();
  }
}

/* Fotos del banco de imágenes (carpeta fotos/): se guardan para usarlas sin internet */
async function photo(req) {
  const hit = await caches.match(req);                          // íconos de la app o fotos ya guardadas
  if (hit) return hit;
  const cache = await caches.open(IMG_CACHE);
  const res = await fetch(req);
  if (res.ok) { await cache.put(req, res.clone()); trim(cache, 3000); }
  return res;
}
async function trim(cache, max) {
  const keys = await cache.keys();
  for (let i = 0; i < keys.length - max; i++) await cache.delete(keys[i]);
}
