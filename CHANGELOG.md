# Changelog

## 2026-05-15 — Complete Task 5.3 natal chart model and engine interface

- Добавлен `src/natalChartModel.js` с neutral result shapes, statuses, feature flags, normalization helpers и `hasNatalFeature()`.
- Добавлен `src/natalEngine.js` со strict provider interface, который сейчас честно возвращает `incomplete` или `notSupported`.
- Добавлены тесты `test/natalChartModel.test.js` и `test/natalEngine.test.js`.
- Provider, UI, зависимости, ephemeris data, houses, ASC / MC, transits и fake natal values не добавлялись.
- Task 5.4 оставлена следующей активной задачей и не начиналась.

## 2026-05-15 — Complete Task 5.2 astrology math primitives

- Добавлен `src/astroMath.js` с pure helpers для нормализации градусов, zodiac sign mapping, degree-in-sign, angular distance, major aspect detection и degree formatting.
- Добавлены тесты `test/astroMath.test.js` для boundary cases, wrap-around, invalid input, major aspects и formatting.
- Модуль не подключен к UI и не использует profiles, ephemeris data, `swisseph`, localStorage или даты.
- Натальный движок, дома, ASC / MC, personal transits и зависимости не добавлялись.
- Task 5.3 оставлена следующей активной задачей и не начиналась.

## 2026-05-14 — Complete Task 5.1 natal engine audit

- Создан `NATAL_ENGINE_STRATEGY.md`.
- Аудит подтвердил, что текущий `swisseph` — Node/build-time native binding и не является browser/PWA runtime engine.
- Подтверждено, что `src/ephemeris-data.js` содержит generated current-dashboard events на 2026–2030 годы, а не arbitrary natal positions, houses, ASC / MC или personal transits.
- Recommended engine path: hybrid approach — текущие generated dashboard events оставить, в Sprint 5 добавить pure math primitives и strict natal engine interface, а local browser-compatible provider подключать позже только после отдельного approval.
- Код приложения, зависимости, `ephemeris-data.js` и generator не менялись.
- Task 5.2 оставлена следующей активной задачей и не начиналась.

## 2026-05-14 — Prepare Sprint 5 documentation

- Sprint 1, Sprint 2, Sprint 3 and Sprint 4 зафиксированы как завершенные.
- Активным спринтом стал `Sprint 5 — Natal Calculation Engine Foundation`.
- В `TODO.md` добавлены Task 5.1–5.8; активная задача — `Task 5.1 — Natal Engine Audit and Decision`.
- В `ASTRO_LOGIC.md` добавлены правила natal calculation foundation: no fake natal values, zodiac mapping, explicit orb/aspect rules, house/ASC/MC limitations and transit requirements.
- В `PRIVACY_RULES.md` добавлены Sprint 5 privacy rules для natal calculation engine work.
- Код приложения не менялся.

## 2026-05-14 — Complete Sprint 4 hardening

- Завершена Task 4.7 — Sprint 4 Hardening.
- Добавлен guardrail-тест, что `Personal Debug` не присутствует в обычном HTML и остается debug-only.
- Подтверждены Sprint 4 boundaries: без натала, домов, ASC / MC, персональных транзитов, орбов, geocoding, backend и cloud sync.
- Sprint 4 закрыт; Sprint 5 не начинался.

## 2026-05-14 — Complete Task 4.6 personal debug safety

- Debug-панель при `?debug=1` получила секцию `Personal Debug`.
- Секция показывает только безопасное состояние профиля: active id/name, status, storage/sync/server/geocoding flags, unavailable capabilities, missing-field labels и warnings.
- Birth date, birth time, raw place objects, raw coordinates, full profile JSON и fake natal/transit claims не выводятся.
- Натал, дома, ASC / MC, персональные транзиты и орбы не добавлялись.
- PWA-кэш обновлен до `lunar-calendar-v57`.
- Task 4.7 оставлена следующей активной задачей и не начиналась.

## 2026-05-14 — Soften personal recommendations copy

