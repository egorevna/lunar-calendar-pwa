const REQUIRED_CATEGORIES = Object.freeze([
  'wholeSign',
  'equalHouse',
  'placidus',
  'cuspBoundaries',
  'wrappingSpans',
  'invalidPlanets',
  'selectedSystem',
  'profilePath',
  'privacy',
  'strictExclusions',
]);

const WHOLE_SIGN_FIXTURES = Object.freeze([
  Object.freeze({
    id: 'whole-sign-asc-aries-planets',
    category: 'wholeSign',
    label: 'Whole Sign ASC Aries planet assignments',
    input: Object.freeze({
      houseSystem: 'whole-sign',
      ascSign: 'aries',
      planets: Object.freeze([
        planetFixture('sun', 'Солнце', 'aries', 14.5),
        planetFixture('moon', 'Луна', 'taurus', 44.5),
        planetFixture('mars', 'Марс', 'pisces', 359),
      ]),
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      houseSystem: 'whole-sign',
      assignments: Object.freeze([
        expectedAssignment('sun', 1),
        expectedAssignment('moon', 2),
        expectedAssignment('mars', 12),
      ]),
    }),
  }),
  Object.freeze({
    id: 'whole-sign-asc-scorpio-planets',
    category: 'wholeSign',
    label: 'Whole Sign ASC Scorpio planet assignments',
    input: Object.freeze({
      houseSystem: 'whole-sign',
      ascSign: 'scorpio',
      planets: Object.freeze([
        planetFixture('sun', 'Солнце', 'scorpio', 224.5),
        planetFixture('moon', 'Луна', 'sagittarius', 254.5),
        planetFixture('mars', 'Марс', 'libra', 194.5),
      ]),
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      houseSystem: 'whole-sign',
      assignments: Object.freeze([
        expectedAssignment('sun', 1),
        expectedAssignment('moon', 2),
        expectedAssignment('mars', 12),
      ]),
    }),
  }),
]);

const EQUAL_HOUSE_FIXTURES = Object.freeze([
  Object.freeze({
    id: 'equal-house-aries-14-30-boundaries',
    category: 'equalHouse',
    label: 'Equal House ASC Aries 14°30′ boundary assignments',
    input: Object.freeze({
      houseSystem: 'equal-house',
      cuspLongitudes: Object.freeze([
        14.5,
        44.5,
        74.5,
        104.5,
        134.5,
        164.5,
        194.5,
        224.5,
        254.5,
        284.5,
        314.5,
        344.5,
      ]),
      planets: Object.freeze([
        longitudePlanetFixture('cusp1', 'Куспид 1', 14.5),
        longitudePlanetFixture('beforeCusp2', 'Перед 2 домом', 44.499),
        longitudePlanetFixture('cusp2', 'Куспид 2', 44.5),
        longitudePlanetFixture('cusp12', 'Куспид 12', 344.5),
        longitudePlanetFixture('wrapInside', 'Внутри 12 дома', 359),
        longitudePlanetFixture('beforeAsc', 'Перед ASC', 14.499),
      ]),
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      houseSystem: 'equal-house',
      assignments: Object.freeze([
        expectedAssignment('cusp1', 1),
        expectedAssignment('beforeCusp2', 1),
        expectedAssignment('cusp2', 2),
        expectedAssignment('cusp12', 12),
        expectedAssignment('wrapInside', 12),
        expectedAssignment('beforeAsc', 12),
      ]),
    }),
  }),
]);

const PLACIDUS_FIXTURES = Object.freeze([
  Object.freeze({
    id: 'placidus-greenwich-boundaries',
    category: 'placidus',
    label: 'Placidus Greenwich benchmark boundary assignments',
    input: Object.freeze({
      houseSystem: 'placidus',
      cuspLongitudes: Object.freeze([
        24.266189,
        61.142401,
        82.020814,
        99.611088,
        119.061909,
        147.700657,
        204.266189,
        241.142401,
        262.020814,
        279.611088,
        299.061909,
        327.700657,
      ]),
      planets: Object.freeze([
        longitudePlanetFixture('placidusCusp1', 'Placidus cusp 1', 24.266189),
        longitudePlanetFixture('placidusBeforeCusp2', 'Before Placidus cusp 2', 61.142),
        longitudePlanetFixture('placidusCusp2', 'Placidus cusp 2', 61.142401),
        longitudePlanetFixture('placidusWrap', 'Placidus wrap span', 350),
      ]),
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      houseSystem: 'placidus',
      assignments: Object.freeze([
        expectedAssignment('placidusCusp1', 1),
        expectedAssignment('placidusBeforeCusp2', 1),
        expectedAssignment('placidusCusp2', 2),
        expectedAssignment('placidusWrap', 12),
      ]),
    }),
  }),
]);

const INVALID_PLANET_FIXTURES = Object.freeze([
  Object.freeze({
    id: 'invalid-planets-by-system',
    category: 'invalidPlanets',
    label: 'Invalid planet inputs by house system',
    input: Object.freeze({
      planets: Object.freeze([
        Object.freeze({ key: 'wholeInvalid', label: 'Whole invalid' }),
        Object.freeze({ key: 'equalInvalid', label: 'Equal invalid', sign: Object.freeze({ key: 'aries' }) }),
        Object.freeze({ key: 'placidusInvalid', label: 'Placidus invalid', longitude: Number.NaN }),
      ]),
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      invalidReasons: Object.freeze({
        wholeInvalid: 'missingPlanetSign',
        equalInvalid: 'missingPlanetLongitude',
        placidusInvalid: 'invalidPlanetLongitude',
      }),
    }),
  }),
]);

