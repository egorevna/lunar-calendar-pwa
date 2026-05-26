import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import {
  ARABIC_PARTS_FORMULA_ROWS,
  ARABIC_PARTS_SOURCE_DECISION,
  ARABIC_PARTS_VERIFICATION_STATUS,
  getActiveArabicPartsFormulas,
  getArabicPartFormulaByKey,
  getArabicPartsDeferredReasons,
  getArabicPartsFormulaDataset,
  getArabicPartsFormulaPolicy,
  getDeferredArabicPartsFormulas,
  isVerifiedArabicPartFormula,
} from '../src/arabicPartsData.js';

function assertNoSensitiveOrInterpretiveText(value) {
  const json = JSON.stringify(value);

  assert.equal(json.includes('birthDate'), false);
  assert.equal(json.includes('birthTime'), false);
  assert.equal(json.includes('utcDateTime'), false);
  assert.equal(json.includes('coordinates'), false);
  assert.equal(json.includes('latitude'), false);
  assert.equal(json.includes('fullProfileJson'), false);
  assert.equal(json.includes('providerPayload'), false);
  assert.equal(json.includes('фаталь'), false);
  assert.equal(json.includes('карми'), false);
  assert.equal(json.includes('сильный дом'), false);
  assert.equal(json.includes('слабый дом'), false);
  assert.equal(json.includes('ритуал'), false);
}

test('source decision metadata and formula policy enforce verified-only activation', () => {
  const policy = getArabicPartsFormulaPolicy();

  assert.deepEqual(ARABIC_PARTS_VERIFICATION_STATUS, {
    VERIFIED: 'verified',
    CANDIDATE: 'candidate',
    DEFERRED: 'deferred',
    NEEDS_REVIEW: 'needsReview',
    REJECTED: 'rejected',
  });
  assert.equal(ARABIC_PARTS_SOURCE_DECISION.sourceKey, 'sprint-12-arabic-parts-source-decision');
  assert.equal(ARABIC_PARTS_SOURCE_DECISION.sprint, 12);
  assert.equal(ARABIC_PARTS_SOURCE_DECISION.status, 'partial');
  assert.equal(ARABIC_PARTS_SOURCE_DECISION.activeFormulaPolicy, 'verified-only');
  assert.equal(policy.verifiedOnly, true);
  assert.equal(policy.noFormulaFromMemory, true);
  assert.equal(policy.noInterpretations, true);
  assert.equal(policy.dayNightRequiredForVariantFormulas, true);
  assert.deepEqual(policy.activeFormulaKeys, ['pars-fortuna']);
  assert.equal(policy.deferredFormulaKeys.includes('lot-of-spirit'), true);
  assert.equal(Object.isFrozen(policy.activeFormulaKeys), true);
  assert.equal(Object.isFrozen(policy.deferredFormulaKeys), true);
  assertNoSensitiveOrInterpretiveText({ source: ARABIC_PARTS_SOURCE_DECISION, policy });
});

test('Pars Fortuna is the only active verified Arabic Part formula row', () => {
  const parsFortuna = getArabicPartFormulaByKey('pars-fortuna');
  const activeRows = getActiveArabicPartsFormulas();

  assert.equal(Array.isArray(ARABIC_PARTS_FORMULA_ROWS), true);
  assert.equal(Object.isFrozen(ARABIC_PARTS_FORMULA_ROWS), true);
  assert.equal(parsFortuna.key, 'pars-fortuna');
  assert.equal(parsFortuna.labelRu, 'Парс Фортуны');
  assert.equal(parsFortuna.labelEn, 'Lot of Fortune');
  assert.equal(parsFortuna.active, true);
  assert.equal(parsFortuna.verificationStatus, 'verified');
  assert.equal(parsFortuna.calculationModule, 'src/parsFortuna.js');
  assert.equal(parsFortuna.formulaType, 'day-night');
  assert.deepEqual(parsFortuna.formula.day, {
    expression: 'ASC + Moon - Sun',
    operands: ['asc', '+', 'moon', '-', 'sun'],
  });
  assert.deepEqual(parsFortuna.formula.night, {
    expression: 'ASC + Sun - Moon',
    operands: ['asc', '+', 'sun', '-', 'moon'],
  });
  assert.deepEqual(parsFortuna.requiredInputs, ['asc', 'sun', 'moon', 'chartSect']);
  assert.deepEqual(parsFortuna.output, {
    longitude: true,
    houseAssignment: 'deferred-to-task-12.7',
    interpretation: false,
  });
  assert.equal(activeRows.length, 1);
  assert.equal(activeRows[0].key, 'pars-fortuna');
  assert.equal(isVerifiedArabicPartFormula('pars-fortuna'), true);
  assert.equal(isVerifiedArabicPartFormula(parsFortuna), true);
  assertNoSensitiveOrInterpretiveText(parsFortuna);
});

