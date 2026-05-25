import {
  calculateEqualHousesForProfile,
  calculateEqualHousesFromAscMc,
} from './equalHouseHouses.js';
import {
  calculatePlacidusHousesForProfile,
  calculatePlacidusHousesFromAscMc,
  getPlacidusValidationStatus,
} from './placidusHouses.js';
import {
  calculateWholeSignHousesForProfile,
  calculateWholeSignHousesFromAscMc,
} from './wholeSignHouses.js';

const READY_STATUS = 'ready';
const UNSUPPORTED_STATUS = 'unsupported';
const UNKNOWN_HOUSE_SYSTEM_REASON = 'unknownHouseSystem';

export const HOUSE_SYSTEM_KEYS = Object.freeze({
  WHOLE_SIGN: 'whole-sign',
  EQUAL_HOUSE: 'equal-house',
  PLACIDUS: 'placidus',
});

export const HOUSE_SYSTEM_LABELS = Object.freeze({
  [HOUSE_SYSTEM_KEYS.WHOLE_SIGN]: 'Whole Sign',
  [HOUSE_SYSTEM_KEYS.EQUAL_HOUSE]: 'Равнодомная',
  [HOUSE_SYSTEM_KEYS.PLACIDUS]: 'Placidus',
});

const UNKNOWN_HOUSE_SYSTEM_LABEL = 'Неизвестная система домов';
const EMPTY_ARRAY = Object.freeze([]);

export function normalizeHouseSystemValue(value) {
  const normalized = normalizeHouseSystemText(value);

  if (normalized === 'wholesign' || normalized === HOUSE_SYSTEM_KEYS.WHOLE_SIGN) {
    return HOUSE_SYSTEM_KEYS.WHOLE_SIGN;
  }

  if (
    normalized === 'equal'
    || normalized === 'equalhouse'
    || normalized === HOUSE_SYSTEM_KEYS.EQUAL_HOUSE
  ) {
    return HOUSE_SYSTEM_KEYS.EQUAL_HOUSE;
  }

  if (normalized === HOUSE_SYSTEM_KEYS.PLACIDUS) {
    return HOUSE_SYSTEM_KEYS.PLACIDUS;
  }

  return null;
}

export function getHouseSystemLabel(houseSystem) {
  const normalized = normalizeHouseSystemValue(houseSystem);

  return normalized ? HOUSE_SYSTEM_LABELS[normalized] : UNKNOWN_HOUSE_SYSTEM_LABEL;
}

export function resolveHouseSystemSelection(input = null, options = {}) {
  const explicitValue = hasHouseSystemToken(options.houseSystem) ? options.houseSystem : null;
  const profileValue = hasHouseSystemToken(input?.houseSystem) ? input.houseSystem : null;
  const rawValue = explicitValue ?? profileValue;
  const selectionSource = explicitValue
    ? 'explicit'
    : profileValue
      ? 'profile'
      : 'default';

  if (!rawValue) {
    return Object.freeze({
      status: READY_STATUS,
      selectedHouseSystem: HOUSE_SYSTEM_KEYS.WHOLE_SIGN,
      houseSystemLabel: HOUSE_SYSTEM_LABELS[HOUSE_SYSTEM_KEYS.WHOLE_SIGN],
      selectionSource,
      defaulted: true,
      reason: null,
    });
  }

  const selectedHouseSystem = normalizeHouseSystemValue(rawValue);

  if (!selectedHouseSystem) {
    return Object.freeze({
      status: UNSUPPORTED_STATUS,
      selectedHouseSystem: null,
      houseSystemLabel: UNKNOWN_HOUSE_SYSTEM_LABEL,
      selectionSource,
      defaulted: false,
      reason: UNKNOWN_HOUSE_SYSTEM_REASON,
      message: 'Выбрана неизвестная система домов.',
    });
  }

  return Object.freeze({
    status: READY_STATUS,
    selectedHouseSystem,
    houseSystemLabel: HOUSE_SYSTEM_LABELS[selectedHouseSystem],
    selectionSource,
    defaulted: false,
    reason: null,
  });
}

export function calculateHousesForSelectedSystem(profile = null, options = {}) {
  const selection = resolveHouseSystemSelection(profile, options);

  if (selection.status === UNSUPPORTED_STATUS) {
    return unsupportedUnknownResult(selection);
  }

  const profileForEngine = createEngineProfile(profile, selection.selectedHouseSystem);
  let engineResult = null;

  if (selection.selectedHouseSystem === HOUSE_SYSTEM_KEYS.WHOLE_SIGN) {
    engineResult = calculateWholeSignHousesForProfile(profileForEngine);
  } else if (selection.selectedHouseSystem === HOUSE_SYSTEM_KEYS.EQUAL_HOUSE) {
    engineResult = calculateEqualHousesForProfile(profileForEngine);
  } else if (selection.selectedHouseSystem === HOUSE_SYSTEM_KEYS.PLACIDUS) {
    engineResult = calculatePlacidusHousesForProfile(profileForEngine);
  }

  return wrapEngineResult(engineResult, selection);
}

