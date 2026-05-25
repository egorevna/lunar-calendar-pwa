import { getZodiacSign, normalizeDegrees } from './astroMath.js';
import { calculateHousesForSelectedSystem } from './houseSystemResolver.js';
import { getNatalPlanetsForProfile } from './natalPlanetsForProfile.js';
import { getWholeSignHouseForSign } from './wholeSignHouses.js';

const READY_STATUS = 'ready';
const INVALID_STATUS = 'invalid';
const NOT_READY_STATUS = 'notReady';
const UNSUPPORTED_STATUS = 'unsupported';
const HOUSE_SYSTEMS_WITH_CUSPS = Object.freeze(['equal-house', 'placidus']);
const WHOLE_SIGN = 'whole-sign';
const EMPTY_ARRAY = Object.freeze([]);

const MESSAGES = Object.freeze({
  invalidHouseResult: 'Сначала нужен готовый результат домов.',
  unsupportedHouseSystem: 'Выбранная система домов пока не поддержана для распределения планет.',
  missingPlanets: 'Сначала нужен расчет натальных планет.',
  natalPlanetsNotReady: 'Сначала нужен расчет натальных планет.',
  missingPlanetSign: 'Для Whole Sign нужен знак планеты.',
  invalidPlanetSign: 'Знак планеты некорректен.',
  missingPlanetLongitude: 'Для выбранной системы домов нужна долгота планеты.',
  invalidPlanetLongitude: 'Долгота планеты некорректна.',
  houseSpanNotFound: 'Дом для планеты не найден безопасно.',
});

export function assignPlanetToHouse(planet = null, houseResult = null) {
  const houseReadiness = getHouseResultReadiness(houseResult);
  const planetInfo = getSafePlanetInfo(planet);

  if (!houseReadiness.ready) {
    return Object.freeze({
      status: houseReadiness.status,
      planetKey: planetInfo.planetKey,
      planetLabel: planetInfo.planetLabel,
      houseSystem: houseReadiness.houseSystem,
      houseNumber: null,
      houseLabel: null,
      reason: houseReadiness.reason,
      message: houseReadiness.message,
    });
  }

  const houseSystem = houseReadiness.houseSystem;
  const position = resolvePlanetHouseInput(planet, houseSystem);

  if (position.status !== READY_STATUS) {
    return invalidAssignment({
      planetKey: position.planetKey,
      planetLabel: position.planetLabel,
      houseSystem,
      reason: position.reason,
      message: position.message,
    });
  }

  if (houseSystem === WHOLE_SIGN) {
    return assignWholeSignPlanet(position, houseResult);
  }

  if (HOUSE_SYSTEMS_WITH_CUSPS.includes(houseSystem)) {
    return assignCuspBasedPlanet(position, houseResult);
  }

  return invalidAssignment({
    planetKey: position.planetKey,
    planetLabel: position.planetLabel,
    houseSystem,
    reason: 'unsupportedHouseSystem',
    message: MESSAGES.unsupportedHouseSystem,
  });
}

export function assignPlanetsToHouses(planets = [], houseResult = null) {
  const houseReadiness = getHouseResultReadiness(houseResult);

  if (!houseReadiness.ready) {
    return unavailableAssignmentResult({
      status: houseReadiness.status,
      houseSystem: houseReadiness.houseSystem,
      houseSystemLabel: houseReadiness.houseSystemLabel,
      reason: houseReadiness.reason,
      message: houseReadiness.message,
    });
  }

  if (!Array.isArray(planets)) {
    return unavailableAssignmentResult({
      status: NOT_READY_STATUS,
      houseSystem: houseReadiness.houseSystem,
      houseSystemLabel: houseReadiness.houseSystemLabel,
      reason: 'missingPlanets',
      message: MESSAGES.missingPlanets,
    });
  }

  const assignments = freezeArray(planets.map((planet) => assignPlanetToHouse(planet, houseResult)));
  const summary = getPlanetInHouseSummary(assignments);

  return Object.freeze({
    status: READY_STATUS,
    ready: true,
    houseSystem: houseReadiness.houseSystem,
    houseSystemLabel: houseReadiness.houseSystemLabel,
    total: assignments.length,
    readyCount: summary.ready,
    invalidCount: summary.invalid,
    assignments,
    summary,
    capabilities: getPlanetInHouseCapabilities(),
  });
}

