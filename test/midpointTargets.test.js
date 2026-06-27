import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

import {
  MIDPOINT_TARGET_KEYS,
  MIDPOINT_TARGET_POLICY,
  buildMidpointTargetPairs,
  getMidpointPairByKey,
  getMidpointTargetByKey,
  getMidpointTargetCapabilities,
  getMidpointTargetLimitations,
  getMidpointTargetSummary,
  normalizeMidpointTarget,
  resolveMidpointNatalPlanetTargets,
  resolveMidpointTargets,
  resolveMidpointTargetsForProfile,
  validateMidpointPair,
  validateMidpointTarget,
} from '../src/midpointTargets.js';
import {
  SYNTHETIC_MIDPOINT_NATAL_PLANETS_RESULT,
  getMidpointTargetsFixture,
} from './fixtures/midpointTargetsFixtures.js';

const READY_PROFILE = Object.freeze({
  id: 'midpoint-target-profile',
  name: 'Анна',
  birthDate: '1990-01-01',
  birthTime: '12:00',
  birthTimeAccuracy: 'exact',
  birthPlace: {
    city: 'Москва',
    country: 'Россия',
    latitude: null,
    longitude: null,
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
    'birthplace',
    'utcdatetime',
    'timezone',
    'coordinates',
    'latitude',
    'profilejson',
    'providerpayload',
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

test('MIDPOINT_TARGET_KEYS and policy define natal planets only', () => {
  assert.deepEqual(MIDPOINT_TARGET_KEYS, [
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
  ]);
  assert.equal(MIDPOINT_TARGET_POLICY.sourceKey, 'midpoints-natal-planets-only');
  assert.equal(MIDPOINT_TARGET_POLICY.activeTargetSet, 'natal-planets');
  assert.equal(MIDPOINT_TARGET_POLICY.expectedTargetCount, 10);
  assert.equal(MIDPOINT_TARGET_POLICY.expectedPairCount, 45);
  assert.equal(MIDPOINT_TARGET_POLICY.deferredTargetSets.includes('angles'), true);
  assert.equal(MIDPOINT_TARGET_POLICY.deferredTargetSets.includes('fixed-stars'), true);
});

test('normalizeMidpointTarget normalizes valid planet target and rejects inactive targets', () => {
  const target = normalizeMidpointTarget({
    key: 'venus',
    label: 'Венера',
    longitude: 460,
  });

  assert.equal(target.key, 'venus');
  assert.equal(target.label, 'Венера');
  assert.equal(target.labelEn, 'Venus');
  assert.equal(target.category, 'natal-planet');
  assert.equal(target.targetSet, 'natal-planets');
  assert.equal(target.longitude, 100);
  assert.equal(target.sign.key, 'cancer');
  assert.equal(target.degree, 10);
  assert.equal(target.minutes, 0);
  assert.equal(target.seconds, 0);
  assert.equal(target.text, 'Венера — Рак 10°00′00″');
  assert.equal(target.source, 'natal-planets');

  assert.equal(normalizeMidpointTarget({ key: 'asc', label: 'ASC', longitude: 10 }), null);
  assert.equal(normalizeMidpointTarget({ key: 'unknown', longitude: 10 }), null);
  assert.equal(normalizeMidpointTarget({ key: 'sun' }), null);
});

test('resolveMidpointNatalPlanetTargets returns 10 canonical targets', () => {
  const fixture = getMidpointTargetsFixture('natal-planets-ready');
  const result = resolveMidpointNatalPlanetTargets(fixture.input.natalPlanetsResult);

  assert.equal(result.status, fixture.expected.status);
  assert.equal(result.ready, true);
  assert.equal(result.targetSet, fixture.expected.targetSet);
  assert.equal(result.count, fixture.expected.count);
  assert.deepEqual(result.targets.map((target) => target.key), fixture.expected.order);
  assert.equal(result.targets.every((target) => target.category === 'natal-planet'), true);
  assertNoPrivateOrInterpretiveText(result);
});

test('buildMidpointTargetPairs returns 45 deterministic pair definitions without midpoint longitude', () => {
  const targetsResult = resolveMidpointNatalPlanetTargets(SYNTHETIC_MIDPOINT_NATAL_PLANETS_RESULT);
  const result = buildMidpointTargetPairs(targetsResult.targets);

  assert.equal(result.status, 'ready');
  assert.equal(result.ready, true);
  assert.equal(result.targetCount, 10);
  assert.equal(result.pairCount, 45);
  assert.equal(result.pairs[0].key, 'sun-moon');
  assert.equal(result.pairs[1].key, 'sun-mercury');
  assert.equal(result.pairs.at(-1).key, 'neptune-pluto');
  assert.equal(result.pairs.every((pair) => pair.pointAKey !== pair.pointBKey), true);
  assert.equal(new Set(result.pairs.map((pair) => pair.key)).size, 45);
  assert.equal(result.pairs.some((pair) => pair.key === 'moon-sun'), false);
  assert.equal(result.pairs.some((pair) => 'longitude' in pair), false);
  assert.equal(result.pairs.some((pair) => 'midpointLongitude' in pair), false);
  assert.equal(result.pairs.every((pair) => pair.calculationStatus === 'pendingMidpointEngine'), true);
  assertNoPrivateOrInterpretiveText(result);
});

test('resolveMidpointTargets returns targets pairs and deferred metadata only', () => {
  const fixture = getMidpointTargetsFixture('deferred-targets-metadata-only');
  const result = resolveMidpointTargets({
    natalPlanetsResult: SYNTHETIC_MIDPOINT_NATAL_PLANETS_RESULT,
  });
  const targetKeys = result.targets.map((target) => target.key);

  assert.equal(result.status, 'ready');
  assert.equal(result.ready, true);
  assert.equal(result.targetCount, 10);
  assert.equal(result.pairCount, 45);
  assert.deepEqual(result.deferredTargetSets, fixture.expected.deferredTargetSets);

  for (const targetSet of fixture.expected.deferredTargetSets) {
    assert.equal(targetKeys.includes(targetSet), false, `${targetSet} must not be active target`);
  }

  assertNoPrivateOrInterpretiveText(result);
});

test('notReady states are safe for missing profile and incomplete natal planets', () => {
  const noProfile = resolveMidpointTargetsForProfile(null);
  const unknownTime = resolveMidpointTargetsForProfile({
    ...READY_PROFILE,
    birthTime: '',
    birthTimeAccuracy: 'unknown',
  });
  const notReady = resolveMidpointTargets({
    natalPlanetsResult: Object.freeze({ status: 'incomplete', planets: [] }),
  });

  assert.equal(noProfile.status, 'notReady');
  assert.equal(noProfile.ready, false);
  assert.equal(unknownTime.status, 'notReady');
  assert.equal(unknownTime.ready, false);
  assert.equal(notReady.status, 'notReady');
  assert.equal(notReady.ready, false);
  assert.deepEqual(notReady.targets, []);
  assert.deepEqual(notReady.pairs, []);
  assertNoPrivateOrInterpretiveText(noProfile);
  assertNoPrivateOrInterpretiveText(unknownTime);
  assertNoPrivateOrInterpretiveText(notReady);
});

test('profile helper returns ready for exact birth time and does not require coordinates', () => {
  const result = resolveMidpointTargetsForProfile(READY_PROFILE);

  assert.equal(result.status, 'ready');
  assert.equal(result.ready, true);
  assert.equal(result.targetCount, 10);
  assert.equal(result.pairCount, 45);
  assertNoPrivateOrInterpretiveText(result);
});

test('lookup validation summary capabilities and limitations are safe', () => {
  const result = resolveMidpointTargets({
    natalPlanetsResult: SYNTHETIC_MIDPOINT_NATAL_PLANETS_RESULT,
  });
  const validTarget = getMidpointTargetByKey(result, 'venus');
  const validPair = getMidpointPairByKey(result, 'sun-moon');
  const invalidPair = {
    ...validPair,
    longitude: 12,
  };
  const readySummary = getMidpointTargetSummary(result);
  const fallbackSummary = getMidpointTargetSummary(null);
  const capabilities = getMidpointTargetCapabilities();
  const limitations = getMidpointTargetLimitations();

  assert.equal(validTarget.key, 'venus');
  assert.equal(getMidpointTargetByKey(result, 'asc'), null);
  assert.equal(validPair.key, 'sun-moon');
  assert.equal(getMidpointPairByKey(result, 'moon-sun'), null);
  assert.equal(validateMidpointTarget(validTarget).valid, true);
  assert.equal(validateMidpointTarget({ key: 'asc', longitude: 1 }).valid, false);
  assert.equal(validateMidpointPair(validPair).valid, true);
  assert.equal(validateMidpointPair(invalidPair).valid, false);
  assert.equal(readySummary.text, '10 целей и 45 пар для срединных точек готовы');
  assert.equal(fallbackSummary.text, 'Цели для срединных точек недоступны');
  assert.equal(capabilities.midpointTargets, true);
  assert.equal(capabilities.midpointEngine, false);
  assert.equal(capabilities.antisciaEngine, false);
  assert.equal(capabilities.ui, false);
  assert.equal(capabilities.debug, false);
  assert.equal(capabilities.interpretations, false);
  assert.equal(limitations.some((item) => item.includes('не рассчитывает сами срединные точки')), true);
  assertNoPrivateOrInterpretiveText({
    readySummary,
    fallbackSummary,
    capabilities,
    limitations,
  });
});

test('module strict exclusions are preserved', () => {
  const source = readFileSync(new URL('../src/midpointTargets.js', import.meta.url), 'utf8');

  assert.equal(source.includes('swisseph'), false);
  assert.equal(source.includes('astronomy-engine'), false);
  assert.equal(source.includes('localStorage'), false);
  assert.equal(source.includes('document.'), false);
  assert.equal(source.includes('window.'), false);
  assert.equal(source.includes('calculateAscMc'), false);
  assert.equal(source.includes('calculateFixedStar'), false);
  assert.equal(source.includes('delta = ((B - A + 540)'), false);
  assert.equal(source.includes('candidateA'), false);
  assert.equal(source.includes('antiscionLongitude'), false);
  assert.equal(existsSync(new URL('../src/midpoints.js', import.meta.url)), false);
  assert.equal(existsSync(new URL('../src/antiscia.js', import.meta.url)), false);
  assert.equal(existsSync(new URL('../src/midpointsAntiscia.js', import.meta.url)), false);
});
