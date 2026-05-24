const SOURCE_KEY = 'decans-star-of-magi-vronsky-fig-4-7';
const SOURCE_SYSTEM = 'star-of-magi-egyptian-tradition';
const SOURCE_FIGURE = 'Fig. 4.7';
const SOURCE_TITLE = 'Схема управления деканатами по звезде Магов (египетская традиция)';

export const DECANS_VERIFICATION_STATUS = Object.freeze({
  VERIFIED: 'verified',
  NEEDS_REVIEW: 'needsReview',
  DRAFT: 'draft',
  REJECTED: 'rejected',
});

export const DECAN_SOURCE_SYSTEMS = Object.freeze({
  STAR_OF_MAGI: SOURCE_SYSTEM,
  TRIGON_VRONSKY: 'trigon-vronsky-deferred',
});

export const DECANS_DATA_SOURCE = Object.freeze({
  sourceKey: SOURCE_KEY,
  sourceName: 'С. Вронский',
  sourceSystem: DECAN_SOURCE_SYSTEMS.STAR_OF_MAGI,
  figureNumber: '4.7',
  figureName: SOURCE_TITLE,
  sourceType: 'user-provided-image-and-manual-verification',
  sourceReference: 'fig_4_7_decans_star_of_magi.png',
  verificationStatus: DECANS_VERIFICATION_STATUS.VERIFIED,
  verificationReport: 'DECANS_STAR_OF_MAGI_VERIFICATION_REPORT.md',
  transcriptionDraft: 'DECANS_STAR_OF_MAGI_TRANSCRIPTION_DRAFT.md',
  rowCount: 36,
  active: true,
  enteredBy: 'Task 10.5b draft transcription',
  reviewedBy: 'Task 10.5c image-to-draft review',
  version: '1.0.0',
  notes: Object.freeze([
    'This dataset is Star of the Magi / Egyptian tradition only.',
    'It must not be mixed with Trigon/Vronsky decans.',
    'Only septener planets are used.',
  ]),
});

export const DECANS_INTERVAL_POLICY = Object.freeze({
  type: 'half-open',
  rule: '[startDegree, endDegreeExclusive)',
  decan1: '[0, 10)',
  decan2: '[10, 20)',
  decan3: '[20, 30)',
  degreeWithinSign: '0 <= degree < 30',
  sourceSystem: DECAN_SOURCE_SYSTEMS.STAR_OF_MAGI,
});

export const DECANS_DEFERRED_SYSTEMS = Object.freeze({
  trigonVronsky: DECAN_SOURCE_SYSTEMS.TRIGON_VRONSKY,
});

