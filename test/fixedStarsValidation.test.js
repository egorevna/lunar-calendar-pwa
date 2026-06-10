import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

import {
  FIXED_STAR_RELATIONSHIP_POLICY,
  FIXED_STAR_VERIFICATION_STATUS,
  FIXED_STARS_ORB_POLICY,
  FIXED_STARS_SOURCE,
  FIXED_STARS_TARGET_POLICY,
  getActiveFixedStarRows,
  getCandidateFixedStarRows,
  getFixedStarsCatalogPolicy,
  isVerifiedFixedStarRow,
} from '../src/fixedStarsData.js';
import {
  calculateFixedStarPosition,
  calculateFixedStarPositions,
} from '../src/fixedStarPositions.js';
import {
  resolveFixedStarTargets,
} from '../src/fixedStarTargets.js';
import {
  calculateFixedStarConjunctions,
  isFixedStarConjunction,
} from '../src/fixedStarConjunctions.js';
import {
  EXPECTED_FIXED_STAR_ACTIVE_KEYS,
  EXPECTED_FIXED_STAR_DEFERRED_TARGET_SETS,
  EXPECTED_FIXED_STAR_NATAL_TARGET_KEYS,
  EXPECTED_FIXED_STAR_ANGLE_TARGET_KEYS,
  FIXED_STARS_VALIDATION_FIXTURES,
  VALIDATION_ASC_MC_RESULT,
  VALIDATION_NATAL_PLANETS_RESULT,
  getFixedStarsValidationFixture,
  getFixedStarsValidationFixtureCategories,
  getFixedStarsValidationFixtureIds,
} from './fixtures/fixedStarsValidationFixtures.js';

const EPSILON = 1e-9;

function assertApprox(actual, expected, tolerance = EPSILON) {
  assert.equal(Number.isFinite(actual), true);
  assert.equal(
    Math.abs(actual - expected) <= tolerance,
    true,
    `expected ${actual} to be within ${tolerance} of ${expected}`,
  );
}

function assertNoPrivateOrInterpretiveText(value) {
  const text = JSON.stringify(value).toLowerCase();

  for (const forbidden of [
    'birthdate',
    'birthtime',
    'utcdatetime',
    'raw timezone',
    'profilecoordinates',
    'birthcoordinates',
    'fullprofile',
    'profilejson',
    'providerpayload',
    'calculationarrays',
    'interpretationtext',
    'mythology',
    'prediction',
    'fatalistic',
    'karmic',
    'карм',
    'фатал',
    'судьб',
    'ритуал',
    'предсказ',
    'опасност',
    'слава',
  ]) {
    assert.equal(text.includes(forbidden), false, `output should not include ${forbidden}`);
  }
}

test('validation fixtures exist and expose required categories', () => {
  assert.equal(Array.isArray(FIXED_STARS_VALIDATION_FIXTURES), true);
  assert.equal(FIXED_STARS_VALIDATION_FIXTURES.length > 0, true);
  assert.equal(
    new Set(getFixedStarsValidationFixtureIds()).size,
    getFixedStarsValidationFixtureIds().length,
  );
  assert.equal(getFixedStarsValidationFixture('source-policy').id, 'source-policy');
  assert.equal(getFixedStarsValidationFixture('unknown-fixture'), null);

  for (const category of [
    'sourcePolicy',
    'catalogRows',
    'epochColumns',
    'positionPolicy',
    'targetPolicy',
    'orbPolicy',
    'conjunctionPolicy',
    'privacy',
    'strictExclusions',
  ]) {
    assert.equal(
      getFixedStarsValidationFixtureCategories().includes(category),
      true,
      `missing validation category ${category}`,
    );
  }
});

test('source policy and catalog policy match Sprint 14 decisions', () => {
  const fixture = getFixedStarsValidationFixture('source-policy');
  const catalogPolicy = getFixedStarsCatalogPolicy();

  assert.equal(FIXED_STARS_SOURCE.sourceSystem, fixture.expected.sourceSystem);
  assert.equal(FIXED_STARS_SOURCE.sourceKey, fixture.expected.sourceKey);
  assert.equal(FIXED_STARS_SOURCE.label.includes('Вронский'), true);
  assert.equal(FIXED_STARS_SOURCE.label.includes('Таблица 18'), true);
  assert.deepEqual(FIXED_STARS_SOURCE.coordinateColumns, ['1950', '1970', '1990']);
  assert.equal(FIXED_STARS_SOURCE.initialReferenceEpoch, 1990);
  assert.equal(FIXED_STARS_SOURCE.noOcrImport, true);
  assert.equal(FIXED_STARS_SOURCE.noRowsFromMemory, true);
  assert.equal(catalogPolicy.noOcrImport, true);
  assert.equal(catalogPolicy.noRowsFromMemory, true);
  assert.equal(catalogPolicy.initialReferenceEpoch, 1990);
  assert.equal(catalogPolicy.activeRowCount, EXPECTED_FIXED_STAR_ACTIVE_KEYS.length);
});

