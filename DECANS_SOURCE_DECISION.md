# DECANS_SOURCE_DECISION.md

## Purpose

This document records the Sprint 10 source decision for decans / деканаты.

It is not an active dataset, not a JavaScript module, not a lookup engine and not UI.

The goal is to decide how decans may become structured data later without mixing source systems or trusting unverified diagram transcription.

## Current Source Evidence

The uploaded PDF `4148867_vvedenie_v_astrologiyu.pdf` contains the relevant decan source material.

Source locations reviewed:

1. PDF page 72:
   - Mentions additional essential dignity layers such as a planet being in its own degree, decan or term.
   - Points readers to Appendix 2, Tables 5, 6, 7 and Figures 4.7, 4.8.

2. PDF pages 74-75:
   - Introduces planetary rulership over days, hours, degrees, decans and terms.
   - Introduces the Star of the Magi as a core rulership scheme.
   - Figure 4.6 is the Star of the Magi.

3. PDF page 76:
   - States that decan rulership uses two systems:
     - by Star of the Magi;
     - by trigons / triplicities.
   - States that both systems are given by Ptolemy in the Tetrabiblos.
   - Points to Figure 4.7 as the decan rulership scheme by Star of the Magi / Egyptian tradition.
   - Describes the trigon system rule:
     - first decan is ruled by the ruler of the sign;
     - second decan is ruled by the ruler of the next trigon sign;
     - third decan is ruled by the ruler of the last trigon sign in zodiacal order.
   - Gives the Aries example for the trigon system:
     - 1st decan of Aries: Mars and retrograde Pluto;
     - 2nd decan of Aries: Sun;
     - 3rd decan of Aries: Jupiter and retrograde Neptune.
   - States the key difference:
     - Star of the Magi includes only septener planets;
     - trigon rulership includes all active planets, including retrograde planets.

4. PDF page 77:
   - Shows Figure 4.8, the decan rulership scheme by trigons.

5. PDF pages 99-100:
   - Appendix 2 lists Table 5 Terms, Table 6 degree rulership by Star of the Magi and Table 7 degree rulership by S. Vronsky.
   - These tables are degree-ruler sources, not active decan datasets.

The PDF contains diagrams and text rules, but no manually verified 36-row decan dataset is available yet.

## Systems Considered

### Star of the Magi / Egyptian Tradition

This system is visible in Figure 4.7 on PDF page 76.

It uses septener planets only:

- Sun;
- Moon;
- Mercury;
- Venus;
- Mars;
- Jupiter;
- Saturn.

It is likely the cleanest first decan dataset candidate because each decan can probably be represented as one sign + decanIndex + ruler row.

It still requires a draft transcription from the source figure and manual row-by-row verification before any active dataset can be created.

### Trigon / Triplicity System

This system is described in text on PDF page 76 and shown in Figure 4.8 on PDF page 77.

The rule is:

- first decan ruler = ruler of the sign;
- second decan ruler = ruler of the next sign in the same trigon;
- third decan ruler = ruler of the last sign in the same trigon in zodiacal order.

In Vronsky's Aries example, the system includes outer and retrograde rulers:

- Aries decan 1: Mars and retrograde Pluto;
- Aries decan 2: Sun;
- Aries decan 3: Jupiter and retrograde Neptune.

This makes the trigon system more complex than the Star of the Magi system. Its future data model needs multi-ruler rows and explicit `retrograde` flags.

### Vronsky-specific Handling

Vronsky presents both systems.

They must not be mixed silently.

If both systems are later supported, each must have its own source key, source metadata, fixture set and UI/debug source label.

## Active Dataset Decision

Do not create an active decans dataset in Task 10.5.

Reason:

- source figures are available in the PDF;
- text rules are available;
- but there is no manually transcribed 36-row decan table;
- no manual verification report exists;
- the source is diagrammatic rather than a clear verified table;
- the project policy forbids active datasets from unverified source transcription.

Task 10.5 is therefore source decision only.

