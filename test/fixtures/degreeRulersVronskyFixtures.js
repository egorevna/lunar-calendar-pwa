const SOURCE_SYSTEM = 'vronsky-degree-rulers';

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

const PLANET_LABELS = Object.freeze({
  sun: 'Солнце',
  moon: 'Луна',
  mercury: 'Меркурий',
  venus: 'Венера',
  mars: 'Марс',
  jupiter: 'Юпитер',
  saturn: 'Сатурн',
  uranus: 'Уран',
  neptune: 'Нептун',
  pluto: 'Плутон',
});

const EMPTY_COUNTS = Object.freeze({
  sun: 0,
  moon: 0,
  mercury: 0,
  venus: 0,
  mars: 0,
  jupiter: 0,
  saturn: 0,
  uranus: 0,
  neptune: 0,
  pluto: 0,
  chiron: 0,
  proserpina: 0,
});

function readyExpected(degreeIndex, rulers) {
  return Object.freeze({
    status: 'ready',
    degreeIndex,
    rulers: Object.freeze(rulers.map((ruler) => Object.freeze({ ...ruler }))),
    sourceSystem: SOURCE_SYSTEM,
  });
}

function invalidExpected(reason = '') {
  return Object.freeze({
    status: 'invalid',
    reason,
  });
}

