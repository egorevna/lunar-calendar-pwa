import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const appJs = readFileSync(new URL('../src/app.js', import.meta.url), 'utf8');
const stylesCss = readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8');

test('home screen does not render inactive chrome or decorative Moon image', () => {
  assert.equal(html.includes('class="top-bar"'), false);
  assert.equal(html.includes('class="moon-visual"'), false);
  assert.equal(html.includes('class="tab-bar"'), false);
});

test('home screen renders compact Moon aspect fields', () => {
  assert.equal(html.includes('data-voc-aspect'), true);
  assert.equal(html.includes('data-last-moon-aspect'), true);
  assert.equal(html.includes('data-next-moon-aspect'), true);
  assert.equal(html.includes('data-moon-aspect-interpretation'), true);
  assert.equal(html.includes('data-moon-aspects-toggle'), false);
  assert.equal(html.includes('Пояснить следующий аспект Луны'), false);
  assert.equal(html.includes('data-moon-aspect-interpretation hidden'), false);
  assert.equal(html.includes('Последний аспект'), true);
  assert.equal(html.includes('Следующий аспект'), true);
});

test('home screen uses event heading for VOC card', () => {
  assert.equal(html.includes('<h2>Луна без курса</h2>'), true);
  assert.equal(html.includes('<h2>Статус Луны</h2>'), false);
});

test('home screen renders field quality fields', () => {
  assert.equal(html.includes('data-field-summary'), true);
  assert.equal(html.includes('data-field-advice'), true);
  assert.equal(html.includes('Главный совет момента'), true);
  assert.equal(html.includes('data-field-metrics'), true);
  assert.equal(html.includes('data-field-reasons'), true);
  assert.equal(html.includes('data-field-supports'), true);
  assert.equal(html.includes('data-field-avoid'), true);
  assert.equal(html.includes('<h3>Хорошо</h3>'), true);
  assert.equal(html.includes('<h3>Осторожно</h3>'), true);
  assert.equal(html.includes('<h3>Подходит</h3>'), false);
  assert.equal(html.includes('<h3>Не подходит</h3>'), false);
});

test('home screen renders Moon precision field', () => {
  assert.equal(html.includes('data-moon-precision'), true);
  assert.equal(html.includes('class="moon-precision"'), true);
});

test('home screen renders planetary hour hint field', () => {
  assert.equal(html.includes('data-hour-hint'), true);
  assert.equal(html.includes('class="planet-hint"'), true);
});

test('home screen uses clear indicators heading', () => {
  assert.equal(html.includes('<span>Индикаторы</span>'), true);
  assert.equal(html.includes('<span>Индикатор дня</span>'), false);
});

test('home screen renders compact dashboard mode selector', () => {
  assert.equal(html.includes('class="glass-card mode-selector"'), true);
  assert.equal(html.includes('data-mode-selector'), true);
  assert.equal(html.includes('data-mode-button'), true);
  assert.equal(html.includes('aria-pressed="true" data-mode-button="general"'), true);
  assert.equal(html.includes('Общее'), true);
  assert.equal(html.includes('Таро'), true);
  assert.equal(html.includes('Свечи'), true);
  assert.equal(html.includes('Деньги'), true);
  assert.equal(html.includes('Отношения'), true);
  assert.equal(html.includes('Чистки'), true);
  assert.equal(html.includes('Прогнозы'), true);
});

test('home screen renders profile shell', () => {
  assert.equal(html.includes('class="glass-card profile-card"'), true);
  assert.equal(html.includes('data-profile-current'), true);
  assert.equal(html.includes('data-profiles-toggle'), true);
  assert.equal(html.includes('data-profiles-panel'), true);
  assert.equal(html.includes('data-profiles-list'), true);
  assert.equal(html.includes('data-profiles-empty hidden'), true);
  assert.equal(html.includes('data-profile-add'), true);
  assert.equal(html.includes('data-profile-add disabled'), false);
  assert.equal(html.includes('Данные хранятся на этом устройстве и не отправляются на сервер.'), true);
  assert.equal(html.includes('Профиль'), true);
  assert.equal(html.includes('Общий день'), true);
  assert.equal(html.includes('Мои карты'), true);
  assert.equal(html.includes('Пока нет сохраненных карт.'), true);
  assert.equal(html.includes('Начните с добавления профиля.'), true);
  assert.equal(html.includes('+ Добавить профиль'), true);
  assert.equal(html.includes('data-natal-planets-readiness'), true);
  assert.equal(html.includes('data-natal-planets-readiness-title'), true);
  assert.equal(html.includes('Натальные планеты'), true);
  assert.equal(html.includes('data-natal-aspects'), true);
  assert.equal(html.includes('data-natal-aspects-title'), true);
  assert.equal(html.includes('Натальные аспекты'), true);
  assert.equal(html.includes('data-essential-dignities'), true);
  assert.equal(html.includes('data-essential-dignities-title'), true);
  assert.equal(html.includes('Достоинства планет'), true);
  assert.equal(html.includes('data-detailed-dignities'), true);
  assert.equal(html.includes('data-detailed-dignities-title'), true);
  assert.equal(html.includes('Термы, деканы и градусы'), true);
  assert.equal(html.includes('data-houses-readiness'), true);
  assert.equal(html.includes('data-houses-title'), true);
  assert.equal(html.includes('Дома и углы карты'), true);
  assert.equal(html.includes('data-arabic-parts-readiness'), true);
  assert.equal(html.includes('data-arabic-parts-title'), true);
  assert.equal(html.includes('Жребии и арабские части'), true);
  assert.equal(html.includes('data-special-points-readiness'), true);
  assert.equal(html.includes('data-special-points-title'), true);
  assert.equal(html.includes('Особые точки карты'), true);
  assert.equal(html.includes('Добавление профиля — следующий шаг.'), false);
  assert.equal(html.includes('Натальная карта'), false);
  assert.equal(html.includes('Персональные транзиты'), false);
});

