import {
  calculateArabicPartsForProfile,
  calculateVronskySimpleArabicPartsForProfile,
} from './arabicParts.js';
import { normalizeDegrees } from './astroMath.js';
import { getCanonicalHouseCuspsForProfile } from './houseCusps.js';
import { isLongitudeInHouseSpan } from './planetInHouses.js';

const READY_STATUS = 'ready';
const PARTIAL_STATUS = 'partial';
const NOT_READY_STATUS = 'notReady';
const INVALID_STATUS = 'invalid';
const UNSUPPORTED_STATUS = 'unsupported';
const EMPTY_ARRAY = Object.freeze([]);
const SUPPORTED_HOUSE_SYSTEMS = Object.freeze(['whole-sign', 'equal-house', 'placidus']);
const VRONSKY_SOURCE_SYSTEM = 'vronsky-table-17-arabic-points';
const VRONSKY_ACTIVATION_STATUS = 'explicitVronskyEngineOnly';

export function assignArabicPartToHouse(part = null, cuspResult = null) {
  const cuspReadiness = resolveCuspReadiness(cuspResult);

  if (cuspReadiness.status !== READY_STATUS) {
    return unavailableAssignment(cuspReadiness.status, cuspReadiness.reason, cuspReadiness.message, part);
  }

  const partReadiness = resolvePartReadiness(part);

  if (partReadiness.status !== READY_STATUS) {
    return invalidAssignment(part, partReadiness.reason, partReadiness.message);
  }

  const house = findHouseForArabicPartLongitude(partReadiness.longitude, cuspResult);

  if (!house) {
    return invalidAssignment(part, 'houseSpanNotFound', 'Дом для жребия не найден безопасно.');
  }

  const label = getPartLabel(part);
  const houseLabel = `${house.number} дом`;

  return freezeObject({
    status: READY_STATUS,
    ready: true,
    key: getPartKey(part),
    label,
    houseSystem: cuspResult.houseSystem,
    houseNumber: house.number,
    houseLabel,
    house: freezeObject({
      number: house.number,
      label: houseLabel,
    }),
    text: `${label} — ${houseLabel}`,
  });
}

export function assignArabicPartsToHouses(partsResult = null, cuspResult = null) {
  const partsReadiness = resolvePartsResultReadiness(partsResult);

  if (partsReadiness.status !== READY_STATUS) {
    return unavailableResult(partsReadiness.status, partsReadiness.reason, partsReadiness.message);
  }

  const cuspReadiness = resolveCuspReadiness(cuspResult);

  if (cuspReadiness.status !== READY_STATUS) {
    return unavailableResult(cuspReadiness.status, cuspReadiness.reason, cuspReadiness.message, cuspResult?.houseSystem);
  }

  const assignments = partsResult.parts.map((part) => assignArabicPartToHouse(part, cuspResult));
  const summary = getArabicPartsHouseAssignmentSummary(assignments);

  return freezeObject({
    status: READY_STATUS,
    ready: true,
    houseSystem: cuspResult.houseSystem,
    total: assignments.length,
    readyCount: summary.ready,
    invalidCount: summary.invalid,
    assignments: freezeArray(assignments),
    summary,
    limitations: getArabicPartsHouseAssignmentLimitations(),
    capabilities: getArabicPartsHouseAssignmentCapabilities(),
  });
}

export function assignArabicPartsToHousesForProfile(profile = null, options = {}) {
  const partsResult = isPlainObject(options.partsResult)
    ? options.partsResult
    : calculateArabicPartsForProfile(profile, options);

  if (!partsResult || partsResult.ready !== true) {
    return unavailableResult(
      partsResult?.status === UNSUPPORTED_STATUS ? UNSUPPORTED_STATUS : NOT_READY_STATUS,
      partsResult?.reason ?? 'arabicPartsNotReady',
      partsResult?.message ?? 'Жребии пока не рассчитаны.',
    );
  }

  const cuspResult = isPlainObject(options.cuspResult)
    ? options.cuspResult
    : getCanonicalHouseCuspsForProfile(profile, options);

  return assignArabicPartsToHouses(partsResult, cuspResult);
}

export function assignVronskyArabicPartToHouse(part = null, cuspResult = null) {
  if (!isPlainObject(part)) {
    return withVronskySource(invalidAssignment(part, 'missingVronskyArabicPart', 'Сначала нужна рассчитанная точка Вронского.'));
  }

  if (part.status === READY_STATUS && part.ready === true && !isVronskyArabicPart(part)) {
    return withVronskySource(invalidAssignment(
      part,
      'notVronskyArabicPart',
      'Точка не входит в explicit набор точек Вронского.',
    ));
  }

  return withVronskySource(assignArabicPartToHouse(part, cuspResult));
}

