import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import {
  formatDecanResult,
  formatDegreeRulerResult,
  formatDetailedDignityList,
  formatDetailedDignityResult,
  formatTermResult,
  formatVronskyDegreeRulersResult,
  getDetailedDignityDisplayLimitations,
  isDisplayableDetailedDignityItem,
  summarizeDetailedDignities,
} from '../src/detailedDignityDisplay.js';

function readyTerm(overrides = {}) {
  return {
    status: 'ready',
    planetKey: 'mars',
    planetLabel: 'Марс',
    sign: 'aries',
    signRu: 'Овен',
    degreeWithinSign: 25.5,
    term: {
      ruler: 'saturn',
      rulerRu: 'Сатурн',
      value: 1,
      range: {
        startDegree: 25,
        printedEndDegree: 29,
        normalizedEndExclusive: 30,
      },
    },
    source: 'vronsky-table-5-terms',
    ...overrides,
  };
}

function readyDecan(overrides = {}) {
  return {
    status: 'ready',
    planetKey: 'mars',
    planetLabel: 'Марс',
    sign: 'aries',
    signRu: 'Овен',
    degreeWithinSign: 25.5,
    decan: {
      decanIndex: 3,
      ruler: 'venus',
      rulerRu: 'Венера',
      range: {
        startDegree: 20,
        endDegreeExclusive: 30,
      },
    },
    source: 'decans-star-of-magi-vronsky-fig-4-7',
    sourceSystem: 'star-of-magi-egyptian-tradition',
    ...overrides,
  };
}

function readyDegreeRuler(overrides = {}) {
  return {
    status: 'ready',
    planetKey: 'mars',
    planetLabel: 'Марс',
    sign: 'aries',
    signRu: 'Овен',
    degreeWithinSign: 25.5,
    degreeIndex: 25,
    degreeRuler: {
      ruler: 'saturn',
      rulerRu: 'Сатурн',
      degree: 25,
    },
    source: 'degree-rulers-star-of-magi-table-6',
    sourceSystem: 'star-of-magi-degree-rulers',
    ...overrides,
  };
}

function readyVronskyDegreeRulers(overrides = {}) {
  return {
    status: 'ready',
    planetKey: 'mars',
    planetLabel: 'Марс',
    sign: 'aries',
    signRu: 'Овен',
    degreeWithinSign: 0.5,
    degreeIndex: 0,
    sourceTokens: ['Mars', 'Pluto R'],
    degreeRulers: [
      {
        key: 'mars',
        rulerRu: 'Марс',
        retrograde: false,
        sourceToken: 'Mars',
      },
      {
        key: 'pluto',
        rulerRu: 'Плутон',
        retrograde: true,
        sourceToken: 'Pluto R',
      },
    ],
    source: 'degree-rulers-vronsky-table-7',
    sourceSystem: 'vronsky-degree-rulers',
    ...overrides,
  };
}

test('formatTermResult formats ready term result', () => {
  assert.deepEqual(formatTermResult(readyTerm()), {
    type: 'term',
    title: 'Терм',
    planet: 'Марс',
    text: 'Марс — терм Сатурна · +1',
    detail: 'Овен 25°–29°',
    source: 'Таблица 5',
  });
});

test('formatTermResult includes value with plus and minus', () => {
  assert.equal(formatTermResult(readyTerm())?.text, 'Марс — терм Сатурна · +1');
  assert.equal(
    formatTermResult(readyTerm({
      term: {
        ruler: 'mercury',
        rulerRu: 'Меркурий',
        value: -2,
        range: {
          startDegree: 14,
          printedEndDegree: 18,
          normalizedEndExclusive: 18,
        },
      },
      sign: 'pisces',
      signRu: 'Рыбы',
    }))?.text,
    'Марс — терм Меркурия · -2',
  );
});

test('formatDecanResult formats ready decan result', () => {
  assert.deepEqual(formatDecanResult(readyDecan()), {
    type: 'decan',
    title: 'Декан',
    planet: 'Марс',
    text: 'Марс — 3-й декан · Венера',
    detail: 'Овен 20°–30°',
    source: 'Звезда Магов',
  });
});

test('formatDegreeRulerResult formats ready degree ruler result', () => {
  assert.deepEqual(formatDegreeRulerResult(readyDegreeRuler()), {
    type: 'degreeRuler',
    title: 'Управитель градуса',
    planet: 'Марс',
    text: 'Марс — 25-й градус · Сатурн',
    detail: 'Овен',
    source: 'Таблица 6 / Звезда Магов',
  });
});

