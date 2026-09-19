import assert from 'node:assert/strict';
import test from 'node:test';

import {
  getMoonPhaseInfo,
  getPhaseNameFromAngle,
} from '../src/moonPhase.js';
import { PRECISE_EPHEMERIS } from '../src/ephemeris-data.js';

const NEW_MOONS = PRECISE_EPHEMERIS.moonPhases.filter((phase) => phase.type === 'new');
const FULL_MOONS = PRECISE_EPHEMERIS.moonPhases.filter((phase) => phase.type === 'full');

test('phase angle agrees with Swiss Ephemeris New Moon moments within a few arcminutes', () => {
  for (const phase of NEW_MOONS) {
    const info = getMoonPhaseInfo(new Date(phase.at));
    const distanceFromZero = Math.min(info.phaseAngle, 360 - info.phaseAngle);
    assert.ok(distanceFromZero < 0.1, `${phase.at}: phase angle ${info.phaseAngle}`);
  }
});

test('phase angle agrees with Swiss Ephemeris Full Moon moments within a few arcminutes', () => {
  for (const phase of FULL_MOONS) {
    const info = getMoonPhaseInfo(new Date(phase.at));
    assert.ok(Math.abs(info.phaseAngle - 180) < 0.1, `${phase.at}: phase angle ${info.phaseAngle}`);
  }
});

test('waxing flag flips exactly at precise New and Full Moon moments', () => {
  const hour = 3600000;

  for (const phase of NEW_MOONS) {
    const at = new Date(phase.at).getTime();
    assert.equal(getMoonPhaseInfo(new Date(at - hour)).waxing, false, `before ${phase.at}`);
    assert.equal(getMoonPhaseInfo(new Date(at + hour)).waxing, true, `after ${phase.at}`);
  }

  for (const phase of FULL_MOONS) {
    const at = new Date(phase.at).getTime();
    assert.equal(getMoonPhaseInfo(new Date(at - hour)).waxing, true, `before ${phase.at}`);
    assert.equal(getMoonPhaseInfo(new Date(at + hour)).waxing, false, `after ${phase.at}`);
  }
});

test('illumination is ~0 at New Moon, ~1 at Full Moon and ~0.5 at quarters', () => {
  assert.ok(getMoonPhaseInfo(new Date(NEW_MOONS[0].at)).illumination < 0.01);
  assert.ok(getMoonPhaseInfo(new Date(FULL_MOONS[0].at)).illumination > 0.99);

  const quarter = PRECISE_EPHEMERIS.moonPhases.find((phase) => phase.type === 'first');
  if (quarter) {
    assert.ok(Math.abs(getMoonPhaseInfo(new Date(quarter.at)).illumination - 0.5) < 0.01);
  }
});

test('phase names never return the exact syzygy labels and follow the elongation', () => {
  assert.equal(getPhaseNameFromAngle(0), 'Растущий серп');
  assert.equal(getPhaseNameFromAngle(10), 'Растущий серп');
  assert.equal(getPhaseNameFromAngle(90), 'Первая четверть');
  assert.equal(getPhaseNameFromAngle(150), 'Растущая Луна');
  assert.equal(getPhaseNameFromAngle(179.9), 'Растущая Луна');
  assert.equal(getPhaseNameFromAngle(180), 'Убывающая Луна');
  assert.equal(getPhaseNameFromAngle(270), 'Третья четверть');
  assert.equal(getPhaseNameFromAngle(350), 'Убывающий серп');
  assert.equal(getPhaseNameFromAngle(359.99), 'Убывающий серп');
  assert.equal(getPhaseNameFromAngle(-10), 'Убывающий серп');
});

test('returns the fields the dashboard and field-quality rules rely on', () => {
  const info = getMoonPhaseInfo(new Date('2026-09-19T11:15:00Z'));

  assert.equal(info.source, 'astronomy-engine');
  assert.equal(typeof info.phaseAngle, 'number');
  assert.equal(typeof info.age, 'number');
  assert.equal(typeof info.illumination, 'number');
  assert.equal(typeof info.waxing, 'boolean');
  assert.equal(typeof info.phaseName, 'string');
  assert.ok(info.lunarDay >= 1 && info.lunarDay <= 30);
});
