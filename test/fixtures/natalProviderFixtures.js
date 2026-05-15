export const REQUIRED_NATAL_PROVIDER_FIXTURE_CATEGORIES = Object.freeze([
  'modern',
  'historical',
  'moonSensitive',
  'timezoneSensitive',
  'unknownBirthTime',
  'missingCoordinates',
]);

const DEFAULT_EXPECTED_PLANETS = Object.freeze({
  sun: pendingPlanetExpectation(),
  moon: pendingPlanetExpectation(),
  mercury: pendingPlanetExpectation(),
  venus: pendingPlanetExpectation(),
  mars: pendingPlanetExpectation(),
  jupiter: pendingPlanetExpectation(),
  saturn: pendingPlanetExpectation(),
  uranus: pendingPlanetExpectation(),
  neptune: pendingPlanetExpectation(),
  pluto: pendingPlanetExpectation(),
});

const DEFAULT_TOLERANCE = Object.freeze({
  longitudeDegrees: 0.5,
  moonLongitudeDegrees: 1.0,
  houseDegrees: 1.0,
  ascMcDegrees: 1.0,
  retrogradeExact: true,
});

export const NATAL_PROVIDER_FIXTURES = Object.freeze([
  createPendingFixture({
    id: 'synthetic-modern-moscow-2000',
    label: 'Synthetic modern Moscow example',
    categories: ['modern'],
    birth: {
      date: '2000-01-01',
      time: '12:00',
      timezone: 'Europe/Moscow',
      latitude: 55.7558,
      longitude: 37.6173,
    },
    notes: ['Modern synthetic fixture; expected values must be filled from approved references later.'],
  }),
  createPendingFixture({
    id: 'synthetic-historical-london-1900',
    label: 'Synthetic historical London example',
    categories: ['historical'],
    birth: {
      date: '1900-06-15',
      time: '09:30',
      timezone: 'Europe/London',
      latitude: 51.5074,
      longitude: -0.1278,
    },
    notes: ['Historical synthetic fixture for date range and timezone-rule review.'],
  }),
  createPendingFixture({
    id: 'synthetic-moon-sensitive-tokyo-2012',
    label: 'Synthetic Moon-sensitive Tokyo example',
    categories: ['moonSensitive'],
    birth: {
      date: '2012-03-22',
      time: '23:50',
      timezone: 'Asia/Tokyo',
      latitude: 35.6762,
      longitude: 139.6503,
    },
    notes: ['Late-day synthetic fixture intended to catch fast Moon longitude differences.'],
  }),
  createPendingFixture({
    id: 'synthetic-timezone-new-york-1985',
    label: 'Synthetic timezone-sensitive New York example',
    categories: ['timezoneSensitive'],
    birth: {
      date: '1985-11-03',
      time: '01:30',
      timezone: 'America/New_York',
      latitude: 40.7128,
      longitude: -74.006,
    },
    notes: ['DST-adjacent synthetic fixture; exact expected values require approved timezone strategy.'],
  }),
  createPendingFixture({
    id: 'synthetic-unknown-time-paris-1995',
    label: 'Synthetic unknown birth time Paris example',
    categories: ['unknownBirthTime'],
    birth: {
      date: '1995-09-10',
      time: '',
      timezone: 'Europe/Paris',
      latitude: 48.8566,
      longitude: 2.3522,
      birthTimeAccuracy: 'unknown',
    },
    notes: ['Unknown time fixture should keep houses and ASC/MC unavailable.'],
  }),
  createPendingFixture({
    id: 'synthetic-missing-coordinates-berlin-1977',
    label: 'Synthetic missing coordinates Berlin example',
    categories: ['missingCoordinates'],
    birth: {
      date: '1977-04-18',
      time: '14:20',
      timezone: 'Europe/Berlin',
      latitude: null,
      longitude: null,
    },
    notes: ['Missing coordinates fixture should keep houses and ASC/MC unavailable.'],
  }),
]);

export function getNatalProviderFixture(id) {
  return NATAL_PROVIDER_FIXTURES.find((fixture) => fixture.id === id) ?? null;
}

export function getRequiredFixtureCategories() {
  return [...REQUIRED_NATAL_PROVIDER_FIXTURE_CATEGORIES];
}

function createPendingFixture({
  id,
  label,
  categories,
  birth,
  notes = [],
}) {
  return Object.freeze({
    id,
    label,
    type: 'synthetic',
    categories: Object.freeze([...categories]),
    birth: Object.freeze({
      birthTimeAccuracy: birth.birthTimeAccuracy ?? 'exact',
      ...birth,
    }),
    expectedStatus: 'pending-provider-approval',
    expected: Object.freeze({
      planets: DEFAULT_EXPECTED_PLANETS,
      houses: null,
      ascMc: null,
      retrograde: null,
      speed: null,
    }),
    tolerance: DEFAULT_TOLERANCE,
    source: 'synthetic — expected values to be filled after provider approval',
    validatedProvider: null,
    validatedAt: null,
    notes: Object.freeze([...notes]),
  });
}

function pendingPlanetExpectation() {
  return Object.freeze({
    longitude: null,
    sign: null,
    degree: null,
  });
}
