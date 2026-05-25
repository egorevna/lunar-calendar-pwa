import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import {
  assignPlanetToHouse,
  assignPlanetsToHouses,
  assignPlanetsToHousesForProfile,
  findHouseForLongitude,
  getPlanetInHouseCapabilities,
  getPlanetInHouseLimitations,
  getPlanetInHouseSummary,
  isLongitudeInHouseSpan,
  resolvePlanetHouseInput,
} from '../src/planetInHouses.js';
import {
  PLANET_IN_HOUSES_FIXTURES,
  getPlanetInHousesFixture,
} from './fixtures/planetInHousesFixtures.js';

const SIGN_LABELS = Object.freeze({
  aries: ['Овен', '♈'],
  taurus: ['Телец', '♉'],
  gemini: ['Близнецы', '♊'],
  cancer: ['Рак', '♋'],
  leo: ['Лев', '♌'],
  virgo: ['Дева', '♍'],
  libra: ['Весы', '♎'],
  scorpio: ['Скорпион', '♏'],
  sagittarius: ['Стрелец', '♐'],
  capricorn: ['Козерог', '♑'],
  aquarius: ['Водолей', '♒'],
  pisces: ['Рыбы', '♓'],
});

const WHOLE_SIGN_SEQUENCES = Object.freeze({
  aries: Object.freeze([
    'aries',
    'taurus',
    'gemini',
    'cancer',
    'leo',
    'virgo',
    'libra',
    'scorpio',
    'sagittarius',
    'capricorn',
    'aquarius',
    'pisces',
  ]),
  scorpio: Object.freeze([
    'scorpio',
    'sagittarius',
    'capricorn',
    'aquarius',
    'pisces',
    'aries',
    'taurus',
    'gemini',
    'cancer',
    'leo',
    'virgo',
    'libra',
  ]),
});

const readyProfile = Object.freeze({
  id: 'planet-in-houses-profile',
  name: 'Мария',
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
  houseSystem: 'wholeSign',
  zodiac: 'tropical',
});

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function sign(signKey) {
  const [ru, symbol] = SIGN_LABELS[signKey];

  return Object.freeze({ key: signKey, ru, symbol });
}

function planet(key, label, longitude, signKey = null) {
  return Object.freeze({
    key,
    label,
    longitude,
    ...(signKey ? { sign: sign(signKey) } : {}),
  });
}

function buildWholeSignHouseResult(ascSignKey) {
  return Object.freeze({
    status: 'ready',
    ready: true,
    houseSystem: 'whole-sign',
    houseSystemLabel: 'Whole Sign',
    houses: Object.freeze(WHOLE_SIGN_SEQUENCES[ascSignKey].map((signKey, index) => Object.freeze({
      number: index + 1,
      sign: sign(signKey),
      label: `${index + 1} дом`,
      text: `${index + 1} дом — ${SIGN_LABELS[signKey][0]}`,
    }))),
    angles: Object.freeze({
      asc: Object.freeze({ key: 'asc', sign: sign(ascSignKey) }),
    }),
  });
}

function buildCuspHouseResult(houseSystem, label, cuspLongitudes) {
  const cusps = cuspLongitudes.map((longitude, index) => Object.freeze({
    number: index + 1,
    longitude,
    label: `Куспид ${index + 1} дома`,
  }));

  return Object.freeze({
    status: 'ready',
    ready: true,
    houseSystem,
    houseSystemLabel: label,
    cusps: Object.freeze(cusps),
    houses: Object.freeze(cusps.map((cusp, index) => {
      const nextCusp = cusps[(index + 1) % cusps.length];

      return Object.freeze({
        number: cusp.number,
        cusp,
        nextCuspLongitude: nextCusp.longitude,
        wraps: nextCusp.longitude < cusp.longitude,
        label: `${cusp.number} дом`,
      });
    })),
  });
}

