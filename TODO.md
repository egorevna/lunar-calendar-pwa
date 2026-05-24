# TODO.md

## Purpose

This file is the active implementation task list for Codex.

`TODO.md` is not a product roadmap and not a place for distant ideas.

Rules:

- Codex must implement only the active task from this file.
- Do not implement future roadmap items from `MASTER_PLAN.md` unless they are explicitly moved into this file.
- One task = one implementation step = one review = one commit.
- After each task, update this file, `PROJECT_STATE.md`, and `CHANGELOG.md`.
- Update `ARCHITECTURE.md` only if the actual architecture changed.

Document priority:

1. `PROJECT_STATE.md` — current status and active sprint
2. `ARCHITECTURE.md` — actual code structure
3. `TODO.md` — active implementation tasks
4. `ASTRO_LOGIC.md` — astrology rules
5. `UI_RULES.md` — interface rules
6. `PRIVACY_RULES.md` — privacy rules
7. `MASTER_PLAN.md` — long-term roadmap
8. `CHANGELOG.md` — completed changes

---

# Completed Sprint

## Sprint 1 — Main Dashboard Cleanup

Goal:

Stabilize and improve the main dashboard before adding profiles, natal chart logic, personal transits, modes, or advanced personalization.

The main dashboard should answer:

1. What is happening now?
2. Can the user act?
3. What is this moment good for?
4. What should be avoided?
5. When is the best window?

Do not start profiles, natal charts, personal transits, import/export, or cloud sync during this sprint.

---

# Completed Task

## Task 1.1 — Fix VOC Block States and Copy

Status: done

### Goal

Keep the `Луна без курса` card focused on the nearest or current VOC period.

### Current behavior

The app currently shows something like:

```txt
Луна без курса с 13:04:14 – 03:03:38
```

And below:

```txt
после: □ Венера
```

### Required behavior

If VOC has not started yet:

```txt
с 13:04 до 03:03
```

If VOC is currently active:

```txt
до 03:03
```

If there is no VOC data:

```txt
нет данных
```

Use last aspect copy:

```txt
после: □ Венера
```

### Formatting rules

- Main dashboard time format: `HH:mm`.
- Do not show seconds on the main dashboard.
- Seconds are allowed only in technical/debug views.
- Do not change the exact ephemeris data.
- Do not change calculation sources unless required.

### What not to touch

Do not implement:

- VOC quality label;
- Moon aspect interpretations;
- best window calculation;
- modes;
- profiles;
- natal chart;
- personal transits;
- import/export;
- privacy storage;
- new screens.

### Acceptance criteria

- Before VOC start, the block shows `с HH:mm до HH:mm`.
- During VOC, the block shows `до HH:mm`.
- If VOC data is unavailable, the block shows `нет данных`.
- The aspect line uses `после: ...`.
- No seconds are shown in the VOC block on the main dashboard.
- No `Луна в курсе`, `Без курса: ...`, `VOC после: ...`, countdown, or `... VOC` quality wording is shown.
- Existing precise VOC calculation is not broken.
- Existing fallback logic is not broken.
- Existing tests pass.

### Manual check

1. Run the app locally.
2. Open the main dashboard.
3. Check the VOC block in the current date/time state.
4. If possible, test or temporarily inspect dates/times for:
   - before VOC;
   - during VOC;
   - day without VOC.
5. Check that time is displayed as `HH:mm`.
6. Check browser console for errors.
7. Run:

```bash
npm test
```

### After completion

Codex must:

1. Mark this task as done.
2. Update `PROJECT_STATE.md`.
3. Update `CHANGELOG.md`.
4. Evaluate whether architecture changed.
5. If architecture changed, update `ARCHITECTURE.md`.
6. If architecture did not change, do not edit `ARCHITECTURE.md` and explain why.
7. Stop and wait for the next command.

---

# Completed Task

## Task 1.2 — Add VOC Quality Label

Status: done

### Goal

Add a short human background label for the current or upcoming VOC.

### Rules

- after harmonious aspect: `фон мягкий`;
- after tense aspect: `фон напряженный`;
- after aspect with Neptune: `фон размытый`;
- after aspect with Saturn: `фон тяжелый`;
- after aspect with Mars or Uranus: `фон нервный`.

### Priority

If multiple rules match, use this priority:

1. Neptune;
2. Saturn;
3. Mars / Uranus;
4. tense aspect;
5. harmonious aspect.

### Implementation guidance

Prefer a small helper or dictionary.

Do not hardcode this logic deep inside DOM manipulation if it can be avoided.

### What not to touch

Do not implement:

- modes;
- profiles;
- personal transits;
- natal chart;
- best window calculation.

### Acceptance criteria

- VOC block displays one compact quality label when enough data exists.
- The label does not include the word `VOC`.
- App does not crash if last aspect is missing.
- Existing VOC states from Task 1.1 still work.
- Tests pass.

---

# Completed Task

## Task 1.3 — Improve Moon Aspects Block

Status: done

### Goal

Make the Moon aspects block clearer and more useful.

### Required behavior

Use labels:

```txt
Последний аспект
Следующий аспект
```

If previous aspect was yesterday:

```txt
Квадрат Уран · вчера 22:13
```

If previous or next aspect is today:

```txt
Квадрат Уран · сегодня 22:13
```

If next aspect is tomorrow:

```txt
Секстиль Меркурий · завтра 06:42 · через 20 ч 28 мин
```

For the next aspect, add countdown:

```txt
через 20ч 28м
```

### Aspect filter

Only major Moon aspects should be used:

- conjunction;
- sextile;
- square;
- trine;
- opposition.

### What not to touch

Do not add full interpretations yet.

Do not implement profiles or personal astrology.

### Acceptance criteria

- Labels are clear.
- Relative day label is correct.
- Time is displayed as `HH:mm`.
- Next aspect countdown is displayed.
- Only major aspects are displayed.
- Existing dashboard layout remains stable.
- Tests pass.

---

# Completed Task

## Task 1.4 — Add Moon Aspect Interpretation

Status: done

### Goal

Add a short practical interpretation for Moon aspects.

### Required behavior

On tap, click, or compact expanded view, show a short interpretation.

Examples:

```txt
Луна ✶ Меркурий: хорошо для раскладов, разговоров, формулировок, записей, диагностики.
```

```txt
Луна □ Уран: нервное поле, внезапности, лучше не принимать резких решений.
```

### Implementation guidance

Interpretation rules should live in:

- a dictionary;
- helper function;
- dedicated module.

They should not be scattered randomly inside `src/app.js`.

### Acceptance criteria

- User can access a short interpretation.
- Major Moon aspects have meaningful descriptions.
- Missing interpretation does not crash the app.
- Existing Moon aspects display remains stable.
- Tests pass.

---

# Completed Task

## Task 1.5 — Improve Field Quality Block

Status: done

### Goal

Make `Качество поля` more precise, dynamic, and practical.

### Required phrases

Use or derive from these field phrase families:

- `Поле устойчивое: хорошо для закрепления результата.`
- `Поле тонкое: хорошо для интуиции, Таро и снов.`
- `Поле нервное: возможны резкие реакции и сбои планов.`
- `Поле плотное: хорошо для телесных практик, защиты и стабилизации.`
- `Поле очищающее: хорошо завершать, убирать и отсекать лишнее.`
- `Поле размытое: осторожно с обещаниями, договорами и ожиданиями.`
- `Поле денежное: хорошо для практик на ресурс, клиентов и устойчивый доход.`

### Add line

Add:

```txt
Главный совет момента
```

Examples:

- `Лучше закреплять, а не резко менять.`
- `Делать до начала Луны без курса.`
- `Сначала чистка, потом программирование.`

### Preserve existing logic

Current important rule:

Previous tense Moon aspect should strongly affect field quality only during the first 4 hours after the exact aspect.

Do not remove this rule unless explicitly asked.

### Acceptance criteria

- Field quality phrase is still generated from actual indicators.
- Main advice is shown.
- Existing scores remain visible or are intentionally improved.
- Existing `Подходит` / `Не подходит` lists still work.
- Tests pass.

---

## Task 1.6 — Add Warnings Block

Status: done

### Goal

Add a compact warning block:

```txt
Осторожно сегодня
```

Show it only when there are real red flags.

### Example warnings

- `VOC с 13:04 — важные запуски лучше сделать до этого времени.`
- `Напряженный аспект Луны к Урану — возможны резкие реакции.`
- `23 лунные сутки — не делать магию из злости.`
- `29 лунные сутки — лучше чистки, не запуск нового.`
- `Луна в Рыбах — риск иллюзий и эмоциональной размытости.`

### Acceptance criteria

- Warning block appears only when warnings exist.
- Warning block stays hidden when no red flags exist.
- Warnings are based on current calculated data.
- No duplicate warnings.
- Tests pass.

---

## Task 1.7 — Add Moon Precision

Status: done

### Goal

Add lunar precision information to the Moon block.

### Required data

Add:

- Moon illumination percentage;
- time until New Moon or Full Moon;
- Moon age.

### Display format

```txt
Освещенность: 32%
До Новолуния: 4д 18ч
```

Optional if data exists:

```txt
Возраст Луны: 8д 3ч
```

### Implementation guidance

If data can be calculated from existing precise ephemeris data, use existing data.

If generated ephemeris data must be expanded, update:

- `scripts/generate-ephemeris.cjs`;
- `src/ephemeris-data.js`;
- `src/preciseEphemeris.js`;
- tests;
- `ARCHITECTURE.md`.

### Acceptance criteria

- Moon illumination is displayed.
- Time until New Moon / Full Moon is displayed.
- Existing phase display still works.
- Tests pass.

---

## Task 1.8 — Add Planetary Hour Hints

Status: done

### Goal

Add a practical hint for the current planetary hour.

### Required behavior

Current display:

```txt
Планетарный час — Солнце
```

Add a small line or tap/click hint:

```txt
Хорошо для: видимости, силы, статуса, намерения, лидерства.
```

### Meanings

- Солнце — статус, проявленность, успех, воля.
- Луна — Таро, сны, семья, интуиция, вода.
- Марс — чистки, защита, отсечение, активные действия.
- Меркурий — тексты, переговоры, карты, диагностика.
- Юпитер — деньги, рост, обучение, благословение.
- Венера — отношения, красота, гармония, притяжение.
- Сатурн — защита, границы, структура, долгие обязательства.

### Implementation guidance

Use a reusable dictionary/helper.

Do not hardcode repeated strings in multiple DOM branches.

### Acceptance criteria

- Each planetary hour has a practical hint.
- Current planetary hour shows the correct hint.
- Missing or unknown hour does not crash the app.
- Tests pass.

---

# Completed Task

## Task 1.9 — Clean Up Terminology and Visual Clarity

Status: done

### Goal

Make the main dashboard terminology clearer.

### Required changes

Replace vague title:

```txt
Индикатор дня
```

With:

```txt
Индикаторы
```

Use lines:

```txt
Tong Shu: Стабильность
Лунные сутки: Медведь
Ба-цзы: Деревянный Петух
```

Fix Moon sign transition line.

Instead of:

```txt
Луна в Рыбах в Овен завтра
```

Use:

```txt
Луна в Рыбах
Переход в Овен: завтра 03:03
```

Main dashboard time format:

- `HH:mm`;
- no seconds.

### Acceptance criteria

- Terminology is clear.
- Indicator block no longer mixes several systems under a vague title.
- Moon sign and next transition are displayed as separate, readable lines.
- Time format is consistent.
- Tests pass.

---

## Task 1.10 — Add Hidden Debug Screen

Status: done

### Goal

Add a hidden debug screen for development and calculation verification.

### Required data

Show:

- current timezone;
- selected day calculation system: MSK / 23:00 / Jie Qi;
- earthly branch of month;
- earthly branch of day;
- Tong Shu indicator;
- source of VOC calculation;
- previous Moon aspect;
- next Moon aspect;
- calculation coordinates;
- ephemeris version.

