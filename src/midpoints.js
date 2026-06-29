import { formatDegree, normalizeDegrees } from './astroMath.js';
import { resolveMidpointTargetsForProfile } from './midpointTargets.js';

const READY_STATUS = 'ready';
const PARTIAL_STATUS = 'partial';
const NOT_READY_STATUS = 'notReady';
const INVALID_STATUS = 'invalid';
const AXIS_AMBIGUOUS_STATUS = 'axisAmbiguous';

const SOURCE_POLICY = 'midpoint-shortest-arc';
const MIDPOINT_TYPE = 'midpoint';
const EPSILON = 1e-9;

export const MIDPOINT_ENGINE_POLICY = Object.freeze({
  sourceKey: SOURCE_POLICY,
  formula: 'shortest-arc-midpoint',
  coordinateSystem: 'tropical-ecliptic-longitude',
  exactOppositionPolicy: 'axis-ambiguous',
  midpointAxisOutput: 'deferred',
  contacts: false,
  interpretations: false,
});

export function calculateShortestArcDelta(longitudeA, longitudeB) {
  const normalizedA = normalizeDegrees(longitudeA);
  const normalizedB = normalizeDegrees(longitudeB);

  if (normalizedA === null || normalizedB === null) {
    return invalidResult('invalidLongitude');
  }

  const delta = ((normalizedB - normalizedA + 540) % 360) - 180;
  const distance = Math.abs(delta);
  const exactOpposition = Math.abs(distance - 180) <= EPSILON;

  if (exactOpposition) {
    return Object.freeze({
      status: AXIS_AMBIGUOUS_STATUS,
      ready: false,
      delta,
      distance,
      normalizedA,
      normalizedB,
      exactOpposition: true,
      midpointAxisAmbiguous: true,
    });
  }

  return Object.freeze({
    status: READY_STATUS,
    ready: true,
    delta,
    distance,
    normalizedA,
    normalizedB,
    exactOpposition: false,
  });
}

export function calculateShortestArcMidpoint(longitudeA, longitudeB) {
  const deltaResult = calculateShortestArcDelta(longitudeA, longitudeB);

  if (deltaResult.status === INVALID_STATUS) {
    return Object.freeze({
      ...deltaResult,
      longitude: null,
      sourcePolicy: SOURCE_POLICY,
    });
  }

  if (deltaResult.status === AXIS_AMBIGUOUS_STATUS) {
    return Object.freeze({
      status: AXIS_AMBIGUOUS_STATUS,
      ready: false,
      longitude: null,
      distance: deltaResult.distance,
      delta: deltaResult.delta,
      exactOpposition: true,
      midpointAxisAmbiguous: true,
      candidateAxisPoints: Object.freeze([
        normalizeDegrees(deltaResult.normalizedA + 90),
        normalizeDegrees(deltaResult.normalizedA + 270),
      ]),
      reason: 'exactOppositionMidpointAxisAmbiguous',
      sourcePolicy: SOURCE_POLICY,
    });
  }

  return Object.freeze({
    status: READY_STATUS,
    ready: true,
    longitude: normalizeDegrees(deltaResult.normalizedA + deltaResult.delta / 2),
    distance: deltaResult.distance,
    delta: deltaResult.delta,
    exactOpposition: false,
    midpointAxisAmbiguous: false,
    sourcePolicy: SOURCE_POLICY,
  });
}

export function calculateMidpointForPair(pair, targetsByKeyOrTargets, options = {}) {
  const targetsByKey = normalizeTargetsByKey(targetsByKeyOrTargets);
  const pointAKey = normalizeKey(pair?.pointAKey);
  const pointBKey = normalizeKey(pair?.pointBKey);
  const targetA = targetsByKey.get(pointAKey);
  const targetB = targetsByKey.get(pointBKey);

  if (!pair?.key || !pointAKey || !pointBKey || !targetA || !targetB) {
    return invalidMidpointForPair(pair, 'invalidPairOrTarget');
  }

  const midpoint = calculateShortestArcMidpoint(targetA.longitude, targetB.longitude);
  const metadata = midpointMetadata(pair);

  if (midpoint.status === AXIS_AMBIGUOUS_STATUS) {
    return Object.freeze({
      ...metadata,
      status: AXIS_AMBIGUOUS_STATUS,
      ready: false,
      type: MIDPOINT_TYPE,
      longitude: null,
      distance: midpoint.distance,
      delta: midpoint.delta,
      exactOpposition: true,
      midpointAxisAmbiguous: true,
      candidateAxisPoints: midpoint.candidateAxisPoints,
      reason: midpoint.reason,
      text: null,
      sourcePolicy: SOURCE_POLICY,
    });
  }

  if (midpoint.status !== READY_STATUS) {
    return Object.freeze({
      ...metadata,
      status: INVALID_STATUS,
      ready: false,
      type: MIDPOINT_TYPE,
      longitude: null,
      reason: midpoint.reason ?? 'invalidMidpoint',
      text: null,
      sourcePolicy: SOURCE_POLICY,
    });
  }

  const formatted = formatMidpointPosition(midpoint.longitude);

  if (!formatted) {
    return invalidMidpointForPair(pair, 'invalidMidpointFormat');
  }

  return Object.freeze({
    ...metadata,
    status: READY_STATUS,
    ready: true,
    type: MIDPOINT_TYPE,
    longitude: midpoint.longitude,
    sign: formatted.sign,
    degree: formatted.degree,
    minutes: formatted.minutes,
    seconds: formatted.seconds,
    text: `${metadata.label} — ${formatted.sign.ru} ${pad2(formatted.degree)}°${pad2(formatted.minutes)}′${pad2(formatted.seconds)}″`,
    distance: midpoint.distance,
    delta: midpoint.delta,
    exactOpposition: false,
    midpointAxisAmbiguous: false,
    sourcePolicy: options.sourcePolicy ?? SOURCE_POLICY,
  });
}

