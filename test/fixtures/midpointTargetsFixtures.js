const SYNTHETIC_PLANETS = Object.freeze([
  planet('sun', 'Солнце', 'Sun', 10),
  planet('moon', 'Луна', 'Moon', 40),
  planet('mercury', 'Меркурий', 'Mercury', 70),
  planet('venus', 'Венера', 'Venus', 100),
  planet('mars', 'Марс', 'Mars', 130),
  planet('jupiter', 'Юпитер', 'Jupiter', 160),
  planet('saturn', 'Сатурн', 'Saturn', 190),
  planet('uranus', 'Уран', 'Uranus', 220),
  planet('neptune', 'Нептун', 'Neptune', 250),
  planet('pluto', 'Плутон', 'Pluto', 280),
]);

export const SYNTHETIC_MIDPOINT_NATAL_PLANETS_RESULT = Object.freeze({
  status: 'ready',
  planets: SYNTHETIC_PLANETS,
  formattedPlanets: Object.freeze([]),
  source: 'synthetic-test-fixture',
});

export const MIDPOINT_TARGETS_FIXTURES = Object.freeze([
  {
    id: 'natal-planets-ready',
    categories: Object.freeze(['natalPlanets']),
    input: Object.freeze({
      natalPlanetsResult: SYNTHETIC_MIDPOINT_NATAL_PLANETS_RESULT,
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      status: 'ready',
      targetSet: 'natal-planets',
      count: 10,
      order: Object.freeze([
        'sun',
        'moon',
        'mercury',
        'venus',
        'mars',
        'jupiter',
        'saturn',
        'uranus',
        'neptune',
        'pluto',
      ]),
    }),
  },
  {
    id: 'pair-definitions-ready',
    categories: Object.freeze(['pairDefinitions']),
    input: Object.freeze({
      targets: SYNTHETIC_PLANETS,
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      status: 'ready',
      targetCount: 10,
      pairCount: 45,
      firstPairKey: 'sun-moon',
      secondPairKey: 'sun-mercury',
      lastPairKey: 'neptune-pluto',
      calculationStatus: 'pendingMidpointEngine',
      midpointLongitudePresent: false,
    }),
  },
  {
    id: 'deferred-targets-metadata-only',
    categories: Object.freeze(['deferredTargets']),
    expected: Object.freeze({
      manuallyDeclared: true,
      deferredTargetSets: Object.freeze([
        'angles',
        'house-cusps',
        'lunar-nodes',
        'lilith',
        'selena',
        'pars-fortuna',
        'lot-of-spirit',
        'vronsky-arabic-points',
        'fixed-stars',
        'custom-points',
      ]),
      deferredTargetsInOutput: false,
    }),
  },
  {
    id: 'invalid-angle-target',
    categories: Object.freeze(['invalid']),
    input: Object.freeze({
      target: Object.freeze({
        key: 'asc',
        label: 'ASC',
        longitude: 42,
      }),
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      normalized: null,
    }),
  },
  {
    id: 'profile-fallback',
    categories: Object.freeze(['profile']),
    expected: Object.freeze({
      manuallyDeclared: true,
      noProfileStatus: 'notReady',
      unknownTimeStatus: 'notReady',
    }),
  },
  {
    id: 'privacy',
    categories: Object.freeze(['privacy']),
    expected: Object.freeze({
      manuallyDeclared: true,
      rawBirthDataExposed: false,
      rawGeoValuesExposed: false,
      fullPrivateJsonExposed: false,
      providerDataExposed: false,
    }),
  },
  {
    id: 'strict-exclusions',
    categories: Object.freeze(['strictExclusions']),
    expected: Object.freeze({
      manuallyDeclared: true,
      midpointEngine: false,
      antisciaEngine: false,
      display: false,
      ui: false,
      debug: false,
      interpretations: false,
    }),
  },
]);

export function getMidpointTargetsFixture(id) {
  return MIDPOINT_TARGETS_FIXTURES.find((fixture) => fixture.id === id) ?? null;
}

export function getMidpointTargetsFixtureIds() {
  return MIDPOINT_TARGETS_FIXTURES.map((fixture) => fixture.id);
}

export function getMidpointTargetsFixtureCategories() {
  return [
    ...new Set(
      MIDPOINT_TARGETS_FIXTURES
        .flatMap((fixture) => fixture.categories ?? [fixture.category])
        .filter(Boolean),
    ),
  ];
}

function planet(key, label, labelEn, longitude) {
  return Object.freeze({
    key,
    label,
    labelEn,
    longitude,
    source: 'synthetic-natal-planets',
  });
}
