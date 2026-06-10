import { createBirthDateTimeInput } from './birthDateTime.js';
import {
  FIXED_STAR_RELATIONSHIP_POLICY,
  FIXED_STARS_ORB_POLICY,
  FIXED_STARS_SOURCE,
  FIXED_STARS_TARGET_POLICY,
  getFixedStarsCatalogPolicy,
} from './fixedStarsData.js';
import {
  calculateFixedStarConjunctions,
  getFixedStarConjunctionLimitations,
} from './fixedStarConjunctions.js';
import { calculateFixedStarPositions } from './fixedStarPositions.js';
import { resolveFixedStarTargetsForProfile } from './fixedStarTargets.js';
import { formatFixedStarConjunctionResult } from './fixedStarsDisplay.js';

const TITLE = 'Неподвижные звезды';
const DEBUG_TITLE = 'Fixed Stars Debug';

export function buildFixedStarsDebugSnapshot(input = {}) {
  const catalogPolicy = getFixedStarsCatalogPolicy();
  const positionsResult = input.positionsResult;
  const targetsResult = input.targetsResult;
  const conjunctionResult = input.conjunctionResult;
  const displayResult = input.displayResult;

  return freezeObject({
    status: 'ready',
    title: TITLE,
    debugTitle: DEBUG_TITLE,
    catalog: freezeObject({
      sourceKey: catalogPolicy.sourceKey ?? FIXED_STARS_SOURCE.sourceKey,
      activeRowCount: numberOrZero(catalogPolicy.activeRowCount),
      candidateRowCount: numberOrZero(catalogPolicy.candidateRowCount),
      initialReferenceEpoch: catalogPolicy.initialReferenceEpoch ?? FIXED_STARS_SOURCE.initialReferenceEpoch,
      sourceColumns: freezeArray((FIXED_STARS_SOURCE.coordinateColumns ?? []).map(String)),
    }),
    policy: freezeObject({
      relationship: FIXED_STARS_ORB_POLICY.relationship,
      orbPolicyKey: FIXED_STARS_ORB_POLICY.key,
      orbDegrees: FIXED_STARS_ORB_POLICY.globalOrbDegrees,
      activeTargetSets: freezeArray(FIXED_STARS_TARGET_POLICY.activeTargetSet ?? []),
      deferredTargetSets: freezeArray(FIXED_STARS_TARGET_POLICY.deferredTargetSets ?? []),
      activeRelationships: freezeArray(FIXED_STAR_RELATIONSHIP_POLICY.activeRelationships ?? []),
      deferredRelationships: freezeArray(FIXED_STAR_RELATIONSHIP_POLICY.deferredRelationships ?? []),
    }),
    pipeline: freezeObject({
      positionsStatus: safeStatus(positionsResult),
      positionsCount: countPositions(positionsResult),
      targetsStatus: safeStatus(targetsResult),
      targetCount: countTargets(targetsResult),
      conjunctionStatus: safeStatus(conjunctionResult),
      hitCount: countHits(conjunctionResult),
      displayStatus: safeStatus(displayResult),
      displayItemCount: countDisplayItems(displayResult),
    }),
    guardrails: freezeObject({
      noInterpretations: true,
      noDeferredTargetsActive: true,
      noNonConjunctionRelationships: true,
      noRawProfileData: true,
    }),
    limitations: freezeArray(getFixedStarsDebugLimitations()),
  });
}

export function buildFixedStarsDebugSnapshotForProfile(profile = null, options = {}) {
  if (!profile || typeof profile !== 'object') {
    return buildFixedStarsDebugSnapshot(options);
  }

  const birthDateTimeInput = createBirthDateTimeInput(profile);
  const positionsResult = options.positionsResult ?? (
    birthDateTimeInput?.canConvertToUtc && birthDateTimeInput.utcDateTime
      ? calculateFixedStarPositions({ utcDateTime: birthDateTimeInput.utcDateTime })
      : null
  );
  const targetsResult = options.targetsResult ?? resolveFixedStarTargetsForProfile(profile);
  const conjunctionResult = options.conjunctionResult ?? calculateFixedStarConjunctions({
    positionsResult,
    targetsResult,
  });
  const displayResult = options.displayResult ?? formatFixedStarConjunctionResult(conjunctionResult);

  return buildFixedStarsDebugSnapshot({
    positionsResult,
    targetsResult,
    conjunctionResult,
    displayResult,
  });
}

