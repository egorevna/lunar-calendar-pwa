const READY_STATUS = 'ready';
const UNSUPPORTED_STATUS = 'unsupported';
const TITLE = 'Жребии и арабские части';
const FALLBACK_SUMMARY = 'Пока недоступно.';
const DEFAULT_FALLBACK_MESSAGE = 'Для расчета нужны ASC, Солнце, Луна и дневная/ночная карта.';

const CHART_SECT_LABELS = Object.freeze({
  day: 'Дневная карта',
  night: 'Ночная карта',
  boundary: 'На границе дня и ночи',
});

const FORMULA_VARIANT_LABELS = Object.freeze({
  day: 'дневная',
  night: 'ночная',
});

const DISPLAY_LIMITATIONS = Object.freeze([
  'Жребии рассчитываются только при готовых ASC, Солнце, Луне и дневной/ночной карте.',
  'В Sprint 12 активны Pars Fortuna и Lot of Spirit.',
  'Остальные арабские части отложены до проверки источников.',
  'Этот блок не содержит интерпретаций.',
]);

const UNSAFE_TEXT_FRAGMENTS = Object.freeze([
  'NaN',
  'undefined',
  'birthDate',
  'birthTime',
  'utcDateTime',
  'timezone',
  'coordinates',
  'birthPlace',
  'latitude',
  'longitude',
  'rawLongitude',
  'provider',
  'providerPayload',
  'fullProfile',
  'profileJson',
  'сильный жребий',
  'слабый жребий',
  'фатально',
  '\u043a\u0430\u0440\u043c\u0438\u0447\u0435\u0441\u043a\u0438',
  'interpretation',
  'transit',
  '\u0440\u0438\u0442\u0443\u0430\u043b',
]);

export function formatArabicPartResult(part = null) {
  if (!isPlainObject(part) || part.status !== READY_STATUS || part.ready !== true) {
    return null;
  }

  const key = normalizeText(part.key);
  const label = normalizeText(part.label);
  const text = getArabicPartText(part, label);

  if (!key || !label || !text) {
    return null;
  }

  return safeDisplayItem({
    type: 'arabicPart',
    key,
    label,
    text,
    formulaVariant: normalizeText(part.formulaVariant) || null,
    formulaVariantLabel: getFormulaVariantDisplayLabel(part.formulaVariant),
  });
}

export function formatArabicPartList(parts = []) {
  if (!Array.isArray(parts)) {
    return [];
  }

  return parts.map(formatArabicPartResult).filter(Boolean);
}

export function formatArabicPartHouseAssignment(assignment = null) {
  if (!isPlainObject(assignment) || assignment.status !== READY_STATUS || assignment.ready !== true) {
    return null;
  }

  const key = normalizeText(assignment.key);
  const label = normalizeText(assignment.label);
  const houseNumber = assignment.houseNumber;
  const houseLabel = normalizeText(assignment.houseLabel)
    || (Number.isInteger(houseNumber) ? `${houseNumber} дом` : '');
  const text = getAssignmentText(assignment, label, houseLabel);

  if (!key || !label || !Number.isInteger(houseNumber) || !houseLabel || !text) {
    return null;
  }

  return safeDisplayItem({
    type: 'arabicPartHouseAssignment',
    key,
    label,
    houseNumber,
    text,
  });
}

export function formatArabicPartWithHouse(part = null, assignment = null) {
  const partItem = formatArabicPartResult(part);

  if (!partItem) {
    return null;
  }

  const assignmentItem = formatArabicPartHouseAssignment(assignment);

  if (!assignmentItem || assignmentItem.key !== partItem.key) {
    return partItem;
  }

  const houseLabel = `${assignmentItem.houseNumber} дом`;

  return safeDisplayItem({
    type: 'arabicPartWithHouse',
    key: partItem.key,
    label: partItem.label,
    text: `${partItem.text} · ${houseLabel}`,
    houseNumber: assignmentItem.houseNumber,
  });
}

export function formatArabicPartsWithAssignments(input = {}) {
  const partsResult = input?.partsResult ?? input;
  const assignmentResult = input?.assignmentResult ?? null;

  if (!isReadyPartsResult(partsResult)) {
    return formatUnavailableArabicPartsResult(partsResult);
  }

  const assignments = isReadyAssignmentResult(assignmentResult)
    ? assignmentResult.assignments
    : [];
  const items = partsResult.parts
    .map((part) => formatArabicPartWithHouse(part, getAssignmentByKey(assignments, part?.key)))
    .filter(Boolean);

  return safeDisplayItem({
    status: READY_STATUS,
    ready: true,
    title: TITLE,
    summary: getReadySummary(items.length),
    chartSect: normalizeText(partsResult.chartSect) || null,
    chartSectLabel: getChartSectDisplayLabel(partsResult.chartSect),
    items,
    message: null,
    limitations: getArabicPartsDisplayLimitations(),
  });
}

