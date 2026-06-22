# ARCHITECTURE.md

## Purpose

This file describes the current architecture of the Astro PWA project.

It is a living document.

Whenever implementation changes the structure of the app, data flow, routing, storage, calculation modules, domain models, privacy model, debug tools, or major UI components, this file must be updated in the same task.

This file describes the actual current state of the codebase, not future plans.

Future architecture ideas belong in `MASTER_PLAN.md` or `TODO.md`, not here.

Current Sprint 15 strategy docs:

- `SPRINT_15_PLAN.md`
- `ARABIC_PARTS_EXPANSION_STRATEGY.md`
- `ARABIC_PARTS_EXPANSION_SOURCE_POLICY.md`
- `ARABIC_PARTS_SOURCE_CORPUS_DECISION.md`
- `ARABIC_PARTS_VRONSKY_TABLE_17_SOURCE_MATERIALS.md`

These documents define the Arabic Parts Expansion Pack strategy and source-gated formula activation policy. Task 15.1 is docs-only: it does not implement new calculation modules, does not activate new Arabic Parts, and does not change the existing Arabic Parts architecture. Task 15.2 records the initial source corpus blocker; Task 15.2b accepts Vronsky Table 17 as the partial primary/only Sprint 15 source corpus for day-birth Arabic point formulas. No new modules or formulas are implemented.

Completed Sprint 14 strategy docs:

- `SPRINT_14_PLAN.md`
- `FIXED_STARS_STRATEGY.md`
- `FIXED_STARS_SOURCE_POLICY.md`
- `FIXED_STARS_SOURCE_DECISION.md`

These documents define the Fixed Stars strategy, source gating, catalog/source decision boundaries, coordinate / epoch / precession requirements, explicit orb policy and conjunction-only initial policy.

Task 14.2 selects Vronsky Table 18 as primary source, Swiss / modern validation where possible, global conjunction orb `1°00′`, and natal planets + ASC / MC / DSC / IC as the first target set.

Task 14.3 implements `src/fixedStarsData.js` as a data-only source/catalog module with 13 manually verified active rows from Vronsky Table 18, preserved 1950 / 1970 / 1990 columns and 1990 as the initial reference epoch.

Task 14.4 implements `src/fixedStarPositions.js` as a pure Fixed Star position / epoch helper. It calculates tropical zodiac positions from source-tracked Vronsky 1950 / 1970 / 1990 columns using exact source epochs, explicit interpolation, explicit extrapolation and wrap-around handling.

Task 14.10 implements `src/fixedStarsDebug.js` as a safe Fixed Stars debug / QA guardrails helper for `?debug=1`. It exposes catalog/policy/pipeline counts and statuses only, without raw profile data, provider payloads, full arrays or interpretations.

Task 14.11 closes Sprint 14 after final hardening / regression. The final Fixed Stars architecture remains source-gated and conjunction-only: 13 active Vronsky Table 18 rows, global `1°00′` orb, natal planets + ASC / MC / DSC / IC targets, display/UI/debug layers, and no interpretations, parans, heliacal phenomena, non-conjunction aspects or deferred targets.

There is currently no `src/fixedStars.js` or `src/fixedStarsForProfile.js`.

Completed Sprint 13 strategy docs:

- `SPRINT_13_PLAN.md`
- `SPECIAL_POINTS_STRATEGY.md`
- `SPECIAL_POINTS_SOURCE_POLICY.md`
- `LUNAR_NODES_SOURCE_POLICY.md`
- `LILITH_SOURCE_DECISION.md`
- `SELENA_SOURCE_DECISION.md`

These documents define the Special Points strategy, Lunar Nodes source policy, Mean Black Moon Lilith source decision and Selena / White Moon source decision.

Implemented Sprint 13 module:

- `src/lunarNodes.js` — pure mean Lunar Nodes engine validated against static local Swiss Ephemeris `SE_MEAN_NODE` benchmark fixtures.
- `src/lunarNodesHouseAssignment.js` — pure Lunar Nodes house-assignment layer for North/South Nodes against canonical house cusps.
- `src/lilith.js` — pure Mean Black Moon Lilith / Mean Lunar Apogee engine validated against static local Swiss Ephemeris `SE_MEAN_APOG` benchmark fixtures.
- `src/selena.js` — pure Selena / White Moon engine for the selected Swiss Ephemeris seorbel source system validated against static local Swiss Ephemeris `SE_WHITE_MOON` benchmark fixtures.
- `src/specialPointsDisplay.js` — pure display helper for already calculated Special Points.
- `src/specialPointsForProfile.js` — profile-level view-model helper for the `Особые точки карты` UI block.
- `src/specialPointsDebug.js` — safe debug helper for the `Special Points UI Debug` section; it exposes status/readiness/source statuses/counts/capabilities/privacy flags only and does not expose raw profile data, raw coordinates, UTC, raw point longitudes, full arrays or provider payloads.

## Update Rules

Update this file when a task changes:

- app structure
- routes or screens
- major components
- domain models
- astrology calculation modules
- ephemeris data flow
- profile data model
- local storage or persistence layer
- privacy or data handling
- API boundaries
- state management
- debug tools
- PWA cache behavior
- build or generation scripts
- test architecture

Do not update this file for:

- small copy changes
- simple label changes
- minor CSS tweaks
- visual spacing changes
- small bug fixes that do not affect structure
- content-only changes
- one-line formatting fixes

If the actual code conflicts with this file, inspect the code and update this file.

If this file conflicts with `PROJECT_STATE.md`:

- `PROJECT_STATE.md` wins for current sprint, status, and next task.
- `ARCHITECTURE.md` wins for current code structure.

If this file conflicts with `MASTER_PLAN.md`:

- `ARCHITECTURE.md` describes what exists now.
- `MASTER_PLAN.md` describes where the product is going.

If this file conflicts with `TODO.md`:

- `TODO.md` wins for the active task list.
- `ARCHITECTURE.md` only describes the current implemented structure.

## Document Priority

Current project source-of-truth priority:

1. `PROJECT_STATE.md` — current project state, active sprint, current focus
2. `ARCHITECTURE.md` — actual code structure and data flow
3. `TODO.md` — active implementation tasks
4. `ASTRO_LOGIC.md` — astrology calculation and interpretation rules
5. `UI_RULES.md` — interface and formatting rules
6. `PRIVACY_RULES.md` — personal data and privacy rules
7. `MASTER_PLAN.md` — long-term product roadmap
8. `CHANGELOG.md` — completed changes history

Important:

`MASTER_PLAN.md` is not an instruction to implement everything.

Only tasks explicitly moved into `TODO.md` should be implemented.

---

# Architecture

## Overview

This is a static PWA without a backend.

The app opens as a regular website and can be installed on iPhone through Safari.

The current main scenario is one primary screen: a lunar / astrological / ritual calendar dashboard calculated for Moscow.

The product direction is to become a practical “moment dashboard” for:

- Tarot
- candle rituals
- cleansing practices
- money practices
- relationship practices
- forecasts
- choosing the right timing for actions

The current implementation is still focused on the general daily / moment dashboard.

Personal profiles, natal charts, personal transits, import/export, and private profile storage are future modules unless they already exist in code.

Do not implement those future modules directly from this file.

---

# Current Application Type

## Static PWA

The project is currently a frontend-only static PWA.

There is no backend.

All current calculations and data rendering happen in the browser using local JavaScript modules and pre-generated ephemeris data.

## Installation Target

The app is intended to work as:

- a regular web app in browser
- an installable PWA on iPhone through Safari

## Primary Current Location

The current main calculation scenario is Moscow.

Moscow time is important for:

- date/time formatting
- lunar day boundaries
- Tong Shu day calculation
- Ba Zi day calculation
- current dashboard values
- current ritual timing logic

Future support for multiple calculation locations belongs to later profile/location tasks.

---

# Main Files

## `index.html`

Contains:

- main dashboard markup
- PWA meta tags
- app shell structure
- root DOM nodes used by `src/app.js`

Currently, the app does not use a React/Vue-style component framework unless the codebase is changed later.

The dashboard is assembled through static HTML and JavaScript DOM updates.

## `src/styles.css`

Controls:

- visual style
- mobile layout
- dashboard cards
- typography
- spacing
- responsive behavior
- PWA-friendly mobile presentation

Minor visual changes usually do not require updating this architecture file.

Major layout changes or creation of new screen-level UI structures do require updating this file.

## `src/app.js`

Main browser entry point.

Responsibilities:

- gets current time
- requests / calculates current astrological data
- combines data from calculation modules
- formats values
- updates DOM elements on the main dashboard
- controls the visible dashboard state
- reads local profile names for the compact `Профиль` / `Мои карты` UI shell
- reads and writes the active profile id through `src/profileStorage.js`
- handles inline profile creation, editing, and deletion through `src/profileStorage.js`
- handles local profile export/import actions through `src/profileImportExport.js`
- renders the read-only natal planets block inside `Мои карты` through `src/profileUi.js` when profile UTC readiness and provider output are ready
- renders the collapsible natal aspects block inside `Мои карты` through `src/profileUi.js` and `src/natalAspectsForProfile.js` when natal planets are ready
- renders the collapsible essential dignities block inside `Мои карты` through `src/profileUi.js` and `src/essentialDignitiesForProfile.js` when natal planets are ready
- renders the collapsible `Термы, деканы и градусы` block inside `Мои карты` through `src/profileUi.js` and `src/detailedDignitiesForProfile.js` when natal planets are ready
- renders the collapsible `Дома и углы карты` block inside `Мои карты` through `src/profileUi.js` and `src/housesForProfile.js` when house input guardrails and selected house-system calculations are ready
- renders the collapsible `Жребии и арабские части` block inside `Мои карты` through `src/profileUi.js` and `src/arabicPartsForProfile.js` when Arabic Parts inputs are ready
- renders the collapsible `Особые точки карты` block inside `Мои карты` through `src/profileUi.js` and `src/specialPointsForProfile.js` when Special Points inputs are ready
- renders the collapsible `Неподвижные звезды` block inside `Мои карты` through `src/profileUi.js`, `src/fixedStarConjunctions.js` and `src/fixedStarsDisplay.js` when Fixed Star conjunction checks are available
- renders the compact `Лично для меня` dashboard block through `src/personalContext.js`, `src/personalRecommendations.js`, and `src/profileUi.js`
- passes safe profile summary state, Houses UI debug state, Arabic Parts UI debug state, Special Points debug state and Fixed Stars debug state into the hidden debug panel only when `?debug=1`

`src/app.js` is currently the composition layer.

It should not become overloaded with deep astrology rules over time.

If future work extracts dashboard cards, domain services, view models, or state management out of `src/app.js`, this file must be updated.

## `src/vocDisplay.js`

Formats the dashboard display state for Void of Course Moon.

Current responsibilities:

- distinguish upcoming, active, and unavailable VOC display states;
- format VOC start/end time as `HH:mm` for the main dashboard;
- format the nearest or current VOC period without technical `VOC` wording in the UI;
- format the last aspect before VOC as `после: ...`;
- format the compact background line `фон ...`;
- expose aspect and planet formatting helpers used by `src/app.js`.

This module does not calculate VOC intervals. It only formats display text from existing VOC data.

## `src/moonAspectsDisplay.js`

Formats the dashboard display text for previous and next Moon aspects.

Current responsibilities:

- keep only major Moon aspects for the dashboard;
- format aspect name and planet name;
- format relative Moscow day labels such as `вчера`, `сегодня`, `завтра`;
- format aspect time as `HH:mm`;
- keep short practical interpretation texts and fallback rules for Moon aspects.

This module does not calculate Moon aspects. It only formats aspect data from `src/preciseEphemeris.js`.

## `src/moonPrecisionDisplay.js`

Formats compact Moon precision rows for the main Moon block.

Current responsibilities:

- format Moon illumination as a percentage;
- format time until the nearest exact New Moon or Full Moon;
- skip unavailable values without showing `undefined` / `null`.

This module does not calculate Moon phases. It formats values from `src/astro.js` and `src/preciseEphemeris.js`.

## `src/moonSignDisplay.js`

Formats the dashboard display text for the Moon's next sign transition.

Current responsibilities:

- format the next Moon sign transition as `Переход в ...: сегодня/завтра HH:mm`;
- format later transitions as a compact Moscow date plus `HH:mm`;
- keep seconds out of the main dashboard Moon sign line.

This module does not calculate Moon sign transitions. It formats data from `src/preciseEphemeris.js`.

## `src/planetaryHourHints.js`

Formats practical hints for the current planetary hour.

Current responsibilities:

- keep the reusable dictionary of planetary hour meanings;
- return a short `Хорошо для: ...` hint by planetary hour key;
- return an empty string for unknown values so the dashboard can hide the hint.

This module does not calculate planetary hours. It formats data from `src/astro.js`.

## `src/format.js`

Formats date and time values.

Current important responsibility:

- formatting dates and times in the Moscow timezone

Dashboard formatting rule:

- main dashboard should display time as `HH:mm`
- seconds should not be shown on the main dashboard
- seconds may appear only in technical/debug views if such views exist

If formatting rules become centralized here, document the relevant functions in this file.

## `src/astro.js`

Contains basic fallback calculations.

Current responsibilities include:

- Moon phase fallback calculation
- planetary day fallback calculation
- planetary hour fallback calculation
- approximate Void of Course Moon fallback logic

This module is used when precise pre-generated data is unavailable or incomplete.

This is a fallback layer, not the preferred source for exact lunar events when Swiss Ephemeris data is available.

## `src/astroMath.js`

Contains pure astrology math primitives for the future natal calculation foundation.

Current responsibilities:

- normalize ecliptic longitudes into `0 <= value < 360`;
- map longitude to tropical zodiac sign metadata;
- calculate degree within sign;
- calculate minimal angular distance between longitudes;
- detect major aspects with an explicit orb;
- detect an aspect between two longitudes;
- format longitude into a stable sign / degree / minute / second structure for user-facing astrology positions, with explicit minute formatting available only when requested.

This module is intentionally independent from:

- UI;
- profiles;
- localStorage;
- dates and timezone conversion;
- generated ephemeris data;
- `swisseph`;
- natal engine providers;
- houses, ASC / MC and personal transits.

It does not calculate natal planets. It is a reusable math foundation for later engine modules.

## `src/natalChartModel.js`

Defines neutral natal chart result shapes and normalization helpers for future calculation providers.

Current responsibilities:

- define natal engine statuses: `ready`, `incomplete`, `notSupported`, `error`;
- define feature flags for planets, houses, ASC / MC, aspects, and transits;
- create empty `notSupported`, `incomplete`, and explicit `ready` result objects;
- normalize explicitly provided natal planets, points, and aspects into stable objects;
- derive zodiac sign and degree-in-sign from valid longitudes via `src/astroMath.js`;
- expose `hasNatalFeature()` based on result capabilities.

This module does not calculate natal planets, houses, ASC / MC, aspects, or transits. It only normalizes data that a future provider explicitly supplies and keeps unsupported features disabled when data is absent.

## `src/natalEngine.js`

Defines the strict natal calculation engine interface.

Current responsibilities:

- report provider capabilities with all calculation features disabled;
- return `incomplete` when calculation input is missing required profile readiness data;
- call `src/planetaryPositionProvider.js` through a safe provider path for valid-looking input;
- return explicit `notSupported` with the planetary provider reason while no provider is connected;
- build a ready natal result only from explicitly supplied provider planets, which is currently covered only by test injection;
- explain current natal engine limitations;
- expose a non-throwing provider support check.

