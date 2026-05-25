import { evaluateHousesInputReadiness } from './housesInputGuardrails.js';

const NOT_READY_STATUS = 'notReady';
const UNSUPPORTED_STATUS = 'unsupported';
const HOUSE_SYSTEM = 'placidus';
const HOUSE_SYSTEM_LABEL = 'Placidus';

const HOUSE_SYSTEM_LABELS = Object.freeze({
  'whole-sign': 'Whole Sign',
  'equal-house': 'Equal House',
  placidus: 'Placidus',
});

const VALIDATION_STATUS = Object.freeze({
  validated: false,
  implementationReady: false,
  dependencyPath: 'devDependency:swisseph.swe_houses candidate; no benchmark fixtures',
  benchmarkFixtures: false,
  reason: 'missingBenchmarkFixtures',
});

const MESSAGES = Object.freeze({
  placidusNotValidated:
    'Placidus пока не активирован: нужен проверенный алгоритм и benchmark fixtures.',
  missingBenchmarkFixtures:
    'Placidus пока не активирован: нужны benchmark fixtures для проверки расчета.',
  placidusUnsupportedAtLatitude:
    'Placidus не поддержан для этих условий без отдельной верификации.',
  selectedHouseSystemNotPlacidus:
    'Выбрана другая система домов. Placidus engine не выполняет расчет для выбранной системы.',
  missingProfile: 'Сначала выберите профиль.',
  missingExactBirthTime: 'Для расчета домов нужно точное время рождения.',
  missingBirthCoordinates: 'Для расчета домов нужно место рождения с координатами.',
  invalidCoordinates: 'Координаты места рождения должны быть корректными числами.',
  calculationError: 'Placidus не удалось рассчитать безопасно.',
});

export function calculatePlacidusHouses() {
  return getPlacidusUnsupportedResult('placidusNotValidated');
}

export function calculatePlacidusHousesFromAscMc() {
  return getPlacidusUnsupportedResult('placidusNotValidated');
}

export function calculatePlacidusHousesForProfile(profile = null) {
  if (!profile || typeof profile !== 'object') {
    return notReadyResult('missingProfile');
  }

  const selectedHouseSystem = hasSavedHouseSystemToken(profile.houseSystem)
    ? normalizePlacidusHouseSystemValue(profile.houseSystem)
    : null;

  if (selectedHouseSystem !== HOUSE_SYSTEM) {
    return unsupportedSelectedSystemResult('selectedHouseSystemNotPlacidus', selectedHouseSystem);
  }

  const readiness = evaluateHousesInputReadiness(profile);

  if (!readiness.ready) {
    return notReadyResult(readiness.reason, readiness.message);
  }

  return getPlacidusUnsupportedResult('placidusNotValidated');
}

export function isPlacidusHouseSystemValue(value) {
  return normalizePlacidusHouseSystemValue(value) === HOUSE_SYSTEM;
}

export function normalizePlacidusHouseSystemValue(value) {
  const normalized = normalizeHouseSystemText(value);

  if (normalized === 'placidus') {
    return HOUSE_SYSTEM;
  }

  if (normalized === 'wholesign' || normalized === 'whole-sign') {
    return 'whole-sign';
  }

  if (normalized === 'equal' || normalized === 'equal-house' || normalized === 'equalhouse') {
    return 'equal-house';
  }

  return null;
}

export function getPlacidusValidationStatus() {
  return VALIDATION_STATUS;
}

export function getPlacidusEngineCapabilities() {
  return Object.freeze({
    houses: false,
    placidus: true,
    placidusRecognized: true,
    placidusValidated: false,
    placidusReady: false,
    wholeSign: false,
    equalHouse: false,
    quadrantCusps: false,
    exactCusps: false,
    ascMcRequired: true,
    planetInHouse: false,
    interpretations: false,
    transits: false,
    fixedStars: false,
  });
}

export function getPlacidusCalculationLimitations() {
  return Object.freeze([
    'Placidus распознан как отдельная система домов, но расчет не активирован без проверенного алгоритма и benchmark fixtures.',
    'Placidus не подменяется равнодомной системой.',
    'Placidus не подменяется Whole Sign.',
    'Для Placidus нужны отдельные тесты на high-latitude/circumpolar cases.',
    'Этот модуль не распределяет планеты по домам.',
  ]);
}

export function getPlacidusUnsupportedResult(reason = 'placidusNotValidated') {
  return Object.freeze({
    status: UNSUPPORTED_STATUS,
    ready: false,
    houseSystem: HOUSE_SYSTEM,
    houseSystemLabel: HOUSE_SYSTEM_LABEL,
    reason,
    message: getPlacidusMessage(reason),
    houses: Object.freeze([]),
    cusps: Object.freeze([]),
    angles: null,
    validation: getPlacidusValidationStatus(),
    limitations: getPlacidusCalculationLimitations(),
    capabilities: getPlacidusEngineCapabilities(),
  });
}

function notReadyResult(reason, message = null) {
  return Object.freeze({
    status: NOT_READY_STATUS,
    ready: false,
    houseSystem: HOUSE_SYSTEM,
    houseSystemLabel: HOUSE_SYSTEM_LABEL,
    reason,
    message: message || getPlacidusMessage(reason),
    houses: Object.freeze([]),
    cusps: Object.freeze([]),
    angles: null,
    validation: getPlacidusValidationStatus(),
    limitations: getPlacidusCalculationLimitations(),
    capabilities: getPlacidusEngineCapabilities(),
  });
}

function unsupportedSelectedSystemResult(reason, selectedHouseSystem) {
  const selectedLabel = HOUSE_SYSTEM_LABELS[selectedHouseSystem] ?? 'выбранной системы';

  return Object.freeze({
    status: UNSUPPORTED_STATUS,
    ready: false,
    reason,
    selectedHouseSystem,
    houseSystem: HOUSE_SYSTEM,
    houseSystemLabel: HOUSE_SYSTEM_LABEL,
    message: `Выбрана другая система домов. Placidus engine не выполняет расчет для ${selectedLabel}.`,
    houses: Object.freeze([]),
    cusps: Object.freeze([]),
    angles: null,
    validation: getPlacidusValidationStatus(),
    limitations: getPlacidusCalculationLimitations(),
    capabilities: getPlacidusEngineCapabilities(),
  });
}

function getPlacidusMessage(reason) {
  return MESSAGES[reason] ?? MESSAGES.placidusNotValidated;
}

function hasSavedHouseSystemToken(value) {
  return typeof value === 'string' && value.trim() !== '';
}

function normalizeHouseSystemText(value) {
  return typeof value === 'string' ? value.trim().toLowerCase() : '';
}
