import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import {
  calculateEqualHouseCusps,
  calculateEqualHouseHouses,
  calculateEqualHousesForProfile,
  calculateEqualHousesFromAscMc,
  getEqualHouseCalculationLimitations,
  getEqualHouseCuspLongitudes,
  getEqualHouseCuspSequence,
  getEqualHouseEngineCapabilities,
  isEqualHouseSystemValue,
  isSupportedEqualHouseInput,
  normalizeEqualHouseSystemValue,
} from '../src/equalHouseHouses.js';

const ariesAsc = Object.freeze({
  key: 'asc',
  label: 'ASC',
  longitude: 14.5,
  sign: Object.freeze({ key: 'aries', ru: 'Овен', symbol: '♈' }),
  degree: 14,
  minutes: 30,
  text: 'Овен 14°30′',
});

const piscesAsc = Object.freeze({
  key: 'asc',
  label: 'ASC',
  longitude: 359,
  sign: Object.freeze({ key: 'pisces', ru: 'Рыбы', symbol: '♓' }),
  degree: 29,
  minutes: 0,
  text: 'Рыбы 29°00′',
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
  id: 'profile-equal-house-ready',
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
  houseSystem: 'equal',
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
  assert.equal(json.includes('"profile-equal-house-ready"'), false);
  assert.equal(json.includes('NaN'), false);
  assert.equal(json.includes('undefined'), false);
}

test('calculateEqualHouseCusps returns 12 cusps from exact Aries ASC longitude', () => {
  const result = calculateEqualHouseCusps(ariesAsc);

  assert.equal(result.status, 'ready');
  assert.equal(result.ready, true);
  assert.equal(result.houseSystem, 'equal-house');
  assert.equal(result.houseSystemLabel, 'Равнодомная');
  assert.equal(result.cusps.length, 12);
  assert.equal(result.cusps[0].longitude, 14.5);
  assert.equal(result.cusps[0].sign.key, 'aries');
  assert.equal(result.cusps[0].degree, 14);
  assert.equal(result.cusps[0].minutes, 30);
  assert.equal(result.cusps[0].seconds, 0);
  assert.equal(result.cusps[0].label, 'Куспид 1 дома');
  assert.equal(result.cusps[0].text, '1 дом — Овен 14°30′00″');
  assert.deepEqual(result.cusps.map((cusp) => cusp.sign.key), [
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
  assert.deepEqual(result.cusps.map((cusp) => cusp.number), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  assert.equal(result.cusps[11].longitude, 344.5);
  assert.equal(result.cusps[11].text, '12 дом — Рыбы 14°30′00″');
});

test('calculateEqualHouseCusps shows visible cusp seconds without changing longitude', () => {
  const asc = Object.freeze({
    ...ariesAsc,
    longitude: 90 + 16 + (36 / 60) + (56 / 3600),
    sign: Object.freeze({ key: 'cancer', ru: 'Рак', symbol: '♋' }),
    degree: 16,
    minutes: 36,
    text: 'Рак 16°36′',
  });

  const result = calculateEqualHouseCusps(asc);

  assert.equal(result.cusps[0].longitude, asc.longitude);
  assert.equal(result.cusps[0].sign.key, 'cancer');
  assert.equal(result.cusps[0].degree, 16);
  assert.equal(result.cusps[0].minutes, 36);
  assert.equal(result.cusps[0].seconds, 56);
  assert.equal(result.cusps[0].text, '1 дом — Рак 16°36′56″');
});

test('calculateEqualHouseCusps wraps Pisces 29 ASC through Aries 29', () => {
  const result = calculateEqualHouseCusps(piscesAsc);

  assert.deepEqual(result.cusps.map((cusp) => cusp.sign.key), [
    'pisces',
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
  ]);
  assert.deepEqual(result.cusps.map((cusp) => cusp.longitude), [
    359,
    29,
    59,
    89,
    119,
    149,
    179,
    209,
    239,
    269,
    299,
    329,
  ]);
  assert.equal(result.cusps[0].text, '1 дом — Рыбы 29°00′00″');
  assert.equal(result.cusps[1].text, '2 дом — Овен 29°00′00″');
});

test('calculateEqualHouseHouses returns 12 houses with next cusp and wrap flags', () => {
  const aries = calculateEqualHouseHouses(ariesAsc);
  const pisces = calculateEqualHouseHouses(piscesAsc);

  assert.equal(aries.status, 'ready');
  assert.equal(aries.houseSystem, 'equal-house');
  assert.equal(aries.houseSystemLabel, 'Равнодомная');
  assert.equal(aries.houses.length, 12);
  assert.equal(aries.houses[0].number, 1);
  assert.equal(aries.houses[0].cusp.longitude, 14.5);
  assert.equal(aries.houses[0].nextCuspLongitude, 44.5);
  assert.equal(aries.houses[0].wraps, false);
  assert.equal(aries.houses[11].nextCuspLongitude, 14.5);
  assert.equal(aries.houses[11].wraps, true);
  assert.equal(aries.houses[0].text, '1 дом — Овен 14°30′00″');
  assert.equal(pisces.houses[0].cusp.longitude, 359);
  assert.equal(pisces.houses[0].nextCuspLongitude, 29);
  assert.equal(pisces.houses[0].wraps, true);
});

test('Equal House uses exact ASC longitude and does not anchor at Aries 0 unless ASC is Aries 0', () => {
  const aries = calculateEqualHouseHouses(ariesAsc);
  const ariesZero = calculateEqualHouseHouses({ ...ariesAsc, longitude: 0 });

  assert.equal(aries.houses[0].cusp.longitude, 14.5);
  assert.notEqual(aries.houses[0].cusp.longitude, 0);
  assert.equal(ariesZero.houses[0].cusp.longitude, 0);
});

test('Equal House system value helpers respect current profile aliases without routing other systems', () => {
  assert.equal(isEqualHouseSystemValue('equal'), true);
  assert.equal(isEqualHouseSystemValue('equal-house'), true);
  assert.equal(isEqualHouseSystemValue('equalHouse'), true);
  assert.equal(isEqualHouseSystemValue('wholeSign'), false);
  assert.equal(isEqualHouseSystemValue('whole-sign'), false);
  assert.equal(isEqualHouseSystemValue('placidus'), false);
  assert.equal(isEqualHouseSystemValue('Placidus'), false);

  assert.equal(normalizeEqualHouseSystemValue('equal'), 'equal-house');
  assert.equal(normalizeEqualHouseSystemValue('equal-house'), 'equal-house');
  assert.equal(normalizeEqualHouseSystemValue('equalHouse'), 'equal-house');
  assert.equal(normalizeEqualHouseSystemValue('wholeSign'), 'whole-sign');
  assert.equal(normalizeEqualHouseSystemValue('whole-sign'), 'whole-sign');
  assert.equal(normalizeEqualHouseSystemValue('placidus'), 'placidus');
  assert.equal(normalizeEqualHouseSystemValue('unknown'), null);
  assert.equal(normalizeEqualHouseSystemValue(null), null);
});

test('cusp longitude helpers normalize values and fail closed', () => {
  assert.deepEqual(getEqualHouseCuspLongitudes(14.5), [
    14.5,
    44.5,
    74.5,
    104.5,
    134.5,
    164.5,
    194.5,
    224.5,
    254.5,
    284.5,
    314.5,
    344.5,
  ]);
  assert.deepEqual(getEqualHouseCuspLongitudes(359), [359, 29, 59, 89, 119, 149, 179, 209, 239, 269, 299, 329]);
  assert.deepEqual(getEqualHouseCuspLongitudes(NaN), []);
  assert.deepEqual(getEqualHouseCuspSequence(ariesAsc).map((cusp) => cusp.longitude), getEqualHouseCuspLongitudes(14.5));
});

test('calculateEqualHouseHouses validates ASC longitude without mutating input', () => {
  const asc = clone(ariesAsc);
  const result = calculateEqualHouseHouses(asc);
  const missing = calculateEqualHouseHouses(null);
  const signOnly = calculateEqualHouseHouses({ sign: { key: 'aries' } });

  assert.equal(isSupportedEqualHouseInput(asc), true);
  assert.equal(isSupportedEqualHouseInput({ sign: { key: 'aries' } }), false);
  assert.equal(isSupportedEqualHouseInput({ ...asc, longitude: Infinity }), false);
  assert.equal(result.status, 'ready');
  assert.equal(missing.status, 'notReady');
  assert.equal(missing.reason, 'missingAsc');
  assert.equal(signOnly.reason, 'missingAscLongitude');
  assert.deepEqual(asc, clone(ariesAsc));
});

test('calculateEqualHousesFromAscMc handles null notReady and ready ASC MC results', () => {
  const missing = calculateEqualHousesFromAscMc(null);
  const notReady = calculateEqualHousesFromAscMc({
    status: 'notReady',
    ready: false,
    reason: 'missingExactBirthTime',
    message: 'Для расчета домов нужно точное время рождения.',
    angles: null,
  });
  const ready = calculateEqualHousesFromAscMc(readyAscMcResult);

  assert.equal(missing.status, 'notReady');
  assert.equal(missing.reason, 'missingAscMc');
  assert.equal(notReady.status, 'notReady');
  assert.equal(notReady.reason, 'ascMcNotReady');
  assert.equal(ready.status, 'ready');
  assert.equal(ready.houses.length, 12);
  assert.equal(ready.cusps.length, 12);
  assert.equal(ready.angles.asc, readyAscMcResult.angles.asc);
  assert.equal(ready.angles.mc, readyAscMcResult.angles.mc);
  assert.equal(ready.angles.dsc, readyAscMcResult.angles.dsc);
  assert.equal(ready.angles.ic, readyAscMcResult.angles.ic);
});

test('calculateEqualHousesForProfile fails closed for missing profile time and coordinates when selected equal', () => {
  const missingProfile = calculateEqualHousesForProfile(null);
  const unknownTime = calculateEqualHousesForProfile({
    ...clone(readyProfile),
    birthTime: '',
    birthTimeAccuracy: 'unknown',
  });
  const missingCoordinates = calculateEqualHousesForProfile({
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

test('calculateEqualHousesForProfile respects selected non-Equal house systems and missing selection', () => {
  const wholeSign = calculateEqualHousesForProfile({
    ...clone(readyProfile),
    houseSystem: 'wholeSign',
  });
  const placidus = calculateEqualHousesForProfile({
    ...clone(readyProfile),
    houseSystem: 'placidus',
  });
  const missing = clone(readyProfile);
  delete missing.houseSystem;
  const missingSelection = calculateEqualHousesForProfile(missing);

  assert.equal(wholeSign.status, 'unsupported');
  assert.equal(wholeSign.reason, 'selectedHouseSystemNotEqualHouse');
  assert.equal(wholeSign.selectedHouseSystem, 'whole-sign');
  assert.equal(wholeSign.houseSystem, 'equal-house');
  assert.equal(wholeSign.message, 'Выбрана другая система домов. Равнодомный engine не выполняет расчет для Whole Sign.');
  assert.equal(placidus.status, 'unsupported');
  assert.equal(placidus.selectedHouseSystem, 'placidus');
  assert.equal(placidus.message, 'Выбрана другая система домов. Равнодомный engine не выполняет расчет для Placidus.');
  assert.equal(missingSelection.status, 'unsupported');
  assert.equal(missingSelection.reason, 'selectedHouseSystemNotEqualHouse');
  assert.equal(missingSelection.selectedHouseSystem, null);
  [wholeSign, placidus, missingSelection].forEach(assertSafeProfileOutput);
});

test('calculateEqualHousesForProfile returns ready for Equal profile and preserves profile input', () => {
  const profile = clone(readyProfile);
  const before = clone(profile);
  const result = calculateEqualHousesForProfile(profile);

  assert.equal(result.status, 'ready');
  assert.equal(result.ready, true);
  assert.equal(result.houseSystem, 'equal-house');
  assert.equal(result.houseSystemLabel, 'Равнодомная');
  assert.equal(result.houses.length, 12);
  assert.equal(result.cusps.length, 12);
  assert.equal(result.angles.asc.key, 'asc');
  assert.equal(result.angles.mc.key, 'mc');
  assert.equal(result.angles.dsc.key, 'dsc');
  assert.equal(result.angles.ic.key, 'ic');
  assert.deepEqual(profile, before);
  assertSafeProfileOutput(result);
});

test('capabilities and limitations keep Equal House scoped and explicit', () => {
  const capabilities = getEqualHouseEngineCapabilities();
  const limitations = getEqualHouseCalculationLimitations();

  assert.deepEqual(capabilities, {
    houses: true,
    equalHouse: true,
    wholeSign: false,
    placidus: false,
    quadrantCusps: false,
    exactCusps: true,
    ascMcRequired: true,
    planetInHouse: false,
    interpretations: false,
    transits: false,
    fixedStars: false,
  });
  assert.equal(limitations.some((item) => item.includes('только равнодомная система')), true);
  assert.equal(limitations.some((item) => item.includes('точного градуса ASC')), true);
  assert.equal(limitations.some((item) => item.includes('не обязательно является куспидом 10 дома')), true);
  assert.equal(limitations.some((item) => item.includes('Whole Sign и Placidus')), true);
  assert.equal(limitations.some((item) => item.includes('не распределяет планеты')), true);
});

test('Equal House output avoids NaN undefined private data and unsupported feature claims', () => {
  const outputs = [
    calculateEqualHouseCusps(ariesAsc),
    calculateEqualHouseHouses(ariesAsc),
    calculateEqualHousesFromAscMc(readyAscMcResult),
    calculateEqualHousesForProfile(clone(readyProfile)),
    getEqualHouseCalculationLimitations(),
    getEqualHouseEngineCapabilities(),
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
  assert.equal(json.includes('Whole Sign engine'), false);
  assert.equal(/фаталь|карми|плохой|плохая|плохое/i.test(json), false);
});

test('module stays scoped to Equal House without providers DOM storage Whole Sign Placidus or planet assignment', async () => {
  const source = await readFile(new URL('../src/equalHouseHouses.js', import.meta.url), 'utf8');

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
  assert.equal(source.includes("from './wholeSignHouses.js'"), false);
  assert.equal(source.includes('calculateWholeSignHouses'), false);
  assert.equal(source.includes('calculatePlacidus'), false);
  assert.equal(source.includes('assignPlanet'), false);
  assert.equal(source.includes('planetInHouse: true'), false);
  assert.equal(source.includes('quadrantCusps: true'), false);
});