export function assignPlanetsToHousesForProfile(profile = null, options = {}) {
  const natalPlanets = getNatalPlanetsForProfile(profile);

  if (natalPlanets.status !== READY_STATUS || !Array.isArray(natalPlanets.planets) || natalPlanets.planets.length === 0) {
    return unavailableAssignmentResult({
      status: NOT_READY_STATUS,
      houseSystem: null,
      houseSystemLabel: null,
      reason: 'natalPlanetsNotReady',
      message: MESSAGES.natalPlanetsNotReady,
    });
  }

  const houseResult = calculateHousesForSelectedSystem(profile, options);

  if (houseResult.status !== READY_STATUS || houseResult.ready !== true) {
    return unavailableAssignmentResult({
      status: houseResult.status || NOT_READY_STATUS,
      houseSystem: houseResult.houseSystem ?? houseResult.selectedHouseSystem ?? null,
      houseSystemLabel: houseResult.houseSystemLabel ?? null,
      selectedHouseSystem: houseResult.selectedHouseSystem ?? null,
      selectionSource: houseResult.selectionSource ?? null,
      defaulted: houseResult.defaulted ?? false,
      reason: houseResult.reason ?? 'invalidHouseResult',
      message: houseResult.message ?? MESSAGES.invalidHouseResult,
    });
  }

  const assignmentResult = assignPlanetsToHouses(natalPlanets.planets, houseResult);

  return Object.freeze({
    ...assignmentResult,
    selectedHouseSystem: houseResult.selectedHouseSystem ?? assignmentResult.houseSystem,
    selectionSource: houseResult.selectionSource ?? null,
    defaulted: houseResult.defaulted ?? false,
    source: 'selected-house-system-router',
  });
}

export function findHouseForLongitude(longitude, houses = []) {
  if (!Array.isArray(houses) || houses.length === 0) {
    return null;
  }

  return houses.find((house) => {
    const cuspLongitude = getHouseCuspLongitude(house);
    const nextCuspLongitude = house?.nextCuspLongitude;

    return isLongitudeInHouseSpan(longitude, cuspLongitude, nextCuspLongitude);
  }) ?? null;
}

export function isLongitudeInHouseSpan(longitude, cuspLongitude, nextCuspLongitude) {
  const normalized = normalizeDegrees(longitude);
  const start = normalizeDegrees(cuspLongitude);
  const end = normalizeDegrees(nextCuspLongitude);

  if (normalized === null || start === null || end === null || start === end) {
    return false;
  }

  if (start < end) {
    return normalized >= start && normalized < end;
  }

  return normalized >= start || normalized < end;
}

export function resolvePlanetHouseInput(planet = null, houseSystem = null) {
  const planetInfo = getSafePlanetInfo(planet);

  if (!planet || typeof planet !== 'object') {
    return invalidPlanetInput(planetInfo, houseSystem, 'missingPlanetLongitude');
  }

  if (houseSystem === WHOLE_SIGN) {
    const signKey = normalizeSignKey(planet.sign?.key);

    if (signKey) {
      return Object.freeze({
        status: READY_STATUS,
        ...planetInfo,
        signKey,
        longitude: normalizeDegrees(planet.longitude),
      });
    }

    const longitude = normalizeDegrees(planet.longitude);

    if (longitude === null) {
      return invalidPlanetInput(planetInfo, houseSystem, 'missingPlanetSign');
    }

    const sign = getZodiacSign(longitude);

    if (!sign) {
      return invalidPlanetInput(planetInfo, houseSystem, 'invalidPlanetSign');
    }

    return Object.freeze({
      status: READY_STATUS,
      ...planetInfo,
      signKey: sign.key,
      longitude,
    });
  }

  if (HOUSE_SYSTEMS_WITH_CUSPS.includes(houseSystem)) {
    if (planet.longitude === undefined || planet.longitude === null) {
      return invalidPlanetInput(planetInfo, houseSystem, 'missingPlanetLongitude');
    }

    const longitude = normalizeDegrees(planet.longitude);

    if (longitude === null) {
      return invalidPlanetInput(planetInfo, houseSystem, 'invalidPlanetLongitude');
    }

    return Object.freeze({
      status: READY_STATUS,
      ...planetInfo,
      signKey: normalizeSignKey(planet.sign?.key),
      longitude,
    });
  }

  return invalidPlanetInput(planetInfo, houseSystem, 'unsupportedHouseSystem');
}

