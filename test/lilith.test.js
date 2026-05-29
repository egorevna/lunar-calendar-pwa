import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import test from 'node:test';

import {
  calculateLilith,
  calculateLilithForProfile,
  calculateMeanLilithLongitude,
  formatLilith,
  getLilithCapabilities,
  getLilithLimitations,
  getLilithSource,
} from '../src/lilith.js';
import { LILITH_FIXTURES, getLilithFixture } from './fixtures/lilithFixtures.js';

const cwd = process.cwd();
const MODULE_PATH = join(cwd, 'src/lilith.js');

const EXACT_PROFILE_WITHOUT_COORDINATES = Object.freeze({
  id: 'synthetic-profile-lilith',
  name: 'Synthetic Lilith Profile',
  birthDate: '2000-01-01',
  birthTime: '12:00',
  birthTimeAccuracy: 'exact',
  birthPlace: Object.freeze({
    city: 'Greenwich',
    country: 'United Kingdom',
    timezone: 'UTC',
  }),
  currentPlace: Object.freeze({
    mode: 'moscow',
    city: 'Москва',
    country: 'Россия',
    latitude: null,
    longitude: null,
    timezone: 'Europe/Moscow',
  }),
  houseSystem: 'wholeSign',
  zodiac: 'tropical',
});

function angularDifference(a, b) {
  const difference = Math.abs(a - b);

  return Math.min(difference, 360 - difference);
}

function assertClose(actual, expected, tolerance, message) {
  assert.equal(Number.isFinite(actual), true, `${message}: actual is not finite`);
  assert.equal(angularDifference(actual, expected) <= tolerance, true, `${message}: ${actual} vs ${expected}`);
}

function assertSafeOutput(value) {
  const serialized = JSON.stringify(value);

  assert.equal(serialized.includes('birthDate'), false);
  assert.equal(serialized.includes('birthTime'), false);
  assert.equal(serialized.includes('utcDateTime'), false);
  assert.equal(serialized.includes('birthPlace'), false);
  assert.equal(serialized.includes('coordinates'), false);
  assert.equal(serialized.includes('latitude'), false);
  assert.equal(serialized.includes('fullProfile'), false);
  assert.equal(serialized.includes('providerPayload'), false);
  assert.equal(serialized.includes('NaN'), false);
  assert.equal(serialized.includes('undefined'), false);
  assert.equal(serialized.includes('фаталь'), false);
  assert.equal(serialized.includes('карми'), false);
  assert.equal(serialized.includes('ритуал'), false);
}

test('calculateMeanLilithLongitude returns normalized longitude for valid UTC', () => {
  const result = calculateMeanLilithLongitude({ utcDateTime: '2000-01-01T12:00:00.000Z' });

  assert.equal(result.status, 'ready');
  assert.equal(result.ready, true);
  assert.equal(result.longitude >= 0 && result.longitude < 360, true);
  assert.equal(result.sourceSystem, 'mean-black-moon-lilith');
  assert.equal(result.sourceKey, 'mean-lunar-apogee');
});

test('calculateMeanLilithLongitude accepts Date input', () => {
  const result = calculateMeanLilithLongitude({ date: new Date('2000-01-01T12:00:00.000Z') });

  assert.equal(result.status, 'ready');
  assert.equal(result.ready, true);
  assert.equal(result.sourceSystem, 'mean-black-moon-lilith');
});

test('calculateMeanLilithLongitude returns safe fallback for missing or invalid date', () => {
  const missing = calculateMeanLilithLongitude({});
  const invalid = calculateMeanLilithLongitude({ utcDateTime: 'not-a-date' });

  assert.equal(missing.status, 'notReady');
  assert.equal(missing.ready, false);
  assert.equal(missing.reason, 'missingUtcDateTime');
  assert.equal(invalid.status, 'notReady');
  assert.equal(invalid.ready, false);
  assert.equal(invalid.reason, 'invalidUtcDateTime');
  assertSafeOutput(missing);
  assertSafeOutput(invalid);
});

