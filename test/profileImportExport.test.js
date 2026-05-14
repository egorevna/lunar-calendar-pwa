import assert from 'node:assert/strict';
import test from 'node:test';

import {
  importProfilesIntoStorage,
  parseProfilesImport,
  serializeProfiles,
} from '../src/profileImportExport.js';
import {
  clearProfileStorageForTests,
  loadProfiles,
  saveProfiles,
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

const secondProfile = {
  ...validProfile,
  id: 'profile-egor',
  name: 'Егор',
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

test('serializeProfiles creates export envelope', () => {
  const jsonText = serializeProfiles([validProfile], new Date('2026-05-14T10:00:00.000Z'));
  const data = JSON.parse(jsonText);

  assert.equal(data.schemaVersion, 1);
  assert.equal(data.app, 'astro-pwa');
  assert.equal(data.exportedAt, '2026-05-14T10:00:00.000Z');
  assert.equal(data.profiles.length, 1);
  assert.equal(data.profiles[0].name, 'Анна');
});

test('parseProfilesImport accepts valid JSON', () => {
  const result = parseProfilesImport(serializeProfiles([validProfile]));

  assert.equal(result.ok, true);
  assert.equal(result.profiles.length, 1);
  assert.equal(result.profiles[0].id, 'profile-anna');
});

test('parseProfilesImport rejects invalid JSON', () => {
  const result = parseProfilesImport('{broken');

  assert.equal(result.ok, false);
  assert.equal(result.error, 'invalid json');
});

test('parseProfilesImport rejects invalid structure', () => {
  const result = parseProfilesImport(JSON.stringify({ schemaVersion: 1, app: 'astro-pwa' }));

  assert.equal(result.ok, false);
  assert.equal(result.error, 'profiles must be an array');
});

test('import filters invalid profiles', () => {
  clearProfileStorageForTests();
  const invalidProfile = { ...validProfile, id: 'profile-invalid', name: '' };
  const result = importProfilesIntoStorage(serializeProfiles([invalidProfile, validProfile]));

  assert.equal(result.ok, true);
  assert.equal(result.importedCount, 1);
  assert.equal(loadProfiles().length, 1);
  assert.equal(loadProfiles()[0].id, 'profile-anna');
});

test('import regenerates duplicate ids and does not overwrite existing profile', () => {
  clearProfileStorageForTests();
  saveProfiles([validProfile]);

  const result = importProfilesIntoStorage(serializeProfiles([
    { ...validProfile, name: 'Анна копия' },
    secondProfile,
  ]));
  const profiles = loadProfiles();

  assert.equal(result.ok, true);
  assert.equal(result.importedCount, 2);
  assert.equal(profiles.length, 3);
  assert.equal(profiles.find((profile) => profile.id === 'profile-anna').name, 'Анна');
  assert.equal(profiles.some((profile) => profile.name === 'Анна копия'), true);
  assert.notEqual(
    profiles.find((profile) => profile.name === 'Анна копия').id,
    'profile-anna',
  );
});

test('repeated import of the same JSON does not create duplicates', () => {
  clearProfileStorageForTests();
  const jsonText = serializeProfiles([validProfile, secondProfile]);

  const first = importProfilesIntoStorage(jsonText);
  const second = importProfilesIntoStorage(jsonText);

  assert.equal(first.importedCount, 2);
  assert.equal(first.skippedCount, 0);
  assert.equal(second.importedCount, 0);
  assert.equal(second.skippedCount, 2);
  assert.equal(loadProfiles().length, 2);
});

test('import skips profile with same id and same content', () => {
  clearProfileStorageForTests();
  saveProfiles([validProfile]);

  const result = importProfilesIntoStorage(serializeProfiles([validProfile]));

  assert.equal(result.ok, true);
  assert.equal(result.importedCount, 0);
  assert.equal(result.skippedCount, 1);
  assert.equal(loadProfiles().length, 1);
});

test('import skips profile with different id but same content', () => {
  clearProfileStorageForTests();
  saveProfiles([validProfile]);

  const result = importProfilesIntoStorage(serializeProfiles([
    { ...validProfile, id: 'profile-anna-copy' },
  ]));

  assert.equal(result.ok, true);
  assert.equal(result.importedCount, 0);
  assert.equal(result.skippedCount, 1);
  assert.equal(loadProfiles().length, 1);
});

test('import imports changed profile with same id under a new id', () => {
  clearProfileStorageForTests();
  saveProfiles([validProfile]);

  const result = importProfilesIntoStorage(serializeProfiles([
    { ...validProfile, name: 'Анна копия' },
  ]));
  const profiles = loadProfiles();

  assert.equal(result.ok, true);
  assert.equal(result.importedCount, 1);
  assert.equal(result.skippedCount, 0);
  assert.equal(profiles.length, 2);
  assert.equal(profiles.find((profile) => profile.id === 'profile-anna').name, 'Анна');
  assert.notEqual(profiles.find((profile) => profile.name === 'Анна копия').id, 'profile-anna');
});

test('import returns a clear error when no valid profiles are found', () => {
  clearProfileStorageForTests();
  const result = importProfilesIntoStorage(serializeProfiles([{ ...validProfile, name: '' }]));

  assert.equal(result.ok, false);
  assert.equal(result.error, 'no valid profiles');
  assert.equal(result.importedCount, 0);
  assert.equal(result.skippedCount, 0);
});

test('export and import data does not expose empty technical values', () => {
  const jsonText = serializeProfiles([validProfile]);
  const imported = importProfilesIntoStorage(jsonText);
  const text = JSON.stringify({ jsonText, imported });

  assert.equal(text.includes('undefined'), false);
});
