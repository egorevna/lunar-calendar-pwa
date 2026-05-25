import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import test from 'node:test';

import {
  HOUSE_SYSTEM_KEYS,
  HOUSE_SYSTEM_LABELS,
  calculateHousesForSelectedSystem,
  calculateHousesFromAscMcForSelectedSystem,
  getAvailableHouseSystems,
  getHouseSystemLabel,
  getHouseSystemResolverCapabilities,
  getHouseSystemResolverLimitations,
  isSupportedHouseSystem,
  normalizeHouseSystemValue,
  resolveHouseSystemSelection,
} from '../src/houseSystemResolver.js';
import { getPlacidusValidationStatus } from '../src/placidusHouses.js';

const ariesAsc = Object.freeze({
  key: 'asc',
  label: 'ASC',
  longitude: 14.5,
  sign: Object.freeze({ key: 'aries', ru: 'Овен', symbol: '♈' }),
  degree: 14,
  minutes: 30,
  text: 'Овен 14°30′',
});

const readyAscMcResult = Object.freeze({
  status: 'ready',
  ready: true,
  houseSystem: 'whole-sign',
  angles: Object.freeze({
    asc: ariesAsc,
    mc: Object.freeze({
      key: 'mc',
      label: 'MC',
      longitude: 270,
      sign: Object.freeze({ key: 'capricorn', ru: 'Козерог', symbol: '♑' }),
      degree: 0,
      minutes: 0,
      text: 'Козерог 0°00′',
    }),
    dsc: Object.freeze({
      key: 'dsc',
      label: 'DSC',
      longitude: 194.5,
      sign: Object.freeze({ key: 'libra', ru: 'Весы', symbol: '♎' }),
      degree: 14,
      minutes: 30,
      text: 'Весы 14°30′',
    }),
    ic: Object.freeze({
      key: 'ic',
      label: 'IC',
      longitude: 90,
      sign: Object.freeze({ key: 'cancer', ru: 'Рак', symbol: '♋' }),
      degree: 0,
      minutes: 0,
      text: 'Рак 0°00′',
    }),
  }),
});

const readyProfile = Object.freeze({
  id: 'profile-router-ready',
  name: 'Мария',
  birthDate: '1990-01-01',
  birthTime: '12:00',
  birthTimeAccuracy: 'exact',
  birthPlace: Object.freeze({
    city: 'Москва',
    country: 'Россия',
    latitude: 55.7558,
    longitude: 37.6173,
    timezone: 'Europe/Moscow',
  }),
  currentPlace: Object.freeze({
    mode: 'moscow',
    city: 'Москва',
    country: 'Россия',
    latitude: null,
    longitude: null,
    timezone: 'Europe/Moscow',
  }),
  houseSystem: 'placidus',
  zodiac: 'tropical',
});

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function cloneProfile(overrides = {}) {
  const profile = clone(readyProfile);

  return {
    ...profile,
    ...overrides,
    birthPlace: {
      ...profile.birthPlace,
      ...(overrides.birthPlace ?? {}),
    },
  };
}

function profileWithoutHouseSystem() {
  const profile = cloneProfile();
  delete profile.houseSystem;

  return profile;
}

function assertSafeRouterOutput(value) {
  const json = JSON.stringify(value);

  assert.equal(json.includes('1990-01-01'), false);
  assert.equal(json.includes('12:00'), false);
  assert.equal(json.includes('Europe/Moscow'), false);
  assert.equal(json.includes('55.7558'), false);
  assert.equal(json.includes('37.6173'), false);
  assert.equal(json.includes('"birthDate"'), false);
  assert.equal(json.includes('"birthTime"'), false);
  assert.equal(json.includes('"birthPlace"'), false);
  assert.equal(json.includes('"profile-router-ready"'), false);
  assert.equal(json.includes('NaN'), false);
  assert.equal(json.includes('undefined'), false);
}

test('house system constants and labels expose canonical keys only', () => {
  assert.deepEqual(HOUSE_SYSTEM_KEYS, {
    WHOLE_SIGN: 'whole-sign',
    EQUAL_HOUSE: 'equal-house',
    PLACIDUS: 'placidus',
  });
  assert.equal(HOUSE_SYSTEM_LABELS['whole-sign'], 'Whole Sign');
  assert.equal(HOUSE_SYSTEM_LABELS['equal-house'], 'Равнодомная');
  assert.equal(HOUSE_SYSTEM_LABELS.placidus, 'Placidus');
});

