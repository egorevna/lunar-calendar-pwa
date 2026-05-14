export const GENERAL_PROFILE_LABEL = 'Общий день';
export const PROFILE_PRIVACY_COPY = 'Данные хранятся на этом устройстве и не отправляются на сервер.';
export const PROFILE_EMPTY_TITLE = 'Пока нет сохраненных карт.';
export const PROFILE_EMPTY_HINT = 'Начните с добавления профиля.';
export const PROFILE_ADD_BUTTON_LABEL = '+ Добавить профиль';
export const PROFILE_ADD_BUTTON_HELP = 'Профили нужны для будущих личных расчетов.';
const PERSONAL_INCOMPLETE_SUMMARY =
  'Профиль выбран, но для глубокого личного расчета не хватает данных.';

const MISSING_FIELD_LABELS = {
  birthDate: 'дата рождения',
  birthTime: 'время рождения',
  'birthPlace.coordinates': 'координаты места рождения',
  'birthPlace.timezone': 'часовой пояс места рождения',
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
    };
  }

  return {
    hidden: false,
    title: typeof context.title === 'string' ? context.title : '',
    summary: context.status === 'incomplete'
      ? PERSONAL_INCOMPLETE_SUMMARY
      : cleanText(context.summary),
    items: getPersonalContextItems(context),
  };
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

function cleanText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function unique(items) {
  return [...new Set(items.filter(Boolean))];
}
