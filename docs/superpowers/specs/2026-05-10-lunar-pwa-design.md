# Lunar PWA Design

## Goal

Build an installable iPhone PWA for Moscow that shows the current date, live time, lunar day, Moon phase, Moon void-of-course status, planetary weekday ruler, and current planetary hour on the home screen.

## First Release Scope

- One polished home screen matching the user's supplied reference: starry deep-blue background, gold accents, large live clock, large Moon, glass panels, and bottom navigation.
- Moscow is the fixed location for sunrise, sunset, lunar, and planetary-hour calculations.
- The app runs offline after installation.
- Bottom navigation includes future sections: Home, Calendar, Planets, Knowledge, Settings. Only Home is active in this release.

## Calculation Scope

- Date/time are displayed in `Europe/Moscow`.
- Lunar phase and illumination use a deterministic synodic-month calculation.
- Lunar day is derived from Moon age as a practical first-release approximation.
- Planetary day follows the classical weekday rulers.
- Planetary hour uses Moscow sunrise/sunset and the Chaldean sequence, with day/night hours split into 12 unequal parts.
- Moon void-of-course is computed locally as the period after the Moon's last major aspect before the next zodiac sign ingress. The first release uses an approximate low-precision ephemeris suitable for an offline PWA and marks the result as Moscow-based.

## Interface

- Header: iOS-style safe area, menu icon, title `Лунный календарь`, favorite star.
- Main: date, weekday, live time, large Moon image/visual, lunar day, Moon phase.
- Data panels:
  - `Луна без курса` with active or nearest interval.
  - `Планетарный день` with planetary glyph and name.
  - `Планетарный час` with glyph, name, time range, and `текущий час`.
- Navigation: fixed glass bottom bar with five sections.

## Quality

- Layout must fit iPhone viewport without broken text or shifted time ranges.
- Tests cover the calculation engine: planetary day, planetary hour, lunar phase range, and void-of-course shape.
- PWA metadata and service worker are included so Safari can add it to the iPhone home screen.
