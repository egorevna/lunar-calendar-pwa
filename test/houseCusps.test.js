import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { getAngularDistance, normalizeDegrees } from '../src/astroMath.js';
import { calculateEqualHouseHouses } from '../src/equalHouseHouses.js';
import { calculateHousesForSelectedSystem } from '../src/houseSystemResolver.js';
import {
  getCanonicalHouseCusps,
  getCanonicalHouseCuspsForProfile,
  getHouseCuspByNumber,
  getHouseCuspSummary,
  getHouseCuspsCapabilities,
  getHouseCuspsLimitations,
  normalizeHouseCusp,
  validateHouseCuspSequence,
} from '../src/houseCusps.js';
import { calculatePlacidusHouses } from '../src/placidusHouses.js';
import { calculateWholeSignHouses } from '../src/wholeSignHouses.js';
import { getHouseCuspsFixture } from './fixtures/houseCuspsFixtures.js';

const AQUARIUS_ASC = Object.freeze({
  key: 'asc',
  label: 'ASC',
  longitude: 314.791633,
  sign: Object.freeze({ key: 'aquarius', ru: 'Водолей', symbol: '♒' }),
  degree: 14,
  minutes: 47,
  seconds: 29,
  text: 'Водолей 14°47′29″',
});

const PROFILE_BASE = Object.freeze({
  id: 'house-cusps-profile',
  name: 'Synthetic House Cusps',
  birthDate: '1981-04-16',
  birthTime: '04:45',
  birthTimeAccuracy: 'exact',
  birthTimezone: 'Europe/Moscow',
  birthPlace: Object.freeze({
    city: 'Москва',
    country: 'Россия',
    coordinates: Object.freeze({
      latitude: 55.7577,
      longitude: 37.5410,
    }),
    timezone: 'Europe/Moscow',
  }),
  currentPlace: Object.freeze({
    mode: 'moscow',
    city: 'Москва',
    country: 'Россия',
    timezone: 'Europe/Moscow',
  }),
  zodiac: 'tropical',
});

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function makeProfile(houseSystem, overrides = {}) {
  const profile = clone(PROFILE_BASE);

  return {
    ...profile,
    ...overrides,
    houseSystem,
    birthPlace: overrides.birthPlace === null
      ? null
      : {
        ...profile.birthPlace,
        ...(overrides.birthPlace ?? {}),
      },
  };
}

function assertAngleClose(actual, expected, tolerance = 0.001) {
  const distance = getAngularDistance(actual, expected);

  assert.notEqual(distance, null);
  assert.ok(distance <= tolerance, `${actual} should be within ${tolerance}° of ${expected}`);
}

function assertLongitudes(result, expectedLongitudes, tolerance = 1e-9) {
  assert.equal(result.cusps.length, expectedLongitudes.length);
  result.cusps.forEach((cusp, index) => {
    assertAngleClose(cusp.longitude, expectedLongitudes[index], tolerance);
  });
}

function assertSafeOutput(value) {
  const json = JSON.stringify(value);

  assert.equal(json.includes('1981-04-16'), false);
  assert.equal(json.includes('04:45'), false);
  assert.equal(json.includes('Europe/Moscow'), false);
  assert.equal(json.includes('55.7577'), false);
  assert.equal(json.includes('37.541'), false);
  assert.equal(json.includes('"birthDate"'), false);
  assert.equal(json.includes('"birthTime"'), false);
  assert.equal(json.includes('"birthPlace"'), false);
  assert.equal(json.includes('"utcDateTime"'), false);
  assert.equal(json.includes('"coordinates"'), false);
  assert.equal(json.includes('"house-cusps-profile"'), false);
  assert.equal(json.includes('NaN'), false);
  assert.equal(json.includes('undefined'), false);
  assert.equal(json.includes('фаталь'), false);
  assert.equal(json.includes('карми'), false);
}

