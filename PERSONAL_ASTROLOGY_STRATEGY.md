# PERSONAL_ASTROLOGY_STRATEGY.md

## Purpose

This document defines what personal astrology can be implemented safely in Astro PWA after Sprint 3.

Main rule:

```txt
Do not fake natal houses, ASC / MC, Moon in natal house, personal transits, transit orbs, or personal ritual scoring.
```

If the current data and code cannot calculate a personal result reliably, the app must say so clearly.

## Current Available Data

`src/ephemeris-data.js` contains pre-generated Swiss Ephemeris data for the general dashboard.

Coverage:

- `rangeStart`: `2026-01-01T00:00:00.000Z`
- `rangeEnd`: `2031-01-01T00:00:00.000Z`
- source: `Swiss Ephemeris swisseph npm package, SEFLG_SWIEPH`

Available event arrays:

- `signIngresses`: Moon sign ingress events.
- `voidOfCourse`: Moon void-of-course intervals.
- `moonAspects`: exact major Moon aspects to Sun, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto.
- `moonPhases`: exact New Moon and Full Moon events.
- `lunarDays`: Moscow lunar day boundaries from New Moon and Moon rise logic.
- `solarMonths`: Chinese solar month / Jie Qi branch boundaries.

Current generated counts:

- `signIngresses`: 806
- `voidOfCourse`: 803
- `moonAspects`: 4665
- `moonPhases`: 124
- `lunarDays`: 1839
- `solarMonths`: 63

What is not present in `src/ephemeris-data.js`:

- no continuous planetary position table;
- no natal planetary positions for arbitrary birth dates;
- no historical ephemeris coverage before 2026;
- no house cusps;
- no ASC / MC;
- no birth-place-specific calculations;
- no timezone history data;
- no personal transit aspects to natal positions.

## Current Calculation Capabilities

### `src/astro.js`

`src/astro.js` provides general dashboard calculations:

- planetary day;
- planetary hour for Moscow using approximate sunrise / sunset math;
- fallback lunar age, phase, illumination and lunar day from a fixed New Moon epoch;
- fallback Moon longitude approximation;
- fallback Moon sign;
- fallback Moon void-of-course approximation;
- helper constants for planets and zodiac signs.

This file is useful for the general current-moment dashboard.

It is not sufficient for natal astrology:

- it does not calculate precise planetary positions for arbitrary birth dates;
- it does not calculate natal charts;
- it does not calculate houses;
- it does not calculate ASC / MC;
- it does not calculate personal transits;
- its Moon longitude / phase logic is fallback-level, not a natal-grade ephemeris engine.

### `src/preciseEphemeris.js`

`src/preciseEphemeris.js` reads `PRECISE_EPHEMERIS` and exposes precise current-dashboard functions:

- `getPreciseMoonSignInfo()`
- `getPreciseLunarDayInfo()`
- `getPreciseSolarMonthBranch()`
- `getPreciseMajorMoonPhase()`
- `getNextPreciseMajorMoonPhase()`
- `getPreciseMoonAspectInfo()`
- `getPreciseVoidOfCourse()`

These functions are event lookup helpers over the pre-generated 2026-2030 data.

They cannot currently provide:

- natal planetary positions;
- natal aspects;
- houses;
- ASC / MC;
- personal transits to natal planets;
- arbitrary historical birth-date calculations.

### `scripts/generate-ephemeris.cjs`

The generator uses the `swisseph` npm package at build time and currently generates:

- Moon sign ingresses;
- Moon major aspects to the listed bodies;
- Moon void-of-course intervals;
- New Moon / Full Moon events;
- Moscow lunar day boundaries;
- Chinese solar month boundaries.

The script proves that the project can use Swiss Ephemeris during generation, but the app runtime does not currently expose a general natal calculation engine.

The pre-generated approach could be extended later, but it has important risks for natal astrology:

- arbitrary birth dates may fall outside the 2026-2030 range;
- natal astrology needs historical dates, not just current app years;
- birth timezone handling must be historically correct;
- houses and ASC / MC require birth coordinates and house calculation, not just ecliptic longitude events;
- pre-generating every possible user birth chart is not practical;
- personal transits require both natal positions and current planetary positions, with tested orb logic.

### `package.json`

Current dependency state:

- runtime dependencies: none;
- dev dependency: `swisseph`;
- no frontend astrology runtime library;
- no astronomy runtime library;
- no timezone history library;
- no geocoding library;
- no backend or remote calculation service.

### Profile Layer

Sprint 3 added local profile infrastructure:

- `src/profileModel.js` models and validates profiles;
- `src/profileStorage.js` stores profiles and active profile id in `localStorage`;
- `src/profileUi.js` describes the profile UI shell and forms.

Profile fields currently include:

- name;
- birthDate;
- birthTime;
- birthTimeAccuracy;
- birthPlace city / country / optional coordinates / timezone;
- currentPlace;
- houseSystem;
- zodiac;
- createdAt / updatedAt.

This is enough to prepare calculation input and readiness state.

It is not enough by itself to calculate a reliable natal chart, because calculation code and historical timezone / coordinate strategy are still missing.

## What Is Safe Now

Safe Sprint 4 work can start with readiness and honest context:

- determine whether `Общий день` or a saved profile is active;
- convert active profile data into a calculation-ready input object;
- validate whether required fields are present;
- show missing fields;
- show whether birth time is exact, approximate, or unknown;
- show whether birth coordinates are missing;
- show whether current place is Moscow or custom;
- state clearly that full natal calculations are not available yet;
- build a compact `Лично для меня` block that explains readiness, not fake predictions;
- adapt copy around personal mode without claiming houses, ASC / MC, or transits.

Safe examples:

```txt
Лично для Анны

Персональный расчет: частично готов.
Нужны координаты рождения для домов и ASC / MC.
Сейчас можно использовать общий момент, режимы и лучшие окна.
```

```txt
Время рождения неизвестно: дома, ASC / MC и точные личные транзиты пока недоступны.
```

## What Is Not Safe Yet

The app cannot currently calculate these reliably:

- natal planetary positions;
- natal aspects;
- house cusps;
- ASC / MC;
- Moon in natal house;
- current personal transits to natal planets;
- personal transit orbs;
- personal ritual scoring based on natal houses or personal transits;
- personal forecasts based on exact natal chart geometry.

Do not show these values in UI, debug, recommendations, or best windows until a real calculation path exists and is tested.

## Required Future Work for Accurate Natal Astrology

To implement accurate natal astrology later, the project needs:

1. Natal ephemeris engine:
   - either runtime access to Swiss Ephemeris or a safe precomputed / generated strategy for birth dates;
   - tested planetary positions for Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto.

2. Historical timezone handling:
   - reliable conversion from local birth date/time/place to UTC;
   - support for historical timezone changes and daylight saving rules.

3. Coordinate strategy:
   - manual coordinate entry and validation, or
   - geocoding with explicit user consent and privacy copy.

4. House calculation:
   - tested house system implementation for Whole Sign, Placidus, Equal if supported;
   - clear handling when birth time or coordinates are unknown.

5. ASC / MC calculation:
   - reliable sidereal time / obliquity logic or library support;
   - known-chart fixtures.

6. Transit engine:
   - natal positions;
   - current / future planetary positions;
   - aspect detection;
   - orb rules;
   - deterministic tests.

7. Test fixtures:
   - known charts from trusted references;
   - fixtures for timezone edge cases;
   - fixtures for unknown / approximate birth time;
   - fixtures for house systems and ASC / MC.

8. Privacy safeguards:
   - no server upload by default;
   - no analytics around birth data;
   - no debug dump of full birth data;
   - explicit consent before any geocoding or remote calculation.

## Recommended Sprint 4 MVP

### Task 4.2 — Profile Calculation Input Adapter

Create a helper that converts the active profile into a safe calculation input and readiness result.

Recommended output:

- profileId;
- name;
- birthDateTime readiness;
- birthTimeAccuracy;
- birthPlace readiness;
- currentPlace;
- houseSystem;
- zodiac;
- isReadyForBasicPersonalContext;
- isReadyForNatal;
- missingFields;
- warnings;
- unsupportedFeatures.

No natal positions, houses, ASC / MC, or transits.

### Task 4.3 — Personal Readiness / Context MVP

Use the adapter to produce honest readiness copy:

- profile active / no active profile;
- required data present / missing;
- exact / approximate / unknown birth time;
- whether coordinates are available;
- what calculations are safe now;
- what is not available yet.

### Task 4.4 — Dashboard Block `Лично для меня`

Add a compact dashboard block only when a saved profile is active.

The block should communicate readiness and boundaries:

- no fake natal chart;
- no fake transits;
- no fake houses;
- clear next steps if profile data is incomplete.

### Task 4.5 — Safe Personal Recommendations MVP

Only adapt recommendations using safe readiness/context.

Allowed:

- explain that current dashboard remains general;
- mention missing profile data;
- warn that personal calculations are not enabled yet.

Not allowed:

- transit-based advice;
- house-based advice;
- ASC / MC advice;
- Moon-in-natal-house advice.

### Task 4.6 — Debug Personal Calculations

Debug may show safe readiness state:

- activeProfileId;
- activeProfileName;
- readiness;
- missingFields;
- calculation capability.

Debug must not dump full birth data.

### Task 4.7 — Sprint 4 Hardening

Polish copy, tests, and docs.

Confirm that no fake personal astrology is present.

## Risks

- Pseudo-precision: the UI may imply personal astrology exists before the calculation engine supports it.
- Historical timezones: birth time conversion can be wrong without a real timezone strategy.
- Coordinates: city/country strings alone are not enough for houses or ASC / MC.
- Pre-generated current-year ephemeris is not enough for arbitrary birth dates.
- `swisseph` is currently a dev dependency and generator tool, not a browser runtime API.
- Debug output can accidentally expose sensitive birth data if future tasks are careless.
- Whole Sign can reduce some house complexity, but it still needs a reliable Ascendant sign when used as a natal house system.

## Decisions

- Sprint 4 starts with audit and readiness, not natal calculations.
- `PERSONAL_ASTROLOGY_STRATEGY.md` is the source-of-truth for personal astrology boundaries until a real calculation engine is added.
- Task 4.2 should build profile calculation input / readiness only.
- The app must not display houses, ASC / MC, Moon in natal house, personal transits, or transit orbs until they are calculated by reliable, tested code.
- If exact personal astrology is unavailable, the UI should say that directly instead of filling the gap with symbolic or approximate claims.
