import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import {
  calculatePlacidusHouses,
  calculatePlacidusHousesForProfile,
  calculatePlacidusHousesFromAscMc,
  getPlacidusCalculationLimitations,
  getPlacidusEngineCapabilities,
  getPlacidusUnsupportedResult,
  getPlacidusValidationStatus,
  isPlacidusHouseSystemValue,
  normalizePlacidusHouseSystemValue,
} from '../src/placidusHouses.js';
import {
  PLACIDUS_BENCHMARK_FIXTURES,
  PLACIDUS_UNSUPPORTED_FIXTURES,
  getPlacidusBenchmarkFixture,
  getPlacidusBenchmarkFixtureIds,
} from './fixtures/placidusFixtures.js';

const profileBase = Object.freeze({
  id: 'profile-placidus-ready',
  name: 'Анна',
  birthDate: '1990-01-01',
  birthTime: '12:00',
  birthTimeAccuracy: 'exact',
  birthPlace: Object.freeze({
    city: 'Москва',
    country: 'Россия',
    latitude: 55.7558,
    longitude: 37.6173,
    timezone: 'Europe/Moscow',
  }),
  currentPlace: Object.freeze({
    mode: 'moscow',
    city: 'Москва',
    country: 'Россия',
    latitude: null,
    longitude: null,
    timezone: 'Europe/Moscow',
  }),
  houseSystem: 'placidus',
  zodiac: 'tropical',
});

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function angularDelta(a, b) {
  const diff = Math.abs((((a - b) % 360) + 360) % 360);

  return Math.min(diff, 360 - diff);
}

function assertWithinTolerance(actual, expected, tolerance, message) {
  assert.ok(
    angularDelta(actual, expected) <= tolerance,
    `${message}: expected ${actual} within ${tolerance}° of ${expected}`,
  );
}

function assertSafeProfileOutput(value) {
  const json = JSON.stringify(value);

  assert.equal(json.includes('1990-01-01'), false);
  assert.equal(json.includes('12:00'), false);
  assert.equal(json.includes('Europe/Moscow'), false);
  assert.equal(json.includes('55.7558'), false);
  assert.equal(json.includes('37.6173'), false);
  assert.equal(json.includes('"birthDate"'), false);
  assert.equal(json.includes('"birthTime"'), false);
  assert.equal(json.includes('"birthPlace"'), false);
  assert.equal(json.includes('"profile-placidus-ready"'), false);
  assert.equal(json.includes('NaN'), false);
  assert.equal(json.includes('undefined'), false);
}

function assertReadyPlacidusResult(result) {
  assert.equal(result.status, 'ready');
  assert.equal(result.ready, true);
  assert.equal(result.houseSystem, 'placidus');
  assert.equal(result.houseSystemLabel, 'Placidus');
  assert.equal(result.cusps.length, 12);
  assert.equal(result.houses.length, 12);
  assert.equal(result.angles.asc.key, 'asc');
  assert.equal(result.angles.mc.key, 'mc');
  assert.equal(result.angles.dsc.key, 'dsc');
  assert.equal(result.angles.ic.key, 'ic');
}

function getImportDeclarations(source) {
  return source
    .split('\n')
    .filter((line) => line.trim().startsWith('import '));
}

function assertFiniteFixtureNumber(value, label) {
  assert.equal(
    Number.isFinite(value),
    true,
    `${label} must be a static finite number`,
  );
}

test('Placidus value helpers recognize Placidus and normalize current profile aliases', () => {
  assert.equal(isPlacidusHouseSystemValue('placidus'), true);
  assert.equal(isPlacidusHouseSystemValue('Placidus'), true);
  assert.equal(isPlacidusHouseSystemValue('wholeSign'), false);
  assert.equal(isPlacidusHouseSystemValue('whole-sign'), false);
  assert.equal(isPlacidusHouseSystemValue('equal'), false);
  assert.equal(isPlacidusHouseSystemValue('equal-house'), false);
  assert.equal(isPlacidusHouseSystemValue('equalHouse'), false);
  assert.equal(isPlacidusHouseSystemValue('unknown'), false);

  assert.equal(normalizePlacidusHouseSystemValue('placidus'), 'placidus');
  assert.equal(normalizePlacidusHouseSystemValue('Placidus'), 'placidus');
  assert.equal(normalizePlacidusHouseSystemValue('wholeSign'), 'whole-sign');
  assert.equal(normalizePlacidusHouseSystemValue('whole-sign'), 'whole-sign');
  assert.equal(normalizePlacidusHouseSystemValue('equal'), 'equal-house');
  assert.equal(normalizePlacidusHouseSystemValue('equal-house'), 'equal-house');
  assert.equal(normalizePlacidusHouseSystemValue('equalHouse'), 'equal-house');
  assert.equal(normalizePlacidusHouseSystemValue(null), null);
});