export function assignVronskyArabicPartsToHouses(vronskyResult = null, cuspResult = null) {
  const partsReadiness = resolveVronskyPartsResultReadiness(vronskyResult);

  if (partsReadiness.status !== READY_STATUS) {
    return unavailableVronskyAssignmentResult(
      partsReadiness.status,
      partsReadiness.reason,
      partsReadiness.message,
    );
  }

  const cuspReadiness = resolveCuspReadiness(cuspResult);

  if (cuspReadiness.status !== READY_STATUS) {
    return unavailableVronskyAssignmentResult(
      cuspReadiness.status,
      cuspReadiness.reason,
      cuspReadiness.message,
      cuspResult?.houseSystem ?? null,
    );
  }

  const assignments = vronskyResult.parts.map((part) => assignVronskyArabicPartToHouse(part, cuspResult));
  const summary = getVronskyArabicPartsHouseAssignmentSummary(assignments);
  const status = summary.ready === assignments.length
    ? READY_STATUS
    : summary.ready > 0 ? PARTIAL_STATUS : NOT_READY_STATUS;

  return freezeObject({
    status,
    ready: summary.ready > 0,
    sourceSystem: VRONSKY_SOURCE_SYSTEM,
    houseSystem: cuspResult.houseSystem,
    total: assignments.length,
    readyCount: summary.ready,
    invalidCount: summary.invalid,
    assignments: freezeArray(assignments),
    summary,
    limitations: getVronskyArabicPartsHouseAssignmentLimitations(),
    capabilities: getVronskyArabicPartsHouseAssignmentCapabilities(),
  });
}

export function assignVronskyArabicPartsToHousesForProfile(profile = null, options = {}) {
  const vronskyResult = isPlainObject(options.vronskyResult)
    ? options.vronskyResult
    : calculateVronskySimpleArabicPartsForProfile(profile, options);

  if (!isVronskyResultWithReadyParts(vronskyResult)) {
    return unavailableVronskyAssignmentResult(
      vronskyResult?.status === UNSUPPORTED_STATUS ? UNSUPPORTED_STATUS : NOT_READY_STATUS,
      vronskyResult?.reason ?? 'vronskyArabicPartsNotReady',
      vronskyResult?.message ?? 'Точки Вронского пока не рассчитаны.',
    );
  }

  const cuspResult = isPlainObject(options.cuspResult)
    ? options.cuspResult
    : getCanonicalHouseCuspsForProfile(profile, options);

  return assignVronskyArabicPartsToHouses(vronskyResult, cuspResult);
}

export function findHouseForArabicPartLongitude(longitude, cuspResult = null) {
  const normalized = normalizeDegrees(longitude);

  if (normalized === null || !isReadyCuspResult(cuspResult)) {
    return null;
  }

  const cusps = sortCuspsByHouseNumber(cuspResult.cusps);

  if (cusps.length !== 12) {
    return null;
  }

  for (let index = 0; index < cusps.length; index += 1) {
    const cusp = cusps[index];
    const nextCusp = cusps[(index + 1) % cusps.length];

    if (isLongitudeInHouseSpan(normalized, cusp.longitude, nextCusp.longitude)) {
      return freezeObject({
        number: cusp.number,
        label: `${cusp.number} дом`,
      });
    }
  }

  return null;
}

export function getArabicPartsHouseAssignmentSummary(assignments = EMPTY_ARRAY) {
  if (!Array.isArray(assignments) || assignments.length === 0) {
    return freezeObject({
      total: 0,
      ready: 0,
      invalid: 0,
      byHouse: freezeObject({}),
      text: 'Жребии недоступны',
    });
  }

  const readyAssignments = assignments.filter((assignment) => assignment?.status === READY_STATUS);
  const byHouse = readyAssignments.reduce((memo, assignment) => {
    const key = String(assignment.houseNumber);

    memo[key] = (memo[key] ?? 0) + 1;
    return memo;
  }, {});

  return freezeObject({
    total: assignments.length,
    ready: readyAssignments.length,
    invalid: assignments.length - readyAssignments.length,
    byHouse: freezeObject(byHouse),
    text: readyAssignments.length > 0 ? 'Жребии распределены по домам' : 'Жребии недоступны',
  });
}

export function getArabicPartsHouseAssignmentCapabilities() {
  return freezeObject({
    arabicPartsHouseAssignment: true,
    parsFortuna: true,
    lotOfSpirit: true,
    wholeSign: true,
    equalHouse: true,
    placidus: true,
    interpretations: false,
    transits: false,
    fixedStars: false,
  });
}

export function getArabicPartsHouseAssignmentLimitations() {
  return freezeArray([
    'Жребии назначаются в дома по выбранной системе домов профиля.',
    'Используется точная числовая долгота жребия, а не отображаемый текст.',
    'Граница куспида относится к дому, который с нее начинается.',
    'Этот модуль не добавляет интерпретации.',
  ]);
}

