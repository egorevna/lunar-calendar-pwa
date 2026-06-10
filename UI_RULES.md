# Astro PWA — UI Rules

## Main Dashboard Principle

The main screen must be a practical dashboard, not a data dump.

The user should immediately understand:

1. What is happening now.
2. Whether they can act.
3. What this moment is good for.
4. What they should avoid.
5. When the best window is.

## Main Dashboard Structure

Recommended order:

1. Current date, time, lunar day, and Moon phase.
2. Moon sign and next sign transition.
3. VOC state.
4. Moon aspects.
5. Planetary day and planetary hour.
6. Indicators.
7. Field quality.
8. Warnings if any.
9. Best window today.
10. Personal block if active profile exists.

## Progressive Disclosure

Do not show all details immediately.

Use:

- Tap to expand.
- Collapsible cards.
- Mode-specific panels.
- Profile-specific blocks.
- Separate screens.
- Hidden debug screen.

## Time Formatting

Main dashboard:

- Use `HH:mm`.
- Do not show seconds.

Debug mode:

- Seconds are allowed.
- Raw technical timestamps are allowed.

## Terminology

Use:

- `Индикаторы`

Do not use:

- `Индикатор дня` when the block contains multiple systems.

Indicator rows:

- `Tong Shu: Стабильность`
- `Лунные сутки: Медведь`
- `Ба-цзы: Деревянный Петух`

## Moon Sign Copy

Use:

- `Луна в Рыбах`
- `Переход в Овен: завтра 03:03`

Do not use:

- `Луна в Рыбах в Овен завтра`

## VOC Copy

If VOC has not started:

- `Луна без курса начнется`
- `с 13:04 до 03:03`
- `через 2ч 50м`

If VOC is active:

- `Луна без курса`
- `до 03:03`
- `осталось 4ч 12м`

If no VOC today:

- `Луна в курсе`
- `Следующая VOC: дата, время`

Last aspect copy:

- `VOC после: □ Венера`

## Moon Aspects Copy

Use:

- `Последний аспект`
- `Следующий аспект`

Examples:

- `□ Уран — вчера 22:13`
- `□ Уран — сегодня 22:13`
- `✶ Меркурий — завтра 06:42`
- `через 20ч 28м`

## Field Quality Copy

Keep field quality short.

Examples:

- `Поле устойчивое: хорошо для закрепления результата.`
- `Поле тонкое: хорошо для интуиции, Таро и снов.`
- `Поле нервное: возможны резкие реакции и сбои планов.`
- `Поле плотное: хорошо для телесных практик, защиты и стабилизации.`
- `Поле очищающее: хорошо завершать, убирать и отсекать лишнее.`
- `Поле размытое: осторожно с обещаниями, договорами и ожиданиями.`
- `Поле денежное: хорошо для практик на ресурс, клиентов и устойчивый доход.`

Add:

- `Главный совет момента: ...`

## Warning Block

Title:

- `Осторожно сегодня`

Show only if warnings exist.

Do not show an empty warning block.

Keep warnings short and actionable.

## Mode Switcher

Modes:

- `Общее`
- `Таро`
- `Свечи`
- `Деньги`
- `Отношения`
- `Чистки`
- `Прогнозы`

Mode switcher should be visible but not dominate the screen.

The mode selector must be compact.

Allowed modes:

- `Общее`
- `Таро`
- `Свечи`
- `Деньги`
- `Отношения`
- `Чистки`
- `Прогнозы`

The selected mode should be visually obvious.

On mobile, prefer:

- horizontal scroll chips;
- compact segmented control;
- select-like control if chips become too crowded.

Do not add a new navigation bar.

Do not add a new public screen.

## Mode Recommendations

Mode recommendations should be short.

Prefer:

```txt
Хорошо:
диагностика, сны, внутренние расклады

Осторожно:
денежные прогнозы при Луне без курса
```

## Best Window Card

Best window card should be easy to scan.

Preferred format:

```txt
Лучшее окно для Таро

19:40–21:10
Подходит для: раскладов, записей, диагностики
Почему: Луна не без курса, час Меркурия.
```

Do not show more than 2 windows on the main screen.

## No Good Window

If no good window exists:

```txt
Сегодня лучше завершать и очищать, а не запускать новое.
```

Keep it calm and practical.

## Profile Switcher

Main screen profile selector:

- `Профиль: Анна / Егор / Наталья / Общий день`

If `Общий день` is selected:

- Show only general moment data.

If a profile is selected:

- Add personal blocks.

## Personal Block

Preferred title:

- `Лично для Анны`

Alternative:

- `Лично для меня`

Show no more than 3–5 items.

Each item should be:

- transit or placement,
- orb if relevant,
- short meaning.

## Natal Profile Section Naming

Possible names:

- `Профили`
- `Мои карты`
- `Моя карта`
- `Профиль натала`

Preferred interface name:

- `Моя карта`

## Empty States

Use clear empty states:

- `Добавьте профиль, чтобы увидеть личные транзиты.`
- `Укажите время рождения, чтобы рассчитать дома.`
- `Укажите место расчета, чтобы рассчитать планетарные часы.`
- `Недостаточно данных для точного расчета.`

## Error Display

Do not show raw technical errors on the main dashboard.

Use friendly fallback text and put technical details in debug mode.

## Visual Density Rule

If a block grows too large, collapse it.

Main dashboard should feel like a decision panel, not a spreadsheet.

## Profile / Natal Section Disclosure

All future large profile or natal sections inside `Мои карты` must be collapsible by default.

This rule applies to:

- Натальные планеты;
- Натальные аспекты;
- Достоинства планет;
- Термы / деканы / управители градусов;
- Дома / ASC / MC;
- Куспиды домов / Парс Фортуны / арабские точки;
- Фиксированные звезды;
- Лунные узлы / Лилит / Селена;
- Мидпоинты / антисы.

Default collapsed state:

- show the section title;
- show a short summary;
- show a `Показать` or `Развернуть` control.

Expanded state:

- show the full list;
- change the control to `Скрыть` or `Свернуть`.

Interaction rules:

- reset large profile/natal sections to collapsed state when the active profile changes;
- reset/hide profile-specific sections when `Общий день` is selected;
- do not expose raw technical data;
- do not let `Мои карты` become a long unscannable page;
- keep short and important readiness/fallback copy visible when values are not ready;
- show user-facing values only after validation and readiness checks pass.

## Responsive / Desktop Layout Rule

Desktop layout must be responsive-only and must not change calculation/data flow.

Mobile-first remains the source of truth. Desktop layout should be added later as a responsive polish layer after the main astrology modules are stable.

Allowed for future desktop / responsive work:

- change CSS layout;
- add wrapper classes;
- change visual groups;
- change spacing / max-width;
- use CSS grid / flex;
- add media queries;
- improve tablet / desktop layout;
- build wide-screen layout on top of the existing DOM/data flow.

Not allowed:

- change calculation modules;
- change provider modules;
- change profile storage;
- change active profile logic;
- change render data flow;
- change existing `data-*` hooks;
- change element ids used by `src/app.js`;
- create a separate desktop render path;
- show different data on desktop than on mobile;
- rewrite the app as a separate desktop version.

Mandatory rule:

```txt
The same DOM/data must power mobile and desktop.
Desktop must be a presentation layer, not a second app.
```

## Mobile PWA Rule

Assume the app is used on mobile.

Prioritize:

- short lines,
- readable cards,
- thumb-friendly controls,
- minimal scrolling,
- no dense tables on main dashboard.

Tables are acceptable on the natal chart screen and debug screen.

---

# Sprint 7 UI Rules Addendum

Sprint 7 may introduce a read-only natal planets layer only when values are actually calculated, validated and safe to display.

## Natal Planets Display

Natal planet values must be shown only if they are actually calculated and validated.

