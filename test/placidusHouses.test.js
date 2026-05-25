import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import test from 'node:test';

import {
  calculatePlacidusHouses,
  calculatePlacidusHousesForProfile,
  calculatePlacidusHousesFromAscMc,
  getPlacidusCalculationLimitations,
  getPlacidusEngineCapabilities,
  getPlacidusUnsupportedResult,
  getPlacidusValidationStatus,
  isPlacidusHouseSystemValue,
  normalizePlacidusHouseSystemValue,
} from '../src/placidusHouses.js';

const readyAscMcResult = Object.freeze({
  status: 'ready',
  ready: true,
  angles: Object.freeze({
    asc: Object.freeze({
      key: 'asc',
      label: 'ASC',
      longitude: 14.5,
      sign: Object.freeze({ key: 'aries', ru: 'Овен', symbol: '♈' }),
      degree: 14,
      minutes: 30,
      text: 'Овен 14°30′',
    }),
    mc: Object.freeze({
      key: 'mc',
      label: 'MC',
      longitude: 270,
      sign: Object.freeze({ key: 'capricorn', ru: 'Козерог', symbol: '♑' }),
      degree: 0,
      minutes: 0,
      text: 'Козерог 0°00′',
    }),
  }),
});

const placidusProfile = Object.freeze({
  id: 'profile-placidus-ready',
  name: 'Анна',
  birthDate: '1990-01-01',
  birthTime: '12:00',
  birthTimeAccuracy: 'exact',
  birthPlace: Object.freeze({
    city: 'Москва',
    country: 'Россия',
    latitude: 55.7558,
    longitude: 37.6173,
    timezone: 'Europe/Moscow',
  }),
  currentPlace: Object.freeze({
    mode: 'moscow',
    city: 'Москва',
    country: 'Россия',
    latitude: null,
    longitude: null,
    timezone: 'Europe/Moscow',
  }),
  houseSystem: 'placidus',
  zodiac: 'tropical',
});

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function assertEmptyHouseOutput(result) {
  assert.deepEqual(result.houses, []);
  assert.deepEqual(result.cusps, []);
  assert.equal(result.ready, false);
}

function assertSafeProfileOutput(value) {
  const json = JSON.stringify(value);

  assert.equal(json.includes('1990-01-01'), false);
  assert.equal(json.includes('12:00'), false);
  assert.equal(json.includes('Europe/Moscow'), false);
  assert.equal(json.includes('55.7558'), false);
  assert.equal(json.includes('37.6173'), false);
  assert.equal(json.includes('"birthDate"'), false);
  assert.equal(json.includes('"birthTime"'), false);
  assert.equal(json.includes('"birthPlace"'), false);
  assert.equal(json.includes('"profile-placidus-ready"'), false);
  assert.equal(json.includes('NaN'), false);
  assert.equal(json.includes('undefined'), false);
}

test('Placidus value helpers recognize only Placidus and normalize other current profile aliases', () => {
  assert.equal(isPlacidusHouseSystemValue('placidus'), true);
  assert.equal(isPlacidusHouseSystemValue('Placidus'), true);
  assert.equal(isPlacidusHouseSystemValue('wholeSign'), false);
  assert.equal(isPlacidusHouseSystemValue('whole-sign'), false);
  assert.equal(isPlacidusHouseSystemValue('equal'), false);
  assert.equal(isPlacidusHouseSystemValue('equal-house'), false);
  assert.equal(isPlacidusHouseSystemValue('equalHouse'), false);
  assert.equal(isPlacidusHouseSystemValue('unknown'), false);

  assert.equal(normalizePlacidusHouseSystemValue('placidus'), 'placidus');
  assert.equal(normalizePlacidusHouseSystemValue('Placidus'), 'placidus');
  assert.equal(normalizePlacidusHouseSystemValue('wholeSign'), 'whole-sign');
  assert.equal(normalizePlacidusHouseSystemValue('whole-sign'), 'whole-sign');
  assert.equal(normalizePlacidusHouseSystemValue('equal'), 'equal-house');
  assert.equal(normalizePlacidusHouseSystemValue('equal-house'), 'equal-house');
  assert.equal(normalizePlacidusHouseSystemValue('equalHouse'), 'equal-house');
  assert.equal(normalizePlacidusHouseSystemValue(null), null);
});

