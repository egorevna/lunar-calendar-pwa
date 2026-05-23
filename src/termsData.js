const SOURCE_KEY = 'vronsky-table-5-terms';
const SOURCE_TABLE = 'Table 5 — Термы';
const FINAL_PRINTED_29_NOTE =
  'Printed end degree is 29; normalizedEndExclusive is 30 for code lookup coverage of final sign interval.';

export const TERMS_VERIFICATION_STATUS = Object.freeze({
  VERIFIED: 'verified',
  NEEDS_REVIEW: 'needsReview',
  DRAFT: 'draft',
  REJECTED: 'rejected',
});

export const TERMS_DATA_SOURCE = Object.freeze({
  sourceKey: SOURCE_KEY,
  sourceName: 'С. Вронский',
  tableNumber: 5,
  tableName: 'Термы',
  sourceType: 'user-provided-image-and-manual-verification',
  sourceReference: 'table5.png',
  verificationStatus: TERMS_VERIFICATION_STATUS.VERIFIED,
  verificationReport: 'TERMS_TABLE_5_VERIFICATION_REPORT.md',
  transcriptionDraft: 'TERMS_TABLE_5_TRANSCRIPTION_DRAFT.md',
  rowCount: 60,
  active: true,
  enteredBy: 'user-provided-draft',
  reviewedBy: 'Task 10.3b image-to-draft review',
  version: '1.0.0',
  notes: Object.freeze([
    'Rows are copied from the verified Table 5 manual review.',
    'Printed end degrees are preserved separately from normalized half-open lookup boundaries.',
    'This module stores data only and does not implement degree lookup.',
  ]),
});

export const TERMS_INTERVAL_POLICY = Object.freeze({
  type: 'half-open',
  rule: '[startDegree, normalizedEndExclusive)',
  degreeWithinSign: '0 <= degree < 30',
  printedEndDegreePreserved: true,
  finalPrintedEnd29NormalizedTo30: true,
});

