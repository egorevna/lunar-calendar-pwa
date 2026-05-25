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

test('debug panel shows safe natal aspects UI status for ready profile', () => {
  const text = describeDebugPanel({
    now: new Date('2026-05-15T00:40:00+03:00'),
    natalAspectsUiDebug: {
      activeProfileId: 'profile-egor',
      activeProfileName: 'Егор',
      hasActiveProfile: true,
      panelStatus: 'ready',
      userFacingNatalAspects: 'enabled',
      reason: 'Натальные аспекты доступны в панели «Мои карты».',
      natalPlanetsReady: true,
      aspectEngine: 'enabled',
      aspectSet: 'major only',
      orbPolicy: 'configured',
      aspectCount: 12,
      formattedAspectCount: 12,
      tenseCount: 3,
      harmoniousCount: 5,
      conjunctionCount: 4,
      collapsibleDefault: 'collapsed',
      profilePanelLocation: 'My Cards',
      missingFields: [],
      warnings: [],
      stillNotSupported: {
        transits: 'notSupported',
        houses: 'notSupported',
        ascMc: 'notSupported',
        fixedStars: 'notSupported',
        interpretations: 'notSupported',
      },
    },
  });
  const aspectSection = text
    .split('\n\n')
    .find((section) => section.startsWith('## Natal Aspects UI Debug'));

  assert.equal(text.includes('Natal Aspects UI Debug'), true);
  assert.equal(aspectSection.includes('activeProfileId: profile-egor'), true);
  assert.equal(aspectSection.includes('activeProfileName: Егор'), true);
  assert.equal(aspectSection.includes('hasActiveProfile: yes'), true);
  assert.equal(aspectSection.includes('panelStatus: ready'), true);
  assert.equal(aspectSection.includes('userFacingNatalAspects: enabled'), true);
  assert.equal(aspectSection.includes('natalPlanetsReady: yes'), true);
  assert.equal(aspectSection.includes('aspectEngine: enabled'), true);
  assert.equal(aspectSection.includes('aspectSet: major only'), true);
  assert.equal(aspectSection.includes('orbPolicy: configured'), true);
  assert.equal(aspectSection.includes('aspectCount: 12'), true);
  assert.equal(aspectSection.includes('formattedAspectCount: 12'), true);
  assert.equal(aspectSection.includes('tenseCount: 3'), true);
  assert.equal(aspectSection.includes('harmoniousCount: 5'), true);
  assert.equal(aspectSection.includes('conjunctionCount: 4'), true);
  assert.equal(aspectSection.includes('collapsibleDefault: collapsed'), true);
  assert.equal(aspectSection.includes('profilePanelLocation: My Cards'), true);
  assert.equal(aspectSection.includes('transits: notSupported'), true);
  assert.equal(aspectSection.includes('houses: notSupported'), true);
  assert.equal(aspectSection.includes('ascMc: notSupported'), true);
  assert.equal(aspectSection.includes('fixedStars: notSupported'), true);
  assert.equal(aspectSection.includes('interpretations: notSupported'), true);
  assert.equal(aspectSection.includes('birthDate'), false);
  assert.equal(aspectSection.includes('birthTime'), false);
  assert.equal(aspectSection.includes('utcDateTime'), false);
  assert.equal(aspectSection.includes('Europe/Moscow'), false);
  assert.equal(aspectSection.includes('latitude'), false);
  assert.equal(aspectSection.includes('longitude'), false);
  assert.equal(aspectSection.includes('allowedOrb'), false);
  assert.equal(aspectSection.includes('angle'), false);
  assert.equal(aspectSection.includes('Солнце □ Луна'), false);
  assert.equal(aspectSection.includes('орб'), false);
});