function assignmentByPlanet(assignments) {
  return Object.fromEntries(assignments.map((assignment) => [
    assignment.planetKey,
    assignment.houseNumber,
  ]));
}

function assertNoSensitiveOutput(value) {
  const json = JSON.stringify(value);

  assert.equal(json.includes('1990-01-01'), false);
  assert.equal(json.includes('12:00'), false);
  assert.equal(json.includes('Europe/Moscow'), false);
  assert.equal(json.includes('55.7558'), false);
  assert.equal(json.includes('37.6173'), false);
  assert.equal(json.includes('"birthDate"'), false);
  assert.equal(json.includes('"birthTime"'), false);
  assert.equal(json.includes('"birthPlace"'), false);
  assert.equal(json.includes('"currentPlace"'), false);
  assert.equal(json.includes('"latitude"'), false);
  assert.equal(json.includes('"coordinates"'), false);
  assert.equal(json.includes('"planet-in-houses-profile"'), false);
  assert.equal(json.includes('NaN'), false);
  assert.equal(json.includes('undefined'), false);
}

test('Whole Sign assigns planets by sign relative to ASC sign', () => {
  const ariesFixture = getPlanetInHousesFixture('whole-sign-asc-aries-planets');
  const scorpioFixture = getPlanetInHousesFixture('whole-sign-asc-scorpio-planets');
  const ariesHouseResult = buildWholeSignHouseResult('aries');
  const scorpioHouseResult = buildWholeSignHouseResult('scorpio');

  const aries = assignPlanetsToHouses(ariesFixture.input.planets, ariesHouseResult);
  const scorpio = assignPlanetsToHouses(scorpioFixture.input.planets, scorpioHouseResult);
  const derived = assignPlanetToHouse(planet('derived', 'Derived', 44.5), ariesHouseResult);

  assert.equal(aries.status, 'ready');
  assert.deepEqual(assignmentByPlanet(aries.assignments), {
    sun: 1,
    moon: 2,
    mars: 12,
  });
  assert.deepEqual(assignmentByPlanet(scorpio.assignments), {
    sun: 1,
    moon: 2,
    mars: 12,
  });
  assert.equal(derived.status, 'ready');
  assert.equal(derived.houseNumber, 2);
  assert.equal(derived.houseSystem, 'whole-sign');
  assertNoSensitiveOutput(aries);
});

test('Equal House assigns by half-open cusp spans and wrapping house 12', () => {
  const fixture = getPlanetInHousesFixture('equal-house-aries-14-30-boundaries');
  const houseResult = buildCuspHouseResult(
    'equal-house',
    'Равнодомная',
    fixture.input.cuspLongitudes,
  );
  const result = assignPlanetsToHouses(fixture.input.planets, houseResult);

  assert.equal(result.status, 'ready');
  assert.equal(result.houseSystem, 'equal-house');
  assert.deepEqual(assignmentByPlanet(result.assignments), {
    cusp1: 1,
    beforeCusp2: 1,
    cusp2: 2,
    cusp12: 12,
    wrapInside: 12,
    beforeAsc: 12,
  });
  assert.equal(findHouseForLongitude(14.5, houseResult.houses).number, 1);
  assert.equal(findHouseForLongitude(44.499, houseResult.houses).number, 1);
  assert.equal(findHouseForLongitude(44.5, houseResult.houses).number, 2);
  assert.equal(findHouseForLongitude(359, houseResult.houses).number, 12);
  assertNoSensitiveOutput(result);
});