test('natal aspects shell stays inside profiles panel and has no static aspect values', () => {
  const panelStart = html.indexOf('data-profiles-panel');
  const panelEnd = html.indexOf('class="glass-card mode-selector"');
  const panelHtml = html.slice(panelStart, panelEnd);
  const planetsStart = html.indexOf('data-natal-planets-readiness');
  const aspectsStart = html.indexOf('data-natal-aspects');
  const aspectsEnd = html.indexOf('class="profile-create-actions"');
  const aspectsHtml = html.slice(aspectsStart, aspectsEnd);

  assert.equal(panelStart >= 0, true);
  assert.equal(aspectsStart > planetsStart, true);
  assert.equal(aspectsStart < panelEnd, true);
  assert.equal(panelHtml.includes('data-natal-aspects hidden'), true);
  assert.equal(aspectsHtml.includes('data-natal-aspects-summary'), true);
  assert.equal(aspectsHtml.includes('data-natal-aspects-toggle'), true);
  assert.equal(aspectsHtml.includes('data-natal-aspects-list'), true);
  assert.equal(aspectsHtml.includes('data-natal-aspects-list hidden'), true);
  assert.equal(aspectsHtml.includes('Солнце □ Луна'), false);
  assert.equal(aspectsHtml.includes('Венера △ Марс'), false);
  assert.equal(aspectsHtml.includes('birthDate'), false);
  assert.equal(aspectsHtml.includes('birthTime'), false);
  assert.equal(aspectsHtml.includes('utcDateTime'), false);
  assert.equal(aspectsHtml.includes('latitude'), false);
  assert.equal(aspectsHtml.includes('longitude'), false);
  assert.equal(aspectsHtml.includes('allowedOrb'), false);
});

test('essential dignities shell stays inside profiles panel and has no static dignity values', () => {
  const panelStart = html.indexOf('data-profiles-panel');
  const panelEnd = html.indexOf('class="glass-card mode-selector"');
  const panelHtml = html.slice(panelStart, panelEnd);
  const aspectsStart = html.indexOf('data-natal-aspects');
  const dignitiesStart = html.indexOf('data-essential-dignities');
  const addButtonStart = html.indexOf('class="profile-create-actions"');
  const dignitiesHtml = html.slice(dignitiesStart, addButtonStart);

  assert.equal(panelStart >= 0, true);
  assert.equal(dignitiesStart > aspectsStart, true);
  assert.equal(dignitiesStart < panelEnd, true);
  assert.equal(dignitiesStart < addButtonStart, true);
  assert.equal(panelHtml.includes('data-essential-dignities hidden'), true);
  assert.equal(dignitiesHtml.includes('data-essential-dignities-summary'), true);
  assert.equal(dignitiesHtml.includes('data-essential-dignities-toggle'), true);
  assert.equal(dignitiesHtml.includes('data-essential-dignities-list'), true);
  assert.equal(dignitiesHtml.includes('data-essential-dignities-list hidden'), true);
  assert.equal(dignitiesHtml.includes('Марс в Овне'), false);
  assert.equal(dignitiesHtml.includes('Венера в Рыбах'), false);
  assert.equal(dignitiesHtml.includes('Сатурн в Раке'), false);
  assert.equal(dignitiesHtml.includes('birthDate'), false);
  assert.equal(dignitiesHtml.includes('birthTime'), false);
  assert.equal(dignitiesHtml.includes('utcDateTime'), false);
  assert.equal(dignitiesHtml.includes('latitude'), false);
  assert.equal(dignitiesHtml.includes('longitude'), false);
  assert.equal(dignitiesHtml.includes('terms'), false);
  assert.equal(dignitiesHtml.includes('decans'), false);
  assert.equal(dignitiesHtml.includes('degreeRulers'), false);
  assert.equal(dignitiesHtml.includes('Vronsky'), false);
  assert.equal(dignitiesHtml.includes('interpretation'), false);
});

