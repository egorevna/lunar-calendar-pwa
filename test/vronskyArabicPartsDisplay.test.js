import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import {
  formatVronskyArabicPartResult,
  formatVronskyArabicPartsResult,
  formatVronskyArabicPartsWithAssignments,
  formatVronskyArabicPartWithHouse,
  getVronskyArabicPartsDisplayLimitations,
  summarizeVronskyArabicPartsDisplay,
} from '../src/arabicPartsDisplay.js';
import { getVronskyArabicPartsDisplayFixture } from './fixtures/vronskyArabicPartsDisplayFixtures.js';

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function fixture(id) {
  return getVronskyArabicPartsDisplayFixture(id);
}

function assertSafeDisplayOutput(value) {
  const json = JSON.stringify(value);

  assert.equal(json.includes('2000-03-20'), false);
  assert.equal(json.includes('15:00'), false);
  assert.equal(json.includes('"birthDate"'), false);
  assert.equal(json.includes('"birthTime"'), false);
  assert.equal(json.includes('"utcDateTime"'), false);
  assert.equal(json.includes('"timezone"'), false);
  assert.equal(json.includes('"coordinates"'), false);
  assert.equal(json.includes('"latitude"'), false);
  assert.equal(json.includes('"longitude"'), false);
  assert.equal(json.includes('170'), false);
  assert.equal(json.includes('320'), false);
  assert.equal(json.includes('"sourceExpression"'), false);
  assert.equal(json.includes('"operands"'), false);
  assert.equal(json.includes('"providerPayload"'), false);
  assert.equal(json.includes('"fullProfileJson"'), false);
  assert.equal(json.includes('NaN'), false);
  assert.equal(json.includes('undefined'), false);
  assert.equal(json.includes('судьба'), false);
  assert.equal(json.includes('опасность'), false);
  assert.equal(json.includes('фаталь'), false);
  assert.equal(json.includes('карми'), false);
  assert.equal(json.includes('зловещ'), false);
  assert.equal(json.includes('ритуал'), false);
}

test('formatVronskyArabicPartResult formats Vronsky point with seconds', () => {
  const ready = fixture('day-ready-display');
  const result = formatVronskyArabicPartResult(ready.input.vronskyResult.parts[0]);

  assert.deepEqual(result, {
    type: 'vronskyArabicPart',
    key: 'pars-amoris',
    label: 'Точка любви',
    text: 'Точка любви — Дева 20°00′00″',
    sourceSystem: 'vronsky-table-17-arabic-points',
  });
  assert.match(result.text, /\d{1,2}°\d{2}′\d{2}″$/);
  assertSafeDisplayOutput(result);
});

test('formatVronskyArabicPartResult builds missing text and filters invalid rows', () => {
  const ready = fixture('day-ready-display');
  const withoutText = {
    ...ready.input.vronskyResult.parts[1],
    text: '',
  };

  assert.equal(formatVronskyArabicPartResult(null), null);
  assert.equal(formatVronskyArabicPartResult({ status: 'notReady', key: 'pars-amoris' }), null);
  assert.equal(formatVronskyArabicPartResult({ status: 'ready', ready: true, key: 'bad', label: 'Bad' }), null);
  assert.equal(formatVronskyArabicPartResult(withoutText).text, 'Точка искусства — Близнецы 20°00′00″');
});

test('formatVronskyArabicPartWithHouse combines position and house assignment', () => {
  const ready = fixture('with-house-assignments');
  const part = ready.input.vronskyResult.parts[0];
  const assignment = ready.input.assignmentResult.assignments[0];
  const withHouse = formatVronskyArabicPartWithHouse(part, assignment);
  const withoutHouse = formatVronskyArabicPartWithHouse(part, null);

  assert.deepEqual(withHouse, {
    type: 'vronskyArabicPartWithHouse',
    key: 'pars-amoris',
    label: 'Точка любви',
    text: ready.expected.firstText,
    sourceSystem: 'vronsky-table-17-arabic-points',
    houseNumber: 6,
  });
  assert.equal(withoutHouse.text, 'Точка любви — Дева 20°00′00″');
  assertSafeDisplayOutput({ withHouse, withoutHouse });
});

test('formatVronskyArabicPartsResult preserves source order without house labels', () => {
  const ready = fixture('day-ready-display');
  const result = formatVronskyArabicPartsResult(ready.input.vronskyResult);

  assert.equal(result.status, 'ready');
  assert.equal(result.ready, true);
  assert.equal(result.title, 'Точки Вронского');
  assert.equal(result.summary, ready.expected.summary);
  assert.equal(result.items.length, ready.expected.itemCount);
  assert.equal(result.items[0].text, ready.expected.firstText);
  assert.deepEqual(result.items.map((item) => item.key), ready.input.vronskyResult.parts.map((part) => part.key));
  assertSafeDisplayOutput(result);
});