const SELECTED_SYSTEM_FIXTURES = Object.freeze([
  selectedSystemFixture('selected-whole-sign-profile', 'wholeSign', 'whole-sign'),
  selectedSystemFixture('selected-equal-profile', 'equal', 'equal-house'),
  selectedSystemFixture('selected-placidus-profile', 'placidus', 'placidus'),
  Object.freeze({
    id: 'selected-unknown-profile',
    category: 'selectedSystem',
    label: 'Unknown house system is unsupported',
    input: Object.freeze({ houseSystem: 'campanus' }),
    expected: Object.freeze({
      manuallyDeclared: true,
      status: 'unsupported',
      reason: 'unknownHouseSystem',
      houseSystem: null,
    }),
  }),
]);

const PROFILE_PATH_FIXTURES = Object.freeze([
  Object.freeze({
    id: 'profile-path-safe-output',
    category: 'profilePath',
    label: 'Profile path uses selected-system router and safe natal planets path',
    input: Object.freeze({
      selectedHouseSystems: Object.freeze(['wholeSign', 'equal', 'placidus']),
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      statuses: Object.freeze(['ready', 'notReady', 'unsupported']),
      noRawBirthData: true,
      noRawCoordinates: true,
    }),
  }),
]);

const PRIVACY_FIXTURES = Object.freeze([
  Object.freeze({
    id: 'planet-in-houses-privacy',
    category: 'privacy',
    label: 'Planet-in-house output privacy exclusions',
    input: Object.freeze({ safeOutputOnly: true }),
    expected: Object.freeze({
      manuallyDeclared: true,
      noRawBirthData: true,
      noRawBirthCoordinates: true,
      noFullProfileDump: true,
      noInterpretations: true,
    }),
  }),
]);

const STRICT_EXCLUSION_FIXTURES = Object.freeze([
  Object.freeze({
    id: 'planet-in-houses-strict-exclusions',
    category: 'strictExclusions',
    label: 'Planet-in-house strict exclusions',
    input: Object.freeze({
      forbiddenFeatures: Object.freeze([
        'UI',
        'display helper',
        'provider direct call',
        'interpretations',
        'ritual scoring',
        'src/houses.js',
        'src/houseSystems.js',
      ]),
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      noUi: true,
      noDisplayHelper: true,
      noProviderDirectCall: true,
      noInterpretations: true,
      noGenericHousesModule: true,
    }),
  }),
]);

export const PLANET_IN_HOUSES_FIXTURES = Object.freeze([
  ...WHOLE_SIGN_FIXTURES,
  ...EQUAL_HOUSE_FIXTURES,
  ...PLACIDUS_FIXTURES,
  Object.freeze({
    id: 'cusp-boundaries-half-open',
    category: 'cuspBoundaries',
    label: 'Half-open cusp boundary policy',
    input: Object.freeze({
      span: Object.freeze({ start: 14.5, end: 44.5 }),
      values: Object.freeze([14.5, 44.499, 44.5]),
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      inside: Object.freeze([true, true, false]),
    }),
  }),
  Object.freeze({
    id: 'wrapping-span-policy',
    category: 'wrappingSpans',
    label: 'Wrapping span policy',
    input: Object.freeze({
      span: Object.freeze({ start: 344.5, end: 14.5 }),
      values: Object.freeze([344.5, 359, 0, 14.499, 14.5]),
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      inside: Object.freeze([true, true, true, true, false]),
    }),
  }),
  ...INVALID_PLANET_FIXTURES,
  ...SELECTED_SYSTEM_FIXTURES,
  ...PROFILE_PATH_FIXTURES,
  ...PRIVACY_FIXTURES,
  ...STRICT_EXCLUSION_FIXTURES,
]);

export function getPlanetInHousesFixture(id) {
  return PLANET_IN_HOUSES_FIXTURES.find((fixture) => fixture.id === id) ?? null;
}

export function getPlanetInHousesFixtureIds() {
  return PLANET_IN_HOUSES_FIXTURES.map((fixture) => fixture.id);
}

export function getPlanetInHousesFixtureCategories() {
  return REQUIRED_CATEGORIES;
}

function planetFixture(key, label, signKey, longitude) {
  return Object.freeze({
    key,
    label,
    longitude,
    sign: Object.freeze({ key: signKey }),
  });
}

function longitudePlanetFixture(key, label, longitude) {
  return Object.freeze({ key, label, longitude });
}

function expectedAssignment(planetKey, houseNumber) {
  return Object.freeze({ planetKey, houseNumber });
}

function selectedSystemFixture(id, profileValue, houseSystem) {
  return Object.freeze({
    id,
    category: 'selectedSystem',
    label: `${profileValue} routes to ${houseSystem}`,
    input: Object.freeze({ houseSystem: profileValue }),
    expected: Object.freeze({
      manuallyDeclared: true,
      status: 'ready',
      houseSystem,
    }),
  });
}
