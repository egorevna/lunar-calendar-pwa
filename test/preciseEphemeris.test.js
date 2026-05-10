import assert from 'node:assert/strict';
import test from 'node:test';

import {
  getPreciseMoonSignInfo,
  getPreciseVoidOfCourse,
} from '../src/preciseEphemeris.js';
import { PRECISE_EPHEMERIS } from '../src/ephemeris-data.js';

const fixture = {
  generatedAt: '2026-05-10T00:00:00.000Z',
  rangeStart: '2026-01-01T00:00:00.000Z',
  rangeEnd: '2027-01-01T00:00:00.000Z',
  signIngresses: [
    { at: '2026-05-09T03:00:00.000Z', sign: 'aquarius' },
    { at: '2026-05-11T15:12:30.000Z', sign: 'pisces' },
  ],
  voidOfCourse: [
    {
      start: '2026-05-10T15:55:11.000Z',
      end: '2026-05-10T18:00:45.000Z',
      aspect: 120,
      planet: 'venus',
    },
  ],
};

test('returns precise current and next Moon signs from precomputed ingresses', () => {
  const sign = getPreciseMoonSignInfo(new Date('2026-05-10T21:42:00+03:00'), fixture);

  assert.equal(sign.source, 'swisseph');
  assert.equal(sign.current.key, 'aquarius');
  assert.equal(sign.next.key, 'pisces');
  assert.equal(sign.entersAt.toISOString(), '2026-05-11T15:12:30.000Z');
});

test('returns active precise void-of-course interval', () => {
  const voc = getPreciseVoidOfCourse(new Date('2026-05-10T19:10:00+03:00'), fixture);

  assert.equal(voc.source, 'swisseph');
  assert.equal(voc.isActive, true);
  assert.equal(voc.status, 'active');
  assert.equal(voc.start.toISOString(), '2026-05-10T15:55:11.000Z');
  assert.equal(voc.end.toISOString(), '2026-05-10T18:00:45.000Z');
});

test('returns null when precise data does not cover the requested date', () => {
  assert.equal(getPreciseMoonSignInfo(new Date('2032-01-01T00:00:00Z'), fixture), null);
  assert.equal(getPreciseVoidOfCourse(new Date('2032-01-01T00:00:00Z'), fixture), null);
});

test('generated Swiss Ephemeris data covers the app release range', () => {
  const sign = getPreciseMoonSignInfo(new Date('2026-05-10T21:42:00+03:00'), PRECISE_EPHEMERIS);
  const voc = getPreciseVoidOfCourse(new Date('2026-05-10T21:42:00+03:00'), PRECISE_EPHEMERIS);

  assert.equal(PRECISE_EPHEMERIS.source.includes('Swiss Ephemeris'), true);
  assert.ok(PRECISE_EPHEMERIS.signIngresses.length > 700);
  assert.ok(PRECISE_EPHEMERIS.voidOfCourse.length > 700);
  assert.equal(sign.source, 'swisseph');
  assert.equal(voc.source, 'swisseph');
});
