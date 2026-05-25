# Changelog

## 2026-05-25 — Complete Task 11.10 Sprint 11 Hardening

- Completed final Sprint 11 audit / hardening for Houses / ASC / MC.
- Rechecked guardrails, house-system separation, Placidus benchmark validation, coordinate/profile shape, architecture boundaries, privacy, UI/debug behavior and PWA cache.
- Confirmed no code fixes were needed during hardening.
- Confirmed PWA cache remains `lunar-calendar-v85`.
- No calculation engines, selected-system router, planet-in-house assignment, provider calculations, package files, interpretations, Pars Fortuna / Arabic Parts, fixed stars, transits or generic `src/houses.js` / `src/houseSystems.js` were changed.
- Sprint 11 is closed. Next active work is Sprint 12 planning — House Cusps + Pars Fortuna + Basic Arabic Parts, but Sprint 12 was not started.

## 2026-05-25 — Complete Task 11.9 Houses / ASC / MC Debug

- Added pure `src/housesDebug.js` safe status helper.
- Added `Houses / ASC / MC UI Debug` section to `?debug=1`.
- Debug shows active profile id/name only, readiness booleans, selected house system, counts, capabilities and privacy flags.
- Debug does not expose raw birth data, raw coordinates, UTC, raw timezone value, raw planet/cusp longitudes, provider payloads, full profile JSON or full houses/cusps/assignments arrays.
- Bumped PWA cache to `lunar-calendar-v85` and cached `src/housesDebug.js`.
- No calculation engines, selected-system router, planet-in-house assignment, provider calculations, package files, interpretations or generic `src/houses.js` / `src/houseSystems.js` were changed.
- Next active task is Task 11.10 — Sprint 11 Hardening, but it was not started.

## 2026-05-25 — Harden Houses display single-source consistency

- Fixed the Houses UI view-model source path so `src/housesDisplay.js` uses the unwrapped selected house engine result as the single source for both angles and house rows.
- Updated `src/housesForProfile.js` to pass the already calculated selected house result into planet-in-house assignment instead of triggering a second independent house calculation from the same profile.
- Added regressions for Placidus display invariants: displayed ASC = house 1 cusp, MC = house 10 cusp, DSC = house 7 cusp and IC = house 4 cusp.
- Verified the Moscow `1981-04-16 04:45 Europe/Moscow` Placidus expected rows against the local `swisseph.swe_houses` oracle; houses 5/6/11/12 are `Близнецы 29°46′`, `Рак 16°42′`, `Стрелец 29°46′`, `Козерог 16°42′` for coordinates `55.7558 / 37.6173`.
- Bumped PWA cache to `lunar-calendar-v83` for the app-visible Houses display/source-path fix.
- No fake Placidus, Equal House / Whole Sign fallback, provider calculations, UI copy, package files or generic `src/houses.js` / `src/houseSystems.js` were added.
- Task 11.9 was not started.

## 2026-05-25 — Harden Houses UI runtime source path

- Added a full Moscow `1981-04-16 04:45 Europe/Moscow` Placidus regression that checks UTC conversion, ASC / MC, raw Placidus cusps, `housesForProfile` rows and `profileUi` view-model rows in one runtime path.
- Confirmed the current local runtime path renders distinct houses 1–12 and does not duplicate houses 4/5/6 or 10/11/12.
- Fixed a real mixed-shape profile bug: new manual `birthPlace.coordinates` now wins over stale legacy `birthPlace.latitude` / `longitude` direct fields.
- Fixed a Placidus root-solver edge case where an endpoint root at MC / IC could collapse intermediate cusps to repeated 4/5/6 or 10/11/12 rows.
- Bumped PWA cache to `lunar-calendar-v82` so browsers controlled by the service worker do not keep older Houses / Placidus modules.
- No fake Placidus, Equal House / Whole Sign fallback, provider calculations, UI copy, package files or generic `src/houses.js` / `src/houseSystems.js` were added.
- Task 11.9 was not started.

## 2026-05-25 — Complete Task 11.8c Houses UI ready-state verification

- Verified the Moscow `1981-04-16 04:45 Europe/Moscow` Placidus ready-state case after manual coordinate input.
- Confirmed raw Placidus cusps are distinct and align with ASC / MC / opposite cusp invariants.
- Confirmed the profile-level Houses UI view model formats distinct Placidus house rows for the same profile.
- Added regression tests to prevent duplicated Placidus cusps/rows for houses 4/5/6 and 10/11/12.
- No Placidus fallback to Equal House or Whole Sign was added.
- No provider calculations, UI copy, package files or generic `src/houses.js` / `src/houseSystems.js` were changed.
- Next active task is Task 11.9 — Houses / ASC / MC Debug, but it was not started.

## 2026-05-25 — Complete Task 11.8b Birth Place Coordinates / Manual Coordinates Input

- Added manual `Широта места рождения` and `Долгота места рождения` fields to the profile form.
- Stored valid manual coordinates under `profile.birthPlace.coordinates.latitude` / `longitude` while preserving city, country, timezone and house-system fields.
- Added profile validation for paired coordinates, latitude `-90..90` and longitude `-180..180`; empty coordinate fields remain allowed and do not store `NaN`.
- Added city-level coordinate helper copy and kept hospital-level coordinates optional.
- Confirmed no geocoding API, city lookup, browser location, Moscow auto-fill, provider changes, package changes or house calculation engine changes were added.
- Bumped PWA cache to `lunar-calendar-v80`.
- Next active task is Task 11.8c — Houses UI Ready State Verification, but it was not started.

## 2026-05-25 — Fix Houses / ASC / MC fallback copy layout

- Removed duplicated fallback message rendering in the `Дома и углы карты` UI block.
- Kept the block header to title plus `Показать` / `Скрыть`; status and fallback message now render once below the header.
- Kept limitations below the fallback message without duplicating the main fallback reason.
- Bumped PWA cache to `lunar-calendar-v79`.
- No calculation engines, selected-system router, provider calculations, interpretations, package files or generic `src/houses.js` / `src/houseSystems.js` were changed.

## 2026-05-25 — Complete Task 11.8 Houses / ASC / MC collapsible UI

- Added profile-level `src/housesForProfile.js` view-model helper.
- Added `test/housesForProfile.test.js`.
- Added the collapsible `Дома и углы карты` block inside `Мои карты` after `Термы, деканы и градусы`.
- The block is collapsed by default and shows selected house system, ASC / MC / DSC / IC, houses and planet-in-house rows when ready.
- Added safe fallback / unsupported UI states without raw birth data, raw coordinates, raw planet longitudes, interpretations or ritual scoring.
- Bumped PWA cache to `lunar-calendar-v78` and cached the app-visible houses modules.
- Kept calculation engines, selected-system router, provider calculations, package files and generic `src/houses.js` / `src/houseSystems.js` unchanged.
- Next active task is Task 11.9 — Houses / ASC / MC Debug, but it was not started.

## 2026-05-25 — Complete Task 11.7 Houses / ASC / MC display helper

- Added pure `src/housesDisplay.js`.
- Added `test/housesDisplay.test.js`.
- Implemented safe display formatting for ASC / MC / DSC / IC, house-system labels, Whole Sign house rows, Equal House / Placidus cusp house rows and planet-in-house assignments.
- Added safe not-ready / unsupported fallback formatting and display summaries for the future `Дома и углы карты` UI block.
- Kept the layer display-only: no house calculations, no selected-system routing, no planet-in-house assignment, no UI, no provider calls, no interpretations and no package changes.
- Next active task is Task 11.8 — Houses / ASC / MC Collapsible UI, but it was not started.

## 2026-05-25 — Complete Task 11.6 Planet-in-House assignment

- Added pure `src/planetInHouses.js`.
- Added `test/fixtures/planetInHousesFixtures.js`.
- Added `test/planetInHousesFixtures.test.js`.
- Added `test/planetInHouses.test.js`.
- Implemented planet-in-house assignment for selected house systems: Whole Sign by sign relative to ASC, Equal House and Placidus by planet longitude against ready cusp spans.
- Added half-open boundary behavior for cusp systems: exact cusp belongs to the house starting at that cusp, including wrap-around spans across 0°.
- Profile-level assignment uses the existing safe natal planets path and `src/houseSystemResolver.js`.
- Kept the layer assignment-only: no new house engine, no generic `src/houses.js` / `src/houseSystems.js`, no UI, no display helper, no interpretations, no provider changes and no package changes.
- Next active task is Task 11.7 — Houses / ASC / MC Display Helper, but it was not started.

## 2026-05-25 — Complete Task 11.5 Houses validation fixtures

- Added `test/fixtures/housesValidationFixtures.js`.
- Added `test/housesValidation.test.js`.
- Added manually declared Whole Sign validation sequences for ASC Aries, Scorpio and Pisces.
- Added manually declared Equal House cusp fixtures for ASC Aries 14.5°, Pisces 29° and Aries 0°.
- Reused static Placidus benchmark fixtures to validate cusp matching, ASC / MC alignment, opposite cusps, no Equal House fallback, no Whole Sign fallback and high-latitude unsupported behavior.
- Added router / no-fallback validation for current profile aliases, missing selection default, unknown selected system and selected-engine `notReady` / `unsupported` preservation.
- Added guardrail and privacy validation for missing profile, common day, unknown birth time, missing place, missing/invalid coordinates and strict source exclusions.
- No production house calculation engine, UI, PWA cache, provider calculations, package files, `src/houses.js`, `src/houseSystems.js` or planet-in-house assignment were added.
- Next active task is Task 11.6 — Planet-in-House Assignment for Selected House System, but it was not started.

## 2026-05-25 — Complete Task 11.4e House System Resolver

- Added pure `src/houseSystemResolver.js`.
- Added `test/houseSystemResolver.test.js`.
- Implemented selected house-system normalization for `wholeSign` / `whole-sign`, `equal` / `equalHouse` / `equal-house` and `placidus` / `Placidus`.
- Added router APIs that call exactly one selected engine: Whole Sign, Equal House or Placidus.
- Missing profile `houseSystem` now defaults to `whole-sign` only when no saved selection exists.
- Unknown selected house systems return explicit unsupported status with `reason: "unknownHouseSystem"` and no fallback.
- Router preserves selected engine `notReady` / `unsupported` status and reason, including Placidus high-latitude unsupported behavior.
- No direct house calculation, planet-in-house assignment, UI, PWA cache, provider calculations, package files, `src/houses.js` or `src/houseSystems.js` were added.
- Next active task is Task 11.5 — Houses Validation / Fixtures for Whole Sign / Equal House / Placidus, but it was not started.

## 2026-05-25 — Complete Task 11.4d2 Placidus calculation activation

- Added static benchmark fixtures in `test/fixtures/placidusFixtures.js`.
- Activated `src/placidusHouses.js` as a browser-safe pure Placidus calculation engine validated against 5 static `local-swisseph-swe_houses-benchmark` fixtures.
- Implemented local Placidus semi-arc cusp calculation with benchmark tolerance `0.05°`, ASC / MC alignment checks, opposite cusp checks, no Equal House fallback and no Whole Sign fallback.
- Added high-latitude / circumpolar fail-closed behavior with `status: "unsupported"` / `reason: "placidusUnsupportedAtLatitude"`.
- Hardened tests to confirm static finite fixture values, no runtime `swisseph` import, no Whole Sign / Equal House imports and dev-only `swisseph` package metadata.
- Exported existing sidereal time and mean-obliquity helpers from `src/ascMc.js` for validated house-system engines without changing provider calculations.
- `swisseph` remains a local benchmark oracle only; it is not imported into app runtime modules or bundled into the PWA. The package is private/local, and future public or commercial distribution requires license review.
- No fake Placidus, generic house-system router, planet-in-house assignment, UI, PWA cache, provider calculations, package files or generated ephemeris data were added.
- Next active task is Task 11.4e — House System Resolver / Selected System Router, but it was not started.

## 2026-05-25 — Complete Task 11.4d Placidus integration gate

- Added pure `src/placidusHouses.js`.
- Added `test/placidusHouses.test.js`.
- Completed local Placidus dependency / implementation audit: tracked `astronomy-engine` / vendor files do not provide a ready Placidus / house-cusp API.
- Recorded local `swisseph.swe_houses` as a candidate dev dependency path only; it was not activated because trusted benchmark fixtures are missing.
- Placidus is recognized as a separate `placidus` house system but returns explicit unsupported status until a validated implementation and benchmark fixtures exist.
- Added validation status output with `validated: false`, `implementationReady: false`, `benchmarkFixtures: false` and `reason: "missingBenchmarkFixtures"`.
- No fake Placidus cusps, Equal House fallback, Whole Sign fallback, quadrant cusps, generic house-system router, planet-in-house assignment, UI, PWA cache, provider calculations, package files or generated ephemeris data were added.
- Next active task is Task 11.4e — House System Resolver / Selected System Router, but it was not started.

## 2026-05-25 — Complete Task 11.4c Equal House houses engine

- Added pure `src/equalHouseHouses.js`.
- Added `test/equalHouseHouses.test.js`.
- Implemented Equal House / Равнодомная only: cusp 1 is the exact ASC longitude and cusps 2–12 advance by 30 degrees with zodiac wrap-around.
- Added Equal House house spans with `nextCuspLongitude` and wrap flags for future validation / planet-in-house work.
- Added profile-level guard for current `houseSystem` values: `equal`, `equal-house` and `equalHouse` can calculate; `wholeSign`, `whole-sign`, `placidus` and missing selection return explicit unsupported status in this engine.
- Updated `TODO.md`, `PROJECT_STATE.md`, `ARCHITECTURE.md` and `ASTRO_LOGIC.md`.
- No Whole Sign changes, Placidus, quadrant cusps, generic selected-system router, planet-in-house assignment, UI, PWA cache, provider calculations, package files or generated ephemeris data were added.
- Next active task is Task 11.4d — Placidus Engine / Validated Integration, but it was not started.

## 2026-05-25 — Complete Task 11.4b Whole Sign houses engine

- Added pure `src/wholeSignHouses.js`.
- Added `test/wholeSignHouses.test.js`.
- Implemented Whole Sign houses only: House 1 is the ASC sign and houses 2–12 follow zodiac order with wrap-around.
- Added profile-level guard for current `houseSystem` values: `wholeSign` / `whole-sign` can calculate; `equal`, `equal-house` and `placidus` return explicit unsupported status in this engine.
- Added sign-to-house primitives for future planet-in-house work without accepting planet objects or assigning planets to houses.
- Updated `TODO.md`, `PROJECT_STATE.md`, `ARCHITECTURE.md` and `ASTRO_LOGIC.md`.
- No Equal House, Placidus, quadrant cusps, generic selected-system router, planet-in-house assignment, UI, PWA cache, provider calculations, package files or generated ephemeris data were added.
- Next active task is Task 11.4c — Equal House Engine, but it was not started.

## 2026-05-25 — Document profile house system selection policy