### Purpose

The debug screen is needed to check differences between calendar sources and calculation schools.

### Implementation guidance

Document:

- how to access it;
- whether it is visible in production;
- whether it allows seconds;
- what files are involved.

If this adds a new screen or route-like state, update `ARCHITECTURE.md`.

### Acceptance criteria

- Debug screen is hidden from normal users.
- Debug screen is accessible during development.
- Debug data reflects current calculations.
- No private profile data is exposed.
- Tests pass.

---

# Completed Sprint

## Sprint 2 — Modes and Best Windows

Status: completed

Goal:

Add mode-aware recommendations and best windows to the main dashboard.

Do not implement profiles, natal charts, personal transits, import/export, cloud sync, backend, or new public navigation in this sprint.

# Completed Tasks

## Task 2.1 — Add Dashboard Mode Selector

Status: done

### Goal

Add a compact selector for dashboard modes:

- Общее
- Таро
- Свечи
- Деньги
- Отношения
- Чистки
- Прогнозы

### Required Behavior

- User can switch mode on the main dashboard.
- Selected mode has visible active state.
- Mode state is available for later recommendation blocks.
- Existing dashboard blocks continue to work.
- No profile or natal logic.

### UX

Preferred:

```txt
Режим
[Общее] [Таро] [Свечи] [Деньги] [Отношения] [Чистки] [Прогнозы]
```

On small screens, horizontal scroll chips are acceptable.

### Acceptance Criteria

- Mode selector is visible.
- Default mode is `Общее`.
- User can switch to each mode.
- Active mode is visually marked.
- Tests pass.
- Task 2.2 is not started.

# Sprint 2 Backlog

## Task 2.2 — Add Mode-Specific Scores

Status: done

Add scores relevant to selected mode.

Examples:

- Таро: Интуиция, Ясность трактовки, Риск искажений
- Свечи: Программные свечи, Чистки, Денежные свечи, Любовные свечи, Защита
- Деньги: Сделки, Продажи, Покупки, Запуск рекламы, Подписание
- Отношения: Разговоры, Примирение, Притяжение, Гармонизация, Риск конфликта
- Чистки: Чистки, Отсечение, Защита, Восстановление, Риск отката
- Прогнозы: Ясность прогноза, Риск искажений, Логика, Интуиция

## Task 2.3 — Add Mode-Specific Good / Careful Recommendations

Status: done

Show short mode-specific recommendations:

```txt
Хорошо:
...

Осторожно:
...
```

## Task 2.4 — Add Best Window Scoring Helper

Status: done

Create the logic for selecting 1–2 best windows for selected mode.

Exclude active VOC and risky moments.

Do not modify ephemeris data.

## Task 2.5 — Display Best Window Today

Status: done

Add card:

```txt
Лучшее окно для [режим]
19:40–21:10
Почему: ...
```

Show no more than 2 windows.

## Task 2.6 — Add No-Good-Window Fallback

Status: done

If no good window exists:

```txt
Сегодня лучше завершать и очищать, а не запускать новое.
```

## Task 2.7 — Add Debug Reasoning for Best Windows

Status: done

With `?debug=1`, show best-window candidate scoring and reasons.

# Completed Sprint

## Sprint 3 — Profiles / Мои карты

Status: complete

Goal:

Add local profile management foundation.

Do not implement natal charts, personal transits, house calculations, Ascendant / MC, cloud sync, backend, geocoding API, or personal recommendations in this sprint.

# Completed Task

## Task 3.1 — Add Profile Data Model

Status: done

### Goal

Create profile data model and validation helpers.

### Required Fields

- id
- name
- birthDate
- birthTime
- birthTimeAccuracy
- birthPlace
- currentPlace
- houseSystem
- zodiac
- createdAt
- updatedAt

### Required Defaults / Enums

- birthTimeAccuracy: `exact` / `approximate` / `unknown`
- currentPlace default: Moscow
- houseSystem default: `wholeSign`
- zodiac default: `tropical`

### Acceptance Criteria

- Profile model exists.
- Validation covers required fields.
- Defaults are safe.
- Tests pass.
- No storage.
- No UI.
- No natal chart.
- No personal transits.

# Completed Task

## Task 3.2 — Add Local Profile Storage

Status: done

Use localStorage for profile persistence and activeProfileId.

Acceptance criteria:

- profiles persist after reload;
- active profile persists after reload;
- deleting active profile resets active profile to `Общий день`;
- corrupted storage does not crash app;
- tests pass.

# Completed Task

## Task 3.3 — Add Profiles UI Shell / “Мои карты”

Status: done

Add minimal UI shell for profile list and privacy copy.

No new navigation bar and no natal chart screen.

# Completed Task

## Task 3.4 — Create Profile Form

Status: done

Allow creation of a profile with validation.

Defaults:

- birthTimeAccuracy: exact;
- current calculation place: Moscow;
- houseSystem: Whole Sign;
- zodiac: tropical.

# Completed Task

## Task 3.5 — Edit / Delete Profile

Status: done

Allow profile editing and deletion.

Deleting a profile must require confirmation. Deleting active profile switches app to `Общий день`.

# Completed Task

## Task 3.6 — Active Profile Selector

Status: done

Allow selecting active profile on main dashboard.

Default active profile is `Общий день`. Main app calculations remain general for now.

# Completed Task

## Task 3.7 — Profile Export / Import

Status: done

Export/import profile JSON.

Export should include schemaVersion. Import must validate JSON and avoid duplicate IDs.

# Completed Task

## Task 3.8 — Privacy Copy and Debug Profile State

Status: done

Show privacy copy and safe debug profile state.

Debug may show activeProfileId, activeProfileName, profilesCount, storage type, and sync disabled.

# Sprint 3 Status

Status: complete

Sprint 3 — Profiles / Мои карты is complete.

# Completed Sprint

## Sprint 4 — Personal Moment Foundation / Лично для меня

Status: done

Goal:

Start personalizing the dashboard based on the active profile, without fake natal calculations.

Important boundary:

Do not show natal houses, ASC/MC, personal transits, Moon in natal house, or personal ritual scoring unless the calculation is proven reliable and covered by tests.

# Completed Task

## Task 4.1 — Personal Astrology Strategy and Data Audit

Status: done

### Goal

Audit current data, libraries, generated ephemeris, and profile model before implementing personal astrology.

### Required Investigation

Read:

- `package.json`
- `src/astro.js`
- `src/preciseEphemeris.js`
- `src/ephemeris-data.js`
- `scripts/generate-ephemeris.cjs`
- `src/profileModel.js`
- `src/profileStorage.js`
- `src/profileUi.js`

Answer:

1. Do we have natal planetary positions for arbitrary birth dates?
2. Do we have house calculation?
3. Can we calculate ASC/MC?
4. Can we calculate personal transits to natal planets?
5. What does current generated Swiss Ephemeris data actually contain?
6. What is safe to implement now?
7. What requires new data/library/work?

### Deliverable

Create:

```txt
PERSONAL_ASTROLOGY_STRATEGY.md
```

The document must include:

- available data;
- safe now;
- not safe yet;
- required future work;
- recommended Sprint 4 MVP;
- decision log.

### Acceptance Criteria

- Strategy doc exists.
- No app code changed.
- No UI changed.
- No fake calculations.
- Task 4.2 remains next.

# Completed Task

## Task 4.2 — Profile Calculation Input Adapter

Status: done

### Goal

Create a helper that converts active profile data into safe calculation input and readiness state.

### Output should include

- profileId;
- name;
- birthDateTime readiness;
- birthTimeAccuracy;
- birthPlace readiness;
- currentPlace;
- houseSystem;
- zodiac;
- isReadyForNatal;
- missingFields;
- warnings;
- unsupportedFeatures.

### Boundaries

- No natal planetary positions.
- No house calculations.
- No ASC / MC.
- No personal transits.
- No UI block `Лично для меня` yet.
- No geocoding.
- No new dependencies.

# Completed Task

## Task 4.3 — Personal Readiness / Context MVP

Status: done

### Goal

Use `src/personalProfileInput.js` to produce honest readiness / context copy for the selected active profile.

### Result

- Added `src/personalContext.js`.
- The helper returns safe user-facing context for `Общий день` or a selected profile.
- Supported statuses: `general`, `incomplete`, `readyForContext`, `calculationLimited`.
- Missing fields and warnings are passed through from `src/personalProfileInput.js`.
- Natal planets, houses, ASC / MC, personal transits and personal ritual scoring remain unavailable until a reliable calculation engine exists.
- No UI, `app.js`, `index.html`, `sw.js`, natal chart, houses, ASC / MC or transits were added.

### Boundaries

- No natal planetary positions.
- No house calculations.
- No ASC / MC.
- No personal transits.
- No UI block `Лично для меня` unless explicitly requested in this task.
- No geocoding.
- No new dependencies.

# Completed Task

## Task 4.4 — Dashboard Block `Лично для меня`

Status: done

### Goal

Add a compact dashboard block that uses `src/personalContext.js` for honest personal readiness / context copy.

### Result

- Added a hidden dashboard shell for `Лично для меня`.
- `src/app.js` now uses the active profile from the existing profile storage flow.
- The block is hidden for `Общий день`.
- When a saved profile is active, the block shows `Лично для [имя]`, a safe summary, and up to 3 human-readable readiness / limitation lines.
- Technical profile keys, birth date, birth time, coordinates and full profile JSON are not rendered in the block.
- Natal planets, houses, ASC / MC, Moon in natal house, personal transits, transit orbs and personal ritual scoring remain unavailable.
- PWA cache updated to `lunar-calendar-v53`.

### Boundaries

- Do not show natal planetary positions.
- Do not calculate houses.
- Do not calculate ASC / MC.
- Do not calculate personal transits.
- Do not show Moon in natal house.
- Do not add personal ritual scoring.
- Do not add geocoding.
- Do not add new dependencies.

# Completed Task

## Task 4.5 — Safe Personal Recommendations MVP

Status: done

### Goal

Add safe personal recommendations based only on profile readiness / context, without natal calculations.

### Result

- Added `src/personalRecommendations.js`.
- The helper returns compact `goodNow`, `nextSteps`, and `cautions` lists for the active profile.
- The `Лично для меня` card now shows safe sections:
  - `Можно сейчас`;
  - `Нужно добавить` / `Для точного личного расчета`;
  - `Важно`.
- Missing profile fields are translated into human-readable next steps.
- The block states that recommendations are based on the general moment and not personal transits.
- Natal planets, houses, ASC / MC, Moon in natal house, personal transits, transit orbs and personal ritual scoring remain unavailable.
- PWA cache updated to `lunar-calendar-v55`.

### Boundaries

- Do not show natal planetary positions.
- Do not calculate houses.
- Do not calculate ASC / MC.
- Do not calculate personal transits.
- Do not show Moon in natal house.
- Do not add personal ritual scoring.
- Do not add geocoding.
- Do not add new dependencies.

# Completed Task

## Task 4.6 — Debug Personal Calculations

Status: done

### Goal

Add safe debug visibility for personal readiness / recommendations without dumping sensitive birth data and without adding natal calculations.

### Result

- Added a hidden `Personal Debug` section to `?debug=1`.
- The debug section shows active profile id/name, profile count, personal status, storage/sync/server/geocoding state, natal-engine state, safe missing-field labels, warnings and calculation capabilities.
- Capabilities for natal planets, houses, ASC / MC and personal transits remain explicitly unavailable.
- Sensitive birth values, raw place objects, raw coordinates and full profile JSON are not shown.
- PWA cache updated to `lunar-calendar-v57`.

### Boundaries

- Do not show natal planetary positions.
- Do not calculate houses.
- Do not calculate ASC / MC.
- Do not calculate personal transits.
- Do not show Moon in natal house.
- Do not add personal ritual scoring.
- Do not add geocoding.
- Do not add new dependencies.