- В блоке `Лично для меня` убраны технические user-facing формулировки про `натальный расчетный движок`.
- Summary и пункты `Можно сейчас` / `Для точного личного расчета` / `Важно` стали короче и мягче.
- Readiness / capabilities logic не менялась; Task 4.6 не начиналась.
- PWA-кэш обновлен до `lunar-calendar-v56`.

## 2026-05-14 — Complete Task 4.5 safe personal recommendations MVP

- Добавлен `src/personalRecommendations.js`.
- Блок `Лично для меня` получил безопасные секции `Можно сейчас`, `Нужно добавить` / `Для точного личного расчета` и `Важно`.
- Missing profile fields переводятся в человеческие next steps без технических ключей и sensitive values.
- Copy честно говорит, что личный натальный расчет пока не подключен, а рекомендации основаны на общем моменте.
- Натал, дома, ASC / MC, Moon in natal house, personal transits, transit orbs и personal ritual scoring не добавлялись.
- PWA-кэш обновлен до `lunar-calendar-v55`.
- Task 4.6 оставлена следующей активной задачей и не начиналась.

## 2026-05-14 — Complete Task 4.4 personal dashboard block

- Добавлен компактный dashboard-блок `Лично для меня`.
- Блок скрыт для `Общий день` и показывается только при выбранном сохраненном профиле.
- `src/app.js` подключает `createPersonalContext()` к существующему active profile flow.
- `src/profileUi.js` форматирует safe block view, переводит missing field keys в человеческий текст и ограничивает вывод до 3 строк.
- Birth date, birth time, coordinates, full profile JSON и технические profile keys не выводятся в блоке.
- Натал, дома, ASC / MC, Moon in natal house, personal transits, transit orbs и personal ritual scoring не добавлялись.
- PWA-кэш обновлен до `lunar-calendar-v53`.
- Task 4.5 оставлена следующей активной задачей и не начиналась.

## 2026-05-14 — Complete Task 4.3 personal readiness context MVP

- Добавлен `src/personalContext.js`.
- Helper строит безопасный user-facing context для `Общий день` или выбранного профиля на основе `src/personalProfileInput.js`.
- Возвращаются статусы `general`, `incomplete`, `readyForContext`, `calculationLimited`, summary, readiness, limitations, next steps, `missingFields`, warnings и capabilities.
- Натальные планеты, дома, ASC / MC, personal transits и personal ritual scoring по-прежнему не рассчитываются.
- Добавлены тесты `test/personalContext.test.js`.
- UI, `app.js`, `index.html`, `sw.js`, эфемериды, storage, natal chart и transits не менялись.
- Task 4.4 оставлена следующей активной задачей и не начиналась.

## 2026-05-14 — Complete Task 4.2 profile calculation input adapter

- Добавлен `src/personalProfileInput.js`.
- Adapter принимает selected profile или `null` / `Общий день` и возвращает structured input, readiness flags, `missingFields`, warnings и calculation capabilities.
- Натальные планеты, дома, ASC / MC, Moon in natal house, personal transits, transit orbs и personal ritual scoring явно отключены до появления надежного расчетного движка.
- Добавлены тесты `test/personalProfileInput.test.js`.
- UI, `app.js`, `index.html`, `sw.js`, эфемериды, storage, geocoding и зависимости не менялись.
- Task 4.3 оставлена следующей активной задачей и не начиналась.

## 2026-05-14 — Complete Task 4.1 personal astrology audit

- Создан `PERSONAL_ASTROLOGY_STRATEGY.md`.
- Аудит подтвердил, что текущий `src/ephemeris-data.js` содержит pre-generated current-dashboard events на 2026–2030 годы, а не произвольные natal positions.
- Зафиксировано, что сейчас нельзя надежно считать натальные планеты, дома, ASC / MC, Moon in natal house, персональные транзиты и transit orbs.
- Рекомендованный Sprint 4 MVP: profile calculation input adapter и honest readiness / context layer без фейковых личных расчетов.
- Task 4.2 оставлена следующей активной задачей и не начиналась.
- Код приложения не менялся.

## 2026-05-14 — Prepare Sprint 4 documentation

