import assert from 'node:assert/strict';
import test from 'node:test';

import {
  PLANET_IN_HOUSES_FIXTURES,
  getPlanetInHousesFixture,
  getPlanetInHousesFixtureCategories,
  getPlanetInHousesFixtureIds,
} from './fixtures/planetInHousesFixtures.js';

test('planet-in-house fixtures expose unique ids and required categories', () => {
  const ids = getPlanetInHousesFixtureIds();
  const categories = new Set(PLANET_IN_HOUSES_FIXTURES.map((fixture) => fixture.category));

  assert.equal(Array.isArray(PLANET_IN_HOUSES_FIXTURES), true);
  assert.equal(PLANET_IN_HOUSES_FIXTURES.length > 0, true);
  assert.equal(new Set(ids).size, ids.length);

  for (const category of getPlanetInHousesFixtureCategories()) {
    assert.equal(categories.has(category), true, `missing fixture category: ${category}`);
  }
});

test('planet-in-house fixture lookup returns fixture by id and null for unknown id', () => {
  assert.equal(getPlanetInHousesFixture('whole-sign-asc-aries-planets').id, 'whole-sign-asc-aries-planets');
  assert.equal(getPlanetInHousesFixture('unknown-fixture'), null);
});

test('planet-in-house fixture expectations are manually declared', () => {
  for (const fixture of PLANET_IN_HOUSES_FIXTURES) {
    assert.equal(
      fixture.expected?.manuallyDeclared,
      true,
      `${fixture.id} must mark expected values as manually declared`,
    );
  }
});

test('planet-in-house fixtures avoid private birth data raw coordinates and interpretations', () => {
  const json = JSON.stringify(PLANET_IN_HOUSES_FIXTURES);

  assert.equal(json.includes('birthDate'), false);
  assert.equal(json.includes('birthTime'), false);
  assert.equal(json.includes('utcDateTime'), false);
  assert.equal(json.includes('birthPlace'), false);
  assert.equal(json.includes('currentPlace'), false);
  assert.equal(json.includes('"latitude"'), false);
  assert.equal(json.includes('"lat"'), false);
  assert.equal(json.includes('"coordinates"'), false);
  assert.equal(json.includes('profile JSON'), false);
  assert.equal(/фаталь|карми|плохой|плохая|плохое/i.test(json), false);
});
