import assert from 'node:assert/strict';
import test from 'node:test';

import { getModeScores } from '../src/modeScores.js';

const baseFieldQuality = {
  metrics: [
    { key: 'intuition', label: 'Интуиция', level: 'высоко', score: 8 },
    { key: 'material', label: 'Материальные дела', level: 'средне', score: 6 },
    { key: 'rituals', label: 'Ритуалы', level: 'низко', score: 4 },
  ],
};

const supportiveContext = {
  lunar: { lunarDay: 12, illumination: 0.32, waxing: false },
  voc: { isActive: false },
  moonSign: { current: { key: 'pisces' } },
  moonAspects: {
    previous: { aspect: 120, planet: 'venus' },
    next: { aspect: 60, planet: 'mercury' },
  },
  indicators: { dayOfficer: { key: 'stable' } },
  planetaryHour: { key: 'mercury' },
  warnings: [],
};

test('general mode returns the existing base field metrics', () => {
  const scores = getModeScores('general', supportiveContext, baseFieldQuality);

  assert.deepEqual(scores.map((score) => score.label), [
    'Интуиция',
    'Материальные дела',
    'Ритуалы',
  ]);
  assert.deepEqual(scores.map((score) => score.value), [8, 6, 4]);
});

test('unknown mode safely falls back to general scores', () => {
  assert.deepEqual(
    getModeScores('unknown', supportiveContext, baseFieldQuality).map((score) => score.label),
    ['Интуиция', 'Материальные дела', 'Ритуалы'],
  );
});

test('tarot mode returns tarot-specific scores', () => {
  const scores = getModeScores('tarot', supportiveContext, baseFieldQuality);

  assert.deepEqual(scores.map((score) => score.label), [
    'Интуиция',
    'Ясность трактовки',
    'Риск искажений',
  ]);
  assert.equal(scores[0].score >= 7, true);
});

test('candles mode returns candle-specific scores', () => {
  const scores = getModeScores('candles', supportiveContext, baseFieldQuality);

  assert.deepEqual(scores.map((score) => score.label), [
    'Программные свечи',
    'Чистки',
    'Денежные свечи',
    'Любовные свечи',
    'Защита',
  ]);
});

test('money mode returns money-specific scores', () => {
  const scores = getModeScores('money', supportiveContext, baseFieldQuality);

  assert.deepEqual(scores.map((score) => score.label), [
    'Сделки',
    'Продажи',
    'Покупки',
    'Запуск рекламы',
    'Подписание',
  ]);
});

test('all mode score values are clamped to the 1-10 range', () => {
  const riskyContext = {
    ...supportiveContext,
    voc: { isActive: true },
    moonSign: { current: { key: 'pisces' } },
    moonAspects: { next: { aspect: 90, planet: 'uranus' } },
    indicators: { dayOfficer: { key: 'danger' } },
    planetaryHour: { key: 'mars' },
    warnings: ['Луна без курса до 05:31 — лучше не начинать важное.'],
  };

  const modes = ['general', 'tarot', 'candles', 'money', 'relationships', 'cleansing', 'forecasts'];
  const scores = modes.flatMap((mode) => getModeScores(mode, riskyContext, baseFieldQuality));

  assert.equal(scores.every((score) => score.value >= 1 && score.value <= 10), true);
  assert.equal(scores.every((score) => ['низко', 'средне', 'высоко'].includes(score.level)), true);
});
