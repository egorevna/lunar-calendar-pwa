import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import {
  calculateWholeSignHouses,
  calculateWholeSignHousesForProfile,
  calculateWholeSignHousesFromAscMc,
  getWholeSignHouseForSign,
  getWholeSignHouseSequence,
  getWholeSignHousesCalculationLimitations,
  getWholeSignHousesEngineCapabilities,
  isSupportedWholeSignHouseInput,
  isWholeSignHouseSystemValue,
  normalizeWholeSignHouseSystemValue,
} from '../src/wholeSignHouses.js';

const ariesAsc = Object.freeze({
  key: 'asc',
  label: 'ASC',
  longitude: 14.5,
  sign: Object.freeze({ key: 'aries', ru: 'Овен', symbol: '♈' }),
  degree: 14,
  minutes: 30,
  text: 'Овен 14°30′',
});

const scorpioAsc = Object.freeze({
  key: 'asc',
  label: 'ASC',
  longitude: 224.5,
  sign: Object.freeze({ key: 'scorpio', ru: 'Скорпион', symbol: '♏' }),
  degree: 14,
  minutes: 30,
  text: 'Скорпион 14°30′',
});

const readyAscMcResult = Object.freeze({
  status: 'ready',
  ready: true,
  houseSystem: 'whole-sign',
  angles: Object.freeze({
    asc: ariesAsc,
    mc: Object.freeze({
      key: 'mc',
      label: 'MC',
      longitude: 270,
      sign: Object.freeze({ key: 'capricorn', ru: 'Козерог', symbol: '♑' }),
      degree: 0,
      minutes: 0,
      text: 'Козерог 0°00′',
    }),
    dsc: Object.freeze({
      key: 'dsc',
      label: 'DSC',
      longitude: 194.5,
      sign: Object.freeze({ key: 'libra', ru: 'Весы', symbol: '♎' }),
      degree: 14,
      minutes: 30,
      text: 'Весы 14°30′',
    }),
    ic: Object.freeze({
      key: 'ic',
      label: 'IC',
      longitude: 90,
      sign: Object.freeze({ key: 'cancer', ru: 'Рак', symbol: '♋' }),
      degree: 0,
      minutes: 0,
      text: 'Рак 0°00′',
    }),
  }),
});

const readyProfile = Object.freeze({
  id: 'profile-whole-sign-ready',
  name: 'Анна',
  birthDate: '1990-01-01',
  birthTime: '12:00',
  birthTimeAccuracy: 'exact',
  birthPlace: Object.freeze({
    city: 'Москва',
    country: 'Россия',
    latitude: 55.7558,
    longitude: 37.6173,
    timezone: 'Europe/Moscow',
  }),
  currentPlace: Object.freeze({
    mode: 'moscow',
    city: 'Москва',
    country: 'Россия',
    latitude: null,
    longitude: null,
    timezone: 'Europe/Moscow',
  }),
  houseSystem: 'wholeSign',
  zodiac: 'tropical',
});

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function assertSafeProfileOutput(value) {
  const json = JSON.stringify(value);

  assert.equal(json.includes('1990-01-01'), false);
  assert.equal(json.includes('12:00'), false);
  assert.equal(json.includes('Europe/Moscow'), false);
  assert.equal(json.includes('55.7558'), false);
  assert.equal(json.includes('37.6173'), false);
  assert.equal(json.includes('"birthDate"'), false);
  assert.equal(json.includes('"birthTime"'), false);
  assert.equal(json.includes('"birthPlace"'), false);
  assert.equal(json.includes('"profile-whole-sign-ready"'), false);
  assert.equal(json.includes('NaN'), false);
  assert.equal(json.includes('undefined'), false);
}

