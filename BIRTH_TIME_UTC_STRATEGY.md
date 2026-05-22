# BIRTH_TIME_UTC_STRATEGY.md

## Purpose

This document records Task 7.4a: the strategy and approval review for converting stored birth local date/time/timezone into a UTC datetime for future user-facing natal planet display.

Main rule:

```txt
Do not show user-facing natal planet positions until birth local time can be converted to UTC safely and tested.
```

This task does not implement conversion, install dependencies, change provider calculations, or enable natal planet values in the UI.

Sources checked:

- MDN `Date`: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
- MDN `Date.parse`: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse
- MDN `Intl.DateTimeFormat`: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
- MDN `Temporal`: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal
- MDN `Temporal.ZonedDateTime.from()`: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal/ZonedDateTime/from
- Luxon docs: https://moment.github.io/luxon/
- Luxon API docs: https://moment.github.io/luxon/api-docs/index.html
- Luxon source docs: https://github.com/moment/luxon
- date-fns-tz README: https://github.com/marnusw/date-fns-tz
- Moment Timezone docs: https://momentjs.com/timezone/docs/
- Moment project status: https://momentjs.com/docs/#/-project-status/
- Temporal polyfill: https://github.com/js-temporal/temporal-polyfill

## Current State

`src/birthDateTime.js` currently provides:

- `parseBirthDate(value)`;
- `parseBirthTime(value, birthTimeAccuracy)`;
- `normalizeTimezone(value)`;
- `createBirthDateTimeInput(profile)`;
- `getBirthDateTimeReadiness(profile)`;
- `explainBirthDateTimeLimitations(input)`.

Current behavior is intentionally conservative:

- `birthDate` is parsed as `YYYY-MM-DD` without timezone-shifting `Date` parsing.
- `birthTime` is parsed as `HH:mm` when `birthTimeAccuracy` is `exact` or `approximate`.
- empty time is allowed only when `birthTimeAccuracy === "unknown"`.
- `birthPlace.timezone` is validated as a non-empty timezone string and, when available, checked with `Intl.DateTimeFormat`.
- missing `birthDate`, required `birthTime`, or `birthPlace.timezone` produces `status: "incomplete"`.
- missing coordinates are tracked for future houses / ASC / MC readiness, but coordinates are not required for natal planet longitude conversion.
- `canConvertToUtc` is always `false`.
- `utcDateTime` is always `null`.
- when date, known time, and timezone are present, the helper still returns a limitation: `Точная конвертация времени рождения в UTC требует надежной timezone-стратегии.`

`src/profileModel.js` currently stores:

- `birthDate`;
- `birthTime`;
- `birthTimeAccuracy`;
- `birthPlace.city`;
- `birthPlace.country`;
- `birthPlace.latitude`;
- `birthPlace.longitude`;
- `birthPlace.timezone`;
- `currentPlace.timezone`;
- `houseSystem`;
- `zodiac`.

`birthPlace.timezone` is an IANA timezone string when the user provides one. Empty profile drafts use an empty birth timezone. `currentPlace.timezone` defaults to `Europe/Moscow`, but that is not a birth timezone fallback and must not be used for birth conversion.

`package.json` currently contains:

- dependency: `astronomy-engine@2.1.19`;
- dev dependency: `swisseph`;
- no timezone conversion dependency;
- no geocoding dependency.

## Why UTC Conversion Matters

`src/astronomyEngineProvider.js` calculates natal planet positions from provider input that includes `utcDateTime`. Internally it turns the UTC-like input into a JavaScript `Date`.

Correct UTC conversion matters because:

- birth profiles store local civil time, not an instant;
- `astronomy-engine` needs an instant;
- local birth time must be interpreted in `birthPlace.timezone`;
- the Moon moves quickly, so a timezone error can visibly shift lunar longitude and sometimes sign;
- Mercury / Venus / Mars degrees also shift with time, even if less dramatically than the Moon;
- ASC / MC and houses are even more time-sensitive, but remain out of scope for this Sprint 7 unblock.

Never do this:

```js
new Date(`${birthDate}T${birthTime}:00Z`)
```

That treats local birth time as UTC and creates a precise-looking but wrong instant.

## Native JavaScript Options

### `Date`

Native `Date` is not enough for this task.

