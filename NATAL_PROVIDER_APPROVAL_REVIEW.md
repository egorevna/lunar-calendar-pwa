# NATAL_PROVIDER_APPROVAL_REVIEW.md

## Purpose

This document records Task 6.4a provider approval review for the first real natal provider candidate.

This is documentation and research only.

Main rule:

```txt
Do not install or integrate this provider until the user explicitly approves it.
```

```txt
Approval must happen after fixture strategy and manual review.
```

No dependency is approved by this document alone.

## Review Status

Review date: 2026-05-16

Web access was available. Sources checked were limited to package documentation, npm, GitHub repository pages, repository files, and existing project strategy documents.

Status:

```txt
preliminary approval review complete
dependency not installed
provider not connected
integration blocked until explicit approval
```

## Candidate Provider

Primary candidate:

```txt
astronomy-engine
```

Reason for primary review:

- `NATAL_PROVIDER_RESEARCH.md` selected `astronomy-engine` as the best first candidate for a local natal planet-position provider;
- it appears browser/PWA-compatible;
- it has no runtime dependencies according to npm/package metadata;
- it has an MIT license;
- it supports Sun, Moon and planet astronomy calculations.

Comparison candidates from `NATAL_PROVIDER_RESEARCH.md`:

- `circular-natal-horoscope-js` — broader astrology chart API, but higher risk because it includes houses/angles/aspects and would need heavier accuracy/maintenance review before use.
- `astronomia` — browser-compatible low-level Meeus/VSOP87 algorithm library, but would require more adapter/math work and is not a drop-in natal provider.
- Swiss Ephemeris browser/WASM packages — technically attractive but license, bundle and PWA cache risk remain too high for this approval step.
- Server-side provider — out of scope for Sprint 6 because it would send sensitive birth data outside the device.

## Sources Checked

Primary sources:

- Astronomy Engine npm package: https://www.npmjs.com/package/astronomy-engine
- Astronomy Engine GitHub repository: https://github.com/cosinekitty/astronomy
- Astronomy Engine JavaScript README: https://raw.githubusercontent.com/cosinekitty/astronomy/master/source/js/README.md
- Astronomy Engine package metadata: https://raw.githubusercontent.com/cosinekitty/astronomy/master/source/js/package.json
- Astronomy Engine license: https://raw.githubusercontent.com/cosinekitty/astronomy/master/LICENSE

Comparison sources:

- Circular Natal Horoscope JS GitHub repository: https://github.com/0xStarcat/CircularNatalHoroscopeJS
- Astronomia GitHub repository: https://github.com/commenthol/astronomia

Project sources:

- `NATAL_PROVIDER_RESEARCH.md`
- `NATAL_FIXTURE_STRATEGY.md`
- `NATAL_ENGINE_STRATEGY.md`
- `src/natalProviderAdapter.js`
- `src/planetaryPositionProvider.js`
- `src/natalEngine.js`
- `src/birthDateTime.js`

## Provider Identity

Provider:

```txt
astronomy-engine
```

Package:

```txt
npm i astronomy-engine
```

Official docs / package page:

- https://www.npmjs.com/package/astronomy-engine

Repository:

- https://github.com/cosinekitty/astronomy

Maintainer / organization:

- Don Cross / `cosinekitty`

Current package version checked:

```txt
2.1.19
```

Current status:

```txt
likely maintained, but release cadence needs manual verification before install
```

Notes:

- npm lists version `2.1.19`, zero dependencies, built-in TypeScript declarations, MIT license and an unpacked size of about `1.84 MB`.
- GitHub lists the project as public with MIT license and a latest release shown as `Official release for #330` from 2023-12-14.
- The repository README states a long-term maintenance intention, but install approval should still verify current repository activity and issue status manually.

License:

```txt
MIT
```

## Privacy Review

Provider privacy status:

```txt
likely local-only but needs source audit verification
```

