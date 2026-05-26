import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { getHousesForProfile } from '../src/housesForProfile.js';

const MODULE_PATH = new URL('../src/housesForProfile.js', import.meta.url);

function validProfile(houseSystem = 'wholeSign') {
  return {
    id: `profile-${houseSystem}`,
    name: 'Егор',
    birthDate: '1990-05-12',
    birthTime: '14:30',
    birthTimeAccuracy: 'exact',
    birthPlace: {
      city: 'Москва',
      country: 'Россия',
      coordinates: {
        latitude: 55.7558,
        longitude: 37.6173,
      },
      timezone: 'Europe/Moscow',
    },
    currentPlace: {
      mode: 'moscow',
      city: 'Москва',
      country: 'Россия',
      timezone: 'Europe/Moscow',
    },
    houseSystem,
    zodiac: 'tropical',
  };
}

function moscowPlacidusReadyStateProfile() {
  return {
    ...validProfile('placidus'),
    id: 'profile-placidus-moscow-1981-regression',
    birthDate: '1981-04-16',
    birthTime: '04:45',
  };
}

function moscowSwissExactProfile() {
  return {
    ...validProfile('placidus'),
    id: 'profile-placidus-moscow-1981-swiss-exact',
    birthDate: '1981-04-16',
    birthTime: '04:45',
    birthPlace: {
      city: 'Москва',
      country: 'Россия',
      coordinates: {
        latitude: 55.7577,
        longitude: 37.5410,
      },
      timezone: 'Europe/Moscow',
    },
  };
}

function assertSafeOutput(value) {
  const json = JSON.stringify(value);

  [
    'birthDate',
    'birthTime',
    'utcDateTime',
    'Europe/Moscow',
    'birthPlace',
    'currentPlace',
    'latitude',
    'coordinates',
    '55.7558',
    '55.7577',
    '37.6173',
    '37.541',
    'planetLongitude',
    'raw',
    'provider',
    'fullProfile',
    'fixedStars',
    'transits',
    'Pars Fortuna',
    'Arabic Parts',
    'ритуал',
    'фатально',
    'кармически',
    'NaN',
    'undefined',
  ].forEach((fragment) => {
    assert.equal(json.includes(fragment), false, fragment);
  });
}

test('getHousesForProfile returns safe fallback for no profile unknown time and missing coordinates', () => {
  const noProfile = getHousesForProfile(null);
  const unknownTime = getHousesForProfile({
    ...validProfile('wholeSign'),
    birthTime: '',
    birthTimeAccuracy: 'unknown',
  });
  const missingCoordinates = getHousesForProfile({
    ...validProfile('wholeSign'),
    birthPlace: {
      city: 'Москва',
      country: 'Россия',
      latitude: null,
      longitude: null,
      timezone: 'Europe/Moscow',
    },
  });

  [noProfile, unknownTime, missingCoordinates].forEach((result) => {
    assert.equal(result.status, 'notReady');
    assert.equal(result.ready, false);
    assert.equal(result.title, 'Дома и углы карты');
    assert.equal(result.summary, 'Пока недоступно.');
    assert.deepEqual(result.angles, []);
    assert.deepEqual(result.houses, []);
    assert.deepEqual(result.planetAssignments, []);
    assertSafeOutput(result);
  });
});

test('getHousesForProfile returns ready view model for Whole Sign Equal House and Placidus profiles', () => {
  const wholeSign = getHousesForProfile(validProfile('wholeSign'));
  const equalHouse = getHousesForProfile(validProfile('equal'));
  const placidus = getHousesForProfile(validProfile('placidus'));

  [
    ['whole-sign', wholeSign],
    ['equal-house', equalHouse],
    ['placidus', placidus],
  ].forEach(([houseSystem, result]) => {
    assert.equal(result.status, 'ready');
    assert.equal(result.ready, true);
    assert.equal(result.title, 'Дома и углы карты');
    assert.equal(result.houseSystem, houseSystem);
    assert.equal(result.summary.startsWith('Система домов: '), true);
    assert.equal(result.angles.length, 4);
    assert.equal(result.houses.length, 12);
    assert.equal(result.planetAssignments.length, 10);
    assert.equal(result.angles.some((item) => item.text.startsWith('ASC — ')), true);
    assert.equal(result.houses[0].text.startsWith('1 дом — '), true);
    assert.equal(result.planetAssignments.some((item) => item.text.startsWith('Солнце — ')), true);
    assertSafeOutput(result);
  });
});

