const READY_PARTS = Object.freeze([
  makeDisplayPart('pars-amoris', 'Точка любви', 170, 'virgo', 'Дева', '♍', 20, 0, 0),
  makeDisplayPart('pars-artis', 'Точка искусства', 80, 'gemini', 'Близнецы', '♊', 20, 0, 0),
  makeDisplayPart('pars-creationis', 'Точка друзей', 300, 'aquarius', 'Водолей', '♒', 0, 0, 0),
  makeDisplayPart('pars-fratrum-et-sororum', 'Братья и сестры', 70, 'gemini', 'Близнецы', '♊', 10, 0, 0),
  makeDisplayPart('pars-hereditatis', 'Точка наследства', 350, 'pisces', 'Рыбы', '♓', 20, 0, 0),
  makeDisplayPart('pars-itineris', 'Точка веры', 120, 'leo', 'Лев', '♌', 0, 0, 0),
  makeDisplayPart('pars-liberorum', 'Точка свободы', 130, 'leo', 'Лев', '♌', 10, 0, 0),
  makeDisplayPart('pars-matris', 'Точка матери', 60, 'gemini', 'Близнецы', '♊', 0, 0, 0),
  makeDisplayPart('pars-patris', 'Точка отца', 320, 'aquarius', 'Водолей', '♒', 20, 0, 0),
  makeDisplayPart('pars-pueri', 'Дети мужского пола', 180, 'libra', 'Весы', '♎', 0, 0, 0),
  makeDisplayPart('astrologia', 'Астрология', 320, 'aquarius', 'Водолей', '♒', 20, 0, 0),
  makeDisplayPart('pars-mercaturae', 'Торговля', 150, 'virgo', 'Дева', '♍', 0, 0, 0),
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
  parts: READY_PARTS,
});

const READY_ASSIGNMENT_RESULT = Object.freeze({
  status: 'ready',
  ready: true,
  sourceSystem: 'vronsky-table-17-arabic-points',
  houseSystem: 'equal-house',
  total: 12,
  readyCount: 12,
  invalidCount: 0,
  assignments: Object.freeze([
    makeAssignment('pars-amoris', 'Точка любви', 6),
    makeAssignment('pars-artis', 'Точка искусства', 3),
    makeAssignment('pars-creationis', 'Точка друзей', 11),
    makeAssignment('pars-fratrum-et-sororum', 'Братья и сестры', 3),
    makeAssignment('pars-hereditatis', 'Точка наследства', 12),
    makeAssignment('pars-itineris', 'Точка веры', 5),
    makeAssignment('pars-liberorum', 'Точка свободы', 5),
    makeAssignment('pars-matris', 'Точка матери', 3),
    makeAssignment('pars-patris', 'Точка отца', 11),
    makeAssignment('pars-pueri', 'Дети мужского пола', 7),
    makeAssignment('astrologia', 'Астрология', 11),
    makeAssignment('pars-mercaturae', 'Торговля', 6),
  ]),
});

export const VRONSKY_ARABIC_PARTS_DISPLAY_FIXTURES = Object.freeze([
  Object.freeze({
    id: 'day-ready-display',
    category: 'dayReady',
    input: Object.freeze({
      vronskyResult: READY_VRONSKY_RESULT,
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      itemCount: 12,
      firstText: 'Точка любви — Дева 20°00′00″',
      summary: '12 точек Вронского рассчитаны',
    }),
  }),
  Object.freeze({
    id: 'with-house-assignments',
    category: 'withHouseAssignments',
    input: Object.freeze({
      vronskyResult: READY_VRONSKY_RESULT,
      assignmentResult: READY_ASSIGNMENT_RESULT,
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      firstText: 'Точка любви — Дева 20°00′00″ · 6 дом',
      lastText: 'Торговля — Дева 0°00′00″ · 6 дом',
      houseAssignments: 12,
    }),
  }),
  Object.freeze({
    id: 'night-not-ready',
    category: 'nightNotReady',
    input: Object.freeze({
      vronskyResult: makeNotReadyResult('night', 'vronskyNightFormulaNotVerified'),
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      message: 'Точки Вронского пока недоступны для ночной карты. Ночные формулы по Вронскому пока не verified.',
    }),
  }),
  Object.freeze({
    id: 'boundary-not-ready',
    category: 'boundaryNotReady',
    input: Object.freeze({
      vronskyResult: makeNotReadyResult('boundary', 'chartSectBoundary'),
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      message: 'Точки Вронского пока недоступны на границе дня и ночи.',
    }),
  }),
  Object.freeze({
    id: 'unknown-not-ready',
    category: 'unknownNotReady',
    input: Object.freeze({
      vronskyResult: makeNotReadyResult('unknown', 'chartSectNotReady'),
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      message: 'Для расчета точек Вронского нужна готовая дневная/ночная карта.',
    }),
  }),
  Object.freeze({
    id: 'privacy-safe-display-output',
    category: 'privacy',
    expected: Object.freeze({
      manuallyDeclared: true,
      rawBirthDataExposed: false,
      rawCoordinatesExposed: false,
      rawLongitudeExposed: false,
      formulaOperandsExposed: false,
      providerPayloadExposed: false,
      interpretations: false,
    }),
  }),
  Object.freeze({
    id: 'strict-exclusions-display',
    category: 'strictExclusions',
    expected: Object.freeze({
      manuallyDeclared: true,
      displayOnly: true,
      uiChange: false,
      debugChange: false,
      calculationsChanged: false,
      interpretations: false,
    }),
  }),
]);

export function getVronskyArabicPartsDisplayFixture(id) {
  return VRONSKY_ARABIC_PARTS_DISPLAY_FIXTURES.find((fixture) => fixture.id === id) ?? null;
}

export function getVronskyArabicPartsDisplayFixtureIds() {
  return VRONSKY_ARABIC_PARTS_DISPLAY_FIXTURES.map((fixture) => fixture.id);
}

export function getVronskyArabicPartsDisplayFixtureCategories() {
  return [...new Set(VRONSKY_ARABIC_PARTS_DISPLAY_FIXTURES.map((fixture) => fixture.category))];
}

function makeDisplayPart(key, label, longitude, signKey, signRu, symbol, degree, minutes, seconds) {
  return Object.freeze({
    status: 'ready',
    ready: true,
    key,
    label,
    labelEn: key,
    longitude,
    sign: Object.freeze({ key: signKey, ru: signRu, symbol }),
    degree,
    minutes,
    seconds,
    text: `${label} — ${signRu} ${degree}°${String(minutes).padStart(2, '0')}′${String(seconds).padStart(2, '0')}″`,
    formulaVariant: 'day',
    sourceSystem: 'vronsky-table-17-arabic-points',
    formulaTradition: 'Vronsky Table 17 Arabic Points',
    chartSectPolicy: 'dayOnly',
    activationStatus: 'explicitVronskyEngineOnly',
  });
}

function makeAssignment(key, label, houseNumber) {
  return Object.freeze({
    status: 'ready',
    ready: true,
    key,
    label,
    houseNumber,
    houseLabel: `${houseNumber} дом`,
    text: `${label} — ${houseNumber} дом`,
  });
}

function makeNotReadyResult(chartSect, reason) {
  return Object.freeze({
    status: 'notReady',
    ready: false,
    reason,
    chartSect,
    sourceSystem: 'vronsky-table-17-arabic-points',
    formulaTradition: 'Vronsky Table 17 Arabic Points',
    chartSectPolicy: 'dayOnly',
    total: 0,
    readyCount: 0,
    notReadyCount: 0,
    parts: Object.freeze([]),
  });
}
