# Astro PWA — Master Plan

## Product Vision

Astro PWA is an astrology and ritual calendar application. The app should not only answer the question:

> “What kind of day is today?”

It should answer:

> “What does this moment mean personally for the selected person?”

The main screen should be a practical moment dashboard for Tarot, candles, rituals, forecasts, money work, relationship work, cleansing practices, and choosing the right time for action.

## Main Product Principle

The main screen must not show all available data at once.

The main screen should answer five questions in this order:

1. What is happening now?
2. Can the user act now?
3. What is this moment good for?
4. What should the user avoid?
5. When is the best window today?

All deeper details must be hidden behind taps, expandable blocks, modes, profile screens, natal chart screens, or debug screens.

## Development Strategy

Development must happen in small, safe, testable tasks.

Rules:

- One task at a time.
- One logical feature per commit.
- No large rewrites unless explicitly required.
- Do not mix UI changes, astrology calculations, profile storage, and natal chart logic in the same task.
- Every task must have acceptance criteria.
- Every task must include a short manual QA checklist.
- Before each task, make a git checkpoint.
- After each successful task, update `PROJECT_STATE.md` and `CHANGELOG.md`.

## Sprint Overview

### Sprint 1 — Main Dashboard Cleanup

Goal: make the existing main dashboard clear, practical, and useful without adding heavy personalization.

Included:

- Void of Course Moon block states.
- VOC quality labels.
- Moon aspects block.
- Field quality block.
- “Main advice of the moment”.
- “Careful today” warnings.
- Moon precision.
- Planetary hour hints.
- Terminology cleanup.
- Time formatting.
- Main dashboard hierarchy.

Not included:

- Profiles.
- Natal chart screen.
- Personal transits.
- Import/export.
- Sync.
- Backend changes.

### Sprint 2 — Debug and Calculation Verification

Goal: add a hidden technical debug screen so astrological calculations can be checked before more complex features are added.

Included:

- Timezone.
- Current calculation location.
- Day calculation system.
- Earthly branch of month/day.
- Tong Shu indicator.
- VOC calculation source.
- Last Moon aspect.
- Next Moon aspect.
- Coordinates.
- Ephemeris version/source.

### Sprint 3 — Modes and Best Windows

Goal: make the main screen adaptive to user intent.

Included modes:

- General.
- Tarot.
- Candles.
- Money.
- Relationships.
- Cleansings.
- Forecasts.

Included features:

- Mode switcher.
- Mode-specific field quality.
- Mode-specific recommendations.
- Best window today.
- Best window for rituals.
- Best window for material matters.

### Sprint 4 — Profiles and Places

Goal: allow the user to create one or more natal profiles and choose the active profile.

Included:

- Profiles / My Charts section.
- Create profile.
- Edit profile.
- Delete profile with confirmation.
- Active profile switcher.
- Birth date.
- Birth time.
- Birth time accuracy.
- Birth place.
- Current calculation place.
- House system.
- Zodiac system.
- Optional points settings.
- Local-first storage.
- Privacy rules.

### Sprint 5 — Personal Moment Layer

Goal: make the main dashboard personal for the selected profile.

Included:

- “Personally for me” block.
- Personal transits.
- Current Moon in natal house.
- Current Moon aspects to natal planets.
- Personal ritual scores.
- Personal moment forecast.
- Personal advice and cautions.

### Sprint 6 — Natal Chart Screen

Goal: add a full natal chart screen for every profile.

Included:

- Natal chart wheel.
- Planet table.
- House table.
- Aspect table.
- Special points.
- Rulers of 2nd, 8th, and 10th houses.

### Sprint 7 — Backup, Import, Export, and Hardening

Goal: protect user data and make the app reliable.

Included:

- Export profile.
- Import profile.
- Backup.
- Delete profile.
- Local storage verification.
- Error handling.
- Empty states.
- Data migration strategy.

## Recommended Build Order

1. Fix VOC block.
2. Fix Moon aspects block.
3. Clean up terminology and time formatting.
4. Add field quality and main advice.
5. Add warnings.
6. Add Moon precision.
7. Add planetary hour hints.
8. Add debug screen.
9. Add modes.
10. Add best windows.
11. Add profiles.
12. Add active profile switcher.
13. Add personal Moon placement.
14. Add personal transits.
15. Add personal ritual scores.
16. Add personal forecast.
17. Add natal chart screen.
18. Add import/export/backup.

## Codex Workflow

For each task:

1. Read `PROJECT_STATE.md`, `TASKS.md`, `ARCHITECTURE.md`, `ASTRO_LOGIC.md`, `UI_RULES.md`, and `PRIVACY_RULES.md`.
2. Work only on the selected task.
3. Do not perform adjacent tasks.
4. Preserve the existing style and architecture.
5. Use minimal safe changes.
6. Run available checks.
7. Report changed files.
8. Explain how to manually verify the task.
9. Stop and wait for the next command.

## Done Definition for Each Task

A task is done only when:

- Acceptance criteria are satisfied.
- App still builds.
- No obvious console errors are introduced.
- Main screen does not visually break.
- `PROJECT_STATE.md` is updated.
- `CHANGELOG.md` is updated.
- Changes are committed to git.
