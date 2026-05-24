import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import { ASTRO_ZODIAC_SIGNS } from '../src/astroMath.js';
import {
  DECAN_SOURCE_SYSTEMS,
  DECANS_DATA_SOURCE,
  DECANS_STAR_OF_MAGI_ROWS,
  DECANS_VERIFICATION_STATUS,
  getDecanRowsForSign,
  getDecansDataset,
  getDecansDeferredFeatures,
  getDecansDeferredSystems,
  getDecansSource,
  isValidDecanIndex,
  isValidDecanRuler,
  isValidDecanSign,
} from '../src/decansData.js';

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
const EXPECTED_INTERVALS = Object.freeze([
  { decanIndex: 1, startDegree: 0, endDegreeExclusive: 10 },
  { decanIndex: 2, startDegree: 10, endDegreeExclusive: 20 },
  { decanIndex: 3, startDegree: 20, endDegreeExclusive: 30 },
]);

function rowsForSign(signKey) {
  return DECANS_STAR_OF_MAGI_ROWS.filter((row) => row.sign === signKey);
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
    'degreeRulerRows',
    'trigonRows',
    'termsRows',
    'fixedStarRows',
  ]) {
    assert.equal(text.includes(forbidden), false, `dataset should not include ${forbidden}`);
  }
}

test('decans dataset exports verified Vronsky Figure 4.7 source metadata', () => {
  assert.equal(DECANS_DATA_SOURCE.sourceKey, 'decans-star-of-magi-vronsky-fig-4-7');
  assert.equal(DECANS_DATA_SOURCE.sourceName, 'С. Вронский');
  assert.equal(DECANS_DATA_SOURCE.sourceSystem, DECAN_SOURCE_SYSTEMS.STAR_OF_MAGI);
  assert.equal(DECANS_DATA_SOURCE.figureNumber, '4.7');
  assert.equal(
    DECANS_DATA_SOURCE.figureName,
    'Схема управления деканатами по звезде Магов (египетская традиция)',
  );
  assert.equal(DECANS_DATA_SOURCE.sourceType, 'user-provided-image-and-manual-verification');
  assert.equal(DECANS_DATA_SOURCE.verificationStatus, DECANS_VERIFICATION_STATUS.VERIFIED);
  assert.equal(
    DECANS_DATA_SOURCE.verificationReport,
    'DECANS_STAR_OF_MAGI_VERIFICATION_REPORT.md',
  );
  assert.equal(
    DECANS_DATA_SOURCE.transcriptionDraft,
    'DECANS_STAR_OF_MAGI_TRANSCRIPTION_DRAFT.md',
  );
  assert.equal(DECANS_DATA_SOURCE.rowCount, 36);
  assert.equal(DECANS_DATA_SOURCE.active, true);
  assert.equal(getDecansSource(), DECANS_DATA_SOURCE);
});

test('decans dataset exposes exactly 36 verified rows across 12 signs', () => {
  const dataset = getDecansDataset();

  assert.equal(DECANS_STAR_OF_MAGI_ROWS.length, 36);
  assert.equal(dataset.rows.length, 36);
  assert.equal(dataset.rowCount, 36);
  assert.equal(dataset.active, true);
  assert.deepEqual(Object.keys(dataset.signs), EXPECTED_SIGNS);

  for (const signKey of EXPECTED_SIGNS) {
    assert.equal(rowsForSign(signKey).length, 3, `${signKey} should have three decan rows`);
    assert.equal(getDecanRowsForSign(signKey).length, 3, `${signKey} helper should return rows`);
  }
});

test('every decan row has verified Star of the Magi source metadata', () => {
  for (const row of DECANS_STAR_OF_MAGI_ROWS) {
    assert.equal(row.sourceKey, 'decans-star-of-magi-vronsky-fig-4-7');
    assert.equal(row.sourceSystem, DECAN_SOURCE_SYSTEMS.STAR_OF_MAGI);
    assert.equal(row.sourceFigure, 'Fig. 4.7');
    assert.equal(
      row.sourceTitle,
      'Схема управления деканатами по звезде Магов (египетская традиция)',
    );
    assert.equal(row.verificationStatus, DECANS_VERIFICATION_STATUS.VERIFIED);
    assert.equal(row.sourceCheck, 'match');
    assert.notEqual(row.verificationStatus, DECANS_VERIFICATION_STATUS.NEEDS_REVIEW);
    assert.notEqual(row.sourceCheck, 'unclear');
    assert.notEqual(row.sourceCheck, 'mismatch');
  }
});

test('every decan row has required numeric interval fields and valid signs/rulers', () => {
  for (const row of DECANS_STAR_OF_MAGI_ROWS) {
    assert.equal(isValidDecanSign(row.sign), true, `${row.sign} should be valid`);
    assert.equal(isValidDecanRuler(row.ruler), true, `${row.ruler} should be valid`);
    assert.equal(isValidDecanIndex(row.decanIndex), true, `${row.decanIndex} should be valid`);
    assert.equal(typeof row.signRu, 'string');
    assert.equal(typeof row.rulerRu, 'string');
    assert.equal(Number.isFinite(row.startDegree), true);
    assert.equal(Number.isFinite(row.endDegreeExclusive), true);
    assert.equal(row.endDegreeExclusive > row.startDegree, true);
  }
});

