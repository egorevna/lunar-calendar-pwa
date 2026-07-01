import assert from 'node:assert/strict';
import test from 'node:test';

import {
  ANTISCIA_FIXTURES,
  getAntisciaFixture,
  getAntisciaFixtureCategories,
  getAntisciaFixtureIds,
} from './fixtures/antisciaFixtures.js';

const REQUIRED_CATEGORIES = [
  'formula',
  'axisPoints',
  'target',
  'batch',
  'partial',
  'invalid',
  'profile',
  'privacy',
  'strictExclusions',
];

test('ANTISCIA_FIXTURES is an array', () => {
  assert.equal(Array.isArray(ANTISCIA_FIXTURES), true);
  assert.equal(ANTISCIA_FIXTURES.length >= REQUIRED_CATEGORIES.length, true);
});

test('fixture ids are unique', () => {
  const ids = getAntisciaFixtureIds();

  assert.equal(new Set(ids).size, ids.length);
});

test('required fixture categories exist', () => {
  const categories = getAntisciaFixtureCategories();

  for (const category of REQUIRED_CATEGORIES) {
    assert.equal(categories.includes(category), true, `missing category ${category}`);
  }
});

test('fixture getter works and unknown id returns null', () => {
  assert.equal(getAntisciaFixture('formula-10')?.id, 'formula-10');
  assert.equal(getAntisciaFixture('unknown-fixture'), null);
});

test('expected values are manually declared', () => {
  for (const fixture of ANTISCIA_FIXTURES) {
    assert.equal(fixture.expected.manuallyDeclared, true, `${fixture.id} must be manual`);
  }
});

test('formula expectations are static finite numbers', () => {
  for (const fixture of ANTISCIA_FIXTURES) {
    if (!fixture.categories?.includes('formula') && !fixture.categories?.includes('axisPoints')) {
      continue;
    }

    assert.equal(Number.isFinite(fixture.input.longitude), true);
    assert.equal(Number.isFinite(fixture.expected.antiscion), true);
    assert.equal(Number.isFinite(fixture.expected.contraAntiscion), true);
  }
});

test('fixtures contain no private birth data coordinates or interpretations', () => {
  const serialized = JSON.stringify(ANTISCIA_FIXTURES).toLowerCase();

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
