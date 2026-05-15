import assert from 'node:assert/strict';
import test from 'node:test';

import {
  getNatalProviderFixture,
  getRequiredFixtureCategories,
  NATAL_PROVIDER_FIXTURES,
} from './fixtures/natalProviderFixtures.js';

const REQUIRED_FIXTURE_KEYS = [
  'id',
  'label',
  'type',
  'categories',
  'birth',
  'expectedStatus',
  'expected',
  'tolerance',
  'source',
  'notes',
];

const PRIVATE_NAME_PATTERN = /Егор|Анна/;

test('NATAL_PROVIDER_FIXTURES is an array', () => {
  assert.equal(Array.isArray(NATAL_PROVIDER_FIXTURES), true);
  assert.equal(NATAL_PROVIDER_FIXTURES.length > 0, true);
});

test('every natal provider fixture has required structure', () => {
  for (const fixture of NATAL_PROVIDER_FIXTURES) {
    for (const key of REQUIRED_FIXTURE_KEYS) {
      assert.equal(Object.hasOwn(fixture, key), true, `${fixture.id} missing ${key}`);
    }

    assert.equal(typeof fixture.id, 'string');
    assert.equal(typeof fixture.label, 'string');
    assert.equal(['synthetic', 'public'].includes(fixture.type), true);
    assert.equal(Array.isArray(fixture.categories), true);
    assert.equal(typeof fixture.birth, 'object');
    assert.equal(typeof fixture.expected, 'object');
    assert.equal(typeof fixture.tolerance, 'object');
    assert.equal(typeof fixture.source, 'string');
    assert.equal(Array.isArray(fixture.notes), true);
  }
});

test('fixtures do not contain private user names or full profile JSON', () => {
  for (const fixture of NATAL_PROVIDER_FIXTURES) {
    const serialized = JSON.stringify(fixture);

    assert.equal(PRIVATE_NAME_PATTERN.test(serialized), false);
    assert.equal(serialized.includes('"profileId"'), false);
    assert.equal(serialized.includes('"currentPlace"'), false);
    assert.equal(serialized.includes('"houseSystem"'), false);
  }
});

test('fixtures include all required validation categories', () => {
  const fixtureCategories = new Set(NATAL_PROVIDER_FIXTURES.flatMap((fixture) => fixture.categories));

  for (const category of getRequiredFixtureCategories()) {
    assert.equal(fixtureCategories.has(category), true, `missing category ${category}`);
  }
});

test('getNatalProviderFixture returns fixture by id and null for unknown id', () => {
  const fixture = NATAL_PROVIDER_FIXTURES[0];

  assert.equal(getNatalProviderFixture(fixture.id), fixture);
  assert.equal(getNatalProviderFixture('unknown-fixture'), null);
});

test('pending fixtures are explicitly marked pending-provider-approval', () => {
  for (const fixture of NATAL_PROVIDER_FIXTURES) {
    assert.equal(fixture.expectedStatus, 'pending-provider-approval');
  }
});

test('fixtures do not claim real provider validation yet', () => {
  for (const fixture of NATAL_PROVIDER_FIXTURES) {
    assert.equal(fixture.validatedProvider, null);
    assert.equal(fixture.validatedAt, null);
  }
});

test('fixtures do not invent fake planetary longitude values', () => {
  for (const fixture of NATAL_PROVIDER_FIXTURES) {
    for (const planet of Object.values(fixture.expected.planets)) {
      assert.equal(planet.longitude, null);
      assert.equal(planet.sign, null);
      assert.equal(planet.degree, null);
    }
  }
});
