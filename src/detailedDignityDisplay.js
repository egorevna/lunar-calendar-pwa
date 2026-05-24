const DETAILED_DIGNITY_DISPLAY_LIMITATIONS = Object.freeze([
  'Термы, деканы и управители градусов — это lookup-слои по знаку и градусу.',
  'Table 6 и Table 7 — разные системы управителей градусов.',
  'Интерпретации будут добавлены отдельно.',
]);

const SUPPORTED_TYPES = Object.freeze(['term', 'decan', 'degreeRuler', 'vronskyDegreeRulers']);
const VRONSKY_DEGREE_RULERS_SOURCE_KEY = 'degree-rulers-vronsky-table-7';
const VRONSKY_DEGREE_RULERS_SOURCE_SYSTEM = 'vronsky-degree-rulers';

const TERM_RULER_GENITIVE_LABELS = Object.freeze({
  Марс: 'Марса',
  Венера: 'Венеры',
  Меркурий: 'Меркурия',
  Юпитер: 'Юпитера',
  Сатурн: 'Сатурна',
});

const LAYER_LABELS = Object.freeze({
  term: {
    available: 'Термы',
    unavailable: 'термы',
  },
  decan: {
    available: 'деканы',
    unavailable: 'деканы',
  },
  degreeRuler: {
    available: 'управители градусов',
    unavailable: 'управители градусов',
  },
});

const VRONSKY_RULER_LABELS = Object.freeze({
  sun: 'Солнце',
  moon: 'Луна',
  mercury: 'Меркурий',
  venus: 'Венера',
  mars: 'Марс',
  jupiter: 'Юпитер',
  saturn: 'Сатурн',
  uranus: 'Уран',
  neptune: 'Нептун',
  pluto: 'Плутон',
  chiron: 'Хирон',
  proserpina: 'Прозерпина',
});

const UNSAFE_OUTPUT_FRAGMENTS = Object.freeze([
  'NaN',
  'undefined',
  'birthDate',
  'birthTime',
  'utcDateTime',
  'coordinates',
  'profileJson',
  'fullProfile',
  'latitude',
  'longitude',
  'rawLongitude',
  'плохой',
  'опасный',
  'фатально',
  'кармически',
  'судьбонос',
  'ритуал',
  'interpretation',
  'vronsky-degree-rulers',
]);

export function formatTermResult(result) {
  if (!isReadyResult(result) || !isPlainObject(result.term)) {
    return null;
  }

  const planet = normalizeText(result.planetLabel);
  const sign = normalizeText(result.signRu);
  const ruler = normalizeText(result.term.rulerRu);
  const value = result.term.value;
  const range = result.term.range;

  if (!planet || !sign || !ruler || !Number.isFinite(value) || !isTermRange(range)) {
    return null;
  }

  return safeDisplayItem({
    type: 'term',
    title: 'Терм',
    planet,
    text: `${planet} — терм ${formatTermRulerGenitive(ruler)} · ${formatSignedValue(value)}`,
    detail: `${sign} ${range.startDegree}°–${range.printedEndDegree}°`,
    source: 'Таблица 5',
  });
}

export function formatDecanResult(result) {
  if (!isReadyResult(result) || !isPlainObject(result.decan)) {
    return null;
  }

  const planet = normalizeText(result.planetLabel);
  const sign = normalizeText(result.signRu);
  const ruler = normalizeText(result.decan.rulerRu);
  const decanIndex = result.decan.decanIndex;
  const range = result.decan.range;

  if (!planet || !sign || !ruler || !isValidDecanIndex(decanIndex) || !isDecanRange(range)) {
    return null;
  }

  return safeDisplayItem({
    type: 'decan',
    title: 'Декан',
    planet,
    text: `${planet} — ${decanIndex}-й декан · ${ruler}`,
    detail: `${sign} ${range.startDegree}°–${range.endDegreeExclusive}°`,
    source: 'Звезда Магов',
  });
}

export function formatDegreeRulerResult(result) {
  if (!isReadyResult(result) || !isPlainObject(result.degreeRuler)) {
    return null;
  }

  const planet = normalizeText(result.planetLabel);
  const sign = normalizeText(result.signRu);
  const ruler = normalizeText(result.degreeRuler.rulerRu);
  const degreeIndex = getDisplayDegreeIndex(result);

  if (!planet || !sign || !ruler || !isValidDegreeIndex(degreeIndex)) {
    return null;
  }

  return safeDisplayItem({
    type: 'degreeRuler',
    title: 'Управитель градуса',
    planet,
    text: `${planet} — ${degreeIndex}-й градус · ${ruler}`,
    detail: sign,
    source: 'Таблица 6 / Звезда Магов',
  });
}

