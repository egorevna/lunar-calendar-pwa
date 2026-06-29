import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

import {
  MIDPOINT_ENGINE_POLICY,
  calculateMidpointForPair,
  calculateMidpointsForProfile,
  calculateMidpointsFromTargets,
  calculateShortestArcDelta,
  calculateShortestArcMidpoint,
  getMidpointByKey,
  getMidpointEngineCapabilities,
  getMidpointEngineLimitations,
  getMidpointSummary,
  validateMidpointResult,
} from '../src/midpoints.js';
import { resolveMidpointTargets } from '../src/midpointTargets.js';
import {
  MIDPOINT_BATCH_NATAL_PLANETS_RESULT,
  getMidpointsFixture,
} from './fixtures/midpointsFixtures.js';

const READY_PROFILE = Object.freeze({
  id: 'midpoint-engine-profile',
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

test('MIDPOINT_ENGINE_POLICY exists and keeps scope narrow', () => {
  assert.equal(MIDPOINT_ENGINE_POLICY.sourceKey, 'midpoint-shortest-arc');
  assert.equal(MIDPOINT_ENGINE_POLICY.formula, 'shortest-arc-midpoint');
  assert.equal(MIDPOINT_ENGINE_POLICY.coordinateSystem, 'tropical-ecliptic-longitude');
  assert.equal(MIDPOINT_ENGINE_POLICY.exactOppositionPolicy, 'axis-ambiguous');
  assert.equal(MIDPOINT_ENGINE_POLICY.midpointAxisOutput, 'deferred');
  assert.equal(MIDPOINT_ENGINE_POLICY.contacts, false);
  assert.equal(MIDPOINT_ENGINE_POLICY.interpretations, false);
});

test('calculateShortestArcDelta handles normal and wrap-around cases', () => {
  const normal = calculateShortestArcDelta(10, 30);
  const wrapForward = calculateShortestArcDelta(350, 10);
  const wrapBackward = calculateShortestArcDelta(10, 350);

  assert.equal(normal.status, 'ready');
  assert.equal(normal.delta, 20);
  assert.equal(normal.distance, 20);
  assert.equal(normal.normalizedA, 10);
  assert.equal(normal.normalizedB, 30);
  assert.equal(normal.exactOpposition, false);

  assert.equal(wrapForward.delta, 20);
  assert.equal(wrapForward.distance, 20);
  assert.equal(wrapForward.normalizedA, 350);
  assert.equal(wrapForward.normalizedB, 10);

  assert.equal(wrapBackward.delta, -20);
  assert.equal(wrapBackward.distance, 20);
});

test('calculateShortestArcMidpoint matches simple and wrap-around fixtures', () => {
  for (const id of ['simple-10-30', 'simple-30-10', 'wrap-350-10', 'wrap-10-350', 'wrap-359-1']) {
    const fixture = getMidpointsFixture(id);
    const result = calculateShortestArcMidpoint(fixture.input.longitudeA, fixture.input.longitudeB);

    assert.equal(result.status, fixture.expected.status);
    assert.equal(result.ready, true);
    assert.equal(result.longitude, fixture.expected.longitude);
    assert.equal(result.distance, fixture.expected.distance);
    assert.equal(result.delta, fixture.expected.delta);
    assert.equal(result.exactOpposition, false);
    assert.equal(result.midpointAxisAmbiguous, false);
    assert.equal(result.sourcePolicy, 'midpoint-shortest-arc');
    assertNoPrivateOrInterpretiveText(result);
  }
});

test('exact opposition returns axisAmbiguous without primary longitude', () => {
  for (const id of ['opposition-90-270', 'opposition-0-180']) {
    const fixture = getMidpointsFixture(id);
    const delta = calculateShortestArcDelta(fixture.input.longitudeA, fixture.input.longitudeB);
    const midpoint = calculateShortestArcMidpoint(fixture.input.longitudeA, fixture.input.longitudeB);

    assert.equal(delta.status, 'axisAmbiguous');
    assert.equal(delta.ready, false);
    assert.equal(delta.distance, 180);
    assert.equal(delta.exactOpposition, true);
    assert.equal(delta.midpointAxisAmbiguous, true);

    assert.equal(midpoint.status, 'axisAmbiguous');
    assert.equal(midpoint.ready, false);
    assert.equal(midpoint.longitude, null);
    assert.equal(midpoint.exactOpposition, true);
    assert.equal(midpoint.midpointAxisAmbiguous, true);
    assert.deepEqual(midpoint.candidateAxisPoints, fixture.expected.candidateAxisPoints);
    assert.equal(midpoint.reason, 'exactOppositionMidpointAxisAmbiguous');
    assertNoPrivateOrInterpretiveText(midpoint);
  }
});

test('invalid longitude fails safely', () => {
  const fixture = getMidpointsFixture('invalid-longitude');
  const delta = calculateShortestArcDelta(fixture.input.longitudeA, fixture.input.longitudeB);
  const midpoint = calculateShortestArcMidpoint(fixture.input.longitudeA, fixture.input.longitudeB);

  assert.equal(delta.status, fixture.expected.status);
  assert.equal(delta.ready, false);
  assert.equal(delta.reason, fixture.expected.reason);
  assert.equal(midpoint.status, fixture.expected.status);
  assert.equal(midpoint.ready, false);
  assert.equal(midpoint.reason, fixture.expected.reason);
  assertNoPrivateOrInterpretiveText({ delta, midpoint });
});

test('calculateMidpointForPair returns safe ready midpoint metadata', () => {
  const targetsResult = resolveMidpointTargets({
    natalPlanetsResult: MIDPOINT_BATCH_NATAL_PLANETS_RESULT,
  });
  const result = calculateMidpointForPair(targetsResult.pairs[0], targetsResult.targets);

  assert.equal(result.status, 'ready');
  assert.equal(result.ready, true);
  assert.equal(result.type, 'midpoint');
  assert.equal(result.key, 'sun-moon');
  assert.equal(result.pointAKey, 'sun');
  assert.equal(result.pointBKey, 'moon');
  assert.equal(result.pointALabel, 'Солнце');
  assert.equal(result.pointBLabel, 'Луна');
  assert.equal(result.label, 'Солнце / Луна');
  assert.equal(result.longitude, 26.5);
  assert.equal(result.sign.key, 'aries');
  assert.equal(result.degree, 26);
  assert.equal(result.minutes, 30);
  assert.equal(result.seconds, 0);
  assert.equal(result.text, 'Солнце / Луна — Овен 26°30′00″');
  assert.equal(result.sourcePolicy, 'midpoint-shortest-arc');
  assert.equal(result.exactOpposition, false);
  assert.equal(result.midpointAxisAmbiguous, false);
  assert.equal('pointA' in result, false);
  assert.equal('pointB' in result, false);
  assertNoPrivateOrInterpretiveText(result);
});

test('calculateMidpointForPair preserves axis ambiguity for exact opposition', () => {
  const targetsResult = resolveMidpointTargets({
    natalPlanetsResult: getMidpointsFixture('batch-with-opposition').input.natalPlanetsResult,
  });
  const pair = targetsResult.pairs.find((item) => item.key === 'sun-saturn');
  const result = calculateMidpointForPair(pair, targetsResult.targets);

  assert.equal(result.status, 'axisAmbiguous');
  assert.equal(result.ready, false);
  assert.equal(result.key, 'sun-saturn');
  assert.equal(result.longitude, null);
  assert.deepEqual(result.candidateAxisPoints, [100, 280]);
  assert.equal(result.text, null);
  assertNoPrivateOrInterpretiveText(result);
});

test('calculateMidpointsFromTargets returns 45 midpoint results preserving pair order', () => {
  const fixture = getMidpointsFixture('batch-no-oppositions');
  const targetsResult = resolveMidpointTargets({
    natalPlanetsResult: fixture.input.natalPlanetsResult,
  });
  const result = calculateMidpointsFromTargets(targetsResult);

  assert.equal(result.status, fixture.expected.status);
  assert.equal(result.ready, true);
  assert.equal(result.targetCount, fixture.expected.targetCount);
  assert.equal(result.pairCount, fixture.expected.pairCount);
  assert.equal(result.readyCount, fixture.expected.readyCount);
  assert.equal(result.ambiguousCount, fixture.expected.ambiguousCount);
  assert.equal(result.invalidCount, fixture.expected.invalidCount);
  assert.equal(result.midpoints.length, 45);
  assert.equal(result.midpoints[0].key, fixture.expected.firstKey);
  assert.equal(result.midpoints[0].longitude, fixture.expected.firstLongitude);
  assert.equal(result.midpoints[1].key, fixture.expected.secondKey);
  assert.equal(result.midpoints[1].longitude, fixture.expected.secondLongitude);
  assert.equal(result.midpoints.at(-1).key, fixture.expected.lastKey);
  assert.equal(result.midpoints.at(-1).longitude, fixture.expected.lastLongitude);
  assertNoPrivateOrInterpretiveText(result);
});

test('calculateMidpointsFromTargets returns partial when exact-opposition pairs are present', () => {
  const fixture = getMidpointsFixture('batch-with-opposition');
  const targetsResult = resolveMidpointTargets({
    natalPlanetsResult: fixture.input.natalPlanetsResult,
  });
  const result = calculateMidpointsFromTargets(targetsResult);

  assert.equal(result.status, fixture.expected.status);
  assert.equal(result.ready, true);
  assert.equal(result.targetCount, fixture.expected.targetCount);
  assert.equal(result.pairCount, fixture.expected.pairCount);
  assert.equal(result.readyCount, fixture.expected.readyCount);
  assert.equal(result.ambiguousCount, fixture.expected.ambiguousCount);
  assert.equal(result.invalidCount, fixture.expected.invalidCount);
  assert.deepEqual(
    result.midpoints.filter((item) => item.status === 'axisAmbiguous').map((item) => item.key),
    fixture.expected.ambiguousKeys,
  );
  assertNoPrivateOrInterpretiveText(result);
});

test('notReady targets fail safely', () => {
  const result = calculateMidpointsFromTargets({
    status: 'notReady',
    ready: false,
    targets: [],
    pairs: [],
  });

  assert.equal(result.status, 'notReady');
  assert.equal(result.ready, false);
  assert.equal(result.reason, 'midpointTargetsNotReady');
  assert.equal(result.targetCount, 0);
  assert.equal(result.pairCount, 0);
  assert.deepEqual(result.midpoints, []);
  assertNoPrivateOrInterpretiveText(result);
});

test('profile helper returns safe fallback and ready injected path without mutating input', () => {
  const profile = structuredClone(READY_PROFILE);
  const before = JSON.stringify(profile);
  const noProfile = calculateMidpointsForProfile(null);
  const unknownTime = calculateMidpointsForProfile({
    ...READY_PROFILE,
    birthTime: '',
    birthTimeAccuracy: 'unknown',
  });
  const ready = calculateMidpointsForProfile(profile, {
    targetsResult: resolveMidpointTargets({
      natalPlanetsResult: MIDPOINT_BATCH_NATAL_PLANETS_RESULT,
    }),
  });

  assert.equal(noProfile.status, 'notReady');
  assert.equal(unknownTime.status, 'notReady');
  assert.equal(ready.status, 'ready');
  assert.equal(ready.pairCount, 45);
  assert.equal(JSON.stringify(profile), before);
  assertNoPrivateOrInterpretiveText({ noProfile, unknownTime, ready });
});

test('lookup validation summary capabilities and limitations are safe', () => {
  const targetsResult = resolveMidpointTargets({
    natalPlanetsResult: MIDPOINT_BATCH_NATAL_PLANETS_RESULT,
  });
  const result = calculateMidpointsFromTargets(targetsResult);
  const readyMidpoint = getMidpointByKey(result, 'sun-moon');
  const ambiguousResult = calculateMidpointsFromTargets(resolveMidpointTargets({
    natalPlanetsResult: getMidpointsFixture('batch-with-opposition').input.natalPlanetsResult,
  }));
  const ambiguousMidpoint = getMidpointByKey(ambiguousResult, 'sun-saturn');
  const readySummary = getMidpointSummary(result);
  const partialSummary = getMidpointSummary(ambiguousResult);
  const fallbackSummary = getMidpointSummary(null);
  const capabilities = getMidpointEngineCapabilities();
  const limitations = getMidpointEngineLimitations();

  assert.equal(readyMidpoint.key, 'sun-moon');
  assert.equal(getMidpointByKey(result, 'moon-sun'), null);
  assert.equal(validateMidpointResult(readyMidpoint).valid, true);
  assert.equal(validateMidpointResult(ambiguousMidpoint).valid, true);
  assert.equal(validateMidpointResult({ ...readyMidpoint, longitude: Number.NaN }).valid, false);
  assert.equal(readySummary.text, '45 срединных точек рассчитаны');
  assert.equal(partialSummary.text, '41 срединная точка рассчитана, 4 пары имеют неоднозначную ось');
  assert.equal(fallbackSummary.text, 'Срединные точки недоступны');
  assert.equal(capabilities.midpoints, true);
  assert.equal(capabilities.shortestArcMidpoint, true);
  assert.equal(capabilities.exactOppositionAmbiguity, true);
  assert.equal(capabilities.midpointAxis, false);
  assert.equal(capabilities.midpointContacts, false);
  assert.equal(capabilities.antiscia, false);
  assert.equal(capabilities.contraAntiscia, false);
  assert.equal(capabilities.display, false);
  assert.equal(capabilities.ui, false);
  assert.equal(capabilities.debug, false);
  assert.equal(capabilities.interpretations, false);
  assert.equal(limitations.some((item) => item.includes('midpoint contacts')), true);
  assertNoPrivateOrInterpretiveText({
    readySummary,
    partialSummary,
    fallbackSummary,
    capabilities,
    limitations,
  });
});

test('module strict exclusions are preserved', () => {
  const source = readFileSync(new URL('../src/midpoints.js', import.meta.url), 'utf8');

  assert.equal(source.includes('swisseph'), false);
  assert.equal(source.includes('astronomy-engine'), false);
  assert.equal(source.includes('localStorage'), false);
  assert.equal(source.includes('document.'), false);
  assert.equal(source.includes('window.'), false);
  assert.equal(source.includes('calculateAscMc'), false);
  assert.equal(source.includes('calculateFixedStar'), false);
  assert.equal(source.includes('antiscionLongitude = normalize'), false);
  assert.equal(source.includes('contraAntiscionLongitude = normalize'), false);
  assert.equal(source.includes('midpointContacts: true'), false);
  assert.equal(existsSync(new URL('../src/antiscia.js', import.meta.url)), false);
  assert.equal(existsSync(new URL('../src/midpointsAntiscia.js', import.meta.url)), false);
});
