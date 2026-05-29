import { formatDegree, getZodiacSign, normalizeDegrees } from './astroMath.js';
import { createBirthDateTimeInput } from './birthDateTime.js';

const SOURCE_SYSTEM = 'mean-lunar-node';
const SOURCE_KEY = 'lunar-nodes-mean';
const NODE_TYPE = 'mean';
const VERIFICATION_STATUS = 'verified';
const VALIDATION_SOURCE = 'static-swisseph-SE_MEAN_NODE-fixtures';
const DEFERRED_NODE_SYSTEM = 'true-lunar-node';
const J2000_UTC_MS = Date.UTC(2000, 0, 1, 12, 0, 0, 0);
const MILLISECONDS_PER_DAY = 86_400_000;
const JULIAN_DAYS_PER_CENTURY = 36_525;

const NODE_LABELS = Object.freeze({
  'north-node': Object.freeze({
    label: 'Северный узел',
    labelEn: 'North Node',
  }),
  'south-node': Object.freeze({
    label: 'Южный узел',
    labelEn: 'South Node',
  }),
});

const FALLBACK_MESSAGES = Object.freeze({
  missingProfile: 'Для расчета лунных узлов нужен профиль.',
  missingUtcDateTime: 'Для расчета лунных узлов нужен точный UTC-момент.',
  invalidUtcDateTime: 'UTC-момент для расчета лунных узлов некорректен.',
  missingExactBirthTime: 'Для расчета лунных узлов нужно точное время рождения.',
  missingTimezone: 'Для расчета лунных узлов нужен часовой пояс места рождения.',
  invalidBirthDateTime: 'Время рождения не удалось надежно перевести в UTC.',
  invalidLongitude: 'Долгота лунного узла недоступна.',
});

export function calculateMeanLunarNodeLongitude(input = {}) {
  const resolvedDate = resolveUtcDate(input);

  if (!resolvedDate.ready) {
    return nodeLongitudeNotReady(resolvedDate.reason);
  }

  return Object.freeze({
    status: 'ready',
    ready: true,
    longitude: calculateMeanNodeLongitudeForDate(resolvedDate.date),
    sourceSystem: SOURCE_SYSTEM,
    sourceKey: SOURCE_KEY,
    nodeType: NODE_TYPE,
    verificationStatus: VERIFICATION_STATUS,
  });
}

export function calculateLunarNodes(input = {}) {
  const northResult = calculateMeanLunarNodeLongitude(input);

  if (northResult.status !== 'ready') {
    return lunarNodesNotReady(northResult.reason);
  }

  const north = formatLunarNode('north-node', northResult.longitude, northResult);
  const south = deriveSouthNode(north);

  if (!north || !south) {
    return lunarNodesNotReady('invalidLongitude');
  }

  return Object.freeze({
    status: 'ready',
    ready: true,
    sourceSystem: SOURCE_SYSTEM,
    sourceKey: SOURCE_KEY,
    nodeType: NODE_TYPE,
    verificationStatus: VERIFICATION_STATUS,
    nodes: Object.freeze({
      north,
      south,
    }),
    limitations: getLunarNodesLimitations(),
  });
}

export function calculateLunarNodesForProfile(profile, options = {}) {
  if (!profile || typeof profile !== 'object') {
    return lunarNodesNotReady('missingProfile');
  }

  const birthInput = options.birthDateTimeInput ?? createBirthDateTimeInput(profile);

  if (!birthInput.hasKnownTime || birthInput.birthTimeAccuracy !== 'exact') {
    return lunarNodesNotReady('missingExactBirthTime');
  }

  if (!birthInput.timezone || birthInput.missingFields?.includes('birthPlace.timezone')) {
    return lunarNodesNotReady('missingTimezone');
  }

  if (!birthInput.canConvertToUtc || !birthInput.utcDateTime) {
    return lunarNodesNotReady('invalidBirthDateTime');
  }

  const result = calculateLunarNodes({ utcDateTime: birthInput.utcDateTime });

  if (result.status !== 'ready') {
    return result;
  }

  return Object.freeze({
    ...result,
    source: 'profile-birth-utc',
  });
}

export function deriveSouthNode(northNodeOrLongitude) {
  const longitude = typeof northNodeOrLongitude === 'number'
    ? northNodeOrLongitude
    : northNodeOrLongitude?.longitude;
  const southLongitude = normalizeDegrees(Number.isFinite(longitude) ? longitude + 180 : Number.NaN);

  if (southLongitude === null) {
    return typeof northNodeOrLongitude === 'number' ? null : null;
  }

  if (typeof northNodeOrLongitude === 'number') {
    return southLongitude;
  }

  return formatLunarNode('south-node', southLongitude, {
    sourceSystem: northNodeOrLongitude?.sourceSystem ?? SOURCE_SYSTEM,
    sourceKey: northNodeOrLongitude?.sourceKey ?? SOURCE_KEY,
    nodeType: northNodeOrLongitude?.nodeType ?? NODE_TYPE,
    verificationStatus: northNodeOrLongitude?.verificationStatus ?? VERIFICATION_STATUS,
    derivedFrom: northNodeOrLongitude?.key ?? 'north-node',
  });
}

