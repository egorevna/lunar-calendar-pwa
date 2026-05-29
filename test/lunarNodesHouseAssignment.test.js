import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import {
  assignLunarNodeToHouse,
  assignLunarNodesToHouses,
  assignLunarNodesToHousesForProfile,
  findHouseForLunarNodeLongitude,
  getLunarNodesHouseAssignmentCapabilities,
  getLunarNodesHouseAssignmentLimitations,
  getLunarNodesHouseAssignmentSummary,
} from '../src/lunarNodesHouseAssignment.js';
import { getLunarNodesHouseAssignmentFixture } from './fixtures/lunarNodesHouseAssignmentFixtures.js';

const READY_PROFILE = Object.freeze({
  id: 'lunar-nodes-house-assignment-profile',
  name: 'Synthetic Lunar Nodes Profile',
  birthDate: '1981-04-16',
  birthTime: '04:45',
  birthTimeAccuracy: 'exact',
  birthPlace: Object.freeze({
    city: 'Москва',
    country: 'Россия',
    coordinates: Object.freeze({
      latitude: 55.7577,
      longitude: 37.5410,
    }),
    timezone: 'Europe/Moscow',
  }),
  currentPlace: Object.freeze({
    mode: 'moscow',
    city: 'Москва',
    country: 'Россия',
    timezone: 'Europe/Moscow',
  }),
  houseSystem: 'wholeSign',
  zodiac: 'tropical',
});

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function fixture(id) {
  return getLunarNodesHouseAssignmentFixture(id);
}

function assignmentsBySide(assignments) {
  return Object.fromEntries(Object.entries(assignments).map(([side, assignment]) => [
    side,
    assignment?.houseNumber ?? null,
  ]));
}

function individualAssignmentsByKey(nodes, cuspResult) {
  return Object.fromEntries(nodes.map((node) => {
    const assignment = assignLunarNodeToHouse(node, cuspResult);

    return [node.key, assignment.houseNumber ?? null];
  }));
}

function assertSafeOutput(value) {
  const json = JSON.stringify(value);

  assert.equal(json.includes('1981-04-16'), false);
  assert.equal(json.includes('04:45'), false);
  assert.equal(json.includes('Europe/Moscow'), false);
  assert.equal(json.includes('"birthDate"'), false);
  assert.equal(json.includes('"birthTime"'), false);
  assert.equal(json.includes('"birthPlace"'), false);
  assert.equal(json.includes('"utcDateTime"'), false);
  assert.equal(json.includes('"coordinates"'), false);
  assert.equal(json.includes('"latitude"'), false);
  assert.equal(json.includes('"longitude"'), false);
  assert.equal(json.includes('"providerPayload"'), false);
  assert.equal(json.includes('"fullProfileJson"'), false);
  assert.equal(json.includes('NaN'), false);
  assert.equal(json.includes('undefined'), false);
  assert.equal(json.includes('фаталь'), false);
  assert.equal(json.includes('карми'), false);
  assert.equal(json.includes('ритуал'), false);
}

test('Whole Sign Aquarius assigns node longitudes by sign-boundary cusps', () => {
  const wholeSign = fixture('whole-sign-aquarius-boundaries');
  const result = assignLunarNodesToHouses(wholeSign.input.nodesResult, wholeSign.input.cuspResult);

  assert.equal(result.status, 'ready');
  assert.equal(result.ready, true);
  assert.equal(result.houseSystem, 'whole-sign');
  assert.deepEqual(assignmentsBySide(result.assignments), wholeSign.expected.assignments);
  assert.deepEqual(
    individualAssignmentsByKey(wholeSign.input.individualNodes, wholeSign.input.cuspResult),
    wholeSign.expected.individualAssignments,
  );
  assert.equal(findHouseForLunarNodeLongitude(315, wholeSign.input.cuspResult)?.number, 1);
  assert.equal(findHouseForLunarNodeLongitude(331, wholeSign.input.cuspResult)?.number, 2);
  assert.equal(findHouseForLunarNodeLongitude(299, wholeSign.input.cuspResult)?.number, 12);
  assertSafeOutput(result);
});

