import { getDegreeInSign, getZodiacSign } from './astroMath.js';
import {
  getTermsRowsForSign,
  getTermsSource,
  isValidTermsSign,
} from './termsData.js';

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

const TERM_RULER_LABELS = Object.freeze({
  mars: 'Марс',
  venus: 'Венера',
  mercury: 'Меркурий',
  jupiter: 'Юпитер',
  saturn: 'Сатурн',
});

const TERM_RULER_KEYS = Object.freeze(Object.keys(TERM_RULER_LABELS));
const INVALID_STATUS = 'invalid';
const READY_STATUS = 'ready';
const SUMMARY_STATUS = 'summary';

export function lookupTerm(signKey, degreeWithinSign) {
  const input = resolveTermLookupInput({ sign: signKey, degreeWithinSign });

  if (input.status !== READY_STATUS) {
    return invalidResult(input.reason);
  }

  const rows = getTermsRowsForSign(input.signKey);
  const termRow = rows.find(
    (row) => input.degreeWithinSign >= row.startDegree
      && input.degreeWithinSign < row.normalizedEndExclusive,
  );

  if (!termRow) {
    return invalidResult('termNotFound');
  }

  return {
    status: READY_STATUS,
    sign: termRow.sign,
    signRu: termRow.signRu,
    degreeWithinSign: input.degreeWithinSign,
    ruler: termRow.ruler,
    rulerRu: termRow.rulerRu,
    value: termRow.value,
    range: rangeFromRow(termRow),
    source: sourceSummary(),
  };
}

export function lookupTermForPlanet(planet) {
  if (!isPlainObject(planet)) {
    return invalidResult('invalidPlanet');
  }

  const planetKey = normalizeText(planet.key);
  const planetLabel = normalizeText(planet.label);

  if (!CANONICAL_PLANET_ORDER.includes(planetKey) || !planetLabel) {
    return invalidResult('invalidPlanet');
  }

  const input = resolvePlanetTermLookupInput(planet);

  if (input.status !== READY_STATUS) {
    return invalidResult(input.reason);
  }

  const lookup = lookupTerm(input.signKey, input.degreeWithinSign);

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
    term: {
      ruler: lookup.ruler,
      rulerRu: lookup.rulerRu,
      value: lookup.value,
      range: { ...lookup.range },
    },
    source: lookup.source.sourceKey,
  };
}

export function evaluateTermsForPlanets(planets) {
  if (!Array.isArray(planets)) {
    return [];
  }

  return planets
    .map(lookupTermForPlanet)
    .filter((result) => result.status === READY_STATUS)
    .sort(compareByPlanetOrder);
}

export function getTermsSummary(results) {
  const allResults = Array.isArray(results) ? results.filter(isPlainObject) : [];
  const readyResults = allResults.filter(isReadyTermResult);
  const byRuler = createEmptyRulerCounts();
  let positive = 0;
  let negative = 0;
  let zero = 0;
  let scoreTotal = 0;

  for (const result of readyResults) {
    const ruler = getResultRuler(result);
    const value = getResultValue(result);

    if (Object.hasOwn(byRuler, ruler)) {
      byRuler[ruler] += 1;
    }

    if (value > 0) {
      positive += 1;
    } else if (value < 0) {
      negative += 1;
    } else {
      zero += 1;
    }

    scoreTotal += value;
  }

  return {
    total: allResults.length,
    ready: readyResults.length,
    byRuler,
    positive,
    negative,
    zero,
    scoreTotal,
    text: readyResults.length > 0 ? `${readyResults.length} термов найдено` : 'Термы не рассчитаны.',
  };
}

export function isValidTermDegree(degreeWithinSign) {
  return Number.isFinite(degreeWithinSign)
    && degreeWithinSign >= 0
    && degreeWithinSign < 30;
}

export function resolveTermLookupInput(input) {
  if (!isPlainObject(input)) {
    return invalidLookupInput('invalidInput');
  }

  const signKey = normalizeText(input.signKey || input.sign?.key || input.sign);

  if (!isValidTermsSign(signKey)) {
    return invalidLookupInput('invalidSign');
  }

  if (!isValidTermDegree(input.degreeWithinSign)) {
    return invalidLookupInput('invalidDegree');
  }

  return {
    status: READY_STATUS,
    signKey,
    degreeWithinSign: input.degreeWithinSign,
  };
}

export function getTermRulerLabel(rulerKey) {
  return TERM_RULER_LABELS[normalizeText(rulerKey)] ?? '';
}

export function getTermsEngineCapabilities() {
  return {
    source: getTermsSource().sourceKey,
    terms: true,
    decans: false,
    degreeRulers: false,
    fixedStars: false,
    houses: false,
    ascMc: false,
    transits: false,
    interpretations: false,
  };
}

function resolvePlanetTermLookupInput(planet) {
  const explicitSignKey = normalizeText(planet.sign?.key);

  if (
    isValidTermsSign(explicitSignKey)
    && Number.isFinite(planet.degree)
    && Number.isFinite(planet.minutes)
    && planet.minutes >= 0
    && planet.minutes < 60
  ) {
    return resolveTermLookupInput({
      sign: explicitSignKey,
      degreeWithinSign: planet.degree + (planet.minutes / 60),
    });
  }

  if (Number.isFinite(planet.longitude)) {
    const sign = getZodiacSign(planet.longitude);
    const degreeWithinSign = getDegreeInSign(planet.longitude);

    return resolveTermLookupInput({
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
    term: null,
  };
}

function invalidLookupInput(reason) {
  return {
    status: INVALID_STATUS,
    reason,
  };
}

function sourceSummary() {
  const source = getTermsSource();

  return {
    sourceKey: source.sourceKey,
    tableName: source.tableName,
    tableNumber: source.tableNumber,
    verificationStatus: source.verificationStatus,
  };
}

function rangeFromRow(row) {
  return {
    startDegree: row.startDegree,
    printedEndDegree: row.printedEndDegree,
    normalizedEndExclusive: row.normalizedEndExclusive,
  };
}

function isReadyTermResult(result) {
  if (result.status !== READY_STATUS) {
    return false;
  }

  const ruler = getResultRuler(result);
  const value = getResultValue(result);

  return TERM_RULER_KEYS.includes(ruler) && Number.isFinite(value);
}

function getResultRuler(result) {
  return normalizeText(result.term?.ruler || result.ruler);
}

function getResultValue(result) {
  const value = result.term?.value ?? result.value;

  return Number.isFinite(value) ? value : 0;
}

function createEmptyRulerCounts() {
  return Object.fromEntries(TERM_RULER_KEYS.map((ruler) => [ruler, 0]));
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
