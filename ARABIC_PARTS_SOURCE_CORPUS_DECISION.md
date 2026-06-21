# ARABIC_PARTS_SOURCE_CORPUS_DECISION.md

## Purpose

Defines the formula source corpus / tradition decision for Sprint 15 Arabic Parts Expansion.

This is a source policy document only. It does not activate formulas and does not change calculation code.

## Decision

Decision status: source corpus blocked.

Source corpus: blocked.

Reason: no local verified formula source materials are available for the Sprint 15 candidate Lots:

- Lot of Eros;
- Lot of Necessity;
- Lot of Basis;
- Lot of Exaltation.

Task 15.3 must not start until a verified local source pack is provided and accepted.

## Existing Active Formulas

Existing active verified formulas remain unchanged:

- `pars-fortuna`;
- `lot-of-spirit`.

These formulas must not be changed without a real bug.

## Candidate Lots

Candidate rows remain inactive:

- `lot-of-eros`;
- `lot-of-necessity`;
- `lot-of-basis`;
- `lot-of-exaltation`.

Each candidate remains source-gated and must stay one of:

- `candidate`;
- `deferred`;
- `needsReview`;
- `rejected`.

No candidate may become `active: true` in Task 15.2.

## Source Audit

Local audit found:

- existing Sprint 12 / Sprint 15 policy docs;
- existing inactive candidate rows in `src/arabicPartsData.js`;
- existing tests proving deferred rows do not produce ready values;
- roadmap-level mention of formula tables involving ASC and planets.

Local audit did not find:

- verified formula source pages for Lot of Eros;
- verified formula source pages for Lot of Necessity;
- verified formula source pages for Lot of Basis;
- verified formula source pages for Lot of Exaltation;
- a selected Hellenistic, medieval Arabic, Vronsky or mixed formula corpus for these candidate Lots;
- manually verified formula tables for these candidate Lots.

Roadmap-level mentions are not sufficient to activate formulas.

## Formula Tradition

Formula tradition: not selected.

Blocked traditions:

- Hellenistic Lots;
- medieval Arabic Parts;
- Vronsky;
- modern compilation;
- mixed tradition.

None of these may be selected from memory. A future task must select a tradition only from local, readable and citable source materials.

## Required Source Materials

To unblock Sprint 15 formula verification, provide one of:

- book pages;
- screenshots;
- manually verified formula table;
- explicit source citation with readable formula text.

The source pack must identify:

- source name;
- tradition type;
- formula text for each candidate Lot;
- day/night variants, if any;
- required inputs;
- whether a formula depends on another Lot;
- source note for each formula row.

## Formula Conflict Policy

If sources disagree:

- do not choose silently;
- keep the candidate inactive;
- mark it `needsReview` or `deferred`;
- document the conflict;
- do not calculate the Lot.

## Day / Night Policy

If a future source gives day/night variants:

- document day and night formulas separately;
- require ready `chartSect`;
- `boundary`, unknown or not-ready chart sect returns `notReady`;
- do not silently choose the day formula.

If a source does not use day/night variants, document that explicitly in the candidate verification task.

## Dependency Policy

Candidate formulas may depend on another Lot only if:

- the dependency is already active and verified;
- the selected source explicitly requires that dependency;
- tests cover missing dependency behavior.

No formula may depend on inactive or deferred Lots.

## Candidate Verification Path

Current path:

- `lot-of-eros`: blocked pending source materials;
- `lot-of-necessity`: blocked pending source materials;
- `lot-of-basis`: blocked pending source materials;
- `lot-of-exaltation`: blocked pending source materials.

Next active task:

- Task 15.2b — Arabic Parts Source Materials Intake.

Task 15.3 — Lot of Eros Source Verification must not start until Task 15.2b accepts a source pack.

## Strict Exclusions

- no formulas from memory;
- no broad Arabic Parts catalog import;
- no Eros / Necessity / Basis / Exaltation activation;
- no formula rows with `active: true`;
- no fixtures with calculated new Lot values;
- no calculation engine changes;
- no UI/debug changes;
- no package changes;
- no service worker changes;
- no interpretations.
