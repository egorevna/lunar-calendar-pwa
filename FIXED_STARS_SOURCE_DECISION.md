# FIXED_STARS_SOURCE_DECISION.md

## Purpose

Defines source/catalog/orb policy for Fixed Stars in Sprint 14.

This file is policy only. It does not implement a fixed-star catalog dataset, position engine, conjunction engine, display helper, UI, debug section, fixtures with calculated values or interpretations.

## Decision

Primary astrology source:

- `Вронский, Таблица 18 — Неподвижные звезды`.

Primary source system key:

- `fixed-stars-vronsky-table-18`.

Validation source:

- Swiss / modern fixed-star source validation where possible.
- Local Swiss Ephemeris fixed-star support may be used only as a dev/test oracle for manual/static validation.
- Swiss / modern validation must not replace the primary Vronsky source silently.

Initial relationship policy:

- conjunction only.

Initial target set:

- natal planets;
- ASC;
- MC;
- DSC;
- IC.

Orb policy:

- global conjunction orb `1°00′`;
- orb policy key: `fixed-stars-global-conjunction-orb-1deg`;
- per-star and per-target orb overrides are deferred.

Active catalog policy:

- no active fixed-star rows exist after Task 14.2;
- candidate names are planning candidates only;
- a star becomes active only after Task 14.3 creates a manually verified source-tracked dataset row.

## Rationale

Vronsky Table 18 is selected as the primary astrology catalog source because the product needs a traditional astrology source rather than an anonymous broad star dump.

Swiss / modern validation is still required because fixed-star names, aliases, identifiers and coordinates can differ across traditions and data sources. Validation must help confirm identity and coordinate handling without turning Swiss Ephemeris into a PWA runtime dependency or silently changing the source system.

This policy deliberately avoids activating the full catalog at once. Sprint 14 starts with a manually verified subset so the project can validate source metadata, epoch handling, orb behavior, target resolution, display and privacy boundaries before expanding.

## Source / Dependency Audit

Project audit:

- no existing `src/fixedStars.js`;
- no existing `src/fixedStarsData.js`;
- no existing `src/fixedStarsDisplay.js`;
- no existing `src/fixedStarsForProfile.js`;
- no existing fixed-star catalog dataset;
- existing `Star of Magi` files are degree-ruler modules, not fixed-star catalog modules.

Runtime / dependency audit:

- `astronomy-engine` exposes user-defined star support through `DefineStar`, but it is not a fixed-star catalog and not a source policy by itself.
- local `swisseph` exposes `SE_FIXSTAR`, `swe_fixstar_ut`, `swe_fixstar2_ut`, `swe_fixstar_mag` and `swe_fixstar2_mag`.
- local `node_modules/swisseph/ephe/sefstars.txt` contains Swiss Ephemeris fixed-star source data.
- local Swiss Ephemeris must remain dev/test oracle only.
- PWA runtime must not import `swisseph`.
- no network calls are allowed.
- no dependencies are added in Task 14.2.
- no OCR import is allowed.

## Catalog Policy

Catalog rows must be source-gated.

Rules:

- no fixed star from memory;
- no blind OCR import;
- no broad catalog activation;
- no active row without manual verification;
- every active row must preserve source metadata;
- every active row must preserve coordinate / epoch metadata;
- every active row must include `verificationStatus: "verified"`;
- no row may include interpretations, mythology text, predictions, fatalistic text or ritual advice.

Task 14.3 must create dataset rows manually and must keep candidate-only rows inactive until verified.

## Candidate Initial Subset

The initial candidate subset is:

- Алголь;
- Альдебаран;
- Ригель;
- Бетельгейзе;
- Сириус;
- Канопус;
- Регул;
- Спика;
- Арктур;
- Антарес;
- Вега;
- Альтаир;
- Фомальгаут.

Candidate status:

- `candidateOnly`;
- not active in Task 14.2;
- not calculated in Task 14.2;
- not displayed in Task 14.2;
- requires Task 14.3 manual dataset verification before any row can become active.

## Coordinate / Epoch / Precession Policy

Vronsky Table 18 contains 1950 / 1970 / 1990 columns where available.

Task 14.3 dataset policy:

- preserve Vronsky source columns where available;
- use the Vronsky 1990 column as the initial reference epoch for the source row when a row is verified;
- keep 1950 / 1970 / 1990 values as source evidence, not as interchangeable runtime values;
- record source column availability per row;
- record modern / Swiss validation identity metadata where possible.

Task 14.4 position policy:

- must validate how date-of-birth tropical ecliptic longitudes are produced before any conjunction engine is allowed;
- must not silently use raw 1990 positions as date-of-birth positions;
- must not silently mix Vronsky epoch columns, Swiss ICRS / RA-Dec source data and tropical ecliptic longitudes;
- must document whether the runtime helper uses precession from the 1990 reference epoch, interpolation between Vronsky columns, modern validated source positions, or another explicitly validated browser-safe method.

No hidden epoch is allowed.

No mixed epochs are allowed.

No conjunction engine may run until position handling is validated.

## Orb Policy

Sprint 14 MVP uses a single explicit conjunction orb:

- relationship: `conjunction`;
- orb: `1°00′`;
- orb in degrees: `1`;
- policy key: `fixed-stars-global-conjunction-orb-1deg`.

Deferred orb policies:

- per-star orb overrides;
- per-target orb overrides;
- source-specific orb tables;
- variable orb by magnitude;
- broader "near star" detection.

The engine must use the documented orb policy only. Hidden defaults are forbidden.

## Target Policy

Active first target set:

- natal planets;
- ASC;
- MC;
- DSC;
- IC.

Target source rules:

- targets must come from already calculated profile outputs;
- Fixed Stars layers must not recalculate natal planets, ASC / MC, houses, Arabic Parts or Special Points;
- target rows must use numeric longitude for matching, not display text;
- target resolver must avoid exposing raw birth data, raw coordinates, UTC or full profile JSON.

Deferred target sets:

- house cusps;
- Lunar Nodes;
- Lilith;
- Selena;
- Pars Fortuna;
- Lot of Spirit;
- Arabic Parts;
- custom points.

## Relationship Policy

Active relationship:

- conjunction only.

Deferred relationships:

- opposition;
- square;
- trine;
- sextile;
- paran relationships;
- heliacal phenomena;
- star-rise / set calculations;
- mundane position relationships.

## Validation Plan

Task 14.3 must validate catalog rows as static/manual source data, not as generated rows.

Task 14.4 must validate position / epoch handling before Task 14.6 conjunction detection.

Validation requirements:

- Vronsky source row checked manually;
- star identity cross-checked against Swiss / modern source where possible;
- 1950 / 1970 / 1990 column policy preserved where available;
- no private user data in fixtures;
- no OCR-only import;
- no full broad catalog activation;
- no runtime Swiss Ephemeris import.

## Deferred

Deferred until later source decisions:

- full Fixed Stars catalog;
- non-candidate star activation;
- per-star orbs;
- per-target orbs;
- parans;
- heliacal phenomena;
- star-rise / set calculations;
- Fixed Star interpretations;
- mythology text;
- predictive text;
- ritual scoring;
- transits.

## Strict Exclusions

Task 14.2 does not add:

- `src/fixedStars.js`;
- `src/fixedStarsData.js`;
- `src/fixedStarsDisplay.js`;
- `src/fixedStarsForProfile.js`;
- fixed-star dataset rows;
- calculated star positions;
- conjunction calculations;
- fixtures with calculated star values;
- UI;
- debug;
- interpretations;
- mythology text;
- fatalistic text;
- ritual scoring;
- package changes;
- PWA cache changes.
