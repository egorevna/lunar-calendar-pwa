import {
  VRONSKY_ARABIC_PARTS_SOURCE_METADATA,
  VRONSKY_SIMPLE_ARABIC_PART_KEYS,
  getActiveArabicPartsFormulas,
  getArabicPartsFormulaPolicy,
  getVronskySimpleArabicPartsFormulaRows,
} from './arabicPartsData.js';
import { calculateVronskySimpleArabicPartsForProfile } from './arabicParts.js';
import { assignVronskyArabicPartsToHousesForProfile } from './arabicPartsHouseAssignment.js';
import { formatVronskyArabicPartsWithAssignments } from './arabicPartsDisplay.js';

const TITLE = 'Точки Вронского';
const DEBUG_TITLE = 'Vronsky Arabic Points Debug';
const OLD_DEFERRED_LOT_KEYS = Object.freeze([
  'lot-of-eros',
  'lot-of-necessity',
  'lot-of-basis',
  'lot-of-exaltation',
]);

export function buildVronskyArabicPartsDebugSnapshot(input = {}) {
  const vronskyResult = input.vronskyResult;
  const assignmentResult = input.assignmentResult;
  const displayResult = input.displayResult;
  const rows = getVronskySimpleArabicPartsFormulaRows();
  const policy = getArabicPartsFormulaPolicy();

  return freezeObject({
    status: 'ready',
    title: TITLE,
    debugTitle: DEBUG_TITLE,
    source: freezeObject({
      sourceSystem: VRONSKY_ARABIC_PARTS_SOURCE_METADATA.sourceSystem,
      sourceCorpus: VRONSKY_ARABIC_PARTS_SOURCE_METADATA.sourceCorpus,
      formulaTradition: VRONSKY_ARABIC_PARTS_SOURCE_METADATA.formulaTradition,
      sourceSection: VRONSKY_ARABIC_PARTS_SOURCE_METADATA.sourceSection,
    }),
    dataset: freezeObject({
      selectedRowCount: rows.length,
      activeDefaultFormulaCount: getActiveArabicPartsFormulas().length,
      oldDeferredLotCount: OLD_DEFERRED_LOT_KEYS
        .filter((key) => policy.deferredFormulaKeys.includes(key)).length,
      selectedKeys: freezeArray(VRONSKY_SIMPLE_ARABIC_PART_KEYS),
    }),
    policy: freezeObject({
      sourceCorpusPolicy: 'vronsky-only',
      chartSectPolicy: VRONSKY_ARABIC_PARTS_SOURCE_METADATA.chartSectPolicy,
      nightFormulaStatus: VRONSKY_ARABIC_PARTS_SOURCE_METADATA.nightFormulaStatus,
      externalTraditionsUsed: false,
      interpretations: false,
    }),
    pipeline: freezeObject({
      calculationStatus: safeStatus(vronskyResult),
      readyCount: countReadyParts(vronskyResult),
      notReadyCount: countNotReadyParts(vronskyResult),
      assignmentStatus: safeStatus(assignmentResult),
      assignedCount: countAssignedParts(assignmentResult),
      displayStatus: safeStatus(displayResult),
      displayItemCount: countDisplayItems(displayResult),
    }),
    guardrails: freezeObject({
      noNightFormulaFallback: true,
      noNonVronskySources: true,
      oldDeferredLotsInactive: true,
      sensitiveRowsExcluded: true,
      noInterpretations: true,
      noRawProfileData: true,
    }),
    limitations: freezeArray(getVronskyArabicPartsDebugLimitations()),
  });
}

export function buildVronskyArabicPartsDebugSnapshotForProfile(profile = null, options = {}) {
  if (!profile || typeof profile !== 'object') {
    return buildVronskyArabicPartsDebugSnapshot(options);
  }

  const vronskyResult = options.vronskyResult
    ?? calculateVronskySimpleArabicPartsForProfile(profile, options);
  const assignmentResult = options.assignmentResult ?? (
    isReadyOrPartialVronskyResult(vronskyResult)
      ? assignVronskyArabicPartsToHousesForProfile(profile, {
        ...options,
        vronskyResult,
      })
      : null
  );
  const displayResult = options.displayResult
    ?? formatVronskyArabicPartsWithAssignments(vronskyResult, assignmentResult);

  return buildVronskyArabicPartsDebugSnapshot({
    vronskyResult,
    assignmentResult,
    displayResult,
  });
}

