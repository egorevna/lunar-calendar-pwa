const READY_STATUS = 'ready';
const TITLE = 'Неподвижные звезды';
const FALLBACK_SUMMARY = 'Пока недоступно.';
const FALLBACK_MESSAGE = 'Неподвижные звезды пока недоступны.';
const NO_HITS_SUMMARY = 'Соединений не найдено';
const NO_HITS_MESSAGE = 'Соединений с неподвижными звездами в выбранном орбе не найдено.';
const SOURCE_NOTE = 'Источник: Вронский, Таблица 18.';
const ORB_NOTE = 'Орб соединения: 1°00′.';

const RELATIONSHIP_LABELS = Object.freeze({
  conjunction: 'соединение',
});

const DISPLAY_LIMITATIONS = Object.freeze([
  'В Sprint 14 показываются только соединения с неподвижными звездами.',
  'Используется глобальный орб 1°00′.',
  'Цели: натальные планеты и ASC / MC / DSC / IC.',
  'Параны, гелиакические явления и другие аспекты отложены.',
  'Этот блок не содержит интерпретаций.',
]);

const TARGET_LABEL_FORMS = Object.freeze({
  asc: 'ASC',
  mc: 'MC',
  dsc: 'DSC',
  ic: 'IC',
  sun: 'Солнцем',
  moon: 'Луной',
  mercury: 'Меркурием',
  venus: 'Венерой',
  mars: 'Марсом',
  jupiter: 'Юпитером',
  saturn: 'Сатурном',
  uranus: 'Ураном',
  neptune: 'Нептуном',
  pluto: 'Плутоном',
});

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
  'sourceArray',
  'catalogDump',
  'targetArray',
  'positionArray',
  'distanceDegrees',
  'orbDegrees',
  'mythology',
  'prediction',
  'fatalistic',
  'karmic',
  'interpretation',
  'transit',
  'ritual',
  'приносит славу',
  'опасность',
  'фатально',
  'судьба',
  'карм',
  'зловещ',
  'ритуал',
  'предсказ',
  'миф',
]);

export function formatFixedStarHit(hit = null) {
  if (!isReadyHit(hit)) {
    return null;
  }

  const starKey = normalizeText(hit.starKey);
  const starLabel = normalizeText(hit.starLabel);
  const targetKey = normalizeText(hit.targetKey);
  const targetLabel = normalizeText(hit.targetLabel);
  const relationship = normalizeText(hit.relationship);
  const relationshipLabel = getFixedStarRelationshipLabel(relationship);
  const orbText = normalizeText(hit.orbText);
  const text = getHitText(hit, {
    starKey,
    starLabel,
    targetKey,
    targetLabel,
    relationshipLabel,
    orbText,
  });

  if (!starKey || !starLabel || !targetKey || !targetLabel || !relationshipLabel || !orbText || !text) {
    return null;
  }

  return safeDisplayItem({
    type: 'fixedStarHit',
    starKey,
    starLabel,
    targetKey,
    targetLabel,
    relationship,
    relationshipLabel,
    orbText,
    text,
  });
}

export function formatFixedStarHitList(hits = []) {
  if (!Array.isArray(hits)) {
    return [];
  }

  return hits.map(formatFixedStarHit).filter(Boolean);
}

export function formatFixedStarConjunctionResult(result = null) {
  if (!isReadyConjunctionResult(result)) {
    return formatUnavailableResult();
  }

  const items = formatFixedStarHitList(result.hits);
  const hitCount = items.length;
  const hasHits = hitCount > 0;

  return safeDisplayItem({
    status: READY_STATUS,
    ready: true,
    title: TITLE,
    summary: hasHits ? getHitSummary(hitCount) : NO_HITS_SUMMARY,
    items,
    notes: getFixedStarsDisplayNotes(),
    message: hasHits ? null : getSafeNoHitsMessage(result.message),
    limitations: getFixedStarsDisplayLimitations(),
    ...(result.partial === true ? { partial: true } : {}),
  });
}

