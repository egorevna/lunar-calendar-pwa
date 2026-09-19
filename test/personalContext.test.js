import assert from 'node:assert/strict';
import test from 'node:test';

import {
  createPersonalContext,
  getPersonalContextStatus,
  getPersonalContextSummary,
} from '../src/personalContext.js';
import { createPersonalProfileInput } from '../src/personalProfileInput.js';

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

test('null profile returns general context without personal calculations', () => {
  const context = createPersonalContext(null);

  assert.equal(context.hasActiveProfile, false);
  assert.equal(context.profileName, 'Общий день');
  assert.equal(context.title, null);
  assert.equal(context.status, 'general');
  assert.equal(context.summary, 'Выбран общий день. Личный блок появится после выбора профиля.');
  assert.deepEqual(context.readiness, []);
  assert.deepEqual(context.limitations, []);
  assert.deepEqual(context.nextSteps, []);
  assert.deepEqual(context.missingFields, []);
  assert.deepEqual(context.warnings, []);
  assert.equal(context.capabilities.canCalculateNatalPlanets, false);
  assert.equal(context.capabilities.canCalculateHouses, false);
  assert.equal(context.capabilities.canCalculateAscMc, false);
  assert.equal(context.capabilities.canCalculatePersonalTransits, false);
});

test('complete selected profile returns personal title and safe context summary', () => {
  const context = createPersonalContext(completeProfile);

  assert.equal(context.hasActiveProfile, true);
  assert.equal(context.profileName, 'Егор');
  assert.equal(context.title, 'Лично для Егора');
  assert.equal(context.status, 'readyForContext');
  assert.equal(context.summary, 'Профиль выбран, натальная карта рассчитана — см. «Мои карты». Личные транзиты пока не рассчитываются, поэтому рекомендации ниже основаны на общем моменте и режиме.');
  assert.equal(context.readiness.includes('Профиль готов для базового личного контекста.'), true);
  assert.equal(context.readiness.includes('Натальные планеты, дома и ASC/MC рассчитаны.'), true);
  assert.equal(context.limitations.includes('Персональные транзиты пока не рассчитываются.'), true);
});

test('incomplete profile returns incomplete status and missing field summary', () => {
  const context = createPersonalContext({
    ...completeProfile,
    birthDate: '',
  });

  assert.equal(context.status, 'incomplete');
  assert.equal(context.summary, 'Профиль выбран, но для личного расчета не хватает данных.');
  assert.equal(context.missingFields.includes('birthDate'), true);
});

test('unknown birth time adds limitation and warning about houses and ASC/MC', () => {
  const context = createPersonalContext({
    ...completeProfile,
    birthTime: '',
    birthTimeAccuracy: 'unknown',
  });

  assert.equal(
    context.warnings.includes('Время рождения неизвестно — дома и ASC/MC недоступны.'),
    true,
  );
  assert.equal(
    context.limitations.includes('Время рождения неизвестно — дома и ASC/MC недоступны.'),
    true,
  );
});

test('missing coordinates adds limitation and warning about birth place coordinates', () => {
  const context = createPersonalContext({
    ...completeProfile,
    birthPlace: {
      ...completeProfile.birthPlace,
      latitude: null,
      longitude: null,
    },
  });

  assert.equal(context.missingFields.includes('birthPlace.coordinates'), true);
  assert.equal(
    context.warnings.includes('Для домов и ASC/MC нужны координаты места рождения.'),
    true,
  );
  assert.equal(
    context.limitations.includes('Для домов и ASC/MC нужны координаты места рождения.'),
    true,
  );
});

test('missing timezone adds limitation and warning about timezone', () => {
  const context = createPersonalContext({
    ...completeProfile,
    birthPlace: {
      ...completeProfile.birthPlace,
      timezone: '',
    },
  });

  assert.equal(context.missingFields.includes('birthPlace.timezone'), true);
  assert.equal(
    context.warnings.includes('Для точного расчета нужно знать часовой пояс места рождения.'),
    true,
  );
  assert.equal(
    context.limitations.includes('Для точного расчета нужно знать часовой пояс места рождения.'),
    true,
  );
});

test('complete profile reports natal capabilities honestly and keeps transits unavailable', () => {
  const context = createPersonalContext(completeProfile);

  assert.equal(context.capabilities.canCalculateNatalPlanets, true);
  assert.equal(context.capabilities.canCalculateHouses, true);
  assert.equal(context.capabilities.canCalculateAscMc, true);
  assert.equal(context.capabilities.canCalculatePersonalTransits, false);
});

test('unknown birth time makes the context calculation-limited', () => {
  const context = createPersonalContext({
    ...completeProfile,
    birthTime: '',
    birthTimeAccuracy: 'unknown',
  });

  assert.equal(context.status, 'calculationLimited');
  assert.equal(context.capabilities.canCalculateNatalPlanets, false);
  assert.equal(context.capabilities.canCalculateHouses, false);
  assert.equal(context.readiness.includes('Натальные планеты, дома и ASC/MC рассчитаны.'), false);
  assert.equal(
    context.summary,
    'Профиль выбран. Часть натальной карты недоступна — см. «Мои карты». Рекомендации ниже основаны на общем моменте и режиме.',
  );
});

test('status and summary helpers are deterministic', () => {
  const general = createPersonalProfileInput(null);
  const complete = createPersonalProfileInput(completeProfile);
  const incomplete = createPersonalProfileInput({ ...completeProfile, birthDate: '' });

  assert.equal(getPersonalContextStatus(general), 'general');
  assert.equal(getPersonalContextStatus(incomplete), 'incomplete');
  assert.equal(getPersonalContextStatus(complete), 'readyForContext');
  assert.equal(getPersonalContextSummary(complete), 'Профиль выбран, натальная карта рассчитана — см. «Мои карты». Личные транзиты пока не рассчитываются, поэтому рекомендации ниже основаны на общем моменте и режиме.');
});

test('missingFields and warnings are passed through from personal profile input', () => {
  const context = createPersonalContext({
    ...completeProfile,
    birthDate: '',
    birthTime: '',
    birthPlace: {
      ...completeProfile.birthPlace,
      latitude: null,
      longitude: null,
      timezone: '',
    },
  });

  assert.deepEqual(context.missingFields, [
    'birthDate',
    'birthTime',
    'birthPlace.coordinates',
    'birthPlace.timezone',
  ]);
  assert.deepEqual(context.warnings, [
    'Для домов и ASC/MC нужны координаты места рождения.',
    'Для точного расчета нужно знать часовой пояс места рождения.',
  ]);
});

test('output does not contain fake personal astrology claims', () => {
  const serialized = JSON.stringify(createPersonalContext(completeProfile));

  assert.equal(serialized.includes('Луна в 7 доме'), false);
  assert.equal(serialized.includes('ASC в'), false);
  assert.equal(serialized.includes('MC в'), false);
  assert.equal(serialized.includes('орб'), false);
  assert.equal(serialized.includes('персональные транзиты доступны'), false);
  assert.equal(serialized.includes('canCalculatePersonalTransits":true'), false);
});
