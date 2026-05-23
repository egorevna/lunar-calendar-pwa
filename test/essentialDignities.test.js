import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import {
  evaluateEssentialDignities,
  evaluateEssentialDignity,
  getEssentialDignityLabels,
  getEssentialDignityScore,
  getEssentialDignitySummary,
  isValidDignityPlanet,
  resolvePlanetSignKey,
} from '../src/essentialDignities.js';

const PLANET_LABELS = Object.freeze({
  sun: 'Солнце',
  moon: 'Луна',
  mercury: 'Меркурий',
  venus: 'Венера',
  mars: 'Марс',
  jupiter: 'Юпитер',
  saturn: 'Сатурн',
  uranus: 'Уран',
  neptune: 'Нептун',
  pluto: 'Плутон',
});

const SIGN_LABELS = Object.freeze({
  aries: 'Овен',
  taurus: 'Телец',
  gemini: 'Близнецы',
  cancer: 'Рак',
  leo: 'Лев',
  virgo: 'Дева',
  libra: 'Весы',
  scorpio: 'Скорпион',
  sagittarius: 'Стрелец',
  capricorn: 'Козерог',
  aquarius: 'Водолей',
  pisces: 'Рыбы',
});

const SIGN_LONGITUDES = Object.freeze({
  aries: 15,
  taurus: 45,
  gemini: 75,
  cancer: 105,
  leo: 135,
  virgo: 165,
  libra: 195,
  scorpio: 225,
  sagittarius: 255,
  capricorn: 285,
  aquarius: 315,
  pisces: 345,
});

function planet(key, signKey, overrides = {}) {
  return {
    key,
    label: PLANET_LABELS[key],
    longitude: SIGN_LONGITUDES[signKey],
    sign: { key: signKey, ru: SIGN_LABELS[signKey], symbol: '' },
    degree: 15,
    minutes: 0,
    source: 'synthetic-dignity-test',
    ...overrides,
  };
}

function assertFlags(result, expected) {
  assert.deepEqual(result.dignities, {
    domicile: false,
    detriment: false,
    exaltation: false,
    fall: false,
    modernRulership: false,
    ...expected,
  });
}

test('Mars in Aries returns domicile and score +5', () => {
  const result = evaluateEssentialDignity(planet('mars', 'aries'));

  assert.equal(result.planetKey, 'mars');
  assert.equal(result.signKey, 'aries');
  assertFlags(result, { domicile: true });
  assert.equal(result.score, 5);
  assert.deepEqual(result.labels, ['обитель']);
});

test('Mars in Libra returns detriment and score -5', () => {
  const result = evaluateEssentialDignity(planet('mars', 'libra'));

  assertFlags(result, { detriment: true });
  assert.equal(result.score, -5);
  assert.deepEqual(result.labels, ['изгнание']);
});

test('Mars in Capricorn returns exaltation and score +4', () => {
  const result = evaluateEssentialDignity(planet('mars', 'capricorn'));

  assertFlags(result, { exaltation: true });
  assert.equal(result.score, 4);
  assert.deepEqual(result.labels, ['экзальтация']);
});

test('Mars in Cancer returns fall and score -4', () => {
  const result = evaluateEssentialDignity(planet('mars', 'cancer'));

  assertFlags(result, { fall: true });
  assert.equal(result.score, -4);
  assert.deepEqual(result.labels, ['падение']);
});

test('Venus in Pisces returns exaltation and Venus in Virgo returns fall', () => {
  assertFlags(evaluateEssentialDignity(planet('venus', 'pisces')), { exaltation: true });
  assertFlags(evaluateEssentialDignity(planet('venus', 'virgo')), { fall: true });
});

test('Sun dignity and debility signs are evaluated', () => {
  assertFlags(evaluateEssentialDignity(planet('sun', 'leo')), { domicile: true });
  assertFlags(evaluateEssentialDignity(planet('sun', 'aquarius')), { detriment: true });
  assertFlags(evaluateEssentialDignity(planet('sun', 'aries')), { exaltation: true });
  assertFlags(evaluateEssentialDignity(planet('sun', 'libra')), { fall: true });
});

