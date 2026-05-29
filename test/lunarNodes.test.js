import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import test from 'node:test';

import {
  calculateLunarNodes,
  calculateLunarNodesForProfile,
  calculateMeanLunarNodeLongitude,
  deriveSouthNode,
  formatLunarNode,
  getLunarNodesCapabilities,
  getLunarNodesLimitations,
  getLunarNodesSource,
} from '../src/lunarNodes.js';
import { LUNAR_NODES_FIXTURES, getLunarNodesFixture } from './fixtures/lunarNodesFixtures.js';

const cwd = process.cwd();
const MODULE_PATH = join(cwd, 'src/lunarNodes.js');

const EXACT_PROFILE_WITHOUT_COORDINATES = Object.freeze({
  id: 'synthetic-profile-nodes',
  name: 'Synthetic Nodes Profile',
  birthDate: '2000-01-01',
  birthTime: '12:00',
  birthTimeAccuracy: 'exact',
  birthPlace: Object.freeze({
    city: 'Greenwich',
    country: 'United Kingdom',
    timezone: 'UTC',
  }),
  currentPlace: Object.freeze({
    mode: 'moscow',
    city: 'Москва',
    country: 'Россия',
    latitude: null,
    longitude: null,
    timezone: 'Europe/Moscow',
  }),
  houseSystem: 'wholeSign',
  zodiac: 'tropical',
});

function angularDifference(a, b) {
  const difference = Math.abs(a - b);

  return Math.min(difference, 360 - difference);
}

function assertClose(actual, expected, tolerance, message) {
  assert.equal(Number.isFinite(actual), true, `${message}: actual is not finite`);
  assert.equal(angularDifference(actual, expected) <= tolerance, true, `${message}: ${actual} vs ${expected}`);
}

function assertSafeOutput(value) {
  const serialized = JSON.stringify(value);

  assert.equal(serialized.includes('birthDate'), false);
  assert.equal(serialized.includes('birthTime'), false);
  assert.equal(serialized.includes('utcDateTime'), false);
  assert.equal(serialized.includes('birthPlace'), false);
  assert.equal(serialized.includes('coordinates'), false);
  assert.equal(serialized.includes('latitude'), false);
  assert.equal(serialized.includes('fullProfile'), false);
  assert.equal(serialized.includes('providerPayload'), false);
  assert.equal(serialized.includes('NaN'), false);
  assert.equal(serialized.includes('undefined'), false);
  assert.equal(serialized.includes('фаталь'), false);
  assert.equal(serialized.includes('карми'), false);
  assert.equal(serialized.includes('ритуал'), false);
}

test('calculateMeanLunarNodeLongitude returns normalized longitude for valid UTC', () => {
  const result = calculateMeanLunarNodeLongitude({ utcDateTime: '2000-01-01T12:00:00.000Z' });

  assert.equal(result.status, 'ready');
  assert.equal(result.ready, true);
  assert.equal(result.longitude >= 0 && result.longitude < 360, true);
  assert.equal(result.sourceSystem, 'mean-lunar-node');
  assert.equal(result.sourceKey, 'lunar-nodes-mean');
});

test('calculateMeanLunarNodeLongitude accepts Date input', () => {
  const result = calculateMeanLunarNodeLongitude({ date: new Date('2000-01-01T12:00:00.000Z') });

  assert.equal(result.status, 'ready');
  assert.equal(result.ready, true);
  assert.equal(result.sourceSystem, 'mean-lunar-node');
});

test('calculateMeanLunarNodeLongitude returns safe fallback for missing or invalid date', () => {
  const missing = calculateMeanLunarNodeLongitude({});
  const invalid = calculateMeanLunarNodeLongitude({ utcDateTime: 'not-a-date' });

  assert.equal(missing.status, 'notReady');
  assert.equal(missing.ready, false);
  assert.equal(missing.reason, 'missingUtcDateTime');
  assert.equal(invalid.status, 'notReady');
  assert.equal(invalid.ready, false);
  assert.equal(invalid.reason, 'invalidUtcDateTime');
  assertSafeOutput(missing);
  assertSafeOutput(invalid);
});

