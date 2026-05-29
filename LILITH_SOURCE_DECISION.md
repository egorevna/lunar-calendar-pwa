# LILITH_SOURCE_DECISION.md

## Purpose

Defines source / calculation feasibility for Lilith in Sprint 13.

This document is policy only. It does not implement a Lilith engine, fixtures, house assignment, UI, debug, Selena, Fixed Stars, transits or interpretations.

## Decision

Lilith status:

```txt
source-verified-for-implementation
```

Active source system:

```txt
mean-black-moon-lilith
```

Active runtime target:

```txt
browser-safe-local-implementation
```

Benchmark oracle:

```txt
local-swisseph-SE_MEAN_APOG-swe_calc_ut-static-fixtures
```

Deferred variants:

```txt
osculating-black-moon-lilith
true-lilith
interpolated-lilith
```

Sprint 13 may proceed to a Mean Black Moon Lilith / Mean Lunar Apogee engine in Task 13.6, but Task 13.5 itself does not calculate Lilith values. Local Swiss Ephemeris is allowed only as a local static benchmark oracle and must not be imported into the browser PWA runtime.

## Rationale

Mean Black Moon Lilith is selected as the first supported Lilith target because:

- the product needs a Lilith option, but Sprint 13 still requires source-gated activation;
- local Swiss Ephemeris exposes `SE_MEAN_APOG` and `swe_calc_ut`, and a local check confirmed `swe_calc_ut` returns a finite longitude for `SE_MEAN_APOG`;
- `SE_MEAN_APOG` gives a stable benchmark target for static fixtures;
- the browser PWA can implement a local deterministic Mean Lunar Apogee calculation in Task 13.6 without importing `swisseph`;
- True / Osculating Lilith is more volatile and must not be mixed with Mean Lilith silently;
- activating Mean Lilith here does not activate interpretations, karmic text or ritual scoring.

## Source / Dependency Audit

Current project state:

- no `src/lilith.js` or `src/specialPoints.js` production module exists;
- no existing production Lilith calculation helper was found in `src/`;
- `src/astroMath.js` already provides zodiac normalization and degree-minute-second formatting helpers;
- `src/birthDateTime.js` already resolves safe UTC readiness for exact birth moments;
- `src/lunarNodes.js` and `src/lunarNodesHouseAssignment.js` keep Lilith explicitly disabled in capabilities / limitations.

Astronomy Engine local support:

- the tracked `src/vendor/astronomy-engine.mjs` exposes `SearchLunarApsis`, `NextLunarApsis`, `Apsis` and `ApsisKind`;
- those helpers find lunar perigee / apogee events and distances;
- they do not expose a project-approved Black Moon Lilith / lunar apogee tropical longitude API for an arbitrary UTC moment;
- lunar apsis events alone are not sufficient as the Sprint 13 Lilith longitude API.

Swiss Ephemeris local oracle:

- `swisseph` is already present as a dev dependency;
- local `swisseph` exposes `SE_MEAN_APOG`, `SE_OSCU_APOG`, `SE_INTP_APOG` and `swe_calc_ut`;
- local audit confirmed `swe_calc_ut` can calculate `SE_MEAN_APOG`;
- Swiss Ephemeris examples calculate mean apogee and osculating apogee with `swe_calc_ut`;
- Swiss Ephemeris source comments identify mean lunar apogee as a Black Moon / Lilith-related point;
- Swiss Ephemeris may be used only to generate or verify static benchmark fixtures in local development;
- `swisseph` must not be imported into PWA runtime modules.

Runtime constraints:

- no new dependency is added for Lilith;
- no network calls are allowed;
- no Node-native runtime dependency may be required by the browser PWA;
- no Lilith runtime engine is created in Task 13.5.

## Calculation Policy

Task 13.6 may implement only the selected active target:

- point: Mean Black Moon Lilith / Mean Lunar Apogee;
- source system key: `mean-black-moon-lilith`;
- runtime target: browser-safe local implementation;
- benchmark source: static local Swiss Ephemeris `SE_MEAN_APOG` / `swe_calc_ut` fixture values;
- zodiac: tropical longitude;
- coordinate reference: 0° Aries = 0°;
- display precision: sign / degree / minute / second;
- input readiness: exact UTC birth moment; birth coordinates are not required for geocentric Lilith longitude itself;
- source metadata must be included in ready output.

Task 13.6 must not implement:

- True Lilith;
- Osculating Lilith;
- interpolated / natural Lilith variants;
- house assignment;
- UI;
- debug;
- interpretations.

Labels for future verified output:

- `Лилит`;
- `Средняя Лилит`;
- `Black Moon Lilith`;
- `Mean Lunar Apogee`;
- `Mean Black Moon Lilith`.

## Output Policy

Allowed future user-facing labels:

```txt
Лилит
Средняя Лилит
Black Moon Lilith
Mean Lunar Apogee
```

Forbidden output:

- fake zodiac positions;
- True / Osculating Lilith values under a Mean Lilith label;
- Mean Lilith values under a True / Osculating label;
- interpretations;
- karmic or fatalistic text;
- dark destiny language;
- ritual scoring;
- raw birth data;
- raw coordinates;
- raw UTC values;
- raw provider payloads;
- full profile JSON.

## Validation Plan

Task 13.6 must include static fixture coverage:

- at least 5 static benchmark UTC dates;
- expected values generated / checked from local Swiss Ephemeris `SE_MEAN_APOG` with `swe_calc_ut`;
- one wrap-around case near 0° Aries if available;
- source labels and variant labels;
- no private birth data;
- no raw coordinates;
- strict no mixing between mean, osculating and interpolated variants;
- tests confirming runtime code does not import `swisseph`.

## Deferred

True / Osculating Lilith remains deferred until:

- a separate source decision accepts the osculating variant;
- instability / oscillation behavior and tolerances are documented;
- fixture expectations are reviewed separately from Mean Lilith;
- UI labels make the variant explicit.

Interpolated / natural Lilith remains deferred until:

- the project accepts a documented source and naming policy for that variant;
- benchmark and runtime paths are reviewed separately;
- no Mean / True / Interpolated values are mixed silently.

Selena remains source-gated and is not started by this decision.

## Strict Exclusions

Task 13.5 and this policy do not add:

- `src/lilith.js`;
- `src/specialPoints.js`;
- Lilith calculated values;
- Lilith fixtures with calculated values;
- house assignment;
- display helper;
- UI;
- debug;
- Lunar Nodes changes;
- Selena;
- Fixed Stars;
- transits;
- interpretations;
- package dependencies;
- PWA cache changes.
