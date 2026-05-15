export const TEST_MOCK_NATAL_PLANETS = Object.freeze([
  Object.freeze({
    key: 'sun',
    label: 'Солнце',
    longitude: 45,
    retrograde: false,
    source: 'test-mock',
  }),
]);

export function createMockReadyPlanetaryProvider(planets = TEST_MOCK_NATAL_PLANETS) {
  return () => ({
    status: 'ready',
    provider: 'test-mock-provider',
    planets: planets.map((planet) => ({ ...planet })),
    metadata: {
      calculatedAt: '2026-05-15T00:00:00.000Z',
    },
  });
}
