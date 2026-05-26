export const ARABIC_PARTS_VERIFICATION_STATUS = deepFreeze({
  VERIFIED: 'verified',
  CANDIDATE: 'candidate',
  DEFERRED: 'deferred',
  NEEDS_REVIEW: 'needsReview',
  REJECTED: 'rejected',
});

export const ARABIC_PARTS_SOURCE_DECISION = deepFreeze({
  sourceKey: 'sprint-12-arabic-parts-source-decision',
  sprint: 12,
  status: 'partial',
  activeFormulaPolicy: 'verified-only',
  notes: [
    'No Arabic Part formula is active unless verified.',
    'Pars Fortuna is the first active formula.',
    'Lot of Spirit and additional parts remain deferred until source verification.',
  ],
});

export const ARABIC_PARTS_FORMULA_ROWS = deepFreeze([
  {
    key: 'pars-fortuna',
    labelRu: 'Парс Фортуны',
    labelEn: 'Lot of Fortune',
    aliases: ['Pars Fortuna', 'Part of Fortune', 'Lot of Fortune'],
    active: true,
    verificationStatus: ARABIC_PARTS_VERIFICATION_STATUS.VERIFIED,
    calculationModule: 'src/parsFortuna.js',
    formulaType: 'day-night',
    formula: {
      day: {
        expression: 'ASC + Moon - Sun',
        operands: ['asc', '+', 'moon', '-', 'sun'],
      },
      night: {
        expression: 'ASC + Sun - Moon',
        operands: ['asc', '+', 'sun', '-', 'moon'],
      },
    },
    requiredInputs: ['asc', 'sun', 'moon', 'chartSect'],
    output: {
      longitude: true,
      houseAssignment: 'deferred-to-task-12.7',
      interpretation: false,
    },
    sourceNote: 'Verified in Task 12.4 against project formula policy.',
    notes: [],
  },
  {
    key: 'lot-of-spirit',
    labelRu: 'Жребий Духа',
    labelEn: 'Lot of Spirit',
    aliases: ['Lot of Spirit'],
    active: false,
    verificationStatus: ARABIC_PARTS_VERIFICATION_STATUS.DEFERRED,
    formulaType: 'day-night-candidate',
    formula: null,
    requiredInputs: ['asc', 'sun', 'moon', 'chartSect'],
    output: {
      longitude: false,
      houseAssignment: false,
      interpretation: false,
    },
    sourceNote: 'Deferred until formula source decision is verified.',
    notes: [
      'Candidate formula must not be activated from memory.',
    ],
  },
  {
    key: 'lot-of-eros',
    labelRu: 'Жребий Эроса',
    labelEn: 'Lot of Eros',
    aliases: ['Lot of Eros'],
    active: false,
    verificationStatus: ARABIC_PARTS_VERIFICATION_STATUS.DEFERRED,
    formulaType: 'candidate',
    formula: null,
    requiredInputs: [],
    output: {
      longitude: false,
      houseAssignment: false,
      interpretation: false,
    },
    sourceNote: 'Deferred until formula source decision is verified.',
    notes: [
      'Formula must not be activated from memory.',
    ],
  },
  {
    key: 'lot-of-necessity',
    labelRu: 'Жребий Необходимости',
    labelEn: 'Lot of Necessity',
    aliases: ['Lot of Necessity'],
    active: false,
    verificationStatus: ARABIC_PARTS_VERIFICATION_STATUS.DEFERRED,
    formulaType: 'candidate',
    formula: null,
    requiredInputs: [],
    output: {
      longitude: false,
      houseAssignment: false,
      interpretation: false,
    },
    sourceNote: 'Deferred until formula source decision is verified.',
    notes: [
      'Formula must not be activated from memory.',
    ],
  },
  {
    key: 'lot-of-basis',
    labelRu: 'Жребий Основания',
    labelEn: 'Lot of Basis',
    aliases: ['Lot of Basis'],
    active: false,
    verificationStatus: ARABIC_PARTS_VERIFICATION_STATUS.DEFERRED,
    formulaType: 'candidate',
    formula: null,
    requiredInputs: [],
    output: {
      longitude: false,
      houseAssignment: false,
      interpretation: false,
    },
    sourceNote: 'Deferred until formula source decision is verified.',
    notes: [
      'Formula must not be activated from memory.',
    ],
  },
  {
    key: 'lot-of-exaltation',
    labelRu: 'Жребий Возвышения',
    labelEn: 'Lot of Exaltation',
    aliases: ['Lot of Exaltation'],
    active: false,
    verificationStatus: ARABIC_PARTS_VERIFICATION_STATUS.DEFERRED,
    formulaType: 'candidate',
    formula: null,
    requiredInputs: [],
    output: {
      longitude: false,
      houseAssignment: false,
      interpretation: false,
    },
    sourceNote: 'Deferred until formula source decision is verified.',
    notes: [
      'Formula must not be activated from memory.',
    ],
  },
]);

const DEFERRED_REASONS = deepFreeze([
  'formulaSourceNotVerified',
  'notImplementedInSprint12Yet',
  'interpretationsDeferred',
]);

export function getArabicPartsFormulaDataset() {
  return Object.freeze({
    source: ARABIC_PARTS_SOURCE_DECISION,
    rows: ARABIC_PARTS_FORMULA_ROWS,
    activeRows: getActiveArabicPartsFormulas(),
    deferredRows: getDeferredArabicPartsFormulas(),
    policy: getArabicPartsFormulaPolicy(),
    deferredReasons: getArabicPartsDeferredReasons(),
  });
}

export function getActiveArabicPartsFormulas() {
  return Object.freeze(ARABIC_PARTS_FORMULA_ROWS.filter((row) => (
    row.active === true
    && row.verificationStatus === ARABIC_PARTS_VERIFICATION_STATUS.VERIFIED
  )));
}

export function getDeferredArabicPartsFormulas() {
  return Object.freeze(ARABIC_PARTS_FORMULA_ROWS.filter((row) => (
    row.active !== true
    || row.verificationStatus !== ARABIC_PARTS_VERIFICATION_STATUS.VERIFIED
  )));
}

export function getArabicPartFormulaByKey(key) {
  if (typeof key !== 'string' || key.trim() === '') {
    return null;
  }

  return ARABIC_PARTS_FORMULA_ROWS.find((row) => row.key === key) ?? null;
}

export function isVerifiedArabicPartFormula(rowOrKey) {
  const row = typeof rowOrKey === 'string'
    ? getArabicPartFormulaByKey(rowOrKey)
    : getArabicPartFormulaByKey(rowOrKey?.key);

  return row?.active === true
    && row?.verificationStatus === ARABIC_PARTS_VERIFICATION_STATUS.VERIFIED;
}

export function getArabicPartsFormulaPolicy() {
  return Object.freeze({
    verifiedOnly: true,
    noFormulaFromMemory: true,
    noInterpretations: true,
    dayNightRequiredForVariantFormulas: true,
    activeFormulaKeys: Object.freeze(getActiveArabicPartsFormulas().map((row) => row.key)),
    deferredFormulaKeys: Object.freeze(getDeferredArabicPartsFormulas().map((row) => row.key)),
  });
}

export function getArabicPartsDeferredReasons() {
  return DEFERRED_REASONS;
}

function deepFreeze(value) {
  if (!value || typeof value !== 'object') {
    return value;
  }

  Object.values(value).forEach((item) => {
    deepFreeze(item);
  });

  return Object.freeze(value);
}
