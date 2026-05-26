const WHOLE_SIGN_SEQUENCES = Object.freeze([
  Object.freeze({
    id: 'whole-sign-asc-aries',
    category: 'wholeSignSequences',
    label: 'Whole Sign sequence for ASC Aries',
    input: Object.freeze({
      houseSystem: 'whole-sign',
      asc: Object.freeze({
        longitude: 14.5,
        sign: Object.freeze({ key: 'aries', ru: 'Овен', symbol: '♈' }),
      }),
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      status: 'ready',
      houseSystem: 'whole-sign',
      houseSequence: Object.freeze([
        'aries',
        'taurus',
        'gemini',
        'cancer',
        'leo',
        'virgo',
        'libra',
        'scorpio',
        'sagittarius',
        'capricorn',
        'aquarius',
        'pisces',
      ]),
      cuspLongitudes: null,
      noPlacidus: true,
      noEqualHouse: true,
    }),
  }),
  Object.freeze({
    id: 'whole-sign-asc-scorpio',
    category: 'wholeSignSequences',
    label: 'Whole Sign sequence for ASC Scorpio',
    input: Object.freeze({
      houseSystem: 'whole-sign',
      asc: Object.freeze({
        longitude: 224.5,
        sign: Object.freeze({ key: 'scorpio', ru: 'Скорпион', symbol: '♏' }),
      }),
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      status: 'ready',
      houseSystem: 'whole-sign',
      houseSequence: Object.freeze([
        'scorpio',
        'sagittarius',
        'capricorn',
        'aquarius',
        'pisces',
        'aries',
        'taurus',
        'gemini',
        'cancer',
        'leo',
        'virgo',
        'libra',
      ]),
      cuspLongitudes: null,
      noPlacidus: true,
      noEqualHouse: true,
    }),
  }),
  Object.freeze({
    id: 'whole-sign-asc-pisces',
    category: 'wholeSignSequences',
    label: 'Whole Sign sequence for ASC Pisces',
    input: Object.freeze({
      houseSystem: 'whole-sign',
      asc: Object.freeze({
        longitude: 359,
        sign: Object.freeze({ key: 'pisces', ru: 'Рыбы', symbol: '♓' }),
      }),
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      status: 'ready',
      houseSystem: 'whole-sign',
      houseSequence: Object.freeze([
        'pisces',
        'aries',
        'taurus',
        'gemini',
        'cancer',
        'leo',
        'virgo',
        'libra',
        'scorpio',
        'sagittarius',
        'capricorn',
        'aquarius',
      ]),
      cuspLongitudes: null,
      noPlacidus: true,
      noEqualHouse: true,
    }),
  }),
]);

const EQUAL_HOUSE_CUSPS = Object.freeze([
  Object.freeze({
    id: 'equal-house-asc-aries-14-30',
    category: 'equalHouseCusps',
    label: 'Equal House cusps for ASC Aries 14°30′',
    input: Object.freeze({
      houseSystem: 'equal-house',
      asc: Object.freeze({
        longitude: 14.5,
        sign: Object.freeze({ key: 'aries', ru: 'Овен', symbol: '♈' }),
      }),
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      status: 'ready',
      houseSystem: 'equal-house',
      cuspLongitudes: Object.freeze([14.5, 44.5, 74.5, 104.5, 134.5, 164.5, 194.5, 224.5, 254.5, 284.5, 314.5, 344.5]),
      cusps: freezeCusps([
        ['aries', 'Овен'],
        ['taurus', 'Телец'],
        ['gemini', 'Близнецы'],
        ['cancer', 'Рак'],
        ['leo', 'Лев'],
        ['virgo', 'Дева'],
        ['libra', 'Весы'],
        ['scorpio', 'Скорпион'],
        ['sagittarius', 'Стрелец'],
        ['capricorn', 'Козерог'],
        ['aquarius', 'Водолей'],
        ['pisces', 'Рыбы'],
      ], 14, 30),
      noPlacidus: true,
      noWholeSign: true,
    }),
  }),
  Object.freeze({
    id: 'equal-house-asc-pisces-29',
    category: 'equalHouseCusps',
    label: 'Equal House cusps for ASC Pisces 29°00′',
    input: Object.freeze({
      houseSystem: 'equal-house',
      asc: Object.freeze({
        longitude: 359,
        sign: Object.freeze({ key: 'pisces', ru: 'Рыбы', symbol: '♓' }),
      }),
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      status: 'ready',
      houseSystem: 'equal-house',
      cuspLongitudes: Object.freeze([359, 29, 59, 89, 119, 149, 179, 209, 239, 269, 299, 329]),
      cusps: freezeCusps([
        ['pisces', 'Рыбы'],
        ['aries', 'Овен'],
        ['taurus', 'Телец'],
        ['gemini', 'Близнецы'],
        ['cancer', 'Рак'],
        ['leo', 'Лев'],
        ['virgo', 'Дева'],
        ['libra', 'Весы'],
        ['scorpio', 'Скорпион'],
        ['sagittarius', 'Стрелец'],
        ['capricorn', 'Козерог'],
        ['aquarius', 'Водолей'],
      ], 29, 0),
      noPlacidus: true,
      noWholeSign: true,
    }),
  }),
  Object.freeze({
    id: 'equal-house-asc-aries-zero',
    category: 'equalHouseCusps',
    label: 'Equal House cusps for ASC Aries 0°00′',
    input: Object.freeze({
      houseSystem: 'equal-house',
      asc: Object.freeze({
        longitude: 0,
        sign: Object.freeze({ key: 'aries', ru: 'Овен', symbol: '♈' }),
      }),
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      status: 'ready',
      houseSystem: 'equal-house',
      cuspLongitudes: Object.freeze([0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330]),
      cusps: freezeCusps([
        ['aries', 'Овен'],
        ['taurus', 'Телец'],
        ['gemini', 'Близнецы'],
        ['cancer', 'Рак'],
        ['leo', 'Лев'],
        ['virgo', 'Дева'],
        ['libra', 'Весы'],
        ['scorpio', 'Скорпион'],
        ['sagittarius', 'Стрелец'],
        ['capricorn', 'Козерог'],
        ['aquarius', 'Водолей'],
        ['pisces', 'Рыбы'],
      ], 0, 0),
      startsAtAriesZeroOnlyBecauseAscIsZero: true,
      noPlacidus: true,
      noWholeSign: true,
    }),
  }),
]);