Observed:

- The JavaScript package is documented for browser and Node.js use.
- The package metadata lists no runtime dependencies.
- The project describes itself as generated local source code for astronomy calculations.
- No remote API, backend requirement, fetch behavior, XMLHttpRequest behavior or network call requirement was found in the checked documentation.

Still required before install:

- source audit after dependency install in an isolated branch;
- check bundled source for `fetch`, `XMLHttpRequest`, `WebSocket`, remote URLs and telemetry-like behavior;
- confirm browser build works offline in the PWA.

Privacy conclusion:

- Good local-first candidate for natal planet positions.
- Do not treat privacy as fully confirmed until source audit and offline test pass.
- Birth date, birth time, coordinates and timezone must not be sent outside the device.

## Browser / PWA Compatibility

Browser/PWA status:

```txt
likely compatible
```

Evidence:

- npm documentation says the JavaScript version supports client-side browser programming and Node.js.
- The JavaScript README lists browser scripting examples.
- Package metadata exports ESM and CommonJS entries and includes browser bundles:
  - `astronomy.browser.js`
  - `astronomy.browser.min.js`
  - `esm/astronomy.js`
- Package metadata lists `sideEffects: false`, which is favorable for bundling, though actual PWA impact still needs measurement.

Node-only module check:

- No `fs`, `path`, `child_process`, native binding or WASM requirement was found in checked package metadata.
- This must be verified after installation by inspecting the installed package and running a browser/PWA smoke test.

iPhone Safari:

- Likely compatible because the package ships browser JavaScript, not native bindings.
- Must be verified manually after installation in an isolated branch.

Bundle/PWA impact:

- npm unpacked size: about `1.84 MB`.
- Project README states the minified JavaScript target/current browser code is around `116 KB`.
- Actual app bundle/cache impact must be measured after installation in an isolated branch because tree-shaking and import path choices matter.

## Calculation Capabilities

Status legend:

- `supported` — documented enough for candidate review;
- `pending-fixtures` — likely available but must pass fixtures before user-facing use;
- `not supported` — not provided as a ready feature;
- `unclear` — not proven from checked sources.

| Capability | Status | Notes |
| --- | --- | --- |
| arbitrary birth dates | supported | Functions accept `Date`, numeric UTC days or `AstroTime`; repository claims calculations for calendar dates far before/after present. |
| Sun | supported | Supported body. |
| Moon | supported | Supported body. |
| Mercury | supported | Supported body. |
| Venus | supported | Supported body. |
| Mars | supported | Supported body. |
| Jupiter | supported | Supported body. |
| Saturn | supported | Supported body. |
| Uranus | supported | Supported body. |
| Neptune | supported | Supported body. |
| Pluto | supported | Supported body. |
| ecliptic longitude | pending-fixtures | API includes ecliptic coordinate functions, but astrology adapter must choose the correct geocentric tropical longitude path. |
| tropical zodiac | pending-fixtures | True ecliptic-of-date longitude can support tropical-style mapping, but fixtures must confirm convention. |
| sidereal zodiac | not supported | No ready astrology sidereal zodiac API was found. |
| speed | unclear | State vectors include velocity, but astrology speed output should remain unsupported until designed and fixture-tested. |
| retrograde | unclear | Could perhaps be derived later, but must remain unsupported until provider-backed and tested. |
| houses | not supported | No astrology house system API found. |
| ASC | not supported | No ready Ascendant API found. Horizontal/sidereal building blocks do not equal a validated ASC implementation. |
| MC | not supported | No ready Midheaven API found. |
| Whole Sign | not supported | Requires separate house/ASC strategy. |
| Placidus | not supported | Requires separate house engine. |
| Equal | not supported | Requires separate house/ASC strategy. |
| lunar nodes | partial / unclear | Moon node search exists, but natal node longitude output is not approved for this MVP. |
| Chiron | not supported | Not in required supported body enum. |
| Lilith | not supported | No ready astrology Lilith API found. |

