import {
  DEFAULT_DASHBOARD_MODE,
  isDashboardModeKey,
} from './dashboardModes.js';

const WATER_SIGNS = new Set(['cancer', 'scorpio', 'pisces']);
const EARTH_SIGNS = new Set(['taurus', 'virgo', 'capricorn']);
const SOFT_ASPECTS = new Set([60, 120]);
const HARD_ASPECTS = new Set([90, 180]);
const HARD_PLANETS = new Set(['mars', 'saturn', 'uranus', 'pluto']);
const CLEANSING_OFFICERS = new Set(['remove', 'destruction']);
const STABLE_OFFICERS = new Set(['stable', 'success', 'receive', 'open']);
const CAUTION_OFFICERS = new Set(['danger', 'destruction', 'close']);

export function getModeScores(mode, context = {}, fieldQuality = {}) {
  const safeMode = isDashboardModeKey(mode) ? mode : DEFAULT_DASHBOARD_MODE;

  if (safeMode === DEFAULT_DASHBOARD_MODE) {
    return getGeneralScores(fieldQuality);
  }

  const builders = {
    tarot: getTarotScores,
    candles: getCandlesScores,
    money: getMoneyScores,
    relationships: getRelationshipScores,
    cleansing: getCleansingScores,
    forecasts: getForecastScores,
  };

  return builders[safeMode](context, fieldQuality);
}

function getGeneralScores(fieldQuality) {
  return Array.isArray(fieldQuality.metrics)
    ? fieldQuality.metrics.map((metric) => ({
      ...metric,
      value: metric.value ?? metric.score,
    }))
    : [];
}

function getTarotScores(context, fieldQuality) {
  return [
    toMetric('intuition', 'Интуиция', getBaseMetricScore(fieldQuality, 'intuition', 5) + waterBonus(context) + hourBonus(context, ['moon'])),
    toMetric('clarity', 'Ясность трактовки', 5 + hourBonus(context, ['mercury']) + softPlanetBonus(context, ['mercury', 'jupiter']) - vocPenalty(context) - hardAspectPenalty(context)),
    toMetric('distortionRisk', 'Риск искажений', 3 + vocRisk(context) + piscesRisk(context) + hardPlanetRisk(context, ['neptune']) + warningRisk(context)),
  ];
}

function getCandlesScores(context) {
  return [
    toMetric('programmingCandles', 'Программные свечи', 5 + stableBonus(context) + hourBonus(context, ['sun', 'jupiter', 'venus']) - vocPenalty(context) - hardAspectPenalty(context)),
    toMetric('cleansingCandles', 'Чистки', 5 + waningBonus(context) + cleansingBonus(context) + hourBonus(context, ['mars', 'saturn', 'moon'])),
    toMetric('moneyCandles', 'Денежные свечи', 5 + stableBonus(context) + hourBonus(context, ['jupiter', 'venus']) - vocPenalty(context)),
    toMetric('loveCandles', 'Любовные свечи', 5 + hourBonus(context, ['venus']) + softPlanetBonus(context, ['venus']) - hardPlanetRisk(context, ['mars', 'uranus'])),
    toMetric('protection', 'Защита', 5 + hourBonus(context, ['mars', 'saturn']) + saturnBonus(context)),
  ];
}

function getMoneyScores(context) {
  return [
    toMetric('deals', 'Сделки', 5 + stableBonus(context) + hourBonus(context, ['mercury', 'jupiter']) - vocPenalty(context) - hardAspectPenalty(context)),
    toMetric('sales', 'Продажи', 5 + hourBonus(context, ['sun', 'venus', 'jupiter', 'mercury']) + softPlanetBonus(context, ['venus', 'jupiter']) - vocPenalty(context)),
    toMetric('purchases', 'Покупки', 5 + earthBonus(context) + hourBonus(context, ['venus', 'jupiter']) - cautionPenalty(context)),
    toMetric('ads', 'Запуск рекламы', 5 + hourBonus(context, ['sun', 'mercury', 'jupiter']) - vocPenalty(context) - hardAspectPenalty(context)),
    toMetric('signing', 'Подписание', 5 + hourBonus(context, ['mercury', 'saturn']) + stableBonus(context) - vocPenalty(context) - cautionPenalty(context)),
  ];
}

function getRelationshipScores(context) {
  return [
    toMetric('talks', 'Разговоры', 5 + hourBonus(context, ['mercury', 'moon']) - hardPlanetRisk(context, ['mars', 'uranus'])),
    toMetric('reconciliation', 'Примирение', 5 + hourBonus(context, ['venus', 'moon']) + softPlanetBonus(context, ['venus', 'jupiter']) - hardAspectPenalty(context)),
    toMetric('attraction', 'Притяжение', 5 + hourBonus(context, ['venus']) + softPlanetBonus(context, ['venus'])),
    toMetric('harmonization', 'Гармонизация', 5 + hourBonus(context, ['venus', 'moon']) + stableBonus(context) - vocPenalty(context)),
    toMetric('conflictRisk', 'Риск конфликта', 3 + hardPlanetRisk(context, ['mars', 'uranus']) + hourBonus(context, ['mars']) + warningRisk(context)),
  ];
}

