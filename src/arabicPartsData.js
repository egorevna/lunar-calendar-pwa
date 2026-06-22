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
    'Lot of Spirit is verified in Task 12.5b as the inverse day/night pair to Pars Fortuna.',
    'Additional parts remain deferred until source verification.',
  ],
});

export const VRONSKY_ARABIC_PARTS_SOURCE_METADATA = deepFreeze({
  sourceSystem: 'vronsky-table-17-arabic-points',
  sourceCorpus: 'Вронский, Том 1, Приложение 2, Таблица 17 — Арабские точки',
  formulaTradition: 'Vronsky Table 17 Arabic Points',
  sourceSection: 'Для дневного рождения',
  sourceStatus: 'sourceVerified',
  sourceRecordingStatus: 'manuallyRecordedFromSource',
  nightFormulaStatus: 'missing/notVerified',
  chartSectPolicy: 'dayOnly',
  engineStatus: 'pendingEngineExpansion',
  activationStatus: 'inactiveUntilEngineTask',
  implementationStatus: 'selectedForTask15_4',
  externalTraditions: [],
});

export const VRONSKY_SIMPLE_ARABIC_PART_KEYS = deepFreeze([
  'pars-amoris',
  'pars-artis',
  'pars-creationis',
  'pars-fratrum-et-sororum',
  'pars-hereditatis',
  'pars-itineris',
  'pars-liberorum',
  'pars-matris',
  'pars-patris',
  'pars-pueri',
  'astrologia',
  'pars-mercaturae',
]);

