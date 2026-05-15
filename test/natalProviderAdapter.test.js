import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import {
  createNotSupportedNatalProviderAdapter,
  getDefaultNatalProviderAdapter,
  getNatalProviderAdapterCapabilities,
  NATAL_PROVIDER_ADAPTER_STATUS,
  runNatalProviderAdapter,
  validateNatalProviderAdapter,
} from '../src/natalProviderAdapter.js';

const validAdapterInput = {
  utcDateTime: '2000-01-01T09:00:00.000Z',
  zodiac: 'tropical',
  bodies: ['sun', 'moon'],
};

function createMockReadyAdapter(overrides = {}) {
  return {
    name: 'test-ready-adapter',
    version: '0.0.0-test',
    status: NATAL_PROVIDER_ADAPTER_STATUS.READY,
    capabilities: {
      planets: true,
      moon: true,
      retrograde: false,
      speed: false,
      houses: false,
      ascMc: false,
      tropical: true,
      sidereal: false,
      ...overrides.capabilities,
    },
    reason: '',
    calculatePlanets: overrides.calculatePlanets ?? (() => ({
      planets: [
        {
          key: 'sun',
          label: 'Солнце',
          longitude: 45.5,
          retrograde: false,
          source: 'test-mock',
        },
      ],
      metadata: {
        calculatedAt: '2026-05-15T00:00:00.000Z',
      },
    })),
    calculateHouses: overrides.calculateHouses,
  };
}

test('getDefaultNatalProviderAdapter returns notSupported adapter', () => {
  const adapter = getDefaultNatalProviderAdapter();

  assert.equal(adapter.name, null);
  assert.equal(adapter.version, null);
  assert.equal(adapter.status, NATAL_PROVIDER_ADAPTER_STATUS.NOT_SUPPORTED);
  assert.equal(adapter.reason, 'Real natal provider is not approved or connected.');
});

test('default adapter capabilities are all false', () => {
  const capabilities = getNatalProviderAdapterCapabilities(getDefaultNatalProviderAdapter());

  assert.deepEqual(capabilities, {
    provider: null,
    status: NATAL_PROVIDER_ADAPTER_STATUS.NOT_SUPPORTED,
    planets: false,
    moon: false,
    retrograde: false,
    speed: false,
    houses: false,
    ascMc: false,
    tropical: false,
    sidereal: false,
    reason: 'Real natal provider is not approved or connected.',
  });
});

test('validateNatalProviderAdapter accepts notSupported adapter', () => {
  assert.deepEqual(validateNatalProviderAdapter(getDefaultNatalProviderAdapter()), {
    ok: true,
    errors: [],
  });
});

test('validateNatalProviderAdapter rejects invalid adapter shape', () => {
  const result = validateNatalProviderAdapter({ status: 'ready' });

  assert.equal(result.ok, false);
  assert.equal(result.errors.includes('capabilities are required'), true);
});

test('ready adapter with planets capability requires calculatePlanets function', () => {
  const result = validateNatalProviderAdapter({
    ...createMockReadyAdapter(),
    calculatePlanets: undefined,
  });

  assert.equal(result.ok, false);
  assert.equal(result.errors.includes('calculatePlanets function is required when planets capability is true'), true);
});

test('runNatalProviderAdapter with default adapter returns notSupported without planets', () => {
  const result = runNatalProviderAdapter(getDefaultNatalProviderAdapter(), validAdapterInput);

  assert.equal(result.status, NATAL_PROVIDER_ADAPTER_STATUS.NOT_SUPPORTED);
  assert.equal(result.provider, null);
  assert.deepEqual(result.planets, []);
  assert.deepEqual(result.houses, []);
  assert.equal(result.capabilities.planets, false);
});

test('runNatalProviderAdapter with incomplete input returns incomplete', () => {
  const result = runNatalProviderAdapter(createMockReadyAdapter(), { zodiac: 'tropical' });

  assert.equal(result.status, NATAL_PROVIDER_ADAPTER_STATUS.INCOMPLETE);
  assert.deepEqual(result.planets, []);
  assert.equal(result.errors.includes('utcDateTime is required'), true);
});

test('runNatalProviderAdapter does not invent planets', () => {
  const result = runNatalProviderAdapter(createMockReadyAdapter({
    calculatePlanets: () => ({ planets: [] }),
  }), validAdapterInput);

  assert.equal(result.status, NATAL_PROVIDER_ADAPTER_STATUS.READY);
  assert.deepEqual(result.planets, []);
  assert.equal(result.capabilities.planets, false);
});

test('mock ready adapter can return explicit normalized planet data', () => {
  const result = runNatalProviderAdapter(createMockReadyAdapter(), validAdapterInput);

  assert.equal(result.status, NATAL_PROVIDER_ADAPTER_STATUS.READY);
  assert.equal(result.provider, 'test-ready-adapter');
  assert.equal(result.planets.length, 1);
  assert.equal(result.planets[0].key, 'sun');
  assert.equal(result.planets[0].sign.key, 'taurus');
  assert.equal(result.planets[0].degree, 15);
  assert.equal(result.planets[0].minutes, 30);
  assert.equal(result.capabilities.planets, true);
});

test('mock ready adapter does not create houses ASC MC or transits unless returned', () => {
  const result = runNatalProviderAdapter(createMockReadyAdapter(), validAdapterInput);

  assert.deepEqual(result.houses, []);
  assert.deepEqual(result.points, []);
  assert.deepEqual(result.transits, []);
  assert.equal(result.capabilities.houses, false);
  assert.equal(result.capabilities.ascMc, false);
  assert.equal(result.capabilities.transits, false);
});

test('production default does not use mock data or fake strings', () => {
  const serialized = JSON.stringify(runNatalProviderAdapter(getDefaultNatalProviderAdapter(), validAdapterInput));

  assert.equal(serialized.includes('test-mock'), false);
  assert.equal(serialized.includes('Луна в 7 доме'), false);
  assert.equal(serialized.includes('Марс □ ASC'), false);
  assert.equal(serialized.includes('Плутон ☌ Венера'), false);
  assert.equal(serialized.includes('орб'), false);
});

test('adapter module does not use network or device geolocation APIs', () => {
  const source = readFileSync(new URL('../src/natalProviderAdapter.js', import.meta.url), 'utf8');

  assert.equal(source.includes('fetch('), false);
  assert.equal(source.includes('navigator.geolocation'), false);
  assert.equal(source.includes('XMLHttpRequest'), false);
  assert.equal(source.includes('https://'), false);
});

test('createNotSupportedNatalProviderAdapter uses provided reason', () => {
  const adapter = createNotSupportedNatalProviderAdapter('custom reason');

  assert.equal(adapter.status, NATAL_PROVIDER_ADAPTER_STATUS.NOT_SUPPORTED);
  assert.equal(adapter.reason, 'custom reason');
});
