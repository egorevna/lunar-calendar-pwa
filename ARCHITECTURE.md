# ARCHITECTURE.md

## Purpose

This file describes the current architecture of the Astro PWA project.

It is a living document.

Whenever implementation changes the structure of the app, data flow, routing, storage, calculation modules, domain models, privacy model, debug tools, or major UI components, this file must be updated in the same task.

This file describes the actual current state of the codebase, not future plans.

Future architecture ideas belong in `MASTER_PLAN.md` or `TODO.md`, not here.

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
- includes calculated time, `debugDate` status, Moscow day system, Moon sign, VOC, Moon aspects, indicators, ephemeris range/source, and cache version;
- allows technical timestamps with seconds because this is debug-only.

The debug panel does not store data and does not expose profile or birth data.

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

`src/app.js` calls this helper during dashboard render and displays its output in the `Лучшее окно сегодня` card.
If no good windows are returned, the card renders a calm mode-specific fallback from the display formatter.

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
lunar-calendar-v41
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

15. `src/bestWindows.js` calculates best-window candidates for the selected mode and provides the compact dashboard view model.

16. `src/debugPanel.js` formats the hidden debug panel when enabled.

17. `src/app.js` updates DOM elements on the main dashboard, mode selector, mode-specific scores, mode-specific recommendations, best-window card, and optional debug panel.

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
- calculation coordinates
- ephemeris version

Files involved:

- `index.html` — hidden debug panel shell
- `src/app.js` — passes already calculated dashboard data to the panel
- `src/debugPanel.js` — query detection and text formatting
- `src/styles.css` — simple technical panel styling

Visibility:

- no public navigation or button
- hidden unless `debug=1` is present
- ordinary main dashboard keeps working

Seconds:

- allowed in debug raw timestamps
- still not allowed on the ordinary main dashboard

Privacy:

- no profiles or birth data are currently displayed
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
lunar-calendar-v41
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
lunar-calendar-v41
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

Stabilize and improve the general main dashboard before adding personal profiles, natal charts, and personal transits.
