import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

import {
  buildVronskyArabicPartsDebugSnapshot,
  buildVronskyArabicPartsDebugSnapshotForProfile,
  formatVronskyArabicPartsDebugSnapshot,
  getVronskyArabicPartsDebugCapabilities,
  getVronskyArabicPartsDebugLimitations,
} from '../src/vronskyArabicPartsDebug.js';

const MODULE_SOURCE = () => readFileSync(new URL('../src/vronskyArabicPartsDebug.js', import.meta.url), 'utf8');

const SELECTED_KEYS = Object.freeze([
  'pars-amoris',
  'pars-artis',
  'pars-creationis',
  'pars-fratrum-et-sororum',
  'pars-hereditatis',
  'pars-itineris',
  'pars-liberorum',
  'pars-matris',
  'pars-patris',
  'pars-pueri',
  'astrologia',
  'pars-mercaturae',
]);

const PROFILE = Object.freeze({
  id: 'profile-vronsky-debug',
  name: 'Тест',
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
  houseSystem: 'equalHouse',
  zodiac: 'tropical',
});

const VRONSKY_RESULT = Object.freeze({
  status: 'ready',
  ready: true,
  sourceSystem: 'vronsky-table-17-arabic-points',
  chartSect: 'day',
  readyCount: 12,
  notReadyCount: 0,
  parts: Object.freeze(SELECTED_KEYS.map((key) => Object.freeze({
    key,
    longitude: 120,
    text: `${key} — Лев 00°00′00″`,
  }))),
});

const ASSIGNMENT_RESULT = Object.freeze({
  status: 'ready',
  ready: true,
  sourceSystem: 'vronsky-table-17-arabic-points',
  readyCount: 12,
  assignedCount: 12,
  assignments: Object.freeze(SELECTED_KEYS.map((key) => Object.freeze({
    key,
    houseNumber: 1,
  }))),
});

const DISPLAY_RESULT = Object.freeze({
  status: 'ready',
  ready: true,
  sourceSystem: 'vronsky-table-17-arabic-points',
  items: Object.freeze(SELECTED_KEYS.map((key) => Object.freeze({
    key,
    text: `${key} — Лев 00°00′00″ · 1 дом`,
  }))),
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
    'birthPlace',
    'currentPlace',
    'timezone',
    'latitude',
    'longitude',
    'coordinates',
    'providerPayload',
    'fullProfile',
    'profileJson',
    'sourceExpression',
    'operands',
    'formulaRows',
    'parts":[',
    'assignments":[',
    'cusps":[',
    'точка любви —',
    'fatalistic',
    'karmic',
    'карми',
    'фаталь',
    'судьб',
    'ритуал',
  ];

  for (const term of forbidden) {
    assert.equal(lower.includes(term.toLowerCase()), false, `debug output must not include ${term}`);
  }
}

test('buildVronskyArabicPartsDebugSnapshot returns safe ready snapshot', () => {
  const snapshot = buildVronskyArabicPartsDebugSnapshot({
    profile: PROFILE,
    vronskyResult: VRONSKY_RESULT,
    assignmentResult: ASSIGNMENT_RESULT,
    displayResult: DISPLAY_RESULT,
  });

  assert.equal(snapshot.status, 'ready');
  assert.equal(snapshot.title, 'Точки Вронского');
  assert.equal(snapshot.debugTitle, 'Vronsky Arabic Points Debug');
  assert.equal(snapshot.source.sourceSystem, 'vronsky-table-17-arabic-points');
  assert.equal(snapshot.source.sourceCorpus, 'Вронский, Том 1, Приложение 2, Таблица 17 — Арабские точки');
  assert.equal(snapshot.source.formulaTradition, 'Vronsky Table 17 Arabic Points');
  assert.equal(snapshot.source.sourceSection, 'Для дневного рождения');
  assert.equal(snapshot.dataset.selectedRowCount, 12);
  assert.equal(snapshot.dataset.activeDefaultFormulaCount, 2);
  assert.equal(snapshot.dataset.oldDeferredLotCount, 4);
  assert.deepEqual(snapshot.dataset.selectedKeys, SELECTED_KEYS);
  assert.equal(snapshot.policy.sourceCorpusPolicy, 'vronsky-only');
  assert.equal(snapshot.policy.chartSectPolicy, 'dayOnly');
  assert.equal(snapshot.policy.nightFormulaStatus, 'missing/notVerified');
  assert.equal(snapshot.policy.externalTraditionsUsed, false);
  assert.equal(snapshot.policy.interpretations, false);
  assert.equal(snapshot.pipeline.calculationStatus, 'ready');
  assert.equal(snapshot.pipeline.readyCount, 12);
  assert.equal(snapshot.pipeline.notReadyCount, 0);
  assert.equal(snapshot.pipeline.assignmentStatus, 'ready');
  assert.equal(snapshot.pipeline.assignedCount, 12);
  assert.equal(snapshot.pipeline.displayStatus, 'ready');
  assert.equal(snapshot.pipeline.displayItemCount, 12);
  assert.equal(snapshot.guardrails.noNightFormulaFallback, true);
  assert.equal(snapshot.guardrails.noNonVronskySources, true);
  assert.equal(snapshot.guardrails.oldDeferredLotsInactive, true);
  assert.equal(snapshot.guardrails.sensitiveRowsExcluded, true);
  assert.equal(snapshot.guardrails.noInterpretations, true);
  assert.equal(snapshot.guardrails.noRawProfileData, true);
  assertSafeDebugOutput(snapshot);
});

