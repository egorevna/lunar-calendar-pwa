import {
  ASTRO_ZODIAC_SIGNS,
  formatDegree,
  getAngularDistance,
  normalizeDegrees,
} from './astroMath.js';
import { calculateHousesForSelectedSystem } from './houseSystemResolver.js';

const READY_STATUS = 'ready';
const NOT_READY_STATUS = 'notReady';
const UNSUPPORTED_STATUS = 'unsupported';
const INVALID_STATUS = 'invalid';
const HOUSE_COUNT = 12;
const SIGN_SIZE = 30;
const HALF_CIRCLE = 180;
const SEQUENCE_TOLERANCE_DEGREES = 0.001;
const EMPTY_ARRAY = Object.freeze([]);

const HOUSE_SYSTEMS = Object.freeze({
  WHOLE_SIGN: 'whole-sign',
  EQUAL_HOUSE: 'equal-house',
  PLACIDUS: 'placidus',
});

const HOUSE_SYSTEM_LABELS = Object.freeze({
  [HOUSE_SYSTEMS.WHOLE_SIGN]: 'Whole Sign',
  [HOUSE_SYSTEMS.EQUAL_HOUSE]: 'Равнодомная',
  [HOUSE_SYSTEMS.PLACIDUS]: 'Placidus',
});

const CUSP_TYPES = Object.freeze({
  [HOUSE_SYSTEMS.WHOLE_SIGN]: 'sign-boundary',
  [HOUSE_SYSTEMS.EQUAL_HOUSE]: 'equal-30-degree',
  [HOUSE_SYSTEMS.PLACIDUS]: 'quadrant-placidus',
});

const MESSAGES = Object.freeze({
  missingHouseResult: 'Сначала нужен готовый результат домов.',
  houseResultNotReady: 'Куспиды домов пока недоступны.',
  unsupportedHouseSystem: 'Выбранная система домов не поддержана для canonical cusp output.',
  invalidCuspSequence: 'Последовательность куспидов домов некорректна.',
});

export function getCanonicalHouseCusps(houseResult = null) {
  const source = unwrapHouseResult(houseResult);

  if (!source) {
    return unavailableResult({
      status: NOT_READY_STATUS,
      reason: 'missingHouseResult',
    });
  }

  if (source.status !== READY_STATUS || source.ready !== true) {
    return unavailableResult({
      status: source.status === UNSUPPORTED_STATUS ? UNSUPPORTED_STATUS : NOT_READY_STATUS,
      reason: source.reason ?? 'houseResultNotReady',
      message: source.message,
      houseSystem: source.houseSystem ?? houseResult?.houseSystem ?? null,
      houseSystemLabel: source.houseSystemLabel ?? houseResult?.houseSystemLabel ?? null,
    });
  }

  const houseSystem = normalizeHouseSystem(source.houseSystem);

  if (!houseSystem) {
    return unavailableResult({
      status: UNSUPPORTED_STATUS,
      reason: 'unsupportedHouseSystem',
      houseSystem: source.houseSystem ?? null,
      houseSystemLabel: source.houseSystemLabel ?? null,
    });
  }

  const cuspInputs = getCuspInputs(source, houseSystem);
  const cusps = freezeArray(cuspInputs.map((item) => normalizeHouseCusp(item, houseSystem)));

  if (cusps.length !== HOUSE_COUNT || cusps.some((cusp) => cusp === null)) {
    return unavailableResult({
      status: NOT_READY_STATUS,
      reason: 'invalidCuspSequence',
      houseSystem,
      houseSystemLabel: getHouseSystemLabel(source, houseSystem),
    });
  }

  const validation = validateHouseCuspSequence(cusps, houseSystem);

  if (!validation.valid) {
    return unavailableResult({
      status: NOT_READY_STATUS,
      reason: 'invalidCuspSequence',
      houseSystem,
      houseSystemLabel: getHouseSystemLabel(source, houseSystem),
      validation,
    });
  }

  const metadata = getCuspMetadata(houseSystem, source);

  return Object.freeze({
    status: READY_STATUS,
    ready: true,
    houseSystem,
    houseSystemLabel: getHouseSystemLabel(source, houseSystem),
    selectedHouseSystem: houseResult?.selectedHouseSystem ?? houseSystem,
    cuspType: metadata.cuspType,
    exactCuspDegrees: metadata.exactCuspDegrees,
    benchmarkValidated: metadata.benchmarkValidated,
    cusps,
    source: 'selected-house-system-result',
    validation,
    limitations: getHouseCuspsLimitations(),
    capabilities: getHouseCuspsCapabilities(),
  });
}

