# ARABIC_PARTS_SOURCE_CORPUS_DECISION.md

## Purpose

Defines the formula source corpus / tradition decision for Sprint 15 Arabic Parts Expansion.

This is a source policy document only. It does not activate formulas and does not change calculation code.

## Decision

Decision status: source corpus partial but accepted.

Primary/only Sprint 15 source corpus:

- Вронский, Том 1, Приложение 2, Таблица 17 — Арабские точки.

Formula tradition:

- Vronsky Table 17 Arabic Points.

Task 15.2b accepts the provided Vronsky Table 17 source materials as a partial source corpus for day-birth Arabic point formulas. Task 15.2c selects the first Vronsky implementation scope as simple day-only display-safe formulas. New formula rows remain inactive until formula verification, dataset update and fixtures.

## Existing Active Formulas

Existing active verified formulas remain unchanged:

- `pars-fortuna`;
- `lot-of-spirit`.

These formulas must not be changed without a real bug.

## Candidate Lots

Existing Sprint 15 candidate rows remain inactive:

- `lot-of-eros`;
- `lot-of-necessity`;
- `lot-of-basis`;
- `lot-of-exaltation`.

Each candidate remains source-gated and must stay one of:

- `candidate`;
- `deferred`;
- `needsReview`;
- `rejected`.

No candidate may become `active: true` in Task 15.2, Task 15.2b or Task 15.2c.

Task 15.2b reframes Sprint 15 around Vronsky Table 17 source rows. Original Hellenistic-style candidate keys must not be treated as required Vronsky keys.

Task 15.2c supersedes the original Lot of Eros / Necessity / Basis / Exaltation verification track for Sprint 15 with a Vronsky Table 17 simple day-only dataset path.

## Source Audit

Initial Task 15.2 local audit found:

- existing Sprint 12 / Sprint 15 policy docs;
- existing inactive candidate rows in `src/arabicPartsData.js`;
- existing tests proving deferred rows do not produce ready values;
- roadmap-level mention of formula tables involving ASC and planets.

Initial Task 15.2 local audit did not find:

- verified formula source pages for Lot of Eros;
- verified formula source pages for Lot of Necessity;
- verified formula source pages for Lot of Basis;
- verified formula source pages for Lot of Exaltation;
- a selected Hellenistic, medieval Arabic, Vronsky or mixed formula corpus for these candidate Lots;
- manually verified formula tables for these candidate Lots.

Roadmap-level mentions are not sufficient to activate formulas.

Task 15.2b source-materials intake found:

- provided local page photos `arabic2.jpg` and `arabic.jpg`;
- book page 209 with `Таблица 17. Арабские точки`;
- section `Для дневного рождения`;
- continuation of the table on book page 210;
- visible day-birth rows including `Pars Fortunae`, `Pars amoris` and `Pars animae`.

Task 15.2b did not find / verify:

- a visible `Для ночного рождения` section in the provided page photos;
- a complete manually verified table transcription;
- active formulas for new Vronsky rows;
- calculated fixtures for new Vronsky rows.

Task 15.2c scope selection records:

- first implementation pack: simple day-only display-safe Vronsky formulas;
- sensitive/fatalistic labels: deferred from normal UI;
- complex operands: deferred until operand policy/engines exist;
- ambiguous labels/formulas: `needsReview`;
- night formulas: still missing / not verified.

## Formula Tradition

Formula tradition: Vronsky Table 17 Arabic Points.

External traditions not used for activation in Sprint 15:

- Hellenistic Lots;
- medieval Arabic Parts;
- Valens;
- Paulus;
- Olympiodorus;
- Hermetic Lots;
- Astrology X-Files;
- modern compilation;
- mixed tradition.

Vronsky Table 17 is selected only from the provided local source materials. Other traditions must not be used for activation in Sprint 15.

## Required Source Materials

Accepted Task 15.2b source materials:

- Сергей Алексеевич Вронский;
- Том 1. Введение в астрологию;
- Классическая астрология в 12 томах — 1;
- ВШКА, Москва, 2003;
- ISBN 5-900504-99-X;
- Приложение 2: Справочные таблицы;
- Таблица 17. Арабские точки;
- section: Для дневного рождения.

The source materials are accepted as partial because the provided photos verify day-birth rows only. Future tasks still need to identify:

- source row scope;
- project key naming;
- day/night variants, if any;
- required inputs;
- whether a formula depends on another Lot;
- source note for each formula row.

See `ARABIC_PARTS_VRONSKY_TABLE_17_SOURCE_MATERIALS.md`.

## Formula Conflict Policy

If sources disagree:

- do not choose silently;
- keep the candidate inactive;
- mark it `needsReview` or `deferred`;
- document the conflict;
- do not calculate the Lot.

## Day / Night Policy

Current Task 15.2c policy for new Vronsky rows:

- new selected rows are `dayOnlyCandidate`;
- calculate only when `chartSect` is `day`;
- `night`, `boundary`, unknown or not-ready chart sect returns `notReady`;
- do not invert formulas by analogy;
- do not silently apply day formulas to night charts.

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

Current path after Task 15.2c:

- Vronsky Table 17 source corpus: partial but accepted;
- `pars-fortuna`: remains active and unchanged;
- `lot-of-spirit`: remains active and unchanged;
- first implementation pack: simple day-only display-safe Vronsky rows selected in `ARABIC_PARTS_VRONSKY_SCOPE_SELECTION.md`;
- Vronsky source-visible rows: candidates only, inactive until dataset/fixture tasks;
- `Pars amoris / точка любви`: source-visible candidate with suggested key `pars-amoris`; not automatically `lot-of-eros`;
- `lot-of-eros`, `lot-of-necessity`, `lot-of-basis`, `lot-of-exaltation`: remain inactive/deferred and are not required Vronsky keys.

Next active task:

- Task 15.3 — Vronsky Simple Arabic Points Dataset / Fixtures.

Task 15.3 must follow the Vronsky simple day-only scope, not the old Hellenistic-style Lot of Eros source-verification track.

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
