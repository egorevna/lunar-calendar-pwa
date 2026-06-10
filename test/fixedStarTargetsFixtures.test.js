import assert from 'node:assert/strict';
import test from 'node:test';

import {
  FIXED_STAR_TARGETS_FIXTURES,
  getFixedStarTargetsFixture,
  getFixedStarTargetsFixtureCategories,
  getFixedStarTargetsFixtureIds,
} from './fixtures/fixedStarTargetsFixtures.js';

const REQUIRED_CATEGORIES = [
  'natalPlanets',
  'angles',
  'combined',
  'partial',
  'invalid',
  'profile',
  'privacy',
  'strictExclusions',
];

test('FIXED_STAR_TARGETS_FIXTURES is an array', () => {
  assert.equal(Array.isArray(FIXED_STAR_TARGETS_FIXTURES), true);
  assert.equal(FIXED_STAR_TARGETS_FIXTURES.length >= REQUIRED_CATEGORIES.length, true);
});

test('fixture ids are unique', () => {
  const ids = getFixedStarTargetsFixtureIds();

  assert.equal(new Set(ids).size, ids.length);
});

test('required fixture categories exist', () => {
  const categories = getFixedStarTargetsFixtureCategories();

  for (const category of REQUIRED_CATEGORIES) {
    assert.equal(categories.includes(category), true, `missing category ${category}`);
  }
});

test('fixture getter works and unknown id returns null', () => {
  assert.equal(getFixedStarTargetsFixture('combined-ready')?.id, 'combined-ready');
  assert.equal(getFixedStarTargetsFixture('unknown-fixture'), null);
});

test('expected values are manually declared', () => {
  for (const fixture of FIXED_STAR_TARGETS_FIXTURES) {
    assert.equal(fixture.expected.manuallyDeclared, true, `${fixture.id} must be manual`);
  }
});

test('fixtures contain no private birth data profile coordinates or interpretations', () => {
  const serialized = JSON.stringify(FIXED_STAR_TARGETS_FIXTURES).toLowerCase();

  for (const forbidden of [
    'birthdate',
    'birthtime',
    'birthplace',
    'utcdatetime',
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
