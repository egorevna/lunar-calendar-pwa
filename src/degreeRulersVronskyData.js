const SOURCE_KEY = 'degree-rulers-vronsky-table-7';
const SOURCE_SYSTEM = 'vronsky-degree-rulers';
const SOURCE_TABLE = 'Table 7';
const SOURCE_TITLE = 'Управление градусами (по С. Вронскому)';

export const DEGREE_RULERS_VRONSKY_VERIFICATION_STATUS = Object.freeze({
  VERIFIED: 'verified',
  NEEDS_REVIEW: 'needsReview',
  DRAFT: 'draft',
  REJECTED: 'rejected',
});

export const DEGREE_RULER_VRONSKY_SOURCE_SYSTEMS = Object.freeze({
  VRONSKY_TABLE_7: SOURCE_SYSTEM,
  STAR_OF_MAGI_TABLE_6: 'star-of-magi-degree-rulers-separate',
});

export const DEGREE_RULERS_VRONSKY_SOURCE = Object.freeze({
  sourceKey: SOURCE_KEY,
  sourceName: 'С. Вронский',
  sourceSystem: DEGREE_RULER_VRONSKY_SOURCE_SYSTEMS.VRONSKY_TABLE_7,
  tableNumber: 7,
  tableName: SOURCE_TITLE,
  sourceType: 'user-provided-image-tome2-cross-reference-and-manual-verification',
  sourceReference: 'table7.jpg; Вронский Том 2 / Градусология',
  verificationStatus: DEGREE_RULERS_VRONSKY_VERIFICATION_STATUS.VERIFIED,
  verificationReport: 'DEGREE_RULERS_TABLE_7_VERIFICATION_REPORT.md',
  transcriptionDraft: 'DEGREE_RULERS_TABLE_7_TRANSCRIPTION_DRAFT.md',
  tome2CrossReference: 'DEGREE_RULERS_TABLE_7_TOME2_CROSS_REFERENCE.md',
  rowCount: 360,
  active: true,
  enteredBy: 'Task 10.8c draft transcription',
  reviewedBy: 'Task 10.8d and Task 10.8d-fix image and Tome 2 cross-reference review',
  version: '1.0.0',
  notes: Object.freeze([
    'This dataset is Table 7 / Vronsky degree rulers only.',
    'It must not be mixed with Table 6 / Star of the Magi degree rulers.',
    'Rows may contain multiple rulers.',
    'Rows may contain retrograde markers.',
    'Rows may contain outer planets, Chiron, and Proserpina when verified from Tome 2.',
  ]),
});

export const DEGREE_RULERS_VRONSKY_DEGREE_POLICY = Object.freeze({
  type: 'integer-degree',
  validDegrees: '0 through 29',
  futureLookupRule: 'degreeIndex = floor(degreeWithinSign)',
  futureLookupValidRange: '0 <= degreeWithinSign < 30',
  degree30: 'invalid / next sign handled upstream',
  sourceSystem: DEGREE_RULER_VRONSKY_SOURCE_SYSTEMS.VRONSKY_TABLE_7,
});

export const DEGREE_RULERS_VRONSKY_ROW_MODEL = Object.freeze({
  supportsMultipleRulers: true,
  supportsRetrogradeMarkers: true,
  supportsOuterPlanets: true,
  supportsChiron: true,
  supportsProserpina: true,
  preservesSourceTokens: true,
});

export const DEGREE_RULERS_VRONSKY_DEFERRED_SYSTEMS = Object.freeze({
  starOfMagiTable6Separate: DEGREE_RULER_VRONSKY_SOURCE_SYSTEMS.STAR_OF_MAGI_TABLE_6,
});

export const DEGREE_RULERS_VRONSKY_DEFERRED_FEATURES = Object.freeze([
  'fixedStars',
  'houses',
  'ASC/MC',
  'transits',
  'interpretations',
  'ritualScoring',
]);

