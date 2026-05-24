import { getDegreeInSign, getZodiacSign } from './astroMath.js';
import {
  getDegreeRulersVronskyRowsForSign,
  getDegreeRulersVronskySource,
  isValidVronskyDegreeRulerSign,
} from './degreeRulersVronskyData.js';

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

const VRONSKY_RULER_LABELS = Object.freeze({
  sun: 'Солнце',
  moon: 'Луна',
  mercury: 'Меркурий',
  venus: 'Венера',
  mars: 'Марс',
  jupiter: 'Юпитер',
  saturn: 'Сатурн',
  uranus: 'Уран',
  neptune: 'Нептун',
  pluto: 'Плутон',
  chiron: 'Хирон',
  proserpina: 'Прозерпина',
});

const VRONSKY_RULER_KEYS = Object.freeze(Object.keys(VRONSKY_RULER_LABELS));
const OUTER_PLANET_KEYS = Object.freeze(['uranus', 'neptune', 'pluto']);
const INVALID_STATUS = 'invalid';
const READY_STATUS = 'ready';

export function lookupVronskyDegreeRulers(signKey, degreeWithinSign) {
  const input = resolveVronskyDegreeRulerLookupInput({ sign: signKey, degreeWithinSign });

  if (input.status !== READY_STATUS) {
    return invalidResult(input.reason);
  }

  const rows = getDegreeRulersVronskyRowsForSign(input.signKey);
  const degreeRow = rows.find((row) => row.degree === input.degreeIndex);

  if (!degreeRow) {
    return invalidResult('degreeRulersNotFound');
  }

  return {
    status: READY_STATUS,
    sign: degreeRow.sign,
    signRu: degreeRow.signRu,
    degreeWithinSign: input.degreeWithinSign,
    degreeIndex: input.degreeIndex,
    sourceTokens: copySourceTokens(degreeRow.sourceTokens),
    rulers: copyRulers(degreeRow.rulers),
    source: sourceSummary(),
  };
}

export function lookupVronskyDegreeRulersForPlanet(planet) {
  if (!isPlainObject(planet)) {
    return invalidResult('invalidPlanet');
  }

  const planetKey = normalizeText(planet.key);
  const planetLabel = normalizeText(planet.label);

  if (!CANONICAL_PLANET_ORDER.includes(planetKey) || !planetLabel) {
    return invalidResult('invalidPlanet');
  }

  const input = resolvePlanetVronskyDegreeRulerLookupInput(planet);

  if (input.status !== READY_STATUS) {
    return invalidResult(input.reason);
  }

  const lookup = lookupVronskyDegreeRulers(input.signKey, input.degreeWithinSign);

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
    degreeRulers: copyRulers(lookup.rulers),
    sourceTokens: copySourceTokens(lookup.sourceTokens),
    source: lookup.source.sourceKey,
    sourceSystem: lookup.source.sourceSystem,
  };
}

export function evaluateVronskyDegreeRulersForPlanets(planets) {
  if (!Array.isArray(planets)) {
    return [];
  }

  return planets
    .map(lookupVronskyDegreeRulersForPlanet)
    .filter((result) => result.status === READY_STATUS)
    .sort(compareByPlanetOrder);
}

export function getVronskyDegreeRulersSummary(results) {
  const allResults = Array.isArray(results) ? results.filter(isPlainObject) : [];
  const readyResults = allResults.filter(isReadyVronskyDegreeRulerResult);
  const byRuler = createEmptyRulerCounts();
  let multiRuler = 0;
  let retrograde = 0;
  let outerPlanet = 0;

  for (const result of readyResults) {
    const rulers = getResultRulers(result);

    if (rulers.length > 1) {
      multiRuler += 1;
    }

    for (const ruler of rulers) {
      if (Object.hasOwn(byRuler, ruler.key)) {
        byRuler[ruler.key] += 1;
      }

      if (ruler.retrograde) {
        retrograde += 1;
      }

      if (OUTER_PLANET_KEYS.includes(ruler.key)) {
        outerPlanet += 1;
      }
    }
  }

  return {
    total: allResults.length,
    ready: readyResults.length,
    byRuler,
    multiRuler,
    retrograde,
    outerPlanet,
    text: readyResults.length > 0
      ? `${readyResults.length} управителей градусов по Вронскому найдено`
      : 'Управители градусов по Вронскому не рассчитаны.',
  };
}

export function isValidVronskyDegreeRulerLookupDegree(degreeWithinSign) {
  return Number.isFinite(degreeWithinSign)
    && degreeWithinSign >= 0
    && degreeWithinSign < 30;
}

