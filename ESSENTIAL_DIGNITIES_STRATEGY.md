# ESSENTIAL_DIGNITIES_STRATEGY.md

## Purpose

This document fixes the Sprint 9 strategy for basic essential dignities and debilities.

Essential dignity is a lookup layer applied on top of already calculated natal planet positions:

```txt
planet + sign -> dignity / debility flags
```

It is not a coordinate calculation engine.

It must not calculate planet longitudes, houses, ASC / MC, transits, terms, decans or degree rulers.

## Scope

Sprint 9 may cover only:

- domicile / rulership;
- detriment / exile;
- exaltation;
- fall;
- optional explicit score / flags.

Sprint 9 must not cover:

- terms / термы;
- decans / деканаты;
- degree rulers / управители градусов;
- fixed stars;
- houses / ASC / MC;
- transits;
- interpretations;
- ritual scoring.

## What Essential Dignities Are

Essential dignity is a sign-based rule that evaluates the relationship between a planet and the sign it occupies.

Examples:

- Mars in Aries -> domicile / rulership.
- Venus in Virgo -> fall.
- Sun in Libra -> fall.

The input is already calculated natal planet placement, including planet key, sign key, sign label and source metadata.

## What Essential Dignities Are Not

Essential dignities are not:

- planet coordinates;
- natal aspects;
- transit aspects;
- houses;
- ASC / MC;
- terms / bounds;
- decans / faces;
- Vronsky degree rulers;
- fixed stars;
- personality interpretation;
- prediction;
- ritual scoring.

## Source Systems Considered

Sources checked:

- Skyscript, Deborah Houlding, "Understanding Ptolemy's Table of Essential Dignities": https://www.skyscript.co.uk/dig2.html
- Skyscript glossary, "Exaltation (and Fall)": https://www.skyscript.co.uk/glossary/exaltation/
- Skyscript, "Assessing Dignity/Debility through point-scoring": https://www.skyscript.co.uk/dig5.html
- AstroLibrary, "Essential Dignities of Each Planet": https://astrolibrary.org/essential-dignities/
- Domicile overview for traditional vs modern rulership context: https://en.wikipedia.org/wiki/Domicile_(astrology)

### Classical / Traditional

The classical / traditional system uses the seven traditional planets:

- Sun;
- Moon;
- Mercury;
- Venus;
- Mars;
- Jupiter;
- Saturn.

It has a stable baseline for domicile, detriment, exaltation and fall.

Outer planets are not part of the original seven-planet scheme.

### Modern Additions

Modern astrology commonly associates:

- Uranus -> Aquarius;
- Neptune -> Pisces;
- Pluto -> Scorpio.

These assignments are useful for modern astrology, but they must not silently override the classical rulership system or be mixed into classical scoring without an explicit policy.

### Vronsky-specific

The user has provided Vronsky source screenshots, including strength / exaltation-degree style material.

Those screenshots are useful future source material, but dense source tables must not be OCR-imported blindly.

Vronsky-specific tables require manual verification before becoming data.

### Hybrid

A hybrid can be safe only if each layer is explicitly separated:

- classical dignities as the main scoring baseline;
- modern outer-planet rulerships as separate optional labels;
- Vronsky tables deferred to later source/dataset work.

## Selected Sprint 9 Source Policy

Sprint 9 uses this source policy:

1. Main scoring baseline:
   - classical / traditional domicile, detriment, exaltation and fall for the seven traditional planets.

2. Modern outer planets:
   - Uranus, Neptune and Pluto may receive separate `modernRulership` labels only.
   - These labels are not included in classical score.
   - Modern detriment, exaltation and fall for outer planets are deferred.

3. Vronsky tables:
   - not encoded in Sprint 9.
   - deferred until manual source verification and a dedicated dataset task.

This prevents silent mixing of classical scoring, modern rulership and Vronsky-specific tables.

## Planet Set

Sprint 9 operates on the 10 natal planets already available in the provider layer:

- Sun / Солнце
- Moon / Луна
- Mercury / Меркурий
- Venus / Венера
- Mars / Марс
- Jupiter / Юпитер
- Saturn / Сатурн
- Uranus / Уран
- Neptune / Нептун
- Pluto / Плутон

Classical dignity scoring applies only to:

- Sun;
- Moon;
- Mercury;
- Venus;
- Mars;
- Jupiter;
- Saturn.

Modern outer planets may receive label-only `modernRulership` flags.

## Domicile / Rulership Policy

Classical baseline:

| Planet | Domicile / rulership |
|---|---|
| Sun | Leo |
| Moon | Cancer |
| Mercury | Gemini, Virgo |
| Venus | Taurus, Libra |
| Mars | Aries, Scorpio |
| Jupiter | Sagittarius, Pisces |
| Saturn | Capricorn, Aquarius |

Modern label-only flags:

| Planet | Modern rulership |
|---|---|
| Uranus | Aquarius |
| Neptune | Pisces |
| Pluto | Scorpio |

Modern rulership is separate from classical domicile and must not replace Saturn / Jupiter / Mars in Aquarius / Pisces / Scorpio in the classical baseline.

## Detriment / Exile Policy

Detriment / exile is the sign opposite domicile / rulership.

Classical baseline:

| Planet | Detriment / exile |
|---|---|
| Sun | Aquarius |
| Moon | Capricorn |
| Mercury | Sagittarius, Pisces |
| Venus | Scorpio, Aries |
| Mars | Libra, Taurus |
| Jupiter | Gemini, Virgo |
| Saturn | Cancer, Leo |