const VRONSKY_SIMPLE_ARABIC_PART_ROWS = [
  createVronskySimpleArabicPartRow({
    key: 'pars-amoris',
    labelRu: 'Точка любви',
    labelEn: 'Pars amoris',
    sourceLabel: 'Pars amoris',
    sourceLabelRu: 'точка любви',
    sourceExpression: 'AsC + Венера - Солнце',
    expression: 'ASC + Venus - Sun',
    operands: ['asc', '+', 'venus', '-', 'sun'],
    requiredInputs: ['asc', 'venus', 'sun', 'chartSect'],
  }),
  createVronskySimpleArabicPartRow({
    key: 'pars-artis',
    labelRu: 'Точка искусства',
    labelEn: 'Pars artis',
    sourceLabel: 'Pars artis',
    sourceLabelRu: 'точка искусства',
    sourceExpression: 'AsC + Меркурий - Венера',
    expression: 'ASC + Mercury - Venus',
    operands: ['asc', '+', 'mercury', '-', 'venus'],
    requiredInputs: ['asc', 'mercury', 'venus', 'chartSect'],
  }),
  createVronskySimpleArabicPartRow({
    key: 'pars-creationis',
    labelRu: 'Точка друзей',
    labelEn: 'Pars creationis',
    sourceLabel: 'Pars creationis',
    sourceLabelRu: 'точка друзей',
    sourceExpression: 'AsC + Луна - Уран',
    expression: 'ASC + Moon - Uranus',
    operands: ['asc', '+', 'moon', '-', 'uranus'],
    requiredInputs: ['asc', 'moon', 'uranus', 'chartSect'],
  }),
  createVronskySimpleArabicPartRow({
    key: 'pars-fratrum-et-sororum',
    labelRu: 'Братья и сестры',
    labelEn: 'Pars fratrum et sororum',
    sourceLabel: 'Pars fratrum et sororum',
    sourceLabelRu: 'братья и сестры',
    sourceExpression: 'AsC + Юпитер - Сатурн',
    expression: 'ASC + Jupiter - Saturn',
    operands: ['asc', '+', 'jupiter', '-', 'saturn'],
    requiredInputs: ['asc', 'jupiter', 'saturn', 'chartSect'],
  }),
  createVronskySimpleArabicPartRow({
    key: 'pars-hereditatis',
    labelRu: 'Точка наследства',
    labelEn: 'Pars hereditatis',
    sourceLabel: 'Pars hereditatis',
    sourceLabelRu: 'точка наследства',
    sourceExpression: 'AsC + Луна - Сатурн',
    expression: 'ASC + Moon - Saturn',
    operands: ['asc', '+', 'moon', '-', 'saturn'],
    requiredInputs: ['asc', 'moon', 'saturn', 'chartSect'],
  }),
  createVronskySimpleArabicPartRow({
    key: 'pars-itineris',
    labelRu: 'Точка веры',
    labelEn: 'Pars itineris',
    sourceLabel: 'Pars itineris',
    sourceLabelRu: 'точка веры',
    sourceExpression: 'AsC + Меркурий - Луна',
    expression: 'ASC + Mercury - Moon',
    operands: ['asc', '+', 'mercury', '-', 'moon'],
    requiredInputs: ['asc', 'mercury', 'moon', 'chartSect'],
  }),
  createVronskySimpleArabicPartRow({
    key: 'pars-liberorum',
    labelRu: 'Точка свободы',
    labelEn: 'Pars liberorum',
    sourceLabel: 'Pars liberorum',
    sourceLabelRu: 'точка свободы',
    sourceExpression: 'AsC + Сатурн - Юпитер',
    expression: 'ASC + Saturn - Jupiter',
    operands: ['asc', '+', 'saturn', '-', 'jupiter'],
    requiredInputs: ['asc', 'saturn', 'jupiter', 'chartSect'],
  }),
  createVronskySimpleArabicPartRow({
    key: 'pars-matris',
    labelRu: 'Точка матери',
    labelEn: 'Pars matris',
    sourceLabel: 'Pars matris',
    sourceLabelRu: 'точка матери',
    sourceExpression: 'AsC + Луна - Венера',
    expression: 'ASC + Moon - Venus',
    operands: ['asc', '+', 'moon', '-', 'venus'],
    requiredInputs: ['asc', 'moon', 'venus', 'chartSect'],
  }),
  createVronskySimpleArabicPartRow({
    key: 'pars-patris',
    labelRu: 'Точка отца',
    labelEn: 'Pars patris',
    sourceLabel: 'Pars patris',
    sourceLabelRu: 'точка отца',
    sourceExpression: 'AsC + Солнце - Сатурн',
    expression: 'ASC + Sun - Saturn',
    operands: ['asc', '+', 'sun', '-', 'saturn'],
    requiredInputs: ['asc', 'sun', 'saturn', 'chartSect'],
  }),
  createVronskySimpleArabicPartRow({
    key: 'pars-pueri',
    labelRu: 'Дети мужского пола',
    labelEn: 'Pars pueri',
    sourceLabel: 'Pars pueri',
    sourceLabelRu: 'дети мужского пола',
    sourceExpression: 'AsC + Юпитер - Луна',
    expression: 'ASC + Jupiter - Moon',
    operands: ['asc', '+', 'jupiter', '-', 'moon'],
    requiredInputs: ['asc', 'jupiter', 'moon', 'chartSect'],
  }),
  createVronskySimpleArabicPartRow({
    key: 'astrologia',
    labelRu: 'Астрология',
    labelEn: 'Astrologia',
    sourceLabel: 'Астрология',
    sourceLabelRu: 'Астрология',
    sourceExpression: 'AsC + Меркурий - Уран',
    expression: 'ASC + Mercury - Uranus',
    operands: ['asc', '+', 'mercury', '-', 'uranus'],
    requiredInputs: ['asc', 'mercury', 'uranus', 'chartSect'],
  }),
  createVronskySimpleArabicPartRow({
    key: 'pars-mercaturae',
    labelRu: 'Торговля',
    labelEn: 'Pars mercaturae',
    sourceLabel: 'Торговля',
    sourceLabelRu: 'Торговля',
    sourceExpression: 'AsC + Меркурий - Солнце',
    expression: 'ASC + Mercury - Sun',
    operands: ['asc', '+', 'mercury', '-', 'sun'],
    requiredInputs: ['asc', 'mercury', 'sun', 'chartSect'],
  }),
];

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
    active: true,
    verificationStatus: ARABIC_PARTS_VERIFICATION_STATUS.VERIFIED,
    formulaType: 'day-night',
    formula: {
      day: {
        expression: 'ASC + Sun - Moon',
        operands: ['asc', '+', 'sun', '-', 'moon'],
      },
      night: {
        expression: 'ASC + Moon - Sun',
        operands: ['asc', '+', 'moon', '-', 'sun'],
      },
    },
    requiredInputs: ['asc', 'sun', 'moon', 'chartSect'],
    output: {
      longitude: true,
      houseAssignment: 'deferred-to-task-12.7',
      interpretation: false,
    },
    sourceNote: 'Verified in Task 12.5b source decision as inverse day/night pair to Pars Fortuna.',
    notes: [],
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
  ...VRONSKY_SIMPLE_ARABIC_PART_ROWS,
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
    pendingRows: getPendingArabicPartsFormulaRows(),
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
    row.verificationStatus === ARABIC_PARTS_VERIFICATION_STATUS.DEFERRED
  )));
}

