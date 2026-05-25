import {
  calculateAscMc,
  calculateLocalSiderealDegrees,
  calculateMeanObliquityDegrees,
  isValidAscMcCoordinateInput,
} from './ascMc.js';
import { getDegreeInSign, getZodiacSign, normalizeDegrees } from './astroMath.js';
import { createBirthDateTimeInput } from './birthDateTime.js';
import { evaluateHousesInputReadiness } from './housesInputGuardrails.js';

const READY_STATUS = 'ready';
const NOT_READY_STATUS = 'notReady';
const UNSUPPORTED_STATUS = 'unsupported';
const HOUSE_SYSTEM = 'placidus';
const HOUSE_SYSTEM_LABEL = 'Placidus';
const FULL_CIRCLE = 360;
const HALF_CIRCLE = 180;
const ROOT_SAMPLES = 720;
const ROOT_ITERATIONS = 80;
const ROOT_EPSILON = 1e-10;
const POLAR_MARGIN_DEGREES = 1e-9;
const BENCHMARK_FIXTURE_COUNT = 5;
const BENCHMARK_TOLERANCE_DEGREES = 0.05;

const HOUSE_SYSTEM_LABELS = Object.freeze({
  'whole-sign': 'Whole Sign',
  'equal-house': 'Equal House',
  placidus: 'Placidus',
});

const VALIDATION_STATUS = Object.freeze({
  validated: true,
  implementationReady: true,
  dependencyPath: 'local-js-placidus-validated-against-static-swisseph-fixtures',
  benchmarkFixtures: true,
  benchmarkFixtureCount: BENCHMARK_FIXTURE_COUNT,
  toleranceDegrees: BENCHMARK_TOLERANCE_DEGREES,
  reason: null,
});

const MESSAGES = Object.freeze({
  missingPlacidusCalculationInputs:
    'Для расчета Placidus нужны UTC-момент рождения и координаты.',
  missingUtcDateTime: 'Для расчета Placidus нужен UTC-момент рождения.',
  invalidDateTime: 'UTC-момент рождения некорректен.',
  invalidCoordinates: 'Координаты места рождения должны быть корректными числами.',
  placidusUnsupportedAtLatitude:
    'Placidus не поддержан для этой широты: нужен safe unsupported вместо fallback.',
  selectedHouseSystemNotPlacidus:
    'Выбрана другая система домов. Placidus engine не выполняет расчет для выбранной системы.',
  missingProfile: 'Сначала выберите профиль.',
  missingExactBirthTime: 'Для расчета домов нужно точное время рождения.',
  missingBirthCoordinates: 'Для расчета домов нужно место рождения с координатами.',
  cityWithoutCoordinates:
    'Для выбранного города нужны координаты. Выберите город из справочника или введите координаты вручную.',
  countryRegionOnly: 'Страны или региона недостаточно. Выберите город рождения или введите координаты.',
  missingTimezone: 'Для расчета домов нужен часовой пояс места рождения.',
  missingBirthPlace: 'Для расчета домов нужно место рождения.',
  calculationError: 'Placidus не удалось рассчитать безопасно.',
});

export function calculatePlacidusHouses(input = {}) {
  const dateResolution = resolveUtcDateInput(input);

  if (!dateResolution.ok) {
    return notReadyResult(dateResolution.reason);
  }

  if (!isValidAscMcCoordinateInput(input)) {
    return notReadyResult('invalidCoordinates');
  }

  const date = dateResolution.date;
  const latitude = input.latitude;
  const longitude = input.longitude;
  const obliquityDegrees = calculateMeanObliquityDegrees(date);

  if (isUnsupportedPlacidusLatitude(latitude, obliquityDegrees)) {
    return getPlacidusUnsupportedResult('placidusUnsupportedAtLatitude');
  }

  const ascMcResult = calculateAscMc({ date, latitude, longitude });

  if (ascMcResult.status !== READY_STATUS) {
    return notReadyResult(ascMcResult.reason || 'calculationError');
  }

  const localSiderealDegrees = calculateLocalSiderealDegrees(date, longitude);
  const cuspLongitudes = calculatePlacidusCuspLongitudes({
    ascLongitude: ascMcResult.angles.asc.longitude,
    mcLongitude: ascMcResult.angles.mc.longitude,
    localSiderealDegrees,
    latitude,
    obliquityDegrees,
  });

  if (!cuspLongitudes) {
    return getPlacidusUnsupportedResult('placidusUnsupportedAtLatitude');
  }

  const formattedCusps = cuspLongitudes.map((cuspLongitude, index) => (
    formatPlacidusCusp(index + 1, cuspLongitude)
  ));

  if (formattedCusps.some((cusp) => cusp === null)) {
    return notReadyResult('calculationError');
  }

  const cusps = freezeArray(formattedCusps);
  const houses = freezeArray(cusps.map((cusp, index) => {
    const nextCusp = cusps[(index + 1) % cusps.length];

    return Object.freeze({
      number: cusp.number,
      cusp,
      nextCuspLongitude: nextCusp.longitude,
      wraps: nextCusp.longitude < cusp.longitude,
      label: `${cusp.number} дом`,
      text: `${cusp.number} дом — ${cusp.text}`,
    });
  }));

  return Object.freeze({
    status: READY_STATUS,
    ready: true,
    reason: null,
    houseSystem: HOUSE_SYSTEM,
    houseSystemLabel: HOUSE_SYSTEM_LABEL,
    method: 'placidus-semi-arc-local-js',
    cusps,
    houses,
    angles: ascMcResult.angles,
    validation: getPlacidusValidationStatus(),
    calculation: Object.freeze({
      benchmarkSource: 'static local swisseph swe_houses fixtures',
      siderealTimeSource: ascMcResult.calculation.siderealTimeSource,
      obliquitySource: ascMcResult.calculation.obliquitySource,
      coordinateConvention: ascMcResult.calculation.coordinateConvention,
    }),
    limitations: getPlacidusCalculationLimitations(),
    capabilities: getPlacidusEngineCapabilities(),
  });
}

