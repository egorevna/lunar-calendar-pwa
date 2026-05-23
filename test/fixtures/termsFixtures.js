function readyExpected(ruler, value, startDegree, printedEndDegree, normalizedEndExclusive) {
  return Object.freeze({
    status: 'ready',
    ruler,
    value,
    startDegree,
    printedEndDegree,
    normalizedEndExclusive,
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

export const TERMS_LOOKUP_FIXTURES = Object.freeze([
  lookupFixture(
    'sign-start-aries',
    'signStarts',
    'Aries 0 starts in Mars term',
    { sign: 'aries', degreeWithinSign: 0 },
    readyExpected('mars', 2, 0, 6, 6),
  ),
  lookupFixture(
    'sign-start-taurus',
    'signStarts',
    'Taurus 0 starts in Venus term',
    { sign: 'taurus', degreeWithinSign: 0 },
    readyExpected('venus', 1, 0, 8, 8),
  ),
  lookupFixture(
    'sign-start-gemini',
    'signStarts',
    'Gemini 0 starts in Mercury term',
    { sign: 'gemini', degreeWithinSign: 0 },
    readyExpected('mercury', 2, 0, 8, 8),
  ),
  lookupFixture(
    'sign-start-cancer',
    'signStarts',
    'Cancer 0 starts in Mars term',
    { sign: 'cancer', degreeWithinSign: 0 },
    readyExpected('mars', -1, 0, 7, 7),
  ),
  lookupFixture(
    'sign-start-leo',
    'signStarts',
    'Leo 0 starts in Jupiter term',
    { sign: 'leo', degreeWithinSign: 0 },
    readyExpected('jupiter', 1, 0, 8, 8),
  ),
  lookupFixture(
    'sign-start-virgo',
    'signStarts',
    'Virgo 0 starts in Mercury term',
    { sign: 'virgo', degreeWithinSign: 0 },
    readyExpected('mercury', 2, 0, 7, 7),
  ),
  lookupFixture(
    'sign-start-libra',
    'signStarts',
    'Libra 0 starts in Saturn term',
    { sign: 'libra', degreeWithinSign: 0 },
    readyExpected('saturn', 2, 0, 6, 6),
  ),
  lookupFixture(
    'sign-start-scorpio',
    'signStarts',
    'Scorpio 0 starts in Mars term',
    { sign: 'scorpio', degreeWithinSign: 0 },
    readyExpected('mars', 2, 0, 7, 7),
  ),
  lookupFixture(
    'sign-start-sagittarius',
    'signStarts',
    'Sagittarius 0 starts in Jupiter term',
    { sign: 'sagittarius', degreeWithinSign: 0 },
    readyExpected('jupiter', 2, 0, 9, 9),
  ),
  lookupFixture(
    'sign-start-capricorn',
    'signStarts',
    'Capricorn 0 starts in Saturn term',
    { sign: 'capricorn', degreeWithinSign: 0 },
    readyExpected('saturn', 2, 0, 7, 7),
  ),
  lookupFixture(
    'sign-start-aquarius',
    'signStarts',
    'Aquarius 0 starts in Saturn term',
    { sign: 'aquarius', degreeWithinSign: 0 },
    readyExpected('saturn', 2, 0, 6, 6),
  ),
  lookupFixture(
    'sign-start-pisces',
    'signStarts',
    'Pisces 0 starts in Venus term',
    { sign: 'pisces', degreeWithinSign: 0 },
    readyExpected('venus', 2, 0, 8, 8),
  ),

  lookupFixture(
    'boundary-aries-6',
    'exactBoundaries',
    'Aries 6 moves to Venus term',
    { sign: 'aries', degreeWithinSign: 6 },
    readyExpected('venus', -1, 6, 12, 12),
  ),
  lookupFixture(
    'boundary-aries-12',
    'exactBoundaries',
    'Aries 12 moves to Mercury term',
    { sign: 'aries', degreeWithinSign: 12 },
    readyExpected('mercury', 1, 12, 18, 18),
  ),
  lookupFixture(
    'boundary-aries-18',
    'exactBoundaries',
    'Aries 18 moves to Jupiter term',
    { sign: 'aries', degreeWithinSign: 18 },
    readyExpected('jupiter', 2, 18, 25, 25),
  ),
  lookupFixture(
    'boundary-aries-25',
    'exactBoundaries',
    'Aries 25 moves to Saturn final term',
    { sign: 'aries', degreeWithinSign: 25 },
    readyExpected('saturn', 1, 25, 29, 30),
  ),
  lookupFixture(
    'boundary-taurus-8',
    'exactBoundaries',
    'Taurus 8 moves to Mercury term',
    { sign: 'taurus', degreeWithinSign: 8 },
    readyExpected('mercury', 1, 8, 15, 15),
  ),
  lookupFixture(
    'boundary-virgo-21',
    'exactBoundaries',
    'Virgo 21 moves to Mars term',
    { sign: 'virgo', degreeWithinSign: 21 },
    readyExpected('mars', 2, 21, 26, 26),
  ),
  lookupFixture(
    'boundary-aquarius-25',
    'exactBoundaries',
    'Aquarius 25 moves to Mars term',
    { sign: 'aquarius', degreeWithinSign: 25 },
    readyExpected('mars', -1, 25, 30, 30),
  ),
  lookupFixture(
    'boundary-pisces-24',
    'exactBoundaries',
    'Pisces 24 moves to Mars term',
    { sign: 'pisces', degreeWithinSign: 24 },
    readyExpected('mars', 1, 24, 30, 30),
  ),

  lookupFixture(
    'final-printed-29-aries',
    'finalPrinted29Normalization',
    'Aries 29.999 stays in Saturn term',
    { sign: 'aries', degreeWithinSign: 29.999 },
    readyExpected('saturn', 1, 25, 29, 30),
  ),
  lookupFixture(
    'final-printed-29-taurus',
    'finalPrinted29Normalization',
    'Taurus 29.999 stays in Mars term',
    { sign: 'taurus', degreeWithinSign: 29.999 },
    readyExpected('mars', 1, 24, 29, 30),
  ),
  lookupFixture(
    'final-printed-29-libra',
    'finalPrinted29Normalization',
    'Libra 29.999 stays in Venus term',
    { sign: 'libra', degreeWithinSign: 29.999 },
    readyExpected('venus', 2, 26, 29, 30),
  ),
  lookupFixture(
    'final-printed-29-scorpio',
    'finalPrinted29Normalization',
    'Scorpio 29.999 stays in Saturn term',
    { sign: 'scorpio', degreeWithinSign: 29.999 },
    readyExpected('saturn', 1, 25, 29, 30),
  ),

  lookupFixture(
    'final-printed-30-gemini',
    'finalPrinted30',
    'Gemini 29.999 stays in Mars term',
    { sign: 'gemini', degreeWithinSign: 29.999 },
    readyExpected('mars', 1, 27, 30, 30),
  ),
  lookupFixture(
    'final-printed-30-sagittarius',
    'finalPrinted30',
    'Sagittarius 29.999 stays in Saturn term',
    { sign: 'sagittarius', degreeWithinSign: 29.999 },
    readyExpected('saturn', 2, 24, 30, 30),
  ),
  lookupFixture(
    'final-printed-30-pisces',
    'finalPrinted30',
    'Pisces 29.999 stays in Mars term',
    { sign: 'pisces', degreeWithinSign: 29.999 },
    readyExpected('mars', 1, 24, 30, 30),
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
    readyExpected('saturn', 1, 25, 29, 30),
  ),
  lookupFixture(
    'planet-longitude-fallback',
    'planetInput',
    'Planet input can resolve sign and degree from longitude',
    {
      planet: planet('venus', 'Венера', null, null, null, 359.5),
    },
    readyExpected('mars', 1, 24, 30, 30),
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
    'summary-mixed-values',
    'summary',
    'Mixed terms summary counts rulers and values',
    {
      lookups: Object.freeze([
        { sign: 'aries', degreeWithinSign: 0 },
        { sign: 'aries', degreeWithinSign: 6 },
        { sign: 'pisces', degreeWithinSign: 14 },
        { sign: 'aquarius', degreeWithinSign: 25 },
        { sign: 'libra', degreeWithinSign: 26 },
      ]),
    },
    Object.freeze({
      status: 'summary',
      total: 5,
      ready: 5,
      byRuler: Object.freeze({
        mars: 2,
        venus: 2,
        mercury: 1,
        jupiter: 0,
        saturn: 0,
      }),
      positive: 2,
      negative: 3,
      scoreTotal: 0,
    }),
  ),

  lookupFixture(
    'strict-exclusions-terms-only',
    'strictExclusions',
    'Terms lookup fixture stays limited to verified terms data',
    { sign: 'taurus', degreeWithinSign: 20 },
    readyExpected('saturn', -1, 20, 24, 24),
  ),
]);

export function getTermsFixture(id) {
  return TERMS_LOOKUP_FIXTURES.find((fixture) => fixture.id === id) ?? null;
}

export function getTermsFixtureIds() {
  return TERMS_LOOKUP_FIXTURES.map((fixture) => fixture.id);
}

export function getTermsFixtureCategories() {
  return [...new Set(TERMS_LOOKUP_FIXTURES.map((fixture) => fixture.category))];
}
