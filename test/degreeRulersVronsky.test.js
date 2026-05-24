import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import {
  evaluateVronskyDegreeRulersForPlanets,
  getVronskyDegreeIndex,
  getVronskyDegreeRulersEngineCapabilities,
  getVronskyDegreeRulersSummary,
  getVronskyRulerLabel,
  isValidVronskyDegreeRulerLookupDegree,
  lookupVronskyDegreeRulers,
  lookupVronskyDegreeRulersForPlanet,
  resolveVronskyDegreeRulerLookupInput,
} from '../src/degreeRulersVronsky.js';

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

function planet(key, signKey, degree, minutes, longitude, overrides = {}) {
  return {
    key,
    label: PLANET_LABELS[key],
    sign: signKey ? { key: signKey, ru: '', symbol: '' } : null,
    degree,
    minutes,
    longitude,
    source: 'synthetic-vronsky-degree-ruler-test',
    ...overrides,
  };
}

function assertReadyVronskyDegreeRulers(result, expected) {
  assert.equal(result.status, 'ready');
  assert.equal(result.degreeIndex, expected.degreeIndex);
  assertRulers(result.rulers ?? result.degreeRulers, expected.rulers);
}

function assertRulers(actual, expected) {
  assert.equal(Array.isArray(actual), true);
  assert.deepEqual(
    actual.map((ruler) => ({
      key: ruler.key,
      rulerRu: ruler.rulerRu,
      retrograde: ruler.retrograde,
      sourceToken: ruler.sourceToken,
    })),
    expected.map((ruler) => ({
      key: ruler.key,
      rulerRu: getVronskyRulerLabel(ruler.key),
      retrograde: ruler.retrograde,
      sourceToken: sourceTokenFor(ruler.key, ruler.retrograde),
    })),
  );
}

function sourceTokenFor(key, retrograde) {
  const token = {
    sun: 'Sun',
    moon: 'Moon',
    mercury: 'Mercury',
    venus: 'Venus',
    mars: 'Mars',
    jupiter: 'Jupiter',
    saturn: 'Saturn',
    uranus: 'Uranus',
    neptune: 'Neptune',
    pluto: 'Pluto',
    chiron: 'Chiron',
    proserpina: 'Proserpina',
  }[key];

  return retrograde ? `${token} R` : token;
}

function assertInvalid(result) {
  assert.equal(result.status, 'invalid');
  assert.equal(typeof result.reason, 'string');
  assert.equal(result.degreeRulers, null);
}

test('lookupVronskyDegreeRulers returns ready for Aries 0 Mars and Pluto R', () => {
  const result = lookupVronskyDegreeRulers('aries', 0);

  assert.equal(result.sign, 'aries');
  assert.equal(result.signRu, 'Овен');
  assert.equal(result.degreeWithinSign, 0);
  assert.deepEqual(result.sourceTokens, ['Mars', 'Pluto R']);
  assertReadyVronskyDegreeRulers(result, {
    degreeIndex: 0,
    rulers: [
      { key: 'mars', retrograde: false },
      { key: 'pluto', retrograde: true },
    ],
  });
  assert.deepEqual(result.source, {
    sourceKey: 'degree-rulers-vronsky-table-7',
    sourceSystem: 'vronsky-degree-rulers',
    tableNumber: 7,
    verificationStatus: 'verified',
  });
});

test('Aries fractional boundary lookup floors degreeWithinSign', () => {
  assertReadyVronskyDegreeRulers(lookupVronskyDegreeRulers('aries', 0.999), {
    degreeIndex: 0,
    rulers: [
      { key: 'mars', retrograde: false },
      { key: 'pluto', retrograde: true },
    ],
  });
  assertReadyVronskyDegreeRulers(lookupVronskyDegreeRulers('aries', 1), {
    degreeIndex: 1,
    rulers: [{ key: 'sun', retrograde: false }],
  });
  assertReadyVronskyDegreeRulers(lookupVronskyDegreeRulers('aries', 1.999), {
    degreeIndex: 1,
    rulers: [{ key: 'sun', retrograde: false }],
  });
  assertReadyVronskyDegreeRulers(lookupVronskyDegreeRulers('aries', 2), {
    degreeIndex: 2,
    rulers: [
      { key: 'venus', retrograde: false },
      { key: 'chiron', retrograde: true },
    ],
  });
  assertReadyVronskyDegreeRulers(lookupVronskyDegreeRulers('aries', 29), {
    degreeIndex: 29,
    rulers: [{ key: 'sun', retrograde: false }],
  });
  assertReadyVronskyDegreeRulers(lookupVronskyDegreeRulers('aries', 29.999), {
    degreeIndex: 29,
    rulers: [{ key: 'sun', retrograde: false }],
  });
});

test('invalid degree sign and NaN fail safely', () => {
  assertInvalid(lookupVronskyDegreeRulers('aries', 30));
  assertInvalid(lookupVronskyDegreeRulers('aries', -0.1));
  assertInvalid(lookupVronskyDegreeRulers('unknown', 10));
  assertInvalid(lookupVronskyDegreeRulers('aries', Number.NaN));
  assertInvalid(lookupVronskyDegreeRulers('', 10));
  assertInvalid(lookupVronskyDegreeRulers('aries', undefined));
});

