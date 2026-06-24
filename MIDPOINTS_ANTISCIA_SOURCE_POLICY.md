# MIDPOINTS_ANTISCIA_SOURCE_POLICY.md

## Purpose

This document defines source and formula gating for Sprint 16 Midpoints / Antiscia Foundation.

It prevents implementing midpoint/antiscia math without an explicit source/formula/scope decision.

## Required Source Decision

Task 16.2 must decide:

1. Midpoint formula.
2. Midpoint wrap-around policy.
3. Whether midpoint axis/opposite point is included.
4. Antiscion formula.
5. Contra-antiscion formula.
6. Tropical zodiac basis.
7. Active target set.
8. Deferred target sets.
9. Display scope.
10. Debug/privacy boundaries.

No decision means no engine implementation.

## Task 16.2 Accepted Decision

Task 16.2 records the accepted formula / scope policy in `MIDPOINTS_ANTISCIA_FORMULA_SCOPE_DECISION.md`.

Source status:

```txt
source-verified-for-implementation
```

Accepted formula policies:

- midpoint: shortest-arc midpoint between two normalized tropical longitudes;
- exact opposition: axis-ambiguous, not silently reduced to one arbitrary midpoint;
- antiscion: `normalize(180 - longitude)`;
- contra-antiscion: `normalize(360 - longitude)`.

Accepted first target scopes:

- Midpoints: natal planets only, expected pair count `45`;
- Antiscia / Contra-antiscia: natal planets + ASC / MC / DSC / IC, expected target count `14`.

Deferred:

- expanded target sets;
- midpoint contacts / midpoint pictures;
- antiscia contacts;
- transits / progressions;
- interpretations.

## Formula Statuses

Allowed statuses:

```txt
verified
candidate
deferred
needsReview
rejected
```

Only `verified` formulas may be implemented.

## Pre-Task 16.2 Candidate Formula Policies

The candidate policies below are retained as source-gating history. The accepted Task 16.2 decision is recorded above and in `MIDPOINTS_ANTISCIA_FORMULA_SCOPE_DECISION.md`.

### Midpoint Candidate

Candidate policy:

```txt
shortest-arc midpoint between two ecliptic longitudes
```

Must verify:

- normalized input;
- normalized output;
- wrap-around handling;
- exact opposite-point behavior;
- pair ordering;
- whether midpoint axis includes opposite point.

### Antiscion Candidate

Candidate policy:

```txt
mirror across Cancer–Capricorn solstice axis
```

Must verify exact formula.

### Contra-antiscion Candidate

Candidate policy:

```txt
mirror across Aries–Libra equinox axis
```

Must verify exact formula.

## Runtime Policy

Runtime must be browser-safe.

Allowed:

- pure numeric longitude calculations;
- existing approved profile/natal/angle helpers;
- source-tracked static fixtures.

Forbidden:

- runtime native dependencies;
- network calls;
- unverified formula imports;
- external services.

## Target Policy

Candidate initial target sets:

### Midpoints

Recommended active:

```txt
natal planets only
```

Deferred:

```txt
angles
house cusps
special points
Arabic Parts
Fixed Stars
custom points
```

### Antiscia / Contra-antiscia

Recommended active:

```txt
natal planets + chart angles
```

Deferred:

```txt
house cusps
special points
Arabic Parts
Fixed Stars
custom points
```

Task 16.2 must decide final scope.

## Interpretation Policy

No interpretations in Sprint 16.

Forbidden:

- karmic meaning;
- psychological claims;
- prediction;
- fatalistic claims;
- ritual advice.

## Privacy

Midpoints / Antiscia UI and debug must not expose:

- raw birth date/time;
- coordinates;
- UTC;
- full profile JSON;
- provider payload;
- raw calculation arrays.

## Task 16.2 Exit Criteria

Task 16.2 is complete only when it decides:

- midpoint formula;
- antiscion formula;
- contra-antiscion formula if active;
- target scope;
- deferred scope;
- next active implementation task.

If any formula cannot be verified, implementation must be blocked until source/formula policy is resolved.
