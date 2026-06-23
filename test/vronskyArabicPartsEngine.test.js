import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import {
  calculateArabicPartsForProfile,
  calculateArabicPartsFromLongitudes,
  calculateVronskySimpleArabicPartFromLongitudes,
  calculateVronskySimpleArabicPartsForProfile,
  calculateVronskySimpleArabicPartsFromLongitudes,
  getVronskySimpleArabicPartFormula,
  getVronskySimpleArabicPartsEngineCapabilities,
  getVronskySimpleArabicPartsEngineLimitations,
  getVronskySimpleArabicPartsInputReadiness,
  getVronskySimpleArabicPartsSummary,
} from '../src/arabicParts.js';
import {
  getActiveArabicPartsFormulas,
  getArabicPartFormulaByKey,
  getDeferredArabicPartsFormulas,
  getVronskySimpleArabicPartsFormulaRows,
} from '../src/arabicPartsData.js';
import { getVronskyArabicPartsEngineFixture } from './fixtures/vronskyArabicPartsEngineFixtures.js';

const READY_PROFILE = Object.freeze({
  id: 'vronsky-arabic-parts-profile',
  name: 'Synthetic Vronsky Arabic Parts',
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
      asc: Object.freeze({ longitude: 100 }),
    }),
  }),
  natalPlanetsResult: Object.freeze({
    status: 'ready',
    planets: Object.freeze([
      Object.freeze({ key: 'sun', longitude: 10 }),
      Object.freeze({ key: 'moon', longitude: 40 }),
      Object.freeze({ key: 'mercury', longitude: 60 }),
      Object.freeze({ key: 'venus', longitude: 80 }),
      Object.freeze({ key: 'jupiter', longitude: 120 }),
      Object.freeze({ key: 'saturn', longitude: 150 }),
      Object.freeze({ key: 'uranus', longitude: 200 }),
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
  assert.equal(json.includes('"timezone"'), false);
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

test('getVronskySimpleArabicPartFormula returns selected Vronsky rows only', () => {
  const parsAmoris = getVronskySimpleArabicPartFormula('pars-amoris');

  assert.equal(parsAmoris.key, 'pars-amoris');
  assert.equal(parsAmoris.labelRu, 'Точка любви');
  assert.equal(parsAmoris.sourceSystem, 'vronsky-table-17-arabic-points');
  assert.equal(parsAmoris.engineStatus, 'engineReady');
  assert.equal(parsAmoris.activationStatus, 'explicitVronskyEngineOnly');
  assert.equal(getVronskySimpleArabicPartFormula('lot-of-eros'), null);
  assert.equal(getVronskySimpleArabicPartFormula('pars-mercatoris'), null);
  assert.equal(getVronskySimpleArabicPartFormula('unknown'), null);
});

test('Vronsky input readiness requires selected operands and day chart sect', () => {
  const ready = getVronskySimpleArabicPartsInputReadiness(
    getVronskyArabicPartsEngineFixture('day-ready-synthetic').input,
  );
  const missing = getVronskySimpleArabicPartsInputReadiness(
    getVronskyArabicPartsEngineFixture('missing-uranus').input,
  );
  const night = getVronskySimpleArabicPartsInputReadiness(
    getVronskyArabicPartsEngineFixture('night-not-ready').input,
  );

  assert.deepEqual(ready, {
    status: 'ready',
    ready: true,
    reason: null,
    missingInputs: [],
    requiredInputs: ['asc', 'sun', 'moon', 'mercury', 'venus', 'jupiter', 'saturn', 'uranus', 'chartSect'],
  });
  assert.equal(missing.status, 'notReady');
  assert.equal(missing.reason, 'missingRequiredLongitude');
  assert.deepEqual(missing.missingInputs, ['uranus']);
  assert.equal(night.reason, 'vronskyNightFormulaNotVerified');
  assertSafeOutput({ ready, missing, night });
});

test('calculateVronskySimpleArabicPartFromLongitudes calculates selected formulas from manual fixture', () => {
  const fixture = getVronskyArabicPartsEngineFixture('day-ready-synthetic');
  const amoris = calculateVronskySimpleArabicPartFromLongitudes('pars-amoris', fixture.input);
  const artis = calculateVronskySimpleArabicPartFromLongitudes('pars-artis', fixture.input);
  const creationis = calculateVronskySimpleArabicPartFromLongitudes('pars-creationis', fixture.input);

  assert.equal(amoris.status, 'ready');
  assert.equal(amoris.ready, true);
  assert.equal(amoris.key, 'pars-amoris');
  assert.equal(amoris.label, 'Точка любви');
  assert.equal(amoris.labelEn, 'Pars amoris');
  assertClose(amoris.longitude, fixture.expected.longitudes['pars-amoris']);
  assert.equal(amoris.sourceSystem, 'vronsky-table-17-arabic-points');
  assert.equal(amoris.formulaTradition, 'Vronsky Table 17 Arabic Points');
  assert.equal(amoris.chartSectPolicy, 'dayOnly');
  assert.equal(amoris.text, 'Точка любви — Дева 20°00′00″');
  assert.equal(amoris.sign.ru, 'Дева');
  assert.equal(amoris.degree, 20);
  assert.equal(amoris.minutes, 0);
  assert.equal(amoris.seconds, 0);
  assertClose(artis.longitude, fixture.expected.longitudes['pars-artis']);
  assert.equal(artis.text, 'Точка искусства — Близнецы 20°00′00″');
  assertClose(creationis.longitude, fixture.expected.longitudes['pars-creationis']);
  assert.equal(creationis.text, 'Точка друзей — Водолей 0°00′00″');
  [amoris, artis, creationis].forEach(assertSafeOutput);
});

test('calculateVronskySimpleArabicPartsFromLongitudes calculates all 12 expected values in source order', () => {
  const fixture = getVronskyArabicPartsEngineFixture('day-ready-synthetic');
  const result = calculateVronskySimpleArabicPartsFromLongitudes(fixture.input);

  assert.equal(result.status, 'ready');
  assert.equal(result.ready, true);
  assert.equal(result.total, 12);
  assert.equal(result.readyCount, 12);
  assert.equal(result.notReadyCount, 0);
  assert.deepEqual(result.parts.map((part) => part.key), getVronskySimpleArabicPartsFormulaRows().map((row) => row.key));
  Object.entries(fixture.expected.longitudes).forEach(([key, expectedLongitude]) => {
    const part = partByKey(result, key);

    assert.equal(part.status, 'ready');
    assertClose(part.longitude, expectedLongitude);
    assert.equal(part.sourceSystem, 'vronsky-table-17-arabic-points');
    assert.equal(part.formulaTradition, 'Vronsky Table 17 Arabic Points');
    assert.equal(part.chartSectPolicy, 'dayOnly');
    assert.equal(Number.isInteger(part.seconds), true);
  });
  assertSafeOutput(result);
});

test('Vronsky formulas normalize wrap-around results', () => {
  const fixture = getVronskyArabicPartsEngineFixture('wrap-around');
  const amoris = calculateVronskySimpleArabicPartFromLongitudes('pars-amoris', fixture.input);
  const astrologia = calculateVronskySimpleArabicPartFromLongitudes('astrologia', fixture.input);

  assertClose(amoris.longitude, fixture.expected.longitudes['pars-amoris']);
  assert.equal(amoris.text, 'Точка любви — Рыбы 0°00′00″');
  assertClose(astrologia.longitude, fixture.expected.longitudes.astrologia);
  assert.equal(astrologia.text, 'Астрология — Близнецы 10°00′00″');
});

test('Vronsky day-only policy fails closed for night boundary and unknown chart sect', () => {
  const nightFixture = getVronskyArabicPartsEngineFixture('night-not-ready');
  const boundaryFixture = getVronskyArabicPartsEngineFixture('boundary-not-ready');
  const unknownFixture = getVronskyArabicPartsEngineFixture('unknown-not-ready');
  const night = calculateVronskySimpleArabicPartsFromLongitudes(nightFixture.input);
  const boundary = calculateVronskySimpleArabicPartsFromLongitudes(boundaryFixture.input);
  const unknown = calculateVronskySimpleArabicPartsFromLongitudes(unknownFixture.input);

  assert.equal(night.status, 'notReady');
  assert.equal(night.reason, nightFixture.expected.reason);
  assert.equal(night.readyCount, 0);
  assert.equal(night.notReadyCount, 12);
  assert.equal(partByKey(night, 'pars-amoris').reason, 'vronskyNightFormulaNotVerified');
  assert.equal(boundary.reason, boundaryFixture.expected.reason);
  assert.equal(unknown.reason, unknownFixture.expected.reason);
  [night, boundary, unknown].forEach(assertSafeOutput);
});

test('missing Vronsky operands produce partial safe output without fake values', () => {
  const fixture = getVronskyArabicPartsEngineFixture('missing-uranus');
  const result = calculateVronskySimpleArabicPartsFromLongitudes(fixture.input);

  assert.equal(result.status, 'partial');
  assert.equal(result.ready, true);
  assert.equal(result.readyCount, fixture.expected.readyCount);
  assert.equal(result.notReadyCount, fixture.expected.notReadyCount);
  fixture.expected.notReadyKeys.forEach((key) => {
    const part = partByKey(result, key);

    assert.equal(part.status, 'notReady');
    assert.equal(part.reason, 'missingRequiredLongitude');
    assert.equal(part.longitude, null);
    assert.deepEqual(part.missingInputs, ['uranus']);
  });
  assertSafeOutput(result);
});

test('Vronsky profile helper is explicit and does not change default Arabic Parts behavior', () => {
  const profile = clone(READY_PROFILE);
  const defaultResult = calculateArabicPartsForProfile(profile, INJECTED_READY_OPTIONS);
  const vronskyResult = calculateVronskySimpleArabicPartsForProfile(profile, INJECTED_READY_OPTIONS);

  assert.equal(defaultResult.status, 'ready');
  assert.deepEqual(defaultResult.parts.map((part) => part.key), ['pars-fortuna', 'lot-of-spirit']);
  assert.equal(vronskyResult.status, 'ready');
  assert.equal(vronskyResult.readyCount, 12);
  assert.equal(partByKey(vronskyResult, 'pars-amoris').longitude, 170);
  assert.deepEqual(profile, clone(READY_PROFILE));
  assertSafeOutput(defaultResult);
  assertSafeOutput(vronskyResult);
});

test('Vronsky profile helper fails closed for missing profile and missing planet inputs', () => {
  const missingProfile = calculateVronskySimpleArabicPartsForProfile(null);
  const missingUranus = calculateVronskySimpleArabicPartsForProfile(READY_PROFILE, {
    ...INJECTED_READY_OPTIONS,
    natalPlanetsResult: {
      status: 'ready',
      planets: INJECTED_READY_OPTIONS.natalPlanetsResult.planets.filter((planet) => planet.key !== 'uranus'),
    },
  });

  assert.equal(missingProfile.status, 'notReady');
  assert.equal(missingProfile.reason, 'missingProfile');
  assert.equal(missingUranus.status, 'partial');
  assert.equal(partByKey(missingUranus, 'astrologia').reason, 'missingRequiredLongitude');
  assertSafeOutput(missingProfile);
  assertSafeOutput(missingUranus);
});

test('Vronsky summary capabilities and limitations keep engine scoped', () => {
  const ready = calculateVronskySimpleArabicPartsFromLongitudes(
    getVronskyArabicPartsEngineFixture('day-ready-synthetic').input,
  );
  const night = calculateVronskySimpleArabicPartsFromLongitudes(
    getVronskyArabicPartsEngineFixture('night-not-ready').input,
  );
  const readySummary = getVronskySimpleArabicPartsSummary(ready);
  const nightSummary = getVronskySimpleArabicPartsSummary(night);
  const capabilities = getVronskySimpleArabicPartsEngineCapabilities();
  const limitations = getVronskySimpleArabicPartsEngineLimitations();

  assert.deepEqual(readySummary, {
    status: 'ready',
    text: '12 точек Вронского рассчитаны',
    readyCount: 12,
  });
  assert.deepEqual(nightSummary, {
    status: 'notReady',
    text: 'Точки Вронского недоступны для ночной карты без verified night formulas',
    readyCount: 0,
  });
  assert.equal(capabilities.vronskySimpleArabicParts, true);
  assert.equal(capabilities.dayOnly, true);
  assert.equal(capabilities.nightFormulas, false);
  assert.equal(capabilities.houseAssignment, false);
  assert.equal(capabilities.display, false);
  assert.equal(capabilities.ui, false);
  assert.equal(capabilities.debug, false);
  assert.equal(capabilities.interpretations, false);
  assert.equal(limitations.some((item) => item.includes('только для дневных карт')), true);
  assert.equal(limitations.some((item) => item.includes('Ночные формулы')), true);
});

test('default active formulas and old deferred lots remain unchanged', () => {
  const defaultResult = calculateArabicPartsFromLongitudes({
    ascLongitude: 100,
    sunLongitude: 10,
    moonLongitude: 40,
    chartSect: 'day',
  });

  assert.deepEqual(getActiveArabicPartsFormulas().map((row) => row.key), ['pars-fortuna', 'lot-of-spirit']);
  assert.deepEqual(getDeferredArabicPartsFormulas().map((row) => row.key), [
    'lot-of-eros',
    'lot-of-necessity',
    'lot-of-basis',
    'lot-of-exaltation',
  ]);
  assert.deepEqual(defaultResult.parts.map((part) => part.key), ['pars-fortuna', 'lot-of-spirit']);
  ['lot-of-eros', 'lot-of-necessity', 'lot-of-basis', 'lot-of-exaltation'].forEach((key) => {
    const row = getArabicPartFormulaByKey(key);

    assert.equal(row.active, false);
    assert.equal(row.formula, null);
  });
});

test('Vronsky Arabic Parts engine output and source boundaries stay safe', async () => {
  const source = await readFile(new URL('../src/arabicParts.js', import.meta.url), 'utf8');
  const imports = source
    .split('\n')
    .filter((line) => line.trim().startsWith('import '));
  const result = calculateVronskySimpleArabicPartsFromLongitudes(
    getVronskyArabicPartsEngineFixture('day-ready-synthetic').input,
  );

  assertSafeOutput(result);
  assert.equal(imports.some((line) => line.includes('provider')), false);
  assert.equal(imports.some((line) => line.includes('localStorage')), false);
  assert.equal(imports.some((line) => line.includes('document')), false);
  assert.equal(imports.some((line) => line.includes('window')), false);
  assert.equal(imports.some((line) => line.includes('swisseph')), false);
  assert.equal(imports.some((line) => line.includes('astronomy-engine')), false);
  assert.equal(source.includes('Valens'), false);
  assert.equal(source.includes('Paulus'), false);
  assert.equal(source.includes('Olympiodorus'), false);
  assert.equal(source.includes('Hermetic'), false);
  assert.equal(source.includes('Astrology X-Files'), false);
  assert.equal(source.includes('assignArabicPartsToHouses'), false);
  assert.equal(source.includes('document.'), false);
  assert.equal(source.includes('window.'), false);
  assert.equal(existsSync(new URL('../src/houses.js', import.meta.url)), false);
  assert.equal(existsSync(new URL('../src/houseSystems.js', import.meta.url)), false);
});
