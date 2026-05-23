import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import { ASTRO_ZODIAC_SIGNS } from '../src/astroMath.js';
import {
  TERMS_DATA_SOURCE,
  TERMS_TABLE_5_ROWS,
  TERMS_VERIFICATION_STATUS,
  getTermsDataset,
  getTermsDeferredFeatures,
  getTermsRowsForSign,
  getTermsSource,
  isValidTermRuler,
  isValidTermsSign,
} from '../src/termsData.js';

const EXPECTED_SIGNS = ASTRO_ZODIAC_SIGNS.map((sign) => sign.key);
const VALID_RULERS = Object.freeze(['mars', 'venus', 'mercury', 'jupiter', 'saturn']);
const FINAL_PRINTED_29_SIGNS = Object.freeze(['aries', 'taurus', 'libra', 'scorpio']);

function rowsForSign(signKey) {
  return TERMS_TABLE_5_ROWS.filter((row) => row.sign === signKey);
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
    'decansData',
    'fixedStarRows',
  ]) {
    assert.equal(text.includes(forbidden), false, `dataset should not include ${forbidden}`);
  }
}

test('terms dataset exports verified Vronsky Table 5 source metadata', () => {
  assert.equal(TERMS_DATA_SOURCE.sourceKey, 'vronsky-table-5-terms');
  assert.equal(TERMS_DATA_SOURCE.sourceName, 'С. Вронский');
  assert.equal(TERMS_DATA_SOURCE.tableNumber, 5);
  assert.equal(TERMS_DATA_SOURCE.tableName, 'Термы');
  assert.equal(TERMS_DATA_SOURCE.sourceType, 'user-provided-image-and-manual-verification');
  assert.equal(TERMS_DATA_SOURCE.verificationStatus, TERMS_VERIFICATION_STATUS.VERIFIED);
  assert.equal(TERMS_DATA_SOURCE.verificationReport, 'TERMS_TABLE_5_VERIFICATION_REPORT.md');
  assert.equal(TERMS_DATA_SOURCE.transcriptionDraft, 'TERMS_TABLE_5_TRANSCRIPTION_DRAFT.md');
  assert.equal(TERMS_DATA_SOURCE.rowCount, 60);
  assert.equal(TERMS_DATA_SOURCE.active, true);
  assert.equal(getTermsSource(), TERMS_DATA_SOURCE);
});

test('terms dataset exposes exactly 60 verified rows across 12 signs', () => {
  const dataset = getTermsDataset();

  assert.equal(TERMS_TABLE_5_ROWS.length, 60);
  assert.equal(dataset.rows.length, 60);
  assert.equal(dataset.rowCount, 60);
  assert.equal(dataset.active, true);
  assert.deepEqual(Object.keys(dataset.signs), EXPECTED_SIGNS);

  for (const signKey of EXPECTED_SIGNS) {
    assert.equal(rowsForSign(signKey).length, 5, `${signKey} should have five term rows`);
    assert.equal(getTermsRowsForSign(signKey).length, 5, `${signKey} helper should return five rows`);
  }
});

test('every terms row has verified source metadata and no inactive status', () => {
  for (const row of TERMS_TABLE_5_ROWS) {
    assert.equal(row.sourceKey, 'vronsky-table-5-terms');
    assert.equal(row.sourceTable, 'Table 5 — Термы');
    assert.equal(row.verificationStatus, TERMS_VERIFICATION_STATUS.VERIFIED);
    assert.equal(row.sourceCheck, 'match');
    assert.notEqual(row.verificationStatus, TERMS_VERIFICATION_STATUS.NEEDS_REVIEW);
    assert.notEqual(row.sourceCheck, 'unclear');
    assert.notEqual(row.sourceCheck, 'mismatch');
    assert.ok(row.sourceRow.startsWith(`${row.sign}-`));
  }
});

test('every terms row has required numeric range fields and valid signs/rulers', () => {
  for (const row of TERMS_TABLE_5_ROWS) {
    assert.equal(isValidTermsSign(row.sign), true, `${row.sign} should be a valid sign`);
    assert.equal(isValidTermRuler(row.ruler), true, `${row.ruler} should be a valid term ruler`);
    assert.equal(typeof row.signRu, 'string');
    assert.equal(typeof row.rulerRu, 'string');
    assert.equal(Number.isFinite(row.startDegree), true);
    assert.equal(Number.isFinite(row.printedEndDegree), true);
    assert.equal(Number.isFinite(row.normalizedEndExclusive), true);
    assert.equal(Number.isFinite(row.value), true);
    assert.equal(row.normalizedEndExclusive > row.startDegree, true);
  }
});

