import { ASTRO_ZODIAC_SIGNS, normalizeDegrees } from './astroMath.js';
import { calculateAscMcForProfile } from './ascMc.js';

const READY_STATUS = 'ready';
const NOT_READY_STATUS = 'notReady';
const UNSUPPORTED_STATUS = 'unsupported';
const HOUSE_SYSTEM = 'whole-sign';
const HOUSE_SYSTEM_LABEL = 'Whole Sign';
const SIGN_SIZE = 30;

const HOUSE_SYSTEM_LABELS = Object.freeze({
  'whole-sign': 'Whole Sign',
  'equal-house': 'Equal House',
  placidus: 'Placidus',
});

const MESSAGES = Object.freeze({
  missingAsc: 'Для Whole Sign домов нужен готовый ASC.',
  invalidAsc: 'ASC должен содержать корректный знак зодиака.',
  missingAscMc: 'Для Whole Sign домов нужен готовый результат ASC / MC.',
  ascMcNotReady: 'ASC / MC еще не готовы для расчета Whole Sign домов.',
  missingProfile: 'Сначала выберите профиль.',
  selectedHouseSystemNotWholeSign: 'Выбрана другая система домов. Whole Sign engine не выполняет расчет для выбранной системы.',
  unsupportedHouseSystem: 'Выбранная система домов пока не поддерживается Whole Sign engine.',
  calculationError: 'Whole Sign дома не удалось рассчитать безопасно.',
});

const SIGN_INDEX_BY_KEY = Object.freeze(Object.fromEntries(
  ASTRO_ZODIAC_SIGNS.map((sign, index) => [sign.key, index]),
));

export function calculateWholeSignHouses(ascAngle = null) {
  if (!ascAngle || typeof ascAngle !== 'object') {
    return notReadyResult('missingAsc');
  }

  if (!isSupportedWholeSignHouseInput(ascAngle)) {
    return notReadyResult('invalidAsc');
  }

  const houses = buildWholeSignHouses(ascAngle.sign.key);

  if (houses.length !== 12) {
    return notReadyResult('calculationError');
  }

  return Object.freeze({
    status: READY_STATUS,
    ready: true,
    houseSystem: HOUSE_SYSTEM,
    houseSystemLabel: HOUSE_SYSTEM_LABEL,
    houses,
    angles: Object.freeze({
      asc: ascAngle,
    }),
    limitations: getWholeSignHousesCalculationLimitations(),
    capabilities: getWholeSignHousesEngineCapabilities(),
  });
}

export function calculateWholeSignHousesFromAscMc(ascMcResult = null) {
  if (!ascMcResult || typeof ascMcResult !== 'object') {
    return notReadyResult('missingAscMc');
  }

  if (ascMcResult.status !== READY_STATUS || ascMcResult.ready === false) {
    return notReadyResult('ascMcNotReady', ascMcResult.message);
  }

  const asc = ascMcResult.angles?.asc;
  const houseResult = calculateWholeSignHouses(asc);

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
    limitations: getWholeSignHousesCalculationLimitations(),
    capabilities: getWholeSignHousesEngineCapabilities(),
  });
}

export function calculateWholeSignHousesForProfile(profile = null) {
  if (!profile || typeof profile !== 'object') {
    return notReadyResult('missingProfile');
  }

  const selectedHouseSystem = normalizeProfileHouseSystemForWholeSignGuard(profile.houseSystem);

  if (selectedHouseSystem === null && hasSavedHouseSystemValue(profile)) {
    return unsupportedSelectedSystemResult('unsupportedHouseSystem', null);
  }

  if (selectedHouseSystem && selectedHouseSystem !== HOUSE_SYSTEM) {
    return unsupportedSelectedSystemResult('selectedHouseSystemNotWholeSign', selectedHouseSystem);
  }

  const ascMcResult = calculateAscMcForProfile(profile);

  if (ascMcResult.status !== READY_STATUS) {
    return notReadyResult(ascMcResult.reason, ascMcResult.message);
  }

  return calculateWholeSignHousesFromAscMc(ascMcResult);
}

export function getWholeSignHouseForSign(ascSignKey, targetSignKey) {
  const ascIndex = getSignIndex(ascSignKey);
  const targetIndex = getSignIndex(targetSignKey);

  if (ascIndex === null || targetIndex === null) {
    return null;
  }

  return ((targetIndex - ascIndex + ASTRO_ZODIAC_SIGNS.length) % ASTRO_ZODIAC_SIGNS.length) + 1;
}

