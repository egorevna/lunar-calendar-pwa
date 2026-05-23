import { ASTRO_ZODIAC_SIGNS, getZodiacSign } from './astroMath.js';
import {
  CLASSICAL_DETRIMENTS,
  CLASSICAL_EXALTATIONS,
  CLASSICAL_FALLS,
  CLASSICAL_RULERSHIPS,
  ESSENTIAL_DIGNITY_SCORE_MODEL,
  ESSENTIAL_DIGNITY_SOURCE,
  MODERN_OUTER_PLANET_KEYS,
  MODERN_RULERSHIP_LABELS,
  TRADITIONAL_PLANET_KEYS,
} from './essentialDignitiesData.js';

const CANONICAL_PLANET_ORDER = Object.freeze([
  ...TRADITIONAL_PLANET_KEYS,
  ...MODERN_OUTER_PLANET_KEYS,
]);

const DIGNITY_LABELS = Object.freeze({
  domicile: 'обитель',
  detriment: 'изгнание',
  exaltation: 'экзальтация',
  fall: 'падение',
  modernRulership: 'современное управление',
});

const SIGN_BY_KEY = Object.freeze(
  Object.fromEntries(ASTRO_ZODIAC_SIGNS.map((sign) => [sign.key, sign])),
);

export function evaluateEssentialDignity(planet) {
  if (!isValidDignityPlanet(planet)) {
    return null;
  }

  const planetKey = normalizeText(planet.key);
  const signKey = resolvePlanetSignKey(planet);
  const sign = SIGN_BY_KEY[signKey];
  const dignities = {
    domicile: hasTableMatch(CLASSICAL_RULERSHIPS, planetKey, signKey),
    detriment: hasTableMatch(CLASSICAL_DETRIMENTS, planetKey, signKey),
    exaltation: hasTableMatch(CLASSICAL_EXALTATIONS, planetKey, signKey),
    fall: hasTableMatch(CLASSICAL_FALLS, planetKey, signKey),
    modernRulership: hasTableMatch(MODERN_RULERSHIP_LABELS, planetKey, signKey),
  };
  const result = {
    planetKey,
    planetLabel: normalizeText(planet.label),
    signKey,
    signLabel: sign.ru,
    dignities,
    score: 0,
    labels: [],
    modernLabels: [],
    source: ESSENTIAL_DIGNITY_SOURCE.key,
  };

  result.score = getEssentialDignityScore(result);
  result.labels = getEssentialDignityLabels(result);
  result.modernLabels = dignities.modernRulership ? [DIGNITY_LABELS.modernRulership] : [];

  return result;
}

export function evaluateEssentialDignities(planets) {
  if (!Array.isArray(planets)) {
    return [];
  }

  return planets
    .map(evaluateEssentialDignity)
    .filter(Boolean)
    .sort(compareByPlanetOrder);
}

export function getEssentialDignitySummary(results) {
  const validResults = Array.isArray(results) ? results.filter(isDignityResult) : [];

  if (validResults.length === 0) {
    return {
      total: 0,
      dignified: 0,
      debilitated: 0,
      neutral: 0,
      modernLabels: 0,
      scoreTotal: 0,
      strongest: [],
      weakest: [],
      text: 'Базовые достоинства не рассчитаны.',
    };
  }

  const dignified = validResults.filter(hasClassicalDignity).length;
  const debilitated = validResults.filter(hasClassicalDebility).length;
  const modernLabels = validResults.filter((result) => result.dignities.modernRulership).length;
  const neutral = validResults.filter(
    (result) => !hasClassicalDignity(result) && !hasClassicalDebility(result) && !result.dignities.modernRulership,
  ).length;
  const scoreTotal = validResults.reduce((total, result) => total + result.score, 0);

  return {
    total: validResults.length,
    dignified,
    debilitated,
    neutral,
    modernLabels,
    scoreTotal,
    strongest: summarizeExtremes(validResults, 'strongest'),
    weakest: summarizeExtremes(validResults, 'weakest'),
    text: buildSummaryText(dignified, debilitated),
  };
}

