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

test('provider capabilities remain disabled until fixture validation', () => {
  const capabilities = getAstronomyEngineProviderCapabilities();

  assert.equal(capabilities.provider, 'astronomy-engine');
  assert.equal(capabilities.status, 'notSupported');
  assert.equal(capabilities.planets, false);
  assert.equal(capabilities.houses, false);
  assert.equal(capabilities.ascMc, false);
  assert.equal(capabilities.transits, false);
  assert.equal(capabilities.apiPathStatus, 'identified-not-fixture-validated');
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

test('valid input returns notSupported until geocentric tropical path is fixture-validated', () => {
  const result = calculateAstronomyEnginePlanetPositions(validProviderInput);

  assert.equal(result.status, 'notSupported');
  assert.equal(result.reason, 'Astronomy Engine geocentric tropical longitude path is not fixture-validated.');
  assert.deepEqual(result.planets, []);
  assert.equal(result.capabilities.planets, false);
});

test('provider does not create fake values before fixture validation', () => {
  const serialized = JSON.stringify(calculateAstronomyEnginePlanetPositions(validProviderInput));

  assert.equal(serialized.includes('"longitude"'), false);
  assert.equal(serialized.includes('"degree"'), false);
  assert.equal(serialized.includes('"key":"sun"'), false);
  assert.equal(serialized.includes('"key":"moon"'), false);
});

test('houses ASC MC and transits remain notSupported', () => {
  const result = calculateAstronomyEnginePlanetPositions(validProviderInput);

  assert.deepEqual(result.houses, []);
  assert.deepEqual(result.points, []);
  assert.deepEqual(result.transits, []);
  assert.equal(result.capabilities.houses, false);
  assert.equal(result.capabilities.ascMc, false);
  assert.equal(result.capabilities.transits, false);
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
