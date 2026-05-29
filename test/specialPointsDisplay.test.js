import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

import {
  formatLilithDisplay,
  formatLunarNodesDisplay,
  formatSelenaDisplay,
  formatSpecialPointHouseAssignment,
  formatSpecialPointList,
  formatSpecialPointResult,
  formatSpecialPointWithHouse,
  formatSpecialPointsResult,
  getSpecialPointsDisplayLimitations,
  isDisplayableSpecialPointItem,
  summarizeSpecialPointsDisplay,
} from '../src/specialPointsDisplay.js';

const MODULE_PATH = path.resolve('src/specialPointsDisplay.js');

const NORTH_NODE = {
  key: 'north-node',
  label: 'Северный узел',
  labelEn: 'North Node',
  longitude: 123.456789,
  sign: { key: 'leo', ru: 'Лев', symbol: '♌' },
  degree: 3,
  minutes: 12,
  seconds: 44,
  text: 'Северный узел — Лев 03°12′44″',
  sourceSystem: 'mean-lunar-node',
};

const SOUTH_NODE = {
  key: 'south-node',
  label: 'Южный узел',
  labelEn: 'South Node',
  longitude: 303.456789,
  sign: { key: 'aquarius', ru: 'Водолей', symbol: '♒' },
  degree: 3,
  minutes: 12,
  seconds: 44,
  text: 'Южный узел — Водолей 03°12′44″',
  sourceSystem: 'mean-lunar-node',
};

const LILITH_POINT = {
  key: 'lilith',
  label: 'Лилит',
  labelVariant: 'Средняя Лилит',
  labelEn: 'Black Moon Lilith',
  variantEn: 'Mean Lunar Apogee',
  longitude: 228.369444,
  sign: { key: 'scorpio', ru: 'Скорпион', symbol: '♏' },
  degree: 18,
  minutes: 22,
  seconds: 10,
  text: 'Лилит / Средняя Лилит — Скорпион 18°22′10″',
  sourceSystem: 'mean-black-moon-lilith',
};

const SELENA_POINT = {
  key: 'selena',
  label: 'Селена',
  labelVariant: 'Белая Луна',
  labelEn: 'Selena',
  variantEn: 'White Moon',
  longitude: 94.197778,
  sign: { key: 'cancer', ru: 'Рак', symbol: '♋' },
  degree: 4,
  minutes: 11,
  seconds: 52,
  text: 'Селена / Белая Луна — Рак 04°11′52″',
  sourceSystem: 'selena-white-moon',
  pointType: 'fictitious-calculated-point',
};

const NODES_RESULT = {
  status: 'ready',
  ready: true,
  nodes: {
    north: NORTH_NODE,
    south: SOUTH_NODE,
  },
  limitations: ['Лунные узлы рассчитаны как mean lunar node.'],
};

const NODES_ASSIGNMENT_RESULT = {
  status: 'ready',
  ready: true,
  assignments: {
    north: {
      status: 'ready',
      ready: true,
      key: 'north-node',
      label: 'Северный узел',
      houseNumber: 7,
      houseLabel: '7 дом',
      text: 'Северный узел — 7 дом',
    },
    south: {
      status: 'ready',
      ready: true,
      key: 'south-node',
      label: 'Южный узел',
      houseNumber: 1,
      houseLabel: '1 дом',
      text: 'Южный узел — 1 дом',
    },
  },
};

const LILITH_RESULT = {
  status: 'ready',
  ready: true,
  lilith: LILITH_POINT,
  limitations: ['В Sprint 13 активна только Средняя Лилит.'],
};

const SELENA_RESULT = {
  status: 'ready',
  ready: true,
  selena: SELENA_POINT,
  limitations: [
    'Селена рассчитывается как фиктивная / гипотетическая точка по выбранной модели Swiss Ephemeris.',
  ],
};

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function stringify(value) {
  return JSON.stringify(value);
}

function assertSafeDisplayOutput(value) {
  const output = stringify(value);
  const forbidden = [
    'birthDate',
    'birthTime',
    'utcDateTime',
    'timezone',
    'coordinates',
    'birthPlace',
    'latitude',
    'longitude',
    'providerPayload',
    'fullProfileJson',
    'sourceArray',
    'operands',
    'NaN',
    'undefined',
    'карми',
    'фаталь',
    'ангел',
    'судьб',
    'ритуал',
  ];

  for (const term of forbidden) {
    assert.equal(output.includes(term), false, `output must not include ${term}`);
  }

  assert.equal(/\b\d{1,3}\.\d{4,}\b/.test(output), false, 'output must not include raw decimal longitudes');
}

test('formatSpecialPointResult formats North Node', () => {
  assert.deepEqual(formatSpecialPointResult(NORTH_NODE), {
    type: 'specialPoint',
    key: 'north-node',
    label: 'Северный узел',
    text: 'Северный узел — Лев 03°12′44″',
    sourceSystem: 'mean-lunar-node',
    pointType: null,
  });
});