test('Equal House assigns nodes by half-open exact cusp spans', () => {
  const equalHouse = fixture('equal-house-aquarius-boundaries');

  assert.deepEqual(
    individualAssignmentsByKey(equalHouse.input.individualNodes, equalHouse.input.cuspResult),
    equalHouse.expected.individualAssignments,
  );
  assert.equal(findHouseForLunarNodeLongitude(314.791633, equalHouse.input.cuspResult)?.number, 1);
  assert.equal(findHouseForLunarNodeLongitude(344.791, equalHouse.input.cuspResult)?.number, 1);
  assert.equal(findHouseForLunarNodeLongitude(344.791633, equalHouse.input.cuspResult)?.number, 2);
  assert.equal(findHouseForLunarNodeLongitude(300, equalHouse.input.cuspResult)?.number, 12);
});

test('Placidus assigns nodes by canonical Placidus cusps without fallback', () => {
  const placidus = fixture('placidus-benchmark-boundaries');

  assert.deepEqual(
    individualAssignmentsByKey(placidus.input.individualNodes, placidus.input.cuspResult),
    placidus.expected.individualAssignments,
  );
  assert.equal(findHouseForLunarNodeLongitude(314.791633, placidus.input.cuspResult)?.number, 1);
  assert.equal(findHouseForLunarNodeLongitude(23.9009, placidus.input.cuspResult)?.number, 1);
  assert.equal(findHouseForLunarNodeLongitude(23.900972, placidus.input.cuspResult)?.number, 2);
  assert.equal(findHouseForLunarNodeLongitude(300, placidus.input.cuspResult)?.number, 12);
});

test('exact cusp boundary belongs to the house starting at that cusp', () => {
  const boundary = fixture('cusp-boundary-policy');
  const house = findHouseForLunarNodeLongitude(boundary.input.exactCuspLongitude, boundary.input.cuspResult);

  assert.equal(house.number, boundary.expected.houseNumber);
  assert.equal(boundary.expected.policy, '[cusp, nextCusp)');
});

test('wrapping cusp span is supported', () => {
  const wrapping = fixture('wrapping-span-policy');
  const house = findHouseForLunarNodeLongitude(wrapping.input.longitude, wrapping.input.cuspResult);

  assert.equal(house.number, wrapping.expected.houseNumber);
});

test('single node assignment returns safe ready text without raw longitude', () => {
  const wholeSign = fixture('whole-sign-aquarius-boundaries');
  const node = wholeSign.input.individualNodes[0];
  const assignment = assignLunarNodeToHouse(node, wholeSign.input.cuspResult);

  assert.deepEqual(assignment, {
    status: 'ready',
    ready: true,
    key: 'north-node',
    label: 'Северный узел',
    houseSystem: 'whole-sign',
    houseNumber: 1,
    houseLabel: '1 дом',
    house: {
      number: 1,
      label: '1 дом',
    },
    text: 'Северный узел — 1 дом',
  });
  assertSafeOutput(assignment);
});

test('aggregate assignment preserves north and south structure and summarizes houses', () => {
  const injected = fixture('profile-ready-injected');
  const result = assignLunarNodesToHouses(injected.input.nodesResult, injected.input.cuspResult);
  const summary = getLunarNodesHouseAssignmentSummary(result.assignments);

  assert.deepEqual(Object.keys(result.assignments), ['north', 'south']);
  assert.deepEqual(assignmentsBySide(result.assignments), injected.expected.assignments);
  assert.equal(result.total, 2);
  assert.equal(result.readyCount, 2);
  assert.equal(result.invalidCount, 0);
  assert.deepEqual(result.summary.byHouse, { 1: 1, 7: 1 });
  assert.deepEqual(summary, result.summary);
  assertSafeOutput(result);
});

