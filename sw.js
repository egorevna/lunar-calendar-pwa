const CACHE_NAME = 'lunar-calendar-v98';
const ASSETS = [
  './',
  'index.html',
  'manifest.webmanifest',
  'src/app.js',
  'src/astro.js',
  'src/moonPhase.js',
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
  'src/birthDateTime.js',
  'src/vendor/luxon.mjs',
  'src/vendor/astronomy-engine.mjs',
  'src/natalPlanetsForProfile.js',
  'src/natalPlanetDisplay.js',
  'src/astronomyEngineProvider.js',
  'src/personalProfileInput.js',
  'src/natalPlanetsDebug.js',
  'src/natalAspectsForProfile.js',
  'src/natalAspectsDebug.js',
  'src/essentialDignitiesDebug.js',
  'src/natalAspectEngine.js',
  'src/natalAspectDisplay.js',
  'src/essentialDignitiesForProfile.js',
  'src/essentialDignityDisplay.js',
  'src/essentialDignities.js',
  'src/essentialDignitiesData.js',
  'src/detailedDignitiesForProfile.js',
  'src/detailedDignitiesDebug.js',
  'src/detailedDignityDisplay.js',
  'src/housesForProfile.js',
  'src/housesDebug.js',
  'src/housesDisplay.js',
  'src/arabicPartsForProfile.js',
  'src/vronskyArabicPartsForProfile.js',
  'src/vronskyArabicPartsDebug.js',
  'src/arabicPartsDebug.js',
  'src/arabicPartsDisplay.js',
  'src/arabicPartsHouseAssignment.js',
  'src/arabicParts.js',
  'src/arabicPartsData.js',
  'src/parsFortuna.js',
  'src/dayNightChart.js',
  'src/specialPointsForProfile.js',
  'src/specialPointsDebug.js',
  'src/specialPointsDisplay.js',
  'src/fixedStarConjunctions.js',
  'src/fixedStarsDebug.js',
  'src/fixedStarsDisplay.js',
  'src/fixedStarPositions.js',
  'src/fixedStarTargets.js',
  'src/fixedStarsData.js',
  'src/lunarNodesHouseAssignment.js',
  'src/lunarNodes.js',
  'src/lilith.js',
  'src/selena.js',
  'src/houseCusps.js',
  'src/planetInHouses.js',
  'src/houseSystemResolver.js',
  'src/wholeSignHouses.js',
  'src/equalHouseHouses.js',
  'src/placidusHouses.js',
  'src/ascMc.js',
  'src/housesInputGuardrails.js',
  'src/terms.js',
  'src/termsData.js',
  'src/decans.js',
  'src/decansData.js',
  'src/degreeRulersStarOfMagi.js',
  'src/degreeRulersStarOfMagiData.js',
  'src/degreeRulersVronsky.js',
  'src/degreeRulersVronskyData.js',
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
    caches.match(event.request).then((cached) => cached || fetch(event.request).then((response) => {
      // Safety net: cache any same-origin file that was not in ASSETS so the
      // installed PWA keeps working offline even if the precache list lags behind.
      const isSameOrigin = new URL(event.request.url).origin === self.location.origin;
      if (response.ok && isSameOrigin) {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
      }
      return response;
    })),
  );
});
