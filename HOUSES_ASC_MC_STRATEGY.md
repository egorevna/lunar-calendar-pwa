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

## House Systems Scope

Sprint 11 targets three separate house systems:

1. Whole Sign / `whole-sign`;
2. Equal House / `equal-house` / равнодомная;
3. Placidus / `placidus`.

Rules:

- these are separate systems and must not be mixed;
- every result must include a `houseSystem` label;
- UI/debug must always show selected house system;
- Whole Sign must not be called Placidus;
- Equal House must not be called Placidus;
- Placidus must not be approximated by Equal House;
- if Placidus cannot be validated in Sprint 11, keep it explicit `unsupported` / deferred;
- no house system may silently fallback to another system without explicit status and reason.

Default policy:

- default initial UI can be Whole Sign only when the profile has no saved house system selection;
- internal APIs should be system-aware from the beginning;
- user-facing UI must not imply only one house system exists;
- the existing profile-level house system selection must not be silently overridden.

## Profile House System Selection Policy

The current profile form already has a user-facing `Система домов` field. Future house calculations must use the saved profile-level `houseSystem` value as the source of truth.

Current stored profile values:

- `wholeSign` — Whole Sign;
- `equal` — Equal House / Равнодомная;
- `placidus` — Placidus.

Canonical calculation keys for future engines:

- `wholeSign` -> `whole-sign`;
- `equal` -> `equal-house`;
- `placidus` -> `placidus`.

Selected system behavior:

- `whole-sign` must call the Whole Sign engine;
- `equal-house` must call the Equal House / Равнодомная engine;
- `placidus` must call the Placidus engine only when Placidus is validated and supported;
- if Placidus is selected but not yet validated / supported, return:

```js
{
  status: "unsupported",
  reason: "placidusNotValidated"
}
```

- never silently fallback from Placidus to Whole Sign;
- never silently fallback from Placidus to Equal House;
- never silently fallback from Equal House to Whole Sign.

Every future house result must include `houseSystem`. UI/debug must show the selected house system. Task 11.4e must normalize selected profile values and route to the correct supported engine.

## Zodiac Longitude Reference vs House System Anchor

Zodiac longitude reference:

- all systems, planets, ASC, MC and cusps use the same `0°..360°` zodiac longitude scale;
- `0° Aries = 0°` zodiac longitude;
- all calculated points are normalized relative to `0° Aries`.

Whole Sign:

- house anchor = ASC sign;
- House 1 = the whole ASC sign;
- the cusp-like sign boundary for House 1 = 0° of the ASC sign;
- this is not necessarily 0° Aries.

Equal House / Равнодомная:

- house anchor = exact ASC longitude;
- cusp 1 = ASC longitude;
- cusp N = `normalize(ASC longitude + (N - 1) * 30°)`;
- this is not Placidus;
- Equal House does not start at 0° Aries unless ASC itself is exactly 0° Aries.

Placidus:

- house cusps are calculated by Placidus algorithm;
- ASC = cusp 1;
- MC = cusp 10;
- cusp longitudes are expressed on the shared zodiac longitude scale;
- 0° Aries is coordinate reference only, not house anchor;
- Placidus must not be approximated by starting houses from 0° Aries.

Correct wording:

```txt
Placidus cusp longitudes are measured on the zodiac scale where 0° Aries = 0°, but Placidus cusps are calculated from time/place geometry and anchored by ASC/MC.
```

## Placidus Dependency / Validation Policy

Rules:

- Do not implement Placidus from memory.
- Do not use unverified formula snippets.
- Prefer a verified dependency or well-tested local implementation.
- First inspect existing local dependencies / vendor files.
- Placidus requires benchmark fixtures from trusted calculators or known examples.
- If current dependencies cannot provide reliable Placidus, keep it deferred.
- For unsupported latitudes / circumpolar cases, return:

```js
{
  status: "unsupported",
  reason: "placidusUnsupportedAtLatitude"
}
```

- Never silently fallback from Placidus to Equal House.
- Never silently fallback from Placidus to Whole Sign.
- Never approximate Placidus by starting houses from 0° Aries.
- 0° Aries is coordinate reference only, not Placidus house anchor.

Current local dependency audit result for Task 11.4a:

- `astronomy-engine` is available and provides sidereal time, horizontal coordinates and rotation helpers.
- `luxon` is available for validated time conversion through existing project helpers.
- `src/astroMath.js` provides zodiac sign, degree and normalization utilities.
- No ready Placidus / house-cusp API was found in current local dependency or vendor files.
- Therefore Placidus requires separate validated integration before it can become active.

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

## House Systems Policy

### Whole Sign