test('formatSpecialPointResult formats South Node', () => {
  const result = formatSpecialPointResult(SOUTH_NODE);
  assert.equal(result.key, 'south-node');
  assert.equal(result.text, 'Южный узел — Водолей 03°12′44″');
});

test('formatSpecialPointResult formats Lilith / Mean Lilith', () => {
  const result = formatSpecialPointResult(LILITH_POINT);
  assert.equal(result.key, 'lilith');
  assert.equal(result.text, 'Лилит / Средняя Лилит — Скорпион 18°22′10″');
});

test('formatSpecialPointResult formats Selena / White Moon', () => {
  const result = formatSpecialPointResult(SELENA_POINT);
  assert.equal(result.key, 'selena');
  assert.equal(result.text, 'Селена / Белая Луна — Рак 04°11′52″');
  assert.equal(result.pointType, 'fictitious-calculated-point');
});

test('formatSpecialPointResult includes seconds when building fallback text', () => {
  const result = formatSpecialPointResult({
    ...NORTH_NODE,
    text: null,
  });

  assert.equal(result.text, 'Северный узел — Лев 03°12′44″');
});

test('formatSpecialPointResult returns null for invalid point', () => {
  assert.equal(formatSpecialPointResult(null), null);
  assert.equal(formatSpecialPointResult({ key: 'north-node', label: 'Северный узел' }), null);
});

test('formatSpecialPointList preserves order', () => {
  const result = formatSpecialPointList([NORTH_NODE, SOUTH_NODE, LILITH_POINT, SELENA_POINT]);
  assert.deepEqual(
    result.map((item) => item.key),
    ['north-node', 'south-node', 'lilith', 'selena'],
  );
});

test('formatSpecialPointHouseAssignment formats node house assignment', () => {
  assert.deepEqual(formatSpecialPointHouseAssignment(NODES_ASSIGNMENT_RESULT.assignments.north), {
    type: 'specialPointHouseAssignment',
    key: 'north-node',
    label: 'Северный узел',
    houseNumber: 7,
    text: 'Северный узел — 7 дом',
  });
});

test('formatSpecialPointHouseAssignment returns null for invalid assignment', () => {
  assert.equal(formatSpecialPointHouseAssignment({ status: 'notReady', ready: false }), null);
  assert.equal(formatSpecialPointHouseAssignment({ key: 'north-node', houseNumber: null }), null);
});

test('formatSpecialPointWithHouse combines position and house', () => {
  assert.deepEqual(formatSpecialPointWithHouse(NORTH_NODE, NODES_ASSIGNMENT_RESULT.assignments.north), {
    type: 'specialPointWithHouse',
    key: 'north-node',
    label: 'Северный узел',
    text: 'Северный узел — Лев 03°12′44″ · 7 дом',
    houseNumber: 7,
  });
});

test('formatSpecialPointWithHouse returns position only when assignment missing', () => {
  assert.deepEqual(formatSpecialPointWithHouse(NORTH_NODE, null), {
    type: 'specialPointWithHouse',
    key: 'north-node',
    label: 'Северный узел',
    text: 'Северный узел — Лев 03°12′44″',
    houseNumber: null,
  });
});

test('formatLunarNodesDisplay formats nodes and assignments', () => {
  const result = formatLunarNodesDisplay(NODES_RESULT, NODES_ASSIGNMENT_RESULT);
  assert.equal(result.status, 'ready');
  assert.deepEqual(
    result.items.map((item) => item.text),
    [
      'Северный узел — Лев 03°12′44″ · 7 дом',
      'Южный узел — Водолей 03°12′44″ · 1 дом',
    ],
  );
});

test('formatLunarNodesDisplay returns safe fallback', () => {
  assert.deepEqual(formatLunarNodesDisplay({ status: 'notReady', ready: false }), {
    status: 'notReady',
    ready: false,
    section: 'lunarNodes',
    title: 'Лунные узлы',
    items: [],
    message: 'Лунные узлы пока недоступны.',
    limitations: [],
  });
});

test('formatLilithDisplay formats Mean Lilith', () => {
  const result = formatLilithDisplay(LILITH_RESULT);
  assert.equal(result.status, 'ready');
  assert.equal(result.items[0].text, 'Лилит / Средняя Лилит — Скорпион 18°22′10″');
});

test('formatLilithDisplay returns safe fallback', () => {
  const result = formatLilithDisplay({ status: 'notReady', ready: false });
  assert.equal(result.status, 'notReady');
  assert.equal(result.message, 'Лилит пока недоступна.');
  assert.deepEqual(result.items, []);
});

test('formatSelenaDisplay formats Selena', () => {
  const result = formatSelenaDisplay(SELENA_RESULT);
  assert.equal(result.status, 'ready');
  assert.equal(result.items[0].text, 'Селена / Белая Луна — Рак 04°11′52″');
});

