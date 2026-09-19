const LIMIT = 3;

const FIELD_NEXT_STEPS = {
  birthDate: 'дата рождения',
  birthTime: 'время рождения',
  'birthPlace.coordinates': 'координаты места рождения',
  'birthPlace.timezone': 'часовой пояс места рождения',
};

const GENERAL_MOMENT_RECOMMENDATIONS = [
  'использовать общий момент и режим',
  'смотреть лучшие окна как ориентир',
  'подготовить данные профиля',
];

const PROFILE_REFINEMENT_STEP = 'уточнить время и место рождения, если нужно';
const GENERAL_TRANSIT_CAUTION = 'личные транзиты пока не учитываются';
const UNAVAILABLE_CALCULATIONS_CAUTION =
  'дома и ASC/MC недоступны без точного времени и координат рождения';
const UNKNOWN_TIME_CAUTION = 'Время рождения неизвестно — дома и ASC/MC недоступны.';

export function getPersonalRecommendations(context = {}) {
  if (!context.hasActiveProfile) {
    return {
      goodNow: [],
      nextSteps: [],
      cautions: [],
    };
  }

  return {
    goodNow: cleanItems(GENERAL_MOMENT_RECOMMENDATIONS).slice(0, LIMIT),
    nextSteps: getNextSteps(context).slice(0, LIMIT),
    cautions: getCautions(context).slice(0, LIMIT),
  };
}

function getNextSteps(context) {
  const missingFieldSteps = Array.isArray(context.missingFields)
    ? context.missingFields.map((field) => FIELD_NEXT_STEPS[field]).filter(Boolean)
    : [];

  return cleanItems([
    ...missingFieldSteps,
    missingFieldSteps.length === 0 && hasUnavailablePersonalCalculations(context)
      ? PROFILE_REFINEMENT_STEP
      : '',
  ]);
}

function getCautions(context) {
  const warnings = Array.isArray(context.warnings) ? context.warnings : [];

  return cleanItems([
    warnings.includes(UNKNOWN_TIME_CAUTION) ? UNKNOWN_TIME_CAUTION : '',
    hasUnavailablePersonalCalculations(context) && !warnings.includes(UNKNOWN_TIME_CAUTION)
      ? UNAVAILABLE_CALCULATIONS_CAUTION
      : '',
    GENERAL_TRANSIT_CAUTION,
  ]).slice(0, 2);
}

// Only natal planets / houses / ASC/MC count here; transits are always pending
// and get their own fixed caution above.
function hasUnavailablePersonalCalculations(context) {
  return (
    context.capabilities?.canCalculateNatalPlanets === false
    || context.capabilities?.canCalculateHouses === false
    || context.capabilities?.canCalculateAscMc === false
  );
}

function cleanItems(items = []) {
  return [...new Set(items)]
    .filter((item) => typeof item === 'string')
    .map((item) => item.trim())
    .filter((item) => item && !item.includes('undefined') && !item.includes('null'));
}