export function getPlanetInHouseSummary(assignments = []) {
  const safeAssignments = Array.isArray(assignments) ? assignments : [];
  const byHouse = {};
  let ready = 0;
  let invalid = 0;

  safeAssignments.forEach((assignment) => {
    if (assignment?.status === READY_STATUS && Number.isInteger(assignment.houseNumber)) {
      ready += 1;
      byHouse[assignment.houseNumber] = (byHouse[assignment.houseNumber] ?? 0) + 1;
    } else if (assignment?.status === INVALID_STATUS) {
      invalid += 1;
    }
  });

  return Object.freeze({
    total: safeAssignments.length,
    ready,
    invalid,
    byHouse: Object.freeze(byHouse),
    text: ready > 0 ? 'Планеты распределены по домам' : 'Планеты по домам пока недоступны',
  });
}

export function getPlanetInHouseCapabilities() {
  return Object.freeze({
    planetInHouse: true,
    wholeSign: true,
    equalHouse: true,
    placidus: true,
    selectedHouseSystem: true,
    interpretations: false,
    transits: false,
    fixedStars: false,
    ritualScoring: false,
  });
}

export function getPlanetInHouseLimitations() {
  return Object.freeze([
    'Планеты распределяются по выбранной системе домов профиля.',
    'Whole Sign использует знак планеты относительно знака ASC.',
    'Равнодомная и Placidus используют долготу планеты относительно куспидов.',
    'Этот модуль не добавляет интерпретации.',
  ]);
}

function assignWholeSignPlanet(position, houseResult) {
  const ascSignKey = getWholeSignAscSignKey(houseResult);
  const houseNumber = getWholeSignHouseForSign(ascSignKey, position.signKey);

  if (!Number.isInteger(houseNumber)) {
    return invalidAssignment({
      planetKey: position.planetKey,
      planetLabel: position.planetLabel,
      houseSystem: WHOLE_SIGN,
      reason: 'houseSpanNotFound',
      message: MESSAGES.houseSpanNotFound,
    });
  }

  return readyAssignment(position, WHOLE_SIGN, houseNumber);
}

function assignCuspBasedPlanet(position, houseResult) {
  const house = findHouseForLongitude(position.longitude, houseResult.houses);

  if (!house || !Number.isInteger(house.number)) {
    return invalidAssignment({
      planetKey: position.planetKey,
      planetLabel: position.planetLabel,
      houseSystem: houseResult.houseSystem,
      reason: 'houseSpanNotFound',
      message: MESSAGES.houseSpanNotFound,
    });
  }

  return readyAssignment(position, houseResult.houseSystem, house.number, house);
}

function readyAssignment(position, houseSystem, houseNumber, house = null) {
  const houseLabel = house?.label ?? `${houseNumber} дом`;

  return Object.freeze({
    status: READY_STATUS,
    planetKey: position.planetKey,
    planetLabel: position.planetLabel,
    houseSystem,
    houseNumber,
    houseLabel,
    house: Object.freeze({
      number: houseNumber,
      label: houseLabel,
    }),
    source: 'house-system-result',
  });
}

function invalidAssignment({ planetKey, planetLabel, houseSystem, reason, message }) {
  return Object.freeze({
    status: INVALID_STATUS,
    planetKey,
    planetLabel,
    houseSystem,
    houseNumber: null,
    houseLabel: null,
    reason,
    message: message || MESSAGES[reason] || MESSAGES.houseSpanNotFound,
  });
}

function invalidPlanetInput(planetInfo, houseSystem, reason) {
  return Object.freeze({
    status: INVALID_STATUS,
    ...planetInfo,
    houseSystem,
    reason,
    message: MESSAGES[reason] || MESSAGES.unsupportedHouseSystem,
  });
}