const DEGREE_RULER_SIGN_LABELS = Object.freeze({
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

const DEGREE_RULER_LABELS = Object.freeze({
  sun: 'Солнце',
  moon: 'Луна',
  mercury: 'Меркурий',
  venus: 'Венера',
  mars: 'Марс',
  jupiter: 'Юпитер',
  saturn: 'Сатурн',
  uranus: 'Уран',
  neptune: 'Нептун',
  pluto: 'Плутон',
  chiron: 'Хирон',
  proserpina: 'Прозерпина',
});

const SOURCE_TOKEN_TO_RULER_KEY = Object.freeze({
  Sun: 'sun',
  Moon: 'moon',
  Mercury: 'mercury',
  Venus: 'venus',
  Mars: 'mars',
  Jupiter: 'jupiter',
  Saturn: 'saturn',
  Uranus: 'uranus',
  Neptune: 'neptune',
  Pluto: 'pluto',
  Chiron: 'chiron',
  Proserpina: 'proserpina',
});

const DEGREE_RULER_SOURCE_TOKENS_BY_SIGN = deepFreeze({
  aries: [
    ['Mars', 'Pluto R'],
    ['Sun'],
    ['Venus', 'Chiron R'],
    ['Mercury', 'Proserpina'],
    ['Moon'],
    ['Saturn', 'Uranus R'],
    ['Jupiter', 'Neptune R'],
    ['Mars', 'Pluto R'],
    ['Sun'],
    ['Venus', 'Chiron R'],
    ['Mercury', 'Proserpina'],
    ['Moon'],
    ['Saturn', 'Uranus R'],
    ['Jupiter', 'Neptune R'],
    ['Mars', 'Pluto R'],
    ['Sun'],
    ['Venus', 'Chiron R'],
    ['Mercury', 'Proserpina'],
    ['Moon'],
    ['Saturn', 'Uranus R'],
    ['Jupiter', 'Neptune R'],
    ['Mars', 'Pluto R'],
    ['Sun'],
    ['Venus', 'Chiron R'],
    ['Mercury', 'Proserpina'],
    ['Moon'],
    ['Saturn', 'Uranus R'],
    ['Jupiter', 'Neptune R'],
    ['Mars', 'Pluto R'],
    ['Sun'],
  ],
  taurus: [
    ['Chiron', 'Venus R'],
    ['Mercury', 'Proserpina'],
    ['Moon'],
    ['Uranus', 'Saturn R'],
    ['Jupiter', 'Neptune'],
    ['Pluto', 'Mars R'],
    ['Sun'],
    ['Chiron', 'Venus R'],
    ['Mercury', 'Proserpina'],
    ['Moon'],
    ['Uranus', 'Saturn R'],
    ['Jupiter', 'Neptune'],
    ['Pluto', 'Mars R'],
    ['Sun'],
    ['Chiron', 'Venus R'],
    ['Mercury', 'Proserpina'],
    ['Moon'],
    ['Uranus', 'Saturn R'],
    ['Jupiter', 'Neptune'],
    ['Pluto', 'Mars R'],
    ['Sun'],
    ['Chiron', 'Venus R'],
    ['Mercury', 'Proserpina'],
    ['Moon'],
    ['Uranus', 'Saturn R'],
    ['Jupiter', 'Neptune'],
    ['Pluto', 'Mars R'],
    ['Sun'],
    ['Chiron', 'Venus R'],
    ['Mercury', 'Proserpina'],
  ],
  gemini: [
    ['Mercury R', 'Proserpina'],
    ['Moon'],
    ['Uranus', 'Saturn'],
    ['Jupiter', 'Neptune R'],
    ['Mars', 'Pluto'],
    ['Sun'],
    ['Venus', 'Chiron'],
    ['Mercury R', 'Proserpina R'],
    ['Moon'],
    ['Uranus', 'Saturn'],
    ['Jupiter', 'Neptune R'],
    ['Mars', 'Pluto'],
    ['Sun'],
    ['Chiron', 'Venus'],
    ['Mercury R', 'Proserpina'],
    ['Moon'],
    ['Uranus', 'Saturn'],
    ['Jupiter', 'Neptune R'],
    ['Mars', 'Pluto'],
    ['Sun'],
    ['Venus', 'Chiron'],
    ['Mercury R', 'Proserpina R'],
    ['Moon'],
    ['Saturn'],
    ['Jupiter', 'Neptune R'],
    ['Mars', 'Pluto'],
    ['Sun'],
    ['Venus', 'Chiron'],
    ['Mercury R', 'Proserpina R'],
    ['Moon'],
  ],
  cancer: [
    ['Moon'],
    ['Saturn', 'Uranus R'],
    ['Jupiter', 'Neptune R'],
    ['Mars', 'Pluto R'],
    ['Sun'],
    ['Venus', 'Chiron'],
    ['Mercury', 'Proserpina'],
    ['Moon'],
    ['Saturn', 'Uranus R'],
    ['Jupiter', 'Neptune R'],
    ['Mars', 'Pluto R'],
    ['Sun'],
    ['Venus', 'Chiron'],
    ['Mercury', 'Proserpina'],
    ['Moon'],
    ['Saturn', 'Uranus R'],
    ['Jupiter', 'Neptune R'],
    ['Mars', 'Pluto R'],
    ['Sun'],
    ['Venus', 'Chiron'],
    ['Mercury', 'Proserpina'],
    ['Moon'],
    ['Saturn', 'Uranus R'],
    ['Jupiter', 'Neptune R'],
    ['Mars', 'Pluto R'],
    ['Sun'],
    ['Venus', 'Chiron'],
    ['Mercury', 'Proserpina'],
    ['Moon'],
    ['Saturn', 'Uranus R'],
  ],
  leo: [
    ['Sun'],
    ['Venus', 'Chiron'],
    ['Mercury', 'Proserpina'],
    ['Moon'],
    ['Uranus', 'Saturn R'],
    ['Neptune', 'Jupiter R'],
    ['Pluto', 'Mars R'],
    ['Sun'],
    ['Venus', 'Chiron'],
    ['Mercury', 'Proserpina'],
    ['Moon'],
    ['Uranus', 'Saturn R'],
    ['Neptune', 'Jupiter R'],
    ['Pluto', 'Mars R'],
    ['Sun'],
    ['Venus', 'Chiron'],
    ['Mercury', 'Proserpina'],
    ['Moon'],
    ['Uranus', 'Saturn R'],
    ['Neptune', 'Jupiter R'],
    ['Pluto', 'Mars R'],
    ['Sun'],
    ['Venus', 'Chiron'],
    ['Mercury', 'Proserpina'],
    ['Moon'],
    ['Uranus', 'Saturn R'],
    ['Neptune', 'Jupiter R'],
    ['Pluto', 'Mars R'],
    ['Sun'],
    ['Venus', 'Chiron'],
  ],
  virgo: [
    ['Mercury', 'Proserpina'],
    ['Moon'],
    ['Saturn', 'Uranus'],
    ['Neptune', 'Jupiter R'],
    ['Mars', 'Pluto'],
    ['Sun'],
    ['Venus', 'Chiron R'],
    ['Mercury', 'Proserpina'],
    ['Moon'],
    ['Saturn', 'Uranus'],
    ['Neptune', 'Jupiter R'],
    ['Mars', 'Pluto'],
    ['Sun'],
    ['Venus', 'Chiron R'],
    ['Mercury', 'Proserpina'],
    ['Moon'],
    ['Saturn', 'Uranus'],
    ['Neptune', 'Jupiter R'],
    ['Mars', 'Pluto'],
    ['Sun'],
    ['Venus', 'Chiron R'],
    ['Mercury', 'Proserpina'],
    ['Moon'],
    ['Saturn', 'Uranus'],
    ['Neptune', 'Jupiter R'],
    ['Mars', 'Pluto'],
    ['Sun'],
    ['Venus', 'Chiron R'],
    ['Mercury', 'Proserpina'],
    ['Moon'],
  ],
  libra: [
    ['Venus', 'Chiron R'],
    ['Mercury', 'Proserpina'],
    ['Moon'],
    ['Saturn', 'Uranus R'],
    ['Jupiter', 'Neptune'],
    ['Mars', 'Pluto R'],
    ['Sun'],
    ['Venus', 'Chiron R'],
    ['Mercury', 'Proserpina'],
    ['Moon'],
    ['Saturn', 'Uranus R'],
    ['Jupiter', 'Neptune'],
    ['Mars', 'Pluto R'],
    ['Sun'],
    ['Venus', 'Chiron R'],
    ['Mercury', 'Proserpina'],
    ['Moon'],
    ['Saturn', 'Uranus R'],
    ['Jupiter', 'Neptune'],
    ['Mars', 'Pluto R'],
    ['Sun'],
    ['Venus', 'Chiron R'],
    ['Mercury', 'Proserpina'],
    ['Moon'],
    ['Saturn', 'Uranus R'],
    ['Jupiter', 'Neptune'],
    ['Mars', 'Pluto R'],
    ['Sun'],
    ['Venus', 'Chiron R'],
    ['Mercury', 'Proserpina'],
  ],
  scorpio: [
    ['Pluto', 'Mars R'],
    ['Sun'],
    ['Chiron', 'Venus R'],
    ['Mercury', 'Proserpina'],
    ['Moon'],
    ['Uranus', 'Saturn R'],
    ['Jupiter', 'Neptune'],
    ['Pluto', 'Mars R'],
    ['Sun'],
    ['Chiron', 'Venus R'],
    ['Mercury', 'Proserpina'],
    ['Moon'],
    ['Uranus', 'Saturn R'],
    ['Jupiter', 'Neptune'],
    ['Pluto', 'Mars R'],
    ['Sun'],
    ['Chiron', 'Venus R'],
    ['Mercury', 'Proserpina'],
    ['Moon'],
    ['Uranus', 'Saturn R'],
    ['Jupiter', 'Neptune'],
    ['Pluto', 'Mars R'],
    ['Sun'],
    ['Chiron', 'Venus R'],
    ['Mercury', 'Proserpina'],
    ['Moon'],
    ['Uranus', 'Saturn R'],
    ['Jupiter', 'Neptune'],
    ['Pluto', 'Mars R'],
    ['Sun'],
  ],
  sagittarius: [
    ['Jupiter', 'Neptune R'],
    ['Mars', 'Pluto'],
    ['Sun'],
    ['Chiron', 'Venus'],
    ['Mercury R', 'Proserpina R'],
    ['Moon'],
    ['Saturn', 'Uranus'],
    ['Jupiter', 'Neptune R'],
    ['Mars', 'Pluto'],
    ['Sun'],
    ['Chiron', 'Venus'],
    ['Mercury R', 'Proserpina R'],
    ['Moon'],
    ['Saturn', 'Uranus'],
    ['Jupiter', 'Neptune R'],
    ['Mars', 'Pluto'],
    ['Sun'],
    ['Chiron', 'Venus'],
    ['Mercury R', 'Proserpina R'],
    ['Moon'],
    ['Saturn', 'Uranus'],
    ['Jupiter', 'Neptune R'],
    ['Mars', 'Pluto'],
    ['Sun'],
    ['Chiron', 'Venus'],
    ['Mercury R', 'Proserpina R'],
    ['Moon'],
    ['Saturn', 'Uranus'],
    ['Jupiter', 'Neptune R'],
    ['Mars', 'Pluto'],
  ],
  capricorn: [
    ['Saturn', 'Uranus R'],
    ['Jupiter', 'Neptune R'],
    ['Mars', 'Pluto R'],
    ['Sun'],
    ['Venus', 'Chiron'],
    ['Mercury', 'Proserpina'],
    ['Moon'],
    ['Saturn', 'Uranus R'],
    ['Jupiter', 'Neptune R'],
    ['Mars', 'Pluto R'],
    ['Sun'],
    ['Venus', 'Chiron'],
    ['Mercury', 'Proserpina'],
    ['Moon'],
    ['Saturn', 'Uranus R'],
    ['Jupiter', 'Neptune R'],
    ['Mars', 'Pluto R'],
    ['Sun'],
    ['Venus', 'Chiron'],
    ['Mercury', 'Proserpina'],
    ['Moon'],
    ['Saturn', 'Uranus R'],
    ['Jupiter', 'Neptune R'],
    ['Mars', 'Pluto R'],
    ['Sun'],
    ['Venus', 'Chiron'],
    ['Mercury', 'Proserpina'],
    ['Moon'],
    ['Saturn', 'Uranus R'],
    ['Jupiter', 'Neptune R'],
  ],
  aquarius: [
    ['Uranus', 'Saturn R'],
    ['Neptune', 'Jupiter R'],
    ['Pluto', 'Mars R'],
    ['Sun'],
    ['Venus', 'Chiron'],
    ['Mercury', 'Proserpina'],
    ['Moon'],
    ['Uranus', 'Saturn R'],
    ['Neptune', 'Jupiter R'],
    ['Pluto', 'Mars R'],
    ['Sun'],
    ['Venus', 'Chiron'],
    ['Mercury', 'Proserpina'],
    ['Moon'],
    ['Uranus', 'Saturn R'],
    ['Neptune', 'Jupiter R'],
    ['Pluto', 'Mars R'],
    ['Sun'],
    ['Venus', 'Chiron'],
    ['Mercury', 'Proserpina'],
    ['Moon'],
    ['Uranus', 'Saturn R'],
    ['Neptune', 'Jupiter R'],
    ['Pluto', 'Mars R'],
    ['Sun'],
    ['Venus', 'Chiron'],
    ['Mercury', 'Proserpina'],
    ['Moon'],
    ['Uranus', 'Saturn R'],
    ['Neptune', 'Jupiter R'],
  ],
  pisces: [
    ['Neptune', 'Jupiter R'],
    ['Mars', 'Pluto'],
    ['Sun'],
    ['Venus', 'Chiron R'],
    ['Mercury', 'Proserpina'],
    ['Moon'],
    ['Saturn', 'Uranus'],
    ['Neptune', 'Jupiter R'],
    ['Mars', 'Pluto'],
    ['Sun'],
    ['Venus', 'Chiron R'],
    ['Mercury', 'Proserpina'],
    ['Moon'],
    ['Saturn', 'Uranus'],
    ['Neptune', 'Jupiter R'],
    ['Mars', 'Pluto'],
    ['Sun'],
    ['Venus', 'Chiron R'],
    ['Mercury', 'Proserpina'],
    ['Moon'],
    ['Saturn', 'Uranus'],
    ['Neptune', 'Jupiter R'],
    ['Mars', 'Pluto'],
    ['Sun'],
    ['Venus', 'Chiron R'],
    ['Mercury', 'Proserpina'],
    ['Moon'],
    ['Saturn', 'Uranus'],
    ['Neptune', 'Jupiter R'],
    ['Mars', 'Pluto'],
  ],
});

const DEGREE_RULER_SIGN_KEYS = Object.freeze(Object.keys(DEGREE_RULER_SIGN_LABELS));
const DEGREE_RULER_KEYS = Object.freeze(Object.keys(DEGREE_RULER_LABELS));
const EMPTY_ROWS = Object.freeze([]);

export const DEGREE_RULERS_VRONSKY_ROWS = freezeRows(
  DEGREE_RULER_SIGN_KEYS.flatMap((signKey) =>
    DEGREE_RULER_SOURCE_TOKENS_BY_SIGN[signKey].map((sourceTokens, degree) =>
      row(signKey, degree, sourceTokens),
    ),
  ),
);

const DEGREE_RULER_ROWS_BY_SIGN = Object.freeze(
  Object.fromEntries(
    DEGREE_RULER_SIGN_KEYS.map((signKey) => [
      signKey,
      Object.freeze(DEGREE_RULERS_VRONSKY_ROWS.filter((item) => item.sign === signKey)),
    ]),
  ),
);

const DEGREE_RULERS_VRONSKY_DATASET = Object.freeze({
  source: DEGREE_RULERS_VRONSKY_SOURCE,
  rows: DEGREE_RULERS_VRONSKY_ROWS,
  signs: DEGREE_RULER_ROWS_BY_SIGN,
  rowCount: DEGREE_RULERS_VRONSKY_ROWS.length,
  active: DEGREE_RULERS_VRONSKY_SOURCE.active,
  degreePolicy: DEGREE_RULERS_VRONSKY_DEGREE_POLICY,
  rowModel: DEGREE_RULERS_VRONSKY_ROW_MODEL,
  deferredSystems: DEGREE_RULERS_VRONSKY_DEFERRED_SYSTEMS,
  deferredFeatures: DEGREE_RULERS_VRONSKY_DEFERRED_FEATURES,
});

export function getDegreeRulersVronskyDataset() {
  return DEGREE_RULERS_VRONSKY_DATASET;
}

export function getDegreeRulersVronskyRowsForSign(signKey) {
  if (!isValidVronskyDegreeRulerSign(signKey)) {
    return EMPTY_ROWS;
  }

  return DEGREE_RULER_ROWS_BY_SIGN[signKey];
}

export function getDegreeRulersVronskySource() {
  return DEGREE_RULERS_VRONSKY_SOURCE;
}

export function getDegreeRulersVronskyDeferredSystems() {
  return { ...DEGREE_RULERS_VRONSKY_DEFERRED_SYSTEMS };
}

export function getDegreeRulersVronskyDeferredFeatures() {
  return [...DEGREE_RULERS_VRONSKY_DEFERRED_FEATURES];
}

export function isValidVronskyDegreeRulerSign(signKey) {
  return DEGREE_RULER_SIGN_KEYS.includes(signKey);
}

export function isValidVronskyRulerKey(rulerKey) {
  return DEGREE_RULER_KEYS.includes(rulerKey);
}

export function isValidVronskyDegreeIndex(degree) {
  return Number.isInteger(degree) && degree >= 0 && degree <= 29;
}

export function isValidVronskyRulerEntry(entry) {
  return Boolean(
    entry &&
      typeof entry === 'object' &&
      isValidVronskyRulerKey(entry.key) &&
      typeof entry.rulerRu === 'string' &&
      entry.rulerRu.length > 0 &&
      typeof entry.retrograde === 'boolean' &&
      typeof entry.sourceToken === 'string' &&
      entry.sourceToken.length > 0,
  );
}

function row(sign, degree, sourceTokens) {
  const frozenSourceTokens = Object.freeze([...sourceTokens]);
  const rulers = Object.freeze(frozenSourceTokens.map(parseRulerToken));

  return Object.freeze({
    sourceKey: SOURCE_KEY,
    sourceSystem: DEGREE_RULER_VRONSKY_SOURCE_SYSTEMS.VRONSKY_TABLE_7,
    sign,
    signRu: DEGREE_RULER_SIGN_LABELS[sign],
    degree,
    sourceTokens: frozenSourceTokens,
    rulers,
    sourceTable: SOURCE_TABLE,
    sourceTitle: SOURCE_TITLE,
    sourceRow: sign + '-' + degree,
    verificationStatus: DEGREE_RULERS_VRONSKY_VERIFICATION_STATUS.VERIFIED,
    sourceCheck: 'match',
    notes: Object.freeze([]),
  });
}

function parseRulerToken(sourceToken) {
  const retrograde = sourceToken.endsWith(' R');
  const baseToken = retrograde ? sourceToken.slice(0, -2) : sourceToken;
  const key = SOURCE_TOKEN_TO_RULER_KEY[baseToken];

  return Object.freeze({
    key,
    rulerRu: DEGREE_RULER_LABELS[key],
    retrograde,
    sourceToken,
  });
}

function freezeRows(rows) {
  return Object.freeze([...rows]);
}

function deepFreeze(value) {
  if (Array.isArray(value)) {
    value.forEach(deepFreeze);
  } else if (value && typeof value === 'object') {
    Object.values(value).forEach(deepFreeze);
  }

  return Object.freeze(value);
}
