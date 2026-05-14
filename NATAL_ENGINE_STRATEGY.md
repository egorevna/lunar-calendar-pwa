# NATAL_ENGINE_STRATEGY.md

## Purpose

This document records the Task 5.1 audit and decision for the future natal calculation engine.

Main rule:

```txt
If a calculation is not supported by a reliable local provider and tests, return notSupported.
Do not invent natal planets, houses, ASC / MC, personal transits, or orbs.
```

Sprint 5 should build the foundation for real natal astrology before any natal chart UI or personal transit claims appear.

## Current Dependencies

`package.json` currently has:

- runtime dependencies: none;
- dev dependency: `swisseph`.

The installed `swisseph` package is a Node.js native binding:

- `node_modules/swisseph/package.json` describes it as `Swiss Ephemeris binding for node.js`;
- it installs through `node-gyp`;
- `node_modules/swisseph/lib/swisseph.js` loads `../build/Release/swisseph.node`;
- the native binary exists under `node_modules/swisseph/build/Release/swisseph.node`.

Decision:

- current `swisseph` is suitable for Node/build-time scripts;
- current `swisseph` is not a browser/PWA runtime engine;
- do not import it into app code;
- do not add a new calculation dependency without explicit approval.

Missing dependency categories:

- no browser-compatible natal astrology / astronomy runtime library;
- no timezone history library;
- no geocoding library;
- no backend or remote calculation service.

## Current Ephemeris Data

`src/ephemeris-data.js` contains pre-generated Swiss Ephemeris event data for the current dashboard.

Coverage:

- `rangeStart`: `2026-01-01T00:00:00.000Z`
- `rangeEnd`: `2031-01-01T00:00:00.000Z`
- source: `Swiss Ephemeris swisseph npm package, SEFLG_SWIEPH`

Top-level datasets:

- `signIngresses`: 806 Moon sign ingress events;
- `voidOfCourse`: 803 Moon void-of-course intervals;
- `moonAspects`: 4665 exact major Moon aspects;
- `moonPhases`: 124 New Moon / Full Moon events;
- `lunarDays`: 1839 Moscow lunar day boundaries;
- `solarMonths`: 63 Chinese solar month / Jie Qi boundaries.

The data is event-based. It does not contain:

- continuous planetary position tables;
- natal planetary positions for arbitrary birth dates;
- historical coverage for arbitrary user birthdays;
- house cusps;
- ASC / MC;
- birth-place-specific calculations;
- historical timezone handling;
- personal transit aspects to natal positions.

## Current Calculation Capabilities

### `scripts/generate-ephemeris.cjs`

The generator uses `swisseph` in Node and currently produces current-dashboard event data:

- Moon sign ingresses;
- Moon major aspects to Sun, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto;
- Moon void-of-course intervals;
- New Moon / Full Moon events;
- Moscow lunar day boundaries;
- Chinese solar month boundaries.

It already calls Swiss Ephemeris for ecliptic longitudes at build time, so it can be extended in principle.

Important limits:

- it writes a fixed static dataset, currently 2026-2030;
- it is not available in the browser runtime;
- it does not generate arbitrary natal charts;
- it does not generate houses or ASC / MC;
- it does not solve historical timezone conversion;
- pre-generating all possible birth dates, times, locations, house systems and personal transits is not practical.

### `src/astro.js`

`src/astro.js` provides fallback current-dashboard calculations:

- planetary day;
- planetary hour for Moscow;
- approximate sunrise / sunset for Moscow;
- fallback lunar age, lunar day, phase, illumination;
- fallback Moon longitude and Moon sign;
- fallback Void of Course logic;
- approximate planet longitudes used for fallback Moon-aspect/VOC logic.

This is useful for graceful dashboard fallback.

It is not a natal-grade engine:

- it does not expose reliable planetary longitudes for arbitrary birth dates;
- it does not calculate natal charts;
- it does not calculate house cusps;
- it does not calculate ASC / MC;
- it does not calculate personal transits;
- it has no historical timezone handling.

### `src/preciseEphemeris.js`

`src/preciseEphemeris.js` is a lookup layer over `PRECISE_EPHEMERIS`.

Current public functions:

- `getPreciseMoonSignInfo()`;
- `getPreciseLunarDayInfo()`;
- `getPreciseSolarMonthBranch()`;
- `getPreciseMajorMoonPhase()`;
- `getNextPreciseMajorMoonPhase()`;
- `getPreciseMoonAspectInfo()`;
- `getPreciseVoidOfCourse()`.

