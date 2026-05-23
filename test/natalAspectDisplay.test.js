import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import {
  formatNatalAspect,
  formatNatalAspectList,
  getNatalAspectDisplayLimitations,
  isDisplayableNatalAspect,
  summarizeNatalAspects,
} from '../src/natalAspectDisplay.js';

function aspect(overrides = {}) {
  return {
    bodyA: { key: 'sun', label: 'Солнце' },
    bodyB: { key: 'moon', label: 'Луна' },
    aspect: {
      key: 'square',
      ru: 'квадрат',
      symbol: '□',
      exactAngle: 90,
    },
    angle: 92.25,
    orb: 2.25,
    orbText: '2°15′',
    allowedOrb: 7,
    strength: 'strong',
    applying: null,
    separating: null,
    source: 'natal-aspect-engine',
    ...overrides,
  };
}

test('formatNatalAspect formats square', () => {
  const formatted = formatNatalAspect(aspect());

  assert.equal(formatted.bodyA, 'Солнце');
  assert.equal(formatted.bodyB, 'Луна');
  assert.equal(formatted.aspect, 'квадрат');
  assert.equal(formatted.symbol, '□');
  assert.equal(formatted.orbText, '2°15′');
  assert.equal(formatted.strength, 'strong');
  assert.equal(formatted.text, 'Солнце □ Луна · орб 2°15′');
});

test('formatNatalAspect formats trine', () => {
  const formatted = formatNatalAspect(aspect({
    bodyA: { key: 'venus', label: 'Венера' },
    bodyB: { key: 'mars', label: 'Марс' },
    aspect: {
      key: 'trine',
      ru: 'трин',
      symbol: '△',
      exactAngle: 120,
    },
    orb: 1.066666,
    orbText: '1°04′',
    strength: 'strong',
  }));

  assert.equal(formatted.text, 'Венера △ Марс · орб 1°04′');
});

test('formatNatalAspect uses orbText', () => {
  const formatted = formatNatalAspect(aspect({
    orb: 2.249999,
    orbText: '2°15′',
  }));

  assert.equal(formatted.orbText, '2°15′');
  assert.equal(formatted.text, 'Солнце □ Луна · орб 2°15′');
});

test('formatNatalAspect formats orb if orbText missing', () => {
  const formatted = formatNatalAspect(aspect({
    orb: 1.999,
    orbText: '',
  }));

  assert.equal(formatted.orbText, '1°59′');
  assert.equal(formatted.text, 'Солнце □ Луна · орб 1°59′');
});

test('formatNatalAspect falls back to Russian aspect name when symbol is missing', () => {
  const formatted = formatNatalAspect(aspect({
    aspect: {
      key: 'opposition',
      ru: 'оппозиция',
      symbol: '',
      exactAngle: 180,
    },
  }));

  assert.equal(formatted.symbol, 'оппозиция');
  assert.equal(formatted.text, 'Солнце оппозиция Луна · орб 2°15′');
});

test('invalid aspect returns null', () => {
  assert.equal(formatNatalAspect(null), null);
  assert.equal(formatNatalAspect(aspect({ bodyA: { key: 'sun', label: '' } })), null);
  assert.equal(formatNatalAspect(aspect({ aspect: { key: 'quincunx', ru: 'квинконс', symbol: '⚻' } })), null);
  assert.equal(formatNatalAspect(aspect({ orb: Number.NaN, orbText: '' })), null);
});

test('formatted output does not contain NaN or undefined', () => {
  const formatted = formatNatalAspect(aspect({ orb: 0, orbText: '' }));
  const text = JSON.stringify(formatted);

  assert.equal(text.includes('NaN'), false);
  assert.equal(text.includes('undefined'), false);
});

test('formatNatalAspectList filters invalid items', () => {
  const formatted = formatNatalAspectList([
    aspect(),
    null,
    aspect({ aspect: { key: 'unknown', ru: 'unknown', symbol: '?' } }),
    aspect({
      bodyA: { key: 'venus', label: 'Венера' },
      bodyB: { key: 'mars', label: 'Марс' },
      aspect: { key: 'trine', ru: 'трин', symbol: '△' },
      orb: 1,
      orbText: '1°00′',
    }),
  ]);

  assert.deepEqual(formatted.map((item) => item.text), [
    'Солнце □ Луна · орб 2°15′',
    'Венера △ Марс · орб 1°00′',
  ]);
});

test('empty list returns empty array', () => {
  assert.deepEqual(formatNatalAspectList([]), []);
  assert.deepEqual(formatNatalAspectList(null), []);
});

test('summarizeNatalAspects returns total count', () => {
  const summary = summarizeNatalAspects([aspect(), aspect({
    aspect: { key: 'trine', ru: 'трин', symbol: '△' },
  })]);

  assert.equal(summary.total, 2);
});

