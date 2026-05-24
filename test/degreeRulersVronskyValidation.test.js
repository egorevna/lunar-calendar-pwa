import assert from 'node:assert/strict';
import test from 'node:test';

import {
  getVronskyDegreeRulersSummary,
  lookupVronskyDegreeRulers,
  lookupVronskyDegreeRulersForPlanet,
} from '../src/degreeRulersVronsky.js';
import { VRONSKY_DEGREE_RULERS_LOOKUP_FIXTURES } from './fixtures/degreeRulersVronskyFixtures.js';

test('sign start fixtures pass', () => {
  assertFixturesByCategoryPass('signStarts');
});

test('fractional boundary fixtures pass', () => {
  assertFixturesByCategoryPass('fractionalBoundaries');
});

test('integer boundary fixtures pass', () => {
  assertFixturesByCategoryPass('integerBoundaries');
});

test('multi-ruler fixtures pass', () => {
  assertFixturesByCategoryPass('multiRuler');
});

test('retrograde marker fixtures pass', () => {
  assertFixturesByCategoryPass('retrogradeMarkers');
});

test('outer planet fixtures pass', () => {
  assertFixturesByCategoryPass('outerPlanets');
});

test('Chiron and Proserpina fixtures pass', () => {
  assertFixturesByCategoryPass('chironProserpina');
});

test('invalid input fixtures pass', () => {
  assertFixturesByCategoryPass('invalidInputs');
});

test('planet input fixtures pass', () => {
  assertFixturesByCategoryPass('planetInput');
});

test('summary fixtures pass', () => {
  assertFixturesByCategoryPass('summary');
});

test('source system separation fixtures pass', () => {
  assertFixturesByCategoryPass('sourceSystemSeparation');
});

test('strict exclusion fixtures pass', () => {
  assertFixturesByCategoryPass('strictExclusions');
});

test('all Vronsky degree ruler lookup fixtures match manual expectations without unsafe output', () => {
  for (const fixture of VRONSKY_DEGREE_RULERS_LOOKUP_FIXTURES) {
    const output = evaluateFixture(fixture);

    assertFixtureOutputMatches(fixture, output);
    assertSafeOutput(output, fixture.id);
  }
});

function assertFixturesByCategoryPass(category) {
  const fixtures = VRONSKY_DEGREE_RULERS_LOOKUP_FIXTURES.filter((fixture) => fixture.category === category);

  assert.ok(fixtures.length > 0, `${category} fixtures should exist`);

  for (const fixture of fixtures) {
    const output = evaluateFixture(fixture);

    assertFixtureOutputMatches(fixture, output);
    assertSafeOutput(output, fixture.id);
  }
}

function evaluateFixture(fixture) {
  if (fixture.input.planet) {
    return lookupVronskyDegreeRulersForPlanet(fixture.input.planet);
  }

  if (Array.isArray(fixture.input.lookups)) {
    const results = fixture.input.lookups.map((input) => lookupVronskyDegreeRulers(input.sign, input.degreeWithinSign));

    return getVronskyDegreeRulersSummary(results);
  }

  return lookupVronskyDegreeRulers(fixture.input.sign, fixture.input.degreeWithinSign);
}

function assertFixtureOutputMatches(fixture, output) {
  const { expected } = fixture;

  if (expected.status !== 'summary') {
    assert.equal(output.status, expected.status, `${fixture.id}: status mismatch`);
  }

  if (expected.status === 'ready') {
    const actualRulers = output.degreeRulers ?? output.rulers;

    assert.equal(output.degreeIndex, expected.degreeIndex, `${fixture.id}: degree index mismatch`);
    assert.deepEqual(
      actualRulers.map((ruler) => ({ key: ruler.key, retrograde: ruler.retrograde })),
      expected.rulers,
      `${fixture.id}: ruler list mismatch`,
    );

    if (output.source?.sourceSystem) {
      assert.equal(output.source.sourceSystem, expected.sourceSystem, `${fixture.id}: source system mismatch`);
    }

    if (output.sourceSystem) {
      assert.equal(output.sourceSystem, expected.sourceSystem, `${fixture.id}: source system mismatch`);
    }
  }

  if (expected.status === 'invalid') {
    assert.equal(output.status, 'invalid', `${fixture.id}: expected invalid output`);
    assert.equal(output.degreeRulers, null, `${fixture.id}: invalid output should not include degreeRulers`);
  }

  if (expected.status === 'summary') {
    assert.equal(output.total, expected.total, `${fixture.id}: summary total mismatch`);
    assert.equal(output.ready, expected.ready, `${fixture.id}: summary ready mismatch`);
    assert.deepEqual(output.byRuler, expected.byRuler, `${fixture.id}: summary ruler counts mismatch`);
    assert.equal(output.multiRuler, expected.multiRuler, `${fixture.id}: summary multi-ruler mismatch`);
    assert.equal(output.retrograde, expected.retrograde, `${fixture.id}: summary retrograde mismatch`);
    assert.equal(output.outerPlanet, expected.outerPlanet, `${fixture.id}: summary outer planet mismatch`);
  }
}

function assertSafeOutput(output, context) {
  assertNoUndefined(output);
  assertFiniteNumbers(output);

  const text = JSON.stringify(output);

  for (const forbidden of [
    'NaN',
    'undefined',
    'birthDate',
    'birthTime',
    'coordinates',
    'profile',
    'degree-rulers-star-of-magi-table-6',
    'star-of-magi-degree-rulers',
    'fixedStars',
    'interpretationText',
    'ритуал',
  ]) {
    assert.equal(text.includes(forbidden), false, `${context}: output contains ${forbidden}`);
  }
}

function assertNoUndefined(value) {
  if (Array.isArray(value)) {
    value.forEach(assertNoUndefined);
    return;
  }

  if (value && typeof value === 'object') {
    for (const propertyValue of Object.values(value)) {
      assert.notEqual(propertyValue, undefined);
      assertNoUndefined(propertyValue);
    }
  }
}

function assertFiniteNumbers(value) {
  if (typeof value === 'number') {
    assert.equal(Number.isFinite(value), true);
    return;
  }

  if (Array.isArray(value)) {
    value.forEach(assertFiniteNumbers);
    return;
  }

  if (value && typeof value === 'object') {
    Object.values(value).forEach(assertFiniteNumbers);
  }
}
