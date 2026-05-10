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
  formatRangeWithSeconds,
  formatTime,
  formatTimeWithSeconds,
  formatWeekday,
} from './format.js';
import {
  getPreciseLunarDayInfo,
  getPreciseMoonSignInfo,
  getPreciseVoidOfCourse,
} from './preciseEphemeris.js';

const elements = {
  date: document.querySelector('[data-date]'),
  weekday: document.querySelector('[data-weekday]'),
  clock: document.querySelector('[data-clock]'),
  lunarDay: document.querySelector('[data-lunar-day]'),
  phase: document.querySelector('[data-phase]'),
  moonSign: document.querySelector('[data-moon-sign]'),
  nextMoonSign: document.querySelector('[data-next-moon-sign]'),
  voc: document.querySelector('[data-voc]'),
  dayGlyph: document.querySelector('[data-day-glyph]'),
  dayName: document.querySelector('[data-planetary-day]'),
  hourGlyph: document.querySelector('[data-hour-glyph]'),
  hourName: document.querySelector('[data-planetary-hour]'),
  hourRange: document.querySelector('[data-hour-range]'),
};

function render() {
  const now = new Date();
  const lunar = getLunarInfo(now);
  const planetaryDay = getPlanetaryDay(now);
  const planetaryHour = getPlanetaryHour(now);
  const voc = getPreciseVoidOfCourse(now) ?? getVoidOfCourse(now);
  const moonSign = getPreciseMoonSignInfo(now) ?? getMoonSignInfo(now);
  const lunarDay = getPreciseLunarDayInfo(now)?.lunarDay ?? lunar.lunarDay;

  elements.date.textContent = formatDate(now);
  elements.weekday.textContent = formatWeekday(now);
  elements.clock.textContent = formatTime(now);
  elements.lunarDay.textContent = `${lunarDay}-й лунный день`;
  elements.phase.textContent = lunar.phaseName;
  elements.moonSign.textContent = `Луна в ${moonSign.current.glyph} ${moonSign.current.locative}`;
  elements.nextMoonSign.textContent = `в ${moonSign.next.name} ${formatMoonIngress(now, moonSign.entersAt)}`;
  elements.voc.textContent = describeVoc(voc);
  elements.dayGlyph.textContent = planetaryDay.glyph;
  elements.dayName.textContent = planetaryDay.name;
  elements.hourGlyph.textContent = planetaryHour.glyph;
  elements.hourName.textContent = planetaryHour.name;
  elements.hourRange.textContent = formatRange(planetaryHour.startsAt, planetaryHour.endsAt);
}

function describeVoc(voc) {
  const range = voc.source === 'swisseph'
    ? formatRangeWithSeconds(voc.start, voc.end)
    : formatRange(voc.start, voc.end);
  const end = voc.source === 'swisseph' ? formatTimeWithSeconds(voc.end) : formatTime(voc.end);
  if (voc.isActive) return `сейчас, до ${end}`;
  if (voc.status === 'upcoming') return `с ${range}`;
  return `ближайший период: ${range}`;
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
