import {
  getLunarInfo,
  getMoonSignInfo,
  getPlanetaryHour,
} from './astro.js';
import {
  getPreciseMoonAspectInfo,
  getPreciseMoonSignInfo,
  getPreciseVoidOfCourse,
} from './preciseEphemeris.js';
import { getFieldQuality } from './fieldQuality.js';
import {
  DEFAULT_DASHBOARD_MODE,
  isDashboardModeKey,
} from './dashboardModes.js';

const MOSCOW_OFFSET_MS = 3 * 3600000;
const DEFAULT_SLOT_MINUTES = 60;
const DEFAULT_MAX_WINDOWS = 2;
const GOOD_WINDOW_THRESHOLD = 30;
const HARD_ASPECTS = new Set([90, 180]);
const WATER_SIGNS = new Set(['cancer', 'scorpio', 'pisces']);
const EARTH_SIGNS = new Set(['taurus', 'virgo', 'capricorn']);
const AIR_SIGNS = new Set(['gemini', 'libra', 'aquarius']);
const BEST_WINDOW_TITLES = {
  general: 'Лучшее окно сегодня',
  tarot: 'Лучшее окно для Таро',
  candles: 'Лучшее окно для свечей',
  money: 'Лучшее окно для денег',
  relationships: 'Лучшее окно для отношений',
  cleansing: 'Лучшее окно для чисток',
  forecasts: 'Лучшее окно для прогнозов',
};
const BEST_WINDOW_FALLBACKS = {
  general: 'Сегодня лучше завершать и очищать, а не запускать новое.',
  tarot: 'Сегодня лучше делать мягкую диагностику и записи, а не окончательные прогнозы.',
  candles: 'Сегодня лучше чистки, защита и завершение, а не новые программные свечи.',
  money: 'Сегодня лучше проверять, закрывать хвосты и готовить решения, а не запускать новое.',
  relationships: 'Сегодня лучше мягкость и пауза, а не резкие разговоры и обещания.',
  cleansing: 'Сегодня лучше чистки, отсечение и восстановление, а не новые программы.',
  forecasts: 'Сегодня лучше фиксировать наблюдения и гипотезы, а не делать окончательные выводы.',
};

const MODE_SUPPORT = {
  general: {
    hours: ['sun', 'moon', 'mercury', 'venus', 'jupiter', 'saturn'],
    signs: [],
    fields: ['stable', 'money'],
  },
  tarot: {
    hours: ['moon', 'mercury'],
    signs: ['cancer', 'scorpio', 'pisces'],
    elements: ['water'],
    fields: ['thin'],
  },
  candles: {
    hours: ['mars', 'saturn', 'venus', 'jupiter'],
    signs: [],
    fields: ['stable', 'cleansing'],
  },
  money: {
    hours: ['jupiter', 'mercury', 'sun', 'venus'],
    signs: ['taurus', 'virgo', 'capricorn'],
    elements: ['earth'],
    fields: ['stable', 'money'],
  },
  relationships: {
    hours: ['venus', 'moon', 'mercury'],
    signs: [],
    fields: ['stable', 'thin'],
    softAspects: true,
  },
  cleansing: {
    hours: ['mars', 'saturn'],
    signs: [],
    fields: ['cleansing', 'dense'],
    waning: true,
  },
  forecasts: {
    hours: ['mercury', 'moon', 'jupiter'],
    signs: ['cancer', 'scorpio', 'pisces', 'gemini', 'libra', 'aquarius'],
    elements: ['water', 'air'],
    fields: ['thin'],
  },
};

export function getBestWindows(options = {}) {
  return calculateBestWindows(options).windows;
}

export function getBestWindowsDebug(options = {}) {
  return calculateBestWindows(options).debug;
}

