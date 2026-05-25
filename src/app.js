import {
  getLunarInfo,
  getMoonSignInfo,
  getPlanetaryDay,
  getPlanetaryHour,
  getVoidOfCourse,
} from './astro.js';
import {
  formatDate,
  formatRange,
  formatTime,
  formatWeekday,
} from './format.js';
import {
  getPreciseLunarDayInfo,
  getPreciseMajorMoonPhase,
  getNextPreciseMajorMoonPhase,
  getPreciseMoonAspectInfo,
  getPreciseMoonSignInfo,
  getPreciseSolarMonthBranch,
  getPreciseVoidOfCourse,
} from './preciseEphemeris.js';
import { getDayIndicators } from './dayIndicators.js';
import { getFieldQuality } from './fieldQuality.js';
import { getDebugDate } from './debugDate.js';
import {
  describeVoc,
  describeVocAspect,
} from './vocDisplay.js';
import {
  describeMoonAspect,
  describeMoonAspectInterpretation,
  describeNextMoonAspect,
} from './moonAspectsDisplay.js';
import {
  describeHeroMoonPhase,
  describeMoonPrecision,
} from './moonPrecisionDisplay.js';
import { describePlanetaryHourHint } from './planetaryHourHints.js';
import { describeMoonIngress } from './moonSignDisplay.js';
import { PRECISE_EPHEMERIS } from './ephemeris-data.js';
import {
  describeDebugPanel,
  isDebugMode,
} from './debugPanel.js';
import {
  DEFAULT_DASHBOARD_MODE,
  isDashboardModeKey,
} from './dashboardModes.js';
import { getModeScores } from './modeScores.js';
import { getModeRecommendations } from './modeRecommendations.js';
import {
  describeBestWindows,
  getBestWindows,
  getBestWindowsDebug,
} from './bestWindows.js';
import { exportProfilesData, importProfilesIntoStorage } from './profileImportExport.js';
import { createProfileDraft } from './profileModel.js';
import { createPersonalContext } from './personalContext.js';
import {
  addProfile,
  deleteProfile,
  getActiveProfileId,
  loadProfiles,
  setActiveProfileId,
  updateProfile,
} from './profileStorage.js';
import {
  describeDetailedDignitiesBlock,
  describeEssentialDignitiesBlock,
  describeHousesBlock,
  describeNatalAspectsBlock,
  describeNatalPlanetsReadinessBlock,
  describeProfileFormMode,
  describeProfileFormValues,
  describePersonalContextBlock,
  describeProfilesShell,
  describeProfileValidationErrors,
} from './profileUi.js';

let selectedDashboardMode = DEFAULT_DASHBOARD_MODE;
let editingProfileId = null;
let expandedNatalPlanetsProfileId = null;
let expandedNatalAspectsProfileId = null;
let expandedEssentialDignitiesProfileId = null;
let expandedDetailedDignitiesProfileId = null;
let expandedHousesProfileId = null;

const DELETE_PROFILE_CONFIRMATION = 'Удалить профиль? Это действие нельзя отменить.';