This module does not call external APIs, does not use `swisseph`, does not read generated ephemeris data, and does not calculate or fake planets, houses, ASC / MC, aspects, personal transits, or orbs.

## `src/birthDateTime.js`

Prepares birth date, birth time, and birth timezone data for future natal calculation providers.

Current responsibilities:

- parse `YYYY-MM-DD` birth dates without timezone-shifting `Date` parsing;
- parse `HH:mm` birth times with `exact`, `approximate`, and `unknown` time accuracy rules;
- normalize and validate IANA timezone strings through `luxon` / `Intl` checks;
- convert valid birth local date/time/timezone into UTC ISO through `luxon@3.7.2`;
- import Luxon's browser-safe ESM build from tracked vendored asset `src/vendor/luxon.mjs`;
- fail closed for unknown birth time, missing/invalid inputs, ambiguous DST overlap, and nonexistent DST gap;
- build birth date/time input readiness with `ready` and `incomplete` statuses;
- report missing fields, warnings, limitations, and calculation readiness for date-based, time-based, house, and ASC / MC work;
- return `canConvertToUtc: true` and `utcDateTime` only after safe conversion succeeds.

This module does not call external APIs, does not use geocoding or location permissions, does not use the device timezone as a birth-time fallback, and does not calculate natal planets, houses, ASC / MC, aspects, personal transits, or orbs.

## `src/housesInputGuardrails.js`

Defines the Sprint 11 readiness / guardrails layer for future Houses / ASC / MC calculations.

Current responsibilities:

- evaluate whether a profile has enough safe input for future ASC / MC / house calculations;
- require exact birth time, birth date, birth timezone, birth place and finite birth coordinates;
- fail closed for `Общий день`, missing profile, unknown or empty birth time, missing timezone, missing birth place, country/region-only birth place, city without coordinates, missing coordinates and invalid coordinates;
- support existing and compatible birth coordinate shapes without returning raw coordinate values;
- expose safe flags, requirements, fallback messages, limitations and initial `whole-sign` house-system policy.

This module does not calculate ASC, MC, DSC, IC, houses or planet-in-house assignments. It does not call providers, import `astronomy-engine`, read localStorage, render DOM, expose raw birth data, expose raw coordinates or mutate profiles.

## `src/ascMc.js`

Defines the Sprint 11 pure ASC / MC angle calculation engine.

Current responsibilities:

- validate normalized UTC/date input and finite birth coordinates;
- use `src/housesInputGuardrails.js` for profile-level readiness before profile-based ASC / MC calculation;
- use `src/birthDateTime.js` to resolve a validated UTC birth moment for profile-based calculation;
- calculate local sidereal time through tracked `src/vendor/astronomy-engine.mjs` `SiderealTime()`;
- calculate mean obliquity with an internal documented approximation;
- expose sidereal time and mean-obliquity helpers for validated house-system engines;
- calculate ASC and MC with deterministic vector geometry;
- derive DSC and IC by adding 180 degrees and normalizing to the zodiac circle;
- format ASC / MC / DSC / IC as zodiac sign, degree, minutes and safe text.

This module does not calculate houses, house cusps, Placidus/quadrant cusps, planet-in-house assignments, fixed stars, transits, interpretations or ritual scoring. It does not import provider modules, read localStorage, render DOM, mutate profiles, or expose raw birth data / raw coordinates from profile-level output.

## `src/wholeSignHouses.js`

Defines the Sprint 11 pure Whole Sign houses engine.

Current responsibilities:

- accept a ready ASC angle or ready ASC / MC result;
- build 12 Whole Sign houses from the ASC sign;
- keep `houseSystem: "whole-sign"` and `houseSystemLabel: "Whole Sign"` explicit;
- expose sign-to-house helpers for future planet-in-house assignment without accepting planet objects;
- respect profile-level `houseSystem` selection for the Whole Sign engine path: Whole Sign aliases calculate, Equal House / Placidus aliases return explicit unsupported status;
- call `src/ascMc.js` only through `calculateAscMcForProfile()` for profile-level Whole Sign calculation.

This module does not implement Equal House, Placidus, quadrant cusps, a generic house-system router, planet-in-house assignment, UI, fixed stars, transits, interpretations or ritual scoring. It does not import provider modules, read localStorage, render DOM, mutate profiles, or expose raw birth data / raw birth coordinates from profile-level output.

## `src/equalHouseHouses.js`

Defines the Sprint 11 pure Equal House / Равнодомная houses engine.

Current responsibilities:

- accept a ready ASC angle or ready ASC / MC result;
- build 12 Equal House cusps from the exact ASC longitude;
- keep `houseSystem: "equal-house"` and `houseSystemLabel: "Равнодомная"` explicit;
- build Equal House house spans with `nextCuspLongitude` and wrap flags;
- respect profile-level `houseSystem` selection for the Equal House engine path: Equal House aliases calculate, Whole Sign / Placidus aliases and missing selection return explicit unsupported status;
- call `src/ascMc.js` only through `calculateAscMcForProfile()` for profile-level Equal House calculation.

This module does not implement Whole Sign, Placidus, quadrant cusps, a generic house-system router, planet-in-house assignment, UI, fixed stars, transits, interpretations or ritual scoring. It does not import provider modules, read localStorage, render DOM, mutate profiles, or expose raw birth data / raw birth coordinates from profile-level output.

## `src/placidusHouses.js`

Defines the Sprint 11 pure Placidus houses engine.

Current responsibilities:

- recognize Placidus as a separate `placidus` house system;
- expose Placidus validation status and capabilities with benchmark-backed readiness;
- calculate 12 Placidus cusps and house spans from normalized UTC/date and coordinates;
- use sidereal time from `src/ascMc.js` and true obliquity from the tracked Astronomy Engine runtime for Swiss-aligned Placidus cusp anchors;
- derive Placidus ASC / MC / DSC / IC display angles from cusps 1 / 10 / 7 / 4 in the ready Placidus result;
- validate the browser-safe local calculation against 6 static `local-swisseph-swe_houses-benchmark` fixtures with `0.05°` tolerance;
- return explicit unsupported status for high-latitude / circumpolar cases where Placidus cannot be safely calculated;
- respect profile-level `houseSystem` selection for the Placidus path: Placidus aliases check guardrails and calculate when ready, Whole Sign / Equal House aliases return explicit selected-system unsupported status;
- use `src/housesInputGuardrails.js` for selected-Placidus profile readiness.

This module does not implement Whole Sign, implement Equal House, import runtime `swisseph`, import provider modules, implement a generic house-system router, assign planets to houses, render UI, read localStorage, mutate profiles, or expose raw birth data / raw birth coordinates. `swisseph` is used only outside app runtime as the static benchmark oracle.

## `src/houseSystemResolver.js`

Defines the Sprint 11 pure selected house-system resolver / router.

Current responsibilities:

- normalize profile and explicit house-system values into canonical keys `whole-sign`, `equal-house` and `placidus`;
- use the saved profile-level `houseSystem` as the source of truth, with `whole-sign` as the default only when no saved selection exists;
- route profile-level calculation to exactly one selected engine: `src/wholeSignHouses.js`, `src/equalHouseHouses.js` or `src/placidusHouses.js`;
- route ready ASC / MC results to the selected system-specific `FromAscMc` path;
- preserve selected engine `ready`, `notReady` or `unsupported` status and reason without silently falling back to another system;
- expose selected-system metadata such as `selectedHouseSystem`, `houseSystem`, `selectionSource` and `defaulted`;
- report available house systems and Placidus readiness through the Placidus validation status.

This module does not implement house calculations directly, calculate ASC / MC, calculate Placidus, calculate Equal House, calculate Whole Sign, assign planets to houses, render UI, read localStorage, import provider modules, mutate profiles or expose raw birth data / raw birth coordinates.

## `src/planetInHouses.js`

Defines the Sprint 11 pure planet-in-house assignment layer.

Current responsibilities:

- accept ready natal planet objects and a ready selected house-system result;
- assign planets to houses for `whole-sign`, `equal-house` and `placidus`;
- use Whole Sign sign-distance assignment from the ASC sign;
- use ready house cusp spans for Equal House and Placidus;
- keep cusp spans half-open: exact cusp belongs to the house starting at that cusp;
- preserve input planet order and return safe invalid assignments for invalid planet entries;
- expose profile-level assignment through the existing safe natal planets path and `src/houseSystemResolver.js`.

This module does not calculate houses directly, calculate ASC / MC, calculate planet positions directly, call provider modules directly, create a generic house router, render UI, read localStorage, mutate profiles / planets / house results, expose raw birth data / raw birth coordinates, or add interpretations.

## `src/housesDisplay.js`

Defines the Sprint 11 pure Houses / ASC / MC display helper.

Current responsibilities:

- format already-ready ASC / MC / DSC / IC angles into safe user-facing rows;
- format the selected house-system label;
- format Whole Sign house sign rows and Equal House / Placidus cusp house rows from already-ready house results;
- format ready planet-in-house assignments into compact display rows;
- format safe not-ready / unsupported fallback states for future UI;
- summarize display readiness and expose display limitations;
- for selected-system router results, use the unwrapped selected engine result as the single source for both angle rows and house rows.

This module does not calculate houses, calculate ASC / MC, route selected house systems, assign planets to houses, call provider modules, import calculation engines, render UI, read localStorage, mutate inputs, expose raw birth data / raw birth coordinates, expose raw planet longitude, or add interpretations.

## `src/housesForProfile.js`

Defines the Sprint 11 profile-level Houses / ASC / MC view-model helper for the `Мои карты` UI block.

Current responsibilities:

- request the selected house-system result through `src/houseSystemResolver.js`;
- request natal planets only when houses are ready and pass the already calculated selected house result into `src/planetInHouses.js`;
- format the combined result through `src/housesDisplay.js`;
- return UI-ready safe rows for selected house system, ASC / MC / DSC / IC, houses, planet assignments, fallback messages and limitations.

This module does not calculate houses, calculate ASC / MC, calculate planets, call provider modules directly, render DOM, read localStorage, mutate profiles, expose raw birth data / raw birth coordinates / raw planet longitudes, or add interpretations.

## `src/housesDebug.js`

Defines the Sprint 11 safe Houses / ASC / MC debug-state helper for `?debug=1`.

Current responsibilities:

- read the safe profile-level Houses / ASC / MC view model from `src/housesForProfile.js`;
- expose only debug-safe status, readiness booleans, selected house-system metadata, counts, capabilities and privacy flags;
- identify the active profile by id/name only;
- report collapsed state supplied by the UI layer.

This module does not calculate houses, calculate ASC / MC, assign planets to houses, call provider modules, import browser ephemeris engines, render DOM, read localStorage, mutate profiles, expose raw birth data / UTC / timezone values / coordinates / raw longitudes, or dump full houses / cusps / assignments / profile JSON.

## `src/houseCusps.js`

Defines the Sprint 12 pure canonical house cusp layer.

Current responsibilities:

- accept a ready selected house-system result directly or through the `src/houseSystemResolver.js` router shape;
- return a canonical 12-cusp output for `whole-sign`, `equal-house` and `placidus`;
- represent Whole Sign as sign-boundary cusp-like house boundaries with `exactCuspDegrees: false`;
- represent Equal House as exact ASC + 30° cusps from the existing Equal House result;
- represent Placidus as benchmark-validated quadrant cusps from the existing Placidus result;
- expose profile-level canonical cusp output through the existing selected-system router.

This module does not calculate new house math, add a new house system, calculate day/night status, calculate Pars Fortuna, calculate Arabic Parts, call provider modules, render UI, read localStorage, mutate input, or expose raw birth data / raw birth coordinates.

## `src/dayNightChart.js`

Defines the Sprint 12 pure day/night chart status engine.

Current responsibilities:

- calculate geometric Sun altitude from local sidereal time, latitude, obliquity and Sun ecliptic longitude;
- classify chart sect as `day`, `night` or explicit `boundary` when the Sun is too close to the horizon;
- calculate day/night status from UTC/date, coordinates and Sun longitude using the existing sidereal time and obliquity helpers from `src/ascMc.js`;
- expose a profile-level helper that uses existing house input guardrails, `src/birthDateTime.js` UTC conversion and the safe `src/natalPlanetsForProfile.js` path for natal Sun longitude.

This module does not calculate Pars Fortuna, calculate Arabic Parts, add interpretations, add UI, create a new house engine, call provider modules directly, render DOM, read localStorage, mutate profiles, or expose raw birth data / raw birth coordinates.

## `src/parsFortuna.js`

Defines the Sprint 12 pure Pars Fortuna / Lot of Fortune formula engine.

Current responsibilities:

- calculate Pars Fortuna from numeric ASC, Sun and Moon longitudes;
- choose the verified day formula `ASC + Moon - Sun` only when chart sect is `day`;
- choose the verified night formula `ASC + Sun - Moon` only when chart sect is `night`;
- normalize the result to tropical zodiac longitude `0 <= longitude < 360`;
- format the result as sign, degree, minute and second text;
- expose a profile-level helper that uses existing house guardrails, `src/ascMc.js`, `src/dayNightChart.js` and the safe `src/natalPlanetsForProfile.js` Sun/Moon path.

This module does not implement a broad Arabic Parts catalog, calculate Lot of Spirit, assign lots to houses, add interpretations, add UI, call provider modules directly, render DOM, read localStorage, mutate profiles, or expose raw birth data / raw birth coordinates.

## `src/arabicPartsData.js`

Defines the Sprint 12 data-only Arabic Parts formula dataset / source decision layer.

Current responsibilities:

- expose formula verification status constants;
- record the Sprint 12 verified-only formula activation policy;
- list active and deferred Arabic Part formula rows;
- keep Pars Fortuna / Lot of Fortune and Lot of Spirit as active verified formula rows;
- keep additional candidate parts inactive/deferred until source verification;
- expose helpers for active rows, deferred rows, lookup by key, verification checks, policy and deferred reasons.

This module does not calculate formulas, implement the broad Arabic Parts engine, calculate Lot of Spirit, import `src/parsFortuna.js`, add interpretations, add UI, call provider modules, render DOM, read localStorage, mutate profiles, or expose raw birth data / raw birth coordinates.

## `src/arabicParts.js`

Defines the Sprint 12 pure Basic Arabic Parts formula calculation engine.

Current responsibilities:

- read active verified formula rows from `src/arabicPartsData.js`;
- calculate only Pars Fortuna and Lot of Spirit in Sprint 12;
- evaluate verified ordered arithmetic formulas from numeric ASC, Sun and Moon longitudes plus explicit day/night chart status;
- normalize result longitudes to `0 <= longitude < 360`;
- format calculated lots with sign, degree, minute and second text;
- expose a profile-level helper that uses existing house guardrails, `src/ascMc.js`, `src/dayNightChart.js` and the safe `src/natalPlanetsForProfile.js` Sun/Moon path.

This module does not activate deferred formulas, assign lots to houses, add interpretations, add UI, call provider modules directly, render DOM, read localStorage, mutate profiles, or expose raw birth data / raw birth coordinates.

## `src/arabicPartsHouseAssignment.js`

Defines the Sprint 12 pure Lots / Arabic Parts house-assignment layer.

Current responsibilities:

- accept calculated Arabic Parts / lots from `src/arabicParts.js`;
- accept canonical house cusps from `src/houseCusps.js`;
- assign active verified lots to Whole Sign, Equal House or Placidus houses by numeric longitude;
- use half-open spans `[cusp, nextCusp)` with exact cusp boundaries assigned to the house that starts at that cusp;
- expose a profile-level helper that composes the existing Arabic Parts engine and canonical cusp helper without direct provider calls.

This module does not calculate formulas, activate deferred Arabic Parts, calculate houses, add UI, add display/debug helpers, add interpretations, call provider modules directly, render DOM, read localStorage, mutate profiles, or expose raw birth data / raw birth coordinates.

## `src/arabicPartsDisplay.js`

Defines the Sprint 12 pure Lots / Arabic Parts display helper.

Current responsibilities:

- format already calculated Pars Fortuna and Lot of Spirit rows for user-facing display;
- format already available lots / Arabic Parts house assignments when provided;
- format day/night chart labels, summaries, limitations and fallback states;
- combine part position text with house labels without recalculating formulas or assigning houses;
- keep output free of raw birth data, raw coordinates, raw longitudes, formula operand arrays and provider payloads.

This module does not calculate formulas, assign lots to houses, activate deferred Arabic Parts, add UI, add debug output, add interpretations, call provider modules, render DOM, read localStorage, mutate inputs, or expose raw birth data / raw birth coordinates.

## `src/arabicPartsForProfile.js`

Builds the Sprint 12 profile-level Lots / Arabic Parts view model for the `Жребии и арабские части` UI block.

Current responsibilities:

- request calculated active Arabic Parts through `src/arabicParts.js`;
- request lots / Arabic Parts house assignment through `src/arabicPartsHouseAssignment.js` only when parts are ready;
- format the combined result through `src/arabicPartsDisplay.js`;
- return UI-ready safe rows for day/night chart label, Pars Fortuna, Lot of Spirit, optional house labels, fallback messages and limitations.

This module does not calculate formulas, assign lots to houses itself, activate deferred Arabic Parts, call provider modules directly, render DOM, read localStorage, mutate profiles, expose raw birth data / raw birth coordinates / raw lot longitudes, or add interpretations.

## `src/arabicPartsDebug.js`

Builds the Sprint 12 safe debug/status state for the `Жребии и арабские части` UI block.

Current responsibilities:

- report active profile id/name only;
- report readiness booleans for exact birth time, birth coordinates, birth timezone, day/night status, Arabic Parts readiness and house-assignment readiness;
- report safe chart sect status/label, active/deferred formula keys, counts, capabilities and privacy flags;
- avoid raw birth data, raw coordinates, UTC, raw timezone values, raw longitudes, formula operand arrays, provider payloads and full parts/assignments/cusps arrays.

This module does not calculate formulas, change house assignment, render UI directly, add interpretations, call provider modules directly, render DOM, read localStorage, mutate profiles, or expose raw profile data.

## `src/lunarNodes.js`

Defines the Sprint 13 pure mean Lunar Nodes engine.

Current responsibilities:

- calculate the active `mean-lunar-node` / `lunar-nodes-mean` North Node longitude from a UTC moment;
- derive South Node only as `normalize(North Node + 180°)`;
- format North Node and South Node as tropical zodiac sign, degree, minute and second rows;
- expose a profile-level helper that uses `src/birthDateTime.js` UTC readiness;
- keep source metadata, capabilities and limitations explicit.

This module does not calculate true node, Lilith, Selena, Fixed Stars, transits, house assignment, display/UI/debug helpers or interpretations. It does not import runtime `swisseph`, provider modules, DOM or localStorage, mutate profiles, require birth coordinates, or expose raw birth data / raw coordinates.

## `src/lunarNodesHouseAssignment.js`

Defines the Sprint 13 pure Lunar Nodes house-assignment layer.

Current responsibilities:

- accept ready Lunar Nodes results and ready canonical house cusps;
- assign only North Node and South Node to Whole Sign, Equal House or Placidus house spans;
- use numeric longitude only, half-open spans `[cusp, nextCusp)`, exact-cusp boundary ownership and wrap-around support;
- expose a profile-level helper that composes `calculateLunarNodesForProfile()` with `getCanonicalHouseCuspsForProfile()`;
- return safe assignment summaries, capabilities and limitations.

This module does not calculate Lunar Nodes, calculate houses, implement true node, Lilith, Selena, UI, display helpers, debug helpers or interpretations. It does not import provider modules, DOM, localStorage or `swisseph`, mutate profiles, or expose raw birth data / raw coordinates.

## `src/lilith.js`

Defines the Sprint 13 pure Mean Black Moon Lilith / Mean Lunar Apogee engine.

Current responsibilities:

- calculate only the active `mean-black-moon-lilith` / `mean-lunar-apogee` longitude from a UTC moment;
- format Mean Lilith as tropical zodiac sign, degree, minute and second row;
- expose a profile-level helper that uses `src/birthDateTime.js` UTC readiness;
- keep source metadata, deferred variants, capabilities and limitations explicit;
- validate the browser-safe local calculation against static `local-swisseph-SE_MEAN_APOG-benchmark` fixtures with `0.01°` tolerance.

This module does not calculate true Lilith, osculating Lilith, interpolated Lilith, Selena, Lunar Nodes, Fixed Stars, transits, house assignment, display/UI/debug helpers or interpretations. It does not import runtime `swisseph`, provider modules, DOM or localStorage, mutate profiles, require birth coordinates, or expose raw birth data / raw coordinates.

## `src/selena.js`

Defines the Sprint 13 pure Selena / White Moon engine.

Current responsibilities:

- calculate only the selected `selena-white-moon` / `swiss-ephemeris-seorbel-white-moon` longitude from a UTC moment;
- use the `swisseph-seorbel-white-moon-linear-elements` method documented in `SELENA_SOURCE_DECISION.md`;
- mark Selena / White Moon as `fictitious-calculated-point`, not a physical astronomical body;
- format Selena as tropical zodiac sign, degree, minute and second row;
- expose a profile-level helper that uses `src/birthDateTime.js` UTC readiness;
- keep source metadata, capabilities and limitations explicit;
- validate the browser-safe local calculation against static `local-swisseph-SE_WHITE_MOON-benchmark` fixtures with `0.01°` tolerance.

This module does not calculate alternate Selena source systems, Lunar Nodes, Lilith, Fixed Stars, transits, house assignment, display/UI/debug helpers or interpretations. It does not import runtime `swisseph`, provider modules, DOM or localStorage, mutate profiles, require birth coordinates, or expose raw birth data / raw coordinates.

## `src/specialPointsDisplay.js`

Defines the Sprint 13 pure Special Points display helper.

Current responsibilities:

- format already calculated North Node and South Node rows;
- format already calculated Mean Lilith and Selena / White Moon rows;
- format optional Lunar Nodes house assignment labels when assignment data is already provided;
- build clean section rows and one shared `Особые точки карты` limitations list for normal UI;
- expose display summary, displayability checks and limitations for future UI integration;
- show Selena / White Moon as a fictitious / hypothetical calculated point through safe limitations, not as interpretation text.

This module does not calculate Special Points, assign houses, render UI, add debug output, call providers, read DOM/localStorage, import astronomy engines or `swisseph`, mutate inputs, expose raw birth data / raw coordinates / raw numeric longitudes, or add interpretations.

## `src/specialPointsForProfile.js`

Defines the Sprint 13 profile-level Special Points view-model helper.

Current responsibilities:

- compose `calculateLunarNodesForProfile`, `calculateLilithForProfile` and `calculateSelenaForProfile` results for the active profile;
- request Lunar Nodes house assignment through `assignLunarNodesToHousesForProfile` only when nodes are ready;
- format the combined result through `src/specialPointsDisplay.js`;
- return UI-ready `Особые точки карты` ready / partial / fallback state without raw profile fields;
- allow Special Points positions without birth coordinates, while Lunar Nodes house labels appear only when house cusps are ready.

This module does not calculate point longitudes directly, assign houses itself, call providers, read DOM/localStorage, mutate profiles, expose raw birth data / raw coordinates / raw numeric longitudes, add debug output, activate deferred variants, or add interpretations.

## `src/planetaryPositionProvider.js`

Defines the future planetary position provider contract.

Current responsibilities:

- define provider statuses: `ready`, `incomplete`, `notSupported`, `error`;
- define the 10 main natal planet keys for future calculations;
- report provider capabilities with all calculation features disabled;
- validate future provider input: `utcDateTime`, `zodiac: tropical`, and allowed body keys;
- return `incomplete` for invalid input and explicit `notSupported` for valid-looking input while no provider is connected;
- normalize explicitly supplied planetary positions into sign, degree, minutes, retrograde, speed, and source fields.

This module does not connect a runtime ephemeris provider, does not call external APIs, does not use `swisseph`, does not integrate with the dashboard, and does not calculate or fake planetary longitudes, houses, ASC / MC, aspects, personal transits, or orbs.

## `src/natalProviderAdapter.js`

Defines the future natal provider adapter contract.

Current responsibilities:

- define adapter statuses: `ready`, `incomplete`, `notSupported`, `error`;
- create the production default adapter, which returns explicit `notSupported`;
- report adapter capabilities without approving or connecting a provider;
- validate adapter shape and required functions for ready capabilities;
- safely run an adapter against provider input;
- normalize only explicitly returned mock/provider planet data via `src/planetaryPositionProvider.js`.

This module does not connect a real provider, does not add dependencies, does not call external APIs, does not use `swisseph`, does not integrate with the dashboard, and does not calculate or fake planetary longitudes, houses, ASC / MC, aspects, personal transits, or orbs.

## `src/astronomyEngineProvider.js`

Defines the isolated `astronomy-engine` provider module for the Sprint 6 provider-layer MVP and Sprint 7 read-only natal planets panel.

Current responsibilities:

- expose installed provider identity for `astronomy-engine@2.1.19`;
- import Astronomy Engine from tracked vendored runtime asset `src/vendor/astronomy-engine.mjs` so static PWA / GitHub Pages runtime does not depend on ignored `node_modules`;
- report provider-layer candidate planet calculation capabilities and selected UTC reference validation status;
- document the geocentric tropical longitude API paths used by the provider layer;
- audit installed provider source in Node tests for executable network behavior;
- validate provider input through `src/planetaryPositionProvider.js`;
- return `incomplete` for invalid input;
- calculate candidate planet longitudes for valid UTC input without exposing them to the UI;
- calculate provider-layer longitude speed by central difference on the validated longitude path;
- derive provider-layer retrograde as `speed < 0`.

API paths currently used:

- Sun: `SunPosition(date).elon`;
- Moon: `EclipticGeoMoon(date).lon`;
- planets: `GeoVector(body, date, true) -> Ecliptic(vector).elon`.

Selected UTC natal planet longitudes are validated in tests against the local `swisseph` dev dependency through `test/fixtures/natalProviderReferenceFixtures.js` and `test/natalProviderReferenceValidation.test.js`.

Selected UTC longitude speeds are validated in tests against local `swisseph` with `SEFLG_SWIEPH | SEFLG_SPEED`. Retrograde-sensitive fixtures cover Mercury and Venus retrograde cases.

This module does not directly render UI and does not calculate houses, ASC / MC, personal transits, aspects or orbs.

## `src/natalPlanetsForProfile.js`

Builds the safe read-only natal planets view model for an active saved profile.

Current responsibilities:

- call `src/birthDateTime.js` and require `canConvertToUtc: true` plus `utcDateTime`;
- call `src/astronomyEngineProvider.js` only after UTC readiness succeeds;
- format provider output through `src/natalPlanetDisplay.js`;
- return `incomplete` without planets for unknown birth time, missing timezone, invalid input, ambiguous DST overlap or nonexistent DST gap;
- allow natal planet display without birth coordinates, because coordinates are needed for houses / ASC / MC rather than geocentric planet longitudes;
- expose only formatted planet text and safe limitations to `src/profileUi.js`.

This module does not read localStorage, does not render DOM, does not send birth data externally, does not show raw birth data or raw UTC input, and does not calculate houses, ASC / MC, personal transits, aspects or orbs.

## `src/natalAspectEngine.js`

Calculates pure natal aspects between already supplied natal planet positions.

Current responsibilities:

- define the Sprint 8 active natal aspect set: conjunction, sextile, square, trine and opposition;
- expose the explicit orb policy from `NATAL_ASPECTS_STRATEGY.md`;
- calculate allowed orb as `min(aspectBaseOrb, bodyPairOrb)`;
- calculate aspects from passed-in planet `longitude` values using angular wrap-around through `src/astroMath.js`;
- return structured aspect objects with `bodyA`, `bodyB`, `aspect`, `angle`, `orb`, `orbText`, `allowedOrb`, `strength`, `applying`, `separating` and `source`;
- keep `applying` and `separating` as `null` until a separate validated logic exists;
- prevent duplicate A-B / B-A pairs by canonical planet order;
- ignore same-body pairs, unknown bodies, missing labels and invalid longitudes;
- sort aspects by orb, luminary priority, hard aspect priority and canonical planet order.

This module does not call providers, does not import `astronomy-engine` or Luxon, does not read profiles or localStorage, does not render DOM, does not interpret aspects, and does not calculate houses, ASC / MC, transits, fixed stars, special points or ritual scoring.

## `src/natalAspectDisplay.js`

Defines pure display helpers for already-calculated natal aspect objects.

Current responsibilities:

- validate whether a passed natal aspect object is safe to display;
- format body labels, aspect symbol / name and orb text into compact user-facing copy such as `Солнце □ Луна · орб 2°15′`;
- format lists by filtering invalid / incomplete aspect objects;
- build collapsed-section summary counts for total, tense, harmonious and conjunction aspects;
- expose Sprint 8 limitation copy that natal aspects are not transits and that ASC / MC, house and point aspects are separate future work.

This module does not import or call `src/natalAspectEngine.js`, providers, profiles, localStorage, DOM or UI code. It does not calculate aspects, longitudes, orbs, houses, ASC / MC, transits, interpretations or ritual scoring.

## `src/natalAspectsForProfile.js`

Builds the safe read-only natal aspects view model for an active saved profile.

Current responsibilities:

- call `src/natalPlanetsForProfile.js` and require ready natal planet output first;
- call `src/natalAspectEngine.js` only with already calculated natal planet positions;
- format aspect output through `src/natalAspectDisplay.js`;
- build collapsed-section summary through `summarizeNatalAspects()`;
- return `incomplete` without aspects when natal planets are not ready;
- expose only formatted aspect text, summary counts and safe limitations to `src/profileUi.js`.

This module does not read localStorage, does not render DOM, does not send birth data externally, does not call providers directly, and does not calculate houses, ASC / MC, transits, fixed stars, special points, interpretations or ritual scoring.

## `src/essentialDignitiesData.js`

Defines the source-tracked Sprint 9 essential dignity dataset.

Current responsibilities:

- expose basic dignity type constants for domicile, detriment, exaltation, fall and modern rulership;
- expose source metadata for the selected classical / traditional seven-planet scoring baseline;
- store classical rulership, detriment, exaltation and fall sign tables for Sun, Moon, Mercury, Venus, Mars, Jupiter and Saturn;
- store Uranus, Neptune and Pluto modern rulership labels separately as label-only data with no classical score;
- expose the explicit Sprint 9 score model: domicile +5, exaltation +4, detriment -5, fall -4, neutral 0 and modern rulership 0;
- expose deferred feature metadata for terms, decans, degree rulers, exact exaltation degrees, Vronsky strength tables, fixed stars, houses, ASC / MC, transits, interpretations and ritual scoring.

