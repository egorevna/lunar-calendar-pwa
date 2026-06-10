# Astro PWA — Astrology Logic Rules

## General Principle

Astrological logic must be practical, explainable, and compact. The app is not only a data calendar. It is a decision-support dashboard for timing rituals, Tarot, candles, money actions, relationship work, cleansing, and forecasts.

## Time Formatting

Main dashboard:

- Use `HH:mm`.
- Do not show seconds.

Debug screen:

- Seconds are allowed.
- Raw technical values are allowed.

## Void of Course Moon Logic

### VOC States

There are three main states:

1. VOC has not started yet.
2. VOC is active now.
3. There is no VOC in the current day.

### VOC Not Started

Show:

- `Луна без курса начнется`
- `с 13:04 до 03:03`
- `через 2ч 50м`

### VOC Active

Show:

- `Луна без курса`
- `до 03:03`
- `осталось 4ч 12м`

### No VOC Today

Show:

- `Луна в курсе`
- `Следующая VOC: дата, время`

### Last Aspect Copy

Use:

- `VOC после: □ Венера`

Alternative longer copy if needed:

- `Последний аспект перед VOC: □ Венера`

## VOC Quality Labels

Add a compact quality label based on the last Moon aspect before VOC.

Rules:

- Harmonious aspect → `мягкий VOC`
- Tense aspect → `напряженный VOC`
- Aspect with Neptune → `размытый VOC`
- Aspect with Saturn → `тяжелый VOC`
- Aspect with Mars or Uranus → `нервный VOC`

Priority if several rules match:

1. Neptune → `размытый VOC`
2. Saturn → `тяжелый VOC`
3. Mars / Uranus → `нервный VOC`
4. Tense aspect → `напряженный VOC`
5. Harmonious aspect → `мягкий VOC`

## Major Moon Aspects

Only major Moon aspects should be considered for the main dashboard:

- Conjunction.
- Sextile.
- Square.
- Trine.
- Opposition.

Minor aspects should not be shown on the main dashboard.

## Moon Aspect Display

Labels:

- `Последний аспект`
- `Следующий аспект`

Time examples:

- `□ Уран — вчера 22:13`
- `□ Уран — сегодня 22:13`
- `✶ Меркурий — завтра 06:42`

Next aspect should include countdown:

- `через 20ч 28м`

## Moon Aspect Interpretation Examples

Use short practical interpretations on tap/expand.

Examples:

- `Луна ✶ Меркурий: хорошо для раскладов, разговоров, формулировок, записей, диагностики.`
- `Луна □ Уран: нервное поле, внезапности, лучше не принимать резких решений.`

## Field Quality States

Possible field quality states:

- `Поле устойчивое: хорошо для закрепления результата.`
- `Поле тонкое: хорошо для интуиции, Таро и снов.`
- `Поле нервное: возможны резкие реакции и сбои планов.`
- `Поле плотное: хорошо для телесных практик, защиты и стабилизации.`
- `Поле очищающее: хорошо завершать, убирать и отсекать лишнее.`
- `Поле размытое: осторожно с обещаниями, договорами и ожиданиями.`
- `Поле денежное: хорошо для практик на ресурс, клиентов и устойчивый доход.`

## Main Advice Examples

Add a line:

- `Главный совет момента: ...`

Examples:

- `Лучше закреплять, а не резко менять.`
- `Делать до начала Луны без курса.`
- `Сначала чистка, потом программирование.`

## Warning Rules

Show `Осторожно сегодня` only when real red flags exist.

Example warnings:

- `VOC с 13:04 — важные запуски лучше сделать до этого времени.`
- `Напряженный аспект Луны к Урану — возможны резкие реакции.`
- `23 лунные сутки — не делать магию из злости.`
- `29 лунные сутки — лучше чистки, не запуск нового.`
- `Луна в Рыбах — риск иллюзий и эмоциональной размытости.`

Do not show an empty warning block.

## Moon Precision

Add to Moon block:

- Illumination percentage.
- Time until New Moon or Full Moon.
- Moon age.

Examples:

- `Освещенность: 32%`
- `До Новолуния: 4д 18ч`

## Planetary Hour Meanings

### Sun

`Хорошо для: видимости, силы, статуса, намерения, лидерства.`

Themes:

- Status.
- Visibility.
- Success.
- Will.
- Leadership.

### Moon

`Хорошо для: Таро, снов, семьи, интуиции, воды.`

Themes:

- Tarot.
- Dreams.
- Family.
- Intuition.
- Water.

### Mars

`Хорошо для: чисток, защиты, отсечения, активных действий.`

Themes:

- Cleansing.
- Protection.
- Cutting off.
- Active actions.

### Mercury

`Хорошо для: текстов, переговоров, карт, диагностики.`

Themes:

- Texts.
- Negotiations.
- Cards.
- Diagnostics.

### Jupiter

`Хорошо для: денег, роста, обучения, благословения.`

Themes:

- Money.
- Growth.
- Learning.
- Blessing.

### Venus

`Хорошо для: отношений, красоты, гармонии, притяжения.`

Themes:

- Relationships.
- Beauty.
- Harmony.
- Attraction.

### Saturn

`Хорошо для: защиты, границ, структуры, долгих обязательств.`

Themes:

- Protection.
- Boundaries.
- Structure.
- Long commitments.

## Best Window Logic

A good window should satisfy as many of these as possible:

- Moon is not VOC.
- There is no exact tense Moon aspect.
- Planetary hour matches the topic.
- Moon sign supports the topic.
- Day indicator does not conflict with the action.

Show 1–2 windows:

1. Best window for rituals.
2. Best window for material matters.

Fallback if no good window exists:

`Сегодня лучше завершать и очищать, а не запускать новое.`

## Mode Logic

Modes:

- General.
- Tarot.
- Candles.
- Money.
- Relationships.
- Cleansings.
- Forecasts.

Each mode changes:

- Field quality.
- Scores.
- Recommendations.
- Warnings.

## Sprint 2 Dashboard Modes

### Общее

General-purpose mode.

### Таро

Primary factors:

- Moon in water signs increases intuition;
- Mercury hour supports formulation, cards, notes, diagnostics;
- Moon hour supports dreams, intuition, inner work;
- VOC can support reflection but weakens concrete predictions;
- Neptune / Pisces increases imagery but also distortion risk.

Scores:

- Интуиция;
- Ясность трактовки;
- Риск искажений.

### Свечи

Primary factors:

- avoid starting programming candles during VOC;
- cleanings can be acceptable in waning Moon / cleansing field;
- Mars supports cutting / cleansing / protection;
- Saturn supports boundaries / protection / stability;
- Venus supports harmony / love / beauty;
- Jupiter supports growth / money / blessing.

Scores:

- Программные свечи;
- Чистки;
- Денежные свечи;
- Любовные свечи;
- Защита.

### Деньги

Primary factors:

- avoid material launches during VOC;
- Mercury supports negotiations and documents;
- Jupiter supports growth, money, learning;
- Sun supports visibility / status;
- Venus supports attraction, clients, beauty-related money.

Scores:

- Сделки;
- Продажи;
- Покупки;
- Запуск рекламы;
- Подписание.

### Отношения

Primary factors:

- Venus hour supports harmony, attraction, reconciliation;
- Moon hour supports sensitivity and family;
- Sun can support honest visibility;
- Mercury supports conversations.

Scores:

- Разговоры;
- Примирение;
- Притяжение;
- Гармонизация;
- Риск конфликта.

### Чистки

Primary factors:

- waning Moon supports cleaning / removal;
- Mars supports cutting off;
- Saturn supports boundaries / protection;
- Moon supports water / ritual sensitivity;
- 29 lunar day favors cleaning over starting.

Scores:

- Чистки;
- Отсечение;
- Защита;
- Восстановление;
- Риск отката.

### Прогнозы

Primary factors:

- Mercury supports logic, language, diagnostics;
- Moon supports intuition;
- Jupiter supports big-picture meaning;
- Neptune / Pisces can increase symbolic perception but raises distortion risk.

Scores:

- Ясность прогноза;
- Достоверность ощущения;
- Риск искажений;
- Логика;
- Интуиция.

## Sprint 2 Window Scoring Notes

Use simple heuristics first.

A first version can score:

- `+2` if planetary hour supports mode;
- `+2` if Moon sign supports mode;
- `+2` if field quality supports mode;
- `-4` if active VOC;
- `-3` if exact tense Moon aspect nearby;
- `-2` if warning conflicts with mode;
- `+1` if Tong Shu / day indicator supports stability or completion, depending on mode.

Avoid overfitting.

## Personal Transit Importance

Show only 3–5 most important current transits.

Orb rules:

- Sun, Moon, Mercury, Venus, Mars: up to 1–2 degrees.
- Jupiter, Saturn: up to 2 degrees.
- Uranus, Neptune, Pluto: up to 1.5 degrees.

Priority natal points:

- ASC.
- MC.
- Moon.
- Venus.
- Mars.
- Ruler of 2nd house.
- Ruler of 8th house.

## Personal Dashboard Goal

After adding profiles, dashboard should answer:

- Where is the Moon now in my chart?
- Which transits are activating me?
- Which rituals fit me today?
- What is the best window personally for me?
- What should I avoid today?

---

# Sprint 5 Natal Calculation Logic

Sprint 5 builds the calculation foundation for natal astrology.

Main rule:

```txt
Do not show a natal value unless it was calculated by a reliable provider and covered by tests.
```

This applies to:

- natal planets;
- houses;
- ASC;
- MC;
- aspects;
- personal transits;
- orbs.

## Zodiac Sign Mapping

Normalize all ecliptic longitudes to `0–360`.

Sign starts:

- `0°` Aries;
- `30°` Taurus;
- `60°` Gemini;
- `90°` Cancer;
- `120°` Leo;
- `150°` Virgo;
- `180°` Libra;
- `210°` Scorpio;
- `240°` Sagittarius;
- `270°` Capricorn;
- `300°` Aquarius;
- `330°` Pisces.

## Natal Aspect Rules

Major aspects:

- conjunction: `0°`;
- sextile: `60°`;
- square: `90°`;
- trine: `120°`;
- opposition: `180°`.

Orb must be explicit input for engine-foundation helpers.

Do not hardcode personal transit orbs until `NATAL_ENGINE_STRATEGY.md` approves them.

## Houses / ASC / MC

Do not calculate houses unless the house engine is reliable.

If birth time is unknown:

- houses unsupported;
- ASC / MC unsupported.

If coordinates are missing:

- houses unsupported;
- ASC / MC unsupported.

If timezone is missing:

- calculation is not ready.

## Houses / ASC / MC Policy

Sprint 11 must not fake ASC / MC / houses.

Final Sprint 11 status:

- `whole-sign`, `equal-house` and `placidus` are implemented as separate calculation engines;
- selected-system routing uses `profile.houseSystem` and does not silently fallback between systems;
- Placidus is active through the benchmark-validated local engine and returns explicit unsupported status for high-latitude / circumpolar cases;
- planet-in-house assignment is available for the selected ready house result;
- display, UI and debug layers format ready results only and do not change calculation policy;
- Sprint 11 does not add interpretations, transits, fixed stars, Pars Fortuna, Arabic Parts or ritual scoring.

Display-only zodiac formatting:

- user-facing ASC / MC and house cusp positions show degree-minute-second precision by default;
- user-facing astrology positions do not round to the nearest minute;
- explicit minute formatting remains available only for technical callers that request it;
- calculation longitudes and house cusp math remain full-precision numeric values.

Required for user-facing ASC / MC / houses:

- exact birth time;
- valid timezone or already validated UTC birth moment;
- birth place coordinates.

Guardrails:

- no birth time = no ASC / MC / houses;
- no coordinates = no ASC / MC / houses;
- country / region only is not enough;
- city without coordinates needs city lookup or manual coordinates before calculation;
- city-level coordinates are acceptable for normal mode;
- hospital-level coordinates are optional.

House systems policy:

- Sprint 11 targets `whole-sign`, `equal-house` and `placidus` as separate systems;
- systems must not be mixed and every result must include `houseSystem`;
- existing profile-level `houseSystem` selection is the source of truth for future house calculations;
- current stored profile values are `wholeSign` (Whole Sign), `equal` (Equal House / Равнодомная) and `placidus` (Placidus);
- `src/houseSystemResolver.js` normalizes current profile values into canonical calculation keys: `whole-sign`, `equal-house` and `placidus`;
- selected-system routing must call exactly one selected engine and preserve its `notReady` / `unsupported` status and reason;
- default initial UI may use Whole Sign only when the profile has no saved house system selection;
- missing `houseSystem` may default to `whole-sign`, but unknown selected systems must return explicit unsupported status;
- do not silently override a user-selected house system;
- Whole Sign is sign-based: House 1 = ASC sign, each house = full zodiac sign;
- Equal House is exact-ASC-longitude based: cusp 1 = ASC longitude, cusp N = `normalize(ASC longitude + (N - 1) * 30°)`;
- Placidus is quadrant-cusp based and anchored by ASC/MC;
- Placidus is active only through the validated `placidus` engine and must not silently fallback to Equal House or Whole Sign;
- if Placidus cannot be calculated for unsupported / high-latitude / circumpolar cases, return explicit `status: "unsupported"` with `reason: "placidusUnsupportedAtLatitude"`;
- Equal House must not silently fallback to Whole Sign;
- 0° Aries is the zodiac longitude coordinate reference for all systems;
- 0° Aries is not the Placidus house anchor;
- ASC / MC are still calculated as angles;
- DSC / IC are derived from ASC / MC;
- do not call Whole Sign `Placidus`;
- do not call Equal House `Placidus`;
- do not approximate Placidus with Equal House or Whole Sign;
- always expose the `houseSystem` label when houses are displayed or debugged;
- Placidus / quadrant cusps must remain isolated to the validated Placidus engine.
- `test/housesValidation.test.js` and `test/fixtures/housesValidationFixtures.js` validate the three house systems as separate systems, including router no-fallback behavior and guardrail failure states.