- Added docs-only follow-up after Task 11.4a.
- Documented existing profile field `houseSystem` and stored values `wholeSign`, `equal` and `placidus`.
- Clarified that future house calculations must use the saved profile-level house system selection as the source of truth and normalize it to canonical keys `whole-sign`, `equal-house` and `placidus`.
- Added Task 11.4e — House System Resolver / Selected System Router.
- Clarified unsupported selected-system behavior: unsupported Placidus returns explicit `status: "unsupported"` / `reason: "placidusNotValidated"` and never silently falls back to Whole Sign or Equal House.
- No code, `src/`, tests, UI, provider calculations, PWA cache, package files or generated ephemeris data were changed.

## 2026-05-25 — Complete Task 11.4a house systems strategy audit

- Added docs-only House Systems Strategy / Dependency Audit.
- Sprint 11 now targets Whole Sign, Equal House and Placidus as separate house systems.
- Clarified that 0° Aries is the shared zodiac longitude coordinate reference, not a Placidus house anchor.
- Clarified Whole Sign as sign-based, Equal House as exact-ASC-longitude based and Placidus as quadrant-cusp based / ASC-MC anchored.
- Recorded local dependency audit result: current `astronomy-engine` / vendor files expose sidereal, horizon and rotation helpers, but no ready Placidus / house-cusp API was found.
- Recorded Placidus validation policy: no implementation from memory, benchmark fixtures required, no silent fallback to Equal House or Whole Sign.
- Updated `SPRINT_11_PLAN.md`, `HOUSES_ASC_MC_STRATEGY.md`, `TODO.md`, `PROJECT_STATE.md` and `ASTRO_LOGIC.md`.
- No code, `src/`, tests, UI, PWA cache, provider calculations, package files, generated ephemeris data, fixed stars, Pars Fortuna / Arabic Parts, transits, interpretations or ritual scoring were changed.
- Next active task is Task 11.4b — Whole Sign Houses Engine, but it was not started.

## 2026-05-25 — Complete Task 11.3 ASC / MC calculation engine

- Added pure `src/ascMc.js`.
- Added `test/ascMc.test.js`.
- Implemented ASC / MC calculation from validated UTC moment and birth coordinates using sidereal-time vector geometry.
- Derived DSC and IC from ASC and MC by adding 180 degrees and normalizing to the zodiac circle.
- Integrated profile-level readiness through `src/housesInputGuardrails.js` and UTC conversion through `src/birthDateTime.js`.
- Used `Astronomy.SiderealTime()` from the tracked vendor runtime for sidereal time and an internal mean-obliquity approximation.
- Exposed capabilities with ASC / MC / DSC / IC enabled while houses, house cusps, planet-in-house, Placidus, interpretations, transits and fixed stars remain disabled.
- Updated `TODO.md`, `PROJECT_STATE.md`, `ARCHITECTURE.md` and `ASTRO_LOGIC.md`.
- No houses engine, house cusps, planet-in-house assignment, UI, PWA cache, provider calculations, package files, generated ephemeris data, fixed stars, Pars Fortuna / Arabic Parts, transits, interpretations or ritual scoring were added.
- At completion time, the next active task was the Houses Engine, but it was not started; this was later split by Task 11.4a into system-specific subtasks.

## 2026-05-25 — Complete Task 11.2 birth input and coordinates guardrails

- Added pure `src/housesInputGuardrails.js`.
- Added `test/housesInputGuardrails.test.js`.
- Implemented readiness checks for future Houses / ASC / MC calculations without calculating ASC, MC, DSC, IC, houses or planet-in-house assignments.
- Guardrails now require exact birth time, birth date, birth timezone, birth place and finite birth coordinates before future house calculations can proceed.
- Supported existing and compatible coordinate shapes: `birthPlace.latitude/longitude`, `birthPlace.lat/lng`, `birthPlace.coordinates.latitude/longitude` and `birthPlace.coordinates.lat/lng`.
- Added safe not-ready reasons and Russian fallback messages for missing profile, common day, missing date/time/timezone/place, country/region-only, city-without-coordinates, missing coordinates and invalid coordinates.
- Added Sprint 11 requirements, limitations and initial `whole-sign` house-system policy helpers.
- Updated `TODO.md`, `PROJECT_STATE.md` and `ARCHITECTURE.md`.
- No provider calculations, ASC / MC engine, houses engine, UI, PWA cache, package files, generated ephemeris data, fixed stars, Pars Fortuna / Arabic Parts, transits, interpretations or ritual scoring were added.
- Next active task is Task 11.3 — ASC / MC Calculation Engine, but it was not started.

## 2026-05-25 — Start Sprint 11 Houses / ASC / MC strategy

- Started Sprint 11 — Houses / ASC / MC with docs-only Task 11.1.
- Added `SPRINT_11_PLAN.md` and `HOUSES_ASC_MC_STRATEGY.md` to the project root from the provided Sprint 11 planning sources.
- Recorded Houses / ASC / MC guardrails: exact birth time and birth place coordinates are required; no birth time, no coordinates, country/region-only place, city without coordinates and `Общий день` must return safe not-ready states.
- Recorded coordinate policy: city-level coordinates are acceptable for normal mode, hospital-level coordinates are optional.
- Recorded initial house system policy: Whole Sign first unless a validated quadrant house-cusp calculation is separately approved; ASC / MC remain calculated angles; Whole Sign must not be labeled as Placidus.
- Updated `TODO.md`, `PROJECT_STATE.md` and `ASTRO_LOGIC.md`.
- No code, `src/`, tests, UI, PWA cache, package files, generated ephemeris data, ASC / MC engine, houses engine or calculations were added.
- Next active task is Task 11.2 — Birth Input / Coordinates Guardrails, but it was not started.

## 2026-05-24 — Complete Task 10.12 Sprint 10 hardening

- Completed final hardening audit for Sprint 10 — Terms / Decans / Degree Rulers.
- Confirmed source separation across Table 5 terms, Decans Star of the Magi, Table 6 / Star of the Magi degree rulers and Table 7 / Vronsky degree rulers.
- Confirmed dataset modules store data, lookup engines perform lookup only, display/profile helpers format and compose ready results, UI renders safe user-facing text and debug exposes status/counts only.
- Confirmed Table 7 keeps its separate multi-ruler row model with source tokens, per-ruler retrograde markers, outer planets, Chiron and Proserpina support.
- Confirmed user-facing UI and `?debug=1` detailed dignity debug do not expose raw birth data, raw coordinates, raw planet longitudes, source tokens, source keys/source systems or full tables.
- Confirmed `Термы, деканы и градусы` remains collapsed by default inside `Мои карты`, after `Достоинства планет`, with short human-readable source labels and no interpretations.
- No code fixes were required; only status documentation was updated.
- No datasets, lookup engines, provider calculations, package files, PWA cache, `src/ephemeris-data.js`, houses / ASC / MC, fixed stars, transits, interpretations or ritual scoring were changed.
- Sprint 10 is closed. Next work is Sprint 11 planning / Houses / ASC / MC, but Sprint 11 was not started.

## 2026-05-24 — Complete Task 10.11 detailed dignities debug

- Added `src/detailedDignitiesDebug.js`.
- Added safe `Detailed Dignities UI Debug` output behind `?debug=1`.
- Debug now reports detailed dignity panel readiness, collapsed state, counts for terms / decans / Table 6 / Table 7, human-readable source labels, capabilities and privacy flags.
- Kept debug output limited to status/counts: no birth data, raw coordinates, raw planet longitudes, source tokens, source keys/source systems or full Table 5 / Table 6 / Table 7 rows are exposed.
- Updated `src/debugPanel.js`, `test/detailedDignitiesDebug.test.js` and `test/debugPanel.test.js`.
- Updated PWA cache to `lunar-calendar-v77` and cached the new debug module.
- No datasets, lookup engines, provider calculations, normal UI behavior, package files, `src/ephemeris-data.js`, interpretations, houses / ASC / MC, transits or fixed stars were changed.
- Task 10.12 — Sprint 10 Hardening is next, but was not started.

## 2026-05-24 — Polish Task 10.10 detailed dignity source labels

- Made expanded detailed dignity source labels consistent across terms, decans, Table 6 and Table 7.
- Terms now show `Вронский, термы` in the detail/source line instead of hiding the source label.
- Kept decans and Table 6 as `Звезда Магов`, and Table 7 as `Вронский`.
- Kept technical table numbers, source keys, source systems and source tokens out of ordinary UI output.
- Updated PWA cache to `lunar-calendar-v76`.
- No datasets, lookup engines, provider calculations, package files, `src/ephemeris-data.js`, interpretations, houses / ASC / MC, transits or fixed stars were changed.
- Task 10.11 was not started.

## 2026-05-24 — Fix Task 10.10 detailed dignity header alignment

- Aligned the `Показать` / `Скрыть` toggle to the right of the `Термы, деканы и градусы` title after the ready summary line was removed.
- Kept the duplicated summary line removed.
- Left detailed dignity limitations below the header.
- Updated PWA cache to `lunar-calendar-v75`.
- No datasets, lookup engines, provider calculations, package files, `src/ephemeris-data.js`, interpretations, houses / ASC / MC, transits or fixed stars were changed.
- Task 10.11 was not started.

## 2026-05-24 — Polish Task 10.10 detailed dignity UI copy

- Removed the duplicated ready summary line under `Термы, деканы и градусы`.
- Kept the ready header compact with only the title and `Показать` / `Скрыть` toggle.
- Simplified expanded source labels: terms show only sign/range, Table 6 degree rulers show `Звезда Магов`, and Table 7 degree rulers show `Вронский`.
- Kept Table 6 and Table 7 visually distinct without exposing technical source keys, source systems or source tokens.
- Updated compact limitations copy for detailed dignity display.
- Updated PWA cache to `lunar-calendar-v74`.
- No datasets, lookup engines, provider calculations, package files, `src/ephemeris-data.js`, interpretations, houses / ASC / MC, transits or fixed stars were changed.
- Task 10.11 was not started.

## 2026-05-24 — Complete Task 10.10 detailed dignity collapsible UI

- Added pure `src/detailedDignitiesForProfile.js` helper for ready-profile terms, decans, Table 6 degree rulers and Table 7 Vronsky degree rulers.
- Added collapsed-by-default `Термы, деканы и градусы` block inside `Мои карты` after `Достоинства планет`.
- Grouped expanded rows by natal planet and kept user-facing source labels separate: `Таблица 5`, `Звезда Магов`, `Таблица 6 / Звезда Магов`, `Таблица 7 / Вронский`.
- Added safe fallback for `Общий день` / profiles without ready natal planets.
- Updated `src/profileUi.js`, `src/app.js`, `index.html`, `src/styles.css`, `sw.js` and UI/helper tests.
- Updated PWA cache to `lunar-calendar-v73` and cached the detailed dignity modules.
- No datasets, lookup engines, provider calculations, package files, `src/ephemeris-data.js`, interpretations, houses / ASC / MC, transits or fixed stars were changed.
- Task 10.11 — Terms / Decans / Degree Rulers Debug is next, but was not started.

## 2026-05-24 — Complete Task 10.9b Table 7 detailed dignity display update

- Updated `src/detailedDignityDisplay.js`.
- Added pure formatting for already-computed Table 7 / Vronsky degree ruler lookup results.
- Supported `degreeRulers[]` and `rulers[]` result shapes with multiple rulers, outer planets, Chiron, Proserpina and per-ruler retrograde display as `R`.
- Kept user-facing Table 7 source label explicit as `Таблица 7 / Вронский`.
- Preserved existing Terms, Decans and Table 6 / Star of the Magi degree-ruler display formats.
- Updated detailed dignity summary counts to include `vronskyDegreeRulers`.
- Updated `test/detailedDignityDisplay.test.js`.
- No UI, app shell, lookup engine, dataset, provider, package file or PWA cache changes were added.
- Task 10.10 — Terms / Decans / Degree Rulers Collapsible UI is next, but was not started.

## 2026-05-24 — Complete Task 10.8f Table 7 Vronsky degree rulers lookup engine

- Added `src/degreeRulersVronsky.js`.
- Implemented pure lookup over the verified Table 7 / Vronsky degree rulers dataset.
- Added boundary behavior: `degreeIndex = floor(degreeWithinSign)` for valid `0 <= degreeWithinSign < 30`; `30°` is invalid inside one sign.
- Preserved `sourceTokens[]`, structured `rulers[]`, multiple rulers and per-ruler `retrograde` flags in lookup output.
- Added already-calculated natal planet input support with `sign.key + degree/minutes`, sign + degree only and longitude fallback through `src/astroMath.js`.
- Added summary counts by ruler occurrence, multi-ruler rows, retrograde ruler entries and outer-planet ruler entries.
- Added manual fixtures and validation tests in `test/fixtures/degreeRulersVronskyFixtures.js`, `test/degreeRulersVronskyFixtures.test.js`, `test/degreeRulersVronsky.test.js` and `test/degreeRulersVronskyValidation.test.js`.
- Kept Table 7 separate from Table 6 / Star of the Magi degree rulers.
- No dataset changes, UI, display helper changes, provider calculations, package files, app shell or PWA cache changes were added.
- Task 10.9b — Update Detailed Dignity Display Helper for Table 7 is next, but was not started.

## 2026-05-24 — Complete Task 10.8e Table 7 Vronsky degree rulers dataset

- Added `src/degreeRulersVronskyData.js`.
- Created active source-tracked Table 7 / Vronsky degree rulers dataset from 360 verified and Tome 2 cross-referenced rows.
- Preserved `sourceTokens` and `rulers[]` per row so multiple rulers, retrograde markers, outer planets, Chiron and Proserpina remain explicit.
- Stored Table 7 source metadata, verification report reference, transcription draft reference, Tome 2 cross-reference reference, integer degree policy and row model policy.
- Kept Table 7 separate from Table 6 / Star of the Magi degree rulers and did not use Table 6 as source.
- Added `test/degreeRulersVronskyData.test.js`.
- No lookup engine, UI, display helper changes, provider calculations, package files, app shell or PWA cache changes were added.
- Task 10.8f — Table 7 Vronsky Degree Rulers Lookup Engine / Fixtures is next, but was not started.

## 2026-05-24 — Complete Task 10.8d-fix Table 7 Tome 2 cross-reference

- Created `DEGREE_RULERS_TABLE_7_TOME2_CROSS_REFERENCE.md`.
- Used Vronsky Tome 2 / `Градусология` only as a textual cross-reference for Table 7 `Управитель` / `Управители` lines.
- Cross-referenced all 360 Table 7 rows against Tome 2.
- Resolved all 98 previously unclear Table 7 rows and applied 6 additional parsed-ruler corrections from Tome 2.
- Updated `DEGREE_RULERS_TABLE_7_TRANSCRIPTION_DRAFT.md` and `DEGREE_RULERS_TABLE_7_VERIFICATION_REPORT.md`; remaining unclear rows: 0, mismatch rows: 0.
- Kept every draft row `needsReview`; no active Table 7 dataset was created.
- Confirmed node-like glyphs resolve as Chiron / Хирон where Tome 2 says `Хирон`, Gemini-like glyphs resolve as Proserpina / Прозерпина where Tome 2 says `Прозерпина`, and retrograde markers are assigned from Tome 2 wording.
- No app code, `src/`, tests, lookup engine, OCR import, UI, package files or PWA cache changes were added.
- Task 10.8e — Table 7 Vronsky Degree Rulers Dataset is next, but was not started.

