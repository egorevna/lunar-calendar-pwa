import assert from 'node:assert/strict';
import test from 'node:test';

import {
  evaluateEssentialDignities,
  getEssentialDignitySummary,
} from '../src/essentialDignities.js';
import {
  ESSENTIAL_DIGNITY_FIXTURES,
  getEssentialDignityFixture,
} from './fixtures/essentialDignityFixtures.js';

const OUTPUT_FORBIDDEN_STRINGS = Object.freeze([
  'birthDate',
  'birthTime',
  'coordinates',
  'profileJson',
  'fullProfile',
  'terms',
  'decans',
  'degreeRulers',
  'exactExaltationDegrees',
  'exaltationDegreeValues',
  'Vronsky',
  'interpretation',
  'транзит',
  'ритуал',
]);

function validateFixture(fixture) {
  const actualResults = evaluateEssentialDignities(fixture.planets);

  assert.equal(
    actualResults.length,
    fixture.expected.resultCount,
    `${fixture.id}: result count mismatch`,
  );

  for (const expected of fixture.expected.results) {
    const actual = findActualResult(actualResults, expected);

    assert.ok(actual, `${fixture.id}: expected result ${resultKey(expected)} not found`);
    assert.deepEqual(actual.dignities, expected.dignities, `${fixture.id}: dignity flags mismatch`);
    assert.equal(actual.score, expected.score, `${fixture.id}: score mismatch`);
    assert.deepEqual(actual.labels, expected.labels, `${fixture.id}: labels mismatch`);
    assert.deepEqual(actual.modernLabels, expected.modernLabels, `${fixture.id}: modern labels mismatch`);
    assert.equal(actual.source, 'essential-dignities-v1');
  }

  if (fixture.expected.summary) {
    const summary = getEssentialDignitySummary(actualResults);

    assert.equal(summary.total, fixture.expected.summary.total, `${fixture.id}: summary total mismatch`);
    assert.equal(summary.dignified, fixture.expected.summary.dignified, `${fixture.id}: dignified count mismatch`);
    assert.equal(summary.debilitated, fixture.expected.summary.debilitated, `${fixture.id}: debilitated count mismatch`);
    assert.equal(summary.neutral, fixture.expected.summary.neutral, `${fixture.id}: neutral count mismatch`);
    assert.equal(summary.modernLabels, fixture.expected.summary.modernLabels, `${fixture.id}: modern label count mismatch`);
    assert.equal(summary.scoreTotal, fixture.expected.summary.scoreTotal, `${fixture.id}: score total mismatch`);
  }

  assertOutputIsSafe(actualResults, fixture.id);

  return actualResults;
}

function fixturesByCategory(category) {
  return ESSENTIAL_DIGNITY_FIXTURES.filter((fixture) => fixture.category === category);
}

function findActualResult(actualResults, expected) {
  return actualResults.find((result) => resultKey(result) === resultKey(expected));
}

function resultKey(result) {
  return `${result.planetKey}:${result.signKey}`;
}

function assertOutputIsSafe(output, context) {
  const text = JSON.stringify(output);

  assert.equal(text.includes('NaN'), false, `${context}: output contains NaN`);
  assert.equal(text.includes('undefined'), false, `${context}: output contains undefined`);

  for (const forbidden of OUTPUT_FORBIDDEN_STRINGS) {
    assert.equal(text.includes(forbidden), false, `${context}: output contains ${forbidden}`);
  }
}

test('domicile fixtures pass', () => {
  for (const fixture of fixturesByCategory('domicile')) {
    validateFixture(fixture);
  }
});

test('detriment fixtures pass', () => {
  for (const fixture of fixturesByCategory('detriment')) {
    validateFixture(fixture);
  }
});

test('exaltation fixtures pass', () => {
  for (const fixture of fixturesByCategory('exaltation')) {
    validateFixture(fixture);
  }
});

