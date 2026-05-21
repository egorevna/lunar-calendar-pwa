import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import {
  calculateAstronomyEnginePlanetPositions,
  getAstronomyEngineProviderCapabilities,
} from '../src/astronomyEngineProvider.js';
import {
  getReferenceAngularDifference,
  getReferenceSpeedToleranceForPlanet,
  getReferenceToleranceForPlanet,
  getSwissEphReferenceLongitudes,
  getSwissEphReferenceSpeeds,
  isSwissEphReferenceAvailable,
  NATAL_PROVIDER_REFERENCE_FIXTURES,
  REFERENCE_FLAGS,
  REFERENCE_PROVIDER,
  REFERENCE_PROVIDER_VERSION,
  REFERENCE_SPEED_FLAGS,
} from './fixtures/natalProviderReferenceFixtures.js';

const REQUIRED_PLANET_KEYS = [
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
];

test('Swiss Ephemeris reference source is available for test-only validation', () => {
  assert.equal(isSwissEphReferenceAvailable(), true);
  assert.equal(REFERENCE_PROVIDER, 'swisseph');
  assert.equal(typeof REFERENCE_PROVIDER_VERSION, 'string');
});

test('reference fixtures are UTC-only and do not contain private profile data', () => {
  assert.equal(NATAL_PROVIDER_REFERENCE_FIXTURES.length >= 4, true);
  assert.equal(NATAL_PROVIDER_REFERENCE_FIXTURES.some((fixture) => fixture.categories.includes('retrogradeSensitive')), true);

  for (const fixture of NATAL_PROVIDER_REFERENCE_FIXTURES) {
    assert.equal(fixture.type, 'reference');
    assert.equal(fixture.zodiac, 'tropical');
    assert.match(fixture.utcDateTime, /Z$/);
    assert.equal(JSON.stringify(fixture).includes('Егор'), false);
    assert.equal(JSON.stringify(fixture).includes('Анна'), false);
    assert.equal(JSON.stringify(fixture).includes('birthDate'), false);
    assert.equal(JSON.stringify(fixture).includes('birthTime'), false);
  }
});

test('Swiss Ephemeris speed reference uses explicit speed flag without sidereal or topocentric flags', () => {
  assert.equal(REFERENCE_SPEED_FLAGS, REFERENCE_FLAGS | 256);
});

test('astronomy-engine provider matches Swiss Ephemeris reference longitudes within tolerance', () => {
  const maxDiffs = Object.fromEntries(REQUIRED_PLANET_KEYS.map((key) => [key, 0]));

  for (const fixture of NATAL_PROVIDER_REFERENCE_FIXTURES) {
    const result = calculateAstronomyEnginePlanetPositions({
      utcDateTime: fixture.utcDateTime,
      zodiac: fixture.zodiac,
    });
    const reference = getSwissEphReferenceLongitudes(fixture.utcDateTime);

    assert.equal(result.status, 'ready', fixture.id);
    assert.deepEqual(result.planets.map((planet) => planet.key), REQUIRED_PLANET_KEYS);
    assert.notEqual(reference, null, fixture.id);

    for (const planet of result.planets) {
      const referenceLongitude = reference[planet.key];
      const tolerance = getReferenceToleranceForPlanet(planet.key);
      const diff = getReferenceAngularDifference(planet.longitude, referenceLongitude);

      maxDiffs[planet.key] = Math.max(maxDiffs[planet.key], diff);
      assert.equal(Number.isFinite(planet.longitude), true, `${fixture.id}:${planet.key}`);
      assert.equal(planet.longitude >= 0 && planet.longitude < 360, true, `${fixture.id}:${planet.key}`);
      assert.equal(typeof planet.sign.key, 'string', `${fixture.id}:${planet.key}`);
      assert.equal(Number.isInteger(planet.degree), true, `${fixture.id}:${planet.key}`);
      assert.equal(Number.isInteger(planet.minutes), true, `${fixture.id}:${planet.key}`);
      assert.equal(diff <= tolerance, true, `${fixture.id}:${planet.key} diff=${diff}`);
    }
  }

  assert.equal(maxDiffs.moon <= getReferenceToleranceForPlanet('moon'), true);
  assert.equal(maxDiffs.sun <= getReferenceToleranceForPlanet('sun'), true);
});

