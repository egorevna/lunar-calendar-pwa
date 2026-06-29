import assert from 'node:assert/strict';
import test from 'node:test';

import {
  MIDPOINTS_FIXTURES,
  getMidpointsFixture,
  getMidpointsFixtureCategories,
  getMidpointsFixtureIds,
} from './fixtures/midpointsFixtures.js';

const REQUIRED_CATEGORIES = [
  'simple',
  'wrapAround',
  'exactOpposition',
  'batch',
  'invalid',
  'profile',
  'privacy',
  'strictExclusions',
];

test('MIDPOINTS_FIXTURES is an array', () => {
  assert.equal(Array.isArray(MIDPOINTS_FIXTURES), true);
  assert.equal(MIDPOINTS_FIXTURES.length >= REQUIRED_CATEGORIES.length, true);
});

test('fixture ids are unique', () => {
  const ids = getMidpointsFixtureIds();

  assert.equal(new Set(ids).size, ids.length);
});

test('required fixture categories exist', () => {
  const categories = getMidpointsFixtureCategories();

  for (const category of REQUIRED_CATEGORIES) {
    assert.equal(categories.includes(category), true, `missing category ${category}`);
  }
});

test('fixture getter works and unknown id returns null', () => {
  assert.equal(getMidpointsFixture('simple-10-30')?.id, 'simple-10-30');
  assert.equal(getMidpointsFixture('unknown-fixture'), null);
});

test('expected values are manually declared', () => {
  for (const fixture of MIDPOINTS_FIXTURES) {
    assert.equal(fixture.expected.manuallyDeclared, true, `${fixture.id} must be manual`);
  }
});

test('benchmark-like expectations are static finite numbers or explicit nulls', () => {
  for (const fixture of MIDPOINTS_FIXTURES) {
    if (!Number.isFinite(fixture.input?.longitudeA) || !Number.isFinite(fixture.input?.longitudeB)) {
      continue;
    }

    assert.equal(typeof fixture.expected.status, 'string');
    assert.equal(Number.isFinite(fixture.expected.distance), true);

    if (fixture.expected.status === 'ready') {
      assert.equal(Number.isFinite(fixture.expected.longitude), true);
    }

    if (fixture.expected.status === 'axisAmbiguous') {
      assert.equal(fixture.expected.longitude, null);
      assert.equal(Array.isArray(fixture.expected.candidateAxisPoints), true);
    }
  }
});

test('fixtures contain no private birth data coordinates or interpretations', () => {
  const serialized = JSON.stringify(MIDPOINTS_FIXTURES).toLowerCase();

  for (const forbidden of [
    'birthdate',
    'birthtime',
    'birthplace',
    'utcdatetime',
    'timezone',
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