## 2026-05-24 — Complete Task 10.8d Table 7 verification report

- Created `DEGREE_RULERS_TABLE_7_VERIFICATION_REPORT.md`.
- Verified `DEGREE_RULERS_TABLE_7_TRANSCRIPTION_DRAFT.md` against `table7.jpg` at row level.
- Checked 360 rows across 12 zodiac signs and 30 degree rows per sign.
- Recorded 262 match, original unclear 98, resolved unclear 0, remaining unclear 98 and 0 mismatch.
- Kept all Table 7 rows inactive and blocked active dataset creation until unclear source tokens are resolved.
- Confirmed Table 7 / Vronsky degree rulers remain separate from Table 6 / Star of the Magi degree rulers.
- No active dataset, lookup engine, OCR import, UI, tests, `src/`, package files or PWA cache changes were added.
- Task 10.8d-fix — Resolve unclear/mismatched Table 7 rows is next, but was not started.

## 2026-05-24 — Complete Task 10.8c Table 7 transcription draft

- Created `DEGREE_RULERS_TABLE_7_TRANSCRIPTION_DRAFT.md`.
- Added a non-active draft transcription of Table 7, `Управление градусами (по С. Вронскому)`.
- Captured 360 draft rows across 12 zodiac signs and 30 degree rows per sign.
- Marked every row `needsReview`; no row was marked `verified`.
- Preserved visible source tokens and parsed candidate rulers only when symbols were clear enough.
- Marked 98 rows `unclear` where node-like or Gemini-like glyphs require manual verification.
- Kept the draft limited to Table 7 / Vronsky degree rulers and did not use Table 6.
- No active dataset, lookup engine, OCR import, UI, tests, `src/`, package files or PWA cache changes were added.
- Task 10.8d — Table 7 Vronsky Degree Rulers Manual Verification is next, but was not started.

## 2026-05-24 — Complete Task 10.8b Table 7 complexity audit

- Created `DEGREE_RULERS_TABLE_7_COMPLEXITY_AUDIT.md`.
- Confirmed Table 7 — `Управление градусами (по С. Вронскому)` belongs to Sprint 10 as a separate Vronsky degree-ruler source system.
- Confirmed Table 7 must not be mixed with the implemented Table 6 / Star of the Magi dataset and lookup.
- Documented that Table 7 is more complex than Table 6 because cells may contain multiple rulers, retrograde markers, outer planets and source tokens.
- Proposed a future Table 7 data shape with `rulers[]`, `retrograde` and `sourceToken`, without creating code.
- Replanned remaining Sprint 10 tasks so Table 7 transcription, verification, dataset and lookup happen before UI/debug/hardening.
- Kept Houses / ASC / MC in Sprint 11.
- No app code, `src/`, tests, active dataset, lookup engine, UI, package files or PWA cache changes were added.
- Task 10.8c — Table 7 Vronsky Degree Rulers Transcription Draft is next, but was not started.

## 2026-05-24 — Complete Task 10.9 detailed dignity display helper

- Added `src/detailedDignityDisplay.js`.
- Implemented pure formatting for already-computed term, decan and degree-ruler lookup results.
- Added compact user-facing display strings for terms, decans and degree rulers without interpretations.
- Added safe list formatting, dispatcher, summary counts and display limitations.
- Added `test/detailedDignityDisplay.test.js`.
- Kept the helper independent from lookup engines, datasets, providers, profile storage, DOM, UI and app shell.
- Table 7 / Vronsky degree rulers, Trigon/Vronsky decans, fixed stars, houses, ASC / MC, transits, interpretations, package files and PWA cache were not changed.
- Task 10.10 — Terms / Decans / Degree Rulers Collapsible UI is next, but was not started.

## 2026-05-24 — Complete Task 10.8 degree rulers Table 6 lookup engine

- Added `src/degreeRulersStarOfMagi.js`.
- Implemented pure lookup over the verified Table 6 / Star of the Magi degree rulers dataset.
- Added boundary policy in code: `degreeIndex = floor(degreeWithinSign)` for valid `0 <= degreeWithinSign < 30`; `30°` stays invalid inside one sign.
- Added already-calculated natal planet input support with `sign.key + degree/minutes`, sign + degree only and safe longitude fallback through `src/astroMath.js`.
- Added safe array evaluation, summary counts by ruler and engine capability flags.
- Added manual fixture and validation coverage in `test/fixtures/degreeRulersStarOfMagiFixtures.js`, `test/degreeRulersStarOfMagiFixtures.test.js`, `test/degreeRulersStarOfMagi.test.js` and `test/degreeRulersStarOfMagiValidation.test.js`.
- Kept source separation: Table 7 / Vronsky degree rulers, retrograde markers, multiple rulers, UI, display helper, provider calculations, package files, app shell and PWA cache were not changed.
- Task 10.9 — Terms / Decans / Degree Rulers Display Helper is next, but was not started.

## 2026-05-24 — Complete Task 10.7d degree rulers Table 6 dataset

- Added `src/degreeRulersStarOfMagiData.js`.
- Created active source-tracked Table 6 / Star of the Magi degree rulers dataset from 360 verified rows.
- Stored Table 6 source metadata, verification report reference, transcription draft reference, source system and active row count.
- Added integer degree policy for dataset rows: valid degree indexes `0` through `29`; future lookup remains `degreeIndex = floor(degreeWithinSign)` for `0 <= degreeWithinSign < 30`.
- Kept the dataset limited to septener planets only and excluded Uranus / Neptune / Pluto, retrograde markers, multiple rulers and Table 7 / Vronsky degree ruler rows.
- Added `test/degreeRulersStarOfMagiData.test.js`.
- No lookup engine, UI, display helper, Table 7 rows, provider calculations, package files, app shell or PWA cache changes were added.
- Task 10.8 — Degree Rulers Lookup Engine / Fixtures is next, but was not started.

## 2026-05-24 — Complete Task 10.7c degree rulers Table 6 manual verification

- Created `DEGREE_RULERS_TABLE_6_VERIFICATION_REPORT.md`.
- Verified `DEGREE_RULERS_TABLE_6_TRANSCRIPTION_DRAFT.md` against `table6.jpg`.
- Checked 360 rows across 12 zodiac signs and 30 degree rows per sign: 360 match, 0 unclear, 0 mismatch.
- Confirmed the verified draft rows stay limited to Table 6 / Star of the Magi and septener planets only.
- Confirmed Table 7 / Vronsky degree rulers were not used.
- No active degree rulers dataset, lookup engine, OCR import, UI, tests, `src/`, package files, app shell or PWA cache changes were added.
- Task 10.7d — Degree Rulers Table 6 Dataset from Verified Rows is next, but was not started.

## 2026-05-24 — Complete Task 10.7b degree rulers Table 6 transcription draft

- Created `DEGREE_RULERS_TABLE_6_TRANSCRIPTION_DRAFT.md`.
- Added non-active draft transcription of Table 6, `Управление градусами по Звезде Магов`.
- Captured 360 draft rows across 12 zodiac signs and 30 degree rows per sign.
- Marked every row `needsReview`; no row was marked `verified`.
- Kept the draft limited to Table 6 / Star of the Magi and septener planets only.
- Did not use Table 7 or add Vronsky degree ruler rows.
- No active degree rulers dataset, lookup engine, OCR import, UI, tests, `src/`, package files, app shell or PWA cache changes were added.
- Task 10.7c — Degree Rulers Table 6 Manual Verification is next, but was not started.

## 2026-05-24 — Complete Task 10.7a degree rulers source decision

- Created `DEGREE_RULERS_SOURCE_DECISION.md`.
- Reviewed PDF source locations for degree rulers: PDF page 75 Star of the Magi context, PDF page 76 two degree-ruler systems, PDF page 99 Table 6, and PDF page 100 Table 7.
- Confirmed uploaded source images `table6.jpg` and `table7.jpg` are available.
- Confirmed Table 6 — Star of the Magi degree rulers and Table 7 — Vronsky degree rulers are separate source systems and must not be mixed.
- Selected Table 6 as the first candidate only after draft transcription and manual verification.
- Deferred Table 7 to a separate later workflow.
- No active degree rulers dataset, lookup engine, OCR import, UI, tests, `src/`, package files, app shell or PWA cache changes were added.
- Task 10.7b — Degree Rulers Table 6 Star of the Magi Transcription Draft is next, but was not started.

## 2026-05-24 — Complete Task 10.6 decans lookup engine / fixtures

- Added pure `src/decans.js`.
- Implemented Star of the Magi / Egyptian tradition decan lookup by `signKey + degreeWithinSign` over the verified `src/decansData.js` rows.
- Added natal planet input lookup with `sign + degree/minutes` preference and longitude fallback through `src/astroMath.js` only when needed.
- Kept decan lookup intervals half-open: `[0, 10)`, `[10, 20)`, `[20, 30)`, with `30°` invalid inside one sign.
- Added manual fixtures in `test/fixtures/decansFixtures.js` and validation tests in `test/decansFixtures.test.js`, `test/decans.test.js` and `test/decansValidation.test.js`.
- No decans dataset changes, UI, display helper, Trigon/Vronsky decans, degree rulers, provider calculations, package files, app shell or PWA cache changes were added.
- Task 10.7 — Degree Rulers Source Decision / Dataset is next, but was not started.

## 2026-05-24 — Complete Task 10.5d decans Star of the Magi dataset

- Added `src/decansData.js`.
- Created active source-tracked Decans Star of the Magi / Egyptian tradition dataset from 36 manually verified rows.
- Stored Fig. 4.7 source metadata, verification report reference, transcription draft reference, source system and active row count.
- Added half-open interval policy: decan 1 `[0, 10)`, decan 2 `[10, 20)`, decan 3 `[20, 30)`.
- Kept the dataset septener-only and excluded Uranus / Neptune / Pluto, Trigon/Vronsky decans, degree rulers, fixed stars, houses, ASC / MC, transits, interpretations and ritual scoring.
- Added `test/decansData.test.js`.
- No decans lookup engine, UI, display helper, provider calculations, package files, app shell or PWA cache changes were added.
- Task 10.6 — Decans Lookup Engine / Fixtures is next, but was not started.

## 2026-05-24 — Complete Task 10.5c decans Star of the Magi manual verification

- Created `DECANS_STAR_OF_MAGI_VERIFICATION_REPORT.md`.
- Verified `DECANS_STAR_OF_MAGI_TRANSCRIPTION_DRAFT.md` against `fig_4_7_decans_star_of_magi.png` and the control table.
- Checked 36 rows across 12 zodiac signs: 36 match, 0 unclear, 0 mismatch.
- Confirmed the verified draft rows stay limited to Star of the Magi / Egyptian tradition and septener planets only.
- Confirmed no Trigon/Vronsky rows, Uranus / Neptune / Pluto, active decans dataset, `src/decansData.js`, lookup engine, tests, OCR import, UI, app code, package files or PWA cache changes were created.
- Task 10.5d — Decans Star of the Magi Dataset from Verified Rows is next, but was not started.

## 2026-05-24 — Complete Task 10.5b decans Star of the Magi transcription draft

- Created `DECANS_STAR_OF_MAGI_TRANSCRIPTION_DRAFT.md`.
- Added non-active draft transcription of Figure 4.7, `Схема управления деканатами по звезде Магов (египетская традиция)`.
- Captured 36 draft rows across 12 zodiac signs with `[0, 10)`, `[10, 20)` and `[20, 30)` boundaries.
- Marked every row `needsReview`; no row was marked `verified`.
- Kept the draft limited to the Star of the Magi / Egyptian tradition and septener planets only.
- No active decans dataset, `src/decansData.js`, lookup engine, tests, OCR import, UI, app code, package files or PWA cache changes were created.
- Task 10.5c — Decans Star of the Magi Manual Verification is next, but was not started.

## 2026-05-24 — Complete Task 10.5 decans source decision

- Created `DECANS_SOURCE_DECISION.md`.
- Reviewed uploaded PDF `4148867_vvedenie_v_astrologiyu.pdf` around Star of the Magi, decan rulership, trigon rulership, Figure 4.7 and Figure 4.8.
- Confirmed Vronsky presents two decan systems: Star of the Magi / Egyptian tradition and Trigon / Triplicity.
- Selected Star of the Magi / Egyptian tradition as the first candidate for later decan transcription and manual verification.
- Deferred Trigon / Vronsky decans because they can include multiple active rulers and retrograde outer planets.
- Confirmed no active decans dataset can be created yet because no 36-row transcription and verification report exists.
- No code, `src/`, tests, active dataset, lookup engine, OCR import, UI, package files, app shell or PWA cache changes were added.
- Task 10.5b — Decans Star of the Magi Transcription Draft is next, but was not started.

## 2026-05-23 — Complete Task 10.4 Terms lookup engine / fixtures

- Added pure `src/terms.js`.
- Implemented Vronsky Table 5 terms lookup by `signKey + degreeWithinSign` over the verified `src/termsData.js` rows.
- Added natal planet input lookup with `sign + degree/minutes` preference and longitude fallback through `src/astroMath.js` only when needed.
- Kept lookup intervals half-open as `[startDegree, normalizedEndExclusive)` and preserved source `printedEndDegree` in output.
- Covered final printed `29°` rows for Aries / Овен, Taurus / Телец, Libra / Весы and Scorpio / Скорпион by using `normalizedEndExclusive: 30` for lookup.
- Added manual fixtures in `test/fixtures/termsFixtures.js` and validation tests in `test/termsFixtures.test.js`, `test/terms.test.js` and `test/termsValidation.test.js`.
- No terms UI, display helper, decans, degree rulers, other Vronsky tables, provider calculations, package files, app shell or PWA cache changes were added.
- Task 10.5 — Decans Source Decision / Dataset is next, but was not started.

## 2026-05-23 — Complete Task 10.3c Terms dataset from verified Table 5 rows

- Added `src/termsData.js`.
- Created active source-tracked Vronsky Table 5 — Terms dataset with 60 verified rows across 12 zodiac signs.
- Preserved printed source ranges through `printedEndDegree` and stored future half-open lookup boundaries through `normalizedEndExclusive`.
- Kept final printed `29°` rows for Aries / Овен, Taurus / Телец, Libra / Весы and Scorpio / Скорпион as `printedEndDegree: 29`, with `normalizedEndExclusive: 30` for full `0 <= degree < 30` coverage.
- Added `test/termsData.test.js` for metadata, row counts, verified-only rows, interval coverage, final `29°` normalization, allowed rulers, deferred features, read-only boundaries and strict exclusions.
- No terms lookup engine, UI, display helper, decans, degree rulers, other Vronsky tables, provider calculations, package files, app shell or PWA cache changes were added.
- Task 10.4 — Terms Lookup Engine / Fixtures is next, but was not started.

