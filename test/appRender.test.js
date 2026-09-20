import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import { JSDOM } from 'jsdom';

// Smoke tests for the real DOM entry point: index.html + src/app.js rendered in
// jsdom. They do not check astrology values, only that the dashboard and the
// profile panel render, react to clicks and stay consistent with each other.

const INDEX_HTML = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const DOM_GLOBALS = [
  'window',
  'document',
  'navigator',
  'localStorage',
  'HTMLElement',
  'Event',
  'FormData',
  'FileReader',
  'Blob',
];

const TEST_PROFILE = {
  id: 'profile-smoke',
  name: 'Тест',
  birthDate: '1990-06-15',
  birthTime: '12:30',
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
  houseSystem: 'placidus',
  zodiac: 'tropical',
  createdAt: '2026-09-19T00:00:00.000Z',
  updatedAt: '2026-09-19T00:00:00.000Z',
};

let importCounter = 0;

async function bootApp({ search = '', profiles = [], activeProfileId = null } = {}) {
  const dom = new JSDOM(INDEX_HTML, { url: `http://localhost/${search}` });
  const saved = Object.fromEntries(
    DOM_GLOBALS.map((key) => [key, Object.getOwnPropertyDescriptor(globalThis, key)]),
  );

  // Node exposes some of these (navigator, localStorage) as getters, so plain
  // assignment throws; define them as ordinary writable properties instead.
  for (const key of DOM_GLOBALS) {
    Object.defineProperty(globalThis, key, {
      value: dom.window[key],
      configurable: true,
      writable: true,
      enumerable: true,
    });
  }

  if (profiles.length) {
    dom.window.localStorage.setItem('astroPwa.profiles.v1', JSON.stringify(profiles));
  }

  if (activeProfileId) {
    dom.window.localStorage.setItem('astroPwa.activeProfileId.v1', activeProfileId);
  }

  // A query string makes Node evaluate a fresh module instance per boot.
  importCounter += 1;
  await import(`../src/app.js?boot=${importCounter}`);

  const query = (selector) => dom.window.document.querySelector(selector);
  const text = (selector) => (query(selector)?.textContent ?? '').trim();
  const click = (element) => element.dispatchEvent(new dom.window.Event('click', { bubbles: true }));

  return {
    dom,
    query,
    text,
    click,
    stop() {
      dom.window.close();
      for (const key of DOM_GLOBALS) {
        if (saved[key] === undefined) {
          delete globalThis[key];
        } else {
          Object.defineProperty(globalThis, key, saved[key]);
        }
      }
    },
  };
}

test('dashboard renders every general block for the current moment', async () => {
  const app = await bootApp();

  try {
    assert.match(app.text('[data-date]'), /\d{4} г\./);
    assert.match(app.text('[data-clock]'), /^\d{2}:\d{2}$/);
    assert.match(app.text('[data-lunar-day]'), /^\d{1,2}-й лунный день$/);
    assert.ok(app.text('[data-phase]').length > 0);
    assert.match(app.text('[data-moon-precision]'), /Освещенность: \d{1,3}%/);
    assert.match(app.text('[data-moon-sign]'), /^Луна в /);
    assert.ok(app.text('[data-voc]').length > 0);
    assert.ok(app.text('[data-last-moon-aspect]').length > 0);
    assert.ok(app.text('[data-next-moon-aspect]').length > 0);
    assert.ok(app.text('[data-day-officer]').length > 0);
    assert.ok(app.text('[data-sexagenary-day]').length > 0);
    assert.ok(app.text('[data-planetary-day]').length > 0);
    assert.match(app.text('[data-hour-range]'), /^\d{2}:\d{2} – \d{2}:\d{2}$/);
    assert.ok(app.text('[data-field-summary]').length > 0);
    assert.ok(app.text('[data-field-advice]').length > 0);
    assert.equal(app.query('[data-field-metrics]').children.length, 3);
    assert.equal(app.text('[data-profile-current]'), 'Общий день');
    assert.equal(app.query('[data-personal-context-card]').hidden, true);
    assert.equal(app.query('[data-debug-panel]').hidden, true);
    assert.equal(app.text('[data-debug-content]'), '');
  } finally {
    app.stop();
  }
});

