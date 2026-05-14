export const GENERAL_PROFILE_LABEL = 'Общий день';
export const PROFILE_PRIVACY_COPY = 'Данные карты хранятся только на этом устройстве.';
export const PROFILE_EMPTY_TITLE = 'Пока нет сохраненных карт.';
export const PROFILE_EMPTY_HINT = 'Начните с добавления профиля.';
export const PROFILE_ADD_BUTTON_LABEL = '+ Добавить профиль';
export const PROFILE_ADD_BUTTON_HELP = 'Профили нужны для будущих личных расчетов.';

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