## 2026-05-23 — Complete Task 10.3b Table 5 manual verification

- Created `TERMS_TABLE_5_VERIFICATION_REPORT.md`.
- Completed image-to-draft review of `TERMS_TABLE_5_TRANSCRIPTION_DRAFT.md` against source image `table5.png`.
- Checked 60 rows: 60 match, 0 unclear, 0 mismatch.
- Confirmed final printed end `29°` signs: Aries / Овен, Taurus / Телец, Libra / Весы and Scorpio / Скорпион.
- Documented the final interval normalization question: printed source values stay as printed, while future active dataset likely needs `normalizedEndExclusive = 30` for final sign intervals.
- Recommended Task 10.3c — Terms Dataset from Verified Table 5 Rows as the next task, with explicit approval of printed/normalized range storage before active dataset creation.
- No active JS dataset, `src/termsData.js`, lookup engine, tests, OCR import, UI, app code, package files or PWA cache changes were created.

## 2026-05-23 — Complete Task 10.3a Table 5 transcription draft

- Created `TERMS_TABLE_5_TRANSCRIPTION_DRAFT.md`.
- Added non-active draft transcription for Vronsky Table 5 — Terms from user-provided draft and source image `table5.png`.
- Captured 60 draft rows across 12 zodiac signs.
- Marked every row as `needsReview`; no row was marked `verified`.
- Added needs-review questions for final intervals ending at `29°`, full `0–30` coverage, gaps/overlaps, values and ruler checks.
- No active JS dataset, `src/termsData.js`, lookup engine, tests, OCR import, UI, app code, package files or PWA cache changes were created.
- Task 10.3b — Terms Table Manual Verification is next, but was not started.

## 2026-05-23 — Complete Task 10.2 Vronsky dataset entry policy

- Created `VRONSKY_DATASET_ENTRY_POLICY.md`.
- Defined no blind OCR policy: OCR output is not trusted data, and OCR-only rows must not be committed as active dataset rows.
- Documented source inventory for Table 5 Terms, Table 6 Star of the Magi degree rulers, Table 7 Vronsky degree rulers, Table 4 planetary influence, Table 10 aspects, Table 18 fixed stars and formula tables involving ASC and planets.
- Confirmed Table 5 Terms is the first active target only after source/manual verification.
- Confirmed Table 6 and Table 7 are separate source systems and remain deferred.
- Added dataset metadata, row metadata, verification statuses, boundary testing requirements, OCR usage policy, review checklist and future file/module naming rules.
- No app code, `src/`, `scripts/`, `index.html`, `sw.js`, package files, datasets, lookup engines, OCR imports, terms / decans / degree ruler data, houses, ASC / MC, transits or interpretations were changed.
- Task 10.3 — Terms Dataset is next, but was not started.

## 2026-05-23 — Complete Task 10.1 terms / decans / degree rulers strategy

- Created `TERMS_DECANS_DEGREE_RULERS_STRATEGY.md`.
- Selected terms as the first Sprint 10 implementation target, with Vronsky Table 5 as the source only after manual verification.
- Decided that decans require a separate source decision and must not mix Chaldean / Star of the Magi, triplicity / trigon or Vronsky-specific systems.
- Decided that degree rulers are deferred until Table 6 / Table 7 source screenshots or verified rows are available, and that those tables must remain separate source systems.
- Confirmed no Vronsky screenshot/table files are currently present in the repository; actual dataset entry requires uploaded source material or manual transcription later.
- Reinforced the no blind OCR rule: OCR may assist transcription only before manual verification.
- No app code, `src/`, `scripts/`, `index.html`, `sw.js`, package files, datasets, lookup engines, OCR imports, terms / decans / degree ruler data, houses, ASC / MC, transits or interpretations were changed.
- Task 10.2 — Vronsky Dataset Entry Policy is next, but was not started.

## 2026-05-23 — Prepare Sprint 10 documentation

- Sprint 1–9 are completed; active sprint is now Sprint 10 — Terms / Decans / Degree Rulers.
- `TODO.md` lists Task 10.1 — Terms / Decans / Degree Rulers Strategy and Source Audit as the active task and Task 10.2–10.12 as the Sprint 10 backlog.
- Added Sprint 10 astrology rules for terms, decans and degree rulers as source-tracked lookup layers applied after validated planet coordinates.
- Added Sprint 10 source/boundary rules: no blind OCR import, explicit source systems, row-level verification and half-open degree intervals.
- Added Sprint 10 UI rules for collapsible detailed dignity sections inside `Мои карты`.
- Added Sprint 10 privacy rules for detailed dignity UI/debug output.
- No app code, `src/`, `scripts/`, `index.html`, `sw.js`, package files, terms / decans / degree ruler datasets, OCR table data, houses, ASC / MC, transits or interpretations were changed.

## 2026-05-23 — Complete Sprint 9 hardening

- Completed Task 9.8 and closed Sprint 9 — Essential Dignities Foundation.
- Audited Task 9.1–9.7 results: source strategy, source-tracked dataset, pure lookup engine, synthetic/manual fixture validation, display helper, collapsible `Мои карты` UI and safe debug.
- Confirmed essential dignities remain basic sign-based domicile / detriment / exaltation / fall lookup over ready natal planet signs.
- Confirmed classical / traditional seven planets remain the scoring baseline, while Uranus / Neptune / Pluto remain modern rulership label-only with score `0`.
- Confirmed terms / decans / degree rulers, Vronsky rows, exact exaltation degrees, fixed stars, houses, ASC / MC, transits, interpretations and ritual scoring remain deferred / notSupported.
- Confirmed UI and debug do not expose raw birth data, UTC datetime, raw timezone, coordinates, raw planet longitude/speed, full natal planet lists or full dignity result lists.
- Synced documentation for Sprint 9 completion and corrected the documented PWA cache version to `lunar-calendar-v72`.
- Sprint 10 — Terms / Decans / Degree Rulers is the next stage, but was not started.

## 2026-05-23 — Complete Task 9.7 essential dignities debug

- Added `src/essentialDignitiesDebug.js`.
- Added safe `Essential Dignities UI Debug` output to `?debug=1`.
- Debug shows only active-profile status, panel status, enabled / disabled state, natalPlanetsReady, source policy, score/count summaries, collapsed default, profile-panel location and deferred/notSupported feature flags.
- Deferred flags show terms, decans, degree rulers, exact exaltation degrees and Vronsky tables as `deferred`.
- Not-supported flags show houses, ASC / MC, transits and interpretations as `notSupported`.
- Added `test/essentialDignitiesDebug.test.js` and extended debug panel tests.
- Updated PWA cache and debug cache version to `lunar-calendar-v72`.
- User-facing UI, dataset, lookup engine, display helper, provider calculations, package files, terms / decans / degree rulers, Vronsky rows, houses, ASC / MC, transits, interpretations and ritual scoring were not changed.

## 2026-05-23 — Complete Task 9.6 essential dignities collapsible UI

- Added `src/essentialDignitiesForProfile.js` to connect ready natal planet output to the essential dignity lookup and display helpers.
- Added collapsible `Достоинства планет` section inside `Мои карты`, after `Натальные аспекты`.
- Section is hidden for `Общий день`, falls back to `Сначала нужен расчет натальных планет.` when natal planets are incomplete, and stays collapsed by default for ready profiles.
- Ready profiles show compact dignity summary and reveal only formatted dignity rows after explicit click.
- Empty dignity state uses `Ярко выраженных базовых достоинств или слабостей не найдено.`
- Added helper, profile UI and markup tests for readiness, collapsed state, shell placement and privacy exclusions.
- Updated PWA cache to `lunar-calendar-v71`.
- Lookup engine, dataset, provider calculations, package files, terms / decans / degree rulers, Vronsky rows, houses, ASC / MC, transits, interpretations and ritual scoring were not changed.

## 2026-05-23 — Complete Task 9.5 essential dignity display helper

- Added pure `src/essentialDignityDisplay.js`.
- Added `test/essentialDignityDisplay.test.js`.
- Helper formats already evaluated essential dignity results into compact user-facing copy such as `Марс в Овне — обитель`.
- Supports domicile, exaltation, detriment, fall, multiple flags, modern rulership label-only, neutral states, score text, display type and collapsed-section summary counts.
- Added display limitations for deferred terms, decans, degree rulers and Vronsky tables.
- Helper does not import or call the lookup engine, providers, profile storage, localStorage, DOM or UI code.
- UI, lookup engine, provider calculations, package files, `index.html`, `src/app.js`, `sw.js`, terms / decans / degree rulers, Vronsky rows, houses, ASC / MC, transits, interpretations and ritual scoring were not changed.

## 2026-05-23 — Complete Task 9.4 essential dignity fixture validation

- Added `test/fixtures/essentialDignityFixtures.js`.
- Added `test/essentialDignityFixtures.test.js`.
- Added `test/essentialDignityValidation.test.js`.
- Created `ESSENTIAL_DIGNITY_FIXTURE_STRATEGY.md`.
- Fixture categories cover domicile, detriment, exaltation, fall, multiple flags, modern rulership, neutral placements, invalid planets, mixed summary counts and strict exclusions.
- Fixtures are synthetic/manual, use provider-style planet objects only and do not contain private birth data, user profiles or real birth charts.
- Expected values are declared in fixture data and are not generated from `evaluateEssentialDignity()` / `evaluateEssentialDignities()`.
- Validation confirmed the essential dignity lookup engine against manual fixtures; no engine bug was found.
- UI, display helper, provider calculations, package files, `index.html`, `src/app.js`, `sw.js`, terms / decans / degree rulers, Vronsky rows, houses, ASC / MC, transits, interpretations and ritual scoring were not changed.

## 2026-05-23 — Complete Task 9.3 essential dignity lookup engine

- Added pure `src/essentialDignities.js`.
- Added `test/essentialDignities.test.js`.
- Engine evaluates already-calculated natal planet objects against `src/essentialDignitiesData.js` and returns dignity flags, score, labels, modern labels and source metadata.
- Sign resolution prefers `planet.sign.key` and falls back to valid longitude through `src/astroMath.js`.
- Multiple classical flags use additive scoring, so Mercury in Virgo is domicile + exaltation = `+9`, and Mercury in Pisces is detriment + fall = `-9`.
- Uranus, Neptune and Pluto remain modern-rulership label-only with score `0`.
- UI, display helper, provider calculations, package files, `index.html`, `src/app.js`, `sw.js`, terms / decans / degree rulers, Vronsky rows, houses, ASC / MC, transits, interpretations and ritual scoring were not changed.

## 2026-05-23 — Complete Task 9.2 essential dignity dataset

- Added `src/essentialDignitiesData.js`.
- Added `test/essentialDignitiesData.test.js`.
- Dataset contains source metadata, classical rulership / detriment / exaltation / fall tables for the seven traditional planets, modern outer-planet rulership labels, score model and deferred feature list.
- Uranus, Neptune and Pluto remain label-only modern rulership entries with `modernRulership: 0` and are not mixed into classical scoring tables.
- Terms, decans, degree rulers, Vronsky strength rows, exact exaltation degree values, fixed stars, houses, ASC / MC, transits, interpretations and ritual scoring remain deferred.
- Lookup engine, UI, provider calculations, package files, `index.html`, `src/app.js`, `sw.js`, ephemeris data and generator were not changed.

## 2026-05-23 — Complete Task 9.1 essential dignities strategy

- Created `ESSENTIAL_DIGNITIES_STRATEGY.md`.
- Selected classical / traditional domicile, detriment, exaltation and fall as the Sprint 9 scoring baseline for the seven traditional planets.
- Decided that Uranus, Neptune and Pluto may receive separate modern rulership labels only, without changing the classical score.
- Deferred Vronsky-specific tables, terms / decans / degree rulers and exact exaltation degree scoring until manual source verification and later dataset work.
- Proposed explicit helper scoring: domicile +5, exaltation +4, detriment / exile -5, fall -4, neutral 0.
- No app code, `src/`, `index.html`, `sw.js`, package files, dataset, dignity engine, UI, houses, ASC / MC, transits, interpretations or ritual scoring were changed.

## 2026-05-23 — Prepare Sprint 9 documentation

- Sprint 1–8 are completed; active sprint is now Sprint 9 — Essential Dignities Foundation.
- `TODO.md` lists Task 9.1 — Essential Dignities Strategy / Source Decision as the active task and Task 9.2–9.8 as the Sprint 9 backlog.
- Added Sprint 9 astrology rules for essential dignity as a lookup layer over already-calculated natal planet signs.
- Added Sprint 9 UI rules for a collapsible `Достоинства планет` section inside `Мои карты`.
- Added Sprint 9 privacy rules for essential dignity UI and debug output.
- No app code, `src/`, `scripts/`, `index.html`, `sw.js`, package files, dignity engine, terms / decans / degree rulers, provider calculations, houses, ASC / MC or transits were changed.

## 2026-05-23 — Complete Sprint 8 hardening

- Completed Task 8.7 and closed Sprint 8 — Natal Aspects Foundation.
- Audited Task 8.1–8.6 results: strategy / orb rules, pure aspect engine, synthetic fixture validation, display helper, collapsible `Мои карты` UI and safe debug.
- Confirmed natal aspects are calculated only between validated natal planets for an active saved profile after safe natal planet readiness.
- Confirmed the active Sprint 8 aspect set remains major-only: conjunction, sextile, square, trine and opposition.
- Confirmed `Общий день`, not-ready natal planets, failed UTC conversion, unknown birth time, missing / invalid timezone and DST ambiguous / nonexistent fail-closed states do not show natal aspects.
- Confirmed fixtures are synthetic/manual, contain no private user data and do not generate expected values from the engine under test.
- Confirmed UI and debug do not expose raw birth data, UTC datetime, raw timezone, coordinates, raw planet longitudes/speeds, raw aspect angles, `allowedOrb`, full profile JSON or full active-profile aspect dumps.
- Confirmed transits, houses, ASC / MC, fixed stars, Lilith / Selena / Nodes, Arabic Parts, midpoints / antiscia, interpretations and ritual scoring remain not supported.
- Runtime imports still use tracked vendor assets, PWA cache remains `lunar-calendar-v70`, and package files / dependencies / provider calculations / ephemeris data were not changed.
- Sprint 9 — Essential Dignities is the next stage, but was not started.

## 2026-05-23 — Complete Task 8.6 natal aspects debug

- Added `src/natalAspectsDebug.js`.
- Added `test/natalAspectsDebug.test.js`.
- Extended `src/debugPanel.js` with a safe `Natal Aspects UI Debug` section.
- Debug shows only profile status, enabled / disabled state, natal planets readiness, aspect engine status, major-only aspect set, configured orb policy, aspect counts, collapsible default, `My Cards` location and unsupported feature flags.
- Missing fields and warnings are human-readable only.
- Debug does not expose raw birth data, UTC datetime, raw timezone, coordinates, raw planet longitudes/speeds, raw aspect angles, `allowedOrb`, full planet/aspect lists, houses, ASC / MC, transits or interpretations.
- PWA cache updated to `lunar-calendar-v70`.
- User-facing natal aspects UI, aspect engine, provider calculations, package files, ephemeris data, houses, ASC / MC, transits and interpretations were not changed.
- Task 8.7 — Sprint 8 Hardening is next, but was not started.