function getCleansingScores(context) {
  return [
    toMetric('cleansing', 'Чистки', 5 + waningBonus(context) + cleansingBonus(context) + hourBonus(context, ['mars', 'saturn', 'moon'])),
    toMetric('cuttingOff', 'Отсечение', 5 + waningBonus(context) + hourBonus(context, ['mars', 'saturn']) + cleansingBonus(context)),
    toMetric('protection', 'Защита', 5 + hourBonus(context, ['saturn', 'mars']) + saturnBonus(context)),
    toMetric('recovery', 'Восстановление', 5 + hourBonus(context, ['moon', 'venus']) + softPlanetBonus(context, ['venus', 'jupiter']) - hardAspectPenalty(context)),
    toMetric('rollbackRisk', 'Риск отката', 3 + vocRisk(context) + hardAspectPenalty(context) + warningRisk(context)),
  ];
}

function getForecastScores(context, fieldQuality) {
  return [
    toMetric('forecastClarity', 'Ясность прогноза', 5 + hourBonus(context, ['mercury', 'jupiter']) + softPlanetBonus(context, ['mercury', 'jupiter']) - vocPenalty(context) - hardAspectPenalty(context)),
    toMetric('distortionRisk', 'Риск искажений', 3 + piscesRisk(context) + hardPlanetRisk(context, ['neptune']) + vocRisk(context)),
    toMetric('logic', 'Логика', 5 + hourBonus(context, ['mercury', 'saturn']) - piscesRisk(context)),
    toMetric('intuition', 'Интуиция', getBaseMetricScore(fieldQuality, 'intuition', 5) + waterBonus(context) + hourBonus(context, ['moon'])),
  ];
}

function toMetric(key, label, value) {
  const score = clampScore(value);
  return {
    key,
    label,
    level: score >= 7 ? 'высоко' : score <= 4 ? 'низко' : 'средне',
    score,
    value: score,
  };
}

function clampScore(value) {
  return Math.max(1, Math.min(10, Math.round(Number.isFinite(value) ? value : 5)));
}

function getBaseMetricScore(fieldQuality, key, fallback) {
  const metric = fieldQuality.metrics?.find((item) => item.key === key);
  return Number.isFinite(metric?.score) ? metric.score : fallback;
}

function sign(context) {
  return context.moonSign?.current?.key;
}

function hour(context) {
  return context.planetaryHour?.key;
}

function officer(context) {
  return context.indicators?.dayOfficer?.key;
}

function aspects(context) {
  return [context.moonAspects?.previous, context.moonAspects?.next].filter(Boolean);
}

function hourBonus(context, hours) {
  return hours.includes(hour(context)) ? 2 : 0;
}

function waterBonus(context) {
  return WATER_SIGNS.has(sign(context)) ? 1 : 0;
}

function earthBonus(context) {
  return EARTH_SIGNS.has(sign(context)) ? 1 : 0;
}

function stableBonus(context) {
  return STABLE_OFFICERS.has(officer(context)) ? 1 : 0;
}

function cleansingBonus(context) {
  const lunarDay = context.lunar?.lunarDay;
  return CLEANSING_OFFICERS.has(officer(context)) || lunarDay === 29 ? 2 : 0;
}

function waningBonus(context) {
  return context.lunar?.waxing === false ? 1 : 0;
}

function saturnBonus(context) {
  return aspects(context).some((aspect) => aspect.planet === 'saturn') ? 1 : 0;
}

function vocPenalty(context) {
  return context.voc?.isActive ? 3 : 0;
}

function vocRisk(context) {
  return context.voc?.isActive ? 3 : 0;
}

function cautionPenalty(context) {
  return CAUTION_OFFICERS.has(officer(context)) ? 1 : 0;
}

function hardAspectPenalty(context) {
  return aspects(context).some((aspect) => HARD_ASPECTS.has(aspect.aspect) && HARD_PLANETS.has(aspect.planet)) ? 2 : 0;
}

function hardPlanetRisk(context, planets) {
  return aspects(context).some((aspect) => HARD_ASPECTS.has(aspect.aspect) && planets.includes(aspect.planet)) ? 3 : 0;
}

function piscesRisk(context) {
  return sign(context) === 'pisces' ? 2 : 0;
}

function warningRisk(context) {
  return Array.isArray(context.warnings) && context.warnings.length ? 1 : 0;
}

function softPlanetBonus(context, planets) {
  return aspects(context).some((aspect) => SOFT_ASPECTS.has(aspect.aspect) && planets.includes(aspect.planet)) ? 1 : 0;
}
