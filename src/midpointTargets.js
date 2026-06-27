import { formatDegree, normalizeDegrees } from './astroMath.js';
import { getNatalPlanetsForProfile } from './natalPlanetsForProfile.js';

const READY_STATUS = 'ready';
const NOT_READY_STATUS = 'notReady';
const INVALID_STATUS = 'invalid';

const NATAL_TARGET_SET = 'natal-planets';
const NATAL_CATEGORY = 'natal-planet';
const PENDING_CALCULATION_STATUS = 'pendingMidpointEngine';

export const MIDPOINT_TARGET_KEYS = Object.freeze([
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
]);

const DEFERRED_TARGET_SETS = Object.freeze([
  'angles',
  'house-cusps',
  'lunar-nodes',
  'lilith',
  'selena',
  'pars-fortuna',
  'lot-of-spirit',
  'vronsky-arabic-points',
  'fixed-stars',
  'custom-points',
]);

export const MIDPOINT_TARGET_POLICY = Object.freeze({
  sourceKey: 'midpoints-natal-planets-only',
  activeTargetSet: NATAL_TARGET_SET,
  activeTargetKeys: MIDPOINT_TARGET_KEYS,
  expectedTargetCount: 10,
  expectedPairCount: 45,
  deferredTargetSets: DEFERRED_TARGET_SETS,
});

const NATAL_PLANET_LABELS = Object.freeze({
  sun: { label: 'Солнце', labelEn: 'Sun' },
  moon: { label: 'Луна', labelEn: 'Moon' },
  mercury: { label: 'Меркурий', labelEn: 'Mercury' },
  venus: { label: 'Венера', labelEn: 'Venus' },
  mars: { label: 'Марс', labelEn: 'Mars' },
  jupiter: { label: 'Юпитер', labelEn: 'Jupiter' },
  saturn: { label: 'Сатурн', labelEn: 'Saturn' },
  uranus: { label: 'Уран', labelEn: 'Uranus' },
  neptune: { label: 'Нептун', labelEn: 'Neptune' },
  pluto: { label: 'Плутон', labelEn: 'Pluto' },
});

export function normalizeMidpointTarget(target, options = {}) {
  const key = normalizeKey(options.key ?? target?.key);

  if (!MIDPOINT_TARGET_KEYS.includes(key)) {
    return null;
  }

  const longitude = normalizeDegrees(target?.longitude);

  if (longitude === null) {
    return null;
  }

  const labels = NATAL_PLANET_LABELS[key];
  const formatted = formatDegree(longitude);

  if (!labels || !formatted.signKey || !Number.isFinite(formatted.degree) || !Number.isFinite(formatted.minutes)) {
    return null;
  }

  const label = safeText(target?.label) || labels.label;
  const labelEn = safeText(target?.labelEn) || labels.labelEn;
  const seconds = Number.isFinite(formatted.seconds) ? formatted.seconds : 0;

  return Object.freeze({
    key,
    label,
    labelEn,
    category: NATAL_CATEGORY,
    targetSet: NATAL_TARGET_SET,
    longitude,
    sign: Object.freeze({
      key: formatted.signKey,
      ru: formatted.sign,
      symbol: formatted.symbol,
    }),
    degree: formatted.degree,
    minutes: formatted.minutes,
    seconds,
    text: `${label} — ${formatted.sign} ${pad2(formatted.degree)}°${pad2(formatted.minutes)}′${pad2(seconds)}″`,
    source: NATAL_TARGET_SET,
  });
}

export function resolveMidpointNatalPlanetTargets(planetsResult) {
  if (planetsResult?.status !== READY_STATUS || !Array.isArray(planetsResult.planets)) {
    return targetSetNotReady('natalPlanetsNotReady');
  }

  const planetsByKey = new Map(planetsResult.planets.map((planet) => [normalizeKey(planet?.key), planet]));
  const targets = MIDPOINT_TARGET_KEYS
    .map((key) => normalizeMidpointTarget(planetsByKey.get(key), { key }))
    .filter(Boolean);

  if (targets.length !== MIDPOINT_TARGET_KEYS.length) {
    return targetSetNotReady('natalPlanetsNotReady');
  }

  return Object.freeze({
    status: READY_STATUS,
    ready: true,
    targetSet: NATAL_TARGET_SET,
    category: NATAL_CATEGORY,
    count: targets.length,
    targets: Object.freeze(targets),
  });
}

