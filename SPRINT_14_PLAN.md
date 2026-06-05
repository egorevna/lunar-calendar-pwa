# SPRINT_14_PLAN.md

## Sprint Name

Sprint 14 — Fixed Stars Foundation

## Goal

Sprint 14 adds a controlled Fixed Stars layer to the natal profile.

The sprint goal is not interpretation. The goal is to create:

- a verified fixed star source/catalog policy;
- a source-tracked fixed star catalog dataset;
- a clear epoch/precession/longitude policy;
- a conjunction-only detection engine;
- target selection for already calculated natal/profile points;
- display, UI, debug, and hardening.

## Current Foundation

The project already has:

- natal planets;
- natal aspects;
- essential dignities;
- detailed dignities;
- ASC / MC / houses;
- canonical house cusps;
- Pars Fortuna and Lot of Spirit;
- Special Points:
  - mean Lunar Nodes;
  - Mean Lilith;
  - Selena / White Moon;
- profile-level UI/debug patterns;
- manual birth coordinates;
- privacy guardrails.

Sprint 14 must reuse existing chart/profile outputs. It must not recalculate existing natal planets, angles, houses, Arabic Parts, or Special Points.

## Scope

Sprint 14 includes:

- Fixed Stars source strategy;
- source/catalog decision;
- star catalog dataset;
- position/epoch/precession policy;
- target resolver for fixed-star checks;
- conjunction engine;
- validation fixtures;
- display helper;
- user-facing UI block;
- safe debug;
- final hardening.

## Non-Goals

Sprint 14 does not include:

- Fixed Star interpretations;
- mythology text;
- predictive claims;
- ritual scoring;
- personal transits;
- new planets or points;
- new house systems;
- Arabic Parts expansion;
- Midpoints / Antiscia;
- changing existing natal/house/special-points engines unless a real bug is found.

## Initial Fixed Stars Policy

The initial active relationship type should be:

```txt
fixed star conjunctions only
```

Deferred:

- oppositions;
- squares;
- trines;
- paran relationships;
- heliacal phenomena;
- star-rise/set calculations;
- interpretation scoring.

## Source-Gated Catalog Policy

Do not activate a fixed star unless its catalog row is source-verified.

Every active star row must include:

- stable key;
- Russian label;
- English/Latin label;
- source metadata;
- position source;
- epoch / coordinate policy;
- active flag;
- verification status;
- no interpretation text.

No star may be activated from memory.

## Position / Epoch Policy

Sprint 14 must explicitly decide how star positions are represented.

Allowed decision paths:

1. Verified static ecliptic longitudes for a documented epoch plus documented precession policy.
2. Verified RA/Dec source data with a browser-safe conversion to ecliptic longitude.
3. A validated local static fixture path for already computed tropical ecliptic longitudes.

The project must not silently mix epochs.

The user-facing output must display zodiac position with seconds.

## Target Policy

Initial possible targets:

- natal planets;
- ASC / MC / DSC / IC;
- selected active Special Points;
- selected active Arabic Parts.

Task 14.2 / 14.5 must decide the first active target set.

Recommended first target set for Sprint 14:

```txt
natal planets + ASC / MC / DSC / IC
```

Deferred unless explicitly approved:

- house cusps;
- Arabic Parts;
- Special Points;
- all target categories mixed without clear UI grouping.

## Orb Policy

Orb policy must be explicit.

Do not use a vague “near” rule.

Initial recommendation for source decision:

```txt
conjunction orb must be source-policy controlled
```

Candidate policies:

- one global orb;
- per-star orb;
- per-target orb;
- strict default plus per-star overrides.

No default should be active until Task 14.2 documents it.

## Sprint Tasks

### Task 14.1 — Fixed Stars Strategy

Docs-only sprint setup.

### Task 14.2 — Fixed Stars Source / Catalog / Orb Policy

Decide initial catalog source, coordinate/epoch policy, and active orb policy.

### Task 14.3 — Fixed Star Catalog Dataset / Fixtures

Create source-tracked dataset and catalog fixtures.

No conjunction engine yet.

### Task 14.4 — Fixed Star Position / Epoch Engine

Create pure helper to expose active star positions for requested chart date/epoch policy.

If positions are static for Sprint 14, document and validate that.

### Task 14.5 — Fixed Star Target Resolver

Resolve safe profile targets for fixed-star conjunction checks.

No star matching yet.

### Task 14.6 — Fixed Star Conjunction Engine / Fixtures

Detect conjunctions between active stars and active target set.

Conjunction-only.

### Task 14.7 — Fixed Star Validation / Cross-Checks

Hard validation fixtures for catalog rows, target rows, conjunction boundaries and privacy.

### Task 14.8 — Fixed Stars Display Helper

Format already calculated fixed-star hits.

No interpretations.

### Task 14.9 — Fixed Stars UI

Add a collapsed block in “Мои карты”.

Recommended title:

```txt
Неподвижные звезды
```

### Task 14.10 — Fixed Stars Debug

Safe debug/status only.

### Task 14.11 — Sprint 14 Hardening

Final audit and close Sprint 14.

## PRO / Reasoning Requirements

PRO required / recommended:

- Task 14.1 — Strategy;
- Task 14.2 — Source / Catalog / Orb Policy;
- Task 14.3 — Catalog Dataset;
- Task 14.4 — Position / Epoch Engine;
- Task 14.6 — Conjunction Engine;
- Task 14.7 — Validation / Cross-Checks.

PRO conditional:

- Task 14.5 — Target Resolver, if target scope includes Special Points or Arabic Parts.
- Task 14.11 — Hardening, if catalog/position policy was complex.

PRO not required unless issues appear:

- Task 14.8 — Display Helper;
- Task 14.9 — UI;
- Task 14.10 — Debug.

## Expected UI Outcome

By the end of Sprint 14, the user should see a collapsed block in “Мои карты”:

```txt
Неподвижные звезды
```

Possible ready output:

```txt
Неподвижные звезды

Регул — соединение с ASC · орб 0°12′34″
Спика — соединение с Венерой · орб 0°23′10″
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

- safe target labels;
- fixed star labels;
- formatted zodiac positions with seconds;
- orb text;
- safe source label;
- safe fallback messages.

## Sprint Exit Criteria

Sprint 14 is done only when:

- source/catalog policy is documented;
- active star catalog is source-tracked;
- epoch/precession policy is explicit;
- active orb policy is explicit;
- conjunction engine is validated;
- UI has no interpretations;
- debug is safe;
- tests pass;
- docs are synced;
- Sprint 15 is not started.

## Roadmap After Sprint 14

- Sprint 15 — Arabic Parts Expansion Pack.
- Sprint 16 — Midpoints / Antiscia.
- Sprint 17 — Personal Transits.
- Sprint 18 — Interpretation Layer / Ritual Scores.
- Sprint 19 — Polish / UX / iPhone PWA / backup-security.
