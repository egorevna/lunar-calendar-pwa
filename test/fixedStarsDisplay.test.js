import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

import {
  formatFixedStarConjunctionResult,
  formatFixedStarHit,
  formatFixedStarHitList,
  getFixedStarRelationshipLabel,
  getFixedStarsDisplayLimitations,
  getFixedStarsOrbDisplayNote,
  getFixedStarsSourceDisplayNote,
  isDisplayableFixedStarHit,
  summarizeFixedStarsDisplay,
} from '../src/fixedStarsDisplay.js';

const REGULUS_ASC_HIT = Object.freeze({
  status: 'ready',
  hit: true,
  relationship: 'conjunction',
  starKey: 'regulus',
  starLabel: 'Регул',
  starLabelEn: 'Regulus',
  targetKey: 'asc',
  targetLabel: 'ASC',
  targetCategory: 'angle',
  distanceDegrees: 0.1,
  orbDegrees: 1,
  orbText: '0°06′00″',
  text: 'Регул — соединение с ASC · орб 0°06′00″',
  sourceSystem: 'vronsky-table-18-fixed-stars',
  orbPolicyKey: 'fixed-stars-global-conjunction-orb-1deg',
});

const SPICA_VENUS_HIT = Object.freeze({
  status: 'ready',
  hit: true,
  relationship: 'conjunction',
  starKey: 'spica',
  starLabel: 'Спика',
  starLabelEn: 'Spica',
  targetKey: 'venus',
  targetLabel: 'Венера',
  targetCategory: 'natal-planet',
  distanceDegrees: 0.386111,
  orbDegrees: 1,
  orbText: '0°23′10″',
  sourceSystem: 'vronsky-table-18-fixed-stars',
  orbPolicyKey: 'fixed-stars-global-conjunction-orb-1deg',
});

const READY_RESULT = Object.freeze({
  status: 'ready',
  ready: true,
  relationship: 'conjunction',
  orbPolicyKey: 'fixed-stars-global-conjunction-orb-1deg',
  orbDegrees: 1,
  starCount: 13,
  targetCount: 14,
  hitCount: 2,
  hits: Object.freeze([REGULUS_ASC_HIT, SPICA_VENUS_HIT]),
});

function assertNoUnsafeText(value) {
  const text = JSON.stringify(value);
  const lower = text.toLowerCase();

  for (const forbidden of [
    'birthDate',
    'birthTime',
    'utcDateTime',
    'timezone',
    'latitude',
    'coordinates',
    'fullProfile',
    'profileJson',
    'providerPayload',
    'NaN',
    'undefined',
    'mythology',
    'prediction',
    'fatalistic',
    'karmic',
    'карм',
    'фатал',
    'судьб',
    'ритуал',
    'опасност',
    'слава',
  ]) {
    assert.equal(lower.includes(forbidden.toLowerCase()), false, `output should not include ${forbidden}`);
  }
}

test('formatFixedStarHit formats Regulus ASC hit using safe existing text', () => {
  assert.deepEqual(formatFixedStarHit(REGULUS_ASC_HIT), {
    type: 'fixedStarHit',
    starKey: 'regulus',
    starLabel: 'Регул',
    targetKey: 'asc',
    targetLabel: 'ASC',
    relationship: 'conjunction',
    relationshipLabel: 'соединение',
    orbText: '0°06′00″',
    text: 'Регул — соединение с ASC · орб 0°06′00″',
  });
});

test('formatFixedStarHit formats planet target and builds text when missing', () => {
  assert.deepEqual(formatFixedStarHit(SPICA_VENUS_HIT), {
    type: 'fixedStarHit',
    starKey: 'spica',
    starLabel: 'Спика',
    targetKey: 'venus',
    targetLabel: 'Венера',
    relationship: 'conjunction',
    relationshipLabel: 'соединение',
    orbText: '0°23′10″',
    text: 'Спика — соединение с Венерой · орб 0°23′10″',
  });
});

test('formatFixedStarHit returns null for non-hit invalid and unsafe hit rows', () => {
  assert.equal(formatFixedStarHit({ ...REGULUS_ASC_HIT, hit: false }), null);
  assert.equal(formatFixedStarHit({ ...REGULUS_ASC_HIT, status: 'invalid' }), null);
  assert.equal(formatFixedStarHit({ ...REGULUS_ASC_HIT, text: 'Регул приносит слава и судьба' }), null);
});

test('formatFixedStarHitList preserves order and filters invalid entries', () => {
  const items = formatFixedStarHitList([
    REGULUS_ASC_HIT,
    { ...REGULUS_ASC_HIT, hit: false },
    SPICA_VENUS_HIT,
  ]);

  assert.deepEqual(items.map((item) => item.starKey), ['regulus', 'spica']);
});

test('relationship label supports conjunction only', () => {
  assert.equal(getFixedStarRelationshipLabel('conjunction'), 'соединение');
  assert.equal(getFixedStarRelationshipLabel('opposition'), null);
  assert.equal(getFixedStarRelationshipLabel(null), null);
});

