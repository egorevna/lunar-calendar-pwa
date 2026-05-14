import assert from 'node:assert/strict';
import test from 'node:test';

import { createPersonalContext } from '../src/personalContext.js';
import { getPersonalRecommendations } from '../src/personalRecommendations.js';

const completeProfile = {
  id: 'profile-egor',
  name: 'Егор',
  birthDate: '1991-04-20',
  birthTime: '10:35',
  birthTimeAccuracy: 'exact',
  birthPlace: {
    city: 'Москва',
    country: 'Россия',
    latitude: 55.7558,
    longitude: 37.6173,
    timezone: 'Europe/Moscow',
  },
  currentPlace: {
    mode: 'moscow',
    city: 'Москва',
    country: 'Россия',
    latitude: null,
    longitude: null,
    timezone: 'Europe/Moscow',
  },
  houseSystem: 'wholeSign',
  zodiac: 'tropical',
  createdAt: '2026-05-14T00:00:00.000Z',
  updatedAt: '2026-05-14T00:00:00.000Z',
};

test('null profile returns empty personal recommendations', () => {
  const recommendations = getPersonalRecommendations(createPersonalContext(null));

  assert.deepEqual(recommendations, {
    goodNow: [],
    nextSteps: [],
    cautions: [],
  });
});

test('selected profile gets safe general-moment recommendations', () => {
  const recommendations = getPersonalRecommendations(createPersonalContext(completeProfile));

  assert.equal(recommendations.goodNow.includes('использовать общий момент и режим'), true);
  assert.equal(recommendations.goodNow.includes('смотреть лучшие окна как ориентир'), true);
  assert.equal(recommendations.nextSteps.includes('уточнить время и место рождения, если нужно'), true);
  assert.equal(recommendations.nextSteps.includes('подключить натальный расчетный движок'), false);
  assert.equal(recommendations.cautions.includes('это пока не личный транзит'), true);
  assert.equal(
    recommendations.cautions.includes('дома и ASC/MC будут доступны после подключения натального расчета'),
    true,
  );
  assert.equal(recommendations.cautions.length <= 2, true);
});

test('missing coordinates and timezone become human next steps', () => {
  const context = createPersonalContext({
    ...completeProfile,
    birthPlace: {
      ...completeProfile.birthPlace,
      latitude: null,
      longitude: null,
      timezone: '',
    },
  });
  const recommendations = getPersonalRecommendations(context);
  const text = JSON.stringify(recommendations);

  assert.equal(recommendations.nextSteps.includes('координаты места рождения'), true);
  assert.equal(recommendations.nextSteps.includes('часовой пояс места рождения'), true);
  assert.equal(recommendations.nextSteps.includes('добавить координаты места рождения'), false);
  assert.equal(text.includes('birthPlace.coordinates'), false);
  assert.equal(text.includes('birthPlace.timezone'), false);
});

test('unknown birth time adds safe caution about houses and ASC/MC', () => {
  const recommendations = getPersonalRecommendations(createPersonalContext({
    ...completeProfile,
    birthTime: '',
    birthTimeAccuracy: 'unknown',
  }));

  assert.equal(
    recommendations.cautions.includes('Время рождения неизвестно — дома и ASC/MC недоступны.'),
    true,
  );
});

test('missing birth date and required birth time become human next steps', () => {
  const recommendations = getPersonalRecommendations(createPersonalContext({
    ...completeProfile,
    birthDate: '',
    birthTime: '',
  }));

  assert.equal(recommendations.nextSteps.includes('дата рождения'), true);
  assert.equal(recommendations.nextSteps.includes('время рождения'), true);
});

test('recommendation lists are capped and contain no undefined null or sensitive values', () => {
  const recommendations = getPersonalRecommendations(createPersonalContext({
    ...completeProfile,
    birthDate: '',
    birthTime: '',
    birthPlace: {
      ...completeProfile.birthPlace,
      latitude: null,
      longitude: null,
      timezone: '',
    },
  }));
  const text = JSON.stringify(recommendations);

  assert.equal(recommendations.goodNow.length <= 3, true);
  assert.equal(recommendations.nextSteps.length <= 3, true);
  assert.equal(recommendations.cautions.length <= 3, true);
  assert.equal(text.includes('undefined'), false);
  assert.equal(text.includes('null'), false);
  assert.equal(text.includes('1991-04-20'), false);
  assert.equal(text.includes('10:35'), false);
  assert.equal(text.includes('55.7558'), false);
  assert.equal(text.includes('37.6173'), false);
});

test('recommendations do not contain fake personal astrology claims', () => {
  const text = JSON.stringify(getPersonalRecommendations(createPersonalContext(completeProfile)));

  assert.equal(text.includes('подключить натальный расчетный движок'), false);
  assert.equal(text.includes('личный натальный расчет пока не подключен'), false);
  assert.equal(text.includes('не воспринимать общий прогноз как личный транзит'), false);
  assert.equal(text.includes('Луна в 7 доме'), false);
  assert.equal(text.includes('Марс □ ASC'), false);
  assert.equal(text.includes('Плутон ☌ Венера'), false);
  assert.equal(text.includes('орб'), false);
  assert.equal(text.includes('транзиты доступны'), false);
});
