# NATAL_PROVIDER_RESEARCH.md

## Purpose

This document records Task 6.1 research for choosing a real natal calculation provider.

Main rule:

```txt
Do not install a provider dependency and do not show user-facing natal values until the provider is explicitly approved and fixture-validated.
```

Web access was available for this research. Sources were limited to npm package pages, GitHub repositories, package/CDN metadata, and Swiss Ephemeris licensing material.

## Requirements

The future provider must support the project goals without breaking the local-first privacy model.

Required before approval:

- browser/PWA compatibility;
- no network calls with birth data;
- arbitrary birth date support;
- tropical ecliptic longitude support;
- Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune and Pluto support;
- deterministic fixture tests;
- acceptable license;
- acceptable bundle/PWA impact;
- clear unsupported features.

Nice to have, but not required for the first planet-position MVP:

- retrograde;
- speed;
- houses;
- ASC / MC;
- aspects.

## Current Project Constraints

Current project state:

- `package.json` has no runtime dependencies.
- `swisseph` exists only as a dev dependency.
- `src/natalEngine.js` already routes through `src/planetaryPositionProvider.js`.
- `src/planetaryPositionProvider.js` currently returns explicit `notSupported`.
- `src/birthDateTime.js` does not fake UTC conversion.
- `src/astroMath.js` provides pure degree/sign/aspect primitives only.
- `scripts/generate-ephemeris.cjs` uses Node `swisseph` only for generated dashboard events.

Important constraints:

- do not use current fallback astronomy formulas for natal claims;
- do not send birth data to a server;
- do not use a provider before fixture validation;
- keep houses, ASC / MC and transits `notSupported` unless they are provider-backed and tested;
- historical timezone conversion remains a separate risk.

## Candidate Providers

### Candidate: astronomy-engine

- type: browser-compatible astronomy library.
- browser/PWA support: yes; npm documentation says the JavaScript version supports client-side browser programming and Node.js, with browser bundles available.
- external calls: no external calls are documented; source audit is still required before approval.
- arbitrary birth dates: likely yes, via date/time inputs to position functions.
- tropical longitude: likely yes for ecliptic longitude of date, but fixture validation must confirm the exact coordinate convention needed by astrology output.
- planets: supports Sun, Moon and planets including Pluto according to package documentation.
- Moon: yes.
- retrograde/speed: not a direct astrology API; speed may be derived from state vectors later, but should remain unsupported until tested.
- houses/ASC/MC: not a natal astrology house engine.
- timezone support: expects an instant/date; historical local-time-to-UTC conversion remains our responsibility.
- license: MIT.
- bundle/PWA impact: npm reports about 1.84 MB unpacked and zero dependencies.
- testability: good; deterministic functions can be fixture-tested.
- pros:
  - local browser/Node library;
  - no runtime dependencies;
  - clear planet/Moon position API;
  - permissive license;
  - good fit for first natal planet-position MVP.
- cons:
  - not an astrology chart library;
  - no houses/ASC/MC strategy by itself;
  - retrograde/speed need careful provider-backed design;
  - coordinate convention must be checked against fixtures.
- risks:
  - wrong astrology longitude convention if adapter uses the wrong coordinate function;
  - false readiness if houses/ASC/MC are assumed from a planet-position provider.
- verdict: best first candidate for a local natal planet-position provider, but do not install yet. Validate with public fixtures and request explicit approval first.

### Candidate: circular-natal-horoscope-js

- type: browser-compatible astrology/natal chart library.
- browser/PWA support: likely yes; GitHub documentation describes a browser demo and webpack bundle.
- external calls: no external calls are documented; source audit is required before approval.
- arbitrary birth dates: yes by design: input is date, time and latitude/longitude.
- tropical longitude: yes; the package supports tropical and sidereal zodiacs.
- planets: claims Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune and Pluto.
- Moon: yes.
- retrograde/speed: retrograde is claimed; speed is not clearly established as an exposed output.
- houses/ASC/MC: claims ascendant, Midheaven and multiple house systems including Whole Sign, Equal and Placidus.
- timezone support: depends on `moment`, `moment-timezone` and `tz-lookup`.
- license: Unlicense.
- bundle/PWA impact: npm reports about 828 kB unpacked and 3 dependencies.
- testability: potentially good, but output shape and accuracy need fixture validation.
- pros:
  - directly maps to natal chart concepts;
  - includes angles, houses, aspects and retrograde;
  - local JS package.
- cons:
  - last npm publish is old;
  - dependency chain includes Moment-era timezone packages;
  - full-chart output can tempt premature UI claims;
  - accuracy and high-latitude/house edge cases must be audited.