Important adapter caution:

- `EclipticLongitude(body, date)` is documented as heliocentric ecliptic longitude.
- Natal astrology needs geocentric apparent ecliptic longitude for planets as seen from Earth.
- The future adapter must not use a plausible-looking function until fixture validation proves the coordinate convention.

## Input and Timezone Requirements

Provider time input:

- JavaScript `Date`;
- numeric UTC day value since J2000;
- `AstroTime`.

Provider timezone behavior:

```txt
The provider does not solve historical birth local time to UTC for us.
```

The JavaScript README says calculations use UTC via `AstroTime`, which does not contain timezone information. Therefore:

- local birth date/time must be converted to UTC before provider calculation;
- `src/birthDateTime.js` remains necessary;
- current project behavior must continue to avoid fake UTC conversion;
- IANA timezone and historical DST strategy remain separate work.

Provider location input:

- Observer latitude/longitude is supported for horizon/rise/set style calculations.
- This does not mean astrology houses, ASC or MC are approved.

House system input:

- No ready house system API was found.
- Whole Sign, Equal and Placidus remain unsupported.

## Accuracy and Fixture Requirements

Accuracy status:

```txt
promising but not approved
```

Evidence:

- Repository README states the library is designed for accuracy within about one arcminute and says calculations are tested against NOVAS, JPL Horizons and other sources.
- This is promising for astronomy calculations, but Astro PWA still needs project-specific natal fixtures before user-facing values.

Required fixture validation before production use:

- modern date fixture;
- historical date fixture;
- Moon-sensitive fixture;
- timezone-sensitive fixture;
- known expected planetary longitudes;
- documented reference source for each expected value;
- tolerance policy recorded in tests;
- comparison against Swiss Ephemeris, Astro.com, JPL Horizons, or another trusted reference where appropriate.

Preliminary tolerance discussion:

- Sun and slower planets: target `<= 0.1°` after coordinate convention is proven.
- Moon: start conservatively and tighten only after UTC/time-scale validation; the fixture strategy currently allows a wider first-pass tolerance.
- ASC / MC / houses: no tolerance should be approved until timezone and house strategy exist.

No tolerance is final until fixtures have approved expected values.

## License Review

License:

```txt
MIT
```

Preliminary assessment:

- MIT is generally compatible with commercial and proprietary use.
- Include copyright/license notice as required.
- No copyleft/viral risk was identified from the checked license text.

Manual review still required:

- confirm installed package license file matches repository license;
- confirm no bundled third-party data has separate licensing;
- confirm app/product requirements accept MIT notice obligations.

## Bundle / PWA Impact

Known package/package-doc data:

- npm unpacked size: about `1.84 MB`;
- npm dependencies: `0`;
- package files include ESM and browser bundles;
- README says current minified JavaScript is about `116 KB`.

PWA risk:

- likely acceptable for lazy-loaded or carefully imported natal calculations;
- should not be added directly to the critical dashboard path without measurement;
- iPhone PWA load and cache behavior must be tested after installation.

Recommendation:

- if approved later, integrate behind `src/natalProviderAdapter.js`;
- measure bundle size after install;
- consider lazy loading the provider module if the main dashboard bundle grows too much;
- update PWA cache only when provider code becomes app-visible.

## Architecture Integration Plan

If explicitly approved later, integration should follow this path:

1. Install the approved provider in an isolated branch.
2. Keep default `notSupported` behavior until fixtures pass.
3. Add a provider-specific adapter behind `src/natalProviderAdapter.js`.
4. Do not import the provider directly in UI modules.
5. Keep `src/planetaryPositionProvider.js` as the normal provider-facing boundary for planet positions.
6. Keep `src/natalEngine.js` as the orchestration layer.
7. Use `src/birthDateTime.js` for input readiness and continue blocking fake UTC conversion.
8. Add fixture tests from `NATAL_FIXTURE_STRATEGY.md`.
9. Enable only the capabilities proven by fixtures.
10. Keep houses, ASC / MC, aspects, transits, speed and retrograde disabled until separately implemented and validated.

