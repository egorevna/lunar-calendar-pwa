# SPRINT_3_TASKS.md

# Astro PWA — Sprint 3 Tasks

## Current Sprint

Sprint 3 — Profiles / Мои карты

## Important Boundary

Do not implement natal chart, personal transits, houses, Ascendant, MC, personal ritual scoring, cloud sync, backend, or geocoding API in Sprint 3.

---

# Task 3.1 — Add Profile Data Model

Status: not started

## Goal

Create the profile data model and validation helpers.

## Required Fields

- id
- name
- birthDate
- birthTime
- birthTimeAccuracy
- birthPlace
- currentPlace
- houseSystem
- zodiac
- createdAt
- updatedAt

## Required Helpers

Create a small helper module, likely:

```txt
src/profileModel.js
```

Functions may include:

- createProfileDraft()
- normalizeProfile(input)
- validateProfile(profile)
- isValidProfile(profile)
- createProfileId()
- getDefaultProfileSettings()

## Acceptance Criteria

- Profile model exists.
- Validation covers required fields.
- Defaults are safe.
- No storage yet.
- No UI yet.
- No natal chart.
- Tests pass.

---

# Task 3.2 — Add Local Profile Storage

Status: not started

## Goal

Store profiles locally on device.

Use localStorage unless there is a strong reason for IndexedDB.

Do not add dependencies.

Required functions:

- loadProfiles()
- saveProfiles(profiles)
- addProfile(profile)
- updateProfile(profileId, patch)
- deleteProfile(profileId)
- getActiveProfileId()
- setActiveProfileId(profileId or null)

## Acceptance Criteria

- Profiles persist after reload.
- Active profile persists after reload.
- Deleting active profile resets active profile to `Общий день`.
- Corrupted storage does not crash app.
- Tests pass.

---

# Task 3.3 — Add Profiles UI Shell / “Мои карты”

Status: not started

## Goal

Add a minimal UI shell for managing profiles.

Possible UX:

- compact card on dashboard:
  - `Профиль`
  - `Общий день`
  - `Мои карты`

Or a hidden/inline section:

- `Мои карты`
- profile list
- `+ Добавить профиль`

No new navigation bar.

No full natal chart screen.

## Acceptance Criteria

- User can open a profiles panel/section.
- User sees existing profiles.
- User sees “Общий день”.
- UI says data is stored locally.
- No natal chart calculations.
- Tests pass.

---

# Task 3.4 — Create Profile Form

Status: not started

## Goal

Allow user to create a profile.

Fields:

- name
- birth date
- birth time
- birth time accuracy
- birth city
- birth country
- current calculation place mode
- house system
- zodiac

Defaults:

- birthTimeAccuracy: exact
- current calculation place: Moscow
- houseSystem: Whole Sign
- zodiac: tropical

## Acceptance Criteria

- User can create profile.
- Profile appears in list.
- Profile persists after reload.
- Validation prevents empty name / invalid date.
- No external API calls.
- Tests pass.

---

# Task 3.5 — Edit / Delete Profile

Status: not started

## Goal

Allow user to edit and delete profiles.

## Acceptance Criteria

- User can edit profile fields.
- User can delete profile.
- Deleting profile requires confirmation.
- Deleting active profile switches app to `Общий день`.
- Tests pass.

---

# Task 3.6 — Active Profile Selector

Status: not started

## Goal

Add active profile selector to main dashboard.

UX:

```txt
Профиль
Общий день / Анна / Егор
```

Requirements:

- Default is `Общий день`.
- Selecting profile persists.
- Main app calculations remain general for now.
- No personal transits yet.
- No natal chart yet.

## Acceptance Criteria

- User can select active profile.
- Active profile name is visible.
- Active profile persists after reload.
- Selecting `Общий день` returns to non-personal mode.
- Tests pass.

---

# Task 3.7 — Profile Export / Import

Status: not started

## Goal

Allow export/import of profile data as JSON.

## Export

- export one profile or all profiles;
- JSON should not include unknown internal junk;
- include schemaVersion.

## Import

- validate JSON;
- reject invalid data safely;
- avoid duplicate IDs or regenerate IDs if needed.

## Acceptance Criteria

- User can export profile JSON.
- User can import valid JSON.
- Invalid JSON does not crash app.
- Imported profile appears in list.
- Tests pass.

---

# Task 3.8 — Privacy Copy and Debug Profile State

Status: not started

## Goal

Make privacy behavior explicit.

Add user-facing copy:

```txt
Данные карты хранятся только на этом устройстве.
```

Add safe debug output under `?debug=1`:

- activeProfileId;
- activeProfileName;
- profilesCount;
- storage: localStorage;
- sync: disabled.

Do not show full birth details in debug unless necessary.

## Acceptance Criteria

- Privacy text visible in profiles UI.
- Debug panel shows profile state without exposing full sensitive data.
- Tests pass.

---

# Sprint 3 Completion Criteria

Sprint 3 is complete when:

- profile data model exists;
- local storage works;
- user can create/edit/delete profiles;
- user can select active profile;
- export/import works;
- privacy copy is visible;
- debug shows profile state safely;
- no natal chart or personal transits are implemented.
