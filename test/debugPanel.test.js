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
  });

  assert.equal(text.includes('Time'), true);
  assert.equal(text.includes('debugDate: active'), true);
  assert.equal(text.includes('VOC'), true);
  assert.equal(text.includes('status: active'), true);
  assert.equal(text.includes('Moon aspects'), true);
  assert.equal(text.includes('major-only: yes'), true);
  assert.equal(text.includes('Indicators'), true);
  assert.equal(text.includes('Tong Shu: Устранение 除'), true);
});

test('debug panel marks normal time when debugDate is not used', () => {
  const text = describeDebugPanel({
    now: new Date('2026-05-15T00:40:00+03:00'),
    debugDate: null,
    lunarDay: 27,
  });

  assert.equal(text.includes('debugDate: inactive'), true);
});
