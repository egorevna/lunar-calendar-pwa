import {
  getLunarInfo,
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

const elements = {
  date: document.querySelector('[data-date]'),
  weekday: document.querySelector('[data-weekday]'),
  clock: document.querySelector('[data-clock]'),
  moon: document.querySelector('[data-moon]'),
  lunarDay: document.querySelector('[data-lunar-day]'),
  phase: document.querySelector('[data-phase]'),
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
  const voc = getVoidOfCourse(now);

  elements.date.textContent = formatDate(now);
  elements.weekday.textContent = formatWeekday(now);
  elements.clock.textContent = formatTime(now);
  elements.lunarDay.textContent = `${lunar.lunarDay}-й лунный день`;
  elements.phase.textContent = lunar.phaseName;
  elements.voc.textContent = describeVoc(voc);
  elements.dayGlyph.textContent = planetaryDay.glyph;
  elements.dayName.textContent = planetaryDay.name;
  elements.hourGlyph.textContent = planetaryHour.glyph;
  elements.hourName.textContent = planetaryHour.name;
  elements.hourRange.textContent = formatRange(planetaryHour.startsAt, planetaryHour.endsAt);

  const light = Math.round(lunar.illumination * 100);
  const direction = lunar.waxing ? 1 : -1;
  elements.moon.style.setProperty('--moon-light', `${light}%`);
  elements.moon.style.setProperty('--moon-direction', direction);
}

function describeVoc(voc) {
  const range = formatRange(voc.start, voc.end);
  if (voc.isActive) return `сейчас, до ${formatTime(voc.end)}`;
  if (voc.status === 'upcoming') return `с ${range}`;
  return `ближайший период: ${range}`;
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js');
  });
}

render();
window.setInterval(render, 30000);
