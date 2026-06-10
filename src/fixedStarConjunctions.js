import {
  getAngularDistance,
  normalizeDegrees,
} from './astroMath.js';
import { createBirthDateTimeInput } from './birthDateTime.js';
import { FIXED_STARS_ORB_POLICY } from './fixedStarsData.js';
import { calculateFixedStarPositions } from './fixedStarPositions.js';
import { resolveFixedStarTargetsForProfile } from './fixedStarTargets.js';

const READY_STATUS = 'ready';
const NOT_READY_STATUS = 'notReady';
const INVALID_STATUS = 'invalid';
const NOT_HIT_STATUS = 'notHit';
const RELATIONSHIP = 'conjunction';
const BOUNDARY_EPSILON = 1e-9;
const SECONDS_PER_DEGREE = 3600;
const SECONDS_PER_MINUTE = 60;

export function getFixedStarConjunctionOrbPolicy() {
  return Object.freeze({
    key: FIXED_STARS_ORB_POLICY.key,
    relationship: FIXED_STARS_ORB_POLICY.relationship,
    orbDegrees: FIXED_STARS_ORB_POLICY.globalOrbDegrees,
    inclusiveBoundary: true,
    perStarOverrides: FIXED_STARS_ORB_POLICY.perStarOverrides,
    perTargetOverrides: FIXED_STARS_ORB_POLICY.perTargetOverrides,
  });
}

export function calculateFixedStarAngularDistance(starLongitude, targetLongitude) {
  const distanceDegrees = getAngularDistance(starLongitude, targetLongitude);

  if (distanceDegrees === null) {
    return Object.freeze({
      status: INVALID_STATUS,
      ready: false,
      reason: 'invalidLongitude',
    });
  }

  return Object.freeze({
    status: READY_STATUS,
    distanceDegrees,
    distanceText: formatOrbText(distanceDegrees),
  });
}

export function isFixedStarConjunction(starLongitude, targetLongitude, orbPolicy = getFixedStarConjunctionOrbPolicy()) {
  const distance = calculateFixedStarAngularDistance(starLongitude, targetLongitude);
  const orbDegrees = Number(orbPolicy?.orbDegrees);

  if (distance.status !== READY_STATUS || !Number.isFinite(orbDegrees) || orbDegrees < 0) {
    return Object.freeze({
      status: INVALID_STATUS,
      hit: false,
      reason: 'invalidInput',
    });
  }

  const boundary = Math.abs(distance.distanceDegrees - orbDegrees) <= BOUNDARY_EPSILON;
  const withinOrb = distance.distanceDegrees <= orbDegrees + BOUNDARY_EPSILON;

  return Object.freeze({
    status: READY_STATUS,
    hit: withinOrb,
    relationship: RELATIONSHIP,
    distanceDegrees: distance.distanceDegrees,
    orbDegrees,
    withinOrb,
    boundary,
  });
}

export function calculateFixedStarConjunctionHit(starPosition, target, options = {}) {
  const orbPolicy = options.orbPolicy ?? getFixedStarConjunctionOrbPolicy();

  if (!isValidPosition(starPosition) || !isValidTarget(target)) {
    return Object.freeze({
      status: INVALID_STATUS,
      hit: false,
      reason: 'invalidInput',
    });
  }

  const check = isFixedStarConjunction(starPosition.longitude, target.longitude, orbPolicy);

  if (check.status !== READY_STATUS) {
    return Object.freeze({
      status: INVALID_STATUS,
      hit: false,
      reason: check.reason ?? 'invalidInput',
    });
  }

  if (!check.hit) {
    return Object.freeze({
      status: NOT_HIT_STATUS,
      hit: false,
      reason: 'outsideOrb',
    });
  }

  const starLabel = safeText(starPosition.labelRu) || safeText(starPosition.label) || starPosition.key;
  const targetLabel = safeText(target.label) || target.key;
  const orbText = formatOrbText(check.distanceDegrees);

  return Object.freeze({
    status: READY_STATUS,
    hit: true,
    relationship: RELATIONSHIP,
    starKey: starPosition.key,
    starLabel,
    starLabelEn: safeText(starPosition.labelEn),
    targetKey: target.key,
    targetLabel,
    targetCategory: safeText(target.category),
    distanceDegrees: check.distanceDegrees,
    orbDegrees: check.orbDegrees,
    orbText,
    text: `${starLabel} — соединение с ${targetLabel} · орб ${orbText}`,
    sourceSystem: safeText(starPosition.sourceSystem),
    orbPolicyKey: orbPolicy.key,
    boundary: check.boundary,
  });
}

export function calculateFixedStarConjunctions(input = {}) {
  const positionsResult = input.positionsResult;
  const targetsResult = input.targetsResult;
  const orbPolicy = input.orbPolicy ?? getFixedStarConjunctionOrbPolicy();
  const positions = getReadyPositions(positionsResult);
  const targets = getReadyTargets(targetsResult);

  if (positions.length === 0) {
    return notReadyResult('fixedStarPositionsNotReady');
  }

  if (targets.length === 0) {
    return notReadyResult('fixedStarTargetsNotReady');
  }

  const hits = [];

  positions.forEach((starPosition, starIndex) => {
    targets.forEach((target, targetIndex) => {
      const hit = calculateFixedStarConjunctionHit(starPosition, target, { orbPolicy });

      if (hit.hit === true) {
        hits.push(Object.freeze({
          ...hit,
          starOrder: starIndex,
          targetOrder: targetIndex,
        }));
      }
    });
  });

  hits.sort((a, b) =>
    (a.distanceDegrees - b.distanceDegrees)
    || (a.targetOrder - b.targetOrder)
    || (a.starOrder - b.starOrder));

  const sortedHits = hits.map(({ starOrder, targetOrder, ...hit }) => Object.freeze(hit));
  const partial = targetsResult?.status === 'partial';

  return Object.freeze({
    status: READY_STATUS,
    ready: true,
    relationship: RELATIONSHIP,
    orbPolicyKey: orbPolicy.key,
    orbDegrees: orbPolicy.orbDegrees,
    starCount: positions.length,
    targetCount: targets.length,
    hitCount: sortedHits.length,
    ...(partial ? { partial: true } : {}),
    targetSets: Object.freeze(Array.isArray(targetsResult?.targetSets) ? [...targetsResult.targetSets] : []),
    hits: Object.freeze(sortedHits),
    ...(sortedHits.length === 0
      ? { message: 'Соединений с неподвижными звездами в выбранном орбе не найдено.' }
      : {}),
  });
}

