import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

import {
  buildFixedStarsDebugSnapshot,
  buildFixedStarsDebugSnapshotForProfile,
  formatFixedStarsDebugSnapshot,
  getFixedStarsDebugCapabilities,
  getFixedStarsDebugLimitations,
} from '../src/fixedStarsDebug.js';

const MODULE_SOURCE = () => readFileSync(new URL('../src/fixedStarsDebug.js', import.meta.url), 'utf8');

const PROFILE = Object.freeze({
  id: 'profile-fixed-stars-debug',
  name: 'Тест',
  birthDate: '1990-05-12',
  birthTime: '14:30',
  birthTimeAccuracy: 'exact',
  birthPlace: Object.freeze({
    city: 'Москва',
    country: 'Россия',
    coordinates: Object.freeze({
      latitude: 55.7558,
      longitude: 37.6173,
    }),
    timezone: 'Europe/Moscow',
  }),
  currentPlace: Object.freeze({
    mode: 'moscow',
    city: 'Москва',
    country: 'Россия',
    timezone: 'Europe/Moscow',
  }),
  houseSystem: 'placidus',
  zodiac: 'tropical',
});

const POSITIONS_RESULT = Object.freeze({
  status: 'ready',
  ready: true,
  readyCount: 13,
  positions: Object.freeze([
    Object.freeze({ key: 'regulus', longitude: 149.7 }),
    Object.freeze({ key: 'spica', longitude: 203.7 }),
  ]),
});

const TARGETS_RESULT = Object.freeze({
  status: 'partial',
  ready: true,
  readyCount: 4,
  targetSets: Object.freeze(['angles']),
  deferredTargetSets: Object.freeze(['lunar-nodes', 'lilith']),
  targets: Object.freeze([
    Object.freeze({ key: 'asc', longitude: 149.8 }),
    Object.freeze({ key: 'mc', longitude: 254.2 }),
  ]),
});

const CONJUNCTION_RESULT = Object.freeze({
  status: 'ready',
  ready: true,
  relationship: 'conjunction',
  orbPolicyKey: 'fixed-stars-global-conjunction-orb-1deg',
  orbDegrees: 1,
  starCount: 13,
  targetCount: 4,
  hitCount: 1,
  hits: Object.freeze([
    Object.freeze({
      starKey: 'regulus',
      targetKey: 'asc',
      distanceDegrees: 0.1,
    }),
  ]),
});

const DISPLAY_RESULT = Object.freeze({
  status: 'ready',
  ready: true,
  items: Object.freeze([
    Object.freeze({ text: 'Регул — соединение с ASC · орб 0°06′00″' }),
  ]),
});

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function assertSafeDebugOutput(value) {
  const text = JSON.stringify(value);
  const lower = text.toLowerCase();
  const forbidden = [
    'birthDate',
    'birthTime',
    'utcDateTime',
    'Europe/Moscow',
    'birthTimezone',
    'birthPlace',
    'currentPlace',
    'latitude',
    'coordinates',
    'providerPayload',
    'fullProfile',
    'profileJson',
    'catalogDump',
    'targetArray',
    'positionArray',
    'conjunctionArray',
    'hits":[',
    'positions":[',
    'targets":[',
    'catalog":[',
    'NaN',
    'undefined',
    'mythology',
    'prediction',
    'fatalistic',
    'karmic',
    'карм',
    'фаталь',
    'судьб',
    'ритуал',
    'предсказ',
    'миф',
  ];

  for (const term of forbidden) {
    assert.equal(lower.includes(term.toLowerCase()), false, `debug output must not include ${term}`);
  }
}

test('buildFixedStarsDebugSnapshot returns safe ready snapshot', () => {
  const snapshot = buildFixedStarsDebugSnapshot({
    profile: PROFILE,
    positionsResult: POSITIONS_RESULT,
    targetsResult: TARGETS_RESULT,
    conjunctionResult: CONJUNCTION_RESULT,
    displayResult: DISPLAY_RESULT,
  });

  assert.equal(snapshot.status, 'ready');
  assert.equal(snapshot.title, 'Неподвижные звезды');
  assert.equal(snapshot.debugTitle, 'Fixed Stars Debug');
  assert.equal(snapshot.catalog.sourceKey, 'vronsky-table-18-fixed-stars');
  assert.equal(snapshot.catalog.activeRowCount, 13);
  assert.equal(snapshot.catalog.candidateRowCount, 0);
  assert.equal(snapshot.catalog.initialReferenceEpoch, 1990);
  assert.deepEqual(snapshot.catalog.sourceColumns, ['1950', '1970', '1990']);
  assert.equal(snapshot.policy.relationship, 'conjunction');
  assert.equal(snapshot.policy.orbPolicyKey, 'fixed-stars-global-conjunction-orb-1deg');
  assert.equal(snapshot.policy.orbDegrees, 1);
  assert.deepEqual(snapshot.policy.activeTargetSets, ['natal-planets', 'angles']);
  assert.equal(snapshot.policy.deferredTargetSets.includes('lunar-nodes'), true);
  assert.equal(snapshot.pipeline.positionsStatus, 'ready');
  assert.equal(snapshot.pipeline.positionsCount, 13);
  assert.equal(snapshot.pipeline.targetsStatus, 'partial');
  assert.equal(snapshot.pipeline.targetCount, 4);
  assert.equal(snapshot.pipeline.conjunctionStatus, 'ready');
  assert.equal(snapshot.pipeline.hitCount, 1);
  assert.equal(snapshot.pipeline.displayStatus, 'ready');
  assert.equal(snapshot.pipeline.displayItemCount, 1);
  assert.equal(snapshot.guardrails.noInterpretations, true);
  assert.equal(snapshot.guardrails.noDeferredTargetsActive, true);
  assert.equal(snapshot.guardrails.noNonConjunctionRelationships, true);
  assert.equal(snapshot.guardrails.noRawProfileData, true);
  assertSafeDebugOutput(snapshot);
});