test('snapshot works without profile or injected results', () => {
  const snapshot = buildVronskyArabicPartsDebugSnapshot();

  assert.equal(snapshot.status, 'ready');
  assert.equal(snapshot.pipeline.calculationStatus, 'unknown');
  assert.equal(snapshot.pipeline.readyCount, 0);
  assert.equal(snapshot.pipeline.assignmentStatus, 'unknown');
  assert.equal(snapshot.pipeline.assignedCount, 0);
  assert.equal(snapshot.pipeline.displayStatus, 'unknown');
  assert.equal(snapshot.pipeline.displayItemCount, 0);
  assertSafeDebugOutput(snapshot);
});

test('profile helper returns safe snapshot and does not mutate profile', () => {
  const profile = clone(PROFILE);
  const before = clone(profile);
  const snapshot = buildVronskyArabicPartsDebugSnapshotForProfile(profile, {
    vronskyResult: VRONSKY_RESULT,
    assignmentResult: ASSIGNMENT_RESULT,
    displayResult: DISPLAY_RESULT,
  });

  assert.equal(snapshot.status, 'ready');
  assert.equal(snapshot.pipeline.calculationStatus, 'ready');
  assert.deepEqual(profile, before);
  assertSafeDebugOutput(snapshot);
});

test('formatVronskyArabicPartsDebugSnapshot returns compact safe rows', () => {
  const formatted = formatVronskyArabicPartsDebugSnapshot(buildVronskyArabicPartsDebugSnapshot({
    vronskyResult: VRONSKY_RESULT,
    assignmentResult: ASSIGNMENT_RESULT,
    displayResult: DISPLAY_RESULT,
  }));

  assert.equal(formatted.title, 'Vronsky Arabic Points Debug');
  assert.equal(Array.isArray(formatted.rows), true);
  assert.equal(formatted.rows.some(([label, value]) => label === 'Source' && value === 'vronsky-table-17-arabic-points'), true);
  assert.equal(formatted.rows.some(([label, value]) => label === 'Selected rows' && value === '12'), true);
  assert.equal(formatted.rows.some(([label, value]) => label === 'Chart sect policy' && value === 'dayOnly'), true);
  assert.equal(formatted.rows.some(([label, value]) => label === 'Night formulas' && value === 'missing/notVerified'), true);
  assert.equal(formatted.rows.some(([label, value]) => label === 'Ready rows' && value === '12'), true);
  assert.equal(formatted.rows.some(([label, value]) => label === 'Assigned rows' && value === '12'), true);
  assert.equal(formatted.rows.some(([label, value]) => label === 'Display items' && value === '12'), true);
  assertSafeDebugOutput(formatted);
});

test('capabilities and limitations are safe', () => {
  assert.deepEqual(getVronskyArabicPartsDebugCapabilities(), {
    vronskyArabicPartsDebug: true,
    sourceSummary: true,
    datasetSummary: true,
    pipelineSummary: true,
    privacyGuardrails: true,
    rawProfileData: false,
    rawProviderPayload: false,
    fullFormulaDump: false,
    fullResultDump: false,
    interpretations: false,
    normalUi: false,
  });

  const limitations = getVronskyArabicPartsDebugLimitations();
  assert.equal(limitations.includes('Vronsky Arabic Points Debug показывает только безопасные статусы и счетчики.'), true);
  assert.equal(limitations.includes('Debug доступен только в debug mode.'), true);
  assertSafeDebugOutput(limitations);
});

test('debug helper source keeps runtime boundaries and does not change calculations', () => {
  const source = MODULE_SOURCE();

  for (const forbidden of [
    'planetaryProvider',
    'providerCalculations',
    'swisseph',
    'astronomy-engine',
    'document.',
    'window.',
    'localStorage',
    'calculateVronskySimpleArabicPartFromLongitudes',
    'calculateVronskySimpleArabicPartsFromLongitudes',
  ]) {
    assert.equal(source.includes(forbidden), false, `module source must not include ${forbidden}`);
  }
});

test('generic house files are not created', () => {
  assert.equal(existsSync(new URL('../src/houses.js', import.meta.url)), false);
  assert.equal(existsSync(new URL('../src/houseSystems.js', import.meta.url)), false);
});
