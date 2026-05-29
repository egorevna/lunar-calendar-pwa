import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import test from 'node:test';

import {
  calculateSelena,
  calculateSelenaForProfile,
  calculateSelenaLongitude,
  formatSelena,
  getSelenaCapabilities,
  getSelenaLimitations,
  getSelenaSource,
} from '../src/selena.js';
import { SELENA_FIXTURES, getSelenaFixture } from './fixtures/selenaFixtures.js';

const cwd = process.cwd();
const MODULE_PATH = join(cwd, 'src/selena.js');

const EXACT_PROFILE_WITHOUT_COORDINATES = Object.freeze({
  id: 'synthetic-profile-selena',
  name: 'Synthetic Selena Profile',
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
  assert.equal(serialized.includes('ангел'), false);
}

test('calculateSelenaLongitude returns normalized longitude for valid UTC', () => {
  const result = calculateSelenaLongitude({ utcDateTime: '2000-01-01T12:00:00.000Z' });

  assert.equal(result.status, 'ready');
  assert.equal(result.ready, true);
  assert.equal(result.longitude >= 0 && result.longitude < 360, true);
  assert.equal(result.sourceSystem, 'selena-white-moon');
  assert.equal(result.sourceKey, 'swiss-ephemeris-seorbel-white-moon');
  assert.equal(result.method, 'swisseph-seorbel-white-moon-linear-elements');
});

test('calculateSelenaLongitude accepts Date input', () => {
  const result = calculateSelenaLongitude({ date: new Date('2000-01-01T12:00:00.000Z') });

  assert.equal(result.status, 'ready');
  assert.equal(result.ready, true);
  assert.equal(result.sourceSystem, 'selena-white-moon');
});

test('calculateSelenaLongitude returns safe fallback for missing or invalid date', () => {
  const missing = calculateSelenaLongitude({});
  const invalid = calculateSelenaLongitude({ utcDateTime: 'not-a-date' });

  assert.equal(missing.status, 'notReady');
  assert.equal(missing.ready, false);
  assert.equal(missing.reason, 'missingUtcDateTime');
  assert.equal(invalid.status, 'notReady');
  assert.equal(invalid.ready, false);
  assert.equal(invalid.reason, 'invalidUtcDateTime');
  assertSafeOutput(missing);
  assertSafeOutput(invalid);
});

test('benchmark fixtures match Selena longitude within tolerance', () => {
  const benchmarks = SELENA_FIXTURES.filter((fixture) => fixture.categories.includes('benchmark'));

  assert.equal(benchmarks.length >= 5, true);

  for (const fixture of benchmarks) {
    const result = calculateSelenaLongitude(fixture.input);

    assert.equal(result.status, 'ready', fixture.id);
    assertClose(result.longitude, fixture.expected.longitude, fixture.expected.toleranceDegrees, fixture.id);
  }
});

test('wrap-around benchmark normalizes near Aries', () => {
  const fixture = getSelenaFixture('selena-1981-wrap-aries');
  const result = calculateSelena(fixture.input);

  assert.equal(result.status, 'ready');
  assertClose(result.selena.longitude, fixture.expected.longitude, fixture.expected.toleranceDegrees, 'wrap longitude');
  assert.equal(result.selena.sign.key, 'pisces');
});

test('calculateSelena returns ready Selena result with source metadata', () => {
  const result = calculateSelena({ utcDateTime: '2000-01-01T12:00:00.000Z' });

  assert.equal(result.status, 'ready');
  assert.equal(result.ready, true);
  assert.equal(result.sourceSystem, 'selena-white-moon');
  assert.equal(result.sourceKey, 'swiss-ephemeris-seorbel-white-moon');
  assert.equal(result.method, 'swisseph-seorbel-white-moon-linear-elements');
  assert.equal(result.pointType, 'fictitious-calculated-point');
  assert.equal(result.verificationStatus, 'verified');
  assert.equal(result.selena.key, 'selena');
  assert.equal(result.selena.label, 'Селена');
  assert.equal(result.selena.labelVariant, 'Белая Луна');
  assert.equal(result.selena.labelEn, 'Selena');
  assert.equal(result.selena.variantEn, 'White Moon');
  assert.equal(result.selena.sourceSystem, 'selena-white-moon');
  assert.equal(result.selena.pointType, 'fictitious-calculated-point');
  assertSafeOutput(result);
});

test('formatSelena returns sign degree minute second text', () => {
  const selena = formatSelena(123.456789, {
    sourceSystem: 'selena-white-moon',
    sourceKey: 'swiss-ephemeris-seorbel-white-moon',
  });

  assert.equal(selena.key, 'selena');
  assert.equal(selena.label, 'Селена');
  assert.equal(selena.labelVariant, 'Белая Луна');
  assert.equal(selena.sign.key, 'leo');
  assert.equal(selena.sign.ru, 'Лев');
  assert.equal(Number.isInteger(selena.degree), true);
  assert.equal(Number.isInteger(selena.minutes), true);
  assert.equal(Number.isInteger(selena.seconds), true);
  assert.match(selena.text, /^Селена \/ Белая Луна — Лев \d{2}°\d{2}′\d{2}″$/);
});

test('source, capabilities and limitations preserve Sprint 13 boundaries', () => {
  const source = getSelenaSource();
  const capabilities = getSelenaCapabilities();
  const limitations = getSelenaLimitations();

  assert.equal(source.sourceSystem, 'selena-white-moon');
  assert.equal(source.sourceKey, 'swiss-ephemeris-seorbel-white-moon');
  assert.equal(source.method, 'swisseph-seorbel-white-moon-linear-elements');
  assert.equal(source.pointType, 'fictitious-calculated-point');
  assert.equal(source.validation, 'static-swisseph-SE_WHITE_MOON-fixtures');
  assert.deepEqual(source.alternateSourceSystems, []);
  assert.equal(capabilities.selena, true);
  assert.equal(capabilities.whiteMoon, true);
  assert.equal(capabilities.fictitiousCalculatedPoint, true);
  assert.equal(capabilities.lunarNodes, false);
  assert.equal(capabilities.lilith, false);
  assert.equal(capabilities.houseAssignment, false);
  assert.equal(capabilities.interpretations, false);
  assert.equal(capabilities.transits, false);
  assert.equal(capabilities.fixedStars, false);
  assert.equal(limitations.some((item) => item.includes('Selena / White Moon')), true);
  assert.equal(limitations.some((item) => item.includes('фиктивная / гипотетическая')), true);
  assert.equal(limitations.some((item) => item.includes('Lunar Nodes')), true);
  assert.equal(limitations.some((item) => item.includes('Lilith')), true);
});

test('calculateSelenaForProfile returns safe fallback for missing profile', () => {
  const result = calculateSelenaForProfile(null);

  assert.equal(result.status, 'notReady');
  assert.equal(result.ready, false);
  assert.equal(result.reason, 'missingProfile');
  assertSafeOutput(result);
});

test('calculateSelenaForProfile returns notReady for unknown birth time', () => {
  const profile = {
    ...EXACT_PROFILE_WITHOUT_COORDINATES,
    birthTime: '',
    birthTimeAccuracy: 'unknown',
  };
  const result = calculateSelenaForProfile(profile);

  assert.equal(result.status, 'notReady');
  assert.equal(result.ready, false);
  assert.equal(result.reason, 'missingExactBirthTime');
  assertSafeOutput(result);
});

test('calculateSelenaForProfile returns notReady for missing timezone', () => {
  const profile = {
    ...EXACT_PROFILE_WITHOUT_COORDINATES,
    birthPlace: {
      ...EXACT_PROFILE_WITHOUT_COORDINATES.birthPlace,
      timezone: '',
    },
  };
  const result = calculateSelenaForProfile(profile);

  assert.equal(result.status, 'notReady');
  assert.equal(result.ready, false);
  assert.equal(result.reason, 'missingTimezone');
  assertSafeOutput(result);
});

test('calculateSelenaForProfile is ready for exact birth time and timezone without coordinates', () => {
  const profile = structuredClone(EXACT_PROFILE_WITHOUT_COORDINATES);
  const before = JSON.stringify(profile);
  const result = calculateSelenaForProfile(profile);

  assert.equal(result.status, 'ready');
  assert.equal(result.ready, true);
  assert.equal(result.selena.key, 'selena');
  assert.equal(JSON.stringify(profile), before);
  assertSafeOutput(result);
});

test('selena module does not import forbidden runtime dependencies or calculate excluded points', async () => {
  const source = await readFile(MODULE_PATH, 'utf8');

  assert.equal(/from ['"]swisseph['"]/.test(source), false);
  assert.equal(/require\(['"]swisseph['"]\)/.test(source), false);
  assert.equal(source.includes('swe_calc_ut'), false);
  assert.equal(source.includes('astronomy-engine'), false);
  assert.equal(source.includes('planetaryProvider'), false);
  assert.equal(source.includes('natalPlanetsForProfile'), false);
  assert.equal(source.includes('localStorage'), false);
  assert.equal(source.includes('document.'), false);
  assert.equal(source.includes('window.'), false);
  assert.equal(source.includes('calculateLunarNodes'), false);
  assert.equal(source.includes('calculateLilith'), false);
  assert.equal(source.includes('calculateFixedStars'), false);
  assert.equal(source.includes('interpretSelena'), false);
});

test('forbidden generic house files are not created', () => {
  assert.equal(existsSync(join(cwd, 'src/houses.js')), false);
  assert.equal(existsSync(join(cwd, 'src/houseSystems.js')), false);
});