function unavailableAssignmentResult({
  status,
  houseSystem,
  houseSystemLabel,
  selectedHouseSystem = null,
  selectionSource = null,
  defaulted = false,
  reason,
  message,
}) {
  return Object.freeze({
    status,
    ready: false,
    houseSystem,
    houseSystemLabel,
    selectedHouseSystem,
    selectionSource,
    defaulted,
    reason,
    message,
    total: 0,
    readyCount: 0,
    invalidCount: 0,
    assignments: EMPTY_ARRAY,
    summary: getPlanetInHouseSummary(EMPTY_ARRAY),
    capabilities: getPlanetInHouseCapabilities(),
  });
}

function getHouseResultReadiness(houseResult) {
  if (!houseResult || typeof houseResult !== 'object') {
    return {
      ready: false,
      status: NOT_READY_STATUS,
      houseSystem: null,
      houseSystemLabel: null,
      reason: 'invalidHouseResult',
      message: MESSAGES.invalidHouseResult,
    };
  }

  const houseSystem = houseResult.houseSystem ?? houseResult.selectedHouseSystem ?? null;
  const houseSystemLabel = houseResult.houseSystemLabel ?? null;

  if (houseResult.status === UNSUPPORTED_STATUS) {
    return {
      ready: false,
      status: UNSUPPORTED_STATUS,
      houseSystem,
      houseSystemLabel,
      reason: houseResult.reason ?? 'unsupportedHouseSystem',
      message: houseResult.message ?? MESSAGES.unsupportedHouseSystem,
    };
  }

  if (houseResult.status !== READY_STATUS || houseResult.ready === false) {
    return {
      ready: false,
      status: NOT_READY_STATUS,
      houseSystem,
      houseSystemLabel,
      reason: houseResult.reason ?? 'invalidHouseResult',
      message: houseResult.message ?? MESSAGES.invalidHouseResult,
    };
  }

  if (!isSupportedAssignmentHouseSystem(houseSystem)) {
    return {
      ready: false,
      status: NOT_READY_STATUS,
      houseSystem,
      houseSystemLabel,
      reason: 'unsupportedHouseSystem',
      message: MESSAGES.unsupportedHouseSystem,
    };
  }

  return {
    ready: true,
    status: READY_STATUS,
    houseSystem,
    houseSystemLabel,
    reason: null,
    message: null,
  };
}

function isSupportedAssignmentHouseSystem(houseSystem) {
  return houseSystem === WHOLE_SIGN || HOUSE_SYSTEMS_WITH_CUSPS.includes(houseSystem);
}

function getWholeSignAscSignKey(houseResult) {
  return normalizeSignKey(houseResult?.houses?.[0]?.sign?.key)
    ?? normalizeSignKey(houseResult?.angles?.asc?.sign?.key);
}

function getHouseCuspLongitude(house) {
  return house?.cusp?.longitude ?? house?.longitude ?? null;
}

function normalizeSignKey(signKey) {
  if (typeof signKey !== 'string' || !signKey.trim()) {
    return null;
  }

  const sign = getZodiacSignFromKey(signKey.trim());

  return sign?.key ?? null;
}

function getZodiacSignFromKey(signKey) {
  return getZodiacSignFromLongitudeMap().get(signKey) ?? null;
}

let zodiacSignByKey = null;

function getZodiacSignFromLongitudeMap() {
  if (!zodiacSignByKey) {
    zodiacSignByKey = new Map();

    for (let longitude = 0; longitude < 360; longitude += 30) {
      const sign = getZodiacSign(longitude);

      if (sign) {
        zodiacSignByKey.set(sign.key, sign);
      }
    }
  }

  return zodiacSignByKey;
}

function getSafePlanetInfo(planet) {
  const planetKey = typeof planet?.key === 'string' && planet.key.trim()
    ? planet.key.trim()
    : null;
  const planetLabel = typeof planet?.label === 'string' && planet.label.trim()
    ? planet.label.trim()
    : planetKey;

  return { planetKey, planetLabel };
}

function freezeArray(items) {
  return Object.freeze([...items]);
}
