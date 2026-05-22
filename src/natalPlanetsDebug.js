import { createBirthDateTimeInput } from './birthDateTime.js';
import { getNatalPlanetsForProfile } from './natalPlanetsForProfile.js';
import { getNatalProviderValidationSummary } from './natalProviderValidationSummary.js';
import { getActiveProfileId, loadProfiles } from './profileStorage.js';

const GENERAL_DAY_REASON = 'Общий день не является персональным профилем.';
const READY_REASON = 'Натальные планеты доступны в панели «Мои карты».';
const INCOMPLETE_REASON = 'Данные рождения не готовы для безопасного показа.';
const NOT_SUPPORTED_REASON = 'Натальные планеты пока не поддерживаются.';
const ERROR_REASON = 'Натальные планеты временно недоступны.';

const MISSING_FIELD_LABELS = Object.freeze({
  birthDate: 'дата рождения',
  birthTime: 'время рождения',
  'birthPlace.timezone': 'часовой пояс рождения',
  'birthPlace.coordinates': 'координаты места рождения',
});

const STILL_NOT_SUPPORTED = Object.freeze({
  houses: 'notSupported',
  ascMc: 'notSupported',
  transits: 'notSupported',
  aspects: 'notSupported',
  orbs: 'notSupported',
});

export function createNatalPlanetsDebugSummaryFromStorage() {
  const profiles = loadProfiles();
  const activeProfileId = getActiveProfileId();
  const activeProfile = profiles.find((profile) => profile.id === activeProfileId) ?? null;

  return createNatalPlanetsDebugSummary(activeProfile, { activeProfileId });
}

export function createNatalPlanetsDebugSummary(profile = null, options = {}) {
  const providerValidation = getNatalProviderValidationSummary();
  const activeProfileId = normalizeText(options.activeProfileId ?? profile?.id);
  const activeProfileName = normalizeText(profile?.name) || 'Общий день';

  if (!profile) {
    return baseSummary({
      activeProfileId: null,
      activeProfileName: 'Общий день',
      hasActiveProfile: false,
      panelStatus: 'hidden',
      userFacingNatalPlanets: 'disabled',
      reason: GENERAL_DAY_REASON,
      provider: providerValidation.provider,
      providerValidated: isProviderValidated(providerValidation),
    });
  }

  const birthInput = createBirthDateTimeInput(profile);
  const natalPlanets = getNatalPlanetsForProfile(profile);
  const isReady = natalPlanets.status === 'ready'
    && natalPlanets.planets.length > 0
    && natalPlanets.formattedPlanets.length > 0;

  return baseSummary({
    activeProfileId,
    activeProfileName,
    hasActiveProfile: true,
    panelStatus: normalizePanelStatus(natalPlanets.status),
    userFacingNatalPlanets: isReady ? 'enabled' : 'disabled',
    reason: getReason(natalPlanets.status),
    canConvertToUtc: Boolean(birthInput.canConvertToUtc),
    provider: natalPlanets.source || providerValidation.provider,
    providerValidated: isProviderValidated(providerValidation),
    planetCount: isReady ? natalPlanets.planets.length : 0,
    formattedPlanetCount: isReady ? natalPlanets.formattedPlanets.length : 0,
    missingFields: formatMissingFields(natalPlanets.missingFields),
    warnings: formatSafeWarnings(natalPlanets.warnings),
  });
}

function baseSummary(overrides = {}) {
  return {
    activeProfileId: overrides.activeProfileId ?? null,
    activeProfileName: overrides.activeProfileName ?? 'Общий день',
    hasActiveProfile: overrides.hasActiveProfile ?? false,
    panelStatus: overrides.panelStatus ?? 'hidden',
    userFacingNatalPlanets: overrides.userFacingNatalPlanets ?? 'disabled',
    reason: overrides.reason ?? '',
    canConvertToUtc: overrides.canConvertToUtc ?? false,
    provider: overrides.provider ?? 'astronomy-engine',
    providerValidated: overrides.providerValidated ?? false,
    planetCount: overrides.planetCount ?? 0,
    formattedPlanetCount: overrides.formattedPlanetCount ?? 0,
    collapsibleDefault: 'collapsed',
    profilePanelLocation: 'My Cards',
    missingFields: overrides.missingFields ?? [],
    warnings: overrides.warnings ?? [],
    stillNotSupported: { ...STILL_NOT_SUPPORTED },
  };
}

function normalizePanelStatus(status) {
  return ['ready', 'incomplete', 'notSupported', 'error'].includes(status)
    ? status
    : 'incomplete';
}

function getReason(status) {
  if (status === 'ready') return READY_REASON;
  if (status === 'notSupported') return NOT_SUPPORTED_REASON;
  if (status === 'error') return ERROR_REASON;
  return INCOMPLETE_REASON;
}

function isProviderValidated(summary) {
  return summary?.provider === 'astronomy-engine'
    && summary?.longitudeValidation === 'passed'
    && summary?.speedValidation === 'passed'
    && summary?.retrogradeValidation === 'passed';
}

function formatMissingFields(fields) {
  if (!Array.isArray(fields)) {
    return [];
  }

  return unique(fields.map((field) => MISSING_FIELD_LABELS[field]).filter(Boolean));
}

function formatSafeWarnings(warnings) {
  if (!Array.isArray(warnings)) {
    return [];
  }

  return unique(warnings.map(normalizeText).filter(Boolean));
}

function normalizeText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function unique(items) {
  return [...new Set(items.filter(Boolean))];
}
