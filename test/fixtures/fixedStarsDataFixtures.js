export const FIXED_STARS_DATA_FIXTURES = Object.freeze([
  {
    id: 'fixed-stars-source-policy',
    categories: Object.freeze(['sourcePolicy']),
    expected: Object.freeze({
      manuallyDeclared: true,
      sourceKey: 'vronsky-table-18-fixed-stars',
      sourceSystem: 'fixed-stars-vronsky-table-18',
      noOcrImport: true,
      noRowsFromMemory: true,
      coordinateColumns: Object.freeze(['1950', '1970', '1990']),
      initialReferenceEpoch: 1990,
    }),
  },
  {
    id: 'fixed-stars-orb-policy',
    categories: Object.freeze(['orbPolicy']),
    expected: Object.freeze({
      manuallyDeclared: true,
      key: 'fixed-stars-global-conjunction-orb-1deg',
      relationship: 'conjunction',
      globalOrbDegrees: 1,
      hiddenOrb: false,
      perStarOverrides: false,
      perTargetOverrides: false,
    }),
  },
  {
    id: 'fixed-stars-target-policy',
    categories: Object.freeze(['targetPolicy']),
    expected: Object.freeze({
      manuallyDeclared: true,
      activeTargetSet: Object.freeze(['natal-planets', 'angles']),
      activeTargets: Object.freeze([
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
      deferredTargetSets: Object.freeze([
        'house-cusps',
        'lunar-nodes',
        'lilith',
        'selena',
        'pars-fortuna',
        'lot-of-spirit',
        'arabic-parts',
        'custom-points',
      ]),
    }),
  },
  {
    id: 'fixed-stars-relationship-policy',
    categories: Object.freeze(['sourcePolicy']),
    expected: Object.freeze({
      manuallyDeclared: true,
      activeRelationships: Object.freeze(['conjunction']),
      deferredRelationships: Object.freeze([
        'opposition',
        'square',
        'trine',
        'sextile',
        'paran',
        'heliacal-rising',
        'heliacal-setting',
      ]),
    }),
  },
  {
    id: 'fixed-stars-active-rows',
    categories: Object.freeze(['activeRows']),
    expected: Object.freeze({
      manuallyDeclared: true,
      activeCount: 13,
      activeKeys: Object.freeze([
        'algol',
        'aldebaran',
        'rigel',
        'betelgeuse',
        'sirius',
        'canopus',
        'regulus',
        'spica',
        'arcturus',
        'antares',
        'vega',
        'altair',
        'fomalhaut',
      ]),
      referenceEpoch: 1990,
      sampleCoordinates: Object.freeze({
        regulus: Object.freeze({
          sign: 'leo',
          degree: 29,
          minutes: 42,
          longitude: 149.7,
        }),
        spica: Object.freeze({
          sign: 'libra',
          degree: 23,
          minutes: 42,
          longitude: 203.7,
        }),
        fomalhaut: Object.freeze({
          sign: 'pisces',
          degree: 3,
          minutes: 43,
          longitude: 333.7166666667,
        }),
      }),
    }),
  },
  {
    id: 'fixed-stars-candidate-rows',
    categories: Object.freeze(['candidateRows']),
    expected: Object.freeze({
      manuallyDeclared: true,
      candidateCount: 0,
      reason: 'initialCandidateSubsetWasManuallyVerifiedFromProvidedReferencePhotos',
    }),
  },
  {
    id: 'fixed-stars-deferred-rows',
    categories: Object.freeze(['deferredRows']),
    expected: Object.freeze({
      manuallyDeclared: true,
      deferredReasons: Object.freeze([
        'sourceRowNotYetVerified',
        'coordinateNotVerified',
        'validationPending',
        'interpretationsDeferred',
        'dateOfBirthPositionDeferredToTask14_4',
      ]),
    }),
  },
  {
    id: 'fixed-stars-privacy',
    categories: Object.freeze(['privacy']),
    expected: Object.freeze({
      manuallyDeclared: true,
      rawBirthDataExposed: false,
      rawCoordinatesExposed: false,
      privateJsonExposed: false,
      providerDataExposed: false,
    }),
  },
  {
    id: 'fixed-stars-strict-exclusions',
    categories: Object.freeze(['strictExclusions']),
    expected: Object.freeze({
      manuallyDeclared: true,
      positionEngine: false,
      conjunctionEngine: false,
      targetResolver: false,
      display: false,
      ui: false,
      debug: false,
      readingsAdded: false,
    }),
  },
]);

export function getFixedStarsDataFixture(id) {
  return FIXED_STARS_DATA_FIXTURES.find((fixture) => fixture.id === id) ?? null;
}

export function getFixedStarsDataFixtureIds() {
  return FIXED_STARS_DATA_FIXTURES.map((fixture) => fixture.id);
}

export function getFixedStarsDataFixtureCategories() {
  return [
    ...new Set(
      FIXED_STARS_DATA_FIXTURES
        .flatMap((fixture) => fixture.categories ?? [fixture.category])
        .filter(Boolean),
    ),
  ];
}