export function calculatePlacidusHousesFromAscMc() {
  return notReadyResult('missingPlacidusCalculationInputs');
}

export function calculatePlacidusHousesForProfile(profile = null) {
  if (!profile || typeof profile !== 'object') {
    return notReadyResult('missingProfile');
  }

  const selectedHouseSystem = hasSavedHouseSystemToken(profile.houseSystem)
    ? normalizePlacidusHouseSystemValue(profile.houseSystem)
    : null;

  if (selectedHouseSystem !== HOUSE_SYSTEM) {
    return unsupportedSelectedSystemResult('selectedHouseSystemNotPlacidus', selectedHouseSystem);
  }

  const readiness = evaluateHousesInputReadiness(profile);

  if (!readiness.ready) {
    return notReadyResult(readiness.reason, readiness.message);
  }

  const birthDateTimeInput = createBirthDateTimeInput(profile);

  if (!birthDateTimeInput.canConvertToUtc || !birthDateTimeInput.utcDateTime) {
    return notReadyResult('invalidDateTime');
  }

  const coordinates = getProfileCoordinatePair(profile);

  if (!coordinates.ok) {
    return notReadyResult(coordinates.reason);
  }

  return calculatePlacidusHouses({
    utcDateTime: birthDateTimeInput.utcDateTime,
    latitude: coordinates.latitude,
    longitude: coordinates.longitude,
  });
}

export function isPlacidusHouseSystemValue(value) {
  return normalizePlacidusHouseSystemValue(value) === HOUSE_SYSTEM;
}

export function normalizePlacidusHouseSystemValue(value) {
  const normalized = normalizeHouseSystemText(value);

  if (normalized === 'placidus') {
    return HOUSE_SYSTEM;
  }

  if (normalized === 'wholesign' || normalized === 'whole-sign') {
    return 'whole-sign';
  }

  if (normalized === 'equal' || normalized === 'equal-house' || normalized === 'equalhouse') {
    return 'equal-house';
  }

  return null;
}

export function getPlacidusValidationStatus() {
  return VALIDATION_STATUS;
}

export function getPlacidusEngineCapabilities() {
  return Object.freeze({
    houses: true,
    placidus: true,
    placidusRecognized: true,
    placidusValidated: true,
    placidusReady: true,
    wholeSign: false,
    equalHouse: false,
    quadrantCusps: true,
    exactCusps: true,
    ascMcRequired: true,
    planetInHouse: false,
    interpretations: false,
    transits: false,
    fixedStars: false,
  });
}

export function getPlacidusCalculationLimitations() {
  return Object.freeze([
    'Placidus рассчитывается локальным browser-safe алгоритмом, проверенным against static benchmark fixtures.',
    'Placidus не подменяется равнодомной системой.',
    'Placidus не подменяется Whole Sign.',
    'Для Placidus high-latitude/circumpolar cases возвращают unsupported без fallback.',
    'Этот модуль не распределяет планеты по домам.',
  ]);
}

export function getPlacidusUnsupportedResult(reason = 'placidusUnsupportedAtLatitude') {
  return emptyResult({
    status: UNSUPPORTED_STATUS,
    reason,
  });
}

