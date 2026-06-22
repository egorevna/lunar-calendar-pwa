# ARABIC_PARTS_VRONSKY_TABLE_17_SOURCE_MATERIALS.md

## Purpose

Records source materials intake for Sprint 15 Arabic Parts Expansion using Vronsky Table 17 only.

This is a source-materials document only. It does not activate formulas, does not update the formula dataset, and does not change calculation code.

## Source Materials

Provided source packet:

- Сергей Алексеевич Вронский.
- Том 1. Введение в астрологию.
- Серия: Классическая астрология в 12 томах — 1.
- ВШКА, Москва, 2003.
- ISBN 5-900504-99-X.
- Приложение 2: Справочные таблицы.
- Таблица 17. Арабские точки.
- Section visible in the provided pages: Для дневного рождения.

Local image references:

- `arabic2.jpg`: book page 209, shows `Таблица 17. Арабские точки` and `Для дневного рождения`.
- `arabic.jpg`: book page 210, continuation of Table 17 day-birth rows.

The two provided page photos confirm the author/series/page/table context visible on the pages. Publisher and ISBN are accepted from the user-provided source packet metadata; they are not visible on these two page photos.

## Intake Decision

Decision status: partial but accepted.

Primary/only Sprint 15 source corpus:

- Вронский, Том 1, Приложение 2, Таблица 17 — Арабские точки.

Formula tradition:

- Vronsky Table 17 Arabic Points.

Scope:

- Sprint 15 Arabic Parts expansion uses Vronsky Table 17 rows only.
- External traditions are not used for activation in Sprint 15.
- Day-birth source materials are available for the visible rows.
- Night-birth formulas are not verified from the provided page photos.

## Source Scope

Not used for Sprint 15 formula activation:

- Valens;
- Paulus;
- Olympiodorus;
- Hermetic Lots;
- Astrology X-Files;
- modern online formula compilations;
- formula rows from memory.

Do not map Vronsky rows to non-Vronsky project keys automatically. In particular, `Pars amoris / точка любви` must not be automatically treated as `lot-of-eros`. A later Vronsky-only scope decision must choose the project key.

## Manual Transcription Policy

The provided pages must not be OCR-imported as a whole table.

This document records only manually reviewed rows that are confidently readable from the provided page photos. The row list below is an intake record, not an active formula dataset.

For each visible row:

- section: Для дневного рождения;
- source status: sourceVisible;
- active: false unless the existing project row is already active;
- no interpretation text is attached;
- implementation requires a later verification task.

## Relevant Visible Rows

### Existing Active Rows

These rows are visible in Vronsky Table 17, but the existing project formulas are not changed in Task 15.2b.

| Source label | Russian label | Printed formula | Current project status | Notes |
|---|---|---|---|---|
| Pars Fortunae (PF) | точка счастья | AsC + Луна - Солнце | `pars-fortuna` already active | Do not change existing formula. |
| Pars animae | точка души | AsC + Солнце - Луна | `lot-of-spirit` already active | Conceptually corresponds to Lot of Spirit; do not change existing formula. |

### Vronsky Candidate Rows

These rows are source-visible candidates only. They are not activated by this intake task.

| Source label | Russian label | Printed formula | Suggested key/status | Complexity | Implementation status |
|---|---|---|---|---|---|
| Pars amoris | точка любви | AsC + Венера - Солнце | `pars-amoris`, not `lot-of-eros` | simplePointMinusPoint | candidateSimple |
| Pars artis | точка искусства | AsC + Меркурий - Венера | candidate | simplePointMinusPoint | candidateSimple |
| Pars familiae | счастье в браке женщины | AsC + Сатурн - Венера | candidate | simplePointMinusPoint | candidateSimple |
| Pars filiac | дети женского пола | AsC + Венера - Луна | candidate | simplePointMinusPoint | candidateSimple |
| Pars fratrum et sororum | братья и сестры | AsC + Юпитер - Сатурн | candidate | simplePointMinusPoint | candidateSimple |
| Pars hereditatis | точка наследства | AsC + Луна - Сатурн | candidate | simplePointMinusPoint | candidateSimple |
| Pars itineris | точка веры | AsC + Меркурий - Луна | candidate | simplePointMinusPoint | candidateSimple |
| Pars liberorum | точка свободы | AsC + Сатурн - Юпитер | candidate | simplePointMinusPoint | candidateSimple |
| Pars matris | точка матери | AsC + Луна - Венера | candidate | simplePointMinusPoint | candidateSimple |
| Pars morbi | точка болезни | AsC + Марс - Сатурн | candidate | simplePointMinusPoint | candidateSimple |
| Pars patris | точка отца | AsC + Солнце - Сатурн | candidate | simplePointMinusPoint | candidateSimple |
| Pars pueri | дети мужского пола | AsC + Юпитер - Луна | candidate | simplePointMinusPoint | candidateSimple |
| Pars scientiae | точка слуху | AsC + Луна - Меркурий | candidate | simplePointMinusPoint | candidateSimple |
| Астрология | — | AsC + Меркурий - Уран | candidate | simplePointMinusPoint | candidateSimple |
| Здоровье (progress) | — | AsC + Юпитер - Солнце | candidate | simplePointMinusPoint / progressusOperand label | needsReview |
| Извращение | — | AsC + Венера - Уран | candidate | simplePointMinusPoint | candidateSimple |
| Карма | — | AsC + Сатурн - Солнце | candidate | simplePointMinusPoint | candidateSimple |
| Катастрофа | — | AsC + Уран - Сатурн | candidate | simplePointMinusPoint | candidateSimple |
| Любовь и брак | — | AsC + Венера - Юпитер | candidate | simplePointMinusPoint | candidateSimple |
| Несогласие и споры | — | AsC + Юпитер - Марс | candidate | simplePointMinusPoint | candidateSimple |
| Покушение | — | Марс + Нептун - Уран | candidate | simplePointMinusPoint, non-ASC start | needsReview |
| Страсть | — | AsC + Марс - Солнце | candidate | simplePointMinusPoint | candidateSimple |
| Торговля | — | AsC + Меркурий - Солнце | candidate | simplePointMinusPoint | candidateSimple |
| Хирургическое вмешательство | — | AsC + Сатурн - Марс | candidate | simplePointMinusPoint | candidateSimple |

