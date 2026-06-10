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

Arabic Parts debug must show status/counts/capabilities only. It may show active/deferred formula keys and day/night chart label, but must not expose raw birth data, UTC, raw timezone values, raw coordinates, raw planet/lots/cusp longitudes, formula operand arrays, provider payloads, full profile JSON, or full parts/assignments/cusps arrays.

Special Points debug must show status/readiness/source statuses/counts/capabilities only. It may show active profile id/name, active/deferred source keys, Selena point type and privacy flags, but must not expose raw birth data, UTC, raw timezone values, raw coordinates, raw point/cusp longitudes, provider payloads, full profile JSON, or full points/assignments/cusps arrays.

Fixed Stars debug must show catalog/policy/pipeline statuses, counts and guardrails only. It must not expose raw birth data, UTC, raw timezone values, coordinates, provider payloads, full profile JSON, full catalog/target/position/conjunction arrays, raw hit rows, or interpretations.

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

---

# Sprint 6 Provider Privacy Rules

Sprint 6 evaluates real natal provider options, but the default privacy model remains local-first.

## Provider Privacy Rule

A natal provider must not send birth data externally unless a separate server/cloud sprint is explicitly approved.

Sprint 6 default:

- local provider only;
- no backend;
- no remote ephemeris service;
- no geocoding API;
- no analytics with birth data;
- no network calls with birth date, birth time, place, coordinates or timezone.

## Dependency Review Rule

Before adding a provider dependency, review and document:

- whether it makes network calls;
- whether it requires server components;
- license;
- bundle size;
- browser/PWA compatibility;
- supported and unsupported calculation features.

Adding a provider dependency requires separate user approval.

## Fixture Privacy Rule

Do not use private user profiles as public fixtures.

Use public, documented, or synthetic fixtures. Fixture data must not be copied from real app users unless the user explicitly asks for a private local-only check.

## Debug Privacy Rule

Provider and fixture debug may show:

- provider status;
- capability flags;
- fixture count;
- pass/fail state;
- unsupported feature labels.

Debug must not show:

- raw birth date;
- raw birth time;
- raw birth place;
- coordinates;
- full profile JSON;
- private profile arrays.

---

# Sprint 7 Privacy Rules Addendum

Sprint 7 may prepare a user-facing read-only natal planets layer. Natal planet UI must not expose raw birth data.

## Natal Planets UI Privacy

Do not show:

- birthDate;
- birthTime;
- raw birthPlace;
- raw currentPlace;
- coordinates;
- full profile JSON.

Show only calculated planet positions if readiness is confirmed.

## Debug Privacy

Debug can show:

- provider status;
- planet count;
- validation status;
- user-facing enabled / disabled.

Debug must not dump full birth data.

---

# Sprint 8 Privacy Rules Addendum

Sprint 8 natal aspects are derived from already calculated natal planet positions.

## Natal Aspects Privacy

Do not show raw sensitive profile data in natal aspect UI or debug:

- birthDate;
- birthTime;
- utcDateTime;
- raw timezone;
- raw birthPlace;
- raw currentPlace;
- coordinates;
- full profile JSON.

Allowed user-facing natal aspect data:

- planet names;
- aspect type;
- orb;
- optional strength / priority only if it is calculated and documented.

## Debug Privacy

Debug may show:

- aspect count;
- enabled / disabled state;
- orb model name;
- supported aspect set;
- unsupported feature labels.

Debug must not dump full profile data, raw birth data, raw planet longitude values, raw speed values, houses, ASC / MC values, transits, aspects to unsupported points, or private fixture data.

---

# Sprint 9 Privacy Rules Addendum

Sprint 9 essential dignities are derived from natal planet sign placement.

## Essential Dignities Privacy

Do not show in essential dignities UI or debug:

- birthDate;
- birthTime;
- utcDateTime;
- raw timezone;
- raw birthPlace;
- raw currentPlace;
- coordinates;
- full profile JSON;
- raw longitude values.

Allowed user-facing essential dignity data:

- planet names;
- sign names;
- dignity / debility labels;
- optional score category, only if documented and calculated.

Debug may show:

- dignity engine status;
- rule source;
- count of dignity / debility flags;
- unsupported feature labels.

Debug must not dump full profile data.

---

# Sprint 10 Privacy Rules Addendum

Sprint 10 detailed dignities are derived from natal planet sign and degree placement.

## Detailed Dignities Privacy

Do not show in terms, decans or degree ruler UI/debug:

- birthDate;
- birthTime;
- utcDateTime;
- raw timezone;
- raw birthPlace;
- raw currentPlace;
- coordinates;
- full profile JSON;
- raw longitude values.

Allowed user-facing detailed dignity data:

- planet name;
- sign name;
- degree-derived lookup label;
- source system;
- verified ruler / term / decan / degree ruler label.

Debug may show:

- layer status;
- source system;
- verification status;
- row count;
- unsupported / deferred feature labels.

Debug must not dump:

- full profile data;
- private birth data;
- raw planet longitudes;
- full unverified table data;
- OCR-only rows.

---

# Sprint 11 Privacy Rules Addendum

Sprint 11 Houses / ASC / MC may require birth place coordinates. These coordinates are sensitive profile data and remain local-first.

Manual birth place coordinates may appear in the profile edit/create form so the user can enter or correct them. They must not be shown in calculated Houses / ASC / MC user-facing output, debug raw dumps, provider payloads, or full profile JSON displays.

Do not send birth place text, timezone or coordinates to external geocoding APIs. Do not request browser location permission, infer coordinates from timezone/country/city, or auto-fill hardcoded city coordinates.

Houses / ASC / MC debug may show only safe status/counts/capabilities:

- active profile id/name;
- readiness booleans such as exact-time / coordinates / timezone present;
- selected house system and selection source;
- counts for angles, houses and planet assignments;
- privacy flags.

It must not expose raw birth date, birth time, UTC datetime, timezone value, raw birth place object, latitude, longitude, coordinates, raw planet/cusp longitudes, full houses/cusps/assignments arrays, provider payloads, swisseph payloads or full profile JSON.