test('Placidus assigns by Placidus cusp spans without Equal House or Whole Sign fallback', () => {
  const fixture = getPlanetInHousesFixture('placidus-greenwich-boundaries');
  const houseResult = buildCuspHouseResult(
    'placidus',
    'Placidus',
    fixture.input.cuspLongitudes,
  );
  const result = assignPlanetsToHouses(fixture.input.planets, houseResult);

  assert.equal(result.status, 'ready');
  assert.equal(result.houseSystem, 'placidus');
  assert.deepEqual(assignmentByPlanet(result.assignments), {
    placidusCusp1: 1,
    placidusBeforeCusp2: 1,
    placidusCusp2: 2,
    placidusWrap: 12,
  });
  assert.equal(findHouseForLongitude(61.142401, houseResult.houses).number, 2);
  assert.equal(findHouseForLongitude(350, houseResult.houses).number, 12);
  assert.notDeepEqual(
    fixture.input.cuspLongitudes,
    fixture.input.cuspLongitudes.map((_, index) => (fixture.input.cuspLongitudes[0] + (index * 30)) % 360),
  );
  assertNoSensitiveOutput(result);
});

test('span helper uses half-open intervals for non-wrapping and wrapping spans', () => {
  assert.equal(isLongitudeInHouseSpan(14.5, 14.5, 44.5), true);
  assert.equal(isLongitudeInHouseSpan(44.499, 14.5, 44.5), true);
  assert.equal(isLongitudeInHouseSpan(44.5, 14.5, 44.5), false);
  assert.equal(isLongitudeInHouseSpan(344.5, 344.5, 14.5), true);
  assert.equal(isLongitudeInHouseSpan(359, 344.5, 14.5), true);
  assert.equal(isLongitudeInHouseSpan(0, 344.5, 14.5), true);
  assert.equal(isLongitudeInHouseSpan(14.499, 344.5, 14.5), true);
  assert.equal(isLongitudeInHouseSpan(14.5, 344.5, 14.5), false);
  assert.equal(isLongitudeInHouseSpan(Number.NaN, 344.5, 14.5), false);
});

test('invalid house results and invalid planets fail safely without fake assignments', () => {
  const unsupportedHouseResult = Object.freeze({
    status: 'unsupported',
    ready: false,
    houseSystem: 'placidus',
    reason: 'placidusUnsupportedAtLatitude',
    message: 'Unsupported safely.',
    houses: Object.freeze([]),
  });
  const equalHouseResult = buildCuspHouseResult('equal-house', 'Равнодомная', [14.5, 44.5]);
  const placidusHouseResult = buildCuspHouseResult('placidus', 'Placidus', [24.266189, 61.142401]);
  const wholeHouseResult = buildWholeSignHouseResult('aries');

  const invalidHouse = assignPlanetToHouse(planet('sun', 'Солнце', 14.5, 'aries'), null);
  const unsupported = assignPlanetsToHouses([planet('sun', 'Солнце', 14.5, 'aries')], unsupportedHouseResult);
  const missingEqualLongitude = assignPlanetToHouse({ key: 'moon', label: 'Луна', sign: sign('aries') }, equalHouseResult);
  const missingPlacidusLongitude = assignPlanetToHouse({ key: 'mars', label: 'Марс', sign: sign('aries') }, placidusHouseResult);
  const missingWholeSign = assignPlanetToHouse({ key: 'venus', label: 'Венера' }, wholeHouseResult);

  assert.equal(invalidHouse.status, 'notReady');
  assert.equal(invalidHouse.reason, 'invalidHouseResult');
  assert.equal(unsupported.status, 'unsupported');
  assert.equal(unsupported.reason, 'placidusUnsupportedAtLatitude');
  assert.deepEqual(unsupported.assignments, []);
  assert.equal(missingEqualLongitude.status, 'invalid');
  assert.equal(missingEqualLongitude.reason, 'missingPlanetLongitude');
  assert.equal(missingPlacidusLongitude.status, 'invalid');
  assert.equal(missingPlacidusLongitude.reason, 'missingPlanetLongitude');
  assert.equal(missingWholeSign.status, 'invalid');
  assert.equal(missingWholeSign.reason, 'missingPlanetSign');
});