ASC / MC calculation policy:

- validate Sprint 11 input guardrails before profile-level angle calculation;
- resolve the birth moment to UTC through the existing birth date/time pipeline;
- use east-positive birth longitude for local sidereal time;
- calculate ASC / MC with vector geometry over the ecliptic / horizon / meridian intersections;
- sidereal time source: tracked `astronomy-engine` vendor `SiderealTime()`;
- obliquity source: internal mean-obliquity approximation until a separately validated obliquity source is approved;
- derive DSC / IC by adding 180 degrees to ASC / MC;
- do not calculate houses, house cusps or planet-in-house assignment in the ASC / MC module.

Whole Sign boundary policy:

- House 1 = ASC sign;
- Sprint 11 Task 11.4b implements this as the pure `whole-sign` engine;
- planet-in-house depends on sign relative to ASC sign;
- planet degree is not needed for house number;
- MC remains independent angle;
- MC is not necessarily the 10th house cusp in Whole Sign;
- Whole Sign does not use exact ASC degree as cusp 1;
- Whole Sign does not start at 0° Aries unless ASC sign is Aries and the relevant sign boundary is Aries 0°.
- Equal House and Placidus remain separate later modules and must not be calculated by the Whole Sign engine.

Equal House boundary policy:

- cusp 1 = exact ASC longitude;
- Sprint 11 Task 11.4c implements this as the pure `equal-house` / Равнодомная engine;
- cusp N = `normalize(ASC longitude + (N - 1) * 30°)`;
- cusp labels should include zodiac sign + degree;
- MC remains independent angle;
- MC is not necessarily the 10th house cusp in Equal House;
- planet-in-house requires longitude comparison across wrapped cusps;
- Equal House is not sign-only and is not Placidus;
- Equal House does not start at 0° Aries unless ASC itself is exactly 0° Aries.
- Whole Sign and Placidus remain separate modules and must not be calculated by the Equal House engine.

Placidus boundary policy:

- Placidus uses quadrant cusps;
- Sprint 11 Task 11.4d2 activates Placidus through `src/placidusHouses.js` as a browser-safe local calculation engine;
- ASC = cusp 1;
- MC = cusp 10;
- Placidus ready results derive displayed ASC / MC / DSC / IC from cusps 1 / 10 / 7 / 4 so angles and cusps share one source of truth;
- planet-in-house requires longitude comparison against Placidus cusps;
- unsupported / high-latitude / circumpolar cases must fail safely;
- Placidus cusps are output as zodiac longitudes measured from 0° Aries;
- Placidus does not start from 0° Aries as house anchor;
- Placidus must not be approximated by Equal House or Whole Sign;
- current local `astronomy-engine` / vendor runtime does not provide a ready Placidus / house-cusp API;
- local `swisseph.swe_houses` is used only as the static benchmark oracle and is not imported or bundled in app runtime modules;
- the current package is private/local; future public or commercial distribution requires a Swiss Ephemeris / `swisseph` license review before relying on that benchmark path;
- Placidus calculation uses true obliquity from the tracked Astronomy Engine runtime for Swiss-aligned cusp anchors;
- Placidus calculation uses a local semi-arc cusp method validated against 6 static `local-swisseph-swe_houses-benchmark` fixtures;
- benchmark tolerance is `0.05°`;
- current validation status is `validated: true`, `implementationReady: true`, `benchmarkFixtures: true`, `benchmarkFixtureCount: 6` and `reason: null`;
- high-latitude / circumpolar unsupported cases return explicit `status: "unsupported"` with `reason: "placidusUnsupportedAtLatitude"`;
- profile-level Placidus calculation still requires exact birth time, timezone and birth coordinates through Sprint 11 guardrails.

Planet-in-house assignment policy:

- Sprint 11 Task 11.6 implements this as the pure `src/planetInHouses.js` assignment layer;
- assignment uses the selected house-system result and does not calculate houses itself;
- Whole Sign assignment uses planet sign relative to ASC sign;
- if a Whole Sign planet sign is missing but zodiac longitude is valid, sign may be derived from that longitude;
- Equal House and Placidus assignment require planet zodiac longitude and compare it against ready house cusp spans;
- cusp spans are half-open: `[cuspLongitude, nextCuspLongitude)`;
- exact cusp boundary belongs to the house starting at that cusp;
- wrapping spans across 0° use `longitude >= cuspLongitude OR longitude < nextCuspLongitude`;
- invalid planet entries return safe invalid assignments instead of crashing or being interpreted;
- profile-level assignment uses the safe natal planets path and selected-system router;
- no interpretations, fixed stars, transits or ritual scoring are added by this layer.

Deferred:

- Pars Fortuna / Arabic Parts remain Sprint 12;
- fixed stars, personal transits, interpretations and ritual scoring remain outside Sprint 11 strategy until explicitly moved into `TODO.md`.

## Sprint 12 — House Cusps / Pars Fortuna / Arabic Parts Policy

Sprint 12 adds calculation-ready points on top of Sprint 11 without changing the Sprint 11 house engines.

Core policy:

- canonical house cusps must be derived from the selected house-system result (`whole-sign`, `equal-house` or `placidus`);
- Sprint 12 must reuse Sprint 11 guardrails, ASC / MC, Whole Sign, Equal House, Placidus and selected-system routing;
- no new house systems are introduced in Sprint 12;
- Pars Fortuna requires explicit day / night chart status before calculation;
- Pars Fortuna formula policy is day chart `ASC + Moon - Sun`, night chart `ASC + Sun - Moon`, with all longitudes normalized to `0 <= longitude < 360`;
- Arabic Parts formulas must be verified before activation;
- no Arabic Part may be calculated from memory or activated with `pending`, `draft` or `needsReview` formula status;
- if day/night status or required formula inputs are missing, return safe not-ready / deferred status instead of fake values;
- lots / parts may be assigned to houses only through the selected ready house-system result;
- house-system fallback remains forbidden: Placidus must not fallback to Equal House or Whole Sign, and Equal House must not fallback to Whole Sign;
- Sprint 12 does not add interpretations, ritual scoring, fixed stars or transits.

Canonical cusp policy:

- Whole Sign canonical cusps are sign-boundary outputs: house 1 starts at 0° of the ASC sign, house 2 at 0° of the next sign and so on; `exactCuspDegrees` is false, and the exact ASC degree is not treated as the first cusp.
- Equal House canonical cusps are exact cusps from the Equal House result: cusp 1 is the exact ASC longitude, and each next cusp is +30° normalized.
- Placidus canonical cusps are exact benchmark-validated quadrant cusps from the Placidus result; cusps 1 / 10 / 7 / 4 correspond to ASC / MC / DSC / IC.
- Canonical cusp output reuses selected house-system results and must not recalculate or substitute house systems.

