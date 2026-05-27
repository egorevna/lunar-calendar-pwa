import { calculateArabicPartsForProfile } from './arabicParts.js';
import { assignArabicPartsToHousesForProfile } from './arabicPartsHouseAssignment.js';
import { formatArabicPartsWithAssignments } from './arabicPartsDisplay.js';

const FALLBACK_MESSAGE = 'Для расчета нужны ASC, Солнце, Луна и дневная/ночная карта.';

export function getArabicPartsForProfile(profile = null, options = {}) {
  const partsResult = calculateArabicPartsForProfile(profile, options);
  const assignmentResult = partsResult?.status === 'ready' && partsResult.ready === true
    ? assignArabicPartsToHousesForProfile(profile, {
      ...options,
      partsResult,
    })
    : null;

  const display = formatArabicPartsWithAssignments({
    partsResult: normalizeFallbackMessage(partsResult),
    assignmentResult,
  });

  return display ?? formatArabicPartsWithAssignments({
    partsResult: {
      status: 'notReady',
      ready: false,
      message: FALLBACK_MESSAGE,
      parts: [],
    },
    assignmentResult: null,
  });
}

function normalizeFallbackMessage(result) {
  if (result?.status === 'ready' && result.ready === true) {
    return result;
  }

  return {
    ...(result && typeof result === 'object' ? result : {}),
    status: result?.status === 'unsupported' ? 'unsupported' : 'notReady',
    ready: false,
    message: FALLBACK_MESSAGE,
    parts: [],
  };
}