export function formatVronskyDegreeRulersResult(result) {
  if (!isReadyResult(result) || !isVronskyDegreeRulersSource(result)) {
    return null;
  }

  const planet = normalizeText(result.planetLabel || result.planet);
  const sign = normalizeText(result.signRu);
  const degreeIndex = getDisplayDegreeIndex(result);
  const rulers = getVronskyDisplayRulers(result);

  if (!planet || !sign || !isValidDegreeIndex(degreeIndex) || rulers.length === 0) {
    return null;
  }

  return safeDisplayItem({
    type: 'vronskyDegreeRulers',
    title: 'Управители градуса по Вронскому',
    planet,
    text: `${planet} — ${degreeIndex}-й градус · ${rulers.map(formatVronskyRulerDisplay).join(', ')}`,
    detail: sign,
    source: 'Таблица 7 / Вронский',
  });
}

export function formatDetailedDignityResult(result) {
  if (isDisplayableDetailedDignityItem(result)) {
    return {
      type: result.type,
      title: normalizeText(result.title),
      planet: normalizeText(result.planet),
      text: normalizeText(result.text),
      detail: normalizeText(result.detail),
      source: normalizeText(result.source),
    };
  }

  if (!isPlainObject(result)) {
    return null;
  }

  if (isVronskyDegreeRulersResult(result)) {
    return formatVronskyDegreeRulersResult(result);
  }

  if (isPlainObject(result.term)) {
    return formatTermResult(result);
  }

  if (isPlainObject(result.decan)) {
    return formatDecanResult(result);
  }

  if (isPlainObject(result.degreeRuler)) {
    return formatDegreeRulerResult(result);
  }

  return null;
}

export function formatDetailedDignityList(results) {
  if (!Array.isArray(results)) {
    return [];
  }

  return results.map(formatDetailedDignityResult).filter(Boolean);
}

export function summarizeDetailedDignities(input) {
  const items = collectDisplayItems(input);
  const terms = items.filter((item) => item.type === 'term').length;
  const decans = items.filter((item) => item.type === 'decan').length;
  const degreeRulers = items.filter((item) => item.type === 'degreeRuler').length;
  const vronskyDegreeRulers = items.filter((item) => item.type === 'vronskyDegreeRulers').length;

  return {
    total: items.length,
    terms,
    decans,
    degreeRulers,
    vronskyDegreeRulers,
    text: getDetailedSummaryText(terms, decans, degreeRulers, vronskyDegreeRulers),
  };
}

export function getDetailedDignityDisplayLimitations() {
  return [...DETAILED_DIGNITY_DISPLAY_LIMITATIONS];
}

export function isDisplayableDetailedDignityItem(item) {
  if (!isPlainObject(item) || !SUPPORTED_TYPES.includes(item.type)) {
    return false;
  }

  const text = normalizeText(item.text);
  const title = normalizeText(item.title);
  const planet = normalizeText(item.planet);

  return Boolean(text && title && planet && !containsUnsafeOutput(item));
}

function collectDisplayItems(input) {
  if (Array.isArray(input)) {
    return input.map(formatDetailedDignityResult).filter(Boolean);
  }

  if (isPlainObject(input)) {
    return [
      ...formatDetailedDignityList(input.terms),
      ...formatDetailedDignityList(input.decans),
      ...formatDetailedDignityList(input.degreeRulers),
      ...formatDetailedDignityList(input.vronskyDegreeRulers),
    ];
  }

  return [];
}

