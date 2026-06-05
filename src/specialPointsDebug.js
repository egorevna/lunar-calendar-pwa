import { createBirthDateTimeInput } from './birthDateTime.js';
import {
  calculateLunarNodesForProfile,
  getLunarNodesCapabilities,
  getLunarNodesSource,
} from './lunarNodes.js';
import { assignLunarNodesToHousesForProfile } from './lunarNodesHouseAssignment.js';
import {
  calculateLilithForProfile,
  getLilithCapabilities,
  getLilithSource,
} from './lilith.js';
import {
  calculateSelenaForProfile,
  getSelenaCapabilities,
  getSelenaSource,
} from './selena.js';
import { getSpecialPointsForProfile } from './specialPointsForProfile.js';

const SECTION = 'Special Points UI Debug';
const LOCATION = 'My Cards';

export function getSpecialPointsDebugState(profile = null, uiState = {}) {
  const hasProfile = Boolean(profile && typeof profile === 'object');
  const birthInput = hasProfile ? createBirthDateTimeInput(profile) : null;
  const lunarNodesResult = hasProfile ? calculateLunarNodesForProfile(profile, { birthDateTimeInput: birthInput }) : null;
  const assignmentResult = lunarNodesResult?.ready === true
    ? assignLunarNodesToHousesForProfile(profile, {
      birthDateTimeInput: birthInput,
      nodesResult: lunarNodesResult,
    })
    : null;
  const lilithResult = hasProfile ? calculateLilithForProfile(profile, { birthDateTimeInput: birthInput }) : null;
  const selenaResult = hasProfile ? calculateSelenaForProfile(profile, { birthDateTimeInput: birthInput }) : null;
  const specialPointsResult = hasProfile ? getSpecialPointsForProfile(profile, { birthDateTimeInput: birthInput }) : null;
  const specialPointsReady = isReady(specialPointsResult);
  const nodeAssignmentsCount = isReady(assignmentResult) ? Number(assignmentResult.readyCount ?? 0) : 0;

  return freezeObject({
    section: SECTION,
    enabled: true,
    activeProfile: freezeObject({
      hasProfile,
      id: hasProfile ? safeString(profile.id) : null,
      name: hasProfile ? safeString(profile.name) : null,
    }),
    panelStatus: specialPointsReady ? 'ready' : 'notReady',
    reason: specialPointsReady ? null : resolveReason({
      lunarNodesResult,
      lilithResult,
      selenaResult,
      specialPointsResult,
      hasProfile,
    }),
    location: LOCATION,
    userFacingBlock: true,
    collapsedDefault: true,
    collapsedState: uiState.collapsedState == null ? true : Boolean(uiState.collapsedState),
    readiness: freezeObject({
      hasExactBirthTime: hasExactBirthTime(birthInput),
      hasBirthTimezone: hasBirthTimezone(birthInput),
      lunarNodesReady: isReady(lunarNodesResult),
      lunarNodesHouseAssignmentReady: isReady(assignmentResult),
      lilithReady: isReady(lilithResult),
      selenaReady: isReady(selenaResult),
      specialPointsReady,
    }),
    sources: freezeObject({
      lunarNodes: buildLunarNodesSource(),
      lilith: buildLilithSource(),
      selena: buildSelenaSource(),
    }),
    counts: freezeObject({
      points: specialPointsReady && Array.isArray(specialPointsResult.items)
        ? specialPointsResult.items.length
        : 0,
      nodeAssignments: nodeAssignmentsCount,
      sectionsReady: specialPointsReady && Array.isArray(specialPointsResult.sections)
        ? specialPointsResult.sections.filter((section) => section?.ready === true).length
        : 0,
    }),
    capabilities: buildCapabilities(),
    privacy: freezeObject({
      rawBirthDataExposed: false,
      rawCoordinatesExposed: false,
      rawTimezoneExposed: false,
      rawUtcExposed: false,
      rawLongitudesExposed: false,
      fullProfileJsonExposed: false,
      providerPayloadExposed: false,
    }),
  });
}

function buildLunarNodesSource() {
  const source = getLunarNodesSource();

  return freezeObject({
    active: true,
    sourceSystem: source.sourceSystem ?? 'mean-lunar-node',
    trueNodeStatus: source.trueNodeStatus ?? 'deferred',
  });
}

function buildLilithSource() {
  const source = getLilithSource();

  return freezeObject({
    active: true,
    sourceSystem: source.sourceSystem ?? 'mean-black-moon-lilith',
    deferredVariants: freezeArray(source.deferredVariants ?? []),
  });
}

function buildSelenaSource() {
  const source = getSelenaSource();

  return freezeObject({
    active: true,
    sourceSystem: source.sourceSystem ?? 'selena-white-moon',
    pointType: source.pointType ?? 'fictitious-calculated-point',
    alternateSourceSystems: freezeArray(source.alternateSourceSystems ?? []),
  });
}

function buildCapabilities() {
  const lunarNodes = getLunarNodesCapabilities();
  const lilith = getLilithCapabilities();
  const selena = getSelenaCapabilities();

  return freezeObject({
    specialPoints: true,
    lunarNodes: Boolean(lunarNodes.lunarNodes),
    meanNode: Boolean(lunarNodes.meanNode),
    trueNode: Boolean(lunarNodes.trueNode),
    lilith: Boolean(lilith.lilith),
    meanLilith: Boolean(lilith.meanLilith),
    trueLilith: Boolean(lilith.trueLilith),
    osculatingLilith: Boolean(lilith.osculatingLilith),
    selena: Boolean(selena.selena),
    fixedStars: false,
    transits: false,
    interpretations: false,
    ritualScoring: false,
  });
}

function hasExactBirthTime(birthInput) {
  return Boolean(birthInput?.hasKnownTime && birthInput.birthTimeAccuracy === 'exact');
}

function hasBirthTimezone(birthInput) {
  return Boolean(birthInput?.timezone && !birthInput.missingFields?.includes('birthPlace.timezone'));
}

function isReady(result) {
  return Boolean(result && result.status === 'ready' && result.ready === true);
}

function resolveReason(results) {
  if (!results.hasProfile) {
    return 'missingProfile';
  }

  return results.specialPointsResult?.reason
    ?? results.lunarNodesResult?.reason
    ?? results.lilithResult?.reason
    ?? results.selenaResult?.reason
    ?? 'specialPointsNotReady';
}

function safeString(value) {
  return typeof value === 'string' && value.trim() ? value : null;
}

function freezeArray(items) {
  return Object.freeze([...items]);
}

function freezeObject(value) {
  return Object.freeze(value);
}