This module does not perform dignity lookup, does not read natal planets, profiles, localStorage or DOM, does not call providers, and does not include terms / decans / degree rulers, exact exaltation degree values, Vronsky table rows, houses, ASC / MC, transits, interpretations or ritual scoring.

## `src/termsData.js`

Defines the source-tracked Sprint 10 Vronsky Table 5 — Terms dataset.

Current responsibilities:

- expose verified Table 5 source metadata;
- store 60 manually verified terms rows across 12 zodiac signs;
- preserve printed source ranges through `printedEndDegree`;
- store future half-open lookup boundaries through `normalizedEndExclusive`;
- normalize final printed `29°` rows to `normalizedEndExclusive: 30` while preserving the printed source value;
- expose dataset, source, deferred features, sign-row and validation helpers for future lookup work.

This module does not perform degree lookup, does not read natal planets, profiles, localStorage or DOM, does not call providers, and does not include decans, degree rulers, other Vronsky tables, fixed stars, houses, ASC / MC, transits, interpretations or ritual scoring.

## `src/decansData.js`

Defines the source-tracked Sprint 10 Decans Star of the Magi / Egyptian tradition dataset from Vronsky Figure 4.7.

Current responsibilities:

- expose verified Figure 4.7 source metadata;
- store 36 manually verified decan rows across 12 zodiac signs;
- keep the dataset limited to the Star of the Magi / Egyptian tradition source system;
- use septener planets only: Sun, Moon, Mercury, Venus, Mars, Jupiter and Saturn;
- store half-open decan intervals `[0,10)`, `[10,20)` and `[20,30)`;
- expose dataset, source, deferred systems, deferred features, sign-row and validation helpers for future lookup work.

This module does not perform degree lookup, does not read natal planets, profiles, localStorage or DOM, does not call providers, and does not include Trigon / Vronsky decans, degree rulers, fixed stars, houses, ASC / MC, transits, interpretations or ritual scoring.

## `src/fixedStarsData.js`

Defines the source-tracked Sprint 14 Fixed Stars catalog dataset from Vronsky Table 18.

Current responsibilities:

- expose Fixed Stars source metadata, verification statuses, orb policy, target policy and relationship policy;
- store 13 manually verified active rows from the initial Vronsky Table 18 subset;
- preserve Vronsky 1950 / 1970 / 1990 source coordinate columns for each active row;
- use the Vronsky 1990 column as the initial reference epoch for verified source rows;
- expose read-only catalog helpers for active rows, candidate rows, row lookup, verification checks, policy, deferred reasons, capabilities and limitations;
- preserve the Task 14.2 guardrails: no OCR import, no rows from memory, global conjunction orb `1°00′`, and natal planets + ASC / MC / DSC / IC as the first target set.

This module does not calculate birth-date star positions, precession, conjunctions or targets. It does not read natal planets, profiles, localStorage or DOM, does not call providers, does not import runtime Swiss Ephemeris or Astronomy Engine, and does not include UI, debug, interpretations, mythology text, predictive text, transits or ritual scoring.

## `src/fixedStarPositions.js`

Defines the pure Sprint 14 Fixed Star position / epoch engine for source-tracked Vronsky Table 18 rows.

Current responsibilities:

- calculate a UTC decimal year from a provided UTC date/date string without exposing the raw UTC input in output;
- calculate one fixed star position from a verified source row or active catalog key;
- calculate the active source-tracked fixed star positions as a batch;
- preserve exact Vronsky source epochs 1950 / 1970 / 1990;
- linearly interpolate dates between 1950–1970 and 1970–1990;
- linearly extrapolate dates outside 1950–1990 with explicit output flags;
- unwrap longitudes across 0° Aries before interpolation / extrapolation and normalize the final tropical zodiac longitude;
- format positions with sign / degree / minute / second and expose safe source / epoch metadata;
- expose lookup, validation, summary, capability and limitation helpers.

This module depends on `src/fixedStarsData.js` and `src/astroMath.js`. It does not calculate conjunctions, resolve targets, render UI/debug, read profiles, localStorage or DOM, call provider modules, import runtime Swiss Ephemeris or Astronomy Engine, mutate catalog rows, create `src/fixedStars.js`, or include interpretations, mythology text, predictive text, transits or ritual scoring.

## `src/fixedStarTargets.js`

Defines the pure Sprint 14 Fixed Star target resolver for future conjunction work.

Current responsibilities:

- normalize ready natal planet and angle objects into fixed-star target rows;
- resolve active natal planet targets in canonical order: Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune and Pluto;
- resolve active angle targets in canonical order: ASC, MC, DSC and IC;
- combine active target sets into ready / partial / notReady resolver output;
- preserve deferred target sets as metadata only: house cusps, Lunar Nodes, Lilith, Selena, Pars Fortuna, Lot of Spirit, Arabic Parts and custom points;
- expose target lookup, validation, summary, capability and limitation helpers.

This module depends on existing safe profile-level helpers (`src/natalPlanetsForProfile.js` and `src/ascMc.js`), `src/fixedStarsData.js` target policy and `src/astroMath.js`. It does not calculate fixed star positions, calculate conjunctions, activate deferred targets, render UI/debug, read localStorage or DOM, import runtime Swiss Ephemeris or Astronomy Engine, create `src/fixedStars.js`, or include interpretations, mythology text, predictive text, transits or ritual scoring.

## `src/fixedStarConjunctions.js`

Defines the pure Sprint 14 Fixed Star conjunction engine.

Current responsibilities:

- expose the active global conjunction orb policy from `src/fixedStarsData.js`;
- calculate shortest angular distance between a Fixed Star longitude and target longitude;
- detect conjunction hits only when `distance <= 1°00′`, including exact conjunction and exact orb boundary;
- support wrap-around across 359° / 0° Aries;
- calculate safe conjunction hit rows from already calculated Fixed Star positions and resolved targets;
- calculate batch conjunction results with ready / partial / noHits / notReady behavior;
- sort hits deterministically by orb ascending, then target order, then Fixed Star catalog/order;
- expose hit lookup, summary, capability and limitation helpers;
- provide a profile-level helper that composes existing Fixed Star position and target resolver layers.

This module depends on `src/fixedStarPositions.js`, `src/fixedStarTargets.js`, `src/fixedStarsData.js`, `src/birthDateTime.js` and `src/astroMath.js`. It does not calculate Fixed Star catalog rows, does not resolve target logic when ready targets are provided, does not calculate opposition/square/trine/sextile/paran/heliacal relationships, does not activate deferred targets, does not render display/UI/debug, does not read localStorage or DOM, does not import runtime Swiss Ephemeris or Astronomy Engine, does not create `src/fixedStars.js`, and does not include interpretations, mythology text, predictive text, transits or ritual scoring.

## `src/fixedStarsDisplay.js`

Defines the pure Sprint 14 Fixed Stars display helper.

Current responsibilities:

- format already calculated Fixed Star conjunction hit rows into safe user-facing text;
- preserve engine hit order while filtering invalid or unsafe hit rows;
- format ready, noHits and notReady display states for the `Неподвижные звезды` UI block;
- expose safe source and orb notes for Vronsky Table 18 and the global `1°00′` conjunction orb;
- expose summary, displayability and limitation helpers.

This module does not calculate conjunctions, calculate Fixed Star positions, resolve targets, import catalog rows, render UI/debug, read profiles, localStorage or DOM, call provider modules, import runtime Swiss Ephemeris or Astronomy Engine, create `src/fixedStars.js`, expose raw distances/longitudes/full arrays, or include interpretations, mythology text, predictive text, transits or ritual scoring.

## `src/fixedStarsDebug.js`

Defines the safe Sprint 14 Fixed Stars debug / QA guardrails helper for `?debug=1`.

Current responsibilities:

- build a compact Fixed Stars debug snapshot with catalog, policy and pipeline statuses/counts;
- expose source key, active/candidate row counts, source columns and initial reference epoch;
- expose conjunction-only relationship policy, global orb policy and active/deferred target set summaries;
- summarize Fixed Star positions, target resolver, conjunction and display readiness by status/count only;
- expose guardrail booleans for no interpretations, no deferred targets active, no non-conjunction relationships and no raw profile data;
- provide a formatter for the existing debug panel.

This module does not change catalog rows, position policy, target policy, conjunction/orb policy or normal UI behavior. It does not expose raw birth data, UTC, raw timezone values, coordinates, full profile JSON, provider payloads, full catalog/target/position/conjunction arrays or hit rows. It does not create `src/fixedStars.js`, does not add interpretations and does not import runtime Swiss Ephemeris or Astronomy Engine.

## `src/degreeRulersStarOfMagiData.js`

Defines the source-tracked Sprint 10 Degree Rulers Table 6 / Star of the Magi dataset.

Current responsibilities:

- expose verified Table 6 source metadata;
- store 360 manually verified degree-ruler rows across 12 zodiac signs;
- keep the dataset limited to the Star of the Magi degree-ruler source system;
- use septener planets only: Sun, Moon, Mercury, Venus, Mars, Jupiter and Saturn;
- store integer degree indexes `0` through `29`;
- expose dataset, source, deferred systems, deferred features, sign-row and validation helpers for future lookup work.

This module does not perform degree lookup, does not read natal planets, profiles, localStorage or DOM, does not call providers, and does not include Table 7 / Vronsky degree ruler rows, decans, terms mutations, fixed stars, houses, ASC / MC, transits, interpretations or ritual scoring.

## `src/degreeRulersVronskyData.js`

Defines the source-tracked Sprint 10 Degree Rulers Table 7 / Vronsky dataset.

Current responsibilities:

- expose verified Table 7 source metadata;
- store 360 verified degree-ruler rows across 12 zodiac signs;
- keep the dataset limited to the Vronsky Table 7 degree-ruler source system;
- preserve `sourceTokens` for row-level review;
- preserve `rulers[]` so multiple rulers stay structured;
- store per-ruler `retrograde` markers;
- support classical planets, outer planets, Chiron and Proserpina as verified Table 7 rulers;
- store integer degree indexes `0` through `29`;
- expose dataset, source, deferred systems, deferred features, row model, sign-row and validation helpers for future lookup work.

This module does not perform degree lookup, does not read natal planets, profiles, localStorage or DOM, does not call providers, and does not include Table 6 / Star of the Magi rows, fixed stars, houses, ASC / MC, transits, interpretations or ritual scoring.

## `src/degreeRulersVronsky.js`

Defines the pure Sprint 10 Degree Rulers Table 7 / Vronsky lookup engine.

Current responsibilities:

- look up verified Table 7 degree rulers by `signKey + degreeWithinSign`;
- use `degreeIndex = floor(degreeWithinSign)` for valid `0 <= degreeWithinSign < 30` inputs;
- keep `30°` invalid inside one sign so upstream sign resolution can handle the next sign;
- preserve `sourceTokens[]`, structured `rulers[]`, multiple rulers and per-ruler `retrograde` markers in output;
- support outer planets, Chiron and Proserpina because they are verified Table 7 rulers;
- resolve already-calculated natal planet objects through `sign.key + degree/minutes`;
- treat missing minutes as `0` when an explicit degree is present;
- fall back to `src/astroMath.js` longitude-derived sign and degree only when sign/degree fields are insufficient;
- evaluate arrays of natal planet objects in canonical planet order;
- build safe summary counts by ruler occurrence, multi-ruler rows, retrograde ruler entries and outer-planet ruler entries;
- expose capability flags that Table 7 / Vronsky degree rulers are supported while Table 6 / Star of the Magi degree rulers, fixed stars, houses, ASC / MC, transits and interpretations are not.

This module does not call providers, does not calculate planet coordinates, does not read profiles, localStorage or DOM, does not format UI rows, and does not include Table 6 / Star of the Magi degree ruler rows, decans, terms mutations, fixed stars, houses, ASC / MC, transits, interpretations or ritual scoring.

## `src/degreeRulersStarOfMagi.js`

Defines the pure Sprint 10 Degree Rulers Table 6 / Star of the Magi lookup engine.

Current responsibilities:

- look up verified Table 6 degree rulers by `signKey + degreeWithinSign`;
- use `degreeIndex = floor(degreeWithinSign)` for valid `0 <= degreeWithinSign < 30` inputs;
- keep `30°` invalid inside one sign so upstream sign resolution can handle the next sign;
- resolve already-calculated natal planet objects through `sign.key + degree/minutes`;
- treat missing minutes as `0` when an explicit degree is present;
- fall back to `src/astroMath.js` longitude-derived sign and degree only when sign/degree fields are insufficient;
- evaluate arrays of natal planet objects in canonical planet order;
- build safe summary counts by degree ruler;
- expose capability flags that Table 6 / Star of the Magi degree rulers are supported while Table 7 / Vronsky degree rulers, fixed stars, houses, ASC / MC, transits and interpretations are not.

This module does not call providers, does not calculate planet coordinates, does not read profiles, localStorage or DOM, does not format UI rows, and does not include Table 7 / Vronsky degree ruler rows, retrograde markers, multiple rulers, decans, terms mutations, fixed stars, houses, ASC / MC, transits, interpretations or ritual scoring.

## `src/detailedDignityDisplay.js`

Defines the pure Sprint 10 detailed dignity display helper.

Current responsibilities:

- format already-computed term lookup results into compact display rows;
- format already-computed Star of the Magi decan lookup results into compact display rows;
- format already-computed Table 6 / Star of the Magi degree-ruler lookup results into compact display rows;
- format already-computed Table 7 / Vronsky degree-ruler lookup results into compact display rows;
- preserve Table 7 multi-ruler display, outer planet labels, Chiron, Proserpina and per-ruler `R` markers in user-facing text;
- dispatch mixed ready lookup results to the correct formatter;
- filter invalid / incomplete results safely;
- build safe summary counts for terms, decans, Table 6 degree rulers and Table 7 Vronsky degree rulers;
- expose short display limitations for Table 6 / Table 7 source separation and interpretations being deferred.

This module does not import or call lookup engines, does not read datasets directly, does not calculate coordinates, signs, terms, decans or degree rulers, does not read profiles, localStorage or DOM, and does not include Table 6 or Table 7 source rows, Trigon/Vronsky decans, fixed stars, houses, ASC / MC, transits, interpretations or ritual scoring.

## `src/terms.js`

Defines the pure Sprint 10 terms lookup engine.

Current responsibilities:

- look up Vronsky Table 5 terms by `signKey + degreeWithinSign`;
- use the verified `src/termsData.js` rows and the half-open interval policy `[startDegree, normalizedEndExclusive)`;
- preserve `printedEndDegree` in output while using `normalizedEndExclusive` for final interval coverage;
- resolve already-calculated natal planet objects through `sign.key + degree/minutes`;
- fall back to `src/astroMath.js` longitude-derived sign and degree only when sign/degree fields are insufficient;
- evaluate arrays of natal planet objects in canonical planet order;
- build safe summary counts by ruler, positive/negative term values and score total;
- expose capability flags that terms are supported while decans, degree rulers, fixed stars, houses, ASC / MC, transits and interpretations are not.

