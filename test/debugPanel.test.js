import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import {
  describeDebugPanel,
  isDebugMode,
} from '../src/debugPanel.js';

test('detects debug mode only from debug=1 query parameter', () => {
  assert.equal(isDebugMode('?debug=1'), true);
  assert.equal(isDebugMode('?debug=1&debugDate=2026-05-15T00:40:00'), true);
  assert.equal(isDebugMode('?debug=0'), false);
  assert.equal(isDebugMode('?debugDate=2026-05-15T00:40:00'), false);
  assert.equal(isDebugMode(''), false);
});

test('debug panel marks debugDate as active and includes key sections', () => {
  const text = describeDebugPanel({
    now: new Date('2026-05-15T00:40:00+03:00'),
    debugDate: new Date('2026-05-15T00:40:00+03:00'),
    lunarDay: 27,
    solarMonthBranch: 'si',
    moonSign: {
      source: 'swisseph',
      current: { name: 'Овен' },
      next: { name: 'Телец' },
      entersAt: new Date('2026-05-15T05:31:04+03:00'),
    },
    voc: {
      source: 'swisseph',
      status: 'active',
      isActive: true,
      start: new Date('2026-05-15T00:32:41+03:00'),
      end: new Date('2026-05-15T05:31:04+03:00'),
      aspect: 0,
      planet: 'mars',
    },
    moonAspects: {
      source: 'swisseph',
      previous: {
        at: new Date('2026-05-15T00:32:41+03:00'),
        aspect: 0,
        planet: 'mars',
      },
      next: {
        at: new Date('2026-05-15T21:10:00+03:00'),
        aspect: 0,
        planet: 'saturn',
      },
    },
    indicators: {
      dayOfficer: { name: 'Устранение', glyph: '除' },
      lunarSymbol: { name: 'Жаба' },
      sexagenaryDay: {
        name: 'Огненная Свинья',
        stemBranch: '丁亥',
        branch: 'hai',
      },
    },
    ephemeris: {
      source: 'Swiss Ephemeris',
      rangeStart: '2026-01-01T00:00:00.000Z',
      rangeEnd: '2031-01-01T00:00:00.000Z',
    },
    bestWindowsDebug: {
      selectedMode: 'tarot',
      threshold: 30,
      slotMinutes: 60,
      maxWindows: 2,
      fallback: '',
      windows: [
        {
          start: new Date('2026-05-15T19:40:00+03:00'),
          end: new Date('2026-05-15T21:10:00+03:00'),
          score: 55,
          reasons: ['поддерживающий планетарный час'],
          cautions: [],
          suitableFor: ['расклады'],
        },
      ],
      rejectedCandidates: [],
    },
    profileDebug: {
      profilesCount: 2,
      activeProfileId: 'profile-egor',
      activeProfileName: 'Егор',
      storage: 'localStorage',
      sync: 'disabled',
      serverUpload: 'disabled',
      importExport: 'enabled',
    },
    personalDebug: {
      profilesCount: 2,
      activeProfileId: 'profile-egor',
      activeProfileName: 'Егор',
      hasActiveProfile: true,
      personalStatus: 'calculationLimited',
      profilesStorage: 'localStorage',
      sync: 'disabled',
      serverUpload: 'disabled',
      geocoding: 'disabled',
      natalEngine: 'not connected',
      capabilities: {
        canCalculateNatalPlanets: false,
        canCalculateHouses: false,
        canCalculateAscMc: false,
        canCalculatePersonalTransits: false,
      },
      missingFields: ['координаты места рождения'],
      warnings: ['Время рождения неизвестно — дома и ASC/MC недоступны.'],
    },
  });

  assert.equal(text.includes('Time'), true);
  assert.equal(text.includes('debugDate: active'), true);
  assert.equal(text.includes('VOC'), true);
  assert.equal(text.includes('status: active'), true);
  assert.equal(text.includes('Moon aspects'), true);
  assert.equal(text.includes('major-only: yes'), true);
  assert.equal(text.includes('Indicators'), true);
  assert.equal(text.includes('Tong Shu: Устранение 除'), true);
  assert.equal(text.includes('Best Windows Debug'), true);
  assert.equal(text.includes('selectedMode: tarot'), true);
  assert.equal(text.includes('windows.length: 1'), true);
  assert.equal(text.includes('score: 55'), true);
  assert.equal(text.includes('Profiles'), true);
  assert.equal(text.includes('profilesCount: 2'), true);
  assert.equal(text.includes('activeProfileId: profile-egor'), true);
  assert.equal(text.includes('activeProfileName: Егор'), true);
  assert.equal(text.includes('storage: localStorage'), true);
  assert.equal(text.includes('sync: disabled'), true);
  assert.equal(text.includes('serverUpload: disabled'), true);
  assert.equal(text.includes('importExport: enabled'), true);
  assert.equal(text.includes('Personal Debug'), true);
  assert.equal(text.includes('hasActiveProfile: yes'), true);
  assert.equal(text.includes('personalStatus: calculationLimited'), true);
  assert.equal(text.includes('profilesStorage: localStorage'), true);
  assert.equal(text.includes('geocoding: disabled'), true);
  assert.equal(text.includes('natalEngine: not connected'), true);
  assert.equal(text.includes('canCalculateNatalPlanets: no'), true);
  assert.equal(text.includes('canCalculateHouses: no'), true);
  assert.equal(text.includes('canCalculateAscMc: no'), true);
  assert.equal(text.includes('canCalculatePersonalTransits: no'), true);
  assert.equal(text.includes('missingFields: координаты места рождения'), true);
  assert.equal(text.includes('warnings: Время рождения неизвестно'), true);
  assert.equal(text.includes('Natal Engine Debug'), true);
  assert.equal(text.includes('engineStatus: notSupported'), true);
  assert.equal(text.includes('provider: none'), true);
  assert.equal(text.includes('providerStatus: notSupported'), true);
  assert.equal(text.includes('natalPlanets: not supported'), true);
  assert.equal(text.includes('houses: not supported'), true);
  assert.equal(text.includes('ascMc: not supported'), true);
  assert.equal(text.includes('aspects: not supported'), true);
  assert.equal(text.includes('transits: not supported'), true);
  assert.equal(text.includes('reason: Planetary position provider is not connected.'), true);
  assert.equal(text.includes('planets: no'), true);
  assert.equal(text.includes('Natal Provider Validation'), true);
  assert.equal(text.includes('provider: astronomy-engine'), true);
  assert.equal(text.includes('version: 2.1.19'), true);
  assert.equal(text.includes('providerStatus: provider-layer only'), true);
  assert.equal(text.includes('userFacingNatalValues: disabled'), true);
  assert.equal(text.includes('longitudeValidation: passed'), true);
  assert.equal(text.includes('speedValidation: passed'), true);
  assert.equal(text.includes('retrogradeValidation: passed'), true);
  assert.equal(text.includes('referenceSource: local swisseph dev dependency'), true);
  assert.equal(text.includes('fixturesCount: 6'), true);
  assert.equal(text.includes('validatedBodies: sun, moon, mercury, venus, mars, jupiter, saturn, uranus, neptune, pluto'), true);
  assert.equal(text.includes('maxLongitudeDeltaPlanets: 0.003180°'), true);
  assert.equal(text.includes('maxLongitudeDeltaMoon: 0.000294°'), true);
  assert.equal(text.includes('maxSpeedDeltaPlanets: 0.000288°/day'), true);
  assert.equal(text.includes('maxSpeedDeltaMoon: 0.000148°/day'), true);
  assert.equal(text.includes('stillNotSupported: houses, ASC / MC, personal transits, natal aspects, orbs, natal chart UI, personal ritual scoring'), true);
  assert.equal(text.includes('hasActiveProfile: yes'), true);
  assert.equal(text.includes('activeProfileName: Егор'), true);
  assert.equal(text.includes('birthDate'), false);
  assert.equal(text.includes('birthTime'), false);
  assert.equal(text.includes('birthPlace'), false);
  assert.equal(text.includes('latitude'), false);
  assert.equal(text.includes('coordinates'), false);
  assert.equal(text.includes('profiles: ['), false);
  assert.equal(text.includes('actualPlanetLongitudes'), false);
  assert.equal(text.includes('sunLongitude'), false);
  assert.equal(text.includes('Луна в 7 доме'), false);
  assert.equal(text.includes('Марс □ ASC'), false);
  assert.equal(text.includes('Плутон ☌ Венера'), false);
  assert.equal(text.includes('орб'), false);
});