test('formatVronskyArabicPartsWithAssignments adds house labels and summary counts', () => {
  const ready = fixture('with-house-assignments');
  const result = formatVronskyArabicPartsWithAssignments(
    ready.input.vronskyResult,
    ready.input.assignmentResult,
  );
  const summary = summarizeVronskyArabicPartsDisplay(result);

  assert.equal(result.status, 'ready');
  assert.equal(result.items[0].text, ready.expected.firstText);
  assert.equal(result.items.at(-1).text, ready.expected.lastText);
  assert.equal(summary.count, 12);
  assert.equal(summary.houseAssignments, ready.expected.houseAssignments);
  assert.deepEqual(summary, {
    status: 'ready',
    text: 'Точки Вронского рассчитаны',
    count: 12,
    houseAssignments: 12,
  });
  assertSafeDisplayOutput({ result, summary });
});

test('Vronsky display returns safe day-only fallbacks for night boundary and unknown chart sect', () => {
  const night = formatVronskyArabicPartsResult(fixture('night-not-ready').input.vronskyResult);
  const boundary = formatVronskyArabicPartsResult(fixture('boundary-not-ready').input.vronskyResult);
  const unknown = formatVronskyArabicPartsResult(fixture('unknown-not-ready').input.vronskyResult);

  assert.equal(night.status, 'notReady');
  assert.equal(night.message, fixture('night-not-ready').expected.message);
  assert.equal(boundary.message, fixture('boundary-not-ready').expected.message);
  assert.equal(unknown.message, fixture('unknown-not-ready').expected.message);
  assert.deepEqual(night.items, []);
  assert.deepEqual(boundary.items, []);
  assert.deepEqual(unknown.items, []);
  [night, boundary, unknown].forEach(assertSafeDisplayOutput);
});

test('Vronsky display limitations are concise factual and non-interpretive', () => {
  const limitations = getVronskyArabicPartsDisplayLimitations();
  const text = limitations.join(' ');

  assert.equal(limitations.includes('Формулы Вронского подтверждены для дневного рождения.'), true);
  assert.equal(limitations.includes('Ночные формулы по Вронскому пока не verified.'), true);
  assert.match(text, /выбранный простой набор из 12 строк Вронского/);
  assert.match(text, /не содержит интерпретаций/);
  assertSafeDisplayOutput(limitations);
});

test('Vronsky display helper does not mutate inputs', () => {
  const ready = fixture('with-house-assignments');
  const beforeParts = clone(ready.input.vronskyResult);
  const beforeAssignments = clone(ready.input.assignmentResult);

  formatVronskyArabicPartsWithAssignments(ready.input.vronskyResult, ready.input.assignmentResult);

  assert.deepEqual(ready.input.vronskyResult, beforeParts);
  assert.deepEqual(ready.input.assignmentResult, beforeAssignments);
});

test('Vronsky Arabic Parts display helper stays display-only and scoped', async () => {
  const source = await readFile(new URL('../src/arabicPartsDisplay.js', import.meta.url), 'utf8');
  const imports = source
    .split('\n')
    .filter((line) => line.trim().startsWith('import '));
  const ready = fixture('with-house-assignments');
  const result = formatVronskyArabicPartsWithAssignments(
    ready.input.vronskyResult,
    ready.input.assignmentResult,
  );

  assertSafeDisplayOutput(result);
  assert.equal(imports.some((line) => line.includes('arabicParts.js')), false);
  assert.equal(imports.some((line) => line.includes('arabicPartsHouseAssignment')), false);
  assert.equal(imports.some((line) => line.includes('provider')), false);
  assert.equal(imports.some((line) => line.includes('localStorage')), false);
  assert.equal(imports.some((line) => line.includes('document')), false);
  assert.equal(imports.some((line) => line.includes('window')), false);
  assert.equal(imports.some((line) => line.includes('swisseph')), false);
  assert.equal(imports.some((line) => line.includes('astronomy-engine')), false);
  assert.equal(source.includes('document.'), false);
  assert.equal(source.includes('window.'), false);
  assert.equal(source.includes('calculateVronsky'), false);
  assert.equal(source.includes('assignVronsky'), false);
  assert.equal(source.includes('findHouseFor'), false);
  assert.equal(source.includes('sourceExpression'), false);
  assert.equal(source.includes('operands'), false);
  assert.equal(source.includes('interpretations: true'), false);
  assert.equal(source.includes('ритуал'), false);
  assert.equal(source.includes('карми'), false);
  assert.equal(existsSync(new URL('../src/houses.js', import.meta.url)), false);
  assert.equal(existsSync(new URL('../src/houseSystems.js', import.meta.url)), false);
});
