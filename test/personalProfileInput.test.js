import assert from 'node:assert/strict';
import test from 'node:test';

import {
  createPersonalProfileInput,
  getPersonalCalculationCapabilities,
  getPersonalProfileReadiness,
} from '../src/personalProfileInput.js';

const completeProfile = {
  id: 'profile-anna',
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
  createdAt: '2026-05-14T00:00:00.000Z',
  updatedAt: '2026-05-14T00:00:00.000Z',
};

test('null profile returns general day and no personal capabilities', () => {
  const input = createPersonalProfileInput(null);

  assert.equal(input.isProfileSelected, false);
  assert.equal(input.name, 'Общий день');
  assert.deepEqual(input.missingFields, []);
  assert.deepEqual(input.warnings, []);
  assert.equal(input.capabilities.canUseProfileName, false);
  assert.equal(input.capabilities.canUseBirthDate, false);
  assert.equal(input.capabilities.canCalculateNatalPlanets, false);
  assert.equal(input.capabilities.canCalculateHouses, false);
  assert.equal(input.capabilities.canCalculateAscMc, false);
  assert.equal(input.capabilities.canCalculatePersonalTransits, false);
  assert.deepEqual(input.unsupportedFeatures, [
    'natalPlanets',
    'houses',
    'ascMc',
    'moonInNatalHouse',
    'personalTransits',
    'transitOrbs',
    'personalRitualScoring',
  ]);
});

test('complete profile returns selected state and passes core fields through safely', () => {
  const input = createPersonalProfileInput(completeProfile);

  assert.equal(input.isProfileSelected, true);
  assert.equal(input.profileId, 'profile-anna');
  assert.equal(input.name, 'Анна');
  assert.equal(input.birthDate, '1990-05-12');
  assert.equal(input.birthTime, '08:45');
  assert.equal(input.birthTimeAccuracy, 'exact');
  assert.equal(input.birthPlace.city, 'Москва');
  assert.equal(input.birthPlace.latitude, 55.7558);
  assert.equal(input.currentPlace.timezone, 'Europe/Moscow');
  assert.equal(input.houseSystem, 'wholeSign');
  assert.equal(input.zodiac, 'tropical');
  assert.equal(input.isReadyForBasicPersonalContext, true);
});

test('unknown birth time warns that houses and ASC/MC are unavailable', () => {
  const input = createPersonalProfileInput({
    ...completeProfile,
    birthTime: '',
    birthTimeAccuracy: 'unknown',
  });

  assert.equal(input.isReadyForHouses, false);
  assert.equal(input.isReadyForAscMc, false);
  assert.equal(
    input.warnings.includes('Время рождения неизвестно — дома и ASC/MC недоступны.'),
    true,
  );
});

test('missing birth coordinates adds missing field and warning', () => {
  const input = createPersonalProfileInput({
    ...completeProfile,
    birthPlace: {
      ...completeProfile.birthPlace,
      latitude: null,
      longitude: null,
    },
  });

  assert.equal(input.missingFields.includes('birthPlace.coordinates'), true);
  assert.equal(
    input.warnings.includes('Для домов и ASC/MC нужны координаты места рождения.'),
    true,
  );
});

test('missing birth timezone adds missing field and warning', () => {
  const input = createPersonalProfileInput({
    ...completeProfile,
    birthPlace: {
      ...completeProfile.birthPlace,
      timezone: '',
    },
  });

  assert.equal(input.missingFields.includes('birthPlace.timezone'), true);
  assert.equal(
    input.warnings.includes('Для точного расчета нужно знать часовой пояс места рождения.'),
    true,
  );
});

test('missing birthDate is reported for selected profile', () => {
  const input = createPersonalProfileInput({
    ...completeProfile,
    birthDate: '',
  });

  assert.equal(input.missingFields.includes('birthDate'), true);
  assert.equal(input.isReadyForBasicPersonalContext, false);
});

test('missing birthTime is reported for exact or approximate time accuracy', () => {
  const exact = createPersonalProfileInput({
    ...completeProfile,
    birthTime: '',
    birthTimeAccuracy: 'exact',
  });
  const approximate = createPersonalProfileInput({
    ...completeProfile,
    birthTime: '',
    birthTimeAccuracy: 'approximate',
  });

  assert.equal(exact.missingFields.includes('birthTime'), true);
  assert.equal(approximate.missingFields.includes('birthTime'), true);
});

test('complete profile does not claim natal calculation capabilities without engine', () => {
  const input = createPersonalProfileInput(completeProfile);

  assert.equal(input.isReadyForNatalPlanets, false);
  assert.equal(input.isReadyForHouses, false);
  assert.equal(input.isReadyForAscMc, false);
  assert.equal(input.capabilities.canCalculateNatalPlanets, false);
  assert.equal(input.capabilities.canCalculateHouses, false);
  assert.equal(input.capabilities.canCalculateAscMc, false);
  assert.equal(input.capabilities.canCalculatePersonalTransits, false);
  assert.match(input.capabilities.reason, /натальный расчетный движок/);
});

test('readiness helper mirrors profile input readiness', () => {
  const readiness = getPersonalProfileReadiness(completeProfile);

  assert.equal(readiness.isProfileSelected, true);
  assert.equal(readiness.isReadyForBasicPersonalContext, true);
  assert.deepEqual(readiness.missingFields, []);
});

test('capabilities helper returns explicit false values', () => {
  const capabilities = getPersonalCalculationCapabilities(createPersonalProfileInput(completeProfile));

  assert.equal(capabilities.canUseProfileName, true);
  assert.equal(capabilities.canUseBirthDate, true);
  assert.equal(capabilities.canCalculateNatalPlanets, false);
  assert.equal(capabilities.canCalculateHouses, false);
  assert.equal(capabilities.canCalculateAscMc, false);
  assert.equal(capabilities.canCalculatePersonalTransits, false);
});

test('output does not claim fake houses, ASC, MC or transits are available', () => {
  const serialized = JSON.stringify(createPersonalProfileInput(completeProfile));

  assert.equal(serialized.includes('canCalculateHouses":true'), false);
  assert.equal(serialized.includes('canCalculateAscMc":true'), false);
  assert.equal(serialized.includes('canCalculatePersonalTransits":true'), false);
  assert.equal(serialized.includes('Луна в доме натала'), false);
  assert.equal(serialized.includes('персональные транзиты доступны'), false);
});