test('benchmark fixtures match Mean Lilith longitude within tolerance', () => {
  const benchmarks = LILITH_FIXTURES.filter((fixture) => fixture.categories.includes('benchmark'));

  assert.equal(benchmarks.length >= 5, true);

  for (const fixture of benchmarks) {
    const result = calculateMeanLilithLongitude(fixture.input);

    assert.equal(result.status, 'ready', fixture.id);
    assertClose(result.longitude, fixture.expected.longitude, fixture.expected.toleranceDegrees, fixture.id);
  }
});

test('wrap-around benchmark normalizes near Aries', () => {
  const fixture = getLilithFixture('mean-lilith-1940-wrap-aries');
  const result = calculateLilith(fixture.input);

  assert.equal(result.status, 'ready');
  assertClose(result.lilith.longitude, fixture.expected.longitude, fixture.expected.toleranceDegrees, 'wrap longitude');
  assert.equal(result.lilith.sign.key, 'pisces');
});

test('calculateLilith returns ready Mean Lilith result with source metadata', () => {
  const result = calculateLilith({ utcDateTime: '2000-01-01T12:00:00.000Z' });

  assert.equal(result.status, 'ready');
  assert.equal(result.ready, true);
  assert.equal(result.sourceSystem, 'mean-black-moon-lilith');
  assert.equal(result.sourceKey, 'mean-lunar-apogee');
  assert.equal(result.variant, 'mean');
  assert.equal(result.verificationStatus, 'verified');
  assert.equal(result.lilith.key, 'lilith');
  assert.equal(result.lilith.label, 'Лилит');
  assert.equal(result.lilith.labelVariant, 'Средняя Лилит');
  assert.equal(result.lilith.labelEn, 'Black Moon Lilith');
  assert.equal(result.lilith.variantEn, 'Mean Lunar Apogee');
  assert.equal(result.lilith.sourceSystem, 'mean-black-moon-lilith');
  assert.equal(result.deferredVariants.includes('true-lilith'), true);
  assert.equal(result.deferredVariants.includes('osculating-black-moon-lilith'), true);
  assert.equal(result.deferredVariants.includes('interpolated-lilith'), true);
  assertSafeOutput(result);
});

test('formatLilith returns sign degree minute second text', () => {
  const lilith = formatLilith(123.456789, {
    sourceSystem: 'mean-black-moon-lilith',
    sourceKey: 'mean-lunar-apogee',
  });

  assert.equal(lilith.key, 'lilith');
  assert.equal(lilith.label, 'Лилит');
  assert.equal(lilith.labelVariant, 'Средняя Лилит');
  assert.equal(lilith.sign.key, 'leo');
  assert.equal(lilith.sign.ru, 'Лев');
  assert.equal(Number.isInteger(lilith.degree), true);
  assert.equal(Number.isInteger(lilith.minutes), true);
  assert.equal(Number.isInteger(lilith.seconds), true);
  assert.match(lilith.text, /^Лилит \/ Средняя Лилит — Лев \d{2}°\d{2}′\d{2}″$/);
});

test('source, capabilities and limitations preserve Sprint 13 boundaries', () => {
  const source = getLilithSource();
  const capabilities = getLilithCapabilities();
  const limitations = getLilithLimitations();

  assert.equal(source.sourceSystem, 'mean-black-moon-lilith');
  assert.equal(source.sourceKey, 'mean-lunar-apogee');
  assert.equal(source.variant, 'mean');
  assert.equal(source.validation, 'static-swisseph-SE_MEAN_APOG-fixtures');
  assert.equal(source.deferredVariants.includes('true-lilith'), true);
  assert.equal(source.deferredVariants.includes('osculating-black-moon-lilith'), true);
  assert.equal(source.deferredVariants.includes('interpolated-lilith'), true);
  assert.equal(capabilities.lilith, true);
  assert.equal(capabilities.meanLilith, true);
  assert.equal(capabilities.trueLilith, false);
  assert.equal(capabilities.osculatingLilith, false);
  assert.equal(capabilities.interpolatedLilith, false);
  assert.equal(capabilities.selena, false);
  assert.equal(capabilities.lunarNodes, false);
  assert.equal(capabilities.houseAssignment, false);
  assert.equal(capabilities.interpretations, false);
  assert.equal(capabilities.transits, false);
  assert.equal(capabilities.fixedStars, false);
  assert.equal(limitations.some((item) => item.includes('Средняя Лилит')), true);
  assert.equal(limitations.some((item) => item.includes('True/Osculating Lilith')), true);
  assert.equal(limitations.some((item) => item.includes('Selena')), true);
});