export function calculateFixedStarConjunctionsForProfile(profile, options = {}) {
  if (!profile) {
    return notReadyResult('fixedStarProfileNotReady');
  }

  const timeInput = createBirthDateTimeInput(profile);

  if (!timeInput.canConvertToUtc || !timeInput.utcDateTime) {
    return notReadyResult('fixedStarProfileNotReady');
  }

  const positionsResult = options.positionsResult ?? calculateFixedStarPositions({
    utcDateTime: timeInput.utcDateTime,
    ...(Array.isArray(options.starKeys) ? { starKeys: options.starKeys } : {}),
  });
  const targetsResult = options.targetsResult ?? resolveFixedStarTargetsForProfile(profile, options);

  return calculateFixedStarConjunctions({
    positionsResult,
    targetsResult,
    ...(options.orbPolicy ? { orbPolicy: options.orbPolicy } : {}),
  });
}

export function getFixedStarConjunctionByKey(result, starKey, targetKey) {
  if (!Array.isArray(result?.hits) || typeof starKey !== 'string' || typeof targetKey !== 'string') {
    return null;
  }

  return result.hits.find((hit) => hit.starKey === starKey && hit.targetKey === targetKey) ?? null;
}

export function getFixedStarConjunctionSummary(result) {
  if (!result || result.ready !== true) {
    return Object.freeze({
      status: NOT_READY_STATUS,
      hitCount: 0,
      starCount: 0,
      targetCount: 0,
      text: 'Соединения с неподвижными звездами недоступны',
    });
  }

  const hitCount = Number.isFinite(result.hitCount) ? result.hitCount : 0;

  return Object.freeze({
    status: READY_STATUS,
    hitCount,
    starCount: Number.isFinite(result.starCount) ? result.starCount : 0,
    targetCount: Number.isFinite(result.targetCount) ? result.targetCount : 0,
    text: hitCount === 0
      ? 'Соединений с неподвижными звездами не найдено'
      : `Найдено ${hitCount} соединения с неподвижными звездами`,
  });
}

export function getFixedStarConjunctionCapabilities() {
  return Object.freeze({
    fixedStarConjunctions: true,
    conjunction: true,
    globalOrb: true,
    opposition: false,
    square: false,
    trine: false,
    sextile: false,
    paran: false,
    heliacal: false,
    interpretations: false,
    transits: false,
    ui: false,
    debug: false,
  });
}

export function getFixedStarConjunctionLimitations() {
  return Object.freeze([
    'В Sprint 14 рассчитываются только соединения с неподвижными звездами.',
    'Используется глобальный орб 1°00′.',
    'Цели: натальные планеты и ASC / MC / DSC / IC.',
    'Параны, гелиакические явления и другие аспекты отложены.',
    'Интерпретации не добавлены.',
  ]);
}

function getReadyPositions(result) {
  if (result?.status !== READY_STATUS || !Array.isArray(result.positions)) {
    return [];
  }

  return result.positions.filter(isValidPosition);
}

function getReadyTargets(result) {
  if (!['ready', 'partial'].includes(result?.status) || result.ready !== true || !Array.isArray(result.targets)) {
    return [];
  }

  return result.targets.filter(isValidTarget);
}

function isValidPosition(position) {
  return Boolean(
    position
      && typeof position.key === 'string'
      && position.key.length > 0
      && Number.isFinite(position.longitude)
      && isNormalizedLongitude(position.longitude)
      && (safeText(position.labelRu) || safeText(position.label)),
  );
}

function isValidTarget(target) {
  return Boolean(
    target
      && typeof target.key === 'string'
      && target.key.length > 0
      && Number.isFinite(target.longitude)
      && isNormalizedLongitude(target.longitude)
      && safeText(target.label),
  );
}

function isNormalizedLongitude(value) {
  const normalized = normalizeDegrees(value);

  return normalized !== null && Math.abs(normalized - value) <= BOUNDARY_EPSILON;
}

function notReadyResult(reason) {
  return Object.freeze({
    status: NOT_READY_STATUS,
    ready: false,
    reason,
    hits: Object.freeze([]),
  });
}

function formatOrbText(distanceDegrees) {
  const totalSeconds = Math.round(distanceDegrees * SECONDS_PER_DEGREE);
  const degrees = Math.floor(totalSeconds / SECONDS_PER_DEGREE);
  const secondsAfterDegrees = totalSeconds % SECONDS_PER_DEGREE;
  const minutes = Math.floor(secondsAfterDegrees / SECONDS_PER_MINUTE);
  const seconds = secondsAfterDegrees % SECONDS_PER_MINUTE;

  return `${degrees}°${pad2(minutes)}′${pad2(seconds)}″`;
}

function safeText(value) {
  return typeof value === 'string' && value.trim()
    ? value.trim()
    : '';
}

function pad2(value) {
  return String(value).padStart(2, '0');
}
