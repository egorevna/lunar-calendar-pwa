import { getNatalPlanetsForProfile } from './natalPlanetsForProfile.js';
import { getNatalAspectsForProfile } from './natalAspectsForProfile.js';
import { getEssentialDignitiesForProfile } from './essentialDignitiesForProfile.js';
import { getPersonalRecommendations } from './personalRecommendations.js';

export const GENERAL_PROFILE_LABEL = 'Общий день';
export const PROFILE_PRIVACY_COPY = 'Данные хранятся на этом устройстве и не отправляются на сервер.';
export const PROFILE_EMPTY_TITLE = 'Пока нет сохраненных карт.';
export const PROFILE_EMPTY_HINT = 'Начните с добавления профиля.';
export const PROFILE_ADD_BUTTON_LABEL = '+ Добавить профиль';
export const PROFILE_ADD_BUTTON_HELP = 'Профили нужны для будущих личных расчетов.';
const PERSONAL_READY_SUMMARY =
  'Профиль выбран. Пока рекомендации основаны на общем моменте и выбранном режиме.';
const PERSONAL_INCOMPLETE_SUMMARY =
  'Профиль выбран, но для глубокого личного расчета не хватает данных.';
const NATAL_PLANETS_READINESS_TITLE = 'Натальные планеты';
const NATAL_PLANETS_READINESS_STATUS = 'Пока недоступны для показа.';
const NATAL_PLANETS_READINESS_EXPLANATION = 'Для точного расчета нужны полные данные рождения.';
const NATAL_PLANETS_LIMITATION = 'Дома, ASC/MC и транзиты пока не рассчитываются.';
const NATAL_ASPECTS_TITLE = 'Натальные аспекты';
const NATAL_ASPECTS_STATUS = 'Пока недоступны.';
const NATAL_ASPECTS_EXPLANATION = 'Сначала нужен расчет натальных планет.';
const NATAL_ASPECTS_READY_LIMITATION = 'Это натальные аспекты между планетами, не транзиты.';
const ESSENTIAL_DIGNITIES_TITLE = 'Достоинства планет';
const ESSENTIAL_DIGNITIES_STATUS = 'Пока недоступны.';
const ESSENTIAL_DIGNITIES_EXPLANATION = 'Сначала нужен расчет натальных планет.';
const ESSENTIAL_DIGNITIES_READY_LIMITATION =
  'Это базовые достоинства по знаку, без термов, деканов и управителей градусов.';

const MISSING_FIELD_LABELS = {
  birthDate: 'дата рождения',
  birthTime: 'время рождения',
  'birthPlace.coordinates': 'координаты места рождения',
  'birthPlace.timezone': 'часовой пояс места рождения',
};

const NATAL_MISSING_FIELD_LABELS = {
  birthDate: 'дата рождения',
  birthTime: 'время рождения',
  'birthPlace.timezone': 'часовой пояс рождения',
  'birthPlace.coordinates': 'координаты места рождения',
};

const ERROR_MESSAGES = {
  'name is required': 'Укажите имя.',
  'birthDate must use YYYY-MM-DD': 'Укажите дату рождения в формате YYYY-MM-DD.',
  'birthTime must use HH:mm': 'Укажите время рождения в формате HH:mm.',
  'birthTimeAccuracy is unsupported': 'Выберите точность времени рождения.',
  'houseSystem is unsupported': 'Выберите систему домов.',
  'zodiac is unsupported': 'Выберите зодиак.',
  'birthPlace.city is required': 'Укажите город рождения.',
  'birthPlace.country is required': 'Укажите страну рождения.',
  'currentPlace.mode is unsupported': 'Выберите текущее место расчета.',
  'currentPlace.timezone is required': 'Укажите timezone текущего места.',
};

function profileName(profile) {
  return typeof profile?.name === 'string' ? profile.name.trim() : '';
}

function profileId(profile) {
  return typeof profile?.id === 'string' && profile.id.trim() ? profile.id.trim() : '';
}

