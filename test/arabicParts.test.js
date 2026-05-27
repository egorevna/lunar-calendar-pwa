import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import {
  calculateArabicPartFromFormula,
  calculateArabicPartsForProfile,
  calculateArabicPartsFromLongitudes,
  getArabicPartFormulaForSect,
  getArabicPartsEngineCapabilities,
  getArabicPartsEngineLimitations,
  getArabicPartsInputReadiness,
  getArabicPartsSummary,
} from '../src/arabicParts.js';
import {
  getActiveArabicPartsFormulas,
  getArabicPartFormulaByKey,
} from '../src/arabicPartsData.js';
import { calculateParsFortunaFromLongitudes } from '../src/parsFortuna.js';
import { getArabicPartsFixture } from './fixtures/arabicPartsFixtures.js';

const READY_PROFILE = Object.freeze({
  id: 'arabic-parts-profile',
  name: 'Synthetic Arabic Parts',
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

const INJECTED_READY_OPTIONS = Object.freeze({
  ascMcResult: Object.freeze({
    status: 'ready',
    angles: Object.freeze({
      asc: Object.freeze({ longitude: 10 }),
    }),
  }),
  natalPlanetsResult: Object.freeze({
    status: 'ready',
    planets: Object.freeze([
      Object.freeze({ key: 'sun', longitude: 100 }),
      Object.freeze({ key: 'moon', longitude: 150 }),
    ]),
  }),
  dayNightChartStatus: Object.freeze({
    status: 'ready',
    ready: true,
    chartSect: 'day',
  }),
});

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function assertClose(actual, expected, tolerance = 1e-9) {
  assert.equal(Number.isFinite(actual), true);
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} should be within ${tolerance}° of ${expected}`);
}

function partByKey(result, key) {
  return result.parts.find((part) => part.key === key);
}

function assertSafeOutput(value) {
  const json = JSON.stringify(value);

  assert.equal(json.includes('2000-03-20'), false);
  assert.equal(json.includes('15:00'), false);
  assert.equal(json.includes('"birthDate"'), false);
  assert.equal(json.includes('"birthTime"'), false);
  assert.equal(json.includes('"birthPlace"'), false);
  assert.equal(json.includes('"utcDateTime"'), false);
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

test('getArabicPartFormulaForSect returns formulas only for active verified rows', () => {
  const parsFortuna = getArabicPartFormulaByKey('pars-fortuna');
  const lotOfSpirit = getArabicPartFormulaByKey('lot-of-spirit');
  const lotOfEros = getArabicPartFormulaByKey('lot-of-eros');

  assert.deepEqual(getArabicPartFormulaForSect(parsFortuna, 'day'), {
    expression: 'ASC + Moon - Sun',
    operands: ['asc', '+', 'moon', '-', 'sun'],
  });
  assert.deepEqual(getArabicPartFormulaForSect(parsFortuna, 'night'), {
    expression: 'ASC + Sun - Moon',
    operands: ['asc', '+', 'sun', '-', 'moon'],
  });
  assert.deepEqual(getArabicPartFormulaForSect(lotOfSpirit, 'day'), {
    expression: 'ASC + Sun - Moon',
    operands: ['asc', '+', 'sun', '-', 'moon'],
  });
  assert.equal(getArabicPartFormulaForSect(lotOfSpirit, 'boundary'), null);
  assert.equal(getArabicPartFormulaForSect(lotOfEros, 'day'), null);
  assert.equal(getArabicPartFormulaForSect(null, 'day'), null);
});

test('calculateArabicPartFromFormula calculates Pars Fortuna day and night formulas', () => {
  const row = getArabicPartFormulaByKey('pars-fortuna');
  const dayFixture = getArabicPartsFixture('day-formula-simple');
  const nightFixture = getArabicPartsFixture('night-formula-simple');
  const day = calculateArabicPartFromFormula({ formulaRow: row, ...dayFixture.input });
  const night = calculateArabicPartFromFormula({ formulaRow: row, ...nightFixture.input });
  const dayExpected = dayFixture.expected.parts['pars-fortuna'];
  const nightExpected = nightFixture.expected.parts['pars-fortuna'];

  assert.equal(day.status, 'ready');
  assert.equal(day.ready, true);
  assert.equal(day.key, 'pars-fortuna');
  assert.equal(day.label, 'Парс Фортуны');
  assert.equal(day.labelEn, 'Lot of Fortune');
  assertClose(day.longitude, dayExpected.longitude);
  assert.deepEqual(day.sign, dayExpected.sign);
  assert.equal(day.degree, dayExpected.degree);
  assert.equal(day.minutes, dayExpected.minutes);
  assert.equal(day.seconds, dayExpected.seconds);
  assert.equal(day.text, dayExpected.text);
  assert.equal(day.formulaVariant, 'day');
  assert.equal(day.formula, dayExpected.formula);
  assert.deepEqual(day.requiredInputs, ['asc', 'sun', 'moon', 'chartSect']);
  assert.equal(day.verificationStatus, 'verified');

  assert.equal(night.status, 'ready');
  assertClose(night.longitude, nightExpected.longitude);
  assert.equal(night.text, nightExpected.text);
  assert.equal(night.formulaVariant, 'night');
  assert.equal(night.formula, nightExpected.formula);
  assertSafeOutput(day);
  assertSafeOutput(night);
});

test('calculateArabicPartFromFormula calculates Lot of Spirit day and night formulas', () => {
  const row = getArabicPartFormulaByKey('lot-of-spirit');
  const dayFixture = getArabicPartsFixture('day-formula-simple');
  const nightFixture = getArabicPartsFixture('night-formula-simple');
  const day = calculateArabicPartFromFormula({ formulaRow: row, ...dayFixture.input });
  const night = calculateArabicPartFromFormula({ formulaRow: row, ...nightFixture.input });
  const dayExpected = dayFixture.expected.parts['lot-of-spirit'];
  const nightExpected = nightFixture.expected.parts['lot-of-spirit'];

  assert.equal(day.status, 'ready');
  assert.equal(day.key, 'lot-of-spirit');
  assert.equal(day.label, 'Жребий Духа');
  assert.equal(day.labelEn, 'Lot of Spirit');
  assertClose(day.longitude, dayExpected.longitude);
  assert.deepEqual(day.sign, dayExpected.sign);
  assert.equal(day.degree, dayExpected.degree);
  assert.equal(day.minutes, dayExpected.minutes);
  assert.equal(day.seconds, dayExpected.seconds);
  assert.equal(day.text, dayExpected.text);
  assert.equal(day.formulaVariant, 'day');
  assert.equal(day.formula, 'ASC + Sun - Moon');

  assert.equal(night.status, 'ready');
  assertClose(night.longitude, nightExpected.longitude);
  assert.equal(night.text, nightExpected.text);
  assert.equal(night.formulaVariant, 'night');
  assert.equal(night.formula, 'ASC + Moon - Sun');
  assertSafeOutput(day);
  assertSafeOutput(night);
});

test('day and night formulas make Pars Fortuna and Lot of Spirit inverse pairs', () => {
  const day = calculateArabicPartsFromLongitudes(getArabicPartsFixture('day-formula-simple').input);
  const night = calculateArabicPartsFromLongitudes(getArabicPartsFixture('night-formula-simple').input);

  assert.equal(partByKey(day, 'pars-fortuna').longitude, partByKey(night, 'lot-of-spirit').longitude);
  assert.equal(partByKey(day, 'lot-of-spirit').longitude, partByKey(night, 'pars-fortuna').longitude);
});

test('wrap-around formula results normalize into the tropical zodiac', () => {
  const positiveFixture = getArabicPartsFixture('day-wrap-around-positive');
  const negativeFixture = getArabicPartsFixture('day-wrap-around-negative');
  const positive = calculateArabicPartsFromLongitudes(positiveFixture.input);
  const negative = calculateArabicPartsFromLongitudes(negativeFixture.input);

  assert.equal(positive.status, 'ready');
  assertClose(partByKey(positive, 'pars-fortuna').longitude, positiveFixture.expected.parts['pars-fortuna'].longitude);
  assert.equal(partByKey(positive, 'pars-fortuna').text, positiveFixture.expected.parts['pars-fortuna'].text);
  assertClose(partByKey(positive, 'lot-of-spirit').longitude, positiveFixture.expected.parts['lot-of-spirit'].longitude);
  assert.equal(partByKey(positive, 'lot-of-spirit').text, positiveFixture.expected.parts['lot-of-spirit'].text);

  assert.equal(negative.status, 'ready');
  assertClose(partByKey(negative, 'pars-fortuna').longitude, negativeFixture.expected.parts['pars-fortuna'].longitude);
  assert.equal(partByKey(negative, 'pars-fortuna').text, negativeFixture.expected.parts['pars-fortuna'].text);
  assertClose(partByKey(negative, 'lot-of-spirit').longitude, negativeFixture.expected.parts['lot-of-spirit'].longitude);
  assert.equal(partByKey(negative, 'lot-of-spirit').text, negativeFixture.expected.parts['lot-of-spirit'].text);
});

test('calculateArabicPartsFromLongitudes calculates active verified formulas only by default', () => {
  const fixture = getArabicPartsFixture('day-formula-simple');
  const result = calculateArabicPartsFromLongitudes(fixture.input);

  assert.equal(result.status, 'ready');
  assert.equal(result.ready, true);
  assert.equal(result.total, 2);
  assert.equal(result.readyCount, 2);
  assert.equal(result.invalidCount, 0);
  assert.deepEqual(result.parts.map((part) => part.key), fixture.expected.activeKeys);
  assert.deepEqual(getActiveArabicPartsFormulas().map((row) => row.key), ['pars-fortuna', 'lot-of-spirit']);
  result.parts.forEach((part) => {
    assert.equal(part.status, 'ready');
    assert.match(part.text, /^.+ — .+ \d{1,2}°\d{2}′\d{2}″$/);
    assert.equal(part.verificationStatus, 'verified');
  });
  assertSafeOutput(result);
});

test('deferred formula requests do not produce fake ready values', () => {
  const fixture = getArabicPartsFixture('day-formula-simple');
  const mixed = calculateArabicPartsFromLongitudes({
    ...fixture.input,
    formulaKeys: ['pars-fortuna', 'lot-of-eros'],
  });
  const deferredOnly = calculateArabicPartsFromLongitudes({
    ...fixture.input,
    formulaKeys: ['lot-of-eros'],
  });

  assert.equal(mixed.status, 'partial');
  assert.equal(mixed.ready, true);
  assert.equal(mixed.readyCount, 1);
  assert.equal(mixed.invalidCount, 1);
  assert.equal(partByKey(mixed, 'pars-fortuna').status, 'ready');
  assert.equal(partByKey(mixed, 'lot-of-eros').status, 'unsupported');
  assert.equal(partByKey(mixed, 'lot-of-eros').reason, 'formulaNotActive');
  assert.equal(partByKey(mixed, 'lot-of-eros').longitude, null);

  assert.equal(deferredOnly.status, 'notReady');
  assert.equal(deferredOnly.ready, false);
  assert.equal(deferredOnly.readyCount, 0);
  assert.equal(deferredOnly.invalidCount, 1);
  assert.equal(partByKey(deferredOnly, 'lot-of-eros').status, 'unsupported');
  assertSafeOutput(mixed);
  assertSafeOutput(deferredOnly);
});

test('generic Arabic Parts Pars Fortuna matches existing Pars Fortuna engine', () => {
  const dayInput = getArabicPartsFixture('day-formula-simple').input;
  const nightInput = getArabicPartsFixture('night-formula-simple').input;
  const dayGeneric = partByKey(calculateArabicPartsFromLongitudes(dayInput), 'pars-fortuna');
  const nightGeneric = partByKey(calculateArabicPartsFromLongitudes(nightInput), 'pars-fortuna');
  const dayPars = calculateParsFortunaFromLongitudes(dayInput);
  const nightPars = calculateParsFortunaFromLongitudes(nightInput);

  assert.equal(dayGeneric.text, dayPars.text);
  assert.equal(dayGeneric.formula, dayPars.formula);
  assertClose(dayGeneric.longitude, dayPars.longitude);
  assert.equal(nightGeneric.text, nightPars.text);
  assert.equal(nightGeneric.formula, nightPars.formula);
  assertClose(nightGeneric.longitude, nightPars.longitude);
});

test('invalid formula inputs return safe notReady states', () => {
  const missingAsc = calculateArabicPartsFromLongitudes(getArabicPartsFixture('invalid-missing-asc').input);
  const missingSun = calculateArabicPartsFromLongitudes(getArabicPartsFixture('invalid-missing-sun').input);
  const missingMoon = calculateArabicPartsFromLongitudes(getArabicPartsFixture('invalid-missing-moon').input);
  const boundary = calculateArabicPartsFromLongitudes(getArabicPartsFixture('invalid-boundary-chart-sect').input);
  const unknownSect = calculateArabicPartsFromLongitudes({
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

test('inactive deferred or missing formula rows fail closed', () => {
  const fixture = getArabicPartsFixture('day-formula-simple');
  const deferred = calculateArabicPartFromFormula({
    formulaRow: getArabicPartFormulaByKey('lot-of-eros'),
    ...fixture.input,
  });
  const missing = calculateArabicPartFromFormula({
    ...fixture.input,
  });

  assert.equal(deferred.status, 'unsupported');
  assert.equal(deferred.reason, 'formulaNotActive');
  assert.equal(deferred.longitude, null);
  assert.equal(missing.status, 'unsupported');
  assert.equal(missing.reason, 'missingFormulaRow');
  assertSafeOutput(deferred);
  assertSafeOutput(missing);
});

test('getArabicPartsInputReadiness reports missing inputs safely', () => {
  const ready = getArabicPartsInputReadiness({
    ascLongitude: 10,
    sunLongitude: 100,
    moonLongitude: 150,
    chartSect: 'day',
  });
  const missing = getArabicPartsInputReadiness({
    ascLongitude: 10,
    chartSect: 'boundary',
  });

  assert.equal(ready.status, 'ready');
  assert.equal(ready.ready, true);
  assert.deepEqual(ready.missingInputs, []);
  assert.equal(missing.status, 'notReady');
  assert.equal(missing.ready, false);
  assert.equal(missing.reason, 'missingSunLongitude');
  assert.deepEqual(missing.missingInputs, ['sun', 'moon', 'chartSect']);
  assertSafeOutput(ready);
  assertSafeOutput(missing);
});

test('calculateArabicPartsForProfile fails closed for profile readiness problems', () => {
  const missingProfile = calculateArabicPartsForProfile(null);
  const unknownTime = calculateArabicPartsForProfile({
    ...READY_PROFILE,
    birthTime: '',
    birthTimeAccuracy: 'unknown',
  });
  const missingCoordinates = calculateArabicPartsForProfile({
    ...READY_PROFILE,
    birthPlace: {
      ...READY_PROFILE.birthPlace,
      coordinates: undefined,
      latitude: undefined,
      longitude: undefined,
    },
  });
  const missingPlanets = calculateArabicPartsForProfile(READY_PROFILE, {
    natalPlanetsResult: { status: 'incomplete', planets: [] },
  });

  assert.equal(missingProfile.status, 'notReady');
  assert.equal(missingProfile.reason, 'missingProfile');
  assert.equal(unknownTime.reason, 'missingExactBirthTime');
  assert.equal(missingCoordinates.reason, 'cityWithoutCoordinates');
  assert.equal(missingPlanets.reason, 'natalPlanetsNotReady');
  [missingProfile, unknownTime, missingCoordinates, missingPlanets].forEach(assertSafeOutput);
});

test('calculateArabicPartsForProfile returns ready from exact profile and injected safe chart inputs without mutation', () => {
  const profile = clone(READY_PROFILE);
  const result = calculateArabicPartsForProfile(profile, INJECTED_READY_OPTIONS);

  assert.equal(result.status, 'ready');
  assert.equal(result.ready, true);
  assert.equal(result.chartSect, 'day');
  assert.equal(result.total, 2);
  assert.equal(result.readyCount, 2);
  assert.equal(result.invalidCount, 0);
  assert.deepEqual(result.parts.map((part) => part.key), ['pars-fortuna', 'lot-of-spirit']);
  assert.equal(partByKey(result, 'pars-fortuna').text, 'Парс Фортуны — Близнецы 0°00′00″');
  assert.equal(partByKey(result, 'lot-of-spirit').text, 'Жребий Духа — Водолей 20°00′00″');
  assert.equal(result.source, 'profile-natal-sun-moon');
  assert.deepEqual(profile, clone(READY_PROFILE));
  assertSafeOutput(result);
});

test('summary capabilities and limitations keep Basic Arabic Parts scoped', () => {
  const result = calculateArabicPartsFromLongitudes(getArabicPartsFixture('day-formula-simple').input);
  const summary = getArabicPartsSummary(result);
  const emptySummary = getArabicPartsSummary({ status: 'notReady', parts: [] });
  const capabilities = getArabicPartsEngineCapabilities();
  const limitations = getArabicPartsEngineLimitations();

  assert.deepEqual(summary, {
    total: 2,
    ready: 2,
    invalid: 0,
    activeFormulaKeys: ['pars-fortuna', 'lot-of-spirit'],
    text: 'Жребии рассчитаны',
  });
  assert.deepEqual(emptySummary, {
    total: 0,
    ready: 0,
    invalid: 0,
    activeFormulaKeys: [],
    text: 'Жребии недоступны',
  });
  assert.equal(capabilities.arabicParts, true);
  assert.equal(capabilities.parsFortuna, true);
  assert.equal(capabilities.lotOfSpirit, true);
  assert.equal(capabilities.deferredParts, false);
  assert.equal(capabilities.houseAssignment, false);
  assert.equal(capabilities.interpretations, false);
  assert.equal(limitations.some((item) => item.includes('verified formulas')), true);
  assert.equal(limitations.some((item) => item.includes('Pars Fortuna и Lot of Spirit')), true);
  assert.equal(limitations.some((item) => item.includes('не назначает жребии в дома')), true);
});

test('Arabic Parts module keeps strict source boundaries', async () => {
  const source = await readFile(new URL('../src/arabicParts.js', import.meta.url), 'utf8');
  const imports = source
    .split('\n')
    .filter((line) => line.trim().startsWith('import '));
  const result = calculateArabicPartsFromLongitudes(getArabicPartsFixture('day-formula-simple').input);

  assertSafeOutput(result);
  assert.equal(imports.some((line) => line.includes('provider')), false);
  assert.equal(imports.some((line) => line.includes('localStorage')), false);
  assert.equal(imports.some((line) => line.includes('document')), false);
  assert.equal(imports.some((line) => line.includes('window')), false);
  assert.equal(imports.some((line) => line.includes('swisseph')), false);
  assert.equal(imports.some((line) => line.includes('astronomy-engine')), false);
  assert.equal(source.includes('document.'), false);
  assert.equal(source.includes('window.'), false);
  assert.equal(source.includes("from './houseCusps"), false);
  assert.equal(source.includes("from './planetInHouses"), false);
  assert.equal(source.includes('assignPlanetsToHouses'), false);
  assert.equal(source.includes('lot-of-eros') && source.includes('readyResult'), false);
  assert.equal(source.includes('lot-of-necessity') && source.includes('readyResult'), false);
  assert.equal(source.includes('lot-of-basis') && source.includes('readyResult'), false);
  assert.equal(source.includes('lot-of-exaltation') && source.includes('readyResult'), false);
  assert.equal(source.includes('фаталь'), false);
  assert.equal(source.includes('карми'), false);
  assert.equal(source.includes('сильный дом'), false);
  assert.equal(existsSync(new URL('../src/houses.js', import.meta.url)), false);
  assert.equal(existsSync(new URL('../src/houseSystems.js', import.meta.url)), false);
});
