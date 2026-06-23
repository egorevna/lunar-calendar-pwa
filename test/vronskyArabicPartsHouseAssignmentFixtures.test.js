import assert from 'node:assert/strict';
import test from 'node:test';

import {
  getVronskyArabicPartsHouseAssignmentFixture,
  getVronskyArabicPartsHouseAssignmentFixtureCategories,
  getVronskyArabicPartsHouseAssignmentFixtureIds,
  VRONSKY_ARABIC_PARTS_HOUSE_ASSIGNMENT_FIXTURES,
} from './fixtures/vronskyArabicPartsHouseAssignmentFixtures.js';

const REQUIRED_CATEGORIES = [
  'dayReady',
  'cuspBoundaries',
  'wrappingSpans',
  'nightNotReady',
  'missingHouseCusps',
  'invalid',
  'privacy',
  'strictExclusions',
];

test('Vronsky Arabic Parts house assignment fixtures are static and categorized', () => {
  assert.equal(Array.isArray(VRONSKY_ARABIC_PARTS_HOUSE_ASSIGNMENT_FIXTURES), true);
  assert.equal(VRONSKY_ARABIC_PARTS_HOUSE_ASSIGNMENT_FIXTURES.length >= REQUIRED_CATEGORIES.length, true);

  const ids = getVronskyArabicPartsHouseAssignmentFixtureIds();
  const categories = getVronskyArabicPartsHouseAssignmentFixtureCategories();

  assert.equal(new Set(ids).size, ids.length);
  REQUIRED_CATEGORIES.forEach((category) => {
    assert.equal(categories.includes(category), true, `${category} fixture category should exist`);
  });
  assert.equal(getVronskyArabicPartsHouseAssignmentFixture('day-ready-simple-cusps')?.expected.manuallyDeclared, true);
  assert.equal(getVronskyArabicPartsHouseAssignmentFixture('unknown'), null);
});

test('Vronsky house assignment fixture expectations are manually declared and safe', () => {
  const json = JSON.stringify(VRONSKY_ARABIC_PARTS_HOUSE_ASSIGNMENT_FIXTURES);

  assert.equal(json.includes('"manuallyDeclared":true'), true);
  assert.equal(json.includes('"birthDate"'), false);
  assert.equal(json.includes('"birthTime"'), false);
  assert.equal(json.includes('"utcDateTime"'), false);
  assert.equal(json.includes('"coordinates"'), false);
  assert.equal(json.includes('"latitude"'), false);
  assert.equal(json.includes('"providerPayload"'), false);
  assert.equal(json.includes('фаталь'), false);
  assert.equal(json.includes('карми'), false);
  assert.equal(json.includes('ритуал'), false);
});
