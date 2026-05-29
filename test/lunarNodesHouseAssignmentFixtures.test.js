import assert from 'node:assert/strict';
import test from 'node:test';

import {
  LUNAR_NODES_HOUSE_ASSIGNMENT_FIXTURES,
  getLunarNodesHouseAssignmentFixture,
  getLunarNodesHouseAssignmentFixtureCategories,
  getLunarNodesHouseAssignmentFixtureIds,
} from './fixtures/lunarNodesHouseAssignmentFixtures.js';

const REQUIRED_CATEGORIES = [
  'wholeSign',
  'equalHouse',
  'placidus',
  'cuspBoundaries',
  'wrappingSpans',
  'invalid',
  'profile',
  'privacy',
  'strictExclusions',
];

test('LUNAR_NODES_HOUSE_ASSIGNMENT_FIXTURES is an array', () => {
  assert.equal(Array.isArray(LUNAR_NODES_HOUSE_ASSIGNMENT_FIXTURES), true);
  assert.equal(LUNAR_NODES_HOUSE_ASSIGNMENT_FIXTURES.length >= REQUIRED_CATEGORIES.length, true);
});

test('fixture ids are unique', () => {
  const ids = getLunarNodesHouseAssignmentFixtureIds();

  assert.equal(new Set(ids).size, ids.length);
});

test('required fixture categories exist', () => {
  const categories = getLunarNodesHouseAssignmentFixtureCategories();

  for (const category of REQUIRED_CATEGORIES) {
    assert.equal(categories.includes(category), true, `missing category ${category}`);
  }
});

test('fixture getter works and unknown id returns null', () => {
  assert.equal(
    getLunarNodesHouseAssignmentFixture('whole-sign-aquarius-boundaries')?.id,
    'whole-sign-aquarius-boundaries',
  );
  assert.equal(getLunarNodesHouseAssignmentFixture('unknown'), null);
});

test('fixture expectations are manually declared', () => {
  for (const fixture of LUNAR_NODES_HOUSE_ASSIGNMENT_FIXTURES) {
    assert.equal(fixture.expected.manuallyDeclared, true, fixture.id);
  }
});

test('fixtures contain no private birth data raw coordinates or interpretations', () => {
  const serialized = JSON.stringify(LUNAR_NODES_HOUSE_ASSIGNMENT_FIXTURES);

  assert.equal(serialized.includes('birthDate'), false);
  assert.equal(serialized.includes('birthTime'), false);
  assert.equal(serialized.includes('utcDateTime'), false);
  assert.equal(serialized.includes('birthPlace'), false);
  assert.equal(serialized.includes('coordinates'), false);
  assert.equal(serialized.includes('latitude'), false);
  assert.equal(serialized.includes('providerPayload'), false);
  assert.equal(serialized.includes('interpretation'), false);
  assert.equal(serialized.includes('фаталь'), false);
  assert.equal(serialized.includes('карми'), false);
  assert.equal(serialized.includes('ритуал'), false);
});
