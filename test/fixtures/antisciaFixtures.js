const FORMULA_FIXTURES = Object.freeze([
  antisciaFormulaFixture('formula-10', 10, 170, 350),
  antisciaFormulaFixture('formula-40', 40, 140, 320),
  antisciaFormulaFixture('formula-70', 70, 110, 290),
  antisciaFormulaFixture('formula-100', 100, 80, 260),
  antisciaFormulaFixture('formula-280', 280, 260, 80),
]);

const AXIS_POINT_FIXTURES = Object.freeze([
  antisciaFormulaFixture('axis-cancer-0', 90, 90, 270, ['axisPoints']),
  antisciaFormulaFixture('axis-capricorn-0', 270, 270, 90, ['axisPoints']),
  antisciaFormulaFixture('axis-aries-0', 0, 180, 0, ['axisPoints']),
  antisciaFormulaFixture('axis-libra-0', 180, 0, 180, ['axisPoints']),
]);

export const SYNTHETIC_ANTISCIA_ENGINE_TARGETS_RESULT = Object.freeze({
  status: 'ready',
  ready: true,
  targetSets: Object.freeze(['natal-planets', 'angles']),
  targetCount: 14,
  targets: Object.freeze([
    target('sun', 'Солнце', 'Sun', 'natal-planet', 'natal-planets', 10),
    target('moon', 'Луна', 'Moon', 'natal-planet', 'natal-planets', 40),
    target('mercury', 'Меркурий', 'Mercury', 'natal-planet', 'natal-planets', 70),
    target('venus', 'Венера', 'Venus', 'natal-planet', 'natal-planets', 100),
    target('mars', 'Марс', 'Mars', 'natal-planet', 'natal-planets', 130),
    target('jupiter', 'Юпитер', 'Jupiter', 'natal-planet', 'natal-planets', 160),
    target('saturn', 'Сатурн', 'Saturn', 'natal-planet', 'natal-planets', 190),
    target('uranus', 'Уран', 'Uranus', 'natal-planet', 'natal-planets', 220),
    target('neptune', 'Нептун', 'Neptune', 'natal-planet', 'natal-planets', 250),
    target('pluto', 'Плутон', 'Pluto', 'natal-planet', 'natal-planets', 280),
    target('asc', 'ASC', 'Ascendant', 'angle', 'angles', 15),
    target('mc', 'MC', 'Medium Coeli', 'angle', 'angles', 105),
    target('dsc', 'DSC', 'Descendant', 'angle', 'angles', 195),
    target('ic', 'IC', 'Imum Coeli', 'angle', 'angles', 285),
  ]),
});

export const PARTIAL_ANTISCIA_ENGINE_TARGETS_RESULT = Object.freeze({
  status: 'partial',
  ready: true,
  targetSets: Object.freeze(['natal-planets']),
  missingTargetSets: Object.freeze([
    Object.freeze({ targetSet: 'angles', reason: 'ascMcNotReady' }),
  ]),
  targetCount: 10,
  targets: SYNTHETIC_ANTISCIA_ENGINE_TARGETS_RESULT.targets.slice(0, 10),
});

