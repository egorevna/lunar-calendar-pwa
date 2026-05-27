import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import {
  formatArabicPartHouseAssignment,
  formatArabicPartList,
  formatArabicPartResult,
  formatArabicPartsResult,
  formatArabicPartsWithAssignments,
  formatArabicPartWithHouse,
  getArabicPartsDisplayLimitations,
  getChartSectDisplayLabel,
  isDisplayableArabicPartItem,
  summarizeArabicPartsDisplay,
} from '../src/arabicPartsDisplay.js';

const PARS_FORTUNA = Object.freeze({
  status: 'ready',
  ready: true,
  key: 'pars-fortuna',
  label: 'Парс Фортуны',
  labelEn: 'Lot of Fortune',
  longitude: 49.123456,
  sign: Object.freeze({ key: 'taurus', ru: 'Телец', symbol: '♉' }),
  degree: 19,
  minutes: 7,
  seconds: 24,
  text: 'Парс Фортуны — Телец 19°07′24″',
  formulaVariant: 'day',
  formula: 'ASC + Moon - Sun',
  verificationStatus: 'verified',
});

const LOT_OF_SPIRIT = Object.freeze({
  status: 'ready',
  ready: true,
  key: 'lot-of-spirit',
  label: 'Жребий Духа',
  labelEn: 'Lot of Spirit',
  longitude: 218.188889,
  sign: Object.freeze({ key: 'scorpio', ru: 'Скорпион', symbol: '♏' }),
  degree: 8,
  minutes: 11,
  seconds: 20,
  formulaVariant: 'night',
  formula: 'ASC + Moon - Sun',
  verificationStatus: 'verified',
});

const PARTS_RESULT = Object.freeze({
  status: 'ready',
  ready: true,
  chartSect: 'day',
  total: 2,
  readyCount: 2,
  invalidCount: 0,
  parts: Object.freeze([PARS_FORTUNA, LOT_OF_SPIRIT]),
});

const ASSIGNMENT_RESULT = Object.freeze({
  status: 'ready',
  ready: true,
  total: 2,
  readyCount: 2,
  invalidCount: 0,
  assignments: Object.freeze([
    Object.freeze({
      status: 'ready',
      ready: true,
      key: 'pars-fortuna',
      label: 'Парс Фортуны',
      houseNumber: 4,
      houseLabel: '4 дом',
      text: 'Парс Фортуны — 4 дом',
    }),
    Object.freeze({
      status: 'ready',
      ready: true,
      key: 'lot-of-spirit',
      label: 'Жребий Духа',
      houseNumber: 10,
      houseLabel: '10 дом',
      text: 'Жребий Духа — 10 дом',
    }),
  ]),
});

function clone(value) {
  return JSON.parse(JSON.stringify(value));
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
  assert.equal(json.includes('49.123456'), false);
  assert.equal(json.includes('218.188889'), false);
  assert.equal(json.includes('"providerPayload"'), false);
  assert.equal(json.includes('"fullProfileJson"'), false);
  assert.equal(json.includes('"operands"'), false);
  assert.equal(json.includes('NaN'), false);
  assert.equal(json.includes('undefined'), false);
  assert.equal(json.includes('сильный жребий'), false);
  assert.equal(json.includes('слабый жребий'), false);
  assert.equal(json.includes('фаталь'), false);
  assert.equal(json.includes('карми'), false);
  assert.equal(json.includes('ритуал'), false);
}

test('formatArabicPartResult formats Pars Fortuna safely', () => {
  const result = formatArabicPartResult(PARS_FORTUNA);

  assert.deepEqual(result, {
    type: 'arabicPart',
    key: 'pars-fortuna',
    label: 'Парс Фортуны',
    text: 'Парс Фортуны — Телец 19°07′24″',
    formulaVariant: 'day',
    formulaVariantLabel: 'дневная',
  });
  assertSafeDisplayOutput(result);
});

test('formatArabicPartResult formats Lot of Spirit and builds missing text with seconds', () => {
  const result = formatArabicPartResult(LOT_OF_SPIRIT);

  assert.deepEqual(result, {
    type: 'arabicPart',
    key: 'lot-of-spirit',
    label: 'Жребий Духа',
    text: 'Жребий Духа — Скорпион 8°11′20″',
    formulaVariant: 'night',
    formulaVariantLabel: 'ночная',
  });
  assert.match(result.text, /\d{1,2}°\d{2}′\d{2}″$/);
  assertSafeDisplayOutput(result);
});

test('invalid part returns null', () => {
  assert.equal(formatArabicPartResult(null), null);
  assert.equal(formatArabicPartResult({ status: 'notReady', label: 'Парс Фортуны' }), null);
  assert.equal(formatArabicPartResult({ status: 'ready', ready: true, key: 'bad', label: 'Bad' }), null);
});

