# FIXED_STARS_STRATEGY.md

## Purpose

This document defines the source, calculation, validation, display, UI, and debug strategy for Sprint 14 Fixed Stars.

It does not implement code.

## Layer Separation

Keep these layers separate:

1. Source/catalog decision.
2. Star catalog dataset.
3. Star position / epoch helper.
4. Profile target resolver.
5. Conjunction detection engine.
6. Validation fixtures.
7. Display helper.
8. UI.
9. Debug.
10. Hardening.

Do not mix catalog data with interpretations.

## Source-Gated Requirement

No fixed star can be active unless source-verified.

A fixed star row must have:

- key;
- labels;
- source metadata;
- coordinate data;
- epoch/coordinate policy;
- verification status;
- active flag.

No star position may be added from memory.

## Coordinate / Epoch Strategy

Fixed star positions require an explicit coordinate policy.

Questions to resolve in Task 14.2:

1. Are star positions stored as ecliptic longitudes?
2. Are they tropical or sidereal?
3. What epoch are they for?
4. Is precession applied to the user’s birth date?
5. Are positions static for Sprint 14?
6. What source validates the position?

Do not silently mix J2000, date-of-birth, tropical, and sidereal positions.

## Recommended Initial Scope

Recommended first active target set:

```txt
natal planets + ASC / MC / DSC / IC
```

Why:

- these are already stable project outputs;
- user-facing meaning is straightforward;
- it avoids overloading the first fixed-star UI with every possible point.

Deferred target sets unless explicitly approved:

- house cusps;
- Lunar Nodes;
- Lilith;
- Selena;
- Pars Fortuna;
- Lot of Spirit;
- all Arabic Parts;
- custom points.

## Relationship Policy

Sprint 14 should start with:

```txt
conjunction only
```

A fixed-star hit is a conjunction between a target longitude and a star longitude.

Deferred relationship types:

- opposition;
- square;
- trine;
- sextile;
- paran;
- heliacal rising/setting;
- mundane position relationships.

## Orb Policy

Orb must be explicit.

Suggested fields:

```js
{
  orbPolicyKey: "fixed-stars-global-conjunction-orb",
  defaultOrbDegrees: 1,
  perStarOverrides: false,
  perTargetOverrides: false
}
```

However, Task 14.2 must decide the final policy.

Do not activate a hidden default orb.

## Result Shape

Suggested fixed-star hit result:

```js
{
  status: "ready",
  starKey: "regulus",
  starLabel: "Регул",
  starLabelEn: "Regulus",
  targetKey: "asc",
  targetLabel: "ASC",
  relationship: "conjunction",
  orbDegrees: 0.208333,
  orbText: "0°12′30″",
  starPosition: {
    text: "Лев 00°05′22″"
  },
  targetPosition: {
    text: "Лев 00°17′52″"
  },
  sourceSystem: "fixed-stars-catalog-..."
}
```

No interpretation text.

## Display Policy

Allowed display:

```txt
Регул — соединение с ASC · орб 0°12′30″
```

Forbidden display:

- “brings fame”;
- “danger”;
- “royal destiny”;
- “fatal”;
- “karmic”;
- ritual advice.

## Debug Policy

Debug may show:

- catalog status;
- active star count;
- target count;
- hit count;
- orb policy key;
- source system key;
- privacy flags.

Debug must not show:

- raw birth data;
- raw coordinates;
- full profile JSON;
- full target arrays;
- full star catalog dump;
- provider payload.

## Validation Requirements

Tests must cover:

- catalog rows are source-tracked;
- no interpretations in catalog;
- active star count;
- coordinate/epoch metadata;
- orb policy;
- conjunction inside orb;
- conjunction outside orb;
- exact conjunction;
- wrap-around near 0° Aries;
- target resolver privacy;
- UI/debug privacy.

## Deferred

Deferred until later:

- interpretations;
- star mythology;
- paran relationships;
- heliacal phenomena;
- star-rise/set calculations;
- broad star catalogs without source policy;
- Arabic Parts expansion;
- personal transits.
