const MOSCOW_SHORT_DATE_FORMAT = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'long',
  timeZone: 'Europe/Moscow',
});
const MOSCOW_DAY_FORMAT = new Intl.DateTimeFormat('en-CA', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  timeZone: 'Europe/Moscow',
});

export function describeVoc(voc, now = new Date()) {
  if (!voc) return 'Луна в курсе';

  if (voc.isActive || voc.status === 'active') {
    return [
      'Луна без курса',
      `до ${formatVocTime(voc.end)}`,
      `осталось ${formatDuration(now, voc.end)}`,
    ].join('\n');
  }

  if (voc.status === 'upcoming' && isSameMoscowDay(now, voc.start)) {
    return [
      'Луна без курса начнется',
      `с ${formatVocTime(voc.start)} до ${formatVocTime(voc.end)}`,
      `через ${formatDuration(now, voc.start)}`,
    ].join('\n');
  }

  const next = voc.start ? `${formatVocDate(voc.start)}, ${formatVocTime(voc.start)}` : 'нет данных';
  return [
    'Луна в курсе',
    `Без курса: ${next}`,
  ].join('\n');
}

export function describeVocAspect(voc) {
  if (!voc?.aspect || !voc?.planet) return '';
  return `VOC после: ${formatAspect(voc.aspect)} ${formatPlanet(voc.planet)}`;
}

export function formatAspect(aspect) {
  const glyphs = {
    0: '☌',
    60: '✶',
    90: '□',
    120: '△',
    180: '☍',
  };
  return glyphs[aspect] ?? `${aspect}°`;
}

export function formatPlanet(planet) {
  const names = {
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
  return names[planet] ?? planet;
}

function formatVocTime(date) {
  return new Intl.DateTimeFormat('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Europe/Moscow',
  }).format(date);
}

function formatVocDate(date) {
  return MOSCOW_SHORT_DATE_FORMAT.format(date);
}

function isSameMoscowDay(left, right) {
  return MOSCOW_DAY_FORMAT.format(left) === MOSCOW_DAY_FORMAT.format(right);
}

function formatDuration(from, to) {
  const totalMinutes = Math.max(0, Math.floor((to - from) / 60000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours <= 0) return `${minutes}м`;
  if (minutes <= 0) return `${hours}ч`;
  return `${hours}ч ${minutes}м`;
}
