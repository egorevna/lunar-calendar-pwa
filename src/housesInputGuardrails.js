const READY_STATUS = 'ready';
const NOT_READY_STATUS = 'notReady';
const INITIAL_HOUSE_SYSTEM = 'whole-sign';

const FALLBACK_MESSAGES = Object.freeze({
  missingProfile: 'Сначала выберите профиль.',
  commonDay:
    'Дома и углы карты недоступны для общего дня. Нужен персональный профиль с точным временем и местом рождения.',
  missingBirthDate: 'Для расчета домов нужна дата рождения.',
  missingExactBirthTime: 'Для расчета домов нужно точное время рождения.',
  missingTimezone: 'Для расчета домов нужен часовой пояс места рождения.',
  missingBirthPlace: 'Для расчета домов нужно место рождения.',
  missingBirthCoordinates: 'Для расчета домов нужно место рождения с координатами.',
  countryRegionOnly: 'Страны или региона недостаточно. Выберите город рождения или введите координаты.',
  cityWithoutCoordinates:
    'Для выбранного города нужны координаты. Выберите город из справочника или введите координаты вручную.',
  invalidBirthCoordinates: 'Координаты места рождения должны быть корректными числами.',
  invalidProfile: 'Профиль пока не готов для расчета домов.',
  unsupported: 'Дома и углы карты пока недоступны.',
});

export function evaluateHousesInputReadiness(profile = null) {
  const reason = getReadinessReason(profile);
  const ready = reason === null;
  const coordinateStatus = getBirthCoordinateStatus(profile);

  return Object.freeze({
    status: ready ? READY_STATUS : NOT_READY_STATUS,
    ready,
    reason,
    houseSystem: INITIAL_HOUSE_SYSTEM,
    requirements: Object.freeze({
      exactBirthTime: ready,
      birthCoordinates: ready,
    }),
    flags: Object.freeze({
      hasProfile: Boolean(profile && typeof profile === 'object'),
      hasBirthDate: hasBirthDate(profile),
      hasBirthTime: hasBirthTime(profile),
      hasExactBirthTime: hasExactBirthTime(profile),
      hasTimezone: hasBirthTimezone(profile),
      hasBirthPlace: coordinateStatus.hasBirthPlace,
      hasBirthCoordinates: coordinateStatus.hasCoordinates,
      hasCityLevelCoordinates: coordinateStatus.hasCoordinates && coordinateStatus.cityLevelAccepted,
      countryRegionOnly: coordinateStatus.countryRegionOnly,
      cityWithoutCoordinates: coordinateStatus.cityWithoutCoordinates,
      commonDay: isCommonDayProfile(profile),
    }),
    message: ready
      ? 'Данные для расчета домов готовы.'
      : getHousesInputFallbackMessage(reason),
  });
}

export function hasExactBirthTime(profile = null) {
  if (!profile || typeof profile !== 'object') {
    return false;
  }

  return cleanText(profile.birthTimeAccuracy) === 'exact' && hasBirthTime(profile);
}

export function hasBirthCoordinates(profile = null) {
  return getCoordinatePair(profile).status === 'ready';
}

export function getBirthCoordinateStatus(profile = null) {
  const birthPlace = getBirthPlace(profile);
  const hasBirthPlace = Boolean(birthPlace);
  const coordinatePair = getCoordinatePair(profile);
  const hasCoordinates = coordinatePair.status === 'ready';
  const countryRegionOnly = isCountryRegionOnlyBirthPlace(profile);
  const cityWithoutCoordinates = isCityWithoutCoordinates(profile);
  let reason = null;

  if (!hasBirthPlace) {
    reason = 'missingBirthPlace';
  } else if (hasCoordinates) {
    reason = null;
  } else if (coordinatePair.status === 'invalid') {
    reason = 'invalidBirthCoordinates';
  } else if (countryRegionOnly) {
    reason = 'countryRegionOnly';
  } else if (cityWithoutCoordinates) {
    reason = 'cityWithoutCoordinates';
  } else {
    reason = 'missingBirthCoordinates';
  }

  return Object.freeze({
    hasBirthPlace,
    hasCoordinates,
    cityLevelAccepted: hasCoordinates,
    countryRegionOnly,
    cityWithoutCoordinates,
    reason,
  });
}

export function isCountryRegionOnlyBirthPlace(profile = null) {
  const birthPlace = getBirthPlace(profile);

  if (!birthPlace || hasBirthCoordinates(profile) || hasCityName(birthPlace)) {
    return false;
  }

  return hasCountryOrRegion(birthPlace);
}

export function isCityWithoutCoordinates(profile = null) {
  const birthPlace = getBirthPlace(profile);

  if (!birthPlace || !hasCityName(birthPlace) || hasBirthCoordinates(profile)) {
    return false;
  }

  return getCoordinatePair(profile).status !== 'invalid';
}

