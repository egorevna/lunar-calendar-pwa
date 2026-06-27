import assert from 'node:assert/strict';
import test from 'node:test';

import {
  MIDPOINT_TARGETS_FIXTURES,
  getMidpointTargetsFixture,
  getMidpointTargetsFixtureCategories,
  getMidpointTargetsFixtureIds,
} from './fixtures/midpointTargetsFixtures.js';

const REQUIRED_CATEGORIES = [
  'natalPlanets',
  'pairDefinitions',
  'deferredTargets',
  'invalid',
  'profile',
  'privacy',
  'strictExclusions',
];

test('MIDPOINT_TARGETS_FIXTURES is an array', () => {
  assert.equal(Array.isArray(MIDPOINT_TARGETS_FIXTURES), true);
  assert.equal(MIDPOINT_TARGETS_FIXTURES.length >= REQUIRED_CATEGORIES.length, true);
});

test('fixture ids are unique', () => {
  const ids = getMidpointTargetsFixtureIds();

  assert.equal(new Set(ids).size, ids.length);
});

test('required fixture categories exist', () => {
  const categories = getMidpointTargetsFixtureCategories();

  for (const category of REQUIRED_CATEGORIES) {
    assert.equal(categories.includes(category), true, `missing category ${category}`);
  }
});

test('fixture getter works and unknown id returns null', () => {
  assert.equal(getMidpointTargetsFixture('natal-planets-ready')?.id, 'natal-planets-ready');
  assert.equal(getMidpointTargetsFixture('unknown-fixture'), null);
});

test('expected values are manually declared', () => {
  for (const fixture of MIDPOINT_TARGETS_FIXTURES) {
    assert.equal(fixture.expected.manuallyDeclared, true, `${fixture.id} must be manual`);
  }
});

test('fixtures contain no private birth data geo values or interpretations', () => {
  const serialized = JSON.stringify(MIDPOINT_TARGETS_FIXTURES).toLowerCase();

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