test('debug panel marks normal time when debugDate is not used', () => {
  const text = describeDebugPanel({
    now: new Date('2026-05-15T00:40:00+03:00'),
    debugDate: null,
    lunarDay: 27,
  });

  assert.equal(text.includes('debugDate: inactive'), true);
  assert.equal(text.includes('Best Windows Debug'), false);
  assert.equal(text.includes('Personal Debug'), false);
  assert.equal(text.includes('Natal Engine Debug'), true);
  assert.equal(text.includes('Natal Provider Validation'), true);
  assert.equal(text.includes('activeProfile: Общий день'), true);
  assert.equal(text.includes('natal calculation: inactive'), true);
});

test('debug panel shows safe natal planets UI status for ready profile', () => {
  const text = describeDebugPanel({
    now: new Date('2026-05-15T00:40:00+03:00'),
    natalPlanetsUiDebug: {
      activeProfileId: 'profile-egor',
      activeProfileName: 'Егор',
      hasActiveProfile: true,
      panelStatus: 'ready',
      userFacingNatalPlanets: 'enabled',
      reason: 'Натальные планеты доступны в панели «Мои карты».',
      canConvertToUtc: true,
      provider: 'astronomy-engine',
      providerValidated: true,
      planetCount: 10,
      formattedPlanetCount: 10,
      collapsibleDefault: 'collapsed',
      profilePanelLocation: 'My Cards',
      missingFields: [],
      warnings: [],
    },
  });
  const natalSection = text
    .split('\n\n')
    .find((section) => section.startsWith('## Natal Planets UI Debug'));

  assert.equal(text.includes('Natal Planets UI Debug'), true);
  assert.equal(text.includes('activeProfileId: profile-egor'), true);
  assert.equal(text.includes('activeProfileName: Егор'), true);
  assert.equal(text.includes('hasActiveProfile: yes'), true);
  assert.equal(text.includes('panelStatus: ready'), true);
  assert.equal(text.includes('userFacingNatalPlanets: enabled'), true);
  assert.equal(text.includes('canConvertToUtc: yes'), true);
  assert.equal(text.includes('provider: astronomy-engine'), true);
  assert.equal(text.includes('providerValidated: yes'), true);
  assert.equal(text.includes('planetCount: 10'), true);
  assert.equal(text.includes('formattedPlanetCount: 10'), true);
  assert.equal(text.includes('collapsibleDefault: collapsed'), true);
  assert.equal(text.includes('profilePanelLocation: My Cards'), true);
  assert.equal(text.includes('houses: notSupported'), true);
  assert.equal(text.includes('ascMc: notSupported'), true);
  assert.equal(text.includes('transits: notSupported'), true);
  assert.equal(text.includes('aspects: notSupported'), true);
  assert.equal(text.includes('orbs: notSupported'), true);
  assert.equal(natalSection.includes('utcDateTime'), false);
  assert.equal(natalSection.includes('Europe/Moscow'), false);
  assert.equal(natalSection.includes('latitude'), false);
  assert.equal(natalSection.includes('longitude'), false);
  assert.equal(natalSection.includes('coordinates'), false);
  assert.equal(natalSection.includes('speed:'), false);
  assert.equal(natalSection.includes('Солнце —'), false);
});

