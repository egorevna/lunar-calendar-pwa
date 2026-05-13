import { formatTime } from './format.js';

const MAJOR_ASPECTS = new Set([0, 60, 90, 120, 180]);

const ASPECT_GLYPHS = {
  0: '☌',
  60: '✶',
  90: '□',
  120: '△',
  180: '☍',
};

const PLANET_NAMES = {
  sun: 'Солнце',
  mercury: 'Меркурий',
  venus: 'Венера',
  mars: 'Марс',
  jupiter: 'Юпитер',
  saturn: 'Сатурн',
  uranus: 'Уран',
  neptune: 'Нептун',
  pluto: 'Плутон',
};

const INTERPRETATIONS = {
  '60:mercury': 'хорошо для раскладов, разговоров, формулировок, записей, диагностики.',
  '90:uranus': 'нервное поле, внезапности, лучше не принимать резких решений.',
  '0:saturn': 'плотный фон, хорошо для дисциплины, границ и серьезных решений; осторожно с тяжестью и зажимом.',
  '120:venus': 'мягкий фон, хорошо для отношений, красоты, примирения, свечей на гармонию.',
  '180:mars': 'острый фон, возможны раздражение и конфликты; лучше не действовать на импульсе.',
};

export function describeMoonAspect(aspect, now = new Date()) {
  if (!isMajorMoonAspect(aspect)) return 'нет данных';

  return `${formatAspectGlyph(aspect.aspect)} ${formatPlanetName(aspect.planet)} · ${formatRelativeDay(now, aspect.at)} ${formatTime(aspect.at)}`;
}

export function describeNextMoonAspect(aspect, now = new Date()) {
  if (!isMajorMoonAspect(aspect)) return 'нет данных';

  return `${describeMoonAspect(aspect, now)} · через ${formatCountdown(now, aspect.at)}`;
}

export function describeMoonAspectInterpretation(aspect) {
  if (!isMajorMoonAspect(aspect)) return '';

  const key = `${aspect.aspect}:${aspect.planet}`;
  const text = INTERPRETATIONS[key] ?? getFallbackInterpretation(aspect.aspect);

  return `Луна ${formatAspectGlyph(aspect.aspect)} ${formatPlanetName(aspect.planet)}: ${text}`;
}

function isMajorMoonAspect(aspect) {
  return aspect?.aspect != null
    && aspect?.planet
    && aspect?.at
    && MAJOR_ASPECTS.has(aspect.aspect);
}

function formatAspectGlyph(aspect) {
  return ASPECT_GLYPHS[aspect] ?? `${aspect}°`;
}

function formatPlanetName(planet) {
  return PLANET_NAMES[planet] ?? planet;
}

function formatRelativeDay(now, date) {
  const today = getMoscowDayStart(now);
  const target = getMoscowDayStart(date);
  const dayDiff = Math.round((target - today) / 86400000);

  if (dayDiff === -1) return 'вчера';
  if (dayDiff === 0) return 'сегодня';
  if (dayDiff === 1) return 'завтра';

  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    timeZone: 'Europe/Moscow',
  }).format(date);
}

function formatCountdown(now, date) {
  const diffMinutes = Math.max(0, Math.floor((date - now) / 60000));
  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;
  return `${hours}ч ${minutes}м`;
}

function getFallbackInterpretation(aspect) {
  if (aspect === 60 || aspect === 120) {
    return 'мягкий фон, хорошо для спокойных действий, настройки и согласования.';
  }

  if (aspect === 90 || aspect === 180) {
    return 'напряженный фон, лучше не принимать резких решений и не действовать на эмоциях.';
  }

  return 'сильный акцент на теме планеты, лучше действовать осознанно.';
}

function getMoscowDayStart(date) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'Europe/Moscow',
  }).format(date);
  return new Date(`${parts}T00:00:00Z`);
}
