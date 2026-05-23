const ACTIVE_MAJOR_ASPECT_KEYS = Object.freeze([
  'conjunction',
  'sextile',
  'square',
  'trine',
  'opposition',
]);

const TENSE_ASPECT_KEYS = new Set(['square', 'opposition']);
const HARMONIOUS_ASPECT_KEYS = new Set(['trine', 'sextile']);
const CONJUNCTION_ASPECT_KEY = 'conjunction';

const NATAL_ASPECT_DISPLAY_LIMITATIONS = Object.freeze([
  'Это натальные аспекты между планетами, не транзиты.',
  'Аспекты к ASC/MC, домам и точкам будут добавлены отдельно.',
]);

export function formatNatalAspect(aspect) {
  if (!isDisplayableNatalAspect(aspect)) {
    return null;
  }

  const bodyA = normalizeText(aspect.bodyA.label);
  const bodyB = normalizeText(aspect.bodyB.label);
  const aspectName = normalizeText(aspect.aspect.ru);
  const symbol = normalizeText(aspect.aspect.symbol) || aspectName;
  const orbText = getDisplayOrbText(aspect);

  return {
    bodyA,
    bodyB,
    aspect: aspectName,
    symbol,
    orbText,
    strength: normalizeText(aspect.strength),
    text: `${bodyA} ${symbol} ${bodyB} · орб ${orbText}`,
  };
}

export function formatNatalAspectList(aspects) {
  if (!Array.isArray(aspects)) {
    return [];
  }

  return aspects.map(formatNatalAspect).filter(Boolean);
}

export function summarizeNatalAspects(aspects) {
  const displayable = Array.isArray(aspects) ? aspects.filter(isDisplayableNatalAspect) : [];
  const total = displayable.length;
  const tense = displayable.filter((aspect) => TENSE_ASPECT_KEYS.has(aspect.aspect.key)).length;
  const harmonious = displayable.filter((aspect) => HARMONIOUS_ASPECT_KEYS.has(aspect.aspect.key)).length;
  const conjunctions = displayable.filter((aspect) => aspect.aspect.key === CONJUNCTION_ASPECT_KEY).length;

  if (total === 0) {
    return {
      total,
      tense,
      harmonious,
      conjunctions,
      text: 'Мажорные аспекты в заданном орбе не найдены.',
    };
  }

  const details = [];

  if (tense > 0) {
    details.push(`${tense} ${pluralize(tense, 'напряженный', 'напряженных', 'напряженных')}`);
  }

  if (harmonious > 0) {
    details.push(`${harmonious} ${pluralize(harmonious, 'гармоничный', 'гармоничных', 'гармоничных')}`);
  }

  if (conjunctions > 0) {
    details.push(`${conjunctions} ${pluralize(conjunctions, 'соединение', 'соединения', 'соединений')}`);
  }

  return {
    total,
    tense,
    harmonious,
    conjunctions,
    text: [
      `${total} ${pluralize(total, 'аспект найден', 'аспекта найдено', 'аспектов найдено')}`,
      ...details,
    ].join(' · '),
  };
}

export function getNatalAspectDisplayLimitations() {
  return [...NATAL_ASPECT_DISPLAY_LIMITATIONS];
}

export function isDisplayableNatalAspect(aspect) {
  if (!isPlainObject(aspect) || !isPlainObject(aspect.bodyA) || !isPlainObject(aspect.bodyB)) {
    return false;
  }

  if (!isPlainObject(aspect.aspect) || !ACTIVE_MAJOR_ASPECT_KEYS.includes(aspect.aspect.key)) {
    return false;
  }

  return Boolean(
    normalizeText(aspect.bodyA.label)
      && normalizeText(aspect.bodyB.label)
      && (normalizeText(aspect.aspect.symbol) || normalizeText(aspect.aspect.ru))
      && getDisplayOrbText(aspect),
  );
}

function getDisplayOrbText(aspect) {
  const existing = normalizeText(aspect?.orbText);

  if (existing) {
    return existing;
  }

  return formatOrb(aspect?.orb);
}

function formatOrb(orb) {
  if (!Number.isFinite(orb) || orb < 0) {
    return '';
  }

  const degrees = Math.floor(orb);
  const minutes = Math.floor((orb - degrees) * 60);

  return `${degrees}°${String(minutes).padStart(2, '0')}′`;
}

function pluralize(count, one, few, many) {
  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod10 === 1 && mod100 !== 11) {
    return one;
  }

  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return few;
  }

  return many;
}

function normalizeText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}