- Sprint 1, Sprint 2 and Sprint 3 зафиксированы как завершенные.
- Активным спринтом стал `Sprint 4 — Personal Moment Foundation / Лично для меня`.
- В `TODO.md` добавлены Task 4.1–4.7; активная задача — `Task 4.1 — Personal Astrology Strategy and Data Audit`.
- В `PROJECT_STATE.md` зафиксирован главный риск Sprint 4: не показывать псевдоточность и не выдумывать личные расчеты.
- В `PRIVACY_RULES.md` добавлены Sprint 4 privacy rules для personal calculation readiness и debug safety.
- Код приложения не менялся.

## 2026-05-14 — Complete Task 3.8 privacy copy and profile debug state

- В `Мои карты` добавлена явная privacy copy: данные карт хранятся только на устройстве, дата/время/место рождения не отправляются на сервер.
- Backup copy сохранен: `Файл остается у вас. Мы не отправляем данные на сервер.`
- Debug-панель при `?debug=1` получила безопасную секцию `Profiles`.
- `Profiles` debug показывает `profilesCount`, `activeProfileId`, `activeProfileName`, `storage`, `sync`, `serverUpload`, `importExport`.
- Debug не выводит birth details, coordinates, timezone рождения, currentPlace, house system, zodiac или полный profiles dump.
- PWA-кэш обновлен до `lunar-calendar-v49`.
- Sprint 3 завершен. Следующий этап — Sprint 4 / Personal Moment, но разработка Sprint 4 не начиналась.

## 2026-05-14 — Complete Task 3.7 profile export/import

- Уточнена кнопка экспорта: `Экспорт всех карт`.
- Повторный импорт того же backup-файла больше не создает дубликаты уже существующих профилей.
- Импорт теперь пропускает profiles с тем же содержимым и возвращает `skippedCount`.
- В `Мои карты` добавлен блок `Резервная копия` с локальными действиями `Экспорт` и `Импорт`.
- Добавлен `src/profileImportExport.js` для JSON export/import без сервера, cloud sync или внешних API.
- Экспорт создает JSON с `schemaVersion`, `app`, `exportedAt` и `profiles`.
- Импорт валидирует структуру, фильтрует невалидные profiles и не ломается на invalid JSON.
- При конфликте `id` импортируемый профиль получает новый `id`, существующие profiles не перезаписываются.
- После импорта список `Мои карты` обновляется и показывает короткий результат.
- PWA-кэш обновлен до `lunar-calendar-v48`.
- Debug profile state, натал и транзиты не добавлялись.
- Task 3.8 оставлена следующей активной задачей и не начиналась.

## 2026-05-14 — Complete Task 3.6 active profile selector

- В блоке `Профиль` теперь отображается активное значение: `Общий день` или выбранный профиль.
- В `Мои карты` добавлены явные действия `Выбрать` и `Редактировать`.
- Выбор профиля сохраняется через `setActiveProfileId()` и восстанавливается через `getActiveProfileId()`.
- `Общий день` можно выбрать как non-personal режим, но нельзя редактировать / удалять.
- Если active profile удален или отсутствует, UI возвращается к `Общий день`.
- PWA-кэш обновлен до `lunar-calendar-v46`.
- Export/import, debug profile state, натал и транзиты не добавлялись.
- Task 3.7 оставлена следующей активной задачей и не начиналась.

## 2026-05-14 — Complete Task 3.5 edit/delete profile

- Сохраненные профили в `Мои карты` теперь открываются в inline-форме редактирования.
- Форма редактирования переиспользует поля создания профиля и предзаполняется выбранными данными.
- Сохранение изменений идет через `updateProfile()`.
- Удаление профиля идет через `deleteProfile()` после подтверждения `Удалить профиль? Это действие нельзя отменить.`.
- `Общий день` не редактируется и не удаляется.
- PWA-кэш обновлен до `lunar-calendar-v45`.
- Active profile selector, export/import, натал и транзиты не добавлялись.
- Task 3.6 оставлена следующей активной задачей и не начиналась.

## 2026-05-14 — Complete Task 3.4 create profile form

