import assert from 'node:assert/strict';
import test from 'node:test';

import { describeMoonPrecision } from '../src/moonPrecisionDisplay.js';

test('formats Moon illumination and next New Moon without Moon age', () => {
  const rows = describeMoonPrecision({
    lunar: { illumination: 0.324, age: 24.9 },
    nextPhase: {
      name: 'Новолуние',
      at: new Date('2026-05-15T04:00:00+03:00'),
    },
    now: new Date('2026-05-10T10:00:00+03:00'),
  });

  assert.deepEqual(rows, [
    'Освещенность: 32%',
    'До Новолуния: 4д 18ч',
  ]);
  assert.equal(rows.some((row) => row.includes('Возраст Луны')), false);
});

test('formats time until Full Moon under one day', () => {
  const rows = describeMoonPrecision({
    lunar: { illumination: 0.8, age: 13.2 },
    nextPhase: {
      name: 'Полнолуние',
      at: new Date('2026-05-10T21:00:00+03:00'),
    },
    now: new Date('2026-05-10T10:00:00+03:00'),
  });

  assert.equal(rows[1], 'До Полнолуния: 11ч');
});

test('skips unavailable Moon precision values', () => {
  const rows = describeMoonPrecision({
    lunar: {},
    nextPhase: null,
    now: new Date('2026-05-10T10:00:00+03:00'),
  });

  assert.deepEqual(rows, []);
});