test('Moon dignity and debility signs are evaluated', () => {
  assertFlags(evaluateEssentialDignity(planet('moon', 'cancer')), { domicile: true });
  assertFlags(evaluateEssentialDignity(planet('moon', 'capricorn')), { detriment: true });
  assertFlags(evaluateEssentialDignity(planet('moon', 'taurus')), { exaltation: true });
  assertFlags(evaluateEssentialDignity(planet('moon', 'scorpio')), { fall: true });
});

test('Mercury in Virgo returns domicile and exaltation with additive score +9', () => {
  const result = evaluateEssentialDignity(planet('mercury', 'virgo'));

  assertFlags(result, { domicile: true, exaltation: true });
  assert.equal(result.score, 9);
  assert.deepEqual(result.labels, ['обитель', 'экзальтация']);
});

test('Mercury in Pisces returns detriment and fall with additive score -9', () => {
  const result = evaluateEssentialDignity(planet('mercury', 'pisces'));

  assertFlags(result, { detriment: true, fall: true });
  assert.equal(result.score, -9);
  assert.deepEqual(result.labels, ['изгнание', 'падение']);
});

test('Jupiter and Saturn classical rulership and fall cases are evaluated', () => {
  assertFlags(evaluateEssentialDignity(planet('jupiter', 'pisces')), { domicile: true });
  assertFlags(evaluateEssentialDignity(planet('saturn', 'aquarius')), { domicile: true });
  assertFlags(evaluateEssentialDignity(planet('saturn', 'aries')), { fall: true });
});

test('outer planets receive modern rulership labels with score 0', () => {
  for (const [planetKey, signKey] of [
    ['uranus', 'aquarius'],
    ['neptune', 'pisces'],
    ['pluto', 'scorpio'],
  ]) {
    const result = evaluateEssentialDignity(planet(planetKey, signKey));

    assertFlags(result, { modernRulership: true });
    assert.equal(result.score, 0);
    assert.deepEqual(result.labels, []);
    assert.deepEqual(result.modernLabels, ['современное управление']);
  }
});

test('outer planets do not receive classical score or debility flags', () => {
  const uranusOppositeModern = evaluateEssentialDignity(planet('uranus', 'leo'));
  const neptuneClassicalJupiterDomicile = evaluateEssentialDignity(planet('neptune', 'sagittarius'));
  const plutoClassicalMarsExaltation = evaluateEssentialDignity(planet('pluto', 'capricorn'));

  assertFlags(uranusOppositeModern, {});
  assertFlags(neptuneClassicalJupiterDomicile, {});
  assertFlags(plutoClassicalMarsExaltation, {});
  assert.equal(uranusOppositeModern.score, 0);
  assert.equal(neptuneClassicalJupiterDomicile.score, 0);
  assert.equal(plutoClassicalMarsExaltation.score, 0);
});

test('neutral planet returns score 0 and no dignity or debility labels', () => {
  const result = evaluateEssentialDignity(planet('venus', 'gemini'));

  assertFlags(result, {});
  assert.equal(result.score, 0);
  assert.deepEqual(result.labels, []);
  assert.deepEqual(result.modernLabels, []);
});

test('missing sign can be resolved from valid longitude without faking insufficient data', () => {
  const resolved = evaluateEssentialDignity(planet('sun', 'aries', {
    longitude: 134.9,
    sign: null,
  }));

  assert.equal(resolvePlanetSignKey(planet('sun', 'aries', { longitude: 134.9, sign: null })), 'leo');
  assert.equal(resolved.signKey, 'leo');
  assert.equal(resolved.signLabel, 'Лев');
  assertFlags(resolved, { domicile: true });
});

test('invalid longitude and missing sign return null safely', () => {
  const invalid = planet('sun', 'aries', {
    longitude: Number.NaN,
    sign: null,
  });

  assert.equal(resolvePlanetSignKey(invalid), null);
  assert.equal(isValidDignityPlanet(invalid), false);
  assert.equal(evaluateEssentialDignity(invalid), null);
  assert.equal(evaluateEssentialDignity({ ...planet('sun', 'aries'), key: 'chiron' }), null);
  assert.equal(evaluateEssentialDignity({ ...planet('sun', 'aries'), label: '' }), null);
});

