import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import {
  calculateAscMc,
  calculateAscMcForProfile,
  calculateAscMcFromLocalSidereal,
  deriveOppositeAngle,
  formatAscMcAngle,
  getAscMcCalculationLimitations,
  getAscMcEngineCapabilities,
  isValidAscMcCoordinateInput,
} from '../src/ascMc.js';

const EPSILON = 0.01;

const readyProfile = Object.freeze({
  id: 'profile-asc-ready',
  name: 'Анна',
  birthDate: '1990-01-01',
  birthTime: '12:00',
  birthTimeAccuracy: 'exact',
  birthPlace: {
    city: 'Москва',
    country: 'Россия',
    latitude: 55.7558,
    longitude: 37.6173,
    timezone: 'Europe/Moscow',
  },
  currentPlace: {
    mode: 'moscow',
    city: 'Москва',
    country: 'Россия',
    latitude: null,
    longitude: null,
    timezone: 'Europe/Moscow',
  },
  houseSystem: 'wholeSign',
  zodiac: 'tropical',
});

function closeTo(actual, expected, tolerance = EPSILON) {
  const delta = Math.abs(actual - expected);
  const wrappedDelta = Math.min(delta, 360 - delta);

  assert.equal(wrappedDelta <= tolerance, true, `${actual} should be within ${tolerance}° of ${expected}`);
}

function assertNoPrivateProfileData(value) {
  const json = JSON.stringify(value);

  assert.equal(json.includes('1990-01-01'), false);
  assert.equal(json.includes('12:00'), false);
  assert.equal(json.includes('Europe/Moscow'), false);
  assert.equal(json.includes('55.7558'), false);
  assert.equal(json.includes('37.6173'), false);
  assert.equal(json.includes('"birthPlace"'), false);
  assert.equal(json.includes('"birthDate"'), false);
  assert.equal(json.includes('"birthTime"'), false);
  assert.equal(json.includes('NaN'), false);
  assert.equal(json.includes('undefined'), false);
}

test('calculateAscMcFromLocalSidereal handles equator LST 0 synthetic geometry', () => {
  const result = calculateAscMcFromLocalSidereal({
    localSiderealDegrees: 0,
    latitude: 0,
    obliquityDegrees: 23.439,
  });

  assert.equal(result.status, 'ready');
  assert.equal(result.method, 'local-sidereal-vector-geometry');
  closeTo(result.mc.longitude, 0);
  closeTo(result.asc.longitude, 90);
  closeTo(result.ic.longitude, 180);
  closeTo(result.dsc.longitude, 270);
  assert.equal(result.mc.sign.key, 'aries');
  assert.equal(result.asc.sign.key, 'cancer');
  assert.equal(result.ic.sign.key, 'libra');
  assert.equal(result.dsc.sign.key, 'capricorn');
});

test('calculateAscMcFromLocalSidereal handles equator LST 90 synthetic geometry', () => {
  const result = calculateAscMcFromLocalSidereal({
    localSiderealDegrees: 90,
    latitude: 0,
    obliquityDegrees: 23.439,
  });

  assert.equal(result.status, 'ready');
  closeTo(result.mc.longitude, 90);
  closeTo(result.asc.longitude, 180);
  closeTo(result.ic.longitude, 270);
  closeTo(result.dsc.longitude, 0);
  assert.equal(result.mc.sign.key, 'cancer');
  assert.equal(result.asc.sign.key, 'libra');
  assert.equal(result.ic.sign.key, 'capricorn');
  assert.equal(result.dsc.sign.key, 'aries');
});

test('deriveOppositeAngle derives DSC and IC by adding 180 degrees', () => {
  const dsc = deriveOppositeAngle(formatAscMcAngle(95.25, 'asc'), 'dsc');
  const ic = deriveOppositeAngle(359.5, 'ic');

  closeTo(dsc.longitude, 275.25);
  closeTo(ic.longitude, 179.5);
  assert.equal(dsc.key, 'dsc');
  assert.equal(ic.key, 'ic');
});

test('formatAscMcAngle handles 359.999 degree wrap safely', () => {
  const angle = formatAscMcAngle(359.999, 'asc');

  assert.equal(angle.key, 'asc');
  assert.equal(angle.sign.key, 'pisces');
  assert.equal(angle.degree, 29);
  assert.equal(angle.minutes, 59);
  assert.equal(angle.text, 'Рыбы 29°59′');
});