MDN documents that `Date` stores a UTC timestamp internally, but local component getters/setters use the host environment timezone, and the local timezone is not stored in the object. The multi-argument constructor interprets components in the host local timezone, not in an arbitrary IANA timezone such as `Europe/Moscow` or `America/New_York`.

Problems:

- `new Date(year, month, day, hour, minute)` uses the user's device timezone.
- `new Date("YYYY-MM-DDTHH:mm")` with date+time but no zone uses the local system timezone.
- `new Date("YYYY-MM-DDTHH:mmZ")` treats the time as UTC, not birth local time.
- `Date.parse()` behavior outside strict formats can vary across browsers.
- `Date` has no direct API to say "interpret this wall-clock time in this IANA zone".

Decision:

- keep native `Date` only for already-converted UTC instants;
- do not use native `Date` alone to convert birth local time to UTC.

### `Intl.DateTimeFormat`

`Intl.DateTimeFormat` supports the `timeZone` option with IANA names. This is good for validating and formatting timezones.

It is not a complete high-level conversion API.

Possible low-level strategy:

- create candidate UTC instants;
- format them in the target timezone;
- compare formatted parts against requested local parts;
- search around DST transitions;
- detect nonexistent and ambiguous local times.

Risks:

- easy to get DST gaps wrong;
- ambiguous local times need explicit policy;
- historical timezone data comes from the browser / OS ICU database and can differ by platform;
- iPhone Safari must be smoke-tested;
- handwritten conversion logic becomes a mini timezone library.

Decision:

- keep `Intl.DateTimeFormat` for timezone validation;
- do not build a custom production UTC converter on raw `Intl` in this project unless library approval is denied and a separate tested implementation task is approved.

### `Temporal`

`Temporal` is the right JavaScript API shape for this problem. `Temporal.ZonedDateTime.from()` supports IANA timezones and explicit disambiguation options such as `compatible`, `earlier`, `later`, and `reject`.

Problem:

- MDN currently marks `Temporal` as limited availability and not Baseline because it does not work in some widely used browsers.
- A polyfill would be required for reliable iPhone PWA support unless the target Safari version is confirmed.

Decision:

- native `Temporal` should be watched as the long-term direction;
- do not rely on native `Temporal` for Sprint 7 without a polyfill and browser compatibility approval.

## Library Options

### `luxon`

Type:

- modern date/time library with its own `DateTime` class.

Browser/PWA:

- official docs list modern browser support, including Safari / iOS Safari 14+ in the support matrix.
- supports ES module import.

Timezone behavior:

- supports IANA zones through built-in `Intl` APIs;
- `DateTime.fromObject({ year, month, day, hour, minute }, { zone })` can interpret wall-clock parts in a specific zone;
- `toUTC()` can produce UTC output;
- `Info.isValidIANAZone()` / `IANAZone.isValidZone()` can validate timezone identifiers;
- `getPossibleOffsets()` can help detect ambiguous local times in recent Luxon API docs.

Risks:

- Luxon uses host Intl timezone data, not an embedded pinned tz database.
- Luxon docs note that DST ambiguous local-time creation does not guarantee which possible timestamp is chosen unless additional checks are done.
- Nonexistent times can be shifted forward unless the app detects that the returned local components changed.

Safe implementation policy if approved:

- use Luxon only through a small `birthDateTime` conversion helper;
- pass explicit IANA timezone from `birthPlace.timezone`;
- round-trip-check requested local date/time components after creation;
- detect ambiguous local times with `getPossibleOffsets()` where available;
- fail closed for ambiguous / nonexistent times until a UX policy is approved;
- return `incomplete` / `notSupported` instead of guessing.

Privacy:

- local-only;
- no backend required;
- no network calls required.

License:

- MIT, based on the Luxon repository license.

Fit:

- best first candidate for Sprint 7 implementation after explicit dependency approval.

### `date-fns-tz`

Type:

- timezone helpers for `date-fns`.

Browser/PWA:

- official README says it uses the browser `Intl` API and does not include timezone data in bundles;
- supports ESM and CommonJS;
- requires `date-fns` as a peer dependency.

Timezone behavior:

- `fromZonedTime()` converts a date/time plus timezone to an equivalent UTC `Date`;
- `getTimezoneOffset()` can inspect offsets for a specific zone and date;
- invalid timezone input returns invalid dates or `NaN` depending on helper.

Risks:

- would add at least `date-fns-tz` plus `date-fns`;
- function-based API returns plain `Date`, which can make accidental host-timezone use easier;
- ambiguity / nonexistent local-time policy is less explicit in the docs than Temporal and less self-contained than Luxon for this project's wrapper style.

Privacy:

- local-only;
- no backend required;
- no network calls required.

License:

- MIT.

Fit:

- viable fallback if the project later prefers date-fns ecosystem, but not the recommended first Sprint 7 candidate.

### `moment-timezone`

Type:

- Moment.js timezone extension with timezone data bundles.

Browser/PWA:

- works in browsers;
- browser builds require loading both library and timezone data;
- docs offer full data and reduced data bundles.

Timezone behavior:

- embedded timezone data can reduce dependence on host ICU;
- docs explicitly describe nonexistent and duplicated local times.

Risks:

- Moment is a legacy project in maintenance mode and not recommended for new projects by its own docs;
- default bundling can be large;
- mutable Moment objects do not match the project's current preference for small pure helpers;
- choosing a reduced timezone dataset could omit older birth dates.

Privacy:

- local-only if bundled locally;
- no backend required.

License:

- MIT.

Fit:

- useful later only if the project decides pinned timezone database matters more than bundle size and modern API. Not recommended as the first Sprint 7 path.

### Temporal Polyfill

Type:

- polyfill for TC39 Temporal.

Browser/PWA:

- can provide Temporal-like API before native support is universal;
- package is larger than a narrow helper and needs bundle measurement.

Timezone behavior:

- excellent API for this task;
- supports explicit disambiguation such as `reject` for ambiguous or nonexistent local times.

Risks:

- extra dependency;
- bundle / performance impact needs measurement;
- native Temporal is still not baseline in MDN;
- polyfill integration must be tested in Safari / iPhone PWA.

Privacy:

- local-only;
- no backend required.

License:

- ISC based on package metadata and repository.

Fit:

- strong future candidate if explicit disambiguation is more important than bundle size. For Sprint 7, use only after separate approval if Luxon is rejected or if Temporal becomes the chosen standard.

### Other candidates

No additional candidate should be added before a separate approval review. The project already has a clean provider layer and should avoid dependency sprawl.

## Privacy Review

All recommended timezone conversion approaches must remain local-first.

Allowed:

- local library conversion in the browser;
- IANA timezone string already stored in the profile;
- local test fixtures;
- no raw birth data in debug.

Not allowed:

- remote timezone API;
- backend conversion service;
- geocoding API;
- device geolocation;
- analytics with birth date/time/place;
- logging full profile objects;
- dumping birth date/time/timezone/coordinates in debug.

`luxon`, `date-fns-tz`, `moment-timezone`, and Temporal polyfill can all be used local-only if installed as local dependencies and called only in browser/runtime code. None should require sending birth data outside the device.

## Browser / iPhone PWA Review

The app targets a static browser/PWA flow and iPhone Safari installation.

Important compatibility notes:

- Native `Date` and `Intl.DateTimeFormat` exist broadly, but native `Date` lacks arbitrary-zone conversion.
- `Intl.DateTimeFormat` with IANA timezone support is the foundation for Luxon and date-fns-tz.
- Luxon docs list Safari / iOS Safari 14+ support, but actual historical timezone coverage depends on the browser / OS `Intl` data.
- Temporal native support is not yet universal; a polyfill would be required for conservative PWA support.
- Moment Timezone can bundle its own timezone data, but bundle size is a serious PWA tradeoff.

Required later:

- browser smoke test in the app environment;
- iPhone Safari / installed PWA smoke test;
- bundle-size check after any dependency install;
- regression test that conversion never uses the user's current device timezone as a birth timezone fallback.

## Historical Timezone Risks

Historical timezone correctness means:

- use the offset that was valid in the birth timezone on the birth date;
- account for DST where applicable;
- account for legal timezone changes;
- treat ambiguous local times explicitly;
- reject or flag nonexistent local times;
- never substitute current timezone offset for historical offset.

Ambiguous local time:

- happens when clocks move backward and the same wall-clock time occurs twice;
- for exact birth time, the app should not silently choose one unless a policy is approved;
- safe MVP: return a warning and block exact UTC conversion until the user / policy resolves it.

Nonexistent local time:

- happens when clocks move forward and a wall-clock time is skipped;
- safe MVP: return an error / limitation instead of shifting automatically.

