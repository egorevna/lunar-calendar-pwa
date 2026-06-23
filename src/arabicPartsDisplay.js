const READY_STATUS = 'ready';
const PARTIAL_STATUS = 'partial';
const UNSUPPORTED_STATUS = 'unsupported';
const TITLE = 'Жребии и арабские части';
const VRONSKY_TITLE = 'Точки Вронского';
const FALLBACK_SUMMARY = 'Пока недоступно.';
const DEFAULT_FALLBACK_MESSAGE = 'Для расчета нужны ASC, Солнце, Луна и дневная/ночная карта.';
const DEFAULT_VRONSKY_FALLBACK_MESSAGE = 'Для расчета точек Вронского нужна готовая дневная/ночная карта.';
const VRONSKY_SOURCE_SYSTEM = 'vronsky-table-17-arabic-points';

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

const VRONSKY_DISPLAY_LIMITATIONS = Object.freeze([
  'Формулы Вронского подтверждены для дневного рождения.',
  'Ночные формулы по Вронскому пока не verified.',
  'В Sprint 15 используется выбранный простой набор из 12 строк Вронского.',
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
  'опасность',
  'судьба',
  'зловещ',
  'психолог',
  'предсказ',
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

export function formatVronskyArabicPartResult(part = null) {
  if (!isPlainObject(part)
    || part.status !== READY_STATUS
    || part.ready !== true
    || part.sourceSystem !== VRONSKY_SOURCE_SYSTEM) {
    return null;
  }

  const key = normalizeText(part.key);
  const label = normalizeText(part.label);
  const text = getArabicPartText(part, label);

  if (!key || !label || !text) {
    return null;
  }

  return safeDisplayItem({
    type: 'vronskyArabicPart',
    key,
    label,
    text,
    sourceSystem: VRONSKY_SOURCE_SYSTEM,
  });
}

export function formatVronskyArabicPartList(parts = []) {
  if (!Array.isArray(parts)) {
    return [];
  }

  return parts.map(formatVronskyArabicPartResult).filter(Boolean);
}

export function formatVronskyArabicPartHouseAssignment(assignment = null) {
  const formatted = formatArabicPartHouseAssignment(assignment);

  if (!formatted) {
    return null;
  }

  return safeDisplayItem({
    type: 'vronskyArabicPartHouseAssignment',
    key: formatted.key,
    label: formatted.label,
    houseNumber: formatted.houseNumber,
    text: formatted.text,
    sourceSystem: VRONSKY_SOURCE_SYSTEM,
  });
}

export function formatVronskyArabicPartWithHouse(part = null, assignment = null) {
  const partItem = formatVronskyArabicPartResult(part);

  if (!partItem) {
    return null;
  }

  const assignmentItem = formatVronskyArabicPartHouseAssignment(assignment);

  if (!assignmentItem || assignmentItem.key !== partItem.key) {
    return partItem;
  }

  return safeDisplayItem({
    type: 'vronskyArabicPartWithHouse',
    key: partItem.key,
    label: partItem.label,
    text: `${partItem.text} · ${assignmentItem.houseNumber} дом`,
    sourceSystem: VRONSKY_SOURCE_SYSTEM,
    houseNumber: assignmentItem.houseNumber,
  });
}

export function formatVronskyArabicPartsResult(result = null) {
  return formatVronskyArabicPartsWithAssignments(result, null);
}

export function formatVronskyArabicPartsWithAssignments(vronskyResult = null, assignmentsResult = null) {
  if (!isDisplayReadyVronskyResult(vronskyResult)) {
    return formatUnavailableVronskyArabicPartsResult(vronskyResult);
  }

  const assignments = isDisplayReadyAssignmentResult(assignmentsResult)
    ? assignmentsResult.assignments
    : [];
  const items = vronskyResult.parts
    .map((part) => formatVronskyArabicPartWithHouse(part, getAssignmentByKey(assignments, part?.key)))
    .filter(Boolean);

  if (items.length === 0) {
    return formatUnavailableVronskyArabicPartsResult({
      status: 'notReady',
      ready: false,
      reason: 'emptyVronskyPartsResult',
    });
  }

  return safeDisplayItem({
    status: vronskyResult.status === PARTIAL_STATUS ? PARTIAL_STATUS : READY_STATUS,
    ready: true,
    title: VRONSKY_TITLE,
    summary: getVronskyReadySummary(items.length),
    chartSect: normalizeText(vronskyResult.chartSect) || null,
    chartSectLabel: getChartSectDisplayLabel(vronskyResult.chartSect),
    items,
    message: null,
    limitations: getVronskyArabicPartsDisplayLimitations(),
  });
}

export function summarizeVronskyArabicPartsDisplay(displayResult = null) {
  if (!isPlainObject(displayResult) || displayResult.ready !== true || ![READY_STATUS, PARTIAL_STATUS].includes(displayResult.status)) {
    return {
      status: normalizeText(displayResult?.status) || 'notReady',
      text: 'Точки Вронского недоступны',
      count: 0,
      houseAssignments: 0,
    };
  }

  const items = Array.isArray(displayResult.items) ? displayResult.items : [];
  const houseAssignments = items.filter((item) => Number.isInteger(item?.houseNumber)).length;

  return {
    status: displayResult.status,
    text: 'Точки Вронского рассчитаны',
    count: items.length,
    houseAssignments,
  };
}

export function getVronskyArabicPartsDisplayLimitations() {
  return [...VRONSKY_DISPLAY_LIMITATIONS];
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

function formatUnavailableVronskyArabicPartsResult(result = null) {
  return safeDisplayItem({
    status: 'notReady',
    ready: false,
    title: VRONSKY_TITLE,
    summary: FALLBACK_SUMMARY,
    chartSect: null,
    chartSectLabel: 'Недоступно',
    message: getSafeVronskyFallbackMessage(result),
    items: [],
    limitations: getVronskyArabicPartsDisplayLimitations(),
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

function isDisplayReadyVronskyResult(result) {
  return isPlainObject(result)
    && result.sourceSystem === VRONSKY_SOURCE_SYSTEM
    && result.ready === true
    && [READY_STATUS, PARTIAL_STATUS].includes(result.status)
    && Array.isArray(result.parts);
}

function isDisplayReadyAssignmentResult(result) {
  return isPlainObject(result)
    && result.ready === true
    && [READY_STATUS, PARTIAL_STATUS].includes(result.status)
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

function getVronskyReadySummary(count) {
  if (count === 1) {
    return '1 точка Вронского рассчитана';
  }

  return `${count} точек Вронского рассчитаны`;
}

function getSafeFallbackMessage(message) {
  const text = normalizeText(message);

  if (!text || containsUnsafeText(text)) {
    return DEFAULT_FALLBACK_MESSAGE;
  }

  return text;
}

function getSafeVronskyFallbackMessage(result = null) {
  if (result?.reason === 'vronskyNightFormulaNotVerified' || result?.chartSect === 'night') {
    return 'Точки Вронского пока недоступны для ночной карты. Ночные формулы по Вронскому пока не verified.';
  }

  if (result?.reason === 'chartSectBoundary' || result?.chartSect === 'boundary') {
    return 'Точки Вронского пока недоступны на границе дня и ночи.';
  }

  const text = normalizeText(result?.message);

  if (text && !containsUnsafeText(text)) {
    return text;
  }

  return DEFAULT_VRONSKY_FALLBACK_MESSAGE;
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