test('Whole Sign canonical cusps use ASC sign boundaries without claiming exact cusps', () => {
  const fixture = getHouseCuspsFixture('whole-sign-asc-aquarius-boundaries');
  const houseResult = calculateWholeSignHouses(AQUARIUS_ASC);
  const result = getCanonicalHouseCusps(houseResult);

  assert.equal(result.status, 'ready');
  assert.equal(result.ready, true);
  assert.equal(result.houseSystem, 'whole-sign');
  assert.equal(result.houseSystemLabel, 'Whole Sign');
  assert.equal(result.cuspType, 'sign-boundary');
  assert.equal(result.exactCuspDegrees, false);
  assert.equal(result.benchmarkValidated, false);
  assert.equal(result.cusps.length, 12);
  assert.deepEqual(result.cusps.map((cusp) => cusp.sign.key), fixture.expected.cuspSigns);
  assert.deepEqual(result.cusps.map((cusp) => cusp.longitude), fixture.expected.cuspLongitudes);
  assert.equal(result.cusps[0].text, '1 дом — Водолей 0°00′00″');
  assert.equal(result.cusps[11].text, '12 дом — Козерог 0°00′00″');
  assert.equal(result.cusps[0].longitude === AQUARIUS_ASC.longitude, false);
  assert.equal(result.houseSystemLabel.includes('Placidus'), false);
  assert.equal(result.houseSystemLabel.includes('Равнодом'), false);
});

test('Equal House canonical cusps use existing exact ASC plus 30-degree sequence', () => {
  const fixture = getHouseCuspsFixture('equal-house-asc-aquarius-14-47-29');
  const houseResult = calculateEqualHouseHouses(AQUARIUS_ASC);
  const result = getCanonicalHouseCusps(houseResult);

  assert.equal(result.status, 'ready');
  assert.equal(result.houseSystem, 'equal-house');
  assert.equal(result.houseSystemLabel, 'Равнодомная');
  assert.equal(result.cuspType, 'equal-30-degree');
  assert.equal(result.exactCuspDegrees, true);
  assert.equal(result.benchmarkValidated, false);
  assertLongitudes(result, fixture.expected.cuspLongitudes);
  assert.deepEqual(result.cusps.map((cusp) => cusp.sign.key), fixture.expected.cuspSigns);
  assert.equal(result.cusps[0].text, '1 дом — Водолей 14°47′29″');
  assert.equal(result.cusps[2].text, '3 дом — Овен 14°47′29″');
  assert.equal(result.houseSystemLabel.includes('Placidus'), false);
});

test('Placidus canonical cusps match static Swiss benchmark values and angle invariants', () => {
  const fixture = getHouseCuspsFixture('placidus-moscow-1981-swiss-exact');
  const houseResult = calculatePlacidusHouses(fixture.input);
  const result = getCanonicalHouseCusps(houseResult);

  assert.equal(result.status, 'ready');
  assert.equal(result.houseSystem, 'placidus');
  assert.equal(result.houseSystemLabel, 'Placidus');
  assert.equal(result.cuspType, 'quadrant-placidus');
  assert.equal(result.exactCuspDegrees, true);
  assert.equal(result.benchmarkValidated, true);
  assertLongitudes(result, fixture.expected.cuspLongitudes, fixture.expected.toleranceDegrees);
  assert.deepEqual(result.cusps.map((cusp) => cusp.text), fixture.expected.cusps.map((cusp) => cusp.text));
  assert.equal(result.cusps[0].text, '1 дом — Водолей 14°47′29″');
  assert.equal(result.cusps[4].text, '5 дом — Близнецы 29°42′33″');
  assert.equal(result.cusps[5].text, '6 дом — Рак 16°36′56″');
  assert.equal(result.cusps[10].text, '11 дом — Стрелец 29°42′33″');
  assert.equal(result.cusps[11].text, '12 дом — Козерог 16°36′56″');
  assert.equal(result.cusps[0].longitude, houseResult.angles.asc.longitude);
  assert.equal(result.cusps[9].longitude, houseResult.angles.mc.longitude);
  assert.equal(result.cusps[6].longitude, houseResult.angles.dsc.longitude);
  assert.equal(result.cusps[3].longitude, houseResult.angles.ic.longitude);
});

