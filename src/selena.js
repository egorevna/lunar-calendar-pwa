import { formatDegree, getZodiacSign, normalizeDegrees } from './astroMath.js';
import { createBirthDateTimeInput } from './birthDateTime.js';

const SOURCE_SYSTEM = 'selena-white-moon';
const SOURCE_KEY = 'swiss-ephemeris-seorbel-white-moon';
const METHOD = 'swisseph-seorbel-white-moon-linear-elements';
const POINT_TYPE = 'fictitious-calculated-point';
const VERIFICATION_STATUS = 'verified';
const VALIDATION_SOURCE = 'static-swisseph-SE_WHITE_MOON-fixtures';
const J2000_UTC_MS = Date.UTC(2000, 0, 1, 12, 0, 0, 0);
const MILLISECONDS_PER_DAY = 86_400_000;
const JULIAN_DAYS_PER_CENTURY = 36_525;

// Selected Swiss Ephemeris seorbel Selena/White Moon geo #17 row:
// J2000,JDATE, 242.2205555 + 5143.5418158 * T, ...
const SELENA_J2000_LONGITUDE = 242.2205555;
const SELENA_LONGITUDE_PER_CENTURY = 5143.5418158;

const FALLBACK_MESSAGES = Object.freeze({
  missingProfile: 'Для расчета Селены нужен профиль.',
  missingUtcDateTime: 'Для расчета Селены нужен точный UTC-момент.',
  invalidUtcDateTime: 'UTC-момент для расчета Селены некорректен.',
  missingExactBirthTime: 'Для расчета Селены нужно точное время рождения.',
  missingTimezone: 'Для расчета Селены нужен часовой пояс места рождения.',
  invalidBirthDateTime: 'Время рождения не удалось надежно перевести в UTC.',
  invalidLongitude: 'Долгота Селены недоступна.',
});

export function calculateSelenaLongitude(input = {}) {
  const resolvedDate = resolveUtcDate(input);

  if (!resolvedDate.ready) {
    return selenaLongitudeNotReady(resolvedDate.reason);
  }

  return Object.freeze({
    status: 'ready',
    ready: true,
    longitude: calculateWhiteMoonLongitudeForDate(resolvedDate.date),
    sourceSystem: SOURCE_SYSTEM,
    sourceKey: SOURCE_KEY,
    method: METHOD,
    pointType: POINT_TYPE,
    verificationStatus: VERIFICATION_STATUS,
  });
}

export function calculateSelena(input = {}) {
  const longitudeResult = calculateSelenaLongitude(input);

  if (longitudeResult.status !== 'ready') {
    return selenaNotReady(longitudeResult.reason);
  }

  const selena = formatSelena(longitudeResult.longitude, longitudeResult);

  if (!selena) {
    return selenaNotReady('invalidLongitude');
  }

  return Object.freeze({
    status: 'ready',
    ready: true,
    sourceSystem: SOURCE_SYSTEM,
    sourceKey: SOURCE_KEY,
    method: METHOD,
    pointType: POINT_TYPE,
    verificationStatus: VERIFICATION_STATUS,
    selena,
    limitations: getSelenaLimitations(),
  });
}

export function calculateSelenaForProfile(profile, options = {}) {
  if (!profile || typeof profile !== 'object') {
    return selenaNotReady('missingProfile');
  }

  const birthInput = options.birthDateTimeInput ?? createBirthDateTimeInput(profile);

  if (!birthInput.hasKnownTime || birthInput.birthTimeAccuracy !== 'exact') {
    return selenaNotReady('missingExactBirthTime');
  }

  if (!birthInput.timezone || birthInput.missingFields?.includes('birthPlace.timezone')) {
    return selenaNotReady('missingTimezone');
  }

  if (!birthInput.canConvertToUtc || !birthInput.utcDateTime) {
    return selenaNotReady('invalidBirthDateTime');
  }

  const result = calculateSelena({ utcDateTime: birthInput.utcDateTime });

  if (result.status !== 'ready') {
    return result;
  }

  return Object.freeze({
    ...result,
    source: 'profile-birth-utc',
  });
}

export function formatSelena(longitude, metadata = {}) {
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
    key: 'selena',
    label: 'Селена',
    labelVariant: 'Белая Луна',
    labelEn: 'Selena',
    variantEn: 'White Moon',
    longitude: normalized,
    sign: Object.freeze({
      key: sign.key,
      ru: sign.ru,
      symbol: sign.symbol,
    }),
    degree: formatted.degree,
    minutes: formatted.minutes,
    seconds: formatted.seconds,
    text: `Селена / Белая Луна — ${sign.ru} ${degreeText}°${minutesText}′${secondsText}″`,
    sourceSystem: metadata.sourceSystem ?? SOURCE_SYSTEM,
    sourceKey: metadata.sourceKey ?? SOURCE_KEY,
    method: metadata.method ?? METHOD,
    pointType: metadata.pointType ?? POINT_TYPE,
    verificationStatus: metadata.verificationStatus ?? VERIFICATION_STATUS,
  });
}

export function getSelenaSource() {
  return Object.freeze({
    sourceSystem: SOURCE_SYSTEM,
    sourceKey: SOURCE_KEY,
    method: METHOD,
    pointType: POINT_TYPE,
    validation: VALIDATION_SOURCE,
    alternateSourceSystems: Object.freeze([]),
    zodiac: 'tropical',
  });
}

export function getSelenaCapabilities() {
  return Object.freeze({
    selena: true,
    whiteMoon: true,
    fictitiousCalculatedPoint: true,
    lunarNodes: false,
    lilith: false,
    houseAssignment: false,
    interpretations: false,
    transits: false,
    fixedStars: false,
  });
}

export function getSelenaLimitations() {
  return Object.freeze([
    'В Sprint 13 активна Selena / White Moon по выбранной Swiss Ephemeris seorbel source system.',
    'Selena / White Moon трактуется как фиктивная / гипотетическая расчетная точка, а не физическое астрономическое тело.',
    'Альтернативные Selena source systems не активны.',
    'Этот модуль не рассчитывает Lunar Nodes или Lilith.',
    'Интерпретации не добавлены.',
  ]);
}

function calculateWhiteMoonLongitudeForDate(date) {
  const julianCenturies = (date.getTime() - J2000_UTC_MS) / MILLISECONDS_PER_DAY / JULIAN_DAYS_PER_CENTURY;

  return normalizeDegrees(SELENA_J2000_LONGITUDE + SELENA_LONGITUDE_PER_CENTURY * julianCenturies);
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

function selenaLongitudeNotReady(reason) {
  return Object.freeze({
    status: 'notReady',
    ready: false,
    reason,
    message: FALLBACK_MESSAGES[reason] ?? FALLBACK_MESSAGES.invalidUtcDateTime,
    sourceSystem: SOURCE_SYSTEM,
    sourceKey: SOURCE_KEY,
    method: METHOD,
    pointType: POINT_TYPE,
  });
}

function selenaNotReady(reason) {
  return Object.freeze({
    status: 'notReady',
    ready: false,
    reason,
    message: FALLBACK_MESSAGES[reason] ?? FALLBACK_MESSAGES.invalidBirthDateTime,
    sourceSystem: SOURCE_SYSTEM,
    sourceKey: SOURCE_KEY,
    method: METHOD,
    pointType: POINT_TYPE,
    selena: null,
    limitations: getSelenaLimitations(),
  });
}
