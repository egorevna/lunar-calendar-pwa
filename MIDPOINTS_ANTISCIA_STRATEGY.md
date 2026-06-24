# MIDPOINTS_ANTISCIA_STRATEGY.md

## Purpose

This document defines the strategy for Sprint 16 Midpoints / Antiscia Foundation.

It does not implement code.

## Layer Separation

Keep these layers separate:

1. Source / formula / scope decision.
2. Target resolver.
3. Midpoint engine.
4. Midpoint validation.
5. Antiscia / contra-antiscia engine.
6. Antiscia validation.
7. Display helper.
8. UI.
9. Debug.
10. Hardening.

Do not mix formulas with interpretations.

## Source-Gated Requirement

No midpoint or antiscia formula should be implemented until the source/formula policy is accepted.

Task 16.2 must decide:

- midpoint formula;
- shortest-arc vs simple arithmetic policy;
- whether midpoint axis/opposite midpoint is included;
- antiscion formula;
- contra-antiscion formula;
- tropical zodiac basis;
- target scope;
- display scope;
- deferred relationships.

## Midpoint Strategy

### Recommended First Scope

Calculate pairwise midpoints between natal planets only.

Active target set:

```txt
sun
moon
mercury
venus
mars
jupiter
saturn
uranus
neptune
pluto
```

Expected pair count:

```txt
45
```

### Ordering Policy

Midpoint pairs should preserve canonical natal planet order:

```txt
Sun / Moon
Sun / Mercury
...
Neptune / Pluto
```

### Formula Policy To Verify

Candidate midpoint policy:

```txt
midpoint = shortest-arc midpoint between two normalized ecliptic longitudes
```

Wrap-around example:

```txt
350° and 10° → 0°
```

not:

```txt
180°
```

Task 16.2 must verify and document this policy.

### Deferred Midpoint Work

Deferred:

- midpoint-to-planet contacts;
- midpoint-to-angle contacts;
- midpoint trees;
- midpoint pictures;
- interpretations;
- Uranian formula combinations.

## Antiscia Strategy

### Recommended First Scope

Calculate antiscia / contra-antiscia for:

- natal planets;
- ASC;
- MC;
- DSC;
- IC.

### Formula Policy To Verify

Candidate antiscion policy:

```txt
antiscion = mirror across Cancer–Capricorn solstice axis
```

Candidate contra-antiscion policy:

```txt
contra-antiscion = mirror across Aries–Libra equinox axis
```

Task 16.2 must verify exact formulas before implementation.

### Deferred Antiscia Work

Deferred:

- antiscia for house cusps;
- antiscia for Lunar Nodes;
- antiscia for Lilith / Selena;
- antiscia for Arabic Parts;
- antiscia for Fixed Stars;
- aspect detection to antiscia;
- interpretations.

## Result Shape

Suggested midpoint result:

```js
{
  status: "ready",
  type: "midpoint",
  key: "sun-moon",
  pointA: { key: "sun", label: "Солнце" },
  pointB: { key: "moon", label: "Луна" },
  longitude: 192.5821,
  text: "Солнце / Луна — Весы 12°34′56″",
  sourcePolicy: "midpoint-shortest-arc"
}
```

Suggested antiscion result:

```js
{
  status: "ready",
  type: "antiscion",
  key: "sun-antiscion",
  targetKey: "sun",
  targetLabel: "Солнце",
  longitude: 165.1234,
  text: "Солнце — антис: Дева 15°07′24″",
  sourcePolicy: "solstice-axis-mirror"
}
```

No interpretation text.

## Display Policy

Allowed:

```txt
Солнце / Луна — Весы 12°34′56″
Солнце — антис: Дева 15°07′24″
```

Forbidden:

- psychological meaning;
- karmic claims;
- destiny claims;
- predictive text;
- ritual advice.

## Debug Policy

Debug may show:

- formula policy keys;
- target counts;
- midpoint pair count;
- antiscia target count;
- ready/notReady status;
- privacy flags.

Debug must not show:

- raw birth data;
- coordinates;
- full profile JSON;
- provider payload;
- full arrays if not needed.

## Validation Requirements

Tests must cover:

- exact midpoint cases;
- wrap-around midpoint cases;
- pair count;
- pair ordering;
- invalid inputs;
- antiscia mirror cases;
- contra-antiscia mirror cases;
- target scope;
- privacy;
- strict exclusions;
- no interpretations.

## Deferred

Deferred until later:

- interpretation layer;
- midpoint contacts;
- transit midpoint activation;
- antiscia contacts;
- custom target sets;
- broad Uranian/harmonic midpoint methods.
