import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import { ASTRO_ZODIAC_SIGNS } from '../src/astroMath.js';
import {
  DEGREE_RULER_VRONSKY_SOURCE_SYSTEMS,
  DEGREE_RULERS_VRONSKY_ROWS,
  DEGREE_RULERS_VRONSKY_SOURCE,
  DEGREE_RULERS_VRONSKY_VERIFICATION_STATUS,
  getDegreeRulersVronskyDataset,
  getDegreeRulersVronskyDeferredFeatures,
  getDegreeRulersVronskyDeferredSystems,
  getDegreeRulersVronskyRowsForSign,
  getDegreeRulersVronskySource,
  isValidVronskyDegreeIndex,
  isValidVronskyDegreeRulerSign,
  isValidVronskyRulerEntry,
  isValidVronskyRulerKey,
} from '../src/degreeRulersVronskyData.js';

const EXPECTED_SIGNS = ASTRO_ZODIAC_SIGNS.map((sign) => sign.key);
const VALID_RULERS = Object.freeze([
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
  'chiron',
  'proserpina',
]);

const EXPECTED_SAMPLES = Object.freeze([
  ['aries', 0, [{ key: 'mars', retrograde: false }, { key: 'pluto', retrograde: true }]],
  ['aries', 1, [{ key: 'sun', retrograde: false }]],
  ['aries', 2, [{ key: 'venus', retrograde: false }, { key: 'chiron', retrograde: true }]],
  ['aries', 3, [{ key: 'mercury', retrograde: false }, { key: 'proserpina', retrograde: false }]],
  ['aries', 4, [{ key: 'moon', retrograde: false }]],
  ['aries', 5, [{ key: 'saturn', retrograde: false }, { key: 'uranus', retrograde: true }]],
  ['aries', 6, [{ key: 'jupiter', retrograde: false }, { key: 'neptune', retrograde: true }]],
  ['aries', 29, [{ key: 'sun', retrograde: false }]],

  ['taurus', 0, [{ key: 'chiron', retrograde: false }, { key: 'venus', retrograde: true }]],
  ['taurus', 1, [{ key: 'mercury', retrograde: false }, { key: 'proserpina', retrograde: false }]],
  ['taurus', 2, [{ key: 'moon', retrograde: false }]],
  ['taurus', 3, [{ key: 'uranus', retrograde: false }, { key: 'saturn', retrograde: true }]],
  ['taurus', 4, [{ key: 'jupiter', retrograde: false }, { key: 'neptune', retrograde: false }]],
  ['taurus', 5, [{ key: 'pluto', retrograde: false }, { key: 'mars', retrograde: true }]],
  ['taurus', 6, [{ key: 'sun', retrograde: false }]],
  ['taurus', 29, [{ key: 'mercury', retrograde: false }, { key: 'proserpina', retrograde: false }]],

  ['gemini', 0, [{ key: 'mercury', retrograde: true }, { key: 'proserpina', retrograde: false }]],
  ['gemini', 1, [{ key: 'moon', retrograde: false }]],
  ['gemini', 2, [{ key: 'uranus', retrograde: false }, { key: 'saturn', retrograde: false }]],
  ['gemini', 3, [{ key: 'jupiter', retrograde: false }, { key: 'neptune', retrograde: true }]],
  ['gemini', 4, [{ key: 'mars', retrograde: false }, { key: 'pluto', retrograde: false }]],
  ['gemini', 5, [{ key: 'sun', retrograde: false }]],
  ['gemini', 6, [{ key: 'venus', retrograde: false }, { key: 'chiron', retrograde: false }]],
  ['gemini', 14, [{ key: 'mercury', retrograde: true }, { key: 'proserpina', retrograde: false }]],
  ['gemini', 29, [{ key: 'moon', retrograde: false }]],

  ['cancer', 0, [{ key: 'moon', retrograde: false }]],
  ['cancer', 1, [{ key: 'saturn', retrograde: false }, { key: 'uranus', retrograde: true }]],
  ['cancer', 2, [{ key: 'jupiter', retrograde: false }, { key: 'neptune', retrograde: true }]],
  ['cancer', 3, [{ key: 'mars', retrograde: false }, { key: 'pluto', retrograde: true }]],
  ['cancer', 4, [{ key: 'sun', retrograde: false }]],
  ['cancer', 5, [{ key: 'venus', retrograde: false }, { key: 'chiron', retrograde: false }]],
  ['cancer', 6, [{ key: 'mercury', retrograde: false }, { key: 'proserpina', retrograde: false }]],
]);

