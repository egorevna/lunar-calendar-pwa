import assert from 'node:assert/strict';
import test from 'node:test';

import {
  getLunarInfo,
  getPlanetaryDay,
  getPlanetaryHour,
  getVoidOfCourse,
} from '../src/astro.js';

test('returns the classical ruler for a Moscow Sunday', () => {
  const date = new Date('2026-05-10T09:00:00+03:00');

  const day = getPlanetaryDay(date);

  assert.equal(day.name, 'Солнце');
  assert.equal(day.glyph, '☉');
});

test('calculates a current planetary hour with a valid range', () => {
  const date = new Date('2026-05-10T12:00:00+03:00');

  const hour = getPlanetaryHour(date);

  assert.ok(hour.name.length > 0);
  assert.ok(hour.glyph.length > 0);
  assert.ok(hour.startsAt instanceof Date);
  assert.ok(hour.endsAt instanceof Date);
  assert.equal(hour.startsAt < date, true);
  assert.equal(hour.endsAt > date, true);
  assert.equal(hour.isDaylight === true || hour.isDaylight === false, true);
});

test('returns bounded lunar information for a known date', () => {
  const info = getLunarInfo(new Date('2026-05-10T21:42:00+03:00'));

  assert.ok(info.lunarDay >= 1);
  assert.ok(info.lunarDay <= 30);
  assert.ok(info.age >= 0);
  assert.ok(info.age < 29.6);
  assert.ok(info.illumination >= 0);
  assert.ok(info.illumination <= 1);
  assert.ok(info.phaseName.length > 0);
});

test('returns a void-of-course status object for Moscow', () => {
  const voc = getVoidOfCourse(new Date('2026-05-10T21:42:00+03:00'));

  assert.equal(typeof voc.isActive, 'boolean');
  assert.ok(voc.start instanceof Date);
  assert.ok(voc.end instanceof Date);
  assert.equal(voc.start < voc.end, true);
  assert.ok(['active', 'upcoming', 'none'].includes(voc.status));
});
