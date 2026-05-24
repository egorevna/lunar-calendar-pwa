import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import {
  evaluateDecansForPlanets,
  getDecanRulerLabel,
  getDecansEngineCapabilities,
  getDecansSummary,
  isValidDecanDegree,
  lookupDecan,
  lookupDecanForPlanet,
  resolveDecanLookupInput,
} from '../src/decans.js';

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
    source: 'synthetic-decans-test',
    ...overrides,
  };
}

function assertReadyDecan(result, expected) {
  assert.equal(result.status, 'ready');
  assert.equal(result.decanIndex, expected.decanIndex);
  assert.equal(result.ruler, expected.ruler);
  assert.deepEqual(result.range, {
    startDegree: expected.startDegree,
    endDegreeExclusive: expected.endDegreeExclusive,
  });
}

function assertInvalid(result) {
  assert.equal(result.status, 'invalid');
  assert.equal(typeof result.reason, 'string');
  assert.equal(result.decan, null);
}

test('lookupDecan returns ready for Aries 0 Mars decan', () => {
  const result = lookupDecan('aries', 0);

  assert.equal(result.sign, 'aries');
  assert.equal(result.signRu, 'Овен');
  assert.equal(result.degreeWithinSign, 0);
  assertReadyDecan(result, {
    decanIndex: 1,
    ruler: 'mars',
    startDegree: 0,
    endDegreeExclusive: 10,
  });
  assert.deepEqual(result.source, {
    sourceKey: 'decans-star-of-magi-vronsky-fig-4-7',
    sourceSystem: 'star-of-magi-egyptian-tradition',
    figureNumber: '4.7',
    verificationStatus: 'verified',
  });
});

test('Aries boundary lookup uses half-open decan intervals', () => {
  assertReadyDecan(lookupDecan('aries', 9.999), {
    decanIndex: 1,
    ruler: 'mars',
    startDegree: 0,
    endDegreeExclusive: 10,
  });
  assertReadyDecan(lookupDecan('aries', 10), {
    decanIndex: 2,
    ruler: 'sun',
    startDegree: 10,
    endDegreeExclusive: 20,
  });
  assertReadyDecan(lookupDecan('aries', 19.999), {
    decanIndex: 2,
    ruler: 'sun',
    startDegree: 10,
    endDegreeExclusive: 20,
  });
  assertReadyDecan(lookupDecan('aries', 20), {
    decanIndex: 3,
    ruler: 'venus',
    startDegree: 20,
    endDegreeExclusive: 30,
  });
  assertReadyDecan(lookupDecan('aries', 29.999), {
    decanIndex: 3,
    ruler: 'venus',
    startDegree: 20,
    endDegreeExclusive: 30,
  });
});

test('degree 30 negative degree unknown sign and NaN fail safely', () => {
  assertInvalid(lookupDecan('aries', 30));
  assertInvalid(lookupDecan('aries', -0.1));
  assertInvalid(lookupDecan('unknown', 10));
  assertInvalid(lookupDecan('aries', Number.NaN));
  assertInvalid(lookupDecan('', 10));
  assertInvalid(lookupDecan('aries', undefined));
});

test('isValidDecanDegree accepts only finite 0 <= degree < 30 values', () => {
  assert.equal(isValidDecanDegree(0), true);
  assert.equal(isValidDecanDegree(29.999), true);
  assert.equal(isValidDecanDegree(30), false);
  assert.equal(isValidDecanDegree(-0.1), false);
  assert.equal(isValidDecanDegree(Number.NaN), false);
  assert.equal(isValidDecanDegree('5'), false);
});

test('resolveDecanLookupInput resolves valid sign and degree input', () => {
  assert.deepEqual(resolveDecanLookupInput({ sign: 'aries', degreeWithinSign: 20 }), {
    status: 'ready',
    signKey: 'aries',
    degreeWithinSign: 20,
  });
  assert.equal(resolveDecanLookupInput({ sign: 'unknown', degreeWithinSign: 20 }).status, 'invalid');
  assert.equal(resolveDecanLookupInput({ sign: 'aries', degreeWithinSign: 30 }).status, 'invalid');
});

test('lookupDecanForPlanet works with sign degree and minutes', () => {
  const result = lookupDecanForPlanet(planet('mars', 'aries', 25, 30, 25.5));

  assert.equal(result.status, 'ready');
  assert.equal(result.planetKey, 'mars');
  assert.equal(result.planetLabel, 'Марс');
  assert.equal(result.sign, 'aries');
  assert.equal(result.signRu, 'Овен');
  assert.equal(result.degreeWithinSign, 25.5);
  assert.equal(result.source, 'decans-star-of-magi-vronsky-fig-4-7');
  assert.equal(result.sourceSystem, 'star-of-magi-egyptian-tradition');
  assert.deepEqual(result.decan, {
    decanIndex: 3,
    ruler: 'venus',
    rulerRu: 'Венера',
    range: {
      startDegree: 20,
      endDegreeExclusive: 30,
    },
  });
});