test('getHousesForProfile keeps Moscow 1981 Placidus house rows distinct', () => {
  const result = getHousesForProfile(moscowPlacidusReadyStateProfile());
  const expectedRows = [
    '1 дом — Водолей 14°57′17″',
    '2 дом — Овен 24°02′09″',
    '3 дом — Телец 25°30′04″',
    '4 дом — Близнецы 14°16′58″',
    '5 дом — Близнецы 29°46′49″',
    '6 дом — Рак 16°42′10″',
    '7 дом — Лев 14°57′17″',
    '8 дом — Весы 24°02′09″',
    '9 дом — Скорпион 25°30′04″',
    '10 дом — Стрелец 14°16′58″',
    '11 дом — Стрелец 29°46′49″',
    '12 дом — Козерог 16°42′10″',
  ];
  const rows = result.houses.map((house) => house.text);

  assert.equal(result.status, 'ready');
  assert.equal(result.houseSystem, 'placidus');
  assert.deepEqual(rows, expectedRows);
  assert.equal(new Set(rows).size, 12);
  assert.notEqual(rows[3], rows[4]);
  assert.notEqual(rows[4], rows[5]);
  assert.notEqual(rows[9], rows[10]);
  assert.notEqual(rows[10], rows[11]);
  assert.deepEqual(result.angles.map((angle) => angle.text), [
    'ASC — Водолей 14°57′17″',
    'MC — Стрелец 14°16′58″',
    'DSC — Лев 14°57′17″',
    'IC — Близнецы 14°16′58″',
  ]);
  assert.equal(result.angles[0].text.replace('ASC — ', ''), rows[0].replace('1 дом — ', ''));
  assert.equal(result.angles[1].text.replace('MC — ', ''), rows[9].replace('10 дом — ', ''));
  assert.equal(result.angles[2].text.replace('DSC — ', ''), rows[6].replace('7 дом — ', ''));
  assert.equal(result.angles[3].text.replace('IC — ', ''), rows[3].replace('4 дом — ', ''));
  assertSafeOutput(result);
});

test('getHousesForProfile uses Placidus cusp source for exact Swiss Moscow 1981 angles', () => {
  const result = getHousesForProfile(moscowSwissExactProfile());
  const rows = result.houses.map((house) => house.text);

  assert.equal(result.status, 'ready');
  assert.deepEqual(result.angles.map((angle) => angle.text), [
    'ASC — Водолей 14°47′29″',
    'MC — Стрелец 14°12′42″',
    'DSC — Лев 14°47′29″',
    'IC — Близнецы 14°12′42″',
  ]);
  assert.equal(rows[0], '1 дом — Водолей 14°47′29″');
  assert.equal(rows[4], '5 дом — Близнецы 29°42′33″');
  assert.equal(rows[5], '6 дом — Рак 16°36′56″');
  assert.equal(rows[9], '10 дом — Стрелец 14°12′42″');
  assert.equal(rows[10], '11 дом — Стрелец 29°42′33″');
  assert.equal(rows[11], '12 дом — Козерог 16°36′56″');
  assert.equal(result.angles[0].text.replace('ASC — ', ''), rows[0].replace('1 дом — ', ''));
  assert.equal(result.angles[1].text.replace('MC — ', ''), rows[9].replace('10 дом — ', ''));
  assert.equal(result.angles[2].text.replace('DSC — ', ''), rows[6].replace('7 дом — ', ''));
  assert.equal(result.angles[3].text.replace('IC — ', ''), rows[3].replace('4 дом — ', ''));
  assertSafeOutput(result);
});

test('getHousesForProfile preserves selected-system fallback for unknown house system', () => {
  const result = getHousesForProfile(validProfile('unknown'));

  assert.equal(result.status, 'unsupported');
  assert.equal(result.ready, false);
  assert.equal(result.summary, 'Пока недоступно.');
  assert.equal(result.message, 'Выбрана неизвестная система домов.');
  assert.deepEqual(result.houses, []);
  assert.deepEqual(result.planetAssignments, []);
  assertSafeOutput(result);
});

test('houses profile helper stays view-model only without provider or DOM imports and does not mutate input', async () => {
  const profile = validProfile('placidus');
  const before = JSON.stringify(profile);
  getHousesForProfile(profile);
  const source = await readFile(MODULE_PATH, 'utf8');

  assert.equal(JSON.stringify(profile), before);
  [
    'astronomy-engine',
    'swisseph',
    'document.',
    'window.',
    'localStorage',
    'Provider',
    'planetaryPositionProvider',
    'calculateAscMc',
    'calculateWholeSign',
    'calculateEqualHouse',
    'calculatePlacidus',
  ].forEach((fragment) => {
    assert.equal(source.includes(fragment), false, fragment);
  });
  assert.equal(source.includes('assignPlanetsToHousesForProfile'), false);
  assert.equal(source.includes('assignPlanetsToHouses('), true);
});
