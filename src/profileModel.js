export const BIRTH_TIME_ACCURACY_VALUES = ['exact', 'approximate', 'unknown'];
export const HOUSE_SYSTEM_VALUES = ['wholeSign', 'placidus', 'equal'];
export const ZODIAC_VALUES = ['tropical'];
export const CURRENT_PLACE_MODE_VALUES = ['moscow', 'custom'];

const DEFAULT_BIRTH_TIME_ACCURACY = 'exact';
const DEFAULT_HOUSE_SYSTEM = 'wholeSign';
const DEFAULT_ZODIAC = 'tropical';

const DEFAULT_CURRENT_PLACE = Object.freeze({
  mode: 'moscow',
  city: 'Москва',
  country: 'Россия',
  latitude: null,
  longitude: null,
  timezone: 'Europe/Moscow',
});

const EMPTY_BIRTH_PLACE = Object.freeze({
  city: '',
  country: '',
  latitude: null,
  longitude: null,
  timezone: '',
});

function trimString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeCoordinate(value) {
  return Number.isFinite(value) ? value : null;
}

function hasCoordinateToken(value) {
  return value !== undefined && value !== null && (Number.isFinite(value) || trimString(value) !== '');
}

function getBirthCoordinateInput(place) {
  const coordinates = isPlainObject(place.coordinates) ? place.coordinates : {};
  const nestedLatitude = coordinates.latitude ?? coordinates.lat;
  const nestedLongitude = coordinates.longitude ?? coordinates.lng;
  const directLatitude = place.latitude ?? place.lat;
  const directLongitude = place.longitude ?? place.lng;
  const hasNested = hasCoordinateToken(nestedLatitude) || hasCoordinateToken(nestedLongitude);

  return {
    latitude: hasNested ? nestedLatitude : directLatitude,
    longitude: hasNested ? nestedLongitude : directLongitude,
  };
}

function normalizeBirthCoordinates(place) {
  const coordinateInput = getBirthCoordinateInput(place);
  const latitude = normalizeCoordinate(coordinateInput.latitude);
  const longitude = normalizeCoordinate(coordinateInput.longitude);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return null;
  }

  return { latitude, longitude };
}

function normalizeEnum(value, allowedValues, fallback) {
  const normalized = trimString(value);
  return allowedValues.includes(normalized) ? normalized : fallback;
}

function normalizeBirthPlace(input) {
  const place = input && typeof input === 'object' ? input : {};
  const coordinates = normalizeBirthCoordinates(place);
  const latitude = coordinates ? coordinates.latitude : normalizeCoordinate(place.latitude);
  const longitude = coordinates ? coordinates.longitude : normalizeCoordinate(place.longitude);

  return {
    city: trimString(place.city),
    country: trimString(place.country),
    latitude,
    longitude,
    timezone: trimString(place.timezone),
    ...(coordinates ? { coordinates } : {}),
  };
}

function normalizeCurrentPlace(input) {
  const place = input && typeof input === 'object' ? input : {};

  return {
    mode: normalizeEnum(place.mode, CURRENT_PLACE_MODE_VALUES, DEFAULT_CURRENT_PLACE.mode),
    city: trimString(place.city) || DEFAULT_CURRENT_PLACE.city,
    country: trimString(place.country) || DEFAULT_CURRENT_PLACE.country,
    latitude: normalizeCoordinate(place.latitude),
    longitude: normalizeCoordinate(place.longitude),
    timezone: trimString(place.timezone) || DEFAULT_CURRENT_PLACE.timezone,
  };
}

function nowIsoString() {
  return new Date().toISOString();
}

function isPlainObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value);
}

function isSupported(value, allowedValues) {
  return allowedValues.includes(trimString(value));
}

function isValidDateString(value) {
  const normalized = trimString(value);

  if (!/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
    return false;
  }

  const date = new Date(`${normalized}T00:00:00.000Z`);

  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === normalized;
}

function isValidTimeString(value) {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(trimString(value));
}

function getCoordinateValidationState(value) {
  const empty = !hasCoordinateToken(value);
  const number = Number.isFinite(value) ? value : null;

  return { empty, number };
}

