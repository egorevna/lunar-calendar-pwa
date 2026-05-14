# Astro PWA — Privacy Rules

## Core Principle

Birth data is private.

The app must be local-first by default.

Do not send birth data, natal data, or personal transit data to any server without explicit user consent.

## Sensitive Data

The following data is sensitive:

- Name.
- Birth date.
- Birth time.
- Birth time accuracy.
- Birth city.
- Birth country.
- Birth coordinates.
- Birth timezone.
- Current location.
- Current calculation place.
- Natal chart placements.
- House cusps.
- Personal transits.
- Personal ritual recommendations.

## Default Storage

Default behavior:

- Store profiles locally on the device.
- Store active profile locally.
- Store calculation location preference locally.
- Store house system and zodiac settings locally.

## Server Rule

No profile data should be sent to a server unless:

1. The user explicitly enables sync or cloud backup.
2. The app clearly explains what will be sent.
3. The user confirms consent.

## Profile Actions

The app should support:

- Create profile.
- Edit profile.
- Delete profile.
- Export profile.
- Import profile.
- Backup profiles.

## Delete Profile Rule

Profile deletion must require confirmation.

Confirmation copy:

`Вы точно хотите удалить профиль? Это действие нельзя отменить.`

If the deleted profile was active, switch active profile to:

`Общий день`

## Export Rule

Profile export should include only the selected profile unless user chooses full backup.

Exported data may include:

- Name.
- Birth data.
- Birth place.
- Current calculation preferences.
- House system.
- Zodiac system.
- Optional points settings.

Do not include unrelated app state in a single-profile export.

## Import Rule

Profile import must validate data.

Handle:

- Invalid file.
- Missing required fields.
- Duplicate profile names.
- Unsupported schema version.

## Backup Rule

Full backup may include all profiles and settings.

Backup should have a clear schema version so future migrations are possible.

Example:

```json
{
  "schemaVersion": 1,
  "app": "Astro PWA",
  "exportType": "full-backup",
  "createdAt": "2026-05-11T00:00:00.000Z",
  "profiles": [],
  "settings": {}
}
```

## Debug Privacy

Debug screen must not accidentally expose sensitive data in screenshots unless the user opens it knowingly.

Avoid showing full birth data on debug screen unless needed.

If shown, keep it in developer-only context.

## Future Sync Rule

If cloud sync is ever added, it must include:

- explicit opt-in,
- clear privacy text,
- ability to disable sync,
- ability to delete cloud data,
- export before deletion if possible.

## Safe Fallbacks

If profile data is missing, show:

- `Добавьте профиль, чтобы увидеть личные транзиты.`
- `Укажите время рождения, чтобы рассчитать дома.`
- `Укажите место рождения, чтобы построить натальную карту.`

Never invent birth data.

---

# Sprint 3 Privacy Rules

Sprint 3 introduces local profile management. Profile data is sensitive and must remain local-first.

Profile data includes:

- name;
- birth date;
- birth time;
- birth time accuracy;
- birth place;
- coordinates;
- timezone;
- current calculation place;
- house system;
- zodiac settings.

## Local-First Rule

Default behavior:

- store profiles only on the local device;
- do not send profile data to any server;
- do not add cloud sync;
- do not add analytics around birth data;
- do not call external geocoding APIs unless explicitly requested later.

## Required User-Facing Copy

In profile UI, show:

```txt
Данные хранятся на этом устройстве и не отправляются на сервер.
```

Optional longer copy:

```txt
Мы не отправляем дату, время и место рождения на сервер. Данные можно удалить, экспортировать или перенести вручную.
```

## External Geocoding Rule

Do not use external geocoding APIs in Sprint 3 unless the user explicitly asks for that task.

If geocoding is added later, it must clearly explain what location data is sent and require explicit consent.

## Deletion Rule

User must be able to delete a profile.

If deleting the active profile:

- reset active profile to `Общий день`.

## Export / Import Rule

Export should use JSON and include:

- schemaVersion;
- profiles;
- exportedAt.

Import must validate:

- JSON structure;
- required fields;
- allowed enum values.

Invalid import must not crash the app.

## Debug Safety For Profiles

Debug panel may show:

- activeProfileId;
- activeProfileName;
- profilesCount;
- storage type;
- sync disabled.
- serverUpload disabled;
- importExport enabled.

Debug panel must not dump full profile arrays or birth details.

Do not show in debug:

- birthDate;
- birthTime;
- birthPlace;
- latitude / longitude;
- birth timezone;
- currentPlace;
- houseSystem;
- zodiac.

---

# Sprint 4 Privacy Rules

Sprint 4 starts personal astrology readiness work. Birth data, profile data, natal data and personal calculation state remain sensitive.

## Personal Calculation Privacy

Do not send birth data or personal calculation data to:

- server;
- geocoding API;
- analytics;
- remote calculation service;
- cloud sync.

Do not add backend, cloud sync, external geocoding, or device location permission in Sprint 4.

## Debug Privacy

Debug may show:

- activeProfileId;
- activeProfileName;
- readiness status;
- missingFields;
- calculation capability.

Debug must not dump:

- full birthDate;
- full birthTime;
- birth coordinates;
- full birthPlace object;
- full currentPlace object;
- full profile JSON.

## Honesty Rule

If the app cannot calculate a personal result reliably, it must say so.

Do not display invented houses, ASC / MC, Moon in natal house, personal transit aspects, personal transit orbs, or personal ritual scoring.

---

# Sprint 5 Privacy Rules

Sprint 5 starts natal calculation engine foundation work. Natal calculation uses sensitive birth data.

## Natal Calculation Privacy

Do not send birth data to:

- server;
- remote ephemeris service;
- geocoding API;
- analytics;
- logs.

No backend, cloud sync, external geocoding or automatic location permission in Sprint 5.

## Dependency Rule

If a calculation dependency is added later, it must run locally and must not transmit user data.

Adding a dependency requires explicit approval.

## Debug Rule

Debug must not expose:

- full birth date;
- full birth time;
- coordinates;
- birth place object;
- full profile JSON.

Debug can show:

- capability status;
- provider name;
- missing-field labels;
- unsupported feature labels.

## Honesty Rule

Unsupported natal calculations must return explicit unsupported state instead of approximate or invented values.