test('resolvePlanetHouseInput normalizes planet position only as far as each system needs', () => {
  const wholeFromSign = resolvePlanetHouseInput({ key: 'sun', label: 'Солнце', sign: sign('aries') }, 'whole-sign');
  const wholeFromLongitude = resolvePlanetHouseInput({ key: 'moon', label: 'Луна', longitude: 44.5 }, 'whole-sign');
  const equalReady = resolvePlanetHouseInput({ key: 'mars', label: 'Марс', longitude: 404.5 }, 'equal-house');
  const equalMissing = resolvePlanetHouseInput({ key: 'venus', label: 'Венера', sign: sign('aries') }, 'equal-house');

  assert.equal(wholeFromSign.status, 'ready');
  assert.equal(wholeFromSign.signKey, 'aries');
  assert.equal(wholeFromLongitude.status, 'ready');
  assert.equal(wholeFromLongitude.signKey, 'taurus');
  assert.equal(equalReady.status, 'ready');
  assert.equal(equalReady.longitude, 44.5);
  assert.equal(equalMissing.status, 'invalid');
  assert.equal(equalMissing.reason, 'missingPlanetLongitude');
});

test('assignPlanetsToHouses preserves order and summarizes ready and invalid assignments', () => {
  const houseResult = buildCuspHouseResult('equal-house', 'Равнодомная', [14.5, 44.5, 74.5]);
  const planets = [
    planet('sun', 'Солнце', 14.5, 'aries'),
    { key: 'bad', label: 'Bad planet' },
    planet('moon', 'Луна', 44.5, 'taurus'),
  ];
  const before = clone(planets);
  const result = assignPlanetsToHouses(planets, houseResult);
  const summary = getPlanetInHouseSummary(result.assignments);

  assert.deepEqual(result.assignments.map((assignment) => assignment.planetKey), ['sun', 'bad', 'moon']);
  assert.equal(result.total, 3);
  assert.equal(result.readyCount, 2);
  assert.equal(result.invalidCount, 1);
  assert.deepEqual(result.summary.byHouse, { 1: 1, 2: 1 });
  assert.deepEqual(summary, result.summary);
  assert.deepEqual(planets, before);
});

test('assignPlanetsToHousesForProfile uses selected house-system router and safe natal planets path', () => {
  for (const houseSystem of ['wholeSign', 'equal', 'placidus']) {
    const profile = clone({ ...readyProfile, houseSystem });
    const before = clone(profile);
    const result = assignPlanetsToHousesForProfile(profile);

    assert.equal(result.status, 'ready');
    assert.equal(result.ready, true);
    assert.equal(result.assignments.length > 0, true);
    assert.equal(result.assignments.every((assignment) => assignment.status === 'ready'), true);
    assert.equal(result.houseSystem, houseSystem === 'wholeSign' ? 'whole-sign' : houseSystem === 'equal' ? 'equal-house' : 'placidus');
    assert.deepEqual(profile, before);
    assertNoSensitiveOutput(result);
  }
});

test('profile path returns safe notReady or unsupported status for missing natal planets and unknown system', () => {
  const missingNatal = assignPlanetsToHousesForProfile(null);
  const unknownSystem = assignPlanetsToHousesForProfile({
    ...clone(readyProfile),
    houseSystem: 'campanus',
  });

  assert.equal(missingNatal.status, 'notReady');
  assert.equal(missingNatal.ready, false);
  assert.equal(missingNatal.reason, 'natalPlanetsNotReady');
  assert.deepEqual(missingNatal.assignments, []);
  assert.equal(unknownSystem.status, 'unsupported');
  assert.equal(unknownSystem.reason, 'unknownHouseSystem');
  assert.deepEqual(unknownSystem.assignments, []);
  assertNoSensitiveOutput(missingNatal);
  assertNoSensitiveOutput(unknownSystem);
});

