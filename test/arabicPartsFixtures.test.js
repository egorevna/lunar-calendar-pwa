import assert from 'node:assert/strict';
import test from 'node:test';

import {
  ARABIC_PARTS_FIXTURES,
  getArabicPartsFixture,
  getArabicPartsFixtureCategories,
  getArabicPartsFixtureIds,
} from './fixtures/arabicPartsFixtures.js';

const REQUIRED_CATEGORIES = Object.freeze([
  'formulaDay',
  'formulaNight',
  'wrapAround',
  'activeOnly',
  'invalid',
  'profile',
  'privacy',
  'strictExclusions',
]);

test('Arabic Parts fixtures are static manual fixtures with required categories', () => {
  const ids = getArabicPartsFixtureIds();
  const categories = getArabicPartsFixtureCategories();

  assert.equal(Array.isArray(ARABIC_PARTS_FIXTURES), true);
  assert.equal(ARABIC_PARTS_FIXTURES.length >= REQUIRED_CATEGORIES.length, true);
  assert.equal(new Set(ids).size, ids.length);
  REQUIRED_CATEGORIES.forEach((category) => {
    assert.equal(categories.includes(category), true);
  });
  assert.equal(getArabicPartsFixture('day-formula-simple')?.expected.manuallyDeclared, true);
  assert.equal(getArabicPartsFixture('unknown-fixture'), null);
});

test('Arabic Parts fixtures keep expectations manual and active-only', () => {
  const day = getArabicPartsFixture('day-formula-simple');
  const night = getArabicPartsFixture('night-formula-simple');
  const activeOnly = getArabicPartsFixture('active-only');

  assert.equal(day.expected.parts['pars-fortuna'].longitude, 60);
  assert.equal(day.expected.parts['lot-of-spirit'].longitude, 320);
  assert.equal(night.expected.parts['pars-fortuna'].longitude, 320);
  assert.equal(night.expected.parts['lot-of-spirit'].longitude, 60);
  assert.deepEqual(activeOnly.expected.activeKeys, ['pars-fortuna', 'lot-of-spirit']);
  assert.deepEqual(activeOnly.expected.deferredKeys, [
    'lot-of-eros',
    'lot-of-necessity',
    'lot-of-basis',
    'lot-of-exaltation',
  ]);
});

test('Arabic Parts fixtures do not contain private birth data or interpretations', () => {
  const serialized = JSON.stringify(ARABIC_PARTS_FIXTURES);

  assert.equal(serialized.includes('1981-04-16'), false);
  assert.equal(serialized.includes('04:45'), false);
  assert.equal(serialized.includes('Europe/Moscow'), false);
  assert.equal(serialized.includes('"coordinates"'), false);
  assert.equal(serialized.includes('"latitude"'), false);
  assert.equal(serialized.includes('"birthDate"'), false);
  assert.equal(serialized.includes('"birthTime"'), false);
  assert.equal(serialized.includes('"birthPlace"'), false);
  assert.equal(serialized.includes('providerPayload":true'), false);
  assert.equal(serialized.includes('фаталь'), false);
  assert.equal(serialized.includes('карми'), false);
  assert.equal(serialized.includes('сильн'), false);
  assert.equal(serialized.includes('слаб'), false);
  assert.equal(serialized.includes('ритуал'), false);
});
