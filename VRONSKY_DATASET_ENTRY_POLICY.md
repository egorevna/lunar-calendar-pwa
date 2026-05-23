# VRONSKY_DATASET_ENTRY_POLICY.md

## Purpose

This document defines how Vronsky source tables may be transferred into structured Astro PWA datasets.

It is a data-entry and verification policy.

It is not:

- a dataset;
- an OCR import;
- a lookup engine;
- a UI task;
- an implementation of terms, decans or degree rulers.

The goal is to prevent source-table mistakes from becoming trusted astrological output.

## Current Status

Vronsky screenshots / table image files are not currently present in the repository as source files.

The source inventory is known from user-provided materials and project documentation, but actual dataset entry requires one of:

- uploaded source images;
- manually transcribed source rows;
- another explicitly reviewed source artifact.

Active implementation starts only when `TODO.md` activates a specific dataset task.

Task 10.2 creates policy only. It does not create terms, decans or degree-ruler data.

## Why Blind OCR Is Not Allowed

Vronsky tables are dense.

They may contain:

- signs;
- degree ranges;
- exact degree rows;
- planet glyphs or abbreviations;
- values / scores;
- source-specific rulership systems;
- small row and column labels.

OCR can confuse a sign, planet, digit, range boundary, row or column. A one-degree error can place a planet in the wrong term, decan or degree ruler.

Rule:

```txt
OCR output is not trusted data.
OCR-only rows must not be committed as active dataset rows.
```

OCR may assist transcription, but it cannot replace manual verification.

## Source Inventory

Known source tables from project documents:

1. Table 5 — Terms / `Термы`
   - Active first target for Sprint 10 after manual verification.

2. Table 6 — Degree rulers by Star of the Magi / `Управление градусами по Звезде Магов`
   - Deferred until source rows are available and verified.

3. Table 7 — Degree rulership by S. Vronsky / `Управление градусами по С. Вронскому`
   - Deferred until source rows are available and verified.

4. Table 4 — Planetary influence / `Сила влияния планет`
   - Deferred. Related to dignity/strength work, but not active for Sprint 10 data entry.

5. Table 10 — Aspects / `Аспекты`
   - Relevant to aspects roadmap, but not active for Sprint 10 data entry.

6. Table 18 — Fixed Stars / `Неподвижные звезды`
   - Future fixed-stars sprint.

7. Formula tables involving ASC and planets
   - Future houses / ASC / MC / Arabic Parts work.

## Active Sprint 10 Sources

Active first source:

- Table 5 — Terms / `Термы`

Table 5 can become a dataset only after:

- source image / table is available;
- rows are manually entered;
- rows are reviewed;
- dataset metadata is added;
- row metadata is added;
- boundary tests are added;
- active rows are marked `verified`.

Not active yet:

- Table 6;
- Table 7;
- decans without a selected source system;
- fixed stars;
- formula tables involving ASC and planets.

## Deferred Sources

Table 6 and Table 7 are separate source systems.

Do not merge:

- Star of the Magi degree rulers;
- Vronsky degree rulers.

Decans require a separate source decision before dataset creation.

Fixed stars belong to a later sprint.

ASC formula tables require reliable houses / ASC / MC first.

## Dataset Entry Workflow

Required workflow:

1. Identify source table.
2. Record source image / page / table reference.
3. Manually transcribe draft rows.
4. Review rows one by one against the source.
5. Mark dataset and rows with verification status.
6. Add dataset tests.
7. Activate only verified rows.
8. Keep uncertain rows inactive / pending.
9. Do not show user-facing output from pending rows.

If source material is missing or unclear, stop the dataset task and request clarification/source material.

## Dataset Metadata Requirements

Every Vronsky-derived dataset must include metadata:

```js
{
  sourceKey,
  sourceName,
  tableName,
  tableNumber,
  sourceType,
  sourceReference,
  verificationStatus,
  enteredBy,
  reviewedBy,
  version,
  notes
}
```

Field meanings:

- `sourceKey`: stable internal key, for example `vronsky-table-5-terms`.
- `sourceName`: human-readable source name.
- `tableName`: source table name.
- `tableNumber`: source table number, if available.
- `sourceType`: screenshot, scan, manual-transcription or other explicit type.
- `sourceReference`: image/page/table reference sufficient for review.
- `verificationStatus`: dataset-level status.
- `enteredBy`: who entered the dataset rows.
- `reviewedBy`: who reviewed the dataset rows.
- `version`: dataset policy/data version.
- `notes`: short source or verification notes.

## Row Metadata Requirements

Range rows such as terms:

```js
{
  sign,
  startDegree,
  endDegree,
  ruler,
  value,
  sourceRow,
  sourceColumn,
  verified,
  notes
}
```

Degree-by-degree rows:

```js
{
  sign,
  degree,
  ruler,
  sourceRow,
  sourceColumn,
  verified,
  notes
}
```

Decan rows:

```js
{
  sign,
  decanIndex,
  startDegree,
  endDegree,
  ruler,
  sourceSystem,
  verified,
  notes
}
```

Rules:

- use zodiac sign keys consistent with `src/astroMath.js`;
- use planet keys consistent with the natal provider;
- degrees are numbers;
- range rows must use explicit `endDegree`;
- do not mix string and numeric degree fields;
- do not infer missing values;
- do not include private profile data.

## Verification Statuses

Allowed statuses:

- `pending` — source is known, but data is not entered yet.
- `draft` — data is transcribed but not reviewed.
- `needsReview` — row or dataset requires human review.
- `verified` — row or dataset is reviewed and may become active.
- `rejected` — row or dataset must not be used.

Active lookup datasets may use only verified rows.

If draft rows are kept for work-in-progress, the lookup engine must ignore them.

## Boundary Testing Requirements

For degree ranges:

- `0°00′`;
- each exact start boundary;
- each exact end boundary;
- just before each end boundary;
- `29°59′`;
- `30°` invalid or handled upstream as next sign;
- invalid degree;
- invalid sign;
- no overlapping intervals;
- no gaps.

For degree rulers:

- degree `0`;
- degree `1`;
- degree `29`;
- all 30 degrees per sign if the source table claims full coverage;
- invalid degree;
- invalid sign.

For decans:

- `0°`;
- `9°59′`;
- `10°`;
- `19°59′`;
- `20°`;
- `29°59′`.

All tests must also verify:

- no `NaN`;
- source metadata exists;
- row metadata exists;
- no mixed source systems;
- no OCR-only active rows;
- no private birth data.

## OCR Usage Policy

Allowed:

- OCR as a draft helper;
- OCR output in temporary notes;
- OCR comparison against manually entered rows.

Not allowed:

- OCR output as a verified row;
- OCR-only active dataset;
- silent correction without source note;
- committing uncertain rows as active;
- user-facing output from OCR-only rows.

## Review Checklist

Before any Vronsky-derived dataset task is marked done:

- source image / table is available;
- dataset metadata is complete;
- every active row is verified;
- row count matches expected table shape;
- all signs are covered if the table claims full zodiac coverage;
- range rows have no overlaps;
- range rows have no gaps;
- boundary tests exist;
- no OCR-only rows are active;
- no mixed source systems are present;
- no user-facing use happens before tests pass;
- no private profile data exists in the dataset.

## File Naming / Module Naming Rules

Future recommended names:

Terms:

- `src/termsData.js`
- `src/terms.js`
- `test/termsData.test.js`
- `test/terms.test.js`

Decans:

- `src/decansData.js`
- `src/decans.js`
- `test/decansData.test.js`
- `test/decans.test.js`

Degree rulers:

- `src/degreeRulersData.js`
- `src/degreeRulers.js`
- `test/degreeRulersData.test.js`
- `test/degreeRulers.test.js`

If separate degree-ruler systems are needed:

- `src/degreeRulersStarOfMagiData.js`
- `src/degreeRulersVronskyData.js`

Avoid ambiguous names such as:

- `data.js`;
- `table.js`;
- `rulers.js` without source/layer context.

## Privacy / Safety Rules

Vronsky datasets are general source datasets.

They must not include:

- birthDate;
- birthTime;
- profile data;
- coordinates;
- full profile JSON;
- user names.

They may include:

- sign keys;
- degree boundaries;
- planet ruler keys;
- values / scores only if verified;
- source metadata;
- row metadata.

## What Not To Implement Yet

Task 10.2 must not implement:

- terms dataset;
- decans dataset;
- degree ruler dataset;
- lookup engines;
- UI;
- debug;
- OCR import;
- fixed stars;
- houses / ASC / MC;
- transits;
- interpretations;
- ritual scoring.

## Decisions

- No blind OCR.
- OCR output is not trusted data.
- OCR-only rows must not be committed as active dataset rows.
- Table 5 Terms is the first active target, after source/manual verification.
- Table 6 and Table 7 are separate source systems.
- Only verified rows can be active.
- Pending, draft and needsReview rows cannot power user-facing UI.
- Dataset and row metadata are required before any dataset is accepted.
- Boundary tests are required before lookup results can be trusted.
- Task 10.3 is next.