test('normalizeHouseSystemValue maps profile aliases to canonical keys', () => {
  assert.equal(normalizeHouseSystemValue('wholeSign'), 'whole-sign');
  assert.equal(normalizeHouseSystemValue('whole-sign'), 'whole-sign');
  assert.equal(normalizeHouseSystemValue('WholeSign'), 'whole-sign');
  assert.equal(normalizeHouseSystemValue('equal'), 'equal-house');
  assert.equal(normalizeHouseSystemValue('equalHouse'), 'equal-house');
  assert.equal(normalizeHouseSystemValue('equal-house'), 'equal-house');
  assert.equal(normalizeHouseSystemValue('placidus'), 'placidus');
  assert.equal(normalizeHouseSystemValue('Placidus'), 'placidus');
  assert.equal(normalizeHouseSystemValue('campanus'), null);
  assert.equal(normalizeHouseSystemValue(null), null);
});

test('resolveHouseSystemSelection defaults only when no value is saved', () => {
  const defaulted = resolveHouseSystemSelection(profileWithoutHouseSystem());

  assert.equal(defaulted.status, 'ready');
  assert.equal(defaulted.selectedHouseSystem, 'whole-sign');
  assert.equal(defaulted.houseSystemLabel, 'Whole Sign');
  assert.equal(defaulted.selectionSource, 'default');
  assert.equal(defaulted.defaulted, true);
  assert.equal(defaulted.reason, null);
});

test('resolveHouseSystemSelection reads profile value and explicit options override it', () => {
  const profileSelection = resolveHouseSystemSelection(cloneProfile({ houseSystem: 'equal' }));
  const explicitSelection = resolveHouseSystemSelection(
    cloneProfile({ houseSystem: 'wholeSign' }),
    { houseSystem: 'placidus' },
  );

  assert.equal(profileSelection.status, 'ready');
  assert.equal(profileSelection.selectedHouseSystem, 'equal-house');
  assert.equal(profileSelection.selectionSource, 'profile');
  assert.equal(profileSelection.defaulted, false);
  assert.equal(explicitSelection.status, 'ready');
  assert.equal(explicitSelection.selectedHouseSystem, 'placidus');
  assert.equal(explicitSelection.selectionSource, 'explicit');
  assert.equal(explicitSelection.defaulted, false);
});

test('resolveHouseSystemSelection rejects unknown values without default fallback', () => {
  const result = resolveHouseSystemSelection(cloneProfile({ houseSystem: 'campanus' }));

  assert.equal(result.status, 'unsupported');
  assert.equal(result.selectedHouseSystem, null);
  assert.equal(result.houseSystemLabel, 'Неизвестная система домов');
  assert.equal(result.selectionSource, 'profile');
  assert.equal(result.defaulted, false);
  assert.equal(result.reason, 'unknownHouseSystem');
  assert.equal(result.message, 'Выбрана неизвестная система домов.');
});

test('labels, availability and capabilities describe three separate systems', () => {
  const available = getAvailableHouseSystems();
  const placidusStatus = getPlacidusValidationStatus();
  const capabilities = getHouseSystemResolverCapabilities();
  const limitations = getHouseSystemResolverLimitations().join(' ');

  assert.equal(getHouseSystemLabel('whole-sign'), 'Whole Sign');
  assert.equal(getHouseSystemLabel('equal-house'), 'Равнодомная');
  assert.equal(getHouseSystemLabel('placidus'), 'Placidus');
  assert.equal(getHouseSystemLabel('unknown'), 'Неизвестная система домов');
  assert.deepEqual(available.map((system) => system.key), ['whole-sign', 'equal-house', 'placidus']);
  assert.equal(available.find((system) => system.key === 'placidus').ready, placidusStatus.implementationReady);
  assert.equal(isSupportedHouseSystem('whole-sign'), true);
  assert.equal(isSupportedHouseSystem('equal-house'), true);
  assert.equal(isSupportedHouseSystem('placidus'), true);
  assert.equal(isSupportedHouseSystem('campanus'), false);
  assert.equal(capabilities.resolver, true);
  assert.equal(capabilities.selectedSystemRouting, true);
  assert.equal(capabilities.silentFallback, false);
  assert.equal(capabilities.planetInHouse, false);
  assert.match(limitations, /не подменяются/);
});

