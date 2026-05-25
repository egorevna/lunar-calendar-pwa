import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import {
  evaluateHousesInputReadiness,
  getBirthCoordinateStatus,
  getHousesInputFallbackMessage,
  getHousesInputGuardrailLimitations,
  getHousesInputRequirements,
  getInitialHouseSystemPolicy,
  hasBirthCoordinates,
  hasExactBirthTime,
  isCityWithoutCoordinates,
  isCountryRegionOnlyBirthPlace,
} from '../src/housesInputGuardrails.js';

const completeProfile = Object.freeze({
  id: 'profile-ready',
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
});

function cloneProfile(overrides = {}) {
  return {
    ...completeProfile,
    ...overrides,
    birthPlace: {
      ...completeProfile.birthPlace,
      ...(overrides.birthPlace || {}),
    },
  };
}

function assertSafeOutput(value) {
  const json = JSON.stringify(value);

  assert.equal(json.includes('1990-05-12'), false);
  assert.equal(json.includes('08:45'), false);
  assert.equal(json.includes('Europe/Moscow'), false);
  assert.equal(json.includes('55.7558'), false);
  assert.equal(json.includes('37.6173'), false);
  assert.equal(json.includes('"birthPlace"'), false);
  assert.equal(json.includes('"birthDate"'), false);
  assert.equal(json.includes('"birthTime"'), false);
  assert.equal(json.includes('NaN'), false);
  assert.equal(json.includes('undefined'), false);
}

test('null profile returns notReady missingProfile with safe flags', () => {
  const result = evaluateHousesInputReadiness(null);

  assert.equal(result.status, 'notReady');
  assert.equal(result.ready, false);
  assert.equal(result.reason, 'missingProfile');
  assert.equal(result.houseSystem, 'whole-sign');
  assert.equal(result.requirements.exactBirthTime, false);
  assert.equal(result.requirements.birthCoordinates, false);
  assert.equal(result.flags.hasProfile, false);
  assert.equal(result.message, 'Сначала выберите профиль.');
  assertSafeOutput(result);
});

test('common day profile returns notReady commonDay when caller provides common marker', () => {
  const result = evaluateHousesInputReadiness({ kind: 'commonDay' });

  assert.equal(result.status, 'notReady');
  assert.equal(result.ready, false);
  assert.equal(result.reason, 'commonDay');
  assert.equal(
    result.message,
    'Дома и углы карты недоступны для общего дня. Нужен персональный профиль с точным временем и местом рождения.',
  );
});

test('missing birthDate returns notReady before time and coordinate checks', () => {
  const result = evaluateHousesInputReadiness(cloneProfile({ birthDate: '' }));

  assert.equal(result.ready, false);
  assert.equal(result.reason, 'missingBirthDate');
});

test('unknown or empty birth time returns missingExactBirthTime', () => {
  const unknown = evaluateHousesInputReadiness(cloneProfile({
    birthTime: '',
    birthTimeAccuracy: 'unknown',
  }));
  const empty = evaluateHousesInputReadiness(cloneProfile({ birthTime: '' }));

  assert.equal(unknown.ready, false);
  assert.equal(unknown.reason, 'missingExactBirthTime');
  assert.equal(empty.ready, false);
  assert.equal(empty.reason, 'missingExactBirthTime');
  assert.equal(hasExactBirthTime(cloneProfile()), true);
  assert.equal(hasExactBirthTime(cloneProfile({ birthTimeAccuracy: 'unknown', birthTime: '' })), false);
});

test('missing timezone returns missingTimezone before birth place checks', () => {
  const result = evaluateHousesInputReadiness(cloneProfile({
    birthPlace: { timezone: '' },
  }));

  assert.equal(result.ready, false);
  assert.equal(result.reason, 'missingTimezone');
});

test('missing birthPlace returns notReady missingBirthPlace', () => {
  const result = evaluateHousesInputReadiness({
    ...completeProfile,
    birthPlace: null,
  });

  assert.equal(result.ready, false);
  assert.equal(result.reason, 'missingBirthPlace');
});

test('country or region only returns countryRegionOnly', () => {
  const countryOnly = evaluateHousesInputReadiness(cloneProfile({
    birthPlace: {
      city: '',
      country: 'Россия',
      latitude: null,
      longitude: null,
    },
  }));
  const regionOnly = evaluateHousesInputReadiness(cloneProfile({
    birthPlace: {
      city: '',
      country: '',
      region: 'Московская область',
      latitude: null,
      longitude: null,
    },
  }));

  assert.equal(countryOnly.reason, 'countryRegionOnly');
  assert.equal(regionOnly.reason, 'countryRegionOnly');
  assert.equal(isCountryRegionOnlyBirthPlace(countryOnly), false);
  assert.equal(isCountryRegionOnlyBirthPlace({
    birthPlace: { city: '', country: 'Россия', latitude: null, longitude: null },
  }), true);
});

test('city without coordinates returns cityWithoutCoordinates', () => {
  const profile = cloneProfile({
    birthPlace: {
      city: 'Москва',
      country: 'Россия',
      latitude: null,
      longitude: null,
    },
  });
  const result = evaluateHousesInputReadiness(profile);

  assert.equal(result.ready, false);
  assert.equal(result.reason, 'cityWithoutCoordinates');
  assert.equal(isCityWithoutCoordinates(profile), true);
});

test('invalid coordinates return invalidBirthCoordinates', () => {
  const result = evaluateHousesInputReadiness(cloneProfile({
    birthPlace: {
      city: '',
      country: '',
      latitude: '55.7558',
      longitude: null,
    },
  }));

  assert.equal(result.ready, false);
  assert.equal(result.reason, 'invalidBirthCoordinates');
});

