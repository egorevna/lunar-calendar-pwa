# MIDPOINTS_ANTISCIA_FORMULA_SCOPE_DECISION.md

## Purpose

Defines the source, formula and scope decision for Sprint 16 Midpoints / Antiscia Foundation.

This is a policy document only. It does not implement calculation code, UI, debug, tests or cache changes.

## Decision

Source status:

```txt
source-verified-for-implementation
```

Source baseline:

- local Vronsky source support confirms Midpoints / Antiscia / Contra-antiscia as sensitive calculated points;
- project policy defines exact browser-safe numeric formulas for Sprint 16;
- no interpretation source is activated.

Active formulas:

- Midpoints: shortest-arc midpoint between two normalized tropical longitudes;
- Antiscia: solstice-axis mirror across Cancer / Capricorn;
- Contra-antiscia: equinox-axis mirror across Aries / Libra.

Active target scopes:

- Midpoints: natal planets only;
- Antiscia / Contra-antiscia: natal planets + ASC / MC / DSC / IC.

## Source Support

Local source material: Vronsky, volume 1, section 4.3.7, describes:

- midpoints as mathematical sensitive points located between planets or sensitive points;
- antiscion as a point symmetric to a planet relative to the Cancer / Capricorn solstice axis;
- contra-antiscion as a point symmetric relative to the Aries / Libra equinox axis.

Vronsky source support verifies the category and axis concepts. It does not automatically define this project's first target scope, output shape, UI scope, debug scope or fixture design; those are narrowed by this Sprint 16 policy.

No interpretation text is imported or activated.

## Coordinate Basis

All Sprint 16 Midpoints / Antiscia calculations use:

- tropical ecliptic longitude;
- numeric longitude only;
- normalized output where `0 <= longitude < 360`;
- zodiac display with sign / degree / minute / second in later display helpers.

## Midpoint Formula Policy

Active midpoint formula:

```txt
shortest-arc midpoint between two normalized tropical longitudes
```

Formula:

```txt
A = normalize(longitudeA)
B = normalize(longitudeB)
delta = ((B - A + 540) % 360) - 180
midpoint = normalize(A + delta / 2)
```

Examples:

- `A = 10°`, `B = 30°` -> `20°`;
- `A = 350°`, `B = 10°` -> `0°`;
- `A = 10°`, `B = 350°` -> `0°`.

### Exact Opposition Policy

If the angular distance is exactly `180°` within the engine epsilon, the midpoint axis is ambiguous.

Required future engine behavior:

- do not silently choose an arbitrary single midpoint;
- set `exactOpposition: true`;
- set `midpointAxisAmbiguous: true`;
- engine may return candidate axis points:
  - `candidateA = normalize(A + 90)`;
  - `candidateB = normalize(candidateA + 180)`.

Display/UI policy:

- treat exact-opposition midpoint as special `notReady` / `axis-ambiguous` unless Task 16.4 later accepts a deterministic display policy;
- do not hide the edge case.

### Midpoint Axis Policy

Sprint 16 active output is the primary midpoint point only for non-opposition pairs.

Deferred:

- opposite midpoint axis point;
- midpoint-to-planet contacts;
- midpoint-to-angle contacts;
- midpoint pictures;
- Uranian combinations;
- interpretations.

## Midpoint Target Scope

Active targets:

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

Deferred midpoint targets:

- ASC;
- MC;
- DSC;
- IC;
- house cusps;
- Lunar Nodes;
- Lilith;
- Selena;
- Pars Fortuna;
- Lot of Spirit;
- Vronsky Arabic Points;
- Fixed Stars;
- custom points.

Reason: the first midpoint engine stays compact and avoids exploding pair counts.

## Antiscion Formula Policy

Active antiscion formula:

```txt
antiscionLongitude = normalize(180 - longitude)
```

Meaning: mirror across the Cancer / Capricorn solstice axis.

Examples:

- `10° Aries` -> `20° Virgo` = `170°`;
- `10° Taurus` -> `20° Leo` = `140°`;
- `10° Gemini` -> `20° Cancer` = `110°`;
- `10° Cancer` -> `20° Gemini` = `80°`;
- `10° Capricorn` -> `20° Sagittarius` = `260°`;
- `0° Cancer` -> `0° Cancer`;
- `0° Capricorn` -> `0° Capricorn`.

## Contra-antiscion Formula Policy

Active contra-antiscion formula:

```txt
contraAntiscionLongitude = normalize(360 - longitude)
```

Meaning: mirror across the Aries / Libra equinox axis.

Examples:

- `10° Aries` -> `20° Pisces` = `350°`;
- `10° Taurus` -> `20° Aquarius` = `320°`;
- `10° Gemini` -> `20° Capricorn` = `290°`;
- `10° Libra` -> `20° Virgo` = `170°`;
- `0° Aries` -> `0° Aries`;
- `0° Libra` -> `0° Libra`.

## Antiscia / Contra-antiscia Target Scope

Active targets:

- natal planets;
- ASC;
- MC;
- DSC;
- IC.

Expected target count:

```txt
14
```

Deferred targets:

- house cusps;
- Lunar Nodes;
- Lilith;
- Selena;
- Pars Fortuna;
- Lot of Spirit;
- Vronsky Arabic Points;
- Fixed Stars;
- custom points.

Reason: antiscia and contra-antiscia are per-target calculations, so adding angles keeps the first implementation compact.

## Deferred Relationships

Sprint 16 positional layers do not activate relationship/contact analysis unless a later active task explicitly changes scope.

Deferred:

- midpoint-to-planet conjunctions;
- midpoint-to-angle conjunctions;
- midpoint-to-fixed-star contacts;
- antiscia contacts;
- contra-antiscia contacts;
- midpoint pictures;
- Uranian combinations;
- transits to midpoints;
- progressions to midpoints;
- interpretations.

## Output Policy

Future midpoint output must include:

- source / system key;
- pair key;
- point A key / label;
- point B key / label;
- longitude;
- sign / degree / minute / second;
- `exactOpposition`;
- `midpointAxisAmbiguous` when applicable;
- no interpretations.

Future antiscia output must include:

- source / system key;
- target key / label;
- antiscion longitude;
- contra-antiscion longitude;
- sign / degree / minute / second;
- no interpretations.

## Privacy

Future UI/debug must not expose:

- raw birth date;
- raw birth time;
- UTC datetime;
- raw timezone value;
- raw coordinates;
- full profile JSON;
- provider payload;
- raw source arrays;
- raw calculation arrays.

Allowed:

- safe target labels;
- formatted zodiac positions with seconds;
- formula policy keys;
- counts and statuses.

## Strict Exclusions

Task 16.2 does not:

- create `src/midpoints.js`;
- create `src/antiscia.js`;
- create `src/midpointsAntiscia.js`;
- create target resolvers;
- add fixtures/tests;
- add UI/debug;
- change `src/`;
- change `test/`;
- change `sw.js`;
- change package files;
- add interpretations;
- start Task 16.3.
