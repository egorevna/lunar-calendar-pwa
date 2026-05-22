import { calculateAstronomyEnginePlanetPositions } from './astronomyEngineProvider.js';
import { createBirthDateTimeInput } from './birthDateTime.js';
import { formatNatalPlanetList } from './natalPlanetDisplay.js';

export const NATAL_PLANETS_PROFILE_LIMITATION =
  'Дома, ASC/MC и транзиты пока не рассчитываются.';

const READY_STATUS = 'ready';
const INCOMPLETE_STATUS = 'incomplete';
const ERROR_STATUS = 'error';

export function getNatalPlanetsForProfile(profile = null) {
  if (!profile) {
    return profilePlanetsResult({ status: INCOMPLETE_STATUS });
  }

  const birthInput = createBirthDateTimeInput(profile);

  if (!birthInput.canConvertToUtc || !birthInput.utcDateTime) {
    return profilePlanetsResult({
      status: INCOMPLETE_STATUS,
      missingFields: incompleteMissingFields(birthInput),
      warnings: birthInput.warnings,
      limitations: [NATAL_PLANETS_PROFILE_LIMITATION],
      errors: birthInput.errors,
    });
  }

  const providerResult = calculateAstronomyEnginePlanetPositions({
    utcDateTime: birthInput.utcDateTime,
    zodiac: 'tropical',
  });

  if (providerResult.status !== READY_STATUS) {
    return profilePlanetsResult({
      status: providerResult.status || ERROR_STATUS,
      warnings: providerResult.reason ? [providerResult.reason] : [],
      limitations: [NATAL_PLANETS_PROFILE_LIMITATION],
      errors: providerResult.errors,
      source: providerResult.provider,
    });
  }

  const formattedPlanets = formatNatalPlanetList(providerResult.planets);

  if (formattedPlanets.length !== providerResult.planets.length || formattedPlanets.length === 0) {
    return profilePlanetsResult({
      status: ERROR_STATUS,
      warnings: ['Натальные планеты пока недоступны для показа.'],
      limitations: [NATAL_PLANETS_PROFILE_LIMITATION],
      source: providerResult.provider,
    });
  }

  return profilePlanetsResult({
    status: READY_STATUS,
    planets: providerResult.planets,
    formattedPlanets,
    limitations: [NATAL_PLANETS_PROFILE_LIMITATION],
    source: providerResult.provider,
  });
}

function profilePlanetsResult(overrides = {}) {
  return {
    status: overrides.status ?? INCOMPLETE_STATUS,
    planets: overrides.planets ?? [],
    formattedPlanets: overrides.formattedPlanets ?? [],
    missingFields: overrides.missingFields ?? [],
    warnings: overrides.warnings ?? [],
    limitations: overrides.limitations ?? [NATAL_PLANETS_PROFILE_LIMITATION],
    source: overrides.source ?? null,
    errors: overrides.errors ?? [],
  };
}

function incompleteMissingFields(birthInput) {
  const fields = Array.isArray(birthInput?.missingFields) ? birthInput.missingFields : [];

  return unique([
    ...fields,
    birthInput?.hasKnownTime === false ? 'birthTime' : '',
  ]);
}

function unique(items) {
  return [...new Set(items.filter(Boolean))];
}
