import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

import {
  calculateFixedStarAngularDistance,
  calculateFixedStarConjunctionHit,
  calculateFixedStarConjunctions,
  calculateFixedStarConjunctionsForProfile,
  getFixedStarConjunctionByKey,
  getFixedStarConjunctionCapabilities,
  getFixedStarConjunctionLimitations,
  getFixedStarConjunctionOrbPolicy,
  getFixedStarConjunctionSummary,
  isFixedStarConjunction,
} from '../src/fixedStarConjunctions.js';
import {
  getFixedStarConjunctionFixture,
  SYNTHETIC_FIXED_STAR_POSITIONS_RESULT,
  SYNTHETIC_FIXED_STAR_TARGETS_RESULT,
} from './fixtures/fixedStarConjunctionFixtures.js';

const EPSILON = 1e-9;

const READY_PROFILE = Object.freeze({
  id: 'fixed-star-conjunction-profile',
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

function assertApprox(actual, expected, tolerance = EPSILON) {
  assert.equal(Number.isFinite(actual), true);
  assert.equal(
    Math.abs(actual - expected) <= tolerance,
    true,
    `expected ${actual} to be within ${tolerance} of ${expected}`,
  );
}

function assertNoPrivateOrInterpretiveText(value) {
  const text = JSON.stringify(value).toLowerCase();

  for (const forbidden of [
    'birthdate',
    'birthtime',
    'birthplace',
    'utcdatetime',
    'profilecoordinates',
    'birthcoordinates',
    'fullprofile',
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

test('orb policy returns global one-degree conjunction policy', () => {
  assert.deepEqual(getFixedStarConjunctionOrbPolicy(), {
    key: 'fixed-stars-global-conjunction-orb-1deg',
    relationship: 'conjunction',
    orbDegrees: 1,
    inclusiveBoundary: true,
    perStarOverrides: false,
    perTargetOverrides: false,
  });
});

test('angular distance handles exact normal and wrap-around cases', () => {
  assert.deepEqual(calculateFixedStarAngularDistance(150, 150), {
    status: 'ready',
    distanceDegrees: 0,
    distanceText: '0°00′00″',
  });

  const normal = calculateFixedStarAngularDistance(150, 150.5);
  const wrap = calculateFixedStarAngularDistance(359.8, 0.1);

  assert.equal(normal.status, 'ready');
  assertApprox(normal.distanceDegrees, 0.5);
  assert.equal(normal.distanceText, '0°30′00″');
  assert.equal(wrap.status, 'ready');
  assertApprox(wrap.distanceDegrees, 0.3);
  assert.equal(wrap.distanceText, '0°18′00″');
});

test('conjunction predicate includes exact and boundary and excludes outside orb', () => {
  const inside = isFixedStarConjunction(150, 150.5);
  const boundary = isFixedStarConjunction(150, 151);
  const outside = isFixedStarConjunction(150, 151.0001);

  assert.equal(inside.status, 'ready');
  assert.equal(inside.hit, true);
  assert.equal(inside.relationship, 'conjunction');
  assert.equal(inside.withinOrb, true);
  assert.equal(inside.boundary, false);
  assert.equal(boundary.hit, true);
  assert.equal(boundary.boundary, true);
  assert.equal(outside.hit, false);
  assert.equal(outside.withinOrb, false);
});

test('calculateFixedStarConjunctionHit returns safe hit output', () => {
  const fixture = getFixedStarConjunctionFixture('inside-orb');
  const hit = calculateFixedStarConjunctionHit(fixture.input.starPosition, fixture.input.target);

  assert.equal(hit.status, 'ready');
  assert.equal(hit.hit, true);
  assert.equal(hit.relationship, 'conjunction');
  assert.equal(hit.starKey, 'regulus');
  assert.equal(hit.starLabel, 'Регул');
  assert.equal(hit.starLabelEn, 'Regulus');
  assert.equal(hit.targetKey, 'asc');
  assert.equal(hit.targetLabel, 'ASC');
  assert.equal(hit.targetCategory, 'angle');
  assertApprox(hit.distanceDegrees, fixture.expected.distanceDegrees);
  assert.equal(hit.orbDegrees, 1);
  assert.equal(hit.orbText, fixture.expected.orbText);
  assert.equal(hit.text, 'Регул — соединение с ASC · орб 0°30′00″');
  assert.equal(hit.sourceSystem, 'fixed-stars-vronsky-table-18');
  assert.equal(hit.orbPolicyKey, 'fixed-stars-global-conjunction-orb-1deg');
  assert.equal(Object.hasOwn(hit, 'starPosition'), false);
  assert.equal(Object.hasOwn(hit, 'target'), false);
  assertNoPrivateOrInterpretiveText(hit);
});

test('single non-hit and invalid inputs fail safely', () => {
  const outside = getFixedStarConjunctionFixture('outside-orb');
  const invalid = getFixedStarConjunctionFixture('invalid-longitude');

  assert.deepEqual(calculateFixedStarConjunctionHit(outside.input.starPosition, outside.input.target), {
    status: 'notHit',
    hit: false,
    reason: 'outsideOrb',
  });
  assert.equal(calculateFixedStarConjunctionHit(invalid.input.starPosition, invalid.input.target).status, 'invalid');
});

test('calculateFixedStarConjunctions returns ready hits from positions and targets', () => {
  const result = calculateFixedStarConjunctions({
    positionsResult: SYNTHETIC_FIXED_STAR_POSITIONS_RESULT,
    targetsResult: SYNTHETIC_FIXED_STAR_TARGETS_RESULT,
  });

  assert.equal(result.status, 'ready');
  assert.equal(result.ready, true);
  assert.equal(result.relationship, 'conjunction');
  assert.equal(result.orbPolicyKey, 'fixed-stars-global-conjunction-orb-1deg');
  assert.equal(result.orbDegrees, 1);
  assert.equal(result.starCount, 3);
  assert.equal(result.targetCount, 3);
  assert.equal(result.hitCount, 3);
  assert.deepEqual(
    result.hits.map((hit) => [hit.starKey, hit.targetKey]),
    [
      ['spica', 'sun'],
      ['antares', 'moon'],
      ['regulus', 'asc'],
    ],
  );
});

test('noHits returns ready state with empty hit list', () => {
  const fixture = getFixedStarConjunctionFixture('ready-with-no-hits');
  const result = calculateFixedStarConjunctions(fixture.input);

  assert.equal(result.status, fixture.expected.status);
  assert.equal(result.ready, true);
  assert.equal(result.hitCount, 0);
  assert.deepEqual(result.hits, []);
  assert.equal(result.message, 'Соединений с неподвижными звездами в выбранном орбе не найдено.');
});

test('hits sort by orb then target order then star order', () => {
  const fixture = getFixedStarConjunctionFixture('sorting-by-distance');
  const result = calculateFixedStarConjunctions(fixture.input);

  assert.deepEqual(
    result.hits.map((hit) => [hit.starKey, hit.targetKey]),
    fixture.expected.order,
  );
});

test('partial targets still calculate available targets and preserve partial flag', () => {
  const fixture = getFixedStarConjunctionFixture('partial-targets');
  const result = calculateFixedStarConjunctions(fixture.input);

  assert.equal(result.status, fixture.expected.status);
  assert.equal(result.ready, true);
  assert.equal(result.partial, true);
  assert.equal(result.targetCount, fixture.expected.targetCount);
  assert.equal(result.hitCount, fixture.expected.hitCount);
  assert.deepEqual(result.targetSets, ['angles']);
});

test('notReady results are safe for missing positions or targets', () => {
  const noPositions = calculateFixedStarConjunctions({
    positionsResult: { status: 'notReady', ready: false, reason: 'invalidDate' },
    targetsResult: SYNTHETIC_FIXED_STAR_TARGETS_RESULT,
  });
  const noTargets = calculateFixedStarConjunctions({
    positionsResult: SYNTHETIC_FIXED_STAR_POSITIONS_RESULT,
    targetsResult: { status: 'notReady', ready: false, reason: 'fixedStarTargetsNotReady', targets: [] },
  });

  assert.equal(noPositions.status, 'notReady');
  assert.equal(noPositions.reason, 'fixedStarPositionsNotReady');
  assert.deepEqual(noPositions.hits, []);
  assert.equal(noTargets.status, 'notReady');
  assert.equal(noTargets.reason, 'fixedStarTargetsNotReady');
  assert.deepEqual(noTargets.hits, []);
});

test('profile helper returns safe fallback and does not mutate profile', () => {
  const noProfile = calculateFixedStarConjunctionsForProfile(null);
  const profile = JSON.parse(JSON.stringify(READY_PROFILE));
  const before = JSON.parse(JSON.stringify(profile));
  const result = calculateFixedStarConjunctionsForProfile(profile);

  assert.equal(noProfile.status, 'notReady');
  assert.equal(noProfile.ready, false);
  assert.equal(['ready', 'notReady'].includes(result.status), true);
  assert.deepEqual(profile, before);
  assertNoPrivateOrInterpretiveText(noProfile);
  assertNoPrivateOrInterpretiveText(result);
});

test('result contains conjunction relationship only', () => {
  const result = calculateFixedStarConjunctions({
    positionsResult: SYNTHETIC_FIXED_STAR_POSITIONS_RESULT,
    targetsResult: SYNTHETIC_FIXED_STAR_TARGETS_RESULT,
  });

  assert.equal(result.relationship, 'conjunction');
  assert.equal(result.hits.every((hit) => hit.relationship === 'conjunction'), true);
  assert.equal(JSON.stringify(result).includes('opposition'), false);
  assert.equal(JSON.stringify(result).includes('square'), false);
  assert.equal(JSON.stringify(result).includes('trine'), false);
  assert.equal(JSON.stringify(result).includes('sextile'), false);
});

test('lookup and summary helpers work for hits noHits and fallback', () => {
  const result = calculateFixedStarConjunctions({
    positionsResult: SYNTHETIC_FIXED_STAR_POSITIONS_RESULT,
    targetsResult: SYNTHETIC_FIXED_STAR_TARGETS_RESULT,
  });
  const noHits = calculateFixedStarConjunctions(getFixedStarConjunctionFixture('ready-with-no-hits').input);

  assert.equal(getFixedStarConjunctionByKey(result, 'regulus', 'asc')?.starKey, 'regulus');
  assert.equal(getFixedStarConjunctionByKey(result, 'regulus', 'moon'), null);
  assert.deepEqual(getFixedStarConjunctionSummary(result), {
    status: 'ready',
    hitCount: 3,
    starCount: 3,
    targetCount: 3,
    text: 'Найдено 3 соединения с неподвижными звездами',
  });
  assert.deepEqual(getFixedStarConjunctionSummary(noHits), {
    status: 'ready',
    hitCount: 0,
    starCount: 1,
    targetCount: 1,
    text: 'Соединений с неподвижными звездами не найдено',
  });
  assert.deepEqual(getFixedStarConjunctionSummary(null), {
    status: 'notReady',
    hitCount: 0,
    starCount: 0,
    targetCount: 0,
    text: 'Соединения с неподвижными звездами недоступны',
  });
});

test('capabilities and limitations keep conjunction engine scoped', () => {
  assert.deepEqual(getFixedStarConjunctionCapabilities(), {
    fixedStarConjunctions: true,
    conjunction: true,
    globalOrb: true,
    opposition: false,
    square: false,
    trine: false,
    sextile: false,
    paran: false,
    heliacal: false,
    interpretations: false,
    transits: false,
    ui: false,
    debug: false,
  });
  assert.equal(getFixedStarConjunctionLimitations().includes('Используется глобальный орб 1°00′.'), true);
  assert.equal(getFixedStarConjunctionLimitations().includes('Интерпретации не добавлены.'), true);
});

test('conjunction outputs contain no private data provider payload or interpretations', () => {
  assertNoPrivateOrInterpretiveText(calculateFixedStarConjunctions({
    positionsResult: SYNTHETIC_FIXED_STAR_POSITIONS_RESULT,
    targetsResult: SYNTHETIC_FIXED_STAR_TARGETS_RESULT,
  }));
  assertNoPrivateOrInterpretiveText(getFixedStarConjunctionLimitations());
});

test('module does not import provider swisseph astronomy-engine DOM storage UI debug or generic fixedStars engine', () => {
  const source = readFileSync(new URL('../src/fixedStarConjunctions.js', import.meta.url), 'utf8');

  for (const forbidden of [
    'from "swisseph"',
    "from 'swisseph'",
    'require("swisseph")',
    "require('swisseph')",
    'astronomy-engine',
    'astronomyEngineProvider',
    'planetaryProvider',
    'document.',
    'window.',
    'localStorage',
    'fixedStarsDisplay',
    'debugPanel',
    'renderFixedStars',
    'calculateOpposition',
    'calculateSquare',
    'calculateTrine',
    'calculateSextile',
  ]) {
    assert.equal(source.includes(forbidden), false, `module should not include ${forbidden}`);
  }
});

test('src/fixedStars.js is not created', () => {
  assert.equal(existsSync(new URL('../src/fixedStars.js', import.meta.url)), false);
});
