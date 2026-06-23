import assert from 'node:assert/strict';
import test from 'node:test';

import {
  getVronskyArabicPartsDisplayFixture,
  getVronskyArabicPartsDisplayFixtureCategories,
  getVronskyArabicPartsDisplayFixtureIds,
  VRONSKY_ARABIC_PARTS_DISPLAY_FIXTURES,
} from './fixtures/vronskyArabicPartsDisplayFixtures.js';

const REQUIRED_CATEGORIES = [
  'dayReady',
  'withHouseAssignments',
  'nightNotReady',
  'boundaryNotReady',
  'unknownNotReady',
  'privacy',
  'strictExclusions',
];

test('Vronsky Arabic Parts display fixtures are static and categorized', () => {
  assert.equal(Array.isArray(VRONSKY_ARABIC_PARTS_DISPLAY_FIXTURES), true);
  assert.equal(VRONSKY_ARABIC_PARTS_DISPLAY_FIXTURES.length >= REQUIRED_CATEGORIES.length, true);

  const ids = getVronskyArabicPartsDisplayFixtureIds();
  const categories = getVronskyArabicPartsDisplayFixtureCategories();

  assert.equal(new Set(ids).size, ids.length);
  REQUIRED_CATEGORIES.forEach((category) => {
    assert.equal(categories.includes(category), true, `${category} fixture category should exist`);
  });
  assert.equal(getVronskyArabicPartsDisplayFixture('with-house-assignments')?.expected.manuallyDeclared, true);
  assert.equal(getVronskyArabicPartsDisplayFixture('unknown'), null);
});

test('Vronsky display fixtures avoid private data formula operands and interpretations', () => {
  const json = JSON.stringify(VRONSKY_ARABIC_PARTS_DISPLAY_FIXTURES);

  assert.equal(json.includes('"manuallyDeclared":true'), true);
  assert.equal(json.includes('"birthDate"'), false);
  assert.equal(json.includes('"birthTime"'), false);
  assert.equal(json.includes('"utcDateTime"'), false);
  assert.equal(json.includes('"coordinates"'), false);
  assert.equal(json.includes('"latitude"'), false);
  assert.equal(json.includes('"operands"'), false);
  assert.equal(json.includes('"providerPayload"'), false);
  assert.equal(json.includes('фаталь'), false);
  assert.equal(json.includes('карми'), false);
  assert.equal(json.includes('ритуал'), false);
});
