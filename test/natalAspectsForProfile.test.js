import assert from 'node:assert/strict';
import test from 'node:test';

import { getNatalAspectsForProfile } from '../src/natalAspectsForProfile.js';

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

test('ready profile returns formatted natal aspects without requiring coordinates', () => {
  const result = getNatalAspectsForProfile(baseProfile);

  assert.equal(result.status, 'ready');
  assert.equal(result.source, 'natal-aspect-engine');
  assert.equal(result.aspects.length > 0, true);
  assert.equal(result.formattedAspects.length, result.aspects.length);
  assert.equal(result.summary.total, result.aspects.length);
  assert.match(result.summary.text, /аспект/);
  assert.match(result.formattedAspects[0].text, /^.+ [☌✶□△☍] .+ · орб \d+°\d{2}′$/);
  assert.deepEqual(result.missingFields, []);
  assert.equal(result.limitations.includes('Это натальные аспекты между планетами, не транзиты.'), true);
});

test('incomplete natal planets keep natal aspects incomplete', () => {
  const result = getNatalAspectsForProfile({
    ...baseProfile,
    birthTime: '',
    birthTimeAccuracy: 'unknown',
  });

  assert.equal(result.status, 'incomplete');
  assert.deepEqual(result.aspects, []);
  assert.deepEqual(result.formattedAspects, []);
  assert.equal(result.summary.total, 0);
  assert.equal(result.warnings.includes('Сначала нужен расчет натальных планет.'), true);
});

test('natal aspects helper does not return raw birth data or unsupported feature values', () => {
  const result = getNatalAspectsForProfile(baseProfile);
  const text = JSON.stringify(result);

  assert.equal(text.includes('1990-05-12'), false);
  assert.equal(text.includes('14:30'), false);
  assert.equal(text.includes('Europe/Moscow'), false);
  assert.equal(text.includes('utcDateTime'), false);
  assert.equal(text.includes('latitude'), false);
  assert.equal(text.includes('longitude'), false);
  assert.equal(text.includes('birthPlace'), false);
  assert.equal(text.includes('ASC'), true);
  assert.equal(text.includes('houseValue'), false);
  assert.equal(text.includes('transitValue'), false);
});

test('natal aspects helper imports display and engine layers without profile storage or providers', async () => {
  const { readFileSync } = await import('node:fs');
  const source = readFileSync(new URL('../src/natalAspectsForProfile.js', import.meta.url), 'utf8');

  assert.equal(source.includes('calculateNatalAspects'), true);
  assert.equal(source.includes('formatNatalAspectList'), true);
  assert.equal(source.includes('summarizeNatalAspects'), true);
  assert.equal(source.includes('profileStorage'), false);
  assert.equal(source.includes('astronomy-engine'), false);
  assert.equal(source.includes('astronomyEngineProvider'), false);
  assert.equal(source.includes('luxon'), false);
});