test('finite city-level coordinates return ready and do not require hospital precision', () => {
  const result = evaluateHousesInputReadiness(cloneProfile());

  assert.equal(result.status, 'ready');
  assert.equal(result.ready, true);
  assert.equal(result.reason, null);
  assert.equal(result.houseSystem, 'whole-sign');
  assert.equal(result.requirements.exactBirthTime, true);
  assert.equal(result.requirements.birthCoordinates, true);
  assert.equal(result.flags.hasCityLevelCoordinates, true);
  assert.equal(result.message, 'Данные для расчета домов готовы.');
  assertSafeOutput(result);
});

test('hasBirthCoordinates supports existing and compatible coordinate shapes', () => {
  assert.equal(hasBirthCoordinates(cloneProfile()), true);
  assert.equal(hasBirthCoordinates({
    birthPlace: { coordinates: { latitude: 55.7558, longitude: 37.6173 } },
  }), true);
  assert.equal(hasBirthCoordinates({
    birthPlace: { coordinates: { lat: 55.7558, lng: 37.6173 } },
  }), true);
  assert.equal(hasBirthCoordinates({
    birthPlace: { lat: 55.7558, lng: 37.6173 },
  }), true);
  assert.equal(hasBirthCoordinates({ birthPlace: { latitude: null, longitude: null } }), false);
});

test('getBirthCoordinateStatus returns safe coordinate readiness without raw values', () => {
  const ready = getBirthCoordinateStatus(cloneProfile());
  const cityMissing = getBirthCoordinateStatus(cloneProfile({
    birthPlace: { city: 'Москва', latitude: null, longitude: null },
  }));

  assert.equal(ready.hasBirthPlace, true);
  assert.equal(ready.hasCoordinates, true);
  assert.equal(ready.cityLevelAccepted, true);
  assert.equal(ready.reason, null);
  assert.equal(cityMissing.cityWithoutCoordinates, true);
  assert.equal(cityMissing.reason, 'cityWithoutCoordinates');
  assertSafeOutput(ready);
  assertSafeOutput(cityMissing);
});

test('requirements and initial house system policy match Sprint 11 guardrails', () => {
  assert.deepEqual(getHousesInputRequirements(), {
    exactBirthTimeRequired: true,
    birthCoordinatesRequired: true,
    cityLevelCoordinatesAccepted: true,
    hospitalCoordinatesRequired: false,
    countryRegionOnlyAccepted: false,
    cityWithoutCoordinatesAccepted: false,
    commonDayAccepted: false,
    houseSystem: 'whole-sign',
  });
  assert.deepEqual(getInitialHouseSystemPolicy(), {
    houseSystem: 'whole-sign',
    ascMcAnglesRequired: true,
    quadrantCuspsDeferred: true,
    placidusDeferred: true,
    labelRequired: true,
  });
});

test('fallback messages and limitations are safe and explicit', () => {
  assert.equal(
    getHousesInputFallbackMessage('missingExactBirthTime'),
    'Для расчета домов нужно точное время рождения.',
  );
  assert.equal(
    getHousesInputFallbackMessage('cityWithoutCoordinates'),
    'Для выбранного города нужны координаты. Выберите город из справочника или введите координаты вручную.',
  );
  assert.equal(
    getHousesInputFallbackMessage('unsupported'),
    'Дома и углы карты пока недоступны.',
  );

  const limitations = getHousesInputGuardrailLimitations();

  assert.equal(limitations.some((item) => item.includes('точное время рождения')), true);
  assert.equal(limitations.some((item) => item.includes('Городских координат достаточно')), true);
  assert.equal(limitations.some((item) => item.includes('Whole Sign')), true);
});

test('reason priority is stable when multiple guardrails fail', () => {
  const missingDateFirst = evaluateHousesInputReadiness(cloneProfile({
    birthDate: '',
    birthTime: '',
    birthTimeAccuracy: 'unknown',
    birthPlace: {
      city: 'Москва',
      country: 'Россия',
      latitude: null,
      longitude: null,
      timezone: '',
    },
  }));
  const missingTimeBeforeTimezone = evaluateHousesInputReadiness(cloneProfile({
    birthTime: '',
    birthPlace: {
      ...completeProfile.birthPlace,
      timezone: '',
    },
  }));

  assert.equal(missingDateFirst.reason, 'missingBirthDate');
  assert.equal(missingTimeBeforeTimezone.reason, 'missingExactBirthTime');
});

test('readiness output contains no private raw birth or coordinate data', () => {
  const outputs = [
    evaluateHousesInputReadiness(cloneProfile()),
    getBirthCoordinateStatus(cloneProfile()),
    getHousesInputRequirements(),
    getInitialHouseSystemPolicy(),
    getHousesInputGuardrailLimitations(),
  ];

  outputs.forEach(assertSafeOutput);
});

test('module stays pure guardrails without providers DOM storage or calculations', async () => {
  const source = await readFile(new URL('../src/housesInputGuardrails.js', import.meta.url), 'utf8');

  assert.equal(source.includes('astronomy-engine'), false);
  assert.equal(source.includes('astronomyEngineProvider'), false);
  assert.equal(source.includes('planetaryProvider'), false);
  assert.equal(source.includes('profileStorage'), false);
  assert.equal(source.includes('localStorage'), false);
  assert.equal(source.includes('document.'), false);
  assert.equal(source.includes('window.'), false);
  assert.equal(source.includes('calculateAstronomy'), false);
  assert.equal(source.includes('calculateAsc'), false);
  assert.equal(source.includes('calculateMC'), false);
  assert.equal(source.includes('calculateHouses'), false);
  assert.equal(source.includes('getAsc'), false);
  assert.equal(source.includes('getMc'), false);
});