export function calculateMidpointsFromTargets(targetsResult, options = {}) {
  if (!targetsResult?.ready || !Array.isArray(targetsResult.targets) || !Array.isArray(targetsResult.pairs)) {
    return midpointsNotReady('midpointTargetsNotReady');
  }

  const midpoints = targetsResult.pairs.map((pair) => (
    calculateMidpointForPair(pair, targetsResult.targets, options)
  ));
  const readyCount = midpoints.filter((midpoint) => midpoint.status === READY_STATUS).length;
  const ambiguousCount = midpoints.filter((midpoint) => midpoint.status === AXIS_AMBIGUOUS_STATUS).length;
  const invalidCount = midpoints.filter((midpoint) => midpoint.status === INVALID_STATUS).length;
  const status = ambiguousCount === 0 && invalidCount === 0 ? READY_STATUS : PARTIAL_STATUS;

  return Object.freeze({
    status,
    ready: true,
    sourcePolicy: SOURCE_POLICY,
    targetCount: Number.isFinite(targetsResult.targetCount) ? targetsResult.targetCount : targetsResult.targets.length,
    pairCount: targetsResult.pairs.length,
    readyCount,
    ambiguousCount,
    invalidCount,
    midpoints: Object.freeze(midpoints),
  });
}

export function calculateMidpointsForProfile(profile, options = {}) {
  const targetsResult = options.targetsResult ?? resolveMidpointTargetsForProfile(profile, options);

  return calculateMidpointsFromTargets(targetsResult, options);
}

export function getMidpointByKey(result, key) {
  const normalizedKey = normalizeKey(key);

  if (!normalizedKey || !Array.isArray(result?.midpoints)) {
    return null;
  }

  return result.midpoints.find((midpoint) => midpoint?.key === normalizedKey) ?? null;
}

export function validateMidpointResult(midpoint) {
  const reasons = [];

  if (![READY_STATUS, AXIS_AMBIGUOUS_STATUS, INVALID_STATUS].includes(midpoint?.status)) {
    reasons.push('invalidStatus');
  }

  if (!safeText(midpoint?.key) || !safeText(midpoint?.label)) {
    reasons.push('invalidMetadata');
  }

  if (midpoint?.status === READY_STATUS) {
    const normalized = normalizeDegrees(midpoint.longitude);

    if (normalized === null || Math.abs(normalized - midpoint.longitude) > EPSILON) {
      reasons.push('invalidLongitude');
    }

    if (
      !midpoint?.sign?.key
      || !midpoint?.sign?.ru
      || !midpoint?.sign?.symbol
      || !Number.isFinite(midpoint?.degree)
      || !Number.isFinite(midpoint?.minutes)
      || !Number.isFinite(midpoint?.seconds)
    ) {
      reasons.push('invalidZodiacPosition');
    }

    if (midpoint.exactOpposition || midpoint.midpointAxisAmbiguous) {
      reasons.push('unexpectedAxisAmbiguity');
    }
  }

  if (midpoint?.status === AXIS_AMBIGUOUS_STATUS) {
    if (midpoint.longitude !== null || !midpoint.exactOpposition || !midpoint.midpointAxisAmbiguous) {
      reasons.push('invalidAxisAmbiguity');
    }

    if (!Array.isArray(midpoint.candidateAxisPoints) || midpoint.candidateAxisPoints.length !== 2) {
      reasons.push('invalidCandidateAxisPoints');
    }
  }

  return Object.freeze({
    status: reasons.length === 0 ? READY_STATUS : INVALID_STATUS,
    valid: reasons.length === 0,
    reasons: Object.freeze(reasons),
  });
}

export function getMidpointSummary(result) {
  if (!result || !result.ready || result.status === NOT_READY_STATUS) {
    return Object.freeze({
      status: NOT_READY_STATUS,
      pairCount: 0,
      readyCount: 0,
      ambiguousCount: 0,
      text: 'Срединные точки недоступны',
    });
  }

  const pairCount = Number.isFinite(result.pairCount) ? result.pairCount : 0;
  const readyCount = Number.isFinite(result.readyCount) ? result.readyCount : 0;
  const ambiguousCount = Number.isFinite(result.ambiguousCount) ? result.ambiguousCount : 0;

  if (result.status === PARTIAL_STATUS) {
    return Object.freeze({
      status: PARTIAL_STATUS,
      pairCount,
      readyCount,
      ambiguousCount,
      text: `${readyCount} ${pluralMidpoint(readyCount)} ${calculatedSuffix(readyCount)}, ${ambiguousCount} ${pluralPair(ambiguousCount)} ${ambiguousCount === 1 ? 'имеет' : 'имеют'} неоднозначную ось`,
    });
  }

  return Object.freeze({
    status: READY_STATUS,
    pairCount,
    readyCount,
    ambiguousCount,
    text: `${readyCount} срединных точек рассчитаны`,
  });
}