Do not show fake or placeholder planet values.

Allowed format:

```txt
Солнце — Телец 15°30′
Луна — Рак 03°12′
Меркурий R — ...
```

If data is not ready:

```txt
Натальные планеты пока недоступны.
```

## Required Limitation Copy

When showing a natal planet section, include:

```txt
Дома, ASC/MC и транзиты пока не рассчитываются.
```

## Do Not Show In Sprint 7

- chart wheel;
- houses;
- ASC;
- MC;
- transits;
- aspects to natal;
- orbs;
- personal ritual scoring;
- raw birth data.

---

# Sprint 8 UI Rules Addendum

Sprint 8 may add natal aspects only as a profile/natal section inside `Мои карты`.

## Natal Aspects UI

Natal aspects must be collapsible by default.

Collapsed state should show:

```txt
Натальные аспекты
8 аспектов найдено
[Показать]
```

Expanded state may show compact rows:

```txt
Солнце □ Луна · орб 2°15′
Венера △ Марс · орб 1°04′
```

## Natal Aspect Section Rules

- collapsed by default;
- summary first;
- full list only after explicit click;
- reset collapsed state when the active profile changes;
- no long interpretations in Sprint 8;
- no transit aspects;
- no houses / ASC / MC;
- no raw birth data;
- no raw longitude values;
- no chart wheel.

## Empty State

If no natal aspects are found:

```txt
Натальные аспекты
Мажорные аспекты в заданном орбе не найдены.
```

## Not Ready State

If natal planets are not ready:

```txt
Натальные аспекты пока недоступны.
Сначала нужен расчет натальных планет.
```

---

# Sprint 9 UI Rules Addendum

Sprint 9 may add essential dignities only as a profile/natal section inside `Мои карты`.

## Essential Dignities UI

Essential dignities must be collapsible by default.

Collapsed state should show:

```txt
Достоинства планет
Сильные: Марс, Венера · слабые: Сатурн
[Показать]
```

Expanded state may show compact rows:

```txt
Марс в Овне — обитель
Венера в Рыбах — экзальтация
Сатурн в Раке — изгнание
```

## Essential Dignity Section Rules

- collapsed by default;
- summary first;
- full list only after explicit click;
- reset collapsed state when the active profile changes;
- no long interpretations in Sprint 9;
- no terms / decans / degree rulers yet;
- no fixed stars, houses, ASC / MC or transits;
- no raw birth data;
- no raw longitude values;
- no chart wheel.

## Empty State

If no dignity / debility flags are found:

```txt
Достоинства планет
Ярко выраженных базовых достоинств или слабостей не найдено.
```

## Not Ready State

If natal planets are not ready:

```txt
Достоинства планет пока недоступны.
Сначала нужен расчет натальных планет.
```

---

# Sprint 10 UI Rules Addendum

Sprint 10 detailed dignity layers may be shown only as profile/natal sections inside `Мои карты`, after source policy, dataset verification and readiness checks.

## Detailed Dignities UI

Terms, decans and degree rulers must stay collapsible by default.

Possible collapsed state:

```txt
Термы и деканы
Доступны термы · деканы пока не добавлены
[Показать]
```

Expanded state may show compact lookup rows:

```txt
Марс в терме Венеры
Венера в декане Луны
```

## Detailed Dignity Section Rules

- collapsed by default;
- summary first;
- full list only after explicit click;
- reset collapsed state when the active profile changes;
- source system must be named;
- show only verified dataset rows;
- do not show OCR-only data;
- do not show long interpretations;
- do not show raw birth data;
- do not show raw longitude values;
- do not show fixed stars, houses, ASC / MC or transits as part of this section.

## Not Ready State

If natal planets are not ready:

```txt
Термы и деканы пока недоступны.
Сначала нужен расчет натальных планет.
```

## Deferred State

If a layer is not verified:

```txt
Деканы будут добавлены после проверки таблицы источника.
```

---

