import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import { ASTRO_ZODIAC_SIGNS } from '../src/astroMath.js';
import {
  DEGREE_RULER_SOURCE_SYSTEMS,
  DEGREE_RULERS_STAR_OF_MAGI_ROWS,
  DEGREE_RULERS_STAR_OF_MAGI_SOURCE,
  DEGREE_RULERS_VERIFICATION_STATUS,
  getDegreeRulerRowsForSign,
  getDegreeRulersDeferredFeatures,
  getDegreeRulersDeferredSystems,
  getDegreeRulersStarOfMagiDataset,
  getDegreeRulersStarOfMagiSource,
  isValidDegreeIndex,
  isValidDegreeRulerPlanet,
  isValidDegreeRulerSign,
} from '../src/degreeRulersStarOfMagiData.js';

const EXPECTED_SIGNS = ASTRO_ZODIAC_SIGNS.map((sign) => sign.key);
const VALID_RULERS = Object.freeze([
  'sun',
  'moon',
  'mercury',
  'venus',
  'mars',
  'jupiter',
  'saturn',
]);

const EXPECTED_SAMPLES = Object.freeze([
  ['aries', 0, 'mars'],
  ['aries', 1, 'sun'],
  ['aries', 2, 'venus'],
  ['aries', 3, 'mercury'],
  ['aries', 4, 'moon'],
  ['aries', 5, 'saturn'],
  ['aries', 6, 'jupiter'],
  ['aries', 29, 'sun'],

  ['taurus', 0, 'venus'],
  ['taurus', 1, 'mercury'],
  ['taurus', 2, 'moon'],
  ['taurus', 3, 'saturn'],
  ['taurus', 4, 'jupiter'],
  ['taurus', 5, 'mars'],
  ['taurus', 6, 'sun'],
  ['taurus', 29, 'mercury'],

  ['gemini', 0, 'moon'],
  ['gemini', 1, 'saturn'],
  ['gemini', 2, 'jupiter'],
  ['gemini', 3, 'mars'],
  ['gemini', 4, 'sun'],
  ['gemini', 5, 'venus'],
  ['gemini', 6, 'mercury'],
  ['gemini', 29, 'saturn'],

  ['pisces', 0, 'sun'],
  ['pisces', 1, 'venus'],
  ['pisces', 2, 'mercury'],
  ['pisces', 3, 'moon'],
  ['pisces', 4, 'saturn'],
  ['pisces', 5, 'jupiter'],
  ['pisces', 6, 'mars'],
  ['pisces', 29, 'venus'],
]);

function rowsForSign(signKey) {
  return DEGREE_RULERS_STAR_OF_MAGI_ROWS.filter((row) => row.sign === signKey);
}

function rowFor(signKey, degree) {
  return DEGREE_RULERS_STAR_OF_MAGI_ROWS.find(
    (row) => row.sign === signKey && row.degree === degree,
  );
}

function assertNoForbiddenDatasetText(value) {
  const text = JSON.stringify(value);

  for (const forbidden of [
    'birthDate',
    'birthTime',
    'utcDateTime',
    'coordinates',
    'profileJson',
    'fullProfile',
    'rawLongitude',
    'interpretationText',
    'fatalistic',
    'Table 7',
    'vronsky-degree-rulers',
    'decansRows',
    'termsRows',
    'fixedStarRows',
  ]) {
    assert.equal(text.includes(forbidden), false, `dataset rows should not include ${forbidden}`);
  }
}

test('degree rulers dataset exports verified Table 6 source metadata', () => {
  assert.equal(DEGREE_RULERS_STAR_OF_MAGI_SOURCE.sourceKey, 'degree-rulers-star-of-magi-table-6');
  assert.equal(DEGREE_RULERS_STAR_OF_MAGI_SOURCE.sourceName, 'С. Вронский / Звезда Магов');
  assert.equal(
    DEGREE_RULERS_STAR_OF_MAGI_SOURCE.sourceSystem,
    DEGREE_RULER_SOURCE_SYSTEMS.STAR_OF_MAGI_TABLE_6,
  );
  assert.equal(DEGREE_RULERS_STAR_OF_MAGI_SOURCE.tableNumber, 6);
  assert.equal(
    DEGREE_RULERS_STAR_OF_MAGI_SOURCE.tableName,
    'Управление градусами по Звезде Магов',
  );
  assert.equal(
    DEGREE_RULERS_STAR_OF_MAGI_SOURCE.sourceType,
    'user-provided-image-and-manual-verification',
  );
  assert.equal(
    DEGREE_RULERS_STAR_OF_MAGI_SOURCE.verificationStatus,
    DEGREE_RULERS_VERIFICATION_STATUS.VERIFIED,
  );
  assert.equal(
    DEGREE_RULERS_STAR_OF_MAGI_SOURCE.verificationReport,
    'DEGREE_RULERS_TABLE_6_VERIFICATION_REPORT.md',
  );
  assert.equal(
    DEGREE_RULERS_STAR_OF_MAGI_SOURCE.transcriptionDraft,
    'DEGREE_RULERS_TABLE_6_TRANSCRIPTION_DRAFT.md',
  );
  assert.equal(DEGREE_RULERS_STAR_OF_MAGI_SOURCE.rowCount, 360);
  assert.equal(DEGREE_RULERS_STAR_OF_MAGI_SOURCE.active, true);
  assert.equal(getDegreeRulersStarOfMagiSource(), DEGREE_RULERS_STAR_OF_MAGI_SOURCE);
});

