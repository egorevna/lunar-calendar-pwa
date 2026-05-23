import assert from 'node:assert/strict';
import test from 'node:test';

import { calculateNatalAspects } from '../src/natalAspectEngine.js';
import { NATAL_ASPECT_FIXTURES } from './fixtures/natalAspectFixtures.js';

const ORB_TOLERANCE = 0.000001;

test('exact major aspect fixtures pass', () => {
  assertFixturesByCategoryPass('exactMajorAspects');
});

test('nearInsideOrb fixtures pass', () => {
  assertFixturesByCategoryPass('nearInsideOrb');
});

test('justOutsideOrb fixtures reject aspects', () => {
  assertFixturesByCategoryPass('justOutsideOrb');
});

test('wrapAround fixtures pass', () => {
  assertFixturesByCategoryPass('wrapAround');
});

test('outerOuterNarrowOrb fixtures pass', () => {
  assertFixturesByCategoryPass('outerOuterNarrowOrb');
});

test('luminaryWideOrb fixtures pass', () => {
  assertFixturesByCategoryPass('luminaryWideOrb');
});

test('invalidPlanets fixtures pass', () => {
  assertFixturesByCategoryPass('invalidPlanets');
});

test('duplicatePrevention fixtures pass', () => {
  assertFixturesByCategoryPass('duplicatePrevention');
});

test('noAspects fixtures pass', () => {
  assertFixturesByCategoryPass('noAspects');
});

test('sortingPriority fixtures pass', () => {
  assertFixturesByCategoryPass('sortingPriority');
});

test('all natal aspect fixtures match manual expectations', () => {
  NATAL_ASPECT_FIXTURES.forEach(assertFixturePasses);
});

test('fixture validation output contains no private data transit wording or unsupported points', () => {
  NATAL_ASPECT_FIXTURES.forEach((fixture) => {
    const output = calculateNatalAspects(fixture.planets);
    const text = JSON.stringify(output);

    assert.equal(text.includes('birthDate'), false);
    assert.equal(text.includes('birthTime'), false);
    assert.equal(text.includes('coordinates'), false);
    assert.equal(text.includes('profile'), false);
    assert.equal(text.includes('transit'), false);
    assert.equal(text.includes('houses'), false);
    assert.equal(text.includes('ASC'), false);
    assert.equal(text.includes('MC'), false);
  });
});

test('fixture validation output contains no NaN or non-finite numbers', () => {
  NATAL_ASPECT_FIXTURES.forEach((fixture) => {
    const output = calculateNatalAspects(fixture.planets);
    const text = JSON.stringify(output);

    assert.equal(text.includes('NaN'), false);
    assert.equal(text.includes('undefined'), false);
    assertFiniteNumbers(output);
  });
});

function assertFixturesByCategoryPass(category) {
  const fixtures = NATAL_ASPECT_FIXTURES.filter((fixture) => fixture.category === category);

  assert.equal(fixtures.length > 0, true, `${category} fixtures should exist`);
  fixtures.forEach(assertFixturePasses);
}

function assertFixturePasses(fixture) {
  const actual = calculateNatalAspects(fixture.planets);

  assert.equal(
    actual.length,
    fixture.expected.aspectCount,
    `${fixture.id} should return expected aspect count`,
  );
  assert.deepEqual(
    actual.map(aspectIdentity),
    fixture.expected.aspects.map(expectedAspectIdentity),
    `${fixture.id} should return no extra aspects and preserve expected order`,
  );

  fixture.expected.aspects.forEach((expected, index) => {
    const aspect = actual[index];

    assert.equal(aspect.bodyA.key, expected.bodyA, `${fixture.id} bodyA`);
    assert.equal(aspect.bodyB.key, expected.bodyB, `${fixture.id} bodyB`);
    assert.equal(aspect.aspect.key, expected.aspect, `${fixture.id} aspect key`);
    assert.equal(aspect.strength, expected.strength, `${fixture.id} strength`);
    assert.equal(
      Math.abs(aspect.orb - expected.orb) <= ORB_TOLERANCE,
      true,
      `${fixture.id} orb ${aspect.orb} should match ${expected.orb}`,
    );
  });
}

function aspectIdentity(aspect) {
  return `${aspect.bodyA.key}-${aspect.bodyB.key}-${aspect.aspect.key}`;
}

function expectedAspectIdentity(aspect) {
  return `${aspect.bodyA}-${aspect.bodyB}-${aspect.aspect}`;
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
