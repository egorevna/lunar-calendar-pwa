const WATER_SIGNS = new Set(['cancer', 'scorpio', 'pisces']);
const EARTH_SIGNS = new Set(['taurus', 'virgo', 'capricorn']);
const SOFT_ASPECTS = new Set([60, 120]);
const HARD_ASPECTS = new Set([90, 180]);
const SOFT_PLANETS = new Set(['venus', 'jupiter']);
const INTUITIVE_PLANETS = new Set(['moon', 'neptune']);
const HARD_PLANETS = new Set(['mars', 'saturn', 'uranus', 'pluto']);
const DENSE_PLANETS = new Set(['saturn']);
const BLURRED_PLANETS = new Set(['neptune']);
const MATERIAL_HOURS = new Set(['sun', 'venus', 'jupiter', 'saturn']);
const RITUAL_HOURS = new Set(['moon', 'mars', 'saturn']);
const STABLE_OFFICERS = new Set(['stable', 'success', 'receive', 'open']);
const CAUTION_OFFICERS = new Set(['danger', 'destruction', 'close']);
const CLEANSING_OFFICERS = new Set(['remove', 'destruction']);
const HARD_ASPECT_ECHO_MS = 4 * 3600000;

export function getFieldQuality(context) {
  const scores = {
    intuition: scoreIntuition(context),
    material: scoreMaterial(context),
    rituals: scoreRituals(context),
  };
  const field = getFieldState(context, scores);

  return {
    summary: field.summary,
    advice: field.advice,
    scores,
    reasons: getReasons(context),
    supports: getSupports(context, scores),
    avoid: getAvoid(context, scores),
    warnings: getWarnings(context),
    metrics: [
      toMetric('intuition', 'Интуиция', scores.intuition),
      toMetric('material', 'Материальные дела', scores.material),
      toMetric('rituals', 'Ритуалы', scores.rituals),
    ],
  };
}

function getSupports(context, scores) {
  const items = [];
  const sign = context.moonSign?.current?.key;
  const officer = context.indicators?.dayOfficer?.key;
  const hour = context.planetaryHour?.key;

  if (context.voc?.isActive) items.push('завершение начатого');
  if (WATER_SIGNS.has(sign) || scores.intuition.level === 'высоко') items.push('Таро и диагностика');
  if (STABLE_OFFICERS.has(officer)) items.push('закрепление решений');
  if (CLEANSING_OFFICERS.has(officer) || (!context.lunar?.waxing && (context.lunar?.illumination ?? 0.5) < 0.35)) {
    items.push('чистки и отсечение');
  }
  if (scores.material.level === 'высоко') items.push('спокойные договоренности');
  if (RITUAL_HOURS.has(hour) || scores.rituals.level === 'высоко') items.push('ритуальная работа');

  return uniqueFirst(items, 3);
}

function getAvoid(context, scores) {
  const items = [];
  const officer = context.indicators?.dayOfficer?.key;
  const aspects = getRelevantAspects(context);

  if (context.voc?.isActive) items.push('запуск новых дел');
  if (aspects.some(isHardDisruptiveAspect)) items.push('импульсивные решения');
  if (CAUTION_OFFICERS.has(officer)) items.push('рисковые старты');
  if (scores.material.level !== 'высоко') items.push('жесткие финансовые решения');
  if (scores.intuition.level === 'высоко') items.push('жесткие разговоры');
  if (STABLE_OFFICERS.has(officer)) items.push('хаотичные развороты');

  return uniqueFirst(items, 3);
}

function getReasons(context) {
  const reasons = [];
  const sign = context.moonSign?.current?.key;
  const officer = context.indicators?.dayOfficer?.key;
  const hour = context.planetaryHour?.key;
  const aspects = getRelevantAspects(context);

  if (context.voc?.isActive) {
    reasons.push('Луна без курса снижает надежность стартов и материальных решений.');
  }
  if (WATER_SIGNS.has(sign)) {
    reasons.push('Водный знак Луны усиливает интуицию и сновидческое поле.');
  }
  if (EARTH_SIGNS.has(sign)) {
    reasons.push('Земной знак Луны поддерживает практические и материальные дела.');
  }
  if (STABLE_OFFICERS.has(officer)) {
    reasons.push('Стабильный индикатор дня поддерживает закрепление результата.');
  }
  if (CLEANSING_OFFICERS.has(officer)) {
    reasons.push('Индикатор дня поддерживает очищение, отсечение и завершение.');
  }
  if (aspects.some(isSoftBeneficAspect)) {
    reasons.push('Мягкий аспект к Венере или Юпитеру смягчает поле.');
  }
  if (aspects.some(isHardDisruptiveAspect)) {
    reasons.push('Напряженный аспект к жесткой планете повышает фон осторожности.');
  }
  if (RITUAL_HOURS.has(hour)) {
    reasons.push('Планетарный час поддерживает ритуальную работу.');
  }

  return reasons.length ? reasons : ['Явных усилителей или красных флагов немного.'];
}