- Кнопка `+ Добавить профиль` теперь открывает inline-форму внутри `Мои карты`.
- Форма сохраняет валидный профиль через `addProfile()` и обновляет список карт.
- Добавлены поля имени, даты, времени, точности времени, места рождения, timezone, системы домов и зодиака.
- Для `неизвестно` время рождения может быть пустым.
- Validation errors показываются короткими русскими сообщениями.
- PWA-кэш обновлен до `lunar-calendar-v44`.
- Edit/delete, active profile selector, export/import, натал и транзиты не добавлялись.
- Task 3.5 оставлена следующей активной задачей и не начиналась.

## 2026-05-14 — Complete Task 3.3 profiles UI shell

- Добавлен компактный блок `Профиль` на главный экран.
- Добавлена раскрываемая inline-секция `Мои карты` без новой навигации.
- Секция показывает `Общий день`, сохраненные profile names, empty state и privacy copy.
- Кнопка `+ Добавить профиль` пока disabled; форма создания профиля не добавлялась.
- Добавлен `src/profileUi.js`; `src/app.js` читает profiles через `loadProfiles()`.
- PWA-кэш обновлен до `lunar-calendar-v43`.
- Task 3.4 оставлена следующей активной задачей и не начиналась.

## 2026-05-14 — Complete Task 3.2 local profile storage

- Добавлен `src/profileStorage.js` для local-first хранения профилей в `localStorage`.
- Добавлены ключи `astroPwa.profiles.v1` и `astroPwa.activeProfileId.v1`.
- Storage безопасно обрабатывает пустое, битое и не-array состояние.
- Active profile id сбрасывается, если профиль удален или больше не существует.
- Добавлены тесты `test/profileStorage.test.js`.
- UI, `app.js`, натальная карта и персональные транзиты не добавлялись.
- Task 3.3 оставлена следующей активной задачей и не начиналась.

## 2026-05-14 — Complete Task 3.1 profile data model

- Добавлен `src/profileModel.js` с profile draft/defaults, normalization и validation helpers.
- Добавлены allowed values для точности времени рождения, системы домов, зодиака и режима текущего места.
- Добавлены тесты `test/profileModel.test.js`.
- Storage, UI, `localStorage`, натальная карта и персональные транзиты не добавлялись.
- Task 3.2 оставлена следующей активной задачей и не начиналась.

## 2026-05-14 — Prepare Sprint 3 documentation

- Sprint 1 and Sprint 2 зафиксированы как завершенные.
- Активным спринтом стал `Sprint 3 — Profiles / Мои карты`.
- В `TODO.md` добавлены Task 3.1–3.8; активная задача — `Task 3.1 — Add Profile Data Model`.
- В `PRIVACY_RULES.md` добавлены Sprint 3 privacy rules для local-first профилей.
- Код приложения не менялся.

## 2026-05-14 — Complete Task 2.7 best windows debug reasoning

- Добавлен `getBestWindowsDebug()` для скрытой проверки reasoning по лучшим окнам.
- Debug-панель при `?debug=1` показывает `Best Windows Debug`, параметры scoring, выбранные окна и top rejected / low-score candidates.
- Обычный `getBestWindows()` остался обратно совместимым и возвращает массив.
- PWA-кэш обновлен до `lunar-calendar-v42`.
- Sprint 2 завершен; Sprint 3 не начинался.

## 2026-05-14 — Complete Task 2.6 no-good-window fallback

- Карточка `Лучшее окно` теперь остается видимой, если подходящих окон нет.
- Добавлены спокойные mode-specific fallback-тексты для всех режимов.
- Scoring logic `getBestWindows()` не менялась.
- PWA-кэш обновлен до `lunar-calendar-v41`.
- Task 2.7 оставлена следующей активной задачей и не начиналась.

## 2026-05-14 — Clarify best window cautions

- В карточке `Лучшее окно` вместо абстрактного `есть предупреждения момента` теперь показывается первое конкретное предупреждение момента.
- Scoring и штраф за warnings не менялись.
- Task 2.6 не начиналась.

## 2026-05-14 — Show Moon aspect interpretation by default

- В блоке `Аспекты Луны` интерпретация следующего аспекта теперь видна сразу.
- Убрана кнопка `?` и JS-логика раскрытия подсказки.
- PWA-кэш обновлен до `lunar-calendar-v40`.
- Task 2.6 не начиналась.

