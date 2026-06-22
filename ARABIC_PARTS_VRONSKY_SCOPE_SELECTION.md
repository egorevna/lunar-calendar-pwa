# ARABIC_PARTS_VRONSKY_SCOPE_SELECTION.md

## Purpose

Defines implementation scope for Sprint 15 Vronsky Table 17 Arabic Points.

This is a docs-only scope decision. It does not activate formulas, does not update `src/arabicPartsData.js`, does not create fixtures, and does not change calculation engines.

## Decision

- Source corpus: Vronsky Table 17 only.
- Source status: partial accepted.
- Formula tradition: Vronsky Table 17 Arabic Points.
- First implementation pack: simple day-only display-safe formulas.
- Night formulas: missing / not verified.
- No silent formula use for night charts.
- No non-Vronsky source may activate formulas in Sprint 15.

## Existing Active Rows

These rows are already active in the project and are not new Sprint 15 activations:

| Source label | Russian label | Existing project key | Status |
|---|---|---|---|
| Pars Fortunae (PF) | точка счастья | `pars-fortuna` | active verified, unchanged |
| Pars animae | точка души | `lot-of-spirit` | active verified, unchanged |

Do not change existing formulas, labels, source notes, fixtures, engine behavior or UI behavior for these rows in Task 15.2c.

## Day-Only Formula Policy

The provided Vronsky source materials currently show `Для дневного рождения` formulas only.

For any new Vronsky row selected for implementation:

- formula status before dataset update: `selectedForTask15_3`;
- formula type: `dayOnlyCandidate`;
- required `chartSect`: `day`;
- if `chartSect` is `night`, `boundary`, unknown or not ready, return `notReady`;
- do not invert or modify the printed formula for night charts;
- do not fake values for night charts in display or UI;
- do not use non-Vronsky day/night variants.

This policy allows a first day-only dataset pack while keeping night formulas closed until a source page for night birth is verified.

## First Implementation Pack

Rows below are selected for Task 15.3 — Vronsky Simple Arabic Points Dataset / Fixtures.

Selection criteria:

- formula confidently visible in Vronsky Table 17;
- simple point-minus-point arithmetic;
- no house cusp operand;
- no house ruler operand;
- no PF or `pars animae` dependency;
- no lunar phase before birth;
- no fixed degree operand;
- no progressus;
- no alternate formula ambiguity;
- normal UI label considered display-safe;
- source is day-birth only, so night charts must return `notReady`.

| Suggested key | Vronsky source label | Russian label | Formula | Required inputs | Chart sect | displaySafe | Implementation status |
|---|---|---|---|---|---|---|---|
| `pars-amoris` | Pars amoris | точка любви | AsC + Венера - Солнце | ASC, Venus, Sun, chartSect | day only | true | selectedForTask15_3 |
| `pars-artis` | Pars artis | точка искусства | AsC + Меркурий - Венера | ASC, Mercury, Venus, chartSect | day only | true | selectedForTask15_3 |
| `pars-creationis` | Pars creationis | точка друзей | AsC + Луна - Уран | ASC, Moon, Uranus, chartSect | day only | true | selectedForTask15_3 |
| `pars-fratrum-et-sororum` | Pars fratrum et sororum | братья и сестры | AsC + Юпитер - Сатурн | ASC, Jupiter, Saturn, chartSect | day only | true | selectedForTask15_3 |
| `pars-hereditatis` | Pars hereditatis | точка наследства | AsC + Луна - Сатурн | ASC, Moon, Saturn, chartSect | day only | true | selectedForTask15_3 |
| `pars-itineris` | Pars itineris | точка веры | AsC + Меркурий - Луна | ASC, Mercury, Moon, chartSect | day only | true | selectedForTask15_3 |
| `pars-liberorum` | Pars liberorum | точка свободы | AsC + Сатурн - Юпитер | ASC, Saturn, Jupiter, chartSect | day only | true | selectedForTask15_3 |
| `pars-matris` | Pars matris | точка матери | AsC + Луна - Венера | ASC, Moon, Venus, chartSect | day only | true | selectedForTask15_3 |
| `pars-patris` | Pars patris | точка отца | AsC + Солнце - Сатурн | ASC, Sun, Saturn, chartSect | day only | true | selectedForTask15_3 |
| `pars-pueri` | Pars pueri | дети мужского пола | AsC + Юпитер - Луна | ASC, Jupiter, Moon, chartSect | day only | true | selectedForTask15_3 |
| `astrologia` | Астрология | Астрология | AsC + Меркурий - Уран | ASC, Mercury, Uranus, chartSect | day only | true | selectedForTask15_3 |
| `pars-mercaturae` | Торговля | Торговля | AsC + Меркурий - Солнце | ASC, Mercury, Sun, chartSect | day only | true | selectedForTask15_3 |

`Pars amoris / точка любви` must remain `pars-amoris` unless a later Vronsky-only naming decision changes it. It must not be mapped automatically to `lot-of-eros`.

## Deferred: Sensitive Labels

Rows below may remain source-visible metadata, but they are deferred from the first implementation pack and from normal user-facing UI because the labels are sensitive, fatalistic, medical, sexual, hostile or otherwise unsafe without a separate UI/safety decision.

Policy:

- source status: `sourceVisible` when confidently readable;
- active: false;
- displaySafe: false;
- normal UI: false;
- debug/status may mention counts or keys only after a future safe metadata design;
- no interpretations.

