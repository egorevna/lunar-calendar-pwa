import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import { getDetailedDignitiesForProfile } from '../src/detailedDignitiesForProfile.js';

function readyProfile(overrides = {}) {
  return {
    id: 'profile-egor',
    name: 'Егор',
    birthDate: '1990-05-12',
    birthTime: '14:30',
    birthTimeAccuracy: 'exact',
    birthPlace: {
      city: 'Москва',
      country: 'Россия',
      latitude: null,
      longitude: null,
      timezone: 'Europe/Moscow',
    },
    currentPlace: {
      mode: 'moscow',
      city: 'Москва',
      country: 'Россия',
      timezone: 'Europe/Moscow',
    },
    houseSystem: 'wholeSign',
    zodiac: 'tropical',
    ...overrides,
  };
}

test('getDetailedDignitiesForProfile returns fallback when profile is missing', () => {
  const result = getDetailedDignitiesForProfile(null);

  assert.equal(result.status, 'notAvailable');
  assert.equal(result.enabled, false);
  assert.equal(result.title, 'Термы, деканы и градусы');
  assert.equal(result.summary, 'Пока недоступны.');
  assert.equal(result.message, 'Сначала нужен расчет натальных планет.');
  assert.deepEqual(result.groups, []);
});

test('getDetailedDignitiesForProfile returns fallback when natal planets are not ready', () => {
  const result = getDetailedDignitiesForProfile(readyProfile({
    birthTime: '',
    birthTimeAccuracy: 'unknown',
  }));

  assert.equal(result.status, 'notAvailable');
  assert.equal(result.enabled, false);
  assert.equal(result.summary, 'Пока недоступны.');
  assert.equal(result.message, 'Сначала нужен расчет натальных планет.');
  assert.deepEqual(result.groups, []);
});

test('getDetailedDignitiesForProfile returns grouped detailed dignity entries for ready profile', () => {
  const result = getDetailedDignitiesForProfile(readyProfile());
  const text = JSON.stringify(result);

  assert.equal(result.status, 'ready');
  assert.equal(result.enabled, true);
  assert.equal(result.title, 'Термы, деканы и градусы');
  assert.equal(result.summary, '');
  assert.equal(result.groups.length, 10);
  assert.equal(result.groups.every((group) => group.planetKey && group.planetLabel), true);
  assert.equal(result.groups.every((group) => group.items.length === 4), true);
  assert.equal(result.groups.some((group) => group.items.some((item) => item.type === 'term')), true);
  assert.equal(result.groups.some((group) => group.items.some((item) => item.type === 'decan')), true);
  assert.equal(result.groups.some((group) => group.items.some((item) => item.type === 'degreeRuler')), true);
  assert.equal(result.groups.some((group) => group.items.some((item) => item.type === 'vronskyDegreeRulers')), true);
  assert.equal(text.includes('Таблица 5'), false);
  assert.equal(text.includes('Вронский, термы'), true);
  assert.equal(text.includes('Звезда Магов'), true);
  assert.equal(text.includes('Таблица 6 / Звезда Магов'), false);
  assert.equal(text.includes('Вронский'), true);
  assert.equal(text.includes('Таблица 7 / Вронский'), false);
});

test('ready output preserves Table 7 multi-ruler display but not raw source tokens', () => {
  const result = getDetailedDignitiesForProfile(readyProfile());
  const vronskyItems = result.groups.flatMap((group) => (
    group.items.filter((item) => item.type === 'vronskyDegreeRulers')
  ));
  const text = JSON.stringify(result);

  assert.equal(vronskyItems.length, 10);
  assert.equal(vronskyItems.some((item) => item.text.includes(',')), true);
  assert.equal(vronskyItems.some((item) => item.text.includes(' R')), true);
  assert.equal(text.includes('sourceTokens'), false);
  assert.equal(text.includes('sourceKey'), false);
  assert.equal(text.includes('sourceSystem'), false);
  assert.equal(text.includes('degree-rulers-vronsky-table-7'), false);
  assert.equal(text.includes('vronsky-degree-rulers'), false);
});

test('detailed dignities profile output contains no private data or unsupported features', () => {
  const text = JSON.stringify(getDetailedDignitiesForProfile(readyProfile()));

  for (const forbidden of [
    '1990-05-12',
    '14:30',
    'birthDate',
    'birthTime',
    'utcDateTime',
    'Europe/Moscow',
    'coordinates',
    'latitude',
    'longitude',
    'profileJson',
    'sourceTokens',
    'плохой',
    'опасный',
    'фатально',
    'кармически',
    'interpretation',
    'fixedStars',
    'houses',
    'ASC',
    'MC',
    'transits',
  ]) {
    assert.equal(text.includes(forbidden), false, `${forbidden} should not be present`);
  }
});

test('detailed dignities helper does not import providers storage DOM or astronomy-engine directly', () => {
  const source = readFileSync(new URL('../src/detailedDignitiesForProfile.js', import.meta.url), 'utf8');

  for (const forbidden of [
    'astronomyEngineProvider',
    'profileStorage',
    'document.',
    'window.',
    'localStorage',
    'astronomy-engine',
  ]) {
    assert.equal(source.includes(forbidden), false, `${forbidden} should not be imported or called`);
  }
});
