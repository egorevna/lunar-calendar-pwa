import { formatDegree, getZodiacSign, normalizeDegrees } from './astroMath.js';
import { createBirthDateTimeInput } from './birthDateTime.js';

const SOURCE_SYSTEM = 'mean-black-moon-lilith';
const SOURCE_KEY = 'mean-lunar-apogee';
const VARIANT = 'mean';
const VERIFICATION_STATUS = 'verified';
const VALIDATION_SOURCE = 'static-swisseph-SE_MEAN_APOG-fixtures';
const DEFERRED_VARIANTS = Object.freeze([
  'true-lilith',
  'osculating-black-moon-lilith',
  'interpolated-lilith',
]);
const J2000_UTC_MS = Date.UTC(2000, 0, 1, 12, 0, 0, 0);
const MILLISECONDS_PER_DAY = 86_400_000;
const JULIAN_DAYS_PER_CENTURY = 36_525;
const ARCSECONDS_PER_CIRCLE = 1_296_000;
const DEGREES_PER_RADIAN = 180 / Math.PI;
const ARCSECONDS_TO_RADIANS = Math.PI / (180 * 3_600);
const MEAN_LUNAR_INCLINATION_RADIANS = 5.1453964 * Math.PI / 180;

// Swiss Ephemeris moshmoon mean-element coefficients for the browser-safe
// Mean Lunar Apogee approximation validated by static project fixtures.
const MEAN_ELEMENT_COEFFICIENTS = Object.freeze([
  -1.312045233711e1,
  -1.13821591258e-3,
  -9.646018347184e-6,
  3.146734198839e1,
  4.76835758578e-2,
  -3.421689790404e-4,
  -6.84707090541e0,
  -5.834100476561e-3,
  -2.905334122698e-4,
  -5.663161722088e0,
  5.722859298199e-3,
  -8.466472828815e-5,
]);

const FALLBACK_MESSAGES = Object.freeze({
  missingProfile: 'Для расчета Средней Лилит нужен профиль.',
  missingUtcDateTime: 'Для расчета Средней Лилит нужен точный UTC-момент.',
  invalidUtcDateTime: 'UTC-момент для расчета Средней Лилит некорректен.',
  missingExactBirthTime: 'Для расчета Средней Лилит нужно точное время рождения.',
  missingTimezone: 'Для расчета Средней Лилит нужен часовой пояс места рождения.',
  invalidBirthDateTime: 'Время рождения не удалось надежно перевести в UTC.',
  invalidLongitude: 'Долгота Средней Лилит недоступна.',
});

export function calculateMeanLilithLongitude(input = {}) {
  const resolvedDate = resolveUtcDate(input);

  if (!resolvedDate.ready) {
    return lilithLongitudeNotReady(resolvedDate.reason);
  }

  return Object.freeze({
    status: 'ready',
    ready: true,
    longitude: calculateMeanLunarApogeeLongitudeForDate(resolvedDate.date),
    sourceSystem: SOURCE_SYSTEM,
    sourceKey: SOURCE_KEY,
    variant: VARIANT,
    verificationStatus: VERIFICATION_STATUS,
  });
}

export function calculateLilith(input = {}) {
  const longitudeResult = calculateMeanLilithLongitude(input);

  if (longitudeResult.status !== 'ready') {
    return lilithNotReady(longitudeResult.reason);
  }

  const lilith = formatLilith(longitudeResult.longitude, longitudeResult);

  if (!lilith) {
    return lilithNotReady('invalidLongitude');
  }

  return Object.freeze({
    status: 'ready',
    ready: true,
    sourceSystem: SOURCE_SYSTEM,
    sourceKey: SOURCE_KEY,
    variant: VARIANT,
    verificationStatus: VERIFICATION_STATUS,
    lilith,
    deferredVariants: DEFERRED_VARIANTS,
    limitations: getLilithLimitations(),
  });
}

export function calculateLilithForProfile(profile, options = {}) {
  if (!profile || typeof profile !== 'object') {
    return lilithNotReady('missingProfile');
  }

  const birthInput = options.birthDateTimeInput ?? createBirthDateTimeInput(profile);

  if (!birthInput.hasKnownTime || birthInput.birthTimeAccuracy !== 'exact') {
    return lilithNotReady('missingExactBirthTime');
  }

  if (!birthInput.timezone || birthInput.missingFields?.includes('birthPlace.timezone')) {
    return lilithNotReady('missingTimezone');
  }

  if (!birthInput.canConvertToUtc || !birthInput.utcDateTime) {
    return lilithNotReady('invalidBirthDateTime');
  }

  const result = calculateLilith({ utcDateTime: birthInput.utcDateTime });

  if (result.status !== 'ready') {
    return result;
  }

  return Object.freeze({
    ...result,
    source: 'profile-birth-utc',
  });
}

export function formatLilith(longitude, metadata = {}) {
  const normalized = normalizeDegrees(longitude);
  const sign = getZodiacSign(normalized);
  const formatted = formatDegree(normalized, { precision: 'second', rounding: 'floor' });

  if (normalized === null || !sign || !formatted.text) {
    return null;
  }

  const degreeText = String(formatted.degree).padStart(2, '0');
  const minutesText = String(formatted.minutes).padStart(2, '0');
  const secondsText = String(formatted.seconds).padStart(2, '0');

  return Object.freeze({
    key: 'lilith',
    label: 'Лилит',
    labelVariant: 'Средняя Лилит',
    labelEn: 'Black Moon Lilith',
    variantEn: 'Mean Lunar Apogee',
    longitude: normalized,
    sign: Object.freeze({
      key: sign.key,
      ru: sign.ru,
      symbol: sign.symbol,
    }),
    degree: formatted.degree,
    minutes: formatted.minutes,
    seconds: formatted.seconds,
    text: `Лилит / Средняя Лилит — ${sign.ru} ${degreeText}°${minutesText}′${secondsText}″`,
    sourceSystem: metadata.sourceSystem ?? SOURCE_SYSTEM,
    sourceKey: metadata.sourceKey ?? SOURCE_KEY,
    variant: metadata.variant ?? VARIANT,
    verificationStatus: metadata.verificationStatus ?? VERIFICATION_STATUS,
  });
}

