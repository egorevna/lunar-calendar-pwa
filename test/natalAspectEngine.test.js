import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import {
  calculateNatalAspectBetween,
  calculateNatalAspects,
  formatAspectOrb,
  getAllowedNatalAspectOrb,
  getBodyPairOrbCap,
  getNatalAspectDefinitions,
  getNatalAspectOrbPolicy,
  getNatalAspectStrength,
  isValidNatalAspectPlanet,
} from '../src/natalAspectEngine.js';

const basePlanet = {
  key: 'sun',
  label: 'Солнце',
  longitude: 0,
  sign: { key: 'aries', ru: 'Овен', symbol: '♈' },
  degree: 0,
  minutes: 0,
  retrograde: false,
  speed: 0.98,
  source: 'test',
};

function planet(key, longitude, label = labels[key]) {
  return {
    ...basePlanet,
    key,
    label,
    longitude,
  };
}

const labels = {
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
};

test('getNatalAspectDefinitions returns five major aspects only', () => {
  const definitions = getNatalAspectDefinitions();

  assert.deepEqual(definitions.map((aspect) => aspect.key), [
    'conjunction',
    'sextile',
    'square',
    'trine',
    'opposition',
  ]);
  assert.deepEqual(definitions.map((aspect) => aspect.exactAngle), [0, 60, 90, 120, 180]);
});

test('minor aspects are not active', () => {
  const definitions = getNatalAspectDefinitions();
  const angles = definitions.map((aspect) => aspect.exactAngle);

  assert.equal(angles.includes(30), false);
  assert.equal(angles.includes(45), false);
  assert.equal(angles.includes(72), false);
  assert.equal(angles.includes(150), false);
});

test('getNatalAspectOrbPolicy exposes aspect caps, body-pair caps and strength bands', () => {
  const policy = getNatalAspectOrbPolicy();

  assert.equal(policy.aspectBaseCaps.conjunction, 8);
  assert.equal(policy.aspectBaseCaps.opposition, 8);
  assert.equal(policy.aspectBaseCaps.square, 7);
  assert.equal(policy.aspectBaseCaps.trine, 7);
  assert.equal(policy.aspectBaseCaps.sextile, 5);
  assert.equal(policy.bodyPairCaps.luminary, 8);
  assert.equal(policy.bodyPairCaps.personalWithoutLuminaries, 6);
  assert.equal(policy.bodyPairCaps.socialOrOuterInvolved, 5);
  assert.equal(policy.bodyPairCaps.outerOnly, 3);
  assert.equal(policy.strengthBands.exact, 1);
  assert.equal(policy.strengthBands.strong, 3);
  assert.equal(policy.strengthBands.medium, 5);
});

test('getAllowedNatalAspectOrb uses min(aspectBase, bodyPair)', () => {
  assert.equal(getAllowedNatalAspectOrb('square', 'sun', 'moon'), 7);
  assert.equal(getAllowedNatalAspectOrb('sextile', 'mercury', 'venus'), 5);
  assert.equal(getAllowedNatalAspectOrb('conjunction', 'uranus', 'neptune'), 3);
});

test('body pair caps cover luminary personal social and outer rules', () => {
  assert.equal(getBodyPairOrbCap('sun', 'pluto'), 8);
  assert.equal(getBodyPairOrbCap('mercury', 'venus'), 6);
  assert.equal(getBodyPairOrbCap('jupiter', 'venus'), 5);
  assert.equal(getBodyPairOrbCap('mars', 'uranus'), 5);
  assert.equal(getBodyPairOrbCap('uranus', 'pluto'), 3);
});

test('detects exact major aspects', () => {
  assert.equal(calculateNatalAspectBetween(planet('sun', 0), planet('moon', 0)).aspect.key, 'conjunction');
  assert.equal(calculateNatalAspectBetween(planet('sun', 0), planet('moon', 180)).aspect.key, 'opposition');
  assert.equal(calculateNatalAspectBetween(planet('sun', 0), planet('moon', 90)).aspect.key, 'square');
  assert.equal(calculateNatalAspectBetween(planet('sun', 0), planet('moon', 120)).aspect.key, 'trine');
  assert.equal(calculateNatalAspectBetween(planet('sun', 0), planet('moon', 60)).aspect.key, 'sextile');
});

test('near aspect inside allowed orb is detected and just outside is rejected', () => {
  const inside = calculateNatalAspectBetween(planet('sun', 0), planet('moon', 96.9));
  const outside = calculateNatalAspectBetween(planet('sun', 0), planet('moon', 97.1));

  assert.equal(inside.aspect.key, 'square');
  assert.equal(inside.allowedOrb, 7);
  assert.equal(round(inside.orb), 6.9);
  assert.equal(outside, null);
});

test('wrap-around uses shortest angular distance', () => {
  const conjunction = calculateNatalAspectBetween(planet('sun', 359), planet('moon', 1));
  const rejected = calculateNatalAspectBetween(planet('sun', 350), planet('moon', 10));

  assert.equal(conjunction.aspect.key, 'conjunction');
  assert.equal(conjunction.angle, 2);
  assert.equal(conjunction.orb, 2);
  assert.equal(rejected, null);
});

