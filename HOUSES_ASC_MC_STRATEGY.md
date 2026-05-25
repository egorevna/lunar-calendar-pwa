# HOUSES_ASC_MC_STRATEGY.md

## Purpose

This document defines the calculation policy and guardrails for Houses / ASC / MC.

It does not implement code.

Sprint 11 must not fake houses, ASC, or MC. If the required birth data is not ready, the app should return a safe not-ready state.

## Calculation Layers

Keep these layers separate:

1. Input readiness
2. Time conversion / birth moment
3. Coordinate readiness
4. ASC / MC calculation
5. House system calculation
6. Planet-in-house assignment
7. Display helper
8. UI
9. Debug

Do not mix these layers.

Architecture rule:

```txt
input readiness ≠ calculation engine
calculation engine ≠ display helper
display helper ≠ UI
UI ≠ provider calculations
debug ≠ raw data dump
```

## Required Inputs

Required for ASC / MC / houses:

- birth date;
- exact birth time;
- timezone or already validated UTC birth moment;
- birth place coordinates:
  - latitude;
  - longitude.

Not enough:

- country only;
- region only;
- city name without coordinates;
- unknown birth time;
- generic current location;
- “Общий день”.

## Guardrail Policy

Use exactly this policy:

1. Exact birth time + city/place with coordinates → calculate ASC / MC / houses.
2. No birth time → do not calculate ASC / MC / houses.
3. No coordinates → ask the user to select a city or manually enter coordinates.
4. Country / region only → do not calculate ASC / MC / houses.
5. City name without coordinates → require city lookup or manual coordinates before calculation.
6. Birth hospital precision is not required for normal mode. City-level coordinates are acceptable unless the user explicitly wants professional precision.

## Birth Time Accuracy

- `birthTimeAccuracy: exact` is required for Sprint 11 user-facing calculations.
- `birthTimeAccuracy: unknown` blocks ASC / MC / houses.
- Approximate time is deferred unless a separate approximate mode is approved.
- Do not calculate houses from default noon.
- Do not silently assume missing time.
- Do not show fake ASC / MC.

Safe fallback message:

```txt
Дома и углы карты недоступны.
Для расчета нужны точное время рождения и место рождения с координатами.
```

If approximate mode is added later, it must be explicitly labeled:

```txt
Расчет домов приблизительный: время рождения указано неточно.
```

Do not add approximate mode in Task 11.1.

## Coordinates

- Latitude and longitude must be finite numbers.
- City-level coordinates are acceptable.
- Exact hospital coordinates are optional.
- Manual coordinate entry may be supported later.
- City lookup may be supported later.
- If coordinates are missing, return a safe not-ready state.
- If only country/region exists, return a safe not-ready state.

Normal mode can use city-level coordinates, for example:

```txt
Москва → 55.7558 N, 37.6173 E
```

Birth hospital precision is optional, not required.

## Timezone / UTC Policy

- Use the existing validated profile time pipeline if present.
- Do not reimplement timezone parsing inside UI.
- Do not call provider from UI.
- Do not expose raw UTC datetime in user-facing UI.
- DST/timezone ambiguity must be handled by existing birth profile validation or blocked with a clear message.
- Do not silently correct ambiguous birth time.

## Initial House System Decision

Recommended initial policy:

- First supported house assignment model: Whole Sign houses, unless current dependency audit finds an already validated reliable quadrant house-cusp calculation.
- ASC and MC are still calculated as angles.
- Whole Sign house assignment:
  - 1st house starts from ASC sign;
  - subsequent houses follow zodiac sign order;
  - planet-in-house can be assigned by zodiac sign relative to ASC sign.
- Exact quadrant cusps / Placidus-like systems are deferred unless separately verified.
- Do not call Whole Sign “Placidus”.
- Always expose `houseSystem` label:
  - `whole-sign`;
  - future: `placidus`, `porphyry`, etc.

Do not implement Placidus or any quadrant system until a validated calculation method is approved.

## ASC / MC Policy

ASC / MC should be calculated only when:

- exact birth time is ready;
- valid UTC birth moment is ready;
- valid birth coordinates are ready.

ASC / MC output should include:

- sign key;
- Russian sign label;
- degree within sign;
- formatted degree text;
- full ecliptic longitude if needed internally.