test('calculateAscMc rejects missing invalid date and coordinate input safely', () => {
  assert.equal(calculateAscMc({ latitude: 0, longitude: 0 }).status, 'invalid');
  assert.equal(calculateAscMc({ utcDateTime: 'not-a-date', latitude: 0, longitude: 0 }).reason, 'invalidDateTime');
  assert.equal(calculateAscMc({ date: new Date('bad'), latitude: 0, longitude: 0 }).reason, 'invalidDateTime');
  assert.equal(calculateAscMc({ utcDateTime: '1990-01-01T12:00:00.000Z', latitude: NaN, longitude: 0 }).reason, 'invalidCoordinates');
  assert.equal(calculateAscMc({ utcDateTime: '1990-01-01T12:00:00.000Z', latitude: 91, longitude: 0 }).reason, 'invalidCoordinates');
  assert.equal(calculateAscMc({ utcDateTime: '1990-01-01T12:00:00.000Z', latitude: 0, longitude: 181 }).reason, 'invalidCoordinates');
  assert.equal(isValidAscMcCoordinateInput({ latitude: 55.7558, longitude: 37.6173 }), true);
  assert.equal(isValidAscMcCoordinateInput({ latitude: -91, longitude: 0 }), false);
});

test('calculateAscMc reports explicit invalid reasons for date and coordinate guardrails', () => {
  const missingDate = calculateAscMc({ latitude: 0, longitude: 0 });
  const offsetDate = calculateAscMc({ utcDateTime: '1990-01-01T12:00:00.000+03:00', latitude: 0, longitude: 0 });
  const nonFiniteLatitude = calculateAscMc({ utcDateTime: '1990-01-01T12:00:00.000Z', latitude: Infinity, longitude: 0 });
  const nonFiniteLongitude = calculateAscMc({ utcDateTime: '1990-01-01T12:00:00.000Z', latitude: 0, longitude: -Infinity });
  const lowLatitude = calculateAscMc({ utcDateTime: '1990-01-01T12:00:00.000Z', latitude: -90.1, longitude: 0 });
  const highLatitude = calculateAscMc({ utcDateTime: '1990-01-01T12:00:00.000Z', latitude: 90.1, longitude: 0 });
  const lowLongitude = calculateAscMc({ utcDateTime: '1990-01-01T12:00:00.000Z', latitude: 0, longitude: -180.1 });
  const highLongitude = calculateAscMc({ utcDateTime: '1990-01-01T12:00:00.000Z', latitude: 0, longitude: 180.1 });

  assert.equal(missingDate.status, 'invalid');
  assert.equal(missingDate.reason, 'missingUtcDateTime');
  assert.equal(offsetDate.reason, 'invalidDateTime');
  assert.equal(nonFiniteLatitude.reason, 'invalidCoordinates');
  assert.equal(nonFiniteLongitude.reason, 'invalidCoordinates');
  assert.equal(lowLatitude.reason, 'invalidCoordinates');
  assert.equal(highLatitude.reason, 'invalidCoordinates');
  assert.equal(lowLongitude.reason, 'invalidCoordinates');
  assert.equal(highLongitude.reason, 'invalidCoordinates');
});

test('calculateAscMc returns ready ASC MC DSC IC from normalized UTC input', () => {
  const result = calculateAscMc({
    utcDateTime: '1990-01-01T12:00:00.000Z',
    latitude: 55.7558,
    longitude: 37.6173,
  });

  assert.equal(result.status, 'ready');
  assert.equal(result.ready, true);
  assert.equal(result.houseSystem, 'whole-sign');
  assert.equal(result.calculation.coordinateConvention, 'east-positive-longitude');
  ['asc', 'mc', 'dsc', 'ic'].forEach((key) => {
    assert.equal(result.angles[key].key, key);
    assert.equal(Number.isFinite(result.angles[key].longitude), true);
    assert.equal(typeof result.angles[key].text, 'string');
    assert.notEqual(result.angles[key].text, '');
  });
  assert.equal(result.capabilities.houses, false);
  assert.equal(result.capabilities.houseCusps, false);
  assert.equal(result.capabilities.planetInHouse, false);
});

test('calculateAscMcForProfile fails closed for missing profile time and coordinates', () => {
  const missingProfile = calculateAscMcForProfile(null);
  const unknownTime = calculateAscMcForProfile({
    ...readyProfile,
    birthTime: '',
    birthTimeAccuracy: 'unknown',
  });
  const missingCoordinates = calculateAscMcForProfile({
    ...readyProfile,
    birthPlace: {
      ...readyProfile.birthPlace,
      latitude: null,
      longitude: null,
    },
  });

  assert.equal(missingProfile.status, 'notReady');
  assert.equal(missingProfile.reason, 'missingProfile');
  assert.equal(unknownTime.reason, 'missingExactBirthTime');
  assert.equal(missingCoordinates.reason, 'cityWithoutCoordinates');
  assert.equal(missingCoordinates.angles, null);
});