function rowsForSign(signKey) {
  return DEGREE_RULERS_VRONSKY_ROWS.filter((row) => row.sign === signKey);
}

function rowFor(signKey, degree) {
  return DEGREE_RULERS_VRONSKY_ROWS.find(
    (row) => row.sign === signKey && row.degree === degree,
  );
}

function publicRulerShape(row) {
  return row.rulers.map(({ key, retrograde }) => ({ key, retrograde }));
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
    'fixedStar',
    'fixedStars',
    'interpretation',
    'interpretationText',
    'fatalistic',
    'degree-rulers-star-of-magi-table-6',
  ]) {
    assert.equal(text.includes(forbidden), false, `dataset rows should not include ${forbidden}`);
  }
}

test('Vronsky degree rulers dataset exports verified Table 7 source metadata', () => {
  assert.equal(DEGREE_RULERS_VRONSKY_SOURCE.sourceKey, 'degree-rulers-vronsky-table-7');
  assert.equal(DEGREE_RULERS_VRONSKY_SOURCE.sourceName, 'С. Вронский');
  assert.equal(
    DEGREE_RULERS_VRONSKY_SOURCE.sourceSystem,
    DEGREE_RULER_VRONSKY_SOURCE_SYSTEMS.VRONSKY_TABLE_7,
  );
  assert.equal(DEGREE_RULERS_VRONSKY_SOURCE.tableNumber, 7);
  assert.equal(DEGREE_RULERS_VRONSKY_SOURCE.tableName, 'Управление градусами (по С. Вронскому)');
  assert.equal(
    DEGREE_RULERS_VRONSKY_SOURCE.sourceType,
    'user-provided-image-tome2-cross-reference-and-manual-verification',
  );
  assert.equal(
    DEGREE_RULERS_VRONSKY_SOURCE.verificationStatus,
    DEGREE_RULERS_VRONSKY_VERIFICATION_STATUS.VERIFIED,
  );
  assert.equal(
    DEGREE_RULERS_VRONSKY_SOURCE.verificationReport,
    'DEGREE_RULERS_TABLE_7_VERIFICATION_REPORT.md',
  );
  assert.equal(
    DEGREE_RULERS_VRONSKY_SOURCE.tome2CrossReference,
    'DEGREE_RULERS_TABLE_7_TOME2_CROSS_REFERENCE.md',
  );
  assert.equal(DEGREE_RULERS_VRONSKY_SOURCE.rowCount, 360);
  assert.equal(DEGREE_RULERS_VRONSKY_SOURCE.active, true);
  assert.equal(getDegreeRulersVronskySource(), DEGREE_RULERS_VRONSKY_SOURCE);
});