Do not expose raw internal longitude in user-facing UI.

## DSC / IC Policy

DSC / IC are derived from ASC / MC:

- DSC = ASC + 180°
- IC = MC + 180°

Normalize to the zodiac circle.

Display as formatted zodiac positions.

## House Model Policy

For Whole Sign initial model:

- House 1 = ASC sign.
- House 2 = next zodiac sign.
- House 3 = next zodiac sign.
- ...
- House 12 = previous zodiac sign.
- Each house is sign-based.
- House cusps as exact quadrant degrees are not claimed in Sprint 11 unless separately implemented.
- UI must label the system clearly.

Example:

If ASC is in Aries:

```txt
House 1 = Aries
House 2 = Taurus
House 3 = Gemini
...
House 12 = Pisces
```

If ASC is in Scorpio:

```txt
House 1 = Scorpio
House 2 = Sagittarius
House 3 = Capricorn
...
House 12 = Libra
```

## Planet-in-House Assignment

For Whole Sign:

- planet sign determines house relative to ASC sign;
- planet degree is not needed for house number in Whole Sign;
- invalid/unsupported planets are ignored safely;
- natal planet objects must not be mutated;
- no interpretations.

Example:

If ASC sign is Aries:

```txt
Sun in Aries → 1st house
Moon in Taurus → 2nd house
Mars in Pisces → 12th house
```

If ASC sign is Scorpio:

```txt
Sun in Scorpio → 1st house
Moon in Sagittarius → 2nd house
Mars in Libra → 12th house
```

## Validation Requirements

Tests should include:

- exact time + coordinates ready;
- unknown time blocks;
- missing coordinates blocks;
- country-only blocks;
- city without coordinates blocks;
- ASC near 0° / 29°;
- MC near 0° / 29°;
- DSC / IC wrap-around;
- Whole Sign house sequence from ASC sign;
- planet-in-house assignment across zodiac wrap;
- no NaN;
- no undefined;
- no raw birth data in user-facing output;
- no provider imports in pure modules;
- no astronomy-engine direct imports outside approved calculation module.

## Privacy / UI Policy

User-facing UI may show:

- ASC formatted position;
- MC formatted position;
- DSC / IC formatted position;
- house system label;
- house number per planet;
- safe fallback messages.

User-facing UI must not show:

- birthDate;
- birthTime;
- utcDateTime;
- raw timezone;
- raw coordinates;
- full profile JSON;
- raw provider payload;
- raw internal longitude.

## Debug Policy

Debug can show:

- has exact birth time: true/false;
- has coordinates: true/false;
- house system;
- ASC ready: true/false;
- MC ready: true/false;
- houses ready: true/false;
- planet-in-house count.

Debug must not show:

- raw birth date;
- raw birth time;
- raw coordinates;
- raw UTC datetime;
- full profile JSON.

## Fallback States

### No active profile

```txt
Дома и углы карты недоступны.
Сначала выберите профиль.
```

### Common day / “Общий день”

```txt
Дома и углы карты недоступны для общего дня.
Нужен персональный профиль с точным временем и местом рождения.
```

### Unknown birth time

```txt
Дома и углы карты недоступны.
Для расчета нужно точное время рождения.
```

### Missing coordinates

```txt
Дома и углы карты недоступны.
Для расчета нужно место рождения с координатами.
```

### City without coordinates

```txt
Дома и углы карты недоступны.
Выберите город из справочника или введите координаты вручную.
```

## Deferred

Deferred until later tasks/sprints:

- Placidus / quadrant house cusps unless separately verified;
- Pars Fortuna;
- Arabic Parts;
- Fixed Stars;
- Special Points;
- Personal Transits;
- Interpretations;
- Ritual Scores.

## Decisions

- No fake ASC / MC / houses.
- Exact birth time is required.
- Coordinates are required.
- City-level coordinates are acceptable.
- Birth hospital coordinates are optional.
- Country/region only is not enough.
- City without coordinates is not enough.
- Whole Sign is the initial safe house system unless dependency audit proves a validated quadrant cusp implementation is available.
- Houses / ASC / MC belong to Sprint 11.
- Pars Fortuna / Arabic Parts remain Sprint 12.
