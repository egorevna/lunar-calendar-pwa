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

# Current Active Sprint

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

# Active Task

Do not start this task until the user explicitly asks for it.

## Task 1.5 — Improve Field Quality Block

Status: not started

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

Status: not started

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

Status: not started

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

Status: not started

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

## Task 1.9 — Clean Up Terminology and Visual Clarity

Status: not started

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

Status: not started

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

# Calibration / Research Tasks

These tasks are important but are not the current implementation priority.

Do not start them until explicitly requested.

## Calibration 1 — Field Quality on Real Days

Status: paused

Previous next step:

```txt
Проверить формулировки и веса Качества поля на реальных рабочих днях.
```

Keep this task, but it is lower priority than Sprint 1 UI cleanup.

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
