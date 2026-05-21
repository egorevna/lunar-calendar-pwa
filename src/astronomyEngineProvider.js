import * as Astronomy from 'astronomy-engine';

import {
  getRequiredPlanetKeys,
  normalizePlanetaryPosition,
  validatePlanetaryProviderInput,
} from './planetaryPositionProvider.js';

export const ASTRONOMY_ENGINE_PACKAGE_NAME = 'astronomy-engine';
export const ASTRONOMY_ENGINE_VERSION = '2.1.19';
export const ASTRONOMY_ENGINE_PROVIDER_REASON =
  'Candidate positions calculated; selected UTC reference fixtures passed Swiss Ephemeris validation.';

const API_PATH_STATUS = 'identified-pending-reference-validation';
const FIXTURE_VALIDATION_STATUS = 'validated-selected-utc-reference-fixtures';
const REFERENCE_PROVIDER = 'swisseph';

const DISABLED_CAPABILITIES = Object.freeze({
  planets: false,
  retrograde: false,
  speed: false,
  tropical: false,
  sidereal: false,
  houses: false,
  ascMc: false,
  transits: false,
});

const READY_CAPABILITIES = Object.freeze({
  planets: true,
  retrograde: false,
  speed: false,
  tropical: true,
  sidereal: false,
  houses: false,
  ascMc: false,
  transits: false,
});

const REFERENCE_VALIDATION_FEATURES = Object.freeze({
  planets: true,
  houses: false,
  ascMc: false,
  transits: false,
  retrograde: false,
  speed: false,
});

const API_PATHS = Object.freeze({
  sun: 'SunPosition(date).elon',
  moon: 'EclipticGeoMoon(date).lon',
  planets: 'GeoVector(body, date, true) -> Ecliptic(vector).elon',
});

const ASTRONOMY_BODY_BY_PLANET_KEY = Object.freeze({
  mercury: Astronomy.Body.Mercury,
  venus: Astronomy.Body.Venus,
  mars: Astronomy.Body.Mars,
  jupiter: Astronomy.Body.Jupiter,
  saturn: Astronomy.Body.Saturn,
  uranus: Astronomy.Body.Uranus,
  neptune: Astronomy.Body.Neptune,
  pluto: Astronomy.Body.Pluto,
});

const PLANET_LABELS = Object.freeze({
  sun: 'Солнце',
  moon: 'Луна',
  mercury: 'Меркурий',
  venus: 'Венера',
  mars: 'Марс',
  jupiter: 'Юпитер',
  saturn: 'Сатурн',
  uranus: 'Уран',
  neptune: 'Нептун',
  pluto: 'Плутон',
});

export function getAstronomyEngineProviderInfo() {
  return {
    provider: ASTRONOMY_ENGINE_PACKAGE_NAME,
    packageName: ASTRONOMY_ENGINE_PACKAGE_NAME,
    version: ASTRONOMY_ENGINE_VERSION,
    browserCompatible: hasRequiredRuntimeApi(),
    backendRequired: false,
    cloudRequired: false,
    localOnly: true,
    apiPathStatus: API_PATH_STATUS,
    fixtureValidation: FIXTURE_VALIDATION_STATUS,
    referenceProvider: REFERENCE_PROVIDER,
    referenceValidationFeatures: { ...REFERENCE_VALIDATION_FEATURES },
    apiPaths: { ...API_PATHS },
    notes: [
      'Provider package is installed for local-only planet position calculation.',
      'Selected UTC fixtures passed Swiss Ephemeris longitude validation for natal planet positions.',
      'No user-facing natal values should be enabled until UI scope is explicitly approved.',
    ],
  };
}

export function getAstronomyEngineProviderCapabilities() {
  return {
    provider: ASTRONOMY_ENGINE_PACKAGE_NAME,
    version: ASTRONOMY_ENGINE_VERSION,
    status: 'ready',
    ...READY_CAPABILITIES,
    apiPathStatus: API_PATH_STATUS,
    fixtureValidation: FIXTURE_VALIDATION_STATUS,
    referenceProvider: REFERENCE_PROVIDER,
    referenceValidationFeatures: { ...REFERENCE_VALIDATION_FEATURES },
    supportedBodies: getRequiredPlanetKeys(),
    reason: ASTRONOMY_ENGINE_PROVIDER_REASON,
  };
}

export async function auditAstronomyEngineProviderSource(options = {}) {
  if (!isNodeRuntime()) {
    return {
      ok: false,
      packageName: ASTRONOMY_ENGINE_PACKAGE_NAME,
      reason: 'Source audit requires a Node.js test environment.',
      networkBehaviorFound: false,
      networkApiMatches: [],
      executableRemoteUrlMatches: [],
      remoteUrlReferences: [],
    };
  }

  const { readFile, readdir } = await import('node:fs/promises');
  const { dirname, join } = await import('node:path');
  const { fileURLToPath } = await import('node:url');
  const moduleDir = dirname(fileURLToPath(import.meta.url));
  const packageDir = options.packageDir ?? join(moduleDir, '..', 'node_modules', ASTRONOMY_ENGINE_PACKAGE_NAME);
  const files = await collectAuditableFiles(packageDir, { readdir, join });
  const networkApiMatches = [];
  const executableRemoteUrlMatches = [];
  const remoteUrlReferences = [];

  for (const file of files) {
    const text = await readFile(file, 'utf8');
    const lines = text.split(/\r?\n/);

    lines.forEach((line, index) => {
      if (/\b(fetch|XMLHttpRequest|WebSocket)\b/.test(line)) {
        networkApiMatches.push(formatMatch(file, packageDir, index, line));
      }

      if (/https?:\/\//.test(line)) {
        const match = formatMatch(file, packageDir, index, line);

        if (isExecutableRemoteUrlLine(file, line)) {
          executableRemoteUrlMatches.push(match);
        } else {
          remoteUrlReferences.push(match);
        }
      }
    });
  }

  return {
    ok: true,
    packageName: ASTRONOMY_ENGINE_PACKAGE_NAME,
    filesChecked: files.length,
    networkBehaviorFound: networkApiMatches.length > 0 || executableRemoteUrlMatches.length > 0,
    networkApiMatches,
    executableRemoteUrlMatches,
    remoteUrlReferences,
  };
}

