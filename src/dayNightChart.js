import { normalizeDegrees } from './astroMath.js';
import {
  calculateLocalSiderealDegrees,
  calculateMeanObliquityDegrees,
} from './ascMc.js';
import { createBirthDateTimeInput } from './birthDateTime.js';
import {
  evaluateHousesInputReadiness,
  getHousesInputFallbackMessage,
} from './housesInputGuardrails.js';
import { getNatalPlanetsForProfile } from './natalPlanetsForProfile.js';

const READY_STATUS = 'ready';
const NOT_READY_STATUS = 'notReady';
const INVALID_STATUS = 'invalid';
const BOUNDARY_STATUS = 'boundary';
const METHOD = 'sun-altitude-geometric';
const DEFAULT_BOUNDARY_TOLERANCE_DEGREES = 0.01;

const MESSAGES = Object.freeze({
  missingSunLongitude: 'Для определения дневной/ночной карты нужна долгота Солнца.',
  sunPositionNotReady: 'Для определения дневной/ночной карты нужен расчет Солнца.',
  invalidDateTime: 'UTC-момент рождения некорректен.',
  missingUtcDateTime: 'Для определения дневной/ночной карты нужен UTC-момент рождения.',
  invalidCoordinates: 'Координаты места рождения должны быть корректными числами.',
  invalidSunAltitude: 'Высота Солнца над горизонтом некорректна.',
  calculationError: 'Дневную/ночную карту не удалось определить безопасно.',
  sunOnHorizonBoundary: 'Солнце находится слишком близко к горизонту.',
});

export function calculateSunAltitudeFromLocalSidereal(input = {}) {
  const localSiderealDegrees = toFiniteNumber(input.localSiderealDegrees);
  const latitude = toFiniteNumber(input.latitude);
  const obliquityDegrees = toFiniteNumber(input.obliquityDegrees);
  const sunLongitude = normalizeDegrees(input.sunLongitude);

  if (
    localSiderealDegrees === null
    || latitude === null
    || obliquityDegrees === null
    || sunLongitude === null
    || latitude < -90
    || latitude > 90
  ) {
    return invalidResult('invalidSunAltitude', { method: METHOD });
  }

  const sunEquatorial = eclipticLongitudeToEquatorial({
    longitude: sunLongitude,
    obliquityDegrees,
  });

  if (!sunEquatorial) {
    return invalidResult('invalidSunAltitude', { method: METHOD });
  }

  const hourAngle = signedDegrees(normalizeDegrees(localSiderealDegrees - sunEquatorial.rightAscensionDegrees));
  const altitudeDegrees = radiansToDegrees(Math.asin(clamp(
    (Math.sin(degreesToRadians(latitude)) * Math.sin(degreesToRadians(sunEquatorial.declinationDegrees)))
      + (Math.cos(degreesToRadians(latitude))
        * Math.cos(degreesToRadians(sunEquatorial.declinationDegrees))
        * Math.cos(degreesToRadians(hourAngle))),
    -1,
    1,
  )));

  return Object.freeze({
    status: READY_STATUS,
    altitudeDegrees,
    method: METHOD,
  });
}

export function classifyChartSectFromSunAltitude(altitudeDegrees, options = {}) {
  const altitude = toFiniteNumber(altitudeDegrees);
  const tolerance = Number.isFinite(options.boundaryToleranceDegrees)
    ? Math.abs(options.boundaryToleranceDegrees)
    : DEFAULT_BOUNDARY_TOLERANCE_DEGREES;

  if (altitude === null) {
    return invalidResult('invalidSunAltitude');
  }

  if (altitude > tolerance) {
    return chartSectResult('day');
  }

  if (altitude < -tolerance) {
    return chartSectResult('night');
  }

  return Object.freeze({
    status: BOUNDARY_STATUS,
    ready: false,
    chartSect: null,
    dayChart: false,
    nightChart: false,
    boundary: true,
    reason: 'sunOnHorizonBoundary',
    message: MESSAGES.sunOnHorizonBoundary,
    boundaryToleranceDegrees: tolerance,
  });
}

