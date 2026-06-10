import assert from 'node:assert/strict';
import test from 'node:test';

import {
  FIXED_STAR_CONJUNCTION_FIXTURES,
  getFixedStarConjunctionFixture,
  getFixedStarConjunctionFixtureCategories,
  getFixedStarConjunctionFixtureIds,
} from './fixtures/fixedStarConjunctionFixtures.js';

const REQUIRED_CATEGORIES = [
  'exactConjunction',
  'insideOrb',
  'boundaryOrb',
  'outsideOrb',
  'wrapAround',
  'noHits',
  'sorting',
  'partialTargets',
  'invalid',
  'profile',
  'privacy',
  'strictExclusions',
];

test('FIXED_STAR_CONJUNCTION_FIXTURES is an array', () => {
  assert.equal(Array.isArray(FIXED_STAR_CONJUNCTION_FIXTURES), true);
  assert.equal(FIXED_STAR_CONJUNCTION_FIXTURES.length >= REQUIRED_CATEGORIES.length, true);
});

test('fixture ids are unique', () => {
  const ids = getFixedStarConjunctionFixtureIds();

  assert.equal(new Set(ids).size, ids.length);
});

test('required fixture categories exist', () => {
  const categories = getFixedStarConjunctionFixtureCategories();

  for (const category of REQUIRED_CATEGORIES) {
    assert.equal(categories.includes(category), true, `missing category ${category}`);
  }
});

test('fixture getter works and unknown id returns null', () => {
  assert.equal(getFixedStarConjunctionFixture('inside-orb')?.id, 'inside-orb');
  assert.equal(getFixedStarConjunctionFixture('unknown-fixture'), null);
});

test('expected values are manually declared', () => {
  for (const fixture of FIXED_STAR_CONJUNCTION_FIXTURES) {
    assert.equal(fixture.expected.manuallyDeclared, true, `${fixture.id} must be manual`);
  }
});

test('fixtures contain no private birth data profile coordinates or interpretations', () => {
  const serialized = JSON.stringify(FIXED_STAR_CONJUNCTION_FIXTURES).toLowerCase();

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