test('formatSelenaDisplay includes safe fictitious/hypothetical note', () => {
  const result = formatSelenaDisplay(SELENA_RESULT);
  assert.ok(result.limitations.some((text) => text.includes('фиктивная / гипотетическая точка')));
});

test('formatSelenaDisplay returns safe fallback', () => {
  const result = formatSelenaDisplay({ status: 'notReady', ready: false });
  assert.equal(result.status, 'notReady');
  assert.equal(result.message, 'Селена пока недоступна.');
  assert.deepEqual(result.items, []);
});

test('formatSpecialPointsResult combines nodes, Lilith, Selena', () => {
  const result = formatSpecialPointsResult({
    lunarNodesResult: NODES_RESULT,
    lunarNodesAssignmentResult: NODES_ASSIGNMENT_RESULT,
    lilithResult: LILITH_RESULT,
    selenaResult: SELENA_RESULT,
  });

  assert.equal(result.status, 'ready');
  assert.equal(result.title, 'Особые точки карты');
  assert.equal(result.summary, '4 точки рассчитаны');
  assert.deepEqual(
    result.items.map((item) => item.key),
    ['north-node', 'south-node', 'lilith', 'selena'],
  );
  assert.equal(result.sections.length, 3);
});

test('formatSpecialPointsResult handles partial readiness safely', () => {
  const result = formatSpecialPointsResult({
    lunarNodesResult: NODES_RESULT,
    lilithResult: { status: 'notReady', ready: false },
    selenaResult: null,
  });

  assert.equal(result.status, 'ready');
  assert.equal(result.summary, '2 точки рассчитаны');
  assert.deepEqual(
    result.items.map((item) => item.key),
    ['north-node', 'south-node'],
  );
});

test('summarizeSpecialPointsDisplay counts ready items', () => {
  const display = formatSpecialPointsResult({
    lunarNodesResult: NODES_RESULT,
    lunarNodesAssignmentResult: NODES_ASSIGNMENT_RESULT,
    lilithResult: LILITH_RESULT,
    selenaResult: SELENA_RESULT,
  });

  assert.deepEqual(summarizeSpecialPointsDisplay(display), {
    status: 'ready',
    text: 'Особые точки рассчитаны',
    count: 4,
    sectionsReady: 3,
  });
});

test('getSpecialPointsDisplayLimitations mentions active mean nodes, Mean Lilith and Selena', () => {
  const limitations = getSpecialPointsDisplayLimitations();
  assert.ok(limitations.some((text) => text.includes('mean Lunar Nodes')));
  assert.ok(limitations.some((text) => text.includes('Mean Lilith')));
  assert.ok(limitations.some((text) => text.includes('Selena / White Moon')));
});

test('display output contains no private or raw data', () => {
  const result = formatSpecialPointsResult({
    lunarNodesResult: NODES_RESULT,
    lunarNodesAssignmentResult: NODES_ASSIGNMENT_RESULT,
    lilithResult: LILITH_RESULT,
    selenaResult: SELENA_RESULT,
  });

  assertSafeDisplayOutput(result);
});

test('isDisplayableSpecialPointItem rejects unsafe item text', () => {
  assert.equal(isDisplayableSpecialPointItem({ text: 'Северный узел — Лев 03°12′44″' }), true);
  assert.equal(isDisplayableSpecialPointItem({ text: 'longitude 123.456789' }), false);
  assert.equal(isDisplayableSpecialPointItem({ text: 'кармический долг' }), false);
});

test('helper does not import calculation, assignment, provider, DOM, or native astronomy modules', async () => {
  const source = await readFile(MODULE_PATH, 'utf8');
  const forbidden = [
    'lunarNodes.js',
    'lunarNodesHouseAssignment.js',
    'lilith.js',
    'selena.js',
    'planetaryProvider',
    'providerCalculations',
    'localStorage',
    'document.',
    'window.',
    'astronomy-engine',
    'swisseph',
    'calculateLunarNodes',
    'calculateLilith',
    'calculateSelena',
    'assignLunar',
  ];

  for (const term of forbidden) {
    assert.equal(source.includes(term), false, `module source must not include ${term}`);
  }
});

test('helper does not mutate input', () => {
  const input = {
    lunarNodesResult: clone(NODES_RESULT),
    lunarNodesAssignmentResult: clone(NODES_ASSIGNMENT_RESULT),
    lilithResult: clone(LILITH_RESULT),
    selenaResult: clone(SELENA_RESULT),
  };
  const before = clone(input);

  formatSpecialPointsResult(input);

  assert.deepEqual(input, before);
});

test('src/houses.js and src/houseSystems.js are not created', () => {
  assert.equal(existsSync(path.resolve('src/houses.js')), false);
  assert.equal(existsSync(path.resolve('src/houseSystems.js')), false);
});