const elements = {
  date: document.querySelector('[data-date]'),
  weekday: document.querySelector('[data-weekday]'),
  clock: document.querySelector('[data-clock]'),
  lunarDay: document.querySelector('[data-lunar-day]'),
  phase: document.querySelector('[data-phase]'),
  moonPrecision: document.querySelector('[data-moon-precision]'),
  moonSign: document.querySelector('[data-moon-sign]'),
  nextMoonSign: document.querySelector('[data-next-moon-sign]'),
  voc: document.querySelector('[data-voc]'),
  vocAspect: document.querySelector('[data-voc-aspect]'),
  lastMoonAspect: document.querySelector('[data-last-moon-aspect]'),
  nextMoonAspect: document.querySelector('[data-next-moon-aspect]'),
  moonAspectInterpretation: document.querySelector('[data-moon-aspect-interpretation]'),
  lunarSymbol: document.querySelector('[data-lunar-symbol]'),
  sexagenaryDay: document.querySelector('[data-sexagenary-day]'),
  dayOfficer: document.querySelector('[data-day-officer]'),
  dayGlyph: document.querySelector('[data-day-glyph]'),
  dayName: document.querySelector('[data-planetary-day]'),
  hourGlyph: document.querySelector('[data-hour-glyph]'),
  hourName: document.querySelector('[data-planetary-hour]'),
  hourRange: document.querySelector('[data-hour-range]'),
  hourHint: document.querySelector('[data-hour-hint]'),
  fieldSummary: document.querySelector('[data-field-summary]'),
  fieldAdvice: document.querySelector('[data-field-advice]'),
  fieldMetrics: document.querySelector('[data-field-metrics]'),
  fieldSupports: document.querySelector('[data-field-supports]'),
  fieldAvoid: document.querySelector('[data-field-avoid]'),
  fieldReasons: document.querySelector('[data-field-reasons]'),
  warningsCard: document.querySelector('[data-warnings-card]'),
  warnings: document.querySelector('[data-warnings]'),
  profileCurrent: document.querySelector('[data-profile-current]'),
  profilesToggle: document.querySelector('[data-profiles-toggle]'),
  profilesPanel: document.querySelector('[data-profiles-panel]'),
  profilesList: document.querySelector('[data-profiles-list]'),
  profilesEmpty: document.querySelector('[data-profiles-empty]'),
  profileAdd: document.querySelector('[data-profile-add]'),
  profileNextStep: document.querySelector('[data-profile-next-step]'),
  profileForm: document.querySelector('[data-profile-form]'),
  profileFormTitle: document.querySelector('[data-profile-form-title]'),
  profileFormErrors: document.querySelector('[data-profile-form-errors]'),
  profileFormCancel: document.querySelector('[data-profile-form-cancel]'),
  profileDelete: document.querySelector('[data-profile-delete]'),
  profileExport: document.querySelector('[data-profile-export]'),
  profileImport: document.querySelector('[data-profile-import]'),
  profileImportFile: document.querySelector('[data-profile-import-file]'),
  profileImportStatus: document.querySelector('[data-profile-import-status]'),
  profilePrivacy: document.querySelector('[data-profile-privacy]'),
  natalPlanetsReadiness: document.querySelector('[data-natal-planets-readiness]'),
  natalPlanetsReadinessTitle: document.querySelector('[data-natal-planets-readiness-title]'),
  natalPlanetsReadinessStatus: document.querySelector('[data-natal-planets-readiness-status]'),
  natalPlanetsReadinessExplanation: document.querySelector('[data-natal-planets-readiness-explanation]'),
  natalPlanetsDisclosure: document.querySelector('[data-natal-planets-disclosure]'),
  natalPlanetsSummary: document.querySelector('[data-natal-planets-summary]'),
  natalPlanetsToggle: document.querySelector('[data-natal-planets-toggle]'),
  natalPlanetsList: document.querySelector('[data-natal-planets-list]'),
  natalPlanetsReadinessMissing: document.querySelector('[data-natal-planets-readiness-missing]'),
  natalPlanetsReadinessMissingTitle: document.querySelector('[data-natal-planets-readiness-missing-title]'),
  natalPlanetsReadinessMissingList: document.querySelector('[data-natal-planets-readiness-missing-list]'),
  natalPlanetsReadinessLimitations: document.querySelector('[data-natal-planets-readiness-limitations]'),
  natalAspects: document.querySelector('[data-natal-aspects]'),
  natalAspectsTitle: document.querySelector('[data-natal-aspects-title]'),
  natalAspectsStatus: document.querySelector('[data-natal-aspects-status]'),
  natalAspectsExplanation: document.querySelector('[data-natal-aspects-explanation]'),
  natalAspectsDisclosure: document.querySelector('[data-natal-aspects-disclosure]'),
  natalAspectsSummary: document.querySelector('[data-natal-aspects-summary]'),
  natalAspectsToggle: document.querySelector('[data-natal-aspects-toggle]'),
  natalAspectsList: document.querySelector('[data-natal-aspects-list]'),
  natalAspectsLimitations: document.querySelector('[data-natal-aspects-limitations]'),
  essentialDignities: document.querySelector('[data-essential-dignities]'),
  essentialDignitiesTitle: document.querySelector('[data-essential-dignities-title]'),
  essentialDignitiesStatus: document.querySelector('[data-essential-dignities-status]'),
  essentialDignitiesExplanation: document.querySelector('[data-essential-dignities-explanation]'),
  essentialDignitiesDisclosure: document.querySelector('[data-essential-dignities-disclosure]'),
  essentialDignitiesSummary: document.querySelector('[data-essential-dignities-summary]'),
  essentialDignitiesToggle: document.querySelector('[data-essential-dignities-toggle]'),
  essentialDignitiesList: document.querySelector('[data-essential-dignities-list]'),
  essentialDignitiesLimitations: document.querySelector('[data-essential-dignities-limitations]'),
  detailedDignities: document.querySelector('[data-detailed-dignities]'),
  detailedDignitiesTitle: document.querySelector('[data-detailed-dignities-title]'),
  detailedDignitiesStatus: document.querySelector('[data-detailed-dignities-status]'),
  detailedDignitiesExplanation: document.querySelector('[data-detailed-dignities-explanation]'),
  detailedDignitiesDisclosure: document.querySelector('[data-detailed-dignities-disclosure]'),
  detailedDignitiesSummary: document.querySelector('[data-detailed-dignities-summary]'),
  detailedDignitiesToggle: document.querySelector('[data-detailed-dignities-toggle]'),
  detailedDignitiesGroups: document.querySelector('[data-detailed-dignities-groups]'),
  detailedDignitiesLimitations: document.querySelector('[data-detailed-dignities-limitations]'),
  houses: document.querySelector('[data-houses-readiness]'),
  housesTitle: document.querySelector('[data-houses-title]'),
  housesStatus: document.querySelector('[data-houses-status]'),
  housesExplanation: document.querySelector('[data-houses-explanation]'),
  housesDisclosure: document.querySelector('[data-houses-disclosure]'),
  housesSummary: document.querySelector('[data-houses-summary]'),
  housesToggle: document.querySelector('[data-houses-toggle]'),
  housesContent: document.querySelector('[data-houses-content]'),
  housesMessage: document.querySelector('[data-houses-message]'),
  housesAngles: document.querySelector('[data-houses-angles]'),
  housesListTitle: document.querySelector('[data-houses-list-title]'),
  housesList: document.querySelector('[data-houses-list]'),
  housesPlanetAssignmentsTitle: document.querySelector('[data-houses-planet-assignments-title]'),
  housesPlanetAssignments: document.querySelector('[data-houses-planet-assignments]'),
  housesLimitations: document.querySelector('[data-houses-limitations]'),
  personalContextCard: document.querySelector('[data-personal-context-card]'),
  personalContextTitle: document.querySelector('[data-personal-context-title]'),
  personalContextSummary: document.querySelector('[data-personal-context-summary]'),
  personalContextSections: document.querySelector('[data-personal-context-sections]'),
  bestWindowCard: document.querySelector('[data-best-window-card]'),
  bestWindowTitle: document.querySelector('[data-best-window-title]'),
  bestWindowTimes: document.querySelector('[data-best-window-times]'),
  bestWindowFallback: document.querySelector('[data-best-window-fallback]'),
  bestWindowSuitable: document.querySelector('[data-best-window-suitable]'),
  bestWindowReasons: document.querySelector('[data-best-window-reasons]'),
  bestWindowCautions: document.querySelector('[data-best-window-cautions]'),
  debugPanel: document.querySelector('[data-debug-panel]'),
  debugContent: document.querySelector('[data-debug-content]'),
  modeSelector: document.querySelector('[data-mode-selector]'),
  modeButtons: document.querySelectorAll('[data-mode-button]'),
};

