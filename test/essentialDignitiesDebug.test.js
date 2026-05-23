import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import { createEssentialDignitiesDebugSummary } from '../src/essentialDignitiesDebug.js';

const readyProfile = {
  id: 'profile-ready',
  name: 'Анна',
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

test('essential dignities debug summary exposes only safe ready status and counts', () => {
  const summary = createEssentialDignitiesDebugSummary(readyProfile);
  const text = JSON.stringify(summary);

  assert.equal(summary.hasActiveProfile, true);
  assert.equal(summary.activeProfileId, 'profile-ready');
  assert.equal(summary.activeProfileName, 'Анна');
  assert.equal(summary.panelStatus, 'ready');
  assert.equal(summary.userFacingEssentialDignities, 'enabled');
  assert.equal(summary.reason, 'Достоинства планет доступны в панели «Мои карты».');
  assert.equal(summary.natalPlanetsReady, true);
  assert.equal(summary.dignityEngine, 'enabled');
  assert.equal(summary.sourcePolicy, 'classical-traditional-seven-planets');
  assert.equal(summary.modernOuterPlanets, 'label-only');
  assert.equal(summary.scoringModel, 'enabled');
  assert.equal(summary.scoreTotal, 4);
  assert.equal(summary.dignityCount, 2);
  assert.equal(summary.debilityCount, 1);
  assert.equal(summary.neutralCount, 6);
  assert.equal(summary.modernLabelCount, 1);
  assert.equal(summary.formattedDignityCount, 4);
  assert.equal(summary.collapsibleDefault, 'collapsed');
  assert.equal(summary.profilePanelLocation, 'My Cards');
  assert.deepEqual(summary.deferredFeatures, {
    terms: 'deferred',
    decans: 'deferred',
    degreeRulers: 'deferred',
    exactExaltationDegrees: 'deferred',
    VronskyTables: 'deferred',
  });
  assert.deepEqual(summary.stillNotSupported, {
    houses: 'notSupported',
    ascMc: 'notSupported',
    transits: 'notSupported',
    interpretations: 'notSupported',
  });
  assert.deepEqual(summary.missingFields, []);
  assert.deepEqual(summary.warnings, []);
  assert.equal(text.includes('1990-05-12'), false);
  assert.equal(text.includes('14:30'), false);
  assert.equal(text.includes('Europe/Moscow'), false);
  assert.equal(text.includes('utcDateTime'), false);
  assert.equal(text.includes('birthPlace'), false);
  assert.equal(text.includes('currentPlace'), false);
  assert.equal(text.includes('latitude'), false);
  assert.equal(text.includes('longitude'), false);
  assert.equal(text.includes('coordinates'), false);
  assert.equal(text.includes('speed'), false);
  assert.equal(text.includes('formattedDignities'), false);
  assert.equal(text.includes('results'), false);
  assert.equal(text.includes('Марс в Овне'), false);
});

test('essential dignities debug summary is hidden for general day', () => {
  const summary = createEssentialDignitiesDebugSummary(null);

  assert.equal(summary.hasActiveProfile, false);
  assert.equal(summary.activeProfileId, null);
  assert.equal(summary.activeProfileName, 'Общий день');
  assert.equal(summary.panelStatus, 'hidden');
  assert.equal(summary.userFacingEssentialDignities, 'disabled');
  assert.equal(summary.reason, 'Общий день не является персональным профилем.');
  assert.equal(summary.natalPlanetsReady, false);
  assert.equal(summary.scoreTotal, 0);
  assert.equal(summary.formattedDignityCount, 0);
});

test('essential dignities debug summary maps incomplete profile state safely', () => {
  const summary = createEssentialDignitiesDebugSummary({
    ...readyProfile,
    birthTime: '',
    birthTimeAccuracy: 'unknown',
  });
  const text = JSON.stringify(summary);

  assert.equal(summary.hasActiveProfile, true);
  assert.equal(summary.panelStatus, 'incomplete');
  assert.equal(summary.userFacingEssentialDignities, 'disabled');
  assert.equal(summary.natalPlanetsReady, false);
  assert.equal(summary.missingFields.includes('время рождения'), true);
  assert.equal(summary.warnings.some((warning) => warning.includes('Сначала нужен расчет натальных планет.')), true);
  assert.equal(text.includes('birthTime'), false);
  assert.equal(text.includes('birthDate'), false);
  assert.equal(text.includes('birthPlace'), false);
  assert.equal(text.includes('timezone'), false);
  assert.equal(text.includes('longitude'), false);
});

test('essential dignities debug helper does not expose raw dignity data or call calculators directly', () => {
  const source = readFileSync(new URL('../src/essentialDignitiesDebug.js', import.meta.url), 'utf8');

  assert.equal(source.includes('getEssentialDignitiesForProfile'), true);
  assert.equal(source.includes('profileStorage'), true);
  assert.equal(source.includes('document.'), false);
  assert.equal(source.includes('querySelector'), false);
  assert.equal(source.includes('evaluateEssentialDignity'), false);
  assert.equal(source.includes('evaluateEssentialDignities'), false);
  assert.equal(source.includes('astronomy-engine'), false);
  assert.equal(source.includes('luxon'), false);
});