test('snapshot works without profile and unknown pipeline results', () => {
  const snapshot = buildFixedStarsDebugSnapshot();

  assert.equal(snapshot.status, 'ready');
  assert.equal(snapshot.pipeline.positionsStatus, 'unknown');
  assert.equal(snapshot.pipeline.positionsCount, 0);
  assert.equal(snapshot.pipeline.targetsStatus, 'unknown');
  assert.equal(snapshot.pipeline.targetCount, 0);
  assert.equal(snapshot.pipeline.conjunctionStatus, 'unknown');
  assert.equal(snapshot.pipeline.hitCount, 0);
  assert.equal(snapshot.pipeline.displayStatus, 'unknown');
  assert.equal(snapshot.pipeline.displayItemCount, 0);
  assertSafeDebugOutput(snapshot);
});

test('profile helper returns safe snapshot and does not mutate profile', () => {
  const profile = clone(PROFILE);
  const before = clone(profile);
  const snapshot = buildFixedStarsDebugSnapshotForProfile(profile, {
    positionsResult: POSITIONS_RESULT,
    targetsResult: TARGETS_RESULT,
    conjunctionResult: CONJUNCTION_RESULT,
    displayResult: DISPLAY_RESULT,
  });

  assert.equal(snapshot.status, 'ready');
  assert.equal(snapshot.pipeline.positionsStatus, 'ready');
  assert.deepEqual(profile, before);
  assertSafeDebugOutput(snapshot);
});

test('formatFixedStarsDebugSnapshot returns compact safe rows', () => {
  const formatted = formatFixedStarsDebugSnapshot(buildFixedStarsDebugSnapshot({
    positionsResult: POSITIONS_RESULT,
    targetsResult: TARGETS_RESULT,
    conjunctionResult: CONJUNCTION_RESULT,
    displayResult: DISPLAY_RESULT,
  }));

  assert.equal(formatted.title, 'Fixed Stars Debug');
  assert.equal(Array.isArray(formatted.rows), true);
  assert.equal(formatted.rows.some(([label, value]) => label === 'Source' && value === 'vronsky-table-18-fixed-stars'), true);
  assert.equal(formatted.rows.some(([label, value]) => label === 'Active rows' && value === '13'), true);
  assert.equal(formatted.rows.some(([label, value]) => label === 'Orb' && value === '1°00′'), true);
  assert.equal(formatted.rows.some(([label, value]) => label === 'Relationship' && value === 'conjunction'), true);
  assert.equal(formatted.rows.some(([label, value]) => label === 'Hits' && value === '1'), true);
  assertSafeDebugOutput(formatted);
});

test('capabilities and limitations are safe', () => {
  assert.deepEqual(getFixedStarsDebugCapabilities(), {
    fixedStarsDebug: true,
    catalogSummary: true,
    policySummary: true,
    pipelineSummary: true,
    rawProfileData: false,
    rawProviderPayload: false,
    interpretations: false,
    uiNormalMode: false,
  });

  const limitations = getFixedStarsDebugLimitations();
  assert.equal(limitations.includes('Fixed Stars Debug показывает только безопасные статусы и счетчики.'), true);
  assert.equal(limitations.includes('Интерпретации не добавлены.'), true);
  assertSafeDebugOutput(limitations);
});

test('debug helper source keeps runtime boundaries', () => {
  const source = MODULE_SOURCE();

  for (const forbidden of [
    'planetaryProvider',
    'providerCalculations',
    'swisseph',
    'astronomy-engine',
    'document.',
    'window.',
    'localStorage',
  ]) {
    assert.equal(source.includes(forbidden), false, `module source must not include ${forbidden}`);
  }
});

test('src/fixedStars.js and generic house files are not created', () => {
  assert.equal(existsSync(new URL('../src/fixedStars.js', import.meta.url)), false);
  assert.equal(existsSync(new URL('../src/houses.js', import.meta.url)), false);
  assert.equal(existsSync(new URL('../src/houseSystems.js', import.meta.url)), false);
});