test('debug panel shows hidden natal planets UI status for general day', () => {
  const text = describeDebugPanel({
    now: new Date('2026-05-15T00:40:00+03:00'),
    natalPlanetsUiDebug: {
      activeProfileId: null,
      activeProfileName: 'Общий день',
      hasActiveProfile: false,
      panelStatus: 'hidden',
      userFacingNatalPlanets: 'disabled',
      reason: 'Общий день не является персональным профилем.',
      canConvertToUtc: false,
      provider: 'astronomy-engine',
      providerValidated: true,
      planetCount: 0,
      formattedPlanetCount: 0,
      collapsibleDefault: 'collapsed',
      profilePanelLocation: 'My Cards',
      missingFields: [],
      warnings: [],
    },
  });

  assert.equal(text.includes('Natal Planets UI Debug'), true);
  assert.equal(text.includes('activeProfileId: null'), true);
  assert.equal(text.includes('activeProfileName: Общий день'), true);
  assert.equal(text.includes('hasActiveProfile: no'), true);
  assert.equal(text.includes('panelStatus: hidden'), true);
  assert.equal(text.includes('userFacingNatalPlanets: disabled'), true);
  assert.equal(text.includes('reason: Общий день не является персональным профилем.'), true);
  assert.equal(text.includes('canConvertToUtc: no'), true);
});