test('normalized intervals cover each sign from 0 to 30 with no gaps or overlaps', () => {
  for (const signKey of EXPECTED_SIGNS) {
    const signRows = rowsForSign(signKey);

    assert.equal(signRows[0].startDegree, 0, `${signKey} should start at 0`);
    assert.equal(
      signRows.at(-1).normalizedEndExclusive,
      30,
      `${signKey} should cover to normalized end 30`,
    );

    for (let index = 1; index < signRows.length; index += 1) {
      assert.equal(
        signRows[index].startDegree,
        signRows[index - 1].normalizedEndExclusive,
        `${signKey} has a gap or overlap at row ${index + 1}`,
      );
    }
  }
});

test('final printed end 29 rows preserve source value and normalize only for final lookup coverage', () => {
  for (const signKey of FINAL_PRINTED_29_SIGNS) {
    const finalRow = rowsForSign(signKey).at(-1);

    assert.equal(finalRow.printedEndDegree, 29);
    assert.equal(finalRow.normalizedEndExclusive, 30);
    assert.ok(finalRow.notes.some((note) => note.includes('Printed end degree is 29')));
  }
});

test('signs printed to 30 preserve printed and normalized end 30', () => {
  for (const signKey of EXPECTED_SIGNS.filter((sign) => !FINAL_PRINTED_29_SIGNS.includes(sign))) {
    const finalRow = rowsForSign(signKey).at(-1);

    assert.equal(finalRow.printedEndDegree, 30);
    assert.equal(finalRow.normalizedEndExclusive, 30);
  }
});

test('allowed term rulers exclude Sun and Moon for Table 5', () => {
  assert.deepEqual(VALID_RULERS.filter(isValidTermRuler), VALID_RULERS);
  assert.equal(isValidTermRuler('sun'), false);
  assert.equal(isValidTermRuler('moon'), false);
  assert.equal(isValidTermRuler('uranus'), false);
  assert.equal(isValidTermRuler(''), false);
});

test('terms sign validation and rows helper fail closed', () => {
  assert.equal(isValidTermsSign('aries'), true);
  assert.equal(isValidTermsSign('pisces'), true);
  assert.equal(isValidTermsSign('ophiuchus'), false);
  assert.equal(isValidTermsSign(''), false);
  assert.deepEqual(getTermsRowsForSign('unknown'), []);
  assert.deepEqual(getTermsRowsForSign(null), []);
});

test('dataset exposes interval policy and deferred feature boundaries', () => {
  const dataset = getTermsDataset();

  assert.deepEqual(dataset.intervalPolicy, {
    type: 'half-open',
    rule: '[startDegree, normalizedEndExclusive)',
    degreeWithinSign: '0 <= degree < 30',
    printedEndDegreePreserved: true,
    finalPrintedEnd29NormalizedTo30: true,
  });

  assert.deepEqual(getTermsDeferredFeatures(), [
    'decans',
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
  const dataset = getTermsDataset();

  assert.equal(Object.isFrozen(dataset), true);
  assert.equal(Object.isFrozen(dataset.source), true);
  assert.equal(Object.isFrozen(dataset.rows), true);
  assert.equal(Object.isFrozen(dataset.rows[0]), true);
  assert.equal(Object.isFrozen(dataset.rows[0].notes), true);
  assert.equal(Object.isFrozen(dataset.signs), true);
  assert.equal(Object.isFrozen(dataset.signs.aries), true);
  assert.equal(Object.isFrozen(dataset.intervalPolicy), true);
  assert.equal(Object.isFrozen(dataset.deferredFeatures), true);
});

test('dataset contains no private profile data future source rows or interpretation text', () => {
  assertNoForbiddenDatasetText(getTermsDataset());
  assertNoForbiddenDatasetText(TERMS_TABLE_5_ROWS);
});

test('terms data module stays dataset-only without provider imports or degree lookup API', () => {
  const source = readFileSync(new URL('../src/termsData.js', import.meta.url), 'utf8');

  assert.equal(source.includes('astronomy-engine'), false);
  assert.equal(source.includes('astronomyEngineProvider'), false);
  assert.equal(source.includes('profileStorage'), false);
  assert.equal(source.includes('localStorage'), false);
  assert.equal(source.includes('document.'), false);
  assert.equal(source.includes('window.'), false);
  assert.equal(source.includes('luxon'), false);
  assert.equal(source.includes('getTermForDegree'), false);
  assert.equal(source.includes('lookupTerm'), false);
  assert.equal(source.includes('findTerm'), false);
});
