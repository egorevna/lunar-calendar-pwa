import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

import { getSpecialPointsForProfile } from '../src/specialPointsForProfile.js';

const MODULE_PATH = path.resolve('src/specialPointsForProfile.js');

function validProfile(overrides = {}) {
  return {
    id: 'profile-public-fixture',
    name: 'Тест',
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
    houseSystem: 'placidus',
    zodiac: 'tropical',
    ...overrides,
  };
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function assertNoPrivateProfileData(value) {
  const text = JSON.stringify(value);
  const forbidden = [
    'birthDate',
    'birthTime',
    'utcDateTime',
    'Europe/Moscow',
    'birthPlace',
    'currentPlace',
    'latitude',
    'longitude',
    'coordinates',
    'providerPayload',
    'fullProfileJson',
    'sourceArray',
    'NaN',
    'undefined',
    'карми',
    'фаталь',
    'ангел',
    'судьб',
    'ритуал',
    'fixedStars',
    'transits',
  ];

  for (const term of forbidden) {
    assert.equal(text.includes(term), false, `output must not include ${term}`);
  }

  assert.equal(/\b\d{1,3}\.\d{4,}\b/.test(text), false, 'output must not include raw decimal longitudes');
}

test('getSpecialPointsForProfile returns fallback for no profile', () => {
  const result = getSpecialPointsForProfile(null);

  assert.equal(result.status, 'notReady');
  assert.equal(result.ready, false);
  assert.equal(result.title, 'Особые точки карты');
  assert.equal(result.summary, 'Пока недоступно.');
  assert.equal(result.message, 'Для расчета нужны точное время рождения и timezone.');
  assert.deepEqual(result.items, []);
});

test('getSpecialPointsForProfile returns fallback for unknown birth time', () => {
  const result = getSpecialPointsForProfile(validProfile({
    birthTime: '',
    birthTimeAccuracy: 'unknown',
  }));

  assert.equal(result.status, 'notReady');
  assert.equal(result.summary, 'Пока недоступно.');
  assert.deepEqual(result.items, []);
});

test('getSpecialPointsForProfile returns fallback for missing timezone', () => {
  const profile = validProfile({
    birthPlace: {
      city: 'Москва',
      country: 'Россия',
      coordinates: {
        latitude: 55.7558,
        longitude: 37.6173,
      },
      timezone: '',
    },
  });

  const result = getSpecialPointsForProfile(profile);

  assert.equal(result.status, 'notReady');
  assert.equal(result.message, 'Для расчета нужны точное время рождения и timezone.');
  assert.deepEqual(result.items, []);
});

test('getSpecialPointsForProfile returns ready for exact birth time and timezone', () => {
  const result = getSpecialPointsForProfile(validProfile());
  const text = JSON.stringify(result);

  assert.equal(result.status, 'ready');
  assert.equal(result.ready, true);
  assert.equal(result.title, 'Особые точки карты');
  assert.match(result.summary, /^4 точки рассчитаны$/);
  assert.equal(result.sections.some((section) => section.title === 'Лунные узлы'), true);
  assert.equal(result.sections.some((section) => section.title === 'Лилит'), true);
  assert.equal(result.sections.some((section) => section.title === 'Селена'), true);
  assert.equal(result.items.some((item) => item.text.startsWith('Северный узел — ')), true);
  assert.equal(result.items.some((item) => item.text.startsWith('Южный узел — ')), true);
  assert.equal(result.items.some((item) => item.text.startsWith('Лилит / Средняя Лилит — ')), true);
  assert.equal(result.items.some((item) => item.text.startsWith('Селена / Белая Луна — ')), true);
  assert.equal(result.items.filter((item) => / · \d{1,2} дом$/.test(item.text)).length, 2);
  assert.equal(text.includes('фиктивная / гипотетическая точка'), true);
  assertNoPrivateProfileData(result);
});

test('getSpecialPointsForProfile keeps points ready without coordinates and omits node houses', () => {
  const profile = validProfile({
    birthPlace: {
      city: 'Москва',
      country: 'Россия',
      timezone: 'Europe/Moscow',
    },
  });
  const result = getSpecialPointsForProfile(profile);

  assert.equal(result.status, 'ready');
  assert.equal(result.items.length, 4);
  assert.equal(result.items.some((item) => / · \d{1,2} дом$/.test(item.text)), false);
});

test('getSpecialPointsForProfile does not fake missing points', () => {
  const result = getSpecialPointsForProfile(validProfile({
    birthTime: '',
    birthTimeAccuracy: 'unknown',
  }));

  assert.equal(result.items.some((item) => item.text?.includes('Северный узел')), false);
  assert.equal(result.items.some((item) => item.text?.includes('Лилит')), false);
  assert.equal(result.items.some((item) => item.text?.includes('Селена')), false);
});

test('getSpecialPointsForProfile does not mutate profile', () => {
  const profile = validProfile();
  const before = clone(profile);

  getSpecialPointsForProfile(profile);

  assert.deepEqual(profile, before);
});

test('special points profile helper does not import provider or native astronomy modules', async () => {
  const source = await readFile(MODULE_PATH, 'utf8');
  const forbidden = [
    'planetaryProvider',
    'providerCalculations',
    'astronomy-engine',
    'swisseph',
    'document.',
    'window.',
    'localStorage',
  ];

  for (const term of forbidden) {
    assert.equal(source.includes(term), false, `module source must not include ${term}`);
  }
});

test('src/houses.js and src/houseSystems.js are not created', () => {
  assert.equal(existsSync(path.resolve('src/houses.js')), false);
  assert.equal(existsSync(path.resolve('src/houseSystems.js')), false);
});
