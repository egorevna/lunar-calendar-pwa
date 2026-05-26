import {
  formatDegree,
  normalizeDegrees,
} from './astroMath.js';
import { calculateAscMcForProfile } from './ascMc.js';

const READY_STATUS = 'ready';
const NOT_READY_STATUS = 'notReady';
const UNSUPPORTED_STATUS = 'unsupported';
const HOUSE_SYSTEM = 'equal-house';
const HOUSE_SYSTEM_LABEL = 'Равнодомная';
const SIGN_SIZE = 30;
const HOUSE_COUNT = 12;

const HOUSE_SYSTEM_LABELS = Object.freeze({
  'whole-sign': 'Whole Sign',
  'equal-house': 'Equal House',
  placidus: 'Placidus',
});

const MESSAGES = Object.freeze({
  missingAsc: 'Для равнодомной системы нужен готовый ASC.',
  invalidAsc: 'ASC должен содержать корректную зодиакальную долготу.',
  missingAscLongitude: 'Для равнодомной системы нужен точный градус ASC.',
  missingAscMc: 'Для равнодомной системы нужен готовый результат ASC / MC.',
  ascMcNotReady: 'ASC / MC еще не готовы для расчета равнодомной системы.',
  missingProfile: 'Сначала выберите профиль.',
  selectedHouseSystemNotEqualHouse:
    'Выбрана другая система домов. Равнодомный engine не выполняет расчет для выбранной системы.',
  unsupportedHouseSystem: 'Выбранная система домов пока не поддерживается равнодомным engine.',
  calculationError: 'Равнодомные дома не удалось рассчитать безопасно.',
});

export function calculateEqualHouseCusps(ascAngle = null) {
  if (!ascAngle || typeof ascAngle !== 'object') {
    return notReadyResult('missingAsc', { cusps: true });
  }

  if (!isSupportedEqualHouseInput(ascAngle)) {
    return notReadyResult(getAscInputReason(ascAngle), { cusps: true });
  }

  const cusps = buildEqualHouseCusps(ascAngle.longitude);

  if (cusps.length !== HOUSE_COUNT) {
    return notReadyResult('calculationError', { cusps: true });
  }

  return Object.freeze({
    status: READY_STATUS,
    ready: true,
    houseSystem: HOUSE_SYSTEM,
    houseSystemLabel: HOUSE_SYSTEM_LABEL,
    cusps,
    angles: Object.freeze({
      asc: ascAngle,
    }),
    limitations: getEqualHouseCalculationLimitations(),
    capabilities: getEqualHouseEngineCapabilities(),
  });
}

export function calculateEqualHouseHouses(ascAngle = null) {
  const cuspResult = calculateEqualHouseCusps(ascAngle);

  if (cuspResult.status !== READY_STATUS) {
    return notReadyResult(cuspResult.reason, { message: cuspResult.message });
  }

  const houses = buildEqualHouseSpans(cuspResult.cusps);

  return Object.freeze({
    status: READY_STATUS,
    ready: true,
    houseSystem: HOUSE_SYSTEM,
    houseSystemLabel: HOUSE_SYSTEM_LABEL,
    houses,
    cusps: cuspResult.cusps,
    angles: Object.freeze({
      asc: ascAngle,
    }),
    limitations: getEqualHouseCalculationLimitations(),
    capabilities: getEqualHouseEngineCapabilities(),
  });
}

export function calculateEqualHousesFromAscMc(ascMcResult = null) {
  if (!ascMcResult || typeof ascMcResult !== 'object') {
    return notReadyResult('missingAscMc');
  }

  if (ascMcResult.status !== READY_STATUS || ascMcResult.ready === false) {
    return notReadyResult('ascMcNotReady', { message: ascMcResult.message });
  }

  const asc = ascMcResult.angles?.asc;
  const houseResult = calculateEqualHouseHouses(asc);

  if (houseResult.status !== READY_STATUS) {
    return houseResult;
  }

  return Object.freeze({
    status: READY_STATUS,
    ready: true,
    houseSystem: HOUSE_SYSTEM,
    houseSystemLabel: HOUSE_SYSTEM_LABEL,
    angles: Object.freeze({
      asc,
      mc: ascMcResult.angles?.mc ?? null,
      dsc: ascMcResult.angles?.dsc ?? null,
      ic: ascMcResult.angles?.ic ?? null,
    }),
    houses: houseResult.houses,
    cusps: houseResult.cusps,
    limitations: getEqualHouseCalculationLimitations(),
    capabilities: getEqualHouseEngineCapabilities(),
  });
}

export function calculateEqualHousesForProfile(profile = null) {
  if (!profile || typeof profile !== 'object') {
    return notReadyResult('missingProfile');
  }

  const selectedHouseSystem = hasSavedHouseSystemToken(profile.houseSystem)
    ? normalizeEqualHouseSystemValue(profile.houseSystem)
    : null;

  if (selectedHouseSystem !== HOUSE_SYSTEM) {
    return unsupportedSelectedSystemResult(
      'selectedHouseSystemNotEqualHouse',
      selectedHouseSystem,
    );
  }

  const ascMcResult = calculateAscMcForProfile(profile);

  if (ascMcResult.status !== READY_STATUS) {
    return notReadyResult(ascMcResult.reason, { message: ascMcResult.message });
  }

  return calculateEqualHousesFromAscMc(ascMcResult);
}