function render() {
  const debugDate = getDebugDate();
  const now = debugDate ?? new Date();
  const shouldShowDebug = isDebugMode();
  const lunar = getLunarInfo(now);
  const planetaryDay = getPlanetaryDay(now);
  const planetaryHour = getPlanetaryHour(now);
  const voc = getPreciseVoidOfCourse(now) ?? getVoidOfCourse(now);
  const moonSign = getPreciseMoonSignInfo(now) ?? getMoonSignInfo(now);
  const moonAspects = getPreciseMoonAspectInfo(now);
  const majorPhase = getPreciseMajorMoonPhase(now);
  const nextMajorPhase = getNextPreciseMajorMoonPhase(now);
  const lunarDay = getPreciseLunarDayInfo(now)?.lunarDay ?? lunar.lunarDay;
  const solarMonthBranch = getPreciseSolarMonthBranch(now)?.key;
  const indicators = getDayIndicators(now, { lunarDay, solarMonthBranch });
  const fieldQuality = getFieldQuality({
    now,
    lunar: { ...lunar, lunarDay },
    voc,
    moonSign,
    moonAspects,
    indicators,
    planetaryHour,
  });
  const modeContext = {
    now,
    lunar: { ...lunar, lunarDay },
    voc,
    moonSign,
    moonAspects,
    indicators,
    planetaryHour,
    warnings: fieldQuality.warnings,
  };

  elements.date.textContent = formatDate(now);
  elements.weekday.textContent = formatWeekday(now);
  elements.clock.textContent = formatTime(now);
  elements.lunarDay.textContent = `${lunarDay}-й лунный день`;
  elements.phase.textContent = describeHeroMoonPhase({
    lunar,
    majorPhase,
    nextPhase: nextMajorPhase,
    now,
  });
  renderMoonPrecision(describeMoonPrecision({ lunar, nextPhase: nextMajorPhase, now }));
  elements.moonSign.textContent = `Луна в ${moonSign.current.glyph} ${moonSign.current.locative}`;
  elements.nextMoonSign.textContent = describeMoonIngress(moonSign, now);
  elements.voc.textContent = describeVoc(voc, now);
  renderVocAspect(voc);
  elements.lastMoonAspect.textContent = describeMoonAspect(moonAspects?.previous, now);
  elements.nextMoonAspect.textContent = describeNextMoonAspect(moonAspects?.next, now);
  renderMoonAspectInterpretation(moonAspects?.next);
  elements.lunarSymbol.textContent = indicators.lunarSymbol.name;
  elements.sexagenaryDay.textContent = indicators.sexagenaryDay.name;
  elements.dayOfficer.textContent = indicators.dayOfficer.name;
  elements.dayGlyph.textContent = planetaryDay.glyph;
  elements.dayName.textContent = planetaryDay.name;
  elements.hourGlyph.textContent = planetaryHour.glyph;
  elements.hourName.textContent = planetaryHour.name;
  elements.hourRange.textContent = formatRange(planetaryHour.startsAt, planetaryHour.endsAt);
  renderPlanetaryHourHint(describePlanetaryHourHint(planetaryHour.key));
  elements.fieldSummary.textContent = fieldQuality.summary;
  elements.fieldAdvice.textContent = fieldQuality.advice;
  renderFieldMetrics(getModeScores(selectedDashboardMode, modeContext, fieldQuality));
  const modeRecommendations = getModeRecommendations(selectedDashboardMode, modeContext, fieldQuality);
  renderSimpleList(elements.fieldSupports, modeRecommendations.good);
  renderSimpleList(elements.fieldAvoid, modeRecommendations.careful);
  renderFieldReasons(fieldQuality.reasons);
  renderWarnings(fieldQuality.warnings);
  renderStoredProfilesShell();
  const bestWindows = getBestWindows({ selectedMode: selectedDashboardMode, now });
  renderBestWindows(describeBestWindows(bestWindows, selectedDashboardMode));
  renderModeSelector();
  renderDebugPanel({
    now,
    debugDate,
    lunarDay,
    solarMonthBranch,
    moonSign,
    voc,
    moonAspects,
    indicators,
    ephemeris: PRECISE_EPHEMERIS,
    bestWindowsDebug: shouldShowDebug
      ? getBestWindowsDebug({ selectedMode: selectedDashboardMode, now })
      : null,
    profileDebug: shouldShowDebug ? getProfileDebugState() : null,
    personalDebug: shouldShowDebug ? getPersonalDebugState() : null,
  });
}

function setDashboardMode(mode) {
  if (!isDashboardModeKey(mode)) return;
  selectedDashboardMode = mode;
  render();
}

