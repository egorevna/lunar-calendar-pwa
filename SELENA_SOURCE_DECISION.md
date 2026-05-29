# SELENA_SOURCE_DECISION.md

## Purpose

Defines source / calculation feasibility for Selena / White Moon in Sprint 13.

This document is policy only. It does not implement a Selena engine, fixtures, house assignment, UI, debug, Lunar Nodes changes, Lilith changes, Fixed Stars, transits or interpretations.

## Decision

Selena status:

```txt
source-verified-for-implementation
```

Active source system:

```txt
selena-white-moon
```

Calculation method:

```txt
swisseph-seorbel-white-moon-linear-elements
```

Active runtime target:

```txt
browser-safe-local-implementation
```

Benchmark oracle:

```txt
local-swisseph-SE_WHITE_MOON-swe_calc_ut-static-fixtures
```

Sprint 13 may proceed to a Selena / White Moon engine in Task 13.8, but Task 13.7 itself does not calculate Selena values. Local Swiss Ephemeris is allowed only as a local static benchmark oracle and must not be imported into the browser PWA runtime.

Selena / White Moon is treated as a Swiss Ephemeris fictitious / hypothetical calculated point. It is not represented as a physical astronomical body. The project supports only the selected Swiss Ephemeris `seorbel` source system for Selena; no alternate Selena source systems are active.

## Rationale

Selena can be activated as a narrow source-verified target because:

- local Swiss Ephemeris exposes `SE_WHITE_MOON` as a fictitious body constant;
- local `swisseph/ephe/seorbel.txt` explicitly defines `Selena/White Moon, geo #17`;
- local audit confirmed `swe_calc_ut` can calculate `SE_WHITE_MOON` when the local ephemeris path is set;
- the source row is explicit enough to document a browser-safe local implementation target for Task 13.8;
- the implementation can be validated against static `SE_WHITE_MOON` benchmark fixtures;
- activating this source target does not add interpretations, karmic text, guardian-angel language or ritual scoring.

Selena remains less standardized than Lunar Nodes and Mean Lilith, so the project must label this source clearly as Selena / White Moon from the selected Swiss Ephemeris fictitious / hypothetical body elements. No other Selena variant is activated by this decision.

## Source / Dependency Audit

Current project state:

- no `src/selena.js` or `src/specialPoints.js` production module exists;
- no existing production Selena / White Moon helper was found in `src/`;
- `src/astroMath.js` already provides zodiac normalization and degree-minute-second formatting helpers;
- `src/birthDateTime.js` already resolves safe UTC readiness for exact birth moments;
- `src/lunarNodes.js`, `src/lunarNodesHouseAssignment.js` and `src/lilith.js` keep Selena explicitly disabled in capabilities / limitations.

Astronomy Engine local support:

- the tracked `src/vendor/astronomy-engine.mjs` exposes lunar apsis event helpers such as `SearchLunarApsis` and `NextLunarApsis`;
- those helpers find lunar perigee / apogee events and distances;
- they do not expose a project-approved Selena / White Moon tropical longitude API for an arbitrary UTC moment;
- lunar apsis events alone are not sufficient as the Sprint 13 Selena longitude API.

Swiss Ephemeris local oracle:

- `swisseph` is already present as a dev dependency;
- local `swisseph` exposes `SE_WHITE_MOON`;
- local `swisseph/ephe/seorbel.txt` contains an explicit `Selena/White Moon, geo #17` row;
- local audit confirmed `swe_calc_ut` can calculate `SE_WHITE_MOON` with the local ephemeris path;
- Swiss Ephemeris may be used only to generate or verify static benchmark fixtures in local development;
- `swisseph` must not be imported into PWA runtime modules.

Runtime constraints:

- no new dependency is added for Selena;
- no network calls are allowed;
- no Node-native runtime dependency may be required by the browser PWA;
- no Selena runtime engine is created in Task 13.7.

## Calculation Policy

Task 13.8 may implement only the selected active target:

- point: Selena / White Moon;
- source system key: `selena-white-moon`;
- calculation method: `swisseph-seorbel-white-moon-linear-elements`;
- point type: fictitious / hypothetical calculated point, not a physical astronomical body;
- runtime target: browser-safe local implementation;
- benchmark source: static local Swiss Ephemeris `SE_WHITE_MOON` / `swe_calc_ut` fixture values;
- zodiac: tropical longitude;
- coordinate reference: 0° Aries = 0°;
- display precision: sign / degree / minute / second;
- input readiness: exact UTC birth moment; birth coordinates are not required for this geocentric fictitious point longitude itself;
- source metadata must be included in ready output.

Task 13.8 must not implement:

- alternative Selena variants;
- Lunar Nodes changes;
- Lilith changes;
- house assignment;
- UI;
- debug;
- interpretations.

Labels for future verified output:

- `Селена`;
- `Белая Луна`;
- `Selena`;
- `White Moon`.

## Output Policy

Allowed future user-facing labels:

```txt
Селена
Белая Луна
Selena
White Moon
```

Forbidden output:

- fake zodiac positions;
- vague Selena values without the selected source system;
- interpretations;
- karmic or fatalistic text;
- guardian-angel interpretive language;
- ritual advice;
- ritual scoring;
- raw birth data;
- raw coordinates;
- raw UTC values;
- raw provider payloads;
- full profile JSON.

## Validation Plan

Task 13.8 must include static fixture coverage:

- at least 5 static benchmark UTC dates;
- expected values generated / checked from local Swiss Ephemeris `SE_WHITE_MOON` with `swe_calc_ut`;
- one wrap-around case near 0° Aries if available;
- source labels and method labels;
- no private birth data;
- no raw coordinates;
- strict no fake values;
- tests confirming runtime code does not import `swisseph`.

## Deferred / Blocked Variants

No alternate Selena / White Moon calculation variants are activated in Task 13.7.

Any future alternate Selena source must remain deferred until:

- a reliable source is documented;
- the calculation method is explicit;
- benchmark fixtures exist;
- browser-safe runtime feasibility is proven;
- UI labels prevent silent mixing between Selena source systems.

## Strict Exclusions

Task 13.7 and this policy do not add:

- `src/selena.js`;
- `src/specialPoints.js`;
- Selena calculated values;
- Selena fixtures with calculated values;
- house assignment;
- display helper;
- UI;
- debug;
- Lunar Nodes changes;
- Lilith changes;
- Fixed Stars;
- transits;
- interpretations;
- package dependencies;
- PWA cache changes.