const PLACIDUS_BENCHMARKS = Object.freeze([
  Object.freeze({
    id: 'placidus-static-benchmarks',
    category: 'placidusBenchmarks',
    label: 'Placidus static benchmark set',
    input: Object.freeze({
      fixtureSource: 'test/fixtures/placidusFixtures.js',
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      houseSystem: 'placidus',
      minBenchmarkCount: 5,
      source: 'local-swisseph-swe_houses-benchmark',
      toleranceDegrees: 0.05,
      highLatitudeUnsupported: true,
      noEqualHouseFallback: true,
      noWholeSignFallback: true,
    }),
  }),
]);

const ROUTER_SELECTION = Object.freeze([
  routerFixture('router-whole-sign-camel', 'wholeSign', 'whole-sign', 'profile', false, 'ready'),
  routerFixture('router-whole-sign-canonical', 'whole-sign', 'whole-sign', 'profile', false, 'ready'),
  routerFixture('router-equal-short', 'equal', 'equal-house', 'profile', false, 'ready'),
  routerFixture('router-equal-camel', 'equalHouse', 'equal-house', 'profile', false, 'ready'),
  routerFixture('router-equal-canonical', 'equal-house', 'equal-house', 'profile', false, 'ready'),
  routerFixture('router-placidus-lowercase', 'placidus', 'placidus', 'profile', false, 'ready'),
  routerFixture('router-placidus-titlecase', 'Placidus', 'placidus', 'profile', false, 'ready'),
  Object.freeze({
    id: 'router-missing-default-whole-sign',
    category: 'routerSelection',
    label: 'Router defaults missing houseSystem to Whole Sign',
    input: Object.freeze({ missingHouseSystem: true }),
    expected: Object.freeze({
      manuallyDeclared: true,
      normalized: null,
      selectionStatus: 'ready',
      selectedHouseSystem: 'whole-sign',
      houseSystem: 'whole-sign',
      selectionSource: 'default',
      defaulted: true,
      status: 'ready',
      reason: null,
    }),
  }),
  Object.freeze({
    id: 'router-unknown-unsupported',
    category: 'routerSelection',
    label: 'Router rejects unknown houseSystem',
    input: Object.freeze({ houseSystem: 'campanus' }),
    expected: Object.freeze({
      manuallyDeclared: true,
      normalized: null,
      selectionStatus: 'unsupported',
      selectedHouseSystem: null,
      houseSystem: null,
      selectionSource: 'profile',
      defaulted: false,
      status: 'unsupported',
      reason: 'unknownHouseSystem',
    }),
  }),
]);

const GUARDRAIL_FAILURES = Object.freeze([
  guardrailFixture('guardrail-missing-profile', 'missingProfile', 'wholeSign', 'notReady', 'missingProfile'),
  guardrailFixture('guardrail-common-day', 'commonDay', 'wholeSign', 'notReady', 'commonDay'),
  guardrailFixture('guardrail-unknown-birth-time', 'unknownBirthTime', 'equal', 'notReady', 'missingExactBirthTime'),
  guardrailFixture('guardrail-missing-birth-place', 'missingBirthPlace', 'placidus', 'notReady', 'missingBirthPlace'),
  guardrailFixture('guardrail-city-without-coords', 'cityWithoutCoordinates', 'wholeSign', 'notReady', 'cityWithoutCoordinates'),
  guardrailFixture('guardrail-country-region-only', 'countryRegionOnly', 'equal', 'notReady', 'countryRegionOnly'),
  guardrailFixture('guardrail-invalid-coords', 'invalidCoordinates', 'placidus', 'notReady', 'invalidBirthCoordinates'),
]);

