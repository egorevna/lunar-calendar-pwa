import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { getHousesDebugState } from '../src/housesDebug.js';

const MODULE_PATH = new URL('../src/housesDebug.js', import.meta.url);

function validProfile(houseSystem = 'placidus') {
  return {
    id: `profile-${houseSystem}`,
    name: 'Егор',
    birthDate: '1981-04-16',
    birthTime: '04:45',
    birthTimeAccuracy: 'exact',
    birthPlace: {
      city: 'Москва',
      country: 'Россия',
      coordinates: {
        latitude: 55.7558,
        longitude: 37.6173,
      },
      timezone: 'Europe/Moscow',
    },
    currentPlace: {
      mode: 'moscow',
      city: 'Москва',
      country: 'Россия',
      timezone: 'Europe/Moscow',
    },
    houseSystem,
    zodiac: 'tropical',
  };
}

function assertNoSensitiveDebugData(value) {
  const json = JSON.stringify(value);

  [
    'birthDate',
    'birthTime',
    'utcDateTime',
    'Europe/Moscow',
    'birthPlace',
    'currentPlace',
    'latitude',
    'longitude',
    'coordinates',
    '55.7558',
    '37.6173',
    'planetLongitude',
    '"houses":[',
    '"cusps":[',
    '"assignments":[',
    'swisseph',
    'сильный дом',
    'слабый дом',
    'фатально',
    'кармически',
    'NaN',
    'undefined',
  ].forEach((fragment) => {
    assert.equal(json.includes(fragment), false, fragment);
  });
}

test('getHousesDebugState returns safe ready state for a Placidus profile', () => {
  const state = getHousesDebugState(validProfile('placidus'), { collapsedState: false });

  assert.equal(state.section, 'Houses / ASC / MC UI Debug');
  assert.equal(state.enabled, true);
  assert.equal(state.panelStatus, 'ready');
  assert.equal(state.location, 'My Cards');
  assert.equal(state.userFacingBlock, true);
  assert.equal(state.collapsedDefault, true);
  assert.equal(state.collapsedState, false);
  assert.deepEqual(state.activeProfile, {
    hasProfile: true,
    id: 'profile-placidus',
    name: 'Егор',
  });
  assert.equal(state.readiness.hasExactBirthTime, true);
  assert.equal(state.readiness.hasBirthCoordinates, true);
  assert.equal(state.readiness.hasBirthTimezone, true);
  assert.equal(state.readiness.housesReady, true);
  assert.equal(state.readiness.anglesReady, true);
  assert.equal(state.readiness.planetAssignmentsReady, true);
  assert.deepEqual(state.selectedSystem, {
    houseSystem: 'placidus',
    label: 'Placidus',
    selectionSource: 'profile',
    defaulted: false,
  });
  assert.equal(state.counts.angles, 4);
  assert.equal(state.counts.houses, 12);
  assert.equal(state.counts.planetAssignments, 10);
  assert.equal(state.capabilities.asc, true);
  assert.equal(state.capabilities.mc, true);
  assert.equal(state.capabilities.dsc, true);
  assert.equal(state.capabilities.ic, true);
  assert.equal(state.capabilities.wholeSign, true);
  assert.equal(state.capabilities.equalHouse, true);
  assert.equal(state.capabilities.placidus, true);
  assert.equal(state.capabilities.planetInHouse, true);
  assert.equal(state.capabilities.interpretations, false);
  assert.equal(state.capabilities.fixedStars, false);
  assert.equal(state.capabilities.transits, false);
  assert.equal(state.capabilities.ritualScoring, false);
  assert.equal(state.privacy.rawBirthDataExposed, false);
  assert.equal(state.privacy.rawCoordinatesExposed, false);
  assert.equal(state.privacy.rawTimezoneExposed, false);
  assert.equal(state.privacy.rawPlanetLongitudesExposed, false);
  assert.equal(state.privacy.rawCuspLongitudesExposed, false);
  assert.equal(state.privacy.fullProfileJsonExposed, false);
  assert.equal(state.privacy.providerPayloadExposed, false);
  assertNoSensitiveDebugData(state);
});

