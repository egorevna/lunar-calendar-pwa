# TERMS_DECANS_DEGREE_RULERS_STRATEGY.md

## Purpose

This document fixes the Sprint 10 strategy for detailed dignity lookup layers:

- terms / термы;
- decans / деканаты;
- degree rulers / управители градусов.

These layers are applied after natal planet coordinates are already calculated and validated.

They are not a coordinate engine, not a house engine, not a transit engine and not an interpretation layer.

## Scope

Sprint 10 may cover:

- source audit;
- Vronsky data entry policy;
- terms dataset, only from verified Table 5;
- terms lookup;
- decan source decision;
- decan dataset, only if source material is verified;
- degree ruler source decision;
- degree ruler dataset, only if source material is verified;
- fixtures and boundary tests;
- display, UI and debug only after data is verified.

Sprint 10 must not cover:

- fixed stars;
- houses / ASC / MC;
- transits;
- Lilith / Selena / Nodes;
- Arabic Parts;
- midpoints / antiscia;
- interpretations;
- ritual scoring;
- OCR-only datasets.

## What These Layers Are

Terms are degree ranges inside a zodiac sign. Each range has a ruler and may have a source-specific value or score if the source table includes one and it has been verified.

Decans are subdivisions inside a sign. They are often 10-degree sections, but the ruler depends on the selected system.

Degree rulers are dense sign + degree lookup tables. They are source-specific and require stricter manual verification than broad sign-based dignity rules.

## What These Layers Are Not

Terms, decans and degree rulers are not:

- planet coordinates;
- natal aspect calculations;
- current transits;
- houses;
- ASC / MC;
- fixed stars;
- personality interpretations;
- predictive claims;
- ritual scoring.

They should never be used to invent missing natal data.

## Current Project Foundation

The project already has:

- validated natal planet positions for 10 planets;
- zodiac sign and degree display for natal planets;
- read-only natal planets inside `Мои карты`;
- natal aspects between validated natal planets;
- basic essential dignities by sign;
- collapsible profile / natal sections in `Мои карты`;
- synthetic/manual fixture validation approach;
- privacy and debug guardrails for personal astrology output.

Sprint 10 builds on this foundation as a lookup layer over existing sign and degree data.

## Source Materials Inventory

Known user-provided source screenshots mentioned in project documents:

- Table 5 — Terms / `Таблица 5. Термы`;
- Table 6 — Degree rulers by Star of the Magi / `Управление градусами по Звезде Магов`;
- Table 7 — Degree rulership by Vronsky / `Управление градусами по С. Вронскому`;
- Table 4 — Planetary influence / dignity strength;
- Table 10 — Aspects;
- Table 18 — Fixed Stars;
- formula tables involving ASC and planets.

For Sprint 10, only these layers are active candidates:

- Terms;
- Decans;
- Degree Rulers.

The other tables remain future source material.

No Vronsky screenshots or table image files were found in the repository during Task 10.1 audit. The inventory exists in documentation, but actual dataset entry requires uploaded source images or manually verified transcription later.

External conceptual references checked for source-system context:

- Skyscript, "Understanding Ptolemy's Table of Essential Dignities": https://www.skyscript.co.uk/dig2.html
- Skyscript glossary, "Faces": https://www.skyscript.co.uk/glossary/faces/
- Skyscript glossary, "Decans": https://www.skyscript.co.uk/glossary/decans-1/

These references are context only. They do not replace the user-provided Vronsky source tables.

## Terms / Термы Strategy

Terms should be the first implementation target in Sprint 10.

Selected policy:

- source target: Vronsky Table 5, pending manual verification;
- dataset entry must be manual;
- OCR may assist as draft only, never as active committed data by itself;
- ranges must use explicit half-open intervals: `[startDegree, endDegree)`;
- the final interval in a sign must end at `30`;
- include the term ruler;
- include score/value only if it is present in the verified source table;
- do not infer missing values from memory or other sources.

If Table 5 is not available to Codex when Task 10.3 starts, Task 10.3 should stop and request the source material instead of creating a guessed dataset.

## Decans / Деканаты Strategy

Decans must not be implemented until the source system is selected.

Systems that must remain separate:

- Star of the Magi / Chaldean order;
- trigon / triplicity-based decans;
- Vronsky-specific decans, if a verified source table exists.

Selected policy:

- do not silently mix decan systems;
- do not derive a decan dataset from memory;
- decide the source after the terms dataset policy is accepted;
- implement decans only if a source table or source system is explicitly verified.

If no verified source exists, decans remain deferred within Sprint 10 or move to Sprint 11+.

## Degree Rulers / Управители градусов Strategy

Degree rulers are high-risk dense lookup tables.

Table 6 and Table 7 are separate systems:

- Table 6 — degree rulers by Star of the Magi;
- Table 7 — degree rulership by S. Vronsky.

Selected policy:

- do not mix Table 6 and Table 7;
- do not create a degree-ruler dataset until source screenshots or verified rows are available;
- define the degree indexing policy before implementation;
- use sign + integer degree lookup only after boundary rules are explicit;
- require row samples and boundary tests before any user-facing display.

Degree rulers should be implemented after terms and after source verification is complete.

## Source System Separation

Terms, decans and degree rulers are separate source layers.

Every future dataset must include:

- `sourceKey`;
- `sourceName`;
- `tableName`;
- `sourceType`;
- `verificationStatus`;
- row-level source references.

UI and debug output must name the active source system.

No layer may silently inherit another layer's source.

## Dataset Entry and Verification Policy

No blind OCR is allowed.

OCR may be used only as a draft transcription aid. A row becomes active data only after manual verification.

