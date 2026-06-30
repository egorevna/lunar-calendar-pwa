import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

import {
  MIDPOINT_TARGET_KEYS,
  MIDPOINT_TARGET_POLICY,
  resolveMidpointTargets,
} from '../src/midpointTargets.js';
import {
  MIDPOINT_ENGINE_POLICY,
  calculateMidpointsFromTargets,
  calculateShortestArcMidpoint,
  getMidpointByKey,
  getMidpointEngineCapabilities,
  getMidpointEngineLimitations,
} from '../src/midpoints.js';
import {
  MIDPOINTS_VALIDATION_FIXTURES,
  SYNTHETIC_MIDPOINT_VALIDATION_NO_OPPOSITION_RESULT,
  getMidpointsValidationFixture,
  getMidpointsValidationFixtureCategories,
  getMidpointsValidationFixtureIds,
} from './fixtures/midpointsValidationFixtures.js';

const REQUIRED_CATEGORIES = [
  'sourcePolicy',
  'targetScope',
  'pairDefinitions',
  'midpointFormula',
  'wrapAround',
  'exactOpposition',
  'batchNoOpposition',
  'batchWithOpposition',
  'deferredScopes',
  'privacy',
  'strictExclusions',
];

function assertNoPrivateOrInterpretiveText(value) {
  const text = JSON.stringify(value).toLowerCase();

  for (const forbidden of [
    'birthdate',
    'birthtime',
    'utcdatetime',
    'birthtimezone',
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

test('validation fixtures exist and expose required categories', () => {
  assert.equal(Array.isArray(MIDPOINTS_VALIDATION_FIXTURES), true);
  assert.equal(MIDPOINTS_VALIDATION_FIXTURES.length >= REQUIRED_CATEGORIES.length, true);
  assert.equal(new Set(getMidpointsValidationFixtureIds()).size, getMidpointsValidationFixtureIds().length);

  const categories = getMidpointsValidationFixtureCategories();

  for (const category of REQUIRED_CATEGORIES) {
    assert.equal(categories.includes(category), true, `missing category ${category}`);
  }

  assert.equal(getMidpointsValidationFixture('source-policy')?.id, 'source-policy');
  assert.equal(getMidpointsValidationFixture('unknown'), null);
});

test('source and target policy stay scoped to natal-planet midpoints', () => {
  const fixture = getMidpointsValidationFixture('target-scope');

  assert.equal(MIDPOINT_ENGINE_POLICY.sourceKey, 'midpoint-shortest-arc');
  assert.equal(MIDPOINT_ENGINE_POLICY.formula, 'shortest-arc-midpoint');
  assert.equal(MIDPOINT_ENGINE_POLICY.coordinateSystem, 'tropical-ecliptic-longitude');
  assert.equal(MIDPOINT_TARGET_POLICY.activeTargetSet, 'natal-planets');
  assert.deepEqual(MIDPOINT_TARGET_KEYS, fixture.expected.activeTargetKeys);
  assert.equal(MIDPOINT_TARGET_KEYS.length, fixture.expected.activeTargetCount);

  for (const targetSet of fixture.expected.deferredTargetSets) {
    assert.equal(MIDPOINT_TARGET_POLICY.deferredTargetSets.includes(targetSet), true);
  }
});

test('ready target output excludes deferred midpoint target sets', () => {
  const fixture = getMidpointsValidationFixture('deferred-scopes');
  const targetsResult = resolveMidpointTargets({
    natalPlanetsResult: SYNTHETIC_MIDPOINT_VALIDATION_NO_OPPOSITION_RESULT,
  });
  const readyTargetKeys = targetsResult.targets.map((target) => target.key);

  assert.equal(targetsResult.status, 'ready');
  assert.equal(targetsResult.targetCount, 10);
  assert.equal(targetsResult.pairCount, 45);

  for (const key of fixture.expected.notActiveTargetKeys) {
    assert.equal(readyTargetKeys.includes(key), false, `${key} must stay deferred`);
  }

  assertNoPrivateOrInterpretiveText(targetsResult);
});

test('pair definitions are 45 deterministic unordered safe pairs', () => {
  const fixture = getMidpointsValidationFixture('pair-definitions');
  const targetsResult = resolveMidpointTargets({
    natalPlanetsResult: SYNTHETIC_MIDPOINT_VALIDATION_NO_OPPOSITION_RESULT,
  });
  const pairKeys = targetsResult.pairs.map((pair) => pair.key);

  assert.equal(targetsResult.pairCount, fixture.expected.pairCount);
  assert.equal(pairKeys[0], fixture.expected.firstPair);
  assert.equal(pairKeys[1], fixture.expected.secondPair);
  assert.equal(pairKeys.at(-1), fixture.expected.lastPair);
  assert.equal(new Set(pairKeys).size, fixture.expected.pairCount);
  assert.equal(targetsResult.pairs.every((pair) => pair.pointAKey !== pair.pointBKey), true);
  assert.equal(targetsResult.pairs.some((pair) => pairKeys.includes(`${pair.pointBKey}-${pair.pointAKey}`)), false);
  assert.equal(targetsResult.pairs.some((pair) => 'longitude' in pair), false);
  assert.equal(targetsResult.pairs.some((pair) => 'midpointLongitude' in pair), false);
  assert.equal(targetsResult.pairs.some((pair) => 'midpoint' in pair), false);
  assert.equal(targetsResult.pairs.some((pair) => 'pointA' in pair || 'pointB' in pair), false);
  assertNoPrivateOrInterpretiveText(targetsResult.pairs);
});

test('shortest-arc midpoint formula and wrap-around cases match policy', () => {
  const fixture = getMidpointsValidationFixture('formula-cases');

  for (const item of fixture.expected.cases) {
    const result = calculateShortestArcMidpoint(item.longitudeA, item.longitudeB);

    assert.equal(result.status, 'ready');
    assert.equal(result.longitude, item.midpoint);
    assert.equal(result.longitude >= 0 && result.longitude < 360, true);
    assert.equal(Number.isNaN(result.longitude), false);
    assertNoPrivateOrInterpretiveText(result);
  }

  const invalid = calculateShortestArcMidpoint(Number.NaN, 10);

  assert.equal(invalid.status, 'invalid');
  assert.equal(invalid.ready, false);
  assert.equal(invalid.longitude, null);
});

test('exact opposition returns ambiguous axis without primary longitude', () => {
  const fixture = getMidpointsValidationFixture('exact-opposition');

  for (const item of fixture.expected.cases) {
    const result = calculateShortestArcMidpoint(item.longitudeA, item.longitudeB);

    assert.equal(result.status, 'axisAmbiguous');
    assert.equal(result.ready, false);
    assert.equal(result.exactOpposition, true);
    assert.equal(result.midpointAxisAmbiguous, true);
    assert.equal(result.longitude, null);
    assert.deepEqual(result.candidateAxisPoints, item.candidateAxisPoints);
    assert.equal(result.candidateAxisPoints.every((longitude) => longitude >= 0 && longitude < 360), true);
    assertNoPrivateOrInterpretiveText(result);
  }
});

test('batch without exact oppositions returns 45 ready normalized midpoints', () => {
  const fixture = getMidpointsValidationFixture('batch-no-opposition');
  const targetsResult = resolveMidpointTargets({
    natalPlanetsResult: fixture.input.natalPlanetsResult,
  });
  const result = calculateMidpointsFromTargets(targetsResult);

  assert.equal(result.status, 'ready');
  assert.equal(result.targetCount, fixture.expected.targetCount);
  assert.equal(result.pairCount, fixture.expected.pairCount);
  assert.equal(result.readyCount, fixture.expected.readyCount);
  assert.equal(result.ambiguousCount, 0);
  assert.equal(result.midpoints[0].key, fixture.expected.firstKey);
  assert.equal(result.midpoints[0].longitude, fixture.expected.firstLongitude);
  assert.equal(result.midpoints.at(-1).key, fixture.expected.lastKey);
  assert.equal(result.midpoints.at(-1).longitude, fixture.expected.lastLongitude);
  assert.equal(result.midpoints.every((midpoint) => (
    midpoint.status === 'ready'
    && Number.isFinite(midpoint.longitude)
    && midpoint.longitude >= 0
    && midpoint.longitude < 360
  )), true);
  assertNoPrivateOrInterpretiveText(result);
});

test('batch with exact oppositions returns partial and preserves ambiguous pairs', () => {
  const fixture = getMidpointsValidationFixture('batch-with-opposition');
  const targetsResult = resolveMidpointTargets({
    natalPlanetsResult: fixture.input.natalPlanetsResult,
  });
  const result = calculateMidpointsFromTargets(targetsResult);
  const sunSaturn = getMidpointByKey(result, 'sun-saturn');

  assert.equal(result.status, fixture.expected.status);
  assert.equal(result.pairCount, fixture.expected.pairCount);
  assert.equal(result.readyCount, fixture.expected.readyCount);
  assert.equal(result.ambiguousCount, fixture.expected.ambiguousCount);
  assert.deepEqual(
    result.midpoints.filter((midpoint) => midpoint.status === 'axisAmbiguous').map((midpoint) => midpoint.key),
    fixture.expected.ambiguousKeys,
  );
  assert.equal(sunSaturn.longitude, null);
  assert.equal(sunSaturn.midpointAxisAmbiguous, true);
  assertNoPrivateOrInterpretiveText(result);
});

test('deferred scope capabilities and limitations stay inactive and non-interpretive', () => {
  const capabilities = getMidpointEngineCapabilities();
  const limitations = getMidpointEngineLimitations();

  assert.equal(capabilities.midpointContacts, false);
  assert.equal(capabilities.antiscia, false);
  assert.equal(capabilities.contraAntiscia, false);
  assert.equal(capabilities.display, false);
  assert.equal(capabilities.ui, false);
  assert.equal(capabilities.debug, false);
  assert.equal(capabilities.interpretations, false);
  assert.equal(capabilities.transits, false);
  assert.equal(limitations.some((item) => item.includes('midpoint contacts')), true);
  assert.equal(limitations.some((item) => item.includes('Интерпретации не добавлены')), true);
  assertNoPrivateOrInterpretiveText({ capabilities, limitations });
});

test('midpoint modules keep runtime and file-boundary strict exclusions', () => {
  const targetSource = readFileSync(new URL('../src/midpointTargets.js', import.meta.url), 'utf8');
  const engineSource = readFileSync(new URL('../src/midpoints.js', import.meta.url), 'utf8');
  const combinedSource = `${targetSource}\n${engineSource}`;

  for (const forbidden of [
    'swisseph',
    'astronomy-engine',
    'localStorage',
    'document.',
    'window.',
    'planetaryProvider',
    'calculateFixedStar',
    'calculateAscMc',
    'antiscionLongitude = normalize',
    'contraAntiscionLongitude = normalize',
    'midpointContacts: true',
  ]) {
    assert.equal(combinedSource.includes(forbidden), false, `module source should not include ${forbidden}`);
  }

  assert.equal(existsSync(new URL('../src/antiscia.js', import.meta.url)), false);
  assert.equal(existsSync(new URL('../src/midpointsAntiscia.js', import.meta.url)), false);
});
