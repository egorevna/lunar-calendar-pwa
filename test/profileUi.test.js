import assert from 'node:assert/strict';
import test from 'node:test';

import {
  describeProfileFormMode,
  describeProfileFormValues,
  describeProfileValidationErrors,
  describeProfilesShell,
} from '../src/profileUi.js';

test('profiles shell describes general day and empty state', () => {
  const view = describeProfilesShell([]);

  assert.equal(view.currentLabel, 'Общий день');
  assert.deepEqual(view.items, [{
    id: '',
    label: 'Общий день',
    active: true,
    editable: false,
    selectable: false,
  }]);
  assert.equal(view.emptyTitle, 'Пока нет сохраненных карт.');
  assert.equal(view.emptyHint, 'Начните с добавления профиля.');
  assert.equal(view.addButtonLabel, '+ Добавить профиль');
  assert.equal(view.addButtonHelp, 'Профили нужны для будущих личных расчетов.');
  assert.equal(view.privacyCopy, 'Данные хранятся на этом устройстве и не отправляются на сервер.');
  assert.equal(view.serverPrivacyCopy, undefined);
  assert.equal(view.backupPrivacyCopy, undefined);
});

test('profiles shell includes existing profile names from storage view', () => {
  const view = describeProfilesShell([
    { id: 'profile-anna', name: 'Анна' },
    { id: 'profile-egor', name: ' Егор ' },
  ]);

  assert.deepEqual(view.items, [
    { id: '', label: 'Общий день', active: true, editable: false, selectable: false },
    { id: 'profile-anna', label: 'Анна', active: false, editable: true, selectable: true },
    { id: 'profile-egor', label: 'Егор', active: false, editable: true, selectable: true },
  ]);
  assert.equal(view.emptyTitle, '');
  assert.equal(view.emptyHint, '');
});

test('profiles shell marks saved profile as active', () => {
  const view = describeProfilesShell([
    { id: 'profile-anna', name: 'Анна' },
    { id: 'profile-egor', name: 'Егор' },
  ], 'profile-egor');

  assert.equal(view.currentLabel, 'Егор');
  assert.deepEqual(view.items, [
    { id: '', label: 'Общий день', active: false, editable: false, selectable: true },
    { id: 'profile-anna', label: 'Анна', active: false, editable: true, selectable: true },
    { id: 'profile-egor', label: 'Егор', active: true, editable: true, selectable: false },
  ]);
});

test('profiles shell does not expose empty technical values', () => {
  const view = describeProfilesShell([{ name: '' }, null, { name: 'Анна' }]);
  const text = JSON.stringify(view);

  assert.deepEqual(view.items, [
    { id: '', label: 'Общий день', active: true, editable: false, selectable: false },
    { id: '', label: 'Анна', active: false, editable: false, selectable: false },
  ]);
  assert.equal(text.includes('undefined'), false);
  assert.equal(text.includes('null'), false);
});

test('profile UI describes create and edit form titles', () => {
  assert.equal(describeProfileFormMode('create').title, 'Добавить профиль');
  assert.equal(describeProfileFormMode('create').deleteVisible, false);
  assert.equal(describeProfileFormMode('edit').title, 'Редактировать профиль');
  assert.equal(describeProfileFormMode('edit').deleteVisible, true);
});

test('profile UI returns form values for editing', () => {
  const values = describeProfileFormValues({
    name: 'Анна',
    birthDate: '1990-05-12',
    birthTime: '08:45',
    birthTimeAccuracy: 'approximate',
    birthPlace: {
      city: 'Москва',
      country: 'Россия',
      timezone: 'Europe/Moscow',
    },
    houseSystem: 'placidus',
    zodiac: 'tropical',
  });

  assert.equal(values.name, 'Анна');
  assert.equal(values.birthDate, '1990-05-12');
  assert.equal(values.birthTime, '08:45');
  assert.equal(values.birthTimeAccuracy, 'approximate');
  assert.equal(values.birthCity, 'Москва');
  assert.equal(values.birthCountry, 'Россия');
  assert.equal(values.birthTimezone, 'Europe/Moscow');
  assert.equal(values.houseSystem, 'placidus');
  assert.equal(values.zodiac, 'tropical');
});

test('profile UI returns safe default form values for creation', () => {
  const values = describeProfileFormValues({ birthPlace: { timezone: '' } });

  assert.equal(values.name, '');
  assert.equal(values.birthDate, '');
  assert.equal(values.birthTime, '');
  assert.equal(values.birthTimeAccuracy, 'exact');
  assert.equal(values.birthTimezone, 'Europe/Moscow');
  assert.equal(values.houseSystem, 'wholeSign');
  assert.equal(values.zodiac, 'tropical');
});

test('profile UI describes validation errors in short Russian copy', () => {
  const errors = describeProfileValidationErrors([
    'name is required',
    'birthDate must use YYYY-MM-DD',
    'birthTime must use HH:mm',
    'birthPlace.city is required',
    'birthPlace.country is required',
  ]);

  assert.deepEqual(errors, [
    'Укажите имя.',
    'Укажите дату рождения в формате YYYY-MM-DD.',
    'Укажите время рождения в формате HH:mm.',
    'Укажите город рождения.',
    'Укажите страну рождения.',
  ]);
});

test('profile UI keeps unknown validation errors readable', () => {
  assert.deepEqual(describeProfileValidationErrors(['custom error']), ['custom error']);
});
