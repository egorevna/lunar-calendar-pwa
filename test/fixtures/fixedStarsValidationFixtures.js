export const EXPECTED_FIXED_STAR_ACTIVE_KEYS = Object.freeze([
  'algol',
  'aldebaran',
  'rigel',
  'betelgeuse',
  'sirius',
  'canopus',
  'regulus',
  'spica',
  'arcturus',
  'antares',
  'vega',
  'altair',
  'fomalhaut',
]);

export const EXPECTED_FIXED_STAR_NATAL_TARGET_KEYS = Object.freeze([
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

export const EXPECTED_FIXED_STAR_ANGLE_TARGET_KEYS = Object.freeze([
  'asc',
  'mc',
  'dsc',
  'ic',
]);

export const EXPECTED_FIXED_STAR_DEFERRED_TARGET_SETS = Object.freeze([
  'house-cusps',
  'lunar-nodes',
  'lilith',
  'selena',
  'pars-fortuna',
  'lot-of-spirit',
  'arabic-parts',
  'custom-points',
]);

export const VALIDATION_NATAL_PLANETS_RESULT = Object.freeze({
  status: 'ready',
  ready: true,
  planets: Object.freeze([
    planet('sun', 10),
    planet('moon', 20),
    planet('mercury', 30),
    planet('venus', 40),
    planet('mars', 50),
    planet('jupiter', 60),
    planet('saturn', 70),
    planet('uranus', 80),
    planet('neptune', 90),
    planet('pluto', 100),
  ]),
});

export const VALIDATION_ASC_MC_RESULT = Object.freeze({
  status: 'ready',
  ready: true,
  angles: Object.freeze({
    asc: angle('asc', 'ASC', 110),
    mc: angle('mc', 'MC', 200),
    dsc: angle('dsc', 'DSC', 290),
    ic: angle('ic', 'IC', 20),
  }),
});

export const FIXED_STARS_VALIDATION_FIXTURES = Object.freeze([
  {
    id: 'source-policy',
    categories: Object.freeze(['sourcePolicy']),
    expected: Object.freeze({
      manuallyDeclared: true,
      sourceSystem: 'fixed-stars-vronsky-table-18',
      sourceKey: 'vronsky-table-18-fixed-stars',
      primarySource: 'Вронский, Таблица 18',
      noOcrImport: true,
      noRowsFromMemory: true,
      initialReferenceEpoch: 1990,
    }),
  },
  {
    id: 'catalog-active-rows',
    categories: Object.freeze(['catalogRows']),
    expected: Object.freeze({
      manuallyDeclared: true,
      activeKeys: EXPECTED_FIXED_STAR_ACTIVE_KEYS,
      activeRowCount: 13,
      candidateRowCount: 0,
      verificationStatus: 'verified',
      interpretation: false,
    }),
  },
  {
    id: 'epoch-columns',
    categories: Object.freeze(['epochColumns']),
    expected: Object.freeze({
      manuallyDeclared: true,
      coordinateKeys: Object.freeze(['epoch1950', 'epoch1970', 'epoch1990']),
      epochs: Object.freeze([1950, 1970, 1990]),
      verified: true,
    }),
  },
  {
    id: 'position-policy',
    categories: Object.freeze(['positionPolicy']),
    expected: Object.freeze({
      manuallyDeclared: true,
      positionEpochPolicy: 'vronsky-linear-epoch-interpolation',
      positionChecks: Object.freeze([
        positionCheck('spica', 1960, true, false, '1950-1970', null, null),
        positionCheck('spica', 1980, true, false, '1970-1990', null, null),
        positionCheck('spica', 1940, false, true, null, '1950-1970', null),
        positionCheck('spica', 2000, false, true, null, '1970-1990', null),
      ]),
      batchCount: 13,
    }),
  },
  {
    id: 'target-policy',
    categories: Object.freeze(['targetPolicy']),
    expected: Object.freeze({
      manuallyDeclared: true,
      activeTargetSet: Object.freeze(['natal-planets', 'angles']),
      activeTargets: Object.freeze([
        ...EXPECTED_FIXED_STAR_NATAL_TARGET_KEYS,
        ...EXPECTED_FIXED_STAR_ANGLE_TARGET_KEYS,
      ]),
      deferredTargetSets: EXPECTED_FIXED_STAR_DEFERRED_TARGET_SETS,
      readyTargetCount: 14,
    }),
  },
  {
    id: 'orb-policy',
    categories: Object.freeze(['orbPolicy']),
    expected: Object.freeze({
      manuallyDeclared: true,
      orbPolicyKey: 'fixed-stars-global-conjunction-orb-1deg',
      relationship: 'conjunction',
      orbDegrees: 1,
      hiddenOrb: false,
      inclusiveBoundary: true,
    }),
  },
  {
    id: 'conjunction-policy',
    categories: Object.freeze(['conjunctionPolicy', 'orbPolicy']),
    expected: Object.freeze({
      manuallyDeclared: true,
      relationship: 'conjunction',
      boundaryChecks: Object.freeze([
        boundaryCheck(150, 150, true, false),
        boundaryCheck(150, 150.5, true, false),
        boundaryCheck(150, 151, true, true),
        boundaryCheck(150, 151.0001, false, false),
        boundaryCheck(359.8, 0.1, true, false),
        boundaryCheck(1.2, 359.9, false, false),
      ]),
    }),
  },
  {
    id: 'conjunction-sorting',
    categories: Object.freeze(['conjunctionPolicy']),
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
        targetSets: Object.freeze(['angles', 'natal-planets']),
        targets: Object.freeze([
          target('asc', 'ASC', 'angle', 150.1),
          target('sun', 'Солнце', 'natal-planet', 150.5),
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
    id: 'conjunction-no-hits',
    categories: Object.freeze(['conjunctionPolicy']),
    input: Object.freeze({
      positionsResult: Object.freeze({
        status: 'ready',
        ready: true,
        positions: Object.freeze([star('regulus', 'Регул', 'Regulus', 150)]),
      }),
      targetsResult: Object.freeze({
        status: 'ready',
        ready: true,
        targetSets: Object.freeze(['angles']),
        targets: Object.freeze([target('asc', 'ASC', 'angle', 180)]),
      }),
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      hitCount: 0,
    }),
  },
  {
    id: 'conjunction-partial-targets',
    categories: Object.freeze(['conjunctionPolicy']),
    input: Object.freeze({
      positionsResult: Object.freeze({
        status: 'ready',
        ready: true,
        positions: Object.freeze([star('regulus', 'Регул', 'Regulus', 150)]),
      }),
      targetsResult: Object.freeze({
        status: 'partial',
        ready: true,
        targetSets: Object.freeze(['angles']),
        targets: Object.freeze([target('asc', 'ASC', 'angle', 150.5)]),
      }),
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      partial: true,
      hitCount: 1,
    }),
  },
  {
    id: 'conjunction-not-ready',
    categories: Object.freeze(['conjunctionPolicy']),
    input: Object.freeze({
      positionsResult: Object.freeze({
        status: 'notReady',
        ready: false,
        reason: 'positionsUnavailable',
      }),
      targetsResult: Object.freeze({
        status: 'ready',
        ready: true,
        targetSets: Object.freeze(['angles']),
        targets: Object.freeze([target('asc', 'ASC', 'angle', 150)]),
      }),
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      status: 'notReady',
    }),
  },
  {
    id: 'privacy',
    categories: Object.freeze(['privacy']),
    expected: Object.freeze({
      manuallyDeclared: true,
      rawBirthDataExposed: false,
      rawGeoValuesExposed: false,
      privateJsonExposed: false,
      providerDataExposed: false,
      readingTextExposed: false,
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
      genericFixedStarsModule: false,
      swissephRuntime: false,
      astronomyEngineRuntime: false,
      otherRelationships: false,
      interpretations: false,
    }),
  },
]);

export function getFixedStarsValidationFixture(id) {
  return FIXED_STARS_VALIDATION_FIXTURES.find((fixture) => fixture.id === id) ?? null;
}

export function getFixedStarsValidationFixtureIds() {
  return FIXED_STARS_VALIDATION_FIXTURES.map((fixture) => fixture.id);
}

export function getFixedStarsValidationFixtureCategories() {
  return [
    ...new Set(
      FIXED_STARS_VALIDATION_FIXTURES
        .flatMap((fixture) => fixture.categories ?? [fixture.category])
        .filter(Boolean),
    ),
  ];
}

function positionCheck(starKey, epochYear, interpolated, extrapolated, interpolationSource, extrapolationSource, exactSourceEpoch) {
  return Object.freeze({
    input: Object.freeze({ starKey, epochYear }),
    expected: Object.freeze({
      interpolated,
      extrapolated,
      interpolationSource,
      extrapolationSource,
      exactSourceEpoch,
    }),
  });
}

function boundaryCheck(starLongitude, targetLongitude, hit, boundary) {
  return Object.freeze({
    starLongitude,
    targetLongitude,
    hit,
    boundary,
  });
}

function planet(key, longitude) {
  return Object.freeze({
    key,
    longitude,
  });
}

function angle(key, label, longitude) {
  return Object.freeze({
    key,
    label,
    longitude,
  });
}

function star(key, labelRu, labelEn, longitude) {
  return Object.freeze({
    key,
    labelRu,
    labelEn,
    longitude,
    sourceSystem: 'fixed-stars-vronsky-table-18',
  });
}

function target(key, label, category, longitude) {
  return Object.freeze({
    key,
    label,
    category,
    longitude,
  });
}
