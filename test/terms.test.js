import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import {
  evaluateTermsForPlanets,
  getTermRulerLabel,
  getTermsEngineCapabilities,
  getTermsSummary,
  isValidTermDegree,
  lookupTerm,
  lookupTermForPlanet,
  resolveTermLookupInput,
} from '../src/terms.js';

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

function planet(key, signKey, degree, minutes, longitude, overrides = {}) {
  return {
    key,
    label: PLANET_LABELS[key],
    sign: signKey ? { key: signKey, ru: '', symbol: '' } : null,
    degree,
    minutes,
    longitude,
    source: 'synthetic-terms-test',
    ...overrides,
  };
}

function assertReadyTerm(result, expected) {
  assert.equal(result.status, 'ready');
  assert.equal(result.ruler, expected.ruler);
  assert.equal(result.value, expected.value);
  assert.deepEqual(result.range, {
    startDegree: expected.startDegree,
    printedEndDegree: expected.printedEndDegree,
    normalizedEndExclusive: expected.normalizedEndExclusive,
  });
}

function assertInvalid(result) {
  assert.equal(result.status, 'invalid');
  assert.equal(typeof result.reason, 'string');
  assert.equal(result.term, null);
}

test('lookupTerm returns ready for Aries 0 Mars term', () => {
  const result = lookupTerm('aries', 0);

  assert.equal(result.sign, 'aries');
  assert.equal(result.signRu, 'Овен');
  assert.equal(result.degreeWithinSign, 0);
  assertReadyTerm(result, {
    ruler: 'mars',
    value: 2,
    startDegree: 0,
    printedEndDegree: 6,
    normalizedEndExclusive: 6,
  });
  assert.deepEqual(result.source, {
    sourceKey: 'vronsky-table-5-terms',
    tableName: 'Термы',
    tableNumber: 5,
    verificationStatus: 'verified',
  });
});

test('exact boundary Aries 6 returns Venus term', () => {
  assertReadyTerm(lookupTerm('aries', 6), {
    ruler: 'venus',
    value: -1,
    startDegree: 6,
    printedEndDegree: 12,
    normalizedEndExclusive: 12,
  });
});

test('exact boundary Aries 25 returns Saturn final term', () => {
  assertReadyTerm(lookupTerm('aries', 25), {
    ruler: 'saturn',
    value: 1,
    startDegree: 25,
    printedEndDegree: 29,
    normalizedEndExclusive: 30,
  });
});

test('final printed 29 signs use normalizedEndExclusive 30 for 29.999 degrees', () => {
  const cases = [
    ['aries', 'saturn', 1, 25],
    ['taurus', 'mars', 1, 24],
    ['libra', 'venus', 2, 26],
    ['scorpio', 'saturn', 1, 25],
  ];

  for (const [sign, ruler, value, startDegree] of cases) {
    assertReadyTerm(lookupTerm(sign, 29.999), {
      ruler,
      value,
      startDegree,
      printedEndDegree: 29,
      normalizedEndExclusive: 30,
    });
  }
});

test('Pisces 29.999 returns Mars with printed end 30', () => {
  assertReadyTerm(lookupTerm('pisces', 29.999), {
    ruler: 'mars',
    value: 1,
    startDegree: 24,
    printedEndDegree: 30,
    normalizedEndExclusive: 30,
  });
});

test('invalid degrees and unknown signs fail safely', () => {
  assertInvalid(lookupTerm('aries', 30));
  assertInvalid(lookupTerm('aries', -0.1));
  assertInvalid(lookupTerm('unknown', 10));
  assertInvalid(lookupTerm('aries', Number.NaN));
  assertInvalid(lookupTerm('', 10));
  assertInvalid(lookupTerm('aries', undefined));
});

test('isValidTermDegree accepts only finite 0 <= degree < 30 values', () => {
  assert.equal(isValidTermDegree(0), true);
  assert.equal(isValidTermDegree(29.999), true);
  assert.equal(isValidTermDegree(30), false);
  assert.equal(isValidTermDegree(-0.1), false);
  assert.equal(isValidTermDegree(Number.NaN), false);
  assert.equal(isValidTermDegree('5'), false);
});

test('resolveTermLookupInput resolves valid sign and degree input', () => {
  assert.deepEqual(resolveTermLookupInput({ sign: 'aries', degreeWithinSign: 25 }), {
    status: 'ready',
    signKey: 'aries',
    degreeWithinSign: 25,
  });
  assert.equal(resolveTermLookupInput({ sign: 'unknown', degreeWithinSign: 25 }).status, 'invalid');
  assert.equal(resolveTermLookupInput({ sign: 'aries', degreeWithinSign: 30 }).status, 'invalid');
});

test('lookupTermForPlanet works with sign degree and minutes', () => {
  const result = lookupTermForPlanet(planet('mars', 'aries', 25, 30, 25.5));

  assert.equal(result.status, 'ready');
  assert.equal(result.planetKey, 'mars');
  assert.equal(result.planetLabel, 'Марс');
  assert.equal(result.sign, 'aries');
  assert.equal(result.signRu, 'Овен');
  assert.equal(result.degreeWithinSign, 25.5);
  assert.equal(result.source, 'vronsky-table-5-terms');
  assert.deepEqual(result.term, {
    ruler: 'saturn',
    rulerRu: 'Сатурн',
    value: 1,
    range: {
      startDegree: 25,
      printedEndDegree: 29,
      normalizedEndExclusive: 30,
    },
  });
});

