import {
  DEFAULT_DASHBOARD_MODE,
  isDashboardModeKey,
} from './dashboardModes.js';

const WATER_SIGNS = new Set(['cancer', 'scorpio', 'pisces']);
const EARTH_SIGNS = new Set(['taurus', 'virgo', 'capricorn']);
const FIRE_SIGNS = new Set(['aries', 'leo', 'sagittarius']);
const AIR_SIGNS = new Set(['gemini', 'libra', 'aquarius']);
const HARD_ASPECTS = new Set([90, 180]);
const SOFT_ASPECTS = new Set([60, 120]);
const CLEANSING_OFFICERS = new Set(['remove', 'destruction']);
const STABLE_OFFICERS = new Set(['stable', 'success', 'receive', 'open']);

const SAFETY_RULES = [
  rule('careful', '*', 'не действовать на раздражении', 100, (signals) => signals.lunarDay === 23),
  rule('careful', '*', 'лучше чистки, не запуск нового', 100, (signals) => signals.lunarDay === 29),
  rule('careful', '*', 'резкие решения на нервном фоне', 100, (signals) => signals.nextAspectType === 'tense' && ['mars', 'uranus'].includes(signals.nextAspectPlanet)),
  rule('careful', '*', 'осторожно с обещаниями и ожиданиями', 100, (signals) => signals.fieldType === 'blurred' || signals.nextAspectPlanet === 'neptune'),
];