test('validation status records Placidus as not validated without benchmark fixtures', () => {
  const status = getPlacidusValidationStatus();

  assert.equal(status.validated, false);
  assert.equal(status.implementationReady, false);
  assert.equal(status.benchmarkFixtures, false);
  assert.equal(status.reason, 'missingBenchmarkFixtures');
  assert.equal(typeof status.dependencyPath, 'string');
  assert.equal(status.dependencyPath.includes('swe_houses'), true);
});

test('calculatePlacidusHouses returns unsupported without fake cusps or fallback houses', () => {
  const result = calculatePlacidusHouses(readyAscMcResult);

  assert.equal(result.status, 'unsupported');
  assert.equal(result.reason, 'placidusNotValidated');
  assert.equal(result.houseSystem, 'placidus');
  assertEmptyHouseOutput(result);
  assert.equal(result.validation.validated, false);
  assert.equal(result.validation.benchmarkFixtures, false);
  assert.equal(result.angles, null);
  assert.equal(result.message.includes('benchmark fixtures'), true);

  const serialized = JSON.stringify(result);
  assert.equal(serialized.includes('14.5'), false);
  assert.equal(serialized.includes('44.5'), false);
  assert.equal(serialized.includes('1 дом — Овен'), false);
});

test('calculatePlacidusHousesFromAscMc returns unsupported while Placidus is not validated', () => {
  const ready = calculatePlacidusHousesFromAscMc(readyAscMcResult);
  const missing = calculatePlacidusHousesFromAscMc(null);

  assert.equal(ready.status, 'unsupported');
  assert.equal(ready.reason, 'placidusNotValidated');
  assertEmptyHouseOutput(ready);
  assert.equal(missing.status, 'unsupported');
  assert.equal(missing.reason, 'placidusNotValidated');
  assertEmptyHouseOutput(missing);
});

test('calculatePlacidusHousesForProfile rejects non-Placidus and missing house system selections', () => {
  const wholeSign = calculatePlacidusHousesForProfile({
    ...clone(placidusProfile),
    houseSystem: 'wholeSign',
  });
  const equal = calculatePlacidusHousesForProfile({
    ...clone(placidusProfile),
    houseSystem: 'equal',
  });
  const missing = clone(placidusProfile);
  delete missing.houseSystem;
  const missingSelection = calculatePlacidusHousesForProfile(missing);

  assert.equal(wholeSign.status, 'unsupported');
  assert.equal(wholeSign.reason, 'selectedHouseSystemNotPlacidus');
  assert.equal(wholeSign.selectedHouseSystem, 'whole-sign');
  assert.equal(equal.status, 'unsupported');
  assert.equal(equal.reason, 'selectedHouseSystemNotPlacidus');
  assert.equal(equal.selectedHouseSystem, 'equal-house');
  assert.equal(missingSelection.status, 'unsupported');
  assert.equal(missingSelection.reason, 'selectedHouseSystemNotPlacidus');
  assert.equal(missingSelection.selectedHouseSystem, null);
  [wholeSign, equal, missingSelection].forEach(assertSafeProfileOutput);
});

test('calculatePlacidusHousesForProfile respects input guardrails for selected Placidus', () => {
  const unknownTime = calculatePlacidusHousesForProfile({
    ...clone(placidusProfile),
    birthTime: '',
    birthTimeAccuracy: 'unknown',
  });
  const missingCoordinates = calculatePlacidusHousesForProfile({
    ...clone(placidusProfile),
    birthPlace: {
      ...clone(placidusProfile).birthPlace,
      latitude: null,
      longitude: null,
    },
  });

  assert.equal(unknownTime.status, 'notReady');
  assert.equal(unknownTime.reason, 'missingExactBirthTime');
  assert.equal(missingCoordinates.status, 'notReady');
  assert.equal(missingCoordinates.reason, 'cityWithoutCoordinates');
  [unknownTime, missingCoordinates].forEach((result) => {
    assertEmptyHouseOutput(result);
    assertSafeProfileOutput(result);
  });
});

test('calculatePlacidusHousesForProfile returns unsupported for valid selected Placidus until validated', () => {
  const profile = clone(placidusProfile);
  const before = clone(profile);
  const result = calculatePlacidusHousesForProfile(profile);

  assert.equal(result.status, 'unsupported');
  assert.equal(result.reason, 'placidusNotValidated');
  assert.equal(result.houseSystem, 'placidus');
  assert.equal(result.validation.validated, false);
  assert.equal(result.validation.benchmarkFixtures, false);
  assertEmptyHouseOutput(result);
  assertSafeProfileOutput(result);
  assert.deepEqual(profile, before);
});

