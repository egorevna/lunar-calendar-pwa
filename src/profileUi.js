export const GENERAL_PROFILE_LABEL = 'Общий день';
export const PROFILE_PRIVACY_COPY = 'Данные карты хранятся только на этом устройстве.';
export const PROFILE_EMPTY_TITLE = 'Пока нет сохраненных карт.';
export const PROFILE_EMPTY_HINT = 'Начните с добавления профиля.';
export const PROFILE_ADD_BUTTON_LABEL = '+ Добавить профиль';
export const PROFILE_ADD_BUTTON_HELP = 'Добавление профиля — следующий шаг.';

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
