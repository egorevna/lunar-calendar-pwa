import assert from 'node:assert/strict';
import test from 'node:test';

import {
  getDegreeRulersSummary,
  lookupDegreeRuler,
  lookupDegreeRulerForPlanet,
} from '../src/degreeRulersStarOfMagi.js';
import { DEGREE_RULERS_STAR_OF_MAGI_LOOKUP_FIXTURES } from './fixtures/degreeRulersStarOfMagiFixtures.js';

test('sign start fixtures pass', () => {
  assertFixturesByCategoryPass('signStarts');
});

test('fractional boundary fixtures pass', () => {
  assertFixturesByCategoryPass('fractionalBoundaries');
});

test('integer boundary fixtures pass', () => {
  assertFixturesByCategoryPass('integerBoundaries');
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

test('all degree ruler lookup fixtures match manual expectations without unsafe output', () => {
  for (const fixture of DEGREE_RULERS_STAR_OF_MAGI_LOOKUP_FIXTURES) {
    const output = evaluateFixture(fixture);

    assertFixtureOutputMatches(fixture, output);
    assertSafeOutput(output, fixture.id);
  }
});

function assertFixturesByCategoryPass(category) {
  const fixtures = DEGREE_RULERS_STAR_OF_MAGI_LOOKUP_FIXTURES.filter((fixture) => fixture.category === category);

  assert.ok(fixtures.length > 0, `${category} fixtures should exist`);

  for (const fixture of fixtures) {
    const output = evaluateFixture(fixture);

    assertFixtureOutputMatches(fixture, output);
    assertSafeOutput(output, fixture.id);
  }
}

function evaluateFixture(fixture) {
  if (fixture.input.planet) {
    return lookupDegreeRulerForPlanet(fixture.input.planet);
  }

  if (Array.isArray(fixture.input.lookups)) {
    const results = fixture.input.lookups.map((input) => lookupDegreeRuler(input.sign, input.degreeWithinSign));

    return getDegreeRulersSummary(results);
  }

  return lookupDegreeRuler(fixture.input.sign, fixture.input.degreeWithinSign);
}

function assertFixtureOutputMatches(fixture, output) {
  const { expected } = fixture;

  if (expected.status !== 'summary') {
    assert.equal(output.status, expected.status, `${fixture.id}: status mismatch`);
  }

  if (expected.status === 'ready') {
    const actualDegreeRuler = output.degreeRuler ?? output;

    assert.equal(actualDegreeRuler.degreeIndex ?? actualDegreeRuler.degree, expected.degreeIndex, `${fixture.id}: index mismatch`);
    assert.equal(actualDegreeRuler.ruler, expected.ruler, `${fixture.id}: ruler mismatch`);

    if (output.source?.sourceSystem) {
      assert.equal(output.source.sourceSystem, expected.sourceSystem, `${fixture.id}: source system mismatch`);
    }

    if (output.sourceSystem) {
      assert.equal(output.sourceSystem, expected.sourceSystem, `${fixture.id}: source system mismatch`);
    }
  }

  if (expected.status === 'invalid') {
    assert.equal(output.status, 'invalid', `${fixture.id}: expected invalid output`);
    assert.equal(output.degreeRuler, null, `${fixture.id}: invalid output should not include degreeRuler`);
  }

  if (expected.status === 'summary') {
    assert.equal(output.total, expected.total, `${fixture.id}: summary total mismatch`);
    assert.equal(output.ready, expected.ready, `${fixture.id}: summary ready mismatch`);
    assert.deepEqual(output.byRuler, expected.byRuler, `${fixture.id}: summary ruler counts mismatch`);
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
    'Table 7',
    'vronsky-degree-rulers',
    'retrograde',
    'multipleRulers',
    'decans',
    'terms',
    'interpretation',
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