function renderModeSelector() {
  elements.modeButtons.forEach((button) => {
    const isSelected = button.dataset.modeButton === selectedDashboardMode;
    button.setAttribute('aria-pressed', String(isSelected));
  });
}

function renderDebugPanel(context) {
  const shouldShow = isDebugMode();
  elements.debugPanel.hidden = !shouldShow;
  elements.debugContent.textContent = shouldShow ? describeDebugPanel(context) : '';
}

function renderFieldMetrics(metrics) {
  elements.fieldMetrics.replaceChildren(...metrics.map((metric) => {
    const row = document.createElement('div');
    row.className = 'field-metric';

    const label = document.createElement('span');
    label.textContent = metric.label;

    const value = document.createElement('strong');
    value.textContent = `${metric.level} · ${(metric.value ?? metric.score)}/10`;

    row.append(label, value);
    return row;
  }));
}

function renderMoonPrecision(rows) {
  elements.moonPrecision.hidden = rows.length === 0;
  elements.moonPrecision.replaceChildren(...rows.map((text) => {
    const row = document.createElement('span');
    row.textContent = text;
    return row;
  }));
}

function renderFieldReasons(reasons) {
  renderSimpleList(elements.fieldReasons, reasons);
}

function renderWarnings(warnings = []) {
  elements.warningsCard.hidden = warnings.length === 0;
  renderSimpleList(elements.warnings, warnings);
}

function renderProfilesShell(view) {
  elements.profileCurrent.textContent = view.currentLabel;
  elements.profilesList.replaceChildren(...view.items.map((profile) => {
    const item = document.createElement('li');
    const name = document.createElement('span');
    name.className = 'profile-list-name';
    name.textContent = profile.label;
    item.append(name);

    if (profile.active) {
      const status = document.createElement('span');
      status.className = 'profile-active-badge';
      status.textContent = 'активен';
      item.append(status);
    }

    if (profile.selectable) {
      const selectButton = document.createElement('button');
      selectButton.type = 'button';
      selectButton.textContent = 'Выбрать';
      selectButton.dataset.profileSelect = profile.id;
      item.append(selectButton);
    }

    if (profile.editable) {
      const editButton = document.createElement('button');
      editButton.type = 'button';
      editButton.textContent = 'Редактировать';
      editButton.dataset.profileEdit = profile.id;
      item.append(editButton);
    }

    if (!profile.editable) {
      item.className = 'profile-general-item';
    }
    return item;
  }));
  elements.profilesEmpty.hidden = !view.emptyTitle;
  elements.profilesEmpty.querySelector('p').textContent = view.emptyTitle;
  elements.profilesEmpty.querySelector('span').textContent = view.emptyHint;
  elements.profileAdd.textContent = view.addButtonLabel;
  elements.profileNextStep.textContent = view.addButtonHelp;
  elements.profilePrivacy.textContent = view.privacyCopy;
}

function renderStoredProfilesShell() {
  const profiles = loadProfiles();
  const activeProfileId = getActiveProfileId();
  const activeProfile = profiles.find((profile) => profile.id === activeProfileId) ?? null;

  renderProfilesShell(describeProfilesShell(profiles, activeProfileId));
  renderNatalPlanetsReadinessBlock(describeNatalPlanetsReadinessBlock(activeProfile));
  renderNatalAspectsBlock(describeNatalAspectsBlock(activeProfile));
  renderEssentialDignitiesBlock(describeEssentialDignitiesBlock(activeProfile));
  renderDetailedDignitiesBlock(describeDetailedDignitiesBlock(activeProfile));
  renderHousesBlock(describeHousesBlock(activeProfile));
  renderPersonalContextBlock(describePersonalContextBlock(createPersonalContext(activeProfile)));
}

function renderNatalPlanetsReadinessBlock(view) {
  const isExpanded = view.canTogglePlanets
    && Boolean(view.profileId)
    && expandedNatalPlanetsProfileId === view.profileId;

  elements.natalPlanetsReadiness.hidden = view.hidden;
  elements.natalPlanetsReadinessTitle.textContent = view.title;
  elements.natalPlanetsReadinessStatus.textContent = view.status;
  elements.natalPlanetsReadinessStatus.hidden = !view.status;
  elements.natalPlanetsReadinessExplanation.textContent = view.explanation;
  elements.natalPlanetsReadinessExplanation.hidden = !view.explanation;
  elements.natalPlanetsDisclosure.hidden = !view.canTogglePlanets;
  elements.natalPlanetsSummary.textContent = view.summary;
  elements.natalPlanetsSummary.hidden = !view.summary;
  elements.natalPlanetsToggle.hidden = !view.canTogglePlanets;
  elements.natalPlanetsToggle.textContent = isExpanded ? 'Скрыть' : 'Показать';
  elements.natalPlanetsToggle.setAttribute('aria-expanded', String(isExpanded));
  elements.natalPlanetsToggle.dataset.profileId = view.canTogglePlanets ? view.profileId : '';
  renderSimpleList(elements.natalPlanetsList, view.planets);
  elements.natalPlanetsList.hidden = !isExpanded;
  elements.natalPlanetsReadinessMissing.hidden = !view.missingFields.length;
  elements.natalPlanetsReadinessMissingTitle.textContent = view.missingTitle;
  renderSimpleList(elements.natalPlanetsReadinessMissingList, view.missingFields);
  renderSimpleList(elements.natalPlanetsReadinessLimitations, view.limitations);
}

