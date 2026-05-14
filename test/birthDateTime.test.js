import assert from 'node:assert/strict';
import test from 'node:test';

import {
  createBirthDateTimeInput,
  explainBirthDateTimeLimitations,
  getBirthDateTimeReadiness,
  normalizeTimezone,
  parseBirthDate,
  parseBirthTime,
} from '../src/birthDateTime.js';

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
};

test('parseBirthDate accepts valid YYYY-MM-DD', () => {
  const result = parseBirthDate('1990-05-12');

  assert.equal(result.ok, true);
  assert.equal(result.year, 1990);
  assert.equal(result.month, 5);
  assert.equal(result.day, 12);
  assert.equal(result.value, '1990-05-12');
  assert.deepEqual(result.errors, []);
});

test('parseBirthDate rejects invalid format and impossible dates without NaN', () => {
  const invalidFormat = parseBirthDate('12.05.1990');
  const impossibleDate = parseBirthDate('2026-02-30');

  assert.equal(invalidFormat.ok, false);
  assert.equal(invalidFormat.errors.includes('birthDate must use YYYY-MM-DD'), true);
  assert.equal(impossibleDate.ok, false);
  assert.equal(impossibleDate.errors.includes('birthDate is not a real calendar date'), true);
  assert.equal(JSON.stringify(invalidFormat).includes('NaN'), false);
  assert.equal(JSON.stringify(impossibleDate).includes('NaN'), false);
});

test('parseBirthTime accepts valid HH:mm and rejects invalid hours or minutes', () => {
  const valid = parseBirthTime('08:45', 'exact');
  const invalidHour = parseBirthTime('24:00', 'exact');
  const invalidMinute = parseBirthTime('12:60', 'exact');

  assert.equal(valid.ok, true);
  assert.equal(valid.hour, 8);
  assert.equal(valid.minute, 45);
  assert.equal(valid.hasKnownTime, true);
  assert.equal(invalidHour.ok, false);
  assert.equal(invalidMinute.ok, false);
});

test('parseBirthTime requires time for exact accuracy and allows empty unknown time', () => {
  const exact = parseBirthTime('', 'exact');
  const unknown = parseBirthTime('', 'unknown');

  assert.equal(exact.ok, false);
  assert.equal(exact.errors.includes('birthTime is required'), true);
  assert.equal(unknown.ok, true);
  assert.equal(unknown.hasKnownTime, false);
  assert.equal(unknown.hour, null);
  assert.equal(unknown.minute, null);
});

test('normalizeTimezone accepts Europe/Moscow and rejects empty timezone without throwing', () => {
  const moscow = normalizeTimezone(' Europe/Moscow ');
  const empty = normalizeTimezone(' ');
  const invalid = normalizeTimezone(null);

  assert.equal(moscow.ok, true);
  assert.equal(moscow.timezone, 'Europe/Moscow');
  assert.equal(empty.ok, false);
  assert.equal(invalid.ok, false);
});

test('createBirthDateTimeInput returns incomplete when birthDate is missing', () => {
  const input = createBirthDateTimeInput({ ...completeProfile, birthDate: '' });

  assert.equal(input.status, 'incomplete');
  assert.equal(input.missingFields.includes('birthDate'), true);
  assert.equal(input.utcDateTime, null);
});

test('createBirthDateTimeInput returns incomplete when exact time is missing', () => {
  const input = createBirthDateTimeInput({ ...completeProfile, birthTime: '' });

  assert.equal(input.status, 'incomplete');
  assert.equal(input.missingFields.includes('birthTime'), true);
  assert.equal(input.utcDateTime, null);
});

test('createBirthDateTimeInput handles unknown birth time safely', () => {
  const input = createBirthDateTimeInput({
    ...completeProfile,
    birthTime: '',
    birthTimeAccuracy: 'unknown',
  });

  assert.equal(input.hasKnownTime, false);
  assert.equal(input.canConvertToUtc, false);
  assert.equal(input.utcDateTime, null);
  assert.equal(input.warnings.includes('Время рождения неизвестно — ASC/MC и дома недоступны.'), true);
});

test('createBirthDateTimeInput returns missingFields and warning for missing timezone', () => {
  const input = createBirthDateTimeInput({
    ...completeProfile,
    birthPlace: { ...completeProfile.birthPlace, timezone: '' },
  });

  assert.equal(input.status, 'incomplete');
  assert.equal(input.missingFields.includes('birthPlace.timezone'), true);
  assert.equal(
    input.warnings.includes('Для точного расчета нужен часовой пояс места рождения.'),
    true,
  );
});

test('createBirthDateTimeInput does not fake UTC conversion', () => {
  const input = createBirthDateTimeInput(completeProfile);

  assert.equal(input.status, 'notSupported');
  assert.equal(input.canConvertToUtc, false);
  assert.equal(input.utcDateTime, null);
  assert.equal(
    input.limitations.includes('Точная конвертация времени рождения в UTC требует надежной timezone-стратегии.'),
    true,
  );
});

test('getBirthDateTimeReadiness keeps houses and ASC/MC unavailable without known time or coordinates', () => {
  const unknownTime = getBirthDateTimeReadiness({
    ...completeProfile,
    birthTime: '',
    birthTimeAccuracy: 'unknown',
  });
  const missingCoordinates = getBirthDateTimeReadiness({
    ...completeProfile,
    birthPlace: { ...completeProfile.birthPlace, latitude: null, longitude: null },
  });

  assert.equal(unknownTime.readyForDateBasedCalculations, true);
  assert.equal(unknownTime.readyForTimeBasedCalculations, false);
  assert.equal(unknownTime.readyForHouseCalculations, false);
  assert.equal(unknownTime.readyForAscMc, false);
  assert.equal(missingCoordinates.readyForHouseCalculations, false);
  assert.equal(missingCoordinates.readyForAscMc, false);
});

test('explainBirthDateTimeLimitations returns safe Russian limitations', () => {
  const input = createBirthDateTimeInput({
    ...completeProfile,
    birthTime: '',
    birthTimeAccuracy: 'unknown',
    birthPlace: { ...completeProfile.birthPlace, latitude: null, longitude: null },
  });
  const limitations = explainBirthDateTimeLimitations(input);

  assert.equal(limitations.includes('Время рождения неизвестно — ASC/MC и дома недоступны.'), true);
  assert.equal(limitations.includes('Для домов и ASC/MC нужны координаты места рождения.'), true);
});

test('invalid input does not throw or expose fake natal claims', () => {
  assert.doesNotThrow(() => createBirthDateTimeInput(null));

  const serialized = JSON.stringify(createBirthDateTimeInput(completeProfile));

  assert.equal(serialized.includes('Луна в 7 доме'), false);
  assert.equal(serialized.includes('Плутон ☌ Венера'), false);
  assert.equal(serialized.includes('персональный транзит доступен'), false);
  assert.equal(serialized.includes('utcDateTime":"'), false);
});
