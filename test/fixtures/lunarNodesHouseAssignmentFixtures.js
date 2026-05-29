const WHOLE_SIGN_AQUARIUS_CUSPS = Object.freeze([
  [1, 300, 'aquarius', 'Водолей', '♒'],
  [2, 330, 'pisces', 'Рыбы', '♓'],
  [3, 0, 'aries', 'Овен', '♈'],
  [4, 30, 'taurus', 'Телец', '♉'],
  [5, 60, 'gemini', 'Близнецы', '♊'],
  [6, 90, 'cancer', 'Рак', '♋'],
  [7, 120, 'leo', 'Лев', '♌'],
  [8, 150, 'virgo', 'Дева', '♍'],
  [9, 180, 'libra', 'Весы', '♎'],
  [10, 210, 'scorpio', 'Скорпион', '♏'],
  [11, 240, 'sagittarius', 'Стрелец', '♐'],
  [12, 270, 'capricorn', 'Козерог', '♑'],
]);

const EQUAL_AQUARIUS_CUSPS = Object.freeze([
  [1, 314.791633, 'aquarius', 'Водолей', '♒'],
  [2, 344.791633, 'pisces', 'Рыбы', '♓'],
  [3, 14.791633, 'aries', 'Овен', '♈'],
  [4, 44.791633, 'taurus', 'Телец', '♉'],
  [5, 74.791633, 'gemini', 'Близнецы', '♊'],
  [6, 104.791633, 'cancer', 'Рак', '♋'],
  [7, 134.791633, 'leo', 'Лев', '♌'],
  [8, 164.791633, 'virgo', 'Дева', '♍'],
  [9, 194.791633, 'libra', 'Весы', '♎'],
  [10, 224.791633, 'scorpio', 'Скорпион', '♏'],
  [11, 254.791633, 'sagittarius', 'Стрелец', '♐'],
  [12, 284.791633, 'capricorn', 'Козерог', '♑'],
]);

const PLACIDUS_BENCHMARK_CUSPS = Object.freeze([
  [1, 314.791633, 'aquarius', 'Водолей', '♒'],
  [2, 23.900972, 'aries', 'Овен', '♈'],
  [3, 55.414891, 'taurus', 'Телец', '♉'],
  [4, 74.211916, 'gemini', 'Близнецы', '♊'],
  [5, 89.709349, 'gemini', 'Близнецы', '♊'],
  [6, 106.615575, 'cancer', 'Рак', '♋'],
  [7, 134.791633, 'leo', 'Лев', '♌'],
  [8, 203.900972, 'libra', 'Весы', '♎'],
  [9, 235.414891, 'scorpio', 'Скорпион', '♏'],
  [10, 254.211916, 'sagittarius', 'Стрелец', '♐'],
  [11, 269.709349, 'sagittarius', 'Стрелец', '♐'],
  [12, 286.615575, 'capricorn', 'Козерог', '♑'],
]);

