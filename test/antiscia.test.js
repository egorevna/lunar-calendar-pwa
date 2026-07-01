import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

import {
  ANTISCIA_ENGINE_POLICY,
  calculateAntisciaForProfile,
  calculateAntisciaForTarget,
  calculateAntisciaFromTargets,
  calculateAntiscionLongitude,
  calculateContraAntiscionLongitude,
  getAntisciaEngineCapabilities,
  getAntisciaEngineLimitations,
  getAntisciaResultByKey,
  getAntisciaSummary,
  validateAntisciaResult,
} from '../src/antiscia.js';
import {
  PARTIAL_ANTISCIA_ENGINE_TARGETS_RESULT,
  SYNTHETIC_ANTISCIA_ENGINE_TARGETS_RESULT,
  getAntisciaFixture,
} from './fixtures/antisciaFixtures.js';

const READY_PROFILE = Object.freeze({
  id: 'antiscia-engine-profile',
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
    timezone: 'Europe/Moscow',
  },
  houseSystem: 'wholeSign',
  zodiac: 'tropical',
});

function assertNoPrivateOrInterpretiveText(value) {
  const text = JSON.stringify(value).toLowerCase();

  for (const forbidden of [
    'birthdate',
    'birthtime',
    'utcdatetime',
    'birthtimezone',
    'timezone',
    'coordinates',
    'latitude',
    'birthplace',
    'fullprofile',
    'profilejson',
    'providerpayload',
    'rawprovider',
    'interpretationtext',
    'mythology',
    'prediction',
    'fatalistic',
    'karmic',
    'фаталь',
    'карми',
    'судьб',
    'ритуал',
  ]) {
    assert.equal(text.includes(forbidden), false, `output should not include ${forbidden}`);
  }
}

test('ANTISCIA_ENGINE_POLICY exists and keeps scope narrow', () => {
  assert.equal(ANTISCIA_ENGINE_POLICY.sourceKey, 'antiscia-solstice-axis-and-contra-equinox-axis');
  assert.equal(ANTISCIA_ENGINE_POLICY.coordinateSystem, 'tropical-ecliptic-longitude');
  assert.equal(ANTISCIA_ENGINE_POLICY.antiscionFormula, 'normalize(180 - longitude)');
  assert.equal(ANTISCIA_ENGINE_POLICY.contraAntiscionFormula, 'normalize(360 - longitude)');
  assert.equal(ANTISCIA_ENGINE_POLICY.activeTargetPolicy, 'natal-planets-and-angles');
  assert.equal(ANTISCIA_ENGINE_POLICY.contacts, false);
  assert.equal(ANTISCIA_ENGINE_POLICY.interpretations, false);
});

test('antiscion and contra-antiscion formulas match manual fixtures', () => {
  for (const id of ['formula-10', 'formula-40', 'formula-70', 'formula-100', 'formula-280']) {
    const fixture = getAntisciaFixture(id);
    const antiscion = calculateAntiscionLongitude(fixture.input.longitude);
    const contraAntiscion = calculateContraAntiscionLongitude(fixture.input.longitude);

    assert.equal(antiscion.status, 'ready');
    assert.equal(antiscion.ready, true);
    assert.equal(antiscion.inputLongitude, fixture.input.longitude);
    assert.equal(antiscion.longitude, fixture.expected.antiscion);
    assert.equal(antiscion.formula, 'normalize(180 - longitude)');
    assert.equal(antiscion.sourcePolicy, 'antiscia-solstice-axis');

    assert.equal(contraAntiscion.status, 'ready');
    assert.equal(contraAntiscion.ready, true);
    assert.equal(contraAntiscion.inputLongitude, fixture.input.longitude);
    assert.equal(contraAntiscion.longitude, fixture.expected.contraAntiscion);
    assert.equal(contraAntiscion.formula, 'normalize(360 - longitude)');
    assert.equal(contraAntiscion.sourcePolicy, 'contra-antiscia-equinox-axis');
    assertNoPrivateOrInterpretiveText({ antiscion, contraAntiscion });
  }
});

test('axis points remain fixed on their mirror axes', () => {
  for (const id of ['axis-cancer-0', 'axis-capricorn-0', 'axis-aries-0', 'axis-libra-0']) {
    const fixture = getAntisciaFixture(id);
    const antiscion = calculateAntiscionLongitude(fixture.input.longitude);
    const contraAntiscion = calculateContraAntiscionLongitude(fixture.input.longitude);

    assert.equal(antiscion.longitude, fixture.expected.antiscion);
    assert.equal(contraAntiscion.longitude, fixture.expected.contraAntiscion);
  }
});