test('active catalog rows are exactly the manually verified source-tracked rows', () => {
  const activeRows = getActiveFixedStarRows();

  assert.equal(activeRows.length, 13);
  assert.deepEqual(activeRows.map((row) => row.key), EXPECTED_FIXED_STAR_ACTIVE_KEYS);
  assert.equal(getCandidateFixedStarRows().length, 0);

  for (const row of activeRows) {
    assert.equal(row.active, true);
    assert.equal(row.verificationStatus, FIXED_STAR_VERIFICATION_STATUS.VERIFIED);
    assert.equal(isVerifiedFixedStarRow(row), true);
    assert.equal(row.sourceSystem, 'fixed-stars-vronsky-table-18');
    assert.equal(row.validationStatus, 'manual-source-verified');
    assert.equal(row.interpretation, false);
    assert.equal(row.initialReferenceEpoch, 1990);
    assert.equal(typeof row.labelRu, 'string');
    assert.equal(row.labelRu.length > 0, true);
    assert.equal(typeof row.labelEn, 'string');
    assert.equal(row.labelEn.length > 0, true);
    assert.equal(typeof row.designation, 'string');
    assert.equal(row.designation.length > 0, true);
    assert.equal(row.sourceRow.manualVerification, true);
    assert.equal(row.sourceRow.noOcrImport, true);
    assert.equal(row.sourceRow.noRowsFromMemory, true);
  }

  assert.equal(
    activeRows.some((row) => row.active === true && row.verificationStatus !== 'verified'),
    false,
  );
});

test('every active row preserves verified 1950 1970 and 1990 coordinates', () => {
  for (const row of getActiveFixedStarRows()) {
    for (const [epochKey, epoch] of [
      ['epoch1950', 1950],
      ['epoch1970', 1970],
      ['epoch1990', 1990],
    ]) {
      const coordinate = row.coordinates[epochKey];

      assert.equal(coordinate.epoch, epoch);
      assert.equal(typeof coordinate.sign, 'string');
      assert.equal(typeof coordinate.signRu, 'string');
      assert.equal(Number.isInteger(coordinate.degree), true);
      assert.equal(Number.isInteger(coordinate.minutes), true);
      assert.equal(Number.isInteger(coordinate.seconds), true);
      assert.equal(Number.isFinite(coordinate.longitude), true);
      assert.equal(coordinate.longitude >= 0 && coordinate.longitude < 360, true);
      assert.equal(coordinate.verified, true);
    }
  }
});

test('exact source epochs preserve source columns and no hidden epoch is used', () => {
  for (const row of getActiveFixedStarRows()) {
    for (const [epochKey, epoch] of [
      ['epoch1950', 1950],
      ['epoch1970', 1970],
      ['epoch1990', 1990],
    ]) {
      const result = calculateFixedStarPosition({ starRow: row, epochYear: epoch });

      assert.equal(result.status, 'ready');
      assert.equal(result.requestedEpochYear, epoch);
      assert.equal(result.positionEpochPolicy, 'vronsky-linear-epoch-interpolation');
      assert.equal(result.exactSourceEpoch, epoch);
      assert.equal(result.interpolated, false);
      assert.equal(result.extrapolated, false);
      assert.equal(result.interpolationSource, null);
      assert.equal(result.extrapolationSource, null);
      assertApprox(result.longitude, row.coordinates[epochKey].longitude);
    }
  }
});

test('interpolation extrapolation flags and batch positions are explicit', () => {
  for (const check of getFixedStarsValidationFixture('position-policy').expected.positionChecks) {
    const result = calculateFixedStarPosition(check.input);

    assert.equal(result.status, 'ready');
    assert.equal(result.interpolated, check.expected.interpolated);
    assert.equal(result.extrapolated, check.expected.extrapolated);
    assert.equal(result.interpolationSource, check.expected.interpolationSource);
    assert.equal(result.extrapolationSource, check.expected.extrapolationSource);
    assert.equal(result.exactSourceEpoch, check.expected.exactSourceEpoch);
  }

  const batch = calculateFixedStarPositions({ epochYear: 1980 });

  assert.equal(batch.status, 'ready');
  assert.equal(batch.total, 13);
  assert.equal(batch.readyCount, 13);
  assert.deepEqual(batch.positions.map((position) => position.key), EXPECTED_FIXED_STAR_ACTIVE_KEYS);
  assert.equal(batch.positionEpochPolicy, 'vronsky-linear-epoch-interpolation');
});

test('target policy resolves only natal planets and angles while deferred targets remain metadata only', () => {
  assert.deepEqual(FIXED_STARS_TARGET_POLICY.activeTargetSet, ['natal-planets', 'angles']);
  assert.deepEqual(
    FIXED_STARS_TARGET_POLICY.activeTargets,
    [...EXPECTED_FIXED_STAR_NATAL_TARGET_KEYS, ...EXPECTED_FIXED_STAR_ANGLE_TARGET_KEYS],
  );
  assert.deepEqual(FIXED_STARS_TARGET_POLICY.deferredTargetSets, EXPECTED_FIXED_STAR_DEFERRED_TARGET_SETS);

  const result = resolveFixedStarTargets({
    natalPlanetsResult: VALIDATION_NATAL_PLANETS_RESULT,
    ascMcResult: VALIDATION_ASC_MC_RESULT,
  });
  const keys = result.targets.map((target) => target.key);

  assert.equal(result.status, 'ready');
  assert.equal(result.total, 14);
  assert.deepEqual(keys, [...EXPECTED_FIXED_STAR_NATAL_TARGET_KEYS, ...EXPECTED_FIXED_STAR_ANGLE_TARGET_KEYS]);

  for (const deferred of EXPECTED_FIXED_STAR_DEFERRED_TARGET_SETS) {
    assert.equal(result.deferredTargetSets.includes(deferred), true);
    assert.equal(keys.includes(deferred), false);
  }
});

