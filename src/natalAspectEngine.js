import { MAJOR_ASTRO_ASPECTS, getAngularDistance } from './astroMath.js';

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

const PLANET_ORDER_INDEX = new Map(CANONICAL_PLANET_ORDER.map((key, index) => [key, index]));
const LUMINARY_KEYS = new Set(['sun', 'moon']);
const PERSONAL_WITHOUT_LUMINARIES_KEYS = new Set(['mercury', 'venus', 'mars']);
const SOCIAL_KEYS = new Set(['jupiter', 'saturn']);
const OUTER_KEYS = new Set(['uranus', 'neptune', 'pluto']);
const HARD_ASPECT_KEYS = new Set(['conjunction', 'opposition', 'square']);

const ASPECT_BASE_CAPS = Object.freeze({
  conjunction: 8,
  opposition: 8,
  square: 7,
  trine: 7,
  sextile: 5,
});

const BODY_PAIR_CAPS = Object.freeze({
  luminary: 8,
  personalWithoutLuminaries: 6,
  socialOrOuterInvolved: 5,
  outerOnly: 3,
});

const STRENGTH_BANDS = Object.freeze({
  exact: 1,
  strong: 3,
  medium: 5,
});

const ORB_SIMILARITY_THRESHOLD = 0.5;

export function getNatalAspectDefinitions() {
  return MAJOR_ASTRO_ASPECTS.map(copyAspectDefinition);
}

export function getNatalAspectOrbPolicy() {
  return {
    aspectBaseCaps: { ...ASPECT_BASE_CAPS },
    bodyPairCaps: { ...BODY_PAIR_CAPS },
    strengthBands: { ...STRENGTH_BANDS },
    finalAllowedOrb: 'min(aspectBaseOrb, bodyPairOrb)',
  };
}

export function getBodyPairOrbCap(bodyAKey, bodyBKey) {
  if (!isKnownBodyKey(bodyAKey) || !isKnownBodyKey(bodyBKey)) {
    return null;
  }

  if (OUTER_KEYS.has(bodyAKey) && OUTER_KEYS.has(bodyBKey)) {
    return BODY_PAIR_CAPS.outerOnly;
  }

  if (LUMINARY_KEYS.has(bodyAKey) || LUMINARY_KEYS.has(bodyBKey)) {
    return BODY_PAIR_CAPS.luminary;
  }

  if (
    PERSONAL_WITHOUT_LUMINARIES_KEYS.has(bodyAKey)
    && PERSONAL_WITHOUT_LUMINARIES_KEYS.has(bodyBKey)
  ) {
    return BODY_PAIR_CAPS.personalWithoutLuminaries;
  }

  if (
    SOCIAL_KEYS.has(bodyAKey)
    || SOCIAL_KEYS.has(bodyBKey)
    || OUTER_KEYS.has(bodyAKey)
    || OUTER_KEYS.has(bodyBKey)
  ) {
    return BODY_PAIR_CAPS.socialOrOuterInvolved;
  }

  return null;
}

export function getAllowedNatalAspectOrb(aspectKey, bodyAKey, bodyBKey) {
  const aspectBaseOrb = ASPECT_BASE_CAPS[aspectKey];
  const bodyPairOrb = getBodyPairOrbCap(bodyAKey, bodyBKey);

  if (!Number.isFinite(aspectBaseOrb) || !Number.isFinite(bodyPairOrb)) {
    return null;
  }

  return Math.min(aspectBaseOrb, bodyPairOrb);
}

export function getNatalAspectStrength(orb) {
  if (!Number.isFinite(orb) || orb < 0) {
    return null;
  }

  if (orb <= STRENGTH_BANDS.exact) {
    return 'exact';
  }

  if (orb <= STRENGTH_BANDS.strong) {
    return 'strong';
  }

  if (orb <= STRENGTH_BANDS.medium) {
    return 'medium';
  }

  return 'weak';
}