test('all signs use [0,10), [10,20), [20,30) without gaps or overlaps', () => {
  for (const signKey of EXPECTED_SIGNS) {
    const signRows = rowsForSign(signKey);

    assert.equal(signRows[0].startDegree, 0, `${signKey} should start at 0`);
    assert.equal(signRows.at(-1).endDegreeExclusive, 30, `${signKey} should end at 30`);

    for (const [index, expected] of EXPECTED_INTERVALS.entries()) {
      assert.equal(signRows[index].decanIndex, expected.decanIndex);
      assert.equal(signRows[index].startDegree, expected.startDegree);
      assert.equal(signRows[index].endDegreeExclusive, expected.endDegreeExclusive);
    }

    for (let index = 1; index < signRows.length; index += 1) {
      assert.equal(
        signRows[index].startDegree,
        signRows[index - 1].endDegreeExclusive,
        `${signKey} has a gap or overlap at row ${index + 1}`,
      );
    }
  }
});

test('allowed decan rulers are septener planets only', () => {
  assert.deepEqual(VALID_RULERS.filter(isValidDecanRuler), VALID_RULERS);
  assert.equal(isValidDecanRuler('uranus'), false);
  assert.equal(isValidDecanRuler('neptune'), false);
  assert.equal(isValidDecanRuler('pluto'), false);
  assert.equal(isValidDecanRuler(''), false);
});

test('decan sign index and row helpers fail closed', () => {
  assert.equal(isValidDecanSign('aries'), true);
  assert.equal(isValidDecanSign('pisces'), true);
  assert.equal(isValidDecanSign('ophiuchus'), false);
  assert.equal(isValidDecanSign(''), false);
  assert.deepEqual(getDecanRowsForSign('unknown'), []);
  assert.deepEqual(getDecanRowsForSign(null), []);

  assert.equal(isValidDecanIndex(1), true);
  assert.equal(isValidDecanIndex(2), true);
  assert.equal(isValidDecanIndex(3), true);
  assert.equal(isValidDecanIndex(0), false);
  assert.equal(isValidDecanIndex(4), false);
});

test('dataset exposes interval policy deferred systems and deferred features', () => {
  const dataset = getDecansDataset();

  assert.deepEqual(dataset.intervalPolicy, {
    type: 'half-open',
    rule: '[startDegree, endDegreeExclusive)',
    decan1: '[0, 10)',
    decan2: '[10, 20)',
    decan3: '[20, 30)',
    degreeWithinSign: '0 <= degree < 30',
    sourceSystem: DECAN_SOURCE_SYSTEMS.STAR_OF_MAGI,
  });

  assert.deepEqual(getDecansDeferredSystems(), {
    trigonVronsky: DECAN_SOURCE_SYSTEMS.TRIGON_VRONSKY,
  });

  assert.deepEqual(getDecansDeferredFeatures(), [
    'trigonDecans',
    'degreeRulers',
    'StarOfMagiDegreeRulers',
    'VronskyDegreeRulers',
    'fixedStars',
    'houses',
    'ASC/MC',
    'transits',
    'interpretations',
  ]);
});

test('dataset object and row boundaries are frozen read-only objects', () => {
  const dataset = getDecansDataset();

  assert.equal(Object.isFrozen(dataset), true);
  assert.equal(Object.isFrozen(dataset.source), true);
  assert.equal(Object.isFrozen(dataset.rows), true);
  assert.equal(Object.isFrozen(dataset.rows[0]), true);
  assert.equal(Object.isFrozen(dataset.rows[0].notes), true);
  assert.equal(Object.isFrozen(dataset.signs), true);
  assert.equal(Object.isFrozen(dataset.signs.aries), true);
  assert.equal(Object.isFrozen(dataset.intervalPolicy), true);
  assert.equal(Object.isFrozen(dataset.deferredSystems), true);
  assert.equal(Object.isFrozen(dataset.deferredFeatures), true);
});

test('dataset contains no private data active trigon rows degree rulers or interpretations', () => {
  assertNoForbiddenDatasetText(getDecansDataset());
  assertNoForbiddenDatasetText(DECANS_STAR_OF_MAGI_ROWS);

  const rowText = JSON.stringify(DECANS_STAR_OF_MAGI_ROWS);
  assert.equal(rowText.includes('trigon-vronsky'), false);
  assert.equal(rowText.includes('degreeRulers'), false);
  assert.equal(rowText.includes('terms'), false);
});

test('decans data module stays dataset-only without provider imports or degree lookup API', () => {
  const source = readFileSync(new URL('../src/decansData.js', import.meta.url), 'utf8');

  assert.equal(source.includes('astronomy-engine'), false);
  assert.equal(source.includes('astronomyEngineProvider'), false);
  assert.equal(source.includes('profileStorage'), false);
  assert.equal(source.includes('localStorage'), false);
  assert.equal(source.includes('document.'), false);
  assert.equal(source.includes('window.'), false);
  assert.equal(source.includes('luxon'), false);
  assert.equal(source.includes('lookupDecan'), false);
  assert.equal(source.includes('findDecan'), false);
  assert.equal(source.includes('getDecanForDegree'), false);
});
