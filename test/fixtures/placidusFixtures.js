export const PLACIDUS_BENCHMARK_FIXTURES = Object.freeze([
  {
    id: 'greenwich-j2000-midday',
    label: 'Greenwich J2000 midday',
    category: 'midLatitude',
    input: Object.freeze({
      utcDateTime: '2000-01-01T12:00:00.000Z',
      latitude: 51.4779,
      longitude: 0,
    }),
    expected: Object.freeze({
      houseSystem: 'placidus',
      toleranceDegrees: 0.05,
      source: 'local-swisseph-swe_houses-benchmark',
      ascendant: 24.266189,
      mc: 279.611088,
      cusps: Object.freeze([
        Object.freeze({ number: 1, longitude: 24.266189 }),
        Object.freeze({ number: 2, longitude: 61.142401 }),
        Object.freeze({ number: 3, longitude: 82.020814 }),
        Object.freeze({ number: 4, longitude: 99.611088 }),
        Object.freeze({ number: 5, longitude: 119.061909 }),
        Object.freeze({ number: 6, longitude: 147.700657 }),
        Object.freeze({ number: 7, longitude: 204.266189 }),
        Object.freeze({ number: 8, longitude: 241.142401 }),
        Object.freeze({ number: 9, longitude: 262.020814 }),
        Object.freeze({ number: 10, longitude: 279.611088 }),
        Object.freeze({ number: 11, longitude: 299.061909 }),
        Object.freeze({ number: 12, longitude: 327.700657 }),
      ]),
    }),
  },
  {
    id: 'moscow-modern-midlatitude',
    label: 'Moscow modern mid-latitude',
    category: 'midLatitude',
    input: Object.freeze({
      utcDateTime: '2026-05-25T09:00:00.000Z',
      latitude: 55.7558,
      longitude: 37.6173,
    }),
    expected: Object.freeze({
      houseSystem: 'placidus',
      toleranceDegrees: 0.05,
      source: 'local-swisseph-swe_houses-benchmark',
      ascendant: 157.147984,
      mc: 57.845392,
      cusps: Object.freeze([
        Object.freeze({ number: 1, longitude: 157.147984 }),
        Object.freeze({ number: 2, longitude: 176.620625 }),
        Object.freeze({ number: 3, longitude: 202.86725 }),
        Object.freeze({ number: 4, longitude: 237.845392 }),
        Object.freeze({ number: 5, longitude: 277.892626 }),
        Object.freeze({ number: 6, longitude: 311.362105 }),
        Object.freeze({ number: 7, longitude: 337.147984 }),
        Object.freeze({ number: 8, longitude: 356.620625 }),
        Object.freeze({ number: 9, longitude: 22.86725 }),
        Object.freeze({ number: 10, longitude: 57.845392 }),
        Object.freeze({ number: 11, longitude: 97.892626 }),
        Object.freeze({ number: 12, longitude: 131.362105 }),
      ]),
    }),
  },
  {
    id: 'equator-march-equinox',
    label: 'Equator March equinox-like date',
    category: 'equator',
    input: Object.freeze({
      utcDateTime: '2024-03-20T12:00:00.000Z',
      latitude: 0,
      longitude: 0,
    }),
    expected: Object.freeze({
      houseSystem: 'placidus',
      toleranceDegrees: 0.05,
      source: 'local-swisseph-swe_houses-benchmark',
      ascendant: 88.633324,
      mc: 358.376573,
      cusps: Object.freeze([
        Object.freeze({ number: 1, longitude: 88.633324 }),
        Object.freeze({ number: 2, longitude: 116.49035 }),
        Object.freeze({ number: 3, longitude: 146.271379 }),
        Object.freeze({ number: 4, longitude: 178.376573 }),
        Object.freeze({ number: 5, longitude: 210.627403 }),
        Object.freeze({ number: 6, longitude: 240.663764 }),
        Object.freeze({ number: 7, longitude: 268.633324 }),
        Object.freeze({ number: 8, longitude: 296.49035 }),
        Object.freeze({ number: 9, longitude: 326.271379 }),
        Object.freeze({ number: 10, longitude: 358.376573 }),
        Object.freeze({ number: 11, longitude: 30.627403 }),
        Object.freeze({ number: 12, longitude: 60.663764 }),
      ]),
    }),
  },
  {
    id: 'sydney-southern-hemisphere',
    label: 'Sydney southern hemisphere',
    category: 'southernHemisphere',
    input: Object.freeze({
      utcDateTime: '2024-07-01T00:00:00.000Z',
      latitude: -33.8688,
      longitude: 151.2093,
    }),
    expected: Object.freeze({
      houseSystem: 'placidus',
      toleranceDegrees: 0.05,
      source: 'local-swisseph-swe_houses-benchmark',
      ascendant: 151.178882,
      mc: 72.233507,
      cusps: Object.freeze([
        Object.freeze({ number: 1, longitude: 151.178882 }),
        Object.freeze({ number: 2, longitude: 194.458352 }),
        Object.freeze({ number: 3, longitude: 227.149704 }),
        Object.freeze({ number: 4, longitude: 252.233507 }),
        Object.freeze({ number: 5, longitude: 274.711776 }),
        Object.freeze({ number: 6, longitude: 298.995557 }),
        Object.freeze({ number: 7, longitude: 331.178882 }),
        Object.freeze({ number: 8, longitude: 14.458352 }),
        Object.freeze({ number: 9, longitude: 47.149704 }),
        Object.freeze({ number: 10, longitude: 72.233507 }),
        Object.freeze({ number: 11, longitude: 94.711776 }),
        Object.freeze({ number: 12, longitude: 118.995557 }),
      ]),
    }),
  },
  {
    id: 'reykjavik-high-supported-latitude',
    label: 'Reykjavik high supported latitude',
    category: 'highSupportedLatitude',
    input: Object.freeze({
      utcDateTime: '2024-01-15T12:00:00.000Z',
      latitude: 64.1466,
      longitude: -21.9426,
    }),
    expected: Object.freeze({
      houseSystem: 'placidus',
      toleranceDegrees: 0.05,
      source: 'local-swisseph-swe_houses-benchmark',
      ascendant: 24.497496,
      mc: 272.294623,
      cusps: Object.freeze([
        Object.freeze({ number: 1, longitude: 24.497496 }),
        Object.freeze({ number: 2, longitude: 72.491138 }),
        Object.freeze({ number: 3, longitude: 83.946734 }),
        Object.freeze({ number: 4, longitude: 92.294623 }),
        Object.freeze({ number: 5, longitude: 101.191317 }),
        Object.freeze({ number: 6, longitude: 115.504902 }),
        Object.freeze({ number: 7, longitude: 204.497496 }),
        Object.freeze({ number: 8, longitude: 252.491138 }),
        Object.freeze({ number: 9, longitude: 263.946734 }),
        Object.freeze({ number: 10, longitude: 272.294623 }),
        Object.freeze({ number: 11, longitude: 281.191317 }),
        Object.freeze({ number: 12, longitude: 295.504902 }),
      ]),
    }),
  },
]);

export const PLACIDUS_UNSUPPORTED_FIXTURES = Object.freeze([
  {
    id: 'north-polar-circle-unsupported',
    label: 'Northern polar circle unsupported',
    category: 'unsupportedLatitude',
    input: Object.freeze({
      utcDateTime: '2024-01-15T12:00:00.000Z',
      latitude: 67,
      longitude: 0,
    }),
    expected: Object.freeze({
      status: 'unsupported',
      reason: 'placidusUnsupportedAtLatitude',
    }),
  },
]);

export function getPlacidusBenchmarkFixture(id) {
  return PLACIDUS_BENCHMARK_FIXTURES.find((fixture) => fixture.id === id) ?? null;
}

export function getPlacidusBenchmarkFixtureIds() {
  return PLACIDUS_BENCHMARK_FIXTURES.map((fixture) => fixture.id);
}
