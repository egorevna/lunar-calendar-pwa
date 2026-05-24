import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import {
  evaluateDegreeRulersForPlanets,
  getDegreeIndex,
  getDegreeRulerPlanetLabel,
  getDegreeRulersEngineCapabilities,
  getDegreeRulersSummary,
  isValidDegreeRulerLookupDegree,
  lookupDegreeRuler,
  lookupDegreeRulerForPlanet,
  resolveDegreeRulerLookupInput,
} from '../src/degreeRulersStarOfMagi.js';

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
    source: 'synthetic-degree-ruler-test',
    ...overrides,
  };
}

function assertReadyDegreeRuler(result, expected) {
  assert.equal(result.status, 'ready');
  assert.equal(result.degreeIndex, expected.degreeIndex);
  assert.equal(result.ruler, expected.ruler);
  assert.equal(result.rulerRu, getDegreeRulerPlanetLabel(expected.ruler));
}

function assertInvalid(result) {
  assert.equal(result.status, 'invalid');
  assert.equal(typeof result.reason, 'string');
  assert.equal(result.degreeRuler, null);
}

test('lookupDegreeRuler returns ready for Aries 0 Mars', () => {
  const result = lookupDegreeRuler('aries', 0);

  assert.equal(result.sign, 'aries');
  assert.equal(result.signRu, 'Овен');
  assert.equal(result.degreeWithinSign, 0);
  assertReadyDegreeRuler(result, {
    degreeIndex: 0,
    ruler: 'mars',
  });
  assert.deepEqual(result.source, {
    sourceKey: 'degree-rulers-star-of-magi-table-6',
    sourceSystem: 'star-of-magi-degree-rulers',
    tableNumber: 6,
    verificationStatus: 'verified',
  });
});

test('Aries fractional boundary lookup floors degreeWithinSign', () => {
  assertReadyDegreeRuler(lookupDegreeRuler('aries', 0.999), { degreeIndex: 0, ruler: 'mars' });
  assertReadyDegreeRuler(lookupDegreeRuler('aries', 1), { degreeIndex: 1, ruler: 'sun' });
  assertReadyDegreeRuler(lookupDegreeRuler('aries', 1.999), { degreeIndex: 1, ruler: 'sun' });
  assertReadyDegreeRuler(lookupDegreeRuler('aries', 2), { degreeIndex: 2, ruler: 'venus' });
  assertReadyDegreeRuler(lookupDegreeRuler('aries', 29), { degreeIndex: 29, ruler: 'sun' });
  assertReadyDegreeRuler(lookupDegreeRuler('aries', 29.999), { degreeIndex: 29, ruler: 'sun' });
});

test('invalid degree sign and NaN fail safely', () => {
  assertInvalid(lookupDegreeRuler('aries', 30));
  assertInvalid(lookupDegreeRuler('aries', -0.1));
  assertInvalid(lookupDegreeRuler('unknown', 10));
  assertInvalid(lookupDegreeRuler('aries', Number.NaN));
  assertInvalid(lookupDegreeRuler('', 10));
  assertInvalid(lookupDegreeRuler('aries', undefined));
});

test('degree validation and index helpers use 0 <= degree < 30', () => {
  assert.equal(isValidDegreeRulerLookupDegree(0), true);
  assert.equal(isValidDegreeRulerLookupDegree(29.999), true);
  assert.equal(isValidDegreeRulerLookupDegree(30), false);
  assert.equal(isValidDegreeRulerLookupDegree(-0.1), false);
  assert.equal(isValidDegreeRulerLookupDegree(Number.NaN), false);
  assert.equal(isValidDegreeRulerLookupDegree('5'), false);

  assert.equal(getDegreeIndex(0), 0);
  assert.equal(getDegreeIndex(0.999), 0);
  assert.equal(getDegreeIndex(29.999), 29);
  assert.equal(getDegreeIndex(30), null);
});

test('resolveDegreeRulerLookupInput resolves sign degree and index', () => {
  assert.deepEqual(resolveDegreeRulerLookupInput({ sign: 'aries', degreeWithinSign: 1.2 }), {
    status: 'ready',
    signKey: 'aries',
    degreeWithinSign: 1.2,
    degreeIndex: 1,
  });
  assert.equal(resolveDegreeRulerLookupInput({ sign: 'unknown', degreeWithinSign: 1.2 }).status, 'invalid');
  assert.equal(resolveDegreeRulerLookupInput({ sign: 'aries', degreeWithinSign: 30 }).status, 'invalid');
});

