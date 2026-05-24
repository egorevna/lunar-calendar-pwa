const SOURCE_SYSTEM = 'star-of-magi-egyptian-tradition';

const SIGN_LABELS = Object.freeze({
  aries: 'Овен',
  taurus: 'Телец',
  gemini: 'Близнецы',
  cancer: 'Рак',
  leo: 'Лев',
  virgo: 'Дева',
  libra: 'Весы',
  scorpio: 'Скорпион',
  sagittarius: 'Стрелец',
  capricorn: 'Козерог',
  aquarius: 'Водолей',
  pisces: 'Рыбы',
});

function readyExpected(decanIndex, ruler, startDegree, endDegreeExclusive) {
  return Object.freeze({
    status: 'ready',
    decanIndex,
    ruler,
    startDegree,
    endDegreeExclusive,
    sourceSystem: SOURCE_SYSTEM,
  });
}

function invalidExpected(reason = '') {
  return Object.freeze({
    status: 'invalid',
    reason,
  });
}

function lookupFixture(id, category, label, input, expected, notes = []) {
  return Object.freeze({
    id,
    category,
    label,
    input: Object.freeze(input),
    expected,
    notes: Object.freeze([...notes]),
  });
}

function planet(key, label, signKey, degree, minutes, longitude, overrides = {}) {
  return Object.freeze({
    key,
    label,
    sign: signKey ? Object.freeze({ key: signKey, ru: SIGN_LABELS[signKey], symbol: '' }) : null,
    degree,
    minutes,
    longitude,
    source: 'synthetic-fixture',
    ...overrides,
  });
}

