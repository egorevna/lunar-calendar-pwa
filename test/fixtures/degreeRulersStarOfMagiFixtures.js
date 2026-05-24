const SOURCE_SYSTEM = 'star-of-magi-degree-rulers';

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

function readyExpected(degreeIndex, ruler) {
  return Object.freeze({
    status: 'ready',
    degreeIndex,
    ruler,
    sourceSystem: SOURCE_SYSTEM,
  });
}

function invalidExpected(reason = '') {
  return Object.freeze({
    status: 'invalid',
    reason,
  });
}

function summaryExpected(total, ready, byRuler) {
  return Object.freeze({
    status: 'summary',
    total,
    ready,
    byRuler: Object.freeze(byRuler),
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

export const DEGREE_RULERS_STAR_OF_MAGI_LOOKUP_FIXTURES = Object.freeze([
  lookupFixture(
    'sign-start-aries',
    'signStarts',
    'Aries 0 starts with Mars',
    { sign: 'aries', degreeWithinSign: 0 },
    readyExpected(0, 'mars'),
  ),
  lookupFixture(
    'sign-start-taurus',
    'signStarts',
    'Taurus 0 starts with Venus',
    { sign: 'taurus', degreeWithinSign: 0 },
    readyExpected(0, 'venus'),
  ),
  lookupFixture(
    'sign-start-gemini',
    'signStarts',
    'Gemini 0 starts with Moon',
    { sign: 'gemini', degreeWithinSign: 0 },
    readyExpected(0, 'moon'),
  ),
  lookupFixture(
    'sign-start-cancer',
    'signStarts',
    'Cancer 0 starts with Jupiter',
    { sign: 'cancer', degreeWithinSign: 0 },
    readyExpected(0, 'jupiter'),
  ),
  lookupFixture(
    'sign-start-leo',
    'signStarts',
    'Leo 0 starts with Sun',
    { sign: 'leo', degreeWithinSign: 0 },
    readyExpected(0, 'sun'),
  ),
  lookupFixture(
    'sign-start-virgo',
    'signStarts',
    'Virgo 0 starts with Mercury',
    { sign: 'virgo', degreeWithinSign: 0 },
    readyExpected(0, 'mercury'),
  ),
  lookupFixture(
    'sign-start-libra',
    'signStarts',
    'Libra 0 starts with Saturn',
    { sign: 'libra', degreeWithinSign: 0 },
    readyExpected(0, 'saturn'),
  ),
  lookupFixture(
    'sign-start-scorpio',
    'signStarts',
    'Scorpio 0 starts with Mars',
    { sign: 'scorpio', degreeWithinSign: 0 },
    readyExpected(0, 'mars'),
  ),
  lookupFixture(
    'sign-start-sagittarius',
    'signStarts',
    'Sagittarius 0 starts with Venus',
    { sign: 'sagittarius', degreeWithinSign: 0 },
    readyExpected(0, 'venus'),
  ),
  lookupFixture(
    'sign-start-capricorn',
    'signStarts',
    'Capricorn 0 starts with Moon',
    { sign: 'capricorn', degreeWithinSign: 0 },
    readyExpected(0, 'moon'),
  ),
  lookupFixture(
    'sign-start-aquarius',
    'signStarts',
    'Aquarius 0 starts with Jupiter',
    { sign: 'aquarius', degreeWithinSign: 0 },
    readyExpected(0, 'jupiter'),
  ),
  lookupFixture(
    'sign-start-pisces',
    'signStarts',
    'Pisces 0 starts with Sun',
    { sign: 'pisces', degreeWithinSign: 0 },
    readyExpected(0, 'sun'),
  ),

  lookupFixture(
    'fractional-aries-0-999',
    'fractionalBoundaries',
    'Aries 0.999 floors to 0',
    { sign: 'aries', degreeWithinSign: 0.999 },
    readyExpected(0, 'mars'),
  ),
  lookupFixture(
    'fractional-aries-1',
    'fractionalBoundaries',
    'Aries 1 floors to 1',
    { sign: 'aries', degreeWithinSign: 1 },
    readyExpected(1, 'sun'),
  ),
  lookupFixture(
    'fractional-aries-1-999',
    'fractionalBoundaries',
    'Aries 1.999 floors to 1',
    { sign: 'aries', degreeWithinSign: 1.999 },
    readyExpected(1, 'sun'),
  ),
  lookupFixture(
    'fractional-aries-2',
    'fractionalBoundaries',
    'Aries 2 floors to 2',
    { sign: 'aries', degreeWithinSign: 2 },
    readyExpected(2, 'venus'),
  ),
  lookupFixture(
    'fractional-aries-28-999',
    'fractionalBoundaries',
    'Aries 28.999 floors to 28',
    { sign: 'aries', degreeWithinSign: 28.999 },
    readyExpected(28, 'mars'),
  ),
  lookupFixture(
    'fractional-aries-29',
    'fractionalBoundaries',
    'Aries 29 floors to 29',
    { sign: 'aries', degreeWithinSign: 29 },
    readyExpected(29, 'sun'),
  ),
  lookupFixture(
    'fractional-aries-29-999',
    'fractionalBoundaries',
    'Aries 29.999 floors to 29',
    { sign: 'aries', degreeWithinSign: 29.999 },
    readyExpected(29, 'sun'),
  ),
  lookupFixture(
    'fractional-aries-30-invalid',
    'fractionalBoundaries',
    'Aries 30 is invalid inside one sign',
    { sign: 'aries', degreeWithinSign: 30 },
    invalidExpected('invalidDegree'),
  ),

  lookupFixture('integer-aries-0', 'integerBoundaries', 'Aries degree 0', { sign: 'aries', degreeWithinSign: 0 }, readyExpected(0, 'mars')),
  lookupFixture('integer-aries-1', 'integerBoundaries', 'Aries degree 1', { sign: 'aries', degreeWithinSign: 1 }, readyExpected(1, 'sun')),
  lookupFixture('integer-aries-2', 'integerBoundaries', 'Aries degree 2', { sign: 'aries', degreeWithinSign: 2 }, readyExpected(2, 'venus')),
  lookupFixture('integer-aries-3', 'integerBoundaries', 'Aries degree 3', { sign: 'aries', degreeWithinSign: 3 }, readyExpected(3, 'mercury')),
  lookupFixture('integer-aries-4', 'integerBoundaries', 'Aries degree 4', { sign: 'aries', degreeWithinSign: 4 }, readyExpected(4, 'moon')),
  lookupFixture('integer-aries-5', 'integerBoundaries', 'Aries degree 5', { sign: 'aries', degreeWithinSign: 5 }, readyExpected(5, 'saturn')),
  lookupFixture('integer-aries-6', 'integerBoundaries', 'Aries degree 6', { sign: 'aries', degreeWithinSign: 6 }, readyExpected(6, 'jupiter')),
  lookupFixture('integer-aries-29', 'integerBoundaries', 'Aries degree 29', { sign: 'aries', degreeWithinSign: 29 }, readyExpected(29, 'sun')),

  lookupFixture('integer-taurus-0', 'integerBoundaries', 'Taurus degree 0', { sign: 'taurus', degreeWithinSign: 0 }, readyExpected(0, 'venus')),
  lookupFixture('integer-taurus-1', 'integerBoundaries', 'Taurus degree 1', { sign: 'taurus', degreeWithinSign: 1 }, readyExpected(1, 'mercury')),
  lookupFixture('integer-taurus-2', 'integerBoundaries', 'Taurus degree 2', { sign: 'taurus', degreeWithinSign: 2 }, readyExpected(2, 'moon')),
  lookupFixture('integer-taurus-3', 'integerBoundaries', 'Taurus degree 3', { sign: 'taurus', degreeWithinSign: 3 }, readyExpected(3, 'saturn')),
  lookupFixture('integer-taurus-4', 'integerBoundaries', 'Taurus degree 4', { sign: 'taurus', degreeWithinSign: 4 }, readyExpected(4, 'jupiter')),
  lookupFixture('integer-taurus-5', 'integerBoundaries', 'Taurus degree 5', { sign: 'taurus', degreeWithinSign: 5 }, readyExpected(5, 'mars')),
  lookupFixture('integer-taurus-6', 'integerBoundaries', 'Taurus degree 6', { sign: 'taurus', degreeWithinSign: 6 }, readyExpected(6, 'sun')),
  lookupFixture('integer-taurus-29', 'integerBoundaries', 'Taurus degree 29', { sign: 'taurus', degreeWithinSign: 29 }, readyExpected(29, 'mercury')),

  lookupFixture('integer-gemini-0', 'integerBoundaries', 'Gemini degree 0', { sign: 'gemini', degreeWithinSign: 0 }, readyExpected(0, 'moon')),
  lookupFixture('integer-gemini-1', 'integerBoundaries', 'Gemini degree 1', { sign: 'gemini', degreeWithinSign: 1 }, readyExpected(1, 'saturn')),
  lookupFixture('integer-gemini-2', 'integerBoundaries', 'Gemini degree 2', { sign: 'gemini', degreeWithinSign: 2 }, readyExpected(2, 'jupiter')),
  lookupFixture('integer-gemini-3', 'integerBoundaries', 'Gemini degree 3', { sign: 'gemini', degreeWithinSign: 3 }, readyExpected(3, 'mars')),
  lookupFixture('integer-gemini-4', 'integerBoundaries', 'Gemini degree 4', { sign: 'gemini', degreeWithinSign: 4 }, readyExpected(4, 'sun')),
  lookupFixture('integer-gemini-5', 'integerBoundaries', 'Gemini degree 5', { sign: 'gemini', degreeWithinSign: 5 }, readyExpected(5, 'venus')),
  lookupFixture('integer-gemini-6', 'integerBoundaries', 'Gemini degree 6', { sign: 'gemini', degreeWithinSign: 6 }, readyExpected(6, 'mercury')),
  lookupFixture('integer-gemini-29', 'integerBoundaries', 'Gemini degree 29', { sign: 'gemini', degreeWithinSign: 29 }, readyExpected(29, 'saturn')),

  lookupFixture('integer-pisces-0', 'integerBoundaries', 'Pisces degree 0', { sign: 'pisces', degreeWithinSign: 0 }, readyExpected(0, 'sun')),
  lookupFixture('integer-pisces-1', 'integerBoundaries', 'Pisces degree 1', { sign: 'pisces', degreeWithinSign: 1 }, readyExpected(1, 'venus')),
  lookupFixture('integer-pisces-2', 'integerBoundaries', 'Pisces degree 2', { sign: 'pisces', degreeWithinSign: 2 }, readyExpected(2, 'mercury')),
  lookupFixture('integer-pisces-3', 'integerBoundaries', 'Pisces degree 3', { sign: 'pisces', degreeWithinSign: 3 }, readyExpected(3, 'moon')),
  lookupFixture('integer-pisces-4', 'integerBoundaries', 'Pisces degree 4', { sign: 'pisces', degreeWithinSign: 4 }, readyExpected(4, 'saturn')),
  lookupFixture('integer-pisces-5', 'integerBoundaries', 'Pisces degree 5', { sign: 'pisces', degreeWithinSign: 5 }, readyExpected(5, 'jupiter')),
  lookupFixture('integer-pisces-6', 'integerBoundaries', 'Pisces degree 6', { sign: 'pisces', degreeWithinSign: 6 }, readyExpected(6, 'mars')),
  lookupFixture('integer-pisces-29', 'integerBoundaries', 'Pisces degree 29', { sign: 'pisces', degreeWithinSign: 29 }, readyExpected(29, 'venus')),

  lookupFixture('invalid-unknown-sign', 'invalidInputs', 'Unknown sign returns invalid', { sign: 'unknown', degreeWithinSign: 10 }, invalidExpected('invalidSign')),
  lookupFixture('invalid-negative-degree', 'invalidInputs', 'Negative degree returns invalid', { sign: 'aries', degreeWithinSign: -0.1 }, invalidExpected('invalidDegree')),
  lookupFixture('invalid-degree-30', 'invalidInputs', 'Degree 30 returns invalid', { sign: 'aries', degreeWithinSign: 30 }, invalidExpected('invalidDegree')),
  lookupFixture('invalid-nan-degree', 'invalidInputs', 'NaN returns invalid', { sign: 'aries', degreeWithinSign: Number.NaN }, invalidExpected('invalidDegree')),
  lookupFixture('invalid-missing-sign', 'invalidInputs', 'Missing sign returns invalid', { degreeWithinSign: 10 }, invalidExpected('invalidSign')),
  lookupFixture('invalid-missing-degree', 'invalidInputs', 'Missing degree returns invalid', { sign: 'aries' }, invalidExpected('invalidDegree')),

  lookupFixture(
    'planet-sign-degree-minutes',
    'planetInput',
    'Planet with sign degree and minutes',
    { planet: planet('mars', 'Марс', 'aries', 25, 30, 25.5) },
    readyExpected(25, 'moon'),
  ),
  lookupFixture(
    'planet-sign-degree-only',
    'planetInput',
    'Planet with sign and degree only',
    { planet: planet('venus', 'Венера', 'taurus', 6, null, 36) },
    readyExpected(6, 'sun'),
  ),
  lookupFixture(
    'planet-longitude-fallback',
    'planetInput',
    'Planet with longitude fallback',
    { planet: planet('moon', 'Луна', null, null, null, 359.5) },
    readyExpected(29, 'venus'),
  ),
  lookupFixture(
    'planet-invalid-no-sign-no-longitude',
    'planetInput',
    'Invalid planet without usable sign or longitude',
    { planet: planet('saturn', 'Сатурн', null, null, null, Number.NaN) },
    invalidExpected('invalidLookupInput'),
  ),

  lookupFixture(
    'summary-mixed-rulers',
    'summary',
    'Summary counts a mixed ready result set',
    {
      lookups: Object.freeze([
        Object.freeze({ sign: 'aries', degreeWithinSign: 0 }),
        Object.freeze({ sign: 'aries', degreeWithinSign: 1 }),
        Object.freeze({ sign: 'taurus', degreeWithinSign: 0 }),
        Object.freeze({ sign: 'gemini', degreeWithinSign: 1 }),
        Object.freeze({ sign: 'pisces', degreeWithinSign: 6 }),
      ]),
    },
    summaryExpected(5, 5, {
      sun: 1,
      moon: 0,
      mercury: 0,
      venus: 1,
      mars: 2,
      jupiter: 0,
      saturn: 1,
    }),
  ),

  lookupFixture(
    'source-system-table-6-only',
    'sourceSystemSeparation',
    'Output keeps the Table 6 source system',
    { sign: 'aries', degreeWithinSign: 1.2 },
    readyExpected(1, 'sun'),
  ),

  lookupFixture(
    'strict-exclusion-safe-ready-output',
    'strictExclusions',
    'Ready output remains source-limited and private-data-free',
    { sign: 'pisces', degreeWithinSign: 29.999 },
    readyExpected(29, 'venus'),
  ),
]);

export function getDegreeRulersStarOfMagiFixture(id) {
  return DEGREE_RULERS_STAR_OF_MAGI_LOOKUP_FIXTURES.find((fixture) => fixture.id === id) ?? null;
}

export function getDegreeRulersStarOfMagiFixtureIds() {
  return DEGREE_RULERS_STAR_OF_MAGI_LOOKUP_FIXTURES.map((fixture) => fixture.id);
}

export function getDegreeRulersStarOfMagiFixtureCategories() {
  return [...new Set(DEGREE_RULERS_STAR_OF_MAGI_LOOKUP_FIXTURES.map((fixture) => fixture.category))];
}
