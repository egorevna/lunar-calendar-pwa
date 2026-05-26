import {
  formatDegree,
  normalizeDegrees,
} from './astroMath.js';
import { calculateAscMcForProfile } from './ascMc.js';
import { calculateDayNightChartStatusForProfile } from './dayNightChart.js';
import {
  evaluateHousesInputReadiness,
  getHousesInputFallbackMessage,
} from './housesInputGuardrails.js';
import { getNatalPlanetsForProfile } from './natalPlanetsForProfile.js';

const READY_STATUS = 'ready';
const NOT_READY_STATUS = 'notReady';
const KEY = 'pars-fortuna';
const LABEL = 'Парс Фортуны';
const LABEL_EN = 'Lot of Fortune';
const REQUIRED_INPUTS = Object.freeze(['asc', 'sun', 'moon', 'chartSect']);
const EMPTY_ARRAY = Object.freeze([]);

const FORMULAS = Object.freeze({
  day: Object.freeze({
    formulaVariant: 'day',
    formula: 'ASC + Moon - Sun',
    operands: Object.freeze(['asc', '+', 'moon', '-', 'sun']),
  }),
  night: Object.freeze({
    formulaVariant: 'night',
    formula: 'ASC + Sun - Moon',
    operands: Object.freeze(['asc', '+', 'sun', '-', 'moon']),
  }),
});

const MESSAGES = Object.freeze({
  missingProfile: 'Сначала выберите профиль.',
  missingAscLongitude: 'Для расчета Парса Фортуны нужен ASC.',
  missingSunLongitude: 'Для расчета Парса Фортуны нужно положение Солнца.',
  missingMoonLongitude: 'Для расчета Парса Фортуны нужно положение Луны.',
  natalPlanetsNotReady: 'Для расчета Парса Фортуны нужны положения Солнца и Луны.',
  dayNightChartNotReady: 'Для расчета Парса Фортуны нужен статус дневной/ночной карты.',
  chartSectBoundary: 'Солнце находится на границе горизонта, поэтому формула Парса Фортуны не выбирается автоматически.',
  unknownChartSect: 'Для Парса Фортуны нужен дневной или ночной вариант карты.',
  calculationError: 'Парс Фортуны не удалось рассчитать безопасно.',
});

export function calculateParsFortunaFromLongitudes(input = {}) {
  const readiness = getParsFortunaInputReadiness(input);

  if (!readiness.ready) {
    return notReadyResult(readiness.reason);
  }

  const asc = normalizeDegrees(input.ascLongitude);
  const sun = normalizeDegrees(input.sunLongitude);
  const moon = normalizeDegrees(input.moonLongitude);
  const formula = getParsFortunaFormula(input.chartSect);
  const longitude = formula.formulaVariant === 'day'
    ? normalizeDegrees(asc + moon - sun)
    : normalizeDegrees(asc + sun - moon);

  if (longitude === null) {
    return notReadyResult('calculationError');
  }

  return readyResult({
    longitude,
    formula,
    chartSect: input.chartSect,
  });
}

export function calculateParsFortuna(input = {}) {
  return calculateParsFortunaFromLongitudes(input);
}

export function calculateParsFortunaForProfile(profile = null, options = {}) {
  const readiness = evaluateHousesInputReadiness(profile);

  if (!readiness.ready) {
    return notReadyResult(
      readiness.reason,
      readiness.message ?? getHousesInputFallbackMessage(readiness.reason),
    );
  }

  const ascMcResult = isPlainObject(options.ascMcResult)
    ? options.ascMcResult
    : calculateAscMcForProfile(profile);
  const ascLongitude = normalizeDegrees(ascMcResult?.angles?.asc?.longitude);

  if (ascMcResult?.status !== READY_STATUS || ascLongitude === null) {
    return notReadyResult('missingAscLongitude');
  }

  const natalPlanets = isPlainObject(options.natalPlanetsResult)
    ? options.natalPlanetsResult
    : getNatalPlanetsForProfile(profile);

  if (!isPlainObject(natalPlanets) || natalPlanets.status !== READY_STATUS) {
    return notReadyResult('natalPlanetsNotReady');
  }

  const sunLongitude = getPlanetLongitude(natalPlanets, 'sun');
  const moonLongitude = getPlanetLongitude(natalPlanets, 'moon');

  if (sunLongitude === null) {
    return notReadyResult('missingSunLongitude');
  }

  if (moonLongitude === null) {
    return notReadyResult('missingMoonLongitude');
  }

  const dayNightStatus = isPlainObject(options.dayNightChartStatus)
    ? options.dayNightChartStatus
    : calculateDayNightChartStatusForProfile(profile, {
      ...options,
      natalPlanetsResult: natalPlanets,
    });

  if (dayNightStatus?.status === 'boundary' || dayNightStatus?.boundary === true) {
    return notReadyResult('chartSectBoundary');
  }

  if (dayNightStatus?.status !== READY_STATUS || !['day', 'night'].includes(dayNightStatus?.chartSect)) {
    return notReadyResult(dayNightStatus?.reason ?? 'dayNightChartNotReady', dayNightStatus?.message);
  }

  const result = calculateParsFortunaFromLongitudes({
    ascLongitude,
    sunLongitude,
    moonLongitude,
    chartSect: dayNightStatus.chartSect,
  });

  if (result.status !== READY_STATUS) {
    return result;
  }

  return Object.freeze({
    ...result,
    chartSect: dayNightStatus.chartSect,
    source: 'profile-natal-sun-moon',
  });
}