const NO_FALLBACK = Object.freeze([
  noFallbackFixture('no-fallback-placidus-not-equal', 'placidus', true, 'unsupported', 'placidus', 'placidus', 'placidusUnsupportedAtLatitude', 'equal-house'),
  noFallbackFixture('no-fallback-placidus-not-whole-sign', 'placidus', true, 'unsupported', 'placidus', 'placidus', 'placidusUnsupportedAtLatitude', 'whole-sign'),
  noFallbackFixture('no-fallback-equal-not-whole-sign', 'equal', false, 'ready', 'equal-house', 'equal-house', null, 'whole-sign'),
  noFallbackFixture('no-fallback-whole-sign-not-placidus', 'wholeSign', false, 'ready', 'whole-sign', 'whole-sign', null, 'placidus'),
  noFallbackFixture('no-fallback-unknown-not-default', 'campanus', false, 'unsupported', null, null, 'unknownHouseSystem', 'whole-sign'),
]);

const PRIVACY = Object.freeze([
  Object.freeze({
    id: 'privacy-no-raw-profile-output',
    category: 'privacy',
    label: 'Outputs do not expose raw profile fields',
    input: Object.freeze({ check: 'router-output' }),
    expected: Object.freeze({
      manuallyDeclared: true,
      forbiddenOutputTokens: Object.freeze([
        'rawDateField',
        'rawTimeField',
        'rawPlaceField',
        'rawUtcField',
        'rawTimezone',
        'rawCoordinateValues',
      ]),
    }),
  }),
]);

const STRICT_EXCLUSIONS = Object.freeze([
  Object.freeze({
    id: 'strict-exclusions-no-generic-files',
    category: 'strictExclusions',
    label: 'No generic houses/router files or unsupported features',
    input: Object.freeze({ check: 'source-scan' }),
    expected: Object.freeze({
      manuallyDeclared: true,
      forbiddenFiles: Object.freeze(['src/houses.js', 'src/houseSystems.js']),
      providerImports: false,
      domStorageImports: false,
      planetInHouse: false,
      interpretations: false,
      fixedStars: false,
      transits: false,
    }),
  }),
]);

export const HOUSE_SYSTEM_VALIDATION_FIXTURES = Object.freeze([
  ...WHOLE_SIGN_SEQUENCES,
  ...EQUAL_HOUSE_CUSPS,
  ...PLACIDUS_BENCHMARKS,
  ...ROUTER_SELECTION,
  ...GUARDRAIL_FAILURES,
  ...NO_FALLBACK,
  ...PRIVACY,
  ...STRICT_EXCLUSIONS,
]);

export function getHouseSystemValidationFixture(id) {
  return HOUSE_SYSTEM_VALIDATION_FIXTURES.find((fixture) => fixture.id === id) ?? null;
}

export function getHouseSystemValidationFixtureIds() {
  return HOUSE_SYSTEM_VALIDATION_FIXTURES.map((fixture) => fixture.id);
}

export function getHouseSystemValidationFixtureCategories() {
  return [...new Set(HOUSE_SYSTEM_VALIDATION_FIXTURES.map((fixture) => fixture.category))];
}

function freezeCusps(signs, degree, minutes, seconds = 0) {
  return Object.freeze(signs.map(([sign, signRu], index) => Object.freeze({
    number: index + 1,
    sign,
    degree,
    minutes,
    seconds,
    text: `${index + 1} дом — ${signRu} ${degree}°${String(minutes).padStart(2, '0')}′${String(seconds).padStart(2, '0')}″`,
  })));
}

function routerFixture(id, houseSystem, canonical, selectionSource, defaulted, status) {
  return Object.freeze({
    id,
    category: 'routerSelection',
    label: `Router maps ${houseSystem} to ${canonical}`,
    input: Object.freeze({ houseSystem }),
    expected: Object.freeze({
      manuallyDeclared: true,
      normalized: canonical,
      selectionStatus: 'ready',
      selectedHouseSystem: canonical,
      houseSystem: canonical,
      selectionSource,
      defaulted,
      status,
      reason: null,
    }),
  });
}

function guardrailFixture(id, issue, houseSystem, status, reason) {
  return Object.freeze({
    id,
    category: 'guardrailFailures',
    label: `Guardrail failure: ${issue}`,
    input: Object.freeze({
      issue,
      houseSystem,
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      status,
      reason,
      houses: Object.freeze([]),
      cusps: Object.freeze([]),
      noRawBirthData: true,
    }),
  });
}

function noFallbackFixture(
  id,
  houseSystem,
  highLatitude,
  status,
  selectedHouseSystem,
  resultHouseSystem,
  reason,
  forbiddenHouseSystem,
) {
  return Object.freeze({
    id,
    category: 'noFallback',
    label: `No fallback for ${houseSystem}`,
    input: Object.freeze({
      houseSystem,
      highLatitude,
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      status,
      selectedHouseSystem,
      houseSystem: resultHouseSystem,
      reason,
      forbiddenHouseSystem,
    }),
  });
}
