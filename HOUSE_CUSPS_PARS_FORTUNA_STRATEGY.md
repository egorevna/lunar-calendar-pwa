# HOUSE_CUSPS_PARS_FORTUNA_STRATEGY.md

## Purpose

This document defines the calculation policy for Sprint 12:

- house cusps;
- day / night status;
- Pars Fortuna;
- basic Arabic Parts.

It does not implement code.

## Layer Separation

Keep these layers separate:

1. Input readiness.
2. Selected house system result.
3. Canonical house cusp output.
4. Day / night chart status.
5. Formula dataset / formula policy.
6. Pars Fortuna calculation.
7. Arabic Parts calculation.
8. House assignment for lots/parts.
9. Display helper.
10. UI.
11. Debug.

Do not mix these layers.

## Reuse Sprint 11

Sprint 12 must reuse:

- `housesInputGuardrails`;
- `ascMc`;
- `wholeSignHouses`;
- `equalHouseHouses`;
- `placidusHouses`;
- `houseSystemResolver`;
- `planetInHouses`;
- `housesDisplay`;
- `housesForProfile`;
- `housesDebug`.

Do not reimplement Placidus, Equal House, Whole Sign, or ASC/MC.

## House Cusp Canonicalization

Create a canonical house cusp layer that can consume the selected house system result and expose a consistent shape.

Suggested module:

```txt
src/houseCusps.js
```

Suggested output:

```js
{
  status: "ready",
  ready: true,
  houseSystem: "placidus",
  houseSystemLabel: "Placidus",
  cusps: [
    {
      number: 1,
      longitude: 314.791633,
      sign: { key: "aquarius", ru: "Водолей", symbol: "♒" },
      degree: 14,
      minutes: 47,
      seconds: 29,
      text: "1 дом — Водолей 14°47′29″"
    }
  ],
  source: "selected-house-system-result"
}
```

## House Cusp Policies by System

### Whole Sign

Whole Sign is sign-based.

- Cusp-like output uses sign boundaries.
- House 1 sign = ASC sign.
- House 1 boundary = 0° of ASC sign.
- Exact ASC degree is an angle, not the 1st house cusp.
- Output must make this distinction clear.

Suggested metadata:

```js
{
  houseSystem: "whole-sign",
  cuspType: "sign-boundary",
  exactCuspDegrees: false
}
```

### Equal House

Equal House is ASC-degree based.

- Cusp 1 = exact ASC longitude.
- Cusp N = normalize(ASC longitude + (N - 1) * 30°).
- Output cusps are exact Equal House cusps.

Suggested metadata:

```js
{
  houseSystem: "equal-house",
  cuspType: "equal-30-degree",
  exactCuspDegrees: true
}
```

### Placidus

Placidus is validated against static Swiss Ephemeris benchmark fixtures.

- Cusp 1 = ASC.
- Cusp 10 = MC.
- Cusp 7 = DSC.
- Cusp 4 = IC.
- Output cusps are exact Placidus cusps.
- No fallback to Equal House or Whole Sign.

Suggested metadata:

```js
{
  houseSystem: "placidus",
  cuspType: "quadrant-placidus",
  exactCuspDegrees: true,
  benchmarkValidated: true
}
```

## Day / Night Chart Status

Day/night status must be explicit before calculating day/night-dependent formulas.

Required output:

```js
{
  status: "ready",
  chartSect: "day",
  dayChart: true,
  nightChart: false,
  method: "sun-above-horizon",
  confidence: "verified"
}
```

Fallback output:

```js
{
  status: "notReady",
  reason: "sunPositionUnavailable",
  chartSect: null
}
```

## Day / Night Method

Do not use local clock time alone.

Preferred Sprint 12 method:

- determine whether Sun is above the horizon using ready chart geometry / house placement;
- validate method with fixtures.

Practical first implementation may use Sun house assignment:

- houses 7 through 12 imply above horizon;
- houses 1 through 6 imply below horizon;

only if this policy is documented and tested.

If the selected house system makes the result ambiguous, fail closed.

## Pars Fortuna Formula

Pars Fortuna / Lot of Fortune:

```txt
Day chart:   ASC + Moon - Sun
Night chart: ASC + Sun - Moon
```

All inputs are ecliptic longitudes in tropical zodiac degrees.

Normalize result to:

```txt
0 <= longitude < 360
```

Required fields:

- `longitude`;
- `sign`;
- `degree`;
- `minutes`;
- `seconds`;
- `text`;
- `formulaVariant`;
- `requiredInputs`;
- `verificationStatus`.

No interpretation text.

## Lot of Spirit Formula

Lot of Spirit is commonly the inverse of Pars Fortuna:

```txt
Day chart:   ASC + Sun - Moon
Night chart: ASC + Moon - Sun
```

Because Arabic Part formula traditions can vary, this must be explicitly formula-verified before activation.

If formula verification is not completed in Sprint 12, keep Lot of Spirit deferred.

## Basic Arabic Parts Formula Policy

No formula may be active unless it has:

- source note;
- formula;
- day/night variant if applicable;
- required input list;
- verification status;
- tests.

Allowed verification statuses:

- pending;
- draft;
- needsReview;
- verified;
- rejected.

Do not activate `pending`, `draft`, or `needsReview` formulas.

## Formula Dataset Shape

Suggested module:

```txt
src/arabicPartsData.js
```

Suggested row shape:

```js
{
  key: "pars-fortuna",
  labelRu: "Парс Фортуны",
  labelEn: "Lot of Fortune",
  active: true,
  verificationStatus: "verified",
  formula: {
    day: ["asc", "+", "moon", "-", "sun"],
    night: ["asc", "+", "sun", "-", "moon"]
  },
  requiredPoints: ["asc", "sun", "moon"],
  notes: []
}
```

## Calculation Result Shape

Suggested result:

```js
{
  status: "ready",
  key: "pars-fortuna",
  label: "Парс Фортуны",
  longitude: 42.5821,
  sign: { key: "taurus", ru: "Телец", symbol: "♉" },
  degree: 12,
  minutes: 34,
  seconds: 56,
  text: "Парс Фортуны — Телец 12°34′56″",
  formulaVariant: "day",
  houseSystem: "placidus",
  houseNumber: 4,
  houseLabel: "4 дом"
}
```

## House Assignment for Lots / Parts

Lots and parts should use the same selected house system as the profile.

Policy:

- use numeric longitude for house assignment;
- do not use displayed rounded text;
- respect selected house system;
- no fallback between systems;
- if houses not ready, house assignment is notReady but the point may still be calculated if required formula inputs are ready.

## Privacy

Do not expose:

- raw birthDate;
- raw birthTime;
- utcDateTime;
- raw timezone;
- raw coordinates;
- full profile JSON;
- provider payload;
- raw intermediate arrays.

Allowed:

- formatted zodiac positions;
- house number;
- day/night label;
- formula variant label;
- safe readiness flags.

## Validation Requirements

Required tests:

- house cusp canonicalization for Whole Sign;
- house cusp canonicalization for Equal House;
- house cusp canonicalization for Placidus;
- cusp 1/4/7/10 invariants for Placidus;
- no fallback between systems;
- day/night day chart fixture;
- day/night night chart fixture;
- missing Sun/Moon returns notReady;
- Pars Fortuna day formula;
- Pars Fortuna night formula;
- longitude wrap-around;
- no NaN / undefined;
- no raw birth data;
- no interpretations;
- no provider or DOM imports in pure modules.

## Deferred

Deferred until later:

- broad Arabic Parts catalog;
- formula packs without verification;
- interpretations;
- ritual scoring;
- transits;
- automatic city lookup;
- fixed stars.
