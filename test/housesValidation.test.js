import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import test from 'node:test';

import { getAngularDistance, normalizeDegrees } from '../src/astroMath.js';
import { calculateEqualHouseHouses } from '../src/equalHouseHouses.js';
import {
  calculateHousesForSelectedSystem,
  normalizeHouseSystemValue,
  resolveHouseSystemSelection,
} from '../src/houseSystemResolver.js';
import { calculatePlacidusHouses } from '../src/placidusHouses.js';
import { calculateWholeSignHouses } from '../src/wholeSignHouses.js';
import {
  HOUSE_SYSTEM_VALIDATION_FIXTURES,
  getHouseSystemValidationFixture,
  getHouseSystemValidationFixtureCategories,
  getHouseSystemValidationFixtureIds,
} from './fixtures/housesValidationFixtures.js';
import {
  PLACIDUS_BENCHMARK_FIXTURES,
  PLACIDUS_UNSUPPORTED_FIXTURES,
} from './fixtures/placidusFixtures.js';

const REQUIRED_CATEGORIES = Object.freeze([
  'wholeSignSequences',
  'equalHouseCusps',
  'placidusBenchmarks',
  'routerSelection',
  'guardrailFailures',
  'noFallback',
  'privacy',
  'strictExclusions',
]);

const SAFE_PROFILE_BASE = Object.freeze({
  id: 'synthetic-house-validation-profile',
  name: 'Synthetic Profile',
  birthDate: '1990-01-01',
  birthTime: '12:00',
  birthTimeAccuracy: 'exact',
  birthPlace: Object.freeze({
    city: 'Synthetic City',
    country: 'Testland',
    latitude: 12.345678,
    longitude: 78.901234,
    timezone: 'Etc/UTC',
  }),
  currentPlace: Object.freeze({
    mode: 'moscow',
    city: 'Москва',
    country: 'Россия',
    latitude: null,
    longitude: null,
    timezone: 'Europe/Moscow',
  }),
  zodiac: 'tropical',
});

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function makeProfile(overrides = {}) {
  const profile = clone(SAFE_PROFILE_BASE);

  return {
    ...profile,
    ...overrides,
    birthPlace: overrides.birthPlace === null
      ? null
      : {
        ...profile.birthPlace,
        ...(overrides.birthPlace ?? {}),
      },
  };
}

function makeGuardrailProfile(fixture) {
  const houseSystem = fixture.input.houseSystem ?? 'wholeSign';

  if (fixture.input.issue === 'missingProfile') {
    return null;
  }

  if (fixture.input.issue === 'commonDay') {
    return { type: 'commonDay', houseSystem };
  }

  if (fixture.input.issue === 'unknownBirthTime') {
    return makeProfile({ houseSystem, birthTime: '', birthTimeAccuracy: 'unknown' });
  }

  if (fixture.input.issue === 'missingBirthPlace') {
    return makeProfile({ houseSystem, birthPlace: null });
  }

  if (fixture.input.issue === 'cityWithoutCoordinates') {
    return makeProfile({
      houseSystem,
      birthPlace: {
        city: 'Synthetic City',
        country: 'Testland',
        timezone: 'Etc/UTC',
        latitude: undefined,
        longitude: undefined,
      },
    });
  }

  if (fixture.input.issue === 'countryRegionOnly') {
    return makeProfile({
      houseSystem,
      birthPlace: {
        city: '',
        country: 'Testland',
        region: 'Synthetic Region',
        timezone: 'Etc/UTC',
        latitude: undefined,
        longitude: undefined,
      },
    });
  }

  if (fixture.input.issue === 'invalidCoordinates') {
    return makeProfile({
      houseSystem,
      birthPlace: {
        city: 'Synthetic City',
        country: 'Testland',
        timezone: 'Etc/UTC',
        latitude: '12.345678',
        longitude: '78.901234',
      },
    });
  }

  return makeProfile({ houseSystem });
}

