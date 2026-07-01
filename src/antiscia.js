import { formatDegree, normalizeDegrees } from './astroMath.js';
import { resolveAntisciaTargetsForProfile } from './antisciaTargets.js';

const READY_STATUS = 'ready';
const PARTIAL_STATUS = 'partial';
const NOT_READY_STATUS = 'notReady';
const INVALID_STATUS = 'invalid';
const SOURCE_POLICY = 'antiscia-solstice-axis-and-contra-equinox-axis';
const ANTISCION_SOURCE_POLICY = 'antiscia-solstice-axis';
const CONTRA_SOURCE_POLICY = 'contra-antiscia-equinox-axis';
const ANTISCION_FORMULA = 'normalize(180 - longitude)';
const CONTRA_FORMULA = 'normalize(360 - longitude)';

export const ANTISCIA_ENGINE_POLICY = Object.freeze({
  sourceKey: SOURCE_POLICY,
  coordinateSystem: 'tropical-ecliptic-longitude',
  antiscionFormula: ANTISCION_FORMULA,
  contraAntiscionFormula: CONTRA_FORMULA,
  activeTargetPolicy: 'natal-planets-and-angles',
  contacts: false,
  interpretations: false,
});

export function calculateAntiscionLongitude(longitude) {
  const normalized = normalizeDegrees(longitude);

  if (normalized === null) {
    return invalidLongitudeResult(ANTISCION_FORMULA, ANTISCION_SOURCE_POLICY);
  }

  return Object.freeze({
    status: READY_STATUS,
    ready: true,
    inputLongitude: normalized,
    longitude: normalizeDegrees(180 - normalized),
    formula: ANTISCION_FORMULA,
    sourcePolicy: ANTISCION_SOURCE_POLICY,
  });
}

export function calculateContraAntiscionLongitude(longitude) {
  const normalized = normalizeDegrees(longitude);

  if (normalized === null) {
    return invalidLongitudeResult(CONTRA_FORMULA, CONTRA_SOURCE_POLICY);
  }

  return Object.freeze({
    status: READY_STATUS,
    ready: true,
    inputLongitude: normalized,
    longitude: normalizeDegrees(360 - normalized),
    formula: CONTRA_FORMULA,
    sourcePolicy: CONTRA_SOURCE_POLICY,
  });
}

export function calculateAntisciaForTarget(target, options = {}) {
  const targetLongitude = normalizeDegrees(target?.longitude);
  const key = normalizeKey(target?.key);
  const label = safeText(target?.label);
  const labelEn = safeText(target?.labelEn);

  if (!key || !label || targetLongitude === null) {
    return invalidTargetResult(target, 'invalidLongitude');
  }

  const antiscionLongitude = calculateAntiscionLongitude(targetLongitude);
  const contraAntiscionLongitude = calculateContraAntiscionLongitude(targetLongitude);

  if (!antiscionLongitude.ready || !contraAntiscionLongitude.ready) {
    return invalidTargetResult(target, 'invalidLongitude');
  }

  const antiscion = formatAntisciaPoint('antiscion', antiscionLongitude.longitude);
  const contraAntiscion = formatAntisciaPoint('contraAntiscion', contraAntiscionLongitude.longitude);

  if (!antiscion || !contraAntiscion) {
    return invalidTargetResult(target, 'invalidZodiacPosition');
  }

  return Object.freeze({
    status: READY_STATUS,
    ready: true,
    type: 'antiscia',
    key,
    targetKey: key,
    targetLabel: label,
    targetLabelEn: labelEn,
    targetCategory: safeText(target?.category),
    targetSet: safeText(target?.targetSet),
    targetLongitude,
    antiscion,
    contraAntiscion,
    sourcePolicy: options.sourcePolicy ?? SOURCE_POLICY,
    contacts: false,
    interpretations: false,
  });
}

export function calculateAntisciaFromTargets(targetsResult, options = {}) {
  if (!targetsResult?.ready || !Array.isArray(targetsResult.targets) || targetsResult.targets.length === 0) {
    return antisciaNotReady('antisciaTargetsNotReady');
  }

  const results = targetsResult.targets.map((target) => calculateAntisciaForTarget(target, options));
  const readyCount = results.filter((result) => result.status === READY_STATUS).length;
  const invalidCount = results.filter((result) => result.status === INVALID_STATUS).length;
  const isPartial = targetsResult.status === PARTIAL_STATUS || invalidCount > 0;

  return Object.freeze({
    status: isPartial ? PARTIAL_STATUS : READY_STATUS,
    ready: true,
    sourcePolicy: SOURCE_POLICY,
    targetCount: Number.isFinite(targetsResult.targetCount) ? targetsResult.targetCount : targetsResult.targets.length,
    readyCount,
    invalidCount,
    missingTargetSets: Object.freeze(targetsResult.missingTargetSets ?? []),
    results: Object.freeze(results),
  });
}

export function calculateAntisciaForProfile(profile, options = {}) {
  const targetsResult = options.targetsResult ?? resolveAntisciaTargetsForProfile(profile, options);

  return calculateAntisciaFromTargets(targetsResult, options);
}

