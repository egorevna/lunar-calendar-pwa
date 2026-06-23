import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { calculateArabicPartsFromLongitudes } from '../src/arabicParts.js';
import {
  assignVronskyArabicPartToHouse,
  assignVronskyArabicPartsToHouses,
  assignVronskyArabicPartsToHousesForProfile,
  getVronskyArabicPartsHouseAssignmentCapabilities,
  getVronskyArabicPartsHouseAssignmentLimitations,
  getVronskyArabicPartsHouseAssignmentSummary,
} from '../src/arabicPartsHouseAssignment.js';
import { getActiveArabicPartsFormulas } from '../src/arabicPartsData.js';
import { getVronskyArabicPartsHouseAssignmentFixture } from './fixtures/vronskyArabicPartsHouseAssignmentFixtures.js';

const READY_PROFILE = Object.freeze({
  id: 'vronsky-assignment-profile',
  name: 'Synthetic Vronsky Assignment',
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

function fixture(id) {
  return getVronskyArabicPartsHouseAssignmentFixture(id);
}

function assignmentByKey(assignments) {
  return Object.fromEntries(assignments.map((assignment) => [
    assignment.key,
    assignment.houseNumber ?? null,
  ]));
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
  assert.equal(json.includes('"providerPayload"'), false);
  assert.equal(json.includes('"fullProfileJson"'), false);
  assert.equal(json.includes('NaN'), false);
  assert.equal(json.includes('undefined'), false);
  assert.equal(json.includes('фаталь'), false);
  assert.equal(json.includes('карми'), false);
  assert.equal(json.includes('ритуал'), false);
}

test('assignVronskyArabicPartToHouse assigns ready Vronsky point by numeric longitude', () => {
  const ready = fixture('day-ready-simple-cusps');
  const part = ready.input.vronskyResult.parts[0];
  const assignment = assignVronskyArabicPartToHouse(part, ready.input.cuspResult);

  assert.deepEqual(assignment, {
    status: 'ready',
    ready: true,
    key: 'pars-amoris',
    label: 'Точка любви',
    sourceSystem: 'vronsky-table-17-arabic-points',
    houseSystem: 'equal-house',
    houseNumber: 6,
    houseLabel: '6 дом',
    house: {
      number: 6,
      label: '6 дом',
    },
    text: 'Точка любви — 6 дом',
  });
  assertSafeOutput(assignment);
});

test('assignVronskyArabicPartsToHouses assigns all 12 Vronsky points in source order', () => {
  const ready = fixture('day-ready-simple-cusps');
  const result = assignVronskyArabicPartsToHouses(ready.input.vronskyResult, ready.input.cuspResult);

  assert.equal(result.status, 'ready');
  assert.equal(result.ready, true);
  assert.equal(result.sourceSystem, 'vronsky-table-17-arabic-points');
  assert.equal(result.houseSystem, 'equal-house');
  assert.equal(result.total, 12);
  assert.equal(result.readyCount, 12);
  assert.equal(result.invalidCount, 0);
  assert.deepEqual(result.assignments.map((assignment) => assignment.key), ready.input.vronskyResult.parts.map((part) => part.key));
  assert.deepEqual(assignmentByKey(result.assignments), ready.expected.assignments);
  assert.deepEqual(result.summary.byHouse, { 3: 3, 5: 2, 6: 2, 7: 1, 11: 3, 12: 1 });
  assertSafeOutput(result);
});

test('Vronsky exact cusp boundaries and wrapping spans follow existing house policy', () => {
  const boundary = fixture('exact-cusp-boundaries');
  const wrapping = fixture('wrapping-span');
  const boundaryResult = assignVronskyArabicPartsToHouses({
    status: 'ready',
    ready: true,
    sourceSystem: 'vronsky-table-17-arabic-points',
    parts: boundary.input.exactCuspParts,
  }, boundary.input.cuspResult);
  const wrappingResult = assignVronskyArabicPartToHouse(wrapping.input.part, wrapping.input.cuspResult);

  assert.deepEqual(assignmentByKey(boundaryResult.assignments), boundary.expected.assignments);
  assert.equal(boundary.expected.policy, '[cusp, nextCusp)');
  assert.equal(wrappingResult.houseNumber, wrapping.expected.houseNumber);
  assertSafeOutput({ boundaryResult, wrappingResult });
});

test('Vronsky night results missing cusps and invalid points fail safely without fake houses', () => {
  const night = fixture('night-not-ready');
  const missingCusps = fixture('missing-house-cusps');
  const invalid = fixture('invalid-inputs');
  const ready = fixture('day-ready-simple-cusps');
  const nightResult = assignVronskyArabicPartsToHouses(night.input.vronskyResult, night.input.cuspResult);
  const missingCuspsResult = assignVronskyArabicPartsToHouses(missingCusps.input.vronskyResult, missingCusps.input.cuspResult);
  const missingLongitude = assignVronskyArabicPartToHouse(invalid.input.missingLongitudePart, ready.input.cuspResult);
  const nonVronsky = assignVronskyArabicPartToHouse(invalid.input.nonVronskyPart, ready.input.cuspResult);

  assert.equal(nightResult.status, 'notReady');
  assert.equal(nightResult.reason, night.expected.reason);
  assert.deepEqual(nightResult.assignments, []);
  assert.equal(missingCuspsResult.status, 'notReady');
  assert.equal(missingCuspsResult.reason, missingCusps.expected.reason);
  assert.deepEqual(missingCuspsResult.assignments, []);
  assert.equal(missingLongitude.status, 'invalid');
  assert.equal(missingLongitude.reason, invalid.expected.missingLongitudeReason);
  assert.equal(nonVronsky.status, 'invalid');
  assert.equal(nonVronsky.reason, invalid.expected.nonVronskyReason);
  [nightResult, missingCuspsResult, missingLongitude, nonVronsky].forEach(assertSafeOutput);
});

test('Vronsky assignment profile helper supports injected results without mutating profile', () => {
  const profile = clone(READY_PROFILE);
  const before = clone(profile);
  const ready = fixture('day-ready-simple-cusps');
  const result = assignVronskyArabicPartsToHousesForProfile(profile, {
    vronskyResult: ready.input.vronskyResult,
    cuspResult: ready.input.cuspResult,
  });
  const missingProfile = assignVronskyArabicPartsToHousesForProfile(null);

  assert.equal(result.status, 'ready');
  assert.equal(result.readyCount, 12);
  assert.deepEqual(assignmentByKey(result.assignments), ready.expected.assignments);
  assert.deepEqual(profile, before);
  assert.equal(missingProfile.status, 'notReady');
  assertSafeOutput({ result, missingProfile });
});

test('Vronsky assignment summary capabilities and limitations stay scoped', () => {
  const ready = fixture('day-ready-simple-cusps');
  const result = assignVronskyArabicPartsToHouses(ready.input.vronskyResult, ready.input.cuspResult);
  const summary = getVronskyArabicPartsHouseAssignmentSummary(result);
  const capabilities = getVronskyArabicPartsHouseAssignmentCapabilities();
  const limitations = getVronskyArabicPartsHouseAssignmentLimitations().join(' ');

  assert.deepEqual(summary, {
    total: 12,
    ready: 12,
    invalid: 0,
    byHouse: { 3: 3, 5: 2, 6: 2, 7: 1, 11: 3, 12: 1 },
    text: 'Точки Вронского распределены по домам',
  });
  assert.equal(capabilities.vronskyArabicPartsHouseAssignment, true);
  assert.equal(capabilities.defaultArabicPartsOutput, false);
  assert.equal(capabilities.oldDeferredLots, false);
  assert.equal(capabilities.interpretations, false);
  assert.match(limitations, /Точки Вронского назначаются/);
  assert.match(limitations, /точная числовая долгота/);
  assert.match(limitations, /Ночные формулы/);
  assertSafeOutput({ summary, capabilities, limitations });
});

test('Vronsky assignment does not change default Arabic Parts or activate old deferred lots', () => {
  const activeKeys = getActiveArabicPartsFormulas().map((row) => row.key);
  const defaultResult = calculateArabicPartsFromLongitudes({
    ascLongitude: 10,
    sunLongitude: 100,
    moonLongitude: 150,
    chartSect: 'day',
  });

  assert.deepEqual(activeKeys, ['pars-fortuna', 'lot-of-spirit']);
  assert.deepEqual(defaultResult.parts.map((part) => part.key), ['pars-fortuna', 'lot-of-spirit']);
  assert.equal(JSON.stringify(defaultResult).includes('lot-of-eros'), false);
  assert.equal(JSON.stringify(defaultResult).includes('lot-of-necessity'), false);
  assert.equal(JSON.stringify(defaultResult).includes('lot-of-basis'), false);
  assert.equal(JSON.stringify(defaultResult).includes('lot-of-exaltation'), false);
});

test('Vronsky Arabic Parts house assignment module keeps strict boundaries', async () => {
  const source = await readFile(new URL('../src/arabicPartsHouseAssignment.js', import.meta.url), 'utf8');
  const imports = source
    .split('\n')
    .filter((line) => line.trim().startsWith('import '));

  assert.equal(imports.some((line) => line.includes('provider')), false);
  assert.equal(imports.some((line) => line.includes('localStorage')), false);
  assert.equal(imports.some((line) => line.includes('document')), false);
  assert.equal(imports.some((line) => line.includes('window')), false);
  assert.equal(imports.some((line) => line.includes('swisseph')), false);
  assert.equal(imports.some((line) => line.includes('astronomy-engine')), false);
  assert.equal(source.includes('document.'), false);
  assert.equal(source.includes('window.'), false);
  assert.equal(source.includes('profileUi'), false);
  assert.equal(source.includes('debugPanel'), false);
  assert.equal(source.includes('ASC + Венера'), false);
  assert.equal(source.includes('lot-of-eros') && source.includes('ready: true'), false);
  assert.equal(source.includes('interpretations: true'), false);
  assert.equal(source.includes('ритуал'), false);
  assert.equal(source.includes('карми'), false);
  assert.equal(existsSync(new URL('../src/houses.js', import.meta.url)), false);
  assert.equal(existsSync(new URL('../src/houseSystems.js', import.meta.url)), false);
});
