const READY_STATUS = 'ready';
const UNSUPPORTED_STATUS = 'unsupported';
const TITLE = 'Дома и углы карты';
const FALLBACK_SUMMARY = 'Пока недоступно.';
const DEFAULT_FALLBACK_MESSAGE = 'Дома и углы карты недоступны.';

const ANGLE_ORDER = Object.freeze(['asc', 'mc', 'dsc', 'ic']);
const ANGLE_TITLES = Object.freeze({
  asc: 'ASC',
  mc: 'MC',
  dsc: 'DSC',
  ic: 'IC',
});
const HOUSE_SYSTEM_LABELS = Object.freeze({
  'whole-sign': 'Whole Sign',
  'equal-house': 'Равнодомная',
  placidus: 'Placidus',
});
const HOUSES_DISPLAY_LIMITATIONS = Object.freeze([
  'Дома и углы карты рассчитываются только для профиля с точным временем рождения и координатами.',
  'Система домов берется из профиля.',
  'Whole Sign, равнодомная и Placidus — разные системы домов.',
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
  'planetLongitude',
  'provider',
  'raw',
  'fullProfile',
  'profileJson',
  'сильный дом',
  'слабый дом',
  'фатально',
  'кармически',
  'interpretation',
  'transit',
]);

export function formatHouseAngle(angle = null) {
  if (!isPlainObject(angle)) {
    return null;
  }

  const key = normalizeText(angle.key).toLowerCase();
  const title = normalizeText(angle.label) || ANGLE_TITLES[key];
  const positionText = getAnglePositionText(angle);

  if (!key || !title || !positionText) {
    return null;
  }

  return safeDisplayItem({
    type: 'angle',
    key,
    title,
    text: `${title} — ${positionText}`,
  });
}

export function formatHouseAngles(angles = null) {
  if (!isPlainObject(angles)) {
    return [];
  }

  return ANGLE_ORDER
    .map((key) => formatHouseAngle(angles[key]))
    .filter(Boolean);
}

export function formatHouseSystemLabel(houseSystem = null, label = null) {
  const normalizedHouseSystem = normalizeText(houseSystem);
  const displayLabel = normalizeText(label)
    || HOUSE_SYSTEM_LABELS[normalizedHouseSystem]
    || 'Неизвестная система домов';

  return safeDisplayItem({
    type: 'houseSystem',
    text: `Система домов: ${displayLabel}`,
    houseSystem: normalizedHouseSystem || null,
  });
}

export function formatHouseItem(house = null) {
  if (!isPlainObject(house) || !Number.isInteger(house.number)) {
    return null;
  }

  const text = getHouseText(house);

  if (!text) {
    return null;
  }

  return safeDisplayItem({
    type: 'house',
    number: house.number,
    text,
  });
}

export function formatHouseList(houses = []) {
  if (!Array.isArray(houses)) {
    return [];
  }

  return houses
    .slice(0, 12)
    .map(formatHouseItem)
    .filter(Boolean);
}

export function formatPlanetHouseAssignment(assignment = null) {
  if (!isPlainObject(assignment) || assignment.status !== READY_STATUS) {
    return null;
  }

  const planet = normalizeText(assignment.planetLabel);
  const houseNumber = assignment.houseNumber;
  const houseLabel = normalizeText(assignment.houseLabel)
    || (Number.isInteger(houseNumber) ? `${houseNumber} дом` : '');

  if (!planet || !Number.isInteger(houseNumber) || !houseLabel) {
    return null;
  }

  return safeDisplayItem({
    type: 'planetHouse',
    planet,
    text: `${planet} — ${houseLabel}`,
    houseNumber,
  });
}

export function formatPlanetHouseAssignmentList(assignments = []) {
  if (!Array.isArray(assignments)) {
    return [];
  }

  return assignments.map(formatPlanetHouseAssignment).filter(Boolean);
}

export function formatHousesResult(result = null) {
  if (!isPlainObject(result) || result.status !== READY_STATUS || result.ready !== true) {
    return formatUnavailableHousesResult(result);
  }

  const source = getDisplaySource(result);
  const houseSystem = normalizeText(result.houseSystem) || normalizeText(source.houseSystem);
  const houseSystemLabel = normalizeText(result.houseSystemLabel) || normalizeText(source.houseSystemLabel);
  const houseSystemItem = formatHouseSystemLabel(houseSystem, houseSystemLabel);
  const angles = formatHouseAngles(result.angles ?? source.angles);
  const houses = formatHouseList(result.houses ?? source.houses);

  return safeDisplayItem({
    status: READY_STATUS,
    ready: true,
    title: TITLE,
    summary: houseSystemItem?.text?.replace('Система домов: ', '') ? houseSystemItem.text : 'Система домов: неизвестно',
    houseSystem: houseSystem || null,
    houseSystemLabel: houseSystemLabel || null,
    angles,
    houses,
    message: null,
    limitations: getHousesDisplayLimitations(),
  });
}

