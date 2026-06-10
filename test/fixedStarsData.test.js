import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

import {
  FIXED_STAR_RELATIONSHIP_POLICY,
  FIXED_STAR_VERIFICATION_STATUS,
  FIXED_STARS_CATALOG_ROWS,
  FIXED_STARS_ORB_POLICY,
  FIXED_STARS_SOURCE,
  FIXED_STARS_TARGET_POLICY,
  getActiveFixedStarRows,
  getCandidateFixedStarRows,
  getFixedStarRowByKey,
  getFixedStarsCatalog,
  getFixedStarsCatalogPolicy,
  getFixedStarsDataCapabilities,
  getFixedStarsDataLimitations,
  getFixedStarsDeferredReasons,
  isVerifiedFixedStarRow,
} from '../src/fixedStarsData.js';

const ACTIVE_KEYS = [
  'algol',
  'aldebaran',
  'rigel',
  'betelgeuse',
  'sirius',
  'canopus',
  'regulus',
  'spica',
  'arcturus',
  'antares',
  'vega',
  'altair',
  'fomalhaut',
];

const DEFERRED_TARGETS = [
  'house-cusps',
  'lunar-nodes',
  'lilith',
  'selena',
  'pars-fortuna',
  'lot-of-spirit',
  'arabic-parts',
  'custom-points',
];

const DEFERRED_RELATIONSHIPS = [
  'opposition',
  'square',
  'trine',
  'sextile',
  'paran',
  'heliacal-rising',
  'heliacal-setting',
];

function assertNoPrivateOrInterpretiveText(value) {
  const text = JSON.stringify(value).toLowerCase();

  for (const forbidden of [
    'birthdate',
    'birthtime',
    'utcdatetime',
    'birthplace',
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
    'danger',
    'destiny',
    'fame',
    'фаталь',
    'карми',
    'судьб',
    'ритуал',
  ]) {
    assert.equal(text.includes(forbidden), false, `dataset should not include ${forbidden}`);
  }
}

test('fixed stars source metadata exists and preserves Vronsky source boundaries', () => {
  assert.equal(FIXED_STARS_SOURCE.sourceKey, 'vronsky-table-18-fixed-stars');
  assert.equal(FIXED_STARS_SOURCE.sourceSystem, 'fixed-stars-vronsky-table-18');
  assert.equal(FIXED_STARS_SOURCE.label, 'Вронский, Таблица 18 — Неподвижные звезды');
  assert.equal(FIXED_STARS_SOURCE.sourceType, 'primary-astrology-source');
  assert.equal(
    FIXED_STARS_SOURCE.validationPolicy,
    'vronsky-primary-with-swiss-modern-validation',
  );
  assert.deepEqual(FIXED_STARS_SOURCE.coordinateColumns, ['1950', '1970', '1990']);
  assert.equal(FIXED_STARS_SOURCE.initialReferenceEpoch, 1990);
  assert.equal(FIXED_STARS_SOURCE.noOcrImport, true);
  assert.equal(FIXED_STARS_SOURCE.noRowsFromMemory, true);
});

test('orb policy is explicit global conjunction orb 1 degree', () => {
  assert.equal(FIXED_STARS_ORB_POLICY.key, 'fixed-stars-global-conjunction-orb-1deg');
  assert.equal(FIXED_STARS_ORB_POLICY.relationship, 'conjunction');
  assert.equal(FIXED_STARS_ORB_POLICY.globalOrbDegrees, 1);
  assert.equal(FIXED_STARS_ORB_POLICY.perStarOverrides, false);
  assert.equal(FIXED_STARS_ORB_POLICY.perTargetOverrides, false);
  assert.equal(FIXED_STARS_ORB_POLICY.hiddenOrb, false);
});

test('relationship policy is conjunction only with deferred non-conjunction relationships', () => {
  assert.deepEqual(FIXED_STAR_RELATIONSHIP_POLICY.activeRelationships, ['conjunction']);

  for (const relationship of DEFERRED_RELATIONSHIPS) {
    assert.equal(
      FIXED_STAR_RELATIONSHIP_POLICY.deferredRelationships.includes(relationship),
      true,
      `missing deferred relationship ${relationship}`,
    );
  }
});

