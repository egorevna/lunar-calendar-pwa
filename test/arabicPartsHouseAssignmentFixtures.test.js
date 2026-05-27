import assert from 'node:assert/strict';
import test from 'node:test';

import {
  ARABIC_PARTS_HOUSE_ASSIGNMENT_FIXTURES,
  getArabicPartsHouseAssignmentFixture,
  getArabicPartsHouseAssignmentFixtureCategories,
  getArabicPartsHouseAssignmentFixtureIds,
} from './fixtures/arabicPartsHouseAssignmentFixtures.js';

const REQUIRED_CATEGORIES = Object.freeze([
  'wholeSign',
  'equalHouse',
  'placidus',
  'cuspBoundaries',
  'wrappingSpans',
  'invalid',
  'profile',
  'privacy',
  'strictExclusions',
]);

test('Arabic Parts house assignment fixtures are available unique and categorized', () => {
  const ids = getArabicPartsHouseAssignmentFixtureIds();
  const categories = getArabicPartsHouseAssignmentFixtureCategories();

  assert.equal(Array.isArray(ARABIC_PARTS_HOUSE_ASSIGNMENT_FIXTURES), true);
  assert.equal(ARABIC_PARTS_HOUSE_ASSIGNMENT_FIXTURES.length >= REQUIRED_CATEGORIES.length, true);
  assert.equal(new Set(ids).size, ids.length);
  assert.deepEqual([...categories].sort(), [...REQUIRED_CATEGORIES].sort());
  assert.equal(getArabicPartsHouseAssignmentFixture(ids[0])?.id, ids[0]);
  assert.equal(getArabicPartsHouseAssignmentFixture('unknown-assignment-fixture'), null);
});

test('Arabic Parts house assignment fixture expectations are manually declared', () => {
  const wholeSign = getArabicPartsHouseAssignmentFixture('whole-sign-aquarius-boundaries');
  const equalHouse = getArabicPartsHouseAssignmentFixture('equal-house-aquarius-boundaries');
  const placidus = getArabicPartsHouseAssignmentFixture('placidus-benchmark-boundaries');

  assert.equal(ARABIC_PARTS_HOUSE_ASSIGNMENT_FIXTURES.every((fixture) => fixture.expected?.manuallyDeclared === true), true);
  assert.deepEqual(wholeSign.expected.assignments, {
    'pars-fortuna': 1,
    'lot-of-spirit': 2,
    'capricorn-lot': 12,
  });
  assert.deepEqual(equalHouse.expected.assignments, {
    'equal-cusp-1': 1,
    'equal-before-cusp-2': 1,
    'equal-cusp-2': 2,
    'equal-wrap-house-12': 12,
  });
  assert.deepEqual(placidus.expected.assignments, {
    'placidus-cusp-1': 1,
    'placidus-before-cusp-2': 1,
    'placidus-cusp-2': 2,
    'placidus-wrap-house-12': 12,
  });
});

test('Arabic Parts house assignment fixtures contain no private birth data or interpretations', () => {
  const serialized = JSON.stringify(ARABIC_PARTS_HOUSE_ASSIGNMENT_FIXTURES);

  assert.equal(serialized.includes('1981-04-16'), false);
  assert.equal(serialized.includes('04:45'), false);
  assert.equal(serialized.includes('Europe/Moscow'), false);
  assert.equal(serialized.includes('"coordinates"'), false);
  assert.equal(serialized.includes('"latitude"'), false);
  assert.equal(serialized.includes('"birthDate"'), false);
  assert.equal(serialized.includes('"birthTime"'), false);
  assert.equal(serialized.includes('"birthPlace"'), false);
  assert.equal(serialized.includes('"providerPayload"'), false);
  assert.equal(serialized.includes('фаталь'), false);
  assert.equal(serialized.includes('карми'), false);
  assert.equal(serialized.includes('сильн'), false);
  assert.equal(serialized.includes('слаб'), false);
  assert.equal(serialized.includes('ритуал'), false);
});
