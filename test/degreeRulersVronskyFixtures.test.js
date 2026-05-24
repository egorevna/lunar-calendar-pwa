import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import {
  VRONSKY_DEGREE_RULERS_LOOKUP_FIXTURES,
  getVronskyDegreeRulersFixture,
  getVronskyDegreeRulersFixtureCategories,
  getVronskyDegreeRulersFixtureIds,
} from './fixtures/degreeRulersVronskyFixtures.js';

const REQUIRED_CATEGORIES = Object.freeze([
  'signStarts',
  'fractionalBoundaries',
  'integerBoundaries',
  'multiRuler',
  'retrogradeMarkers',
  'outerPlanets',
  'chironProserpina',
  'invalidInputs',
  'planetInput',
  'summary',
  'sourceSystemSeparation',
  'strictExclusions',
]);

const ALLOWED_RULER_KEYS = Object.freeze([
  'sun',
  'moon',
  'mercury',
  'venus',
  'mars',
  'jupiter',
  'saturn',
  'uranus',
  'neptune',
  'pluto',
  'chiron',
  'proserpina',
]);

const FORBIDDEN_FIXTURE_STRINGS = Object.freeze([
  'Егор',
  'Анна',
  'birthDate',
  'birthTime',
  'coordinates',
  'profileJson',
  'fullProfile',
  'degree-rulers-star-of-magi-table-6',
  'star-of-magi-degree-rulers',
  'fixedStars',
  'decans',
  'terms',
  'interpretation',
  'ритуал',
]);

test('VRONSKY_DEGREE_RULERS_LOOKUP_FIXTURES is an array of fixture objects', () => {
  assert.equal(Array.isArray(VRONSKY_DEGREE_RULERS_LOOKUP_FIXTURES), true);
  assert.ok(VRONSKY_DEGREE_RULERS_LOOKUP_FIXTURES.length >= REQUIRED_CATEGORIES.length);

  for (const fixture of VRONSKY_DEGREE_RULERS_LOOKUP_FIXTURES) {
    assert.equal(typeof fixture.id, 'string');
    assert.equal(typeof fixture.category, 'string');
    assert.equal(typeof fixture.label, 'string');
    assert.equal(typeof fixture.input, 'object');
    assert.equal(typeof fixture.expected, 'object');
    assert.equal(Array.isArray(fixture.notes), true);
  }
});

test('fixture ids are unique and getter helpers work', () => {
  const ids = getVronskyDegreeRulersFixtureIds();

  assert.deepEqual(ids, VRONSKY_DEGREE_RULERS_LOOKUP_FIXTURES.map((fixture) => fixture.id));
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(getVronskyDegreeRulersFixture(ids[0])?.id, ids[0]);
  assert.equal(getVronskyDegreeRulersFixture('unknown-vronsky-degree-ruler-fixture'), null);
});

test('required Vronsky degree ruler fixture categories exist', () => {
  const categories = getVronskyDegreeRulersFixtureCategories();

  for (const category of REQUIRED_CATEGORIES) {
    assert.equal(categories.includes(category), true, `${category} category should exist`);
  }
});

test('expected values are manually present in fixture data', () => {
  for (const fixture of VRONSKY_DEGREE_RULERS_LOOKUP_FIXTURES) {
    assert.equal(typeof fixture.expected.status, 'string');

    if (fixture.expected.status === 'ready') {
      assert.equal(Number.isInteger(fixture.expected.degreeIndex), true);
      assert.equal(Array.isArray(fixture.expected.rulers), true);
      assert.ok(fixture.expected.rulers.length > 0);
      assert.equal(fixture.expected.sourceSystem, 'vronsky-degree-rulers');

      for (const ruler of fixture.expected.rulers) {
        assert.equal(ALLOWED_RULER_KEYS.includes(ruler.key), true);
        assert.equal(typeof ruler.retrograde, 'boolean');
      }
    }

    if (fixture.expected.status === 'invalid') {
      assert.equal(typeof fixture.expected.reason, 'string');
    }

    if (fixture.expected.status === 'summary') {
      assert.equal(Number.isFinite(fixture.expected.total), true);
      assert.equal(Number.isFinite(fixture.expected.ready), true);
      assert.equal(typeof fixture.expected.byRuler, 'object');
      assert.equal(Number.isFinite(fixture.expected.multiRuler), true);
      assert.equal(Number.isFinite(fixture.expected.retrograde), true);
      assert.equal(Number.isFinite(fixture.expected.outerPlanet), true);
    }
  }
});

test('fixtures include multi-ruler retrograde outer planet Chiron and Proserpina cases', () => {
  const readyFixtures = VRONSKY_DEGREE_RULERS_LOOKUP_FIXTURES
    .filter((fixture) => fixture.expected.status === 'ready');
  const allRulers = readyFixtures.flatMap((fixture) => fixture.expected.rulers);

  assert.equal(readyFixtures.some((fixture) => fixture.expected.rulers.length > 1), true);
  assert.equal(allRulers.some((ruler) => ruler.retrograde), true);
  assert.equal(allRulers.some((ruler) => ['uranus', 'neptune', 'pluto'].includes(ruler.key)), true);
  assert.equal(allRulers.some((ruler) => ruler.key === 'chiron'), true);
  assert.equal(allRulers.some((ruler) => ruler.key === 'proserpina'), true);
});

test('Vronsky degree ruler fixtures contain no private data unsupported systems or interpretation text', () => {
  const fixtureText = JSON.stringify(VRONSKY_DEGREE_RULERS_LOOKUP_FIXTURES);

  for (const forbidden of FORBIDDEN_FIXTURE_STRINGS) {
    assert.equal(fixtureText.includes(forbidden), false, `${forbidden} should not be present`);
  }
});

test('planet fixture records use synthetic source metadata', () => {
  for (const fixture of VRONSKY_DEGREE_RULERS_LOOKUP_FIXTURES.filter((item) => item.category === 'planetInput')) {
    if (fixture.input.planet) {
      assert.equal(fixture.input.planet.source, 'synthetic-fixture');
    }
  }
});

test('expected values are not generated by the Vronsky lookup engine at fixture creation time', () => {
  const source = readFileSync(new URL('./fixtures/degreeRulersVronskyFixtures.js', import.meta.url), 'utf8');

  assert.equal(source.includes('../src/degreeRulersVronsky.js'), false);
  assert.equal(source.includes('lookupVronskyDegreeRulers'), false);
  assert.equal(source.includes('lookupVronskyDegreeRulersForPlanet'), false);
  assert.equal(source.includes('evaluateVronskyDegreeRulersForPlanets'), false);
});