## 2026-05-14 — Polish Task 2.5 best window card

- Исправлены пользовательские подписи режимов в заголовке `Лучшее окно`.
- Уменьшен размер времени в карточке лучшего окна, чтобы оно не доминировало над заголовком.
- PWA-кэш обновлен до `lunar-calendar-v39`.
- Task 2.6 не начиналась.

## 2026-05-14 — Complete Task 2.5 best window card

- Карточка `Лучшее окно сегодня` подключена к главному экрану через `getBestWindows()`.
- Для выбранного режима показывается `Лучшее окно для [режим]`, максимум 2 интервала в формате `HH:mm–HH:mm`.
- Если хороших окон нет, карточка скрывается; no-good-window fallback не добавлялся.
- PWA-кэш обновлен до `lunar-calendar-v38`.
- Task 2.6 оставлена следующей активной задачей и не начиналась.

## 2026-05-14 — Complete Task 2.4 best window scoring helper

- Добавлен `src/bestWindows.js` для расчета 1–2 лучших окон текущего московского дня.
- Helper исключает active VOC, учитывает режим, планетарный час, знак Луны, fieldQuality, warnings и напряженные аспекты Луны.
- Добавлены тесты `test/bestWindows.test.js`.
- UI-карточка лучших окон не добавлялась.
- PWA-кэш обновлен до `lunar-calendar-v37`.
- Task 2.5 оставлена следующей активной задачей и не начиналась.

## 2026-05-14 — Improve Task 2.3 mode recommendation heuristics

- `src/modeRecommendations.js` переведен на внутреннюю rule-based модель `signals → rules → priority → top 3`.
- Добавлены тесты конфликтных сценариев для VOC, Рыб, Марса/Урана, 29 лунных суток и свечей.
- UI не менялся; Task 2.4 не начиналась.

## 2026-05-14 — Complete Task 2.3 mode-specific recommendations

- Добавлен `src/modeRecommendations.js` со списками `Хорошо` / `Осторожно` для всех режимов.
- Блок `Качество поля` теперь меняет рекомендации при переключении режима.
- Заголовки `Подходит` / `Не подходит` заменены на `Хорошо` / `Осторожно`.
- Каждый список ограничен максимум 3 пунктами; unknown mode безопасно падает в `Общее`.
- Добавлены тесты `test/modeRecommendations.test.js`.
- PWA-кэш обновлен до `lunar-calendar-v36`.
- Task 2.4 оставлена следующей активной задачей и не начиналась.

## 2026-05-14 — Complete Task 2.2 mode-specific scores

- Добавлен `src/modeScores.js` со scoring logic для режимов `Общее`, `Таро`, `Свечи`, `Деньги`, `Отношения`, `Чистки`, `Прогнозы`.
- Блок оценок в `Качество поля` теперь меняет метрики при переключении режима.
- Значения оценок ограничены диапазоном 1–10; unknown mode безопасно падает в `Общее`.
- Добавлены тесты `test/modeScores.test.js`.
- PWA-кэш обновлен до `lunar-calendar-v35`.
- Task 2.3 оставлена следующей активной задачей и не начиналась.

## 2026-05-14 — Center dashboard mode selector

- Mode selector оформлен как отдельная карточка; chips центрируются при переносе на две строки.
- PWA-кэш обновлен до `lunar-calendar-v33`.
- Task 2.2 не начиналась.

## 2026-05-14 — Wrap dashboard mode chips

- Mode selector chips теперь переносятся на новую строку вместо горизонтального скролла.
- PWA-кэш обновлен до `lunar-calendar-v32`.
- Task 2.2 не начиналась.

## 2026-05-14 — Complete Task 2.1 dashboard mode selector

- Добавлен compact mode selector с режимами `Общее`, `Таро`, `Свечи`, `Деньги`, `Отношения`, `Чистки`, `Прогнозы`.
- Селектор расположен после `Луна без курса` и `Осторожно сегодня`, перед `Аспекты Луны`.
- Default mode — `Общее`; активный режим визуально выделяется и хранится в in-memory state.
- Добавлен `src/dashboardModes.js` и тесты списка режимов.
- PWA-кэш обновлен до `lunar-calendar-v31`.
- Task 2.2 оставлена следующей активной задачей и не начиналась.