test('static Placidus benchmark fixtures are available and manually declared', async () => {
  assert.equal(PLACIDUS_BENCHMARK_FIXTURES.length >= 5, true);
  assert.deepEqual(getPlacidusBenchmarkFixtureIds(), [
    'greenwich-j2000-midday',
    'moscow-modern-midlatitude',
    'equator-march-equinox',
    'sydney-southern-hemisphere',
    'reykjavik-high-supported-latitude',
  ]);
  assert.equal(getPlacidusBenchmarkFixture('greenwich-j2000-midday').expected.source, 'local-swisseph-swe_houses-benchmark');

  const source = await readFile(new URL('./fixtures/placidusFixtures.js', import.meta.url), 'utf8');

  assert.equal(source.includes('calculatePlacidusHouses'), false);
  assert.equal(source.includes('swe_houses('), false);
  assert.equal(source.includes('birthDate'), false);
  assert.equal(source.includes('birthTime'), false);
});

test('static Placidus fixture expected values are finite numbers, not generated results', () => {
  for (const fixture of PLACIDUS_BENCHMARK_FIXTURES) {
    assertFiniteFixtureNumber(fixture.expected.ascendant, `${fixture.id}: ascendant`);
    assertFiniteFixtureNumber(fixture.expected.mc, `${fixture.id}: mc`);
    assertFiniteFixtureNumber(fixture.expected.toleranceDegrees, `${fixture.id}: tolerance`);

    assert.equal(Array.isArray(fixture.expected.cusps), true);
    assert.equal(fixture.expected.cusps.length, 12);
    fixture.expected.cusps.forEach((cusp, index) => {
      assert.equal(cusp.number, index + 1);
      assertFiniteFixtureNumber(cusp.longitude, `${fixture.id}: cusp ${cusp.number}`);
    });
  }
});

test('validation status and capabilities report activated benchmark-validated Placidus', () => {
  assert.deepEqual(getPlacidusValidationStatus(), {
    validated: true,
    implementationReady: true,
    dependencyPath: 'local-js-placidus-validated-against-static-swisseph-fixtures',
    benchmarkFixtures: true,
    benchmarkFixtureCount: PLACIDUS_BENCHMARK_FIXTURES.length,
    toleranceDegrees: 0.05,
    reason: null,
  });

  assert.deepEqual(getPlacidusEngineCapabilities(), {
    houses: true,
    placidus: true,
    placidusRecognized: true,
    placidusValidated: true,
    placidusReady: true,
    wholeSign: false,
    equalHouse: false,
    quadrantCusps: true,
    exactCusps: true,
    ascMcRequired: true,
    planetInHouse: false,
    interpretations: false,
    transits: false,
    fixedStars: false,
  });
});

test('calculatePlacidusHouses matches static swisseph benchmark cusp fixtures', () => {
  for (const fixture of PLACIDUS_BENCHMARK_FIXTURES) {
    const result = calculatePlacidusHouses(fixture.input);
    const tolerance = fixture.expected.toleranceDegrees;

    assertReadyPlacidusResult(result);
    assert.equal(result.validation.validated, true);
    assert.equal(result.validation.benchmarkFixtures, true);
    assertWithinTolerance(result.angles.asc.longitude, fixture.expected.ascendant, tolerance, `${fixture.id}: ASC`);
    assertWithinTolerance(result.angles.mc.longitude, fixture.expected.mc, tolerance, `${fixture.id}: MC`);

    fixture.expected.cusps.forEach((expectedCusp, index) => {
      const actualCusp = result.cusps[index];

      assert.equal(actualCusp.number, expectedCusp.number, `${fixture.id}: cusp number`);
      assertWithinTolerance(
        actualCusp.longitude,
        expectedCusp.longitude,
        tolerance,
        `${fixture.id}: cusp ${expectedCusp.number}`,
      );
    });
  }
});

