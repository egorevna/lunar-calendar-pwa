# PROJECT_STATE.md

## Дата чекпоинта

2026-05-26

---

# Source of Truth

`PROJECT_STATE.md` — главный источник текущего состояния проекта.

Иерархия документов:

1. `PROJECT_STATE.md` — текущее состояние проекта, активный спринт, текущий фокус, следующая задача.
2. `ARCHITECTURE.md` — фактическая текущая архитектура кода и поток данных.
3. `TODO.md` — активный рабочий список задач.
4. `ASTRO_LOGIC.md` — правила астрологических расчетов, интерпретаций и приоритетов.
5. `UI_RULES.md` — правила интерфейса, формулировок, отображения и форматирования.
6. `PRIVACY_RULES.md` — правила хранения персональных данных, профилей и приватности.
7. `MASTER_PLAN.md` — большой продуктовый роадмап и будущие фазы.
8. `CHANGELOG.md` — история уже выполненных изменений.

Важно:

- `MASTER_PLAN.md` не является командой реализовать все сразу.
- Codex должен работать только по активной задаче из `TODO.md`.
- Если `MASTER_PLAN.md` конфликтует с `TODO.md`, приоритет у `TODO.md`.
- Если `ARCHITECTURE.md` конфликтует с фактическим кодом, нужно проверить код и обновить `ARCHITECTURE.md`.
- Если задача меняет архитектуру, нужно обновить `ARCHITECTURE.md`.
- Если архитектура не меняется, `ARCHITECTURE.md` не трогать и явно написать это в отчете.

---

# Current Project

Astro PWA — статическое PWA-приложение астрологического / лунного / ритуального календаря.

Текущий основной сценарий:

- главный экран момента;
- расчет для Москвы;
- лунные данные;
- Луна без курса;
- аспекты Луны;
- лунные сутки;
- Ба-цзы;
- Tong Shu;
- планетарный день;
- планетарный час;
- качество поля.

Главная продуктовая идея:

Приложение должно отвечать не только на вопрос:

> «Какой сегодня день?»

А на вопрос:

> «Что этот момент значит для действия?»

В будущих фазах приложение должно отвечать и на более личный вопрос:

> «Что этот день значит лично для выбранного человека?»

---

# Что изменилось

Приложение стало чистым главным экраном без верхнего меню, декоративной центральной Луны и нижней навигации.

Данные для Москвы переведены на предрасчитанные Swiss Ephemeris события на 2026–2030 годы.

Добавлены точные лунные дни, переходы Луны по знакам, Луна без курса, солнечные месяцы для китайских расчетов.

Добавлены показатели дня:

- лунные сутки эзотерической традиции;
- Ба-цзы день;
- индикатор дня Tong Shu.

Линия Tong Shu уточнена по документу `Фиксы.docx`:

- Москва;
- Jie Qi месяцы;
- смена энергетического дня в 23:00.

Добавлены точные мажорные аспекты Луны к планетам на 2026–2030 годы.

Добавлен слой `Качество поля`:

- фраза момента;
- три практические оценки;
- причины;
- списки `Подходит` / `Не подходит`.
- компактные предупреждения `Осторожно сегодня`, если есть реальные красные флаги.

Прошлый напряженный аспект Луны больше не окрашивает весь день: его сильное влияние ограничено 4 часами.

В дни точного новолуния или полнолуния строка фазы показывает событие и московское время без секунд.

PWA-кэш обновлен до:

```txt
lunar-calendar-v42
```

Добавлен обновленный архитектурный принцип:

- документация стала рабочей системой управления проектом;
- `ARCHITECTURE.md` теперь живой документ;
- текущие задачи должны идти через `TODO.md`;
- будущие фичи из роадмапа нельзя реализовывать напрямую без переноса в `TODO.md`.

---

# Что сейчас работает

Главный экран показывает:

- дату;
- день недели;
- текущее время;
- лунный день;
- фазу Луны;
- лунную точность: освещенность и время до ближайшего Новолуния / Полнолуния.

В день новолуния или полнолуния вместо обычной фазы показывается:

- `Новолуние в HH:mm`;
- `Полнолуние в HH:mm`.

Показывается знак Луны и следующий переход Луны в знак в понятной форме:

```txt
Луна в Овне
Переход в Телец: завтра 05:31
```

Показывается статус Луны без курса с точным временем окончания или ближайшего интервала.

Показывается аспект, после которого Луна ушла без курса, а также последний и следующий аспект Луны.

Показывается `Качество поля`:

- краткая фраза;
- `Интуиция`;
- `Материальные дела`;
- `Ритуалы`;
- `Главный совет момента`;
- причины;
- практические списки `Подходит` / `Не подходит`.

Если есть красные флаги, показывается компактный блок `Осторожно сегодня` с 1–3 предупреждениями.

Для ручной dev-проверки главного экрана можно открыть приложение с query-параметром:

```txt
?debugDate=2026-05-15T00:40:00
```

Без `debugDate` приложение работает от текущего времени.

Для скрытой технической проверки расчетов можно открыть:

```txt
?debug=1
?debug=1&debugDate=2026-05-15T00:40:00
```

Debug-панель показывается только при `debug=1` и находится внизу страницы.

Показываются:

- лунные сутки по эзотерической линии;
- Ба-цзы день;
- индикатор дня Tong Shu.

Блок этих систем называется `Индикаторы`, потому что содержит несколько независимых линий.

Показываются:

- планетарный день;
- текущий планетарный час.
- короткая практическая подсказка для текущего планетарного часа.

PWA устанавливается на экран iPhone через Safari.

Тестовый набор проходит:

```txt
281 тест
```

---

# Checkpoint Summary

Дата checkpoint: 2026-05-11

Что уже сделано в текущем этапе:

- Task 1.1 завершена: блок `Луна без курса` упрощен до ближайшего или текущего VOC-периода.
- Task 1.2 завершена: после строки аспекта добавлена человеческая оценка фона `фон ...`.
- Добавлено тестовое покрытие, что после завершения текущей VOC выбирается следующая будущая VOC, а не завершившийся интервал.
- Task 1.3 завершена: блок `Аспекты Луны` получил понятные подписи, относительные даты и компактные строки без countdown.
- Task 1.4 завершена: для следующего аспекта Луны добавлена короткая практическая интерпретация по раскрытию.
- Task 1.5 завершена: блок `Качество поля` получил более точные фразы и строку `Главный совет момента`.
- Task 1.6 завершена: добавлен компактный блок `Осторожно сегодня`.
- Task 1.7 завершена: в основной блок Луны добавлены освещенность и время до ближайшего Новолуния / Полнолуния; возраст Луны не выводится, чтобы не дублировать лунный день.
- Task 1.8 завершена: под планетарным часом добавлена короткая практическая подсказка.
- Task 1.9 завершена: строка перехода Луны в следующий знак очищена от секунд и кривой формулировки; блок `Индикатор дня` переименован в `Индикаторы`.
- Task 1.10 завершена: добавлена скрытая debug-панель по `?debug=1`; Sprint 1 завершен.

Ключевые файлы, которые были добавлены или изменены в текущем этапе:

- `src/vocDisplay.js` — форматирование VOC-блока и строки фона.
- `src/app.js` — рендер строки аспекта и строки фона отдельными строками.
- `src/styles.css` — приглушенный стиль для строки `фон ...`.
- `index.html` — заголовок карточки снова `Луна без курса`.
- `test/vocDisplay.test.js` — тесты отображения VOC и фона.
- `test/markup.test.js` — тест заголовка VOC-карточки.
- `test/preciseEphemeris.test.js` — тест выбора следующей VOC после завершения текущей.
- `src/moonAspectsDisplay.js` — форматирование последнего и следующего аспекта Луны.
- `test/moonAspectsDisplay.test.js` — тесты отображения аспектов Луны.
- `index.html`, `src/app.js`, `src/styles.css` — компактное раскрытие интерпретации в блоке `Аспекты Луны`.
- `src/fieldQuality.js` — фразы качества поля, главный совет момента и сохраненные оценки/списки.
- `src/app.js`, `index.html`, `src/styles.css` — вывод скрываемого блока предупреждений.
- `test/fieldQuality.test.js` — тесты советов, нескольких типов поля и warning-логики.
- `test/markup.test.js` — тест каркаса warning-блока.
- `src/moonPrecisionDisplay.js` — форматирование строк лунной точности.
- `test/moonPrecisionDisplay.test.js` — тесты освещенности, возраста и времени до ближайшей major phase.
- `src/preciseEphemeris.js` — поиск ближайшего будущего Новолуния / Полнолуния.
- `src/planetaryHourHints.js` — словарь и форматирование подсказок планетарного часа.
- `test/planetaryHourHints.test.js` — тесты подсказок всех планетарных часов и неизвестного значения.
- `src/moonSignDisplay.js` — форматирование строки перехода Луны в следующий знак.
- `test/moonSignDisplay.test.js` — тесты строки перехода Луны без секунд и с `сегодня` / `завтра` / датой.
- `src/debugPanel.js` — форматирование скрытой debug-панели и проверка `?debug=1`.
- `test/debugPanel.test.js` — тесты режима debug, `debugDate` и ключевых секций debug-панели.
- `src/dashboardModes.js` — список режимов главного экрана, default mode и проверка ключей.
- `test/dashboardModes.test.js` — тесты списка режимов, default mode и валидности ключей.
- `src/modeScores.js` — mode-specific scores для выбранного режима.
- `test/modeScores.test.js` — тесты режимных оценок, fallback и диапазона 1–10.
- `src/modeRecommendations.js` — mode-specific списки `Хорошо` / `Осторожно`.
- `test/modeRecommendations.test.js` — тесты режимных рекомендаций, лимита 3/3 и fallback.
- `src/bestWindows.js` — helper расчета 1–2 лучших окон дня для выбранного режима.
- `test/bestWindows.test.js` — тесты scoring helper, VOC exclusion, reasons и fallback.
- `TODO.md`, `PROJECT_STATE.md`, `CHANGELOG.md` — актуализация состояния задач.

Что сейчас работает в VOC-блоке:

```txt
Луна без курса

с HH:mm до HH:mm
после: □ Венера
фон напряженный
```

Если VOC уже идет:

```txt
до HH:mm
после: □ Венера
фон напряженный
```

Если данных нет:

```txt
нет данных
```

Оставшиеся риски:

- Нужно визуально проверить VOC-блок на iPhone после публикации, особенно переносы строк и приглушенный цвет `фон ...`.
- PWA на iPhone может показать старую версию из cache, если не обновить service worker cache перед релизом.
- Для Tong Shu все еще нужны дополнительные контрольные даты по выбранной линии расчета.
- Документы `ASTRO_LOGIC.md` и `UI_RULES.md` могут содержать старые wording-примеры VOC; перед следующими задачами нужно сверять их с `PROJECT_STATE.md` и `TODO.md`.

Следующая задача:

```txt
Task 3.5 — Edit / Delete Profile
```

Натальная карта, персональные транзиты, дома, ASC/MC и личные рекомендации пока не делаются.

---

# Что не работает или требует уточнения

Город жестко задан как Москва.

Нет пользовательских настроек, выбора города, языка или школы расчета.

Нет экранов календаря, планет, знаний и настроек; они сознательно убраны до проектирования.

Индикатор дня Tong Shu сейчас считается по ветви энергетического дня, ветви Jie Qi месяца и смене дня в 23:00 по Москве.

Нет автоматической проверки визуального состояния в браузере после каждого изменения.

Есть доменная модель профиля, validation helpers и localStorage helper.

Профили можно сохранять в localStorage через `src/profileStorage.js`.

На главном экране есть компактный блок `Профиль` и раскрываемая секция `Мои карты`.

В секции `Мои карты` есть inline-форма создания профиля.

Есть выбор активного профиля и возврат к `Общий день`.

Есть импорт / экспорт профилей через локальный JSON.

Есть компактный блок `Лично для меня`, который показывает только readiness / context и честные ограничения.

Нет натальной карты.

Нет персональных транзитов.

Нет расчета текущей Луны в доме натала.

Нет персональной оценки ритуалов.

Есть safe personal recommendations MVP без натальных расчетов.

---

# Текущий главный блокер

Нужно накопить контрольные даты для Tong Shu 建除十二神 по выбранной линии расчета.

Без набора эталонных дат спорные дни между школами могут снова расходиться.

---

# Completed Sprint

## Sprint 1 — Main Dashboard Cleanup

Цель спринта:

Стабилизировать и улучшить главный экран до добавления профилей, натальной карты и персональных транзитов.

Главный экран должен стать практическим дашбордом момента:

1. Что сейчас за момент?
2. Можно ли действовать?
3. Для чего момент подходит?
4. Чего лучше избегать?
5. Когда лучшее окно?

В Sprint 1 входят:

- доработка блока `Луна без курса`;
- доработка блока `Аспекты Луны`;
- улучшение `Качества поля`;
- добавление компактных предупреждений;
- добавление лунной точности;
- подсказки по планетарным часам;
- исправление терминологии и визуальной ясности;
- debug screen для проверки расчетов.

---

# Completed Sprint

## Sprint 2 — Modes and Best Windows

Статус:

```txt
completed
```

Цель спринта:

Добавить mode-aware рекомендации и лучшие окна на главный экран.

Приложение должно отвечать:

> «Для моей текущей задачи сейчас хороший момент?»

Активные режимы:

- Общее;
- Таро;
- Свечи;
- Деньги;
- Отношения;
- Чистки;
- Прогнозы.

В Sprint 2 входят:

- переключатель режимов главного экрана;
- mode-specific scores;
- mode-specific recommendations;
- mode-specific caution text;
- best windows for the current day;
- fallback, если хороших окон нет;
- debug / reasoning output for window scoring, если это минимально.

В Sprint 2 не входят:

- профили;
- натальная карта;
- персональные транзиты;
- активный профиль;
- импорт / экспорт;
- cloud sync;
- backend;
- новая публичная навигация;
- calendar / date picker screen.

# Completed Task

## Task 2.1 — Add Dashboard Mode Selector

Статус:

```txt
done
```

Цель:

Добавить компактный переключатель режимов:

- Общее;
- Таро;
- Свечи;
- Деньги;
- Отношения;
- Чистки;
- Прогнозы.

Acceptance criteria:

- mode selector виден на главном экране;
- default mode — `Общее`;
- пользователь может переключить каждый режим;
- активный режим визуально отмечен;
- существующие блоки главного экрана продолжают работать;
- тесты проходят;
- Task 2.2 не начата.

Что выполнено:

- добавлен compact mode selector после `Луна без курса` и `Осторожно сегодня`, перед `Аспекты Луны`;
- default mode — `Общее`;
- режимы переключаются по chips;
- активный режим выделяется через `aria-pressed="true"` и визуальный стиль;
- выбранный режим хранится в in-memory state в `src/app.js`;
- persistence / `localStorage` не добавлялись.

---

## Task 2.2 — Add Mode-Specific Scores

Статус:

```txt
done
```

Что выполнено:

- добавлен helper `src/modeScores.js`;
- режим `Общее` сохраняет базовые оценки `Интуиция`, `Материальные дела`, `Ритуалы`;
- режимы `Таро`, `Свечи`, `Деньги`, `Отношения`, `Чистки`, `Прогнозы` показывают свои наборы оценок;
- оценки считаются простой эвристикой из уже доступных данных момента: `fieldQuality`, VOC, аспектов Луны, предупреждений, планетарного часа, знака Луны, лунного дня и Tong Shu;
- значения ограничены диапазоном 1–10;
- неизвестный режим безопасно падает в `Общее`;
- `localStorage`, best windows, профили, натал и персональные транзиты не добавлялись;
- PWA-кэш обновлен до `lunar-calendar-v35`.

---

## Task 2.3 — Add Mode-Specific Good / Careful Recommendations

Статус:

```txt
done
```

Что выполнено:

- добавлен helper `src/modeRecommendations.js`;
- блок рекомендаций в `Качество поля` переименован из `Подходит` / `Не подходит` в `Хорошо` / `Осторожно`;
- режим `Общее` использует текущие списки `fieldQuality.supports` / `fieldQuality.avoid`;
- режимы `Таро`, `Свечи`, `Деньги`, `Отношения`, `Чистки`, `Прогнозы` показывают свои короткие рекомендации;
- рекомендации учитывают доступные факторы момента: VOC, warnings, fieldQuality, аспекты Луны, планетарный час, знак Луны и лунный день;
- каждый список ограничен максимум 3 пунктами;
- `localStorage`, best windows, профили, натал и персональные транзиты не добавлялись;
- PWA-кэш обновлен до `lunar-calendar-v36`.

---

## Task 2.4 — Add Best Window Scoring Helper

Статус:

```txt
done
```

Что выполнено:

- добавлен helper `src/bestWindows.js`;
- helper сканирует текущий московский день слотами, исключает active VOC и скорит оставшиеся слоты;
- учитываются выбранный режим, планетарный час, знак / элемент Луны, fieldQuality, warnings и ближайший напряженный аспект Луны;
- соседние хорошие слоты группируются в интервалы;
- возвращается максимум 2 окна с `start`, `end`, `score`, `label`, `suitableFor`, `reasons`, `cautions`;
- если хороших окон нет, helper возвращает пустой массив;
- UI-карточка лучших окон не добавлялась;
- PWA-кэш обновлен до `lunar-calendar-v37`.

---

## Task 2.5 — Display Best Window Today

Статус:

```txt
done
```

Что выполнено:

- helper `getBestWindows()` подключен к рендеру главного экрана;
- добавлена карточка `Лучшее окно сегодня` / `Лучшее окно для [режим]`;
- карточка расположена после блока `Качество поля` и перед debug-панелью;
- отображается максимум 2 окна в формате `HH:mm–HH:mm`, без секунд;
- строки `Подходит для`, `Почему` и `Осторожно` скрываются, если данных нет;
- если хороших окон нет, карточка показывает спокойный fallback;
- PWA-кэш обновлен до `lunar-calendar-v41`.

---

## Task 2.6 — Add No-Good-Window Fallback

Статус:

```txt
done
```

Что выполнено:

- если `getBestWindows()` не находит подходящих окон, карточка `Лучшее окно` больше не скрывается;
- показывается спокойный mode-specific fallback;
- для режима `Общее` используется `Сегодня лучше завершать и очищать, а не запускать новое.`;
- fallback не содержит технических слов, `undefined`, `null` или `NaN`;
- scoring logic `getBestWindows()` не менялась.

---

## Task 2.7 — Add Debug Reasoning for Best Windows

Статус:

```txt
done
```

Что выполнено:

- добавлен debug API `getBestWindowsDebug()`;
- обычный `getBestWindows()` остался обратно совместимым и возвращает массив;
- debug-панель при `?debug=1` показывает `Best Windows Debug`;
- debug показывает selected mode, threshold, slotMinutes, maxWindows, выбранные окна, fallback и top rejected / low-score candidates;
- обычный главный экран без `?debug=1` визуально не менялся;
- PWA-кэш обновлен до `lunar-calendar-v42`.

---

# Current Focus

Текущий фокус:

Завершенные спринты:

```txt
Sprint 1 — Main Dashboard Cleanup
Sprint 2 — Modes and Best Windows
Sprint 3 — Profiles / Мои карты
Sprint 4 — Personal Moment Foundation / Лично для меня
Sprint 5 — Natal Calculation Engine Foundation
Sprint 6 — Real Natal Provider Selection / Fixture Validation
```

Текущий статус спринтов:

```txt
Sprint 13 — Special Points Foundation active
```

Sprint 1, Sprint 2, Sprint 3, Sprint 4, Sprint 5, Sprint 6, Sprint 7, Sprint 8, Sprint 9 и Sprint 10 завершены.

Текущий фокус:

```txt
Task 13.6 — Mean Lilith Engine / Fixtures
```

Sprint 10 закрыт. Sprint 11 — Houses / ASC / MC закрыт. Task 11.1 добавила `SPRINT_11_PLAN.md` и `HOUSES_ASC_MC_STRATEGY.md`; они фиксируют расчетную стратегию, guardrails и порядок задач Sprint 11. Task 11.2 добавила pure `src/housesInputGuardrails.js` readiness / guardrails layer and `test/housesInputGuardrails.test.js`. Task 11.3 добавила pure `src/ascMc.js` ASC / MC calculation engine and `test/ascMc.test.js`. Task 11.4a обновила house systems strategy / dependency audit как docs-only. Task 11.4b добавила pure `src/wholeSignHouses.js` Whole Sign houses engine and `test/wholeSignHouses.test.js`. Task 11.4c добавила pure `src/equalHouseHouses.js` Equal House / Равнодомная houses engine and `test/equalHouseHouses.test.js`. Task 11.4d добавила pure `src/placidusHouses.js` Placidus integration gate and `test/placidusHouses.test.js`. Task 11.4d2 activated browser-safe Placidus calculation in `src/placidusHouses.js` using static benchmark fixtures from local `swisseph.swe_houses`. Task 11.4e добавила pure `src/houseSystemResolver.js` selected-system router and `test/houseSystemResolver.test.js`. Task 11.5 добавила cross-system validation fixtures and tests for Whole Sign, Equal House and Placidus. Task 11.6 добавила pure planet-in-house assignment layer for selected house systems. Task 11.7 добавила pure Houses / ASC / MC display helper for ready house, angle and planet-in-house results. Task 11.8 добавила collapsible `Дома и углы карты` UI block inside `Мои карты`: block is collapsed by default, appears after `Термы, деканы и градусы`, shows selected house system, angles, houses and planet assignments when ready, and safe fallback/unsupported messages when not ready. Post-11.8 UI/copy fix removed duplicate fallback message rendering and keeps the header to title plus `Показать` / `Скрыть`. Task 11.8b добавила ручной ввод широты/долготы места рождения в профиль, хранение в `birthPlace.coordinates`, paired/range validation, city-level helper copy and no geocoding / no external lookup. Task 11.8c verified the Moscow 1981 Placidus ready-state case after manual coordinates and added regression tests against duplicated Placidus cusps / UI rows; follow-up runtime-path hardening checks UTC conversion, ASC / MC, raw Placidus cusps, `housesForProfile` rows and `profileUi` rows together, fixes mixed-shape profile coordinate priority, fixes a Placidus endpoint-root cusp collapse edge case, enforces single-source display consistency for Placidus angles/houses, avoids a second independent house calculation for planet assignments in `housesForProfile`, and bumps PWA cache to `lunar-calendar-v83`. Task 11.9 добавила safe `Houses / ASC / MC UI Debug` section for `?debug=1`: debug exposes only active profile id/name, readiness booleans, selected system, counts, capabilities and privacy flags, without raw birth data, coordinates, UTC, timezone value or full houses/cusps/assignments arrays. Task 11.10 completed final hardening: guardrails, house-system separation, Placidus validation, coordinate/profile shape, architecture boundaries, privacy, UI/debug and PWA cache were rechecked; no code fixes were needed. Task 11.10-fix updated visible zodiac position formatting to nearest-minute rounding, then Task 11.10-fix-2 corrected the policy: user-facing ASC / MC and house cusp text now shows degree-minute-second precision without nearest-minute rounding while numeric longitudes remain precise. Task 11.10-fix-3 aligned Placidus precision with the local Swiss benchmark: Placidus now uses true obliquity for cusp anchors and derives displayed ASC / MC / DSC / IC from cusps 1 / 10 / 7 / 4. No interpretations were added. Sprint 12 — House Cusps + Pars Fortuna + Basic Arabic Parts закрыт. Task 12.1 добавила strategy docs: `SPRINT_12_PLAN.md`, `HOUSE_CUSPS_PARS_FORTUNA_STRATEGY.md` и `PARS_FORTUNA_ARABIC_PARTS_FORMULA_POLICY.md`. Task 12.2 добавила canonical house cusp layer `src/houseCusps.js` and static/manual fixtures for Whole Sign, Equal House and Placidus. Task 12.3 добавила day/night chart status engine `src/dayNightChart.js` using geometric Sun altitude and explicit boundary handling. Task 12.4 добавила pure Pars Fortuna engine `src/parsFortuna.js` with verified day/night formulas and static/manual fixtures. Task 12.5 добавила data-only Arabic Parts formula dataset/source decision layer `src/arabicPartsData.js`; Task 12.5b verified Lot of Spirit as an active formula row with day `ASC + Sun - Moon` and night `ASC + Moon - Sun`; Task 12.6 добавила pure Basic Arabic Parts engine `src/arabicParts.js` for active verified formulas only. The engine calculates Pars Fortuna and Lot of Spirit from numeric ASC, Sun and Moon longitudes plus explicit day/night chart status; deferred Arabic Parts stay inactive and do not produce ready values. Task 12.7 добавила pure Lots / Arabic Parts house assignment layer `src/arabicPartsHouseAssignment.js`: active lots are assigned to selected-system canonical cusps using numeric longitudes, half-open spans and exact-cusp boundary policy. Task 12.8 добавила pure Lots / Arabic Parts display helper `src/arabicPartsDisplay.js`: it formats already calculated Pars Fortuna / Lot of Spirit results, optional house assignment labels, day/night labels and safe fallback states. Task 12.9 добавила collapsible user-facing UI block `Жребии и арабские части` inside `Мои карты` after `Дома и углы карты`; block is collapsed by default, shows day/night chart label, Pars Fortuna, Lot of Spirit and house labels when ready, and safe fallback when not ready. Task 12.10 добавила safe `Arabic Parts UI Debug` section for `?debug=1`: debug exposes only active profile id/name, readiness booleans, chart sect status/label, active/deferred formula keys, counts, capabilities and privacy flags, without raw birth data, coordinates, UTC, raw longitudes, formula operand arrays, provider payloads or full result arrays. Task 12.11 completed final hardening: canonical cusps, day/night status, Pars Fortuna, Lot of Spirit, deferred Arabic Parts, assignment, UI/debug, privacy and architecture boundaries were rechecked; no code fixes were needed. PWA cache is `lunar-calendar-v90`. Sprint 13 — Special Points Foundation начат. Task 13.1 добавила strategy docs: `SPRINT_13_PLAN.md`, `SPECIAL_POINTS_STRATEGY.md` и `SPECIAL_POINTS_SOURCE_POLICY.md`. Task 13.2 добавила `LUNAR_NODES_SOURCE_POLICY.md`: активная система узлов — `mean-lunar-node` / `lunar-nodes-mean`, true node deferred, Южный узел выводится как `normalize(Северный узел + 180°)`, validation plan uses static local Swiss Ephemeris `SE_MEAN_NODE` benchmark fixtures. Task 13.3 добавила pure `src/lunarNodes.js` mean Lunar Nodes engine and static fixtures/tests; Северный узел рассчитывается по active mean node policy, Южный узел выводится только как Северный узел + 180°, координаты рождения не требуются, true node / Lilith / Selena / interpretations remain deferred or forbidden. Task 13.4 добавила pure `src/lunarNodesHouseAssignment.js` assignment layer: Северный / Южный узлы назначаются в Whole Sign, Equal House и Placidus дома через canonical cusps, numeric longitude, half-open spans and exact-cusp boundary policy; Lunar Nodes calculation, house engines, UI/display/debug and provider calculations were not changed. Task 13.5 добавила `LILITH_SOURCE_DECISION.md`: Lilith status is `source-verified-for-implementation`; Mean Black Moon Lilith / Mean Lunar Apogee is the active target for Task 13.6; local Swiss Ephemeris `SE_MEAN_APOG` / `swe_calc_ut` is the static benchmark oracle only; True / Osculating and interpolated Lilith remain deferred. Следующая активная задача: Task 13.6 — Mean Lilith Engine / Fixtures.

Guardrails Sprint 11:

- exact birth time + birth place coordinates are required for user-facing ASC / MC / houses;
- no birth time = no ASC / MC / houses;
- no coordinates = no ASC / MC / houses;
- country / region only = not enough;
- city without coordinates = needs city lookup or manual coordinates before calculation;
- city-level coordinates are acceptable for normal mode;
- hospital-level coordinates are optional.

Initial house system policy:

- Sprint 11 target house systems are `whole-sign`, `equal-house` and `placidus`;
- house systems must remain separate and every result must include `houseSystem`;
- existing profile-level `houseSystem` selection is the source of truth for future house calculations;
- current stored profile values are `wholeSign`, `equal` and `placidus`;
- future calculation routing must normalize them to canonical keys `whole-sign`, `equal-house` and `placidus`;
- default initial UI may use Whole Sign only when the profile has no saved house system selection;
- user-selected house systems must not be silently overridden;
- Whole Sign is the first implementation target;
- Equal House follows Whole Sign as a separate implementation target;
- Placidus requires a validated dependency / calculation path and benchmark fixtures;
- Placidus is now calculation-ready through a browser-safe local implementation validated against static benchmark fixtures;
- if the user selected Placidus and Placidus cannot be calculated for the input, future routing must return explicit unsupported / not-ready status with a safe reason;
- no selected system may silently fallback to another system;
- ASC / MC are still calculated as angles;
- DSC / IC are derived from ASC / MC;
- Whole Sign must not be called `Placidus`;
- Equal House must not be called `Placidus`;
- Placidus must not be approximated by Equal House or Whole Sign;
- `houseSystem` label is required in future UI/debug;
- 0° Aries is the shared zodiac longitude coordinate reference, not the Placidus house anchor;
- Equal House is anchored at exact ASC longitude;
- Placidus cusps are calculated by Placidus algorithm and expressed in zodiac longitudes;
- Placidus quadrant cusps are active only in the validated `placidus` engine and must not be reused as fallback for other systems.

Task 11.2 result:

- exact birth time + coordinates are required before future ASC / MC / houses calculation;
- `birthTimeAccuracy: "unknown"`, empty time, missing timezone, missing birth place, country/region-only place, city without coordinates, missing coordinates and invalid coordinates fail closed;
- supported coordinate shapes: `birthPlace.latitude/longitude`, `birthPlace.lat/lng`, `birthPlace.coordinates.latitude/longitude`, `birthPlace.coordinates.lat/lng`;
- output returns safe flags and messages only, without raw birth date, birth time, timezone or coordinate values;
- provider calculations, UI, PWA cache and package files were not changed.

Task 11.3 result:

- `src/ascMc.js` calculates ASC / MC from UTC moment and birth coordinates, derives DSC / IC by adding 180 degrees, and formats zodiac positions;
- profile-level calculation uses `src/housesInputGuardrails.js` and `src/birthDateTime.js`, then fails closed if readiness or UTC conversion is incomplete;
- sidereal time source: `Astronomy.SiderealTime()` from tracked `src/vendor/astronomy-engine.mjs`;
- obliquity source: internal mean-obliquity approximation;
- Whole Sign remains the initial house-system policy label;
- houses engine, house cusps, Placidus/quadrant cusps, planet-in-house assignment, UI, provider calculations, PWA cache and package files were not changed.

Task 11.4a result:

- docs-only House Systems Strategy / Dependency Audit completed;
- Sprint 11 now targets `whole-sign`, `equal-house` and `placidus` as separate systems;
- local dependency audit found `astronomy-engine` sidereal / horizon / rotation helpers but no ready Placidus / house-cusp API;
- Whole Sign implementation is next;
- Equal House implementation follows Whole Sign;
- Placidus requires validation and benchmark fixtures before active support;
- if Placidus cannot be validated, it must remain explicit deferred / unsupported;
- Task 11.4d2 later resolved this blocker with a browser-safe local Placidus calculation validated against static benchmark fixtures;
- profile-level `houseSystem` selection policy was documented: current values `wholeSign`, `equal` and `placidus` must be normalized into canonical engine keys without silently overriding the user's saved selection;
- Task 11.4e — House System Resolver / Selected System Router was inserted after the individual house engines;
- no house engine, `src/houses.js`, `src/houseSystems.js`, tests, UI, provider calculations, PWA cache or package files were changed.

Task 11.4b result:

- pure Whole Sign houses engine added in `src/wholeSignHouses.js`;
- `test/wholeSignHouses.test.js` added;
- Whole Sign builds 12 houses from ASC sign with zodiac wrap-around;
- output uses `houseSystem: "whole-sign"` and `houseSystemLabel: "Whole Sign"`;
- profile-level path respects current `houseSystem`: `wholeSign` / `whole-sign` can calculate, while `equal`, `equal-house` and `placidus` return explicit unsupported status for this engine;
- Equal House, Placidus, quadrant cusps, generic selected-system router, planet-in-house assignment, UI, provider calculations, `src/houses.js`, `src/houseSystems.js`, PWA cache and package files were not added or changed.

Task 11.4c result:

- pure Equal House / Равнодомная houses engine added in `src/equalHouseHouses.js`;
- `test/equalHouseHouses.test.js` added;
- Equal House builds 12 cusps from exact ASC longitude and advances each cusp by 30 degrees with zodiac wrap-around;
- output uses `houseSystem: "equal-house"` and `houseSystemLabel: "Равнодомная"`;
- house spans include `nextCuspLongitude` and wrap flags for future selected-system validation / planet-in-house work;
- profile-level path respects current `houseSystem`: `equal` / `equal-house` / `equalHouse` can calculate, while `wholeSign`, `whole-sign`, `placidus` and missing selection return explicit unsupported status for this engine;
- Whole Sign, Placidus, quadrant cusps, generic selected-system router, planet-in-house assignment, UI, provider calculations, `src/houses.js`, `src/houseSystems.js`, PWA cache and package files were not added or changed.

Task 11.4d result:

- pure Placidus integration gate added in `src/placidusHouses.js`;
- `test/placidusHouses.test.js` added;
- local audit confirmed tracked `astronomy-engine` / vendor files do not expose a ready Placidus / house-cusp API;
- local `swisseph.swe_houses` exists only as a candidate dev dependency path and is not activated because trusted benchmark fixtures are missing;
- Placidus is recognized as `houseSystem: "placidus"` but remains calculation-disabled with explicit `status: "unsupported"` / `reason: "placidusNotValidated"`;
- validation status records `validated: false`, `implementationReady: false`, `benchmarkFixtures: false` and `reason: "missingBenchmarkFixtures"`;
- profile-level path respects current `houseSystem`: Placidus selection checks guardrails and then returns unsupported until validated, while Whole Sign / Equal House selections return explicit `selectedHouseSystemNotPlacidus`;
- fake Placidus, Equal House fallback, Whole Sign fallback, quadrant cusps, generic selected-system router, planet-in-house assignment, UI, provider calculations, `src/houses.js`, `src/houseSystems.js`, PWA cache and package files were not added or changed.

Task 11.4d2 result:

- static benchmark fixtures added in `test/fixtures/placidusFixtures.js`;
- `src/placidusHouses.js` activated as a browser-safe pure Placidus calculation engine;
- implementation method: local Placidus semi-arc cusp calculation using ASC / MC sidereal time and mean-obliquity helpers from `src/ascMc.js`;
- benchmark source: 5 static public/synthetic `local-swisseph-swe_houses-benchmark` fixtures;
- benchmark tolerance: `0.05°`;
- validation status is now `validated: true`, `implementationReady: true`, `benchmarkFixtures: true`, `benchmarkFixtureCount: 5` and `reason: null`;
- hardening tests confirm benchmark expected cusp values are static finite numbers, not generated at test runtime;
- high-latitude / circumpolar cases fail closed with `status: "unsupported"` / `reason: "placidusUnsupportedAtLatitude"`;
- profile-level path still respects selected `houseSystem`: only `placidus` calculates in this module, while Whole Sign / Equal House selections return explicit `selectedHouseSystemNotPlacidus`;
- `swisseph` is used only as a local dev/test oracle for static fixtures; current project/package is private/local and future public or commercial distribution requires license review before relying on that path;
- runtime `swisseph`, fake Placidus, Equal House fallback, Whole Sign fallback, generic selected-system router, planet-in-house assignment, UI, provider calculations, `src/houses.js`, `src/houseSystems.js`, PWA cache and package files were not added or changed.

Task 11.4e result:

- pure selected-system router added in `src/houseSystemResolver.js`;
- `test/houseSystemResolver.test.js` added;
- router uses profile `houseSystem` or explicit option as source of truth and normalizes aliases to canonical keys `whole-sign`, `equal-house` and `placidus`;
- missing `houseSystem` defaults to `whole-sign` only when no saved selection exists;
- unknown `houseSystem` returns explicit unsupported status with `reason: "unknownHouseSystem"` and does not fallback;
- router calls only the selected engine: Whole Sign, Equal House or Placidus;
- selected engine `notReady` / `unsupported` status and reason are preserved;
- router output includes `selectedHouseSystem`, `houseSystem`, `selectionSource` and `defaulted`;
- Whole Sign, Equal House and Placidus remain separate calculation engines;
- direct house calculations, planet-in-house assignment, UI, provider calculations, `src/houses.js`, `src/houseSystems.js`, PWA cache and package files were not added or changed.

Task 11.5 result:

- cross-system houses validation fixtures added in `test/fixtures/housesValidationFixtures.js`;
- `test/housesValidation.test.js` added;
- Whole Sign manual fixtures validate ASC Aries, Scorpio and Pisces sequences;
- Equal House manual fixtures validate ASC Aries 14.5°, Pisces 29° and Aries 0° cusp longitudes;
- Placidus validation reuses static `test/fixtures/placidusFixtures.js` benchmark values and confirms benchmark count, finite static cusps, ASC / MC alignment, opposite cusps, no Equal House fallback, no Whole Sign fallback and high-latitude unsupported behavior;
- router selection fixtures validate current aliases, missing-selection default, unknown-system unsupported behavior and selected-engine status preservation;
- guardrail fixtures validate missing profile, common day, unknown birth time, missing birth place, city without coordinates, country/region-only and invalid coordinate failures;
- privacy / strict exclusion checks confirm no raw profile data, provider imports, DOM/localStorage imports, generic `src/houses.js` / `src/houseSystems.js`, interpretations or planet-in-house assignment;
- Whole Sign, Equal House and Placidus remain separate systems;
- production calculation modules, UI, provider calculations, PWA cache and package files were not changed.

Task 11.6 result:

- pure planet-in-house assignment module added in `src/planetInHouses.js`;
- `test/fixtures/planetInHousesFixtures.js`, `test/planetInHousesFixtures.test.js` and `test/planetInHouses.test.js` added;
- Whole Sign assignment uses planet sign relative to ASC sign;
- Equal House and Placidus assignment use planet longitude against ready house cusp spans;
- exact cusp boundaries belong to the house starting at that cusp;
- wrapping spans across 0° are supported;
- profile-level assignment uses the existing safe natal planets path and `src/houseSystemResolver.js`;
- invalid planet entries return safe invalid assignments, preserving input order;
- no UI, display helper, interpretations, new house engine, generic `src/houses.js` / `src/houseSystems.js`, provider changes, PWA cache or package files were added.

Task 11.7 result:

- pure Houses / ASC / MC display helper added in `src/housesDisplay.js`;
- `test/housesDisplay.test.js` added;
- ready ASC / MC / DSC / IC angles are formatted as safe user-facing rows;
- Whole Sign, Equal House and Placidus house rows are formatted from already-ready results without exposing raw cusp longitude as standalone text;
- planet-in-house assignments are formatted as compact rows like `Солнце — 9 дом`;
- not-ready and unsupported house results return safe fallback display states;
- no calculations, router calls, planet-in-house assignment, UI, provider calls, interpretations, `src/houses.js`, `src/houseSystems.js`, PWA cache or package files were added.

Результат Sprint 8:

- добавлен foundation для natal aspects между уже валидированными натальными планетами;
- зафиксированы стратегия аспектов, active major aspect set и explicit orb policy;
- добавлены pure aspect engine, synthetic/manual fixture validation, display helper, collapsible UI inside `Мои карты` and safe debug;
- natal aspects остаются только аспектами между planets;
- personal transits, houses, ASC / MC, fixed stars, dignities, interpretations и ritual scoring не добавлены.

Завершенные задачи:

```txt
Task 7.1 — Natal Planets UI Readiness Audit
Task 7.2 — Natal Planet Formatting Helper
Task 7.3 — Natal Planets Readiness UI
Task 7.4a — Birth Time UTC Strategy / Readiness Unblock
Task 7.4b — Implement Birth Time UTC Conversion
Task 7.4 — Read-only Natal Planets Panel
Task 7.5 — Natal Planets Debug
Task 7.6 — Sprint 7 Hardening
Task 8.1 — Natal Aspects Strategy / Orb Rules
Task 8.2 — Natal Aspect Engine
Task 8.3 — Natal Aspect Validation / Fixtures
Task 8.4 — Natal Aspect Display Helper
Task 8.5 — Natal Aspects Collapsible UI
Task 8.6 — Natal Aspects Debug
Task 8.7 — Sprint 8 Hardening
Task 9.1 — Essential Dignities Strategy / Source Decision
Task 9.2 — Essential Dignity Data Model / Dataset
Task 9.3 — Essential Dignity Lookup Engine
Task 9.4 — Essential Dignity Validation / Fixtures
Task 9.5 — Essential Dignity Display Helper
Task 9.6 — Essential Dignities Collapsible UI
Task 9.7 — Essential Dignities Debug
Task 9.8 — Sprint 9 Hardening
Task 10.1 — Terms / Decans / Degree Rulers Strategy and Source Audit
Task 10.2 — Vronsky Dataset Entry Policy
Task 10.3a — Terms Table 5 Transcription Draft
Task 10.3b — Terms Table Manual Verification
Task 10.3c — Terms Dataset from Verified Table 5 Rows
Task 10.4 — Terms Lookup Engine / Fixtures
Task 10.5 — Decans Source Decision / Dataset
Task 10.5b — Decans Star of the Magi Transcription Draft
Task 10.5c — Decans Star of the Magi Manual Verification
Task 10.5d — Decans Star of the Magi Dataset from Verified Rows
Task 10.6 — Decans Lookup Engine / Fixtures
Task 10.7a — Degree Rulers Source Decision
Task 10.7b — Degree Rulers Table 6 Star of the Magi Transcription Draft
Task 10.7c — Degree Rulers Table 6 Manual Verification
Task 10.7d — Degree Rulers Table 6 Dataset from Verified Rows
Task 10.8 — Degree Rulers Lookup Engine / Fixtures
Task 10.9 — Terms / Decans / Degree Rulers Display Helper
Task 10.8b — Table 7 Vronsky Degree Rulers Source / Complexity Audit
Task 10.8c — Table 7 Vronsky Degree Rulers Transcription Draft
Task 10.8d — Table 7 Vronsky Degree Rulers Manual Verification
Task 10.8d-fix — Table 7 Tome 2 Cross-Reference Verification
Task 10.8e — Table 7 Vronsky Degree Rulers Dataset
Task 10.8f — Table 7 Vronsky Degree Rulers Lookup Engine / Fixtures
Task 10.9b — Update Detailed Dignity Display Helper for Table 7
Task 10.10 — Terms / Decans / Degree Rulers Collapsible UI
Task 10.11 — Terms / Decans / Degree Rulers Debug
```

Текущий фокус:

```txt
Task 10.12 — Sprint 10 Hardening
```

Цель Sprint 9:

- добавить foundation для basic sign-based essential dignities natal planets;
- Task 9.1 уже зафиксировала source decision и strategy;
- работать только с domicile / rulership, exile / detriment, exaltation и fall;
- не добавлять terms, decans, degree rulers, fixed stars, houses, ASC / MC, transits, interpretations или ritual scoring.

Результат Task 9.1:

- создан `ESSENTIAL_DIGNITIES_STRATEGY.md`;
- выбран source policy: classical / traditional domicile, detriment, exaltation и fall как main scoring baseline для семи традиционных планет;
- Uranus, Neptune и Pluto получают только separate modern rulership labels, без classical score;
- Vronsky-specific tables, terms / decans / degree rulers и exact exaltation degree scoring отложены до отдельной manual source verification / dataset work;
- предложен explicit helper score: domicile +5, exaltation +4, detriment / exile -5, fall -4, neutral 0;
- код, UI, dataset и dignity engine не создавались.

Результат Task 9.2:

- добавлен source-tracked dataset module `src/essentialDignitiesData.js`;
- dataset содержит classical rulership, detriment, exaltation и fall tables для seven traditional planets;
- Uranus, Neptune и Pluto хранятся отдельно в `modernRulershipLabels` как label-only, score `0`;
- добавлены source metadata, score model и deferred feature list для terms, decans, degree rulers, exact exaltation degrees, Vronsky strength tables, fixed stars, houses, ASC / MC, transits, interpretations и ritual scoring;
- добавлен `test/essentialDignitiesData.test.js`;
- lookup engine и UI еще не созданы.

Результат Task 9.3:

- добавлен pure lookup engine `src/essentialDignities.js`;
- engine принимает уже рассчитанные natal planet objects и возвращает dignity flags, score, labels, modern labels и source;
- `signKey` берется из `planet.sign.key`, а при отсутствии sign fallback строится из валидного `longitude` через `src/astroMath.js`;
- multiple classical flags считаются additive: Mercury in Virgo дает domicile + exaltation = `+9`, Mercury in Pisces дает detriment + fall = `-9`;
- Uranus, Neptune и Pluto получают только modern rulership labels со score `0`;
- добавлен `test/essentialDignities.test.js`;
- UI, display helper, terms / decans / degree rulers, Vronsky rows, houses, ASC / MC, transits и interpretations не создавались.

Результат Task 9.4:

- добавлен synthetic/manual fixture layer `test/fixtures/essentialDignityFixtures.js`;
- добавлены fixture shape tests `test/essentialDignityFixtures.test.js`;
- добавлены validation tests `test/essentialDignityValidation.test.js`;
- создан `ESSENTIAL_DIGNITY_FIXTURE_STRATEGY.md`;
- fixture categories покрывают domicile, detriment, exaltation, fall, multipleFlags, modernRulership, neutral, invalidPlanets, summary и strictExclusions;
- expected dignity results объявлены вручную в fixture data и не генерируются через engine under test;
- fixtures не используют private user names, birth data, coordinates, full profile JSON или real birth charts;
- essential dignity lookup engine validated against synthetic/manual fixtures;
- engine bugs не найдены;
- UI, display helper, terms / decans / degree rulers, Vronsky rows, houses, ASC / MC, transits и interpretations не создавались.

Результат Task 9.5:

- добавлен pure display helper `src/essentialDignityDisplay.js`;
- helper форматирует уже рассчитанные essential dignity results в строки вида `Марс в Овне — обитель`;
- поддержаны multiple flags, modern rulership label-only, neutral state, score text, display type и compact summary;
- добавлены display limitations про deferred terms, decans, degree rulers и Vronsky tables;
- добавлен `test/essentialDignityDisplay.test.js`;
- helper не импортирует lookup engine, provider modules, profile storage, localStorage, DOM или UI;
- UI достоинств, terms / decans / degree rulers, Vronsky rows, houses, ASC / MC, transits и interpretations не создавались.

Результат Task 9.6:

- добавлен `src/essentialDignitiesForProfile.js`, который берет ready natal planet output, применяет `src/essentialDignities.js` и форматирует строки через `src/essentialDignityDisplay.js`;
- добавлена collapsible UI-секция `Достоинства планет` внутри `Мои карты`, после `Натальные аспекты`;
- секция показывается только для активного сохраненного профиля, collapsed by default, сбрасывается при смене профиля / выборе `Общий день` и не ломает `+ Добавить профиль`;
- при ready natal planets пользователь видит compact summary и раскрывает formatted dignity rows только явным кликом;
- при incomplete natal planets показывается fallback `Сначала нужен расчет натальных планет.`;
- empty dignity state показывает `Ярко выраженных базовых достоинств или слабостей не найдено.`;
- UI не показывает raw birth data, `utcDateTime`, raw timezone, coordinates, raw planet longitude, terms / decans / degree rulers, Vronsky rows, houses, ASC / MC, transits, fixed stars, interpretations или ritual scoring;
- PWA cache обновлен до `lunar-calendar-v71`;
- lookup engine, dataset, provider calculations и package files не менялись.

Результат Task 9.7:

- добавлен `src/essentialDignitiesDebug.js`, который строит safe `Essential Dignities UI Debug` summary для active saved profile или `Общий день`;
- debug секция доступна только через `?debug=1` и показывает active profile status, panel status, enabled / disabled, natalPlanetsReady, source policy, score/count summary, collapsed default и profile-panel location;
- debug фиксирует `terms`, `decans`, `degreeRulers`, `exactExaltationDegrees` и `VronskyTables` как `deferred`;
- debug фиксирует houses, ASC / MC, transits и interpretations как `notSupported`;
- debug не показывает raw birth data, `utcDateTime`, raw timezone, coordinates, raw planet longitude/speed, full planet list, full dignity result list, exact exaltation degree values, terms / decans rows, Vronsky rows, houses / ASC / MC values, transits, interpretations или ritual scoring;
- существующие `Natal Planets UI Debug`, `Natal Aspects UI Debug` и `Natal Provider Validation` не менялись по смыслу и продолжают работать;
- PWA cache обновлен до `lunar-calendar-v72`;
- user-facing UI, dataset, lookup engine, display helper, provider calculations и package files не менялись.

Результат Task 9.8:

- проведен финальный hardening Sprint 9;
- подтверждено, что Task 9.1–9.7 закрыты: strategy, dataset, lookup engine, synthetic/manual fixtures, display helper, collapsible UI и safe debug;
- подтверждено, что essential dignities остаются только basic sign-based dignity/debility lookup over ready natal planet signs;
- classical / traditional seven planets остаются scoring baseline;
- Uranus, Neptune и Pluto остаются modern rulership label-only со score `0`;
- terms / decans / degree rulers, Vronsky rows, exact exaltation degrees, fixed stars, houses, ASC / MC, transits, interpretations и ritual scoring не добавлены;
- UI и debug не показывают raw birth data, `utcDateTime`, raw timezone, coordinates, raw planet longitude/speed, full natal planet list или full dignity result list;
- runtime imports остаются через tracked `src/vendor/luxon.mjs` и `src/vendor/astronomy-engine.mjs`;
- package files, provider calculations, `src/ephemeris-data.js` и ephemeris generation не менялись;
- Sprint 9 завершен.

Следующий этап после Sprint 9 был Sprint 10, Terms / Decans / Degree Rulers. Sprint 10 теперь завершен.

Sprint 10 planning подготовлен:

- Sprint 10 — Terms / Decans / Degree Rulers;
- Task 10.1 завершена: создан `TERMS_DECANS_DEGREE_RULERS_STRATEGY.md`;
- Task 10.2 завершена: создан `VRONSKY_DATASET_ENTRY_POLICY.md`;
- Task 10.3a завершена: создан `TERMS_TABLE_5_TRANSCRIPTION_DRAFT.md`;
- Task 10.3b завершена: создан `TERMS_TABLE_5_VERIFICATION_REPORT.md`;
- Task 10.3c завершена: создан `src/termsData.js` active Terms dataset from verified Table 5 rows;
- Task 10.4 завершена: создан `src/terms.js` pure Terms lookup engine and fixture validation;
- Task 10.5 завершена: создан `DECANS_SOURCE_DECISION.md`;
- Task 10.5b завершена: создан `DECANS_STAR_OF_MAGI_TRANSCRIPTION_DRAFT.md`;
- Task 10.5c завершена: создан `DECANS_STAR_OF_MAGI_VERIFICATION_REPORT.md`;
- Task 10.5d завершена: создан `src/decansData.js` active Decans Star of the Magi dataset from verified rows;
- Task 10.6 завершена: создан `src/decans.js` pure Decans Star of the Magi lookup engine and fixture validation;
- Task 10.7a завершена: создан `DEGREE_RULERS_SOURCE_DECISION.md`;
- Task 10.7b завершена: создан `DEGREE_RULERS_TABLE_6_TRANSCRIPTION_DRAFT.md` with 360 non-active `needsReview` rows from Table 6 / Star of the Magi only;
- Task 10.7c завершена: создан `DEGREE_RULERS_TABLE_6_VERIFICATION_REPORT.md` with 360 match, 0 unclear, 0 mismatch;
- Task 10.7d завершена: создан `src/degreeRulersStarOfMagiData.js` active Degree Rulers Table 6 / Star of the Magi dataset from 360 verified rows;
- Task 10.8 завершена: создан `src/degreeRulersStarOfMagi.js` pure Degree Rulers Table 6 / Star of the Magi lookup engine and fixture validation;
- Task 10.9 завершена: создан `src/detailedDignityDisplay.js` pure display helper for already-computed terms / decans / degree ruler lookup results;
- Task 10.8b завершена: создан `DEGREE_RULERS_TABLE_7_COMPLEXITY_AUDIT.md`, Table 7 включена в Sprint 10 as separate Vronsky degree-ruler source flow;
- Task 10.8c завершена: создан `DEGREE_RULERS_TABLE_7_TRANSCRIPTION_DRAFT.md` with 360 non-active `needsReview` rows and 98 unclear rows;
- Task 10.8d завершена: создан `DEGREE_RULERS_TABLE_7_VERIFICATION_REPORT.md` with 360 checked rows, 262 match, original unclear 98, resolved unclear 0, remaining unclear 98 and 0 mismatch;
- Task 10.8d-fix завершена: создан `DEGREE_RULERS_TABLE_7_TOME2_CROSS_REFERENCE.md`, all 360 Table 7 rows cross-referenced against Tome 2 `Управитель` / `Управители` lines, 98 unclear rows resolved, 6 additional parsed-ruler corrections applied, remaining unclear 0 and mismatch 0;
- Task 10.8e завершена: создан `src/degreeRulersVronskyData.js` active Table 7 / Vronsky degree rulers dataset with 360 verified rows, `sourceTokens`, `rulers[]`, per-ruler retrograde flags, outer planets, Chiron and Proserpina;
- Task 10.8f завершена: создан `src/degreeRulersVronsky.js` pure Table 7 / Vronsky degree rulers lookup engine and manual fixture validation;
- Task 10.9b завершена: `src/detailedDignityDisplay.js` now formats Table 7 / Vronsky multi-ruler degree ruler results with explicit Table 7 source label, per-ruler `R`, outer planets, Chiron and Proserpina;
- Task 10.10 завершена: добавлен collapsed-by-default UI block `Термы, деканы и градусы` inside `Мои карты`, backed by pure `src/detailedDignitiesForProfile.js`, with short human-readable labels `Вронский, термы`, `Звезда Магов` and `Вронский`, and no interpretations;
- Task 10.11 завершена: добавлен safe `Detailed Dignities UI Debug` in `?debug=1` with status/counts/collapsed state/source labels/capabilities/privacy flags only;
- Task 10.12 завершена: проведен final Sprint 10 hardening audit; source separation, architecture boundaries, privacy, UI/debug behavior and cache coverage confirmed; no code fixes were required;
- Sprint 10 закрыт;
- Task 11.1 завершена: добавлены `SPRINT_11_PLAN.md` и `HOUSES_ASC_MC_STRATEGY.md`, зафиксированы input guardrails and Whole Sign initial house policy;
- Task 11.2 завершена: добавлен pure `src/housesInputGuardrails.js` readiness / guardrails layer and tests; ASC / MC / houses calculations were not added;
- Task 11.3 завершена: добавлен pure `src/ascMc.js` ASC / MC calculation engine and tests; houses, house cusps and planet-in-house calculations were not added;
- Task 11.4a завершена: docs-only House Systems Strategy / Dependency Audit; Sprint 11 now targets Whole Sign, Equal House and Placidus as separate systems;
- Task 11.4b завершена: добавлен pure Whole Sign houses engine `src/wholeSignHouses.js`;
- Task 11.4c завершена: добавлен pure Equal House / Равнодомная houses engine `src/equalHouseHouses.js`;
- Task 11.4d завершена: добавлен pure Placidus integration gate `src/placidusHouses.js`; Placidus recognized but unsupported until validated path and benchmark fixtures exist; generic router and planet-in-house assignment still not implemented;
- Task 11.4d2 завершена: Placidus activated in `src/placidusHouses.js` as browser-safe calculation validated against 5 static `local-swisseph-swe_houses-benchmark` fixtures; high-latitude / circumpolar cases return explicit unsupported status;
- Task 11.4e завершена: добавлен selected-system router `src/houseSystemResolver.js`; router uses profile `houseSystem` as source of truth, defaults missing selection to Whole Sign, preserves selected engine `notReady` / `unsupported` reasons and does not silently fallback between systems;
- Task 11.5 завершена: добавлены cross-system validation fixtures/tests for Whole Sign, Equal House and Placidus; router no-fallback behavior, guardrail failures and privacy / strict exclusions validated;
- Task 11.6 завершена: добавлен pure planet-in-house assignment layer for selected house systems; Whole Sign uses sign-relative assignment, Equal House / Placidus use cusp spans;
- Task 11.7 завершена: добавлен pure `src/housesDisplay.js` display helper for ready Houses / ASC / MC / planet-in-house results; UI не добавлялся;
- Task 11.8 завершена: добавлен collapsible UI block `Дома и углы карты` inside `Мои карты`, backed by `src/housesForProfile.js`, with selected house system, angles, houses, planet assignments and safe fallback states; interpretations were not added;
- Task 11.8b завершена: добавлен ручной ввод координат места рождения в профиль; валидные координаты сохраняются как `birthPlace.coordinates.latitude` / `longitude`, геокодинг и автоподстановка не добавлялись;
- Task 11.8c завершена: проверен ready state `Дома и углы карты` для Moscow 1981 Placidus after manual coordinates; raw cusps and UI rows are distinct, regression tests added;
- Task 11.9 завершена: добавлен safe `Houses / ASC / MC UI Debug` for `?debug=1`; debug shows readiness/counts/capabilities/privacy flags without raw birth data, UTC, coordinates or full houses arrays;
- Task 11.10 завершила final Sprint 11 hardening: guardrails, house-system separation, Placidus validation, coordinate/profile shape, architecture boundaries, privacy, UI/debug and PWA cache were rechecked; no code fixes were needed;
- Sprint 11 закрыт; Sprint 12 закрыт;
- Task 12.1 завершена: добавлены `SPRINT_12_PLAN.md`, `HOUSE_CUSPS_PARS_FORTUNA_STRATEGY.md` и `PARS_FORTUNA_ARABIC_PARTS_FORMULA_POLICY.md`; Sprint 12 зафиксирован как House Cusps + Pars Fortuna + Basic Arabic Parts без интерпретаций;
- Task 12.2 завершена: добавлен pure canonical cusp layer `src/houseCusps.js`, static fixtures and tests for Whole Sign sign-boundaries, Equal House exact ASC + 30° cusps and Placidus benchmark-validated quadrant cusps;
- Task 12.3 завершена: добавлен pure day/night chart status engine `src/dayNightChart.js`; статус дневной/ночной карты определяется геометрической высотой Солнца над горизонтом, пограничные случаи возвращают explicit boundary;
- Task 12.4 завершена: добавлен pure Pars Fortuna engine `src/parsFortuna.js`; используется дневная формула `ASC + Moon - Sun`, ночная формула `ASC + Sun - Moon`, а boundary / unknown sect returns `notReady`;
- Task 12.5 завершена: добавлен data-only formula dataset / source decision layer `src/arabicPartsData.js`; `pars-fortuna` была единственной active verified формулой, Lot of Spirit и дополнительные Arabic Parts оставались deferred until source verification;
- Task 12.5b завершена: Lot of Spirit source verification accepted; `lot-of-spirit` is now active verified in `src/arabicPartsData.js` with day formula `ASC + Sun - Moon` and night formula `ASC + Moon - Sun`; calculation engine was not added;
- Task 12.6 завершена: добавлен pure Basic Arabic Parts engine `src/arabicParts.js`; active verified formulas calculated are `pars-fortuna` and `lot-of-spirit`; deferred Arabic Parts remain inactive; house assignment was deferred to Task 12.7 at that stage;
- Task 12.7 завершена: добавлен pure Lots / Arabic Parts house assignment layer `src/arabicPartsHouseAssignment.js`; active verified lots (`pars-fortuna`, `lot-of-spirit`) can be assigned to Whole Sign, Equal House and Placidus canonical cusps by numeric longitude; UI/display/debug and interpretations were not implemented yet at that stage;
- Task 12.8 завершена: добавлен pure Lots / Arabic Parts display helper `src/arabicPartsDisplay.js`; helper formats ready part positions, optional house assignment labels, day/night labels and safe fallback states; UI/debug and interpretations are not implemented yet;
- Task 12.9 завершена: добавлен collapsible UI block `Жребии и арабские части` inside `Мои карты` after `Дома и углы карты`; block shows day/night label, Pars Fortuna, Lot of Spirit and house labels when ready, safe fallback when not ready, and no interpretations;
- Task 12.10 завершена: добавлен safe `Arabic Parts UI Debug` for `?debug=1`; debug shows status/readiness/chart sect/formula keys/counts/capabilities/privacy flags without raw birth data, coordinates, UTC, raw longitudes, formula operands or full result arrays;
- Task 12.11 завершена: final Sprint 12 hardening confirmed house cusps, day/night, Pars Fortuna, Lot of Spirit, deferred Arabic Parts, assignment, UI/debug, privacy and architecture boundaries; code fixes were not needed;
- Sprint 13 начат: Task 13.1 добавила Special Points strategy docs; Lunar Nodes are the active target, Lilith and Selena are source-gated, fake points / formulas from memory / interpretations remain forbidden;
- Task 13.2 завершена: добавлен `LUNAR_NODES_SOURCE_POLICY.md`; active node system is `mean-lunar-node` / `lunar-nodes-mean`; `true-lunar-node` remains deferred; South Node derives from North Node + 180° normalized; validation план требует static local Swiss Ephemeris `SE_MEAN_NODE` benchmark fixtures;
- Task 13.3 завершена: добавлен pure `src/lunarNodes.js` mean Lunar Nodes engine, static benchmark fixtures and tests; North Node uses the active `mean-lunar-node` policy, South Node is derived as North Node + 180°, coordinates are not required, true node / Lilith / Selena remain deferred;
- Task 13.4 завершена: добавлен pure `src/lunarNodesHouseAssignment.js` layer; North/South Nodes can be assigned to selected-system canonical cusps by numeric longitude with half-open spans, exact-cusp boundary ownership and wrap-around support; UI/display/debug and interpretations were not added;
- Task 13.5 завершена: добавлен `LILITH_SOURCE_DECISION.md`; Lilith status is `source-verified-for-implementation`; Mean Black Moon Lilith / Mean Lunar Apogee is the active target for Task 13.6; local Swiss Ephemeris `SE_MEAN_APOG` / `swe_calc_ut` is the static benchmark oracle only; True / Osculating and interpolated Lilith remain deferred;
- следующая активная задача — Task 13.6 — Mean Lilith Engine / Fixtures;
- Sprint 10 должен работать только с source-tracked lookup layers after validated natal planet coordinates;
- dense Vronsky screenshots must not be OCR-imported blindly;
- fixed stars, transits, interpretations и ritual scoring остаются out of scope; Houses / ASC / MC закрыты в Sprint 11.

Результат Task 10.7b:

- создан `DEGREE_RULERS_TABLE_6_TRANSCRIPTION_DRAFT.md`;
- перенесено 360 draft rows: 12 signs x 30 degree rows;
- все rows остаются `needsReview`; active degree rulers dataset не создан;
- draft ограничен Table 6 / Star of the Magi source system и septener planet rulers;
- Table 7 / Vronsky degree rulers не использованы;
- lookup engine, UI, tests, `src/`, package files, `sw.js` и OCR import не создавались.

Результат Task 10.7c:

- создан `DEGREE_RULERS_TABLE_6_VERIFICATION_REPORT.md`;
- проверено 360 rows against `table6.jpg`: 360 match, 0 unclear, 0 mismatch;
- зафиксировано, что Table 6 / Star of the Magi remains separate from Table 7 / Vronsky degree rulers;
- active degree rulers dataset еще не создан;
- lookup engine, UI, tests, `src/`, package files, `sw.js`, OCR import и Table 7 rows не создавались.

Результат Task 10.7d:

- создан `src/degreeRulersStarOfMagiData.js`;
- создан active source-tracked Degree Rulers Table 6 / Star of the Magi dataset from verified rows;
- dataset содержит 360 verified rows: 12 signs x 30 integer degrees;
- source system: `star-of-magi-degree-rulers`;
- degree policy: integer degrees `0` through `29`; future lookup policy remains `degreeIndex = floor(degreeWithinSign)` for `0 <= degreeWithinSign < 30`;
- Table 7 / Vronsky degree rulers remain deferred and are not mixed with Table 6;
- lookup engine, UI, display helper, Table 7 rows, package files, `sw.js` and provider calculations were not changed.

Результат Task 10.8b:

- создан `DEGREE_RULERS_TABLE_7_COMPLEXITY_AUDIT.md`;
- зафиксировано, что Table 7 — `Управление градусами (по С. Вронскому)` входит в Sprint 10 как отдельный degree-ruler source system;
- подтверждено, что Table 7 нельзя смешивать с Table 6 / Star of the Magi degree rulers;
- выявлено, что Table 7 сложнее Table 6: ячейки могут содержать multiple rulers, retrograde markers, outer planets and source tokens;
- будущая data shape должна поддерживать `rulers[]`, `retrograde` and `sourceToken`, а не single `ruler`;
- active Table 7 dataset, lookup engine, transcription, OCR import, UI, tests, `src/`, package files and `sw.js` were not changed;
- Table 7 flow inserted before UI/debug/hardening: Task 10.8c, 10.8d, 10.8e, 10.8f and possible 10.9b;
- Houses / ASC / MC remain Sprint 11;
- next task is Task 10.8c — Table 7 Vronsky Degree Rulers Transcription Draft.

Результат Task 10.8c:

- создан `DEGREE_RULERS_TABLE_7_TRANSCRIPTION_DRAFT.md`;
- перенесено 360 draft rows across 12 signs x 30 degree rows from `table7.jpg`;
- все rows остаются `needsReview`; no row is `verified`;
- source tokens preserved as visible draft text, parsed rulers added only where symbols were clear enough;
- unclear rows: 98, mostly node-like or Gemini-like glyphs that require manual verification;
- Table 7 remains separate from Table 6 / Star of the Magi degree rulers;
- active Table 7 dataset еще не создан;
- lookup engine еще не создан;
- OCR import, UI, tests, `src/`, package files and `sw.js` were not changed;
- next task is Task 10.8d — Table 7 Vronsky Degree Rulers Manual Verification.

Результат Task 10.8d:

- создан `DEGREE_RULERS_TABLE_7_VERIFICATION_REPORT.md`;
- проверено 360 rows against `table7.jpg`;
- counts: matched 262 / original unclear 98 / resolved unclear 0 / remaining unclear 98 / mismatch 0;
- оставшиеся unclear rows содержат node-like or Gemini-like glyph tokens and remain blocked;
- active Table 7 dataset еще не создан;
- lookup engine еще не создан;
- Table 6 не использовалась and Table 6 / Table 7 source systems remain separate;
- OCR import, UI, tests, `src/`, package files and `sw.js` were not changed;
- remaining unclear rows were later resolved in Task 10.8d-fix.

Результат Task 10.8d-fix:

- создан `DEGREE_RULERS_TABLE_7_TOME2_CROSS_REFERENCE.md`;
- Tome 2 / `Градусология` использован только как textual cross-reference for Table 7 `Управитель` / `Управители` lines;
- all 360 Table 7 rows cross-referenced against Tome 2;
- original unclear count: 98;
- resolved unclear count: 98;
- additional clear draft corrections from Tome 2: 6;
- remaining unclear count: 0;
- mismatch count: 0;
- node-like glyphs resolved as Chiron / Хирон where Tome 2 says `Хирон`;
- Gemini-like glyphs resolved as Proserpina / Прозерпина where Tome 2 says `Прозерпина`;
- retrograde markers are assigned from Tome 2 wording, not from blind visual replacement;
- draft rows remain `needsReview`; active Table 7 dataset еще не создан;
- lookup engine еще не создан;
- Table 6 не использовалась and Table 6 / Table 7 source systems remain separate;
- OCR import, UI, tests, `src/`, package files and `sw.js` were not changed;
- next task is Task 10.8e — Table 7 Vronsky Degree Rulers Dataset.

Результат Task 10.8e:

- создан `src/degreeRulersVronskyData.js`;
- создан active source-tracked Table 7 / Vronsky degree rulers dataset from 360 verified and Tome 2 cross-referenced rows;
- source system: `vronsky-degree-rulers`;
- source key: `degree-rulers-vronsky-table-7`;
- row model preserves `sourceTokens` and `rulers[]`;
- rows support multiple rulers, per-ruler `retrograde`, outer planets, Chiron and Proserpina;
- degree policy remains integer degree indexes `0` through `29`; future lookup rule is `degreeIndex = floor(degreeWithinSign)` for `0 <= degreeWithinSign < 30`;
- Table 6 / Star of the Magi remains a separate source system and was not mixed into Table 7;
- добавлен `test/degreeRulersVronskyData.test.js`;
- lookup engine еще не создан;
- UI, display helper changes, `src/app.js`, `index.html`, package files and `sw.js` were not changed;
- next task is Task 10.8f — Table 7 Vronsky Degree Rulers Lookup Engine / Fixtures.

Результат Task 10.8f:

- создан `src/degreeRulersVronsky.js`;
- добавлен pure lookup engine over verified Table 7 / Vronsky degree rulers dataset;
- lookup uses `degreeIndex = floor(degreeWithinSign)` for `0 <= degreeWithinSign < 30`; `30°` remains invalid inside one sign;
- output preserves `sourceTokens[]`, `rulers[]`, multiple rulers and per-ruler `retrograde` flags;
- engine supports already-calculated natal planet objects with `sign.key + degree/minutes`, sign + degree only and safe longitude fallback through `src/astroMath.js`;
- summary counts ruler occurrences, multi-ruler rows, retrograde ruler entries and outer-planet ruler entries;
- added manual fixtures and validation tests in `test/fixtures/degreeRulersVronskyFixtures.js`, `test/degreeRulersVronskyFixtures.test.js`, `test/degreeRulersVronsky.test.js` and `test/degreeRulersVronskyValidation.test.js`;
- Table 6 / Star of the Magi remains a separate source system and was not mixed into Table 7;
- dataset, UI, display helper, `src/app.js`, `index.html`, package files and `sw.js` were not changed;
- next task is Task 10.9b — Update Detailed Dignity Display Helper for Table 7.

Результат Task 10.9b:

- обновлен `src/detailedDignityDisplay.js`;
- добавлен formatter for Table 7 / Vronsky degree ruler lookup results with `degreeRulers[]` or `rulers[]`;
- multiple rulers display as comma-separated Russian labels, e.g. `Марс, Плутон R`;
- retrograde markers display as `R` after the ruler label;
- Table 6 and Table 7 degree-ruler display sources remain separate in UI as `Звезда Магов` and `Вронский`;
- summary now counts `vronskyDegreeRulers`;
- lookup engines, datasets, UI, `src/app.js`, `index.html`, package files and `sw.js` were not changed;
- next task was Task 10.10 — Terms / Decans / Degree Rulers Collapsible UI.

Результат Task 10.10:

- добавлен pure helper `src/detailedDignitiesForProfile.js`, который берет ready natal planets through existing profile path and formats terms, decans, Table 6 and Table 7 degree-ruler lookup results by planet;
- внутри `Мои карты` добавлен collapsed-by-default block `Термы, деканы и градусы` after `Достоинства планет`;
- post-task UI-copy polish removed the duplicated ready summary line under `Термы, деканы и градусы`;
- post-task UI layout fix keeps the `Показать` / `Скрыть` toggle aligned to the right of the `Термы, деканы и градусы` title without restoring the duplicated summary line;
- expanded state shows grouped planet rows with compact user-facing source labels: terms show `Вронский, термы`, decans show `Звезда Магов`, Table 6 degree rulers show `Звезда Магов`, and Table 7 degree rulers show `Вронский`;
- `Общий день` and profiles without ready natal planets show safe fallback: `Пока недоступны.` / `Сначала нужен расчет натальных планет.`;
- no raw birth data, raw longitude, coordinates, sourceTokens, sourceKey/sourceSystem, interpretations, fixed stars, houses, ASC / MC or transits are displayed;
- PWA cache updated to `lunar-calendar-v76`;
- datasets, lookup engines, provider calculations, package files and `src/ephemeris-data.js` were not changed;
- next task was Task 10.11 — Terms / Decans / Degree Rulers Debug.

Результат Task 10.11:

- добавлен `src/detailedDignitiesDebug.js`;
- `?debug=1` теперь включает `Detailed Dignities UI Debug`;
- debug показывает only active profile id/name, panel status, natal planets readiness, collapsed default/state, counts for terms / decans / Table 6 / Table 7, source labels, capabilities and privacy flags;
- raw birth data, raw profile data, raw coordinates, raw planet longitudes, source tokens, source keys/source systems, full tables, interpretations, fixed stars, houses, ASC / MC and transits are not exposed;
- PWA cache updated to `lunar-calendar-v77`;
- datasets, lookup engines, provider calculations, normal UI, package files and `src/ephemeris-data.js` were not changed;
- next task is Task 10.12 — Sprint 10 Hardening.

Результат Task 10.1:

- terms выбраны первым implementation target;
- terms source: Vronsky Table 5, pending manual verification;
- decans требуют отдельного source decision и не должны смешивать Chaldean / Star of the Magi, triplicity / trigon или Vronsky-specific systems;
- degree rulers deferred until Table 6 / Table 7 source screenshots or verified rows are available;
- Table 6 и Table 7 считаются отдельными source systems;
- actual Vronsky screenshot/table files не найдены в репозитории, поэтому dataset entry требует uploaded source material or manual transcription later;
- no blind OCR зафиксирован как обязательное правило;
- recommended Sprint 10 order after Task 10.8b insertion: Table 7 transcription / verification / dataset / lookup before Task 10.10 UI, then Task 10.11 debug and Task 10.12 hardening;
- код, datasets, lookup engine, UI, package files и PWA cache не менялись.