test('formatFixedStarConjunctionResult formats ready hits with safe notes', () => {
  const display = formatFixedStarConjunctionResult(READY_RESULT);

  assert.equal(display.status, 'ready');
  assert.equal(display.ready, true);
  assert.equal(display.title, 'Неподвижные звезды');
  assert.equal(display.summary, '2 соединения с неподвижными звездами');
  assert.equal(display.items.length, 2);
  assert.equal(display.items[0].text, 'Регул — соединение с ASC · орб 0°06′00″');
  assert.equal(display.items[1].text, 'Спика — соединение с Венерой · орб 0°23′10″');
  assert.deepEqual(display.notes, [
    'Источник: Вронский, Таблица 18.',
    'Орб соединения: 1°00′.',
  ]);
  assert.equal(display.message, null);
});

test('formatFixedStarConjunctionResult formats noHits state safely', () => {
  const display = formatFixedStarConjunctionResult({
    status: 'ready',
    ready: true,
    relationship: 'conjunction',
    hitCount: 0,
    hits: [],
  });

  assert.equal(display.status, 'ready');
  assert.equal(display.ready, true);
  assert.equal(display.summary, 'Соединений не найдено');
  assert.deepEqual(display.items, []);
  assert.equal(display.message, 'Соединений с неподвижными звездами в выбранном орбе не найдено.');
});

test('formatFixedStarConjunctionResult formats notReady fallback safely', () => {
  const display = formatFixedStarConjunctionResult({
    status: 'notReady',
    ready: false,
    reason: 'fixedStarTargetsNotReady',
  });

  assert.deepEqual(display, {
    status: 'notReady',
    ready: false,
    title: 'Неподвижные звезды',
    summary: 'Пока недоступно.',
    items: [],
    message: 'Неподвижные звезды пока недоступны.',
    notes: [
      'Источник: Вронский, Таблица 18.',
      'Орб соединения: 1°00′.',
    ],
    limitations: getFixedStarsDisplayLimitations(),
  });
});

test('source and orb display notes are safe static labels', () => {
  assert.equal(getFixedStarsSourceDisplayNote(), 'Источник: Вронский, Таблица 18.');
  assert.equal(getFixedStarsOrbDisplayNote(), 'Орб соединения: 1°00′.');
});

test('summarizeFixedStarsDisplay handles hits noHits and fallback', () => {
  assert.deepEqual(summarizeFixedStarsDisplay(formatFixedStarConjunctionResult(READY_RESULT)), {
    status: 'ready',
    hitCount: 2,
    text: '2 соединения с неподвижными звездами',
  });
  assert.deepEqual(summarizeFixedStarsDisplay(formatFixedStarConjunctionResult({ status: 'ready', ready: true, hits: [] })), {
    status: 'ready',
    hitCount: 0,
    text: 'Соединений с неподвижными звездами не найдено',
  });
  assert.deepEqual(summarizeFixedStarsDisplay(formatFixedStarConjunctionResult(null)), {
    status: 'notReady',
    hitCount: 0,
    text: 'Неподвижные звезды недоступны',
  });
});

test('limitations mention conjunction only global orb and no interpretations', () => {
  const limitations = getFixedStarsDisplayLimitations();

  assert.equal(limitations.includes('В Sprint 14 показываются только соединения с неподвижными звездами.'), true);
  assert.equal(limitations.includes('Используется глобальный орб 1°00′.'), true);
  assert.equal(limitations.includes('Этот блок не содержит интерпретаций.'), true);
});

test('display output contains no private raw provider or interpretive text', () => {
  const display = formatFixedStarConjunctionResult(READY_RESULT);

  assertNoUnsafeText(display);
  assert.equal(JSON.stringify(display).includes('distanceDegrees'), false);
  assert.equal(JSON.stringify(display).includes('orbDegrees'), false);
  assert.equal(JSON.stringify(display).includes('longitude'), false);
});

test('isDisplayableFixedStarHit rejects unsafe items', () => {
  assert.equal(isDisplayableFixedStarHit({ text: 'Регул — соединение с ASC · орб 0°06′00″' }), true);
  assert.equal(isDisplayableFixedStarHit({ text: 'Регул — судьба и слава' }), false);
  assert.equal(isDisplayableFixedStarHit({ text: 'Регул longitude 149.7' }), false);
  assert.equal(isDisplayableFixedStarHit({ text: 'Регул — NaN' }), false);
  assert.equal(isDisplayableFixedStarHit(null), false);
});

test('helper stays display-only without engines providers DOM storage or generic fixedStars module', () => {
  const source = readFileSync(new URL('../src/fixedStarsDisplay.js', import.meta.url), 'utf8');

  for (const forbidden of [
    'fixedStarConjunctions',
    'fixedStarTargets',
    'fixedStarPositions',
    'planetaryProvider',
    'natalPlanetsForProfile',
    'ascMc',
    'document.',
    'window.',
    'localStorage',
    'astronomy-engine',
    'swisseph',
    'calculateFixedStarConjunction',
    'resolveFixedStarTargets',
    'calculateFixedStarPosition',
    'render',
    'debug',
  ]) {
    assert.equal(source.includes(forbidden), false, `source should not include ${forbidden}`);
  }

  assert.equal(existsSync(new URL('../src/fixedStars.js', import.meta.url)), false);
});

test('display helper does not mutate input', () => {
  const input = JSON.parse(JSON.stringify(READY_RESULT));
  const before = JSON.parse(JSON.stringify(input));

  formatFixedStarConjunctionResult(input);

  assert.deepEqual(input, before);
});
