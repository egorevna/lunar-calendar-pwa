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