# Completed Task

## Task 4.7 — Sprint 4 Hardening

Status: done

### Goal

Harden Sprint 4 after the safe personal-context/debug foundation is complete.

### Result

- Verified Sprint 4 guardrails for user-facing personal copy and debug privacy.
- Added a markup guardrail that `Personal Debug` is not present in ordinary HTML and remains gated behind debug mode.
- Confirmed no natal chart, houses, ASC / MC calculations, personal transits, transit orbs, geocoding, backend or cloud sync were added.
- Sprint 4 is complete.

### Boundaries

- Do not start Sprint 5.
- Do not add natal calculations without a reliable calculation engine.

# Completed Sprint

## Sprint 5 — Natal Calculation Engine Foundation

Status: done

### Goal

Build the calculation foundation for real natal astrology before showing natal chart UI or personal transit claims.

### Important Boundary

Do not fake natal planets, houses, ASC / MC, aspects, personal transits or orbs.

# Completed Task

## Task 5.1 — Natal Engine Audit and Decision

Status: done

### Goal

Audit the project and decide the safest path for natal calculations.

### Required Investigation

Read:

- `package.json`;
- `scripts/generate-ephemeris.cjs`;
- `src/astro.js`;
- `src/preciseEphemeris.js`;
- `src/ephemeris-data.js`;
- `PERSONAL_ASTROLOGY_STRATEGY.md`;
- profile modules.

Answer:

1. Is `swisseph` available only in Node scripts or also in browser runtime?
2. Can the current PWA calculate arbitrary natal dates?
3. Do we need a browser-compatible dependency?
4. Can we calculate planetary ecliptic longitudes?
5. Can we calculate houses / ASC / MC?
6. How should historical timezone be handled?
7. What is safe for Sprint 5?
8. What requires separate approval / dependency?

### Deliverable

Create:

```txt
NATAL_ENGINE_STRATEGY.md
```

It should include:

- available current tools;
- recommended engine path;
- dependency recommendation, if any;
- risks;
- implementation plan;
- what remains unsupported.

### Acceptance Criteria

- Strategy document exists.
- No app code changed.
- No dependency added without explicit approval.
- No fake calculations.
- Task 5.2 remains next.

### Result

- Created `NATAL_ENGINE_STRATEGY.md`.
- Confirmed current `swisseph` is a Node/build-time native binding, not a browser/PWA runtime engine.
- Confirmed current generated ephemeris data supports current dashboard events for 2026–2030, not arbitrary natal calculations.
- Confirmed natal planets, houses, ASC / MC and personal transits are not reliably supported yet.
- Recommended hybrid path: keep current generated dashboard events, add pure math primitives and strict natal engine interfaces, and connect a local browser-compatible provider later only with explicit approval.

# Completed Task

## Task 5.2 — Add Astrology Math Primitives

Status: done

Goal: add pure, tested helpers for degree normalization, zodiac sign mapping, degree within sign, angular distance, aspect detection, orb checking and degree formatting.

### Result

- Added `src/astroMath.js` as a pure astrology math helper module.
- Added degree normalization, zodiac sign lookup, degree-in-sign, angular distance, major aspect detection, aspect-between-longitudes and degree formatting.
- Invalid numeric input returns safe `null` for calculation helpers and a stable empty structure for `formatDegree()`.
- Added `test/astroMath.test.js` for boundaries, wrap-around, invalid input, major aspects and degree formatting.
- No UI, profile logic, ephemeris data, `swisseph`, houses, ASC / MC, transits or dependencies were added.

# Completed Task

## Task 5.3 — Add Natal Chart Data Model and Engine Interface

Status: done

Goal: create neutral natal chart result shapes and an engine interface that returns explicit `notSupported` for unsupported calculations.

### Result

- Added `src/natalChartModel.js` with neutral result shapes, statuses, feature flags, normalization helpers and `hasNatalFeature()`.
- Added `src/natalEngine.js` with a strict provider interface that currently returns explicit `notSupported` / `incomplete` states.
- Added tests for empty, incomplete and ready result shapes, safe normalization, capabilities, unsupported engine behavior and no fake natal claims.
- No provider, UI, dependencies, houses, ASC / MC, transits or ephemeris changes were added.

# Completed Task

## Task 5.4 — Birth DateTime / Timezone Strategy

Status: done

Goal: define safe conversion/readiness for birth date, birth time, place and timezone without faking historical timezone precision.

### Result

- Added `src/birthDateTime.js` with pure parsing and readiness helpers for birth date, birth time and birth timezone.
- Added explicit `incomplete` / `notSupported` behavior for missing inputs and unsupported UTC conversion.
- Added tests for date/time parsing, timezone validation, unknown birth time, missing timezone, no fake UTC and no fake natal claims.
- No UI, app flow, dependencies, ephemeris data, houses, ASC / MC or transits were added.

# Completed Task

## Task 5.5 — Planetary Position Provider MVP

Status: done

Goal: connect a reliable provider only if Task 5.1 allows it; otherwise return explicit `notSupported`.

### Result

- Added `src/planetaryPositionProvider.js` with provider status constants, required planet keys, capability reporting, input validation and safe position normalization.
- Provider currently returns `incomplete` for invalid input and explicit `notSupported` for valid-looking input because no runtime provider is connected.
- Added `test/planetaryPositionProvider.test.js` for capabilities, planet keys, validation, unsupported results, no fake positions and no network/geolocation behavior.
- No real provider, dependencies, package changes, UI, natal planets, houses, ASC / MC or transits were added.

# Completed Task

## Task 5.6 — Natal Planets MVP

Status: done

Goal: calculate natal planetary positions only if the provider is reliable; do not calculate houses / ASC / MC unless proven reliable.

### Result

- Integrated `src/planetaryPositionProvider.js` into `src/natalEngine.js` through a safe provider call path.
- `calculateNatalChart()` now returns provider `incomplete` / `notSupported` states and still does not create fake planets.
- Added test coverage for provider invocation, provider reason propagation, incomplete short-circuiting, no fake data, and future mock-ready planets from explicitly supplied data.
- No real provider, dependencies, package changes, UI, houses, ASC / MC, transits or ephemeris changes were added.

# Completed Task

## Task 5.7 — Natal Calculation Debug / Fixtures

Status: done

Goal: add safe debug inspection and fixture strategy without dumping sensitive birth data.

### Result

- Added `Natal Engine Debug` to the hidden debug panel.
- Debug shows engine/provider status, unsupported feature flags, safe active-profile readiness labels and no raw birth data.
- Added `test/fixtures/natalFixtures.js` with a test-only mock provider for future-ready natal-engine tests.
- Production natal engine path remains `notSupported`; no real provider, dependencies, UI, natal planets, houses, ASC / MC or transits were added.

# Completed Task

## Task 5.8 — Sprint 5 Hardening

Status: done

Goal: verify Sprint 5 outputs, no fake natal claims, unsupported states explicit, tests pass.

### Result

- Audited Task 5.1–5.7 outputs and confirmed Sprint 5 foundation is complete.
- Confirmed production UI does not show fake natal calculations, natal chart, planet table, house table, ASC / MC values, personal transits or orbs.
- Confirmed debug output shows safe capability/provider state and does not expose raw birth data or full profile JSON.
- Confirmed `natalEngine`, `birthDateTime`, and `planetaryPositionProvider` keep unsupported features explicit and do not fake readiness.
- Confirmed no real provider, dependency, package, ephemeris or generator changes were added during hardening.

# Completed Sprint

## Sprint 6 — Real Natal Provider Selection / Fixture Validation

Status: done

### Goal

Select and validate a reliable local natal calculation provider before showing natal planets, houses, ASC / MC, transits or orbs to users.

### Important Boundary

Do not add a real provider dependency without explicit user approval.

Do not show natal chart UI in Sprint 6.

Do not fake planets, houses, ASC / MC, transits or orbs.

# Completed Task

## Task 6.1 — Provider Research and Decision

Status: done

### Goal

Research local natal calculation provider options and decide what path is safe.

### Required Work

Create:

```txt
NATAL_PROVIDER_RESEARCH.md
```

Compare provider options:

- browser-compatible library;
- Swiss Ephemeris in browser, if possible;
- Swiss Ephemeris via Node/build process;
- server-side provider;
- hybrid approach.

### Required Questions

1. Can the provider run in browser/PWA?
2. Does it send data externally?
3. Does it calculate arbitrary birth dates?
4. Does it calculate tropical ecliptic longitudes?
5. Does it support Sun/Moon/planets?
6. Does it support retrograde/speed?
7. Does it support houses/ASC/MC?
8. What is the license?
9. What is the bundle size / PWA impact?
10. What fixtures are needed?
11. What remains unsupported?

### Acceptance Criteria

- `NATAL_PROVIDER_RESEARCH.md` exists.
- Recommended provider path is clear.
- No dependency installed.
- No code implementation yet.
- Task 6.2 remains next.

### Result

- Created `NATAL_PROVIDER_RESEARCH.md`.
- Compared `astronomy-engine`, `circular-natal-horoscope-js`, `astronomia`, Swiss Ephemeris browser/WASM options, current Node/build-time Swiss Ephemeris, server-side calculation and hybrid strategy.
- Recommended path: hybrid approach with `astronomy-engine` as the first candidate to evaluate for local natal planet positions after fixtures and explicit approval.
- No dependency, provider connection, app code, package change or natal calculation was added.

# Completed Task

## Task 6.2 — Fixture Strategy and Public Test Fixtures

Status: done

Goal: create fixture strategy and initial public/synthetic fixtures without private birth data.

### Result

- Created `NATAL_FIXTURE_STRATEGY.md`.
- Added `test/fixtures/natalProviderFixtures.js` with synthetic pending fixtures.
- Added fixture categories: `modern`, `historical`, `moonSensitive`, `timezoneSensitive`, `unknownBirthTime`, `missingCoordinates`.
- Added `test/natalProviderFixtures.test.js`.
- Expected planetary values remain `null` and `expectedStatus: pending-provider-approval`; no fake longitudes were added.
- No provider, dependency, package change, app code, natal planets, houses, ASC / MC or transits were added.

# Completed Task

## Task 6.3 — Provider Adapter Contract

Status: done

Goal: create a clean adapter interface that keeps production `notSupported` until an approved provider exists.

### Result

- Added `src/natalProviderAdapter.js`.
- Added default `notSupported` adapter, adapter capability reporting, contract validation, and safe adapter runner.
- Added `test/natalProviderAdapter.test.js` with mock-ready coverage through test-only adapters.
- Production default remains `notSupported`; no real provider, dependency, package change or real natal calculation was added.

# Completed Sprint 6 Tasks

## Task 6.4a — Provider Approval Review

Status: done

Goal: prepare approval review for the first real natal provider candidate before any dependency or integration work.

### Result

- Created `NATAL_PROVIDER_APPROVAL_REVIEW.md`.
- Primary candidate reviewed: `astronomy-engine`.
- Recommendation: `astronomy-engine` is the best first local candidate for natal planet positions, but approval remains pending.
- Dependency was not installed.
- `package.json` / `package-lock.json` were not changed.
- Provider was not connected.
- Real natal planets, houses, ASC / MC, transits, aspects and orbs were not calculated.

## Task 6.4b — Approved Provider Integration

Status: stage 1 done

Goal: install/connect a real local provider only after explicit approval.

Before this task starts, Codex must present provider name, license, browser/PWA compatibility, privacy behavior, bundle impact, capabilities, limitations and fixture validation plan.

The approval review explicitly says:

```txt
Do not install or integrate this provider until the user explicitly approves it.
```

### Stage 1 Result