export function calculateDayNightChartStatus(input = {}, options = {}) {
  const dateResolution = resolveUtcDateInput(input);

  if (!dateResolution.ok) {
    return invalidResult(dateResolution.reason);
  }

  if (!isValidCoordinateInput(input)) {
    return invalidResult('invalidCoordinates');
  }

  const sunLongitude = normalizeDegrees(input.sunLongitude);

  if (sunLongitude === null) {
    return notReadyResult('missingSunLongitude');
  }

  try {
    const localSiderealDegrees = calculateLocalSiderealDegrees(dateResolution.date, input.longitude);
    const obliquityDegrees = calculateMeanObliquityDegrees(dateResolution.date);
    const altitude = calculateSunAltitudeFromLocalSidereal({
      localSiderealDegrees,
      latitude: input.latitude,
      obliquityDegrees,
      sunLongitude,
    });

    if (altitude.status !== READY_STATUS) {
      return invalidResult('calculationError');
    }

    const classification = classifyChartSectFromSunAltitude(
      altitude.altitudeDegrees,
      options,
    );

    return Object.freeze({
      status: classification.status,
      ready: classification.status === READY_STATUS,
      chartSect: classification.chartSect,
      dayChart: classification.dayChart,
      nightChart: classification.nightChart,
      boundary: classification.boundary,
      reason: classification.reason ?? null,
      message: classification.message ?? null,
      method: METHOD,
      sunAltitudeDegrees: altitude.altitudeDegrees,
      boundaryToleranceDegrees: classification.boundaryToleranceDegrees
        ?? getBoundaryTolerance(options),
      calculation: Object.freeze({
        siderealTimeSource: 'astronomy-engine SiderealTime (GAST)',
        obliquitySource: 'mean-obliquity-approximation',
        coordinateConvention: 'east-positive-longitude',
      }),
      limitations: getDayNightChartLimitations(),
      capabilities: getDayNightChartCapabilities(),
    });
  } catch {
    return invalidResult('calculationError');
  }
}

export function calculateDayNightChartStatusForProfile(profile = null, options = {}) {
  const readiness = evaluateHousesInputReadiness(profile);

  if (!readiness.ready) {
    return notReadyResult(readiness.reason, readiness.message);
  }

  const birthInput = createBirthDateTimeInput(profile);

  if (!birthInput.canConvertToUtc || !birthInput.utcDateTime) {
    return notReadyResult('invalidDateTime', MESSAGES.invalidDateTime);
  }

  const coordinates = getProfileCoordinatePair(profile);

  if (!coordinates.ok) {
    return notReadyResult(coordinates.reason, getHousesInputFallbackMessage(coordinates.reason));
  }

  const natalPlanets = isPlainObject(options.natalPlanetsResult)
    ? options.natalPlanetsResult
    : getNatalPlanetsForProfile(profile);
  const sunLongitude = getSunLongitudeFromNatalPlanets(natalPlanets);

  if (sunLongitude === null) {
    return notReadyResult('sunPositionNotReady');
  }

  const result = calculateDayNightChartStatus({
    utcDateTime: birthInput.utcDateTime,
    latitude: coordinates.latitude,
    longitude: coordinates.longitude,
    sunLongitude,
  }, options);

  return Object.freeze({
    ...result,
    source: 'profile-natal-sun',
  });
}

export function getChartSectLabel(chartSect) {
  if (chartSect === 'day') {
    return 'Дневная карта';
  }

  if (chartSect === 'night') {
    return 'Ночная карта';
  }

  if (chartSect === 'boundary') {
    return 'На границе дня и ночи';
  }

  return 'Недоступно';
}

export function getDayNightChartCapabilities() {
  return Object.freeze({
    dayNightStatus: true,
    sunAltitudeGeometry: true,
    dayChart: true,
    nightChart: true,
    boundaryStatus: true,
    parsFortuna: false,
    arabicParts: false,
    interpretations: false,
    transits: false,
    fixedStars: false,
  });
}

export function getDayNightChartLimitations() {
  return Object.freeze([
    'Дневная/ночная карта определяется по положению Солнца относительно горизонта.',
    'Для расчета нужны точное время рождения, координаты и положение Солнца.',
    'Если Солнце находится на горизонте, статус считается пограничным.',
    'Этот модуль не рассчитывает Pars Fortuna или арабские части.',
  ]);
}

function eclipticLongitudeToEquatorial({ longitude, obliquityDegrees }) {
  const lambda = degreesToRadians(longitude);
  const epsilon = degreesToRadians(obliquityDegrees);
  const rightAscensionDegrees = normalizeDegrees(radiansToDegrees(
    Math.atan2(Math.sin(lambda) * Math.cos(epsilon), Math.cos(lambda)),
  ));
  const declinationDegrees = radiansToDegrees(Math.asin(clamp(
    Math.sin(lambda) * Math.sin(epsilon),
    -1,
    1,
  )));

  if (rightAscensionDegrees === null || !Number.isFinite(declinationDegrees)) {
    return null;
  }

  return Object.freeze({
    rightAscensionDegrees,
    declinationDegrees,
  });
}

