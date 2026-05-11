const CACHE_NAME = 'lunar-calendar-v20';
const ASSETS = [
  './',
  'index.html',
  'manifest.webmanifest',
  'src/app.js',
  'src/astro.js',
  'src/format.js',
  'src/vocDisplay.js',
  'src/dayIndicators.js',
  'src/fieldQuality.js',
  'src/preciseEphemeris.js',
  'src/ephemeris-data.js',
  'src/styles.css',
  'icons/icon-192.svg',
  'icons/icon-512.svg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)),
    )),
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request)),
  );
});