This module does not call providers, does not calculate planet coordinates, does not read profiles, localStorage or DOM, does not format UI rows, and does not include decans, degree rulers, other Vronsky tables, fixed stars, houses, ASC / MC, transits, interpretations or ritual scoring.

## `src/decans.js`

Defines the pure Sprint 10 Star of the Magi decans lookup engine.

Current responsibilities:

- look up verified Figure 4.7 decans by `signKey + degreeWithinSign`;
- use the verified `src/decansData.js` rows and the half-open interval policy `[startDegree, endDegreeExclusive)`;
- keep `30°` invalid inside one sign so upstream sign resolution can handle the next sign;
- resolve already-calculated natal planet objects through `sign.key + degree/minutes`;
- fall back to `src/astroMath.js` longitude-derived sign and degree only when sign/degree fields are insufficient;
- evaluate arrays of natal planet objects in canonical planet order;
- build safe summary counts by decan ruler and decan index;
- expose capability flags that Star of the Magi decans are supported while Trigon/Vronsky decans, degree rulers, fixed stars, houses, ASC / MC, transits and interpretations are not.

This module does not call providers, does not calculate planet coordinates, does not read profiles, localStorage or DOM, does not format UI rows, and does not include Trigon / Vronsky decans, degree rulers, Vronsky degree rows, fixed stars, houses, ASC / MC, transits, interpretations or ritual scoring.

## `src/essentialDignities.js`

Defines the pure Sprint 9 essential dignity lookup engine.

Current responsibilities:

- evaluate already-calculated natal planet objects against `src/essentialDignitiesData.js`;
- resolve sign placement from `planet.sign.key`, with fallback to `src/astroMath.js` when a valid longitude is supplied;
- return safe dignity results with `planetKey`, `planetLabel`, `signKey`, `signLabel`, dignity flags, additive classical score, classical labels, modern labels and source key;
- use additive scoring for overlapping classical flags, for example Mercury in Virgo = domicile + exaltation and Mercury in Pisces = detriment + fall;
- keep Uranus, Neptune and Pluto as modern-rulership label-only cases with score `0`;
- summarize evaluated results into safe counts and strongest / weakest summary items for later UI work.

This module does not call providers, does not calculate planet coordinates, does not read profiles, localStorage or DOM, does not format UI rows, and does not include terms / decans / degree rulers, exact exaltation degree values, Vronsky rows, fixed stars, houses, ASC / MC, transits, interpretations or ritual scoring.

## `src/essentialDignityDisplay.js`

Defines pure display helpers for already-evaluated essential dignity results.

Current responsibilities:

- validate whether a passed essential dignity result is safe to display;
- format planet label, sign label and dignity labels into compact user-facing copy such as `Марс в Овне — обитель`;
- format multiple flags such as `Меркурий в Деве — обитель, экзальтация`;
- keep Uranus, Neptune and Pluto modern rulership labels as separate label-only display text;
- format neutral placements as `нейтрально`;
- expose score text, display type and compact summary counts for future collapsed UI;
- expose Sprint 9 limitation copy for deferred terms, decans, degree rulers and Vronsky tables.

This module does not import or call `src/essentialDignities.js`, providers, profiles, localStorage, DOM or UI code. It does not calculate dignity flags, signs, coordinates, terms / decans / degree rulers, exact exaltation degrees, Vronsky rows, houses, ASC / MC, transits, interpretations or ritual scoring.

## `src/essentialDignitiesForProfile.js`

Builds the safe read-only essential dignities view model for an active saved profile.

Current responsibilities:

- call `src/natalPlanetsForProfile.js` and require ready natal planet output first;
- call `src/essentialDignities.js` only with already calculated natal planet positions;
- format dignity output through `src/essentialDignityDisplay.js`;
- build collapsed-section summary through `summarizeEssentialDignities()`;
- return `incomplete` without dignity rows when natal planets are not ready;
- expose only formatted dignity text, summary counts and safe limitations to `src/profileUi.js`.

This module does not read localStorage, does not render DOM, does not send birth data externally, does not call providers directly, and does not calculate terms / decans / degree rulers, Vronsky rows, houses, ASC / MC, transits, fixed stars, interpretations or ritual scoring.

## `src/detailedDignitiesForProfile.js`

Builds the safe read-only detailed dignity view model for an active saved profile.

Current responsibilities:

- call `src/natalPlanetsForProfile.js` and require ready natal planet output first;
- evaluate already calculated natal planet positions through the existing Terms, Decans, Table 6 / Star of the Magi degree-ruler and Table 7 / Vronsky degree-ruler lookup engines;
- format all lookup output through `src/detailedDignityDisplay.js`;
- group display rows by natal planet for the collapsible `Термы, деканы и градусы` section inside `Мои карты`;
- return a safe fallback for `Общий день` or profiles without ready natal planets;
- expose only formatted text, detail/source labels, grouped rows, summary and limitations to `src/profileUi.js`.

This module does not read localStorage, does not render DOM, does not call providers directly, does not calculate planetary positions, does not expose raw birth data, source tokens, technical source keys, raw longitude or coordinates, and does not include houses, ASC / MC, transits, fixed stars, interpretations or ritual scoring.

## `src/detailedDignitiesDebug.js`

Builds the safe debug summary for the read-only detailed dignity UI state.

Current responsibilities:

- read the active profile only for `?debug=1` debug output;
- summarize panel status, user-facing enabled / disabled state, natal planets readiness, collapsed default/state and `Мои карты` location;
- count planet groups and formatted rows for terms, decans, Table 6 / Star of the Magi degree rulers and Table 7 / Vronsky degree rulers;
- expose only human-readable source labels: `Вронский, термы`, `Звезда Магов` and `Вронский`;
- expose capability flags that terms, decans, Table 6 and Table 7 are available, Table 6 / Table 7 are separated, and interpretations, fixed stars, houses, ASC / MC and transits are not supported.

This helper does not return raw birth date, birth time, UTC datetime, timezone values, place objects, coordinates, raw planet longitudes, source tokens, source keys/source systems, full profile JSON, full Table 5 / Table 6 / Table 7 rows or interpretation text.

## `src/natalPlanetsDebug.js`

Builds the safe debug summary for the read-only natal planets UI state.

Current responsibilities:

- read the active profile only for `?debug=1` debug output;
- summarize panel status, user-facing enabled / disabled state, UTC conversion readiness, provider validation state, planet counts, formatted planet counts, collapsible default and profile-panel location;
- map missing profile fields to human-readable labels;
- keep houses, ASC / MC, transits, aspects and orbs explicitly `notSupported`.

This helper does not return raw birth date, birth time, UTC datetime, timezone values, coordinates, raw planet longitudes, speed values, full profile JSON, or the full active-profile planet list.

## `src/natalAspectsDebug.js`

Builds the safe debug summary for the read-only natal aspects UI state.

Current responsibilities:

- read the active profile only for `?debug=1` debug output;
- summarize panel status, user-facing enabled / disabled state, natal planets readiness, aspect engine status, major-only aspect set, configured orb policy, aspect counts, collapsible default and profile-panel location;
- map missing profile fields to human-readable labels;
- keep transits, houses, ASC / MC, fixed stars and interpretations explicitly `notSupported`.

This helper does not return raw birth date, birth time, UTC datetime, timezone values, coordinates, raw planet longitudes, speed values, raw aspect angles, `allowedOrb`, full profile JSON, or the full active-profile aspect list.

## `src/essentialDignitiesDebug.js`

Builds the safe debug summary for the read-only essential dignities UI state.

Current responsibilities:

- read the active profile only for `?debug=1` debug output;
- summarize panel status, user-facing enabled / disabled state, natal planets readiness, dignity engine status, source policy, modern outer-planet label-only policy, scoring model, score/count summary, collapsible default and profile-panel location;
- map missing profile fields to human-readable labels;
- keep terms, decans, degree rulers, exact exaltation degrees and Vronsky tables explicitly `deferred`;
- keep houses, ASC / MC, transits and interpretations explicitly `notSupported`.

This helper does not return raw birth date, birth time, UTC datetime, timezone values, coordinates, raw planet longitudes, speed values, full profile JSON, full natal planet lists, full dignity result lists, exact exaltation degree values, terms / decans / degree ruler rows, Vronsky rows, houses / ASC / MC values, transits, interpretations or ritual scoring.

## `src/natalPlanetDisplay.js`

Defines pure display helpers for already-calculated natal planet positions.

Current responsibilities:

- validate whether a passed planet position object is safe to display;
- format label, tropical sign, degree and minute text into compact user-facing copy;
- format retrograde state with the short `R` marker only when `retrograde === true`;
- format speed as a separate optional text field without adding it to the primary display line;
- expose the required Sprint 7 limitation copy for houses, ASC / MC, transits, natal aspects and orbs;
- filter invalid / incomplete planet objects without producing `NaN`, `undefined` or fake signs.

This module does not import `astronomy-engine`, does not call provider modules, does not read profiles or localStorage, does not integrate with the dashboard, and does not calculate planetary positions, houses, ASC / MC, transits, aspects or orbs.

## `src/preciseEphemeris.js`

Reads pre-calculated Swiss Ephemeris data from `src/ephemeris-data.js`.

Current responsibilities:

- returning exact lunar events
- returning Moon sign transitions
- returning Void of Course Moon intervals
- returning major Moon aspects
- returning exact New Moon / Full Moon events
- returning the next exact New Moon / Full Moon event
- returning lunar day boundaries for Moscow
- returning Chinese solar month boundaries if included in generated data

This is the preferred source for precise lunar data.

## `src/ephemeris-data.js`

Stores generated ephemeris data for 2026–2030.

Generated data currently includes:

- Moon sign transitions
- Void of Course Moon intervals
- major Moon aspects to planets
- exact New Moons and Full Moons
- lunar day boundaries for Moscow
- Chinese solar month boundaries

This file should normally be generated by script, not edited by hand.

## `src/dayIndicators.js`

Calculates day indicators.

Current responsibilities:

- lunar symbol
- Ba Zi day
- Tong Shu day indicator
- Chinese solar month / Jie Qi month handling
- Moscow energetic day transition at 23:00

Important rule:

For Tong Shu and related energetic day calculations:

- Moscow time is used
- Jie Qi month is used
- energetic day changes at 23:00

If this logic changes or becomes location-aware, this file must be updated.

## `src/fieldQuality.js`

Builds the “field quality” interpretation for the current moment.

Current responsibilities:

- receives lunar data
- receives aspect data
- receives Tong Shu data
- receives planetary day/hour data
- returns a field quality phrase
- returns main moment advice
- returns practical scores
- returns reason list
- returns “good for” list
- returns “not good for” list
- returns compact warning list for the `Осторожно сегодня` block

Important current rule:

The previous tense Moon aspect is treated as a strong factor only during the first 4 hours after the exact aspect.

If this logic expands into modes such as Tarot, Candles, Money, Relationships, Cleansings, or Forecasts, document the new data flow here.

## `src/debugDate.js`

Small development-only helper for manual dashboard checks.

Current behavior:

- reads `debugDate` from URL query parameters;
- returns a valid `Date` when the parameter is present and parseable;
- returns `null` when the parameter is missing or invalid.

`src/app.js` uses this helper only to choose the dashboard `now` value.

Without `debugDate`, the app uses the real current time.

## `src/debugPanel.js`

Formats the hidden technical debug panel and detects debug mode.

Current behavior:

- reads `debug=1` from URL query parameters;
- returns hidden-panel text for calculation verification;
- includes calculated time, `debugDate` status, Moscow day system, Moon sign, VOC, Moon aspects, indicators, safe profile debug state, safe personal debug state, safe natal-engine/provider debug state, safe natal planets UI debug state, safe natal aspects UI debug state, safe essential dignities UI debug state, safe detailed dignities UI debug state, safe Houses / ASC / MC UI debug state, safe Arabic Parts UI debug state, best-window debug reasoning, ephemeris range/source, and cache version;
- allows technical timestamps with seconds because this is debug-only.

The debug panel does not store data and does not expose birth data, raw place objects, raw coordinates, exact birth timezone values, raw planet/lots/cusp longitudes, formula operand arrays, source tokens, source keys/source systems, full tables, full result arrays or full profile data.

## `src/dashboardModes.js`

Defines the dashboard mode list for Sprint 2.

Current behavior:

- exports the seven allowed dashboard modes;
- exports `DEFAULT_DASHBOARD_MODE` as `general`;
- validates mode keys through `isDashboardModeKey`;
- does not calculate recommendations or best windows.

The currently selected dashboard mode is held in memory in `src/app.js`.
No `localStorage` or persistence is used yet.

## `src/modeScores.js`

Builds mode-specific score rows for the dashboard.

Current responsibilities:

- receives selected dashboard mode;
- receives the current dashboard context from `src/app.js`;
- receives base `fieldQuality` output;
- returns score items for the `Качество поля` metrics block;
- keeps score values clamped to the 1–10 range;
- falls back to `Общее` for unknown mode keys.

The helper uses existing moment data only. It does not calculate ephemeris events and does not store user data.

## `src/modeRecommendations.js`

Builds mode-specific `Хорошо` / `Осторожно` recommendation lists for the `Качество поля` card.

Current responsibilities:

- receives selected dashboard mode;
- receives the current dashboard context from `src/app.js`;
- receives base `fieldQuality` output;
- returns `{ good, careful }`;
- limits each list to 3 compact items;
- falls back to `Общее` for unknown mode keys.

The helper reads existing moment data only. It does not calculate ephemeris events, choose best windows, or store user data.

## `src/bestWindows.js`

Calculates best-window candidates for the current Moscow day.

Current responsibilities:

- receives selected dashboard mode and calculation date;
- scans the Moscow day by fixed time slots;
- excludes slots where the Moon is void of course;
- scores slots by mode, planetary hour, Moon sign / element, field quality, warnings, and nearby tense Moon aspects;
- groups adjacent good slots into intervals;
- returns up to 2 best windows with `start`, `end`, `score`, `label`, `suitableFor`, `reasons`, and `cautions`.
- formats a compact dashboard view with title, time ranges, suitable-for text, reasons, and cautions.
- exports `getBestWindowsDebug()` for hidden debug-panel reasoning without changing the normal `getBestWindows()` array return type.

`src/app.js` calls this helper during dashboard render and displays its output in the `Лучшее окно сегодня` card.
If no good windows are returned, the card renders a calm mode-specific fallback from the display formatter.
When `?debug=1` is active, `src/app.js` also requests best-window debug data and passes it to `src/debugPanel.js`.

## `src/profileModel.js`

Defines the Sprint 3 profile domain model and validation helpers.

Current responsibilities:

- create a unique profile id with `crypto.randomUUID()` when available and a dependency-free fallback;
- create an empty safe profile draft with Moscow defaults;
- expose default profile settings for birth time accuracy, house system, zodiac, and current calculation place;
- normalize partial profile input into a complete profile object;
- trim user text fields;
- normalize optional manual birth place coordinates into `birthPlace.coordinates.latitude` / `longitude`;
- validate manual birth place coordinates as a pair with latitude `-90..90` and longitude `-180..180`;
- reject unsupported enum values during validation;
- validate required profile fields and return testable errors;
- expose a boolean `isValidProfile()` wrapper.

The module does not store profiles, does not use `localStorage`, does not render UI, does not call geocoding APIs, does not infer coordinates from city/country/timezone, and does not calculate natal charts, houses, ASC / MC, or personal transits.

