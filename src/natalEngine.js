import {
  createNatalChartEmptyResult,
  createNatalChartIncompleteResult,
} from './natalChartModel.js';

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

export function calculateNatalChart(input) {
  const missingFields = getInputMissingFields(input);

  if (missingFields.length > 0) {
    return createNatalChartIncompleteResult('Natal calculation input is incomplete.', missingFields);
  }

  return createNatalChartEmptyResult(NATAL_PROVIDER_NOT_CONNECTED_REASON);
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