export function calculateNatalAspectBetween(planetA, planetB) {
  if (!isValidNatalAspectPlanet(planetA) || !isValidNatalAspectPlanet(planetB)) {
    return null;
  }

  if (planetA.key === planetB.key) {
    return null;
  }

  const [bodyA, bodyB] = orderPlanetPair(planetA, planetB);
  const angle = getAngularDistance(bodyA.longitude, bodyB.longitude);

  if (angle === null) {
    return null;
  }

  const match = getNatalAspectDefinitions()
    .map((aspect) => {
      const orb = Math.abs(angle - aspect.exactAngle);
      const allowedOrb = getAllowedNatalAspectOrb(aspect.key, bodyA.key, bodyB.key);

      return {
        aspect,
        orb,
        allowedOrb,
      };
    })
    .filter((candidate) => Number.isFinite(candidate.allowedOrb) && candidate.orb <= candidate.allowedOrb)
    .sort((a, b) => a.orb - b.orb || a.aspect.exactAngle - b.aspect.exactAngle)[0];

  if (!match) {
    return null;
  }

  return {
    bodyA: toAspectBody(bodyA),
    bodyB: toAspectBody(bodyB),
    aspect: copyAspectDefinition(match.aspect),
    angle,
    orb: match.orb,
    orbText: formatAspectOrb(match.orb),
    allowedOrb: match.allowedOrb,
    strength: getNatalAspectStrength(match.orb),
    applying: null,
    separating: null,
    source: 'natal-aspect-engine',
  };
}

export function calculateNatalAspects(planets) {
  if (!Array.isArray(planets)) {
    return [];
  }

  const uniquePlanets = uniqueValidPlanets(planets);
  const aspects = [];

  for (let indexA = 0; indexA < uniquePlanets.length; indexA += 1) {
    for (let indexB = indexA + 1; indexB < uniquePlanets.length; indexB += 1) {
      const aspect = calculateNatalAspectBetween(uniquePlanets[indexA], uniquePlanets[indexB]);

      if (aspect) {
        aspects.push(aspect);
      }
    }
  }

  return aspects.sort(compareNatalAspects);
}

export function isValidNatalAspectPlanet(planet) {
  return Boolean(
    planet
      && typeof planet === 'object'
      && !Array.isArray(planet)
      && isKnownBodyKey(planet.key)
      && typeof planet.label === 'string'
      && planet.label.trim()
      && Number.isFinite(planet.longitude),
  );
}

export function formatAspectOrb(orb) {
  if (!Number.isFinite(orb) || orb < 0) {
    return '';
  }

  const degrees = Math.floor(orb);
  const minutes = Math.floor((orb - degrees) * 60);

  return `${degrees}°${String(minutes).padStart(2, '0')}′`;
}

function uniqueValidPlanets(planets) {
  const byKey = new Map();

  planets
    .filter(isValidNatalAspectPlanet)
    .sort((a, b) => planetOrder(a.key) - planetOrder(b.key))
    .forEach((planet) => {
      if (!byKey.has(planet.key)) {
        byKey.set(planet.key, planet);
      }
    });

  return [...byKey.values()];
}

function compareNatalAspects(a, b) {
  const orbDelta = a.orb - b.orb;

  if (Math.abs(orbDelta) > ORB_SIMILARITY_THRESHOLD) {
    return orbDelta;
  }

  const luminaryDelta = aspectHasLuminary(b) - aspectHasLuminary(a);

  if (luminaryDelta !== 0) {
    return luminaryDelta;
  }

  const hardDelta = aspectIsHard(b) - aspectIsHard(a);

  if (hardDelta !== 0) {
    return hardDelta;
  }

  return planetOrder(a.bodyA.key) - planetOrder(b.bodyA.key)
    || planetOrder(a.bodyB.key) - planetOrder(b.bodyB.key)
    || a.orb - b.orb
    || a.aspect.exactAngle - b.aspect.exactAngle;
}

function aspectHasLuminary(aspect) {
  return Number(LUMINARY_KEYS.has(aspect.bodyA.key) || LUMINARY_KEYS.has(aspect.bodyB.key));
}

function aspectIsHard(aspect) {
  return Number(HARD_ASPECT_KEYS.has(aspect.aspect.key));
}

function orderPlanetPair(planetA, planetB) {
  return planetOrder(planetA.key) <= planetOrder(planetB.key)
    ? [planetA, planetB]
    : [planetB, planetA];
}

function toAspectBody(planet) {
  return {
    key: planet.key,
    label: planet.label.trim(),
  };
}

function copyAspectDefinition(aspect) {
  return {
    key: aspect.key,
    ru: aspect.ru,
    symbol: aspect.symbol,
    exactAngle: aspect.exactAngle,
  };
}

function isKnownBodyKey(key) {
  return PLANET_ORDER_INDEX.has(key);
}

function planetOrder(key) {
  return PLANET_ORDER_INDEX.get(key) ?? Number.POSITIVE_INFINITY;
}