test('notReady nodes/cusps and invalid nodes fail safely without fake houses', () => {
  const invalid = fixture('invalid-inputs');
  const wholeSign = fixture('whole-sign-aquarius-boundaries');
  const missingLongitude = assignLunarNodeToHouse(
    invalid.input.missingLongitudeNode,
    wholeSign.input.cuspResult,
  );
  const notReadyNode = assignLunarNodeToHouse(
    invalid.input.notReadyNode,
    wholeSign.input.cuspResult,
  );
  const notReadyNodes = assignLunarNodesToHouses(
    invalid.input.notReadyNodesResult,
    wholeSign.input.cuspResult,
  );
  const emptyNodes = assignLunarNodesToHouses(
    invalid.input.emptyNodesResult,
    wholeSign.input.cuspResult,
  );
  const notReadyCusps = assignLunarNodesToHouses(
    wholeSign.input.nodesResult,
    invalid.input.notReadyCusps,
  );
  const unsupportedCusps = assignLunarNodesToHouses(
    wholeSign.input.nodesResult,
    invalid.input.unsupportedCusps,
  );

  assert.equal(missingLongitude.status, 'invalid');
  assert.equal(missingLongitude.reason, invalid.expected.invalidNodeReason);
  assert.equal(notReadyNode.status, 'invalid');
  assert.equal(notReadyNode.reason, invalid.expected.notReadyNodeReason);
  assert.equal(notReadyNodes.status, 'notReady');
  assert.equal(notReadyNodes.reason, 'missingUtcDateTime');
  assert.equal(emptyNodes.status, 'notReady');
  assert.equal(emptyNodes.reason, invalid.expected.emptyNodesReason);
  assert.equal(notReadyCusps.status, 'notReady');
  assert.equal(notReadyCusps.reason, invalid.expected.notReadyReason);
  assert.equal(unsupportedCusps.status, 'unsupported');
  assert.equal(unsupportedCusps.reason, invalid.expected.unsupportedReason);
  [missingLongitude, notReadyNode, notReadyNodes, emptyNodes, notReadyCusps, unsupportedCusps].forEach(assertSafeOutput);
});

test('profile helper returns safe fallbacks and ready paths without mutation', () => {
  const missingProfile = assignLunarNodesToHousesForProfile(null);
  const unknownTime = assignLunarNodesToHousesForProfile({
    ...clone(READY_PROFILE),
    birthTime: '',
    birthTimeAccuracy: 'unknown',
  });
  const missingCoordinates = assignLunarNodesToHousesForProfile({
    ...clone(READY_PROFILE),
    birthPlace: {
      ...READY_PROFILE.birthPlace,
      coordinates: undefined,
    },
  });
  const profile = clone(READY_PROFILE);
  const injected = fixture('profile-ready-injected');
  const injectedReady = assignLunarNodesToHousesForProfile(profile, {
    nodesResult: injected.input.nodesResult,
    cuspResult: injected.input.cuspResult,
  });
  const actualReady = assignLunarNodesToHousesForProfile({
    ...clone(READY_PROFILE),
    houseSystem: 'placidus',
  });

  assert.equal(missingProfile.status, 'notReady');
  assert.equal(missingProfile.reason, 'missingProfile');
  assert.equal(unknownTime.status, 'notReady');
  assert.equal(unknownTime.reason, 'missingExactBirthTime');
  assert.equal(missingCoordinates.status, 'notReady');
  assert.equal(missingCoordinates.reason, 'cityWithoutCoordinates');
  assert.equal(injectedReady.status, 'ready');
  assert.deepEqual(assignmentsBySide(injectedReady.assignments), injected.expected.assignments);
  assert.equal(actualReady.status, 'ready');
  assert.equal(actualReady.ready, true);
  assert.deepEqual(Object.keys(actualReady.assignments), ['north', 'south']);
  assert.deepEqual(profile, clone(READY_PROFILE));
  [missingProfile, unknownTime, missingCoordinates, injectedReady, actualReady].forEach(assertSafeOutput);
});