export function getCanonicalHouseCuspsForProfile(profile = null, options = {}) {
  const houseResult = calculateHousesForSelectedSystem(profile, options);

  return getCanonicalHouseCusps(houseResult);
}

export function normalizeHouseCusp(cuspOrHouse = null, houseSystem = null) {
  const normalizedHouseSystem = normalizeHouseSystem(houseSystem);

  if (!normalizedHouseSystem || !isPlainObject(cuspOrHouse)) {
    return null;
  }

  if (normalizedHouseSystem === HOUSE_SYSTEMS.WHOLE_SIGN) {
    return normalizeWholeSignBoundary(cuspOrHouse);
  }

  const source = isPlainObject(cuspOrHouse.cusp) ? cuspOrHouse.cusp : cuspOrHouse;
  const number = getCuspNumber(source.number ?? cuspOrHouse.number);
  const longitude = normalizeDegrees(source.longitude ?? cuspOrHouse.longitude);

  if (number === null || longitude === null) {
    return null;
  }

  return formatCanonicalCusp({
    number,
    longitude,
    labelPrefix: 'Куспид',
  });
}

export function getHouseCuspByNumber(cusps = [], number = null) {
  if (!Array.isArray(cusps) || !Number.isInteger(number) || number < 1 || number > HOUSE_COUNT) {
    return null;
  }

  return cusps.find((cusp) => cusp?.number === number) ?? null;
}

export function validateHouseCuspSequence(cusps = [], houseSystem = null) {
  const normalizedHouseSystem = normalizeHouseSystem(houseSystem);
  const reasons = [];

  if (!Array.isArray(cusps)) {
    reasons.push('cuspsNotArray');
  } else if (cusps.length !== HOUSE_COUNT) {
    reasons.push('cuspCountNotTwelve');
  }

  if (!normalizedHouseSystem) {
    reasons.push('unsupportedHouseSystem');
  }

  if (Array.isArray(cusps)) {
    validateCuspNumbers(cusps, reasons);
    validateFiniteLongitudes(cusps, reasons);

    if (normalizedHouseSystem === HOUSE_SYSTEMS.WHOLE_SIGN) {
      validateWholeSignSequence(cusps, reasons);
    } else if (normalizedHouseSystem === HOUSE_SYSTEMS.EQUAL_HOUSE) {
      validateEqualHouseSequence(cusps, reasons);
    } else if (normalizedHouseSystem === HOUSE_SYSTEMS.PLACIDUS) {
      validatePlacidusSequence(cusps, reasons);
    }
  }

  if (reasons.length > 0) {
    return Object.freeze({
      status: INVALID_STATUS,
      valid: false,
      count: Array.isArray(cusps) ? cusps.length : 0,
      reasons: freezeArray(reasons),
    });
  }

  return Object.freeze({
    status: READY_STATUS,
    valid: true,
    count: HOUSE_COUNT,
    reasons: EMPTY_ARRAY,
  });
}

export function getHouseCuspSummary(cuspResult = null) {
  if (!isPlainObject(cuspResult) || cuspResult.status !== READY_STATUS || cuspResult.ready !== true) {
    return Object.freeze({
      status: cuspResult?.status ?? NOT_READY_STATUS,
      houseSystem: cuspResult?.houseSystem ?? null,
      count: 0,
      cuspType: cuspResult?.cuspType ?? null,
      exactCuspDegrees: false,
      text: 'Куспиды домов недоступны',
    });
  }

  const count = Array.isArray(cuspResult.cusps) ? cuspResult.cusps.length : 0;

  return Object.freeze({
    status: READY_STATUS,
    houseSystem: cuspResult.houseSystem,
    count,
    cuspType: cuspResult.cuspType,
    exactCuspDegrees: cuspResult.exactCuspDegrees === true,
    text: `${count} куспидов домов рассчитаны`,
  });
}

