import assert from 'node:assert/strict';
import test from 'node:test';

import {
  LUNAR_NODES_FIXTURES,
  getLunarNodesFixture,
  getLunarNodesFixtureCategories,
  getLunarNodesFixtureIds,
} from './fixtures/lunarNodesFixtures.js';

const REQUIRED_CATEGORIES = [
  'benchmark',
  'wrapAround',
  'southNode',
  'invalid',
  'profile',
  'privacy',
  'strictExclusions',
];

test('LUNAR_NODES_FIXTURES is an array', () => {
  assert.equal(Array.isArray(LUNAR_NODES_FIXTURES), true);
  assert.equal(LUNAR_NODES_FIXTURES.length >= 5, true);
});

test('fixture ids are unique', () => {
  const ids = getLunarNodesFixtureIds();

  assert.equal(new Set(ids).size, ids.length);
});

test('required fixture categories exist', () => {
  const categories = getLunarNodesFixtureCategories();

  for (const category of REQUIRED_CATEGORIES) {
    assert.equal(categories.includes(category), true, `missing category ${category}`);
  }
});

test('fixture getter works and unknown id returns null', () => {
  assert.equal(getLunarNodesFixture('mean-node-2000-01-01')?.id, 'mean-node-2000-01-01');
  assert.equal(getLunarNodesFixture('unknown-fixture'), null);
});

test('benchmark expected values are static finite numbers', () => {
  const benchmarks = LUNAR_NODES_FIXTURES.filter((fixture) => fixture.categories.includes('benchmark'));

  assert.equal(benchmarks.length >= 5, true);

  for (const fixture of benchmarks) {
    assert.equal(fixture.expected.manuallyDeclared, true);
    assert.equal(fixture.expected.source, 'local-swisseph-SE_MEAN_NODE-benchmark');
    assert.equal(Number.isFinite(fixture.expected.northLongitude), true);
    assert.equal(Number.isFinite(fixture.expected.southLongitude), true);
    assert.equal(Number.isFinite(fixture.expected.toleranceDegrees), true);
  }
});

test('fixtures contain no private birth data, raw coordinates or interpretations', () => {
  const serialized = JSON.stringify(LUNAR_NODES_FIXTURES);

  assert.equal(serialized.includes('birthPlace'), false);
  assert.equal(serialized.includes('birthDate'), false);
  assert.equal(serialized.includes('birthTime'), false);
  assert.equal(serialized.includes('"coordinates"'), false);
  assert.equal(serialized.includes('"latitude"'), false);
  assert.equal(serialized.includes('"longitude"'), false);
  assert.equal(serialized.includes('фаталь'), false);
  assert.equal(serialized.includes('карми'), false);
  assert.equal(serialized.includes('ритуал'), false);
  assert.equal(serialized.includes('interpretation'), false);
});
