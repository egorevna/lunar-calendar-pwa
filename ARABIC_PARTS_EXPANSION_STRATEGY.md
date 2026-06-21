# ARABIC_PARTS_EXPANSION_STRATEGY.md

## Purpose

This document defines the strategy for expanding Arabic Parts / Lots after Sprint 12.

It does not implement code.

## Existing Active Lots

The project currently supports:

- Pars Fortuna / Lot of Fortune;
- Lot of Spirit / Жребий Духа.

These remain active and must not be changed unless a real bug is found.

## Candidate Lots for Sprint 15

Candidate expansion set:

- Lot of Eros;
- Lot of Necessity;
- Lot of Basis;
- Lot of Exaltation.

Candidates are not active by default.

## Layer Separation

Keep layers separate:

1. Source/tradition decision.
2. Per-Lot source verification.
3. Formula dataset update.
4. Formula engine expansion.
5. House assignment.
6. Display.
7. UI.
8. Debug.
9. Hardening.

Do not combine source verification and engine changes in the same task unless explicitly requested.

## Source Verification First

A Lot can become active only after:

- source formula is documented;
- day/night variants are documented if applicable;
- required inputs are listed;
- source note is attached;
- fixtures are manually declared;
- tests prove behavior;
- no interpretation text is included.

## Formula Conflict Handling

If sources disagree:

- do not choose silently;
- document conflict;
- set status to `needsReview` or `deferred`;
- do not activate the row.

## Formula Input Policy

Allowed formula operands include:

- ASC;
- Sun;
- Moon;
- Mercury;
- Venus;
- Mars;
- Jupiter;
- Saturn;
- Pars Fortuna;
- Lot of Spirit;
- other already verified active Lots only if explicitly allowed by source policy.

No formula may depend on an inactive/deferred Lot.

## Day / Night Policy

If a formula has day/night variants:

- use existing `dayNightChart` status;
- day/night must be ready;
- boundary/unknown status returns notReady;
- do not silently choose day formula.

## Calculation Policy

Calculations must use numeric longitude only.

Do not use display text.

Result longitude must be normalized:

```txt
0 <= longitude < 360
```

Output must format sign / degree / minute / second.

## House Assignment Policy

Use existing Arabic Parts house assignment layer.

Policy remains:

- numeric longitude;
- selected house system;
- canonical cusps;
- half-open spans;
- exact cusp belongs to starting house.

## Display Policy

Display verified Lots only.

Allowed display:

```txt
Жребий Эроса — Телец 12°34′56″ · 4 дом
```

Forbidden display:

- interpretation;
- prediction;
- fatalism;
- ritual advice;
- psychological claims.

## UI Policy

Update the existing block:

```txt
Жребии и арабские части
```

Do not create a separate competing UI block unless Sprint 15 decides otherwise.

## Debug Policy

Debug may show:

- active formula keys;
- deferred formula keys;
- counts;
- readiness;
- formula source statuses.

Debug must not show:

- raw birth data;
- coordinates;
- full profile JSON;
- full formula arrays;
- provider payload.

## Strict Exclusions

Do not add:

- Fixed Stars changes;
- Midpoints / Antiscia;
- Personal Transits;
- interpretations;
- ritual scoring;
- formulas from memory.