test('detailed dignities shell stays inside profiles panel after essential dignities and has no static values', () => {
  const panelStart = html.indexOf('data-profiles-panel');
  const panelEnd = html.indexOf('class="glass-card mode-selector"');
  const panelHtml = html.slice(panelStart, panelEnd);
  const essentialStart = html.indexOf('data-essential-dignities');
  const detailedStart = html.indexOf('data-detailed-dignities');
  const housesStart = html.indexOf('class="houses-readiness"');
  const addButtonStart = html.indexOf('class="profile-create-actions"');
  const detailedHtml = html.slice(detailedStart, housesStart);

  assert.equal(panelStart >= 0, true);
  assert.equal(detailedStart > essentialStart, true);
  assert.equal(detailedStart < panelEnd, true);
  assert.equal(detailedStart < housesStart, true);
  assert.equal(housesStart < addButtonStart, true);
  assert.equal(panelHtml.includes('data-detailed-dignities hidden'), true);
  assert.equal(detailedHtml.includes('data-detailed-dignities-summary'), true);
  assert.equal(detailedHtml.includes('data-detailed-dignities-toggle'), true);
  assert.equal(detailedHtml.includes('data-detailed-dignities-groups'), true);
  assert.equal(detailedHtml.includes('data-detailed-dignities-groups hidden'), true);
  assert.equal(detailedHtml.includes('Солнце — терм'), false);
  assert.equal(detailedHtml.includes('Марс — 0-й градус'), false);
  assert.equal(detailedHtml.includes('birthDate'), false);
  assert.equal(detailedHtml.includes('birthTime'), false);
  assert.equal(detailedHtml.includes('utcDateTime'), false);
  assert.equal(detailedHtml.includes('latitude'), false);
  assert.equal(detailedHtml.includes('longitude'), false);
  assert.equal(detailedHtml.includes('sourceTokens'), false);
  assert.equal(detailedHtml.includes('sourceKey'), false);
  assert.equal(detailedHtml.includes('fixedStars'), false);
  assert.equal(detailedHtml.includes('houses'), false);
  assert.equal(detailedHtml.includes('transits'), false);
  assert.equal(detailedHtml.includes('interpretation'), false);
});

test('houses shell stays inside profiles panel after detailed dignities and has no static values', () => {
  const panelStart = html.indexOf('data-profiles-panel');
  const panelEnd = html.indexOf('class="glass-card mode-selector"');
  const panelHtml = html.slice(panelStart, panelEnd);
  const detailedStart = html.indexOf('data-detailed-dignities');
  const housesStart = html.indexOf('data-houses-readiness');
  const addButtonStart = html.indexOf('class="profile-create-actions"');
  const housesHtml = html.slice(housesStart, addButtonStart);

  assert.equal(panelStart >= 0, true);
  assert.equal(housesStart > detailedStart, true);
  assert.equal(housesStart < panelEnd, true);
  assert.equal(housesStart < addButtonStart, true);
  assert.equal(panelHtml.includes('data-houses-readiness hidden'), true);
  assert.equal(housesHtml.includes('data-houses-summary'), true);
  assert.equal(housesHtml.includes('data-houses-toggle'), true);
  assert.equal(housesHtml.includes('data-houses-angles'), true);
  assert.equal(housesHtml.includes('data-houses-list'), true);
  assert.equal(housesHtml.includes('data-houses-planet-assignments'), true);
  assert.equal(housesHtml.includes('data-houses-list hidden'), true);
  assert.equal(housesHtml.includes('data-houses-planet-assignments hidden'), true);
  assert.equal(housesHtml.includes('ASC — Овен'), false);
  assert.equal(housesHtml.includes('Солнце — 9 дом'), false);
  assert.equal(housesHtml.includes('birthDate'), false);
  assert.equal(housesHtml.includes('birthTime'), false);
  assert.equal(housesHtml.includes('utcDateTime'), false);
  assert.equal(housesHtml.includes('latitude'), false);
  assert.equal(housesHtml.includes('longitude'), false);
  assert.equal(housesHtml.includes('coordinates'), false);
  assert.equal(housesHtml.includes('transits'), false);
  assert.equal(housesHtml.includes('fixedStars'), false);
  assert.equal(housesHtml.includes('Pars Fortuna'), false);
  assert.equal(housesHtml.includes('interpretation'), false);
});