Day / night chart policy:

- day/night status is determined from geometric Sun altitude relative to the horizon, not from local clock time;
- day chart means the Sun altitude is above the horizon by more than the explicit boundary tolerance;
- night chart means the Sun altitude is below the horizon by more than the explicit boundary tolerance;
- if the Sun is on or too close to the horizon, return explicit `boundary` status and do not choose a day or night formula;
- no Pars Fortuna or Arabic Part formula may silently default to a day or night variant when chart sect is unknown.

Pars Fortuna policy:

- Pars Fortuna / Lot of Fortune uses only numeric tropical longitudes, not formatted display text;
- required inputs are ASC, Sun, Moon and explicit day/night chart status;
- day chart formula is `ASC + Moon - Sun`;
- night chart formula is `ASC + Sun - Moon`;
- the final longitude is normalized to `0 <= longitude < 360`;
- if chart sect is `boundary`, unknown or not ready, Pars Fortuna returns safe `notReady` instead of choosing a formula;
- `src/parsFortuna.js` remains the single-lot Pars Fortuna engine and does not implement Lot of Spirit, a broad Arabic Parts catalog, house assignment or interpretations.

Arabic Parts formula dataset policy:

- Arabic Parts use a verified-only activation policy;
- no formula may become active from memory alone;
- `pars-fortuna` and `lot-of-spirit` are currently active verified formula rows;
- Lot of Spirit is verified in Task 12.5b as the inverse day/night pair to Pars Fortuna;
- Lot of Spirit day chart formula is `ASC + Sun - Moon`;
- Lot of Spirit night chart formula is `ASC + Moon - Sun`;
- Lot of Eros, Lot of Necessity, Lot of Basis, Lot of Exaltation and other additional parts remain deferred until source verification;
- the formula dataset is data-only and does not calculate lots/parts;
- Task 12.5b did not implement calculation, house assignment, UI or interpretations.

Basic Arabic Parts engine policy:

- `src/arabicParts.js` calculates only active verified formula rows from `src/arabicPartsData.js`;
- current active calculated keys are `pars-fortuna` and `lot-of-spirit`;
- Pars Fortuna day/night formulas remain:
  - day `ASC + Moon - Sun`;
  - night `ASC + Sun - Moon`;
- Lot of Spirit day/night formulas remain:
  - day `ASC + Sun - Moon`;
  - night `ASC + Moon - Sun`;
- formula operands use numeric tropical longitudes only, never display text;
- results are normalized to `0 <= longitude < 360` and formatted with degree-minute-second display;
- `boundary`, unknown or not-ready chart sect returns safe `notReady`; no default formula variant is chosen;
- deferred formula rows must not produce ready values;
- Task 12.6 does not assign lots/parts to houses, add UI/debug/display helpers, add interpretations or activate additional Arabic Parts.

Lots / Arabic Parts house-assignment policy:

- `src/arabicPartsHouseAssignment.js` assigns only already-calculated active verified lots/parts to houses;
- assignment uses numeric lot longitude against canonical cusps from the selected house system;
- Whole Sign uses canonical sign-boundary cusps, not exact ASC degree;
- Equal House uses exact ASC + 30° canonical cusps;
- Placidus uses benchmark-validated canonical Placidus cusps;
- each house span is half-open: `[cusp, nextCusp)`;
- exact cusp boundary belongs to the house that starts at that cusp;
- wrapping spans across 360° are supported;
- no formula calculation, deferred Arabic Parts activation, UI, display helper or interpretations are added in Task 12.7.

User-facing and debug policy:

- zodiac positions for lots / parts use degree-minute-second display, matching the current astrology position policy;
- UI/debug must not expose raw birth date, birth time, UTC datetime, raw timezone, raw coordinates, full profile JSON, provider payloads or raw intermediate calculation arrays;
- debug may show safe readiness flags, selected system, formula key, formula variant, result counts and house assignment counts.

## Sprint 13 — Special Points Policy

Sprint 13 adds a controlled Special Points foundation without changing Sprint 11 house engines or Sprint 12 Arabic Parts formulas.

Core policy:

- Mean Lunar Nodes are the active Sprint 13 node system.
- Active Lunar Nodes source system: `mean-lunar-node` / `lunar-nodes-mean`.
- True Lunar Node remains deferred until a separate source decision.
- South Node is derived as `normalize(North Node + 180°)` and uses the same source metadata as North Node.
- Mean Lilith / Mean Lunar Apogee is source-verified and active; true / osculating / interpolated Lilith remain deferred.
- Selena was source-gated at Sprint 13 start; Task 13.7 verifies the `selena-white-moon` source target and Task 13.8 implements it in `src/selena.js`.
- No special point may be faked or calculated from memory.
- Unsupported or source-gated points must return safe deferred / not-ready status instead of fake zodiac positions.
- Special Points output may show formatted zodiac positions with seconds and house labels when verified.
- Special Points UI/debug must not expose raw birth data, UTC, raw timezone, raw coordinates, full profile JSON, provider payloads or raw calculation arrays.
- Sprint 13 does not add interpretations, ritual scoring, Fixed Stars, transits, Arabic Parts Expansion Pack, Midpoints or Antiscia.

## Lunar Nodes Policy

Task 13.2 selects Mean Lunar Node as the active Sprint 13 node system. Task 13.3 implements that policy in `src/lunarNodes.js`.

Policy:

- active node type: mean;
- source system key: `lunar-nodes-mean`;
- North Node is calculated from the active mean lunar ascending node longitude formula and normalized into tropical zodiac `0 <= longitude < 360`;
- South Node is always `normalize(North Node + 180°)`;
- South Node must not be independently calculated from a different source;
- user-facing output uses sign, degree, minute and second;
- true node is deferred until a separate source policy;
- validation uses static benchmark fixtures checked against local Swiss Ephemeris `SE_MEAN_NODE`, with Swiss Ephemeris allowed only as a dev/test oracle;
- `swisseph` must not be imported into PWA runtime modules;
- profile-level Lunar Nodes require exact birth time and timezone; birth coordinates are not required for this geocentric node position layer;
- no interpretations, karmic/fatalistic text, ritual scoring, Lilith or Selena are added by this policy.

House assignment policy:

- Lunar Nodes house assignment uses the exact numeric longitude of the node against canonical cusps from the selected house system;
- Whole Sign uses sign-boundary cusps, not exact ASC degree;
- Equal House and Placidus use exact canonical cusp longitudes;
- each house span is half-open: `[cusp, nextCusp)`;
- an exact cusp boundary belongs to the house that starts at that cusp;
- wrap-around spans across `360° -> 0°` are supported;
- profile-level house assignment requires ready house cusps, so exact time and coordinates are needed for assignment even though Lunar Nodes longitude itself does not require coordinates;
- no display text is used for assignment math.