test('formatArabicPartList preserves active order and filters invalid entries', () => {
  const result = formatArabicPartList([
    PARS_FORTUNA,
    { status: 'notReady', key: 'lot-of-eros', label: 'Eros' },
    LOT_OF_SPIRIT,
  ]);

  assert.deepEqual(result.map((item) => item.key), ['pars-fortuna', 'lot-of-spirit']);
  assertSafeDisplayOutput(result);
});

test('formatArabicPartHouseAssignment formats ready house assignment', () => {
  const result = formatArabicPartHouseAssignment(ASSIGNMENT_RESULT.assignments[0]);

  assert.deepEqual(result, {
    type: 'arabicPartHouseAssignment',
    key: 'pars-fortuna',
    label: 'Парс Фортуны',
    houseNumber: 4,
    text: 'Парс Фортуны — 4 дом',
  });
  assertSafeDisplayOutput(result);
});

test('invalid assignment returns null', () => {
  assert.equal(formatArabicPartHouseAssignment(null), null);
  assert.equal(formatArabicPartHouseAssignment({ status: 'invalid', key: 'pars-fortuna' }), null);
  assert.equal(formatArabicPartHouseAssignment({ status: 'ready', ready: true, label: 'Парс Фортуны' }), null);
});

test('formatArabicPartWithHouse combines position and house assignment', () => {
  const result = formatArabicPartWithHouse(PARS_FORTUNA, ASSIGNMENT_RESULT.assignments[0]);

  assert.deepEqual(result, {
    type: 'arabicPartWithHouse',
    key: 'pars-fortuna',
    label: 'Парс Фортуны',
    text: 'Парс Фортуны — Телец 19°07′24″ · 4 дом',
    houseNumber: 4,
  });
  assertSafeDisplayOutput(result);
});

test('formatArabicPartWithHouse returns position only when assignment is missing', () => {
  const result = formatArabicPartWithHouse(PARS_FORTUNA, null);

  assert.deepEqual(result, formatArabicPartResult(PARS_FORTUNA));
  assertSafeDisplayOutput(result);
});

test('formatArabicPartsWithAssignments formats ready parts and assignments', () => {
  const result = formatArabicPartsWithAssignments({
    partsResult: PARTS_RESULT,
    assignmentResult: ASSIGNMENT_RESULT,
  });

  assert.equal(result.status, 'ready');
  assert.equal(result.ready, true);
  assert.equal(result.title, 'Жребии и арабские части');
  assert.equal(result.summary, '2 жребия рассчитаны');
  assert.equal(result.chartSect, 'day');
  assert.equal(result.chartSectLabel, 'Дневная карта');
  assert.deepEqual(result.items.map((item) => item.text), [
    'Парс Фортуны — Телец 19°07′24″ · 4 дом',
    'Жребий Духа — Скорпион 8°11′20″ · 10 дом',
  ]);
  assertSafeDisplayOutput(result);
});

test('formatArabicPartsWithAssignments shows parts when assignments are not ready', () => {
  const result = formatArabicPartsWithAssignments({
    partsResult: PARTS_RESULT,
    assignmentResult: {
      status: 'notReady',
      ready: false,
      assignments: [],
    },
  });

  assert.equal(result.status, 'ready');
  assert.deepEqual(result.items.map((item) => item.text), [
    'Парс Фортуны — Телец 19°07′24″',
    'Жребий Духа — Скорпион 8°11′20″',
  ]);
  assertSafeDisplayOutput(result);
});

test('formatArabicPartsWithAssignments returns fallback when parts are not ready', () => {
  const result = formatArabicPartsWithAssignments({
    partsResult: {
      status: 'notReady',
      ready: false,
      reason: 'missingRequiredInputs',
    },
    assignmentResult: ASSIGNMENT_RESULT,
  });

  assert.equal(result.status, 'notReady');
  assert.equal(result.ready, false);
  assert.equal(result.summary, 'Пока недоступно.');
  assert.equal(result.message, 'Для расчета нужны ASC, Солнце, Луна и дневная/ночная карта.');
  assert.deepEqual(result.items, []);
  assertSafeDisplayOutput(result);
});

