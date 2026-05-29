# SPRINT_13_PLAN.md

## Sprint Name

Sprint 13 — Special Points Foundation

## Goal

Sprint 13 adds a controlled “special points” layer to the natal profile.

Target points:

- Lunar Nodes / Лунные узлы;
- Lilith / Black Moon Lilith, source-gated;
- Selena / White Moon, source-gated.

The sprint must not turn into an interpretation sprint. It creates calculation-ready points, house assignments, display, UI, debug, and hardening only for verified points.

## Current Foundation

The project already has:

- natal planet calculation;
- ASC / MC / DSC / IC;
- Whole Sign, Equal House, and Placidus houses;
- selected house system router;
- canonical house cusps;
- point/planet-in-house assignment patterns;
- Pars Fortuna and Lot of Spirit;
- safe profile UI patterns;
- safe debug patterns;
- manual birth coordinates.

Sprint 13 must reuse existing profile readiness, house-system, display, and privacy patterns.

## Core Scope

Sprint 13 includes:

- source/calculation strategy for Special Points;
- Lunar Nodes source and calculation policy;
- Lunar Nodes calculation engine and fixtures;
- Lunar Nodes house assignment;
- Lilith source decision and feasibility audit;
- Lilith engine only if source/calculation path is verified;
- Selena source decision and feasibility audit;
- Selena engine only if source/calculation path is verified;
- Special Points display helper;
- user-facing UI block;
- safe debug;
- final hardening.

## Non-Goals

Sprint 13 does not include:

- Fixed Stars;
- Arabic Parts Expansion Pack;
- Midpoints / Antiscia;
- Personal Transits;
- interpretations;
- ritual scoring;
- new house systems;
- geocoding;
- broad point catalogs without verification;
- changing existing house/Arabic Parts math unless a real bug is found.

## Status Policy

### Lunar Nodes

Lunar Nodes are the active target for Sprint 13.

However, the sprint must still decide:

- mean node vs true node;
- source/provider path;
- fixture strategy;
- whether South Node is derived as North Node + 180° after North Node policy is chosen.

Do not activate both mean and true nodes without an explicit product/source decision.

### Lilith

Lilith is source-gated.

Possible variants include:

- Mean Lilith;
- True / Osculating Lilith;
- Black Moon Lilith definitions used by different astrology tools.

Lilith must not be activated until variant and source policy are verified.

If source verification fails, Lilith remains deferred.

### Selena

Selena is source-gated.

Selena / White Moon is less standardized than Lunar Nodes. It requires explicit source/feasibility verification before activation.

If source verification fails, Selena remains deferred.

## Sprint Tasks

### Task 13.1 — Special Points Strategy

Docs-only strategy and sprint setup.

### Task 13.2 — Lunar Nodes Source / Calculation Policy

Decide source path and node type policy.

Expected outcome:

- active target: Lunar Nodes;
- clear mean/true node policy;
- South Node derivation policy;
- fixture and validation plan.

### Task 13.3 — Lunar Nodes Engine / Fixtures

Implement Lunar Nodes only after policy is clear.

Expected output:

- North Node;
- South Node;
- zodiac position with seconds;
- no interpretations.

### Task 13.4 — Lunar Nodes House Assignment

Assign nodes to the selected house system using numeric longitude and canonical cusps.

### Task 13.5 — Lilith Source Decision / Feasibility

Decide if Lilith can be activated.

Expected output:

- chosen variant if verified;
- source/fixture policy;
- or explicit deferred status.

### Task 13.6 — Lilith Engine / Fixtures, only if source verified

Implement Lilith only if Task 13.5 verifies source and calculation path.

If not verified, this task becomes a deferred-status audit rather than an engine implementation.

### Task 13.7 — Selena Source Decision / Feasibility

Decide if Selena can be activated.

Expected output:

- source/fixture policy;
- or explicit deferred status.

### Task 13.8 — Selena Engine / Fixtures, only if source verified

Implement Selena only if Task 13.7 verifies source and calculation path.

If not verified, this task becomes a deferred-status audit rather than an engine implementation.

### Task 13.9 — Special Points Display Helper

Format verified special points and their house assignments.

No interpretations.

### Task 13.10 — Special Points UI

Add a collapsed user-facing block inside “Мои карты”.

Recommended title:

```txt
Особые точки карты
```

### Task 13.11 — Special Points Debug

Safe debug/status only.

### Task 13.12 — Sprint 13 Hardening

Final audit and close Sprint 13.

## PRO / Reasoning Requirements

PRO required / recommended:

- Task 13.1 — Special Points Strategy;
- Task 13.2 — Lunar Nodes Source / Calculation Policy;
- Task 13.3 — Lunar Nodes Engine / Fixtures;
- Task 13.5 — Lilith Source Decision / Feasibility;
- Task 13.7 — Selena Source Decision / Feasibility.

PRO conditional:

- Task 13.6 — Lilith Engine / Fixtures, only if activated;
- Task 13.8 — Selena Engine / Fixtures, only if activated;
- Task 13.12 — Hardening, if Lilith/Selena were activated.

PRO not required unless issues appear:

- Task 13.4 — Lunar Nodes House Assignment;
- Task 13.9 — Display Helper;
- Task 13.10 — UI;
- Task 13.11 — Debug.

## Expected UI Outcome

By the end of Sprint 13, the user should see a collapsed block in “Мои карты”:

```txt
Особые точки карты
```

Possible ready output:

```txt
Северный узел — Лев 03°12′44″ · 7 дом
Южный узел — Водолей 03°12′44″ · 1 дом
```

If Lilith/Selena are not verified:

```txt
Lilith — отложено до проверки расчетной системы
Selena — отложено до проверки расчетной системы
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
- raw calculation arrays.

Allowed:

- formatted zodiac positions with seconds;
- house number;
- safe source/verification status;
- safe fallback/deferred messages.

## Sprint Exit Criteria

Sprint 13 is done only when:

- Lunar Nodes policy is documented;
- Lunar Nodes are either implemented and validated or explicitly blocked with reason;
- Lilith has source decision and active/deferred status;
- Selena has source decision and active/deferred status;
- verified active special points have fixtures;
- house assignment is validated for active points;
- display/UI/debug are safe;
- tests pass;
- docs are synced;
- Sprint 14 is not started.

## Roadmap After Sprint 13

- Sprint 14 — Fixed Stars.
- Sprint 15 — Arabic Parts Expansion Pack.
- Sprint 16 — Midpoints / Antiscia.
- Sprint 17 — Personal Transits.
- Sprint 18 — Interpretation Layer / Ritual Scores.
- Sprint 19 — Polish / UX / iPhone PWA / backup-security.
