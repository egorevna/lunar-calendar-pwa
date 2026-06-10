const SYNTHETIC_WRAP_ROW = Object.freeze({
  key: 'synthetic-wrap-star',
  labelRu: 'Синтетическая wrap-звезда',
  labelEn: 'Synthetic Wrap Star',
  designation: 'synthetic',
  active: true,
  verificationStatus: 'verified',
  sourceSystem: 'synthetic-test-fixture',
  sourceKey: 'synthetic-wrap-fixture',
  validationStatus: 'manual-test-fixture',
  sourceRow: Object.freeze({
    table: 'synthetic test row',
    sourceNameRu: 'Синтетическая wrap-звезда',
    sourceDesignation: 'synthetic',
    manualVerification: true,
  }),
  coordinates: Object.freeze({
    epoch1950: Object.freeze({
      epoch: 1950,
      sign: 'pisces',
      signRu: 'Рыбы',
      degree: 29,
      minutes: 50,
      seconds: 0,
      longitude: 359.8333333333,
      verified: true,
    }),
    epoch1970: Object.freeze({
      epoch: 1970,
      sign: 'aries',
      signRu: 'Овен',
      degree: 0,
      minutes: 6,
      seconds: 0,
      longitude: 0.1,
      verified: true,
    }),
    epoch1990: Object.freeze({
      epoch: 1990,
      sign: 'aries',
      signRu: 'Овен',
      degree: 0,
      minutes: 22,
      seconds: 0,
      longitude: 0.3666666667,
      verified: true,
    }),
  }),
  initialReferenceEpoch: 1990,
  positionPolicy: 'synthetic-wrap-test-fixture',
  interpretation: false,
  syntheticFixture: true,
});

export const FIXED_STAR_POSITIONS_FIXTURES = Object.freeze([
  {
    id: 'spica-exact-1950',
    categories: Object.freeze(['exactEpoch']),
    input: Object.freeze({ starKey: 'spica', epochYear: 1950 }),
    expected: Object.freeze({
      manuallyDeclared: true,
      longitude: 203.1333333333,
      exactSourceEpoch: 1950,
      interpolated: false,
      extrapolated: false,
    }),
  },
  {
    id: 'spica-exact-1970',
    categories: Object.freeze(['exactEpoch']),
    input: Object.freeze({ starKey: 'spica', epochYear: 1970 }),
    expected: Object.freeze({
      manuallyDeclared: true,
      longitude: 203.4166666667,
      exactSourceEpoch: 1970,
      interpolated: false,
      extrapolated: false,
    }),
  },
  {
    id: 'spica-exact-1990',
    categories: Object.freeze(['exactEpoch']),
    input: Object.freeze({ starKey: 'spica', epochYear: 1990 }),
    expected: Object.freeze({
      manuallyDeclared: true,
      longitude: 203.7,
      exactSourceEpoch: 1990,
      interpolated: false,
      extrapolated: false,
    }),
  },
  {
    id: 'spica-interpolation-1960',
    categories: Object.freeze(['interpolation']),
    input: Object.freeze({ starKey: 'spica', epochYear: 1960 }),
    expected: Object.freeze({
      manuallyDeclared: true,
      longitude: 203.275,
      interpolated: true,
      extrapolated: false,
      interpolationSource: '1950-1970',
    }),
  },
  {
    id: 'spica-interpolation-1980',
    categories: Object.freeze(['interpolation']),
    input: Object.freeze({ starKey: 'spica', epochYear: 1980 }),
    expected: Object.freeze({
      manuallyDeclared: true,
      longitude: 203.55833333335,
      interpolated: true,
      extrapolated: false,
      interpolationSource: '1970-1990',
      text: 'Спика — Весы 23°33′30″',
    }),
  },
  {
    id: 'spica-extrapolation-1940',
    categories: Object.freeze(['extrapolation']),
    input: Object.freeze({ starKey: 'spica', epochYear: 1940 }),
    expected: Object.freeze({
      manuallyDeclared: true,
      longitude: 202.9916666666,
      interpolated: false,
      extrapolated: true,
      extrapolationSource: '1950-1970',
    }),
  },
  {
    id: 'spica-extrapolation-2000',
    categories: Object.freeze(['extrapolation']),
    input: Object.freeze({ starKey: 'spica', epochYear: 2000 }),
    expected: Object.freeze({
      manuallyDeclared: true,
      longitude: 203.84166666665,
      interpolated: false,
      extrapolated: true,
      extrapolationSource: '1970-1990',
    }),
  },
  {
    id: 'synthetic-wrap-interpolation-1960',
    categories: Object.freeze(['wrapAround', 'interpolation']),
    synthetic: true,
    input: Object.freeze({ starRow: SYNTHETIC_WRAP_ROW, epochYear: 1960 }),
    expected: Object.freeze({
      manuallyDeclared: true,
      longitude: 359.96666666665,
      interpolated: true,
      extrapolated: false,
      interpolationSource: '1950-1970',
    }),
  },
  {
    id: 'synthetic-wrap-interpolation-1980',
    categories: Object.freeze(['wrapAround', 'interpolation']),
    synthetic: true,
    input: Object.freeze({ starRow: SYNTHETIC_WRAP_ROW, epochYear: 1980 }),
    expected: Object.freeze({
      manuallyDeclared: true,
      longitude: 0.23333333335,
      interpolated: true,
      extrapolated: false,
      interpolationSource: '1970-1990',
    }),
  },
  {
    id: 'invalid-date',
    categories: Object.freeze(['invalid']),
    input: Object.freeze({ utcDateTime: 'not-a-date', starKey: 'spica' }),
    expected: Object.freeze({
      manuallyDeclared: true,
      status: 'invalid',
      reason: 'invalidDate',
    }),
  },
  {
    id: 'unknown-star',
    categories: Object.freeze(['invalid']),
    input: Object.freeze({ starKey: 'unknown-star', epochYear: 1980 }),
    expected: Object.freeze({
      manuallyDeclared: true,
      status: 'notReady',
      reason: 'unknownStar',
    }),
  },
  {
    id: 'privacy',
    categories: Object.freeze(['privacy']),
    expected: Object.freeze({
      manuallyDeclared: true,
      rawBirthDataExposed: false,
      rawGeoValuesExposed: false,
      privateJsonExposed: false,
      providerDataExposed: false,
    }),
  },
  {
    id: 'strict-exclusions',
    categories: Object.freeze(['strictExclusions']),
    expected: Object.freeze({
      manuallyDeclared: true,
      conjunctionEngine: false,
      targetResolver: false,
      display: false,
      ui: false,
      debug: false,
      readingsAdded: false,
    }),
  },
]);

export function getFixedStarPositionsFixture(id) {
  return FIXED_STAR_POSITIONS_FIXTURES.find((fixture) => fixture.id === id) ?? null;
}

export function getFixedStarPositionsFixtureIds() {
  return FIXED_STAR_POSITIONS_FIXTURES.map((fixture) => fixture.id);
}

export function getFixedStarPositionsFixtureCategories() {
  return [
    ...new Set(
      FIXED_STAR_POSITIONS_FIXTURES
        .flatMap((fixture) => fixture.categories ?? [fixture.category])
        .filter(Boolean),
    ),
  ];
}
