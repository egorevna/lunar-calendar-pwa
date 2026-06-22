export const VRONSKY_ARABIC_PARTS_DATA_FIXTURES = Object.freeze([
  Object.freeze({
    id: 'vronsky-source-policy',
    category: 'sourcePolicy',
    expected: Object.freeze({
      sourceSystem: 'vronsky-table-17-arabic-points',
      sourceCorpus: 'Вронский, Том 1, Приложение 2, Таблица 17 — Арабские точки',
      formulaTradition: 'Vronsky Table 17 Arabic Points',
      sourceSection: 'Для дневного рождения',
      externalTraditionsUsed: false,
      manuallyDeclared: true,
    }),
  }),
  Object.freeze({
    id: 'existing-active-rows',
    category: 'existingActiveRows',
    expected: Object.freeze({
      activeKeys: Object.freeze(['pars-fortuna', 'lot-of-spirit']),
      parsFortunaDay: 'ASC + Moon - Sun',
      parsFortunaNight: 'ASC + Sun - Moon',
      lotOfSpiritDay: 'ASC + Sun - Moon',
      lotOfSpiritNight: 'ASC + Moon - Sun',
      manuallyDeclared: true,
    }),
  }),
  Object.freeze({
    id: 'vronsky-simple-row-keys',
    category: 'vronskySimpleRows',
    expected: Object.freeze({
      keys: Object.freeze([
        'pars-amoris',
        'pars-artis',
        'pars-creationis',
        'pars-fratrum-et-sororum',
        'pars-hereditatis',
        'pars-itineris',
        'pars-liberorum',
        'pars-matris',
        'pars-patris',
        'pars-pueri',
        'astrologia',
        'pars-mercaturae',
      ]),
      manuallyDeclared: true,
    }),
  }),
  Object.freeze({
    id: 'vronsky-simple-row-formulas',
    category: 'vronskySimpleRows',
    expected: Object.freeze({
      formulas: Object.freeze({
        'pars-amoris': 'ASC + Venus - Sun',
        'pars-artis': 'ASC + Mercury - Venus',
        'pars-creationis': 'ASC + Moon - Uranus',
        'pars-fratrum-et-sororum': 'ASC + Jupiter - Saturn',
        'pars-hereditatis': 'ASC + Moon - Saturn',
        'pars-itineris': 'ASC + Mercury - Moon',
        'pars-liberorum': 'ASC + Saturn - Jupiter',
        'pars-matris': 'ASC + Moon - Venus',
        'pars-patris': 'ASC + Sun - Saturn',
        'pars-pueri': 'ASC + Jupiter - Moon',
        astrologia: 'ASC + Mercury - Uranus',
        'pars-mercaturae': 'ASC + Mercury - Sun',
      }),
      manuallyDeclared: true,
    }),
  }),
  Object.freeze({
    id: 'day-only-policy',
    category: 'dayOnlyPolicy',
    expected: Object.freeze({
      chartSectPolicy: 'dayOnly',
      nightFormulaStatus: 'missing/notVerified',
      requiredChartSect: 'day',
      manuallyDeclared: true,
    }),
  }),
  Object.freeze({
    id: 'pending-engine-policy',
    category: 'pendingEngine',
    expected: Object.freeze({
      active: false,
      engineStatus: 'pendingEngineExpansion',
      activationStatus: 'inactiveUntilEngineTask',
      implementationStatus: 'selectedForTask15_4',
      manuallyDeclared: true,
    }),
  }),
  Object.freeze({
    id: 'deferred-original-candidates',
    category: 'deferredRows',
    expected: Object.freeze({
      keys: Object.freeze([
        'lot-of-eros',
        'lot-of-necessity',
        'lot-of-basis',
        'lot-of-exaltation',
      ]),
      active: false,
      verificationStatus: 'deferred',
      manuallyDeclared: true,
    }),
  }),
  Object.freeze({
    id: 'needs-review-rows',
    category: 'needsReviewRows',
    expected: Object.freeze({
      labels: Object.freeze([
        'Pars scientiae',
        'Pars sensis',
        'Здоровье (progress)',
        'Покушение',
        'Понимание',
        'Pars familiae',
        'Pars filiac',
        'Любовь и брак',
        'Несогласие и споры',
      ]),
      active: false,
      manuallyDeclared: true,
    }),
  }),
  Object.freeze({
    id: 'privacy-safe-dataset',
    category: 'privacy',
    expected: Object.freeze({
      rawBirthDataExposed: false,
      rawTimeDataExposed: false,
      rawUtcDataExposed: false,
      rawZoneDataExposed: false,
      rawPlaceDataExposed: false,
      providerDataExposed: false,
      calculatedValuesExposed: false,
      manuallyDeclared: true,
    }),
  }),
  Object.freeze({
    id: 'strict-exclusions',
    category: 'strictExclusions',
    expected: Object.freeze({
      calculationEngineChange: false,
      uiChange: false,
      debugChange: false,
      interpretations: false,
      packageChange: false,
      swChange: false,
      manuallyDeclared: true,
    }),
  }),
]);

export function getVronskyArabicPartsDataFixture(id) {
  return VRONSKY_ARABIC_PARTS_DATA_FIXTURES.find((fixture) => fixture.id === id) ?? null;
}

export function getVronskyArabicPartsDataFixtureIds() {
  return VRONSKY_ARABIC_PARTS_DATA_FIXTURES.map((fixture) => fixture.id);
}

export function getVronskyArabicPartsDataFixtureCategories() {
  return [...new Set(VRONSKY_ARABIC_PARTS_DATA_FIXTURES.map((fixture) => fixture.category))];
}
