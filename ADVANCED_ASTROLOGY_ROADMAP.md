# ADVANCED_ASTROLOGY_ROADMAP.md

# Astro PWA — Advanced Astrology Roadmap

## Purpose

This document captures future advanced astrology modules for Astro PWA.

It is a roadmap document only.

It does not activate implementation work.
It does not change the current active sprint.
It does not replace `TODO.md`.

Do not implement any module from this document until it is explicitly moved into `TODO.md`.

Current active sprint remains whatever `PROJECT_STATE.md` and `TODO.md` define.

---

## Core Principle

Calculation first, interpretation second.

Astro PWA must not show user-facing astrological values unless the underlying calculation or lookup dataset is reliable, source-tracked, and tested.

Rules:

- Do not fake calculations.
- Do not OCR-import dense tables blindly.
- Do not show unsupported values as if they are calculated.
- Treat source-specific tables as datasets, not as formulas.
- Every dataset must have a source reference.
- Every boundary degree must be tested.
- Coordinate calculations must come from the astronomy/natal engine.
- Tables such as terms, decans, degree rulers, fixed star qualities, and dignity systems are lookup layers applied after coordinates are calculated.

---

## UI Disclosure Rule

Future advanced profile/natal modules must not turn `Мои карты` into a long always-open list.

All large profile/natal sections should be collapsible by default, including:

- Натальные планеты;
- Натальные аспекты;
- Достоинства планет;
- Термы / деканы / управители градусов;
- Дома / ASC / MC;
- Куспиды домов / Парс Фортуны / арабские точки;
- Фиксированные звезды;
- Лунные узлы / Лилит / Селена;
- Мидпоинты / антисы.

Collapsed sections should show only:

- title;
- short summary;
- `Показать` / `Развернуть` control.

Expanded sections may show the full list and should switch the control to `Скрыть` / `Свернуть`.

When the active profile changes, advanced sections should reset to collapsed state. When `Общий день` is selected, profile-specific sections should reset or hide.

Readiness/fallback copy may remain visible when it is short and important. User-facing values must still pass validation and readiness checks before display, and raw technical data must stay hidden.

---

## Current Foundation

Completed foundation layers include:

- main lunar dashboard;
- profiles / “Мои карты”;
- active profile;
- local-first storage;
- profile import/export;
- natal calculation engine foundation;
- astrology math primitives;
- astronomy-engine provider layer;
- validated geocentric tropical longitudes for 10 natal planets;
- validated speed / retrograde in provider layer;
- debug guardrails;
- explicit unsupported states for houses, ASC/MC, transits, aspects, orbs, and chart UI.

Provider-layer validated bodies:

- Sun
- Moon
- Mercury
- Venus
- Mars
- Jupiter
- Saturn
- Uranus
- Neptune
- Pluto

Still not user-facing by default until Sprint 7 decides readiness and UI placement.

---

## Suggested Future Sprint Order

### Sprint 7 — Natal Planets UI / Read-only Natal Positions

Goal:

Show safe read-only natal planet positions only if input readiness allows it.

Scope:

- natal planet display helper;
- readiness UI;
- no chart wheel;
- no houses;
- no ASC/MC;
- no personal transits;
- no aspects/orbs.

---

### Sprint 8 — Natal Aspects Foundation

Goal:

Calculate aspects between natal planets.

Scope:

- major aspects first;
- optional minor aspects later;
- aspect orbs;
- aspect sorting / priority;
- no interpretation until calculation is tested.

Major aspects:

- conjunction 0°
- sextile 60°
- square 90°
- trine 120°
- opposition 180°

Minor aspects later:

- semisextile 30°
- semisquare 45°
- quintile 72°
- sesquiquadrate 135°
- quincunx 150°
- decile 36°
- tredecile 108°
- biquintile 144°

Source note:

The user provided a Vronsky aspect table screenshot:

- `Таблица 10. Аспекты`

This table can inform display naming / symbols / categories later, but aspect math must come from longitude calculations.

---

### Sprint 9 — Essential Dignities: Domicile, Exile, Exaltation, Fall

Goal:

Add basic essential dignity flags for natal planets.

Scope:

- domicile / rulership;
- exile / detriment;
- exaltation;
- fall;
- planetary strength flags;
- optional score model.

Source note:

The user provided Vronsky screenshots including:

- `Таблица 4. Сила влияния планет`
- exaltation degree table below it.

These should be treated as source-specific datasets.

Implementation rule:

1. Calculate planet longitude.
2. Determine sign and degree.
3. Apply dignity lookup.
4. Return dignity flags and optional score.

Do not mix lookup tables with coordinate calculation.

---

### Sprint 10 — Terms / Decans / Degree Rulers

Goal:

Add detailed dignity sublayers.

Submodules:

1. Terms / Термы
2. Decans / Деканаты
3. Degree Rulers / Управление градусами
4. Degree Rulers by Star of the Magi / Звезда Магов

#### Terms / Термы

The user provided:

- `Таблица 5. Термы`

This table contains:

- zodiac sign;
- degree intervals inside the sign;
- planet ruler of the term;
- strength / score values.

Implementation rule:

1. Calculate planet longitude.
2. Determine sign.
3. Determine degree inside sign.
4. Lookup term ruler and score.
5. Return term dignity.

Important:

Dense table OCR is not reliable enough.
Manual verification is required.

Boundary tests required:

- 0°
- exact interval boundaries;
- last degree before sign boundary;
- 29°59′.

#### Decans / Деканаты

The user mentioned:

- management by Star of the Magi;
- management by triplicities / trigons.

These systems must be explicitly selected before implementation.

Potential datasets:

- Chaldean / Star of the Magi decans;
- trigon-based decans;
- Vronsky-specific table if used.

#### Degree Rulers / Управление градусами

The user provided:

- `Таблица 7. Управление градусами (по С. Вронскому)`

This is a degree-by-degree lookup table.

Implementation rule:

- do not OCR-import blindly;
- convert to structured dataset manually;
- test all sign boundaries and sample degrees.

#### Degree Rulers by Star of the Magi

The user provided:

- `Таблица 6. Управление градусами по Звезде Магов`

This is a separate source-specific degree ruler system.

It must not be confused with Table 7.

---

### Sprint 11 — Houses / ASC / MC

Goal:

Add reliable house and angle calculation.

Scope:

- Ascendant;
- Midheaven;
- house cusps;
- supported house systems;
- readiness guardrails.

House systems to consider:

- Whole Sign
- Equal
- Placidus

Rules:

- If birth time is unknown, ASC/MC and houses are unsupported.
- If coordinates are missing, ASC/MC and houses are unsupported.
- If timezone conversion is not reliable, ASC/MC and houses are unsupported.
- High-latitude behavior must be handled explicitly.

No fake houses.

---

### Sprint 12 — House Cusps + Pars Fortuna + Basic Arabic Parts

Goal:

Add calculated derived points after ASC/houses exist.

Submodules:

1. House cusps
2. Pars Fortuna / Part of Fortune
3. Basic Arabic Parts / Жребии

#### Pars Fortuna

Requires:

- ASC;
- Sun;
- Moon;
- day/night chart logic.

Do not calculate before ASC and day/night logic are reliable.

#### Arabic Parts / Жребии

The user provided a table screenshot with formulas involving:

- ASC;
- Moon;
- Jupiter;
- Venus;
- Saturn;
- Mars;
- Mercury;
- house cusps;
- house rulers.

This belongs after:

- natal planets;
- ASC;
- house cusps;
- house rulers;
- day/night logic if required.

Do not implement from screenshot OCR directly.

---

### Sprint 13 — Fixed Stars

Goal:

Add fixed star conjunctions to natal points.

The user provided Vronsky fixed star screenshots:

- `Таблица 18. Неподвижные звёзды`

The table appears to include:

- sign;
- star name;
- magnitude;
- designation;
- coordinates for multiple epochs;
- quality / planetary nature.

Example stars from screenshots:

- Algol / Альголь
- Aldebaran / Альдебаран
- Rigel / Ригель
- Betelgeuse / Бетельгейзе
- Sirius / Сириус
- Canopus / Канопус
- Castor / Кастор
- Pollux / Поллукс
- Procyon / Процион
- Regulus / Регул
- Spica / Спика
- Antares / Антарес
- Vega / Вега
- Altair / Альтаир
- Fomalhaut / Фомальгаут
- Markab / Маркаб
- Scheat / Шеат

Implementation needs:

- star catalog;
- epoch;
- precession;
- longitude calculation or trusted epoch lookup;
- orbs;
- conjunction-only MVP;
- points to check:
  - planets;
  - ASC;
  - MC;
  - house cusps later;
  - Pars Fortuna later.

Rules:

- No fake star conjunctions.
- Do not use outdated star coordinates without precession handling.
- Keep orb small and explicit.
- Use source reference per star dataset.

---

### Sprint 14 — Special Points: Lunar Nodes / Lilith / Selena

Goal:

Add selected non-planetary natal points.

Submodules:

1. Lunar Nodes
2. Black Moon / Lilith
3. White Moon / Selena

#### Lunar Nodes

Decision required:

- Mean Node
- True Node

South Node is generally opposite North Node.

Must be provider-backed or formula-backed and tested.

#### Lilith / Black Moon

Decision required:

- Mean Lilith
- True / Osculating Lilith

Do not mix variants.

#### Selena / White Moon

Requires a reliable formula/source.

Selena is more school-specific and must not be added without source validation.

---

### Sprint 15 — Midpoints / Antiscia

Goal:

Add mathematical derived structures.

#### Midpoints

Scope:

- midpoint between two natal planets/points;
- direct midpoint;
- wrap-around handling.

Do not add interpretation until math is tested.

#### Antiscia

Scope:

- antiscia;
- contra-antiscia;
- mirror axis logic.

Requires tests for sign/degree mapping.

---

### Sprint 16 — Personal Transits

Goal:

Add current transit aspects to natal planets/points.

Requires:

- validated natal planets;
- current planetary positions;
- aspect detection;
- orb rules;
- exactness;
- priority logic.

Output should include:

- transit body;
- natal body / point;
- aspect;
- orb;
- applying/separating if supported;
- source/provider.

No personal transit claims without validated natal base.

---

### Sprint 17 — Interpretation Layer / Ritual Scores

Goal:

Interpret validated natal/transit data and integrate with mode recommendations.

Possible outputs:

- personal recommendations;
- ritual suitability;
- warnings;
- personal best windows.

Rules:

- interpretation must be based on validated calculation inputs;
- avoid fatalistic copy;
- avoid overconfident predictions;
- explain uncertainty when necessary.

---

### Sprint 18 — Polish / UX / iPhone PWA / Backup & Security

Goal:

Finalize product quality.

Scope:

- mobile/iPhone PWA polish;
- performance;
- cache stability;
- offline behavior;
- backup/export/import hardening;
- privacy review;
- optional secure sync/cloud backup planning.

Server/sync remains a separate explicit decision.

---

## Source Notes

The user has provided screenshots from Vronsky / classical astrology sources.

Currently available screenshot-based source material includes:

- Table 4 — planetary influence / dignity strength;
- Table 5 — Terms / Термы;
- Table 6 — Degree rulers by Star of the Magi;
- Table 7 — Degree rulership by Vronsky;
- Table 10 — Aspects;
- Table 18 — Fixed Stars;
- formula tables involving ASC and planets.

Rules for these sources:

- Treat them as source-specific datasets.
- Do not OCR-import blindly.
- Manual verification required.
- Store source reference in dataset metadata.
- Add tests for boundary degrees and sample rows.
- If a table has competing traditional systems, explicitly name the selected system.

---

## Data Architecture Principle

There are two different kinds of data.

### 1. Calculated astronomical data

Examples:

- planet longitude;
- Moon longitude;
- speed;
- retrograde;
- ASC;
- MC;
- house cusps;
- current transits.

These must come from a calculation engine or validated provider.

### 2. Astrological lookup data

Examples:

- terms;
- decans;
- dignities;
- degree rulers;
- star qualities;
- interpretation tables.

These are lookup datasets applied after coordinates are calculated.

Never confuse these layers.

---

## Guardrails

Do not implement advanced modules until they appear in `TODO.md`.

Do not show user-facing values without calculation or dataset validation.

Do not invent:

- star conjunctions;
- dignity flags;
- house placements;
- ASC/MC;
- terms/decans;
- Lilith/Selena positions;
- transit aspects;
- orbs.

---

## Current Active Sprint Note

This document does not activate any advanced module.

Current active sprint and active task are defined only by:

- `PROJECT_STATE.md`
- `TODO.md`

If this file conflicts with active sprint documents, `PROJECT_STATE.md` and `TODO.md` win.
