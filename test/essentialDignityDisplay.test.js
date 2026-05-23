import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import {
  formatEssentialDignity,
  formatEssentialDignityList,
  getEssentialDignityDisplayLimitations,
  isDisplayableEssentialDignity,
  summarizeEssentialDignities,
} from '../src/essentialDignityDisplay.js';

const EMPTY_DIGNITIES = Object.freeze({
  domicile: false,
  detriment: false,
  exaltation: false,
  fall: false,
  modernRulership: false,
});

function dignityResult(overrides = {}) {
  return {
    planetKey: 'mars',
    planetLabel: 'Марс',
    signKey: 'aries',
    signLabel: 'Овен',
    dignities: { ...EMPTY_DIGNITIES },
    score: 0,
    labels: [],
    modernLabels: [],
    source: 'essential-dignities-v1',
    ...overrides,
  };
}

test('formatEssentialDignity formats domicile', () => {
  const formatted = formatEssentialDignity(dignityResult({
    dignities: { ...EMPTY_DIGNITIES, domicile: true },
    score: 5,
    labels: ['обитель'],
  }));

  assert.deepEqual(formatted, {
    planet: 'Марс',
    sign: 'Овен',
    labels: ['обитель'],
    modernLabels: [],
    score: 5,
    scoreText: '+5',
    type: 'dignified',
    text: 'Марс в Овне — обитель',
  });
});

test('formatEssentialDignity formats exaltation', () => {
  const formatted = formatEssentialDignity(dignityResult({
    planetKey: 'venus',
    planetLabel: 'Венера',
    signKey: 'pisces',
    signLabel: 'Рыбы',
    dignities: { ...EMPTY_DIGNITIES, exaltation: true },
    score: 4,
    labels: ['экзальтация'],
  }));

  assert.equal(formatted.text, 'Венера в Рыбах — экзальтация');
  assert.equal(formatted.scoreText, '+4');
  assert.equal(formatted.type, 'dignified');
});

test('formatEssentialDignity formats detriment', () => {
  const formatted = formatEssentialDignity(dignityResult({
    signKey: 'libra',
    signLabel: 'Весы',
    dignities: { ...EMPTY_DIGNITIES, detriment: true },
    score: -5,
    labels: ['изгнание'],
  }));

  assert.equal(formatted.text, 'Марс в Весах — изгнание');
  assert.equal(formatted.scoreText, '-5');
  assert.equal(formatted.type, 'debilitated');
});

test('formatEssentialDignity formats fall', () => {
  const formatted = formatEssentialDignity(dignityResult({
    planetKey: 'venus',
    planetLabel: 'Венера',
    signKey: 'virgo',
    signLabel: 'Дева',
    dignities: { ...EMPTY_DIGNITIES, fall: true },
    score: -4,
    labels: ['падение'],
  }));

  assert.equal(formatted.text, 'Венера в Деве — падение');
  assert.equal(formatted.type, 'debilitated');
});

test('formatEssentialDignity formats multiple flags', () => {
  const formatted = formatEssentialDignity(dignityResult({
    planetKey: 'mercury',
    planetLabel: 'Меркурий',
    signKey: 'virgo',
    signLabel: 'Дева',
    dignities: { ...EMPTY_DIGNITIES, domicile: true, exaltation: true },
    score: 9,
    labels: ['обитель', 'экзальтация'],
  }));

  assert.equal(formatted.text, 'Меркурий в Деве — обитель, экзальтация');
  assert.equal(formatted.scoreText, '+9');
  assert.equal(formatted.type, 'dignified');
});

test('formatEssentialDignity formats modern rulership as label-only', () => {
  const formatted = formatEssentialDignity(dignityResult({
    planetKey: 'uranus',
    planetLabel: 'Уран',
    signKey: 'aquarius',
    signLabel: 'Водолей',
    dignities: { ...EMPTY_DIGNITIES, modernRulership: true },
    modernLabels: ['современное управление'],
  }));

  assert.equal(formatted.text, 'Уран в Водолее — современное управление');
  assert.equal(formatted.scoreText, '0');
  assert.equal(formatted.type, 'modern');
  assert.deepEqual(formatted.labels, []);
  assert.deepEqual(formatted.modernLabels, ['современное управление']);
});