test('Lot of Spirit and additional candidate formulas remain inactive and deferred', () => {
  const lotOfSpirit = getArabicPartFormulaByKey('lot-of-spirit');
  const deferredRows = getDeferredArabicPartsFormulas();
  const deferredKeys = deferredRows.map((row) => row.key);

  assert.equal(lotOfSpirit.active, false);
  assert.equal(['deferred', 'candidate', 'needsReview'].includes(lotOfSpirit.verificationStatus), true);
  assert.notEqual(lotOfSpirit.verificationStatus, 'verified');
  assert.equal(lotOfSpirit.formula, null);
  assert.deepEqual(lotOfSpirit.requiredInputs, ['asc', 'sun', 'moon', 'chartSect']);
  assert.deepEqual(lotOfSpirit.output, {
    longitude: false,
    houseAssignment: false,
    interpretation: false,
  });
  assert.equal(isVerifiedArabicPartFormula('lot-of-spirit'), false);
  assert.equal(deferredKeys.includes('lot-of-spirit'), true);
  ['lot-of-eros', 'lot-of-necessity', 'lot-of-basis', 'lot-of-exaltation'].forEach((key) => {
    const row = getArabicPartFormulaByKey(key);

    assert.equal(row.active, false);
    assert.equal(row.verificationStatus, 'deferred');
    assert.equal(row.formula, null);
    assert.equal(isVerifiedArabicPartFormula(row), false);
    assert.equal(deferredKeys.includes(key), true);
  });
  assertNoSensitiveOrInterpretiveText(deferredRows);
});

test('dataset getters return safe frozen policy slices', () => {
  const dataset = getArabicPartsFormulaDataset();
  const reasons = getArabicPartsDeferredReasons();

  assert.equal(dataset.source.sourceKey, 'sprint-12-arabic-parts-source-decision');
  assert.equal(dataset.policy.verifiedOnly, true);
  assert.equal(dataset.rows.length, ARABIC_PARTS_FORMULA_ROWS.length);
  assert.equal(dataset.activeRows.length, 1);
  assert.equal(dataset.activeRows[0].key, 'pars-fortuna');
  assert.equal(dataset.deferredRows.length >= 1, true);
  assert.deepEqual(reasons, [
    'formulaSourceNotVerified',
    'notImplementedInSprint12Yet',
    'interpretationsDeferred',
  ]);
  assert.deepEqual(dataset.deferredReasons, reasons);
  assert.equal(Object.isFrozen(dataset), true);
  assert.equal(Object.isFrozen(dataset.rows), true);
  assert.equal(Object.isFrozen(dataset.activeRows), true);
  assert.equal(Object.isFrozen(dataset.deferredRows), true);
  assert.equal(Object.isFrozen(dataset.deferredReasons), true);
  assertNoSensitiveOrInterpretiveText(dataset);
});

test('formula lookup and verification helpers fail closed for unknown or inactive rows', () => {
  assert.equal(getArabicPartFormulaByKey('unknown'), null);
  assert.equal(getArabicPartFormulaByKey(''), null);
  assert.equal(getArabicPartFormulaByKey(null), null);
  assert.equal(isVerifiedArabicPartFormula('unknown'), false);
  assert.equal(isVerifiedArabicPartFormula(null), false);
  assert.equal(isVerifiedArabicPartFormula({ key: 'fake', active: true, verificationStatus: 'candidate' }), false);
  assert.equal(isVerifiedArabicPartFormula({ key: 'fake', active: false, verificationStatus: 'verified' }), false);
});

test('arabicPartsData module is data-only and keeps strict source boundaries', async () => {
  const source = await readFile(new URL('../src/arabicPartsData.js', import.meta.url), 'utf8');
  const imports = source
    .split('\n')
    .filter((line) => line.trim().startsWith('import '));

  assert.equal(imports.length, 0);
  assert.equal(source.includes('normalizeDegrees'), false);
  assert.equal(source.includes('formatDegree'), false);
  assert.equal(source.includes('calculateParsFortuna'), false);
  assert.equal(source.includes("from './parsFortuna"), false);
  assert.equal(source.includes('provider'), false);
  assert.equal(source.includes('localStorage'), false);
  assert.equal(source.includes('document.'), false);
  assert.equal(source.includes('window.'), false);
  assert.equal(source.includes('swisseph'), false);
  assert.equal(source.includes('astronomy-engine'), false);
  assert.equal(source.includes('calculateLotOfSpirit'), false);
  assert.equal(source.includes('function calculate'), false);
  assert.equal(source.includes('фаталь'), false);
  assert.equal(source.includes('карми'), false);
  assert.equal(source.includes('сильный дом'), false);
  assert.equal(existsSync(new URL('../src/houses.js', import.meta.url)), false);
  assert.equal(existsSync(new URL('../src/houseSystems.js', import.meta.url)), false);
  assert.equal(existsSync(new URL('../src/arabicParts.js', import.meta.url)), false);
});