test('Arabic Parts shell stays inside profiles panel after houses and has no static values', () => {
  const panelStart = html.indexOf('data-profiles-panel');
  const panelEnd = html.indexOf('class="glass-card mode-selector"');
  const panelHtml = html.slice(panelStart, panelEnd);
  const housesStart = html.indexOf('data-houses-readiness');
  const arabicPartsStart = html.indexOf('data-arabic-parts-readiness');
  const addButtonStart = html.indexOf('class="profile-create-actions"');
  const arabicPartsHtml = html.slice(arabicPartsStart, addButtonStart);

  assert.equal(panelStart >= 0, true);
  assert.equal(arabicPartsStart > housesStart, true);
  assert.equal(arabicPartsStart < panelEnd, true);
  assert.equal(arabicPartsStart < addButtonStart, true);
  assert.equal(panelHtml.includes('data-arabic-parts-readiness hidden'), true);
  assert.equal(arabicPartsHtml.includes('data-arabic-parts-summary'), true);
  assert.equal(arabicPartsHtml.includes('data-arabic-parts-toggle'), true);
  assert.equal(arabicPartsHtml.includes('data-arabic-parts-chart-sect'), true);
  assert.equal(arabicPartsHtml.includes('data-arabic-parts-list'), true);
  assert.equal(arabicPartsHtml.includes('data-arabic-parts-list hidden'), true);
  assert.equal(arabicPartsHtml.includes('Парс Фортуны — Телец'), false);
  assert.equal(arabicPartsHtml.includes('Жребий Духа — Скорпион'), false);
  assert.equal(arabicPartsHtml.includes('birthDate'), false);
  assert.equal(arabicPartsHtml.includes('birthTime'), false);
  assert.equal(arabicPartsHtml.includes('utcDateTime'), false);
  assert.equal(arabicPartsHtml.includes('latitude'), false);
  assert.equal(arabicPartsHtml.includes('longitude'), false);
  assert.equal(arabicPartsHtml.includes('coordinates'), false);
  assert.equal(arabicPartsHtml.includes('formula'), false);
  assert.equal(arabicPartsHtml.includes('fixedStars'), false);
  assert.equal(arabicPartsHtml.includes('transits'), false);
  assert.equal(arabicPartsHtml.includes('ritual'), false);
  assert.equal(arabicPartsHtml.includes('interpretation'), false);
});

test('Arabic Parts block is collapsible and resets on profile changes', () => {
  assert.equal(appJs.includes('let expandedArabicPartsProfileId = null;'), true);
  assert.equal(appJs.includes('const isExpanded = view.canToggleArabicParts'), true);
  assert.equal(appJs.includes("elements.arabicPartsToggle.textContent = isExpanded ? 'Скрыть' : 'Показать';"), true);
  assert.equal(appJs.includes('elements.arabicPartsStatus.textContent = view.status || view.summary;'), true);
  assert.equal(appJs.includes('elements.arabicPartsSummary.hidden = true;'), true);
  assert.equal(appJs.includes('elements.arabicPartsList.hidden = !isExpanded || view.items.length === 0;'), true);
  assert.equal(appJs.includes('expandedArabicPartsProfileId = isExpanded ? null : profileId;'), true);
  assert.equal(appJs.includes('expandedArabicPartsProfileId = null;'), true);
});

test('Special Points shell stays inside profiles panel after Arabic Parts and has no static values', () => {
  const panelStart = html.indexOf('data-profiles-panel');
  const panelEnd = html.indexOf('class="glass-card mode-selector"');
  const panelHtml = html.slice(panelStart, panelEnd);
  const arabicPartsStart = html.indexOf('data-arabic-parts-readiness');
  const specialPointsStart = html.indexOf('data-special-points-readiness');
  const addButtonStart = html.indexOf('class="profile-create-actions"');
  const specialPointsHtml = html.slice(specialPointsStart, addButtonStart);

  assert.equal(panelStart >= 0, true);
  assert.equal(specialPointsStart > arabicPartsStart, true);
  assert.equal(specialPointsStart < panelEnd, true);
  assert.equal(specialPointsStart < addButtonStart, true);
  assert.equal(panelHtml.includes('data-special-points-readiness hidden'), true);
  assert.equal(specialPointsHtml.includes('data-special-points-summary'), true);
  assert.equal(specialPointsHtml.includes('data-special-points-toggle'), true);
  assert.equal(specialPointsHtml.includes('data-special-points-sections'), true);
  assert.equal(specialPointsHtml.includes('data-special-points-sections hidden'), true);
  assert.equal(specialPointsHtml.includes('data-special-points-limitations'), true);
  assert.equal(specialPointsHtml.includes('data-special-points-limitations hidden'), true);
  assert.equal(specialPointsHtml.includes('Северный узел — Лев'), false);
  assert.equal(specialPointsHtml.includes('Лилит / Средняя Лилит —'), false);
  assert.equal(specialPointsHtml.includes('Селена / Белая Луна —'), false);
  assert.equal(specialPointsHtml.includes('birthDate'), false);
  assert.equal(specialPointsHtml.includes('birthTime'), false);
  assert.equal(specialPointsHtml.includes('utcDateTime'), false);
  assert.equal(specialPointsHtml.includes('latitude'), false);
  assert.equal(specialPointsHtml.includes('longitude'), false);
  assert.equal(specialPointsHtml.includes('coordinates'), false);
  assert.equal(specialPointsHtml.includes('sourceArray'), false);
  assert.equal(specialPointsHtml.includes('fixedStars'), false);
  assert.equal(specialPointsHtml.includes('transits'), false);
  assert.equal(specialPointsHtml.includes('ritual'), false);
  assert.equal(specialPointsHtml.includes('карми'), false);
  assert.equal(specialPointsHtml.includes('ангел'), false);
});