## Lilith Policy

Task 13.5 verifies Mean Black Moon Lilith / Mean Lunar Apogee as the first Lilith implementation target.
Task 13.6 implements that policy in `src/lilith.js`.

Policy:

- active Lilith variant: Mean Black Moon Lilith / Mean Lunar Apogee;
- source system key: `mean-black-moon-lilith`;
- source key: `mean-lunar-apogee`;
- runtime: browser-safe local implementation;
- benchmark oracle: static local Swiss Ephemeris `SE_MEAN_APOG` / `swe_calc_ut` fixtures;
- user-facing labels: `Лилит`, `Средняя Лилит`, `Black Moon Lilith`, `Mean Lunar Apogee`;
- Mean Lilith longitude is normalized into tropical zodiac `0 <= longitude < 360`;
- user-facing output uses sign, degree, minute and second;
- profile-level Mean Lilith requires exact birth time and timezone; birth coordinates are not required for this geocentric point longitude layer;
- True / Osculating Black Moon Lilith remains deferred;
- interpolated / natural Lilith remains deferred if encountered;
- local Astronomy Engine support is limited to lunar apsis event search and is not an approved Black Moon Lilith longitude API for arbitrary UTC moments;
- local Swiss Ephemeris supports `SE_MEAN_APOG`, `SE_OSCU_APOG` and `SE_INTP_APOG`, but it may be used only as a local static benchmark oracle, not PWA runtime;
- Task 13.6 includes static benchmark fixtures and strict no-mixing between mean, osculating and interpolated variants;
- no fake Lilith zodiac position is allowed;
- no interpretations, karmic/fatalistic text, dark destiny language or ritual scoring are allowed.

## Selena Policy

Task 13.7 verifies Selena / White Moon as a source-verified implementation target.
Task 13.8 implements that policy in `src/selena.js`.

Policy:

- Selena status: `source-verified-for-implementation`;
- active source system: `selena-white-moon`;
- source key: `swiss-ephemeris-seorbel-white-moon`;
- calculation method: `swisseph-seorbel-white-moon-linear-elements`;
- Selena / White Moon is treated as a Swiss Ephemeris fictitious / hypothetical calculated point, not as a physical astronomical body;
- point type: `fictitious-calculated-point`;
- runtime: browser-safe local implementation;
- benchmark oracle: static local Swiss Ephemeris `SE_WHITE_MOON` / `swe_calc_ut` fixtures;
- local source row: Swiss Ephemeris `seorbel.txt` explicitly defines `Selena/White Moon, geo #17`;
- user-facing labels: `Селена`, `Белая Луна`, `Selena`, `White Moon`;
- Selena longitude is normalized into tropical zodiac `0 <= longitude < 360`;
- user-facing output uses sign, degree, minute and second;
- profile-level Selena requires exact birth time and timezone; birth coordinates are not required for this geocentric fictitious point longitude layer;
- local Astronomy Engine support is limited to lunar apsis event search and is not an approved Selena / White Moon longitude API for arbitrary UTC moments;
- local Swiss Ephemeris may be used only as a local static benchmark oracle, not PWA runtime;
- Task 13.8 includes static benchmark fixtures, source labels and strict no-fake-value tests;
- no alternate Selena source system is active;
- no fake Selena zodiac position is allowed;
- no interpretations, karmic/fatalistic text, guardian-angel language, ritual advice or ritual scoring are allowed.

## Fixed Stars Policy

Sprint 14 starts a controlled Fixed Stars foundation. Task 14.1 is strategy/status only. Task 14.2 defines the source/catalog/orb policy. Task 14.3 adds a source-tracked catalog dataset only. Task 14.4 adds a pure position / epoch engine. These tasks do not add a Fixed Stars conjunction engine, UI, debug section or interpretations.

Policy:

- Fixed Stars are source-gated.
- Primary astrology source: `Вронский, Таблица 18 — Неподвижные звезды`.
- Primary source system key: `fixed-stars-vronsky-table-18`.
- Validation source: Swiss / modern fixed-star validation where possible.
- Swiss / modern validation supports identity and coordinate checks, but must not replace the Vronsky primary source silently.
- No fixed star catalog row may be activated from memory.
- Candidate initial subset: Алголь, Альдебаран, Ригель, Бетельгейзе, Сириус, Канопус, Регул, Спика, Арктур, Антарес, Вега, Альтаир, Фомальгаут.
- Task 14.3 manually verifies 13 active source-tracked rows from the candidate subset: Алголь, Альдебаран, Ригель, Бетельгейзе, Сириус, Канопус, Регул, Спика, Арктур, Антарес, Вега, Альтаир, Фомальгаут.
- Candidate row count after Task 14.3 is 0.
- Active catalog rows require documented source metadata, coordinate data, epoch / coordinate policy, verification status and active flag.
- Vronsky 1950 / 1970 / 1990 columns must be preserved where available.
- The Vronsky 1990 column is the initial reference epoch for verified source rows.
- Task 14.3 preserves source coordinates as catalog evidence only; it does not calculate date-of-birth star positions.
- Task 14.4 adds `src/fixedStarPositions.js` as a pure position / epoch layer for source-tracked rows.
- Position policy:
  - exact requested epochs 1950 / 1970 / 1990 use the preserved source coordinate;
  - dates between 1950–1970 and 1970–1990 use linear interpolation;
  - dates before 1950 and after 1990 use explicit linear extrapolation with output flags;
  - longitudes crossing 0° Aries are unwrapped before interpolation / extrapolation and normalized afterward;
  - output is tropical zodiac longitude with sign / degree / minute / second.
- The position layer does not resolve natal targets and does not calculate conjunctions.
- The project must not silently mix J2000, date-of-birth, tropical, sidereal or other epoch/coordinate systems.
- Orb policy: global conjunction orb `1°00′`, policy key `fixed-stars-global-conjunction-orb-1deg`.
- No hidden “near star” rule is allowed.
- Per-star and per-target orb overrides are deferred.
- Initial relationship policy is conjunction-only.
- Deferred relationship types include oppositions, squares, trines, parans, heliacal phenomena and star-rise/set calculations.
- Initial target set: natal planets + ASC / MC / DSC / IC.
- Deferred targets: house cusps, Lunar Nodes, Lilith, Selena, Pars Fortuna, Lot of Spirit, Arabic Parts and custom points.
- Task 14.5 adds a pure target resolver for the active target set only.
- Fixed Star target rows use numeric tropical longitudes from ready natal planet and ASC / MC angle results.
- Active target order is natal planets first (Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto), then angles (ASC, MC, DSC, IC).
- If one active target set is unavailable, resolver output may be `partial`; missing targets are not faked.
- Deferred target sets remain metadata-only and must not appear as ready Fixed Star targets.
- User-facing output may eventually show fixed star labels, safe target labels, formatted zodiac positions with seconds and explicit orb text.
- No interpretations, mythology text, predictive claims, karmic/fatalistic language, ritual advice or ritual scoring are allowed.