function renderNatalAspectsBlock(view) {
  const isExpanded = view.canToggleAspects
    && Boolean(view.profileId)
    && expandedNatalAspectsProfileId === view.profileId;

  elements.natalAspects.hidden = view.hidden;
  elements.natalAspectsTitle.textContent = view.title;
  elements.natalAspectsStatus.textContent = view.status;
  elements.natalAspectsStatus.hidden = !view.status;
  elements.natalAspectsExplanation.textContent = view.explanation;
  elements.natalAspectsExplanation.hidden = !view.explanation;
  elements.natalAspectsDisclosure.hidden = !view.summary;
  elements.natalAspectsSummary.textContent = view.summary;
  elements.natalAspectsSummary.hidden = !view.summary;
  elements.natalAspectsToggle.hidden = !view.canToggleAspects;
  elements.natalAspectsToggle.textContent = isExpanded ? 'Скрыть' : 'Показать';
  elements.natalAspectsToggle.setAttribute('aria-expanded', String(isExpanded));
  elements.natalAspectsToggle.dataset.profileId = view.canToggleAspects ? view.profileId : '';
  renderSimpleList(elements.natalAspectsList, view.aspects);
  elements.natalAspectsList.hidden = !isExpanded;
  renderSimpleList(elements.natalAspectsLimitations, view.limitations);
  elements.natalAspectsLimitations.hidden = view.limitations.length === 0;
}

function renderEssentialDignitiesBlock(view) {
  const isExpanded = view.canToggleDignities
    && Boolean(view.profileId)
    && expandedEssentialDignitiesProfileId === view.profileId;

  elements.essentialDignities.hidden = view.hidden;
  elements.essentialDignitiesTitle.textContent = view.title;
  elements.essentialDignitiesStatus.textContent = view.status;
  elements.essentialDignitiesStatus.hidden = !view.status;
  elements.essentialDignitiesExplanation.textContent = view.explanation;
  elements.essentialDignitiesExplanation.hidden = !view.explanation;
  elements.essentialDignitiesDisclosure.hidden = !view.summary;
  elements.essentialDignitiesSummary.textContent = view.summary;
  elements.essentialDignitiesSummary.hidden = !view.summary;
  elements.essentialDignitiesToggle.hidden = !view.canToggleDignities;
  elements.essentialDignitiesToggle.textContent = isExpanded ? 'Скрыть' : 'Показать';
  elements.essentialDignitiesToggle.setAttribute('aria-expanded', String(isExpanded));
  elements.essentialDignitiesToggle.dataset.profileId = view.canToggleDignities ? view.profileId : '';
  renderSimpleList(elements.essentialDignitiesList, view.dignities);
  elements.essentialDignitiesList.hidden = !isExpanded;
  renderSimpleList(elements.essentialDignitiesLimitations, view.limitations);
  elements.essentialDignitiesLimitations.hidden = view.limitations.length === 0;
}

function renderDetailedDignitiesBlock(view) {
  const isExpanded = view.canToggleDetailedDignities
    && Boolean(view.profileId)
    && expandedDetailedDignitiesProfileId === view.profileId;

  elements.detailedDignities.hidden = view.hidden;
  elements.detailedDignitiesTitle.textContent = view.title;
  elements.detailedDignitiesStatus.textContent = view.status;
  elements.detailedDignitiesStatus.hidden = !view.status;
  elements.detailedDignitiesExplanation.textContent = view.explanation;
  elements.detailedDignitiesExplanation.hidden = !view.explanation;
  elements.detailedDignitiesDisclosure.hidden = !view.canToggleDetailedDignities;
  elements.detailedDignitiesSummary.textContent = view.summary;
  elements.detailedDignitiesSummary.hidden = true;
  elements.detailedDignitiesToggle.hidden = !view.canToggleDetailedDignities;
  elements.detailedDignitiesToggle.textContent = isExpanded ? 'Скрыть' : 'Показать';
  elements.detailedDignitiesToggle.setAttribute('aria-expanded', String(isExpanded));
  elements.detailedDignitiesToggle.dataset.profileId = view.canToggleDetailedDignities ? view.profileId : '';
  renderDetailedDignityGroups(elements.detailedDignitiesGroups, view.groups);
  elements.detailedDignitiesGroups.hidden = !isExpanded;
  renderSimpleList(elements.detailedDignitiesLimitations, view.limitations);
  elements.detailedDignitiesLimitations.hidden = view.limitations.length === 0;
}

function renderHousesBlock(view) {
  const isExpanded = view.canToggleHouses
    && Boolean(view.profileId)
    && expandedHousesProfileId === view.profileId;

  elements.houses.hidden = view.hidden;
  elements.housesTitle.textContent = view.title;
  elements.housesStatus.textContent = view.status || view.summary;
  elements.housesStatus.hidden = !(view.status || view.summary);
  elements.housesExplanation.textContent = view.explanation;
  elements.housesExplanation.hidden = !view.explanation;
  elements.housesDisclosure.hidden = !view.canToggleHouses;
  elements.housesSummary.textContent = view.summary;
  elements.housesSummary.hidden = true;
  elements.housesToggle.hidden = !view.canToggleHouses;
  elements.housesToggle.textContent = isExpanded ? 'Скрыть' : 'Показать';
  elements.housesToggle.setAttribute('aria-expanded', String(isExpanded));
  elements.housesToggle.dataset.profileId = view.canToggleHouses ? view.profileId : '';
  elements.housesContent.hidden = !isExpanded;
  elements.housesMessage.textContent = '';
  elements.housesMessage.hidden = true;
  renderSimpleList(elements.housesAngles, view.angles);
  elements.housesAngles.hidden = !isExpanded || view.angles.length === 0;
  elements.housesListTitle.hidden = !isExpanded || view.houses.length === 0;
  renderSimpleList(elements.housesList, view.houses);
  elements.housesList.hidden = !isExpanded || view.houses.length === 0;
  elements.housesPlanetAssignmentsTitle.hidden = !isExpanded || view.planetAssignments.length === 0;
  renderSimpleList(elements.housesPlanetAssignments, view.planetAssignments);
  elements.housesPlanetAssignments.hidden = !isExpanded || view.planetAssignments.length === 0;
  renderSimpleList(elements.housesLimitations, view.limitations);
  elements.housesLimitations.hidden = !isExpanded || view.limitations.length === 0;
}

