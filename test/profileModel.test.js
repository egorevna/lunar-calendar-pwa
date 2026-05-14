import assert from 'node:assert/strict';
import test from 'node:test';

import {
  createProfileDraft,
  createProfileId,
  isValidProfile,
  normalizeProfile,
  validateProfile,
} from '../src/profileModel.js';

const validInput = {
  id: 'profile-test',
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

test('createProfileDraft returns safe defaults', () => {
  const draft = createProfileDraft();

  assert.equal(draft.name, '');
  assert.equal(draft.birthDate, '');
  assert.equal(draft.birthTime, '');
  assert.equal(draft.birthTimeAccuracy, 'exact');
  assert.equal(draft.houseSystem, 'wholeSign');
  assert.equal(draft.zodiac, 'tropical');
  assert.equal(draft.currentPlace.mode, 'moscow');
  assert.equal(draft.currentPlace.city, 'Москва');
  assert.equal(draft.currentPlace.country, 'Россия');
  assert.equal(draft.currentPlace.timezone, 'Europe/Moscow');
  assert.equal(typeof draft.id, 'string');
  assert.notEqual(draft.id, '');
});

test('normalizeProfile fills default values', () => {
  const profile = normalizeProfile({
    name: 'Анна',
    birthDate: '1990-05-12',
    birthPlace: { city: 'Москва', country: 'Россия' },
  });

  assert.equal(profile.birthTimeAccuracy, 'exact');
  assert.equal(profile.houseSystem, 'wholeSign');
  assert.equal(profile.zodiac, 'tropical');
  assert.equal(profile.currentPlace.mode, 'moscow');
  assert.equal(profile.currentPlace.timezone, 'Europe/Moscow');
});

test('normalizeProfile trims user strings', () => {
  const profile = normalizeProfile({
    name: '  Анна  ',
    birthDate: ' 1990-05-12 ',
    birthTime: ' 08:45 ',
    birthPlace: {
      city: ' Москва ',
      country: ' Россия ',
      timezone: ' Europe/Moscow ',
    },
    currentPlace: {
      mode: 'custom',
      city: ' Санкт-Петербург ',
      country: ' Россия ',
      timezone: ' Europe/Moscow ',
    },
  });

  assert.equal(profile.name, 'Анна');
  assert.equal(profile.birthDate, '1990-05-12');
  assert.equal(profile.birthTime, '08:45');
  assert.equal(profile.birthPlace.city, 'Москва');
  assert.equal(profile.birthPlace.country, 'Россия');
  assert.equal(profile.birthPlace.timezone, 'Europe/Moscow');
  assert.equal(profile.currentPlace.city, 'Санкт-Петербург');
});

test('validateProfile accepts a valid profile', () => {
  assert.equal(validateProfile(validInput).valid, true);
});

test('validateProfile rejects empty name', () => {
  const result = validateProfile({ ...validInput, name: ' ' });

  assert.equal(result.valid, false);
  assert.equal(result.errors.includes('name is required'), true);
});

test('validateProfile rejects invalid birthDate', () => {
  const result = validateProfile({ ...validInput, birthDate: '1990-02-31' });

  assert.equal(result.valid, false);
  assert.equal(result.errors.includes('birthDate must use YYYY-MM-DD'), true);
});

test('validateProfile rejects invalid birthTime', () => {
  const result = validateProfile({ ...validInput, birthTime: '25:99' });

  assert.equal(result.valid, false);
  assert.equal(result.errors.includes('birthTime must use HH:mm'), true);
});

test('validateProfile allows empty birthTime when birthTimeAccuracy is unknown', () => {
  const result = validateProfile({
    ...validInput,
    birthTime: '',
    birthTimeAccuracy: 'unknown',
  });

  assert.equal(result.valid, true);
});

test('validateProfile rejects unknown birthTimeAccuracy', () => {
  const result = validateProfile({ ...validInput, birthTimeAccuracy: 'maybe' });

  assert.equal(result.valid, false);
  assert.equal(result.errors.includes('birthTimeAccuracy is unsupported'), true);
});

test('validateProfile rejects unknown houseSystem', () => {
  const result = validateProfile({ ...validInput, houseSystem: 'koch' });

  assert.equal(result.valid, false);
  assert.equal(result.errors.includes('houseSystem is unsupported'), true);
});

test('validateProfile rejects unknown zodiac', () => {
  const result = validateProfile({ ...validInput, zodiac: 'sidereal' });

  assert.equal(result.valid, false);
  assert.equal(result.errors.includes('zodiac is unsupported'), true);
});

test('validateProfile rejects empty birthPlace city or country', () => {
  const missingCity = validateProfile({
    ...validInput,
    birthPlace: { ...validInput.birthPlace, city: '' },
  });
  const missingCountry = validateProfile({
    ...validInput,
    birthPlace: { ...validInput.birthPlace, country: '' },
  });

  assert.equal(missingCity.valid, false);
  assert.equal(missingCity.errors.includes('birthPlace.city is required'), true);
  assert.equal(missingCountry.valid, false);
  assert.equal(missingCountry.errors.includes('birthPlace.country is required'), true);
});

test('validateProfile rejects unsupported currentPlace mode or empty custom timezone', () => {
  const unsupportedMode = validateProfile({
    ...validInput,
    currentPlace: { ...validInput.currentPlace, mode: 'currentDevice' },
  });
  const emptyCustomTimezone = validateProfile({
    ...validInput,
    currentPlace: { ...validInput.currentPlace, mode: 'custom', timezone: '' },
  });

  assert.equal(unsupportedMode.valid, false);
  assert.equal(unsupportedMode.errors.includes('currentPlace.mode is unsupported'), true);
  assert.equal(emptyCustomTimezone.valid, false);
  assert.equal(emptyCustomTimezone.errors.includes('currentPlace.timezone is required'), true);
});

test('isValidProfile returns a boolean', () => {
  assert.equal(isValidProfile(validInput), true);
  assert.equal(isValidProfile({ ...validInput, name: '' }), false);
});

test('createProfileId returns a non-empty string', () => {
  assert.equal(typeof createProfileId(), 'string');
  assert.notEqual(createProfileId(), '');
});