test('calculateHousesForSelectedSystem routes Whole Sign selection to Whole Sign engine', () => {
  const profile = cloneProfile({ houseSystem: 'wholeSign' });
  const result = calculateHousesForSelectedSystem(profile);

  assert.equal(result.status, 'ready');
  assert.equal(result.ready, true);
  assert.equal(result.selectedHouseSystem, 'whole-sign');
  assert.equal(result.houseSystem, 'whole-sign');
  assert.equal(result.houseSystemLabel, 'Whole Sign');
  assert.equal(result.selectionSource, 'profile');
  assert.equal(result.defaulted, false);
  assert.equal(result.houses.length, 12);
  assert.equal(result.houses[0].sign.key, result.angles.asc.sign.key);
  assert.equal(result.result.houseSystem, 'whole-sign');
  assertSafeRouterOutput(result);
});

test('calculateHousesForSelectedSystem routes Equal House selection to Equal House engine', () => {
  const profile = cloneProfile({ houseSystem: 'equal' });
  const result = calculateHousesForSelectedSystem(profile);

  assert.equal(result.status, 'ready');
  assert.equal(result.ready, true);
  assert.equal(result.selectedHouseSystem, 'equal-house');
  assert.equal(result.houseSystem, 'equal-house');
  assert.equal(result.houseSystemLabel, 'Равнодомная');
  assert.equal(result.selectionSource, 'profile');
  assert.equal(result.defaulted, false);
  assert.equal(result.cusps.length, 12);
  assert.equal(result.houses.length, 12);
  assert.equal(result.result.houseSystem, 'equal-house');
  assertSafeRouterOutput(result);
});

test('calculateHousesForSelectedSystem routes Placidus selection to Placidus engine', () => {
  const profile = cloneProfile({ houseSystem: 'placidus' });
  const result = calculateHousesForSelectedSystem(profile);

  assert.equal(result.status, 'ready');
  assert.equal(result.ready, true);
  assert.equal(result.selectedHouseSystem, 'placidus');
  assert.equal(result.houseSystem, 'placidus');
  assert.equal(result.houseSystemLabel, 'Placidus');
  assert.equal(result.selectionSource, 'profile');
  assert.equal(result.defaulted, false);
  assert.equal(result.cusps.length, 12);
  assert.equal(result.houses.length, 12);
  assert.equal(result.result.houseSystem, 'placidus');
  assertSafeRouterOutput(result);
});

test('missing houseSystem defaults to Whole Sign without overriding explicit systems', () => {
  const result = calculateHousesForSelectedSystem(profileWithoutHouseSystem());

  assert.equal(result.status, 'ready');
  assert.equal(result.selectedHouseSystem, 'whole-sign');
  assert.equal(result.houseSystem, 'whole-sign');
  assert.equal(result.selectionSource, 'default');
  assert.equal(result.defaulted, true);
  assert.equal(result.result.houseSystem, 'whole-sign');
});

test('explicit options override profile houseSystem without mutating the profile', () => {
  const profile = cloneProfile({ houseSystem: 'wholeSign' });
  const before = JSON.stringify(profile);
  const result = calculateHousesForSelectedSystem(profile, { houseSystem: 'equalHouse' });

  assert.equal(result.status, 'ready');
  assert.equal(result.selectedHouseSystem, 'equal-house');
  assert.equal(result.houseSystem, 'equal-house');
  assert.equal(result.selectionSource, 'explicit');
  assert.equal(result.defaulted, false);
  assert.equal(JSON.stringify(profile), before);
});

test('unknown profile houseSystem returns unsupported and does not fallback', () => {
  const result = calculateHousesForSelectedSystem(cloneProfile({ houseSystem: 'campanus' }));

  assert.equal(result.status, 'unsupported');
  assert.equal(result.ready, false);
  assert.equal(result.reason, 'unknownHouseSystem');
  assert.equal(result.selectedHouseSystem, null);
  assert.equal(result.houseSystem, null);
  assert.equal(result.houses.length, 0);
  assert.equal(result.cusps.length, 0);
  assert.equal(result.result, null);
  assertSafeRouterOutput(result);
});