It can answer current-dashboard questions inside the generated range.

It cannot currently provide:

- natal planetary positions;
- natal aspects;
- houses;
- ASC / MC;
- personal transits;
- arbitrary historical birth-date calculations.

## What Cannot Be Calculated Reliably Yet

The project cannot currently calculate these reliably:

- natal planetary positions;
- natal Moon sign for arbitrary historical birth dates with tested precision;
- natal aspects;
- house cusps;
- ASC;
- MC;
- Moon in natal house;
- personal transits to natal positions;
- transit orbs;
- personal ritual scoring based on natal houses or transits.

These must remain unavailable until a real provider, timezone strategy, and fixtures exist.

## Engine Strategy Options

### A. Use `swisseph` in the browser / PWA

Pros:

- high precision if a browser-safe Swiss Ephemeris build is available;
- local/offline privacy can be excellent;
- could support planets, houses, ASC / MC and transits from one engine.

Cons:

- current installed `swisseph` is a Node native binding, not browser runtime code;
- bundling Swiss Ephemeris into a static PWA may require WASM or another package;
- ephemeris files can be large;
- licensing, package quality and PWA caching need separate review.

Privacy implications:

- good if all calculation happens locally;
- unacceptable if it silently calls a remote service.

PWA/offline implications:

- good only if the engine and ephemeris files are cached locally;
- risky if bundle size becomes too large.

Accuracy:

- potentially high.

Complexity:

- high.

Fit now:

- not suitable with the current dependency.

### B. Use `swisseph` only in Node / build-time

Pros:

- already works for current generated dashboard events;
- high precision for fixed generated datasets;
- no birth data leaves the device during app runtime if generation is developer-side only.

Cons:

- cannot calculate arbitrary user birth charts in the browser;
- pre-generating all possible birth dates and places is not practical;
- houses and ASC / MC depend on coordinates and exact time;
- personal transits need both natal and current positions.

Privacy implications:

- safe for public fixed ephemeris data;
- unsuitable for user-specific runtime calculations unless birth data is sent to a server or generator, which is out of scope.

PWA/offline implications:

- good for fixed current-dashboard event data;
- poor for arbitrary natal calculations.

Accuracy:

- high for generated events.

Complexity:

- medium for fixed ranges, very high for natal coverage.

Fit now:

- keep for current-dashboard generation only.

### C. Add a browser-compatible astronomy / astrology library

Pros:

- best fit for local-first PWA runtime if the library is pure JS or browser-safe WASM;
- can calculate selected profiles locally without a backend;
- can be tested with known chart fixtures;
- aligns with privacy rules if no network calls are made.

Cons:

- requires explicit dependency approval;
- library accuracy, license, maintenance and bundle size must be reviewed;
- may not include Placidus houses or reliable historical timezone handling;
- still needs fixture tests.

Privacy implications:

- good if fully local.

PWA/offline implications:

- good if bundle size and cache behavior are acceptable.

Accuracy:

- depends on the chosen provider.

Complexity:

- medium to high.

Fit now:

- recommended future provider category, but not to add in Task 5.1.

### D. Server-side calculation later

Pros:

- can use mature native libraries and large ephemeris files without bloating the PWA;
- easier to centralize updates, timezone data and fixtures.

Cons:

- conflicts with local-first privacy by default;
- requires backend, consent, data transfer, security and deletion rules;
- breaks offline-first behavior;
- out of scope for Sprint 5.

Privacy implications:

- high risk unless explicit opt-in and strong privacy controls exist.

PWA/offline implications:

- poor for offline use.

Accuracy:

- potentially high.

Complexity:

- high product and privacy complexity.

Fit now:

- not suitable now.

### E. Hybrid approach

Pros:

- preserves current pre-generated dashboard data;
- allows an explicit natal engine interface with `notSupported` fallbacks;
- can later connect a local browser-compatible provider if approved;
- can optionally use Node Swiss Ephemeris for developer-only fixtures.

Cons:

- requires careful boundaries between generated dashboard events and runtime natal calculations;
- provider selection remains future work;
- still needs timezone and house strategy.

Privacy implications:

- good if runtime calculations remain local.

PWA/offline implications:

- good if the eventual provider is local and cacheable.

Accuracy:

- good only after a tested provider is connected.

Complexity:

- manageable if introduced in layers.

Fit now:

- best path for this project.

## Historical Timezone Strategy