- Installed `astronomy-engine@2.1.19` as an exact dependency.
- Added isolated `src/astronomyEngineProvider.js`.
- Added `test/astronomyEngineProvider.test.js`.
- Source/privacy audit found no executable `fetch`, `XMLHttpRequest`, `WebSocket`, or executable remote URL behavior in the installed package.
- Remote URLs exist only as documentation/comment/package metadata references.
- API path candidates are identified:
  - Sun: `SunPosition(date).elon`;
  - Moon: `EclipticGeoMoon(date).lon`;
  - planets: `GeoVector(body, date, true) -> Ecliptic(vector).elon`.
- The API path is identified but reference fixture accuracy is not validated yet.
- Houses, ASC / MC, transits, orbs, natal chart UI and user-facing natal values remain unavailable.
- `src/app.js`, `index.html`, `sw.js`, `src/ephemeris-data.js`, and `scripts/generate-ephemeris.cjs` were not changed.

Task 6.5 was approved later as a limited provider-layer smoke MVP. Reference fixture accuracy remains pending before any user-facing natal values.

## Task 6.5 — Natal Planet Positions MVP

Status: done

Goal: calculate candidate natal planetary positions in the isolated provider layer without showing them to users.

### Result

- `src/astronomyEngineProvider.js` now calculates candidate geocentric tropical ecliptic longitudes for the 10 main natal planets through `astronomy-engine@2.1.19`.
- Covered bodies: Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune and Pluto.
- API paths used:
  - Sun: `SunPosition(date).elon`;
  - Moon: `EclipticGeoMoon(date).lon`;
  - planets: `GeoVector(body, date, true) -> Ecliptic(vector).elon`.
- Smoke validation checks finite normalized longitudes, sign, degree and minutes.
- Reference fixture accuracy is still pending; synthetic fixtures still have `expectedStatus: "pending-provider-approval"`.
- `natalEngine` production behavior remains `notSupported` through the existing default `planetaryPositionProvider` path until fixture validation is approved.
- Houses, ASC / MC, transits, orbs, natal chart UI and user-facing natal values remain unavailable.
- `src/app.js`, `index.html`, `sw.js`, `src/ephemeris-data.js`, and `scripts/generate-ephemeris.cjs` were not changed.

## Task 6.5b — Validate astronomy-engine planet API against reference fixtures

Status: done

Goal: compare `astronomy-engine` natal planet longitudes against an independent reference source before any user-facing natal values are enabled.

### Result

- Added test-only Swiss Ephemeris reference fixtures in `test/fixtures/natalProviderReferenceFixtures.js`.
- Added `test/natalProviderReferenceValidation.test.js`.
- Reference source: local dev dependency `swisseph`, used only in Node tests.
- Validated UTC fixtures:
  - `2000-01-01T12:00:00.000Z`;
  - `1900-06-15T00:00:00.000Z`;
  - `2026-05-15T10:33:00.000Z`;
  - `1985-11-03T06:30:00.000Z`.
- Tolerances:
  - Sun and planets: `0.25°`;
  - Moon: `0.5°`.
- Validated features: geocentric tropical ecliptic longitudes for the 10 main natal planets.
- Still not validated / not supported: houses, ASC / MC, transits, aspects, orbs, retrograde and speed.
- User-facing natal values, natal chart UI, `src/app.js`, `index.html`, `sw.js`, `src/ephemeris-data.js`, and `scripts/generate-ephemeris.cjs` were not changed.

# Completed Sprint 6 Tasks

## Task 6.6 — Retrograde / Speed Support

Status: done

Goal: add retrograde/speed only if provider supports it reliably.

### Result

- `src/astronomyEngineProvider.js` now returns provider-layer longitude speed in degrees per day for the 10 main natal planets.
- Speed is calculated by central difference on the already validated geocentric tropical longitude path with signed 0/360 wrap-around handling.
- Retrograde is derived as `speed < 0` and validated against local Swiss Ephemeris speed sign.
- Swiss Ephemeris speed reference uses `SEFLG_SWIEPH | SEFLG_SPEED` in test-only code.
- Added Mercury and Venus retrograde-sensitive UTC fixtures.
- Validated speed tolerances:
  - Sun and planets: `0.02°/day`;
  - Moon: `0.05°/day`.
- Houses, ASC / MC, transits, aspects, orbs, natal chart UI and user-facing natal values remain unavailable.
- `src/app.js`, `index.html`, `sw.js`, `package.json`, `package-lock.json`, `src/ephemeris-data.js`, and `scripts/generate-ephemeris.cjs` were not changed.

# Completed Sprint 6 Tasks

## Task 6.7 — Provider Debug and Validation Report

Status: done

Goal: add safe debug info about provider and fixture validation without private birth data.

### Result

- Added `NATAL_PROVIDER_VALIDATION_REPORT.md`.
- Added safe provider validation summary helper for debug output.
- `?debug=1` now includes `Natal Provider Validation` with provider/version, validation statuses, fixture count, max deltas, validated bodies and unsupported feature labels.
- Debug does not show private birth data, full profile JSON, active-profile planet values or actual natal longitudes.
- User-facing natal values, natal chart UI, houses, ASC / MC, transits, aspects, orbs and personal ritual scoring remain unavailable.
- PWA cache updated to `lunar-calendar-v60`.
- `src/app.js`, `index.html`, `package.json`, `package-lock.json`, `src/ephemeris-data.js`, and `scripts/generate-ephemeris.cjs` were not changed.

# Completed Sprint 6 Tasks

## Task 6.8 — Sprint 6 Hardening

Status: done

Goal: finalize Sprint 6 with privacy, accuracy, unsupported-state and test checks.

### Result

- Audited Task 6.1–6.7 outputs and confirmed Sprint 6 provider selection / fixture validation work is complete.
- Confirmed user-facing UI does not show natal planet values, natal chart UI, houses, ASC / MC, personal transits, natal aspects or orbs.
- Confirmed `astronomy-engine@2.1.19` remains isolated to the provider layer and user-facing natal values remain disabled.
- Confirmed longitude, speed and retrograde validation are documented against local Swiss Ephemeris reference fixtures.
- Confirmed houses, ASC / MC, personal transits, natal aspects, orbs, natal chart UI and personal ritual scoring remain unsupported.
- Confirmed `npm audit --omit=dev` remains clean and the `swisseph` dev dependency audit findings stay in the separate security backlog item.

# Completed Sprint

## Sprint 7 — Natal Planets UI / Read-only Natal Positions

Status: completed

### Goal

Expose safe read-only natal planet positions only when input readiness and provider output are valid.

### Important Boundary

Do not show natal planets unless calculation input is genuinely ready and provider returns validated positions.

Do not fake local birth time to UTC conversion.

Do not implement houses, ASC / MC, transits, aspects, or chart wheel.

# Completed Task

## Task 7.1 — Natal Planets UI Readiness Audit

Status: done

### Goal

Decide whether natal planets can be shown now and where.

### Required Questions

1. Can current profile data produce provider-ready UTC input?
2. Does `birthDateTime` still return `canConvertToUtc: false`?
3. Can natal planets be user-facing yet?
4. Should the first UI be disabled/readiness-only until UTC strategy is solved?
5. Where should the future natal planets section live?
6. What must remain hidden?

### Deliverable

Create or update:

```txt
NATAL_PLANETS_UI_STRATEGY.md
```

### Acceptance Criteria

- `NATAL_PLANETS_UI_STRATEGY.md` exists.
- It states whether user-facing natal planet values are allowed now.
- It identifies blockers.
- No fake values.
- No UI changes.
- No code changes unless explicitly required for documentation-only support.
- Task 7.2 remains next.

### Result

- Created `NATAL_PLANETS_UI_STRATEGY.md`.
- Confirmed `astronomy-engine@2.1.19` provider-layer longitude, speed and retrograde validation is complete for the 10 main natal planets.
- Confirmed ordinary saved profiles cannot safely produce provider-ready UTC input yet because `src/birthDateTime.js` returns `canConvertToUtc: false` and `utcDateTime: null`.
- Decision: user-facing natal planet values for ordinary profiles are not allowed yet.
- Recommended first UI: readiness-only natal planets copy inside `Мои карты` / profile details.
- Task 7.4 remains blocked until UTC readiness is solved.

# Completed Task

## Task 7.2 — Natal Planet Formatting Helper

Status: done

Goal: create pure formatting helpers for already-calculated natal planet positions. Do not calculate planets, call providers or add UI.

### Result

- Added `src/natalPlanetDisplay.js` as a pure display helper for already-calculated natal planet positions.
- Added `test/natalPlanetDisplay.test.js`.
- Formatter outputs compact sign/degree/minute text such as `Солнце — Телец 15°30′`.
- Retrograde planets use the short `R` marker, for example `Меркурий R — Телец 15°30′`.
- Invalid / incomplete planet objects are filtered safely and do not produce `NaN`, `undefined` or fake signs.
- The helper does not call `astronomy-engine`, providers, profiles, localStorage or UI code.

# Completed Task

## Task 7.3 — Natal Planets Readiness UI

Status: done

Goal: add an honest UI shell/readiness state if natal planets cannot be shown because UTC conversion or provider input readiness is not ready.

### Result

- Added a compact readiness-only `Натальные планеты` block inside the `Мои карты` panel.
- The block appears only when a saved profile is active; `Общий день` keeps it hidden.
- The block says natal planets are not ready to display and explains that date, time and birth timezone readiness is still needed.
- Missing data is shown only as human labels: `дата рождения`, `время рождения`, `часовой пояс рождения`, `координаты места рождения`.
- The block does not show raw birth date, birth time, coordinates, full profile JSON or natal planet values.
- UTC readiness remains the blocker for real user-facing natal planets.
- PWA cache was updated to `lunar-calendar-v61`.

# Completed Task

## Task 7.4a — Birth Time UTC Strategy / Readiness Unblock

Status: done

Goal: decide how to safely convert birth local date/time/timezone into UTC for future user-facing natal planet display.

### Result

- Added `BIRTH_TIME_UTC_STRATEGY.md`.
- Confirmed current `src/birthDateTime.js` intentionally keeps `canConvertToUtc: false` and `utcDateTime: null`.
- Confirmed native `Date` must not be used to treat birth local time as UTC or as the device timezone.
- Compared native `Intl`, native `Temporal`, `luxon`, `date-fns-tz`, `moment-timezone`, and Temporal polyfill.
- Recommended `luxon` as the first local-only Sprint 7 implementation candidate, pending explicit dependency approval.
- Task 7.4 remains blocked until UTC conversion is implemented and tested.
- No app code, provider code, package files, UI, natal planet values, houses, ASC / MC, transits, aspects or orbs were changed.

## Task 7.4b — Implement Birth Time UTC Conversion

Status: done

Goal: implement safe local birth date/time/timezone to UTC conversion according to `BIRTH_TIME_UTC_STRATEGY.md`.

### Result

- Installed approved dependency `luxon@3.7.2`.
- Vendored Luxon's browser ESM runtime as `src/vendor/luxon.mjs` with `src/vendor/luxon.LICENSE.md` for static GitHub Pages / PWA runtime safety.
- `src/birthDateTime.js` now converts valid local birth date/time/timezone to UTC ISO using Luxon.
- Successful conversion returns `status: "ready"`, `canConvertToUtc: true`, and an ISO UTC `utcDateTime`.
- Missing/invalid birth date, birth time, or timezone returns `status: "incomplete"` and `utcDateTime: null`.
- Unknown birth time returns `status: "incomplete"` and keeps houses / ASC / MC unavailable.
- Ambiguous DST overlap local times fail closed with a warning instead of silently choosing an offset.
- Nonexistent DST gap local times fail closed with a warning instead of silently shifting time.
- Houses, ASC / MC, transits, aspects, orbs, natal chart UI and user-facing natal planet values were not added.
- PWA cache was updated to `lunar-calendar-v64`.

# Completed Task

## Task 7.4 — Read-only Natal Planets Panel

Status: done

Goal: show actual natal planet positions if and only if provider input is ready and the provider returns validated planet positions.

Important boundary:

- do not show values for profiles whose birth time is unknown;
- do not show values for ambiguous or nonexistent local birth times;
- do not show houses, ASC / MC, transits, aspects, orbs, chart wheel, or personal ritual scoring;
- do not show raw birth data, raw UTC input, raw timezone, raw coordinates, raw longitude or speed in the main UI.

### Result

- Added read-only natal planet list inside the existing `Мои карты` natal planets block.
- Added `src/natalPlanetsForProfile.js` to connect safe UTC readiness, validated `astronomy-engine` provider output and `src/natalPlanetDisplay.js` formatting.
- Planet list appears only for an active saved profile with `canConvertToUtc: true` and provider status `ready`.
- Missing coordinates do not block the planet list.
- Unknown birth time, missing timezone, invalid input, ambiguous DST overlap and nonexistent DST gap keep the readiness fallback and do not show planets.
- The UI shows formatted planet label, sign, degree/minutes and `R` marker only; it does not show raw birth data, `utcDateTime`, raw timezone, coordinates, raw longitude or speed.
- Houses, ASC / MC and transits remain limitation-only and are not calculated.
- Vendored `astronomy-engine` runtime as `src/vendor/astronomy-engine.mjs` with `src/vendor/astronomy-engine.LICENSE.md` for static GitHub Pages / PWA runtime safety.
- Post-task UI regression fix: opening `Мои карты` resets create/edit state to list mode, and selecting `Общий день` or a saved profile closes the form state.
- The `+ Добавить профиль` button remains visible in list mode.
- Post-task UX polish: the ready natal planets list is collapsed by default, shows a compact summary plus `Показать`, expands to the full list on click, and resets to collapsed when profile selection changes.
- PWA cache was updated to `lunar-calendar-v66`.

# Completed Task

## Task 7.5 — Natal Planets Debug

Status: done

Goal: add safe debug info such as planet count, provider, validation status and user-facing enabled/disabled. Do not dump birth data.

### Result

- Added `src/natalPlanetsDebug.js` as a sanitized debug summary helper for the read-only natal planets UI state.
- `?debug=1` now includes `Natal Planets UI Debug` with active profile status, panel status, user-facing enabled / disabled state, UTC readiness, provider validation, planet counts, collapsible default, `Мои карты` location, and unsupported feature flags.
- The debug section does not expose birth date, birth time, UTC datetime, timezone values, coordinates, full profile JSON, raw planet longitudes, raw speed values, or the full active-profile planet list.
- Houses, ASC / MC, transits, aspects and orbs remain `notSupported`.
- PWA cache was updated to `lunar-calendar-v67`.

# Completed Task

## Task 7.6 — Sprint 7 Hardening

Status: done

Goal: finalize Sprint 7 and confirm no fake natal values or unsupported features are shown.

### Result

- Completed Sprint 7 hardening audit.
- Confirmed Task 7.1–7.5 are closed.
- Confirmed the read-only natal planets panel appears only inside `Мои карты` for an active saved profile with safe UTC readiness and ready provider output.
- Confirmed `Общий день`, unknown birth time, missing/invalid date/time/timezone, ambiguous DST overlap and nonexistent DST gap keep the planet list hidden.
- Confirmed missing coordinates do not block geocentric natal planet display.
- Confirmed houses, ASC / MC, transits, natal aspects, orbs, chart wheel and personal ritual scoring remain not supported.
- Confirmed runtime imports use tracked vendor assets for Luxon and Astronomy Engine.
- Synced Sprint 7 strategy/report docs with the implemented read-only planet panel.

# Sprint 7 Status

Sprint 7 is completed.

# Current Active Sprint

## Sprint 8 — Natal Aspects Foundation

Status: active

### Goal

Calculate and display natal aspects between validated natal planets.

### Important Boundary

Sprint 8 is for natal aspects between natal planets only.

Do not implement personal transits, houses, ASC / MC, chart wheel, fixed stars, dignities, terms / decans, or ritual scoring.

# Completed Task

## Task 8.1 — Natal Aspects Strategy / Orb Rules

Status: done

### Goal

Define aspect set, orb model, sorting, display constraints, and unsupported features before coding the aspect engine.

### Deliverable

Create:

```txt
NATAL_ASPECTS_STRATEGY.md
```

### Acceptance Criteria

- `NATAL_ASPECTS_STRATEGY.md` exists.
- Orb rules are documented.
- No code changes.
- No UI changes.
- Task 8.2 remains next.

### Result

- Added `NATAL_ASPECTS_STRATEGY.md`.
- Selected Sprint 8 major aspect set: conjunction, sextile, square, trine and opposition.
- Defined explicit orb policy: `finalAllowedOrb = min(aspectBaseOrb, bodyPairOrb)`.
- Defined aspect base caps and body-pair caps, including narrower outer-outer orbs.
- Defined strength bands for exact / strong / medium / weak aspect priority.
- Decided that applying / separating remains `null` in Sprint 8 until separately validated.
- Defined duplicate pair rules, canonical planet order, sorting rules, display rules, privacy boundaries and validation requirements.
- Code, UI, package files, provider calculations, houses, ASC / MC, transits, fixed stars and interpretation engine were not changed.

# Completed Task

## Task 8.2 — Natal Aspect Engine

Status: done

### Goal

Create a pure engine for aspects between validated natal planet positions.

### Acceptance Criteria

- Major aspects are calculated from passed-in natal planet longitudes.
- Explicit orb policy from `NATAL_ASPECTS_STRATEGY.md` is applied.
- Duplicate pairs are prevented.
- Same-body pairs and invalid planets are ignored.
- No fake aspects.
- No transits.
- No houses / ASC / MC.
- Tests pass.

### Result

- Added `src/natalAspectEngine.js`.
- Added `test/natalAspectEngine.test.js`.
- Engine calculates only Sprint 8 major natal aspects between passed-in natal planet objects.
- Implemented explicit orb policy from `NATAL_ASPECTS_STRATEGY.md`: `finalAllowedOrb = min(aspectBaseOrb, bodyPairOrb)`.
- Implemented body-pair caps for luminaries, personal planets, social / outer involvement, and outer-only pairs.
- Implemented strength bands: `exact`, `strong`, `medium`, `weak`.
- Implemented canonical duplicate prevention and same-body / invalid-planet filtering.
- Applying / separating remain `null`.
- Engine is pure: it does not import providers, Luxon, profiles, localStorage, DOM or UI modules.
- UI, provider calculations, package files, houses, ASC / MC, transits and interpretations were not changed.

# Completed Task

## Task 8.3 — Natal Aspect Validation / Fixtures

Status: done

### Goal

Validate natal aspect engine behavior with deterministic fixtures and boundary cases.

### Acceptance Criteria

- Deterministic fixtures exist.
- Exact aspect and orb boundary cases are covered.
- Wrap-around is tested.
- No private user birth data is used.
- Tests pass.

### Result

- Added `test/fixtures/natalAspectFixtures.js`.
- Added `test/natalAspectFixtures.test.js`.
- Added `test/natalAspectValidation.test.js`.
- Added `NATAL_ASPECT_FIXTURE_STRATEGY.md`.
- Fixtures are synthetic and manually expected; no private birth data, user profiles or real birth charts are used.
- Fixture categories cover exact major aspects, near-inside orb, just-outside orb, wrap-around, duplicate prevention, outer-outer narrow orb, luminary wide orb, invalid planets, no-aspect cases and sorting priority.
- Expected aspects are not generated by the engine under test.
- Aspect engine code, UI, provider calculations, package files, houses, ASC / MC, transits and interpretations were not changed.

# Completed Task

## Task 8.4 — Natal Aspect Display Helper

Status: done

### Goal

Create a pure display helper for already calculated natal aspects.

### Acceptance Criteria

- Formats already calculated aspect objects without calculating new aspects.
- Does not call providers, profiles, localStorage, DOM or UI.
- Does not show transits, houses, ASC / MC or interpretations.
- Tests pass.

### Result

- Added `src/natalAspectDisplay.js`.
- Added `test/natalAspectDisplay.test.js`.
- Helper formats already calculated aspect objects into compact user-facing copy such as `Солнце □ Луна · орб 2°15′`.
- Helper exposes list formatting, summary counts, display limitations and displayability checks.
- Summary counts `square` / `opposition` as tense, `trine` / `sextile` as harmonious, and `conjunction` separately.
- Invalid / incomplete aspect objects are filtered safely without `NaN`, `undefined`, raw technical fields or private profile data.
- Helper does not import or call the aspect engine, providers, profiles, localStorage, DOM or UI code.
- UI, provider calculations, package files, houses, ASC / MC, transits and interpretations were not changed.

# Completed Task

## Task 8.5 — Natal Aspects Collapsible UI

Status: done

### Goal

Add a collapsible natal aspects section inside `Мои карты` using already calculated aspects and the display helper.

### Acceptance Criteria

- Section is collapsed by default.
- No aspects are shown unless natal planets are ready and aspect calculation is safe.
- No transits, houses, ASC / MC or interpretations are shown.
- Tests pass.

### Result

- Added `src/natalAspectsForProfile.js`.
- Added `test/natalAspectsForProfile.test.js`.
- Added a collapsible `Натальные аспекты` section inside `Мои карты`, placed under the existing `Натальные планеты` section.
- Aspect UI uses the existing safe chain: `getNatalPlanetsForProfile()` → `calculateNatalAspects()` → `formatNatalAspectList()` / `summarizeNatalAspects()`.
- Section is collapsed by default, resets with profile changes / `Общий день`, and does not hide `+ Добавить профиль` or open edit mode automatically.
- Not-ready profiles show fallback copy: `Пока недоступны.` / `Сначала нужен расчет натальных планет.`
- Ready profiles show only summary in collapsed state and formatted aspect rows after explicit expansion.
- UI does not show raw birth data, UTC datetime, raw timezone, coordinates, raw planet longitudes, raw aspect angle, `allowedOrb`, technical source, houses, ASC / MC, transits or interpretations.
- PWA cache updated to `lunar-calendar-v69`.
- Provider calculations, aspect engine, package files, ephemeris data, transits, houses, ASC / MC and interpretations were not changed.

# Completed Task

## Task 8.6 — Natal Aspects Debug

Status: done

### Goal

Add a safe debug/status layer for the natal aspects UI without exposing raw profile or aspect data.

### Acceptance Criteria

- `?debug=1` includes `Natal Aspects UI Debug`.
- Ordinary UI does not include debug output.
- Debug shows only status, counts, configured aspect support and unsupported feature flags.
- Debug does not show raw birth data, raw planet values, raw aspect angles, `allowedOrb`, full aspect lists, houses, ASC / MC, transits or interpretations.
- Tests pass.

### Result

- Added `src/natalAspectsDebug.js`.
- Added `test/natalAspectsDebug.test.js`.
- Extended `src/debugPanel.js` with a safe `Natal Aspects UI Debug` section.
- Debug shows active profile id/name, ready/hidden/incomplete status, enabled/disabled user-facing aspect state, natal planets readiness, aspect engine status, major-only aspect set, configured orb policy, aspect counts and still-not-supported feature flags.
- Missing fields and warnings are human-readable only.
- Debug does not include raw birth data, UTC datetime, raw timezone, coordinates, raw planet longitudes/speeds, raw aspect angles, `allowedOrb`, full planet/aspect lists, houses, ASC / MC, transits or interpretations.
- PWA cache updated to `lunar-calendar-v70`.
- User-facing natal aspects UI, aspect engine, provider calculations, package files, ephemeris data, houses, ASC / MC, transits and interpretations were not changed.

# Completed Task

## Task 8.7 — Sprint 8 Hardening

Status: done

### Goal

Close Sprint 8 with a final audit of natal aspect calculation, fixtures, display, UI, debug, privacy, runtime and documentation boundaries.

### Result

