const SIMPLE_FIXTURES = Object.freeze([
  midpointFixture('simple-10-30', 'simple', 10, 30, {
    status: 'ready',
    longitude: 20,
    distance: 20,
    delta: 20,
  }),
  midpointFixture('simple-30-10', 'simple', 30, 10, {
    status: 'ready',
    longitude: 20,
    distance: 20,
    delta: -20,
  }),
]);

const WRAP_AROUND_FIXTURES = Object.freeze([
  midpointFixture('wrap-350-10', 'wrapAround', 350, 10, {
    status: 'ready',
    longitude: 0,
    distance: 20,
    delta: 20,
  }),
  midpointFixture('wrap-10-350', 'wrapAround', 10, 350, {
    status: 'ready',
    longitude: 0,
    distance: 20,
    delta: -20,
  }),
  midpointFixture('wrap-359-1', 'wrapAround', 359, 1, {
    status: 'ready',
    longitude: 0,
    distance: 2,
    delta: 2,
  }),
]);

const EXACT_OPPOSITION_FIXTURES = Object.freeze([
  midpointFixture('opposition-90-270', 'exactOpposition', 90, 270, {
    status: 'axisAmbiguous',
    longitude: null,
    distance: 180,
    exactOpposition: true,
    midpointAxisAmbiguous: true,
    candidateAxisPoints: Object.freeze([180, 0]),
  }),
  midpointFixture('opposition-0-180', 'exactOpposition', 0, 180, {
    status: 'axisAmbiguous',
    longitude: null,
    distance: 180,
    exactOpposition: true,
    midpointAxisAmbiguous: true,
    candidateAxisPoints: Object.freeze([90, 270]),
  }),
]);

export const MIDPOINT_BATCH_NATAL_PLANETS_RESULT = Object.freeze({
  status: 'ready',
  planets: Object.freeze([
    planet('sun', 'Солнце', 'Sun', 10),
    planet('moon', 'Луна', 'Moon', 43),
    planet('mercury', 'Меркурий', 'Mercury', 77),
    planet('venus', 'Венера', 'Venus', 111),
    planet('mars', 'Марс', 'Mars', 146),
    planet('jupiter', 'Юпитер', 'Jupiter', 182),
    planet('saturn', 'Сатурн', 'Saturn', 219),
    planet('uranus', 'Уран', 'Uranus', 258),
    planet('neptune', 'Нептун', 'Neptune', 296),
    planet('pluto', 'Плутон', 'Pluto', 336),
  ]),
  formattedPlanets: Object.freeze([]),
  source: 'synthetic-midpoint-engine-fixture',
});

export const MIDPOINTS_FIXTURES = Object.freeze([
  ...SIMPLE_FIXTURES,
  ...WRAP_AROUND_FIXTURES,
  ...EXACT_OPPOSITION_FIXTURES,
  {
    id: 'batch-no-oppositions',
    categories: Object.freeze(['batch']),
    input: Object.freeze({
      natalPlanetsResult: MIDPOINT_BATCH_NATAL_PLANETS_RESULT,
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      status: 'ready',
      targetCount: 10,
      pairCount: 45,
      readyCount: 45,
      ambiguousCount: 0,
      invalidCount: 0,
      firstKey: 'sun-moon',
      firstLongitude: 26.5,
      secondKey: 'sun-mercury',
      secondLongitude: 43.5,
      lastKey: 'neptune-pluto',
      lastLongitude: 316,
    }),
  },
  {
    id: 'batch-with-opposition',
    categories: Object.freeze(['batch', 'exactOpposition']),
    input: Object.freeze({
      natalPlanetsResult: Object.freeze({
        status: 'ready',
        planets: Object.freeze([
          planet('sun', 'Солнце', 'Sun', 10),
          planet('moon', 'Луна', 'Moon', 40),
          planet('mercury', 'Меркурий', 'Mercury', 70),
          planet('venus', 'Венера', 'Venus', 100),
          planet('mars', 'Марс', 'Mars', 130),
          planet('jupiter', 'Юпитер', 'Jupiter', 160),
          planet('saturn', 'Сатурн', 'Saturn', 190),
          planet('uranus', 'Уран', 'Uranus', 220),
          planet('neptune', 'Нептун', 'Neptune', 250),
          planet('pluto', 'Плутон', 'Pluto', 280),
        ]),
        formattedPlanets: Object.freeze([]),
        source: 'synthetic-midpoint-engine-opposition-fixture',
      }),
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      status: 'partial',
      targetCount: 10,
      pairCount: 45,
      readyCount: 41,
      ambiguousCount: 4,
      invalidCount: 0,
      ambiguousKeys: Object.freeze([
        'sun-saturn',
        'moon-uranus',
        'mercury-neptune',
        'venus-pluto',
      ]),
    }),
  },
  {
    id: 'invalid-longitude',
    categories: Object.freeze(['invalid']),
    input: Object.freeze({
      longitudeA: Number.NaN,
      longitudeB: 10,
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      status: 'invalid',
      ready: false,
      reason: 'invalidLongitude',
    }),
  },
  {
    id: 'profile-fallback',
    categories: Object.freeze(['profile']),
    expected: Object.freeze({
      manuallyDeclared: true,
      noProfileStatus: 'notReady',
      unknownTimeStatus: 'notReady',
    }),
  },
  {
    id: 'privacy',
    categories: Object.freeze(['privacy']),
    expected: Object.freeze({
      manuallyDeclared: true,
      rawBirthDataExposed: false,
      rawGeoValuesExposed: false,
      fullPrivateJsonExposed: false,
      providerDataExposed: false,
    }),
  },
  {
    id: 'strict-exclusions',
    categories: Object.freeze(['strictExclusions']),
    expected: Object.freeze({
      manuallyDeclared: true,
      midpointContacts: false,
      antiscia: false,
      contraAntiscia: false,
      display: false,
      ui: false,
      debug: false,
      interpretations: false,
    }),
  },
]);

export function getMidpointsFixture(id) {
  return MIDPOINTS_FIXTURES.find((fixture) => fixture.id === id) ?? null;
}

export function getMidpointsFixtureIds() {
  return MIDPOINTS_FIXTURES.map((fixture) => fixture.id);
}

export function getMidpointsFixtureCategories() {
  return [
    ...new Set(
      MIDPOINTS_FIXTURES
        .flatMap((fixture) => fixture.categories ?? [fixture.category])
        .filter(Boolean),
    ),
  ];
}

function midpointFixture(id, category, longitudeA, longitudeB, expected) {
  return Object.freeze({
    id,
    categories: Object.freeze([category]),
    input: Object.freeze({
      longitudeA,
      longitudeB,
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      ...expected,
    }),
  });
}

function planet(key, label, labelEn, longitude) {
  return Object.freeze({
    key,
    label,
    labelEn,
    longitude,
    source: 'synthetic-natal-planets',
  });
}
