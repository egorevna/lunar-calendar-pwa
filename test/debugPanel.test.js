import assert from 'node:assert/strict';
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
  assert.equal(text.includes('birthDate'), false);
  assert.equal(text.includes('birthTime'), false);
  assert.equal(text.includes('birthPlace'), false);
  assert.equal(text.includes('latitude'), false);
  assert.equal(text.includes('longitude'), false);
  assert.equal(text.includes('profiles: ['), false);
});

test('debug panel marks normal time when debugDate is not used', () => {
  const text = describeDebugPanel({
    now: new Date('2026-05-15T00:40:00+03:00'),
    debugDate: null,
    lunarDay: 27,
  });

  assert.equal(text.includes('debugDate: inactive'), true);
  assert.equal(text.includes('Best Windows Debug'), false);
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