- Completed Sprint 8 hardening audit.
- Confirmed Task 8.1–8.6 are closed.
- Confirmed natal aspects are calculated only for an active saved profile after natal planets are ready and only through the Sprint 8 major-aspect engine / explicit orb policy.
- Confirmed `Общий день`, incomplete natal planets, failed UTC conversion, unknown birth time, missing / invalid timezone and DST ambiguous / nonexistent fail-closed cases do not show natal aspects.
- Confirmed aspect engine remains pure, major-only, duplicate-safe, wrap-around safe, `NaN`-safe and leaves applying / separating as `null`.
- Confirmed fixtures are synthetic/manual, contain no private profile data and do not generate expected values from the engine under test.
- Confirmed display and UI do not show raw birth data, raw planet longitudes, raw aspect angles, `allowedOrb`, transits, houses, ASC / MC or interpretations.
- Confirmed `Natal Aspects UI Debug` is available only under `?debug=1` and exposes only safe summary/status/counts.
- Confirmed runtime imports use tracked vendor assets and PWA cache remains current.
- Package files, dependencies, provider calculations, ephemeris data and generator were not changed.

# Sprint 8 Status

Sprint 8 is completed.

# Completed Sprint

## Sprint 9 — Essential Dignities Foundation

Status: completed

### Goal

Add basic sign-based essential dignities for natal planets:

- domicile / rulership;
- exile / detriment;
- exaltation;
- fall.

### Important Boundary

Sprint 9 covers basic sign-based essential dignities only.

Do not implement:

- terms;
- decans;
- degree rulers;
- fixed stars;
- houses / ASC / MC;
- transits;
- interpretations;
- ritual scoring.

# Sprint 9 Completed Tasks

## Task 9.1 — Essential Dignities Strategy / Source Decision

Status: done

### Goal

Define source system and rules for domicile, detriment, exaltation, and fall.

### Deliverable

Create:

```txt
ESSENTIAL_DIGNITIES_STRATEGY.md
```

### Must Decide

- source system for domicile / detriment / exaltation / fall;
- whether to use Vronsky table values now or later;
- whether exaltation degrees are used in Sprint 9;
- whether scoring is included in MVP;
- how to label dignity / debility in UI;
- what remains deferred to Sprint 10.

### Acceptance Criteria

- `ESSENTIAL_DIGNITIES_STRATEGY.md` exists.
- Source system is documented.
- Score model is documented or deferred.
- No code changes.
- No UI changes.
- Task 9.2 remains next.

## Task 9.2 — Essential Dignity Data Model / Dataset

Status: done

### Goal

Create the source-tracked essential dignity dataset according to `ESSENTIAL_DIGNITIES_STRATEGY.md`.

### Important Boundary

Task 9.2 must create data/model foundations only.

Do not create the lookup engine, UI, debug layer, terms / decans / degree rulers, Vronsky degree tables, houses, ASC / MC, transits, interpretations or ritual scoring.

### Acceptance Criteria

- `src/essentialDignitiesData.js` exists.
- Dataset includes source metadata, classical dignity tables, modern outer rulership labels, score model and deferred feature list.
- Tests cover policy, tables, score model, exclusions and read-only stability.
- No lookup engine.
- No UI changes.
- Task 9.3 remains next.

## Task 9.3 — Essential Dignity Lookup Engine

Status: done

### Goal

Create the pure lookup engine that evaluates already-calculated natal planet sign placement against `src/essentialDignitiesData.js`.

### Important Boundary

Task 9.3 must not add UI, debug output, terms / decans / degree rulers, Vronsky degree tables, houses, ASC / MC, transits, interpretations or ritual scoring.

### Acceptance Criteria

- `src/essentialDignities.js` exists.
- Engine evaluates passed natal planet objects through `src/essentialDignitiesData.js`.
- Multiple classical flags use additive scoring.
- Modern outer rulership labels remain score `0`.
- Invalid planets are handled safely.
- No UI changes.
- Task 9.4 remains next.

# Completed Task

## Task 9.4 — Essential Dignity Validation / Fixtures

Status: done

### Goal

Add deterministic fixture validation for the essential dignity lookup engine.

### Important Boundary

Task 9.4 must not add UI, debug output, terms / decans / degree rulers, Vronsky degree tables, houses, ASC / MC, transits, interpretations or ritual scoring.

### Acceptance Criteria

- `test/fixtures/essentialDignityFixtures.js` exists.
- `test/essentialDignityFixtures.test.js` validates fixture shape, categories, synthetic policy and exclusions.
- `test/essentialDignityValidation.test.js` validates the lookup engine against manual expected fixture results.
- `ESSENTIAL_DIGNITY_FIXTURE_STRATEGY.md` documents fixture policy.
- Fixtures are synthetic/manual and do not use private birth data.
- Expected values are not generated by the engine under test.
- No UI changes.
- Task 9.5 remains next.

# Completed Task

## Task 9.5 — Essential Dignity Display Helper

Status: done

### Goal

Create a pure display helper for already evaluated essential dignity results.

### Important Boundary

Task 9.5 must not add UI, debug output, lookup rules, terms / decans / degree rulers, Vronsky degree tables, houses, ASC / MC, transits, interpretations or ritual scoring.

### Acceptance Criteria

- `src/essentialDignityDisplay.js` exists.
- `test/essentialDignityDisplay.test.js` covers formatting, summary, limitations, invalid input and source-import boundaries.
- Helper formats already evaluated dignity results only.
- Helper does not import or call lookup engine, provider modules, profile storage, DOM or UI.
- No UI changes.
- Task 9.6 remains next.

# Completed Task

## Task 9.6 — Essential Dignities Collapsible UI

Status: done

### Goal

Add a collapsible essential dignities section inside `Мои карты` using the existing lookup and display layers.

### Important Boundary

Task 9.6 must not add new dignity rules, terms / decans / degree rulers, Vronsky degree tables, houses, ASC / MC, transits, interpretations or ritual scoring.

### Acceptance Criteria

- `src/essentialDignitiesForProfile.js` connects ready natal planet output to the essential dignity lookup and display helpers.
- `Достоинства планет` section appears inside `Мои карты` only for active saved profiles.
- Section is collapsed by default, shows summary in collapsed state and reveals formatted dignity rows only after explicit click.
- Incomplete natal planets show fallback `Сначала нужен расчет натальных планет.`
- The section does not expose raw birth data, UTC datetime, timezone values, coordinates, raw longitudes, terms / decans / degree rulers, Vronsky rows, houses, ASC / MC, transits or interpretations.
- `test/essentialDignitiesForProfile.test.js`, profile UI tests and markup tests cover the helper, shell placement, collapsed state and exclusions.
- Task 9.7 remains next.

# Completed Task

## Task 9.7 — Essential Dignities Debug

Status: done

### Goal

Add a safe debug/status layer for the essential dignities UI.

### Important Boundary

Task 9.7 must not add new dignity rules, terms / decans / degree rulers, Vronsky degree tables, houses, ASC / MC, transits, interpretations or ritual scoring.

### Acceptance Criteria

- `src/essentialDignitiesDebug.js` exists.
- `?debug=1` includes `Essential Dignities UI Debug`.
- Debug output shows only safe status, counts, source policy, deferred feature flags and notSupported capabilities.
- Debug output does not expose raw birth data, UTC datetime, timezone values, coordinates, raw planet values, full dignity result lists, terms / decans / degree ruler rows, Vronsky rows, houses, ASC / MC values, transits, interpretations or ritual scoring.
- Existing Natal Planets UI Debug, Natal Aspects UI Debug and Natal Provider Validation debug sections continue to work.
- User-facing essential dignities UI behavior did not change.
- Task 9.8 remains next.

# Completed Task

## Task 9.8 — Sprint 9 Hardening

Status: done

### Goal

Final hardening for Sprint 9.

### Acceptance Criteria

- Task 9.1–9.7 results audited.
- Basic essential dignities remain sign-based only.
- Terms / decans / degree rulers, Vronsky rows, exact exaltation degrees, houses, ASC / MC, transits, interpretations and ritual scoring remain out of scope.
- UI and debug continue to avoid raw birth data and raw technical dignity data.
- Sprint 9 is closed.

# Current Active Sprint

## Sprint 10 — Terms / Decans / Degree Rulers

Status: active

### Goal

Add verified detailed dignity lookup layers:

- terms / bounds;
- decans / faces;
- degree rulers.

### Important Boundary

Sprint 10 handles source-tracked lookup datasets and lookup logic, not coordinate calculation.

Do not OCR-import dense screenshots blindly.

Table 7 / Vronsky degree rulers are part of Sprint 10, but require a separate transcription / verification / dataset / lookup flow before UI.

Table 6 and Table 7 degree-ruler systems must not be mixed.

Do not implement fixed stars, houses / ASC / MC, transits, interpretations or ritual scoring.

# Completed Task

## Task 10.1 — Terms / Decans / Degree Rulers Strategy and Source Audit

Status: done

### Goal

Define source policy, scope, and implementation order for terms, decans, and degree rulers.

### Deliverable

Create:

```txt
TERMS_DECANS_DEGREE_RULERS_STRATEGY.md
```

### Must Decide

- whether Sprint 10 implements all three layers or phases them;
- source system for terms;
- source system for decans;
- source system for degree rulers;
- what Vronsky screenshots are available;
- what requires manual verification;
- what remains deferred.

### Acceptance Criteria

- `TERMS_DECANS_DEGREE_RULERS_STRATEGY.md` exists.
- Source systems are documented.
- Vronsky screenshot tables are inventoried.
- No code changes.
- No dataset created.
- Task 10.2 remains next.

### Result

- Created `TERMS_DECANS_DEGREE_RULERS_STRATEGY.md`.
- Selected terms as the first implementation target, using Vronsky Table 5 only after manual verification.
- Deferred decans until a source system is selected and verified.
- Deferred degree rulers until Table 6 / Table 7 source rows are manually verified.
- Confirmed no Vronsky screenshot files are currently present in the repository.
- No code, datasets, OCR import, lookup engine or UI were created.

# Completed Task

## Task 10.2 — Vronsky Dataset Entry Policy

Status: done

Goal:

Define how screenshot/table data is converted into structured datasets safely.

Acceptance criteria:

- no blind OCR;
- source references required;
- manual verification required;
- boundary tests required;
- dataset metadata required;
- Task 10.3 remains next.

Result:

- Created `VRONSKY_DATASET_ENTRY_POLICY.md`.
- Defined no blind OCR policy.
- Defined source inventory, active/deferred sources, manual entry workflow, dataset metadata, row metadata, verification statuses, boundary testing requirements, OCR usage rules and review checklist.
- Confirmed Table 5 Terms is the first active target only after source/manual verification.
- Confirmed Table 6 and Table 7 are separate source systems.
- No dataset, lookup engine, OCR import, UI or app code was created.

# Completed Task

## Task 10.3a — Terms Table 5 Transcription Draft

Status: done

Goal:

Create a non-active draft transcription document for Vronsky Table 5 — Terms.

Acceptance criteria:

- `TERMS_TABLE_5_TRANSCRIPTION_DRAFT.md` exists.
- Source image `table5.png` is recorded as the source reference.
- User-provided transcription is captured as draft rows.
- Every row is marked `needsReview`.
- Nothing is marked `verified`.
- Questions about final ranges ending at `29°` are recorded.
- No active JS dataset is created.
- No lookup engine is created.
- No app code is changed.

Result:

- Created `TERMS_TABLE_5_TRANSCRIPTION_DRAFT.md`.
- Transcribed 60 draft rows across 12 zodiac signs.
- Marked every row as `needsReview`.
- Recorded manual verification questions for range endings, gaps/overlaps, values and ruler checks.
- No active dataset, lookup engine, OCR import, UI or app code was created.

# Completed Task

## Task 10.3b — Terms Table Manual Verification

Status: done

Goal:

Manually verify Table 5 draft rows against `table5.png` before any active dataset is created.

Acceptance criteria:

- All start/end degrees are checked against the source image.
- All rulers are checked against the source image.
- All values are checked against the source image.
- Rows ending at `29°` are explicitly resolved.
- Gaps and overlaps are checked for every sign.
- Verified rows and unclear rows are separated.
- No active JS dataset is created until verification is complete.

Result:

- Created `TERMS_TABLE_5_VERIFICATION_REPORT.md`.
- Checked 60 rows against `table5.png`.
- Source check counts: 60 match, 0 unclear, 0 mismatch.
- Recorded final printed end `29°` signs: Aries / Овен, Taurus / Телец, Libra / Весы, Scorpio / Скорпион.
- Confirmed active dataset and lookup engine were not created.

# Completed Task

## Task 10.3c — Terms Dataset from Verified Table 5 Rows

Status: done

Goal:

Create verified structured terms dataset from manually reviewed Table 5 rows only after final interval normalization is explicitly approved.

Acceptance criteria:

- Table 5 source material is available and manually verified.
- `TERMS_TABLE_5_VERIFICATION_REPORT.md` has 60 match, 0 unclear, 0 mismatch.
- Final interval normalization for printed `29°` rows is explicitly approved.
- Dataset is source-tracked.
- Dataset metadata and row metadata are present.
- Dataset stores printed range and normalized range for final intervals.
- Only verified rows can be active.
- Boundaries are explicit.
- No decans or degree rulers are included.
- No OCR-only rows are active.
- Tests pass.

Completion:

- Added `src/termsData.js` with the verified Vronsky Table 5 — Terms dataset.
- Stored 60 verified rows across 12 zodiac signs with source metadata and row metadata.
- Preserved `printedEndDegree` from the source and added `normalizedEndExclusive` for future half-open lookup intervals.
- Explicitly normalized final printed `29°` rows for Aries / Овен, Taurus / Телец, Libra / Весы and Scorpio / Скорпион to `normalizedEndExclusive: 30`.
- Added `test/termsData.test.js` covering row count, sign coverage, verified-only status, interval coverage, final `29°` normalization, allowed rulers, deferred features, read-only boundaries and strict exclusions.
- No lookup engine, UI, decans, degree rulers or other Vronsky tables were added.

# Completed Task

## Task 10.4 — Terms Lookup Engine / Fixtures

Status: done

Goal:

Create pure lookup engine for terms with boundary fixtures.

Completion:

- Added pure lookup module `src/terms.js`.
- Added manual fixture data in `test/fixtures/termsFixtures.js`.
- Added `test/termsFixtures.test.js`, `test/terms.test.js` and `test/termsValidation.test.js`.
- Lookup uses the verified `src/termsData.js` rows and the half-open interval policy `[startDegree, normalizedEndExclusive)`.
- Final printed `29°` rows use `normalizedEndExclusive: 30` for lookup while preserving `printedEndDegree: 29` in output.
- Planet input can resolve from `sign + degree/minutes` or fall back to valid longitude through `src/astroMath.js`.
- No UI, display helper, decans, degree rulers or other Vronsky tables were added.

# Completed Task

## Task 10.5 — Decans Source Decision / Dataset

Status: done

Goal:

Choose decan system and create dataset only if source is verified.

Completion:

- Created `DECANS_SOURCE_DECISION.md`.
- Reviewed uploaded PDF `4148867_vvedenie_v_astrologiyu.pdf` for Star of the Magi, trigon decans, Figure 4.7 and Figure 4.8.
- Confirmed Vronsky presents two decan systems: Star of the Magi / Egyptian tradition and Trigon / Triplicity.
- Confirmed Star of the Magi uses septener planets only, while Trigon / Vronsky can include active planets including retrograde outer planets.
- Selected Star of the Magi / Egyptian tradition as the first candidate for later transcription and verification.
- Deferred Trigon / Vronsky decans until separate source handling is specified.
- Did not create an active decans dataset because no 36-row transcription and verification report exists yet.
- No code, `src/`, tests, UI, lookup engine, OCR import or package files were changed.

# Completed Task

## Task 10.5b — Decans Star of the Magi Transcription Draft

Status: done

Goal:

Create a non-active draft transcription of the Star of the Magi decan rows from the verified source figure.

Completion:

- Created `DECANS_STAR_OF_MAGI_TRANSCRIPTION_DRAFT.md`.
- Transcribed 36 draft decan rows across 12 zodiac signs from `fig_4_7_decans_star_of_magi.png`.
- Kept every row `needsReview`.
- Kept the draft limited to Star of the Magi / Egyptian tradition and septener planets only.
- Did not create active decans dataset, lookup engine, UI, OCR import or app code changes.

# Completed Task

## Task 10.5c — Decans Star of the Magi Manual Verification

Status: done

Goal:

Verify the decan draft rows against the source figure before active dataset creation.

Completion:

- Created `DECANS_STAR_OF_MAGI_VERIFICATION_REPORT.md`.
- Checked 36 Star of the Magi decan rows against `fig_4_7_decans_star_of_magi.png` and the control table.
- Source check counts: 36 match, 0 unclear, 0 mismatch.
- Confirmed rows remain Star of the Magi / Egyptian tradition only and use septener planets only.
- Confirmed active decans dataset, lookup engine, UI, OCR import, `src/` changes and tests were not created.

# Completed Task

## Task 10.5d — Decans Star of the Magi Dataset from Verified Rows

Status: done

Goal:

Create active decans dataset only from manually verified Star of the Magi rows.

Completion:

- Added `src/decansData.js`.
- Created active source-tracked Star of the Magi / Egyptian tradition decans dataset from 36 verified rows.
- Stored Fig. 4.7 source metadata, verification report reference, transcription draft reference and interval policy `[0,10)`, `[10,20)`, `[20,30)`.
- Kept the dataset septener-only: Sun, Moon, Mercury, Venus, Mars, Jupiter and Saturn.
- Added `test/decansData.test.js` covering source metadata, row count, sign coverage, intervals, verified-only rows, septener-only rulers, deferred systems/features, read-only boundaries and strict exclusions.
- Did not create decans lookup engine, UI, display helper, Trigon/Vronsky decans, degree rulers or other source systems.

# Completed Task

## Task 10.6 — Decans Lookup Engine / Fixtures

Status: done

Goal:

Create pure lookup engine for decans if dataset is ready.

Completion:

- Added pure `src/decans.js`.
- Implemented Star of the Magi / Egyptian tradition decan lookup by `signKey + degreeWithinSign` over the verified `src/decansData.js` rows.
- Added natal planet input lookup with `sign + degree/minutes` preference and longitude fallback through `src/astroMath.js` only when needed.
- Kept lookup intervals half-open as `[startDegree, endDegreeExclusive)`, with `30°` invalid inside one sign.
- Added manual fixtures in `test/fixtures/decansFixtures.js` and validation tests in `test/decansFixtures.test.js`, `test/decans.test.js` and `test/decansValidation.test.js`.
- Did not change the decans dataset, create UI, create display helpers, add Trigon/Vronsky decans, degree rulers or other source systems.

# Completed Task

## Task 10.7a — Degree Rulers Source Decision

Status: done

Goal:

Create source decision and dataset readiness audit for degree rulers.

Completion:

- Created `DEGREE_RULERS_SOURCE_DECISION.md`.
- Confirmed PDF source locations for Table 6 and Table 7.
- Confirmed Table 6 — Star of the Magi degree rulers and Table 7 — Vronsky degree rulers are separate source systems.
- Selected Table 6 as the first candidate only after draft transcription and manual verification.
- Deferred Table 7 to a separate later workflow.
- Did not create active degree rulers dataset, lookup engine, OCR import, UI, tests, `src/` changes or package changes.

# Completed Task

## Task 10.7b — Degree Rulers Table 6 Star of the Magi Transcription Draft

Status: done

Goal:

Create a non-active draft transcription of Table 6 only from source image material.

Completion:

- Created `DEGREE_RULERS_TABLE_6_TRANSCRIPTION_DRAFT.md`.
- Transcribed 360 draft rows across 12 signs x 30 degrees from `table6.jpg`.
- Marked every row `needsReview`; no row was marked `verified`.
- Kept the draft limited to Table 6 / Star of the Magi and septener planets only.
- Did not create active degree rulers dataset, lookup engine, OCR import, UI, tests, `src/` changes, Table 7 rows or package changes.

# Completed Task

## Task 10.7c — Degree Rulers Table 6 Manual Verification

Status: done

Goal:

Verify the Table 6 draft rows against `table6.jpg` before active dataset creation.

Completion:

- Created `DEGREE_RULERS_TABLE_6_VERIFICATION_REPORT.md`.
- Checked 360 rows across 12 signs x 30 degrees against `table6.jpg`.
- Marked 360 rows as `match`, with 0 unclear and 0 mismatched rows.
- Confirmed Table 6 / Star of the Magi source separation from Table 7 / Vronsky degree rulers.
- Did not create active degree rulers dataset, lookup engine, OCR import, UI, tests, `src/` changes, Table 7 rows or package changes.

# Completed Task

## Task 10.7d — Degree Rulers Table 6 Dataset from Verified Rows

Status: done

Goal:

Create active structured dataset from the verified Table 6 rows only after manual verification.

Completion:

- Added `src/degreeRulersStarOfMagiData.js`.
- Created active source-tracked Table 6 / Star of the Magi degree rulers dataset from 360 verified rows.
- Kept the dataset limited to Table 6 / Star of the Magi, septener planets only and integer degrees 0 through 29.
- Added `test/degreeRulersStarOfMagiData.test.js` covering metadata, row count, sign and degree coverage, verified-only rows, septener-only rulers, deferred systems/features, read-only boundaries, sample rows and strict exclusions.
- Did not create lookup engine, UI, display helper, Table 7 / Vronsky degree rulers, OCR import, package changes or PWA cache changes.

# Completed Task

## Task 10.8 — Degree Rulers Lookup Engine / Fixtures

Status: done

Goal:

Create pure lookup engine for degree rulers if dataset is ready.

Completion:

- Added `src/degreeRulersStarOfMagi.js`.
- Implemented pure Table 6 / Star of the Magi degree ruler lookup by `signKey + degreeWithinSign`.
- Implemented `degreeIndex = floor(degreeWithinSign)` for valid `0 <= degreeWithinSign < 30` inputs; `30°` remains invalid inside one sign.
- Added already-calculated natal planet input support with `sign.key + degree/minutes`, sign + degree only and safe longitude fallback through `src/astroMath.js`.
- Added safe array evaluation, summary counts by ruler and capability flags.
- Added manual fixtures and validation tests in `test/fixtures/degreeRulersStarOfMagiFixtures.js`, `test/degreeRulersStarOfMagiFixtures.test.js`, `test/degreeRulersStarOfMagi.test.js` and `test/degreeRulersStarOfMagiValidation.test.js`.
- Did not change the active dataset, UI, app shell, Table 7 / Vronsky degree rulers, package files or PWA cache.

# Completed Task

## Task 10.9 — Terms / Decans / Degree Rulers Display Helper

Status: done

Goal:

Create display formatter for verified lookup results.

Completion:

- Added `src/detailedDignityDisplay.js`.
- Implemented pure formatting for already-computed term, decan and degree-ruler lookup results.
- Added compact user-facing text:
  - `Марс — терм Сатурна · +1`;
  - `Марс — 3-й декан · Венера`;
  - `Марс — 25-й градус · Сатурн`.
- Added safe list formatting, dispatcher, summary counts and display limitations.
- Added `test/detailedDignityDisplay.test.js`.
- Did not call lookup engines, change datasets, create UI, add Table 7 / Vronsky degree rulers, change package files or PWA cache.

# Completed Task

## Task 10.8b — Table 7 Vronsky Degree Rulers Source / Complexity Audit

Status: done

Goal:

Audit Table 7 / Vronsky degree rulers before any transcription, dataset or lookup implementation.

Completion:

- Created `DEGREE_RULERS_TABLE_7_COMPLEXITY_AUDIT.md`.
- Confirmed Table 7 — `Управление градусами (по С. Вронскому)` belongs to Sprint 10 as a degree-ruler source system.
- Confirmed Table 7 remains separate from Table 6 / Star of the Magi degree rulers.
- Recorded that Table 7 is more complex than Table 6 and likely requires multi-ruler rows, source tokens, retrograde marker support and outer-planet handling.
- Confirmed no active Table 7 dataset, lookup engine, OCR import, UI, tests, `src/` changes or package changes were created.
- Replanned remaining Sprint 10 tasks so Table 7 flow happens before UI/debug/hardening.

# Completed Task

## Task 10.8c — Table 7 Vronsky Degree Rulers Transcription Draft

Status: done

Goal:

Create a non-active draft transcription of Table 7 rows from `table7.jpg`.

Completion:

- Created `DEGREE_RULERS_TABLE_7_TRANSCRIPTION_DRAFT.md`.
- Transcribed 360 draft rows across 12 signs x 30 degree rows from `table7.jpg`.
- Kept every row `needsReview`; no row was marked `verified`.
- Preserved visible source tokens and parsed candidate rulers only where symbols were clear enough.
- Marked 98 rows `unclear` where node-like or Gemini-like glyphs require manual verification.
- Kept the draft limited to Table 7 / Vronsky degree rulers and did not use Table 6.
- Did not create active dataset, lookup engine, OCR import, UI, tests, `src/` changes or package changes.

# Completed Task

## Task 10.8d — Table 7 Vronsky Degree Rulers Manual Verification

Status: done

Goal:

Verify all Table 7 draft rows, including multiple rulers, retrograde markers and source tokens.

Completion:

- Created `DEGREE_RULERS_TABLE_7_VERIFICATION_REPORT.md`.
- Checked all 360 Table 7 draft rows against `table7.jpg`.
- Recorded 262 match, 98 unclear and 0 mismatch.
- Kept all Table 7 rows inactive; active dataset was not created.
- Confirmed remaining unclear glyphs block Task 10.8e until a separate resolution step.
- Did not use Table 6, create lookup engine, add OCR import, change `src/`, tests, UI or package files.

# Completed Task

## Task 10.8d-fix — Table 7 Tome 2 Cross-Reference Verification

Status: done

Goal:

Use Vronsky Tome 2 / `Градусология` as a textual cross-reference for Table 7 `Управитель` / `Управители` rows before any active Vronsky degree rulers dataset is created.

Completion:

- Created `DEGREE_RULERS_TABLE_7_TOME2_CROSS_REFERENCE.md`.
- Used Vronsky Tome 2 / `Градусология` only as textual cross-reference for `Управитель` / `Управители` lines.
- Cross-referenced all 360 Table 7 rows against Tome 2.
- Resolved all 98 previously unclear rows.
- Applied 6 additional parsed-ruler corrections from Tome 2.
- Remaining unclear rows: 0; mismatch rows: 0.
- Kept every draft row `needsReview`; active dataset was not created.
- Did not use Table 6, create lookup engine, add OCR import, change `src/`, tests, UI or package files.

# Completed Task

## Task 10.8e — Table 7 Vronsky Degree Rulers Dataset

Status: done

Goal:

Create an active Table 7 dataset only after manual verification.

Completion:

- Added `src/degreeRulersVronskyData.js`.
- Created active source-tracked Table 7 / Vronsky degree rulers dataset from 360 verified and Tome 2 cross-referenced rows.
- Kept Table 7 separate from Table 6 / Star of the Magi degree rulers.
- Stored `sourceTokens` and `rulers[]` per row so multiple rulers, retrograde markers, outer planets, Chiron and Proserpina remain explicit.
- Added dataset metadata, integer degree policy and row model policy.
- Added `test/degreeRulersVronskyData.test.js`.
- Did not create lookup engine, UI, display helper changes, Table 6 rows, OCR import, package changes or PWA cache changes.

# Completed Task

## Task 10.8f — Table 7 Vronsky Degree Rulers Lookup Engine / Fixtures

Status: done

Goal:

Create pure lookup engine and fixtures for verified Table 7 degree rulers.

Completion:

- Added `src/degreeRulersVronsky.js`.
- Implemented pure lookup over the verified Table 7 / Vronsky degree rulers dataset.
- Added boundary policy in code: `degreeIndex = floor(degreeWithinSign)` for valid `0 <= degreeWithinSign < 30`; `30°` stays invalid inside one sign.
- Preserved `sourceTokens[]`, `rulers[]`, multiple rulers and per-ruler `retrograde` values in lookup output.
- Added already-calculated natal planet input support with `sign.key + degree/minutes`, sign + degree only and safe longitude fallback through `src/astroMath.js`.
- Added summary counts by ruler occurrence, multi-ruler rows, retrograde ruler entries and outer-planet ruler entries.
- Added manual fixture and validation coverage in `test/fixtures/degreeRulersVronskyFixtures.js`, `test/degreeRulersVronskyFixtures.test.js`, `test/degreeRulersVronsky.test.js` and `test/degreeRulersVronskyValidation.test.js`.
- Kept Table 7 separate from Table 6 / Star of the Magi degree rulers.
- Did not change datasets, UI, display helper, package files or PWA cache.

# Active Task

## Task 10.9b — Update Detailed Dignity Display Helper for Table 7

Status: active

Goal:

Update display formatting for Table 7 multi-ruler results if the verified Table 7 lookup output requires it.

## Task 10.10 — Terms / Decans / Degree Rulers Collapsible UI

Status: not started

Goal:

Add collapsible section inside `Мои карты` only for implemented and verified layers.

## Task 10.11 — Terms / Decans / Degree Rulers Debug

Status: not started

Goal:

Add safe debug/status for detailed dignity lookup layers.

## Task 10.12 — Sprint 10 Hardening

Status: not started

Goal:

Finalize Sprint 10.

# Security Backlog

## Security follow-up — Review swisseph dev dependency audit findings

Status: not started

Description:

- `npm audit` shows dev-only vulnerabilities in the `swisseph` / `node-gyp` / `tar` / `cacache` chain.
- `npm audit --omit=dev` is clean.
- Do not run `npm audit fix --force` without separate analysis.
- Check impact on `scripts/generate-ephemeris.cjs`.

This is a future security follow-up and must not be handled as part of Task 6.5.

## Desktop/responsive layout rule documentation

Status: documented; future layout implementation not started

Description:

- `UI_RULES.md` contains the responsive / desktop layout rule.
- Keep large profile and natal sections scannable on wider screens.
- Do not implement layout changes without a separate active task.

# Do Not Do Now

- natal chart;
- personal transits;
- house calculations;
- Ascendant / MC;
- real provider dependency without approval;
- Moon in natal house;
- personal ritual scoring;
- geocoding API;
- cloud sync;
- backend;
- new public navigation;
- rewriting the whole dashboard.

---

# Calibration / Research Tasks

These tasks are important but are not the current implementation priority.

Do not start them until explicitly requested.

## Calibration 1 — Field Quality on Real Days

Status: paused

Previous next step:

```txt
Проверить формулировки и веса Качества поля на реальных рабочих днях.
```

Keep this task, but it is lower priority than the next explicitly approved sprint task.

### Subtasks

- Проверить на реальных днях, достаточно ли 4 часов для эха напряженного аспекта Луны.
- Уточнить правила интерпретации аспектов Луны для ритуалов, интуиции и материальных дел.
- Проверить формулировки списков `Подходит` / `Не подходит` на реальных рабочих днях.
- Подготовить тексты для будущих подсказок к оценкам:
  - `Интуиция`;
  - `Материальные дела`;
  - `Ритуалы`.

---

## Calibration 2 — Tong Shu Control Dates

Status: paused

### Goal

Add tests for several Tong Shu control dates, including disputed days around day-boundary and solar-month transitions.

### Required cases

- спорные дни на стыках суток;
- переход энергетического дня в 23:00 по Москве;
- стыки Jie Qi месяцев;
- дни, где разные школы могут давать разные 建除十二神.

### Acceptance criteria

- Control dates are documented.
- Tests include expected Tong Shu values.
- If disagreement exists between schools, the selected calculation line is explicitly documented.

---

## Calibration 3 — Ba Zi Grammar

Status: paused

### Goal

Check Russian case forms for Ba Zi names if they appear in future descriptive text.

### Acceptance criteria

- Ba Zi names remain readable in UI.
- No awkward Russian grammar in generated descriptions.
- If needed, add a small dictionary for inflected forms.

---

## QA 1 — iPhone PWA Check

Status: paused

### Goal

Check the main screen on iPhone after PWA cache update.

### Required checks

- installed app opens;
- updated cache is loaded;
- no stale UI after `CACHE_NAME` update;
- layout fits the iPhone screen;
- cards are readable;
- no broken scroll behavior.

---

## QA 2 — Browser Visual Check Before Release

Status: paused

### Goal

Add a manual or automated visual check step before releases.

### Possible approach

- local browser check;
- screenshot-based check;
- simple manual checklist;
- Playwright later if needed.

---

# Later / Not Current Sprint

These ideas are valid but should not be implemented now.

## Later 1 — City Selection

Add city selection instead of fixed Moscow.

This will affect:

- planetary hours;
- sunrise/sunset;
- lunar events;
- local ritual windows;
- current location;
- future profiles.

Do not implement before architecture and privacy implications are clear.

---

## Later 2 — Future Screens

Think through future screens:

- calendar;
- planets;
- knowledge base;
- settings;
- profiles;
- natal chart;
- debug.

Do not restore top menu or bottom navigation without a new app structure.

---

## Later 3 — Explain Indicators on Tap

Add explanations for indicators by tapping question marks or blocks.

Possible explanation areas:

- Moon phase;
- lunar day;
- VOC;
- Moon aspects;
- Tong Shu;
- Ba Zi;
- planetary hour;
- field quality.

---

## Later 4 — Date Viewer

Add ability to view past and future dates.

This will require:

- date picker;
- recalculation for selected date;
- clear distinction between `now` and selected date;
- possibly no live countdowns for non-current dates.

---

## Later 5 — Ephemeris After 2030

Add mechanism to update precomputed ephemeris data after 2030.

Possible approaches:

- regenerate data manually;
- script documentation;
- versioned ephemeris files;
- future backend or downloadable data package.

---

# Do Not Do Now

Do not return the top menu or bottom navigation without a new app structure.

Do not add new esoteric indicators without an agreed data source.

Do not overload the main dashboard while current data is still being stabilized.

Do not implement profiles before the main dashboard is stable.

Do not implement natal charts before profiles exist.

Do not implement personal transits before natal data model exists.

Do not store birth data before privacy rules and local-first storage are clear.

Do not add backend or cloud sync unless explicitly requested.

Do not use `MASTER_PLAN.md` as a direct implementation checklist.

---

# Codex Task Execution Template

Use this prompt when starting the active task:

```txt
Работаем по TODO.md.

Выполни только Task 1.2 — Add VOC Quality Label.

Перед кодом:
1. Найди, где сейчас формируется текст VOC.
2. Найди, откуда берется последний аспект перед VOC.
3. Кратко объясни минимальный план изменения.

Потом внеси минимальные безопасные изменения.

Ограничения:
- Не делай Task 1.3.
- Не трогай профили.
- Не трогай натальную карту.
- Не добавляй персональные транзиты.
- Не добавляй новые зависимости.
- Не меняй архитектуру без необходимости.
- Не удаляй существующую логику без объяснения.

После реализации:
1. запусти npm test;
2. обнови PROJECT_STATE.md;
3. обнови CHANGELOG.md;
4. отметь Task 1.2 как done в TODO.md;
5. оцени, изменилась ли архитектура;
6. если архитектура изменилась — обнови ARCHITECTURE.md;
7. если архитектура не изменилась — не трогай ARCHITECTURE.md и объясни почему;
8. дай список измененных файлов;
9. дай ручную проверку;
10. остановись.
```