- Safe first implementation.
- House 1 = ASC sign.
- Each house = one full zodiac sign.
- MC remains an angle and is not necessarily the 10th cusp.
- No quadrant cusps are claimed.
- House anchor = ASC sign.
- Result longitudes/signs are still expressed on the zodiac scale where 0° Aries = 0°.
- Whole Sign does not use exact ASC degree as cusp 1.

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

### Equal House / Равнодомная

- Safe second implementation.
- House anchor = exact ASC longitude.
- Cusp 1 = exact ASC longitude.
- Cusp N = `normalize(ASC longitude + (N - 1) * 30°)`.
- Wrap around 360°.
- MC remains an angle and is not necessarily the 10th cusp.
- This is not Placidus.
- Cusp labels should include zodiac sign + degree.
- Equal House is not sign-only.
- Equal House does not start at 0° Aries unless ASC itself is exactly 0° Aries.
- All cusp longitudes are expressed on the zodiac scale where 0° Aries = 0°.

### Placidus

- Third implementation target only after validation.
- Requires dependency / calculation audit.
- Requires benchmark fixtures.
- Must fail safely for unsupported / high-latitude / circumpolar cases.
- Must not be approximated by Equal House.
- Must not silently fallback to Whole Sign.
- House cusps are calculated by Placidus algorithm and anchored by ASC/MC, not by 0° Aries.
- ASC = cusp 1.
- MC = cusp 10.
- Planet-in-house requires longitude comparison against Placidus cusps.
- Must handle cusp wrap-around.
- Must fail safely if cusps cannot be calculated.
- Placidus cusps are output as zodiac longitudes measured from 0° Aries.

## Planet-in-House Assignment

Planet-in-house assignment is a separate later task.

Rules by system:

- Whole Sign: planet sign determines house relative to ASC sign; planet degree is not needed for house number.
- Equal House: planet-in-house requires longitude comparison across wrapped cusps.
- Placidus: planet-in-house requires longitude comparison against Placidus cusps and must handle wrap-around.
- Unsupported Placidus must return explicit unsupported state instead of falling back.
- Invalid/unsupported planets are ignored safely.
- Natal planet objects must not be mutated.
- No interpretations.

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
- Whole Sign: ASC Aries sequence;
- Whole Sign: ASC Scorpio wrap;
- Whole Sign: house 1 = ASC sign;
- Whole Sign: no cusp degrees claimed;
- Whole Sign: no Placidus label;
- Equal House: ASC 14.5° Aries -> cusp 1 Aries 14.5°, cusp 2 Taurus 14.5°, etc.;
- Equal House: ASC 29° Pisces wraps through Aries / Taurus / etc.;
- Equal House: no Placidus label;
- Equal House: cusp 1 equals exact ASC longitude;
- Equal House: does not use 0° Aries as anchor unless ASC is exactly 0° Aries;
- Placidus: benchmark examples required before ready;
- Placidus: ASC must equal cusp 1;
- Placidus: MC must equal cusp 10;
- Placidus: cusps must be measured as zodiac longitudes from 0° Aries;
- Placidus: 0° Aries must not be used as house anchor;
- Placidus: unsupported / high-latitude cases return safe unsupported;
- Placidus: no silent fallback;
- planet-in-house assignment across zodiac wrap;
- no NaN;
- no undefined;
- no raw birth data in user-facing output;
- no provider imports in pure modules;
- no astronomy-engine direct imports outside approved calculation module.

## Reasoning Requirements

PRO-level reasoning is recommended / required for:

- Task 11.4a;
- Task 11.4b;
- Task 11.4c;
- Task 11.4d;
- Task 11.4e;
- Task 11.5;
- Task 11.6.

PRO-level reasoning is not required unless issues appear for:

- Task 11.7;
- Task 11.8;
- Task 11.9;
- Task 11.10.

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

- Placidus / quadrant house cusps unless separately verified by Task 11.4d;
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
- Sprint 11 targets Whole Sign, Equal House and Placidus as separate systems.
- Whole Sign is the first implementation target.
- Equal House follows Whole Sign as the second implementation target.
- Placidus requires a validated dependency / calculation path and benchmark fixtures.
- If no validated Placidus path is found, Placidus remains explicit unsupported / deferred.
- 0° Aries is the shared zodiac longitude reference, not a Placidus house anchor.
- Whole Sign is sign-based.
- Equal House is exact-ASC-longitude based.
- Placidus is quadrant-cusp based and anchored by ASC/MC.
- Every result must include `houseSystem`.
- Houses / ASC / MC belong to Sprint 11.
- Pars Fortuna / Arabic Parts remain Sprint 12.