test('debug panel shows hidden natal aspects UI status for general day', () => {
  const text = describeDebugPanel({
    now: new Date('2026-05-15T00:40:00+03:00'),
    natalAspectsUiDebug: {
      activeProfileId: null,
      activeProfileName: 'Общий день',
      hasActiveProfile: false,
      panelStatus: 'hidden',
      userFacingNatalAspects: 'disabled',
      reason: 'Общий день не является персональным профилем.',
      natalPlanetsReady: false,
      aspectEngine: 'enabled',
      aspectSet: 'major only',
      orbPolicy: 'configured',
      aspectCount: 0,
      formattedAspectCount: 0,
      tenseCount: 0,
      harmoniousCount: 0,
      conjunctionCount: 0,
      collapsibleDefault: 'collapsed',
      profilePanelLocation: 'My Cards',
      missingFields: [],
      warnings: [],
    },
  });

  assert.equal(text.includes('Natal Aspects UI Debug'), true);
  assert.equal(text.includes('activeProfileId: null'), true);
  assert.equal(text.includes('activeProfileName: Общий день'), true);
  assert.equal(text.includes('hasActiveProfile: no'), true);
  assert.equal(text.includes('panelStatus: hidden'), true);
  assert.equal(text.includes('userFacingNatalAspects: disabled'), true);
  assert.equal(text.includes('reason: Общий день не является персональным профилем.'), true);
  assert.equal(text.includes('natalPlanetsReady: no'), true);
});

test('debug panel shows safe essential dignities UI status for ready profile', () => {
  const text = describeDebugPanel({
    now: new Date('2026-05-15T00:40:00+03:00'),
    essentialDignitiesUiDebug: {
      activeProfileId: 'profile-egor',
      activeProfileName: 'Егор',
      hasActiveProfile: true,
      panelStatus: 'ready',
      userFacingEssentialDignities: 'enabled',
      reason: 'Достоинства планет доступны в панели «Мои карты».',
      natalPlanetsReady: true,
      dignityEngine: 'enabled',
      sourcePolicy: 'classical-traditional-seven-planets',
      modernOuterPlanets: 'label-only',
      scoringModel: 'enabled',
      scoreTotal: 8,
      dignityCount: 3,
      debilityCount: 1,
      neutralCount: 6,
      modernLabelCount: 0,
      formattedDignityCount: 4,
      collapsibleDefault: 'collapsed',
      profilePanelLocation: 'My Cards',
      deferredFeatures: {
        terms: 'deferred',
        decans: 'deferred',
        degreeRulers: 'deferred',
        exactExaltationDegrees: 'deferred',
        VronskyTables: 'deferred',
      },
      stillNotSupported: {
        houses: 'notSupported',
        ascMc: 'notSupported',
        transits: 'notSupported',
        interpretations: 'notSupported',
      },
      missingFields: [],
      warnings: [],
    },
  });
  const dignitySection = text
    .split('\n\n')
    .find((section) => section.startsWith('## Essential Dignities UI Debug'));

  assert.equal(text.includes('Essential Dignities UI Debug'), true);
  assert.equal(dignitySection.includes('activeProfileId: profile-egor'), true);
  assert.equal(dignitySection.includes('activeProfileName: Егор'), true);
  assert.equal(dignitySection.includes('hasActiveProfile: yes'), true);
  assert.equal(dignitySection.includes('panelStatus: ready'), true);
  assert.equal(dignitySection.includes('userFacingEssentialDignities: enabled'), true);
  assert.equal(dignitySection.includes('natalPlanetsReady: yes'), true);
  assert.equal(dignitySection.includes('dignityEngine: enabled'), true);
  assert.equal(dignitySection.includes('sourcePolicy: classical-traditional-seven-planets'), true);
  assert.equal(dignitySection.includes('modernOuterPlanets: label-only'), true);
  assert.equal(dignitySection.includes('scoringModel: enabled'), true);
  assert.equal(dignitySection.includes('scoreTotal: 8'), true);
  assert.equal(dignitySection.includes('dignityCount: 3'), true);
  assert.equal(dignitySection.includes('debilityCount: 1'), true);
  assert.equal(dignitySection.includes('neutralCount: 6'), true);
  assert.equal(dignitySection.includes('modernLabelCount: 0'), true);
  assert.equal(dignitySection.includes('formattedDignityCount: 4'), true);
  assert.equal(dignitySection.includes('collapsibleDefault: collapsed'), true);
  assert.equal(dignitySection.includes('profilePanelLocation: My Cards'), true);
  assert.equal(dignitySection.includes('terms: deferred'), true);
  assert.equal(dignitySection.includes('decans: deferred'), true);
  assert.equal(dignitySection.includes('degreeRulers: deferred'), true);
  assert.equal(dignitySection.includes('exactExaltationDegrees: deferred'), true);
  assert.equal(dignitySection.includes('VronskyTables: deferred'), true);
  assert.equal(dignitySection.includes('houses: notSupported'), true);
  assert.equal(dignitySection.includes('ascMc: notSupported'), true);
  assert.equal(dignitySection.includes('transits: notSupported'), true);
  assert.equal(dignitySection.includes('interpretations: notSupported'), true);
  assert.equal(dignitySection.includes('birthDate'), false);
  assert.equal(dignitySection.includes('birthTime'), false);
  assert.equal(dignitySection.includes('utcDateTime'), false);
  assert.equal(dignitySection.includes('Europe/Moscow'), false);
  assert.equal(dignitySection.includes('latitude'), false);
  assert.equal(dignitySection.includes('longitude'), false);
  assert.equal(dignitySection.includes('coordinates'), false);
  assert.equal(dignitySection.includes('Марс в Овне'), false);
  assert.equal(dignitySection.includes('score:'), false);
});

