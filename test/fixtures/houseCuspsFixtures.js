const AQUARIUS_SEQUENCE = Object.freeze([
  ['aquarius', 'Водолей', '♒', 300],
  ['pisces', 'Рыбы', '♓', 330],
  ['aries', 'Овен', '♈', 0],
  ['taurus', 'Телец', '♉', 30],
  ['gemini', 'Близнецы', '♊', 60],
  ['cancer', 'Рак', '♋', 90],
  ['leo', 'Лев', '♌', 120],
  ['virgo', 'Дева', '♍', 150],
  ['libra', 'Весы', '♎', 180],
  ['scorpio', 'Скорпион', '♏', 210],
  ['sagittarius', 'Стрелец', '♐', 240],
  ['capricorn', 'Козерог', '♑', 270],
]);

const EQUAL_AQUARIUS_LONGITUDES = Object.freeze([
  314.791633,
  344.791633,
  14.791633,
  44.791633,
  74.791633,
  104.791633,
  134.791633,
  164.791633,
  194.791633,
  224.791633,
  254.791633,
  284.791633,
]);

const EQUAL_AQUARIUS_SIGNS = Object.freeze([
  ['aquarius', 'Водолей', '♒'],
  ['pisces', 'Рыбы', '♓'],
  ['aries', 'Овен', '♈'],
  ['taurus', 'Телец', '♉'],
  ['gemini', 'Близнецы', '♊'],
  ['cancer', 'Рак', '♋'],
  ['leo', 'Лев', '♌'],
  ['virgo', 'Дева', '♍'],
  ['libra', 'Весы', '♎'],
  ['scorpio', 'Скорпион', '♏'],
  ['sagittarius', 'Стрелец', '♐'],
  ['capricorn', 'Козерог', '♑'],
]);

const PLACIDUS_MOSCOW_CUSPS = Object.freeze([
  [1, 314.791633, 'aquarius', 'Водолей', '♒', 14, 47, 29],
  [2, 23.900972, 'aries', 'Овен', '♈', 23, 54, 3],
  [3, 55.414891, 'taurus', 'Телец', '♉', 25, 24, 53],
  [4, 74.211916, 'gemini', 'Близнецы', '♊', 14, 12, 42],
  [5, 89.709349, 'gemini', 'Близнецы', '♊', 29, 42, 33],
  [6, 106.615575, 'cancer', 'Рак', '♋', 16, 36, 56],
  [7, 134.791633, 'leo', 'Лев', '♌', 14, 47, 29],
  [8, 203.900972, 'libra', 'Весы', '♎', 23, 54, 3],
  [9, 235.414891, 'scorpio', 'Скорпион', '♏', 25, 24, 53],
  [10, 254.211916, 'sagittarius', 'Стрелец', '♐', 14, 12, 42],
  [11, 269.709349, 'sagittarius', 'Стрелец', '♐', 29, 42, 33],
  [12, 286.615575, 'capricorn', 'Козерог', '♑', 16, 36, 56],
]);

