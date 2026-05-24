import { getDegreeInSign, getZodiacSign } from './astroMath.js';
import {
  getDegreeRulerRowsForSign,
  getDegreeRulersStarOfMagiSource,
  isValidDegreeRulerSign,
} from './degreeRulersStarOfMagiData.js';

const CANONICAL_PLANET_ORDER = Object.freeze([
  'sun',
  'moon',
  'mercury',
  'venus',
  'mars',
  'jupiter',
  'saturn',
  'uranus',
  'neptune',
  'pluto',
]);

const DEGREE_RULER_PLANET_LABELS = Object.freeze({
  sun: 'Солнце',
  moon: 'Луна',
  mercury: 'Меркурий',
  venus: 'Венера',
  mars: 'Марс',
  jupiter: 'Юпитер',
  saturn: 'Сатурн',
});

const DEGREE_RULER_KEYS = Object.freeze(Object.keys(DEGREE_RULER_PLANET_LABELS));
const INVALID_STATUS = 'invalid';
const READY_STATUS = 'ready';

export function lookupDegreeRuler(signKey, degreeWithinSign) {
  const input = resolveDegreeRulerLookupInput({ sign: signKey, degreeWithinSign });

  if (input.status !== READY_STATUS) {
    return invalidResult(input.reason);
  }

  const rows = getDegreeRulerRowsForSign(input.signKey);
  const degreeRow = rows.find((row) => row.degree === input.degreeIndex);

  if (!degreeRow) {
    return invalidResult('degreeRulerNotFound');
  }

  return {
    status: READY_STATUS,
    sign: degreeRow.sign,
    signRu: degreeRow.signRu,
    degreeWithinSign: input.degreeWithinSign,
    degreeIndex: input.degreeIndex,
    ruler: degreeRow.ruler,
    rulerRu: degreeRow.rulerRu,
    source: sourceSummary(),
  };
}

export function lookupDegreeRulerForPlanet(planet) {
  if (!isPlainObject(planet)) {
    return invalidResult('invalidPlanet');
  }

  const planetKey = normalizeText(planet.key);
  const planetLabel = normalizeText(planet.label);

  if (!CANONICAL_PLANET_ORDER.includes(planetKey) || !planetLabel) {
    return invalidResult('invalidPlanet');
  }

  const input = resolvePlanetDegreeRulerLookupInput(planet);

  if (input.status !== READY_STATUS) {
    return invalidResult(input.reason);
  }

  const lookup = lookupDegreeRuler(input.signKey, input.degreeWithinSign);

  if (lookup.status !== READY_STATUS) {
    return invalidResult(lookup.reason);
  }

  return {
    status: READY_STATUS,
    planetKey,
    planetLabel,
    sign: lookup.sign,
    signRu: lookup.signRu,
    degreeWithinSign: lookup.degreeWithinSign,
    degreeIndex: lookup.degreeIndex,
    degreeRuler: {
      ruler: lookup.ruler,
      rulerRu: lookup.rulerRu,
      degree: lookup.degreeIndex,
    },
    source: lookup.source.sourceKey,
    sourceSystem: lookup.source.sourceSystem,
  };
}

export function evaluateDegreeRulersForPlanets(planets) {
  if (!Array.isArray(planets)) {
    return [];
  }

  return planets
    .map(lookupDegreeRulerForPlanet)
    .filter((result) => result.status === READY_STATUS)
    .sort(compareByPlanetOrder);
}

export function getDegreeRulersSummary(results) {
  const allResults = Array.isArray(results) ? results.filter(isPlainObject) : [];
  const readyResults = allResults.filter(isReadyDegreeRulerResult);
  const byRuler = createEmptyRulerCounts();

  for (const result of readyResults) {
    const ruler = getResultRuler(result);

    if (Object.hasOwn(byRuler, ruler)) {
      byRuler[ruler] += 1;
    }
  }

  return {
    total: allResults.length,
    ready: readyResults.length,
    byRuler,
    text: readyResults.length > 0
      ? `${readyResults.length} управителей градусов найдено`
      : 'Управители градусов не рассчитаны.',
  };
}

export function isValidDegreeRulerLookupDegree(degreeWithinSign) {
  return Number.isFinite(degreeWithinSign)
    && degreeWithinSign >= 0
    && degreeWithinSign < 30;
}