export const ANTISCIA_FIXTURES = Object.freeze([
  ...FORMULA_FIXTURES,
  ...AXIS_POINT_FIXTURES,
  {
    id: 'single-target-sun',
    categories: Object.freeze(['target']),
    input: Object.freeze({
      target: SYNTHETIC_ANTISCIA_ENGINE_TARGETS_RESULT.targets[0],
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      status: 'ready',
      key: 'sun',
      targetLabel: 'Солнце',
      targetCategory: 'natal-planet',
      antiscion: 170,
      contraAntiscion: 350,
      antiscionSignKey: 'virgo',
      contraAntiscionSignKey: 'pisces',
      fullTargetObjectPresent: false,
    }),
  },
  {
    id: 'batch-ready',
    categories: Object.freeze(['batch']),
    input: Object.freeze({
      targetsResult: SYNTHETIC_ANTISCIA_ENGINE_TARGETS_RESULT,
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      status: 'ready',
      targetCount: 14,
      readyCount: 14,
      invalidCount: 0,
      selectedOutputs: Object.freeze({
        sun: Object.freeze({ antiscion: 170, contraAntiscion: 350 }),
        moon: Object.freeze({ antiscion: 140, contraAntiscion: 320 }),
        pluto: Object.freeze({ antiscion: 260, contraAntiscion: 80 }),
        asc: Object.freeze({ antiscion: 165, contraAntiscion: 345 }),
        mc: Object.freeze({ antiscion: 75, contraAntiscion: 255 }),
        dsc: Object.freeze({ antiscion: 345, contraAntiscion: 165 }),
        ic: Object.freeze({ antiscion: 255, contraAntiscion: 75 }),
      }),
    }),
  },
  {
    id: 'partial-targets',
    categories: Object.freeze(['partial']),
    input: Object.freeze({
      targetsResult: PARTIAL_ANTISCIA_ENGINE_TARGETS_RESULT,
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      status: 'partial',
      targetCount: 10,
      readyCount: 10,
      invalidCount: 0,
    }),
  },
  {
    id: 'invalid-longitude',
    categories: Object.freeze(['invalid']),
    input: Object.freeze({
      longitude: Number.NaN,
      target: Object.freeze({
        key: 'sun',
        label: 'Солнце',
        labelEn: 'Sun',
        category: 'natal-planet',
        targetSet: 'natal-planets',
        longitude: Number.NaN,
      }),
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      status: 'invalid',
      ready: false,
      reason: 'invalidLongitude',
    }),
  },
  {
    id: 'profile-fallback',
    categories: Object.freeze(['profile']),
    expected: Object.freeze({
      manuallyDeclared: true,
      noProfileStatus: 'notReady',
      injectedReadyStatus: 'ready',
    }),
  },
  {
    id: 'privacy',
    categories: Object.freeze(['privacy']),
    expected: Object.freeze({
      manuallyDeclared: true,
      rawBirthDataExposed: false,
      rawGeoValuesExposed: false,
      fullPrivateJsonExposed: false,
      providerDataExposed: false,
    }),
  },
  {
    id: 'strict-exclusions',
    categories: Object.freeze(['strictExclusions']),
    expected: Object.freeze({
      manuallyDeclared: true,
      contacts: false,
      aspects: false,
      midpoints: false,
      display: false,
      ui: false,
      debug: false,
      interpretations: false,
    }),
  },
]);

export function getAntisciaFixture(id) {
  return ANTISCIA_FIXTURES.find((fixture) => fixture.id === id) ?? null;
}

export function getAntisciaFixtureIds() {
  return ANTISCIA_FIXTURES.map((fixture) => fixture.id);
}

export function getAntisciaFixtureCategories() {
  return [
    ...new Set(
      ANTISCIA_FIXTURES
        .flatMap((fixture) => fixture.categories ?? [fixture.category])
        .filter(Boolean),
    ),
  ];
}

function antisciaFormulaFixture(id, longitude, antiscion, contraAntiscion, categories = ['formula']) {
  return Object.freeze({
    id,
    categories: Object.freeze(categories),
    input: Object.freeze({ longitude }),
    expected: Object.freeze({
      manuallyDeclared: true,
      status: 'ready',
      antiscion,
      contraAntiscion,
    }),
  });
}

function target(key, label, labelEn, category, targetSet, longitude) {
  return Object.freeze({
    key,
    label,
    labelEn,
    category,
    targetSet,
    longitude,
    sign: Object.freeze({ key: 'synthetic', ru: 'Synthetic', symbol: '*' }),
    degree: 0,
    minutes: 0,
    seconds: 0,
    text: `${label} — synthetic`,
    source: targetSet,
  });
}
