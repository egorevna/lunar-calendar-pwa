import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { createBirthDateTimeInput } from '../src/birthDateTime.js';
import { calculateAscMcForProfile } from '../src/ascMc.js';
import { calculatePlacidusHousesForProfile } from '../src/placidusHouses.js';
import { getHousesForProfile } from '../src/housesForProfile.js';
import { describeHousesBlock } from '../src/profileUi.js';
import {
  addProfile,
  clearProfileStorageForTests,
  getActiveProfileId,
  loadProfiles,
  setActiveProfileId,
} from '../src/profileStorage.js';

const MOSCOW_PLACIDUS_PROFILE = Object.freeze({
  id: 'profile-egor-moscow-placidus-runtime-regression',
  name: 'Egor Moscow Placidus Regression',
  birthDate: '1981-04-16',
  birthTime: '04:45',
  birthTimeAccuracy: 'exact',
  birthPlace: Object.freeze({
    city: 'Москва',
    country: 'Россия',
    timezone: 'Europe/Moscow',
    coordinates: Object.freeze({
      latitude: 55.7558,
      longitude: 37.6173,
    }),
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

const EXPECTED_UTC = '1981-04-16T00:45:00.000Z';
const EXPECTED_ANGLE_ROWS = Object.freeze([
  'ASC — Водолей 14°57′17″',
  'MC — Стрелец 14°16′58″',
  'DSC — Лев 14°57′17″',
  'IC — Близнецы 14°16′58″',
]);
const EXPECTED_HOUSE_ROWS = Object.freeze([
  '1 дом — Водолей 14°57′17″',
  '2 дом — Овен 24°02′09″',
  '3 дом — Телец 25°30′04″',
  '4 дом — Близнецы 14°16′58″',
  '5 дом — Близнецы 29°46′49″',
  '6 дом — Рак 16°42′10″',
  '7 дом — Лев 14°57′17″',
  '8 дом — Весы 24°02′09″',
  '9 дом — Скорпион 25°30′04″',
  '10 дом — Стрелец 14°16′58″',
  '11 дом — Стрелец 29°46′49″',
  '12 дом — Козерог 16°42′10″',
]);
const EXPECTED_CUSPS = Object.freeze([
  314.954953,
  24.035906,
  55.501108,
  74.282890,
  89.780290,
  106.703066,
  134.954953,
  204.035906,
  235.501108,
  254.282890,
  269.780290,
  286.703066,
]);
const BAD_DUPLICATE_ROWS = Object.freeze([
  '5 дом — Близнецы 14°12′',
  '6 дом — Близнецы 14°12′',
  '11 дом — Стрелец 14°12′',
  '12 дом — Стрелец 14°12′',
  'ASC — Водолей 14°47′',
  'MC — Стрелец 14°12′',
  '5 дом — Близнецы 29°42′',
  '6 дом — Рак 16°36′',
]);

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

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function angularDelta(a, b) {
  const diff = Math.abs((((a - b) % 360) + 360) % 360);

  return Math.min(diff, 360 - diff);
}

function assertClose(actual, expected, tolerance, label) {
  assert.ok(
    angularDelta(actual, expected) <= tolerance,
    `${label}: expected ${actual} within ${tolerance}° of ${expected}`,
  );
}

function assertNoSensitiveOutput(value) {
  const json = JSON.stringify(value);

  [
    '"birthDate"',
    '"birthTime"',
    'utcDateTime',
    'Europe/Moscow',
    '"birthPlace"',
    '"coordinates"',
    '"latitude"',
    '"longitude"',
    '55.7558',
    '37.6173',
    'raw',
    'provider',
    'NaN',
    'undefined',
  ].forEach((fragment) => {
    assert.equal(json.includes(fragment), false, fragment);
  });
}

function assertPlacidusDisplayInvariants(view) {
  assert.equal(view.angles[0], EXPECTED_ANGLE_ROWS[0]);
  assert.equal(view.angles[1], EXPECTED_ANGLE_ROWS[1]);
  assert.equal(view.angles[2], EXPECTED_ANGLE_ROWS[2]);
  assert.equal(view.angles[3], EXPECTED_ANGLE_ROWS[3]);
  assert.equal(view.angles[0].replace('ASC — ', ''), view.houses[0].replace('1 дом — ', ''));
  assert.equal(view.angles[1].replace('MC — ', ''), view.houses[9].replace('10 дом — ', ''));
  assert.equal(view.angles[2].replace('DSC — ', ''), view.houses[6].replace('7 дом — ', ''));
  assert.equal(view.angles[3].replace('IC — ', ''), view.houses[3].replace('4 дом — ', ''));
}

test('Moscow 1981 Placidus runtime path stays consistent from UTC conversion to profile UI view model', () => {
  const profile = clone(MOSCOW_PLACIDUS_PROFILE);
  const before = JSON.stringify(profile);
  const birthDateTime = createBirthDateTimeInput(profile);
  const ascMc = calculateAscMcForProfile(profile);
  const placidus = calculatePlacidusHousesForProfile(profile);
  const housesView = getHousesForProfile(profile);
  const profileUiView = describeHousesBlock(profile);

  assert.equal(birthDateTime.canConvertToUtc, true);
  assert.equal(birthDateTime.utcDateTime, EXPECTED_UTC);
  assert.equal(ascMc.status, 'ready');
  assert.equal(ascMc.angles.asc.text, 'Водолей 14°57′02″');
  assert.equal(ascMc.angles.mc.text, 'Стрелец 14°16′58″');

  assert.equal(placidus.status, 'ready');
  assert.notEqual(ascMc.angles.asc.text, placidus.angles.asc.text);
  assert.equal(placidus.angles.asc.text, 'Водолей 14°57′17″');
  assert.equal(placidus.angles.mc.text, 'Стрелец 14°16′58″');
  assert.equal(placidus.cusps.length, 12);
  placidus.cusps.forEach((cusp, index) => {
    assert.equal(cusp.number, index + 1);
    assertClose(cusp.longitude, EXPECTED_CUSPS[index], 0.001, `cusp ${index + 1}`);
  });
  assert.equal(new Set(placidus.cusps.map((cusp) => cusp.longitude.toFixed(6))).size, 12);
  assert.notEqual(placidus.houses[3].text, placidus.houses[4].text);
  assert.notEqual(placidus.houses[4].text, placidus.houses[5].text);
  assert.notEqual(placidus.houses[9].text, placidus.houses[10].text);
  assert.notEqual(placidus.houses[10].text, placidus.houses[11].text);

  assert.equal(housesView.status, 'ready');
  assert.deepEqual(housesView.houses.map((house) => house.text), EXPECTED_HOUSE_ROWS);
  assertNoSensitiveOutput(housesView);

  assert.equal(profileUiView.summary, 'Система домов: Placidus');
  assert.deepEqual(profileUiView.angles, EXPECTED_ANGLE_ROWS);
  assert.deepEqual(profileUiView.houses, EXPECTED_HOUSE_ROWS);
  assertPlacidusDisplayInvariants(profileUiView);
  BAD_DUPLICATE_ROWS.forEach((row) => {
    assert.equal(JSON.stringify(profileUiView).includes(row), false, row);
  });
  assertNoSensitiveOutput(profileUiView);
  assert.equal(JSON.stringify(profile), before);
});

test('Moscow 1981 Placidus real storage flow uses manual nested coordinates over stale legacy direct fields', () => {
  clearProfileStorageForTests();

  const profile = clone({
    ...MOSCOW_PLACIDUS_PROFILE,
    birthTimezone: 'Europe/Moscow',
    birthPlace: {
      ...MOSCOW_PLACIDUS_PROFILE.birthPlace,
      latitude: 55.7558,
      longitude: 37.53,
      coordinates: {
        latitude: 55.7558,
        longitude: 37.6173,
      },
    },
  });
  const addResult = addProfile(profile);

  assert.equal(addResult.ok, true);
  assert.equal(setActiveProfileId(profile.id).ok, true);
  assert.equal(getActiveProfileId(), profile.id);

  const loadedActiveProfile = loadProfiles().find((item) => item.id === getActiveProfileId());

  assert.equal(loadedActiveProfile.houseSystem, 'placidus');
  assert.equal(loadedActiveProfile.birthPlace.timezone, 'Europe/Moscow');
  assert.deepEqual(loadedActiveProfile.birthPlace.coordinates, {
    latitude: 55.7558,
    longitude: 37.6173,
  });
  assert.equal(loadedActiveProfile.birthPlace.latitude, 55.7558);
  assert.equal(loadedActiveProfile.birthPlace.longitude, 37.6173);

  const birthDateTime = createBirthDateTimeInput(loadedActiveProfile);
  const housesView = getHousesForProfile(loadedActiveProfile);
  const profileUiView = describeHousesBlock(loadedActiveProfile);

  assert.equal(birthDateTime.utcDateTime, EXPECTED_UTC);
  assert.deepEqual(housesView.houses.map((house) => house.text), EXPECTED_HOUSE_ROWS);
  assert.deepEqual(profileUiView.angles, EXPECTED_ANGLE_ROWS);
  assert.deepEqual(profileUiView.houses, EXPECTED_HOUSE_ROWS);
  assertPlacidusDisplayInvariants(profileUiView);
  BAD_DUPLICATE_ROWS.forEach((row) => {
    assert.equal(JSON.stringify(profileUiView).includes(row), false, row);
  });
  assertNoSensitiveOutput(housesView);
  assertNoSensitiveOutput(profileUiView);
});

test.after(() => {
  clearProfileStorageForTests();
});

test('served Placidus source contains the fixed intermediate-cusp mapping used by the UI path', async () => {
  const source = await readFile(new URL('../src/placidusHouses.js', import.meta.url), 'utf8');

  assert.equal(source.includes('normalizeDegrees(c11 + HALF_CIRCLE)'), true);
  assert.equal(source.includes('normalizeDegrees(c12 + HALF_CIRCLE)'), true);
  assert.equal(source.includes('mcLongitude,\\n    mcLongitude'), false);
  assert.equal(source.includes('icLongitude,\\n    icLongitude'), false);
});
