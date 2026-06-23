export const VRONSKY_ARABIC_PARTS_ENGINE_FIXTURES = Object.freeze([
  Object.freeze({
    id: 'day-ready-synthetic',
    category: 'dayReady',
    input: Object.freeze({
      asc: 100,
      sun: 10,
      moon: 40,
      mercury: 60,
      venus: 80,
      jupiter: 120,
      saturn: 150,
      uranus: 200,
      chartSect: 'day',
    }),
    expected: Object.freeze({
      status: 'ready',
      total: 12,
      readyCount: 12,
      notReadyCount: 0,
      longitudes: Object.freeze({
        'pars-amoris': 170,
        'pars-artis': 80,
        'pars-creationis': 300,
        'pars-fratrum-et-sororum': 70,
        'pars-hereditatis': 350,
        'pars-itineris': 120,
        'pars-liberorum': 130,
        'pars-matris': 60,
        'pars-patris': 320,
        'pars-pueri': 180,
        astrologia: 320,
        'pars-mercaturae': 150,
      }),
      manuallyDeclared: true,
    }),
  }),
  Object.freeze({
    id: 'night-not-ready',
    category: 'nightNotReady',
    input: Object.freeze({
      asc: 100,
      sun: 10,
      moon: 40,
      mercury: 60,
      venus: 80,
      jupiter: 120,
      saturn: 150,
      uranus: 200,
      chartSect: 'night',
    }),
    expected: Object.freeze({
      status: 'notReady',
      reason: 'vronskyNightFormulaNotVerified',
      readyCount: 0,
      notReadyCount: 12,
      manuallyDeclared: true,
    }),
  }),
  Object.freeze({
    id: 'boundary-not-ready',
    category: 'boundaryNotReady',
    input: Object.freeze({
      asc: 100,
      sun: 10,
      moon: 40,
      mercury: 60,
      venus: 80,
      jupiter: 120,
      saturn: 150,
      uranus: 200,
      chartSect: 'boundary',
    }),
    expected: Object.freeze({
      status: 'notReady',
      reason: 'chartSectBoundary',
      readyCount: 0,
      notReadyCount: 12,
      manuallyDeclared: true,
    }),
  }),
  Object.freeze({
    id: 'unknown-not-ready',
    category: 'unknownNotReady',
    input: Object.freeze({
      asc: 100,
      sun: 10,
      moon: 40,
      mercury: 60,
      venus: 80,
      jupiter: 120,
      saturn: 150,
      uranus: 200,
      chartSect: 'unknown',
    }),
    expected: Object.freeze({
      status: 'notReady',
      reason: 'chartSectNotReady',
      readyCount: 0,
      notReadyCount: 12,
      manuallyDeclared: true,
    }),
  }),
  Object.freeze({
    id: 'missing-uranus',
    category: 'missingInputs',
    input: Object.freeze({
      asc: 100,
      sun: 10,
      moon: 40,
      mercury: 60,
      venus: 80,
      jupiter: 120,
      saturn: 150,
      chartSect: 'day',
    }),
    expected: Object.freeze({
      status: 'partial',
      missingInputs: Object.freeze(['uranus']),
      notReadyKeys: Object.freeze(['pars-creationis', 'astrologia']),
      readyCount: 10,
      notReadyCount: 2,
      manuallyDeclared: true,
    }),
  }),
  Object.freeze({
    id: 'wrap-around',
    category: 'wrapAround',
    input: Object.freeze({
      asc: 350,
      sun: 40,
      moon: 10,
      mercury: 20,
      venus: 20,
      jupiter: 100,
      saturn: 130,
      uranus: 300,
      chartSect: 'day',
    }),
    expected: Object.freeze({
      longitudes: Object.freeze({
        'pars-amoris': 330,
        astrologia: 70,
      }),
      manuallyDeclared: true,
    }),
  }),
  Object.freeze({
    id: 'profile-readiness-policy',
    category: 'profile',
    expected: Object.freeze({
      usesProfileHelper: true,
      directProviderCall: false,
      uiIntegration: false,
      manuallyDeclared: true,
    }),
  }),
  Object.freeze({
    id: 'privacy-safe-engine-output',
    category: 'privacy',
    expected: Object.freeze({
      rawBirthDataExposed: false,
      rawTimeDataExposed: false,
      rawUtcDataExposed: false,
      rawZoneDataExposed: false,
      rawPlaceDataExposed: false,
      providerDataExposed: false,
      manuallyDeclared: true,
    }),
  }),
  Object.freeze({
    id: 'strict-exclusions',
    category: 'strictExclusions',
    expected: Object.freeze({
      uiChange: false,
      debugChange: false,
      displayChange: false,
      packageChange: false,
      swChange: false,
      interpretations: false,
      oldDeferredLotsActivated: false,
      nonVronskyFormulasUsed: false,
      manuallyDeclared: true,
    }),
  }),
]);

export function getVronskyArabicPartsEngineFixture(id) {
  return VRONSKY_ARABIC_PARTS_ENGINE_FIXTURES.find((fixture) => fixture.id === id) ?? null;
}

export function getVronskyArabicPartsEngineFixtureIds() {
  return VRONSKY_ARABIC_PARTS_ENGINE_FIXTURES.map((fixture) => fixture.id);
}

export function getVronskyArabicPartsEngineFixtureCategories() {
  return [...new Set(VRONSKY_ARABIC_PARTS_ENGINE_FIXTURES.map((fixture) => fixture.category))];
}
