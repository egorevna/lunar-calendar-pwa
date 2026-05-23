const ESSENTIAL_DIGNITY_DISPLAY_LIMITATIONS = Object.freeze([
  'Это базовые достоинства по знаку, без термов, деканов и управителей градусов.',
  'Термы, деканы и таблицы Вронского будут добавлены отдельно.',
]);

const SIGN_PREPOSITIONAL_LABELS = Object.freeze({
  Овен: 'Овне',
  Телец: 'Тельце',
  Близнецы: 'Близнецах',
  Рак: 'Раке',
  Лев: 'Льве',
  Дева: 'Деве',
  Весы: 'Весах',
  Скорпион: 'Скорпионе',
  Стрелец: 'Стрельце',
  Козерог: 'Козероге',
  Водолей: 'Водолее',
  Рыбы: 'Рыбах',
});

export function formatEssentialDignity(result) {
  if (!isDisplayableEssentialDignity(result)) {
    return null;
  }

  const planet = normalizeText(result.planetLabel);
  const sign = normalizeText(result.signLabel);
  const labels = normalizeTextArray(result.labels);
  const modernLabels = normalizeTextArray(result.modernLabels);
  const displayLabels = [...labels, ...modernLabels];
  const labelText = displayLabels.length > 0 ? displayLabels.join(', ') : 'нейтрально';

  return {
    planet,
    sign,
    labels,
    modernLabels,
    score: result.score,
    scoreText: formatScoreText(result.score),
    type: getEssentialDignityDisplayType(result),
    text: `${planet} в ${formatSignInPrepositional(sign)} — ${labelText}`,
  };
}

export function formatEssentialDignityList(results) {
  if (!Array.isArray(results)) {
    return [];
  }

  return results.map(formatEssentialDignity).filter(Boolean);
}

export function summarizeEssentialDignities(results) {
  const displayable = Array.isArray(results) ? results.filter(isDisplayableEssentialDignity) : [];
  const total = displayable.length;
  const dignified = displayable.filter(hasClassicalDignity).length;
  const debilitated = displayable.filter(hasClassicalDebility).length;
  const modern = displayable.filter((result) => (
    result.dignities.modernRulership
      && !hasClassicalDignity(result)
      && !hasClassicalDebility(result)
  )).length;
  const neutral = displayable.filter((result) => (
    !hasClassicalDignity(result)
      && !hasClassicalDebility(result)
      && !result.dignities.modernRulership
  )).length;
  const scoreTotal = displayable.reduce((totalScore, result) => totalScore + result.score, 0);

  return {
    total,
    dignified,
    debilitated,
    neutral,
    modern,
    scoreTotal,
    text: getSummaryText(total, dignified, debilitated),
  };
}

export function getEssentialDignityDisplayLimitations() {
  return [...ESSENTIAL_DIGNITY_DISPLAY_LIMITATIONS];
}

export function isDisplayableEssentialDignity(result) {
  if (!isPlainObject(result) || !isPlainObject(result.dignities)) {
    return false;
  }

  return Boolean(
    normalizeText(result.planetLabel)
      && normalizeText(result.signLabel)
      && Number.isFinite(result.score)
      && Array.isArray(result.labels)
      && Array.isArray(result.modernLabels)
      && result.labels.every(isSafeLabel)
      && result.modernLabels.every(isSafeLabel),
  );
}

function getEssentialDignityDisplayType(result) {
  const hasPositive = hasClassicalDignity(result);
  const hasNegative = hasClassicalDebility(result);
  const hasModernOnly = result.dignities.modernRulership && !hasPositive && !hasNegative && result.score === 0;

  if (hasPositive && hasNegative) {
    return 'mixed';
  }

  if (hasPositive && result.score > 0) {
    return 'dignified';
  }

  if (hasNegative && result.score < 0) {
    return 'debilitated';
  }

  if (hasModernOnly) {
    return 'modern';
  }

  return 'neutral';
}

function getSummaryText(total, dignified, debilitated) {
  if (total === 0) {
    return 'Базовые достоинства не рассчитаны.';
  }

  if (dignified === 0 && debilitated === 0) {
    return 'Ярко выраженных базовых достоинств или слабостей не найдено.';
  }

  return `${dignified} ${pluralize(dignified, 'достоинство', 'достоинства', 'достоинств')} · ${debilitated} ${pluralize(debilitated, 'слабость', 'слабости', 'слабостей')}`;
}

function hasClassicalDignity(result) {
  return Boolean(result.dignities.domicile || result.dignities.exaltation);
}

function hasClassicalDebility(result) {
  return Boolean(result.dignities.detriment || result.dignities.fall);
}

function formatScoreText(score) {
  if (score > 0) {
    return `+${score}`;
  }

  return String(score);
}

function formatSignInPrepositional(signLabel) {
  return SIGN_PREPOSITIONAL_LABELS[signLabel] ?? signLabel;
}

function normalizeTextArray(values) {
  return values.map(normalizeText).filter(Boolean);
}

function isSafeLabel(value) {
  return typeof value === 'string' && !value.includes('NaN') && !value.includes('undefined');
}

function pluralize(count, one, few, many) {
  const abs = Math.abs(count);
  const mod10 = abs % 10;
  const mod100 = abs % 100;

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