test('target policy includes natal planets and angles and defers other point sets', () => {
  assert.deepEqual(FIXED_STARS_TARGET_POLICY.activeTargetSet, ['natal-planets', 'angles']);

  for (const target of [
    'sun',
    'moon',
    'mercury',
    'venus',
    'mars',
    'jupiter',
    'saturn',
    'uranus',
    'neptune',
    'pluto',
    'asc',
    'mc',
    'dsc',
    'ic',
  ]) {
    assert.equal(FIXED_STARS_TARGET_POLICY.activeTargets.includes(target), true);
  }

  for (const targetSet of DEFERRED_TARGETS) {
    assert.equal(
      FIXED_STARS_TARGET_POLICY.deferredTargetSets.includes(targetSet),
      true,
      `missing deferred target set ${targetSet}`,
    );
  }
});

test('catalog exposes verified active rows from the manually checked Vronsky subset', () => {
  const activeRows = getActiveFixedStarRows();

  assert.equal(FIXED_STARS_CATALOG_ROWS.length, ACTIVE_KEYS.length);
  assert.equal(activeRows.length, ACTIVE_KEYS.length);
  assert.deepEqual(activeRows.map((row) => row.key), ACTIVE_KEYS);

  for (const row of activeRows) {
    assert.equal(row.active, true);
    assert.equal(row.verificationStatus, FIXED_STAR_VERIFICATION_STATUS.VERIFIED);
    assert.equal(row.sourceSystem, 'fixed-stars-vronsky-table-18');
    assert.equal(row.validationStatus, 'manual-source-verified');
    assert.equal(row.interpretation, false);
    assert.equal(row.initialReferenceEpoch, 1990);
    assert.equal(
      row.positionPolicy,
      'vronsky-source-columns-preserved-date-handling-deferred-to-task-14.4',
    );
    assert.equal(typeof row.key, 'string');
    assert.equal(typeof row.labelRu, 'string');
    assert.equal(typeof row.labelEn, 'string');
    assert.equal(typeof row.designation, 'string');
    assert.equal(row.sourceRow.table, 'Таблица 18');
    assert.equal(row.sourceRow.sourceNameRu.length > 0, true);
    assert.equal(row.sourceRow.sourceDesignation.length > 0, true);
    assert.equal(row.sourceRow.quality.length > 0, true);
    assert.equal(row.sourceRow.noOcrImport, true);
    assert.equal(row.sourceRow.noRowsFromMemory, true);
    assert.equal(row.sourceRow.manualVerification, true);
  }
});

test('active rows preserve Vronsky 1950 1970 and 1990 source columns', () => {
  for (const row of getActiveFixedStarRows()) {
    for (const epochKey of ['epoch1950', 'epoch1970', 'epoch1990']) {
      const coordinate = row.coordinates[epochKey];

      assert.equal(coordinate.verified, true);
      assert.equal(typeof coordinate.sign, 'string');
      assert.equal(Number.isInteger(coordinate.degree), true);
      assert.equal(Number.isInteger(coordinate.minutes), true);
      assert.equal(Number.isInteger(coordinate.seconds), true);
      assert.equal(Number.isFinite(coordinate.longitude), true);
      assert.equal(coordinate.seconds, 0);
      assert.equal(coordinate.epoch, Number(epochKey.replace('epoch', '')));
    }
  }
});

test('known active row coordinates are source-tracked static values', () => {
  assert.deepEqual(getFixedStarRowByKey('regulus').coordinates.epoch1990, {
    epoch: 1990,
    sign: 'leo',
    signRu: 'Лев',
    degree: 29,
    minutes: 42,
    seconds: 0,
    longitude: 149.7,
    verified: true,
  });

  assert.deepEqual(getFixedStarRowByKey('spica').coordinates.epoch1990, {
    epoch: 1990,
    sign: 'libra',
    signRu: 'Весы',
    degree: 23,
    minutes: 42,
    seconds: 0,
    longitude: 203.7,
    verified: true,
  });

  assert.deepEqual(getFixedStarRowByKey('fomalhaut').coordinates.epoch1990, {
    epoch: 1990,
    sign: 'pisces',
    signRu: 'Рыбы',
    degree: 3,
    minutes: 43,
    seconds: 0,
    longitude: 333.7166666667,
    verified: true,
  });
});

test('candidate helper returns candidate rows only and can be empty', () => {
  assert.deepEqual(getCandidateFixedStarRows(), []);
});