test('debug panel shows hidden essential dignities UI status for general day', () => {
  const text = describeDebugPanel({
    now: new Date('2026-05-15T00:40:00+03:00'),
    essentialDignitiesUiDebug: {
      activeProfileId: null,
      activeProfileName: 'Общий день',
      hasActiveProfile: false,
      panelStatus: 'hidden',
      userFacingEssentialDignities: 'disabled',
      reason: 'Общий день не является персональным профилем.',
      natalPlanetsReady: false,
      dignityEngine: 'enabled',
      sourcePolicy: 'classical-traditional-seven-planets',
      modernOuterPlanets: 'label-only',
      scoringModel: 'enabled',
      scoreTotal: 0,
      dignityCount: 0,
      debilityCount: 0,
      neutralCount: 0,
      modernLabelCount: 0,
      formattedDignityCount: 0,
      collapsibleDefault: 'collapsed',
      profilePanelLocation: 'My Cards',
      missingFields: [],
      warnings: [],
    },
  });

  assert.equal(text.includes('Essential Dignities UI Debug'), true);
  assert.equal(text.includes('activeProfileId: null'), true);
  assert.equal(text.includes('activeProfileName: Общий день'), true);
  assert.equal(text.includes('hasActiveProfile: no'), true);
  assert.equal(text.includes('panelStatus: hidden'), true);
  assert.equal(text.includes('userFacingEssentialDignities: disabled'), true);
  assert.equal(text.includes('reason: Общий день не является персональным профилем.'), true);
  assert.equal(text.includes('natalPlanetsReady: no'), true);
});