# Sprint 11 UI Rules Addendum

## Manual Birth Place Coordinates

Profile edit/create forms may show manual coordinate fields for Houses / ASC / MC readiness:

- `Широта места рождения`
- `Долгота места рождения`

Helper copy:

```txt
Для обычного режима достаточно координат города. Координаты роддома не обязательны.
```

The app must not auto-fill coordinates from city, country, timezone, current location or hardcoded city mappings. Coordinates are allowed in the edit form only; calculated Houses / ASC / MC output must continue to show formatted angles, houses and safe fallback messages rather than raw coordinates.

## Houses / ASC / MC Block

The `Дома и углы карты` block belongs inside `Мои карты` after `Термы, деканы и градусы`.

Rules:

- collapsed by default;
- header shows only the title and `Показать` / `Скрыть` action;
- ready state shows selected house system, ASC / MC / DSC / IC, houses and planet-to-house rows;
- in Placidus ready state, displayed ASC / MC / DSC / IC must match cusps 1 / 10 / 7 / 4;
- fallback state shows `Пока недоступно.` once, then one safe reason message and non-duplicated limitations;
- no interpretations, ritual advice, fatalistic copy, fixed stars, transits, Pars Fortuna or Arabic Parts;
- calculated output must not show raw birth date, birth time, UTC, timezone value, raw coordinates, raw profile JSON, raw planet longitude or raw cusp longitude.

`?debug=1` may include `Houses / ASC / MC UI Debug`, but only as safe status/counts/capabilities/privacy flags. It must not change normal UI behavior.

## Special Points Block

The `Особые точки карты` block belongs inside `Мои карты` after `Жребии и арабские части`.

Rules:

- collapsed by default;
- ready state shows Lunar Nodes, Mean Lilith and Selena / White Moon;
- Lunar Nodes may show house labels as `· N дом` when house assignment is ready;
- normal UI shows calculated point rows first, then one shared notes / limitations list at the bottom;
- do not render technical module limitations under each section;
- Selena may have one safe note that it is a fictitious / hypothetical calculated point;
- no interpretations, karmic/fatalistic copy, guardian-angel language, ritual advice, Fixed Stars, transits or ritual scoring;
- calculated output must not show raw birth date, birth time, UTC, timezone value, raw coordinates, raw profile JSON or raw point longitudes.

`?debug=1` may include `Special Points UI Debug`, but only as safe status/readiness/source/count/capability/privacy flags. It must not change normal UI behavior.

## Fixed Stars Block

The `Неподвижные звезды` block belongs inside `Мои карты` after `Особые точки карты`.

Rules:

- collapsed by default;
- show only conjunction facts between active Fixed Stars and active targets;
- ready state may show rows such as `Регул — соединение с ASC · орб 0°06′00″`;
- noHits state shows a safe no-hit message;
- partial state may show available hits and the note `Рассчитано по доступным целям карты.`;
- source/orb notes render once at the bottom of the block;
- do not repeat source/orb notes under each row;
- no interpretations, mythology, karmic/fatalistic copy, predictions, ritual advice, transits or debug payloads;
- calculated output must not show raw birth date, birth time, UTC, timezone value, raw coordinates, raw longitudes, raw catalog/target/position arrays, full profile JSON or provider payloads.

`?debug=1` may include `Fixed Stars Debug`, but only as safe catalog/policy/pipeline statuses, counts and guardrails. It must not appear in normal UI, must not change normal `Неподвижные звезды` behavior, and must not expose raw birth data, coordinates, UTC, provider payloads, full catalog/target/position/conjunction arrays or interpretations.

## Zodiac Position Formatting

User-facing astrology positions such as ASC, MC and house cusps display sign, degree, minute and second:

- normal astrology UI shows seconds;
- normal astrology UI does not round zodiac positions to the nearest minute;
- sign and degree must not roll over just because a position is at 29°59′30″.

Stored and calculated numeric longitudes remain full precision and are not changed by display formatting.