export function buildMidpointTargetPairs(targets) {
  const normalizedTargets = normalizeTargetList(targets);

  if (normalizedTargets.length !== MIDPOINT_TARGET_KEYS.length) {
    return pairsNotReady('insufficientMidpointTargets');
  }

  const pairs = [];

  for (let i = 0; i < normalizedTargets.length; i += 1) {
    for (let j = i + 1; j < normalizedTargets.length; j += 1) {
      const pointA = normalizedTargets[i];
      const pointB = normalizedTargets[j];

      pairs.push(Object.freeze({
        key: `${pointA.key}-${pointB.key}`,
        pointAKey: pointA.key,
        pointBKey: pointB.key,
        pointALabel: pointA.label,
        pointBLabel: pointB.label,
        label: `${pointA.label} / ${pointB.label}`,
        pairIndex: pairs.length,
        targetSet: NATAL_TARGET_SET,
        calculationStatus: PENDING_CALCULATION_STATUS,
      }));
    }
  }

  return Object.freeze({
    status: READY_STATUS,
    ready: true,
    targetCount: normalizedTargets.length,
    pairCount: pairs.length,
    pairs: Object.freeze(pairs),
  });
}

export function resolveMidpointTargets(input = {}) {
  const targetResult = resolveMidpointNatalPlanetTargets(input.natalPlanetsResult);

  if (!targetResult.ready) {
    return midpointTargetsNotReady('midpointTargetsNotReady');
  }

  const pairResult = buildMidpointTargetPairs(targetResult.targets);

  if (!pairResult.ready) {
    return midpointTargetsNotReady(pairResult.reason ?? 'midpointTargetsNotReady');
  }

  return Object.freeze({
    status: READY_STATUS,
    ready: true,
    targetSet: NATAL_TARGET_SET,
    targetCount: targetResult.count,
    pairCount: pairResult.pairCount,
    deferredTargetSets: getDeferredTargetSets(),
    targets: targetResult.targets,
    pairs: pairResult.pairs,
    reason: null,
  });
}

export function resolveMidpointTargetsForProfile(profile, options = {}) {
  const natalPlanetsResult = options.natalPlanetsResult ?? getNatalPlanetsForProfile(profile);

  return resolveMidpointTargets({ natalPlanetsResult });
}

export function getMidpointTargetByKey(targetsResult, key) {
  const normalizedKey = normalizeKey(key);

  if (!normalizedKey || !Array.isArray(targetsResult?.targets)) {
    return null;
  }

  return targetsResult.targets.find((target) => target?.key === normalizedKey) ?? null;
}

export function getMidpointPairByKey(targetsResult, key) {
  const normalizedKey = normalizeKey(key);

  if (!normalizedKey || !Array.isArray(targetsResult?.pairs)) {
    return null;
  }

  return targetsResult.pairs.find((pair) => pair?.key === normalizedKey) ?? null;
}

export function validateMidpointTarget(target) {
  const reasons = [];

  if (!MIDPOINT_TARGET_KEYS.includes(normalizeKey(target?.key))) {
    reasons.push('invalidKey');
  }

  if (target?.category !== NATAL_CATEGORY) {
    reasons.push('invalidCategory');
  }

  if (target?.targetSet !== NATAL_TARGET_SET) {
    reasons.push('invalidTargetSet');
  }

  if (!safeText(target?.label)) {
    reasons.push('invalidLabel');
  }

  if (!Number.isFinite(target?.longitude) || normalizeDegrees(target.longitude) !== target.longitude) {
    reasons.push('invalidLongitude');
  }

  if (
    !target?.sign?.key
    || !target?.sign?.ru
    || !target?.sign?.symbol
    || !Number.isFinite(target?.degree)
    || !Number.isFinite(target?.minutes)
    || !Number.isFinite(target?.seconds)
  ) {
    reasons.push('invalidZodiacPosition');
  }

  return Object.freeze({
    status: reasons.length === 0 ? READY_STATUS : INVALID_STATUS,
    valid: reasons.length === 0,
    reasons: Object.freeze(reasons),
  });
}

