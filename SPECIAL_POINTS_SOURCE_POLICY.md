# SPECIAL_POINTS_SOURCE_POLICY.md

## Purpose

This document defines source gating for Sprint 13 special points.

It prevents activating disputed points without a validated calculation source.

## Source Statuses

Allowed statuses:

```txt
verified
source-gated
deferred
needsReview
rejected
```

Only `verified` points may be calculated as active results.

## Active Target

### Lunar Nodes

Status at Sprint 13 start:

```txt
source-gated active target
```

Meaning:

- Sprint 13 intends to implement Lunar Nodes;
- source/calculation policy must be decided first;
- implementation requires fixtures.

Decision needed:

- mean node or true node;
- source path;
- fixture source.

## Source-Gated Points

### Lilith

Status at Sprint 13 start:

```txt
source-gated
```

Reason:

- multiple calculation variants exist;
- formula/provider must be chosen before activation;
- no default activation without source decision.

Known variants to evaluate:

- Mean Black Moon Lilith;
- True / Osculating Black Moon Lilith.

### Selena

Status at Sprint 13 start:

```txt
source-gated
```

Reason:

- calculation method is not standardized across common astronomical libraries;
- requires explicit source and fixture validation;
- no activation from memory.

## Deferred Output Policy

If a point is not source-verified, user-facing output may say:

```txt
Lilith — отложено до проверки расчетной системы
Selena — отложено до проверки расчетной системы
```

Do not show fake zodiac positions.

## Dataset Row Shape

Suggested future data row:

```js
{
  key: "lilith",
  labelRu: "Lilith",
  labelEn: "Black Moon Lilith",
  active: false,
  verificationStatus: "source-gated",
  sourceSystem: null,
  calculationMethod: null,
  deferredReason: "lilithSourceNotVerified",
  interpretation: false
}
```

## Source Decision Requirements

A point can become active only if:

1. Calculation variant is named.
2. Source path is documented.
3. Required inputs are known.
4. Fixtures exist.
5. Edge cases are defined.
6. Tests pass.
7. Output is privacy-safe.
8. No interpretation is included.

## No Formula From Memory

Do not activate Lilith or Selena because a formula is familiar or commonly repeated.

Codex must not invent or infer formulas without documented source decision.

## Runtime Dependency Policy

If using an existing dependency:

- verify it is already part of the project;
- verify browser/PWA compatibility;
- verify it is not a Node-only module in runtime;
- document source and limitations.

Do not add dependencies without explicit approval.

## Privacy

Source decisions and debug must not expose:

- raw birth date/time;
- coordinates;
- full profile JSON;
- provider payloads;
- raw computation arrays.

## Future Expansion

Potential future special points may be added only through the same source-gated process.
