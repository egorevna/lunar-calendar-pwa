import assert from 'node:assert/strict';
import test from 'node:test';

import { createNatalPlanetsDebugSummary } from '../src/natalPlanetsDebug.js';

const readyProfile = {
  id: 'profile-ready',
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
};

test('natal planets debug summary exposes only safe ready status and counts', () => {
  const summary = createNatalPlanetsDebugSummary(readyProfile);
  const text = JSON.stringify(summary);

  assert.equal(summary.hasActiveProfile, true);
  assert.equal(summary.activeProfileId, 'profile-ready');
  assert.equal(summary.activeProfileName, 'Егор');
  assert.equal(summary.panelStatus, 'ready');
  assert.equal(summary.userFacingNatalPlanets, 'enabled');
  assert.equal(summary.canConvertToUtc, true);
  assert.equal(summary.provider, 'astronomy-engine');
  assert.equal(summary.providerValidated, true);
  assert.equal(summary.planetCount, 10);
  assert.equal(summary.formattedPlanetCount, 10);
  assert.equal(summary.collapsibleDefault, 'collapsed');
  assert.equal(summary.profilePanelLocation, 'My Cards');
  assert.deepEqual(summary.stillNotSupported, {
    houses: 'notSupported',
    ascMc: 'notSupported',
    transits: 'notSupported',
    aspects: 'notSupported',
    orbs: 'notSupported',
  });
  assert.equal(text.includes('1990-05-12'), false);
  assert.equal(text.includes('14:30'), false);
  assert.equal(text.includes('Europe/Moscow'), false);
  assert.equal(text.includes('utcDateTime'), false);
  assert.equal(text.includes('latitude'), false);
  assert.equal(text.includes('longitude'), false);
  assert.equal(text.includes('speed'), false);
  assert.equal(text.includes('formattedPlanets'), false);
  assert.equal(text.includes('Солнце —'), false);
});

test('natal planets debug summary is hidden for general day', () => {
  const summary = createNatalPlanetsDebugSummary(null);

  assert.equal(summary.hasActiveProfile, false);
  assert.equal(summary.activeProfileId, null);
  assert.equal(summary.activeProfileName, 'Общий день');
  assert.equal(summary.panelStatus, 'hidden');
  assert.equal(summary.userFacingNatalPlanets, 'disabled');
  assert.equal(summary.reason, 'Общий день не является персональным профилем.');
  assert.equal(summary.canConvertToUtc, false);
  assert.equal(summary.planetCount, 0);
  assert.equal(summary.formattedPlanetCount, 0);
});

test('natal planets debug summary maps incomplete profile fields to human labels only', () => {
  const summary = createNatalPlanetsDebugSummary({
    ...readyProfile,
    birthTime: '',
    birthTimeAccuracy: 'unknown',
    birthPlace: {
      ...readyProfile.birthPlace,
      timezone: '',
    },
  });
  const text = JSON.stringify(summary);

  assert.equal(summary.panelStatus, 'incomplete');
  assert.equal(summary.userFacingNatalPlanets, 'disabled');
  assert.equal(summary.canConvertToUtc, false);
  assert.deepEqual(summary.missingFields, [
    'часовой пояс рождения',
    'координаты места рождения',
    'время рождения',
  ]);
  assert.equal(summary.warnings.some((warning) => warning.includes('Время рождения неизвестно')), true);
  assert.equal(text.includes('birthTime'), false);
  assert.equal(text.includes('birthPlace.timezone'), false);
  assert.equal(text.includes('Europe/Moscow'), false);
  assert.equal(text.includes('utcDateTime'), false);
});
