# SPRINT_11_PLAN.md

## Sprint Name

Sprint 11 — Houses / ASC / MC

## Goal

Sprint 11 adds the personal chart grid layer:

- ASC / Ascendant / Асцендент;
- MC / Midheaven / Медиум Цели;
- DSC / Descendant / Десцендент;
- IC / Imum Coeli / Надир;
- houses / дома;
- planet-in-house assignment.

This sprint is a calculation and structure layer, not an interpretation layer.

The result of Sprint 11 becomes the foundation for later work:

- House Cusps;
- Pars Fortuna;
- Arabic Parts;
- Fixed Stars;
- Personal Transits;
- Personal Recommendations;
- Interpretation Layer / Ritual Scores.

## Scope

Sprint 11 includes:

- Houses / ASC / MC source and calculation strategy;
- birth input readiness and guardrails;
- ASC / MC calculation policy;
- initial house system policy;
- house engine;
- planet-in-house assignment;
- display helper;
- collapsible UI block;
- safe debug;
- sprint hardening.

## Non-Goals

Sprint 11 does not include:

- Pars Fortuna;
- Arabic Parts;
- Fixed Stars;
- Lunar Nodes;
- Lilith;
- Selena;
- Midpoints;
- Antiscia;
- Personal Transits;
- Interpretations;
- Ritual Scores;
- Desktop redesign;
- backup / sync / subscription logic.

## Required Input Policy

ASC / MC / houses must only be calculated when the profile has enough validated birth data.

Policy:

1. Exact birth time + city/place with coordinates → calculate ASC / MC / houses.
2. No birth time → do not calculate ASC / MC / houses.
3. No coordinates → ask the user to select a city or manually enter coordinates.
4. Country / region only → do not calculate ASC / MC / houses.
5. City name without coordinates → require city lookup or manual coordinates before calculation.
6. Birth hospital precision is not required for normal mode. City-level coordinates are acceptable unless the user explicitly wants professional precision.

## Birth Time Accuracy Policy

- Exact birth time is required for user-facing ASC / MC / houses in Sprint 11.
- Unknown birth time blocks ASC / MC / houses.
- Approximate birth time remains deferred unless an explicit approximate-mode policy is added later.
- Do not fake houses from a noon birth time.
- Do not silently assume `12:00`.
- Do not calculate houses for “Общий день”.

## Coordinate Precision Policy

- City-level latitude/longitude is acceptable for normal mode.
- Exact hospital coordinates are optional.
- If birth place has a name but no coordinates, houses are not ready.
- If only country/region exists, houses are not ready.
- Future UX may support city lookup or manual coordinate input.

## Initial House System Policy

Sprint 11 should start with a safe, clearly labeled house system.

Recommended initial policy:

- If no verified reliable quadrant house-cusp calculation is available in current dependencies, use Whole Sign houses as the first supported house assignment model.
- ASC and MC are still calculated as angles.
- Exact quadrant house cusps / Placidus-like systems should be deferred to Sprint 12 or a separately verified calculation task unless current project dependencies already provide validated house-cusp support.
- Never label Whole Sign houses as Placidus.
- Always expose the `houseSystem` label in UI/debug.

Initial label:

```txt
whole-sign
```

Future labels may include:

```txt
placidus
porphyry
equal-house
```

Only add future systems after separate validation.

## Sprint Tasks

### Task 11.1 — Houses / ASC / MC Strategy

Docs-only source/calculation policy.

Expected result:

- `SPRINT_11_PLAN.md`;
- `HOUSES_ASC_MC_STRATEGY.md`;
- TODO / PROJECT_STATE / CHANGELOG / ASTRO_LOGIC updates.

No code.

### Task 11.2 — Birth Input / Coordinates Guardrails

Create readiness logic for houses/ASC/MC.

Responsibilities:

- exact birth time check;
- coordinate availability check;
- country/region-only fallback;
- city-without-coordinates fallback;
- safe not-ready states.

No ASC/MC calculation yet.

### Task 11.3 — ASC / MC Calculation Engine

Pure calculation engine.

Expected module:

```txt
src/ascMc.js
```

Responsibilities:

- validate input;
- calculate ASC;
- calculate MC;
- derive DSC;
- derive IC;
- format safe internal result.

No UI.

### Task 11.4 — Houses Engine

Pure house system engine.

Expected module:

```txt
src/houses.js
```

Responsibilities:

- calculate selected house model;
- start with Whole Sign unless a validated quadrant method is approved;
- return house system label;
- return house sequence.

No UI.

### Task 11.5 — Houses Validation / Fixtures

Synthetic/manual fixtures.

Coverage:

- exact time + coordinates;
- missing time;
- missing coordinates;
- country/region only;
- city without coordinates;
- ASC near 0°/29°;
- MC near 0°/29°;
- DSC/IC wrap-around;
- Whole Sign house sequence;
- no NaN;
- no raw birth data.

No private birth data.

### Task 11.6 — Planet-in-House Assignment

Assign ready natal planets to houses.

For Whole Sign:

- determine house by planet sign relative to ASC sign;
- do not mutate natal planet objects;
- ignore invalid planets safely;
- no interpretations.

### Task 11.7 — Houses / ASC / MC Display Helper

Format already calculated results.

Expected output examples:

```txt
ASC — Овен 14°22′
MC — Козерог 03°18′
DSC — Весы 14°22′
IC — Рак 03°18′
Солнце — 9 дом
Луна — 6 дом
```

No interpretation.

### Task 11.8 — Houses / ASC / MC Collapsible UI

Add collapsed block inside “Мои карты”.

Recommended order:

1. Натальные планеты
2. Натальные аспекты
3. Достоинства планет
4. Термы, деканы и градусы
5. Дома и углы карты

Collapsed by default.

### Task 11.9 — Houses / ASC / MC Debug

Safe `?debug=1` status/counts only.

Allowed:

- exact birth time ready: true/false;
- coordinates ready: true/false;
- house system;
- ASC ready: true/false;
- MC ready: true/false;
- houses ready: true/false;
- planet-in-house count.

Not allowed:

- raw birth date;
- raw birth time;
- raw coordinates;
- raw UTC datetime;
- full profile JSON.

### Task 11.10 — Sprint 11 Hardening

Final audit.

Check:

- no fake ASC / MC / houses;
- unknown birth time blocks houses;
- no coordinates blocks houses;
- house system is explicitly labeled;
- source/calculation boundaries are preserved;
- UI/debug are privacy-safe;
- tests pass;
- docs are synced;
- Sprint 12 not started.

## PRO / Reasoning Requirements

PRO recommended / required:

- Task 11.1 — Strategy;
- Task 11.3 — ASC / MC engine;
- Task 11.4 — Houses engine;
- Task 11.5 — Validation / fixtures;
- Task 11.6 — Planet-in-house assignment.

PRO not required unless issues appear:

- Task 11.2 — Guardrails;
- Task 11.7 — Display helper;
- Task 11.8 — UI;
- Task 11.9 — Debug;
- Task 11.10 — Hardening.

## Expected UI Outcome

By the end of Sprint 11, the user should see a collapsed block in “Мои карты”:

```txt
Дома и углы карты
```

Expanded example:

```txt
ASC — Овен 14°22′
MC — Козерог 03°18′
DSC — Весы 14°22′
IC — Рак 03°18′

Солнце — 9 дом
Луна — 6 дом
Марс — 10 дом
```

No interpretations.

## Privacy Rules

User-facing UI and debug must not expose:

- raw birthDate;
- raw birthTime;
- utcDateTime;
- raw timezone;
- raw coordinates;
- full profile JSON;
- raw provider data.

Allowed:

- safe status;
- house system label;
- formatted ASC/MC/DSC/IC positions;
- formatted house number per planet;
- readiness/fallback messages.

## Sprint Exit Criteria

Sprint 11 is done only when:

- strategy is documented;
- no fake ASC / MC / houses;
- unknown birth time blocks houses;
- no coordinates blocks houses;
- house system is explicitly labeled;
- ASC / MC engine is validated;
- houses engine is validated;
- planet-in-house assignment is validated;
- UI collapsed block exists;
- debug is safe;
- tests pass;
- docs are synced.