export function getHouseCuspsCapabilities() {
  return Object.freeze({
    houseCusps: true,
    wholeSign: true,
    equalHouse: true,
    placidus: true,
    selectedHouseSystem: true,
    parsFortuna: false,
    arabicParts: false,
    interpretations: false,
    transits: false,
    fixedStars: false,
  });
}

export function getHouseCuspsLimitations() {
  return Object.freeze([
    'Куспиды берутся из выбранной системы домов профиля.',
    'Whole Sign использует границы знаков, а не точные квадрантные куспиды.',
    'Равнодомная система использует ASC и шаг 30°.',
    'Placidus использует benchmark-validated Placidus cusps.',
    'Этот модуль не рассчитывает Pars Fortuna или арабские части.',
  ]);
}

function unwrapHouseResult(houseResult) {
  if (!isPlainObject(houseResult)) {
    return null;
  }

  return isPlainObject(houseResult.result) ? houseResult.result : houseResult;
}

function getCuspInputs(source, houseSystem) {
  if (houseSystem === HOUSE_SYSTEMS.WHOLE_SIGN) {
    return Array.isArray(source.houses) ? source.houses : EMPTY_ARRAY;
  }

  if (Array.isArray(source.cusps) && source.cusps.length > 0) {
    return source.cusps;
  }

  return Array.isArray(source.houses) ? source.houses : EMPTY_ARRAY;
}

function normalizeWholeSignBoundary(house) {
  const number = getCuspNumber(house.number);
  const sign = getSignByKey(house.sign?.key);

  if (number === null || !sign) {
    return null;
  }

  return formatCanonicalCusp({
    number,
    longitude: sign.index * SIGN_SIZE,
    labelPrefix: 'Граница',
  });
}

function formatCanonicalCusp({ number, longitude, labelPrefix }) {
  const normalized = normalizeDegrees(longitude);
  const formatted = formatDegree(normalized);

  if (normalized === null || !formatted.signKey) {
    return null;
  }

  const sign = Object.freeze({
    key: formatted.signKey,
    ru: formatted.sign,
    symbol: formatted.symbol,
  });
  const position = `${formatted.sign} ${formatted.degree}°${pad2(formatted.minutes)}′${pad2(formatted.seconds)}″`;

  return Object.freeze({
    number,
    longitude: normalized,
    sign,
    degree: formatted.degree,
    minutes: formatted.minutes,
    seconds: formatted.seconds,
    label: `${labelPrefix} ${number} дома`,
    text: `${number} дом — ${position}`,
  });
}

function getCuspMetadata(houseSystem, source) {
  if (houseSystem === HOUSE_SYSTEMS.WHOLE_SIGN) {
    return Object.freeze({
      cuspType: CUSP_TYPES[houseSystem],
      exactCuspDegrees: false,
      benchmarkValidated: false,
    });
  }

  if (houseSystem === HOUSE_SYSTEMS.EQUAL_HOUSE) {
    return Object.freeze({
      cuspType: CUSP_TYPES[houseSystem],
      exactCuspDegrees: true,
      benchmarkValidated: false,
    });
  }

  return Object.freeze({
    cuspType: CUSP_TYPES[houseSystem],
    exactCuspDegrees: true,
    benchmarkValidated: Boolean(source.validation?.validated && source.validation?.benchmarkFixtures),
  });
}

function unavailableResult({
  status,
  reason,
  message = null,
  houseSystem = null,
  houseSystemLabel = null,
  validation = null,
}) {
  return Object.freeze({
    status,
    ready: false,
    houseSystem,
    houseSystemLabel,
    cuspType: null,
    exactCuspDegrees: false,
    benchmarkValidated: false,
    cusps: EMPTY_ARRAY,
    reason,
    message: message ?? MESSAGES[reason] ?? MESSAGES.houseResultNotReady,
    ...(validation ? { validation } : {}),
    limitations: getHouseCuspsLimitations(),
    capabilities: getHouseCuspsCapabilities(),
  });
}