test('debug panel shows safe detailed dignities UI status for ready profile', () => {
  const text = describeDebugPanel({
    now: new Date('2026-05-15T00:40:00+03:00'),
    detailedDignitiesUiDebug: {
      section: 'Detailed Dignities UI Debug',
      enabled: true,
      activeProfile: {
        hasProfile: true,
        id: 'profile-egor',
        name: 'Егор',
      },
      panelStatus: 'ready',
      reason: 'Термы, деканы и градусы доступны в панели «Мои карты».',
      natalPlanetsReady: true,
      userFacingBlock: true,
      location: 'My Cards',
      collapsedDefault: true,
      collapsedState: true,
      counts: {
        planetGroups: 10,
        totalItems: 40,
        terms: 10,
        decans: 10,
        degreeRulersTable6: 10,
        degreeRulersTable7: 10,
      },
      sources: {
        terms: 'Вронский, термы',
        decans: 'Звезда Магов',
        degreeRulersTable6: 'Звезда Магов',
        degreeRulersTable7: 'Вронский',
      },
      capabilities: {
        terms: true,
        decans: true,
        degreeRulersTable6: true,
        degreeRulersTable7: true,
        table6Table7Separated: true,
        interpretations: false,
        fixedStars: false,
        houses: false,
        ascMc: false,
        transits: false,
      },
      privacy: {
        rawBirthDataExposed: false,
        rawCoordinatesExposed: false,
        rawLongitudesExposed: false,
        rawSourceTokensExposed: false,
        rawSourceKeysExposed: false,
        fullTablesExposed: false,
      },
    },
  });
  const detailedSection = text
    .split('\n\n')
    .find((section) => section.startsWith('## Detailed Dignities UI Debug'));

  assert.equal(text.includes('Detailed Dignities UI Debug'), true);
  assert.equal(detailedSection.includes('activeProfileId: profile-egor'), true);
  assert.equal(detailedSection.includes('activeProfileName: Егор'), true);
  assert.equal(detailedSection.includes('hasActiveProfile: yes'), true);
  assert.equal(detailedSection.includes('panelStatus: ready'), true);
  assert.equal(detailedSection.includes('userFacingDetailedDignities: enabled'), true);
  assert.equal(detailedSection.includes('natalPlanetsReady: yes'), true);
  assert.equal(detailedSection.includes('userFacingBlock: yes'), true);
  assert.equal(detailedSection.includes('location: My Cards'), true);
  assert.equal(detailedSection.includes('collapsedDefault: yes'), true);
  assert.equal(detailedSection.includes('collapsedState: yes'), true);
  assert.equal(detailedSection.includes('planetGroups: 10'), true);
  assert.equal(detailedSection.includes('totalItems: 40'), true);
  assert.equal(detailedSection.includes('terms: 10'), true);
  assert.equal(detailedSection.includes('decans: 10'), true);
  assert.equal(detailedSection.includes('degreeRulersTable6: 10'), true);
  assert.equal(detailedSection.includes('degreeRulersTable7: 10'), true);
  assert.equal(detailedSection.includes('termsSource: Вронский, термы'), true);
  assert.equal(detailedSection.includes('decansSource: Звезда Магов'), true);
  assert.equal(detailedSection.includes('degreeRulersTable6Source: Звезда Магов'), true);
  assert.equal(detailedSection.includes('degreeRulersTable7Source: Вронский'), true);
  assert.equal(detailedSection.includes('table6Table7Separated: yes'), true);
  assert.equal(detailedSection.includes('interpretations: no'), true);
  assert.equal(detailedSection.includes('fixedStars: no'), true);
  assert.equal(detailedSection.includes('houses: no'), true);
  assert.equal(detailedSection.includes('ascMc: no'), true);
  assert.equal(detailedSection.includes('transits: no'), true);
  assert.equal(detailedSection.includes('rawBirthDataExposed: no'), true);
  assert.equal(detailedSection.includes('rawCoordinatesExposed: no'), true);
  assert.equal(detailedSection.includes('rawLongitudesExposed: no'), true);
  assert.equal(detailedSection.includes('rawSourceTokensExposed: no'), true);
  assert.equal(detailedSection.includes('rawSourceKeysExposed: no'), true);
  assert.equal(detailedSection.includes('fullTablesExposed: no'), true);
  assert.equal(detailedSection.includes('birthDate'), false);
  assert.equal(detailedSection.includes('birthTime'), false);
  assert.equal(detailedSection.includes('utcDateTime'), false);
  assert.equal(detailedSection.includes('Europe/Moscow'), false);
  assert.equal(detailedSection.includes('latitude'), false);
  assert.equal(detailedSection.includes('longitude'), false);
  assert.equal(detailedSection.includes('coordinates'), false);
  assert.equal(detailedSection.includes('sourceTokens'), false);
  assert.equal(detailedSection.includes('sourceKey'), false);
  assert.equal(detailedSection.includes('sourceSystem'), false);
  assert.equal(detailedSection.includes('Марс, Плутон R'), false);
});

