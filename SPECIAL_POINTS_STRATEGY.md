# SPECIAL_POINTS_STRATEGY.md

## Purpose

This document defines the calculation and source policy for Sprint 13 Special Points:

- Lunar Nodes;
- Lilith;
- Selena.

It does not implement code.

## Layer Separation

Keep layers separate:

1. Source decision.
2. Input readiness.
3. Calculation engine.
4. Fixtures / validation.
5. House assignment.
6. Display helper.
7. UI.
8. Debug.
9. Hardening.

Do not mix source decision with calculation implementation.

## Required Inputs

For special points that depend on birth chart context:

- exact birth time;
- validated birth timezone / UTC moment;
- birth place coordinates;
- selected zodiac policy;
- selected calculation method/source.

If an input is missing, return safe notReady.

Do not fake special points.

## General Output Shape

Suggested result shape:

```js
{
  status: "ready",
  ready: true,
  key: "north-node",
  label: "Северный узел",
  labelEn: "North Node",
  sourceSystem: "lunar-node-true-or-mean",
  longitude: 123.456789,
  sign: { key: "leo", ru: "Лев", symbol: "♌" },
  degree: 3,
  minutes: 12,
  seconds: 44,
  text: "Северный узел — Лев 03°12′44″",
  verificationStatus: "verified"
}
```

No interpretation text.

## Lunar Nodes Policy

Lunar Nodes are the active target for Sprint 13.

Before implementation, decide:

- Mean Node or True Node;
- source path;
- validation fixtures;
- South Node derivation.

### Mean vs True Node

Do not activate both by accident.

Suggested product decision options:

1. Use Mean Node as default.
2. Use True Node as default.
3. Support both as separate source systems later.

Sprint 13 must choose one active default unless a strong reason exists to support both.

### South Node

Once North Node policy is chosen:

```txt
South Node = North Node + 180°
```

Normalize to 0..360.

South Node should use the same source metadata as North Node.

## Lilith Policy

Lilith is source-gated.

Possible definitions:

- Mean Black Moon Lilith;
- True / Osculating Black Moon Lilith;
- other tool-specific variants.

Do not activate Lilith until:

- variant is chosen;
- source path is documented;
- benchmark fixtures exist;
- unsupported/ambiguous cases fail safely.

If not verified:

```js
{
  status: "deferred",
  reason: "lilithSourceNotVerified"
}
```

## Selena Policy

Selena / White Moon is source-gated.

It is not as standardized as Lunar Nodes. It must not be activated from memory or a single vague formula.

Activation requires:

- defined calculation method;
- source documentation;
- fixtures;
- privacy-safe output policy.

If not verified:

```js
{
  status: "deferred",
  reason: "selenaSourceNotVerified"
}
```

## House Assignment

Active special points should be assignable to houses using the existing selected house system.

Policy:

- use numeric longitude;
- use canonical house cusps;
- use half-open intervals;
- exact cusp belongs to the house starting at that cusp;
- do not use display text for assignment;
- do not fallback between house systems.

## Display Policy

User-facing special points should display:

```txt
Северный узел — Лев 03°12′44″ · 7 дом
Южный узел — Водолей 03°12′44″ · 1 дом
```

For deferred source-gated points:

```txt
Lilith — отложено до проверки расчетной системы
Selena — отложено до проверки расчетной системы
```

No interpretations.

## Debug Policy

Debug may show:

- active/deferred status;
- selected source system;
- counts;
- readiness flags;
- privacy flags.

Debug must not show:

- raw birth data;
- raw coordinates;
- raw UTC;
- full profile JSON;
- raw provider payload;
- full calculation arrays.

## Validation Requirements

Tests must cover:

- North Node ready output;
- South Node opposite North Node;
- normalization across 360;
- formatted seconds;
- missing profile fallback;
- unknown birth time fallback;
- missing coordinates fallback;
- source separation;
- no fake Lilith/Selena if deferred;
- no interpretations;
- no raw birth data;
- no raw coordinates.

## Deferred

Deferred until future sprints or source packs:

- Fixed Stars;
- Arabic Parts Expansion Pack;
- Midpoints / Antiscia;
- Personal Transits;
- interpretations;
- ritual scoring.
