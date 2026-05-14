import assert from 'node:assert/strict';
import test from 'node:test';

import {
  createNatalChartEmptyResult,
  createNatalChartIncompleteResult,
  createNatalChartReadyResult,
  hasNatalFeature,
  NATAL_ENGINE_STATUS,
  NATAL_FEATURES,
  normalizeNatalAspect,
  normalizeNatalPlanet,
} from '../src/natalChartModel.js';

test('createNatalChartEmptyResult returns notSupported with empty data arrays', () => {
  const result = createNatalChartEmptyResult('provider missing');

  assert.equal(result.status, NATAL_ENGINE_STATUS.NOT_SUPPORTED);
  assert.equal(result.reason, 'provider missing');
  assert.deepEqual(result.planets, []);
  assert.deepEqual(result.points, []);
  assert.deepEqual(result.houses, []);
  assert.deepEqual(result.aspects, []);
  assert.deepEqual(result.transits, []);
});

test('empty result capabilities are all false with neutral metadata', () => {
  const result = createNatalChartEmptyResult('provider missing');

  assert.deepEqual(result.capabilities, {
    planets: false,
    houses: false,
    ascMc: false,
    aspects: false,
    transits: false,
  });
  assert.deepEqual(result.metadata, {
    provider: null,
    calculatedAt: null,
    zodiac: null,
    houseSystem: null,
  });
});

test('createNatalChartIncompleteResult returns incomplete and missing fields', () => {
  const result = createNatalChartIncompleteResult('missing birth data', ['birthDate', 'birthTime']);

  assert.equal(result.status, NATAL_ENGINE_STATUS.INCOMPLETE);
  assert.equal(result.reason, 'missing birth data');
  assert.deepEqual(result.missingFields, ['birthDate', 'birthTime']);
  assert.deepEqual(result.planets, []);
  assert.deepEqual(result.capabilities.planets, false);
});

test('createNatalChartReadyResult does not create fake data', () => {
  const result = createNatalChartReadyResult();

  assert.equal(result.status, NATAL_ENGINE_STATUS.READY);
  assert.deepEqual(result.planets, []);
  assert.deepEqual(result.points, []);
  assert.deepEqual(result.houses, []);
  assert.deepEqual(result.aspects, []);
  assert.deepEqual(result.transits, []);
  assert.deepEqual(result.capabilities, {
    planets: false,
    houses: false,
    ascMc: false,
    aspects: false,
    transits: false,
  });
});

test('ready result capabilities reflect explicitly provided arrays', () => {
  const result = createNatalChartReadyResult({
    planets: [{ key: 'moon', longitude: 45, label: 'Луна' }],
    points: [{ key: 'asc', longitude: 10, label: 'ASC' }],
    houses: [{ number: 1, sign: 'aries' }],
    aspects: [{ bodyA: 'sun', bodyB: 'moon', aspect: 'square', orb: 1.2, exactAngle: 90 }],
    transits: [{ body: 'moon', aspect: 'trine', target: 'sun' }],
    metadata: { provider: 'fixture', zodiac: 'tropical', houseSystem: 'wholeSign' },
  });

  assert.equal(result.capabilities.planets, true);
  assert.equal(result.capabilities.houses, true);
  assert.equal(result.capabilities.ascMc, true);
  assert.equal(result.capabilities.aspects, true);
  assert.equal(result.capabilities.transits, true);
  assert.equal(result.metadata.provider, 'fixture');
});

test('normalizeNatalPlanet uses longitude for sign and degree safely', () => {
  const planet = normalizeNatalPlanet({
    key: 'moon',
    label: 'Луна',
    longitude: 45,
    retrograde: false,
    house: 2,
    source: 'fixture',
  });

  assert.equal(planet.key, 'moon');
  assert.equal(planet.label, 'Луна');
  assert.equal(planet.longitude, 45);
  assert.equal(planet.sign.key, 'taurus');
  assert.equal(planet.degree, 15);
  assert.equal(planet.minutes, 0);
  assert.equal(planet.retrograde, false);
  assert.equal(planet.house, 2);
  assert.equal(planet.source, 'fixture');
});

test('normalizeNatalPlanet returns null instead of NaN for invalid longitude', () => {
  assert.equal(normalizeNatalPlanet({ key: 'moon', longitude: Number.NaN }), null);
  assert.equal(normalizeNatalPlanet({ key: 'moon', longitude: '45' }), null);
});

test('normalizeNatalAspect normalizes passed aspect without calculating a fake aspect', () => {
  const aspect = normalizeNatalAspect({
    bodyA: 'sun',
    bodyB: 'moon',
    aspect: 'square',
    orb: 1.2,
    exactAngle: 90,
    applying: true,
    source: 'fixture',
  });

  assert.deepEqual(aspect, {
    bodyA: 'sun',
    bodyB: 'moon',
    aspect: 'square',
    orb: 1.2,
    exactAngle: 90,
    applying: true,
    source: 'fixture',
  });

  assert.equal(normalizeNatalAspect({ bodyA: 'sun', bodyB: 'moon' }), null);
});

test('hasNatalFeature reads result capabilities', () => {
  const result = createNatalChartReadyResult({
    planets: [{ key: 'sun', longitude: 15 }],
  });

  assert.equal(hasNatalFeature(result, NATAL_FEATURES.PLANETS), true);
  assert.equal(hasNatalFeature(result, NATAL_FEATURES.HOUSES), false);
  assert.equal(hasNatalFeature(null, NATAL_FEATURES.PLANETS), false);
});
