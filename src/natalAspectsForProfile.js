import { calculateNatalAspects } from './natalAspectEngine.js';
import {
  formatNatalAspectList,
  getNatalAspectDisplayLimitations,
  summarizeNatalAspects,
} from './natalAspectDisplay.js';
import { getNatalPlanetsForProfile } from './natalPlanetsForProfile.js';

const NATAL_ASPECTS_SOURCE = 'natal-aspect-engine';
const NATAL_ASPECTS_PLANETS_REQUIRED_WARNING = 'Сначала нужен расчет натальных планет.';

export function getNatalAspectsForProfile(profile = null) {
  const natalPlanets = getNatalPlanetsForProfile(profile);

  if (natalPlanets.status !== 'ready' || natalPlanets.planets.length === 0) {
    return {
      status: natalPlanets.status === 'notSupported' ? 'notSupported' : 'incomplete',
      aspects: [],
      formattedAspects: [],
      summary: summarizeNatalAspects([]),
      missingFields: safeStringList(natalPlanets.missingFields),
      warnings: unique([
        ...safeStringList(natalPlanets.warnings),
        NATAL_ASPECTS_PLANETS_REQUIRED_WARNING,
      ]),
      limitations: [],
      source: NATAL_ASPECTS_SOURCE,
      errors: safeStringList(natalPlanets.errors),
    };
  }

  const aspects = calculateNatalAspects(natalPlanets.planets);
  const formattedAspects = formatNatalAspectList(aspects);

  return {
    status: 'ready',
    aspects: aspects.map(toSafeAspectSummary),
    formattedAspects,
    summary: summarizeNatalAspects(aspects),
    missingFields: [],
    warnings: [],
    limitations: getNatalAspectDisplayLimitations(),
    source: NATAL_ASPECTS_SOURCE,
    errors: [],
  };
}

function toSafeAspectSummary(aspect) {
  return {
    bodyA: aspect.bodyA,
    bodyB: aspect.bodyB,
    aspect: aspect.aspect,
    orb: aspect.orb,
    orbText: aspect.orbText,
    strength: aspect.strength,
    applying: aspect.applying,
    separating: aspect.separating,
    source: aspect.source,
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