## 2026-05-13 — Prepare Sprint 2 documentation

- Sprint 1 зафиксирован как завершенный, активным спринтом стал `Sprint 2 — Modes and Best Windows`.
- В `TODO.md` добавлены Task 2.1–2.7; активная задача — `Task 2.1 — Add Dashboard Mode Selector`.
- В `ASTRO_LOGIC.md` добавлены правила режимов и scoring notes для best windows.
- В `UI_RULES.md` добавлены правила mode selector, mode recommendations и best window UI.
- Код приложения не менялся.

## 2026-05-13 — Complete Task 1.10 hidden debug screen

- Добавлена скрытая debug-панель, доступная только через `?debug=1`.
- Debug-панель показывает расчетное время, статус `debugDate`, систему дня, знак Луны, VOC, аспекты Луны, индикаторы и данные эфемерид.
- Поддержан вариант `?debug=1&debugDate=2026-05-15T00:40:00` для проверки конкретного момента.
- Добавлен `src/debugPanel.js` и тесты для режима debug и ключевых секций.
- PWA-кэш обновлен до `lunar-calendar-v30`.
- Sprint 1 завершен; Sprint 2 не начат.

## 2026-05-13 — Complete Task 1.9 terminology cleanup

- Строка перехода Луны теперь отображается как `Переход в ...: сегодня/завтра HH:mm`, без секунд.
- Заголовок `Индикатор дня` заменен на `Индикаторы`.
- Точное новолуние / полнолуние на главном экране теперь показывается без секунд.
- Добавлен `src/moonSignDisplay.js` для компактного форматирования перехода Луны по знакам.
- PWA-кэш обновлен до `lunar-calendar-v29`.

## 2026-05-13 — Complete Task 1.8 Planetary hour hints

- Под планетарным часом добавлена короткая практическая подсказка `Хорошо для: ...`.
- Добавлен `src/planetaryHourHints.js` со словарем подсказок для всех семи планетарных часов.
- Неизвестное значение часа скрывает подсказку без `undefined` / `null`.
- PWA-кэш обновлен до `lunar-calendar-v28`.

## 2026-05-13 — Hide Moon age from hero

- Из hero-блока убрана строка `Возраст Луны`, чтобы не дублировать лунный день.
- Расчет возраста Луны в `src/astro.js` сохранен.

## 2026-05-13 — Complete Task 1.7 Moon precision

- В основной блок Луны добавлены строки `Освещенность`, `До Новолуния / Полнолуния` и `Возраст Луны`.
- Добавлен `src/moonPrecisionDisplay.js` для компактного форматирования лунной точности.
- `src/preciseEphemeris.js` теперь умеет возвращать ближайшее будущее Новолуние / Полнолуние.
- PWA-кэш обновлен до `lunar-calendar-v27`.

## 2026-05-13 — Remove Moon aspect countdown

- Из строки `Следующий аспект` убран countdown `через Xч Yм`.
- Дата и время аспекта сохранены в формате `сегодня/завтра HH:mm`.

## 2026-05-13 — Move warnings block higher

- Карточка `Осторожно сегодня` перенесена сразу после `Луна без курса`, перед блоком `Аспекты Луны`.
- Логика и тексты warnings не менялись.

## 2026-05-13 — Add debugDate manual check parameter

- Добавлен dev-only query-параметр `?debugDate=YYYY-MM-DDTHH:mm:ss` для ручной проверки главного экрана на выбранной дате.
- Без `debugDate` приложение продолжает работать от текущего времени.
- Добавлен тест парсинга `debugDate`.
- PWA-кэш обновлен до `lunar-calendar-v26`.

## 2026-05-13 — Complete Task 1.6 Warnings block

- Добавлен компактный блок `Осторожно сегодня`, который показывается только при наличии красных флагов.
- `src/fieldQuality.js` теперь возвращает список `warnings` на основе VOC, напряженного следующего аспекта Луны, 23 / 29 лунных суток и Луны в Рыбах.
- Добавлены тесты для active/upcoming VOC warnings, отсутствия warnings без красных флагов и лимита предупреждений.
- PWA-кэш обновлен до `lunar-calendar-v25`.