export function getAntisciaResultByKey(result, key) {
  const normalizedKey = normalizeKey(key);

  if (!normalizedKey || !Array.isArray(result?.results)) {
    return null;
  }

  return result.results.find((item) => item?.key === normalizedKey) ?? null;
}

export function validateAntisciaResult(result) {
  const reasons = [];

  if (result?.status !== READY_STATUS) {
    reasons.push('invalidStatus');
  }

  if (result?.status === READY_STATUS) {
    if (!safeText(result?.key) || !safeText(result?.targetLabel)) {
      reasons.push('invalidLabel');
    }

    if (!isFormattedPointReady(result?.antiscion)) {
      reasons.push('invalidAntiscion');
    }

    if (!isFormattedPointReady(result?.contraAntiscion)) {
      reasons.push('invalidContraAntiscion');
    }

    if (result?.contacts !== false || result?.interpretations !== false) {
      reasons.push('invalidDeferredFlags');
    }
  }

  return Object.freeze({
    status: reasons.length === 0 ? READY_STATUS : INVALID_STATUS,
    valid: reasons.length === 0,
    reasons: Object.freeze(reasons),
  });
}

export function getAntisciaSummary(result) {
  if (!result || result.status === NOT_READY_STATUS || !result.ready) {
    return Object.freeze({
      status: NOT_READY_STATUS,
      targetCount: 0,
      readyCount: 0,
      text: 'Антисы и контрантисы недоступны',
    });
  }

  const targetCount = Number.isFinite(result.targetCount) ? result.targetCount : 0;
  const readyCount = Number.isFinite(result.readyCount) ? result.readyCount : 0;

  if (result.status === PARTIAL_STATUS) {
    return Object.freeze({
      status: PARTIAL_STATUS,
      targetCount,
      readyCount,
      text: `${readyCount} антисов и контрантисов рассчитаны частично`,
    });
  }

  return Object.freeze({
    status: READY_STATUS,
    targetCount,
    readyCount,
    text: `${readyCount} антисов и контрантисов рассчитаны`,
  });
}

export function getAntisciaEngineCapabilities() {
  return Object.freeze({
    antiscia: true,
    contraAntiscia: true,
    natalPlanets: true,
    angles: true,
    houseCusps: false,
    specialPoints: false,
    arabicParts: false,
    fixedStars: false,
    contacts: false,
    aspects: false,
    midpoints: false,
    display: false,
    ui: false,
    debug: false,
    interpretations: false,
    transits: false,
  });
}

export function getAntisciaEngineLimitations() {
  return Object.freeze([
    'В Sprint 16 антисы и контрантисы рассчитываются для натальных планет и углов ASC / MC / DSC / IC.',
    'Куспиды домов, особые точки, арабские части и неподвижные звезды отложены.',
    'Этот модуль не рассчитывает контакты или аспекты к антисам.',
    'Интерпретации не добавлены.',
  ]);
}

function formatAntisciaPoint(kind, longitude) {
  const normalized = normalizeDegrees(longitude);
  const formatted = formatDegree(normalized);

  if (normalized === null || !formatted.signKey || !Number.isFinite(formatted.degree) || !Number.isFinite(formatted.minutes)) {
    return null;
  }

  const seconds = Number.isFinite(formatted.seconds) ? formatted.seconds : 0;
  const label = kind === 'contraAntiscion' ? 'контрантис' : 'антис';

  return Object.freeze({
    longitude: normalized,
    sign: Object.freeze({
      key: formatted.signKey,
      ru: formatted.sign,
      symbol: formatted.symbol,
    }),
    degree: formatted.degree,
    minutes: formatted.minutes,
    seconds,
    text: `${label} — ${formatted.sign} ${pad2(formatted.degree)}°${pad2(formatted.minutes)}′${pad2(seconds)}″`,
  });
}

function isFormattedPointReady(point) {
  return Number.isFinite(point?.longitude)
    && normalizeDegrees(point.longitude) === point.longitude
    && !!point?.sign?.key
    && !!point?.sign?.ru
    && !!point?.sign?.symbol
    && Number.isFinite(point?.degree)
    && Number.isFinite(point?.minutes)
    && Number.isFinite(point?.seconds)
    && safeText(point?.text);
}

function invalidLongitudeResult(formula, sourcePolicy) {
  return Object.freeze({
    status: INVALID_STATUS,
    ready: false,
    reason: 'invalidLongitude',
    longitude: null,
    formula,
    sourcePolicy,
  });
}

function invalidTargetResult(target, reason) {
  return Object.freeze({
    status: INVALID_STATUS,
    ready: false,
    type: 'antiscia',
    key: normalizeKey(target?.key),
    targetKey: normalizeKey(target?.key),
    targetLabel: safeText(target?.label),
    reason,
    antiscion: null,
    contraAntiscion: null,
    sourcePolicy: SOURCE_POLICY,
    contacts: false,
    interpretations: false,
  });
}

function antisciaNotReady(reason) {
  return Object.freeze({
    status: NOT_READY_STATUS,
    ready: false,
    reason,
    sourcePolicy: SOURCE_POLICY,
    targetCount: 0,
    readyCount: 0,
    invalidCount: 0,
    missingTargetSets: Object.freeze([]),
    results: Object.freeze([]),
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