test('Special Points block is collapsible and resets on profile changes', () => {
  assert.equal(appJs.includes('let expandedSpecialPointsProfileId = null;'), true);
  assert.equal(appJs.includes('const isExpanded = view.canToggleSpecialPoints'), true);
  assert.equal(appJs.includes("elements.specialPointsToggle.textContent = isExpanded ? 'Скрыть' : 'Показать';"), true);
  assert.equal(appJs.includes('elements.specialPointsStatus.textContent = view.status || view.summary;'), true);
  assert.equal(appJs.includes('elements.specialPointsSummary.hidden = true;'), true);
  assert.equal(appJs.includes('elements.specialPointsSections.hidden = !isExpanded || view.sections.length === 0;'), true);
  assert.equal(appJs.includes('expandedSpecialPointsProfileId = isExpanded ? null : profileId;'), true);
  assert.equal(appJs.includes('expandedSpecialPointsProfileId = null;'), true);
});

test('houses block is collapsible and resets on profile changes', () => {
  assert.equal(appJs.includes('let expandedHousesProfileId = null;'), true);
  assert.equal(appJs.includes('const isExpanded = view.canToggleHouses'), true);
  assert.equal(appJs.includes("elements.housesToggle.textContent = isExpanded ? 'Скрыть' : 'Показать';"), true);
  assert.equal(appJs.includes('elements.housesStatus.textContent = view.status || view.summary;'), true);
  assert.equal(appJs.includes('elements.housesSummary.hidden = true;'), true);
  assert.equal(appJs.includes('elements.housesMessage.textContent = view.explanation;'), false);
  assert.equal(appJs.includes('elements.housesList.hidden = !isExpanded || view.houses.length === 0;'), true);
  assert.equal(appJs.includes('expandedHousesProfileId = isExpanded ? null : profileId;'), true);
  assert.equal(appJs.includes('expandedHousesProfileId = null;'), true);
});

test('natal planets shell stays inside profiles panel and has no static planet values', () => {
  const panelStart = html.indexOf('data-profiles-panel');
  const panelEnd = html.indexOf('class="glass-card mode-selector"');
  const panelHtml = html.slice(panelStart, panelEnd);
  const readinessStart = html.indexOf('data-natal-planets-readiness');
  const readinessEnd = html.indexOf('class="profile-create-actions"');
  const readinessHtml = html.slice(readinessStart, readinessEnd);
  const personalIndex = html.indexOf('data-personal-context-card hidden');

  assert.equal(panelStart >= 0, true);
  assert.equal(readinessStart > panelStart, true);
  assert.equal(readinessStart < panelEnd, true);
  assert.equal(personalIndex < readinessStart, true);
  assert.equal(panelHtml.includes('data-natal-planets-readiness hidden'), true);
  assert.equal(readinessHtml.includes('data-natal-planets-summary'), true);
  assert.equal(readinessHtml.includes('data-natal-planets-toggle'), true);
  assert.equal(readinessHtml.includes('data-natal-planets-list'), true);
  assert.equal(readinessHtml.includes('data-natal-planets-list hidden'), true);
  assert.equal(readinessHtml.includes('data-natal-planets-readiness-missing-list'), true);
  assert.equal(readinessHtml.includes('Ограничения:'), true);
  assert.equal(readinessHtml.includes('data-natal-planets-readiness-limitations'), true);
  assert.equal(readinessHtml.includes('Провайдер планет проверен'), false);
  assert.equal(readinessHtml.includes('Солнце —'), false);
  assert.equal(readinessHtml.includes('Луна —'), false);
  assert.equal(readinessHtml.includes('Меркурий R'), false);
  assert.equal(readinessHtml.includes('birthDate'), false);
  assert.equal(readinessHtml.includes('birthTime'), false);
  assert.equal(readinessHtml.includes('latitude'), false);
  assert.equal(readinessHtml.includes('longitude'), false);
  assert.equal(readinessHtml.includes('birthPlace.timezone'), false);
});

test('home screen renders hidden personal context card shell', () => {
  const cardStart = html.indexOf('class="glass-card personal-context-card"');
  const cardEnd = html.indexOf('class="glass-card profiles-panel"');
  const personalCardHtml = html.slice(cardStart, cardEnd);

  assert.equal(html.includes('class="glass-card personal-context-card"'), true);
  assert.equal(html.includes('data-personal-context-card hidden'), true);
  assert.equal(html.includes('data-personal-context-title'), true);
  assert.equal(html.includes('data-personal-context-summary'), true);
  assert.equal(html.includes('data-personal-context-sections'), true);
  assert.equal(html.includes('Лично для меня'), true);
  assert.equal(appJs.includes('createPersonalContext'), true);
  assert.equal(appJs.includes('describePersonalContextBlock'), true);
  assert.equal(personalCardHtml.includes('birthDate'), false);
  assert.equal(personalCardHtml.includes('birthTime'), false);
  assert.equal(personalCardHtml.includes('latitude'), false);
  assert.equal(personalCardHtml.includes('longitude'), false);
});

