export function describeVoc(voc) {
  if (!voc?.start || !voc?.end) return 'нет данных';

  if (voc.isActive || voc.status === 'active') {
    return `до ${formatVocTime(voc.end)}`;
  }

  if (voc.status === 'upcoming') {
    return `с ${formatVocTime(voc.start)} до ${formatVocTime(voc.end)}`;
  }

  return 'нет данных';
}

export function describeVocAspect(voc) {
  if (!voc?.aspect || !voc?.planet) return '';
  return [
    `после: ${formatAspect(voc.aspect)} ${formatPlanet(voc.planet)}`,
    getVocBackgroundLabel(voc),
  ].filter(Boolean).join('\n');
}

export function getVocBackgroundLabel(voc) {
  if (!voc?.aspect || !voc?.planet) return '';

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