### Complex Visible Rows

These rows are visible but require operands or interpretation of source notation that must be resolved later.

| Source label | Russian label | Printed formula | Complexity | Implementation status |
|---|---|---|---|---|
| Pars mortis | точка смерти | AsC + VIII - Луна | houseCuspOperand | candidateComplex |
| Pars cariere | точка профессии | AsC + PF - Сатурн (Юпитер) -> P (progressus) | dependentLotOperand / progressusOperand / needsReview | needsReview |
| Pars conjugii | точка брака | AsC + VII - Венера | houseCuspOperand | candidateComplex |
| Pars creationis | точка друзей | AsC + Луна - Уран | simplePointMinusPoint with outer planet | candidateSimple |
| Pars doloris | точка страдания | AsC + PF - Нептун | dependentLotOperand | candidateComplex |
| Pars fati | точка зла, фатум | AsC + управитель VIII - Сатурн | houseRulerOperand | blockedByMissingOperand |
| Pars mercatoris | точка коммерции | AsC + PF - pars animae | dependentLotOperand | candidateComplex |
| Pars sensis | точка экстрасенсорности | AsC - Луна - Нептун | needsReview | needsReview |
| Желание и сексуальная привлекательность | — | AsC + вершина V - управитель V | houseCuspOperand / houseRulerOperand | blockedByMissingOperand |
| Жизненные стремления | — | MC + Луна - Солнце | non-ASC anchor | needsReview |
| Жизнь женщины | — | AsC + Луна - полная Луна до рождения | lunarPhaseOperand | blockedByMissingOperand |
| Жизнь мужчины | — | AsC + Луна - молодая Луна до рождения | lunarPhaseOperand | blockedByMissingOperand |
| Материальное имущество | — | AsC + вершина II - управитель II | houseCuspOperand / houseRulerOperand | blockedByMissingOperand |
| Понимание | — | AsC + Луна - Венера или AsC + Марс - Меркурий | needsReview, alternate formulas | needsReview |
| Привязанность | — | AsC + Луна - Лунный диспозитор | houseRulerOperand / dispositorOperand | blockedByMissingOperand |
| Путешествие по воде | — | AsC + 15° Рака - Сатурн | fixedDegreeOperand | candidateComplex |
| Путешествие по воздуху | — | AsC + Уран - вершина IX | houseCuspOperand | candidateComplex |
| Путешествие по суше | — | AsC + IX - управитель IX | houseCuspOperand / houseRulerOperand | blockedByMissingOperand |
| Развод | — | AsC + Венера - вершина VII | houseCuspOperand | candidateComplex |
| Секс | — | AsC + управитель V - Плутон | houseRulerOperand | blockedByMissingOperand |
| Тайные враги | — | AsC + XII - управитель XII | houseCuspOperand / houseRulerOperand | blockedByMissingOperand |
| Честь | — | AsC + 19° Овна - Солнце | fixedDegreeOperand | candidateComplex |
| Явные враги | — | AsC + вершина VII - управитель VII | houseCuspOperand / houseRulerOperand | blockedByMissingOperand |

## Complexity Buckets

Simple rows:

- use formula pattern `AsC + pointA - pointB` or another directly readable point-minus-point arithmetic form;
- require later verification of allowed operands and project key naming;
- remain inactive until dataset update / fixtures task.

Complex rows:

- use house cusp operands such as `VII`, `VIII`, `IX`, `XII` or `вершина`;
- use house ruler operands such as `управитель`;
- use dependent Lots such as `PF` or `pars animae`;
- use lunar phase before birth;
- use fixed zodiac degrees;
- use progressus or ambiguous alternate formulas;
- require later operand policy before implementation.

## Missing Materials

Still missing / not verified from the provided source packet:

- night-birth formula section;
- complete table transcription;
- project key selection for Vronsky rows;
- conflict policy for Vronsky rows with alternate printed formulas;
- operand policy for house cusps, house rulers, dependent Lots, lunar phase before birth, fixed degrees and progressus;
- manual fixtures for any newly selected formulas.

## Candidate Status After Intake

- Source corpus: partial but accepted.
- Existing active formulas remain `pars-fortuna` and `lot-of-spirit`.
- New Vronsky rows are source-visible candidates only.
- `Pars amoris / точка любви` is a visible candidate row with suggested key `pars-amoris`; it is not automatically `lot-of-eros`.
- Original Sprint 15 candidate keys `lot-of-eros`, `lot-of-necessity`, `lot-of-basis` and `lot-of-exaltation` remain inactive/deferred and should not be treated as required Vronsky keys.
- Night formulas remain missing / not verified.

## Strict Exclusions

- no formula activation;
- no formulas from memory;
- no OCR import of the full table;
- no non-Vronsky sources for Sprint 15 activation;
- no fixtures with calculated new Lot values;
- no calculation engine changes;
- no UI/debug changes;
- no package changes;
- no service worker changes;
- no interpretations.