export function getMidpointEngineCapabilities() {
  return Object.freeze({
    midpoints: true,
    shortestArcMidpoint: true,
    exactOppositionAmbiguity: true,
    midpointAxis: false,
    midpointContacts: false,
    antiscia: false,
    contraAntiscia: false,
    display: false,
    ui: false,
    debug: false,
    interpretations: false,
    transits: false,
  });
}

export function getMidpointEngineLimitations() {
  return Object.freeze([
    'В Sprint 16 рассчитываются срединные точки только между натальными планетами.',
    'ASC / MC / DSC / IC, дома, особые точки, арабские части и неподвижные звезды отложены для midpoint scope.',
    'При точной оппозиции midpoint axis помечается как неоднозначная ось.',
    'Этот модуль не рассчитывает midpoint contacts.',
    'Интерпретации не добавлены.',
  ]);
}

function invalidResult(reason) {
  return Object.freeze({
    status: INVALID_STATUS,
    ready: false,
    reason,
  });
}

function invalidMidpointForPair(pair, reason) {
  return Object.freeze({
    ...midpointMetadata(pair),
    status: INVALID_STATUS,
    ready: false,
    type: MIDPOINT_TYPE,
    longitude: null,
    reason,
    text: null,
    sourcePolicy: SOURCE_POLICY,
  });
}

function midpointsNotReady(reason) {
  return Object.freeze({
    status: NOT_READY_STATUS,
    ready: false,
    reason,
    targetCount: 0,
    pairCount: 0,
    readyCount: 0,
    ambiguousCount: 0,
    invalidCount: 0,
    midpoints: Object.freeze([]),
  });
}

function midpointMetadata(pair) {
  const pointAKey = normalizeKey(pair?.pointAKey);
  const pointBKey = normalizeKey(pair?.pointBKey);
  const pointALabel = safeText(pair?.pointALabel);
  const pointBLabel = safeText(pair?.pointBLabel);
  const label = safeText(pair?.label) || `${pointALabel} / ${pointBLabel}`;

  return Object.freeze({
    key: safeText(pair?.key),
    pointAKey,
    pointBKey,
    pointALabel,
    pointBLabel,
    label,
  });
}

function normalizeTargetsByKey(targetsByKeyOrTargets) {
  if (targetsByKeyOrTargets instanceof Map) {
    return new Map(
      [...targetsByKeyOrTargets.entries()]
        .map(([key, target]) => [normalizeKey(key), target])
        .filter(([, target]) => Number.isFinite(target?.longitude)),
    );
  }

  if (Array.isArray(targetsByKeyOrTargets)) {
    return new Map(
      targetsByKeyOrTargets
        .filter((target) => target?.key && Number.isFinite(target?.longitude))
        .map((target) => [normalizeKey(target.key), target]),
    );
  }

  if (targetsByKeyOrTargets && typeof targetsByKeyOrTargets === 'object') {
    return new Map(
      Object.entries(targetsByKeyOrTargets)
        .map(([key, target]) => [normalizeKey(key), target])
        .filter(([, target]) => Number.isFinite(target?.longitude)),
    );
  }

  return new Map();
}

function formatMidpointPosition(longitude) {
  const formatted = formatDegree(longitude);

  if (!formatted.signKey || !Number.isFinite(formatted.degree) || !Number.isFinite(formatted.minutes)) {
    return null;
  }

  return Object.freeze({
    sign: Object.freeze({
      key: formatted.signKey,
      ru: formatted.sign,
      symbol: formatted.symbol,
    }),
    degree: formatted.degree,
    minutes: formatted.minutes,
    seconds: Number.isFinite(formatted.seconds) ? formatted.seconds : 0,
  });
}

function normalizeKey(key) {
  return typeof key === 'string' && key.trim()
    ? key.trim().toLowerCase()
    : '';
}

function safeText(value) {
  return typeof value === 'string' && value.trim()
    ? value.trim()
    : '';
}

function pad2(value) {
  return String(value).padStart(2, '0');
}

function pluralMidpoint(count) {
  if (count % 10 === 1 && count % 100 !== 11) {
    return 'срединная точка';
  }

  if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) {
    return 'срединные точки';
  }

  return 'срединных точек';
}

function pluralPair(count) {
  if (count % 10 === 1 && count % 100 !== 11) {
    return 'пара';
  }

  if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) {
    return 'пары';
  }

  return 'пар';
}

function calculatedSuffix(count) {
  return count % 10 === 1 && count % 100 !== 11
    ? 'рассчитана'
    : 'рассчитаны';
}
