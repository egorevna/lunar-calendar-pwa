import assert from 'node:assert/strict';
import test from 'node:test';

import {
  VRONSKY_ARABIC_PARTS_ENGINE_FIXTURES,
  getVronskyArabicPartsEngineFixture,
  getVronskyArabicPartsEngineFixtureCategories,
  getVronskyArabicPartsEngineFixtureIds,
} from './fixtures/vronskyArabicPartsEngineFixtures.js';

const REQUIRED_CATEGORIES = Object.freeze([
  'dayReady',
  'nightNotReady',
  'boundaryNotReady',
  'unknownNotReady',
  'missingInputs',
  'wrapAround',
  'profile',
  'privacy',
  'strictExclusions',
]);

function assertSafeFixtureText(value) {
  const json = JSON.stringify(value);

  assert.equal(json.includes('birthDate'), false);
  assert.equal(json.includes('birthTime'), false);
  assert.equal(json.includes('utcDateTime'), false);
  assert.equal(json.includes('coordinates'), false);
  assert.equal(json.includes('latitude'), false);
  assert.equal(json.includes('providerPayload'), false);
  assert.equal(json.includes('fullProfileJson'), false);
  assert.equal(json.includes('фаталь'), false);
  assert.equal(json.includes('карми'), false);
  assert.equal(json.includes('ритуал'), false);
}

test('Vronsky Arabic Parts engine fixtures are manually declared with unique ids', () => {
  const ids = getVronskyArabicPartsEngineFixtureIds();

  assert.equal(Array.isArray(VRONSKY_ARABIC_PARTS_ENGINE_FIXTURES), true);
  assert.equal(VRONSKY_ARABIC_PARTS_ENGINE_FIXTURES.length >= REQUIRED_CATEGORIES.length, true);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(VRONSKY_ARABIC_PARTS_ENGINE_FIXTURES.every((fixture) => fixture.expected?.manuallyDeclared), true);
});

test('Vronsky Arabic Parts engine fixtures expose required categories and getters', () => {
  const categories = getVronskyArabicPartsEngineFixtureCategories();

  REQUIRED_CATEGORIES.forEach((category) => {
    assert.equal(categories.includes(category), true);
  });
  assert.equal(getVronskyArabicPartsEngineFixture('day-ready-synthetic')?.category, 'dayReady');
  assert.equal(getVronskyArabicPartsEngineFixture('unknown-fixture'), null);
});

test('Vronsky Arabic Parts engine fixtures keep expected values static and safe', () => {
  const dayFixture = getVronskyArabicPartsEngineFixture('day-ready-synthetic');
  const wrapFixture = getVronskyArabicPartsEngineFixture('wrap-around');

  assert.equal(dayFixture.expected.longitudes['pars-amoris'], 170);
  assert.equal(dayFixture.expected.longitudes['pars-creationis'], 300);
  assert.equal(wrapFixture.expected.longitudes['pars-amoris'], 330);
  assert.equal(wrapFixture.expected.longitudes.astrologia, 70);
  Object.values(dayFixture.expected.longitudes).forEach((longitude) => {
    assert.equal(Number.isFinite(longitude), true);
  });
  assertSafeFixtureText(VRONSKY_ARABIC_PARTS_ENGINE_FIXTURES);
});
