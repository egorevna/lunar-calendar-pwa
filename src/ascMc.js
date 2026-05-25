import * as Astronomy from './vendor/astronomy-engine.mjs';

import {
  getDegreeInSign,
  getZodiacSign,
  normalizeDegrees,
} from './astroMath.js';
import { createBirthDateTimeInput } from './birthDateTime.js';
import {
  evaluateHousesInputReadiness,
  getHousesInputFallbackMessage,
} from './housesInputGuardrails.js';

const READY_STATUS = 'ready';
const INVALID_STATUS = 'invalid';
const NOT_READY_STATUS = 'notReady';
const INITIAL_HOUSE_SYSTEM = 'whole-sign';
const FULL_CIRCLE = 360;
const HALF_CIRCLE = 180;
const SIDEREAL_HOURS_TO_DEGREES = 15;
const MILLISECONDS_PER_DAY = 86400000;
const UNIX_EPOCH_JULIAN_DATE = 2440587.5;
const J2000_JULIAN_DATE = 2451545.0;
const CENTURY_DAYS = 36525;
const EPSILON = 1e-12;

const ANGLE_LABELS = Object.freeze({
  asc: 'ASC',
  mc: 'MC',
  dsc: 'DSC',
  ic: 'IC',
});

const INVALID_MESSAGES = Object.freeze({
  missingUtcDateTime: 'Для расчета ASC / MC нужен UTC-момент рождения.',
  invalidDateTime: 'UTC-момент рождения некорректен.',
  invalidCoordinates: 'Координаты места рождения должны быть корректными числами.',
  unsupported: 'ASC / MC пока недоступны.',
  calculationError: 'ASC / MC не удалось рассчитать безопасно.',
});

export function calculateAscMcFromLocalSidereal(input = {}) {
  const localSiderealDegrees = toFiniteNumber(input.localSiderealDegrees);
  const latitude = toFiniteNumber(input.latitude);
  const obliquityDegrees = toFiniteNumber(input.obliquityDegrees);

  if (
    localSiderealDegrees === null
    || latitude === null
    || obliquityDegrees === null
    || latitude < -90
    || latitude > 90
  ) {
    return invalidResult('invalidCoordinates', {
      method: 'local-sidereal-vector-geometry',
      includeReady: false,
    });
  }

  const theta = degreesToRadians(normalizeDegrees(localSiderealDegrees));
  const phi = degreesToRadians(latitude);
  const epsilon = degreesToRadians(obliquityDegrees);
  const cosEpsilon = Math.cos(epsilon);
  const sinEpsilon = Math.sin(epsilon);
  const zenith = [
    Math.cos(phi) * Math.cos(theta),
    Math.cos(phi) * Math.sin(theta),
    Math.sin(phi),
  ];
  const east = [
    -Math.sin(theta),
    Math.cos(theta),
    0,
  ];

  const ascLongitude = chooseEasternHorizonLongitude({
    zenith,
    east,
    cosEpsilon,
    sinEpsilon,
  });
  const mcLongitude = chooseUpperMeridianLongitude({
    zenith,
    east,
    cosEpsilon,
    sinEpsilon,
  });

  if (ascLongitude === null || mcLongitude === null) {
    return invalidResult('calculationError', {
      method: 'local-sidereal-vector-geometry',
      includeReady: false,
    });
  }

  const asc = formatAscMcAngle(ascLongitude, 'asc');
  const mc = formatAscMcAngle(mcLongitude, 'mc');
  const dsc = deriveOppositeAngle(asc, 'dsc');
  const ic = deriveOppositeAngle(mc, 'ic');

  return Object.freeze({
    status: READY_STATUS,
    method: 'local-sidereal-vector-geometry',
    asc,
    mc,
    dsc,
    ic,
  });
}

