import assert from 'node:assert/strict';
import test from 'node:test';

import { getModeRecommendations } from '../src/modeRecommendations.js';

const baseFieldQuality = {
  summary: 'Поле тонкое: хорошо для интуиции, Таро и снов.',
  supports: ['Таро и диагностика', 'закрепление решений', 'ритуальная работа'],
  avoid: ['импульсивные решения', 'жесткие финансовые решения'],
  warnings: [],
};

const supportiveContext = {
  lunar: { lunarDay: 12, illumination: 0.32, waxing: false },
  voc: { isActive: false, status: 'upcoming' },
  moonSign: { current: { key: 'pisces' } },
  moonAspects: {
    previous: { aspect: 120, planet: 'venus' },
    next: { aspect: 60, planet: 'mercury' },
  },
  indicators: { dayOfficer: { key: 'stable' } },
  planetaryHour: { key: 'mercury' },
  warnings: [],
};

test('general mode adapts existing field quality lists', () => {
  const recommendations = getModeRecommendations('general', supportiveContext, baseFieldQuality);

  assert.deepEqual(recommendations.good, ['Таро и диагностика', 'закрепление решений', 'ритуальная работа']);
  assert.deepEqual(recommendations.careful, ['импульсивные решения', 'жесткие финансовые решения']);
});

test('unknown mode safely falls back to general recommendations', () => {
  const recommendations = getModeRecommendations('unknown', supportiveContext, baseFieldQuality);

  assert.deepEqual(recommendations.good, baseFieldQuality.supports);
});

test('tarot mode returns tarot-specific recommendations', () => {
  const recommendations = getModeRecommendations('tarot', supportiveContext, baseFieldQuality);

  assert.ok(recommendations.good.includes('диагностика'));
  assert.ok(recommendations.good.includes('формулировка вопросов'));
  assert.ok(recommendations.careful.includes('резкие выводы на напряженном фоне') === false);
});

test('candles mode accounts for cleansing and protection factors', () => {
  const recommendations = getModeRecommendations('candles', {
    ...supportiveContext,
    planetaryHour: { key: 'saturn' },
  }, baseFieldQuality);

  assert.ok(recommendations.good.includes('защита'));
  assert.ok(recommendations.good.includes('закрепление'));
});

test('money mode returns money-specific recommendations and cautions', () => {
  const recommendations = getModeRecommendations('money', {
    ...supportiveContext,
    voc: { isActive: true },
    warnings: ['Луна без курса до 05:31 — лучше не начинать важное.'],
  }, {
    ...baseFieldQuality,
    summary: 'Поле размытое: осторожно с обещаниями, договорами и ожиданиями.',
  });

  assert.ok(recommendations.good.includes('переговоры'));
  assert.ok(recommendations.careful.includes('запуск нового на Луне без курса'));
  assert.ok(recommendations.careful.includes('обещания на размытом фоне'));
});

test('money mode prioritizes active void-of-course caution', () => {
  const recommendations = getModeRecommendations('money', {
    ...supportiveContext,
    voc: { isActive: true },
    moonAspects: { next: { aspect: 90, planet: 'neptune' } },
    planetaryHour: { key: 'jupiter' },
    warnings: ['Луна без курса до 05:31 — лучше не начинать важное.'],
  }, {
    ...baseFieldQuality,
    summary: 'Поле размытое: осторожно с обещаниями, договорами и ожиданиями.',
  });

  assert.equal(recommendations.careful.includes('запуск нового на Луне без курса'), true);
  assert.equal(recommendations.careful.length <= 3, true);
});

test('tarot mode combines Pisces Moon support with distortion caution', () => {
  const recommendations = getModeRecommendations('tarot', {
    ...supportiveContext,
    moonSign: { current: { key: 'pisces' } },
    moonAspects: { next: { aspect: 0, planet: 'neptune' } },
  }, {
    ...baseFieldQuality,
    summary: 'Поле размытое: осторожно с обещаниями, договорами и ожиданиями.',
  });

  assert.equal(recommendations.good.some((item) => ['диагностика', 'сны'].includes(item)), true);
  assert.equal(recommendations.careful.some((item) => item.includes('искаж') || item.includes('окончательные выводы')), true);
});

test('relationships mode warns about tense Mars or Uranus aspect', () => {
  const recommendations = getModeRecommendations('relationships', {
    ...supportiveContext,
    moonAspects: { next: { aspect: 90, planet: 'mars' } },
  }, {
    ...baseFieldQuality,
    summary: 'Поле нервное: возможны резкие реакции и сбои планов.',
  });

  assert.equal(recommendations.careful.some((item) => item.includes('резкие разговоры') || item.includes('конфликт')), true);
});

test('cleansing mode supports the 29th lunar day without mixing practices', () => {
  const recommendations = getModeRecommendations('cleansing', {
    ...supportiveContext,
    lunar: { lunarDay: 29, illumination: 0.04, waxing: false },
  }, baseFieldQuality);

  assert.equal(recommendations.good.some((item) => item.includes('чист') || item.includes('закрыть старое')), true);
  assert.equal(recommendations.careful.includes('смешивать чистку и программирование'), true);
});

test('candles mode warns about programming candles during active VOC', () => {
  const recommendations = getModeRecommendations('candles', {
    ...supportiveContext,
    voc: { isActive: true },
  }, baseFieldQuality);

  assert.equal(recommendations.careful.includes('программные свечи на Луне без курса'), true);
});

test('safety caution stays in top 3 over regular cautions', () => {
  const recommendations = getModeRecommendations('tarot', {
    ...supportiveContext,
    voc: { isActive: true },
    lunar: { lunarDay: 23, illumination: 0.32, waxing: false },
    moonAspects: { next: { aspect: 90, planet: 'uranus' } },
    warnings: ['Напряженный аспект Луны к Урану — возможны резкие реакции.'],
  }, {
    ...baseFieldQuality,
    summary: 'Поле нервное: возможны резкие реакции и сбои планов.',
  });

  assert.equal(recommendations.careful.length <= 3, true);
  assert.equal(recommendations.careful.includes('не делать расклады из тревоги или злости'), true);
});

test('recommendations are limited and do not expose empty technical values', () => {
  const modes = ['general', 'tarot', 'candles', 'money', 'relationships', 'cleansing', 'forecasts'];
  const allItems = modes.flatMap((mode) => {
    const recommendations = getModeRecommendations(mode, supportiveContext, baseFieldQuality);
    assert.equal(recommendations.good.length <= 3, true);
    assert.equal(recommendations.careful.length <= 3, true);
    return [...recommendations.good, ...recommendations.careful];
  });

  assert.equal(allItems.every((item) => item && !String(item).includes('undefined') && !String(item).includes('null')), true);
});