test('degree validation and index helpers use 0 <= degree < 30', () => {
  assert.equal(isValidVronskyDegreeRulerLookupDegree(0), true);
  assert.equal(isValidVronskyDegreeRulerLookupDegree(29.999), true);
  assert.equal(isValidVronskyDegreeRulerLookupDegree(30), false);
  assert.equal(isValidVronskyDegreeRulerLookupDegree(-0.1), false);
  assert.equal(isValidVronskyDegreeRulerLookupDegree(Number.NaN), false);
  assert.equal(isValidVronskyDegreeRulerLookupDegree('5'), false);

  assert.equal(getVronskyDegreeIndex(0), 0);
  assert.equal(getVronskyDegreeIndex(0.999), 0);
  assert.equal(getVronskyDegreeIndex(29.999), 29);
  assert.equal(getVronskyDegreeIndex(30), null);
});

test('resolveVronskyDegreeRulerLookupInput resolves sign degree and index', () => {
  assert.deepEqual(resolveVronskyDegreeRulerLookupInput({ sign: 'aries', degreeWithinSign: 1.2 }), {
    status: 'ready',
    signKey: 'aries',
    degreeWithinSign: 1.2,
    degreeIndex: 1,
  });
  assert.equal(resolveVronskyDegreeRulerLookupInput({ sign: 'unknown', degreeWithinSign: 1.2 }).status, 'invalid');
  assert.equal(resolveVronskyDegreeRulerLookupInput({ sign: 'aries', degreeWithinSign: 30 }).status, 'invalid');
});

test('lookupVronskyDegreeRulersForPlanet works with sign degree and minutes', () => {
  const result = lookupVronskyDegreeRulersForPlanet(planet('mars', 'aries', 0, 30, 0.5));

  assert.equal(result.status, 'ready');
  assert.equal(result.planetKey, 'mars');
  assert.equal(result.planetLabel, 'Марс');
  assert.equal(result.sign, 'aries');
  assert.equal(result.signRu, 'Овен');
  assert.equal(result.degreeWithinSign, 0.5);
  assert.equal(result.degreeIndex, 0);
  assert.equal(result.source, 'degree-rulers-vronsky-table-7');
  assert.equal(result.sourceSystem, 'vronsky-degree-rulers');
  assert.deepEqual(result.sourceTokens, ['Mars', 'Pluto R']);
  assertRulers(result.degreeRulers, [
    { key: 'mars', retrograde: false },
    { key: 'pluto', retrograde: true },
  ]);
});

test('lookupVronskyDegreeRulersForPlanet works with sign and degree only', () => {
  const result = lookupVronskyDegreeRulersForPlanet(planet('venus', 'gemini', 14, null, 74));

  assert.equal(result.status, 'ready');
  assert.equal(result.sign, 'gemini');
  assert.equal(result.degreeWithinSign, 14);
  assert.equal(result.degreeIndex, 14);
  assert.deepEqual(result.sourceTokens, ['Mercury R', 'Proserpina']);
  assertRulers(result.degreeRulers, [
    { key: 'mercury', retrograde: true },
    { key: 'proserpina', retrograde: false },
  ]);
});

test('lookupVronskyDegreeRulersForPlanet works with longitude fallback', () => {
  const result = lookupVronskyDegreeRulersForPlanet(planet('moon', null, null, null, 359.5));

  assert.equal(result.status, 'ready');
  assert.equal(result.sign, 'pisces');
  assert.equal(result.signRu, 'Рыбы');
  assert.equal(result.degreeWithinSign, 29.5);
  assert.equal(result.degreeIndex, 29);
  assert.equal(result.sourceSystem, 'vronsky-degree-rulers');
  assert.deepEqual(result.sourceTokens, ['Mars', 'Pluto']);
  assertRulers(result.degreeRulers, [
    { key: 'mars', retrograde: false },
    { key: 'pluto', retrograde: false },
  ]);
});

test('lookupVronskyDegreeRulersForPlanet fails safely when sign and longitude are insufficient', () => {
  assertInvalid(lookupVronskyDegreeRulersForPlanet(planet('saturn', null, null, null, Number.NaN)));
  assertInvalid(lookupVronskyDegreeRulersForPlanet({ ...planet('saturn', 'capricorn', 0, 0, 270), key: 'chiron' }));
  assertInvalid(lookupVronskyDegreeRulersForPlanet({ ...planet('saturn', 'capricorn', 0, 0, 270), label: '' }));
});

test('evaluateVronskyDegreeRulersForPlanets returns ready results for valid planets in canonical order', () => {
  const results = evaluateVronskyDegreeRulersForPlanets([
    planet('mars', 'aries', 0, 30, 0.5),
    null,
    planet('sun', 'taurus', 0, 0, 30),
    { ...planet('moon', null, null, null, Number.NaN) },
    planet('venus', 'pisces', 29, 0, 359),
  ]);

  assert.deepEqual(results.map((result) => result.planetKey), ['sun', 'venus', 'mars']);
  assert.equal(results.length, 3);
  assert.equal(results.every((result) => result.status === 'ready'), true);
});