test('calculateAscMcForProfile notReady outputs stay safe for missing profile time and coordinates', () => {
  const outputs = [
    calculateAscMcForProfile(null),
    calculateAscMcForProfile({
      ...readyProfile,
      birthTime: '',
      birthTimeAccuracy: 'unknown',
    }),
    calculateAscMcForProfile({
      ...readyProfile,
      birthPlace: {
        ...readyProfile.birthPlace,
        latitude: null,
        longitude: null,
      },
    }),
  ];

  assert.deepEqual(outputs.map((item) => item.reason), [
    'missingProfile',
    'missingExactBirthTime',
    'cityWithoutCoordinates',
  ]);
  outputs.forEach((item) => {
    assert.equal(item.status, 'notReady');
    assert.equal(item.ready, false);
    assert.equal(item.houseSystem, 'whole-sign');
    assert.equal(item.angles, null);
    assertNoPrivateProfileData(item);
  });
});

test('calculateAscMcForProfile returns ready result for exact time and valid coordinates', () => {
  const profile = JSON.parse(JSON.stringify(readyProfile));
  const result = calculateAscMcForProfile(profile);

  assert.equal(result.status, 'ready');
  assert.equal(result.ready, true);
  assert.equal(result.reason, null);
  assert.equal(result.houseSystem, 'whole-sign');
  assert.equal(Object.keys(result.angles).sort().join(','), 'asc,dsc,ic,mc');
  assert.deepEqual(profile, JSON.parse(JSON.stringify(readyProfile)));
  assertNoPrivateProfileData(result);
});

test('calculateAscMcForProfile supports nested coordinate shape without exposing raw coordinates', () => {
  const profile = {
    ...readyProfile,
    birthPlace: {
      ...readyProfile.birthPlace,
      latitude: null,
      longitude: null,
      coordinates: {
        latitude: 55.7558,
        longitude: 37.6173,
      },
    },
  };
  const result = calculateAscMcForProfile(profile);
  const json = JSON.stringify(result);

  assert.equal(result.status, 'ready');
  assert.equal(result.ready, true);
  assert.equal(Object.keys(result.angles).sort().join(','), 'asc,dsc,ic,mc');
  assertNoPrivateProfileData(result);
  assert.equal(json.includes('"coordinates"'), false);
  assert.equal(json.includes('"latitude"'), false);
});

test('public helpers expose limitations and capabilities without houses or interpretations', () => {
  const limitations = getAscMcCalculationLimitations();
  const capabilities = getAscMcEngineCapabilities();

  assert.equal(limitations.some((item) => item.includes('точном времени рождения')), true);
  assert.equal(limitations.some((item) => item.includes('Расчет домов не выполняется')), true);
  assert.deepEqual(capabilities, {
    asc: true,
    mc: true,
    dsc: true,
    ic: true,
    houses: false,
    houseCusps: false,
    planetInHouse: false,
    wholeSignPolicy: true,
    placidus: false,
    interpretations: false,
    transits: false,
    fixedStars: false,
  });
});

test('ASC MC output contains no NaN undefined or fatalistic text', () => {
  const outputs = [
    calculateAscMcFromLocalSidereal({ localSiderealDegrees: 0, latitude: 0, obliquityDegrees: 23.439 }),
    calculateAscMc({ utcDateTime: '1990-01-01T12:00:00.000Z', latitude: 55.7558, longitude: 37.6173 }),
    calculateAscMcForProfile(readyProfile),
    getAscMcCalculationLimitations(),
    getAscMcEngineCapabilities(),
  ];
  const json = JSON.stringify(outputs);

  assert.equal(json.includes('NaN'), false);
  assert.equal(json.includes('undefined'), false);
  assert.equal(/фаталь|карми|плохой|плохая|плохое/i.test(json), false);
});

test('module stays scoped to ASC MC angles without provider DOM storage or house calculations', async () => {
  const source = await readFile(new URL('../src/ascMc.js', import.meta.url), 'utf8');

  assert.equal(source.includes('astronomyEngineProvider'), false);
  assert.equal(source.includes('planetaryPositionProvider'), false);
  assert.equal(source.includes('natalPlanetsForProfile'), false);
  assert.equal(source.includes('profileStorage'), false);
  assert.equal(source.includes('localStorage'), false);
  assert.equal(source.includes('document.'), false);
  assert.equal(source.includes('window.'), false);
  assert.equal(source.includes("from './houses.js'"), false);
  assert.equal(source.includes('calculateHouses'), false);
  assert.equal(source.includes('assignPlanet'), false);
  assert.equal(source.includes('houseCusps: true'), false);
  assert.equal(source.includes('planetInHouse: true'), false);
});
