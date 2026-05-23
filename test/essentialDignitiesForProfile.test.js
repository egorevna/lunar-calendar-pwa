import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import { getEssentialDignitiesForProfile } from '../src/essentialDignitiesForProfile.js';

const readyProfile = {
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

test('ready profile returns ready dignity results', () => {
  const result = getEssentialDignitiesForProfile(readyProfile);

  assert.equal(result.status, 'ready');
  assert.equal(result.source, 'essential-dignities-v1');
  assert.equal(result.results.length, 10);
  assert.equal(result.summary.total, 10);
  assert.equal(result.summary.text, '2 достоинства · 1 слабость');
});

test('ready profile returns formatted non-neutral dignity rows', () => {
  const result = getEssentialDignitiesForProfile(readyProfile);

  assert.deepEqual(result.formattedDignities.map((item) => item.text), [
    'Венера в Овне — изгнание',
    'Юпитер в Раке — экзальтация',
    'Сатурн в Козероге — обитель',
    'Плутон в Скорпионе — современное управление',
  ]);
});

test('incomplete natal planets keep essential dignities incomplete', () => {
  const result = getEssentialDignitiesForProfile({
    ...readyProfile,
    birthTime: '',
    birthTimeAccuracy: 'unknown',
  });

  assert.equal(result.status, 'incomplete');
  assert.deepEqual(result.results, []);
  assert.deepEqual(result.formattedDignities, []);
  assert.equal(result.warnings.includes('Сначала нужен расчет натальных планет.'), true);
});

test('neutral-only ready profile returns empty formatted dignity list and neutral summary', () => {
  const result = getEssentialDignitiesForProfile({
    ...readyProfile,
    birthDate: '2009-07-15',
    birthTime: '12:00',
  });

  assert.equal(result.status, 'ready');
  assert.equal(result.results.length, 10);
  assert.deepEqual(result.formattedDignities, []);
  assert.equal(result.summary.text, 'Ярко выраженных базовых достоинств или слабостей не найдено.');
});

test('essential dignities helper does not return raw birth data or unsupported feature values', () => {
  const result = getEssentialDignitiesForProfile(readyProfile);
  const text = JSON.stringify(result);

  assert.equal(text.includes('1990-05-12'), false);
  assert.equal(text.includes('14:30'), false);
  assert.equal(text.includes('Europe/Moscow'), false);
  assert.equal(text.includes('utcDateTime'), false);
  assert.equal(text.includes('latitude'), false);
  assert.equal(text.includes('longitude'), false);
  assert.equal(text.includes('coordinates'), false);
  assert.equal(text.includes('birthPlace'), false);
  assert.equal(text.includes('terms'), false);
  assert.equal(text.includes('decans'), false);
  assert.equal(text.includes('degreeRulers'), false);
  assert.equal(text.includes('VronskyStrengthTables'), false);
  assert.equal(text.includes('houses'), false);
  assert.equal(text.includes('transits'), false);
  assert.equal(text.includes('interpretation'), false);
});

test('essential dignities helper uses existing layers without direct provider or UI imports', () => {
  const source = readFileSync(new URL('../src/essentialDignitiesForProfile.js', import.meta.url), 'utf8');

  assert.equal(source.includes('getNatalPlanetsForProfile'), true);
  assert.equal(source.includes('evaluateEssentialDignities'), true);
  assert.equal(source.includes('formatEssentialDignityList'), true);
  assert.equal(source.includes('summarizeEssentialDignities'), true);
  assert.equal(source.includes('astronomyEngineProvider'), false);
  assert.equal(source.includes('calculateAstronomyEnginePlanetPositions'), false);
  assert.equal(source.includes('profileStorage'), false);
  assert.equal(source.includes('localStorage'), false);
  assert.equal(source.includes('document.'), false);
  assert.equal(source.includes('window.'), false);
});
