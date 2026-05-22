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

# Current Active Sprint

## Sprint 7 — Natal Planets UI / Read-only Natal Positions

Status: active

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

# Active Task

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

# Active Task

## Task 7.3 — Natal Planets Readiness UI

Status: next / not started

Goal: add an honest UI shell/readiness state if natal planets cannot be shown because UTC conversion or provider input readiness is not ready.

## Task 7.4 — Read-only Natal Planets Panel

Status: blocked until readiness confirmed

Goal: show actual natal planet positions if and only if provider input is ready and the provider returns validated planet positions.

## Task 7.5 — Natal Planets Debug

Status: not started

Goal: add safe debug info such as planet count, provider, validation status and user-facing enabled/disabled. Do not dump birth data.

## Task 7.6 — Sprint 7 Hardening

Status: not started

Goal: finalize Sprint 7 and confirm no fake natal values or unsupported features are shown.

# Security Backlog

## Security follow-up — Review swisseph dev dependency audit findings

Status: not started

Description:

- `npm audit` shows dev-only vulnerabilities in the `swisseph` / `node-gyp` / `tar` / `cacache` chain.
- `npm audit --omit=dev` is clean.
- Do not run `npm audit fix --force` without separate analysis.
- Check impact on `scripts/generate-ephemeris.cjs`.

This is a future security follow-up and must not be handled as part of Task 6.5.

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