function renderPersonalContextBlock(view) {
  elements.personalContextCard.hidden = view.hidden;
  elements.personalContextTitle.textContent = view.title;
  elements.personalContextSummary.textContent = view.summary;
  const sections = Array.isArray(view.sections) ? view.sections : [];
  elements.personalContextSections.replaceChildren(...sections.map((section) => {
    const sectionElement = document.createElement('section');
    sectionElement.className = 'personal-context-section';

    const title = document.createElement('h3');
    title.textContent = section.title;
    sectionElement.append(title);

    const list = document.createElement('ul');
    list.replaceChildren(...section.items.map((item) => {
      const listItem = document.createElement('li');
      listItem.textContent = item;
      return listItem;
    }));
    sectionElement.append(list);

    return sectionElement;
  }));
}

function getProfileDebugState() {
  const profiles = loadProfiles();
  const activeProfileId = getActiveProfileId();
  const activeProfile = profiles.find((profile) => profile.id === activeProfileId);

  return {
    profilesCount: profiles.length,
    activeProfileId,
    activeProfileName: activeProfile?.name ?? 'Общий день',
    storage: 'localStorage',
    sync: 'disabled',
    serverUpload: 'disabled',
    importExport: 'enabled',
  };
}

function getPersonalDebugState() {
  const profiles = loadProfiles();
  const activeProfileId = getActiveProfileId();
  const activeProfile = profiles.find((profile) => profile.id === activeProfileId) ?? null;
  const personalContext = createPersonalContext(activeProfile);

  return {
    profilesCount: profiles.length,
    activeProfileId,
    activeProfileName: personalContext.profileName ?? 'Общий день',
    hasActiveProfile: personalContext.hasActiveProfile,
    personalStatus: personalContext.status,
    profilesStorage: 'localStorage',
    sync: 'disabled',
    serverUpload: 'disabled',
    geocoding: 'disabled',
    natalEngine: 'not connected',
    capabilities: personalContext.capabilities,
    missingFields: describePersonalDebugMissingFields(personalContext.missingFields),
    warnings: personalContext.warnings,
  };
}

function describePersonalDebugMissingFields(fields = []) {
  const labels = {
    birthDate: 'дата рождения',
    birthTime: 'время рождения',
    'birthPlace.coordinates': 'координаты места рождения',
    'birthPlace.timezone': 'часовой пояс места рождения',
  };

  return Array.isArray(fields)
    ? fields.map((field) => labels[field]).filter(Boolean)
    : [];
}

function profileFromForm(form, baseProfile = createProfileDraft()) {
  const data = new FormData(form);
  const birthTimeAccuracy = String(data.get('birthTimeAccuracy') ?? 'exact');

  return {
    ...baseProfile,
    name: String(data.get('name') ?? ''),
    birthDate: String(data.get('birthDate') ?? ''),
    birthTime: birthTimeAccuracy === 'unknown' ? '' : String(data.get('birthTime') ?? ''),
    birthTimeAccuracy,
    birthPlace: {
      ...baseProfile.birthPlace,
      city: String(data.get('birthCity') ?? ''),
      country: String(data.get('birthCountry') ?? ''),
      timezone: String(data.get('birthTimezone') ?? ''),
      coordinates: buildBirthCoordinates(data),
    },
    currentPlace: {
      ...baseProfile.currentPlace,
      mode: 'moscow',
      city: 'Москва',
      country: 'Россия',
      timezone: 'Europe/Moscow',
    },
    houseSystem: String(data.get('houseSystem') ?? 'wholeSign'),
    zodiac: String(data.get('zodiac') ?? 'tropical'),
  };
}

function parseOptionalCoordinate(value) {
  const text = String(value ?? '').trim();

  if (!text) {
    return undefined;
  }

  const coordinate = Number(text);

  return Number.isFinite(coordinate) ? coordinate : Number.NaN;
}

function buildBirthCoordinates(data) {
  const latitude = parseOptionalCoordinate(data.get('birthLatitude'));
  const longitude = parseOptionalCoordinate(data.get('birthLongitude'));

  if (latitude === undefined && longitude === undefined) {
    return undefined;
  }

  return { latitude, longitude };
}

function setProfileFormOpen(isOpen, profile = null) {
  editingProfileId = profile?.id ?? null;
  const modeView = describeProfileFormMode(editingProfileId ? 'edit' : 'create');

  elements.profileForm.hidden = !isOpen;
  elements.profileAdd.hidden = isOpen;
  elements.profileNextStep.hidden = isOpen;
  elements.profileFormTitle.textContent = modeView.title;
  elements.profileDelete.hidden = !modeView.deleteVisible;

  if (isOpen) {
    fillProfileForm(profile);
    renderProfileFormErrors([]);
  } else {
    editingProfileId = null;
    elements.profileForm.reset();
    updateBirthTimeState();
    renderProfileFormErrors([]);
  }
}