test('orb and conjunction policy enforce conjunction only with inclusive one-degree boundary', () => {
  assert.equal(FIXED_STARS_ORB_POLICY.key, 'fixed-stars-global-conjunction-orb-1deg');
  assert.equal(FIXED_STARS_ORB_POLICY.globalOrbDegrees, 1);
  assert.equal(FIXED_STARS_ORB_POLICY.hiddenOrb, false);
  assert.deepEqual(FIXED_STAR_RELATIONSHIP_POLICY.activeRelationships, ['conjunction']);

  for (const deferred of ['opposition', 'square', 'trine', 'sextile', 'paran']) {
    assert.equal(FIXED_STAR_RELATIONSHIP_POLICY.deferredRelationships.includes(deferred), true);
  }

  for (const check of getFixedStarsValidationFixture('conjunction-policy').expected.boundaryChecks) {
    const result = isFixedStarConjunction(check.starLongitude, check.targetLongitude);

    assert.equal(result.status, 'ready');
    assert.equal(result.hit, check.hit);
    assert.equal(result.relationship, 'conjunction');
    assert.equal(result.boundary, check.boundary);
  }
});

test('conjunction batch preserves sorting noHits partial and notReady behavior', () => {
  const sorting = calculateFixedStarConjunctions(
    getFixedStarsValidationFixture('conjunction-sorting').input,
  );
  const noHits = calculateFixedStarConjunctions(
    getFixedStarsValidationFixture('conjunction-no-hits').input,
  );
  const partial = calculateFixedStarConjunctions(
    getFixedStarsValidationFixture('conjunction-partial-targets').input,
  );
  const notReady = calculateFixedStarConjunctions(
    getFixedStarsValidationFixture('conjunction-not-ready').input,
  );

  assert.deepEqual(
    sorting.hits.map((hit) => [hit.starKey, hit.targetKey]),
    getFixedStarsValidationFixture('conjunction-sorting').expected.order,
  );
  assert.equal(sorting.hits.every((hit) => hit.relationship === 'conjunction'), true);
  assert.equal(noHits.status, 'ready');
  assert.equal(noHits.hitCount, 0);
  assert.deepEqual(noHits.hits, []);
  assert.equal(partial.status, 'ready');
  assert.equal(partial.partial, true);
  assert.equal(partial.targetSets.includes('angles'), true);
  assert.equal(notReady.status, 'notReady');
  assert.deepEqual(notReady.hits, []);
});

test('validation outputs contain no private profile data provider payloads or interpretations', () => {
  const positions = calculateFixedStarPositions({ epochYear: 1980 });
  const targets = resolveFixedStarTargets({
    natalPlanetsResult: VALIDATION_NATAL_PLANETS_RESULT,
    ascMcResult: VALIDATION_ASC_MC_RESULT,
  });
  const conjunctions = calculateFixedStarConjunctions({
    positionsResult: getFixedStarsValidationFixture('conjunction-sorting').input.positionsResult,
    targetsResult: getFixedStarsValidationFixture('conjunction-sorting').input.targetsResult,
  });

  assertNoPrivateOrInterpretiveText(positions);
  assertNoPrivateOrInterpretiveText(targets);
  assertNoPrivateOrInterpretiveText(conjunctions);
  assertNoPrivateOrInterpretiveText(FIXED_STARS_VALIDATION_FIXTURES);
});

test('fixed star modules keep runtime and file boundaries', () => {
  const modulePaths = [
    '../src/fixedStarsData.js',
    '../src/fixedStarPositions.js',
    '../src/fixedStarTargets.js',
    '../src/fixedStarConjunctions.js',
  ];

  for (const modulePath of modulePaths) {
    const source = readFileSync(new URL(modulePath, import.meta.url), 'utf8');

    for (const forbidden of [
      "from 'swisseph'",
      'from "swisseph"',
      "require('swisseph')",
      'require("swisseph")',
      'astronomy-engine',
      'document.',
      'window.',
      'localStorage',
      'fixedStarsDisplay',
      'debugPanel',
      'renderFixedStars',
    ]) {
      assert.equal(source.includes(forbidden), false, `${modulePath} should not include ${forbidden}`);
    }
  }

  assert.equal(existsSync(new URL('../src/fixedStars.js', import.meta.url)), false);
  assert.equal(existsSync(new URL('../src/houses.js', import.meta.url)), false);
  assert.equal(existsSync(new URL('../src/houseSystems.js', import.meta.url)), false);
});
