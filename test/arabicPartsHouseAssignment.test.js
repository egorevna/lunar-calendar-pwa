import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { calculateArabicPartsFromLongitudes } from '../src/arabicParts.js';
import {
  assignArabicPartToHouse,
  assignArabicPartsToHouses,
  assignArabicPartsToHousesForProfile,
  findHouseForArabicPartLongitude,
  getArabicPartsHouseAssignmentCapabilities,
  getArabicPartsHouseAssignmentLimitations,
  getArabicPartsHouseAssignmentSummary,
} from '../src/arabicPartsHouseAssignment.js';
import { getArabicPartsHouseAssignmentFixture } from './fixtures/arabicPartsHouseAssignmentFixtures.js';

const READY_PROFILE = Object.freeze({
  id: 'arabic-parts-house-assignment-profile',
  name: 'Synthetic Assignment Profile',
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
  houseSystem: 'wholeSign',
  zodiac: 'tropical',
});

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function assignmentByKey(assignments) {
  return Object.fromEntries(assignments.map((assignment) => [
    assignment.key,
    assignment.houseNumber ?? null,
  ]));
}

function fixture(id) {
  return getArabicPartsHouseAssignmentFixture(id);
}

function partsResultFromFixture(fixtureValue) {
  return Object.freeze({
    status: 'ready',
    ready: true,
    total: fixtureValue.input.parts.length,
    readyCount: fixtureValue.input.parts.length,
    invalidCount: 0,
    parts: fixtureValue.input.parts,
  });
}

function assertSafeOutput(value) {
  const json = JSON.stringify(value);

  assert.equal(json.includes('2000-03-20'), false);
  assert.equal(json.includes('15:00'), false);
  assert.equal(json.includes('UTC'), false);
  assert.equal(json.includes('"birthDate"'), false);
  assert.equal(json.includes('"birthTime"'), false);
  assert.equal(json.includes('"birthPlace"'), false);
  assert.equal(json.includes('"utcDateTime"'), false);
  assert.equal(json.includes('"coordinates"'), false);
  assert.equal(json.includes('"latitude"'), false);
  assert.equal(json.includes('"longitude"'), false);
  assert.equal(json.includes('"providerPayload"'), false);
  assert.equal(json.includes('"fullProfileJson"'), false);
  assert.equal(json.includes('NaN'), false);
  assert.equal(json.includes('undefined'), false);
  assert.equal(json.includes('фаталь'), false);
  assert.equal(json.includes('карми'), false);
  assert.equal(json.includes('сильный дом'), false);
  assert.equal(json.includes('слабый дом'), false);
  assert.equal(json.includes('ритуал'), false);
}

test('Whole Sign assigns lots by canonical sign-boundary cusps', () => {
  const wholeSign = fixture('whole-sign-aquarius-boundaries');
  const result = assignArabicPartsToHouses(partsResultFromFixture(wholeSign), wholeSign.input.cuspResult);

  assert.equal(result.status, 'ready');
  assert.equal(result.ready, true);
  assert.equal(result.houseSystem, 'whole-sign');
  assert.deepEqual(assignmentByKey(result.assignments), wholeSign.expected.assignments);
  assert.equal(findHouseForArabicPartLongitude(315, wholeSign.input.cuspResult)?.number, 1);
  assert.equal(findHouseForArabicPartLongitude(331, wholeSign.input.cuspResult)?.number, 2);
  assert.equal(findHouseForArabicPartLongitude(299, wholeSign.input.cuspResult)?.number, 12);
  assertSafeOutput(result);
});

test('Equal House assigns lots by half-open exact cusp spans', () => {
  const equalHouse = fixture('equal-house-aquarius-boundaries');
  const result = assignArabicPartsToHouses(partsResultFromFixture(equalHouse), equalHouse.input.cuspResult);

  assert.equal(result.status, 'ready');
  assert.equal(result.houseSystem, 'equal-house');
  assert.deepEqual(assignmentByKey(result.assignments), equalHouse.expected.assignments);
  assert.equal(findHouseForArabicPartLongitude(314.791633, equalHouse.input.cuspResult)?.number, 1);
  assert.equal(findHouseForArabicPartLongitude(344.791, equalHouse.input.cuspResult)?.number, 1);
  assert.equal(findHouseForArabicPartLongitude(344.791633, equalHouse.input.cuspResult)?.number, 2);
  assert.equal(findHouseForArabicPartLongitude(300, equalHouse.input.cuspResult)?.number, 12);
  assertSafeOutput(result);
});

