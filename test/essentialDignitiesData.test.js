import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import {
  CLASSICAL_DETRIMENTS,
  CLASSICAL_EXALTATIONS,
  CLASSICAL_FALLS,
  CLASSICAL_RULERSHIPS,
  ESSENTIAL_DIGNITY_SCORE_MODEL,
  ESSENTIAL_DIGNITY_SOURCE,
  ESSENTIAL_DIGNITY_TYPES,
  MODERN_OUTER_PLANET_KEYS,
  MODERN_RULERSHIP_LABELS,
  TRADITIONAL_PLANET_KEYS,
  getDeferredDignityFeatures,
  getEssentialDignityDataset,
  isModernOuterPlanet,
  isTraditionalDignityPlanet,
} from '../src/essentialDignitiesData.js';

const OPPOSITE_SIGNS = Object.freeze({
  aries: 'libra',
  taurus: 'scorpio',
  gemini: 'sagittarius',
  cancer: 'capricorn',
  leo: 'aquarius',
  virgo: 'pisces',
  libra: 'aries',
  scorpio: 'taurus',
  sagittarius: 'gemini',
  capricorn: 'cancer',
  aquarius: 'leo',
  pisces: 'virgo',
});

test('dataset exports source metadata for the selected Sprint 9 policy', () => {
  assert.equal(ESSENTIAL_DIGNITY_SOURCE.key, 'essential-dignities-v1');
  assert.equal(ESSENTIAL_DIGNITY_SOURCE.scoringBaseline, 'classical-traditional-seven-planets');
  assert.equal(ESSENTIAL_DIGNITY_SOURCE.modernOuterPlanets, 'label-only');
  assert.equal(ESSENTIAL_DIGNITY_SOURCE.exaltationDegrees, 'deferred');
  assert.equal(ESSENTIAL_DIGNITY_SOURCE.terms, 'deferred');
  assert.equal(ESSENTIAL_DIGNITY_SOURCE.decans, 'deferred');
  assert.equal(ESSENTIAL_DIGNITY_SOURCE.degreeRulers, 'deferred');
  assert.equal(ESSENTIAL_DIGNITY_SOURCE.vronskyTables, 'deferred-pending-manual-verification');
});

test('dignity types include basic Sprint 9 types only', () => {
  assert.deepEqual(ESSENTIAL_DIGNITY_TYPES, {
    DOMICILE: 'domicile',
    DETRIMENT: 'detriment',
    EXALTATION: 'exaltation',
    FALL: 'fall',
    MODERN_RULERSHIP: 'modernRulership',
  });
});

test('traditional planet list contains only the classical seven planets', () => {
  assert.deepEqual(TRADITIONAL_PLANET_KEYS, [
    'sun',
    'moon',
    'mercury',
    'venus',
    'mars',
    'jupiter',
    'saturn',
  ]);

  assert.equal(isTraditionalDignityPlanet('sun'), true);
  assert.equal(isTraditionalDignityPlanet('saturn'), true);
  assert.equal(isTraditionalDignityPlanet('uranus'), false);
  assert.equal(isTraditionalDignityPlanet(''), false);
});

test('modern outer planet list contains Uranus Neptune Pluto only', () => {
  assert.deepEqual(MODERN_OUTER_PLANET_KEYS, ['uranus', 'neptune', 'pluto']);

  assert.equal(isModernOuterPlanet('uranus'), true);
  assert.equal(isModernOuterPlanet('neptune'), true);
  assert.equal(isModernOuterPlanet('pluto'), true);
  assert.equal(isModernOuterPlanet('saturn'), false);
});

test('classical rulerships match the selected traditional source policy', () => {
  assert.deepEqual(CLASSICAL_RULERSHIPS, {
    sun: ['leo'],
    moon: ['cancer'],
    mercury: ['gemini', 'virgo'],
    venus: ['taurus', 'libra'],
    mars: ['aries', 'scorpio'],
    jupiter: ['sagittarius', 'pisces'],
    saturn: ['capricorn', 'aquarius'],
  });
});

test('detriments are opposite signs from classical rulerships', () => {
  assert.deepEqual(CLASSICAL_DETRIMENTS, {
    sun: ['aquarius'],
    moon: ['capricorn'],
    mercury: ['sagittarius', 'pisces'],
    venus: ['scorpio', 'aries'],
    mars: ['libra', 'taurus'],
    jupiter: ['gemini', 'virgo'],
    saturn: ['cancer', 'leo'],
  });

  for (const [planetKey, rulershipSigns] of Object.entries(CLASSICAL_RULERSHIPS)) {
    assert.deepEqual(
      CLASSICAL_DETRIMENTS[planetKey],
      rulershipSigns.map((signKey) => OPPOSITE_SIGNS[signKey]),
    );
  }
});

test('classical exaltations match the selected source policy', () => {
  assert.deepEqual(CLASSICAL_EXALTATIONS, {
    sun: ['aries'],
    moon: ['taurus'],
    mercury: ['virgo'],
    venus: ['pisces'],
    mars: ['capricorn'],
    jupiter: ['cancer'],
    saturn: ['libra'],
  });
});

