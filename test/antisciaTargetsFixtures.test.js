import assert from 'node:assert/strict';
import test from 'node:test';

import {
  ANTISCIA_TARGETS_FIXTURES,
  getAntisciaTargetsFixture,
  getAntisciaTargetsFixtureCategories,
  getAntisciaTargetsFixtureIds,
} from './fixtures/antisciaTargetsFixtures.js';

const REQUIRED_CATEGORIES = [
  'natalPlanets',
  'angles',
  'combined',
  'partial',
  'deferredTargets',
  'invalid',
  'profile',
  'privacy',
  'strictExclusions',
];

test('ANTISCIA_TARGETS_FIXTURES is an array with unique ids', () => {
  assert.equal(Array.isArray(ANTISCIA_TARGETS_FIXTURES), true);
  assert.equal(new Set(getAntisciaTargetsFixtureIds()).size, getAntisciaTargetsFixtureIds().length);
});

test('required antiscia target fixture categories exist', () => {
  const categories = getAntisciaTargetsFixtureCategories();

  for (const category of REQUIRED_CATEGORIES) {
    assert.equal(categories.includes(category), true, `missing category ${category}`);
  }
});

test('fixture getter works and unknown id returns null', () => {
  assert.equal(getAntisciaTargetsFixture('combined-ready')?.id, 'combined-ready');
  assert.equal(getAntisciaTargetsFixture('unknown'), null);
});

test('expected values are manually declared', () => {
  assert.equal(ANTISCIA_TARGETS_FIXTURES.every((fixture) => fixture.expected?.manuallyDeclared === true), true);
});

test('fixtures contain no private birth data coordinates or interpretations', () => {
  const text = JSON.stringify(ANTISCIA_TARGETS_FIXTURES).toLowerCase();

  for (const forbidden of [
    'birthdate',
    'birthtime',
    'utcdatetime',
    'timezone',
    'coordinates',
    'latitude',
    'birthplace',
    'providerpayload',
    'fullprofile',
    'interpretationtext',
    'mythology',
    'prediction',
    'fatalistic',
    'karmic',
    'ритуал',
    'судьб',
  ]) {
    assert.equal(text.includes(forbidden), false, `fixtures should not include ${forbidden}`);
  }
});