test('calculateWholeSignHouses returns 12 Aries-anchored houses', () => {
  const result = calculateWholeSignHouses(ariesAsc);

  assert.equal(result.status, 'ready');
  assert.equal(result.ready, true);
  assert.equal(result.houseSystem, 'whole-sign');
  assert.equal(result.houseSystemLabel, 'Whole Sign');
  assert.equal(result.houses.length, 12);
  assert.deepEqual(result.houses.map((house) => house.sign.key), [
    'aries',
    'taurus',
    'gemini',
    'cancer',
    'leo',
    'virgo',
    'libra',
    'scorpio',
    'sagittarius',
    'capricorn',
    'aquarius',
    'pisces',
  ]);
  assert.deepEqual(result.houses.map((house) => house.number), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  assert.equal(result.houses[0].text, '1 дом — Овен');
  assert.equal(result.houses[11].text, '12 дом — Рыбы');
  assert.equal(result.houses[11].signStartLongitude, 330);
  assert.equal(result.houses[11].signEndLongitude, 0);
  assert.equal(result.angles.asc, ariesAsc);
});

test('calculateWholeSignHouses wraps Scorpio sequence through Libra as house 12', () => {
  const result = calculateWholeSignHouses(scorpioAsc);

  assert.deepEqual(result.houses.map((house) => house.sign.key), [
    'scorpio',
    'sagittarius',
    'capricorn',
    'aquarius',
    'pisces',
    'aries',
    'taurus',
    'gemini',
    'cancer',
    'leo',
    'virgo',
    'libra',
  ]);
  assert.equal(result.houses[0].sign.key, 'scorpio');
  assert.equal(result.houses[11].sign.key, 'libra');
});

test('Whole Sign helpers return house numbers and sequences safely', () => {
  assert.equal(getWholeSignHouseForSign('aries', 'aries'), 1);
  assert.equal(getWholeSignHouseForSign('aries', 'pisces'), 12);
  assert.equal(getWholeSignHouseForSign('scorpio', 'libra'), 12);
  assert.equal(getWholeSignHouseForSign('bad', 'aries'), null);
  assert.equal(getWholeSignHouseForSign('aries', 'bad'), null);
  assert.deepEqual(getWholeSignHouseSequence('scorpio'), [
    'scorpio',
    'sagittarius',
    'capricorn',
    'aquarius',
    'pisces',
    'aries',
    'taurus',
    'gemini',
    'cancer',
    'leo',
    'virgo',
    'libra',
  ]);
  assert.deepEqual(getWholeSignHouseSequence('bad'), []);
});

test('Whole Sign house system value helpers respect current profile aliases without routing other systems', () => {
  assert.equal(isWholeSignHouseSystemValue('wholeSign'), true);
  assert.equal(isWholeSignHouseSystemValue('whole-sign'), true);
  assert.equal(isWholeSignHouseSystemValue('placidus'), false);
  assert.equal(isWholeSignHouseSystemValue('Placidus'), false);
  assert.equal(isWholeSignHouseSystemValue('equal'), false);
  assert.equal(isWholeSignHouseSystemValue('equal-house'), false);

  assert.equal(normalizeWholeSignHouseSystemValue('wholeSign'), 'whole-sign');
  assert.equal(normalizeWholeSignHouseSystemValue('whole-sign'), 'whole-sign');
  assert.equal(normalizeWholeSignHouseSystemValue('equal'), 'equal-house');
  assert.equal(normalizeWholeSignHouseSystemValue('equal-house'), 'equal-house');
  assert.equal(normalizeWholeSignHouseSystemValue('placidus'), 'placidus');
  assert.equal(normalizeWholeSignHouseSystemValue('unknown'), null);
  assert.equal(normalizeWholeSignHouseSystemValue(null), null);
});

test('calculateWholeSignHouses validates ASC input without mutating it', () => {
  const asc = clone(ariesAsc);
  const result = calculateWholeSignHouses(asc);
  const missing = calculateWholeSignHouses(null);
  const invalid = calculateWholeSignHouses({ sign: { key: 'bad' } });

  assert.equal(isSupportedWholeSignHouseInput(asc), true);
  assert.equal(isSupportedWholeSignHouseInput({ ...asc, longitude: Infinity }), false);
  assert.equal(result.status, 'ready');
  assert.equal(missing.status, 'notReady');
  assert.equal(missing.reason, 'missingAsc');
  assert.equal(invalid.reason, 'invalidAsc');
  assert.deepEqual(asc, clone(ariesAsc));
});

test('calculateWholeSignHousesFromAscMc handles null notReady and ready ASC MC results', () => {
  const missing = calculateWholeSignHousesFromAscMc(null);
  const notReady = calculateWholeSignHousesFromAscMc({
    status: 'notReady',
    ready: false,
    reason: 'missingExactBirthTime',
    message: 'Для расчета домов нужно точное время рождения.',
    angles: null,
  });
  const ready = calculateWholeSignHousesFromAscMc(readyAscMcResult);

  assert.equal(missing.status, 'notReady');
  assert.equal(missing.reason, 'missingAscMc');
  assert.equal(notReady.status, 'notReady');
  assert.equal(notReady.reason, 'ascMcNotReady');
  assert.equal(ready.status, 'ready');
  assert.equal(ready.houses.length, 12);
  assert.equal(ready.angles.asc, readyAscMcResult.angles.asc);
  assert.equal(ready.angles.mc, readyAscMcResult.angles.mc);
  assert.equal(ready.angles.dsc, readyAscMcResult.angles.dsc);
  assert.equal(ready.angles.ic, readyAscMcResult.angles.ic);
});

test('calculateWholeSignHousesForProfile fails closed for missing profile time and coordinates', () => {
  const missingProfile = calculateWholeSignHousesForProfile(null);
  const unknownTime = calculateWholeSignHousesForProfile({
    ...clone(readyProfile),
    birthTime: '',
    birthTimeAccuracy: 'unknown',
  });
  const missingCoordinates = calculateWholeSignHousesForProfile({
    ...clone(readyProfile),
    birthPlace: {
      ...clone(readyProfile).birthPlace,
      latitude: null,
      longitude: null,
    },
  });

  assert.equal(missingProfile.status, 'notReady');
  assert.equal(missingProfile.reason, 'missingProfile');
  assert.equal(unknownTime.status, 'notReady');
  assert.equal(unknownTime.reason, 'missingExactBirthTime');
  assert.equal(missingCoordinates.status, 'notReady');
  assert.equal(missingCoordinates.reason, 'cityWithoutCoordinates');
  [missingProfile, unknownTime, missingCoordinates].forEach(assertSafeProfileOutput);
});

test('calculateWholeSignHousesForProfile respects selected non-Whole-Sign house systems', () => {
  const placidus = calculateWholeSignHousesForProfile({
    ...clone(readyProfile),
    houseSystem: 'placidus',
  });
  const equal = calculateWholeSignHousesForProfile({
    ...clone(readyProfile),
    houseSystem: 'equal',
  });

  assert.equal(placidus.status, 'unsupported');
  assert.equal(placidus.ready, false);
  assert.equal(placidus.reason, 'selectedHouseSystemNotWholeSign');
  assert.equal(placidus.selectedHouseSystem, 'placidus');
  assert.equal(placidus.houseSystem, 'whole-sign');
  assert.equal(placidus.message, 'Выбрана другая система домов. Whole Sign engine не выполняет расчет для Placidus.');
  assert.equal(equal.status, 'unsupported');
  assert.equal(equal.selectedHouseSystem, 'equal-house');
  assert.equal(equal.message, 'Выбрана другая система домов. Whole Sign engine не выполняет расчет для Equal House.');
  assertSafeProfileOutput(placidus);
  assertSafeProfileOutput(equal);
});

test('calculateWholeSignHousesForProfile returns ready for Whole Sign profile and preserves profile input', () => {
  const profile = clone(readyProfile);
  const before = clone(profile);
  const result = calculateWholeSignHousesForProfile(profile);

  assert.equal(result.status, 'ready');
  assert.equal(result.ready, true);
  assert.equal(result.houseSystem, 'whole-sign');
  assert.equal(result.houseSystemLabel, 'Whole Sign');
  assert.equal(result.houses.length, 12);
  assert.equal(result.angles.asc.key, 'asc');
  assert.equal(result.angles.mc.key, 'mc');
  assert.equal(result.angles.dsc.key, 'dsc');
  assert.equal(result.angles.ic.key, 'ic');
  assert.deepEqual(profile, before);
  assertSafeProfileOutput(result);
});

test('capabilities and limitations keep Whole Sign scoped and explicit', () => {
  const capabilities = getWholeSignHousesEngineCapabilities();
  const limitations = getWholeSignHousesCalculationLimitations();

  assert.deepEqual(capabilities, {
    houses: true,
    wholeSign: true,
    equalHouse: false,
    placidus: false,
    quadrantCusps: false,
    exactCusps: false,
    ascMcRequired: true,
    planetInHouse: false,
    interpretations: false,
    transits: false,
    fixedStars: false,
  });
  assert.equal(limitations.some((item) => item.includes('только система Whole Sign')), true);
  assert.equal(limitations.some((item) => item.includes('не обязательно является куспидом 10 дома')), true);
  assert.equal(limitations.some((item) => item.includes('Equal House и Placidus')), true);
  assert.equal(limitations.some((item) => item.includes('не распределяет планеты')), true);
});

test('Whole Sign output avoids NaN undefined private data and unsupported feature claims', () => {
  const outputs = [
    calculateWholeSignHouses(ariesAsc),
    calculateWholeSignHousesFromAscMc(readyAscMcResult),
    calculateWholeSignHousesForProfile(clone(readyProfile)),
    getWholeSignHousesCalculationLimitations(),
    getWholeSignHousesEngineCapabilities(),
  ];
  const json = JSON.stringify(outputs);

  assert.equal(json.includes('NaN'), false);
  assert.equal(json.includes('undefined'), false);
  assert.equal(json.includes('1990-01-01'), false);
  assert.equal(json.includes('12:00'), false);
  assert.equal(json.includes('55.7558'), false);
  assert.equal(json.includes('37.6173'), false);
  assert.equal(json.includes('"birthPlace"'), false);
  assert.equal(json.includes('"birthDate"'), false);
  assert.equal(json.includes('"birthTime"'), false);
  assert.equal(json.includes('Placidus engine'), false);
  assert.equal(/фаталь|карми|плохой|плохая|плохое/i.test(json), false);
});

test('module stays scoped to Whole Sign without providers DOM storage Equal House Placidus or planet assignment', async () => {
  const source = await readFile(new URL('../src/wholeSignHouses.js', import.meta.url), 'utf8');

  assert.equal(source.includes('astronomy-engine'), false);
  assert.equal(source.includes('astronomyEngineProvider'), false);
  assert.equal(source.includes('planetaryPositionProvider'), false);
  assert.equal(source.includes('natalPlanetsForProfile'), false);
  assert.equal(source.includes('profileStorage'), false);
  assert.equal(source.includes('localStorage'), false);
  assert.equal(source.includes('document.'), false);
  assert.equal(source.includes('window.'), false);
  assert.equal(source.includes("from './houses.js'"), false);
  assert.equal(source.includes("from './houseSystems.js'"), false);
  assert.equal(source.includes('calculateEqualHouse'), false);
  assert.equal(source.includes('calculatePlacidus'), false);
  assert.equal(source.includes('assignPlanet'), false);
  assert.equal(source.includes('planetInHouse: true'), false);
  assert.equal(source.includes('quadrantCusps: true'), false);
});