function summaryExpected(total, ready, byRuler, multiRuler, retrograde, outerPlanet) {
  return Object.freeze({
    status: 'summary',
    total,
    ready,
    byRuler: Object.freeze({ ...EMPTY_COUNTS, ...byRuler }),
    multiRuler,
    retrograde,
    outerPlanet,
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

function planet(key, signKey, degree, minutes, longitude, overrides = {}) {
  return Object.freeze({
    key,
    label: PLANET_LABELS[key],
    sign: signKey ? Object.freeze({ key: signKey, ru: SIGN_LABELS[signKey], symbol: '' }) : null,
    degree,
    minutes,
    longitude,
    source: 'synthetic-fixture',
    ...overrides,
  });
}

const MARS_PLUTO_R = Object.freeze([
  Object.freeze({ key: 'mars', retrograde: false }),
  Object.freeze({ key: 'pluto', retrograde: true }),
]);

const VENUS_CHIRON_R = Object.freeze([
  Object.freeze({ key: 'venus', retrograde: false }),
  Object.freeze({ key: 'chiron', retrograde: true }),
]);

const MERCURY_PROSERPINA = Object.freeze([
  Object.freeze({ key: 'mercury', retrograde: false }),
  Object.freeze({ key: 'proserpina', retrograde: false }),
]);

export const VRONSKY_DEGREE_RULERS_LOOKUP_FIXTURES = Object.freeze([
  lookupFixture('sign-start-aries', 'signStarts', 'Aries 0 starts with Mars and Pluto R', { sign: 'aries', degreeWithinSign: 0 }, readyExpected(0, MARS_PLUTO_R)),
  lookupFixture('sign-start-taurus', 'signStarts', 'Taurus 0 starts with Chiron and Venus R', { sign: 'taurus', degreeWithinSign: 0 }, readyExpected(0, [
    { key: 'chiron', retrograde: false },
    { key: 'venus', retrograde: true },
  ])),
  lookupFixture('sign-start-gemini', 'signStarts', 'Gemini 0 starts with Mercury R and Proserpina', { sign: 'gemini', degreeWithinSign: 0 }, readyExpected(0, [
    { key: 'mercury', retrograde: true },
    { key: 'proserpina', retrograde: false },
  ])),
  lookupFixture('sign-start-cancer', 'signStarts', 'Cancer 0 starts with Moon', { sign: 'cancer', degreeWithinSign: 0 }, readyExpected(0, [{ key: 'moon', retrograde: false }])),
  lookupFixture('sign-start-leo', 'signStarts', 'Leo 0 starts with Sun', { sign: 'leo', degreeWithinSign: 0 }, readyExpected(0, [{ key: 'sun', retrograde: false }])),
  lookupFixture('sign-start-virgo', 'signStarts', 'Virgo 0 starts with Mercury and Proserpina', { sign: 'virgo', degreeWithinSign: 0 }, readyExpected(0, MERCURY_PROSERPINA)),
  lookupFixture('sign-start-libra', 'signStarts', 'Libra 0 starts with Venus and Chiron R', { sign: 'libra', degreeWithinSign: 0 }, readyExpected(0, VENUS_CHIRON_R)),
  lookupFixture('sign-start-scorpio', 'signStarts', 'Scorpio 0 starts with Pluto and Mars R', { sign: 'scorpio', degreeWithinSign: 0 }, readyExpected(0, [
    { key: 'pluto', retrograde: false },
    { key: 'mars', retrograde: true },
  ])),
  lookupFixture('sign-start-sagittarius', 'signStarts', 'Sagittarius 0 starts with Jupiter and Neptune R', { sign: 'sagittarius', degreeWithinSign: 0 }, readyExpected(0, [
    { key: 'jupiter', retrograde: false },
    { key: 'neptune', retrograde: true },
  ])),
  lookupFixture('sign-start-capricorn', 'signStarts', 'Capricorn 0 starts with Saturn and Uranus R', { sign: 'capricorn', degreeWithinSign: 0 }, readyExpected(0, [
    { key: 'saturn', retrograde: false },
    { key: 'uranus', retrograde: true },
  ])),
  lookupFixture('sign-start-aquarius', 'signStarts', 'Aquarius 0 starts with Uranus and Saturn R', { sign: 'aquarius', degreeWithinSign: 0 }, readyExpected(0, [
    { key: 'uranus', retrograde: false },
    { key: 'saturn', retrograde: true },
  ])),
  lookupFixture('sign-start-pisces', 'signStarts', 'Pisces 0 starts with Neptune and Jupiter R', { sign: 'pisces', degreeWithinSign: 0 }, readyExpected(0, [
    { key: 'neptune', retrograde: false },
    { key: 'jupiter', retrograde: true },
  ])),

  lookupFixture('fractional-aries-0', 'fractionalBoundaries', 'Aries 0 floors to 0', { sign: 'aries', degreeWithinSign: 0 }, readyExpected(0, MARS_PLUTO_R)),
  lookupFixture('fractional-aries-0-999', 'fractionalBoundaries', 'Aries 0.999 floors to 0', { sign: 'aries', degreeWithinSign: 0.999 }, readyExpected(0, MARS_PLUTO_R)),
  lookupFixture('fractional-aries-1', 'fractionalBoundaries', 'Aries 1 floors to 1', { sign: 'aries', degreeWithinSign: 1 }, readyExpected(1, [{ key: 'sun', retrograde: false }])),
  lookupFixture('fractional-aries-1-999', 'fractionalBoundaries', 'Aries 1.999 floors to 1', { sign: 'aries', degreeWithinSign: 1.999 }, readyExpected(1, [{ key: 'sun', retrograde: false }])),
  lookupFixture('fractional-aries-2', 'fractionalBoundaries', 'Aries 2 floors to 2', { sign: 'aries', degreeWithinSign: 2 }, readyExpected(2, VENUS_CHIRON_R)),
  lookupFixture('fractional-aries-28-999', 'fractionalBoundaries', 'Aries 28.999 floors to 28', { sign: 'aries', degreeWithinSign: 28.999 }, readyExpected(28, MARS_PLUTO_R)),
  lookupFixture('fractional-aries-29', 'fractionalBoundaries', 'Aries 29 floors to 29', { sign: 'aries', degreeWithinSign: 29 }, readyExpected(29, [{ key: 'sun', retrograde: false }])),
  lookupFixture('fractional-aries-29-999', 'fractionalBoundaries', 'Aries 29.999 floors to 29', { sign: 'aries', degreeWithinSign: 29.999 }, readyExpected(29, [{ key: 'sun', retrograde: false }])),
  lookupFixture('fractional-aries-30-invalid', 'fractionalBoundaries', 'Aries 30 is invalid inside one sign', { sign: 'aries', degreeWithinSign: 30 }, invalidExpected('invalidDegree')),

  lookupFixture('integer-aries-0', 'integerBoundaries', 'Aries degree 0', { sign: 'aries', degreeWithinSign: 0 }, readyExpected(0, MARS_PLUTO_R)),
  lookupFixture('integer-aries-1', 'integerBoundaries', 'Aries degree 1', { sign: 'aries', degreeWithinSign: 1 }, readyExpected(1, [{ key: 'sun', retrograde: false }])),
  lookupFixture('integer-aries-2', 'integerBoundaries', 'Aries degree 2', { sign: 'aries', degreeWithinSign: 2 }, readyExpected(2, VENUS_CHIRON_R)),
  lookupFixture('integer-aries-3', 'integerBoundaries', 'Aries degree 3', { sign: 'aries', degreeWithinSign: 3 }, readyExpected(3, MERCURY_PROSERPINA)),
  lookupFixture('integer-aries-4', 'integerBoundaries', 'Aries degree 4', { sign: 'aries', degreeWithinSign: 4 }, readyExpected(4, [{ key: 'moon', retrograde: false }])),
  lookupFixture('integer-aries-5', 'integerBoundaries', 'Aries degree 5', { sign: 'aries', degreeWithinSign: 5 }, readyExpected(5, [
    { key: 'saturn', retrograde: false },
    { key: 'uranus', retrograde: true },
  ])),
  lookupFixture('integer-aries-6', 'integerBoundaries', 'Aries degree 6', { sign: 'aries', degreeWithinSign: 6 }, readyExpected(6, [
    { key: 'jupiter', retrograde: false },
    { key: 'neptune', retrograde: true },
  ])),
  lookupFixture('integer-aries-29', 'integerBoundaries', 'Aries degree 29', { sign: 'aries', degreeWithinSign: 29 }, readyExpected(29, [{ key: 'sun', retrograde: false }])),

  lookupFixture('integer-taurus-0', 'integerBoundaries', 'Taurus degree 0', { sign: 'taurus', degreeWithinSign: 0 }, readyExpected(0, [
    { key: 'chiron', retrograde: false },
    { key: 'venus', retrograde: true },
  ])),
  lookupFixture('integer-taurus-1', 'integerBoundaries', 'Taurus degree 1', { sign: 'taurus', degreeWithinSign: 1 }, readyExpected(1, MERCURY_PROSERPINA)),
  lookupFixture('integer-taurus-2', 'integerBoundaries', 'Taurus degree 2', { sign: 'taurus', degreeWithinSign: 2 }, readyExpected(2, [{ key: 'moon', retrograde: false }])),
  lookupFixture('integer-taurus-3', 'integerBoundaries', 'Taurus degree 3', { sign: 'taurus', degreeWithinSign: 3 }, readyExpected(3, [
    { key: 'uranus', retrograde: false },
    { key: 'saturn', retrograde: true },
  ])),
  lookupFixture('integer-taurus-4', 'integerBoundaries', 'Taurus degree 4', { sign: 'taurus', degreeWithinSign: 4 }, readyExpected(4, [
    { key: 'jupiter', retrograde: false },
    { key: 'neptune', retrograde: false },
  ])),
  lookupFixture('integer-taurus-5', 'integerBoundaries', 'Taurus degree 5', { sign: 'taurus', degreeWithinSign: 5 }, readyExpected(5, [
    { key: 'pluto', retrograde: false },
    { key: 'mars', retrograde: true },
  ])),
  lookupFixture('integer-taurus-6', 'integerBoundaries', 'Taurus degree 6', { sign: 'taurus', degreeWithinSign: 6 }, readyExpected(6, [{ key: 'sun', retrograde: false }])),
  lookupFixture('integer-taurus-29', 'integerBoundaries', 'Taurus degree 29', { sign: 'taurus', degreeWithinSign: 29 }, readyExpected(29, MERCURY_PROSERPINA)),

  lookupFixture('integer-gemini-0', 'integerBoundaries', 'Gemini degree 0', { sign: 'gemini', degreeWithinSign: 0 }, readyExpected(0, [
    { key: 'mercury', retrograde: true },
    { key: 'proserpina', retrograde: false },
  ])),
  lookupFixture('integer-gemini-1', 'integerBoundaries', 'Gemini degree 1', { sign: 'gemini', degreeWithinSign: 1 }, readyExpected(1, [{ key: 'moon', retrograde: false }])),
  lookupFixture('integer-gemini-2', 'integerBoundaries', 'Gemini degree 2', { sign: 'gemini', degreeWithinSign: 2 }, readyExpected(2, [
    { key: 'uranus', retrograde: false },
    { key: 'saturn', retrograde: false },
  ])),
  lookupFixture('integer-gemini-3', 'integerBoundaries', 'Gemini degree 3', { sign: 'gemini', degreeWithinSign: 3 }, readyExpected(3, [
    { key: 'jupiter', retrograde: false },
    { key: 'neptune', retrograde: true },
  ])),
  lookupFixture('integer-gemini-4', 'integerBoundaries', 'Gemini degree 4', { sign: 'gemini', degreeWithinSign: 4 }, readyExpected(4, [
    { key: 'mars', retrograde: false },
    { key: 'pluto', retrograde: false },
  ])),
  lookupFixture('integer-gemini-5', 'integerBoundaries', 'Gemini degree 5', { sign: 'gemini', degreeWithinSign: 5 }, readyExpected(5, [{ key: 'sun', retrograde: false }])),
  lookupFixture('integer-gemini-6', 'integerBoundaries', 'Gemini degree 6', { sign: 'gemini', degreeWithinSign: 6 }, readyExpected(6, [
    { key: 'venus', retrograde: false },
    { key: 'chiron', retrograde: false },
  ])),
  lookupFixture('integer-gemini-14', 'integerBoundaries', 'Gemini degree 14 keeps Proserpina direct', { sign: 'gemini', degreeWithinSign: 14 }, readyExpected(14, [
    { key: 'mercury', retrograde: true },
    { key: 'proserpina', retrograde: false },
  ])),
  lookupFixture('integer-gemini-29', 'integerBoundaries', 'Gemini degree 29', { sign: 'gemini', degreeWithinSign: 29 }, readyExpected(29, [{ key: 'moon', retrograde: false }])),

  lookupFixture('integer-cancer-0', 'integerBoundaries', 'Cancer degree 0', { sign: 'cancer', degreeWithinSign: 0 }, readyExpected(0, [{ key: 'moon', retrograde: false }])),
  lookupFixture('integer-cancer-1', 'integerBoundaries', 'Cancer degree 1', { sign: 'cancer', degreeWithinSign: 1 }, readyExpected(1, [
    { key: 'saturn', retrograde: false },
    { key: 'uranus', retrograde: true },
  ])),
  lookupFixture('integer-cancer-2', 'integerBoundaries', 'Cancer degree 2', { sign: 'cancer', degreeWithinSign: 2 }, readyExpected(2, [
    { key: 'jupiter', retrograde: false },
    { key: 'neptune', retrograde: true },
  ])),
  lookupFixture('integer-cancer-3', 'integerBoundaries', 'Cancer degree 3', { sign: 'cancer', degreeWithinSign: 3 }, readyExpected(3, MARS_PLUTO_R)),
  lookupFixture('integer-cancer-4', 'integerBoundaries', 'Cancer degree 4', { sign: 'cancer', degreeWithinSign: 4 }, readyExpected(4, [{ key: 'sun', retrograde: false }])),
  lookupFixture('integer-cancer-5', 'integerBoundaries', 'Cancer degree 5', { sign: 'cancer', degreeWithinSign: 5 }, readyExpected(5, [
    { key: 'venus', retrograde: false },
    { key: 'chiron', retrograde: false },
  ])),
  lookupFixture('integer-cancer-6', 'integerBoundaries', 'Cancer degree 6', { sign: 'cancer', degreeWithinSign: 6 }, readyExpected(6, MERCURY_PROSERPINA)),

  lookupFixture('multi-ruler-aries-0', 'multiRuler', 'Aries degree 0 has two rulers', { sign: 'aries', degreeWithinSign: 0 }, readyExpected(0, MARS_PLUTO_R)),
  lookupFixture('multi-ruler-aries-2', 'multiRuler', 'Aries degree 2 has two rulers', { sign: 'aries', degreeWithinSign: 2 }, readyExpected(2, VENUS_CHIRON_R)),
  lookupFixture('multi-ruler-taurus-0', 'multiRuler', 'Taurus degree 0 has two rulers', { sign: 'taurus', degreeWithinSign: 0 }, readyExpected(0, [
    { key: 'chiron', retrograde: false },
    { key: 'venus', retrograde: true },
  ])),
  lookupFixture('multi-ruler-gemini-0', 'multiRuler', 'Gemini degree 0 has two rulers', { sign: 'gemini', degreeWithinSign: 0 }, readyExpected(0, [
    { key: 'mercury', retrograde: true },
    { key: 'proserpina', retrograde: false },
  ])),
  lookupFixture('multi-ruler-cancer-3', 'multiRuler', 'Cancer degree 3 has two rulers', { sign: 'cancer', degreeWithinSign: 3 }, readyExpected(3, MARS_PLUTO_R)),

  lookupFixture('retrograde-aries-0-pluto', 'retrogradeMarkers', 'Aries degree 0 has Pluto R', { sign: 'aries', degreeWithinSign: 0 }, readyExpected(0, MARS_PLUTO_R)),
  lookupFixture('retrograde-aries-2-chiron', 'retrogradeMarkers', 'Aries degree 2 has Chiron R', { sign: 'aries', degreeWithinSign: 2 }, readyExpected(2, VENUS_CHIRON_R)),
  lookupFixture('retrograde-aries-5-uranus', 'retrogradeMarkers', 'Aries degree 5 has Uranus R', { sign: 'aries', degreeWithinSign: 5 }, readyExpected(5, [
    { key: 'saturn', retrograde: false },
    { key: 'uranus', retrograde: true },
  ])),
  lookupFixture('retrograde-taurus-0-venus', 'retrogradeMarkers', 'Taurus degree 0 has Venus R', { sign: 'taurus', degreeWithinSign: 0 }, readyExpected(0, [
    { key: 'chiron', retrograde: false },
    { key: 'venus', retrograde: true },
  ])),
  lookupFixture('retrograde-gemini-0-mercury-only', 'retrogradeMarkers', 'Gemini degree 0 has Mercury R and direct Proserpina', { sign: 'gemini', degreeWithinSign: 0 }, readyExpected(0, [
    { key: 'mercury', retrograde: true },
    { key: 'proserpina', retrograde: false },
  ])),

  lookupFixture('outer-aries-0-pluto', 'outerPlanets', 'Aries degree 0 includes Pluto R', { sign: 'aries', degreeWithinSign: 0 }, readyExpected(0, MARS_PLUTO_R)),
  lookupFixture('outer-aries-5-uranus', 'outerPlanets', 'Aries degree 5 includes Uranus R', { sign: 'aries', degreeWithinSign: 5 }, readyExpected(5, [
    { key: 'saturn', retrograde: false },
    { key: 'uranus', retrograde: true },
  ])),
  lookupFixture('outer-aries-6-neptune', 'outerPlanets', 'Aries degree 6 includes Neptune R', { sign: 'aries', degreeWithinSign: 6 }, readyExpected(6, [
    { key: 'jupiter', retrograde: false },
    { key: 'neptune', retrograde: true },
  ])),
  lookupFixture('outer-taurus-3-uranus', 'outerPlanets', 'Taurus degree 3 includes Uranus and Saturn R', { sign: 'taurus', degreeWithinSign: 3 }, readyExpected(3, [
    { key: 'uranus', retrograde: false },
    { key: 'saturn', retrograde: true },
  ])),

  lookupFixture('chiron-proserpina-aries-2', 'chironProserpina', 'Aries degree 2 includes Chiron R', { sign: 'aries', degreeWithinSign: 2 }, readyExpected(2, VENUS_CHIRON_R)),
  lookupFixture('chiron-proserpina-aries-3', 'chironProserpina', 'Aries degree 3 includes Proserpina', { sign: 'aries', degreeWithinSign: 3 }, readyExpected(3, MERCURY_PROSERPINA)),
  lookupFixture('chiron-proserpina-taurus-0', 'chironProserpina', 'Taurus degree 0 includes Chiron', { sign: 'taurus', degreeWithinSign: 0 }, readyExpected(0, [
    { key: 'chiron', retrograde: false },
    { key: 'venus', retrograde: true },
  ])),
  lookupFixture('chiron-proserpina-taurus-1', 'chironProserpina', 'Taurus degree 1 includes Proserpina', { sign: 'taurus', degreeWithinSign: 1 }, readyExpected(1, MERCURY_PROSERPINA)),
  lookupFixture('chiron-proserpina-gemini-0', 'chironProserpina', 'Gemini degree 0 keeps Proserpina direct', { sign: 'gemini', degreeWithinSign: 0 }, readyExpected(0, [
    { key: 'mercury', retrograde: true },
    { key: 'proserpina', retrograde: false },
  ])),

  lookupFixture('invalid-unknown-sign', 'invalidInputs', 'Unknown sign is invalid', { sign: 'unknown', degreeWithinSign: 10 }, invalidExpected('invalidSign')),
  lookupFixture('invalid-negative-degree', 'invalidInputs', 'Negative degree is invalid', { sign: 'aries', degreeWithinSign: -0.1 }, invalidExpected('invalidDegree')),
  lookupFixture('invalid-degree-30', 'invalidInputs', 'Degree 30 is invalid', { sign: 'aries', degreeWithinSign: 30 }, invalidExpected('invalidDegree')),
  lookupFixture('invalid-degree-nan', 'invalidInputs', 'NaN degree is invalid', { sign: 'aries', degreeWithinSign: Number.NaN }, invalidExpected('invalidDegree')),
  lookupFixture('invalid-missing-sign', 'invalidInputs', 'Missing sign is invalid', { degreeWithinSign: 10 }, invalidExpected('invalidSign')),
  lookupFixture('invalid-missing-degree', 'invalidInputs', 'Missing degree is invalid', { sign: 'aries' }, invalidExpected('invalidDegree')),

  lookupFixture('planet-sign-degree-minutes', 'planetInput', 'Planet with sign degree and minutes', { planet: planet('mars', 'aries', 0, 30, 0.5) }, readyExpected(0, MARS_PLUTO_R)),
  lookupFixture('planet-sign-degree-only', 'planetInput', 'Planet with sign and degree only', { planet: planet('venus', 'gemini', 14, null, 74) }, readyExpected(14, [
    { key: 'mercury', retrograde: true },
    { key: 'proserpina', retrograde: false },
  ])),
  lookupFixture('planet-longitude-fallback', 'planetInput', 'Planet with longitude fallback', { planet: planet('moon', null, null, null, 359.5) }, readyExpected(29, [
    { key: 'mars', retrograde: false },
    { key: 'pluto', retrograde: false },
  ])),
  lookupFixture('planet-invalid-missing-sign-longitude', 'planetInput', 'Planet without sign and longitude is invalid', { planet: planet('saturn', null, null, null, Number.NaN) }, invalidExpected('invalidLookupInput')),

  lookupFixture('summary-mixed-rulers', 'summary', 'Mixed result summary', {
    lookups: Object.freeze([
      Object.freeze({ sign: 'aries', degreeWithinSign: 1 }),
      Object.freeze({ sign: 'aries', degreeWithinSign: 0 }),
      Object.freeze({ sign: 'aries', degreeWithinSign: 2 }),
      Object.freeze({ sign: 'taurus', degreeWithinSign: 1 }),
      Object.freeze({ sign: 'cancer', degreeWithinSign: 1 }),
      Object.freeze({ sign: 'aries', degreeWithinSign: 6 }),
    ]),
  }, summaryExpected(6, 6, {
    sun: 1,
    mercury: 1,
    venus: 1,
    mars: 1,
    jupiter: 1,
    saturn: 1,
    uranus: 1,
    neptune: 1,
    pluto: 1,
    chiron: 1,
    proserpina: 1,
  }, 5, 4, 3)),

  lookupFixture('source-system-separation', 'sourceSystemSeparation', 'Output stays on Vronsky source system', { sign: 'aries', degreeWithinSign: 0 }, readyExpected(0, MARS_PLUTO_R)),
  lookupFixture('strict-exclusions', 'strictExclusions', 'Fixture avoids private data and unsupported systems', { sign: 'gemini', degreeWithinSign: 0 }, readyExpected(0, [
    { key: 'mercury', retrograde: true },
    { key: 'proserpina', retrograde: false },
  ])),
]);

export function getVronskyDegreeRulersFixture(id) {
  return VRONSKY_DEGREE_RULERS_LOOKUP_FIXTURES.find((fixture) => fixture.id === id) ?? null;
}

export function getVronskyDegreeRulersFixtureIds() {
  return VRONSKY_DEGREE_RULERS_LOOKUP_FIXTURES.map((fixture) => fixture.id);
}

export function getVronskyDegreeRulersFixtureCategories() {
  return [...new Set(VRONSKY_DEGREE_RULERS_LOOKUP_FIXTURES.map((fixture) => fixture.category))];
}
