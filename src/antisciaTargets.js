import { formatDegree, normalizeDegrees } from './astroMath.js';
import { calculateAscMcForProfile } from './ascMc.js';
import { getNatalPlanetsForProfile } from './natalPlanetsForProfile.js';

const READY_STATUS = 'ready';
const PARTIAL_STATUS = 'partial';
const NOT_READY_STATUS = 'notReady';
const INVALID_STATUS = 'invalid';
const NATAL_TARGET_SET = 'natal-planets';
const ANGLE_TARGET_SET = 'angles';
const NATAL_CATEGORY = 'natal-planet';
const ANGLE_CATEGORY = 'angle';
const HALF_CIRCLE = 180;

const NATAL_TARGET_KEYS = Object.freeze([
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

const ANGLE_TARGET_KEYS = Object.freeze([
  'asc',
  'mc',
  'dsc',
  'ic',
]);

export const ANTISCIA_TARGET_KEYS = Object.freeze([
  ...NATAL_TARGET_KEYS,
  ...ANGLE_TARGET_KEYS,
]);

const DEFERRED_TARGET_SETS = Object.freeze([
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

export const ANTISCIA_TARGET_POLICY = Object.freeze({
  sourceKey: 'antiscia-targets-natal-planets-and-angles',
  activeTargetSets: Object.freeze([NATAL_TARGET_SET, ANGLE_TARGET_SET]),
  activeTargetKeys: ANTISCIA_TARGET_KEYS,
  expectedTargetCount: 14,
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

const ANGLE_LABELS = Object.freeze({
  asc: { label: 'ASC', labelEn: 'Ascendant' },
  mc: { label: 'MC', labelEn: 'Medium Coeli' },
  dsc: { label: 'DSC', labelEn: 'Descendant' },
  ic: { label: 'IC', labelEn: 'Imum Coeli' },
});

export function normalizeAntisciaTarget(target, options = {}) {
  const key = normalizeKey(options.key ?? target?.key);

  if (!ANTISCIA_TARGET_KEYS.includes(key)) {
    return null;
  }

  const longitude = normalizeDegrees(target?.longitude);

  if (longitude === null) {
    return null;
  }

  const labels = getLabelsForKey(key);
  const formatted = formatDegree(longitude);

  if (!labels || !formatted.signKey || !Number.isFinite(formatted.degree) || !Number.isFinite(formatted.minutes)) {
    return null;
  }

  const label = safeText(target?.label) || labels.label;
  const labelEn = safeText(target?.labelEn) || labels.labelEn;
  const seconds = Number.isFinite(formatted.seconds) ? formatted.seconds : 0;
  const targetSet = getTargetSetForKey(key);
  const category = getCategoryForKey(key);

  return Object.freeze({
    key,
    label,
    labelEn,
    category,
    targetSet,
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
    source: targetSet === NATAL_TARGET_SET ? NATAL_TARGET_SET : 'asc-mc',
  });
}

export function resolveAntisciaNatalPlanetTargets(planetsResult) {
  if (planetsResult?.status !== READY_STATUS || !Array.isArray(planetsResult.planets)) {
    return targetSetNotReady(NATAL_TARGET_SET, 'natalPlanetsNotReady');
  }

  const planetsByKey = new Map(planetsResult.planets.map((planet) => [normalizeKey(planet?.key), planet]));
  const targets = NATAL_TARGET_KEYS
    .map((key) => normalizeAntisciaTarget(planetsByKey.get(key), { key }))
    .filter(Boolean);

  if (targets.length !== NATAL_TARGET_KEYS.length) {
    return targetSetNotReady(NATAL_TARGET_SET, 'natalPlanetsNotReady');
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

export function resolveAntisciaAngleTargets(ascMcResult) {
  if (ascMcResult?.status !== READY_STATUS) {
    return targetSetNotReady(ANGLE_TARGET_SET, 'ascMcNotReady');
  }

  const rawAngles = ascMcResult.angles ?? ascMcResult;
  const asc = normalizeAntisciaTarget(rawAngles?.asc, { key: 'asc' });
  const mc = normalizeAntisciaTarget(rawAngles?.mc, { key: 'mc' });

  if (!asc || !mc) {
    return targetSetNotReady(ANGLE_TARGET_SET, 'ascMcNotReady');
  }

  const dsc = normalizeAntisciaTarget(rawAngles?.dsc, { key: 'dsc' })
    ?? deriveOppositeTarget(asc, 'dsc');
  const ic = normalizeAntisciaTarget(rawAngles?.ic, { key: 'ic' })
    ?? deriveOppositeTarget(mc, 'ic');
  const targets = [asc, mc, dsc, ic].filter(Boolean);

  if (targets.length !== ANGLE_TARGET_KEYS.length) {
    return targetSetNotReady(ANGLE_TARGET_SET, 'ascMcNotReady');
  }

  return Object.freeze({
    status: READY_STATUS,
    ready: true,
    targetSet: ANGLE_TARGET_SET,
    category: ANGLE_CATEGORY,
    count: targets.length,
    targets: Object.freeze(targets),
  });
}

export function resolveAntisciaTargets(input = {}) {
  const natalTargets = resolveAntisciaNatalPlanetTargets(input.natalPlanetsResult);
  const angleTargets = resolveAntisciaAngleTargets(input.ascMcResult);
  const readySets = [natalTargets, angleTargets].filter((result) => result.ready);

  if (readySets.length === 0) {
    return antisciaTargetsNotReady('antisciaTargetsNotReady');
  }

  const targets = Object.freeze([
    ...(natalTargets.ready ? natalTargets.targets : []),
    ...(angleTargets.ready ? angleTargets.targets : []),
  ]);
  const targetSets = Object.freeze(readySets.map((result) => result.targetSet));
  const missingTargetSets = Object.freeze(
    [natalTargets, angleTargets]
      .filter((result) => !result.ready)
      .map((result) => Object.freeze({
        targetSet: result.targetSet,
        reason: result.reason,
      })),
  );
  const isComplete = natalTargets.ready && angleTargets.ready;

  return Object.freeze({
    status: isComplete ? READY_STATUS : PARTIAL_STATUS,
    ready: true,
    targetSets,
    missingTargetSets,
    targetCount: targets.length,
    deferredTargetSets: getDeferredTargetSets(),
    targets,
    reason: null,
  });
}

export function resolveAntisciaTargetsForProfile(profile, options = {}) {
  const natalPlanetsResult = options.natalPlanetsResult ?? getNatalPlanetsForProfile(profile);
  const ascMcResult = options.ascMcResult ?? calculateAscMcForProfile(profile);

  return resolveAntisciaTargets({
    natalPlanetsResult,
    ascMcResult,
  });
}

export function getAntisciaTargetByKey(targetsResult, key) {
  const normalizedKey = normalizeKey(key);

  if (!normalizedKey || !Array.isArray(targetsResult?.targets)) {
    return null;
  }

  return targetsResult.targets.find((target) => target?.key === normalizedKey) ?? null;
}

export function validateAntisciaTarget(target) {
  const key = normalizeKey(target?.key);
  const reasons = [];

  if (!ANTISCIA_TARGET_KEYS.includes(key)) {
    reasons.push('invalidKey');
  }

  if (target?.category !== getCategoryForKey(key)) {
    reasons.push('invalidCategory');
  }

  if (target?.targetSet !== getTargetSetForKey(key)) {
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

export function getAntisciaTargetSummary(result) {
  if (!result || result.status === NOT_READY_STATUS || !result.ready) {
    return Object.freeze({
      status: NOT_READY_STATUS,
      targetCount: 0,
      text: 'Цели для антисов недоступны',
    });
  }

  const targetCount = Number.isFinite(result.targetCount) ? result.targetCount : 0;

  if (result.status === PARTIAL_STATUS) {
    return Object.freeze({
      status: PARTIAL_STATUS,
      targetCount,
      text: `${targetCount} целей для антисов готовы частично`,
    });
  }

  return Object.freeze({
    status: READY_STATUS,
    targetCount,
    text: `${targetCount} целей для антисов готовы`,
  });
}

export function getAntisciaTargetCapabilities() {
  return Object.freeze({
    antisciaTargets: true,
    natalPlanets: true,
    angles: true,
    houseCusps: false,
    specialPoints: false,
    arabicParts: false,
    fixedStars: false,
    antisciaEngine: false,
    contraAntisciaEngine: false,
    midpointEngine: false,
    display: false,
    ui: false,
    debug: false,
    interpretations: false,
    transits: false,
  });
}

export function getAntisciaTargetLimitations() {
  return Object.freeze([
    'В Sprint 16 целями для антисов являются натальные планеты и углы ASC / MC / DSC / IC.',
    'Куспиды домов, особые точки, арабские части и неподвижные звезды отложены.',
    'Этот модуль не рассчитывает антисы или контрантисы.',
    'Интерпретации не добавлены.',
  ]);
}

function deriveOppositeTarget(target, key) {
  if (!Number.isFinite(target?.longitude)) {
    return null;
  }

  return normalizeAntisciaTarget({
    key,
    longitude: target.longitude + HALF_CIRCLE,
  });
}

function targetSetNotReady(targetSet, reason) {
  return Object.freeze({
    status: NOT_READY_STATUS,
    ready: false,
    targetSet,
    reason,
    targets: Object.freeze([]),
  });
}

function antisciaTargetsNotReady(reason) {
  return Object.freeze({
    status: NOT_READY_STATUS,
    ready: false,
    reason,
    targetSets: Object.freeze([]),
    missingTargetSets: Object.freeze([
      Object.freeze({ targetSet: NATAL_TARGET_SET, reason: 'natalPlanetsNotReady' }),
      Object.freeze({ targetSet: ANGLE_TARGET_SET, reason: 'ascMcNotReady' }),
    ]),
    targetCount: 0,
    deferredTargetSets: getDeferredTargetSets(),
    targets: Object.freeze([]),
  });
}

function getDeferredTargetSets() {
  return Object.freeze([...DEFERRED_TARGET_SETS]);
}

function getLabelsForKey(key) {
  return NATAL_PLANET_LABELS[key] ?? ANGLE_LABELS[key] ?? null;
}

function getTargetSetForKey(key) {
  return NATAL_TARGET_KEYS.includes(key)
    ? NATAL_TARGET_SET
    : ANGLE_TARGET_SET;
}

function getCategoryForKey(key) {
  return NATAL_TARGET_KEYS.includes(key)
    ? NATAL_CATEGORY
    : ANGLE_CATEGORY;
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