| Source label | Russian label | Formula status | Reason |
|---|---|---|---|
| Pars mortis | точка смерти | deferred | sensitive/fatalistic label and complex operand |
| Pars fati | точка зла, фатум | deferred | sensitive/fatalistic label and house ruler operand |
| Pars morbi | точка болезни | deferred | medical/sensitive label |
| Катастрофа | — | deferred | fatalistic label |
| Покушение | — | deferred | violent/sensitive label and non-ASC formula start |
| Хирургическое вмешательство | — | deferred | medical/sensitive label |
| Явные враги | — | deferred | hostile/sensitive label and complex operands |
| Тайные враги | — | deferred | hostile/sensitive label and complex operands |
| Карма | — | deferred | karmic/sensitive label |
| Извращение | — | deferred | sensitive label |
| Секс | — | deferred | sexual/sensitive label and house ruler operand |
| Страсть | — | deferred | sexual/intensity label |

## Deferred: Complex Operands

Rows below require operand policy or additional engines before they can be calculated.

| Source label / row | Printed formula | Blocker |
|---|---|---|
| Pars mortis | AsC + VIII - Луна | house cusp operand |
| Pars cariere | AsC + PF - Сатурн (Юпитер) -> P (progressus) | dependent Lot, progressus and source notation |
| Pars conjugii | AsC + VII - Венера | house cusp operand |
| Pars doloris | AsC + PF - Нептун | dependent Lot operand |
| Pars fati | AsC + управитель VIII - Сатурн | house ruler operand |
| Pars mercatoris | AsC + PF - pars animae | dependent Lots |
| Желание и сексуальная привлекательность | AsC + вершина V - управитель V | house cusp and house ruler operands |
| Жизненные стремления | MC + Луна - Солнце | non-ASC anchor policy required |
| Жизнь женщины | AsC + Луна - полная Луна до рождения | lunar phase before birth |
| Жизнь мужчины | AsC + Луна - молодая Луна до рождения | lunar phase before birth |
| Материальное имущество | AsC + вершина II - управитель II | house cusp and house ruler operands |
| Привязанность | AsC + Луна - Лунный диспозитор | lunar dispositor policy |
| Путешествие по воде | AsC + 15° Рака - Сатурн | fixed degree operand |
| Путешествие по воздуху | AsC + Уран - вершина IX | house cusp operand |
| Путешествие по суше | AsC + IX - управитель IX | house cusp and house ruler operands |
| Развод | AsC + Венера - вершина VII | house cusp operand |
| Секс | AsC + управитель V - Плутон | house ruler operand |
| Тайные враги | AsC + XII - управитель XII | house cusp and house ruler operands |
| Честь | AsC + 19° Овна - Солнце | fixed degree operand |
| Явные враги | AsC + вершина VII - управитель VII | house cusp and house ruler operands |

## Needs Review

Rows below are not selected for Task 15.3 because labels, formula notation, implementation meaning or safety handling need a separate review.

| Source label / row | Printed formula | Review reason |
|---|---|---|
| Pars scientiae | AsC + Луна - Меркурий | Russian label in source is unusual / needs exact label decision before UI text |
| Pars sensis | AsC - Луна - Нептун | formula form lacks explicit second `+` operand and needs notation decision |
| Здоровье (progress) | AsC + Юпитер - Солнце | `progress` label/meaning needs source-scope decision |
| Покушение | Марс + Нептун - Уран | non-ASC formula start and sensitive label |
| Понимание | AsC + Луна - Венера or AsC + Марс - Меркурий | alternate formulas |
| Pars familiae | AsC + Сатурн - Венера | label `счастье в браке женщины` needs UI/scope decision |
| Pars filiac | AsC + Венера - Луна | label spelling / exact key decision required |
| Любовь и брак | AsC + Венера - Юпитер | scope overlap with `Pars amoris` needs naming decision |
| Несогласие и споры | AsC + Юпитер - Марс | conflict-oriented label needs display-safety decision |

## Missing Night Formula Policy

Night-birth formulas remain missing / not verified.

Until a Vronsky night-birth source section is provided and accepted:

- do not activate night variants for new Vronsky rows;
- do not infer night variants from other traditions;
- do not invert formulas by analogy;
- return `notReady` for new Vronsky rows when chart sect is night, boundary or unknown;
- UI must show safe unavailable/fallback behavior instead of day-formula values for night charts.

## Relationship To Original Sprint 15 Candidate Keys

The original Sprint 15 candidate keys:

- `lot-of-eros`;
- `lot-of-necessity`;
- `lot-of-basis`;
- `lot-of-exaltation`;

are superseded/deferred for Sprint 15 by the Vronsky Table 17 expansion path. They remain inactive and must not be used as required Vronsky keys.

## Next Task

Task 15.3 — Vronsky Simple Arabic Points Dataset / Fixtures.

Task 15.3 should create dataset rows and static/manual fixtures for the selected first implementation pack only. It must not calculate or activate sensitive, complex, night-only or needsReview rows.

## Strict Exclusions

- no formula activation in Task 15.2c;
- no dataset changes;
- no fixtures with calculated new Lot values;
- no calculation engine changes;
- no UI/debug changes;
- no non-Vronsky sources;
- no formulas from memory;
- no interpretations;
- no package changes;
- no service worker changes.
