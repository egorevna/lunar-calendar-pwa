const PLANET_LABELS = Object.freeze({
  sun: 'Солнце',
  moon: 'Луна',
  mercury: 'Меркурий',
  venus: 'Венера',
  mars: 'Марс',
  jupiter: 'Юпитер',
  saturn: 'Сатурн',
  uranus: 'Уран',
  neptune: 'Нептун',
  pluto: 'Плутон',
});

const SIGN_DATA = Object.freeze({
  aries: { ru: 'Овен', symbol: '♈', longitude: 15 },
  taurus: { ru: 'Телец', symbol: '♉', longitude: 45 },
  gemini: { ru: 'Близнецы', symbol: '♊', longitude: 75 },
  cancer: { ru: 'Рак', symbol: '♋', longitude: 105 },
  leo: { ru: 'Лев', symbol: '♌', longitude: 135 },
  virgo: { ru: 'Дева', symbol: '♍', longitude: 165 },
  libra: { ru: 'Весы', symbol: '♎', longitude: 195 },
  scorpio: { ru: 'Скорпион', symbol: '♏', longitude: 225 },
  sagittarius: { ru: 'Стрелец', symbol: '♐', longitude: 255 },
  capricorn: { ru: 'Козерог', symbol: '♑', longitude: 285 },
  aquarius: { ru: 'Водолей', symbol: '♒', longitude: 315 },
  pisces: { ru: 'Рыбы', symbol: '♓', longitude: 345 },
});

const EMPTY_DIGNITIES = Object.freeze({
  domicile: false,
  detriment: false,
  exaltation: false,
  fall: false,
  modernRulership: false,
});

function fixturePlanet(key, signKey, overrides = {}) {
  const sign = SIGN_DATA[signKey];

  return {
    key,
    label: PLANET_LABELS[key],
    sign: sign ? { key: signKey, ru: sign.ru, symbol: sign.symbol } : null,
    longitude: sign?.longitude,
    source: 'synthetic-fixture',
    ...overrides,
  };
}

function expectedResult(planetKey, signKey, overrides = {}) {
  return {
    planetKey,
    signKey,
    dignities: {
      ...EMPTY_DIGNITIES,
      ...overrides.dignities,
    },
    score: overrides.score ?? 0,
    labels: overrides.labels ?? [],
    modernLabels: overrides.modernLabels ?? [],
  };
}