test('lookupTermForPlanet works with longitude fallback', () => {
  const result = lookupTermForPlanet(planet('venus', null, null, null, 359.5));

  assert.equal(result.status, 'ready');
  assert.equal(result.sign, 'pisces');
  assert.equal(result.signRu, 'Рыбы');
  assert.equal(result.degreeWithinSign, 29.5);
  assert.deepEqual(result.term, {
    ruler: 'mars',
    rulerRu: 'Марс',
    value: 1,
    range: {
      startDegree: 24,
      printedEndDegree: 30,
      normalizedEndExclusive: 30,
    },
  });
});

test('lookupTermForPlanet fails safely when sign and longitude are insufficient', () => {
  assertInvalid(lookupTermForPlanet(planet('saturn', null, null, null, Number.NaN)));
  assertInvalid(lookupTermForPlanet({ ...planet('saturn', 'capricorn', 0, 0, 270), key: 'chiron' }));
  assertInvalid(lookupTermForPlanet({ ...planet('saturn', 'capricorn', 0, 0, 270), label: '' }));
});

test('evaluateTermsForPlanets returns ready results for valid planets in canonical order', () => {
  const results = evaluateTermsForPlanets([
    planet('mars', 'aries', 25, 0, 25),
    null,
    planet('sun', 'taurus', 0, 0, 30),
    { ...planet('moon', null, null, null, Number.NaN) },
    planet('venus', 'pisces', 14, 0, 344),
  ]);

  assert.deepEqual(results.map((result) => result.planetKey), ['sun', 'venus', 'mars']);
  assert.equal(results.length, 3);
  assert.equal(results.every((result) => result.status === 'ready'), true);
});

test('getTermsSummary counts rulers and value polarity', () => {
  const results = [
    lookupTerm('aries', 0),
    lookupTerm('aries', 6),
    lookupTerm('pisces', 14),
    lookupTerm('aquarius', 25),
    lookupTerm('libra', 26),
  ];
  const summary = getTermsSummary(results);

  assert.deepEqual(summary, {
    total: 5,
    ready: 5,
    byRuler: {
      mars: 2,
      venus: 2,
      mercury: 1,
      jupiter: 0,
      saturn: 0,
    },
    positive: 2,
    negative: 3,
    zero: 0,
    scoreTotal: 0,
    text: '5 термов найдено',
  });
});

test('getTermsSummary handles empty or invalid results safely', () => {
  assert.deepEqual(getTermsSummary([]), {
    total: 0,
    ready: 0,
    byRuler: {
      mars: 0,
      venus: 0,
      mercury: 0,
      jupiter: 0,
      saturn: 0,
    },
    positive: 0,
    negative: 0,
    zero: 0,
    scoreTotal: 0,
    text: 'Термы не рассчитаны.',
  });

  assert.equal(getTermsSummary([lookupTerm('aries', 30)]).ready, 0);
});

test('getTermRulerLabel returns short Russian labels', () => {
  assert.equal(getTermRulerLabel('mars'), 'Марс');
  assert.equal(getTermRulerLabel('venus'), 'Венера');
  assert.equal(getTermRulerLabel('mercury'), 'Меркурий');
  assert.equal(getTermRulerLabel('jupiter'), 'Юпитер');
  assert.equal(getTermRulerLabel('saturn'), 'Сатурн');
  assert.equal(getTermRulerLabel('sun'), '');
});

test('getTermsEngineCapabilities reports only terms as enabled', () => {
  assert.deepEqual(getTermsEngineCapabilities(), {
    source: 'vronsky-table-5-terms',
    terms: true,
    decans: false,
    degreeRulers: false,
    fixedStars: false,
    houses: false,
    ascMc: false,
    transits: false,
    interpretations: false,
  });
});

test('lookup output contains no NaN undefined private data or unsupported result data', () => {
  const output = [
    lookupTerm('aries', 29.999),
    lookupTermForPlanet(planet('venus', null, null, null, 359.5)),
    ...evaluateTermsForPlanets([planet('sun', 'taurus', 0, 0, 30)]),
  ];

  assertNoUnsafeOutput(output);
});

test('terms module has no provider profile UI or runtime dependency imports', () => {
  const source = readFileSync(new URL('../src/terms.js', import.meta.url), 'utf8');

  assert.equal(source.includes('astronomy-engine'), false);
  assert.equal(source.includes('astronomyEngineProvider'), false);
  assert.equal(source.includes('natalPlanetsForProfile'), false);
  assert.equal(source.includes('profileStorage'), false);
  assert.equal(source.includes('localStorage'), false);
  assert.equal(source.includes('document.'), false);
  assert.equal(source.includes('window.'), false);
  assert.equal(source.includes('luxon'), false);
});

function assertNoUnsafeOutput(output) {
  assertNoUndefined(output);
  assertFiniteNumbers(output);

  const text = JSON.stringify(output);

  assert.equal(text.includes('NaN'), false);
  assert.equal(text.includes('undefined'), false);
  assert.equal(text.includes('birthDate'), false);
  assert.equal(text.includes('birthTime'), false);
  assert.equal(text.includes('coordinates'), false);
  assert.equal(text.includes('profile'), false);
  assert.equal(text.includes('decans'), false);
  assert.equal(text.includes('degreeRulers'), false);
  assert.equal(text.includes('interpretation'), false);
  assert.equal(text.includes('ритуал'), false);
}

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
