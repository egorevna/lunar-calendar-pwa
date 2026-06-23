import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { getVronskyArabicPartsForProfile } from '../src/vronskyArabicPartsForProfile.js';
import { getActiveArabicPartsFormulas } from '../src/arabicPartsData.js';
import { getVronskyArabicPartsDisplayFixture } from './fixtures/vronskyArabicPartsDisplayFixtures.js';
import { getVronskyArabicPartsHouseAssignmentFixture } from './fixtures/vronskyArabicPartsHouseAssignmentFixtures.js';

const VALID_PROFILE = Object.freeze({
  id: 'vronsky-profile',
  name: 'Synthetic Vronsky Profile',
  birthDate: '2000-03-20',
  birthTime: '15:00',
  birthTimeAccuracy: 'exact',
  birthPlace: Object.freeze({
    city: 'Гринвич',
    country: 'Великобритания',
    coordinates: Object.freeze({
      latitude: 0,
      longitude: 0,
    }),
    timezone: 'UTC',
  }),
  currentPlace: Object.freeze({
    mode: 'custom',
    city: 'Гринвич',
    country: 'Великобритания',
    timezone: 'UTC',
  }),
  houseSystem: 'equalHouse',
  zodiac: 'tropical',
});

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function assertSafeOutput(value) {
  const json = JSON.stringify(value);

  assert.equal(json.includes('2000-03-20'), false);
  assert.equal(json.includes('15:00'), false);
  assert.equal(json.includes('"birthDate"'), false);
  assert.equal(json.includes('"birthTime"'), false);
  assert.equal(json.includes('"birthPlace"'), false);
  assert.equal(json.includes('"utcDateTime"'), false);
  assert.equal(json.includes('"timezone"'), false);
  assert.equal(json.includes('"coordinates"'), false);
  assert.equal(json.includes('"latitude"'), false);
  assert.equal(json.includes('"longitude"'), false);
  assert.equal(json.includes('"sourceExpression"'), false);
  assert.equal(json.includes('"operands"'), false);
  assert.equal(json.includes('"providerPayload"'), false);
  assert.equal(json.includes('"fullProfileJson"'), false);
  assert.equal(json.includes('фаталь'), false);
  assert.equal(json.includes('карми'), false);
  assert.equal(json.includes('ритуал'), false);
}

test('getVronskyArabicPartsForProfile returns fallback for no profile and night chart', () => {
  const noProfile = getVronskyArabicPartsForProfile(null);
  const nightFixture = getVronskyArabicPartsDisplayFixture('night-not-ready');
  const night = getVronskyArabicPartsForProfile(VALID_PROFILE, {
    vronskyResult: nightFixture.input.vronskyResult,
  });

  assert.equal(noProfile.status, 'notReady');
  assert.equal(noProfile.ready, false);
  assert.equal(noProfile.title, 'Точки Вронского');
  assert.deepEqual(noProfile.items, []);
  assert.equal(night.status, 'notReady');
  assert.equal(night.message, nightFixture.expected.message);
  assert.deepEqual(night.items, []);
  [noProfile, night].forEach(assertSafeOutput);
});

test('getVronskyArabicPartsForProfile returns ready view model with injected houses', () => {
  const profile = clone(VALID_PROFILE);
  const before = clone(profile);
  const displayFixture = getVronskyArabicPartsDisplayFixture('with-house-assignments');
  const assignmentFixture = getVronskyArabicPartsHouseAssignmentFixture('day-ready-simple-cusps');
  const view = getVronskyArabicPartsForProfile(profile, {
    vronskyResult: displayFixture.input.vronskyResult,
    cuspResult: assignmentFixture.input.cuspResult,
  });

  assert.equal(view.status, 'ready');
  assert.equal(view.ready, true);
  assert.equal(view.title, 'Точки Вронского');
  assert.equal(view.summary, '12 точек Вронского рассчитаны');
  assert.equal(view.items.length, 12);
  assert.equal(view.items[0].text, 'Точка любви — Дева 20°00′00″ · 6 дом');
  assert.equal(view.items.at(-1).text, 'Торговля — Дева 0°00′00″ · 6 дом');
  assert.deepEqual(profile, before);
  assertSafeOutput(view);
});

test('Vronsky profile helper keeps default Arabic Parts active set unchanged and stays off UI path', async () => {
  const activeKeys = getActiveArabicPartsFormulas().map((row) => row.key);
  const source = await readFile(new URL('../src/vronskyArabicPartsForProfile.js', import.meta.url), 'utf8');

  assert.deepEqual(activeKeys, ['pars-fortuna', 'lot-of-spirit']);
  assert.equal(source.includes('profileUi'), false);
  assert.equal(source.includes('app.js'), false);
  assert.equal(source.includes('debugPanel'), false);
  assert.equal(source.includes('provider'), false);
  assert.equal(source.includes('astronomy-engine'), false);
  assert.equal(source.includes('swisseph'), false);
  assert.equal(source.includes('localStorage'), false);
  assert.equal(source.includes('document'), false);
  assert.equal(source.includes('window'), false);
  assert.equal(source.includes('lot-of-eros'), false);
  assert.equal(source.includes('lot-of-necessity'), false);
  assert.equal(source.includes('lot-of-basis'), false);
  assert.equal(source.includes('lot-of-exaltation'), false);
});