test('home screen renders create profile form shell', () => {
  assert.equal(html.includes('data-profile-form hidden'), true);
  assert.equal(html.includes('name="name"'), true);
  assert.equal(html.includes('name="birthDate"'), true);
  assert.equal(html.includes('name="birthTime"'), true);
  assert.equal(html.includes('name="birthTimeAccuracy"'), true);
  assert.equal(html.includes('value="exact"'), true);
  assert.equal(html.includes('value="approximate"'), true);
  assert.equal(html.includes('value="unknown"'), true);
  assert.equal(html.includes('name="birthCity"'), true);
  assert.equal(html.includes('name="birthCountry"'), true);
  assert.equal(html.includes('name="birthTimezone"'), true);
  assert.equal(html.includes('name="birthLatitude"'), true);
  assert.equal(html.includes('name="birthLongitude"'), true);
  assert.equal(html.includes('Широта места рождения'), true);
  assert.equal(html.includes('Долгота места рождения'), true);
  assert.equal(html.includes('Для обычного режима достаточно координат города.'), true);
  assert.equal(html.includes('Координаты роддома не обязательны.'), true);
  assert.equal(html.includes('name="houseSystem"'), true);
  assert.equal(html.includes('value="wholeSign"'), true);
  assert.equal(html.includes('value="placidus"'), true);
  assert.equal(html.includes('value="equal"'), true);
  assert.equal(html.includes('name="zodiac"'), true);
  assert.equal(html.includes('value="tropical"'), true);
  assert.equal(html.includes('Текущее место расчета: Москва, Россия, Europe/Moscow.'), true);
  assert.equal(html.includes('data-profile-form-errors hidden'), true);
  assert.equal(html.includes('data-profile-form-title'), true);
  assert.equal(html.includes('Сохранить'), true);
  assert.equal(html.includes('data-profile-form-cancel'), true);
  assert.equal(html.includes('data-profile-delete hidden'), true);
  assert.equal(html.includes('Удалить профиль'), true);
  assert.equal(html.includes('Транзиты'), false);
  assert.equal(html.includes('ASC'), false);
  assert.equal(html.includes('MC'), false);
  assert.equal(appJs.includes('coordinates: buildBirthCoordinates(data)'), true);
  assert.equal(appJs.includes('navigator.geolocation'), false);
  assert.equal(appJs.includes('fetch('), false);
  assert.equal(appJs.includes('geocode'), false);
  assert.equal(appJs.includes('55.7558'), false);
  assert.equal(appJs.includes('37.6173'), false);
});

test('home screen renders profile import and export controls without personal astrology UI', () => {
  assert.equal(html.includes('Резервная копия'), true);
  assert.equal(html.includes('Экспорт всех карт'), true);
  assert.equal(html.includes('Импорт'), true);
  assert.equal(html.includes('data-profile-export'), true);
  assert.equal(html.includes('data-profile-import'), true);
  assert.equal(html.includes('data-profile-import-file'), true);
  assert.equal(html.includes('Файл остается у вас. Мы не отправляем данные на сервер.'), false);
  assert.equal(html.includes('Данные хранятся на этом устройстве и не отправляются на сервер.'), true);
  assert.equal(html.includes('Данные карты хранятся только на этом устройстве.'), false);
  assert.equal(html.includes('Мы не отправляем дату, время и место рождения на сервер.'), false);
  assert.equal(html.includes('Натальная карта'), false);
  assert.equal(html.includes('Транзиты'), false);
  assert.equal(html.includes('ASC'), false);
  assert.equal(html.includes('MC'), false);
});

test('profile edit/delete and active selection flow use explicit actions', () => {
  assert.equal(appJs.includes('updateProfile'), true);
  assert.equal(appJs.includes('deleteProfile'), true);
  assert.equal(appJs.includes('window.confirm'), true);
  assert.equal(appJs.includes('Удалить профиль? Это действие нельзя отменить.'), true);
  assert.equal(appJs.includes('getActiveProfileId'), true);
  assert.equal(appJs.includes('setActiveProfileId'), true);
  assert.equal(appJs.includes('data-profile-select'), true);
  assert.equal(appJs.includes('data-profile-edit'), true);
  assert.equal(html.includes('Натальная карта'), false);
  assert.equal(html.includes('Выбрать активный профиль'), false);
});