test('debug panel shows hidden detailed dignities UI status for general day', () => {
  const text = describeDebugPanel({
    now: new Date('2026-05-15T00:40:00+03:00'),
    detailedDignitiesUiDebug: {
      section: 'Detailed Dignities UI Debug',
      enabled: false,
      activeProfile: {
        hasProfile: false,
        id: null,
        name: 'Общий день',
      },
      panelStatus: 'hidden',
      reason: 'Общий день не является персональным профилем.',
      natalPlanetsReady: false,
      userFacingBlock: false,
      location: 'My Cards',
      collapsedDefault: true,
      collapsedState: true,
      counts: {
        planetGroups: 0,
        totalItems: 0,
        terms: 0,
        decans: 0,
        degreeRulersTable6: 0,
        degreeRulersTable7: 0,
      },
      sources: {
        terms: 'Вронский, термы',
        decans: 'Звезда Магов',
        degreeRulersTable6: 'Звезда Магов',
        degreeRulersTable7: 'Вронский',
      },
      capabilities: {
        terms: true,
        decans: true,
        degreeRulersTable6: true,
        degreeRulersTable7: true,
        table6Table7Separated: true,
        interpretations: false,
        fixedStars: false,
        houses: false,
        ascMc: false,
        transits: false,
      },
      privacy: {
        rawBirthDataExposed: false,
        rawCoordinatesExposed: false,
        rawLongitudesExposed: false,
        rawSourceTokensExposed: false,
        rawSourceKeysExposed: false,
        fullTablesExposed: false,
      },
    },
  });

  assert.equal(text.includes('Detailed Dignities UI Debug'), true);
  assert.equal(text.includes('activeProfileId: null'), true);
  assert.equal(text.includes('activeProfileName: Общий день'), true);
  assert.equal(text.includes('hasActiveProfile: no'), true);
  assert.equal(text.includes('panelStatus: hidden'), true);
  assert.equal(text.includes('userFacingDetailedDignities: disabled'), true);
  assert.equal(text.includes('reason: Общий день не является персональным профилем.'), true);
  assert.equal(text.includes('natalPlanetsReady: no'), true);
  assert.equal(text.includes('totalItems: 0'), true);
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
  assert.equal(markup.includes('Natal Aspects UI Debug'), false);
  assert.equal(markup.includes('Essential Dignities UI Debug'), false);
  assert.equal(markup.includes('Detailed Dignities UI Debug'), false);
  assert.equal(markup.includes('Houses / ASC / MC UI Debug'), false);
  assert.equal(markup.includes('longitudeValidation: passed'), false);
  assert.equal(markup.includes('speedValidation: passed'), false);
  assert.equal(markup.includes('retrogradeValidation: passed'), false);
});

