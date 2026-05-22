import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const appJs = readFileSync(new URL('../src/app.js', import.meta.url), 'utf8');

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
  assert.equal(html.includes('Добавление профиля — следующий шаг.'), false);
  assert.equal(html.includes('Натальная карта'), false);
  assert.equal(html.includes('Персональные транзиты'), false);
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
    appJs.includes('if (shouldOpen) {\n    resetNatalPlanetsDisclosure();\n    setProfileFormOpen(false);\n  }'),
    true,
  );
});

test('profile selection resets create and edit form state', () => {
  assert.equal(
    appJs.includes('if (result.ok) {\n      resetNatalPlanetsDisclosure();\n      setProfileFormOpen(false);\n      closeProfilesPanel();'),
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
  assert.equal(appJs.includes('function resetNatalPlanetsDisclosure()'), true);
  assert.equal(appJs.includes('const isExpanded = view.canTogglePlanets'), true);
  assert.equal(appJs.includes("elements.natalPlanetsToggle.textContent = isExpanded ? 'Скрыть' : 'Показать';"), true);
  assert.equal(appJs.includes('elements.natalPlanetsList.hidden = !isExpanded;'), true);
  assert.equal(appJs.includes('expandedNatalPlanetsProfileId = isExpanded ? null : profileId;'), true);
  assert.equal(appJs.includes('resetNatalPlanetsDisclosure();\n    setProfileFormOpen(false);'), true);
  assert.equal(appJs.includes('resetNatalPlanetsDisclosure();\n      setProfileFormOpen(false);'), true);
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