## `src/profileStorage.js`

Stores profiles locally on the device.

Current responsibilities:

- read and write profiles through `localStorage`;
- use `astroPwa.profiles.v1` for profile list storage;
- use `astroPwa.activeProfileId.v1` for active profile id storage;
- normalize and validate profiles through `src/profileModel.js`;
- filter invalid profiles instead of returning them;
- return `[]` for empty, corrupted, or non-array profile storage;
- add, update, and delete profiles through result objects;
- reset active profile to `Общий день` when the active profile is deleted or missing;
- expose `clearProfileStorageForTests()` for unit tests.

The module does not render UI, does not call `fetch`, does not use geolocation, does not call external geocoding APIs, and does not calculate natal charts, houses, ASC / MC, or personal transits.

## `src/profileUi.js`

Formats profile-related UI view models and text for the dashboard.

Current responsibilities:

- keep the profile shell labels and privacy copy in one small helper;
- always include `Общий день` as the non-personal default item;
- convert stored profiles into a compact editable list view;
- mark the active profile and expose explicit select/edit actions for the list;
- provide the empty-state copy for `Мои карты`;
- provide add-profile copy;
- describe create/edit form titles and delete-button visibility;
- convert a profile into safe form values for prefill;
- map profile validation errors into short Russian UI messages;
- expose manual birth place latitude / longitude form values for profile editing;
- format the readiness-only `Натальные планеты` block inside `Мои карты` using `src/birthDateTime.js`;
- translate natal readiness missing fields into human-readable labels without raw birth data or technical keys;
- format the collapsible `Натальные аспекты`, `Достоинства планет` and `Термы, деканы и градусы` block view models from their profile helpers;
- format the collapsible `Дома и углы карты` block view model from `src/housesForProfile.js`;
- format the collapsible `Жребии и арабские части` block view model from `src/arabicPartsForProfile.js`;
- format the collapsible `Особые точки карты` block view model from `src/specialPointsForProfile.js`;
- format the collapsible `Неподвижные звезды` block view model by composing `src/fixedStarConjunctions.js` with `src/fixedStarsDisplay.js`;
- format the compact `Лично для меня` dashboard block from `src/personalContext.js`;
- include safe personal recommendation sections from `src/personalRecommendations.js`;
- translate missing personal profile fields into human-readable Russian copy without rendering technical keys.

This module does not store profiles, export/import data, call natal providers, show natal planet values, or calculate natal charts / houses / ASC / MC / personal transits / aspects / orbs.

## `src/profileImportExport.js`

Serializes and imports local profile backup JSON.

Current responsibilities:

- create the export envelope with `schemaVersion`, `app`, `exportedAt`, and `profiles`;
- parse imported JSON safely;
- validate imported profiles through `src/profileModel.js`;
- import only valid profiles into `src/profileStorage.js`;
- regenerate duplicate profile ids so existing profiles are not overwritten;
- return short result objects for UI status.

The module does not call `fetch`, does not use geolocation, does not upload profile data, does not use cloud sync, and does not calculate natal charts / personal transits.

## `src/personalProfileInput.js`

Converts a selected profile into safe input and readiness state for future personal astrology work.

Current responsibilities:

- accept a profile object or `null` / `Общий день`;
- normalize selected profile fields through `src/profileModel.js`;
- return profile identity, birth data, birth place, current place, house system, and zodiac settings as structured input;
- return `missingFields` for absent birth date, required birth time, birth coordinates, or birth timezone;
- return warnings for unknown birth time, missing birth coordinates, and missing birth timezone;
- return explicit calculation capabilities with natal planets, houses, ASC / MC, personal transits, Moon in natal house, transit orbs, and personal ritual scoring disabled;
- expose `createPersonalProfileInput()`, `getPersonalProfileReadiness()`, and `getPersonalCalculationCapabilities()`.

This helper does not store data, does not render UI, does not call geocoding APIs, does not use `fetch` or geolocation, and does not calculate natal planets, houses, ASC / MC, Moon in natal house, or personal transits.

## `src/personalContext.js`

Builds safe user-facing personal readiness / context copy for the dashboard.

Current responsibilities:

- accept a profile object or `null` / `Общий день`;
- call `src/personalProfileInput.js` to reuse profile normalization, readiness, missing field, warning, and capability logic;
- return `hasActiveProfile`, `profileName`, `title`, `status`, `summary`, `readiness`, `limitations`, `nextSteps`, `missingFields`, `warnings`, and `capabilities`;
- expose status helpers for `general`, `incomplete`, `readyForContext`, and `calculationLimited`;
- keep personal context honest when the profile is filled but natal calculation capabilities are still unavailable.

`src/app.js` now uses this helper for the compact `Лично для меня` dashboard block when a saved profile is active.

This helper does not render UI, does not store data, does not call external APIs, and does not calculate natal planets, houses, ASC / MC, Moon in natal house, personal transits, transit orbs, or personal ritual scoring.

## `src/personalRecommendations.js`

Builds safe personal recommendation sections for the `Лично для меня` dashboard block.

Current responsibilities:

- accept the safe context object from `src/personalContext.js`;
- return compact `goodNow`, `nextSteps`, and `cautions` lists;
- translate missing profile fields into human-readable next steps;
- keep each list capped at 3 items;
- avoid rendering birth date, birth time, coordinates, full profile JSON, or technical missing-field keys;
- state clearly that recommendations are based on the general moment while natal calculations are unavailable.

This helper does not store data, does not call external APIs, does not calculate natal planets, houses, ASC / MC, Moon in natal house, personal transits, transit orbs, or personal ritual scoring.

## `scripts/generate-ephemeris.cjs`

Generates Swiss Ephemeris data.

Current output:

- Moon sign transitions
- Void of Course Moon intervals
- major Moon aspects to planets
- exact New Moons and Full Moons
- lunar day boundaries for Moscow
- Chinese solar month boundaries

Result is saved into:

- `src/ephemeris-data.js`

Swiss Ephemeris is not used directly in the browser.

It is used at generation time.

## `scripts/calibrate-field-quality.js`

Prints diagnostic reports for selected control dates.

Current purpose:

- inspect field quality rules
- tune weights and interpretations
- compare expected vs actual field quality outputs

If field quality logic becomes more complex, this script should be kept updated as a calibration tool.

## `sw.js`

Service Worker for PWA caching.

Current behavior:

- cache-first strategy for static files

Important:

When changes must reliably appear on iPhone after deployment, update `CACHE_NAME`.

Current cache version:

```txt
lunar-calendar-v95
```

If a deployment appears stale on iPhone, first check whether `CACHE_NAME` was updated.

---

# Current Data Flow

## Main Dashboard Flow

1. `src/app.js` gets the current time.

   For development checks, `src/debugDate.js` may override this with `?debugDate=...`.
   `src/debugPanel.js` may expose a hidden technical panel when `?debug=1`.

   `src/app.js` also owns the current dashboard mode in memory for Sprint 2.

2. Exact lunar data is requested from `src/preciseEphemeris.js`.

3. `src/preciseEphemeris.js` reads from `src/ephemeris-data.js`.

4. If exact data is unavailable, fallback values may come from `src/astro.js`.

5. `src/dayIndicators.js` calculates:
   - lunar symbol
   - Ba Zi day
   - Tong Shu indicator
   - solar month / Jie Qi context
   - Moscow energetic day with 23:00 transition

6. `src/fieldQuality.js` combines:
   - lunar state
   - Moon aspects
   - VOC state
   - planetary day/hour
   - Tong Shu / Ba Zi / lunar day context
   - compact warnings for dashboard red flags

7. `src/moonPrecisionDisplay.js` formats compact Moon precision rows for the hero Moon block.

8. `src/moonSignDisplay.js` formats the next Moon sign transition line for the hero Moon block.

9. `src/planetaryHourHints.js` formats the practical hint for the current planetary hour.

10. `src/format.js` formats dates and times.

11. `src/vocDisplay.js` formats the VOC display state for the dashboard.

12. `src/dashboardModes.js` defines allowed dashboard modes and default mode.

13. `src/modeScores.js` converts the selected mode and current moment context into score rows.

14. `src/modeRecommendations.js` converts the selected mode and current moment context into `Хорошо` / `Осторожно` lists.

15. `src/bestWindows.js` calculates best-window candidates for the selected mode, provides the compact dashboard view model, and exposes debug reasoning for the hidden debug panel.

16. `src/profileModel.js` defines the local-first profile data model, defaults, normalization, and validation helpers.

17. `src/profileStorage.js` stores profiles and active profile id locally through `localStorage`.

18. `src/profileUi.js` formats the minimal `Профиль` / `Мои карты` shell, active-profile state, create/edit form view, and read-only natal planets block.

19. `src/profileImportExport.js` serializes and imports local profile backup JSON.

20. `src/personalProfileInput.js` converts selected profile data into safe future personal-calculation input and readiness/capability state without performing natal calculations.

21. `src/personalContext.js` converts personal profile readiness into safe user-facing context copy for the `Лично для меня` dashboard block without performing natal calculations.

22. `src/personalRecommendations.js` converts personal context into safe `goodNow`, `nextSteps`, and `cautions` sections for the `Лично для меня` dashboard block.

23. `src/natalChartModel.js` defines neutral natal result shapes, feature capabilities, and normalization helpers without calculating natal data.

24. `src/natalEngine.js` defines the strict natal engine interface and currently returns `incomplete` / `notSupported` because no provider is connected.

25. `src/birthDateTime.js` prepares birth date/time/timezone readiness and converts safe local birth time to UTC ISO through `luxon`; ambiguous/nonexistent DST times and missing/invalid inputs fail closed.

26. `src/housesInputGuardrails.js` defines pure readiness guardrails for future Houses / ASC / MC work, requiring exact birth time and birth coordinates without calculating angles or houses.

27. `src/ascMc.js` calculates ASC / MC / DSC / IC as pure angles from validated UTC/date and coordinates, while keeping houses, house cusps and planet-in-house assignment disabled.

28. `src/wholeSignHouses.js` calculates pure Whole Sign houses from a ready ASC sign or ASC / MC result, keeps `houseSystem: "whole-sign"` explicit, respects profile `houseSystem` selection for the Whole Sign path, and does not implement Equal House, Placidus, quadrant cusps, a generic router or planet-in-house assignment.

29. `src/equalHouseHouses.js` calculates pure Equal House / Равнодомная cusps and house spans from an exact ASC longitude, keeps `houseSystem: "equal-house"` explicit, respects profile `houseSystem` selection for the Equal House path, and does not implement Whole Sign, Placidus, quadrant cusps, a generic router or planet-in-house assignment.

30. `src/placidusHouses.js` calculates pure Placidus cusps and house spans with static benchmark-backed validation, returns explicit unsupported behavior for high-latitude / circumpolar cases, and does not fallback to Whole Sign / Equal House, import runtime `swisseph`, implement a generic router or assign planets to houses.

31. `src/houseSystemResolver.js` normalizes the selected profile / explicit house-system value, routes to exactly one of the Whole Sign, Equal House or Placidus engines, preserves selected engine status/reason, defaults missing selection to `whole-sign`, and does not implement house calculations directly or assign planets to houses.

32. `src/planetInHouses.js` assigns ready natal planets to houses for the selected house system, using sign-distance for Whole Sign and ready cusp spans for Equal House / Placidus. It does not calculate houses, ASC / MC, planets, UI or interpretations.

33. `src/housesDisplay.js` formats ready Houses / ASC / MC / planet-in-house results into safe display rows and fallback states. It does not calculate houses, route selected systems, assign planets, render UI or add interpretations.

34. `src/housesForProfile.js` builds the profile-level safe view model for the `Дома и углы карты` UI block by composing selected-system houses, planet-in-house assignments and display formatting. It passes the already calculated selected house result into planet-in-house assignment so the view model does not combine independent house calculations. It does not calculate houses or render UI directly.

35. `src/houseCusps.js` canonicalizes ready selected house-system results into 12 house cusp outputs for Whole Sign sign boundaries, Equal House exact 30-degree cusps and Placidus benchmark-validated quadrant cusps. It does not add new house math, Pars Fortuna, Arabic Parts, day/night status or UI.

36. `src/dayNightChart.js` determines chart sect through geometric Sun altitude and returns day / night / boundary status for future lots and parts. It does not calculate Pars Fortuna, Arabic Parts, houses, UI or interpretations.

37. `src/parsFortuna.js` calculates Pars Fortuna / Lot of Fortune from numeric ASC, Sun and Moon longitudes using the verified day/night formula policy. It does not implement a broad Arabic Parts catalog, Lot of Spirit, house assignment, UI or interpretations.

38. `src/arabicPartsData.js` exposes the data-only Arabic Parts source decision / formula dataset. Pars Fortuna and Lot of Spirit are active verified formula rows; additional candidate parts remain inactive/deferred until source verification. It does not calculate formulas, import the Pars Fortuna engine, implement a broad Arabic Parts engine, add UI or add interpretations.

39. `src/arabicParts.js` calculates only active verified Basic Arabic Parts formulas from the dataset. In Sprint 12 that means Pars Fortuna and Lot of Spirit only. It uses numeric ASC, Sun and Moon longitudes plus explicit day/night chart status, and it does not assign houses, activate deferred parts, add UI or add interpretations.

40. `src/arabicPartsHouseAssignment.js` assigns calculated active Arabic Parts / lots to selected-system canonical house cusps by numeric longitude. It uses half-open spans, supports Whole Sign / Equal House / Placidus through `src/houseCusps.js`, and does not calculate formulas, activate deferred parts, add UI or add interpretations.

41. `src/arabicPartsDisplay.js` formats already calculated lots / Arabic Parts and optional house assignments into safe display rows, chart sect labels, summaries and fallback states. It does not calculate formulas, assign houses, add UI/debug or add interpretations.

42. `src/arabicPartsForProfile.js` builds the profile-level safe view model for the `Жребии и арабские части` UI block by composing active Arabic Parts calculation, lots / Arabic Parts house assignment and display formatting. It does not calculate formulas, assign houses itself or render UI directly.

43. `src/arabicPartsDebug.js` builds safe status/count/capability/privacy debug state for the `Жребии и арабские части` UI block. It does not expose raw profile data, raw coordinates, raw longitudes, formula operands or full result arrays.

44. `src/lunarNodes.js` calculates the active mean Lunar Nodes layer: North Node from the `mean-lunar-node` source policy and South Node as North Node + 180°. It does not calculate true node, Lilith, Selena, house assignment, UI/debug or interpretations.

45. `src/lunarNodesHouseAssignment.js` assigns North/South Nodes to selected-system canonical house cusps. It uses numeric longitude, half-open spans, exact-cusp boundary ownership and wrap-around support, and does not calculate nodes or houses.

46. `src/lilith.js` calculates only Mean Black Moon Lilith / Mean Lunar Apogee from the `mean-black-moon-lilith` source policy. It does not calculate true/osculating/interpolated Lilith, Selena, house assignment, UI/debug or interpretations.

47. `src/selena.js` calculates only Selena / White Moon from the selected `selena-white-moon` source policy. It marks the point as `fictitious-calculated-point` and does not calculate alternate Selena variants, Lunar Nodes, Lilith, house assignment, UI/debug or interpretations.

