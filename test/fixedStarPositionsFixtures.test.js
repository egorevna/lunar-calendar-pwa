import assert from 'node:assert/strict';
import test from 'node:test';

import {
  FIXED_STAR_POSITIONS_FIXTURES,
  getFixedStarPositionsFixture,
  getFixedStarPositionsFixtureCategories,
  getFixedStarPositionsFixtureIds,
} from './fixtures/fixedStarPositionsFixtures.js';

const REQUIRED_CATEGORIES = [
  'exactEpoch',
  'interpolation',
  'extrapolation',
  'wrapAround',
  'invalid',
  'privacy',
  'strictExclusions',
];

test('FIXED_STAR_POSITIONS_FIXTURES is an array', () => {
  assert.equal(Array.isArray(FIXED_STAR_POSITIONS_FIXTURES), true);
  assert.equal(FIXED_STAR_POSITIONS_FIXTURES.length >= REQUIRED_CATEGORIES.length, true);
});

test('fixture ids are unique', () => {
  const ids = getFixedStarPositionsFixtureIds();

  assert.equal(new Set(ids).size, ids.length);
});

test('required fixture categories exist', () => {
  const categories = getFixedStarPositionsFixtureCategories();

  for (const category of REQUIRED_CATEGORIES) {
    assert.equal(categories.includes(category), true, `missing category ${category}`);
  }
});

test('fixture getter works and unknown id returns null', () => {
  assert.equal(getFixedStarPositionsFixture('spica-interpolation-1980')?.id, 'spica-interpolation-1980');
  assert.equal(getFixedStarPositionsFixture('unknown-fixture'), null);
});

test('expected values are manually declared', () => {
  for (const fixture of FIXED_STAR_POSITIONS_FIXTURES) {
    assert.equal(fixture.expected.manuallyDeclared, true, `${fixture.id} must be manual`);
  }
});

test('synthetic wrap fixtures are clearly marked synthetic', () => {
  const wrapFixtures = FIXED_STAR_POSITIONS_FIXTURES.filter((fixture) =>
    fixture.categories.includes('wrapAround'));

  assert.equal(wrapFixtures.length >= 1, true);

  for (const fixture of wrapFixtures) {
    assert.equal(fixture.synthetic, true);
    assert.equal(fixture.input.starRow.syntheticFixture, true);
    assert.equal(fixture.input.starRow.sourceSystem, 'synthetic-test-fixture');
  }
});

test('fixtures contain no private birth data profile coordinates or interpretations', () => {
  const serialized = JSON.stringify(FIXED_STAR_POSITIONS_FIXTURES).toLowerCase();

  for (const forbidden of [
    'birthdate',
    'birthtime',
    'birthplace',
    'profilecoordinates',
    'birthcoordinates',
    'fullprofile',
    'profilejson',
    'providerpayload',
    'interpretationtext',
    'mythology',
    'prediction',
    'fatalistic',
    'karmic',
    'фаталь',
    'карми',
    'судьб',
    'ритуал',
  ]) {
    assert.equal(serialized.includes(forbidden), false, `fixtures should not include ${forbidden}`);
  }
});