export function formatVronskyArabicPartsDebugSnapshot(snapshot = null) {
  const safeSnapshot = snapshot?.status === 'ready'
    ? snapshot
    : buildVronskyArabicPartsDebugSnapshot();
  const source = safeSnapshot.source ?? {};
  const dataset = safeSnapshot.dataset ?? {};
  const policy = safeSnapshot.policy ?? {};
  const pipeline = safeSnapshot.pipeline ?? {};
  const guardrails = safeSnapshot.guardrails ?? {};

  return freezeObject({
    title: safeSnapshot.debugTitle ?? DEBUG_TITLE,
    rows: freezeArray([
      ['Source', source.sourceSystem ?? 'unknown'],
      ['Source corpus', source.sourceCorpus ?? 'unknown'],
      ['Selected rows', String(numberOrZero(dataset.selectedRowCount))],
      ['Active default formulas', String(numberOrZero(dataset.activeDefaultFormulaCount))],
      ['Old deferred Lots', String(numberOrZero(dataset.oldDeferredLotCount))],
      ['Selected keys', formatList(dataset.selectedKeys)],
      ['Source corpus policy', policy.sourceCorpusPolicy ?? 'unknown'],
      ['Chart sect policy', policy.chartSectPolicy ?? 'unknown'],
      ['Night formulas', policy.nightFormulaStatus ?? 'unknown'],
      ['External traditions', policy.externalTraditionsUsed ? 'yes' : 'no'],
      ['Calculation status', pipeline.calculationStatus ?? 'unknown'],
      ['Ready rows', String(numberOrZero(pipeline.readyCount))],
      ['Not ready rows', String(numberOrZero(pipeline.notReadyCount))],
      ['Assignment status', pipeline.assignmentStatus ?? 'unknown'],
      ['Assigned rows', String(numberOrZero(pipeline.assignedCount))],
      ['Display status', pipeline.displayStatus ?? 'unknown'],
      ['Display items', String(numberOrZero(pipeline.displayItemCount))],
      ['Interpretations', policy.interpretations ? 'yes' : 'no'],
      ['No night formula fallback', guardrails.noNightFormulaFallback ? 'yes' : 'no'],
      ['No non-Vronsky sources', guardrails.noNonVronskySources ? 'yes' : 'no'],
      ['Old deferred Lots inactive', guardrails.oldDeferredLotsInactive ? 'yes' : 'no'],
      ['Sensitive rows excluded', guardrails.sensitiveRowsExcluded ? 'yes' : 'no'],
      ['No interpretations', guardrails.noInterpretations ? 'yes' : 'no'],
      ['No raw profile data', guardrails.noRawProfileData ? 'yes' : 'no'],
    ]),
  });
}

export function getVronskyArabicPartsDebugCapabilities() {
  return freezeObject({
    vronskyArabicPartsDebug: true,
    sourceSummary: true,
    datasetSummary: true,
    pipelineSummary: true,
    privacyGuardrails: true,
    rawProfileData: false,
    rawProviderPayload: false,
    fullFormulaDump: false,
    fullResultDump: false,
    interpretations: false,
    normalUi: false,
  });
}

export function getVronskyArabicPartsDebugLimitations() {
  return freezeArray([
    'Vronsky Arabic Points Debug показывает только безопасные статусы и счетчики.',
    'Сырые данные рождения, координаты и provider payload не выводятся.',
    'Формулы Вронского используются только для дневных карт.',
    'Ночные формулы по Вронскому пока не verified.',
    'Debug доступен только в debug mode.',
  ]);
}

function safeStatus(result) {
  return typeof result?.status === 'string' && result.status.trim()
    ? result.status
    : 'unknown';
}

function countReadyParts(result) {
  if (!result) return 0;
  if (Number.isFinite(result.readyCount)) return result.readyCount;
  return Array.isArray(result.parts)
    ? result.parts.filter((part) => part?.status === 'ready' && part?.ready === true).length
    : 0;
}

function countNotReadyParts(result) {
  if (!result) return 0;
  if (Number.isFinite(result.notReadyCount)) return result.notReadyCount;
  return Array.isArray(result.parts)
    ? result.parts.filter((part) => part?.status !== 'ready' || part?.ready !== true).length
    : 0;
}

function countAssignedParts(result) {
  if (!result) return 0;
  if (Number.isFinite(result.assignedCount)) return result.assignedCount;
  if (Number.isFinite(result.readyCount)) return result.readyCount;
  return Array.isArray(result.assignments)
    ? result.assignments.filter((assignment) => assignment?.status === 'ready' && assignment?.ready === true).length
    : 0;
}

function countDisplayItems(result) {
  return Array.isArray(result?.items) ? result.items.length : 0;
}

function isReadyOrPartialVronskyResult(result) {
  return result?.sourceSystem === VRONSKY_ARABIC_PARTS_SOURCE_METADATA.sourceSystem
    && result.ready === true
    && ['ready', 'partial'].includes(result.status)
    && Array.isArray(result.parts);
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
