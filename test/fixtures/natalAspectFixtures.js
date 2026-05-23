export const REQUIRED_NATAL_ASPECT_FIXTURE_CATEGORIES = Object.freeze([
  'exactMajorAspects',
  'nearInsideOrb',
  'justOutsideOrb',
  'wrapAround',
  'duplicatePrevention',
  'outerOuterNarrowOrb',
  'luminaryWideOrb',
  'invalidPlanets',
  'noAspects',
  'sortingPriority',
]);

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
  chiron: 'Хирон',
});

export const NATAL_ASPECT_FIXTURES = Object.freeze([
  createFixture({
    id: 'synthetic-exact-conjunction',
    label: 'Synthetic exact conjunction',
    category: 'exactMajorAspects',
    description: 'Sun and Moon at the same longitude create an exact conjunction.',
    planets: [
      planet('sun', 0),
      planet('moon', 0),
    ],
    expected: {
      aspectCount: 1,
      aspects: [
        expectedAspect('sun', 'moon', 'conjunction', 0, 'exact'),
      ],
    },
  }),
  createFixture({
    id: 'synthetic-exact-sextile',
    label: 'Synthetic exact sextile',
    category: 'exactMajorAspects',
    description: 'Sun and Mercury separated by 60 degrees create an exact sextile.',
    planets: [
      planet('sun', 0),
      planet('mercury', 60),
    ],
    expected: {
      aspectCount: 1,
      aspects: [
        expectedAspect('sun', 'mercury', 'sextile', 0, 'exact'),
      ],
    },
  }),
  createFixture({
    id: 'synthetic-exact-square',
    label: 'Synthetic exact square',
    category: 'exactMajorAspects',
    description: 'Sun and Venus separated by 90 degrees create an exact square.',
    planets: [
      planet('sun', 0),
      planet('venus', 90),
    ],
    expected: {
      aspectCount: 1,
      aspects: [
        expectedAspect('sun', 'venus', 'square', 0, 'exact'),
      ],
    },
  }),
  createFixture({
    id: 'synthetic-exact-trine',
    label: 'Synthetic exact trine',
    category: 'exactMajorAspects',
    description: 'Sun and Mars separated by 120 degrees create an exact trine.',
    planets: [
      planet('sun', 0),
      planet('mars', 120),
    ],
    expected: {
      aspectCount: 1,
      aspects: [
        expectedAspect('sun', 'mars', 'trine', 0, 'exact'),
      ],
    },
  }),
  createFixture({
    id: 'synthetic-exact-opposition',
    label: 'Synthetic exact opposition',
    category: 'exactMajorAspects',
    description: 'Sun and Jupiter separated by 180 degrees create an exact opposition.',
    planets: [
      planet('sun', 0),
      planet('jupiter', 180),
    ],
    expected: {
      aspectCount: 1,
      aspects: [
        expectedAspect('sun', 'jupiter', 'opposition', 0, 'exact'),
      ],
    },
  }),
  createFixture({
    id: 'synthetic-near-conjunction-inside-orb',
    label: 'Synthetic near conjunction inside orb',
    category: 'nearInsideOrb',
    description: 'Sun and Moon are 6.9 degrees apart, inside the 8 degree luminary conjunction orb.',
    planets: [
      planet('sun', 0),
      planet('moon', 6.9),
    ],
    expected: {
      aspectCount: 1,
      aspects: [
        expectedAspect('sun', 'moon', 'conjunction', 6.9, 'weak'),
      ],
    },
  }),
  createFixture({
    id: 'synthetic-sextile-edge-inside-orb',
    label: 'Synthetic sextile on allowed orb edge',
    category: 'nearInsideOrb',
    description: 'Mercury and Venus are 65 degrees apart, exactly at the 5 degree sextile orb limit.',
    planets: [
      planet('mercury', 0),
      planet('venus', 65),
    ],
    expected: {
      aspectCount: 1,
      aspects: [
        expectedAspect('mercury', 'venus', 'sextile', 5, 'medium'),
      ],
    },
  }),
  createFixture({
    id: 'synthetic-sextile-just-outside-orb',
    label: 'Synthetic sextile just outside orb',
    category: 'justOutsideOrb',
    description: 'Mercury and Venus are 65.1 degrees apart, just outside the 5 degree sextile orb.',
    planets: [
      planet('mercury', 0),
      planet('venus', 65.1),
    ],
    expected: {
      aspectCount: 0,
      aspects: [],
    },
  }),
  createFixture({
    id: 'synthetic-wrap-around-conjunction',
    label: 'Synthetic wrap-around conjunction',
    category: 'wrapAround',
    description: 'Sun at 359 degrees and Moon at 1 degree should use a 2 degree shortest distance.',
    planets: [
      planet('sun', 359),
      planet('moon', 1),
    ],
    expected: {
      aspectCount: 1,
      aspects: [
        expectedAspect('sun', 'moon', 'conjunction', 2, 'strong'),
      ],
    },
  }),
  createFixture({
    id: 'synthetic-wrap-around-no-false-conjunction',
    label: 'Synthetic wrap-around non-aspect',
    category: 'wrapAround',
    description: 'Sun at 350 degrees and Moon at 10 degrees are 20 degrees apart, not a conjunction.',
    planets: [
      planet('sun', 350),
      planet('moon', 10),
    ],
    expected: {
      aspectCount: 0,
      aspects: [],
    },
  }),
  createFixture({
    id: 'synthetic-duplicate-prevention',
    label: 'Synthetic duplicate prevention',
    category: 'duplicatePrevention',
    description: 'Reversed input order and duplicate Sun should still create only one Sun-Moon aspect.',
    planets: [
      planet('moon', 0),
      planet('sun', 0),
      planet('sun', 0, { label: 'Duplicate synthetic Sun' }),
    ],
    expected: {
      aspectCount: 1,
      aspects: [
        expectedAspect('sun', 'moon', 'conjunction', 0, 'exact'),
      ],
    },
  }),
  createFixture({
    id: 'synthetic-outer-outer-inside-orb',
    label: 'Synthetic outer-outer aspect inside narrow orb',
    category: 'outerOuterNarrowOrb',
    description: 'Uranus and Neptune 2.5 degrees apart are inside the 3 degree outer-only conjunction cap.',
    planets: [
      planet('uranus', 0),
      planet('neptune', 2.5),
    ],
    expected: {
      aspectCount: 1,
      aspects: [
        expectedAspect('uranus', 'neptune', 'conjunction', 2.5, 'strong'),
      ],
    },
  }),
  createFixture({
    id: 'synthetic-outer-outer-outside-orb',
    label: 'Synthetic outer-outer aspect outside narrow orb',
    category: 'outerOuterNarrowOrb',
    description: 'Uranus and Neptune 4 degrees apart are outside the 3 degree outer-only conjunction cap.',
    planets: [
      planet('uranus', 0),
      planet('neptune', 4),
    ],
    expected: {
      aspectCount: 0,
      aspects: [],
    },
  }),
  createFixture({
    id: 'synthetic-luminary-wide-orb',
    label: 'Synthetic luminary wide orb',
    category: 'luminaryWideOrb',
    description: 'Sun and Saturn 7.5 degrees apart are accepted because luminary conjunction cap is 8 degrees.',
    planets: [
      planet('sun', 0),
      planet('saturn', 7.5),
    ],
    expected: {
      aspectCount: 1,
      aspects: [
        expectedAspect('sun', 'saturn', 'conjunction', 7.5, 'weak'),
      ],
    },
  }),
  createFixture({
    id: 'synthetic-invalid-planets-ignored',
    label: 'Synthetic invalid planets ignored',
    category: 'invalidPlanets',
    description: 'Invalid body records should be ignored without changing the valid Sun-Moon conjunction.',
    planets: [
      planet('sun', 0),
      planet('moon', 0),
      { label: 'Invalid synthetic no key', longitude: 60, source: 'synthetic-fixture' },
      { key: 'venus', label: 'Invalid synthetic longitude', longitude: Number.NaN, source: 'synthetic-fixture' },
      planet('chiron', 90),
    ],
    expected: {
      aspectCount: 1,
      aspects: [
        expectedAspect('sun', 'moon', 'conjunction', 0, 'exact'),
      ],
    },
  }),
  createFixture({
    id: 'synthetic-no-aspects',
    label: 'Synthetic no aspects',
    category: 'noAspects',
    description: 'Sun and Moon 30 degrees apart create a deferred minor semisextile, not a Sprint 8 major aspect.',
    planets: [
      planet('sun', 0),
      planet('moon', 30),
    ],
    expected: {
      aspectCount: 0,
      aspects: [],
    },
  }),
  createFixture({
    id: 'synthetic-sorting-priority',
    label: 'Synthetic sorting priority',
    category: 'sortingPriority',
    description: 'Expected order is smallest orb first, then luminary hard aspect before non-luminary soft aspect.',
    planets: [
      planet('mercury', 0),
      planet('venus', 60),
      planet('sun', 200),
      planet('moon', 291),
      planet('mars', 10),
      planet('jupiter', 69),
    ],
    expected: {
      aspectCount: 3,
      aspects: [
        expectedAspect('mercury', 'venus', 'sextile', 0, 'exact'),
        expectedAspect('sun', 'moon', 'square', 1, 'exact'),
        expectedAspect('mars', 'jupiter', 'sextile', 1, 'exact'),
      ],
    },
  }),
]);