export function formatHousesWithPlanetAssignments(input = {}) {
  const houseDisplay = formatHousesResult(input?.houseResult ?? input);

  if (houseDisplay.status !== READY_STATUS || houseDisplay.ready !== true) {
    return {
      ...houseDisplay,
      planetAssignments: [],
    };
  }

  const assignmentResult = input?.assignmentResult;
  const assignmentSummary = normalizeText(assignmentResult?.summary?.text);
  const planetAssignments = assignmentResult?.status === READY_STATUS && assignmentResult.ready === true
    ? formatPlanetHouseAssignmentList(assignmentResult.assignments)
    : [];
  const summary = planetAssignments.length > 0 && assignmentSummary
    ? `${houseDisplay.summary} · ${assignmentSummary}`
    : houseDisplay.summary;

  return safeDisplayItem({
    ...houseDisplay,
    summary,
    planetAssignments,
  });
}

export function summarizeHousesDisplay(displayResult = null) {
  if (!isPlainObject(displayResult) || displayResult.status !== READY_STATUS || displayResult.ready !== true) {
    return {
      status: normalizeText(displayResult?.status) || 'notReady',
      text: 'Дома и углы карты недоступны',
    };
  }

  const houses = Array.isArray(displayResult.houses) ? displayResult.houses : [];
  const angles = Array.isArray(displayResult.angles) ? displayResult.angles : [];
  const planetAssignments = Array.isArray(displayResult.planetAssignments)
    ? displayResult.planetAssignments
    : [];

  return {
    status: READY_STATUS,
    text: 'Дома и углы карты рассчитаны',
    houseSystem: normalizeText(displayResult.houseSystem) || null,
    houseCount: houses.length,
    angleCount: angles.length,
    planetAssignments: planetAssignments.length,
  };
}

export function isDisplayableHouseItem(item = null) {
  if (!isPlainObject(item)) {
    return false;
  }

  const text = normalizeText(item.text);

  return Boolean(text && !containsUnsafeText(text));
}

export function getHousesDisplayLimitations() {
  return [...HOUSES_DISPLAY_LIMITATIONS];
}

function formatUnavailableHousesResult(result) {
  const status = result?.status === UNSUPPORTED_STATUS ? UNSUPPORTED_STATUS : 'notReady';
  const message = getSafeFallbackMessage(result?.message);

  return safeDisplayItem({
    status,
    ready: false,
    title: TITLE,
    summary: FALLBACK_SUMMARY,
    houseSystem: normalizeText(result?.houseSystem) || null,
    houseSystemLabel: normalizeText(result?.houseSystemLabel) || null,
    message,
    angles: [],
    houses: [],
    limitations: getHousesDisplayLimitations(),
  });
}

function getDisplaySource(result) {
  return isPlainObject(result.result) ? result.result : result;
}

function getAnglePositionText(angle) {
  const existingText = normalizeText(angle.text);

  if (existingText && !containsUnsafeText(existingText)) {
    return existingText;
  }

  const sign = normalizeText(angle.sign?.ru);
  const degree = angle.degree;
  const minutes = angle.minutes;

  if (!sign || !Number.isInteger(degree) || !Number.isInteger(minutes)) {
    return '';
  }

  const text = `${sign} ${degree}°${String(minutes).padStart(2, '0')}′`;

  return containsUnsafeText(text) ? '' : text;
}

function getHouseText(house) {
  const existingText = normalizeText(house.text);

  if (existingText && !containsUnsafeText(existingText)) {
    return existingText;
  }

  const label = normalizeText(house.label) || `${house.number} дом`;
  const sign = normalizeText(house.sign?.ru);

  if (sign) {
    const text = `${label} — ${sign}`;
    return containsUnsafeText(text) ? '' : text;
  }

  const cuspText = normalizeText(house.cusp?.text);

  if (cuspText) {
    const text = `${label} — ${cuspText}`;
    return containsUnsafeText(text) ? '' : text;
  }

  return '';
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

  return UNSAFE_TEXT_FRAGMENTS.some((fragment) => json.includes(fragment));
}

function normalizeText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}