export const DECANS_LOOKUP_FIXTURES = Object.freeze([
  lookupFixture(
    'sign-start-aries',
    'signStarts',
    'Aries 0 starts in decan 1 ruled by Mars',
    { sign: 'aries', degreeWithinSign: 0 },
    readyExpected(1, 'mars', 0, 10),
  ),
  lookupFixture(
    'sign-start-taurus',
    'signStarts',
    'Taurus 0 starts in decan 1 ruled by Mercury',
    { sign: 'taurus', degreeWithinSign: 0 },
    readyExpected(1, 'mercury', 0, 10),
  ),
  lookupFixture(
    'sign-start-gemini',
    'signStarts',
    'Gemini 0 starts in decan 1 ruled by Jupiter',
    { sign: 'gemini', degreeWithinSign: 0 },
    readyExpected(1, 'jupiter', 0, 10),
  ),
  lookupFixture(
    'sign-start-cancer',
    'signStarts',
    'Cancer 0 starts in decan 1 ruled by Venus',
    { sign: 'cancer', degreeWithinSign: 0 },
    readyExpected(1, 'venus', 0, 10),
  ),
  lookupFixture(
    'sign-start-leo',
    'signStarts',
    'Leo 0 starts in decan 1 ruled by Saturn',
    { sign: 'leo', degreeWithinSign: 0 },
    readyExpected(1, 'saturn', 0, 10),
  ),
  lookupFixture(
    'sign-start-virgo',
    'signStarts',
    'Virgo 0 starts in decan 1 ruled by Sun',
    { sign: 'virgo', degreeWithinSign: 0 },
    readyExpected(1, 'sun', 0, 10),
  ),
  lookupFixture(
    'sign-start-libra',
    'signStarts',
    'Libra 0 starts in decan 1 ruled by Moon',
    { sign: 'libra', degreeWithinSign: 0 },
    readyExpected(1, 'moon', 0, 10),
  ),
  lookupFixture(
    'sign-start-scorpio',
    'signStarts',
    'Scorpio 0 starts in decan 1 ruled by Mars',
    { sign: 'scorpio', degreeWithinSign: 0 },
    readyExpected(1, 'mars', 0, 10),
  ),
  lookupFixture(
    'sign-start-sagittarius',
    'signStarts',
    'Sagittarius 0 starts in decan 1 ruled by Mercury',
    { sign: 'sagittarius', degreeWithinSign: 0 },
    readyExpected(1, 'mercury', 0, 10),
  ),
  lookupFixture(
    'sign-start-capricorn',
    'signStarts',
    'Capricorn 0 starts in decan 1 ruled by Jupiter',
    { sign: 'capricorn', degreeWithinSign: 0 },
    readyExpected(1, 'jupiter', 0, 10),
  ),
  lookupFixture(
    'sign-start-aquarius',
    'signStarts',
    'Aquarius 0 starts in decan 1 ruled by Venus',
    { sign: 'aquarius', degreeWithinSign: 0 },
    readyExpected(1, 'venus', 0, 10),
  ),
  lookupFixture(
    'sign-start-pisces',
    'signStarts',
    'Pisces 0 starts in decan 1 ruled by Saturn',
    { sign: 'pisces', degreeWithinSign: 0 },
    readyExpected(1, 'saturn', 0, 10),
  ),

  lookupFixture(
    'boundary-aries-9-999',
    'exactBoundaries',
    'Aries 9.999 remains in decan 1',
    { sign: 'aries', degreeWithinSign: 9.999 },
    readyExpected(1, 'mars', 0, 10),
  ),
  lookupFixture(
    'boundary-aries-10',
    'exactBoundaries',
    'Aries 10 moves to decan 2',
    { sign: 'aries', degreeWithinSign: 10 },
    readyExpected(2, 'sun', 10, 20),
  ),
  lookupFixture(
    'boundary-aries-19-999',
    'exactBoundaries',
    'Aries 19.999 remains in decan 2',
    { sign: 'aries', degreeWithinSign: 19.999 },
    readyExpected(2, 'sun', 10, 20),
  ),
  lookupFixture(
    'boundary-aries-20',
    'exactBoundaries',
    'Aries 20 moves to decan 3',
    { sign: 'aries', degreeWithinSign: 20 },
    readyExpected(3, 'venus', 20, 30),
  ),
  lookupFixture(
    'boundary-taurus-10',
    'exactBoundaries',
    'Taurus 10 moves to decan 2',
    { sign: 'taurus', degreeWithinSign: 10 },
    readyExpected(2, 'moon', 10, 20),
  ),
  lookupFixture(
    'boundary-gemini-20',
    'exactBoundaries',
    'Gemini 20 moves to decan 3',
    { sign: 'gemini', degreeWithinSign: 20 },
    readyExpected(3, 'sun', 20, 30),
  ),
  lookupFixture(
    'boundary-libra-10',
    'exactBoundaries',
    'Libra 10 moves to decan 2',
    { sign: 'libra', degreeWithinSign: 10 },
    readyExpected(2, 'saturn', 10, 20),
  ),
  lookupFixture(
    'boundary-pisces-20',
    'exactBoundaries',
    'Pisces 20 moves to decan 3',
    { sign: 'pisces', degreeWithinSign: 20 },
    readyExpected(3, 'mars', 20, 30),
  ),

  lookupFixture(
    'final-boundary-aries-29-999',
    'finalBoundary',
    'Aries 29.999 remains in decan 3',
    { sign: 'aries', degreeWithinSign: 29.999 },
    readyExpected(3, 'venus', 20, 30),
  ),
  lookupFixture(
    'final-boundary-taurus-29-999',
    'finalBoundary',
    'Taurus 29.999 remains in decan 3',
    { sign: 'taurus', degreeWithinSign: 29.999 },
    readyExpected(3, 'saturn', 20, 30),
  ),
  lookupFixture(
    'final-boundary-scorpio-29-999',
    'finalBoundary',
    'Scorpio 29.999 remains in decan 3',
    { sign: 'scorpio', degreeWithinSign: 29.999 },
    readyExpected(3, 'venus', 20, 30),
  ),
  lookupFixture(
    'final-boundary-pisces-29-999',
    'finalBoundary',
    'Pisces 29.999 remains in decan 3',
    { sign: 'pisces', degreeWithinSign: 29.999 },
    readyExpected(3, 'mars', 20, 30),
  ),
  lookupFixture(
    'final-boundary-aries-30-invalid',
    'finalBoundary',
    'Aries 30 is invalid inside one sign',
    { sign: 'aries', degreeWithinSign: 30 },
    invalidExpected('invalidDegree'),
  ),

  lookupFixture(
    'invalid-unknown-sign',
    'invalidInputs',
    'Unknown sign is invalid',
    { sign: 'unknown', degreeWithinSign: 10 },
    invalidExpected('invalidSign'),
  ),
  lookupFixture(
    'invalid-negative-degree',
    'invalidInputs',
    'Negative degree is invalid',
    { sign: 'aries', degreeWithinSign: -0.1 },
    invalidExpected('invalidDegree'),
  ),
  lookupFixture(
    'invalid-degree-30',
    'invalidInputs',
    'Degree 30 is invalid inside one sign',
    { sign: 'aries', degreeWithinSign: 30 },
    invalidExpected('invalidDegree'),
  ),
  lookupFixture(
    'invalid-nan-degree',
    'invalidInputs',
    'NaN degree is invalid',
    { sign: 'aries', degreeWithinSign: Number.NaN },
    invalidExpected('invalidDegree'),
  ),
  lookupFixture(
    'invalid-missing-sign',
    'invalidInputs',
    'Missing sign is invalid',
    { degreeWithinSign: 10 },
    invalidExpected('invalidSign'),
  ),
  lookupFixture(
    'invalid-missing-degree',
    'invalidInputs',
    'Missing degree is invalid',
    { sign: 'aries' },
    invalidExpected('invalidDegree'),
  ),

  lookupFixture(
    'planet-sign-degree-minutes',
    'planetInput',
    'Planet input uses sign degree and minutes',
    {
      planet: planet('mars', 'Марс', 'aries', 25, 30, 25.5),
    },
    readyExpected(3, 'venus', 20, 30),
  ),
  lookupFixture(
    'planet-longitude-fallback',
    'planetInput',
    'Planet input can resolve sign and degree from longitude',
    {
      planet: planet('venus', 'Венера', null, null, null, 359.5),
    },
    readyExpected(3, 'mars', 20, 30),
  ),
  lookupFixture(
    'planet-invalid-no-sign-or-longitude',
    'planetInput',
    'Planet input without sign or longitude is invalid',
    {
      planet: planet('saturn', 'Сатурн', null, null, null, Number.NaN),
    },
    invalidExpected('invalidLookupInput'),
  ),

  lookupFixture(
    'summary-mixed-decans',
    'summary',
    'Mixed decans summary counts rulers and decan indexes',
    {
      lookups: Object.freeze([
        { sign: 'aries', degreeWithinSign: 0 },
        { sign: 'aries', degreeWithinSign: 10 },
        { sign: 'taurus', degreeWithinSign: 10 },
        { sign: 'gemini', degreeWithinSign: 20 },
        { sign: 'libra', degreeWithinSign: 0 },
        { sign: 'pisces', degreeWithinSign: 20 },
      ]),
    },
    Object.freeze({
      status: 'summary',
      total: 6,
      ready: 6,
      byRuler: Object.freeze({
        sun: 2,
        moon: 2,
        mercury: 0,
        venus: 0,
        mars: 2,
        jupiter: 0,
        saturn: 0,
      }),
      byDecanIndex: Object.freeze({
        1: 2,
        2: 2,
        3: 2,
      }),
    }),
  ),

  lookupFixture(
    'source-system-star-of-magi-only',
    'sourceSystemSeparation',
    'Lookup result keeps the Star of the Magi source system',
    { sign: 'scorpio', degreeWithinSign: 12 },
    readyExpected(2, 'sun', 10, 20),
  ),

  lookupFixture(
    'strict-exclusions-star-of-magi-only',
    'strictExclusions',
    'Lookup fixture stays limited to the verified Figure 4.7 source',
    { sign: 'aquarius', degreeWithinSign: 25 },
    readyExpected(3, 'moon', 20, 30),
  ),
]);

export function getDecansFixture(id) {
  return DECANS_LOOKUP_FIXTURES.find((fixture) => fixture.id === id) ?? null;
}

export function getDecansFixtureIds() {
  return DECANS_LOOKUP_FIXTURES.map((fixture) => fixture.id);
}

export function getDecansFixtureCategories() {
  return [...new Set(DECANS_LOOKUP_FIXTURES.map((fixture) => fixture.category))];
}
