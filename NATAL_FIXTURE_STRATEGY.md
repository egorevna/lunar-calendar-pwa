# NATAL_FIXTURE_STRATEGY.md

## Purpose

This document defines the fixture strategy for future natal provider validation.

Fixtures are required because a provider can look plausible while still using the wrong coordinate system, timezone conversion, ephemeris range, house method, or Moon calculation. No user-facing natal values may be shown until the provider passes documented fixtures.

Main rule:

```txt
No fixture validation = no user-facing natal claims.
```

## Privacy Rule

Fixtures must not use private real birth data.

Do not use:

- real app profiles;
- localStorage profile data;
- private user names;
- exported profile JSON;
- exact birth data from users;
- profile objects copied from the app.

Allowed fixture types:

- public examples with documented sources;
- synthetic examples;
- manually approved reference examples;
- provider-neutral edge cases with pending expected values.

## Fixture Sources

Acceptable future sources:

- public example charts from reputable astrology or astronomy references;
- public astronomy reference calculations;
- synthetic charts created only for edge-case coverage;
- developer-side reference values generated after explicit approval;
- manually approved expected values with documented source and tolerance.

Current Task 6.2 fixtures are synthetic and pending. They do not claim provider validation and do not contain real expected longitudes.

## Fixture Shape

Provider fixtures should use this shape:

```js
{
  id: 'synthetic-moscow-2000',
  label: 'Synthetic Moscow example',
  type: 'synthetic',
  categories: ['modern'],
  birth: {
    date: '2000-01-01',
    time: '12:00',
    timezone: 'Europe/Moscow',
    latitude: 55.7558,
    longitude: 37.6173,
    birthTimeAccuracy: 'exact'
  },
  expectedStatus: 'pending-provider-approval',
  expected: {
    planets: {
      sun: {
        longitude: null,
        sign: null,
        degree: null
      }
    },
    houses: null,
    ascMc: null,
    retrograde: null,
    speed: null
  },
  tolerance: {
    longitudeDegrees: 0.5,
    moonLongitudeDegrees: 1.0,
    houseDegrees: 1.0,
    ascMcDegrees: 1.0,
    retrogradeExact: true
  },
  source: 'synthetic — expected values to be filled after provider approval',
  validatedProvider: null,
  validatedAt: null,
  notes: []
}
```

Required fields:

- `id`;
- `label`;
- `type`;
- `categories`;
- `birth`;
- `expectedStatus`;
- `expected`;
- `tolerance`;
- `source`;
- `validatedProvider`;
- `validatedAt`;
- `notes`.

## Fixture Requirements Before Real Provider Can Be Trusted

Before any provider-backed natal values appear, fixtures must include:

- at least one modern date;
- at least one historical date;
- at least one Moon-sensitive fixture;
- at least one timezone-sensitive fixture;
- one fixture with unknown birth time for house / ASC / MC restrictions;
- one fixture with missing coordinates for house / ASC / MC restrictions.

The current required categories are:

- `modern`;
- `historical`;
- `moonSensitive`;
- `timezoneSensitive`;
- `unknownBirthTime`;
- `missingCoordinates`.

## Tolerance Policy

Initial tolerance policy:

- Sun, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune and Pluto longitude: `0.25°` for the selected UTC Swiss Ephemeris reference validation; future broader public fixtures may tighten toward `0.1°`.
- Moon longitude: `0.5°` for the selected UTC Swiss Ephemeris reference validation; future Moon-sensitive fixtures may tighten after broader UTC/time-scale validation.
- ASC / MC: later only, start with `1.0°` and tighten after house engine approval.
- House cusps: later only, start with `1.0°`; Placidus and high-latitude cases need separate checks.
- Retrograde: exact boolean match if provider supports retrograde.
- Speed: compare only after provider exposes speed and fixture source includes expected speed.

If fixture output fails tolerance, provider capabilities must remain disabled or `notSupported`.

## Validation Policy

Provider validation must be explicit:

- run provider output against every required fixture;
- compare only fields that have approved expected values;
- keep pending expected values out of pass/fail scoring;
- record provider name and version;
- record source of expected values;
- fail closed: unsupported features remain `notSupported`.

No fixture means no user-facing natal claim.

Failing fixtures mean:

- provider remains disabled;
- capabilities stay false;
- natal UI must not show those values;
- debug may show safe failure counts, not private birth data.

## Current Fixture Data

Task 6.2 adds:

```txt
test/fixtures/natalProviderFixtures.js
```

The fixtures are synthetic and have:

- no private names;
- no full profile JSON;
- no localStorage data;
- no real expected longitudes;
- `expectedStatus: "pending-provider-approval"`;
- `validatedProvider: null`;
- `validatedAt: null`.

## Task 6.5b Reference Validation

Task 6.5b adds selected UTC reference validation for `astronomy-engine@2.1.19`.

Reference source:

- local `swisseph` dev dependency;
- `swe_calc_ut(jd, body, SEFLG_SWIEPH, callback)`;
- flags: `SEFLG_SWIEPH`, no sidereal, no topocentric, no true-position, no J2000;
- used only in Node tests;
- not imported into production `src/`.

Astronomy Engine paths used:

- Sun: `SunPosition(date).elon`;
- Moon: `EclipticGeoMoon(date).lon`;
- Mercury / Venus / Mars / Jupiter / Saturn / Uranus / Neptune / Pluto: `GeoVector(body, date, true)` -> `Ecliptic(vector).elon`.

Reference fixture module:

```txt
test/fixtures/natalProviderReferenceFixtures.js
```

Validation test:

```txt
test/natalProviderReferenceValidation.test.js
```

UTC fixtures:

- `2000-01-01T12:00:00.000Z` — modern reference fixture;
- `1900-06-15T00:00:00.000Z` — historical reference fixture;
- `2026-05-15T10:33:00.000Z` — Moon-sensitive reference fixture;
- `1985-11-03T06:30:00.000Z` — timezone-sensitive documented UTC fixture, without local timezone conversion.

Max observed deltas:

- Sun and planets: `0.003180°`;
- Moon: `0.000294°`.

Validated features:

- geocentric tropical ecliptic longitudes for Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune and Pluto.

Tolerances:

- Sun and planets: `0.25°`;
- Moon: `0.5°`.

Still pending / not supported:

- local birth timezone conversion;
- houses;
- ASC / MC;
- transits;
- retrograde / speed;
- user-facing natal chart UI.

Passing Task 6.5b fixtures means selected UTC planet longitudes are validated. It does not approve user-facing natal values, houses, ASC / MC, transits, retrograde, speed, or any local birth-time-to-UTC conversion.

## Decision Log

- Task 6.2 does not connect a real provider.
- Task 6.2 does not add dependencies.
- Task 6.2 does not calculate planets, houses, ASC / MC, transits, aspects or orbs.
- Synthetic fixtures are structure and privacy guardrails only.
- Expected planetary values remain pending until provider approval and reference-source selection.
- Task 6.3 may use this fixture shape when creating the provider adapter contract.