function getWarnings(context) {
  const warnings = [];
  const sign = context.moonSign?.current?.key;
  const lunarDay = context.lunar?.lunarDay;
  const nextAspect = context.moonAspects?.next;

  if (context.voc?.isActive && context.voc?.end) {
    warnings.push(`Луна без курса до ${formatWarningTime(context.voc.end)} — лучше не начинать важное.`);
  } else if (isUpcomingVocToday(context)) {
    warnings.push(`VOC с ${formatWarningTime(context.voc.start)} — важные запуски лучше сделать до этого времени.`);
  }

  const aspectWarning = getHardAspectWarning(nextAspect);
  if (aspectWarning) warnings.push(aspectWarning);

  if (lunarDay === 23) {
    warnings.push('23 лунные сутки — не делать магию из злости.');
  }
  if (lunarDay === 29) {
    warnings.push('29 лунные сутки — лучше чистки, не запуск нового.');
  }
  if (sign === 'pisces') {
    warnings.push('Луна в Рыбах — риск иллюзий и эмоциональной размытости.');
  }

  return uniqueFirst(warnings, 3);
}

function isUpcomingVocToday(context) {
  if (context.voc?.status !== 'upcoming' || !context.voc?.start || !context.now) return false;
  return getMoscowDateKey(context.voc.start) === getMoscowDateKey(context.now);
}

function getHardAspectWarning(aspect) {
  if (!aspect || !HARD_ASPECTS.has(aspect.aspect)) return '';

  const planet = formatWarningPlanet(aspect.planet);
  if (!planet) return '';

  if (aspect.planet === 'mars') {
    return 'Напряженный аспект Луны к Марсу — выше риск конфликтов и импульсивности.';
  }
  if (aspect.planet === 'uranus') {
    return 'Напряженный аспект Луны к Урану — возможны резкие реакции.';
  }

  return `Напряженный аспект Луны к ${planet} — лучше действовать осторожнее.`;
}

function scoreIntuition(context) {
  let score = 5;
  const sign = context.moonSign?.current?.key;
  const hour = context.planetaryHour?.key;
  const aspects = getRelevantAspects(context);

  if (WATER_SIGNS.has(sign)) score += 2;
  if (hour === 'moon') score += 1;
  if (aspects.some((aspect) => aspect?.planet === 'neptune' && SOFT_ASPECTS.has(aspect.aspect))) score += 2;
  if (aspects.some(isHardDisruptiveAspect)) score -= 1;
  if (context.voc?.isActive) score -= 1;

  return toScore(score);
}

function scoreMaterial(context) {
  let score = 5;
  const sign = context.moonSign?.current?.key;
  const hour = context.planetaryHour?.key;
  const officer = context.indicators?.dayOfficer?.key;
  const aspects = getRelevantAspects(context);

  if (EARTH_SIGNS.has(sign)) score += 1;
  if (STABLE_OFFICERS.has(officer)) score += 2;
  if (MATERIAL_HOURS.has(hour)) score += 1;
  if (aspects.some(isSoftBeneficAspect)) score += 1;
  if (context.voc?.isActive) score -= 3;
  if (CAUTION_OFFICERS.has(officer)) score -= 1;
  if (aspects.some(isHardDisruptiveAspect)) score -= 2;

  return toScore(score);
}

function scoreRituals(context) {
  let score = 5;
  const hour = context.planetaryHour?.key;
  const officer = context.indicators?.dayOfficer?.key;
  const illumination = context.lunar?.illumination ?? 0.5;
  const aspects = getRelevantAspects(context);

  if (RITUAL_HOURS.has(hour)) score += 1;
  if (CLEANSING_OFFICERS.has(officer) || STABLE_OFFICERS.has(officer)) score += 1;
  if (!context.lunar?.waxing && illumination < 0.35) score += 1;
  if (aspects.some(isSoftBeneficAspect)) score += 1;
  if (aspects.some(isHardDisruptiveAspect) && !context.voc?.isActive) score += 1;
  if (context.voc?.isActive) score -= 1;

  return toScore(score);
}

function summarize(context, scores) {
  return getFieldState(context, scores).summary;
}

