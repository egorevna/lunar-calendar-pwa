import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import {
  formatHouseAngle,
  formatHouseAngles,
  formatHouseItem,
  formatHouseList,
  formatHouseSystemLabel,
  formatHousesResult,
  formatHousesWithPlanetAssignments,
  formatPlanetHouseAssignment,
  formatPlanetHouseAssignmentList,
  getHousesDisplayLimitations,
  isDisplayableHouseItem,
  summarizeHousesDisplay,
} from '../src/housesDisplay.js';

const MODULE_PATH = new URL('../src/housesDisplay.js', import.meta.url);

const aries = Object.freeze({ key: 'aries', ru: 'Овен', symbol: '♈' });
const cancer = Object.freeze({ key: 'cancer', ru: 'Рак', symbol: '♋' });
const libra = Object.freeze({ key: 'libra', ru: 'Весы', symbol: '♎' });
const capricorn = Object.freeze({ key: 'capricorn', ru: 'Козерог', symbol: '♑' });
const taurus = Object.freeze({ key: 'taurus', ru: 'Телец', symbol: '♉' });
const aquarius = Object.freeze({ key: 'aquarius', ru: 'Водолей', symbol: '♒' });
const gemini = Object.freeze({ key: 'gemini', ru: 'Близнецы', symbol: '♊' });
const leo = Object.freeze({ key: 'leo', ru: 'Лев', symbol: '♌' });
const sagittarius = Object.freeze({ key: 'sagittarius', ru: 'Стрелец', symbol: '♐' });

function angle(key, label, sign, degree, minutes, longitude) {
  return Object.freeze({
    key,
    label,
    longitude,
    sign,
    degree,
    minutes,
    text: `${sign.ru} ${degree}°${String(minutes).padStart(2, '0')}′`,
  });
}

const angles = Object.freeze({
  asc: angle('asc', 'ASC', aries, 14, 30, 14.5),
  mc: angle('mc', 'MC', capricorn, 3, 18, 273.3),
  dsc: angle('dsc', 'DSC', libra, 14, 30, 194.5),
  ic: angle('ic', 'IC', cancer, 3, 18, 93.3),
});

const wholeSignResult = Object.freeze({
  status: 'ready',
  ready: true,
  houseSystem: 'whole-sign',
  houseSystemLabel: 'Whole Sign',
  angles,
  houses: Object.freeze([
    Object.freeze({
      number: 1,
      sign: aries,
      signStartLongitude: 0,
      signEndLongitude: 30,
      label: '1 дом',
      text: '1 дом — Овен',
    }),
    Object.freeze({
      number: 2,
      sign: taurus,
      signStartLongitude: 30,
      signEndLongitude: 60,
      label: '2 дом',
      text: '2 дом — Телец',
    }),
  ]),
  birthDate: '1990-01-01',
  birthTime: '12:00',
  birthPlace: Object.freeze({ latitude: 55.7558, longitude: 37.6173 }),
});

const cuspHouse = Object.freeze({
  number: 1,
  cusp: Object.freeze({
    longitude: 14.5,
    sign: aries,
    degree: 14,
    minutes: 30,
    text: 'Овен 14°30′',
  }),
  nextCuspLongitude: 44.5,
  wraps: false,
  label: '1 дом',
  text: '1 дом — Овен 14°30′',
});

const equalHouseResult = Object.freeze({
  status: 'ready',
  ready: true,
  houseSystem: 'equal-house',
  houseSystemLabel: 'Равнодомная',
  angles,
  houses: Object.freeze([cuspHouse]),
  cusps: Object.freeze([
    Object.freeze({ number: 1, longitude: 14.5, text: '1 дом — Овен 14°30′' }),
  ]),
});

const placidusResult = Object.freeze({
  ...equalHouseResult,
  houseSystem: 'placidus',
  houseSystemLabel: 'Placidus',
});

const routerResult = Object.freeze({
  status: 'ready',
  ready: true,
  selectedHouseSystem: 'placidus',
  houseSystem: 'placidus',
  houseSystemLabel: 'Placidus',
  selectionSource: 'profile',
  defaulted: false,
  result: placidusResult,
  houses: placidusResult.houses,
  angles,
});