## Personal Transits

Do not show personal transits until both natal positions and current planetary positions are reliable.

Transit output must include:

- transit body;
- aspect;
- natal body / point;
- orb;
- exactness;
- source / provider.

---

# Sprint 6 Natal Provider / Fixture Rules

Sprint 6 is about selecting and validating a real local natal provider before any user-facing natal values are shown.

## Provider Approval Rule

Do not use a provider for user-facing natal values until:

- provider is selected;
- privacy behavior is checked;
- license is acceptable;
- browser/PWA compatibility is confirmed;
- bundle impact is understood;
- fixture tests pass;
- unsupported features are explicit.

Adding or connecting a real provider dependency requires separate user approval.

## Fixture Rule

Every real provider must be validated with fixture tests before production use.

Fixtures must use public, documented, or synthetic examples, not private user profiles.

Fixture expectations should include:

- source;
- tolerance;
- birth date/time/timezone inputs;
- coordinates when relevant;
- expected planet longitude or sign/degree when available.

Provider-layer smoke tests may verify that a local provider returns finite normalized candidate longitudes, but smoke tests are not reference fixture validation.

Candidate provider output must remain non-user-facing until approved expected values and tolerances are added and passed.

## Unsupported Feature Rule

If a provider cannot calculate a feature:

- return `notSupported`;
- do not approximate silently;
- do not show user-facing values;
- keep the limitation visible in tests and debug output.

This applies to:

- natal planets;
- retrograde / speed;
- houses;
- ASC / MC;
- aspects;
- transits;
- orbs.

## Planet Position Rule

Provider-backed planetary positions must include:

- body key;
- longitude;
- sign / degree after normalization;
- source / provider.

Retrograde and speed must be provider-backed. Do not infer them without provider support.

## Speed / Retrograde Validation Rule

Provider-layer longitude speed may be enabled only after independent reference validation.

Current validated Sprint 6 rule:

- source: `astronomy-engine@2.1.19`;
- speed method: central difference of the validated geocentric tropical longitude path;
- reference: local `swisseph` dev dependency in Node tests;
- Swiss Ephemeris flags: `SEFLG_SWIEPH | SEFLG_SPEED`;
- tolerance: `0.02°/day` for Sun and planets, `0.05°/day` for Moon;
- retrograde: `speed < 0`, validated against Swiss Ephemeris speed sign.

This does not approve houses, ASC / MC, transits, aspects, orbs, local birth timezone conversion, or user-facing natal UI.

---

# Sprint 7 Natal Planets User-Facing Rules

Sprint 7 is about a conservative read-only natal planets UI layer.

## User-Facing Natal Values Rule

Natal planet values may be user-facing only when:

- provider output is ready;
- input is ready;
- fixture validation has passed;
- values are not synthetic or mock values;
- output is formatted through approved display helpers.

## No Fake UTC Rule

Do not show natal planets if local birth time has not been safely converted to provider-ready UTC.

`birthDateTime` may return provider-ready UTC only when:

- birth date is valid;
- known birth time is valid;
- birth timezone is a valid IANA timezone;
- Luxon conversion succeeds;
- local time is not an ambiguous DST overlap;
- local time is not a nonexistent DST gap.

If `birthDateTime` returns `canConvertToUtc: false`, user-facing natal planet values must remain hidden or unavailable.

Unknown birth time, invalid timezone, ambiguous local time, and nonexistent local time must fail closed.

## Unsupported Features In Sprint 7

These remain `notSupported` in Sprint 7:

- houses;
- ASC / MC;
- personal transits;
- natal aspects;
- orbs;
- chart wheel;
- personal ritual scoring.

---

# Sprint 8 Natal Aspect Logic

Sprint 8 is about natal aspects between natal planets in a single natal chart.

Natal aspects must not be confused with:

- personal transits;
- transit aspects;
- current Moon aspects;
- aspects to ASC / MC;
- aspects to houses;
- aspects to fixed stars.

## Major Aspect Set

Sprint 8 starts with major aspects only:

- conjunction: `0°`;
- sextile: `60°`;
- square: `90°`;
- trine: `120°`;
- opposition: `180°`.

Minor aspects require explicit approval before becoming user-facing.

## Orb Rule

An aspect is valid only when angular distance is within the configured orb.

No hidden arbitrary orbs.

Orb policy must be documented in `NATAL_ASPECTS_STRATEGY.md` before the aspect engine is implemented.

Selected Sprint 8 policy:

```txt
finalAllowedOrb = min(aspectBaseOrb, bodyPairOrb)
```

Aspect base caps:

- conjunction: `8°`;
- opposition: `8°`;
- square: `7°`;
- trine: `7°`;
- sextile: `5°`.

Body-pair caps:

- if Sun or Moon participates: `8°`;
- personal planets without luminaries, Mercury / Venus / Mars: `6°`;
- if Jupiter or Saturn participates: `5°`;
- if Uranus / Neptune / Pluto participates: `5°`;
- only outer planets, Uranus / Neptune / Pluto: `3°`.

Orbs are Astro PWA project policy and may be calibrated later.

Strength bands are:

- exact: `orb <= 1°`;
- strong: `orb <= 3°`;
- medium: `orb <= 5°`;
- weak: above `5°`, only if the allowed orb permits it.

Strength is a priority / display helper, not an interpretation.

Applying / separating remains unsupported in Sprint 8 and should be returned as `null` until separately validated.

## Validation Rule

Do not show a natal aspect unless:

- both bodies have valid natal longitudes;
- angular distance is calculated correctly;
- `0/360` wrap-around is handled;
- the aspect is inside the allowed orb;
- duplicate pairs are removed;
- same-body aspects are ignored.

## Unsupported In Sprint 8

These remain unsupported unless a later explicit task says otherwise:

- transit aspects;
- aspects to ASC / MC;
- aspects to houses;
- aspects to Arabic Parts;
- aspects to fixed stars;
- applying / separating unless explicitly validated;
- interpretation engine;
- personal ritual scoring.

---

# Sprint 9 Essential Dignities Logic Addendum

Sprint 9 covers basic sign-based essential dignities for natal planets.

## Essential Dignity Rule

Essential dignity is a lookup layer applied to already-calculated planet positions and sign placement.

It must not calculate coordinates.

Do not calculate natal planet positions from dignity tables, and do not mix dignity systems silently.

## Sprint 9 Scope

Allowed in Sprint 9:

- domicile / rulership;
- detriment / exile;
- exaltation;
- fall.

Not allowed in Sprint 9:

- terms;
- decans;
- degree rulers;
- fixed stars;
- houses;
- ASC / MC;
- transits;
- interpretations;
- ritual scoring.

## Source Rule

