import { evaluateEssentialDignities } from './essentialDignities.js';
import {
  formatEssentialDignityList,
  getEssentialDignityDisplayLimitations,
  summarizeEssentialDignities,
} from './essentialDignityDisplay.js';
import { getNatalPlanetsForProfile } from './natalPlanetsForProfile.js';

const ESSENTIAL_DIGNITIES_SOURCE = 'essential-dignities-v1';
const ESSENTIAL_DIGNITIES_PLANETS_REQUIRED_WARNING = 'Сначала нужен расчет натальных планет.';

export function getEssentialDignitiesForProfile(profile = null) {
  const natalPlanets = getNatalPlanetsForProfile(profile);

  if (natalPlanets.status !== 'ready' || natalPlanets.planets.length === 0) {
    return profileDignitiesResult({
      status: natalPlanets.status === 'notSupported' ? 'notSupported' : 'incomplete',
      missingFields: safeStringList(natalPlanets.missingFields),
      warnings: unique([
        ...safeStringList(natalPlanets.warnings),
        ESSENTIAL_DIGNITIES_PLANETS_REQUIRED_WARNING,
      ]),
      errors: safeStringList(natalPlanets.errors),
    });
  }

  const results = evaluateEssentialDignities(natalPlanets.planets);
  const formattedDignities = formatEssentialDignityList(results)
    .filter((item) => item.type !== 'neutral');

  return profileDignitiesResult({
    status: 'ready',
    results: results.map(toSafeDignityResult),
    formattedDignities,
    summary: summarizeEssentialDignities(results),
    limitations: getEssentialDignityDisplayLimitations(),
  });
}

function profileDignitiesResult(overrides = {}) {
  return {
    status: overrides.status ?? 'incomplete',
    results: overrides.results ?? [],
    formattedDignities: overrides.formattedDignities ?? [],
    summary: overrides.summary ?? summarizeEssentialDignities([]),
    missingFields: overrides.missingFields ?? [],
    warnings: overrides.warnings ?? [],
    limitations: overrides.limitations ?? [],
    source: ESSENTIAL_DIGNITIES_SOURCE,
    errors: overrides.errors ?? [],
  };
}

function toSafeDignityResult(result) {
  return {
    planetKey: result.planetKey,
    planetLabel: result.planetLabel,
    signKey: result.signKey,
    signLabel: result.signLabel,
    dignities: { ...result.dignities },
    score: result.score,
    labels: [...result.labels],
    modernLabels: [...result.modernLabels],
    source: result.source,
  };
}

function safeStringList(items) {
  return Array.isArray(items)
    ? items.filter((item) => typeof item === 'string' && item.trim()).map((item) => item.trim())
    : [];
}

function unique(items) {
  return [...new Set(items.filter(Boolean))];
}
