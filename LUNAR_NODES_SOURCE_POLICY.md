# LUNAR_NODES_SOURCE_POLICY.md

## Purpose

Defines the Lunar Nodes source / calculation policy for Sprint 13.

This document is policy only. It does not implement a Lunar Nodes engine, fixtures, UI, debug, Lilith, Selena, Fixed Stars, transits or interpretations.

## Decision

Active node system:

```txt
mean-lunar-node
```

Source system key:

```txt
lunar-nodes-mean
```

Deferred node system:

```txt
true-lunar-node
```

Sprint 13 will implement one active Lunar Nodes system first: the mean lunar node. The true lunar node remains deferred until a separate source decision explicitly activates it.

## Rationale

Mean Lunar Node is the safer active default for Sprint 13 because:

- it is a stable, smooth node model suitable for a first verified special-points layer;
- it is easier to label clearly as mean node in UI/debug/source metadata;
- it can be validated against the existing local Swiss Ephemeris dev oracle using `SE_MEAN_NODE`;
- it avoids accidentally mixing mean and osculating / true node semantics.

True Lunar Node is deferred because:

- it is osculating and may visibly oscillate;
- it needs separate product wording and source expectations;
- local browser-safe runtime support is not currently exposed as a ready public longitude API;
- fixture tolerances and edge cases should be reviewed separately before activation.

## Source / Dependency Audit

Current project state:

- no existing `src/lunarNodes.js` or `src/specialPoints.js` module exists;
- no existing production Lunar Nodes helper was found in `src/`;
- `src/astroMath.js` already provides zodiac normalization and degree-minute-second formatting helpers;
- `src/birthDateTime.js` already resolves safe UTC readiness for exact birth moments;
- `src/natalPlanetsForProfile.js` uses the approved Astronomy Engine natal planet path but does not calculate Lunar Nodes.

Astronomy Engine local support:

- the tracked `src/vendor/astronomy-engine.mjs` exposes `SearchMoonNode`, `NextMoonNode`, `NodeEventInfo` and `NodeEventKind`;
- these functions search Moon ecliptic-plane crossing events, not natal mean/true node zodiac longitude at an arbitrary birth moment;
- the vendor source contains a documented internal expression for the Moon ascending node mean longitude in the lunar calculation code, but it is not exposed as a ready project API.

Swiss Ephemeris local oracle:

- `swisseph` is already a dev dependency;
- local `swisseph` exposes `SE_MEAN_NODE`, `SE_TRUE_NODE`, `swe_calc_ut` and ephemeris files;
- Swiss Ephemeris may be used only to generate or verify static benchmark fixtures in tests / local development;
- `swisseph` must not be imported into PWA runtime modules.

Runtime constraints:

- no new dependency is added for Lunar Nodes;
- no network calls are allowed;
- no Node-native runtime dependency may be required by the browser PWA;
- Task 13.3 must use a browser-safe implementation path and validate it against static benchmarks.

## Calculation Policy

North Node:

- calculate the North Node from the selected active source system: `lunar-nodes-mean`;
- use tropical zodiac longitude;
- normalize longitude into `0 <= longitude < 360`;
- display as sign, degree, minute and second.

South Node:

```txt
South Node = normalize(North Node + 180°)
```

South Node rules:

- derive South Node from North Node only;
- do not calculate South Node independently from another provider/source;
- keep the same source metadata and verification status as the North Node.

Labels:

- `Северный узел` / `North Node`;
- `Южный узел` / `South Node`.

## Output Policy

Allowed output:

- formatted zodiac positions with seconds;
- safe source metadata such as `sourceSystem: "lunar-nodes-mean"`;
- safe verification status;
- safe fallback / deferred messages.

Forbidden output:

- interpretations;
- karmic or fatalistic text;
- ritual scoring;
- raw birth data;
- raw coordinates;
- raw provider payloads;
- full profile JSON.

## Validation Plan

Task 13.3 must add static/manual benchmark fixtures before enabling ready output.

Fixture plan:

- at least 5 benchmark UTC dates;
- at least one case near 0° Aries wrap-around;
- North Node longitude validated against local Swiss Ephemeris `SE_MEAN_NODE`;
- South Node checked as exactly opposite North Node after normalization;
- formatted output checked with degree-minute-second precision;
- fixtures must not use private user profile data;
- fixtures must not require raw coordinates because Lunar Nodes are geocentric zodiac points;
- `swisseph` remains a test/dev oracle only and must not appear in runtime imports.

## Deferred

Deferred node system:

```txt
true-lunar-node
```

True Node remains deferred until:

- a separate source decision selects it;
- fixture expectations and tolerances are documented;
- UI/debug labels make the true/mean distinction explicit;
- no accidental fallback between mean and true node systems is possible.

## Strict Exclusions

Task 13.2 and this policy do not add:

- `src/lunarNodes.js`;
- `src/specialPoints.js`;
- calculation fixtures with node values;
- Lunar Nodes UI/debug/display helper;
- house assignment;
- Lilith;
- Selena;
- Fixed Stars;
- transits;
- interpretations;
- package dependencies;
- PWA cache changes.
