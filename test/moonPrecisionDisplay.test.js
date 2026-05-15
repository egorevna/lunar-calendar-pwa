import assert from 'node:assert/strict';
import test from 'node:test';

import { getLunarInfo } from '../src/astro.js';
import {
  describeHeroMoonPhase,
  describeMoonPrecision,
} from '../src/moonPrecisionDisplay.js';
import {
  getNextPreciseMajorMoonPhase,
  getPreciseMajorMoonPhase,
} from '../src/preciseEphemeris.js';

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

test('does not label current phase as New Moon while countdown to New Moon is still positive', () => {
  const now = new Date('2026-05-15T10:33:00+03:00');
  const lunar = getLunarInfo(now);
  const nextPhase = getNextPreciseMajorMoonPhase(now);
  const phase = describeHeroMoonPhase({
    lunar,
    majorPhase: getPreciseMajorMoonPhase(now),
    nextPhase,
    now,
  });
  const rows = describeMoonPrecision({ lunar, nextPhase, now });

  assert.equal(phase, 'Убывающий серп');
  assert.equal(phase.includes('Новолуние'), false);
  assert.equal(rows.some((row) => row.startsWith('До Новолуния:')), true);
});

test('does not show same-day future New Moon as current exact phase', () => {
  const now = new Date('2026-05-16T12:00:00+03:00');
  const lunar = { phaseName: 'Новолуние' };
  const majorPhase = getPreciseMajorMoonPhase(now);
  const nextPhase = getNextPreciseMajorMoonPhase(now);

  assert.equal(majorPhase.name, 'Новолуние');
  assert.equal(nextPhase.name, 'Новолуние');
  assert.equal(majorPhase.at > now, true);
  assert.equal(describeHeroMoonPhase({ lunar, majorPhase, nextPhase, now }), 'Убывающий серп');
});

test('does not label current phase as Full Moon while countdown to Full Moon is still positive', () => {
  const now = new Date('2026-05-01T12:00:00+03:00');
  const lunar = { phaseName: 'Полнолуние' };
  const majorPhase = getPreciseMajorMoonPhase(now);
  const nextPhase = getNextPreciseMajorMoonPhase(now);

  assert.equal(majorPhase.name, 'Полнолуние');
  assert.equal(nextPhase.name, 'Полнолуние');
  assert.equal(majorPhase.at > now, true);
  assert.equal(describeHeroMoonPhase({ lunar, majorPhase, nextPhase, now }), 'Растущая Луна');
});

test('keeps exact New Moon or Full Moon display after the event happened today', () => {
  const now = new Date('2026-05-01T21:00:00+03:00');
  const majorPhase = getPreciseMajorMoonPhase(now);

  assert.equal(majorPhase.name, 'Полнолуние');
  assert.equal(majorPhase.at < now, true);
  assert.equal(
    describeHeroMoonPhase({
      lunar: { phaseName: 'Полнолуние' },
      majorPhase,
      nextPhase: getNextPreciseMajorMoonPhase(now),
      now,
    }),
    'Полнолуние в 20:23',
  );
});

test('skips unavailable Moon precision values', () => {
  const rows = describeMoonPrecision({
    lunar: {},
    nextPhase: null,
    now: new Date('2026-05-10T10:00:00+03:00'),
  });

  assert.deepEqual(rows, []);
});
