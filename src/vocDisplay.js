export function describeVoc(voc, now = new Date()) {
  if (!voc?.start || !voc?.end) return 'нет данных';

  if (voc.isActive || voc.status === 'active') {
    return `до ${formatVocTime(voc.end)}`;
  }

  if (voc.status === 'upcoming') {
    return [
      'Следующая Луна без курса',
      formatVocDay(now, voc.start),
      `с ${formatVocTime(voc.start)} до ${formatVocTime(voc.end)}`,
    ].join('\n');
  }

  return 'нет данных';
}

export function describeVocAspect(voc) {
  if (voc?.aspect == null || !voc?.planet) return '';
  return [
    `после: ${formatAspect(voc.aspect)} ${formatPlanet(voc.planet)}`,
    getVocBackgroundLabel(voc),
  ].filter(Boolean).join('\n');
}

export function getVocBackgroundLabel(voc) {
  if (voc?.aspect == null || !voc?.planet) return '';

  if (voc.planet === 'neptune') return 'фон размытый';
  if (voc.planet === 'saturn') return 'фон тяжелый';
  if (voc.planet === 'mars' || voc.planet === 'uranus') return 'фон нервный';
  if (voc.aspect === 90 || voc.aspect === 180) return 'фон напряженный';
  if (voc.aspect === 60 || voc.aspect === 120) return 'фон мягкий';

  return '';
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

function formatVocDay(now, date) {
  const today = getMoscowDayStart(now);
  const target = getMoscowDayStart(date);
  const dayDiff = Math.round((target - today) / 86400000);

  if (dayDiff === 0) return 'сегодня';
  if (dayDiff === 1) return 'завтра';

  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    timeZone: 'Europe/Moscow',
  }).format(date);
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