export function calculateAstronomyEnginePlanetPositions(input = {}) {
  const validation = validatePlanetaryProviderInput(input);

  if (!validation.ok) {
    return providerResult({
      status: 'incomplete',
      reason: 'Astronomy Engine provider input is incomplete.',
      errors: validation.errors,
    });
  }

  try {
    const date = new Date(validation.utcDateTime);
    const planets = validation.bodies
      .map((key) => calculatePlanetPosition(key, date))
      .filter(Boolean);

    if (planets.length !== validation.bodies.length) {
      return providerResult({
        status: 'error',
        reason: 'Astronomy Engine could not calculate all requested planet positions.',
        errors: ['planet position calculation failed'],
      });
    }

    return providerResult({
      status: 'ready',
      reason: ASTRONOMY_ENGINE_PROVIDER_REASON,
      planets,
      capabilities: { ...READY_CAPABILITIES },
    });
  } catch {
    return providerResult({
      status: 'error',
      reason: 'Astronomy Engine planet position calculation failed.',
      errors: ['planet position calculation failed'],
    });
  }
}

function calculatePlanetPosition(key, date) {
  const longitude = calculateGeocentricTropicalLongitude(key, date);
  const position = normalizePlanetaryPosition({
    key,
    label: PLANET_LABELS[key],
    longitude,
    retrograde: null,
    speed: null,
    source: ASTRONOMY_ENGINE_PACKAGE_NAME,
  });

  if (!position) {
    return null;
  }

  return {
    ...position,
    retrograde: null,
    speed: null,
  };
}

function calculateGeocentricTropicalLongitude(key, date) {
  if (key === 'sun') {
    return Astronomy.SunPosition(date).elon;
  }

  if (key === 'moon') {
    return Astronomy.EclipticGeoMoon(date).lon;
  }

  const body = ASTRONOMY_BODY_BY_PLANET_KEY[key];

  if (!body) {
    return null;
  }

  return Astronomy.Ecliptic(Astronomy.GeoVector(body, date, true)).elon;
}

function providerResult(overrides = {}) {
  return {
    status: overrides.status ?? 'notSupported',
    provider: ASTRONOMY_ENGINE_PACKAGE_NAME,
    version: ASTRONOMY_ENGINE_VERSION,
    reason: overrides.reason ?? '',
    planets: overrides.planets ?? [],
    houses: [],
    points: [],
    transits: [],
    capabilities: overrides.capabilities ?? { ...DISABLED_CAPABILITIES },
    metadata: {
      calculatedAt: null,
      input: null,
      apiPathStatus: API_PATH_STATUS,
      fixtureValidation: FIXTURE_VALIDATION_STATUS,
      referenceProvider: REFERENCE_PROVIDER,
      referenceValidationFeatures: { ...REFERENCE_VALIDATION_FEATURES },
    },
    errors: overrides.errors ?? [],
  };
}

async function collectAuditableFiles(rootDir, fsTools) {
  const entries = await fsTools.readdir(rootDir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = fsTools.join(rootDir, entry.name);

    if (entry.isDirectory()) {
      files.push(...await collectAuditableFiles(entryPath, fsTools));
      continue;
    }

    if (isAuditableFile(entry.name)) {
      files.push(entryPath);
    }
  }

  return files;
}

function isAuditableFile(fileName) {
  return /\.(js|mjs|cjs|ts|d\.ts|json|md)$/.test(fileName);
}

function formatMatch(file, rootDir, index, line) {
  return {
    file: file.replace(`${rootDir}/`, ''),
    line: index + 1,
    text: line.trim(),
  };
}

function isExecutableRemoteUrlLine(file, line) {
  const trimmed = line.trim();

  if (file.endsWith('.md') || file.endsWith('.d.ts') || file.endsWith('package.json')) {
    return false;
  }

  if (
    trimmed.startsWith('//')
    || trimmed.startsWith('*')
    || trimmed.startsWith('/*')
    || trimmed.startsWith('*/')
    || trimmed.startsWith('http://')
    || trimmed.startsWith('https://')
  ) {
    return false;
  }

  return /https?:\/\//.test(trimmed);
}

function hasRequiredRuntimeApi() {
  return Boolean(
    Astronomy.Body
      && typeof Astronomy.SunPosition === 'function'
      && typeof Astronomy.EclipticGeoMoon === 'function'
      && typeof Astronomy.GeoVector === 'function'
      && typeof Astronomy.Ecliptic === 'function',
  );
}

function isNodeRuntime() {
  return Boolean(globalThis.process?.versions?.node);
}
