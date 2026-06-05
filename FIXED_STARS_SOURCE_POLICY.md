# FIXED_STARS_SOURCE_POLICY.md

## Purpose

This document defines source gating for Fixed Stars in Sprint 14.

It prevents activating a star catalog without a verified source, coordinate policy, and orb policy.

## Required Source Decision

Task 14.2 must decide:

1. Active fixed-star source catalog.
2. Active coordinate system.
3. Active epoch policy.
4. Active precession policy.
5. Active conjunction orb policy.
6. Active target set.

No source decision means no engine implementation.

## Source Statuses

Allowed statuses:

```txt
verified
source-gated
deferred
needsReview
rejected
```

Only `verified` catalog rows may be active.

## Candidate Catalog Policy

Candidate star names may be listed for planning, but must not become active until verified.

Candidate categories:

- major traditional fixed stars;
- bright ecliptic-proximate stars;
- source-selected catalog subset.

Do not activate named stars from memory.

## Catalog Row Shape

Suggested future row:

```js
{
  key: "regulus",
  labelRu: "Регул",
  labelEn: "Regulus",
  active: true,
  verificationStatus: "verified",
  sourceSystem: "fixed-stars-source-...",
  coordinateSystem: "tropical-ecliptic-longitude",
  epoch: "date-of-birth" ,
  longitude: null,
  sourceNote: "...",
  interpretation: false
}
```

## Coordinate Policy

Each active catalog must define:

- whether star position is ecliptic or equatorial;
- whether zodiac is tropical or sidereal;
- epoch;
- whether precession is applied;
- how birth-date positions are produced.

## Runtime Policy

Runtime must be browser-safe.

Allowed:

- static source-tracked catalog data;
- browser-safe calculations;
- existing approved runtime helpers.

Forbidden without explicit approval:

- Node-native runtime dependencies;
- network calls;
- unverified star catalog imports;
- runtime Swiss Ephemeris imports.

## Benchmark / Validation Policy

If local Swiss Ephemeris or another local oracle is used:

- it is dev/test only;
- expected values are stored as static fixtures;
- runtime does not import oracle;
- source/license notes are documented.

## Orb Policy

The orb policy must be explicit.

No implicit “near star” detection.

Suggested statuses:

```txt
orb-policy-pending
orb-policy-verified
orb-policy-deferred
```

## Target Policy

The first active target set must be explicit.

Recommended first target set:

```txt
natal planets + chart angles
```

Alternative targets such as Lunar Nodes, Lilith, Selena, Pars Fortuna, Lot of Spirit, and house cusps are deferred unless Task 14.2 explicitly activates them.

## Interpretation Policy

No interpretations in Sprint 14.

Catalog rows may include source labels but not meanings.

Forbidden terms in UI/display/debug:

- fatal;
- karmic;
- destiny;
- fame/danger predictions;
- ritual advice.

Russian equivalents are also forbidden in user-facing output:

- фатально;
- карма / кармический;
- судьба;
- опасность / слава as prediction;
- ритуал.

## Privacy

Fixed Stars UI/debug must not expose:

- raw birth date/time;
- coordinates;
- UTC;
- full profile JSON;
- full target arrays;
- provider payload.

## Task 14.2 Exit Criteria

Task 14.2 is complete only when it decides:

- catalog source;
- coordinate/epoch/precession policy;
- orb policy;
- first target set;
- deferred catalog/relationship/target policies.

If any of these cannot be decided, implementation must be blocked until the source decision is resolved.