test('benchmark fixtures match mean node longitude within tolerance', () => {
  const benchmarks = LUNAR_NODES_FIXTURES.filter((fixture) => fixture.categories.includes('benchmark'));

  assert.equal(benchmarks.length >= 5, true);

  for (const fixture of benchmarks) {
    const result = calculateMeanLunarNodeLongitude(fixture.input);

    assert.equal(result.status, 'ready', fixture.id);
    assertClose(result.longitude, fixture.expected.northLongitude, fixture.expected.toleranceDegrees, fixture.id);
  }
});

test('deriveSouthNode adds 180 degrees and normalizes', () => {
  assert.equal(deriveSouthNode(10), 190);
  assert.equal(deriveSouthNode(250), 70);
  assert.equal(deriveSouthNode(359.5), 179.5);
  assert.equal(deriveSouthNode(Number.NaN), null);
});

test('deriveSouthNode preserves source metadata when object input is used', () => {
  const south = deriveSouthNode({
    key: 'north-node',
    longitude: 359.982282549,
    sourceSystem: 'mean-lunar-node',
    sourceKey: 'lunar-nodes-mean',
    nodeType: 'mean',
    verificationStatus: 'verified',
  });

  assert.equal(south.key, 'south-node');
  assert.equal(south.label, 'Южный узел');
  assert.equal(south.sourceSystem, 'mean-lunar-node');
  assert.equal(south.sourceKey, 'lunar-nodes-mean');
  assert.equal(south.derivedFrom, 'north-node');
  assertClose(south.longitude, 179.982282549, 0.000001, 'south object longitude');
});

test('wrap-around benchmark normalizes north and south nodes', () => {
  const fixture = getLunarNodesFixture('mean-node-2043-wrap-aries');
  const result = calculateLunarNodes(fixture.input);

  assert.equal(result.status, 'ready');
  assertClose(result.nodes.north.longitude, fixture.expected.northLongitude, fixture.expected.toleranceDegrees, 'north wrap');
  assertClose(result.nodes.south.longitude, fixture.expected.southLongitude, fixture.expected.toleranceDegrees, 'south wrap');
  assert.equal(result.nodes.north.sign.key, 'pisces');
  assert.equal(result.nodes.south.sign.key, 'virgo');
});

test('calculateLunarNodes returns North and South Node with source metadata', () => {
  const result = calculateLunarNodes({ utcDateTime: '2000-01-01T12:00:00.000Z' });

  assert.equal(result.status, 'ready');
  assert.equal(result.ready, true);
  assert.equal(result.sourceSystem, 'mean-lunar-node');
  assert.equal(result.sourceKey, 'lunar-nodes-mean');
  assert.equal(result.nodeType, 'mean');
  assert.equal(result.verificationStatus, 'verified');
  assert.equal(result.nodes.north.key, 'north-node');
  assert.equal(result.nodes.north.label, 'Северный узел');
  assert.equal(result.nodes.south.key, 'south-node');
  assert.equal(result.nodes.south.label, 'Южный узел');
  assert.equal(result.nodes.south.derivedFrom, 'north-node');
  assertClose(result.nodes.south.longitude, result.nodes.north.longitude + 180, 0.000001, 'south opposite');
  assertSafeOutput(result);
});

test('formatLunarNode returns sign degree minute second text', () => {
  const node = formatLunarNode('north-node', 123.456789, {
    sourceSystem: 'mean-lunar-node',
    sourceKey: 'lunar-nodes-mean',
  });

  assert.equal(node.key, 'north-node');
  assert.equal(node.label, 'Северный узел');
  assert.equal(node.sign.key, 'leo');
  assert.equal(node.sign.ru, 'Лев');
  assert.equal(Number.isInteger(node.degree), true);
  assert.equal(Number.isInteger(node.minutes), true);
  assert.equal(Number.isInteger(node.seconds), true);
  assert.match(node.text, /^Северный узел — Лев \d{2}°\d{2}′\d{2}″$/);
});