function validateCuspNumbers(cusps, reasons) {
  const numbers = cusps.map((cusp) => cusp?.number);
  const unique = new Set(numbers);

  if (
    numbers.length !== HOUSE_COUNT
    || unique.size !== HOUSE_COUNT
    || !Array.from({ length: HOUSE_COUNT }, (_, index) => index + 1)
      .every((number) => unique.has(number))
  ) {
    reasons.push('invalidHouseNumbers');
  }
}

function validateFiniteLongitudes(cusps, reasons) {
  if (cusps.some((cusp) => !Number.isFinite(cusp?.longitude))) {
    reasons.push('invalidCuspLongitude');
  }
}

function validateWholeSignSequence(cusps, reasons) {
  if (!cusps.every((cusp) => isNearModulo(cusp.longitude, 0, SIGN_SIZE))) {
    reasons.push('wholeSignBoundarySequenceInvalid');
    return;
  }

  validateSpacing(cusps, SIGN_SIZE, 'wholeSignBoundarySequenceInvalid', reasons);
}

function validateEqualHouseSequence(cusps, reasons) {
  validateSpacing(cusps, SIGN_SIZE, 'equalHouseSpacingInvalid', reasons);
}

function validatePlacidusSequence(cusps, reasons) {
  const cusp1 = getHouseCuspByNumber(cusps, 1);
  const cusp4 = getHouseCuspByNumber(cusps, 4);
  const cusp7 = getHouseCuspByNumber(cusps, 7);
  const cusp10 = getHouseCuspByNumber(cusps, 10);

  if (!cusp1 || !cusp4 || !cusp7 || !cusp10) {
    reasons.push('placidusAngleCuspsMissing');
    return;
  }

  if (
    !isOpposite(cusp1.longitude, cusp7.longitude)
    || !isOpposite(cusp10.longitude, cusp4.longitude)
  ) {
    reasons.push('placidusAngleInvariantsInvalid');
  }

  if (hasDuplicateLongitudes(cusps)) {
    reasons.push('duplicateCuspLongitudes');
  }
}

function validateSpacing(cusps, expectedSpacing, reason, reasons) {
  if (cusps.length !== HOUSE_COUNT) {
    return;
  }

  const valid = cusps.every((cusp, index) => {
    const next = cusps[(index + 1) % cusps.length];
    const spacing = normalizeDegrees(next.longitude - cusp.longitude);

    return spacing !== null && Math.abs(spacing - expectedSpacing) <= SEQUENCE_TOLERANCE_DEGREES;
  });

  if (!valid) {
    reasons.push(reason);
  }
}

function hasDuplicateLongitudes(cusps) {
  return cusps.some((cusp, index) => (
    cusps.some((other, otherIndex) => (
      otherIndex !== index
      && getAngularDistance(cusp.longitude, other.longitude) <= 1e-9
    ))
  ));
}

function isOpposite(longitude, oppositeLongitude) {
  const expected = normalizeDegrees(longitude + HALF_CIRCLE);
  const distance = getAngularDistance(expected, oppositeLongitude);

  return distance !== null && distance <= SEQUENCE_TOLERANCE_DEGREES;
}

function isNearModulo(value, target, modulo) {
  const normalized = normalizeDegrees(value);

  if (normalized === null) {
    return false;
  }

  const remainder = normalized % modulo;

  return remainder <= SEQUENCE_TOLERANCE_DEGREES
    || Math.abs(remainder - modulo) <= SEQUENCE_TOLERANCE_DEGREES
    || Math.abs(remainder - target) <= SEQUENCE_TOLERANCE_DEGREES;
}

function getCuspNumber(number) {
  return Number.isInteger(number) && number >= 1 && number <= HOUSE_COUNT ? number : null;
}

function normalizeHouseSystem(houseSystem) {
  return Object.values(HOUSE_SYSTEMS).includes(houseSystem) ? houseSystem : null;
}

function getHouseSystemLabel(source, houseSystem) {
  return source.houseSystemLabel || HOUSE_SYSTEM_LABELS[houseSystem] || null;
}

function getSignByKey(signKey) {
  return ASTRO_ZODIAC_SIGNS.find((sign) => sign.key === signKey) ?? null;
}

function freezeArray(values) {
  return Object.freeze([...values]);
}

function isPlainObject(value) {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

function pad2(value) {
  return String(value).padStart(2, '0');
}
