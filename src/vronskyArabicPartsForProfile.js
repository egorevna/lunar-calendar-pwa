import { calculateVronskySimpleArabicPartsForProfile } from './arabicParts.js';
import { assignVronskyArabicPartsToHousesForProfile } from './arabicPartsHouseAssignment.js';
import { formatVronskyArabicPartsWithAssignments } from './arabicPartsDisplay.js';

const FALLBACK_MESSAGE = 'Для расчета точек Вронского нужна готовая дневная/ночная карта.';

export function getVronskyArabicPartsForProfile(profile = null, options = {}) {
  const vronskyResult = isPlainObject(options.vronskyResult)
    ? options.vronskyResult
    : calculateVronskySimpleArabicPartsForProfile(profile, options);
  const assignmentResult = isReadyOrPartialVronskyResult(vronskyResult)
    ? assignVronskyArabicPartsToHousesForProfile(profile, {
      ...options,
      vronskyResult,
    })
    : null;

  return formatVronskyArabicPartsWithAssignments(
    normalizeFallbackMessage(vronskyResult),
    assignmentResult,
  ) ?? formatVronskyArabicPartsWithAssignments({
    status: 'notReady',
    ready: false,
    message: FALLBACK_MESSAGE,
    parts: [],
  }, null);
}

function normalizeFallbackMessage(result) {
  if (isReadyOrPartialVronskyResult(result)) {
    return result;
  }

  return {
    ...(isPlainObject(result) ? result : {}),
    status: 'notReady',
    ready: false,
    message: result?.message ?? FALLBACK_MESSAGE,
    parts: [],
  };
}

function isReadyOrPartialVronskyResult(result) {
  return isPlainObject(result)
    && result.sourceSystem === 'vronsky-table-17-arabic-points'
    && result.ready === true
    && ['ready', 'partial'].includes(result.status)
    && Array.isArray(result.parts);
}

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}
