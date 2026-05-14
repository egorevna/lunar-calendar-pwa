import {
  getDegreeInSign,
  getZodiacSign,
  normalizeDegrees,
} from './astroMath.js';

export const NATAL_ENGINE_STATUS = Object.freeze({
  READY: 'ready',
  INCOMPLETE: 'incomplete',
  NOT_SUPPORTED: 'notSupported',
  ERROR: 'error',
});

export const NATAL_FEATURES = Object.freeze({
  PLANETS: 'planets',
  HOUSES: 'houses',
  ASC_MC: 'ascMc',
  ASPECTS: 'aspects',
  TRANSITS: 'transits',
});

const DEFAULT_CAPABILITIES = Object.freeze({
  planets: false,
  houses: false,
  ascMc: false,
  aspects: false,
  transits: false,
});

const DEFAULT_METADATA = Object.freeze({
  provider: null,
  calculatedAt: null,
  zodiac: null,
  houseSystem: null,
});

export function createNatalChartEmptyResult(reason = '') {
  return baseResult({
    status: NATAL_ENGINE_STATUS.NOT_SUPPORTED,
    reason,
  });
}

export function createNatalChartIncompleteResult(reason = '', missingFields = []) {
  return baseResult({
    status: NATAL_ENGINE_STATUS.INCOMPLETE,
    reason,
    missingFields: uniqueStrings(missingFields),
  });
}

export function createNatalChartReadyResult(data = {}) {
  const source = isPlainObject(data) ? data : {};
  const planets = normalizeArray(source.planets, normalizeNatalPlanet);
  const points = normalizeArray(source.points, normalizeNatalPoint);
  const aspects = normalizeArray(source.aspects, normalizeNatalAspect);
  const houses = normalizePlainItems(source.houses);
  const transits = normalizePlainItems(source.transits);

  return baseResult({
    status: NATAL_ENGINE_STATUS.READY,
    reason: trimString(source.reason),
    planets,
    points,
    houses,
    aspects,
    transits,
    capabilities: {
      planets: planets.length > 0,
      houses: houses.length > 0,
      ascMc: points.some(isAscMcPoint),
      aspects: aspects.length > 0,
      transits: transits.length > 0,
    },
    metadata: normalizeMetadata(source.metadata),
  });
}

export function normalizeNatalPlanet(input) {
  const source = isPlainObject(input) ? input : {};
  const longitude = normalizeDegrees(source.longitude);

  if (longitude === null) {
    return null;
  }

  const sign = getZodiacSign(longitude);
  const degreeInSign = getDegreeInSign(longitude);

  if (!sign || degreeInSign === null) {
    return null;
  }

  return {
    key: trimString(source.key),
    label: trimString(source.label) || trimString(source.key),
    longitude,
    sign,
    degree: Math.floor(degreeInSign),
    minutes: Math.floor((degreeInSign - Math.floor(degreeInSign)) * 60),
    retrograde: typeof source.retrograde === 'boolean' ? source.retrograde : false,
    house: Number.isFinite(source.house) ? source.house : null,
    source: trimString(source.source) || null,
  };
}

export function normalizeNatalPoint(input) {
  const source = isPlainObject(input) ? input : {};
  const longitude = normalizeDegrees(source.longitude);

  if (longitude === null) {
    return null;
  }

  const sign = getZodiacSign(longitude);
  const degreeInSign = getDegreeInSign(longitude);

  if (!sign || degreeInSign === null) {
    return null;
  }

  return {
    key: trimString(source.key),
    label: trimString(source.label) || trimString(source.key),
    longitude,
    sign,
    degree: Math.floor(degreeInSign),
    minutes: Math.floor((degreeInSign - Math.floor(degreeInSign)) * 60),
    source: trimString(source.source) || null,
  };
}

export function normalizeNatalAspect(input) {
  const source = isPlainObject(input) ? input : {};
  const bodyA = trimString(source.bodyA);
  const bodyB = trimString(source.bodyB);
  const aspect = trimString(source.aspect);

  if (!bodyA || !bodyB || !aspect || !Number.isFinite(source.orb) || !Number.isFinite(source.exactAngle)) {
    return null;
  }

  return {
    bodyA,
    bodyB,
    aspect,
    orb: Math.abs(source.orb),
    exactAngle: source.exactAngle,
    applying: typeof source.applying === 'boolean' ? source.applying : null,
    source: trimString(source.source) || null,
  };
}

export function hasNatalFeature(result, feature) {
  if (!result?.capabilities || !Object.values(NATAL_FEATURES).includes(feature)) {
    return false;
  }

  return Boolean(result.capabilities[feature]);
}

function baseResult(overrides = {}) {
  return {
    status: overrides.status ?? NATAL_ENGINE_STATUS.NOT_SUPPORTED,
    reason: overrides.reason ?? '',
    missingFields: overrides.missingFields ?? [],
    planets: overrides.planets ?? [],
    points: overrides.points ?? [],
    houses: overrides.houses ?? [],
    aspects: overrides.aspects ?? [],
    transits: overrides.transits ?? [],
    capabilities: overrides.capabilities ?? { ...DEFAULT_CAPABILITIES },
    metadata: overrides.metadata ?? { ...DEFAULT_METADATA },
  };
}

function normalizeMetadata(metadata) {
  const source = isPlainObject(metadata) ? metadata : {};

  return {
    provider: trimString(source.provider) || null,
    calculatedAt: trimString(source.calculatedAt) || null,
    zodiac: trimString(source.zodiac) || null,
    houseSystem: trimString(source.houseSystem) || null,
  };
}

function normalizeArray(items, normalizer) {
  return Array.isArray(items) ? items.map(normalizer).filter(Boolean) : [];
}

function normalizePlainItems(items) {
  return Array.isArray(items)
    ? items.filter(isPlainObject).map((item) => ({ ...item }))
    : [];
}

function isAscMcPoint(point) {
  return ['asc', 'mc'].includes(trimString(point?.key).toLowerCase());
}

function uniqueStrings(items) {
  return [...new Set((Array.isArray(items) ? items : []).map(trimString).filter(Boolean))];
}

function isPlainObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value);
}

function trimString(value) {
  return typeof value === 'string' ? value.trim() : '';
}