test('profile selection closes the profiles panel without hiding the personal block', () => {
  assert.equal(html.includes('data-profiles-panel\n            hidden'), true);
  assert.equal(appJs.includes('function closeProfilesPanel()'), true);
  assert.equal(appJs.includes('closeProfilesPanel();\n      renderStoredProfilesShell();'), true);
  assert.equal(html.includes('data-personal-context-card hidden'), true);
});

test('profiles panel opens in list mode with add button available', () => {
  assert.equal(html.includes('data-profile-add'), true);
  assert.equal(html.includes('+ Добавить профиль'), true);
  assert.equal(
    appJs.includes('if (shouldOpen) {\n    resetNatalProfileDisclosures();\n    setProfileFormOpen(false);\n  }'),
    true,
  );
});

test('profile selection resets create and edit form state', () => {
  assert.equal(
    appJs.includes('if (result.ok) {\n      resetNatalProfileDisclosures();\n      setProfileFormOpen(false);\n      closeProfilesPanel();'),
    true,
  );
});

test('profile edit form opens only from explicit edit action', () => {
  assert.equal(appJs.includes("const button = event.target.closest('[data-profile-edit]');"), true);
  assert.equal(appJs.includes('setProfileFormOpen(true, profile);'), true);
  assert.equal(appJs.includes('setProfileFormOpen(true, activeProfile'), false);
});

test('natal planets list is collapsible and resets on profile changes', () => {
  assert.equal(appJs.includes('let expandedNatalPlanetsProfileId = null;'), true);
  assert.equal(appJs.includes('function resetNatalProfileDisclosures()'), true);
  assert.equal(appJs.includes('const isExpanded = view.canTogglePlanets'), true);
  assert.equal(appJs.includes("elements.natalPlanetsToggle.textContent = isExpanded ? 'Скрыть' : 'Показать';"), true);
  assert.equal(appJs.includes('elements.natalPlanetsList.hidden = !isExpanded;'), true);
  assert.equal(appJs.includes('expandedNatalPlanetsProfileId = isExpanded ? null : profileId;'), true);
  assert.equal(appJs.includes('resetNatalProfileDisclosures();\n    setProfileFormOpen(false);'), true);
  assert.equal(appJs.includes('resetNatalProfileDisclosures();\n      setProfileFormOpen(false);'), true);
});

test('natal aspects list is collapsible and resets on profile changes', () => {
  assert.equal(appJs.includes('let expandedNatalAspectsProfileId = null;'), true);
  assert.equal(appJs.includes('const isExpanded = view.canToggleAspects'), true);
  assert.equal(appJs.includes("elements.natalAspectsToggle.textContent = isExpanded ? 'Скрыть' : 'Показать';"), true);
  assert.equal(appJs.includes('elements.natalAspectsList.hidden = !isExpanded;'), true);
  assert.equal(appJs.includes('expandedNatalAspectsProfileId = isExpanded ? null : profileId;'), true);
  assert.equal(appJs.includes('expandedNatalAspectsProfileId = null;'), true);
});

test('essential dignities list is collapsible and resets on profile changes', () => {
  assert.equal(appJs.includes('let expandedEssentialDignitiesProfileId = null;'), true);
  assert.equal(appJs.includes('const isExpanded = view.canToggleDignities'), true);
  assert.equal(appJs.includes("elements.essentialDignitiesToggle.textContent = isExpanded ? 'Скрыть' : 'Показать';"), true);
  assert.equal(appJs.includes('elements.essentialDignitiesList.hidden = !isExpanded;'), true);
  assert.equal(appJs.includes('expandedEssentialDignitiesProfileId = isExpanded ? null : profileId;'), true);
  assert.equal(appJs.includes('expandedEssentialDignitiesProfileId = null;'), true);
});

test('detailed dignities list is collapsible without ready summary duplication', () => {
  assert.equal(appJs.includes('let expandedDetailedDignitiesProfileId = null;'), true);
  assert.equal(appJs.includes('const isExpanded = view.canToggleDetailedDignities'), true);
  assert.equal(appJs.includes('elements.detailedDignitiesDisclosure.hidden = !view.canToggleDetailedDignities;'), true);
  assert.equal(appJs.includes('elements.detailedDignitiesSummary.hidden = true;'), true);
  assert.equal(appJs.includes("elements.detailedDignitiesToggle.textContent = isExpanded ? 'Скрыть' : 'Показать';"), true);
  assert.equal(appJs.includes('elements.detailedDignitiesGroups.hidden = !isExpanded;'), true);
  assert.equal(appJs.includes('expandedDetailedDignitiesProfileId = isExpanded ? null : profileId;'), true);
  assert.equal(appJs.includes('expandedDetailedDignitiesProfileId = null;'), true);
});

