# DEGREE_RULERS_TABLE_7_COMPLEXITY_AUDIT.md

## Purpose

This document records the source and complexity audit for Table 7 — Vronsky degree rulers.

It is not:

- an active dataset;
- a JavaScript module;
- a lookup engine;
- UI;
- an OCR import;
- a row transcription.

The goal is to decide how Table 7 can safely enter Sprint 10 without mixing it with the already implemented Table 6 / Star of the Magi degree-ruler system.

## Current Sprint 10 Status

Sprint 10 already includes verified source-tracked layers:

- Table 5 Terms dataset and lookup are done.
- Decans Star of the Magi dataset and lookup are done.
- Table 6 Star of the Magi degree rulers dataset and lookup are done.
- Detailed dignity display helper already exists.
- Table 7 is still pending.
- Houses / ASC / MC remain Sprint 11.

Task 10.8b adds only the Table 7 source / complexity audit.

## Source

Source image:

- `table7.jpg`

Source table:

- `Таблица 7`

Title:

- `Управление градусами (по С. Вронскому)`

Source system:

- Vronsky degree rulers.

This source system is separate from Table 6 / Star of the Magi degree rulers.

## Source Evidence

Already reviewed source locations from `DEGREE_RULERS_SOURCE_DECISION.md`:

- PDF page 75: describes `Звезда Магов` as a core scheme underlying rulership of days, hours, degrees, decans and terms.
- PDF page 76: states that several degree-ruler systems exist and points to Appendix 2 for two systems:
  - degree rulership by Star of the Magi / `Табл. 6`;
  - author-used degree-rulership system / `Табл. 7`.
- PDF page 99: shows `Таблица 6. Управление градусами по Звезде Магов`.
- PDF page 100: shows `Таблица 7. Управление градусами (по С. Вронскому)`.

Existing Table 6 source key:

```txt
degree-rulers-star-of-magi-table-6
```

Future Table 7 source key:

```txt
degree-rulers-vronsky-table-7
```

The uploaded `table7.jpg` image visibly shows Table 7 as a separate dense 12-sign by 30-degree table.

## Complexity Assessment

Table 7 is denser and more complex than Table 6.

Observed complexity from `table7.jpg`:

- the table has a dense 12 signs x 30 degrees structure;
- many cells appear to contain more than one ruler token;
- cells may contain retrograde markers;
- cells may include outer-planet glyphs in addition to classical planets;
- row shape must support arrays of ruler tokens, not a single `ruler` field;
- transcription risk is higher than Table 6 because small glyphs and markers can be lost, merged or assigned to the wrong sign/degree cell.

Table 7 must therefore have its own transcription, verification, dataset shape, fixtures and lookup behavior.

## Why Table 7 Must Not Reuse Table 6 Shape

Table 6 row shape is intentionally simple:

```js
{
  degree,
  ruler
}
```

That model is correct for Table 6 because the verified Table 6 dataset contains one septener ruler per sign + degree cell.

Table 7 likely needs a different row shape:

```js
{
  degree,
  rulers: [
    { key, rulerRu, retrograde, sourceSymbol }
  ]
}
```

Forcing Table 7 into the Table 6 shape would lose source information:

- multiple rulers could collapse into one value;
- retrograde markers could be dropped;
- outer-planet glyphs could be incorrectly excluded;
- source tokens would be impossible to review later.

Table 7 must not overwrite, extend or silently reuse the Table 6 dataset model.

## Active Dataset Decision

Decision:

- Do not create an active Table 7 dataset in Task 10.8b.
- Table 7 requires a separate transcription draft.
- Table 7 requires manual verification.
- Only after verification may an active dataset be created.
- Table 7 lookup engine comes after the active dataset.

Reason:

- `table7.jpg` is a source image, not verified structured data;
- no 360-row Table 7 transcription exists yet;
- no row-level verification report exists yet;
- blind OCR is forbidden;
- Table 7 cells may contain multiple rulers and retrograde markers.

## Recommended Data Shape

Future Table 7 row proposal:

```js
{
  sourceKey: "degree-rulers-vronsky-table-7",
  sourceSystem: "vronsky-degree-rulers",
  sign: "aries",
  signRu: "Овен",
  degree: 0,
  rulers: [
    {
      key: "mars",
      rulerRu: "Марс",
      retrograde: false,
      sourceToken: "Марс"
    },
    {
      key: "neptune",
      rulerRu: "Нептун",
      retrograde: true,
      sourceToken: "Нептун R"
    }
  ],
  sourceTable: "Table 7",
  verificationStatus: "verified",
  sourceCheck: "match"
}
```

This is a proposal only. Do not create code in Task 10.8b.

## Transcription Policy

For Task 10.8c:

- all rows must be `needsReview`;
- unclear cells must be marked `unclear`;
- do not guess retrograde markers;
- do not collapse multiple rulers into one string;
- keep `sourceToken` for each visible glyph/token;
- do not create an active dataset;
- do not use Table 6 rows as a reconstruction pattern.

## Verification Policy

For Task 10.8d:

- verify all 360 rows;
- verify every ruler token;
- verify retrograde markers;
- verify multiple rulers;
- record `match` / `unclear` / `mismatch` counts;
- keep rows inactive until there are 0 unclear / 0 mismatch rows or an explicit resolution.

## Boundary Policy

Future lookup:

- lookup uses sign + degree index;
- `degreeIndex = floor(degreeWithinSign)`;
- valid range: `0 <= degreeWithinSign < 30`;
- `30°` is invalid inside one sign and should be handled upstream as the next sign.

This audit does not implement lookup.

## Source Separation

Rules:

- Table 6 and Table 7 are separate systems.
- UI/debug must show the source system.
- Do not merge Table 6 and Table 7 into one result without labels.
- Table 7 must not overwrite Table 6.
- Table 7 rows must use `degree-rulers-vronsky-table-7`.
- Table 6 rows must keep `degree-rulers-star-of-magi-table-6`.

## Recommended Sprint 10 Re-plan

Already done:

- Task 10.9 — Detailed Dignity Display Helper.

Insert before UI/debug/hardening:

1. Task 10.8b — Table 7 Vronsky Degree Rulers Source / Complexity Audit.
2. Task 10.8c — Table 7 Vronsky Degree Rulers Transcription Draft.
3. Task 10.8d — Table 7 Vronsky Degree Rulers Manual Verification.
4. Task 10.8e — Table 7 Vronsky Degree Rulers Dataset.
5. Task 10.8f — Table 7 Vronsky Degree Rulers Lookup Engine / Fixtures.
6. Task 10.9b — Update Detailed Dignity Display Helper for Table 7 multi-ruler results, if needed.
7. Task 10.10 — Collapsible UI.
8. Task 10.11 — Debug.
9. Task 10.12 — Hardening.

Houses / ASC / MC remain Sprint 11.

## Deferred / Not Supported

Still not implemented in this task:

- active Table 7 dataset;
- Table 7 lookup;
- UI;
- debug;
- interpretations;
- fixed stars;
- houses / ASC / MC;
- transits;
- ritual scoring.

## Decisions

- Table 7 belongs to Sprint 10, not Sprint 11.
- Active dataset is not created in Task 10.8b.
- Table 7 needs draft transcription, manual verification, dataset and lookup.
- Table 6 and Table 7 remain separate source systems.
- Table 7 requires a multi-ruler / source-token capable data shape.
- No blind OCR.
- Houses / ASC / MC remain Sprint 11.
- Next task is Task 10.8c.
