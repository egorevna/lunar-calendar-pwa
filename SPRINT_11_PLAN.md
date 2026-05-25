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

## House Systems Scope And Default Policy

Sprint 11 targets three separate house systems:

1. Whole Sign / `whole-sign`;
2. Equal House / `equal-house` / равнодомная;
3. Placidus / `placidus`.

System separation rules:

- these systems must not be mixed;
- every result must include a `houseSystem` label;
- UI/debug must always show the selected house system;
- Whole Sign must not be called Placidus;
- Equal House must not be called Placidus;
- Placidus must not be approximated by Equal House;
- no system may silently fall back to another system without explicit `status` / `reason`.

Default policy:

- default initial UI may use Whole Sign only when the profile has no saved house system selection;
- internal APIs should be system-aware from the beginning;
- user-facing UI must not imply only one house system exists;
- the existing profile-level house system selection must not be silently overridden.

Initial label:

```txt
whole-sign
```

Supported / target labels:

```txt
whole-sign
equal-house
placidus
```

Placidus implementation requires a separate dependency / calculation audit and benchmark validation. If no validated path is found, Placidus must remain explicit `unsupported` / deferred instead of being silently replaced.

## Profile House System Selection Policy

The profile form already includes a user-facing `Система домов` field. Future house calculations must treat the saved profile-level `houseSystem` value as the source of truth.

Current stored profile values:

- `wholeSign` — Whole Sign;
- `equal` — Equal House / Равнодомная;
- `placidus` — Placidus.

Future engines should normalize profile values into canonical calculation keys:

- `wholeSign` -> `whole-sign`;
- `equal` -> `equal-house`;
- `placidus` -> `placidus`.

Selected system behavior:

- `whole-sign` uses the Whole Sign engine;
- `equal-house` uses the Equal House / Равнодомная engine;
- `placidus` uses the Placidus engine only when Placidus is validated and supported;
- if the user selected Placidus but Placidus is not yet validated / supported, return `status: "unsupported"` with `reason: "placidusNotValidated"`;
- never silently fallback from Placidus to Whole Sign;
- never silently fallback from Placidus to Equal House;
- never silently fallback from Equal House to Whole Sign.

All future house calculation outputs must include `houseSystem`. User-facing UI and debug must show the selected house system in safe human-readable form.

## Zodiac Longitude Reference vs House System Anchor

All systems use the same zodiac longitude coordinate scale:

- 0° Aries = 0° zodiac longitude;
- planets, ASC, MC and house cusps are normalized to `0 <= longitude < 360`;
- this coordinate reference is not the same thing as a house-system anchor.

Whole Sign:

- house anchor = ASC sign;
- House 1 = the entire ASC sign;
- the cusp-like sign boundary for House 1 is 0° of the ASC sign, not necessarily 0° Aries.

Equal House / Равнодомная:

- house anchor = exact ASC longitude;
- cusp 1 = ASC longitude;
- cusp N = `normalize(ASC longitude + (N - 1) * 30°)`;
- this is not Placidus and does not start at 0° Aries unless ASC itself is exactly 0° Aries.

Placidus:

- house cusps are calculated by Placidus geometry;
- ASC = cusp 1;
- MC = cusp 10;
- cusp longitudes are measured on the zodiac scale where 0° Aries = 0°;
- 0° Aries is the coordinate reference, not the Placidus house anchor.

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

### Task 11.4a — House Systems Strategy / Dependency Audit

Docs-only strategy update before house engine implementation.

Responsibilities:

- expand Sprint 11 target systems to Whole Sign, Equal House and Placidus;
- audit current dependencies / vendor files for Placidus and house-cusp support;
- clarify zodiac longitude reference vs house-system anchors;
- split implementation tasks by system.

No code.

### Task 11.4b — Whole Sign Houses Engine

Pure house system engine.

Expected module:

```txt
src/houses.js
```

Responsibilities:

- calculate Whole Sign only;
- House 1 = ASC sign;
- each house = one full zodiac sign;
- return house system label;
- return house sequence.

No UI.

### Task 11.4c — Equal House Engine

Pure Equal House engine.

Responsibilities:

- calculate Equal House only;
- cusp 1 = exact ASC longitude;
- cusp N = `normalize(ASC longitude + (N - 1) * 30°)`;
- handle zodiac wrap-around;
- return `houseSystem: "equal-house"`;
- do not call Equal House Placidus.

No UI.

### Task 11.4d — Placidus Engine / Validated Integration

Placidus implementation target only if a validated path exists.

Responsibilities:

- inspect verified dependency or local algorithm path;
- require benchmark fixtures before ready support;
- return safe unsupported state for invalid / high-latitude / circumpolar cases;
- never silently fallback to Equal House or Whole Sign;
- if no validated path exists, create explicit deferred / unsupported policy and tests.

No UI.

### Task 11.4e — House System Resolver / Selected System Router

System-aware router for the selected profile or explicit house system.

Responsibilities:

- read selected house system from profile or explicit input;
- normalize current profile values (`wholeSign`, `equal`, `placidus`) into canonical keys (`whole-sign`, `equal-house`, `placidus`);
- call the correct supported engine;
- return explicit `unsupported` for unsupported selected systems;
- never silently fallback to another house system;
- always include `houseSystem` in the result.

No UI.

### Task 11.5 — Houses Validation / Fixtures for Whole Sign / Equal House / Placidus

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
- Equal House cusp sequence and wrap-around;
- Placidus ready fixtures only if validated;
- Placidus unsupported fixtures if deferred;
- no NaN;
- no raw birth data.

No private birth data.

### Task 11.6 — Planet-in-House Assignment for Selected House System

Assign ready natal planets to houses.

Must handle:

- Whole Sign by planet sign relative to ASC sign;
- Equal House by longitude comparison against wrapped cusps;
- Placidus by longitude comparison against Placidus cusps if available;
- explicit unsupported Placidus if deferred;
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

## Reasoning Requirements

PRO-level reasoning is recommended / required for:

- Task 11.4a;
- Task 11.4b;
- Task 11.4c;
- Task 11.4d;
- Task 11.4e;
- Task 11.5;
- Task 11.6.

PRO-level reasoning is not required unless issues appear for:

- Task 11.7;
- Task 11.8;
- Task 11.9;
- Task 11.10.

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

- Task 11.4a — House Systems Strategy / Dependency Audit;
- Task 11.4b — Whole Sign Houses Engine;
- Task 11.4c — Equal House Engine;
- Task 11.4d — Placidus Engine / Validated Integration;
- Task 11.4e — House System Resolver / Selected System Router;
- Task 11.5 — Houses Validation / Fixtures for Whole Sign / Equal House / Placidus;
- Task 11.6 — Planet-in-House Assignment for Selected House System.

PRO not required unless issues appear:

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