function assertClose(actual, expected, tolerance = 1e-9) {
  assert.equal(Number.isFinite(actual), true);
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} should be close to ${expected}`);
}

function assertAngleClose(actual, expected, tolerance = 0.05) {
  const distance = getAngularDistance(actual, expected);

  assert.notEqual(distance, null);
  assert.ok(distance <= tolerance, `${actual} should be within ${tolerance}° of ${expected}`);
}

function assertSafeOutput(value) {
  const json = JSON.stringify(value);

  assert.equal(json.includes('1990-01-01'), false);
  assert.equal(json.includes('12:00'), false);
  assert.equal(json.includes('Etc/UTC'), false);
  assert.equal(json.includes('12.345678'), false);
  assert.equal(json.includes('78.901234'), false);
  assert.equal(json.includes('"birthDate"'), false);
  assert.equal(json.includes('"birthTime"'), false);
  assert.equal(json.includes('"birthPlace"'), false);
  assert.equal(json.includes('"utcDateTime"'), false);
  assert.equal(json.includes('"synthetic-house-validation-profile"'), false);
  assert.equal(json.includes('NaN'), false);
  assert.equal(json.includes('undefined'), false);
  assert.equal(json.includes('фаталь'), false);
  assert.equal(json.includes('карми'), false);
}

function isEqualHouseSpacing(cusps, tolerance = 0.01) {
  return cusps.every((cusp, index) => {
    const next = cusps[(index + 1) % cusps.length];
    const spacing = normalizeDegrees(next.longitude - cusp.longitude);

    return spacing !== null && Math.abs(spacing - 30) <= tolerance;
  });
}

function isWholeSignBoundaryOnly(cusps, tolerance = 0.01) {
  return cusps.every((cusp) => {
    const normalized = normalizeDegrees(cusp.longitude);

    return normalized !== null && Math.abs(normalized % 30) <= tolerance;
  });
}

test('houses validation fixtures are manually declared and categorized', () => {
  const ids = getHouseSystemValidationFixtureIds();
  const categories = getHouseSystemValidationFixtureCategories();
  const fixtureJson = JSON.stringify(HOUSE_SYSTEM_VALIDATION_FIXTURES);

  assert.equal(Array.isArray(HOUSE_SYSTEM_VALIDATION_FIXTURES), true);
  assert.equal(HOUSE_SYSTEM_VALIDATION_FIXTURES.length > 0, true);
  assert.equal(new Set(ids).size, ids.length);
  assert.deepEqual([...new Set(categories)].sort(), [...REQUIRED_CATEGORIES].sort());
  assert.equal(getHouseSystemValidationFixture(ids[0])?.id, ids[0]);
  assert.equal(getHouseSystemValidationFixture('unknown-fixture-id'), null);
  assert.equal(HOUSE_SYSTEM_VALIDATION_FIXTURES.every((fixture) => fixture.expected?.manuallyDeclared === true), true);
  assert.equal(fixtureJson.includes('generatedByEngine'), false);
  assert.equal(fixtureJson.includes('Егор'), false);
  assert.equal(fixtureJson.includes('Егоревна'), false);
  assert.equal(fixtureJson.includes('birthDate'), false);
  assert.equal(fixtureJson.includes('birthTime'), false);
  assert.equal(fixtureJson.includes('coordinates'), false);
});

test('Whole Sign validation fixtures match manual zodiac sequences', () => {
  const fixtures = HOUSE_SYSTEM_VALIDATION_FIXTURES
    .filter((fixture) => fixture.category === 'wholeSignSequences');

  assert.equal(fixtures.length, 3);

  for (const fixture of fixtures) {
    const result = calculateWholeSignHouses(fixture.input.asc);
    const sequence = result.houses.map((house) => house.sign.key);

    assert.equal(result.status, fixture.expected.status);
    assert.equal(result.houseSystem, 'whole-sign');
    assert.equal(result.houseSystemLabel.includes('Placidus'), false);
    assert.equal(result.houseSystemLabel.includes('Равнодом'), false);
    assert.deepEqual(sequence, fixture.expected.houseSequence);
    assert.equal(result.houses[0].sign.key, fixture.input.asc.sign.key);
    assert.equal(result.houses[11].sign.key, fixture.expected.houseSequence[11]);
    assert.equal('cusps' in result, false);
    assert.equal(result.houses.some((house) => 'cusp' in house), false);
  }
});

test('Equal House validation fixtures match manual cusp longitudes and labels', () => {
  const fixtures = HOUSE_SYSTEM_VALIDATION_FIXTURES
    .filter((fixture) => fixture.category === 'equalHouseCusps');

  assert.equal(fixtures.length, 3);

  for (const fixture of fixtures) {
    const result = calculateEqualHouseHouses(fixture.input.asc);
    const longitudes = result.cusps.map((cusp) => cusp.longitude);

    assert.equal(result.status, fixture.expected.status);
    assert.equal(result.houseSystem, 'equal-house');
    assert.equal(result.houseSystemLabel, 'Равнодомная');
    assert.equal(result.houseSystemLabel.includes('Placidus'), false);
    assert.equal(result.houseSystemLabel.includes('Whole Sign'), false);
    assert.deepEqual(longitudes, fixture.expected.cuspLongitudes);
    assert.equal(result.cusps[0].longitude, fixture.input.asc.longitude);

    result.cusps.forEach((cusp, index) => {
      const expected = fixture.expected.cusps[index];

      assert.equal(cusp.number, expected.number);
      assert.equal(cusp.sign.key, expected.sign);
      assert.equal(cusp.degree, expected.degree);
      assert.equal(cusp.minutes, expected.minutes);
      assert.equal(cusp.text, expected.text);
      assertClose(cusp.longitude, fixture.expected.cuspLongitudes[index]);

      const next = result.cusps[(index + 1) % result.cusps.length];
      assertClose(normalizeDegrees(next.longitude - cusp.longitude), 30);
    });
  }
});

test('Placidus benchmark fixtures are static and validate active Placidus output', async () => {
  const source = await readFile(new URL('./fixtures/placidusFixtures.js', import.meta.url), 'utf8');
  const validationFixture = getHouseSystemValidationFixture('placidus-static-benchmarks');
  const notEqualHouseFixture = PLACIDUS_BENCHMARK_FIXTURES
    .find((fixture) => !isEqualHouseSpacing(fixture.expected.cusps));
  const notWholeSignFixture = PLACIDUS_BENCHMARK_FIXTURES
    .find((fixture) => !isWholeSignBoundaryOnly(fixture.expected.cusps));

  assert.equal(validationFixture.expected.minBenchmarkCount <= PLACIDUS_BENCHMARK_FIXTURES.length, true);
  assert.equal(source.includes('import swisseph'), false);
  assert.equal(source.includes('swe_houses('), false);
  assert.equal(PLACIDUS_BENCHMARK_FIXTURES.length >= 5, true);
  assert.notEqual(notEqualHouseFixture, undefined);
  assert.notEqual(notWholeSignFixture, undefined);

  for (const fixture of PLACIDUS_BENCHMARK_FIXTURES) {
    const result = calculatePlacidusHouses(fixture.input);
    const tolerance = fixture.expected.toleranceDegrees;

    assert.equal(fixture.expected.source, 'local-swisseph-swe_houses-benchmark');
    assert.equal(fixture.expected.cusps.length, 12);
    assert.equal(fixture.expected.cusps.every((cusp) => Number.isFinite(cusp.longitude)), true);
    assert.equal(result.status, 'ready');
    assert.equal(result.houseSystem, 'placidus');
    assert.equal(result.cusps.length, 12);
    assert.equal(result.houses.length, 12);
    assertAngleClose(result.cusps[0].longitude, fixture.expected.ascendant, tolerance);
    assertAngleClose(result.cusps[9].longitude, fixture.expected.mc, tolerance);
    assertAngleClose(result.cusps[6].longitude, fixture.expected.ascendant + 180, tolerance);
    assertAngleClose(result.cusps[3].longitude, fixture.expected.mc + 180, tolerance);

    result.cusps.forEach((cusp, index) => {
      assertAngleClose(cusp.longitude, fixture.expected.cusps[index].longitude, tolerance);
    });
  }
});

test('Placidus unsupported fixture fails closed without fallback', () => {
  const fixture = PLACIDUS_UNSUPPORTED_FIXTURES[0];
  const result = calculatePlacidusHouses(fixture.input);

  assert.equal(result.status, fixture.expected.status);
  assert.equal(result.ready, false);
  assert.equal(result.reason, fixture.expected.reason);
  assert.equal(result.houseSystem, 'placidus');
  assert.equal(result.houses.length, 0);
  assert.equal(result.cusps.length, 0);
});

test('router selection fixtures normalize aliases and route to selected systems', () => {
  const fixtures = HOUSE_SYSTEM_VALIDATION_FIXTURES
    .filter((fixture) => fixture.category === 'routerSelection');

  assert.equal(fixtures.length, 9);

  for (const fixture of fixtures) {
    const profile = fixture.input.missingHouseSystem
      ? makeProfile()
      : makeProfile({ houseSystem: fixture.input.houseSystem });

    if (fixture.input.missingHouseSystem) {
      delete profile.houseSystem;
    }

    const selection = resolveHouseSystemSelection(profile);
    const result = calculateHousesForSelectedSystem(profile);

    assert.equal(normalizeHouseSystemValue(fixture.input.houseSystem), fixture.expected.normalized);
    assert.equal(selection.status, fixture.expected.selectionStatus);
    assert.equal(selection.selectedHouseSystem, fixture.expected.selectedHouseSystem);
    assert.equal(selection.selectionSource, fixture.expected.selectionSource);
    assert.equal(selection.defaulted, fixture.expected.defaulted);
    assert.equal(result.status, fixture.expected.status);
    assert.equal(result.selectedHouseSystem, fixture.expected.selectedHouseSystem);
    assert.equal(result.houseSystem, fixture.expected.houseSystem);
    assert.equal(result.reason, fixture.expected.reason);
    assertSafeOutput(result);
  }
});

test('no-fallback fixtures preserve selected systems and reasons', () => {
  const fixtures = HOUSE_SYSTEM_VALIDATION_FIXTURES
    .filter((fixture) => fixture.category === 'noFallback');

  for (const fixture of fixtures) {
    const profile = makeProfile({
      houseSystem: fixture.input.houseSystem,
      ...(fixture.input.highLatitude
        ? {
          birthPlace: {
            city: 'Synthetic North',
            country: 'Testland',
            latitude: 67,
            longitude: 18.9553,
            timezone: 'Etc/UTC',
          },
        }
        : {}),
    });
    const result = calculateHousesForSelectedSystem(profile);

    assert.equal(result.status, fixture.expected.status);
    assert.equal(result.houseSystem, fixture.expected.houseSystem);
    assert.equal(result.selectedHouseSystem, fixture.expected.selectedHouseSystem);
    assert.equal(result.reason, fixture.expected.reason);
    assert.notEqual(result.houseSystem, fixture.expected.forbiddenHouseSystem);
    assertSafeOutput(result);
  }
});

test('guardrail fixtures block all systems without fake houses', () => {
  const fixtures = HOUSE_SYSTEM_VALIDATION_FIXTURES
    .filter((fixture) => fixture.category === 'guardrailFailures');

  for (const fixture of fixtures) {
    const profile = makeGuardrailProfile(fixture);
    const result = calculateHousesForSelectedSystem(profile);

    assert.equal(result.status, fixture.expected.status);
    assert.equal(result.ready, false);
    assert.equal(result.reason, fixture.expected.reason);
    assert.equal(result.houses.length, 0);
    assert.equal(result.cusps.length, 0);
    assertSafeOutput(result);
  }
});

test('privacy and strict exclusion fixtures are enforced across outputs and source', async () => {
  const readyOutputs = [
    calculateHousesForSelectedSystem(makeProfile({ houseSystem: 'wholeSign' })),
    calculateHousesForSelectedSystem(makeProfile({ houseSystem: 'equal' })),
    calculateHousesForSelectedSystem(makeProfile({ houseSystem: 'placidus' })),
    calculateHousesForSelectedSystem(makeProfile({ houseSystem: 'unknown' })),
    calculateHousesForSelectedSystem(makeGuardrailProfile(getHouseSystemValidationFixture('guardrail-unknown-birth-time'))),
  ];
  const sources = Object.freeze({
    resolver: await readFile(new URL('../src/houseSystemResolver.js', import.meta.url), 'utf8'),
    placidus: await readFile(new URL('../src/placidusHouses.js', import.meta.url), 'utf8'),
    wholeSign: await readFile(new URL('../src/wholeSignHouses.js', import.meta.url), 'utf8'),
    equalHouse: await readFile(new URL('../src/equalHouseHouses.js', import.meta.url), 'utf8'),
  });

  readyOutputs.forEach(assertSafeOutput);
  assert.equal(sources.resolver.includes('provider'), false);
  assert.equal(sources.resolver.includes('localStorage'), false);
  assert.equal(sources.resolver.includes('document.'), false);
  assert.equal(sources.resolver.includes('window.'), false);
  assert.equal(sources.resolver.includes('normalizeDegrees'), false);
  assert.equal(sources.resolver.includes('Math.sin'), false);
  assert.equal(sources.resolver.includes('calculatePlacidusCusp'), false);
  assert.equal(sources.resolver.includes('getEqualHouseCuspLongitudes'), false);
  assert.equal(sources.placidus.includes("from 'swisseph'"), false);
  assert.equal(sources.placidus.includes('from "swisseph"'), false);
  assert.equal(sources.placidus.includes("from './wholeSignHouses.js'"), false);
  assert.equal(sources.placidus.includes("from './equalHouseHouses.js'"), false);
  assert.equal(sources.wholeSign.includes("from './equalHouseHouses.js'"), false);
  assert.equal(sources.wholeSign.includes("from './placidusHouses.js'"), false);
  assert.equal(sources.equalHouse.includes("from './wholeSignHouses.js'"), false);
  assert.equal(sources.equalHouse.includes("from './placidusHouses.js'"), false);
  assert.equal(sources.resolver.includes('planetInHouse: true'), false);
  assert.equal(sources.placidus.includes('planetInHouse: true'), false);
  await assert.rejects(access(new URL('../src/houses.js', import.meta.url)));
  await assert.rejects(access(new URL('../src/houseSystems.js', import.meta.url)));
});