test('Placidus assigns lots by canonical Placidus cusps without fallback', () => {
  const placidus = fixture('placidus-benchmark-boundaries');
  const result = assignArabicPartsToHouses(partsResultFromFixture(placidus), placidus.input.cuspResult);

  assert.equal(result.status, 'ready');
  assert.equal(result.houseSystem, 'placidus');
  assert.deepEqual(assignmentByKey(result.assignments), placidus.expected.assignments);
  assert.equal(findHouseForArabicPartLongitude(314.791633, placidus.input.cuspResult)?.number, 1);
  assert.equal(findHouseForArabicPartLongitude(23.9009, placidus.input.cuspResult)?.number, 1);
  assert.equal(findHouseForArabicPartLongitude(23.900972, placidus.input.cuspResult)?.number, 2);
  assert.equal(findHouseForArabicPartLongitude(300, placidus.input.cuspResult)?.number, 12);
  assertSafeOutput(result);
});

test('exact cusp boundary belongs to the house starting at that cusp', () => {
  const boundary = fixture('cusp-boundary-policy');
  const house = findHouseForArabicPartLongitude(boundary.input.exactCuspLongitude, boundary.input.cuspResult);

  assert.equal(house.number, boundary.expected.houseNumber);
  assert.equal(boundary.expected.policy, '[cusp, nextCusp)');
});

test('wrapping cusp span is supported', () => {
  const wrapping = fixture('wrapping-span-policy');
  const house = findHouseForArabicPartLongitude(wrapping.input.longitude, wrapping.input.cuspResult);

  assert.equal(house.number, wrapping.expected.houseNumber);
});

test('single part assignment returns safe ready text without raw longitude', () => {
  const wholeSign = fixture('whole-sign-aquarius-boundaries');
  const part = wholeSign.input.parts[0];
  const assignment = assignArabicPartToHouse(part, wholeSign.input.cuspResult);

  assert.deepEqual(assignment, {
    status: 'ready',
    ready: true,
    key: 'pars-fortuna',
    label: 'Парс Фортуны',
    houseSystem: 'whole-sign',
    houseNumber: 1,
    houseLabel: '1 дом',
    house: {
      number: 1,
      label: '1 дом',
    },
    text: 'Парс Фортуны — 1 дом',
  });
  assertSafeOutput(assignment);
});

test('aggregate assignment preserves lot order and summarizes houses', () => {
  const injected = fixture('profile-ready-injected');
  const result = assignArabicPartsToHouses(injected.input.partsResult, injected.input.cuspResult);
  const summary = getArabicPartsHouseAssignmentSummary(result.assignments);

  assert.deepEqual(result.assignments.map((assignment) => assignment.key), ['pars-fortuna', 'lot-of-spirit']);
  assert.deepEqual(assignmentByKey(result.assignments), injected.expected.assignments);
  assert.equal(result.total, 2);
  assert.equal(result.readyCount, 2);
  assert.equal(result.invalidCount, 0);
  assert.deepEqual(result.summary.byHouse, { 1: 1, 5: 1 });
  assert.deepEqual(summary, result.summary);
});

test('notReady parts/cusps and invalid lots fail safely without fake houses', () => {
  const invalid = fixture('invalid-inputs');
  const wholeSign = fixture('whole-sign-aquarius-boundaries');
  const missingLongitude = assignArabicPartToHouse(
    invalid.input.missingLongitudePart,
    wholeSign.input.cuspResult,
  );
  const notReadyPart = assignArabicPartToHouse(
    invalid.input.notReadyPart,
    wholeSign.input.cuspResult,
  );
  const notReadyCusps = assignArabicPartsToHouses(
    partsResultFromFixture(wholeSign),
    invalid.input.notReadyCusps,
  );
  const unsupportedCusps = assignArabicPartsToHouses(
    partsResultFromFixture(wholeSign),
    invalid.input.unsupportedCusps,
  );
  const emptyParts = assignArabicPartsToHouses(
    invalid.input.emptyPartsResult,
    wholeSign.input.cuspResult,
  );

  assert.equal(missingLongitude.status, 'invalid');
  assert.equal(missingLongitude.reason, invalid.expected.invalidPartReason);
  assert.equal(notReadyPart.status, 'invalid');
  assert.equal(notReadyPart.reason, 'missingSunLongitude');
  assert.equal(notReadyCusps.status, 'notReady');
  assert.equal(notReadyCusps.reason, invalid.expected.notReadyReason);
  assert.deepEqual(notReadyCusps.assignments, []);
  assert.equal(unsupportedCusps.status, 'unsupported');
  assert.equal(unsupportedCusps.reason, invalid.expected.unsupportedReason);
  assert.deepEqual(unsupportedCusps.assignments, []);
  assert.equal(emptyParts.status, 'notReady');
  assert.equal(emptyParts.reason, 'emptyPartsResult');
  [missingLongitude, notReadyPart, notReadyCusps, unsupportedCusps, emptyParts].forEach(assertSafeOutput);
});