const MODE_RULES = [
  rule('good', 'general', 'завершение начатого', 40, (signals) => signals.activeVoc || signals.fieldType === 'cleansing'),
  rule('good', 'general', 'закрепление решений', 40, (signals) => signals.isStableDay),
  rule('good', 'general', 'спокойные действия', 40, () => true),
  rule('careful', 'general', 'запуск новых дел', 40, (signals) => signals.activeVoc),
  rule('careful', 'general', 'импульсивные решения', 40, (signals) => signals.nextAspectType === 'tense'),
  rule('careful', 'general', 'жесткие финансовые решения', 40, () => true),

  rule('good', 'tarot', 'формулировка вопросов', 70, (signals) => signals.planetaryHour === 'mercury'),
  rule('good', 'tarot', 'сны', 70, (signals) => signals.moonElement === 'water' || signals.planetaryHour === 'moon'),
  rule('good', 'tarot', 'диагностика', 40, () => true),
  rule('good', 'tarot', 'записи', 40, (signals) => signals.planetaryHour === 'mercury'),
  rule('careful', 'tarot', 'не делать расклады из тревоги или злости', 101, (signals) => signals.hasWarnings || signals.lunarDay === 23),
  rule('careful', 'tarot', 'денежные прогнозы при Луне без курса', 100, (signals) => signals.activeVoc),
  rule('careful', 'tarot', 'не делать окончательные выводы на размытом фоне', 100, (signals) => signals.fieldType === 'blurred' || signals.nextAspectPlanet === 'neptune' || signals.moonSign === 'pisces'),
  rule('careful', 'tarot', 'резкие выводы на напряженном фоне', 70, (signals) => signals.nextAspectType === 'tense'),

  rule('good', 'candles', 'защита', 70, (signals) => ['mars', 'saturn'].includes(signals.planetaryHour)),
  rule('good', 'candles', 'чистки', 70, (signals) => signals.isCleansingMoment),
  rule('good', 'candles', 'закрепление', 70, (signals) => signals.isStableDay || signals.planetaryHour === 'saturn'),
  rule('good', 'candles', 'намерение', 40, () => true),
  rule('good', 'candles', 'мягкие гармонизирующие практики', 40, (signals) => signals.planetaryHour === 'venus' || signals.nextAspectPlanet === 'venus'),
  rule('careful', 'candles', 'программные свечи на Луне без курса', 100, (signals) => signals.activeVoc),
  rule('careful', 'candles', 'любовные свечи на нервном фоне', 100, (signals) => signals.nextAspectType === 'tense' && ['mars', 'uranus'].includes(signals.nextAspectPlanet)),
  rule('careful', 'candles', 'практики из злости', 100, (signals) => signals.hasWarnings || signals.lunarDay === 23),
  rule('careful', 'candles', 'смешивать чистку и программирование', 40, () => true),

  rule('good', 'money', 'продажи', 70, (signals) => ['sun', 'venus', 'jupiter'].includes(signals.planetaryHour)),
  rule('good', 'money', 'работа с клиентами', 70, (signals) => ['venus', 'jupiter'].includes(signals.planetaryHour)),
  rule('good', 'money', 'фиксация договоренностей', 70, (signals) => signals.planetaryHour === 'mercury' || signals.isStableDay),
  rule('good', 'money', 'переговоры', 40, () => true),
  rule('good', 'money', 'системные финансовые действия', 40, (signals) => signals.isStableDay || signals.moonElement === 'earth'),
  rule('careful', 'money', 'запуск нового на Луне без курса', 100, (signals) => signals.activeVoc),
  rule('careful', 'money', 'жесткие решения на нервном фоне', 100, (signals) => signals.fieldType === 'nervous' || signals.nextAspectType === 'tense'),
  rule('careful', 'money', 'обещания на размытом фоне', 101, (signals) => signals.fieldType === 'blurred' || signals.moonSign === 'pisces' || signals.nextAspectPlanet === 'neptune'),
  rule('careful', 'money', 'импульсивные финансовые решения', 40, () => true),

  rule('good', 'relationships', 'примирение', 70, (signals) => ['venus', 'moon'].includes(signals.planetaryHour)),
  rule('good', 'relationships', 'гармонизация', 70, (signals) => signals.planetaryHour === 'venus' || signals.nextAspectPlanet === 'venus'),
  rule('good', 'relationships', 'мягкие разговоры', 40, () => true),
  rule('good', 'relationships', 'проявление внимания', 40, (signals) => ['venus', 'moon', 'sun'].includes(signals.planetaryHour)),
  rule('good', 'relationships', 'красота', 40, (signals) => signals.planetaryHour === 'venus'),
  rule('careful', 'relationships', 'резкие разговоры', 100, (signals) => signals.nextAspectType === 'tense' && ['mars', 'uranus'].includes(signals.nextAspectPlanet)),
  rule('careful', 'relationships', 'выяснение отношений на нервном фоне', 100, (signals) => signals.fieldType === 'nervous'),
  rule('careful', 'relationships', 'обещания на размытом фоне', 100, (signals) => signals.fieldType === 'blurred' || signals.nextAspectPlanet === 'neptune'),
  rule('careful', 'relationships', 'давление вместо диалога', 40, () => true),

  rule('good', 'cleansing', 'чистки', 100, (signals) => signals.lunarDay === 29),
  rule('good', 'cleansing', 'закрыть старое', 70, (signals) => signals.isCleansingMoment || signals.lunarDay === 29),
  rule('good', 'cleansing', 'защита', 70, (signals) => ['mars', 'saturn'].includes(signals.planetaryHour)),
  rule('good', 'cleansing', 'стабилизация', 70, (signals) => signals.planetaryHour === 'saturn' || signals.fieldType === 'dense'),
  rule('good', 'cleansing', 'убрать лишнее', 40, () => true),
  rule('good', 'cleansing', 'телесные практики', 40, (signals) => signals.planetaryHour === 'moon' || signals.fieldType === 'dense'),
  rule('careful', 'cleansing', 'чистки из злости', 100, (signals) => signals.lunarDay === 23 || signals.hasWarnings),
  rule('careful', 'cleansing', 'действовать на импульсе', 100, (signals) => signals.nextAspectType === 'tense' && ['mars', 'uranus'].includes(signals.nextAspectPlanet)),
  rule('careful', 'cleansing', 'смешивать чистку и программирование', 70, () => true),

  rule('good', 'forecasts', 'проверка гипотез', 70, (signals) => signals.planetaryHour === 'mercury'),
  rule('good', 'forecasts', 'планирование', 70, (signals) => ['mercury', 'jupiter'].includes(signals.planetaryHour)),
  rule('good', 'forecasts', 'мягкая диагностика', 70, (signals) => signals.moonElement === 'water' || signals.planetaryHour === 'moon'),
  rule('good', 'forecasts', 'сценарии', 40, () => true),
  rule('good', 'forecasts', 'записи', 40, () => true),
  rule('careful', 'forecasts', 'окончательные выводы на размытом фоне', 100, (signals) => signals.fieldType === 'blurred' || signals.moonSign === 'pisces' || signals.nextAspectPlanet === 'neptune'),
  rule('careful', 'forecasts', 'прогнозы из тревоги', 100, (signals) => signals.hasWarnings),
  rule('careful', 'forecasts', 'обещания на Луне без курса', 100, (signals) => signals.activeVoc),
  rule('careful', 'forecasts', 'слишком жесткие выводы', 40, () => true),
];

export function getModeRecommendations(mode, context = {}, fieldQuality = {}) {
  const safeMode = isDashboardModeKey(mode) ? mode : DEFAULT_DASHBOARD_MODE;
  const signals = getSignals(context, fieldQuality);
  if (safeMode === DEFAULT_DASHBOARD_MODE) {
    return {
      good: cleanItems(fieldQuality.supports).slice(0, 3),
      careful: collectGeneralCareful(signals, fieldQuality),
    };
  }
  const rules = [...SAFETY_RULES, ...MODE_RULES]
    .filter((item) => item.mode === '*' || item.mode === safeMode)
    .filter((item) => item.when(signals));

  return {
    good: collectRules(rules, 'good', getFallbackGood(safeMode, fieldQuality)),
    careful: collectRules(rules, 'careful', getFallbackCareful(safeMode, fieldQuality)),
  };
}

