# SPRINT_16_PLAN.md

## Sprint Name

Sprint 16 — Midpoints / Antiscia Foundation

## Goal

Sprint 16 adds a controlled, source-gated foundation for two related calculated-point layers:

- Midpoints / Срединные точки;
- Antiscia / Антисы;
- Contra-antiscia / Контрантисы, only if source policy verifies the scope.

The sprint goal is not interpretation. The goal is to create safe calculation layers, validation fixtures, display helpers, UI, debug, and final hardening while preserving existing privacy and architecture boundaries.

## Current Foundation

The project already has:

- natal planets;
- natal aspects;
- essential dignities;
- terms / decans / degree rulers;
- ASC / MC and houses;
- canonical house cusps;
- Pars Fortuna / Lot of Spirit;
- Vronsky Arabic Points;
- Lunar Nodes / Lilith / Selena;
- Fixed Stars;
- profile-level UI/debug patterns;
- strict privacy guardrails.

Sprint 16 must reuse existing natal/profile outputs. It must not recalculate existing natal planets, angles, houses, Arabic Parts, Special Points, or Fixed Stars in new independent ways.

## Scope

Sprint 16 includes:

- source / formula / scope policy for Midpoints, Antiscia, and Contra-antiscia;
- target set selection;
- midpoint calculation engine;
- midpoint validation fixtures;
- antiscia / contra-antiscia calculation engine;
- antiscia validation fixtures;
- display helper;
- UI block;
- safe debug;
- final hardening.

## Non-Goals

Sprint 16 does not include:

- interpretations;
- psychological claims;
- predictive claims;
- ritual scoring;
- Personal Transits;
- new planets;
- new house systems;
- Arabic Parts expansion;
- Fixed Stars expansion;
- broad midpoint trees;
- midpoint pictures / Uranian combinations;
- all possible midpoint-to-planet hits unless explicitly source-approved;
- aspect detection to midpoints unless explicitly deferred for a later sprint.

## Initial Scope Recommendation

### Midpoints

Recommended first active target set:

```txt
natal planets only
```

Initial calculation:

```txt
pairwise midpoint between natal planets
```

For 10 natal planets, this yields 45 midpoint pairs.

Deferred midpoint targets unless explicitly approved:

- ASC / MC / DSC / IC;
- house cusps;
- Lunar Nodes;
- Lilith;
- Selena;
- Pars Fortuna;
- Lot of Spirit;
- Vronsky Arabic Points;
- Fixed Stars;
- custom points.

Deferred midpoint relationship layers:

- midpoint-to-planet conjunctions;
- midpoint trees;
- midpoint axes with interpretive combinations;
- harmonic midpoint pictures.

### Antiscia / Contra-antiscia

Recommended first active target set:

```txt
natal planets + ASC / MC / DSC / IC
```

Reason:

- the calculation is per-point rather than pairwise;
- angles are commonly useful as sensitive points;
- the output remains compact.

Deferred antiscia targets:

- house cusps;
- Lunar Nodes;
- Lilith;
- Selena;
- Arabic Parts;
- Fixed Stars;
- custom points.

## Source-Gated Formula Policy

No formula becomes active until Task 16.2 verifies it.

Candidate formula policies to verify in Task 16.2:

- midpoint longitude from the shortest arc between two longitudes;
- whether midpoint axis includes the opposite point;
- antiscion across the Cancer–Capricorn solstice axis;
- contra-antiscion across the Aries–Libra equinox axis;
- tropical zodiac basis;
- normalization `0 <= longitude < 360`.

Task 16.2 must decide exact formulas before any engine implementation.

## Task List

### Task 16.1 — Midpoints / Antiscia Strategy

Docs-only sprint setup.

### Task 16.2 — Midpoints / Antiscia Source / Formula / Scope Policy

Decide formulas, target sets, output shape, and deferred boundaries.

### Task 16.3 — Midpoint Target Resolver / Fixtures

Create a safe target resolver for midpoint calculations.

No midpoint engine yet.

### Task 16.4 — Midpoint Engine / Fixtures

Calculate selected midpoint pairs.

No interpretations and no midpoint-to-planet hit detection.

### Task 16.5 — Midpoint Validation / Cross-Checks

Validate pair counts, midpoint math, wrap-around, ordering, privacy, and strict exclusions.

### Task 16.6 — Antiscia Target Resolver / Fixtures

Create a safe target resolver for antiscia / contra-antiscia calculations.

### Task 16.7 — Antiscia / Contra-antiscia Engine / Fixtures

Calculate antiscia and contra-antiscia only for verified target set.

### Task 16.8 — Antiscia Validation / Cross-Checks

Validate mirror axes, wrap-around, target scope, privacy, and strict exclusions.

### Task 16.9 — Midpoints / Antiscia Display Helper

Format already calculated midpoint and antiscia results.

No interpretations.

### Task 16.10 — Midpoints / Antiscia UI

Add a collapsed user-facing block inside “Мои карты”.

Recommended title:

```txt
Срединные точки и антисы
```

### Task 16.11 — Midpoints / Antiscia Debug

Safe debug/status only under existing debug mode.

### Task 16.12 — Sprint 16 Hardening

Final audit and close Sprint 16.

## PRO / Reasoning Requirements

PRO required / recommended:

- Task 16.1 — Strategy;
- Task 16.2 — Source / Formula / Scope Policy;
- Task 16.3 — Midpoint Target Resolver if angle/custom target scope expands;
- Task 16.4 — Midpoint Engine;
- Task 16.5 — Midpoint Validation;
- Task 16.7 — Antiscia / Contra-antiscia Engine;
- Task 16.8 — Antiscia Validation;
- Task 16.12 — Hardening if formula or target scope becomes complex.

PRO not required unless issues appear:

- Task 16.6 — Antiscia Target Resolver if scope remains simple;
- Task 16.9 — Display Helper;
- Task 16.10 — UI;
- Task 16.11 — Debug.

## Expected UI Outcome

By the end of Sprint 16, the user should see a collapsed block in “Мои карты”:

```txt
Срединные точки и антисы
```

Possible output:

```txt
Срединные точки

Солнце / Луна — Весы 12°34′56″
Венера / Марс — Рак 03°11′20″

Антисы

Солнце — антис: Дева 14°22′10″
ASC — контрантис: Рыбы 15°12′31″
```

No interpretations.

## Privacy Rules

UI/debug must not expose:

- raw birthDate;
- raw birthTime;
- utcDateTime;
- raw timezone;
- raw coordinates;
- full profile JSON;
- provider payload;
- raw source arrays;
- raw calculation arrays.

Allowed:

- safe target labels;
- formatted zodiac positions with seconds;
- source/scope notes;
- safe fallback messages;
- counts and statuses in debug.

## Sprint Exit Criteria

Sprint 16 is done only when:

- formula/source policy is documented;
- target scope is explicit;
- midpoint engine is validated;
- antiscia / contra-antiscia engine is validated if activated;
- UI has no interpretations;
- debug is safe;
- tests pass;
- docs are synced;
- Sprint 17 is not started.

## Roadmap After Sprint 16

- Sprint 17 — Personal Transits.
- Sprint 18 — Interpretation Layer / Ritual Scores.
- Sprint 19 — Polish / UX / iPhone PWA / backup-security.
