import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import {
  formatNatalPlanetList,
  formatNatalPlanetPosition,
  getNatalPlanetDisplayLimitations,
  isDisplayableNatalPlanet,
} from '../src/natalPlanetDisplay.js';

const sun = {
  key: 'sun',
  label: 'Солнце',
  longitude: 45.5,
  sign: { key: 'taurus', ru: 'Телец', symbol: '♉' },
  degree: 15,
  minutes: 30,
  retrograde: false,
  speed: 0.98,
  source: 'astronomy-engine',
};

test('formatNatalPlanetPosition formats direct planet position', () => {
  assert.deepEqual(formatNatalPlanetPosition(sun), {
    key: 'sun',
    label: 'Солнце',
    sign: 'Телец',
    symbol: '♉',
    degree: 15,
    minutes: 30,
    degreeText: '15°30′',
    retrogradeText: '',
    speedText: '0.98°/день',
    source: 'astronomy-engine',
    text: 'Солнце — Телец 15°30′',
  });
});

test('retrograde true adds R marker', () => {
  const mercury = formatNatalPlanetPosition({
    ...sun,
    key: 'mercury',
    label: 'Меркурий',
    retrograde: true,
    speed: -0.42,
  });

  assert.equal(mercury.retrogradeText, 'R');
  assert.equal(mercury.speedText, '-0.42°/день');
  assert.equal(mercury.text, 'Меркурий R — Телец 15°30′');
});

test('retrograde false or missing does not add marker', () => {
  assert.equal(formatNatalPlanetPosition({ ...sun, retrograde: false }).retrogradeText, '');
  assert.equal(formatNatalPlanetPosition({ ...sun, retrograde: null }).retrogradeText, '');
  assert.equal(formatNatalPlanetPosition({ ...sun, retrograde: undefined }).retrogradeText, '');
});

test('missing or invalid planet returns null', () => {
  assert.equal(formatNatalPlanetPosition(null), null);
  assert.equal(formatNatalPlanetPosition({ ...sun, label: '' }), null);
  assert.equal(formatNatalPlanetPosition({ ...sun, longitude: Number.NaN }), null);
  assert.equal(formatNatalPlanetPosition({ ...sun, sign: null }), null);
  assert.equal(formatNatalPlanetPosition({ ...sun, sign: { key: 'taurus' } }), null);
  assert.equal(formatNatalPlanetPosition({ ...sun, degree: 30 }), null);
  assert.equal(formatNatalPlanetPosition({ ...sun, minutes: 60 }), null);
  assert.equal(formatNatalPlanetPosition({ ...sun, source: '' }), null);
});

test('formatted output does not contain NaN undefined or null', () => {
  const formatted = formatNatalPlanetPosition({ ...sun, speed: Number.NaN });
  const text = JSON.stringify(formatted);

  assert.equal(text.includes('NaN'), false);
  assert.equal(text.includes('undefined'), false);
  assert.equal(text.includes('null'), false);
  assert.equal(formatted.speedText, '');
});

test('degree minutes are always two digits', () => {
  const formatted = formatNatalPlanetPosition({ ...sun, degree: 3, minutes: 5 });

  assert.equal(formatted.degreeText, '3°05′');
  assert.equal(formatted.text, 'Солнце — Телец 3°05′');
});

test('formatNatalPlanetList filters invalid items', () => {
  const formatted = formatNatalPlanetList([
    sun,
    null,
    { ...sun, longitude: Number.NaN },
    { ...sun, key: 'moon', label: 'Луна', degree: 3, minutes: 5 },
  ]);

  assert.deepEqual(formatted.map((planet) => planet.label), ['Солнце', 'Луна']);
});

test('empty list returns empty array', () => {
  assert.deepEqual(formatNatalPlanetList([]), []);
  assert.deepEqual(formatNatalPlanetList(null), []);
});

test('limitations include unsupported houses ASC MC transits aspects and orbs', () => {
  const limitations = getNatalPlanetDisplayLimitations();

  assert.equal(limitations.includes('Дома, ASC/MC и транзиты пока не рассчитываются.'), true);
  assert.equal(limitations.includes('Натальные аспекты и орбы будут добавлены отдельно.'), true);
});

test('isDisplayableNatalPlanet validates required display fields', () => {
  assert.equal(isDisplayableNatalPlanet(sun), true);
  assert.equal(isDisplayableNatalPlanet({ ...sun, key: '', label: '' }), false);
  assert.equal(isDisplayableNatalPlanet({ ...sun, longitude: Infinity }), false);
  assert.equal(isDisplayableNatalPlanet({ ...sun, sign: { ru: '' } }), false);
});

test('helper does not import provider modules or call astronomy-engine', () => {
  const source = readFileSync(new URL('../src/natalPlanetDisplay.js', import.meta.url), 'utf8');

  assert.equal(source.includes('astronomy-engine'), false);
  assert.equal(source.includes('astronomyEngineProvider'), false);
  assert.equal(source.includes('planetaryPositionProvider'), false);
  assert.equal(source.includes('calculateAstronomyEngine'), false);
  assert.equal(source.includes('localStorage'), false);
});

test('task does not wire formatter into UI files', () => {
  const appSource = readFileSync(new URL('../src/app.js', import.meta.url), 'utf8');
  const markup = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  const serviceWorker = readFileSync(new URL('../sw.js', import.meta.url), 'utf8');

  assert.equal(appSource.includes('natalPlanetDisplay'), false);
  assert.equal(markup.includes('Натальные планеты'), false);
  assert.equal(serviceWorker.includes('natalPlanetDisplay'), false);
});