function calculateBestWindows(options = {}) {
  const {
    selectedMode = DEFAULT_DASHBOARD_MODE,
    now = new Date(),
    slotMinutes = DEFAULT_SLOT_MINUTES,
    maxWindows = DEFAULT_MAX_WINDOWS,
    threshold = GOOD_WINDOW_THRESHOLD,
    getVoc = getPreciseVoidOfCourse,
    getMoonAspects = getPreciseMoonAspectInfo,
    getPlanetaryHour: getHour = getPlanetaryHour,
    getMoonSign = getPreciseMoonSignOrFallback,
    getLunar = getLunarInfo,
    getFieldQuality: getField = getFieldQuality,
  } = options;
  const mode = isDashboardModeKey(selectedMode) ? selectedMode : DEFAULT_DASHBOARD_MODE;
  const dayStart = getMoscowDayStart(now);
  const dayEnd = new Date(dayStart.getTime() + 24 * 3600000);
  const slotMs = slotMinutes * 60000;
  const slots = [];
  const rejectedCandidates = [];

  for (let time = dayStart.getTime(); time < dayEnd.getTime(); time += slotMs) {
    const start = new Date(time);
    const end = new Date(Math.min(time + slotMs, dayEnd.getTime()));
    const slot = scoreSlot({
      mode,
      start,
      end,
      getVoc,
      getMoonAspects,
      getHour,
      getMoonSign,
      getLunar,
      getField,
    });
    if (slot && !slot.rejectReasons?.includes('active VOC') && slot.score >= threshold) {
      slots.push(slot);
    } else {
      rejectedCandidates.push(describeRejectedSlot(slot, { start, end, threshold, mode }));
    }
  }

  const windows = mergeSlots(slots)
    .sort((left, right) => right.score - left.score || left.start - right.start)
    .slice(0, maxWindows);
  const view = describeBestWindows(windows, mode);

  return {
    windows,
    debug: {
      selectedMode: mode,
      threshold,
      slotMinutes,
      maxWindows,
      fallback: view.fallback,
      windows,
      rejectedCandidates: rejectedCandidates
        .sort((left, right) => right.score - left.score || left.start - right.start)
        .slice(0, 5),
    },
  };
}

export function describeBestWindows(windows = [], selectedMode = DEFAULT_DASHBOARD_MODE) {
  const safeMode = isDashboardModeKey(selectedMode) ? selectedMode : DEFAULT_DASHBOARD_MODE;
  const visibleWindows = windows.slice(0, DEFAULT_MAX_WINDOWS);

  return {
    hidden: false,
    title: BEST_WINDOW_TITLES[safeMode],
    ranges: visibleWindows.map((window) => formatWindowRange(window.start, window.end)),
    suitableFor: unique(visibleWindows.flatMap((window) => window.suitableFor ?? [])),
    reasons: unique(visibleWindows.flatMap((window) => window.reasons ?? [])),
    cautions: unique(visibleWindows.flatMap((window) => window.cautions ?? [])),
    fallback: visibleWindows.length === 0 ? BEST_WINDOW_FALLBACKS[safeMode] : '',
  };
}

function scoreSlot(context) {
  const {
    mode,
    start,
    end,
    getVoc,
    getMoonAspects,
    getHour,
    getMoonSign,
    getLunar,
    getField,
  } = context;
  const midpoint = new Date((start.getTime() + end.getTime()) / 2);
  const voc = getVoc(midpoint);
  if (voc?.isActive) {
    return {
      start,
      end,
      score: -100,
      label: getModeLabel(mode),
      suitableFor: [],
      reasons: [],
      cautions: ['active VOC'],
      rejectReasons: ['active VOC'],
    };
  }

  const lunar = getLunar(midpoint);
  const moonAspects = getMoonAspects(midpoint) ?? {};
  const moonSign = getMoonSign(midpoint);
  const planetaryHour = getHour(midpoint);
  const fieldQuality = getField({
    now: midpoint,
    lunar,
    voc,
    moonSign,
    moonAspects,
    planetaryHour,
  });
  const signals = {
    moonSign: moonSign?.current?.key,
    moonElement: getMoonElement(moonSign?.current?.key),
    planetaryHour: planetaryHour?.key,
    fieldType: getFieldType(fieldQuality),
    lunar,
    moonAspects,
    warnings: fieldQuality?.warnings ?? [],
  };

  const score = {
    value: 0,
    reasons: [],
    cautions: [],
    suitableFor: [],
  };

  applyPlanetaryHourScore(mode, signals, score);
  applyMoonSignScore(mode, signals, score);
  applyFieldScore(mode, signals, score);
  applyAspectScore(signals, score, midpoint);
  applyWarningScore(signals, score);
  applyModeSpecificScore(mode, signals, score);

  return {
    start,
    end,
    score: score.value,
    label: getModeLabel(mode),
    suitableFor: unique(score.suitableFor),
    reasons: unique(score.reasons),
    cautions: unique(score.cautions),
    rejectReasons: getSlotSignals({ mode, signals, score }),
  };
}