export function formatArabicPartsResult(result = null) {
  if (!isReadyPartsResult(result)) {
    return formatUnavailableArabicPartsResult(result);
  }

  const items = formatArabicPartList(result.parts);

  return safeDisplayItem({
    status: READY_STATUS,
    ready: true,
    title: TITLE,
    summary: getReadySummary(items.length),
    chartSect: normalizeText(result.chartSect) || null,
    chartSectLabel: getChartSectDisplayLabel(result.chartSect),
    items,
    message: null,
    limitations: getArabicPartsDisplayLimitations(),
  });
}

export function getChartSectDisplayLabel(chartSect = null) {
  return CHART_SECT_LABELS[normalizeText(chartSect)] ?? 'Недоступно';
}

export function summarizeArabicPartsDisplay(displayResult = null) {
  if (!isPlainObject(displayResult) || displayResult.status !== READY_STATUS || displayResult.ready !== true) {
    return {
      status: normalizeText(displayResult?.status) || 'notReady',
      text: 'Жребии недоступны',
      count: 0,
      houseAssignments: 0,
    };
  }

  const items = Array.isArray(displayResult.items) ? displayResult.items : [];
  const houseAssignments = items.filter((item) => Number.isInteger(item?.houseNumber)).length;

  return {
    status: READY_STATUS,
    text: 'Жребии рассчитаны',
    count: items.length,
    houseAssignments,
  };
}

export function isDisplayableArabicPartItem(item = null) {
  if (!isPlainObject(item)) {
    return false;
  }

  const text = normalizeText(item.text);

  return Boolean(text && !containsUnsafeText(text));
}

export function getArabicPartsDisplayLimitations() {
  return [...DISPLAY_LIMITATIONS];
}

function formatUnavailableArabicPartsResult(result = null) {
  const status = result?.status === UNSUPPORTED_STATUS ? UNSUPPORTED_STATUS : 'notReady';

  return safeDisplayItem({
    status,
    ready: false,
    title: TITLE,
    summary: FALLBACK_SUMMARY,
    chartSect: null,
    chartSectLabel: 'Недоступно',
    message: getSafeFallbackMessage(result?.message),
    items: [],
    limitations: getArabicPartsDisplayLimitations(),
  });
}

function isReadyPartsResult(result) {
  return isPlainObject(result)
    && result.status === READY_STATUS
    && result.ready === true
    && Array.isArray(result.parts);
}

function isReadyAssignmentResult(result) {
  return isPlainObject(result)
    && result.status === READY_STATUS
    && result.ready === true
    && Array.isArray(result.assignments);
}

function getArabicPartText(part, label) {
  const existingText = normalizeText(part.text);

  if (existingText && !containsUnsafeText(existingText)) {
    return existingText;
  }

  const sign = normalizeText(part.sign?.ru);
  const degree = part.degree;
  const minutes = part.minutes;
  const seconds = part.seconds;

  if (!label || !sign || !Number.isInteger(degree) || !Number.isInteger(minutes) || !Number.isInteger(seconds)) {
    return '';
  }

  const text = `${label} — ${sign} ${degree}°${pad2(minutes)}′${pad2(seconds)}″`;

  return containsUnsafeText(text) ? '' : text;
}

function getAssignmentText(assignment, label, houseLabel) {
  const existingText = normalizeText(assignment.text);

  if (existingText && !containsUnsafeText(existingText)) {
    return existingText;
  }

  if (!label || !houseLabel) {
    return '';
  }

  const text = `${label} — ${houseLabel}`;

  return containsUnsafeText(text) ? '' : text;
}

function getAssignmentByKey(assignments, key) {
  const normalizedKey = normalizeText(key);

  if (!normalizedKey || !Array.isArray(assignments)) {
    return null;
  }

  return assignments.find((assignment) => normalizeText(assignment?.key) === normalizedKey) ?? null;
}

function getFormulaVariantDisplayLabel(formulaVariant) {
  return FORMULA_VARIANT_LABELS[normalizeText(formulaVariant)] ?? null;
}

function getReadySummary(count) {
  if (count === 1) {
    return '1 жребий рассчитан';
  }

  if (count > 1 && count < 5) {
    return `${count} жребия рассчитаны`;
  }

  return `${count} жребиев рассчитано`;
}

function getSafeFallbackMessage(message) {
  const text = normalizeText(message);

  if (!text || containsUnsafeText(text)) {
    return DEFAULT_FALLBACK_MESSAGE;
  }

  return text;
}

function safeDisplayItem(item) {
  if (containsUnsafeText(item)) {
    return null;
  }

  return item;
}

function containsUnsafeText(value) {
  const json = typeof value === 'string' ? value : JSON.stringify(value);

  if (!json) {
    return false;
  }

  if (/\b\d{1,3}\.\d{4,}\b/.test(json)) {
    return true;
  }

  return UNSAFE_TEXT_FRAGMENTS.some((fragment) => json.includes(fragment));
}

function pad2(value) {
  return String(value).padStart(2, '0');
}

function normalizeText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}
