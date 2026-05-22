const CACHE_NAME = 'lunar-calendar-v60';
const ASSETS = [
  './',
  'index.html',
  'manifest.webmanifest',
  'src/app.js',
  'src/astro.js',
  'src/bestWindows.js',
  'src/format.js',
  'src/vocDisplay.js',
  'src/moonAspectsDisplay.js',
  'src/moonPrecisionDisplay.js',
  'src/moonSignDisplay.js',
  'src/modeScores.js',
  'src/modeRecommendations.js',
  'src/planetaryHourHints.js',
  'src/profileModel.js',
  'src/profileStorage.js',
  'src/profileUi.js',
  'src/profileImportExport.js',
  'src/personalContext.js',
  'src/personalRecommendations.js',
  'src/astroMath.js',
  'src/natalChartModel.js',
  'src/natalEngine.js',
  'src/planetaryPositionProvider.js',
  'src/dayIndicators.js',
  'src/debugDate.js',
  'src/debugPanel.js',
  'src/natalProviderValidationSummary.js',
  'src/dashboardModes.js',
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