Unknown timezone:

- status remains `incomplete`;
- `utcDateTime` remains `null`;
- natal planets remain hidden.

Unknown birth time:

- date may be valid, but exact natal planet positions should remain blocked for user-facing display because Moon and angles are time-sensitive;
- houses / ASC / MC remain unsupported.

## Strategy Options

### A. Native Intl offset conversion without dependency

Pros:

- no dependency;
- local-only;
- small bundle.

Cons:

- high implementation risk;
- must write and maintain custom offset search / roundtrip logic;
- ambiguous and nonexistent times are easy to mishandle;
- historical browser/ICU differences still remain;
- harder to audit than a known library.

Privacy:

- good if local-only.

Accuracy risk:

- medium to high.

Bundle impact:

- none.

Implementation complexity:

- high if done safely.

Testability:

- possible, but requires many edge fixtures.

Recommendation:

- do not choose as first path.

### B. `luxon`

Pros:

- one dependency;
- local-only;
- readable API;
- browser/PWA compatible for modern targets;
- IANA timezone validation and zone-aware `DateTime` objects;
- can be wrapped with fail-closed checks.

Cons:

- relies on host Intl timezone data;
- ambiguous / nonexistent times still require explicit wrapper policy;
- dependency approval needed.

Privacy:

- good.

Accuracy risk:

- low to medium if tests pass; host tzdb differences remain.

Bundle impact:

- needs measurement after install, but expected to be lighter than moment-timezone with full data.

Implementation complexity:

- medium.

Testability:

- good.

Recommendation:

- recommended first implementation candidate.

### C. `date-fns-tz`

Pros:

- local-only;
- uses Intl, no embedded timezone data;
- direct `fromZonedTime()` helper.

Cons:

- requires `date-fns` peer dependency;
- returns plain `Date`, increasing accidental host-timezone risk;
- ambiguity policy needs extra wrapper/testing.

Privacy:

- good.

Accuracy risk:

- medium, similar host Intl caveat.

Bundle impact:

- likely small if tree-shaken, but two-package install must be measured.

Implementation complexity:

- medium.

Testability:

- good with wrapper.

Recommendation:

- viable fallback, not first choice.

### D. `moment-timezone`

Pros:

- embedded timezone database;
- explicit docs for DST gaps and duplicated hours;
- can be robust for historical offsets if full data is bundled.

Cons:

- legacy / maintenance-mode Moment stack;
- larger bundle;
- mutable API;
- reduced data bundles may be insufficient for birth dates outside their range.

Privacy:

- good if bundled locally.

Accuracy risk:

- low if full data is used and fixtures pass.

Bundle impact:

- high.

Implementation complexity:

- medium, but long-term architecture fit is weaker.

Testability:

- good.

Recommendation:

- keep as fallback if host-Intl timezone data is rejected.

### E. Temporal polyfill

Pros:

- best API semantics for wall-clock time + IANA zone + explicit disambiguation;
- clear fail-closed policy with `disambiguation: "reject"`;
- aligns with JavaScript's future direction.

Cons:

- native Temporal is not baseline;
- polyfill adds dependency and bundle impact;
- integration and Safari PWA behavior need measurement.

Privacy:

- good.

Accuracy risk:

- low to medium, depending on polyfill timezone data behavior and host Intl.

Bundle impact:

- needs measurement; likely higher than Luxon.

Implementation complexity:

- medium.

Testability:

- excellent.

Recommendation:

- strong future candidate, but not the first Sprint 7 path unless the user explicitly prefers Temporal.

### F. Keep blocked until later

Pros:

- no risk of wrong UTC;
- no dependency.

Cons:

- Task 7.4 stays blocked;
- user-facing natal planets cannot ship.

Privacy:

- safest.

Accuracy risk:

- none because no calculation is shown.

Bundle impact:

- none.

Implementation complexity:

- none.

Testability:

- no conversion tests yet.

Recommendation:

- acceptable fallback if dependency approval is not granted.

## Recommended Path

Recommended path:

1. Choose `luxon` as the first implementation candidate for Task 7.4b.
2. Do not install it until the user explicitly approves the dependency.
3. Keep the conversion isolated inside `src/birthDateTime.js` or a small helper used by it.
4. Keep profile storage unchanged.
5. Convert only when:
   - `birthDate` is valid;
   - known `birthTime` is valid;
   - `birthPlace.timezone` is a valid IANA timezone;
   - local time is not detected as ambiguous or nonexistent, or an explicit policy is approved.
