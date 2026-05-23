import {
  ESSENTIAL_DIGNITY_SOURCE,
} from './essentialDignitiesData.js';
import { getEssentialDignitiesForProfile } from './essentialDignitiesForProfile.js';
import { getActiveProfileId, loadProfiles } from './profileStorage.js';

const GENERAL_DAY_LABEL = 'Общий день';
const READY_REASON = 'Достоинства планет доступны в панели «Мои карты».';
const GENERAL_DAY_REASON = 'Общий день не является персональным профилем.';
const INCOMPLETE_REASON = 'Достоинства планет недоступны: сначала нужен расчет натальных планет.';
const NOT_SUPPORTED_REASON = 'Достоинства планет пока не поддерживаются.';
const ERROR_REASON = 'Достоинства планет временно недоступны.';

const MISSING_FIELD_LABELS = Object.freeze({
  birthDate: 'дата рождения',
  birthTime: 'время рождения',
  'birthPlace.timezone': 'часовой пояс рождения',
  'birthPlace.coordinates': 'координаты места рождения',
});

const DEFERRED_FEATURES = Object.freeze({
  terms: 'deferred',
  decans: 'deferred',
  degreeRulers: 'deferred',
  exactExaltationDegrees: 'deferred',
  VronskyTables: 'deferred',
});

const STILL_NOT_SUPPORTED = Object.freeze({
  houses: 'notSupported',
  ascMc: 'notSupported',
  transits: 'notSupported',
  interpretations: 'notSupported',
});

export function createEssentialDignitiesDebugSummaryFromStorage() {
  const activeProfileId = getActiveProfileId();
  const activeProfile = loadProfiles().find((profile) => profile.id === activeProfileId) ?? null;

  return createEssentialDignitiesDebugSummary(activeProfile);
}

export function createEssentialDignitiesDebugSummary(profile = null) {
  if (!profile) {
    return debugSummary({
      hasActiveProfile: false,
      activeProfileId: null,
      activeProfileName: GENERAL_DAY_LABEL,
      panelStatus: 'hidden',
      userFacingEssentialDignities: 'disabled',
      reason: GENERAL_DAY_REASON,
      natalPlanetsReady: false,
    });
  }

  const essentialDignities = getEssentialDignitiesForProfile(profile);
  const isReady = essentialDignities.status === 'ready';
  const summary = essentialDignities.summary ?? {};

  return debugSummary({
    hasActiveProfile: true,
    activeProfileId: safeText(profile.id) || null,
    activeProfileName: safeText(profile.name) || 'Профиль',
    panelStatus: normalizePanelStatus(essentialDignities.status),
    userFacingEssentialDignities: isReady ? 'enabled' : 'disabled',
    reason: getReason(essentialDignities.status),
    natalPlanetsReady: isReady,
    scoreTotal: isReady ? summary.scoreTotal : 0,
    dignityCount: isReady ? summary.dignified : 0,
    debilityCount: isReady ? summary.debilitated : 0,
    neutralCount: isReady ? summary.neutral : 0,
    modernLabelCount: isReady ? summary.modern : 0,
    formattedDignityCount: isReady ? essentialDignities.formattedDignities.length : 0,
    missingFields: mapMissingFields(essentialDignities.missingFields),
    warnings: safeStringList(essentialDignities.warnings),
  });
}

function debugSummary(overrides = {}) {
  return {
    hasActiveProfile: overrides.hasActiveProfile ?? false,
    activeProfileId: overrides.activeProfileId ?? null,
    activeProfileName: overrides.activeProfileName ?? GENERAL_DAY_LABEL,
    panelStatus: overrides.panelStatus ?? 'hidden',
    userFacingEssentialDignities: overrides.userFacingEssentialDignities ?? 'disabled',
    reason: overrides.reason ?? GENERAL_DAY_REASON,
    natalPlanetsReady: overrides.natalPlanetsReady ?? false,
    dignityEngine: 'enabled',
    sourcePolicy: ESSENTIAL_DIGNITY_SOURCE.scoringBaseline,
    modernOuterPlanets: ESSENTIAL_DIGNITY_SOURCE.modernOuterPlanets,
    scoringModel: 'enabled',
    scoreTotal: overrides.scoreTotal ?? 0,
    dignityCount: overrides.dignityCount ?? 0,
    debilityCount: overrides.debilityCount ?? 0,
    neutralCount: overrides.neutralCount ?? 0,
    modernLabelCount: overrides.modernLabelCount ?? 0,
    formattedDignityCount: overrides.formattedDignityCount ?? 0,
    collapsibleDefault: 'collapsed',
    profilePanelLocation: 'My Cards',
    missingFields: overrides.missingFields ?? [],
    warnings: overrides.warnings ?? [],
    deferredFeatures: { ...DEFERRED_FEATURES },
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

function mapMissingFields(fields = []) {
  return safeStringList(fields).map((field) => MISSING_FIELD_LABELS[field]).filter(Boolean);
}

function safeStringList(items) {
  return Array.isArray(items)
    ? items.filter((item) => typeof item === 'string' && item.trim()).map((item) => item.trim())
    : [];
}

function safeText(value) {
  return typeof value === 'string' ? value.trim() : '';
}
