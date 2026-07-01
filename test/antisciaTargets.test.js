import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

import {
  ANTISCIA_TARGET_KEYS,
  ANTISCIA_TARGET_POLICY,
  getAntisciaTargetByKey,
  getAntisciaTargetCapabilities,
  getAntisciaTargetLimitations,
  getAntisciaTargetSummary,
  normalizeAntisciaTarget,
  resolveAntisciaAngleTargets,
  resolveAntisciaNatalPlanetTargets,
  resolveAntisciaTargets,
  resolveAntisciaTargetsForProfile,
  validateAntisciaTarget,
} from '../src/antisciaTargets.js';
import {
  SYNTHETIC_ANTISCIA_ASC_MC_ONLY_RESULT,
  SYNTHETIC_ANTISCIA_ASC_MC_RESULT,
  SYNTHETIC_ANTISCIA_NATAL_PLANETS_RESULT,
  getAntisciaTargetsFixture,
} from './fixtures/antisciaTargetsFixtures.js';

const READY_PROFILE = Object.freeze({
  id: 'antiscia-target-profile',
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

test('ANTISCIA_TARGET_KEYS and policy define planets plus angles', () => {
  assert.deepEqual(ANTISCIA_TARGET_KEYS, [
    'sun',
    'moon',
    'mercury',
    'venus',
    'mars',
    'jupiter',
    'saturn',
    'uranus',
    'neptune',
    'pluto',
    'asc',
    'mc',
    'dsc',
    'ic',
  ]);
  assert.equal(ANTISCIA_TARGET_POLICY.sourceKey, 'antiscia-targets-natal-planets-and-angles');
  assert.deepEqual(ANTISCIA_TARGET_POLICY.activeTargetSets, ['natal-planets', 'angles']);
  assert.equal(ANTISCIA_TARGET_POLICY.expectedTargetCount, 14);
  assert.equal(ANTISCIA_TARGET_POLICY.deferredTargetSets.includes('house-cusps'), true);
  assert.equal(ANTISCIA_TARGET_POLICY.deferredTargetSets.includes('fixed-stars'), true);
});

test('normalizeAntisciaTarget normalizes planets and angles and rejects inactive targets', () => {
  const planet = normalizeAntisciaTarget({ key: 'venus', label: 'Венера', longitude: 460 });
  const angle = normalizeAntisciaTarget({ key: 'asc', label: 'ASC', longitude: 375 });

  assert.equal(planet.key, 'venus');
  assert.equal(planet.category, 'natal-planet');
  assert.equal(planet.targetSet, 'natal-planets');
  assert.equal(planet.longitude, 100);
  assert.equal(planet.sign.key, 'cancer');
  assert.equal(planet.text, 'Венера — Рак 10°00′00″');
  assert.equal(angle.key, 'asc');
  assert.equal(angle.category, 'angle');
  assert.equal(angle.targetSet, 'angles');
  assert.equal(angle.longitude, 15);
  assert.equal(angle.labelEn, 'Ascendant');
  assert.equal(angle.text, 'ASC — Овен 15°00′00″');
  assert.equal(normalizeAntisciaTarget({ key: 'house-cusp-1', longitude: 10 }), null);
  assert.equal(normalizeAntisciaTarget({ key: 'unknown', longitude: 10 }), null);
  assert.equal(normalizeAntisciaTarget({ key: 'sun' }), null);
});

test('resolveAntisciaNatalPlanetTargets returns 10 canonical targets', () => {
  const fixture = getAntisciaTargetsFixture('natal-planets-ready');
  const result = resolveAntisciaNatalPlanetTargets(fixture.input.natalPlanetsResult);

  assert.equal(result.status, fixture.expected.status);
  assert.equal(result.ready, true);
  assert.equal(result.targetSet, fixture.expected.targetSet);
  assert.equal(result.count, fixture.expected.count);
  assert.deepEqual(result.targets.map((target) => target.key), fixture.expected.order);
  assert.equal(result.targets.every((target) => target.category === 'natal-planet'), true);
  assertNoPrivateOrInterpretiveText(result);
});

test('resolveAntisciaAngleTargets returns ASC MC DSC IC and can derive opposites', () => {
  const fixture = getAntisciaTargetsFixture('angles-ready');
  const result = resolveAntisciaAngleTargets(fixture.input.ascMcResult);
  const derived = resolveAntisciaAngleTargets(SYNTHETIC_ANTISCIA_ASC_MC_ONLY_RESULT);

  assert.equal(result.status, fixture.expected.status);
  assert.equal(result.ready, true);
  assert.equal(result.targetSet, fixture.expected.targetSet);
  assert.equal(result.count, fixture.expected.count);
  assert.deepEqual(result.targets.map((target) => target.key), fixture.expected.order);
  assert.deepEqual(derived.targets.map((target) => target.key), ['asc', 'mc', 'dsc', 'ic']);
  assert.equal(derived.targets.find((target) => target.key === 'dsc').longitude, 195);
  assert.equal(derived.targets.find((target) => target.key === 'ic').longitude, 285);
  assertNoPrivateOrInterpretiveText(result);
  assertNoPrivateOrInterpretiveText(derived);
});

test('resolveAntisciaTargets combines planets and angles in canonical order', () => {
  const fixture = getAntisciaTargetsFixture('combined-ready');
  const result = resolveAntisciaTargets(fixture.input);
  const targetKeys = result.targets.map((target) => target.key);

  assert.equal(result.status, fixture.expected.status);
  assert.equal(result.ready, true);
  assert.equal(result.targetCount, fixture.expected.targetCount);
  assert.deepEqual(targetKeys, fixture.expected.order);
  assert.equal(result.targets.some((target) => 'antiscionLongitude' in target), false);
  assert.equal(result.targets.some((target) => 'contraAntiscionLongitude' in target), false);
  assertNoPrivateOrInterpretiveText(result);
});

test('resolveAntisciaTargets returns partial and notReady states safely', () => {
  const planetsOnly = resolveAntisciaTargets({
    natalPlanetsResult: SYNTHETIC_ANTISCIA_NATAL_PLANETS_RESULT,
    ascMcResult: { status: 'notReady', angles: null },
  });
  const anglesOnly = resolveAntisciaTargets({
    natalPlanetsResult: { status: 'incomplete', planets: [] },
    ascMcResult: SYNTHETIC_ANTISCIA_ASC_MC_RESULT,
  });
  const neither = resolveAntisciaTargets({
    natalPlanetsResult: { status: 'incomplete', planets: [] },
    ascMcResult: { status: 'notReady', angles: null },
  });

  assert.equal(planetsOnly.status, 'partial');
  assert.equal(planetsOnly.ready, true);
  assert.equal(planetsOnly.targetCount, 10);
  assert.deepEqual(planetsOnly.missingTargetSets, [{ targetSet: 'angles', reason: 'ascMcNotReady' }]);
  assert.equal(anglesOnly.status, 'partial');
  assert.equal(anglesOnly.ready, true);
  assert.equal(anglesOnly.targetCount, 4);
  assert.deepEqual(anglesOnly.missingTargetSets, [{ targetSet: 'natal-planets', reason: 'natalPlanetsNotReady' }]);
  assert.equal(neither.status, 'notReady');
  assert.equal(neither.ready, false);
  assert.equal(neither.targetCount, 0);
  assertNoPrivateOrInterpretiveText({ planetsOnly, anglesOnly, neither });
});

test('deferred target sets remain metadata only', () => {
  const fixture = getAntisciaTargetsFixture('deferred-targets');
  const result = resolveAntisciaTargets({
    natalPlanetsResult: SYNTHETIC_ANTISCIA_NATAL_PLANETS_RESULT,
    ascMcResult: SYNTHETIC_ANTISCIA_ASC_MC_RESULT,
  });
  const targetKeys = result.targets.map((target) => target.key);

  assert.deepEqual(result.deferredTargetSets, fixture.expected.deferredTargetSets);

  for (const targetSet of fixture.expected.deferredTargetSets) {
    assert.equal(targetKeys.includes(targetSet), false, `${targetSet} must not be active target`);
  }

  for (const deferredKey of ['house-cusp-1', 'north-node', 'lilith', 'selena', 'pars-fortuna', 'fixed-star']) {
    assert.equal(targetKeys.includes(deferredKey), false);
  }
});

test('profile helper returns safe fallback and supports injected ready path without mutation', () => {
  const profile = JSON.parse(JSON.stringify(READY_PROFILE));
  const noProfile = resolveAntisciaTargetsForProfile(null);
  const unknownTime = resolveAntisciaTargetsForProfile({
    ...READY_PROFILE,
    birthTime: '',
    birthTimeAccuracy: 'unknown',
  });
  const injected = resolveAntisciaTargetsForProfile(profile, {
    natalPlanetsResult: SYNTHETIC_ANTISCIA_NATAL_PLANETS_RESULT,
    ascMcResult: SYNTHETIC_ANTISCIA_ASC_MC_RESULT,
  });

  assert.equal(noProfile.status, 'notReady');
  assert.equal(unknownTime.status, 'notReady');
  assert.equal(injected.status, 'ready');
  assert.equal(injected.targetCount, 14);
  assert.deepEqual(profile, JSON.parse(JSON.stringify(READY_PROFILE)));
  assertNoPrivateOrInterpretiveText({ noProfile, unknownTime, injected });
});

test('lookup validation summary capabilities and limitations are safe', () => {
  const result = resolveAntisciaTargets({
    natalPlanetsResult: SYNTHETIC_ANTISCIA_NATAL_PLANETS_RESULT,
    ascMcResult: SYNTHETIC_ANTISCIA_ASC_MC_RESULT,
  });
  const venus = getAntisciaTargetByKey(result, 'venus');
  const asc = getAntisciaTargetByKey(result, 'asc');
  const readySummary = getAntisciaTargetSummary(result);
  const partialSummary = getAntisciaTargetSummary(resolveAntisciaTargets({
    natalPlanetsResult: SYNTHETIC_ANTISCIA_NATAL_PLANETS_RESULT,
    ascMcResult: { status: 'notReady', angles: null },
  }));
  const fallbackSummary = getAntisciaTargetSummary(null);
  const capabilities = getAntisciaTargetCapabilities();
  const limitations = getAntisciaTargetLimitations();

  assert.equal(venus.key, 'venus');
  assert.equal(asc.key, 'asc');
  assert.equal(getAntisciaTargetByKey(result, 'house-cusp-1'), null);
  assert.equal(validateAntisciaTarget(venus).valid, true);
  assert.equal(validateAntisciaTarget(asc).valid, true);
  assert.equal(validateAntisciaTarget({ key: 'asc', category: 'angle', targetSet: 'angles' }).valid, false);
  assert.equal(readySummary.text, '14 целей для антисов готовы');
  assert.equal(partialSummary.text, '10 целей для антисов готовы частично');
  assert.equal(fallbackSummary.text, 'Цели для антисов недоступны');
  assert.equal(capabilities.antisciaTargets, true);
  assert.equal(capabilities.antisciaEngine, false);
  assert.equal(capabilities.contraAntisciaEngine, false);
  assert.equal(capabilities.midpointEngine, false);
  assert.equal(capabilities.ui, false);
  assert.equal(capabilities.debug, false);
  assert.equal(capabilities.interpretations, false);
  assert.equal(limitations.some((item) => item.includes('не рассчитывает антисы или контрантисы')), true);
  assertNoPrivateOrInterpretiveText({
    readySummary,
    partialSummary,
    fallbackSummary,
    capabilities,
    limitations,
  });
});

test('antiscia target module strict exclusions are preserved', () => {
  const source = readFileSync(new URL('../src/antisciaTargets.js', import.meta.url), 'utf8');

  for (const forbidden of [
    'swisseph',
    'astronomy-engine',
    'localStorage',
    'document.',
    'window.',
    'planetaryProvider',
    'calculateFixedStar',
    'calculateMidpoint',
    'antiscionLongitude =',
    'contraAntiscionLongitude =',
    'normalize(180 -',
    'normalize(360 -',
    'antisciaEngine: true',
    'contraAntisciaEngine: true',
  ]) {
    assert.equal(source.includes(forbidden), false, `module source should not include ${forbidden}`);
  }

  assert.equal(existsSync(new URL('../src/midpointsAntiscia.js', import.meta.url)), false);
});
