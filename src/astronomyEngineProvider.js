import * as Astronomy from 'astronomy-engine';

import {
  getRequiredPlanetKeys,
  validatePlanetaryProviderInput,
} from './planetaryPositionProvider.js';

export const ASTRONOMY_ENGINE_PACKAGE_NAME = 'astronomy-engine';
export const ASTRONOMY_ENGINE_VERSION = '2.1.19';
export const ASTRONOMY_ENGINE_PROVIDER_REASON =
  'Astronomy Engine geocentric tropical longitude path is not fixture-validated.';

const API_PATH_STATUS = 'identified-not-fixture-validated';

const DEFAULT_CAPABILITIES = Object.freeze({
  planets: false,
  retrograde: false,
  speed: false,
  tropical: false,
  sidereal: false,
  houses: false,
  ascMc: false,
  transits: false,
});

const API_PATHS = Object.freeze({
  sun: 'SunPosition(date).elon',
  moon: 'EclipticGeoMoon(date).lon',
  planets: 'GeoVector(body, date, true) -> Ecliptic(vector).elon',
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
    apiPaths: { ...API_PATHS },
    notes: [
      'Provider package is installed for a local-only spike.',
      'Geocentric tropical longitude path is identified but not fixture-validated.',
      'No user-facing natal values should be enabled from this module yet.',
    ],
  };
}

export function getAstronomyEngineProviderCapabilities() {
  return {
    provider: ASTRONOMY_ENGINE_PACKAGE_NAME,
    version: ASTRONOMY_ENGINE_VERSION,
    status: 'notSupported',
    ...DEFAULT_CAPABILITIES,
    apiPathStatus: API_PATH_STATUS,
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

  return providerResult({
    status: 'notSupported',
    reason: ASTRONOMY_ENGINE_PROVIDER_REASON,
  });
}

function providerResult(overrides = {}) {
  return {
    status: overrides.status ?? 'notSupported',
    provider: ASTRONOMY_ENGINE_PACKAGE_NAME,
    version: ASTRONOMY_ENGINE_VERSION,
    reason: overrides.reason ?? '',
    planets: [],
    houses: [],
    points: [],
    transits: [],
    capabilities: { ...DEFAULT_CAPABILITIES },
    metadata: {
      calculatedAt: null,
      input: null,
      apiPathStatus: API_PATH_STATUS,
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