test('calculateLilithForProfile returns safe fallback for missing profile', () => {
  const result = calculateLilithForProfile(null);

  assert.equal(result.status, 'notReady');
  assert.equal(result.ready, false);
  assert.equal(result.reason, 'missingProfile');
  assertSafeOutput(result);
});

test('calculateLilithForProfile returns notReady for unknown birth time', () => {
  const profile = {
    ...EXACT_PROFILE_WITHOUT_COORDINATES,
    birthTime: '',
    birthTimeAccuracy: 'unknown',
  };
  const result = calculateLilithForProfile(profile);

  assert.equal(result.status, 'notReady');
  assert.equal(result.ready, false);
  assert.equal(result.reason, 'missingExactBirthTime');
  assertSafeOutput(result);
});

test('calculateLilithForProfile returns notReady for missing timezone', () => {
  const profile = {
    ...EXACT_PROFILE_WITHOUT_COORDINATES,
    birthPlace: {
      ...EXACT_PROFILE_WITHOUT_COORDINATES.birthPlace,
      timezone: '',
    },
  };
  const result = calculateLilithForProfile(profile);

  assert.equal(result.status, 'notReady');
  assert.equal(result.ready, false);
  assert.equal(result.reason, 'missingTimezone');
  assertSafeOutput(result);
});

test('calculateLilithForProfile is ready for exact birth time and timezone without coordinates', () => {
  const profile = structuredClone(EXACT_PROFILE_WITHOUT_COORDINATES);
  const before = JSON.stringify(profile);
  const result = calculateLilithForProfile(profile);

  assert.equal(result.status, 'ready');
  assert.equal(result.ready, true);
  assert.equal(result.lilith.key, 'lilith');
  assert.equal(JSON.stringify(profile), before);
  assertSafeOutput(result);
});

test('lilith module does not import forbidden runtime dependencies or calculate excluded points', async () => {
  const source = await readFile(MODULE_PATH, 'utf8');

  assert.equal(/from ['"]swisseph['"]/.test(source), false);
  assert.equal(/require\(['"]swisseph['"]\)/.test(source), false);
  assert.equal(source.includes('swe_calc_ut'), false);
  assert.equal(source.includes('SE_OSCU_APOG'), false);
  assert.equal(source.includes('SE_INTP_APOG'), false);
  assert.equal(source.includes('astronomy-engine'), false);
  assert.equal(source.includes('planetaryProvider'), false);
  assert.equal(source.includes('natalPlanetsForProfile'), false);
  assert.equal(source.includes('localStorage'), false);
  assert.equal(source.includes('document.'), false);
  assert.equal(source.includes('window.'), false);
  assert.equal(source.includes('calculateTrue'), false);
  assert.equal(source.includes('calculateOsculating'), false);
  assert.equal(source.includes('calculateInterpolated'), false);
  assert.equal(source.includes('calculateSelena'), false);
  assert.equal(source.includes('interpretLilith'), false);
});

test('forbidden generic house files are not created', () => {
  assert.equal(existsSync(join(cwd, 'src/houses.js')), false);
  assert.equal(existsSync(join(cwd, 'src/houseSystems.js')), false);
});
