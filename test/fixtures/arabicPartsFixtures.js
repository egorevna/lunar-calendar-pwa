export const ARABIC_PARTS_FIXTURES = Object.freeze([
  Object.freeze({
    id: 'day-formula-simple',
    category: 'formulaDay',
    label: 'Day formulas for active verified parts',
    input: Object.freeze({
      ascLongitude: 10,
      sunLongitude: 100,
      moonLongitude: 150,
      chartSect: 'day',
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      status: 'ready',
      activeKeys: Object.freeze(['pars-fortuna', 'lot-of-spirit']),
      parts: Object.freeze({
        'pars-fortuna': Object.freeze({
          key: 'pars-fortuna',
          label: 'Парс Фортуны',
          labelEn: 'Lot of Fortune',
          formulaVariant: 'day',
          formula: 'ASC + Moon - Sun',
          longitude: 60,
          sign: Object.freeze({ key: 'gemini', ru: 'Близнецы', symbol: '♊' }),
          degree: 0,
          minutes: 0,
          seconds: 0,
          text: 'Парс Фортуны — Близнецы 0°00′00″',
        }),
        'lot-of-spirit': Object.freeze({
          key: 'lot-of-spirit',
          label: 'Жребий Духа',
          labelEn: 'Lot of Spirit',
          formulaVariant: 'day',
          formula: 'ASC + Sun - Moon',
          longitude: 320,
          sign: Object.freeze({ key: 'aquarius', ru: 'Водолей', symbol: '♒' }),
          degree: 20,
          minutes: 0,
          seconds: 0,
          text: 'Жребий Духа — Водолей 20°00′00″',
        }),
      }),
    }),
  }),
  Object.freeze({
    id: 'night-formula-simple',
    category: 'formulaNight',
    label: 'Night formulas for active verified parts',
    input: Object.freeze({
      ascLongitude: 10,
      sunLongitude: 100,
      moonLongitude: 150,
      chartSect: 'night',
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      status: 'ready',
      activeKeys: Object.freeze(['pars-fortuna', 'lot-of-spirit']),
      parts: Object.freeze({
        'pars-fortuna': Object.freeze({
          key: 'pars-fortuna',
          label: 'Парс Фортуны',
          labelEn: 'Lot of Fortune',
          formulaVariant: 'night',
          formula: 'ASC + Sun - Moon',
          longitude: 320,
          sign: Object.freeze({ key: 'aquarius', ru: 'Водолей', symbol: '♒' }),
          degree: 20,
          minutes: 0,
          seconds: 0,
          text: 'Парс Фортуны — Водолей 20°00′00″',
        }),
        'lot-of-spirit': Object.freeze({
          key: 'lot-of-spirit',
          label: 'Жребий Духа',
          labelEn: 'Lot of Spirit',
          formulaVariant: 'night',
          formula: 'ASC + Moon - Sun',
          longitude: 60,
          sign: Object.freeze({ key: 'gemini', ru: 'Близнецы', symbol: '♊' }),
          degree: 0,
          minutes: 0,
          seconds: 0,
          text: 'Жребий Духа — Близнецы 0°00′00″',
        }),
      }),
    }),
  }),
  Object.freeze({
    id: 'day-wrap-around-positive',
    category: 'wrapAround',
    label: 'Day formula normalizes positive wrap-around',
    input: Object.freeze({
      ascLongitude: 350,
      sunLongitude: 300,
      moonLongitude: 20,
      chartSect: 'day',
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      parts: Object.freeze({
        'pars-fortuna': Object.freeze({
          longitude: 70,
          text: 'Парс Фортуны — Близнецы 10°00′00″',
        }),
        'lot-of-spirit': Object.freeze({
          longitude: 270,
          text: 'Жребий Духа — Козерог 0°00′00″',
        }),
      }),
    }),
  }),
  Object.freeze({
    id: 'day-wrap-around-negative',
    category: 'wrapAround',
    label: 'Day formula normalizes negative result',
    input: Object.freeze({
      ascLongitude: 5,
      sunLongitude: 100,
      moonLongitude: 10,
      chartSect: 'day',
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      parts: Object.freeze({
        'pars-fortuna': Object.freeze({
          longitude: 275,
          text: 'Парс Фортуны — Козерог 5°00′00″',
        }),
        'lot-of-spirit': Object.freeze({
          longitude: 95,
          text: 'Жребий Духа — Рак 5°00′00″',
        }),
      }),
    }),
  }),
  Object.freeze({
    id: 'active-only',
    category: 'activeOnly',
    label: 'Only active verified parts calculate',
    input: Object.freeze({
      formulaKeys: Object.freeze([
        'pars-fortuna',
        'lot-of-spirit',
        'lot-of-eros',
        'lot-of-necessity',
        'lot-of-basis',
        'lot-of-exaltation',
      ]),
    }),
    expected: Object.freeze({
      manuallyDeclared: true,
      activeKeys: Object.freeze(['pars-fortuna', 'lot-of-spirit']),
      deferredKeys: Object.freeze([
        'lot-of-eros',
        'lot-of-necessity',
        'lot-of-basis',
        'lot-of-exaltation',
      ]),
    }),
  }),
  Object.freeze({
    id: 'invalid-missing-asc',
    category: 'invalid',
    label: 'Missing ASC blocks Arabic Parts',
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
    label: 'Missing Sun blocks Arabic Parts',
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
    label: 'Missing Moon blocks Arabic Parts',
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
    label: 'Boundary chart sect blocks Arabic Parts',
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
    id: 'profile-missing-inputs',
    category: 'profile',
    label: 'Profile missing required inputs cannot calculate Arabic Parts',
    input: Object.freeze({ profileState: 'missingRequiredInputs' }),
    expected: Object.freeze({
      manuallyDeclared: true,
      status: 'notReady',
      reason: 'missingRequiredInputs',
    }),
  }),
  Object.freeze({
    id: 'privacy-safe-output',
    category: 'privacy',
    label: 'Arabic Parts output excludes raw private profile fields',
    input: Object.freeze({ check: 'safe-output' }),
    expected: Object.freeze({
      manuallyDeclared: true,
      rawBirthDataExposed: false,
      rawPlaceDataExposed: false,
      fullProfileJsonExposed: false,
      providerPayloadExposed: false,
    }),
  }),
  Object.freeze({
    id: 'strict-exclusions-arabic-parts',
    category: 'strictExclusions',
    label: 'Arabic Parts engine stays scoped to verified formulas',
    input: Object.freeze({ check: 'source-scan' }),
    expected: Object.freeze({
      manuallyDeclared: true,
      forbiddenFiles: Object.freeze([
        'src/houses.js',
        'src/houseSystems.js',
      ]),
      activeKeys: Object.freeze(['pars-fortuna', 'lot-of-spirit']),
      deferredKeys: Object.freeze([
        'lot-of-eros',
        'lot-of-necessity',
        'lot-of-basis',
        'lot-of-exaltation',
      ]),
      providerImports: false,
      domStorageImports: false,
      swissephImport: false,
      houseAssignment: false,
      interpretationText: false,
    }),
  }),
]);

export function getArabicPartsFixture(id) {
  return ARABIC_PARTS_FIXTURES.find((fixture) => fixture.id === id) ?? null;
}

export function getArabicPartsFixtureIds() {
  return ARABIC_PARTS_FIXTURES.map((fixture) => fixture.id);
}

export function getArabicPartsFixtureCategories() {
  return [...new Set(ARABIC_PARTS_FIXTURES.map((fixture) => fixture.category))];
}