export function isValidDignityPlanet(planet) {
  return Boolean(
    isPlainObject(planet)
      && CANONICAL_PLANET_ORDER.includes(normalizeText(planet.key))
      && normalizeText(planet.label)
      && resolvePlanetSignKey(planet),
  );
}

export function resolvePlanetSignKey(planet) {
  if (!isPlainObject(planet)) {
    return null;
  }

  const explicitSignKey = normalizeText(planet.sign?.key);

  if (Object.hasOwn(SIGN_BY_KEY, explicitSignKey)) {
    return explicitSignKey;
  }

  if (Number.isFinite(planet.longitude)) {
    return getZodiacSign(planet.longitude)?.key ?? null;
  }

  return null;
}

export function getEssentialDignityLabels(result) {
  if (!isDignityResult(result)) {
    return [];
  }

  return [
    result.dignities.domicile ? DIGNITY_LABELS.domicile : '',
    result.dignities.detriment ? DIGNITY_LABELS.detriment : '',
    result.dignities.exaltation ? DIGNITY_LABELS.exaltation : '',
    result.dignities.fall ? DIGNITY_LABELS.fall : '',
  ].filter(Boolean);
}

export function getEssentialDignityScore(result) {
  if (!isDignityResult(result)) {
    return ESSENTIAL_DIGNITY_SCORE_MODEL.neutral;
  }

  return [
    result.dignities.domicile ? ESSENTIAL_DIGNITY_SCORE_MODEL.domicile : 0,
    result.dignities.exaltation ? ESSENTIAL_DIGNITY_SCORE_MODEL.exaltation : 0,
    result.dignities.detriment ? ESSENTIAL_DIGNITY_SCORE_MODEL.detriment : 0,
    result.dignities.fall ? ESSENTIAL_DIGNITY_SCORE_MODEL.fall : 0,
    result.dignities.modernRulership ? ESSENTIAL_DIGNITY_SCORE_MODEL.modernRulership : 0,
  ].reduce((total, score) => total + score, 0);
}

function hasTableMatch(table, planetKey, signKey) {
  return Array.isArray(table[planetKey]) && table[planetKey].includes(signKey);
}

function compareByPlanetOrder(a, b) {
  return CANONICAL_PLANET_ORDER.indexOf(a.planetKey) - CANONICAL_PLANET_ORDER.indexOf(b.planetKey);
}

function summarizeExtremes(results, type) {
  const candidates = results.filter((result) => (type === 'strongest' ? result.score > 0 : result.score < 0));

  if (candidates.length === 0) {
    return [];
  }

  const targetScore = type === 'strongest'
    ? Math.max(...candidates.map((result) => result.score))
    : Math.min(...candidates.map((result) => result.score));

  return candidates
    .filter((result) => result.score === targetScore)
    .map((result) => ({
      planetKey: result.planetKey,
      planetLabel: result.planetLabel,
      score: result.score,
      labels: [...result.labels],
    }));
}

function buildSummaryText(dignified, debilitated) {
  if (dignified === 0 && debilitated === 0) {
    return 'Ярко выраженных базовых достоинств или слабостей не найдено.';
  }

  return `${dignified} ${pluralize(dignified, 'достоинство', 'достоинства', 'достоинств')} · ${debilitated} ${pluralize(debilitated, 'слабость', 'слабости', 'слабостей')}`;
}

function hasClassicalDignity(result) {
  return Boolean(result.dignities.domicile || result.dignities.exaltation);
}

function hasClassicalDebility(result) {
  return Boolean(result.dignities.detriment || result.dignities.fall);
}

function isDignityResult(result) {
  return Boolean(
    isPlainObject(result)
      && isPlainObject(result.dignities)
      && Number.isFinite(result.score ?? 0),
  );
}

function pluralize(count, one, few, many) {
  const abs = Math.abs(count);
  const lastTwo = abs % 100;
  const last = abs % 10;

  if (lastTwo >= 11 && lastTwo <= 14) {
    return many;
  }

  if (last === 1) {
    return one;
  }

  if (last >= 2 && last <= 4) {
    return few;
  }

  return many;
}

function normalizeText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}
