# SPRINT_12_PLAN.md

## Sprint Name

Sprint 12 — House Cusps + Pars Fortuna + Basic Arabic Parts

## Goal

Sprint 12 adds the next personal chart layer on top of Sprint 11:

- canonical house cusp outputs for the selected house system;
- day / night chart status for Lot formulas;
- Pars Fortuna / Lot of Fortune;
- an initial, formula-verified set of basic Arabic Parts;
- house assignment for calculated lots/parts;
- display, UI, debug, and hardening.

This sprint does not add interpretations. It creates calculation-ready personal points that future interpretation and recommendation layers can use.

## Current Foundation From Sprint 11

Sprint 11 already provides:

- exact-time and coordinate guardrails;
- ASC / MC / DSC / IC;
- Whole Sign houses;
- Equal House houses;
- Placidus houses validated against static Swiss Ephemeris benchmark fixtures;
- profile-level `houseSystem` selection;
- house system resolver;
- planet-in-house assignment;
- Houses / ASC / MC display helper;
- user-facing block “Дома и углы карты”;
- safe debug.

Sprint 12 must reuse those layers. Do not reimplement house engines.

## Scope

Sprint 12 includes:

- house cusp canonicalization for all supported house systems;
- house cusp validation fixtures;
- day / night chart status;
- Pars Fortuna calculation;
- formula policy for basic Arabic Parts;
- verified formula dataset for the initial basic Arabic Parts set;
- basic Arabic Parts calculation engine;
- point-in-house assignment for lots/parts;
- display helper;
- user-facing collapsible UI block or extension of “Дома и углы карты”;
- safe debug;
- hardening.

## Non-Goals

Sprint 12 does not include:

- interpretations;
- ritual scoring;
- personal transits;
- Fixed Stars;
- Lunar Nodes / Lilith / Selena;
- Midpoints / Antiscia;
- electional recommendations;
- geocoding / automatic city lookup;
- new house systems;
- changing Placidus, Equal House, or Whole Sign math unless a real bug is found.

## Required Input Policy

Sprint 12 inherits Sprint 11 guardrails.

Required for house cusps, Pars Fortuna, and Arabic Parts:

1. Exact birth time.
2. Valid birth timezone or already validated UTC birth moment.
3. Birth place coordinates.
4. Ready natal Sun and Moon positions for Pars Fortuna.
5. Required planet/body positions for each Arabic Part formula.
6. Ready selected house system when house assignment is needed.

If required inputs are missing, return a safe notReady result.

Do not fake lots/parts from noon time, missing coordinates, or incomplete natal positions.

## House Cusp Policy

House cusps must be exposed through a canonical selected-system result, not recalculated ad hoc.

Supported systems:

- `whole-sign`
- `equal-house`
- `placidus`

### Whole Sign

For Whole Sign:

- house 1 = ASC sign;
- each house is one full zodiac sign;
- cusp-like sign boundaries are sign boundaries, not exact quadrant cusps;
- exact ASC degree remains an angle, not the start of the 1st Whole Sign house;
- output must clearly label `houseSystem: "whole-sign"`.

### Equal House

For Equal House:

- cusp 1 = exact ASC longitude;
- cusp N = normalize(ASC longitude + (N - 1) * 30°);
- all cusps are exact house cusps for that system;
- output must clearly label `houseSystem: "equal-house"`.

### Placidus

For Placidus:

- cusps come from the validated Placidus engine;
- ASC = cusp 1;
- MC = cusp 10;
- DSC = cusp 7;
- IC = cusp 4;
- no fallback to Equal House or Whole Sign;
- output must clearly label `houseSystem: "placidus"`.

## Day / Night Chart Policy

Day / night chart status is required for Pars Fortuna and many Arabic Parts.

Sprint 12 must introduce a dedicated sect/day-night helper before activating formulas that depend on day/night.

Initial policy:

- day/night status must be explicit;
- do not guess day/night from local clock only;
- prefer a horizon-aware method using the ready chart/houses result;
- document the method and validate it with fixtures;
- if day/night cannot be determined safely, formulas that require it return notReady.

Suggested initial rule for Sprint 12 validation:

- Day chart if Sun is above the horizon.
- Night chart if Sun is below the horizon.
- For supported house results, above horizon can be validated through Sun house assignment when the selected house system provides a reliable horizon relationship.
- If a method is ambiguous, fail closed and document the limitation.

Do not silently choose day formulas when night status is unknown.

## Pars Fortuna Policy

