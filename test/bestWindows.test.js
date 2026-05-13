import assert from 'node:assert/strict';
import test from 'node:test';

import { getBestWindows } from '../src/bestWindows.js';

const stableField = {
  summary: 'Поле устойчивое: хорошо для закрепления результата.',
  warnings: [],
};

const thinField = {
  summary: 'Поле тонкое: хорошо для интуиции, Таро и снов.',
  warnings: [],
};

const blurredField = {
  summary: 'Поле размытое: осторожно с обещаниями, договорами и ожиданиями.',
  warnings: ['Луна в Рыбах — риск иллюзий и эмоциональной размытости.'],
};

const baseContext = {
  getVoc: () => ({ isActive: false }),
  getMoonAspects: () => ({ next: { aspect: 60, planet: 'mercury', at: new Date('2026-05-11T12:00:00+03:00') } }),
  getPlanetaryHour: () => ({ key: 'mercury' }),
  getMoonSign: () => ({ current: { key: 'pisces' } }),
  getLunar: () => ({ lunarDay: 12, waxing: true, illumination: 0.5 }),
  getFieldQuality: () => thinField,
};

test('returns a good window for a supported mode', () => {
  const windows = getBestWindows({
    selectedMode: 'tarot',
    now: new Date('2026-05-11T10:00:00+03:00'),
    slotMinutes: 60,
    ...baseContext,
  });

  assert.equal(windows.length > 0, true);
  assert.equal(windows[0].score >= 30, true);
  assert.equal(windows[0].reasons.length > 0, true);
});

test('active VOC excludes slots from windows', () => {
  const windows = getBestWindows({
    selectedMode: 'money',
    now: new Date('2026-05-11T10:00:00+03:00'),
    slotMinutes: 60,
    threshold: -100,
    ...baseContext,
    getVoc: () => ({ isActive: true }),
  });

  assert.deepEqual(windows, []);
});

test('returns an empty list when the whole day is below threshold', () => {
  const windows = getBestWindows({
    selectedMode: 'money',
    now: new Date('2026-05-11T10:00:00+03:00'),
    slotMinutes: 60,
    threshold: 0,
    ...baseContext,
    getMoonAspects: () => ({ next: { aspect: 90, planet: 'uranus', at: new Date('2026-05-11T10:30:00+03:00') } }),
    getPlanetaryHour: () => ({ key: 'mars' }),
    getMoonSign: () => ({ current: { key: 'pisces' } }),
    getFieldQuality: () => blurredField,
  });

  assert.deepEqual(windows, []);
});

test('matching planetary hour raises the score', () => {
  const baseOptions = {
    selectedMode: 'money',
    now: new Date('2026-05-11T10:00:00+03:00'),
    slotMinutes: 60,
    threshold: -100,
    ...baseContext,
    getMoonSign: () => ({ current: { key: 'aries' } }),
    getFieldQuality: () => stableField,
  };
  const jupiter = getBestWindows({ ...baseOptions, getPlanetaryHour: () => ({ key: 'jupiter' }) })[0];
  const mars = getBestWindows({ ...baseOptions, getPlanetaryHour: () => ({ key: 'mars' }) })[0];

  assert.equal(jupiter.score > mars.score, true);
});

test('matching Moon sign element raises the score', () => {
  const baseOptions = {
    selectedMode: 'tarot',
    now: new Date('2026-05-11T10:00:00+03:00'),
    slotMinutes: 60,
    threshold: 0,
    ...baseContext,
    getPlanetaryHour: () => ({ key: 'sun' }),
  };
  const water = getBestWindows({ ...baseOptions, getMoonSign: () => ({ current: { key: 'cancer' } }) })[0];
  const earth = getBestWindows({ ...baseOptions, getMoonSign: () => ({ current: { key: 'taurus' } }) })[0];

  assert.equal(water.score > earth.score, true);
});

test('returns at most two windows with valid start and end', () => {
  const windows = getBestWindows({
    selectedMode: 'candles',
    now: new Date('2026-05-11T10:00:00+03:00'),
    slotMinutes: 60,
    ...baseContext,
    getPlanetaryHour: (date) => ({ key: date.getUTCHours() % 2 === 0 ? 'mars' : 'saturn' }),
    getMoonSign: () => ({ current: { key: 'scorpio' } }),
  });

  assert.equal(windows.length <= 2, true);
  assert.equal(windows.every((window) => window.start < window.end), true);
});

test('unknown mode safely falls back to general scoring', () => {
  const windows = getBestWindows({
    selectedMode: 'unknown',
    now: new Date('2026-05-11T10:00:00+03:00'),
    slotMinutes: 60,
    ...baseContext,
    getMoonSign: () => ({ current: { key: 'taurus' } }),
    getFieldQuality: () => stableField,
  });

  assert.equal(windows.length > 0, true);
});