export const HOUSE_CUSPS_FIXTURES = Object.freeze([
  Object.freeze({
    id: 'whole-sign-asc-aquarius-boundaries',
    category: 'wholeSign',
    label: 'Whole Sign sign-boundary cusps for ASC Aquarius',
    input: Object.freeze({
      houseSystem: 'whole-sign',
      asc: Object.freeze({
        longitude: 314.791633,
        sign: Object.freeze({ key: 'aquarius', ru: 'Водолей', symbol: '♒' }),
      }),
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      status: 'ready',
      houseSystem: 'whole-sign',
      houseSystemLabel: 'Whole Sign',
      cuspType: 'sign-boundary',
      exactCuspDegrees: false,
      benchmarkValidated: false,
      cuspSigns: Object.freeze(AQUARIUS_SEQUENCE.map(([key]) => key)),
      cuspLongitudes: Object.freeze(AQUARIUS_SEQUENCE.map(([, , , longitude]) => longitude)),
      cusps: freezeExpectedCusps(AQUARIUS_SEQUENCE.map(([key, ru, symbol, longitude], index) => (
        [index + 1, longitude, key, ru, symbol, 0, 0, 0]
      ))),
    }),
  }),
  Object.freeze({
    id: 'equal-house-asc-aquarius-14-47-29',
    category: 'equalHouse',
    label: 'Equal House canonical cusps for ASC Aquarius 14°47′29″',
    input: Object.freeze({
      houseSystem: 'equal-house',
      asc: Object.freeze({
        longitude: 314.791633,
        sign: Object.freeze({ key: 'aquarius', ru: 'Водолей', symbol: '♒' }),
      }),
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      status: 'ready',
      houseSystem: 'equal-house',
      houseSystemLabel: 'Равнодомная',
      cuspType: 'equal-30-degree',
      exactCuspDegrees: true,
      benchmarkValidated: false,
      cuspSigns: Object.freeze(EQUAL_AQUARIUS_SIGNS.map(([key]) => key)),
      cuspLongitudes: EQUAL_AQUARIUS_LONGITUDES,
      cusps: freezeExpectedCusps(EQUAL_AQUARIUS_LONGITUDES.map((longitude, index) => {
        const [key, ru, symbol] = EQUAL_AQUARIUS_SIGNS[index];

        return [index + 1, longitude, key, ru, symbol, 14, 47, 29];
      })),
    }),
  }),
  Object.freeze({
    id: 'placidus-moscow-1981-swiss-exact',
    category: 'placidus',
    label: 'Placidus Moscow 1981 Swiss benchmark canonical cusps',
    input: Object.freeze({
      utcDateTime: '1981-04-16T00:45:00.000Z',
      latitude: 55.7577,
      longitude: 37.5410,
      houseSystem: 'placidus',
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      status: 'ready',
      houseSystem: 'placidus',
      houseSystemLabel: 'Placidus',
      cuspType: 'quadrant-placidus',
      exactCuspDegrees: true,
      benchmarkValidated: true,
      source: 'local-swisseph-swe_houses-benchmark',
      toleranceDegrees: 0.001,
      cuspLongitudes: Object.freeze(PLACIDUS_MOSCOW_CUSPS.map(([, longitude]) => longitude)),
      cusps: freezeExpectedCusps(PLACIDUS_MOSCOW_CUSPS),
    }),
  }),
  Object.freeze({
    id: 'router-selected-placidus',
    category: 'router',
    label: 'Router-shaped Placidus result unwraps selected engine result',
    input: Object.freeze({ houseSystem: 'placidus' }),
    expected: Object.freeze({
      manuallyDeclared: true,
      status: 'ready',
      houseSystem: 'placidus',
      selectedHouseSystem: 'placidus',
      source: 'selected-house-system-result',
    }),
  }),
  Object.freeze({
    id: 'profile-selected-equal',
    category: 'profile',
    label: 'Profile selected Equal House canonical cusps',
    input: Object.freeze({ houseSystem: 'equal' }),
    expected: Object.freeze({
      manuallyDeclared: true,
      status: 'ready',
      houseSystem: 'equal-house',
      cuspType: 'equal-30-degree',
    }),
  }),
  Object.freeze({
    id: 'invalid-not-ready-result',
    category: 'invalid',
    label: 'Not-ready house result returns no canonical cusps',
    input: Object.freeze({ status: 'notReady', reason: 'ascMcNotReady' }),
    expected: Object.freeze({
      manuallyDeclared: true,
      status: 'notReady',
      ready: false,
      reason: 'ascMcNotReady',
      cusps: Object.freeze([]),
    }),
  }),
  Object.freeze({
    id: 'privacy-no-raw-profile-data',
    category: 'privacy',
    label: 'Canonical cusp output excludes raw profile fields',
    input: Object.freeze({ check: 'safe-output' }),
    expected: Object.freeze({
      manuallyDeclared: true,
      forbiddenOutputTokens: Object.freeze([
        'birthDate',
        'birthTime',
        'utcDateTime',
        'timezone',
        'birthPlace',
        'coordinates',
        'providerPayload',
        'fullProfileJson',
      ]),
    }),
  }),
  Object.freeze({
    id: 'strict-exclusions-house-cusps',
    category: 'strictExclusions',
    label: 'Canonical cusp layer does not add future Sprint 12 calculations',
    input: Object.freeze({ check: 'source-scan' }),
    expected: Object.freeze({
      manuallyDeclared: true,
      forbiddenFiles: Object.freeze(['src/houses.js', 'src/houseSystems.js']),
      providerImports: false,
      domStorageImports: false,
      swissephImport: false,
      parsFortuna: false,
      arabicParts: false,
      interpretations: false,
    }),
  }),
]);

export function getHouseCuspsFixture(id) {
  return HOUSE_CUSPS_FIXTURES.find((fixture) => fixture.id === id) ?? null;
}

export function getHouseCuspsFixtureIds() {
  return HOUSE_CUSPS_FIXTURES.map((fixture) => fixture.id);
}

export function getHouseCuspsFixtureCategories() {
  return [...new Set(HOUSE_CUSPS_FIXTURES.map((fixture) => fixture.category))];
}

function freezeExpectedCusps(rows) {
  return Object.freeze(rows.map(([
    number,
    longitude,
    signKey,
    signRu,
    symbol,
    degree,
    minutes,
    seconds,
  ]) => Object.freeze({
    number,
    longitude,
    sign: Object.freeze({ key: signKey, ru: signRu, symbol }),
    degree,
    minutes,
    seconds,
    label: number === null ? null : `Куспид ${number} дома`,
    text: `${number} дом — ${signRu} ${degree}°${String(minutes).padStart(2, '0')}′${String(seconds).padStart(2, '0')}″`,
  })));
}