const correctPlacidusAngles = Object.freeze({
  asc: angle('asc', 'ASC', aquarius, 14, 57, 314.950768),
  mc: angle('mc', 'MC', sagittarius, 14, 16, 254.283055),
  dsc: angle('dsc', 'DSC', leo, 14, 57, 134.950768),
  ic: angle('ic', 'IC', gemini, 14, 16, 74.283055),
});

const stalePlacidusAngles = Object.freeze({
  asc: angle('asc', 'ASC', aquarius, 14, 47, 314.78),
  mc: angle('mc', 'MC', sagittarius, 14, 12, 254.20),
  dsc: angle('dsc', 'DSC', leo, 14, 47, 134.78),
  ic: angle('ic', 'IC', gemini, 14, 12, 74.20),
});

const correctPlacidusHouses = Object.freeze([
  Object.freeze({ number: 1, label: '1 дом', text: '1 дом — Водолей 14°57′' }),
  Object.freeze({ number: 4, label: '4 дом', text: '4 дом — Близнецы 14°16′' }),
  Object.freeze({ number: 5, label: '5 дом', text: '5 дом — Близнецы 29°46′' }),
  Object.freeze({ number: 6, label: '6 дом', text: '6 дом — Рак 16°42′' }),
  Object.freeze({ number: 7, label: '7 дом', text: '7 дом — Лев 14°57′' }),
  Object.freeze({ number: 10, label: '10 дом', text: '10 дом — Стрелец 14°16′' }),
  Object.freeze({ number: 11, label: '11 дом', text: '11 дом — Стрелец 29°46′' }),
  Object.freeze({ number: 12, label: '12 дом', text: '12 дом — Козерог 16°42′' }),
]);

const stalePlacidusHouses = Object.freeze([
  Object.freeze({ number: 1, label: '1 дом', text: '1 дом — Водолей 14°47′' }),
  Object.freeze({ number: 4, label: '4 дом', text: '4 дом — Близнецы 14°12′' }),
  Object.freeze({ number: 5, label: '5 дом', text: '5 дом — Близнецы 29°42′' }),
  Object.freeze({ number: 6, label: '6 дом', text: '6 дом — Рак 16°36′' }),
  Object.freeze({ number: 7, label: '7 дом', text: '7 дом — Лев 14°47′' }),
  Object.freeze({ number: 10, label: '10 дом', text: '10 дом — Стрелец 14°12′' }),
  Object.freeze({ number: 11, label: '11 дом', text: '11 дом — Стрелец 29°42′' }),
  Object.freeze({ number: 12, label: '12 дом', text: '12 дом — Козерог 16°36′' }),
]);

const correctPlacidusEngineResult = Object.freeze({
  status: 'ready',
  ready: true,
  houseSystem: 'placidus',
  houseSystemLabel: 'Placidus',
  angles: correctPlacidusAngles,
  houses: correctPlacidusHouses,
});

const assignmentResult = Object.freeze({
  status: 'ready',
  ready: true,
  houseSystem: 'placidus',
  houseSystemLabel: 'Placidus',
  assignments: Object.freeze([
    Object.freeze({
      status: 'ready',
      planetKey: 'sun',
      planetLabel: 'Солнце',
      houseSystem: 'placidus',
      houseNumber: 9,
      houseLabel: '9 дом',
      planetLongitude: 123.45,
    }),
    Object.freeze({
      status: 'ready',
      planetKey: 'moon',
      planetLabel: 'Луна',
      houseSystem: 'placidus',
      houseNumber: 6,
      houseLabel: '6 дом',
    }),
  ]),
  summary: Object.freeze({
    text: 'Планеты распределены по домам',
  }),
});

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function assertNoSensitiveOutput(value) {
  const json = JSON.stringify(value);

  assert.equal(json.includes('birthDate'), false);
  assert.equal(json.includes('birthTime'), false);
  assert.equal(json.includes('utcDateTime'), false);
  assert.equal(json.includes('timezone'), false);
  assert.equal(json.includes('Europe/Moscow'), false);
  assert.equal(json.includes('coordinates'), false);
  assert.equal(json.includes('birthPlace'), false);
  assert.equal(json.includes('latitude'), false);
  assert.equal(json.includes('55.7558'), false);
  assert.equal(json.includes('37.6173'), false);
  assert.equal(json.includes('planetLongitude'), false);
  assert.equal(json.includes('123.45'), false);
  assert.equal(json.includes('provider'), false);
  assert.equal(json.includes('fullProfile'), false);
  assert.equal(json.includes('NaN'), false);
  assert.equal(json.includes('undefined'), false);
}