## 2026-05-23 — Complete Task 8.5 natal aspects collapsible UI

- Added `src/natalAspectsForProfile.js`.
- Added `test/natalAspectsForProfile.test.js`.
- Added a collapsible `Натальные аспекты` section inside `Мои карты`, directly under the existing `Натальные планеты` section.
- Aspect UI uses the existing safe data flow: natal planets readiness/provider output → `calculateNatalAspects()` → `formatNatalAspectList()` / `summarizeNatalAspects()`.
- Ready profiles show only the summary while collapsed and formatted aspect rows after explicit expansion.
- Not-ready profiles show fallback copy: `Пока недоступны.` / `Сначала нужен расчет натальных планет.`
- The section resets collapsed state on profile changes / `Общий день` and does not hide `+ Добавить профиль` or open edit mode automatically.
- UI does not show raw birth data, UTC datetime, raw timezone, coordinates, raw planet longitudes, raw aspect angle, `allowedOrb`, technical source, houses, ASC / MC, transits or interpretations.
- PWA cache updated to `lunar-calendar-v69`.
- Aspect engine, provider calculations, package files, ephemeris data, houses, ASC / MC, transits and interpretations were not changed.
- Task 8.6 — Natal Aspects Debug is next, but was not started.

## 2026-05-23 — Complete Task 8.4 natal aspect display helper

- Added pure `src/natalAspectDisplay.js`.
- Added `test/natalAspectDisplay.test.js`.
- Helper formats already calculated natal aspect objects into compact user-facing copy such as `Солнце □ Луна · орб 2°15′`.
- Added formatting for single aspects, aspect lists, summary counts, display limitations and displayability checks.
- Summary counts `square` / `opposition` as tense, `trine` / `sextile` as harmonious, and `conjunction` separately.
- Invalid / incomplete aspects are filtered safely without `NaN`, `undefined`, raw technical fields or private profile data.
- Helper does not import or call the aspect engine, providers, profiles, localStorage, DOM or UI code.
- UI, `src/app.js`, `index.html`, `sw.js`, package files, provider calculations, houses, ASC / MC, transits and interpretations were not changed.
- Task 8.5 — Natal Aspects Collapsible UI is next, but was not started.

## 2026-05-23 — Complete Task 8.3 natal aspect fixture validation

- Added `test/fixtures/natalAspectFixtures.js` with synthetic/manual natal aspect fixtures.
- Added `test/natalAspectFixtures.test.js` and `test/natalAspectValidation.test.js`.
- Added `NATAL_ASPECT_FIXTURE_STRATEGY.md`.
- Fixtures cover exact major aspects, near-inside orb, just-outside orb, wrap-around, duplicate prevention, outer-outer narrow orb, luminary wide orb, invalid planets, no-aspect cases and sorting priority.
- Expected aspects are manually declared and are not generated by the engine under test.
- No private birth data, real user profiles, real birth charts, transits, houses, ASC / MC, fixed stars or interpretations are used.
- `src/natalAspectEngine.js` did not require changes.
- UI, `src/app.js`, `index.html`, `sw.js`, provider calculations, package files and dependencies were not changed.
- Task 8.4 — Natal Aspect Display Helper is next, but was not started.

## 2026-05-22 — Complete Task 8.2 natal aspect engine

- Added pure `src/natalAspectEngine.js`.
- Added `test/natalAspectEngine.test.js`.
- Engine calculates Sprint 8 major natal aspects between passed-in natal planet objects only.
- Implemented explicit orb policy from `NATAL_ASPECTS_STRATEGY.md`: `finalAllowedOrb = min(aspectBaseOrb, bodyPairOrb)`.
- Implemented body-pair caps, strength bands, canonical pair ordering, duplicate prevention, same-body filtering, invalid-planet filtering, wrap-around handling and aspect sorting.
- Applying / separating remain `null`.
- The engine does not import providers, `astronomy-engine`, Luxon, profile storage, localStorage, DOM or UI modules.
- UI, `src/app.js`, `index.html`, `sw.js`, package files, provider calculations, houses, ASC / MC, transits, fixed stars and interpretations were not changed.
- Task 8.3 — Natal Aspect Validation / Fixtures is next, but was not started.

## 2026-05-22 — Complete Task 8.1 natal aspects strategy

- Added `NATAL_ASPECTS_STRATEGY.md`.
- Selected Sprint 8 active aspect set: conjunction, sextile, square, trine and opposition.
- Defined explicit orb policy: `finalAllowedOrb = min(aspectBaseOrb, bodyPairOrb)`.
- Documented aspect base caps, body-pair caps, exactness / strength bands, sorting, duplicate pair rules, display rules, privacy boundaries and validation requirements.
- Decided applying / separating remains `null` until separately validated.
- Updated `TODO.md` and `PROJECT_STATE.md`; Task 8.2 — Natal Aspect Engine is next but was not started.
- No app code, `src/`, `index.html`, `sw.js`, package files, natal aspect engine, UI, transits, houses, ASC / MC or dependencies were changed.

## 2026-05-22 — Prepare Sprint 8 documentation

- Sprint 1–7 remain completed; active sprint is now Sprint 8 — Natal Aspects Foundation.
- `TODO.md` lists Task 8.1 — Natal Aspects Strategy / Orb Rules as the active task and Task 8.2–8.7 as the Sprint 8 backlog.
- Added Sprint 8 astrology rules for natal aspects, major aspect scope, explicit orb policy, validation requirements and unsupported features.
- Added Sprint 8 UI rules for a collapsible `Натальные аспекты` section inside `Мои карты`.
- Added Sprint 8 privacy rules for natal aspects UI and debug output.
- No app code, `src/`, `scripts/`, `index.html`, `sw.js`, provider code, natal aspect engine, transits, houses, ASC / MC or dependencies were changed.

## 2026-05-22 — Complete Sprint 7 hardening

- Completed Task 7.6 and closed Sprint 7 — Natal Planets UI / Read-only Natal Positions.
- Audited Task 7.1–7.5 results: readiness strategy, formatter, readiness UI, read-only `Мои карты` planet panel, collapsible behavior, and safe debug.
- Confirmed natal planet values are shown only for an active saved profile with safe UTC readiness and ready provider output, formatted through `src/natalPlanetDisplay.js`.
- Confirmed `Общий день`, unknown birth time, missing/invalid date/time/timezone, ambiguous DST overlap and nonexistent DST gap keep the planet list hidden.
- Confirmed missing coordinates do not block geocentric natal planet display.
- Confirmed houses, ASC / MC, transits, natal aspects, orbs, chart wheel and personal ritual scoring remain not supported.
- Confirmed Luxon and Astronomy Engine runtime imports use tracked `src/vendor/` assets and PWA cache remains `lunar-calendar-v67`.
- Synced `NATAL_PLANETS_UI_STRATEGY.md` and `NATAL_PROVIDER_VALIDATION_REPORT.md` with the implemented Sprint 7 read-only planet panel.
- Sprint 8 — Natal Aspects Foundation is the next stage, but was not started.

## 2026-05-22 — Complete Task 7.5 natal planets debug

- Added safe `Natal Planets UI Debug` output for `?debug=1`.
- Added `src/natalPlanetsDebug.js` to summarize read-only natal planets UI state with active profile status, panel status, user-facing enabled / disabled state, UTC readiness, provider validation, planet counts, collapsible default and unsupported feature flags.
- Debug output does not expose birth date, birth time, UTC datetime, raw timezone, coordinates, full profile JSON, raw planet longitudes, speed values, or the full active-profile planet list.
- Houses, ASC / MC, transits, aspects and orbs remain `notSupported`.
- User-facing natal planets UI behavior, provider calculations, Luxon conversion, package files and natal chart features were not changed.
- PWA cache updated to `lunar-calendar-v67`.
- Task 7.6 is next, but was not started.

## 2026-05-22 — Make natal planets block collapsible

- Made the `Натальные планеты` list inside `Мои карты` collapsed by default when planet positions are ready.
- Collapsed state shows a compact summary and `Показать`; expanded state shows the full planet list and `Скрыть`.
- Switching profiles or selecting `Общий день` resets the disclosure state.
- Readiness fallback remains visible for incomplete profiles; provider calculations, Luxon conversion, houses / ASC / MC / transits / aspects / orbs were not changed.
- PWA cache updated to `lunar-calendar-v66`.
- Task 7.5 was not started.

## 2026-05-22 — Fix My Cards profile form state

- Fixed a UI regression where reopening `Мои карты` could keep the previous create/edit form state instead of returning to list mode.
- Opening `Мои карты` now resets the profile form state and shows the `+ Добавить профиль` action.
- Selecting `Общий день` or a saved profile now closes create/edit form state before the profile shell is re-rendered.
- Read-only natal planets panel remains inside `Мои карты`; provider calculations, Luxon conversion, natal planet math and unsupported houses / ASC / MC / transits / aspects / orbs were not changed.
- PWA cache updated to `lunar-calendar-v65`.
- Task 7.5 was not started.

## 2026-05-22 — Complete Task 7.4 read-only natal planets panel

- Added read-only natal planet list inside the existing `Мои карты` natal planets block.
- Added `src/natalPlanetsForProfile.js` to require safe UTC readiness, call validated `astronomy-engine` provider output and format positions through `src/natalPlanetDisplay.js`.
- Vendored Astronomy Engine runtime as `src/vendor/astronomy-engine.mjs` with `src/vendor/astronomy-engine.LICENSE.md` so static GitHub Pages does not depend on ignored `node_modules`.
- The panel shows planets only when `canConvertToUtc: true` and provider status is `ready`; missing coordinates do not block planet display.
- Unknown birth time, missing timezone, invalid input, ambiguous DST overlap and nonexistent DST gap keep the readiness fallback.
- User-facing UI shows formatted label / sign / degree-minutes / `R` marker only; raw birth data, UTC input, timezone values, coordinates, raw longitude and speed are not shown.
- Houses, ASC / MC, transits, aspects, orbs, natal chart UI and personal ritual scoring were not added.
- PWA cache updated to `lunar-calendar-v64`.
- Task 7.5 is next, but was not started.

## 2026-05-22 — Complete Task 7.4b birth time UTC conversion

- Installed approved local-only dependency `luxon@3.7.2`.
- Vendored Luxon's browser ESM runtime as `src/vendor/luxon.mjs` with `src/vendor/luxon.LICENSE.md` so static GitHub Pages does not depend on ignored `node_modules`.
- `src/birthDateTime.js` now converts valid birth local date/time/IANA timezone to UTC ISO.
- Successful conversion returns `status: "ready"`, `canConvertToUtc: true`, and `utcDateTime`.
- Unknown birth time, missing/invalid date/time/timezone, ambiguous DST overlap and nonexistent DST gap fail closed with `utcDateTime: null`.
- Added tests for Luxon import, Moscow modern/historical conversion, New York normal/DST edge cases, invalid inputs, readiness flags and no network/geolocation usage.
- Task 7.4 is now ready to start, but was not started.
- PWA cache updated to `lunar-calendar-v64`.
- User-facing natal planet values, UI, houses, ASC / MC, transits, aspects and orbs were not added.
- `src/app.js` and `index.html` were not changed; `sw.js` changed only for PWA cache/versioning.

## 2026-05-22 — Complete Task 7.4a birth time UTC strategy

- Added `BIRTH_TIME_UTC_STRATEGY.md`.
- Audited current `src/birthDateTime.js` and profile timezone readiness: `canConvertToUtc` remains `false`, `utcDateTime` remains `null`.
- Compared native `Date`, `Intl.DateTimeFormat`, native `Temporal`, `luxon`, `date-fns-tz`, `moment-timezone`, and Temporal polyfill for local birth time to UTC conversion.
- Recommended `luxon` as the first local-only Sprint 7 conversion candidate, pending explicit dependency approval.
- Task 7.4 remains blocked until UTC conversion is implemented and tested; Task 7.4b is the next blocked step.
- No app code, provider code, UI, package files, natal planet values, houses, ASC / MC, transits, aspects or orbs were changed.

## 2026-05-22 — Complete Task 7.3 natal planets readiness UI

- Added a compact readiness-only `Натальные планеты` block inside the `Мои карты` panel.
- The block is hidden for `Общий день` and visible only when a saved profile is active.
- The block explains that natal planets are not ready to display because birth date/time/timezone readiness still cannot produce safe UTC.
- Missing profile data is shown only as human labels: `дата рождения`, `время рождения`, `часовой пояс рождения`, `координаты места рождения`.
- Raw birthDate, birthTime, coordinates, full profile JSON and actual natal planet values are not shown.
- User-facing natal values, natal chart UI, houses, ASC / MC, transits, aspects and orbs were not added.
- PWA cache updated to `lunar-calendar-v61`.

## 2026-05-22 — Complete Task 7.2 natal planet formatting helper

- Added `src/natalPlanetDisplay.js`.
- Added `test/natalPlanetDisplay.test.js`.
- Formatter prepares compact display strings for already-calculated natal planet positions, for example `Солнце — Телец 15°30′`.
- Retrograde display uses the short `R` marker, for example `Меркурий R — Телец 15°30′`.
- Invalid / incomplete planet objects are filtered safely and do not produce `NaN`, `undefined` or fake signs.
- The helper does not call providers, `astronomy-engine`, profiles, localStorage or UI code.
- User-facing natal values, UI wiring, natal chart UI, houses, ASC / MC, transits, aspects and orbs were not added.

## 2026-05-22 — Complete Task 7.1 natal planets UI readiness audit

- Added `NATAL_PLANETS_UI_STRATEGY.md`.
- Confirmed `astronomy-engine@2.1.19` provider-layer validation covers geocentric tropical longitudes, speed and retrograde for the 10 main natal planets.
- Confirmed user-facing natal planet values cannot be shown for ordinary saved profiles yet because `src/birthDateTime.js` still returns `canConvertToUtc: false` and `utcDateTime: null`.
- Recommended first Sprint 7 UI path: readiness-only natal planets copy inside `Мои карты` / profile details.
- Task 7.4 remains blocked until UTC readiness is solved.
- No app code, `src/`, `index.html`, `sw.js`, provider, package files, natal chart UI, houses, ASC / MC, transits, aspects or orbs were changed.

## 2026-05-22 — Prepare Sprint 7 documentation

- Sprint 1–6 remain completed; active sprint is now Sprint 7 — Natal Planets UI / Read-only Natal Positions.
- `TODO.md` lists Task 7.1 — Natal Planets UI Readiness Audit as the active task and Task 7.2–7.6 as the Sprint 7 backlog.
- Added Sprint 7 UI rules for read-only natal planet display and required limitation copy.
- Added Sprint 7 astrology rules: no user-facing natal values without ready input, validated provider output and safe UTC strategy.
- Added Sprint 7 privacy rules for natal planet UI and debug output.
- No app code, UI, provider integration, `src/`, `scripts/`, `index.html`, `sw.js` or natal planet display was changed.