test('provider reports selected UTC reference fixtures as validated', () => {
  const capabilities = getAstronomyEngineProviderCapabilities();

  assert.equal(capabilities.fixtureValidation, 'validated-selected-utc-reference-fixtures');
  assert.equal(capabilities.referenceProvider, 'swisseph');
  assert.equal(capabilities.referenceValidationFeatures.planets, true);
  assert.equal(capabilities.referenceValidationFeatures.houses, false);
  assert.equal(capabilities.referenceValidationFeatures.ascMc, false);
  assert.equal(capabilities.referenceValidationFeatures.transits, false);
  assert.equal(capabilities.referenceValidationFeatures.retrograde, true);
  assert.equal(capabilities.referenceValidationFeatures.speed, true);
});

test('astronomy-engine provider matches Swiss Ephemeris reference longitude speeds within tolerance', () => {
  for (const fixture of NATAL_PROVIDER_REFERENCE_FIXTURES) {
    const result = calculateAstronomyEnginePlanetPositions({
      utcDateTime: fixture.utcDateTime,
      zodiac: fixture.zodiac,
    });
    const reference = getSwissEphReferenceSpeeds(fixture.utcDateTime);

    assert.equal(result.status, 'ready', fixture.id);
    assert.notEqual(reference, null, fixture.id);

    for (const planet of result.planets) {
      const referenceSpeed = reference[planet.key];
      const tolerance = getReferenceSpeedToleranceForPlanet(planet.key);
      const diff = Math.abs(planet.speed - referenceSpeed);

      assert.equal(Number.isFinite(planet.speed), true, `${fixture.id}:${planet.key}`);
      assert.equal(diff <= tolerance, true, `${fixture.id}:${planet.key} speed diff=${diff}`);
    }
  }
});

test('retrograde boolean matches Swiss Ephemeris reference for retrograde-sensitive fixtures', () => {
  const sensitiveFixtures = NATAL_PROVIDER_REFERENCE_FIXTURES
    .filter((fixture) => fixture.categories.includes('retrogradeSensitive'));

  assert.equal(sensitiveFixtures.length >= 2, true);

  for (const fixture of sensitiveFixtures) {
    const result = calculateAstronomyEnginePlanetPositions({
      utcDateTime: fixture.utcDateTime,
      zodiac: fixture.zodiac,
    });
    const reference = getSwissEphReferenceSpeeds(fixture.utcDateTime);

    for (const planet of result.planets) {
      assert.equal(
        planet.retrograde,
        reference[planet.key] < 0,
        `${fixture.id}:${planet.key}`,
      );
    }
  }
});

test('reference validation does not approve houses ASC MC transits or UI', () => {
  const result = calculateAstronomyEnginePlanetPositions({
    utcDateTime: NATAL_PROVIDER_REFERENCE_FIXTURES[0].utcDateTime,
    zodiac: 'tropical',
  });
  const appSource = readFileSync(new URL('../src/app.js', import.meta.url), 'utf8');
  const markup = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  const serviceWorker = readFileSync(new URL('../sw.js', import.meta.url), 'utf8');

  assert.deepEqual(result.houses, []);
  assert.deepEqual(result.points, []);
  assert.deepEqual(result.transits, []);
  assert.equal(result.capabilities.houses, false);
  assert.equal(result.capabilities.ascMc, false);
  assert.equal(result.capabilities.transits, false);
  assert.equal(result.capabilities.retrograde, true);
  assert.equal(result.capabilities.speed, true);
  assert.equal(appSource.includes('astronomyEngineProvider'), false);
  assert.equal(markup.includes('Натальная карта'), false);
  assert.equal(markup.includes('Таблица планет'), false);
  assert.equal(serviceWorker.includes('astronomyEngineProvider'), false);
});

test('package dependencies remain limited to approved astronomy-engine runtime provider', () => {
  const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));

  assert.deepEqual(packageJson.dependencies, {
    'astronomy-engine': '2.1.19',
  });
});