test('formatEssentialDignity formats neutral', () => {
  const formatted = formatEssentialDignity(dignityResult({
    signKey: 'gemini',
    signLabel: 'Близнецы',
  }));

  assert.equal(formatted.text, 'Марс в Близнецах — нейтрально');
  assert.equal(formatted.scoreText, '0');
  assert.equal(formatted.type, 'neutral');
});

test('scoreText includes plus for positive score', () => {
  assert.equal(formatEssentialDignity(dignityResult({
    dignities: { ...EMPTY_DIGNITIES, exaltation: true },
    score: 4,
    labels: ['экзальтация'],
  })).scoreText, '+4');
});

test('invalid result returns null', () => {
  assert.equal(formatEssentialDignity(null), null);
  assert.equal(formatEssentialDignity(dignityResult({ planetLabel: '' })), null);
  assert.equal(formatEssentialDignity(dignityResult({ signLabel: '' })), null);
  assert.equal(formatEssentialDignity(dignityResult({ dignities: null })), null);
  assert.equal(formatEssentialDignity(dignityResult({ score: Number.NaN })), null);
  assert.equal(formatEssentialDignity(dignityResult({ labels: null })), null);
  assert.equal(formatEssentialDignity(dignityResult({ modernLabels: null })), null);
});

test('formatted output does not contain NaN or undefined', () => {
  const output = JSON.stringify([
    formatEssentialDignity(dignityResult({
      dignities: { ...EMPTY_DIGNITIES, domicile: true },
      score: 5,
      labels: ['обитель'],
    })),
    summarizeEssentialDignities([dignityResult()]),
  ]);

  assert.equal(output.includes('NaN'), false);
  assert.equal(output.includes('undefined'), false);
});

test('formatEssentialDignityList filters invalid items', () => {
  const list = formatEssentialDignityList([
    dignityResult({ labels: null }),
    dignityResult({
      dignities: { ...EMPTY_DIGNITIES, domicile: true },
      score: 5,
      labels: ['обитель'],
    }),
    null,
  ]);

  assert.equal(list.length, 1);
  assert.equal(list[0].text, 'Марс в Овне — обитель');
});

test('empty list returns empty array', () => {
  assert.deepEqual(formatEssentialDignityList([]), []);
  assert.deepEqual(formatEssentialDignityList(null), []);
});

test('summarizeEssentialDignities returns total count and category counts', () => {
  const summary = summarizeEssentialDignities([
    dignityResult({
      dignities: { ...EMPTY_DIGNITIES, domicile: true },
      score: 5,
      labels: ['обитель'],
    }),
    dignityResult({
      signKey: 'libra',
      signLabel: 'Весы',
      dignities: { ...EMPTY_DIGNITIES, detriment: true },
      score: -5,
      labels: ['изгнание'],
    }),
    dignityResult({
      planetKey: 'uranus',
      planetLabel: 'Уран',
      signKey: 'aquarius',
      signLabel: 'Водолей',
      dignities: { ...EMPTY_DIGNITIES, modernRulership: true },
      modernLabels: ['современное управление'],
    }),
    dignityResult({ signKey: 'gemini', signLabel: 'Близнецы' }),
  ]);

  assert.equal(summary.total, 4);
  assert.equal(summary.dignified, 1);
  assert.equal(summary.debilitated, 1);
  assert.equal(summary.modern, 1);
  assert.equal(summary.neutral, 1);
  assert.equal(summary.scoreTotal, 0);
  assert.equal(summary.text, '1 достоинство · 1 слабость');
});

