# PARS_FORTUNA_ARABIC_PARTS_FORMULA_POLICY.md

## Purpose

This document defines formula governance for Pars Fortuna and Arabic Parts.

It prevents formula drift and prevents activating unverified formulas.

## General Rules

1. No formula is active without explicit verification.
2. Do not implement Arabic Parts from memory.
3. Do not activate conflicting formula traditions without a source decision.
4. Do not mix day/night variants.
5. Do not silently default to day formula when chart sect is unknown.
6. Do not add interpretations in Sprint 12.

## Required Formula Inputs

Formula calculations may use:

- ASC;
- MC if a formula explicitly requires it;
- Sun;
- Moon;
- Mercury;
- Venus;
- Mars;
- Jupiter;
- Saturn;
- selected house system result for house assignment;
- day/night chart status.

No formula should read raw birth data directly if a validated chart context is already available.

## Formula Expression Convention

Use ordered arithmetic expressions:

```txt
ASC + Moon - Sun
```

All operands are ecliptic longitudes in degrees.

All results are normalized:

```txt
normalize((A + B - C), 0..360)
```

Do not use sign text for formula calculation.

## Pars Fortuna / Lot of Fortune

Status: required for Sprint 12.

Formula:

```txt
Day chart:   ASC + Moon - Sun
Night chart: ASC + Sun - Moon
```

Required inputs:

- ASC;
- Sun;
- Moon;
- day/night status.

Activation status:

```txt
verified after Task 12.4 fixtures pass
```

## Lot of Spirit

Formula candidate:

```txt
Day chart:   ASC + Sun - Moon
Night chart: ASC + Moon - Sun
```

Status:

```txt
candidate until formula source decision is completed
```

Do not activate until Task 12.5 approves it.

## Additional Basic Arabic Parts

Additional lots/parts must be handled through Task 12.5.

Candidate examples may include:

- Lot of Spirit;
- Lot of Eros;
- Lot of Necessity;
- Lot of Basis;
- Lot of Exaltation;

but no candidate becomes active without formula verification.

## Formula Dataset Policy

Every formula row must include:

- key;
- Russian label;
- English/Latin label if useful;
- active boolean;
- verificationStatus;
- formula expression;
- required inputs;
- day/night variant if applicable;
- source note;
- limitations.

Allowed statuses:

```txt
pending
draft
needsReview
verified
rejected
```

Only `verified` formulas may be active.

## Day / Night Dependency

If a formula has day/night variants:

- day/night status must be ready;
- if day/night status is missing, return notReady;
- output must include formulaVariant: `day` or `night`.

## Output Precision

User-facing zodiac positions must display degrees, minutes, and seconds.

Example:

```txt
Парс Фортуны — Телец 12°34′56″
```

Internal longitude remains numeric and precise.

## House Assignment

If selected house system is ready:

- assign each calculated lot/part to a house;
- use numeric longitude against selected house system cusps;
- do not use display text;
- do not fallback between house systems.

If house system is not ready:

- still calculate the lot/part if formula inputs are ready;
- set house assignment status to notReady.

## Privacy

Formula outputs must not include:

- raw birth date;
- raw birth time;
- raw timezone;
- raw coordinates;
- full profile JSON;
- provider payload.

## Debug

Debug may show:

- formula key;
- formula readiness;
- required input availability;
- formulaVariant;
- result count;
- house assignment count.

Debug must not show:

- raw birth data;
- raw coordinates;
- full intermediate calculation arrays;
- full profile JSON.

## Deferred Formula Handling

If a formula cannot be verified:

```js
{
  status: "deferred",
  reason: "formulaNotVerified"
}
```

Do not create fake values.

## Sprint 12 First Active Formula

The first active formula should be Pars Fortuna only, unless Task 12.5 explicitly verifies additional formulas.

This keeps Sprint 12 safe and testable.
