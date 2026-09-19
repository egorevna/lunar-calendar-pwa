import { getRequiredPlanetKeys } from './planetaryPositionProvider.js';

const PROVIDER = 'astronomy-engine';
const VERSION = '2.1.19';

const VALIDATION_DELTAS = Object.freeze({
  maxLongitudeDeltaPlanets: '0.003180°',
  maxLongitudeDeltaMoon: '0.000294°',
  maxSpeedDeltaPlanets: '0.000288°/day',
  maxSpeedDeltaMoon: '0.000148°/day',
});

// Features that still do not exist in the app (natal planets, houses, ASC/MC,
// aspects, dignities, lots, special points and fixed stars are live).
const STILL_NOT_SUPPORTED = Object.freeze([
  'personal transits',
  'natal chart wheel',
  'personal ritual scoring',
  'interpretations',
]);

export function getNatalProviderValidationSummary() {
  return {
    provider: PROVIDER,
    version: VERSION,
    providerStatus: 'connected (local, offline)',
    userFacingNatalValues: 'enabled',
    longitudeValidation: 'passed',
    speedValidation: 'passed',
    retrogradeValidation: 'passed',
    referenceSource: 'local swisseph dev dependency',
    fixturesCount: 6,
    validatedBodies: getRequiredPlanetKeys(),
    ...VALIDATION_DELTAS,
    stillNotSupported: [...STILL_NOT_SUPPORTED],
  };
}
