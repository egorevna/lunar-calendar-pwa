import { getArabicPartsForProfile } from './arabicPartsForProfile.js';
import {
  getActiveArabicPartsFormulas,
  getDeferredArabicPartsFormulas,
} from './arabicPartsData.js';
import { getChartSectDisplayLabel } from './arabicPartsDisplay.js';
import { calculateDayNightChartStatusForProfile } from './dayNightChart.js';
import { evaluateHousesInputReadiness } from './housesInputGuardrails.js';

const SECTION = 'Arabic Parts UI Debug';
const LOCATION = 'My Cards';

const ARABIC_PARTS_DEBUG_CAPABILITIES = Object.freeze({
  arabicParts: true,
  parsFortuna: true,
  lotOfSpirit: true,
  houseAssignment: true,
  interpretations: false,
  fixedStars: false,
  transits: false,
  ritualScoring: false,
});

const ARABIC_PARTS_DEBUG_PRIVACY = Object.freeze({
  rawBirthDataExposed: false,
  rawCoordinatesExposed: false,
  rawTimezoneExposed: false,
  rawLongitudesExposed: false,
  formulaOperandsExposed: false,
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
  'provider',
  'NaN',
  'undefined',
]);

export function getArabicPartsDebugState(profile = null, uiState = {}) {
  const readiness = evaluateHousesInputReadiness(profile);
  const hasActiveProfile = hasDebuggableProfile(profile, readiness);
  const dayNightStatus = hasActiveProfile
    ? calculateDayNightChartStatusForProfile(profile)
    : null;
  const view = getArabicPartsForProfile(hasActiveProfile ? profile : null);
  const isReady = view?.status === 'ready' && view?.ready === true;
  const items = Array.isArray(view?.items) ? view.items : [];
  const houseAssignments = isReady
    ? items.filter((item) => Number.isInteger(item?.houseNumber)).length
    : 0;

  return Object.freeze({
    section: SECTION,
    enabled: true,
    activeProfile: Object.freeze({
      hasProfile: hasActiveProfile,
      id: hasActiveProfile ? safeText(profile.id) || null : null,
      name: hasActiveProfile ? safeText(profile.name) || null : null,
    }),
    panelStatus: isReady ? 'ready' : (view?.status ?? 'notReady'),
    reason: isReady ? null : safeText(view?.reason) || null,
    location: LOCATION,
    userFacingBlock: true,
    collapsedDefault: true,
    collapsedState: getCollapsedState(uiState),
    readiness: Object.freeze({
      hasExactBirthTime: Boolean(readiness.flags?.hasExactBirthTime),
      hasBirthCoordinates: Boolean(readiness.flags?.hasBirthCoordinates),
      hasBirthTimezone: Boolean(readiness.flags?.hasTimezone),
      dayNightReady: dayNightStatus?.status === 'ready'
        && ['day', 'night'].includes(dayNightStatus.chartSect),
      arabicPartsReady: isReady && items.length > 0,
      houseAssignmentsReady: isReady && houseAssignments > 0,
    }),
    chartSect: getSafeChartSect({ view, dayNightStatus, isReady }),
    formulas: getSafeFormulaState(),
    counts: Object.freeze({
      parts: isReady ? items.length : 0,
      houseAssignments,
    }),
    capabilities: ARABIC_PARTS_DEBUG_CAPABILITIES,
    privacy: ARABIC_PARTS_DEBUG_PRIVACY,
  });
}

function hasDebuggableProfile(profile, readiness) {
  return Boolean(profile && typeof profile === 'object' && !readiness.flags?.commonDay);
}

function getSafeChartSect({ view, dayNightStatus, isReady }) {
  if (dayNightStatus?.status === 'boundary' || dayNightStatus?.boundary === true) {
    return Object.freeze({
      status: 'boundary',
      value: 'boundary',
      label: getChartSectDisplayLabel('boundary'),
      boundary: true,
    });
  }

  const value = dayNightStatus?.status === 'ready' && ['day', 'night'].includes(dayNightStatus.chartSect)
    ? dayNightStatus.chartSect
    : isReady && ['day', 'night'].includes(view.chartSect)
      ? view.chartSect
      : null;

  return Object.freeze({
    status: value ? 'ready' : 'notReady',
    value,
    label: value ? getChartSectDisplayLabel(value) : 'Недоступно',
    boundary: value === 'boundary',
  });
}

function getSafeFormulaState() {
  const active = getActiveArabicPartsFormulas().map((row) => row.key);
  const deferred = getDeferredArabicPartsFormulas().map((row) => row.key);

  return Object.freeze({
    active: Object.freeze(active),
    deferred: Object.freeze(deferred),
    activeCount: active.length,
    deferredCount: deferred.length,
  });
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