Required dataset metadata:

```js
{
  sourceKey,
  sourceName,
  tableName,
  sourceType,
  verificationStatus,
  enteredBy,
  reviewedBy,
  notes
}
```

Suggested metadata for range rows:

```js
{
  sign,
  startDegree,
  endDegree,
  ruler,
  value,
  sourceRow,
  verified
}
```

Suggested metadata for degree-ruler rows:

```js
{
  sign,
  degree,
  ruler,
  sourceRow,
  verified
}
```

Active datasets must not contain unverified active rows.

## Boundary and Interval Policy

Degree ranges should use half-open intervals:

```txt
[startDegree, endDegree)
```

Rules:

- degree within sign must be normalized to `0 <= degree < 30`;
- final interval ends at `30`;
- exact start boundary belongs to the new interval;
- exact end boundary belongs to the next interval;
- invalid sign returns `null` / notSupported;
- invalid degree returns `null` / notSupported;
- no silent rounding mistakes;
- no `NaN` in output.

Boundary tests must cover:

- `0°00′`;
- exact start boundaries;
- exact end boundaries;
- `29°59′`;
- `30°` invalid or handled upstream as the next sign;
- invalid sign;
- invalid degree;
- no `NaN`.

Degree ruler indexing must be decided before implementation. Task 10.1 does not choose whether source degree rows are labeled as 0-based or 1-based; that must be verified from the actual source table.

## Data Shapes

Future terms dataset shape:

```js
{
  source,
  signs: {
    aries: [
      {
        startDegree: 0,
        endDegree: 6,
        ruler: 'jupiter',
        value: null,
        sourceRow: 'Table 5 / Aries / row 1',
        verified: true
      }
    ]
  }
}
```

Future decans dataset shape:

```js
{
  source,
  system: 'chaldean' | 'triplicity' | 'vronsky-specific',
  signs: {
    aries: [
      {
        startDegree: 0,
        endDegree: 10,
        ruler: 'mars',
        sourceRow: '...',
        verified: true
      }
    ]
  }
}
```

Future degree rulers dataset shape:

```js
{
  source,
  degreeIndexing: 'pending-source-verification',
  signs: {
    aries: [
      {
        degree: 0,
        ruler: 'mars',
        sourceRow: '...',
        verified: true
      }
    ]
  }
}
```

These shapes are planning notes, not code for Task 10.1.

## Validation Requirements

Future tests must verify:

- dataset metadata exists;
- row metadata exists;
- no unverified active rows;
- all signs are covered if the table claims full zodiac coverage;
- no overlapping intervals;
- no interval gaps;
- boundary lookup at starts and ends;
- final interval behavior near `30°`;
- invalid sign and invalid degree handling;
- source system separation;
- no terms data inside decans dataset;
- no degree ruler data inside terms dataset;
- no private birth data;
- no full profile JSON;
- no OCR-only rows.

## UI / Debug Rules

When UI is added:

- sections must be collapsible by default;
- source system must be visible or available in concise copy;
- lookup results may be shown only from verified datasets;
- no long interpretations;
- no raw birth data;
- no raw planet longitude values;
- no full table dumps.

Debug may show:

- layer status;
- source system;
- verification status;
- row counts;
- enabled / disabled status;
- deferred and notSupported flags.

Debug must not show:

- raw profile JSON;
- birth date or birth time;
- raw coordinates;
- raw longitudes;
- full unverified tables;
- OCR-only rows.

## Privacy Rules

Do not show:

- birthDate;
- birthTime;
- utcDateTime;
- raw timezone;
- raw birthPlace;
- raw currentPlace;
- coordinates;
- full profile JSON.

Allowed user-facing data after verification:

- planet name;
- sign;
- degree-derived lookup label;
- ruler / term / decan / degree-ruler label;
- source system.

## Recommended Sprint 10 Implementation Order

Recommended phased order:

1. Task 10.2 — Vronsky Dataset Entry Policy.
2. Task 10.3 — Terms Dataset from verified Table 5.
3. Task 10.4 — Terms Lookup Engine / Fixtures.
4. Task 10.5 — Decans Source Decision / Dataset.
5. Task 10.6 — Decans Lookup Engine / Fixtures.
6. Task 10.7 — Degree Rulers Source Decision / Dataset.
7. Task 10.8 — Degree Rulers Lookup Engine / Fixtures.
8. Task 10.9 — Terms / Decans / Degree Rulers Display Helper.
9. Task 10.10 — Terms / Decans / Degree Rulers Collapsible UI.
10. Task 10.11 — Terms / Decans / Degree Rulers Debug.
11. Task 10.12 — Sprint 10 Hardening.

If verified source material is missing for decans or degree rulers, those layers should remain deferred instead of guessed.

## Deferred / Not Supported

Do not implement in Task 10.1:

- terms dataset;
- decans dataset;
- degree rulers dataset;
- OCR-only import;
- fixed stars;
- houses / ASC / MC;
- transits;
- Lilith / Selena / Nodes;
- Arabic Parts;
- midpoints / antiscia;
- interpretations;
- ritual scoring.

## Decisions

- Terms are the first implementation target.
- Terms source: Vronsky Table 5, pending manual verification.
- Decans require a separate source decision and must not mix Chaldean / Star of the Magi, triplicity / trigon or Vronsky-specific systems.
- Degree rulers are deferred until source table screenshots or verified rows are available.
- Table 6 and Table 7 are separate degree-ruler systems and must not be merged silently.
- No blind OCR.
- OCR may assist transcription only before manual verification.
- Dataset rows need metadata, source references and verification status.
- Task 10.1 creates no dataset code.
- Task 10.2 is next.