function fillProfileForm(profile = null) {
  const values = describeProfileFormValues(profile ?? createProfileDraft());

  elements.profileForm.elements.name.value = values.name;
  elements.profileForm.elements.birthDate.value = values.birthDate;
  elements.profileForm.elements.birthTime.value = values.birthTime;
  elements.profileForm.elements.birthTimeAccuracy.value = values.birthTimeAccuracy;
  elements.profileForm.elements.birthCity.value = values.birthCity;
  elements.profileForm.elements.birthCountry.value = values.birthCountry;
  elements.profileForm.elements.birthTimezone.value = values.birthTimezone;
  elements.profileForm.elements.birthLatitude.value = values.birthLatitude;
  elements.profileForm.elements.birthLongitude.value = values.birthLongitude;
  elements.profileForm.elements.houseSystem.value = values.houseSystem;
  elements.profileForm.elements.zodiac.value = values.zodiac;
  updateBirthTimeState();
}

function renderProfileFormErrors(errors) {
  elements.profileFormErrors.hidden = errors.length === 0;
  elements.profileFormErrors.replaceChildren(...errors.map((text) => {
    const item = document.createElement('li');
    item.textContent = text;
    return item;
  }));
}

function renderProfileImportStatus(text) {
  elements.profileImportStatus.hidden = !text;
  elements.profileImportStatus.textContent = text;
}

function updateBirthTimeState() {
  const birthTimeAccuracy = elements.profileForm.elements.birthTimeAccuracy.value;
  const birthTime = elements.profileForm.elements.birthTime;
  const isUnknown = birthTimeAccuracy === 'unknown';

  birthTime.disabled = isUnknown;
  birthTime.required = !isUnknown;
  if (isUnknown) birthTime.value = '';
}

function resetNatalProfileDisclosures() {
  expandedNatalPlanetsProfileId = null;
  expandedNatalAspectsProfileId = null;
  expandedEssentialDignitiesProfileId = null;
  expandedDetailedDignitiesProfileId = null;
  expandedHousesProfileId = null;
}

function handleProfileFormSubmit(event) {
  event.preventDefault();

  const currentProfile = editingProfileId
    ? loadProfiles().find((profile) => profile.id === editingProfileId)
    : null;
  const formProfile = profileFromForm(elements.profileForm, currentProfile ?? createProfileDraft());
  const result = editingProfileId
    ? updateProfile(editingProfileId, formProfile)
    : addProfile(formProfile);

  if (!result.ok) {
    renderProfileFormErrors(describeProfileValidationErrors(result.errors));
    return;
  }

  setProfileFormOpen(false);
  renderStoredProfilesShell();
}

function handleProfileDelete() {
  if (!editingProfileId) return;
  if (!window.confirm(DELETE_PROFILE_CONFIRMATION)) return;

  deleteProfile(editingProfileId);
  resetNatalProfileDisclosures();
  setProfileFormOpen(false);
  renderStoredProfilesShell();
}

function downloadTextFile({ text, filename, mimeType }) {
  const blob = new Blob([text], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function handleProfileExport() {
  downloadTextFile(exportProfilesData(loadProfiles()));
  renderProfileImportStatus('Экспорт готов.');
}

function handleProfileImportText(jsonText) {
  const result = importProfilesIntoStorage(jsonText);

  if (!result.ok) {
    renderProfileImportStatus('Не удалось импортировать профили.');
    return;
  }

  renderStoredProfilesShell();
  if (result.importedCount > 0 && result.skippedCount > 0) {
    renderProfileImportStatus(`Импортировано: ${result.importedCount}, пропущено: ${result.skippedCount}`);
  } else if (result.importedCount > 0) {
    renderProfileImportStatus(`Импортировано: ${result.importedCount}`);
  } else {
    renderProfileImportStatus('Новые профили не найдены');
  }
}

function handleProfileImportFile(file) {
  if (!file) return;

  const reader = new FileReader();
  reader.addEventListener('load', () => {
    handleProfileImportText(String(reader.result ?? ''));
    elements.profileImportFile.value = '';
  });
  reader.addEventListener('error', () => {
    renderProfileImportStatus('Не удалось прочитать файл.');
    elements.profileImportFile.value = '';
  });
  reader.readAsText(file);
}

function renderBestWindows(view) {
  elements.bestWindowCard.hidden = view.hidden;
  elements.bestWindowTitle.textContent = view.title;
  elements.bestWindowTimes.replaceChildren(...view.ranges.map((range) => {
    const item = document.createElement('strong');
    item.textContent = range;
    return item;
  }));
  elements.bestWindowFallback.hidden = !view.fallback;
  elements.bestWindowFallback.textContent = view.fallback;
  renderBestWindowLine(elements.bestWindowSuitable, 'Подходит для', view.suitableFor);
  renderBestWindowLine(elements.bestWindowReasons, 'Почему', view.reasons);
  renderBestWindowLine(elements.bestWindowCautions, 'Осторожно', view.cautions);
}

function renderBestWindowLine(element, label, items) {
  element.hidden = items.length === 0;
  element.textContent = items.length ? `${label}: ${items.join(', ')}` : '';
}

function renderPlanetaryHourHint(hint) {
  elements.hourHint.hidden = !hint;
  elements.hourHint.textContent = hint;
}

function renderSimpleList(element, items) {
  element.replaceChildren(...items.map((text) => {
    const item = document.createElement('li');
    item.textContent = text;
    return item;
  }));
}

function renderDetailedDignityGroups(element, groups = []) {
  element.replaceChildren(...groups.map((group) => {
    const groupElement = document.createElement('section');
    groupElement.className = 'detailed-dignity-group';

    const title = document.createElement('h4');
    title.textContent = group.planetLabel;
    groupElement.append(title);

    const list = document.createElement('ul');
    list.replaceChildren(...group.items.map((item) => {
      const row = document.createElement('li');

      const text = document.createElement('span');
      text.className = 'detailed-dignity-text';
      text.textContent = item.text;
      row.append(text);

      const detail = [item.detail, item.source].filter(Boolean).join(' · ');
      if (detail) {
        const meta = document.createElement('small');
        meta.className = 'detailed-dignity-detail';
        meta.textContent = detail;
        row.append(meta);
      }

      return row;
    }));
    groupElement.append(list);

    return groupElement;
  }));
}

function renderVocAspect(voc) {
  const lines = describeVocAspect(voc).split('\n').filter(Boolean);
  elements.vocAspect.replaceChildren(...lines.map((text, index) => {
    const line = document.createElement('span');
    line.textContent = text;
    if (index > 0) line.className = 'voc-background';
    return line;
  }));
}

function renderMoonAspectInterpretation(aspect) {
  const text = describeMoonAspectInterpretation(aspect);
  elements.moonAspectInterpretation.textContent = text;
  elements.moonAspectInterpretation.hidden = !text;
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js');
  });
}

