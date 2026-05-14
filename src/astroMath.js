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

export function formatDegree(longitude) {
  const sign = getZodiacSign(longitude);
  const degreeInSign = getDegreeInSign(longitude);

  if (!sign || degreeInSign === null) {
    return emptyDegreeFormat();
  }

  const degree = Math.floor(degreeInSign);
  const minutes = Math.floor((degreeInSign - degree) * 60);
  const formattedMinutes = String(minutes).padStart(2, '0');

  return {
    sign: sign.ru,
    signKey: sign.key,
    symbol: sign.symbol,
    degree,
    minutes,
    text: `${degree}°${formattedMinutes}′ ${sign.ru}`,
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
