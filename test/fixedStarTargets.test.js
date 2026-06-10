import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

import {
  getFixedStarTargetByKey,
  getFixedStarTargetCapabilities,
  getFixedStarTargetLimitations,
  getFixedStarTargetSummary,
  normalizeFixedStarTarget,
  resolveAngleTargets,
  resolveFixedStarTargets,
  resolveFixedStarTargetsForProfile,
  resolveNatalPlanetTargets,
  validateFixedStarTarget,
} from '../src/fixedStarTargets.js';
import {
  getFixedStarTargetsFixture,
  SYNTHETIC_ASC_MC_RESULT,
  SYNTHETIC_NATAL_PLANETS_RESULT,
} from './fixtures/fixedStarTargetsFixtures.js';

const READY_PROFILE = Object.freeze({
  id: 'fixed-star-target-profile',
  name: 'Анна',
  birthDate: '1990-01-01',
  birthTime: '12:00',
  birthTimeAccuracy: 'exact',
  birthPlace: {
    city: 'Москва',
    country: 'Россия',
    latitude: 55.7558,
    longitude: 37.6173,
    timezone: 'Europe/Moscow',
  },
  currentPlace: {
    mode: 'moscow',
    city: 'Москва',
    country: 'Россия',
    timezone: 'Europe/Moscow',
  },
  houseSystem: 'wholeSign',
  zodiac: 'tropical',
});

function assertNoPrivateOrInterpretiveText(value) {
  const text = JSON.stringify(value).toLowerCase();

  for (const forbidden of [
    'birthdate',
    'birthtime',
    'birthplace',
    'utcdatetime',
    'profilecoordinates',
    'birthcoordinates',
    'fullprofile',
    'profilejson',
    'providerpayload',
    'interpretationtext',
    'mythology',
    'prediction',
    'fatalistic',
    'karmic',
    'фаталь',
    'карми',
    'судьб',
    'ритуал',
  ]) {
    assert.equal(text.includes(forbidden), false, `output should not include ${forbidden}`);
  }
}

test('normalizeFixedStarTarget normalizes valid planet target', () => {
  const target = normalizeFixedStarTarget({
    key: 'venus',
    label: 'Венера',
    longitude: 92.25,
  });

  assert.equal(target.key, 'venus');
  assert.equal(target.label, 'Венера');
  assert.equal(target.labelEn, 'Venus');
  assert.equal(target.category, 'natal-planet');
  assert.equal(target.targetSet, 'natal-planets');
  assert.equal(target.longitude, 92.25);
  assert.equal(target.sign.key, 'cancer');
  assert.equal(target.degree, 2);
  assert.equal(target.minutes, 15);
  assert.equal(target.seconds, 0);
  assert.equal(target.text, 'Венера — Рак 02°15′00″');
  assert.equal(target.source, 'natal-planets');
});

test('normalizeFixedStarTarget normalizes valid angle target', () => {
  const target = normalizeFixedStarTarget(SYNTHETIC_ASC_MC_RESULT.angles.asc);

  assert.equal(target.key, 'asc');
  assert.equal(target.label, 'ASC');
  assert.equal(target.labelEn, 'Ascendant');
  assert.equal(target.category, 'angle');
  assert.equal(target.targetSet, 'angles');
  assert.equal(target.sign.key, 'aquarius');
  assert.equal(target.degree, 14);
  assert.equal(target.minutes, 47);
  assert.equal(target.seconds, 29);
  assert.equal(target.text, 'ASC — Водолей 14°47′29″');
  assert.equal(target.source, 'asc-mc');
});

test('invalid target returns null', () => {
  const fixture = getFixedStarTargetsFixture('invalid-target-missing-longitude');

  assert.equal(normalizeFixedStarTarget(fixture.input.target), null);
  assert.equal(normalizeFixedStarTarget({ key: 'house-cusp-1', longitude: 10 }), null);
  assert.equal(normalizeFixedStarTarget({ key: 'sun', longitude: Number.NaN }), null);
});

test('resolveNatalPlanetTargets returns 10 canonical targets', () => {
  const fixture = getFixedStarTargetsFixture('natal-planets-ready');
  const result = resolveNatalPlanetTargets(fixture.input.natalPlanetsResult);

  assert.equal(result.status, fixture.expected.status);
  assert.equal(result.ready, true);
  assert.equal(result.targetSet, fixture.expected.targetSet);
  assert.equal(result.category, fixture.expected.category);
  assert.equal(result.count, fixture.expected.count);
  assert.deepEqual(result.targets.map((target) => target.key), fixture.expected.order);
  assert.equal(result.targets.every((target) => target.category === 'natal-planet'), true);
});