function describeRejectedSlot(slot, context) {
  const base = slot ?? {
    start: context.start,
    end: context.end,
    score: -100,
    reasons: [],
    cautions: [],
    suitableFor: [],
    rejectReasons: ['active VOC'],
  };
  const rejectReasons = [...(base.rejectReasons ?? [])];
  if (base.score < context.threshold) rejectReasons.unshift('low score');

  return {
    start: base.start,
    end: base.end,
    score: base.score,
    reasons: unique(base.reasons ?? []),
    cautions: unique(base.cautions ?? []),
    suitableFor: unique(base.suitableFor ?? []),
    rejectReasons: unique(rejectReasons),
  };
}

function getSlotSignals({ mode, signals, score }) {
  const support = MODE_SUPPORT[mode];
  const reasons = [];
  if (score.cautions.some((caution) => caution.includes('Луна без курса') || caution === 'active VOC')) {
    reasons.push('active VOC');
  }
  if (signals.warnings.length) reasons.push('warnings');
  if (signals.moonAspects?.next && HARD_ASPECTS.has(signals.moonAspects.next.aspect)) {
    reasons.push('tense aspect');
  }
  if (support?.hours.length && !support.hours.includes(signals.planetaryHour)) {
    reasons.push('unsupported planetary hour');
  }
  if (
    (support?.signs.length || support?.elements?.length)
    && !support.signs.includes(signals.moonSign)
    && !(support.elements?.includes(signals.moonElement))
  ) {
    reasons.push('unsupported Moon sign / element');
  }
  return reasons;
}

function applyPlanetaryHourScore(mode, signals, score) {
  const support = MODE_SUPPORT[mode];
  if (support?.hours.includes(signals.planetaryHour)) {
    score.value += 25;
    score.reasons.push('поддерживающий планетарный час');
    score.suitableFor.push(getPlanetaryHourSuitability(signals.planetaryHour));
  }
}

function applyMoonSignScore(mode, signals, score) {
  const support = MODE_SUPPORT[mode];
  if (support?.signs.includes(signals.moonSign) || support?.elements?.includes(signals.moonElement)) {
    score.value += 15;
    score.reasons.push('подходящий знак Луны');
    score.suitableFor.push('работа по выбранному режиму');
  }
}

function applyFieldScore(mode, signals, score) {
  const support = MODE_SUPPORT[mode];
  if (support?.fields.includes(signals.fieldType)) {
    score.value += 15;
    score.reasons.push('поле поддерживает режим');
  } else if (signals.fieldType === 'stable') {
    score.value += 10;
    score.reasons.push('стабильное поле');
  }

  if (signals.fieldType === 'nervous' || signals.fieldType === 'blurred') {
    score.value -= 20;
    score.cautions.push(signals.fieldType === 'blurred' ? 'размытый фон' : 'нервный фон');
  }
}

function applyAspectScore(signals, score, date) {
  const next = signals.moonAspects?.next;
  if (!next?.at || !HARD_ASPECTS.has(next.aspect)) return;

  const diffMs = Math.abs(new Date(next.at).getTime() - date.getTime());
  if (diffMs <= 2 * 3600000) {
    score.value -= 30;
    score.cautions.push('рядом напряженный аспект Луны');
  }
}