test('debug panel shows no-window fallback state and rejected candidates', () => {
  const text = describeDebugPanel({
    now: new Date('2026-05-15T00:40:00+03:00'),
    bestWindowsDebug: {
      selectedMode: 'money',
      threshold: 30,
      slotMinutes: 60,
      maxWindows: 2,
      fallback: 'Сегодня лучше проверять, закрывать хвосты и готовить решения, а не запускать новое.',
      windows: [],
      rejectedCandidates: [
        {
          start: new Date('2026-05-15T10:00:00+03:00'),
          end: new Date('2026-05-15T11:00:00+03:00'),
          score: 10,
          rejectReasons: ['low score', 'warnings'],
        },
      ],
    },
  });

  assert.equal(text.includes('Best Windows Debug'), true);
  assert.equal(text.includes('windows.length: 0'), true);
  assert.equal(text.includes('fallback: Сегодня лучше проверять'), true);
  assert.equal(text.includes('rejected candidates'), true);
  assert.equal(text.includes('reject: low score, warnings'), true);
});

test('ordinary markup does not contain provider validation debug details', () => {
  const markup = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

  assert.equal(markup.includes('Natal Provider Validation'), false);
  assert.equal(markup.includes('Natal Planets UI Debug'), false);
  assert.equal(markup.includes('longitudeValidation: passed'), false);
  assert.equal(markup.includes('speedValidation: passed'), false);
  assert.equal(markup.includes('retrogradeValidation: passed'), false);
});

test('natal provider validation report documents provider validation without private data', () => {
  const report = readFileSync(new URL('../NATAL_PROVIDER_VALIDATION_REPORT.md', import.meta.url), 'utf8');

  assert.equal(report.includes('# NATAL_PROVIDER_VALIDATION_REPORT.md'), true);
  assert.equal(report.includes('astronomy-engine@2.1.19'), true);
  assert.equal(report.includes('local swisseph dev dependency'), true);
  assert.equal(report.includes('SEFLG_SWIEPH'), true);
  assert.equal(report.includes('SEFLG_SPEED'), true);
  assert.equal(report.includes('2000-01-01T12:00:00.000Z'), true);
  assert.equal(report.includes('2026-03-02T12:00:00.000Z'), true);
  assert.equal(report.includes('0.003180°'), true);
  assert.equal(report.includes('0.000294°'), true);
  assert.equal(report.includes('0.000288°/day'), true);
  assert.equal(report.includes('0.000148°/day'), true);
  assert.equal(report.includes('houses'), true);
  assert.equal(report.includes('ASC / MC'), true);
  assert.equal(report.includes('personal transits'), true);
  assert.equal(report.includes('birthDate'), false);
  assert.equal(report.includes('birthTime'), false);
  assert.equal(report.includes('profiles: ['), false);
});
