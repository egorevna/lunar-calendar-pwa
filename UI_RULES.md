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