test('formatVronskyDegreeRulersResult formats single-ruler Table 7 result', () => {
  assert.deepEqual(formatVronskyDegreeRulersResult(readyVronskyDegreeRulers({
    degreeIndex: 1,
    degreeRulers: [
      {
        key: 'sun',
        rulerRu: 'Солнце',
        retrograde: false,
        sourceToken: 'Sun',
      },
    ],
  })), {
    type: 'vronskyDegreeRulers',
    title: 'Управители градуса по Вронскому',
    planet: 'Марс',
    text: 'Марс — 1-й градус · Солнце',
    detail: 'Овен',
    source: 'Таблица 7 / Вронский',
  });
});

test('formatVronskyDegreeRulersResult formats multi-ruler Table 7 result', () => {
  assert.deepEqual(formatVronskyDegreeRulersResult(readyVronskyDegreeRulers()), {
    type: 'vronskyDegreeRulers',
    title: 'Управители градуса по Вронскому',
    planet: 'Марс',
    text: 'Марс — 0-й градус · Марс, Плутон R',
    detail: 'Овен',
    source: 'Таблица 7 / Вронский',
  });
});

test('formatVronskyDegreeRulersResult preserves retrograde marker as R', () => {
  const formatted = formatVronskyDegreeRulersResult(readyVronskyDegreeRulers());

  assert.equal(formatted?.text.includes('Плутон R'), true);
  assert.equal(formatted?.text.includes('Pluto R'), false);
});

test('formatVronskyDegreeRulersResult supports outer planets Chiron and Proserpina', () => {
  const formatted = formatVronskyDegreeRulersResult(readyVronskyDegreeRulers({
    degreeIndex: 2,
    rulers: [
      { key: 'uranus', retrograde: false, sourceToken: 'Uranus' },
      { key: 'neptune', retrograde: true, sourceToken: 'Neptune R' },
      { key: 'chiron', retrograde: true, sourceToken: 'Chiron R' },
      { key: 'proserpina', retrograde: false, sourceToken: 'Proserpina' },
    ],
    degreeRulers: undefined,
    source: {
      sourceKey: 'degree-rulers-vronsky-table-7',
      sourceSystem: 'vronsky-degree-rulers',
    },
  }));

  assert.equal(formatted?.text, 'Марс — 2-й градус · Уран, Нептун R, Хирон R, Прозерпина');
});

test('dispatcher formats term decan and degree ruler results', () => {
  assert.equal(formatDetailedDignityResult(readyTerm())?.type, 'term');
  assert.equal(formatDetailedDignityResult(readyDecan())?.type, 'decan');
  assert.equal(formatDetailedDignityResult(readyDegreeRuler())?.type, 'degreeRuler');
});

test('dispatcher detects Table 7 Vronsky result', () => {
  assert.equal(formatDetailedDignityResult(readyVronskyDegreeRulers())?.type, 'vronskyDegreeRulers');
});

test('dispatcher does not confuse Table 7 result with Table 6 result', () => {
  assert.equal(formatDetailedDignityResult(readyDegreeRuler())?.source, 'Таблица 6 / Звезда Магов');
  assert.equal(formatDetailedDignityResult(readyVronskyDegreeRulers())?.source, 'Таблица 7 / Вронский');
});

test('invalid or incomplete result returns null', () => {
  assert.equal(formatTermResult(null), null);
  assert.equal(formatTermResult({ ...readyTerm(), status: 'invalid' }), null);
  assert.equal(formatDecanResult({ ...readyDecan(), planetLabel: '' }), null);
  assert.equal(formatDegreeRulerResult({ ...readyDegreeRuler(), degreeIndex: Number.NaN }), null);
  assert.equal(formatVronskyDegreeRulersResult({ ...readyVronskyDegreeRulers(), degreeRulers: [] }), null);
  assert.equal(formatDetailedDignityResult({ status: 'ready' }), null);
});

test('formatDetailedDignityList filters invalid items', () => {
  const result = formatDetailedDignityList([
    readyTerm(),
    null,
    { ...readyDecan(), status: 'invalid' },
    readyDegreeRuler(),
    readyVronskyDegreeRulers(),
  ]);

  assert.deepEqual(result.map((item) => item.type), ['term', 'degreeRuler', 'vronskyDegreeRulers']);
});

test('summary counts terms decans and degree rulers', () => {
  const items = formatDetailedDignityList([
    readyTerm(),
    readyDecan(),
    readyDegreeRuler(),
    readyVronskyDegreeRulers(),
  ]);

  assert.deepEqual(summarizeDetailedDignities(items), {
    total: 4,
    terms: 1,
    decans: 1,
    degreeRulers: 1,
    vronskyDegreeRulers: 1,
    text: 'Термы, деканы и управители градусов рассчитаны',
  });
});

