const SIMPLE_CUSPS = Object.freeze([
  [1, 0, 'aries', 'Овен', '♈'],
  [2, 30, 'taurus', 'Телец', '♉'],
  [3, 60, 'gemini', 'Близнецы', '♊'],
  [4, 90, 'cancer', 'Рак', '♋'],
  [5, 120, 'leo', 'Лев', '♌'],
  [6, 150, 'virgo', 'Дева', '♍'],
  [7, 180, 'libra', 'Весы', '♎'],
  [8, 210, 'scorpio', 'Скорпион', '♏'],
  [9, 240, 'sagittarius', 'Стрелец', '♐'],
  [10, 270, 'capricorn', 'Козерог', '♑'],
  [11, 300, 'aquarius', 'Водолей', '♒'],
  [12, 330, 'pisces', 'Рыбы', '♓'],
]);

const VRONSKY_PART_ROWS = Object.freeze([
  ['pars-amoris', 'Точка любви', 170],
  ['pars-artis', 'Точка искусства', 80],
  ['pars-creationis', 'Точка друзей', 300],
  ['pars-fratrum-et-sororum', 'Братья и сестры', 70],
  ['pars-hereditatis', 'Точка наследства', 350],
  ['pars-itineris', 'Точка веры', 120],
  ['pars-liberorum', 'Точка свободы', 130],
  ['pars-matris', 'Точка матери', 60],
  ['pars-patris', 'Точка отца', 320],
  ['pars-pueri', 'Дети мужского пола', 180],
  ['astrologia', 'Астрология', 320],
  ['pars-mercaturae', 'Торговля', 150],
]);

const READY_VRONSKY_RESULT = Object.freeze({
  status: 'ready',
  ready: true,
  sourceSystem: 'vronsky-table-17-arabic-points',
  formulaTradition: 'Vronsky Table 17 Arabic Points',
  chartSectPolicy: 'dayOnly',
  chartSect: 'day',
  total: 12,
  readyCount: 12,
  notReadyCount: 0,
  parts: Object.freeze(VRONSKY_PART_ROWS.map(([key, label, longitude]) => makeVronskyPart(key, label, longitude))),
});