test('fall fixtures pass', () => {
  for (const fixture of fixturesByCategory('fall')) {
    validateFixture(fixture);
  }
});

test('multiple flag fixtures pass with additive Mercury scores', () => {
  const fixture = getEssentialDignityFixture('multiple-flags-mercury-overlap');
  const results = validateFixture(fixture);
  const mercuryVirgo = results.find((result) => resultKey(result) === 'mercury:virgo');
  const mercuryPisces = results.find((result) => resultKey(result) === 'mercury:pisces');

  assert.equal(mercuryVirgo.score, 9);
  assert.deepEqual(mercuryVirgo.labels, ['обитель', 'экзальтация']);
  assert.equal(mercuryPisces.score, -9);
  assert.deepEqual(mercuryPisces.labels, ['изгнание', 'падение']);
});

test('modern rulership fixtures pass without changing classical score', () => {
  const fixture = getEssentialDignityFixture('modern-rulership-label-only');
  const results = validateFixture(fixture);

  for (const result of results) {
    assert.equal(result.score, 0);
    assert.equal(result.dignities.modernRulership, true);
    assert.equal(result.dignities.domicile, false);
    assert.equal(result.dignities.detriment, false);
    assert.equal(result.dignities.exaltation, false);
    assert.equal(result.dignities.fall, false);
    assert.deepEqual(result.labels, []);
    assert.deepEqual(result.modernLabels, ['современное управление']);
  }
});

test('neutral fixtures pass', () => {
  for (const fixture of fixturesByCategory('neutral')) {
    const results = validateFixture(fixture);

    for (const result of results) {
      assert.equal(result.score, 0);
      assert.deepEqual(result.labels, []);
      assert.deepEqual(result.modernLabels, []);
    }
  }
});

test('invalid planet fixtures are ignored safely', () => {
  for (const fixture of fixturesByCategory('invalidPlanets')) {
    const results = validateFixture(fixture);

    assert.deepEqual(results, []);
  }
});

test('summary fixture passes expected counts and score total', () => {
  const fixture = getEssentialDignityFixture('summary-mixed-results');
  const results = validateFixture(fixture);
  const summary = getEssentialDignitySummary(results);

  assert.deepEqual(
    {
      total: summary.total,
      dignified: summary.dignified,
      debilitated: summary.debilitated,
      neutral: summary.neutral,
      modernLabels: summary.modernLabels,
      scoreTotal: summary.scoreTotal,
    },
    fixture.expected.summary,
  );
});

test('strict exclusions fixture passes without future source-pack output', () => {
  for (const fixture of fixturesByCategory('strictExclusions')) {
    validateFixture(fixture);
  }
});

test('all fixtures match manually expected results with no unexpected extra results', () => {
  for (const fixture of ESSENTIAL_DIGNITY_FIXTURES) {
    const actualResults = validateFixture(fixture);
    const expectedKeys = fixture.expected.results.map(resultKey).sort();
    const actualKeys = actualResults.map(resultKey).sort();

    assert.deepEqual(actualKeys, expectedKeys, `${fixture.id}: unexpected result set`);
  }
});

test('outer planets never receive classical dignity or debility flags in fixtures', () => {
  const outerPlanetKeys = new Set(['uranus', 'neptune', 'pluto']);

  for (const fixture of ESSENTIAL_DIGNITY_FIXTURES) {
    const results = validateFixture(fixture);

    for (const result of results.filter((item) => outerPlanetKeys.has(item.planetKey))) {
      assert.equal(result.dignities.domicile, false);
      assert.equal(result.dignities.detriment, false);
      assert.equal(result.dignities.exaltation, false);
      assert.equal(result.dignities.fall, false);
      assert.equal(result.score, 0);
    }
  }
});

test('validation output contains no private data unsupported dignity layers or interpretation text', () => {
  const allResults = ESSENTIAL_DIGNITY_FIXTURES.flatMap((fixture) => validateFixture(fixture));

  assertOutputIsSafe(allResults, 'all fixtures');
});