function collectGeneralCareful(signals, fieldQuality) {
  const safety = SAFETY_RULES
    .filter((item) => item.when(signals))
    .sort((left, right) => right.priority - left.priority)
    .map((item) => item.text);
  return cleanItems([...safety, ...(fieldQuality.avoid ?? [])]).slice(0, 3);
}

function getSignals(context, fieldQuality) {
  const nextAspect = context.moonAspects?.next;
  const moonSign = context.moonSign?.current?.key;
  const lunarDay = context.lunar?.lunarDay;
  const planetaryHour = context.planetaryHour?.key;
  const dayOfficer = context.indicators?.dayOfficer?.key;

  return {
    activeVoc: Boolean(context.voc?.isActive),
    upcomingVoc: context.voc?.status === 'upcoming',
    hasWarnings: Array.isArray(context.warnings) && context.warnings.length > 0,
    nextAspectType: getAspectType(nextAspect?.aspect),
    nextAspectPlanet: nextAspect?.planet,
    planetaryHour,
    moonSign,
    moonElement: getMoonElement(moonSign),
    lunarDay,
    fieldType: getFieldType(fieldQuality),
    isStableDay: STABLE_OFFICERS.has(dayOfficer),
    isCleansingMoment: context.lunar?.waxing === false || CLEANSING_OFFICERS.has(dayOfficer) || lunarDay === 29,
  };
}

function collectRules(rules, type, fallback) {
  const items = rules
    .filter((item) => item.type === type)
    .sort((left, right) => right.priority - left.priority)
    .map((item) => item.text);
  const cleaned = cleanItems(items);
  return cleaned.length ? cleaned.slice(0, 3) : cleanItems(fallback).slice(0, 3);
}

function getFallbackGood(mode, fieldQuality) {
  if (mode === DEFAULT_DASHBOARD_MODE) return fieldQuality.supports;
  return {
    tarot: ['диагностика', 'формулировка вопросов', 'записи'],
    candles: ['намерение', 'закрепление', 'мягкие гармонизирующие практики'],
    money: ['переговоры', 'системные финансовые действия', 'работа с клиентами'],
    relationships: ['мягкие разговоры', 'проявление внимания', 'красота'],
    cleansing: ['убрать лишнее', 'закрыть старое', 'защита'],
    forecasts: ['сценарии', 'записи', 'проверка гипотез'],
  }[mode] ?? fieldQuality.supports;
}

function getFallbackCareful(mode, fieldQuality) {
  if (mode === DEFAULT_DASHBOARD_MODE) return fieldQuality.avoid;
  return {
    tarot: ['окончательные выводы без проверки'],
    candles: ['смешивать чистку и программирование'],
    money: ['импульсивные финансовые решения'],
    relationships: ['давление вместо диалога'],
    cleansing: ['смешивать чистку и программирование'],
    forecasts: ['слишком жесткие выводы'],
  }[mode] ?? fieldQuality.avoid;
}

function rule(type, mode, text, priority, when) {
  return {
    type,
    mode,
    text,
    priority,
    when,
  };
}

function getAspectType(aspect) {
  if (aspect === 0) return 'conjunction';
  if (SOFT_ASPECTS.has(aspect)) return 'harmonious';
  if (HARD_ASPECTS.has(aspect)) return 'tense';
  return '';
}

function getMoonElement(sign) {
  if (WATER_SIGNS.has(sign)) return 'water';
  if (EARTH_SIGNS.has(sign)) return 'earth';
  if (FIRE_SIGNS.has(sign)) return 'fire';
  if (AIR_SIGNS.has(sign)) return 'air';
  return '';
}

function getFieldType(fieldQuality) {
  const summary = fieldQuality.summary ?? '';
  if (summary.startsWith('Поле тонкое')) return 'thin';
  if (summary.startsWith('Поле нервное')) return 'nervous';
  if (summary.startsWith('Поле плотное')) return 'dense';
  if (summary.startsWith('Поле очищающее')) return 'cleansing';
  if (summary.startsWith('Поле размытое')) return 'blurred';
  if (summary.startsWith('Поле денежное')) return 'money';
  return 'stable';
}

function cleanItems(items = []) {
  return [...new Set(items)]
    .filter((item) => typeof item === 'string')
    .map((item) => item.trim())
    .filter((item) => item && !item.includes('undefined') && !item.includes('null'));
}