export function getDegreeIndex(degreeWithinSign) {
  if (!isValidDegreeRulerLookupDegree(degreeWithinSign)) {
    return null;
  }

  return Math.floor(degreeWithinSign);
}

export function resolveDegreeRulerLookupInput(input) {
  if (!isPlainObject(input)) {
    return invalidLookupInput('invalidInput');
  }

  const signKey = normalizeText(input.signKey || input.sign?.key || input.sign);

  if (!isValidDegreeRulerSign(signKey)) {
    return invalidLookupInput('invalidSign');
  }

  if (!isValidDegreeRulerLookupDegree(input.degreeWithinSign)) {
    return invalidLookupInput('invalidDegree');
  }

  return {
    status: READY_STATUS,
    signKey,
    degreeWithinSign: input.degreeWithinSign,
    degreeIndex: getDegreeIndex(input.degreeWithinSign),
  };
}

export function getDegreeRulerPlanetLabel(rulerKey) {
  return DEGREE_RULER_PLANET_LABELS[normalizeText(rulerKey)] ?? '';
}

export function getDegreeRulersEngineCapabilities() {
  const source = getDegreeRulersStarOfMagiSource();

  return {
    source: source.sourceKey,
    sourceSystem: source.sourceSystem,
    degreeRulers: true,
    table6StarOfMagi: true,
    table7Vronsky: false,
    decans: false,
    terms: false,
    fixedStars: false,
    houses: false,
    ascMc: false,
    transits: false,
    interpretations: false,
  };
}

function resolvePlanetDegreeRulerLookupInput(planet) {
  const explicitSignKey = normalizeText(planet.sign?.key);
  const explicitDegree = resolveExplicitDegreeWithinSign(planet);

  if (isValidDegreeRulerSign(explicitSignKey) && explicitDegree !== null) {
    return resolveDegreeRulerLookupInput({
      sign: explicitSignKey,
      degreeWithinSign: explicitDegree,
    });
  }

  if (Number.isFinite(planet.longitude)) {
    const sign = getZodiacSign(planet.longitude);
    const degreeWithinSign = getDegreeInSign(planet.longitude);

    return resolveDegreeRulerLookupInput({
      sign: sign?.key,
      degreeWithinSign,
    });
  }

  return invalidLookupInput('invalidLookupInput');
}

function resolveExplicitDegreeWithinSign(planet) {
  if (!Number.isFinite(planet.degree)) {
    return null;
  }

  const minutes = isMissingValue(planet.minutes) ? 0 : planet.minutes;

  if (!Number.isFinite(minutes) || minutes < 0 || minutes >= 60) {
    return null;
  }

  return planet.degree + (minutes / 60);
}

function invalidResult(reason) {
  return {
    status: INVALID_STATUS,
    reason: reason || 'invalidInput',
    degreeRuler: null,
  };
}

function invalidLookupInput(reason) {
  return {
    status: INVALID_STATUS,
    reason,
  };
}

function sourceSummary() {
  const source = getDegreeRulersStarOfMagiSource();

  return {
    sourceKey: source.sourceKey,
    sourceSystem: source.sourceSystem,
    tableNumber: source.tableNumber,
    verificationStatus: source.verificationStatus,
  };
}

function isReadyDegreeRulerResult(result) {
  if (result.status !== READY_STATUS) {
    return false;
  }

  const ruler = getResultRuler(result);
  const degreeIndex = getResultDegreeIndex(result);

  return DEGREE_RULER_KEYS.includes(ruler) && Number.isInteger(degreeIndex);
}

function getResultRuler(result) {
  return normalizeText(result.degreeRuler?.ruler || result.ruler);
}

function getResultDegreeIndex(result) {
  const degreeIndex = result.degreeRuler?.degree ?? result.degreeIndex;

  return Number.isInteger(degreeIndex) ? degreeIndex : null;
}

function createEmptyRulerCounts() {
  return Object.fromEntries(DEGREE_RULER_KEYS.map((ruler) => [ruler, 0]));
}

function compareByPlanetOrder(a, b) {
  return CANONICAL_PLANET_ORDER.indexOf(a.planetKey) - CANONICAL_PLANET_ORDER.indexOf(b.planetKey);
}

function normalizeText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function isMissingValue(value) {
  return value === null || value === undefined || value === '';
}

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}
