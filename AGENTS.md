# AGENTS.md

## Purpose

This file gives instructions to AI coding agents working on this repository.

The project is Astro PWA: a static PWA for a lunar / astrological / ritual calendar.

The agent must work carefully, one task at a time, and must not implement future roadmap features unless they are explicitly moved into `TODO.md`.

---

## Required Reading Before Any Task

Before making changes, read these files in this order:

1. `PROJECT_STATE.md`
2. `TODO.md`
3. `ARCHITECTURE.md`
4. `CHANGELOG.md`

Read these when relevant:

5. `ASTRO_LOGIC.md`
6. `UI_RULES.md`
7. `PRIVACY_RULES.md`
8. `MASTER_PLAN.md`

---

## Document Priority

Use this priority order when documents conflict:

1. `PROJECT_STATE.md` — current project state, active sprint, current focus
2. `TODO.md` — active implementation task list
3. `ARCHITECTURE.md` — actual current code structure and data flow
4. `ASTRO_LOGIC.md` — astrology calculation and interpretation rules
5. `UI_RULES.md` — interface, copy, formatting, and display rules
6. `PRIVACY_RULES.md` — privacy and personal data rules
7. `MASTER_PLAN.md` — long-term roadmap only
8. `CHANGELOG.md` — completed change history

`MASTER_PLAN.md` is not an implementation checklist.

Only implement tasks that are explicitly active in `TODO.md`.

---

## Current Work Discipline

Work on exactly one task at a time.

Do not start the next task without explicit user approval.

Before editing code:

1. Identify the files involved.
2. Explain the minimal safe plan.
3. Confirm what will not be touched.

After editing code:

1. Run `npm test`.
2. Run `git diff --check`.
3. Update `TODO.md`.
4. Update `PROJECT_STATE.md`.
5. Update `CHANGELOG.md`.
6. Update `ARCHITECTURE.md` only if architecture changed.
7. Stop and report.

---

## Commands

Use these commands when relevant:

```bash
npm test
git diff --check
```

Preview command:

```bash
npm run preview
```

Ephemeris generation command:

```bash
npm run generate:ephemeris
```

Field calibration command:

```bash
npm run calibrate:field
```

Do not run ephemeris generation unless explicitly requested.

---

## Architecture Rules

`ARCHITECTURE.md` describes the actual current architecture.

Update `ARCHITECTURE.md` only when a task changes:

- app structure
- data flow
- major modules
- routes or screens
- calculation modules
- storage
- privacy model
- PWA cache behavior
- generated data flow
- test architecture

Do not update `ARCHITECTURE.md` for:

- copy-only changes
- small CSS changes
- simple label changes
- minor formatting fixes
- tests that do not change architecture

If architecture did not change, say so in the report.

---

## Hard Boundaries

Do not implement unless explicitly active in `TODO.md`:

- profiles, until Sprint 3 task explicitly asks for them
- natal chart
- house calculations
- Ascendant / MC
- personal transits
- active profile recommendations
- personal ritual scoring
- import/export, until the active Sprint 3 task asks for it
- cloud sync
- new backend
- new public navigation structure

Do not edit `src/ephemeris-data.js` by hand.

Do not add dependencies unless explicitly necessary and approved.

Do not rewrite the whole dashboard when a small change is enough.

---

## Sprint 3 Privacy Boundaries

Profile data is sensitive.

Birth data includes:

- birth date
- birth time
- birth place
- coordinates
- timezone
- house / zodiac preferences

Sprint 3 must be local-first.

Do not send profile data to any server.

Do not add cloud sync.

Do not add external geocoding APIs unless explicitly requested.

Do not request device location permission unless explicitly requested.

Do not dump full birth data in debug output unless explicitly needed.

---

## UI Rules

Main dashboard should stay practical and not overloaded.

Main dashboard time format should usually be:

```txt
HH:mm
```

Seconds are allowed only in debug or technical views unless explicitly requested.

Prefer simple Russian copy over technical labels.

Avoid exposing internal terms such as `VOC` in user-facing copy unless the task explicitly asks for it.

---

## PWA Rules

This is a static PWA.

If app-visible JS, CSS, HTML, or cached asset lists change and the installed PWA must update reliably, update `CACHE_NAME` in `sw.js`.

After changing the cache version, mention it in the report.

---

## Reporting Format

After each task, report:

1. Files changed
2. What changed
3. Tests run and results
4. Whether architecture changed
5. Manual check instructions
6. Remaining risks
7. Confirmation that the next task was not started