## 2026-05-13 — Complete Task 1.5 Field Quality advice

- Блок `Качество поля` получил более точные состояния поля: устойчивое, тонкое, нервное, плотное, очищающее, размытое, денежное.
- Добавлена строка `Главный совет момента`.
- Существующие оценки `Интуиция`, `Материальные дела`, `Ритуалы` и списки `Подходит` / `Не подходит` сохранены.
- PWA-кэш обновлен до `lunar-calendar-v24`.

## 2026-05-13 — Complete Task 1.4 Moon aspect interpretation

- В блок `Аспекты Луны` добавлено компактное раскрытие через кнопку `?`.
- Для следующего аспекта Луны показывается короткая практическая интерпретация.
- Точные тексты и fallback-правила добавлены в `src/moonAspectsDisplay.js`.
- PWA-кэш обновлен до `lunar-calendar-v23`.

## 2026-05-13 — Complete Task 1.3 Moon aspects block

- Упрощен текст блока `Луна без курса`: убраны `Луна в курсе`, `Следующая VOC` и внутренний заголовок `Следующая Луна без курса`.
- Уточнено отображение аспектов Луны: названия аспектов заменены на глифы, countdown стал компактным (`20ч 28м`).
- Блок `Аспекты Луны` теперь использует подписи `Последний аспект` и `Следующий аспект`.
- Аспекты отображаются с названием аспекта, планетой, относительным днем и временем `HH:mm`.
- Для следующего аспекта добавлен countdown в формате `через X ч Y мин`.
- Немажорные аспекты и отсутствующие данные показываются как `нет данных`.
- Добавлен `src/moonAspectsDisplay.js` и тесты отображения аспектов Луны.
- PWA-кэш обновлен до `lunar-calendar-v22`.

## 2026-05-11 — Checkpoint before continuing

- Зафиксировано текущее состояние Sprint 1 внутри документации.
- Подтверждено: Task 1.1 и Task 1.2 закрыты, Task 1.3 следующая и не начата.
- Зафиксированы последние изменения: упрощен блок `Луна без курса`, добавлена строка `фон ...`, добавлено тестовое покрытие выбора следующей VOC после завершения текущей.
- Код приложения в этом checkpoint-шаге не менялся.

## 2026-05-11 — Complete Task 1.2 VOC background label

- Добавлено тестовое покрытие: после завершения текущей VOC выбирается следующая будущая VOC, а не завершившийся интервал.
- Строка `фон ...` теперь визуально отделена новой строкой и приглушенным цветом.
- В блок `Луна без курса` добавлена строка фона после аспекта: `фон мягкий`, `фон напряженный`, `фон размытый`, `фон тяжелый`, `фон нервный`.
- Строка фона не содержит слово `VOC` и скрывается, если данных о последнем аспекте недостаточно.
- Текущая упрощенная логика VOC-блока сохранена.
- Task 1.3 не запускалась.

## 2026-05-11 — Simplify Task 1.1 VOC card UX

- Карточка снова называется `Луна без курса`.
- Убраны формулировки `Статус Луны`, `Луна в курсе`, `Без курса: ...`, `VOC после: ...`.
- Убраны countdown-строки и VOC quality label из карточки.
- Итоговый формат: `с HH:mm до HH:mm`, `до HH:mm`, `после: ...` или `нет данных`.
- Task 1.2 не запускалась в этом проходе.

## 2026-05-11 — Complete Task 1.2 VOC quality label

- В блок `Статус Луны` добавлен компактный label качества VOC по последнему аспекту перед VOC.
- Реализован приоритет label: Нептун, Сатурн, Марс / Уран, напряженный аспект, гармоничный аспект.
- Если данных о последнем аспекте недостаточно, label не показывается.
- Task 1.3 не запускалась.

## 2026-05-11 — Complete Task 1.1 VOC block states

