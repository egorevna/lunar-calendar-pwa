# SPRINT_3_PLAN.md

# Astro PWA — Sprint 3 Plan

## Sprint 3 Name

Profiles / Мои карты

## Sprint 3 Goal

After Sprint 1 and Sprint 2, the app can show the general moment, modes, recommendations, and best windows.

Sprint 3 adds the foundation for personalization:

> The user can create several profiles / cards and choose an active profile.

Important:

Sprint 3 does NOT build a natal chart and does NOT calculate personal transits.

Sprint 3 prepares the safe foundation:

- profile data model;
- local storage;
- section / panel “Мои карты”;
- create / edit / delete profile;
- active profile;
- privacy-first rules;
- export / import as basic data protection.

---

## Product Principle

Before Sprint 3, the app answers:

> “What is the current moment in general?”

After Sprint 3, the app should also know:

> “For whom are we looking at this moment?”

But it should not yet answer:

> “What does this day mean personally in the natal chart?”

That belongs to a later sprint.

---

## Sprint 3 Scope

### In Scope

- profile domain model;
- validation for birth data;
- local profile storage;
- profile list;
- create profile;
- edit profile;
- delete profile;
- active profile selector;
- “Общий день” as default non-personal mode;
- local-first privacy copy;
- import/export profile JSON;
- safe debug visibility for active profile state.

### Out of Scope

Do not implement yet:

- natal chart wheel;
- house calculation;
- Ascendant / MC;
- personal transits;
- Moon in natal houses;
- personal ritual scoring;
- active profile recommendations;
- synastry;
- cloud sync;
- backend;
- account system;
- geocoding API;
- automatic location permission;
- payment;
- push notifications.

---

## Profile Fields

Each profile should eventually support:

- `id`
- `name`
- `birthDate`
- `birthTime`
- `birthTimeAccuracy`
- `birthPlace`
- `currentPlace`
- `houseSystem`
- `zodiac`
- `createdAt`
- `updatedAt`

### Birth Time Accuracy

Allowed values:

- `exact`
- `approximate`
- `unknown`

User-facing labels:

- точное
- примерно
- неизвестно

### Birth Place

Fields:

- city
- country
- latitude
- longitude
- timezone

In Sprint 3, coordinates may be manually stored or optional.

Do not add external geocoding API unless explicitly requested.

### Current Calculation Place

Fields:

- city
- country
- latitude
- longitude
- timezone
- mode

Allowed current place mode:

- `moscow`
- `custom`
- `currentDevice` later, not now unless explicitly requested

For Sprint 3, default should stay Moscow to avoid breaking existing calculations.

### House System

Allowed values:

- `wholeSign`
- `placidus`
- `equal`

Default:

- `wholeSign`

### Zodiac

Allowed values:

- `tropical`

Future optional:

- `sidereal`

Do not implement sidereal calculations in Sprint 3.

---

## Privacy Principle

Birth data is sensitive.

Sprint 3 must be local-first:

- profiles are stored locally on the device;
- no server upload;
- no cloud sync;
- no analytics events with birth data;
- no external geocoding request unless explicitly added later;
- user can delete profile;
- user can export profile JSON;
- user can import profile JSON.

Show clear copy:

```txt
Данные карты хранятся только на этом устройстве.
```

---

## Active Profile Concept

Main screen should support:

```txt
Профиль: Общий день / Анна / Егор
```

Default:

- `Общий день`

If `Общий день` is active:

- app behaves as now;
- no personal blocks are shown.

If a profile is active:

- show active name;
- do not calculate personal transits yet;
- future sprint will use this active profile.

---

## Sprint 3 Deliverable

Sprint 3 is complete when:

- user can create profiles;
- user can edit profiles;
- user can delete profiles;
- profiles persist locally;
- user can choose active profile;
- default general mode still works;
- profile data can be exported/imported;
- privacy text is visible;
- tests cover model/storage/UI basics;
- no personal transits or natal chart are implemented.