export const LUNAR_NODES_HOUSE_ASSIGNMENT_FIXTURES = Object.freeze([
  Object.freeze({
    id: 'whole-sign-aquarius-boundaries',
    category: 'wholeSign',
    label: 'Whole Sign Aquarius sign-boundary node assignment',
    input: Object.freeze({
      cuspResult: makeCuspResult('whole-sign', 'Whole Sign', 'sign-boundary', WHOLE_SIGN_AQUARIUS_CUSPS),
      individualNodes: Object.freeze([
        makeNode('north-node', 'Северный узел', 315),
        makeNode('north-node-pisces', 'Северный узел', 331),
        makeNode('north-node-capricorn', 'Северный узел', 299),
        makeNode('south-node', 'Южный узел', 331),
      ]),
      nodesResult: makeNodesResult(
        makeNode('north-node', 'Северный узел', 315),
        makeNode('south-node', 'Южный узел', 299),
      ),
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      houseSystem: 'whole-sign',
      individualAssignments: Object.freeze({
        'north-node': 1,
        'north-node-pisces': 2,
        'north-node-capricorn': 12,
        'south-node': 2,
      }),
      assignments: Object.freeze({
        north: 1,
        south: 12,
      }),
    }),
  }),
  Object.freeze({
    id: 'equal-house-aquarius-boundaries',
    category: 'equalHouse',
    label: 'Equal House Aquarius exact and wrapping cusp node assignment',
    input: Object.freeze({
      cuspResult: makeCuspResult('equal-house', 'Равнодомная', 'equal-30-degree', EQUAL_AQUARIUS_CUSPS),
      individualNodes: Object.freeze([
        makeNode('equal-cusp-1', 'Северный узел', 314.791633),
        makeNode('equal-before-cusp-2', 'Северный узел', 344.791),
        makeNode('equal-cusp-2', 'Северный узел', 344.791633),
        makeNode('equal-wrap-house-12', 'Северный узел', 300),
      ]),
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      houseSystem: 'equal-house',
      individualAssignments: Object.freeze({
        'equal-cusp-1': 1,
        'equal-before-cusp-2': 1,
        'equal-cusp-2': 2,
        'equal-wrap-house-12': 12,
      }),
    }),
  }),
  Object.freeze({
    id: 'placidus-benchmark-boundaries',
    category: 'placidus',
    label: 'Placidus benchmark exact and wrapping cusp node assignment',
    input: Object.freeze({
      cuspResult: makeCuspResult('placidus', 'Placidus', 'quadrant-placidus', PLACIDUS_BENCHMARK_CUSPS, true),
      individualNodes: Object.freeze([
        makeNode('placidus-cusp-1', 'Северный узел', 314.791633),
        makeNode('placidus-before-cusp-2', 'Северный узел', 23.9009),
        makeNode('placidus-cusp-2', 'Северный узел', 23.900972),
        makeNode('placidus-wrap-house-12', 'Северный узел', 300),
      ]),
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      houseSystem: 'placidus',
      individualAssignments: Object.freeze({
        'placidus-cusp-1': 1,
        'placidus-before-cusp-2': 1,
        'placidus-cusp-2': 2,
        'placidus-wrap-house-12': 12,
      }),
    }),
  }),
  Object.freeze({
    id: 'cusp-boundary-policy',
    category: 'cuspBoundaries',
    label: 'Exact cusp belongs to the house starting at that cusp',
    input: Object.freeze({
      cuspResult: makeCuspResult('equal-house', 'Равнодомная', 'equal-30-degree', EQUAL_AQUARIUS_CUSPS),
      exactCuspLongitude: 344.791633,
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      houseNumber: 2,
      policy: '[cusp, nextCusp)',
    }),
  }),
  Object.freeze({
    id: 'wrapping-span-policy',
    category: 'wrappingSpans',
    label: 'Wrapping span from house 12 to house 1 is supported',
    input: Object.freeze({
      cuspResult: makeCuspResult('placidus', 'Placidus', 'quadrant-placidus', PLACIDUS_BENCHMARK_CUSPS, true),
      longitude: 300,
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      houseNumber: 12,
      wrapping: true,
    }),
  }),
  Object.freeze({
    id: 'invalid-inputs',
    category: 'invalid',
    label: 'Invalid nodes and cusps fail safely',
    input: Object.freeze({
      missingLongitudeNode: Object.freeze({
        key: 'north-node',
        label: 'Северный узел',
      }),
      notReadyNode: Object.freeze({
        status: 'notReady',
        ready: false,
        key: 'north-node',
        label: 'Северный узел',
        reason: 'missingUtcDateTime',
      }),
      notReadyNodesResult: Object.freeze({
        status: 'notReady',
        ready: false,
        reason: 'missingUtcDateTime',
        nodes: Object.freeze({
          north: null,
          south: null,
        }),
      }),
      emptyNodesResult: Object.freeze({
        status: 'ready',
        ready: true,
        nodes: Object.freeze({}),
      }),
      notReadyCusps: Object.freeze({
        status: 'notReady',
        ready: false,
        reason: 'cityWithoutCoordinates',
        cusps: Object.freeze([]),
      }),
      unsupportedCusps: Object.freeze({
        status: 'unsupported',
        ready: false,
        houseSystem: 'campanus',
        reason: 'unsupportedHouseSystem',
        cusps: Object.freeze([]),
      }),
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      invalidNodeReason: 'missingNodeLongitude',
      notReadyNodeReason: 'missingUtcDateTime',
      notReadyReason: 'cityWithoutCoordinates',
      unsupportedReason: 'unsupportedHouseSystem',
      emptyNodesReason: 'emptyNodesResult',
    }),
  }),
  Object.freeze({
    id: 'profile-ready-injected',
    category: 'profile',
    label: 'Profile helper can assign injected ready nodes and cusps',
    input: Object.freeze({
      nodesResult: makeNodesResult(
        makeNode('north-node', 'Северный узел', 315),
        makeNode('south-node', 'Южный узел', 120),
      ),
      cuspResult: makeCuspResult('whole-sign', 'Whole Sign', 'sign-boundary', WHOLE_SIGN_AQUARIUS_CUSPS),
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      assignments: Object.freeze({
        north: 1,
        south: 7,
      }),
    }),
  }),
  Object.freeze({
    id: 'privacy-safe-assignment-output',
    category: 'privacy',
    label: 'Lunar Nodes house assignment output excludes private fields',
    input: Object.freeze({ check: 'safe-output' }),
    expected: Object.freeze({
      manuallyDeclared: true,
      rawBirthDataExposed: false,
      rawPlaceDataExposed: false,
      rawExternalPayloadExposed: false,
      readingsAdded: false,
    }),
  }),
  Object.freeze({
    id: 'strict-exclusions-assignment',
    category: 'strictExclusions',
    label: 'Assignment layer stays scoped to North/South Lunar Nodes',
    input: Object.freeze({ check: 'source-scan' }),
    expected: Object.freeze({
      manuallyDeclared: true,
      forbiddenFiles: Object.freeze([
        'src/houses.js',
        'src/houseSystems.js',
      ]),
      providerImports: false,
      domStorageImports: false,
      nodeCalculation: false,
      trueNodeActivation: false,
      lilith: false,
      selena: false,
      readingsAdded: false,
    }),
  }),
]);

