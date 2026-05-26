import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import {
  calculateParsFortuna,
  calculateParsFortunaForProfile,
  calculateParsFortunaFromLongitudes,
  getParsFortunaCapabilities,
  getParsFortunaFormula,
  getParsFortunaInputReadiness,
  getParsFortunaLimitations,
} from '../src/parsFortuna.js';
import { getParsFortunaFixture } from './fixtures/parsFortunaFixtures.js';

const READY_PROFILE = Object.freeze({
  id: 'pars-fortuna-profile',
  name: 'Synthetic Pars Fortuna',
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

function assertClose(actual, expected, tolerance = 1e-9) {
  assert.equal(Number.isFinite(actual), true);
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} should be within ${tolerance}° of ${expected}`);
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
  assert.equal(json.includes('"longitude":0'), false);
  assert.equal(json.includes('"providerPayload"'), false);
  assert.equal(json.includes('"fullProfileJson"'), false);
  assert.equal(json.includes('NaN'), false);
  assert.equal(json.includes('undefined'), false);
  assert.equal(json.includes('фаталь'), false);
  assert.equal(json.includes('карми'), false);
  assert.equal(json.includes('ритуал'), false);
}

test('getParsFortunaFormula returns verified day and night formulas only', () => {
  assert.deepEqual(getParsFortunaFormula('day'), {
    formulaVariant: 'day',
    formula: 'ASC + Moon - Sun',
    operands: ['asc', '+', 'moon', '-', 'sun'],
  });
  assert.deepEqual(getParsFortunaFormula('night'), {
    formulaVariant: 'night',
    formula: 'ASC + Sun - Moon',
    operands: ['asc', '+', 'sun', '-', 'moon'],
  });
  assert.equal(getParsFortunaFormula('boundary'), null);
  assert.equal(getParsFortunaFormula(null), null);
});

test('calculateParsFortunaFromLongitudes calculates day and night formulas from manual fixtures', () => {
  const dayFixture = getParsFortunaFixture('day-formula-simple');
  const nightFixture = getParsFortunaFixture('night-formula-simple');
  const day = calculateParsFortunaFromLongitudes(dayFixture.input);
  const night = calculateParsFortunaFromLongitudes(nightFixture.input);

  assert.equal(day.status, 'ready');
  assert.equal(day.ready, true);
  assert.equal(day.key, 'pars-fortuna');
  assert.equal(day.label, 'Парс Фортуны');
  assert.equal(day.labelEn, 'Lot of Fortune');
  assertClose(day.longitude, dayFixture.expected.longitude);
  assert.deepEqual(day.sign, dayFixture.expected.sign);
  assert.equal(day.degree, dayFixture.expected.degree);
  assert.equal(day.minutes, dayFixture.expected.minutes);
  assert.equal(day.seconds, dayFixture.expected.seconds);
  assert.equal(day.text, dayFixture.expected.text);
  assert.equal(day.formulaVariant, 'day');
  assert.equal(day.formula, 'ASC + Moon - Sun');
  assert.deepEqual(day.requiredInputs, ['asc', 'sun', 'moon', 'chartSect']);
  assert.equal(day.verificationStatus, 'verified');

  assert.equal(night.status, 'ready');
  assertClose(night.longitude, nightFixture.expected.longitude);
  assert.equal(night.text, nightFixture.expected.text);
  assert.equal(night.formulaVariant, 'night');
  assert.equal(night.formula, 'ASC + Sun - Moon');
  assertSafeOutput(day);
  assertSafeOutput(night);
});

test('calculateParsFortunaFromLongitudes normalizes wrap-around results', () => {
  const positive = getParsFortunaFixture('day-wrap-around-positive');
  const negative = getParsFortunaFixture('day-wrap-around-negative');
  const positiveResult = calculateParsFortuna(positive.input);
  const negativeResult = calculateParsFortuna(negative.input);

  assert.equal(positiveResult.status, 'ready');
  assertClose(positiveResult.longitude, positive.expected.longitude);
  assert.equal(positiveResult.text, positive.expected.text);
  assert.equal(negativeResult.status, 'ready');
  assertClose(negativeResult.longitude, negative.expected.longitude);
  assert.equal(negativeResult.text, negative.expected.text);
});

test('invalid formula inputs return safe notReady states without choosing a formula', () => {
  const missingAsc = calculateParsFortunaFromLongitudes(getParsFortunaFixture('invalid-missing-asc').input);
  const missingSun = calculateParsFortunaFromLongitudes(getParsFortunaFixture('invalid-missing-sun').input);
  const missingMoon = calculateParsFortunaFromLongitudes(getParsFortunaFixture('invalid-missing-moon').input);
  const boundary = calculateParsFortunaFromLongitudes(getParsFortunaFixture('invalid-boundary-chart-sect').input);
  const unknownSect = calculateParsFortunaFromLongitudes({
    ascLongitude: 10,
    sunLongitude: 100,
    moonLongitude: 150,
    chartSect: 'unknown',
  });

  assert.equal(missingAsc.status, 'notReady');
  assert.equal(missingAsc.reason, 'missingAscLongitude');
  assert.equal(missingSun.reason, 'missingSunLongitude');
  assert.equal(missingMoon.reason, 'missingMoonLongitude');
  assert.equal(boundary.reason, 'chartSectBoundary');
  assert.equal(unknownSect.reason, 'unknownChartSect');
  [missingAsc, missingSun, missingMoon, boundary, unknownSect].forEach(assertSafeOutput);
});

test('getParsFortunaInputReadiness reports missing fields safely', () => {
  const ready = getParsFortunaInputReadiness({
    ascLongitude: 10,
    sunLongitude: 100,
    moonLongitude: 150,
    chartSect: 'day',
  });
  const missing = getParsFortunaInputReadiness({
    ascLongitude: 10,
    chartSect: 'boundary',
  });

  assert.equal(ready.ready, true);
  assert.equal(ready.status, 'ready');
  assert.deepEqual(ready.missingInputs, []);
  assert.equal(missing.ready, false);
  assert.equal(missing.status, 'notReady');
  assert.equal(missing.reason, 'missingSunLongitude');
  assert.deepEqual(missing.missingInputs, ['sun', 'moon', 'chartSect']);
  assertSafeOutput(ready);
  assertSafeOutput(missing);
});

test('calculateParsFortunaForProfile fails closed for profile and input readiness problems', () => {
  const missingProfile = calculateParsFortunaForProfile(null);
  const unknownTime = calculateParsFortunaForProfile({
    ...READY_PROFILE,
    birthTime: '',
    birthTimeAccuracy: 'unknown',
  });
  const missingCoordinates = calculateParsFortunaForProfile({
    ...READY_PROFILE,
    birthPlace: {
      ...READY_PROFILE.birthPlace,
      coordinates: undefined,
      latitude: undefined,
      longitude: undefined,
    },
  });
  const missingPlanets = calculateParsFortunaForProfile(READY_PROFILE, {
    natalPlanetsResult: { status: 'incomplete', planets: [] },
  });

  assert.equal(missingProfile.status, 'notReady');
  assert.equal(missingProfile.reason, 'missingProfile');
  assert.equal(unknownTime.reason, 'missingExactBirthTime');
  assert.equal(missingCoordinates.reason, 'cityWithoutCoordinates');
  assert.equal(missingPlanets.reason, 'natalPlanetsNotReady');
  [missingProfile, unknownTime, missingCoordinates, missingPlanets].forEach(assertSafeOutput);
});

test('calculateParsFortunaForProfile returns ready from exact profile and safe natal planets path without mutation', () => {
  const profile = clone(READY_PROFILE);
  const result = calculateParsFortunaForProfile(profile);

  assert.equal(result.status, 'ready');
  assert.equal(result.ready, true);
  assert.equal(result.key, 'pars-fortuna');
  assert.equal(['day', 'night'].includes(result.chartSect), true);
  assert.equal(result.formulaVariant, result.chartSect);
  assert.equal(Number.isFinite(result.longitude), true);
  assert.match(result.text, /^Парс Фортуны — .+ \d{1,2}°\d{2}′\d{2}″$/);
  assert.deepEqual(profile, clone(READY_PROFILE));
  assertSafeOutput(result);
});

test('capabilities and limitations keep Pars Fortuna scoped without Arabic Parts or interpretations', () => {
  const capabilities = getParsFortunaCapabilities();
  const limitations = getParsFortunaLimitations();

  assert.equal(capabilities.parsFortuna, true);
  assert.equal(capabilities.lotOfFortune, true);
  assert.equal(capabilities.dayNightFormula, true);
  assert.equal(capabilities.arabicParts, false);
  assert.equal(capabilities.lotOfSpirit, false);
  assert.equal(capabilities.houseAssignment, false);
  assert.equal(capabilities.interpretations, false);
  assert.equal(capabilities.transits, false);
  assert.equal(capabilities.fixedStars, false);
  assert.equal(limitations.some((item) => item.includes('ASC, Солнце, Луне')), true);
  assert.equal(limitations.some((item) => item.includes('не рассчитывает остальные арабские части')), true);
  assert.equal(limitations.some((item) => item.includes('Интерпретации не добавлены')), true);
});

test('Pars Fortuna module keeps strict source boundaries', async () => {
  const source = await readFile(new URL('../src/parsFortuna.js', import.meta.url), 'utf8');
  const imports = source
    .split('\n')
    .filter((line) => line.trim().startsWith('import '));
  const result = calculateParsFortunaFromLongitudes({
    ascLongitude: 10,
    sunLongitude: 100,
    moonLongitude: 150,
    chartSect: 'day',
  });

  assertSafeOutput(result);
  assert.equal(imports.some((line) => line.includes('provider')), false);
  assert.equal(imports.some((line) => line.includes('localStorage')), false);
  assert.equal(imports.some((line) => line.includes('document')), false);
  assert.equal(imports.some((line) => line.includes('window')), false);
  assert.equal(imports.some((line) => line.includes('swisseph')), false);
  assert.equal(imports.some((line) => line.includes('astronomy-engine')), false);
  assert.equal(source.includes('document.'), false);
  assert.equal(source.includes('window.'), false);
  assert.equal(source.includes("from './arabicParts"), false);
  assert.equal(source.includes('arabicPartsData'), false);
  assert.equal(source.includes('calculateLotOfSpirit'), false);
  assert.equal(source.includes('lot-of-spirit'), false);
  assert.equal(source.includes('фаталь'), false);
  assert.equal(source.includes('карми'), false);
  assert.equal(source.includes('сильный дом'), false);
  assert.equal(existsSync(new URL('../src/houses.js', import.meta.url)), false);
  assert.equal(existsSync(new URL('../src/houseSystems.js', import.meta.url)), false);
  assert.equal(existsSync(new URL('../src/arabicParts.js', import.meta.url)), false);
});
