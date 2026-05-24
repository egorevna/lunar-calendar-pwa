# DEGREE_RULERS_SOURCE_DECISION.md

## Purpose

This document records the Sprint 10 source decision for degree rulers / управители градусов.

It is not:

- an active dataset;
- a JavaScript module;
- a lookup engine;
- UI;
- an OCR import;
- a transcription of Table 6 or Table 7 rows.

The goal is to keep the two degree-ruler source systems separate and to decide the safest path before any row becomes active data.

## Current Source Evidence

The uploaded PDF `4148867_vvedenie_v_astrologiyu.pdf` contains the relevant degree-ruler source material.

Source locations reviewed:

1. PDF page 75:
   - Describes `Звезда Магов` as a core scheme underlying rulership of days, hours, degrees, decans and terms.

2. PDF page 76:
   - States that several systems of degree rulership exist.
   - Points to Appendix 2 for two systems:
     - degree rulership by Star of the Magi / `Табл. 6`;
     - the author-used degree-rulership system / `Табл. 7`.
   - This establishes that the two tables are separate source systems.

3. PDF page 99:
   - Shows `Таблица 6. Управление градусами по Звезде Магов`.

4. PDF page 100:
   - Shows `Таблица 7. Управление градусами (по С. Вронскому)`.

Uploaded source images:

- `table6.jpg` — Table 6, `Управление градусами по Звезде Магов`;
- `table7.jpg` — Table 7, `Управление градусами (по С. Вронскому)`.

The images provide source table material, but they are not manually transcribed and verified rows. They are therefore not sufficient for an active dataset in Task 10.7a.

## Systems Considered

### Table 6 — Star of the Magi Degree Rulers

Source:

- Table 6;
- `table6.jpg`;
- PDF page 99;
- title: `Управление градусами по Звезде Магов`.

Source system:

- Star of the Magi.

Observed table shape:

- zodiac sign columns;
- degree rows labeled `0` through `29`;
- likely 12 signs x 30 degrees = 360 rows.

This is the safest first candidate because it is a named standalone source system and should be kept separate from Vronsky's Table 7 system.

It still requires:

- draft transcription;
- row-by-row manual verification;
- source metadata;
- boundary tests;
- explicit degree-indexing policy.

### Table 7 — Vronsky Degree Rulers

Source:

- Table 7;
- `table7.jpg`;
- PDF page 100;
- title: `Управление градусами (по С. Вронскому)`.

Source system:

- S. Vronsky degree rulers.

Observed table shape:

- zodiac sign columns;
- degree rows labeled `0` through `29`;
- likely 12 signs x 30 degrees = 360 rows;
- cells may contain source-specific symbols and markers that require careful manual verification.

Table 7 is separate from Table 6 and must not be merged with it.

It requires a separate future workflow:

- separate transcription draft;
- separate verification report;
- separate source key;
- separate dataset and fixtures if activated later.

## Active Dataset Decision

Do not create an active degree rulers dataset in Task 10.7a.

Reason:

- source images are available;
- PDF table locations are confirmed;
- rows have not been manually transcribed;
- rows have not been manually verified;
- degree-ruler tables are dense 360-row source systems;
- blind OCR is forbidden by `VRONSKY_DATASET_ENTRY_POLICY.md`;
- Table 6 and Table 7 must not be mixed.

Task 10.7a is source decision only.

First candidate:

- Table 6 — Star of the Magi degree rulers.

Deferred:

- Table 7 — Vronsky degree rulers.

Active dataset is allowed only after draft transcription and manual verification.

## Recommended Source Policy

1. Do not mix Table 6 and Table 7.
2. Use separate source keys:
   - `degree-rulers-star-of-magi-table-6`;
   - `degree-rulers-vronsky-table-7`.
3. Table 6 is the first candidate only after manual transcription.
4. Table 7 is deferred until a separate verified workflow.
5. Future UI/debug must show the active source system when degree rulers are displayed.
6. Pending, draft or OCR-only rows must not power user-facing calculations.

## Dataset Readiness

Table 6 — Star of the Magi:

- source image/table available: yes, `table6.jpg`;
- PDF table location available: yes, PDF page 99;
- tabular rows available as image: yes;
- manual transcription done: no;
- manual verification done: no;
- active dataset allowed now: no.

Table 7 — Vronsky:

- source image/table available: yes, `table7.jpg`;
- PDF table location available: yes, PDF page 100;
- tabular rows available as image: yes;
- manual transcription done: no;
- manual verification done: no;
- active dataset allowed now: no.

## Data Shape Proposal

Future Table 6 row shape:

```js
{
  sourceKey: "degree-rulers-star-of-magi-table-6",
  sourceName: "Vronsky / Star of the Magi",
  tableNumber: 6,
  sign: "aries",
  signRu: "Овен",
  degree: 0,
  ruler: "mars",
  rulerRu: "Марс",
  sourceTable: "Table 6",
  verificationStatus: "verified"
}
```

Future Table 7 row shape:

```js
{
  sourceKey: "degree-rulers-vronsky-table-7",
  sourceName: "Vronsky",
  tableNumber: 7,
  sign: "aries",
  signRu: "Овен",
  degree: 0,
  rulers: [
    { key: "mars", retrograde: false },
    { key: "neptune", retrograde: true }
  ],
  sourceTable: "Table 7",
  verificationStatus: "verified"
}
```

These are proposals only. Do not create code files from them in Task 10.7a.

## Boundary Policy

Degree ruler lookup uses:

- sign;
- integer degree inside sign.

Valid integer degree:

```txt
0 through 29
```

`30°` is invalid inside one sign. If needed, upstream sign resolution should move it to the next sign.

Fractional degree policy must be explicit before lookup engine implementation.

Recommended future policy:

```txt
degreeIndex = floor(degreeWithinSign)
valid only when 0 <= degreeWithinSign < 30
```

This must be confirmed before any lookup engine is created.

Boundary tests required:

- `0`;
- `0.999`;
- `1`;
- `28.999`;
- `29`;
- `29.999`;
- `30` invalid;
- invalid sign;
- invalid degree;
- `NaN`.

## Verification Requirements

Any future active degree-ruler dataset requires:

- source table / page reference;
- source image reference;
- draft transcription;
- row-by-row manual review;
- all 12 signs x 30 degrees = 360 rows per system;
- no OCR-only rows;
- source-key separation;
- no Table 6 rows in a Table 7 dataset;
- no Table 7 rows in a Table 6 dataset;
- tests for metadata, row count, source separation, degree coverage and strict exclusions.

## Deferred / Not Supported

Task 10.7a does not implement:

- active degree rulers dataset;
- degree rulers lookup engine;
- degree rulers UI;
- degree rulers debug;
- Table 7 active dataset;
- OCR import;
- fixed stars;
- houses / ASC / MC;
- transits;
- interpretations / ritual scoring.

## Recommended Next Tasks

Recommended next path:

1. Task 10.7b — Degree Rulers Table 6 Star of the Magi Transcription Draft.
2. Task 10.7c — Degree Rulers Table 6 Manual Verification.
3. Task 10.7d — Degree Rulers Table 6 Dataset from Verified Rows.
4. Later: Table 7 Vronsky degree rulers separate source workflow.

If the source image/table is found insufficient during transcription:

- Task 10.7b should stop and request a clearer Table 6 source image.

## Decisions

- No active degree rulers dataset is created in Task 10.7a.
- Table 6 and Table 7 are separate source systems.
- Table 6 Star of the Magi is the first candidate only after transcription and manual verification.
- Table 7 Vronsky degree rulers are deferred.
- No blind OCR is allowed.
- Task 10.7b is next.