Результат Task 10.2:

- создан `VRONSKY_DATASET_ENTRY_POLICY.md`;
- зафиксировано правило: OCR output is not trusted data, OCR-only rows must not be committed as active dataset rows;
- описан source inventory для Table 5, Table 6, Table 7, Table 4, Table 10, Table 18 и formula tables involving ASC and planets;
- active first target остается Table 5 Terms, но только after source/manual verification;
- Table 6 и Table 7 остаются separate source systems и deferred;
- описан manual data entry workflow: source reference, manual draft rows, row review, verificationStatus, tests, verified-only active rows;
- добавлены dataset metadata requirements, row metadata requirements, verification statuses and boundary testing requirements;
- код, datasets, lookup engine, OCR import, UI, package files и PWA cache не менялись.

Результат Task 10.3a:

- создан `TERMS_TABLE_5_TRANSCRIPTION_DRAFT.md`;
- source reference: `table5.png`, Table 5 — Термы, по Вронскому;
- перенесены 60 draft rows across 12 zodiac signs;
- все строки остаются `needsReview`, ни одна строка не помечена `verified`;
- вопросы вынесены для manual verification: final ranges ending at `29°`, gaps/overlaps, values and rulers;
- active JS dataset, `src/termsData.js`, lookup engine, UI, tests, OCR import, package files и PWA cache не создавались/не менялись.

Результат Task 10.3b:

- создан `TERMS_TABLE_5_VERIFICATION_REPORT.md`;
- verification type: image-to-draft review against `table5.png`;
- rows checked: 60;
- matched rows: 60;
- unclear rows: 0;
- mismatched rows: 0;
- signs with final printed end `29°`: Aries / Овен, Taurus / Телец, Libra / Весы, Scorpio / Скорпион;
- final interval normalization question remains explicit: printed source values stay as printed, while future code likely needs `normalizedEndExclusive = 30` for final sign intervals;
- Task 10.3c was required to store both printed range and normalized range before creating active dataset rows;
- active dataset, `src/termsData.js`, lookup engine, UI, tests, OCR import, package files и PWA cache не создавались/не менялись.

Результат Task 10.3c:

- создан active source-tracked dataset module `src/termsData.js`;
- добавлено 60 verified Table 5 terms rows across 12 zodiac signs;
- dataset metadata фиксирует `sourceKey: "vronsky-table-5-terms"`, Table 5 — Термы, manual verification source and `rowCount: 60`;
- all rows have `verificationStatus: "verified"` and `sourceCheck: "match"`;
- printed source ranges are preserved through `printedEndDegree`;
- future lookup boundaries are stored separately through `normalizedEndExclusive`;
- final printed `29°` rows for Aries / Овен, Taurus / Телец, Libra / Весы and Scorpio / Скорпион keep `printedEndDegree: 29` and use `normalizedEndExclusive: 30`;
- interval policy is half-open: `[startDegree, normalizedEndExclusive)`, degree within sign `0 <= degree < 30`;
- added `test/termsData.test.js` for metadata, row counts, verified-only rows, interval coverage, final `29°` normalization, allowed rulers, read-only boundaries and strict exclusions;
- lookup engine, UI, display helper, decans, degree rulers, fixed stars, houses, ASC / MC, transits, interpretations, package files and PWA cache were not changed.

Результат Task 10.4:

- добавлен pure lookup engine `src/terms.js`;
- engine uses verified `src/termsData.js` rows only;
- `lookupTerm(signKey, degreeWithinSign)` applies `[startDegree, normalizedEndExclusive)` boundaries and returns structured ready/invalid results;
- `lookupTermForPlanet(planet)` supports natal planet objects through `sign.key + degree/minutes` and falls back to valid `longitude` via `src/astroMath.js` when sign/degree are insufficient;
- `evaluateTermsForPlanets(planets)` filters invalid planets and preserves canonical planet order;
- `getTermsSummary(results)` returns safe counts by ruler, positive/negative counts and score total;
- final printed `29°` rows for Aries / Овен, Taurus / Телец, Libra / Весы and Scorpio / Скорпион are looked up through `normalizedEndExclusive: 30` while output preserves `printedEndDegree: 29`;
- added manual fixtures `test/fixtures/termsFixtures.js`;
- added `test/termsFixtures.test.js`, `test/terms.test.js` and `test/termsValidation.test.js`;
- fixtures cover sign starts, exact boundaries, final printed `29°` normalization, final printed `30°`, invalid inputs, planet input, summary and strict exclusions;
- dataset `src/termsData.js` was not changed;
- UI, display helper, decans, degree rulers, Vronsky degree rows, fixed stars, houses, ASC / MC, transits, interpretations, provider calculations, package files and PWA cache were not changed.

Результат Task 10.5:

- создан `DECANS_SOURCE_DECISION.md`;
- source audit использовал uploaded PDF `4148867_vvedenie_v_astrologiyu.pdf`;
- найдено, что Вронский описывает две системы управления деканатами: по Звезде Магов / египетская традиция и по тригонам;
- PDF source locations зафиксированы: page 72 for Appendix/Fig. 4.7/4.8 references, pages 74-76 for Star of the Magi and decan rules, page 77 for Fig. 4.8, pages 99-100 for Appendix table references;
- Star of the Magi system selected as first decan dataset candidate, but only after draft transcription and manual verification;
- Trigon / Vronsky decans deferred because they can include multiple active rulers and retrograde outer planets;
- Star of the Magi and Trigon systems must use separate source keys and must not be mixed silently;
- active decans dataset was not created because no 36-row manual transcription and verification report exists yet;
- next task is Task 10.5b — Decans Star of the Magi Transcription Draft;
- code, `src/`, tests, UI, OCR import, lookup engine, package files and PWA cache were not changed.

Результат Task 10.5b:

- создан `DECANS_STAR_OF_MAGI_TRANSCRIPTION_DRAFT.md`;
- source image: `fig_4_7_decans_star_of_magi.png`, Fig. 4.7 — Star of the Magi / Egyptian tradition;
- перенесены 36 draft rows across 12 zodiac signs;
- все строки имеют `verificationStatus: needsReview`;
- unclear rows не выявлены during draft transcription, but manual verification is still required;
- draft uses septener planets only: Sun, Moon, Mercury, Venus, Mars, Jupiter and Saturn;
- Uranus / Neptune / Pluto, trigon decans, degree rulers and active dataset rows were not added;
- active decans dataset, `src/decansData.js`, lookup engine, UI, tests, OCR import, package files and PWA cache were not created/changed;
- next task is Task 10.5c — Decans Star of the Magi Manual Verification.

Результат Task 10.5c:

- создан `DECANS_STAR_OF_MAGI_VERIFICATION_REPORT.md`;
- verification type: image-to-draft review against `fig_4_7_decans_star_of_magi.png` and the control table;
- rows checked: 36;
- matched rows: 36;
- unclear rows: 0;
- mismatched rows: 0;
- confirmed Star of the Magi / Egyptian tradition only and septener planets only;
- confirmed no Uranus / Neptune / Pluto, Trigon / Vronsky rows, active decans dataset or lookup engine;
- active decans dataset, `src/decansData.js`, lookup engine, UI, tests, OCR import, package files and PWA cache were not created/changed;
- next task is Task 10.5d — Decans Star of the Magi Dataset from Verified Rows.

Результат Task 10.5d:

- создан active source-tracked dataset module `src/decansData.js`;
- добавлено 36 verified Star of the Magi / Egyptian tradition decan rows across 12 zodiac signs;
- dataset metadata фиксирует `sourceKey: "decans-star-of-magi-vronsky-fig-4-7"`, Fig. 4.7 source, manual verification report and `rowCount: 36`;
- all rows have `verificationStatus: "verified"` and `sourceCheck: "match"`;
- source system is `star-of-magi-egyptian-tradition`;
- interval policy is half-open: decan 1 `[0,10)`, decan 2 `[10,20)`, decan 3 `[20,30)`, degree within sign `0 <= degree < 30`;
- dataset uses septener planets only: Sun, Moon, Mercury, Venus, Mars, Jupiter and Saturn;
- Trigon / Vronsky decans remain deferred and separate;
- degree rulers, fixed stars, houses, ASC / MC, transits, interpretations and ritual scoring remain deferred / notSupported;
- added `test/decansData.test.js` for metadata, row counts, sign coverage, verified-only rows, interval coverage, allowed septener rulers, deferred systems/features, read-only boundaries and strict exclusions;
- lookup engine, UI, display helper, degree rulers, Trigon/Vronsky rows, provider calculations, package files and PWA cache were not changed.
- next task is Task 10.6 — Decans Lookup Engine / Fixtures.

Результат Task 10.6:

- создан pure lookup engine `src/decans.js`;
- lookup использует только verified `src/decansData.js` rows for Star of the Magi / Egyptian tradition;
- boundary policy: `[0,10)`, `[10,20)`, `[20,30)`, `30°` invalid inside one sign;
- planet input supports ready `sign.key + degree/minutes` and longitude fallback through `src/astroMath.js`;
- summary counts ready decans by ruler and decan index without raw birth data;
- added manual fixtures in `test/fixtures/decansFixtures.js`;
- added tests `test/decansFixtures.test.js`, `test/decans.test.js` and `test/decansValidation.test.js`;
- `src/decansData.js`, UI/app shell, provider calculations, package files and PWA cache were not changed;
- Trigon / Vronsky decans, degree rulers, fixed stars, houses, ASC / MC, transits, interpretations and ritual scoring remain deferred / notSupported;
- next task is Task 10.7a — Degree Rulers Source Decision.

Результат Task 10.7a:

- created `DEGREE_RULERS_SOURCE_DECISION.md`;
- PDF source locations confirmed:
  - PDF page 75: Star of the Magi as a basis for degree rulership;
  - PDF page 76: text points to two degree-ruler systems in Appendix 2;
  - PDF page 99: Table 6, `Управление градусами по Звезде Магов`;
  - PDF page 100: Table 7, `Управление градусами (по С. Вронскому)`;
- source images `table6.jpg` and `table7.jpg` are available;
- Table 6 and Table 7 are separate degree-ruler source systems and must not be mixed;
- Table 6 / Star of the Magi is the first candidate only after draft transcription and manual verification;
- Table 7 / Vronsky remains deferred to a separate workflow;
- active degree rulers dataset, lookup engine, OCR import, UI, tests, `src/`, package files and PWA cache were not changed;
- Task 10.7b has since been completed; current next task is Task 10.7c — Degree Rulers Table 6 Manual Verification.

Результат Task 10.7b:

- created `DEGREE_RULERS_TABLE_6_TRANSCRIPTION_DRAFT.md`;
- transcribed 360 non-active draft rows across 12 signs x 30 degree rows from `table6.jpg`;
- all rows remain `needsReview`; no row is `verified`;
- draft is limited to Table 6 / Star of the Magi and septener planet rulers only;
- Table 7 / Vronsky degree rulers were not used;
- active degree rulers dataset, lookup engine, OCR import, UI, tests, `src/`, package files and PWA cache were not changed;
- next task is Task 10.7c — Degree Rulers Table 6 Manual Verification.

Результат Task 8.1:

- создан `NATAL_ASPECTS_STRATEGY.md`;
- Sprint 8 MVP aspect set: conjunction, sextile, square, trine, opposition;
- выбран orb model: `finalAllowedOrb = min(aspectBaseOrb, bodyPairOrb)`;
- aspect base caps: conjunction 8°, opposition 8°, square 7°, trine 7°, sextile 5°;
- body-pair caps: luminaries 8°, personal planets without luminaries 6°, Jupiter/Saturn 5°, outer involvement 5°, outer-only 3°;
- applying / separating остаются `null` до отдельной validated logic;
- реализация engine, UI аспектов, transits, houses, ASC / MC и interpretations еще не начинались.

Результат Task 8.2:

- добавлен pure calculation module `src/natalAspectEngine.js`;
- добавлен `test/natalAspectEngine.test.js`;
- engine рассчитывает только major natal aspects между переданными натальными планетами;
- использует explicit orb policy из `NATAL_ASPECTS_STRATEGY.md`: `finalAllowedOrb = min(aspectBaseOrb, bodyPairOrb)`;
- реализованы body-pair caps, strength bands, duplicate prevention, same-body ignored, invalid planets ignored и canonical sorting;
- applying / separating возвращаются как `null`;
- модуль не импортирует provider, `astronomy-engine`, Luxon, profile storage, localStorage, DOM или UI;
- UI аспектов, transits, houses, ASC / MC, fixed stars и interpretations еще не добавлены.

Результат Task 8.3:

- добавлен fixture validation layer для natal aspect engine;
- создан `test/fixtures/natalAspectFixtures.js` с synthetic/manual fixtures;
- добавлены `test/natalAspectFixtures.test.js` и `test/natalAspectValidation.test.js`;
- создан `NATAL_ASPECT_FIXTURE_STRATEGY.md`;
- fixture categories покрывают exact major aspects, near-inside orb, just-outside orb, wrap-around, duplicate prevention, outer-outer narrow orb, luminary wide orb, invalid planets, no aspects и sorting priority;
- expected aspects заданы вручную и не генерируются через `calculateNatalAspects()`;
- private birth data, user profiles, real birth charts, transits, houses, ASC / MC and interpretations не используются;
- bugs в `src/natalAspectEngine.js` не найдены, engine code не менялся.

Результат Task 8.4:

- добавлен pure display helper `src/natalAspectDisplay.js`;
- добавлен `test/natalAspectDisplay.test.js`;
- helper форматирует уже рассчитанные natal aspect objects в компактные строки вида `Солнце □ Луна · орб 2°15′`;
- добавлены API для форматирования одного аспекта, списка аспектов, summary counts, limitations и displayability checks;
- summary считает `square` / `opposition` как tense, `trine` / `sextile` как harmonious, а `conjunction` отдельно;
- helper не вызывает `calculateNatalAspects()`, providers, profiles, localStorage, DOM или UI;
- UI аспектов, transits, houses, ASC / MC, interpretations и ritual scoring еще не добавлены.

Результат Task 8.5:

- добавлен helper `src/natalAspectsForProfile.js`;
- добавлен `test/natalAspectsForProfile.test.js`;
- внутри `Мои карты` добавлена collapsible section `Натальные аспекты` под блоком `Натальные планеты`;
- данные идут только через готовые слои: natal planets readiness/provider output → `calculateNatalAspects()` → `formatNatalAspectList()` / `summarizeNatalAspects()`;
- section collapsed by default, раскрывается только по кнопке `Показать`, сворачивается по `Скрыть` и сбрасывается при смене профиля / выборе `Общий день`;
- если natal planets не ready, UI показывает fallback `Пока недоступны.` и `Сначала нужен расчет натальных планет.`;
- при ready profile UI показывает summary и, после раскрытия, formatted natal aspect rows без интерпретаций;
- raw birth data, UTC datetime, raw timezone, coordinates, raw planet longitudes, raw aspect angle, `allowedOrb`, technical source, houses, ASC / MC, transits and interpretations не выводятся;
- `+ Добавить профиль`, list mode, edit/create flow и collapsible `Натальные планеты` не должны ломаться;
- PWA cache поднят до `lunar-calendar-v69`;
- aspect engine, provider calculations, package files, ephemeris data, houses, ASC / MC, transits and interpretations не менялись.

Следующий шаг — Task 8.6, Natal Aspects Debug. Не начинать Task 8.6 без отдельной команды пользователя.

Результат Task 8.6:

- добавлен helper `src/natalAspectsDebug.js`;
- добавлен `test/natalAspectsDebug.test.js`;
- `?debug=1` теперь включает safe section `Natal Aspects UI Debug`;
- debug показывает только active profile id/name, panel status, enabled/disabled state, natal planets readiness, aspect engine status, major-only aspect set, configured orb policy, aspect counts, collapsible default, `My Cards` location и still-not-supported flags;
- missing fields и warnings выводятся только human-readable labels/copy;
- debug не выводит raw birth data, UTC datetime, raw timezone, coordinates, raw planet longitudes/speeds, raw aspect angles, `allowedOrb`, full planet/aspect list, houses, ASC / MC, transits или interpretations;
- user-facing natal aspects UI, aspect engine, provider calculations, package files, ephemeris data, houses, ASC / MC, transits and interpretations не менялись;
- PWA cache поднят до `lunar-calendar-v70`.

Task 8.7 выполнена как финальный hardening Sprint 8.

Результат Task 8.7:

- завершен финальный hardening Sprint 8;
- подтверждено, что Task 8.1–8.6 закрыты;
- подтверждено, что natal aspects считаются только для active saved profile после ready natal planets и через major-only `src/natalAspectEngine.js` с orb policy из `NATAL_ASPECTS_STRATEGY.md`;
- подтверждено, что `Общий день`, not-ready natal planets, failed UTC conversion, unknown birth time, missing / invalid timezone и DST ambiguous / nonexistent fail-closed states не показывают natal aspects;
- подтверждено, что aspect engine pure, не импортирует provider/profile/DOM/UI, не считает transits, houses, ASC / MC, minor aspects или interpretations, applying / separating остаются `null`;
- подтверждено, что fixture validation использует synthetic/manual fixtures без private user data, а expected values не генерируются самим engine;
- подтверждено, что UI/debug не показывают raw birth data, UTC datetime, raw timezone, coordinates, full profile JSON, raw planet longitudes/speeds, raw aspect angles или `allowedOrb`;
- подтверждено, что `Натальные аспекты` находятся внутри `Мои карты`, collapsed by default, раскрываются только по клику и не ломают `Натальные планеты`, list mode, `+ Добавить профиль` или edit/create flow;
- подтверждено, что runtime imports используют tracked `src/vendor/luxon.mjs` и `src/vendor/astronomy-engine.mjs`, а PWA cache остается `lunar-calendar-v70`;
- package files, dependencies, provider calculations, ephemeris data и generator не менялись.

Sprint 8 завершен. Следующий этап — Sprint 9, Essential Dignities Foundation. Task 9.1, Task 9.2, Task 9.3, Task 9.4, Task 9.5, Task 9.6 и Task 9.7 завершены; активная следующая задача — Task 9.8, Sprint 9 Hardening.

Результат Task 7.1:

- создан `NATAL_PLANETS_UI_STRATEGY.md`;
- подтверждено, что `astronomy-engine@2.1.19` validated provider layer готов для selected UTC fixtures;
- подтверждено, что ordinary saved profiles пока не могут безопасно дать provider-ready UTC input;
- `src/birthDateTime.js` по-прежнему возвращает `canConvertToUtc: false` и `utcDateTime: null`;
- user-facing natal planet values для обычных профилей сейчас показывать нельзя;
- первый UI должен быть readiness-only, предпочтительно внутри `Мои карты` / profile details;
- Task 7.4 остается blocked until UTC readiness is solved.