export function describeProfilesShell(profiles = [], activeProfileId = null) {
  const profileItems = Array.isArray(profiles)
    ? profiles
      .map((profile) => ({
        id: profileId(profile),
        label: profileName(profile),
        active: profileId(profile) === activeProfileId,
        editable: Boolean(profileId(profile)),
        selectable: Boolean(profileId(profile)) && profileId(profile) !== activeProfileId,
      }))
      .filter((profile) => profile.label)
    : [];
  const activeProfile = profileItems.find((profile) => profile.active);

  return {
    currentLabel: activeProfile?.label ?? GENERAL_PROFILE_LABEL,
    items: [
      {
        id: '',
        label: GENERAL_PROFILE_LABEL,
        active: !activeProfile,
        editable: false,
        selectable: Boolean(activeProfile),
      },
      ...profileItems,
    ],
    emptyTitle: profileItems.length ? '' : PROFILE_EMPTY_TITLE,
    emptyHint: profileItems.length ? '' : PROFILE_EMPTY_HINT,
    addButtonLabel: PROFILE_ADD_BUTTON_LABEL,
    addButtonHelp: PROFILE_ADD_BUTTON_HELP,
    privacyCopy: PROFILE_PRIVACY_COPY,
  };
}

export function describeProfileValidationErrors(errors = []) {
  return Array.isArray(errors)
    ? errors.map((error) => ERROR_MESSAGES[error] ?? error).filter(Boolean)
    : [];
}

export function describeProfileFormMode(mode = 'create') {
  const isEdit = mode === 'edit';

  return {
    title: isEdit ? 'Редактировать профиль' : 'Добавить профиль',
    deleteVisible: isEdit,
  };
}

export function describeProfileFormValues(profile = {}) {
  return {
    name: profileName(profile),
    birthDate: typeof profile.birthDate === 'string' ? profile.birthDate.trim() : '',
    birthTime: typeof profile.birthTime === 'string' ? profile.birthTime.trim() : '',
    birthTimeAccuracy: typeof profile.birthTimeAccuracy === 'string'
      ? profile.birthTimeAccuracy.trim()
      : 'exact',
    birthCity: typeof profile.birthPlace?.city === 'string' ? profile.birthPlace.city.trim() : '',
    birthCountry: typeof profile.birthPlace?.country === 'string'
      ? profile.birthPlace.country.trim()
      : '',
    birthTimezone:
      typeof profile.birthPlace?.timezone === 'string' && profile.birthPlace.timezone.trim()
        ? profile.birthPlace.timezone.trim()
        : 'Europe/Moscow',
    houseSystem: typeof profile.houseSystem === 'string' ? profile.houseSystem.trim() : 'wholeSign',
    zodiac: typeof profile.zodiac === 'string' ? profile.zodiac.trim() : 'tropical',
  };
}

export function describePersonalContextBlock(context = {}) {
  if (!context.hasActiveProfile) {
    return {
      hidden: true,
      title: '',
      summary: '',
      items: [],
      sections: [],
    };
  }
  const recommendations = getPersonalRecommendations(context);

  return {
    hidden: false,
    title: typeof context.title === 'string' ? context.title : '',
    summary: context.status === 'incomplete'
      ? PERSONAL_INCOMPLETE_SUMMARY
      : PERSONAL_READY_SUMMARY,
    items: getPersonalContextItems(context),
    sections: getPersonalContextSections(context, recommendations),
  };
}

export function describeNatalPlanetsReadinessBlock(profile = null) {
  if (!profile) {
    return {
      hidden: true,
      title: '',
      status: '',
      explanation: '',
      profileId: '',
      summary: '',
      canTogglePlanets: false,
      planets: [],
      missingTitle: '',
      missingFields: [],
      limitations: [],
    };
  }

  const natalPlanets = getNatalPlanetsForProfile(profile);
  const missingFields = describeNatalMissingFields(natalPlanets);
  const hasPlanets = natalPlanets.status === 'ready' && natalPlanets.formattedPlanets.length > 0;

  return {
    hidden: false,
    title: NATAL_PLANETS_READINESS_TITLE,
    status: hasPlanets ? '' : NATAL_PLANETS_READINESS_STATUS,
    explanation: hasPlanets ? '' : NATAL_PLANETS_READINESS_EXPLANATION,
    profileId: profileId(profile),
    summary: hasPlanets ? `${natalPlanets.formattedPlanets.length} планет рассчитано` : '',
    canTogglePlanets: hasPlanets,
    planets: hasPlanets ? natalPlanets.formattedPlanets.map((planet) => planet.text) : [],
    missingTitle: missingFields.length ? 'Нужно уточнить:' : '',
    missingFields,
    limitations: [NATAL_PLANETS_LIMITATION],
  };
}