test('getHousesDebugState returns safe fallback for missing and common-day profiles', () => {
  const noProfile = getHousesDebugState(null);
  const commonDay = getHousesDebugState({ type: 'commonDay', houseSystem: 'placidus' });

  [noProfile, commonDay].forEach((state) => {
    assert.equal(state.section, 'Houses / ASC / MC UI Debug');
    assert.equal(state.enabled, true);
    assert.equal(state.panelStatus, 'notReady');
    assert.equal(state.activeProfile.hasProfile, false);
    assert.equal(state.activeProfile.id, null);
    assert.equal(state.activeProfile.name, null);
    assert.equal(state.readiness.hasExactBirthTime, false);
    assert.equal(state.readiness.hasBirthCoordinates, false);
    assert.equal(state.readiness.hasBirthTimezone, false);
    assert.equal(state.readiness.housesReady, false);
    assert.equal(state.readiness.anglesReady, false);
    assert.equal(state.readiness.planetAssignmentsReady, false);
    assert.equal(state.counts.angles, 0);
    assert.equal(state.counts.houses, 0);
    assert.equal(state.counts.planetAssignments, 0);
    assertNoSensitiveDebugData(state);
  });
});

test('getHousesDebugState represents missing and unknown house systems safely', () => {
  const defaulted = getHousesDebugState({
    ...validProfile('wholeSign'),
    houseSystem: undefined,
  });
  const unknown = getHousesDebugState({
    ...validProfile('wholeSign'),
    houseSystem: 'custom-system',
  });

  assert.equal(defaulted.selectedSystem.houseSystem, 'whole-sign');
  assert.equal(defaulted.selectedSystem.label, 'Whole Sign');
  assert.equal(defaulted.selectedSystem.selectionSource, 'default');
  assert.equal(defaulted.selectedSystem.defaulted, true);
  assert.equal(defaulted.panelStatus, 'ready');

  assert.equal(unknown.panelStatus, 'unsupported');
  assert.equal(unknown.reason, 'unknownHouseSystem');
  assert.equal(unknown.selectedSystem.houseSystem, null);
  assert.equal(unknown.selectedSystem.label, 'Неизвестная система домов');
  assert.equal(unknown.selectedSystem.selectionSource, 'profile');
  assert.equal(unknown.selectedSystem.defaulted, false);
  assert.equal(unknown.counts.houses, 0);
  assertNoSensitiveDebugData(defaulted);
  assertNoSensitiveDebugData(unknown);
});

test('getHousesDebugState supports selected Whole Sign and Equal House systems', () => {
  const wholeSign = getHousesDebugState(validProfile('wholeSign'));
  const equalHouse = getHousesDebugState(validProfile('equal'));

  assert.equal(wholeSign.selectedSystem.houseSystem, 'whole-sign');
  assert.equal(wholeSign.selectedSystem.label, 'Whole Sign');
  assert.equal(wholeSign.panelStatus, 'ready');
  assert.equal(wholeSign.counts.houses, 12);

  assert.equal(equalHouse.selectedSystem.houseSystem, 'equal-house');
  assert.equal(equalHouse.selectedSystem.label, 'Равнодомная');
  assert.equal(equalHouse.panelStatus, 'ready');
  assert.equal(equalHouse.counts.houses, 12);
  assertNoSensitiveDebugData(wholeSign);
  assertNoSensitiveDebugData(equalHouse);
});

test('houses debug helper stays pure and does not import providers or calculation engines directly', async () => {
  const profile = validProfile('placidus');
  const before = JSON.stringify(profile);
  getHousesDebugState(profile);
  const source = await readFile(MODULE_PATH, 'utf8');

  assert.equal(JSON.stringify(profile), before);
  [
    'planetaryPositionProvider',
    'natalProvider',
    'astronomy-engine',
    'swisseph',
    'document.',
    'window.',
    'localStorage',
    'calculateAscMc',
    'calculateWholeSign',
    'calculateEqual',
    'calculatePlacidus',
  ].forEach((fragment) => {
    assert.equal(source.includes(fragment), false, fragment);
  });
});