export function getWholeSignHouseSequence(ascSignKey) {
  const ascIndex = getSignIndex(ascSignKey);

  if (ascIndex === null) {
    return Object.freeze([]);
  }

  return Object.freeze(
    Array.from({ length: ASTRO_ZODIAC_SIGNS.length }, (_, offset) => (
      ASTRO_ZODIAC_SIGNS[(ascIndex + offset) % ASTRO_ZODIAC_SIGNS.length].key
    )),
  );
}

export function isWholeSignHouseSystemValue(value) {
  return normalizeWholeSignHouseSystemValue(value) === HOUSE_SYSTEM;
}

export function normalizeWholeSignHouseSystemValue(value) {
  const normalized = normalizeHouseSystemText(value);

  if (normalized === 'wholesign' || normalized === 'whole-sign') {
    return HOUSE_SYSTEM;
  }

  if (normalized === 'equal' || normalized === 'equal-house' || normalized === 'equalhouse') {
    return 'equal-house';
  }

  if (normalized === 'placidus') {
    return 'placidus';
  }

  return null;
}

export function isSupportedWholeSignHouseInput(ascAngle = null) {
  if (!ascAngle || typeof ascAngle !== 'object') {
    return false;
  }

  const signKey = ascAngle.sign?.key;

  if (getSignIndex(signKey) === null) {
    return false;
  }

  if (
    ascAngle.longitude !== undefined
    && ascAngle.longitude !== null
    && !Number.isFinite(ascAngle.longitude)
  ) {
    return false;
  }

  return true;
}

export function getWholeSignHousesEngineCapabilities() {
  return Object.freeze({
    houses: true,
    wholeSign: true,
    equalHouse: false,
    placidus: false,
    quadrantCusps: false,
    exactCusps: false,
    ascMcRequired: true,
    planetInHouse: false,
    interpretations: false,
    transits: false,
    fixedStars: false,
  });
}

export function getWholeSignHousesCalculationLimitations() {
  return Object.freeze([
    'В этом модуле реализована только система Whole Sign.',
    'House 1 начинается со знака ASC, а не с точного градуса ASC.',
    'ASC и MC рассчитываются как углы карты.',
    'MC в Whole Sign не обязательно является куспидом 10 дома.',
    'Equal House и Placidus реализуются отдельными модулями.',
    'Этот модуль не распределяет планеты по домам.',
  ]);
}

function buildWholeSignHouses(ascSignKey) {
  const sequence = getWholeSignHouseSequence(ascSignKey);

  return Object.freeze(sequence.map((signKey, index) => {
    const sign = getSignByKey(signKey);
    const signStartLongitude = sign.index * SIGN_SIZE;
    const signEndLongitude = normalizeDegrees(signStartLongitude + SIGN_SIZE);

    return Object.freeze({
      number: index + 1,
      sign: freezeSign(sign),
      signStartLongitude,
      signEndLongitude,
      label: `${index + 1} дом`,
      text: `${index + 1} дом — ${sign.ru}`,
    });
  }));
}

function notReadyResult(reason, message = null) {
  return Object.freeze({
    status: NOT_READY_STATUS,
    ready: false,
    reason,
    houseSystem: HOUSE_SYSTEM,
    houseSystemLabel: HOUSE_SYSTEM_LABEL,
    message: message || MESSAGES[reason] || MESSAGES.calculationError,
    houses: Object.freeze([]),
    angles: null,
    capabilities: getWholeSignHousesEngineCapabilities(),
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
    message: reason === 'selectedHouseSystemNotWholeSign'
      ? `Выбрана другая система домов. Whole Sign engine не выполняет расчет для ${selectedLabel}.`
      : MESSAGES.unsupportedHouseSystem,
    houses: Object.freeze([]),
    angles: null,
    capabilities: getWholeSignHousesEngineCapabilities(),
  });
}

function normalizeProfileHouseSystemForWholeSignGuard(value) {
  if (!hasSavedHouseSystemToken(value)) {
    return HOUSE_SYSTEM;
  }

  return normalizeWholeSignHouseSystemValue(value);
}

function hasSavedHouseSystemValue(profile) {
  return hasSavedHouseSystemToken(profile?.houseSystem);
}

function hasSavedHouseSystemToken(value) {
  return typeof value === 'string' && value.trim() !== '';
}

function normalizeHouseSystemText(value) {
  return typeof value === 'string' ? value.trim().toLowerCase() : '';
}

function getSignIndex(signKey) {
  return Object.hasOwn(SIGN_INDEX_BY_KEY, signKey) ? SIGN_INDEX_BY_KEY[signKey] : null;
}

function getSignByKey(signKey) {
  const index = getSignIndex(signKey);

  return index === null ? null : ASTRO_ZODIAC_SIGNS[index];
}

function freezeSign(sign) {
  return Object.freeze({
    key: sign.key,
    ru: sign.ru,
    symbol: sign.symbol,
  });
}
