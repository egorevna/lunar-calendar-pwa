import { getNatalAspectsForProfile } from './natalAspectsForProfile.js';
import { getActiveProfileId, loadProfiles } from './profileStorage.js';

const GENERAL_DAY_LABEL = 'Общий день';
const READY_REASON = 'Натальные аспекты доступны в панели «Мои карты».';
const GENERAL_DAY_REASON = 'Общий день не является персональным профилем.';
const INCOMPLETE_REASON = 'Натальные аспекты недоступны: сначала нужен расчет натальных планет.';

const MISSING_FIELD_LABELS = {
  birthDate: 'дата рождения',
  birthTime: 'время рождения',
  'birthPlace.timezone': 'часовой пояс рождения',
  'birthPlace.coordinates': 'координаты места рождения',
};

const STILL_NOT_SUPPORTED = Object.freeze({
  transits: 'notSupported',
  houses: 'notSupported',
  ascMc: 'notSupported',
  fixedStars: 'notSupported',
  interpretations: 'notSupported',
});

export function createNatalAspectsDebugSummary(profile = null) {
  if (!profile) {
    return debugSummary({
      hasActiveProfile: false,
      activeProfileId: null,
      activeProfileName: GENERAL_DAY_LABEL,
      panelStatus: 'hidden',
      userFacingNatalAspects: 'disabled',
      reason: GENERAL_DAY_REASON,
      natalPlanetsReady: false,
    });
  }

  const natalAspects = getNatalAspectsForProfile(profile);
  const isReady = natalAspects.status === 'ready';
  const summary = natalAspects.summary ?? {};

  return debugSummary({
    hasActiveProfile: true,
    activeProfileId: safeText(profile.id) || null,
    activeProfileName: safeText(profile.name) || 'Профиль',
    panelStatus: natalAspects.status ?? 'incomplete',
    userFacingNatalAspects: isReady ? 'enabled' : 'disabled',
    reason: isReady ? READY_REASON : INCOMPLETE_REASON,
    natalPlanetsReady: isReady,
    aspectCount: isReady ? summary.total : 0,
    formattedAspectCount: isReady ? natalAspects.formattedAspects.length : 0,
    tenseCount: isReady ? summary.tense : 0,
    harmoniousCount: isReady ? summary.harmonious : 0,
    conjunctionCount: isReady ? summary.conjunctions : 0,
    missingFields: mapMissingFields(natalAspects.missingFields),
    warnings: safeStringList(natalAspects.warnings),
  });
}

export function createNatalAspectsDebugSummaryFromStorage() {
  const activeProfileId = getActiveProfileId();
  const activeProfile = loadProfiles().find((profile) => profile.id === activeProfileId) ?? null;

  return createNatalAspectsDebugSummary(activeProfile);
}

function debugSummary(overrides = {}) {
  return {
    hasActiveProfile: overrides.hasActiveProfile ?? false,
    activeProfileId: overrides.activeProfileId ?? null,
    activeProfileName: overrides.activeProfileName ?? GENERAL_DAY_LABEL,
    panelStatus: overrides.panelStatus ?? 'hidden',
    userFacingNatalAspects: overrides.userFacingNatalAspects ?? 'disabled',
    reason: overrides.reason ?? GENERAL_DAY_REASON,
    natalPlanetsReady: overrides.natalPlanetsReady ?? false,
    aspectEngine: 'enabled',
    aspectSet: 'major only',
    orbPolicy: 'configured',
    aspectCount: overrides.aspectCount ?? 0,
    formattedAspectCount: overrides.formattedAspectCount ?? 0,
    tenseCount: overrides.tenseCount ?? 0,
    harmoniousCount: overrides.harmoniousCount ?? 0,
    conjunctionCount: overrides.conjunctionCount ?? 0,
    collapsibleDefault: 'collapsed',
    profilePanelLocation: 'My Cards',
    missingFields: overrides.missingFields ?? [],
    warnings: overrides.warnings ?? [],
    stillNotSupported: { ...STILL_NOT_SUPPORTED },
  };
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