test('invalid longitude returns safe invalid', () => {
  const fixture = getAntisciaFixture('invalid-longitude');
  const antiscion = calculateAntiscionLongitude(fixture.input.longitude);
  const contraAntiscion = calculateContraAntiscionLongitude(fixture.input.longitude);

  assert.equal(antiscion.status, fixture.expected.status);
  assert.equal(antiscion.ready, false);
  assert.equal(antiscion.reason, fixture.expected.reason);
  assert.equal(antiscion.longitude, null);
  assert.equal(contraAntiscion.status, fixture.expected.status);
  assert.equal(contraAntiscion.ready, false);
  assert.equal(contraAntiscion.reason, fixture.expected.reason);
  assert.equal(contraAntiscion.longitude, null);
  assertNoPrivateOrInterpretiveText({ antiscion, contraAntiscion });
});

test('calculateAntisciaForTarget returns safe ready result with both positions', () => {
  const fixture = getAntisciaFixture('single-target-sun');
  const result = calculateAntisciaForTarget(fixture.input.target);

  assert.equal(result.status, fixture.expected.status);
  assert.equal(result.ready, true);
  assert.equal(result.type, 'antiscia');
  assert.equal(result.key, fixture.expected.key);
  assert.equal(result.targetKey, fixture.expected.key);
  assert.equal(result.targetLabel, fixture.expected.targetLabel);
  assert.equal(result.targetLabelEn, 'Sun');
  assert.equal(result.targetCategory, fixture.expected.targetCategory);
  assert.equal(result.targetSet, 'natal-planets');
  assert.equal(result.targetLongitude, 10);
  assert.equal(result.antiscion.longitude, fixture.expected.antiscion);
  assert.equal(result.antiscion.sign.key, fixture.expected.antiscionSignKey);
  assert.equal(result.antiscion.degree, 20);
  assert.equal(result.antiscion.minutes, 0);
  assert.equal(result.antiscion.seconds, 0);
  assert.equal(result.antiscion.text, 'антис — Дева 20°00′00″');
  assert.equal(result.contraAntiscion.longitude, fixture.expected.contraAntiscion);
  assert.equal(result.contraAntiscion.sign.key, fixture.expected.contraAntiscionSignKey);
  assert.equal(result.contraAntiscion.degree, 20);
  assert.equal(result.contraAntiscion.minutes, 0);
  assert.equal(result.contraAntiscion.seconds, 0);
  assert.equal(result.contraAntiscion.text, 'контрантис — Рыбы 20°00′00″');
  assert.equal(result.sourcePolicy, 'antiscia-solstice-axis-and-contra-equinox-axis');
  assert.equal(result.contacts, false);
  assert.equal(result.interpretations, false);
  assert.equal('target' in result, false);
  assertNoPrivateOrInterpretiveText(result);
});

test('calculateAntisciaFromTargets returns 14 results preserving target order', () => {
  const fixture = getAntisciaFixture('batch-ready');
  const result = calculateAntisciaFromTargets(fixture.input.targetsResult);

  assert.equal(result.status, fixture.expected.status);
  assert.equal(result.ready, true);
  assert.equal(result.targetCount, fixture.expected.targetCount);
  assert.equal(result.readyCount, fixture.expected.readyCount);
  assert.equal(result.invalidCount, fixture.expected.invalidCount);
  assert.equal(result.results.length, 14);
  assert.deepEqual(result.results.map((item) => item.key), fixture.input.targetsResult.targets.map((target) => target.key));

  for (const [key, expected] of Object.entries(fixture.expected.selectedOutputs)) {
    const item = getAntisciaResultByKey(result, key);

    assert.equal(item.antiscion.longitude, expected.antiscion);
    assert.equal(item.contraAntiscion.longitude, expected.contraAntiscion);
  }

  assertNoPrivateOrInterpretiveText(result);
});

test('partial and notReady targets are handled safely', () => {
  const partialFixture = getAntisciaFixture('partial-targets');
  const partial = calculateAntisciaFromTargets(partialFixture.input.targetsResult);
  const notReady = calculateAntisciaFromTargets({
    status: 'notReady',
    ready: false,
    reason: 'antisciaTargetsNotReady',
    targets: [],
  });

  assert.equal(partial.status, partialFixture.expected.status);
  assert.equal(partial.ready, true);
  assert.equal(partial.targetCount, partialFixture.expected.targetCount);
  assert.equal(partial.readyCount, partialFixture.expected.readyCount);
  assert.equal(partial.invalidCount, partialFixture.expected.invalidCount);
  assert.equal(partial.results.length, 10);
  assert.deepEqual(partial.missingTargetSets, PARTIAL_ANTISCIA_ENGINE_TARGETS_RESULT.missingTargetSets);

  assert.equal(notReady.status, 'notReady');
  assert.equal(notReady.ready, false);
  assert.equal(notReady.reason, 'antisciaTargetsNotReady');
  assert.equal(notReady.targetCount, 0);
  assert.equal(notReady.readyCount, 0);
  assert.deepEqual(notReady.results, []);
  assertNoPrivateOrInterpretiveText({ partial, notReady });
});