The first candidate for a later dataset is Star of the Magi / Egyptian tradition, but only after draft transcription and manual verification.

## Recommended Source Policy

1. Do not mix Star of the Magi and Trigon systems.
2. Use separate source keys:
   - `decans-star-of-magi`;
   - `decans-trigon-vronsky`.
3. Treat Star of the Magi as the first dataset candidate only after manual transcription of Figure 4.7.
4. Defer the Trigon / Vronsky system until its rules, outer rulers and retrograde handling are fully specified.
5. Future UI/debug output must show the active decan source system.

## Dataset Readiness

- source image / figure available: yes, in PDF pages 76-77;
- tabular rows available: no;
- manual transcription done: no;
- manual verification done: no;
- active dataset allowed now: no.

## Data Shape Proposal

Future Star of the Magi row shape:

```js
{
  sourceKey: "decans-star-of-magi",
  sourceName: "Vronsky / Star of the Magi",
  sign: "aries",
  signRu: "Овен",
  decanIndex: 1,
  startDegree: 0,
  endDegreeExclusive: 10,
  ruler: "mars",
  rulerRu: "Марс",
  sourceFigure: "Fig. 4.7",
  verificationStatus: "verified"
}
```

Future Trigon / Vronsky row shape:

```js
{
  sourceKey: "decans-trigon-vronsky",
  sign: "aries",
  decanIndex: 1,
  startDegree: 0,
  endDegreeExclusive: 10,
  rulers: [
    { key: "mars", retrograde: false },
    { key: "pluto", retrograde: true }
  ],
  sourceFigure: "Fig. 4.8 or text",
  verificationStatus: "verified"
}
```

These shapes are proposals only. Do not create code files from them in Task 10.5.

## Boundary Policy

Future decan intervals should be:

- decan 1: `[0, 10)`;
- decan 2: `[10, 20)`;
- decan 3: `[20, 30)`.

`30°` is invalid inside one sign. If needed, upstream sign resolution should move it to the next sign.

Required boundary tests:

- `0`;
- `9.999`;
- `10`;
- `19.999`;
- `20`;
- `29.999`;
- `30` invalid;
- invalid sign;
- invalid degree;
- no `NaN`.

## Verification Requirements

Before any active decans dataset is created:

- source figure / page reference must be recorded;
- draft transcription must exist;
- all 12 signs x 3 decans = 36 rows per system must be reviewed;
- rows must be checked one by one against the source figure / text;
- every active row must have `verificationStatus: "verified"`;
- no OCR-only row may be active;
- no gaps or overlaps may exist;
- each source system must have a separate `sourceKey`;
- tests must cover source metadata, row counts, sign coverage, boundaries, source separation and strict exclusions.

## UI / Debug Rules

Future decan UI must be collapsible and must display source system if decans are shown.

Future debug may show status, counts and source system only.

Do not show:

- source figure dumps;
- unverified rows;
- full source transcription as debug output;
- private birth data;
- interpretations or fatalistic copy.

## Deferred / Not Supported

Task 10.5 does not implement:

- active decans dataset;
- decans lookup engine;
- decans UI;
- decans debug;
- degree rulers;
- terms changes;
- fixed stars;
- houses / ASC / MC;
- transits;
- interpretations / ritual scoring.

## Recommended Next Tasks

Recommended next path:

1. Task 10.5b — Decans Star of the Magi Transcription Draft.
2. Task 10.5c — Decans Star of the Magi Manual Verification.
3. Task 10.5d — Decans Dataset from Verified Rows.
4. Later: separate Trigon / Vronsky decans source decision and dataset path.

## Decisions

- No active decans dataset is created in Task 10.5.
- Star of the Magi and Trigon systems must stay separate.
- Star of the Magi / Egyptian tradition is the first dataset candidate.
- Star of the Magi still requires draft transcription and manual verification before active data.
- Trigon / Vronsky decans are deferred.
- No blind OCR is allowed.
- Task 10.5b is next.