test('getVronskyDegreeRulersSummary counts by ruler occurrences and row traits', () => {
  const results = [
    lookupVronskyDegreeRulers('aries', 1),
    lookupVronskyDegreeRulers('aries', 0),
    lookupVronskyDegreeRulers('aries', 2),
    lookupVronskyDegreeRulers('taurus', 1),
    lookupVronskyDegreeRulers('cancer', 1),
    lookupVronskyDegreeRulers('aries', 6),
  ];
  const summary = getVronskyDegreeRulersSummary(results);

  assert.deepEqual(summary, {
    total: 6,
    ready: 6,
    byRuler: {
      ...EMPTY_COUNTS,
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
    },
    multiRuler: 5,
    retrograde: 4,
    outerPlanet: 3,
    text: '6 управителей градусов по Вронскому найдено',
  });
});

test('getVronskyDegreeRulersEngineCapabilities reports only Table 7 engine capabilities', () => {
  assert.deepEqual(getVronskyDegreeRulersEngineCapabilities(), {
    source: 'degree-rulers-vronsky-table-7',
    sourceSystem: 'vronsky-degree-rulers',
    degreeRulers: true,
    table7Vronsky: true,
    table6StarOfMagi: false,
    supportsMultipleRulers: true,
    supportsRetrogradeMarkers: true,
    supportsOuterPlanets: true,
    supportsChiron: true,
    supportsProserpina: true,
    terms: false,
    decans: false,
    fixedStars: false,
    houses: false,
    ascMc: false,
    transits: false,
    interpretations: false,
  });
});

test('lookup output preserves source tokens rulers retrograde Chiron and Proserpina', () => {
  const result = lookupVronskyDegreeRulers('gemini', 0);

  assert.deepEqual(result.sourceTokens, ['Mercury R', 'Proserpina']);
  assertRulers(result.rulers, [
    { key: 'mercury', retrograde: true },
    { key: 'proserpina', retrograde: false },
  ]);
  assert.equal(result.rulers.some((ruler) => ruler.key === 'proserpina'), true);
  assert.equal(lookupVronskyDegreeRulers('aries', 2).rulers.some((ruler) => ruler.key === 'chiron'), true);
  assert.equal(result.rulers.every((ruler) => typeof ruler.retrograde === 'boolean'), true);
});

test('no lookup output contains NaN undefined private data or unsupported source data', () => {
  const outputs = [
    lookupVronskyDegreeRulers('aries', 0),
    lookupVronskyDegreeRulersForPlanet(planet('mars', 'aries', 0, 30, 0.5)),
    getVronskyDegreeRulersSummary([lookupVronskyDegreeRulers('aries', 0)]),
  ];

  for (const output of outputs) {
    assertNoUndefined(output);
    assertFiniteNumbers(output);

    const text = JSON.stringify(output);

    for (const forbidden of [
      'NaN',
      'undefined',
      'birthDate',
      'birthTime',
      'coordinates',
      'profile',
      'degree-rulers-star-of-magi-table-6',
      'star-of-magi-degree-rulers',
      'fixedStars',
      'interpretationText',
      'ритуал',
    ]) {
      assert.equal(text.includes(forbidden), false, `output contains ${forbidden}`);
    }
  }
});

test('source system remains Vronsky Table 7 only', () => {
  const result = lookupVronskyDegreeRulers('aries', 1.2);

  assert.equal(result.source.sourceSystem, 'vronsky-degree-rulers');
  assert.equal(result.source.sourceKey, 'degree-rulers-vronsky-table-7');
});

test('module does not import providers profile storage Table 6 modules or astronomy-engine', () => {
  const source = readFileSync(new URL('../src/degreeRulersVronsky.js', import.meta.url), 'utf8');

  for (const forbidden of [
    'astronomyEngineProvider',
    'profileStorage',
    'degreeRulersStarOfMagi',
    'degree-rulers-star-of-magi-table-6',
    'star-of-magi-degree-rulers',
    'astronomy-engine',
    'calculateNatal',
    'birthDate',
    'birthTime',
  ]) {
    assert.equal(source.includes(forbidden), false, `${forbidden} should not be imported or called`);
  }
});

function assertNoUndefined(value) {
  if (Array.isArray(value)) {
    value.forEach(assertNoUndefined);
    return;
  }

  if (value && typeof value === 'object') {
    for (const propertyValue of Object.values(value)) {
      assert.notEqual(propertyValue, undefined);
      assertNoUndefined(propertyValue);
    }
  }
}

function assertFiniteNumbers(value) {
  if (typeof value === 'number') {
    assert.equal(Number.isFinite(value), true);
    return;
  }

  if (Array.isArray(value)) {
    value.forEach(assertFiniteNumbers);
    return;
  }

  if (value && typeof value === 'object') {
    Object.values(value).forEach(assertFiniteNumbers);
  }
}