## 2026-05-22 — Complete Sprint 6 hardening

- Завершена Task 6.8 — Sprint 6 Hardening.
- Проверены результаты Task 6.1–6.7: provider research, fixtures, adapter contract, approval review, isolated `astronomy-engine@2.1.19` integration, longitude/speed/retrograde validation and safe debug report.
- Подтверждено, что user-facing natal values, natal chart UI, houses, ASC / MC, personal transits, natal aspects, orbs and personal ritual scoring remain disabled / not supported.
- Подтверждено, что `astronomy-engine` остается provider-layer dependency, validation uses local `swisseph` only in tests, and fixtures do not use private profile data.
- `src/app.js`, `index.html`, `sw.js`, `package.json`, `package-lock.json`, `src/ephemeris-data.js` and generator were not changed.
- Sprint 6 closed; next stage is Sprint 7 planning, not started.

## 2026-05-21 — Complete Task 6.7 provider debug and validation report

- Added `NATAL_PROVIDER_VALIDATION_REPORT.md`.
- Added safe `src/natalProviderValidationSummary.js`.
- `?debug=1` now includes `Natal Provider Validation` with provider/version, validation statuses, fixture count, validated bodies, max deltas and unsupported feature labels.
- Debug output does not expose birth data, full profile JSON, active-profile natal values or actual planet longitudes.
- User-facing natal values, natal chart UI, houses, ASC / MC, transits, aspects, orbs and personal ritual scoring remain unavailable.
- PWA cache updated to `lunar-calendar-v60`.
- `src/app.js`, `index.html`, dependencies, `src/ephemeris-data.js` and generator were not changed.

## 2026-05-21 — Complete Task 6.6 retrograde and speed provider support

- `src/astronomyEngineProvider.js` now returns provider-layer longitude speed for the 10 main natal planets.
- Speed is calculated by central difference on the validated geocentric tropical longitude path with signed 0/360 wrap-around handling.
- Retrograde is derived as `speed < 0`.
- Added Swiss Ephemeris speed reference validation using `SEFLG_SWIEPH | SEFLG_SPEED` in test-only code.
- Added Mercury and Venus retrograde-sensitive UTC fixtures.
- Validated only provider-layer speed and retrograde; houses, ASC / MC, transits, aspects, orbs, user-facing natal UI and local timezone conversion remain unavailable.
- No app UI, `src/app.js`, `index.html`, `sw.js`, dependencies, `src/ephemeris-data.js` or generator changes were made.

## 2026-05-21 — Complete Task 6.5b astronomy-engine reference validation

- Added `test/fixtures/natalProviderReferenceFixtures.js` with test-only UTC fixtures and local Swiss Ephemeris reference helpers.
- Added `test/natalProviderReferenceValidation.test.js`.
- Validated `astronomy-engine@2.1.19` geocentric tropical planet longitudes against local `swisseph` for selected UTC fixtures: 2000-01-01, 1900-06-15, 2026-05-15 and 1985-11-03.
- Tolerances: `0.25°` for Sun/planets and `0.5°` for Moon.
- Validated only natal planet longitudes; houses, ASC / MC, transits, aspects, orbs, retrograde, speed, local timezone conversion and user-facing natal UI remain unavailable.
- No app UI, `src/app.js`, `index.html`, `sw.js`, dependencies, `src/ephemeris-data.js` or generator changes were made.

## 2026-05-21 — Complete Task 6.5 natal planet positions provider MVP

- `src/astronomyEngineProvider.js` now calculates candidate geocentric tropical ecliptic longitudes for Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune and Pluto.
- Used `astronomy-engine@2.1.19` paths: `SunPosition(date).elon`, `EclipticGeoMoon(date).lon`, and `GeoVector(body, date, true) -> Ecliptic(vector).elon`.
- Added smoke tests for 10 planet keys, finite normalized longitudes, sign/degree/minute normalization, source marker and disabled houses / ASC / MC / transits.
- Reference fixture accuracy validation remains pending; synthetic fixtures still do not contain approved expected longitudes.
- `natalEngine` production path, user-facing UI, `src/app.js`, `index.html`, `sw.js`, `src/ephemeris-data.js`, generator, houses, ASC / MC, transits and orbs were not changed.
- Added a future security backlog item for dev-only `swisseph` audit findings; no audit fix was run.

## 2026-05-21 — Complete Task 6.4b stage 1 astronomy-engine provider spike

- Installed exact dependency `astronomy-engine@2.1.19`.
- Added isolated `src/astronomyEngineProvider.js` with provider info, capability reporting, source audit helper and safe `notSupported` calculation path.
- Added `test/astronomyEngineProvider.test.js`.
- Source/privacy audit found no executable `fetch`, `XMLHttpRequest`, `WebSocket` or executable remote URL behavior in the installed package; URL matches are documentation/comment/package metadata references.
- Identified candidate API paths for future fixture validation: `SunPosition(date).elon`, `EclipticGeoMoon(date).lon`, and `GeoVector(body, date, true) -> Ecliptic(vector).elon`.
- Provider remains capability-disabled because the geocentric tropical longitude path is not fixture-validated yet.
- User-facing UI, `src/app.js`, `index.html`, `sw.js`, `src/ephemeris-data.js`, generator, natal chart UI, houses, ASC / MC, transits and orbs were not changed.

## 2026-05-16 — Complete Task 6.4a provider approval review

- Создан `NATAL_PROVIDER_APPROVAL_REVIEW.md` для первого реального natal provider candidate.
- Primary candidate: `astronomy-engine`; recommendation: лучший первый локальный кандидат для natal planet positions, но approval status остается `pending`.
- Зафиксировано, что dependency нельзя устанавливать или интегрировать без явного approval и fixture validation.
- `TODO.md` и `PROJECT_STATE.md` разделили Task 6.4 на `6.4a done` и `6.4b blocked`.
- Код приложения, `package.json`, `package-lock.json`, provider integration, real natal planets, houses, ASC / MC, transits, aspects и orbs не менялись.

## 2026-05-15 — Complete Task 6.3 natal provider adapter contract

- Добавлен `src/natalProviderAdapter.js` с default `notSupported` adapter, capability reporting, contract validation и safe runner.
- Добавлен `test/natalProviderAdapter.test.js` с test-only mock-ready adapter coverage.
- Production adapter не подключает real provider и не создает fake planets, houses, ASC / MC, transits или orbs.
- `package.json`, dependencies, UI, `app.js`, `index.html`, `sw.js`, `ephemeris-data.js` и generator не менялись.
- Task 6.4 оставлена следующей активной задачей, но заблокирована до отдельного approval и не начиналась.

## 2026-05-15 — Complete Task 6.2 natal provider fixture strategy

- Создан `NATAL_FIXTURE_STRATEGY.md`.
- Добавлен `test/fixtures/natalProviderFixtures.js` с public/synthetic pending fixtures для future provider validation.
- Добавлены fixture categories: `modern`, `historical`, `moonSensitive`, `timezoneSensitive`, `unknownBirthTime`, `missingCoordinates`.
- Добавлен `test/natalProviderFixtures.test.js` для структуры fixtures, privacy guardrails, pending expected values и запрета fake longitudes.
- Provider, dependencies, `package.json`, app code, real planets, houses, ASC / MC, transits, UI, `ephemeris-data.js` и generator не менялись.
- Task 6.3 оставлена следующей активной задачей и не начиналась.

## 2026-05-15 — Complete Task 6.1 provider research

- Создан `NATAL_PROVIDER_RESEARCH.md`.
- Сравнены `astronomy-engine`, `circular-natal-horoscope-js`, `astronomia`, Swiss Ephemeris browser/WASM options, current Node/build-time Swiss Ephemeris, server-side option и hybrid approach.
- Recommended path: hybrid approach; first approval candidate is `astronomy-engine` for local natal planet positions after public fixtures and explicit approval.
- Provider dependency, `package.json`, app code, natal planets, houses, ASC / MC, transits, UI, `ephemeris-data.js` и generator не менялись.
- Task 6.2 оставлена следующей активной задачей и не начиналась.

## 2026-05-15 — Prepare Sprint 6 documentation

- Sprint 1–5 remain completed; active sprint is now Sprint 6 — Real Natal Provider Selection / Fixture Validation.
- `TODO.md` lists Task 6.1 as the active task and Task 6.2–6.8 as the Sprint 6 backlog.
- Added Sprint 6 provider / fixture rules to `ASTRO_LOGIC.md`.
- Added Sprint 6 local-first provider privacy rules to `PRIVACY_RULES.md`.
- No app code, provider dependency, real natal calculation, UI, `ephemeris-data.js` or generator changes were added.

## 2026-05-15 — Fix hero Moon phase before upcoming major phase

- Исправлен hero Moon phase label перед будущим Новолунием / Полнолунием: countdown остается, но текущая фаза больше не называется точным событием заранее.
- Для `2026-05-15T10:33:00+03:00` hero показывает `Убывающий серп` вместе с `До Новолуния`.
- PWA-кэш обновлен до `lunar-calendar-v59`.
- Sprint 6 не начинался.

## 2026-05-15 — Complete Sprint 5 hardening

- Завершена Task 5.8 — Sprint 5 Hardening.
- Проверено, что production UI не показывает fake natal calculations, natal chart, planet table, house table, ASC / MC values, personal transits или orbs.
- Проверено, что debug выводит только safe capability/provider state и не раскрывает raw birth data или full profile JSON.
- Подтверждено, что `natalEngine`, `birthDateTime` и `planetaryPositionProvider` сохраняют explicit `notSupported` / false capabilities для unsupported features.
- Sprint 5 закрыт; real planetary provider, dependencies, `package.json`, `ephemeris-data.js`, generator, natal planets, houses, ASC / MC и transits не добавлялись.
- Следующий этап — подготовка Sprint 6, но Sprint 6 не начинался.

## 2026-05-15 — Complete Task 5.7 natal engine debug fixtures

- `src/debugPanel.js` получил секцию `Natal Engine Debug` для `?debug=1`.
- Debug показывает engine/provider status, provider reason, unsupported natal capabilities и safe active-profile readiness labels.
- Добавлен `test/fixtures/natalFixtures.js` с test-only mock provider для future-ready natal-engine checks.
- Birth date/time, raw places, coordinates, full profile JSON, fake natal claims, real provider, dependencies, UI, houses, ASC / MC и transits не добавлялись.
- PWA-кэш обновлен до `lunar-calendar-v58`.
- Task 5.8 оставлена следующей активной задачей и не начиналась.

## 2026-05-15 — Complete Task 5.6 natal planets notSupported integration

- `src/natalEngine.js` теперь вызывает `src/planetaryPositionProvider.js` через safe provider path.
- `calculateNatalChart()` short-circuit-ит incomplete input, передает provider `notSupported` reason и не создает fake planets.
- Добавлен test injection path для future-ready provider: ready natal result строится только из явно переданных mock planets.
- Реальный provider, dependencies, `package.json`, UI, эфемериды, houses, ASC / MC и transits не добавлялись.
- Task 5.7 оставлена следующей активной задачей и не начиналась.

## 2026-05-15 — Complete Task 5.5 planetary position provider MVP

- Добавлен `src/planetaryPositionProvider.js` с provider status constants, 10 main natal planet keys, capability reporting, input validation и safe position normalization.
- Provider возвращает `incomplete` для invalid input и explicit `notSupported` для valid-looking input, потому что runtime provider не подключен.
- Добавлен `test/planetaryPositionProvider.test.js`.
- Реальный provider, dependencies, `package.json`, UI, эфемериды, natal planets, houses, ASC / MC и transits не добавлялись.
- Provider оставлен отдельным модулем без интеграции в `natalEngine`, чтобы не менять engine behavior до Task 5.6.
- Task 5.6 оставлена следующей активной задачей и не начиналась.

## 2026-05-15 — Complete Task 5.4 birth datetime and timezone strategy

- Добавлен `src/birthDateTime.js` с safe parsing/readiness helpers для birth date, birth time и birth timezone.
- Helper возвращает `incomplete` для missing/invalid inputs и explicit `notSupported` для UTC conversion, пока нет надежной timezone-стратегии.
- Unknown birth time и missing timezone получают понятные warnings; `utcDateTime` не фейкается.
- Добавлен `test/birthDateTime.test.js`.
- UI, `app.js`, `index.html`, `sw.js`, зависимости, эфемериды, houses, ASC / MC и transits не добавлялись.
- Task 5.5 оставлена следующей активной задачей и не начиналась.

## 2026-05-15 — Complete Task 5.3 natal chart model and engine interface

- Добавлен `src/natalChartModel.js` с neutral result shapes, statuses, feature flags, normalization helpers и `hasNatalFeature()`.
- Добавлен `src/natalEngine.js` со strict provider interface, который сейчас честно возвращает `incomplete` или `notSupported`.
- Добавлены тесты `test/natalChartModel.test.js` и `test/natalEngine.test.js`.
- Provider, UI, зависимости, ephemeris data, houses, ASC / MC, transits и fake natal values не добавлялись.
- Task 5.4 оставлена следующей активной задачей и не начиналась.

## 2026-05-15 — Complete Task 5.2 astrology math primitives

- Добавлен `src/astroMath.js` с pure helpers для нормализации градусов, zodiac sign mapping, degree-in-sign, angular distance, major aspect detection и degree formatting.
- Добавлены тесты `test/astroMath.test.js` для boundary cases, wrap-around, invalid input, major aspects и formatting.
- Модуль не подключен к UI и не использует profiles, ephemeris data, `swisseph`, localStorage или даты.
- Натальный движок, дома, ASC / MC, personal transits и зависимости не добавлялись.
- Task 5.3 оставлена следующей активной задачей и не начиналась.

## 2026-05-14 — Complete Task 5.1 natal engine audit

- Создан `NATAL_ENGINE_STRATEGY.md`.
- Аудит подтвердил, что текущий `swisseph` — Node/build-time native binding и не является browser/PWA runtime engine.
- Подтверждено, что `src/ephemeris-data.js` содержит generated current-dashboard events на 2026–2030 годы, а не arbitrary natal positions, houses, ASC / MC или personal transits.
- Recommended engine path: hybrid approach — текущие generated dashboard events оставить, в Sprint 5 добавить pure math primitives и strict natal engine interface, а local browser-compatible provider подключать позже только после отдельного approval.
- Код приложения, зависимости, `ephemeris-data.js` и generator не менялись.
- Task 5.2 оставлена следующей активной задачей и не начиналась.

## 2026-05-14 — Prepare Sprint 5 documentation

