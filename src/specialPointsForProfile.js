import { calculateLunarNodesForProfile } from './lunarNodes.js';
import { assignLunarNodesToHousesForProfile } from './lunarNodesHouseAssignment.js';
import { calculateLilithForProfile } from './lilith.js';
import { calculateSelenaForProfile } from './selena.js';
import { formatSpecialPointsResult, getSpecialPointsDisplayLimitations } from './specialPointsDisplay.js';

const FALLBACK_MESSAGE = 'Для расчета нужны точное время рождения и timezone.';
const FALLBACK_RESULT = Object.freeze({
  status: 'notReady',
  ready: false,
  title: 'Особые точки карты',
  summary: 'Пока недоступно.',
  message: FALLBACK_MESSAGE,
  sections: Object.freeze([]),
  items: Object.freeze([]),
  limitations: getSpecialPointsDisplayLimitations(),
});

export function getSpecialPointsForProfile(profile = null, options = {}) {
  if (!profile || typeof profile !== 'object') {
    return fallbackResult();
  }

  const lunarNodesResult = calculateLunarNodesForProfile(profile, options);
  const lunarNodesAssignmentResult = lunarNodesResult?.status === 'ready' && lunarNodesResult.ready === true
    ? assignLunarNodesToHousesForProfile(profile, {
      ...options,
      nodesResult: lunarNodesResult,
    })
    : null;
  const lilithResult = calculateLilithForProfile(profile, options);
  const selenaResult = calculateSelenaForProfile(profile, options);
  const display = formatSpecialPointsResult({
    lunarNodesResult,
    lunarNodesAssignmentResult,
    lilithResult,
    selenaResult,
  });

  if (!display || display.status !== 'ready' || display.ready !== true) {
    return fallbackResult();
  }

  return display;
}

function fallbackResult() {
  return {
    ...FALLBACK_RESULT,
    sections: [],
    items: [],
    limitations: [...FALLBACK_RESULT.limitations],
  };
}