test('profile helper supports injected ready path without mutation and safe fallback', () => {
  const profile = JSON.parse(JSON.stringify(READY_PROFILE));
  const noProfile = calculateAntisciaForProfile(null);
  const injected = calculateAntisciaForProfile(profile, {
    targetsResult: SYNTHETIC_ANTISCIA_ENGINE_TARGETS_RESULT,
  });

  assert.equal(noProfile.status, 'notReady');
  assert.equal(noProfile.ready, false);
  assert.equal(injected.status, 'ready');
  assert.equal(injected.targetCount, 14);
  assert.deepEqual(profile, JSON.parse(JSON.stringify(READY_PROFILE)));
  assertNoPrivateOrInterpretiveText({ noProfile, injected });
});

test('lookup validation summary capabilities and limitations are safe', () => {
  const ready = calculateAntisciaFromTargets(SYNTHETIC_ANTISCIA_ENGINE_TARGETS_RESULT);
  const partial = calculateAntisciaFromTargets(PARTIAL_ANTISCIA_ENGINE_TARGETS_RESULT);
  const invalid = calculateAntisciaForTarget(getAntisciaFixture('invalid-longitude').input.target);
  const readyValidation = validateAntisciaResult(ready.results[0]);
  const invalidValidation = validateAntisciaResult(invalid);
  const readySummary = getAntisciaSummary(ready);
  const partialSummary = getAntisciaSummary(partial);
  const notReadySummary = getAntisciaSummary({ status: 'notReady', ready: false });
  const capabilities = getAntisciaEngineCapabilities();
  const limitations = getAntisciaEngineLimitations();

  assert.equal(getAntisciaResultByKey(ready, 'sun')?.key, 'sun');
  assert.equal(getAntisciaResultByKey(ready, 'unknown'), null);
  assert.equal(readyValidation.status, 'ready');
  assert.equal(readyValidation.valid, true);
  assert.equal(invalidValidation.status, 'invalid');
  assert.equal(invalidValidation.valid, false);
  assert.equal(readySummary.status, 'ready');
  assert.equal(readySummary.text, '14 антисов и контрантисов рассчитаны');
  assert.equal(partialSummary.status, 'partial');
  assert.equal(partialSummary.text, '10 антисов и контрантисов рассчитаны частично');
  assert.equal(notReadySummary.status, 'notReady');
  assert.equal(notReadySummary.text, 'Антисы и контрантисы недоступны');
  assert.equal(capabilities.antiscia, true);
  assert.equal(capabilities.contraAntiscia, true);
  assert.equal(capabilities.contacts, false);
  assert.equal(capabilities.aspects, false);
  assert.equal(capabilities.midpoints, false);
  assert.equal(capabilities.ui, false);
  assert.equal(capabilities.debug, false);
  assert.equal(capabilities.interpretations, false);
  assert.equal(limitations.some((item) => item.includes('контакты или аспекты')), true);
  assert.equal(limitations.some((item) => item.includes('Интерпретации не добавлены')), true);
  assertNoPrivateOrInterpretiveText({ readyValidation, invalidValidation, readySummary, partialSummary, notReadySummary, capabilities, limitations });
});

test('antiscia module keeps runtime and feature boundaries', () => {
  const source = readFileSync(new URL('../src/antiscia.js', import.meta.url), 'utf8');

  for (const forbiddenImport of [
    'swisseph',
    'astronomy-engine',
    'document',
    'window',
    'localStorage',
    'planetaryProvider',
    'natalPlanetsForProfile',
    'midpoints.js',
    'midpointTargets',
  ]) {
    assert.equal(source.includes(forbiddenImport), false, `src/antiscia.js should not include ${forbiddenImport}`);
  }

  assert.equal(source.includes('calculateShortestArcMidpoint'), false);
  assert.equal(source.includes('midpointLongitude'), false);
  assert.equal(source.includes('createElement'), false);
  assert.equal(existsSync(new URL('../src/midpointsAntiscia.js', import.meta.url)), false);
});