Результат Task 7.2:

- добавлен `src/natalPlanetDisplay.js`;
- добавлен `test/natalPlanetDisplay.test.js`;
- helper форматирует только уже переданные planet positions и не вызывает provider / profile / UI code;
- базовый формат: `Солнце — Телец 15°30′`;
- retrograde marker: `R`, например `Меркурий R — Телец 15°30′`;
- invalid / incomplete planet objects безопасно отбрасываются;
- houses, ASC / MC, transits, aspects, orbs, natal chart UI и user-facing natal values не добавлялись.

Результат Task 7.3:

- добавлен compact readiness-only блок `Натальные планеты` внутри панели `Мои карты`;
- блок скрыт для `Общий день` и показывается только при активном сохраненном профиле;
- блок сообщает, что натальные планеты пока недоступны для показа;
- missing fields отображаются только человекочитаемыми labels: `дата рождения`, `время рождения`, `часовой пояс рождения`, `координаты места рождения`;
- raw birthDate, birthTime, latitude, longitude, full profile JSON и actual natal planet values не показываются;
- `src/birthDateTime.js` остается blocker: `canConvertToUtc: false`, `utcDateTime: null`;
- user-facing natal planet values, natal chart UI, houses, ASC / MC, transits, aspects и orbs не добавлялись;
- PWA cache обновлен до `lunar-calendar-v61`.

Результат Task 7.4a:

- создан `BIRTH_TIME_UTC_STRATEGY.md`;
- подтверждено, что `src/birthDateTime.js` намеренно оставляет `canConvertToUtc: false` и `utcDateTime: null`;
- подтверждено, что native `Date` нельзя использовать для conversion arbitrary `birthPlace.timezone`, потому что он опирается на host/device timezone или явно заданный UTC offset;
- рассмотрены native `Intl`, native `Temporal`, `luxon`, `date-fns-tz`, `moment-timezone` и Temporal polyfill;
- recommended path: `luxon` как первый local-only timezone conversion candidate для Sprint 7, но только после explicit dependency approval;
- Task 7.4 остается blocked until UTC conversion implementation and tests pass;
- код приложения, provider, UI, package files и user-facing natal planet values не менялись.

Результат Task 7.4b:

- установлена approved dependency `luxon@3.7.2`;
- browser ESM runtime Luxon завендорен в tracked path `src/vendor/luxon.mjs` с license notice `src/vendor/luxon.LICENSE.md`, чтобы static GitHub Pages не зависел от ignored `node_modules`;
- `src/birthDateTime.js` теперь конвертирует safe local birth date/time/timezone в UTC ISO через Luxon;
- при успешной конверсии `createBirthDateTimeInput(profile)` возвращает `status: "ready"`, `canConvertToUtc: true`, `utcDateTime`;
- поддержаны и протестированы `Europe/Moscow` modern / historical cases и normal `America/New_York` case;
- unknown birth time, missing/invalid date/time/timezone остаются `incomplete`;
- ambiguous DST overlap и nonexistent DST gap fail closed: UTC не создается, warning объясняет проблему;
- houses / ASC / MC, transits, aspects, orbs, natal chart UI и user-facing natal planet values не добавлялись.
- PWA cache обновлен до `lunar-calendar-v64`.

Результат Task 7.4:

- добавлена read-only панель натальных планет внутри `Мои карты`;
- добавлен `src/natalPlanetsForProfile.js`, который требует safe `canConvertToUtc: true`, вызывает validated `astronomy-engine` provider и форматирует output через `src/natalPlanetDisplay.js`;
- planet list показывается только для активного сохраненного профиля с готовым UTC input и provider status `ready`;
- отсутствие координат места рождения не блокирует список планет;
- unknown birth time, missing timezone, invalid input, ambiguous DST overlap и nonexistent DST gap оставляют readiness fallback и не показывают планеты;
- UI показывает только label / sign / degree-minutes / `R` marker и не показывает raw birth data, `utcDateTime`, raw timezone, coordinates, raw longitude или speed;
- `astronomy-engine` runtime завендорен в tracked path `src/vendor/astronomy-engine.mjs` с notice `src/vendor/astronomy-engine.LICENSE.md`, чтобы static GitHub Pages не зависел от ignored `node_modules`;
- houses / ASC / MC, transits, aspects, orbs, natal chart UI и personal ritual scoring не добавлялись;
- после ручной проверки исправлен state regression панели `Мои карты`: открытие панели возвращает list mode, а выбор `Общий день` или сохраненного профиля закрывает create/edit form state;
- кнопка `+ Добавить профиль` снова видна в list mode;
- после UX-polish список натальных планет свернут по умолчанию, показывает summary и раскрывается только по явному клику;
- переключение профиля или выбор `Общий день` сбрасывает раскрытие в collapsed state;
- Task 7.5 добавила safe `Natal Planets UI Debug` в `?debug=1` с status/counts/capabilities без raw birth data, UTC input, timezone values, coordinates, raw planet longitudes, speed values или full planet list;
- Task 7.6 завершила Sprint 7 hardening: подтверждено, что Task 7.1–7.5 закрыты, provider values показываются только при safe readiness, raw birth data не выводится, а houses / ASC / MC / transits / natal aspects / orbs остаются not supported;
- синхронизированы `NATAL_PLANETS_UI_STRATEGY.md` и `NATAL_PROVIDER_VALIDATION_REPORT.md` с фактом, что Sprint 7 включает narrow read-only `Мои карты` planet panel;
- PWA cache обновлен до `lunar-calendar-v67`.

Текущий следующий шаг:

```txt
Task 13.6 — Mean Lilith Engine / Fixtures
```

Sprint 8 завершен. Task 8.1, Task 8.2, Task 8.3, Task 8.4, Task 8.5, Task 8.6 и Task 8.7 завершены. Sprint 9 завершен: Task 9.1, Task 9.2, Task 9.3, Task 9.4, Task 9.5, Task 9.6, Task 9.7 и Task 9.8 закрыты. Sprint 10 закрыт: Task 10.1, Task 10.2, Task 10.3a, Task 10.3b, Task 10.3c, Task 10.4, Task 10.5, Task 10.5b, Task 10.5c, Task 10.5d, Task 10.6, Task 10.7a, Task 10.7b, Task 10.7c, Task 10.7d, Task 10.8, Task 10.9, Task 10.8b, Task 10.8c, Task 10.8d, Task 10.8d-fix, Task 10.8e, Task 10.8f, Task 10.9b, Task 10.10, Task 10.11 и Task 10.12 закрыты. Sprint 11 закрыт: Task 11.1 закрыла Houses / ASC / MC strategy docs, Task 11.2 добавила Birth Input / Coordinates Guardrails, Task 11.3 добавила ASC / MC Calculation Engine, Task 11.4a закрыла House Systems Strategy / Dependency Audit, Task 11.4b добавила Whole Sign Houses Engine, Task 11.4c добавила Equal House Engine, Task 11.4d добавила Placidus integration gate, Task 11.4d2 активировала Placidus calculation через статические benchmark fixtures, Task 11.4e добавила House System Resolver / Selected System Router, Task 11.5 добавила Houses Validation / Fixtures for Whole Sign / Equal House / Placidus, Task 11.6 добавила Planet-in-House Assignment, Task 11.7 добавила Houses / ASC / MC Display Helper, Task 11.8 добавила collapsible `Дома и углы карты` UI block, Task 11.8b добавила ручной ввод координат места рождения, Task 11.8c проверила Placidus ready state and added duplicate-cusp regression tests, Task 11.9 добавила safe Houses / ASC / MC debug, а Task 11.10 завершила final Sprint 11 hardening. Sprint 12 закрыт: Task 12.1 добавила strategy docs and formula policy; Task 12.2 добавила canonical house cusp output layer and fixtures; Task 12.3 добавила day/night chart status engine and fixtures; Task 12.4 добавила Pars Fortuna engine and fixtures; Task 12.5 добавила Arabic Parts formula dataset/source decision; Task 12.5b verified Lot of Spirit as the second active formula row; Task 12.6 added Basic Arabic Parts engine and fixtures for active verified formulas only; Task 12.7 added Lots / Arabic Parts house assignment for active verified lots; Task 12.8 added Lots / Arabic Parts display helper for already calculated results; Task 12.9 added the user-facing Arabic Parts UI block; Task 12.10 added safe Arabic Parts debug; Task 12.11 completed final Sprint 12 hardening with no code fixes needed. Sprint 13 начат: Task 13.1 added Special Points strategy docs; Lunar Nodes are the active target, Lilith and Selena are source-gated, no fake points / formulas from memory / interpretations are allowed; Task 13.3 added the mean Lunar Nodes engine and fixtures; Task 13.4 added Lunar Nodes house assignment for North/South Nodes against canonical house cusps; Task 13.5 selected Mean Black Moon Lilith / Mean Lunar Apogee as source-verified-for-implementation and did not add a Lilith engine; следующая активная задача — Task 13.6 — Mean Lilith Engine / Fixtures.

Ниже сохраняется краткая история предыдущего Sprint 5 и результаты текущего Sprint 6.

Результат Sprint 5:

- построить расчетную основу для настоящей натальной астрологии;
- выбрать надежный путь natal engine до появления natal UI;
- не показывать фейковые натальные планеты, дома, ASC / MC, personal transits или orbs;
- явно возвращать `notSupported`, если расчет пока не подключен или не доказан тестами.

Завершенная задача:

```txt
Task 5.8 — Sprint 5 Hardening
```

Результат Task 5.8:

- проверены Task 5.1–5.7 и закрыт Sprint 5;
- production UI не показывает fake natal calculations, natal chart, planet table, house table, ASC / MC values, personal transits или orbs;
- debug показывает safe capability/provider state и не выводит raw birth data или full profile JSON;
- `natalEngine`, `birthDateTime` и `planetaryPositionProvider` сохраняют explicit `notSupported` / false capabilities для unsupported features;
- real planetary provider еще не подключен;
- package/dependency changes, `ephemeris-data.js`, generator, natal planets, houses, ASC / MC и transits не добавлялись.

Завершенная задача:

```txt
Task 6.1 — Provider Research and Decision
```

Результат Task 6.1:

- создан `NATAL_PROVIDER_RESEARCH.md`;
- сравнили `astronomy-engine`, `circular-natal-horoscope-js`, `astronomia`, Swiss Ephemeris browser/WASM options, текущий Node/build-time `swisseph`, server-side option и hybrid option;
- recommended provider path: hybrid approach;
- лучший первый candidate для будущего approval review: `astronomy-engine` для local natal planet positions;
- dependency/provider не добавлены;
- user-facing natal values по-прежнему не показываются.

Завершенная задача:

```txt
Task 6.2 — Fixture Strategy and Public Test Fixtures
```

Результат Task 6.2:

- создан `NATAL_FIXTURE_STRATEGY.md`;
- добавлен `test/fixtures/natalProviderFixtures.js` с synthetic pending fixtures;
- добавлены fixture categories: `modern`, `historical`, `moonSensitive`, `timezoneSensitive`, `unknownBirthTime`, `missingCoordinates`;
- добавлен `test/natalProviderFixtures.test.js`;
- expected planetary values остаются `null` с `expectedStatus: pending-provider-approval`;
- private user data, реальные profiles, provider, dependencies, package changes и natal calculations не добавлялись.

Завершенная задача:

```txt
Task 6.3 — Provider Adapter Contract
```

Результат Task 6.3:

- добавлен `src/natalProviderAdapter.js`;
- production default adapter возвращает `notSupported`;
- adapter contract умеет проверять capabilities и safe runner нормализует только явно возвращенные mock planet data;
- mock-ready path покрыт тестами через test-only adapter;
- real provider, dependencies, package changes и реальные natal calculations не добавлялись.

Завершенная задача:

```txt
Task 6.4a — Provider Approval Review
```

Результат Task 6.4a:

- создан `NATAL_PROVIDER_APPROVAL_REVIEW.md`;
- основной candidate review выполнен для `astronomy-engine`;
- recommendation: `astronomy-engine` выглядит лучшим первым локальным кандидатом для natal planet positions;
- approval status остается `pending`;
- dependency/provider не добавлены;
- `package.json` / `package-lock.json` не менялись;
- реальные natal planets, houses, ASC / MC, transits, aspects и orbs не рассчитывались.

Текущая активная задача:

```txt
Task 6.4b — Approved Provider Integration
```

Task 6.4b stage 1 выполнен в узком approved scope:

- установлен `astronomy-engine@2.1.19`;
- добавлен изолированный модуль `src/astronomyEngineProvider.js`;
- добавлен `test/astronomyEngineProvider.test.js`;
- source/privacy audit установленного package не нашел executable `fetch`, `XMLHttpRequest`, `WebSocket` или executable remote URL behavior;
- remote URLs найдены только как documentation/comment/package metadata references;
- API path candidates определены: `SunPosition(date).elon`, `EclipticGeoMoon(date).lon`, `GeoVector(body, date, true) -> Ecliptic(vector).elon`;
- API path еще не reference-fixture validated, поэтому provider не должен давать user-facing natal values;
- user-facing natal values, natal chart UI, houses, ASC / MC, transits и orbs не добавлялись.

Task 6.5 выполнен в ограниченном provider-layer scope:

- `src/astronomyEngineProvider.js` теперь считает candidate geocentric tropical ecliptic longitudes для Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune и Pluto;
- для Солнца используется `SunPosition(date).elon`;
- для Луны используется `EclipticGeoMoon(date).lon`;
- для остальных планет используется `GeoVector(body, date, true) -> Ecliptic(vector).elon`;
- smoke validation проверяет finite normalized longitude, sign, degree и minutes;
- `natalEngine` production path остается `notSupported`, пока fixture expected values не утверждены;
- user-facing natal values, natal chart UI, houses, ASC / MC, transits и orbs не добавлялись.

Task 6.5b выполнен как reference validation:

- reference source: локальный `swisseph` dev dependency, только в Node tests;
- добавлен `test/fixtures/natalProviderReferenceFixtures.js`;
- добавлен `test/natalProviderReferenceValidation.test.js`;
- проверены UTC fixtures: `2000-01-01T12:00:00.000Z`, `1900-06-15T00:00:00.000Z`, `2026-05-15T10:33:00.000Z`, `1985-11-03T06:30:00.000Z`;
- tolerances: `0.25°` для Sun/planets и `0.5°` для Moon;
- astronomy-engine natal planet longitude API прошел selected UTC reference validation для 10 основных планет;
- candidate natal planet longitudes are fixture-validated for selected UTC fixtures; user-facing natal UI remains disabled;
- houses, ASC / MC, transits, aspects, orbs, retrograde и speed остаются not supported / not approved.

Task 6.6 выполнен как provider-layer speed / retrograde validation:

- `src/astronomyEngineProvider.js` теперь возвращает longitude speed в градусах в сутки для 10 основных natal planets;
- speed считается central difference по уже validated geocentric tropical longitude path;
- wrap-around 0/360 обрабатывается signed delta в диапазоне `-180..180`;
- retrograde определяется как `speed < 0`;
- reference source: local `swisseph` dev dependency, только в Node tests;
- Swiss Ephemeris speed flags: `SEFLG_SWIEPH | SEFLG_SPEED`;
- добавлены Mercury / Venus retrograde-sensitive UTC fixtures;
- speed validation прошла для selected UTC fixtures;
- user-facing natal UI остается disabled;
- houses, ASC / MC, transits, aspects и orbs остаются not supported.

Task 6.7 выполнен как safe provider debug / validation report:

- создан `NATAL_PROVIDER_VALIDATION_REPORT.md`;
- добавлен `src/natalProviderValidationSummary.js` с безопасным summary без расчетов и без birth/profile data;
- debug-панель при `?debug=1` получила секцию `Natal Provider Validation`;
- секция показывает provider/version, validation statuses, fixture count, validated bodies, max deltas и unsupported feature labels;
- debug не показывает actual planet longitudes, private birth data, full profile JSON или active-profile natal values;
- user-facing natal UI остается disabled;
- houses, ASC / MC, transits, aspects, orbs и personal ritual scoring остаются not supported;
- PWA cache обновлен до `lunar-calendar-v60`.

Завершенная задача:

```txt
Task 6.8 — Sprint 6 Hardening
```

Task 6.8 выполнена как финальный hardening Sprint 6:

- проверены результаты Task 6.1–6.7;
- подтверждено, что provider-layer validation для `astronomy-engine@2.1.19` закрывает longitude, speed и retrograde для selected UTC fixtures;
- user-facing natal values остаются disabled;
- natal chart UI не добавлен;
- houses, ASC / MC, personal transits, natal aspects, orbs и personal ritual scoring остаются not supported;
- debug показывает только safe validation summary и не выводит private birth data, active-profile planet values или full profile JSON;
- `npm audit --omit=dev` остается clean;
- dev-only `swisseph` audit findings сохранены как отдельный future security follow-up;
- `ephemeris-data.js` и `scripts/generate-ephemeris.cjs` не менялись.

Sprint 6 завершен.

Sprint 6 результат:

- выбрать надежный путь для реального natal provider;
- проверить privacy, license, browser/PWA compatibility и bundle impact;
- определить fixture strategy до любых user-facing natal values;
- сохранить explicit `notSupported` для всего, что provider не умеет или что еще не подтверждено тестами.

Важно:

- dependency/provider не добавлять без отдельного approval;
- natal chart UI не делать;
- houses, ASC / MC, personal transits и orbs не считать;
- private birth data не использовать в fixtures.

Завершенная задача:

```txt
Task 5.7 — Natal Calculation Debug / Fixtures
```

Результат Task 5.7:

- `src/debugPanel.js` получил секцию `Natal Engine Debug` для `?debug=1`;
- debug показывает engine/provider status, provider reason, unsupported natal feature flags и safe active-profile readiness labels;
- `Natal Engine Debug` не показывает `birthDate`, `birthTime`, raw place objects, raw coordinates, full profile JSON или fake natal/transit claims;
- добавлен `test/fixtures/natalFixtures.js` с test-only mock provider для future-ready natal engine проверок;
- production path остается `notSupported`, mock fixture не используется обычным provider path;
- PWA cache обновлен до `lunar-calendar-v58`;
- real provider, dependencies, package changes, normal UI, natal planets, houses, ASC / MC, transits и ephemeris changes не добавлялись.

Завершенная задача:

```txt
Task 5.6 — Natal Planets MVP / NotSupported Integration
```

Результат Task 5.6:

- `src/natalEngine.js` интегрирован с `src/planetaryPositionProvider.js`;
- `calculateNatalChart(input, options)` теперь вызывает planetary provider только после проверки incomplete input;
- incomplete input short-circuit возвращает `incomplete` и не вызывает provider;
- provider `notSupported` передается как natal chart `notSupported` с provider reason;
- future-ready branch покрыт тестом через mock provider injection: ready result строится только из явно переданных mock planets;
- planets остаются `[]`, capabilities остаются false при реальном not-connected provider;
- houses, ASC / MC, transits, real provider, dependencies, package changes, UI, эфемериды и fake natal values не добавлялись.

Завершенная задача:

```txt
Task 5.5 — Planetary Position Provider MVP
```

Результат Task 5.5:

- добавлен `src/planetaryPositionProvider.js`;
- provider interface содержит статусы `ready`, `incomplete`, `notSupported`, `error`;
- определены 10 основных natal planet keys: Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto;
- `getPlanetaryProviderCapabilities()` возвращает provider `null`, status `notSupported` и все capabilities `false`;
- `validatePlanetaryProviderInput()` проверяет `utcDateTime`, `zodiac: tropical` и allowed body keys;
- `getPlanetaryPositions()` возвращает `incomplete` для invalid input и `notSupported` для valid-looking input, потому что runtime provider не подключен;
- `normalizePlanetaryPosition()` нормализует только явно переданные позиции и не рассчитывает longitudes;
- добавлен `test/planetaryPositionProvider.test.js`;
- provider не интегрировался в `natalEngine`, чтобы сохранить минимальный diff и не менять поведение engine до Task 5.6;
- package.json, зависимости, UI, `app.js`, `index.html`, `sw.js`, эфемериды, натальные планеты, дома, ASC / MC и транзиты не добавлялись.

Завершенная задача:

```txt
Task 5.4 — Birth DateTime / Timezone Strategy
```

Результат Task 5.4:

- добавлен `src/birthDateTime.js`;
- helper вручную парсит `YYYY-MM-DD` и `HH:mm` без timezone-shifting `Date` parsing;
- `normalizeTimezone()` trim-ит timezone и проверяет IANA id через `Intl.DateTimeFormat`, если это доступно;
- `createBirthDateTimeInput()` возвращает `incomplete` для missing/invalid date, required time или timezone;
- known local date/time/timezone не превращаются в fake UTC: `canConvertToUtc: false`, `utcDateTime: null`, status `notSupported`;
- unknown birth time дает warning, что ASC / MC и дома недоступны;
- добавлен `test/birthDateTime.test.js`;
- UI, `app.js`, `index.html`, `sw.js`, зависимости, эфемериды, натальные планеты, дома, ASC / MC и транзиты не добавлялись.

Завершенная задача:

```txt
Task 5.3 — Add Natal Chart Data Model and Engine Interface
```

Результат Task 5.3:

- добавлен `src/natalChartModel.js`;
- добавлен `src/natalEngine.js`;
- natal chart result model поддерживает статусы `ready`, `incomplete`, `notSupported`, `error`;
- feature capabilities явно покрывают `planets`, `houses`, `ascMc`, `aspects`, `transits`;
- `calculateNatalChart()` пока возвращает только `incomplete` или explicit `notSupported`, потому что provider не подключен;
- планеты, дома, ASC / MC, аспекты и транзиты не рассчитывались и не генерировались.

Завершенная задача:

```txt
Task 5.2 — Add Astrology Math Primitives
```

Результат Task 5.2:

- добавлен `src/astroMath.js`;
- helper содержит pure functions для degree normalization, zodiac sign lookup, degree-in-sign, angular distance, major aspect detection, aspect-between-longitudes и degree formatting;
- invalid numeric input не возвращает `NaN`: calculation helpers возвращают `null`, `formatDegree()` возвращает stable empty structure;
- добавлен `test/astroMath.test.js`;
- UI, profiles, ephemeris data, `swisseph`, houses, ASC / MC, personal transits и зависимости не добавлялись.

Завершенная задача:

```txt
Task 5.1 — Natal Engine Audit and Decision
```

Результат Task 5.1:

- создан `NATAL_ENGINE_STRATEGY.md`;
- подтверждено, что текущий `swisseph` — Node/build-time native binding, а не browser/PWA runtime engine;
- подтверждено, что `src/ephemeris-data.js` содержит current-dashboard events на 2026–2030 годы, а не произвольные natal positions;
- подтверждено, что сейчас нельзя надежно считать натальные планеты, дома, ASC / MC или персональные транзиты;
- выбран recommended engine path: hybrid approach — сохранить текущие generated dashboard events, добавить pure math primitives и strict natal engine interface, а local browser-compatible provider подключать позже только после отдельного approval.

Do not start yet:

- natal chart UI;
- house table;
- ASC / MC display;
- personal transits;
- synastry;
- geocoding API;
- backend / cloud sync.

Ключевой риск:

```txt
Do not fake natal calculations.
```

Завершенная задача:

```txt
Task 4.1 — Personal Astrology Strategy and Data Audit
```

Главный риск:

```txt
Pseudo-precision: нельзя показывать личные расчеты, которые проект фактически не умеет надежно считать.
```

Результат Task 4.1:

- создан `PERSONAL_ASTROLOGY_STRATEGY.md`;
- зафиксировано, что текущие точные данные покрывают общий момент 2026–2030, а не произвольные даты рождения;
- подтверждено, что сейчас нет надежного расчета натальных планет, домов, ASC / MC, Moon in natal house или персональных транзитов;
- рекомендованный Sprint 4 MVP — readiness / context слой без фейковых персональных расчетов.

Завершенная задача:

```txt
Task 4.2 — Profile Calculation Input Adapter
```

Результат Task 4.2:

- добавлен `src/personalProfileInput.js`;
- helper готовит selected profile или `Общий день` к будущему personal calculation flow;
- возвращаются readiness-флаги, `missingFields`, warnings и explicit capabilities;
- все возможности натальных планет, домов, ASC / MC, Moon in natal house, personal transits, transit orbs и personal ritual scoring честно отключены;
- UI, `app.js`, `index.html`, `sw.js`, эфемериды и storage не подключались.

Завершенная задача:

```txt
Task 4.3 — Personal Readiness / Context MVP
```

Результат Task 4.3:

- добавлен `src/personalContext.js`;
- helper строит безопасный контекст для будущего блока `Лично для меня` на основе `src/personalProfileInput.js`;
- возвращаются `hasActiveProfile`, `profileName`, `title`, `status`, `summary`, `readiness`, `limitations`, `nextSteps`, `missingFields`, `warnings`, `capabilities`;
- поддерживаются статусы `general`, `incomplete`, `readyForContext`, `calculationLimited`;
- для полного профиля показывается честное ограничение: натальные дома, ASC / MC и персональные транзиты пока не рассчитываются;
- UI, `app.js`, `index.html`, `sw.js`, storage, эфемериды, натал, дома, ASC / MC и транзиты не подключались.

Завершенная задача:

```txt
Task 4.4 — Dashboard Block `Лично для меня`
```

Результат Task 4.4:

- добавлен компактный dashboard-блок `Лично для меня`;
- блок расположен после карточки `Профиль` и перед `Режим`, не выше `Луна без курса` и `Осторожно сегодня`;
- при `Общий день` блок скрыт;
- при выбранном профиле блок показывает `Лично для [имя]`, safe summary и до 3 человеческих строк readiness / limitations;
- `src/app.js` использует active profile из существующего profile storage flow и `createPersonalContext()`;
- `src/profileUi.js` форматирует block view и переводит missing field keys в человеческие строки;
- birth date, birth time, coordinates, full profile JSON и технические ключи не выводятся в блоке;
- натал, дома, ASC / MC, Moon in natal house, персональные транзиты, орбы и personal ritual scoring не добавлялись;
- PWA cache поднят до `lunar-calendar-v53`.

Завершенная задача:

```txt
Task 4.5 — Safe Personal Recommendations MVP
```

Результат Task 4.5:

- добавлен `src/personalRecommendations.js`;
- helper возвращает безопасные списки `goodNow`, `nextSteps`, `cautions` для выбранного профиля;
- блок `Лично для меня` теперь показывает секции `Можно сейчас`, `Нужно добавить` / `Для точного личного расчета`, `Важно`;
- missing fields переводятся в человеческие шаги: координаты места рождения, часовой пояс, дата или время рождения;
- блок честно говорит, что личный натальный расчет пока не подключен, а рекомендации основаны на общем моменте;
- birth date, birth time, coordinates, full profile JSON и технические profile keys не выводятся;
- натал, дома, ASC / MC, Moon in natal house, персональные транзиты, орбы и personal ritual scoring не добавлялись;
- PWA cache поднят до `lunar-calendar-v56`.

Завершенная задача:

```txt
Task 4.6 — Debug Personal Calculations
```

Результат Task 4.6:

- debug-панель при `?debug=1` получила безопасную секцию `Personal Debug`;
- секция показывает `activeProfileId`, `activeProfileName`, `hasActiveProfile`, personal status, profile count, storage/sync/server/geocoding state и `natalEngine: not connected`;
- capabilities для natal planets, houses, ASC / MC и personal transits явно показываются как недоступные;
- missing fields выводятся только человеческими label-ами, без raw birth values;
- `birthDate`, `birthTime`, raw place objects, raw coordinates и полный profile JSON не выводятся;
- натал, дома, ASC / MC, персональные транзиты, орбы и personal ritual scoring не добавлялись;
- PWA cache поднят до `lunar-calendar-v57`.

Завершенная задача:

```txt
Task 4.7 — Sprint 4 Hardening
```

Результат Task 4.7:

- проведена финальная проверка Sprint 4;
- добавлен тестовый guardrail, что `Personal Debug` не присутствует в обычном HTML и остается debug-only;
- подтверждено, что пользовательский UI не показывает фейковые личные расчеты;
- подтверждено, что debug не выводит birth date, birth time, raw coordinates или полный profile JSON;
- натал, дома, ASC / MC, персональные транзиты, орбы, geocoding, backend и cloud sync не добавлялись.

Sprint 4 завершен:

```txt
Personal Moment Foundation / Лично для меня
```

Следующий этап:

```txt
Sprint 5 — Natal Calculation Engine Foundation.
```

Активная задача:

```txt
Task 5.1 — Natal Engine Audit and Decision
```

Завершенная задача:

```txt
Task 3.1 — Add Profile Data Model
```

Что выполнено:

- добавлен `src/profileModel.js`;
- добавлены helpers `createProfileId()`, `createProfileDraft()`, `getDefaultProfileSettings()`, `normalizeProfile()`, `validateProfile()`, `isValidProfile()`;
- зафиксированы allowed values для точности времени рождения, системы домов, зодиака и режима текущего места;
- defaults остаются московскими и local-first;
- добавлены тесты `test/profileModel.test.js`.

Завершенная задача:

```txt
Task 3.2 — Add Local Profile Storage
```

Что выполнено:

- добавлен `src/profileStorage.js`;
- профили сохраняются локально в `astroPwa.profiles.v1`;
- active profile id сохраняется локально в `astroPwa.activeProfileId.v1`;
- битый JSON, non-array storage и невалидные профили безопасно отфильтровываются;
- удаление активного профиля сбрасывает active profile в `Общий день`;
- добавлены тесты `test/profileStorage.test.js`.

Завершенная задача:

```txt
Task 3.3 — Add Profiles UI Shell / “Мои карты”
```

Что выполнено:

- добавлен компактный блок `Профиль` на главный экран;
- блок расположен после `Осторожно сегодня` и перед `Режим`;
- добавлена раскрываемая inline-секция `Мои карты`;
- секция показывает `Общий день`, имена сохраненных профилей, empty state и privacy copy;
- кнопка `+ Добавить профиль` пока disabled и указывает, что добавление профиля — следующий шаг;
- добавлен helper `src/profileUi.js`;
- `src/app.js` читает profiles через `loadProfiles()`, но не делает active profile selector;
- PWA cache поднят до `lunar-calendar-v43`.

Завершенная задача:

```txt
Task 3.4 — Create Profile Form
```

Что выполнено:

- кнопка `+ Добавить профиль` открывает inline-форму внутри `Мои карты`;
- форма содержит имя, дату рождения, время рождения, точность времени, место рождения, timezone, систему домов и зодиак;
- для текущего места расчета используется Москва / Россия / Europe/Moscow;
- при `неизвестно` поле времени рождения отключается и может быть пустым;
- создание профиля идет через `addProfile()` из `src/profileStorage.js`;
- validation errors показываются короткими русскими сообщениями;
- после успешного создания профиль появляется в списке `Мои карты`;
- PWA cache поднят до `lunar-calendar-v44`.

Завершенная задача:

```txt
Task 3.5 — Edit / Delete Profile
```

Что выполнено:

- сохраненные профили в `Мои карты` стали кликабельными;
- клик по профилю открывает inline-форму `Редактировать профиль`;
- форма редактирования предзаполняется данными выбранного профиля;
- сохранение изменений идет через `updateProfile()` из `src/profileStorage.js`;
- удаление профиля идет через `deleteProfile()` после подтверждения `Удалить профиль? Это действие нельзя отменить.`;
- `Общий день` остается non-personal option и не редактируется / не удаляется;
- PWA cache поднят до `lunar-calendar-v45`.

Завершенная задача:

```txt
Task 3.6 — Active Profile Selector
```

Что выполнено:

- блок `Профиль` показывает активное значение: `Общий день` или имя выбранного профиля;
- в `Мои карты` добавлены явные действия `Выбрать` и `Редактировать`;
- `Общий день` можно выбрать как non-personal режим, но нельзя редактировать / удалять;
- выбранный профиль сохраняется через `setActiveProfileId()` и читается через `getActiveProfileId()`;
- если active profile удален или отсутствует, UI возвращается к `Общий день`;
- основные расчеты приложения остаются общими, без персональных транзитов и натала;
- PWA cache поднят до `lunar-calendar-v46`.

Завершенная задача:

```txt
Task 3.7 — Profile Export / Import
```

Что выполнено:

- в панели `Мои карты` добавлен компактный блок `Резервная копия`;
- добавлены локальные действия `Экспорт` и `Импорт`;
- экспорт скачивает JSON-файл `astro-pwa-profiles-YYYY-MM-DD.json`;
- JSON содержит `schemaVersion`, `app`, `exportedAt` и `profiles`;
- импорт читает выбранный `.json` локально через `FileReader`;
- импорт валидирует структуру, фильтрует невалидные profiles и не падает на invalid JSON;
- при конфликте `id` импортируемому профилю генерируется новый `id`, существующий профиль не перезаписывается;
- после импорта список `Мои карты` обновляется и показывается короткий результат;
- добавлен helper `src/profileImportExport.js`;
- PWA cache поднят до `lunar-calendar-v48`.

Завершенная задача:

```txt
Task 3.8 — Privacy Copy and Debug Profile State
```

Что выполнено:

- в `Мои карты` явно показано: `Данные карты хранятся только на этом устройстве.`;
- добавлена строка: `Мы не отправляем дату, время и место рождения на сервер.`;
- backup copy сохранен: `Файл остается у вас. Мы не отправляем данные на сервер.`;
- debug-панель при `?debug=1` показывает безопасную секцию `Profiles`;
- debug `Profiles` показывает только `profilesCount`, `activeProfileId`, `activeProfileName`, `storage`, `sync`, `serverUpload`, `importExport`;
- debug не выводит `birthDate`, `birthTime`, `birthPlace`, координаты, timezone рождения, currentPlace, houseSystem, zodiac или полный profiles dump;
- PWA cache поднят до `lunar-calendar-v49`.

Sprint 3 завершен:

```txt
Profiles / Мои карты
```

Следующий спринт после Sprint 4:

```txt
Sprint 5 — Natal Calculation Engine Foundation
```

Следующий шаг на тот момент:

```txt
Task 5.1 — Natal Engine Audit and Decision
```

В Task 5.1 нужно провести аудит natal engine и создать `NATAL_ENGINE_STRATEGY.md`. Натал UI, дома, ASC / MC, персональные транзиты и фейковые личные расчеты не делать.

В Sprint 4 пока НЕ делается:

- натальная карта;
- персональные транзиты;
- дома;
- ASC / MC;
- Moon in natal houses;
- точные личные рекомендации без доказанной расчетной базы;
- personal ritual scoring;
- synastry;
- cloud sync;
- backend;
- geocoding API;
- автоматическое определение текущего местоположения.

Эти ограничения сохраняются до отдельной задачи, где расчетная надежность будет доказана и покрыта тестами.

---

# Sprint 4 Status

Sprint 4 завершен.

Выполнены:

- Task 4.1 — Personal Astrology Strategy and Data Audit;
- Task 4.2 — Profile Calculation Input Adapter;
- Task 4.3 — Personal Readiness / Context MVP;
- Task 4.4 — Dashboard Block `Лично для меня`;
- Task 4.5 — Safe Personal Recommendations MVP;
- Task 4.6 — Debug Personal Calculations;
- Task 4.7 — Sprint 4 hardening / tests.

---

# Sprint 3 Privacy Focus

Профильные данные считаются чувствительными:

- имя;
- дата рождения;
- время рождения;
- место рождения;
- координаты;
- timezone;
- настройки карты.

Правила Sprint 3:

- local-first;
- не отправлять профильные данные на сервер;
- не добавлять cloud sync;
- не добавлять analytics вокруг birth data;
- не использовать внешние geocoding API без отдельной команды;
- дать возможность удалить профиль;
- предусмотреть экспорт / импорт JSON.

Пользовательский privacy-copy ориентир:

```txt
Данные хранятся на этом устройстве и не отправляются на сервер.
```

---

# Completed Task

## Task 1.1 — Fix VOC Block States and Copy

Статус:

```txt
done
```

Что выполнено:

- карточка снова называется `Луна без курса`;
- если VOC еще не началась, показывается `с HH:mm до HH:mm`;
- если VOC уже идет, показывается `до HH:mm`;
- если данных о ближайшей VOC нет, показывается `нет данных`;
- время в VOC-блоке на главном экране показывается до минут, без секунд;
- строка последнего аспекта использует простую формулировку `после: ...`;
- убраны `Статус Луны`, `Луна в курсе`, `Без курса: ...`, countdown и формулировки вида `... VOC`;
- логика отображения вынесена в `src/vocDisplay.js`;
- PWA-кэш обновлен до `lunar-calendar-v25`.

---

# Completed Task

## Task 1.2 — Add VOC Quality Label

Статус:

```txt
done
```

Цель:

Добавить краткую человеческую оценку фона VOC.

Нужно:

- после гармоничного аспекта: `фон мягкий`;
- после напряженного аспекта: `фон напряженный`;
- после аспекта с Нептуном: `фон размытый`;
- после аспекта с Сатурном: `фон тяжелый`;
- после аспекта с Марсом / Ураном: `фон нервный`.

Приоритет, если совпадает несколько правил:

1. Нептун;
2. Сатурн;
3. Марс / Уран;
4. напряженный аспект;
5. гармоничный аспект.

Ограничения:

- не трогать профили;
- не трогать натальную карту;
- не добавлять персональные транзиты;
- не менять архитектуру без необходимости;
- не переписывать весь главный экран;
- не переходить к следующей задаче без отдельной команды.

Что выполнено:

- после строки `после: ...` добавляется строка `фон ...`;
- приоритет правил: Нептун, Сатурн, Марс / Уран, квадрат / оппозиция, секстиль / трин;
- если данных о последнем аспекте недостаточно, строка фона не показывается;
- текущая упрощенная логика VOC-блока сохранена.

---

# Completed Task

## Task 1.3 — Improve Moon Aspects Block

Статус:

```txt
done
```

Цель:

Доработать блок аспектов Луны.

Нужно:

- заменить подписи на `Последний аспект` и `Следующий аспект`;
- если аспект был вчера, показывать `вчера HH:mm`;
- если сегодня, показывать `сегодня HH:mm`;
- если завтра, показывать `завтра HH:mm`;
- для следующего аспекта показать относительный день и время без обратного отсчета;
- учитывать только мажорные аспекты Луны:
  - соединение;
  - секстиль;
  - квадрат;
  - трин;
  - оппозиция.

Что выполнено:

- подписи заменены на `Последний аспект` и `Следующий аспект`;
- аспекты отображаются как `Квадрат Уран · вчера 22:13`;
- следующий аспект показывает глиф, планету, относительный день и время без countdown;
- если данных нет или аспект не мажорный, отображается `нет данных`;
- форматирование вынесено в `src/moonAspectsDisplay.js`;
- PWA-кэш обновлен до `lunar-calendar-v22`.

---

# Completed Task

## Task 1.4 — Add Moon Aspect Interpretation

Статус:

```txt
done
```

Добавить короткую интерпретацию аспекта по тапу или через компактный раскрывающийся блок.

Примеры:

```txt
Луна ✶ Меркурий: хорошо для раскладов, разговоров, формулировок, записей, диагностики.
```

```txt
Луна □ Уран: нервное поле, внезапности, лучше не принимать резких решений.
```

Правило:

Интерпретации не должны быть разбросаны по DOM-коду. Лучше вынести их в словарь или helper.

Что выполнено:

- в блок `Аспекты Луны` добавлена кнопка `?`;
- по нажатию раскрывается компактная интерпретация следующего аспекта Луны;
- тексты и fallback-правила живут в `src/moonAspectsDisplay.js`;
- если данных о следующем мажорном аспекте нет, подсказка не раскрывается;
- PWA-кэш обновлен до `lunar-calendar-v23`.

---

# Completed Task

## Task 1.5 — Improve Field Quality Block

Статус:

```txt
done
```

Сделать `Качество поля` более точным и динамическим.

Варианты фраз:

- `Поле устойчивое: хорошо для закрепления результата.`
- `Поле тонкое: хорошо для интуиции, Таро и снов.`
- `Поле нервное: возможны резкие реакции и сбои планов.`
- `Поле плотное: хорошо для телесных практик, защиты и стабилизации.`
- `Поле очищающее: хорошо завершать, убирать и отсекать лишнее.`
- `Поле размытое: осторожно с обещаниями, договорами и ожиданиями.`
- `Поле денежное: хорошо для практик на ресурс, клиентов и устойчивый доход.`

Добавить строку:

```txt
Главный совет момента
```

Примеры:

- `Лучше закреплять, а не резко менять.`
- `Делать до начала Луны без курса.`
- `Сначала чистка, потом программирование.`

Что выполнено:

- `Качество поля` теперь использует фразы `устойчивое`, `тонкое`, `нервное`, `плотное`, `очищающее`, `размытое`, `денежное`;
- добавлено поле `advice` в результат `getFieldQuality()`;
- на главном экране отображается `Главный совет момента`;
- оценки `Интуиция`, `Материальные дела`, `Ритуалы` сохранены;
- списки `Подходит` / `Не подходит` сохранены;
- PWA-кэш обновлен до `lunar-calendar-v24`.

---

# Completed Task

## Task 1.6 — Add Warnings Block

Статус:

```txt
done
```

Добавить компактный блок:

```txt
Осторожно сегодня
```

Показывать только при реальных красных флагах.

Примеры:

- `VOC с 13:04 — важные запуски лучше сделать до этого времени.`
- `Напряженный аспект Луны к Урану — возможны резкие реакции.`
- `23 лунные сутки — не делать магию из злости.`
- `29 лунные сутки — лучше чистки, не запуск нового.`
- `Луна в Рыбах — риск иллюзий и эмоциональной размытости.`

# Completed Task

## Task 1.7 — Add Moon Precision

Статус:

```txt
done
```

В блок Луны добавить:

- процент освещенности Луны;
- сколько осталось до Новолуния / Полнолуния.

Формат:

```txt
Освещенность: 32%
До Новолуния: 4д 18ч
```

# Completed Task

## Task 1.8 — Add Planetary Hour Hints

Статус:

```txt
done
```

Добавить подсказки по планетарным часам.

Пример:

```txt
Планетарный час — Солнце
Хорошо для: видимости, силы, статуса, намерения, лидерства.
```

Значения:

- Солнце — статус, проявленность, успех, воля.
- Луна — Таро, сны, семья, интуиция, вода.
- Марс — чистки, защита, отсечение, активные действия.
- Меркурий — тексты, переговоры, карты, диагностика.
- Юпитер — деньги, рост, обучение, благословение.
- Венера — отношения, красота, гармония, притяжение.
- Сатурн — защита, границы, структура, долгие обязательства.

# Completed Task

## Task 1.9 — Clean Up Terminology and Visual Clarity

Статус:

```txt
done
```

Исправить терминологию.

Вместо:

```txt
Индикатор дня
```

Использовать:

```txt
Индикаторы
```

Строки:

```txt
Tong Shu: Стабильность
Лунные сутки: Медведь
Ба-цзы: Деревянный Петух
```

Исправить строку Луны.

Вместо:

```txt
Луна в Рыбах в Овен завтра
```

Использовать:

```txt
Луна в Рыбах
Переход в Овен: завтра 03:03
```

На главном экране время округлять до минут.

# Completed Task

## Task 1.10 — Add Hidden Debug Screen

Статус:

```txt
done
```

Добавить скрытый debug screen для разработки.

Показывать:

- текущий часовой пояс;
- выбранная система расчета дня: MSK / 23:00 / Jie Qi;
- земная ветвь месяца;
- земная ветвь дня;
- индикатор Tong Shu;
- источник расчета VOC;
- последний аспект Луны;
- следующий аспект Луны;
- координаты места расчета;
- версия эфемерид.

Цель:

Проверять расхождения между календарями и расчетными школами.

---

# Do Not Start Yet

Не начинать эти блоки, пока главный экран не стабилизирован и задачи не перенесены в `TODO.md`.

## Profiles

Не начинать:

- экран `Профили` / `Мои карты`;
- создание профиля;
- редактирование профиля;
- удаление профиля;
- активный профиль;
- место рождения;
- текущее место расчета;
- система домов;
- настройки зодиака;
- дополнительные точки.

## Personal Astrology

Не начинать:

- персональные транзиты;
- натальные расчеты в блоке `Лично для меня`;
- Луна в доме натала;
- личная оценка ритуалов;
- личный прогноз момента.

## Natal Chart

Не начинать:

- колесо натальной карты;
- таблицу планет;
- таблицу домов;
- аспекты натала;
- особые точки;
- управителей домов.

## Privacy and Backup

Не начинать:

- импорт профиля;
- экспорт профиля;
- backup;
- синхронизацию;
- облачное хранение;
- отправку данных рождения на сервер.

---

# Future Roadmap

Sprint 2 — Modes and Best Windows — завершен.

Sprint 3 — Profiles / Мои карты — завершен.

## Profiles / Мои карты

Добавлен раздел:

```txt
Профили / Мои карты
```

Для каждого профиля хранить:

- имя;
- дата рождения;
- время рождения;
- точность времени;
- место рождения;
- текущее место нахождения;
- система домов;
- зодиак;
- дополнительные точки.

## Sprint 4 — Personal Moment Foundation / Лично для меня

Завершенный спринт. Аудит, profile input adapter, personal context helper, dashboard-блок `Лично для меня`, safe recommendations, personal debug и hardening выполнены.

Не показывать в UI:

- текущие персональные транзиты;
- Луну в доме натала;
- ASC / MC;
- дома;
- личную оценку ритуалов;
- личный прогноз момента.

Эти функции можно добавлять только после доказанного надежного расчета и отдельной задачи в `TODO.md`.

## Sprint 5 — Natal Chart Screen

Добавить экран:

```txt
Натальная карта
```

Состав:

- колесо карты;
- таблица планет;
- таблица домов;
- аспекты;
- ASC;
- MC;
- Лунные узлы;
- Лилит;
- Селена;
- Хирон;
- Парс Фортуны;
- управители 2, 8 и 10 домов.

## Sprint 6 — Privacy, Import, Export

Добавить:

- локальное хранение профилей;
- экспорт профиля;
- импорт профиля;
- удаление профиля;
- резервное копирование;
- запрет отправки данных рождения на сервер без явного согласия.

---

# Working Rules for Codex

Перед каждой задачей Codex должен прочитать:

- `PROJECT_STATE.md`;
- `ARCHITECTURE.md`;
- `TODO.md`;
- релевантные rule-файлы.

Во время задачи:

- выполнять только активную задачу;
- не делать соседние задачи;
- не реализовывать будущие фичи из `MASTER_PLAN.md`;
- не переписывать архитектуру без необходимости;
- делать минимальный безопасный diff;
- не переходить к следующей задаче без команды пользователя.

После задачи:

1. Обновить `TODO.md`.
2. Обновить `PROJECT_STATE.md`.
3. Обновить `CHANGELOG.md`.
4. Оценить, изменилась ли архитектура.
5. Если архитектура изменилась — обновить `ARCHITECTURE.md`.
6. Если архитектура не изменилась — не трогать `ARCHITECTURE.md` и написать почему.
7. Запустить доступные проверки:
   - `npm test`;
   - build command, если есть;
   - lint/typecheck, если есть.
8. Дать отчет:
   - какие файлы изменены;
   - что сделано;
   - как проверить руками;
   - какие риски остались.

---

# Git / Checkpoint Rules

Одна задача = один коммит.

Перед новой задачей желательно проверить:

```bash
git status
```

После успешной задачи:

```bash
git add .
git commit -m "complete task X.X short description"
```

Перед переходом в новый Codex-чат:

1. Обновить:
   - `PROJECT_STATE.md`;
   - `TODO.md`;
   - `CHANGELOG.md`;
   - `ARCHITECTURE.md`, если менялась архитектура.
2. Сделать checkpoint-коммит:

```bash
git add .
git commit -m "checkpoint before continuing in new codex chat"
```

---

# Current Known Risks

## Tong Shu Calibration

Нужно накопить контрольные даты для Tong Shu 建除十二神 по выбранной линии расчета.

## PWA Cache

Установленная iPhone PWA может показывать старую версию, если не поднять `CACHE_NAME`.

Текущая версия:

```txt
lunar-calendar-v72
```

## Moscow Hardcoding

Город сейчас жестко задан как Москва.

Будущий выбор города может затронуть:

- планетарные часы;
- восход / заход Солнца;
- лунные события;
- Tong Shu;
- Ба-цзы;
- ритуальные окна.

## Field Quality Growth

`src/fieldQuality.js` может раздуться, если туда напрямую добавить все режимы.

Если режимов станет много, нужно выносить правила в отдельные словари или helper-модули.

## App Composition Growth

`src/app.js` может стать перегруженным.

Если главный экран продолжит расти, нужно будет выносить:

- display state helpers;
- форматирование блоков;
- словари интерпретаций;
- отдельные UI-модули.

## Future Privacy

Профили и натальные данные чувствительны.

До реализации профилей нужно закрепить privacy-first подход:

- локальное хранение по умолчанию;
- не отправлять дату, время и место рождения на сервер без согласия;
- предусмотреть удаление, импорт и экспорт.

---

# Следующий конкретный шаг

Сейчас следующий конкретный шаг:

```txt
Task 13.6 — Mean Lilith Engine / Fixtures.
```

Перед реализацией Codex должен:

1. Работать строго по `TODO.md`.
2. Работать только над Task 13.6 после отдельной команды пользователя.
3. Объяснить минимальный план изменения.
4. Внести только необходимые изменения.
5. Не начинать Task 13.6 без отдельного явного запроса.
6. После реализации обновить документацию и выполнить проверки, требуемые задачей.

---

# Legacy Note

Предыдущий следующий шаг был:

> Проверить формулировки и веса Качества поля на реальных рабочих днях жены и постепенно уточнить правила интерпретации.

Этот шаг остается важным, но сейчас переносится ниже по приоритету.

Sprint 1, Sprint 2, Sprint 3, Sprint 4, Sprint 5, Sprint 6, Sprint 7 и Sprint 8 завершены. Sprint 7 добавил read-only natal planets panel внутри `Мои карты`: planet values показываются только для активного сохраненного профиля при `canConvertToUtc: true` и ready provider output, форматируются через `src/natalPlanetDisplay.js`, а missing coordinates не блокируют список планет. `Общий день`, unknown birth time, missing/invalid date/time/timezone, ambiguous DST overlap и nonexistent DST gap не показывают planet list. Safe `Natal Planets UI Debug` доступен только через `?debug=1` и показывает status/counts/capabilities без birth data, UTC datetime, raw timezone, coordinates, raw planet longitudes, speed values or full planet list. Sprint 8 — Natal Aspects Foundation завершен: Task 8.1 создала `NATAL_ASPECTS_STRATEGY.md`, Task 8.2 добавила pure `src/natalAspectEngine.js`, Task 8.3 добавила synthetic/manual fixture validation layer, Task 8.4 добавила pure `src/natalAspectDisplay.js`, Task 8.5 добавила collapsible `Натальные аспекты` section внутри `Мои карты`, Task 8.6 добавила safe `Natal Aspects UI Debug`, а Task 8.7 завершила hardening. Sprint 9 — Essential Dignities Foundation завершен: Task 9.1 создала `ESSENTIAL_DIGNITIES_STRATEGY.md`, Task 9.2 добавила source-tracked `src/essentialDignitiesData.js`, Task 9.3 добавила pure lookup engine, Task 9.4 добавила synthetic/manual fixture validation, Task 9.5 добавила pure display helper, Task 9.6 добавила collapsible `Достоинства планет` section внутри `Мои карты`, Task 9.7 добавила safe `Essential Dignities UI Debug`, а Task 9.8 завершила hardening. Sprint 10 — Terms / Decans / Degree Rulers закрыт: Task 10.1, Task 10.2, Task 10.3a, Task 10.3b, Task 10.3c, Task 10.4, Task 10.5, Task 10.5b, Task 10.5c, Task 10.5d, Task 10.6, Task 10.7a, Task 10.7b, Task 10.7c, Task 10.8, Task 10.9, Task 10.8b, Task 10.8c, Task 10.8d, Task 10.8d-fix, Task 10.8e, Task 10.8f, Task 10.9b, Task 10.10, Task 10.11 и Task 10.12 закрыты. Sprint 10 code includes verified `src/termsData.js` + pure `src/terms.js`, verified `src/decansData.js` + pure `src/decans.js`, verified `src/degreeRulersStarOfMagiData.js` + pure `src/degreeRulersStarOfMagi.js`, verified Table 7 `src/degreeRulersVronskyData.js` + pure `src/degreeRulersVronsky.js`, `src/detailedDignityDisplay.js`, `src/detailedDignitiesForProfile.js`, collapsed `Термы, деканы и градусы` UI in `Мои карты`, and safe `Detailed Dignities UI Debug` in `?debug=1`. Sprint 11 закрыт: Task 11.1 закрыла Houses / ASC / MC strategy docs, Task 11.2 добавила Birth Input / Coordinates Guardrails, Task 11.3 добавила ASC / MC Calculation Engine, Task 11.4a закрыла House Systems Strategy / Dependency Audit, Task 11.4b добавила Whole Sign Houses Engine, Task 11.4c добавила Equal House Engine, Task 11.4d добавила Placidus integration gate, Task 11.4d2 активировала Placidus calculation через статические benchmark fixtures, Task 11.4e добавила House System Resolver / Selected System Router, Task 11.5 добавила Houses Validation / Fixtures, Task 11.6 добавила Planet-in-House Assignment, Task 11.7 добавила Houses / ASC / MC Display Helper, Task 11.8 добавила collapsible `Дома и углы карты` UI, Task 11.8b добавила ручной ввод координат места рождения, Task 11.8c проверила Placidus ready state and added duplicate-cusp regression tests, Task 11.9 добавила safe Houses / ASC / MC debug, а Task 11.10 завершила final hardening. Sprint 12 закрыт: Task 12.1 добавила House Cusps / Pars Fortuna / Arabic Parts strategy docs and formula policy; Task 12.2 добавила canonical house cusp output layer and fixtures; Task 12.3 добавила day/night chart status engine and fixtures; Task 12.4 добавила Pars Fortuna engine and fixtures; Task 12.5 добавила Arabic Parts formula dataset/source decision; Task 12.5b verified Lot of Spirit as the second active formula row; Task 12.6 added Basic Arabic Parts engine and fixtures for active verified formulas only; Task 12.7 added Lots / Arabic Parts house assignment for active verified lots; Task 12.8 added Lots / Arabic Parts display helper for already calculated results; Task 12.9 added the user-facing Arabic Parts UI block; Task 12.10 added safe Arabic Parts debug; Task 12.11 closed Sprint 12 after final hardening. Sprint 13 начат: Task 13.1 added Special Points strategy docs; Lunar Nodes are the active target, Lilith and Selena are source-gated, no fake points / formulas from memory / interpretations are allowed. Task 13.3 добавила mean Lunar Nodes engine and fixtures. Task 13.4 добавила Lunar Nodes house assignment для Северного и Южного узлов по canonical cusps. Task 13.5 selected Mean Black Moon Lilith / Mean Lunar Apogee as source-verified-for-implementation and did not add a Lilith engine. Следующая активная задача — Task 13.6 — Mean Lilith Engine / Fixtures.
