import { getDegreeInSign, getZodiacSign } from './astroMath.js';
import {
  getDecanRowsForSign,
  getDecansSource,
  isValidDecanSign,
} from './decansData.js';

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

const DECAN_RULER_LABELS = Object.freeze({
  sun: 'Солнце',
  moon: 'Луна',
  mercury: 'Меркурий',
  venus: 'Венера',
  mars: 'Марс',
  jupiter: 'Юпитер',
  saturn: 'Сатурн',
});

const DECAN_RULER_KEYS = Object.freeze(Object.keys(DECAN_RULER_LABELS));
const DECAN_INDEXES = Object.freeze([1, 2, 3]);
const INVALID_STATUS = 'invalid';
const READY_STATUS = 'ready';

export function lookupDecan(signKey, degreeWithinSign) {
  const input = resolveDecanLookupInput({ sign: signKey, degreeWithinSign });

  if (input.status !== READY_STATUS) {
    return invalidResult(input.reason);
  }

  const rows = getDecanRowsForSign(input.signKey);
  const decanRow = rows.find(
    (row) => input.degreeWithinSign >= row.startDegree
      && input.degreeWithinSign < row.endDegreeExclusive,
  );

  if (!decanRow) {
    return invalidResult('decanNotFound');
  }

  return {
    status: READY_STATUS,
    sign: decanRow.sign,
    signRu: decanRow.signRu,
    degreeWithinSign: input.degreeWithinSign,
    decanIndex: decanRow.decanIndex,
    ruler: decanRow.ruler,
    rulerRu: decanRow.rulerRu,
    range: rangeFromRow(decanRow),
    source: sourceSummary(),
  };
}

export function lookupDecanForPlanet(planet) {
  if (!isPlainObject(planet)) {
    return invalidResult('invalidPlanet');
  }

  const planetKey = normalizeText(planet.key);
  const planetLabel = normalizeText(planet.label);

  if (!CANONICAL_PLANET_ORDER.includes(planetKey) || !planetLabel) {
    return invalidResult('invalidPlanet');
  }

  const input = resolvePlanetDecanLookupInput(planet);

  if (input.status !== READY_STATUS) {
    return invalidResult(input.reason);
  }

  const lookup = lookupDecan(input.signKey, input.degreeWithinSign);

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
    decan: {
      decanIndex: lookup.decanIndex,
      ruler: lookup.ruler,
      rulerRu: lookup.rulerRu,
      range: { ...lookup.range },
    },
    source: lookup.source.sourceKey,
    sourceSystem: lookup.source.sourceSystem,
  };
}

export function evaluateDecansForPlanets(planets) {
  if (!Array.isArray(planets)) {
    return [];
  }

  return planets
    .map(lookupDecanForPlanet)
    .filter((result) => result.status === READY_STATUS)
    .sort(compareByPlanetOrder);
}

export function getDecansSummary(results) {
  const allResults = Array.isArray(results) ? results.filter(isPlainObject) : [];
  const readyResults = allResults.filter(isReadyDecanResult);
  const byRuler = createEmptyRulerCounts();
  const byDecanIndex = createEmptyDecanIndexCounts();

  for (const result of readyResults) {
    const ruler = getResultRuler(result);
    const decanIndex = getResultDecanIndex(result);

    if (Object.hasOwn(byRuler, ruler)) {
      byRuler[ruler] += 1;
    }

    if (Object.hasOwn(byDecanIndex, decanIndex)) {
      byDecanIndex[decanIndex] += 1;
    }
  }

  return {
    total: allResults.length,
    ready: readyResults.length,
    byRuler,
    byDecanIndex,
    text: readyResults.length > 0 ? `${readyResults.length} деканов найдено` : 'Деканы не рассчитаны.',
  };
}

export function isValidDecanDegree(degreeWithinSign) {
  return Number.isFinite(degreeWithinSign)
    && degreeWithinSign >= 0
    && degreeWithinSign < 30;
}

export function resolveDecanLookupInput(input) {
  if (!isPlainObject(input)) {
    return invalidLookupInput('invalidInput');
  }

  const signKey = normalizeText(input.signKey || input.sign?.key || input.sign);

  if (!isValidDecanSign(signKey)) {
    return invalidLookupInput('invalidSign');
  }

  if (!isValidDecanDegree(input.degreeWithinSign)) {
    return invalidLookupInput('invalidDegree');
  }

  return {
    status: READY_STATUS,
    signKey,
    degreeWithinSign: input.degreeWithinSign,
  };
}

export function getDecanRulerLabel(rulerKey) {
  return DECAN_RULER_LABELS[normalizeText(rulerKey)] ?? '';
}

export function getDecansEngineCapabilities() {
  const source = getDecansSource();

  return {
    source: source.sourceKey,
    sourceSystem: source.sourceSystem,
    decans: true,
    trigonDecans: false,
    degreeRulers: false,
    fixedStars: false,
    houses: false,
    ascMc: false,
    transits: false,
    interpretations: false,
  };
}

function resolvePlanetDecanLookupInput(planet) {
  const explicitSignKey = normalizeText(planet.sign?.key);

  if (
    isValidDecanSign(explicitSignKey)
    && Number.isFinite(planet.degree)
    && Number.isFinite(planet.minutes)
    && planet.minutes >= 0
    && planet.minutes < 60
  ) {
    return resolveDecanLookupInput({
      sign: explicitSignKey,
      degreeWithinSign: planet.degree + (planet.minutes / 60),
    });
  }

  if (Number.isFinite(planet.longitude)) {
    const sign = getZodiacSign(planet.longitude);
    const degreeWithinSign = getDegreeInSign(planet.longitude);

    return resolveDecanLookupInput({
      sign: sign?.key,
      degreeWithinSign,
    });
  }

  return invalidLookupInput('invalidLookupInput');
}

function invalidResult(reason) {
  return {
    status: INVALID_STATUS,
    reason: reason || 'invalidInput',
    decan: null,
  };
}

function invalidLookupInput(reason) {
  return {
    status: INVALID_STATUS,
    reason,
  };
}

function sourceSummary() {
  const source = getDecansSource();

  return {
    sourceKey: source.sourceKey,
    sourceSystem: source.sourceSystem,
    figureNumber: source.figureNumber,
    verificationStatus: source.verificationStatus,
  };
}

function rangeFromRow(row) {
  return {
    startDegree: row.startDegree,
    endDegreeExclusive: row.endDegreeExclusive,
  };
}

function isReadyDecanResult(result) {
  if (result.status !== READY_STATUS) {
    return false;
  }

  const ruler = getResultRuler(result);
  const decanIndex = getResultDecanIndex(result);

  return DECAN_RULER_KEYS.includes(ruler) && DECAN_INDEXES.includes(decanIndex);
}

function getResultRuler(result) {
  return normalizeText(result.decan?.ruler || result.ruler);
}

function getResultDecanIndex(result) {
  const decanIndex = result.decan?.decanIndex ?? result.decanIndex;

  return Number.isInteger(decanIndex) ? decanIndex : 0;
}

function createEmptyRulerCounts() {
  return Object.fromEntries(DECAN_RULER_KEYS.map((ruler) => [ruler, 0]));
}

function createEmptyDecanIndexCounts() {
  return Object.fromEntries(DECAN_INDEXES.map((decanIndex) => [decanIndex, 0]));
}

function compareByPlanetOrder(a, b) {
  return CANONICAL_PLANET_ORDER.indexOf(a.planetKey) - CANONICAL_PLANET_ORDER.indexOf(b.planetKey);
}

function normalizeText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}