test('row getter and verification helper fail closed', () => {
  const regulus = getFixedStarRowByKey('regulus');

  assert.equal(regulus.key, 'regulus');
  assert.equal(getFixedStarRowByKey('unknown-star'), null);
  assert.equal(getFixedStarRowByKey(''), null);
  assert.equal(isVerifiedFixedStarRow('regulus'), true);
  assert.equal(isVerifiedFixedStarRow(regulus), true);
  assert.equal(isVerifiedFixedStarRow('unknown-star'), false);
  assert.equal(isVerifiedFixedStarRow(null), false);
  assert.equal(
    isVerifiedFixedStarRow({ ...regulus, active: false }),
    false,
  );
  assert.equal(
    isVerifiedFixedStarRow({ ...regulus, verificationStatus: FIXED_STAR_VERIFICATION_STATUS.NEEDS_REVIEW }),
    false,
  );
});

test('catalog policy returns safe counts and policy keys', () => {
  const policy = getFixedStarsCatalogPolicy();

  assert.equal(policy.sourceKey, 'vronsky-table-18-fixed-stars');
  assert.equal(policy.sourceSystem, 'fixed-stars-vronsky-table-18');
  assert.equal(policy.noOcrImport, true);
  assert.equal(policy.noRowsFromMemory, true);
  assert.equal(policy.activeRowCount, ACTIVE_KEYS.length);
  assert.equal(policy.candidateRowCount, 0);
  assert.equal(policy.initialReferenceEpoch, 1990);
  assert.equal(policy.orbPolicyKey, 'fixed-stars-global-conjunction-orb-1deg');
  assert.deepEqual(policy.activeRelationships, ['conjunction']);
  assert.deepEqual(policy.activeTargetSet, ['natal-planets', 'angles']);
});

test('catalog object exposes frozen data slices', () => {
  const catalog = getFixedStarsCatalog();

  assert.equal(Object.isFrozen(catalog), true);
  assert.equal(Object.isFrozen(catalog.source), true);
  assert.equal(Object.isFrozen(catalog.orbPolicy), true);
  assert.equal(Object.isFrozen(catalog.targetPolicy), true);
  assert.equal(Object.isFrozen(catalog.relationshipPolicy), true);
  assert.equal(Object.isFrozen(catalog.rows), true);
  assert.equal(Object.isFrozen(catalog.activeRows), true);
  assert.equal(Object.isFrozen(catalog.candidateRows), true);
  assert.equal(Object.isFrozen(catalog.deferredRows), true);
  assert.equal(Object.isFrozen(catalog.rows[0]), true);
  assert.equal(Object.isFrozen(catalog.rows[0].coordinates), true);
  assert.equal(Object.isFrozen(catalog.rows[0].coordinates.epoch1990), true);
});

test('deferred reasons capabilities and limitations preserve strict boundaries', () => {
  assert.deepEqual(getFixedStarsDeferredReasons(), [
    'sourceRowNotYetVerified',
    'coordinateNotVerified',
    'validationPending',
    'interpretationsDeferred',
    'dateOfBirthPositionDeferredToTask14_4',
  ]);

  assert.deepEqual(getFixedStarsDataCapabilities(), {
    fixedStarsCatalog: true,
    activeRows: true,
    candidateRows: true,
    conjunctionEngine: false,
    positionEngine: false,
    targetResolver: false,
    display: false,
    ui: false,
    debug: false,
    interpretations: false,
    transits: false,
  });

  assert.equal(
    getFixedStarsDataLimitations().includes('Этот модуль не рассчитывает соединения.'),
    true,
  );
});

test('dataset output contains no private profile data provider payload or interpretive text', () => {
  assertNoPrivateOrInterpretiveText(getFixedStarsCatalog());
  assertNoPrivateOrInterpretiveText(getFixedStarsCatalogPolicy());
  assertNoPrivateOrInterpretiveText(getFixedStarsDataLimitations());
});

test('module source has no runtime provider swisseph DOM or calculation imports', () => {
  const source = readFileSync(new URL('../src/fixedStarsData.js', import.meta.url), 'utf8');

  for (const forbidden of [
    'from "swisseph"',
    "from 'swisseph'",
    'require("swisseph")',
    "require('swisseph')",
    'astronomy-engine',
    'planetaryProvider',
    'natalPlanetsForProfile',
    'document.',
    'window.',
    'localStorage',
    'calculateFixedStar',
    'calculatePosition',
    'calculateConjunction',
    'conjunctionEngine(',
    'renderFixedStars',
    'debugPanel',
  ]) {
    assert.equal(source.includes(forbidden), false, `module should not include ${forbidden}`);
  }
});

test('src/fixedStars.js is not created', () => {
  assert.equal(existsSync(new URL('../src/fixedStars.js', import.meta.url)), false);
});