export function getLunarNodesHouseAssignmentFixture(id) {
  return LUNAR_NODES_HOUSE_ASSIGNMENT_FIXTURES.find((fixture) => fixture.id === id) ?? null;
}

export function getLunarNodesHouseAssignmentFixtureIds() {
  return LUNAR_NODES_HOUSE_ASSIGNMENT_FIXTURES.map((fixture) => fixture.id);
}

export function getLunarNodesHouseAssignmentFixtureCategories() {
  return [...new Set(LUNAR_NODES_HOUSE_ASSIGNMENT_FIXTURES.map((fixture) => fixture.category))];
}

function makeNode(key, label, longitude) {
  return Object.freeze({
    key,
    label,
    longitude,
    sourceSystem: 'mean-lunar-node',
    sourceKey: 'lunar-nodes-mean',
    text: `${label} — synthetic position`,
  });
}

function makeNodesResult(north, south) {
  return Object.freeze({
    status: 'ready',
    ready: true,
    sourceSystem: 'mean-lunar-node',
    sourceKey: 'lunar-nodes-mean',
    nodes: Object.freeze({
      north,
      south,
    }),
  });
}

function makeCuspResult(houseSystem, houseSystemLabel, cuspType, rows, benchmarkValidated = false) {
  return Object.freeze({
    status: 'ready',
    ready: true,
    houseSystem,
    houseSystemLabel,
    cuspType,
    exactCuspDegrees: cuspType !== 'sign-boundary',
    benchmarkValidated,
    cusps: Object.freeze(rows.map(([number, longitude, key, ru, symbol]) => Object.freeze({
      number,
      longitude,
      sign: Object.freeze({ key, ru, symbol }),
      label: `Куспид ${number} дома`,
      text: `${number} дом — ${ru}`,
    }))),
  });
}