test('degree rulers dataset exposes exactly 360 verified rows across 12 signs', () => {
  const dataset = getDegreeRulersStarOfMagiDataset();

  assert.equal(DEGREE_RULERS_STAR_OF_MAGI_ROWS.length, 360);
  assert.equal(dataset.rows.length, 360);
  assert.equal(dataset.rowCount, 360);
  assert.equal(dataset.active, true);
  assert.deepEqual(Object.keys(dataset.signs), EXPECTED_SIGNS);

  for (const signKey of EXPECTED_SIGNS) {
    assert.equal(rowsForSign(signKey).length, 30, `${signKey} should have thirty rows`);
    assert.equal(getDegreeRulerRowsForSign(signKey).length, 30);
  }
});

test('every sign has integer degrees 0 through 29 with no gaps or duplicates', () => {
  for (const signKey of EXPECTED_SIGNS) {
    const signRows = rowsForSign(signKey);
    const degrees = signRows.map((row) => row.degree);

    assert.equal(signRows[0].degree, 0);
    assert.equal(signRows.at(-1).degree, 29);
    assert.deepEqual(degrees, Array.from({ length: 30 }, (_, index) => index));
    assert.equal(new Set(degrees).size, 30);
  }
});

test('every degree ruler row has verified Table 6 source metadata', () => {
  for (const row of DEGREE_RULERS_STAR_OF_MAGI_ROWS) {
    assert.equal(row.sourceKey, 'degree-rulers-star-of-magi-table-6');
    assert.equal(row.sourceSystem, DEGREE_RULER_SOURCE_SYSTEMS.STAR_OF_MAGI_TABLE_6);
    assert.equal(row.sourceTable, 'Table 6');
    assert.equal(row.sourceTitle, 'Управление градусами по Звезде Магов');
    assert.equal(row.verificationStatus, DEGREE_RULERS_VERIFICATION_STATUS.VERIFIED);
    assert.equal(row.sourceCheck, 'match');
    assert.notEqual(row.verificationStatus, DEGREE_RULERS_VERIFICATION_STATUS.NEEDS_REVIEW);
    assert.notEqual(row.sourceCheck, 'unclear');
    assert.notEqual(row.sourceCheck, 'mismatch');
  }
});

test('every degree ruler row has required fields and valid sign degree ruler values', () => {
  for (const row of DEGREE_RULERS_STAR_OF_MAGI_ROWS) {
    assert.equal(isValidDegreeRulerSign(row.sign), true, `${row.sign} should be valid`);
    assert.equal(isValidDegreeRulerPlanet(row.ruler), true, `${row.ruler} should be valid`);
    assert.equal(isValidDegreeIndex(row.degree), true, `${row.degree} should be a valid degree`);
    assert.equal(typeof row.signRu, 'string');
    assert.equal(typeof row.rulerRu, 'string');
    assert.equal(Number.isInteger(row.degree), true);
  }
});

test('allowed degree rulers are septener planets only', () => {
  assert.deepEqual(VALID_RULERS.filter(isValidDegreeRulerPlanet), VALID_RULERS);
  assert.equal(isValidDegreeRulerPlanet('uranus'), false);
  assert.equal(isValidDegreeRulerPlanet('neptune'), false);
  assert.equal(isValidDegreeRulerPlanet('pluto'), false);
  assert.equal(isValidDegreeRulerPlanet(''), false);
});

