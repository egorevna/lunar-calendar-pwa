import assert from 'node:assert/strict';
import test from 'node:test';

import {
  addProfile,
  clearProfileStorageForTests,
  deleteProfile,
  getActiveProfileId,
  loadProfiles,
  saveProfiles,
  setActiveProfileId,
  updateProfile,
} from '../src/profileStorage.js';

const validProfile = {
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

const invalidProfile = {
  ...validProfile,
  id: 'profile-invalid',
  name: '',
};

const storageState = new Map();

globalThis.localStorage = {
  getItem(key) {
    return storageState.has(key) ? storageState.get(key) : null;
  },
  setItem(key, value) {
    storageState.set(key, String(value));
  },
  removeItem(key) {
    storageState.delete(key);
  },
};

test('loadProfiles returns an empty array for empty storage', () => {
  clearProfileStorageForTests();

  assert.deepEqual(loadProfiles(), []);
});

test('saveProfiles stores valid profiles', () => {
  clearProfileStorageForTests();

  const saved = saveProfiles([validProfile]);

  assert.equal(saved.length, 1);
  assert.equal(saved[0].id, 'profile-anna');
});

test('loadProfiles returns saved normalized profiles', () => {
  clearProfileStorageForTests();

  saveProfiles([{ ...validProfile, name: ' Анна ' }]);
  const profiles = loadProfiles();

  assert.equal(profiles.length, 1);
  assert.equal(profiles[0].name, 'Анна');
});

test('loadProfiles normalizes manual nested birth coordinates over stale legacy direct coordinates', () => {
  clearProfileStorageForTests();

  saveProfiles([{
    ...validProfile,
    id: 'profile-egor-moscow-placidus',
    name: 'Egor Moscow Placidus Regression',
    birthDate: '1981-04-16',
    birthTime: '04:45',
    houseSystem: 'placidus',
    birthPlace: {
      city: 'Москва',
      country: 'Россия',
      timezone: 'Europe/Moscow',
      latitude: 55.7558,
      longitude: 37.53,
      coordinates: {
        latitude: 55.7558,
        longitude: 37.6173,
      },
    },
  }]);
  const profile = loadProfiles()[0];

  assert.equal(profile.houseSystem, 'placidus');
  assert.equal(profile.birthPlace.timezone, 'Europe/Moscow');
  assert.deepEqual(profile.birthPlace.coordinates, {
    latitude: 55.7558,
    longitude: 37.6173,
  });
  assert.equal(profile.birthPlace.latitude, 55.7558);
  assert.equal(profile.birthPlace.longitude, 37.6173);
});

test('corrupted JSON does not break loadProfiles', () => {
  clearProfileStorageForTests();
  localStorage.setItem('astroPwa.profiles.v1', '{broken');

  assert.deepEqual(loadProfiles(), []);
});

test('non-array profile storage does not break loadProfiles', () => {
  clearProfileStorageForTests();
  localStorage.setItem('astroPwa.profiles.v1', JSON.stringify({ profiles: [validProfile] }));

  assert.deepEqual(loadProfiles(), []);
});

test('invalid profiles are filtered out', () => {
  clearProfileStorageForTests();
  localStorage.setItem('astroPwa.profiles.v1', JSON.stringify([validProfile, invalidProfile]));

  const profiles = loadProfiles();

  assert.equal(profiles.length, 1);
  assert.equal(profiles[0].id, 'profile-anna');
});

test('addProfile adds a valid profile', () => {
  clearProfileStorageForTests();

  const result = addProfile(validProfile);

  assert.equal(result.ok, true);
  assert.equal(result.profile.id, 'profile-anna');
  assert.equal(loadProfiles().length, 1);
});

test('addProfile returns errors for invalid profile', () => {
  clearProfileStorageForTests();

  const result = addProfile(invalidProfile);

  assert.equal(result.ok, false);
  assert.equal(result.errors.includes('name is required'), true);
  assert.equal(loadProfiles().length, 0);
});

test('updateProfile updates profile and updatedAt', () => {
  clearProfileStorageForTests();
  saveProfiles([validProfile]);

  const result = updateProfile('profile-anna', { name: 'Анна Новая' });

  assert.equal(result.ok, true);
  assert.equal(result.profile.name, 'Анна Новая');
  assert.notEqual(result.profile.updatedAt, validProfile.updatedAt);
  assert.equal(loadProfiles()[0].name, 'Анна Новая');
});

test('updateProfile returns error for unknown id', () => {
  clearProfileStorageForTests();

  const result = updateProfile('missing-profile', { name: 'Анна' });

  assert.equal(result.ok, false);
  assert.equal(result.errors.includes('profile not found'), true);
});

test('deleteProfile removes a profile', () => {
  clearProfileStorageForTests();
  saveProfiles([validProfile]);

  const result = deleteProfile('profile-anna');

  assert.deepEqual(result, { ok: true });
  assert.deepEqual(loadProfiles(), []);
});

test('deleteProfile resets activeProfileId when active profile is removed', () => {
  clearProfileStorageForTests();
  saveProfiles([validProfile]);
  setActiveProfileId('profile-anna');

  deleteProfile('profile-anna');

  assert.equal(getActiveProfileId(), null);
  assert.equal(localStorage.getItem('astroPwa.activeProfileId.v1'), null);
});

test('setActiveProfileId stores existing profile id', () => {
  clearProfileStorageForTests();
  saveProfiles([validProfile]);

  const result = setActiveProfileId('profile-anna');

  assert.deepEqual(result, { ok: true, activeProfileId: 'profile-anna' });
  assert.equal(getActiveProfileId(), 'profile-anna');
});

test('setActiveProfileId null resets active profile', () => {
  clearProfileStorageForTests();
  saveProfiles([validProfile]);
  setActiveProfileId('profile-anna');

  const result = setActiveProfileId(null);

  assert.deepEqual(result, { ok: true, activeProfileId: null });
  assert.equal(getActiveProfileId(), null);
});

test('setActiveProfileId returns error for unknown profile id', () => {
  clearProfileStorageForTests();

  const result = setActiveProfileId('missing-profile');

  assert.equal(result.ok, false);
  assert.equal(result.errors.includes('profile not found'), true);
});

test('getActiveProfileId returns null when saved id does not exist', () => {
  clearProfileStorageForTests();
  localStorage.setItem('astroPwa.activeProfileId.v1', 'missing-profile');

  assert.equal(getActiveProfileId(), null);
});

test('profile storage does not use network or device geolocation APIs', () => {
  assert.equal(fetchCalls, 0);
  assert.equal(geolocationCalls, 0);
});

let fetchCalls = 0;
let geolocationCalls = 0;

globalThis.fetch = () => {
  fetchCalls += 1;
  throw new Error('fetch must not be used by profileStorage');
};

Object.defineProperty(globalThis, 'navigator', {
  configurable: true,
  value: {
    geolocation: {
      getCurrentPosition() {
        geolocationCalls += 1;
        throw new Error('geolocation must not be used by profileStorage');
      },
    },
  },
});
