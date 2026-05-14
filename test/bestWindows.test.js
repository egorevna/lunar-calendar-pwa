import assert from 'node:assert/strict';
import test from 'node:test';

import {
  describeBestWindows,
  getBestWindows,
  getBestWindowsDebug,
} from '../src/bestWindows.js';

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

test('uses one concrete field warning as best window caution', () => {
  const firstWarning = 'Напряженный аспект Луны к Урану — возможны резкие реакции.';
  const secondWarning = 'Луна в Рыбах — риск иллюзий и эмоциональной размытости.';
  const windows = getBestWindows({
    selectedMode: 'tarot',
    now: new Date('2026-05-11T10:00:00+03:00'),
    slotMinutes: 60,
    ...baseContext,
    getFieldQuality: () => ({
      ...thinField,
      warnings: [firstWarning, secondWarning],
    }),
  });

  assert.equal(windows.length > 0, true);
  assert.equal(windows[0].cautions.includes(firstWarning), true);
  assert.equal(windows[0].cautions.includes(secondWarning), false);
  assert.equal(windows[0].cautions.includes('есть предупреждения момента'), false);
});

test('describes best windows with mode-specific title and compact time ranges', () => {
  const view = describeBestWindows([
    {
      start: new Date('2026-05-11T19:40:00+03:00'),
      end: new Date('2026-05-11T21:10:00+03:00'),
      suitableFor: ['расклады', 'записи'],
      reasons: ['час Меркурия'],
      cautions: [],
    },
  ], 'tarot');

  assert.equal(view.hidden, false);
  assert.equal(view.title, 'Лучшее окно для Таро');
  assert.deepEqual(view.ranges, ['19:40–21:10']);
  assert.deepEqual(view.suitableFor, ['расклады', 'записи']);
  assert.deepEqual(view.reasons, ['час Меркурия']);
  assert.equal(view.ranges[0].includes(':'), true);
  assert.equal(/\d{2}:\d{2}:\d{2}/.test(view.ranges[0]), false);
});

test('describes general best window with general title', () => {
  const view = describeBestWindows([
    {
      start: new Date('2026-05-11T10:00:00+03:00'),
      end: new Date('2026-05-11T11:00:00+03:00'),
      suitableFor: ['спокойные действия'],
      reasons: ['стабильное поле'],
      cautions: [],
    },
  ], 'general');

  assert.equal(view.title, 'Лучшее окно сегодня');
});

test('uses natural Russian labels for mode-specific best window titles', () => {
  const windows = [
    {
      start: new Date('2026-05-11T10:00:00+03:00'),
      end: new Date('2026-05-11T11:00:00+03:00'),
      suitableFor: [],
      reasons: [],
      cautions: [],
    },
  ];

  assert.equal(describeBestWindows(windows, 'tarot').title, 'Лучшее окно для Таро');
  assert.equal(describeBestWindows(windows, 'candles').title, 'Лучшее окно для свечей');
  assert.equal(describeBestWindows(windows, 'money').title, 'Лучшее окно для денег');
  assert.equal(describeBestWindows(windows, 'relationships').title, 'Лучшее окно для отношений');
  assert.equal(describeBestWindows(windows, 'cleansing').title, 'Лучшее окно для чисток');
  assert.equal(describeBestWindows(windows, 'forecasts').title, 'Лучшее окно для прогнозов');
});

test('shows calm fallback when helper returns no windows', () => {
  const view = describeBestWindows([], 'general');

  assert.equal(view.hidden, false);
  assert.equal(view.title, 'Лучшее окно сегодня');
  assert.deepEqual(view.ranges, []);
  assert.equal(view.fallback, 'Сегодня лучше завершать и очищать, а не запускать новое.');
});

test('shows mode-specific fallback when no best windows exist', () => {
  const tarot = describeBestWindows([], 'tarot');
  const money = describeBestWindows([], 'money');

  assert.equal(tarot.title, 'Лучшее окно для Таро');
  assert.equal(tarot.fallback, 'Сегодня лучше делать мягкую диагностику и записи, а не окончательные прогнозы.');
  assert.equal(money.fallback, 'Сегодня лучше проверять, закрывать хвосты и готовить решения, а не запускать новое.');
});

test('fallback does not expose empty technical values', () => {
  const view = describeBestWindows([], 'unknown');

  assert.equal(view.fallback.includes('undefined'), false);
  assert.equal(view.fallback.includes('null'), false);
  assert.equal(view.fallback.includes('NaN'), false);
});

test('best window description does not expose empty technical values', () => {
  const view = describeBestWindows([
    {
      start: new Date('2026-05-11T10:00:00+03:00'),
      end: new Date('2026-05-11T11:00:00+03:00'),
      suitableFor: ['сделки', undefined, null, ''],
      reasons: ['час Юпитера', undefined, null, ''],
      cautions: [undefined, null, ''],
    },
  ], 'money');
  const renderedText = [
    view.title,
    ...view.ranges,
    ...view.suitableFor,
    ...view.reasons,
    ...view.cautions,
  ].join(' ');

  assert.equal(renderedText.includes('undefined'), false);
  assert.equal(renderedText.includes('null'), false);
  assert.equal(renderedText.includes('NaN'), false);
});

test('does not show fallback when best windows exist', () => {
  const view = describeBestWindows([
    {
      start: new Date('2026-05-11T10:00:00+03:00'),
      end: new Date('2026-05-11T11:00:00+03:00'),
      suitableFor: ['спокойные действия'],
      reasons: ['стабильное поле'],
      cautions: [],
    },
  ], 'general');

  assert.equal(view.fallback, '');
});

test('regular getBestWindows remains backward compatible and returns an array', () => {
  const windows = getBestWindows({
    selectedMode: 'tarot',
    now: new Date('2026-05-11T10:00:00+03:00'),
    slotMinutes: 60,
    ...baseContext,
  });

  assert.equal(Array.isArray(windows), true);
});

test('best windows debug includes config and selected windows', () => {
  const debug = getBestWindowsDebug({
    selectedMode: 'tarot',
    now: new Date('2026-05-11T10:00:00+03:00'),
    slotMinutes: 60,
    maxWindows: 2,
    ...baseContext,
  });

  assert.equal(debug.selectedMode, 'tarot');
  assert.equal(debug.threshold, 30);
  assert.equal(debug.slotMinutes, 60);
  assert.equal(debug.maxWindows, 2);
  assert.equal(Array.isArray(debug.windows), true);
  assert.equal(debug.windows.length > 0, true);
  assert.equal(debug.windows[0].score >= 30, true);
  assert.equal(debug.windows[0].reasons.length > 0, true);
});

test('best windows debug includes fallback and rejected candidates when no windows pass', () => {
  const debug = getBestWindowsDebug({
    selectedMode: 'money',
    now: new Date('2026-05-11T10:00:00+03:00'),
    slotMinutes: 60,
    threshold: 80,
    ...baseContext,
    getPlanetaryHour: () => ({ key: 'mars' }),
    getMoonSign: () => ({ current: { key: 'pisces' } }),
    getFieldQuality: () => blurredField,
  });

  assert.equal(debug.windows.length, 0);
  assert.equal(debug.fallback, 'Сегодня лучше проверять, закрывать хвосты и готовить решения, а не запускать новое.');
  assert.equal(debug.rejectedCandidates.length > 0, true);
  assert.equal(debug.rejectedCandidates.length <= 5, true);
  assert.equal(debug.rejectedCandidates.some((candidate) => candidate.rejectReasons.includes('low score')), true);
});