test('degree ruler sign degree and row helpers fail closed', () => {
  assert.equal(isValidDegreeRulerSign('aries'), true);
  assert.equal(isValidDegreeRulerSign('pisces'), true);
  assert.equal(isValidDegreeRulerSign('ophiuchus'), false);
  assert.equal(isValidDegreeRulerSign(''), false);
  assert.deepEqual(getDegreeRulerRowsForSign('unknown'), []);
  assert.deepEqual(getDegreeRulerRowsForSign(null), []);

  assert.equal(isValidDegreeIndex(0), true);
  assert.equal(isValidDegreeIndex(29), true);
  assert.equal(isValidDegreeIndex(-1), false);
  assert.equal(isValidDegreeIndex(30), false);
  assert.equal(isValidDegreeIndex(1.5), false);
  assert.equal(isValidDegreeIndex(Number.NaN), false);
});

test('dataset exposes degree policy deferred systems and deferred features', () => {
  const dataset = getDegreeRulersStarOfMagiDataset();

  assert.deepEqual(dataset.degreePolicy, {
    type: 'integer-degree',
    validDegrees: '0 through 29',
    futureLookupRule: 'degreeIndex = floor(degreeWithinSign)',
    futureLookupValidRange: '0 <= degreeWithinSign < 30',
    degree30: 'invalid / next sign handled upstream',
    sourceSystem: DEGREE_RULER_SOURCE_SYSTEMS.STAR_OF_MAGI_TABLE_6,
  });

  assert.deepEqual(getDegreeRulersDeferredSystems(), {
    vronskyTable7: DEGREE_RULER_SOURCE_SYSTEMS.VRONSKY_TABLE_7,
  });

  assert.deepEqual(getDegreeRulersDeferredFeatures(), [
    'VronskyTable7DegreeRulers',
    'decansTrigonVronsky',
    'fixedStars',
    'houses',
    'ASC/MC',
    'transits',
    'interpretations',
  ]);
});

test('source row samples match the verified Table 6 report', () => {
  for (const [signKey, degree, expectedRuler] of EXPECTED_SAMPLES) {
    const row = rowFor(signKey, degree);

    assert.ok(row, `${signKey} degree ${degree} should exist`);
    assert.equal(row.ruler, expectedRuler, `${signKey} degree ${degree} ruler mismatch`);
  }
});

test('dataset object and row boundaries are frozen read-only objects', () => {
  const dataset = getDegreeRulersStarOfMagiDataset();

  assert.equal(Object.isFrozen(dataset), true);
  assert.equal(Object.isFrozen(dataset.source), true);
  assert.equal(Object.isFrozen(dataset.rows), true);
  assert.equal(Object.isFrozen(dataset.rows[0]), true);
  assert.equal(Object.isFrozen(dataset.rows[0].notes), true);
  assert.equal(Object.isFrozen(dataset.signs), true);
  assert.equal(Object.isFrozen(dataset.signs.aries), true);
  assert.equal(Object.isFrozen(dataset.degreePolicy), true);
  assert.equal(Object.isFrozen(dataset.deferredSystems), true);
  assert.equal(Object.isFrozen(dataset.deferredFeatures), true);
});

test('dataset rows contain no private data Table 7 rows multiple rulers or interpretations', () => {
  assertNoForbiddenDatasetText(DEGREE_RULERS_STAR_OF_MAGI_ROWS);

  const rowText = JSON.stringify(DEGREE_RULERS_STAR_OF_MAGI_ROWS);
  assert.equal(rowText.includes('uranus'), false);
  assert.equal(rowText.includes('neptune'), false);
  assert.equal(rowText.includes('pluto'), false);
  assert.equal(rowText.includes('retrograde'), false);

  for (const row of DEGREE_RULERS_STAR_OF_MAGI_ROWS) {
    assert.equal('rulers' in row, false);
    assert.equal(Array.isArray(row.ruler), false);
  }
});

test('degree rulers data module stays dataset-only without provider imports or degree lookup API', () => {
  const source = readFileSync(
    new URL('../src/degreeRulersStarOfMagiData.js', import.meta.url),
    'utf8',
  );

  assert.equal(source.includes('astronomy-engine'), false);
  assert.equal(source.includes('astronomyEngineProvider'), false);
  assert.equal(source.includes('profileStorage'), false);
  assert.equal(source.includes('localStorage'), false);
  assert.equal(source.includes('document.'), false);
  assert.equal(source.includes('window.'), false);
  assert.equal(source.includes('luxon'), false);
  assert.equal(source.includes('lookupDegreeRuler'), false);
  assert.equal(source.includes('findDegreeRuler'), false);
  assert.equal(source.includes('getDegreeRulerForDegreeWithinSign'), false);
});
