export const SELENA_FIXTURES = Object.freeze([
  {
    id: 'selena-1900-06-15',
    categories: Object.freeze(['benchmark']),
    input: Object.freeze({
      utcDateTime: '1900-06-15T00:00:00.000Z',
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      source: 'local-swisseph-SE_WHITE_MOON-benchmark',
      sourceSystem: 'selena-white-moon',
      sourceKey: 'swiss-ephemeris-seorbel-white-moon',
      method: 'swisseph-seorbel-white-moon-linear-elements',
      pointType: 'fictitious-calculated-point',
      longitude: 161.989312273,
      toleranceDegrees: 0.01,
    }),
  },
  {
    id: 'selena-1970-01-01',
    categories: Object.freeze(['benchmark']),
    input: Object.freeze({
      utcDateTime: '1970-01-01T00:00:00.000Z',
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      source: 'local-swisseph-SE_WHITE_MOON-benchmark',
      sourceSystem: 'selena-white-moon',
      sourceKey: 'swiss-ephemeris-seorbel-white-moon',
      method: 'swisseph-seorbel-white-moon-linear-elements',
      pointType: 'fictitious-calculated-point',
      longitude: 139.159288058,
      toleranceDegrees: 0.01,
    }),
  },
  {
    id: 'selena-1981-wrap-aries',
    categories: Object.freeze(['benchmark', 'wrapAround']),
    input: Object.freeze({
      utcDateTime: '1981-04-16T00:45:00.000Z',
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      source: 'local-swisseph-SE_WHITE_MOON-benchmark',
      sourceSystem: 'selena-white-moon',
      sourceKey: 'swiss-ephemeris-seorbel-white-moon',
      method: 'swisseph-seorbel-white-moon-linear-elements',
      pointType: 'fictitious-calculated-point',
      longitude: 359.769538706,
      toleranceDegrees: 0.01,
    }),
  },
  {
    id: 'selena-2000-01-01',
    categories: Object.freeze(['benchmark']),
    input: Object.freeze({
      utcDateTime: '2000-01-01T12:00:00.000Z',
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      source: 'local-swisseph-SE_WHITE_MOON-benchmark',
      sourceSystem: 'selena-white-moon',
      sourceKey: 'swiss-ephemeris-seorbel-white-moon',
      method: 'swisseph-seorbel-white-moon-linear-elements',
      pointType: 'fictitious-calculated-point',
      longitude: 242.216746574,
      toleranceDegrees: 0.01,
    }),
  },
  {
    id: 'selena-2026-05-15',
    categories: Object.freeze(['benchmark']),
    input: Object.freeze({
      utcDateTime: '2026-05-15T10:33:00.000Z',
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      source: 'local-swisseph-SE_WHITE_MOON-benchmark',
      sourceSystem: 'selena-white-moon',
      sourceKey: 'swiss-ephemeris-seorbel-white-moon',
      method: 'swisseph-seorbel-white-moon-linear-elements',
      pointType: 'fictitious-calculated-point',
      longitude: 158.475192031,
      toleranceDegrees: 0.01,
    }),
  },
  {
    id: 'selena-2030-01-01',
    categories: Object.freeze(['benchmark']),
    input: Object.freeze({
      utcDateTime: '2030-01-01T00:00:00.000Z',
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      source: 'local-swisseph-SE_WHITE_MOON-benchmark',
      sourceSystem: 'selena-white-moon',
      sourceKey: 'swiss-ephemeris-seorbel-white-moon',
      method: 'swisseph-seorbel-white-moon-linear-elements',
      pointType: 'fictitious-calculated-point',
      longitude: 345.28802433,
      toleranceDegrees: 0.01,
    }),
  },
  {
    id: 'missing-utc-datetime',
    categories: Object.freeze(['invalid']),
    input: Object.freeze({}),
    expected: Object.freeze({
      status: 'notReady',
      reason: 'missingUtcDateTime',
    }),
  },
  {
    id: 'invalid-utc-datetime',
    categories: Object.freeze(['invalid']),
    input: Object.freeze({
      utcDateTime: 'not-a-date',
    }),
    expected: Object.freeze({
      status: 'notReady',
      reason: 'invalidUtcDateTime',
    }),
  },
  {
    id: 'exact-profile-without-coordinates',
    categories: Object.freeze(['profile']),
    input: Object.freeze({
      profileShape: 'exact-time-timezone-without-coordinates',
    }),
    expected: Object.freeze({
      status: 'ready',
      coordinatesRequired: false,
    }),
  },
  {
    id: 'privacy-no-birth-data-output',
    categories: Object.freeze(['privacy']),
    input: Object.freeze({}),
    expected: Object.freeze({
      rawBirthDataExposed: false,
      rawCoordinatesExposed: false,
      readingsAdded: false,
    }),
  },
  {
    id: 'strict-exclusions',
    categories: Object.freeze(['strictExclusions']),
    input: Object.freeze({}),
    expected: Object.freeze({
      alternateSelenaVariants: false,
      lunarNodes: false,
      lilith: false,
      readingsAdded: false,
      transits: false,
      fixedStars: false,
    }),
  },
]);

export function getSelenaFixture(id) {
  return SELENA_FIXTURES.find((fixture) => fixture.id === id) ?? null;
}

export function getSelenaFixtureIds() {
  return SELENA_FIXTURES.map((fixture) => fixture.id);
}

export function getSelenaFixtureCategories() {
  return [
    ...new Set(SELENA_FIXTURES.flatMap((fixture) => fixture.categories ?? [fixture.category]).filter(Boolean)),
  ];
}
