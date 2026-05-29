import assert from 'node:assert/strict';
import test from 'node:test';

import {
  SELENA_FIXTURES,
  getSelenaFixture,
  getSelenaFixtureCategories,
  getSelenaFixtureIds,
} from './fixtures/selenaFixtures.js';

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
  assert.equal(serialized.includes('ангел'), false);
}

test('SELENA_FIXTURES is an array', () => {
  assert.equal(Array.isArray(SELENA_FIXTURES), true);
  assert.equal(SELENA_FIXTURES.length > 0, true);
});

test('fixture ids are unique', () => {
  const ids = getSelenaFixtureIds();
  const uniqueIds = new Set(ids);

  assert.equal(uniqueIds.size, ids.length);
});

test('required categories exist', () => {
  const categories = getSelenaFixtureCategories();

  for (const category of REQUIRED_CATEGORIES) {
    assert.equal(categories.includes(category), true, category);
  }
});

test('fixture getter works and unknown id returns null', () => {
  assert.equal(getSelenaFixture('selena-2000-01-01')?.id, 'selena-2000-01-01');
  assert.equal(getSelenaFixture('unknown-selena-fixture'), null);
});

test('benchmark expected values are static finite numbers', () => {
  const benchmarks = SELENA_FIXTURES.filter((fixture) => fixture.categories.includes('benchmark'));

  assert.equal(benchmarks.length >= 5, true);

  for (const fixture of benchmarks) {
    assert.equal(fixture.expected.manuallyDeclared, true, fixture.id);
    assert.equal(fixture.expected.source, 'local-swisseph-SE_WHITE_MOON-benchmark');
    assert.equal(fixture.expected.sourceSystem, 'selena-white-moon');
    assert.equal(fixture.expected.sourceKey, 'swiss-ephemeris-seorbel-white-moon');
    assert.equal(fixture.expected.method, 'swisseph-seorbel-white-moon-linear-elements');
    assert.equal(fixture.expected.pointType, 'fictitious-calculated-point');
    assert.equal(Number.isFinite(fixture.expected.longitude), true, fixture.id);
    assert.equal(Number.isFinite(fixture.expected.toleranceDegrees), true, fixture.id);
    assert.equal(fixture.expected.longitude >= 0 && fixture.expected.longitude < 360, true, fixture.id);
  }
});

test('fixtures identify Selena as a fictitious calculated point', () => {
  const benchmarks = SELENA_FIXTURES.filter((fixture) => fixture.categories.includes('benchmark'));

  for (const fixture of benchmarks) {
    assert.equal(fixture.expected.pointType, 'fictitious-calculated-point', fixture.id);
  }
});

test('fixtures contain no private birth data, raw coordinates or interpretations', () => {
  assertNoPrivateData(SELENA_FIXTURES);
});
