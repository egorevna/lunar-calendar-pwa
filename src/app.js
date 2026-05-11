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
  formatTimeWithSeconds,
  formatWeekday,
} from './format.js';
import {
  getPreciseLunarDayInfo,
  getPreciseMajorMoonPhase,
  getPreciseMoonAspectInfo,
  getPreciseMoonSignInfo,
  getPreciseSolarMonthBranch,
  getPreciseVoidOfCourse,
} from './preciseEphemeris.js';
import { getDayIndicators } from './dayIndicators.js';
import { getFieldQuality } from './fieldQuality.js';
import {
  describeVoc,
  describeVocAspect,
  formatAspect,
  formatPlanet,
} from './vocDisplay.js';

const elements = {
  date: document.querySelector('[data-date]'),
  weekday: document.querySelector('[data-weekday]'),
  clock: document.querySelector('[data-clock]'),
  lunarDay: document.querySelector('[data-lunar-day]'),
  phase: document.querySelector('[data-phase]'),
  moonSign: document.querySelector('[data-moon-sign]'),
  nextMoonSign: document.querySelector('[data-next-moon-sign]'),
  voc: document.querySelector('[data-voc]'),
  vocAspect: document.querySelector('[data-voc-aspect]'),
  lastMoonAspect: document.querySelector('[data-last-moon-aspect]'),
  nextMoonAspect: document.querySelector('[data-next-moon-aspect]'),
  lunarSymbol: document.querySelector('[data-lunar-symbol]'),
  sexagenaryDay: document.querySelector('[data-sexagenary-day]'),
  dayOfficer: document.querySelector('[data-day-officer]'),
  dayGlyph: document.querySelector('[data-day-glyph]'),
  dayName: document.querySelector('[data-planetary-day]'),
  hourGlyph: document.querySelector('[data-hour-glyph]'),
  hourName: document.querySelector('[data-planetary-hour]'),
  hourRange: document.querySelector('[data-hour-range]'),
  fieldSummary: document.querySelector('[data-field-summary]'),
  fieldMetrics: document.querySelector('[data-field-metrics]'),
  fieldSupports: document.querySelector('[data-field-supports]'),
  fieldAvoid: document.querySelector('[data-field-avoid]'),
  fieldReasons: document.querySelector('[data-field-reasons]'),
};

function render() {
  const now = new Date();
  const lunar = getLunarInfo(now);
  const planetaryDay = getPlanetaryDay(now);
  const planetaryHour = getPlanetaryHour(now);
  const voc = getPreciseVoidOfCourse(now) ?? getVoidOfCourse(now);
  const moonSign = getPreciseMoonSignInfo(now) ?? getMoonSignInfo(now);
  const moonAspects = getPreciseMoonAspectInfo(now);
  const majorPhase = getPreciseMajorMoonPhase(now);
  const lunarDay = getPreciseLunarDayInfo(now)?.lunarDay ?? lunar.lunarDay;
  const solarMonthBranch = getPreciseSolarMonthBranch(now)?.key;
  const indicators = getDayIndicators(now, { lunarDay, solarMonthBranch });
  const fieldQuality = getFieldQuality({
    now,
    lunar,
    voc,
    moonSign,
    moonAspects,
    indicators,
    planetaryHour,
  });

  elements.date.textContent = formatDate(now);
  elements.weekday.textContent = formatWeekday(now);
  elements.clock.textContent = formatTime(now);
  elements.lunarDay.textContent = `${lunarDay}-й лунный день`;
  elements.phase.textContent = majorPhase
    ? `${majorPhase.name} в ${formatTimeWithSeconds(majorPhase.at)}`
    : lunar.phaseName;
  elements.moonSign.textContent = `Луна в ${moonSign.current.glyph} ${moonSign.current.locative}`;
  elements.nextMoonSign.textContent = `в ${moonSign.next.name} ${formatMoonIngress(now, moonSign.entersAt)}`;
  elements.voc.textContent = describeVoc(voc, now);
  elements.vocAspect.textContent = describeVocAspect(voc);
  elements.lastMoonAspect.textContent = describeAspect(moonAspects?.previous, 'нет данных');
  elements.nextMoonAspect.textContent = describeAspect(moonAspects?.next, 'нет данных');
  elements.lunarSymbol.textContent = indicators.lunarSymbol.name;
  elements.sexagenaryDay.textContent = indicators.sexagenaryDay.name;
  elements.dayOfficer.textContent = indicators.dayOfficer.name;
  elements.dayGlyph.textContent = planetaryDay.glyph;
  elements.dayName.textContent = planetaryDay.name;
  elements.hourGlyph.textContent = planetaryHour.glyph;
  elements.hourName.textContent = planetaryHour.name;
  elements.hourRange.textContent = formatRange(planetaryHour.startsAt, planetaryHour.endsAt);
  elements.fieldSummary.textContent = fieldQuality.summary;
  renderFieldMetrics(fieldQuality.metrics);
  renderSimpleList(elements.fieldSupports, fieldQuality.supports);
  renderSimpleList(elements.fieldAvoid, fieldQuality.avoid);
  renderFieldReasons(fieldQuality.reasons);
}

function renderFieldMetrics(metrics) {
  elements.fieldMetrics.replaceChildren(...metrics.map((metric) => {
    const row = document.createElement('div');
    row.className = 'field-metric';

    const label = document.createElement('span');
    label.textContent = metric.label;

    const value = document.createElement('strong');
    value.textContent = `${metric.level} · ${metric.score}/10`;

    row.append(label, value);
    return row;
  }));
}

function renderFieldReasons(reasons) {
  renderSimpleList(elements.fieldReasons, reasons);
}

function renderSimpleList(element, items) {
  element.replaceChildren(...items.map((text) => {
    const item = document.createElement('li');
    item.textContent = text;
    return item;
  }));
}

function describeAspect(aspect, fallback) {
  if (!aspect) return fallback;
  return `${formatAspect(aspect.aspect)} ${formatPlanet(aspect.planet)} в ${formatTimeWithSeconds(aspect.at)}`;
}

function formatMoonIngress(now, entersAt) {
  const current = formatDate(now);
  const next = formatDate(entersAt);
  const dayLabel = current === next ? 'сегодня' : 'завтра';
  return `${dayLabel} в ${formatTimeWithSeconds(entersAt)}`;
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js');
  });
}

render();
window.setInterval(render, 30000);