function getBirthCoordinateValidationErrors(birthPlace) {
  const place = isPlainObject(birthPlace) ? birthPlace : {};
  const coordinateInput = getBirthCoordinateInput(place);
  const latitude = getCoordinateValidationState(coordinateInput.latitude);
  const longitude = getCoordinateValidationState(coordinateInput.longitude);

  if (latitude.empty && longitude.empty) {
    return [];
  }

  if (latitude.empty || longitude.empty) {
    return ['birthPlace.coordinates pair is incomplete'];
  }

  return [
    !Number.isFinite(latitude.number) || latitude.number < -90 || latitude.number > 90
      ? 'birthPlace.coordinates.latitude is out of range'
      : null,
    !Number.isFinite(longitude.number) || longitude.number < -180 || longitude.number > 180
      ? 'birthPlace.coordinates.longitude is out of range'
      : null,
  ].filter(Boolean);
}

export function createProfileId() {
  if (typeof globalThis.crypto?.randomUUID === 'function') {
    return globalThis.crypto.randomUUID();
  }

  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).slice(2, 10);

  return `profile-${timestamp}-${randomPart}`;
}

export function getDefaultProfileSettings() {
  return {
    birthTimeAccuracy: DEFAULT_BIRTH_TIME_ACCURACY,
    houseSystem: DEFAULT_HOUSE_SYSTEM,
    zodiac: DEFAULT_ZODIAC,
    currentPlace: { ...DEFAULT_CURRENT_PLACE },
  };
}

export function createProfileDraft() {
  const timestamp = nowIsoString();
  const defaults = getDefaultProfileSettings();

  return {
    id: createProfileId(),
    name: '',
    birthDate: '',
    birthTime: '',
    birthTimeAccuracy: defaults.birthTimeAccuracy,
    birthPlace: { ...EMPTY_BIRTH_PLACE },
    currentPlace: { ...defaults.currentPlace },
    houseSystem: defaults.houseSystem,
    zodiac: defaults.zodiac,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export function normalizeProfile(input) {
  const source = isPlainObject(input) ? input : {};
  const draft = createProfileDraft();

  return {
    id: trimString(source.id) || draft.id,
    name: trimString(source.name),
    birthDate: trimString(source.birthDate),
    birthTime: trimString(source.birthTime),
    birthTimeAccuracy: normalizeEnum(
      source.birthTimeAccuracy,
      BIRTH_TIME_ACCURACY_VALUES,
      DEFAULT_BIRTH_TIME_ACCURACY,
    ),
    birthPlace: normalizeBirthPlace(source.birthPlace),
    currentPlace: normalizeCurrentPlace(source.currentPlace),
    houseSystem: normalizeEnum(source.houseSystem, HOUSE_SYSTEM_VALUES, DEFAULT_HOUSE_SYSTEM),
    zodiac: normalizeEnum(source.zodiac, ZODIAC_VALUES, DEFAULT_ZODIAC),
    createdAt: trimString(source.createdAt) || draft.createdAt,
    updatedAt: trimString(source.updatedAt) || draft.updatedAt,
  };
}

export function validateProfile(profile) {
  const source = isPlainObject(profile) ? profile : {};
  const normalized = normalizeProfile(source);
  const errors = [];

  if (!normalized.name) {
    errors.push('name is required');
  }

  if (!isValidDateString(normalized.birthDate)) {
    errors.push('birthDate must use YYYY-MM-DD');
  }

  if (!isSupported(source.birthTimeAccuracy, BIRTH_TIME_ACCURACY_VALUES)) {
    errors.push('birthTimeAccuracy is unsupported');
  }

  if (!isSupported(source.houseSystem, HOUSE_SYSTEM_VALUES)) {
    errors.push('houseSystem is unsupported');
  }

  if (!isSupported(source.zodiac, ZODIAC_VALUES)) {
    errors.push('zodiac is unsupported');
  }

  if (
    normalized.birthTimeAccuracy !== 'unknown'
    || (normalized.birthTimeAccuracy === 'unknown' && normalized.birthTime)
  ) {
    if (!isValidTimeString(normalized.birthTime)) {
      errors.push('birthTime must use HH:mm');
    }
  }

  if (!normalized.birthPlace.city) {
    errors.push('birthPlace.city is required');
  }

  if (!normalized.birthPlace.country) {
    errors.push('birthPlace.country is required');
  }

  errors.push(...getBirthCoordinateValidationErrors(source.birthPlace));

  const rawCurrentPlace = isPlainObject(source.currentPlace) ? source.currentPlace : {};

  if (!isSupported(rawCurrentPlace.mode, CURRENT_PLACE_MODE_VALUES)) {
    errors.push('currentPlace.mode is unsupported');
  }

  if (trimString(rawCurrentPlace.mode) === 'custom' && !trimString(rawCurrentPlace.timezone)) {
    errors.push('currentPlace.timezone is required');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function isValidProfile(profile) {
  return validateProfile(profile).valid;
}