function assertNoFatalisticText(value) {
  const json = JSON.stringify(value).toLowerCase();

  [
    'сильный дом',
    'слабый дом',
    'фатально',
    'кармически',
    'ритуал',
    'interpretation',
    'transit',
  ].forEach((fragment) => {
    assert.equal(json.includes(fragment), false);
  });
}

test('formats angles, house-system labels, houses and planet assignments safely', () => {
  assert.deepEqual(formatHouseAngle(angles.asc), {
    type: 'angle',
    key: 'asc',
    title: 'ASC',
    text: 'ASC — Овен 14°30′',
  });
  assert.deepEqual(formatHouseAngle(angles.mc), {
    type: 'angle',
    key: 'mc',
    title: 'MC',
    text: 'MC — Козерог 3°18′',
  });
  assert.deepEqual(formatHouseAngle({
    key: 'ic',
    label: 'IC',
    sign: cancer,
    degree: 16,
    minutes: 36,
    seconds: 56,
  }), {
    type: 'angle',
    key: 'ic',
    title: 'IC',
    text: 'IC — Рак 16°36′56″',
  });
  assert.deepEqual(formatHouseAngle({ key: 'asc', label: 'ASC' }), null);

  assert.deepEqual(formatHouseAngles(angles).map((item) => item.key), ['asc', 'mc', 'dsc', 'ic']);
  assert.deepEqual(formatHouseSystemLabel('whole-sign', 'Whole Sign'), {
    type: 'houseSystem',
    text: 'Система домов: Whole Sign',
    houseSystem: 'whole-sign',
  });
  assert.equal(formatHouseSystemLabel('equal-house', 'Равнодомная').text, 'Система домов: Равнодомная');
  assert.equal(formatHouseSystemLabel('placidus', 'Placidus').text, 'Система домов: Placidus');

  assert.deepEqual(formatHouseItem(wholeSignResult.houses[0]), {
    type: 'house',
    number: 1,
    text: '1 дом — Овен',
  });
  assert.deepEqual(formatHouseItem(cuspHouse), {
    type: 'house',
    number: 1,
    text: '1 дом — Овен 14°30′',
  });
  assert.equal(formatHouseItem({ number: 1, cusp: { longitude: 14.5 } }), null);
  assert.equal(JSON.stringify(formatHouseItem(cuspHouse)).includes('14.5'), false);
  assert.deepEqual(formatHouseList(wholeSignResult.houses).map((item) => item.number), [1, 2]);

  assert.deepEqual(formatPlanetHouseAssignment(assignmentResult.assignments[0]), {
    type: 'planetHouse',
    planet: 'Солнце',
    text: 'Солнце — 9 дом',
    houseNumber: 9,
  });
  assert.equal(formatPlanetHouseAssignment({ status: 'invalid', planetLabel: 'Солнце' }), null);
  assert.deepEqual(
    formatPlanetHouseAssignmentList(assignmentResult.assignments).map((item) => item.planet),
    ['Солнце', 'Луна'],
  );
});

