export const LUNAR_NODES_FIXTURES = Object.freeze([
  {
    id: 'mean-node-1900-06-15',
    categories: Object.freeze(['benchmark']),
    input: Object.freeze({
      utcDateTime: '1900-06-15T00:00:00.000Z',
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      source: 'local-swisseph-SE_MEAN_NODE-benchmark',
      nodeType: 'mean',
      sourceSystem: 'mean-lunar-node',
      sourceKey: 'lunar-nodes-mean',
      northLongitude: 250.423568096,
      southLongitude: 70.423568096,
      toleranceDegrees: 0.01,
    }),
  },
  {
    id: 'mean-node-1970-01-01',
    categories: Object.freeze(['benchmark']),
    input: Object.freeze({
      utcDateTime: '1970-01-01T00:00:00.000Z',
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      source: 'local-swisseph-SE_MEAN_NODE-benchmark',
      nodeType: 'mean',
      sourceSystem: 'mean-lunar-node',
      sourceKey: 'lunar-nodes-mean',
      northLongitude: 345.286866095,
      southLongitude: 165.286866095,
      toleranceDegrees: 0.01,
    }),
  },
  {
    id: 'mean-node-2000-01-01',
    categories: Object.freeze(['benchmark']),
    input: Object.freeze({
      utcDateTime: '2000-01-01T12:00:00.000Z',
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      source: 'local-swisseph-SE_MEAN_NODE-benchmark',
      nodeType: 'mean',
      sourceSystem: 'mean-lunar-node',
      sourceKey: 'lunar-nodes-mean',
      northLongitude: 125.040646057,
      southLongitude: 305.040646057,
      toleranceDegrees: 0.01,
    }),
  },
  {
    id: 'mean-node-2026-05-15',
    categories: Object.freeze(['benchmark']),
    input: Object.freeze({
      utcDateTime: '2026-05-15T10:33:00.000Z',
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      source: 'local-swisseph-SE_MEAN_NODE-benchmark',
      nodeType: 'mean',
      sourceSystem: 'mean-lunar-node',
      sourceKey: 'lunar-nodes-mean',
      northLongitude: 335.051702042,
      southLongitude: 155.051702042,
      toleranceDegrees: 0.01,
    }),
  },
  {
    id: 'mean-node-2030-01-01',
    categories: Object.freeze(['benchmark']),
    input: Object.freeze({
      utcDateTime: '2030-01-01T00:00:00.000Z',
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      source: 'local-swisseph-SE_MEAN_NODE-benchmark',
      nodeType: 'mean',
      sourceSystem: 'mean-lunar-node',
      sourceKey: 'lunar-nodes-mean',
      northLongitude: 264.808649126,
      southLongitude: 84.808649126,
      toleranceDegrees: 0.01,
    }),
  },
  {
    id: 'mean-node-2043-wrap-aries',
    categories: Object.freeze(['benchmark', 'wrapAround', 'southNode']),
    input: Object.freeze({
      utcDateTime: '2043-09-11T00:00:00.000Z',
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      source: 'local-swisseph-SE_MEAN_NODE-benchmark',
      nodeType: 'mean',
      sourceSystem: 'mean-lunar-node',
      sourceKey: 'lunar-nodes-mean',
      northLongitude: 359.982282549,
      southLongitude: 179.982282549,
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
      trueNode: false,
      lilith: false,
      selena: false,
      readingsAdded: false,
      transits: false,
      fixedStars: false,
    }),
  },
]);

export function getLunarNodesFixture(id) {
  return LUNAR_NODES_FIXTURES.find((fixture) => fixture.id === id) ?? null;
}

export function getLunarNodesFixtureIds() {
  return LUNAR_NODES_FIXTURES.map((fixture) => fixture.id);
}

export function getLunarNodesFixtureCategories() {
  return [
    ...new Set(LUNAR_NODES_FIXTURES.flatMap((fixture) => fixture.categories ?? [fixture.category]).filter(Boolean)),
  ];
}