function getDetailedSummaryText(terms, decans, degreeRulers, vronskyDegreeRulers) {
  const hasAnyDegreeRulers = degreeRulers > 0 || vronskyDegreeRulers > 0;

  if (terms === 0 && decans === 0 && !hasAnyDegreeRulers) {
    return 'Детальные достоинства не рассчитаны.';
  }

  if (terms > 0 && decans > 0 && hasAnyDegreeRulers) {
    return 'Термы, деканы и управители градусов рассчитаны';
  }

  const available = [];
  const unavailable = [];

  if (terms > 0) {
    available.push(LAYER_LABELS.term.available);
  } else {
    unavailable.push(LAYER_LABELS.term.unavailable);
  }

  if (decans > 0) {
    available.push(LAYER_LABELS.decan.available);
  } else {
    unavailable.push(LAYER_LABELS.decan.unavailable);
  }

  if (hasAnyDegreeRulers) {
    available.push(LAYER_LABELS.degreeRuler.available);
  } else {
    unavailable.push(LAYER_LABELS.degreeRuler.unavailable);
  }

  return `${joinRu(available)} рассчитаны · ${joinRu(unavailable)} недоступны`;
}

function safeDisplayItem(item) {
  return isDisplayableDetailedDignityItem(item) ? item : null;
}

function isReadyResult(result) {
  return isPlainObject(result) && result.status === 'ready';
}

function isTermRange(range) {
  return isPlainObject(range)
    && Number.isFinite(range.startDegree)
    && Number.isFinite(range.printedEndDegree)
    && Number.isFinite(range.normalizedEndExclusive)
    && range.printedEndDegree > range.startDegree;
}

function isDecanRange(range) {
  return isPlainObject(range)
    && Number.isFinite(range.startDegree)
    && Number.isFinite(range.endDegreeExclusive)
    && range.endDegreeExclusive > range.startDegree;
}

function isValidDecanIndex(value) {
  return Number.isInteger(value) && value >= 1 && value <= 3;
}

function isValidDegreeIndex(value) {
  return Number.isInteger(value) && value >= 0 && value <= 29;
}

function getDisplayDegreeIndex(result) {
  if (Number.isInteger(result.degreeIndex)) {
    return result.degreeIndex;
  }

  return null;
}

function isVronskyDegreeRulersResult(result) {
  return isReadyResult(result)
    && isVronskyDegreeRulersSource(result)
    && getVronskyDisplayRulers(result).length > 0;
}

function isVronskyDegreeRulersSource(result) {
  const sourceKey = getSourceKey(result);
  const sourceSystem = getSourceSystem(result);

  return sourceKey === VRONSKY_DEGREE_RULERS_SOURCE_KEY
    || sourceSystem === VRONSKY_DEGREE_RULERS_SOURCE_SYSTEM;
}

function getSourceKey(result) {
  if (typeof result.source === 'string') {
    return result.source;
  }

  if (isPlainObject(result.source)) {
    return normalizeText(result.source.sourceKey);
  }

  return '';
}

function getSourceSystem(result) {
  if (typeof result.sourceSystem === 'string') {
    return result.sourceSystem;
  }

  if (isPlainObject(result.source)) {
    return normalizeText(result.source.sourceSystem);
  }

  return '';
}

function getVronskyDisplayRulers(result) {
  const rulers = Array.isArray(result.degreeRulers) ? result.degreeRulers : result.rulers;

  if (!Array.isArray(rulers)) {
    return [];
  }

  return rulers.map(normalizeVronskyRuler).filter(Boolean);
}

function normalizeVronskyRuler(ruler) {
  if (!isPlainObject(ruler) || typeof ruler.retrograde !== 'boolean') {
    return null;
  }

  const key = normalizeText(ruler.key);
  const label = normalizeText(ruler.rulerRu) || VRONSKY_RULER_LABELS[key];

  if (!label) {
    return null;
  }

  return {
    label,
    retrograde: ruler.retrograde,
  };
}

function formatVronskyRulerDisplay(ruler) {
  return ruler.retrograde ? `${ruler.label} R` : ruler.label;
}

function formatTermRulerGenitive(label) {
  return TERM_RULER_GENITIVE_LABELS[label] ?? label;
}

function formatSignedValue(value) {
  return value > 0 ? `+${value}` : String(value);
}

function joinRu(items) {
  if (items.length <= 1) {
    return items[0] ?? '';
  }

  if (items.length === 2) {
    return `${items[0]} и ${items[1]}`;
  }

  return `${items.slice(0, -1).join(', ')} и ${items.at(-1)}`;
}

function containsUnsafeOutput(value) {
  const text = JSON.stringify(value);

  if (!text) {
    return true;
  }

  return UNSAFE_OUTPUT_FRAGMENTS.some((fragment) => text.includes(fragment));
}

function normalizeText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}
