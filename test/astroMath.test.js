import assert from 'node:assert/strict';
import test from 'node:test';

import {
  detectAspect,
  formatDegree,
  getAngularDistance,
  getAspectBetween,
  getDegreeInSign,
  getZodiacSign,
  normalizeDegrees,
} from '../src/astroMath.js';

test('normalizeDegrees wraps values into 0..360 and rejects invalid input safely', () => {
  assert.equal(normalizeDegrees(0), 0);
  assert.equal(normalizeDegrees(360), 0);
  assert.equal(normalizeDegrees(361), 1);
  assert.equal(normalizeDegrees(-1), 359);
  assert.equal(normalizeDegrees(720), 0);
  assert.equal(normalizeDegrees('15'), null);
  assert.equal(normalizeDegrees(Number.NaN), null);
  assert.equal(normalizeDegrees(Infinity), null);
});

test('getZodiacSign maps normalized longitudes on sign boundaries', () => {
  assert.deepEqual(getZodiacSign(0), {
    key: 'aries',
    ru: 'Овен',
    symbol: '♈',
    index: 0,
  });
  assert.equal(getZodiacSign(29.999).key, 'aries');
  assert.equal(getZodiacSign(30).key, 'taurus');
  assert.equal(getZodiacSign(59.999).key, 'taurus');
  assert.equal(getZodiacSign(359.999).key, 'pisces');
  assert.equal(getZodiacSign(-1).key, 'pisces');
  assert.equal(getZodiacSign(Number.NaN), null);
});

test('getDegreeInSign returns degree within current zodiac sign', () => {
  assert.equal(getDegreeInSign(0), 0);
  assert.equal(getDegreeInSign(29.5), 29.5);
  assert.equal(getDegreeInSign(30), 0);
  assert.equal(getDegreeInSign(45), 15);
  assert.equal(getDegreeInSign(359), 29);
  assert.equal(getDegreeInSign(Number.NaN), null);
});

test('getAngularDistance returns minimal distance across wrap-around', () => {
  assert.equal(getAngularDistance(10, 20), 10);
  assert.equal(getAngularDistance(350, 10), 20);
  assert.equal(getAngularDistance(0, 180), 180);
  assert.equal(getAngularDistance(90, 270), 180);
  assert.equal(getAngularDistance(Number.NaN, 10), null);
});

test('detectAspect detects major aspects inside explicit orb', () => {
  assert.equal(detectAspect(0, 1).key, 'conjunction');
  assert.equal(detectAspect(60, 1).key, 'sextile');
  assert.equal(detectAspect(90, 1).key, 'square');
  assert.equal(detectAspect(120, 1).key, 'trine');
  assert.equal(detectAspect(180, 1).key, 'opposition');

  const square = detectAspect(92, 3);
  assert.equal(square.key, 'square');
  assert.equal(square.orb, 2);

  assert.equal(detectAspect(92, 1), null);
  assert.equal(detectAspect(45, 3), null);
  assert.equal(detectAspect(Number.NaN, 3), null);
  assert.equal(detectAspect(90, -1), null);
});

test('detectAspect returns closest matching aspect when more than one fits', () => {
  const aspect = detectAspect(58, 65);

  assert.equal(aspect.key, 'sextile');
  assert.equal(aspect.exactAngle, 60);
  assert.equal(aspect.orb, 2);
});

test('getAspectBetween combines normalization, distance and aspect detection', () => {
  assert.equal(getAspectBetween(10, 10, 1).key, 'conjunction');
  assert.equal(getAspectBetween(10, 70, 1).key, 'sextile');
  assert.equal(getAspectBetween(10, 100, 1).key, 'square');
  assert.equal(getAspectBetween(350, 10, 25).key, 'conjunction');
  assert.equal(getAspectBetween(350, 10, 5), null);
  assert.equal(getAspectBetween(Number.NaN, 10, 5), null);
});

test('formatDegree returns stable sign degree minute structure and text', () => {
  assert.deepEqual(formatDegree(15.5), {
    sign: 'Овен',
    signKey: 'aries',
    symbol: '♈',
    degree: 15,
    minutes: 30,
    text: '15°30′ Овен',
  });

  assert.deepEqual(formatDegree(45), {
    sign: 'Телец',
    signKey: 'taurus',
    symbol: '♉',
    degree: 15,
    minutes: 0,
    text: '15°00′ Телец',
  });

  const wrapped = formatDegree(359.999);
  assert.equal(wrapped.sign, 'Рыбы');
  assert.equal(Number.isNaN(wrapped.degree), false);
  assert.equal(Number.isNaN(wrapped.minutes), false);
  assert.equal(String(wrapped.text).includes('undefined'), false);
  assert.equal(String(wrapped.text).includes('null'), false);
  assert.equal(String(wrapped.text).includes('NaN'), false);

  assert.deepEqual(formatDegree(Number.NaN), {
    sign: '',
    signKey: '',
    symbol: '',
    degree: 0,
    minutes: 0,
    text: '',
  });
});