function applyWarningScore(signals, score) {
  if (!signals.warnings.length) return;
  score.value -= 20;
  score.cautions.push(signals.warnings[0]);
}

function applyModeSpecificScore(mode, signals, score) {
  if (mode === 'cleansing' && signals.lunar?.waxing === false) {
    score.value += 15;
    score.reasons.push('убывающая Луна поддерживает чистки');
    score.suitableFor.push('чистки и отсечение');
  }
  if (mode === 'relationships' && signals.moonAspects?.next && [60, 120].includes(signals.moonAspects.next.aspect)) {
    score.value += 15;
    score.reasons.push('мягкий аспект Луны');
    score.suitableFor.push('мягкие разговоры');
  }
  if (mode === 'forecasts' && signals.fieldType === 'blurred') {
    score.value -= 15;
    score.cautions.push('не лучший фон для буквальной точности');
  }
  if (mode === 'money' && ['mars', 'uranus'].includes(signals.moonAspects?.next?.planet) && HARD_ASPECTS.has(signals.moonAspects?.next?.aspect)) {
    score.value -= 20;
    score.cautions.push('не лучший фон для резких финансовых решений');
  }
}

function mergeSlots(slots) {
  const windows = [];
  for (const slot of slots) {
    const previous = windows[windows.length - 1];
    if (previous && previous.end.getTime() === slot.start.getTime()) {
      previous.end = slot.end;
      previous.score = Math.round((previous.score + slot.score) / 2);
      previous.suitableFor = unique([...previous.suitableFor, ...slot.suitableFor]);
      previous.reasons = unique([...previous.reasons, ...slot.reasons]);
      previous.cautions = unique([...previous.cautions, ...slot.cautions]);
    } else {
      windows.push({ ...slot });
    }
  }
  return windows;
}

function getPreciseMoonSignOrFallback(date) {
  return getPreciseMoonSignInfo(date) ?? getMoonSignInfo(date);
}

function getMoscowDayStart(date) {
  const shifted = new Date(date.getTime() + MOSCOW_OFFSET_MS);
  return new Date(Date.UTC(
    shifted.getUTCFullYear(),
    shifted.getUTCMonth(),
    shifted.getUTCDate(),
  ) - MOSCOW_OFFSET_MS);
}

function getMoonElement(sign) {
  if (WATER_SIGNS.has(sign)) return 'water';
  if (EARTH_SIGNS.has(sign)) return 'earth';
  if (AIR_SIGNS.has(sign)) return 'air';
  return '';
}

function getFieldType(fieldQuality) {
  const summary = fieldQuality?.summary ?? '';
  if (summary.startsWith('Поле тонкое')) return 'thin';
  if (summary.startsWith('Поле нервное')) return 'nervous';
  if (summary.startsWith('Поле плотное')) return 'dense';
  if (summary.startsWith('Поле очищающее')) return 'cleansing';
  if (summary.startsWith('Поле размытое')) return 'blurred';
  if (summary.startsWith('Поле денежное')) return 'money';
  return 'stable';
}

function getModeLabel(mode) {
  return {
    general: 'Общее',
    tarot: 'Таро',
    candles: 'Свечи',
    money: 'Деньги',
    relationships: 'Отношения',
    cleansing: 'Чистки',
    forecasts: 'Прогнозы',
  }[mode] ?? 'Общее';
}

function formatWindowRange(start, end) {
  return `${formatWindowTime(start)}–${formatWindowTime(end)}`;
}

function formatWindowTime(date) {
  return new Intl.DateTimeFormat('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Europe/Moscow',
  }).format(date);
}

function getPlanetaryHourSuitability(hour) {
  return {
    moon: 'интуиция и тонкая настройка',
    mercury: 'тексты, переговоры и диагностика',
    mars: 'чистки и отсечение',
    sun: 'видимость и статус',
    venus: 'гармония и притяжение',
    jupiter: 'рост и деньги',
    saturn: 'защита и границы',
  }[hour] ?? 'работа по выбранному режиму';
}

function unique(items) {
  return [...new Set(items)].filter(Boolean).slice(0, 3);
}
