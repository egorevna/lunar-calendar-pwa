import assert from 'node:assert/strict';
import test from 'node:test';

import {
  HOUSE_CUSPS_FIXTURES,
  getHouseCuspsFixture,
  getHouseCuspsFixtureCategories,
  getHouseCuspsFixtureIds,
} from './fixtures/houseCuspsFixtures.js';

const REQUIRED_CATEGORIES = Object.freeze([
  'wholeSign',
  'equalHouse',
  'placidus',
  'router',
  'profile',
  'invalid',
  'privacy',
  'strictExclusions',
]);

test('house cusp fixtures are available, unique and categorized', () => {
  const ids = getHouseCuspsFixtureIds();
  const categories = getHouseCuspsFixtureCategories();

  assert.equal(Array.isArray(HOUSE_CUSPS_FIXTURES), true);
  assert.equal(HOUSE_CUSPS_FIXTURES.length >= REQUIRED_CATEGORIES.length, true);
  assert.equal(new Set(ids).size, ids.length);
  assert.deepEqual([...categories].sort(), [...REQUIRED_CATEGORIES].sort());
  assert.equal(getHouseCuspsFixture(ids[0])?.id, ids[0]);
  assert.equal(getHouseCuspsFixture('unknown-house-cusp-fixture'), null);
});

test('house cusp fixture expectations are manually declared and safe', () => {
  const fixtureJson = JSON.stringify(HOUSE_CUSPS_FIXTURES);

  assert.equal(HOUSE_CUSPS_FIXTURES.every((fixture) => fixture.expected?.manuallyDeclared === true), true);
  assert.equal(fixtureJson.includes('calculate'), false);
  assert.equal(fixtureJson.includes('generatedByEngine'), false);
  assert.equal(fixtureJson.includes('Егор'), false);
  assert.equal(fixtureJson.includes('Егоревна'), false);
  assert.equal(fixtureJson.includes('1990-01-01'), false);
  assert.equal(fixtureJson.includes('04:45'), false);
  assert.equal(fixtureJson.includes('Europe/Moscow'), false);
  assert.equal(fixtureJson.includes('фаталь'), false);
  assert.equal(fixtureJson.includes('карми'), false);
});

test('required house cusp fixtures expose manual Whole Sign, Equal House and Placidus values', () => {
  const wholeSign = getHouseCuspsFixture('whole-sign-asc-aquarius-boundaries');
  const equalHouse = getHouseCuspsFixture('equal-house-asc-aquarius-14-47-29');
  const placidus = getHouseCuspsFixture('placidus-moscow-1981-swiss-exact');

  assert.deepEqual(wholeSign.expected.cuspLongitudes, [300, 330, 0, 30, 60, 90, 120, 150, 180, 210, 240, 270]);
  assert.equal(wholeSign.expected.cuspType, 'sign-boundary');
  assert.equal(wholeSign.expected.exactCuspDegrees, false);

  assert.deepEqual(equalHouse.expected.cuspLongitudes, [
    314.791633,
    344.791633,
    14.791633,
    44.791633,
    74.791633,
    104.791633,
    134.791633,
    164.791633,
    194.791633,
    224.791633,
    254.791633,
    284.791633,
  ]);
  assert.equal(equalHouse.expected.cuspType, 'equal-30-degree');
  assert.equal(equalHouse.expected.exactCuspDegrees, true);

  assert.deepEqual(placidus.expected.cuspLongitudes, [
    314.791633,
    23.900972,
    55.414891,
    74.211916,
    89.709349,
    106.615575,
    134.791633,
    203.900972,
    235.414891,
    254.211916,
    269.709349,
    286.615575,
  ]);
  assert.equal(placidus.expected.cusps[0].text, '1 дом — Водолей 14°47′29″');
  assert.equal(placidus.expected.cusps[9].text, '10 дом — Стрелец 14°12′42″');
  assert.equal(placidus.expected.cuspType, 'quadrant-placidus');
  assert.equal(placidus.expected.benchmarkValidated, true);
});