test('resolveAngleTargets returns ASC MC DSC IC in policy order', () => {
  const fixture = getFixedStarTargetsFixture('angles-ready');
  const result = resolveAngleTargets(fixture.input.ascMcResult);

  assert.equal(result.status, fixture.expected.status);
  assert.equal(result.ready, true);
  assert.equal(result.targetSet, fixture.expected.targetSet);
  assert.equal(result.category, fixture.expected.category);
  assert.equal(result.count, fixture.expected.count);
  assert.deepEqual(result.targets.map((target) => target.key), fixture.expected.order);
  assert.equal(result.targets.every((target) => target.category === 'angle'), true);
});

test('resolveFixedStarTargets combines planets and angles into 14 targets', () => {
  const fixture = getFixedStarTargetsFixture('combined-ready');
  const result = resolveFixedStarTargets(fixture.input);

  assert.equal(result.status, fixture.expected.status);
  assert.equal(result.ready, true);
  assert.equal(result.total, fixture.expected.total);
  assert.equal(result.readyCount, fixture.expected.total);
  assert.equal(result.invalidCount, 0);
  assert.deepEqual(result.targetSets, ['natal-planets', 'angles']);
  assert.deepEqual(result.targets.map((target) => target.key), fixture.expected.order);
});

test('partial state includes ready planets and missing angles metadata', () => {
  const fixture = getFixedStarTargetsFixture('partial-planets-ready-angles-missing');
  const result = resolveFixedStarTargets(fixture.input);

  assert.equal(result.status, fixture.expected.status);
  assert.equal(result.ready, true);
  assert.equal(result.total, fixture.expected.total);
  assert.equal(result.readyCount, fixture.expected.readyCount);
  assert.deepEqual(result.targetSets, ['natal-planets']);
  assert.equal(result.missingTargetSets.some((item) =>
    item.targetSet === fixture.expected.missingTargetSet
    && item.reason === fixture.expected.missingReason), true);
  assert.equal(result.targets.some((target) => target.category === 'angle'), false);
});

test('notReady state is safe when neither active target set is ready', () => {
  const fixture = getFixedStarTargetsFixture('not-ready-empty');
  const result = resolveFixedStarTargets(fixture.input);

  assert.equal(result.status, fixture.expected.status);
  assert.equal(result.ready, false);
  assert.equal(result.reason, fixture.expected.reason);
  assert.equal(result.total, fixture.expected.total);
  assert.deepEqual(result.targets, []);
  assert.equal(result.missingTargetSets.length, 2);
});

test('deferred target sets are metadata only and not included as targets', () => {
  const result = resolveFixedStarTargets({
    natalPlanetsResult: SYNTHETIC_NATAL_PLANETS_RESULT,
    ascMcResult: SYNTHETIC_ASC_MC_RESULT,
  });
  const keys = result.targets.map((target) => target.key);

  for (const targetSet of [
    'house-cusps',
    'lunar-nodes',
    'lilith',
    'selena',
    'pars-fortuna',
    'lot-of-spirit',
    'arabic-parts',
    'custom-points',
  ]) {
    assert.equal(result.deferredTargetSets.includes(targetSet), true);
    assert.equal(keys.includes(targetSet), false);
  }
});

test('profile helper returns notReady for missing profile and unknown birth time', () => {
  const noProfile = resolveFixedStarTargetsForProfile(null);
  const unknownTime = resolveFixedStarTargetsForProfile({
    ...READY_PROFILE,
    birthTime: '',
    birthTimeAccuracy: 'unknown',
  });

  assert.equal(noProfile.status, 'notReady');
  assert.equal(noProfile.ready, false);
  assert.equal(unknownTime.status, 'notReady');
  assert.equal(unknownTime.ready, false);
  assertNoPrivateOrInterpretiveText(noProfile);
  assertNoPrivateOrInterpretiveText(unknownTime);
});

test('profile helper returns partial when planets are ready and coordinates block angles', () => {
  const profile = {
    ...READY_PROFILE,
    birthPlace: {
      ...READY_PROFILE.birthPlace,
      latitude: null,
      longitude: null,
    },
  };
  const result = resolveFixedStarTargetsForProfile(profile);

  assert.equal(result.status, 'partial');
  assert.equal(result.ready, true);
  assert.equal(result.targetSets.includes('natal-planets'), true);
  assert.equal(result.targetSets.includes('angles'), false);
  assert.equal(result.targets.length, 10);
  assert.equal(result.missingTargetSets.some((item) => item.targetSet === 'angles'), true);
  assertNoPrivateOrInterpretiveText(result);
});

