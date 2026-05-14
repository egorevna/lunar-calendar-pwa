import {
  getDegreeInSign,
  getZodiacSign,
  normalizeDegrees,
} from './astroMath.js';

export const PLANETARY_PROVIDER_STATUS = Object.freeze({
  READY: 'ready',
  INCOMPLETE: 'incomplete',
  NOT_SUPPORTED: 'notSupported',
  ERROR: 'error',
});

export const NATAL_PLANET_KEYS = Object.freeze([
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

export const PLANETARY_PROVIDER_NOT_CONNECTED_REASON =
  'Planetary position provider is not connected.';

const DEFAULT_CAPABILITIES = Object.freeze({
  planets: false,
  retrograde: false,
  speed: false,
  tropical: false,
  sidereal: false,
});

const DEFAULT_METADATA = Object.freeze({
  calculatedAt: null,
  input: null,
});

export function getPlanetaryProviderCapabilities() {
  return {
    provider: null,
    status: PLANETARY_PROVIDER_STATUS.NOT_SUPPORTED,
    planets: false,
    retrograde: false,
    speed: false,
    tropical: false,
    sidereal: false,
    reason: PLANETARY_PROVIDER_NOT_CONNECTED_REASON,
  };
}

export function createPlanetaryProviderNotSupportedResult(
  reason = PLANETARY_PROVIDER_NOT_CONNECTED_REASON,
) {
  return providerResult({
    status: PLANETARY_PROVIDER_STATUS.NOT_SUPPORTED,
    reason,
  });
}

export function validatePlanetaryProviderInput(input) {
  const source = isPlainObject(input) ? input : {};
  const errors = [];
  const utcDateTime = normalizeUtcDateTime(source.utcDateTime);
  const zodiac = trimString(source.zodiac);
  const bodies = normalizeBodies(source.bodies);

  if (!utcDateTime) {
    errors.push('utcDateTime is required');
  }

  if (zodiac !== 'tropical') {
    errors.push('zodiac must be tropical');
  }

  for (const body of bodies) {
    if (!NATAL_PLANET_KEYS.includes(body)) {
      errors.push(`unsupported body: ${body}`);
    }
  }

  return {
    ok: errors.length === 0,
    errors: unique(errors),
    utcDateTime,
    zodiac,
    bodies,
  };
}

export function getPlanetaryPositions(input) {
  const validation = validatePlanetaryProviderInput(input);

  if (!validation.ok) {
    return providerResult({
      status: PLANETARY_PROVIDER_STATUS.INCOMPLETE,
      reason: 'Planetary provider input is incomplete.',
      errors: validation.errors,
      metadata: {
        calculatedAt: null,
        input: null,
      },
    });
  }

  return createPlanetaryProviderNotSupportedResult(PLANETARY_PROVIDER_NOT_CONNECTED_REASON);
}

export function normalizePlanetaryPosition(input) {
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

  const degree = Math.floor(degreeInSign);

  return {
    key: trimString(source.key),
    label: trimString(source.label) || trimString(source.key),
    longitude,
    sign,
    degree,
    minutes: Math.floor((degreeInSign - degree) * 60),
    retrograde: typeof source.retrograde === 'boolean' ? source.retrograde : false,
    speed: Number.isFinite(source.speed) ? source.speed : null,
    source: trimString(source.source) || null,
  };
}

export function getRequiredPlanetKeys() {
  return [...NATAL_PLANET_KEYS];
}

function providerResult(overrides = {}) {
  return {
    status: overrides.status ?? PLANETARY_PROVIDER_STATUS.NOT_SUPPORTED,
    provider: null,
    reason: overrides.reason ?? '',
    planets: overrides.planets ?? [],
    capabilities: overrides.capabilities ?? { ...DEFAULT_CAPABILITIES },
    metadata: overrides.metadata ?? { ...DEFAULT_METADATA },
    errors: overrides.errors ?? [],
  };
}

function normalizeUtcDateTime(value) {
  if (value instanceof Date && Number.isFinite(value.getTime())) {
    return value.toISOString();
  }

  const normalized = trimString(value);

  if (!normalized) {
    return null;
  }

  const date = new Date(normalized);

  if (!Number.isFinite(date.getTime())) {
    return null;
  }

  return date.toISOString();
}

function normalizeBodies(value) {
  if (!Array.isArray(value)) {
    return getRequiredPlanetKeys();
  }

  return value.map(trimString).filter(Boolean);
}

function isPlainObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value);
}

function trimString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function unique(items) {
  return [...new Set(items.filter(Boolean))];
}