The dignity dataset must name its source.

If Vronsky-specific values are used, mark them as such.

If classical / traditional values are used, mark them as such.

Do not combine source systems without an explicit strategy decision.

## Selected Sprint 9 Dignity Policy

Sprint 9 uses classical / traditional domicile, detriment, exaltation and fall as the main scoring baseline for Sun, Moon, Mercury, Venus, Mars, Jupiter and Saturn.

Uranus, Neptune and Pluto may receive separate modern rulership labels only:

- Uranus in Aquarius;
- Neptune in Pisces;
- Pluto in Scorpio.

These modern rulership labels do not change the classical score.

Vronsky-specific tables, terms, decans, degree rulers and exact exaltation degree scoring are deferred until manual source verification and dedicated dataset work.

## Score Rule

Any dignity score must be explicit, simple and adjustable.

Do not present score as absolute truth or final interpretation.

Sprint 9 helper scoring policy:

- domicile / rulership: +5;
- exaltation: +4;
- detriment / exile: -5;
- fall: -4;
- neutral: 0;
- modern rulership: label-only, no classical score.

If a planet has multiple classical flags in the selected source policy, scores are additive.

Examples:

- Mercury in Virgo: domicile + exaltation = +9.
- Mercury in Pisces: detriment + fall = -9.

Modern rulership labels remain outside the classical score even when present.

---

# Sprint 10 Terms / Decans / Degree Rulers Logic Addendum

Sprint 10 is about detailed dignity lookup layers applied after planet coordinates are known.

## Lookup Layer Rule

Terms, decans and degree rulers use:

- sign;
- degree within sign;
- selected source system.

They do not calculate planet coordinates, houses, ASC / MC, transits or aspects.

## Source Rule

Each dataset must name its source system.

Do not mix source systems silently, including:

- Vronsky terms;
- Star of the Magi degree rulers;
- Vronsky degree rulers;
- trigon / triplicity decans;
- Chaldean decans.

Multiple source systems may be supported later only if the strategy explicitly defines source modes and UI/debug labels.

## Vronsky Screenshot Rule

User-provided Vronsky screenshots are source material, not active data by themselves.

Do not OCR-import dense tables blindly.

Before any row becomes active dataset data, it must have:

- manual entry;
- source/table reference;
- row-level verification;
- boundary tests;
- dataset metadata.

## Boundary Rule

Degree range lookup must be explicit.

Preferred interval policy:

```txt
[startDegree, endDegree)
```

The final interval ends at `30°`.

Tests must cover sign start, every boundary, the last degree before sign end, invalid sign/degree input, and no `NaN`.

## Task 10.3c Terms Dataset Policy

Vronsky Table 5 terms rows are active only after manual image-to-draft verification.

The active Table 5 dataset stores both:

- `printedEndDegree` — the source value as printed;
- `normalizedEndExclusive` — the future half-open lookup boundary.

For final printed intervals ending at `29°`, preserve `printedEndDegree: 29` and use `normalizedEndExclusive: 30` for future code coverage of `0 <= degree < 30`.

This is lookup normalization, not a change to the source table.

## Task 10.1 Selected Policy

Terms are the first Sprint 10 implementation target, but only from Vronsky Table 5 after manual verification.

Decans require a separate source decision before any dataset is created. Chaldean / Star of the Magi, trigon / triplicity and Vronsky-specific decan systems must not be mixed silently.

Degree rulers are deferred until Table 6 / Table 7 source screenshots or verified rows are available. Table 6 and Table 7 are separate source systems.

Actual Vronsky screenshot/table files are not currently present in the repository, so no dataset may be created from memory.

## Task 10.4 Terms Lookup Policy

Terms lookup uses only the verified Vronsky Table 5 rows from `src/termsData.js`.

Lookup intervals are half-open:

```txt
[startDegree, normalizedEndExclusive)
```

The degree inside a sign must satisfy:

```txt
0 <= degreeWithinSign < 30
```

Exact start boundaries belong to the interval that starts there. Exact end boundaries belong to the next interval. `30°` is invalid inside one sign and should be handled upstream as the next sign if needed.

Rows printed with final `29°` endings keep `printedEndDegree: 29` in output, but use `normalizedEndExclusive: 30` for lookup coverage. This is a code lookup normalization, not a change to the source table.

Planet input may use already-calculated `sign.key`, `degree` and `minutes`, or fall back to longitude-derived sign/degree through `src/astroMath.js`. The terms lookup engine must not call providers, read profiles, calculate planet positions, render UI, or include decans / degree rulers / other Vronsky tables / interpretations.

## Task 10.5 Decans Source Policy

Decans have two separate source systems in the reviewed Vronsky PDF:

- Star of the Magi / Egyptian tradition;
- Trigon / Triplicity system.

These systems must not be mixed silently.

Future datasets must use separate source keys:

```txt
decans-star-of-magi
decans-trigon-vronsky
```

Star of the Magi is the first dataset candidate, but only after non-active transcription and manual verification of the source figure.

Trigon / Vronsky decans remain deferred because they may include multiple active rulers and retrograde outer planets.

No active decans lookup engine, UI or debug is allowed until source rows are manually verified and an active dataset exists.

## Task 10.5d Star of the Magi Decans Dataset Policy

The active Star of the Magi / Egyptian tradition decans dataset uses only the manually verified Figure 4.7 rows.

It stores 36 rows:

- 12 signs;
- 3 decans per sign;
- septener planets only: Sun, Moon, Mercury, Venus, Mars, Jupiter and Saturn.

The interval policy is:

```txt
[0, 10)
[10, 20)
[20, 30)
```

The source system is `star-of-magi-egyptian-tradition`.

Trigon / Vronsky decans remain deferred and must use a separate source system if implemented later.

The dataset does not perform lookup by degree and does not include degree rulers, fixed stars, houses, ASC / MC, transits, interpretations or ritual scoring.

## Task 10.6 Star of the Magi Decans Lookup Policy

Decans lookup uses only the verified Figure 4.7 Star of the Magi / Egyptian tradition rows from `src/decansData.js`.

Lookup intervals are half-open:

```txt
[startDegree, endDegreeExclusive)
```

The degree inside a sign must satisfy:

```txt
0 <= degreeWithinSign < 30
```

Exact start boundaries belong to the interval that starts there. Exact end boundaries belong to the next interval. `30°` is invalid inside one sign and should be handled upstream as the next sign if needed.

Planet input may use already-calculated `sign.key`, `degree` and `minutes`, or fall back to longitude-derived sign/degree through `src/astroMath.js`. The decans lookup engine must not call providers, read profiles, calculate planet positions, render UI, or include Trigon / Vronsky decans, degree rulers, fixed stars, houses, ASC / MC, transits, interpretations or ritual scoring.

## Task 10.7a Degree Rulers Source Policy

Degree rulers have two separate source systems in the reviewed Vronsky PDF and uploaded source images:

- Table 6 — `Управление градусами по Звезде Магов`;
- Table 7 — `Управление градусами (по С. Вронскому)`.

These systems must not be mixed silently.

Future datasets must use separate source keys:

```txt
degree-rulers-star-of-magi-table-6
degree-rulers-vronsky-table-7
```

Table 6 / Star of the Magi is the first dataset candidate, but only after non-active transcription and manual verification of all rows.

Table 7 / Vronsky must use a separate workflow. Task 10.8b later moved that workflow into Sprint 10 before UI/debug/hardening.

Recommended future degree-index policy:

```txt
degreeIndex = floor(degreeWithinSign)
valid only when 0 <= degreeWithinSign < 30
```

This policy is implemented by the Task 10.8 lookup engine.

## Task 10.7d Table 6 Degree Rulers Dataset Policy

The active degree-ruler dataset added in Task 10.7d uses only verified Table 6 / Star of the Magi rows from `src/degreeRulersStarOfMagiData.js`.

Dataset source system:

```txt
star-of-magi-degree-rulers
```

The dataset stores 360 rows:

```txt
12 signs x 30 integer degrees
```

Allowed rulers are septener planets only:

- Sun;
- Moon;
- Mercury;
- Venus;
- Mars;
- Jupiter;
- Saturn.

Table 7 / Vronsky degree rulers remain deferred and must not be mixed with Table 6 rows.

Dataset-level degree indexes are integers `0` through `29`. Fractional `degreeWithinSign` lookup is implemented separately in the Task 10.8 lookup engine.

## Task 10.8 Table 6 Degree Rulers Lookup Policy

The active degree-ruler lookup engine added in Task 10.8 uses only verified Table 6 / Star of the Magi rows from `src/degreeRulersStarOfMagiData.js`.

Lookup source system:

```txt
star-of-magi-degree-rulers
```

Lookup rule:

```txt
degreeIndex = floor(degreeWithinSign)
valid only when 0 <= degreeWithinSign < 30
```

Boundary behavior:

- `0°` through `0.999°` use degree index `0`;
- `1°` through `1.999°` use degree index `1`;
- `29°` through `29.999°` use degree index `29`;
- `30°` is invalid inside one sign and must be handled upstream as the next sign.

The engine may resolve already-calculated natal planet objects through `sign.key + degree/minutes`; if minutes are missing, they are treated as `0`. If sign/degree fields are insufficient and longitude is already present on the planet object, the engine may use `src/astroMath.js` to derive sign and degree within sign.

The engine must not call providers, calculate planetary coordinates, read profiles, render UI, use Table 7 / Vronsky degree rulers, add retrograde markers, add multiple rulers, or include interpretations.

No degree-ruler UI or debug is allowed until a later active task explicitly requests it.

## Task 10.8b Table 7 Vronsky Degree Rulers Audit Policy

Table 7 — `Управление градусами (по С. Вронскому)` belongs to Sprint 10 as a degree-ruler source system, but it remains separate from Table 6 / Star of the Magi.

Table 7 source policy:

- source key: `degree-rulers-vronsky-table-7`;
- source system: Vronsky degree rulers;
- do not mix with `degree-rulers-star-of-magi-table-6`;
- do not reuse the single-ruler Table 6 data shape.

Table 7 may require support for:

- multiple ruler tokens in one degree cell;
- retrograde markers;
- outer-planet glyphs;
- row-level `sourceToken` values for manual review.

Future Table 7 rows should use a multi-ruler shape such as `rulers[]` instead of a single `ruler` field. No active Table 7 dataset, lookup engine, UI or debug may be created until the Table 7 draft transcription and manual verification tasks are complete.

Houses / ASC / MC remain Sprint 11 and are not part of the Table 7 flow.

## Task 10.8e Table 7 Vronsky Degree Rulers Dataset Policy

The active Table 7 dataset added in Task 10.8e uses only verified Table 7 / Vronsky degree ruler rows from `src/degreeRulersVronskyData.js`.

Source policy:

- source key: `degree-rulers-vronsky-table-7`;
- source system: `vronsky-degree-rulers`;
- source table: `Table 7`;
- Tome 2 / `Градусология` is used only as textual cross-reference for `Управитель` / `Управители` lines;
- Table 6 / Star of the Magi degree rulers remain a separate source system and must not be mixed into Table 7.

Row model:

- each row stores integer degree index `0` through `29`;
- each row preserves `sourceTokens`;
- each row stores `rulers[]`;
- each ruler stores `key`, `rulerRu`, `retrograde` and `sourceToken`;
- multiple rulers are kept as arrays;
- retrograde is per ruler;
- outer planets, Chiron and Proserpina are allowed only because they are verified Table 7 rulers.

Degree policy:

- dataset uses integer degree indexes only;
- future lookup should use `degreeIndex = floor(degreeWithinSign)` for `0 <= degreeWithinSign < 30`;
- `30°` remains invalid inside one sign and should be handled upstream as the next sign.

This dataset does not perform lookup, call providers, calculate planetary coordinates, render UI, include fixed stars or include interpretations.

## Task 10.8f Table 7 Vronsky Degree Rulers Lookup Policy

The active Table 7 lookup engine added in Task 10.8f uses only `src/degreeRulersVronskyData.js`.

Source policy:

- source key: `degree-rulers-vronsky-table-7`;
- source system: `vronsky-degree-rulers`;
- Table 6 / Star of the Magi degree rulers remain a separate source system and must not be mixed into Table 7 output;
- output must preserve `sourceTokens[]` and structured `rulers[]`.

Lookup policy:

- lookup accepts sign + degree within sign;
- valid degree range is `0 <= degreeWithinSign < 30`;
- lookup uses `degreeIndex = floor(degreeWithinSign)`;
- `0°` through `0.999°` use degree index `0`;
- `1°` through `1.999°` use degree index `1`;
- `29°` through `29.999°` use degree index `29`;
- `30°` remains invalid inside one sign and should be handled upstream as the next sign.

Planet input policy:

- the engine may resolve already-calculated natal planet objects through `sign.key + degree/minutes`;
- if minutes are missing and degree is valid, minutes are treated as `0`;
- if sign/degree fields are insufficient and longitude is already present on the planet object, the engine may use `src/astroMath.js` to derive sign and degree within sign;
- the engine must not call providers or calculate planetary coordinates.

Summary policy:

- `byRuler` counts ruler occurrences, not rows;
- `multiRuler` counts rows where `rulers.length > 1`;
- `retrograde` counts ruler entries with `retrograde: true`;
- `outerPlanet` counts ruler entries where key is `uranus`, `neptune` or `pluto`.

This lookup engine does not render UI, format display rows, include fixed stars, houses / ASC / MC, transits, interpretations or ritual scoring.

## Deferred Features

Sprint 10 planning does not activate:

- fixed stars;
- houses;
- ASC / MC;
- transits;
- interpretations;
- ritual scoring.