export function getVronskyArabicPartsFormulaRows() {
  return Object.freeze(ARABIC_PARTS_FORMULA_ROWS.filter((row) => (
    row.sourceSystem === VRONSKY_ARABIC_PARTS_SOURCE_METADATA.sourceSystem
  )));
}

export function getVronskySimpleArabicPartsFormulaRows() {
  return Object.freeze(getVronskyArabicPartsFormulaRows().filter((row) => (
    VRONSKY_SIMPLE_ARABIC_PART_KEYS.includes(row.key)
    && row.engineStatus === 'pendingEngineExpansion'
    && row.activationStatus === 'inactiveUntilEngineTask'
  )));
}

export function getPendingArabicPartsFormulaRows() {
  return Object.freeze(ARABIC_PARTS_FORMULA_ROWS.filter((row) => (
    row.engineStatus === 'pendingEngineExpansion'
    || row.activationStatus === 'inactiveUntilEngineTask'
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
    pendingFormulaKeys: Object.freeze(getPendingArabicPartsFormulaRows().map((row) => row.key)),
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

function createVronskySimpleArabicPartRow({
  key,
  labelRu,
  labelEn,
  sourceLabel,
  sourceLabelRu,
  sourceExpression,
  expression,
  operands,
  requiredInputs,
}) {
  return {
    key,
    labelRu,
    labelEn,
    aliases: [sourceLabel, sourceLabelRu].filter(Boolean),
    active: false,
    verificationStatus: ARABIC_PARTS_VERIFICATION_STATUS.CANDIDATE,
    formulaType: 'vronsky-day-only-pending',
    formula: {
      day: {
        expression,
        sourceExpression,
        operands,
      },
      night: null,
    },
    requiredInputs,
    output: {
      longitude: false,
      houseAssignment: false,
      interpretation: false,
    },
    sourceLabel,
    sourceLabelRu,
    sourceSystem: VRONSKY_ARABIC_PARTS_SOURCE_METADATA.sourceSystem,
    sourceCorpus: VRONSKY_ARABIC_PARTS_SOURCE_METADATA.sourceCorpus,
    formulaTradition: VRONSKY_ARABIC_PARTS_SOURCE_METADATA.formulaTradition,
    sourceSection: VRONSKY_ARABIC_PARTS_SOURCE_METADATA.sourceSection,
    sourceStatus: VRONSKY_ARABIC_PARTS_SOURCE_METADATA.sourceStatus,
    sourceRecordingStatus: VRONSKY_ARABIC_PARTS_SOURCE_METADATA.sourceRecordingStatus,
    nightFormulaStatus: VRONSKY_ARABIC_PARTS_SOURCE_METADATA.nightFormulaStatus,
    chartSectPolicy: VRONSKY_ARABIC_PARTS_SOURCE_METADATA.chartSectPolicy,
    engineStatus: VRONSKY_ARABIC_PARTS_SOURCE_METADATA.engineStatus,
    activationStatus: VRONSKY_ARABIC_PARTS_SOURCE_METADATA.activationStatus,
    implementationStatus: VRONSKY_ARABIC_PARTS_SOURCE_METADATA.implementationStatus,
    externalTraditions: [...VRONSKY_ARABIC_PARTS_SOURCE_METADATA.externalTraditions],
    displaySafe: true,
    interpretation: false,
    sourceNote: 'Manually recorded from Vronsky Table 17 day-birth Arabic Points source materials; inactive until engine expansion.',
    notes: [
      'Day-only Vronsky source row.',
      'Night formula is missing / not verified.',
      'Formula must not be activated from non-Vronsky traditions.',
    ],
  };
}
