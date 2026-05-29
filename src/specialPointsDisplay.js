const TITLE = 'Особые точки карты';
const FALLBACK_SUMMARY = 'Пока недоступно.';
const FALLBACK_MESSAGE = 'Для расчета нужны точное время рождения и timezone.';

const UNSAFE_TEXT_FRAGMENTS = [
  'birthDate',
  'birthTime',
  'utcDateTime',
  'timezone',
  'coordinates',
  'birthPlace',
  'latitude',
  'longitude',
  'rawLongitude',
  'providerPayload',
  'fullProfileJson',
  'fullProfile',
  'sourceArray',
  'operands',
  'NaN',
  'undefined',
  'карми',
  'фаталь',
  'ангел',
  'судьб',
  'ритуал',
  'interpretation',
  'fixedStars',
  'transit',
];

function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function isReady(value) {
  return isObject(value) && value.status === 'ready' && value.ready === true;
}

function pad2(value) {
  return String(value).padStart(2, '0');
}

function uniqueSafeStrings(values) {
  const result = [];
  const seen = new Set();

  for (const value of values) {
    if (typeof value !== 'string' || value.length === 0 || containsUnsafeText(value)) {
      continue;
    }
    if (!seen.has(value)) {
      seen.add(value);
      result.push(value);
    }
  }

  return result;
}

function containsUnsafeText(value) {
  const text = typeof value === 'string' ? value : JSON.stringify(value);

  if (typeof text !== 'string') {
    return true;
  }

  if (/\b\d{1,3}\.\d{4,}\b/.test(text)) {
    return true;
  }

  return UNSAFE_TEXT_FRAGMENTS.some((fragment) => text.includes(fragment));
}

function buildPointTitle(point) {
  const label = typeof point.label === 'string' ? point.label : '';
  const variant = typeof point.labelVariant === 'string' ? point.labelVariant : '';

  if (!label) {
    return null;
  }

  return variant ? `${label} / ${variant}` : label;
}

function buildPositionText(point) {
  const title = buildPointTitle(point);
  const sign = point.sign;

  if (
    !title ||
    !isObject(sign) ||
    typeof sign.ru !== 'string' ||
    !Number.isInteger(point.degree) ||
    !Number.isInteger(point.minutes) ||
    !Number.isInteger(point.seconds)
  ) {
    return null;
  }

  return `${title} — ${sign.ru} ${pad2(point.degree)}°${pad2(point.minutes)}′${pad2(point.seconds)}″`;
}

function getSafePointText(point) {
  if (typeof point.text === 'string' && point.text.length > 0 && !containsUnsafeText(point.text)) {
    return point.text;
  }

  const text = buildPositionText(point);
  return text && !containsUnsafeText(text) ? text : null;
}

function buildHouseText(assignment) {
  const label = typeof assignment.label === 'string' ? assignment.label : null;
  const houseNumber = assignment.houseNumber;

  if (!label || !Number.isInteger(houseNumber) || houseNumber < 1 || houseNumber > 12) {
    return null;
  }

  return `${label} — ${houseNumber} дом`;
}

function cloneDisplayItem(item) {
  return { ...item };
}

function getAssignmentByKey(assignments, key) {
  if (!assignments || !key) {
    return null;
  }

  if (Array.isArray(assignments)) {
    return assignments.find((assignment) => assignment?.key === key) ?? null;
  }

  if (isObject(assignments)) {
    for (const assignment of Object.values(assignments)) {
      if (assignment?.key === key) {
        return assignment;
      }
    }
  }

  return null;
}

function countPhrase(count) {
  if (count === 1) {
    return '1 точка рассчитана';
  }

  if (count >= 2 && count <= 4) {
    return `${count} точки рассчитаны`;
  }

  return `${count} точек рассчитано`;
}

function fallbackSection(section, title, message) {
  return {
    status: 'notReady',
    ready: false,
    section,
    title,
    items: [],
    message,
    limitations: [],
  };
}

function buildReadySection(section, title, items, limitations = []) {
  return {
    status: 'ready',
    ready: true,
    section,
    title,
    items: items.map(cloneDisplayItem),
    limitations: uniqueSafeStrings(limitations),
  };
}

export function formatSpecialPointResult(point) {
  if (!isObject(point) || typeof point.key !== 'string' || typeof point.label !== 'string') {
    return null;
  }

  const text = getSafePointText(point);
  if (!text) {
    return null;
  }

  const item = {
    type: 'specialPoint',
    key: point.key,
    label: point.label,
    text,
    sourceSystem: typeof point.sourceSystem === 'string' ? point.sourceSystem : null,
    pointType: typeof point.pointType === 'string' ? point.pointType : null,
  };

  return isDisplayableSpecialPointItem(item) ? item : null;
}

export function formatSpecialPointList(points) {
  if (!Array.isArray(points)) {
    return [];
  }

  return points.map(formatSpecialPointResult).filter(Boolean);
}