- В состоянии `Луна в курсе` строка следующей VOC переименована в более мягкую `Без курса: дата, время`.
- Заголовок VOC-карточки изменен на нейтральный `Статус Луны`, чтобы не конфликтовать с состоянием `Луна в курсе`.
- Доработан блок `Луна без курса`: upcoming / active / none теперь показываются отдельными понятными состояниями.
- В VOC-блоке на главном экране время выводится в формате `HH:mm`, без секунд.
- Добавлен обратный отсчет до начала или окончания VOC.
- Строка `после: ...` заменена на `VOC после: ...`.
- Форматирование VOC вынесено в `src/vocDisplay.js` и покрыто тестами.
- PWA-кэш обновлен до `lunar-calendar-v20`.

## 2026-05-11 — Astro PWA 2.0 documentation

- Добавлена документация этапа Astro PWA 2.0.
- Введена иерархия документов проекта:
  - `PROJECT_STATE.md` — текущее состояние проекта и активный спринт;
  - `ARCHITECTURE.md` — фактическая архитектура кода;
  - `TODO.md` — активный рабочий список задач;
  - `ASTRO_LOGIC.md` — правила астрологических расчетов;
  - `UI_RULES.md` — правила интерфейса;
  - `PRIVACY_RULES.md` — правила приватности;
  - `MASTER_PLAN.md` — большой роадмап, не инструкция делать все сразу;
  - `CHANGELOG.md` — история изменений.
- Старый `CHANGELOG.md` сохранен, новая запись добавлена сверху.
- `TASKS.md` из внешнего комплекта не используется как главный список задач: приоритет у `TODO.md`.
- Код приложения не менялся.

## 2026-05-11

- Подготовлены документы проекта для передачи в новый Codex-чат без истории текущего чата.
- Актуализированы состояние проекта, ближайший TODO и активный фокус: калибровка блока `Качество поля`.
- Зафиксировано, что в этом handoff-шаге код приложения не менялся.
- Добавлен документационный чекпоинт проекта.
- Зафиксировано текущее состояние приложения, архитектура, TODO и главный блокер.
- Уточнен расчет Tong Shu по документу `Фиксы.docx`: MSK, Jie Qi, смена энергетического дня в 23:00.
- Для 11 мая 2026 закреплены `乙酉` и индикатор `Стабильность`.
- Исправлено согласование Ба-цзы названий по роду, например `Деревянный Петух`.
- Добавлены предрасчитанные мажорные аспекты Луны к планетам.
- На главный экран добавлен компактный блок `Аспекты Луны`: последний и следующий аспект.
- В блоке Луны без курса добавлена строка с аспектом, после которого начался VOC.
- Добавлен блок `Качество поля` с фразой момента и оценками `Интуиция`, `Материальные дела`, `Ритуалы`.
- PWA-кэш обновлен до `lunar-calendar-v16`.
- Добавлен скрипт `npm run calibrate:field` для калибровки качества поля на контрольных датах.
- В приложение добавлен список причин внутри блока `Качество поля`.
- PWA-кэш обновлен до `lunar-calendar-v17`.
- Ограничено влияние прошлого напряженного аспекта Луны: сильное эхо учитывается 4 часа, а не до следующего аспекта.
- В блок `Качество поля` добавлены списки `Подходит / Не подходит`.
- PWA-кэш обновлен до `lunar-calendar-v19`.

## 2026-05-10

- Создано PWA лунного календаря для iPhone.
- Настроена публикация через GitHub Pages.
- Интерфейс приведен к чистому главному экрану без лишних меню и декоративной центральной Луны.
- Добавлены точные данные Swiss Ephemeris на 2026-2030 годы.
- Добавлены точные лунные дни для Москвы.
- Добавлены переходы Луны по знакам и Луна без курса.
- Добавлены планетарный день и планетарный час.
- Добавлены показатели дня: лунные сутки, Ба-цзы день, индикатор дня Tong Shu.
- Уточнено название 23-х лунных суток: `Крокодил Маккара`.
- Индикатор дня временно переводился на выбранную линию Tong Shu, где 10 мая 2026 показывал `Устранение`; затем линия была уточнена 11 мая по отдельному документу.
- Добавлены точные новолуния и полнолуния с временем до секунд.
- PWA-кэш обновлен до `lunar-calendar-v14`.