test('summary handles partially available layers', () => {
  const items = formatDetailedDignityList([readyTerm(), readyDecan()]);

  assert.deepEqual(summarizeDetailedDignities(items), {
    total: 2,
    terms: 1,
    decans: 1,
    degreeRulers: 0,
    vronskyDegreeRulers: 0,
    text: 'Термы и деканы рассчитаны · управители градусов недоступны',
  });
});

test('limitations mention Table 6 and Table 7 are separate systems', () => {
  const limitations = getDetailedDignityDisplayLimitations();

  assert.equal(Array.isArray(limitations), true);
  assert.equal(limitations.some((item) => item.includes('Table 6') && item.includes('Table 7') && item.includes('разные системы')), true);
});

test('output contains no NaN or undefined', () => {
  const output = [
    ...formatDetailedDignityList([readyTerm(), readyDecan(), readyDegreeRuler()]),
    formatVronskyDegreeRulersResult(readyVronskyDegreeRulers()),
    summarizeDetailedDignities(formatDetailedDignityList([
      readyTerm(),
      readyDecan(),
      readyDegreeRuler(),
      readyVronskyDegreeRulers(),
    ])),
  ];
  const text = JSON.stringify(output);

  assert.equal(text.includes('NaN'), false);
  assert.equal(text.includes('undefined'), false);
});

test('output contains no private data raw longitude or profile JSON', () => {
  const output = formatDetailedDignityList([
    readyTerm({
      birthDate: '1990-01-01',
      birthTime: '12:00',
      longitude: 25.5,
      coordinates: { latitude: 1, longitude: 2 },
      profileJson: { name: 'Егор' },
    }),
    readyVronskyDegreeRulers({
      longitude: 0.5,
      birthDate: '1990-01-01',
      birthTime: '12:00',
      coordinates: { latitude: 1, longitude: 2 },
      profileJson: { name: 'Егор' },
    }),
  ]);
  const text = JSON.stringify(output);

  for (const forbidden of [
    'birthDate',
    'birthTime',
    'coordinates',
    'profileJson',
    'latitude',
    'longitude',
    '1990-01-01',
    '25.5',
  ]) {
    assert.equal(text.includes(forbidden), false, `${forbidden} should not be present`);
  }
});

test('output contains no interpretation or fatalistic words', () => {
  const text = JSON.stringify(formatDetailedDignityList([
    readyTerm(),
    readyDecan(),
    readyDegreeRuler(),
    readyVronskyDegreeRulers(),
  ]));

  for (const forbidden of [
    'плохой',
    'опасный',
    'фатально',
    'кармически',
    'судьбонос',
    'ритуал',
    'interpretation',
  ]) {
    assert.equal(text.includes(forbidden), false, `${forbidden} should not be present`);
  }
});

test('Table 6 output does not activate Table 7 source', () => {
  const text = JSON.stringify(formatDetailedDignityList([readyDegreeRuler()]));

  assert.equal(text.includes('Table 7'), false);
  assert.equal(text.includes('Таблица 7'), false);
  assert.equal(text.includes('vronsky-degree-rulers'), false);
});

test('Table 7 output does not expose technical source tokens or source keys', () => {
  const text = JSON.stringify(formatDetailedDignityList([readyVronskyDegreeRulers()]));

  assert.equal(text.includes('Mars'), false);
  assert.equal(text.includes('Pluto R'), false);
  assert.equal(text.includes('degree-rulers-vronsky-table-7'), false);
  assert.equal(text.includes('vronsky-degree-rulers'), false);
});

test('isDisplayableDetailedDignityItem validates safe formatted items', () => {
  assert.equal(isDisplayableDetailedDignityItem(formatTermResult(readyTerm())), true);
  assert.equal(isDisplayableDetailedDignityItem({ type: 'term', text: 'NaN' }), false);
  assert.equal(isDisplayableDetailedDignityItem({ type: 'unknown', text: 'Марс', title: 'x', planet: 'Марс' }), false);
});

test('helper does not import lookup engines provider modules profileStorage or astronomy-engine', () => {
  const source = readFileSync(new URL('../src/detailedDignityDisplay.js', import.meta.url), 'utf8');

  for (const forbidden of [
    './terms.js',
    './decans.js',
    './degreeRulersStarOfMagi.js',
    './degreeRulersVronsky.js',
    './termsData.js',
    './decansData.js',
    './degreeRulersStarOfMagiData.js',
    './degreeRulersVronskyData.js',
    'lookupTerm',
    'lookupDecan',
    'lookupDegreeRuler',
    'lookupVronskyDegreeRulers',
    'astronomyEngineProvider',
    'profileStorage',
    'provider',
    'astronomy-engine',
    'getDegreeInSign',
    'getZodiacSign',
  ]) {
    assert.equal(source.includes(forbidden), false, `${forbidden} should not be imported or called`);
  }
});