test('only North and South Nodes are assigned', () => {
  const wholeSign = fixture('whole-sign-aquarius-boundaries');
  const nodesResult = {
    ...wholeSign.input.nodesResult,
    nodes: {
      ...wholeSign.input.nodesResult.nodes,
      true: { key: 'true-node', label: 'True Node', longitude: 10 },
      lilith: { key: 'lilith', label: 'Lilith', longitude: 20 },
      selena: { key: 'selena', label: 'Selena', longitude: 30 },
    },
  };
  const result = assignLunarNodesToHouses(nodesResult, wholeSign.input.cuspResult);
  const assignmentJson = JSON.stringify(result.assignments);

  assert.deepEqual(Object.keys(result.assignments), ['north', 'south']);
  assert.equal(assignmentJson.includes('true-node'), false);
  assert.equal(assignmentJson.includes('lilith'), false);
  assert.equal(assignmentJson.includes('selena'), false);
});

test('capabilities and limitations keep Lunar Nodes house assignment scoped', () => {
  const capabilities = getLunarNodesHouseAssignmentCapabilities();
  const limitations = getLunarNodesHouseAssignmentLimitations().join(' ');

  assert.deepEqual(capabilities, {
    lunarNodesHouseAssignment: true,
    northNode: true,
    southNode: true,
    meanNode: true,
    trueNode: false,
    wholeSign: true,
    equalHouse: true,
    placidus: true,
    lilith: false,
    selena: false,
    interpretations: false,
    transits: false,
    fixedStars: false,
  });
  assert.match(limitations, /выбранной системе домов/);
  assert.match(limitations, /точная числовая долгота/);
  assert.match(limitations, /Граница куспида/);
  assert.match(limitations, /готовые куспиды/);
  assert.match(limitations, /не рассчитывает Lilith или Selena/);
  assert.match(limitations, /Интерпретации не добавлены/);
});

test('lunar nodes house assignment module keeps strict boundaries', async () => {
  const source = await readFile(new URL('../src/lunarNodesHouseAssignment.js', import.meta.url), 'utf8');
  const imports = source
    .split('\n')
    .filter((line) => line.trim().startsWith('import '));
  const wholeSign = fixture('whole-sign-aquarius-boundaries');
  const result = assignLunarNodesToHouses(wholeSign.input.nodesResult, wholeSign.input.cuspResult);

  assertSafeOutput(result);
  assert.equal(imports.some((line) => line.includes('provider')), false);
  assert.equal(imports.some((line) => line.includes('localStorage')), false);
  assert.equal(imports.some((line) => line.includes('document')), false);
  assert.equal(imports.some((line) => line.includes('window')), false);
  assert.equal(imports.some((line) => line.includes('swisseph')), false);
  assert.equal(imports.some((line) => line.includes('astronomy-engine')), false);
  assert.equal(source.includes('document.'), false);
  assert.equal(source.includes('window.'), false);
  assert.equal(source.includes('calculateMeanLunarNodeLongitude'), false);
  assert.equal(source.includes('calculateLunarNodes('), false);
  assert.equal(source.includes('calculateTrue'), false);
  assert.equal(source.includes('calculateLilith'), false);
  assert.equal(source.includes('calculateSelena'), false);
  assert.equal(source.includes('trueNode: true'), false);
  assert.equal(source.includes('lilith: true'), false);
  assert.equal(source.includes('selena: true'), false);
  assert.equal(source.includes('interpretations: true'), false);
  assert.equal(source.includes('ритуал'), false);
  assert.equal(source.includes('карми'), false);
  assert.equal(existsSync(new URL('../src/houses.js', import.meta.url)), false);
  assert.equal(existsSync(new URL('../src/houseSystems.js', import.meta.url)), false);
});