- risks:
  - relying on a convenience astrology wrapper without independent fixture validation;
  - silently treating its houses/ASC/MC as ready before timezone and fixture strategy are proven.
- verdict: useful comparison candidate, especially for houses/ASC/MC, but not the recommended first approval target. Treat as higher-risk until fixture accuracy and maintenance are checked.

### Candidate: astronomia

- type: low-level browser-compatible astronomical algorithms library.
- browser/PWA support: yes; GitHub documentation lists modern browser support.
- external calls: no external calls are documented; source audit is still required.
- arbitrary birth dates: yes for algorithmic date/JD inputs.
- tropical longitude: provides ecliptic coordinate and planet position modules, but adapter work is needed.
- planets: includes VSOP87 planet position modules and Pluto support.
- Moon: includes Moon position modules.
- retrograde/speed: not a direct astrology API; would need custom logic and fixtures.
- houses/ASC/MC: not a ready natal house engine.
- timezone support: none for historical civil time; project must solve local birth time to UTC separately.
- license: MIT.
- bundle/PWA impact: modular imports can reduce footprint, but data modules must be measured before approval.
- testability: good for algorithm-level fixtures; more work than a ready provider.
- pros:
  - local browser-compatible algorithms;
  - MIT license;
  - modular;
  - useful as a building block.
- cons:
  - more adapter/math work;
  - not a drop-in natal provider;
  - no complete astrology chart interface.
- risks:
  - expanding scope into writing our own natal provider;
  - subtle coordinate/time-scale errors.
- verdict: viable fallback/building-block candidate, not the shortest path for Sprint 6 approval.

### Candidate: Swiss Ephemeris WASM / browser packages

- type: browser/WASM Swiss Ephemeris wrappers, for example `@swisseph/browser` or `swisseph-wasm`.
- browser/PWA support: likely yes for browser packages; `@swisseph/browser` is described as WebAssembly Swiss Ephemeris for browsers.
- external calls: should be local if bundled, but package source must be audited.
- arbitrary birth dates: likely yes if full Swiss Ephemeris API/data is bundled.
- tropical longitude: yes if Swiss Ephemeris flags are exposed.
- planets: likely yes.
- Moon: likely yes.
- retrograde/speed: likely yes if `SEFLG_SPEED` or equivalent is exposed.
- houses/ASC/MC: likely possible if house functions are exposed.
- timezone support: no; still needs birth local time to UTC strategy.
- license: major concern. `@swisseph/browser` metadata lists AGPL-3.0. Swiss Ephemeris also has commercial licensing terms for distributed apps / server use.
- bundle/PWA impact: potentially high due to WASM and ephemeris files.
- testability: excellent if package is stable, but fixture and licensing checks are mandatory.
- pros:
  - potentially closest to professional astrology calculations;
  - could cover planets, speed, houses and angles in one provider.
- cons:
  - license/commercial-use approval gate;
  - bundle size and PWA cache impact;
  - package maturity must be audited carefully.
- risks:
  - accidentally introducing AGPL/commercial obligations;
  - heavy PWA payload;
  - shipping ephemeris/WASM assets without cache strategy.
- verdict: technically attractive, but not safe to approve now. Requires explicit license and bundle review before any dependency decision.

## Swiss Ephemeris Node / Build-Time Option

Current `swisseph` is a Node.js native binding and is already used by `scripts/generate-ephemeris.cjs`.

Fit:

- good for generated public dashboard data;
- good for developer-side reference/fixture generation if carefully separated from private user data;
- not good for browser runtime natal calculations.

Why not use it for arbitrary user birth dates:

- it cannot run in the static browser PWA as currently installed;
- pre-generating all possible birth dates, times, places, house systems and transits is not practical;
- using it at runtime would imply a server or local native process, which is outside the static PWA model.

Verdict:

- keep Node `swisseph` for current generated ephemeris and maybe future developer-only reference fixtures;
- do not use it as the default user-profile natal runtime provider.

## Server-Side Option

Server-side Swiss Ephemeris or another backend provider could be accurate, but it is not the Sprint 6 default.

Pros:

- mature native libraries can run server-side;
- bundle size stays small;
- central fixture and timezone handling may be easier.

Cons:

- sends sensitive birth data outside the device;
- breaks default offline/local-first model;
- requires backend, consent UX, deletion/export/sync policy and security work;
- creates a much larger privacy and product scope.

Verdict:

- do not use server-side calculation in Sprint 6;
- consider only in a future explicitly approved server/cloud sprint.

## Hybrid Option

Recommended architecture direction:

1. Keep current generated Swiss Ephemeris data for the general Moscow dashboard.
2. Keep current `notSupported` natal engine behavior until provider approval.
3. Use Task 6.2 to define public/synthetic fixtures.
4. Use Task 6.3 to formalize a provider adapter contract.
5. If approved later, start with a local browser provider for natal planet positions only.
6. Keep houses, ASC / MC, retrograde/speed, aspects and transits behind separate capability flags and fixtures.

This keeps the app local-first while avoiding fake precision.

## Recommended Provider Path

Decision:

```txt
Do not approve or install a provider dependency in Task 6.1.
```

Best first candidate:

```txt
astronomy-engine
```

Reason:

- strongest local-first fit for first natal planet-position MVP;
- browser/PWA and Node support;
- no runtime dependencies;
- MIT license;
- supports Sun, Moon and planetary ecliptic calculations;
- easier to test in isolated fixtures.

What to verify before approval:

- exact output needed for geocentric tropical ecliptic longitudes;
- how to handle Sun and Moon longitude consistently;
- date range accuracy for modern and historical fixtures;
- whether velocity/state vectors can safely support retrograde later;
- package source has no network calls;
- final bundle size in this PWA;
- license and maintenance status.

Not recommended as first dependency:

- `circular-natal-horoscope-js`: promising full astrology API but older, broader, and needs heavy fixture/maintenance audit.
- Swiss Ephemeris WASM/browser packages: promising precision but license and bundle risk are too high for immediate approval.
- server-side provider: not local-first and out of scope.

Features that remain `notSupported` after the first provider approval unless separately proven:

- retrograde;
- speed;
- houses;
- ASC / MC;
- natal aspects;
- personal transits;
- transit orbs.

## Approval Gate

Before adding any provider dependency, Codex must stop and request approval.

The approval request must include:

- package/provider name;
- official source;
- exact package version considered;
- license;
- privacy behavior;
- browser/PWA compatibility;
- expected bundle impact;
- capabilities;
- unsupported features;
- fixture validation plan;
- rollback plan if fixtures fail.

No dependency may be installed without explicit user approval.

## Fixture Validation Requirements

Minimum fixture set for Task 6.2:

- modern date fixture;
- historical date fixture;
- Moon-sensitive fixture;
- timezone-sensitive fixture;
- fixture with all 10 required planet keys;
- known expected planetary longitudes or sign/degree values;
- documented source for expected values;
- explicit tolerance.

Initial tolerance recommendation:

- Sun and slower planets: target `<= 0.1°` once source conventions match;
- Moon: allow a wider first-pass tolerance such as `<= 0.25°`, then tighten after confirming time scale and source;
- reject any provider path that cannot consistently pass documented fixtures.

Fixture privacy:

- use public, documented or synthetic examples;
- do not use real private app profiles;
- never commit private birth data as fixtures.

## Unsupported Until Provider Passes Fixtures

Keep these explicit `notSupported` until provider approval and fixture validation:

- natal planets;
- retrograde;
- speed;
- houses;
- ASC / MC;
- aspects;
- transits;
- orbs.

Even after a planet-position provider passes fixtures, keep these unsupported unless separately provider-backed and tested:

- houses;
- ASC / MC;
- personal transits;
- personal transit orbs;
- Moon in natal house;
- personal ritual scoring based on natal factors.

## Decision Log

- Task 6.1 is research/documentation only.
- No dependency is approved yet.
- No provider is connected yet.
- Recommended path is hybrid.
- First provider candidate for approval review is `astronomy-engine` for local natal planet positions.
- `circular-natal-horoscope-js` and Swiss Ephemeris WASM/browser packages remain comparison candidates, not approved dependencies.
- Server-side natal calculation remains out of scope for Sprint 6.
- Task 6.2 should create fixture strategy and public/synthetic fixtures before any provider installation.

## Sources

- Astronomy Engine npm: https://www.npmjs.com/package/astronomy-engine
- Astronomy Engine GitHub: https://github.com/cosinekitty/astronomy
- Circular Natal Horoscope JS npm: https://www.npmjs.com/package/circular-natal-horoscope-js
- Circular Natal Horoscope JS GitHub: https://github.com/0xStarcat/CircularNatalHoroscopeJS
- Astronomia GitHub: https://github.com/commenthol/astronomia
- Current `swisseph` npm package: https://www.npmjs.com/package/swisseph
- `@swisseph/browser` package/CDN metadata: https://www.jsdelivr.com/package/npm/%40swisseph/browser
- `swisseph-wasm` GitHub: https://github.com/prolaxu/swisseph-wasm
- Swiss Ephemeris professional license contract: https://forum.astro.com/swisseph/secont_e.pdf
