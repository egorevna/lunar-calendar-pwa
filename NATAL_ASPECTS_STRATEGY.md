# NATAL_ASPECTS_STRATEGY.md

# Astro PWA — Natal Aspects Strategy

## Purpose

This document defines how Astro PWA should calculate and display natal aspects between natal planets.

It is a strategy for aspects inside one natal chart.

It is not:

- a transit engine;
- an ASC / MC or house aspect engine;
- an interpretation layer;
- a ritual scoring layer.

The main rule:

```txt
Do not show a natal aspect unless both natal planet positions are valid, calculated, and inside an explicit orb policy.
```

## Scope

Sprint 8 may use only already calculated and validated natal planet longitudes.

Allowed bodies:

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

Natal aspects require no birth-place coordinates. Coordinates remain relevant later for houses, ASC and MC.

## What Natal Aspects Are

A natal aspect is an angular relationship between two planets in the same natal chart.

Example:

```txt
Солнце □ Луна
```

The aspect is calculated from the shortest angular distance between two geocentric tropical natal longitudes.

## What Natal Aspects Are Not

Natal aspects in Sprint 8 are not:

- transit planet to natal planet aspects;
- current Moon aspects from the daily dashboard;
- aspects to ASC / MC;
- aspects to houses or house cusps;
- aspects to fixed stars;
- aspects to Lilith / Selena / Lunar Nodes;
- aspects to Arabic Parts;
- interpretations;
- predictions;
- ritual scoring.

## Active Aspect Set for Sprint 8

MVP uses major aspects only.

| Key | Angle | Symbol | RU |
|---|---:|---|---|
| conjunction | 0° | ☌ | соединение |
| sextile | 60° | ✶ | секстиль |
| square | 90° | □ | квадрат |
| trine | 120° | △ | трин |
| opposition | 180° | ☍ | оппозиция |

This matches the existing major aspect set used by `src/astroMath.js`.

## Minor Aspects Deferred

Minor aspects are deferred:

- semisextile 30°
- semisquare 45°
- quintile 72°
- sesquiquadrate 135°
- quincunx 150°
- decile 36°
- tredecile 108°
- biquintile 144°

They may be added later only through a separate approval / sprint.

The Vronsky aspect table can inform later naming, symbols and optional minor aspect catalog, but Sprint 8 must not enable minor aspects by default.

## Orb Model

Sprint 8 uses a simple two-cap orb model:

```txt
finalAllowedOrb = min(aspectBaseOrb, bodyPairOrb)
```

Orbs are project policy, not an absolute astrological truth. They can be calibrated later after real use and tests.

### Aspect Base Caps

| Aspect | Base orb |
|---|---:|
| conjunction | 8° |
| opposition | 8° |
| square | 7° |
| trine | 7° |
| sextile | 5° |

### Body-Pair Caps

| Body pair | Body-pair orb |
|---|---:|
| if Sun or Moon participates | 8° |
| personal planets without luminaries: Mercury / Venus / Mars | 6° |
| if Jupiter or Saturn participates | 5° |
| if Uranus / Neptune / Pluto participates | 5° |
| only outer planets: Uranus / Neptune / Pluto | 3° |

### Examples

- Sun square Moon: `min(7°, 8°) = 7°`.
- Mercury sextile Venus: `min(5°, 6°) = 5°`.
- Uranus conjunction Neptune: `min(8°, 3°) = 3°`.

## Exactness / Strength

Strength is a display and priority helper, not an interpretation.

Suggested bands:

- exact: `orb <= 1°`;
- strong: `orb <= 3°`;
- medium: `orb <= 5°`;
- weak: above `5°`, only if the allowed orb permits it.

No psychological or predictive meaning should be attached to strength in Sprint 8.

## Applying / Separating

Do not show applying / separating in Sprint 8.

Engine output should use:

```js
applying: null
separating: null
```

Reason:

Natal applying / separating requires careful relative-motion logic and separate validation. Speed is available in the provider layer, but Sprint 8 should not infer applying / separating until that logic is explicitly designed and tested.

## Sorting / Priority

Recommended sort order:

1. exactness: smallest orb first;
2. luminary aspects first;
3. hard aspects before soft when orb is similar:
   - hard / high-emphasis: conjunction, opposition, square;
   - soft: trine, sextile;
4. stable canonical planet order as tiebreaker.

UI summary may show:

- total aspect count;
- count of tense aspects;
- count of harmonious aspects.

Do not turn summary counts into interpretation.

## Duplicate Pair Rules

Canonical planet order:

```txt
Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto
```

Rules:

- do not create both A-B and B-A;
- order `bodyA` and `bodyB` by canonical planet order;
- ignore same-body pairs;
- ignore duplicate aspect records.

## Validation Requirements

Task 8.2 / 8.3 must cover:

- exact conjunction;
- exact opposition;
- exact square;
- exact trine;
- exact sextile;
- near aspect inside orb;
- just outside orb;
- `359° / 1°` wrap-around;
- duplicate pair prevention;
- same-body ignored;
- outer-outer narrower orb;
- luminary wider orb;
- invalid planet ignored;
- invalid longitude ignored;
- no `NaN`;
- no `undefined`;
- no raw birth data.

## Display Rules

User-facing format:

```txt
Солнце □ Луна · орб 2°15′
```

The natal aspects section must be collapsible inside `Мои карты`.

Collapsed example:

```txt
Натальные аспекты
8 аспектов найдено · 3 напряженных
[Показать]
```

Expanded example:

```txt
Солнце □ Луна · орб 2°15′
Венера △ Марс · орб 1°04′
```

Do not show long interpretations in Sprint 8.

## Privacy / Sensitive Data

Do not show in natal aspects UI or debug:

- birthDate;
- birthTime;
- utcDateTime;
- raw timezone;
- raw coordinates;
- raw birthPlace;
- raw currentPlace;
- full profile JSON;
- raw longitudes;
- raw speed values.

Allowed:

- planet names;
- aspect symbol / name;
- orb;
- summary counts;
- supported / unsupported feature flags.

## Unsupported in Sprint 8

Remain unsupported:

- transits;
- aspects to ASC / MC;
- aspects to houses;
- aspects to fixed stars;
- aspects to Lilith / Selena / Nodes;
- aspects to Arabic Parts;
- midpoints / antiscia;
- interpretations;
- ritual scoring;
- chart wheel.

## Recommended Implementation Plan

Task 8.2 — Natal Aspect Engine:

- pure engine;
- no UI;
- input: validated natal planet list;
- output: structured natal aspect list;
- apply explicit orb policy;
- prevent duplicate pairs.

Task 8.3 — Natal Aspect Validation / Fixtures:

- deterministic fixtures;
- boundary tests;
- wrap-around tests;
- no private data.

Task 8.4 — Natal Aspect Display Helper:

- pure formatter;
- no calculation inside formatter;
- no UI wiring yet.

Task 8.5 — Collapsible UI in My Cards:

- summary plus expandable list;
- hidden for `Общий день`;
- no raw birth data;
- no transits or unsupported points.

Task 8.6 — Debug:

- safe summary only;
- aspect count, supported aspect set, orb model and unsupported features;
- no full aspect dump if it exposes too much profile-derived data.

Task 8.7 — Hardening:

- confirm no fake aspects;
- confirm no transits / houses / ASC / MC;
- confirm docs and tests are synced.

## Decisions

- Sprint 8 uses major aspects only.
- Final allowed orb is `min(aspectBaseOrb, bodyPairOrb)`.
- Orbs are explicit project policy and can be calibrated later.
- Applying / separating remains `null` in Sprint 8.
- Natal aspects are calculated only from validated natal planet longitudes.
- No interpretations, transits, houses, ASC / MC, fixed stars or special points are included in Sprint 8.