test('source, capabilities and limitations preserve Sprint 13 boundaries', () => {
  const source = getLunarNodesSource();
  const capabilities = getLunarNodesCapabilities();
  const limitations = getLunarNodesLimitations();

  assert.equal(source.sourceSystem, 'mean-lunar-node');
  assert.equal(source.sourceKey, 'lunar-nodes-mean');
  assert.equal(source.nodeType, 'mean');
  assert.equal(source.trueNodeStatus, 'deferred');
  assert.equal(capabilities.lunarNodes, true);
  assert.equal(capabilities.meanNode, true);
  assert.equal(capabilities.trueNode, false);
  assert.equal(capabilities.northNode, true);
  assert.equal(capabilities.southNode, true);
  assert.equal(capabilities.lilith, false);
  assert.equal(capabilities.selena, false);
  assert.equal(capabilities.houseAssignment, false);
  assert.equal(capabilities.interpretations, false);
  assert.equal(capabilities.transits, false);
  assert.equal(capabilities.fixedStars, false);
  assert.equal(limitations.some((item) => item.includes('mean lunar node')), true);
  assert.equal(limitations.some((item) => item.includes('True Node')), true);
  assert.equal(limitations.some((item) => item.includes('Южный узел')), true);
});

test('calculateLunarNodesForProfile returns safe fallback for missing profile', () => {
  const result = calculateLunarNodesForProfile(null);

  assert.equal(result.status, 'notReady');
  assert.equal(result.ready, false);
  assert.equal(result.reason, 'missingProfile');
  assertSafeOutput(result);
});

test('calculateLunarNodesForProfile returns notReady for unknown birth time', () => {
  const profile = {
    ...EXACT_PROFILE_WITHOUT_COORDINATES,
    birthTime: '',
    birthTimeAccuracy: 'unknown',
  };
  const result = calculateLunarNodesForProfile(profile);

  assert.equal(result.status, 'notReady');
  assert.equal(result.ready, false);
  assert.equal(result.reason, 'missingExactBirthTime');
  assertSafeOutput(result);
});

test('calculateLunarNodesForProfile returns notReady for missing timezone', () => {
  const profile = {
    ...EXACT_PROFILE_WITHOUT_COORDINATES,
    birthPlace: {
      ...EXACT_PROFILE_WITHOUT_COORDINATES.birthPlace,
      timezone: '',
    },
  };
  const result = calculateLunarNodesForProfile(profile);

  assert.equal(result.status, 'notReady');
  assert.equal(result.ready, false);
  assert.equal(result.reason, 'missingTimezone');
  assertSafeOutput(result);
});

test('calculateLunarNodesForProfile is ready for exact birth time and timezone without coordinates', () => {
  const profile = structuredClone(EXACT_PROFILE_WITHOUT_COORDINATES);
  const before = JSON.stringify(profile);
  const result = calculateLunarNodesForProfile(profile);

  assert.equal(result.status, 'ready');
  assert.equal(result.ready, true);
  assert.equal(result.nodes.north.key, 'north-node');
  assert.equal(result.nodes.south.key, 'south-node');
  assert.equal(JSON.stringify(profile), before);
  assertSafeOutput(result);
});

test('lunarNodes module does not import forbidden runtime dependencies or calculate excluded points', async () => {
  const source = await readFile(MODULE_PATH, 'utf8');

  assert.equal(/from ['"]swisseph['"]/.test(source), false);
  assert.equal(/require\(['"]swisseph['"]\)/.test(source), false);
  assert.equal(source.includes('swe_calc_ut'), false);
  assert.equal(source.includes('SE_TRUE_NODE'), false);
  assert.equal(source.includes('astronomy-engine'), false);
  assert.equal(source.includes('planetaryProvider'), false);
  assert.equal(source.includes('natalPlanetsForProfile'), false);
  assert.equal(source.includes('localStorage'), false);
  assert.equal(source.includes('document.'), false);
  assert.equal(source.includes('window.'), false);
  assert.equal(source.includes('calculateTrue'), false);
  assert.equal(source.includes('calculateLilith'), false);
  assert.equal(source.includes('calculateSelena'), false);
  assert.equal(source.includes('interpretNode'), false);
});

test('forbidden generic house files are not created', () => {
  assert.equal(existsSync(join(cwd, 'src/houses.js')), false);
  assert.equal(existsSync(join(cwd, 'src/houseSystems.js')), false);
});