Likely files touched after approval:

- `package.json`;
- `package-lock.json`;
- `src/natalProviderAdapter.js`;
- `src/planetaryPositionProvider.js`;
- `src/natalEngine.js`;
- `test/fixtures/natalProviderFixtures.js`;
- provider-specific tests.

Files that should not be touched just to approve planet positions:

- `src/app.js`;
- `index.html`;
- natal chart UI;
- profile UI;
- `src/ephemeris-data.js`;
- `scripts/generate-ephemeris.cjs`.

## Unsupported Features After Approval

Even if `astronomy-engine` is approved for planet positions, these remain unsupported until separately proven:

- houses;
- ASC / MC;
- Whole Sign / Equal / Placidus house systems;
- natal aspects;
- personal transits;
- transit orbs;
- Moon in natal house;
- personal ritual scoring based on natal chart factors;
- sidereal zodiac;
- Chiron;
- Lilith;
- retrograde and speed, unless explicitly designed and fixture-tested.

## Approval Gate

Do not install or integrate this provider until the user explicitly approves it.

Approval must happen after fixture strategy and manual review.

Before installing, Codex must present:

- provider name;
- package version;
- official source;
- license;
- privacy behavior;
- browser/PWA compatibility;
- bundle impact estimate;
- supported capabilities;
- unsupported features;
- fixture validation plan;
- rollback plan if fixtures fail.

Approval must be explicit. A positive recommendation in this document is not approval.

## Recommendation

Decision table:

| Item | Decision |
| --- | --- |
| Provider | `astronomy-engine` |
| Approval status | pending |
| Recommendation | recommend conditional approval review as first local planet-position candidate, but do not install yet |
| Install dependency now | no |
| Natal planets | pending approval and fixture validation |
| Retrograde / speed | no for now / pending future design |
| Houses | no |
| ASC / MC | no |
| Personal transits | no for now |
| Privacy | likely local-only but needs source audit verification |
| Browser/PWA | likely compatible, verify on iPhone Safari after install |
| License | MIT, acceptable pending manual package/license review |
| Bundle impact | likely manageable, must measure after install |
| Fixture readiness | fixtures exist structurally, expected values still pending |
| Main risks | wrong longitude convention, fake readiness, timezone conversion, bundle impact, unverified source audit |

Recommended path:

1. Keep Task 6.4b blocked until explicit approval.
2. If user approves later, install `astronomy-engine` in an isolated provider integration task.
3. Add a provider-specific adapter.
4. Run fixture validation before any user-facing natal value.
5. Enable only natal planet positions if fixtures pass.
6. Keep houses, ASC / MC, transits, speed and retrograde `notSupported`.

## Open Questions

- Which exact function path should produce geocentric tropical ecliptic longitude for each natal body?
- How should Sun and Moon positions be normalized to the same astrology coordinate convention?
- What trusted reference source will provide expected fixture longitudes?
- What exact tolerance should be accepted after reference-source comparison?
- Does installed package source contain any network-capable code paths?
- What is the measured app bundle and PWA cache impact?
- Should the provider be lazy-loaded outside the critical dashboard path?
- Does the package behave correctly in iPhone Safari PWA mode?
- Can retrograde/speed be exposed reliably later without inference hacks?

## Decision Log

- Task 6.4a is review-only.
- No dependency was installed.
- No package files were changed.
- No provider was connected.
- No real natal planets were calculated.
- No houses, ASC / MC, transits, aspects or orbs were calculated.
- `astronomy-engine` remains the first recommended candidate for conditional approval, focused only on local natal planet positions.
- Task 6.4b remains blocked until explicit user approval.
