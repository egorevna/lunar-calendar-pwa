const SYNTHETIC_PLANETS = Object.freeze([
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
]);

const SYNTHETIC_ANGLES = Object.freeze({
  asc: angle('asc', 'ASC', 'Ascendant', 15),
  mc: angle('mc', 'MC', 'Medium Coeli', 105),
  dsc: angle('dsc', 'DSC', 'Descendant', 195),
  ic: angle('ic', 'IC', 'Imum Coeli', 285),
});

export const SYNTHETIC_ANTISCIA_NATAL_PLANETS_RESULT = Object.freeze({
  status: 'ready',
  planets: SYNTHETIC_PLANETS,
  formattedPlanets: Object.freeze([]),
  source: 'synthetic-antiscia-targets',
});

export const SYNTHETIC_ANTISCIA_ASC_MC_RESULT = Object.freeze({
  status: 'ready',
  ready: true,
  angles: SYNTHETIC_ANGLES,
  source: 'synthetic-asc-mc',
});

export const SYNTHETIC_ANTISCIA_ASC_MC_ONLY_RESULT = Object.freeze({
  status: 'ready',
  ready: true,
  angles: Object.freeze({
    asc: SYNTHETIC_ANGLES.asc,
    mc: SYNTHETIC_ANGLES.mc,
  }),
  source: 'synthetic-asc-mc-only',
});

export const ANTISCIA_TARGETS_FIXTURES = Object.freeze([
  {
    id: 'natal-planets-ready',
    categories: Object.freeze(['natalPlanets']),
    input: Object.freeze({
      natalPlanetsResult: SYNTHETIC_ANTISCIA_NATAL_PLANETS_RESULT,
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      status: 'ready',
      targetSet: 'natal-planets',
      count: 10,
      order: Object.freeze([
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
      ]),
    }),
  },
  {
    id: 'angles-ready',
    categories: Object.freeze(['angles']),
    input: Object.freeze({
      ascMcResult: SYNTHETIC_ANTISCIA_ASC_MC_RESULT,
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      status: 'ready',
      targetSet: 'angles',
      count: 4,
      order: Object.freeze(['asc', 'mc', 'dsc', 'ic']),
    }),
  },
  {
    id: 'combined-ready',
    categories: Object.freeze(['combined']),
    input: Object.freeze({
      natalPlanetsResult: SYNTHETIC_ANTISCIA_NATAL_PLANETS_RESULT,
      ascMcResult: SYNTHETIC_ANTISCIA_ASC_MC_RESULT,
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      status: 'ready',
      targetCount: 14,
      order: Object.freeze([
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
        'asc',
        'mc',
        'dsc',
        'ic',
      ]),
      antiscionLongitudePresent: false,
      contraAntiscionLongitudePresent: false,
    }),
  },
  {
    id: 'partial-ready',
    categories: Object.freeze(['partial']),
    expected: Object.freeze({
      manuallyDeclared: true,
      planetsOnlyStatus: 'partial',
      anglesOnlyStatus: 'partial',
    }),
  },
  {
    id: 'deferred-targets',
    categories: Object.freeze(['deferredTargets']),
    expected: Object.freeze({
      manuallyDeclared: true,
      deferredTargetSets: Object.freeze([
        'house-cusps',
        'lunar-nodes',
        'lilith',
        'selena',
        'pars-fortuna',
        'lot-of-spirit',
        'vronsky-arabic-points',
        'fixed-stars',
        'custom-points',
      ]),
      deferredTargetsInOutput: false,
    }),
  },
  {
    id: 'invalid-targets',
    categories: Object.freeze(['invalid']),
    input: Object.freeze({
      houseCusp: Object.freeze({
        key: 'house-cusp-1',
        label: 'I дом',
        longitude: 15,
      }),
      missingLongitude: Object.freeze({
        key: 'sun',
        label: 'Солнце',
      }),
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      normalized: null,
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
      antisciaEngine: false,
      contraAntisciaEngine: false,
      midpointEngine: false,
      display: false,
      ui: false,
      debug: false,
      interpretations: false,
    }),
  },
]);

export function getAntisciaTargetsFixture(id) {
  return ANTISCIA_TARGETS_FIXTURES.find((fixture) => fixture.id === id) ?? null;
}

export function getAntisciaTargetsFixtureIds() {
  return ANTISCIA_TARGETS_FIXTURES.map((fixture) => fixture.id);
}

export function getAntisciaTargetsFixtureCategories() {
  return [
    ...new Set(
      ANTISCIA_TARGETS_FIXTURES
        .flatMap((fixture) => fixture.categories ?? [fixture.category])
        .filter(Boolean),
    ),
  ];
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

function angle(key, label, labelEn, longitude) {
  return Object.freeze({
    key,
    label,
    labelEn,
    longitude,
    source: 'synthetic-asc-mc',
  });
}