test('falls are opposite signs from classical exaltations', () => {
  assert.deepEqual(CLASSICAL_FALLS, {
    sun: ['libra'],
    moon: ['scorpio'],
    mercury: ['pisces'],
    venus: ['virgo'],
    mars: ['cancer'],
    jupiter: ['capricorn'],
    saturn: ['aries'],
  });

  for (const [planetKey, exaltationSigns] of Object.entries(CLASSICAL_EXALTATIONS)) {
    assert.deepEqual(
      CLASSICAL_FALLS[planetKey],
      exaltationSigns.map((signKey) => OPPOSITE_SIGNS[signKey]),
    );
  }
});

test('outer planets are not present in classical scoring tables', () => {
  for (const planetKey of MODERN_OUTER_PLANET_KEYS) {
    assert.equal(Object.hasOwn(CLASSICAL_RULERSHIPS, planetKey), false);
    assert.equal(Object.hasOwn(CLASSICAL_DETRIMENTS, planetKey), false);
    assert.equal(Object.hasOwn(CLASSICAL_EXALTATIONS, planetKey), false);
    assert.equal(Object.hasOwn(CLASSICAL_FALLS, planetKey), false);
  }
});

test('modern rulership labels exist but remain label-only', () => {
  assert.deepEqual(MODERN_RULERSHIP_LABELS, {
    uranus: ['aquarius'],
    neptune: ['pisces'],
    pluto: ['scorpio'],
  });
  assert.equal(ESSENTIAL_DIGNITY_SCORE_MODEL.modernRulership, 0);
});

test('score model matches strategy', () => {
  assert.deepEqual(ESSENTIAL_DIGNITY_SCORE_MODEL, {
    domicile: 5,
    exaltation: 4,
    detriment: -5,
    fall: -4,
    neutral: 0,
    modernRulership: 0,
  });
});

test('deferred features include future source packs and unsupported modules', () => {
  assert.deepEqual(getDeferredDignityFeatures(), [
    'terms',
    'decans',
    'degreeRulers',
    'exactExaltationDegrees',
    'VronskyStrengthTables',
    'fixedStars',
    'houses',
    'ASC/MC',
    'transits',
    'interpretations',
    'ritualScoring',
  ]);
});

test('dataset shape combines source tables score model and deferred features', () => {
  const dataset = getEssentialDignityDataset();

  assert.equal(dataset.source, ESSENTIAL_DIGNITY_SOURCE);
  assert.equal(dataset.dignityTypes, ESSENTIAL_DIGNITY_TYPES);
  assert.equal(dataset.rulerships, CLASSICAL_RULERSHIPS);
  assert.equal(dataset.detriments, CLASSICAL_DETRIMENTS);
  assert.equal(dataset.exaltations, CLASSICAL_EXALTATIONS);
  assert.equal(dataset.falls, CLASSICAL_FALLS);
  assert.equal(dataset.modernRulershipLabels, MODERN_RULERSHIP_LABELS);
  assert.equal(dataset.scoreModel, ESSENTIAL_DIGNITY_SCORE_MODEL);
  assert.deepEqual(dataset.traditionalPlanets, TRADITIONAL_PLANET_KEYS);
  assert.deepEqual(dataset.modernOuterPlanets, MODERN_OUTER_PLANET_KEYS);
});

test('dataset is frozen and read-only at exported object boundaries', () => {
  const dataset = getEssentialDignityDataset();

  assert.equal(Object.isFrozen(dataset), true);
  assert.equal(Object.isFrozen(dataset.source), true);
  assert.equal(Object.isFrozen(dataset.traditionalPlanets), true);
  assert.equal(Object.isFrozen(dataset.modernOuterPlanets), true);
  assert.equal(Object.isFrozen(dataset.rulerships), true);
  assert.equal(Object.isFrozen(dataset.rulerships.sun), true);
  assert.equal(Object.isFrozen(dataset.scoreModel), true);
  assert.equal(Object.isFrozen(dataset.deferredFeatures), true);
});

test('dataset does not include excluded Sprint 10+ data or private profile data', () => {
  const datasetText = JSON.stringify(getEssentialDignityDataset());

  assert.equal(datasetText.includes('birthDate'), false);
  assert.equal(datasetText.includes('birthTime'), false);
  assert.equal(datasetText.includes('profile'), false);
  assert.equal(datasetText.includes('utcDateTime'), false);
  assert.equal(datasetText.includes('latitude'), false);
  assert.equal(datasetText.includes('longitude'), false);
  assert.equal(datasetText.includes('interpretationText'), false);
  assert.equal(datasetText.includes('exaltationDegreeValues'), false);
  assert.equal(datasetText.includes('exactDegrees'), false);
});

test('source module does not contain terms decans degree tables or interpretations', () => {
  const source = readFileSync(new URL('../src/essentialDignitiesData.js', import.meta.url), 'utf8');

  assert.equal(source.includes('astronomy-engine'), false);
  assert.equal(source.includes('luxon'), false);
  assert.equal(source.includes('profileStorage'), false);
  assert.equal(source.includes('localStorage'), false);
  assert.equal(source.includes('birthDate'), false);
  assert.equal(source.includes('birthTime'), false);
  assert.equal(source.includes('generate:ephemeris'), false);
});
