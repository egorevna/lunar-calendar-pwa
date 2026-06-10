import { formatDegree, normalizeDegrees } from './astroMath.js';
import { calculateAscMcForProfile } from './ascMc.js';
import { FIXED_STARS_TARGET_POLICY } from './fixedStarsData.js';
import { getNatalPlanetsForProfile } from './natalPlanetsForProfile.js';

const READY_STATUS = 'ready';
const PARTIAL_STATUS = 'partial';
const NOT_READY_STATUS = 'notReady';

const NATAL_TARGET_SET = 'natal-planets';
const ANGLE_TARGET_SET = 'angles';
const NATAL_CATEGORY = 'natal-planet';
const ANGLE_CATEGORY = 'angle';

const NATAL_PLANET_ORDER = Object.freeze([
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

const ANGLE_ORDER = Object.freeze(['asc', 'mc', 'dsc', 'ic']);

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
  mc: { label: 'MC', labelEn: 'Midheaven' },
  dsc: { label: 'DSC', labelEn: 'Descendant' },
  ic: { label: 'IC', labelEn: 'Imum Coeli' },
});

const ACTIVE_TARGET_SETS = Object.freeze([NATAL_TARGET_SET, ANGLE_TARGET_SET]);

export function normalizeFixedStarTarget(target, options = {}) {
  const key = normalizeKey(options.key ?? target?.key);
  const targetSet = resolveTargetSet(key, options.targetSet ?? target?.targetSet);

  if (!key || !targetSet) {
    return null;
  }

  const longitude = normalizeDegrees(target?.longitude);

  if (longitude === null) {
    return null;
  }

  const labels = getLabelsForTarget(key, targetSet);

  if (!labels) {
    return null;
  }

  const formatted = formatDegree(longitude);

  if (!formatted.signKey || !Number.isFinite(formatted.degree) || !Number.isFinite(formatted.minutes)) {
    return null;
  }

  const seconds = Number.isFinite(formatted.seconds) ? formatted.seconds : 0;
  const label = safeText(target?.label) || labels.label;
  const labelEn = safeText(target?.labelEn) || labels.labelEn;

  return Object.freeze({
    key,
    label,
    labelEn,
    category: targetSet === NATAL_TARGET_SET ? NATAL_CATEGORY : ANGLE_CATEGORY,
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

export function resolveNatalPlanetTargets(planetsResult) {
  if (planetsResult?.status !== READY_STATUS || !Array.isArray(planetsResult.planets)) {
    return targetSetNotReady(NATAL_TARGET_SET, 'natalPlanetsNotReady');
  }

  const planetsByKey = new Map(planetsResult.planets.map((planet) => [planet?.key, planet]));
  const targets = NATAL_PLANET_ORDER
    .map((key) => normalizeFixedStarTarget(planetsByKey.get(key), {
      key,
      targetSet: NATAL_TARGET_SET,
    }))
    .filter(Boolean);

  if (targets.length !== NATAL_PLANET_ORDER.length) {
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

export function resolveAngleTargets(ascMcResult) {
  if (ascMcResult?.status !== READY_STATUS || !ascMcResult.angles) {
    return targetSetNotReady(
      ANGLE_TARGET_SET,
      safeMissingReason(ascMcResult?.reason, 'ascMcNotReady'),
    );
  }

  const targets = ANGLE_ORDER
    .map((key) => normalizeFixedStarTarget(ascMcResult.angles[key], {
      key,
      targetSet: ANGLE_TARGET_SET,
    }))
    .filter(Boolean);

  if (targets.length !== ANGLE_ORDER.length) {
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

export function resolveFixedStarTargets(input = {}) {
  const natalTargets = resolveNatalPlanetTargets(input.natalPlanetsResult);
  const angleTargets = resolveAngleTargets(input.ascMcResult);
  const readySets = [natalTargets, angleTargets].filter((set) => set.ready);
  const targets = readySets.flatMap((set) => set.targets);
  const missingTargetSets = [natalTargets, angleTargets]
    .filter((set) => !set.ready)
    .map((set) => Object.freeze({
      targetSet: set.targetSet,
      reason: set.reason,
    }));

  if (targets.length === 0) {
    return Object.freeze({
      status: NOT_READY_STATUS,
      ready: false,
      total: 0,
      readyCount: 0,
      invalidCount: 0,
      targetSets: Object.freeze([]),
      missingTargetSets: Object.freeze(missingTargetSets),
      deferredTargetSets: getDeferredTargetSets(),
      targets: Object.freeze([]),
      reason: 'fixedStarTargetsNotReady',
    });
  }

  const targetSets = readySets.map((set) => set.targetSet);
  const status = readySets.length === ACTIVE_TARGET_SETS.length ? READY_STATUS : PARTIAL_STATUS;

  return Object.freeze({
    status,
    ready: true,
    total: targets.length,
    readyCount: targets.length,
    invalidCount: 0,
    targetSets: Object.freeze(targetSets),
    missingTargetSets: Object.freeze(missingTargetSets),
    deferredTargetSets: getDeferredTargetSets(),
    targets: Object.freeze(targets),
    reason: null,
  });
}

export function resolveFixedStarTargetsForProfile(profile, options = {}) {
  const natalPlanetsResult = options.natalPlanetsResult ?? getNatalPlanetsForProfile(profile);
  const ascMcResult = options.ascMcResult ?? calculateAscMcForProfile(profile);

  return resolveFixedStarTargets({ natalPlanetsResult, ascMcResult });
}

export function getFixedStarTargetByKey(targetsResult, key) {
  const normalizedKey = normalizeKey(key);

  if (!normalizedKey || !Array.isArray(targetsResult?.targets)) {
    return null;
  }

  return targetsResult.targets.find((target) => target?.key === normalizedKey) ?? null;
}

export function validateFixedStarTarget(target) {
  const reasons = [];

  if (!normalizeKey(target?.key)) {
    reasons.push('invalidKey');
  }

  if (!safeText(target?.label)) {
    reasons.push('invalidLabel');
  }

  if (![NATAL_CATEGORY, ANGLE_CATEGORY].includes(target?.category)) {
    reasons.push('invalidCategory');
  }

  if (!Number.isFinite(target?.longitude) || normalizeDegrees(target.longitude) !== target.longitude) {
    reasons.push('invalidLongitude');
  }

  if (
    !target?.sign?.key
    || !target?.sign?.ru
    || !Number.isFinite(target?.degree)
    || !Number.isFinite(target?.minutes)
    || !Number.isFinite(target?.seconds)
  ) {
    reasons.push('invalidZodiacPosition');
  }

  return Object.freeze({
    status: reasons.length === 0 ? READY_STATUS : 'invalid',
    valid: reasons.length === 0,
    reasons: Object.freeze(reasons),
  });
}

export function getFixedStarTargetSummary(result) {
  if (!result || result.status === NOT_READY_STATUS || !result.ready) {
    return Object.freeze({
      status: NOT_READY_STATUS,
      total: 0,
      ready: 0,
      targetSets: Object.freeze([]),
      text: 'Цели для неподвижных звезд недоступны',
    });
  }

  const ready = Number.isFinite(result.readyCount) ? result.readyCount : 0;
  const targetSets = Array.isArray(result.targetSets) ? result.targetSets : [];

  return Object.freeze({
    status: result.status,
    total: Number.isFinite(result.total) ? result.total : ready,
    ready,
    targetSets: Object.freeze([...targetSets]),
    text: result.status === PARTIAL_STATUS
      ? `${ready} целей для неподвижных звезд готовы частично`
      : `${ready} целей для неподвижных звезд готовы`,
  });
}

export function getFixedStarTargetCapabilities() {
  return Object.freeze({
    fixedStarTargets: true,
    natalPlanets: true,
    angles: true,
    houseCusps: false,
    lunarNodes: false,
    lilith: false,
    selena: false,
    arabicParts: false,
    conjunctionEngine: false,
    interpretations: false,
    transits: false,
  });
}

export function getFixedStarTargetLimitations() {
  return Object.freeze([
    'В Sprint 14 целями для неподвижных звезд являются натальные планеты и углы карты.',
    'Куспиды домов, особые точки и арабские части отложены как цели.',
    'Этот модуль не рассчитывает соединения с неподвижными звездами.',
    'Интерпретации не добавлены.',
  ]);
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

function resolveTargetSet(key, explicitTargetSet) {
  if (explicitTargetSet === NATAL_TARGET_SET && NATAL_PLANET_ORDER.includes(key)) {
    return NATAL_TARGET_SET;
  }

  if (explicitTargetSet === ANGLE_TARGET_SET && ANGLE_ORDER.includes(key)) {
    return ANGLE_TARGET_SET;
  }

  if (NATAL_PLANET_ORDER.includes(key)) {
    return NATAL_TARGET_SET;
  }

  if (ANGLE_ORDER.includes(key)) {
    return ANGLE_TARGET_SET;
  }

  return null;
}

function getLabelsForTarget(key, targetSet) {
  return targetSet === NATAL_TARGET_SET
    ? NATAL_PLANET_LABELS[key] ?? null
    : ANGLE_LABELS[key] ?? null;
}

function getDeferredTargetSets() {
  return Object.freeze([...(FIXED_STARS_TARGET_POLICY.deferredTargetSets ?? [])]);
}

function safeMissingReason(reason, fallback) {
  const value = safeText(reason);

  if (!value) {
    return fallback;
  }

  const lower = value.toLowerCase();

  if (
    lower.includes('birthdate')
    || lower.includes('birthtime')
    || lower.includes('utcdatetime')
    || lower.includes('timezone')
  ) {
    return fallback;
  }

  return value;
}

function normalizeKey(key) {
  return typeof key === 'string' && key.trim()
    ? key.trim()
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