test('router-shaped selected result unwraps without mixing or recalculating systems', () => {
  const routerResult = calculateHousesForSelectedSystem(makeProfile('placidus'));
  const result = getCanonicalHouseCusps(routerResult);

  assert.equal(routerResult.result.houseSystem, 'placidus');
  assert.equal(result.status, 'ready');
  assert.equal(result.houseSystem, 'placidus');
  assert.equal(result.source, 'selected-house-system-result');
  assert.equal(result.cusps[0].longitude, routerResult.result.cusps[0].longitude);
  assert.equal(result.cusps[9].longitude, routerResult.result.cusps[9].longitude);
  assert.equal(result.cuspType, 'quadrant-placidus');
});

test('profile helper returns canonical cusps for selected Whole Sign, Equal House and Placidus', () => {
  const wholeSign = getCanonicalHouseCuspsForProfile(makeProfile('wholeSign'));
  const equalHouse = getCanonicalHouseCuspsForProfile(makeProfile('equal'));
  const placidus = getCanonicalHouseCuspsForProfile(makeProfile('placidus'));

  assert.equal(wholeSign.status, 'ready');
  assert.equal(wholeSign.houseSystem, 'whole-sign');
  assert.equal(wholeSign.cuspType, 'sign-boundary');
  assert.equal(wholeSign.cusps.length, 12);
  assert.equal(equalHouse.status, 'ready');
  assert.equal(equalHouse.houseSystem, 'equal-house');
  assert.equal(equalHouse.cuspType, 'equal-30-degree');
  assert.equal(equalHouse.cusps.length, 12);
  assert.equal(placidus.status, 'ready');
  assert.equal(placidus.houseSystem, 'placidus');
  assert.equal(placidus.cuspType, 'quadrant-placidus');
  assert.equal(placidus.cusps.length, 12);
  assertSafeOutput(placidus);
});

test('unknown house system and missing coordinates return safe unavailable results without fake cusps', () => {
  const unknown = getCanonicalHouseCuspsForProfile(makeProfile('campanus'));
  const missingCoordinates = getCanonicalHouseCuspsForProfile(makeProfile('placidus', {
    birthPlace: {
      coordinates: undefined,
      latitude: undefined,
      longitude: undefined,
    },
  }));

  assert.equal(unknown.status, 'unsupported');
  assert.equal(unknown.reason, 'unknownHouseSystem');
  assert.deepEqual(unknown.cusps, []);
  assert.equal(missingCoordinates.status, 'notReady');
  assert.equal(missingCoordinates.reason, 'cityWithoutCoordinates');
  assert.deepEqual(missingCoordinates.cusps, []);
  assertSafeOutput(unknown);
  assertSafeOutput(missingCoordinates);
});

test('normalizeHouseCusp and getHouseCuspByNumber return canonical cusp objects safely', () => {
  const equalHouse = calculateEqualHouseHouses(AQUARIUS_ASC);
  const equalCusp = normalizeHouseCusp(equalHouse.houses[0], 'equal-house');
  const wholeSign = calculateWholeSignHouses(AQUARIUS_ASC);
  const wholeSignCusp = normalizeHouseCusp(wholeSign.houses[0], 'whole-sign');

  assert.equal(equalCusp.number, 1);
  assert.equal(equalCusp.longitude, normalizeDegrees(AQUARIUS_ASC.longitude));
  assert.equal(equalCusp.text, '1 дом — Водолей 14°47′29″');
  assert.equal(wholeSignCusp.number, 1);
  assert.equal(wholeSignCusp.longitude, 300);
  assert.equal(wholeSignCusp.text, '1 дом — Водолей 0°00′00″');
  assert.equal(normalizeHouseCusp(null, 'placidus'), null);
  assert.equal(getHouseCuspByNumber(equalHouse.cusps, 1)?.number, 1);
  assert.equal(getHouseCuspByNumber(equalHouse.cusps, 13), null);
});