test('mode chips switch the selected mode and re-render metrics', async () => {
  const app = await bootApp();

  try {
    const general = app.query('[data-mode-button="general"]');
    const tarot = app.query('[data-mode-button="tarot"]');

    assert.equal(general.getAttribute('aria-pressed'), 'true');
    app.click(tarot);
    assert.equal(tarot.getAttribute('aria-pressed'), 'true');
    assert.equal(general.getAttribute('aria-pressed'), 'false');
    assert.equal(app.query('[data-field-metrics]').children.length, 3);
  } finally {
    app.stop();
  }
});

test('help buttons toggle their explanations', async () => {
  const app = await bootApp();

  try {
    const button = app.query('[data-help-toggle="voc"]');
    const help = app.query('[data-help-text="voc"]');

    assert.equal(help.hidden, true);
    app.click(button);
    assert.equal(help.hidden, false);
    assert.equal(button.getAttribute('aria-expanded'), 'true');
    app.click(button);
    assert.equal(help.hidden, true);
  } finally {
    app.stop();
  }
});

test('active profile renders the personal card and natal sections in My Cards', async () => {
  const app = await bootApp({
    profiles: [TEST_PROFILE],
    activeProfileId: TEST_PROFILE.id,
  });

  try {
    assert.equal(app.text('[data-profile-current]'), 'Тест');
    assert.equal(app.query('[data-personal-context-card]').hidden, false);
    assert.equal(app.text('[data-personal-context-title]'), 'Лично для Теста');
    assert.match(app.text('[data-personal-context-summary]'), /натальная карта рассчитана/);

    app.click(app.query('[data-profiles-toggle]'));
    assert.equal(app.query('[data-profiles-panel]').hidden, false);
    assert.equal(app.text('[data-natal-planets-summary]'), '10 планет рассчитано');
    assert.match(app.text('[data-natal-aspects-summary]'), /^\d+ аспектов/);
    assert.match(app.text('[data-houses-status]'), /Placidus/);

    const planetsToggle = app.query('[data-natal-planets-toggle]');
    const planetsList = app.query('[data-natal-planets-list]');
    assert.equal(planetsList.hidden, true);
    app.click(planetsToggle);
    assert.equal(planetsList.hidden, false);
    assert.equal(planetsList.children.length, 10);
    assert.match(planetsList.children[0].textContent, /^Солнце — Близнецы 23°59′$/);

    app.click(app.query('[data-houses-toggle]'));
    assert.equal(app.query('[data-houses-content]').hidden, false);
    assert.match(app.text('[data-houses-angles]'), /ASC — Дева 15°41′/);
    assert.equal(app.query('[data-houses-list]').children.length, 12);

    const panelText = app.query('[data-profiles-panel]').textContent;
    assert.doesNotMatch(panelText, /Sprint|verified|после подключения|Дома, ASC\/MC и транзиты пока не рассчитываются/);
  } finally {
    app.stop();
  }
});

test('debug panel follows the active profile and switches back to the general day', async () => {
  const app = await bootApp({
    search: '?debug=1',
    profiles: [TEST_PROFILE],
    activeProfileId: TEST_PROFILE.id,
  });

  try {
    assert.equal(app.query('[data-debug-panel]').hidden, false);
    assert.match(app.text('[data-debug-content]'), /profilesCount: 1/);
    assert.match(app.text('[data-debug-content]'), /activeProfileName: Тест/);
    assert.match(app.text('[data-debug-content]'), /canCalculateHouses: yes/);
    assert.doesNotMatch(app.text('[data-debug-content]'), /not connected|Natal Engine Debug/);

    app.click(app.query('[data-profiles-toggle]'));
    app.click(app.query('[data-profile-select=""]'));

    assert.equal(app.text('[data-profile-current]'), 'Общий день');
    assert.equal(app.query('[data-personal-context-card]').hidden, true);
    assert.match(app.text('[data-debug-content]'), /activeProfileName: Общий день/);
  } finally {
    app.stop();
  }
});
