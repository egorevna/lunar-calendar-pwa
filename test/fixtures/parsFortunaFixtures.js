export const PARS_FORTUNA_FIXTURES = Object.freeze([
  Object.freeze({
    id: 'day-formula-simple',
    category: 'formulaDay',
    label: 'Day formula ASC + Moon - Sun',
    input: Object.freeze({
      ascLongitude: 10,
      sunLongitude: 100,
      moonLongitude: 150,
      chartSect: 'day',
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      status: 'ready',
      formulaVariant: 'day',
      formula: 'ASC + Moon - Sun',
      longitude: 60,
      sign: Object.freeze({ key: 'gemini', ru: 'Близнецы', symbol: '♊' }),
      degree: 0,
      minutes: 0,
      seconds: 0,
      text: 'Парс Фортуны — Близнецы 0°00′00″',
    }),
  }),
  Object.freeze({
    id: 'night-formula-simple',
    category: 'formulaNight',
    label: 'Night formula ASC + Sun - Moon',
    input: Object.freeze({
      ascLongitude: 10,
      sunLongitude: 100,
      moonLongitude: 150,
      chartSect: 'night',
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      status: 'ready',
      formulaVariant: 'night',
      formula: 'ASC + Sun - Moon',
      longitude: 320,
      sign: Object.freeze({ key: 'aquarius', ru: 'Водолей', symbol: '♒' }),
      degree: 20,
      minutes: 0,
      seconds: 0,
      text: 'Парс Фортуны — Водолей 20°00′00″',
    }),
  }),
  Object.freeze({
    id: 'day-wrap-around-positive',
    category: 'wrapAround',
    label: 'Day formula normalizes positive wrap-around',
    input: Object.freeze({
      ascLongitude: 350,
      moonLongitude: 20,
      sunLongitude: 300,
      chartSect: 'day',
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      status: 'ready',
      formulaVariant: 'day',
      longitude: 70,
      text: 'Парс Фортуны — Близнецы 10°00′00″',
    }),
  }),
  Object.freeze({
    id: 'day-wrap-around-negative',
    category: 'wrapAround',
    label: 'Day formula normalizes negative result',
    input: Object.freeze({
      ascLongitude: 5,
      moonLongitude: 10,
      sunLongitude: 100,
      chartSect: 'day',
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      status: 'ready',
      formulaVariant: 'day',
      longitude: 275,
      text: 'Парс Фортуны — Козерог 5°00′00″',
    }),
  }),
  Object.freeze({
    id: 'invalid-missing-asc',
    category: 'invalid',
    label: 'Missing ASC blocks Pars Fortuna',
    input: Object.freeze({
      sunLongitude: 100,
      moonLongitude: 150,
      chartSect: 'day',
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      status: 'notReady',
      reason: 'missingAscLongitude',
    }),
  }),
  Object.freeze({
    id: 'invalid-missing-sun',
    category: 'invalid',
    label: 'Missing Sun blocks Pars Fortuna',
    input: Object.freeze({
      ascLongitude: 10,
      moonLongitude: 150,
      chartSect: 'day',
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      status: 'notReady',
      reason: 'missingSunLongitude',
    }),
  }),
  Object.freeze({
    id: 'invalid-missing-moon',
    category: 'invalid',
    label: 'Missing Moon blocks Pars Fortuna',
    input: Object.freeze({
      ascLongitude: 10,
      sunLongitude: 100,
      chartSect: 'day',
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      status: 'notReady',
      reason: 'missingMoonLongitude',
    }),
  }),
  Object.freeze({
    id: 'invalid-boundary-chart-sect',
    category: 'invalid',
    label: 'Boundary chart sect blocks Pars Fortuna',
    input: Object.freeze({
      ascLongitude: 10,
      sunLongitude: 100,
      moonLongitude: 150,
      chartSect: 'boundary',
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      status: 'notReady',
      reason: 'chartSectBoundary',
    }),
  }),
  Object.freeze({
    id: 'profile-missing-coordinates',
    category: 'profile',
    label: 'Profile with missing coordinates cannot calculate Pars Fortuna',
    input: Object.freeze({ profileState: 'missingCoordinates' }),
    expected: Object.freeze({
      manuallyDeclared: true,
      status: 'notReady',
      reason: 'cityWithoutCoordinates',
    }),
  }),
  Object.freeze({
    id: 'privacy-no-raw-birth-data',
    category: 'privacy',
    label: 'Pars Fortuna output excludes raw profile and coordinate fields',
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
    id: 'strict-exclusions-pars-fortuna',
    category: 'strictExclusions',
    label: 'Pars Fortuna engine does not add broad Arabic Parts',
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
      arabicPartsCatalog: false,
      lotOfSpirit: false,
      interpretations: false,
    }),
  }),
]);

export function getParsFortunaFixture(id) {
  return PARS_FORTUNA_FIXTURES.find((fixture) => fixture.id === id) ?? null;
}

export function getParsFortunaFixtureIds() {
  return PARS_FORTUNA_FIXTURES.map((fixture) => fixture.id);
}

export function getParsFortunaFixtureCategories() {
  return [...new Set(PARS_FORTUNA_FIXTURES.map((fixture) => fixture.category))];
}
