import { createBirthDateTimeInput } from './birthDateTime.js';
import { evaluateHousesInputReadiness } from './housesInputGuardrails.js';
import { normalizeProfile } from './profileModel.js';

export const GENERAL_PROFILE_NAME = 'Общий день';
export const PERSONAL_TRANSITS_UNAVAILABLE_REASON = 'Персональные транзиты пока не рассчитываются.';
// Kept for backwards compatibility with earlier imports.
export const PERSONAL_ENGINE_UNAVAILABLE_REASON = PERSONAL_TRANSITS_UNAVAILABLE_REASON;

const UNKNOWN_TIME_WARNING = 'Время рождения неизвестно — дома и ASC/MC недоступны.';
const COORDINATES_WARNING = 'Для домов и ASC/MC нужны координаты места рождения.';
const TIMEZONE_WARNING = 'Для точного расчета нужно знать часовой пояс места рождения.';

// Features that are genuinely not implemented yet. Natal planets, houses and
// ASC/MC are calculated for a complete profile (see natalPlanetsForProfile.js,
// houseSystemResolver.js, ascMc.js) and are reported through readiness flags.
const UNSUPPORTED_FEATURES = Object.freeze([
  'moonInNatalHouse',
  'personalTransits',
  'transitOrbs',
  'personalRitualScoring',
]);

export function createPersonalProfileInput(profile) {
  if (!profile) {
    const capabilities = getPersonalCalculationCapabilities({
      isProfileSelected: false,
      name: GENERAL_PROFILE_NAME,
      birthDate: '',
    });

    return {
      profileId: null,
      name: GENERAL_PROFILE_NAME,
      birthDate: '',
      birthTime: '',
      birthTimeAccuracy: 'unknown',
      birthPlace: null,
      currentPlace: null,
      houseSystem: null,
      zodiac: null,
      isProfileSelected: false,
      isReadyForBasicPersonalContext: false,
      isReadyForNatalPlanets: false,
      isReadyForHouses: false,
      isReadyForAscMc: false,
      missingFields: [],
      warnings: [],
      unsupportedFeatures: [...UNSUPPORTED_FEATURES],
      capabilities,
    };
  }

  const normalized = normalizeProfile(profile);
  const missingFields = getMissingFields(normalized);
  const warnings = getWarnings(normalized, missingFields);
  const isReadyForBasicPersonalContext = Boolean(normalized.name && normalized.birthDate);
  const isReadyForNatalPlanets = createBirthDateTimeInput(normalized).canConvertToUtc === true;
  const isReadyForHouses = evaluateHousesInputReadiness(normalized).ready === true;
  const baseInput = {
    profileId: normalized.id,
    name: normalized.name,
    birthDate: normalized.birthDate,
    birthTime: normalized.birthTime,
    birthTimeAccuracy: normalized.birthTimeAccuracy,
    birthPlace: normalized.birthPlace,
    currentPlace: normalized.currentPlace,
    houseSystem: normalized.houseSystem,
    zodiac: normalized.zodiac,
    isProfileSelected: true,
    isReadyForBasicPersonalContext,
    isReadyForNatalPlanets,
    isReadyForHouses,
    isReadyForAscMc: isReadyForHouses,
    missingFields,
    warnings,
    unsupportedFeatures: [...UNSUPPORTED_FEATURES],
  };

  return {
    ...baseInput,
    capabilities: getPersonalCalculationCapabilities(baseInput),
  };
}

export function getPersonalProfileReadiness(profile) {
  const input = createPersonalProfileInput(profile);

  return {
    isProfileSelected: input.isProfileSelected,
    isReadyForBasicPersonalContext: input.isReadyForBasicPersonalContext,
    isReadyForNatalPlanets: input.isReadyForNatalPlanets,
    isReadyForHouses: input.isReadyForHouses,
    isReadyForAscMc: input.isReadyForAscMc,
    missingFields: input.missingFields,
    warnings: input.warnings,
    capabilities: input.capabilities,
  };
}

export function getPersonalCalculationCapabilities(input = {}) {
  const isProfileSelected = Boolean(input.isProfileSelected);
  const hasName = Boolean(trimString(input.name) && input.name !== GENERAL_PROFILE_NAME);
  const hasBirthDate = Boolean(trimString(input.birthDate));

  return {
    canUseProfileName: isProfileSelected && hasName,
    canUseBirthDate: isProfileSelected && hasBirthDate,
    canCalculateNatalPlanets: isProfileSelected && input.isReadyForNatalPlanets === true,
    canCalculateHouses: isProfileSelected && input.isReadyForHouses === true,
    canCalculateAscMc: isProfileSelected && input.isReadyForAscMc === true,
    canCalculatePersonalTransits: false,
    reason: PERSONAL_TRANSITS_UNAVAILABLE_REASON,
  };
}

function getMissingFields(profile) {
  return unique([
    profile.birthDate ? '' : 'birthDate',
    shouldRequireBirthTime(profile) && !profile.birthTime ? 'birthTime' : '',
    hasCoordinates(profile.birthPlace) ? '' : 'birthPlace.coordinates',
    profile.birthPlace.timezone ? '' : 'birthPlace.timezone',
  ]);
}

function getWarnings(profile, missingFields) {
  return unique([
    profile.birthTimeAccuracy === 'unknown' ? UNKNOWN_TIME_WARNING : '',
    missingFields.includes('birthPlace.coordinates') ? COORDINATES_WARNING : '',
    missingFields.includes('birthPlace.timezone') ? TIMEZONE_WARNING : '',
  ]);
}

function shouldRequireBirthTime(profile) {
  return profile.birthTimeAccuracy !== 'unknown';
}

function hasCoordinates(place) {
  return Number.isFinite(place?.latitude) && Number.isFinite(place?.longitude);
}

function trimString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function unique(items) {
  return [...new Set(items.filter(Boolean))];
}