export const VRONSKY_ARABIC_PARTS_HOUSE_ASSIGNMENT_FIXTURES = Object.freeze([
  Object.freeze({
    id: 'day-ready-simple-cusps',
    category: 'dayReady',
    input: Object.freeze({
      vronskyResult: READY_VRONSKY_RESULT,
      cuspResult: makeCuspResult('equal-house', 'Равнодомная', 'equal-30-degree', SIMPLE_CUSPS),
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      status: 'ready',
      houseSystem: 'equal-house',
      assignments: Object.freeze({
        'pars-amoris': 6,
        'pars-artis': 3,
        'pars-creationis': 11,
        'pars-fratrum-et-sororum': 3,
        'pars-hereditatis': 12,
        'pars-itineris': 5,
        'pars-liberorum': 5,
        'pars-matris': 3,
        'pars-patris': 11,
        'pars-pueri': 7,
        astrologia: 11,
        'pars-mercaturae': 6,
      }),
    }),
  }),
  Object.freeze({
    id: 'exact-cusp-boundaries',
    category: 'cuspBoundaries',
    input: Object.freeze({
      cuspResult: makeCuspResult('equal-house', 'Равнодомная', 'equal-30-degree', SIMPLE_CUSPS),
      exactCuspParts: Object.freeze([
        makeVronskyPart('pars-matris', 'Точка матери', 60),
        makeVronskyPart('pars-pueri', 'Дети мужского пола', 180),
      ]),
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      assignments: Object.freeze({
        'pars-matris': 3,
        'pars-pueri': 7,
      }),
      policy: '[cusp, nextCusp)',
    }),
  }),
  Object.freeze({
    id: 'wrapping-span',
    category: 'wrappingSpans',
    input: Object.freeze({
      cuspResult: makeCuspResult('equal-house', 'Равнодомная', 'equal-30-degree', SIMPLE_CUSPS),
      part: makeVronskyPart('pars-hereditatis', 'Точка наследства', 350),
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      houseNumber: 12,
      wrapping: true,
    }),
  }),
  Object.freeze({
    id: 'night-not-ready',
    category: 'nightNotReady',
    input: Object.freeze({
      vronskyResult: Object.freeze({
        status: 'notReady',
        ready: false,
        reason: 'vronskyNightFormulaNotVerified',
        chartSect: 'night',
        parts: Object.freeze([]),
      }),
      cuspResult: makeCuspResult('equal-house', 'Равнодомная', 'equal-30-degree', SIMPLE_CUSPS),
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      status: 'notReady',
      reason: 'vronskyNightFormulaNotVerified',
    }),
  }),
  Object.freeze({
    id: 'missing-house-cusps',
    category: 'missingHouseCusps',
    input: Object.freeze({
      vronskyResult: READY_VRONSKY_RESULT,
      cuspResult: Object.freeze({
        status: 'notReady',
        ready: false,
        reason: 'cityWithoutCoordinates',
        cusps: Object.freeze([]),
      }),
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      status: 'notReady',
      reason: 'cityWithoutCoordinates',
    }),
  }),
  Object.freeze({
    id: 'invalid-inputs',
    category: 'invalid',
    input: Object.freeze({
      missingLongitudePart: Object.freeze({
        status: 'ready',
        ready: true,
        key: 'pars-amoris',
        label: 'Точка любви',
        sourceSystem: 'vronsky-table-17-arabic-points',
        activationStatus: 'explicitVronskyEngineOnly',
      }),
      nonVronskyPart: Object.freeze({
        status: 'ready',
        ready: true,
        key: 'lot-of-eros',
        label: 'Жребий Эроса',
        longitude: 170,
      }),
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      missingLongitudeReason: 'missingPartLongitude',
      nonVronskyReason: 'notVronskyArabicPart',
    }),
  }),
  Object.freeze({
    id: 'privacy-safe-assignment-output',
    category: 'privacy',
    expected: Object.freeze({
      manuallyDeclared: true,
      rawBirthDataExposed: false,
      rawCoordinatesExposed: false,
      rawLongitudeExposed: false,
      providerPayloadExposed: false,
      interpretations: false,
    }),
  }),
  Object.freeze({
    id: 'strict-exclusions-assignment',
    category: 'strictExclusions',
    expected: Object.freeze({
      manuallyDeclared: true,
      defaultArabicPartsChanged: false,
      oldDeferredLotsActivated: false,
      uiChange: false,
      debugChange: false,
      swChange: false,
      packageChange: false,
      interpretations: false,
    }),
  }),
]);

export function getVronskyArabicPartsHouseAssignmentFixture(id) {
  return VRONSKY_ARABIC_PARTS_HOUSE_ASSIGNMENT_FIXTURES.find((fixture) => fixture.id === id) ?? null;
}

export function getVronskyArabicPartsHouseAssignmentFixtureIds() {
  return VRONSKY_ARABIC_PARTS_HOUSE_ASSIGNMENT_FIXTURES.map((fixture) => fixture.id);
}

export function getVronskyArabicPartsHouseAssignmentFixtureCategories() {
  return [...new Set(VRONSKY_ARABIC_PARTS_HOUSE_ASSIGNMENT_FIXTURES.map((fixture) => fixture.category))];
}

function makeVronskyPart(key, label, longitude) {
  return Object.freeze({
    status: 'ready',
    ready: true,
    key,
    label,
    longitude,
    text: `${label} — synthetic position`,
    sourceSystem: 'vronsky-table-17-arabic-points',
    formulaTradition: 'Vronsky Table 17 Arabic Points',
    chartSectPolicy: 'dayOnly',
    activationStatus: 'explicitVronskyEngineOnly',
  });
}

function makeCuspResult(houseSystem, houseSystemLabel, cuspType, rows) {
  return Object.freeze({
    status: 'ready',
    ready: true,
    houseSystem,
    houseSystemLabel,
    cuspType,
    exactCuspDegrees: cuspType !== 'sign-boundary',
    benchmarkValidated: false,
    cusps: Object.freeze(rows.map(([number, longitude, key, ru, symbol]) => Object.freeze({
      number,
      longitude,
      sign: Object.freeze({ key, ru, symbol }),
      label: `Куспид ${number} дома`,
      text: `${number} дом — ${ru}`,
    }))),
  });
}