export function describeNatalAspectsBlock(profile = null) {
  if (!profile) {
    return {
      hidden: true,
      title: '',
      status: '',
      explanation: '',
      profileId: '',
      summary: '',
      canToggleAspects: false,
      aspects: [],
      limitations: [],
    };
  }

  const natalAspects = getNatalAspectsForProfile(profile);
  const formattedAspects = Array.isArray(natalAspects.formattedAspects)
    ? natalAspects.formattedAspects
    : [];
  const hasAspects = natalAspects.status === 'ready' && formattedAspects.length > 0;
  const isReady = natalAspects.status === 'ready';

  return {
    hidden: false,
    title: NATAL_ASPECTS_TITLE,
    status: isReady ? '' : NATAL_ASPECTS_STATUS,
    explanation: isReady ? '' : NATAL_ASPECTS_EXPLANATION,
    profileId: profileId(profile),
    summary: isReady ? natalAspects.summary.text : '',
    canToggleAspects: hasAspects,
    aspects: hasAspects ? formattedAspects.map((aspect) => aspect.text) : [],
    limitations: isReady ? [NATAL_ASPECTS_READY_LIMITATION] : [],
  };
}

export function describeEssentialDignitiesBlock(profile = null) {
  if (!profile) {
    return {
      hidden: true,
      title: '',
      status: '',
      explanation: '',
      profileId: '',
      summary: '',
      canToggleDignities: false,
      dignities: [],
      limitations: [],
    };
  }

  const essentialDignities = getEssentialDignitiesForProfile(profile);
  const formattedDignities = Array.isArray(essentialDignities.formattedDignities)
    ? essentialDignities.formattedDignities
    : [];
  const hasDignities = essentialDignities.status === 'ready' && formattedDignities.length > 0;
  const isReady = essentialDignities.status === 'ready';

  return {
    hidden: false,
    title: ESSENTIAL_DIGNITIES_TITLE,
    status: isReady ? '' : ESSENTIAL_DIGNITIES_STATUS,
    explanation: isReady ? '' : ESSENTIAL_DIGNITIES_EXPLANATION,
    profileId: profileId(profile),
    summary: isReady ? essentialDignities.summary.text : '',
    canToggleDignities: hasDignities,
    dignities: hasDignities ? formattedDignities.map((dignity) => dignity.text) : [],
    limitations: hasDignities ? [ESSENTIAL_DIGNITIES_READY_LIMITATION] : [],
  };
}

function getPersonalContextSections(context, recommendations) {
  return [
    section('Можно сейчас', recommendations.goodNow),
    section('Для точного личного расчета', recommendations.nextSteps),
    section('Важно', recommendations.cautions),
  ].filter((item) => item.items.length);
}

function getPersonalContextItems(context) {
  const missing = Array.isArray(context.missingFields)
    ? context.missingFields.map((field) => MISSING_FIELD_LABELS[field]).filter(Boolean)
    : [];
  const warnings = Array.isArray(context.warnings) ? context.warnings.map(cleanText) : [];
  const limitations = Array.isArray(context.limitations) ? context.limitations.map(cleanText) : [];

  return unique([
    ...missing.map((label) => `Не хватает: ${label}`),
    ...warnings,
    ...limitations,
  ]).slice(0, 3);
}

function describeNatalMissingFields(birthInput) {
  const fields = Array.isArray(birthInput?.missingFields) ? birthInput.missingFields : [];

  return unique([
    ...fields,
    birthInput?.hasKnownTime === false ? 'birthTime' : '',
  ].map((field) => NATAL_MISSING_FIELD_LABELS[field]).filter(Boolean));
}

function section(title, items = []) {
  return {
    title,
    items: Array.isArray(items) ? items.map(cleanText).filter(Boolean).slice(0, 3) : [],
  };
}

function cleanText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function unique(items) {
  return [...new Set(items.filter(Boolean))];
}