export function getEqualHouseCuspLongitudes(ascLongitude) {
  const normalizedAsc = normalizeDegrees(ascLongitude);

  if (normalizedAsc === null) {
    return Object.freeze([]);
  }

  return Object.freeze(Array.from({ length: HOUSE_COUNT }, (_, index) => (
    normalizeDegrees(normalizedAsc + (index * SIGN_SIZE))
  )));
}

export function getEqualHouseCuspSequence(ascAngle = null) {
  const result = calculateEqualHouseCusps(ascAngle);

  return result.status === READY_STATUS ? result.cusps : Object.freeze([]);
}

export function isEqualHouseSystemValue(value) {
  return normalizeEqualHouseSystemValue(value) === HOUSE_SYSTEM;
}

export function normalizeEqualHouseSystemValue(value) {
  const normalized = normalizeHouseSystemText(value);

  if (normalized === 'equal' || normalized === 'equal-house' || normalized === 'equalhouse') {
    return HOUSE_SYSTEM;
  }

  if (normalized === 'wholesign' || normalized === 'whole-sign') {
    return 'whole-sign';
  }

  if (normalized === 'placidus') {
    return 'placidus';
  }

  return null;
}

export function isSupportedEqualHouseInput(ascAngle = null) {
  return Boolean(ascAngle && typeof ascAngle === 'object' && Number.isFinite(ascAngle.longitude));
}

export function getEqualHouseEngineCapabilities() {
  return Object.freeze({
    houses: true,
    equalHouse: true,
    wholeSign: false,
    placidus: false,
    quadrantCusps: false,
    exactCusps: true,
    ascMcRequired: true,
    planetInHouse: false,
    interpretations: false,
    transits: false,
    fixedStars: false,
  });
}

export function getEqualHouseCalculationLimitations() {
  return Object.freeze([
    'В этом модуле реализована только равнодомная система домов.',
    'Куспид 1 дома начинается от точного градуса ASC.',
    'Каждый следующий куспид отстоит на 30°.',
    'MC в равнодомной системе не обязательно является куспидом 10 дома.',
    'Whole Sign и Placidus реализуются отдельными модулями.',
    'Этот модуль не распределяет планеты по домам.',
  ]);
}

function buildEqualHouseCusps(ascLongitude) {
  return Object.freeze(getEqualHouseCuspLongitudes(ascLongitude).map((longitude, index) => {
    const formatted = formatEqualHouseCusp(longitude);
    const number = index + 1;

    return Object.freeze({
      number,
      longitude,
      sign: formatted.sign,
      degree: formatted.degree,
      minutes: formatted.minutes,
      seconds: formatted.seconds,
      label: `Куспид ${number} дома`,
      text: `${number} дом — ${formatted.text}`,
    });
  }));
}

function buildEqualHouseSpans(cusps) {
  return Object.freeze(cusps.map((cusp, index) => {
    const nextCusp = cusps[(index + 1) % cusps.length];

    return Object.freeze({
      number: cusp.number,
      cusp,
      nextCuspLongitude: nextCusp.longitude,
      wraps: nextCusp.longitude < cusp.longitude,
      label: `${cusp.number} дом`,
      text: cusp.text,
    });
  }));
}

function formatEqualHouseCusp(longitude) {
  const normalized = normalizeDegrees(longitude);
  const formatted = formatDegree(normalized);

  if (normalized === null || !formatted.signKey) {
    return null;
  }

  return Object.freeze({
    sign: Object.freeze({
      key: formatted.signKey,
      ru: formatted.sign,
      symbol: formatted.symbol,
    }),
    degree: formatted.degree,
    minutes: formatted.minutes,
    seconds: formatted.seconds,
    text: `${formatted.sign} ${formatted.degree}°${String(formatted.minutes).padStart(2, '0')}′${String(formatted.seconds).padStart(2, '0')}″`,
  });
}

function notReadyResult(reason, options = {}) {
  const includeCusps = options.cusps === true;

  return Object.freeze({
    status: NOT_READY_STATUS,
    ready: false,
    reason,
    houseSystem: HOUSE_SYSTEM,
    houseSystemLabel: HOUSE_SYSTEM_LABEL,
    message: options.message || MESSAGES[reason] || MESSAGES.calculationError,
    ...(includeCusps ? { cusps: Object.freeze([]) } : {}),
    houses: Object.freeze([]),
    angles: null,
    capabilities: getEqualHouseEngineCapabilities(),
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
    message: `Выбрана другая система домов. Равнодомный engine не выполняет расчет для ${selectedLabel}.`,
    houses: Object.freeze([]),
    angles: null,
    capabilities: getEqualHouseEngineCapabilities(),
  });
}

function getAscInputReason(ascAngle) {
  if (!ascAngle || typeof ascAngle !== 'object') {
    return 'missingAsc';
  }

  if (ascAngle.longitude === undefined || ascAngle.longitude === null) {
    return 'missingAscLongitude';
  }

  return 'invalidAsc';
}

function hasSavedHouseSystemToken(value) {
  return typeof value === 'string' && value.trim() !== '';
}

function normalizeHouseSystemText(value) {
  return typeof value === 'string' ? value.trim().toLowerCase() : '';
}
