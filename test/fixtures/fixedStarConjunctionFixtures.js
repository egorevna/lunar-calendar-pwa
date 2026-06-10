const SYNTHETIC_POSITIONS = Object.freeze([
  star('regulus', 'Регул', 'Regulus', 150),
  star('spica', 'Спика', 'Spica', 200),
  star('antares', 'Антарес', 'Antares', 359.8),
]);

const SYNTHETIC_TARGETS = Object.freeze([
  target('asc', 'ASC', 'Ascendant', 'angle', 150.5),
  target('sun', 'Солнце', 'Sun', 'natal-planet', 200.2),
  target('moon', 'Луна', 'Moon', 'natal-planet', 0.1),
]);

export const SYNTHETIC_FIXED_STAR_POSITIONS_RESULT = Object.freeze({
  status: 'ready',
  ready: true,
  total: SYNTHETIC_POSITIONS.length,
  readyCount: SYNTHETIC_POSITIONS.length,
  invalidCount: 0,
  positions: SYNTHETIC_POSITIONS,
});

export const SYNTHETIC_FIXED_STAR_TARGETS_RESULT = Object.freeze({
  status: 'ready',
  ready: true,
  total: SYNTHETIC_TARGETS.length,
  readyCount: SYNTHETIC_TARGETS.length,
  invalidCount: 0,
  targetSets: Object.freeze(['angles', 'natal-planets']),
  missingTargetSets: Object.freeze([]),
  targets: SYNTHETIC_TARGETS,
});

