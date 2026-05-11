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
