import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import { getDetailedDignitiesDebugState } from '../src/detailedDignitiesDebug.js';

function readyProfile(overrides = {}) {
  return {
    id: 'profile-egor',
    name: 'Егор',
    birthDate: '1990-05-12',
    birthTime: '14:30',
    birthTimeAccuracy: 'exact',
    birthPlace: {
      city: 'Москва',
      country: 'Россия',
      latitude: null,
      longitude: null,
      timezone: 'Europe/Moscow',
    },
    currentPlace: {
      mode: 'moscow',
      city: 'Москва',
      country: 'Россия',
      timezone: 'Europe/Moscow',
    },
    houseSystem: 'wholeSign',
    zodiac: 'tropical',
    ...overrides,
  };
}

test('getDetailedDignitiesDebugState returns safe ready state with counts', () => {
  const state = getDetailedDignitiesDebugState(readyProfile());

  assert.equal(state.section, 'Detailed Dignities UI Debug');
  assert.equal(state.enabled, true);
  assert.equal(state.activeProfile.hasProfile, true);
  assert.equal(state.activeProfile.id, 'profile-egor');
  assert.equal(state.activeProfile.name, 'Егор');
  assert.equal(state.panelStatus, 'ready');
  assert.equal(state.natalPlanetsReady, true);
  assert.equal(state.userFacingBlock, true);
  assert.equal(state.location, 'My Cards');
  assert.equal(state.collapsedDefault, true);
  assert.equal(state.collapsedState, true);
  assert.deepEqual(state.counts, {
    planetGroups: 10,
    totalItems: 40,
    terms: 10,
    decans: 10,
    degreeRulersTable6: 10,
    degreeRulersTable7: 10,
  });
});

test('getDetailedDignitiesDebugState reports safe fallback without profile', () => {
  const state = getDetailedDignitiesDebugState(null);

  assert.equal(state.enabled, false);
  assert.equal(state.activeProfile.hasProfile, false);
  assert.equal(state.activeProfile.id, null);
  assert.equal(state.activeProfile.name, 'Общий день');
  assert.equal(state.panelStatus, 'hidden');
  assert.equal(state.natalPlanetsReady, false);
  assert.equal(state.userFacingBlock, false);
  assert.deepEqual(state.counts, {
    planetGroups: 0,
    totalItems: 0,
    terms: 0,
    decans: 0,
    degreeRulersTable6: 0,
    degreeRulersTable7: 0,
  });
});

test('getDetailedDignitiesDebugState exposes source labels and capabilities only', () => {
  const state = getDetailedDignitiesDebugState(readyProfile(), { collapsedState: false });

  assert.equal(state.collapsedState, false);
  assert.equal(state.sources.terms, 'Вронский, термы');
  assert.equal(state.sources.decans, 'Звезда Магов');
  assert.equal(state.sources.degreeRulersTable6, 'Звезда Магов');
  assert.equal(state.sources.degreeRulersTable7, 'Вронский');
  assert.equal(state.capabilities.terms, true);
  assert.equal(state.capabilities.decans, true);
  assert.equal(state.capabilities.degreeRulersTable6, true);
  assert.equal(state.capabilities.degreeRulersTable7, true);
  assert.equal(state.capabilities.table6Table7Separated, true);
  assert.equal(state.capabilities.interpretations, false);
  assert.equal(state.capabilities.fixedStars, false);
  assert.equal(state.capabilities.houses, false);
  assert.equal(state.capabilities.ascMc, false);
  assert.equal(state.capabilities.transits, false);
});

test('getDetailedDignitiesDebugState keeps privacy flags false', () => {
  const state = getDetailedDignitiesDebugState(readyProfile());

  assert.equal(state.privacy.rawBirthDataExposed, false);
  assert.equal(state.privacy.rawCoordinatesExposed, false);
  assert.equal(state.privacy.rawLongitudesExposed, false);
  assert.equal(state.privacy.rawSourceTokensExposed, false);
  assert.equal(state.privacy.rawSourceKeysExposed, false);
  assert.equal(state.privacy.fullTablesExposed, false);
});

test('detailed dignities debug output contains no raw private or table data', () => {
  const text = JSON.stringify(getDetailedDignitiesDebugState(readyProfile()));

  for (const forbidden of [
    '1990-05-12',
    '14:30',
    'birthDate',
    'birthTime',
    'utcDateTime',
    'Europe/Moscow',
    'birthPlace',
    'currentPlace',
    'latitude',
    'longitude',
    'coordinates',
    'profileJson',
    'sourceTokens',
    'sourceKey',
    'sourceSystem',
    'vronsky-degree-rulers',
    'degree-rulers-vronsky-table-7',
    'Марс, Плутон R',
    'Table 5',
    'Table 6',
    'Table 7',
    'плохой',
    'опасный',
    'фатально',
    'кармически',
  ]) {
    assert.equal(text.includes(forbidden), false, `${forbidden} should not be exposed`);
  }
});

test('detailed dignities debug helper does not import providers or astronomy-engine', () => {
  const source = readFileSync(new URL('../src/detailedDignitiesDebug.js', import.meta.url), 'utf8');

  for (const forbidden of [
    'planetaryPositionProvider',
    'astronomyEngineProvider',
    'astronomy-engine',
  ]) {
    assert.equal(source.includes(forbidden), false, `${forbidden} should not be imported or called`);
  }
});