test('capabilities and limitations keep Placidus recognized but not calculation-ready', () => {
  const capabilities = getPlacidusEngineCapabilities();
  const limitations = getPlacidusCalculationLimitations();

  assert.deepEqual(capabilities, {
    houses: false,
    placidus: true,
    placidusRecognized: true,
    placidusValidated: false,
    placidusReady: false,
    wholeSign: false,
    equalHouse: false,
    quadrantCusps: false,
    exactCusps: false,
    ascMcRequired: true,
    planetInHouse: false,
    interpretations: false,
    transits: false,
    fixedStars: false,
  });
  assert.equal(limitations.some((item) => item.includes('не подменяется равнодомной системой')), true);
  assert.equal(limitations.some((item) => item.includes('не подменяется Whole Sign')), true);
  assert.equal(limitations.some((item) => item.includes('high-latitude')), true);
  assert.equal(limitations.some((item) => item.includes('не распределяет планеты')), true);
});

test('unsupported result helper returns safe empty Placidus output', () => {
  const result = getPlacidusUnsupportedResult('placidusUnsupportedAtLatitude');

  assert.equal(result.status, 'unsupported');
  assert.equal(result.reason, 'placidusUnsupportedAtLatitude');
  assert.equal(result.houseSystem, 'placidus');
  assertEmptyHouseOutput(result);
  assert.equal(result.validation.validated, false);
});

test('Placidus output avoids private data NaN undefined fake systems and fatalistic text', () => {
  const outputs = [
    getPlacidusValidationStatus(),
    getPlacidusEngineCapabilities(),
    getPlacidusCalculationLimitations(),
    calculatePlacidusHouses(readyAscMcResult),
    calculatePlacidusHousesFromAscMc(readyAscMcResult),
    calculatePlacidusHousesForProfile(clone(placidusProfile)),
  ];
  const json = JSON.stringify(outputs);

  assert.equal(json.includes('NaN'), false);
  assert.equal(json.includes('undefined'), false);
  assert.equal(json.includes('1990-01-01'), false);
  assert.equal(json.includes('12:00'), false);
  assert.equal(json.includes('55.7558'), false);
  assert.equal(json.includes('37.6173'), false);
  assert.equal(json.includes('"birthPlace"'), false);
  assert.equal(json.includes('"birthDate"'), false);
  assert.equal(json.includes('"birthTime"'), false);
  assert.equal(json.includes('"whole-sign","houses"'), false);
  assert.equal(json.includes('"equal-house","cusps"'), false);
  assert.equal(/фаталь|карми|плохой|плохая|плохое/i.test(json), false);
});

test('module stays scoped to Placidus gate without providers DOM storage fallbacks or planet assignment', async () => {
  const source = await readFile(new URL('../src/placidusHouses.js', import.meta.url), 'utf8');

  assert.equal(source.includes("from 'swisseph'"), false);
  assert.equal(source.includes('require("swisseph")'), false);
  assert.equal(source.includes('astronomy-engine'), false);
  assert.equal(source.includes('astronomyEngineProvider'), false);
  assert.equal(source.includes('planetaryPositionProvider'), false);
  assert.equal(source.includes('profileStorage'), false);
  assert.equal(source.includes('localStorage'), false);
  assert.equal(source.includes('document.'), false);
  assert.equal(source.includes('window.'), false);
  assert.equal(source.includes("from './houses.js'"), false);
  assert.equal(source.includes("from './houseSystems.js'"), false);
  assert.equal(source.includes("from './wholeSignHouses.js'"), false);
  assert.equal(source.includes("from './equalHouseHouses.js'"), false);
  assert.equal(source.includes('calculateWholeSignHouses'), false);
  assert.equal(source.includes('calculateEqualHouse'), false);
  assert.equal(source.includes('assignPlanet'), false);
  assert.equal(source.includes('planetInHouse: true'), false);
  assert.equal(source.includes('quadrantCusps: true'), false);
});

test('generic houses router files are not created by Task 11.4d', () => {
  assert.equal(existsSync(new URL('../src/houses.js', import.meta.url)), false);
  assert.equal(existsSync(new URL('../src/houseSystems.js', import.meta.url)), false);
});