Pars Fortuna / Lot of Fortune is the first required lot.

Formula policy:

- Day chart: ASC + Moon - Sun
- Night chart: ASC + Sun - Moon

All longitudes are tropical zodiac longitudes normalized to `0 <= longitude < 360`.

Required inputs:

- ASC longitude;
- Sun longitude;
- Moon longitude;
- day/night status.

Output:

- ecliptic longitude;
- sign;
- degree / minute / second;
- formatted text;
- formula variant used: `day` or `night`;
- house assignment, if selected house system is ready.

Do not add interpretations.

## Basic Arabic Parts Policy

Basic Arabic Parts must be formula-verified before activation.

No Arabic Part may become active from memory alone.

Each active part must have:

- canonical key;
- Russian label;
- English/Latin label if useful;
- formula;
- day/night variant if applicable;
- required bodies/points;
- source note;
- verification status;
- tests and fixtures.

Suggested initial basic set:

1. Pars Fortuna / Lot of Fortune.
2. Lot of Spirit.
3. Optional additional lots only after formula source decision.

If formula sources are not yet verified, keep additional Arabic Parts deferred.

## Sprint Tasks

### Task 12.1 — House Cusps / Pars Fortuna / Arabic Parts Strategy

Docs-only strategy and formula policy.

### Task 12.2 — House Cusp Canonicalization / Fixtures

Create a canonical cusp output layer for selected house systems using existing Sprint 11 engines.

No new house math.

### Task 12.3 — Day / Night Chart Status Engine / Fixtures

Create a pure helper to determine day/night chart status safely.

No interpretations.

### Task 12.4 — Pars Fortuna Engine / Fixtures

Implement Pars Fortuna using verified day/night formula.

### Task 12.5 — Arabic Parts Source Decision / Formula Dataset

Decide which basic Arabic Parts are active and document formulas.

Docs/data decision first. No broad formula dumping.

### Task 12.6 — Basic Arabic Parts Engine / Fixtures

Calculate the approved basic Arabic Parts from verified formulas.

### Task 12.7 — Lots / Arabic Parts House Assignment

Assign calculated lots/parts to the selected house system.

### Task 12.8 — Lots / Arabic Parts Display Helper

Format Pars Fortuna and Arabic Parts results for UI.

### Task 12.9 — User-Facing UI

Add a collapsed UI block or extend an existing Houses block.

Recommended title:

```txt
Жребии и арабские части
```

or:

```txt
Pars Fortuna и арабские части
```

No interpretations.

### Task 12.10 — Debug

Safe debug/status for house cusps, day/night, Pars Fortuna, and Arabic Parts.

No raw birth data, coordinates, or full profile JSON.

### Task 12.11 — Sprint 12 Hardening

Final audit.

## PRO / Reasoning Requirements

PRO recommended / required:

- Task 12.1 — Strategy;
- Task 12.2 — House cusp canonicalization;
- Task 12.3 — Day / night engine;
- Task 12.4 — Pars Fortuna engine;
- Task 12.5 — Arabic Parts formula source decision;
- Task 12.6 — Arabic Parts engine;
- Task 12.7 — Lots / parts house assignment.

PRO not required unless issues appear:

- Task 12.8 — Display helper;
- Task 12.9 — UI;
- Task 12.10 — Debug;
- Task 12.11 — Hardening.

## Expected UI Outcome

By the end of Sprint 12, a ready profile should show a user-facing layer like:

```txt
Pars Fortuna и арабские части

Дневная карта
Pars Fortuna — Телец 12°34′56″ · 4 дом
Lot of Spirit — Скорпион 08°11′20″ · 10 дом
```

No interpretation text.

## Privacy Rules

UI/debug must not expose:

- raw birthDate;
- raw birthTime;
- utcDateTime;
- raw timezone;
- raw coordinates;
- full profile JSON;
- provider payload;
- raw internal calculation arrays.

Allowed:

- safe readiness status;
- selected house system label;
- formatted zodiac positions;
- house number;
- formula variant label: day/night;
- safe fallback messages.

## Sprint Exit Criteria

Sprint 12 is done only when:

- house cusp canonicalization is ready;
- day/night status is validated;
- Pars Fortuna is calculated from verified formula;
- basic Arabic Parts are formula-verified before activation;
- house assignment for lots/parts is validated;
- UI exists or approved UI integration is documented;
- debug is safe;
- tests pass;
- docs are synced;
- Sprint 13 is not started.
