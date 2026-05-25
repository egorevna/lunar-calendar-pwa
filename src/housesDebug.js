import { getHousesForProfile } from './housesForProfile.js';
import { evaluateHousesInputReadiness } from './housesInputGuardrails.js';
import { resolveHouseSystemSelection } from './houseSystemResolver.js';

const SECTION = 'Houses / ASC / MC UI Debug';
const LOCATION = 'My Cards';

const HOUSE_DEBUG_CAPABILITIES = Object.freeze({
  asc: true,
  mc: true,
  dsc: true,
  ic: true,
  houses: true,
  wholeSign: true,
  equalHouse: true,
  placidus: true,
  planetInHouse: true,
  interpretations: false,
  fixedStars: false,
  parsFortuna: false,
  arabicParts: false,
  transits: false,
  ritualScoring: false,
});

const HOUSE_DEBUG_PRIVACY = Object.freeze({
  rawBirthDataExposed: false,
  rawCoordinatesExposed: false,
  rawTimezoneExposed: false,
  rawPlanetLongitudesExposed: false,
  rawCuspLongitudesExposed: false,
  fullProfileJsonExposed: false,
  providerPayloadExposed: false,
});

const SENSITIVE_TEXT_FRAGMENTS = Object.freeze([
  'birthDate',
  'birthTime',
  'utcDateTime',
  'timezone',
  'birthPlace',
  'currentPlace',
  'latitude',
  'longitude',
  'coordinates',
  'planetLongitude',
  'provider',
  'NaN',
  'undefined',
]);

export function getHousesDebugState(profile = null, uiState = {}) {
  const readiness = evaluateHousesInputReadiness(profile);
  const hasActiveProfile = hasDebuggableProfile(profile, readiness);
  const selection = hasActiveProfile ? resolveHouseSystemSelection(profile) : null;
  const housesView = getHousesForProfile(hasActiveProfile ? profile : null);
  const housesReady = housesView.status === 'ready' && housesView.ready === true;
  const anglesCount = Array.isArray(housesView.angles) ? housesView.angles.length : 0;
  const housesCount = Array.isArray(housesView.houses) ? housesView.houses.length : 0;
  const planetAssignmentsCount = Array.isArray(housesView.planetAssignments)
    ? housesView.planetAssignments.length
    : 0;

  return freezePlainObject({
    section: SECTION,
    enabled: true,
    activeProfile: Object.freeze({
      hasProfile: hasActiveProfile,
      id: hasActiveProfile ? safeText(profile.id) || null : null,
      name: hasActiveProfile ? safeText(profile.name) || null : null,
    }),
    panelStatus: housesView.status ?? 'notReady',
    reason: getSafeReason({ selection, readiness, housesView }),
    location: LOCATION,
    userFacingBlock: true,
    collapsedDefault: true,
    collapsedState: getCollapsedState(uiState),
    readiness: Object.freeze({
      hasExactBirthTime: Boolean(readiness.flags?.hasExactBirthTime),
      hasBirthCoordinates: Boolean(readiness.flags?.hasBirthCoordinates),
      hasBirthTimezone: Boolean(readiness.flags?.hasTimezone),
      housesReady,
      anglesReady: housesReady && anglesCount === 4,
      planetAssignmentsReady: housesReady && planetAssignmentsCount > 0,
    }),
    selectedSystem: getSafeSelectedSystem(selection, hasActiveProfile),
    counts: Object.freeze({
      angles: housesReady ? anglesCount : 0,
      houses: housesReady ? housesCount : 0,
      planetAssignments: housesReady ? planetAssignmentsCount : 0,
    }),
    capabilities: HOUSE_DEBUG_CAPABILITIES,
    privacy: HOUSE_DEBUG_PRIVACY,
  });
}

function hasDebuggableProfile(profile, readiness) {
  return Boolean(profile && typeof profile === 'object' && !readiness.flags?.commonDay);
}

function getSafeSelectedSystem(selection, hasActiveProfile) {
  if (!hasActiveProfile || !selection) {
    return Object.freeze({
      houseSystem: null,
      label: null,
      selectionSource: null,
      defaulted: false,
    });
  }

  return Object.freeze({
    houseSystem: selection.selectedHouseSystem ?? null,
    label: safeText(selection.houseSystemLabel) || null,
    selectionSource: safeText(selection.selectionSource) || null,
    defaulted: Boolean(selection.defaulted),
  });
}

function getSafeReason({ selection, readiness, housesView }) {
  const reason = selection?.reason ?? readiness.reason ?? housesView.reason ?? null;
  return safeText(reason) || null;
}

function getCollapsedState(uiState) {
  if (typeof uiState.collapsedState === 'boolean') {
    return uiState.collapsedState;
  }

  if (typeof uiState.expanded === 'boolean') {
    return !uiState.expanded;
  }

  return true;
}

function safeText(value) {
  if (typeof value !== 'string') {
    return '';
  }

  const text = value.trim();
  if (!text || SENSITIVE_TEXT_FRAGMENTS.some((fragment) => text.includes(fragment))) {
    return '';
  }

  return text;
}

function freezePlainObject(value) {
  return Object.freeze(value);
}
