export const GENERAL_PROFILE_LABEL = 'Общий день';
export const PROFILE_PRIVACY_COPY = 'Данные карты хранятся только на этом устройстве.';
export const PROFILE_EMPTY_TITLE = 'Пока нет сохраненных карт.';
export const PROFILE_EMPTY_HINT = 'Начните с добавления профиля.';
export const PROFILE_ADD_BUTTON_LABEL = '+ Добавить профиль';
export const PROFILE_ADD_BUTTON_HELP = 'Добавление профиля — следующий шаг.';

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

export function describeProfilesShell(profiles = []) {
  const names = Array.isArray(profiles) ? profiles.map(profileName).filter(Boolean) : [];

  return {
    currentLabel: GENERAL_PROFILE_LABEL,
    items: [GENERAL_PROFILE_LABEL, ...names],
    emptyTitle: names.length ? '' : PROFILE_EMPTY_TITLE,
    emptyHint: names.length ? '' : PROFILE_EMPTY_HINT,
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