function calculatePlacidusCuspLongitudes({
  ascLongitude,
  mcLongitude,
  localSiderealDegrees,
  latitude,
  obliquityDegrees,
}) {
  // Placidus semi-arc cusp equations, validated against static Swiss Ephemeris fixtures.
  const icLongitude = normalizeDegrees(mcLongitude + HALF_CIRCLE);
  const c11 = solveZodiacArc(
    mcLongitude,
    ascLongitude,
    (longitude) => upperSemiArcFunction(longitude, localSiderealDegrees, latitude, obliquityDegrees, 1 / 3),
  );
  const c12 = solveZodiacArc(
    mcLongitude,
    ascLongitude,
    (longitude) => upperSemiArcFunction(longitude, localSiderealDegrees, latitude, obliquityDegrees, 2 / 3),
  );
  const c2 = solveZodiacArc(
    ascLongitude,
    icLongitude,
    (longitude) => lowerSemiArcFunction(longitude, localSiderealDegrees, latitude, obliquityDegrees, 1 / 3),
  );
  const c3 = solveZodiacArc(
    ascLongitude,
    icLongitude,
    (longitude) => lowerSemiArcFunction(longitude, localSiderealDegrees, latitude, obliquityDegrees, 2 / 3),
  );

  if ([c11, c12, c2, c3].some((longitude) => longitude === null)) {
    return null;
  }

  return [
    ascLongitude,
    c2,
    c3,
    icLongitude,
    normalizeDegrees(c11 + HALF_CIRCLE),
    normalizeDegrees(c12 + HALF_CIRCLE),
    normalizeDegrees(ascLongitude + HALF_CIRCLE),
    normalizeDegrees(c2 + HALF_CIRCLE),
    normalizeDegrees(c3 + HALF_CIRCLE),
    mcLongitude,
    c11,
    c12,
  ];
}

function upperSemiArcFunction(longitude, siderealDegrees, latitude, obliquityDegrees, fraction) {
  const coordinates = getEclipticEquatorialCoordinates(longitude, obliquityDegrees);
  const semiArc = getSemiDiurnalArc(coordinates.declination, latitude);

  if (semiArc === null) {
    return null;
  }

  return getEasternHourAngle(longitude, siderealDegrees, obliquityDegrees)
    + (fraction * semiArc);
}

function lowerSemiArcFunction(longitude, siderealDegrees, latitude, obliquityDegrees, fraction) {
  const coordinates = getEclipticEquatorialCoordinates(longitude, obliquityDegrees);
  const semiArc = getSemiDiurnalArc(coordinates.declination, latitude);

  if (semiArc === null) {
    return null;
  }

  return getEasternHourAngle(longitude, siderealDegrees, obliquityDegrees)
    + semiArc
    + (fraction * (HALF_CIRCLE - semiArc));
}

function solveZodiacArc(startLongitude, endLongitude, evaluator) {
  const arc = positiveModulo(endLongitude - startLongitude, FULL_CIRCLE);

  if (!Number.isFinite(arc) || arc <= 0) {
    return null;
  }

  let previousUnwrapped = null;
  let previousValue = null;

  for (let index = 1; index <= ROOT_SAMPLES; index += 1) {
    const currentUnwrapped = startLongitude + ((arc * index) / ROOT_SAMPLES);
    const currentValue = evaluator(normalizeDegrees(currentUnwrapped));

    if (!Number.isFinite(currentValue)) {
      continue;
    }

    if (Math.abs(currentValue) < ROOT_EPSILON) {
      if (index < ROOT_SAMPLES) {
        return normalizeDegrees(currentUnwrapped);
      }

      continue;
    }

    if (previousValue !== null && Math.sign(previousValue) !== Math.sign(currentValue)) {
      return bisectZodiacArc(previousUnwrapped, currentUnwrapped, evaluator);
    }

    previousUnwrapped = currentUnwrapped;
    previousValue = currentValue;
  }

  return null;
}

function bisectZodiacArc(startUnwrapped, endUnwrapped, evaluator) {
  let low = startUnwrapped;
  let high = endUnwrapped;
  let lowValue = evaluator(normalizeDegrees(low));

  for (let iteration = 0; iteration < ROOT_ITERATIONS; iteration += 1) {
    const middle = (low + high) / 2;
    const middleValue = evaluator(normalizeDegrees(middle));

    if (!Number.isFinite(middleValue)) {
      return null;
    }

    if (Math.abs(middleValue) < ROOT_EPSILON) {
      return normalizeDegrees(middle);
    }

    if (Math.sign(lowValue) === Math.sign(middleValue)) {
      low = middle;
      lowValue = middleValue;
    } else {
      high = middle;
    }
  }

  return normalizeDegrees((low + high) / 2);
}