test('validateHouseCuspSequence accepts valid sequences and rejects invalid numbering', () => {
  const equalResult = getCanonicalHouseCusps(calculateEqualHouseHouses(AQUARIUS_ASC));
  const wholeResult = getCanonicalHouseCusps(calculateWholeSignHouses(AQUARIUS_ASC));
  const placidusResult = getCanonicalHouseCusps(calculatePlacidusHouses(getHouseCuspsFixture('placidus-moscow-1981-swiss-exact').input));
  const duplicateNumbers = equalResult.cusps.map((cusp, index) => ({
    ...cusp,
    number: index === 1 ? 1 : cusp.number,
  }));

  assert.deepEqual(validateHouseCuspSequence(equalResult.cusps, 'equal-house'), {
    status: 'ready',
    valid: true,
    count: 12,
    reasons: [],
  });
  assert.equal(validateHouseCuspSequence(wholeResult.cusps, 'whole-sign').valid, true);
  assert.equal(validateHouseCuspSequence(placidusResult.cusps, 'placidus').valid, true);
  assert.equal(validateHouseCuspSequence(duplicateNumbers, 'equal-house').status, 'invalid');
  assert.equal(validateHouseCuspSequence(duplicateNumbers, 'equal-house').valid, false);
  assert.equal(validateHouseCuspSequence(equalResult.cusps.slice(0, 11), 'equal-house').valid, false);
});

test('summary, capabilities and limitations describe canonical cusp layer only', () => {
  const result = getCanonicalHouseCusps(calculatePlacidusHouses(getHouseCuspsFixture('placidus-moscow-1981-swiss-exact').input));
  const summary = getHouseCuspSummary(result);
  const capabilities = getHouseCuspsCapabilities();
  const limitations = getHouseCuspsLimitations().join(' ');

  assert.deepEqual(summary, {
    status: 'ready',
    houseSystem: 'placidus',
    count: 12,
    cuspType: 'quadrant-placidus',
    exactCuspDegrees: true,
    text: '12 куспидов домов рассчитаны',
  });
  assert.equal(capabilities.houseCusps, true);
  assert.equal(capabilities.wholeSign, true);
  assert.equal(capabilities.equalHouse, true);
  assert.equal(capabilities.placidus, true);
  assert.equal(capabilities.parsFortuna, false);
  assert.equal(capabilities.arabicParts, false);
  assert.equal(capabilities.interpretations, false);
  assert.match(limitations, /Whole Sign использует границы знаков/);
  assert.match(limitations, /не рассчитывает Pars Fortuna/);
});

test('house cusp module keeps strict source boundaries', async () => {
  const source = await readFile(new URL('../src/houseCusps.js', import.meta.url), 'utf8');
  const imports = source
    .split('\n')
    .filter((line) => line.trim().startsWith('import '));

  assert.equal(imports.some((line) => line.includes('provider')), false);
  assert.equal(imports.some((line) => line.includes('localStorage')), false);
  assert.equal(imports.some((line) => line.includes('swisseph')), false);
  assert.equal(imports.some((line) => line.includes('astronomy-engine')), false);
  assert.equal(source.includes('document.'), false);
  assert.equal(source.includes('window.'), false);
  assert.equal(source.includes('calculateParsFortuna'), false);
  assert.equal(source.includes("from './parsFortuna"), false);
  assert.equal(source.includes("from './arabicParts"), false);
  assert.equal(source.includes('arabicPartsData'), false);
  assert.equal(source.includes('ритуал'), false);
  assert.equal(source.includes('карми'), false);
  assert.equal(existsSync(new URL('../src/houses.js', import.meta.url)), false);
  assert.equal(existsSync(new URL('../src/houseSystems.js', import.meta.url)), false);
});
