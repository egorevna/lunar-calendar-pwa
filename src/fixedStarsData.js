const SOURCE_KEY = 'vronsky-table-18-fixed-stars';
const SOURCE_SYSTEM = 'fixed-stars-vronsky-table-18';
const SOURCE_TABLE = 'Таблица 18';
const POSITION_POLICY = 'vronsky-source-columns-preserved-date-handling-deferred-to-task-14.4';
const INITIAL_REFERENCE_EPOCH = 1990;

const SIGN_LABELS = Object.freeze({
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

export const FIXED_STAR_VERIFICATION_STATUS = Object.freeze({
  VERIFIED: 'verified',
  CANDIDATE: 'candidate',
  DEFERRED: 'deferred',
  NEEDS_REVIEW: 'needsReview',
  REJECTED: 'rejected',
});

export const FIXED_STARS_SOURCE = deepFreeze({
  sourceKey: SOURCE_KEY,
  sourceSystem: SOURCE_SYSTEM,
  label: 'Вронский, Таблица 18 — Неподвижные звезды',
  sourceType: 'primary-astrology-source',
  validationPolicy: 'vronsky-primary-with-swiss-modern-validation',
  validationSource: 'Swiss / modern fixed-star validation where possible',
  coordinateSystem: 'tropical-ecliptic-longitude-source-columns',
  coordinateColumns: ['1950', '1970', '1990'],
  initialReferenceEpoch: INITIAL_REFERENCE_EPOCH,
  noOcrImport: true,
  noRowsFromMemory: true,
  rowActivationPolicy: 'manual-source-verification-required',
  version: '1.0.0',
  notes: [
    'Rows are manually checked against the provided Vronsky Table 18 reference photos.',
    'The 1990 column is preserved as the initial reference epoch for verified source rows.',
    'Date-of-birth position handling is deferred to Task 14.4.',
  ],
});

export const FIXED_STARS_ORB_POLICY = Object.freeze({
  key: 'fixed-stars-global-conjunction-orb-1deg',
  relationship: 'conjunction',
  globalOrbDegrees: 1,
  globalOrbText: '1°00′',
  perStarOverrides: false,
  perTargetOverrides: false,
  hiddenOrb: false,
});

export const FIXED_STARS_TARGET_POLICY = deepFreeze({
  activeTargetSet: ['natal-planets', 'angles'],
  activeTargets: [
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
    'asc',
    'mc',
    'dsc',
    'ic',
  ],
  deferredTargetSets: [
    'house-cusps',
    'lunar-nodes',
    'lilith',
    'selena',
    'pars-fortuna',
    'lot-of-spirit',
    'arabic-parts',
    'custom-points',
  ],
});

export const FIXED_STAR_RELATIONSHIP_POLICY = deepFreeze({
  activeRelationships: ['conjunction'],
  deferredRelationships: [
    'opposition',
    'square',
    'trine',
    'sextile',
    'paran',
    'heliacal-rising',
    'heliacal-setting',
  ],
});

export const FIXED_STARS_CATALOG_ROWS = freezeRows([
  row({
    key: 'algol',
    labelRu: 'Алголь',
    labelEn: 'Algol',
    designation: 'β Persei',
    sourceNameRu: 'Алголь',
    sourceDesignation: 'бета Персея',
    magnitudeText: '2-4',
    quality: 'Сатурн/Уран-Марс',
    imageReferences: ['2026-05-22 11.16.32.jpg'],
    modernValidation: { status: 'matched-in-local-swiss-fixed-star-file', name: 'Algol' },
    coordinates: {
      epoch1950: coordinate(1950, 'taurus', 25, 28, 55.4666666667),
      epoch1970: coordinate(1970, 'taurus', 25, 45, 55.75),
      epoch1990: coordinate(1990, 'taurus', 26, 2, 56.0333333333),
    },
  }),
  row({
    key: 'aldebaran',
    labelRu: 'Альдебаран',
    labelEn: 'Aldebaran',
    designation: 'α Tauri',
    sourceNameRu: 'Альдебаран',
    sourceDesignation: 'альфа Тельца',
    magnitudeText: '1',
    quality: 'Марс',
    imageReferences: ['2026-05-22 11.16.32.jpg'],
    modernValidation: { status: 'matched-in-local-swiss-fixed-star-file', name: 'Aldebaran' },
    coordinates: {
      epoch1950: coordinate(1950, 'gemini', 9, 5, 69.0833333333),
      epoch1970: coordinate(1970, 'gemini', 9, 22, 69.3666666667),
      epoch1990: coordinate(1990, 'gemini', 9, 39, 69.65),
    },
  }),
  row({
    key: 'rigel',
    labelRu: 'Ригель',
    labelEn: 'Rigel',
    designation: 'β Orionis',
    sourceNameRu: 'Ригель',
    sourceDesignation: 'бета Ориона',
    magnitudeText: '1',
    quality: 'Марс-Юпитер',
    imageReferences: ['2026-05-22 11.16.32.jpg'],
    modernValidation: { status: 'matched-in-local-swiss-fixed-star-file', name: 'Rigel' },
    coordinates: {
      epoch1950: coordinate(1950, 'gemini', 16, 8, 76.1333333333),
      epoch1970: coordinate(1970, 'gemini', 16, 25, 76.4166666667),
      epoch1990: coordinate(1990, 'gemini', 16, 42, 76.7),
    },
  }),
  row({
    key: 'betelgeuse',
    labelRu: 'Бетельгейзе',
    labelEn: 'Betelgeuse',
    designation: 'α Orionis',
    sourceNameRu: 'Бетельгейзе',
    sourceDesignation: 'альфа Ориона',
    magnitudeText: '1',
    quality: 'Марс-Меркурий',
    imageReferences: ['2026-05-22 11.16.34.jpg'],
    modernValidation: { status: 'matched-in-local-swiss-fixed-star-file', name: 'Betelgeuse' },
    coordinates: {
      epoch1950: coordinate(1950, 'gemini', 28, 4, 88.0666666667),
      epoch1970: coordinate(1970, 'gemini', 28, 20, 88.3333333333),
      epoch1990: coordinate(1990, 'gemini', 28, 37, 88.6166666667),
    },
  }),
  row({
    key: 'sirius',
    labelRu: 'Сириус',
    labelEn: 'Sirius',
    designation: 'α Canis Majoris',
    sourceNameRu: 'Сириус',
    sourceDesignation: 'альфа Б. Пса',
    magnitudeText: '1',
    quality: 'Марс-Юпитер',
    imageReferences: ['2026-05-22 11.16.34.jpg'],
    modernValidation: { status: 'matched-in-local-swiss-fixed-star-file', name: 'Sirius' },
    coordinates: {
      epoch1950: coordinate(1950, 'cancer', 13, 23, 103.3833333333),
      epoch1970: coordinate(1970, 'cancer', 13, 40, 103.6666666667),
      epoch1990: coordinate(1990, 'cancer', 13, 57, 103.95),
    },
  }),
  row({
    key: 'canopus',
    labelRu: 'Канопус',
    labelEn: 'Canopus',
    designation: 'α Carinae',
    sourceNameRu: 'Канопус',
    sourceDesignation: 'альфа Киля (Корабля Арго)',
    magnitudeText: '1',
    quality: 'Юпитер-Сатурн',
    imageReferences: ['2026-05-22 11.16.34.jpg'],
    modernValidation: { status: 'modern-validation-pending', name: 'Canopus' },
    coordinates: {
      epoch1950: coordinate(1950, 'cancer', 14, 16, 104.2666666667),
      epoch1970: coordinate(1970, 'cancer', 14, 33, 104.55),
      epoch1990: coordinate(1990, 'cancer', 14, 49, 104.8166666667),
    },
  }),
  row({
    key: 'regulus',
    labelRu: 'Регул',
    labelEn: 'Regulus',
    designation: 'α Leonis',
    sourceNameRu: 'Регул',
    sourceDesignation: 'альфа Льва',
    magnitudeText: '1',
    quality: 'Юпитер-Марс',
    imageReferences: ['2026-05-22 11.16.36.jpg'],
    modernValidation: { status: 'matched-in-local-swiss-fixed-star-file', name: 'Regulus' },
    coordinates: {
      epoch1950: coordinate(1950, 'leo', 29, 8, 149.1333333333),
      epoch1970: coordinate(1970, 'leo', 29, 25, 149.4166666667),
      epoch1990: coordinate(1990, 'leo', 29, 42, 149.7),
    },
  }),
  row({
    key: 'spica',
    labelRu: 'Спика',
    labelEn: 'Spica',
    designation: 'α Virginis',
    sourceNameRu: 'Спика',
    sourceDesignation: 'альфа Девы',
    magnitudeText: '1',
    quality: 'Венера-Марс',
    imageReferences: ['2026-05-22 11.16.36.jpg'],
    modernValidation: { status: 'matched-in-local-swiss-fixed-star-file', name: 'Spica' },
    coordinates: {
      epoch1950: coordinate(1950, 'libra', 23, 8, 203.1333333333),
      epoch1970: coordinate(1970, 'libra', 23, 25, 203.4166666667),
      epoch1990: coordinate(1990, 'libra', 23, 42, 203.7),
    },
  }),
  row({
    key: 'arcturus',
    labelRu: 'Арктур',
    labelEn: 'Arcturus',
    designation: 'α Bootis',
    sourceNameRu: 'Арктур',
    sourceDesignation: 'альфа Волопаса',
    magnitudeText: '1',
    quality: 'Юпитер-Марс',
    imageReferences: ['2026-05-22 11.16.36.jpg'],
    modernValidation: { status: 'modern-validation-pending', name: 'Arcturus' },
    coordinates: {
      epoch1950: coordinate(1950, 'libra', 23, 32, 203.5333333333),
      epoch1970: coordinate(1970, 'libra', 23, 49, 203.8166666667),
      epoch1990: coordinate(1990, 'libra', 24, 6, 204.1),
    },
  }),
  row({
    key: 'antares',
    labelRu: 'Антарес',
    labelEn: 'Antares',
    designation: 'α Scorpii',
    sourceNameRu: 'Антарес',
    sourceDesignation: 'альфа Скорпиона',
    magnitudeText: '1',
    quality: 'Марс-Юпитер',
    imageReferences: ['2026-05-22 11.16.39.jpg'],
    modernValidation: { status: 'matched-in-local-swiss-fixed-star-file', name: 'Antares' },
    coordinates: {
      epoch1950: coordinate(1950, 'sagittarius', 9, 5, 249.0833333333),
      epoch1970: coordinate(1970, 'sagittarius', 9, 21, 249.35),
      epoch1990: coordinate(1990, 'sagittarius', 9, 37, 249.6166666667),
    },
  }),
  row({
    key: 'vega',
    labelRu: 'Вега',
    labelEn: 'Vega',
    designation: 'α Lyrae',
    sourceNameRu: 'Вега',
    sourceDesignation: 'альфа Лиры',
    magnitudeText: '1',
    quality: 'Венера-Меркурий-Нептун',
    imageReferences: ['2026-05-22 11.16.39.jpg'],
    modernValidation: { status: 'modern-validation-pending', name: 'Vega' },
    coordinates: {
      epoch1950: coordinate(1950, 'capricorn', 14, 36, 284.6),
      epoch1970: coordinate(1970, 'capricorn', 14, 54, 284.9),
      epoch1990: coordinate(1990, 'capricorn', 15, 11, 285.1833333333),
    },
  }),
  row({
    key: 'altair',
    labelRu: 'Альтаир',
    labelEn: 'Altair',
    designation: 'α Aquilae',
    sourceNameRu: 'Альтаир',
    sourceDesignation: 'альфа Орла',
    magnitudeText: '1',
    quality: 'Марс-Меркурий-Юпитер',
    imageReferences: ['2026-05-22 11.16.39.jpg'],
    modernValidation: { status: 'modern-validation-pending', name: 'Altair' },
    coordinates: {
      epoch1950: coordinate(1950, 'aquarius', 1, 4, 301.0666666667),
      epoch1970: coordinate(1970, 'aquarius', 1, 21, 301.35),
      epoch1990: coordinate(1990, 'aquarius', 1, 38, 301.6333333333),
    },
  }),
  row({
    key: 'fomalhaut',
    labelRu: 'Фомальгаут',
    labelEn: 'Fomalhaut',
    designation: 'α Piscis Austrini',
    sourceNameRu: 'Фомальгаут',
    sourceDesignation: 'Альфа Южн. Рыбы',
    magnitudeText: '1',
    quality: 'Меркурий-Нептун',
    imageReferences: ['2026-05-22 11.16.39.jpg'],
    modernValidation: { status: 'modern-validation-pending', name: 'Fomalhaut' },
    coordinates: {
      epoch1950: coordinate(1950, 'pisces', 3, 9, 333.15),
      epoch1970: coordinate(1970, 'pisces', 3, 26, 333.4333333333),
      epoch1990: coordinate(1990, 'pisces', 3, 43, 333.7166666667),
    },
  }),
]);

const ACTIVE_ROWS = Object.freeze(
  FIXED_STARS_CATALOG_ROWS.filter((rowItem) => isVerifiedFixedStarRowShape(rowItem)),
);
const CANDIDATE_ROWS = Object.freeze(
  FIXED_STARS_CATALOG_ROWS.filter(
    (rowItem) => rowItem.verificationStatus === FIXED_STAR_VERIFICATION_STATUS.CANDIDATE,
  ),
);
const DEFERRED_ROWS = Object.freeze(
  FIXED_STARS_CATALOG_ROWS.filter(
    (rowItem) => rowItem.verificationStatus === FIXED_STAR_VERIFICATION_STATUS.DEFERRED,
  ),
);
const ROWS_BY_KEY = Object.freeze(
  Object.fromEntries(FIXED_STARS_CATALOG_ROWS.map((rowItem) => [rowItem.key, rowItem])),
);

const DEFERRED_REASONS = Object.freeze([
  'sourceRowNotYetVerified',
  'coordinateNotVerified',
  'validationPending',
  'interpretationsDeferred',
  'dateOfBirthPositionDeferredToTask14_4',
]);

const FIXED_STARS_CATALOG = deepFreeze({
  source: FIXED_STARS_SOURCE,
  orbPolicy: FIXED_STARS_ORB_POLICY,
  targetPolicy: FIXED_STARS_TARGET_POLICY,
  relationshipPolicy: FIXED_STAR_RELATIONSHIP_POLICY,
  rows: FIXED_STARS_CATALOG_ROWS,
  activeRows: ACTIVE_ROWS,
  candidateRows: CANDIDATE_ROWS,
  deferredRows: DEFERRED_ROWS,
});

const FIXED_STARS_CATALOG_POLICY = deepFreeze({
  sourceKey: FIXED_STARS_SOURCE.sourceKey,
  sourceSystem: FIXED_STARS_SOURCE.sourceSystem,
  noOcrImport: FIXED_STARS_SOURCE.noOcrImport,
  noRowsFromMemory: FIXED_STARS_SOURCE.noRowsFromMemory,
  activeRowCount: ACTIVE_ROWS.length,
  candidateRowCount: CANDIDATE_ROWS.length,
  deferredRowCount: DEFERRED_ROWS.length,
  initialReferenceEpoch: FIXED_STARS_SOURCE.initialReferenceEpoch,
  orbPolicyKey: FIXED_STARS_ORB_POLICY.key,
  activeRelationships: FIXED_STAR_RELATIONSHIP_POLICY.activeRelationships,
  deferredRelationships: FIXED_STAR_RELATIONSHIP_POLICY.deferredRelationships,
  activeTargetSet: FIXED_STARS_TARGET_POLICY.activeTargetSet,
  deferredTargetSets: FIXED_STARS_TARGET_POLICY.deferredTargetSets,
});

export function getFixedStarsCatalog() {
  return FIXED_STARS_CATALOG;
}

export function getActiveFixedStarRows() {
  return ACTIVE_ROWS;
}

export function getCandidateFixedStarRows() {
  return CANDIDATE_ROWS;
}

export function getFixedStarRowByKey(key) {
  if (typeof key !== 'string' || key.length === 0) {
    return null;
  }

  return ROWS_BY_KEY[key] ?? null;
}

export function isVerifiedFixedStarRow(rowOrKey) {
  const rowItem = typeof rowOrKey === 'string' ? getFixedStarRowByKey(rowOrKey) : rowOrKey;

  return isVerifiedFixedStarRowShape(rowItem);
}

export function getFixedStarsCatalogPolicy() {
  return FIXED_STARS_CATALOG_POLICY;
}

export function getFixedStarsDeferredReasons() {
  return [...DEFERRED_REASONS];
}

export function getFixedStarsDataCapabilities() {
  return {
    fixedStarsCatalog: true,
    activeRows: true,
    candidateRows: true,
    conjunctionEngine: false,
    positionEngine: false,
    targetResolver: false,
    display: false,
    ui: false,
    debug: false,
    interpretations: false,
    transits: false,
  };
}

export function getFixedStarsDataLimitations() {
  return [
    'Каталог неподвижных звезд основан на source-tracked rows.',
    'Вронский, Таблица 18 используется как primary astrology source.',
    'Активируются только вручную verified rows.',
    'Позиции на дату рождения будут валидироваться в Task 14.4.',
    'Этот модуль не рассчитывает соединения.',
    'Интерпретации не добавлены.',
  ];
}

function row(config) {
  return deepFreeze({
    key: config.key,
    labelRu: config.labelRu,
    labelEn: config.labelEn,
    designation: config.designation,
    active: true,
    verificationStatus: FIXED_STAR_VERIFICATION_STATUS.VERIFIED,
    sourceSystem: SOURCE_SYSTEM,
    sourceKey: SOURCE_KEY,
    validationStatus: 'manual-source-verified',
    sourceRow: {
      table: SOURCE_TABLE,
      sourceNameRu: config.sourceNameRu,
      sourceDesignation: config.sourceDesignation,
      magnitudeText: config.magnitudeText,
      quality: config.quality,
      imageReferences: config.imageReferences,
      manualVerification: true,
      noOcrImport: true,
      noRowsFromMemory: true,
    },
    modernValidation: config.modernValidation,
    coordinates: config.coordinates,
    initialReferenceEpoch: INITIAL_REFERENCE_EPOCH,
    positionPolicy: POSITION_POLICY,
    interpretation: false,
  });
}

function coordinate(epoch, sign, degree, minutes, longitude) {
  return Object.freeze({
    epoch,
    sign,
    signRu: SIGN_LABELS[sign],
    degree,
    minutes,
    seconds: 0,
    longitude,
    verified: true,
  });
}

function isVerifiedFixedStarRowShape(rowItem) {
  return Boolean(
    rowItem
      && rowItem.active === true
      && rowItem.verificationStatus === FIXED_STAR_VERIFICATION_STATUS.VERIFIED
      && rowItem.sourceSystem === SOURCE_SYSTEM
      && rowItem.sourceRow
      && rowItem.sourceRow.manualVerification === true
      && rowItem.coordinates
      && rowItem.coordinates.epoch1990
      && rowItem.coordinates.epoch1990.verified === true
      && Number.isFinite(rowItem.coordinates.epoch1990.longitude)
      && rowItem.initialReferenceEpoch === INITIAL_REFERENCE_EPOCH,
  );
}

function freezeRows(rows) {
  return Object.freeze([...rows]);
}

function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) {
    return value;
  }

  Object.freeze(value);

  for (const nestedValue of Object.values(value)) {
    deepFreeze(nestedValue);
  }

  return value;
}
