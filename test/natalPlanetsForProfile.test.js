import assert from 'node:assert/strict';
import test from 'node:test';

import { getNatalPlanetsForProfile } from '../src/natalPlanetsForProfile.js';

const baseProfile = {
  id: 'profile-ready',
  name: 'Анна',
  birthDate: '1990-05-12',
  birthTime: '14:30',
  birthTimeAccuracy: 'exact',
  birthPlace: {
    city: 'Москва',
    country: 'Россия',
    latitude: null,
    longitude: null,
    timezone: 'Europe/Moscow',
  },
  currentPlace: {
    mode: 'moscow',
    city: 'Москва',
    country: 'Россия',
    timezone: 'Europe/Moscow',
  },
  houseSystem: 'wholeSign',
  zodiac: 'tropical',
};

test('ready profile returns 10 formatted natal planets without requiring coordinates', () => {
  const result = getNatalPlanetsForProfile(baseProfile);

  assert.equal(result.status, 'ready');
  assert.equal(result.source, 'astronomy-engine');
  assert.equal(result.formattedPlanets.length, 10);
  assert.deepEqual(result.formattedPlanets.map((planet) => planet.label), [
    'Солнце',
    'Луна',
    'Меркурий',
    'Венера',
    'Марс',
    'Юпитер',
    'Сатурн',
    'Уран',
    'Нептун',
    'Плутон',
  ]);
  assert.deepEqual(result.missingFields, []);
  assert.equal(result.limitations.includes('Дома, ASC/MC и транзиты пока не рассчитываются.'), true);
});

test('ready output contains display text but no raw birth data or UTC input', () => {
  const result = getNatalPlanetsForProfile(baseProfile);
  const text = JSON.stringify({
    status: result.status,
    formattedPlanets: result.formattedPlanets,
    limitations: result.limitations,
  });

  assert.match(result.formattedPlanets[0].text, /^Солнце — .+ \d{1,2}°\d{2}′$/);
  assert.equal(text.includes('1990-05-12'), false);
  assert.equal(text.includes('14:30'), false);
  assert.equal(text.includes('Europe/Moscow'), false);
  assert.equal(text.includes('utcDateTime'), false);
  assert.equal(text.includes('10:30:00.000Z'), false);
  assert.equal(text.includes('latitude'), false);
  assert.equal(text.includes('longitude'), false);
});

test('unknown birth time blocks planet list and returns readiness state', () => {
  const result = getNatalPlanetsForProfile({
    ...baseProfile,
    birthTime: '',
    birthTimeAccuracy: 'unknown',
  });

  assert.equal(result.status, 'incomplete');
  assert.deepEqual(result.formattedPlanets, []);
  assert.equal(result.missingFields.includes('birthTime'), true);
  assert.equal(result.warnings.includes('Время рождения неизвестно — ASC/MC и дома недоступны.'), true);
});

test('missing timezone blocks planet list', () => {
  const result = getNatalPlanetsForProfile({
    ...baseProfile,
    birthPlace: {
      ...baseProfile.birthPlace,
      timezone: '',
    },
  });

  assert.equal(result.status, 'incomplete');
  assert.deepEqual(result.formattedPlanets, []);
  assert.equal(result.missingFields.includes('birthPlace.timezone'), true);
});

test('ambiguous and nonexistent DST local times fail closed without planets', () => {
  const ambiguous = getNatalPlanetsForProfile({
    ...baseProfile,
    birthDate: '2021-11-07',
    birthTime: '01:30',
    birthPlace: {
      ...baseProfile.birthPlace,
      timezone: 'America/New_York',
    },
  });
  const nonexistent = getNatalPlanetsForProfile({
    ...baseProfile,
    birthDate: '2021-03-14',
    birthTime: '02:30',
    birthPlace: {
      ...baseProfile.birthPlace,
      timezone: 'America/New_York',
    },
  });

  assert.equal(ambiguous.status, 'incomplete');
  assert.equal(nonexistent.status, 'incomplete');
  assert.deepEqual(ambiguous.formattedPlanets, []);
  assert.deepEqual(nonexistent.formattedPlanets, []);
  assert.equal(ambiguous.warnings.some((warning) => warning.includes('неоднозначный переход')), true);
  assert.equal(nonexistent.warnings.some((warning) => warning.includes('несуществующий переход')), true);
});