Modern outer-planet detriments are deferred in Sprint 9.

## Exaltation Policy

Classical baseline:

| Planet | Exaltation sign |
|---|---|
| Sun | Aries |
| Moon | Taurus |
| Mercury | Virgo |
| Venus | Pisces |
| Mars | Capricorn |
| Jupiter | Cancer |
| Saturn | Libra |

Uranus, Neptune and Pluto do not receive exaltation flags in Sprint 9.

Contested modern outer-planet exaltations are deferred until a separate source decision.

## Fall Policy

Fall is the sign opposite exaltation.

Classical baseline:

| Planet | Fall sign |
|---|---|
| Sun | Libra |
| Moon | Scorpio |
| Mercury | Pisces |
| Venus | Virgo |
| Mars | Cancer |
| Jupiter | Capricorn |
| Saturn | Aries |

Outer planet falls are deferred in Sprint 9.

## Outer Planets Policy

Selected policy: classical scoring plus modern label-only flags.

Rules:

- Uranus in Aquarius may receive `modernRulership: true`.
- Neptune in Pisces may receive `modernRulership: true`.
- Pluto in Scorpio may receive `modernRulership: true`.
- No classical score is added for these modern flags.
- No modern detriment / exile is calculated.
- No modern exaltation / fall is calculated.

Reason:

This keeps the 10-planet UI useful while preserving the integrity of the classical dignity score.

## Exaltation Degrees

Sprint 9 uses exaltation sign only.

Exact exaltation degree scoring is deferred.

Reason:

- exaltation degree tables require manual source verification;
- Vronsky-specific degree material must not be OCR-imported blindly;
- exact-degree scoring belongs to a later dataset task, not the first basic dignity layer.

Do not add `nearExactExaltationDegree` or exact exaltation degree scoring in Sprint 9.

## Score Model

Sprint 9 may include a simple explicit classical score:

| Condition | Score |
|---|---:|
| domicile / rulership | +5 |
| exaltation | +4 |
| detriment / exile | -5 |
| fall | -4 |
| neutral | 0 |

Modern rulership flags:

- label-only;
- no classical score;
- optional separate `modernScore: 0` or omitted.

Score is a helper, not absolute truth and not interpretation.

Do not include terms, decans, degree rulers, fixed stars, houses, aspects or retrograde state in Sprint 9 score.

## Output Shape

Possible future output:

```js
{
  planetKey: "mars",
  planetLabel: "Марс",
  signKey: "aries",
  signLabel: "Овен",
  dignities: {
    domicile: true,
    detriment: false,
    exaltation: false,
    fall: false,
    modernRulership: false
  },
  score: 5,
  labels: ["обитель"],
  source: {
    system: "classical-essential-dignities-v1",
    modernRulershipPolicy: "label-only"
  }
}
```

For outer planets:

```js
{
  planetKey: "uranus",
  planetLabel: "Уран",
  signKey: "aquarius",
  signLabel: "Водолей",
  dignities: {
    domicile: false,
    detriment: false,
    exaltation: false,
    fall: false,
    modernRulership: true
  },
  score: 0,
  labels: ["современное управление"],
  source: {
    system: "modern-rulership-label-v1",
    scoring: "none"
  }
}
```

## Display Rules

Allowed Sprint 9 UI copy:

```txt
Марс в Овне — обитель
Венера в Рыбах — экзальтация
Сатурн в Раке — изгнание
Уран в Водолее — современное управление
```

Do not show long interpretations in Sprint 9.

Do not write fatalistic copy such as:

- "эта планета плохая";
- "это разрушает жизнь";
- "слабая планета портит судьбу".

Preferred neutral copy:

- `обитель`;
- `экзальтация`;
- `изгнание`;
- `падение`;
- `современное управление`.

## Validation Requirements

Task 9.2–9.4 must cover:

- every traditional planet domicile;
- every traditional planet detriment / exile;
- every traditional planet exaltation;
- every traditional planet fall;
- neutral signs;
- invalid planets;
- invalid signs;
- source metadata;
- modern outer-planet label-only policy;
- no score from modern rulership;
- no outer-planet exaltation / fall;
- no terms / decans / degree rulers accidentally included;
- no Vronsky degree tables included prematurely;
- no raw birth data, UTC datetime, coordinates or full profile JSON.

## Deferred to Sprint 10+

Deferred:

- terms / термы;
- decans / деканаты;
- degree rulers / управители градусов;
- Vronsky degree tables;
- exact exaltation degree scoring;
- fixed stars;
- points / nodes / Lilith / Selena;
- houses / ASC / MC;
- interpretations;
- ritual scoring.

## Decisions

- Sprint 9 uses classical / traditional dignities as the scoring baseline.
- Domicile, detriment, exaltation and fall are implemented for the seven traditional planets first.
- Uranus, Neptune and Pluto may receive modern rulership labels only.
- Modern outer-planet labels do not affect classical score.
- Exact exaltation degrees are deferred.
- Vronsky tables are deferred until manual verification.
- Score model is explicit: domicile +5, exaltation +4, detriment -5, fall -4, neutral 0.
- Dignity score is a helper, not absolute truth or interpretation.
- Task 9.2 should create source-tracked dataset only; Task 9.3 should create pure lookup engine.
