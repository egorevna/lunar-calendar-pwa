export const MIDPOINTS_VALIDATION_ACTIVE_TARGET_KEYS = Object.freeze([
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
]);

export const MIDPOINTS_VALIDATION_DEFERRED_TARGET_SETS = Object.freeze([
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
]);

export const SYNTHETIC_MIDPOINT_VALIDATION_NO_OPPOSITION_RESULT = Object.freeze({
  status: 'ready',
  planets: Object.freeze([
    planet('sun', 'Солнце', 'Sun', 10),
    planet('moon', 'Луна', 'Moon', 43),
    planet('mercury', 'Меркурий', 'Mercury', 77),
    planet('venus', 'Венера', 'Venus', 111),
    planet('mars', 'Марс', 'Mars', 146),
    planet('jupiter', 'Юпитер', 'Jupiter', 182),
    planet('saturn', 'Сатурн', 'Saturn', 219),
    planet('uranus', 'Уран', 'Uranus', 258),
    planet('neptune', 'Нептун', 'Neptune', 296),
    planet('pluto', 'Плутон', 'Pluto', 336),
  ]),
  formattedPlanets: Object.freeze([]),
  source: 'synthetic-midpoints-validation-no-opposition',
});

export const SYNTHETIC_MIDPOINT_VALIDATION_WITH_OPPOSITION_RESULT = Object.freeze({
  status: 'ready',
  planets: Object.freeze([
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
  ]),
  formattedPlanets: Object.freeze([]),
  source: 'synthetic-midpoints-validation-with-opposition',
});

export const MIDPOINTS_VALIDATION_FIXTURES = Object.freeze([
  {
    id: 'source-policy',
    categories: Object.freeze(['sourcePolicy']),
    expected: Object.freeze({
      manuallyDeclared: true,
      sourceKey: 'midpoint-shortest-arc',
      formula: 'shortest-arc-midpoint',
      coordinateSystem: 'tropical-ecliptic-longitude',
      exactOppositionPolicy: 'axis-ambiguous',
    }),
  },
  {
    id: 'target-scope',
    categories: Object.freeze(['targetScope']),
    expected: Object.freeze({
      manuallyDeclared: true,
      activeTargetSet: 'natal-planets',
      activeTargetKeys: MIDPOINTS_VALIDATION_ACTIVE_TARGET_KEYS,
      activeTargetCount: 10,
      deferredTargetSets: MIDPOINTS_VALIDATION_DEFERRED_TARGET_SETS,
    }),
  },
  {
    id: 'pair-definitions',
    categories: Object.freeze(['pairDefinitions']),
    expected: Object.freeze({
      manuallyDeclared: true,
      pairCount: 45,
      firstPair: 'sun-moon',
      secondPair: 'sun-mercury',
      lastPair: 'neptune-pluto',
      unorderedUnique: true,
      selfPairs: false,
      reversedDuplicates: false,
      calculatedFields: false,
      fullTargetObjects: false,
    }),
  },
  {
    id: 'formula-cases',
    categories: Object.freeze(['midpointFormula', 'wrapAround']),
    expected: Object.freeze({
      manuallyDeclared: true,
      cases: Object.freeze([
        formulaCase(10, 30, 20),
        formulaCase(30, 10, 20),
        formulaCase(350, 10, 0),
        formulaCase(10, 350, 0),
        formulaCase(359, 1, 0),
        formulaCase(1, 359, 0),
      ]),
    }),
  },
  {
    id: 'wrap-around-policy',
    categories: Object.freeze(['wrapAround']),
    expected: Object.freeze({
      manuallyDeclared: true,
      normalizedZeroAriesMidpoint: 0,
      examples: Object.freeze([
        '350/10',
        '10/350',
        '359/1',
        '1/359',
      ]),
    }),
  },
  {
    id: 'exact-opposition',
    categories: Object.freeze(['exactOpposition']),
    expected: Object.freeze({
      manuallyDeclared: true,
      cases: Object.freeze([
        exactOppositionCase(90, 270, [180, 0]),
        exactOppositionCase(0, 180, [90, 270]),
      ]),
    }),
  },
  {
    id: 'batch-no-opposition',
    categories: Object.freeze(['batchNoOpposition', 'batch']),
    input: Object.freeze({
      natalPlanetsResult: SYNTHETIC_MIDPOINT_VALIDATION_NO_OPPOSITION_RESULT,
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      status: 'ready',
      targetCount: 10,
      pairCount: 45,
      readyCount: 45,
      ambiguousCount: 0,
      firstKey: 'sun-moon',
      firstLongitude: 26.5,
      lastKey: 'neptune-pluto',
      lastLongitude: 316,
    }),
  },
  {
    id: 'batch-with-opposition',
    categories: Object.freeze(['batchWithOpposition', 'batch', 'exactOpposition']),
    input: Object.freeze({
      natalPlanetsResult: SYNTHETIC_MIDPOINT_VALIDATION_WITH_OPPOSITION_RESULT,
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      status: 'partial',
      targetCount: 10,
      pairCount: 45,
      readyCount: 41,
      ambiguousCount: 4,
      ambiguousKeys: Object.freeze([
        'sun-saturn',
        'moon-uranus',
        'mercury-neptune',
        'venus-pluto',
      ]),
    }),
  },
  {
    id: 'deferred-scopes',
    categories: Object.freeze(['deferredScopes']),
    expected: Object.freeze({
      manuallyDeclared: true,
      deferredTargetSets: MIDPOINTS_VALIDATION_DEFERRED_TARGET_SETS,
      notActiveTargetKeys: Object.freeze([
        'asc',
        'mc',
        'dsc',
        'ic',
        'house-cusp-1',
        'north-node',
        'lilith',
        'selena',
        'pars-fortuna',
        'lot-of-spirit',
        'fixed-star',
      ]),
      midpointContacts: false,
      midpointPictures: false,
      transits: false,
      progressions: false,
      interpretations: false,
    }),
  },
  {
    id: 'privacy',
    categories: Object.freeze(['privacy']),
    expected: Object.freeze({
      manuallyDeclared: true,
      rawPersonalDataExposed: false,
      rawGeoDataExposed: false,
      externalPayloadExposed: false,
      interpretiveText: false,
    }),
  },
  {
    id: 'strict-exclusions',
    categories: Object.freeze(['strictExclusions']),
    expected: Object.freeze({
      manuallyDeclared: true,
      antiscia: false,
      contraAntiscia: false,
      midpointContacts: false,
      midpointPictures: false,
      transits: false,
      progressions: false,
      display: false,
      ui: false,
      debug: false,
      interpretations: false,
    }),
  },
]);

export function getMidpointsValidationFixture(id) {
  return MIDPOINTS_VALIDATION_FIXTURES.find((fixture) => fixture.id === id) ?? null;
}

export function getMidpointsValidationFixtureIds() {
  return MIDPOINTS_VALIDATION_FIXTURES.map((fixture) => fixture.id);
}

export function getMidpointsValidationFixtureCategories() {
  return [
    ...new Set(
      MIDPOINTS_VALIDATION_FIXTURES
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
    source: 'synthetic-midpoints-validation',
  });
}

function formulaCase(longitudeA, longitudeB, midpoint) {
  return Object.freeze({
    longitudeA,
    longitudeB,
    midpoint,
  });
}

function exactOppositionCase(longitudeA, longitudeB, candidateAxisPoints) {
  return Object.freeze({
    longitudeA,
    longitudeB,
    candidateAxisPoints: Object.freeze(candidateAxisPoints),
  });
}