export function getParsFortunaFormula(chartSect) {
  if (chartSect === 'day') {
    return FORMULAS.day;
  }

  if (chartSect === 'night') {
    return FORMULAS.night;
  }

  return null;
}

export function getParsFortunaInputReadiness(input = {}) {
  const missingInputs = [];
  const asc = normalizeDegrees(input.ascLongitude);
  const sun = normalizeDegrees(input.sunLongitude);
  const moon = normalizeDegrees(input.moonLongitude);

  if (asc === null) {
    missingInputs.push('asc');
  }

  if (sun === null) {
    missingInputs.push('sun');
  }

  if (moon === null) {
    missingInputs.push('moon');
  }

  if (!['day', 'night'].includes(input.chartSect)) {
    missingInputs.push('chartSect');
  }

  const reason = getInputReadinessReason({ asc, sun, moon, chartSect: input.chartSect });

  if (reason) {
    return Object.freeze({
      status: NOT_READY_STATUS,
      ready: false,
      reason,
      missingInputs: freezeArray(missingInputs),
      requiredInputs: REQUIRED_INPUTS,
    });
  }

  return Object.freeze({
    status: READY_STATUS,
    ready: true,
    reason: null,
    missingInputs: EMPTY_ARRAY,
    requiredInputs: REQUIRED_INPUTS,
  });
}

export function getParsFortunaCapabilities() {
  return Object.freeze({
    parsFortuna: true,
    lotOfFortune: true,
    dayNightFormula: true,
    arabicParts: false,
    lotOfSpirit: false,
    houseAssignment: false,
    interpretations: false,
    transits: false,
    fixedStars: false,
  });
}

export function getParsFortunaLimitations() {
  return Object.freeze([
    'Парс Фортуны рассчитывается только при готовых ASC, Солнце, Луне и дневной/ночной карте.',
    'Дневная формула: ASC + Moon - Sun.',
    'Ночная формула: ASC + Sun - Moon.',
    'Этот модуль не рассчитывает остальные арабские части.',
    'Интерпретации не добавлены.',
  ]);
}

function readyResult({ longitude, formula, chartSect }) {
  const formatted = formatDegree(longitude);

  if (!formatted.signKey) {
    return notReadyResult('calculationError');
  }

  const position = `${formatted.sign} ${formatted.degree}°${pad2(formatted.minutes)}′${pad2(formatted.seconds)}″`;

  return Object.freeze({
    status: READY_STATUS,
    ready: true,
    key: KEY,
    label: LABEL,
    labelEn: LABEL_EN,
    longitude,
    sign: Object.freeze({
      key: formatted.signKey,
      ru: formatted.sign,
      symbol: formatted.symbol,
    }),
    degree: formatted.degree,
    minutes: formatted.minutes,
    seconds: formatted.seconds,
    text: `${LABEL} — ${position}`,
    formulaVariant: formula.formulaVariant,
    formula: formula.formula,
    chartSect,
    requiredInputs: REQUIRED_INPUTS,
    verificationStatus: 'verified',
    limitations: getParsFortunaLimitations(),
    capabilities: getParsFortunaCapabilities(),
  });
}

function notReadyResult(reason, message = null) {
  return Object.freeze({
    status: NOT_READY_STATUS,
    ready: false,
    key: KEY,
    label: LABEL,
    labelEn: LABEL_EN,
    reason,
    message: message ?? MESSAGES[reason] ?? MESSAGES.calculationError,
    requiredInputs: REQUIRED_INPUTS,
    limitations: getParsFortunaLimitations(),
    capabilities: getParsFortunaCapabilities(),
  });
}

function getInputReadinessReason({ asc, sun, moon, chartSect }) {
  if (asc === null) {
    return 'missingAscLongitude';
  }

  if (sun === null) {
    return 'missingSunLongitude';
  }

  if (moon === null) {
    return 'missingMoonLongitude';
  }

  if (chartSect === 'boundary') {
    return 'chartSectBoundary';
  }

  if (!['day', 'night'].includes(chartSect)) {
    return 'unknownChartSect';
  }

  return null;
}

function getPlanetLongitude(natalPlanets, key) {
  const planets = Array.isArray(natalPlanets?.planets) ? natalPlanets.planets : [];
  const planet = planets.find((item) => item?.key === key);
  const longitude = normalizeDegrees(planet?.longitude);

  return longitude === null ? null : longitude;
}

function freezeArray(items) {
  return Object.freeze([...items]);
}

function pad2(value) {
  return String(value).padStart(2, '0');
}

function isPlainObject(value) {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}