export function formatSpecialPointHouseAssignment(assignment) {
  if (!isObject(assignment) || assignment.ready !== true || assignment.status !== 'ready') {
    return null;
  }

  const text =
    typeof assignment.text === 'string' && !containsUnsafeText(assignment.text)
      ? assignment.text
      : buildHouseText(assignment);

  if (
    typeof assignment.key !== 'string' ||
    typeof assignment.label !== 'string' ||
    !Number.isInteger(assignment.houseNumber) ||
    assignment.houseNumber < 1 ||
    assignment.houseNumber > 12 ||
    !text
  ) {
    return null;
  }

  const item = {
    type: 'specialPointHouseAssignment',
    key: assignment.key,
    label: assignment.label,
    houseNumber: assignment.houseNumber,
    text,
  };

  return isDisplayableSpecialPointItem(item) ? item : null;
}

export function formatSpecialPointWithHouse(point, assignment) {
  const pointItem = formatSpecialPointResult(point);
  if (!pointItem) {
    return null;
  }

  const assignmentItem = formatSpecialPointHouseAssignment(assignment);
  const hasMatchingAssignment = assignmentItem && assignmentItem.key === pointItem.key;
  const houseNumber = hasMatchingAssignment ? assignmentItem.houseNumber : null;
  const text = hasMatchingAssignment ? `${pointItem.text} · ${houseNumber} дом` : pointItem.text;

  const item = {
    type: 'specialPointWithHouse',
    key: pointItem.key,
    label: pointItem.label,
    text,
    houseNumber,
  };

  return isDisplayableSpecialPointItem(item) ? item : null;
}

export function formatLunarNodesDisplay(nodesResult, assignmentResult = null) {
  if (!isReady(nodesResult) || !isObject(nodesResult.nodes)) {
    return fallbackSection('lunarNodes', 'Лунные узлы', 'Лунные узлы пока недоступны.');
  }

  const assignments = isReady(assignmentResult) ? assignmentResult.assignments : null;
  const points = [nodesResult.nodes.north, nodesResult.nodes.south];
  const items = points
    .map((point) => formatSpecialPointWithHouse(point, getAssignmentByKey(assignments, point?.key)))
    .filter(Boolean);

  if (items.length === 0) {
    return fallbackSection('lunarNodes', 'Лунные узлы', 'Лунные узлы пока недоступны.');
  }

  return buildReadySection('lunarNodes', 'Лунные узлы', items);
}

export function formatLilithDisplay(lilithResult) {
  if (!isReady(lilithResult)) {
    return fallbackSection('lilith', 'Лилит', 'Лилит пока недоступна.');
  }

  const item = formatSpecialPointResult(lilithResult.lilith);
  if (!item) {
    return fallbackSection('lilith', 'Лилит', 'Лилит пока недоступна.');
  }

  return buildReadySection('lilith', 'Лилит', [item]);
}

export function formatSelenaDisplay(selenaResult) {
  if (!isReady(selenaResult)) {
    return fallbackSection('selena', 'Селена', 'Селена пока недоступна.');
  }

  const item = formatSpecialPointResult(selenaResult.selena);
  if (!item) {
    return fallbackSection('selena', 'Селена', 'Селена пока недоступна.');
  }

  return buildReadySection('selena', 'Селена', [item]);
}

export function formatSpecialPointsResult(input = {}) {
  const source = isObject(input) ? input : {};
  const sections = [
    formatLunarNodesDisplay(source.lunarNodesResult, source.lunarNodesAssignmentResult),
    formatLilithDisplay(source.lilithResult),
    formatSelenaDisplay(source.selenaResult),
  ];
  const items = sections.flatMap((section) => section.items).filter(Boolean);
  const ready = items.length > 0;

  if (!ready) {
    return {
      status: 'notReady',
      ready: false,
      title: TITLE,
      summary: FALLBACK_SUMMARY,
      message: FALLBACK_MESSAGE,
      sections,
      items: [],
      limitations: getSpecialPointsDisplayLimitations(),
    };
  }

  return {
    status: 'ready',
    ready: true,
    title: TITLE,
    summary: countPhrase(items.length),
    sections,
    items: items.map(cloneDisplayItem),
    message: null,
    limitations: getSpecialPointsDisplayLimitations(),
  };
}

export function summarizeSpecialPointsDisplay(displayResult) {
  if (!isObject(displayResult) || displayResult.status !== 'ready' || displayResult.ready !== true) {
    return {
      status: 'notReady',
      text: 'Особые точки недоступны',
      count: 0,
      sectionsReady: 0,
    };
  }

  const items = Array.isArray(displayResult.items) ? displayResult.items : [];
  const sections = Array.isArray(displayResult.sections) ? displayResult.sections : [];

  return {
    status: 'ready',
    text: 'Особые точки рассчитаны',
    count: items.length,
    sectionsReady: sections.filter((section) => section?.ready === true).length,
  };
}

export function isDisplayableSpecialPointItem(item) {
  if (!isObject(item) || typeof item.text !== 'string' || item.text.length === 0) {
    return false;
  }

  return !containsUnsafeText(item);
}

export function getSpecialPointsDisplayLimitations() {
  return [
    'В Sprint 13 активны mean Lunar Nodes, Mean Lilith и Selena / White Moon.',
    'True Node, True/Osculating Lilith и альтернативные Selena source systems отложены.',
    'Селена отображается как фиктивная / гипотетическая расчетная точка.',
    'Этот блок не содержит интерпретаций.',
  ];
}