export function calculateHousesFromAscMcForSelectedSystem(ascMcResult = null, houseSystem = null) {
  const selection = resolveHouseSystemSelection(null, { houseSystem });

  if (selection.status === UNSUPPORTED_STATUS) {
    return unsupportedUnknownResult(selection);
  }

  let engineResult = null;

  if (selection.selectedHouseSystem === HOUSE_SYSTEM_KEYS.WHOLE_SIGN) {
    engineResult = calculateWholeSignHousesFromAscMc(ascMcResult);
  } else if (selection.selectedHouseSystem === HOUSE_SYSTEM_KEYS.EQUAL_HOUSE) {
    engineResult = calculateEqualHousesFromAscMc(ascMcResult);
  } else if (selection.selectedHouseSystem === HOUSE_SYSTEM_KEYS.PLACIDUS) {
    engineResult = calculatePlacidusHousesFromAscMc(ascMcResult);
  }

  return wrapEngineResult(engineResult, selection);
}

export function getAvailableHouseSystems() {
  const placidusStatus = getPlacidusValidationStatus();
  const placidusReady = Boolean(
    placidusStatus.validated
      && placidusStatus.implementationReady
      && placidusStatus.benchmarkFixtures,
  );

  return Object.freeze([
    freezeSystemAvailability(HOUSE_SYSTEM_KEYS.WHOLE_SIGN, true),
    freezeSystemAvailability(HOUSE_SYSTEM_KEYS.EQUAL_HOUSE, true),
    freezeSystemAvailability(
      HOUSE_SYSTEM_KEYS.PLACIDUS,
      placidusReady,
      placidusReady ? null : placidusStatus.reason,
    ),
  ]);
}

export function isSupportedHouseSystem(houseSystem) {
  return normalizeHouseSystemValue(houseSystem) !== null;
}

export function getHouseSystemResolverCapabilities() {
  return Object.freeze({
    resolver: true,
    selectedSystemRouting: true,
    wholeSign: true,
    equalHouse: true,
    placidus: true,
    silentFallback: false,
    planetInHouse: false,
    interpretations: false,
    transits: false,
    fixedStars: false,
  });
}

export function getHouseSystemResolverLimitations() {
  return Object.freeze([
    'Выбранная в профиле система домов определяет расчет.',
    'Whole Sign, равнодомная и Placidus считаются отдельными системами.',
    'Системы домов не подменяются друг другом автоматически.',
    'Если система не поддержана или входные данные неполные, возвращается явный статус notReady/unsupported.',
    'Этот модуль не распределяет планеты по домам.',
  ]);
}

function createEngineProfile(profile, selectedHouseSystem) {
  if (!profile || typeof profile !== 'object') {
    return profile;
  }

  return {
    ...profile,
    houseSystem: selectedHouseSystem,
  };
}

function wrapEngineResult(engineResult, selection) {
  if (!engineResult || typeof engineResult !== 'object') {
    return Object.freeze({
      status: UNSUPPORTED_STATUS,
      ready: false,
      selectedHouseSystem: selection.selectedHouseSystem,
      houseSystem: selection.selectedHouseSystem,
      houseSystemLabel: selection.houseSystemLabel,
      selectionSource: selection.selectionSource,
      defaulted: selection.defaulted,
      reason: 'unsupportedHouseSystem',
      message: 'Выбранная система домов пока не готова.',
      result: null,
      houses: EMPTY_ARRAY,
      cusps: EMPTY_ARRAY,
      angles: null,
      capabilities: getHouseSystemResolverCapabilities(),
    });
  }

  return Object.freeze({
    status: engineResult.status,
    ready: engineResult.ready === true,
    selectedHouseSystem: selection.selectedHouseSystem,
    houseSystem: engineResult.houseSystem ?? selection.selectedHouseSystem,
    houseSystemLabel: engineResult.houseSystemLabel ?? selection.houseSystemLabel,
    selectionSource: selection.selectionSource,
    defaulted: selection.defaulted,
    reason: engineResult.reason ?? null,
    ...(engineResult.message ? { message: engineResult.message } : {}),
    result: engineResult,
    houses: freezeArray(engineResult.houses ?? []),
    cusps: freezeArray(engineResult.cusps ?? []),
    angles: engineResult.angles ?? null,
    capabilities: getHouseSystemResolverCapabilities(),
  });
}

function unsupportedUnknownResult(selection) {
  return Object.freeze({
    status: UNSUPPORTED_STATUS,
    ready: false,
    selectedHouseSystem: null,
    houseSystem: null,
    houseSystemLabel: UNKNOWN_HOUSE_SYSTEM_LABEL,
    selectionSource: selection.selectionSource,
    defaulted: selection.defaulted,
    reason: UNKNOWN_HOUSE_SYSTEM_REASON,
    message: selection.message,
    result: null,
    houses: EMPTY_ARRAY,
    cusps: EMPTY_ARRAY,
    angles: null,
    capabilities: getHouseSystemResolverCapabilities(),
  });
}

function freezeSystemAvailability(key, ready, reason = null) {
  return Object.freeze({
    key,
    label: HOUSE_SYSTEM_LABELS[key],
    implemented: true,
    ready,
    ...(reason ? { reason } : {}),
  });
}

function hasHouseSystemToken(value) {
  return typeof value === 'string' && value.trim() !== '';
}

function normalizeHouseSystemText(value) {
  return typeof value === 'string' ? value.trim().toLowerCase() : '';
}

function freezeArray(items) {
  return Object.freeze([...items]);
}
