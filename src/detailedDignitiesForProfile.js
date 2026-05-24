import { evaluateDecansForPlanets } from './decans.js';
import { evaluateDegreeRulersForPlanets } from './degreeRulersStarOfMagi.js';
import { evaluateVronskyDegreeRulersForPlanets } from './degreeRulersVronsky.js';
import {
  formatDetailedDignityResult,
  getDetailedDignityDisplayLimitations,
} from './detailedDignityDisplay.js';
import { getNatalPlanetsForProfile } from './natalPlanetsForProfile.js';
import { evaluateTermsForPlanets } from './terms.js';

const DETAILED_DIGNITIES_TITLE = 'Термы, деканы и градусы';
const NOT_AVAILABLE_SUMMARY = 'Пока недоступны.';
const PLANETS_REQUIRED_MESSAGE = 'Сначала нужен расчет натальных планет.';

export function getDetailedDignitiesForProfile(profile = null) {
  if (!profile) {
    return detailedDignitiesResult({
      status: 'notAvailable',
      enabled: false,
      summary: NOT_AVAILABLE_SUMMARY,
      message: PLANETS_REQUIRED_MESSAGE,
    });
  }

  const natalPlanets = getNatalPlanetsForProfile(profile);
  const planets = Array.isArray(natalPlanets.planets) ? natalPlanets.planets : [];

  if (natalPlanets.status !== 'ready' || planets.length === 0) {
    return detailedDignitiesResult({
      status: 'notAvailable',
      enabled: false,
      summary: NOT_AVAILABLE_SUMMARY,
      message: PLANETS_REQUIRED_MESSAGE,
    });
  }

  const grouped = groupDetailedDignitiesByPlanet(planets, [
    ...evaluateTermsForPlanets(planets),
    ...evaluateDecansForPlanets(planets),
    ...evaluateDegreeRulersForPlanets(planets),
    ...evaluateVronskyDegreeRulersForPlanets(planets),
  ]);

  return detailedDignitiesResult({
    status: 'ready',
    enabled: true,
    summary: '',
    groups: grouped,
  });
}

function groupDetailedDignitiesByPlanet(planets, lookupResults) {
  const entries = lookupResults
    .map((result) => ({
      planetKey: cleanText(result.planetKey),
      item: formatDetailedDignityResult(result),
    }))
    .filter((entry) => entry.planetKey && entry.item);

  return planets.map((planet) => {
    const planetKey = cleanText(planet.key);

    return {
      planetKey,
      planetLabel: cleanText(planet.label),
      items: entries
        .filter((entry) => entry.planetKey === planetKey)
        .map((entry) => toGroupItem(entry.item)),
    };
  }).filter((group) => group.planetKey && group.planetLabel && group.items.length > 0);
}

function toGroupItem(item) {
  return {
    type: item.type,
    title: item.title,
    planet: item.planet,
    text: item.text,
    detail: item.detail,
    source: item.source,
  };
}

function detailedDignitiesResult(overrides = {}) {
  return {
    status: overrides.status ?? 'notAvailable',
    enabled: overrides.enabled ?? false,
    title: DETAILED_DIGNITIES_TITLE,
    summary: overrides.summary ?? NOT_AVAILABLE_SUMMARY,
    message: overrides.message ?? '',
    groups: overrides.groups ?? [],
    limitations: getDetailedDignityDisplayLimitations(),
  };
}

function cleanText(value) {
  return typeof value === 'string' ? value.trim() : '';
}