function chartSectResult(chartSect) {
  return Object.freeze({
    status: READY_STATUS,
    ready: true,
    chartSect,
    dayChart: chartSect === 'day',
    nightChart: chartSect === 'night',
    boundary: false,
    reason: null,
    message: null,
  });
}

function notReadyResult(reason, message = null) {
  return Object.freeze({
    status: NOT_READY_STATUS,
    ready: false,
    chartSect: null,
    dayChart: false,
    nightChart: false,
    boundary: false,
    reason,
    message: message ?? MESSAGES[reason] ?? MESSAGES.calculationError,
    limitations: getDayNightChartLimitations(),
    capabilities: getDayNightChartCapabilities(),
  });
}

function invalidResult(reason, extras = {}) {
  return Object.freeze({
    status: INVALID_STATUS,
    ready: false,
    chartSect: null,
    dayChart: false,
    nightChart: false,
    boundary: false,
    reason,
    message: MESSAGES[reason] ?? MESSAGES.calculationError,
    ...(extras.method ? { method: extras.method } : {}),
    limitations: getDayNightChartLimitations(),
    capabilities: getDayNightChartCapabilities(),
  });
}

function resolveUtcDateInput(input) {
  if (input?.date instanceof Date) {
    return Number.isFinite(input.date.getTime())
      ? { ok: true, date: new Date(input.date.getTime()) }
      : { ok: false, reason: 'invalidDateTime' };
  }

  if (typeof input?.utcDateTime !== 'string' || !input.utcDateTime.trim()) {
    return { ok: false, reason: 'missingUtcDateTime' };
  }

  if (!input.utcDateTime.trim().endsWith('Z')) {
    return { ok: false, reason: 'invalidDateTime' };
  }

  const date = new Date(input.utcDateTime);

  return Number.isFinite(date.getTime())
    ? { ok: true, date }
    : { ok: false, reason: 'invalidDateTime' };
}

function isValidCoordinateInput(input) {
  return Number.isFinite(input?.latitude)
    && Number.isFinite(input?.longitude)
    && input.latitude >= -90
    && input.latitude <= 90
    && input.longitude >= -180
    && input.longitude <= 180;
}

function getProfileCoordinatePair(profile) {
  const birthPlace = profile?.birthPlace;

  if (!birthPlace || typeof birthPlace !== 'object') {
    return { ok: false, reason: 'missingBirthCoordinates' };
  }

  const candidates = [
    [birthPlace.coordinates?.latitude, birthPlace.coordinates?.longitude],
    [birthPlace.coordinates?.lat, birthPlace.coordinates?.lng],
    [birthPlace.latitude, birthPlace.longitude],
    [birthPlace.lat, birthPlace.lng],
  ];
  const matchingPair = candidates.find(([latitude, longitude]) => (
    Number.isFinite(latitude) && Number.isFinite(longitude)
  ));

  if (!matchingPair) {
    return { ok: false, reason: 'missingBirthCoordinates' };
  }

  const [latitude, longitude] = matchingPair;

  return isValidCoordinateInput({ latitude, longitude })
    ? { ok: true, latitude, longitude }
    : { ok: false, reason: 'invalidBirthCoordinates' };
}

function getSunLongitudeFromNatalPlanets(natalPlanets) {
  if (!isPlainObject(natalPlanets) || natalPlanets.status !== READY_STATUS) {
    return null;
  }

  const sun = Array.isArray(natalPlanets.planets)
    ? natalPlanets.planets.find((planet) => planet?.key === 'sun')
    : null;
  const longitude = normalizeDegrees(sun?.longitude);

  return longitude === null ? null : longitude;
}

function getBoundaryTolerance(options) {
  return Number.isFinite(options.boundaryToleranceDegrees)
    ? Math.abs(options.boundaryToleranceDegrees)
    : DEFAULT_BOUNDARY_TOLERANCE_DEGREES;
}

function signedDegrees(degrees) {
  return degrees > 180 ? degrees - 360 : degrees;
}

function toFiniteNumber(value) {
  return Number.isFinite(value) ? value : null;
}

function degreesToRadians(degrees) {
  return degrees * (Math.PI / 180);
}

function radiansToDegrees(radians) {
  return radians * (180 / Math.PI);
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function isPlainObject(value) {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}