test('evaluateEssentialDignities filters invalid planets and preserves canonical order', () => {
  const results = evaluateEssentialDignities([
    planet('venus', 'pisces'),
    null,
    planet('sun', 'leo'),
    { ...planet('moon', 'cancer'), longitude: Number.NaN, sign: null },
    planet('mars', 'libra'),
  ]);

  assert.deepEqual(results.map((result) => result.planetKey), ['sun', 'venus', 'mars']);
  assert.equal(results.length, 3);
});

test('summary counts dignified debilitated neutral and modern labels safely', () => {
  const results = evaluateEssentialDignities([
    planet('sun', 'leo'),
    planet('mars', 'libra'),
    planet('venus', 'gemini'),
    planet('uranus', 'aquarius'),
  ]);
  const summary = getEssentialDignitySummary(results);

  assert.equal(summary.total, 4);
  assert.equal(summary.dignified, 1);
  assert.equal(summary.debilitated, 1);
  assert.equal(summary.neutral, 1);
  assert.equal(summary.modernLabels, 1);
  assert.equal(summary.scoreTotal, 0);
  assert.deepEqual(summary.strongest, [
    { planetKey: 'sun', planetLabel: 'Солнце', score: 5, labels: ['обитель'] },
  ]);
  assert.deepEqual(summary.weakest, [
    { planetKey: 'mars', planetLabel: 'Марс', score: -5, labels: ['изгнание'] },
  ]);
  assert.equal(summary.text, '1 достоинство · 1 слабость');
});

test('summary handles empty or invalid result input', () => {
  assert.deepEqual(getEssentialDignitySummary([]), {
    total: 0,
    dignified: 0,
    debilitated: 0,
    neutral: 0,
    modernLabels: 0,
    scoreTotal: 0,
    strongest: [],
    weakest: [],
    text: 'Базовые достоинства не рассчитаны.',
  });
  assert.equal(getEssentialDignitySummary(null).total, 0);
});

test('labels and score helpers use safe Russian labels without interpretation', () => {
  const result = evaluateEssentialDignity(planet('mercury', 'virgo'));

  assert.deepEqual(getEssentialDignityLabels(result), ['обитель', 'экзальтация']);
  assert.equal(getEssentialDignityScore(result), 9);
  assert.equal(getEssentialDignityScore(null), 0);
});

test('output contains no NaN undefined private data or unsupported feature text', () => {
  const results = evaluateEssentialDignities([
    planet('sun', 'leo'),
    planet('uranus', 'aquarius'),
  ]);
  const text = JSON.stringify(results);

  assert.equal(text.includes('NaN'), false);
  assert.equal(text.includes('undefined'), false);
  assert.equal(text.includes('birthDate'), false);
  assert.equal(text.includes('birthTime'), false);
  assert.equal(text.includes('coordinates'), false);
  assert.equal(text.includes('profile'), false);
  assert.equal(text.includes('terms'), false);
  assert.equal(text.includes('decans'), false);
  assert.equal(text.includes('degreeRulers'), false);
  assert.equal(text.includes('exaltationDegree'), false);
  assert.equal(text.includes('transit'), false);
  assert.equal(text.includes('interpretation'), false);
  assert.equal(text.includes('ритуал'), false);
});

test('engine module has no provider profile UI or runtime dependency imports', () => {
  const source = readFileSync(new URL('../src/essentialDignities.js', import.meta.url), 'utf8');

  assert.equal(source.includes('astronomy-engine'), false);
  assert.equal(source.includes('astronomyEngineProvider'), false);
  assert.equal(source.includes('planetaryPositionProvider'), false);
  assert.equal(source.includes('natalPlanetsForProfile'), false);
  assert.equal(source.includes('profileStorage'), false);
  assert.equal(source.includes('localStorage'), false);
  assert.equal(source.includes('document.'), false);
  assert.equal(source.includes('window.'), false);
  assert.equal(source.includes('luxon'), false);
  assert.equal(source.includes('VronskyStrengthTables:'), false);
});