test('router preserves selected engine notReady reason without trying another system', () => {
  const result = calculateHousesForSelectedSystem(cloneProfile({
    houseSystem: 'equal',
    birthTime: '',
    birthTimeAccuracy: 'unknown',
  }));

  assert.equal(result.status, 'notReady');
  assert.equal(result.ready, false);
  assert.equal(result.selectedHouseSystem, 'equal-house');
  assert.equal(result.houseSystem, 'equal-house');
  assert.equal(result.reason, 'missingExactBirthTime');
  assert.equal(result.houses.length, 0);
  assert.equal(result.result.reason, 'missingExactBirthTime');
  assertSafeRouterOutput(result);
});

test('router preserves selected Placidus unsupported reason and does not fallback', () => {
  const result = calculateHousesForSelectedSystem(cloneProfile({
    houseSystem: 'placidus',
    birthPlace: {
      city: 'Тромсе',
      country: 'Норвегия',
      latitude: 67,
      longitude: 18.9553,
      timezone: 'Europe/Oslo',
    },
  }));

  assert.equal(result.status, 'unsupported');
  assert.equal(result.ready, false);
  assert.equal(result.selectedHouseSystem, 'placidus');
  assert.equal(result.houseSystem, 'placidus');
  assert.equal(result.reason, 'placidusUnsupportedAtLatitude');
  assert.equal(result.houses.length, 0);
  assert.equal(result.cusps.length, 0);
  assert.equal(result.result.reason, 'placidusUnsupportedAtLatitude');
  assertSafeRouterOutput(result);
});

test('calculateHousesFromAscMcForSelectedSystem routes ready ASC/MC to selected fromAscMc engine', () => {
  const whole = calculateHousesFromAscMcForSelectedSystem(readyAscMcResult, 'whole-sign');
  const equal = calculateHousesFromAscMcForSelectedSystem(readyAscMcResult, 'equal-house');
  const placidus = calculateHousesFromAscMcForSelectedSystem(readyAscMcResult, 'placidus');

  assert.equal(whole.status, 'ready');
  assert.equal(whole.houseSystem, 'whole-sign');
  assert.equal(whole.selectedHouseSystem, 'whole-sign');
  assert.equal(whole.houses.length, 12);
  assert.equal(equal.status, 'ready');
  assert.equal(equal.houseSystem, 'equal-house');
  assert.equal(equal.selectedHouseSystem, 'equal-house');
  assert.equal(equal.cusps.length, 12);
  assert.equal(placidus.status, 'notReady');
  assert.equal(placidus.selectedHouseSystem, 'placidus');
  assert.equal(placidus.houseSystem, 'placidus');
  assert.equal(placidus.reason, 'missingPlacidusCalculationInputs');
});

test('router output and source stay safe and routing-only', async () => {
  const profile = cloneProfile({ houseSystem: 'placidus' });
  const before = JSON.stringify(profile);
  const result = calculateHousesForSelectedSystem(profile);
  const source = await readFile(new URL('../src/houseSystemResolver.js', import.meta.url), 'utf8');

  assertSafeRouterOutput(result);
  assert.equal(JSON.stringify(profile), before);
  assert.equal(source.includes('provider'), false);
  assert.equal(source.includes('profileStorage'), false);
  assert.equal(source.includes('localStorage'), false);
  assert.equal(source.includes('document.'), false);
  assert.equal(source.includes('window.'), false);
  assert.equal(source.includes('calculateAscMc('), false);
  assert.equal(source.includes('calculateWholeSignHouses('), false);
  assert.equal(source.includes('calculateEqualHouseHouses('), false);
  assert.equal(source.includes('calculateEqualHouseCusps('), false);
  assert.equal(source.includes('calculatePlacidusHouses('), false);
  assert.equal(source.includes('planetInHouse: true'), false);
  assert.equal(source.includes('assignPlanet'), false);
  assert.equal(source.includes('фаталь'), false);
  assert.equal(source.includes('карми'), false);
});

test('forbidden generic router files are not created', async () => {
  await assert.rejects(access(new URL('../src/houses.js', import.meta.url)));
  await assert.rejects(access(new URL('../src/houseSystems.js', import.meta.url)));
});