6. Return `utcDateTime` only after conversion passes tests.
7. Keep houses / ASC / MC / transits / aspects / orbs unsupported.
8. Keep natal planet UI hidden until Task 7.4b tests pass and Task 7.4 is explicitly started.

Proposed implementation policy for Task 7.4b:

- `birthTimeAccuracy: "unknown"` keeps `utcDateTime: null`.
- `birthTimeAccuracy: "approximate"` can produce UTC only with a warning that positions are approximate, if the user approves this behavior.
- ambiguous local times should return `status: "incomplete"` or a dedicated warning rather than silently choosing earlier/later.
- nonexistent local times should return `status: "incomplete"` with a clear warning.
- no conversion should use `currentPlace.timezone`.
- no conversion should use the device timezone.

Features this can unlock after implementation and tests:

- provider-ready UTC input for natal planet positions;
- future Task 7.4 read-only planet panel for profiles with complete date/time/timezone readiness;
- no houses / ASC / MC / transits yet.

Features still blocked:

- unknown birth time planet display;
- houses;
- ASC / MC;
- personal transits;
- natal aspects;
- orbs;
- natal chart wheel;
- personal ritual scoring.

## Dependency Approval Needed

Dependency approval is needed.

Do not install this dependency until the user explicitly approves it.

Recommended approval target:

```txt
luxon
```

Preliminary version candidate:

```txt
luxon@3.7.2
```

The approval payload must include:

- package name;
- exact version;
- official source;
- license;
- privacy behavior;
- browser/PWA compatibility;
- bundle impact after install;
- ambiguous / nonexistent local-time policy;
- fixture/test plan;
- rollback plan.

Approval question for the next step should be explicit, for example:

```txt
Approval required before installation. Do you approve installing luxon as a local-only birth timezone conversion dependency for Task 7.4b?
```

## Future Test Plan

Task 7.4b should add tests for:

- valid modern conversion with `Europe/Moscow`;
- historical `Europe/Moscow` date;
- a DST-observing timezone modern date;
- a historical timezone date;
- Moon-sensitive birth time fixture;
- ambiguous local time, for example a fall-back DST hour;
- nonexistent local time, for example a spring-forward DST gap;
- invalid timezone;
- missing timezone;
- unknown birth time;
- approximate birth time warning behavior;
- coordinates missing while natal planets can still be date/time-ready;
- no use of `currentPlace.timezone` as fallback;
- no use of device timezone;
- `utcDateTime` is ISO UTC with `Z`;
- `canConvertToUtc: true` only after safe conversion;
- debug does not show raw birth data;
- UI does not show natal planet values until Task 7.4 is explicitly started;
- no houses / ASC / MC / transits / aspects / orbs.

Manual / environment checks later:

- iPhone Safari smoke test;
- installed PWA smoke test;
- bundle-size check after dependency install;
- `npm audit --omit=dev`;
- fixture comparison against provider output after UTC conversion path exists.

## What Remains Blocked

Until Task 7.4b is approved, implemented, and tested:

- user-facing natal planet values remain hidden;
- Task 7.4 — Read-only Natal Planets Panel remains blocked;
- `src/birthDateTime.js` should keep `canConvertToUtc: false`;
- `utcDateTime` should remain `null`;
- provider values must not be shown for active profiles.

Still out of scope even after UTC conversion:

- houses;
- ASC / MC;
- personal transits;
- natal aspects;
- orbs;
- natal chart UI;
- personal ritual scoring;
- geocoding;
- backend / cloud sync.

## Decision Log

- Task 7.4a is documentation / research only.
- Native `Date` is rejected for arbitrary birth timezone conversion.
- Raw `Intl.DateTimeFormat` offset conversion is not recommended as the first path.
- Native `Temporal` is promising but not yet a baseline-only Sprint 7 dependency-free solution.
- `luxon` is the recommended first dependency candidate for Task 7.4b, pending explicit approval.
- `moment-timezone` remains a fallback if pinned timezone data becomes more important than bundle size.
- `date-fns-tz` remains a fallback if the project later chooses date-fns-style helpers.
- No dependency was installed in Task 7.4a.
- No code was changed in Task 7.4a.
- User-facing natal planets remain disabled.