export function getNatalAspectFixture(id) {
  return NATAL_ASPECT_FIXTURES.find((fixture) => fixture.id === id) ?? null;
}

export function getNatalAspectFixtureIds() {
  return NATAL_ASPECT_FIXTURES.map((fixture) => fixture.id);
}

export function getNatalAspectFixtureCategories() {
  return [...new Set(NATAL_ASPECT_FIXTURES.map((fixture) => fixture.category))];
}

function createFixture({
  id,
  label,
  category,
  description,
  planets,
  expected,
  notes = [],
}) {
  return Object.freeze({
    id,
    label,
    category,
    description,
    planets: Object.freeze(planets.map((item) => Object.freeze({ ...item }))),
    expected: Object.freeze({
      aspectCount: expected.aspectCount,
      aspects: Object.freeze(expected.aspects.map((aspect) => Object.freeze({ ...aspect }))),
    }),
    notes: Object.freeze([...notes]),
  });
}

function planet(key, longitude, overrides = {}) {
  return {
    key,
    label: overrides.label ?? PLANET_LABELS[key] ?? key,
    longitude,
    source: 'synthetic-fixture',
  };
}

function expectedAspect(bodyA, bodyB, aspect, orb, strength) {
  return {
    bodyA,
    bodyB,
    aspect,
    orb,
    strength,
  };
}
