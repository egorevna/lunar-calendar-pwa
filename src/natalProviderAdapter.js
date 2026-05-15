import {
  normalizePlanetaryPosition,
  validatePlanetaryProviderInput,
} from './planetaryPositionProvider.js';

export const NATAL_PROVIDER_ADAPTER_STATUS = Object.freeze({
  READY: 'ready',
  INCOMPLETE: 'incomplete',
  NOT_SUPPORTED: 'notSupported',
  ERROR: 'error',
});

export const DEFAULT_NATAL_PROVIDER_ADAPTER_REASON =
  'Real natal provider is not approved or connected.';

const DEFAULT_CAPABILITIES = Object.freeze({
  planets: false,
  moon: false,
  retrograde: false,
  speed: false,
  houses: false,
  ascMc: false,
  tropical: false,
  sidereal: false,
});

export function createNotSupportedNatalProviderAdapter(
  reason = DEFAULT_NATAL_PROVIDER_ADAPTER_REASON,
) {
  return {
    name: null,
    version: null,
    status: NATAL_PROVIDER_ADAPTER_STATUS.NOT_SUPPORTED,
    capabilities: { ...DEFAULT_CAPABILITIES },
    reason,
    calculatePlanets: null,
    calculateHouses: null,
  };
}

export function getDefaultNatalProviderAdapter() {
  return createNotSupportedNatalProviderAdapter();
}

export function getNatalProviderAdapterCapabilities(adapter = getDefaultNatalProviderAdapter()) {
  const source = isPlainObject(adapter) ? adapter : getDefaultNatalProviderAdapter();
  const capabilities = normalizeCapabilities(source.capabilities);

  return {
    provider: trimString(source.name) || null,
    status: normalizeStatus(source.status),
    ...capabilities,
    reason: trimString(source.reason),
  };
}

export function validateNatalProviderAdapter(adapter) {
  const errors = [];

  if (!isPlainObject(adapter)) {
    return {
      ok: false,
      errors: ['adapter object is required'],
    };
  }

  const status = normalizeStatus(adapter.status);
  const capabilities = isPlainObject(adapter.capabilities)
    ? normalizeCapabilities(adapter.capabilities)
    : null;

  if (!status) {
    errors.push('status is required');
  }

  if (!capabilities) {
    errors.push('capabilities are required');
  }

  if (status === NATAL_PROVIDER_ADAPTER_STATUS.READY && capabilities) {
    if (capabilities.planets && typeof adapter.calculatePlanets !== 'function') {
      errors.push('calculatePlanets function is required when planets capability is true');
    }

    if (capabilities.moon && !capabilities.planets) {
      errors.push('moon capability requires planets capability');
    }

    if (capabilities.houses && typeof adapter.calculateHouses !== 'function') {
      errors.push('calculateHouses function is required when houses capability is true');
    }
  }

  return {
    ok: errors.length === 0,
    errors: unique(errors),
  };
}

export function runNatalProviderAdapter(adapter = getDefaultNatalProviderAdapter(), input = {}) {
  const validation = validatePlanetaryProviderInput(input);

  if (!validation.ok) {
    return adapterResult({
      status: NATAL_PROVIDER_ADAPTER_STATUS.INCOMPLETE,
      provider: adapter?.name ?? null,
      reason: 'Natal provider input is incomplete.',
      errors: validation.errors,
    });
  }

  const contract = validateNatalProviderAdapter(adapter);

  if (!contract.ok) {
    return adapterResult({
      status: NATAL_PROVIDER_ADAPTER_STATUS.ERROR,
      provider: adapter?.name ?? null,
      reason: 'Natal provider adapter contract is invalid.',
      errors: contract.errors,
    });
  }

  if (adapter.status !== NATAL_PROVIDER_ADAPTER_STATUS.READY) {
    return adapterResult({
      status: NATAL_PROVIDER_ADAPTER_STATUS.NOT_SUPPORTED,
      provider: null,
      reason: trimString(adapter.reason) || DEFAULT_NATAL_PROVIDER_ADAPTER_REASON,
      capabilities: normalizeCapabilities(adapter.capabilities),
    });
  }

  const planetResult = adapter.capabilities?.planets && typeof adapter.calculatePlanets === 'function'
    ? adapter.calculatePlanets(input)
    : {};
  const planets = normalizePlanetList(planetResult?.planets);
  const houses = normalizePlainItems(planetResult?.houses);
  const points = normalizePlainItems(planetResult?.points);
  const transits = normalizePlainItems(planetResult?.transits);

  return adapterResult({
    status: NATAL_PROVIDER_ADAPTER_STATUS.READY,
    provider: trimString(adapter.name) || null,
    reason: trimString(planetResult?.reason),
    planets,
    houses,
    points,
    transits,
    capabilities: {
      planets: planets.length > 0,
      moon: planets.some((planet) => planet.key === 'moon'),
      retrograde: Boolean(adapter.capabilities?.retrograde && planets.some((planet) => planet.retrograde)),
      speed: Boolean(adapter.capabilities?.speed && planets.some((planet) => planet.speed !== null)),
      houses: houses.length > 0,
      ascMc: points.some(isAscMcPoint),
      transits: transits.length > 0,
      tropical: Boolean(adapter.capabilities?.tropical),
      sidereal: Boolean(adapter.capabilities?.sidereal),
    },
    metadata: {
      calculatedAt: trimString(planetResult?.metadata?.calculatedAt) || null,
      input: null,
    },
  });
}

function adapterResult(overrides = {}) {
  return {
    status: overrides.status ?? NATAL_PROVIDER_ADAPTER_STATUS.NOT_SUPPORTED,
    provider: overrides.provider ?? null,
    reason: overrides.reason ?? '',
    planets: overrides.planets ?? [],
    houses: overrides.houses ?? [],
    points: overrides.points ?? [],
    transits: overrides.transits ?? [],
    capabilities: overrides.capabilities ?? { ...DEFAULT_CAPABILITIES },
    metadata: overrides.metadata ?? {
      calculatedAt: null,
      input: null,
    },
    errors: overrides.errors ?? [],
  };
}

function normalizePlanetList(planets) {
  return Array.isArray(planets)
    ? planets.map(normalizePlanetaryPosition).filter(Boolean)
    : [];
}

function normalizePlainItems(items) {
  return Array.isArray(items)
    ? items.filter(isPlainObject).map((item) => ({ ...item }))
    : [];
}

function normalizeCapabilities(capabilities) {
  const source = isPlainObject(capabilities) ? capabilities : {};

  return {
    planets: Boolean(source.planets),
    moon: Boolean(source.moon),
    retrograde: Boolean(source.retrograde),
    speed: Boolean(source.speed),
    houses: Boolean(source.houses),
    ascMc: Boolean(source.ascMc),
    tropical: Boolean(source.tropical),
    sidereal: Boolean(source.sidereal),
  };
}

function normalizeStatus(status) {
  return Object.values(NATAL_PROVIDER_ADAPTER_STATUS).includes(status) ? status : null;
}

function isAscMcPoint(point) {
  return ['asc', 'mc'].includes(trimString(point?.key).toLowerCase());
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
