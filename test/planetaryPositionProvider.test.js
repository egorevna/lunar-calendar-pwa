import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import {
  createPlanetaryProviderNotSupportedResult,
  getPlanetaryPositions,
  getPlanetaryProviderCapabilities,
  getRequiredPlanetKeys,
  NATAL_PLANET_KEYS,
  normalizePlanetaryPosition,
  PLANETARY_PROVIDER_STATUS,
  validatePlanetaryProviderInput,
} from '../src/planetaryPositionProvider.js';

const validProviderInput = {
  utcDateTime: '1990-05-12T05:45:00.000Z',
  zodiac: 'tropical',
  bodies: ['sun', 'moon', 'mercury'],
};

test('getPlanetaryProviderCapabilities returns notSupported and all capabilities false', () => {
  assert.deepEqual(getPlanetaryProviderCapabilities(), {
    provider: null,
    status: PLANETARY_PROVIDER_STATUS.NOT_SUPPORTED,
    planets: false,
    retrograde: false,
    speed: false,
    tropical: false,
    sidereal: false,
    reason: 'Planetary position provider is not connected.',
  });
});

test('getRequiredPlanetKeys returns the 10 main planets', () => {
  assert.deepEqual(getRequiredPlanetKeys(), [
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
  ]);
  assert.deepEqual(NATAL_PLANET_KEYS, getRequiredPlanetKeys());
});

test('validatePlanetaryProviderInput rejects missing utcDateTime', () => {
  const result = validatePlanetaryProviderInput({ zodiac: 'tropical', bodies: ['sun'] });

  assert.equal(result.ok, false);
  assert.equal(result.errors.includes('utcDateTime is required'), true);
});

test('validatePlanetaryProviderInput accepts valid-looking UTC input with tropical zodiac and bodies', () => {
  const result = validatePlanetaryProviderInput(validProviderInput);

  assert.equal(result.ok, true);
  assert.deepEqual(result.errors, []);
  assert.equal(result.utcDateTime, '1990-05-12T05:45:00.000Z');
  assert.equal(result.zodiac, 'tropical');
  assert.deepEqual(result.bodies, ['sun', 'moon', 'mercury']);
});

test('validatePlanetaryProviderInput rejects unsupported zodiac and unknown bodies', () => {
  const sidereal = validatePlanetaryProviderInput({ ...validProviderInput, zodiac: 'sidereal' });
  const unknownBody = validatePlanetaryProviderInput({
    ...validProviderInput,
    bodies: ['sun', 'ceres'],
  });

  assert.equal(sidereal.ok, false);
  assert.equal(sidereal.errors.includes('zodiac must be tropical'), true);
  assert.equal(unknownBody.ok, false);
  assert.equal(unknownBody.errors.includes('unsupported body: ceres'), true);
});

test('getPlanetaryPositions returns incomplete for missing input', () => {
  const result = getPlanetaryPositions(null);

  assert.equal(result.status, PLANETARY_PROVIDER_STATUS.INCOMPLETE);
  assert.deepEqual(result.planets, []);
  assert.equal(result.capabilities.planets, false);
  assert.equal(result.errors.includes('utcDateTime is required'), true);
});

test('getPlanetaryPositions returns notSupported for valid-looking input because provider is not connected', () => {
  const result = getPlanetaryPositions(validProviderInput);

  assert.equal(result.status, PLANETARY_PROVIDER_STATUS.NOT_SUPPORTED);
  assert.equal(result.reason, 'Planetary position provider is not connected.');
  assert.deepEqual(result.planets, []);
  assert.equal(result.provider, null);
});

test('createPlanetaryProviderNotSupportedResult returns a neutral empty provider result', () => {
  const result = createPlanetaryProviderNotSupportedResult('not connected');

  assert.equal(result.status, PLANETARY_PROVIDER_STATUS.NOT_SUPPORTED);
  assert.equal(result.reason, 'not connected');
  assert.deepEqual(result.planets, []);
  assert.deepEqual(result.capabilities, {
    planets: false,
    retrograde: false,
    speed: false,
    tropical: false,
    sidereal: false,
  });
  assert.deepEqual(result.metadata, {
    calculatedAt: null,
    input: null,
  });
});

test('normalizePlanetaryPosition derives sign and degree from valid longitude', () => {
  const position = normalizePlanetaryPosition({
    key: 'venus',
    label: 'Венера',
    longitude: 45.5,
    retrograde: true,
    speed: -0.2,
    source: 'fixture',
  });

  assert.equal(position.key, 'venus');
  assert.equal(position.label, 'Венера');
  assert.equal(position.longitude, 45.5);
  assert.equal(position.sign.key, 'taurus');
  assert.equal(position.degree, 15);
  assert.equal(position.minutes, 30);
  assert.equal(position.retrograde, true);
  assert.equal(position.speed, -0.2);
  assert.equal(position.source, 'fixture');
});

test('normalizePlanetaryPosition does not return NaN for invalid longitude', () => {
  assert.equal(normalizePlanetaryPosition({ key: 'venus', longitude: Number.NaN }), null);
  assert.equal(normalizePlanetaryPosition({ key: 'venus', longitude: '45' }), null);
});

test('provider output does not contain fake longitudes or fake planets', () => {
  const incomplete = JSON.stringify(getPlanetaryPositions(null));
  const unsupported = JSON.stringify(getPlanetaryPositions(validProviderInput));

  assert.equal(incomplete.includes('"longitude"'), false);
  assert.equal(unsupported.includes('"longitude"'), false);
  assert.equal(unsupported.includes('"key":"sun"'), false);
  assert.equal(unsupported.includes('"key":"moon"'), false);
});

test('provider module does not use network or device geolocation APIs', () => {
  const source = readFileSync(new URL('../src/planetaryPositionProvider.js', import.meta.url), 'utf8');

  assert.equal(source.includes('fetch('), false);
  assert.equal(source.includes('navigator.geolocation'), false);
  assert.equal(source.includes('XMLHttpRequest'), false);
  assert.equal(source.includes('https://'), false);
});
