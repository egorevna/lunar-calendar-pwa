import assert from 'node:assert/strict';
import test from 'node:test';

import {
  assertNatalProviderSupported,
  calculateNatalChart,
  explainNatalEngineLimitations,
  getNatalEngineCapabilities,
} from '../src/natalEngine.js';
import { NATAL_ENGINE_STATUS } from '../src/natalChartModel.js';

const validLookingInput = {
  profileId: 'profile-anna',
  name: 'Анна',
  birthDate: '1990-05-12',
  birthTime: '08:45',
  birthTimeAccuracy: 'exact',
  birthPlace: {
    city: 'Москва',
    country: 'Россия',
    latitude: 55.7558,
    longitude: 37.6173,
    timezone: 'Europe/Moscow',
  },
  currentPlace: {
    mode: 'moscow',
    city: 'Москва',
    country: 'Россия',
    latitude: null,
    longitude: null,
    timezone: 'Europe/Moscow',
  },
  houseSystem: 'wholeSign',
  zodiac: 'tropical',
  isProfileSelected: true,
  missingFields: [],
};

test('getNatalEngineCapabilities returns explicit unsupported capabilities', () => {
  assert.deepEqual(getNatalEngineCapabilities(), {
    provider: null,
    planets: false,
    houses: false,
    ascMc: false,
    aspects: false,
    transits: false,
    reason: 'Natal calculation provider is not connected.',
  });
});

test('calculateNatalChart null input returns incomplete safely', () => {
  const result = calculateNatalChart(null);

  assert.equal(result.status, NATAL_ENGINE_STATUS.INCOMPLETE);
  assert.equal(result.capabilities.planets, false);
  assert.deepEqual(result.planets, []);
  assert.deepEqual(result.missingFields, ['profile']);
});

test('calculateNatalChart valid-looking input returns notSupported while provider is missing', () => {
  const result = calculateNatalChart(validLookingInput);

  assert.equal(result.status, NATAL_ENGINE_STATUS.NOT_SUPPORTED);
  assert.equal(result.reason, 'Natal calculation provider is not connected.');
  assert.deepEqual(result.planets, []);
  assert.deepEqual(result.houses, []);
  assert.deepEqual(result.points, []);
  assert.deepEqual(result.aspects, []);
  assert.deepEqual(result.transits, []);
});

test('calculateNatalChart incomplete input returns missing fields without calculating', () => {
  const result = calculateNatalChart({
    ...validLookingInput,
    missingFields: ['birthTime', 'birthPlace.coordinates'],
  });

  assert.equal(result.status, NATAL_ENGINE_STATUS.INCOMPLETE);
  assert.deepEqual(result.missingFields, ['birthTime', 'birthPlace.coordinates']);
  assert.deepEqual(result.planets, []);
  assert.deepEqual(result.transits, []);
});

test('calculateNatalChart does not return fake natal features', () => {
  const result = calculateNatalChart(validLookingInput);

  assert.equal(result.capabilities.planets, false);
  assert.equal(result.capabilities.houses, false);
  assert.equal(result.capabilities.ascMc, false);
  assert.equal(result.capabilities.aspects, false);
  assert.equal(result.capabilities.transits, false);
  assert.deepEqual(result.planets, []);
  assert.deepEqual(result.houses, []);
  assert.deepEqual(result.points, []);
  assert.deepEqual(result.aspects, []);
  assert.deepEqual(result.transits, []);
});

test('explainNatalEngineLimitations describes current unsupported state', () => {
  const limitations = explainNatalEngineLimitations();

  assert.equal(limitations.includes('Натальный расчетный провайдер пока не подключен.'), true);
  assert.equal(limitations.includes('Планеты натала пока не рассчитываются.'), true);
  assert.equal(limitations.includes('Дома, ASC/MC и транзиты пока недоступны.'), true);
});

test('assertNatalProviderSupported returns false instead of throwing', () => {
  assert.deepEqual(assertNatalProviderSupported(), {
    ok: false,
    reason: 'Natal calculation provider is not connected.',
  });
});

test('engine output does not contain fake calculated claims', () => {
  const serialized = JSON.stringify(calculateNatalChart(validLookingInput));

  assert.equal(serialized.includes('Луна в 7 доме'), false);
  assert.equal(serialized.includes('Плутон ☌ Венера'), false);
  assert.equal(serialized.includes('Марс □ ASC'), false);
  assert.equal(serialized.includes('орб'), false);
});
