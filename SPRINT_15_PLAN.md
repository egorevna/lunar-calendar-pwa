# SPRINT_15_PLAN.md

## Sprint Name

Sprint 15 — Arabic Parts Expansion Pack

## Goal

Sprint 15 expands the Arabic Parts / Lots layer beyond the already active verified formulas:

- Pars Fortuna / Lot of Fortune;
- Lot of Spirit / Жребий Духа.

The sprint goal is not interpretation. The goal is to verify additional Lots one by one, update the formula dataset safely, extend calculation only for verified rows, and update display/UI/debug without adding meanings or predictions.

## Current Foundation

The project already has:

- `src/arabicPartsData.js` — data-only source decision / formula dataset;
- `src/parsFortuna.js` — pure Pars Fortuna engine;
- `src/arabicParts.js` — basic Arabic Parts engine for active verified formulas;
- `src/arabicPartsHouseAssignment.js` — house assignment for active Lots;
- `src/arabicPartsDisplay.js` — display helper;
- `src/arabicPartsForProfile.js` — profile-level view model;
- user-facing block `Жребии и арабские части`;
- safe debug for Arabic Parts;
- strict verified-only formula policy.

Active formulas at Sprint 15 start:

- `pars-fortuna`;
- `lot-of-spirit`.

Deferred formulas at Sprint 15 start:

- `lot-of-eros`;
- `lot-of-necessity`;
- `lot-of-basis`;
- `lot-of-exaltation`.

## Scope

Sprint 15 includes:

- source verification policy for additional Lots;
- per-Lot source verification tasks;
- formula dataset updates only for verified Lots;
- calculation engine extension only for active verified formula rows;
- house assignment integration for newly verified Lots;
- display/UI/debug updates;
- validation and hardening.

## Non-Goals

Sprint 15 does not include:

- interpretations;
- ritual scoring;
- predictive text;
- new house systems;
- Fixed Stars expansion;
- Midpoints / Antiscia;
- Personal Transits;
- broad unverified Arabic Parts catalogs;
- formula rows from memory;
- activating a Lot because it is commonly known without source verification.

## Candidate Expansion Set

The first candidate pack is:

- Lot of Eros;
- Lot of Necessity;
- Lot of Basis;
- Lot of Exaltation.

These are candidates only. They do not become active until source verification passes.

## Formula Governance

No formula may become active unless it has:

- source decision;
- day/night rule if applicable;
- required input list;
- verified formula row;
- manual fixtures;
- tests;
- no interpretation text.

Allowed verification statuses:

```txt
verified
candidate
deferred
needsReview
rejected
```

Only `verified` rows may be active.

## Formula Tradition Policy

Task 15.2 must decide the source corpus / tradition for this sprint before any candidate Lot is activated.

Potential source-policy questions:

1. Which textual/source tradition is used for formulas?
2. Are day/night variants used?
3. Are formulas Hellenistic Lots, medieval Arabic Parts, or a mixed tradition?
4. What source note is attached to each formula row?
5. What happens when sources disagree?
6. What inputs are required: ASC, Sun, Moon, Venus, Mars, Jupiter, Saturn, Mercury, Part of Fortune, Spirit, etc.?
7. Are any formulas dependent on already calculated Lots?

Do not mix traditions silently.

## Candidate Lot Activation Rule

Each candidate Lot has one of these outcomes:

### Active

Only if source verification passes.

```js
{
  active: true,
  verificationStatus: "verified"
}
```

### Deferred

If source cannot be verified or formula/tradition is ambiguous.

```js
{
  active: false,
  verificationStatus: "deferred",
  deferredReason: "formulaSourceNotVerified"
}
```

### Needs Review

If there is a plausible formula but unresolved conflict.

```js
{
  active: false,
  verificationStatus: "needsReview"
}
```

## Task List

### Task 15.1 — Arabic Parts Expansion Strategy

Docs-only sprint setup.

### Task 15.2 — Source Corpus / Formula Tradition Decision

Decide source corpus, formula governance, and candidate verification method.

No formula activation yet unless already present.

### Task 15.3 — Lot of Eros Source Verification

Verify or defer Lot of Eros.

### Task 15.4 — Lot of Necessity Source Verification

Verify or defer Lot of Necessity.

### Task 15.5 — Lot of Basis Source Verification

Verify or defer Lot of Basis.

### Task 15.6 — Lot of Exaltation Source Verification

Verify or defer Lot of Exaltation.

### Task 15.7 — Arabic Parts Dataset Update / Fixtures

Update `src/arabicPartsData.js` for newly verified Lots only.

No engine changes yet unless needed for metadata.

### Task 15.8 — Arabic Parts Engine Expansion / Fixtures

Extend `src/arabicParts.js` to calculate all active verified Lots.

Do not calculate deferred rows.

### Task 15.9 — House Assignment / Display Integration

Ensure newly active Lots use existing house assignment and display layers.

### Task 15.10 — Arabic Parts UI Update

Update the `Жребии и арабские части` UI block to show newly active Lots.

No interpretations.

### Task 15.11 — Arabic Parts Debug Update

Update safe debug/status for the expanded active formula set.

### Task 15.12 — Sprint 15 Hardening

Final audit and close Sprint 15.

## PRO / Reasoning Requirements

PRO required / recommended:

- Task 15.1 — Strategy;
- Task 15.2 — Source Corpus / Formula Tradition Decision;
- Task 15.3 — Lot of Eros Source Verification;
- Task 15.4 — Lot of Necessity Source Verification;
- Task 15.5 — Lot of Basis Source Verification;
- Task 15.6 — Lot of Exaltation Source Verification;
- Task 15.8 — Engine Expansion.

PRO conditional:

- Task 15.7 — Dataset Update, if formulas are complex or source conflicts exist;
- Task 15.12 — Hardening, if several new Lots are activated.

PRO not required unless issues appear:

- Task 15.9 — House Assignment / Display Integration;
- Task 15.10 — UI;
- Task 15.11 — Debug.

## Expected UI Outcome

By the end of Sprint 15, the existing block:

```txt
Жребии и арабские части
```

may show more active verified Lots, for example:

```txt
Парс Фортуны — ...
Жребий Духа — ...
Жребий Эроса — ...
Жребий Необходимости — ...
```

Only verified Lots should appear.

No interpretation text.

## Privacy Rules

UI/debug must not expose:

- raw birthDate;
- raw birthTime;
- utcDateTime;
- raw timezone;
- raw coordinates;
- full profile JSON;
- provider payload;
- raw formula arrays;
- raw internal calculation arrays.

Allowed:

- Lot label;
- formatted zodiac position with seconds;
- house number;
- formula variant label if safe;
- safe source/verification status;
- safe fallback/deferred messages.

## Sprint Exit Criteria

Sprint 15 is done only when:

- formula source policy is documented;
- each candidate Lot has active/deferred/needsReview status;
- only verified formulas are active;
- engine calculates only active verified formulas;
- house assignment/display/UI/debug are synced;
- tests pass;
- docs are synced;
- Sprint 16 is not started.

## Roadmap After Sprint 15

- Sprint 16 — Midpoints / Antiscia.
- Sprint 17 — Personal Transits.
- Sprint 18 — Interpretation Layer / Ritual Scores.
- Sprint 19 — Polish / UX / iPhone PWA / backup-security.