export function getFixedStarRelationshipLabel(relationship = null) {
  return RELATIONSHIP_LABELS[normalizeText(relationship)] ?? null;
}

export function getFixedStarsSourceDisplayNote() {
  return SOURCE_NOTE;
}

export function getFixedStarsOrbDisplayNote() {
  return ORB_NOTE;
}

export function summarizeFixedStarsDisplay(displayResult = null) {
  if (!isPlainObject(displayResult) || displayResult.status !== READY_STATUS || displayResult.ready !== true) {
    return {
      status: 'notReady',
      hitCount: 0,
      text: 'Неподвижные звезды недоступны',
    };
  }

  const hitCount = Array.isArray(displayResult.items) ? displayResult.items.length : 0;

  return {
    status: READY_STATUS,
    hitCount,
    text: hitCount > 0
      ? getHitSummary(hitCount)
      : 'Соединений с неподвижными звездами не найдено',
  };
}

export function isDisplayableFixedStarHit(item = null) {
  if (!isPlainObject(item)) {
    return false;
  }

  const text = normalizeText(item.text);

  return Boolean(text && !containsUnsafeText(text));
}

export function getFixedStarsDisplayLimitations() {
  return [...DISPLAY_LIMITATIONS];
}

function formatUnavailableResult() {
  return safeDisplayItem({
    status: 'notReady',
    ready: false,
    title: TITLE,
    summary: FALLBACK_SUMMARY,
    items: [],
    message: FALLBACK_MESSAGE,
    notes: getFixedStarsDisplayNotes(),
    limitations: getFixedStarsDisplayLimitations(),
  });
}

function getFixedStarsDisplayNotes() {
  return [
    getFixedStarsSourceDisplayNote(),
    getFixedStarsOrbDisplayNote(),
  ];
}

function isReadyConjunctionResult(result) {
  return isPlainObject(result)
    && result.status === READY_STATUS
    && result.ready === true
    && Array.isArray(result.hits);
}

function isReadyHit(hit) {
  return isPlainObject(hit)
    && hit.status === READY_STATUS
    && hit.hit === true
    && normalizeText(hit.relationship) === 'conjunction';
}

function getHitText(hit, parts) {
  const existingText = normalizeText(hit.text);

  if (existingText && containsUnsafeText(existingText)) {
    return '';
  }

  if (!parts.starLabel || !parts.relationshipLabel || !parts.targetLabel || !parts.orbText) {
    return existingText;
  }

  const targetLabel = getTargetInstrumentalLabel(parts.targetKey, parts.targetLabel);
  const text = `${parts.starLabel} — ${parts.relationshipLabel} с ${targetLabel} · орб ${parts.orbText}`;

  return containsUnsafeText(text) ? '' : text;
}

function getTargetInstrumentalLabel(targetKey, targetLabel) {
  const normalizedKey = normalizeText(targetKey);
  const normalizedLabel = normalizeText(targetLabel);

  return TARGET_LABEL_FORMS[normalizedKey] ?? normalizedLabel;
}

function getHitSummary(count) {
  if (count === 1) {
    return '1 соединение с неподвижными звездами';
  }

  if (count >= 2 && count <= 4) {
    return `${count} соединения с неподвижными звездами`;
  }

  return `${count} соединений с неподвижными звездами`;
}

function getSafeNoHitsMessage(message = null) {
  const normalizedMessage = normalizeText(message);

  if (normalizedMessage && !containsUnsafeText(normalizedMessage)) {
    return normalizedMessage;
  }

  return NO_HITS_MESSAGE;
}

function safeDisplayItem(item) {
  return containsUnsafeText(item) ? null : item;
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

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function normalizeText(value) {
  return typeof value === 'string' && value.trim()
    ? value.trim()
    : '';
}
