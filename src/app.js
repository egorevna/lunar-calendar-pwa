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
import { describeMoonPrecision } from './moonPrecisionDisplay.js';
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
} from './bestWindows.js';

let selectedDashboardMode = DEFAULT_DASHBOARD_MODE;

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
  elements.phase.textContent = majorPhase
    ? `${majorPhase.name} в ${formatTime(majorPhase.at)}`
    : lunar.phaseName;
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
  renderBestWindows(describeBestWindows(getBestWindows({ selectedMode: selectedDashboardMode, now }), selectedDashboardMode));
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

render();
window.setInterval(render, 30000);