export function getVronskyDegreeIndex(degreeWithinSign) {
  if (!isValidVronskyDegreeRulerLookupDegree(degreeWithinSign)) {
    return null;
  }

  return Math.floor(degreeWithinSign);
}

export function resolveVronskyDegreeRulerLookupInput(input) {
  if (!isPlainObject(input)) {
    return invalidLookupInput('invalidInput');
  }

  const signKey = normalizeText(input.signKey || input.sign?.key || input.sign);

  if (!isValidVronskyDegreeRulerSign(signKey)) {
    return invalidLookupInput('invalidSign');
  }

  if (!isValidVronskyDegreeRulerLookupDegree(input.degreeWithinSign)) {
    return invalidLookupInput('invalidDegree');
  }

  return {
    status: READY_STATUS,
    signKey,
    degreeWithinSign: input.degreeWithinSign,
    degreeIndex: getVronskyDegreeIndex(input.degreeWithinSign),
  };
}

export function getVronskyRulerLabel(rulerKey) {
  return VRONSKY_RULER_LABELS[normalizeText(rulerKey)] ?? '';
}

export function getVronskyDegreeRulersEngineCapabilities() {
  const source = getDegreeRulersVronskySource();

  return {
    source: source.sourceKey,
    sourceSystem: source.sourceSystem,
    degreeRulers: true,
    table7Vronsky: true,
    table6StarOfMagi: false,
    supportsMultipleRulers: true,
    supportsRetrogradeMarkers: true,
    supportsOuterPlanets: true,
    supportsChiron: true,
    supportsProserpina: true,
    terms: false,
    decans: false,
    fixedStars: false,
    houses: false,
    ascMc: false,
    transits: false,
    interpretations: false,
  };
}

function resolvePlanetVronskyDegreeRulerLookupInput(planet) {
  const explicitSignKey = normalizeText(planet.sign?.key);
  const explicitDegree = resolveExplicitDegreeWithinSign(planet);

  if (isValidVronskyDegreeRulerSign(explicitSignKey) && explicitDegree !== null) {
    return resolveVronskyDegreeRulerLookupInput({
      sign: explicitSignKey,
      degreeWithinSign: explicitDegree,
    });
  }

  if (Number.isFinite(planet.longitude)) {
    const sign = getZodiacSign(planet.longitude);
    const degreeWithinSign = getDegreeInSign(planet.longitude);

    return resolveVronskyDegreeRulerLookupInput({
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
    degreeRulers: null,
  };
}

function invalidLookupInput(reason) {
  return {
    status: INVALID_STATUS,
    reason,
  };
}

function sourceSummary() {
  const source = getDegreeRulersVronskySource();

  return {
    sourceKey: source.sourceKey,
    sourceSystem: source.sourceSystem,
    tableNumber: source.tableNumber,
    verificationStatus: source.verificationStatus,
  };
}

function isReadyVronskyDegreeRulerResult(result) {
  if (result.status !== READY_STATUS) {
    return false;
  }

  const degreeIndex = getResultDegreeIndex(result);
  const rulers = getResultRulers(result);

  return Number.isInteger(degreeIndex)
    && rulers.length > 0
    && rulers.every(isValidResultRuler);
}

function getResultRulers(result) {
  const rulers = result.degreeRulers ?? result.rulers;

  if (!Array.isArray(rulers)) {
    return [];
  }

  return rulers.filter(isValidResultRuler);
}

function getResultDegreeIndex(result) {
  const degreeIndex = result.degreeIndex;

  return Number.isInteger(degreeIndex) ? degreeIndex : null;
}

function isValidResultRuler(ruler) {
  return isPlainObject(ruler)
    && VRONSKY_RULER_KEYS.includes(normalizeText(ruler.key))
    && typeof ruler.retrograde === 'boolean';
}

function createEmptyRulerCounts() {
  return Object.fromEntries(VRONSKY_RULER_KEYS.map((ruler) => [ruler, 0]));
}

function copySourceTokens(sourceTokens) {
  return Array.isArray(sourceTokens) ? sourceTokens.map((token) => String(token)) : [];
}

function copyRulers(rulers) {
  if (!Array.isArray(rulers)) {
    return [];
  }

  return rulers.map((ruler) => ({
    key: ruler.key,
    rulerRu: ruler.rulerRu,
    retrograde: ruler.retrograde,
    sourceToken: ruler.sourceToken,
  }));
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
