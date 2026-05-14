import { createPersonalProfileInput } from './personalProfileInput.js';

export const PERSONAL_CONTEXT_STATUS = Object.freeze({
  GENERAL: 'general',
  INCOMPLETE: 'incomplete',
  READY_FOR_CONTEXT: 'readyForContext',
  CALCULATION_LIMITED: 'calculationLimited',
});

const GENERAL_SUMMARY = 'Выбран общий день. Личный блок появится после выбора профиля.';
const INCOMPLETE_SUMMARY = 'Профиль выбран, но для личного расчета не хватает данных.';
const LIMITED_SUMMARY =
  'Профиль выбран. Сейчас доступны общие рекомендации момента; личные дома и транзиты будут добавлены после подключения натального расчетного движка.';
const BASIC_READY_TEXT = 'Профиль готов для базового личного контекста.';
const CALCULATION_LIMITATION =
  'Натальные дома, ASC/MC и персональные транзиты пока не рассчитываются.';
const ENGINE_NEXT_STEP = 'Для точного личного расчета понадобится натальный расчетный движок.';

export function createPersonalContext(profile) {
  const input = createPersonalProfileInput(profile);

  return {
    hasActiveProfile: input.isProfileSelected,
    profileName: input.name,
    title: input.isProfileSelected ? `Лично для ${formatNameForTitle(input.name)}` : null,
    status: getPersonalContextStatus(input),
    summary: getPersonalContextSummary(input),
    readiness: getReadiness(input),
    limitations: getLimitations(input),
    nextSteps: getNextSteps(input),
    missingFields: [...input.missingFields],
    warnings: [...input.warnings],
    capabilities: input.capabilities,
  };
}

export function getPersonalContextStatus(input = {}) {
  if (!input.isProfileSelected) {
    return PERSONAL_CONTEXT_STATUS.GENERAL;
  }

  if (input.missingFields?.length || !input.isReadyForBasicPersonalContext) {
    return PERSONAL_CONTEXT_STATUS.INCOMPLETE;
  }

  if (hasUnavailablePersonalCalculations(input)) {
    return PERSONAL_CONTEXT_STATUS.CALCULATION_LIMITED;
  }

  return PERSONAL_CONTEXT_STATUS.READY_FOR_CONTEXT;
}

export function getPersonalContextSummary(input = {}) {
  const status = getPersonalContextStatus(input);

  if (status === PERSONAL_CONTEXT_STATUS.GENERAL) {
    return GENERAL_SUMMARY;
  }

  if (status === PERSONAL_CONTEXT_STATUS.INCOMPLETE) {
    return INCOMPLETE_SUMMARY;
  }

  return LIMITED_SUMMARY;
}

function getReadiness(input) {
  if (!input.isProfileSelected || !input.isReadyForBasicPersonalContext) {
    return [];
  }

  return [BASIC_READY_TEXT];
}

function getLimitations(input) {
  if (!input.isProfileSelected) {
    return [];
  }

  return unique([...input.warnings, CALCULATION_LIMITATION]);
}

function getNextSteps(input) {
  if (!input.isProfileSelected) {
    return [];
  }

  return unique([
    input.missingFields?.length ? 'Заполните недостающие данные профиля.' : '',
    ENGINE_NEXT_STEP,
  ]);
}

function hasUnavailablePersonalCalculations(input) {
  return (
    input.capabilities?.canCalculateNatalPlanets === false
    || input.capabilities?.canCalculateHouses === false
    || input.capabilities?.canCalculateAscMc === false
    || input.capabilities?.canCalculatePersonalTransits === false
  );
}

function formatNameForTitle(name) {
  const trimmed = typeof name === 'string' ? name.trim() : '';

  if (!trimmed) {
    return '';
  }

  if (/а$/i.test(trimmed)) {
    return `${trimmed.slice(0, -1)}ы`;
  }

  if (/я$/i.test(trimmed)) {
    return `${trimmed.slice(0, -1)}и`;
  }

  if (/й$/i.test(trimmed)) {
    return `${trimmed.slice(0, -1)}я`;
  }

  if (/ь$/i.test(trimmed)) {
    return `${trimmed.slice(0, -1)}я`;
  }

  if (/[бвгджзклмнпрстфхцчшщ]$/i.test(trimmed)) {
    return `${trimmed}а`;
  }

  return trimmed;
}

function unique(items) {
  return [...new Set(items.filter(Boolean))];
}
