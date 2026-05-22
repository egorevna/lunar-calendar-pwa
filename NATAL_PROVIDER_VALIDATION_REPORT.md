# NATAL_PROVIDER_VALIDATION_REPORT.md

## Purpose

This report records the provider-layer validation status for the approved local natal provider candidate.

Original scope note:

The validation report itself did not enable user-facing natal values. Sprint 7 later enabled a narrow read-only `Мои карты` planet panel only after safe UTC readiness was implemented and tested.

## Provider

- `astronomy-engine@2.1.19`
- Usage: local-only provider layer.
- User-facing natal values: enabled only through the Sprint 7 read-only `Мои карты` panel when profile UTC readiness succeeds.
- Natal chart UI: disabled.

## Reference Source

- Reference source: local swisseph dev dependency.
- Usage: test-only Node reference.
- Production import: swisseph is not imported in production `src/`.
- Longitude validation flags: `SEFLG_SWIEPH`, no sidereal, no topocentric, no true-position, no J2000.
- Speed validation flags: `SEFLG_SWIEPH | SEFLG_SPEED`, no sidereal, no topocentric, no true-position, no J2000.

## Validated Features

- Geocentric tropical longitudes for 10 natal planets.
- Longitude speed for 10 natal planets.
- Retrograde status derived from validated speed sign.

Validated bodies:

- sun
- moon
- mercury
- venus
- mars
- jupiter
- saturn
- uranus
- neptune
- pluto

## Fixtures Used

UTC fixtures:

- `2000-01-01T12:00:00.000Z`
- `1900-06-15T00:00:00.000Z`
- `2026-05-15T10:33:00.000Z`
- `1985-11-03T06:30:00.000Z`
- `2026-03-02T12:00:00.000Z`
- `2025-03-04T12:00:00.000Z`

The last two fixtures are Mercury / Venus retrograde-sensitive checks.

## Tolerances

- Longitude, Sun and planets: `0.25°`.
- Longitude, Moon: `0.5°`.
- Speed, Sun and planets: `0.02°/day`.
- Speed, Moon: `0.05°/day`.

## Results Summary

- Longitude validation: passed.
- Speed validation: passed.
- Retrograde validation: passed.
- Max longitude delta Sun / planets: `0.003180°`.
- Max longitude delta Moon: `0.000294°`.
- Max speed delta Sun / planets: `0.000288°/day`.
- Max speed delta Moon: `0.000148°/day`.

## Still Not Supported

- houses
- ASC / MC
- personal transits
- natal aspects
- orbs
- natal chart UI
- personal ritual scoring
- local birth timezone conversion

## Privacy

- No private user data is used as fixtures.
- No profile data is used as fixtures.
- No birth data is sent externally.
- The provider is local-only in the provider layer.
- The swisseph reference is test-only.
- Provider output is user-facing only in the narrow Sprint 7 read-only `Мои карты` planet panel after safe UTC readiness succeeds.
- Raw provider output, raw longitudes and raw speeds are not shown in the UI.
- No full profile JSON is used in validation.

## Decision

The provider is validated for provider-layer natal planet longitude, speed and retrograde calculations.

Sprint 7 uses it only for the read-only natal planet list inside `Мои карты`, guarded by the UTC readiness helper and `natalPlanetDisplay` formatting.

## Next Steps

- Sprint 7 hardening.
- Houses, ASC / MC, natal aspects, orbs and personal transits require separate strategy and validation.
