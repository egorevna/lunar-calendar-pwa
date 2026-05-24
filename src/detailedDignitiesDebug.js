import { getDetailedDignitiesForProfile } from './detailedDignitiesForProfile.js';
import { getActiveProfileId, loadProfiles } from './profileStorage.js';

const GENERAL_DAY_LABEL = 'Общий день';
const READY_REASON = 'Термы, деканы и градусы доступны в панели «Мои карты».';
const GENERAL_DAY_REASON = 'Общий день не является персональным профилем.';
const INCOMPLETE_REASON = 'Термы, деканы и градусы недоступны: сначала нужен расчет натальных планет.';
const ERROR_REASON = 'Термы, деканы и градусы временно недоступны.';

const SOURCE_LABELS = Object.freeze({
  terms: 'Вронский, термы',
  decans: 'Звезда Магов',
  degreeRulersTable6: 'Звезда Магов',
  degreeRulersTable7: 'Вронский',
});

const CAPABILITIES = Object.freeze({
  terms: true,
  decans: true,
  degreeRulersTable6: true,
  degreeRulersTable7: true,
  table6Table7Separated: true,
  interpretations: false,
  fixedStars: false,
  houses: false,
  ascMc: false,
  transits: false,
});

const PRIVACY_FLAGS = Object.freeze({
  rawBirthDataExposed: false,
  rawCoordinatesExposed: false,
  rawLongitudesExposed: false,
  rawSourceTokensExposed: false,
  rawSourceKeysExposed: false,
  fullTablesExposed: false,
});

export function createDetailedDignitiesDebugSummaryFromStorage() {
  const activeProfileId = getActiveProfileId();
  const activeProfile = loadProfiles().find((profile) => profile.id === activeProfileId) ?? null;

  return getDetailedDignitiesDebugState(activeProfile);
}

export function getDetailedDignitiesDebugState(profile = null, uiState = {}) {
  if (!profile) {
    return debugState({
      activeProfile: {
        hasProfile: false,
        id: null,
        name: GENERAL_DAY_LABEL,
      },
      panelStatus: 'hidden',
      reason: GENERAL_DAY_REASON,
      collapsedState: resolveCollapsedState(uiState),
    });
  }

  const detailedDignities = getDetailedDignitiesForProfile(profile);
  const isReady = detailedDignities.status === 'ready';

  return debugState({
    enabled: isReady,
    activeProfile: {
      hasProfile: true,
      id: cleanText(profile.id) || null,
      name: cleanText(profile.name) || 'Профиль',
    },
    panelStatus: normalizePanelStatus(detailedDignities.status),
    reason: getReason(detailedDignities.status),
    natalPlanetsReady: isReady,
    userFacingBlock: isReady,
    collapsedState: resolveCollapsedState(uiState),
    counts: isReady ? countDetailedDignityGroups(detailedDignities.groups) : undefined,
  });
}

function debugState(overrides = {}) {
  const activeProfile = overrides.activeProfile ?? {
    hasProfile: false,
    id: null,
    name: GENERAL_DAY_LABEL,
  };

  return {
    section: 'Detailed Dignities UI Debug',
    enabled: overrides.enabled ?? false,
    activeProfile,
    panelStatus: overrides.panelStatus ?? 'hidden',
    reason: overrides.reason ?? GENERAL_DAY_REASON,
    natalPlanetsReady: overrides.natalPlanetsReady ?? false,
    userFacingBlock: overrides.userFacingBlock ?? false,
    location: 'My Cards',
    collapsedDefault: true,
    collapsedState: overrides.collapsedState ?? true,
    counts: overrides.counts ?? emptyCounts(),
    sources: { ...SOURCE_LABELS },
    capabilities: { ...CAPABILITIES },
    privacy: { ...PRIVACY_FLAGS },
  };
}

function countDetailedDignityGroups(groups = []) {
  const safeGroups = Array.isArray(groups) ? groups : [];
  const items = safeGroups.flatMap((group) => (Array.isArray(group.items) ? group.items : []));

  return {
    planetGroups: safeGroups.length,
    totalItems: items.length,
    terms: items.filter((item) => item.type === 'term').length,
    decans: items.filter((item) => item.type === 'decan').length,
    degreeRulersTable6: items.filter((item) => item.type === 'degreeRuler').length,
    degreeRulersTable7: items.filter((item) => item.type === 'vronskyDegreeRulers').length,
  };
}

function emptyCounts() {
  return {
    planetGroups: 0,
    totalItems: 0,
    terms: 0,
    decans: 0,
    degreeRulersTable6: 0,
    degreeRulersTable7: 0,
  };
}

function normalizePanelStatus(status) {
  if (status === 'ready') return 'ready';
  if (status === 'error') return 'error';
  if (status === 'notAvailable') return 'incomplete';
  return 'incomplete';
}

function getReason(status) {
  if (status === 'ready') return READY_REASON;
  if (status === 'error') return ERROR_REASON;
  return INCOMPLETE_REASON;
}

function resolveCollapsedState(uiState = {}) {
  if (typeof uiState.collapsedState === 'boolean') return uiState.collapsedState;
  if (typeof uiState.detailedDignitiesCollapsed === 'boolean') {
    return uiState.detailedDignitiesCollapsed;
  }
  if (typeof uiState.expanded === 'boolean') return !uiState.expanded;
  return true;
}

function cleanText(value) {
  return typeof value === 'string' ? value.trim() : '';
}
