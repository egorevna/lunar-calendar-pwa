import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import * as Astronomy from 'astronomy-engine';

import {
  auditAstronomyEngineProviderSource,
  calculateAstronomyEnginePlanetPositions,
  getAstronomyEngineProviderCapabilities,
  getAstronomyEngineProviderInfo,
} from '../src/astronomyEngineProvider.js';

const validProviderInput = {
  utcDateTime: '2000-01-01T09:00:00.000Z',
  zodiac: 'tropical',
  bodies: ['sun', 'moon'],
};

const allPlanetsInput = {
  utcDateTime: '2000-01-01T09:00:00.000Z',
  zodiac: 'tropical',
};

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

test('astronomy-engine package imports', () => {
  assert.equal(typeof Astronomy.Body, 'object');
  assert.equal(typeof Astronomy.SunPosition, 'function');
  assert.equal(typeof Astronomy.EclipticGeoMoon, 'function');
  assert.equal(typeof Astronomy.GeoVector, 'function');
  assert.equal(typeof Astronomy.Ecliptic, 'function');
});

test('provider info exposes astronomy-engine identity and version', () => {
  const info = getAstronomyEngineProviderInfo();

  assert.equal(info.provider, 'astronomy-engine');
  assert.equal(info.packageName, 'astronomy-engine');
  assert.equal(info.version, '2.1.19');
  assert.equal(info.browserCompatible, true);
  assert.equal(info.backendRequired, false);
  assert.equal(info.cloudRequired, false);
});

test('provider capabilities expose candidate planet calculation with selected fixture validation', () => {
  const capabilities = getAstronomyEngineProviderCapabilities();

  assert.equal(capabilities.provider, 'astronomy-engine');
  assert.equal(capabilities.status, 'ready');
  assert.equal(capabilities.planets, true);
  assert.equal(capabilities.tropical, true);
  assert.equal(capabilities.fixtureValidation, 'validated-selected-utc-reference-fixtures');
  assert.equal(capabilities.referenceProvider, 'swisseph');
  assert.equal(capabilities.houses, false);
  assert.equal(capabilities.ascMc, false);
  assert.equal(capabilities.transits, false);
  assert.equal(capabilities.apiPathStatus, 'identified-pending-reference-validation');
});

test('source audit does not find executable network behavior', async () => {
  const audit = await auditAstronomyEngineProviderSource();

  assert.equal(audit.ok, true);
  assert.equal(audit.packageName, 'astronomy-engine');
  assert.deepEqual(audit.networkApiMatches, []);
  assert.deepEqual(audit.executableRemoteUrlMatches, []);
  assert.equal(audit.networkBehaviorFound, false);
  assert.equal(audit.remoteUrlReferences.length > 0, true);
});

test('invalid input returns incomplete', () => {
  const result = calculateAstronomyEnginePlanetPositions({ zodiac: 'tropical' });

  assert.equal(result.status, 'incomplete');
  assert.deepEqual(result.planets, []);
  assert.equal(result.capabilities.planets, false);
  assert.equal(result.errors.includes('utcDateTime is required'), true);
});

test('valid input returns ready candidate planet positions', () => {
  const result = calculateAstronomyEnginePlanetPositions(validProviderInput);

  assert.equal(result.status, 'ready');
  assert.equal(result.provider, 'astronomy-engine');
  assert.equal(result.reason, 'Candidate positions calculated; selected UTC reference fixtures passed Swiss Ephemeris validation.');
  assert.equal(result.capabilities.planets, true);
  assert.equal(result.capabilities.tropical, true);
  assert.equal(result.metadata.fixtureValidation, 'validated-selected-utc-reference-fixtures');
  assert.deepEqual(result.planets.map((planet) => planet.key), ['sun', 'moon']);
});

test('valid input defaults to all 10 required natal planet keys', () => {
  const result = calculateAstronomyEnginePlanetPositions(allPlanetsInput);

  assert.equal(result.status, 'ready');
  assert.deepEqual(result.planets.map((planet) => planet.key), REQUIRED_PLANET_KEYS);
});

test('calculated planet positions are finite normalized values with sign and degree', () => {
  const result = calculateAstronomyEnginePlanetPositions(allPlanetsInput);

  for (const planet of result.planets) {
    assert.equal(Number.isFinite(planet.longitude), true, planet.key);
    assert.equal(planet.longitude >= 0, true, planet.key);
    assert.equal(planet.longitude < 360, true, planet.key);
    assert.equal(typeof planet.sign.key, 'string', planet.key);
    assert.equal(typeof planet.sign.ru, 'string', planet.key);
    assert.equal(Number.isInteger(planet.degree), true, planet.key);
    assert.equal(Number.isInteger(planet.minutes), true, planet.key);
    assert.equal(planet.retrograde, null, planet.key);
    assert.equal(planet.speed, null, planet.key);
    assert.equal(planet.source, 'astronomy-engine', planet.key);
  }
});

test('provider does not create fake houses ASC MC transits or orbs', () => {
  const serialized = JSON.stringify(calculateAstronomyEnginePlanetPositions(allPlanetsInput));

  assert.equal(serialized.includes('Луна в 7 доме'), false);
  assert.equal(serialized.includes('Марс □ ASC'), false);
  assert.equal(serialized.includes('Плутон ☌ Венера'), false);
  assert.equal(serialized.includes('орб'), false);
});

test('houses ASC MC and transits remain notSupported', () => {
  const result = calculateAstronomyEnginePlanetPositions(allPlanetsInput);

  assert.deepEqual(result.houses, []);
  assert.deepEqual(result.points, []);
  assert.deepEqual(result.transits, []);
  assert.equal(result.capabilities.houses, false);
  assert.equal(result.capabilities.ascMc, false);
  assert.equal(result.capabilities.transits, false);
  assert.equal(result.capabilities.retrograde, false);
  assert.equal(result.capabilities.speed, false);
});

test('package.json contains approved astronomy-engine version', () => {
  const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));

  assert.equal(packageJson.dependencies['astronomy-engine'], '2.1.19');
});

test('user-facing app entry and markup do not import provider or expose natal UI', () => {
  const appSource = readFileSync(new URL('../src/app.js', import.meta.url), 'utf8');
  const markup = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

  assert.equal(appSource.includes('astronomyEngineProvider'), false);
  assert.equal(appSource.includes('astronomy-engine'), false);
  assert.equal(markup.includes('Натальная карта'), false);
  assert.equal(markup.includes('Таблица планет'), false);
  assert.equal(markup.includes('ASC'), false);
  assert.equal(markup.includes('MC'), false);
});
