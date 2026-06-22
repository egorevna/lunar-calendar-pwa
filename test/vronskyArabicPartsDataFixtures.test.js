import assert from 'node:assert/strict';
import test from 'node:test';

import {
  VRONSKY_ARABIC_PARTS_DATA_FIXTURES,
  getVronskyArabicPartsDataFixture,
  getVronskyArabicPartsDataFixtureCategories,
  getVronskyArabicPartsDataFixtureIds,
} from './fixtures/vronskyArabicPartsDataFixtures.js';

const REQUIRED_CATEGORIES = Object.freeze([
  'sourcePolicy',
  'existingActiveRows',
  'vronskySimpleRows',
  'dayOnlyPolicy',
  'pendingEngine',
  'deferredRows',
  'needsReviewRows',
  'privacy',
  'strictExclusions',
]);

function assertSafeFixtureText(value) {
  const json = JSON.stringify(value);

  assert.equal(json.includes('birthDate'), false);
  assert.equal(json.includes('birthTime'), false);
  assert.equal(json.includes('utcDateTime'), false);
  assert.equal(json.includes('raw timezone'), false);
  assert.equal(json.includes('coordinates'), false);
  assert.equal(json.includes('providerPayload'), false);
  assert.equal(json.includes('longitude'), false);
  assert.equal(json.includes('фаталь'), false);
  assert.equal(json.includes('карми'), false);
  assert.equal(json.includes('ритуал'), false);
}

test('Vronsky Arabic Parts data fixtures are manually declared with unique ids', () => {
  const ids = getVronskyArabicPartsDataFixtureIds();

  assert.equal(Array.isArray(VRONSKY_ARABIC_PARTS_DATA_FIXTURES), true);
  assert.equal(VRONSKY_ARABIC_PARTS_DATA_FIXTURES.length >= REQUIRED_CATEGORIES.length, true);
  assert.deepEqual(new Set(ids).size, ids.length);
  VRONSKY_ARABIC_PARTS_DATA_FIXTURES.forEach((fixture) => {
    assert.equal(fixture.expected.manuallyDeclared, true);
  });
});

test('Vronsky Arabic Parts data fixtures expose required categories and getters', () => {
  const categories = getVronskyArabicPartsDataFixtureCategories();

  REQUIRED_CATEGORIES.forEach((category) => {
    assert.equal(categories.includes(category), true);
  });
  assert.equal(getVronskyArabicPartsDataFixture('vronsky-source-policy').category, 'sourcePolicy');
  assert.equal(getVronskyArabicPartsDataFixture('unknown'), null);
});

test('Vronsky Arabic Parts fixtures record source policy and first simple row pack', () => {
  const source = getVronskyArabicPartsDataFixture('vronsky-source-policy').expected;
  const rows = getVronskyArabicPartsDataFixture('vronsky-simple-row-keys').expected;
  const formulas = getVronskyArabicPartsDataFixture('vronsky-simple-row-formulas').expected.formulas;
  const dayOnly = getVronskyArabicPartsDataFixture('day-only-policy').expected;
  const pending = getVronskyArabicPartsDataFixture('pending-engine-policy').expected;

  assert.equal(source.sourceSystem, 'vronsky-table-17-arabic-points');
  assert.equal(source.formulaTradition, 'Vronsky Table 17 Arabic Points');
  assert.equal(source.sourceSection, 'Для дневного рождения');
  assert.equal(source.externalTraditionsUsed, false);
  assert.equal(rows.keys.length, 12);
  assert.equal(rows.keys.includes('pars-amoris'), true);
  assert.equal(rows.keys.includes('lot-of-eros'), false);
  assert.equal(rows.keys.includes('pars-mercaturae'), true);
  assert.equal(Object.hasOwn(formulas, 'pars-mercatoris'), false);
  assert.equal(formulas['pars-mercaturae'], 'ASC + Mercury - Sun');
  assert.equal(dayOnly.chartSectPolicy, 'dayOnly');
  assert.equal(dayOnly.nightFormulaStatus, 'missing/notVerified');
  assert.equal(pending.active, false);
  assert.equal(pending.engineStatus, 'pendingEngineExpansion');
});

test('Vronsky Arabic Parts fixtures are privacy-safe and contain no interpretations', () => {
  VRONSKY_ARABIC_PARTS_DATA_FIXTURES.forEach(assertSafeFixtureText);
});
