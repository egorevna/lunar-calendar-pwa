import assert from 'node:assert/strict';
import test from 'node:test';

import {
  getTermsSummary,
  lookupTerm,
  lookupTermForPlanet,
} from '../src/terms.js';
import { TERMS_LOOKUP_FIXTURES } from './fixtures/termsFixtures.js';

test('sign start fixtures pass', () => {
  assertFixturesByCategoryPass('signStarts');
});

test('exact boundary fixtures pass', () => {
  assertFixturesByCategoryPass('exactBoundaries');
});

test('final printed 29 normalization fixtures pass', () => {
  assertFixturesByCategoryPass('finalPrinted29Normalization');
});

test('final printed 30 fixtures pass', () => {
  assertFixturesByCategoryPass('finalPrinted30');
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

test('strict exclusion fixtures pass', () => {
  assertFixturesByCategoryPass('strictExclusions');
});

test('all terms lookup fixtures match manual expectations without unsafe output', () => {
  for (const fixture of TERMS_LOOKUP_FIXTURES) {
    const output = evaluateFixture(fixture);

    assertFixtureOutputMatches(fixture, output);
    assertSafeOutput(output, fixture.id);
  }
});

function assertFixturesByCategoryPass(category) {
  const fixtures = TERMS_LOOKUP_FIXTURES.filter((fixture) => fixture.category === category);

  assert.ok(fixtures.length > 0, `${category} fixtures should exist`);

  for (const fixture of fixtures) {
    const output = evaluateFixture(fixture);

    assertFixtureOutputMatches(fixture, output);
    assertSafeOutput(output, fixture.id);
  }
}

function evaluateFixture(fixture) {
  if (fixture.input.planet) {
    return lookupTermForPlanet(fixture.input.planet);
  }

  if (Array.isArray(fixture.input.lookups)) {
    const results = fixture.input.lookups.map((input) => lookupTerm(input.sign, input.degreeWithinSign));

    return getTermsSummary(results);
  }

  return lookupTerm(fixture.input.sign, fixture.input.degreeWithinSign);
}

function assertFixtureOutputMatches(fixture, output) {
  const { expected } = fixture;

  if (expected.status !== 'summary') {
    assert.equal(output.status, expected.status, `${fixture.id}: status mismatch`);
  }

  if (expected.status === 'ready') {
    const actualTerm = output.term ?? output;
    const actualRange = actualTerm.range ?? output.range;

    assert.equal(actualTerm.ruler, expected.ruler, `${fixture.id}: ruler mismatch`);
    assert.equal(actualTerm.value, expected.value, `${fixture.id}: value mismatch`);
    assert.equal(actualRange.startDegree, expected.startDegree, `${fixture.id}: start mismatch`);
    assert.equal(actualRange.printedEndDegree, expected.printedEndDegree, `${fixture.id}: printed end mismatch`);
    assert.equal(
      actualRange.normalizedEndExclusive,
      expected.normalizedEndExclusive,
      `${fixture.id}: normalized end mismatch`,
    );
  }

  if (expected.status === 'invalid') {
    assert.equal(output.status, 'invalid', `${fixture.id}: expected invalid output`);
    assert.equal(output.term, null, `${fixture.id}: invalid output should not include term`);
  }

  if (expected.status === 'summary') {
    assert.equal(output.total, expected.total, `${fixture.id}: summary total mismatch`);
    assert.equal(output.ready, expected.ready, `${fixture.id}: summary ready mismatch`);
    assert.deepEqual(output.byRuler, expected.byRuler, `${fixture.id}: summary ruler counts mismatch`);
    assert.equal(output.positive, expected.positive, `${fixture.id}: summary positive mismatch`);
    assert.equal(output.negative, expected.negative, `${fixture.id}: summary negative mismatch`);
    assert.equal(output.scoreTotal, expected.scoreTotal, `${fixture.id}: summary score mismatch`);
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
    'decans',
    'degreeRulers',
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