test('profile helper returns ready for exact birth time and coordinates without mutating profile', () => {
  const profile = JSON.parse(JSON.stringify(READY_PROFILE));
  const before = JSON.parse(JSON.stringify(profile));
  const result = resolveFixedStarTargetsForProfile(profile);

  assert.equal(result.status, 'ready');
  assert.equal(result.ready, true);
  assert.equal(result.total, 14);
  assert.deepEqual(profile, before);
  assertNoPrivateOrInterpretiveText(result);
});

test('lookup validation and summary helpers work safely', () => {
  const result = resolveFixedStarTargets({
    natalPlanetsResult: SYNTHETIC_NATAL_PLANETS_RESULT,
    ascMcResult: SYNTHETIC_ASC_MC_RESULT,
  });
  const venus = getFixedStarTargetByKey(result, 'venus');

  assert.equal(venus.key, 'venus');
  assert.equal(getFixedStarTargetByKey(result, 'house-cusp-1'), null);
  assert.deepEqual(validateFixedStarTarget(venus), {
    status: 'ready',
    valid: true,
    reasons: [],
  });
  assert.deepEqual(validateFixedStarTarget({ ...venus, longitude: Number.NaN }), {
    status: 'invalid',
    valid: false,
    reasons: ['invalidLongitude'],
  });
  assert.deepEqual(getFixedStarTargetSummary(result), {
    status: 'ready',
    total: 14,
    ready: 14,
    targetSets: ['natal-planets', 'angles'],
    text: '14 целей для неподвижных звезд готовы',
  });
  assert.deepEqual(getFixedStarTargetSummary(resolveFixedStarTargets({
    natalPlanetsResult: SYNTHETIC_NATAL_PLANETS_RESULT,
    ascMcResult: { status: 'notReady', reason: 'cityWithoutCoordinates' },
  })), {
    status: 'partial',
    total: 10,
    ready: 10,
    targetSets: ['natal-planets'],
    text: '10 целей для неподвижных звезд готовы частично',
  });
  assert.deepEqual(getFixedStarTargetSummary(null), {
    status: 'notReady',
    total: 0,
    ready: 0,
    targetSets: [],
    text: 'Цели для неподвижных звезд недоступны',
  });
});

test('capabilities and limitations keep target resolver scoped', () => {
  assert.deepEqual(getFixedStarTargetCapabilities(), {
    fixedStarTargets: true,
    natalPlanets: true,
    angles: true,
    houseCusps: false,
    lunarNodes: false,
    lilith: false,
    selena: false,
    arabicParts: false,
    conjunctionEngine: false,
    interpretations: false,
    transits: false,
  });
  assert.equal(
    getFixedStarTargetLimitations().includes('Этот модуль не рассчитывает соединения с неподвижными звездами.'),
    true,
  );
});

test('target resolver output contains no private profile data provider payload or interpretations', () => {
  assertNoPrivateOrInterpretiveText(resolveFixedStarTargets({
    natalPlanetsResult: SYNTHETIC_NATAL_PLANETS_RESULT,
    ascMcResult: SYNTHETIC_ASC_MC_RESULT,
  }));
  assertNoPrivateOrInterpretiveText(getFixedStarTargetLimitations());
});

test('module does not import fixed star positions swisseph astronomy-engine DOM storage or conjunction engines', () => {
  const source = readFileSync(new URL('../src/fixedStarTargets.js', import.meta.url), 'utf8');

  for (const forbidden of [
    'fixedStarPositions',
    'from "swisseph"',
    "from 'swisseph'",
    'require("swisseph")',
    "require('swisseph')",
    'astronomy-engine',
    'astronomyEngineProvider',
    'planetaryProvider',
    'document.',
    'window.',
    'localStorage',
    'calculateFixedStarPosition',
    'calculateFixedStarPositions',
    'calculateConjunction',
    'detectAspect',
    'getAspectBetween',
    'renderFixedStars',
    'debugPanel',
  ]) {
    assert.equal(source.includes(forbidden), false, `module should not include ${forbidden}`);
  }
});

test('src/fixedStars.js is not created', () => {
  assert.equal(existsSync(new URL('../src/fixedStars.js', import.meta.url)), false);
});
