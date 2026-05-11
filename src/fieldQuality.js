const WATER_SIGNS = new Set(['cancer', 'scorpio', 'pisces']);
const EARTH_SIGNS = new Set(['taurus', 'virgo', 'capricorn']);
const SOFT_ASPECTS = new Set([60, 120]);
const HARD_ASPECTS = new Set([90, 180]);
const SOFT_PLANETS = new Set(['venus', 'jupiter']);
const INTUITIVE_PLANETS = new Set(['moon', 'neptune']);
const HARD_PLANETS = new Set(['mars', 'saturn', 'uranus', 'pluto']);
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

  return {
    summary: summarize(context, scores),
    scores,
    reasons: getReasons(context),
    metrics: [
      toMetric('intuition', 'Интуиция', scores.intuition),
      toMetric('material', 'Материальные дела', scores.material),
      toMetric('rituals', 'Ритуалы', scores.rituals),
    ],
  };
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
  const sign = context.moonSign?.current?.key;
  const officer = context.indicators?.dayOfficer?.key;
  const aspects = getRelevantAspects(context);

  if (context.voc?.isActive || aspects.some(isHardDisruptiveAspect) || CAUTION_OFFICERS.has(officer)) {
    return 'Поле нестабильно: лучше завершать и чистить, а не начинать.';
  }

  if (WATER_SIGNS.has(sign) && scores.intuition.level === 'высоко') {
    return 'Поле тонкое: хорошо для интуиции, Таро и снов.';
  }

  if (STABLE_OFFICERS.has(officer) && scores.material.level === 'высоко') {
    return 'Поле устойчиво, подходит для закрепления решений.';
  }

  return 'Поле рабочее: лучше действовать спокойно и без перегруза.';
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

function toMetric(key, label, score) {
  return { key, label, ...score };
}

function toScore(value) {
  const score = Math.max(1, Math.min(10, value));
  return {
    score,
    level: score >= 7 ? 'высоко' : score <= 4 ? 'низко' : 'средне',
  };
}
