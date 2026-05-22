# NATAL_PLANETS_UI_STRATEGY.md

## Purpose

This document records the Task 7.1 readiness audit for showing read-only natal planet positions in Astro PWA.

Main rule:

Do not show natal planet values to users unless both calculation input readiness and provider output are reliable.

Sprint 7 may prepare UI and formatting, but it must not fake local birth time to UTC conversion.

Sprint 7 hardening update:

- `luxon@3.7.2` is now approved and used through the tracked vendored runtime `src/vendor/luxon.mjs`;
- `src/birthDateTime.js` can produce safe provider-ready UTC for valid birth date, known valid birth time and valid IANA birth timezone;
- user-facing natal planet values may now appear only inside `Мои карты` for an active saved profile when UTC readiness succeeds and the validated provider returns `ready`;
- unknown birth time, missing/invalid date/time/timezone, ambiguous DST overlap and nonexistent DST gap still fail closed and keep the planet list hidden.

## Current Provider Status

`astronomy-engine@2.1.19` is installed and isolated in the provider layer.

Current provider-layer status:

- package: `astronomy-engine@2.1.19`;
- usage: local-only provider layer;
- validated reference source: local `swisseph` dev dependency in tests;
- user-facing natal values: enabled only for the read-only `Мои карты` panel when safe UTC readiness and provider output are ready;
- natal chart UI: disabled.

Validated features:

- geocentric tropical ecliptic longitudes;
- longitude speed;
- retrograde status derived from validated speed sign.

Validated bodies:

- sun;
- moon;
- mercury;
- venus;
- mars;
- jupiter;
- saturn;
- uranus;
- neptune;
- pluto.

Still not supported:

- houses;
- ASC / MC;
- personal transits;
- natal aspects;
- orbs;
- natal chart UI;
- personal ritual scoring.

Important implementation note:

`src/astronomyEngineProvider.js` can calculate provider-layer planet positions from a valid UTC datetime. The ordinary `src/natalEngine.js` default path still returns `notSupported` through the default planetary provider path unless an explicit provider path is wired in a future task.

## Current Birth DateTime Readiness

Current profile data includes:

- birthDate;
- birthTime;
- birthTimeAccuracy;
- birthPlace city / country / timezone / coordinates;
- currentPlace;
- houseSystem;
- zodiac.

`src/birthDateTime.js` safely parses:

- local birth date;
- local birth time;
- IANA timezone string.

It also reports missing fields and limitations.

Current key behavior:

- `createBirthDateTimeInput(profile)` converts local birth date/time/timezone to UTC only through the approved Luxon wrapper.
- `canConvertToUtc` is `true` only when birth date is valid, known birth time is valid, timezone is valid, and conversion succeeds.
- `utcDateTime` is an ISO UTC string only on successful conversion.
- unknown birth time, missing/invalid date/time/timezone, ambiguous DST overlap and nonexistent DST gap return incomplete state and keep `utcDateTime: null`.
- missing coordinates are tracked for houses / ASC / MC readiness, but do not block geocentric natal planet positions.

The app must still fail closed rather than silently guessing an offset.

## Can Natal Planets Be User-Facing Now?

Yes, but only in the narrow Sprint 7 read-only scope.

Allowed user-facing path:

- active saved profile exists;
- `createBirthDateTimeInput(profile).canConvertToUtc === true`;
- `utcDateTime` is present;
- `calculateAstronomyEnginePlanetPositions({ utcDateTime, zodiac: "tropical" })` returns `ready`;
- display formatting goes through `src/natalPlanetDisplay.js`;
- output is shown only inside the `Мои карты` natal planets section.

Not allowed:

- showing values for `Общий день`;
- showing values when birth time is unknown;
- showing values when birth date, birth time or timezone is missing/invalid;
- showing values for ambiguous/nonexistent DST local times;
- showing raw longitude, raw speed, UTC datetime, timezone value, birth data or coordinates;
- showing houses, ASC / MC, transits, natal aspects, orbs, chart wheel or personal ritual scoring.

## UI Placement Options

### Option A — Inside `Мои карты` Profile Details

Pros:

- clearly profile-specific;
- keeps the main dashboard compact;
- privacy expectations are clearer because birth data already belongs to this area;
- good location for readiness status and future read-only planet list.

Cons:

- deeper interaction than the main dashboard;
- user may not notice the future natal section immediately.

Risk of dashboard overload:

- low.

Privacy implications:

- safest first location because it avoids putting natal values directly on the main moment dashboard.

### Option B — Under `Лично для меня`

Pros:

- visible when an active profile is selected;
- feels connected to personal context.

Cons:

- can overload the dashboard;
- can make general moment recommendations look like true natal/personal transits;
- higher risk that users read readiness text as a calculation result.

Risk of dashboard overload:

- medium to high.

Privacy implications:

- more sensitive because personal natal details would appear on the main screen.

