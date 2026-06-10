const SYNTHETIC_PLANETS = Object.freeze([
  planet('sun', 'Солнце', 'Sun', 0),
  planet('moon', 'Луна', 'Moon', 30.5),
  planet('mercury', 'Меркурий', 'Mercury', 61),
  planet('venus', 'Венера', 'Venus', 92.25),
  planet('mars', 'Марс', 'Mars', 123.5),
  planet('jupiter', 'Юпитер', 'Jupiter', 154.75),
  planet('saturn', 'Сатурн', 'Saturn', 186),
  planet('uranus', 'Уран', 'Uranus', 217.25),
  planet('neptune', 'Нептун', 'Neptune', 248.5),
  planet('pluto', 'Плутон', 'Pluto', 279.75),
]);

const SYNTHETIC_ANGLES = Object.freeze({
  asc: angle('asc', 'ASC', 'Ascendant', 314.7913888889),
  mc: angle('mc', 'MC', 'Midheaven', 254.2119444444),
  dsc: angle('dsc', 'DSC', 'Descendant', 134.7913888889),
  ic: angle('ic', 'IC', 'Imum Coeli', 74.2119444444),
});

export const SYNTHETIC_NATAL_PLANETS_RESULT = Object.freeze({
  status: 'ready',
  planets: SYNTHETIC_PLANETS,
  formattedPlanets: Object.freeze([]),
  source: 'synthetic-test-fixture',
});

export const SYNTHETIC_ASC_MC_RESULT = Object.freeze({
  status: 'ready',
  ready: true,
  method: 'synthetic-fixture',
  angles: SYNTHETIC_ANGLES,
});

export const FIXED_STAR_TARGETS_FIXTURES = Object.freeze([
  {
    id: 'natal-planets-ready',
    categories: Object.freeze(['natalPlanets']),
    input: Object.freeze({ natalPlanetsResult: SYNTHETIC_NATAL_PLANETS_RESULT }),
    expected: Object.freeze({
      manuallyDeclared: true,
      status: 'ready',
      targetSet: 'natal-planets',
      category: 'natal-planet',
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
    id: 'angles-ready',
    categories: Object.freeze(['angles']),
    input: Object.freeze({ ascMcResult: SYNTHETIC_ASC_MC_RESULT }),
    expected: Object.freeze({
      manuallyDeclared: true,
      status: 'ready',
      targetSet: 'angles',
      category: 'angle',
      count: 4,
      order: Object.freeze(['asc', 'mc', 'dsc', 'ic']),
    }),
  },
  {
    id: 'combined-ready',
    categories: Object.freeze(['combined']),
    input: Object.freeze({
      natalPlanetsResult: SYNTHETIC_NATAL_PLANETS_RESULT,
      ascMcResult: SYNTHETIC_ASC_MC_RESULT,
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      status: 'ready',
      total: 14,
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
        'asc',
        'mc',
        'dsc',
        'ic',
      ]),
    }),
  },
  {
    id: 'partial-planets-ready-angles-missing',
    categories: Object.freeze(['partial']),
    input: Object.freeze({
      natalPlanetsResult: SYNTHETIC_NATAL_PLANETS_RESULT,
      ascMcResult: Object.freeze({
        status: 'notReady',
        ready: false,
        reason: 'cityWithoutCoordinates',
        angles: null,
      }),
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      status: 'partial',
      total: 10,
      readyCount: 10,
      missingTargetSet: 'angles',
      missingReason: 'cityWithoutCoordinates',
    }),
  },
  {
    id: 'not-ready-empty',
    categories: Object.freeze(['invalid']),
    input: Object.freeze({
      natalPlanetsResult: Object.freeze({ status: 'incomplete', planets: [] }),
      ascMcResult: Object.freeze({ status: 'notReady', ready: false, reason: 'missingExactTime' }),
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      status: 'notReady',
      reason: 'fixedStarTargetsNotReady',
      total: 0,
    }),
  },
  {
    id: 'invalid-target-missing-longitude',
    categories: Object.freeze(['invalid']),
    input: Object.freeze({
      target: Object.freeze({
        key: 'venus',
        label: 'Венера',
        targetSet: 'natal-planets',
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
      missingCoordinatesMayBePartial: true,
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
      fixedStarPositionEngine: false,
      conjunctionEngine: false,
      display: false,
      ui: false,
      debug: false,
      readingsAdded: false,
      deferredTargetsActivated: false,
    }),
  },
]);

export function getFixedStarTargetsFixture(id) {
  return FIXED_STAR_TARGETS_FIXTURES.find((fixture) => fixture.id === id) ?? null;
}

export function getFixedStarTargetsFixtureIds() {
  return FIXED_STAR_TARGETS_FIXTURES.map((fixture) => fixture.id);
}

export function getFixedStarTargetsFixtureCategories() {
  return [
    ...new Set(
      FIXED_STAR_TARGETS_FIXTURES
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

function angle(key, label, labelEn, longitude) {
  return Object.freeze({
    key,
    label,
    labelEn,
    longitude,
  });
}