test('formatArabicPartsResult formats ready notReady and unsupported results', () => {
  const ready = formatArabicPartsResult(PARTS_RESULT);
  const notReady = formatArabicPartsResult({ status: 'notReady', ready: false, reason: 'missingSunLongitude' });
  const unsupported = formatArabicPartsResult({ status: 'unsupported', ready: false, reason: 'formulaNotActive' });

  assert.equal(ready.status, 'ready');
  assert.equal(ready.items.length, 2);
  assert.equal(notReady.status, 'notReady');
  assert.equal(notReady.message, 'Для расчета нужны ASC, Солнце, Луна и дневная/ночная карта.');
  assert.equal(unsupported.status, 'unsupported');
  assert.deepEqual(unsupported.items, []);
  [ready, notReady, unsupported].forEach(assertSafeDisplayOutput);
});

test('chart sect labels are safe Russian labels', () => {
  assert.equal(getChartSectDisplayLabel('day'), 'Дневная карта');
  assert.equal(getChartSectDisplayLabel('night'), 'Ночная карта');
  assert.equal(getChartSectDisplayLabel('boundary'), 'На границе дня и ночи');
  assert.equal(getChartSectDisplayLabel(null), 'Недоступно');
  assert.equal(getChartSectDisplayLabel('unknown'), 'Недоступно');
});

test('summary counts ready items and house assignments', () => {
  const ready = formatArabicPartsWithAssignments({
    partsResult: PARTS_RESULT,
    assignmentResult: ASSIGNMENT_RESULT,
  });
  const fallback = formatArabicPartsResult({ status: 'notReady', ready: false });

  assert.deepEqual(summarizeArabicPartsDisplay(ready), {
    status: 'ready',
    text: 'Жребии рассчитаны',
    count: 2,
    houseAssignments: 2,
  });
  assert.deepEqual(summarizeArabicPartsDisplay(fallback), {
    status: 'notReady',
    text: 'Жребии недоступны',
    count: 0,
    houseAssignments: 0,
  });
});

test('display limitations mention active lots and no interpretations', () => {
  const limitations = getArabicPartsDisplayLimitations();

  assert.equal(limitations.some((item) => item.includes('ASC, Солнце, Луне')), true);
  assert.equal(limitations.some((item) => item.includes('Pars Fortuna и Lot of Spirit')), true);
  assert.equal(limitations.some((item) => item.includes('Остальные арабские части')), true);
  assert.equal(limitations.some((item) => item.includes('не содержит интерпретаций')), true);
});

test('displayable item guard rejects unsafe user-facing text', () => {
  assert.equal(isDisplayableArabicPartItem(formatArabicPartResult(PARS_FORTUNA)), true);
  assert.equal(isDisplayableArabicPartItem({ text: 'Парс Фортуны — NaN' }), false);
  assert.equal(isDisplayableArabicPartItem({ text: 'birthDate 2000-03-20' }), false);
  assert.equal(isDisplayableArabicPartItem({ text: 'сильный жребий' }), false);
  assert.equal(isDisplayableArabicPartItem(null), false);
});

test('display helper does not mutate inputs', () => {
  const partsBefore = clone(PARTS_RESULT);
  const assignmentsBefore = clone(ASSIGNMENT_RESULT);

  formatArabicPartsWithAssignments({
    partsResult: PARTS_RESULT,
    assignmentResult: ASSIGNMENT_RESULT,
  });

  assert.deepEqual(PARTS_RESULT, partsBefore);
  assert.deepEqual(ASSIGNMENT_RESULT, assignmentsBefore);
});

test('Arabic Parts display output avoids raw data, formulas, NaN and interpretations', () => {
  const output = [
    formatArabicPartResult(PARS_FORTUNA),
    formatArabicPartsWithAssignments({
      partsResult: PARTS_RESULT,
      assignmentResult: ASSIGNMENT_RESULT,
    }),
    getArabicPartsDisplayLimitations(),
  ];

  assertSafeDisplayOutput(output);
});

test('Arabic Parts display helper stays display-only without engines providers DOM storage or forbidden files', async () => {
  const source = await readFile(new URL('../src/arabicPartsDisplay.js', import.meta.url), 'utf8');
  const imports = source
    .split('\n')
    .filter((line) => line.trim().startsWith('import '));

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
  assert.equal(source.includes('ASC + Moon - Sun'), false);
  assert.equal(source.includes('ASC + Sun - Moon'), false);
  assert.equal(source.includes('operands'), false);
  assert.equal(source.includes('calculateArabic'), false);
  assert.equal(source.includes('assignArabic'), false);
  assert.equal(source.includes('findHouseFor'), false);
  assert.equal(source.includes('isLongitudeInHouseSpan'), false);
  assert.equal(source.includes('interpretations: true'), false);
  assert.equal(source.includes('ритуал'), false);
  assert.equal(source.includes('карми'), false);
  assert.equal(existsSync(new URL('../src/houses.js', import.meta.url)), false);
  assert.equal(existsSync(new URL('../src/houseSystems.js', import.meta.url)), false);
});