Natal calculation starts from local birth date, local birth time, birthplace and timezone. The engine needs a correct UTC instant before calculating planetary positions and houses.

Why timezone matters:

- the Moon moves fast, so wrong UTC conversion can change degree/sign;
- house cusps, ASC and MC are extremely time-sensitive;
- daylight saving and legal timezone changes affect historical births.

Why `Europe/Moscow` is not enough:

- profiles may be born outside Moscow;
- even Moscow has historical timezone changes;
- a plain current offset does not represent past civil time rules;
- JavaScript `Date` parsing alone is not a tested historical astrology timezone strategy.

MVP rule:

- require a timezone string on the profile;
- keep missing timezone as a readiness blocker;
- do not claim historical precision until a timezone strategy/library and fixtures are added;
- do not infer timezone from city without explicit geocoding/location work.

Future work:

- choose a local timezone conversion strategy;
- test historical DST / civil-time edge cases;
- define how unknown or approximate time changes output confidence.

## House / ASC / MC Strategy

Houses and angles require:

- birth UTC instant;
- birthplace latitude and longitude;
- house system;
- reliable sidereal time / obliquity math or provider support.

Whole Sign:

- still needs the Ascendant sign;
- therefore birth time, coordinates and timezone remain required.

Equal:

- needs the Ascendant degree;
- requires reliable ASC calculation.

Placidus:

- needs a real house calculation engine;
- can have high-latitude edge cases;
- must be tested against known fixtures before display.

If birth time is `unknown`:

- houses are unsupported;
- ASC / MC are unsupported.

If birth coordinates are missing:

- houses are unsupported;
- ASC / MC are unsupported.

If birth timezone is missing:

- exact natal calculation is not ready.

## Recommended Engine Path

Choose the hybrid path:

1. Keep current generated Swiss Ephemeris event data for the general dashboard.
2. In Sprint 5, add pure astrology math primitives and neutral result models that can return explicit `notSupported`.
3. Add a natal engine/provider interface without connecting an unapproved dependency.
4. Keep profile readiness separate from calculation capability.
5. Evaluate a local browser-compatible provider in a later task only with explicit approval.
6. Use Node `swisseph` later only for build-time data or developer fixtures unless a browser-safe Swiss Ephemeris/WASM path is deliberately chosen.

Do not use current fallback formulas for natal claims.

Do not send birth data to a remote calculation service.

## Sprint 5 Safe MVP

Safe Sprint 5 work before adding a real provider:

- pure math primitives:
  - degree normalization;
  - zodiac sign mapping;
  - degree within sign;
  - angular distance;
  - aspect detection;
  - orb checking;
  - degree formatting.
- neutral natal result shapes;
- engine/provider capability objects;
- explicit `notSupported` responses;
- birth date/time readiness and timezone warnings;
- fixture planning and debug safety;
- no natal chart UI until real values exist.

Task 5.2 should start with pure math primitives only.

Task 5.5 may connect a provider only if a dependency is explicitly approved. Otherwise it should return `notSupported`.

## Dependencies That May Be Needed Later

Possible future dependency categories:

- browser-compatible astronomy / astrology ephemeris provider;
- browser-safe Swiss Ephemeris / WASM provider if licensing and bundle size are acceptable;
- historical timezone conversion library;
- optional local geocoding dataset or explicit-consent geocoding integration;
- fixture/reference data for known natal charts.

Dependency approval requirements:

- must run locally for default behavior;
- must not transmit birth data;
- must have acceptable license and maintenance status;
- must be covered by deterministic tests before user-facing natal values appear.

## Risks

- False precision if fallback formulas are reused for natal claims.
- Incorrect UTC conversion without historical timezone handling.
- Incorrect houses or ASC / MC when birth time is unknown or coordinates are missing.
- Large PWA bundle if ephemeris files or WASM are added without planning.
- Privacy regression if calculations move to a server or remote API.
- Debug leakage of birth data, coordinates or full profiles.
- Unclear support status if helpers return partial values instead of explicit `notSupported`.

## Decisions

- Current app cannot reliably calculate natal planets, houses, ASC / MC or personal transits.
- Current `swisseph` stays Node/build-time only.
- Do not add dependencies in Task 5.1.
- Do not modify `src/ephemeris-data.js` or run `generate:ephemeris`.
- Use explicit `notSupported` until a reliable provider is approved and tested.
- Recommended path is hybrid: existing generated dashboard events plus future local natal provider behind a strict engine interface.
- Next task is Task 5.2 — Add Astrology Math Primitives.