48. `src/specialPointsDisplay.js` formats already calculated Special Points into safe display rows, optional Lunar Nodes house labels, combined summaries, fallback states and limitations. It does not calculate points, assign houses, render UI/debug or add interpretations.

49. `src/specialPointsForProfile.js` composes ready Lunar Nodes, Mean Lilith, Selena and optional Lunar Nodes house-assignment results into a safe profile-level view model for the `Особые точки карты` UI block. It does not calculate point longitudes directly, call providers, expose raw profile fields, add debug or interpretations.

50. `src/planetaryPositionProvider.js` defines the future planetary position provider interface and currently returns `incomplete` / `notSupported` without calculating planets.

51. `src/natalProviderAdapter.js` defines the future natal provider adapter contract and currently returns explicit `notSupported` by default without connecting a real provider.

45. `src/astronomyEngineProvider.js` isolates the installed `astronomy-engine@2.1.19` provider, imports it through the tracked vendored runtime asset, audits source behavior, and calculates validated natal planet longitudes / speed / retrograde in the provider layer.

34. `src/natalProviderValidationSummary.js` exposes a safe provider validation summary for debug/reporting without calculating planets, reading profile data, or importing the `astronomy-engine` provider module.

35. `src/natalPlanetDisplay.js` formats already-calculated natal planet positions into safe compact display objects without calling providers, profiles, localStorage or UI code.

36. `src/natalPlanetsForProfile.js` connects profile UTC readiness to the validated provider and display formatter for the read-only `Мои карты` natal planets panel; it fails closed without planets when readiness is incomplete.

37. `src/natalAspectEngine.js` calculates pure natal aspects between supplied natal planet positions using the Sprint 8 major aspect set and explicit orb policy; it does not call providers, profiles, UI code, transits, houses or ASC / MC.

38. `src/natalAspectDisplay.js` formats already-calculated natal aspects into safe compact display objects and summary counts without calculating aspects or calling providers / profiles / UI code.

39. `src/natalAspectsForProfile.js` connects ready natal planet output to the natal aspect engine and aspect display helper for the read-only collapsible `Мои карты` natal aspects section; it fails closed without aspects when natal planets are incomplete.

40. `src/essentialDignitiesData.js` defines the source-tracked Sprint 9 essential dignity dataset for classical basic dignity tables, label-only modern outer rulerships, score model and deferred features; it does not perform lookup or render UI.

41. `src/termsData.js` defines the source-tracked Sprint 10 Vronsky Table 5 — Terms dataset with 60 verified rows, printed ranges, normalized half-open interval boundaries and deferred feature metadata; it does not perform degree lookup or render UI.

42. `src/decansData.js` defines the source-tracked Sprint 10 Decans Star of the Magi / Egyptian tradition dataset with 36 verified rows, septener-only rulers, half-open interval boundaries and deferred system / feature metadata; it does not perform degree lookup or render UI.

43. `src/fixedStarsData.js` defines the source-tracked Sprint 14 Fixed Stars catalog dataset with 13 manually verified active Vronsky Table 18 rows, preserved 1950 / 1970 / 1990 source columns, 1990 initial reference epoch and explicit orb / target / relationship policies; it does not calculate positions or conjunctions.

43a. `src/fixedStarPositions.js` calculates pure Fixed Star positions from source-tracked Vronsky rows using exact source epochs, explicit interpolation, explicit extrapolation and wrap-around handling; it does not resolve targets, calculate conjunctions, render UI/debug or add interpretations.

43b. `src/fixedStarTargets.js` resolves pure Fixed Star target rows from ready natal planets and ASC / MC / DSC / IC angle results, preserving ready / partial / notReady states and deferred target metadata; it does not calculate fixed star positions or conjunctions.

43c. `src/fixedStarConjunctions.js` calculates pure Fixed Star conjunction hits from already calculated Fixed Star positions and resolved targets using the global `1°00′` orb, shortest angular distance, wrap-around support and inclusive boundary policy; it does not render UI/debug, calculate other relationships, activate deferred targets or add interpretations.

43d. `src/fixedStarsDisplay.js` formats already calculated Fixed Star conjunction hits, ready/noHits/notReady states and safe source/orb notes for UI; it does not calculate conjunctions, resolve targets, calculate positions, render UI/debug, expose raw arrays or add interpretations.

43e. The `Неподвижные звезды` UI block is rendered inside `Мои карты` after `Особые точки карты`. It is collapsed by default, shows conjunction hits / noHits / partial / notReady states, renders source/orb notes once at the bottom, and does not add debug or interpretations.

43f. `src/fixedStarsDebug.js` builds safe Fixed Stars debug / QA guardrail snapshots for `?debug=1`; it exposes only catalog/policy/pipeline counts, statuses and guardrail booleans and does not expose raw profile data, full arrays, provider payloads or interpretations.

44. `src/degreeRulersStarOfMagiData.js` defines the source-tracked Sprint 10 Degree Rulers Table 6 / Star of the Magi dataset with 360 verified rows, integer degree indexes, septener-only rulers and deferred system / feature metadata; it does not perform degree lookup or render UI.

45. `src/degreeRulersVronskyData.js` defines the source-tracked Sprint 10 Degree Rulers Table 7 / Vronsky dataset with 360 verified rows, source tokens, structured `rulers[]`, per-ruler retrograde markers, outer planets, Chiron and Proserpina; it does not perform degree lookup or render UI.

46. `src/degreeRulersVronsky.js` performs pure Sprint 10 Degree Rulers Table 7 / Vronsky lookup over the verified dataset by sign and degree, uses `degreeIndex = floor(degreeWithinSign)` for `0 <= degreeWithinSign < 30`, preserves `sourceTokens[]`, `rulers[]` and per-ruler retrograde markers, supports already-calculated natal planet objects, preserves source system metadata in output, and does not render UI.

47. `src/terms.js` performs pure Sprint 10 terms lookup over the verified Vronsky Table 5 dataset by sign and degree, supports already-calculated natal planet objects, preserves printed ranges in output, and does not render UI.

48. `src/decans.js` performs pure Sprint 10 Star of the Magi decans lookup over the verified Figure 4.7 dataset by sign and degree, supports already-calculated natal planet objects, preserves source system metadata in output, and does not render UI.

49. `src/degreeRulersStarOfMagi.js` performs pure Sprint 10 Degree Rulers Table 6 / Star of the Magi lookup over the verified dataset by sign and degree, uses `degreeIndex = floor(degreeWithinSign)` for `0 <= degreeWithinSign < 30`, supports already-calculated natal planet objects, preserves source system metadata in output, and does not render UI.

50. `src/detailedDignityDisplay.js` formats already-computed Sprint 10 term, decan and degree-ruler lookup results into compact display rows and summary counts without calling lookup engines or rendering UI.

50. `src/essentialDignities.js` evaluates already-calculated natal planet objects against the Sprint 9 essential dignity dataset and returns flags, additive score, labels and safe summary counts without calling providers or rendering UI.

51. `src/essentialDignityDisplay.js` formats already-evaluated essential dignity results into compact user-facing rows and summary counts without calling the lookup engine or rendering UI.

52. `src/essentialDignitiesForProfile.js` connects ready natal planet output to the essential dignity lookup and display helpers for the read-only collapsible `Мои карты` dignity section; it fails closed without dignity rows when natal planets are incomplete.

53. `src/natalPlanetsDebug.js` converts active-profile natal planets UI state into a sanitized debug summary with status/counts/capabilities only.

54. `src/natalAspectsDebug.js` converts active-profile natal aspects UI state into a sanitized debug summary with status/counts/capabilities only.

55. `src/essentialDignitiesDebug.js` converts active-profile essential dignities UI state into a sanitized debug summary with status/counts/source policy/deferred capability labels only.

56. `src/detailedDignitiesDebug.js` converts active-profile detailed dignity UI state into a sanitized debug summary with status/counts/source labels/capability and privacy flags only.

57. `src/arabicPartsDebug.js` converts active-profile Arabic Parts UI state into a sanitized debug summary with readiness booleans, chart sect status, formula keys, counts, capabilities and privacy flags only.

58. `src/debugPanel.js` formats the hidden debug panel when enabled, including safe profile summary state, safe personal readiness/capability state, natal engine state, provider validation summary, natal planets UI summary, natal aspects UI summary, essential dignities UI summary, detailed dignities UI summary, Houses UI summary and Arabic Parts UI summary without birth details.

59. `src/app.js` updates DOM elements on the main dashboard, mode selector, profile shell, advanced profile blocks including Fixed Stars, personal context/recommendations block, mode-specific scores, mode-specific recommendations, best-window card, and optional debug panel.

## Current Preferred Source Order

For lunar and astrological events:

1. `src/preciseEphemeris.js`
2. `src/ephemeris-data.js`
3. fallback from `src/astro.js` only if precise data is not available

For UI display:

1. prepared data in `src/app.js`
2. formatting through `src/format.js`
3. final DOM update through existing dashboard nodes

---

# Precise Ephemeris Data

Swiss Ephemeris is used during generation, not directly in the browser.

Generation script:

```txt
scripts/generate-ephemeris.cjs
```

Generated output:

```txt
src/ephemeris-data.js
```

Generated data currently covers:

- 2026–2030
- Moon sign transitions
- Void of Course Moon intervals
- major Moon aspects to planets
- exact New Moons
- exact Full Moons
- lunar day boundaries for Moscow
- Chinese solar month boundaries

This keeps the app static and PWA-friendly while still allowing precise calculations.

If additional ephemeris data is added later, update this section.

Examples of future additions that would require updating this file:

- personal transits
- natal chart calculations
- planetary positions for all planets
- house cusps
- Ascendant / MC
- fixed stars
- Lilith / Selena / Chiron
- asteroids
- location-specific sunrise/sunset tables

---

# Void of Course Moon Architecture

Current VOC data comes primarily from precise ephemeris data.

Current or future VOC display should distinguish:

1. VOC has not started yet
2. VOC is active now
3. No VOC exists in the current day

Dashboard display should be handled as UI state, not as raw event dumping.

Expected dashboard display concepts:

- “Луна без курса начнется”
- “Луна без курса”
- “Луна в курсе”
- start/end time
- countdown until start
- countdown until end
- next VOC if none today
- last aspect before VOC

Main dashboard should show time without seconds.

VOC quality labels are product logic and should ideally live in a calculation/domain helper, not hardcoded deeply in DOM update code.

Expected VOC quality labels:

- `мягкий VOC`
- `напряженный VOC`
- `размытый VOC`
- `тяжелый VOC`
- `нервный VOC`

VOC display formatting currently lives in:

```txt
src/vocDisplay.js
```

This module handles display state and copy only. VOC interval calculation still comes from precise ephemeris data or fallback logic.

---

# Moon Aspects Architecture

Current Moon aspect data comes from generated precise ephemeris data.

The app should only use major Moon aspects for main dashboard logic:

- conjunction
- sextile
- square
- trine
- opposition

Dashboard should distinguish:

- previous Moon aspect
- next Moon aspect

Expected display concepts:

- “Последний аспект”
- “Следующий аспект”
- relative day label: yesterday / today / tomorrow
- `HH:mm` time
- countdown to next aspect

Current dashboard formatting lives in:

```txt
src/moonAspectsDisplay.js
```

Moon aspect calculation still comes from generated precise ephemeris data through `src/preciseEphemeris.js`.

Tap-to-expand interpretation rules live in:

```txt
src/moonAspectsDisplay.js
```

Interpretation rules are not scattered through DOM manipulation code.

---

# Field Quality Architecture

`src/fieldQuality.js` is the current field interpretation layer.

It should remain the central place for combining moment indicators into human-readable practical meaning.

Current field quality output includes:

- phrase of the moment
- main moment advice
- practical scores
- reasons
- suitable actions
- unsuitable actions

Future expansion may add modes:

- General
- Tarot
- Candles
- Money
- Relationships
- Cleansings
- Forecasts

If these modes are added, document:

- where selected mode is stored
- how field quality changes by mode
- where mode-specific scores are calculated
- how recommendations are passed to the dashboard

Important principle:

The main dashboard should not show all possible data at once.

It should answer:

1. What is happening now?
2. Can I act?
3. What is this moment good for?
4. What should I avoid?
5. When is the best window?

---

# Day Indicators Architecture

`src/dayIndicators.js` is responsible for day-level symbolic and traditional indicators.

Current indicators:

- Tong Shu
- lunar day symbol
- Ba Zi day

UI should avoid using the vague label:

```txt
Индикатор дня
```

Preferred label:

```txt
Индикаторы
```

Expected lines:

```txt
Tong Shu: Стабильность
Лунные сутки: Медведь
Ба-цзы: Деревянный Петух
```

If the indicator block changes only visually, this file may not need updates.

If indicator calculation logic or data structure changes, update this file.

---

# Planetary Day and Planetary Hour Architecture

Current planetary day/hour fallback logic exists in `src/astro.js`.

The dashboard currently displays the planetary day, planetary hour, hour range, and a short practical hint for the current planetary hour.

Expected meaning dictionary:

- Sun: status, visibility, success, will
- Moon: Tarot, dreams, family, intuition, water
- Mars: cleansing, protection, cutting off, active action
- Mercury: texts, negotiations, cards, diagnostics
- Jupiter: money, growth, learning, blessing
- Venus: relationships, beauty, harmony, attraction
- Saturn: protection, boundaries, structure, long commitments

These hints live in `src/planetaryHourHints.js` and are not hardcoded repeatedly in DOM update code.

---

# Lunar Precision Architecture

Current precise lunar events come from `src/preciseEphemeris.js`.

Future dashboard improvements may add:

- Moon illumination percentage
- Moon age
- time until New Moon
- time until Full Moon

If these are calculated from existing ephemeris data, document where the calculation lives.

If these require expanding generated data, update:

- `scripts/generate-ephemeris.cjs`
- `src/ephemeris-data.js`
- `src/preciseEphemeris.js`
- tests

---

# Debug Architecture

The hidden debug panel is implemented.

Access method:

```txt
?debug=1
?debug=1&debugDate=2026-05-15T00:40:00
```

Current debug information:

- current timezone
- selected day calculation system
- Moscow / 23:00 / Jie Qi mode
- earthly branch of month
- earthly branch of day
- Tong Shu indicator
- source of VOC calculation
- previous Moon aspect
- next Moon aspect
- calculation point
- ephemeris version
- safe profile count / active profile id / active profile name
- safe personal readiness status and unavailable personal-calculation capabilities
- safe natal engine/provider status and unavailable natal feature capabilities
- safe natal planets UI status, user-facing enabled / disabled state, planet counts and unsupported feature labels
- safe natal aspects UI status, user-facing enabled / disabled state, aspect counts and unsupported feature labels
- safe essential dignities UI status, source policy, score/count summaries, deferred feature labels and unsupported feature labels

Files involved:

- `index.html` — hidden debug panel shell
- `src/app.js` — passes already calculated dashboard data to the panel
- `src/debugPanel.js` — query detection and text formatting
- `src/natalProviderValidationSummary.js` — safe provider validation summary for debug output
- `src/natalPlanetsDebug.js` — safe natal planets UI summary for debug output
- `src/natalAspectsDebug.js` — safe natal aspects UI summary for debug output
- `src/essentialDignitiesDebug.js` — safe essential dignities UI summary for debug output
- `src/styles.css` — simple technical panel styling

Visibility:

- no public navigation or button
- hidden unless `debug=1` is present
- ordinary main dashboard keeps working