- Sprint 1, Sprint 2, Sprint 3 and Sprint 4 зафиксированы как завершенные.
- Активным спринтом стал `Sprint 5 — Natal Calculation Engine Foundation`.
- В `TODO.md` добавлены Task 5.1–5.8; активная задача — `Task 5.1 — Natal Engine Audit and Decision`.
- В `ASTRO_LOGIC.md` добавлены правила natal calculation foundation: no fake natal values, zodiac mapping, explicit orb/aspect rules, house/ASC/MC limitations and transit requirements.
- В `PRIVACY_RULES.md` добавлены Sprint 5 privacy rules для natal calculation engine work.
- Код приложения не менялся.

## 2026-05-14 — Complete Sprint 4 hardening

- Завершена Task 4.7 — Sprint 4 Hardening.
- Добавлен guardrail-тест, что `Personal Debug` не присутствует в обычном HTML и остается debug-only.
- Подтверждены Sprint 4 boundaries: без натала, домов, ASC / MC, персональных транзитов, орбов, geocoding, backend и cloud sync.
- Sprint 4 закрыт; Sprint 5 не начинался.

## 2026-05-14 — Complete Task 4.6 personal debug safety

- Debug-панель при `?debug=1` получила секцию `Personal Debug`.
- Секция показывает только безопасное состояние профиля: active id/name, status, storage/sync/server/geocoding flags, unavailable capabilities, missing-field labels и warnings.
- Birth date, birth time, raw place objects, raw coordinates, full profile JSON и fake natal/transit claims не выводятся.
- Натал, дома, ASC / MC, персональные транзиты и орбы не добавлялись.
- PWA-кэш обновлен до `lunar-calendar-v57`.
- Task 4.7 оставлена следующей активной задачей и не начиналась.

## 2026-05-14 — Soften personal recommendations copy

- В блоке `Лично для меня` убраны технические user-facing формулировки про `натальный расчетный движок`.
- Summary и пункты `Можно сейчас` / `Для точного личного расчета` / `Важно` стали короче и мягче.
- Readiness / capabilities logic не менялась; Task 4.6 не начиналась.
- PWA-кэш обновлен до `lunar-calendar-v56`.

## 2026-05-14 — Complete Task 4.5 safe personal recommendations MVP

- Добавлен `src/personalRecommendations.js`.
- Блок `Лично для меня` получил безопасные секции `Можно сейчас`, `Нужно добавить` / `Для точного личного расчета` и `Важно`.
- Missing profile fields переводятся в человеческие next steps без технических ключей и sensitive values.
- Copy честно говорит, что личный натальный расчет пока не подключен, а рекомендации основаны на общем моменте.
- Натал, дома, ASC / MC, Moon in natal house, personal transits, transit orbs и personal ritual scoring не добавлялись.
- PWA-кэш обновлен до `lunar-calendar-v55`.
- Task 4.6 оставлена следующей активной задачей и не начиналась.

## 2026-05-14 — Complete Task 4.4 personal dashboard block

- Добавлен компактный dashboard-блок `Лично для меня`.
- Блок скрыт для `Общий день` и показывается только при выбранном сохраненном профиле.
- `src/app.js` подключает `createPersonalContext()` к существующему active profile flow.
- `src/profileUi.js` форматирует safe block view, переводит missing field keys в человеческий текст и ограничивает вывод до 3 строк.
- Birth date, birth time, coordinates, full profile JSON и технические profile keys не выводятся в блоке.
- Натал, дома, ASC / MC, Moon in natal house, personal transits, transit orbs и personal ritual scoring не добавлялись.
- PWA-кэш обновлен до `lunar-calendar-v53`.
- Task 4.5 оставлена следующей активной задачей и не начиналась.

## 2026-05-14 — Complete Task 4.3 personal readiness context MVP

- Добавлен `src/personalContext.js`.
- Helper строит безопасный user-facing context для `Общий день` или выбранного профиля на основе `src/personalProfileInput.js`.
- Возвращаются статусы `general`, `incomplete`, `readyForContext`, `calculationLimited`, summary, readiness, limitations, next steps, `missingFields`, warnings и capabilities.
- Натальные планеты, дома, ASC / MC, personal transits и personal ritual scoring по-прежнему не рассчитываются.
- Добавлены тесты `test/personalContext.test.js`.
- UI, `app.js`, `index.html`, `sw.js`, эфемериды, storage, natal chart и transits не менялись.
- Task 4.4 оставлена следующей активной задачей и не начиналась.

## 2026-05-14 — Complete Task 4.2 profile calculation input adapter

- Добавлен `src/personalProfileInput.js`.
- Adapter принимает selected profile или `null` / `Общий день` и возвращает structured input, readiness flags, `missingFields`, warnings и calculation capabilities.
- Натальные планеты, дома, ASC / MC, Moon in natal house, personal transits, transit orbs и personal ritual scoring явно отключены до появления надежного расчетного движка.
- Добавлены тесты `test/personalProfileInput.test.js`.
- UI, `app.js`, `index.html`, `sw.js`, эфемериды, storage, geocoding и зависимости не менялись.
- Task 4.3 оставлена следующей активной задачей и не начиналась.

## 2026-05-14 — Complete Task 4.1 personal astrology audit

- Создан `PERSONAL_ASTROLOGY_STRATEGY.md`.
- Аудит подтвердил, что текущий `src/ephemeris-data.js` содержит pre-generated current-dashboard events на 2026–2030 годы, а не произвольные natal positions.
- Зафиксировано, что сейчас нельзя надежно считать натальные планеты, дома, ASC / MC, Moon in natal house, персональные транзиты и transit orbs.
- Рекомендованный Sprint 4 MVP: profile calculation input adapter и honest readiness / context layer без фейковых личных расчетов.
- Task 4.2 оставлена следующей активной задачей и не начиналась.
- Код приложения не менялся.

## 2026-05-14 — Prepare Sprint 4 documentation

- Sprint 1, Sprint 2 and Sprint 3 зафиксированы как завершенные.
- Активным спринтом стал `Sprint 4 — Personal Moment Foundation / Лично для меня`.
- В `TODO.md` добавлены Task 4.1–4.7; активная задача — `Task 4.1 — Personal Astrology Strategy and Data Audit`.
- В `PROJECT_STATE.md` зафиксирован главный риск Sprint 4: не показывать псевдоточность и не выдумывать личные расчеты.
- В `PRIVACY_RULES.md` добавлены Sprint 4 privacy rules для personal calculation readiness и debug safety.
- Код приложения не менялся.

## 2026-05-14 — Complete Task 3.8 privacy copy and profile debug state

- В `Мои карты` добавлена явная privacy copy: данные карт хранятся только на устройстве, дата/время/место рождения не отправляются на сервер.
- Backup copy сохранен: `Файл остается у вас. Мы не отправляем данные на сервер.`
- Debug-панель при `?debug=1` получила безопасную секцию `Profiles`.
- `Profiles` debug показывает `profilesCount`, `activeProfileId`, `activeProfileName`, `storage`, `sync`, `serverUpload`, `importExport`.
- Debug не выводит birth details, coordinates, timezone рождения, currentPlace, house system, zodiac или полный profiles dump.
- PWA-кэш обновлен до `lunar-calendar-v49`.
- Sprint 3 завершен. Следующий этап — Sprint 4 / Personal Moment, но разработка Sprint 4 не начиналась.

## 2026-05-14 — Complete Task 3.7 profile export/import

- Уточнена кнопка экспорта: `Экспорт всех карт`.
- Повторный импорт того же backup-файла больше не создает дубликаты уже существующих профилей.
- Импорт теперь пропускает profiles с тем же содержимым и возвращает `skippedCount`.
- В `Мои карты` добавлен блок `Резервная копия` с локальными действиями `Экспорт` и `Импорт`.
- Добавлен `src/profileImportExport.js` для JSON export/import без сервера, cloud sync или внешних API.
- Экспорт создает JSON с `schemaVersion`, `app`, `exportedAt` и `profiles`.
- Импорт валидирует структуру, фильтрует невалидные profiles и не ломается на invalid JSON.
- При конфликте `id` импортируемый профиль получает новый `id`, существующие profiles не перезаписываются.
- После импорта список `Мои карты` обновляется и показывает короткий результат.
- PWA-кэш обновлен до `lunar-calendar-v48`.
- Debug profile state, натал и транзиты не добавлялись.
- Task 3.8 оставлена следующей активной задачей и не начиналась.

## 2026-05-14 — Complete Task 3.6 active profile selector

- В блоке `Профиль` теперь отображается активное значение: `Общий день` или выбранный профиль.
- В `Мои карты` добавлены явные действия `Выбрать` и `Редактировать`.
- Выбор профиля сохраняется через `setActiveProfileId()` и восстанавливается через `getActiveProfileId()`.
- `Общий день` можно выбрать как non-personal режим, но нельзя редактировать / удалять.
- Если active profile удален или отсутствует, UI возвращается к `Общий день`.
- PWA-кэш обновлен до `lunar-calendar-v46`.
- Export/import, debug profile state, натал и транзиты не добавлялись.
- Task 3.7 оставлена следующей активной задачей и не начиналась.

## 2026-05-14 — Complete Task 3.5 edit/delete profile

- Сохраненные профили в `Мои карты` теперь открываются в inline-форме редактирования.
- Форма редактирования переиспользует поля создания профиля и предзаполняется выбранными данными.
- Сохранение изменений идет через `updateProfile()`.
- Удаление профиля идет через `deleteProfile()` после подтверждения `Удалить профиль? Это действие нельзя отменить.`.
- `Общий день` не редактируется и не удаляется.
- PWA-кэш обновлен до `lunar-calendar-v45`.
- Active profile selector, export/import, натал и транзиты не добавлялись.
- Task 3.6 оставлена следующей активной задачей и не начиналась.

## 2026-05-14 — Complete Task 3.4 create profile form

- Кнопка `+ Добавить профиль` теперь открывает inline-форму внутри `Мои карты`.
- Форма сохраняет валидный профиль через `addProfile()` и обновляет список карт.
- Добавлены поля имени, даты, времени, точности времени, места рождения, timezone, системы домов и зодиака.
- Для `неизвестно` время рождения может быть пустым.
- Validation errors показываются короткими русскими сообщениями.
- PWA-кэш обновлен до `lunar-calendar-v44`.
- Edit/delete, active profile selector, export/import, натал и транзиты не добавлялись.
- Task 3.5 оставлена следующей активной задачей и не начиналась.

## 2026-05-14 — Complete Task 3.3 profiles UI shell

- Добавлен компактный блок `Профиль` на главный экран.
- Добавлена раскрываемая inline-секция `Мои карты` без новой навигации.
- Секция показывает `Общий день`, сохраненные profile names, empty state и privacy copy.
- Кнопка `+ Добавить профиль` пока disabled; форма создания профиля не добавлялась.
- Добавлен `src/profileUi.js`; `src/app.js` читает profiles через `loadProfiles()`.
- PWA-кэш обновлен до `lunar-calendar-v43`.
- Task 3.4 оставлена следующей активной задачей и не начиналась.

## 2026-05-14 — Complete Task 3.2 local profile storage

- Добавлен `src/profileStorage.js` для local-first хранения профилей в `localStorage`.
- Добавлены ключи `astroPwa.profiles.v1` и `astroPwa.activeProfileId.v1`.
- Storage безопасно обрабатывает пустое, битое и не-array состояние.
- Active profile id сбрасывается, если профиль удален или больше не существует.
- Добавлены тесты `test/profileStorage.test.js`.
- UI, `app.js`, натальная карта и персональные транзиты не добавлялись.
- Task 3.3 оставлена следующей активной задачей и не начиналась.

## 2026-05-14 — Complete Task 3.1 profile data model

- Добавлен `src/profileModel.js` с profile draft/defaults, normalization и validation helpers.
- Добавлены allowed values для точности времени рождения, системы домов, зодиака и режима текущего места.
- Добавлены тесты `test/profileModel.test.js`.
- Storage, UI, `localStorage`, натальная карта и персональные транзиты не добавлялись.
- Task 3.2 оставлена следующей активной задачей и не начиналась.

## 2026-05-14 — Prepare Sprint 3 documentation

- Sprint 1 and Sprint 2 зафиксированы как завершенные.
- Активным спринтом стал `Sprint 3 — Profiles / Мои карты`.
- В `TODO.md` добавлены Task 3.1–3.8; активная задача — `Task 3.1 — Add Profile Data Model`.
- В `PRIVACY_RULES.md` добавлены Sprint 3 privacy rules для local-first профилей.
- Код приложения не менялся.

## 2026-05-14 — Complete Task 2.7 best windows debug reasoning

- Добавлен `getBestWindowsDebug()` для скрытой проверки reasoning по лучшим окнам.
- Debug-панель при `?debug=1` показывает `Best Windows Debug`, параметры scoring, выбранные окна и top rejected / low-score candidates.
- Обычный `getBestWindows()` остался обратно совместимым и возвращает массив.
- PWA-кэш обновлен до `lunar-calendar-v42`.
- Sprint 2 завершен; Sprint 3 не начинался.

## 2026-05-14 — Complete Task 2.6 no-good-window fallback

- Карточка `Лучшее окно` теперь остается видимой, если подходящих окон нет.
- Добавлены спокойные mode-specific fallback-тексты для всех режимов.
- Scoring logic `getBestWindows()` не менялась.
- PWA-кэш обновлен до `lunar-calendar-v41`.
- Task 2.7 оставлена следующей активной задачей и не начиналась.

## 2026-05-14 — Clarify best window cautions

- В карточке `Лучшее окно` вместо абстрактного `есть предупреждения момента` теперь показывается первое конкретное предупреждение момента.
- Scoring и штраф за warnings не менялись.
- Task 2.6 не начиналась.

## 2026-05-14 — Show Moon aspect interpretation by default

- В блоке `Аспекты Луны` интерпретация следующего аспекта теперь видна сразу.
- Убрана кнопка `?` и JS-логика раскрытия подсказки.
- PWA-кэш обновлен до `lunar-calendar-v40`.
- Task 2.6 не начиналась.

## 2026-05-14 — Polish Task 2.5 best window card

- Исправлены пользовательские подписи режимов в заголовке `Лучшее окно`.
- Уменьшен размер времени в карточке лучшего окна, чтобы оно не доминировало над заголовком.
- PWA-кэш обновлен до `lunar-calendar-v39`.
- Task 2.6 не начиналась.

## 2026-05-14 — Complete Task 2.5 best window card

- Карточка `Лучшее окно сегодня` подключена к главному экрану через `getBestWindows()`.
- Для выбранного режима показывается `Лучшее окно для [режим]`, максимум 2 интервала в формате `HH:mm–HH:mm`.
- Если хороших окон нет, карточка скрывается; no-good-window fallback не добавлялся.
- PWA-кэш обновлен до `lunar-calendar-v38`.
- Task 2.6 оставлена следующей активной задачей и не начиналась.

## 2026-05-14 — Complete Task 2.4 best window scoring helper

