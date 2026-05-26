import assert from 'node:assert/strict';
import test from 'node:test';

import {
  getParsFortunaFixture,
  getParsFortunaFixtureCategories,
  getParsFortunaFixtureIds,
  PARS_FORTUNA_FIXTURES,
} from './fixtures/parsFortunaFixtures.js';

const REQUIRED_CATEGORIES = Object.freeze([
  'formulaDay',
  'formulaNight',
  'wrapAround',
  'invalid',
  'profile',
  'privacy',
  'strictExclusions',
]);

test('Pars Fortuna fixtures are static manual fixtures with required categories', () => {
  const ids = getParsFortunaFixtureIds();
  const categories = getParsFortunaFixtureCategories();

  assert.equal(Array.isArray(PARS_FORTUNA_FIXTURES), true);
  assert.equal(PARS_FORTUNA_FIXTURES.length >= REQUIRED_CATEGORIES.length, true);
  assert.equal(new Set(ids).size, ids.length);
  REQUIRED_CATEGORIES.forEach((category) => {
    assert.equal(categories.includes(category), true);
  });
  assert.equal(getParsFortunaFixture('day-formula-simple')?.expected.manuallyDeclared, true);
  assert.equal(getParsFortunaFixture('unknown-fixture'), null);
});

test('Pars Fortuna fixtures do not contain private birth data or interpretations', () => {
  const serialized = JSON.stringify(PARS_FORTUNA_FIXTURES);

  assert.equal(serialized.includes('1981-04-16'), false);
  assert.equal(serialized.includes('04:45'), false);
  assert.equal(serialized.includes('Europe/Moscow'), false);
  assert.equal(serialized.includes('"coordinates":{"'), false);
  assert.equal(serialized.includes('"latitude":'), false);
  assert.equal(serialized.includes('"birthDate":'), false);
  assert.equal(serialized.includes('"birthTime":'), false);
  assert.equal(serialized.includes('"birthPlace":'), false);
  assert.equal(serialized.includes('фаталь'), false);
  assert.equal(serialized.includes('карми'), false);
  assert.equal(serialized.includes('сильн'), false);
  assert.equal(serialized.includes('слаб'), false);
});