test('detailed dignities header keeps toggle aligned with title without summary row', () => {
  assert.equal(stylesCss.includes('.detailed-dignities-readiness,\n.houses-readiness,\n.arabic-parts-readiness,\n.special-points-readiness {\n  grid-template-columns: minmax(0, 1fr) auto;'), true);
  assert.equal(stylesCss.includes('.detailed-dignities-readiness > h3,\n.houses-readiness > h3,\n.arabic-parts-readiness > h3,\n.special-points-readiness > h3 {\n  grid-column: 1;\n  grid-row: 1;'), true);
  assert.equal(stylesCss.includes('.detailed-dignities-disclosure,\n.houses-disclosure,\n.arabic-parts-disclosure,\n.special-points-disclosure {\n  grid-column: 2;\n  grid-row: 1;'), true);
  assert.equal(stylesCss.includes('  justify-self: end;\n  align-self: center;'), true);
  assert.equal(stylesCss.includes('.detailed-dignities-readiness > .detailed-dignities-status,\n.detailed-dignities-readiness > [data-detailed-dignities-explanation],\n.detailed-dignities-readiness > .detailed-dignities-groups,\n.detailed-dignities-readiness > .detailed-dignities-limitations,\n.houses-readiness > .houses-status,\n.houses-readiness > [data-houses-explanation],\n.houses-readiness > .houses-content,\n.arabic-parts-readiness > .arabic-parts-status,\n.arabic-parts-readiness > [data-arabic-parts-explanation],\n.arabic-parts-readiness > .arabic-parts-content,\n.special-points-readiness > .special-points-status,\n.special-points-readiness > [data-special-points-explanation],\n.special-points-readiness > .special-points-content {\n  grid-column: 1 / -1;'), true);
});

test('home screen renders hidden warnings card shell', () => {
  assert.equal(html.includes('Осторожно сегодня'), true);
  assert.equal(html.includes('data-warnings-card hidden'), true);
  assert.equal(html.includes('data-warnings'), true);
});

test('home screen renders hidden best window card shell', () => {
  assert.equal(html.includes('class="glass-card best-window-card"'), true);
  assert.equal(html.includes('data-best-window-card hidden'), true);
  assert.equal(html.includes('data-best-window-title'), true);
  assert.equal(html.includes('data-best-window-times'), true);
  assert.equal(html.includes('data-best-window-fallback'), true);
  assert.equal(html.includes('data-best-window-suitable'), true);
  assert.equal(html.includes('data-best-window-reasons'), true);
  assert.equal(html.includes('data-best-window-cautions'), true);
  assert.equal(html.includes('Лучшее окно сегодня'), true);
});

test('home screen renders hidden debug panel shell', () => {
  assert.equal(html.includes('data-debug-panel hidden'), true);
  assert.equal(html.includes('data-debug-content'), true);
  assert.equal(html.includes('Debug'), true);
  assert.equal(html.includes('Personal Debug'), false);
  assert.equal(html.includes('Natal Engine Debug'), false);
  assert.equal(appJs.includes('personalDebug: shouldShowDebug ? getPersonalDebugState() : null'), true);
  assert.equal(appJs.includes('function getPersonalDebugState()'), true);
});

test('home screen places warnings between VOC and Moon aspects', () => {
  const vocIndex = html.indexOf('class="glass-card voc-card"');
  const warningsIndex = html.indexOf('data-warnings-card hidden');
  const aspectsIndex = html.indexOf('class="glass-card moon-aspects-card"');

  assert.equal(vocIndex >= 0, true);
  assert.equal(warningsIndex >= 0, true);
  assert.equal(aspectsIndex >= 0, true);
  assert.equal(vocIndex < warningsIndex, true);
  assert.equal(warningsIndex < aspectsIndex, true);
});

test('home screen places mode selector after warnings and before Moon aspects', () => {
  const warningsIndex = html.indexOf('data-warnings-card hidden');
  const profileIndex = html.indexOf('class="glass-card profile-card"');
  const personalIndex = html.indexOf('data-personal-context-card hidden');
  const modeIndex = html.indexOf('data-mode-selector');
  const aspectsIndex = html.indexOf('class="glass-card moon-aspects-card"');

  assert.equal(warningsIndex >= 0, true);
  assert.equal(profileIndex >= 0, true);
  assert.equal(personalIndex >= 0, true);
  assert.equal(modeIndex >= 0, true);
  assert.equal(aspectsIndex >= 0, true);
  assert.equal(warningsIndex < profileIndex, true);
  assert.equal(profileIndex < personalIndex, true);
  assert.equal(personalIndex < modeIndex, true);
  assert.equal(modeIndex < aspectsIndex, true);
});

test('home screen places best window after field quality and before debug panel', () => {
  const fieldIndex = html.indexOf('class="glass-card field-card"');
  const bestWindowIndex = html.indexOf('data-best-window-card hidden');
  const debugIndex = html.indexOf('data-debug-panel hidden');

  assert.equal(fieldIndex >= 0, true);
  assert.equal(bestWindowIndex >= 0, true);
  assert.equal(debugIndex >= 0, true);
  assert.equal(fieldIndex < bestWindowIndex, true);
  assert.equal(bestWindowIndex < debugIndex, true);
});
