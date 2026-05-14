import assert from 'node:assert/strict';
import test from 'node:test';

import {
  describeProfileValidationErrors,
  describeProfilesShell,
} from '../src/profileUi.js';

test('profiles shell describes general day and empty state', () => {
  const view = describeProfilesShell([]);

  assert.equal(view.currentLabel, 'Общий день');
  assert.deepEqual(view.items, ['Общий день']);
  assert.equal(view.emptyTitle, 'Пока нет сохраненных карт.');
  assert.equal(view.emptyHint, 'Начните с добавления профиля.');
  assert.equal(view.addButtonLabel, '+ Добавить профиль');
  assert.equal(view.addButtonHelp, 'Добавление профиля — следующий шаг.');
  assert.equal(view.privacyCopy, 'Данные карты хранятся только на этом устройстве.');
});

test('profiles shell includes existing profile names from storage view', () => {
  const view = describeProfilesShell([
    { name: 'Анна' },
    { name: ' Егор ' },
  ]);

  assert.deepEqual(view.items, ['Общий день', 'Анна', 'Егор']);
  assert.equal(view.emptyTitle, '');
  assert.equal(view.emptyHint, '');
});

test('profiles shell does not expose empty technical values', () => {
  const view = describeProfilesShell([{ name: '' }, null, { name: 'Анна' }]);
  const text = JSON.stringify(view);

  assert.deepEqual(view.items, ['Общий день', 'Анна']);
  assert.equal(text.includes('undefined'), false);
  assert.equal(text.includes('null'), false);
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