export const ESSENTIAL_DIGNITY_FIXTURES = Object.freeze([
  {
    id: 'domicile-classical-baseline',
    label: 'Classical domicile rulerships',
    category: 'domicile',
    description: 'Synthetic placements covering every classical domicile / rulership sign.',
    planets: Object.freeze([
      fixturePlanet('sun', 'leo'),
      fixturePlanet('moon', 'cancer'),
      fixturePlanet('mercury', 'gemini'),
      fixturePlanet('mercury', 'virgo'),
      fixturePlanet('venus', 'taurus'),
      fixturePlanet('venus', 'libra'),
      fixturePlanet('mars', 'aries'),
      fixturePlanet('mars', 'scorpio'),
      fixturePlanet('jupiter', 'sagittarius'),
      fixturePlanet('jupiter', 'pisces'),
      fixturePlanet('saturn', 'capricorn'),
      fixturePlanet('saturn', 'aquarius'),
    ]),
    expected: Object.freeze({
      resultCount: 12,
      results: Object.freeze([
        expectedResult('sun', 'leo', { dignities: { domicile: true }, score: 5, labels: ['обитель'] }),
        expectedResult('moon', 'cancer', { dignities: { domicile: true }, score: 5, labels: ['обитель'] }),
        expectedResult('mercury', 'gemini', { dignities: { domicile: true }, score: 5, labels: ['обитель'] }),
        expectedResult('mercury', 'virgo', {
          dignities: { domicile: true, exaltation: true },
          score: 9,
          labels: ['обитель', 'экзальтация'],
        }),
        expectedResult('venus', 'taurus', { dignities: { domicile: true }, score: 5, labels: ['обитель'] }),
        expectedResult('venus', 'libra', { dignities: { domicile: true }, score: 5, labels: ['обитель'] }),
        expectedResult('mars', 'aries', { dignities: { domicile: true }, score: 5, labels: ['обитель'] }),
        expectedResult('mars', 'scorpio', { dignities: { domicile: true }, score: 5, labels: ['обитель'] }),
        expectedResult('jupiter', 'sagittarius', { dignities: { domicile: true }, score: 5, labels: ['обитель'] }),
        expectedResult('jupiter', 'pisces', { dignities: { domicile: true }, score: 5, labels: ['обитель'] }),
        expectedResult('saturn', 'capricorn', { dignities: { domicile: true }, score: 5, labels: ['обитель'] }),
        expectedResult('saturn', 'aquarius', { dignities: { domicile: true }, score: 5, labels: ['обитель'] }),
      ]),
    }),
    notes: Object.freeze(['Mercury in Virgo is both domicile and exaltation by the selected Sprint 9 policy.']),
  },
  {
    id: 'detriment-classical-baseline',
    label: 'Classical detriment signs',
    category: 'detriment',
    description: 'Synthetic placements covering every classical detriment / exile sign.',
    planets: Object.freeze([
      fixturePlanet('sun', 'aquarius'),
      fixturePlanet('moon', 'capricorn'),
      fixturePlanet('mercury', 'sagittarius'),
      fixturePlanet('mercury', 'pisces'),
      fixturePlanet('venus', 'scorpio'),
      fixturePlanet('venus', 'aries'),
      fixturePlanet('mars', 'libra'),
      fixturePlanet('mars', 'taurus'),
      fixturePlanet('jupiter', 'gemini'),
      fixturePlanet('jupiter', 'virgo'),
      fixturePlanet('saturn', 'cancer'),
      fixturePlanet('saturn', 'leo'),
    ]),
    expected: Object.freeze({
      resultCount: 12,
      results: Object.freeze([
        expectedResult('sun', 'aquarius', { dignities: { detriment: true }, score: -5, labels: ['изгнание'] }),
        expectedResult('moon', 'capricorn', { dignities: { detriment: true }, score: -5, labels: ['изгнание'] }),
        expectedResult('mercury', 'sagittarius', { dignities: { detriment: true }, score: -5, labels: ['изгнание'] }),
        expectedResult('mercury', 'pisces', {
          dignities: { detriment: true, fall: true },
          score: -9,
          labels: ['изгнание', 'падение'],
        }),
        expectedResult('venus', 'scorpio', { dignities: { detriment: true }, score: -5, labels: ['изгнание'] }),
        expectedResult('venus', 'aries', { dignities: { detriment: true }, score: -5, labels: ['изгнание'] }),
        expectedResult('mars', 'libra', { dignities: { detriment: true }, score: -5, labels: ['изгнание'] }),
        expectedResult('mars', 'taurus', { dignities: { detriment: true }, score: -5, labels: ['изгнание'] }),
        expectedResult('jupiter', 'gemini', { dignities: { detriment: true }, score: -5, labels: ['изгнание'] }),
        expectedResult('jupiter', 'virgo', { dignities: { detriment: true }, score: -5, labels: ['изгнание'] }),
        expectedResult('saturn', 'cancer', { dignities: { detriment: true }, score: -5, labels: ['изгнание'] }),
        expectedResult('saturn', 'leo', { dignities: { detriment: true }, score: -5, labels: ['изгнание'] }),
      ]),
    }),
    notes: Object.freeze(['Mercury in Pisces is both detriment and fall by the selected Sprint 9 policy.']),
  },
  {
    id: 'exaltation-classical-baseline',
    label: 'Classical exaltation signs',
    category: 'exaltation',
    description: 'Synthetic placements covering every classical exaltation sign.',
    planets: Object.freeze([
      fixturePlanet('sun', 'aries'),
      fixturePlanet('moon', 'taurus'),
      fixturePlanet('mercury', 'virgo'),
      fixturePlanet('venus', 'pisces'),
      fixturePlanet('mars', 'capricorn'),
      fixturePlanet('jupiter', 'cancer'),
      fixturePlanet('saturn', 'libra'),
    ]),
    expected: Object.freeze({
      resultCount: 7,
      results: Object.freeze([
        expectedResult('sun', 'aries', { dignities: { exaltation: true }, score: 4, labels: ['экзальтация'] }),
        expectedResult('moon', 'taurus', { dignities: { exaltation: true }, score: 4, labels: ['экзальтация'] }),
        expectedResult('mercury', 'virgo', {
          dignities: { domicile: true, exaltation: true },
          score: 9,
          labels: ['обитель', 'экзальтация'],
        }),
        expectedResult('venus', 'pisces', { dignities: { exaltation: true }, score: 4, labels: ['экзальтация'] }),
        expectedResult('mars', 'capricorn', { dignities: { exaltation: true }, score: 4, labels: ['экзальтация'] }),
        expectedResult('jupiter', 'cancer', { dignities: { exaltation: true }, score: 4, labels: ['экзальтация'] }),
        expectedResult('saturn', 'libra', { dignities: { exaltation: true }, score: 4, labels: ['экзальтация'] }),
      ]),
    }),
    notes: Object.freeze(['Exaltation degree scoring is intentionally absent.']),
  },
  {
    id: 'fall-classical-baseline',
    label: 'Classical fall signs',
    category: 'fall',
    description: 'Synthetic placements covering every classical fall sign.',
    planets: Object.freeze([
      fixturePlanet('sun', 'libra'),
      fixturePlanet('moon', 'scorpio'),
      fixturePlanet('mercury', 'pisces'),
      fixturePlanet('venus', 'virgo'),
      fixturePlanet('mars', 'cancer'),
      fixturePlanet('jupiter', 'capricorn'),
      fixturePlanet('saturn', 'aries'),
    ]),
    expected: Object.freeze({
      resultCount: 7,
      results: Object.freeze([
        expectedResult('sun', 'libra', { dignities: { fall: true }, score: -4, labels: ['падение'] }),
        expectedResult('moon', 'scorpio', { dignities: { fall: true }, score: -4, labels: ['падение'] }),
        expectedResult('mercury', 'pisces', {
          dignities: { detriment: true, fall: true },
          score: -9,
          labels: ['изгнание', 'падение'],
        }),
        expectedResult('venus', 'virgo', { dignities: { fall: true }, score: -4, labels: ['падение'] }),
        expectedResult('mars', 'cancer', { dignities: { fall: true }, score: -4, labels: ['падение'] }),
        expectedResult('jupiter', 'capricorn', { dignities: { fall: true }, score: -4, labels: ['падение'] }),
        expectedResult('saturn', 'aries', { dignities: { fall: true }, score: -4, labels: ['падение'] }),
      ]),
    }),
    notes: Object.freeze([]),
  },
  {
    id: 'multiple-flags-mercury-overlap',
    label: 'Mercury overlapping flags',
    category: 'multipleFlags',
    description: 'Synthetic Mercury placements where classical flags overlap and score is additive.',
    planets: Object.freeze([
      fixturePlanet('mercury', 'virgo'),
      fixturePlanet('mercury', 'pisces'),
    ]),
    expected: Object.freeze({
      resultCount: 2,
      results: Object.freeze([
        expectedResult('mercury', 'virgo', {
          dignities: { domicile: true, exaltation: true },
          score: 9,
          labels: ['обитель', 'экзальтация'],
        }),
        expectedResult('mercury', 'pisces', {
          dignities: { detriment: true, fall: true },
          score: -9,
          labels: ['изгнание', 'падение'],
        }),
      ]),
    }),
    notes: Object.freeze(['Scores are additive only for selected classical flags.']),
  },
  {
    id: 'modern-rulership-label-only',
    label: 'Modern outer rulership labels',
    category: 'modernRulership',
    description: 'Synthetic outer-planet placements with modern rulership labels and no classical score.',
    planets: Object.freeze([
      fixturePlanet('uranus', 'aquarius'),
      fixturePlanet('neptune', 'pisces'),
      fixturePlanet('pluto', 'scorpio'),
    ]),
    expected: Object.freeze({
      resultCount: 3,
      results: Object.freeze([
        expectedResult('uranus', 'aquarius', {
          dignities: { modernRulership: true },
          modernLabels: ['современное управление'],
        }),
        expectedResult('neptune', 'pisces', {
          dignities: { modernRulership: true },
          modernLabels: ['современное управление'],
        }),
        expectedResult('pluto', 'scorpio', {
          dignities: { modernRulership: true },
          modernLabels: ['современное управление'],
        }),
      ]),
    }),
    notes: Object.freeze(['Modern rulership labels do not change the classical score.']),
  },
  {
    id: 'neutral-classical-placements',
    label: 'Neutral placements',
    category: 'neutral',
    description: 'Synthetic placements with no selected dignity or debility flags.',
    planets: Object.freeze([
      fixturePlanet('mars', 'gemini'),
      fixturePlanet('venus', 'gemini'),
      fixturePlanet('saturn', 'sagittarius'),
    ]),
    expected: Object.freeze({
      resultCount: 3,
      results: Object.freeze([
        expectedResult('mars', 'gemini'),
        expectedResult('venus', 'gemini'),
        expectedResult('saturn', 'sagittarius'),
      ]),
    }),
    notes: Object.freeze([]),
  },
  {
    id: 'invalid-planets-ignored',
    label: 'Invalid planets are ignored',
    category: 'invalidPlanets',
    description: 'Synthetic invalid planet-like objects should not produce dignity results.',
    planets: Object.freeze([
      fixturePlanet(undefined, 'aries', { label: 'Missing key' }),
      fixturePlanet('chiron', 'aries', { label: 'Chiron' }),
      fixturePlanet('sun', undefined, { sign: null, longitude: undefined }),
      fixturePlanet('moon', undefined, { sign: null, longitude: Number.NaN }),
    ]),
    expected: Object.freeze({
      resultCount: 0,
      results: Object.freeze([]),
    }),
    notes: Object.freeze([]),
  },
  {
    id: 'summary-mixed-results',
    label: 'Mixed summary counts',
    category: 'summary',
    description: 'Synthetic mixed placements for summary totals and score total.',
    planets: Object.freeze([
      fixturePlanet('mars', 'aries'),
      fixturePlanet('venus', 'pisces'),
      fixturePlanet('sun', 'aquarius'),
      fixturePlanet('saturn', 'aries'),
      fixturePlanet('uranus', 'aquarius'),
      fixturePlanet('jupiter', 'aquarius'),
    ]),
    expected: Object.freeze({
      resultCount: 6,
      results: Object.freeze([
        expectedResult('mars', 'aries', { dignities: { domicile: true }, score: 5, labels: ['обитель'] }),
        expectedResult('venus', 'pisces', { dignities: { exaltation: true }, score: 4, labels: ['экзальтация'] }),
        expectedResult('sun', 'aquarius', { dignities: { detriment: true }, score: -5, labels: ['изгнание'] }),
        expectedResult('saturn', 'aries', { dignities: { fall: true }, score: -4, labels: ['падение'] }),
        expectedResult('uranus', 'aquarius', {
          dignities: { modernRulership: true },
          modernLabels: ['современное управление'],
        }),
        expectedResult('jupiter', 'aquarius'),
      ]),
      summary: Object.freeze({
        total: 6,
        dignified: 2,
        debilitated: 2,
        neutral: 1,
        modernLabels: 1,
        scoreTotal: 0,
      }),
    }),
    notes: Object.freeze(['Modern rulership remains separate from dignified / debilitated counts.']),
  },
  {
    id: 'strict-exclusions-basic-fixture',
    label: 'Strict exclusions fixture',
    category: 'strictExclusions',
    description: 'Synthetic fixture that keeps only basic sign-based dignity data.',
    planets: Object.freeze([
      fixturePlanet('jupiter', 'aquarius'),
    ]),
    expected: Object.freeze({
      resultCount: 1,
      results: Object.freeze([
        expectedResult('jupiter', 'aquarius'),
      ]),
    }),
    notes: Object.freeze(['No future source-pack rows are encoded in this fixture set.']),
  },
]);

export function getEssentialDignityFixture(id) {
  return ESSENTIAL_DIGNITY_FIXTURES.find((fixture) => fixture.id === id) ?? null;
}

export function getEssentialDignityFixtureIds() {
  return ESSENTIAL_DIGNITY_FIXTURES.map((fixture) => fixture.id);
}

export function getEssentialDignityFixtureCategories() {
  return [...new Set(ESSENTIAL_DIGNITY_FIXTURES.map((fixture) => fixture.category))];
}
