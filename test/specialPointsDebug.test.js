import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

import { getSpecialPointsDebugState } from '../src/specialPointsDebug.js';

const MODULE_PATH = path.resolve('src/specialPointsDebug.js');

function validProfile(overrides = {}) {
  return {
    id: 'profile-public-fixture',
    name: 'Тест',
    birthDate: '1990-05-12',
    birthTime: '14:30',
    birthTimeAccuracy: 'exact',
    birthPlace: {
      city: 'Москва',
      country: 'Россия',
      coordinates: {
        latitude: 55.7558,
        longitude: 37.6173,
      },
      timezone: 'Europe/Moscow',
    },
    currentPlace: {
      mode: 'moscow',
      city: 'Москва',
      country: 'Россия',
      timezone: 'Europe/Moscow',
    },
    houseSystem: 'placidus',
    zodiac: 'tropical',
    ...overrides,
  };
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function assertSafeDebugOutput(value) {
  const text = JSON.stringify(value);
  const forbidden = [
    'birthDate',
    'birthTime',
    'utcDateTime',
    'Europe/Moscow',
    'birthPlace',
    'currentPlace',
    'latitude',
    'longitude',
    'coordinates',
    'providerPayload: {',
    'providerPayload":{"',
    'fullProfileJson: {',
    'fullProfileJson":{"',
    'profiles: [',
    'points: [',
    'assignments: [',
    'cusps: [',
    'nodes: {',
    'lilith: {',
    'selena: {',
    'NaN',
    'undefined',
    'карми',
    'фаталь',
    'ангел',
    'судьб',
    'ритуал',
  ];

  for (const term of forbidden) {
    assert.equal(text.includes(term), false, `debug output must not include ${term}`);
  }

  assert.equal(/\b\d{1,3}\.\d{4,}\b/.test(text), false, 'debug output must not include raw decimal longitudes');
}

test('getSpecialPointsDebugState returns safe section name', () => {
  const result = getSpecialPointsDebugState(null);

  assert.equal(result.section, 'Special Points UI Debug');
  assert.equal(result.enabled, true);
});

test('ready profile returns ready status and safe profile identity', () => {
  const result = getSpecialPointsDebugState(validProfile(), { collapsedState: false });

  assert.equal(result.panelStatus, 'ready');
  assert.deepEqual(result.activeProfile, {
    hasProfile: true,
    id: 'profile-public-fixture',
    name: 'Тест',
  });
  assert.equal(result.userFacingBlock, true);
  assert.equal(result.location, 'My Cards');
  assert.equal(result.collapsedDefault, true);
  assert.equal(result.collapsedState, false);
});

test('no profile returns safe notReady fallback', () => {
  const result = getSpecialPointsDebugState(null);

  assert.equal(result.panelStatus, 'notReady');
  assert.deepEqual(result.activeProfile, {
    hasProfile: false,
    id: null,
    name: null,
  });
  assert.equal(result.readiness.hasExactBirthTime, false);
  assert.equal(result.readiness.hasBirthTimezone, false);
  assert.equal(result.readiness.specialPointsReady, false);
  assert.equal(result.counts.points, 0);
  assert.equal(result.counts.nodeAssignments, 0);
  assert.equal(result.counts.sectionsReady, 0);
  assertSafeDebugOutput(result);
});

test('general common day returns safe fallback', () => {
  const result = getSpecialPointsDebugState(undefined, { collapsedState: true });

  assert.equal(result.panelStatus, 'notReady');
  assert.equal(result.activeProfile.hasProfile, false);
  assert.equal(result.collapsedState, true);
  assertSafeDebugOutput(result);
});

test('ready profile exposes readiness booleans without raw data', () => {
  const result = getSpecialPointsDebugState(validProfile());

  assert.equal(result.readiness.hasExactBirthTime, true);
  assert.equal(result.readiness.hasBirthTimezone, true);
  assert.equal(result.readiness.lunarNodesReady, true);
  assert.equal(result.readiness.lunarNodesHouseAssignmentReady, true);
  assert.equal(result.readiness.lilithReady, true);
  assert.equal(result.readiness.selenaReady, true);
  assert.equal(result.readiness.specialPointsReady, true);
  assertSafeDebugOutput(result);
});

test('sources include active systems and deferred statuses', () => {
  const result = getSpecialPointsDebugState(validProfile());

  assert.equal(result.sources.lunarNodes.active, true);
  assert.equal(result.sources.lunarNodes.sourceSystem, 'mean-lunar-node');
  assert.equal(result.sources.lunarNodes.trueNodeStatus, 'deferred');
  assert.equal(result.sources.lilith.active, true);
  assert.equal(result.sources.lilith.sourceSystem, 'mean-black-moon-lilith');
  assert.deepEqual(result.sources.lilith.deferredVariants, [
    'true-lilith',
    'osculating-black-moon-lilith',
    'interpolated-lilith',
  ]);
  assert.equal(result.sources.selena.active, true);
  assert.equal(result.sources.selena.sourceSystem, 'selena-white-moon');
  assert.equal(result.sources.selena.pointType, 'fictitious-calculated-point');
  assert.deepEqual(result.sources.selena.alternateSourceSystems, []);
});

test('counts include ready points and node assignments', () => {
  const result = getSpecialPointsDebugState(validProfile());

  assert.equal(result.counts.points, 4);
  assert.equal(result.counts.nodeAssignments, 2);
  assert.equal(result.counts.sectionsReady, 3);
});

test('capabilities mark active and deferred special point features', () => {
  const result = getSpecialPointsDebugState(validProfile());

  assert.equal(result.capabilities.specialPoints, true);
  assert.equal(result.capabilities.lunarNodes, true);
  assert.equal(result.capabilities.meanNode, true);
  assert.equal(result.capabilities.trueNode, false);
  assert.equal(result.capabilities.lilith, true);
  assert.equal(result.capabilities.meanLilith, true);
  assert.equal(result.capabilities.trueLilith, false);
  assert.equal(result.capabilities.osculatingLilith, false);
  assert.equal(result.capabilities.selena, true);
  assert.equal(result.capabilities.fixedStars, false);
  assert.equal(result.capabilities.transits, false);
  assert.equal(result.capabilities.interpretations, false);
  assert.equal(result.capabilities.ritualScoring, false);
});

test('privacy flags are false for raw data exposure', () => {
  const result = getSpecialPointsDebugState(validProfile());

  assert.deepEqual(result.privacy, {
    rawBirthDataExposed: false,
    rawCoordinatesExposed: false,
    rawTimezoneExposed: false,
    rawUtcExposed: false,
    rawLongitudesExposed: false,
    fullProfileJsonExposed: false,
    providerPayloadExposed: false,
  });
});

test('missing timezone returns notReady readiness without exposing raw timezone value', () => {
  const profile = validProfile({
    birthPlace: {
      city: 'Москва',
      country: 'Россия',
      coordinates: {
        latitude: 55.7558,
        longitude: 37.6173,
      },
      timezone: '',
    },
  });
  const result = getSpecialPointsDebugState(profile);

  assert.equal(result.panelStatus, 'notReady');
  assert.equal(result.readiness.hasExactBirthTime, true);
  assert.equal(result.readiness.hasBirthTimezone, false);
  assert.equal(result.readiness.specialPointsReady, false);
  assertSafeDebugOutput(result);
});

test('debug helper does not mutate profile', () => {
  const profile = validProfile();
  const before = clone(profile);

  getSpecialPointsDebugState(profile);

  assert.deepEqual(profile, before);
});

test('debug helper does not import provider, DOM, native astronomy or swisseph modules', async () => {
  const source = await readFile(MODULE_PATH, 'utf8');
  const forbidden = [
    'planetaryProvider',
    'providerCalculations',
    'astronomy-engine',
    'swisseph',
    'document.',
    'window.',
    'localStorage',
  ];

  for (const term of forbidden) {
    assert.equal(source.includes(term), false, `module source must not include ${term}`);
  }
});

test('src/houses.js and src/houseSystems.js are not created', () => {
  assert.equal(existsSync(path.resolve('src/houses.js')), false);
  assert.equal(existsSync(path.resolve('src/houseSystems.js')), false);
});