export const FIXED_STAR_CONJUNCTION_FIXTURES = Object.freeze([
  {
    id: 'exact-conjunction',
    categories: Object.freeze(['exactConjunction']),
    input: Object.freeze({
      starPosition: star('regulus', 'Регул', 'Regulus', 150),
      target: target('asc', 'ASC', 'Ascendant', 'angle', 150),
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      hit: true,
      distanceDegrees: 0,
      boundary: false,
    }),
  },
  {
    id: 'inside-orb',
    categories: Object.freeze(['insideOrb']),
    input: Object.freeze({
      starPosition: star('regulus', 'Регул', 'Regulus', 150),
      target: target('asc', 'ASC', 'Ascendant', 'angle', 150.5),
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      hit: true,
      distanceDegrees: 0.5,
      orbText: '0°30′00″',
      boundary: false,
    }),
  },
  {
    id: 'boundary-orb',
    categories: Object.freeze(['boundaryOrb']),
    input: Object.freeze({
      starPosition: star('regulus', 'Регул', 'Regulus', 150),
      target: target('asc', 'ASC', 'Ascendant', 'angle', 151),
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      hit: true,
      distanceDegrees: 1,
      orbText: '1°00′00″',
      boundary: true,
    }),
  },
  {
    id: 'outside-orb',
    categories: Object.freeze(['outsideOrb']),
    input: Object.freeze({
      starPosition: star('regulus', 'Регул', 'Regulus', 150),
      target: target('asc', 'ASC', 'Ascendant', 'angle', 151.0001),
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      hit: false,
      distanceDegrees: 1.0001,
      reason: 'outsideOrb',
    }),
  },
  {
    id: 'wrap-around-hit',
    categories: Object.freeze(['wrapAround']),
    input: Object.freeze({
      starPosition: star('antares', 'Антарес', 'Antares', 359.8),
      target: target('moon', 'Луна', 'Moon', 'natal-planet', 0.1),
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      hit: true,
      distanceDegrees: 0.3,
      orbText: '0°18′00″',
    }),
  },
  {
    id: 'wrap-around-no-hit',
    categories: Object.freeze(['wrapAround', 'outsideOrb']),
    input: Object.freeze({
      starPosition: star('antares', 'Антарес', 'Antares', 1.2),
      target: target('moon', 'Луна', 'Moon', 'natal-planet', 359.9),
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      hit: false,
      distanceDegrees: 1.3,
      reason: 'outsideOrb',
    }),
  },
  {
    id: 'ready-with-no-hits',
    categories: Object.freeze(['noHits']),
    input: Object.freeze({
      positionsResult: Object.freeze({
        status: 'ready',
        ready: true,
        positions: Object.freeze([star('regulus', 'Регул', 'Regulus', 150)]),
      }),
      targetsResult: Object.freeze({
        status: 'ready',
        ready: true,
        targets: Object.freeze([target('asc', 'ASC', 'Ascendant', 'angle', 180)]),
      }),
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      status: 'ready',
      hitCount: 0,
    }),
  },
  {
    id: 'sorting-by-distance',
    categories: Object.freeze(['sorting']),
    input: Object.freeze({
      positionsResult: Object.freeze({
        status: 'ready',
        ready: true,
        positions: Object.freeze([
          star('regulus', 'Регул', 'Regulus', 150),
          star('spica', 'Спика', 'Spica', 150.25),
          star('sirius', 'Сириус', 'Sirius', 149.8),
        ]),
      }),
      targetsResult: Object.freeze({
        status: 'ready',
        ready: true,
        targets: Object.freeze([
          target('asc', 'ASC', 'Ascendant', 'angle', 150.1),
          target('sun', 'Солнце', 'Sun', 'natal-planet', 150.5),
        ]),
      }),
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      order: Object.freeze([
        ['regulus', 'asc'],
        ['spica', 'asc'],
        ['spica', 'sun'],
        ['sirius', 'asc'],
        ['regulus', 'sun'],
        ['sirius', 'sun'],
      ]),
    }),
  },
  {
    id: 'partial-targets',
    categories: Object.freeze(['partialTargets']),
    input: Object.freeze({
      positionsResult: SYNTHETIC_FIXED_STAR_POSITIONS_RESULT,
      targetsResult: Object.freeze({
        status: 'partial',
        ready: true,
        total: 1,
        readyCount: 1,
        targetSets: Object.freeze(['angles']),
        missingTargetSets: Object.freeze([
          Object.freeze({ targetSet: 'natal-planets', reason: 'natalPlanetsNotReady' }),
        ]),
        targets: Object.freeze([target('asc', 'ASC', 'Ascendant', 'angle', 150.5)]),
      }),
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      status: 'ready',
      partial: true,
      targetCount: 1,
      hitCount: 1,
    }),
  },
  {
    id: 'invalid-longitude',
    categories: Object.freeze(['invalid']),
    input: Object.freeze({
      starPosition: star('regulus', 'Регул', 'Regulus', Number.NaN),
      target: target('asc', 'ASC', 'Ascendant', 'angle', 150),
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      status: 'invalid',
      hit: false,
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
      display: false,
      ui: false,
      debug: false,
      otherRelationships: false,
      deferredTargetsActivated: false,
      readingsAdded: false,
    }),
  },
]);

export function getFixedStarConjunctionFixture(id) {
  return FIXED_STAR_CONJUNCTION_FIXTURES.find((fixture) => fixture.id === id) ?? null;
}

export function getFixedStarConjunctionFixtureIds() {
  return FIXED_STAR_CONJUNCTION_FIXTURES.map((fixture) => fixture.id);
}

export function getFixedStarConjunctionFixtureCategories() {
  return [
    ...new Set(
      FIXED_STAR_CONJUNCTION_FIXTURES
        .flatMap((fixture) => fixture.categories ?? [fixture.category])
        .filter(Boolean),
    ),
  ];
}

function star(key, labelRu, labelEn, longitude) {
  return Object.freeze({
    key,
    labelRu,
    labelEn,
    longitude,
    text: `${labelRu} synthetic`,
    sourceSystem: 'fixed-stars-vronsky-table-18',
    sourceKey: 'vronsky-table-18-fixed-stars',
  });
}

function target(key, label, labelEn, category, longitude) {
  return Object.freeze({
    key,
    label,
    labelEn,
    category,
    targetSet: category === 'angle' ? 'angles' : 'natal-planets',
    longitude,
    text: `${label} synthetic`,
  });
}