test('Vronsky degree rulers dataset exposes exactly 360 verified rows across 12 signs', () => {
  const dataset = getDegreeRulersVronskyDataset();

  assert.equal(DEGREE_RULERS_VRONSKY_ROWS.length, 360);
  assert.equal(dataset.rows.length, 360);
  assert.equal(dataset.rowCount, 360);
  assert.equal(dataset.active, true);
  assert.deepEqual(Object.keys(dataset.signs), EXPECTED_SIGNS);

  for (const signKey of EXPECTED_SIGNS) {
    assert.equal(rowsForSign(signKey).length, 30, `${signKey} should have thirty rows`);
    assert.equal(getDegreeRulersVronskyRowsForSign(signKey).length, 30);
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

test('every degree ruler row has verified Table 7 source metadata', () => {
  for (const row of DEGREE_RULERS_VRONSKY_ROWS) {
    assert.equal(row.sourceKey, 'degree-rulers-vronsky-table-7');
    assert.equal(row.sourceSystem, DEGREE_RULER_VRONSKY_SOURCE_SYSTEMS.VRONSKY_TABLE_7);
    assert.equal(row.sourceTable, 'Table 7');
    assert.equal(row.sourceTitle, 'Управление градусами (по С. Вронскому)');
    assert.equal(row.verificationStatus, DEGREE_RULERS_VRONSKY_VERIFICATION_STATUS.VERIFIED);
    assert.equal(row.sourceCheck, 'match');
    assert.notEqual(row.verificationStatus, DEGREE_RULERS_VRONSKY_VERIFICATION_STATUS.NEEDS_REVIEW);
    assert.notEqual(row.sourceCheck, 'unclear');
    assert.notEqual(row.sourceCheck, 'mismatch');
  }
});

test('every degree ruler row has required arrays and valid ruler entries', () => {
  for (const row of DEGREE_RULERS_VRONSKY_ROWS) {
    assert.equal(isValidVronskyDegreeRulerSign(row.sign), true, `${row.sign} should be valid`);
    assert.equal(isValidVronskyDegreeIndex(row.degree), true, `${row.degree} should be valid`);
    assert.equal(typeof row.signRu, 'string');
    assert.equal(Number.isInteger(row.degree), true);
    assert.equal(Array.isArray(row.sourceTokens), true);
    assert.equal(Array.isArray(row.rulers), true);
    assert.ok(row.sourceTokens.length >= 1);
    assert.ok(row.rulers.length >= 1);

    for (const token of row.sourceTokens) {
      assert.equal(typeof token, 'string');
      assert.notEqual(token.length, 0);
    }

    for (const ruler of row.rulers) {
      assert.equal(isValidVronskyRulerEntry(ruler), true, `${row.sign}-${row.degree} invalid entry`);
      assert.equal(isValidVronskyRulerKey(ruler.key), true);
      assert.equal(typeof ruler.retrograde, 'boolean');
    }
  }
});

test('allowed Vronsky degree rulers include classical outer Chiron and Proserpina keys only', () => {
  assert.deepEqual(VALID_RULERS.filter(isValidVronskyRulerKey), VALID_RULERS);
  assert.equal(isValidVronskyRulerKey('ceres'), false);
  assert.equal(isValidVronskyRulerKey('northNode'), false);
  assert.equal(isValidVronskyRulerKey(''), false);
});

test('degree ruler sign degree and row helpers fail closed', () => {
  assert.equal(isValidVronskyDegreeRulerSign('aries'), true);
  assert.equal(isValidVronskyDegreeRulerSign('pisces'), true);
  assert.equal(isValidVronskyDegreeRulerSign('ophiuchus'), false);
  assert.equal(isValidVronskyDegreeRulerSign(''), false);
  assert.deepEqual(getDegreeRulersVronskyRowsForSign('unknown'), []);
  assert.deepEqual(getDegreeRulersVronskyRowsForSign(null), []);

  assert.equal(isValidVronskyDegreeIndex(0), true);
  assert.equal(isValidVronskyDegreeIndex(29), true);
  assert.equal(isValidVronskyDegreeIndex(-1), false);
  assert.equal(isValidVronskyDegreeIndex(30), false);
  assert.equal(isValidVronskyDegreeIndex(1.5), false);
  assert.equal(isValidVronskyDegreeIndex(Number.NaN), false);
});

test('dataset exposes degree policy row model deferred systems and deferred features', () => {
  const dataset = getDegreeRulersVronskyDataset();

  assert.deepEqual(dataset.degreePolicy, {
    type: 'integer-degree',
    validDegrees: '0 through 29',
    futureLookupRule: 'degreeIndex = floor(degreeWithinSign)',
    futureLookupValidRange: '0 <= degreeWithinSign < 30',
    degree30: 'invalid / next sign handled upstream',
    sourceSystem: DEGREE_RULER_VRONSKY_SOURCE_SYSTEMS.VRONSKY_TABLE_7,
  });

  assert.deepEqual(dataset.rowModel, {
    supportsMultipleRulers: true,
    supportsRetrogradeMarkers: true,
    supportsOuterPlanets: true,
    supportsChiron: true,
    supportsProserpina: true,
    preservesSourceTokens: true,
  });

  assert.deepEqual(getDegreeRulersVronskyDeferredSystems(), {
    starOfMagiTable6Separate: DEGREE_RULER_VRONSKY_SOURCE_SYSTEMS.STAR_OF_MAGI_TABLE_6,
  });

  assert.deepEqual(getDegreeRulersVronskyDeferredFeatures(), [
    'fixedStars',
    'houses',
    'ASC/MC',
    'transits',
    'interpretations',
    'ritualScoring',
  ]);
});

test('Vronsky row model preserves multiple rulers retrograde markers and extended planets', () => {
  const rowText = JSON.stringify(DEGREE_RULERS_VRONSKY_ROWS);

  assert.ok(DEGREE_RULERS_VRONSKY_ROWS.some((row) => row.rulers.length > 1));
  assert.ok(DEGREE_RULERS_VRONSKY_ROWS.some((row) => row.rulers.some((ruler) => ruler.retrograde)));
  assert.ok(
    DEGREE_RULERS_VRONSKY_ROWS.some((row) =>
      row.rulers.some((ruler) => ['uranus', 'neptune', 'pluto'].includes(ruler.key)),
    ),
  );
  assert.ok(DEGREE_RULERS_VRONSKY_ROWS.some((row) => row.rulers.some((ruler) => ruler.key === 'chiron')));
  assert.ok(
    DEGREE_RULERS_VRONSKY_ROWS.some((row) =>
      row.rulers.some((ruler) => ruler.key === 'proserpina'),
    ),
  );
  assert.ok(rowText.includes('"sourceTokens"'));
});

test('source row samples match the verified Table 7 Tome 2 cross-reference', () => {
  for (const [signKey, degree, expectedRulers] of EXPECTED_SAMPLES) {
    const row = rowFor(signKey, degree);

    assert.ok(row, `${signKey} degree ${degree} should exist`);
    assert.deepEqual(publicRulerShape(row), expectedRulers, `${signKey} degree ${degree} ruler mismatch`);
  }
});

test('dataset object and row boundaries are frozen read-only objects', () => {
  const dataset = getDegreeRulersVronskyDataset();
  const firstMultiRulerRow = DEGREE_RULERS_VRONSKY_ROWS.find((row) => row.rulers.length > 1);

  assert.equal(Object.isFrozen(dataset), true);
  assert.equal(Object.isFrozen(dataset.source), true);
  assert.equal(Object.isFrozen(dataset.rows), true);
  assert.equal(Object.isFrozen(dataset.rows[0]), true);
  assert.equal(Object.isFrozen(dataset.rows[0].sourceTokens), true);
  assert.equal(Object.isFrozen(dataset.rows[0].rulers), true);
  assert.equal(Object.isFrozen(dataset.rows[0].rulers[0]), true);
  assert.equal(Object.isFrozen(dataset.rows[0].notes), true);
  assert.equal(Object.isFrozen(firstMultiRulerRow.rulers), true);
  assert.equal(Object.isFrozen(dataset.signs), true);
  assert.equal(Object.isFrozen(dataset.signs.aries), true);
  assert.equal(Object.isFrozen(dataset.degreePolicy), true);
  assert.equal(Object.isFrozen(dataset.rowModel), true);
  assert.equal(Object.isFrozen(dataset.deferredSystems), true);
  assert.equal(Object.isFrozen(dataset.deferredFeatures), true);
});

test('dataset rows contain no private data Table 6 source fixed stars or interpretations', () => {
  assertNoForbiddenDatasetText(DEGREE_RULERS_VRONSKY_ROWS);

  for (const row of DEGREE_RULERS_VRONSKY_ROWS) {
    assert.equal(row.sourceKey, 'degree-rulers-vronsky-table-7');
    assert.equal(row.sourceTable, 'Table 7');
    assert.equal('ruler' in row, false);
    assert.equal('fixedStar' in row, false);
    assert.equal('interpretation' in row, false);
  }
});

test('Vronsky degree rulers data module stays dataset-only without provider imports or lookup API', () => {
  const source = readFileSync(
    new URL('../src/degreeRulersVronskyData.js', import.meta.url),
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
  assert.equal(source.includes('degreeWithinSign) {'), false);
});
