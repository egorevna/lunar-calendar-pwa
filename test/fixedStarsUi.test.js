import assert from 'node:assert/strict';
import test from 'node:test';

import { describeFixedStarsBlock } from '../src/profileUi.js';

const READY_PROFILE = Object.freeze({
  id: 'profile-fixed-stars',
  name: 'Егор',
  birthDate: '1990-05-12',
  birthTime: '14:30',
  birthTimeAccuracy: 'exact',
  birthPlace: Object.freeze({
    city: 'Москва',
    country: 'Россия',
    coordinates: Object.freeze({
      latitude: 55.7558,
      longitude: 37.6173,
    }),
    timezone: 'Europe/Moscow',
  }),
  currentPlace: Object.freeze({
    mode: 'moscow',
    city: 'Москва',
    country: 'Россия',
    timezone: 'Europe/Moscow',
  }),
  houseSystem: 'placidus',
  zodiac: 'tropical',
});

const POSITIONS_RESULT = Object.freeze({
  status: 'ready',
  ready: true,
  positions: Object.freeze([
    Object.freeze({
      key: 'regulus',
      labelRu: 'Регул',
      labelEn: 'Regulus',
      longitude: 150,
      sourceSystem: 'vronsky-table-18-fixed-stars',
    }),
    Object.freeze({
      key: 'spica',
      labelRu: 'Спика',
      labelEn: 'Spica',
      longitude: 200,
      sourceSystem: 'vronsky-table-18-fixed-stars',
    }),
  ]),
});

const TARGETS_RESULT = Object.freeze({
  status: 'ready',
  ready: true,
  targetSets: Object.freeze(['angles', 'natal-planets']),
  targets: Object.freeze([
    Object.freeze({
      key: 'asc',
      label: 'ASC',
      labelEn: 'Ascendant',
      category: 'angle',
      longitude: 150.1,
    }),
    Object.freeze({
      key: 'venus',
      label: 'Венера',
      labelEn: 'Venus',
      category: 'natal-planet',
      longitude: 200.386111,
    }),
  ]),
});

function assertNoUnsafeUiText(value) {
  const text = JSON.stringify(value);
  const lower = text.toLowerCase();

  for (const forbidden of [
    'birthDate',
    'birthTime',
    'utcDateTime',
    'timezone',
    'Europe/Moscow',
    'latitude',
    'longitude',
    'coordinates',
    'fullProfile',
    'provider',
    'targetArray',
    'positionArray',
    'catalogDump',
    'debug',
    'interpretation',
    'mythology',
    'prediction',
    'fatalistic',
    'karmic',
    'опасность',
    'слава',
    'судьба',
    'карм',
    'фаталь',
    'ритуал',
    'предсказ',
  ]) {
    assert.equal(lower.includes(forbidden.toLowerCase()), false, `UI output should not include ${forbidden}`);
  }
}

test('Fixed Stars block returns safe fallback for general day and incomplete profile', () => {
  const general = describeFixedStarsBlock(null);
  const incomplete = describeFixedStarsBlock({
    ...READY_PROFILE,
    birthTime: '',
    birthTimeAccuracy: 'unknown',
  });

  assert.equal(general.hidden, false);
  assert.equal(general.title, 'Неподвижные звезды');
  assert.equal(general.status, 'Пока недоступно.');
  assert.equal(general.summary, 'Пока недоступно.');
  assert.equal(general.canToggleFixedStars, true);
  assert.equal(general.explanation, 'Неподвижные звезды пока недоступны.');
  assert.deepEqual(general.items, []);
  assert.deepEqual(general.notes, [
    'Источник: Вронский, Таблица 18.',
    'Орб соединения: 1°00′.',
  ]);

  assert.equal(incomplete.hidden, false);
  assert.equal(incomplete.status, 'Пока недоступно.');
  assert.equal(incomplete.explanation, 'Неподвижные звезды пока недоступны.');
  assert.deepEqual(incomplete.items, []);
  assertNoUnsafeUiText(incomplete);
});

test('Fixed Stars block shows ready conjunction hits and source orb notes once', () => {
  const view = describeFixedStarsBlock(READY_PROFILE, {
    positionsResult: POSITIONS_RESULT,
    targetsResult: TARGETS_RESULT,
  });
  const text = JSON.stringify(view);

  assert.equal(view.hidden, false);
  assert.equal(view.title, 'Неподвижные звезды');
  assert.equal(view.status, '');
  assert.equal(view.explanation, '');
  assert.equal(view.summary, '2 соединения с неподвижными звездами');
  assert.equal(view.canToggleFixedStars, true);
  assert.deepEqual(view.items, [
    'Регул — соединение с ASC · орб 0°06′00″',
    'Спика — соединение с Венерой · орб 0°23′10″',
  ]);
  assert.deepEqual(view.notes, [
    'Источник: Вронский, Таблица 18.',
    'Орб соединения: 1°00′.',
  ]);
  assert.equal(view.message, '');
  assert.equal((text.match(/Источник: Вронский, Таблица 18\./g) ?? []).length, 1);
  assert.equal((text.match(/Орб соединения: 1°00′\./g) ?? []).length, 1);
  assertNoUnsafeUiText(view);
});

test('Fixed Stars block shows noHits message with notes', () => {
  const view = describeFixedStarsBlock(READY_PROFILE, {
    positionsResult: POSITIONS_RESULT,
    targetsResult: {
      ...TARGETS_RESULT,
      targets: Object.freeze([
        Object.freeze({
          key: 'asc',
          label: 'ASC',
          labelEn: 'Ascendant',
          category: 'angle',
          longitude: 180,
        }),
      ]),
    },
  });

  assert.equal(view.status, '');
  assert.equal(view.summary, 'Соединений не найдено');
  assert.equal(view.message, 'Соединений с неподвижными звездами в выбранном орбе не найдено.');
  assert.deepEqual(view.items, []);
  assert.deepEqual(view.notes, [
    'Источник: Вронский, Таблица 18.',
    'Орб соединения: 1°00′.',
  ]);
});

test('Fixed Stars block preserves partial state with safe note and available hits', () => {
  const view = describeFixedStarsBlock(READY_PROFILE, {
    positionsResult: POSITIONS_RESULT,
    targetsResult: {
      status: 'partial',
      ready: true,
      targetSets: Object.freeze(['angles']),
      targets: Object.freeze([
        Object.freeze({
          key: 'asc',
          label: 'ASC',
          labelEn: 'Ascendant',
          category: 'angle',
          longitude: 150.1,
        }),
      ]),
    },
  });

  assert.equal(view.partial, true);
  assert.deepEqual(view.items, [
    'Регул — соединение с ASC · орб 0°06′00″',
  ]);
  assert.deepEqual(view.notes, [
    'Рассчитано по доступным целям карты.',
    'Источник: Вронский, Таблица 18.',
    'Орб соединения: 1°00′.',
  ]);
  assertNoUnsafeUiText(view);
});