test('lookupDecanForPlanet works with longitude fallback', () => {
  const result = lookupDecanForPlanet(planet('venus', null, null, null, 359.5));

  assert.equal(result.status, 'ready');
  assert.equal(result.sign, 'pisces');
  assert.equal(result.signRu, 'Рыбы');
  assert.equal(result.degreeWithinSign, 29.5);
  assert.equal(result.sourceSystem, 'star-of-magi-egyptian-tradition');
  assert.deepEqual(result.decan, {
    decanIndex: 3,
    ruler: 'mars',
    rulerRu: 'Марс',
    range: {
      startDegree: 20,
      endDegreeExclusive: 30,
    },
  });
});

test('lookupDecanForPlanet fails safely when sign and longitude are insufficient', () => {
  assertInvalid(lookupDecanForPlanet(planet('saturn', null, null, null, Number.NaN)));
  assertInvalid(lookupDecanForPlanet({ ...planet('saturn', 'capricorn', 0, 0, 270), key: 'chiron' }));
  assertInvalid(lookupDecanForPlanet({ ...planet('saturn', 'capricorn', 0, 0, 270), label: '' }));
});

test('evaluateDecansForPlanets returns ready results for valid planets in canonical order', () => {
  const results = evaluateDecansForPlanets([
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

test('getDecansSummary counts rulers and decan indexes', () => {
  const results = [
    lookupDecan('aries', 0),
    lookupDecan('aries', 10),
    lookupDecan('taurus', 10),
    lookupDecan('gemini', 20),
    lookupDecan('libra', 0),
    lookupDecan('pisces', 20),
  ];
  const summary = getDecansSummary(results);

  assert.deepEqual(summary, {
    total: 6,
    ready: 6,
    byRuler: {
      sun: 2,
      moon: 2,
      mercury: 0,
      venus: 0,
      mars: 2,
      jupiter: 0,
      saturn: 0,
    },
    byDecanIndex: {
      1: 2,
      2: 2,
      3: 2,
    },
    text: '6 деканов найдено',
  });
});

test('getDecansSummary handles empty or invalid results safely', () => {
  assert.deepEqual(getDecansSummary([]), {
    total: 0,
    ready: 0,
    byRuler: {
      sun: 0,
      moon: 0,
      mercury: 0,
      venus: 0,
      mars: 0,
      jupiter: 0,
      saturn: 0,
    },
    byDecanIndex: {
      1: 0,
      2: 0,
      3: 0,
    },
    text: 'Деканы не рассчитаны.',
  });

  assert.equal(getDecansSummary([lookupDecan('aries', 30)]).ready, 0);
});

test('getDecanRulerLabel returns short Russian labels', () => {
  assert.equal(getDecanRulerLabel('sun'), 'Солнце');
  assert.equal(getDecanRulerLabel('moon'), 'Луна');
  assert.equal(getDecanRulerLabel('mercury'), 'Меркурий');
  assert.equal(getDecanRulerLabel('venus'), 'Венера');
  assert.equal(getDecanRulerLabel('mars'), 'Марс');
  assert.equal(getDecanRulerLabel('jupiter'), 'Юпитер');
  assert.equal(getDecanRulerLabel('saturn'), 'Сатурн');
  assert.equal(getDecanRulerLabel('uranus'), '');
});

test('getDecansEngineCapabilities reports only Star of the Magi decans as enabled', () => {
  assert.deepEqual(getDecansEngineCapabilities(), {
    source: 'decans-star-of-magi-vronsky-fig-4-7',
    sourceSystem: 'star-of-magi-egyptian-tradition',
    decans: true,
    trigonDecans: false,
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
    lookupDecan('aries', 29.999),
    lookupDecanForPlanet(planet('venus', null, null, null, 359.5)),
    ...evaluateDecansForPlanets([planet('sun', 'taurus', 0, 0, 30)]),
    getDecansSummary([lookupDecan('aries', 0), lookupDecan('aries', 10)]),
  ];

  assertNoUnsafeOutput(output);
});

test('lookup output source system stays Star of the Magi only', () => {
  const result = lookupDecan('scorpio', 12);

  assert.equal(result.source.sourceSystem, 'star-of-magi-egyptian-tradition');
  assert.equal(JSON.stringify(result).includes('trigon-vronsky'), false);
});

test('decans module has no provider profile UI or runtime dependency imports', () => {
  const source = readFileSync(new URL('../src/decans.js', import.meta.url), 'utf8');

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
  assert.equal(text.includes('trigon-vronsky'), false);
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