test('Placidus cusps preserve angle relationships without Equal House or Whole Sign fallback', () => {
  const fixture = getPlacidusBenchmarkFixture('greenwich-j2000-midday');
  const result = calculatePlacidusHouses(fixture.input);
  const tolerance = fixture.expected.toleranceDegrees;

  assertWithinTolerance(result.cusps[0].longitude, result.angles.asc.longitude, tolerance, 'cusp 1 ASC');
  assertWithinTolerance(result.cusps[9].longitude, result.angles.mc.longitude, tolerance, 'cusp 10 MC');
  assertWithinTolerance(result.cusps[6].longitude, result.cusps[0].longitude + 180, tolerance, 'cusp 7 opposite 1');
  assertWithinTolerance(result.cusps[3].longitude, result.cusps[9].longitude + 180, tolerance, 'cusp 4 opposite 10');

  const equalHouseSequence = result.cusps.map((_, index) => (
    (result.cusps[0].longitude + (index * 30)) % 360
  ));
  const matchesEqualHouse = result.cusps.every((cusp, index) => (
    angularDelta(cusp.longitude, equalHouseSequence[index]) <= tolerance
  ));
  const matchesWholeSign = result.cusps.every((cusp) => Math.abs(cusp.longitude % 30) <= tolerance);

  assert.equal(matchesEqualHouse, false);
  assert.equal(matchesWholeSign, false);
});

test('Placidus returns houses with wrapped spans and safe formatted cusp labels', () => {
  const fixture = getPlacidusBenchmarkFixture('moscow-modern-midlatitude');
  const result = calculatePlacidusHouses(fixture.input);

  assertReadyPlacidusResult(result);
  result.houses.forEach((house, index) => {
    assert.equal(house.number, index + 1);
    assert.equal(house.cusp.number, index + 1);
    assert.equal(Number.isFinite(house.cusp.longitude), true);
    assert.equal(Number.isFinite(house.nextCuspLongitude), true);
    assert.equal(typeof house.wraps, 'boolean');
    assert.equal(house.label, `${index + 1} дом`);
    assert.equal(house.text.startsWith(`${index + 1} дом — `), true);
  });
  assert.equal(result.houses.some((house) => house.wraps), true);
});

test('high latitude unsupported fixture returns explicit unsupported status', () => {
  const fixture = PLACIDUS_UNSUPPORTED_FIXTURES[0];
  const result = calculatePlacidusHouses(fixture.input);

  assert.equal(result.status, fixture.expected.status);
  assert.equal(result.ready, false);
  assert.equal(result.reason, fixture.expected.reason);
  assert.deepEqual(result.houses, []);
  assert.deepEqual(result.cusps, []);
});

test('calculatePlacidusHousesFromAscMc fails closed when sidereal inputs are missing', () => {
  const result = calculatePlacidusHousesFromAscMc({
    status: 'ready',
    ready: true,
    angles: {
      asc: { longitude: 14.5 },
      mc: { longitude: 270 },
    },
  });

  assert.equal(result.status, 'notReady');
  assert.equal(result.reason, 'missingPlacidusCalculationInputs');
  assert.deepEqual(result.houses, []);
  assert.deepEqual(result.cusps, []);
});

test('calculatePlacidusHousesForProfile respects selected house system and guardrails', () => {
  const wholeSign = calculatePlacidusHousesForProfile({
    ...clone(profileBase),
    houseSystem: 'wholeSign',
  });
  const equal = calculatePlacidusHousesForProfile({
    ...clone(profileBase),
    houseSystem: 'equal',
  });
  const unknownTime = calculatePlacidusHousesForProfile({
    ...clone(profileBase),
    birthTime: '',
    birthTimeAccuracy: 'unknown',
  });
  const missingCoordinates = calculatePlacidusHousesForProfile({
    ...clone(profileBase),
    birthPlace: {
      ...clone(profileBase).birthPlace,
      latitude: null,
      longitude: null,
    },
  });

  assert.equal(wholeSign.status, 'unsupported');
  assert.equal(wholeSign.reason, 'selectedHouseSystemNotPlacidus');
  assert.equal(wholeSign.selectedHouseSystem, 'whole-sign');
  assert.equal(equal.status, 'unsupported');
  assert.equal(equal.reason, 'selectedHouseSystemNotPlacidus');
  assert.equal(equal.selectedHouseSystem, 'equal-house');
  assert.equal(unknownTime.status, 'notReady');
  assert.equal(unknownTime.reason, 'missingExactBirthTime');
  assert.equal(missingCoordinates.status, 'notReady');
  assert.equal(missingCoordinates.reason, 'cityWithoutCoordinates');
  [wholeSign, equal, unknownTime, missingCoordinates].forEach(assertSafeProfileOutput);
});