export function formatFixedStarsDebugSnapshot(snapshot = null) {
  const safeSnapshot = snapshot?.status === 'ready'
    ? snapshot
    : buildFixedStarsDebugSnapshot();
  const catalog = safeSnapshot.catalog ?? {};
  const policy = safeSnapshot.policy ?? {};
  const pipeline = safeSnapshot.pipeline ?? {};
  const guardrails = safeSnapshot.guardrails ?? {};

  return freezeObject({
    title: safeSnapshot.debugTitle ?? DEBUG_TITLE,
    rows: freezeArray([
      ['Source', catalog.sourceKey ?? 'unknown'],
      ['Active rows', String(numberOrZero(catalog.activeRowCount))],
      ['Candidate rows', String(numberOrZero(catalog.candidateRowCount))],
      ['Initial reference epoch', String(catalog.initialReferenceEpoch ?? 'unknown')],
      ['Source columns', formatList(catalog.sourceColumns)],
      ['Relationship', policy.relationship ?? 'unknown'],
      ['Orb', formatOrb(policy.orbDegrees)],
      ['Orb policy', policy.orbPolicyKey ?? 'unknown'],
      ['Active targets', formatList(policy.activeTargetSets)],
      ['Deferred targets', formatList(policy.deferredTargetSets)],
      ['Positions status', pipeline.positionsStatus ?? 'unknown'],
      ['Positions count', String(numberOrZero(pipeline.positionsCount))],
      ['Targets status', pipeline.targetsStatus ?? 'unknown'],
      ['Target count', String(numberOrZero(pipeline.targetCount))],
      ['Conjunction status', pipeline.conjunctionStatus ?? 'unknown'],
      ['Hits', String(numberOrZero(pipeline.hitCount))],
      ['Display status', pipeline.displayStatus ?? 'unknown'],
      ['Display items', String(numberOrZero(pipeline.displayItemCount))],
      ['No interpretations', guardrails.noInterpretations ? 'yes' : 'no'],
      ['No deferred targets active', guardrails.noDeferredTargetsActive ? 'yes' : 'no'],
      ['No non-conjunction relationships', guardrails.noNonConjunctionRelationships ? 'yes' : 'no'],
      ['No raw profile data', guardrails.noRawProfileData ? 'yes' : 'no'],
    ]),
  });
}

export function getFixedStarsDebugCapabilities() {
  return freezeObject({
    fixedStarsDebug: true,
    catalogSummary: true,
    policySummary: true,
    pipelineSummary: true,
    rawProfileData: false,
    rawProviderPayload: false,
    interpretations: false,
    uiNormalMode: false,
  });
}

export function getFixedStarsDebugLimitations() {
  return freezeArray([
    'Fixed Stars Debug показывает только безопасные статусы и счетчики.',
    'Сырые данные рождения, координаты и provider payload не выводятся.',
    'Интерпретации не добавлены.',
    'Debug доступен только в debug mode.',
    ...getFixedStarConjunctionLimitations(),
  ]);
}

function safeStatus(result) {
  return typeof result?.status === 'string' && result.status.trim()
    ? result.status
    : 'unknown';
}

function countPositions(result) {
  if (!result) return 0;
  if (Number.isFinite(result.readyCount)) return result.readyCount;
  return Array.isArray(result.positions) ? result.positions.length : 0;
}

function countTargets(result) {
  if (!result) return 0;
  if (Number.isFinite(result.readyCount)) return result.readyCount;
  return Array.isArray(result.targets) ? result.targets.length : 0;
}

function countHits(result) {
  if (!result) return 0;
  if (Number.isFinite(result.hitCount)) return result.hitCount;
  return Array.isArray(result.hits) ? result.hits.length : 0;
}

function countDisplayItems(result) {
  return Array.isArray(result?.items) ? result.items.length : 0;
}

function formatOrb(value) {
  return Number.isFinite(value) ? `${value}°00′` : 'unknown';
}

function formatList(items) {
  return Array.isArray(items) && items.length ? items.join(', ') : 'нет данных';
}

function numberOrZero(value) {
  return Number.isFinite(value) ? value : 0;
}

function freezeArray(items) {
  return Object.freeze([...items]);
}

function freezeObject(value) {
  return Object.freeze(value);
}
