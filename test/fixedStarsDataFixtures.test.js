import assert from 'node:assert/strict';
import test from 'node:test';

import {
  FIXED_STARS_DATA_FIXTURES,
  getFixedStarsDataFixture,
  getFixedStarsDataFixtureCategories,
  getFixedStarsDataFixtureIds,
} from './fixtures/fixedStarsDataFixtures.js';

const REQUIRED_CATEGORIES = [
  'sourcePolicy',
  'orbPolicy',
  'targetPolicy',
  'activeRows',
  'candidateRows',
  'deferredRows',
  'privacy',
  'strictExclusions',
];

test('FIXED_STARS_DATA_FIXTURES is an array', () => {
  assert.equal(Array.isArray(FIXED_STARS_DATA_FIXTURES), true);
  assert.equal(FIXED_STARS_DATA_FIXTURES.length >= REQUIRED_CATEGORIES.length, true);
});

test('fixture ids are unique', () => {
  const ids = getFixedStarsDataFixtureIds();

  assert.equal(new Set(ids).size, ids.length);
});

test('required fixture categories exist', () => {
  const categories = getFixedStarsDataFixtureCategories();

  for (const category of REQUIRED_CATEGORIES) {
    assert.equal(categories.includes(category), true, `missing category ${category}`);
  }
});

test('fixture getter works and unknown id returns null', () => {
  assert.equal(getFixedStarsDataFixture('fixed-stars-source-policy')?.id, 'fixed-stars-source-policy');
  assert.equal(getFixedStarsDataFixture('unknown-fixture'), null);
});

test('fixture expected values are manually declared', () => {
  for (const fixture of FIXED_STARS_DATA_FIXTURES) {
    assert.equal(fixture.expected.manuallyDeclared, true, `${fixture.id} must be manual`);
  }
});

test('source policy fixture preserves Vronsky source boundaries', () => {
  const fixture = getFixedStarsDataFixture('fixed-stars-source-policy');

  assert.equal(fixture.expected.sourceKey, 'vronsky-table-18-fixed-stars');
  assert.equal(fixture.expected.sourceSystem, 'fixed-stars-vronsky-table-18');
  assert.deepEqual(fixture.expected.coordinateColumns, ['1950', '1970', '1990']);
  assert.equal(fixture.expected.initialReferenceEpoch, 1990);
  assert.equal(fixture.expected.noOcrImport, true);
  assert.equal(fixture.expected.noRowsFromMemory, true);
});

test('active rows fixture declares active keys and sample coordinates manually', () => {
  const fixture = getFixedStarsDataFixture('fixed-stars-active-rows');

  assert.equal(fixture.expected.activeCount, 13);
  assert.deepEqual(fixture.expected.activeKeys, [
    'algol',
    'aldebaran',
    'rigel',
    'betelgeuse',
    'sirius',
    'canopus',
    'regulus',
    'spica',
    'arcturus',
    'antares',
    'vega',
    'altair',
    'fomalhaut',
  ]);
  assert.equal(Number.isFinite(fixture.expected.sampleCoordinates.regulus.longitude), true);
  assert.equal(Number.isFinite(fixture.expected.sampleCoordinates.spica.longitude), true);
  assert.equal(Number.isFinite(fixture.expected.sampleCoordinates.fomalhaut.longitude), true);
});

test('fixtures contain no private birth data, profile coordinates or interpretations', () => {
  const serialized = JSON.stringify(FIXED_STARS_DATA_FIXTURES);

  for (const forbidden of [
    'birthPlace',
    'birthDate',
    'birthTime',
    'utcDateTime',
    'profileCoordinates',
    'birthCoordinates',
    'fullProfile',
    'providerPayload',
    'фаталь',
    'карми',
    'судьб',
    'ритуал',
    'prediction',
    'mythology',
  ]) {
    assert.equal(serialized.includes(forbidden), false, `fixtures should not include ${forbidden}`);
  }
});