export function calculateAscMc(input = {}) {
  const dateResolution = resolveUtcDateInput(input);

  if (!dateResolution.ok) {
    return invalidResult(dateResolution.reason);
  }

  if (!isValidAscMcCoordinateInput(input)) {
    return invalidResult('invalidCoordinates');
  }

  try {
    const sidereal = calculateLocalSiderealDegrees(dateResolution.date, input.longitude);
    const obliquity = calculateMeanObliquityDegrees(dateResolution.date);
    const geometry = calculateAscMcFromLocalSidereal({
      localSiderealDegrees: sidereal,
      latitude: input.latitude,
      obliquityDegrees: obliquity,
    });

    if (geometry.status !== READY_STATUS) {
      return invalidResult('calculationError');
    }

    return Object.freeze({
      status: READY_STATUS,
      ready: true,
      reason: null,
      method: 'sidereal-time-vector-geometry',
      houseSystem: INITIAL_HOUSE_SYSTEM,
      angles: Object.freeze({
        asc: geometry.asc,
        mc: geometry.mc,
        dsc: geometry.dsc,
        ic: geometry.ic,
      }),
      calculation: Object.freeze({
        siderealTimeSource: 'astronomy-engine SiderealTime (GAST)',
        obliquitySource: 'mean-obliquity-approximation',
        coordinateConvention: 'east-positive-longitude',
      }),
      limitations: getAscMcCalculationLimitations(),
      capabilities: getAscMcEngineCapabilities(),
    });
  } catch {
    return invalidResult('calculationError');
  }
}

export function calculateAscMcForProfile(profile = null) {
  const readiness = evaluateHousesInputReadiness(profile);

  if (!readiness.ready) {
    return notReadyResult(readiness.reason, readiness.message);
  }

  const birthDateTimeInput = createBirthDateTimeInput(profile);

  if (!birthDateTimeInput.canConvertToUtc || !birthDateTimeInput.utcDateTime) {
    return notReadyResult('invalidDateTime', getInvalidMessage('invalidDateTime'));
  }

  const coordinates = getProfileCoordinatePair(profile);

  if (!coordinates.ok) {
    return notReadyResult(coordinates.reason, getSafeCoordinateMessage(coordinates.reason));
  }

  const result = calculateAscMc({
    utcDateTime: birthDateTimeInput.utcDateTime,
    latitude: coordinates.latitude,
    longitude: coordinates.longitude,
  });

  if (result.status !== READY_STATUS) {
    return notReadyResult(result.reason, result.message);
  }

  return Object.freeze({
    status: READY_STATUS,
    ready: true,
    reason: null,
    method: result.method,
    houseSystem: INITIAL_HOUSE_SYSTEM,
    angles: result.angles,
    calculation: result.calculation,
    limitations: result.limitations,
    capabilities: result.capabilities,
  });
}

export function deriveOppositeAngle(angle, key) {
  const longitude = typeof angle === 'number' ? angle : angle?.longitude;

  if (!Number.isFinite(longitude)) {
    return null;
  }

  return formatAscMcAngle(longitude + HALF_CIRCLE, key);
}

export function formatAscMcAngle(longitude, key) {
  const normalized = normalizeDegrees(longitude);
  const sign = getZodiacSign(normalized);
  const degreeWithinSign = getDegreeInSign(normalized);

  if (normalized === null || !sign || degreeWithinSign === null) {
    return null;
  }

  const degree = Math.floor(degreeWithinSign);
  const minutes = Math.min(
    59,
    Math.floor((degreeWithinSign - degree) * 60 + EPSILON),
  );
  const label = ANGLE_LABELS[key] ?? String(key || '').toUpperCase();

  return Object.freeze({
    key,
    label,
    longitude: normalized,
    sign: Object.freeze({
      key: sign.key,
      ru: sign.ru,
      symbol: sign.symbol,
    }),
    degree,
    minutes,
    text: `${sign.ru} ${degree}°${String(minutes).padStart(2, '0')}′`,
  });
}

export function isValidAscMcCoordinateInput(input = {}) {
  return Number.isFinite(input?.latitude)
    && Number.isFinite(input?.longitude)
    && input.latitude >= -90
    && input.latitude <= 90
    && input.longitude >= -180
    && input.longitude <= 180;
}

export function getAscMcCalculationLimitations() {
  return Object.freeze([
    'ASC / MC рассчитываются только при точном времени рождения и координатах места рождения.',
    'Дома в Sprint 11 используют Whole Sign как первую безопасную систему, если quadrant cusps не верифицированы отдельно.',
    'DSC и IC производятся от ASC и MC.',
    'Расчет домов не выполняется в этом модуле.',
  ]);
}

export function getAscMcEngineCapabilities() {
  return Object.freeze({
    asc: true,
    mc: true,
    dsc: true,
    ic: true,
    houses: false,
    houseCusps: false,
    planetInHouse: false,
    wholeSignPolicy: true,
    placidus: false,
    interpretations: false,
    transits: false,
    fixedStars: false,
  });
}