export function formatLunarNode(key, longitude, metadata = {}) {
  const label = NODE_LABELS[key];
  const normalized = normalizeDegrees(longitude);
  const sign = getZodiacSign(normalized);
  const formatted = formatDegree(normalized, { precision: 'second', rounding: 'floor' });

  if (!label || normalized === null || !sign || !formatted.text) {
    return null;
  }

  const degreeText = String(formatted.degree).padStart(2, '0');
  const minutesText = String(formatted.minutes).padStart(2, '0');
  const secondsText = String(formatted.seconds).padStart(2, '0');

  return Object.freeze({
    key,
    label: label.label,
    labelEn: label.labelEn,
    longitude: normalized,
    sign: Object.freeze({
      key: sign.key,
      ru: sign.ru,
      symbol: sign.symbol,
    }),
    degree: formatted.degree,
    minutes: formatted.minutes,
    seconds: formatted.seconds,
    text: `${label.label} — ${sign.ru} ${degreeText}°${minutesText}′${secondsText}″`,
    sourceSystem: metadata.sourceSystem ?? SOURCE_SYSTEM,
    sourceKey: metadata.sourceKey ?? SOURCE_KEY,
    nodeType: metadata.nodeType ?? NODE_TYPE,
    verificationStatus: metadata.verificationStatus ?? VERIFICATION_STATUS,
    ...(metadata.derivedFrom ? { derivedFrom: metadata.derivedFrom } : {}),
  });
}

export function getLunarNodesSource() {
  return Object.freeze({
    sourceSystem: SOURCE_SYSTEM,
    sourceKey: SOURCE_KEY,
    nodeType: NODE_TYPE,
    trueNodeStatus: 'deferred',
    deferredSourceSystem: DEFERRED_NODE_SYSTEM,
    validation: VALIDATION_SOURCE,
    zodiac: 'tropical',
  });
}

export function getLunarNodesCapabilities() {
  return Object.freeze({
    lunarNodes: true,
    meanNode: true,
    trueNode: false,
    northNode: true,
    southNode: true,
    lilith: false,
    selena: false,
    houseAssignment: false,
    interpretations: false,
    transits: false,
    fixedStars: false,
  });
}

export function getLunarNodesLimitations() {
  return Object.freeze([
    'В Sprint 13 активен mean lunar node.',
    'True Node отложен до отдельной source policy.',
    'Южный узел рассчитывается как Северный узел + 180°.',
    'Этот модуль не рассчитывает Lilith или Selena.',
    'Интерпретации не добавлены.',
  ]);
}

function calculateMeanNodeLongitudeForDate(date) {
  const julianCenturies = (date.getTime() - J2000_UTC_MS) / MILLISECONDS_PER_DAY / JULIAN_DAYS_PER_CENTURY;
  const t2 = julianCenturies * julianCenturies;
  const t3 = t2 * julianCenturies;
  const t4 = t3 * julianCenturies;
  const longitude = 125.0445479
    - 1934.1362891 * julianCenturies
    + 0.0020754 * t2
    + t3 / 467441
    - t4 / 60616000;

  return normalizeDegrees(longitude);
}

function resolveUtcDate(input) {
  if (input?.date instanceof Date) {
    return Number.isNaN(input.date.getTime())
      ? { ready: false, reason: 'invalidUtcDateTime' }
      : { ready: true, date: new Date(input.date.getTime()) };
  }

  if (!input?.utcDateTime) {
    return { ready: false, reason: 'missingUtcDateTime' };
  }

  const date = new Date(input.utcDateTime);

  if (Number.isNaN(date.getTime())) {
    return { ready: false, reason: 'invalidUtcDateTime' };
  }

  return { ready: true, date };
}

function nodeLongitudeNotReady(reason) {
  return Object.freeze({
    status: 'notReady',
    ready: false,
    reason,
    message: FALLBACK_MESSAGES[reason] ?? FALLBACK_MESSAGES.invalidUtcDateTime,
    sourceSystem: SOURCE_SYSTEM,
    sourceKey: SOURCE_KEY,
  });
}

function lunarNodesNotReady(reason) {
  return Object.freeze({
    status: 'notReady',
    ready: false,
    reason,
    message: FALLBACK_MESSAGES[reason] ?? FALLBACK_MESSAGES.invalidBirthDateTime,
    sourceSystem: SOURCE_SYSTEM,
    sourceKey: SOURCE_KEY,
    nodes: Object.freeze({
      north: null,
      south: null,
    }),
    limitations: getLunarNodesLimitations(),
  });
}
