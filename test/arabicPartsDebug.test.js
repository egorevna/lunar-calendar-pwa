import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { getArabicPartsDebugState } from '../src/arabicPartsDebug.js';

const MODULE_PATH = new URL('../src/arabicPartsDebug.js', import.meta.url);

function validProfile() {
  return {
    id: 'profile-egor',
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
    houseSystem: 'placidus',
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
    'coordinates',
    '55.7558',
    '37.6173',
    'planetLongitude',
    'partLongitude',
    'cuspLongitude',
    '"parts":[',
    '"assignments":[',
    '"cusps":[',
    '"operands":[',
    'providerPayload: {',
    'swisseph',
    'сильный жребий',
    'слабый жребий',
    'фатально',
    'кармически',
    'NaN',
    'undefined',
  ].forEach((fragment) => {
    assert.equal(json.includes(fragment), false, fragment);
  });
}

test('getArabicPartsDebugState returns safe ready state for active profile', () => {
  const profile = validProfile();
  const state = getArabicPartsDebugState(profile, { collapsedState: false });

  assert.equal(state.section, 'Arabic Parts UI Debug');
  assert.equal(state.enabled, true);
  assert.equal(state.panelStatus, 'ready');
  assert.equal(state.location, 'My Cards');
  assert.equal(state.userFacingBlock, true);
  assert.equal(state.collapsedDefault, true);
  assert.equal(state.collapsedState, false);
  assert.deepEqual(state.activeProfile, {
    hasProfile: true,
    id: 'profile-egor',
    name: 'Егор',
  });
  assert.equal(state.readiness.hasExactBirthTime, true);
  assert.equal(state.readiness.hasBirthCoordinates, true);
  assert.equal(state.readiness.hasBirthTimezone, true);
  assert.equal(state.readiness.dayNightReady, true);
  assert.equal(state.readiness.arabicPartsReady, true);
  assert.equal(state.readiness.houseAssignmentsReady, true);
  assert.equal(['day', 'night'].includes(state.chartSect.value), true);
  assert.equal(['Дневная карта', 'Ночная карта'].includes(state.chartSect.label), true);
  assert.equal(state.chartSect.status, 'ready');
  assert.equal(state.chartSect.boundary, false);
  assert.deepEqual(state.formulas.active, ['pars-fortuna', 'lot-of-spirit']);
  assert.deepEqual(state.formulas.deferred, [
    'lot-of-eros',
    'lot-of-necessity',
    'lot-of-basis',
    'lot-of-exaltation',
  ]);
  assert.equal(state.formulas.activeCount, 2);
  assert.equal(state.formulas.deferredCount, 4);
  assert.equal(state.counts.parts, 2);
  assert.equal(state.counts.houseAssignments, 2);
  assert.equal(state.capabilities.arabicParts, true);
  assert.equal(state.capabilities.parsFortuna, true);
  assert.equal(state.capabilities.lotOfSpirit, true);
  assert.equal(state.capabilities.houseAssignment, true);
  assert.equal(state.capabilities.interpretations, false);
  assert.equal(state.capabilities.fixedStars, false);
  assert.equal(state.capabilities.transits, false);
  assert.equal(state.capabilities.ritualScoring, false);
  assert.equal(state.privacy.rawBirthDataExposed, false);
  assert.equal(state.privacy.rawCoordinatesExposed, false);
  assert.equal(state.privacy.rawTimezoneExposed, false);
  assert.equal(state.privacy.rawLongitudesExposed, false);
  assert.equal(state.privacy.formulaOperandsExposed, false);
  assert.equal(state.privacy.fullProfileJsonExposed, false);
  assert.equal(state.privacy.providerPayloadExposed, false);
  assertNoSensitiveDebugData(state);
});

test('getArabicPartsDebugState returns safe fallback for missing and common-day profiles', () => {
  const noProfile = getArabicPartsDebugState(null);
  const commonDay = getArabicPartsDebugState({ type: 'commonDay' });

  [noProfile, commonDay].forEach((state) => {
    assert.equal(state.section, 'Arabic Parts UI Debug');
    assert.equal(state.enabled, true);
    assert.equal(state.panelStatus, 'notReady');
    assert.equal(state.activeProfile.hasProfile, false);
    assert.equal(state.activeProfile.id, null);
    assert.equal(state.activeProfile.name, null);
    assert.equal(state.readiness.hasExactBirthTime, false);
    assert.equal(state.readiness.hasBirthCoordinates, false);
    assert.equal(state.readiness.hasBirthTimezone, false);
    assert.equal(state.readiness.dayNightReady, false);
    assert.equal(state.readiness.arabicPartsReady, false);
    assert.equal(state.readiness.houseAssignmentsReady, false);
    assert.deepEqual(state.chartSect, {
      status: 'notReady',
      value: null,
      label: 'Недоступно',
      boundary: false,
    });
    assert.deepEqual(state.formulas.active, ['pars-fortuna', 'lot-of-spirit']);
    assert.deepEqual(state.formulas.deferred, [
      'lot-of-eros',
      'lot-of-necessity',
      'lot-of-basis',
      'lot-of-exaltation',
    ]);
    assert.equal(state.counts.parts, 0);
    assert.equal(state.counts.houseAssignments, 0);
    assertNoSensitiveDebugData(state);
  });
});

test('getArabicPartsDebugState reports notReady safely for incomplete profiles', () => {
  const missingCoordinates = getArabicPartsDebugState({
    ...validProfile(),
    birthPlace: {
      city: 'Москва',
      country: 'Россия',
      timezone: 'Europe/Moscow',
    },
  });
  const unknownTime = getArabicPartsDebugState({
    ...validProfile(),
    birthTime: '',
    birthTimeAccuracy: 'unknown',
  });

  assert.equal(missingCoordinates.panelStatus, 'notReady');
  assert.equal(missingCoordinates.readiness.hasExactBirthTime, true);
  assert.equal(missingCoordinates.readiness.hasBirthCoordinates, false);
  assert.equal(missingCoordinates.readiness.hasBirthTimezone, true);
  assert.equal(missingCoordinates.counts.parts, 0);

  assert.equal(unknownTime.panelStatus, 'notReady');
  assert.equal(unknownTime.readiness.hasExactBirthTime, false);
  assert.equal(unknownTime.readiness.hasBirthCoordinates, true);
  assert.equal(unknownTime.readiness.hasBirthTimezone, true);
  assert.equal(unknownTime.counts.houseAssignments, 0);
  assertNoSensitiveDebugData(missingCoordinates);
  assertNoSensitiveDebugData(unknownTime);
});

test('arabic parts debug helper stays pure and scoped to safe profile helpers', async () => {
  const profile = validProfile();
  const before = JSON.stringify(profile);
  getArabicPartsDebugState(profile);
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