- Добавлен `src/bestWindows.js` для расчета 1–2 лучших окон текущего московского дня.
- Helper исключает active VOC, учитывает режим, планетарный час, знак Луны, fieldQuality, warnings и напряженные аспекты Луны.
- Добавлены тесты `test/bestWindows.test.js`.
- UI-карточка лучших окон не добавлялась.
- PWA-кэш обновлен до `lunar-calendar-v37`.
- Task 2.5 оставлена следующей активной задачей и не начиналась.

## 2026-05-14 — Improve Task 2.3 mode recommendation heuristics

- `src/modeRecommendations.js` переведен на внутреннюю rule-based модель `signals → rules → priority → top 3`.
- Добавлены тесты конфликтных сценариев для VOC, Рыб, Марса/Урана, 29 лунных суток и свечей.
- UI не менялся; Task 2.4 не начиналась.

## 2026-05-14 — Complete Task 2.3 mode-specific recommendations

- Добавлен `src/modeRecommendations.js` со списками `Хорошо` / `Осторожно` для всех режимов.
- Блок `Качество поля` теперь меняет рекомендации при переключении режима.
- Заголовки `Подходит` / `Не подходит` заменены на `Хорошо` / `Осторожно`.
- Каждый список ограничен максимум 3 пунктами; unknown mode безопасно падает в `Общее`.
- Добавлены тесты `test/modeRecommendations.test.js`.
- PWA-кэш обновлен до `lunar-calendar-v36`.
- Task 2.4 оставлена следующей активной задачей и не начиналась.

## 2026-05-14 — Complete Task 2.2 mode-specific scores

- Добавлен `src/modeScores.js` со scoring logic для режимов `Общее`, `Таро`, `Свечи`, `Деньги`, `Отношения`, `Чистки`, `Прогнозы`.
- Блок оценок в `Качество поля` теперь меняет метрики при переключении режима.
- Значения оценок ограничены диапазоном 1–10; unknown mode безопасно падает в `Общее`.
- Добавлены тесты `test/modeScores.test.js`.
- PWA-кэш обновлен до `lunar-calendar-v35`.
- Task 2.3 оставлена следующей активной задачей и не начиналась.

## 2026-05-14 — Center dashboard mode selector

- Mode selector оформлен как отдельная карточка; chips центрируются при переносе на две строки.
- PWA-кэш обновлен до `lunar-calendar-v33`.
- Task 2.2 не начиналась.

## 2026-05-14 — Wrap dashboard mode chips

- Mode selector chips теперь переносятся на новую строку вместо горизонтального скролла.
- PWA-кэш обновлен до `lunar-calendar-v32`.
- Task 2.2 не начиналась.

## 2026-05-14 — Complete Task 2.1 dashboard mode selector

- Добавлен compact mode selector с режимами `Общее`, `Таро`, `Свечи`, `Деньги`, `Отношения`, `Чистки`, `Прогнозы`.
- Селектор расположен после `Луна без курса` и `Осторожно сегодня`, перед `Аспекты Луны`.
- Default mode — `Общее`; активный режим визуально выделяется и хранится в in-memory state.
- Добавлен `src/dashboardModes.js` и тесты списка режимов.
- PWA-кэш обновлен до `lunar-calendar-v31`.
- Task 2.2 оставлена следующей активной задачей и не начиналась.

## 2026-05-13 — Prepare Sprint 2 documentation

- Sprint 1 зафиксирован как завершенный, активным спринтом стал `Sprint 2 — Modes and Best Windows`.
- В `TODO.md` добавлены Task 2.1–2.7; активная задача — `Task 2.1 — Add Dashboard Mode Selector`.
- В `ASTRO_LOGIC.md` добавлены правила режимов и scoring notes для best windows.
- В `UI_RULES.md` добавлены правила mode selector, mode recommendations и best window UI.
- Код приложения не менялся.

## 2026-05-13 — Complete Task 1.10 hidden debug screen

- Добавлена скрытая debug-панель, доступная только через `?debug=1`.
- Debug-панель показывает расчетное время, статус `debugDate`, систему дня, знак Луны, VOC, аспекты Луны, индикаторы и данные эфемерид.
- Поддержан вариант `?debug=1&debugDate=2026-05-15T00:40:00` для проверки конкретного момента.
- Добавлен `src/debugPanel.js` и тесты для режима debug и ключевых секций.
- PWA-кэш обновлен до `lunar-calendar-v30`.
- Sprint 1 завершен; Sprint 2 не начат.

## 2026-05-13 — Complete Task 1.9 terminology cleanup

- Строка перехода Луны теперь отображается как `Переход в ...: сегодня/завтра HH:mm`, без секунд.
- Заголовок `Индикатор дня` заменен на `Индикаторы`.
- Точное новолуние / полнолуние на главном экране теперь показывается без секунд.
- Добавлен `src/moonSignDisplay.js` для компактного форматирования перехода Луны по знакам.
- PWA-кэш обновлен до `lunar-calendar-v29`.

## 2026-05-13 — Complete Task 1.8 Planetary hour hints

- Под планетарным часом добавлена короткая практическая подсказка `Хорошо для: ...`.
- Добавлен `src/planetaryHourHints.js` со словарем подсказок для всех семи планетарных часов.
- Неизвестное значение часа скрывает подсказку без `undefined` / `null`.
- PWA-кэш обновлен до `lunar-calendar-v28`.

## 2026-05-13 — Hide Moon age from hero

- Из hero-блока убрана строка `Возраст Луны`, чтобы не дублировать лунный день.
- Расчет возраста Луны в `src/astro.js` сохранен.

## 2026-05-13 — Complete Task 1.7 Moon precision

- В основной блок Луны добавлены строки `Освещенность`, `До Новолуния / Полнолуния` и `Возраст Луны`.
- Добавлен `src/moonPrecisionDisplay.js` для компактного форматирования лунной точности.
- `src/preciseEphemeris.js` теперь умеет возвращать ближайшее будущее Новолуние / Полнолуние.
- PWA-кэш обновлен до `lunar-calendar-v27`.

## 2026-05-13 — Remove Moon aspect countdown

- Из строки `Следующий аспект` убран countdown `через Xч Yм`.
- Дата и время аспекта сохранены в формате `сегодня/завтра HH:mm`.

## 2026-05-13 — Move warnings block higher

- Карточка `Осторожно сегодня` перенесена сразу после `Луна без курса`, перед блоком `Аспекты Луны`.
- Логика и тексты warnings не менялись.

## 2026-05-13 — Add debugDate manual check parameter

- Добавлен dev-only query-параметр `?debugDate=YYYY-MM-DDTHH:mm:ss` для ручной проверки главного экрана на выбранной дате.
- Без `debugDate` приложение продолжает работать от текущего времени.
- Добавлен тест парсинга `debugDate`.
- PWA-кэш обновлен до `lunar-calendar-v26`.

## 2026-05-13 — Complete Task 1.6 Warnings block

- Добавлен компактный блок `Осторожно сегодня`, который показывается только при наличии красных флагов.
- `src/fieldQuality.js` теперь возвращает список `warnings` на основе VOC, напряженного следующего аспекта Луны, 23 / 29 лунных суток и Луны в Рыбах.
- Добавлены тесты для active/upcoming VOC warnings, отсутствия warnings без красных флагов и лимита предупреждений.
- PWA-кэш обновлен до `lunar-calendar-v25`.

## 2026-05-13 — Complete Task 1.5 Field Quality advice

- Блок `Качество поля` получил более точные состояния поля: устойчивое, тонкое, нервное, плотное, очищающее, размытое, денежное.
- Добавлена строка `Главный совет момента`.
- Существующие оценки `Интуиция`, `Материальные дела`, `Ритуалы` и списки `Подходит` / `Не подходит` сохранены.
- PWA-кэш обновлен до `lunar-calendar-v24`.

## 2026-05-13 — Complete Task 1.4 Moon aspect interpretation

- В блок `Аспекты Луны` добавлено компактное раскрытие через кнопку `?`.
- Для следующего аспекта Луны показывается короткая практическая интерпретация.
- Точные тексты и fallback-правила добавлены в `src/moonAspectsDisplay.js`.
- PWA-кэш обновлен до `lunar-calendar-v23`.

## 2026-05-13 — Complete Task 1.3 Moon aspects block

- Упрощен текст блока `Луна без курса`: убраны `Луна в курсе`, `Следующая VOC` и внутренний заголовок `Следующая Луна без курса`.
- Уточнено отображение аспектов Луны: названия аспектов заменены на глифы, countdown стал компактным (`20ч 28м`).
- Блок `Аспекты Луны` теперь использует подписи `Последний аспект` и `Следующий аспект`.
- Аспекты отображаются с названием аспекта, планетой, относительным днем и временем `HH:mm`.
- Для следующего аспекта добавлен countdown в формате `через X ч Y мин`.
- Немажорные аспекты и отсутствующие данные показываются как `нет данных`.
- Добавлен `src/moonAspectsDisplay.js` и тесты отображения аспектов Луны.
- PWA-кэш обновлен до `lunar-calendar-v22`.

## 2026-05-11 — Checkpoint before continuing

- Зафиксировано текущее состояние Sprint 1 внутри документации.
- Подтверждено: Task 1.1 и Task 1.2 закрыты, Task 1.3 следующая и не начата.
- Зафиксированы последние изменения: упрощен блок `Луна без курса`, добавлена строка `фон ...`, добавлено тестовое покрытие выбора следующей VOC после завершения текущей.
- Код приложения в этом checkpoint-шаге не менялся.

## 2026-05-11 — Complete Task 1.2 VOC background label

- Добавлено тестовое покрытие: после завершения текущей VOC выбирается следующая будущая VOC, а не завершившийся интервал.
- Строка `фон ...` теперь визуально отделена новой строкой и приглушенным цветом.
- В блок `Луна без курса` добавлена строка фона после аспекта: `фон мягкий`, `фон напряженный`, `фон размытый`, `фон тяжелый`, `фон нервный`.
- Строка фона не содержит слово `VOC` и скрывается, если данных о последнем аспекте недостаточно.
- Текущая упрощенная логика VOC-блока сохранена.
- Task 1.3 не запускалась.

## 2026-05-11 — Simplify Task 1.1 VOC card UX

- Карточка снова называется `Луна без курса`.
- Убраны формулировки `Статус Луны`, `Луна в курсе`, `Без курса: ...`, `VOC после: ...`.
- Убраны countdown-строки и VOC quality label из карточки.
- Итоговый формат: `с HH:mm до HH:mm`, `до HH:mm`, `после: ...` или `нет данных`.
- Task 1.2 не запускалась в этом проходе.

## 2026-05-11 — Complete Task 1.2 VOC quality label

- В блок `Статус Луны` добавлен компактный label качества VOC по последнему аспекту перед VOC.
- Реализован приоритет label: Нептун, Сатурн, Марс / Уран, напряженный аспект, гармоничный аспект.
- Если данных о последнем аспекте недостаточно, label не показывается.
- Task 1.3 не запускалась.

## 2026-05-11 — Complete Task 1.1 VOC block states

- В состоянии `Луна в курсе` строка следующей VOC переименована в более мягкую `Без курса: дата, время`.
- Заголовок VOC-карточки изменен на нейтральный `Статус Луны`, чтобы не конфликтовать с состоянием `Луна в курсе`.
- Доработан блок `Луна без курса`: upcoming / active / none теперь показываются отдельными понятными состояниями.
- В VOC-блоке на главном экране время выводится в формате `HH:mm`, без секунд.
- Добавлен обратный отсчет до начала или окончания VOC.
- Строка `после: ...` заменена на `VOC после: ...`.
- Форматирование VOC вынесено в `src/vocDisplay.js` и покрыто тестами.
- PWA-кэш обновлен до `lunar-calendar-v20`.

## 2026-05-11 — Astro PWA 2.0 documentation

- Добавлена документация этапа Astro PWA 2.0.
- Введена иерархия документов проекта:
  - `PROJECT_STATE.md` — текущее состояние проекта и активный спринт;
  - `ARCHITECTURE.md` — фактическая архитектура кода;
  - `TODO.md` — активный рабочий список задач;
  - `ASTRO_LOGIC.md` — правила астрологических расчетов;
  - `UI_RULES.md` — правила интерфейса;
  - `PRIVACY_RULES.md` — правила приватности;
  - `MASTER_PLAN.md` — большой роадмап, не инструкция делать все сразу;
  - `CHANGELOG.md` — история изменений.
- Старый `CHANGELOG.md` сохранен, новая запись добавлена сверху.
- `TASKS.md` из внешнего комплекта не используется как главный список задач: приоритет у `TODO.md`.
- Код приложения не менялся.

## 2026-05-11

- Подготовлены документы проекта для передачи в новый Codex-чат без истории текущего чата.
- Актуализированы состояние проекта, ближайший TODO и активный фокус: калибровка блока `Качество поля`.
- Зафиксировано, что в этом handoff-шаге код приложения не менялся.
- Добавлен документационный чекпоинт проекта.
- Зафиксировано текущее состояние приложения, архитектура, TODO и главный блокер.
- Уточнен расчет Tong Shu по документу `Фиксы.docx`: MSK, Jie Qi, смена энергетического дня в 23:00.
- Для 11 мая 2026 закреплены `乙酉` и индикатор `Стабильность`.
- Исправлено согласование Ба-цзы названий по роду, например `Деревянный Петух`.
- Добавлены предрасчитанные мажорные аспекты Луны к планетам.
- На главный экран добавлен компактный блок `Аспекты Луны`: последний и следующий аспект.
- В блоке Луны без курса добавлена строка с аспектом, после которого начался VOC.
- Добавлен блок `Качество поля` с фразой момента и оценками `Интуиция`, `Материальные дела`, `Ритуалы`.
- PWA-кэш обновлен до `lunar-calendar-v16`.
- Добавлен скрипт `npm run calibrate:field` для калибровки качества поля на контрольных датах.
- В приложение добавлен список причин внутри блока `Качество поля`.
- PWA-кэш обновлен до `lunar-calendar-v17`.
- Ограничено влияние прошлого напряженного аспекта Луны: сильное эхо учитывается 4 часа, а не до следующего аспекта.
- В блок `Качество поля` добавлены списки `Подходит / Не подходит`.
- PWA-кэш обновлен до `lunar-calendar-v19`.

## 2026-05-10

- Создано PWA лунного календаря для iPhone.
- Настроена публикация через GitHub Pages.
- Интерфейс приведен к чистому главному экрану без лишних меню и декоративной центральной Луны.
- Добавлены точные данные Swiss Ephemeris на 2026-2030 годы.
- Добавлены точные лунные дни для Москвы.
- Добавлены переходы Луны по знакам и Луна без курса.
- Добавлены планетарный день и планетарный час.
- Добавлены показатели дня: лунные сутки, Ба-цзы день, индикатор дня Tong Shu.
- Уточнено название 23-х лунных суток: `Крокодил Маккара`.
- Индикатор дня временно переводился на выбранную линию Tong Shu, где 10 мая 2026 показывал `Устранение`; затем линия была уточнена 11 мая по отдельному документу.
- Добавлены точные новолуния и полнолуния с временем до секунд.
- PWA-кэш обновлен до `lunar-calendar-v14`.