### Option C — Separate Future Screen

Pros:

- best long-term space for natal details;
- can support more structure later.

Cons:

- requires new navigation / screen architecture;
- out of scope for Task 7.1;
- not needed for readiness-only copy.

Risk of dashboard overload:

- low.

Privacy implications:

- can be safe later, but requires explicit UI architecture decisions.

### Option D — Hidden / Readiness-Only Until UTC Strategy Is Solved

Pros:

- safest;
- no fake calculations;
- sets correct user expectation;
- allows Sprint 7 to prepare formatting and UI guardrails without exposing values.

Cons:

- no real natal planet values shown yet;
- feels less exciting, but it is honest.

Risk of dashboard overload:

- low.

Privacy implications:

- safest current path.

## Recommended First UI

Recommended first UI for Task 7.3:

- add a compact readiness-only natal planets area inside `Мои карты` / profile details;
- do not show planet values;
- do not place planet values under `Лично для меня` yet;
- keep the main dashboard focused on general moment + safe personal readiness copy;
- include limitation copy.

Recommended copy:

```txt
Натальные планеты пока недоступны.
Для точного расчета нужно подготовить дату, время и часовой пояс рождения.
Дома, ASC/MC и транзиты пока не рассчитываются.
```

If a profile is missing fields, show human missing-field labels only, for example:

```txt
Нужно уточнить: время рождения, часовой пояс места рождения.
```

Do not show technical keys such as `birthPlace.timezone` in the UI.

Task 7.4 update:

- the implemented read-only planet panel lives inside `Мои карты`;
- the ready state is collapsible by default and shows a compact summary before the full list;
- fallback/readiness copy remains visible when the profile is not ready.

## What Can Be Shown Now

Safe to show:

- provider validation status;
- readiness status;
- missing field labels;
- short limitation copy;
- statement that houses, ASC / MC and transits are not calculated;
- formatted natal planet label / sign / degree-minute text when safe UTC readiness and provider output are ready;
- retrograde `R` marker when provider output marks a planet retrograde;
- user-facing enabled / disabled state in debug;
- provider name/version in debug;
- planet count in debug, if no planet values are dumped.

Safe copy examples:

```txt
Натальные планеты пока недоступны.
```

```txt
Для точного расчета нужно подготовить дату, время и часовой пояс рождения.
```

```txt
Дома, ASC/MC и транзиты пока не рассчитываются.
```

## What Must Remain Hidden

Do not show:

- houses;
- ASC;
- MC;
- personal transits;
- natal aspects;
- orbs;
- chart wheel;
- personal ritual scoring based on natal;
- raw birth data;
- full profile JSON;
- coordinates;
- raw birthPlace object;
- raw currentPlace object;
- debug/test UTC fixture planet values as if they belong to the active user.

## Blockers Before Real Planet Display

Before any broader natal display can be shown, the project still needs:

- explicit approval for any location outside `Мои карты`;
- UI hardening for larger natal sections;
- separate strategy and validation for natal aspects;
- separate strategy and validation for houses / ASC / MC;
- separate strategy and validation for personal transits;
- tests proving unsupported features remain hidden.

Current blocker for the planet panel:

- no blocker when the profile has valid date, known valid time, valid timezone and successful UTC conversion;
- incomplete profiles still keep the readiness fallback.

## Recommended Task 7 Flow

Task 7.2 should create a pure natal planet formatting helper.

- It may format already-calculated provider positions.
- It must not call the provider.
- It must not convert birth time.
- It must not add UI.

Task 7.3 should add readiness-only UI.

- It should explain why natal planets are unavailable.
- It should show missing-field labels if useful.
- It should include limitation copy for houses, ASC / MC and transits.
- It must not show planet values unless UTC readiness has been solved in a separate explicit task.

Task 7.4 was unblocked after Task 7.4b solved UTC readiness for valid inputs.

- It should show actual planet positions only if provider-ready UTC input exists and provider output is ready.
- It must not show houses, ASC / MC, transits, aspects or orbs.

Task 7.5 may add safe debug.

- Debug can show provider status, validation status and planet count.
- Debug must not dump raw birth data or active-profile planet values.

Task 7.6 should harden Sprint 7.

- Confirm no fake natal values.
- Confirm unsupported features remain hidden.
- Confirm privacy guardrails.

## Decisions

- User-facing natal planets are allowed only for active saved profiles with safe UTC readiness and ready provider output.
- Provider-layer validation plus safe UTC readiness is sufficient for the Sprint 7 read-only planet list.
- Incomplete profiles keep readiness-only fallback.
- Preferred first placement is inside `Мои карты` / profile details, not the top of the main dashboard.
- `Лично для меня` should not receive real planet values until UTC readiness and UI scope are explicitly approved.
- Houses, ASC / MC, transits, natal aspects, orbs, chart wheel and personal ritual scoring remain out of scope.
