import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import { createNatalAspectsDebugSummary } from '../src/natalAspectsDebug.js';

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

test('natal aspects debug summary exposes only safe ready status and counts', () => {
  const summary = createNatalAspectsDebugSummary(readyProfile);
  const text = JSON.stringify(summary);

  assert.equal(summary.hasActiveProfile, true);
  assert.equal(summary.activeProfileId, 'profile-ready');
  assert.equal(summary.activeProfileName, 'Анна');
  assert.equal(summary.panelStatus, 'ready');
  assert.equal(summary.userFacingNatalAspects, 'enabled');
  assert.equal(summary.reason, 'Натальные аспекты доступны в панели «Мои карты».');
  assert.equal(summary.natalPlanetsReady, true);
  assert.equal(summary.aspectEngine, 'enabled');
  assert.equal(summary.aspectSet, 'major only');
  assert.equal(summary.orbPolicy, 'configured');
  assert.equal(summary.aspectCount > 0, true);
  assert.equal(summary.formattedAspectCount, summary.aspectCount);
  assert.equal(summary.tenseCount >= 0, true);
  assert.equal(summary.harmoniousCount >= 0, true);
  assert.equal(summary.conjunctionCount >= 0, true);
  assert.equal(summary.collapsibleDefault, 'collapsed');
  assert.equal(summary.profilePanelLocation, 'My Cards');
  assert.equal(summary.stillNotSupported.transits, 'notSupported');
  assert.equal(summary.stillNotSupported.houses, 'notSupported');
  assert.equal(summary.stillNotSupported.ascMc, 'notSupported');
  assert.equal(summary.stillNotSupported.fixedStars, 'notSupported');
  assert.equal(summary.stillNotSupported.interpretations, 'notSupported');
  assert.deepEqual(summary.missingFields, []);
  assert.deepEqual(summary.warnings, []);
  assert.equal(text.includes('1990-05-12'), false);
  assert.equal(text.includes('14:30'), false);
  assert.equal(text.includes('Europe/Moscow'), false);
  assert.equal(text.includes('utcDateTime'), false);
  assert.equal(text.includes('latitude'), false);
  assert.equal(text.includes('longitude'), false);
  assert.equal(text.includes('allowedOrb'), false);
  assert.equal(text.includes('angle'), false);
  assert.equal(text.includes('formattedAspects'), false);
  assert.equal(text.includes('aspects:['), false);
});

test('natal aspects debug summary is hidden for general day', () => {
  const summary = createNatalAspectsDebugSummary(null);

  assert.equal(summary.hasActiveProfile, false);
  assert.equal(summary.activeProfileId, null);
  assert.equal(summary.activeProfileName, 'Общий день');
  assert.equal(summary.panelStatus, 'hidden');
  assert.equal(summary.userFacingNatalAspects, 'disabled');
  assert.equal(summary.reason, 'Общий день не является персональным профилем.');
  assert.equal(summary.natalPlanetsReady, false);
  assert.equal(summary.aspectCount, 0);
  assert.equal(summary.formattedAspectCount, 0);
});

test('natal aspects debug summary maps incomplete profile state safely', () => {
  const summary = createNatalAspectsDebugSummary({
    ...readyProfile,
    birthTime: '',
    birthTimeAccuracy: 'unknown',
  });
  const text = JSON.stringify(summary);

  assert.equal(summary.hasActiveProfile, true);
  assert.equal(summary.panelStatus, 'incomplete');
  assert.equal(summary.userFacingNatalAspects, 'disabled');
  assert.equal(summary.natalPlanetsReady, false);
  assert.equal(summary.missingFields.includes('время рождения'), true);
  assert.equal(summary.warnings.some((warning) => warning.includes('Сначала нужен расчет натальных планет.')), true);
  assert.equal(text.includes('birthTime'), false);
  assert.equal(text.includes('birthDate'), false);
  assert.equal(text.includes('birthPlace'), false);
  assert.equal(text.includes('timezone'), false);
});

test('natal aspects debug helper does not expose raw aspects or call calculators directly', () => {
  const source = readFileSync(new URL('../src/natalAspectsDebug.js', import.meta.url), 'utf8');

  assert.equal(source.includes('getNatalAspectsForProfile'), true);
  assert.equal(source.includes('profileStorage'), true);
  assert.equal(source.includes('document.'), false);
  assert.equal(source.includes('querySelector'), false);
  assert.equal(source.includes('calculateNatalAspects'), false);
  assert.equal(source.includes('astronomy-engine'), false);
  assert.equal(source.includes('luxon'), false);
});
