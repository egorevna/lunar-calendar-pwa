export const ESSENTIAL_DIGNITY_TYPES = Object.freeze({
  DOMICILE: 'domicile',
  DETRIMENT: 'detriment',
  EXALTATION: 'exaltation',
  FALL: 'fall',
  MODERN_RULERSHIP: 'modernRulership',
});

export const ESSENTIAL_DIGNITY_SOURCE = Object.freeze({
  key: 'essential-dignities-v1',
  scoringBaseline: 'classical-traditional-seven-planets',
  modernOuterPlanets: 'label-only',
  exaltationDegrees: 'deferred',
  terms: 'deferred',
  decans: 'deferred',
  degreeRulers: 'deferred',
  vronskyTables: 'deferred-pending-manual-verification',
});

export const TRADITIONAL_PLANET_KEYS = Object.freeze([
  'sun',
  'moon',
  'mercury',
  'venus',
  'mars',
  'jupiter',
  'saturn',
]);

export const MODERN_OUTER_PLANET_KEYS = Object.freeze([
  'uranus',
  'neptune',
  'pluto',
]);

export const CLASSICAL_RULERSHIPS = freezeTable({
  sun: ['leo'],
  moon: ['cancer'],
  mercury: ['gemini', 'virgo'],
  venus: ['taurus', 'libra'],
  mars: ['aries', 'scorpio'],
  jupiter: ['sagittarius', 'pisces'],
  saturn: ['capricorn', 'aquarius'],
});

export const CLASSICAL_DETRIMENTS = freezeTable({
  sun: ['aquarius'],
  moon: ['capricorn'],
  mercury: ['sagittarius', 'pisces'],
  venus: ['scorpio', 'aries'],
  mars: ['libra', 'taurus'],
  jupiter: ['gemini', 'virgo'],
  saturn: ['cancer', 'leo'],
});

export const CLASSICAL_EXALTATIONS = freezeTable({
  sun: ['aries'],
  moon: ['taurus'],
  mercury: ['virgo'],
  venus: ['pisces'],
  mars: ['capricorn'],
  jupiter: ['cancer'],
  saturn: ['libra'],
});

export const CLASSICAL_FALLS = freezeTable({
  sun: ['libra'],
  moon: ['scorpio'],
  mercury: ['pisces'],
  venus: ['virgo'],
  mars: ['cancer'],
  jupiter: ['capricorn'],
  saturn: ['aries'],
});

export const MODERN_RULERSHIP_LABELS = freezeTable({
  uranus: ['aquarius'],
  neptune: ['pisces'],
  pluto: ['scorpio'],
});

export const ESSENTIAL_DIGNITY_SCORE_MODEL = Object.freeze({
  domicile: 5,
  exaltation: 4,
  detriment: -5,
  fall: -4,
  neutral: 0,
  modernRulership: 0,
});

const DEFERRED_DIGNITY_FEATURES = Object.freeze([
  'terms',
  'decans',
  'degreeRulers',
  'exactExaltationDegrees',
  'VronskyStrengthTables',
  'fixedStars',
  'houses',
  'ASC/MC',
  'transits',
  'interpretations',
  'ritualScoring',
]);

const ESSENTIAL_DIGNITY_DATASET = Object.freeze({
  source: ESSENTIAL_DIGNITY_SOURCE,
  dignityTypes: ESSENTIAL_DIGNITY_TYPES,
  traditionalPlanets: TRADITIONAL_PLANET_KEYS,
  modernOuterPlanets: MODERN_OUTER_PLANET_KEYS,
  rulerships: CLASSICAL_RULERSHIPS,
  detriments: CLASSICAL_DETRIMENTS,
  exaltations: CLASSICAL_EXALTATIONS,
  falls: CLASSICAL_FALLS,
  modernRulershipLabels: MODERN_RULERSHIP_LABELS,
  scoreModel: ESSENTIAL_DIGNITY_SCORE_MODEL,
  deferredFeatures: DEFERRED_DIGNITY_FEATURES,
});

export function getEssentialDignityDataset() {
  return ESSENTIAL_DIGNITY_DATASET;
}

export function isTraditionalDignityPlanet(planetKey) {
  return TRADITIONAL_PLANET_KEYS.includes(planetKey);
}

export function isModernOuterPlanet(planetKey) {
  return MODERN_OUTER_PLANET_KEYS.includes(planetKey);
}

export function getDeferredDignityFeatures() {
  return [...DEFERRED_DIGNITY_FEATURES];
}

function freezeTable(table) {
  return Object.freeze(
    Object.fromEntries(
      Object.entries(table).map(([planetKey, signKeys]) => [
        planetKey,
        Object.freeze([...signKeys]),
      ]),
    ),
  );
}