test('calculateNatalAspects prevents duplicate A-B and B-A pairs and ignores same body', () => {
  const aspects = calculateNatalAspects([
    planet('moon', 0),
    planet('sun', 0),
    planet('sun', 0, 'Duplicate Sun'),
  ]);

  assert.equal(aspects.length, 1);
  assert.equal(aspects[0].bodyA.key, 'sun');
  assert.equal(aspects[0].bodyB.key, 'moon');
});

test('invalid planets are ignored', () => {
  const aspects = calculateNatalAspects([
    planet('sun', 0),
    planet('moon', 0),
    { ...planet('venus', 60), key: 'invalid-body' },
    { ...planet('mars', 90), longitude: Number.NaN },
    { ...planet('jupiter', 120), label: '' },
  ]);

  assert.equal(aspects.length, 1);
  assert.equal(aspects[0].bodyA.key, 'sun');
  assert.equal(aspects[0].bodyB.key, 'moon');
  assert.equal(isValidNatalAspectPlanet(planet('venus', 60)), true);
  assert.equal(isValidNatalAspectPlanet({ ...planet('venus', 60), key: 'chiron' }), false);
  assert.equal(isValidNatalAspectPlanet({ ...planet('venus', Number.NaN) }), false);
});

test('output contains no NaN and applying separating are null', () => {
  const aspect = calculateNatalAspectBetween(planet('sun', 0), planet('moon', 92.25));
  const text = JSON.stringify(aspect);

  assert.equal(aspect.applying, null);
  assert.equal(aspect.separating, null);
  assert.equal(aspect.orbText, '2°15′');
  assert.equal(text.includes('NaN'), false);
  assert.equal(text.includes('undefined'), false);
});

test('strength exact strong medium and weak works', () => {
  assert.equal(getNatalAspectStrength(0.5), 'exact');
  assert.equal(getNatalAspectStrength(2), 'strong');
  assert.equal(getNatalAspectStrength(4), 'medium');
  assert.equal(getNatalAspectStrength(6), 'weak');
});

test('formatAspectOrb formats degrees and minutes safely', () => {
  assert.equal(formatAspectOrb(2.25), '2°15′');
  assert.equal(formatAspectOrb(0), '0°00′');
  assert.equal(formatAspectOrb(1.999), '1°59′');
  assert.equal(formatAspectOrb(Number.NaN), '');
});

test('sorted by orb first then luminary hard aspect and canonical order', () => {
  const byOrb = calculateNatalAspects([
    planet('sun', 0),
    planet('moon', 90.5),
    planet('venus', 120),
    planet('mars', 122),
  ]);

  assert.equal(byOrb[0].bodyA.key, 'sun');
  assert.equal(byOrb[0].bodyB.key, 'moon');
  assert.equal(byOrb[0].orb, 0.5);

  const luminaryPriority = calculateNatalAspects([
    planet('sun', 0),
    planet('moon', 119),
    planet('mercury', 200),
    planet('venus', 141),
  ]);

  assert.deepEqual(luminaryPriority.map((aspect) => `${aspect.bodyA.key}-${aspect.bodyB.key}`), [
    'sun-moon',
    'mercury-venus',
  ]);

  const hardPriority = calculateNatalAspects([
    planet('mercury', 0),
    planet('venus', 61),
    planet('mars', 91),
  ]);

  assert.equal(hardPriority[0].aspect.key, 'square');
  assert.equal(hardPriority[1].aspect.key, 'sextile');

  const canonical = calculateNatalAspects([
    planet('venus', 0),
    planet('mercury', 0),
    planet('mars', 0),
  ]);

  assert.deepEqual(canonical.map((aspect) => `${aspect.bodyA.key}-${aspect.bodyB.key}`), [
    'mercury-venus',
    'mercury-mars',
    'venus-mars',
  ]);
});

test('calculateNatalAspects empty or invalid input returns empty array', () => {
  assert.deepEqual(calculateNatalAspects([]), []);
  assert.deepEqual(calculateNatalAspects(null), []);
});

test('output does not include private data transits houses ASC MC or profile JSON', () => {
  const aspects = calculateNatalAspects([
    planet('sun', 0),
    planet('moon', 90),
  ]);
  const text = JSON.stringify(aspects);

  assert.equal(text.includes('birthDate'), false);
  assert.equal(text.includes('birthTime'), false);
  assert.equal(text.includes('coordinates'), false);
  assert.equal(text.includes('profile'), false);
  assert.equal(text.includes('transit'), false);
  assert.equal(text.includes('houses'), false);
  assert.equal(text.includes('ASC'), false);
  assert.equal(text.includes('MC'), false);
});

test('natal aspect engine has no provider UI storage or date dependency imports', () => {
  const source = readFileSync(new URL('../src/natalAspectEngine.js', import.meta.url), 'utf8');

  assert.equal(source.includes('astronomy-engine'), false);
  assert.equal(source.includes('astronomyEngineProvider'), false);
  assert.equal(source.includes('luxon'), false);
  assert.equal(source.includes('profileStorage'), false);
  assert.equal(source.includes('localStorage'), false);
  assert.equal(source.includes('document.'), false);
});

function round(value) {
  return Math.round(value * 10) / 10;
}