test('deferred Arabic Parts are not assigned as ready values', () => {
  const wholeSign = fixture('whole-sign-aquarius-boundaries');
  const partsResult = calculateArabicPartsFromLongitudes({
    ascLongitude: 10,
    sunLongitude: 100,
    moonLongitude: 150,
    chartSect: 'day',
    formulaKeys: ['pars-fortuna', 'lot-of-eros'],
  });
  const result = assignArabicPartsToHouses(partsResult, wholeSign.input.cuspResult);

  assert.equal(result.status, 'ready');
  assert.equal(result.ready, true);
  assert.equal(result.readyCount, 1);
  assert.equal(result.invalidCount, 1);
  assert.equal(result.assignments[0].key, 'pars-fortuna');
  assert.equal(result.assignments[0].status, 'ready');
  assert.equal(result.assignments[1].key, 'lot-of-eros');
  assert.equal(result.assignments[1].status, 'invalid');
  assert.equal(result.assignments[1].reason, 'formulaNotActive');
  assert.equal(result.assignments[1].houseNumber, null);
  assertSafeOutput(result);
});

test('profile helper returns safe fallbacks and ready injected profile path without mutation', () => {
  const missingProfile = assignArabicPartsToHousesForProfile(null);
  const missingCoordinates = assignArabicPartsToHousesForProfile({
    ...clone(READY_PROFILE),
    birthPlace: {
      ...READY_PROFILE.birthPlace,
      coordinates: undefined,
    },
  });
  const profile = clone(READY_PROFILE);
  const injected = fixture('profile-ready-injected');
  const ready = assignArabicPartsToHousesForProfile(profile, {
    partsResult: injected.input.partsResult,
    cuspResult: injected.input.cuspResult,
  });

  assert.equal(missingProfile.status, 'notReady');
  assert.equal(missingProfile.reason, 'missingProfile');
  assert.equal(missingCoordinates.status, 'notReady');
  assert.equal(missingCoordinates.reason, 'cityWithoutCoordinates');
  assert.equal(ready.status, 'ready');
  assert.equal(ready.ready, true);
  assert.deepEqual(assignmentByKey(ready.assignments), injected.expected.assignments);
  assert.deepEqual(profile, clone(READY_PROFILE));
  [missingProfile, missingCoordinates, ready].forEach(assertSafeOutput);
});

test('capabilities and limitations keep lot assignment scoped', () => {
  const capabilities = getArabicPartsHouseAssignmentCapabilities();
  const limitations = getArabicPartsHouseAssignmentLimitations().join(' ');

  assert.deepEqual(capabilities, {
    arabicPartsHouseAssignment: true,
    parsFortuna: true,
    lotOfSpirit: true,
    wholeSign: true,
    equalHouse: true,
    placidus: true,
    interpretations: false,
    transits: false,
    fixedStars: false,
  });
  assert.match(limitations, /выбранной системе домов/);
  assert.match(limitations, /точная числовая долгота/);
  assert.match(limitations, /Граница куспида/);
  assert.match(limitations, /не добавляет интерпретации/);
});

test('Arabic Parts house assignment module keeps strict boundaries', async () => {
  const source = await readFile(new URL('../src/arabicPartsHouseAssignment.js', import.meta.url), 'utf8');
  const imports = source
    .split('\n')
    .filter((line) => line.trim().startsWith('import '));
  const fixtureValue = fixture('whole-sign-aquarius-boundaries');
  const result = assignArabicPartsToHouses(
    partsResultFromFixture(fixtureValue),
    fixtureValue.input.cuspResult,
  );

  assertSafeOutput(result);
  assert.equal(imports.some((line) => line.includes('provider')), false);
  assert.equal(imports.some((line) => line.includes('localStorage')), false);
  assert.equal(imports.some((line) => line.includes('document')), false);
  assert.equal(imports.some((line) => line.includes('window')), false);
  assert.equal(imports.some((line) => line.includes('swisseph')), false);
  assert.equal(imports.some((line) => line.includes('astronomy-engine')), false);
  assert.equal(source.includes('document.'), false);
  assert.equal(source.includes('window.'), false);
  assert.equal(source.includes('ASC + Moon - Sun'), false);
  assert.equal(source.includes('ASC + Sun - Moon'), false);
  assert.equal(source.includes('lot-of-necessity') && source.includes('readyResult'), false);
  assert.equal(source.includes('lot-of-basis') && source.includes('readyResult'), false);
  assert.equal(source.includes('lot-of-exaltation') && source.includes('readyResult'), false);
  assert.equal(source.includes('assignPlanetToHouse'), false);
  assert.equal(source.includes('interpretations: true'), false);
  assert.equal(source.includes('ритуал'), false);
  assert.equal(source.includes('карми'), false);
  assert.equal(existsSync(new URL('../src/houses.js', import.meta.url)), false);
  assert.equal(existsSync(new URL('../src/houseSystems.js', import.meta.url)), false);
});