test('formats ready, router, fallback and combined display results', () => {
  const whole = formatHousesResult(wholeSignResult);
  const equal = formatHousesResult(equalHouseResult);
  const placidus = formatHousesResult(placidusResult);
  const router = formatHousesResult(routerResult);
  const notReady = formatHousesResult({
    status: 'notReady',
    ready: false,
    reason: 'missingExactBirthTime',
    message: 'Для расчета нужны точное время рождения и место рождения с координатами.',
  });
  const unsupported = formatHousesResult({
    status: 'unsupported',
    ready: false,
    reason: 'unknownHouseSystem',
    message: 'Выбрана неизвестная система домов.',
  });
  const combined = formatHousesWithPlanetAssignments({
    houseResult: routerResult,
    assignmentResult,
  });
  const housesOnly = formatHousesWithPlanetAssignments({ houseResult: wholeSignResult });
  const summary = summarizeHousesDisplay(combined);

  assert.equal(whole.status, 'ready');
  assert.equal(whole.summary, 'Система домов: Whole Sign');
  assert.equal(equal.summary, 'Система домов: Равнодомная');
  assert.equal(placidus.summary, 'Система домов: Placidus');
  assert.equal(router.houseSystem, 'placidus');
  assert.equal(router.houses[0].text, '1 дом — Овен 14°30′');
  assert.equal(notReady.status, 'notReady');
  assert.equal(notReady.summary, 'Пока недоступно.');
  assert.deepEqual(notReady.angles, []);
  assert.deepEqual(notReady.houses, []);
  assert.equal(unsupported.status, 'unsupported');
  assert.equal(unsupported.message, 'Выбрана неизвестная система домов.');
  assert.equal(combined.planetAssignments.length, 2);
  assert.equal(combined.summary, 'Система домов: Placidus · Планеты распределены по домам');
  assert.equal(housesOnly.planetAssignments.length, 0);
  assert.deepEqual(summary, {
    status: 'ready',
    text: 'Дома и углы карты рассчитаны',
    houseSystem: 'placidus',
    houseCount: 1,
    angleCount: 4,
    planetAssignments: 2,
  });
  assert.equal(summarizeHousesDisplay(notReady).text, 'Дома и углы карты недоступны');
});

test('router display uses one unwrapped house result source for Placidus angles and houses', () => {
  const mixedRouterResult = Object.freeze({
    status: 'ready',
    ready: true,
    selectedHouseSystem: 'placidus',
    houseSystem: 'placidus',
    houseSystemLabel: 'Placidus',
    result: correctPlacidusEngineResult,
    angles: stalePlacidusAngles,
    houses: stalePlacidusHouses,
  });

  const display = formatHousesResult(mixedRouterResult);

  assert.deepEqual(display.angles.map((item) => item.text), [
    'ASC — Водолей 14°57′',
    'MC — Стрелец 14°16′',
    'DSC — Лев 14°57′',
    'IC — Близнецы 14°16′',
  ]);
  assert.deepEqual(display.houses.map((item) => item.text), correctPlacidusHouses.map((house) => house.text));
  assert.equal(JSON.stringify(display).includes('ASC — Водолей 14°47′'), false);
  assert.equal(JSON.stringify(display).includes('5 дом — Близнецы 29°42′'), false);
});

test('display helper excludes raw data, unsafe words and mutations', () => {
  const input = clone(routerResult);
  const assignments = clone(assignmentResult);
  const display = formatHousesWithPlanetAssignments({
    houseResult: input,
    assignmentResult: assignments,
  });
  const limitations = getHousesDisplayLimitations();

  assertNoSensitiveOutput(display);
  assertNoFatalisticText(display);
  assert.equal(isDisplayableHouseItem({ text: '1 дом — Овен' }), true);
  assert.equal(isDisplayableHouseItem({ text: 'birthDate: 1990-01-01' }), false);
  assert.equal(isDisplayableHouseItem({ text: 'longitude: 14.5' }), false);
  assert.equal(isDisplayableHouseItem({ text: 'фатально сильный дом' }), false);
  assert.equal(limitations.some((item) => item.includes('точным временем рождения')), true);
  assert.deepEqual(input, clone(routerResult));
  assert.deepEqual(assignments, clone(assignmentResult));
});

test('source boundaries stay display-only', async () => {
  const source = await readFile(MODULE_PATH, 'utf8');

  [
    'wholeSignHouses',
    'equalHouseHouses',
    'placidusHouses',
    'houseSystemResolver',
    'planetInHouses',
    'Provider',
    'localStorage',
    'document.',
    'window.',
    'astronomy-engine',
    'swisseph',
    'calculateWholeSign',
    'calculateEqual',
    'calculatePlacidus',
    'assignPlanet',
    'assignPlanets',
  ].forEach((fragment) => {
    assert.equal(source.includes(fragment), false, fragment);
  });
});