Seconds:

- allowed in debug raw timestamps
- still not allowed on the ordinary main dashboard

Privacy:

- no full profiles, birth date/time, raw places, coordinates or exact birth timezone values are displayed

Testing note:

- `test/fixtures/natalFixtures.js` contains test-only mock provider data for future-ready natal engine tests. It is not used by the production provider path.
- `test/fixtures/natalProviderReferenceFixtures.js` contains test-only UTC reference fixtures and Swiss Ephemeris reference helpers for validating `astronomy-engine` planet longitudes without importing `swisseph` into production code.
- `test/fixtures/housesValidationFixtures.js` contains test-only manually declared cross-system house validation fixtures for Whole Sign, Equal House and selected-system router behavior. It is not used by production code.
- `test/housesValidation.test.js` validates Whole Sign / Equal House manual fixtures, Placidus static benchmark fixtures, router no-fallback behavior, guardrail failures, privacy exclusions and strict source boundaries without creating a new production house engine.
- `test/fixtures/planetInHousesFixtures.js` contains test-only manually declared planet-in-house assignment fixtures for Whole Sign, Equal House, Placidus, boundary spans, selected-system behavior and privacy exclusions. It is not used by production code.
- `test/planetInHouses.test.js` validates assignment behavior across selected house systems, half-open cusp boundaries, profile-level routing, privacy exclusions and strict source boundaries without adding UI or a new house calculation engine.
- `test/fixtures/houseCuspsFixtures.js` contains test-only manually declared canonical cusp fixtures for Whole Sign sign boundaries, Equal House exact cusps and Placidus benchmark values. It is not used by production code.
- `test/houseCuspsFixtures.test.js` and `test/houseCusps.test.js` validate canonical cusp output, router/profile integration, no-fallback behavior, privacy exclusions and strict source boundaries without adding new house math or lots / parts.
- `test/fixtures/dayNightChartFixtures.js` contains test-only manually declared day/night chart fixtures for synthetic Sun-altitude geometry, public Greenwich examples, fallback states and strict exclusions. It is not used by production code.
- `test/dayNightChartFixtures.test.js` and `test/dayNightChart.test.js` validate day/night geometry, boundary handling, profile-level guardrails, privacy exclusions and strict source boundaries without calculating lots / parts.
- `test/fixtures/arabicPartsHouseAssignmentFixtures.js` contains test-only manually declared lots / Arabic Parts house-assignment fixtures for Whole Sign, Equal House, Placidus, cusp boundaries, wrapping spans, fallback states and strict exclusions. It is not used by production code.
- `test/arabicPartsHouseAssignmentFixtures.test.js` and `test/arabicPartsHouseAssignment.test.js` validate active lots assignment to houses, deferred formula exclusion, half-open cusp policy, profile-level composition, privacy exclusions and strict source boundaries without changing formulas, house engines or UI.
- `test/arabicPartsDisplay.test.js` validates the pure lots / Arabic Parts display helper, including formatted part rows, optional house labels, chart sect labels, fallback states, privacy exclusions and strict display-only source boundaries.
- `test/arabicPartsForProfile.test.js` validates the profile-level Arabic Parts UI view model helper, including fallback states, ready active lots, day/night label, house labels, deferred formula exclusion, privacy exclusions and no mutation.
- `test/arabicPartsDebug.test.js` validates the safe Arabic Parts UI debug helper, including readiness booleans, chart sect status, formula keys, counts, capabilities, privacy exclusions and strict source boundaries.
- `test/fixtures/lunarNodesFixtures.js` contains test-only static mean Lunar Nodes benchmark fixtures from local Swiss Ephemeris `SE_MEAN_NODE`, including wrap-around and South Node opposite checks. It is not used by production code.
- `test/lunarNodesFixtures.test.js` and `test/lunarNodes.test.js` validate the pure mean Lunar Nodes engine, static benchmark matching, South Node derivation, profile-level UTC readiness, privacy exclusions and strict Sprint 13 source boundaries without adding true node, Lilith, Selena, UI/debug or house assignment.
- `test/fixtures/lunarNodesHouseAssignmentFixtures.js` contains test-only manual Lunar Nodes house-assignment fixtures for Whole Sign, Equal House, Placidus, cusp boundaries, wrapping spans, fallback states and strict exclusions. It is not used by production code.
- `test/lunarNodesHouseAssignmentFixtures.test.js` and `test/lunarNodesHouseAssignment.test.js` validate North/South Node assignment to canonical cusps, half-open cusp policy, profile-level composition, privacy exclusions and strict Sprint 13 source boundaries without changing Lunar Nodes calculation, adding true node, Lilith, Selena, UI/debug or interpretations.
- `test/fixtures/lilithFixtures.js` contains test-only static Mean Lilith benchmark fixtures from local Swiss Ephemeris `SE_MEAN_APOG`, including wrap-around near 0° Aries. It is not used by production code.
- `test/lilithFixtures.test.js` and `test/lilith.test.js` validate the pure Mean Lilith engine, static benchmark matching, profile-level UTC readiness, privacy exclusions and strict Sprint 13 source boundaries without adding true/osculating/interpolated Lilith, Selena, UI/debug or house assignment.
- `test/fixtures/selenaFixtures.js` contains test-only static Selena / White Moon benchmark fixtures from local Swiss Ephemeris `SE_WHITE_MOON`, including wrap-around near 0° Aries. It is not used by production code.
- `test/selenaFixtures.test.js` and `test/selena.test.js` validate the pure Selena / White Moon engine, static benchmark matching, profile-level UTC readiness, `fictitious-calculated-point` metadata, privacy exclusions and strict Sprint 13 source boundaries without adding alternate Selena variants, Lunar Nodes, Lilith, UI/debug or house assignment.
- `test/specialPointsDisplay.test.js` validates the pure Special Points display helper, including formatted North/South Node, Mean Lilith and Selena rows, optional Lunar Nodes house labels, fallback states, Selena fictitious / hypothetical note, privacy exclusions and strict display-only source boundaries.
- `test/specialPointsForProfile.test.js` validates the profile-level Special Points view-model helper, including fallback states, ready/partial profile behavior, optional Lunar Nodes house labels, Selena fictitious / hypothetical note, privacy exclusions and no provider/native astronomy imports.
- `test/fixtures/fixedStarsValidationFixtures.js` contains test-only manual Fixed Stars validation fixtures for catalog keys, source policy, epoch columns, position modes, target policy, conjunction boundaries, privacy and strict exclusions. It is not used by production code.
- `test/fixedStarsValidation.test.js` cross-checks the Fixed Stars foundation across catalog data, position/epoch behavior, target resolver policy, conjunction/orb behavior, privacy exclusions and runtime/file boundaries without adding a production module, display helper, UI, debug or interpretations.
- `test/fixedStarsDisplay.test.js` validates the pure Fixed Stars display helper, including formatted conjunction hit rows, ready/noHits/notReady display states, safe source/orb notes, privacy exclusions and strict display-only boundaries.
- `test/fixedStarsUi.test.js` validates the user-facing Fixed Stars UI view-model, including ready hits, noHits, partial and notReady states, one-time source/orb notes, privacy exclusions and no interpretation text.
- `test/fixedStarsDebug.test.js` validates the safe Fixed Stars debug helper, including catalog/policy/pipeline counts, formatter rows, privacy exclusions and strict runtime/file boundaries.
- `NATAL_PROVIDER_VALIDATION_REPORT.md` records the provider-layer validation summary; it does not enable user-facing natal values.
- if personal data is added later, debug output must follow `PRIVACY_RULES.md`

Debug data helps check calculation differences between calendars.

---

# PWA Architecture

Current PWA files:

- `index.html`
- `sw.js`
- app icons / manifest references if present

`sw.js` currently uses a cache-first strategy for static files.

Current cache version:

```txt
lunar-calendar-v95
```

Important operational rule:

When changing files that must reliably appear on installed iPhone PWA, update `CACHE_NAME`.

Examples:

- main JS changed and old version may be stuck
- CSS changed and installed app shows stale styles
- `index.html` changed
- generated ephemeris data changed
- important UI text changed

If PWA strategy changes from cache-first to another approach, update this file.

---

# Testing

Tests are currently run with:

```bash
npm test
```

Current test coverage includes:

- planetary day and hour
- basic Moon information
- precise lunar data from Swiss Ephemeris
- Void of Course Moon
- lunar day for Moscow
- solar month for Chinese calculations
- New Moon and Full Moon
- Moon aspects
- day indicators
- field quality
- absence of removed decorative elements on the main screen
- Sprint 11 house-system validation fixtures for Whole Sign, Equal House, Placidus and selected-system routing
- Sprint 12 canonical cusp fixtures for Whole Sign, Equal House and Placidus
- Sprint 12 day/night chart status fixtures for Sun-altitude geometry and boundary behavior

If new modules are added, tests should be added or updated.

Examples that require tests:

- VOC display state helper
- VOC quality label helper
- Moon aspect filtering
- Moon aspect countdown
- planetary hour hint dictionary
- field quality modes
- best window calculation
- profile data model
- local storage persistence
- natal chart calculation
- personal transits
- privacy import/export logic

---

# Future Modules Not Yet Core Architecture

The following modules are part of the product roadmap but should not be treated as implemented unless the code actually contains them.

## Profiles / “Моя карта”

Future responsibility:

- create profile
- edit profile
- delete profile
- active profile selector
- birth date
- birth time
- birth time accuracy
- birth place
- current calculation place
- house system
- zodiac system
- additional points

This should not be implemented until the relevant task exists in `TODO.md`.

## Personal Transits

Future responsibility:

- current transits to natal chart
- orb filtering
- priority scoring
- personal recommendations
- “Лично для меня” dashboard block

This should not be implemented until profile data exists.

## Natal Chart Screen

Future responsibility:

- natal wheel
- planet table
- house table
- aspect table
- special points
- chart ruler / house rulers if added

This should not be implemented before profile and natal calculation foundations are stable.

## Personal Ritual Scoring

Future responsibility:

- Tarot score
- money candle score
- relationship candle score
- cleansing score
- protection score
- dreams score
- negotiations score
- sales score
- launch score

This should depend on:

- general moment quality
- active profile
- natal houses
- personal transits
- Moon placement in natal chart
- current location

This should not be hardcoded into the main dashboard before the data model exists.

## Privacy and Local Storage

Future responsibility:

- local-first birth data storage
- no server upload without explicit consent
- profile export
- profile import
- profile deletion
- backup

This should be implemented before storing sensitive profile data.

---

# Current Architectural Principle

The current project should evolve in this order:

1. Stabilize the general main dashboard.
2. Improve exact lunar and ritual moment logic.
3. Add debug tools for calculation verification.
4. Add modes for different practical use cases.
5. Add profiles and local private storage.
6. Add personal transits and natal logic.
7. Add natal chart screen and advanced personal recommendations.

Do not skip directly to personal natal features while the general dashboard logic is still unstable.

---

# Implementation Discipline for Codex

For every implementation task:

1. Read:
   - `PROJECT_STATE.md`
   - `ARCHITECTURE.md`
   - `TODO.md`
   - relevant rule files

2. Implement only the active task from `TODO.md`.

3. Do not implement future roadmap items from `MASTER_PLAN.md` unless they are explicitly moved into `TODO.md`.

4. After implementation, evaluate whether architecture changed.

5. If architecture changed:
   - update `ARCHITECTURE.md`
   - describe new files, modules, data flow, or storage changes

6. If architecture did not change:
   - do not edit `ARCHITECTURE.md`
   - state in the report why it was not updated

7. Update:
   - `PROJECT_STATE.md`
   - `TODO.md`
   - `CHANGELOG.md`

8. Run available checks:
   - `npm test`
   - build command if available
   - lint/typecheck if available

9. Stop after the task is complete.

Do not move to the next task without explicit user approval.

---

# When Architecture Must Be Updated

Update this file if any of the following happen:

## New screen

Examples:

- Profile screen
- Natal chart screen
- Debug screen
- Settings screen

## New module

Examples:

- `src/voc.js`
- `src/moonAspects.js`
- `src/profileStorage.js`
- `src/natalChart.js`
- `src/personalTransits.js`

## New data model

Examples:

- Profile
- Birth data
- Current location
- Natal chart
- Personal transit
- Ritual score

## New persistence layer

Examples:

- localStorage
- IndexedDB
- import/export JSON
- backup files

## New calculation source

Examples:

- new generated ephemeris fields
- browser-side astrology library
- location-based sunrise/sunset calculation
- house system calculation

## New data flow

Examples:

- dashboard uses view models
- field quality split into mode-specific calculators
- calculations move out of `src/app.js`
- profile-aware recommendations

## New PWA behavior

Examples:

- changed service worker strategy
- changed cache invalidation logic
- offline data updates
- versioned data migration

---

# When Architecture Should Not Be Updated

Do not update this file for:

- changing text from one label to another
- small CSS spacing changes
- changing color or font size
- fixing a typo
- hiding seconds on existing formatter without changing structure
- adding one line of explanatory text in existing DOM
- fixing a small bug inside an existing function without changing its responsibility

For those tasks, update only:

- `TODO.md`
- `PROJECT_STATE.md`
- `CHANGELOG.md`

---

# Current Cache Version

Current PWA cache version:

```txt
lunar-calendar-v95
```

If this value changes in `sw.js`, update this section.

---

# Current Known Risks

## PWA Stale Cache

Installed iPhone PWA may show old files if `CACHE_NAME` is not updated.

## Timezone Sensitivity

Moscow time is currently central to:

- lunar day
- Tong Shu day
- Ba Zi day
- day transition at 23:00
- dashboard formatting

Future multi-location support must be implemented carefully.

## VOC Source Confusion

VOC may come from precise ephemeris data or fallback logic.

Dashboard should clearly use precise data when available.

Debug screen should eventually show the calculation source.

## Field Quality Complexity

`src/fieldQuality.js` can become too large if all mode-specific recommendations are added directly into it.

If modes grow, split into smaller helpers or dictionaries.

## `src/app.js` Overload

`src/app.js` is currently the composition and DOM update layer.

If more dashboard blocks are added, consider extracting display state helpers or UI-specific mappers.

## Future Personal Data Privacy

Profiles and natal data are sensitive.

Before implementing profiles, privacy rules must be explicit and local-first storage should be designed.

## Sprint 3 Profile Foundation

Sprint 3 local profile management has started with `src/profileModel.js`.

The current implemented profile layer includes:

- profile draft creation;
- profile defaults;
- profile normalization;
- profile validation;
- profile id creation;
- local profile list storage;
- local active profile id storage;
- compact dashboard profile shell;
- inline `Мои карты` panel;
- inline profile creation form.

The app still has no edit/delete UI, active profile selector UI, import/export UI, natal chart, houses, ASC / MC, or personal transits.

Sprint 3 must not implement natal chart calculations, houses, Ascendant / MC, personal transits, personal recommendations, backend sync, or external geocoding without an explicit later task.

---

# Current Summary

The current architecture is a static, frontend-only PWA.

Core logic:

- pre-generated Swiss Ephemeris data
- browser-side dashboard composition
- Moscow-based lunar and day indicators
- field quality interpretation
- PWA cache-first delivery

Current priority:

Prepare Sprint 3 edit/delete profile UI while keeping natal charts, houses, personal transits, and personal recommendations out of scope.
