export const ASTRO_ZODIAC_SIGNS = Object.freeze([
  { key: 'aries', ru: 'Овен', symbol: '♈', index: 0 },
  { key: 'taurus', ru: 'Телец', symbol: '♉', index: 1 },
  { key: 'gemini', ru: 'Близнецы', symbol: '♊', index: 2 },
  { key: 'cancer', ru: 'Рак', symbol: '♋', index: 3 },
  { key: 'leo', ru: 'Лев', symbol: '♌', index: 4 },
  { key: 'virgo', ru: 'Дева', symbol: '♍', index: 5 },
  { key: 'libra', ru: 'Весы', symbol: '♎', index: 6 },
  { key: 'scorpio', ru: 'Скорпион', symbol: '♏', index: 7 },
  { key: 'sagittarius', ru: 'Стрелец', symbol: '♐', index: 8 },
  { key: 'capricorn', ru: 'Козерог', symbol: '♑', index: 9 },
  { key: 'aquarius', ru: 'Водолей', symbol: '♒', index: 10 },
  { key: 'pisces', ru: 'Рыбы', symbol: '♓', index: 11 },
]);

export const MAJOR_ASTRO_ASPECTS = Object.freeze([
  { key: 'conjunction', ru: 'соединение', symbol: '☌', exactAngle: 0 },
  { key: 'sextile', ru: 'секстиль', symbol: '✶', exactAngle: 60 },
  { key: 'square', ru: 'квадрат', symbol: '□', exactAngle: 90 },
  { key: 'trine', ru: 'трин', symbol: '△', exactAngle: 120 },
  { key: 'opposition', ru: 'оппозиция', symbol: '☍', exactAngle: 180 },
]);

const FULL_CIRCLE = 360;
const SIGN_SIZE = 30;
const MINUTES_PER_DEGREE = 60;
const SECONDS_PER_MINUTE = 60;
const SECONDS_PER_DEGREE = MINUTES_PER_DEGREE * SECONDS_PER_MINUTE;
const MINUTES_PER_CIRCLE = FULL_CIRCLE * MINUTES_PER_DEGREE;
const SECONDS_PER_CIRCLE = FULL_CIRCLE * SECONDS_PER_DEGREE;
const SIGN_SIZE_MINUTES = SIGN_SIZE * MINUTES_PER_DEGREE;
const SIGN_SIZE_SECONDS = SIGN_SIZE * SECONDS_PER_DEGREE;
const FORMAT_EPSILON = 1e-9;

export function normalizeDegrees(value) {
  if (!Number.isFinite(value)) {
    return null;
  }

  return positiveModulo(value, FULL_CIRCLE);
}

export function getZodiacSign(longitude) {
  const normalized = normalizeDegrees(longitude);

  if (normalized === null) {
    return null;
  }

  return ASTRO_ZODIAC_SIGNS[Math.floor(normalized / SIGN_SIZE)];
}

export function getDegreeInSign(longitude) {
  const normalized = normalizeDegrees(longitude);

  if (normalized === null) {
    return null;
  }

  return normalized % SIGN_SIZE;
}

export function getAngularDistance(a, b) {
  const first = normalizeDegrees(a);
  const second = normalizeDegrees(b);

  if (first === null || second === null) {
    return null;
  }

  const distance = Math.abs(first - second);

  return Math.min(distance, FULL_CIRCLE - distance);
}

export function detectAspect(angle, orb) {
  if (!Number.isFinite(angle) || !Number.isFinite(orb) || angle < 0 || angle > 180 || orb < 0) {
    return null;
  }

  const matches = MAJOR_ASTRO_ASPECTS
    .map((aspect) => ({
      ...aspect,
      orb: Math.abs(angle - aspect.exactAngle),
    }))
    .filter((aspect) => aspect.orb <= orb)
    .sort((a, b) => a.orb - b.orb || a.exactAngle - b.exactAngle);

  return matches[0] ?? null;
}

export function getAspectBetween(longitudeA, longitudeB, orb) {
  const angle = getAngularDistance(longitudeA, longitudeB);

  if (angle === null) {
    return null;
  }

  return detectAspect(angle, orb);
}

export function formatDegree(longitude, options = {}) {
  const normalized = normalizeDegrees(longitude);

  if (normalized === null) {
    return emptyDegreeFormat();
  }

  const precision = options.precision === 'minute' ? 'minute' : 'second';
  const rounding = options.rounding === 'nearest' ? 'nearest' : 'floor';
  const formatted = precision === 'second'
    ? formatDegreeToSecond(normalized, rounding)
    : formatDegreeToMinute(normalized, rounding);

  return {
    sign: formatted.sign.ru,
    signKey: formatted.sign.key,
    symbol: formatted.sign.symbol,
    degree: formatted.degree,
    minutes: formatted.minutes,
    ...(precision === 'second' ? { seconds: formatted.seconds } : {}),
    text: precision === 'second'
      ? `${formatted.degree}°${String(formatted.minutes).padStart(2, '0')}′${String(formatted.seconds).padStart(2, '0')}″ ${formatted.sign.ru}`
      : `${formatted.degree}°${String(formatted.minutes).padStart(2, '0')}′ ${formatted.sign.ru}`,
  };
}

function formatDegreeToMinute(normalizedLongitude, rounding) {
  const totalMinutes = positiveModulo(
    rounding === 'floor'
      ? Math.floor(normalizedLongitude * MINUTES_PER_DEGREE + FORMAT_EPSILON)
      : Math.round(normalizedLongitude * MINUTES_PER_DEGREE + FORMAT_EPSILON),
    MINUTES_PER_CIRCLE,
  );
  const sign = ASTRO_ZODIAC_SIGNS[Math.floor(totalMinutes / SIGN_SIZE_MINUTES)];
  const minutesInSign = totalMinutes % SIGN_SIZE_MINUTES;

  return {
    sign,
    degree: Math.floor(minutesInSign / MINUTES_PER_DEGREE),
    minutes: minutesInSign % MINUTES_PER_DEGREE,
  };
}

function formatDegreeToSecond(normalizedLongitude, rounding) {
  const totalSeconds = positiveModulo(
    rounding === 'floor'
      ? Math.floor(normalizedLongitude * SECONDS_PER_DEGREE + FORMAT_EPSILON)
      : Math.round(normalizedLongitude * SECONDS_PER_DEGREE + FORMAT_EPSILON),
    SECONDS_PER_CIRCLE,
  );
  const sign = ASTRO_ZODIAC_SIGNS[Math.floor(totalSeconds / SIGN_SIZE_SECONDS)];
  const secondsInSign = totalSeconds % SIGN_SIZE_SECONDS;
  const degree = Math.floor(secondsInSign / SECONDS_PER_DEGREE);
  const secondsAfterDegree = secondsInSign % SECONDS_PER_DEGREE;

  return {
    sign,
    degree,
    minutes: Math.floor(secondsAfterDegree / SECONDS_PER_MINUTE),
    seconds: secondsAfterDegree % SECONDS_PER_MINUTE,
  };
}

function positiveModulo(value, divisor) {
  return ((value % divisor) + divisor) % divisor;
}

function emptyDegreeFormat() {
  return {
    sign: '',
    signKey: '',
    symbol: '',
    degree: 0,
    minutes: 0,
    text: '',
  };
}