function getEclipticEquatorialCoordinates(longitude, obliquityDegrees) {
  const lambda = degreesToRadians(normalizeDegrees(longitude));
  const epsilon = degreesToRadians(obliquityDegrees);
  const rightAscension = normalizeDegrees(
    radiansToDegrees(Math.atan2(Math.sin(lambda) * Math.cos(epsilon), Math.cos(lambda))),
  );
  const declination = radiansToDegrees(Math.asin(Math.sin(lambda) * Math.sin(epsilon)));

  return { rightAscension, declination };
}

function getSemiDiurnalArc(declination, latitude) {
  const argument = -Math.tan(degreesToRadians(latitude)) * Math.tan(degreesToRadians(declination));

  if (argument < -1 || argument > 1) {
    return null;
  }

  return radiansToDegrees(Math.acos(argument));
}

function getEasternHourAngle(longitude, siderealDegrees, obliquityDegrees) {
  const { rightAscension } = getEclipticEquatorialCoordinates(longitude, obliquityDegrees);
  let hourAngle = normalizeToSignedDegrees(siderealDegrees - rightAscension);

  if (hourAngle > 0) {
    hourAngle -= FULL_CIRCLE;
  }

  return hourAngle;
}

function formatPlacidusCusp(number, longitude) {
  const normalized = normalizeDegrees(longitude);
  const sign = getZodiacSign(normalized);
  const degreeWithinSign = getDegreeInSign(normalized);

  if (!sign || degreeWithinSign === null) {
    return null;
  }

  const degree = Math.floor(degreeWithinSign);
  const minutes = Math.min(59, Math.floor((degreeWithinSign - degree) * 60));
  const text = `${sign.ru} ${degree}°${String(minutes).padStart(2, '0')}′`;

  return Object.freeze({
    number,
    longitude: normalized,
    sign: Object.freeze({
      key: sign.key,
      ru: sign.ru,
      symbol: sign.symbol,
    }),
    degree,
    minutes,
    label: `Куспид ${number} дома`,
    text,
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

  return isValidAscMcCoordinateInput({ latitude, longitude })
    ? { ok: true, latitude, longitude }
    : { ok: false, reason: 'invalidCoordinates' };
}

function isUnsupportedPlacidusLatitude(latitude, obliquityDegrees) {
  return Math.abs(latitude) >= (90 - obliquityDegrees - POLAR_MARGIN_DEGREES);
}

function notReadyResult(reason, message = null) {
  return emptyResult({
    status: NOT_READY_STATUS,
    reason,
    message,
  });
}

function unsupportedSelectedSystemResult(reason, selectedHouseSystem) {
  const selectedLabel = HOUSE_SYSTEM_LABELS[selectedHouseSystem] ?? 'выбранной системы';

  return Object.freeze({
    ...emptyResult({
      status: UNSUPPORTED_STATUS,
      reason,
      message: `Выбрана другая система домов. Placidus engine не выполняет расчет для ${selectedLabel}.`,
    }),
    selectedHouseSystem,
  });
}

function emptyResult({ status, reason, message = null }) {
  return Object.freeze({
    status,
    ready: false,
    houseSystem: HOUSE_SYSTEM,
    houseSystemLabel: HOUSE_SYSTEM_LABEL,
    reason,
    message: message || getPlacidusMessage(reason),
    houses: freezeArray([]),
    cusps: freezeArray([]),
    angles: null,
    validation: getPlacidusValidationStatus(),
    limitations: getPlacidusCalculationLimitations(),
    capabilities: getPlacidusEngineCapabilities(),
  });
}

function getPlacidusMessage(reason) {
  return MESSAGES[reason] ?? MESSAGES.calculationError;
}

function hasSavedHouseSystemToken(value) {
  return typeof value === 'string' && value.trim() !== '';
}

function normalizeHouseSystemText(value) {
  return typeof value === 'string' ? value.trim().toLowerCase() : '';
}

function normalizeToSignedDegrees(value) {
  const normalized = normalizeDegrees(value + HALF_CIRCLE);

  return normalized - HALF_CIRCLE;
}

function positiveModulo(value, divisor) {
  return ((value % divisor) + divisor) % divisor;
}

function degreesToRadians(value) {
  return (value * Math.PI) / HALF_CIRCLE;
}

function radiansToDegrees(value) {
  return (value * HALF_CIRCLE) / Math.PI;
}

function freezeArray(items) {
  return Object.freeze(items);
}