export const TERMS_DEFERRED_FEATURES = Object.freeze([
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

const TERMS_SIGN_LABELS = Object.freeze({
  aries: 'Овен',
  taurus: 'Телец',
  gemini: 'Близнецы',
  cancer: 'Рак',
  leo: 'Лев',
  virgo: 'Дева',
  libra: 'Весы',
  scorpio: 'Скорпион',
  sagittarius: 'Стрелец',
  capricorn: 'Козерог',
  aquarius: 'Водолей',
  pisces: 'Рыбы',
});

const TERM_RULER_LABELS = Object.freeze({
  mars: 'Марс',
  venus: 'Венера',
  mercury: 'Меркурий',
  jupiter: 'Юпитер',
  saturn: 'Сатурн',
});

const TERMS_SIGN_KEYS = Object.freeze(Object.keys(TERMS_SIGN_LABELS));
const TERM_RULER_KEYS = Object.freeze(Object.keys(TERM_RULER_LABELS));
const EMPTY_ROWS = Object.freeze([]);

export const TERMS_TABLE_5_ROWS = freezeRows([
  row('aries', 0, 6, 6, 'mars', 2, 1),
  row('aries', 6, 12, 12, 'venus', -1, 2),
  row('aries', 12, 18, 18, 'mercury', 1, 3),
  row('aries', 18, 25, 25, 'jupiter', 2, 4),
  row('aries', 25, 29, 30, 'saturn', 1, 5, [FINAL_PRINTED_29_NOTE]),

  row('taurus', 0, 8, 8, 'venus', 1, 1),
  row('taurus', 8, 15, 15, 'mercury', 1, 2),
  row('taurus', 15, 20, 20, 'jupiter', 1, 3),
  row('taurus', 20, 24, 24, 'saturn', -1, 4),
  row('taurus', 24, 29, 30, 'mars', 1, 5, [FINAL_PRINTED_29_NOTE]),

  row('gemini', 0, 8, 8, 'mercury', 2, 1),
  row('gemini', 8, 16, 16, 'jupiter', 1, 2),
  row('gemini', 16, 21, 21, 'venus', 1, 3),
  row('gemini', 21, 27, 27, 'saturn', 1, 4),
  row('gemini', 27, 30, 30, 'mars', 1, 5),

  row('cancer', 0, 7, 7, 'mars', -1, 1),
  row('cancer', 7, 14, 14, 'venus', 2, 2),
  row('cancer', 14, 17, 17, 'mercury', 2, 3),
  row('cancer', 17, 27, 27, 'jupiter', 2, 4),
  row('cancer', 27, 30, 30, 'saturn', 1, 5),

  row('leo', 0, 8, 8, 'jupiter', 1, 1),
  row('leo', 8, 14, 14, 'saturn', 1, 2),
  row('leo', 14, 19, 19, 'venus', -1, 3),
  row('leo', 19, 24, 24, 'mercury', 1, 4),
  row('leo', 24, 30, 30, 'mars', 2, 5),

  row('virgo', 0, 7, 7, 'mercury', 2, 1),
  row('virgo', 7, 16, 16, 'venus', 1, 2),
  row('virgo', 16, 21, 21, 'jupiter', -1, 3),
  row('virgo', 21, 26, 26, 'mars', 2, 4),
  row('virgo', 26, 30, 30, 'saturn', 2, 5),

  row('libra', 0, 6, 6, 'saturn', 2, 1),
  row('libra', 6, 12, 12, 'mercury', 2, 2),
  row('libra', 12, 19, 19, 'jupiter', 2, 3),
  row('libra', 19, 26, 26, 'mars', -1, 4),
  row('libra', 26, 29, 30, 'venus', 2, 5, [FINAL_PRINTED_29_NOTE]),

  row('scorpio', 0, 7, 7, 'mars', 2, 1),
  row('scorpio', 7, 12, 12, 'venus', 1, 2),
  row('scorpio', 12, 17, 17, 'mercury', 1, 3),
  row('scorpio', 17, 25, 25, 'jupiter', -1, 4),
  row('scorpio', 25, 29, 30, 'saturn', 1, 5, [FINAL_PRINTED_29_NOTE]),

  row('sagittarius', 0, 9, 9, 'jupiter', 2, 1),
  row('sagittarius', 9, 13, 13, 'venus', 1, 2),
  row('sagittarius', 13, 18, 18, 'mercury', -1, 3),
  row('sagittarius', 18, 24, 24, 'mars', -1, 4),
  row('sagittarius', 24, 30, 30, 'saturn', 2, 5),

  row('capricorn', 0, 7, 7, 'saturn', 2, 1),
  row('capricorn', 7, 12, 12, 'jupiter', -1, 2),
  row('capricorn', 12, 19, 19, 'venus', 2, 3),
  row('capricorn', 19, 23, 23, 'mercury', 1, 4),
  row('capricorn', 23, 30, 30, 'mars', 2, 5),

  row('aquarius', 0, 6, 6, 'saturn', 2, 1),
  row('aquarius', 6, 13, 13, 'mercury', 2, 2),
  row('aquarius', 13, 19, 19, 'venus', 2, 3),
  row('aquarius', 19, 25, 25, 'jupiter', 1, 4),
  row('aquarius', 25, 30, 30, 'mars', -1, 5),

  row('pisces', 0, 8, 8, 'venus', 2, 1),
  row('pisces', 8, 14, 14, 'jupiter', 2, 2),
  row('pisces', 14, 18, 18, 'mercury', -2, 3),
  row('pisces', 18, 24, 24, 'saturn', -2, 4),
  row('pisces', 24, 30, 30, 'mars', 1, 5),
]);

const TERMS_ROWS_BY_SIGN = Object.freeze(
  Object.fromEntries(
    TERMS_SIGN_KEYS.map((signKey) => [
      signKey,
      Object.freeze(TERMS_TABLE_5_ROWS.filter((item) => item.sign === signKey)),
    ]),
  ),
);

const TERMS_DATASET = Object.freeze({
  source: TERMS_DATA_SOURCE,
  rows: TERMS_TABLE_5_ROWS,
  signs: TERMS_ROWS_BY_SIGN,
  rowCount: TERMS_TABLE_5_ROWS.length,
  active: TERMS_DATA_SOURCE.active,
  intervalPolicy: TERMS_INTERVAL_POLICY,
  deferredFeatures: TERMS_DEFERRED_FEATURES,
});

export function getTermsDataset() {
  return TERMS_DATASET;
}

export function getTermsRowsForSign(signKey) {
  if (!isValidTermsSign(signKey)) {
    return EMPTY_ROWS;
  }

  return TERMS_ROWS_BY_SIGN[signKey];
}

export function getTermsSource() {
  return TERMS_DATA_SOURCE;
}

export function getTermsDeferredFeatures() {
  return [...TERMS_DEFERRED_FEATURES];
}

export function isValidTermsSign(signKey) {
  return TERMS_SIGN_KEYS.includes(signKey);
}

export function isValidTermRuler(rulerKey) {
  return TERM_RULER_KEYS.includes(rulerKey);
}

function row(
  sign,
  startDegree,
  printedEndDegree,
  normalizedEndExclusive,
  ruler,
  value,
  sourceRowIndex,
  notes = [],
) {
  return Object.freeze({
    sourceKey: SOURCE_KEY,
    sign,
    signRu: TERMS_SIGN_LABELS[sign],
    startDegree,
    printedEndDegree,
    normalizedEndExclusive,
    ruler,
    rulerRu: TERM_RULER_LABELS[ruler],
    value,
    sourceTable: SOURCE_TABLE,
    sourceRow: `${sign}-${sourceRowIndex}`,
    verificationStatus: TERMS_VERIFICATION_STATUS.VERIFIED,
    sourceCheck: 'match',
    notes: Object.freeze([...notes]),
  });
}

function freezeRows(rows) {
  return Object.freeze([...rows]);
}
