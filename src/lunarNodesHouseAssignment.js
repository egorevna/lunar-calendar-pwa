import { normalizeDegrees } from './astroMath.js';
import { getCanonicalHouseCuspsForProfile } from './houseCusps.js';
import { calculateLunarNodesForProfile } from './lunarNodes.js';
import { isLongitudeInHouseSpan } from './planetInHouses.js';

const READY_STATUS = 'ready';
const NOT_READY_STATUS = 'notReady';
const INVALID_STATUS = 'invalid';
const UNSUPPORTED_STATUS = 'unsupported';
const EMPTY_ASSIGNMENTS = Object.freeze({
  north: null,
  south: null,
});
const SUPPORTED_HOUSE_SYSTEMS = Object.freeze(['whole-sign', 'equal-house', 'placidus']);

export function assignLunarNodeToHouse(node = null, cuspResult = null) {
  const cuspReadiness = resolveCuspReadiness(cuspResult);

  if (cuspReadiness.status !== READY_STATUS) {
    return unavailableAssignment(cuspReadiness.status, cuspReadiness.reason, cuspReadiness.message, node);
  }

  const nodeReadiness = resolveNodeReadiness(node);

  if (nodeReadiness.status !== READY_STATUS) {
    return invalidAssignment(node, nodeReadiness.reason, nodeReadiness.message);
  }

  const house = findHouseForLunarNodeLongitude(nodeReadiness.longitude, cuspResult);

  if (!house) {
    return invalidAssignment(node, 'houseSpanNotFound', 'Дом для лунного узла не найден безопасно.');
  }

  const label = getNodeLabel(node);
  const houseLabel = `${house.number} дом`;

  return freezeObject({
    status: READY_STATUS,
    ready: true,
    key: getNodeKey(node),
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

export function assignLunarNodesToHouses(nodesResult = null, cuspResult = null) {
  const nodesReadiness = resolveNodesResultReadiness(nodesResult);

  if (nodesReadiness.status !== READY_STATUS) {
    return unavailableResult(nodesReadiness.status, nodesReadiness.reason, nodesReadiness.message);
  }

  const cuspReadiness = resolveCuspReadiness(cuspResult);

  if (cuspReadiness.status !== READY_STATUS) {
    return unavailableResult(cuspReadiness.status, cuspReadiness.reason, cuspReadiness.message, cuspResult?.houseSystem);
  }

  const assignments = freezeObject({
    north: assignLunarNodeToHouse(nodesResult.nodes.north, cuspResult),
    south: assignLunarNodeToHouse(nodesResult.nodes.south, cuspResult),
  });
  const summary = getLunarNodesHouseAssignmentSummary(assignments);

  return freezeObject({
    status: READY_STATUS,
    ready: true,
    houseSystem: cuspResult.houseSystem,
    total: summary.total,
    readyCount: summary.ready,
    invalidCount: summary.invalid,
    assignments,
    summary,
    limitations: getLunarNodesHouseAssignmentLimitations(),
    capabilities: getLunarNodesHouseAssignmentCapabilities(),
  });
}

export function assignLunarNodesToHousesForProfile(profile = null, options = {}) {
  if (!profile || typeof profile !== 'object') {
    return unavailableResult(NOT_READY_STATUS, 'missingProfile', 'Для назначения лунных узлов в дома нужен профиль.');
  }

  const nodesResult = isPlainObject(options.nodesResult)
    ? options.nodesResult
    : calculateLunarNodesForProfile(profile, options);

  if (!nodesResult || nodesResult.ready !== true) {
    return unavailableResult(
      nodesResult?.status === UNSUPPORTED_STATUS ? UNSUPPORTED_STATUS : NOT_READY_STATUS,
      nodesResult?.reason ?? 'lunarNodesNotReady',
      nodesResult?.message ?? 'Лунные узлы пока не рассчитаны.',
    );
  }

  const cuspResult = isPlainObject(options.cuspResult)
    ? options.cuspResult
    : getCanonicalHouseCuspsForProfile(profile, options);

  return assignLunarNodesToHouses(nodesResult, cuspResult);
}

export function findHouseForLunarNodeLongitude(longitude, cuspResult = null) {
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

export function getLunarNodesHouseAssignmentSummary(assignments = EMPTY_ASSIGNMENTS) {
  const assignmentItems = getAssignmentItems(assignments);

  if (assignmentItems.length === 0) {
    return freezeObject({
      total: 0,
      ready: 0,
      invalid: 0,
      byHouse: freezeObject({}),
      text: 'Лунные узлы недоступны',
    });
  }

  const readyAssignments = assignmentItems.filter((assignment) => assignment?.status === READY_STATUS);
  const byHouse = readyAssignments.reduce((memo, assignment) => {
    const key = String(assignment.houseNumber);

    memo[key] = (memo[key] ?? 0) + 1;
    return memo;
  }, {});

  return freezeObject({
    total: assignmentItems.length,
    ready: readyAssignments.length,
    invalid: assignmentItems.length - readyAssignments.length,
    byHouse: freezeObject(byHouse),
    text: readyAssignments.length > 0 ? 'Лунные узлы распределены по домам' : 'Лунные узлы недоступны',
  });
}

export function getLunarNodesHouseAssignmentCapabilities() {
  return freezeObject({
    lunarNodesHouseAssignment: true,
    northNode: true,
    southNode: true,
    meanNode: true,
    trueNode: false,
    wholeSign: true,
    equalHouse: true,
    placidus: true,
    lilith: false,
    selena: false,
    interpretations: false,
    transits: false,
    fixedStars: false,
  });
}

export function getLunarNodesHouseAssignmentLimitations() {
  return freezeArray([
    'Лунные узлы назначаются в дома по выбранной системе домов профиля.',
    'Используется точная числовая долгота узла, а не отображаемый текст.',
    'Граница куспида относится к дому, который с нее начинается.',
    'Для назначения в дом нужны готовые куспиды домов.',
    'Этот модуль не рассчитывает Lilith или Selena.',
    'Интерпретации не добавлены.',
  ]);
}

function resolveNodesResultReadiness(nodesResult) {
  if (!isPlainObject(nodesResult)) {
    return readiness(NOT_READY_STATUS, 'lunarNodesNotReady', 'Лунные узлы пока не рассчитаны.');
  }

  if (nodesResult.ready !== true) {
    return readiness(
      nodesResult.status === UNSUPPORTED_STATUS ? UNSUPPORTED_STATUS : NOT_READY_STATUS,
      nodesResult.reason ?? 'lunarNodesNotReady',
      nodesResult.message ?? 'Лунные узлы пока не рассчитаны.',
    );
  }

  if (!isPlainObject(nodesResult.nodes) || (!isPlainObject(nodesResult.nodes.north) && !isPlainObject(nodesResult.nodes.south))) {
    return readiness(NOT_READY_STATUS, 'emptyNodesResult', 'Нет рассчитанных лунных узлов для назначения в дома.');
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

function resolveNodeReadiness(node) {
  if (!isPlainObject(node)) {
    return readiness(INVALID_STATUS, 'missingLunarNode', 'Сначала нужен рассчитанный лунный узел.');
  }

  if (node.status && (node.status !== READY_STATUS || node.ready === false)) {
    return readiness(
      INVALID_STATUS,
      node.reason ?? 'lunarNodeNotReady',
      node.message ?? 'Лунный узел пока не рассчитан.',
    );
  }

  const normalized = normalizeDegrees(node.longitude);

  if (normalized === null) {
    return readiness(INVALID_STATUS, 'missingNodeLongitude', 'Для назначения лунного узла в дом нужна долгота узла.');
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

function getAssignmentItems(assignments) {
  if (Array.isArray(assignments)) {
    return assignments;
  }

  if (isPlainObject(assignments)) {
    return [assignments.north, assignments.south].filter(Boolean);
  }

  return [];
}

function invalidAssignment(node, reason, message) {
  return freezeObject({
    status: INVALID_STATUS,
    ready: false,
    key: getNodeKey(node),
    label: getNodeLabel(node),
    houseNumber: null,
    houseLabel: null,
    reason,
    ...(message ? { message } : {}),
  });
}

function unavailableAssignment(status, reason, message, node) {
  return freezeObject({
    status,
    ready: false,
    key: getNodeKey(node),
    label: getNodeLabel(node),
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
    assignments: EMPTY_ASSIGNMENTS,
    summary: getLunarNodesHouseAssignmentSummary(EMPTY_ASSIGNMENTS),
    limitations: getLunarNodesHouseAssignmentLimitations(),
    capabilities: getLunarNodesHouseAssignmentCapabilities(),
  });
}

function getNodeKey(node) {
  return typeof node?.key === 'string' && node.key.trim() ? node.key : null;
}

function getNodeLabel(node) {
  if (typeof node?.label === 'string' && node.label.trim()) {
    return node.label;
  }

  if (node?.key === 'north-node') {
    return 'Северный узел';
  }

  if (node?.key === 'south-node') {
    return 'Южный узел';
  }

  return 'Лунный узел';
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