elements.modeSelector.addEventListener('click', (event) => {
  const button = event.target.closest('[data-mode-button]');
  if (!button) return;
  setDashboardMode(button.dataset.modeButton);
});

elements.profilesToggle.addEventListener('click', () => {
  const shouldOpen = elements.profilesPanel.hidden;
  if (shouldOpen) {
    resetNatalProfileDisclosures();
    setProfileFormOpen(false);
  }
  elements.profilesPanel.hidden = !shouldOpen;
  elements.profilesToggle.setAttribute('aria-expanded', String(shouldOpen));
});

function closeProfilesPanel() {
  elements.profilesPanel.hidden = true;
  elements.profilesToggle.setAttribute('aria-expanded', 'false');
}

elements.profileAdd.addEventListener('click', () => {
  setProfileFormOpen(true);
});

elements.profilesList.addEventListener('click', (event) => {
  const selectButton = event.target.closest('[data-profile-select]');
  if (selectButton) {
    const profileId = selectButton.dataset.profileSelect || null;
    const result = setActiveProfileId(profileId);
    if (result.ok) {
      resetNatalProfileDisclosures();
      setProfileFormOpen(false);
      closeProfilesPanel();
      renderStoredProfilesShell();
    }
    return;
  }

  const button = event.target.closest('[data-profile-edit]');
  if (!button) return;

  const profile = loadProfiles().find((item) => item.id === button.dataset.profileEdit);
  if (!profile) return;

  setProfileFormOpen(true, profile);
});

elements.profileFormCancel.addEventListener('click', () => {
  setProfileFormOpen(false);
});

elements.natalPlanetsToggle.addEventListener('click', () => {
  const profileId = elements.natalPlanetsToggle.dataset.profileId || null;
  if (!profileId) return;

  const isExpanded = expandedNatalPlanetsProfileId === profileId;
  expandedNatalPlanetsProfileId = isExpanded ? null : profileId;
  renderStoredProfilesShell();
});

elements.natalAspectsToggle.addEventListener('click', () => {
  const profileId = elements.natalAspectsToggle.dataset.profileId || null;
  if (!profileId) return;

  const isExpanded = expandedNatalAspectsProfileId === profileId;
  expandedNatalAspectsProfileId = isExpanded ? null : profileId;
  renderStoredProfilesShell();
});

elements.essentialDignitiesToggle.addEventListener('click', () => {
  const profileId = elements.essentialDignitiesToggle.dataset.profileId || null;
  if (!profileId) return;

  const isExpanded = expandedEssentialDignitiesProfileId === profileId;
  expandedEssentialDignitiesProfileId = isExpanded ? null : profileId;
  renderStoredProfilesShell();
});

elements.detailedDignitiesToggle.addEventListener('click', () => {
  const profileId = elements.detailedDignitiesToggle.dataset.profileId || null;
  if (!profileId) return;

  const isExpanded = expandedDetailedDignitiesProfileId === profileId;
  expandedDetailedDignitiesProfileId = isExpanded ? null : profileId;
  renderStoredProfilesShell();
});

elements.housesToggle.addEventListener('click', () => {
  const profileId = elements.housesToggle.dataset.profileId || null;
  if (!profileId) return;

  const isExpanded = expandedHousesProfileId === profileId;
  expandedHousesProfileId = isExpanded ? null : profileId;
  renderStoredProfilesShell();
});

elements.profileDelete.addEventListener('click', handleProfileDelete);
elements.profileExport.addEventListener('click', handleProfileExport);
elements.profileImport.addEventListener('click', () => {
  elements.profileImportFile.click();
});
elements.profileImportFile.addEventListener('change', () => {
  handleProfileImportFile(elements.profileImportFile.files?.[0] ?? null);
});

elements.profileForm.addEventListener('change', (event) => {
  if (event.target.name === 'birthTimeAccuracy') {
    updateBirthTimeState();
  }
});

elements.profileForm.addEventListener('submit', handleProfileFormSubmit);

render();
window.setInterval(render, 30000);