test('lookupDegreeRulerForPlanet works with sign degree and minutes', () => {
  const result = lookupDegreeRulerForPlanet(planet('mars', 'aries', 25, 30, 25.5));

  assert.equal(result.status, 'ready');
  assert.equal(result.planetKey, 'mars');
  assert.equal(result.planetLabel, 'Марс');
  assert.equal(result.sign, 'aries');
  assert.equal(result.signRu, 'Овен');
  assert.equal(result.degreeWithinSign, 25.5);
  assert.equal(result.degreeIndex, 25);
  assert.equal(result.source, 'degree-rulers-star-of-magi-table-6');
  assert.equal(result.sourceSystem, 'star-of-magi-degree-rulers');
  assert.deepEqual(result.degreeRuler, {
    ruler: 'moon',
    rulerRu: 'Луна',
    degree: 25,
  });
});

test('lookupDegreeRulerForPlanet works with sign and degree only', () => {
  const result = lookupDegreeRulerForPlanet(planet('venus', 'taurus', 6, null, 36));

  assert.equal(result.status, 'ready');
  assert.equal(result.sign, 'taurus');
  assert.equal(result.degreeWithinSign, 6);
  assert.equal(result.degreeIndex, 6);
  assert.deepEqual(result.degreeRuler, {
    ruler: 'sun',
    rulerRu: 'Солнце',
    degree: 6,
  });
});

test('lookupDegreeRulerForPlanet works with longitude fallback', () => {
  const result = lookupDegreeRulerForPlanet(planet('moon', null, null, null, 359.5));

  assert.equal(result.status, 'ready');
  assert.equal(result.sign, 'pisces');
  assert.equal(result.signRu, 'Рыбы');
  assert.equal(result.degreeWithinSign, 29.5);
  assert.equal(result.degreeIndex, 29);
  assert.equal(result.sourceSystem, 'star-of-magi-degree-rulers');
  assert.deepEqual(result.degreeRuler, {
    ruler: 'venus',
    rulerRu: 'Венера',
    degree: 29,
  });
});

test('lookupDegreeRulerForPlanet fails safely when sign and longitude are insufficient', () => {
  assertInvalid(lookupDegreeRulerForPlanet(planet('saturn', null, null, null, Number.NaN)));
  assertInvalid(lookupDegreeRulerForPlanet({ ...planet('saturn', 'capricorn', 0, 0, 270), key: 'chiron' }));
  assertInvalid(lookupDegreeRulerForPlanet({ ...planet('saturn', 'capricorn', 0, 0, 270), label: '' }));
});

test('evaluateDegreeRulersForPlanets returns ready results for valid planets in canonical order', () => {
  const results = evaluateDegreeRulersForPlanets([
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

test('getDegreeRulersSummary counts by ruler', () => {
  const results = [
    lookupDegreeRuler('aries', 0),
    lookupDegreeRuler('aries', 1),
    lookupDegreeRuler('taurus', 0),
    lookupDegreeRuler('gemini', 1),
    lookupDegreeRuler('pisces', 6),
  ];
  const summary = getDegreeRulersSummary(results);

  assert.deepEqual(summary, {
    total: 5,
    ready: 5,
    byRuler: {
      sun: 1,
      moon: 0,
      mercury: 0,
      venus: 1,
      mars: 2,
      jupiter: 0,
      saturn: 1,
    },
    text: '5 управителей градусов найдено',
  });
});

test('getDegreeRulersEngineCapabilities reports only Table 6 engine capabilities', () => {
  assert.deepEqual(getDegreeRulersEngineCapabilities(), {
    source: 'degree-rulers-star-of-magi-table-6',
    sourceSystem: 'star-of-magi-degree-rulers',
    degreeRulers: true,
    table6StarOfMagi: true,
    table7Vronsky: false,
    decans: false,
    terms: false,
    fixedStars: false,
    houses: false,
    ascMc: false,
    transits: false,
    interpretations: false,
  });
});

test('no lookup output contains NaN undefined private data or deferred source data', () => {
  const outputs = [
    lookupDegreeRuler('aries', 0),
    lookupDegreeRulerForPlanet(planet('mars', 'aries', 25, 30, 25.5)),
    getDegreeRulersSummary([lookupDegreeRuler('aries', 0)]),
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
      'Table 7',
      'vronsky-degree-rulers',
      'retrograde',
      'multipleRulers',
      'decans',
      'terms',
      'interpretation',
      'ритуал',
    ]) {
      assert.equal(text.includes(forbidden), false, `output contains ${forbidden}`);
    }
  }
});

test('source system remains star-of-magi-degree-rulers', () => {
  const result = lookupDegreeRuler('aries', 1.2);

  assert.equal(result.source.sourceSystem, 'star-of-magi-degree-rulers');
  assert.equal(result.source.sourceKey, 'degree-rulers-star-of-magi-table-6');
});

test('module does not import providers profile storage or astronomy-engine', () => {
  const source = readFileSync(new URL('../src/degreeRulersStarOfMagi.js', import.meta.url), 'utf8');

  for (const forbidden of [
    'astronomyEngineProvider',
    'profileStorage',
    'provider',
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