test('summarizeNatalAspects counts tense aspects', () => {
  const summary = summarizeNatalAspects([
    aspect({ aspect: { key: 'square', ru: 'квадрат', symbol: '□' } }),
    aspect({ aspect: { key: 'opposition', ru: 'оппозиция', symbol: '☍' } }),
    aspect({ aspect: { key: 'conjunction', ru: 'соединение', symbol: '☌' } }),
  ]);

  assert.equal(summary.tense, 2);
  assert.equal(summary.conjunctions, 1);
});

test('summarizeNatalAspects counts harmonious aspects', () => {
  const summary = summarizeNatalAspects([
    aspect({ aspect: { key: 'trine', ru: 'трин', symbol: '△' } }),
    aspect({ aspect: { key: 'sextile', ru: 'секстиль', symbol: '✶' } }),
  ]);

  assert.equal(summary.harmonious, 2);
});

test('summarizeNatalAspects counts conjunctions separately', () => {
  const summary = summarizeNatalAspects([
    aspect({ aspect: { key: 'conjunction', ru: 'соединение', symbol: '☌' } }),
  ]);

  assert.equal(summary.total, 1);
  assert.equal(summary.tense, 0);
  assert.equal(summary.harmonious, 0);
  assert.equal(summary.conjunctions, 1);
  assert.equal(summary.text, '1 аспект · 1 соед.');
});

test('summarizeNatalAspects uses compact collapsed UI text', () => {
  const summary = summarizeNatalAspects([
    ...Array.from({ length: 3 }, () => aspect({ aspect: { key: 'square', ru: 'квадрат', symbol: '□' } })),
    ...Array.from({ length: 5 }, () => aspect({ aspect: { key: 'trine', ru: 'трин', symbol: '△' } })),
    ...Array.from({ length: 4 }, () => aspect({ aspect: { key: 'conjunction', ru: 'соединение', symbol: '☌' } })),
  ]);

  assert.equal(summary.total, 12);
  assert.equal(summary.tense, 3);
  assert.equal(summary.harmonious, 5);
  assert.equal(summary.conjunctions, 4);
  assert.equal(summary.text, '12 аспектов · 3 напряж. · 5 гармонич. · 4 соед.');
  assert.equal(summary.text.includes('найдено'), false);
  assert.equal(summary.text.includes('напряженных'), false);
});

test('summarizeNatalAspects returns empty-state text', () => {
  const summary = summarizeNatalAspects([]);

  assert.deepEqual(summary, {
    total: 0,
    tense: 0,
    harmonious: 0,
    conjunctions: 0,
    text: 'Мажорные аспекты в заданном орбе не найдены.',
  });
});

test('getNatalAspectDisplayLimitations includes not transits limitation', () => {
  const limitations = getNatalAspectDisplayLimitations();

  assert.equal(limitations.some((text) => text.includes('не транзиты')), true);
  assert.equal(limitations.some((text) => text.includes('ASC/MC')), true);
});

test('formatted output does not contain private or technical data', () => {
  const formatted = formatNatalAspect(aspect({
    birthDate: '1990-01-01',
    birthTime: '12:00',
    coordinates: { latitude: 1, longitude: 2 },
    profile: { name: 'Private' },
  }));
  const text = JSON.stringify(formatted);

  assert.equal(text.includes('birthDate'), false);
  assert.equal(text.includes('birthTime'), false);
  assert.equal(text.includes('coordinates'), false);
  assert.equal(text.includes('profile'), false);
  assert.equal(text.includes('angle'), false);
  assert.equal(text.includes('allowedOrb'), false);
  assert.equal(text.includes('source'), false);
});

test('formatted output does not contain transit wording except limitations', () => {
  const formatted = formatNatalAspect(aspect());
  const formattedText = JSON.stringify(formatted).toLowerCase();
  const limitationText = getNatalAspectDisplayLimitations().join(' ').toLowerCase();

  assert.equal(formattedText.includes('transit'), false);
  assert.equal(formattedText.includes('транзит'), false);
  assert.equal(limitationText.includes('транзиты'), true);
});

test('isDisplayableNatalAspect validates required display fields', () => {
  assert.equal(isDisplayableNatalAspect(aspect()), true);
  assert.equal(isDisplayableNatalAspect(aspect({ orbText: '', orb: 1 })), true);
  assert.equal(isDisplayableNatalAspect(aspect({ bodyB: { key: 'moon', label: '' } })), false);
  assert.equal(isDisplayableNatalAspect(aspect({ aspect: { key: 'minor', ru: 'minor', symbol: '*' } })), false);
  assert.equal(isDisplayableNatalAspect(aspect({ orbText: '', orb: Number.NaN })), false);
});

test('helper does not import provider profile storage or calculate aspects', () => {
  const source = readFileSync(new URL('../src/natalAspectDisplay.js', import.meta.url), 'utf8');

  assert.equal(source.includes('calculateNatalAspects'), false);
  assert.equal(source.includes('calculateNatalAspectBetween'), false);
  assert.equal(source.includes('astronomy-engine'), false);
  assert.equal(source.includes('astronomyEngineProvider'), false);
  assert.equal(source.includes('profileStorage'), false);
  assert.equal(source.includes('localStorage'), false);
  assert.equal(source.includes('document.'), false);
});
