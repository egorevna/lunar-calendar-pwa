import { getRequiredPlanetKeys } from './planetaryPositionProvider.js';

const PROVIDER = 'astronomy-engine';
const VERSION = '2.1.19';

const VALIDATION_DELTAS = Object.freeze({
  maxLongitudeDeltaPlanets: '0.003180°',
  maxLongitudeDeltaMoon: '0.000294°',
  maxSpeedDeltaPlanets: '0.000288°/day',
  maxSpeedDeltaMoon: '0.000148°/day',
});

const STILL_NOT_SUPPORTED = Object.freeze([
  'houses',
  'ASC / MC',
  'personal transits',
  'natal aspects',
  'orbs',
  'natal chart UI',
  'personal ritual scoring',
]);

export function getNatalProviderValidationSummary() {
  return {
    provider: PROVIDER,
    version: VERSION,
    providerStatus: 'provider-layer only',
    userFacingNatalValues: 'disabled',
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