test('calculatePlacidusHousesForProfile returns ready for valid selected Placidus without mutating profile', () => {
  const profile = clone(profileBase);
  const before = clone(profile);
  const result = calculatePlacidusHousesForProfile(profile);

  assertReadyPlacidusResult(result);
  assert.deepEqual(profile, before);
  assertSafeProfileOutput(result);
});

test('unsupported helper remains available for future Placidus edge cases', () => {
  const result = getPlacidusUnsupportedResult('placidusUnsupportedAtLatitude');

  assert.equal(result.status, 'unsupported');
  assert.equal(result.ready, false);
  assert.equal(result.reason, 'placidusUnsupportedAtLatitude');
  assert.deepEqual(result.houses, []);
  assert.deepEqual(result.cusps, []);
});

test('limitations describe validation no fallback and no planet-in-house assignment', () => {
  const limitations = getPlacidusCalculationLimitations();

  assert.equal(limitations.some((item) => item.includes('benchmark fixtures')), true);
  assert.equal(limitations.some((item) => item.includes('не подменяется равнодомной системой')), true);
  assert.equal(limitations.some((item) => item.includes('не подменяется Whole Sign')), true);
  assert.equal(limitations.some((item) => item.includes('high-latitude')), true);
  assert.equal(limitations.some((item) => item.includes('не распределяет планеты')), true);
});

test('Placidus outputs avoid private data NaN undefined and fatalistic text', () => {
  const outputs = [
    getPlacidusValidationStatus(),
    getPlacidusEngineCapabilities(),
    getPlacidusCalculationLimitations(),
    calculatePlacidusHouses(getPlacidusBenchmarkFixture('sydney-southern-hemisphere').input),
    calculatePlacidusHousesForProfile(clone(profileBase)),
  ];
  const json = JSON.stringify(outputs);

  assert.equal(json.includes('NaN'), false);
  assert.equal(json.includes('undefined'), false);
  assert.equal(json.includes('1990-01-01'), false);
  assert.equal(json.includes('12:00'), false);
  assert.equal(json.includes('55.7558'), false);
  assert.equal(json.includes('37.6173'), false);
  assert.equal(json.includes('"birthPlace"'), false);
  assert.equal(json.includes('"birthDate"'), false);
  assert.equal(json.includes('"birthTime"'), false);
  assert.equal(/фаталь|карми|плохой|плохая|плохое/i.test(json), false);
});

test('module stays scoped to browser-safe Placidus without providers swisseph DOM storage router or planet assignment', async () => {
  const source = await readFile(new URL('../src/placidusHouses.js', import.meta.url), 'utf8');
  const imports = getImportDeclarations(source).join('\n');

  assert.equal(imports.includes('swisseph'), false);
  assert.equal(source.includes("from 'swisseph'"), false);
  assert.equal(source.includes('require("swisseph")'), false);
  assert.equal(imports.includes('astronomyEngineProvider'), false);
  assert.equal(imports.includes('planetaryPositionProvider'), false);
  assert.equal(imports.includes('profileStorage'), false);
  assert.equal(source.includes('localStorage'), false);
  assert.equal(source.includes('document.'), false);
  assert.equal(source.includes('window.'), false);
  assert.equal(imports.includes("from './houses.js'"), false);
  assert.equal(imports.includes("from './houseSystems.js'"), false);
  assert.equal(imports.includes("from './wholeSignHouses.js'"), false);
  assert.equal(imports.includes("from './equalHouseHouses.js'"), false);
  assert.equal(source.includes('calculateWholeSignHouses'), false);
  assert.equal(source.includes('calculateEqualHouse'), false);
  assert.equal(source.includes('assignPlanet'), false);
  assert.equal(source.includes('planetInHouse: true'), false);
});

test('package metadata keeps swisseph out of runtime dependencies', async () => {
  const packageJson = JSON.parse(
    await readFile(new URL('../package.json', import.meta.url), 'utf8'),
  );
  const packageLock = JSON.parse(
    await readFile(new URL('../package-lock.json', import.meta.url), 'utf8'),
  );

  assert.equal(packageJson.dependencies?.swisseph, undefined);
  assert.equal(packageJson.devDependencies?.swisseph, '^0.5.17');
  assert.equal(packageLock.packages?.['']?.dependencies?.swisseph, undefined);
  assert.equal(packageLock.packages?.['']?.devDependencies?.swisseph, '^0.5.17');
});

test('generic houses router files are not created by Task 11.4d2', () => {
  assert.equal(existsSync(new URL('../src/houses.js', import.meta.url)), false);
  assert.equal(existsSync(new URL('../src/houseSystems.js', import.meta.url)), false);
});
