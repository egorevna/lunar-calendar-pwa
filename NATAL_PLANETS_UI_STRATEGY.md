# NATAL_PLANETS_UI_STRATEGY.md

## Purpose

This document records the Task 7.1 readiness audit for showing read-only natal planet positions in Astro PWA.

Main rule:

Do not show natal planet values to users unless both calculation input readiness and provider output are reliable.

Sprint 7 may prepare UI and formatting, but it must not fake local birth time to UTC conversion.

## Current Provider Status

`astronomy-engine@2.1.19` is installed and isolated in the provider layer.

Current provider-layer status:

- package: `astronomy-engine@2.1.19`;
- usage: local-only provider layer;
- validated reference source: local `swisseph` dev dependency in tests;
- user-facing natal values: disabled;
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
- personal ritual scoring;
- local birth timezone conversion.

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

- `createBirthDateTimeInput(profile)` does not convert local birth time to UTC.
- `canConvertToUtc` is always `false`.
- `utcDateTime` is always `null`.
- when date, time and timezone are present, the helper returns a limitation: `Точная конвертация времени рождения в UTC требует надежной timezone-стратегии.`

This is intentional. Without a reliable historical timezone strategy, the app must not silently convert local birth time to UTC for arbitrary birth dates.

## Can Natal Planets Be User-Facing Now?

No, not for ordinary saved profiles.

Reason:

- natal planet provider output requires provider-ready UTC input;
- profile data currently stores local birth date/time/timezone;
- the current birth date/time helper does not produce safe UTC;
- `canConvertToUtc` remains `false`;
- `utcDateTime` remains `null`.

The provider can calculate from test/debug UTC input, but that is not a safe user-facing profile path.

Therefore:

- real natal planet values for an active profile must remain hidden;
- no fake planet values may be shown;
- no local date/time/timezone conversion should be guessed;
- Task 7.4 must remain blocked until UTC readiness is solved.

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

## What Can Be Shown Now

Safe to show:

- provider validation status;
- readiness status;
- missing field labels;
- short limitation copy;
- statement that houses, ASC / MC and transits are not calculated;
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

Before real user-facing natal planet values can be shown, the project needs:

- a reliable local birth time to UTC conversion strategy;
- clear handling for historical timezone rules;
- provider-ready UTC input from profile data;
- tests proving profile input can safely reach the provider;
- UI tests that prevent raw birth data and unsupported features from appearing;
- a decision on whether planet values live in `Мои карты`, `Лично для меня`, or a later dedicated screen.

Current blocker:

`src/birthDateTime.js` intentionally returns:

```txt
canConvertToUtc: false
utcDateTime: null
```

So ordinary saved profiles cannot safely produce user-facing natal planet values yet.

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

Task 7.4 should remain blocked until UTC readiness is solved.

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

- User-facing natal planets for ordinary profiles are not allowed yet.
- Provider-layer validation is sufficient for future planet calculation, but not sufficient for user-facing profile display without UTC readiness.
- First UI should be readiness-only.
- Preferred first placement is inside `Мои карты` / profile details, not the top of the main dashboard.
- `Лично для меня` should not receive real planet values until UTC readiness and UI scope are explicitly approved.
- Houses, ASC / MC, transits, natal aspects, orbs, chart wheel and personal ritual scoring remain out of scope.