export function getHousesInputRequirements() {
  return Object.freeze({
    exactBirthTimeRequired: true,
    birthCoordinatesRequired: true,
    cityLevelCoordinatesAccepted: true,
    hospitalCoordinatesRequired: false,
    countryRegionOnlyAccepted: false,
    cityWithoutCoordinatesAccepted: false,
    commonDayAccepted: false,
    houseSystem: INITIAL_HOUSE_SYSTEM,
  });
}

export function getHousesInputFallbackMessage(reason = 'unsupported') {
  return FALLBACK_MESSAGES[reason] ?? FALLBACK_MESSAGES.unsupported;
}

export function getHousesInputGuardrailLimitations() {
  return Object.freeze([
    'Для домов, ASC и MC нужны точное время рождения и место рождения с координатами.',
    'Городских координат достаточно для обычного режима; координаты роддома не обязательны.',
    'Если время рождения неизвестно, ASC / MC / дома не рассчитываются.',
    'Whole Sign — первая безопасная система домов; Placidus/quadrant cusps отложены до отдельной верификации.',
  ]);
}

export function getInitialHouseSystemPolicy() {
  return Object.freeze({
    houseSystem: INITIAL_HOUSE_SYSTEM,
    ascMcAnglesRequired: true,
    quadrantCuspsDeferred: true,
    placidusDeferred: true,
    labelRequired: true,
  });
}

function getReadinessReason(profile) {
  if (!profile || typeof profile !== 'object') {
    return 'missingProfile';
  }

  if (isCommonDayProfile(profile)) {
    return 'commonDay';
  }

  if (!hasBirthDate(profile)) {
    return 'missingBirthDate';
  }

  if (!hasExactBirthTime(profile)) {
    return 'missingExactBirthTime';
  }

  const coordinateStatus = getBirthCoordinateStatus(profile);

  if (!coordinateStatus.hasBirthPlace) {
    return 'missingBirthPlace';
  }

  if (!hasBirthTimezone(profile)) {
    return 'missingTimezone';
  }

  if (coordinateStatus.countryRegionOnly) {
    return 'countryRegionOnly';
  }

  if (coordinateStatus.cityWithoutCoordinates) {
    return 'cityWithoutCoordinates';
  }

  if (coordinateStatus.reason === 'missingBirthCoordinates') {
    return 'missingBirthCoordinates';
  }

  if (coordinateStatus.reason === 'invalidBirthCoordinates') {
    return 'invalidBirthCoordinates';
  }

  return null;
}

function isCommonDayProfile(profile) {
  if (!profile || typeof profile !== 'object') {
    return false;
  }

  return ['common', 'commonDay'].includes(cleanText(profile.type))
    || ['common', 'commonDay'].includes(cleanText(profile.kind));
}

function hasBirthDate(profile) {
  return Boolean(cleanText(profile?.birthDate));
}

function hasBirthTime(profile) {
  return Boolean(cleanText(profile?.birthTime));
}

function hasBirthTimezone(profile) {
  const birthPlace = getBirthPlace(profile);

  return Boolean(cleanText(birthPlace?.timezone));
}

function getBirthPlace(profile) {
  const birthPlace = profile?.birthPlace;

  return birthPlace && typeof birthPlace === 'object' ? birthPlace : null;
}

function getCoordinatePair(profile) {
  const birthPlace = getBirthPlace(profile);

  if (!birthPlace) {
    return Object.freeze({ status: 'missing' });
  }

  const candidates = [
    [birthPlace.coordinates?.latitude, birthPlace.coordinates?.longitude],
    [birthPlace.coordinates?.lat, birthPlace.coordinates?.lng],
    [birthPlace.latitude, birthPlace.longitude],
    [birthPlace.lat, birthPlace.lng],
  ];

  const hasAnyCoordinateToken = candidates.some(([latitude, longitude]) => (
    latitude !== undefined && latitude !== null
  ) || (
    longitude !== undefined && longitude !== null
  ));
  const matchingPair = candidates.find(([latitude, longitude]) => (
    Number.isFinite(latitude) && Number.isFinite(longitude)
  ));

  if (matchingPair) {
    return Object.freeze({ status: 'ready' });
  }

  return Object.freeze({ status: hasAnyCoordinateToken ? 'invalid' : 'missing' });
}

function hasCityName(birthPlace) {
  return Boolean(cleanText(birthPlace?.city) || cleanText(birthPlace?.place));
}

function hasCountryOrRegion(birthPlace) {
  return Boolean(
    cleanText(birthPlace?.country)
      || cleanText(birthPlace?.region)
      || cleanText(birthPlace?.state)
      || cleanText(birthPlace?.province),
  );
}

function cleanText(value) {
  return typeof value === 'string' ? value.trim() : '';
}