export function getVronskyArabicPartsHouseAssignmentSummary(resultOrAssignments = EMPTY_ARRAY) {
  const assignments = Array.isArray(resultOrAssignments)
    ? resultOrAssignments
    : Array.isArray(resultOrAssignments?.assignments) ? resultOrAssignments.assignments : EMPTY_ARRAY;

  if (assignments.length === 0) {
    return freezeObject({
      total: 0,
      ready: 0,
      invalid: 0,
      byHouse: freezeObject({}),
      text: 'Точки Вронского недоступны',
    });
  }

  const readyAssignments = assignments.filter((assignment) => assignment?.status === READY_STATUS);
  const byHouse = readyAssignments.reduce((memo, assignment) => {
    const key = String(assignment.houseNumber);

    memo[key] = (memo[key] ?? 0) + 1;
    return memo;
  }, {});

  return freezeObject({
    total: assignments.length,
    ready: readyAssignments.length,
    invalid: assignments.length - readyAssignments.length,
    byHouse: freezeObject(byHouse),
    text: readyAssignments.length > 0 ? 'Точки Вронского распределены по домам' : 'Точки Вронского недоступны',
  });
}

export function getVronskyArabicPartsHouseAssignmentCapabilities() {
  return freezeObject({
    vronskyArabicPartsHouseAssignment: true,
    dayOnly: true,
    defaultArabicPartsOutput: false,
    oldDeferredLots: false,
    wholeSign: true,
    equalHouse: true,
    placidus: true,
    ui: false,
    debug: false,
    interpretations: false,
    transits: false,
    fixedStars: false,
  });
}

export function getVronskyArabicPartsHouseAssignmentLimitations() {
  return freezeArray([
    'Точки Вронского назначаются в дома по выбранной системе домов профиля.',
    'Используется точная числовая долгота точки, а не отображаемый текст.',
    'Граница куспида относится к дому, который с нее начинается.',
    'Ночные формулы по Вронскому пока не verified.',
    'Этот слой не добавляет интерпретации.',
  ]);
}

function resolvePartsResultReadiness(partsResult) {
  if (!isPlainObject(partsResult)) {
    return readiness(NOT_READY_STATUS, 'arabicPartsNotReady', 'Жребии пока не рассчитаны.');
  }

  if (partsResult.ready !== true) {
    return readiness(
      partsResult.status === UNSUPPORTED_STATUS ? UNSUPPORTED_STATUS : NOT_READY_STATUS,
      partsResult.reason ?? 'arabicPartsNotReady',
      partsResult.message ?? 'Жребии пока не рассчитаны.',
    );
  }

  if (!Array.isArray(partsResult.parts) || partsResult.parts.length === 0) {
    return readiness(NOT_READY_STATUS, 'emptyPartsResult', 'Нет рассчитанных жребиев для назначения в дома.');
  }

  return readiness(READY_STATUS, null, null);
}

function resolveVronskyPartsResultReadiness(vronskyResult) {
  if (!isPlainObject(vronskyResult)) {
    return readiness(NOT_READY_STATUS, 'vronskyArabicPartsNotReady', 'Точки Вронского пока не рассчитаны.');
  }

  if (!isVronskyResultWithReadyParts(vronskyResult)) {
    return readiness(
      vronskyResult.status === UNSUPPORTED_STATUS ? UNSUPPORTED_STATUS : NOT_READY_STATUS,
      vronskyResult.reason ?? 'vronskyArabicPartsNotReady',
      vronskyResult.message ?? 'Точки Вронского пока не рассчитаны.',
    );
  }

  if (!Array.isArray(vronskyResult.parts) || vronskyResult.parts.length === 0) {
    return readiness(NOT_READY_STATUS, 'emptyVronskyPartsResult', 'Нет рассчитанных точек Вронского для назначения в дома.');
  }

  return readiness(READY_STATUS, null, null);
}

function resolveCuspReadiness(cuspResult) {
  if (!isPlainObject(cuspResult)) {
    return readiness(NOT_READY_STATUS, 'houseCuspsNotReady', 'Куспиды домов пока недоступны.');
  }

  if (cuspResult.status === UNSUPPORTED_STATUS) {
    return readiness(UNSUPPORTED_STATUS, cuspResult.reason ?? 'unsupportedHouseSystem', cuspResult.message);
  }

  if (cuspResult.ready !== true || cuspResult.status !== READY_STATUS) {
    return readiness(
      NOT_READY_STATUS,
      cuspResult.reason ?? 'houseCuspsNotReady',
      cuspResult.message ?? 'Куспиды домов пока недоступны.',
    );
  }

  if (!SUPPORTED_HOUSE_SYSTEMS.includes(cuspResult.houseSystem)) {
    return readiness(UNSUPPORTED_STATUS, 'unsupportedHouseSystem', 'Выбранная система домов не поддержана.');
  }

  if (!isReadyCuspResult(cuspResult)) {
    return readiness(NOT_READY_STATUS, 'invalidHouseCusps', 'Куспиды домов неполные или некорректные.');
  }

  return readiness(READY_STATUS, null, null);
}