test('debug panel shows Houses ASC MC UI debug section when safe state is provided', () => {
  const text = describeDebugPanel({
    now: new Date('2026-05-15T00:40:00+03:00'),
    housesUiDebug: {
      section: 'Houses / ASC / MC UI Debug',
      enabled: true,
      activeProfile: {
        hasProfile: true,
        id: 'profile-egor',
        name: 'Егор',
      },
      panelStatus: 'ready',
      reason: null,
      location: 'My Cards',
      userFacingBlock: true,
      collapsedDefault: true,
      collapsedState: true,
      readiness: {
        hasExactBirthTime: true,
        hasBirthCoordinates: true,
        hasBirthTimezone: true,
        housesReady: true,
        anglesReady: true,
        planetAssignmentsReady: true,
      },
      selectedSystem: {
        houseSystem: 'placidus',
        label: 'Placidus',
        selectionSource: 'profile',
        defaulted: false,
      },
      counts: {
        angles: 4,
        houses: 12,
        planetAssignments: 10,
      },
      capabilities: {
        asc: true,
        mc: true,
        dsc: true,
        ic: true,
        houses: true,
        wholeSign: true,
        equalHouse: true,
        placidus: true,
        planetInHouse: true,
        interpretations: false,
        fixedStars: false,
        parsFortuna: false,
        arabicParts: false,
        transits: false,
        ritualScoring: false,
      },
      privacy: {
        rawBirthDataExposed: false,
        rawCoordinatesExposed: false,
        rawTimezoneExposed: false,
        rawPlanetLongitudesExposed: false,
        rawCuspLongitudesExposed: false,
        fullProfileJsonExposed: false,
        providerPayloadExposed: false,
      },
    },
  });
  const housesSection = text
    .split('\n\n')
    .find((section) => section.startsWith('## Houses / ASC / MC UI Debug'));

  assert.equal(Boolean(housesSection), true);
  assert.equal(housesSection.includes('activeProfileId: profile-egor'), true);
  assert.equal(housesSection.includes('activeProfileName: Егор'), true);
  assert.equal(housesSection.includes('hasActiveProfile: yes'), true);
  assert.equal(housesSection.includes('panelStatus: ready'), true);
  assert.equal(housesSection.includes('userFacingBlock: yes'), true);
  assert.equal(housesSection.includes('location: My Cards'), true);
  assert.equal(housesSection.includes('collapsedDefault: yes'), true);
  assert.equal(housesSection.includes('collapsedState: yes'), true);
  assert.equal(housesSection.includes('hasExactBirthTime: yes'), true);
  assert.equal(housesSection.includes('hasBirthCoordinates: yes'), true);
  assert.equal(housesSection.includes('hasBirthTimezone: yes'), true);
  assert.equal(housesSection.includes('housesReady: yes'), true);
  assert.equal(housesSection.includes('anglesReady: yes'), true);
  assert.equal(housesSection.includes('planetAssignmentsReady: yes'), true);
  assert.equal(housesSection.includes('selectedHouseSystem: placidus'), true);
  assert.equal(housesSection.includes('houseSystemLabel: Placidus'), true);
  assert.equal(housesSection.includes('selectionSource: profile'), true);
  assert.equal(housesSection.includes('defaulted: no'), true);
  assert.equal(housesSection.includes('anglesCount: 4'), true);
  assert.equal(housesSection.includes('housesCount: 12'), true);
  assert.equal(housesSection.includes('planetAssignmentsCount: 10'), true);
  assert.equal(housesSection.includes('asc: yes'), true);
  assert.equal(housesSection.includes('mc: yes'), true);
  assert.equal(housesSection.includes('dsc: yes'), true);
  assert.equal(housesSection.includes('ic: yes'), true);
  assert.equal(housesSection.includes('wholeSign: yes'), true);
  assert.equal(housesSection.includes('equalHouse: yes'), true);
  assert.equal(housesSection.includes('placidus: yes'), true);
  assert.equal(housesSection.includes('planetInHouse: yes'), true);
  assert.equal(housesSection.includes('interpretations: no'), true);
  assert.equal(housesSection.includes('fixedStars: no'), true);
  assert.equal(housesSection.includes('transits: no'), true);
  assert.equal(housesSection.includes('ritualScoring: no'), true);
  assert.equal(housesSection.includes('rawBirthDataExposed: no'), true);
  assert.equal(housesSection.includes('rawCoordinatesExposed: no'), true);
  assert.equal(housesSection.includes('rawTimezoneExposed: no'), true);
  assert.equal(housesSection.includes('rawPlanetLongitudesExposed: no'), true);
  assert.equal(housesSection.includes('rawCuspLongitudesExposed: no'), true);
  assert.equal(housesSection.includes('fullProfileJsonExposed: no'), true);
  assert.equal(housesSection.includes('providerPayloadExposed: no'), true);
  [
    'birthDate',
    'birthTime',
    'utcDateTime',
    'Europe/Moscow',
    'birthPlace',
    'latitude',
    'longitude',
    'coordinates',
    'planetLongitude',
    'cusps: [',
    'assignments: [',
    'Солнце —',
    '1 дом —',
    'providerPayload: {',
    'фатально',
    'кармически',
  ].forEach((fragment) => {
    assert.equal(housesSection.includes(fragment), false, fragment);
  });
});

test('debug panel omits Houses ASC MC UI debug section when no safe state is provided', () => {
  const text = describeDebugPanel({
    now: new Date('2026-05-15T00:40:00+03:00'),
  });

  assert.equal(text.includes('Houses / ASC / MC UI Debug'), false);
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