export function getLilithSource() {
  return Object.freeze({
    sourceSystem: SOURCE_SYSTEM,
    sourceKey: SOURCE_KEY,
    variant: VARIANT,
    deferredVariants: DEFERRED_VARIANTS,
    validation: VALIDATION_SOURCE,
    zodiac: 'tropical',
  });
}

export function getLilithCapabilities() {
  return Object.freeze({
    lilith: true,
    meanLilith: true,
    trueLilith: false,
    osculatingLilith: false,
    interpolatedLilith: false,
    selena: false,
    lunarNodes: false,
    houseAssignment: false,
    interpretations: false,
    transits: false,
    fixedStars: false,
  });
}

export function getLilithLimitations() {
  return Object.freeze([
    'В Sprint 13 активна только Средняя Лилит / Mean Lunar Apogee.',
    'True/Osculating Lilith отложена до отдельной source policy.',
    'Interpolated Lilith отложена до отдельной source policy.',
    'Этот модуль не рассчитывает Selena.',
    'Интерпретации не добавлены.',
  ]);
}

function calculateMeanLunarApogeeLongitudeForDate(date) {
  const julianCenturies = (date.getTime() - J2000_UTC_MS) / MILLISECONDS_PER_DAY / JULIAN_DAYS_PER_CENTURY;
  const elements = calculateMeanLunarElements(julianCenturies);
  const apogeeLongitude = (elements.meanLongitude - elements.meanAnomaly) * ARCSECONDS_TO_RADIANS + Math.PI;
  const nodeLongitude = (elements.meanLongitude - elements.nodeDistance) * ARCSECONDS_TO_RADIANS;
  const relativeLongitude = apogeeLongitude - nodeLongitude;
  const x = Math.cos(relativeLongitude);
  const y = Math.sin(relativeLongitude) * Math.cos(MEAN_LUNAR_INCLINATION_RADIANS);
  const projectedLongitude = Math.atan2(y, x) + nodeLongitude;

  return normalizeDegrees(projectedLongitude * DEGREES_PER_RADIAN);
}

function calculateMeanLunarElements(julianCenturies) {
  const t = julianCenturies;
  const t2 = t * t;
  const fractionalT = positiveModulo(t, 1);
  const z = MEAN_ELEMENT_COEFFICIENTS;
  let nodeDistance = moduloArcseconds(
    1_739_232_000 * fractionalT
      + 295_263.0983 * t
      - 2.079419901760e-1 * t
      + 335_779.55755,
  );
  let meanAnomaly = moduloArcseconds(
    1_717_200_000 * fractionalT
      + 715_923.4728 * t
      - 2.035946368532e-1 * t
      + 485_868.28096,
  );
  let meanLongitude = moduloArcseconds(
    1_731_456_000 * fractionalT
      + 1_108_372.83264 * t
      - 6.784914260953e-1 * t
      + 785_939.95571,
  );

  nodeDistance += ((z[2] * t + z[1]) * t + z[0]) * t2;
  meanAnomaly += ((z[5] * t + z[4]) * t + z[3]) * t2;
  meanLongitude += ((z[11] * t + z[10]) * t + z[9]) * t2;

  return {
    nodeDistance,
    meanAnomaly,
    meanLongitude,
  };
}

function resolveUtcDate(input) {
  if (input?.date instanceof Date) {
    return Number.isNaN(input.date.getTime())
      ? { ready: false, reason: 'invalidUtcDateTime' }
      : { ready: true, date: new Date(input.date.getTime()) };
  }

  if (!input?.utcDateTime) {
    return { ready: false, reason: 'missingUtcDateTime' };
  }

  const date = new Date(input.utcDateTime);

  if (Number.isNaN(date.getTime())) {
    return { ready: false, reason: 'invalidUtcDateTime' };
  }

  return { ready: true, date };
}

function lilithLongitudeNotReady(reason) {
  return Object.freeze({
    status: 'notReady',
    ready: false,
    reason,
    message: FALLBACK_MESSAGES[reason] ?? FALLBACK_MESSAGES.invalidUtcDateTime,
    sourceSystem: SOURCE_SYSTEM,
    sourceKey: SOURCE_KEY,
  });
}

function lilithNotReady(reason) {
  return Object.freeze({
    status: 'notReady',
    ready: false,
    reason,
    message: FALLBACK_MESSAGES[reason] ?? FALLBACK_MESSAGES.invalidBirthDateTime,
    sourceSystem: SOURCE_SYSTEM,
    sourceKey: SOURCE_KEY,
    variant: VARIANT,
    lilith: null,
    deferredVariants: DEFERRED_VARIANTS,
    limitations: getLilithLimitations(),
  });
}

function moduloArcseconds(value) {
  return positiveModulo(value, ARCSECONDS_PER_CIRCLE);
}

function positiveModulo(value, divisor) {
  return ((value % divisor) + divisor) % divisor;
}
