import { ZODIAC_SIGNS } from './astro.js';
import { PRECISE_EPHEMERIS } from './ephemeris-data.js';

const SIGN_BY_KEY = new Map(ZODIAC_SIGNS.map((sign) => [sign.key, sign]));
const MOSCOW_OFFSET_MS = 3 * 3600000;
const MAJOR_PHASE_NAMES = {
  new: 'Новолуние',
  full: 'Полнолуние',
};
const BRANCHES = [
  { key: 'zi', name: 'Крыса', glyph: '子' },
  { key: 'chou', name: 'Бык', glyph: '丑' },
  { key: 'yin', name: 'Тигр', glyph: '寅' },
  { key: 'mao', name: 'Кролик', glyph: '卯' },
  { key: 'chen', name: 'Дракон', glyph: '辰' },
  { key: 'si', name: 'Змея', glyph: '巳' },
  { key: 'wu', name: 'Лошадь', glyph: '午' },
  { key: 'wei', name: 'Коза', glyph: '未' },
  { key: 'shen', name: 'Обезьяна', glyph: '申' },
  { key: 'you', name: 'Петух', glyph: '酉' },
  { key: 'xu', name: 'Собака', glyph: '戌' },
  { key: 'hai', name: 'Свинья', glyph: '亥' },
];
const BRANCH_BY_KEY = new Map(BRANCHES.map((branch) => [branch.key, branch]));

export function getPreciseMoonSignInfo(date = new Date(), data = PRECISE_EPHEMERIS) {
  if (!covers(date, data)) return null;

  const ingresses = data.signIngresses
    .map((event) => ({ ...event, time: new Date(event.at) }))
    .sort((a, b) => a.time - b.time);
  const currentIndex = findLastIndex(ingresses, (event) => event.time <= date);
  const next = ingresses[currentIndex + 1];

  if (currentIndex < 0 || !next) return null;

  return {
    source: 'swisseph',
    current: SIGN_BY_KEY.get(ingresses[currentIndex].sign),
    next: SIGN_BY_KEY.get(next.sign),
    entersAt: next.time,
  };
}

export function getPreciseLunarDayInfo(date = new Date(), data = PRECISE_EPHEMERIS) {
  if (!covers(date, data) || !Array.isArray(data.lunarDays)) return null;

  const lunarDays = data.lunarDays
    .map((event) => ({ ...event, time: new Date(event.at) }))
    .sort((a, b) => a.time - b.time);
  const currentIndex = findLastIndex(lunarDays, (event) => event.time <= date);
  const next = lunarDays[currentIndex + 1];

  if (currentIndex < 0) return null;

  return {
    source: 'swisseph',
    lunarDay: lunarDays[currentIndex].day,
    startedAt: lunarDays[currentIndex].time,
    endsAt: next ? next.time : null,
  };
}

export function getPreciseSolarMonthBranch(date = new Date(), data = PRECISE_EPHEMERIS) {
  if (!covers(date, data) || !Array.isArray(data.solarMonths)) return null;

  const solarMonths = data.solarMonths
    .map((event) => ({ ...event, time: new Date(event.at) }))
    .sort((a, b) => a.time - b.time);
  const currentIndex = findLastIndex(solarMonths, (event) => event.time <= date);
  if (currentIndex < 0) return null;

  return BRANCH_BY_KEY.get(solarMonths[currentIndex].branch);
}

export function getPreciseMajorMoonPhase(date = new Date(), data = PRECISE_EPHEMERIS) {
  if (!covers(date, data) || !Array.isArray(data.moonPhases)) return null;

  const dayKey = getMoscowDateKey(date);
  const event = data.moonPhases
    .map((phase) => ({ ...phase, time: new Date(phase.at) }))
    .find((phase) => getMoscowDateKey(phase.time) === dayKey);

  if (!event || !MAJOR_PHASE_NAMES[event.type]) return null;

  return {
    source: 'swisseph',
    type: event.type,
    name: MAJOR_PHASE_NAMES[event.type],
    at: event.time,
  };
}

export function getNextPreciseMajorMoonPhase(date = new Date(), data = PRECISE_EPHEMERIS) {
  if (!covers(date, data) || !Array.isArray(data.moonPhases)) return null;

  const event = data.moonPhases
    .map((phase) => ({ ...phase, time: new Date(phase.at) }))
    .sort((a, b) => a.time - b.time)
    .find((phase) => phase.time > date && MAJOR_PHASE_NAMES[phase.type]);

  if (!event) return null;

  return {
    source: 'swisseph',
    type: event.type,
    name: MAJOR_PHASE_NAMES[event.type],
    at: event.time,
  };
}

export function getPreciseMoonAspectInfo(date = new Date(), data = PRECISE_EPHEMERIS) {
  if (!covers(date, data) || !Array.isArray(data.moonAspects)) return null;

  const aspects = data.moonAspects
    .map((event) => ({ ...event, at: new Date(event.at) }))
    .sort((a, b) => a.at - b.at);
  const previousIndex = findLastIndex(aspects, (event) => event.at <= date);
  const previous = aspects[previousIndex] ?? null;
  const next = aspects[previousIndex + 1] ?? aspects.find((event) => event.at > date) ?? null;

  if (!previous && !next) return null;

  return {
    source: 'swisseph',
    previous,
    next,
  };
}

export function getPreciseVoidOfCourse(date = new Date(), data = PRECISE_EPHEMERIS) {
  if (!covers(date, data)) return null;

  const intervals = data.voidOfCourse
    .map((event) => ({
      ...event,
      start: new Date(event.start),
      end: new Date(event.end),
    }))
    .sort((a, b) => a.start - b.start);
  const active = intervals.find((event) => event.start <= date && date < event.end);

  if (active) return toVoc(active, 'active', true);

  const upcoming = intervals.find((event) => event.start > date);
  if (upcoming) return toVoc(upcoming, 'upcoming', false);

  return null;
}

function toVoc(event, status, isActive) {
  return {
    source: 'swisseph',
    isActive,
    status,
    start: event.start,
    end: event.end,
    aspect: event.aspect,
    planet: event.planet,
  };
}

function covers(date, data) {
  if (!data.rangeStart || !data.rangeEnd) return false;
  return new Date(data.rangeStart) <= date && date < new Date(data.rangeEnd);
}

function getMoscowDateKey(date) {
  const shifted = new Date(date.getTime() + MOSCOW_OFFSET_MS);
  return shifted.toISOString().slice(0, 10);
}

function findLastIndex(items, predicate) {
  for (let index = items.length - 1; index >= 0; index -= 1) {
    if (predicate(items[index])) return index;
  }
  return -1;
}