function chooseEasternHorizonLongitude({ zenith, east, cosEpsilon, sinEpsilon }) {
  const longitude = solveEclipticLongitudeOnGreatCircle({
    a: zenith[0],
    b: cosEpsilon * zenith[1] + sinEpsilon * zenith[2],
  });

  if (longitude === null) {
    return null;
  }

  const vector = eclipticVector(longitude, cosEpsilon, sinEpsilon);

  return dot(vector, east) >= 0
    ? longitude
    : normalizeDegrees(longitude + HALF_CIRCLE);
}

function chooseUpperMeridianLongitude({ zenith, east, cosEpsilon, sinEpsilon }) {
  const longitude = solveEclipticLongitudeOnGreatCircle({
    a: east[0],
    b: cosEpsilon * east[1] + sinEpsilon * east[2],
  });

  if (longitude === null) {
    return null;
  }

  const vector = eclipticVector(longitude, cosEpsilon, sinEpsilon);

  return dot(vector, zenith) >= 0
    ? longitude
    : normalizeDegrees(longitude + HALF_CIRCLE);
}

function solveEclipticLongitudeOnGreatCircle({ a, b }) {
  if (!Number.isFinite(a) || !Number.isFinite(b) || Math.hypot(a, b) < EPSILON) {
    return null;
  }

  return normalizeDegrees(radiansToDegrees(Math.atan2(-a, b)));
}

function eclipticVector(longitude, cosEpsilon, sinEpsilon) {
  const lambda = degreesToRadians(longitude);

  return [
    Math.cos(lambda),
    Math.sin(lambda) * cosEpsilon,
    Math.sin(lambda) * sinEpsilon,
  ];
}

function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

export function calculateLocalSiderealDegrees(date, longitude) {
  const siderealHours = Astronomy.SiderealTime(date);

  return normalizeDegrees((siderealHours * SIDEREAL_HOURS_TO_DEGREES) + longitude);
}

export function calculateMeanObliquityDegrees(date) {
  const julianDate = toJulianDate(date);
  const t = (julianDate - J2000_JULIAN_DATE) / CENTURY_DAYS;
  const arcSeconds = 84381.448
    - (46.8150 * t)
    - (0.00059 * t * t)
    + (0.001813 * t * t * t);

  return arcSeconds / 3600;
}

function toJulianDate(date) {
  return (date.getTime() / MILLISECONDS_PER_DAY) + UNIX_EPOCH_JULIAN_DATE;
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

function getProfileCoordinatePair(profile) {
  const birthPlace = profile?.birthPlace;

  if (!birthPlace || typeof birthPlace !== 'object') {
    return { ok: false, reason: 'missingBirthCoordinates' };
  }

  const candidates = [
    [birthPlace.latitude, birthPlace.longitude],
    [birthPlace.lat, birthPlace.lng],
    [birthPlace.coordinates?.latitude, birthPlace.coordinates?.longitude],
    [birthPlace.coordinates?.lat, birthPlace.coordinates?.lng],
  ];
  const hasAnyCoordinateToken = candidates.some(([latitude, longitude]) => (
    latitude !== undefined && latitude !== null
  ) || (
    longitude !== undefined && longitude !== null
  ));
  const matchingPair = candidates.find(([latitude, longitude]) => (
    Number.isFinite(latitude) && Number.isFinite(longitude)
  ));

  if (matchingPair) {
    const [latitude, longitude] = matchingPair;

    return isValidAscMcCoordinateInput({ latitude, longitude })
      ? { ok: true, latitude, longitude }
      : { ok: false, reason: 'invalidCoordinates' };
  }

  return {
    ok: false,
    reason: hasAnyCoordinateToken ? 'invalidCoordinates' : 'missingBirthCoordinates',
  };
}

function notReadyResult(reason, message) {
  return Object.freeze({
    status: NOT_READY_STATUS,
    ready: false,
    reason,
    message,
    houseSystem: INITIAL_HOUSE_SYSTEM,
    angles: null,
    capabilities: getAscMcEngineCapabilities(),
  });
}

function invalidResult(reason = 'unsupported', options = {}) {
  return Object.freeze({
    status: INVALID_STATUS,
    ...(options.includeReady === false ? {} : { ready: false }),
    reason,
    message: getInvalidMessage(reason),
    ...(options.method ? { method: options.method } : {}),
    houseSystem: INITIAL_HOUSE_SYSTEM,
    angles: null,
  });
}

function getInvalidMessage(reason) {
  return INVALID_MESSAGES[reason] ?? INVALID_MESSAGES.unsupported;
}

function getSafeCoordinateMessage(reason) {
  if (reason === 'invalidCoordinates') {
    return getInvalidMessage('invalidCoordinates');
  }

  return getHousesInputFallbackMessage('missingBirthCoordinates');
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