function resolvePartReadiness(part) {
  if (!isPlainObject(part)) {
    return readiness(INVALID_STATUS, 'missingArabicPart', 'Сначала нужен рассчитанный жребий.');
  }

  if (part.status !== READY_STATUS || part.ready !== true) {
    return readiness(
      INVALID_STATUS,
      part.reason ?? 'arabicPartNotReady',
      part.message ?? 'Жребий пока не рассчитан.',
    );
  }

  const normalized = normalizeDegrees(part.longitude);

  if (normalized === null) {
    return readiness(INVALID_STATUS, 'missingPartLongitude', 'Для назначения жребия в дом нужна долгота жребия.');
  }

  return {
    ...readiness(READY_STATUS, null, null),
    longitude: normalized,
  };
}

function isReadyCuspResult(cuspResult) {
  return isPlainObject(cuspResult)
    && cuspResult.status === READY_STATUS
    && cuspResult.ready === true
    && Array.isArray(cuspResult.cusps)
    && cuspResult.cusps.length === 12
    && sortCuspsByHouseNumber(cuspResult.cusps).every((cusp, index) => (
      cusp.number === index + 1 && Number.isFinite(cusp.longitude)
    ));
}

function sortCuspsByHouseNumber(cusps) {
  if (!Array.isArray(cusps)) {
    return [];
  }

  return [...cusps].sort((a, b) => a.number - b.number);
}

function invalidAssignment(part, reason, message) {
  return freezeObject({
    status: INVALID_STATUS,
    ready: false,
    key: getPartKey(part),
    label: getPartLabel(part),
    houseNumber: null,
    houseLabel: null,
    reason,
    ...(message ? { message } : {}),
  });
}

function unavailableAssignment(status, reason, message, part) {
  return freezeObject({
    status,
    ready: false,
    key: getPartKey(part),
    label: getPartLabel(part),
    houseNumber: null,
    houseLabel: null,
    reason,
    ...(message ? { message } : {}),
  });
}

function unavailableResult(status, reason, message, houseSystem = null) {
  return freezeObject({
    status,
    ready: false,
    houseSystem,
    total: 0,
    readyCount: 0,
    invalidCount: 0,
    reason,
    ...(message ? { message } : {}),
    assignments: EMPTY_ARRAY,
    summary: getArabicPartsHouseAssignmentSummary(EMPTY_ARRAY),
    limitations: getArabicPartsHouseAssignmentLimitations(),
    capabilities: getArabicPartsHouseAssignmentCapabilities(),
  });
}

function unavailableVronskyAssignmentResult(status, reason, message, houseSystem = null) {
  return freezeObject({
    status,
    ready: false,
    sourceSystem: VRONSKY_SOURCE_SYSTEM,
    houseSystem,
    total: 0,
    readyCount: 0,
    invalidCount: 0,
    reason,
    ...(message ? { message } : {}),
    assignments: EMPTY_ARRAY,
    summary: getVronskyArabicPartsHouseAssignmentSummary(EMPTY_ARRAY),
    limitations: getVronskyArabicPartsHouseAssignmentLimitations(),
    capabilities: getVronskyArabicPartsHouseAssignmentCapabilities(),
  });
}

function getPartKey(part) {
  return typeof part?.key === 'string' && part.key.trim() ? part.key : null;
}

function getPartLabel(part) {
  return typeof part?.label === 'string' && part.label.trim() ? part.label : 'Жребий';
}

function isVronskyResultWithReadyParts(result) {
  return isPlainObject(result)
    && result.sourceSystem === VRONSKY_SOURCE_SYSTEM
    && result.ready === true
    && [READY_STATUS, PARTIAL_STATUS].includes(result.status)
    && Array.isArray(result.parts);
}

function isVronskyArabicPart(part) {
  return isPlainObject(part)
    && part.sourceSystem === VRONSKY_SOURCE_SYSTEM
    && part.activationStatus === VRONSKY_ACTIVATION_STATUS;
}

function withVronskySource(assignment) {
  return freezeObject({
    ...assignment,
    sourceSystem: VRONSKY_SOURCE_SYSTEM,
  });
}

function readiness(status, reason, message) {
  return freezeObject({
    status,
    reason,
    message,
  });
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function freezeArray(items) {
  return Object.freeze([...items]);
}

function freezeObject(value) {
  return Object.freeze(value);
}
