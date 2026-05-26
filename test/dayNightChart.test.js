import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import {
  calculateDayNightChartStatus,
  calculateDayNightChartStatusForProfile,
  calculateSunAltitudeFromLocalSidereal,
  classifyChartSectFromSunAltitude,
  getChartSectLabel,
  getDayNightChartCapabilities,
  getDayNightChartLimitations,
} from '../src/dayNightChart.js';
import { getDayNightChartFixture } from './fixtures/dayNightChartFixtures.js';

const READY_PROFILE = Object.freeze({
  id: 'day-night-profile',
  name: 'Synthetic Day Night',
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
  houseSystem: 'placidus',
  zodiac: 'tropical',
});

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function assertClose(actual, expected, tolerance = 0.001) {
  assert.equal(Number.isFinite(actual), true);
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} should be within ${tolerance}° of ${expected}`);
}

function assertSafeOutput(value) {
  const json = JSON.stringify(value);

  assert.equal(json.includes('2000-03-20'), false);
  assert.equal(json.includes('15:00'), false);
  assert.equal(json.includes('"birthDate"'), false);
  assert.equal(json.includes('"birthTime"'), false);
  assert.equal(json.includes('"birthPlace"'), false);
  assert.equal(json.includes('"utcDateTime"'), false);
  assert.equal(json.includes('"coordinates"'), false);
  assert.equal(json.includes('"latitude"'), false);
  assert.equal(json.includes('"providerPayload"'), false);
  assert.equal(json.includes('"fullProfileJson"'), false);
  assert.equal(json.includes('NaN'), false);
  assert.equal(json.includes('undefined'), false);
  assert.equal(json.includes('фаталь'), false);
  assert.equal(json.includes('карми'), false);
  assert.equal(json.includes('ритуал'), false);
}

test('calculateSunAltitudeFromLocalSidereal classifies synthetic day night and boundary geometry', () => {
  const dayFixture = getDayNightChartFixture('equator-lst-0-sun-aries');
  const nightFixture = getDayNightChartFixture('equator-lst-180-sun-aries');
  const boundaryFixture = getDayNightChartFixture('equator-lst-90-sun-aries');
  const day = calculateSunAltitudeFromLocalSidereal(dayFixture.input);
  const night = calculateSunAltitudeFromLocalSidereal(nightFixture.input);
  const boundary = calculateSunAltitudeFromLocalSidereal(boundaryFixture.input);

  assert.equal(day.status, 'ready');
  assert.equal(day.method, 'sun-altitude-geometric');
  assertClose(day.altitudeDegrees, dayFixture.expected.altitudeDegrees);
  assert.equal(day.altitudeDegrees > 0, true);
  assert.equal(night.status, 'ready');
  assertClose(night.altitudeDegrees, nightFixture.expected.altitudeDegrees);
  assert.equal(night.altitudeDegrees < 0, true);
  assert.equal(boundary.status, 'ready');
  assertClose(boundary.altitudeDegrees, boundaryFixture.expected.altitudeDegrees);
});

test('classifyChartSectFromSunAltitude returns day night boundary and invalid states', () => {
  const day = classifyChartSectFromSunAltitude(12);
  const night = classifyChartSectFromSunAltitude(-12);
  const boundary = classifyChartSectFromSunAltitude(0.005);
  const invalid = classifyChartSectFromSunAltitude(Number.NaN);

  assert.equal(day.status, 'ready');
  assert.equal(day.chartSect, 'day');
  assert.equal(day.dayChart, true);
  assert.equal(day.nightChart, false);
  assert.equal(day.boundary, false);
  assert.equal(night.status, 'ready');
  assert.equal(night.chartSect, 'night');
  assert.equal(night.dayChart, false);
  assert.equal(night.nightChart, true);
  assert.equal(boundary.status, 'boundary');
  assert.equal(boundary.chartSect, null);
  assert.equal(boundary.reason, 'sunOnHorizonBoundary');
  assert.equal(invalid.status, 'invalid');
  assert.equal(invalid.reason, 'invalidSunAltitude');
});

test('calculateDayNightChartStatus handles missing Sun UTC and coordinate inputs safely', () => {
  const missingSun = calculateDayNightChartStatus({
    utcDateTime: '2000-03-20T12:00:00.000Z',
    latitude: 0,
    longitude: 0,
  });
  const invalidUtc = calculateDayNightChartStatus({
    utcDateTime: 'bad-date',
    latitude: 0,
    longitude: 0,
    sunLongitude: 0,
  });
  const invalidCoordinates = calculateDayNightChartStatus({
    utcDateTime: '2000-03-20T12:00:00.000Z',
    latitude: 91,
    longitude: 0,
    sunLongitude: 0,
  });

  assert.equal(missingSun.status, 'notReady');
  assert.equal(missingSun.reason, 'missingSunLongitude');
  assert.equal(missingSun.ready, false);
  assert.equal(invalidUtc.status, 'invalid');
  assert.equal(invalidUtc.reason, 'invalidDateTime');
  assert.equal(invalidCoordinates.status, 'invalid');
  assert.equal(invalidCoordinates.reason, 'invalidCoordinates');
  assertSafeOutput(missingSun);
  assertSafeOutput(invalidUtc);
  assertSafeOutput(invalidCoordinates);
});

test('calculateDayNightChartStatus returns ready day and night from geometric Sun altitude', () => {
  const dayFixture = getDayNightChartFixture('greenwich-equinox-2000-day');
  const nightFixture = getDayNightChartFixture('greenwich-equinox-2000-night');
  const day = calculateDayNightChartStatus(dayFixture.input);
  const night = calculateDayNightChartStatus(nightFixture.input);

  assert.equal(day.status, 'ready');
  assert.equal(day.ready, true);
  assert.equal(day.chartSect, 'day');
  assert.equal(day.method, dayFixture.expected.method);
  assert.equal(day.sunAltitudeDegrees > dayFixture.expected.minimumAltitudeDegrees, true);
  assert.equal(day.calculation.coordinateConvention, 'east-positive-longitude');
  assert.equal(night.status, 'ready');
  assert.equal(night.ready, true);
  assert.equal(night.chartSect, 'night');
  assert.equal(night.method, nightFixture.expected.method);
  assert.equal(night.sunAltitudeDegrees < nightFixture.expected.maximumAltitudeDegrees, true);
  assertSafeOutput(day);
  assertSafeOutput(night);
});

test('calculateDayNightChartStatus reports boundary instead of guessing day or night', () => {
  const fixture = getDayNightChartFixture('equator-lst-90-sun-aries');
  const altitude = calculateSunAltitudeFromLocalSidereal(fixture.input);
  const result = classifyChartSectFromSunAltitude(altitude.altitudeDegrees);

  assert.equal(result.status, 'boundary');
  assert.equal(result.chartSect, null);
  assert.equal(result.dayChart, false);
  assert.equal(result.nightChart, false);
  assert.equal(result.boundary, true);
  assert.equal(result.reason, 'sunOnHorizonBoundary');
});

test('calculateDayNightChartStatusForProfile fails closed for missing profile time coordinates and Sun position', () => {
  const missingProfile = calculateDayNightChartStatusForProfile(null);
  const commonDay = calculateDayNightChartStatusForProfile({ kind: 'commonDay' });
  const unknownTime = calculateDayNightChartStatusForProfile({
    ...READY_PROFILE,
    birthTime: '',
    birthTimeAccuracy: 'unknown',
  });
  const missingCoordinates = calculateDayNightChartStatusForProfile({
    ...READY_PROFILE,
    birthPlace: {
      ...READY_PROFILE.birthPlace,
      coordinates: undefined,
      latitude: undefined,
      longitude: undefined,
    },
  });
  const sunUnavailable = calculateDayNightChartStatusForProfile(READY_PROFILE, {
    natalPlanetsResult: { status: 'incomplete', planets: [] },
  });

  assert.equal(missingProfile.status, 'notReady');
  assert.equal(missingProfile.reason, 'missingProfile');
  assert.equal(commonDay.reason, 'commonDay');
  assert.equal(unknownTime.reason, 'missingExactBirthTime');
  assert.equal(missingCoordinates.reason, 'cityWithoutCoordinates');
  assert.equal(sunUnavailable.reason, 'sunPositionNotReady');
  [missingProfile, commonDay, unknownTime, missingCoordinates, sunUnavailable].forEach(assertSafeOutput);
});

test('calculateDayNightChartStatusForProfile returns ready status from safe natal Sun path without mutating profile', () => {
  const profile = clone(READY_PROFILE);
  const result = calculateDayNightChartStatusForProfile(profile);

  assert.equal(result.status, 'ready');
  assert.equal(result.ready, true);
  assert.equal(['day', 'night'].includes(result.chartSect), true);
  assert.equal(result.source, 'profile-natal-sun');
  assert.equal(Number.isFinite(result.sunAltitudeDegrees), true);
  assert.deepEqual(profile, clone(READY_PROFILE));
  assertSafeOutput(result);
});

test('labels capabilities and limitations keep day/night scoped without lots or interpretations', () => {
  const capabilities = getDayNightChartCapabilities();
  const limitations = getDayNightChartLimitations();

  assert.equal(getChartSectLabel('day'), 'Дневная карта');
  assert.equal(getChartSectLabel('night'), 'Ночная карта');
  assert.equal(getChartSectLabel('boundary'), 'На границе дня и ночи');
  assert.equal(getChartSectLabel(null), 'Недоступно');
  assert.equal(capabilities.dayNightStatus, true);
  assert.equal(capabilities.sunAltitudeGeometry, true);
  assert.equal(capabilities.parsFortuna, false);
  assert.equal(capabilities.arabicParts, false);
  assert.equal(capabilities.interpretations, false);
  assert.equal(limitations.some((item) => item.includes('положению Солнца относительно горизонта')), true);
  assert.equal(limitations.some((item) => item.includes('не рассчитывает Pars Fortuna')), true);
});

test('day/night chart output and source keep strict exclusions', async () => {
  const source = await readFile(new URL('../src/dayNightChart.js', import.meta.url), 'utf8');
  const imports = source
    .split('\n')
    .filter((line) => line.trim().startsWith('import '));
  const result = calculateDayNightChartStatus({
    utcDateTime: '2000-03-20T12:00:00.000Z',
    latitude: 0,
    longitude: 0,
    sunLongitude: 0,
  });

  assertSafeOutput(result);
  assert.equal(imports.some((line) => line.includes('provider')), false);
  assert.equal(imports.some((line) => line.includes('astronomy-engine')), false);
  assert.equal(imports.some((line) => line.includes('swisseph')), false);
  assert.equal(imports.some((line) => line.includes('localStorage')), false);
  assert.equal(source.includes('document.'), false);
  assert.equal(source.includes('window.'), false);
  assert.equal(source.includes('calculateParsFortuna'), false);
  assert.equal(source.includes("from './parsFortuna"), false);
  assert.equal(source.includes("from './arabicParts"), false);
  assert.equal(source.includes('arabicPartsData'), false);
  assert.equal(source.includes('фаталь'), false);
  assert.equal(source.includes('карми'), false);
  assert.equal(existsSync(new URL('../src/houses.js', import.meta.url)), false);
  assert.equal(existsSync(new URL('../src/houseSystems.js', import.meta.url)), false);
  assert.equal(existsSync(new URL('../src/parsFortuna.js', import.meta.url)), false);
  assert.equal(existsSync(new URL('../src/arabicParts.js', import.meta.url)), false);
  assert.equal(existsSync(new URL('../src/arabicPartsData.js', import.meta.url)), false);
});
