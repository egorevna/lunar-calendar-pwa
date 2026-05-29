export const LILITH_FIXTURES = Object.freeze([
  {
    id: 'mean-lilith-1900-06-15',
    categories: Object.freeze(['benchmark']),
    input: Object.freeze({
      utcDateTime: '1900-06-15T00:00:00.000Z',
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      source: 'local-swisseph-SE_MEAN_APOG-benchmark',
      variant: 'mean',
      sourceSystem: 'mean-black-moon-lilith',
      sourceKey: 'mean-lunar-apogee',
      longitude: 172.819646346,
      toleranceDegrees: 0.01,
    }),
  },
  {
    id: 'mean-lilith-1940-wrap-aries',
    categories: Object.freeze(['benchmark', 'wrapAround']),
    input: Object.freeze({
      utcDateTime: '1940-06-11T00:00:00.000Z',
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      source: 'local-swisseph-SE_MEAN_APOG-benchmark',
      variant: 'mean',
      sourceSystem: 'mean-black-moon-lilith',
      sourceKey: 'mean-lunar-apogee',
      longitude: 359.999214551,
      toleranceDegrees: 0.01,
    }),
  },
  {
    id: 'mean-lilith-1970-01-01',
    categories: Object.freeze(['benchmark']),
    input: Object.freeze({
      utcDateTime: '1970-01-01T00:00:00.000Z',
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      source: 'local-swisseph-SE_MEAN_APOG-benchmark',
      variant: 'mean',
      sourceSystem: 'mean-black-moon-lilith',
      sourceKey: 'mean-lunar-apogee',
      longitude: 122.764810098,
      toleranceDegrees: 0.01,
    }),
  },
  {
    id: 'mean-lilith-1981-04-16',
    categories: Object.freeze(['benchmark']),
    input: Object.freeze({
      utcDateTime: '1981-04-16T00:45:00.000Z',
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      source: 'local-swisseph-SE_MEAN_APOG-benchmark',
      variant: 'mean',
      sourceSystem: 'mean-black-moon-lilith',
      sourceKey: 'mean-lunar-apogee',
      longitude: 221.985169604,
      toleranceDegrees: 0.01,
    }),
  },
  {
    id: 'mean-lilith-2000-01-01',
    categories: Object.freeze(['benchmark']),
    input: Object.freeze({
      utcDateTime: '2000-01-01T12:00:00.000Z',
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      source: 'local-swisseph-SE_MEAN_APOG-benchmark',
      variant: 'mean',
      sourceSystem: 'mean-black-moon-lilith',
      sourceKey: 'mean-lunar-apogee',
      longitude: 263.464332724,
      toleranceDegrees: 0.01,
    }),
  },
  {
    id: 'mean-lilith-2026-05-15',
    categories: Object.freeze(['benchmark']),
    input: Object.freeze({
      utcDateTime: '2026-05-15T10:33:00.000Z',
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      source: 'local-swisseph-SE_MEAN_APOG-benchmark',
      variant: 'mean',
      sourceSystem: 'mean-black-moon-lilith',
      sourceKey: 'mean-lunar-apogee',
      longitude: 256.319012588,
      toleranceDegrees: 0.01,
    }),
  },
  {
    id: 'mean-lilith-2030-01-01',
    categories: Object.freeze(['benchmark']),
    input: Object.freeze({
      utcDateTime: '2030-01-01T00:00:00.000Z',
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      source: 'local-swisseph-SE_MEAN_APOG-benchmark',
      variant: 'mean',
      sourceSystem: 'mean-black-moon-lilith',
      sourceKey: 'mean-lunar-apogee',
      longitude: 44.175698443,
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
      trueLilith: false,
      osculatingLilith: false,
      interpolatedLilith: false,
      selena: false,
      readingsAdded: false,
      transits: false,
      fixedStars: false,
    }),
  },
]);

export function getLilithFixture(id) {
  return LILITH_FIXTURES.find((fixture) => fixture.id === id) ?? null;
}

export function getLilithFixtureIds() {
  return LILITH_FIXTURES.map((fixture) => fixture.id);
}

export function getLilithFixtureCategories() {
  return [
    ...new Set(LILITH_FIXTURES.flatMap((fixture) => fixture.categories ?? [fixture.category]).filter(Boolean)),
  ];
}
