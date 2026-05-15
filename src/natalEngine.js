import {
  createNatalChartEmptyResult,
  createNatalChartIncompleteResult,
  createNatalChartReadyResult,
} from './natalChartModel.js';
import {
  getPlanetaryPositions as getDefaultPlanetaryPositions,
  getRequiredPlanetKeys,
  PLANETARY_PROVIDER_STATUS,
} from './planetaryPositionProvider.js';

export const NATAL_PROVIDER_NOT_CONNECTED_REASON = 'Natal calculation provider is not connected.';

export function getNatalEngineCapabilities() {
  return {
    provider: null,
    planets: false,
    houses: false,
    ascMc: false,
    aspects: false,
    transits: false,
    reason: NATAL_PROVIDER_NOT_CONNECTED_REASON,
  };
}

export function calculateNatalChart(input, options = {}) {
  const missingFields = getInputMissingFields(input);

  if (missingFields.length > 0) {
    return createNatalChartIncompleteResult('Natal calculation input is incomplete.', missingFields);
  }

  const getPlanetaryPositions = typeof options.getPlanetaryPositions === 'function'
    ? options.getPlanetaryPositions
    : getDefaultPlanetaryPositions;
  const planetaryResult = getPlanetaryPositions(createPlanetaryProviderInput(input));

  if (planetaryResult?.status === PLANETARY_PROVIDER_STATUS.READY) {
    return createNatalChartReadyResult({
      planets: planetaryResult.planets,
      metadata: {
        provider: planetaryResult.provider,
        calculatedAt: planetaryResult.metadata?.calculatedAt,
        zodiac: input.zodiac,
        houseSystem: input.houseSystem,
      },
    });
  }

  if (planetaryResult?.status === PLANETARY_PROVIDER_STATUS.INCOMPLETE) {
    return createNatalChartIncompleteResult(
      planetaryResult.reason || 'Planetary provider input is incomplete.',
      planetaryResult.errors,
    );
  }

  return createNatalChartEmptyResult(
    planetaryResult?.reason || NATAL_PROVIDER_NOT_CONNECTED_REASON,
  );
}

export function explainNatalEngineLimitations() {
  return [
    'Натальный расчетный провайдер пока не подключен.',
    'Планеты натала пока не рассчитываются.',
    'Дома, ASC/MC и транзиты пока недоступны.',
  ];
}

export function assertNatalProviderSupported() {
  return {
    ok: false,
    reason: NATAL_PROVIDER_NOT_CONNECTED_REASON,
  };
}

function getInputMissingFields(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return ['profile'];
  }

  const missingFields = Array.isArray(input.missingFields)
    ? input.missingFields.filter((field) => typeof field === 'string' && field.trim())
    : [];

  if (input.isProfileSelected === false) {
    missingFields.push('profile');
  }

  return [...new Set(missingFields)];
}

function createPlanetaryProviderInput(input) {
  return {
    utcDateTime: input.utcDateTime,
    zodiac: input.zodiac,
    bodies: Array.isArray(input.bodies) ? input.bodies : getRequiredPlanetKeys(),
  };
}