export function validateMidpointPair(pair) {
  const pointAKey = normalizeKey(pair?.pointAKey);
  const pointBKey = normalizeKey(pair?.pointBKey);
  const reasons = [];

  if (!MIDPOINT_TARGET_KEYS.includes(pointAKey) || !MIDPOINT_TARGET_KEYS.includes(pointBKey)) {
    reasons.push('invalidPointKey');
  }

  if (pointAKey === pointBKey) {
    reasons.push('selfPair');
  }

  if (pair?.key !== `${pointAKey}-${pointBKey}`) {
    reasons.push('invalidPairKey');
  }

  if (typeof pair?.label !== 'string' || !pair.label.includes(' / ')) {
    reasons.push('invalidLabel');
  }

  if (Number.isFinite(pair?.longitude) || Number.isFinite(pair?.midpointLongitude)) {
    reasons.push('calculatedMidpointNotAllowed');
  }

  if (pair?.calculationStatus !== PENDING_CALCULATION_STATUS) {
    reasons.push('invalidCalculationStatus');
  }

  return Object.freeze({
    status: reasons.length === 0 ? READY_STATUS : INVALID_STATUS,
    valid: reasons.length === 0,
    reasons: Object.freeze(reasons),
  });
}

export function getMidpointTargetSummary(result) {
  if (!result || result.status === NOT_READY_STATUS || !result.ready) {
    return Object.freeze({
      status: NOT_READY_STATUS,
      targetCount: 0,
      pairCount: 0,
      text: 'Цели для срединных точек недоступны',
    });
  }

  return Object.freeze({
    status: READY_STATUS,
    targetCount: Number.isFinite(result.targetCount) ? result.targetCount : 0,
    pairCount: Number.isFinite(result.pairCount) ? result.pairCount : 0,
    text: `${result.targetCount} целей и ${result.pairCount} пар для срединных точек готовы`,
  });
}

export function getMidpointTargetCapabilities() {
  return Object.freeze({
    midpointTargets: true,
    natalPlanets: true,
    angles: false,
    houseCusps: false,
    specialPoints: false,
    arabicParts: false,
    fixedStars: false,
    midpointEngine: false,
    antisciaEngine: false,
    display: false,
    ui: false,
    debug: false,
    interpretations: false,
    transits: false,
  });
}

export function getMidpointTargetLimitations() {
  return Object.freeze([
    'В Sprint 16 целями для срединных точек являются только натальные планеты.',
    'ASC / MC / DSC / IC, дома, особые точки, арабские части и неподвижные звезды отложены.',
    'Этот модуль не рассчитывает сами срединные точки.',
    'Интерпретации не добавлены.',
  ]);
}

function normalizeTargetList(targets) {
  if (!Array.isArray(targets)) {
    return [];
  }

  const targetsByKey = new Map(
    targets
      .map((target) => normalizeMidpointTarget(target))
      .filter(Boolean)
      .map((target) => [target.key, target]),
  );

  return MIDPOINT_TARGET_KEYS
    .map((key) => targetsByKey.get(key))
    .filter(Boolean);
}

function targetSetNotReady(reason) {
  return Object.freeze({
    status: NOT_READY_STATUS,
    ready: false,
    targetSet: NATAL_TARGET_SET,
    reason,
    targets: Object.freeze([]),
  });
}

function pairsNotReady(reason) {
  return Object.freeze({
    status: NOT_READY_STATUS,
    ready: false,
    targetCount: 0,
    pairCount: 0,
    reason,
    pairs: Object.freeze([]),
  });
}

function midpointTargetsNotReady(reason) {
  return Object.freeze({
    status: NOT_READY_STATUS,
    ready: false,
    reason,
    targetSet: NATAL_TARGET_SET,
    targetCount: 0,
    pairCount: 0,
    deferredTargetSets: getDeferredTargetSets(),
    targets: Object.freeze([]),
    pairs: Object.freeze([]),
  });
}

function getDeferredTargetSets() {
  return Object.freeze([...DEFERRED_TARGET_SETS]);
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
