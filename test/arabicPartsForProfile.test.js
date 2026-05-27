import assert from 'node:assert/strict';
import test from 'node:test';

import { getArabicPartsForProfile } from '../src/arabicPartsForProfile.js';

const VALID_PROFILE = Object.freeze({
  id: 'profile-egor',
  name: 'Егор',
  birthDate: '1990-05-12',
  birthTime: '14:30',
  birthTimeAccuracy: 'exact',
  birthPlace: {
    city: 'Москва',
    country: 'Россия',
    timezone: 'Europe/Moscow',
    coordinates: {
      latitude: 55.7558,
      longitude: 37.6173,
    },
  },
  currentPlace: {
    mode: 'moscow',
    city: 'Москва',
    country: 'Россия',
    timezone: 'Europe/Moscow',
  },
  houseSystem: 'placidus',
  zodiac: 'tropical',
});

test('getArabicPartsForProfile returns safe fallback for no profile unknown time and missing coordinates', () => {
  const noProfile = getArabicPartsForProfile(null);
  const unknownTime = getArabicPartsForProfile({
    ...VALID_PROFILE,
    birthTime: '',
    birthTimeAccuracy: 'unknown',
  });
  const missingCoordinates = getArabicPartsForProfile({
    ...VALID_PROFILE,
    birthPlace: {
      city: 'Москва',
      country: 'Россия',
      timezone: 'Europe/Moscow',
    },
  });

  for (const view of [noProfile, unknownTime, missingCoordinates]) {
    assert.equal(view.status, 'notReady');
    assert.equal(view.ready, false);
    assert.equal(view.title, 'Жребии и арабские части');
    assert.equal(view.summary, 'Пока недоступно.');
    assert.equal(view.message, 'Для расчета нужны ASC, Солнце, Луна и дневная/ночная карта.');
    assert.deepEqual(view.items, []);
  }
});

test('getArabicPartsForProfile returns fallback when day/night or Sun Moon inputs are not ready', () => {
  const dayNightNotReady = getArabicPartsForProfile(VALID_PROFILE, {
    dayNightChartStatus: {
      status: 'notReady',
      ready: false,
      reason: 'sunPositionNotReady',
      message: 'Для определения дневной/ночной карты нужен расчет Солнца.',
    },
  });
  const natalPlanetsNotReady = getArabicPartsForProfile(VALID_PROFILE, {
    natalPlanetsResult: {
      status: 'notReady',
      ready: false,
      reason: 'natalPlanetsNotReady',
    },
  });

  assert.equal(dayNightNotReady.status, 'notReady');
  assert.equal(dayNightNotReady.ready, false);
  assert.deepEqual(dayNightNotReady.items, []);
  assert.equal(natalPlanetsNotReady.status, 'notReady');
  assert.equal(natalPlanetsNotReady.ready, false);
  assert.deepEqual(natalPlanetsNotReady.items, []);
});

test('getArabicPartsForProfile formats ready active lots with chart sect and house labels', () => {
  const view = getArabicPartsForProfile(VALID_PROFILE);
  const text = JSON.stringify(view);

  assert.equal(view.status, 'ready');
  assert.equal(view.ready, true);
  assert.equal(view.title, 'Жребии и арабские части');
  assert.equal(view.summary, '2 жребия рассчитаны');
  assert.match(view.chartSectLabel, /^(Дневная карта|Ночная карта)$/);
  assert.equal(view.items.length, 2);
  assert.equal(view.items.some((item) => item.key === 'pars-fortuna'), true);
  assert.equal(view.items.some((item) => item.key === 'lot-of-spirit'), true);
  assert.equal(view.items.some((item) => item.text.startsWith('Парс Фортуны — ')), true);
  assert.equal(view.items.some((item) => item.text.startsWith('Жребий Духа — ')), true);
  assert.equal(view.items.every((item) => / \d{1,2}°\d{2}′\d{2}″/.test(item.text)), true);
  assert.equal(view.items.every((item) => / · \d{1,2} дом$/.test(item.text)), true);
  assert.equal(text.includes('lot-of-eros'), false);
  assert.equal(text.includes('lot-of-necessity'), false);
  assert.equal(text.includes('lot-of-basis'), false);
  assert.equal(text.includes('lot-of-exaltation'), false);
});

test('getArabicPartsForProfile output stays user-facing and does not mutate input', async () => {
  const profile = structuredClone(VALID_PROFILE);
  const before = JSON.stringify(profile);
  const view = getArabicPartsForProfile(profile);
  const text = JSON.stringify(view);
  const source = await import('node:fs')
    .then(({ readFileSync }) => readFileSync(new URL('../src/arabicPartsForProfile.js', import.meta.url), 'utf8'));

  assert.equal(JSON.stringify(profile), before);
  assert.equal(text.includes('birthDate'), false);
  assert.equal(text.includes('birthTime'), false);
  assert.equal(text.includes('utcDateTime'), false);
  assert.equal(text.includes('Europe/Moscow'), false);
  assert.equal(text.includes('latitude'), false);
  assert.equal(text.includes('longitude'), false);
  assert.equal(text.includes('coordinates'), false);
  assert.equal(text.includes('formula'), false);
  assert.equal(text.includes('operands'), false);
  assert.equal(text.includes('profile-egor'), false);
  assert.equal(text.includes('provider'), false);
  assert.equal(text.includes('фатально'), false);
  assert.equal(source.includes('provider'), false);
  assert.equal(source.includes('astronomy-engine'), false);
  assert.equal(source.includes('localStorage'), false);
  assert.equal(source.includes('document'), false);
  assert.equal(source.includes('window'), false);
});
