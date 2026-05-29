import assert from 'node:assert/strict';
import test from 'node:test';

import {
  LILITH_FIXTURES,
  getLilithFixture,
  getLilithFixtureCategories,
  getLilithFixtureIds,
} from './fixtures/lilithFixtures.js';

const REQUIRED_CATEGORIES = [
  'benchmark',
  'wrapAround',
  'invalid',
  'profile',
  'privacy',
  'strictExclusions',
];

function assertNoPrivateData(value) {
  const serialized = JSON.stringify(value);

  assert.equal(serialized.includes('birthDate'), false);
  assert.equal(serialized.includes('birthTime'), false);
  assert.equal(serialized.includes('utcDateTimeLocal'), false);
  assert.equal(serialized.includes('birthPlace'), false);
  assert.equal(serialized.includes('latitude'), false);
  assert.equal(serialized.includes('fullProfile'), false);
  assert.equal(serialized.includes('providerPayload'), false);
  assert.equal(serialized.includes('интерпр'), false);
  assert.equal(serialized.includes('фаталь'), false);
  assert.equal(serialized.includes('карми'), false);
  assert.equal(serialized.includes('ритуал'), false);
}

test('LILITH_FIXTURES is an array', () => {
  assert.equal(Array.isArray(LILITH_FIXTURES), true);
  assert.equal(LILITH_FIXTURES.length > 0, true);
});

test('fixture ids are unique', () => {
  const ids = getLilithFixtureIds();
  const uniqueIds = new Set(ids);

  assert.equal(uniqueIds.size, ids.length);
});

test('required categories exist', () => {
  const categories = getLilithFixtureCategories();

  for (const category of REQUIRED_CATEGORIES) {
    assert.equal(categories.includes(category), true, category);
  }
});

test('fixture getter works and unknown id returns null', () => {
  assert.equal(getLilithFixture('mean-lilith-2000-01-01')?.id, 'mean-lilith-2000-01-01');
  assert.equal(getLilithFixture('unknown-lilith-fixture'), null);
});

test('benchmark expected values are static finite numbers', () => {
  const benchmarks = LILITH_FIXTURES.filter((fixture) => fixture.categories.includes('benchmark'));

  assert.equal(benchmarks.length >= 5, true);

  for (const fixture of benchmarks) {
    assert.equal(fixture.expected.manuallyDeclared, true, fixture.id);
    assert.equal(fixture.expected.source, 'local-swisseph-SE_MEAN_APOG-benchmark');
    assert.equal(fixture.expected.variant, 'mean');
    assert.equal(fixture.expected.sourceSystem, 'mean-black-moon-lilith');
    assert.equal(fixture.expected.sourceKey, 'mean-lunar-apogee');
    assert.equal(Number.isFinite(fixture.expected.longitude), true, fixture.id);
    assert.equal(Number.isFinite(fixture.expected.toleranceDegrees), true, fixture.id);
    assert.equal(fixture.expected.longitude >= 0 && fixture.expected.longitude < 360, true, fixture.id);
  }
});

test('fixtures contain no private birth data, raw coordinates or interpretations', () => {
  assertNoPrivateData(LILITH_FIXTURES);
});
