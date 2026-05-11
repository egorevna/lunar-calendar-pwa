import assert from 'node:assert/strict';
import test from 'node:test';

import { getFieldQuality } from '../src/fieldQuality.js';

test('describes a stable moment for practical work', () => {
  const quality = getFieldQuality({
    lunar: { illumination: 0.62, waxing: true },
    voc: { isActive: false },
    moonSign: { current: { key: 'taurus' } },
    moonAspects: {
      previous: { aspect: 120, planet: 'venus' },
      next: { aspect: 60, planet: 'jupiter' },
    },
    indicators: { dayOfficer: { key: 'stable' } },
    planetaryHour: { key: 'venus' },
  });

  assert.equal(quality.summary, 'Поле устойчиво, подходит для закрепления решений.');
  assert.equal(quality.scores.material.level, 'высоко');
  assert.equal(quality.scores.rituals.level, 'высоко');
  assert.equal(quality.metrics.length, 3);
});

test('warns when void-of-course and hard Mars aspect make the field unstable', () => {
  const quality = getFieldQuality({
    lunar: { illumination: 0.18, waxing: false },
    voc: { isActive: true },
    moonSign: { current: { key: 'gemini' } },
    moonAspects: {
      previous: { aspect: 90, planet: 'mars' },
      next: { aspect: 90, planet: 'saturn' },
    },
    indicators: { dayOfficer: { key: 'danger' } },
    planetaryHour: { key: 'mars' },
  });

  assert.equal(quality.summary, 'Поле нестабильно: лучше завершать и чистить, а не начинать.');
  assert.equal(quality.scores.material.level, 'низко');
  assert.equal(quality.scores.rituals.level, 'средне');
});

test('raises intuition for water Moon signs and Neptune influence', () => {
  const quality = getFieldQuality({
    lunar: { illumination: 0.42, waxing: false },
    voc: { isActive: false },
    moonSign: { current: { key: 'pisces' } },
    moonAspects: {
      previous: { aspect: 120, planet: 'neptune' },
      next: { aspect: 60, planet: 'venus' },
    },
    indicators: { dayOfficer: { key: 'open' } },
    planetaryHour: { key: 'moon' },
  });

  assert.equal(quality.summary, 'Поле тонкое: хорошо для интуиции, Таро и снов.');
  assert.equal(quality.scores.intuition.level, 'высоко');
});
