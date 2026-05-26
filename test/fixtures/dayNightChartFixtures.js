export const DAY_NIGHT_CHART_FIXTURES = Object.freeze([
  Object.freeze({
    id: 'equator-lst-0-sun-aries',
    category: 'syntheticGeometry',
    label: 'Equator LST 0 with Sun at Aries 0 is above the horizon',
    input: Object.freeze({
      localSiderealDegrees: 0,
      latitude: 0,
      obliquityDegrees: 23.439291,
      sunLongitude: 0,
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      status: 'ready',
      chartSect: 'day',
      altitudeDegrees: 90,
      toleranceDegrees: 0.001,
    }),
  }),
  Object.freeze({
    id: 'equator-lst-180-sun-aries',
    category: 'syntheticGeometry',
    label: 'Equator LST 180 with Sun at Aries 0 is below the horizon',
    input: Object.freeze({
      localSiderealDegrees: 180,
      latitude: 0,
      obliquityDegrees: 23.439291,
      sunLongitude: 0,
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      status: 'ready',
      chartSect: 'night',
      altitudeDegrees: -90,
      toleranceDegrees: 0.001,
    }),
  }),
  Object.freeze({
    id: 'equator-lst-90-sun-aries',
    category: 'boundary',
    label: 'Equator LST 90 with Sun at Aries 0 is on the horizon',
    input: Object.freeze({
      localSiderealDegrees: 90,
      latitude: 0,
      obliquityDegrees: 23.439291,
      sunLongitude: 0,
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      status: 'boundary',
      chartSect: null,
      altitudeDegrees: 0,
      toleranceDegrees: 0.001,
      reason: 'sunOnHorizonBoundary',
    }),
  }),
  Object.freeze({
    id: 'greenwich-equinox-2000-day',
    category: 'day',
    label: 'Synthetic public Greenwich equinox-like day example',
    input: Object.freeze({
      utcDateTime: '2000-03-20T12:00:00.000Z',
      latitude: 0,
      longitude: 0,
      sunLongitude: 0,
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      status: 'ready',
      chartSect: 'day',
      minimumAltitudeDegrees: 80,
      method: 'sun-altitude-geometric',
    }),
  }),
  Object.freeze({
    id: 'greenwich-equinox-2000-night',
    category: 'night',
    label: 'Synthetic public Greenwich equinox-like night example',
    input: Object.freeze({
      utcDateTime: '2000-03-20T00:00:00.000Z',
      latitude: 0,
      longitude: 0,
      sunLongitude: 0,
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      status: 'ready',
      chartSect: 'night',
      maximumAltitudeDegrees: -80,
      method: 'sun-altitude-geometric',
    }),
  }),
  Object.freeze({
    id: 'invalid-missing-sun-longitude',
    category: 'invalid',
    label: 'Missing Sun longitude cannot determine chart sect',
    input: Object.freeze({
      utcDateTime: '2000-03-20T12:00:00.000Z',
      latitude: 0,
      longitude: 0,
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      status: 'notReady',
      ready: false,
      reason: 'missingSunLongitude',
    }),
  }),
  Object.freeze({
    id: 'profile-missing-coordinates',
    category: 'profile',
    label: 'Profile with exact time but no coordinates remains not ready',
    input: Object.freeze({
      profileState: 'missingCoordinates',
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      status: 'notReady',
      ready: false,
      reason: 'cityWithoutCoordinates',
    }),
  }),
  Object.freeze({
    id: 'privacy-no-raw-birth-data',
    category: 'privacy',
    label: 'Day/night output excludes raw birth data and raw coordinates',
    input: Object.freeze({ check: 'safe-output' }),
    expected: Object.freeze({
      manuallyDeclared: true,
      forbiddenOutputTokens: Object.freeze([
        'birthDate',
        'birthTime',
        'utcDateTime',
        'birthPlace',
        'coordinates',
        'providerPayload',
        'fullProfileJson',
      ]),
    }),
  }),
  Object.freeze({
    id: 'strict-exclusions-day-night',
    category: 'strictExclusions',
    label: 'Day/night chart status does not add lots or future systems',
    input: Object.freeze({ check: 'source-scan' }),
    expected: Object.freeze({
      manuallyDeclared: true,
      forbiddenFiles: Object.freeze([
        'src/houses.js',
        'src/houseSystems.js',
        'src/arabicParts.js',
        'src/arabicPartsData.js',
      ]),
      providerImports: false,
      domStorageImports: false,
      swissephImport: false,
      parsFortuna: false,
      arabicParts: false,
      interpretations: false,
    }),
  }),
]);

export function getDayNightChartFixture(id) {
  return DAY_NIGHT_CHART_FIXTURES.find((fixture) => fixture.id === id) ?? null;
}

export function getDayNightChartFixtureIds() {
  return DAY_NIGHT_CHART_FIXTURES.map((fixture) => fixture.id);
}

export function getDayNightChartFixtureCategories() {
  return [...new Set(DAY_NIGHT_CHART_FIXTURES.map((fixture) => fixture.category))];
}