export const DECANS_DEFERRED_FEATURES = Object.freeze([
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

const DECAN_SIGN_LABELS = Object.freeze({
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

const DECAN_RULER_LABELS = Object.freeze({
  sun: 'Солнце',
  moon: 'Луна',
  mercury: 'Меркурий',
  venus: 'Венера',
  mars: 'Марс',
  jupiter: 'Юпитер',
  saturn: 'Сатурн',
});

const DECAN_SIGN_KEYS = Object.freeze(Object.keys(DECAN_SIGN_LABELS));
const DECAN_RULER_KEYS = Object.freeze(Object.keys(DECAN_RULER_LABELS));
const DECAN_INDEXES = Object.freeze([1, 2, 3]);
const EMPTY_ROWS = Object.freeze([]);

export const DECANS_STAR_OF_MAGI_ROWS = freezeRows([
  row('aries', 1, 0, 10, 'mars'),
  row('aries', 2, 10, 20, 'sun'),
  row('aries', 3, 20, 30, 'venus'),

  row('taurus', 1, 0, 10, 'mercury'),
  row('taurus', 2, 10, 20, 'moon'),
  row('taurus', 3, 20, 30, 'saturn'),

  row('gemini', 1, 0, 10, 'jupiter'),
  row('gemini', 2, 10, 20, 'mars'),
  row('gemini', 3, 20, 30, 'sun'),

  row('cancer', 1, 0, 10, 'venus'),
  row('cancer', 2, 10, 20, 'mercury'),
  row('cancer', 3, 20, 30, 'moon'),

  row('leo', 1, 0, 10, 'saturn'),
  row('leo', 2, 10, 20, 'jupiter'),
  row('leo', 3, 20, 30, 'mars'),

  row('virgo', 1, 0, 10, 'sun'),
  row('virgo', 2, 10, 20, 'venus'),
  row('virgo', 3, 20, 30, 'mercury'),

  row('libra', 1, 0, 10, 'moon'),
  row('libra', 2, 10, 20, 'saturn'),
  row('libra', 3, 20, 30, 'jupiter'),

  row('scorpio', 1, 0, 10, 'mars'),
  row('scorpio', 2, 10, 20, 'sun'),
  row('scorpio', 3, 20, 30, 'venus'),

  row('sagittarius', 1, 0, 10, 'mercury'),
  row('sagittarius', 2, 10, 20, 'moon'),
  row('sagittarius', 3, 20, 30, 'saturn'),

  row('capricorn', 1, 0, 10, 'jupiter'),
  row('capricorn', 2, 10, 20, 'mars'),
  row('capricorn', 3, 20, 30, 'sun'),

  row('aquarius', 1, 0, 10, 'venus'),
  row('aquarius', 2, 10, 20, 'mercury'),
  row('aquarius', 3, 20, 30, 'moon'),

  row('pisces', 1, 0, 10, 'saturn'),
  row('pisces', 2, 10, 20, 'jupiter'),
  row('pisces', 3, 20, 30, 'mars'),
]);

const DECAN_ROWS_BY_SIGN = Object.freeze(
  Object.fromEntries(
    DECAN_SIGN_KEYS.map((signKey) => [
      signKey,
      Object.freeze(DECANS_STAR_OF_MAGI_ROWS.filter((item) => item.sign === signKey)),
    ]),
  ),
);

const DECANS_DATASET = Object.freeze({
  source: DECANS_DATA_SOURCE,
  rows: DECANS_STAR_OF_MAGI_ROWS,
  signs: DECAN_ROWS_BY_SIGN,
  rowCount: DECANS_STAR_OF_MAGI_ROWS.length,
  active: DECANS_DATA_SOURCE.active,
  intervalPolicy: DECANS_INTERVAL_POLICY,
  deferredSystems: DECANS_DEFERRED_SYSTEMS,
  deferredFeatures: DECANS_DEFERRED_FEATURES,
});

export function getDecansDataset() {
  return DECANS_DATASET;
}

export function getDecanRowsForSign(signKey) {
  if (!isValidDecanSign(signKey)) {
    return EMPTY_ROWS;
  }

  return DECAN_ROWS_BY_SIGN[signKey];
}

export function getDecansSource() {
  return DECANS_DATA_SOURCE;
}

export function getDecansDeferredSystems() {
  return { ...DECANS_DEFERRED_SYSTEMS };
}

export function getDecansDeferredFeatures() {
  return [...DECANS_DEFERRED_FEATURES];
}

export function isValidDecanSign(signKey) {
  return DECAN_SIGN_KEYS.includes(signKey);
}

export function isValidDecanRuler(rulerKey) {
  return DECAN_RULER_KEYS.includes(rulerKey);
}

export function isValidDecanIndex(decanIndex) {
  return DECAN_INDEXES.includes(decanIndex);
}

function row(sign, decanIndex, startDegree, endDegreeExclusive, ruler, notes = []) {
  return Object.freeze({
    sourceKey: SOURCE_KEY,
    sourceSystem: DECAN_SOURCE_SYSTEMS.STAR_OF_MAGI,
    sign,
    signRu: DECAN_SIGN_LABELS[sign],
    decanIndex,
    startDegree,
    endDegreeExclusive,
    ruler,
    rulerRu: DECAN_RULER_LABELS[ruler],
    sourceFigure: SOURCE_FIGURE,
    sourceTitle: SOURCE_TITLE,
    sourceRow: `${sign}-${decanIndex}`,
    verificationStatus: DECANS_VERIFICATION_STATUS.VERIFIED,
    sourceCheck: 'match',
    notes: Object.freeze([...notes]),
  });
}

function freezeRows(rows) {
  return Object.freeze([...rows]);
}