test('summarizeEssentialDignities counts dignified debilitated and modern separately', () => {
  const summary = summarizeEssentialDignities([
    dignityResult({
      dignities: { ...EMPTY_DIGNITIES, exaltation: true },
      score: 4,
      labels: ['экзальтация'],
    }),
    dignityResult({
      signKey: 'cancer',
      signLabel: 'Рак',
      dignities: { ...EMPTY_DIGNITIES, fall: true },
      score: -4,
      labels: ['падение'],
    }),
    dignityResult({
      planetKey: 'pluto',
      planetLabel: 'Плутон',
      signKey: 'scorpio',
      signLabel: 'Скорпион',
      dignities: { ...EMPTY_DIGNITIES, modernRulership: true },
      modernLabels: ['современное управление'],
    }),
  ]);

  assert.equal(summary.dignified, 1);
  assert.equal(summary.debilitated, 1);
  assert.equal(summary.modern, 1);
});

test('summarizeEssentialDignities returns empty and neutral-state text', () => {
  assert.equal(
    summarizeEssentialDignities([]).text,
    'Базовые достоинства не рассчитаны.',
  );
  assert.equal(
    summarizeEssentialDignities([dignityResult({ signKey: 'gemini', signLabel: 'Близнецы' })]).text,
    'Ярко выраженных базовых достоинств или слабостей не найдено.',
  );
});

test('getEssentialDignityDisplayLimitations mentions deferred terms and decans', () => {
  const limitations = getEssentialDignityDisplayLimitations();

  assert.equal(limitations.some((item) => item.includes('термов')), true);
  assert.equal(limitations.some((item) => item.includes('деканов')), true);
  assert.equal(limitations.some((item) => item.includes('Вронского')), true);
});

test('formatted output does not contain private data or active future source-pack values', () => {
  const text = JSON.stringify(formatEssentialDignityList([
    dignityResult({
      dignities: { ...EMPTY_DIGNITIES, domicile: true },
      score: 5,
      labels: ['обитель'],
    }),
  ]));

  assert.equal(text.includes('birthDate'), false);
  assert.equal(text.includes('birthTime'), false);
  assert.equal(text.includes('coordinates'), false);
  assert.equal(text.includes('profile'), false);
  assert.equal(text.includes('terms'), false);
  assert.equal(text.includes('decans'), false);
  assert.equal(text.includes('degreeRulers'), false);
  assert.equal(text.includes('VronskyStrengthTables'), false);
});

test('formatted output does not contain interpretation or fatalistic words', () => {
  const text = JSON.stringify(formatEssentialDignityList([
    dignityResult({
      signKey: 'libra',
      signLabel: 'Весы',
      dignities: { ...EMPTY_DIGNITIES, detriment: true },
      score: -5,
      labels: ['изгнание'],
    }),
  ]));

  for (const forbidden of ['плох', 'разруш', 'судьбонос', 'кармически', 'опас', 'interpretation', 'ритуал']) {
    assert.equal(text.includes(forbidden), false);
  }
});

test('isDisplayableEssentialDignity validates required display fields', () => {
  assert.equal(isDisplayableEssentialDignity(dignityResult()), true);
  assert.equal(isDisplayableEssentialDignity(dignityResult({ planetLabel: '' })), false);
  assert.equal(isDisplayableEssentialDignity(dignityResult({ signLabel: '' })), false);
  assert.equal(isDisplayableEssentialDignity(dignityResult({ score: Infinity })), false);
});

test('helper does not import provider profile storage or calculate dignity', () => {
  const source = readFileSync(new URL('../src/essentialDignityDisplay.js', import.meta.url), 'utf8');

  assert.equal(source.includes('astronomy-engine'), false);
  assert.equal(source.includes('astronomyEngineProvider'), false);
  assert.equal(source.includes('planetaryPositionProvider'), false);
  assert.equal(source.includes('profileStorage'), false);
  assert.equal(source.includes('localStorage'), false);
  assert.equal(source.includes('document.'), false);
  assert.equal(source.includes('window.'), false);
  assert.equal(source.includes('evaluateEssentialDignity'), false);
  assert.equal(source.includes('evaluateEssentialDignities'), false);
  assert.equal(source.includes('essentialDignities.js'), false);
});