test('capabilities and limitations keep assignment scoped to selected systems without interpretations', () => {
  const capabilities = getPlanetInHouseCapabilities();
  const limitations = getPlanetInHouseLimitations().join(' ');

  assert.deepEqual(capabilities, {
    planetInHouse: true,
    wholeSign: true,
    equalHouse: true,
    placidus: true,
    selectedHouseSystem: true,
    interpretations: false,
    transits: false,
    fixedStars: false,
    ritualScoring: false,
  });
  assert.match(limitations, /выбранной системе домов/);
  assert.match(limitations, /Whole Sign/);
  assert.match(limitations, /Равнодомная и Placidus/);
  assert.match(limitations, /не добавляет интерпретации/);
});

test('assignment outputs avoid raw private data NaN undefined and fatalistic text', () => {
  const whole = buildWholeSignHouseResult('aries');
  const equal = buildCuspHouseResult('equal-house', 'Равнодомная', [14.5, 44.5, 74.5]);
  const output = [
    assignPlanetToHouse(planet('sun', 'Солнце', 14.5, 'aries'), whole),
    assignPlanetsToHouses([planet('moon', 'Луна', 44.5, 'taurus')], equal),
    getPlanetInHouseCapabilities(),
    getPlanetInHouseLimitations(),
  ];
  const json = JSON.stringify(output);

  assert.equal(json.includes('birthDate'), false);
  assert.equal(json.includes('birthTime'), false);
  assert.equal(json.includes('utcDateTime'), false);
  assert.equal(json.includes('birthPlace'), false);
  assert.equal(json.includes('coordinates'), false);
  assert.equal(json.includes('NaN'), false);
  assert.equal(json.includes('undefined'), false);
  assert.equal(/фаталь|карми|плохой|плохая|плохое/i.test(json), false);
});

test('planet-in-house fixture expectations match assignment output', () => {
  for (const fixture of PLANET_IN_HOUSES_FIXTURES.filter((item) => ['wholeSign', 'equalHouse', 'placidus'].includes(item.category))) {
    const houseResult = fixture.category === 'wholeSign'
      ? buildWholeSignHouseResult(fixture.input.ascSign)
      : buildCuspHouseResult(fixture.input.houseSystem, fixture.input.houseSystem, fixture.input.cuspLongitudes);
    const result = assignPlanetsToHouses(fixture.input.planets, houseResult);

    assert.deepEqual(assignmentByPlanet(result.assignments), Object.fromEntries(
      fixture.expected.assignments.map((assignment) => [assignment.planetKey, assignment.houseNumber]),
    ));
  }
});

test('module source stays assignment-only without providers DOM storage or forbidden generic files', async () => {
  const source = await readFile(new URL('../src/planetInHouses.js', import.meta.url), 'utf8');
  const imports = source
    .split('\n')
    .filter((line) => line.trim().startsWith('import '))
    .join('\n');

  assert.equal(imports.includes('astronomyEngineProvider'), false);
  assert.equal(imports.includes('planetaryPositionProvider'), false);
  assert.equal(imports.includes('astronomy-engine'), false);
  assert.equal(imports.includes('swisseph'), false);
  assert.equal(imports.includes('profileStorage'), false);
  assert.equal(source.includes('localStorage'), false);
  assert.equal(source.includes('document.'), false);
  assert.equal(source.includes('window.'), false);
  assert.equal(source.includes('calculateAscMc('), false);
  assert.equal(source.includes('calculateWholeSignHouses('), false);
  assert.equal(source.includes('calculateEqualHouseHouses('), false);
  assert.equal(source.includes('calculatePlacidusHouses('), false);
  assert.equal(source.includes('planetInHouse: true'), true);
  assert.equal(source.includes('interpretations: true'), false);
  assert.equal(source.includes('ritualScoring: true'), false);
});

test('forbidden generic houses modules are not created', () => {
  assert.equal(existsSync(new URL('../src/houses.js', import.meta.url)), false);
  assert.equal(existsSync(new URL('../src/houseSystems.js', import.meta.url)), false);
});