function getFieldState(context, scores) {
  const sign = context.moonSign?.current?.key;
  const officer = context.indicators?.dayOfficer?.key;
  const hour = context.planetaryHour?.key;
  const illumination = context.lunar?.illumination ?? 0.5;
  const aspects = getRelevantAspects(context);

  if (aspects.some(isHardNeptuneAspect)) {
    return {
      summary: 'Поле размытое: осторожно с обещаниями, договорами и ожиданиями.',
      advice: 'Проверять обещания и ожидания; лучше не строить решения на туманных вводных.',
    };
  }

  if (aspects.some(isHardMarsOrUranusAspect) || (aspects.some(isHardDisruptiveAspect) && CAUTION_OFFICERS.has(officer))) {
    return {
      summary: 'Поле нервное: возможны резкие реакции и сбои планов.',
      advice: 'Не действовать на раздражении; важные решения лучше отложить до более спокойного фона.',
    };
  }

  if (context.voc?.isActive || CLEANSING_OFFICERS.has(officer) || (!context.lunar?.waxing && illumination < 0.25)) {
    return {
      summary: 'Поле очищающее: хорошо завершать, убирать и отсекать лишнее.',
      advice: 'Сначала чистка, завершение и отсечение лишнего; новые запуски лучше отложить.',
    };
  }

  if (aspects.some(isSaturnAspect) || (hour === 'saturn' && EARTH_SIGNS.has(sign))) {
    return {
      summary: 'Поле плотное: хорошо для телесных практик, защиты и стабилизации.',
      advice: 'Сначала стабилизация, границы и дисциплина, потом действие.',
    };
  }

  if (WATER_SIGNS.has(sign) && scores.intuition.level === 'высоко') {
    return {
      summary: 'Поле тонкое: хорошо для интуиции, Таро и снов.',
      advice: 'Хороший момент для диагностики, Таро, снов и тонкой настройки.',
    };
  }

  if (scores.material.level === 'высоко' && aspects.some(isSoftBeneficAspect) && MATERIAL_HOURS.has(hour)) {
    return {
      summary: 'Поле денежное: хорошо для практик на ресурс, клиентов и устойчивый доход.',
      advice: 'Работать с ресурсом и клиентами спокойно, без резких обещаний.',
    };
  }

  if (STABLE_OFFICERS.has(officer) && scores.material.level === 'высоко') {
    return {
      summary: 'Поле устойчивое: хорошо для закрепления результата.',
      advice: 'Лучше закреплять, а не резко менять.',
    };
  }

  return {
    summary: 'Поле устойчивое: хорошо для закрепления результата.',
    advice: 'Действовать спокойно и без перегруза.',
  };
}

function isSoftBeneficAspect(aspect) {
  return aspect && SOFT_ASPECTS.has(aspect.aspect) && SOFT_PLANETS.has(aspect.planet);
}

function getRelevantAspects(context) {
  return [
    isRecentHardAspect(context.moonAspects?.previous, context.now) ? context.moonAspects.previous : null,
    context.moonAspects?.next,
  ].filter(Boolean);
}

function isRecentHardAspect(aspect, now) {
  if (!isHardDisruptiveAspect(aspect)) return true;
  if (!now || !aspect.at) return true;

  const aspectTime = new Date(aspect.at).getTime();
  const nowTime = new Date(now).getTime();
  return nowTime - aspectTime <= HARD_ASPECT_ECHO_MS;
}

function isHardDisruptiveAspect(aspect) {
  return aspect && HARD_ASPECTS.has(aspect.aspect) && HARD_PLANETS.has(aspect.planet);
}

function isHardMarsOrUranusAspect(aspect) {
  return aspect && HARD_ASPECTS.has(aspect.aspect) && (aspect.planet === 'mars' || aspect.planet === 'uranus');
}

function isHardNeptuneAspect(aspect) {
  return aspect && HARD_ASPECTS.has(aspect.aspect) && BLURRED_PLANETS.has(aspect.planet);
}

function isSaturnAspect(aspect) {
  return aspect && DENSE_PLANETS.has(aspect.planet);
}

function toMetric(key, label, score) {
  return { key, label, ...score };
}

function uniqueFirst(items, limit) {
  return [...new Set(items)].slice(0, limit);
}

function formatWarningTime(date) {
  return new Intl.DateTimeFormat('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Europe/Moscow',
  }).format(date);
}

function getMoscowDateKey(date) {
  const shifted = new Date(new Date(date).getTime() + 3 * 3600000);
  return shifted.toISOString().slice(0, 10);
}

function formatWarningPlanet(planet) {
  const names = {
    mars: 'Марсу',
    saturn: 'Сатурну',
    uranus: 'Урану',
    neptune: 'Нептуну',
    pluto: 'Плутону',
  };
  return names[planet] ?? '';
}

function toScore(value) {
  const score = Math.max(1, Math.min(10, value));
  return {
    score,
    level: score >= 7 ? 'высоко' : score <= 4 ? 'низко' : 'средне',
  };
}
